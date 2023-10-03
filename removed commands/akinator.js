const { ApplicationCommandOptionType } = require("discord.js");
const akinator = require("discord.js-akinator");
const { main_color: color } = require("../../config.json");

module.exports = {
  name: "akinator",
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
  run: (client, interaction) => {
    const truefalse = {
      true: true,
      false: false,
    };

    const embedColor = color;
    const gameType = interaction.options.getString("game-type");
    const childMode = truefalse[interaction.options.getString("child-mode")];

    akinator(interaction, {
      childMode,
      gameType,
      embedColor,
    });
  },
};
