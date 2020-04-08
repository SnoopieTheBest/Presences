var presence = new Presence({
    clientId: "659516842691395585"
  }),
  strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused",
    browsing: "presence.activity.browsing"
  }),
  video = {
    duration: 0,
    currentTime: 0,
    paused: true
  };

/**
 * Get Timestamps
 * @param {Number} videoTime Current video time seconds
 * @param {Number} videoDuration Video duration seconds
 */
function getTimestamps(
  videoTime: number,
  videoDuration: number
): Array<number> {
  var startTime = Date.now();
  var endTime = Math.floor(startTime / 1000) - videoTime + videoDuration;
  return [Math.floor(startTime / 1000), endTime];
}

presence.on("iFrameData", (data) => {
  video = data;
});

presence.on("UpdateData", async () => {
  var data: presenceData = {
    largeImageKey: "oa"
  };

  if (video != null && !isNaN(video.duration) && video.duration > 0) {
    var timestamps = getTimestamps(
      Math.floor(video.currentTime),
      Math.floor(video.duration)
    );

    if (document.querySelector("#content h1 > a")) {
      data.details = document.querySelector("#content h1 > a").textContent;
      data.state = document
        .querySelector("#content h1")
        .textContent.substr(
          0,
          document.querySelector("#content h1").textContent.indexOf("من")
        );
    } else {
      data.details = document.querySelector("#content h3").textContent;
    }

    data.smallImageKey = video.paused ? "pause" : "play";
    data.smallImageText = video.paused
      ? (await strings).pause
      : (await strings).play;
    data.startTimestamp = timestamps[0];
    data.endTimestamp = timestamps[1];

    if (video.paused) {
      delete data.startTimestamp;
      delete data.endTimestamp;
    }

    presence.setActivity(data, !video.paused);
  } else {
    data.details = (await strings).browsing;
    data.smallImageKey = "search";
    data.smallImageText = (await strings).browsing;

    presence.setActivity(data);
  }
});
