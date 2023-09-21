const { ActivityType } = require("discord.js");
const statusUpdateInterval = 30000;

module.exports.run = async (client) => {
  console.log(`🤖 ${client.user.tag} is ready`);

  while (true) {
    // Setting the shortcut client.quarks to show the emoji
    client.quarks = client.emojis.cache.get(client.config.emotes.quarks);

    // Update bot's status every few seconds
    client.user.setActivity({ name: "/help", type: ActivityType.Listening });

    await client.wait(statusUpdateInterval);

    client.user.setActivity({ name: "/botinfo", type: ActivityType.Listening });

    await client.wait(statusUpdateInterval);

    client.user.setActivity({
      name: `${client.guilds.cache.size} Servers!`,
      type: ActivityType.Watching,
    });

    await client.wait(statusUpdateInterval);

    client.user.setActivity({
      name: `${client.ws.ping}ms ping`,
      type: ActivityType.Playing,
    });

    await client.wait(statusUpdateInterval);

    client.user.setActivity({
      name: `${client.commands.size} commands!`,
      type: ActivityType.Listening,
    });

    await client.wait(statusUpdateInterval);
  }
};
