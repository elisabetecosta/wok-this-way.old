// Enables strict mode
'use strict'

// Imports required modules
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
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

// Enables the use of the body-parser middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }))

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
app.get('/buffets/:id', async (req, res) => {

    const buffet = await Buffet.findById(req.params.id)
    res.render('buffets/show', { buffet })
})



// Starts the server listening on port 3000
app.listen(3000, () => console.log('Server started on port 3000'))