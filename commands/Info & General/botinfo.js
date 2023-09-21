const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  version: djsVersion,
} = require("discord.js");
const ms = require("ms");
const color = require("../../config.json").main_color;
const process = require("process");

module.exports = {
  name: "botinfo",
  description: "Receive information about SamBot's current status",
  run: (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Bot Info")
      .setColor(color)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        {
          name: "Bot Ping",
          value: `${Math.round(client.ws.ping)}ms`,
        },
        {
          name: "Uptime",
          value: `The bot has been up for ${ms(client.uptime, { long: true })}`,
        },
        {
          name: "Memory",
          value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(
            2
          )} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
          )} MB Heap`,
        },
        {
          name: "Server Count",
          value: client.guilds.cache.size + " servers",
        },
        {
          name: "User Count",
          value: client.users.cache.size + " users",
        },
        {
          name: "Commands",
          value: client.commands.size + " commands",
        },
        {
          name: "Node",
          value: `${process.version} on ${process.platform} ${process.arch}`,
        },
        {
          name: "Discord.js",
          value: djsVersion,
        }
      );
    interaction.reply({ embeds: [embed] });
  },
};
