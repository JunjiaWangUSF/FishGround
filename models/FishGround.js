const mongoose = require("mongoose");

const FishGroundSchema = new mongoose.Schema({
  title: String,
  image: String,
  //price: Number,
  description: String,
  location: String,
});

module.exports = mongoose.model("FishGround", FishGroundSchema);
