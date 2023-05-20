const Buffet = require('../models/buffet')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {

    // Finds the buffet by ID
    const buffet = await Buffet.findById(req.params.id)

    // Creates a new Review instance using the review data from the request body
    const review = new Review(req.body.review)

    review.author = req.user._id

    // Pushes the new review into the 'reviews' array of the buffet
    buffet.reviews.push(review)

    // Saves the new review and the buffet to the database
    await review.save()
    await buffet.save()

    // Sets a success flash message
    req.flash('success', 'Your review was sucessfully posted!')

    // Redirects the user to the details page of the buffet
    res.redirect(`/buffets/${buffet._id}`)
}

module.exports.deleteReview = async (req, res) => {

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
}