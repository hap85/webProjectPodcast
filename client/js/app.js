import Api from './api.js';
import Serie from './serie.js';
import Episode from './episode.js';
import Comment from './comment.js';
import Filter from './filter.js';
import { createSerieRow, createListSeries } from './templates/serie.js';
import { createCommentRow, createListComments } from './templates/comment-template.js';
import { createHeader, createEpisodeRow, createListEpisodes, createListFavorites } from './templates/episodes-list.js';
import { createEpisodeTemplate } from './templates/episode-template.js';
import { createNavListener } from './templates/nav-listener-template.js';
import { createNavCreator } from './templates/nav-creator-template.js';
import { createLoginForm } from './templates/login-template.js';
import { createPaymentForm } from './templates/payment-template.js';
import { createRegistrationForm } from './templates/registration-template.js';
import { createHome } from './templates/index-template.js';
import { createAlert } from './templates/alert-template.js';
import page from '//unpkg.com/page/page.mjs';
import Follower from './follower.js';
import Favorite from './favorite.js';

class App {
    constructor(mainContainer, sidebarContainer, dropdownSearch) {
        this.mainContainer = mainContainer;
        this.sidebarContainer = sidebarContainer;
        this.dropdownSearch = dropdownSearch;
        this.user;
        this.logoutLink = document.querySelector('#logout');
        this.loginLink = document.querySelector('#login');
        this.userMenu = document.querySelector('#user-menu');
        this.searchForm = document.getElementById('search-form');
        
        // Check if user exist in localStorage
        if (localStorage.getItem('userId') && localStorage.getItem('username')) {
            this.user = {
                id: localStorage.getItem('userId'),
                username: localStorage.getItem('username')
            }
            this.userLogged(this.user);
        }
        const serieRadioButton = document.getElementById('serie-radio');
        const episodeRadioButton = document.getElementById('episode-radio');
        serieRadioButton.addEventListener('click', ()=>{
            document.getElementById('dropdown-search').classList.remove('invisible');
        });
        episodeRadioButton.addEventListener('click', ()=>{
            document.getElementById('dropdown-search').classList.add('invisible');
        });
        
 
        //routing
        page('/', () => {
            if (this.user !== undefined)
                this.mainContainer.innerHTML = createHome();
            else page.show('/index.html');
        });
        page('/login', () => {
            this.mainContainer.innerHTML = "";
            this.mainContainer.innerHTML = createLoginForm();
            document.getElementById("login-form").addEventListener('submit', this.onLoginSubmitted);
        });

        page('/shop/:id_serie/:id_episode', this.loadEpisode, (ctx) => {
            const episode = ctx.episode;
            this.mainContainer.innerHTML = "";
            this.mainContainer.innerHTML = createPaymentForm(episode.id_episode, episode.id_serie);
            document.getElementById("payment-form").addEventListener('submit', this.onPaymentSubmitted);
        });

        page('/registration', () => {
            this.mainContainer.innerHTML = "";
            this.mainContainer.innerHTML = createRegistrationForm();
            document.getElementById("registration-form").addEventListener('submit', this.onRegistrationSubmitted);
        });

        page('/logout', this.logout);

        page('/series', () => {
            this.showSeries();
        });

        page('/series/:id_serie/episodes', this.loadEpisodesFromSerie, this.showEpisodesList);

        page('/series/:id_serie/episodes/:id_episode', this.loadEpisode, this.showEpisode);

        page('/series/categorie/:categorie', this.loadSeriesFromCategorie, this.showSeriesFromCategorie);

        page('/my-series', this.loadSeriesFromUser, this.showSeriesFromUser);

        page('/follow-series', this.loadFollowSeries, this.showFollowSeries);

        page('/favorites', this.loadFavoritesFromUser, this.showFavorites);

        page('/search/episodes', this.loadEpisodesBySearch, this.showEpisodesBySearch);

        page();

        document.getElementById("episode-form").addEventListener('submit', this.onFormEpisodeSubmitted);
        document.getElementById("serie-form").addEventListener('submit', this.onFormSerieSubmitted);
        document.getElementById("comment-form").addEventListener('submit', this.onFormCommentSubmitted);
        this.filter = new Filter(sidebarContainer, dropdownSearch);
    }

    /**
    * Perform the logout
    */
    logout = async () => {
        await Api.doLogout();
        this.user = null;
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        document.querySelectorAll('.only-logged').forEach(el => {
            el.classList.add('invisible');
        });
        this.loginLink.classList.remove('invisible');
        page('/');
    }

    onRegistrationSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        const alertMessage = document.getElementById('message');
        if (form.checkValidity()) {
            try {
                const user = {
                    username: form.username.value,
                    email: form.email.value,
                    password: form.password.value,
                    creator: form.creator.checked
                }
                
                await Api.createUser(user);

                alertMessage.innerHTML = createAlert('success', `Utente registrato con successo`);

                // automatically remove the flash message after 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);
                this.onLoginSubmitted(event);


            } catch (error) {
                if (error) {
                    const errorMsg = error;
                    // add an alert message in DOM
                    alertMessage.innerHTML = createAlert('danger', errorMsg);
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                }
            }
        }
    }

    userLogged = async (user) => {
        document.querySelectorAll('.only-logged').forEach(el => {
            el.classList.remove('invisible');
        });
        this.loginLink.classList.add('invisible');
        const u = await Api.getUser(user.id);
        this.userMenu.innerHTML = "";
        if (u.creator == 0) {
            this.userMenu.insertAdjacentHTML('beforeend', createNavListener());
        } else {
            this.userMenu.insertAdjacentHTML('beforeend', createNavCreator());
        }
        this.userMenu.querySelectorAll('.user-link').forEach(link => {
            link.addEventListener('click', this.onUserLinkSelected);
        });
    }

    onLoginSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        const alertMessage = document.getElementById('message');

        if (form.checkValidity()) {
            try {
                this.user = await Api.doLogin(form.email.value, form.password.value);
                const user = this.user;
                // Save in localStorage
                localStorage.setItem('userId', this.user.id);
                localStorage.setItem('username', this.user.username);
                // Update page
                this.userLogged(user);
                // welcome the user
                alertMessage.innerHTML = createAlert('success', `Welcome ${user.username}!`);
                // automatically remove the flash message after 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);

                page.redirect('/');
                this.mainContainer.innerHTML = createHome();
            } catch (error) {
                if (error) {
                    const errorMsg = error;
                    // add an alert message in DOM
                    alertMessage.innerHTML = createAlert('danger', errorMsg);
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                }
            }
        }
    }
    loadFavoritesFromUser = async (ctx, next) => {
        const episodes = await Api.getFavoritesFromUser(this.user.id);
        ctx.episodes = episodes;
        next();
    }
    showFavorites = async (ctx) => {

        this.mainContainer.innerHTML = `<div id="header"><h1>Episodi preferiti</h1>
        <h5 class="text-success">Seleziona i tuoi episodi preferiti per visualizzarne i dettagli</h5></div>`;
        const ul = createListFavorites();

        this.mainContainer.insertAdjacentHTML('beforeend', ul);

        const listEpisodes = this.mainContainer.querySelector('#list-episodes');

        for (let episode of ctx.episodes) {
            let flagShop = 0;
            if(this.user){
                const shop = await Api.getShop(this.user.id, episode.id_episode)
                if(shop.id_episode!==undefined){
                    
                    flagShop=1;
                }
            }
            const episodeRow = createEpisodeRow(episode, flagShop);
            listEpisodes.insertAdjacentHTML('beforeend', episodeRow);
        }
        if (ctx.episodes.length == 0) {
            this.mainContainer.insertAdjacentHTML('beforeend', `<h5 class="mt-5 text-center">Al momento non hai nessun episodio preferito salvato</h5>`)
        }
        document.querySelectorAll('.favorites').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('header').innerHTML = "";
            })
        });
    }

    loadEpisodesBySearch = async (ctx, next) => {
        const urlParams = new URLSearchParams(window.location.search);
        const textSearch = urlParams.get('textSearch');
        const typeSearch = urlParams.get('serie');
        const categorieSearch = urlParams.get('categorie');
        
        const categorieSelect = document.getElementById('search-categorie');
        const textInput = document.getElementById('query');
        const serieRadio = document.getElementById('serie-radio');
        const episodeRadio = document.getElementById('episode-radio');
        this.seleziona(categorieSelect, categorieSearch);
        if(typeSearch == "1"){
            serieRadio.checked = true;
        }else{
            episodeRadio.checked = true;
        }
        if(serieRadio.checked){
            document.getElementById('dropdown-search').classList.remove('invisible');
        }else{
            document.getElementById('dropdown-search').classList.add('invisible');
        }
        textInput.value = textSearch;
        ctx.typeSearch = typeSearch;
        
        if(typeSearch=="0"){
            const episodes = await Api.getEpisodesByDescription(textSearch);
            ctx.episodes = episodes;
            next();
        }else{
            const series = await Api.getSeriesByTitle(textSearch, categorieSearch);
            ctx.series = series;
            next();
        }
    }

    showEpisodesBySearch = async (ctx) => {
        if(ctx.typeSearch == "0"){
            this.mainContainer.innerHTML = `<div id="header"><h1>Risultato Ricerca</h1>
            </div>`;
            const ul = createListFavorites();

            this.mainContainer.insertAdjacentHTML('beforeend', ul);

            const listEpisodes = this.mainContainer.querySelector('#list-episodes');

            for (let episode of ctx.episodes) {
                let flagShop = 0;
                if(this.user){
                    const shop = await Api.getShop(this.user.id, episode.id_episode)
                    if(shop.id_episode!==undefined){
                        flagShop=1;
                    }
                }
                const episodeRow = createEpisodeRow(episode, flagShop);
                listEpisodes.insertAdjacentHTML('beforeend', episodeRow);
            }
            if (ctx.episodes.length == 0) {
                this.mainContainer.insertAdjacentHTML('beforeend', `<h5 class="mt-5 text-center">Nessun episodio trovato</h5>`)
            }
            document.querySelectorAll('.favorites').forEach(link => {
                link.addEventListener('click', () => {
                    document.getElementById('header').innerHTML = "";
                })
            });
        }else{
            this.mainContainer.innerHTML = createListSeries();
            const listSeries = this.mainContainer.querySelector('#list');
                for (let serie of ctx.series) {
                    const serieRow = createSerieRow(serie);
                    listSeries.insertAdjacentHTML('beforeend', serieRow);
                }
            if (ctx.series.length == 0) {
                this.mainContainer.insertAdjacentHTML('beforeend', `<h5 class="mt-5 text-center">Nessuna serie trovata</h5>`)
            }
        }
    }

    loadFollowSeries = async (ctx, next) => {
        const series = await Api.getFollowSeries(this.user.id);
        ctx.series = series;
        next();
    }

    showFollowSeries = async (ctx) => {

        this.mainContainer.innerHTML = `<h1 id="header">Serie Seguite</h1>
        <h5 class="text-success">Qui puoi selezionare le serie che hai scelto di seguire</h5>`;

        this.mainContainer.insertAdjacentHTML('beforeend', createListSeries());
        const listSeries = this.mainContainer.querySelector('#list');
        for (let serie of ctx.series) {
            const serieRow = createSerieRow(serie);
            listSeries.insertAdjacentHTML('beforeend', serieRow);
        }
        if (ctx.series.length == 0) {
            this.mainContainer.insertAdjacentHTML('beforeend', `<h5 class="mt-5 text-center">Al momento non stai seguendo nessuna serie</h5>`)
        }
    }

    loadSeriesFromCategorie = async (ctx, next) => {

        const categorie = ctx.params.categorie;
        const series = await Api.getSeriesFromCategorie(categorie);
        ctx.series = series;
        next();
    }
    showSeriesFromCategorie = async (ctx) => {
        const title = ctx.params.categorie;
        this.mainContainer.innerHTML = `<h1>${title}</h1>`;

        this.mainContainer.insertAdjacentHTML('beforeend', createListSeries());
        const listSeries = this.mainContainer.querySelector('#list');
        for (let serie of ctx.series) {
            const serieRow = createSerieRow(serie);
            listSeries.insertAdjacentHTML('beforeend', serieRow);
        }
    }

    loadSeriesFromUser = async (ctx, next) => {
        const series = await Api.getSeriesFromUser(this.user.id);
        ctx.series = series;
        next();
    }

    showSeriesFromUser = async (ctx) => {
        this.mainContainer.innerHTML = `<h1>Modifica</h1>
        <h5 class="text-success">Qui puoi selezionare le serie che desideri modificare</h5>`;
        this.mainContainer.insertAdjacentHTML('beforeend', createListSeries());
        const listSeries = this.mainContainer.querySelector('#list');
        for (let serie of ctx.series) {
            const serieRow = createSerieRow(serie);
            listSeries.insertAdjacentHTML('beforeend', serieRow);
        }
    }

    loadEpisodesFromSerie = async (ctx, next) => {
        const id = ctx.params.id_serie;
        const serie = await Api.getSerie(id);
        const episodes = await Api.getEpisodesFromSerie(id);
        ctx.serie = serie;
        ctx.episodes = episodes;
        next();
    }

    loadEpisode = async (ctx, next) => {
        const idSerie = ctx.params.id_serie;
        const idEpisode = ctx.params.id_episode;
        const episode = await Api.getEpisode(idSerie, idEpisode);
        const serie = await Api.getSerie(idSerie);
        ctx.episode = episode;
        ctx.serie = serie;
        next();
    }

    showSeries = async () => {
        const series = await Api.getSeries();
        this.mainContainer.innerHTML = createListSeries();
        const listSeries = this.mainContainer.querySelector('#list');
        for (let serie of series) {
            const serieRow = createSerieRow(serie);
            listSeries.insertAdjacentHTML('beforeend', serieRow);
        }
    }
    seleziona(sel, valore) {
        for (var k = 0; k < sel.options.length; k++) {
            if (sel.options[k].value == valore) {
                sel.selectedIndex = k;
                break;
            }
        }
    }

    showEpisodesList = async (ctx) => {
        const serie = ctx.serie;
        const episodeForm = document.getElementById('episode-form');
        const serieForm = document.getElementById('serie-form');
        const episodes = ctx.episodes;

        this.mainContainer.innerHTML = createHeader(serie);
        let followBtn = document.getElementById("follow-btn");
        document.getElementById('delete-serie-btn').addEventListener('click', this.deleteSerie);
        if (this.user && serie.id_user === this.user.id) {
            followBtn.classList.add('invisible');
        }
        if (this.user) {
            const follower = await Api.getFollower(this.user.id, serie.id_serie);
            if (follower.id_follower !== undefined)
                followBtn.innerText = "Non seguire";
            else
                followBtn.innerText = "Segui";
        }
        const alertMessage = document.getElementById('message');
        followBtn.addEventListener('click', () => {
            if (followBtn.innerText === "Segui") {
                if (!this.user) {
                    alertMessage.innerHTML = createAlert('danger', "Per seguire una serie bisogna autenticarsi");
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                    page.redirect('/login');
                } else {
                    const follower = new Follower(this.user.id, serie.id_serie);
                    Api.addFollower(follower);
                    followBtn.innerText = "Non seguire";
                }
            } else {
                Api.deleteFollower(this.user.id, serie.id_serie);
                followBtn.innerText = "Segui";
            }
        });
        let editSerieBtn = document.getElementById("edit-serie-btn");
        editSerieBtn.addEventListener('click', () => {
            serieForm.elements['serie-form-id'].value = serie.id_serie;
            serieForm.elements['serie-description'].value = serie.description;
            serieForm.elements['serie-title'].value = serie.title;
            serieForm.elements['serie-img'].value = serie.image;

            const sel = serieForm.elements['serie-categorie'];
            this.seleziona(sel, serie.categorie);
        });
        const ul = createListEpisodes();

        this.mainContainer.insertAdjacentHTML('beforeend', ul);

        const listEpisodes = this.mainContainer.querySelector('#list-episodes');

        for (let episode of episodes) {
            let flagShop = 0;
            if(this.user){
                const shop = await Api.getShop(this.user.id, episode.id_episode)
                if(shop.id_episode!=undefined){
                    flagShop=1;
                }
            }
            const episodeRow = createEpisodeRow(episode, flagShop);
            listEpisodes.insertAdjacentHTML('beforeend', episodeRow);
            //insert control shop
            

            let deleteEpisodeBtn = document.getElementById("delete" + episode.id_episode)
            deleteEpisodeBtn.addEventListener('click', () => {
                let richiesta = window.confirm("Sei sicuro di voler cancellare l'episodio?");
                if (richiesta) {
                    Api.deleteEpisode(serie.id_serie, episode.id_episode)
                }
            });

            let editEpisodeBtn = document.getElementById("edit" + episode.id_episode);
            editEpisodeBtn.addEventListener('click', () => {

                episodeForm.elements['form-id'].value = episode.id_episode;
                episodeForm.elements['serie-id'].value = episode.id_serie;
                episodeForm.elements['input-description'].value = episode.description;
                episodeForm.elements['input-price'].value = episode.price;
                
                    episodeForm.elements['input-sponsor'].value = episode.id_partner;
                
                episodeForm.elements['input-audio'].value = episode.audio;
            });
        }
        if (this.user && this.user.id == serie.id_user) {
            document.querySelectorAll('.user-btn').forEach(link => {
                link.classList.remove('invisible');
            });

        }
        document.getElementById('episode-form').addEventListener('click', () => {
            episodeForm.elements['serie-id'].value = serie.id_serie;
        });
        $('#episodeModal').on('hidden.bs.modal', () => {
            episodeForm.reset();
            console.log("prova chiusura modale")
        });
        $('#editSerieModal').on('hidden.bs.modal', () => {
            serieForm.reset();
            console.log("prova chiusura modale")
        });
    }

    showEpisode = async (ctx) => {
        const episode = ctx.episode;
        const serie = ctx.serie;
        let EpContainer = document.getElementById('episodes-container');
        let flagShop = 0;
        if(this.user){
            const shop = await Api.getShop(this.user.id, episode.id_episode)
            if(shop.id_episode!==undefined || this.user.id==serie.id_user){
                flagShop=1;
            }
        }
        EpContainer.innerHTML = createEpisodeTemplate(episode, flagShop);
        const favoriteBtn = document.getElementById('add-favorite');
        const alertMessage = document.getElementById('message');
        if (this.user) {
            const favorite = await Api.getFavorite(this.user.id, episode.id_episode);
            if (favorite.id_userf == this.user.id) {
                favoriteBtn.src = "https://img.icons8.com/color/40/000000/filled-star.png";
                document.getElementById('text-fav').innerText = "Rimuovi dai preferiti";
                favoriteBtn.setAttribute("data-id", "1");
            } else {
                favoriteBtn.src = "https://img.icons8.com/color/40/000000/star--v1.png";
                document.getElementById('text-fav').innerText = "Aggiungi ai preferiti";
                favoriteBtn.setAttribute("data-id", "0");
            }
        }
        favoriteBtn.addEventListener('click', (event) => {
            if (!this.user) {
                alertMessage.innerHTML = createAlert('danger', "Per aggiungere un episodio ai preferiti bisogna autenticarsi");
                // automatically remove the flash message after 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);
                page.redirect('/login');
            } else {
                if (event.target.dataset.id === "0") {
                    const favorite = new Favorite(this.user.id, episode.id_episode);
                    Api.addToFavorites(favorite);
                    favoriteBtn.src = "https://img.icons8.com/color/40/000000/filled-star.png";
                    document.getElementById('text-fav').innerText = "Rimuovi dai preferiti";
                    event.target.dataset.id = "1";
                }
                else {
                    Api.deleteFavorite(this.user.id, episode.id_episode);
                    favoriteBtn.src = "https://img.icons8.com/color/40/000000/star--v1.png";
                    document.getElementById('text-fav').innerText = "Aggiungi ai preferiti";
                    event.target.dataset.id = "0";
                }
            }
        });
        if (episode.price != 0 && flagShop !='1') {
            const payButton = document.getElementById('pay-button');
            payButton.addEventListener('click', (event) => {
                if (!this.user) {
                    alertMessage.innerHTML = createAlert('danger', "Per acquistare un episodio bisogna autenticarsi");
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                    page.redirect('/login');
                }
                else {
                    this.episode = episode;
                    page.redirect('/shop/' + episode.id_serie + '/' + episode.id_episode);
                }
            });
        }
        const comments = await Api.getCommentsFromEpisode(episode.id_episode);
        const ulComments = createListComments();
        this.mainContainer.insertAdjacentHTML('beforeend', ulComments);
        const listComments = this.mainContainer.querySelector('#list-comments');
            if (listComments.innerHTML !== "") {
                listComments.innerHTML = "";
            }
        if (comments.length != 0) {
            let userCommentsExist = false;
            for (let comment of comments) {
                let flag = 0;
                if (this.user && this.user.username == comment.name_user) {
                    flag = 1;
                    userCommentsExist = true;
                }
                const commentRow = createCommentRow(comment, flag);
                listComments.insertAdjacentHTML('beforeend', commentRow);
            }
            if (userCommentsExist) {
                const deleteComments = document.getElementsByClassName('delete-comment');
                const editComments = document.getElementsByClassName('edit-comment');
                for (let deletecomment of deleteComments) {
                    deletecomment.addEventListener('click', () => {
                        const el = event.target;
                        let richiesta = window.confirm("Sei sicuro di voler cancellare il commento?");
                        if (richiesta) {
                            Api.deleteComment(el.dataset.id);
                            alertMessage.innerHTML = createAlert('success', "Commento cancellato con successo");
                            // automatically remove the flash message after 3 sec
                            setTimeout(() => {
                                alertMessage.innerHTML = '';
                            }, 2000);
                            page.redirect('/series/' + episode.id_serie + '/episodes/' + episode.id_episode);
                        }
                    });
                }
                for (let editComment of editComments) {
                    editComment.addEventListener('click', this.onEditCommentClick);
                }
            }


        }

        let textComment = document.getElementById("comment");
        document.getElementById('submit-comment').addEventListener('click', () => {
            if (!this.user) {
                alertMessage.innerHTML = createAlert('danger', "Per poter commentare un episodio è necessario autenticarsi");
                // automatically remove the flash message after 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);
                page.redirect('/login');
            } else {

                const comment = new Comment(null, episode.id_episode, episode.id_serie, textComment.value, this.user.username);
                if (comment.text == "") {
                    alertMessage.innerHTML = createAlert('danger', "Inserire testo per commentare un episodio");
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                } else {
                    Api.addComment(comment);
                    alertMessage.innerHTML = createAlert('success', "Commento inserito con successo");
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                    page.redirect('/series/' + episode.id_serie + '/episodes/' + episode.id_episode);
                }
            }
        });

    }
    onEditCommentClick = async (event) => {
        event.preventDefault();
        const commentForm = document.getElementById('comment-form');
        const el = event.target;
        const comment = await Api.getCommentsFromId(el.dataset.id);
        commentForm.elements['input-comment'].value = comment.text;
        commentForm.elements['form-comment-id'].value = comment.id_comment;
    }
    onFormEpisodeSubmitted = (event) => {
        event.preventDefault();
        const episodeForm = document.getElementById('episode-form');
        const id_episode = episodeForm.elements['form-id'].value;
        const id_serie = episodeForm.elements['serie-id'].value;
        const description = episodeForm.elements['input-description'].value;
        let price = 0;
        if (episodeForm.elements['input-price'].value === "")
            price = 0;
        else
            price = episodeForm.elements['input-price'].value;
        const audio = episodeForm.elements['input-audio'].value;
        const sponsor = episodeForm.elements['input-sponsor'].value;
        if (id_episode && id_episode !== "") {
            const ep = new Episode(id_episode, id_serie, sponsor, audio, description, moment().format(), price);
            Api.updateEpisode(id_serie, ep)
                .then(() => {
                    episodeForm.reset();
                    document.getElementById('close-modal-episode').click();
                    page.redirect('/series/' + id_serie + '/episodes');
                }).catch((err) => {
                    console.log(err);
                });
        } else {
            // form id null ----> add episode
            const newEp = new Episode(null, id_serie, sponsor, audio, description, moment().format(), price);
            Api.addEpisode(id_serie, newEp)
                .then(() => {
                    episodeForm.reset();
                    document.getElementById('close-modal-episode').click();
                    page.redirect('/series/' + id_serie + '/episodes');
                }).catch((err) => {
                    console.log(err);
                });
        }

    }
    onFormSerieSubmitted = (event) => {
        event.preventDefault();
        const serieForm = document.getElementById('serie-form');

        const id_serie = serieForm.elements['serie-form-id'].value;

        const title = serieForm.elements['serie-title'].value;
        const description = serieForm.elements['serie-description'].value;
        const x = document.getElementById("serie-categorie").selectedIndex;
        const y = document.getElementById("serie-categorie").options;
        const categorie = y[x].text;
        const img = serieForm.elements['serie-img'].value;
        if (id_serie && id_serie !== "") {
            const serie = Api.getSerie(id_serie);
            const newSerie = new Serie(id_serie, serie.id_user, title, description, img, categorie, serie.author);
            Api.updateSerie(id_serie, newSerie)
                .then(() => {
                    serieForm.reset();
                    document.getElementById('close-modal-serie').click();
                    page.redirect('/series/' + id_serie + '/episodes');
                }).catch((err) => {
                    console.log(err);
                });
        } else {
            // form id null ----> add serie
            const newSerie = new Serie(null, this.user.id, title, description, img, categorie, this.user.username);
            Api.addSerie(newSerie)
                .then(() => {
                    serieForm.reset();
                    document.getElementById('close-modal-serie').click();
                    const message = document.getElementById('message');
                    message.innerHTML = createAlert('success', `Serie dal titolo ${newSerie.title} aggiunta con successo!`);
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        message.innerHTML = '';
                    }, 4000);
                    page.redirect('/my-series');
                }).catch((err) => {
                    console.log(err);
                });
        }

    }

    onFormCommentSubmitted = async (event) => {
        event.preventDefault();
        const commentForm = document.getElementById('comment-form');
        const idComment = commentForm.elements['form-comment-id'].value;
        const idSerie = commentForm.elements['form-comment-id_serie'].value;
        const newText = commentForm.elements['input-comment'].value;
        const comment = await Api.getCommentsFromId(idComment);
        const newComment = new Comment(comment.id_comment, comment.id_episode, comment.id_serie, newText, comment.name_user);
        Api.updateComment(idComment, newComment)
            .then(() => {
                commentForm.reset();
                document.getElementById('close-modal-comment').click();
                const message = document.getElementById('message');
                    message.innerHTML = createAlert('success', `Commento modificato con successo!`);
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        message.innerHTML = '';
                    }, 4000);
                    page.redirect('/series/' + comment.id_serie + '/episodes/' + comment.id_episode);
            }).catch((err) => {
                console.log(err);
            });
    }

    deleteSerie(event) {
        const el = event.target;
        let richiesta = window.confirm("Sei sicuro di voler cancellare la serie?");
        if (richiesta) {
            Api.deleteSerie(el.dataset.id);

        }
        const message = document.getElementById('message');
        message.innerHTML = createAlert('success', `Serie eliminata con successo!`);
        // automatically remove the flash message after 3 sec
        setTimeout(() => {
            message.innerHTML = '';
        }, 4000);
        page.redirect('/my-series');
    }

    onUserLinkSelected(event) {
        event.preventDefault();
        // the HTML element that was clicked

        const el = event.target;

        // the 'data-id' property of that element
        const filterTitle = el.innerText;
        switch (filterTitle) {
            case "Serie seguite": {
                page.redirect('/follow-series');
            }
                break;
            case "Modifica serie":
                page.redirect('/my-series');
                break;
            case "Episodi preferiti":
                page.redirect('/favorites/');
            default:
        }
        // removing and adding the 'active' class
        document.getElementById('left-sidebar').querySelector('a.active').classList.remove('active');
        el.classList.add('active');
    }

    getParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    

    onPaymentSubmitted = async (event) => {
        event.preventDefault();
        const form = event.target;
        const alertMessage = document.getElementById('message');
        if (form.checkValidity()) {
            try {

                const id_episode = form.dataset.id;
                const id_serie = form.idSerie.dataset.id;
                const paymentInformation = {
                    name: form.name.value,
                    surname: form.surname.value,
                    creditCard: form.creditCard.value,
                    cvc: form.cvc.value
                };
                await Api.addEpisodeToShop(id_episode, paymentInformation);

                alertMessage.innerHTML = createAlert('success', `Episodio acquistato`);
                // automatically remove the flash message after 3 sec
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, 3000);
                page.redirect('/series/' + id_serie + '/episodes/');
            } catch (error) {
                if (error) {
                    const errorMsg = error;
                    // add an alert message in DOM
                    alertMessage.innerHTML = createAlert('danger', errorMsg);
                    // automatically remove the flash message after 3 sec
                    setTimeout(() => {
                        alertMessage.innerHTML = '';
                    }, 3000);
                }
            }
        }
    }

}

export default App;