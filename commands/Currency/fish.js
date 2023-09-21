const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "fish",
  description: "Catch fish and sell them for quarks",
  items: ["fishrod"],
  run: async (client, interaction) => {
    const fishList = ["salmon"];
    // , "trout", "bass", "catfish", "cod"
    const value = fishList[client.random(0, fishList.length - 1)];
    const fish = client.shop[value];

    interaction.reply("🎣 Casting fishing rod and waiting for fish...");

    const wait = client.random(1000, 3000);

    setTimeout(async () => {
      const embed = new EmbedBuilder()
        .setTitle("🐠 You caught a fish!")
        .setDescription(`You caught one ${fish.emoji} **${fish.name}**`)
        .setFooter({
          text: "Do /sell to sell the fish for quarks",
        })
        .setColor(client.config.main_color);

      await interaction.editReply({ embeds: [embed], content: "" });

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
    }, wait);
  },
};
