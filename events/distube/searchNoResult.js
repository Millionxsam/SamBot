module.exports = (client) => {
  client.distube.on("searchNoResult", (message, query) => {
    message.channel.send(`❌ No results found for **${query}**`);
  });
};
