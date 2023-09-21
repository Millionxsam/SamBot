const {
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "mute",
  description: "Prevent a member from sending messages or reacting",
  defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
  botPerms: ["ModerateMembers"],
  options: [
    {
      name: "member",
      description: "The member who you want to mute",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "duration",
      description:
        "How long they should be muted for Ex. 1 minute, 1 hour, 1 day, 1 week, etc.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "Why you are muting this member",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const target = interaction.options.getMember("member");
    const reason =
      (interaction.options.getString("reason") || `No reason specified`) +
      ` - muted by ${interaction.user.username}`;
    const duration = ms(interaction.options.getString("duration"));

    if (target.user.id === interaction.member.user.id)
      return interaction.error("You can't mute yourself");

    if (!target.moderatable)
      return interaction.error(
        "I can't mute that user, they are higher than me in the hierarchy"
      );

    if (reason.length > 512)
      return interaction.error(
        `The reason can\'t be over 512 characters (currently ${reason.length})`
      );

    if (target.isCommunicationDisabled())
      return interaction.error("That member is already muted");

    await target.timeout(duration, reason);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#FF0000")
          .setDescription(
            `✅ Member **${
              target.user.username
            }** has been muted. They will be unmuted <t:${Math.round(
              target.communicationDisabledUntilTimestamp / 1000
            )}:R>`
          )
          .setAuthor({
            name: `Member Muted`,
            iconURL: target.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
