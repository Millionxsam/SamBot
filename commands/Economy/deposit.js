const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "deposit",
  description: "Deposit some cash into the bank",
  options: [
    {
      name: "amount",
      description:
        "How many quarks do you want to deposit? Say 'all' to deposit all",
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
        "Say an amount of quarks to deposit or 'all' to deposit all"
      );

    if (amount.toLowerCase() === "all" || amount.toLowerCase() === "max")
      amount = interaction.currency.quarks || 0;

    if (!amount) amount = parseInt(amount);

    if (amount < 1)
      return interaction.error("The number needs to be greater than 0");

    if (interaction.currency.quarks < amount)
      return interaction.error("You don't have that many quarks to deposit");

    await client.currency.findOneAndUpdate(
      {
        userId: interaction.member.id,
      },
      {
        $inc: {
          quarks: -amount,
          bank: amount,
        },
      }
    );

    interaction.reply(
      `You deposited ${client.quarks} **${amount}** quarks into the bank`
    );
  },
};
