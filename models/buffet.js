// TODO Add comments where needed and icon to the left of the map popup title in the virtual to make it more obvious the title is a link, add location to pop up?

const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_150,w_200')
})


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
}, opts)


// Virtual needed to send buffet data to the cluster map popup
BuffetSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <a class="mapTitle" href="/buffets/${this._id}">${this.title}</a>
    <p>${this.description.substring(0, 100)}...</p>
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