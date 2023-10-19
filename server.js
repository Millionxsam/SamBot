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
        let u = await client.votes.findOne({
          userId: vote.user,
        });

        if (!u) {
          await client.votes.create({
            userId: vote.user,
          });
        }
      }

      await client.votes.findOneAndUpdate(
        { userId: vote.user },
        { lastVoted: Date.now() }
      );

      const voteEmbed = new EmbedBuilder()
        .setTitle("Thanks for voting for SamBot!")
        .setColor(client.config.main_color)
        .setThumbnail(user.displayAvatarURL())
        .setDescription(
          "Thanks for supporting SamBot. You will now level up 50% faster for 12 hours, you can vote again after 12 hours to get these rewards again."
        );
      user.send({ embeds: [voteEmbed] });
    })
  );

  app.listen(8836);
};
