const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../../config.json");
const { readdirSync } = require("fs");
const categories = readdirSync("./commands/");

module.exports = {
  name: "help",
  description: "View all SamBot commands, useful links, and other information",
  run: async (client, interaction) => {
    const help = new EmbedBuilder()
      .setTitle("SamBot Help Menu")
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(config.main_color)
      .setDescription(
        "Click the menu and select which category of commands you want to see"
      );

    const server = new ButtonBuilder()
      .setLabel("Join our Server")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/4R5z5muPqN");

    const invite = new ButtonBuilder()
      .setLabel("Add to Server")
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=857623243909103636&permissions=8&scope=bot%20applications.commands"
      );

    const menu = new StringSelectMenuBuilder()
      .setCustomId("help")
      .setPlaceholder("SamBot Help Menu");

    categories.forEach((category) => {
      menu.addOptions({
        label: `${
          config.command_categories.find((c) => c.name === category).emoji
        } ${category} Commands`,
        description: config.command_categories.find((c) => c.name === category)
          .description,
        value: category,
      });
    });

    const row1 = new ActionRowBuilder().addComponents(menu);
    const row2 = new ActionRowBuilder().addComponents(server, invite);
    await interaction.reply({ embeds: [help], components: [row1, row2] });
  },
};
