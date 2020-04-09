MyGame.objects.Lillipad = function(spec) {
  'use strict';

  let hasReached = false;
  let imageReady = false;
  let image = new Image();

  image.onload = function() {
      imageReady = true;
  };
  image.src = spec.imageSrc;

  let frog = MyGame.objects.Sprite({
      spriteSheet: MyGame.assets['frog-sprites'],
      spriteCount: 7,
      spriteTime: [50, 50, 50, 50, 50, 50, 50],
      spriteSize: spec.size,            // Maintain the size on the sprite
      spriteCenter: spec.center       // Maintain the center on the sprite
    });
  
  function reset() {
    hasReached = false;
  }

  function update(elapsedTime, frogReached) {
    hasReached = frogReached;
  }

  function render() {
    MyGame.graphics.drawImage(image, spec.center, 0, spec.size);
    if (hasReached) frog.render();
  };

  let api = {
    render: render,
    update: update,
    reset: reset,
    get imageReady() { return imageReady; },
    get image() { return image; },
    get center() { return spec.center; },
    get size() { return spec.size; },
    get hasReached() { return hasReached; }
  };

  return api;
}
