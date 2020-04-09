MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();

    let myLogo = objects.Logo({
        imageSrc: 'assets/USU-Logo.png',
        center: { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 },
        size: { width: 100, height: 100 },
        moveRate: 500 / 1000    // pixels per millisecond
    });

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update() {
        myLogo.updateRotation(Math.PI / 150);   // Uh, oh, fixed per frame!!
    }

    function render() {
        graphics.clear();

        renderer.Logo.render(myLogo);
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update();
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        myKeyboard.register('s', myLogo.moveDown);
        myKeyboard.register('w', myLogo.moveUp);
        myKeyboard.register('a', myLogo.moveLeft);
        myKeyboard.register('d', myLogo.moveRight);
        myKeyboard.register('Escape', function() {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main menu
            game.showScreen('main-menu');
        });

        let canvas = document.getElementById('id-canvas');
    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));
