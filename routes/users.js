const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
  //res.send("hi");
  res.render("users/register");
});
module.exports = router;
