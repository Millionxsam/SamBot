const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "emojify",
  description: "Turns any text into emoji form",
  options: [
    {
      name: "text",
      description: "The text to convert into emoji form",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: (client, interaction) => {
    const text = interaction.options.getString("text");

    const specialChars = {
      0: ":zero:",
      1: ":one:",
      2: ":two:",
      3: ":three:",
      4: ":four:",
      5: ":five:",
      6: ":six:",
      7: ":seven:",
      8: ":eight:",
      9: ":nine:",
      "#": ":hash:",
      "*": ":asterisk:",
      "?": ":grey_question:",
      "!": ":grey_exclamation:",
      $: ":heavy_dollar_sign:",
      " ": "    ",
    };

    const emojified = text
      .toLowerCase()
      .split("")
      .map((letter) => {
        if (/[a-z]/g.test(letter)) {
          return `:regional_indicator_${letter}: `;
        } else if (specialChars[letter]) return `${specialChars[letter]} `;

        return letter;
      })
      .join("");

    if (emojified.length > 2000) {
      return interaction.error(
        `The text cannot exceed 2000 characters (currently ${emojified.length})`
      );
    }

    interaction.reply({
      content: emojified,
    });
  },
};
