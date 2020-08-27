'use strict';

function createEpisodeTemplate(episode, flagShop){
    return `<div class="container row">
                <div class="text-break pl-0 col-6 text-left">
                    <h3>${episode.description}</h3>
                    <div class="row">    
                    <img href="" class="mt-2 btn" data-id="" id="add-favorite" src="https://img.icons8.com/color/40/000000/star--v1.png"/>
                    <div id="text-fav" class="mt-4">Aggiungi ai preferiti</div>
                    </div>
                </div>
                <div class="col-3 text-right my-auto" id="play-button">
                ${episode.price == '0' || flagShop == '1'? 
                    `<button type="button" class="pb-2 btn">
                        <audio controls>
                            <source src="/js/audio/${episode.audio}" type="audio/mp3">
                        </audio>
                        
                    </button>` : 
                    `Prezzo ` + episode.price + ` € <button class="ml-5 btn btn-success" data-id="${episode.id_episode}" id="pay-button">Acquista</button>`}
                    
                </div>
                <div class="col text-right pt-2 my-auto">Creato il ${moment(episode.date).format('DD-MM-YYYY')}</div>
            </div>
            
            <form class="form-group">
                <div class="form-group col-5">
                    <label class="mt-5" for="comment">Lascia un commento:</label>
                    <textarea class="form-control" id="comment" rows="3" required></textarea>
                    <button type="button" id="submit-comment" class="mt-2 btn btn-primary">Invia</button>
                </div>
            </form>`
}
export {createEpisodeTemplate};