const { Console } = require("console"); //get modules
const { captureRejectionSymbol } = require("events");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const ejsMate = require("ejs-mate"); //ejs-mate pakcage
const Review = require("./models/review");
// app.use(morgan('common'))
// app.use((req, res, next) =>{
//     console.log("MIDDLEWARE to handle expections")
// })

const fishgrounds = require("./routes/fishground");

const FishGround = require("./models/FishGround");
const Override = require("method-override"); //Overide-let moogse to delete and update
mongoose
  .connect("mongodb://localhost:27017/fish-ground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
//get mongoose connected

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error")); //expection catach
db.once("open", () => {
  console.log("Connection Successfully");
});

const app = express();
const path = require("path");
app.engine("ejs", ejsMate); //instead of use ejs, use ejsmate as view engine to style my ejs files.

app.set("view engine", "ejs"); //set dynamic html scripts

app.set("views", path.join(__dirname, "views")); // make view
app.use(express.urlencoded({ extended: true }));
app.use(Override("_method"));
app.use("/fishground", fishgrounds);
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makefishground", async (req, res) => {
  const fisher = FishGround({
    title: "Somewhere in CA",
    description: "Good place to go",
  });
  await fisher.save(); //wait to save to into Database and then send out responds.
  res.send(fisher);
});

app.delete("/fishground/:id/reviews/:reviewId", async (req, res) => {
  //res.send("hi delete");
  const { id, reviewId } = req.params;
  const fishground = await FishGround.findById(req.params.id);
  await FishGround.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  }); //Pull From fishground and get array inside.
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/fishground/${fishground._id}`);
});

app.post("/fishground/:id/reviews", async (req, res) => {
  const fishground = await FishGround.findById(req.params.id);
  const review = new Review(req.body.review);
  fishground.reviews.push(review);
  await review.save();
  await fishground.save();
  res.redirect(`/fishground/${fishground._id}`);
  //res.send("hi");
});
// app.get('*', (req, res)=>{
//     res.send('Not Finished yet.') //retun html file of home

// })

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
