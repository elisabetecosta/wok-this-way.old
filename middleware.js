// TODO add comments to routes/users, middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.flash('error', 'You must be signed in to view this page!')

        return res.redirect('/login')
    }
    next()
}