module.exports = {
  name: "autoplay",
  description:
    "Toggle to automatically play related videos after the queue is finished",
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    const autoplay = queue.toggleAutoplay();
    if (interaction.isButton()) {
      await interaction.update(client.distube.queueInfoEmbed(queue));
      await interaction.followUp(
        `🔄️ **Autoplay ${autoplay ? "enabled" : "disabled"}**`
      );
      return;
    }
    interaction.reply(`🔄️ **Autoplay ${autoplay ? "enabled" : "disabled"}**`);
  },
};
