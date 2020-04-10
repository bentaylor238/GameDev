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

  let sparklePS = MyGame.objects.ParticleSystemSparkle({
      width: MyGame.graphics.canvas.width,
      size: {mean: 5, stdev: 1},
      speed: { mean: 0.03, stdev: 0.005},
      lifetime: { mean: 100, stdev: 30},
      center: spec.center
  });
  
  function reset() {
    hasReached = false;
    sparklePS.reset();
  }

  function updateHasReached(frogReached) {
    hasReached = frogReached;
  }

  function update(elapsedTime) {
    if (hasReached && sparklePS.getTime() > 0) sparklePS.update(elapsedTime);
  }

  function render() {
    MyGame.graphics.drawImage(image, spec.center, 0, spec.size);
    if (hasReached) frog.render();
    if (hasReached && sparklePS.getTime() > 0) sparklePS.render();
  };

  let api = {
    render: render,
    updateHasReached: updateHasReached,
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
