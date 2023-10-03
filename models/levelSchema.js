const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  level: { type: Number, required: true, default: 0 },
  xp: { type: Number, required: true, default: 0 },
});

const model = mongoose.model("levels", levelSchema);

module.exports = model;
