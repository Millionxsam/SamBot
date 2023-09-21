const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  quarks: { type: Number, required: true, default: 0 },
  bank: { type: Number, required: true, default: 0 },
  items: { type: Array, required: true, default: [] },
});

const model = mongoose.model("currency", currencySchema);

module.exports = model;
