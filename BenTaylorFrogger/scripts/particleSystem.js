function ParticleSystem(graphics, Random, myLunarLander) {
    let that = {}; 

    let imageFire = new Image();
    imageFire.src = './assets/fire.png';
    let imageExhaust = new Image();
    imageExhaust.src = './assets/thrust.png';

    let explosionPS = ParticleSystemExplosion(graphics, Random, {
        image: imageFire,
        center: myLunarLander.center,
        size: {mean: 10, stdev: 3},
        speed: {mean: 0, stdev: 0.2},
        lifetime: {mean: 1000, stdev: 250}
    });

    let thrustPS = ParticleSystemThrust(graphics, Random, {
        image: imageExhaust,
        center: myLunarLander.center,
        rotation: myLunarLander.rotation,
        size: {mean: 5, stdev: 2},
        speed: {mean: 0, stdev: 0.2},
        lifetime: {mean: 200, stdev: 50}
    });

    that.reset = function() {
        explosionPS.reset();
        thrustPS.reset();
    }

    that.setCenter = function() {
        thrustPS.setCenter(myLunarLander.center.x, myLunarLander.center.y, myLunarLander.center.radius, myLunarLander.rotation);
        explosionPS.setCenter(myLunarLander.center.x, myLunarLander.center.y);
    }

    that.update = function(elapsedTime) {
        thrustPS.update(elapsedTime);
        if (myLunarLander.hasCrashed) explosionPS.update(elapsedTime);
    }

    that.shipThrust = function() {
        thrustPS.createParticles();
    }

    that.shipCrash = function(elapsedTime) {
        console.log("CRASHING");
        explosionPS.createParticles(elapsedTime);
    }

    that.render = function() {
        if (myLunarLander.hasCrashed) explosionPS.render();
        thrustPS.render();
    };

    return that;
}
