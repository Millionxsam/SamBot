const { EmbedBuilder } = require("discord.js");
const CharacterAI = require("node_characterai");

module.exports.run = async (client, message) => {
  if (!message || !message.member || message.member.user.bot) return;

  let currencyData = await client.currency.findOne({
    userId: message.member.id,
  });
  if (!currencyData)
    currencyData = await client.currency.create({
      userId: message.member.id,
    });
  message.currency = currencyData;

  let userSettings = await client.userSettings.findOne({
    userId: message.member.id,
  });
  if (!userSettings)
    userSettings = await client.userSettings.create({
      userId: message.member.id,
    });
  message.userSettings = userSettings;

  let guildSettings = await client.guildSettings.findOne({
    guildId: message.guild.id,
  });
  if (!guildSettings)
    guildSettings = await client.guildSettings.create({
      guildId: message.guild.id,
    });
  message.guildSettings = guildSettings;

  // Add xp to member when they send a message -->
  if (message.guildSettings.leveling.enabled) {
    let levelData = await client.levels.findOne({
      userId: message.member.id,
      guildId: message.guild.id,
    });

    if (!levelData) {
      let l = await client.levels.create({
        userId: message.member.id,
        guildId: message.guild.id,
      });

      levelData = l;
    }

    let newXp = levelData.xp + 10;
    let newLevel = levelData.level;

    const requiredXp = (10 + newLevel * 5) * 10;
    let lvlUpMsg =
      message.guildSettings.leveling.message ||
      `${message.member} Congratulations! You just leveled up to **level ${newLevel}**!`;
    lvlUpMsg = lvlUpMsg
      .replaceAll("[user]", `${message.member}`)
      .replaceAll("[level]", `${newLevel}`);

    // When the user levels up -->
    if (newXp >= requiredXp) {
      newXp = newXp - requiredXp;
      newLevel++;

      if (message.guildSettings.leveling.levelUpMode === "reply") {
        message.channel.send(lvlUpMsg);
      } else if (message.guildSettings.leveling.levelUpMode === "channel") {
        message.guild.channels.cache
          .get(message.guildSettings.leveling.channelId)
          .send(lvlUpMsg);
      } else if (message.guildSettings.leveling.levelUpMode === "dm") {
        message.member.user.send(lvlUpMsg);
      }
    }

    await client.levels.findOneAndUpdate(
      {
        userId: message.member.id,
        guildId: message.guild.id,
      },
      {
        level: newLevel,
        xp: newXp,
      }
    );
  }

  if (
    (message.userSettings.chatbot.channels.includes(message.channel.id) &&
      message.guildSettings.chatbot.enabled &&
      !message.guildSettings.chatbot.channels.includes(message.channel.id)) ||
    message.guildSettings.chatbot.channels.includes(message.channel.id)
  ) {
    await message.channel.sendTyping();

    const cai = new CharacterAI();
    await cai.authenticateWithToken(
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVqYmxXUlVCWERJX0dDOTJCa2N1YyJ9.eyJpc3MiOiJodHRwczovL2NoYXJhY3Rlci1haS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTc0NjYwMDk0OTE5NTE4ODQyOTciLCJhdWQiOlsiaHR0cHM6Ly9hdXRoMC5jaGFyYWN0ZXIuYWkvIiwiaHR0cHM6Ly9jaGFyYWN0ZXItYWkudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY5NjExNTI2MywiZXhwIjoxNjk4NzA3MjYzLCJhenAiOiJkeUQzZ0UyODFNcWdJU0c3RnVJWFloTDJXRWtucVp6diIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.ySD51zavkWbS1n27vxibtkIERgvd7mld-TOoxjiXjnctx0AY03G3DfBz3dfvbFl2rqirD7Bn3kp7-P23o8-3nNfdee3oTPK7nCTT8XPXzKaEKNAIrvpfMqhLZariN2mbqb28w4H5yb5dfBBHprsFYx-0SlcyfVaNFezdW2JLhXGrgShHH_24wtb4pYWNu1yx2zOwd1Ch6kAKEmZ5LRYI0ewDgTv0Ko6WeBZlA6hCcNudSxeL9ojkkEgWZysg6rMGCwDyiiM-onoNtQNnVehbk3fKDZpCxgkKT6bRlGogqxNMBAYOTlMaW1w8ukoSDVxneJMNIZlBXw2HoBAOC8ZpCQ"
    );
    const characterId = "vAiUHYsp7E1d1zvu3YD0KPTiuQXO-KCW6vMvkUSa9jg";
    const chat = await cai.createOrContinueChat(characterId);

    const response = await chat.sendAndAwaitResponse(message.content, true);

    return message.reply(`${response.text}`);
  }

  // Text commands -->

  if (!message.content.startsWith(client.config.prefix)) return;

  const textCmds = [
    {
      name: "eval",
      description: "Run any javascript code from Discord",
      devOnly: true,
      run: async (msg, args) => {
        const embed = new EmbedBuilder();

        try {
          const output = await eval(args.join(" "));

          embed
            .setTitle("Eval Complete")
            .setColor("#23FF00")
            .setFields({
              name: "Output",
              value: `\`\`\`js\n${output}\n\`\`\``,
            });

          msg.reply({ embeds: [embed] });
        } catch (e) {
          embed
            .setTitle("Eval Error")
            .setColor("#FF0000")
            .setFields({
              name: "Error Message",
              value: `\`\`\`js\n${e}\n\`\`\``,
            });

          msg.reply({ embeds: [embed] });
        }
      },
    },
    {
      name: "kill",
      aliases: ["shutdown"],
      description: "Force shutdown the bot NOT RECCOMMENDED",
      devOnly: true,
      run: async (msg, args) => {
        msg.react("✅");
        await client.destroy();
      },
    },
  ];

  let cmd = message.content.replace(client.config.prefix, "");
  const arguments = cmd.split(" ");
  const commandName = arguments.splice(0, 1)[0];
  const command =
    textCmds.find((cmd) => cmd.name === commandName) ||
    textCmds.find((cmd) => (cmd.aliases || []).includes(commandName));
  if (!command) return;

  message.error = (text) => {
    message.reply(`❌ **${text}**`);
  };

  if (command.devOnly && client.config.owner !== message.member.id)
    return message.error(
      `You are not authorized to run the command \`${command.name}\``
    );

  command.run(message, arguments);
};
