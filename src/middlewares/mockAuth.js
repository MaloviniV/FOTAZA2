/**
 * Middleware temporal para hardcodear un usuario autenticado
 * hasta que se habilite la conexión a la base de datos y lógica real.
 */

// Variable en memoria para recordar si estamos "logueados" o no
let isAuthenticated = false;

export const mockAuth = (req, res, next) => {
  // Detectamos si queremos cambiar el estado de la sesión a través de la URL
  if (req.query.login === "true") isAuthenticated = true;
  if (req.query.logout === "true") isAuthenticated = false;

  if (isAuthenticated) {
    // Simula un usuario logueado
    const mockUser = {
      id: 1,
      username: "usuario_prueba",
      email: "prueba@fotaza.com",
      avatar_url: "/imagenes/avatar/default-avatar.png",
      role: "user",
    };
    req.user = mockUser; // Para la lógica de los controladores
    res.locals.user = mockUser; // Para que la variable esté disponible en las vistas de Pug
  } else {
    req.user = null;
    res.locals.user = null;
  }

  next();
};
