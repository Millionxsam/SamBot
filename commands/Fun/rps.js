const { ApplicationCommandOptionType } = require("discord.js");
const { RockPaperScissors } = require("discord-gamecord");

module.exports = {
  name: "rock-paper-scissors",
  description: "Play rock paper scissors with someone on Discord!",
  options: [
    {
      name: "opponent",
      description: "Who you want to play against",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  run: (client, interaction) => {
    const Game = new RockPaperScissors({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser("opponent"),
      embed: {
        title: "Rock Paper Scissors",
        color: client.config.main_color,
        description: "Press a button below to make a choice.",
      },
      buttons: {
        rock: "Rock",
        paper: "Paper",
        scissors: "Scissors",
      },
      emojis: {
        rock: "🪨",
        paper: "📄",
        scissors: "✂️",
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      pickMessage: "You choose {emoji}.",
      winMessage: "**{player}** won the Game!",
      tieMessage: "The game tied, no one won the Game!",
      timeoutMessage: "The game went unfinished, no one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    Game.startGame();
  },
};
