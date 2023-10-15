const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "imagine",
  description: "Use AI image generation to create an image based on a prompt!",
  options: [
    {
      name: "prompt",
      description: "Briefly describe what you want the image to look like",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    await interaction.reply(
      `${client.emojis.cache.get(
        client.config.emotes.loading
      )} **Generating image...**`
    );
    const { Hercai } = require("hercai");
    const herc = new Hercai();

    const url = (
      await herc.drawImage({
        model: "v2",
        prompt: interaction.options.getString("prompt"),
      })
    ).url;

    const embed = new EmbedBuilder()
      .setTitle(interaction.options.getString("prompt"))
      .setColor(client.config.main_color)
      .setImage(url);

    await interaction.editReply({ content: "", embeds: [embed] });
  },
};
