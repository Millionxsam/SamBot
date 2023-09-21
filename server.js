module.exports = (client) => {
  const express = require("express");
  const server = express();
  const cors = require("cors");

  server.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  server.get("/commands", (req, res) => {
    let commandValues = Array.from(client.commands.values());
    const commands = [];

    for (cmd in commandValues) {
      if (commandValues[cmd].defaultMemberPermissions)
        commandValues[cmd].defaultMemberPermissions = Number(
          commandValues[cmd].defaultMemberPermissions
        );

      commands.push(commandValues[cmd]);
    }

    res.send(commands);
  });

  server.listen(80);
};
