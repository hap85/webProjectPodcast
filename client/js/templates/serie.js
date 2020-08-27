'use strict';

function createListSeries() {
    return`<ul class="list-unstyled" id="list">
        </ul>`;
}

function createSerieRow(serie){
    return `<a href="/series/${serie.id_serie}/episodes" class="list-group-item list-group-item-action">
    <li class="media my-4">
        <img src="/js/img/${serie.image}" height="100" weight="100" class="mr-3" alt="...">
        <div class="media-body">
            <h5 class="mt-0 mb-1">${serie.title}</h5>
            ${serie.description}
        </div>
        <div class="card-text"><small class="text-muted">Creato da ${serie.author}</small></div>
    </li>
</a>`;
}

export {createSerieRow, createListSeries};