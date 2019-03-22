const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model(new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50
    },
    phoneNumber : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50 
    },
    
}));

