MyGame.screens['high-scores'] = (function(game) {
    'use strict';
    
    function initialize() {
        console.log("HIGHSCORES");
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );
        console.log("MADE IT TO HIGHSCORES INIT");
    }
    
    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }
    
    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
