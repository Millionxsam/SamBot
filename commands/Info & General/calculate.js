const { ApplicationCommandOptionType } = require("discord.js");
const math = require("math-expression-evaluator");

module.exports = {
  name: "calculate",
  description: "Calculate an equation on a calculator",
  options: [
    {
      name: "expression",
      description: "The expression you want to solve",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: (client, interaction) => {
    const expression = interaction.options.getString("expression");
    let answer;

    try {
      answer = math.eval(expression);
    } catch (e) {
      console.error(e);
      return interaction.error(
        "Invalid math equation (make sure to use `*` for multiplication and `/` for divide)"
      );
    }

    interaction.reply(
      `**Expression:** \`${expression}\`\n\n**Answer:** \`${answer}\``
    );
  },
};
