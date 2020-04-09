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
MyGame.objects.Mover = function(spec) {
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
          MyGame.graphics.drawImage(image, spec.center, spec.rotation, spec.size);
      }
  }

  // This function is implemented to fit functionality in the river system so that it can
  // check if turtles are submerged and logs, so logs are never submerged
  function isSubmerged() {
    return false;
  }

  let api = {
      update: update,
      render: render,
      isSubmerged: isSubmerged,
      get imageReady() { return imageReady; },
      get image() { return image; },
      get moveRate() { return spec.moveRate; },
      get center() { return spec.center; },
      get size() { return spec.size; }
  };

  return api;
}
