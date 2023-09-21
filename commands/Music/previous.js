module.exports = {
  name: "previous",
  description: "Go back to the previous song",
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    if (!queue.previousSongs.length)
      return interaction.error(
        "There were no songs before this one in this queue"
      );

    await queue.previous();
    if (interaction.isButton()) {
      await interaction.update(client.distube.queueInfoEmbed(queue));
      await interaction.followUp(`⏮️ **Returned to previous song**`);
      return;
    }
    interaction.reply(`⏮️ **Returned to previous song**`);
  },
};
