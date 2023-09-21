const ms = require("ms");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "slowmode",
  description: "Set slowmode on a channel",
  defaultMemberPermissions: [PermissionFlagsBits.ManageChannels],
  botPerms: ["ManageChannels"],
  options: [
    {
      name: "time",
      description:
        "The time you want to set slowmode to in seconds. Say 0 to turn off",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 0,
      maxValue: 21600,
    },
    {
      name: "channel",
      description:
        "The channel you want to set slowmode in (leave blank to select current channel)",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
    {
      name: "reason",
      description: "Why you are changing slowmode",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: (client, interaction) => {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    const time = interaction.options.getInteger("time");
    const reason =
      (interaction.options.getString("reason") || "No reason specified") +
      ` - set by ${interaction.member.user.username}`;

    if (!channel.manageable)
      return interaction.error("I don't have permission to manage the channel");

    if (channel.type !== ChannelType.GuildText)
      return interaction.error("The channel needs to be a text channel");

    channel.setRateLimitPerUser(time, reason);
    interaction.reply(
      `✅ Slowmode is now set to **${ms(ms(time + " seconds"), {
        long: true,
      })}** in **${channel}**`
    );
  },
};
