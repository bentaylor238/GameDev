function ParticleSystemThrust(graphics, Random, spec) {
    let that = {};
    let particles = [];
    let center = {};

    that.reset = function() {
        particles = [];
        center = {};
    }

    that.setCenter = function(x, y, radius, rotation) {
        center.x = x;
        center.y = y;
        center.radius = radius;
        spec.rotation = rotation;
    }

    function create(spec) {
        let that = {};

        spec.fill = 'rgb(255, 255, 255)';
        spec.stroke = 'rgb(0, 0, 0)';
        spec.alive = 0;

        that.update = function(elapsedTime) {
            spec.center.x += (spec.speed * spec.direction.x * elapsedTime);
            spec.center.y += (spec.speed * spec.direction.y * elapsedTime);
            spec.alive += elapsedTime;

            spec.rotation += spec.speed * 0.5;
            return spec.alive < spec.lifetime;
        };

        that.draw = function() {
            graphics.drawTexture(spec.image, spec.center, spec.rotation, spec.size);
        };

        return that;
    }

    that.update = function(elapsedTime) {
        let keepMe = [];
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].update(elapsedTime)) {
                keepMe.push(particles[particle]);
            }
        }
        particles = keepMe;
    }

    that.updateAndCreate = function(elapsedTime) {
        let keepMe = [];
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].update(elapsedTime)) {
                keepMe.push(particles[particle]);
            }
        }
        particles = keepMe;

        for (let particle = 0; particle < 5; particle++) {
            let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
            let p = create({
                image: spec.image,
                center: { x: center.x - Math.sin(spec.rotation) * center.radius, y: center.y + Math.cos(spec.rotation) * center.radius},
                size: {width: size, height: size},
                rotation: 0,
                speed: Math.abs(Random.nextGaussian(spec.speed.mean, spec.speed.stdev)),
                direction: {x: -1 * Math.sin(spec.rotation) + Random.nextGaussian(0, 0.3), y: Math.cos(spec.rotation) + Random.nextGaussian(0, 0.3)},
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
            });
            particles.push(p);
        }
    };

    that.createParticles = function() {
        for (let particle = 0; particle < 5; particle++) {
            let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
            let p = create({
                image: spec.image,
                center: { x: center.x - Math.sin(spec.rotation) * center.radius, y: center.y + Math.cos(spec.rotation) * center.radius},
                size: {width: size, height: size},
                rotation: 0,
                speed: Math.abs(Random.nextGaussian(spec.speed.mean, spec.speed.stdev)),
                direction: {x: -1 * Math.sin(spec.rotation) + Random.nextGaussian(0, 0.3), y: Math.cos(spec.rotation) + Random.nextGaussian(0, 0.3)},
                lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
            });
            particles.push(p);
        }
    }

    that.render = function() {
        for (let p = particles.length - 1; p >= 0; p--) {
            particles[p].draw();
        }
    };

    return that;
}
