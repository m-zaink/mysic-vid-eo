const _ = require("lodash");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { Genre, validateGenre } = require("../models/genre");

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(
    console.log("Connected successfullly to DB from inside : handler_genres.js")
  )
  .catch(err =>
    console.log("Error in connecting to DB from inside : handler_genres.js")
  );

router.get("/", async (req, res) => {
  // Send list of all the genres.

  const genres = await Genre.find().select("name id");
  // If no records were found on DB
  if (genres.length == 0) return res.status(404).send("No records on DB");
  // If found, send all genres
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    // Check if the genre is present and then store it on genre
    const genre = await Genre.findById(req.params.id);
    // Send genre if found.
    res.send(genre);
  } catch (err) {
    // If requested genre is not present
    // Send a 404 status
    res.status(404).send("Object not found.");
  }
});

router.post("/", async (req, res) => {
  // Accept request to add new genre

  // Validate the new genre so sent
  const { error } = validateGenre(req.body);

  // If invalid, return 400 (Bad Request)
  if (error) return res.status(400).send(error[0].message);

  // Add the new genre to the genres list maintained at the top
  try {
    const genre = new Genre({
      name: req.body.name
    });
    const result = await genre.save();
    // Send the genre back
    res.send(result);
  } catch (err) {
    res.status(400).send('Genre already present');
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.message);

  // Check if the genre is present in the genres list and update
  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { $set: { name: req.body.name } },
      { new: true }
    );
    // Send the updated genre back
    res.send(genre);
  } catch (err) {
    // If not present, return 404 (Object Not Found)
    res.status(404).send("Object not found.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Delete the specified genre if present
    const genre = await Genre.findByIdAndDelete(req.params.id);
    // Return the deleted genre
    res.send(genre);
  } catch (err) {
    // If genre not present, return 404 (Object Not Found)
    res.status(404).send("Object not found.");
  }
});

module.exports = router;
