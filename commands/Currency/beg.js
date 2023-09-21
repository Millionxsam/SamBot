module.exports = {
  name: "beg",
  description: "Beg to get money",
  run: async (client, interaction) => {
    const quarks = client.random(100, 500);

    await client.currency.findOneAndUpdate(
      {
        userId: interaction.member.id,
      },
      {
        $inc: {
          quarks,
        },
      }
    );

    interaction.reply(
      `You got ${client.quarks} **${quarks}** quarks from begging`
    );
  },
};
