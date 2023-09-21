const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

const shop = require("../../shop.json");
let items = [];

for (i in shop) {
  if (shop[i].sellable) items.push(i);
}

module.exports = {
  name: "sell",
  description:
    "Sell an item and get a refund (you won't get back the full price if you bought it from the store)",
  options: [
    {
      name: "item",
      description: "The item you want to sell",
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

    if (!item.sellable) return interaction.error("That item is not sellable!");

    if (!interaction.currency.items.find((i) => i.name === value))
      return interaction.error(
        "You don't own any of this item to sell. Do /inventory to see what items you have"
      );

    const newItems = interaction.currency.items;

    newItems[
      newItems.indexOf(newItems.find((i) => i.name === value))
    ].amount -= 1;

    newItems.forEach((i) => {
      if (i.amount < 1) {
        newItems.splice(newItems.indexOf(i), 1);
      }
    });

    const refund = item.price * (item.refund || client.config.defaultRefund);

    await client.currency.findOneAndUpdate(
      {
        userId: interaction.member.id,
      },
      {
        $inc: {
          quarks: refund,
        },
        items: newItems,
      }
    );

    const embed = new EmbedBuilder()
      .setTitle("✅ Successfully Sold")
      .setColor("00FF3E")
      .setThumbnail(client.quarks.url)
      .setDescription(
        `You successfully sold one ${item.emoji} **${item.name}** for ${
          client.quarks
        } **${refund}** quarks ${
          item.refund !== 1
            ? `(you get back ${
                (item.refund || client.config.defaultRefund) * 100
              }% of the original price)`
            : ""
        }`
      );

    interaction.reply({ embeds: [embed] });
  },
};
