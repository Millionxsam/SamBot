const { default: axios } = require("axios");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const roblox = require("noblox.js");

module.exports = {
  name: "roblox",
  description: "Get information of a Roblox user",
  options: [
    {
      name: "user",
      description: "Get information about a user",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "username",
          description: "Username of the user",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    await interaction.deferReply();

    const username = interaction.options.getString("username");
    const userId = await roblox.getIdFromUsername(username).catch((e) => {
      return interaction.editReply("❌ **That user does not exist**");
    });
    const player = await roblox.getPlayerInfo({ userId }).catch((e) => {
      return interaction.editReply("❌ **That user does not exist**");
    });
    const avatar = (
      await axios.get(
        `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`
      )
    ).data.data[0].imageUrl;

    const avatarHeadshot = (
      await axios.get(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
      )
    ).data.data[0].imageUrl;

    console.log(avatarHeadshot);

    const embed = new EmbedBuilder()
      .setTitle("Roblox User: " + player.username)
      .setThumbnail(avatarHeadshot)
      .setColor(client.config.main_color)
      .setImage(avatar)
      .addFields(
        {
          name: "Display Name",
          value: player.displayName || "None",
          inline: true,
        },
        {
          name: "Username",
          value: player.username || "None",
          inline: true,
        },
        { name: "Bio", value: player.blurb || "None", inline: true },
        {
          name: "Joined Roblox",
          value: `<t:${Math.round(
            new Date(player.joinDate).getTime() / 1000
          )}:F>`,
          inline: true,
        },
        {
          name: "Friend Count",
          value: player.friendCount.toString(),
          inline: true,
        },
        {
          name: "Followers",
          value: player.followerCount.toString(),
          inline: true,
        },
        {
          name: "Following",
          value: player.followingCount.toString(),
          inline: true,
        },
        {
          name: "Old Names",
          value: player.oldNames.join(", ") || "None",
          inline: true,
        },
        {
          name: "Banned?",
          value: player.isBanned ? "Yes" : "No",
          inline: true,
        }
      );

    await interaction.editReply({ embeds: [embed] });
  },
};
