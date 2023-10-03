const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "rob",
  description: "Try to steal quarks from someone's wallet",
  cooldown: 240,
  options: [
    {
      name: "user",
      description: "The user to try to rob",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const user = interaction.options.getUser("user");
    const success = client.random(1, 2) === 1;
    const userData = (await client.currency.findOne({ userId: user.id })) || {};

    if (interaction.currency.quarks < 1000)
      return interaction.error(
        "You need at least 1000 quarks in your wallet to rob someone"
      );
    if ((userData.quarks || 0) < 1000)
      return interaction.error(
        "The user needs at least 1000 quarks to get robbed"
      );

    if (!success) {
      const fine = client.random(500, 1000);

      await client.currency.findOneAndUpdate(
        {
          userId: interaction.member.id,
        },
        {
          $inc: {
            quarks: -fine,
          },
        }
      );

      const embed = new EmbedBuilder()
        .setTitle("You got caught!")
        .setColor("FF0000")
        .setDescription(
          `You got caught trying to rob ${user} and got fined ${client.quarks} **${fine}** quarks`
        );

      return interaction.reply({ embeds: [embed] });
    } else if (success) {
      const earnings = userData.quarks * 0.1;

      await client.currency.findOneAndUpdate(
        {
          userId: user.id,
        },
        {
          $inc: {
            quarks: -earnings,
          },
        }
      );

      await client.currency.findOneAndUpdate(
        {
          userId: interaction.member.id,
        },
        {
          $inc: {
            quarks: earnings,
          },
        }
      );

      const embed = new EmbedBuilder()
        .setTitle(`You stole some quarks!`)
        .setColor("1BFF00")
        .setDescription(
          `You robbed ${user} and got ${client.quarks} **${earnings}** quarks!`
        );

      return interaction.reply({ embeds: [embed] });
    }
  },
};
