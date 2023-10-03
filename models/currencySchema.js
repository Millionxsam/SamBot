const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  quarks: { type: Number, required: true, default: 0 },
  bank: { type: Number, required: true, default: 0 },
  items: { type: Array, required: true, default: [] },
  job: {
    type: Object,
    required: true,
    default: {
      current: null,
      level: 0,
      xp: 0,
      lastWorked: null,
      unlocked: 1,
    },
  },
});

const model = mongoose.model("currency", currencySchema);

module.exports = model;
