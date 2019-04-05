const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { Genre, validateGenre } = require('../models/genre');

router.get('/', async (req, res) => {
	// Send list of all the genres.
	const genres = await Genre.find().select('name id');
	if (genres.length == 0) return res.status(404).send('No records on DB');

	res.send(genres);
});

router.get('/:id', async (req, res) => {
	// Send the genre identified by the given id.
	const id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(400).send('Invalid ObjectId');

	try {
		const genre = await Genre.findById(req.params.id).select('name _id');
		res.send(genre);
	} catch (err) {
		res.status(404).send('Object not found.');
	}
});

router.post('/', async (req, res) => {
	// Accept request to add new genre

	const { error } = validateGenre(req.body);

	if (error) return res.status(400).send(error[0].message);

	try {
		const genre = new Genre({
			name: req.body.name
		});
		const result = await genre.save();
		res.send(_.pick(result, ['name', '_id']));
	} catch (err) {
		res.status(400).send('Genre already present');
	}
});

router.put('/:id', async (req, res) => {
	// Update the genre indentified by the given id.

	const { error } = validateGenre(req.body);

	if (error) return res.status(400).send(error.message);

	try {
		const genre = await Genre.findByIdAndUpdate(
			req.params.id,
			{ $set: { name: req.body.name } },
			{ new: true }
		).select('name _id');
		res.send(genre);
	} catch (err) {
		res.status(404).send(err.message);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const genre = await Genre.findByIdAndDelete(req.params.id).select('name');
		res.send(genre);
	} catch (err) {
		res.status(404).send(err.message);
	}
});

module.exports = router;
