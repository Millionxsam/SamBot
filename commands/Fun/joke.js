const superagent = require("superagent");
const { EmbedBuilder } = require("discord.js");
const { main_color: color } = require("../../config.json");

module.exports = {
  name: "joke",
  description: "Get a random joke",
  run: async (client, interaction) => {
    await superagent
      .get("http://icanhazdadjoke.com/")
      .set("Accept", "application/json")
      .end((err, response) => {
        let embed = new EmbedBuilder()
          .setTitle("Joke")
          .setDescription(response.body.joke)
          .setColor(color);
        interaction.reply({
          embeds: [embed],
        });
      });
  },
};
