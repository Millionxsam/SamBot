const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "github",
  description: "Get information about a GitHub user",
  options: [
    {
      name: "username",
      description: "Username of the GitHub user to search for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: (client, interaction) => {
    const search = interaction.options.getString("username").split(/ +/g);

    fetch(`https://api.github.com/users/${search.join("-")}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.message)
          return interaction.reply({
            content: `User Not Found | Please Give Me A Valid Username!`,
            ephemeral: true,
          });

        let {
          login,
          avatar_url,
          name,
          id,
          html_url,
          public_repos,
          followers,
          following,
          location,
          created_at,
          bio,
        } = body;

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `${login} Information!`,
            iconURL: avatar_url,
            url: html_url,
          })
          .setColor(config.main_color)
          .setThumbnail(avatar_url)
          .addFields({ name: `Username`, value: `${login}`, inline: true })
          .addFields({ name: `ID`, value: `${id}`, inline: true })
          .addFields({ name: `Bio`, value: bio || "No Bio", inline: true })
          .addFields({
            name: `Public Repositories`,
            value: `${public_repos || "None"}`,
            inline: true,
          })
          .addFields({ name: `Followers`, value: `${followers}`, inline: true })
          .addFields({ name: `Following`, value: `${following}`, inline: true })
          .addFields({
            name: `Location`,
            value: `${location || "Not set"}`,
            inline: true,
          })
          .addFields({
            name: `Account Created`,
            value: `<t:${Math.floor(new Date(created_at).getTime() / 1000)}:f>`,
            inline: true,
          });

        interaction.reply({
          embeds: [embed],
        });
      });
  },
};
