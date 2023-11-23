const { default: axios } = require("axios");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "autocomplete",
  description:
    "Provide a search query to show autocompletions from Google search",
  options: [
    {
      name: "query",
      description: "The query to complete",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const query = interaction.options.getString("query");

    await interaction.reply(
      `${client.emojis.cache.get(
        client.config.emotes.loading
      )} **Getting autocompletions**...`
    );

    const results = (
      await axios.get(
        `https://suggestqueries.google.com/complete/search?client=firefox&q=${query}`
      )
    ).data;

    const embed = new EmbedBuilder()
      .setTitle("Autocompletions")
      .setDescription(
        `Autocompletions for: ${query}\n\n${
          results[1].map((r) => r).join("\n") || "None"
        }`
      )
      .setColor(client.config.main_color);

    await interaction.editReply({ content: "", embeds: [embed] });
  },
};
