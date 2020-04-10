MyGame.objects.ParticleSystemSparkle = function(spec) {
    let that = {};
    let particles = [];
    let time = 1000;
    // let Random = MyGame.render.Random;
    let image = new Image();
    image.src = '../assets/sparkle.png';

    that.center = spec.center;

    that.setTileCount = function(num) {
        numTiles = num;
    }

    that.getTime = function() {
        return time;
    }

    that.reset = function() {
        time = 1000;
        particles = [];
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
            MyGame.graphics.drawImage(image, spec.center, spec.rotation, spec.size);
        };

        that.getSpec = function() {
            return spec;
        }

        return that;
    }

    that.update = function(elapsedTime) {
        console.log("UPDATING PS");
        time -= elapsedTime;
        let keepMe = [];
        for (let particle = 0; particle < particles.length; particle++) {
            if (particles[particle].update(elapsedTime)) {
                keepMe.push(particles[particle]);
            }
        }
        particles = keepMe;
        let halfSide = MyGame.graphics.canvas.width / 13 / 2;
        if (time > 0) {
            for (let particle = 0; particle < 5; particle++) { // going right
                let size = Math.abs(MyGame.render.Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    center: { x: that.center.x + halfSide, y: MyGame.render.Random.nextRange(that.center.y - halfSide, that.center.y + halfSide) },
                    size: {width: size, height: size},
                    rotation: 0,
                    speed: 0.05 + MyGame.render.Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: {x: 1, y: 0},
                    lifetime: MyGame.render.Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });
                particles.push(p);
                console.log(p.getSpec());
                // console.log("Y: ",that.center.y - halfSide, "X: ",that.center.x - halfSide);
                console.log(" NR ", MyGame.render.Random.nextRange(that.center.y - halfSide, that.center.y + halfSide));
            }
            for (let particle = 0; particle < 5; particle++) { //going down
                let size = Math.abs(MyGame.render.Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    center: { x: MyGame.render.Random.nextRange(that.center.x - halfSide, that.center.x + halfSide), y: that.center.y + halfSide },
                    size: {width: size, height: size},
                    rotation: 0,
                    speed: 0.05 + MyGame.render.Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: {x: 0, y: 1},
                    lifetime: MyGame.render.Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });
                particles.push(p);
            }
            for (let particle = 0; particle < 5; particle++) { // going left
                let size = Math.abs(MyGame.render.Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    center: { x: that.center.x - halfSide, y: MyGame.render.Random.nextRange(that.center.y - halfSide, that.center.y + halfSide) },
                    size: {width: size, height: size},
                    rotation: 0,
                    speed: 0.05 + MyGame.render.Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: {x: -1, y: 0},
                    lifetime: MyGame.render.Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });
                particles.push(p);
            }
            for (let particle = 0; particle < 5; particle++) { // going up
                let size = Math.abs(MyGame.render.Random.nextGaussian(spec.size.mean, spec.size.stdev));
                let p = create({
                    center: { x: MyGame.render.Random.nextRange(that.center.x - halfSide, that.center.x + halfSide), y: that.center.y - halfSide },
                    size: {width: size, height: size},
                    rotation: 0,
                    speed: 0.05 + MyGame.render.Random.nextGaussian(spec.speed.mean, spec.speed.stdev),
                    direction: {x: 0, y: -1},
                    lifetime: MyGame.render.Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev)
                });
                particles.push(p);
            }
        }
    };

    that.render = function() {
        for (let p = particles.length - 1; p >= 0; p--) {
            particles[p].draw();
        }
    };

    return that;
}
