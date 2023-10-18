const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "balance",
  description: "View your or someone else's balance",
  options: [
    {
      name: "member",
      description:
        "The member you want to view the balance of (leave blank to view your own)",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const user =
      interaction.options.getUser("member") || interaction.member.user;
    const data = (await client.currency.findOne({ userId: user.id })) || {};

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${user.username}'s Balance`,
        iconURL: user.displayAvatarURL(),
      })
      .setThumbnail(client.quarks.url)
      .setColor(client.config.main_color)
      .addFields(
        {
          name: "Wallet",
          value: `${client.quarks} ${(data.quarks || 0).toLocaleString()}`,
        },
        {
          name: "Bank",
          value: `${client.quarks} ${(data.bank || 0).toLocaleString()}`,
        }
      );

    interaction.reply({ embeds: [embed] });
  },
};
