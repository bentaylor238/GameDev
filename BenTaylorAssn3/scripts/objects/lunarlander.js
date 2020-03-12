MyGame.objects.LunarLander = function(spec) {
    'use strict';

    let rotation = Math.PI / 2;
    let imageReady = false;
    let hasCrashed = false;
    let hasLanded = false;
    let image = new Image();
    let fuel = 100.0;
    let momentum = {
        x: 0,
        y: 0,
    };
    let score = 0;
    const GRAVITY = 0.00001;

    function resetVariables(center, nextLevel) {
        console.log(nextLevel);
        console.log(score);
        score = nextLevel ? score : 0;
        console.log(score);
        rotation = Math.PI / 2;
        hasCrashed = false;
        hasLanded = false;
        fuel = 100.0;
        momentum = {
            x: 0,
            y: 0,
        };
        spec.center = center;
    }

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function rotateRight() {
        if (!hasCrashed && !hasLanded) {
            rotation += Math.PI / 180;
        }
    }

    function rotateLeft() {
        if (!hasLanded && !hasCrashed) {
            rotation -= Math.PI / 180;
        }
    }

    function moveForward(elapsedTime) {
        spec.center.x += (Math.sin(rotation) * spec.moveRate * elapsedTime);
        spec.center.y -= (Math.cos(rotation) * spec.moveRate * elapsedTime);
    }

    function thrust(elapsedTime) {
        if (!hasLanded && !hasCrashed) {
            if (fuel <= 0) fuel = 0;
            else {
                momentum.x += (Math.sin(rotation) * spec.moveRate * elapsedTime);
                momentum.y -= (Math.cos(rotation) * spec.moveRate * elapsedTime);
                fuel -= elapsedTime * 0.01;
            }
        }
    }

    function getRotationDegrees() {
        let rotationDegrees = rotation * (180 / Math.PI);
        while (rotationDegrees < 0) {
            rotationDegrees += 360;
        }
        return rotationDegrees;
    }

    function moveTo(pos) {
        spec.center.x = pos.x;
        spec.center.y = pos.y;
    }

    function update(elapsedTime, points) {
        // console.log("UPDATING ROCKET");
        if (!hasCrashed && !hasLanded) {
            momentum.y += (elapsedTime * GRAVITY);
            spec.center.x += (momentum.x * elapsedTime);
            spec.center.y += (momentum.y * elapsedTime);
            // console.log(momentum);
            if (spec.center.x < 0 || spec.center.x > 500) {
                spec.center.x = 250;
            }
            if (spec.center.y < 0 || spec.center.y > 500) {
                spec.center.y = 50;
            }

            checkIntersections(points);
            if (hasLanded) {
                score += (fuel / (100 * (Math.abs(momentum.x) + Math.abs(momentum.y))));
            }
            else if (hasCrashed) {
                score = 0;
            }
        }
    }

    function checkIntersections(points) {
        for (let i = 0; i < points.length - 1; i++) {
            let intersection = lineCircleIntersection(points[i], points[i+1], spec.center);
            if (intersection) {
                if (points[i].y === points[i].y && //safezone
                    100 * (Math.abs(momentum.x) + Math.abs(momentum.y)) <= 2 && //speed under 2
                    (getRotationDegrees() >= 355 || getRotationDegrees() <= 5)) { //angle >= 355 or <= 5
                    hasLanded = true;
                }
                else {
                    hasCrashed = true;
                }
            }
        }
    }

    // Reference: https://stackoverflow.com/questions/37224912/circle-line-segment-collision
    function lineCircleIntersection(pt1, pt2, circle) {
        // console.log(pt1.x);
        // console.log(pt2.x);
        // console.log(circle.x);
        let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
        let v2 = { x: pt1.x - circle.x, y: pt1.y - circle.y };
        let b = -2 * (v1.x * v2.x + v1.y * v2.y);
        let c =  2 * (v1.x * v1.x + v1.y * v1.y);
        let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
        if (isNaN(d)) { // no intercept
            return false;
        }
        // These represent the unit distance of point one and two on the line
        let u1 = (b - d) / c;  
        let u2 = (b + d) / c;
        if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
            return true;
        }
        if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
            return true;
        }
        return false;
    }

    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        moveForward: moveForward,
        thrust: thrust,
        update: update,
        moveTo: moveTo,
        getRotationDegrees: getRotationDegrees,
        resetVariables: resetVariables,
        get fuel() { return fuel; },
        get momentum() {
            return 100 * (Math.abs(momentum.x) + Math.abs(momentum.y));
        },
        get score() { return Math.ceil(score); },
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; },
        get hasCrashed() { return hasCrashed; },
        get hasLanded() { return hasLanded; },
    };

    return api;
}
