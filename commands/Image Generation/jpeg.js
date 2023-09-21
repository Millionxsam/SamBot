const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "jpeg",
  description: "Make someone's avatar look low quality",
  options: [
    {
      name: "user",
      description:
        "The user whose avatar to use (leave blank to select yourself)",
      required: false,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const user = (
      interaction.options.getUser("user") || interaction.user
    ).displayAvatarURL();

    fetch(`https://nekobot.xyz/api/imagegen?type=jpeg&url=${user}`)
      .then((res) => res.json())
      .then(async (data) => {
        let embed = new EmbedBuilder().setImage(data.message);
        await interaction.followUp({
          embeds: [embed],
        });
      });
  },
};
