const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  GuildMemberRoleManager,
} = require("discord.js");
const { main_color } = require("../../config.json");

module.exports = {
  name: "userinfo",
  description: "Get information about a user",
  options: [
    {
      name: "user",
      description: "The user you want to get information about",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: (client, interaction) => {
    const status = {
      true: "Yes",
      false: "No",
    };

    interaction.options
      .getUser("user")
      .fetch(true)
      .then((user) => {
        interaction.guild.members.fetch(user).then((member) => {
          const embed = new EmbedBuilder();

          if (user.hexAccentColor) embed.setColor(user.hexAccentColor);
          else if (member.displayHexColor !== "#000000")
            embed.setColor(member.displayHexColor);
          else embed.setColor(main_color);

          embed
            .setTitle(`${user.username}\'s Information`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
              {
                name: "Display Name",
                value: user.displayName || user.username,
                inline: true,
              },
              {
                name: "Username",
                value: user.username || "None",
                inline: true,
              },
              {
                name: "Nickname",
                value: member.nickname || "None",
                inline: true,
              },
              { name: "ID", value: user.id, inline: true },
              {
                name: "Created At",
                value: `<t:${Math.round(user.createdTimestamp / 1000)}:f>`,
                inline: true,
              },
              {
                name: "Joined At",
                value: `<t:${Math.round(member.joinedTimestamp / 1000)}:f>`,
                inline: true,
              },
              {
                name: "Accent Color",
                value: user.hexAccentColor || "None",
                inline: true,
              },
              {
                name: "Display Color",
                value: member.displayHexColor || "None",
                inline: true,
              },
              {
                name: "Avatar URL",
                value: user.avatarURL() || "None",
                inline: true,
              },
              {
                name: "Banner URL",
                value: user.bannerURL() || "None",
                inline: true,
              },
              { name: "Bot?", value: status[user.bot], inline: true },
              {
                name: "System?",
                value: status[user.system],
                inline: true,
              },
              {
                name: "Flags",
                value: user.flags.toArray().join(", ") || "None",
                inline: true,
              },
              {
                name: "Kickable?",
                value: status[member.kickable],
                inline: true,
              },
              {
                name: "Bannable?",
                value: status[member.bannable],
                inline: true,
              },
              {
                name: "Last Boosted This Server",
                value: `<t:${Math.round(
                  (member.premiumSinceTimestamp || 0) / 1000
                )}:f>`,
                inline: true,
              },
              {
                name: "Roles",
                value: `${
                  member._roles.map((r) => `<@&${r}>`).join(", ") || "No roles"
                }`,
                inline: true,
              },
              {
                name: "Timed Out?",
                value: status[member.isCommunicationDisabled()],
                inline: true,
              },
              {
                name: "General Permissions",
                value: `${member.permissions.toArray().join("\n") || "None"}`,
                inline: true,
              },
              {
                name: "Permissions in this channel",
                value: `${
                  member
                    .permissionsIn(interaction.channel)
                    .toArray()
                    .join("\n") || "None"
                }`,
                inline: true,
              }
            );

          interaction.reply({ embeds: [embed] });
        });
      });
  },
};
