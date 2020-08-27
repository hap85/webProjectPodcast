function createPaymentForm(id_episode, id_serie) {
    return`<h1 class="text-center">Pagamento</h1>
    <h5 class="text-center mb-5">Inserisci i dati della carta di credito per procedere con l'acquisto</h5>
    <form method="POST" action="submit" id="payment-form" data-id="${id_episode}" class="col-4 mx-auto">            
    <div class="form-group">
      <input type="text" name="idSerie" data-id="${id_serie}" hidden>
      <label for="name">Nome</label>
      <input type="text" name="name" id="name" class="form-control" required />
    </div>

    <div class="form-group">
      <label for="surname">Cognome</label>
      <input type="text" name="surname" id="surname" class="form-control" required/>
    </div>
    <div class="form-group">
      <label for="creditCard">Numero carta di credito</label>
      <input type="text" name="creditCard" id="creditCard" class="form-control" required/>
    </div>
    <div class="form-group">
      <label for="cvc">CVC</label>
      <input type="text" name="cvc" class="form-control col-2" required/>
    </div>
    <div class="container">
        <div class="row justify-content-end">
            <button type="submit" id="pay-button" class="btn btn-success mb-5 align-right">Acquista</button>
        </div>
    </div>
        
    
  </form>
  
    
  
  `;
}

export {createPaymentForm};