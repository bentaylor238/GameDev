//------------------------------------------------------------------
//
// Defines an animated model object.  The spec is defined as:
// {
//        spriteSheet: Image,
//        spriteSize: { width: , height: },    // In world coordinates
//        spriteCenter: { x:, y: },            // In world coordinates
//        spriteCount: Number of sprites in the sheet,
//        spriteTime: [array of times (milliseconds) for each frame]
//        animationScale: (optional) Scaling factor for the spriteTime values
// }
//
//------------------------------------------------------------------
MyGame.objects.Sprite2 = function(spec) {
  'use strict';
  let that = {
          get spriteSheet() { return spec.spriteSheet; },
          get pixelWidth() { return spec.spriteSheet.width / spec.spriteCount; },
          get pixelHeight() { return spec.spriteSheet.height; },
          get width() { return spec.spriteSize.width; },
          get height() { return spec.spriteSize.height; },
          get center() { return spec.spriteCenter; },
          setCenter(center) { spec.spriteCenter = center; },
          get sprite() { return spec.sprite; }
      };

  //
  // Initialize the animation of the spritesheet
  spec.sprite = 0;        // Which sprite to start with
  spec.elapsedTime = 0;    // How much time has occured in the animation for the current sprite
  spec.reverse = false;
  //------------------------------------------------------------------
  //
  // Update the animation of the sprite based upon elapsed time.
  //
  //------------------------------------------------------------------
  that.update = function(elapsedTime, moving) {
    // console.log("UPDATING TURTLE");
    if (moving) {
      spec.elapsedTime += elapsedTime;
      //
      // Check to see if we should update the animation frame
      if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
        //
        // When switching sprites, keep the leftover time because
        // it needs to be accounted for the next sprite animation frame.
        spec.elapsedTime -= spec.spriteTime[spec.sprite];
        //
        // Depending upon the direction of the animation...
        if (!spec.reverse) {
            spec.sprite += 1;
            //
            // This provides wrap around from the last back to the first sprite
            if (spec.sprite === spec.spriteCount) {
              spec.sprite = spec.spriteCount - 1;
              spec.reverse = true;
            }
            // spec.sprite = spec.sprite % spec.spriteCount;
        } else {
            spec.sprite -= 1;
            //
            // This provides wrap around from the first to the last sprite
            if (spec.sprite < 0) {
                spec.sprite = 0;
                spec.reverse = false;
            }
        }
      }
    }
    else {
      spec.sprite = 0;
    }
  };

  that.render = function(rotation) {
    //
    // Pick the selected sprite from the sprite sheet to render
    MyGame.graphics.drawSprite(
        spec.spriteSheet,
        spec.spriteSheet.width / spec.spriteCount * spec.sprite, 0,    // Which sprite to pick out
        spec.spriteSheet.width / spec.spriteCount, spec.spriteSheet.height,    // The size of the sprite in the sprite sheet
        spec.spriteCenter.x - spec.spriteSheet.width / spec.spriteCount / 2,        // Where to draw the sprite
        spec.spriteCenter.y - spec.spriteSheet.height / 2,
        spec.spriteSheet.width / spec.spriteCount, spec.spriteSheet.height - 10,
        spec.spriteCenter,
        rotation);
  };

  that.isSubmerged = function() {
    return spec.sprite >= spec.spriteCount - 2
  }

  return that;
};