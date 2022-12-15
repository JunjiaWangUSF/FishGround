const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const passort = require("passport");
router.get("/register", (req, res) => {
  //res.send("hi");
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const register = await User.register(user, password);
    req.login(register, (error) => {
      if (error) return error;
      req.flash("success", "Welcome to FishGround");
      res.redirect("/fishground");
    });
  } catch (expection) {
    req.flash("error", "Username have been registered");
    return res.redirect("/register");
  }
});

//login page
router.get("/login", (req, res) => {
  //res.send("hi");
  res.render("users/login");
});

//validate user password and account info.
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome back");

    res.redirect("/fishground");
  }
);

//logout user.
router.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    req.flash("success", "See you next time");
    res.redirect("/fishground");
  });
});

module.exports = router;
