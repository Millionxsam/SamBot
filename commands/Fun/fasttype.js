const { FastType } = require("discord-gamecord");

module.exports = {
  name: "fasttype",
  description:
    "See how fast you can type a sentence and be on the leaderboard!",
  run: (client, interaction) => {
    const Game = new FastType({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Fast Type",
        color: client.config.main_color,
        description: "You have {time} seconds to type the sentence below.",
      },
      timeoutTime: 60000,
      sentence: "Some really cool sentence to fast type.",
      winMessage:
        "You won! You finished the type race in {time} seconds with wpm of {wpm}.",
      loseMessage: "You lost! You didn't type the correct sentence in time.",
    });

    Game.startGame();
    Game.on("gameOver", (result) => {
      console.log(result); // =>  { result... }
    });
  },
};
