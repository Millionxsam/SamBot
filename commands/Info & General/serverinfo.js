const { main_color } = require("../../config.json");
const { EmbedBuilder, GuildNSFWLevel } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Shows information about the current server",
  run: (client, interaction) => {
    const status = {
      true: "Yes",
      false: "No",
    };

    const guild = interaction.guild;
    const Emojis = guild.emojis.cache.size || "No Emojis";
    const Channels = guild.channels.cache.size || "No Channels";
    const Roles = guild.roles.cache.size || "No Roles";
    const Members = guild.memberCount;
    const Humans = guild.members.cache.filter(
      (member) => !member.user.bot
    ).size;
    const Bots = guild.members.cache.filter((member) => member.user.bot).size;

    const embed = new EmbedBuilder()
      .setTitle("Server Info of " + guild.name)
      .setColor(main_color)
      .setThumbnail(guild.iconURL())
      .addFields({ name: `Name`, value: guild.name, inline: true })
      .addFields({
        name: `Description`,
        value: guild.description || "None",
        inline: true,
      })
      .addFields({ name: `ID`, value: `${guild.id}`, inline: true })
      .addFields({
        name: `Server Created At`,
        value: `<t:${Math.round(guild.createdTimestamp / 1000)}:f>`,
      })
      .addFields({ name: `Owner`, value: `<@${guild.ownerId}>`, inline: true })
      .addFields({
        name: `Icon URL`,
        value: guild.iconURL() || "No icon",
        inline: true,
      })
      .addFields({
        name: `Banner URL`,
        value: guild.bannerURL() || "No banner",
        inline: true,
      })
      .addFields({
        name: `Splash URL`,
        value: guild.splashURL() || "No splash",
        inline: true,
      })
      .addFields({ name: `Roles Count`, value: Roles.toString(), inline: true })
      .addFields({
        name: `Emojis Count`,
        value: Emojis.toString(),
        inline: true,
      })
      .addFields({
        name: `Stickers`,
        value: `${guild.stickers.cache.size}`,
        inline: true,
      })
      .addFields({
        name: `Channels Count`,
        value: Channels.toString(),
        inline: true,
      })
      .addFields({
        name: `Members Count`,
        value: Members.toString(),
        inline: true,
      })
      .addFields({
        name: `Humans Count`,
        value: Humans.toString(),
        inline: true,
      })
      .addFields({ name: `Bots Count`, value: Bots.toString(), inline: true })
      .addFields({
        name: `AFK Channel`,
        value: `${guild.afkChannel}`,
        inline: true,
      })
      .addFields({
        name: `Explicit Content Filter Level`,
        value: `${guild.explicitContentFilter}`,
        inline: true,
      })
      .addFields({
        name: `Features`,
        value: guild.features.join(", ").toLowerCase().split("_").join(" "),
        inline: true,
      })
      .addFields({
        name: `NSFW Level`,
        value: `${guild.nsfwLevel}`,
        inline: true,
      })
      .addFields({
        name: `Partnered?`,
        value: status[guild.partnered],
        inline: true,
      })
      .addFields({
        name: `Locale`,
        value: guild.preferredLocale,
        inline: true,
      })
      .addFields({
        name: `Boosts`,
        value: guild.premiumSubscriptionCount || "0",
        inline: true,
      })
      .addFields({
        name: `Vanity URL Code`,
        value: guild.vanityURLCode || "None",
        inline: true,
      })
      .addFields({
        name: `Verification Level`,
        value: `${guild.verificationLevel}`,
        inline: true,
      });

    interaction.reply({
      embeds: [embed],
    });
  },
};
