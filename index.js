(async () => {
  require("dotenv").config();
  const process = require("process");

  process.on("uncaughtException", (e) => {
    console.error(e);
  });

  // Setting up bot -->
  const { Client, Collection } = require("discord.js");
  const client = new Client({ intents: 3276799 });

  // Setting client shortcuts & collections
  client.commands = new Collection();
  client.textcmds = new Collection();
  client.config = require("./config.json");
  client.shop = require("./shop.json");

  //Shortcut functions
  client.random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Setting up DisTube -->
  const { DisTube } = require("distube");

  const { DeezerPlugin } = require("@distube/deezer");
  const { SoundCloudPlugin } = require("@distube/soundcloud");
  const { SpotifyPlugin } = require("@distube/spotify");
  const { YtDlpPlugin } = require("@distube/yt-dlp");
  const { readdirSync } = require("fs");

  client.distube = new DisTube(client, {
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new DeezerPlugin(),
      new SoundCloudPlugin(),
      new SpotifyPlugin({ emitEventsAfterFetching: true }),
      new YtDlpPlugin(),
    ],
  });

  const filters = [];
  for (let filter in client.distube.filters) filters.push(filter);

  module.exports = { distubeFilters: filters };

  require("./distubeFunctions.js")(client);

  readdirSync("./events/distube/")
    .filter((file) => file.endsWith(".js"))
    .forEach((file) => {
      require(`./events/distube/${file}`)(client);
    });

  // Setting up database -->
  const mongoose = require("mongoose");
  await mongoose
    .connect(process.env.mongo_uri)
    .then(() => console.log("✅ Connected to the database"));

  client.currency = require("./models/currencySchema.js");
  client.backups = require("./models/backupSchema.js");

  // Setting up commands and events handlers -->
  ["commands", "events"].forEach((handler) => {
    require(`./handlers/${handler}.js`)(client);
  });

  // Starting the backend -->
  require("./server.js")(client);

  client.login(process.env.token);
})();
