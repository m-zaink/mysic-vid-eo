const _ = require('lodash');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { validateMovie, Movie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
	const movies = await Movie.find()
		.populate('Genre', 'name')
		.sort('title')
		.select('-__v');
	if (movies.length == 0)
		return res.status(404).send('No records found on DB');
	res.send(movies);
});

router.get('/:id', async (req, res) => {
	try {
		// Search for the movie
		const movie = await Movie.findById(req.params.id)
			.populate('Genre', 'name')
			.select('-__v');
		// If movie  is found
		res.send(movie);
	} catch (err) {
		console.log(err['message']);
		res.status(404).send('No such object found');
	}
});

router.post('/', async (req, res) => {
	const { error } = validateMovie(req.body);
	if (error) return res.status(400).send(error.message);

	try {
		const rb = req.body;
		const genre = await Genre.findById(rb.genre);
		const movie = new Movie({
			title: rb.title,
			genre: {
				_id: genre._id,
				name: genre.name
			},
			numberInStock: rb.numberInStock,
			dailyRentalRate: rb.dailyRentalRate
		});
		const result = await movie.save();
		
		res.send(
			_.pick(result, [
				'title',
				'genre.name -_id',
				'numberInStock',
				'dailyRentalRate'
			])
		);
	} catch (err) {
		res.status(400).send(err['message']);
	}
});

router.put('/:id', async (req, res) => {
	const { error } = Joi.validate(req.body, {
		title: Joi.string().regex(new RegExp('^[a-zA-Z0-9][a-zA-Z0-9 -]*$')),
		numberInStock: Joi.number()
			.min(0)
			.max(100),
		dailyRentalRate: Joi.number()
			.min(1)
			.max(5)
	});
	if (error) return res.status(400).send(error.message);

	try {
		const movie = await Movie.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					title: req.body.title
				}
			},
			{ new: true }
		);
		res.send(movie);
	} catch (err) {
		res.status(404).send(err['message']);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const result = await Movie.findByIdAndDelete(req.params.id);
		if (!result) throw new Error('No such object found');
		res.send(_.pick(result, ['title', 'genre']));
	} catch (err) {
		res.status(404).send('No such object found.');
	}
});

module.exports = router;
