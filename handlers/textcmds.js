const { readdirSync } = require("fs");

module.exports = (client) => {
  readdirSync("./textcommands/").forEach((folder) => {
    const files = readdirSync(`./textcommands/${folder}/`).filter((file) =>
      file.endsWith(".js")
    );

    files.forEach((file) => {
      const command = require(`../textcommands/${folder}/${file}`);
      command.category = folder;

      client.textcmds.set(command.name, command);
    });
  });
};
