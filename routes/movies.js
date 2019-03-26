const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { validateMovie, Movie } = require('../models/movie');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(console.log('Connected successfullly to DB from inside : handler_movie.js'))
    .catch(err => console.log('Error in connecting to DB from inside : handler_movie.js'));


router.get('/', async (req, res) => {
    const movies = await Movie.find().populate('genre');
    if (movies.length == 0)
        return res.status(404).send('No records found on DB');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if(!movie)
        return res.status(404).send('No such object found');
    
    res.send(movie);
});

router.post('/', async (req, res) => {
    const {error} = validateMovie(req.body);

    if(error) 
        return res.status(400).send(error.message);

    const movie = new Movie({
        title: req.body.title,
        genre: req.body.genre
    });

    const result = await movie.save();

    res.send(result);
});

module.exports = router;