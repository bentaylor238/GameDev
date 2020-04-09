MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input, audio) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;
    let continuePlaying = true;
    let updatedLevel = false;
    let hasWon = false;
    let isThrusting = false;
    let isLanded = false;
    let isExploding = 2000;
    let level = 1;
    let rotateRight = null;
    let rotateLeft = null;
    let thrust = null;
    let previousScores = localStorage.getItem('highscores');
    let highscores = previousScores ? JSON.parse(previousScores) : [];

    let myKeyboard = input.Keyboard();

    let myBackground = objects.Background({
        imageSrc: 'assets/space.jpeg',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
        size: { width: 500, height: 500 }
    });

    let myLunarLander = objects.LunarLander({
        imageSrc: 'assets/lunarlander.png',
        center: {x: graphics.canvas.width / 2, y: 30, radius: 15 },
        size: { width: 30, height: 30 },
        moveRate: 0.05 / 1000 // pixels per millisecond
    });

    let particleSystem = ParticleSystem(graphics, renderer.Random, myLunarLander);

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        myLunarLander.update(elapsedTime, graphics.points);
        particleSystem.setCenter();
        particleSystem.update(elapsedTime);
        checkUpdates(elapsedTime);
    }

    function render(elapsedTime) {
        graphics.clear();
        renderer.Background.render(myBackground);
        graphics.drawTerrain();
        graphics.drawStatistics(myLunarLander);
        particleSystem.render();
        if (!myLunarLander.hasCrashed && !myLunarLander.hasLanded) {
            renderer.LunarLander.render(myLunarLander);
        }
        else {
            cancelNextRequest = graphics.drawResults(myLunarLander, hasWon, continuePlaying, myLunarLander.score, elapsedTime);
        }
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
        else if (continuePlaying) { // just beat level 1
            resetVariables();
            run(1);
        }
        else if (hasWon) {
            highscores.push(myLunarLander.score);
            highscores.sort(function(a, b){return b-a});
            highscores = highscores.splice(0, 5);
            localStorage['highscores'] = JSON.stringify(highscores);
            resetVariables();
            initialize();
        }
    }

    function checkUpdates(elapsedTime) {
        if ((myLunarLander.hasCrashed || myLunarLander.hasLanded) && !updatedLevel) {
            if (level == 2) {
                level = 1;
                continuePlaying = false;
                hasWon = myLunarLander.hasLanded;
            }
            else {
                level = myLunarLander.hasLanded ? 2 : 1;
                continuePlaying = myLunarLander.hasLanded;
            }
            updatedLevel = true;
        }
        if (myLunarLander.hasCrashed) {
            particleSystem.shipCrash(elapsedTime);
            if (isExploding === 2000) audio.Explosion.play();
            else if (isExploding < 0) audio.Explosion.stop();
            isExploding -= elapsedTime;
        }
        else if(myLunarLander.hasLanded) {
            if (!isLanded) {
                isLanded = true;
                audio.Landing.play();
            }
        }
    }

    function thrustWithAudioParticles(elapsedTime) {
        if (!myLunarLander.hasCrashed && !myLunarLander.hasLanded) {
            if (!isThrusting && myLunarLander.fuel > 0) {
                isThrusting = true;
                audio.Thrust.play();
            }
            if (myLunarLander.fuel > 0) {
                particleSystem.shipThrust(elapsedTime);
            }
        }
        myLunarLander.thrust(elapsedTime);
    }
    
    function stopThrust() {
        if (isThrusting) {
            isThrusting = false;
            audio.Thrust.stop();
        }
    }

    function setHighScores() {
        document.getElementById("first").innerHTML = "1. " + highscores[0];
        document.getElementById("second").innerHTML = "2. " + highscores[1];
        document.getElementById("third").innerHTML = "3. " + highscores[2];
        document.getElementById("fourth").innerHTML = "4. " + highscores[3];
        document.getElementById("fifth").innerHTML = "5. " + highscores[4];
    }

    function setKeyboard() {
        rotateLeft = localStorage.getItem('rotateLeft');
        rotateLeft = rotateLeft ? rotateLeft : 'ArrowLeft';
        rotateRight = localStorage.getItem('rotateRight');
        rotateRight = rotateRight ? rotateRight : 'ArrowRight';
        thrust = localStorage.getItem('thrust');
        thrust = thrust ? thrust : 'ArrowUp';

        myKeyboard.register(thrust, 'thrust', thrustWithAudioParticles);
        myKeyboard.register(rotateLeft, 'rotateLeft', myLunarLander.rotateLeft);
        myKeyboard.register(rotateRight, 'rotateRight', myLunarLander.rotateRight);
        myKeyboard.registerKeyUp(thrust, 'stopThrustAudio', stopThrust);

        document.getElementById('rotateRight-button').addEventListener(
            'click', 
            function() {
                let previousKey = localStorage.getItem('rotateRight');
                let key = document.getElementById("rotateRight-input").value;
                myKeyboard.unregister(previousKey, 'rotateRight');
                myKeyboard.register(key, 'rotateRight', myLunarLander.rotateRight);
                document.getElementById("rotateRight").innerHTML = "Rotate Right: " + key;
                document.getElementById('changeKeyFinal-rr').classList.remove('show');
                document.getElementById('changeKeyInitial-rr').classList.add('show');
            }
        );
        document.getElementById("rotateLeft-button").addEventListener(
            'click',
            function() {
                let previousKey = localStorage.getItem('rotateLeft');
                let key = document.getElementById("rotateLeft-input").value;
                myKeyboard.unregister(previousKey, 'rotateLeft');
                myKeyboard.register(key, 'rotateLeft', myLunarLander.rotateLeft);
                document.getElementById('rotateLeft').innerHTML = "Rotate Left: " + key;
                document.getElementById('changeKeyFinal-rl').classList.remove('show');
                document.getElementById('changeKeyInitial-rl').classList.add('show');
            }
        );
        document.getElementById("thrust-button").addEventListener(
            'click',
            function() {
                let previousKey = localStorage.getItem('thrust');
                let key = document.getElementById("thrust-input").value;
                myKeyboard.unregister(previousKey, 'thrust');
                myKeyboard.unregister(previousKey, 'stopThrustAudio');
                myKeyboard.register(key, 'thrust', thrustWithAudioParticles);
                document.getElementById("thrust").innerHTML = "Thrust: " + key;
                document.getElementById('changeKeyFinal-t').classList.remove('show');
                document.getElementById('changeKeyInitial-t').classList.add('show');
            }
        );
        document.getElementById("thrust").innerHTML = "Thrust: " + thrust;
        document.getElementById("rotateRight").innerHTML = "Rotate Right: " + rotateRight;
        document.getElementById("rotateLeft").innerHTML = "Rotate Left: " + rotateLeft;
    }



    function initialize(numSafe) {
        setHighScores();
        setKeyboard();

        let canvas = document.getElementById('id-canvas');
        renderer.Random.generateTerrain(canvas.height, canvas.width, numSafe ? numSafe : 2);

        document.getElementById('id-game-back').addEventListener(
            'click',
            function() { 
                cancelNextRequest = true;
                continuePlaying = false;
                hasWon = false;
                level = 1;
                game.showScreen('main-menu'); 
            }
        );
    }

    function resetVariables() {
        particleSystem.reset();
        myLunarLander.resetVariables({x: graphics.canvas.width / 2, y: 30, radius: 15 }, continuePlaying);
        continuePlaying = true;
        updatedLevel = false;
        hasWon = false;
        isLanded = false;
        isThrusting = false;
        isExploding = 2000;
        graphics.resetVariables();
    }

    function run(numSafe) {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        resetVariables();
        initialize(numSafe);
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run,
        resetVariables: resetVariables,
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.audio));
