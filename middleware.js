module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login to see more content");
    return res.redirect("/login");
  }
  next();
};
