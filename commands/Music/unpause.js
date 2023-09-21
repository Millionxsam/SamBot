module.exports = {
  name: "unpause",
  description: "Unpause the current song (same as /resume)",
  run: (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    if (!queue.paused) {
      queue.pause();
      return interaction.reply("⏸️ **Song paused**");
    }

    queue.resume();
    interaction.reply("▶️ **Song unpaused**");
  },
};
