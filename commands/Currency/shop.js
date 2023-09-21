const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "shop",
  description:
    "View the shop to see what you can buy - buying certain items unlocks more commands",
  run: (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle("🛒 SamBot Shop")
      .setFooter({ text: "Do the command /buy to buy an item from the shop" })
      .setColor(client.config.main_color);

    let items = [];

    for (i in client.shop) {
      items.push(i);
    }

    items.forEach((item) => {
      item = client.shop[item];

      if (!item.buyable) return;

      embed.addFields({
        name: `${item.emoji} ${item.name}`,
        value: `${client.quarks} ${item.price}`,
        inline: true,
      });
    });

    interaction.reply({ embeds: [embed] });
  },
};
