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
    {
      name: "model",
      description:
        "Model to use for generation. Each generate in different ways, see which one you like best",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "V1", value: "v1" },
        { name: "V2", value: "v2" },
        { name: "V3 (DALL-E)", value: "v3" },
        { name: "Lexica", value: "lexica" },
        { name: "Prodia (MAY BE NSFW)", value: "prodia" },
      ],
    },
  ],
  run: async (client, interaction) => {
    await interaction.reply(
      `${client.emojis.cache.get(
        client.config.emotes.loading
      )} **Generating image with the prompt "${interaction.options.getString(
        "prompt"
      )}"...** This may take a while`
    );
    const { Hercai } = require("hercai");
    const herc = new Hercai();

    const url = (
      await herc.drawImage({
        model: interaction.options.getString("model"),
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
