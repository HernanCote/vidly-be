const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const { Genre, validate } = require('../models/genre');

router.get('/', async (req, res, next) => {
  const genres = await Genre.find();
  res.status(200).send(genres);
});

router.get('/:id', async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);
    res.status(200).send(genre);
  } catch (ex) {
    console.log(ex.message);
    return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  }
});

router.post('/', auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = new Genre({
    name: req.body.name
  });

  try {
    const result = await genre.save();
    console.log(result);
    res.status(201).send(genre);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    res.status(500).send('An error occurred');
  }
});

router.put('/:id', auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true
    }
  );

  if (!genre) {
    return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  }

  res.status(200).send(genre);
});

router.delete('/:id', [auth, admin], async (req, res, next) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  }

  res.status(204).send();
});

module.exports = router;
