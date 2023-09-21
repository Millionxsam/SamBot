const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const { main_color } = require("../../config.json");

module.exports = {
  name: "channelinfo",
  description: "Get information about a channel in this server",
  options: [
    {
      name: "channel",
      description:
        "The channel you want to get information about (leave blank to select current channel)",
      required: false,
      type: ApplicationCommandOptionType.Channel,
    },
  ],
  run: (client, interaction) => {
    const status = {
      true: "Yes",
      false: "No",
    };

    const type = {
      0: "Text",
      1: "DM",
      2: "Voice",
      3: "Group DM",
      4: "Category",
      5: "Announcement",
      10: "Announcement thread",
      11: "Public thread",
      12: "Private thread",
      13: "Stage voice",
      14: "Directory",
      15: "Forum",
    };

    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    const embed = new EmbedBuilder()
      .setTitle(`Channel Info of #${channel.name}`)
      .setColor(main_color)
      .setThumbnail(interaction.guild.iconURL())
      .addFields(
        { name: "Name", value: channel.name, inline: true },
        {
          name: "Category",
          value: channel.parent ? channel.parent.name : "None",
          inline: true,
        },
        { name: "Type", value: type[channel.type], inline: true },
        { name: "Topic", value: channel.topic || "None", inline: true },
        { name: "ID", value: channel.id.toString(), inline: true },
        { name: "URL", value: channel.url, inline: true },
        {
          name: "Created At",
          value: `<t:${Math.round(channel.createdTimestamp / 1000)}:f>`,
          inline: true,
        },
        {
          name: "Flags",
          value: channel.flags.toArray().join(", ") || "None",
          inline: true,
        },
        {
          name: "Position",
          value: (channel.position + 1).toString(),
          inline: true,
        },
        {
          name: "Slowmode",
          value: (channel.rateLimitPerUser || "0") + " seconds",
          inline: true,
        },
        {
          name: "Threads",
          value: channel.threads
            ? channel.threads.cache.size.toString()
            : "N/A",
          inline: true,
        },
        { name: "NSFW?", value: status[channel.nsfw], inline: true }
      )
      .setFooter({
        text: "TIP: The command /userinfo or /roleinfo will tell you what permissions the role or user has in the current channel",
      });

    interaction.reply({ embeds: [embed] });
  },
};
