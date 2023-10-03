const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "dig",
  description: "Dig in the ground to find items and sell them for quarks!",
  items: ["shovel"],
  cooldown: 60,
  run: async (client, interaction) => {
    const itemList = ["oldphone"];
    const value = itemList[client.random(0, itemList.length - 1)];
    const item = client.shop[value];

    const embed = new EmbedBuilder()
      .setTitle("You found an item!")
      .setDescription(`You found one ${item.emoji} **${item.name}**`)
      .setFooter({
        text: "Do /sell to sell the item for quarks",
      })
      .setColor(client.config.main_color);

    interaction.reply({ embeds: [embed], content: "" });

    const newItems = interaction.currency.items;

    if (newItems.find((i) => i.name === value)) {
      newItems[
        newItems.indexOf(newItems.find((i) => i.name === value))
      ].amount += 1;
    } else {
      newItems.push({
        name: value,
        amount: 1,
      });
    }

    await client.currency.findOneAndUpdate(
      {
        userId: interaction.member.id,
      },
      {
        items: newItems,
      }
    );
  },
};
