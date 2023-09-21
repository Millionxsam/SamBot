const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "forward",
  description: "Skip forward in the current song in seconds",
  options: [
    {
      name: "seconds",
      description: "How many seconds to skip forward",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      required: true,
    },
  ],
  run: (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    const seconds = interaction.options.getInteger("seconds");

    if (queue.currentTime + seconds > queue.songs[0].duration)
      return interaction.error(
        "The seconds you provided exceeds the song's duration"
      );

    queue.seek(queue.currentTime + seconds);
    interaction.reply(`⏩ Skipped forward **${seconds}** seconds`);
  },
};
