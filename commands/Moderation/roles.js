const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "role",
  description: "Role commands",
  defaultMemberPermissions: [PermissionFlagsBits.ManageRoles],
  botPerms: ["ManageRoles"],
  options: [
    {
      name: "all",
      type: ApplicationCommandOptionType.Subcommand,
      description: "Assign a role to all members",
      options: [
        {
          name: "role",
          type: ApplicationCommandOptionType.Role,
          description: "The role to assign to all members",
          required: true,
        },
        {
          name: "reason",
          type: ApplicationCommandOptionType.String,
          description: "Why you are assigning this role to all members",
          required: false,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    const role = interaction.options.getRole("role");
    const reason =
      (interaction.options.getString("reason") || "No reason specified") +
      ` - set by ${interaction.member.user.username}`;

    await interaction.reply(
      "**Assigning roles...** this may take a while depending on the amount of members in the server"
    );

    await interaction.guild.members.cache.forEach((member) =>
      member.roles.add(role, reason)
    );

    await interaction.followUp(
      `✅ **Finished assigning role ${role.name} to all members**`
    );
  },
};
