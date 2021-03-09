/* global AFRAME */

AFRAME.registerComponent("remote-media-player", {
  schema: {
    media: {
      type: "selector"
    }
  },
  init: function() {
    let media = this.data.media;
    this.el.addEventListener("click", function() {
      media.paused ? media.play() : media.pause();
    });
  }
});