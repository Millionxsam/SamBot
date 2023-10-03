const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "setlevel",
  description: "Set someone's level in this server",
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  options: [
    {
      name: "member",
      description: "The member whose level to set",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "level",
      description: "The level to set it to",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const user = interaction.options.getUser("member");

    let data = await client.levels.findOne({
      userId: user.id,
      guildId: interaction.guild.id,
    });

    if (!data)
      data = await client.levels.create({
        userId: user.id,
        guildId: interaction.guild.id,
      });

    await client.levels.findOneAndUpdate(
      {
        userId: user.id,
        guildId: interaction.guild.id,
      },
      {
        level: interaction.options.getInteger("level"),
      }
    );

    interaction.reply(
      `✅ You set ${
        user.displayName
      }\'s level to **${interaction.options.getInteger("level")}**`
    );
  },
};
