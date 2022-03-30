const express = require('express');
//const req = require('express/lib/request');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const tolet = require('./models/tolet');
const res = require('express/lib/response');



 
mongoose.connect('mongodb://localhost:27017/tolet');

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"))
db.once("open", ()=>{
    console.log("Database connected");
});

const app = express();
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/tolets',async (req,res)=>{
    const Tolet = await tolet.find({});
    res.render('tolets/index',{Tolet})
})
app.get('/tolets/new',(req,res)=>{
    res.render('tolets/new')
})

app.post('/tolets',async(req,res)=>{
    const Tolet = new tolet(req.body.tolet);
    await Tolet.save();
    res.redirect(`/tolets/${Tolet._id}`)
})
app.get('/tolets/:id',async(req,res) =>{
    const Tolet = await tolet.findById(req.params.id)
    res.render('tolets/show',{Tolet});
})

app.get('/tolets/:id/edit',async(req,res)=>{
    const Tolet = await tolet.findById(req.params.id)
    res.render('tolets/edit',{Tolet});
})

app.put('/tolets/:id',async(req,res)=>{
    const {id} = req.params;
    const Tolet = await tolet.findByIdAndUpdate(id,{...req.body.tolet});
    res.redirect(`/tolets/${Tolet._id}`)
})

app.delete('/tolets/:id',async(req,res) =>{
    const {id} = req.params;
    await tolet.findByIdAndDelete(id);
    res.redirect('/tolets');
})


app.listen(3000,() =>{
    console.log("connected to port 3000")
})