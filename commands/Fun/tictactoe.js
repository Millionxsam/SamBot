const { ApplicationCommandOptionType } = require("discord.js");
const { TicTacToe } = require("discord-gamecord");

module.exports = {
  name: "tic-tac-toe",
  description: "Play tic tac toe with someone on Discord!",
  options: [
    {
      name: "opponent",
      description: "Who do you want to play against?",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: (client, interaction) => {
    const Game = new TicTacToe({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser("opponent"),
      embed: {
        title: "Tic Tac Toe",
        color: client.config.main_color,
        statusTitle: "Status",
        overTitle: "Game Over",
      },
      emojis: {
        xButton: "✖️",
        oButton: "🔵",
        blankButton: "⬛",
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: "DANGER",
      oButtonStyle: "PRIMARY",
      turnMessage: "{emoji} | It's **{player}**'s turn!",
      winMessage: "{emoji} | **{player}** won the Tic Tac Toe game.",
      tieMessage: "The game tied, no one won the game!",
      timeoutMessage: "The game went unfinished, no one won the game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    Game.startGame();
  },
};
