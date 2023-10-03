const { FindEmoji } = require("discord-gamecord");

module.exports = {
  name: "find-the-emoji",
  description:
    "Play a memory game where you have to remember where the emojis are and select the correct one!",
  run: (client, interaction) => {
    const Game = new FindEmoji({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Find Emoji",
        color: client.config.main_color,
        description: "Remember the emojis from the board below.",
        findDescription: "Find the {emoji} emoji before the time runs out.",
      },
      timeoutTime: 60000,
      hideEmojiTime: 5000,
      buttonStyle: "PRIMARY",
      emojis: ["🍉", "🍇", "🍊", "🍋", "🥭", "🍎", "🍏", "🥝"],
      winMessage: "You won! You selected the correct emoji. {emoji}",
      loseMessage: "You lost! You selected the wrong emoji. {emoji}",
      timeoutMessage: "You lost! You ran out of time. The emoji was {emoji}",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
