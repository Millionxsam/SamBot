const { GuessThePokemon } = require("discord-gamecord");

module.exports = {
  name: "guess-the-pokemon",
  description: "Guess who the pokemon is based on the picture!",
  run: (client, interaction) => {
    const Game = new GuessThePokemon({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Who's The Pokemon",
        color: client.config.main_color,
      },
      timeoutTime: 60000,
      winMessage: "You guessed it right! It was a {pokemon}.",
      loseMessage: "Better luck next time! It was a {pokemon}.",
      errMessage:
        "An error occurred. Please use the /feedback command to report this error or open a ticket in our Discord server",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
