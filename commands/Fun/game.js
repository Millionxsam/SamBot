const {
  TwoZeroFourEight,
  Connect4,
  FastType,
  Flood,
  FindEmoji,
  MatchPairs,
  Hangman,
  GuessThePokemon,
  RockPaperScissors,
  Minesweeper,
  Slots,
  Snake,
  TicTacToe,
  Trivia,
  Wordle,
} = require("discord-gamecord");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "game",
  description: "Play a game with friends on Discord!",
  options: [
    {
      name: "2048",
      description: "Play 2048 in Discord!",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "akinator",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Play the akinator game in Discord!",
      options: [
        {
          name: "game-type",
          description: "The type of Akinator game to be played",
          required: true,
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: "Animal", value: "animal" },
            { name: "Character", value: "character" },
            { name: "Object", value: "object" },
          ],
        },
        {
          name: "child-mode",
          description:
            "Whether to use Akinator's Child Mode (leave blank to have child mode off)",
          required: false,
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: "Child mode on", value: "true" },
            { name: "Child mode off", value: "false" },
          ],
        },
      ],
    },
    {
      name: "connect4",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Play Connect 4 with another Discord user!",
      options: [
        {
          name: "opponent",
          description: "The user you want to play with",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "fasttype",
      type: ApplicationCommandOptionType.Subcommand,
      description:
        "See how fast you can type a sentence and be on the leaderboard!",
    },
    {
      name: "find-the-emoji",
      type: ApplicationCommandOptionType.Subcommand,
      description:
        "Play a memory game where you have to remember where the emojis are and select the correct one!",
    },
    {
      name: "flood",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Play the flood game in Discord!",
      options: [
        {
          name: "difficulty",
          description: "Difficulty of the game",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "Easy", value: "easy" },
            { name: "Hard", value: "hard" },
          ],
        },
      ],
    },
    {
      name: "guess-the-pokemon",
      description: "Guess who the pokemon is based on the picture!",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "hangman",
      type: ApplicationCommandOptionType.Subcommand,
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
    },
    {
      name: "matching-game",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Play a matching game where you have to match pairs!",
    },
    {
      name: "minesweeper",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Play minesweeper in Discord!",
    },
    {
      name: "rock-paper-scissors",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Play rock paper scissors with someone on Discord!",
      options: [
        {
          name: "opponent",
          description: "Who you want to play against",
          required: true,
          type: ApplicationCommandOptionType.User,
        },
      ],
    },
    {
      name: "slot-machine",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Slot machine",
    },
    {
      name: "snake",
      description: "Play snake in Discord!",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "tic-tac-toe",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Play tic tac toe with someone on Discord!",
      options: [
        {
          name: "opponent",
          description: "Who do you want to play against?",
          required: true,
          type: ApplicationCommandOptionType.User,
        },
      ],
    },
    {
      name: "trivia",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Play trivia in Discord!",
      options: [
        {
          name: "mode",
          description: "The trivia mode you want to play",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "Multiple choice question", value: "multiple" },
            { name: "True/false question", value: "single" },
          ],
        },
        {
          name: "difficulty",
          description: "How difficult you want the questions to be",
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: "Easy", value: "easy" },
            { name: "Medium", value: "medium" },
            { name: "Hard", value: "hard" },
          ],
        },
      ],
    },
    {
      name: "wordle",
      description: "Play Wordle in Discord!",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "2048":
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
        break;
      case "akinator":
        const akinator = require("discord.js-akinator");

        const truefalse = {
          true: true,
          false: false,
        };

        const embedColor = client.config.main_color;
        const gameType = interaction.options.getString("game-type");
        const childMode =
          truefalse[interaction.options.getString("child-mode")];

        akinator(interaction, {
          childMode,
          gameType,
          embedColor,
        });
        break;

      case "connect4":
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
          playerOnlyMessage:
            "Only {player} and {opponent} can use these buttons.",
        });

        Game.startGame();
        break;

      case "fasttype":
        new FastType({
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
          loseMessage:
            "You lost! You didn't type the correct sentence in time.",
        }).startGame();
        break;

      case "find-the-emoji":
        new FindEmoji({
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
          timeoutMessage:
            "You lost! You ran out of time. The emoji was {emoji}",
          playerOnlyMessage: "Only {player} can use these buttons.",
        }).startGame();
        break;

      case "flood":
        let difficulties = {
          easy: 8,
          hard: 13,
        };

        const difficulty =
          difficulties[interaction.options.getString("difficulty")];

        new Flood({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: "Flood",
            color: client.config.main_color,
          },
          difficulty: difficulty,
          timeoutTime: 60000,
          buttonStyle: "PRIMARY",
          emojis: ["🟥", "🟦", "🟧", "🟪", "🟩"],
          winMessage: "You won! You took **{turns}** turns.",
          loseMessage: "You lost! You took **{turns}** turns.",
          playerOnlyMessage: "Only {player} can use these buttons.",
        }).startGame();
        break;

      case "guess-the-pokemon":
        new GuessThePokemon({
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
        }).startGame();
        break;

      case "hangman":
        new Hangman({
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
        }).startGame();
        break;

      case "matching-game":
        new MatchPairs({
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
        }).startGame();
        break;

      case "minesweeper":
        new Minesweeper({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: "Minesweeper",
            color: client.config.main_color,
            description:
              "Click on the buttons to reveal the blocks except mines.",
          },
          emojis: { flag: "🚩", mine: "💣" },
          mines: 5,
          timeoutTime: 60000,
          winMessage:
            "You won the Game! You successfully avoided all the mines.",
          loseMessage: "You lost the Game! Better luck next time",
          playerOnlyMessage: "Only {player} can use these buttons.",
        }).startGame();
        break;

      case "rock-paper-scissors":
        new RockPaperScissors({
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
          playerOnlyMessage:
            "Only {player} and {opponent} can use these buttons.",
        }).startGame();
        break;

      case "slot-machine":
        new Slots({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: "Slot Machine",
            color: client.config.main_color,
          },
          slots: ["🍇", "🍊", "🍋", "🍌"],
        }).startGame();
        break;

      case "snake":
        new Snake({
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
        }).startGame();
        break;

      case "tic-tac-toe":
        new TicTacToe({
          message: interaction,
          isSlashGame: true,
          opponent: interaction.options.getUser("opponent"),
          embed: {
            title: "Tic Tac Toe",
            color: client.config.main_color,
            statusTitle: "Status",
            overTitle: "Game Over",
          },
          emojis: {
            xButton: "✖️",
            oButton: "🔵",
            blankButton: "⬛",
          },
          mentionUser: true,
          timeoutTime: 60000,
          xButtonStyle: "DANGER",
          oButtonStyle: "PRIMARY",
          turnMessage: "{emoji} | It's **{player}**'s turn!",
          winMessage: "{emoji} | **{player}** won the Tic Tac Toe game.",
          tieMessage: "The game tied, no one won the game!",
          timeoutMessage: "The game went unfinished, no one won the game!",
          playerOnlyMessage:
            "Only {player} and {opponent} can use these buttons.",
        }).startGame();
        break;

      case "trivia":
        new Trivia({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: "Trivia",
            color: client.config.main_color,
            description: "You have 60 seconds to guess the answer.",
          },
          timeoutTime: 60000,
          buttonStyle: "PRIMARY",
          trueButtonStyle: "SUCCESS",
          falseButtonStyle: "DANGER",
          mode: interaction.options.getString("mode"), // multiple || single
          difficulty: interaction.options.getString("difficulty"), // easy || medium || hard
          winMessage: "**You won!** The correct answer was {answer}.",
          loseMessage: "**You lost!** The correct answer was {answer}.",
          errMessage:
            "An error occurred. Please use the /feedback command to report this error or open a ticket in our Discord server",
          playerOnlyMessage: "Only {player} can use these buttons.",
        }).startGame();
        break;

      case "wordle":
        new Wordle({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: "Wordle",
            color: client.config.main_color,
          },
          timeoutTime: 60000,
          winMessage: "You won! The word was **{word}**.",
          loseMessage: "You lost! The word was **{word}**.",
          playerOnlyMessage: "Only {player} can use these buttons.",
        }).startGame();
        break;
    }
  },
};
