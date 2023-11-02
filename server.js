const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  const express = require("express");
  const Topgg = require("@top-gg/sdk");

  const app = express();

  const webhook = new Topgg.Webhook(process.env.topggwebhook);

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

  app.listen(8836);
};
