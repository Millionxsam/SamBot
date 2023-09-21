const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "seek",
  description: "Skip to a point in the current song",
  options: [
    {
      name: "position",
      description: "The position (in seconds) to seek to",
      type: ApplicationCommandOptionType.Integer,
      minValue: 0,
      required: true,
    },
  ],
  run: (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    const seconds = interaction.options.getInteger("position");
    if (queue.songs[0].duration < seconds)
      return interaction.error(
        "The time you provided is longer than the song duration"
      );

    queue.seek(seconds);
    interaction.reply(`✅ Seeked to position **${seconds} seconds**`);
  },
};
