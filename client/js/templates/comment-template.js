'use strict';

function createListComments() {
    return` <div id="comment-container">
            
            <ul class="list-unstyled" id="list-comments">
            </ul>
            </div>`;
}

function createCommentRow(comment, flag){
    return `<div class="card col-6 my-3">
                <div class="card-body">
                    ${comment.text}
                </div>
                <div>
                    
                    <p class="text-right mr-2 my-auto text-success">
                        ${flag=="1" ? `<button type="button" data-id="${comment.id_comment}" class="delete-comment btn btn-danger mb-2 py-0 mr-3">Elimina</button>
                                       <button type="button" data-id="${comment.id_comment}" class="edit-comment btn btn-warning mb-2 mr-5 py-0" data-toggle="modal" data-target="#commentModal">Modifica</button>`
                                    : ""}
                    
                        Recensione di ${comment.name_user}
                    </p>
                </div>
            </div>`;
}

export {createCommentRow, createListComments};