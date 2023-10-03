const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "level-leaderboard",
  description: "See the leaderboard for the levels in the current server",
  run: async (client, interaction) => {
    const profiles = await client.levels.find({
      guildId: interaction.guild.id,
    });

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name}\'s Leaderboard`)
      .setColor(client.config.main_color)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription(
        profiles
          .sort((a, b) => {
            return b.level - a.level;
          })
          .map((u, index) => {
            const member = interaction.guild.members.cache.get(u.userId);
            if (!member) return "";
            return `\`#${index + 1}\` **${member.user.displayName}** - Level ${
              u.level
            }`;
          })
          .join("\n\n")
      );

    interaction.reply({ embeds: [embed] });
  },
};
