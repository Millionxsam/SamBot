const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "replay",
  description:
    "Replay the current song from the beginning once (not repeating)",
  run: (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    queue.seek(0);
    interaction.reply(`↩️ Replaying **${queue.songs[0].name}**`);
  },
};
