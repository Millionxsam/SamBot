module.exports = {
  name: "ticket-close",
  description: "Close the ticket once your issue is resolved",
  run: async (client, interaction) => {
    if (interaction.channel.name.startsWith("closed-"))
      return interaction.error("This ticket is already closed");

    let ownerId = interaction.channel.name.split("-")[1];

    await interaction.channel.edit({
      name: `closed-${ownerId}`,
      topic: interaction.channel.topic + " - closed",
    });

    interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      {
        SendMessages: false,
      }
    );

    interaction.reply(
      "✅ **Ticket closed**\n\nThe ticket creator or a staff member with permission to manage the channel can do **/ticket-open** in another channel to re-open it"
    );
  },
};
