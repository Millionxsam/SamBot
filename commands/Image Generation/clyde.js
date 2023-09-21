const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "clyde",
  description:
    "Generate an image of clyde (the Discord system bot) saying anything you want",
  options: [
    {
      name: "text",
      description: "The text that clyde will send",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const text = interaction.options.getString("text");

    fetch(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`)
      .then((res) => res.json())
      .then(async (data) => {
        let embed = new EmbedBuilder().setImage(data.message);
        await interaction.followUp({
          embeds: [embed],
        });
      });
  },
};
