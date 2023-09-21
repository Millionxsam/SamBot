const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "ticket-open",
  description: "Re-open the ticket after it was closed",
  botPerms: ["ManageChannels"],
  options: [
    {
      name: "ticket",
      description: "The ticket to open",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const ticket = interaction.options.getChannel("ticket");

    if (
      !interaction.member.permissionsIn(ticket).has("ManageChannels") &&
      !ticket.name.includes(interaction.member.user.id)
    )
      return interaction.error("You are not authorized to re-open that ticket");
    if (!ticket.name.startsWith("closed-"))
      return interaction.error("That is not a closed ticket");

    let ownerId = ticket.name.split("-")[1];

    await ticket.edit({
      name: `t-${ownerId}`,
      topic: ticket.topic.replace(" - closed", ""),
    });

    ticket.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: true,
    });

    interaction.reply({ content: "✅ **Ticket re-opened**", ephemeral: true });
    ticket.send(`**Ticket re-opened by ${interaction.member}**`);
  },
};
