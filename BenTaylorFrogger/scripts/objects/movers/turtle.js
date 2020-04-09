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
MyGame.objects.Turtle = function(spec) {
  'use strict';

  let canvas = MyGame.graphics.canvas;
  let turtleSprites = [];
  for (let i = 0; i < spec.num; i++) {
    turtleSprites.push(MyGame.objects.Sprite2({
      spriteSheet: MyGame.assets['turtle'],
      spriteCount: 10,
      spriteTime: [700, 700, 700, 700, 700, 700, 700, 700, 700, 700],
      spriteSize: spec.size,            // Maintain the size on the sprite
      spriteCenter: { x: spec.center.x + i * canvas.width / 13, y: spec.center.y }        // Maintain the center on the sprite
    }));
  }



  function reset(center) {
    spec.center = center;
    let turtle = null;
    for (turtle in turtleSprites) {
      turtleSprites.setCenter({ x: center.x + turtle * canvas.width/13, y: center. y});
    }
  }

  function update(elapsedTime) {
    let turtle = null;
    spec.center.x = spec.center.x + turtle * canvas.width / 13 + (elapsedTime * spec.moveRate);
    for (turtle in turtleSprites) {
      turtleSprites[turtle].setCenter({ x: spec.center.x + turtle * canvas.width / 13, y: spec.center.y });
      turtleSprites[turtle].update(elapsedTime, true);
    }
  }
  
  function render() {
    let turtle = null;
    for (turtle in turtleSprites) {
      // console.log("UPDATING TURTLE");
      turtleSprites[turtle].render(Math.PI);
    }
  }

  function isSubmerged() {
    return turtleSprites[0].isSubmerged();
  }


  let api = {
      reset: reset,
      update: update,
      render: render,
      isSubmerged: isSubmerged,
      get center() { return spec.center; },
      get moveRate() { return spec.moveRate; },
      get size() { return spec.size; },
      get num() { return spec.num; }
  };

  return api;
}
