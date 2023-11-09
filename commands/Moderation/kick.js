const {
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "kick",
  description: "Kick a member from the server",
  defaultMemberPermissions: [PermissionFlagsBits.KickMembers],
  botPerms: ["KickMembers"],
  options: [
    {
      name: "member",
      description: "The member who you want to kick",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Why you are kicking this member",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: (client, interaction) => {
    const target = interaction.options.getMember("member");
    const reason =
      (interaction.options.getString("reason") || `No reason specified`) +
      ` - kicked by ${interaction.user.username}`;

    if (target.user.id === interaction.member.user.id)
      return interaction.error("You can't kick yourself");

    if (!target.kickable)
      return interaction.error(
        "I can't kick that user, either I don't have permission or they are above me in the role hierarchy."
      );

    if (reason.length > 512)
      return interaction.error(
        `The reason can\'t be over 512 characters (currently ${reason.length})`
      );

    target.kick(reason);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#FF0000")
          .setDescription(
            `✅ Member **${target.user.username}** has been kicked`
          )
          .setAuthor({
            name: `Member Kicked`,
            iconURL: target.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
