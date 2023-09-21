module.exports = (client) => {
  client.distube.on("empty", (channel) => {
    channel.send("💤 Voice channel is empty, now stopping the music");
  });
};
