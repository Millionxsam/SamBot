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
  name: "ticket-remove",
  description: "Remove a member from a ticket that was added before",
  options: [
    {
      name: "member",
      description: "The member to remove access from",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const member = interaction.options.getMember("member");

    if (
      !member
        .permissionsIn(interaction.channel)
        .has(PermissionsBitField.Flags.ViewChannel)
    )
      return interaction.error(
        "That member already doesn't have access to this ticket"
      );

    await interaction.channel.permissionOverwrites.delete(member.user);

    interaction.reply(`✅ **${member} removed from ticket**`);
  },
};
