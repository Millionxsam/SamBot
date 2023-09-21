const { TextInputBuilder } = require("@discordjs/builders");
const {
  ModalBuilder,
  ApplicationCommandOptionType,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const feedbackChannels = require("../../config.json").feedback_channels;
const color = require("../../config.json").main_color;

module.exports = {
  name: "feedback",
  description:
    "Report an error, suggest a new command, or give any other type of feedback to SamBot developers",
  options: [
    {
      name: "type",
      description: "The type of feedback you are giving",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Report a broken command or error", value: "report" },
        {
          name: "Suggest a new command or feature to add",
          value: "suggestion",
        },
        {
          name: "Ask a question about a command or feature",
          value: "question",
        },
        { name: "Other", value: "other" },
      ],
    },
  ],
  run: async (client, interaction) => {
    const feedbackType = interaction.options.getString("type");

    const modal = new ModalBuilder()
      .setTitle(`SamBot Feedback (${feedbackType})`)
      .setCustomId(feedbackType);

    const title = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short)
      .setMinLength(3)
      .setMaxLength(256)
      .setRequired(true)
      .setPlaceholder(
        `The title/topic of your ${
          feedbackType === "other" ? "feedback message" : feedbackType
        }`
      );

    const description = new TextInputBuilder()
      .setCustomId("desc")
      .setLabel("Description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(20)
      .setPlaceholder(
        "Describe your feedback. If you are reporting an error, say the error message it gave you, if any."
      );

    const row1 = new ActionRowBuilder().addComponents(title);
    const row2 = new ActionRowBuilder().addComponents(description);

    modal.addComponents(row1, row2);

    await interaction.showModal(modal);

    client.on("interactionCreate", (int) => {
      if (!int.isModalSubmit()) return;
      if (
        !(
          int.customId === "report" ||
          int.customId === "question" ||
          int.customId === "suggestion" ||
          int.customId === "other"
        )
      )
        return;

      const embed = new EmbedBuilder()
        .setTitle(int.fields.getTextInputValue("title"))
        .setColor(
          int.customId === "report"
            ? "#FF0000"
            : int.customId === "suggestion"
            ? "#00C9FF"
            : int.customId === "question"
            ? "#FFFB00"
            : int.customId === "other"
            ? "#9300FF"
            : color
        )
        .setAuthor({
          name: int.user.username,
          iconURL: int.user.displayAvatarURL(),
        })
        .setDescription(`${int.fields.getTextInputValue("desc")}`)
        .addFields({
          name: "Feedback Type",
          value: int.customId,
        })
        .setFooter({ text: `User ID: ${int.user.id}` });

      try {
        feedbackChannels.forEach((id) => {
          client.channels.fetch(id).then((c) => {
            c.send({ embeds: [embed] });
          });
        });

        int.reply({
          content: `✅ **Your ${
            int.customId === "other" ? "feedback" : int.customId
          } was submitted. We will try our best to get back to you as soon as possible**`,
          ephemeral: true,
        });
      } catch (e) {
        console.error(e);
        int.reply({
          content:
            "❌ **An error occurred, please try again later or issue a ticket in our server to report the problem if it keeps happening**",
          ephemeral: true,
        });
      }
    });
  },
};
