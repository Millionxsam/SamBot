module.exports = (client) => {
  client.distube.on("finish", (queue) => {
    queue.textChannel.send(
      "✅ **Finished queue! Now leaving voice channel...**"
    );
  });
};
