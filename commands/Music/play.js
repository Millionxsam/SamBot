const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "play",
  description: "Add a song to the queue",
  botPerms: ["Connect", "Speak"],
  options: [
    {
      name: "song",
      description: "The name or url of the song you want to play",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "position",
      description:
        "Where should the song be placed in the queue (leave blank to add at the end)",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        {
          name: "Replace the current song with this song",
          value: "replace",
        },
        {
          name: "Play this song after the current song",
          value: "top",
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    const song = interaction.options.getString("song");
    const positionValue = interaction.options.getString("position");
    const position = positionValue ? 1 : 0;
    const { member, channel: textChannel } = interaction;
    const queue = client.distube.getQueue(interaction);

    interaction.reply({
      content: `${client.emojis.cache.get(
        client.config.emotes.plus
      )} Adding **${song}** to queue...`,
      ephemeral: true,
    });

    client.distube.play(member.voice.channel, song, {
      member,
      textChannel,
      interaction,
      position,
    });

    if (positionValue === "replace") await queue.skip();
  },
};
