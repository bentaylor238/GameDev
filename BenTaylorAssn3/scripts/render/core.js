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
    function drawTexture(image, center, rotation, size) {
        // context.save();

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

    function drawBackground(image, center, size) {
        context.save();

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height
        );

        // context.restore();
    }

    function drawTerrain() {
        context.save();
        context.strokeStyle = 'rgb(255, 255, 255)';
        context.lineWidth = 2;
        context.beginPath();

        context.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        // context.moveTo(points[points.length-1].x, points[points.length-1].y);
        context.lineTo(canvas.width, canvas.height);
        context.lineTo(0, canvas.height);
        context.lineTo(points[0].x, points[0].y);

        context.closePath();
        context.stroke();
        context.fillStyle = "black";
        context.fill();
    }

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
        // console.log(lunarLander.getRotationDegrees());
        if (lunarLander.getRotationDegrees() <= 5 || lunarLander.getRotationDegrees() >= 355) {
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

    function drawResults(lunarLander, hasWon, continuePlaying, score, elapsedTime) {
        context.font = "36px Arial";
        context.textAlign = "center";
        context.fillStyle = "white";
        if (lunarLander.hasCrashed) context.fillText("...this is only a simulation...", canvas.width * 0.5, canvas.height / 2);
        else if (continuePlaying) context.fillText("Next level in " + Math.ceil(resultsTime / 1000), canvas.width * 0.5, canvas.height / 2);
        else if (hasWon) {
            context.fillText("Congratulations, you Win!", canvas.width /2, canvas.height / 2);
            context.fillText("Score: " + score, canvas.width / 2, canvas.height * 0.5 + 40);
            console.log("RENDERING WINNING TEXT");
        }
        else context.fillText("...this is only a simulation...", canvas.width * 0.5, canvas.height / 2);
        resultsTime -= elapsedTime;
        return resultsTime <= 0;
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawBackground: drawBackground,
        drawTerrain: drawTerrain,
        drawStatistics: drawStatistics,
        drawResults: drawResults,
        resetVariables: resetVariables,
        get points() { return points; },
    };

    return api;
}());
