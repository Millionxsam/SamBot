const {
  EmbedBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

const { distubeFilters: filters } = require("./index.js");

module.exports = (client) => {
  // Get the queue information
  client.distube.queueInfoEmbed = (queue, disabled) => {
    disabled = disabled || false;

    const prevBtn = new ButtonBuilder()
      .setCustomId("m-previous")
      .setLabel("Previous")
      .setEmoji("⏮️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);
    const rewindBtn = new ButtonBuilder()
      .setCustomId("m-rewind")
      .setLabel("Rewind 10s")
      .setEmoji("⏪")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);
    const playPauseBtn = new ButtonBuilder()
      .setCustomId("m-pause")
      .setLabel(queue.paused ? "Play" : "Pause")
      .setEmoji(queue.paused ? "▶️" : "⏸️")
      .setStyle(queue.paused ? ButtonStyle.Success : ButtonStyle.Primary)
      .setDisabled(disabled);
    const forwardBtn = new ButtonBuilder()
      .setCustomId("m-forward")
      .setLabel("Forward 10s")
      .setEmoji("⏩")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);
    const nextBtn = new ButtonBuilder()
      .setCustomId("m-skip")
      .setLabel("Next")
      .setEmoji("⏭️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);

    const volumeUpBtn = new ButtonBuilder()
      .setCustomId("m-volumeu")
      .setLabel("Volume +10%")
      .setEmoji("🔊")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);
    const volumeDwnBtn = new ButtonBuilder()
      .setCustomId("m-volumed")
      .setLabel("Volume -10%")
      .setEmoji("🔉")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);
    const replayBtn = new ButtonBuilder()
      .setCustomId("m-replay")
      .setLabel("Replay Song")
      .setEmoji("↩️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);
    const repeatBtn = new ButtonBuilder()
      .setCustomId("m-repeat")
      .setLabel(
        `Repeat ${
          queue.repeatMode ? (queue.repeatMode === 1 ? "Song" : "Queue") : "Off"
        }`
      )
      .setEmoji("🔁")
      .setStyle(
        queue.repeatMode === 0 ? ButtonStyle.Secondary : ButtonStyle.Success
      )
      .setDisabled(disabled);

    const autoplayBtn = new ButtonBuilder()
      .setCustomId("m-autoplay")
      .setLabel(`Autoplay ${queue.autoplay ? "Enabled" : "Disabled"}`)
      .setEmoji("🔃")
      .setStyle(queue.autoplay ? ButtonStyle.Success : ButtonStyle.Secondary)
      .setDisabled(disabled);
    const shuffleBtn = new ButtonBuilder()
      .setCustomId("m-shuffle")
      .setLabel("Shuffle Queue")
      .setEmoji("🔀")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);
    const nowplayingBtn = new ButtonBuilder()
      .setCustomId("m-nowplaying")
      .setLabel("Song Info")
      .setEmoji("📃")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled);
    const stopBtn = new ButtonBuilder()
      .setCustomId("m-stop")
      .setLabel("Stop")
      .setEmoji("⏹️")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled);

    const filtersMenu = new StringSelectMenuBuilder()
      .setCustomId("m-filters")
      .setMinValues(0)
      .setMaxValues(10)
      .setPlaceholder("Filters")
      .setDisabled(disabled)
      .addOptions(
        filters
          .filter((f) => f !== "Clear all")
          .map((f) => {
            return {
              label: f,
              value: f,
              default: queue.filters.has(f),
            };
          })
      );

    const row1 = new ActionRowBuilder().addComponents(
      prevBtn,
      rewindBtn,
      playPauseBtn,
      forwardBtn,
      nextBtn
    );
    const row2 = new ActionRowBuilder().addComponents(
      volumeUpBtn,
      volumeDwnBtn,
      replayBtn,
      repeatBtn
    );
    const row3 = new ActionRowBuilder().addComponents(
      autoplayBtn,
      shuffleBtn,
      nowplayingBtn,
      stopBtn
    );
    const row4 = new ActionRowBuilder().addComponents(filtersMenu);

    const queueEmbed = new EmbedBuilder()
      .setTitle("Queue")
      .setColor("#B600FF")
      .setImage(queue.songs[0].thumbnail)
      .setDescription(
        `${queue.voiceChannel} | **Volume**: ${queue.volume}% | **Filters**: ${
          queue.filters.names.join(", ") || "None"
        } | **Loop**: ${
          queue.repeatMode
            ? queue.repeatMode === 2
              ? "All queue"
              : "This song"
            : "Off"
        } | **Autoplay**: ${queue.autoplay ? "On" : "Off"}${
          queue.paused ? " | **PAUSED**" : ""
        }`
      );

    queue.songs.forEach((song) => {
      queueEmbed.addFields({
        name: `> ${queue.songs.indexOf(song) + 1} | ${
          queue.songs.indexOf(song) === 0
            ? "NOW PLAYING"
            : queue.songs.indexOf(song) === 1
            ? "NEXT SONG"
            : ""
        } | ${song.name}`,
        value: `**Duration**: ${song.duration} seconds • **Likes**: ${
          song.likes || "N/A"
        } • **Views**: ${song.views} • Added by **${song.member}**\n⠀`,
      });
    });

    return {
      embeds: [queueEmbed],
      components: [row1, row2, row3, row4],
    };
  };

  // Get song information
  client.distube.songInfoEmbed = (song) => {
    const songEmbed = new EmbedBuilder()
      .setTitle(song.name)
      .setURL(song.url)
      .setColor("#B600FF")
      .setImage(song.thumbnail)
      .setDescription(`Added by ${song.member}`)
      .setAuthor({ name: song.uploader.name, url: song.uploader.url })
      .setFooter({ text: "Do /queue to view the queue" })
      .addFields(
        {
          name: "Duration",
          value: song.duration.toString() + " seconds",
        },
        {
          name: "Views",
          value: song.views.toString(),
        },
        {
          name: "Likes",
          value: `${song.likes || "N/A"}`,
        },
        {
          name: "Related Songs",
          value: `${
            song.related.length
              ? song.related
                  .slice(0, 5)
                  .map((s) => `${s.uploader.name} - **${s.name}**`)
                  .join("\n")
              : "N/A"
          }`,
        }
      );

    return songEmbed;
  };

  // Get playlist information
  client.distube.playlistInfoEmbed = (list) => {
    const songEmbed = new EmbedBuilder()
      .setTitle(list.name)
      .setURL(list.url)
      .setColor("#B600FF")
      .setImage(list.thumbnail)
      .setDescription(`Added by ${list.member}`)
      .addFields(
        {
          name: "Total playlist duration",
          value: list.duration.toString(),
        },
        {
          name: "Songs",
          value: `${
            list.songs
              ? list.songs
                  .slice(0, 10)
                  .map((s) => `${s.uploader.name} - **${s.name}**`)
                  .join("\n\n") +
                (list.songs.length - 10 > 0
                  ? `\n...${list.songs.length - 10} more songs`
                  : "")
              : "None"
          }`,
        }
      );

    return songEmbed;
  };
};
