function createRegistrationForm() {
    return`<h1 class="text-center">Registrati</h1>
    <h5 class="text-center mb-5">Inserisci email e password per registrarti</h5>
    <form method="POST" action="" id="registration-form" class="col-4 mx-auto"> 
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" name="username" class="form-control" required />
    </div>           
    <div class="form-group">
      <label for="email">Indirizzo mail</label>
      <input type="email" name="email" class="form-control" required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" name="password" class="form-control" required autocomplete/>
    </div>
    <div class="form-check mb-3">
  <input class="form-check-input" type="checkbox" value="0" name="creator">
  <label class="form-check-label" for="creator">
    Creatore
  </label>
</div>
    
    <button type="submit" class="btn btn-warning">Registrati</button>
  </form>`;
}

export {createRegistrationForm};