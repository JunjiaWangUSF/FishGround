const express = require("express");
const router = express.Router();
const FishGround = require("../models/FishGround");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");
//Refrence from https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#examples-41
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken =
  "pk.eyJ1Ijoid2lsbGFvYW8iLCJhIjoiY2xibmw3YTFxMDZ5cjNybXFqMzIxazdpeCJ9.6lsyf_hF2uuBROPsvidn4w";
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

router.get("/", async (req, res) => {
  const titleOfIndex = await FishGround.find({});
  //console.log(index);
  res.render("fishgrounds/index", { titleOfIndex });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("fishgrounds/new");
});

router.post("/", isLoggedIn, async (req, res) => {
  //res.send(req.body)
  const data = await geocoder
    .forwardGeocode({ query: req.body.fishground.location, limit: 1 })
    .send();
  //console.log(data.body.features[0].geometry.coordinates);
  const fishground = new FishGround(req.body.fishground);
  //confirm.log(fishground)
  fishground.geometry = data.body.features[0].geometry;
  fishground.author = req.user._id;
  console.log(fishground.geometry);
  await fishground.save();
  req.flash("success", "Successfully added new places");
  res.redirect(`/fishground/${fishground._id}`);
});

//First populate article author, the get an each reviews author.
router.get("/:id", isLoggedIn, async (req, res) => {
  const fishground = await FishGround.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!fishground) {
    req.flash("error", "Cannot find that post");
    return res.redirect("/fishground");
  }
  console.log(fishground);
  res.render("fishgrounds/show", { fishground });
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const fishground = await FishGround.findById(req.params.id);
  res.render("fishgrounds/edit", { fishground });
});

router.put("/:id", isLoggedIn, async (req, res) => {
  //post request
  //res.send("It works fine")
  const { id } = req.params;
  const fishground = await FishGround.findByIdAndUpdate(id, {
    ...req.body.fishground,
  });

  res.redirect(`/fishground/${fishground._id}`);
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  //post request
  //res.send("It works fine")
  const { id } = req.params;
  const fishground = await FishGround.findByIdAndDelete(id);
  res.redirect(`/fishground`);
});

module.exports = router;
