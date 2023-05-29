// TODO: add comments

const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {

    res.render('users/register')
}

module.exports.register = async (req, res) => {

    try {
        const { email, username, password } = req.body

        const user = new User({ email, username })

        const registeredUser = await User.register(user, password)
        
        req.login(registeredUser, (err) => {

            if (err) return next(err)

            req.flash('success', `Welcome to Wok This Way, ${username}!`)

            res.redirect('/buffets')
        })

    } catch (e) {

        req.flash('error', e.message)

        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {

    if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo
    }
    res.render('users/login')
}

module.exports.login = (req, res) => {

    req.flash('success', `Welcome back, ${req.user.username}!`)

    const redirectUrl = res.locals.returnTo || '/buffets'

    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {

    if (!req.isAuthenticated()) return res.redirect('/buffets')

    req.logout((err) => {

        if (err) return next(err)

        req.flash('success', 'You have successfully signed out!')
        
        res.redirect('/buffets')
    })
}