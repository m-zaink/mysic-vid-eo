const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        // unique: true,
        match : new RegExp('^[a-bA-Z][a-zA-Z ]*$')
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    return Joi.validate(genre, {
        // Check if the name field :
        // 1. Is a string
        // 2. Has atleast 3 characters
        // 3. Is not empty and matches the given RegExp
        name: Joi.string().min(3).max(50).required().regex(new RegExp('^[a-bA-Z][a-zA-Z ]*$'))
    });
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;