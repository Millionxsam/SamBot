const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "serversettings",
  description: "Customize SamBot settings for this server",
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  options: [
    {
      name: "leveling",
      description: "Settings for the leveling system",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "toggle",
          description: "Turn the leveling system on or off for this server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "set",
              description: "Enabled or disable the leveling system",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Enable", value: "true" },
                { name: "Disable", value: "false" },
              ],
            },
          ],
        },
        {
          name: "set-channel",
          description: "Set the where to send level-up messages in",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "mode",
              description: "How you want to send level-up messages",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Send a message in this channel", value: "channel" },
                {
                  name: "Send a message in the channel where the user leveled up",
                  value: "reply",
                },
                { name: "Send a message in the user's DMs", value: "dm" },
              ],
            },
          ],
        },
        {
          name: "set-message",
          description: "Customize the text of level-up messages",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "message",
              description:
                "The message that SamBot will send - put [user] to ping the user and [level] to say their new level",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "music",
      type: ApplicationCommandOptionType.SubcommandGroup,
      description: "Change settings for the music system",
      options: [
        {
          name: "toggle",
          description: "Enable or disable the music system",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "set",
              description: "Enable or disable the music system",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Enable music system", value: "true" },
                { name: "Disable music system", value: "false" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "chatbot",
      type: ApplicationCommandOptionType.SubcommandGroup,
      description: "Change settings for SamBot chatbot",
      options: [
        {
          name: "toggle",
          description: "Enable or disable the chatbot",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "set",
              description: "Enable or disable the chatbot",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [
                { name: "Enable Chatbot", value: "true" },
                { name: "Disable Chatbot", value: "false" },
              ],
            },
          ],
        },
        {
          name: "channels",
          description: "Add or remove a chatbot channel",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "toggle",
              description: "The channel to add or remove from chatbot channels",
              type: ApplicationCommandOptionType.Channel,
              required: true,
            },
          ],
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    const [group, command] = [
      interaction.options.getSubcommandGroup(),
      interaction.options.getSubcommand(),
    ];

    const status = {
      true: true,
      false: false,
    };

    if (group === "leveling") {
      if (command === "toggle") {
        const enabled = status[interaction.options.getString("set")];
        const levelData = interaction.guildSettings.leveling || {};
        if ((levelData.enabled || false) === enabled)
          interaction.error(
            `Leveling system in this server is already ${
              enabled ? "enabled" : "disabled"
            }`
          );

        levelData.enabled = enabled;

        await client.guildSettings.findOneAndUpdate(
          {
            guildId: interaction.guild.id,
          },
          {
            leveling: levelData,
          }
        );

        interaction.reply(
          `✅ Leveling system **${enabled ? "enabled" : "disabled"}**`
        );
      } else if (command === "set-channel") {
        const mode = interaction.options.getString("mode");

        if (!interaction.guildSettings.leveling.enabled)
          return interaction.error(
            "Leveling system is not enabled for this server"
          );

        if (
          mode === interaction.guildSettings.leveling.levelUpMode &&
          mode !== "channel"
        )
          return interaction.error(
            `The level up mode for this server is already set to ${mode}`
          );

        if (mode === "channel") {
          interaction.guildSettings.leveling.levelUpMode = "channel";
          interaction.guildSettings.leveling.channelId = interaction.channel.id;

          await client.guildSettings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { leveling: interaction.guildSettings.leveling }
          );

          interaction.reply(
            `✅ SamBot will now send level-up messages to this channel (${interaction.channel})`
          );
        } else if (mode === "dm") {
          interaction.guildSettings.leveling.levelUpMode = "dm";

          await client.guildSettings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { leveling: interaction.guildSettings.leveling }
          );

          interaction.reply(`✅ SamBot will now send level-up messages to DMs`);
        } else if (mode === "reply") {
          interaction.guildSettings.leveling.levelUpMode = "reply";

          await client.guildSettings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { leveling: interaction.guildSettings.leveling }
          );

          interaction.reply(
            `✅ SamBot will now send level-up messages in the channel where the user leveled up`
          );
        }
      } else if (command === "set-message") {
        if (!interaction.guildSettings.leveling.enabled)
          return interaction.error(
            "Leveling system is not enabled for this server"
          );

        interaction.guildSettings.leveling.message =
          interaction.options.getString("message");

        await client.guildSettings.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { leveling: interaction.guildSettings.leveling }
        );

        interaction.reply(
          `✅ The level-up message has been set to:\n\n${interaction.guildSettings.leveling.message}`
        );
      }
    } else if (group === "music") {
      if (command === "toggle") {
        const music = status[interaction.options.getString("set")];

        if (interaction.guildSettings.music.enabled === music)
          return interaction.error(
            `Music is already ${music ? "enabled" : "disabled"}`
          );

        interaction.guildSettings.music.enabled = music;

        await client.guildSettings.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { music: interaction.guildSettings.music }
        );

        interaction.reply(`✅ Music system ${music ? "enabled" : "disabled"}`);
      }
    } else if (group === "chatbot") {
      if (command === "toggle") {
        const chatbot = status[interaction.options.getString("set")];

        if (interaction.guildSettings.chatbot.enabled === chatbot)
          return interaction.error(
            `Chatbot is already ${chatbot ? "enabled" : "disabled"}`
          );

        interaction.guildSettings.chatbot.enabled = chatbot;

        await client.guildSettings.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { chatbot: interaction.guildSettings.chatbot }
        );

        interaction.reply(
          `✅ Chatbot **${chatbot ? "enabled" : "disabled"}**${
            !chatbot
              ? "\n\n**Note:** This will only disable the /chatbot command. To remove chatbot channels, do `/serversettings chatbot channels` (chatbot channel means any message sent in that channel will be replied to by SamBot chatbot)"
              : ""
          }`
        );
      } else if (command === "channels") {
        const channel = interaction.options.getChannel("toggle");
        const chatbotData = interaction.guildSettings.chatbot;
        const channelExists = chatbotData.channels.includes(channel.id);

        if (channelExists) {
          chatbotData.channels.splice(
            chatbotData.channels.indexOf(channel.id),
            1
          );
        } else {
          chatbotData.channels.push(channel.id);
        }

        await client.guildSettings.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { chatbot: chatbotData }
        );

        interaction.reply(
          `${
            channelExists
              ? `${client.emojis.cache.get(client.config.emotes.minus)}`
              : `${client.emojis.cache.get(client.config.emotes.plus)}`
          } ${channel} ${
            channelExists ? "removed from" : "added to"
          } chatbot channels\n\n**Note:** If a channel is a chatbot channel, that means SamBot chatbot will reply to every message sent in that channel, even if the user didn\'t enable it with /chatbot`
        );
      }
    }
  },
};
