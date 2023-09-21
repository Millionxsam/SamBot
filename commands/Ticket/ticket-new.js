const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ticket-new",
  description: "Create a new ticket",
  botPerms: ["ManageChannels"],
  run: async (client, interaction) => {
    if (
      interaction.guild.channels.cache.find(
        (c) => c.name === `t-${interaction.member.user.id}`
      )
    )
      return interaction.error(
        "You already have a ticket open, close your existing one before opening a new one!"
      );

    let tCategory = interaction.guild.channels.cache.find(
      (c) =>
        c.name.toLowerCase() === "tickets" &&
        c.type === ChannelType.GuildCategory
    );

    if (!tCategory) {
      tCategory = await interaction.guild.channels.create({
        name: "Tickets",
        type: ChannelType.GuildCategory,
        topic: `The category that contains all SamBot tickets`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: PermissionsBitField.Flags.ViewChannel,
            allow: PermissionsBitField.Flags.SendMessages,
          },
          {
            id: interaction.guild.members.me,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });
    }

    tCategory.children
      .create({
        name: `t-${interaction.member.user.id}`,
        type: ChannelType.GuildText,
        topic: `A SamBot ticket, created for the user ${interaction.member.user.username}`,
        permissionOverwrites: [
          {
            id: interaction.member,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
          {
            id: interaction.guild.roles.everyone,
            allow: PermissionsBitField.Flags.SendMessages,
            deny: PermissionsBitField.Flags.ViewChannel,
          },
          {
            id: interaction.guild.members.me,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ReadMessageHistory,
            ],
          },
        ],
      })
      .then((channel) => {
        interaction.reply({
          content: `✅ **Your ticket was created:** ${channel}\n\nPlease go to your ticket and explain your issue`,
          ephemeral: true,
        });

        channel.send(
          `Hi ${interaction.member}, welcome to your ticket! Please explain why you created this ticket here, and we will be with you shortly. If you would like to close this ticket please do the command **/close** \n \n **__Commands:__**\n > **/ticket-add** >> Add any member to the ticket who doesn't already have access to help solve your problem or another reason. \n > **/ticket-close** >> Close the ticket when your issue is resolved. \n > **/ticket-delete** >> Delete the ticket channel \n > **/ticket-open** >> Re-open ticket after it's closed \n > **/ticket-remove** >> Remove a member that you added before\n\n***None of these commands require permissions***`
        );
      });
  },
};
