module.exports = {
  name: "nowplaying",
  description: "Get information about the song that's currently playing",
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    const song = queue.songs[0];
    interaction.reply({
      content: "Info of current song:\n⠀",
      embeds: [client.distube.songInfoEmbed(song)],
    });
  },
};
