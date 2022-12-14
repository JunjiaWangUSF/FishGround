const express = require("express");
const mongoose = require("mongoose");
const dummyCities = require("./cities");
const FishGround = require("../models/FishGround");
const { places, descriptors } = require("./NameGenerator");

mongoose
  .connect("mongodb://localhost:27017/fish-ground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successfully on Name Generator."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
//get mongoose connected

const seedDB = async () => {
  await FishGround.deleteMany({});
  //const fish = new FishGround({title: 'yellow fish'});
  //console.log(fish);
  //await fish.save();
  for (let i = 0; i < 50; i++) {
    const num = getRandom(0, 1000);
    //console.log(dummyCities);
    const price = Math.floor(Math.random() * 50) + 10;
    const locationinfo = new FishGround({
      author: "6398fe5453a4c878e15bc161",
      location: `${dummyCities[num].city}` + ", " + `${dummyCities[num].state}`,
      geometry: {
        type: "Point",
        coordinates: [dummyCities[num].longitude, dummyCities[num].latitude],
      },
      title: `${descriptors[getRandom(0, 10)]}`,
      image: "https://source.unsplash.com/collection/2060184",
      description:
        "Someone leves their comments there. Current do not have any data",
      //price
      //places : `${places[getRandom(0,10)]}`
    });
    await locationinfo.save();
  }
};

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

seedDB().then(() => mongoose.connections.close); //Promise
