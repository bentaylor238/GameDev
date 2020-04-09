MyGame.screens['options'] = (function(game) {
    'use strict';
    
    function initialize() {
        console.log("OPTIONS");
        document.getElementById('id-options-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );
        document.getElementById('changeKeyInitial-rr').addEventListener(
            'click',
            function() { showChangeControls('rr'); }
        );
        document.getElementById('changeKeyInitial-rl').addEventListener(
            'click',
            function() { showChangeControls('rl'); }
        );
        document.getElementById('changeKeyInitial-t').addEventListener(
            'click',
            function() { showChangeControls('t'); }
        );
        console.log("MADE IT TO OPTIONS INIT");
    }

    function showChangeControls(id) {
        document.getElementById('changeKeyInitial-'+id).classList.remove('show');
        document.getElementById('changeKeyFinal-'+id).classList.add('show');
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
