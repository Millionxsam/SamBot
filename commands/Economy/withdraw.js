const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "withdraw",
  description: "Withdraw money from the bank",
  options: [
    {
      name: "amount",
      description:
        "How many quarks do you want to withdraw? Say 'all' to withdraw all",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let amount = interaction.options.getString("amount");

    if (
      !(amount.toLowerCase() === "all" || amount.toLowerCase() === "max") &&
      !parseInt(amount)
    )
      return interaction.error(
        "Say an amount of quarks to withdraw or 'all' to withdraw all"
      );

    if (amount.toLowerCase() === "all" || amount.toLowerCase() === "max")
      amount = interaction.currency.bank || 0;

    if (!amount) amount = parseInt(amount);

    if (amount < 1)
      return interaction.error("The number needs to be greater than 0");

    if (interaction.currency.bank < amount)
      return interaction.error(
        "You don't have that much money in your bank to withdraw"
      );

    await client.currency.findOneAndUpdate(
      {
        userId: interaction.member.id,
      },
      {
        $inc: {
          quarks: amount,
          bank: -amount,
        },
      }
    );

    interaction.reply(
      `You withdrew ${client.quarks} **${amount}** quarks from the bank`
    );
  },
};
