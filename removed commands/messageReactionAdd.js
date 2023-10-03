const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, reaction, user) => {
  let guildSettings = await client.guildSettings.findOne({
    guildId: reaction.message.guildId,
  });
  if (!guildSettings)
    guildSettings = await client.guildSettings.create({
      guildId: reaction.message.guildId,
    });
  reaction.guildSettings = guildSettings;

  if (
    guildSettings.skullboard.channelId &&
    reaction.emoji.toString() === "💀"
  ) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Skullboard Message" })
      .setTitle("Jump to message")
      .setURL(
        `https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}`
      )
      .setColor(client.config.main_color)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Author", value: user.displayName },
        { name: "Content", value: reaction.message.content }
      );

    client.guilds.cache
      .get(reaction.message.guildId)
      .channels.cache.get(guildSettings.skullboard.channelId)
      .send({ embeds: [embed] });
  }
};
