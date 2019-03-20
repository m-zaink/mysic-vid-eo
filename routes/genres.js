const express = require('express');
const Joi = require('joi');
const router = express.Router();
const crud = require('../controller/cruds');
// ------------ Genres ----------------
const genres = [
    { id: 1, name: 'Rock' },
    { id: 2, name: 'Jazz' },
    { id: 3, name: 'Indiana' },
];
// ------------------------------------

// ---------- Validation --------------
function validateGenre(genre) {
    const schema = {
        // Check if the name field :
        // 1. Is a string
        // 2. Has atleast 3 characters
        // 3. Is not empty
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}
// ------------------------------------
router.get('/', (req, res) => {
    // Send list of all the genres.
    // res.send(genres);
    res.send(crud.getGenres());
});

router.get('/:id', (req, res) => {
    // Send the requested genre

    // Check if the genre is present and then store it on genre
    // const genre = genres.find(c => c.id === parseInt(req.params.id));
    try {
        const genre = crud.getGenre(req.params.id);
        res.send(genre);
    } catch(ex) {
        console.log(ex);
    }
    // If requested genre is not present
    if (!genre) return res.status(404).send('Object not found.');

    // Send genre if found.
    res.send(genre);
});

router.post('/', (req, res) => {
    // Accept request to add new genre

    // Validate the new genre so sent
    const { error } = validateGenre(req.body);

    // If invalid, return 400 (Bad Request)
    if (error)
        return res.status(400).send(error[0].message);

    // Create an object for the new genre
    genre = {
        id: genres.length + 1,
        name: req.body.name
    };

    // Add the new genre to the genres list maintained at the top
    genres.push(genre);

    // Send the genre back
    res.send(genre);
});

router.put('/:id', (req, res) => {
    // Update the requested genre

    // Check if the genre is present in the genres list
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    // If not present, return 404 (Object Not Found)
    if (!genre) return res.status(404).send('Object not found.');

    // Validate the new content so sent for update
    const { error } = validateGenre(req.body);

    // If invalid, send 400 (Bad Request)
    if (error)
        return res.status(400).send(error[0].message);

    // Update the fields.
    genre.name = req.body.name;

    // Send the updated genre back
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    // Delete the specified genre if present

    // Check if the genre is present.
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    // If not present, return 404 (Object Not Found)
    if (!genre) return res.status(404).send('Object not found.');

    // Get the index of the genre if found
    const index = genres.indexOf(genre);

    // Remove the genre from the genres list
    genres.splice(index, 1);

    // Return the deleted genre
    res.send(genre);
});


module.exports = router;