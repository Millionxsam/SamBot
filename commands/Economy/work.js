const { EmbedBuilder } = require("discord.js");
const jobs = require("../../jobs.json");

module.exports = {
  name: "work",
  description: "Work a shift to earn money",
  cooldown: 43200,
  run: async (client, interaction) => {
    let jobList = [];
    for (let i in jobs) {
      jobList.push(jobs[i]);
    }
    jobList.sort((a, b) => {
      return a.pay - b.pay;
    });

    if (!interaction.currency.job.current)
      return interaction.error(
        "You must have a job to work a shift. Do `/job apply`"
      );

    const job = jobList.find(
      (j) => j.name === interaction.currency.job.current
    );

    const requiredXp = (10 + (interaction.currency.job.level + 1) * 5) * 10;
    let promoted = false;
    let unlocked = false;
    let pay = job.pay;

    if (interaction.currency.job.level > 0)
      pay = job.levels[interaction.currency.job.level - 1] || job.levels[2];

    interaction.currency.job.xp = interaction.currency.job.xp + 15;

    // If the user is promoted -->
    if (
      interaction.currency.job.level <= job.levels.length &&
      interaction.currency.job.xp >= requiredXp
    ) {
      interaction.currency.job.level++;
      interaction.currency.job.xp = interaction.currency.job.xp - requiredXp;
      promoted = true;
    }

    // If the user unlocks a new job
    if (
      interaction.currency.job.level === 4 &&
      interaction.currency.job.unlocked < 11
    ) {
      interaction.currency.job.level++;
      interaction.currency.job.unlocked++;
      unlocked = true;
      promoted = false;
    }

    interaction.currency.quarks = interaction.currency.quarks + pay;

    await client.currency.findOneAndUpdate(
      { userId: interaction.member.id },
      { quarks: interaction.currency.quarks, job: interaction.currency.job }
    );

    const embed = new EmbedBuilder()
      .setTitle("Work Shift")
      .setAuthor({ name: `${job.emoji} ${job.name}` })
      .setColor("#00FF1F")
      .setDescription(
        `You worked a shift in your job of **${job.name}** and earned ${client.quarks} **${pay}** quarks`
      );

    await interaction.reply({ embeds: [embed] });

    if (promoted)
      await interaction.followUp(
        `**Congratulations!** You were promoted to level ${
          interaction.currency.job.level + 1
        } in your job. You now make ${client.quarks}**${
          job.levels[interaction.currency.job.level - 1] || job.levels[2]
        }** per shift`
      );
    if (unlocked)
      await interaction.followUp(
        `**Congratulations!** You unlocked the job **${
          jobList[interaction.currency.job.unlocked - 1].name
        }**. Do \`/job apply\` to get it.${
          interaction.currency.job.unlocked === 11
            ? " You have unlocked all the jobs currently available in SamBot"
            : ""
        }`
      );
  },
};
