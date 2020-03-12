MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;
    let continuePlaying = true;
    let updatedLevel = false;
    let hasWon = false;
    // let score = 0;//fuel / speed;
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

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        myLunarLander.update(elapsedTime, graphics.points);
        if ((myLunarLander.hasCrashed || myLunarLander.hasLanded) && !updatedLevel) {
            if (level == 2) {
                level = 1;
                continuePlaying = false;
                hasWon = myLunarLander.hasLanded;
                console.log("DONT CONTINUE PLAYING");
            }
            else {
                level = myLunarLander.hasLanded ? 2 : 1;
                continuePlaying = myLunarLander.hasLanded;
            }
            updatedLevel = true;
            // score += myLunarLander.fuel / myLunarLander.momentum;
        }
    }

    function render(elapsedTime) {
        graphics.clear();
        renderer.Background.render(myBackground);
        graphics.drawTerrain();
        graphics.drawStatistics(myLunarLander);
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
            console.log("GOING TO LEVEL 2");
            resetVariables();
            initialize(1);
            run();
        }
        else if (hasWon) {
            highscores.push(myLunarLander.score);
            highscores.sort(function(a, b){return b-a});
            highscores = highscores.splice(0, 5);
            localStorage['highscores'] = JSON.stringify(highscores);
            setHighScores();
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
        rotateRight = localStorage.getItem('rotateRight');
        thrust = localStorage.getItem('thrust');
        console.log(rotateLeft + rotateRight + thrust);
        myKeyboard.register(thrust ? thrust : 'ArrowUp', 'thrust', myLunarLander.thrust);
        myKeyboard.register(rotateLeft ? rotateLeft : 'ArrowLeft', 'rotateLeft', myLunarLander.rotateLeft);
        myKeyboard.register(rotateRight ? rotateRight : 'ArrowRight', 'rotateRight', myLunarLander.rotateRight);
        myKeyboard.register('Escape', function() {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main menu
            game.showScreen('main-menu');
        });
        document.getElementById('rotateRight-button').addEventListener(
            'click', 
            function() {
                let previousKey = localStorage.getItem('rotateRight');
                let key = document.getElementById("rotateRight-input").value;
                myKeyboard.unregister(previousKey, 'rotateRight');
                myKeyboard.register(key, 'rotateRight', myLunarLander.rotateRight);
                document.getElementById("rotateRight").innerHTML = "Rotate Right: " + key;
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
            }
        );
        document.getElementById("thrust-button").addEventListener(
            'click',
            function() {
                let previousKey = localStorage.getItem('thrust');
                let key = document.getElementById("thrust-input").value;
                myKeyboard.unregister(previousKey, 'thrust');
                myKeyboard.register(key, 'thrust', myLunarLander.thrust);
                document.getElementById("thrust").innerHTML = "Thrust: " + key;
            }
        );
        document.getElementById("thrust").innerHTML = "Thrust: " + thrust;
        document.getElementById("rotateRight").innerHTML = "Rotate Right: " + rotateRight;
        document.getElementById("rotateLeft").innerHTML = "Rotate Left: " + rotateLeft;
    }



    function initialize(numSafe) {
        console.log("GAMEPLAY");
        setHighScores();
        setKeyboard();
        // console.log(document.getElementById('rotateRight-button').onclick);

        let canvas = document.getElementById('id-canvas');
        renderer.Random.generateTerrain(canvas.height, canvas.width, numSafe ? numSafe : 2);

        document.getElementById('id-game-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );
        // console.log("MADE IT TO GAMEPLAY INIT");
    }

    function resetVariables() {
        // level = 1;
        myLunarLander.resetVariables({x: graphics.canvas.width / 2, y: 30, radius: 15 }, continuePlaying);
        continuePlaying = true;
        updatedLevel = false;
        graphics.resetVariables();
    }

    function run() {
        console.log("RUNNING");
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        if (myLunarLander.hasCrashed) {
            resetVariables();
            initialize();
        }
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run,
        resetVariables: resetVariables,
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));
