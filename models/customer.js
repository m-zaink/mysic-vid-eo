const mongoose = require('mongoose');
const Joi = require('joi');

function validateCustomer(customer) {
    return Joi.validate(
        customer,
        {
            name: Joi.string().required().min(3).max(50).regex(new RegExp('[a-zA-Z]{3,50}')),
            email: Joi.string().required().regex(new RegExp('[a-z0-9\.]+@gmail\.com')),
            premium: Joi.bool().default(false),
        }
    )
}

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 50,
        match: new RegExp('[a-zA-Z]{3,50}')
    },
    email: {
        type: String,
        required: true,
        match: new RegExp('[a-z0-9\.]+@gmail\.com')
    },
    premium: {
        type: Boolean,
        default: false
    }
}));


exports.Customer = Customer;
exports.validateCustomer = validateCustomer;