const { EmbedBuilder } = require("discord.js");
const port = parseInt(process.env.port);

console.log(`http://localhost:${port}`);

module.exports = (client) => {
  const express = require("express");
  const Topgg = require("@top-gg/sdk");
  const cors = require("cors");

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  const webhook = new Topgg.Webhook(process.env.topggwebhook);

  app.get("/", (req, res) => {
    res.send(`Server is ready`);
  });

  app.get("/ping", (req, res) => {
    res.json({ ping: client.ws.ping });
  });

  app.get("/guilds", (req, res) => {
    res.json({ guilds: client.guilds.cache });
  });

  app.get("/users", (req, res) => {
    res.json({ guilds: client.users.cache });
  });

  app.get("/commands", (req, res) => {
    let commands = [];

    client.commands.forEach((command) => {
      commands.push(command);
    });

    commands = JSON.stringify(commands, (k, v) => {
      if (typeof v === "bigint") return v.toString();
      return v;
    });

    res.json({ commands });
  });

  app.post(
    "/vote",
    webhook.listener(async (vote) => {
      const user = client.users.cache.get(vote.user);
      if (user) {
        let votes = await client.votes.findOne({
          userId: vote.user,
        });

        if (!votes) {
          await client.votes.create({
            userId: vote.user,
          });
        }

        await client.votes.findOneAndUpdate(
          { userId: vote.user },
          { lastVoted: Date.now() }
        );

        let currency = await client.currency.findOne({
          userId: vote.user,
        });

        if (!currency) {
          await client.currency.create({
            userId: vote.user,
          });
        }

        await client.currency.findOneAndUpdate(
          { userId: vote.user },
          { quarks: (currency.quarks || 0) + 10000 }
        );

        const voteEmbed = new EmbedBuilder()
          .setTitle("Thanks for voting for SamBot!")
          .setColor(client.config.main_color)
          .setThumbnail(user.displayAvatarURL())
          .setFooter({
            text: "You can vote again in 12 hours to get the rewards again",
          })
          .setDescription(
            `Thanks for supporting SamBot! You have now got the following rewards:\n\n> You now level up 50% faster in all servers for the next 12 hours\n> ${client.quarks}**10,000** quarks added to your balance`
          );
        user.send({ embeds: [voteEmbed] });
      }
    })
  );

  app.listen(port, () => console.log(`👂 Listening on port ${port}`));
};
