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

// https://thomasventurini.com/articles/the-best-way-to-work-with-todos-in-vscode/

// TODO Comment the code below once I finish the project and before deployment

const seedDB = async () => {

    await Buffet.deleteMany({})

    for (let i = 0; i < 15; i++) {

        const randomIndex = Math.floor(Math.random() * 5)

        const price = Math.floor(Math.random() * 5)

        const buffet = new Buffet({
            author: '6467b1c084ee408921b1bf22', // Admin user id
            location: `${cities[randomIndex].city}, ${cities[randomIndex].district}`,
            title: `${sample(places)}`,
            description: 'This is a random description of a random chinese restaurant that will later be changed.',
            price: price,
            geometry: { 
                type: 'Point', 
                coordinates: [ 
                    cities[randomIndex].longitude,
                    cities[randomIndex].latitude,
                ] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dh9isfyyf/image/upload/v1684707965/Wok%20This%20Way/heuwjggiflu9angrleia.png',
                    filename: 'Wok This Way/heuwjggiflu9angrleia'    
                },
                {
                    url: 'https://res.cloudinary.com/dh9isfyyf/image/upload/v1684707966/Wok%20This%20Way/dn8xmqytxxth1nw10ojs.png',
                    filename: 'Wok This Way/dn8xmqytxxth1nw10ojs'    
                }
            ]
        })

        await buffet.save()
    }
}

seedDB().then(() => mongoose.connection.close())