const { ApplicationCommandOptionType } = require("discord.js");
const { Connect4 } = require("discord-gamecord");

module.exports = {
  name: "connect4",
  description: "Play Connect 4 with another Discord user!",
  options: [
    {
      name: "opponent",
      description: "The user you want to play with",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: (client, interaction) => {
    const Game = new Connect4({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser("opponent"),
      embed: {
        title: "Connect 4 Game",
        statusTitle: "Status",
        color: client.config.main_color,
      },
      emojis: {
        board: "⚪",
        player1: "🔴",
        player2: "🟡",
      },
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      turnMessage: "{emoji} | It's **{player}**'s turn!.",
      winMessage: "{emoji} | **{player}** won the Connect 4 game!",
      tieMessage: "The game tied, no one won the game!",
      timeoutMessage: "The game went unfinished, no one won the Game!",
      playerOnlyMessage: "Only {player} and {opponent} can use these buttons.",
    });

    Game.startGame();
  },
};
