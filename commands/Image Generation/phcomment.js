const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "phcomment",
  description: "Generate an image of a user commenting on the hub",
  options: [
    {
      name: "user",
      description: "The user who will be shown as the commenter",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "text",
      description: "What the comment will be",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const user = interaction.options.getUser("user");
    const text = interaction.options.getString("text");
    const avatar = user.displayAvatarURL({ size: 4096 });
    fetch(
      `https://nekobot.xyz/api/imagegen?type=phcomment&image=${avatar}&username=${user.username}&text=${text}`
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
