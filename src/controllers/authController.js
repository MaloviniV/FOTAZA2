import User from "../models/User.js";
import bcrypt from "bcrypt";
//Devuelve la vista de login
export const login = (req, res) => {
  const { email, name } = req.query;
  res.render("auth/login.pug", { email, name });
};
//Procesa el formulario de login
export const processLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (user && passwordMatch) {
      req.session.user = {
        id: user.id,
        firstName: user.firstName,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
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
    res.render("auth/login.pug", {
      error: error.message || "Ocurrió un error al intentar iniciar sesión.",
      email,
    });
  }
};

export const register = (req, res) => {
  res.render("auth/register.pug");
};

export const prossesRegister = async (req, res) => {
  const { firstName, lastName, dni, birthdate, nickname, email, password } =
    req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      firstName,
      lastName,
      nickname,
      dni,
      birthdate,
      email,
      password: hashedPassword,
    });

    res.redirect(
      `/auth/login?email=${encodeURIComponent(newUser.email)}&name=${encodeURIComponent(newUser.firstName)}`,
    );
  } catch (error) {
    console.error("Error al registrarse en BD:", error);
    res
      .status(400)
      .render("auth/register.pug", { error: "Usted ya esta registrado" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Error al destruir la sesión:", err);
    res.redirect("/");
  });
};
