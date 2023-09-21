const ms = require("ms");
const { main_color } = require("../../config.json");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "roleinfo",
  description: "Shows info of the specified role",
  options: [
    {
      name: "role",
      description: "The role to get information about",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  run: (client, interaction) => {
    let role = interaction.options.getRole("role");

    const status = {
      false: "No",
      true: "Yes",
    };

    let embed = new EmbedBuilder()
      .setColor(role.color)
      .setTitle(`Role Info of \`${role.name}\``)
      //   .setThumbnail(
      //     role.icon
      //       ? `https://cdn.discordapp.com/role-icons/${interaction.guild.id}/${role.icon}.webp?quality=lossless`
      //       : ""
      //   )
      .addFields({ name: "**Name**", value: role.name, inline: true })
      .addFields({ name: "**ID**", value: `${role.id}`, inline: true })
      .addFields({ name: "**Hex Color**", value: role.hexColor, inline: true })
      .addFields({
        name: "**Unicode Emoji**",
        value: role.unicodeEmoji || "None",
        inline: true,
      })
      .addFields({
        name: "**Created At**",
        value: `<t:${Math.round(role.createdTimestamp / 1000)}:f>`,
        inline: true,
      })
      .addFields({
        name: "**Managed by an external service?**",
        value: status[role.managed],
        inline: true,
      })
      .addFields({
        name: "**Hoisted**",
        value: status[role.hoist],
        inline: true,
      })
      .addFields({ name: "**Members**", value: `${role.members.size}` })
      .addFields({
        name: "**Position**",
        value: `${role.position + 1}`,
        inline: true,
      })
      .addFields({
        name: "**Tags**",
        value: JSON.stringify(role.tags || "None")
          .split("{")
          .join("")
          .split("}")
          .join(),
        inline: true,
      })
      .addFields({
        name: "**Mentionable**",
        value: status[role.mentionable],
        inline: true,
      })
      .addFields({
        name: "**General Permissions**",
        value: `${role.permissions.toArray().join("\n")}`,
        inline: true,
      })
      .addFields({
        name: "**Permissions in this channel**",
        value: `${role
          .permissionsIn(interaction.channel)
          .toArray()
          .join("\n")}`,
        inline: true,
      });

    interaction.reply({
      embeds: [embed],
    });
  },
};
