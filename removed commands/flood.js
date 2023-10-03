const { Flood } = require("discord-gamecord");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "flood",
  description: "Play the flood game in Discord!",
  options: [
    {
      name: "difficulty",
      description: "Difficulty of the game",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Easy", value: "easy" },
        { name: "Hard", value: "hard" },
      ],
    },
  ],
  run: (client, interaction) => {
    let difficulties = {
      easy: 8,
      hard: 13,
    };

    const difficulty =
      difficulties[interaction.options.getString("difficulty")];

    const Game = new Flood({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Flood",
        color: client.config.main_color,
      },
      difficulty: difficulty,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
      winMessage: "You won! You took **{turns}** turns.",
      loseMessage: "You lost! You took **{turns}** turns.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
