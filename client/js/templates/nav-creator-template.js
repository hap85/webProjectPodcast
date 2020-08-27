"use strict;"

function createNavCreator() {
    return `<h6 class="border-bottom border-gray p-3 mb-0"><strong>Il mio profilo</strong></h6>
            <div class="list-group list-group-flush" id="projects">
            <!-- JavaScript will fill this -->
                <a href="#" data-toggle="modal" data-target="#editSerieModal"
                    class="user-link list-group-item list-group-item-action">Crea serie</a>
                <a href="/my-series" id="" data-id="edit"
                    class="user-link list-group-item list-group-item-action">Modifica
                    serie</a>
                <a href="/follow-serie" id="" data-id="follow-serie"
                    class="user-link list-group-item list-group-item-action">Serie
                    seguite</a>
                <a href="#" id="" data-id="favorites"
                    class="user-link list-group-item list-group-item-action">Episodi
                    preferiti</a>
            </div>`
}
export { createNavCreator };