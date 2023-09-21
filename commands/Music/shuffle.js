module.exports = {
  name: "shuffle",
  description: "Shuffle the order of songs in queue",
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    await queue.shuffle();
    if (interaction.isButton()) {
      await interaction.update(client.distube.queueInfoEmbed(queue));
      await interaction.followUp("🔀 **Shuffled songs in the queue**");
      return;
    }
    interaction.reply("🔀 **Shuffled songs in the queue**");
  },
};
