const { Console } = require("console"); //get modules
const { captureRejectionSymbol } = require("events");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const ejsMate = require("ejs-mate"); //ejs-mate pakcage
const Review = require("./models/review");
const session = require("express-session");
const flash = require("connect-flash");
// app.use(morgan('common'))
// app.use((req, res, next) =>{
//     console.log("MIDDLEWARE to handle expections")
// })
const passport = require("passport");
const local = require("passport-local");

const fishgrounds = require("./routes/fishground");
const reviews = require("./routes/reviews");
const FishGround = require("./models/FishGround");
const Override = require("method-override"); //Overide-let moogse to delete and update
const User = require("./models/user");
const userRoutes = require("./routes/users");
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

passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser()); //store user in session
passport.deserializeUser(User.deserializeUser()); //get user from out of session
app.get("/", (req, res) => {
  res.render("home");
});

const sessionConfig = {
  key: "mysite.sid.uid.whatever",
  resave: false,
  saveUninitialzied: true,
  secret: "mysecret",
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//middleware pass indictor of action success or not. All store in the esssion.

app.use(passport.initialize()); //user passort api to generate user password/account
app.use(passport.session());
app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "willwang1228@gmail.com", username: "will" });
  const newUser = await User.register(user, "password");
  res.send(newUser);
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/fishground", fishgrounds);
app.use("/fishground/:id/reviews", reviews);
app.use("/", userRoutes);
app.get("/makefishground", async (req, res) => {
  const fisher = FishGround({
    title: "Somewhere in CA",
    description: "Good place to go",
  });
  await fisher.save(); //wait to save to into Database and then send out responds.
  res.send(fisher);
});

// app.get('*', (req, res)=>{
//     res.send('Not Finished yet.') //retun html file of home

// })

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
