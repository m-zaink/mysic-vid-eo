// ------------ Imports ---------------
const express = require('express');
const Joi = require('joi');

// ---------- Basic Setup -------------
const app = express();
app.use(express.json());

// ------------ Logic -----------------

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

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => console.log(`LISTENING ON PORT ${port} ...`));

app.get('/', (req, res) => {
    // Home Route. Nothing special here
    res.send('Home Route');
});

app.get('/api/genres', (req, res) => {
    // Send list of all the genres.
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    // Send the requested genre

    // Check if the genre is present and then store it on genre
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    // If requested genre is not present
    if (!genre) return res.status(404).send('Object not found.');

    // Send genre if found.
    res.send(genre);
});

app.post('/api/genres', (req, res) => {
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

app.put('/api/genres/:id', (req, res) => {
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

app.delete('/api/genres/:id', (req, res) => {
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