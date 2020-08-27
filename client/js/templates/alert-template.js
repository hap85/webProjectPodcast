"use strict;"

function createAlert(type, message) {
    return `<div class="alert mb-0 fixed-bottom alert-${type} alert-dismissible fade show" role="success">
    <span class="text-center">${message}</span> 
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
    </div>`;
  }
  
  export {createAlert};