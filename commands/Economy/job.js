const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "job",
  description: "Get a job, work to earn money, get promoted, and more!",
  options: [
    {
      name: "apply",
      description: "Apply for a job",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "quit",
      description: "Quit your job",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (client, interaction) => {
    const jobs = require("../../jobs.json");

    let jobList = [];
    for (let i in jobs) {
      jobList.push(jobs[i]);
    }

    jobList.sort((a, b) => {
      return a.pay - b.pay;
    });

    jobList.forEach((j, index) => {
      if (index > interaction.currency.job.unlocked - 1) {
        jobList[index].locked = true;
      } else {
        jobList[index].locked = false;
      }
    });

    if (interaction.options.getSubcommand() === "apply") {
      if (
        interaction.currency.job.fired &&
        Date.now() - interaction.currency.job.fired < 86400000
      )
        return interaction.error(
          `You can't apply for a job right now because you were fired in the last 24 hours. You were fired <t:${Math.round(
            interaction.currency.job.fired / 1000
          )}:R>. You can apply for a job <t:${Math.round(
            (interaction.currency.job.fired + 86400000) / 1000
          )}:R>`
        );

      const embed = new EmbedBuilder()
        .setTitle("Apply for a job")
        .setColor(client.config.main_color)
        .setDescription(
          `Use the menu below to select a job to apply for\n\n${jobList
            .map(
              (j) =>
                `${j.locked ? "🔒" : j.emoji} **${j.name} ${
                  j.locked ? "- LOCKED" : ""
                }** - ${client.quarks}${j.pay} per shift`
            )
            .join("\n\n")}`
        );

      const menu = new StringSelectMenuBuilder()
        .setCustomId("job-apply")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Select a job to apply for");

      jobList.forEach((j) => {
        menu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setEmoji(j.locked ? "🔒" : j.emoji)
            .setLabel(j.name)
            .setValue(j.name)
        );
      });

      const row = new ActionRowBuilder().addComponents(menu);

      interaction.reply({ embeds: [embed], components: [row] });
    } else if (interaction.options.getSubcommand() === "quit") {
      if (!interaction.currency.job.current)
        return interaction.error(
          "You don't have any job to quit! Do `/job apply` to get one"
        );

      const job = jobList.find(
        (j) => j.name === interaction.currency.job.current
      );

      interaction.currency.job.current = null;

      await client.currency.findOneAndUpdate(
        { userId: interaction.member.id },
        { job: interaction.currency.job }
      );

      const embed = new EmbedBuilder()
        .setTitle("Quit Job")
        .setAuthor({ name: `${job.emoji} ${job.name}` })
        .setColor("#FF0000")
        .setDescription(`You successfully quit your job of **${job.name}**`);

      interaction.reply({ embeds: [embed] });
    }
  },
};
