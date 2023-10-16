const { readdirSync } = require("fs");
const devServers = require("../config.json").dev_servers;

const commands = [];

module.exports = (client) => {
  readdirSync("./commands/").forEach((folder) => {
    const files = readdirSync(`./commands/${folder}/`).filter((file) =>
      file.endsWith(".js")
    );

    files.forEach((file) => {
      const command = require(`../commands/${folder}/${file}`);
      command.category = folder;

      client.commands.set(command.name, command);
      commands.push(command);
    });

    client.once("ready", () => {
      // Set global commands -->
      client.application.commands.set(commands);

      // Set commands only on developer servers during testing -->
      // devServers.forEach((id) =>
      //   client.guilds.cache.get(id).commands.set(commands)
      // );
    });
  });
};
