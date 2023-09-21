const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip to the next song in queue",
  options: [
    {
      name: "count",
      description:
        "1 to skip the current song, 2 to skip 2 songs, -2 to go back 2 songs, etc. (leave blank to skip 1)",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    const count = interaction.options
      ? interaction.options.getInteger("count")
      : null;
    const prevSong = queue.songs[0];

    if (!count) {
      // Skip to the next song
      if (queue.songs.length < 2 && !queue.autoplay)
        return interaction.error(
          "There are no songs left in the queue. To stop, do /stop"
        );

      await queue.skip();
      if (interaction.isButton()) {
        await interaction.update(client.distube.queueInfoEmbed(queue));
        await interaction.followUp(`⏭️ Skipped **${prevSong.name}**`);
        return;
      }
      interaction.reply(`⏭️ Skipped **${prevSong.name}**`);
    } else if (count) {
      if (count === 0) return interaction.error("You can't skip 0 songs!");

      if (count > 0) {
        if (queue.songs.length < count + 1 && !queue.autoplay)
          return interaction.error("You can't go forward that far");

        await queue.jump(count);
        interaction.reply(`⏭️ Skipped **${count}** songs`);
      } else if (count < 0) {
        console.log(queue.previousSongs.length, Math.abs(count));
        if (queue.previousSongs.length < Math.abs(count))
          return interaction.error("You can't go backward that far");

        await queue.jump(count);
        interaction.reply(`⏮️ Went backward **${count}** songs`);
      }
    }
  },
};
