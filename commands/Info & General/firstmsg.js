const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "firstmsg",
  description: "Shows the first message in a channel",
  options: [
    {
      name: "channel",
      description:
        "The channel you want to see the first message of (leave blank to select current channel)",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    if (channel.type !== ChannelType.GuildText)
      return interaction.error("The channel needs to be a text channel");

    const messages = await channel.messages.fetch({ after: 1, limit: 1 });
    const msg = messages.first();

    const embed = new EmbedBuilder()
      .setTitle(`First Messsage in #${channel.name}`)
      .setURL(msg.url)
      .setThumbnail(msg.member ? msg.member.user.displayAvatarURL() : "")
      .setDescription("**Content:** " + msg.content)
      .addFields(
        {
          name: "Author",
          value: `${
            msg.member
              ? msg.member.user.username
              : "The author was not found. This is probably because the author was a webhook or does not exist anymore"
          }`,
          inline: true,
        },
        { name: "Message ID", value: msg.id.toString(), inline: true },
        {
          name: "Created At",
          value: `<t:${Math.round(msg.createdTimestamp / 1000)}:f>`,
          inline: true,
        }
      )
      .setFooter({
        text: "TIP: Click the blue title of this message to go to the first message",
      });

    interaction.reply({
      embeds: [embed],
    });
  },
};
