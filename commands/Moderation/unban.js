const {
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "unban",
  description: "Remove a ban from a member",
  defaultMemberPermissions: [PermissionFlagsBits.BanMembers],
  botPerms: ["BanMembers"],
  options: [
    {
      name: "user",
      description: "The ID of the user to unban. Ex. 857623243909103636",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Why you are unbanning this member",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const target = interaction.options.getUser("user");
    const reason =
      (interaction.options.getString("reason") || `No reason specified`) +
      ` - unbanned by ${interaction.user.username}`;

    if (reason.length > 512)
      return interaction.error(
        `The reason can\'t be over 512 characters (currently ${reason.length})`
      );

    await interaction.guild.members
      .unban(target, reason)
      .then((user) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#2EFF00")
              .setDescription(
                `✅ Member **${user.username}** has been unbanned`
              )
              .setAuthor({
                name: `Member Unbanned`,
                iconURL: user.displayAvatarURL(),
              }),
          ],
        });
      })
      .catch(() => interaction.error("That user is not banned"));
  },
};
