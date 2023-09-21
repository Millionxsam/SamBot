const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "whowouldwin",
  description: "Generate a 'who would win?' image with 2 user avatars",
  options: [
    {
      name: "user1",
      description: "The first user",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "user2",
      description: "The second user",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const user1 = interaction.options.getUser("user1").displayAvatarURL();
    const user2 = interaction.options.getUser("user2").displayAvatarURL();

    fetch(
      `https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${user1}&user2=${user2}`
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
