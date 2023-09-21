const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

const shop = require("../../shop.json");
let items = [];

for (i in shop) {
  if (shop[i].buyable) items.push(i);
}

module.exports = {
  name: "buy",
  description: "Buy an item from the shop",
  options: [
    {
      name: "item",
      description: "The item you want to buy",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: items.map((i) => {
        let value = i;
        i = shop[i];
        return { name: i.name, value };
      }),
    },
  ],
  run: async (client, interaction) => {
    const value = interaction.options.getString("item");
    const item = shop[interaction.options.getString("item")];

    if (!item.buyable) return interaction.error("That item is not buyable!");

    if (interaction.currency.quarks < item.price)
      return interaction.error(
        "You can't afford this item! You might have to withdraw money from the bank"
      );

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
        $inc: {
          quarks: -item.price,
        },
        items: newItems,
      }
    );

    const embed = new EmbedBuilder()
      .setTitle("✅ Successful Purchase")
      .setColor("00FF3E")
      .setThumbnail(client.quarks.url)
      .setDescription(
        `You successfully purchased one ${item.emoji} **${item.name}** for ${client.quarks} **${item.price}** quarks`
      );

    interaction.reply({ embeds: [embed] });
  },
};
