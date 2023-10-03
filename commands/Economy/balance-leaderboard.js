const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "economy-leaderboard",
  description:
    "View the leaderboard for the balance of this server or globally",
  options: [
    {
      name: "server",
      description: "The leaderboard of this server",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "global",
      description: "The global leaderboard of all SamBot users",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (client, interaction) => {
    const embed = new EmbedBuilder().setColor(client.config.main_color);
    const users = await client.currency.find();
    users.sort((a, b) => {
      a = a.quarks + a.bank;
      b = b.quarks + b.bank;
      return b - a;
    });

    if (interaction.options.getSubcommand() === "global") {
      embed
        .setTitle(`Global Economy Leaderboard`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `The leaderboard is based on who has the highest value of wallet balance plus bank balance\n\n${users
            .map((u, index) => {
              return `\`#${index + 1}\` - **${
                client.users.cache.get(u.userId).displayName
              }** - ${client.quarks}${u.quarks + u.bank}`;
            })
            .join("\n\n")}`
        );

      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "server") {
      embed
        .setTitle(`Server Economy Leaderboard`)
        .setThumbnail(
          interaction.guild.iconURL() || client.user.displayAvatarURL()
        )
        .setDescription(
          `The leaderboard is based on who has the highest value of wallet balance plus bank balance\n\n${users
            .filter((u) => interaction.guild.members.cache.get(u.userId))
            .map((u, index) => {
              return `\`#${index + 1}\` - **${
                client.users.cache.get(u.userId).displayName
              }** - ${client.quarks}${u.quarks + u.bank}`;
            })
            .join("\n\n")}`
        );

      interaction.reply({ embeds: [embed] });
    }
  },
};
