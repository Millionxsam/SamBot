module.exports = (client) => {
  client.distube.on("addList", (queue, playlist) => {
    queue.textChannel.send({
      content: `${client.emojis.cache.get(
        client.config.emotes.plus
      )} Added playlist **${
        playlist.name
      }** to the queue\n\n**Playlist info**:`,
      embeds: [client.distube.playlistInfoEmbed(playlist)],
    });
  });
};
