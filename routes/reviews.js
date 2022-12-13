const express = require("express");
const router = express.Router({ mergeParams: true });
const FishGround = require("../models/FishGround");
const Review = require("../models/review");

router.delete("/:reviewId", async (req, res) => {
  //res.send("hi delete");
  const { id, reviewId } = req.params;
  const fishground = await FishGround.findById(req.params.id);
  await FishGround.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  }); //Pull From fishground and get array inside.
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/fishground/${fishground._id}`);
});

router.post("/", async (req, res) => {
  const fishground = await FishGround.findById(req.params.id);
  const review = new Review(req.body.review);
  fishground.reviews.push(review);
  await review.save();
  await fishground.save();
  res.redirect(`/fishground/${fishground._id}`);
  //res.send("hi");
});

module.exports = router;
