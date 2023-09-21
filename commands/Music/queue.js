module.exports = {
  name: "queue",
  description: "View the current queue",
  run: (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error("There is no music playing");

    const res = client.distube.queueInfoEmbed(queue);

    interaction.reply(res);
  },
};
