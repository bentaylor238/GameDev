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
MyGame.objects.Alligator = function() {
  'use strict';

  let canvas = MyGame.graphics.canvas;
  let rows = [];
  for (let i = 0; i < 5; i++) {
    rows.push([]);
  }
  for (let i = 0; i < 3; i++) {
    rows[0].push(MyGame.objects.Mover({
      imageSrc: 'assets/car1.png',
      center: { x: canvas.width / 13 * 4 * i, y: canvas.height / 13 / 2 * 15 },
      size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
      moveRate: 0.02,
      rotation: 0
    }));
  }
  for (let i = 0; i < 3; i++) {
    rows[1].push(MyGame.objects.Mover({
      imageSrc: 'assets/truck1.png',
      center: { x: canvas.width / 13 * 5 * i + 30, y: canvas.height / 13 / 2 * 17 },
      size: { width: canvas.width / 13 * 2, height: canvas.height / 13 },
      moveRate: - 0.01,
      rotation: Math.PI
    }));
  }
  for (let i = 0; i < 2; i++) {
    rows[2].push(MyGame.objects.Mover({
      imageSrc: 'assets/car2.png',
      center: { x: canvas.width / 13 * (i + 2) * (i + 2), y: canvas.height / 13 / 2 * 19 },
      size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
      moveRate: 0.04,
      rotation: 0
    }));
  }
  for (let i = 0; i < 3; i++) {
    rows[3].push(MyGame.objects.Mover({
      imageSrc: 'assets/truck2.png',
      center: { x: canvas.width / 13 * 4 * i + 30, y: canvas.height / 13 / 2 * 21 },
      size: { width: canvas.width / 13 * 2, height: canvas.height / 13 },
      moveRate: - 0.03,
      rotation: Math.PI
    }));
  }
  for (let i = 0; i < 2; i++) {
    rows[4].push(MyGame.objects.Mover({
      imageSrc: 'assets/car3.png',
      center: { x: canvas.width / 13 * 8 * i, y: canvas.height / 13 / 2 * 23 },
      size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
      moveRate: 0.06,
      rotation: 0
    }));
  }


  function reset() {
    // frog.resetVariables({ x: canvas.width / 2, y: canvas.height / 13 / 2 + canvas.height * 12 / 13 });
  }

  function update(elapsedTime) {
    for (let i = 0; i < 3; i++) {
      rows[0][i].update(elapsedTime);
      if (rows[0][i].center.x > canvas.width) {
        rows[0].splice(i, 1);
        rows[0].push(MyGame.objects.Mover({
          imageSrc: 'assets/car1.png',
          center: { x: 0, y: canvas.height / 13 / 2 * 15 },
          size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
          moveRate: 0.02,
          rotation: 0
        }));
      }
    }
    for (let i = 0; i < 3; i++) {
      rows[1][i].update(elapsedTime);
        // console.log(canvas.width);
      if (rows[1][i].center.x < 0) {
        rows[1].splice(i, 1);
        rows[1].push(MyGame.objects.Mover({
          imageSrc: 'assets/truck1.png',
          center: { x: canvas.width, y: canvas.height / 13 / 2 * 17 },
          size: { width: canvas.width / 13 * 2, height: canvas.height / 13 },
          moveRate: - 0.01,
          rotation: Math.PI
        }));
      }
    }
    for (let i = 0; i < 2; i++) {
      rows[2][i].update(elapsedTime);
      if (rows[2][i].center.x > canvas.width) {
        rows[2].splice(i, 1);
        rows[2].push(MyGame.objects.Mover({
          imageSrc: 'assets/car2.png',
          center: { x: 0, y: canvas.height / 13 / 2 * 19 },
          size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
          moveRate: 0.04,
          rotation: 0
        }));
      }
    }
    for (let i = 0; i < 3; i++) {
      rows[3][i].update(elapsedTime);
        // console.log(canvas.width);
      if (rows[3][i].center.x < 0) {
        rows[3].splice(i, 1);
        rows[3].push(MyGame.objects.Mover({
          imageSrc: 'assets/truck2.png',
          center: { x: canvas.width, y: canvas.height / 13 / 2 * 21 },
          size: { width: canvas.width / 13 * 2, height: canvas.height / 13 },
          moveRate: - 0.03,
          rotation: Math.PI
        }));
      }
    }
    for (let i = 0; i < 2; i++) {
      rows[4][i].update(elapsedTime);
        // console.log(canvas.width);
      if (rows[4][i].center.x > canvas.width) {
        rows[4].splice(i, 1);
        rows[4].push(MyGame.objects.Mover({
          imageSrc: 'assets/car3.png',
          center: { x: 0, y: canvas.height / 13 / 2 * 23 },
          size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
          moveRate: 0.06,
          rotation: 0
        }));
      }
    }
  }
  
  function render() {
    for (let i = 0; i < 3; i++) {
      rows[0][i].render();
    }
    for (let i = 0; i < 3; i++) {
      rows[1][i].render();
    }
    for (let i = 0; i < 2; i++) {
      rows[2][i].render();
    }
    for (let i = 0; i < 3; i++) {
      rows[3][i].render();
    }
    for (let i = 0; i < 2; i++) {
      rows[4][i].render();
    }
  }


  let api = {
      reset: reset,
      update: update,
      render: render,
  };

  return api;
}
