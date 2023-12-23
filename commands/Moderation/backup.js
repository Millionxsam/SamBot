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
    {
      name: "info",
      description:
        "Get info of a backup of this server or a backup created by you for another server",
      options: [
        {
          name: "name",
          description:
            "Name of the backup to get info for (do /backup list to see names of all backups)",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "delete",
      description: "Delete an existing backup of this server",
      options: [
        {
          name: "name",
          description:
            "Name of the backup to delete (do /backup list to see names of all backups)",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "load",
      description:
        "Load a backup for this server or a backup you created for another server",
      options: [
        {
          name: "name",
          description:
            "Name of the backup to load (do /backup list to see names of all backups)",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "create":
        const name = interaction.options.getString("name");

        if (
          await client.backups.findOne({
            guildId: interaction.guild.id,
            name: name.toLowerCase(),
          })
        )
          return interaction.error(
            `This server already has a backup with the name of ${name}`
          );

        await interaction.reply(
          `${client.emojis.cache.get(
            client.config.emotes.loading
          )} **Creating backup...** This may take a while`
        );

        backup
          .create(interaction.guild, {
            jsonBeautify: true,
          })
          .then(async (data) => {
            await client.backups.create({
              guildId: interaction.guild.id,
              createdBy: interaction.member.id,
              name: name.toLowerCase(),
              id: data.id,
            });

            const createEmbed = new EmbedBuilder()
              .setTitle("Backup Created")
              .setDescription(
                `A backup was created for **${interaction.guild.name}** with the name of **${name}**`
              )
              .setColor("#00FF08");

            await interaction.editReply({
              content: `${interaction.member}`,
              embeds: [createEmbed],
            });
          });
        break;

      case "list":
        const serverBackups =
          (await client.backups.find({ guildId: interaction.guild.id })) || [];
        let createdBackups = (
          (await client.backups.find({ createdBy: interaction.member.id })) ||
          []
        ).filter((b) => b.guildId !== interaction.guild.id);

        const listEmbed = new EmbedBuilder()
          .setTitle("All Backups")
          .setColor(client.config.main_color)
          .addFields(
            {
              name: "Backups for this server",
              value: serverBackups.map((b) => b.name).join("\n") || "None",
            },
            {
              name: "Backups you created for other servers",
              value: createdBackups.map((b) => b.name).join("\n") || "None",
            }
          );

        interaction.reply({ embeds: [listEmbed] });
        break;
      case "info":
        const bName = interaction.options.getString("name");
        const foundBackup =
          (await client.backups.findOne({
            guildId: interaction.guild.id,
            name: bName.toLowerCase(),
          })) ||
          (await client.backups.findOne({
            createdBy: interaction.member.id,
            name: bName.toLowerCase(),
          }));

        if (!foundBackup)
          return interaction.error(
            `There are no backups with the name of \`${bName.toLowerCase()}\` for this server or other servers you created backups in`
          );

        const info = await backup.fetch(foundBackup.id);

        let channels = [];

        info.data.channels.categories.forEach((c) => {
          c.children.forEach((ch) => channels.push(ch));
        });

        const infoEmbed = new EmbedBuilder()
          .setTitle(`Backup: ${foundBackup.name}`)
          .setColor(client.config.main_color)
          .setThumbnail(client.guilds.cache.get(foundBackup.guildId).iconURL())
          .addFields(
            { name: "name", value: foundBackup.name, inline: true },
            {
              name: "Server",
              value: info.data.name,
              inline: true,
            },
            { name: "Backup ID", value: info.id, inline: true },
            {
              name: "Created By",
              value:
                "@" + client.users.cache.get(foundBackup.createdBy).username,
              inline: true,
            },
            {
              name: "Created On",
              value: `<t:${Math.round(info.data.createdTimestamp / 1000)}:f>`,
              inline: true,
            },
            { name: "Size", value: info.size.toString(), inline: true },
            {
              name: "Channels",
              value: channels.length.toString(),
              inline: true,
            },
            {
              name: "Roles",
              value: info.data.roles.length.toString(),
              inline: true,
            },
            {
              name: "Bans",
              value: info.data.bans.length.toString(),
              inline: true,
            },
            {
              name: "Emojis",
              value: info.data.emojis.length.toString(),
              inline: true,
            }
          );

        interaction.reply({ embeds: [infoEmbed] });

        break;
      case "delete":
        const dBackup = await client.backups.findOne({
          guildId: interaction.guild.id,
          name: interaction.options.getString("name").toLowerCase(),
        });

        if (!dBackup)
          return interaction.error(
            `This server doesn\'t have a backup with the name of \`${interaction.options
              .getString("name")
              .toLowerCase()}\``
          );

        backup.remove(dBackup.id);
        await client.backups.findOneAndRemove({
          guildId: interaction.guild.id,
          name: interaction.options.getString("name").toLowerCase(),
          id: dBackup.id,
        });

        interaction.reply(`✅ You deleted the backup **${dBackup.name}**`);

        break;

      case "load":
        const owner = await interaction.guild.fetchOwner();
        if (owner.id !== interaction.member.id)
          return interaction.error(
            "Only the owner of the server can load backups"
          );

        const lBackup =
          (await client.backups.findOne({
            guildId: interaction.guild.id,
            name: interaction.options.getString("name").toLowerCase(),
          })) ||
          (await client.backups.findOne({
            name: interaction.options.getString("name").toLowerCase(),
            createdBy: interaction.member.id,
          }));

        if (!lBackup)
          return interaction.error(
            `There are no backups with the name of \`${interaction.options.getString(
              "name"
            )}\` in this server or any other server you created backups in`
          );

        await interaction.reply(
          `${client.emojis.cache.get(
            client.config.emotes.loading
          )} **Loading backup...** This may take a while. You will be DMed when the loading is complete`
        );

        await client.wait(5000);

        backup
          .load(lBackup.id, interaction.guild, {
            clearGuildBeforeRestore: true,
          })
          .then(() => {
            interaction.member.send(
              `✅ The backup **${lBackup.name}** was loaded in **${interaction.guild.name}**`
            );

            if (owner.id !== interaction.member.id) {
              owner.send(
                `The user **@${interaction.member.username}** has loaded a backup with the name of **${lBackup.name}** in your server **${interaction.guild.name}**`
              );
            }
          });
    }
  },
};
