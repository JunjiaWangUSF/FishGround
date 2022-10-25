const mongoose = require('mongoose');


const FsihGorundSchema = new mongoose.Schema({
    title : String,
    price: String,
    description: String,
    location: String
})

module.exports = mongoose.model('FishGround', FsihGorundSchema);