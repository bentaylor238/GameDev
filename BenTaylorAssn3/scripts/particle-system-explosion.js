function ParticleSystemExplosion(graphics, Random, spec) {
    let that = {};
    let particles = [];
    let explosionLength = 1000;
    let center = {};

    that.reset = function() {
        particles = [];
        explosionLength = 1000;
        center = {};
    }

    that.setCenter = function(x, y) {
        center.x = x;
        center.y = y;
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

    that.explosionLength = function() { return explosionLength; }

    that.update = function(elapsedTime) {
        let keepMe = [];
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].update(elapsedTime)) {
                keepMe.push(particles[particle]);
            }
        }
        particles = keepMe;
    }

    that.createParticles = function(elapsedTime) {
        explosionLength -= elapsedTime;
        if (explosionLength > 0) {
            for (let particle = 0; particle < 5; particle++) {
                let size = Math.abs(Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    image: spec.image,
                    center: { x: center.x, y: center.y },
                    size: {width: size, height: size},
                    rotation: 0,
                    speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: Random.nextCircleVector(),
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });
                particles.push(p);
            }
        }
    }

    that.render = function() {
        for (let p = particles.length - 1; p >= 0; p--) {
            particles[p].draw();
        }
    };

    return that;
}
