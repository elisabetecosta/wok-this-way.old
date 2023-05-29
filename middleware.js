// Imports required modules
const Buffet = require('./models/buffet')
const Review = require('./models/review')
const { buffetSchema, reviewSchema } = require('./schemas')

const ExpressError = require('./utils/ExpressError')



// Checks if a user is authenticated
module.exports.isLoggedIn = (req, res, next) => {

    // Checks if a user is not authenticated
    if (!req.isAuthenticated()) {

        // Flashes an error message
        req.flash('error', 'You must be signed in to view this page!')

        // Redirects to the login page
        return res.redirect('/login')
    }

    // If authenticated, calls the next middleware or route handler
    next()
}


// Validates buffet data
module.exports.validateBuffet = (req, res, next) => {

    // Validates the request body against the buffetSchema
    const { error } = buffetSchema.validate(req.body)

    if (error) {

        // If a validation error occurs, constructs an error message
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {

        // If validation succeeds, moves to the next middleware
        next()
    }
}


// Validates review data
module.exports.validateReview = (req, res, next) => {

    // Validates the request body against the reviewSchema
    const { error } = reviewSchema.validate(req.body)

    if (error) {

        // If a validation error occurs, constructs an error message
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {

        // If validation succeeds, moves to the next middleware
        next()
    }
}


// Checks if the authenticated user is the author of a buffet
module.exports.isAuthor = async (req, res, next) => {
    
    // Destructures the 'id' property from the request parameters
    const { id } = req.params

    // Fetches the buffet from the database based on the provided 'id'
    const buffet = await Buffet.findById(id)

    // Checks if the authenticated user is the author of the buffet
    if (!buffet.author.equals(req.user._id)) {

        // If not the author, flashes an error message
        req.flash('error', 'You do not have permission to do that.')

        // Redirects to the buffet's page
        return res.redirect(`/buffets/${id}`)
    }

    // If the authenticated user is the author, calls the next middleware or route handler
    next()
} 


// Checks if the authenticated user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
    
    // Destructures the 'id' and 'reviewId' properties from the request parameters
    const { id, reviewId } = req.params

    // Fetches the review from the database based on the provided 'reviewId'
    const review = await Review.findById(reviewId)

    // Checks if the authenticated user is the author of the review
    if (!review.author.equals(req.user._id)) {

        // If not the author, flashes an error message
        req.flash('error', 'You do not have permission to do that.')

        // Redirects to the buffet's page
        return res.redirect(`/buffets/${id}`)
    }

    // If the authenticated user is the author, calls the next middleware or route handler
    next()
} 


// Checks if there is a page to return to after authentication
module.exports.checkReturnTo = (req, res, next) => {

    // Checks if the 'returnTo' property exists in the session
    if (req.session.returnTo) {

        // If it exists, assigns it to 'res.locals.returnTo'
        res.locals.returnTo = req.session.returnTo
    }

    // Calls the next middleware or route handler
    next()
}