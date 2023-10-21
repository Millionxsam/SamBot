const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  lastVoted: { type: Number, required: true, default: 0 },
});

const model = mongoose.model("votes", voteSchema);

module.exports = model;
