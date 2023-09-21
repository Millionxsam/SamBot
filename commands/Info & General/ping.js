const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Test the response time of SamBot",
  run: (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle("Pong!")
      .setColor(client.config.main_color)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`**Ping:** \`${client.ws.ping}\``);

    interaction.reply({ embeds: [embed] });
  },
};
