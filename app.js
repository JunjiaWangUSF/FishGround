const {Console} = require("console"); //get modules 
const { captureRejectionSymbol } = require("events");
const express = require("express");
const mongoose = require('mongoose');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');  //ejs-mate pakcage

// app.use(morgan('common'))
// app.use((req, res, next) =>{
//     console.log("MIDDLEWARE to handle expections")
// })

const FishGround = require('./models/FishGround')
const Override = require('method-override') //Overide-let moogse to delete and update
mongoose.connect('mongodb://localhost:27017/fish-ground', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connection established.')).catch((error) => console.error("MongoDB connection failed:", error.message));
 //get mongoose connected 

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error")); //expection catach 
db.once("open", () => {
    console.log("Connection Successfully");
});




const app  = express();
const path = require('path');
app.engine('ejs', ejsMate) //instead of use ejs, use ejsmate as view engine to style my ejs files.

app.set('view engine', 'ejs'); //set dynamic html scripts 

app.set('views', path.join(__dirname, 'views')) // make view 
app.use(express.urlencoded({extended:true}))
app.use(Override('_method'))


app.get('/', (req, res)=>{
    res.render('home') //retun html file of home 

})

app.get('/makefishground', async (req, res)=> {
    const fisher =  FishGround({title : 'Somewhere in CA', description:'Good place to go'});
    await fisher.save(); //wait to save to into Database and then send out responds.  
    res.send(fisher);
})

app.get('/fishground', async (req, res)=> {
    const titleOfIndex = await FishGround.find({})
    //console.log(index);
    res.render('fishgrounds/index', {titleOfIndex})
})

app.get('/fishground/new', (req, res)=> {
    res.render('fishgrounds/new')
})

app.post('/fishground',async (req, res)=> {
    //res.send(req.body)
    const fishground = new FishGround(req.body.fishground)
    //confirm.log(fishground)
    await fishground.save();
    res.redirect(`/fishground/${fishground._id}`)
})

app.get('/fishground/:id', async (req, res)=> {
    const fishground = await FishGround.findById(req.params.id)
    res.render('fishgrounds/show', {fishground})
})

app.get('/fishground/:id/edit', async (req, res)=> {
    const fishground = await FishGround.findById(req.params.id)
    res.render('fishgrounds/edit', {fishground})
})

app.put('/fishground/:id', async (req, res)=> { //post request 
    //res.send("It works fine")
    const {id} = req.params;
    const fishground = await FishGround.findByIdAndUpdate(id, {...req.body.fishground});
    res.redirect(`/fishground/${fishground._id}`)

})

app.delete('/fishground/:id', async (req, res)=> { //post request 
    //res.send("It works fine")
    const {id} = req.params;
    const fishground = await FishGround.findByIdAndDelete(id);
    res.redirect(`/fishground`)

})
// app.get('*', (req, res)=>{
//     res.send('Not Finished yet.') //retun html file of home 

// })

app.listen(3000,()=>{
    console.log("Serving on port 3000")
})
