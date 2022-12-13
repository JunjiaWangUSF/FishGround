const express = require("express");
const router = express.Router();
const FishGround = require("../models/FishGround");
const Review = require("../models/review");

router.get("/", async (req, res) => {
  const titleOfIndex = await FishGround.find({});
  //console.log(index);
  res.render("fishgrounds/index", { titleOfIndex });
});

router.get("/new", (req, res) => {
  res.render("fishgrounds/new");
});

router.post("/", async (req, res) => {
  //res.send(req.body)

  const fishground = new FishGround(req.body.fishground);
  //confirm.log(fishground)
  await fishground.save();
  req.flash("success", "Successfully added new places");
  res.redirect(`/fishground/${fishground._id}`);
});

//21 22 27 33 36
router.get("/:id", async (req, res) => {
  const fishground = await FishGround.findById(req.params.id).populate(
    "reviews"
  );
  console.log(fishground);
  res.render("fishgrounds/show", { fishground });
});

router.get("/:id/edit", async (req, res) => {
  const fishground = await FishGround.findById(req.params.id);
  res.render("fishgrounds/edit", { fishground });
});

router.put("/:id", async (req, res) => {
  //post request
  //res.send("It works fine")
  const { id } = req.params;
  const fishground = await FishGround.findByIdAndUpdate(id, {
    ...req.body.fishground,
  });
  res.redirect(`/fishground/${fishground._id}`);
});

router.delete("/:id", async (req, res) => {
  //post request
  //res.send("It works fine")
  const { id } = req.params;
  const fishground = await FishGround.findByIdAndDelete(id);
  res.redirect(`/fishground`);
});

module.exports = router;
