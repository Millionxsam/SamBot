const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "threat",
  description:
    'Generate an image of the meme "biggest threats to society" with an avatar of someone',
  options: [
    {
      name: "user",
      description:
        "The user who will be shown as the threat (leave blank to select yourself)",
      required: false,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const user = interaction.options.getUser("user") || interaction.user;
    const avatar = user.displayAvatarURL({ size: 4096 });
    fetch(`https://nekobot.xyz/api/imagegen?type=threats&url=${avatar}`)
      .then((res) => res.json())
      .then(async (data) => {
        let embed = new EmbedBuilder().setImage(data.message);
        await interaction.followUp({
          embeds: [embed],
        });
      });
  },
};
