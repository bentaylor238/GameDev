MyGame.audio.Thrust = (function(path) {
    'use strict';

    let audioReady = false;
    let audio = new Audio(path);

    function resetVariables() {

    }

    function stop() {
        // console.log("STOPPING THRUST AUDIO");
        audio.pause();
        audio.load();
    }

    function play() {
        // console.log("PLAYING THRUST");
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
}('./audio/rocketthrust.mp3'));
