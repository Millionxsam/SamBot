const {
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");

module.exports = {
  name: "screenshot",
  description: "Get a screenshot of any website",
  options: [
    {
      name: "url",
      description: "The url of the website to take a screenshot of",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let site = interaction.options.getString("url");
    if (!site.startsWith("http")) site = "https://" + site;
    site.replace("www.", "");

    await interaction.reply(
      `**Searching ${site}**\n\n*Please wait...* This may take some time.`
    );

    try {
      const { body } = await fetch(
        `https://image.thum.io/get/width/1920/crop/675/noanimate/${site}`
      );
      let att = new AttachmentBuilder()
        .setFile(body)
        .setName("web-screenshot.png");

      return interaction.editReply({
        files: [att],
        content: null,
      });
    } catch (e) {
      return interaction.error(
        `An error occurred. Please make sure you typed the url correctly. (You said ${site})`
      );
    }
  },
};
