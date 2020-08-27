'use strict';

function createHeader(serie) {
    return `<div class="card mb-3 mx-auto" style="max-width: 540px;" id="container-serie-detail">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                            <img src="/js/img/${serie.image}" class="card-img-top"  alt="...">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${serie.title}</h5>
                                <p class="card-text">${serie.description}</p>
                                <div class="d-flex justify-content-between">
                                    <p class="card-text"><small class="text-muted">Creato da ${serie.author}</small></p>
                                    
                                    
                                    <button type="button"  class="btn btn-primary" id="follow-btn" data-toggle="button">Segui</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <button type="button" class="btn btn-warning invisible user-btn mx-auto mb-2" data-toggle="modal" data-target="#editSerieModal" id="edit-serie-btn">Modifica</button>
                        <button type="button" class="btn btn-danger invisible user-btn mx-auto mb-2" data-id="${serie.id_serie}" id="delete-serie-btn">Elimina</button>
                    </div>
            </div>`;
}
function createListEpisodes() {
    return `<div class="container mx-auto" id="episodes-container">
            <div class=row container>
                <h1 class="title-list">Episodi</h1>
                <button type="button" class="user-btn invisible ml-5 mt-2 btn btn-warning col-2 mb-3 user-btn" data-toggle="modal" data-target="#episodeModal">Aggiungi episodio</button>
            </div>
            <p>Seleziona l'episodio per visualizzarne i dettagli</p>
            <ul class="mt-4 list-group list-group-flush" id="list-episodes"></ul>`;
}
function createListFavorites() {
    return `<div class="container ml-2" id="episodes-container">
            <ul class="ml-2 list-group list-group-flush" id="list-episodes"></ul>`;
}
function createEpisodeRow(episode, flagShop) {
    return `<div class="row">
                <a class="invisible user-btn" href="">
                    <img src="/js/svg/delete.svg" height="20" width="20" class="mt-2" url="api/series/1/episodes/1" id="delete${episode.id_episode}" title="Cancella ${episode.description}">
                </a>
                <a href="" class="invisible user-btn" data-toggle="modal" data-target="#episodeModal">
                    <img src="/js/svg/edit.svg" height="20" width="20" class="mt-2 ml-3" id="edit${episode.id_episode}" title="Modifica ${episode.description}">
                </a>
            </div>
            <div class="favorites list-group-item">
                <li class="row d-flex">
                    <div class="pl-0 col-6 text-break text-left">${episode.description}</div>
                    <div class="col-3 text-right">${moment(episode.date).format('DD-MM-YYYY')}</div>
                    <div class="col text-right" id="price">${episode.price == '0' ? `Gratis ` : episode.price + ` €`}</div>
                    <span class="col text-right text-success">${flagShop != '0' ? `Acquistato ` : ``}</span>                           
                    <a href="/series/${episode.id_serie}/episodes/${episode.id_episode}" class="ml-5 btn btn-success">Visualizza</a>
                    
                    
                </li>
            </div>`
}
export {createEpisodeRow, createListEpisodes, createHeader, createListFavorites};