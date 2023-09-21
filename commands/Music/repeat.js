const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "repeat",
  description: "Make the current song repeat, or the whole queue repeat",
  options: [
    {
      name: "mode",
      description: "What you want to set the repeat mode to",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Loop the current song", value: "song" },
        { name: "Loop the whole queue", value: "queue" },
        { name: "Turn repeat mode off", value: "off" },
      ],
    },
  ],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    let mode = interaction.options.getString("mode");

    switch (mode) {
      case "off":
        mode = 0;
        break;
      case "song":
        mode = 1;
        break;
      case "queue":
        mode = 2;
        break;
    }

    mode = queue.setRepeatMode(mode);

    mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";
    if (interaction.isButton()) {
      await interaction.update(client.distube.queueInfoEmbed(queue));
      await interaction.followUp(`🔁 Set repeat mode to **${mode}**`);
      return;
    }
    interaction.reply(`🔁 Set repeat mode to **${mode}**`);
  },
};
