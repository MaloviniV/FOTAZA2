export const login = (req, res) => {
  const {username, name, register} = req.query;
  res.render("auth/formLogin.pug", {
    username: username,
    name: name,
    isRegister: register
  });
}

export const processLogin = (req, res) => {
  const {username, password} = req.body;

  //### usuarioValido HARDCODEADO, VERIFICAR EN BD ###
  const usuarioValido = true;
  
  if(usuarioValido){
    res.redirect("/dashboard");
  }else{
    res.render("auth/formLogin", {
      error: "Usuario o contraseña incorrectos",
      username: username
    });
  }
}

export const register = (req, res) => {
  res.render("auth/formRegister.pug");
}

export const prossesRegister = (req, res) => {
  const {longname, name, birthdate, username, password} = req.body;

   //### registroValido HARDCODEADO, VERIFICAR EN BD ###
  const registroValido = true;

  if(registroValido){
    console.log
    
    res.redirect(`login?username=${username}&name=${name}&register=true`);
  }
}