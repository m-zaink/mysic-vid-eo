const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { validateGenre, Genre } = require('../models/genre');

mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true})
    .then(console.log('Connected successfullly to DB from inside : handler_genres.js'))
    .catch(err => console.log('Error in connecting to DB from inside : handler_genres.js'));

router.get('/', async (req, res) => {
    // Send list of all the genres.

    const genres = await Genre.find();
    if (genres.length == 0)
        return res.status(404).send('No records on DB');

    res.send(genres);
});

router.get('/:id', async (req, res) => {
    // Send the requested genre

    // Check if the genre is present and then store it on genre
    const genre = await Genre.findById(req.params.id);

    // If requested genre is not present
    if (!genre) return res.status(404).send('Object not found.');

    // Send genre if found.
    res.send(genre);
});

router.post('/', async (req, res) => {
    // Accept request to add new genre

    // Validate the new genre so sent
    const { error } = validateGenre(req.body);

    // If invalid, return 400 (Bad Request)
    if (error)
        return res.status(400).send(error[0].message);

    // Add the new genre to the genres list maintained at the top
    const genre = new Genre({
        name: req.body.name
    });
    const result = await genre.save();

    // Send the genre back
    res.send(result);
});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    
    if (error)
        return res.status(400).send(error.message);

    // Check if the genre is present in the genres list and update
    const genre = await Genre.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name } }, { new: true });

    // If not present, return 404 (Object Not Found)
    console.log(genre);
    if (!genre) return res.status(404).send('Object not found.');

    // Send the updated genre back
    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    // Delete the specified genre if present

    // Retrieve the genre
    const genre = await Genre.findOneAndDelete(req.params.id);

    // If genre not present, return 404 (Object Not Found)
    if (!genre) return res.status(404).send('Object not found.');

    // Return the deleted genre
    res.send(genre);
});


module.exports = router;