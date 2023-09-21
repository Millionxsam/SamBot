const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "deepfry",
  description: "Deepfry someone!",
  options: [
    {
      name: "user",
      description: "The user to deepfry, leave blank to select yourself",
      required: false,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const user = interaction.options.getUser("user") || interaction.user;
    const avatar = user.displayAvatarURL({ size: 4096 });
    fetch(`https://nekobot.xyz/api/imagegen?type=deepfry&image=${avatar}`)
      .then((res) => res.json())
      .then(async (data) => {
        let embed = new EmbedBuilder()
          .setTitle("Deepfried!")
          .setImage(data.message);
        await interaction.followUp({
          embeds: [embed],
        });
      });
  },
};
