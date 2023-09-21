const {
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { main_color: color } = require("../../config.json");

module.exports = {
  name: "ticket-add",
  description:
    "Add another member to a ticket to help resolve your issue by giving them access",
  options: [
    {
      name: "member",
      description: "The member to give access to",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const member = interaction.options.getMember("member");

    if (
      member
        .permissionsIn(interaction.channel)
        .has(PermissionsBitField.Flags.ViewChannel)
    )
      return interaction.error("That member already has access to this ticket");

    if (
      interaction.member
        .permissionsIn(interaction.channel)
        .has(PermissionsBitField.Flags.ManageChannels)
    ) {
      await interaction.channel.permissionOverwrites.create(member.user, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });

      return interaction.reply(
        `✅ ${member} **was added to the ticket**\n\nAdded by ${interaction.member}`
      );
    }

    const accept = new ButtonBuilder()
      .setCustomId(`t-add-accept-${member.user.id}`)
      .setLabel("Accept")
      .setStyle(ButtonStyle.Success);

    const deny = new ButtonBuilder()
      .setCustomId(`t-add-deny`)
      .setLabel("Deny")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents([accept, deny]);

    const embed = new EmbedBuilder()
      .setTitle("Add Member Request")
      .setDescription(
        `${interaction.member} is requesting to add ${member} to this ticket\n\nA staff member who has permission to manage channels and already has access to this ticket needs to accept this request`
      )
      .setColor(color);

    interaction.reply({ embeds: [embed], components: [row] });
  },
};
