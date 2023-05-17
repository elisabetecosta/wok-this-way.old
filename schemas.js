const Joi = require('joi')

// Defines a validation schema for the buffet object using the Joi module
module.exports.buffetSchema = Joi.object({
    buffet: Joi.object({
        title: Joi.string().required(),
        image: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
})