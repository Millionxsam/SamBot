const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  chatbot: {
    type: Object,
    required: true,
    default: {
      channels: [],
    },
  },
});

const model = mongoose.model("users", userSchema);

module.exports = model;
