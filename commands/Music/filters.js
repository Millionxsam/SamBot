const { ApplicationCommandOptionType } = require("discord.js");
const { distubeFilters: filters } = require("../../index.js");
filters.push("Clear all");

module.exports = {
  name: "filters",
  description: "Toggle filters for the music playing",
  options: [
    {
      name: "filter",
      description: "The filter you want to toggle",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: filters.map((f) => {
        return { name: f, value: f };
      }),
    },
  ],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    const filter = interaction.options.getString("filter");

    if (filter === "Clear all") {
      if (!queue.filters.size)
        return interaction.error("There are already no filters enabled");

      queue.filters.clear();
      return interaction.reply(
        `${client.emojis.cache.get(
          client.config.emotes.minus
        )} **All filters removed**`
      );
    }

    let added;

    if (queue.filters.has(filter)) {
      queue.filters.remove(filter);
      added = false;
    } else if (!queue.filters.has(filter)) {
      queue.filters.add(filter);
      added = true;
    }

    interaction.reply(
      `${
        added
          ? client.emojis.cache.get(client.config.emotes.plus)
          : client.emojis.cache.get(client.config.emotes.minus)
      } The filter **${filter}** has been toggled **${
        added ? "on" : "off"
      }**\n\n**Current filters:** ${queue.filters.names.join(", ") || "none"}`
    );
  },
};
