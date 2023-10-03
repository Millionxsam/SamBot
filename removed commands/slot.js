const { Slots } = require("discord-gamecord");

module.exports = {
  name: "slot-machine",
  description: "Slot machine",
  run: (client, interaction) => {
    const Game = new Slots({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Slot Machine",
        color: client.config.main_color,
      },
      slots: ["🍇", "🍊", "🍋", "🍌"],
    });

    Game.startGame();
  },
};
