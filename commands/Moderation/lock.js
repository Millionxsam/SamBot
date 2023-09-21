const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "lock",
  description: "Prevent members from sending messages and reacting",
  defaultMemberPermissions: [PermissionFlagsBits.ManageChannels],
  botPerms: ["ManageChannels"],
  options: [
    {
      name: "channel",
      type: ApplicationCommandOptionType.Channel,
      required: false,
      description: "The channel to lock, leave blank to select this channel",
    },
    {
      name: "reason",
      description: "Why you are locking the channel",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const reason =
      (interaction.options.getString("reason") || "No reason specified") +
      ` - locked by ${interaction.member.user.username}`;
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      {
        SendMessages: false,
        AddReactions: false,
      },
      { reason }
    );

    interaction.reply(`✅ **#${channel.name}** locked`);
  },
};
