const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwt private key is not defined.');
  process.exit(1);
}

if (!config.get('db')) {
  console.log('FATAL ERROR: db connection string is not defined');
  process.exit(1);
}

mongoose
  .connect(
    config.get('db'),
    { useNewUrlParser: true }
  )
  .then(() => console.log('Connected to mongodb'))
  .catch(err => console.error('Could not connect to MongoDb', err.message));

app.use(express.json());

app.use(cors());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use((req, res, next) => {
  const error = new Error('Resource Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      statusCode: error.status
    }
  });
});

module.exports = app;
