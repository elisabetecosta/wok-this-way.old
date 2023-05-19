// Imports required modules
const express = require('express')
const router = express.Router({ mergeParams: true }) // the 'mergeParams' option allows access to the params of the parent route (buffets)

const Buffet = require('../models/buffet')
const Review = require('../models/review')

const { reviewSchema } = require('../schemas')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')



// Validates review data
const validateReview = (req, res, next) => {

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



// Reviews route definition

// Handles POST request for the '/buffets/:id/reviews' route, validating the data before processing further
router.post('/', validateReview, catchAsync(async (req, res) => {

    // Finds the buffet by ID
    const buffet = await Buffet.findById(req.params.id)

    // Creates a new Review instance using the review data from the request body
    const review = new Review(req.body.review)

    // Pushes the new review into the 'reviews' array of the buffet
    buffet.reviews.push(review)

    // Saves the new review and the buffet to the database
    await review.save()
    await buffet.save()

    // Sets a success flash message
    req.flash('success', 'Your review was sucessfully posted!')

    // Redirects the user to the details page of the buffet
    res.redirect(`/buffets/${buffet._id}`)
}))


// Handles DELETE request for the '/buffets/:id/reviews/:reviewId' route
router.delete('/:reviewId', catchAsync(async (req, res) => {

    // Destructures the 'id' and 'reviewId' properties from the request parameters
    const { id, reviewId } = req.params

    // Removes the review ID from the reviews array of the buffet using the '$pull' operator
    await Buffet.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })

    // Deletes the review from the database based on the provided ID
    await Review.findByIdAndDelete(reviewId)

    // Sets a success flash message
    req.flash('success', 'Your review was sucessfully deleted!')

    // Redirects the user to the details page of the buffet
    res.redirect(`/buffets/${id}`)
}))



module.exports = router