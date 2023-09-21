const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const config = require("../config.json");

module.exports.run = async (client, interaction) => {
  interaction.error = (text) => {
    interaction.reply({ content: `❌ **${text}**`, ephemeral: true });
  };

  let currencyData = await client.currency.findOne({
    userId: interaction.member.id,
  });
  if (!currencyData) {
    let c = await client.currency.create({
      userId: interaction.member.id,
    });

    currencyData = c;
  }

  interaction.currency = currencyData;

  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.error("This command no longer exists");

    if (command.botPerms) {
      let neededPerms = [];

      command.botPerms.forEach((p) => {
        if (
          !interaction.guild.members.me
            .permissionsIn(interaction.channel)
            .has(p)
        )
          neededPerms.push("`" + p + "`");
      });

      if (neededPerms.length) {
        return interaction.error(
          `I need the following permissions to run this command:\n\n${neededPerms.join(
            "\n"
          )}`
        );
      }
    }

    if (command.category === "Music" && !interaction.member.voice.channel)
      return interaction.error(
        "You must be in a voice channel to run that command"
      );

    if (
      command.category === "Ticket" &&
      command.name !== "ticket-new" &&
      command.name !== "ticket-open" &&
      !interaction.member
        .permissionsIn(interaction.channel)
        .has("ManageChannels") &&
      interaction.channel.name !== `t-${interaction.member.user.id}`
    )
      return interaction.error(
        "You must be in one of your tickets to run that command"
      );

    if (command.items) {
      let neededItems = [];

      command.items.forEach((item) => {
        if (!interaction.currency.items.find((i) => i.name === item))
          neededItems.push(item);
      });

      if (neededItems.length)
        return interaction.error(
          `You need the following items to run this command:\n\n${neededItems
            .map((i) => {
              let item = client.shop[i];

              return `${item.emoji} ${item.name}`;
            })
            .join(
              "\n"
            )}\n\nDo the /buy command to buy items, or /shop to view all items you can buy and prices`
        );
    }

    try {
      command.run(client, interaction);
    } catch (e) {
      interaction.error(
        `There was an unexpected error while running the command \`${command.name}\`:\n\`\`\`js\n${e}\n\`\`\`\nPlease try again later. If it keeps happening, use the \`/feedback\` command to report an error, or issue a ticket in our server and include a screenshot of this message to report it`
      );
      console.error(e);
    }
  } else if (interaction.isStringSelectMenu()) {
    switch (interaction.customId) {
      case "help":
        const value = interaction.values[0];
        const commands = Array.from(client.commands.values());

        const embed = new EmbedBuilder()
          .setTitle(
            `${
              config.command_categories.find((c) => c.name === value).emoji
            } ${value} Commands`
          )
          .setColor(config.main_color)
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `> **${
              config.command_categories.find((c) => c.name === value)
                .description
            }**\n\n${commands
              .filter((c) => c.category === value)
              .map((c) => `\`${c.name}\` - ${c.description}`)
              .join("\n\n")}`
          );

        await interaction.update({ embeds: [embed] });
        break;
      case "m-filters":
        const queue = client.distube.getQueue(interaction);

        queue.filters.set(interaction.values);

        await interaction.update(client.distube.queueInfoEmbed(queue));
        await interaction.followUp(
          `**✅ Applied changes**\n\n**Current filters:** ${
            queue.filters.names.join(", ") || "none"
          }`
        );
        break;
    }
  } else if (interaction.isButton()) {
    (async () => {
      if (interaction.customId.startsWith("m-")) {
        const queue = client.distube.getQueue(interaction);
        switch (interaction.customId) {
          case "m-rewind":
            interaction.options = [];
            interaction.options.getInteger = (x) => {
              return 10;
            };
            break;
          case "m-forward":
            interaction.options = [];
            interaction.options.getInteger = (x) => {
              return 10;
            };
            break;
          case "m-volumeu":
            interaction.upordown = "up";
            require("../commands/Music/volume.js").run(client, interaction);
            break;
          case "m-volumed":
            interaction.upordown = "down";
            require("../commands/Music/volume.js").run(client, interaction);
            break;
          case "m-repeat":
            let m =
              queue.repeatMode === 0
                ? "song"
                : queue.repeatMode === 1
                ? "queue"
                : "off";
            interaction.options = [];
            interaction.options.getString = (x) => {
              return m;
            };
        }
        if (
          interaction.customId === "m-volumeu" ||
          interaction.customId === "m-volumed"
        )
          return;

        require(`../commands/Music/${
          interaction.customId.split("-")[1]
        }.js`).run(client, interaction);
      } else if (interaction.customId.startsWith("t-add-accept")) {
        const member = await interaction.guild.members.fetch(
          interaction.customId.split("accept-")[1]
        );

        if (
          !interaction.member
            .permissionsIn(interaction.channel)
            .has(PermissionsBitField.Flags.ManageChannels)
        )
          return interaction.reply({
            content:
              "This request can only be accepted by someone who has permission to manage this channel",
            ephemeral: true,
          });

        await interaction.channel.permissionOverwrites.create(member.user, {
          ViewChannel: true,
          ReadMessageHistory: true,
        });

        const accept = new ButtonBuilder()
          .setCustomId(`t-add-accept-${member.user.id}`)
          .setLabel("Accept")
          .setDisabled(true)
          .setStyle(ButtonStyle.Success);

        const deny = new ButtonBuilder()
          .setCustomId(`t-add-deny`)
          .setLabel("Deny")
          .setDisabled(true)
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents([accept, deny]);

        await interaction.update({ components: [row] });
        await interaction.followUp(
          `✅ ${member} **was added to the ticket**\n\nRequest accepted by ${interaction.member}`
        );
      } else if (interaction.customId === "t-add-deny") {
        if (
          !interaction.member
            .permissionsIn(interaction.channel)
            .has(PermissionsBitField.Flags.ManageChannels)
        )
          return interaction.reply({
            content:
              "This request can only be denied by someone who has permission to manage this channel",
            ephemeral: true,
          });

        const accept = new ButtonBuilder()
          .setCustomId(`t-add-accept`)
          .setLabel("Accept")
          .setDisabled(true)
          .setStyle(ButtonStyle.Success);

        const deny = new ButtonBuilder()
          .setCustomId(`t-add-deny`)
          .setLabel("Deny")
          .setDisabled(true)
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents([accept, deny]);

        await interaction.update({ components: [row] });
        await interaction.followUp(
          `❌ **Request denied**\n\nDenied by ${interaction.member}`
        );
      }
    })();
  }
};
