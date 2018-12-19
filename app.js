const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://localhost/vidly",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to mongodb"))
  .catch(err => console.error("Could not connect to MongoDb", err.message));

app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

module.exports = app;
