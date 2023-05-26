// TODO add missing comments
const Buffet = require('../models/buffet')
const { cloudinary } = require('../CloudinaryConfig')


const NodeGeocoder = require('node-geocoder')

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
}

const geocoder = NodeGeocoder(options)



module.exports.index = async (req, res) => {

    // Retrieves all buffets from the database
    const buffets = await Buffet.find({})

    // Renders the 'buffets/index' view and passes the retrieved buffets as data
    res.render('buffets/index', { buffets })
}

module.exports.renderNewForm = (req, res) => {

    // Renders the 'buffets/new' view
    res.render('buffets/new')
}

module.exports.createBuffet = async (req, res) => {

    // TODO address error handling in case the address is invalid
    const geoData = await geocoder.geocode(req.body.buffet.location)

    const latitude = geoData[0].latitude
    const longitude = geoData[0].longitude

    // Creates a new buffet instance with the data from the request body
    const buffet = new Buffet(req.body.buffet)

    buffet.geometry = { "type": "Point", "coordinates": [longitude, latitude] }

    buffet.location = geoData[0].formattedAddress

    //
    buffet.images = req.files.map(file => ({ url: file.path, filename: file.filename }))

    buffet.author = req.user._id

    // Saves the buffet to the database
    await buffet.save()

    // Sets a success flash message
    req.flash('success', 'Successfully added a new buffet!')

    // Redirects the user to the details page of the newly created buffet
    res.redirect(`/buffets/${buffet._id}`)
}

module.exports.showBuffet = async (req, res) => {

    // Retrieves the buffet from the database based on the provided ID and populates its 'reviews' and 'author' fields
    const buffet = await Buffet.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    // If the buffet is not found
    if (!buffet) {

        // Sets an error flash message
        req.flash('error', 'Cannot find buffet!')

        // Redirects the user to the buffets page
        return res.redirect('/buffets')
    }

    // Renders the 'buffets/show' view and passes the retrieved buffet as data
    res.render('buffets/show', { buffet })
}

module.exports.renderEditForm = async (req, res) => {

    // Retrieves the buffet from the database based on the provided ID
    const buffet = await Buffet.findById(req.params.id)

    // If the buffet is not found
    if (!buffet) {

        // Sets an error flash message
        req.flash('error', 'Cannot find buffet!')

        // Redirects the user to the buffets page
        return res.redirect('/buffets')
    }

    // Renders the 'buffets/edit' view and passes the retrieved buffet as data
    res.render('buffets/edit', { buffet })
}

module.exports.updateBuffet = async (req, res) => {

    // Destructures the 'id' property from the request parameters
    const { id } = req.params

    console.log(req.body)

    // Updates the buffet in the database based on the provided ID with the data from the request body
    const buffet = await Buffet.findByIdAndUpdate(id, { ...req.body.buffet })

    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))

    buffet.images.push(...imgs)

    await buffet.save()

    if (req.body.deleteImages) {

        for (let filename of req.body.deleteImages) {

            await cloudinary.uploader.destroy(filename)
        }

        await buffet.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

        console.log(buffet)
    }

    // Sets a success flash message
    req.flash('success', 'Successfully updated buffet!')

    // Redirects the user to the details page of the updated buffet
    res.redirect(`/buffets/${buffet._id}`)
}

module.exports.deleteBuffet = async (req, res) => {

    // Destructures the 'id' property from the request parameters
    const { id } = req.params

    // 
    const buffet = await Buffet.findById(id)

    const images = buffet.images
    const filenames = images.map((image) => image.filename)

    for (let filename of filenames) {
        await cloudinary.uploader.destroy(filename)
    }

    await Buffet.findByIdAndDelete(id)

    // Sets a success flash message
    req.flash('success', 'Sucessfully deleted buffet!')

    // Redirects the user to the '/buffets' route
    res.redirect('/buffets')
}