const { MatchPairs } = require("discord-gamecord");

module.exports = {
  name: "matching-game",
  description: "Play a matching game where you have to match pairs!",
  run: (client, interaction) => {
    const Game = new MatchPairs({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Match Pairs",
        color: client.config.main_color,
        description:
          "**Click on the buttons to match emojis with their pairs.**",
      },
      timeoutTime: 60000,
      emojis: [
        "🍉",
        "🍇",
        "🍊",
        "🥭",
        "🍎",
        "🍏",
        "🥝",
        "🥥",
        "🍓",
        "🫐",
        "🍍",
        "🥕",
        "🥔",
      ],
      winMessage:
        "**You won the Game! You turned a total of `{tilesTurned}` tiles.**",
      loseMessage:
        "**You lost the Game! You turned a total of `{tilesTurned}` tiles.**",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
