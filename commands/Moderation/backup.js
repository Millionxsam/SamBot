const backup = require("discord-backup");
const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "backup",
  description: "Create a backup for your server",
  defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  botPerms: ["Administrator"],
  options: [
    {
      name: "create",
      description: "Create a backup for your server",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "The name for the backup",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "list",
      description:
        "List the backups for the current server and the ones you created for other servers",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "create":
        interaction.reply(
          `${client.emojis.cache.get(
            client.config.emotes.loading
          )} **Creating backup...** This may take a while`
        );

        const name = interaction.options.getString("name");

        backup
          .create(interaction.guild, {
            jsonBeautify: true,
          })
          .then((data) => {
            client.backups.create({
              serverId: interaction.guild.id,
              createdBy: interaction.member.id,
              name,
              id: data.id,
            });

            const embed = new EmbedBuilder()
              .setTitle("Backup Created")
              .setDescription(
                `A backup was created for **${interaction.guild.name}** with the name of **${name}**`
              )
              .setColor("#00FF08");

            interaction.followUp({ embeds: [embed] });
          });
        break;

      case "list":
        const serverBackups =
          client.backups.find({ serverId: interaction.guild.id }) || [];
        let createdBackups =
          client.backups.find({ createdBy: interaction.member.id }) || [];

        createdBackups = createdBackups.filter(
          (b) => b.serverId !== interaction.guild.id
        );

        const embed = new EmbedBuilder()
          .setTitle("All Backups")
          .setColor(client.config.main_color)
          .addFields(
            {
              name: "Backups for this server",
              value: serverBackups.map((b) => b.name).join("\n"),
            },
            {
              name: "Backups you created for other servers",
              value: createdBackups.map((b) => b.name).join("\n"),
            }
          );

        interaction.reply({ embeds: [embed] });
        break;
    }
  },
};
