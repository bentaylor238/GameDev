MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');
    let points = [];
    let resultsTime = 3000;

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function resetVariables() {
        points = [];
        resultsTime = 3000;
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawImage(image, center, rotation, size) {
        context.save();
        // console.log("DRAWING" + center + size);
        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height
        );

        context.restore();
    }

    function drawSprite(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, center, rotation) {
        context.save();
        // console.log("DRAWING" + center + size);
        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        //s for source image and d for destination image
        context.drawImage(
            image,
            sx, sy,
            sWidth, sHeight,
            dx, dy,
            dWidth, dHeight
        );
        //     center.x - size.width / 2,
        //     center.y - size.height / 2,
        //     size.width, size.height
        // );

        context.restore();
    }

    function drawBackground(image, center, size) {
        context.save();

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height
        );
    }

    // function drawTerrain() {
    //     context.save();
    //     context.strokeStyle = 'rgb(255, 255, 255)';
    //     context.lineWidth = 2;
    //     context.beginPath();

    //     context.moveTo(points[0].x, points[0].y);
    //     for (var i = 1; i < points.length; i++) {
    //         context.lineTo(points[i].x, points[i].y);
    //     }
    //     context.lineTo(canvas.width, canvas.height);
    //     context.lineTo(0, canvas.height);
    //     context.lineTo(points[0].x, points[0].y);

    //     context.closePath();
    //     context.stroke();
    //     context.fillStyle = "black";
    //     context.fill();
    // }

    function drawTimeAndScore(time, score) {
        context.font = "16px Arial";
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillText("Score: " + score, canvas.width/13 * 4, canvas.height / 13 * 12.5 + 5);
        let time2 = Math.floor(time/1000);
        context.fillText(time2 < 0 ? 0 : time2, canvas.width / 13 * 8-20, canvas.height / 13 * 12.5+5);
        context.fillStyle = "green";
        context.fillRect(canvas.width - (canvas.width / 13 * 5 * (time / 30000)), canvas.height / 13 * 12 + 10, canvas.width / 13 * 5 * (time / 30000), canvas.height / 13 - 20);
    }

    function drawResults(hasWon, score) {
        context.font = "36px Arial";
        context.textAlign = "center";
        context.fillStyle = "white";
        if (!hasWon) context.fillText("Better luck next time!", canvas.width * 0.5, canvas.height / 2);
        else {
            context.fillText("Congratulations, you Win!", canvas.width /2, canvas.height / 2);
            context.fillText("Score: " + score, canvas.width / 2, canvas.height * 0.5 + 40);
        }
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawImage: drawImage,
        drawSprite: drawSprite,
        drawBackground: drawBackground,
        // drawTerrain: drawTerrain,
        drawTimeAndScore: drawTimeAndScore,
        drawResults: drawResults,
        resetVariables: resetVariables,
        get points() { return points; },
    };

    return api;
}());
