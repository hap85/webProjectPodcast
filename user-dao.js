'use strict';

const db = require('./db.js');
const bcrypt = require('bcrypt');

exports.createUser = function (user) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users(username, email, password, creator) VALUES (?, ?, ?, ?)';
        // create the hash as an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        bcrypt.hash(user.password, 10).then((hash => {
            db.run(sql, [user.username, user.email, hash, user.creator], function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        }));
    });
}

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { id: row.id, username: row.username }
                resolve(user);
                
            }
        });
    });
};

exports.getUser = function (email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { id: row.id, username: row.username };
                let check = false;

                if (bcrypt.compareSync(password, row.password))
                    check = true;

                resolve({ user, check });
            }
        });
    });
};
exports.getUserByEmail = function (email) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username, email, creator FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = row;

                resolve({ user });
            }
        });
    });
};