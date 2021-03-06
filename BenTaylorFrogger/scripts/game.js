// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------

MyGame.game = (function(screens) {
    'use strict';
    
    //------------------------------------------------------------------
    //
    // This function is used to change to a new active screen.
    //
    //------------------------------------------------------------------
    function showScreen(id) {
        // console.log(id);
        MyGame.audio.Background.stop();
        //
        // Remove the active state from all screens.  There should only be one...
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }
        //
        // Tell the screen to start actively running
        if (id === 'game-play') MyGame.audio.Background.play();
        screens[id].run();
        //
        // Then, set the new screen to be active
        document.getElementById(id).classList.add('active');

    }

    //------------------------------------------------------------------
    //
    // This function performs the one-time game initialization.
    //
    //------------------------------------------------------------------
	function initialize() {
        // console.log("GAME");

		let screen = null;
		//
		// Go through each of the screens and tell them to initialize
		for (screen in screens) {
			if (screens.hasOwnProperty(screen)) {
				screens[screen].initialize();
			}
		}
		
		//
		// Make the main-menu screen the active one
        showScreen('main-menu');
        // console.log("MADE IT TO GAME INIT");
	}
    
    return {
        initialize : initialize,
        showScreen : showScreen
    };
}(MyGame.screens));
