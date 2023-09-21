module.exports = {
  name: "resume",
  description: "Resume the paused song (same as /unpause)",
  run: (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    if (!queue.paused) {
      queue.pause();
      return interaction.reply("⏸️ **Song paused**");
    }

    queue.resume();
    interaction.reply("▶️ **Song resumed**");
  },
};
