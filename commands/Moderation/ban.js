const {
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  ApplicationCommandOptionType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "ban",
  description: "Ban a member from the server permanently",
  defaultMemberPermissions: [PermissionFlagsBits.BanMembers],
  botPerms: ["BanMembers"],
  options: [
    {
      name: "member",
      description: "The member who you want to ban",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Why you are banning this member",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "messages",
      description:
        "How many days of messages you want to delete from this member (between 0 and 7)",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      minValue: 0,
      maxValue: 7,
    },
  ],
  run: (client, interaction) => {
    const target = interaction.options.getMember("member");
    const reason =
      (interaction.options.getString("reason") || `No reason specified`) +
      ` - banned by ${interaction.user.username}`;
    const messages = Math.round(
      ms(
        (interaction.options.getInteger("messages") || 0).toString() + " days"
      ) / 1000
    );

    if (target.user.id === interaction.member.user.id)
      return interaction.error("You can't ban yourself");

    if (interaction.guild.ownerId === target.id)
      return interaction.error("You can't ban the owner of the server");

    if (
      target.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.error(
        "You cannot kick that user because they have the same or higher role than you."
      );

    if (!target.bannable)
      return interaction.error(
        "I can't ban that user, either I don't have permission or they are above me in the role hierarchy."
      );

    if (reason.length > 512)
      return interaction.error(
        `The reason can\'t be over 512 characters (currently ${reason.length})`
      );

    target.ban({
      deleteMessageSeconds: messages,
      reason: reason,
    });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#FF0000")
          .setDescription(
            `✅ Member **${target.user.username}** has been banned`
          )
          .setAuthor({
            name: `Member Banned`,
            iconURL: target.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
