import User from "../models/User.js";

export const login = (req, res) => {
  const { email, name, register } = req.query;
  res.render("auth/formLogin.pug", {
    email: email,
    name: name,
    isRegister: register,
  });
};

export const processLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && user.password === password) {
      req.session.user = {
        ...user.toJSON(),
      };
  
      req.session.save((err) => {
        if (err) throw err;
        res.redirect(`/dashboard`);
      });
    } else {
      throw new Error("Email o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error al procesar el login:", error);
    res.render("auth/formLogin.pug", {
      error: error.message || "Ocurrió un error al intentar iniciar sesión.",
      email,
    });
  }
};

export const register = (req, res) => {
  res.render("auth/formRegister.pug");
};

export const prossesRegister = async (req, res) => {
  const { firstName, lastName, dni, birthdate, nickname, email, password } =
    req.body;

  try {
    //*****ENCRIPTAR CONTRASEÑA*****
    const newUser = await User.create({
      firstName,
      lastName,
      nickname,
      dni,
      birthdate,
      email,
      password,
    });

    res.redirect(
      `/auth/login?email=${newUser.email}&name=${newUser.firstName}&register=true`,
    );
  } catch (error) {
    console.error("Error al registrarse en BD:", error);
    res.render("auth/formRegister.pug", { error: "Usted ya esta registrado" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Error al destruir la sesión:", err);
    res.redirect("/");
  });
};
