module.exports = {
  name: "stop",
  description: "Stop playing music",
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error("There is no music playing");

    queue.stop();
    if (interaction.isButton()) {
      await interaction.update(client.distube.queueInfoEmbed(queue, true));
      await interaction.followUp("⏹️ **Music stopped**");
      return;
    }
    interaction.reply("⏹️ **Music stopped**");
  },
};
