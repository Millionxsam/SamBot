const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const invites = require("discord-inv");
const { main_color } = require("../../config.json");

module.exports = {
  name: "inviteinfo",
  description: "Get information about a server invite link",
  options: [
    {
      name: "invite",
      description: "The invite URL to get information about",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: (client, interaction) => {
    function titleCase(str) {
      return str.replace(/\S+/g, function (txt) {
        return txt[0].toUpperCase() + txt.substring(1).toLowerCase();
      });
    }

    const inviteLink = interaction.options.getString("invite");

    invites
      .getInviteFromURL(inviteLink, true)
      .then(async (invite) => {
        const embed = new EmbedBuilder()
          .setTitle("Invite Information")
          .setURL(invite.url)
          .setColor(main_color)
          .addFields({ name: "Code", value: invite.code, inline: true })
          .addFields({
            name: "Server ID",
            value: invite.guild.id,
            inline: true,
          })
          .addFields({
            name: "Server Name",
            value: invite.guild.name,
            inline: true,
          })
          .addFields({
            name: "Server Splash",
            value:
              invite.guild.splash === null
                ? "None"
                : `[Click Here](https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.webp)`,
            inline: true,
          })
          .addFields({
            name: "Server Banner",
            value:
              invite.guild.banner === null
                ? "None"
                : `[Click Here](https://cdn.discordapp.com/banners/${invite.guild.id}/${invite.guild.banner}.webp)`,
            inline: true,
          })
          .addFields({
            name: "Server Description",
            value: invite.guild.description || "None",
            inline: true,
          })
          .addFields({
            name: "Server Icon",
            value:
              invite.guild.icon === null
                ? "None"
                : `[Click Here](https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.webp)`,
            inline: true,
          })
          .addFields({
            name: "Server Features",
            value:
              titleCase(
                invite.guild.features
                  .join(", ")
                  .toLowerCase()
                  .split("_")
                  .join(" ")
              ) || "None",
            inline: true,
          })
          .addFields({
            name: "Server Verification Level",
            value: `${invite.guild.verification_level}` || "None",
            inline: true,
          })
          .addFields({
            name: "Server Vanity URL Code",
            value: invite.guild.vanity_url_code || "None",
            inline: true,
          })
          .addFields({
            name: "Server Member Count",
            value: `${invite.approximate_member_count}` || "0",
            inline: true,
          })
          .addFields({
            name: "Server Online Count",
            value: `${invite.approximate_presence_count}` || "0",
            inline: true,
          })
          .addFields({
            name: "Channel ID",
            value: invite.channel.id || "None",
            inline: true,
          })
          .addFields({
            name: "Channel Name",
            value: invite.channel.name || "None",
            inline: true,
          })
          .addFields({
            name: "Channel Type",
            value: `${
              invite.channel.type === 0
                ? "Text"
                : invite.channel.type === 2
                ? "Voice"
                : invite.channel.type === 4
                ? "Category"
                : invite.channel.type === 5
                ? "Announcement Channel"
                : invite.channel.type === 6
                ? "Store"
                : invite.channel.type === 10 ||
                  invite.channel.type === 11 ||
                  invite.channel.type === 12
                ? "Thread"
                : invite.channel.type === 13
                ? "Stage"
                : "None"
            }`,
            inline: true,
          })
          .addFields({
            name: "Inviter ID",
            value: invite.inviter.id || "None",
            inline: true,
          })
          .addFields({
            name: "Inviter Username",
            value: invite.inviter.username || "None",
            inline: true,
          })
          .addFields({
            name: "Inviter Avatar",
            value:
              `[Click Here](https://cdn.discordapp.com/avatars/${invite.inviter.id}/${invite.inviter.avatar}.webp)` ||
              "None",
            inline: true,
          })
          .addFields({
            name: "Inviter Discriminator",
            value: invite.inviter.discriminator || "None",
            inline: true,
          })
          .addFields({
            name: "Inviter Public Flags",
            value: `${invite.inviter.public_flags}` || "None",
            inline: true,
          })
          .addFields({
            name: "Inviter Tag",
            value: invite.inviter.tag || "None",
            inline: true,
          });

        interaction.reply({
          embeds: [embed],
        });
      })
      .catch(async (e) => {
        console.error(e);
        interaction.reply({
          content: "Not a valid invite URL",
          ephemeral: true,
        });
      });
  },
};
