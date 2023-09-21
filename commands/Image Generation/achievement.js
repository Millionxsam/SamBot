const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { main_color: color } = require("../../config.json");

module.exports = {
  name: "achievement",
  description: "Generate an image of getting a minecraft achievement",
  options: [
    {
      name: "achievement",
      type: ApplicationCommandOptionType.String,
      required: true,
      description: "The achievement name to show",
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    let achievement = interaction.options.getString("achievement");
    achievement = achievement.split(" ");
    achievement = achievement.join("+");

    if (achievement.length > 22)
      return interaction.error(
        `Please type a text no bigger than 22 characters (currently ${achievement.length})`
      );

    let embed = new EmbedBuilder()
      .setImage(
        `https://minecraftskinstealer.com/achievement/20/Achievement+Unlocked%21/${achievement}`
      )
      .setColor(color);

    await interaction.followUp({
      embeds: [embed],
    });
  },
};
