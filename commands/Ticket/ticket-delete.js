const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "ticket-delete",
  description:
    "Delete the ticket channel (do /close if the issue is resolved, only delete the channel if necessary)",
  botPerms: ["ManageChannels"],
  defaultMemberPermissions: [PermissionFlagsBits.ManageChannels],
  run: async (client, interaction) => {
    await interaction.reply(
      "Are you sure you want to delete the channel? Send yes or no within 60 seconds to confirm or cancel\n\n**It is recommended that you do /close to close the ticket when the issue is resolved, only delete the channel if necessary**"
    );

    interaction.channel
      .awaitMessages({
        filter: (m) => m.member.user.id === interaction.member.user.id,
        time: 60000,
        max: 1,
        errors: ["time"],
      })
      .then((collected) => {
        const msg = collected.first();
        if (msg.content.toLowerCase() === "yes") {
          msg.reply("**Deleting in 5 seconds...**");

          setTimeout(
            () =>
              interaction.channel.delete(
                `Deleted by the /ticket-delete command by ${msg.member.user.username}`
              ),
            5000
          );
        } else if (msg.content.toLowerCase() === "no") {
          msg.reply("Deletion canceled");
        } else {
          msg.reply("Deletion canceled");
        }
      })
      .catch(async () => {
        await interaction.followUp("Time ran out, deletion canceled");
      });
  },
};
