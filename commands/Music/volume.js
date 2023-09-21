const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  description: "Set the volume for the music (default is 50%)",
  options: [
    {
      name: "set",
      description: "The percent of volume you want it to be",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 0,
      maxValue: 100,
    },
  ],
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction);
    if (!queue) return interaction.error(`There is no music playing`);

    const prevVolume = queue.volume;

    if (interaction.isButton()) {
      let v;
      if (interaction.upordown === "up") {
        v = queue.volume + 10;
        if (v > 100) v = 100;

        queue.setVolume(v);
        await interaction.update(client.distube.queueInfoEmbed(queue));
        return await interaction.followUp(
          `${(v = 0
            ? "🔇 **Muted**"
            : `🔼 Volume increased from ${prevVolume}% to **${v}%**`)}`
        );
      } else if (interaction.upordown === "down") {
        v = queue.volume - 10;
        if (v < 0) v = 0;

        queue.setVolume(v);
        await interaction.update(client.distube.queueInfoEmbed(queue));
        return await interaction.followUp(
          `${(v = 0
            ? "🔇 **Muted**"
            : `🔽 Volume decreased from ${prevVolume}% to **${v}%**`)}`
        );
      }
    }

    const volume = interaction.options.getInteger("set");

    if (prevVolume === volume)
      return interaction.error(`The volume is already ${volume}%`);

    queue.setVolume(volume);
    await interaction.reply(
      `${
        volume === 0
          ? "🔇 **Muted**"
          : volume > prevVolume
          ? `🔼 Volume increased from ${prevVolume}% to **${volume}%**`
          : `🔽 Volume decreased from ${prevVolume}% to **${volume}%**`
      }`
    );
  },
};
