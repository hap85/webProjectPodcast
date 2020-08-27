'use strict';

//const Serie = require('./client/js/serie');
//const Episode = require('./client/js/episode');
const db = require('./db');
//const moment = require('moment');
//import Serie from './js/serie.js';

const createSerie = function(row){
    return ({id_serie: row.id_serie, id_user: row.id_user, title: row.title, description: row.description, image: row.image, categorie: row.categorie, author: row.author});
}
const createEpisode = function(row){
    return ({id_episode: row.id_episode, id_serie: row.id_serie, id_partner: row.id_partner, audio: row.audio, description: row.description, date: row.date, price: row.price});
}
const createUser = function(row){
    return ({id_user: row.id_user, email: row.email, password: row.password, creator: row.creator});
}
const createComment = function(row){
    return ({id_comment: row.id_comment, id_episode: row.id_episode, id_serie: row.id_serie, text: row.text, name_user: row.name_user});
}
exports.getSeries = function(){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM series';
        db.all(sql, [], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const series = rows.map((row) => (createSerie(row)));
                resolve(series);
            }
        });
    });
}
exports.getSeriesFromCategorie = function(categorie){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM series WHERE categorie=?';
        db.all(sql, [categorie], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const series = rows.map((row) =>  createSerie(row));
                resolve(series);
            }
        });
    });
}
exports.getSerie = function(idSerie){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM series WHERE id_serie=?';
        db.get(sql, [idSerie], (err, row) => {
            if(err){
                reject(err);
            }else{
                const serie = createSerie(row);
                resolve(row);
            }
        });
    });
}
exports.getSeriesFromUser = function(idUser){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM series WHERE id_user=?';
        db.all(sql, [idUser], (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        });
    });
}

exports.getEpisodeFromSerie = function(idSerie){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM episodes WHERE id_serie=? ORDER BY date desc';
        db.all(sql, [idSerie], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const episodes = rows.map((row) =>  createEpisode(row));
                resolve(episodes);
            }
        });
    });
}

exports.getEpisode = function(idSerie, idEpisode){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM episodes WHERE id_serie=? and id_episode=?';
        db.get(sql, [idSerie, idEpisode], (err, row) => {
            if(err){
                reject(err);
            }else{
                const episode = createEpisode(row);
                resolve(episode);
            }
        });
    });
}

exports.addSerie = function(serie){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO series(id_user, title, description, image, categorie, author) VALUES(?,?,?,?,?,?)';
        db.run(sql, [serie.id_user, serie.title, serie.description, serie.image, serie.categorie, serie.author], function (err) {
            if(err){
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
exports.addEpisodeToSerie = function(episode){
    return new Promise((resolve, reject) => {
        console.log(episode);
        const sql = 'INSERT INTO episodes(id_serie, id_partner, audio, description, date, price) VALUES(?,?,?,?,DATETIME(?),?)';
        db.run(sql, [episode.id_serie, episode.id_partner, episode.audio, episode.description, episode.date, episode.price], function (err) {
            if(err){
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
exports.updateSerie = function(id, newSerie) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE series SET title = ?, description = ?, image = ?, categorie = ? WHERE id_serie = ?';
        db.run(sql, [newSerie.title, newSerie.description, newSerie.image, newSerie.categorie, id], function (err) {
            if(err){
                reject(err);
            } else if (this.changes === 0)
                resolve({error: 'Serie not found.'});
            else {
                resolve();
        }
        })
    });
}
exports.updateEpisode = function(id, newEpisode) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE episodes SET audio = ?, description = ?, date = ?, price = ? WHERE id_episode = ?';
        db.run(sql, [newEpisode.audio, newEpisode.description, newEpisode.date, newEpisode.price, id], function (err) {
            if(err){
                reject(err);
            } else if (this.changes === 0)
                resolve({error: 'Episode not found.'});
            else {
                resolve();
        }
        })
    });
}

exports.deleteSerie = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM series WHERE id_serie = ?';
        db.run(sql, [id], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0){
                        resolve({error: 'Serie not found.'});
                    }
            else {
                const sql2 = 'DELETE FROM episodes WHERE id_serie=?';
                db.run(sql2, [id], function(err) {
                    if(err)
                        reject(err);
                    /*else if (this.changes === 0){
                        
                        resolve({error: 'Episodes not found.'});
                    }*/
                    else {
                       resolve();
                    }
                });
            }
        });
    });
}
exports.deleteEpisode = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM episodes WHERE id_episode = ?';
        db.run(sql, [id], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0){
                        resolve({error: 'Episode not found.'});
                    }
            else {
                resolve();
            }
        });
    });
}
exports.getUser = function(idUser){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id=?';
        db.get(sql, [idUser], (err, row) => {
            if(err){
                reject(err);
            }else{
                //const user = createUser(row);
                resolve(row);
            }
        });
    });
}
exports.addUser = function(user){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users(email, password, creator) VALUES(?,?,?)';
        db.run(sql, [user.email, user.password, user.creator], function (err) {
            if(err){
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
exports.deleteUser = function(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM users WHERE id = ?';
        db.run(sql, [id], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0){
                        resolve({error: 'User not found.'});
                    }
            else {
                resolve();
            }
        });
    });
}
exports.addFollowerToSerie = function(follower){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO followers(id_follower, id_serie) VALUES(?,?)';
        db.run(sql, [follower.id_follower, follower.id_serie], function (err) {
            if(err){
                reject(err);
            } else {
                resolve(follower);
            }
        });
    });
}
exports.deleteFollower = function(id_follower, id_serie) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM followers WHERE (id_follower = ? AND id_serie = ?)';
        db.run(sql, [id_follower, id_serie], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0){
                        resolve({error: 'Follow not found.'});
                    }
            else {
                resolve();
            }
        });
    });
}
exports.getFollower = function(id_follower, id_serie){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM followers WHERE (id_follower=? AND id_serie=?)';
        db.get(sql, [id_follower, id_serie], (err, row) => {
            if(err){
                reject(err);
            }else if (row === undefined){
                resolve({error: 'Follower not found.'});
            }
            else{
                resolve(row);
            }
        });
    });
}
exports.getFollowSeries = function(id_follower){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM followers WHERE (id_user=? AND id_serie=?)';
        db.all(sql, [id_user, id_serie], (err, row) => {
            if(err){
                reject(err);
            }else if (row === undefined){
                resolve({error: 'Follower not found.'});
            }
            else{
                resolve(row);
            }
        });
    });
}
exports.getFollowSeries = function(id_follower){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM(SELECT * FROM series INNER JOIN followers ON followers.id_serie = series.id_serie)WHERE id_follower=?';
        db.all(sql, [id_follower], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const series = rows.map((row) =>  createSerie(row));
                resolve(series);
            }
        });
    });
}
exports.addToFavorites = function(favorite){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO favorites(id_userf, id_episode) VALUES(?,?)';
        db.run(sql, [favorite.id_userf, favorite.id_episode], function (err) {
            if(err){
                reject(err);
            } else {
                resolve(favorite);
            }
        });
    });
}
exports.deleteFavorite = function(id_userf, id_episode) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM favorites WHERE (id_userf = ? AND id_episode = ?)';
        db.run(sql, [id_userf, id_episode], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0){
                        resolve({error: 'Favorite not found.'});
                    }
            else {
                resolve();
            }
        });
    });
}
exports.getFavorite = function(id_userf, id_episode){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM favorites WHERE (id_userf=? AND id_episode=?)';
        db.get(sql, [id_userf, id_episode], (err, row) => {
            if(err){
                reject(err);
            }else if (row === undefined){
                resolve({error: 'Favorite not found.'});
            }
            else{
                resolve(row);
            }
        });
    });
}
exports.getFavoritesFromUser = function(id_userf){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM(SELECT * FROM episodes INNER JOIN favorites ON favorites.id_episode = episodes.id_episode)WHERE id_userf=?';
        db.all(sql, [id_userf], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const episodes = rows.map((row) =>  createEpisode(row));
                resolve(episodes);
            }
        });
    });
}
exports.addEpisodeToShop = function(shop){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO shopping(id_user, id_episode) VALUES(?,?)';
        db.run(sql, [shop.id_user, shop.id_episode], function (err) {
            if(err){
                reject(err);
            } else {
                resolve(shop);
            }
        });
    });
}
exports.addComment = function(comment){
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO comments(id_episode, id_serie, text, name_user) VALUES(?,?,?,?)';
        db.run(sql, [comment.id_episode, comment.id_serie, comment.text, comment.name_user], function (err) {
            if(err){
                reject(err);
            } else {
                resolve(comment);
            }
        });
    });
}
exports.getCommentsFromEpisode = function(id_episode){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM comments WHERE id_episode=?' ;
        db.all(sql, [id_episode], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const comments = rows.map((row) =>  createComment(row));
                resolve(comments);
            }
        });
    });
}
exports.deleteComment = function(idComment) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM comments WHERE id_comment = ?';
        db.run(sql, [idComment], function(err) {
            if(err)
                reject(err);
            else if (this.changes === 0){
                        resolve({error: 'Comment not found.'});
                    }
            else {
                resolve();
            }
        });
    });
}
exports.getCommentFromId = function(id_comment){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM comments WHERE id_comment=?' ;
        db.get(sql, [id_comment], (err, row) => {
            if(err){
                reject(err);
            }else if (row === undefined){
                resolve({error: 'Comment not found.'});
            }
            else{
                resolve(row);
            }
        });
    });
}
exports.updateComment = function(id_comment, text) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE comments SET text = ? WHERE id_comment = ?';
        db.run(sql, [text, id_comment], function (err) {
            if(err){
                reject(err);
            } else if (this.changes === 0)
                resolve({error: 'Comment not found.'});
            else {
                resolve();
        }
        })
    });
}
exports.getShop = function(id_user, id_episode){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM shopping WHERE id_user=? AND id_episode=?' ;
        db.get(sql, [id_user, id_episode], (err, row) => {
            if(err){
                reject(err);
            }else if (row === undefined){
                resolve({error: 'Shop not found.'});
            }
            else{
                resolve(row);
            }
        });
    });
}
exports.getEpisodesByDescription = function(description){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM episodes WHERE description LIKE ?' ;
        db.all(sql, [description + '%'], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const episodes = rows.map((row) =>  createEpisode(row));
                resolve(episodes);
            }
        });
    });
}

exports.getSeriesByTitle = function(title){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM series WHERE title LIKE ?' ;
        db.all(sql, [title + '%'], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const series = rows.map((row) =>  createSerie(row));
                resolve(series);
            }
        });
    });
}

exports.getSeriesByCategorieAndTitle = function(categorie, title){
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM series WHERE categorie = ? AND title LIKE ?' ;
        db.all(sql, [categorie, title + '%'], (err, rows) => {
            if(err){
                reject(err);
            }else{
                const series = rows.map((row) =>  createSerie(row));
                resolve(series);
            }
        });
    });
}


