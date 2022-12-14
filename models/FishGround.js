const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FishGroundSchema = new Schema({
  title: String,
  image: String,

  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

//https://mongoosejs.com/docs/geojson.html
module.exports = mongoose.model("FishGround", FishGroundSchema);
