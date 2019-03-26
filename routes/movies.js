const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { validateMovie, Movie } = require("../models/movie");
const { Genre } = require("../models/genre");

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(console.log("Connected successfullly to DB from inside : movies.js"))
  .catch(err =>
    console.log("Error in connecting to DB from inside : movies.js")
  );

router.get("/", async (req, res) => {
  const movies = await Movie.find().populate('Genre', 'name').sort('title').select('-__v');
  if (movies.length == 0) return res.status(404).send("No records found on DB");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  try {
    // Search for the movie
    const movie = await Movie.findById(req.params.id).populate('Gerne', 'name').select('-__v');
    // If movie  is found
    res.send(movie);
  } catch (err) {
    console.log(err["message"]);
    res.status(404).send("No such object found");
  }
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.message);
  try {
    const genre = await Genre.findById(req.body.genre);
    const rb = req.body;
    const movie = new Movie({
      title: rb.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: rb.numberInStock ? rb.numberInStock : 0,
      dailyRentalRate: rb.dailyRentalRate ? rb.dailyRentalRate : 4
    });
    const result = await movie.save();
    res.send(
      _.pick(result, [
        "title",
        "genre.name -_id",
        "numberInStock",
        "dailyRenatalRate"
      ])
    );
  } catch (err) {
    res.status(400).send(err["message"]);
  }
});

module.exports = router;
