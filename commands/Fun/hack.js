const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "hack",
  description: "Hack someone's Discord account",
  options: [
    {
      name: "user",
      description: "The user you want to hack",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const user = interaction.options.getUser("user");

    function wait(ms) {
      let start = new Date().getTime();
      let end = start;
      while (end < start + ms) {
        end = new Date().getTime();
      }
    }

    await interaction.reply(`\`\`\`Hacking ${user.username} now...\`\`\``);
    await wait(2700);
    await interaction.editReply("```Finding discord login...```");
    await wait(2700);
    await interaction.editReply(
      `\`\`\`Found:\nEmail: ${user.username}***@gmail.com\`\nPassword: *******\`\`\``
    );
    await wait(3700);
    await interaction.editReply("```Fetching DMs```");
    await wait(3700);
    await interaction.editReply("```Listing most common words...```");
    await wait(2700);
    await interaction.editReply(
      `\`\`\`Injecting virus into account ${user.username}\`\`\``
    );
    await wait(3700);
    await interaction.editReply("```Virus injected```");
    await wait(3700);
    await interaction.editReply("```Finding IP address```");
    await wait(5000);
    await interaction.editReply("```Spamming email...```");
    await wait(6700);
    await interaction.editReply("```Selling data...```");
    await wait(3700);
    let embed = new EmbedBuilder()
      .setDescription(
        `A dangerous and very real hacking of ${user.username} is complete`
      )
      .setImage(
        "https://media1.tenor.com/images/5ba5501d9ee356cc0c478daa57306c19/tenor.gif?itemid=20964053"
      );
    await interaction.editReply({
      embeds: [embed],
      content: "",
    });
  },
};
