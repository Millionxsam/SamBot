const { ApplicationCommandOptionType } = require("discord.js");
const { Trivia } = require("discord-gamecord");

module.exports = {
  name: "trivia",
  description: "Play trivia in Discord!",
  options: [
    {
      name: "mode",
      description: "The trivia mode you want to play",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Multiple choice question", value: "multiple" },
        { name: "True/false question", value: "single" },
      ],
    },
    {
      name: "difficulty",
      description: "How difficult you want the questions to be",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Easy", value: "easy" },
        { name: "Medium", value: "medium" },
        { name: "Hard", value: "hard" },
      ],
    },
  ],
  run: (client, interaction) => {
    const Game = new Trivia({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Trivia",
        color: client.config.main_color,
        description: "You have 60 seconds to guess the answer.",
      },
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      trueButtonStyle: "SUCCESS",
      falseButtonStyle: "DANGER",
      mode: interaction.options.getString("mode"), // multiple || single
      difficulty: interaction.options.getString("difficulty"), // easy || medium || hard
      winMessage: "**You won!** The correct answer was {answer}.",
      loseMessage: "**You lost!** The correct answer was {answer}.",
      errMessage:
        "An error occurred. Please use the /feedback command to report this error or open a ticket in our Discord server",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
