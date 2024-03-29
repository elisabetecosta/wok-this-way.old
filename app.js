// Enables strict mode
'use strict'

// Checks if the current environment is not in production mode
if (process.env.NODE_ENV !== "production") {

    // Loads environment variables from a .env file
    require('dotenv').config()
}


// Imports required modules
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const mongoSanitize = require('express-mongo-sanitize')

const userRoutes = require('./routes/users')
const buffetRoutes = require('./routes/buffets')
const reviewRoutes = require('./routes/reviews')

const MongoStore = require('connect-mongo')


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/wok-this-way'

// Connects to mongo database
mongoose.connect(dbUrl, {
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
app.use(express.static(path.join(__dirname, 'public')))

//
app.use(mongoSanitize())


const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

// MongoStore config
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', (e) => console.log('SESSION STORE ERROR', e))


// Configures session middleware
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

// Mounts session and flash middlewares
app.use(session(sessionConfig))
app.use(flash())


// Initializes passport
app.use(passport.initialize())

// Enables persistent login sessions
app.use(passport.session())

// TODO change code below to implement google auth based on the secrets project
//============================================

// Configures passport for local authentication strategy
passport.use(new LocalStrategy(User.authenticate()))

// Serializes user into the session
passport.serializeUser(User.serializeUser());

// Deserializes user from the session
passport.deserializeUser(User.deserializeUser());
//============================================


// Middleware to set local variables
app.use((req, res, next) => {

    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl
    }
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


// Sets up the router middlewares for buffets and reviews 
app.use('/', userRoutes)
app.use('/buffets', buffetRoutes)
app.use('/buffets/:id/reviews', reviewRoutes)



// Defines routes for the application

// Handles GET request for the root route ('/')
app.get('/', (req, res) => {

    // Renders the 'home' view
    res.render('home')
})


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


const PORT = process.env.PORT || 3000

// Starts the server listening on port 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))