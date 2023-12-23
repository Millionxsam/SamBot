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

    if (interaction.guild.ownerId === target.id)
      return interaction.error("You can't kick the owner of the server");

    if (
      target.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.error(
        "You cannot kick that user because they have the same or higher role than you."
      );

    if (!target.kickable)
      return interaction.error(
        "I can't kick that user, either I don't have permission or they have a higher role than me"
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
