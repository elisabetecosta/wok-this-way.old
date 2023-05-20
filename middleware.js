// Imports required modules
const Buffet = require('./models/buffet')
const Review = require('./models/review')
const { buffetSchema, reviewSchema } = require('./schemas')

const ExpressError = require('./utils/ExpressError')



// TODO add comments to routes/users, middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'You must be signed in to view this page!')

        return res.redirect('/login')
    }
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


// 
module.exports.isAuthor = async (req, res, next) => {
    
    // Destructures the 'id' property from the request parameters
    const { id } = req.params

    const buffet = await Buffet.findById(id)

    if (!buffet.author.equals(req.user._id)) {

        req.flash('error', 'You do not have permission to do that.')

        return res.redirect(`/buffets/${id}`)
    }

    next()
} 


// 
module.exports.isReviewAuthor = async (req, res, next) => {
    
    // Destructures the 'id' and 'reviewId' properties from the request parameters
    const { id, reviewId } = req.params

    const review = await Review.findById(reviewId)

    if (!review.author.equals(req.user._id)) {

        req.flash('error', 'You do not have permission to do that.')

        return res.redirect(`/buffets/${id}`)
    }

    next()
} 