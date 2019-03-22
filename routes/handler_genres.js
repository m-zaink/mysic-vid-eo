const express = require('express');
const router = express.Router();
const crud = require('../controller/cruds');
const { validateGenre } = require('../models/genre');

router.get('/', async (req, res) => {
    // Send list of all the genres.
    // res.send(genres);
    const genres = await crud.getGenres();
    if (genres.length == 0)
        return res.status(404).send('No records on DB');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    // Send the requested genre

    // Check if the genre is present and then store it on genre
    // const genre = genres.find(c => c.id === parseInt(req.params.id));
    const genre = await crud.addGenre(req.params.id);

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

    // Create an object for the new genre
    genre = {
        name: req.body.name,
    };

    // Add the new genre to the genres list maintained at the top
    // genres.push(genre);
    const result = await crud.addGenre(genre);

    // Send the genre back
    res.send(result);
});

router.put('/:id', async (req, res) => {
    // Update the requested genre

    // Check if the genre is present in the genres list
    const genre = crud.getGenre(id);

    // If not present, return 404 (Object Not Found)
    if (!genre) return res.status(404).send('Object not found.');

    // Validate the new content so sent for update
    const { error } = validateGenre(req.body);

    // If invalid, send 400 (Bad Request)
    if (error)
        return res.status(400).send(error[0].message);

    // Update the fields.
    // genre.name = req.body.name;


    // Send the updated genre back
    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    // Delete the specified genre if present

    // Retrieve the genre
    const genre = await crud.deleteGenre(req.params.id);

    // If genre not present, return 404 (Object Not Found)
    if (!genre) return res.status(404).send('Object not found.');

    // Return the deleted genre
    res.send(genre);
});


module.exports = router;