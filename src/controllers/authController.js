export const login = (req, res) => {
  res.render("auth/formLogin.pug");
}

export const register = (req, res) => {
  res.render("auth/formRegister.pug");
}