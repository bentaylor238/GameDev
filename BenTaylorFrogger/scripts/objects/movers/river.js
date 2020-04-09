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
MyGame.objects.River = function() {
  'use strict';

  let canvas = MyGame.graphics.canvas;
  let rows = null;
  reset();


  function reset() {
    rows = [];
    for (let i = 0; i < 5; i++) {
      rows.push([]);
    }
    rows[0].push(MyGame.objects.Mover({
      imageSrc: 'assets/log1.png',
      center: { x: canvas.width / 13 * 6, y: canvas.height / 13 / 2 * 3 },
      size: { width: canvas.width / 13 * 5, height: canvas.height / 13 },
      moveRate: 0.03,
      rotation: 0
    }));
    for (let i = 0; i < 3; i++) {
      rows[1].push(MyGame.objects.Turtle({
        center: { x: canvas.width / 13 * (i+2) * (i+1), y: canvas.height / 13 / 2 * 5 },
        size: { width: canvas.width / 13, height: canvas.height / 13 },
        num: 3,
        moveRate: -0.01
      }));
    }
    for (let i = 0; i < 3; i++) {
      rows[2].push(MyGame.objects.Mover({
        imageSrc: 'assets/log3.png',
        center: { x: canvas.width / 13 * (i+2) * (i+1), y: canvas.height / 13 / 2 * 7},
        size: { width: canvas.width / 13 * 2, height: canvas.height / 13 },
        moveRate: -0.05,
        rotation: 0
      }));
    }
    for (let i = 0; i < 2; i++) {
      rows[3].push(MyGame.objects.Mover({
        imageSrc: 'assets/log2.png',
        center: { x: canvas.width / 13 * i * 5, y: canvas.height / 13 / 2 * 9 },
        size: { width: canvas.width / 13 * 4, height: canvas.height / 13 },
        moveRate: 0.04,
        rotation: 0
      }));
    }
    for (let i = 0; i < 3; i++) {
      rows[4].push(MyGame.objects.Turtle({
        center: { x: canvas.width / 13 * (i*4), y: canvas.height / 13 / 2 * 11 },
        size: { width: canvas.width / 13, height: canvas.height / 13 },
        num: 2,
        moveRate: -0.03
      }));
    }
  }

  function update(elapsedTime, frogVert, frogX) {
    let node = null;
    for (node in rows[0]) {
      rows[0][node].update(elapsedTime);
      if (rows[0][node].center.x + rows[0][node].size.width / 2 > canvas.width && rows[0].length === 1) {
        rows[0].push(MyGame.objects.Mover({
          imageSrc: 'assets/log1.png',
          center: { x: 0 - (2.5 * canvas.width / 13), y: canvas.height / 13 / 2 * 3 },
          size: { width: canvas.width / 13 * 5, height: canvas.height / 13 },
          moveRate: 0.03,
          rotation: 0
        }));
      } else if (rows[0][node].center.x > canvas.width + 2.5 * canvas.width / 13) {
        rows[0].splice(node, 1);
      }
    }
    for (node in rows[1]) {
      rows[1][node].update(elapsedTime);
      if (rows[1][node].center.x - canvas.width / 13 /2 < 0 && rows[1].length === 3) {
        rows[1].push(MyGame.objects.Turtle({
          center: { x: canvas.width + canvas.width / 13 / 2, y: canvas.height / 13 / 2 * 5 },
          size: { width: canvas.width / 13, height: canvas.height / 13 },
          num: 3,
          moveRate: -0.01
        }));
      } else if (rows[1][node].center.x + canvas.width / 13 * 2.5 < 0) {
        rows[1].splice(node, 1);
      }
    }
    for (node in rows[2]) {
      rows[2][node].update(elapsedTime);
      if (rows[2][node].center.x - rows[2][node].size.width / 2 < 0 && rows[2].length === 3) {
        rows[2].push(MyGame.objects.Mover({
          imageSrc: 'assets/log3.png',
          center: { x: canvas.width + canvas.width / 13, y: canvas.height / 13 / 2 * 7 },
          size: { width: canvas.width / 13 * 2, height: canvas.height / 13 },
          moveRate: -0.05,
          rotation: 0
        }));
      } else if (rows[2][node].center.x < 0 - canvas.width / 13) {
        rows[2].splice(node, 1);
      }
    }
    for (node in rows[3]) {
      rows[3][node].update(elapsedTime);
      if (rows[3][node].center.x + rows[3][node].size.width / 2 > canvas.width && rows[3].length === 2) {
        rows[3].push(MyGame.objects.Mover({
          imageSrc: 'assets/log2.png',
          center: { x: 0 - (2 * canvas.width / 13), y: canvas.height / 13 / 2 * 9 },
          size: { width: canvas.width / 13 * 4, height: canvas.height / 13 },
          moveRate: 0.04,
          rotation: 0
        }));
      } else if (rows[3][node].center.x > canvas.width + 2 * canvas.width / 13) {
        rows[3].splice(node, 1);
      }
    }
    for (node in rows[4]) {
      rows[4][node].update(elapsedTime);
      if (rows[4][node].center.x - canvas.width / 13 / 2 < 0 && rows[4].length === 3) {
        rows[4].push(MyGame.objects.Turtle({
          center: { x: canvas.width + canvas.width / 13 / 2, y: canvas.height / 13 / 2 * 11 },
          size: { width: canvas.width / 13, height: canvas.height / 13 },
          num: 2,
          moveRate: -0.03
        }));
      } else if (rows[4][node].center.x + canvas.width / 13 * 1.5 < 0) {
        rows[4].splice(node, 1);
      }
    }
    // console.log(frogVert);
    if (frogVert >= 7 && frogVert < 12) {
      console.log(rows[frogVert-7][0]);
      let index = (frogVert - 11) * -1;
      let exists = false;
      for (node in rows[index]) {
        // console.log(frogX);
        // console.log("X: ", rows[index][node].center.x);
        // console.log("HALF: ", rows[index][node].size.width / 2);
        let item = rows[index][node];
        // console.log("NUM: ", item);
        if (frogX > item.center.x - item.size.width / 2 && 
          frogX < item.center.x + item.size.width / 2 && !item.isSubmerged()) exists = true;
        else if (item.num !== undefined && frogX > item.center.x - item.size.width / 2 &&
          frogX < item.center.x + item.size.width * (item.num - 0.5) && !item.isSubmerged()) exists = true;
      }
      return exists ? rows[index][0].moveRate * elapsedTime : -1;
    }
  }
  
  function render() {
    let node = null;
    let node2 = null;
    for (node in rows) {
      for (node2 in rows[node]) {
        rows[node][node2].render();
      }
    }
  }


  let api = {
      reset: reset,
      update: update,
      render: render,
  };

  return api;
}
