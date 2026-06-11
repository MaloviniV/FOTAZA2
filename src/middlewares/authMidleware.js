export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect(303,"/auth/login");
  }

  next();
};
