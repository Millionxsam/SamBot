const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema({
  serverId: { type: Number, required: true },
  createdBy: { type: Number, required: true },
  name: { type: String, required: true },
  id: { type: String, required: true },
});

const model = mongoose.model("backups", backupSchema);

module.exports = model;
