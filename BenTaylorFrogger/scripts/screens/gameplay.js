MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input, audio) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;
    let hasWon = false;
    let hasUpdatedScores = false;
    let previousScores = localStorage.getItem('highscores');
    let highscores = previousScores ? JSON.parse(previousScores) : [];

    let myKeyboard = input.Keyboard();

    let myBackground = objects.Background({
        imageSrc: 'assets/background.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
        size: { width: graphics.canvas.width, height: graphics.canvas.height }
    });

    // let frog = objects.Frog({
    //     center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 13 / 2 + graphics.canvas.height * 12 / 13 },
    //     size: { width: graphics.canvas.width / 13, height: graphics.canvas.height / 13 }
    // });

    let system = objects.System();

    // let particleSystem = ParticleSystem(graphics, renderer.Random, myLunarLander);

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        system.update(elapsedTime);
        hasWon = system.hasWon;
        // particleSystem.setCenter();
        // particleSystem.update(elapsedTime);
        // checkUpdates(elapsedTime);
        // webkitConvertPointFromPageToNode.update(elapsedTime);
    }

    function render(elapsedTime) {
        graphics.clear();
        myBackground.render();
        system.render();
        // graphics.drawTerrain();
        // graphics.drawStatistics(myLunarLander);
        // particleSystem.render();
        // cancelNextRequest = graphics.drawResults(myLunarLander, hasWon, continuePlaying, myLunarLander.score, elapsedTime);
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        processInput(elapsedTime);
        update(elapsedTime);
        render(elapsedTime);

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
        else if (hasWon && !hasUpdatedScores) {
            highscores.push(system.score);
            highscores.sort(function(a, b){return b-a});
            highscores = highscores.splice(0, 5);
            localStorage['highscores'] = JSON.stringify(highscores);
            hasUpdatedScores = true;
        }
    }

    // function thrustWithAudioParticles(elapsedTime) {
    //     if (!myLunarLander.hasCrashed && !myLunarLander.hasLanded) {
    //         if (!isThrusting && myLunarLander.fuel > 0) {
    //             isThrusting = true;
    //             audio.Thrust.play();
    //         }
    //         if (myLunarLander.fuel > 0) {
    //             particleSystem.shipThrust(elapsedTime);
    //         }
    //     }
    //     myLunarLander.thrust(elapsedTime);
    // }
    
    // function stopThrust() {
    //     if (isThrusting) {
    //         isThrusting = false;
    //         audio.Thrust.stop();
    //     }
    // }

    function setHighScores() {
        document.getElementById("first").innerHTML = "1. " + (highscores[0] ? highscores[0] : "");
        document.getElementById("second").innerHTML = "2. " + (highscores[1] ? highscores[1] : "");
        document.getElementById("third").innerHTML = "3. " + (highscores[2] ? highscores[2] : "");
        document.getElementById("fourth").innerHTML = "4. " + (highscores[3] ? highscores[3] : "");
        document.getElementById("fifth").innerHTML = "5. " + (highscores[4] ? highscores[4] : "");
    }

    function initialize() {
        setHighScores();
        system.setKeyboard();

        // let canvas = document.getElementById('id-canvas');
        // renderer.Random.generateTerrain(canvas.height, canvas.width, numSafe ? numSafe : 2);

        document.getElementById('id-game-back').addEventListener(
            'click',
            function() { 
                cancelNextRequest = true;
                hasWon = false;
                game.showScreen('main-menu'); 
            }
        );
    }

    function resetVariables() {
        // particleSystem.reset();
        hasWon = false;
        hasUpdatedScores = false;
        graphics.resetVariables();
        system.reset();
    }

    function run(numSafe) {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        resetVariables();
        initialize();
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run,
        resetVariables: resetVariables,
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.audio));
