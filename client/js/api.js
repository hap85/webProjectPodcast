import Serie from './serie.js';
import User from './user.js';
import Episode from './episode.js';
import Follower from './follower.js';
import Favorite from './favorite.js';
import Comment from './comment.js';
import Shop from './shop.js';
//const Serie = require('./serie.js');

class Api{
    /**
     * Get the list of series
     */
    static getSeries = async () => {
        let response = await fetch('/api/series');
        const seriesJson = await response.json();
        if (response.ok) {
            return seriesJson.map((ex) => Serie.from(ex));
        } else {
            throw seriesJson;  // an object with the error coming from the server
        }
    }

    static getSeriesFromCategorie = async (categorie) => {
        let response = await fetch('/api/series/categorie/'+categorie);
        const seriesJson = await response.json();
        if (response.ok) {
            return seriesJson.map((ex) => Serie.from(ex));
        } else {
            throw seriesJson;  // an object with the error coming from the server
        }
    }
    static getSeriesFromUser = async (idUser) => {
        let response = await fetch('/api/series/users/' + idUser);
        const seriesJson = await response.json();
        if (response.ok) {
            return seriesJson.map((ex) => Serie.from(ex));
        } else {
            throw seriesJson;  // an object with the error coming from the server
        }
    }

    static getSerie = async (id_serie) => {
        let response = await fetch('/api/series/'+id_serie);
        const serieJson = await response.json();
        if (response.ok) {
            return Serie.from(serieJson);
        } else {
            throw serieJson;  // an object with the error coming from the server
        }
    }

    static getUser = async (id_user) => {
        let response = await fetch('/api/users/'+id_user);
        const userJson = await response.json();
        if (response.ok) {
            return User.from(userJson);
        } else {
            throw userJson;  // an object with the error coming from the server
        }
    }

    static getEpisode = async (id_serie, id_episode) => {
        let response = await fetch('/api/series/'+id_serie+'/episodes/'+id_episode);
        const episodeJson = await response.json();
        if (response.ok) {
            return Episode.from(episodeJson);
        } else {
            throw episodeJson;  // an object with the error coming from the server
        }
    }


    static getEpisodesFromSerie = async (id_serie) => {
        let response = await fetch('/api/series/'+id_serie+'/episodes');
        const episodesJson = await response.json();
        if (response.ok) {
            return episodesJson.map((ex) => Episode.from(ex));
        } else {
            throw episodesJson;
        }
    }
    static deleteEpisode = async (id_serie,id_episode) => {
        let response = await fetch(`/api/series/${id_serie}/episodes/${id_episode}`, {
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }
    static deleteSerie = async (id_serie) => {
        let response = await fetch(`/api/series/${id_serie}`, {
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }


    static updateEpisode = async (idSerie, episode) => {
        let response = await fetch('/api/series/'+idSerie+'/episodes/'+episode.id_episode, {
            method: 'PUT',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(episode),
        });
        if(response.ok) {
            console.log(JSON.stringify(episode));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static updateSerie = async (idSerie, newSerie) => {
        let response = await fetch('/api/series/'+idSerie, {
            method: 'PUT',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSerie),
        });
        if(response.ok) {
            console.log(JSON.stringify(newSerie));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }


    static addEpisode = async (idSerie, episode) => {
        let response = await fetch('/api/series/'+idSerie+'/episodes', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(episode),
        });
        if(response.ok) {
            console.log(JSON.stringify(episode));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static addSerie = async (serie) => {
        let response = await fetch('/api/series/', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(serie),
        });
        if(response.ok) {
            console.log(JSON.stringify(serie));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static addFollower = async (follower) => {
        let response = await fetch('/api/followers/'+ follower.id_serie + '/' + follower.id_follower, {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(follower),
        });
        if(response.ok) {
            console.log(JSON.stringify(follower));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static deleteFollower = async (id_follower, id_serie) => {
        let response = await fetch(`/api/followers/${id_serie}/${id_follower}`, {
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }
    static getFollower = async (id_follower, id_serie) => {
        let response = await fetch('/api/followers/'+id_serie+'/'+id_follower);
        const followerJson = await response.json();
        if (response.ok) {
            return Follower.from(followerJson);
        } else {
            throw followerJson;  // an object with the error coming from the server
        }
    }
    static getFollowSeries = async (id_follower) => {
        let response = await fetch('/api/series/following/'+id_follower);
        const seriesJson = await response.json();
        if (response.ok) {
            return seriesJson.map((ex) => Serie.from(ex));
        } else {
            throw seriesJson;  // an object with the error coming from the server
        }
    }
    static addToFavorites = async (favorite) => {
        let response = await fetch('/api/favorites/'+ favorite.id_episode + '/' + favorite.id_userf, {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(favorite),
        });
        if(response.ok) {
            console.log(JSON.stringify(favorite));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static deleteFavorite = async (id_userf, id_episode) => {
        let response = await fetch(`/api/favorites/${id_episode}/${id_userf}`, {
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }
    static getFavorite = async (id_userf, id_episode) => {
        let response = await fetch('/api/favorites/'+id_episode+'/'+id_userf);
        const favoriteJson = await response.json();
        if (response.ok) {
            return Favorite.from(favoriteJson);
        } else {
            throw favoriteJson;  // an object with the error coming from the server
        }
    }
    static getFavoritesFromUser = async (id_userf) => {
        let response = await fetch('/api/favorites/'+id_userf);
        const episodesJson = await response.json();
        if (response.ok) {
            return episodesJson.map((ex) => Episode.from(ex));
        } else {
            throw episodesJson;  // an object with the error coming from the server
        }
    }

    /**
     * Perform the login
     */
    static doLogin = async (username, password) => {
        let response = await fetch('/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        if(response.ok) {
            const user = await response.json();
            return user;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch(err) {
                throw err;
            }
        }
    }
    static getUserLogged = async () => {
        let response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
            
        });
        if(response.ok) {
            const user = await response.json();
            return user;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.message;
            }
            catch(err) {
                throw err;
            }
        }
    }

    static doLogout = async () => {
        await fetch('/api/sessions/current', { method: 'DELETE' });
    }

    static createUser = async (user) => {
        let response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if(response.ok) {
            console.log(JSON.stringify(user));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e) => errors += `${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static addEpisodeToShop = async (id_episode, paymentInformation) => {
        let response = await fetch('/api/shop/'+ id_episode, {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentInformation),
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static addComment = async (comment) => {
        let response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static getCommentsFromEpisode = async (id_episode) => {
        let response = await fetch('/api/comments/'+id_episode);
        const commentsJson = await response.json();
        if (response.ok) {
            return commentsJson.map((ex) => Comment.from(ex));
        } else {
            throw commentsJson;  // an object with the error coming from the server
        }
    }
    static deleteComment = async (id_comment) => {
        let response = await fetch(`/api/comments/${id_comment}`, {
            method: 'DELETE',
        });
        if(response.ok) {
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
            catch(err) {
                if(Array.isArray(err)) {
                    let errors = '';
                    err.forEach((e, i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error: ${errors}`;
                }
                else
                    throw 'Error: cannot parse server response';
            }
        }
    }
    static getCommentsFromId = async (id_comment) => {
        let response = await fetch('/api/comment/'+ id_comment);
        const commentJson = await response.json();
        if (response.ok) {
            console.log(commentJson);
            return Comment.from(commentJson);
        } else {
            throw commentJson;  // an object with the error coming from the server
        }
    }

    static updateComment = async (id_comment, comment) => {
        let response = await fetch('/api/comment/'+ id_comment, {
            method: 'PUT',
            headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment),
        });
        if(response.ok) {
            console.log(JSON.stringify(comment));
            return;
        }
        else {
            try {
                const errDetail = await response.json();
                throw errDetail.errors;
            }
        
            catch(err) {
                if(Array.isArray(err)){
                    let errors ='';
                    err.forEach((e,i) => errors += `${i}. ${e.msg} for '${e.param}', `);
                    throw `Error; ${errors}`;
                }
                else{console.log(response.json());
                    throw 'Error: cannot parse server response';
                }
            }
        }
    }
    static getShop = async (id_user, id_episode) => {
        let response = await fetch('/api/shop/'+ id_user + '/' + id_episode);
        const shopJson = await response.json();
        if (response.ok) {
            console.log(shopJson);
            return Shop.from(shopJson);
        } else {
            throw commentJson;  // an object with the error coming from the server
        }
    }
    static getEpisodesByDescription = async (description) => {
        let response = await fetch('/api/search/episodes/' + description);
        const episodesJson = await response.json();
        if (response.ok) {
            return episodesJson.map((ex) => Episode.from(ex));
        } else {
            throw episodesJson;  // an object with the error coming from the server
        }
    }

    static getSeriesByTitle = async (title, categorie) => {
        let url = "/api/search/series/"
        if(categorie && categorie != "TUTTI" ){
            url += categorie + "/";
        }
        let response = await fetch(url + title);
        const seriesJson = await response.json();
        if (response.ok) {
            return seriesJson.map((ex) => Serie.from(ex));
        } else {
            throw seriesJson;  // an object with the error coming from the server
        }
    }

    

}
export default Api;