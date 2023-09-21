const { TwoZeroFourEight } = require("discord-gamecord");

module.exports = {
  name: "2048",
  description: "Play 2048 in Discord!",
  run: (client, interaction) => {
    const game = new TwoZeroFourEight({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "2048",
        color: client.config.main_color,
      },
      emojis: {
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      playerOnlyMessage: "Only {player} can use these buttons",
    });

    game.startGame();
  },
};
