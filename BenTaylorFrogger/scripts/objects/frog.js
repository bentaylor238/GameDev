MyGame.objects.Frog = function(spec) {
  'use strict';

  let imageReady = false;
  let hasDied = false;
  let image = new Image();
  let lives = 3;
  let rotation = Math.PI;
  let moving = false;
  let movingTime = 350;
  let moveRate = null;
  let goalCenter = {};
  let interval = 0;
  let onTop = false;

  let sprite = MyGame.objects.Sprite({
    spriteSheet: MyGame.assets['frog-sprites'],
    spriteCount: 7,
    spriteTime: [50, 50, 50, 50, 50, 50, 50],
    spriteSize: spec.size,            // Maintain the size on the sprite
    spriteCenter: spec.center        // Maintain the center on the sprite
  });

  function reset(center) {
    spec.center = center;
    sprite.setCenter(spec.center);
    rotation = Math.PI;
    lives = 3;
    onTop = false;
    moving = false;
    hasDied = false;
  }

  function resetPosition(center) {
    spec.center = center;
    sprite.setCenter(spec.center);
    rotation = Math.PI;
    onTop = false;
  }

  function checkLillipads(lillipads) {
    let i = null;
    for (i in lillipads) {
      if (spec.center.x > lillipads[i].left && spec.center.x < lillipads[i].right) {
        return i;
      }
    }
    return -1;
  }

  function moveRight() {
    if (!moving && spec.center.x + spec.size.width < MyGame.graphics.canvas.width && !onTop) {
      // console.log("MOVING RIGHT");
      moving = true;
      rotation = - Math.PI / 2;
      goalCenter = { x: spec.center.x + spec.size.width, y: spec.center.y };
      moveRate = (goalCenter.x - spec.center.x) / 7;
      // horizontalIndex++;
    }
  }

  function moveLeft() {
    if (!moving && spec.center.x - spec.size.width > 0 && !onTop) {
      moving = true;
      // console.log("MOVING LEFT");
      rotation = Math.PI / 2;
      goalCenter = { x: spec.center.x - spec.size.width, y: spec.center.y };
      moveRate = (spec.center.x - goalCenter.x) / 7;
      // horizontalIndex--;
    }
  }

  function moveUp(lillipads) {
    if (!moving) {
      if (spec.center.y - spec.size.height < MyGame.graphics.canvas.height / 13 && spec.center.y - spec.size.height > 0) {
        // let horizontalIndex = 0;
        // let xDistance = spec.center.x;
        // while (xDistance > spec.size.width) {
        //   horizontalIndex++;
        //   xDistance -= spec.size.width;
        // }
        // if (horizontalIndex === 1 || horizontalIndex === 3 || horizontalIndex === 6 || horizontalIndex === 9 || horizontalIndex === 11) {
          moving = true;
          onTop = true;
          // console.log("MOVING UP");
          rotation = Math.PI;
          goalCenter = { x: spec.center.x, y: spec.center.y - spec.size.height };
          moveRate = (spec.center.y - goalCenter.y) / 7;
          return 1;
        // }
      }
      else if (spec.center.y - spec.size.height > 0) {
        moving = true;
        // console.log("MOVING UP");
        rotation = Math.PI;
        goalCenter = { x: spec.center.x, y: spec.center.y - spec.size.height };
        moveRate = (spec.center.y - goalCenter.y) / 7;
        return 1;
      }
    }
    return 0;
  }

  function moveDown() {
    if (!moving && spec.center.y + spec.size.height < MyGame.graphics.canvas.height) {
      moving = true;
      onTop = false;
      // console.log("MOVING DOWN");
      rotation = 0;
      goalCenter = { x: spec.center.x, y: spec.center.y + spec.size.height };
      moveRate = (goalCenter.y - spec.center.y) / 7;
      return 1;
    }
    return 0;
  }

  function moveHorizontal(distance) {
    spec.center.x += distance;
    sprite.setCenter(spec.center);
    console.log("FROG HORIZONTAL");
  }

  function takeLife() {
    // console.log("TAKING LIFE FROM FROG ", lives);
    lives--;
    // console.log(lives);
  }

  function update(elapsedTime) {
    if (moving) {
      interval += elapsedTime;
      if (interval > 50) {
        interval = interval % 50;
        if (goalCenter.x < spec.center.x) spec.center.x -= moveRate;
        else if (goalCenter.x > spec.center.x) spec.center.x += moveRate;
        else if (goalCenter.y < spec.center.y) spec.center.y -= moveRate;
        else spec.center.y += moveRate;
        sprite.setCenter(spec.center);
      }
      movingTime -= elapsedTime;
    }
    else {
      interval = 0;
      movingTime = 350;
    }

    if (movingTime < 0) moving = false;
    sprite.update(elapsedTime, moving);
  }

  function render() {
    sprite.render(rotation);
  };

  let api = {
      moveLeft: moveLeft,
      moveRight: moveRight,
      moveUp: moveUp,
      moveDown: moveDown,
      moveHorizontal: moveHorizontal,
      update: update,
      render: render,
      resetPosition: resetPosition,
      reset: reset,
      takeLife: takeLife,
      checkLillipads: checkLillipads,
      get imageReady() { return imageReady; },
      get rotation() { return rotation; },
      get moving() { return moving; },
      get image() { return image; },
      get center() { return spec.center; },
      get size() { return spec.size; },
      get lives() { return lives; }
  };

  return api;
}
