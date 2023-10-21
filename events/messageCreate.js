const { EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");

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

  let voteRewards = false;
  let lastVoted = (
    (await client.votes.findOne({ userId: message.member.id })) || {}
  ).lastVoted;

  if (lastVoted) {
    if (Date.now() - lastVoted <= 43200000) voteRewards = true;
  }

  message.voted = voteRewards;

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

    let newXp = message.voted ? levelData.xp + 15 : levelData.xp + 10;
    let newLevel = levelData.level;

    const requiredXp = (10 + newLevel * 5) * 10;

    // When the user levels up -->
    if (newXp >= requiredXp) {
      newXp = newXp - requiredXp;
      newLevel++;

      let lvlUpMsg =
        message.guildSettings.leveling.message ||
        `${message.member} Congratulations! You just leveled up to **level ${newLevel}**!`;
      lvlUpMsg = lvlUpMsg
        .replaceAll("[user]", `${message.member}`)
        .replaceAll("[level]", `${newLevel}`);

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
    const { Hercai } = require("hercai");
    const herc = new Hercai();

    const res = (
      await herc.question({
        model: "v2",
        content: message.content,
      })
    ).reply;

    return message.reply(res);
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
          const output = await eval(`(async () => { ${args.join(" ")} })()`);

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
