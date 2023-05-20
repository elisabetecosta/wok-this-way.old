const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users')
const { checkReturnTo } = require('../middleware')



router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register))


router.route('/login')
    .get(users.renderLoginForm)
    .post(checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

    
router.get('/logout', users.logout)



module.exports = router