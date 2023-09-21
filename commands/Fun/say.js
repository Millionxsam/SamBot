const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "say",
  description: "Make SamBot say something!",
  options: [
    {
      name: "text",
      description: "The text that SamBot will say",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: (client, interaction) => {
    interaction.reply({
      content: `"${interaction.options.getString("text")}"\n\n-**${
        interaction.user.username
      }**`,
    });
  },
};
