const express = require("express");
const Joi = require("joi");
const app = express();

app.use(express.json());

const genres = [
  {
    id: 1,
    name: "Action"
  },
  {
    id: 2,
    name: "Comedy"
  },
  {
    id: 3,
    name: "Thriller"
  },
  {
    id: 4,
    name: "Suspense"
  }
];

app.get("/api/genres", (req, res, next) => {
  res.status(200).send(genres);
});

app.get("/api/genres/:id", (req, res, next) => {
  const genre = validateGenreId(req.params.id);
  if (!genre) {
    return res.status(404).send(`Genre with id ${genreId} was not found`);
  }

  res.status(200).send(genre);
});

app.post("/api/genres", (req, res, next) => {
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };

  genres.push(genre);
  res.status(201).send(genre);
});

app.put("/api/genres/:id", (req, res, next) => {
  const genre = validateGenreId(req.params.id);
  if (!genre) {
    return res.status(404).send(`Genre with id ${genreId} was not found`);
  }

  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  genre.name = req.body.name;
  res.status(200).send(genre);
});

app.delete("/api/genres/:id", (req, res, next) => {
  const genre = validateGenreId(req.params.id);
  if (!genre) {
    return res.status(404).send(`Genre with id ${genreId} was not found`);
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.status(200).send();
});

// Utility functions related to genre

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  };
  return Joi.validate(genre, schema);
}

function validateGenreId(genreId) {
  const genreId = parseInt(req.params.id);
  const genre = genres.find(g => g.id == genreId);
  return genre;
}
