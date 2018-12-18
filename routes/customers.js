const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res, next) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.status(200).send(customers);
});

router.get("/:id", async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    return res.status(200).send(customer);
  } catch (ex) {
    console.log(ex.message);
    return res
      .status(404)
      .send(`Customer with id ${req.params.id} was not found`);
  }
});

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });

  try {
    const result = await customer.save();
    console.log(result);
    res.status(201).send(customer);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    res.status(500).send("An error occurred");
  }
});

router.put("/:id", async (req, res, next) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    },
    {
      new: true
    }
  );

  if (!customer) {
    return res
      .status(404)
      .send(`Customer with id ${req.params.id} was not found`);
  }

  res.status(200).send(customer);
});

router.delete("/:id", async (req, res, next) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    return res
      .status(404)
      .send(`Customer with id ${req.params.id} was not found`);
  }

  res.status(204).send();
});

module.exports = router;
