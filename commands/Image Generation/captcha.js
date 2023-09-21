const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "captcha",
  description: "Captcha with someone's avatar",
  options: [
    {
      name: "avatar",
      description: "The user whose avatar will be in the captcha",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "text",
      description: 'This will be in the: "select all images with..."',
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const avatar = interaction.options.getUser("avatar").displayAvatarURL();
    const text = interaction.options.getString("text");

    fetch(
      `https://nekobot.xyz/api/imagegen?type=captcha&url=${avatar}&username=${text}`
    )
      .then((res) => res.json())
      .then(async (data) => {
        let embed = new EmbedBuilder().setImage(data.message);
        await interaction.followUp({
          embeds: [embed],
        });
      });
  },
};
