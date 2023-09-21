const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "purge",
  description: "Deletes messages from a channel",
  defaultMemberPermissions: [PermissionFlagsBits.ManageMessages],
  botPerms: ["ManageMessages"],
  options: [
    {
      name: "count",
      description: "Amount of messages to delete",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 1,
      maxValue: 1000,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const count = interaction.options.getInteger("count");

    interaction.channel
      .bulkDelete(count)
      .then(
        async (messages) =>
          await interaction.followUp(
            `✅ **Succesfully deleted ${messages.size} messages**`
          )
      );
  },
};
