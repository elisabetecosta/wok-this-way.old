// Enables strict mode
'use strict'

// Imports required modules
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Buffet = require('./models/buffet')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const {buffetSchema} = require('./schemas')



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


// Sets the EJS template engine for rendering views
app.engine('ejs', ejsMate)

// Sets the view engine to EJS
app.set('view engine', 'ejs')

// Set the directory for the views
app.set('views', path.join(__dirname, 'views'))


// Parses URL-encoded bodies for form submission
app.use(express.urlencoded({ extended: true }))

// Enables method override for HTTP verbs when there is the query string "?_method=METHOD" at the end of a URI
app.use(methodOverride('_method'))

// Serves static files in the public directory
app.use(express.static('public'))


// Validates buffet data
const validateBuffet = (req, res, next) => {

    // Validates the request body against the buffetSchema
    const {error} = buffetSchema.validate(req.body)
    
    if (error) {

        // If a validation error occurs, constructs an error message
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {

        // If validation succeeds, moves to the next middleware
        next()
    }
}



// Defines the routes for the application

// Handles GET request for the root route ('/')
app.get('/', (req, res) => {

    // Renders the 'home' view
    res.render('home')
})


// Handles GET request for the /buffets route
app.get('/buffets', catchAsync(async (req, res) => {

    // Retrieves all buffets from the database
    const buffets = await Buffet.find({})

    // Renders the 'buffets/index' view and passes the retrieved buffets as data
    res.render('buffets/index', { buffets })
}))


// Handles GET request for the /buffets/new route
app.get('/buffets/new', catchAsync(async (req, res) => {

    // Renders the 'buffets/new' view
    res.render('buffets/new')
}))


// Handles POST request for the /buffets route, validating the data before processing further
app.post('/buffets', validateBuffet, catchAsync(async (req, res) => {

    // Creates a new buffet instance with the data from the request body
    const buffet = new Buffet(req.body.buffet)

    // Saves the buffet to the database
    await buffet.save()

    // Redirects the user to the details page of the newly created buffet
    res.redirect(`/buffets/${buffet._id}`)
}))


// Handles GET request for the '/buffets/:id' route
app.get('/buffets/:id', catchAsync(async (req, res) => {

    // Retrieves the buffet from the database based on the provided ID
    const buffet = await Buffet.findById(req.params.id)

    // Renders the 'buffets/show' view and passes the retrieved buffet as data
    res.render('buffets/show', { buffet })
}))


// Handles GET request for the '/buffets/:id/edit' route
app.get('/buffets/:id/edit', catchAsync(async (req, res) => {

    // Retrieves the buffet from the database based on the provided ID
    const buffet = await Buffet.findById(req.params.id)

    // Renders the 'buffets/edit' view and passes the retrieved buffet as data
    res.render('buffets/edit', { buffet })
}))


// Handles PUT request for the '/buffets/:id' route, validating the data before processing further
app.put('/buffets/:id', validateBuffet, catchAsync(async (req, res) => {

    // Destructures the 'id' property from the request parameters
    const { id } = req.params

    // Updates the buffet in the database based on the provided ID with the data from the request body
    const buffet = await Buffet.findByIdAndUpdate(id, { ...req.body.buffet })

    // Redirects the user to the details page of the updated buffet
    res.redirect(`/buffets/${buffet._id}`)
}))


// Handles DELETE request for the '/buffets/:id' route
app.delete('/buffets/:id', catchAsync(async (req, res) => {

    // Destructures the 'id' property from the request parameters
    const { id } = req.params

    // Deletes the buffet from the database based on the provided ID
    await Buffet.findByIdAndDelete(id)

    // Redirects the user to the '/buffets' route
    res.redirect('/buffets')
}))



// Handles all routes that are not matched by previous route handlers
app.all('*', (req, res, next) => {

    // Creates a new instance of the ExpressError using a custom statusCode and message, passing it to the next error-handling middleware
    next(new ExpressError(404, 'Page Not Found'))
})


// Error handling middleware
app.use((err, req, res, next) => {

    // Extracts the statusCode property from the error object, defaulting to 500 if not provided
    const {statusCode = 500} = err

    // Sets a default error message if not already provided
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'

    // Sets the response status code and renders the 'error' view with the error object as data
    res.status(statusCode).render('error', {err})
})



// Starts the server listening on port 3000
app.listen(3000, () => console.log('Server started on port 3000'))