const Genius = require("genius-lyrics");
const finder = new Genius.Client();
const yts = require("yt-search");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../config.json");
const { format } = new Intl.NumberFormat();

module.exports = {
  name: "lyrics",
  description: "Get lyrics and other info of any song",
  options: [
    {
      name: "title",
      description: "The exact title of the song you want to search for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    await interaction.reply(
      `**${client.emojis.cache.get(
        client.config.emotes.loading
      )} Searching for lyrics...**`
    );

    const searches = await finder.songs.search(
      interaction.options.getString("title")
    );
    const result = searches[0];
    const lyrics = await result.lyrics();

    if (!lyrics) {
      return interaction.editReply(
        `:x: No Lyrics found for **${interaction.options.getString(
          "title"
        )}**. Are you sure that's the exact song name?`
      );
    }

    const ytresults = await yts(result.fullTitle);
    const video = ytresults.videos[0];

    const embed = new EmbedBuilder()
      .setColor(config.main_color)
      .setDescription(
        lyrics.length >= 4093 ? lyric.substring(0, 4093) + "..." : lyrics
      )
      .setTitle(result.title)
      .setURL(video.url)
      .setAuthor({
        name: result.artist.name,
        iconURL: result.artist.image,
        url: video.author.url,
      })
      .setFooter({
        text: `${format(video.views)} views • ${video.ago} `,
      })
      .setImage(result.image);

    interaction.editReply({
      embeds: [embed],
      content: "",
    });
  },
};
