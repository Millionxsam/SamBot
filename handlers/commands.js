const { readdirSync } = require("fs");
const { dev_servers, devMode } = require("../config.json");

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
      if (devMode) {
        dev_servers.forEach((id) =>
          client.guilds.cache.get(id).commands.set(commands)
        );
      } else {
        client.application.commands.set(commands);
      }
    });
  });
};
