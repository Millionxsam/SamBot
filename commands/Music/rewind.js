const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "rewind",
  description: "Rewind the current song in seconds",
  options: [
    {
      name: "seconds",
      description: "How many seconds to rewind",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      required: true,
    },
  ],
  run: (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    const seconds = interaction.options.getInteger("seconds");

    if (queue.currentTime - seconds < 0)
      return interaction.error(
        "The seconds you provided exceeds the song's duration"
      );

    queue.seek(queue.currentTime - seconds);
    interaction.reply(`⏪ Rewinded **${seconds}** seconds`);
  },
};
