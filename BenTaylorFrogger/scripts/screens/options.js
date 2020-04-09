MyGame.screens['options'] = (function(game) {
    'use strict';
    
    function initialize() {
        console.log("OPTIONS");
        document.getElementById('id-options-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); }
        );
        document.getElementById('changeKeyInitial-mr').addEventListener(
            'click',
            function() { showChangeControls('mr'); }
        );
        document.getElementById('changeKeyInitial-ml').addEventListener(
            'click',
            function() { showChangeControls('ml'); }
        );
        document.getElementById('changeKeyInitial-mu').addEventListener(
            'click',
            function() { showChangeControls('mu'); }
        );
        document.getElementById('changeKeyInitial-md').addEventListener(
            'click',
            function() { showChangeControls('md'); }
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
