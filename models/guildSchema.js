const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  leveling: {
    type: Object,
    required: true,
    default: {
      enabled: false,
      levelUpMode: "reply",
      channelId: null,
      message: null,
    },
  },
  music: {
    type: Object,
    required: true,
    default: {
      enabled: true,
    },
  },
  chatbot: {
    type: Object,
    required: true,
    default: {
      enabled: true,
      channels: [],
    },
  },
});

const model = mongoose.model("guilds", guildSchema);

module.exports = model;
