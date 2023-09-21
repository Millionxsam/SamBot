const weather = require("weather-js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { main_color: color } = require("../../config.json");

module.exports = {
  name: "weather",
  description: "Shows weather information for a location",
  options: [
    {
      name: "location",
      description: "Location to get weather information for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: (client, interaction) => {
    const loc = interaction.options.getString("location");
    weather.find({ search: loc, degreeType: "F" }, function (err, result) {
      if (!result.length)
        return interaction.error("Please enter a valid location");

      var current = result[0].current;
      var location = result[0].location;
      if (err) return interaction.error("Please enter a valid location");

      let embed = new EmbedBuilder()
        .setDescription(`**${current.skytext}**`)
        .setAuthor({ name: `Weather for ${current.observationpoint}` })
        .setColor(color)
        .setThumbnail(current.imageUrl)
        .addFields({
          name: "Timezone",
          value: `UTC${location.timezone}`,
          inline: true,
        })
        .addFields({
          name: "Degree Type",
          value: location.degreetype,
          inline: true,
        })
        .addFields({
          name: "Temperature",
          value: `${current.temperature} Degrees`,
          inline: true,
        })
        .addFields({
          name: "Feels Like",
          value: `${current.feelslike} Degrees`,
          inline: true,
        })
        .addFields({ name: "Winds", value: current.winddisplay, inline: true })
        .addFields({
          name: "Humidity",
          value: `${current.humidity}%`,
          inline: true,
        });

      interaction.reply({
        embeds: [embed],
      });
    });
  },
};
