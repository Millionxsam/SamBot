const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "eightball",
  description: "Let SamBot answer your question",
  options: [
    {
      name: "question",
      description: "The question",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const responses = [
      "It is certain.",
      "It is decidedly so.",
      "Without a doubt.",
      "Yes definelty.",
      "You may rely on it.",
      "As I see it, yes.",
      "Most likely.",
      "Outlook good.",
      "Yes",
      "Signs point to yes.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good...",
      "Very doubtful.",
    ];

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#5100A3")
          .setTitle(interaction.options.getString("question"))
          .setDescription(
            responses[Math.floor(Math.random() * responses.length)]
          ),
      ],
    });
  },
};
