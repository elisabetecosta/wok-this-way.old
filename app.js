// Enables strict mode
'use strict'

// Imports required modules
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Buffet = require('./models/buffet')



// Connects to mongo database
mongoose.connect('mongodb://localhost:27017/chineseBuffetsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Checks connection to database
mongoose.connection.on('error', console.error.bind(console, 'connection error'))
mongoose.connection.once('open', () => console.log('Database connected'))


// Creates an Express application
const app = express()

// Sets the view engine to EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Parses incoming requests
app.use(express.urlencoded({ extended: true }))

// Allows method overriding by adding the query string "?_method=METHOD" to the end of a URI
app.use(methodOverride('_method'))

// Serves static files in the public directory
app.use(express.static('public'))



// Defines the routes for the application

// Handles GET requests to the root route ('/')
app.get('/', (req, res) => {

    res.render('home')
})


// Handles POST requests to the root route ('/')
app.post('/', (req, res) => { })


// 
app.get('/buffets', async (req, res) => {

    const buffets = await Buffet.find({})
    res.render('buffets/index', { buffets })
})


// 
app.get('/buffets/new', async (req, res) => {

    res.render('buffets/new')
})


app.post('/buffets', async (req, res) => {

    const buffet = new Buffet(req.body.buffet)
    await buffet.save()
    res.redirect(`/buffets/${buffet._id}`)
})


//
app.get('/buffets/:id', async (req, res) => {

    const buffet = await Buffet.findById(req.params.id)
    res.render('buffets/show', { buffet })
})


//
app.get('/buffets/:id/edit', async (req, res) => {

    const buffet = await Buffet.findById(req.params.id)
    res.render('buffets/edit', { buffet })
})


// Handles the updating of buffets
app.put('/buffets/:id', async (req, res) => {

    const { id } = req.params
    const buffet = await Buffet.findByIdAndUpdate(id, { ...req.body.buffet })
    res.redirect(`/buffets/${buffet._id}`)
})


// Handles the deleting of buffets
app.delete('/buffets/:id', async (req, res) => {

    const { id } = req.params
    await Buffet.findByIdAndDelete(id)
    res.redirect('/buffets')
})



// Starts the server listening on port 3000
app.listen(3000, () => console.log('Server started on port 3000'))