// --------------------------------------------------------------
//
// Creates a Logo object, with functions for managing state.
//
// spec = {
//    imageSrc: ,   // Web server location of the image
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
MyGame.objects.System = function() {
  'use strict';
  let right = null;
  let left = null;
  let up = null;
  let down = null;
  let canvas = MyGame.graphics.canvas;
  let frogVert = 0;
  let hasDied = false;
  let hasLost = false;
  let hasWon = false;
  let hasUpdatedWinning = false;
  let timer = 30000;
  let particleTimer = 500;
  // let reachedGoal = false;
  let score = 0;

  let myKeyboard = MyGame.input.Keyboard();

  let frog = MyGame.objects.Frog({
    center: { x: canvas.width / 2, y: canvas.height / 13 / 2 + canvas.height * 12 / 13 },
    size: { width: canvas.width / 13, height: canvas.height / 13 }
  });

  let lives = MyGame.objects.Lives({
    center: { x: canvas.width / 13 / 2, y: canvas.height / 13 / 2 * 24 },
    size: { width: canvas.width / 13 - 10, height: canvas.height / 13  },
    lives: frog.lives
  });

  let lillipads = [];
  let lillipadGoals = [];
  for (let i = 0; i < 5; i++) {
    lillipads.push(MyGame.objects.Lillipad({
      imageSrc: 'assets/lillipad.png',
      center: { x: MyGame.graphics.canvas.width / 5 * i + 50, y: MyGame.graphics.canvas.height / 13 / 2 },
      size: { width: MyGame.graphics.canvas.width / 13, height: MyGame.graphics.canvas.height / 13 }
    }));
    lillipadGoals.push({ 
      left: canvas.width / 5 * i + 50 - canvas.width / 13 / 2, 
      right: canvas.width / 5 * i + 50 + canvas.width / 13 / 2,
      hasReached: false 
    });
  }
  ///
  //1. Fix scoring to give points for every 1/2 secon

  ///
  //3. Add bugs

  ///
  //4. Add alligators

  ///

  let gutsPS = MyGame.objects.ParticleSystemGuts({
    center: frog.center,
    rotation: frog.rotation,
    size: {mean: 5, stdev: 2},
    speed: {mean: 0.05, stdev: 0.02},
    lifetime: {mean: 350, stdev: 50}
  });

  let vehicles = MyGame.objects.Vehicles();
  let river = MyGame.objects.River();
  lives.resetVariables();


  function reset() {
    frog.reset({ x: canvas.width / 2, y: canvas.height / 13 / 2 + canvas.height * 12 / 13 });
    lives.resetVariables();
    river.reset();
    vehicles.reset();
    gutsPS.reset();
    let node = null;
    for (node in lillipads) {
      lillipads[node].reset();
      lillipadGoals[node].hasReached = false;
    }
    hasWon = false;
    hasUpdatedWinning = false;
    hasLost = false;
    hasDied = false;
    score = 0;
    frogVert = 0;
    timer = 30000;
    particleTimer = 500;
    // setKeyboard();
  }

  function update(elapsedTime) {
    let pad = null;
    for (pad in lillipads) {
      lillipads[pad].update(elapsedTime);
    }
    if (!hasWon && !hasLost) {
      timer -= elapsedTime;
      if (timer < 5000 && timer > 0) MyGame.audio.LowTime.play();
      else MyGame.audio.LowTime.stop();
      frog.update(elapsedTime);
      if (hasDied && particleTimer > 0) {
        particleTimer -= elapsedTime;
        gutsPS.updateAndCreate(elapsedTime);
      } else {
        hasDied = false;
        particleTimer = 500;
        gutsPS.reset();
      }
      let frogDied = vehicles.update(elapsedTime, frogVert, frog.center.x, frog.size.width);
      let frogAdjust = river.update(elapsedTime, frogVert, frog.center.x);
      if (timer < 0) {
        killFrog();
      }
      else if (frogVert >= 7 && frogVert < 12 && !frog.moving && !hasDied) {
        // console.log(frogAdjust);
        if (frogAdjust === -1) {
          // RESET and frog loses a life
          killFrog();
          MyGame.audio.Sinking.play();
        }
        else frog.moveHorizontal(frogAdjust);

        if (frog.center.x - frog.size.width / 2 < 0 || frog.center.x + frog.size.width / 2 > canvas.width) killFrog();
      } else if (frogVert < 6 && frogVert >= 1 && !frog.moving && !hasDied) {
        if (frogDied) {
          console.log("FROG HIT A CAR ", frogDied);
          gutsPS.setCenter(frog.center.x, frog.center.y, 1, frogVert % 2 === 1 ? Math.PI * 3/2 : Math.PI/2);
          killFrog();
          MyGame.audio.Squish.play();
          hasDied = true;
        }
      } else if (frogVert === 12 && !frog.moving && !hasDied) {
        let lilli = frog.checkLillipads(lillipadGoals);
        if (lilli === -1 || lillipadGoals[lilli].hasReached) {
          MyGame.audio.Sinking.play();
          killFrog();
        }
        else {
          MyGame.audio.ReachedGoal.play();
          score += (Math.floor(timer / 500) * 10);
          timer = 30000;
          score += 50;
          lillipads[lilli].updateHasReached(true);
          lillipadGoals[lilli].hasReached = true;
          frogVert = 0;
          frog.resetPosition({ x: canvas.width / 2, y: canvas.height / 13 / 2 + canvas.height * 12 / 13 });
          hasWon = true;
          let i = null;
          for (i in lillipadGoals) {
            if (!lillipadGoals[i].hasReached) hasWon = false;
          }
          if (hasWon && !hasUpdatedWinning) {
            score += 1000;
            score += (frog.lives * 20000);
            hasUpdatedWinning = true;
          }
        }
      } 
      lives.update(frog.lives);
    } else if (hasWon || hasLost) {
      MyGame.audio.Background.stop();
    }
    return hasWon;
  }

  function killFrog() {
    frogVert = 0;
    frog.resetPosition({ x: canvas.width / 2, y: canvas.height / 13 / 2 + canvas.height * 12 / 13 });
    frog.takeLife();
    timer = 30000;
    if (frog.lives === 0) hasLost = true;
  }
  
  function render() {
    for (let i = 0; i < 5; i++) {
      lillipads[i].render();
    }
    river.render();
    vehicles.render();
    lives.render();
    MyGame.graphics.drawTimeAndScore(timer, score);
    frog.render();
    if (hasDied) gutsPS.render();
    if (hasLost || hasWon) {
      MyGame.graphics.drawResults(hasWon, score);
    }
  }

  function moveUp() {
    if (!hasDied) {
      let temp = frog.moveUp(lillipadGoals)
      if (temp === 1) score += 10;
      frogVert += temp;
    }
  }

  function moveDown() {
    if (!hasDied) frogVert -= frog.moveDown();
    // console.log("FROGVERT ", frogVert);
  }

  function moveLeft() {
    if (!hasDied) frog.moveLeft();
  }

  function moveRight() {
    if (!hasDied) frog.moveRight();
  }
  // console.log("MADE IT TO SYSTEM");

  function setKeyboard() {
    left = localStorage.getItem('moveLeft');
    left = left ? left : 'ArrowLeft';
    right = localStorage.getItem('moveRight');
    right = right ? right : 'ArrowRight';
    up = localStorage.getItem('moveUp');
    up = up ? up : 'ArrowUp';
    down = localStorage.getItem('moveDown');
    down = down ? down : 'ArrowDown';

    // console.log("REGISTERING KEYBOARD INPUT");
    // console.log(frog.moveDown);
    // console.log(myKeyboard.keyDownHandlers);
    myKeyboard.registerKeyUp(up, 'moveUp', moveUp);
    myKeyboard.registerKeyUp(left, 'moveLeft', moveLeft);
    myKeyboard.registerKeyUp(right, 'moveRight', moveRight);
    myKeyboard.registerKeyUp(down, 'moveDown', moveDown);
    // console.log(myKeyboard.keyDownHandlers);
    // myKeyboard.registerKeyUp(moveUp, 'stopThrustAudio', stopThrust);

    document.getElementById('moveRight-button').addEventListener(
        'click', 
        function() {
            let previousKey = localStorage.getItem('moveRight');
            let key = document.getElementById("moveRight-input").value;
            myKeyboard.unregister(previousKey, 'moveRight');
            myKeyboard.registerKeyUp(key, 'moveRight', moveRight);
            document.getElementById("moveRight").innerHTML = "Move Right: " + key;
            document.getElementById('changeKeyFinal-mr').classList.remove('show');
            document.getElementById('changeKeyInitial-mr').classList.add('show');
        }
    );
    document.getElementById("moveLeft-button").addEventListener(
        'click',
        function() {
            let previousKey = localStorage.getItem('moveLeft');
            let key = document.getElementById("moveLeft-input").value;
            myKeyboard.unregister(previousKey, 'moveLeft');
            myKeyboard.registerKeyUp(key, 'moveLeft', moveLeft);
            document.getElementById('moveLeft').innerHTML = "Move Left: " + key;
            document.getElementById('changeKeyFinal-ml').classList.remove('show');
            document.getElementById('changeKeyInitial-ml').classList.add('show');
        }
    );
    document.getElementById("moveUp-button").addEventListener(
        'click',
        function() {
            let previousKey = localStorage.getItem('moveUp');
            let key = document.getElementById("moveUp-input").value;
            myKeyboard.unregister(previousKey, 'moveUp');
            myKeyboard.registerKeyUp(key, 'moveUp', moveUp);
            document.getElementById("moveUp").innerHTML = "Move Up: " + key;
            document.getElementById('changeKeyFinal-mu').classList.remove('show');
            document.getElementById('changeKeyInitial-mu').classList.add('show');
        }
    );
    document.getElementById("moveDown-button").addEventListener(
        'click',
        function() {
            let previousKey = localStorage.getItem('moveDown');
            let key = document.getElementById("moveDown-input").value;
            myKeyboard.unregister(previousKey, 'moveDown');
            myKeyboard.registerKeyUp(key, 'moveDown', moveDown);
            document.getElementById('moveDown').innerHTML = "Move Down: " + key;
            document.getElementById('changeKeyFinal-md').classList.remove('show');
            document.getElementById('changeKeyInitial-md').classList.add('show');
        }
    );
    document.getElementById("moveUp").innerHTML = "Move Up: " + up;
    document.getElementById("moveRight").innerHTML = "Move Right: " + right;
    document.getElementById("moveLeft").innerHTML = "Move Left: " + left;
    document.getElementById("moveDown").innerHTML = "Move Down: " + down;
  }

  let api = {
      reset: reset,
      update: update,
      render: render,
      setKeyboard: setKeyboard,
      get hasWon() { return hasWon; },
      get hasLost() { return hasLost; },
      get score() { return score; }
  };

  return api;
}
