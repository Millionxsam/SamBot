module.exports = (client) => {
  client.distube.on("playSong", (queue, song) => {
    const res = client.distube.queueInfoEmbed(queue);
    res.content = `▶️ Now playing **${song.name}**${
      queue.repeatMode
        ? `\n**(repeating ${
            queue.repeatMode === 1 ? "song" : "queue"
          }. Do /repeat to turn off)**`
        : ""
    }\n\n**Queue:**`;

    queue.textChannel.send(res);
  });
};
