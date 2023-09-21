const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { getProfile } = require("gd-browser-api");

module.exports = {
  name: "geometrydash",
  description: "Get information for any Geometry Dash player",
  options: [
    {
      name: "username",
      description: "The username of the player",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();
    try {
      const user = await getProfile(interaction.options.getString("username"));

      const status = {
        true: "On",
        false: "Off",
      };

      let color = [];

      for (i in user.col1RGB) {
        color.push(user.col1RGB[i]);
      }

      const embed = new EmbedBuilder()
        .setTitle(`Information for ${user.username}`)
        .setColor(color)
        .addFields({
          name: "Player ID",
          value: user.playerID ? user.playerID : "None",
          inline: true,
        })
        .addFields({
          name: "Account ID",
          value: user.accountID ? user.accountID : "None",
          inline: true,
        })
        .addFields({ name: "Rank", value: user.rank.toString(), inline: true })
        .addFields({
          name: "Stars",
          value: user.stars ? user.stars.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Diamonds",
          value: user.diamonds ? user.diamonds.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Coins",
          value: user.coins ? user.coins.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "User Coins",
          value: user.userCoins ? user.userCoins.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Demons",
          value: user.demons ? user.demons.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Friend Requests",
          value: status[user.friendRequests ? user.friendRequests : false],
          inline: true,
        })
        .addFields({
          name: "Messages",
          value: user.messages ? user.messages : "Off",
          inline: true,
        })
        .addFields({
          name: "YouTube",
          value: user.youtube
            ? `[Click here to go to their channel](https://youtube.com/channel/${user.youtube})`
            : "None",
          inline: true,
        })
        .addFields({
          name: "Twitter",
          value: user.twitter ? user.twitter : "None",
          inline: true,
        })
        .addFields({
          name: "Twitch",
          value: user.twitch ? user.twitch : "None",
          inline: true,
        })
        .addFields({
          name: "Ship",
          value: user.ship ? user.ship.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Ball",
          value: user.ball ? user.ball.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "UFO",
          value: user.ufo ? user.ufo.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Wave",
          value: user.wave ? user.wave.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Robot",
          value: user.robot ? user.robot.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Spider",
          value: user.spider ? user.spider.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Death Effect",
          value: user.deathEffect ? user.deathEffect.toString() : "None",
          inline: true,
        })
        .addFields({
          name: "Glow",
          value: status[user.glow ? user.glow : false],
          inline: true,
        });

      await interaction.followUp({ embeds: [embed] });
    } catch (e) {
      return await interaction.followUp({
        content: `❌ **Couldn\'t find a user with the username: ${interaction.options.getString(
          "username"
        )}**`,
      });
    }
  },
};
