const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema


const BuffetSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})


// Adds post middleware to BuffetSchema for 'findOneAndDelete' operation (buffet deletion)
BuffetSchema.post('findOneAndDelete', async (doc) => {
    
    // Checks if a document was found and deleted
    if (doc) {
        
        // Deletes all reviews associated with the deleted buffet
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Buffet', BuffetSchema)