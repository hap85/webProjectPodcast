"use strict;"

function createNavListener() {
return `<h6 class="border-bottom border-gray p-3 mb-0"><strong>Il mio profilo</strong></h6>
                    <div class="list-group list-group-flush" id="projects">
                        <a href="/follow-serie" id="" data-id="serie-follow"
                            class="user-link list-group-item list-group-item-action">Serie
                            seguite</a>
                        <a href="#" id="" data-id="favorites"
                            class="user-link list-group-item list-group-item-action">Episodi
                            preferiti</a>
                    </div>`
}
export { createNavListener };