// imports
const express = require('express');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const dao = require('./dao.js');
const userDao = require('./user-dao.js');
const path = require('path');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');

passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then(({ user, check }) => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!check) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    userDao.getUserById(id).then(user => {
        done(null, user);
    });
});

// init express
const app = express();
const port = 3000;

//set-up logging
app.use(morgan('tiny'));

// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => { 
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ "statusCode": 401, "message": "not authenticated" });
}

//process body content as JSON
app.use(express.json());

//set-up the client component as a static website
app.use(express.static('client'));

// set up the session
app.use(session({
    //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

//-------REST API-------------

//-------REST API USERS-------------

// POST /users
// registration
app.post('/api/users', [
    body('username').notEmpty(),
    body('email').notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty(),
    body('password').isLength({ min: 8 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        // create a user object from the signup form
    }
    const user = {
        username:req.body.username.trim(),
        email: req.body.email.toLowerCase().trim(),
        password: req.body.password,
        creator: req.body.creator
    };
    userDao.getUserByEmail(user.email)
        //.then(res.status(422).json({ errors: [{msg: 'User already registered', param: user.email}] }));
        .then((response) => {
            if (response.error) {
                //user not found
                userDao.createUser(user)
                    .then((result) => res.status(201).header('Location', `/users/${result}`).end())
                    .catch((err) => res.status(503).json({ error: 'Database error during the signup' }));
            } else {
                //use alredy registered
                res.status(422).json({ errors: [{ msg: 'User already registered', param: user.email }] });
            }
        })
});

// POST /sessions 
// Login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, function (err) {
            if (err) { return next(err); }
            // req.user contains the authenticated user
            return res.json(req.user);
        });
    })(req, res, next);
});
app.post('/api/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user);
  });


// DELETE /sessions/current 
// Logout
app.delete('/api/sessions/current', function (req, res) {
    req.logout();
    res.end();
});

//----------REST API PODCASTS------------------

//GET /series
app.get('/api/series', (req, res) => {
    dao.getSeries()
        .then((series) => res.json(series))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
// GET /series/:categorie
app.get('/api/series/categorie/:categorie', (req, res) => {
    dao.getSeriesFromCategorie(req.params.categorie)
        .then((series) => res.json(series))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
// GET /series/:id_serie
app.get('/api/series/:id_serie', (req, res) => {
    dao.getSerie(req.params.id_serie)
        .then((serie) => {
            return res.json(serie);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// GET /series/:id_serie/episodes
app.get('/api/series/:id_serie/episodes', (req, res) => {
    dao.getEpisodeFromSerie(req.params.id_serie)
        .then((episodes) => {
            return res.json(episodes);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

// GET /series/:id_serie/episodes/:id_episode
app.get('/api/series/:id_serie/episodes/:id_episode', (req, res) => {
    dao.getEpisode(req.params.id_serie, req.params.id_episode)
        .then((episode) => {
            return res.json(episode);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
//GET /series/user/id_user
app.get('/api/series/users/:id_user', (req,res) => {
    dao.getSeriesFromUser(req.params.id_user)
        .then((series) => {
            return res.json(series);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

//POST /series params(title, description, image, categorie, author)
app.post('/api/series', [
    body('description').notEmpty(),
    body('title').notEmpty(),
    body('image').notEmpty(),
    body('categorie').notEmpty(),
], isLoggedIn,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const serie = req.body;
    dao.addSerie(serie)
        .then((id) => res.status(201).header('Location', `/series/${id}`).end())
        .catch((err) => res.status(503).json({ error: err }));
})
// POST /series/:id_serie params(idPartner, audio, description, date, price)
app.post('/api/series/:id_serie/episodes', [
    body('audio').notEmpty(),
    body('description').notEmpty(),
    body('date').notEmpty(),

], isLoggedIn,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const episode = {
        id_serie: req.params.id_serie,
        id_partner: req.body.id_partner,
        audio: req.body.audio,
        description: req.body.description,
        date: req.body.date,
        price: req.body.price
    }
    dao.addEpisodeToSerie(episode)
        .then((id) => res.status(201).header('Location', `/series/${episode.id_serie}/episodes/${id}`).end())
        .catch((err) => res.status(503).json({ error: err }));
})
// PUT /series/:id_serie
app.put('/api/series/:id_serie', [
    body('description').notEmpty(),
    body('title').notEmpty(),
    body('image').notEmpty(),
    body('categorie').notEmpty(),
], isLoggedIn,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const serie = req.body;
    dao.updateSerie(req.params.id_serie, serie)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(200).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

// PUT /series/:id_serie/episodes/:id_episode
app.put('/api/series/:id_serie/episodes/:id_episode', [
    body('audio').notEmpty(),
    body('description').notEmpty(),
    body('date').notEmpty(),
    body('price').notEmpty(),
], isLoggedIn,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const episode = req.body;
    dao.updateEpisode(req.params.id_episode, episode)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(200).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});
//DELETE /series/:id_serie
app.delete('/api/series/:id_serie', isLoggedIn,(req, res) => {
    dao.deleteSerie(req.params.id_serie)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});
//DELETE /series/:id_serie/episodes/:id_episode
app.delete('/api/series/:id_serie/episodes/:id_episode', isLoggedIn,(req, res) => {
    dao.deleteEpisode(req.params.id_episode)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});

//DELETE /user/:id
app.delete('/api/users/:id', isLoggedIn,(req, res) => {
    dao.deleteUser(req.params.id)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});
// ---------API REST for user--------------------
// GET /users/:id_user
app.get('/api/users/:id_user', (req, res) => {
    dao.getUser(req.params.id_user)
        .then((user) => {
            return res.json(user);
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
app.post('/api/followers/:id_serie/:id_follower', isLoggedIn,(req, res) =>{
    const follower = {
        id_follower: req.params.id_follower,
        id_serie: req.body.id_serie
    }
    console.log(follower);
    dao.addFollowerToSerie(follower)
        .then((follower) => res.status(201).header('Location', `/follower/${follower.id_serie}/${follower.id_serie}`).end())
        .catch((err) => res.status(503).json({ error: err }));
});
app.delete('/api/followers/:id_serie/:id_follower', isLoggedIn,(req, res) => {
    dao.deleteFollower(req.params.id_follower, req.params.id_serie)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});
// GET /followers/:id_serie/:id_follower
app.get('/api/followers/:id_serie/:id_follower', isLoggedIn,(req, res) => {
    dao.getFollower(req.params.id_follower, req.params.id_serie)
        .then((follower) => res.json(follower))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
app.get('/api/series/following/:id_follower', isLoggedIn,(req, res) => {
    dao.getFollowSeries(req.params.id_follower)
        .then((follower) => res.json(follower))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
app.post('/api/favorites/:id_episode/:id_userf', isLoggedIn,(req, res) =>{
    const favorite = {
        id_userf: req.params.id_userf,
        id_episode: req.body.id_episode
    }
    dao.addToFavorites(favorite)
        .then((favorite) => res.status(201).header('Location', `/favorite/${favorite.id_episode}/${favorite.id_userf}`).end())
        .catch((err) => res.status(503).json({ error: err }));
});
app.delete('/api/favorites/:id_episode/:id_userf', isLoggedIn,(req, res) => {
    dao.deleteFavorite(req.params.id_userf, req.params.id_episode)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});
app.get('/api/favorites/:id_episode/:id_userf', isLoggedIn,(req, res) => {
    dao.getFavorite(req.params.id_userf, req.params.id_episode)
        .then((favorite) => res.json(favorite))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
app.get('/api/favorites/:id_userf', isLoggedIn,(req, res) => {
    dao.getFavoritesFromUser(req.params.id_userf)
        .then((favorites) => res.json(favorites))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.post('/api/shop/:id_episode', [
    body('name').notEmpty(),
    body('surname').notEmpty(),
    body('creditCard').notEmpty(),
    body('creditCard').isNumeric(),
    body('creditCard').isLength(16),
    body('cvc').notEmpty(),
    body('cvc').isNumeric(),
    body('cvc').isLength(3),
], isLoggedIn,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    console.log(req);
    const shop = {
        id_user: req.user.id,
        id_episode: req.params.id_episode
    }
    dao.addEpisodeToShop(shop)
        .then(() => res.status(201).end())
        .catch((err) => res.status(503).json({ error: err }));
})

app.post('/api/comments', [
    body('text').notEmpty(),
], isLoggedIn, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const comment = req.body;
    dao.addComment(comment)
        .then(() => res.status(201).end())
        .catch((err) => res.status(503).json({ error: err }));
});
app.get('/api/comments/:id_episode', (req, res) => {
    dao.getCommentsFromEpisode(req.params.id_episode)
        .then((comments) => res.json(comments))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
app.get('/api/comment/:id_comment', (req, res) => {
    dao.getCommentFromId(req.params.id_comment)
        .then((comment) => res.json(comment))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
//DELETE /comments/:id_user/:id_episode
app.delete('/api/comments/:id_comment', isLoggedIn, (req, res) => {
    dao.deleteComment(req.params.id_comment)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(204).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});
// PUT /series/:id_serie
app.put('/api/comment/:id_comment', [
    body('text').notEmpty(),
], isLoggedIn,(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const comment = req.body;
    dao.updateComment(req.params.id_comment, comment.text)
        .then((result) => {
            if (result)
                res.status(404).json(result);
            else
                res.status(200).end();
        })
        .catch((err) => res.status(500).json({
            errors: [{ 'param': 'Server', 'msg': err }],
        }));
});
app.get('/api/shop/:id_user/:id_episode', (req, res) => {
    dao.getShop(req.params.id_user, req.params.id_episode)
        .then((shop) => res.json(shop))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});
app.get('/api/search/episodes/:description', (req, res) => {
    dao.getEpisodesByDescription(req.params.description)
        .then((episodes) => res.json(episodes))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.get('/api/search/series/:title', (req, res) => {
    dao.getSeriesByTitle(req.params.title)
        .then((series) => res.json(series))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});

app.get('/api/search/series/:categorie/:title', (req, res) => {
    dao.getSeriesByCategorieAndTitle(req.params.categorie, req.params.title)
        .then((series) => res.json(series))
        .catch((err) => {
            res.status(500).json({
                errors: [{ 'msg': err }],
            });
        });
});


// All the other requests will be served by our client-side app
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'client/index.html'));
});



// activate server
app.listen(port, () => console.log('Server ready'));
