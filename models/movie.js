const mongoose = require('mongoose');
const { Genre } = require('./genre');
const Joi = require('joi');

function validateMovie(movie) {
    return Joi.validate(movie, {
        title: Joi.string().required().min(1),
        genre: Joi.required(),
        numberInStock: Joi.number().default(0),
        dailyRentalRate: Joi.number().default(1.0).min(1)
    });
}

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    numberInStock: {
        type: Number,
        default: 0,
    },
    dailyRentalRate: {
        type: Number,
        default: 1.0,
        min: 1.0
    }
}));

exports.Movie = Movie;
exports.validateMovie = validateMovie;