module.exports = {
  name: "coinflip",
  description: "Flip a coin!",
  run: (client, interaction) => {
    const choices = ["heads", "tails"];
    const choice = choices[Math.floor(Math.random() * choices.length)];

    interaction.reply(`I flipped a **${choice}**!`);
  },
};
