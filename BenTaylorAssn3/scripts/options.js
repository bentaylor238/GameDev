MyGame.screens['options'] = (function(game) {
    'use strict';
    
    function initialize() {
        console.log("OPTIONS");
        document.getElementById('id-options-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );
        console.log("MADE IT TO OPTIONS INIT");
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
