// Imports required modules
const express = require('express')
const router = express.Router()
const multer = require('multer')
const { storage } = require('../config/Cloudinary')
const upload = multer({ storage })

const buffets = require('../controllers/buffets')

const { isLoggedIn, validateBuffet, isAuthor } = require('../middleware')

const catchAsync = require('../utils/catchAsync')



// Buffets route definition

// Handles GET and POST requests for the /buffets route
router.route('/')
    .get(catchAsync(buffets.index))
    .post(isLoggedIn, upload.array('image'), validateBuffet, catchAsync(buffets.createBuffet))


// Handles GET request for the /buffets/new route
router.get('/new', isLoggedIn, buffets.renderNewForm)


// Handles GET, PUT and DELETE requests for the '/buffets/:id' route
router.route('/:id')
    .get(catchAsync(buffets.showBuffet))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBuffet, catchAsync(buffets.updateBuffet))
    .delete(isLoggedIn, isAuthor, catchAsync(buffets.deleteBuffet))


// Handles GET request for the '/buffets/:id/edit' route
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(buffets.renderEditForm))



module.exports = router