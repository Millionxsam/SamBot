module.exports = {
  name: "pause",
  description: "Pause the current song",
  run: async (client, interaction) => {
    const queue = await client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    if (queue.paused) {
      await queue.resume();
      if (interaction.isButton()) {
        await interaction.update(client.distube.queueInfoEmbed(queue));
        await interaction.followUp("▶️ **Song unpaused**");
        return;
      }
      return interaction.reply("▶️ **Song unpaused**");
    }

    await queue.pause();
    if (interaction.isButton()) {
      await interaction.update(client.distube.queueInfoEmbed(queue));
      await interaction.followUp("⏸️ **Song paused**");
      return;
    }
    await interaction.reply("⏸️ **Song paused**");
  },
};
