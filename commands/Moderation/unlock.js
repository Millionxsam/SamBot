const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "unlock",
  description: "Undo the /lock command",
  defaultMemberPermissions: [PermissionFlagsBits.ManageChannels],
  botPerms: ["ManageChannels"],
  options: [
    {
      name: "channel",
      type: ApplicationCommandOptionType.Channel,
      required: false,
      description: "The channel to unlock, leave blank to select this channel",
    },
    {
      name: "reason",
      description: "Why you are unlocking the channel",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const reason =
      (interaction.options.getString("reason") || "No reason specified") +
      ` - unlocked by ${interaction.member.user.username}`;
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      {
        SendMessages: null,
        AddReactions: null,
      },
      { reason }
    );

    interaction.reply(`✅ **#${channel.name}** unlocked`);
  },
};
