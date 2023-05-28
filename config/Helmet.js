const express = require('express')
const app = express()
const helmet = require('helmet')


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://maps.googleapis.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
]

const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
    "https://maps.googleapis.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
]

const connectSrcUrls = [
    "https://maps.googleapis.com",
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
]

const fontSrcUrls = [
    "https://fonts.gstatic.com",
]

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dh9isfyyf/", // needs to match cloudinary account 
                "https://images.unsplash.com",
                "https://maps.googleapis.com",
                "https://maps.gstatic.com",
                "https://streetviewpixels-pa.googleapis.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
)