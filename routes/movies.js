const { Movie, validate } = require('../models/movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const movies = await Movie.find().sort('name');
  res.status(200).send(movies);
});

router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    return res.status(200).send(movie);
  } catch (ex) {
    console.log(ex.message);
    return res.status(404).send(`Movie with id ${req.params.id} was not found`);
  }
});

router.post('/', auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(400).send('Invalid genre id.');
  }

  try {
    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.status(201).send(movie);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    res.status(500).send('Ops! Something failed on our side');
  }
});

router.put('/:id', auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(400).send('Invalid genre id.');
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    { new: true }
  );

  if (!movie) {
    return res.status(404).send('The movie with the given ID was not found');
  }
  res.status(200).send(movie);
});

router.delete('/:id', [auth, admin], async (req, res, next) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) {
    return res.status(404).send('The movie with the given ID was not found');
  }

  res.status(204).send();
});

module.exports = router;
