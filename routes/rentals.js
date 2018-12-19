const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");

Fawn.init(mongoose);

router.get("/", async (req, res, next) => {
  const rentals = await Rental.find().sort({ dateOut: -1 });
  res.status(200).send(rentals);
});

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);

  if (!customer) {
    return res.status(404).send("Invalid Customer ID");
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(404).send("Invalid Movie ID");
  }

  if (movie.numberInStock === 0)
    return res.statusCode(400).send("This movie is not available");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 }
        }
      )
      .run();
    res.status(201).send(rental);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[fields].message);
    }
    res.status(500).send("Ops! Something failed on our side");
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    return res.status(404).send("The rental with the given ID was not found");
  }

  res.status(200).send(rental);
});

module.exports = router;