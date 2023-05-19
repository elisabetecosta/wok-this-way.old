// Imports required modules
const express = require('express')
const router = express.Router()

const Buffet = require('../models/buffet')

const {buffetSchema} = require('../schemas')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')



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



// Buffets route definition

// Handles GET request for the /buffets route
router.get('/', catchAsync(async (req, res) => {

    // Retrieves all buffets from the database
    const buffets = await Buffet.find({})

    // Renders the 'buffets/index' view and passes the retrieved buffets as data
    res.render('buffets/index', { buffets })
}))


// Handles GET request for the /buffets/new route
router.get('/new', catchAsync(async (req, res) => {

    // Renders the 'buffets/new' view
    res.render('buffets/new')
}))


// Handles POST request for the /buffets route, validating the data before processing further
router.post('/', validateBuffet, catchAsync(async (req, res) => {

    // Creates a new buffet instance with the data from the request body
    const buffet = new Buffet(req.body.buffet)

    // Saves the buffet to the database
    await buffet.save()

    // Sets a success flash message
    req.flash('success', 'Successfully added a new buffet!')

    // Redirects the user to the details page of the newly created buffet
    res.redirect(`/buffets/${buffet._id}`)
}))


// Handles GET request for the '/buffets/:id' route
router.get('/:id', catchAsync(async (req, res) => {

    // Retrieves the buffet from the database based on the provided ID and populates its 'reviews' field
    const buffet = await Buffet.findById(req.params.id).populate('reviews')

    // If the buffet is not found
    if (!buffet) {

        // Sets an error flash message
        req.flash('error', 'Cannot find buffet!')

        // Redirects the user to the buffets page
        return res.redirect('/buffets')
    }

    // Renders the 'buffets/show' view and passes the retrieved buffet as data
    res.render('buffets/show', { buffet })
}))


// Handles GET request for the '/buffets/:id/edit' route
router.get('/:id/edit', catchAsync(async (req, res) => {

    // Retrieves the buffet from the database based on the provided ID
    const buffet = await Buffet.findById(req.params.id)

    // If the buffet is not found
    if (!buffet) {

        // Sets an error flash message
        req.flash('error', 'Cannot find buffet!')

        // Redirects the user to the buffets page
        return res.redirect('/buffets')
    }

    // Renders the 'buffets/edit' view and passes the retrieved buffet as data
    res.render('buffets/edit', { buffet })
}))


// Handles PUT request for the '/buffets/:id' route, validating the data before processing further
router.put('/:id', validateBuffet, catchAsync(async (req, res) => {

    // Destructures the 'id' property from the request parameters
    const { id } = req.params

    // Updates the buffet in the database based on the provided ID with the data from the request body
    const buffet = await Buffet.findByIdAndUpdate(id, { ...req.body.buffet })

    // Sets a success flash message
    req.flash('success', 'Successfully updated buffet!')

    // Redirects the user to the details page of the updated buffet
    res.redirect(`/buffets/${buffet._id}`)
}))


// Handles DELETE request for the '/buffets/:id' route
router.delete('/:id', catchAsync(async (req, res) => {

    // Destructures the 'id' property from the request parameters
    const { id } = req.params

    // Deletes the buffet from the database based on the provided ID
    await Buffet.findByIdAndDelete(id)

    // Sets a success flash message
    req.flash('success', 'Sucessfully deleted buffet!')

    // Redirects the user to the '/buffets' route
    res.redirect('/buffets')
}))



module.exports = router