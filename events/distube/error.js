module.exports = (client) => {
  client.distube.on("error", (channel, e) => {
    if (channel)
      channel.send(
        `❌ **There was an error while trying to play music:\n\n\`\`\`js\n${e}\`\`\`\nPlease try again later. If it keeps happening, do the /feedback command to report this, or issue a ticket in our server and include a screenshot of this message to report this error**`
      );
  });
};
