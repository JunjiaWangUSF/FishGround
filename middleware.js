const FishGround = require("./models/FishGround");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.savePage = req.originalUrl; //Bug not fiexed. Cannot render on same page
    req.flash("error", "Please login to see more content");
    return res.redirect("/login");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  //split out post id and reviewId
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Comments by others");
    return res.redirect("/login");
  }
  next();
};
