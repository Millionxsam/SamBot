const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "withdraw",
  description: "Withdraw money from the bank",
  options: [
    {
      name: "amount",
      description: "How many quarks do you want to withdraw?",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const wd = interaction.options.getInteger("amount");

    if (interaction.currency.bank < wd)
      return interaction.error(
        "You don't have that much money in your bank to withdraw"
      );

    await client.currency.findOneAndUpdate(
      {
        userId: interaction.member.id,
      },
      {
        $inc: {
          quarks: wd,
          bank: -wd,
        },
      }
    );

    interaction.reply(
      `You withdrew ${client.quarks} **${wd}** quarks from the bank`
    );
  },
};
