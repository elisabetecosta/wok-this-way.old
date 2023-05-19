const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')


// Creates a user Schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// Adds plugins to the user Schema
UserSchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('User', UserSchema)