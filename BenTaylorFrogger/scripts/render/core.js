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

    function drawStatistics(lunarLander) {
        context.font = "12px Arial";
        context.textAlign = "center";
        if (lunarLander.fuel > 0) {
            context.fillStyle = "green";
        }
        else {
            context.fillStyle = "white";
        }
        context.fillText("Fuel: " + lunarLander.fuel.toFixed(3) + "%", canvas.width * 0.9, 20);

        if (Math.floor(lunarLander.getRotationDegrees()) <= 5 || Math.ceil(lunarLander.getRotationDegrees()) >= 355) {
            context.fillStyle = "green";
        }
        else {
            context.fillStyle = "white";
        }
        context.fillText("Angle: " + lunarLander.getRotationDegrees().toFixed(3), canvas.width * 0.9, 50);
        
        if (lunarLander.momentum < 2) {
            context.fillStyle = "green";
        }
        else {
            context.fillStyle = "white";
        }
        context.fillText("Speed: " + lunarLander.momentum.toFixed(3) + "m/s", canvas.width * 0.9, 35);
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
        drawStatistics: drawStatistics,
        drawResults: drawResults,
        resetVariables: resetVariables,
        get points() { return points; },
    };

    return api;
}());
