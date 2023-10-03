const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const CharacterAI = require("node_characterai");

module.exports = {
  name: "imagine",
  description: "Use AI to generate an image based on a prompt!",
  options: [
    {
      name: "prompt",
      description: "Describe how you want the imagine to look like",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    await interaction.reply(
      `${client.emojis.cache.get(
        client.config.emotes.loading
      )} **Loading...** This may take a while`
    );

    const cai = new CharacterAI();
    const characterId = "vAiUHYsp7E1d1zvu3YD0KPTiuQXO-KCW6vMvkUSa9jg";
    const chat = await cai.createOrContinueChat(characterId);

    const image = await chat.generateImage(
      interaction.options.getString("prompt")
    );

    await interaction.editReply({
      content: `${image}`,
    });
  },
};
