module.exports = (client) => {
  client.distube.on("addSong", (queue, song) => {
    queue.textChannel.send({
      content: `${client.emojis.cache.get(
        client.config.emotes.plus
      )} Added song **${song.name}** to the queue\n\n**Song info**:`,
      embeds: [client.distube.songInfoEmbed(song)],
    });
  });
};
