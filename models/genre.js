const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
  };
  return Joi.validate(genre, schema);
}

exports.genreSchema = genreSchema;
exports.Genre = mongoose.model("Genre", genreSchema);
exports.validate = validateGenre;
