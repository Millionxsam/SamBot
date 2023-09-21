const pop = require("popcat-wrapper");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "color",
  description: "Get info about a hex color code",
  options: [
    {
      name: "color",
      description:
        "The hex color code of the color to get info about (ex. #fffff)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let color = interaction.options.getString("color");

    if (color.includes("#")) {
      color = color.split("#")[1];
    }

    try {
      const info = await pop.colorinfo(color);

      const embed = new EmbedBuilder()
        .setTitle("Color Info")
        .addFields(
          { name: "Hex", value: info.hex, inline: true },
          { name: "RGB", value: info.rgb, inline: true },
          { name: "Brighter Shade", value: info.brightened, inline: true }
        )
        .setColor(info.hex);

      interaction.reply({
        embeds: [embed],
      });
    } catch (e) {
      console.error(e);
      return interaction.error("Invalid Color!");
    }
  },
};
