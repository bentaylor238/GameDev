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
MyGame.objects.Truck = function(spec) {
  'use strict';

  let imageReady = false;
  let image = new Image();

  image.onload = function() {
      imageReady = true;
  };
  image.src = spec.imageSrc;

  function update(elapsedTime) {
    spec.center.x += (spec.moveRate * elapsedTime);
  }

  function render() {
      if (imageReady) {
          MyGame.graphics.drawBackground(image, spec.center, spec.size);
      }
  }

  let api = {
      update: update,
      render: render,
      get imageReady() { return imageReady; },
      get image() { return image; },
      get center() { return spec.center; },
      get size() { return spec.size; }
  };

  return api;
}
