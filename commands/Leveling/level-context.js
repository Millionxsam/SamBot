const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "Check Level",
  type: 2,
  run: async (client, interaction) => {
    const user = interaction.targetUser;

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

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
