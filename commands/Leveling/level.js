const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "level",
  description: "Get your own or someone else's level and XP",
  options: [
    {
      name: "user",
      description:
        "The user whose level and XP you want to get (leave blank to select yourself)",
      required: false,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: async (client, interaction) => {
    const user = interaction.options.getUser("user") || interaction.member.user;

    if (user.bot) return interaction.error("Bots cannot have levels");

    const { guild } = interaction;
    const data =
      (await client.levels.findOne({
        userId: user.id,
        guildId: guild.id,
      })) || {};

    const requiredXp = (10 + (data.level || 0) * 5) * 10;

    const embed = new EmbedBuilder()
      .setTitle(`${user.displayName}\'s Profile`)
      .setThumbnail(user.displayAvatarURL())
      .setColor(client.config.main_color)
      .addFields(
        { name: "Level", value: (data.level || 0).toString() },
        { name: "XP", value: (data.xp || 0).toString() + `/${requiredXp}` }
      );

    interaction.reply({ embeds: [embed] });
  },
};
