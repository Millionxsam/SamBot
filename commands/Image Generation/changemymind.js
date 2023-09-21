const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { main_color: color } = require("../../config.json");

module.exports = {
  name: "changemymind",
  description: 'Generate an image of the "change my mind" meme with any text',
  options: [
    {
      name: "text",
      description: "The text you want to show",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    interaction.deferReply();

    const text = interaction.options.getString("text");

    const res = await fetch(
      encodeURI(
        `https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`
      )
    );

    const json = await res.json();
    interaction.followUp({
      embeds: [new EmbedBuilder().setColor(color).setImage(`${json.message}`)],
    });
  },
};
