const jwt = require("jsonwebtoken");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const config = require("config");

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }

  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  res.status(200).send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .required()
      .min(5)
      .max(50)
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
