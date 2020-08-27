function createLoginForm() {
    return`<h1 class="text-center">Login</h1>
    <h5 class="text-center mb-5">Inserisci le tue credenziali per accedere</h5>
    <form method="POST" action="" id="login-form" class="col-4 mx-auto">            
    <div class="form-group">
      <label for="email">Indirizzo mail</label>
      <input type="email" name="email" class="form-control" required />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" name="password" class="form-control" required autocomplete/>
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
    <div class="row mx-auto my-3"><span class="my-auto">Non sei ancora registrato?</span>
    <a href="/registration" class="ml-3 btn btn-success">Registrati ora</a>
    </div>
    
  </form>
  
    
  
  `;
}

export {createLoginForm};