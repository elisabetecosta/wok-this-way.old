// Higher-order function that takes a function as an argument and returns a new function
module.exports = func => {

    return (req, res, next) => {

        // Returned function that wraps the provided function with error handling
        func(req, res, next).catch(next)
    }
}