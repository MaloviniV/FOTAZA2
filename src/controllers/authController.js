import User from "../models/User.js";

export const login = (req, res) => {
  const { email, name, register } = req.query;
  res.render("auth/formLogin.pug", {
    email: email,
    name: name,
    isRegister: register,
  });
};

export const processLogin = (req, res) => {
  const { email, password } = req.body;

  //### usuarioValido HARDCODEADO, VERIFICAR EN BD ###
  const usuarioValido = true;

  if (usuarioValido) {
    res.redirect("/dashboard/?login=true");
  } else {
    res.render("auth/formLogin", {
      error: "Email o contraseña incorrectos",
      email: email,
    });
  }
};

export const register = (req, res) => {
  res.render("auth/formRegister.pug");
};

export const prossesRegister = async (req, res) => {
  const { firstName, lastName, dni, birthdate, nickname, email, password } = req.body;

  try {
    //*****ENCRIPTAR CONTRASEÑA*****
    const newUser = await User.create({
      firstName,
      lastName,
      nickname,
      dni,
      birthdate,
      email,
      password
    });

    res.redirect(`/auth/login?email=${newUser.email}&name=${newUser.firstName}&register=true`);
  } catch (error) {
    console.error("Error al registrarse en BD:", error);
    res.render("auth/formRegister.pug",{error: "Usted ya esta registrado"});
  }
};

export const logout = (req, res) => {
  res.redirect("/?logout=true");
};
