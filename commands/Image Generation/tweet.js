const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { main_color: color } = require("../../config.json");
module.exports = {
  name: "tweet",
  description: "Generate an image of a tweet",
  options: [
    {
      name: "text",
      description: "The text you want to tweet",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    interaction.deferReply();

    const user = interaction.member.user.username;
    const text = interaction.options.getString("text");

    const res = await fetch(
      encodeURI(
        `https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`
      )
    );

    const json = await res.json();
    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(color)
          .setTitle(`${user} just tweeted!`)
          .setImage(`${json.message}`),
      ],
    });
  },
};
