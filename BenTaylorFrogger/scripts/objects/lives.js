MyGame.objects.Lives = function(spec) {
  'use strict';

  let frogs = null;

  function resetVariables() {
    frogs = [];
    spec.lives = 3;
    for (let i = 0; i < spec.lives; i++) {
      frogs.push(MyGame.objects.Sprite({
        spriteSheet: MyGame.assets['frog-sprites'],
        spriteCount: 7,
        spriteTime: [50, 50, 50, 50, 50, 50, 50],
        spriteSize: spec.size,            // Maintain the size on the sprite
        spriteCenter: { x: spec.center.x + i * 40, y: spec.center.y }       // Maintain the center on the sprite
      }));
    }
  }

  function update(lives) {
    spec.lives = lives;
    // console.log(frogs);
  }

  function render() {
    let node = null;
    for (let node = 0; node < spec.lives; node++) {
      frogs[node].render2();
    }
  }

  let api = {
      update: update,
      render: render,
      resetVariables: resetVariables,
      get imageReady() { return imageReady; },
      get image() { return image; },
      get center() { return spec.center; },
      get size() { return spec.size; },
  };

  return api;
}
