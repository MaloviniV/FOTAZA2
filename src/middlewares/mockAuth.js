/**
 * Middleware temporal para hardcodear un usuario autenticado
 * hasta que se habilite la conexión a la base de datos y lógica real.
 */
export const mockAuth = (req, res, next) => {
  // Simula un usuario logueado
  const mockUser = {
    id: 1,
    username: "usuario_prueba",
    email: "prueba@fotaza.com",
    avatar_url: "/imagenes/avatar/default-avatar.png",
    role: "user",
  };

  req.user = mockUser; // Para usarlo en la lógica de los controladores (ej: saber de quién es el post)
  res.locals.user = mockUser; // Para que la variable esté disponible en todas las vistas de Pug

  next();
};
