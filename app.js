const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
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

module.exports = app;
