const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: Number,
    min: 5
  }
});

// Utility functions for customer
function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .required()
      .min(5)
      .max(50),
    isGold: Joi.boolean(),
    phone: Joi.number().min(5)
  };
  return Joi.validate(customer, schema);
}

exports.Customer = mongoose.model("Customer", customerSchema);
exports.validate = validateCustomer;
