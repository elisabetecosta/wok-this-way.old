const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BuffetSchema = new Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    location: String
})

module.exports = mongoose.model('Buffet', BuffetSchema)