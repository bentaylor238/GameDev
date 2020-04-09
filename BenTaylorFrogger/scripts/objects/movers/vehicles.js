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
MyGame.objects.Vehicles = function() {
  'use strict';

  let canvas = MyGame.graphics.canvas;
  let rows = null;
  reset();


  function reset() {
    rows = [];
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
  }

  function update(elapsedTime, frogVert, frogX, frogWidth) {
    let node = null;
    for (node in rows[0]) {
      rows[0][node].update(elapsedTime);
      if (rows[0][node].center.x + rows[0][node].size.width / 2 > canvas.width && rows[0].length === 3) {
        rows[0].push(MyGame.objects.Mover({
          imageSrc: 'assets/car1.png',
          center: { x: 0 - (canvas.width / 13 / 2 + 10), y: canvas.height / 13 / 2 * 15 },
          size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
          moveRate: 0.02,
          rotation: 0
        }));
      } else if (rows[0][node].center.x - (canvas.width / 13 / 2 + 10) > canvas.width) {
        rows[0].splice(node, 1);
      }
    }
    for (node in rows[1]) {
      rows[1][node].update(elapsedTime);
        // console.log(canvas.width);
      if (rows[1][node].center.x - rows[1][node].size.width / 2 < 0 && rows[1].length === 3) {
        rows[1].push(MyGame.objects.Mover({
          imageSrc: 'assets/truck1.png',
          center: { x: canvas.width + canvas.width / 13, y: canvas.height / 13 / 2 * 17 },
          size: { width: canvas.width / 13 * 2, height: canvas.height / 13 },
          moveRate: - 0.01,
          rotation: Math.PI
        }));
      } else if (rows[1][node].center.x + rows[1][node].size.width / 2 < 0) {
        rows[1].splice(node, 1);
      }
    }
    for (node in rows[2]) {
      rows[2][node].update(elapsedTime);
      if (rows[2][node].center.x + rows[2][node].size.width / 2 > canvas.width && rows[2].length === 2) {
        rows[2].push(MyGame.objects.Mover({
          imageSrc: 'assets/car2.png',
          center: { x: 0 - (canvas.width / 13 / 2 + 10), y: canvas.height / 13 / 2 * 19 },
          size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
          moveRate: 0.04,
          rotation: 0
        }));
      } else if (rows[2][node].center.x - (canvas.width / 13 / 2 + 10) > canvas.width) {
        rows[2].splice(node, 1);
      }
    }
    for (node in rows[3]) {
      rows[3][node].update(elapsedTime);
        // console.log(canvas.width);
      if (rows[3][node].center.x - rows[3][node].size.width / 2 < 0 && rows[3].length === 3) {
        rows[3].push(MyGame.objects.Mover({
          imageSrc: 'assets/truck2.png',
          center: { x: canvas.width + canvas.width / 13, y: canvas.height / 13 / 2 * 21 },
          size: { width: canvas.width / 13 * 2, height: canvas.height / 13 },
          moveRate: - 0.03,
          rotation: Math.PI
        }));
      } else if (rows[3][node].center.x + rows[3][node].size.width / 2 < 0) {
        rows[3].splice(node, 1);
      }
    }
    for (node in rows[4]) {
      rows[4][node].update(elapsedTime);
        // console.log(canvas.width);
      if (rows[4][node].center.x + rows[4][node].size.width / 2 > canvas.width && rows[4].length === 2) {
        rows[4].push(MyGame.objects.Mover({
          imageSrc: 'assets/car3.png',
          center: { x: 0 - (canvas.width / 13 / 2 + 10), y: canvas.height / 13 / 2 * 23 },
          size: { width: canvas.width / 13 + 20, height: canvas.height / 13 },
          moveRate: 0.06,
          rotation: 0
        }));
      } else if (rows[4][node].center.x - (canvas.width / 13 / 2 + 10) > canvas.width) {
        rows[4].splice(node, 1);
      }
    }

    if (frogVert >= 1 && frogVert < 6) {
      // console.log(rows[frogVert-7][0]);
      let index = (frogVert - 5) * -1;
      let hitByCar = false;
      for (node in rows[index]) {
        // console.log(frogX);
        // console.log("X: ", rows[index][node].center.x);
        // console.log("HALF: ", rows[index][node].size.width / 2);
        let item = rows[index][node];
        // console.log("NUM: ", item);
        if (frogX - frogWidth / 2 < item.center.x + item.size.width / 2 && 
          frogX - frogWidth / 2 > item.center.x - item.size.width / 2) hitByCar = true;
        else if (frogX + frogWidth / 2 > item.center.x - item.size.width / 2 &&
          frogX + frogWidth / 2 < item.center.x + item.size.width / 2) hitByCar = true;
      }
      return hitByCar;
    }
  }
  
  function render() {
    let node = null;
    for (node in rows[0]) {
      rows[0][node].render();
    }
    for (node in rows[1]) {
      rows[1][node].render();
    }
    for (node in rows[2]) {
      rows[2][node].render();
    }
    for (node in rows[3]) {
      rows[3][node].render();
    }
    for (node in rows[4]) {
      rows[4][node].render();
    }
  }


  let api = {
      reset: reset,
      update: update,
      render: render,
  };

  return api;
}
