const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

function validateGenre(genre) {
    const schema = {
        // Check if the name field :
        // 1. Is a string
        // 2. Has atleast 3 characters
        // 3. Is not empty
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;