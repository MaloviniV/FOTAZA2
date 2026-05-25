export const requireAuth = (req, res, next) => {
  if(!req.user){
    const expiredSession = "Su sesion ha expirado"
    return res.redirect(`/?expiredSession=${expiredSession}`);
  }

  next();
};