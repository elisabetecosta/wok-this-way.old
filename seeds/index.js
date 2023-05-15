// Enables strict mode
'use strict'

// Imports required modules
const mongoose = require('mongoose')
const cities = require('./cities')
const places = require('./seedHelpers')
const Buffet = require('../models/buffet')



// Connects to mongo database
mongoose.connect('mongodb://localhost:27017/chineseBuffetsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Checks connection to database
mongoose.connection.on('error', console.error.bind(console, 'connection error'))
mongoose.connection.once('open', () => console.log('Database connected'))



const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Buffet.deleteMany({})

    for (let i = 0; i < 5; i++) {

        const randomIndex = Math.floor(Math.random() * 5)

        const buffet = new Buffet({
            location: `${cities[randomIndex].city}, ${cities[randomIndex].district}`,
            title: `${sample(places)}`
        })

        await buffet.save()
    }
}

seedDB().then(() => mongoose.connection.close())