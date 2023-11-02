const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "inventory",
  description: "View what items you or someone else owns",
  options: [
    {
      name: "member",
      description:
        "The member whose inventory you want to see - leave blank to select yourself",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const user =
      interaction.options.getUser("member") || interaction.member.user;
    let items = await client.currency.findOne({ userId: user.id });
    items = items ? items.items : [];

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${user.username}'s Inventory`,
        iconURL: user.displayAvatarURL(),
      })
      .setColor(client.config.main_color)
      .setThumbnail(client.quarks)
      .setDescription(
        items
          .map((i) => {
            let item = client.shop[i.name];

            return `${item.emoji} **${item.name}** - ${i.amount}`;
          })
          .join("\n\n") || "No items in inventory"
      );

    interaction.reply({ embeds: [embed] });
  },
};
