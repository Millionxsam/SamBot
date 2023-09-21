const { EmbedBuilder } = require("discord.js");

module.exports.run = async (client, message) => {
  if (!message.content.startsWith(client.config.prefix) || message.member.bot)
    return;

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
