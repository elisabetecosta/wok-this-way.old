// Imports required modules
const express = require('express')
const router = express.Router({ mergeParams: true }) // the 'mergeParams' option allows access to the params of the parent route (buffets)

const reviews = require('../controllers/reviews')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const catchAsync = require('../utils/catchAsync')



// Reviews route definition

// Handles POST request for the '/buffets/:id/reviews' route, checking if the user is logged in and validating the data before processing further
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))


// Handles DELETE request for the '/buffets/:id/reviews/:reviewId' route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))



module.exports = router