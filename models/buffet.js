const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
})

// Generates a thumbnail URL by replacing the '/upload' segment of the original URL
ImageSchema.virtual('thumbnail').get(function () {

    // Returns a smaller version of the image (150x200px)
    return this.url.replace('/upload', '/upload/c_fill,h_150,w_200')
})


// Options object to enable virtuals in toJSON
const opts = { toJSON: { virtuals: true } }

const BuffetSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts) // Applies the options to enable virtuals in toJSON


// Virtual needed to send buffet data to the cluster map popup
BuffetSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <p class="mapTitle">${this.title}</p>
    <p class="mapLocation">${this.location}</p>
    <p>${this.description.substring(0, 100)}...</p>
    <p><a class="mapLink" href="/buffets/${this._id}">View Buffet</a></p>
    `
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