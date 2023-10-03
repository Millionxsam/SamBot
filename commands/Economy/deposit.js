const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "deposit",
  description: "Deposit some cash into the bank",
  options: [
    {
      name: "amount",
      description: "How many quarks do you want to deposit?",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const dep = interaction.options.getInteger("amount");

    if (interaction.currency.quarks < dep)
      return interaction.error("You don't have that many quarks to deposit");

    await client.currency.findOneAndUpdate(
      {
        userId: interaction.member.id,
      },
      {
        $inc: {
          quarks: -dep,
          bank: dep,
        },
      }
    );

    interaction.reply(
      `You deposited ${client.quarks} **${dep}** quarks into the bank`
    );
  },
};
