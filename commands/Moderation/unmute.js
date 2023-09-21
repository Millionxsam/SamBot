const {
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "unmute",
  description: "Undo the /mute command",
  defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
  botPerms: ["ModerateMembers"],
  options: [
    {
      name: "member",
      description: "The member who you want to unmute",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Why you are unmuting this member",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const target = interaction.options.getMember("member");
    const reason =
      (interaction.options.getString("reason") || `No reason specified`) +
      ` - unmuted by ${interaction.user.username}`;

    if (target.user.id === interaction.member.user.id)
      return interaction.error("You can't unmute yourself");

    if (!target.moderatable)
      return interaction.error(
        "I can't unmute that user, they are higher than me in the hierarchy"
      );

    if (reason.length > 512)
      return interaction.error(
        `The reason can\'t be over 512 characters (currently ${reason.length})`
      );

    if (!target.isCommunicationDisabled())
      return interaction.error("That member is not muted");

    await target.timeout(null, reason);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#2EFF00")
          .setDescription(
            `✅ Member **${target.user.username}** has been unmuted`
          )
          .setAuthor({
            name: `Member Unmuted`,
            iconURL: target.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
