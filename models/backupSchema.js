const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  createdBy: { type: String, required: true },
  name: { type: String, required: true },
  id: { type: String, required: true },
});

const model = mongoose.model("backups", backupSchema);

module.exports = model;
