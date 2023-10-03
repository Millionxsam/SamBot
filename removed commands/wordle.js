const { Wordle } = require("discord-gamecord");

module.exports = {
  name: "wordle",
  description: "Play Wordle in Discord!",
  run: (client, interaction) => {
    const Game = new Wordle({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Wordle",
        color: client.config.main_color,
      },
      timeoutTime: 60000,
      winMessage: "You won! The word was **{word}**.",
      loseMessage: "You lost! The word was **{word}**.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
