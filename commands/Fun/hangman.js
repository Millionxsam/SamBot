const { Hangman } = require("discord-gamecord");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "hangman",
  description: "Play a hangman game in Discord!",
  options: [
    {
      name: "theme",
      description: "Choose the theme of the word to guess",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Nature", value: "nature" },
        { name: "Sports", value: "sport" },
        { name: "Colors", value: "color" },
        { name: "Camp", value: "camp" },
        { name: "Fruit", value: "fruit" },
        { name: "Discord", value: "discord" },
        { name: "Winter", value: "winter" },
        { name: "Pokemon", value: "pokemon" },
      ],
    },
  ],
  run: (client, interaction) => {
    const Game = new Hangman({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Hangman",
        color: client.config.main_color,
      },
      hangman: {
        hat: "🎩",
        head: "😟",
        shirt: "👕",
        pants: "🩳",
        boots: "👞👞",
      },
      timeoutTime: 60000,
      theme: interaction.options.getString("theme"),
      winMessage: "You won! The word was **{word}**.",
      loseMessage: "You lost! The word was **{word}**.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
