const { Snake } = require("discord-gamecord");

module.exports = {
  name: "snake",
  description: "Play snake in Discord!",
  run: (client, interaction) => {
    const Game = new Snake({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Snake Game",
        overTitle: "Game Over",
        color: client.config.main_color,
      },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      snake: { head: "🟢", body: "🟩", tail: "🟢", skull: "💀" },
      foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
      stopButton: "Stop",
      timeoutTime: 60000,
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
