const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')


router.get('/register', (req, res) => {

    res.render('users/register')
})


router.post('/register', catchAsync(async (req, res) => {

    try {
        const { email, username, password } = req.body

        const user = new User({ email, username })

        const registeredUser = await User.register(user, password)
        console.log(registeredUser)

        req.flash('success', 'Welcome to Wok This Way!')
        res.redirect('/buffets')

    } catch (e) {

        req.flash('error', e.message)
        res.redirect('/register')
    }
}))


router.get('/login', (req, res) => {

    res.render('users/login')
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {

    const username = req.body.username
    req.flash('success', `Welcome back, ${username}!`)
    res.redirect('/buffets')
})


router.get('/logout', (req, res) => {

    if (!req.isAuthenticated()) return res.redirect('/buffets')

    req.logout((err) => {
        if (err) return next(err)

        req.flash('success', 'You have successfully signed out!')
        
        res.redirect('/buffets')
    })
})


module.exports = router