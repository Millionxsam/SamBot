const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "sudo",
  description: "Make it look like another user said something!",
  options: [
    {
      name: "user",
      description: "The user to send the message as",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "message",
      description: "Message to send",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("user");

    interaction.channel
      .createWebhook({
        name: user.username,
        avatar: user.displayAvatarURL({ dynamic: true }),
      })
      .then((webhook) => {
        webhook.send({
          content: interaction.options.getString("message"),
          allowedMentions: { repliedUser: false },
        });

        interaction.followUp({
          content: "✅ **Message Sent**",
        });

        setTimeout(() => {
          webhook.delete();
        }, 1000);
      });
  },
};
