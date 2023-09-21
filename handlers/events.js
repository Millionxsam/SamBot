const { readdirSync } = require("fs");

module.exports = (client) => {
  const events = readdirSync("./events/").filter((file) =>
    file.endsWith(".js")
  );

  events.forEach((file) => {
    let event = require(`../events/${file}`);
    if (event.listener && typeof event.listener !== "string") return;

    event.listener = event.listener || file.replace(".js", "");
    client.on(event.listener, event.run.bind(null, client));
  });
};
