MyGame.audio.Background = (function(path) {
  'use strict';

  let audioReady = false;
  let audio = new Audio(path);
  audio.loop = true;

  function stop () {
      audio.pause();
      audio.load();
  }

  function play() {
      audio.play();
  }

  audio.onload = function() {
      audioReady = true;
  };

  let api = {
      audio: audio,
      play: play,
      stop: stop,
      get audioReady() { return audioReady; },
  };

  return api;
}('../audio/background.mp3'));
