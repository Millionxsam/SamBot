const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "mcserver",
  description: "Get the status of any Minecraft Java or Bedrock server",
  options: [
    {
      name: "platform",
      description: "Is this server a Java or Bedrock server?",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "Java", value: "java" },
        { name: "Bedrock", value: "bedrock" },
      ],
    },
    {
      name: "address",
      description: "The address of the server",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "port",
      description:
        "The port of the server. If you don't know what this is, leave it blank.",
      required: false,
      type: ApplicationCommandOptionType.Integer,
      minValue: 0,
    },
  ],
  run: (client, interaction) => {
    const platform = interaction.options.getString("platform");
    const address =
      interaction.options.getString("address") +
      ":" +
      (interaction.options.getInteger("port") ||
        (platform === "java" ? "25565" : "19132"));

    fetch(`https://api.mcstatus.io/v2/status/${platform}/${address}`)
      .then((res) => res.text())
      .then((server) => {
        if (server === "Invalid address value")
          return interaction.error(
            `The address and/or port provided is/are invalid.\n\nAddress: \`${address}\``
          );
        server = JSON.parse(server);

        const status = {
          true: "Yes",
          false: "No",
        };

        const embed = new EmbedBuilder()
          .setTitle(`Minecraft Server Status For ${server.host}`)
          .setColor(server.online ? "#00FF08" : "#FF0000")
          .setThumbnail(
            "https://purepng.com/public/uploads/large/71502582731v7y8uylzhygvo3zf71tqjtrwkhwdowkysgsdhsq3vr35woaluanwa4zotpkewhamxijlulfxcrilendabjrjtozyfrqwogphaoic.png"
          )
          .addFields(
            { name: "Address", value: server.host, inline: true },
            { name: "Port", value: server.port.toString(), inline: true },
            {
              name: "Status",
              value: server.online ? "Online" : "Offline",
              inline: true,
            },
            {
              name: "Blocked",
              value: status[server.eula_blocked],
              inline: true,
            },
            {
              name: "Version",
              value: server.version
                ? server.version.name_clean || "Unknown"
                : "Unknown",
              inline: true,
            },
            {
              name: "Protocol",
              value: server.version
                ? server.version.protocol.toString() || "Unknown"
                : "Unknown",
              inline: true,
            },
            {
              name: "Players Online",
              value: server.players
                ? `${server.players.online || 0}/${server.players.max}`
                : "0",
              inline: true,
            },
            {
              name: "MOTD",
              value: server.motd
                ? server.motd.clean || "None or unknown"
                : "None or unknown",
              inline: true,
            }
          );

        if (platform === "java") {
          embed.addFields(
            {
              name: "Software",
              value: server.software || "Unknown",
              inline: true,
            },
            {
              name: "SRV Host",
              value: server.srv_record
                ? server.srv_record.host || "Unknown"
                : "Unknown",
              inline: true,
            },
            {
              name: "SRV Port",
              value: server.srv_record
                ? server.srv_record.port.toString() || "Unknown"
                : "Unknown",
              inline: true,
            }
          );
        } else if (platform === "bedrock") {
          embed.addFields(
            {
              name: "Gamemode",
              value: server.gamemode || "Unknown",
              inline: true,
            },
            {
              name: "Server ID",
              value: server.server_id || "Unknown",
              inline: true,
            },
            {
              name: "Edition",
              value: server.edition || "Unknown",
              inline: true,
            }
          );
        }

        interaction.reply({ embeds: [embed] });
      });
  },
};
