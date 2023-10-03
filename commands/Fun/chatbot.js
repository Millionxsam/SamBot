const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "chatbot",
  description: "Talk with AI right from Discord!",
  options: [
    {
      name: "mode",
      description: "Turn chatbot mode on or off",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "On", value: "true" },
        { name: "Off", value: "false" },
      ],
    },
  ],
  run: async (client, interaction) => {
    const status = {
      true: true,
      false: false,
    };

    const enabled = status[interaction.options.getString("mode")];
    if (enabled && !interaction.guildSettings.chatbot.enabled)
      return interaction.error("Chatbot has been disabled on this server");

    if (
      enabled &&
      interaction.userSettings.chatbot.channels.includes(interaction.channel.id)
    )
      return interaction.error(
        "Your chatbot is already enabled for this channel"
      );

    if (
      !enabled &&
      !interaction.userSettings.chatbot.channels.includes(
        interaction.channel.id
      )
    )
      return interaction.error(
        "Your chatbot is already disabled for this channel"
      );

    const chatbot = interaction.userSettings.chatbot;

    if (enabled) chatbot.channels.push(interaction.channel.id);
    else
      chatbot.channels.splice(
        chatbot.channels.indexOf(interaction.channel.id),
        1
      );

    await client.userSettings.findOneAndUpdate(
      { userId: interaction.member.id },
      { chatbot: chatbot }
    );

    interaction.reply({
      content: `✅ Chatbot **${
        enabled ? "enabled" : "disabled"
      }** for this channel. ${
        enabled ? "Send any message to begin chatting" : "Talk to you later!"
      }`,
      ephemeral: true,
    });
  },
};
