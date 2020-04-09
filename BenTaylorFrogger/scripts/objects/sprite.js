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
MyGame.objects.Sprite = function(spec) {
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

  //------------------------------------------------------------------
  //
  // Update the animation of the sprite based upon elapsed time.
  //
  //------------------------------------------------------------------
  that.update = function(elapsedTime, moving) {
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
        if (moving) {
            spec.sprite += 1;
            //
            // This provides wrap around from the last back to the first sprite
            spec.sprite = spec.sprite % spec.spriteCount;
        } else {
            spec.sprite -= 1;
            //
            // This provides wrap around from the first to the last sprite
            if (spec.sprite < 0) {
                spec.sprite = spec.spriteCount - 1;
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
        spec.spriteSheet.width / spec.spriteCount - 5, spec.spriteSheet.height,    // The size of the sprite in the sprite sheet
        spec.spriteCenter.x - spec.spriteSheet.width / spec.spriteCount / 2,        // Where to draw the sprite
        spec.spriteCenter.y - spec.spriteSheet.height / 2,
        spec.spriteSheet.width / spec.spriteCount, spec.spriteSheet.height - 10,
        spec.spriteCenter,
        rotation);
  };

  that.render2 = function() {
    MyGame.graphics.drawSprite(
      spec.spriteSheet,
      0, 0,
      spec.spriteSheet.width / spec.spriteCount - 5, spec.spriteSheet.height,
      spec.spriteCenter.x, spec.spriteCenter.y,
      spec.spriteSize.width, spec.spriteSize.height,
      spec.spriteCenter,
      0
    );
  }

  return that;
};