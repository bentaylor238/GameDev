// ------------------------------------------------------------------
//
// Mersenne Twister (MT) + some other useful random number generators
//
// MT Reference: https://en.wikipedia.org/wiki/Mersenne_Twister
// MT Implementation Reference: https://gist.github.com/banksean/300494
//
// ------------------------------------------------------------------
MyGame.render.Random = (function (graphics) {
    'use strict';

    /* Period parameters */
    let N = 624;
    let M = 397;
    let MATRIX_A = 0x9908b0df;   /* constant vector a */
    let UPPER_MASK = 0x80000000; /* most significant w-r bits */
    let LOWER_MASK = 0x7fffffff; /* least significant r bits */

    let mt = new Array(N); /* the array for the state vector */
    let mti = N + 1; /* mti==N+1 means mt[N] is not initialized */

    function setSeed(seed) {
        console.log("Seed: " + seed);
        mt[0] = s >>> 0;
        for (mti = 1; mti < N; mti++) {
            var s = mt[mti - 1] ^ (mt[mti - 1] >>> 30);
            mt[mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                + mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            mt[mti] >>>= 0;
            /* for >32 bit machines */
        }
    }

    /* generates a random number on [0,0xffffffff]-interval */
    function next() {
        var y;
        var mag01 = new Array(0x0, MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (mti >= N) { /* generate N words at one time */
            var kk;

            if (mti == N + 1)   /* if init_genrand() has not been called, */
                init_genrand(5489); /* a default initial seed is used */

            for (kk = 0; kk < N - M; kk++) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < N - 1; kk++) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
            mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            mti = 0;
        }

        y = mt[mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }

    function nextDouble() {
        return (next() + 0.5) * (1.0 / 4294967296.0);
    }

    function nextRange(min, max) {
        // console.log("SPARKLE MADE IT TO NEXT RANGE");
        var range = max - min + 1;
        // console.log("RANGE: ", range);
        // console.log("NEXT: ", next);
        return Math.floor(Math.random() * range) + min;
    }

    function nextCircleVector() {
        var angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    //
    // This is used to give a small performance optimization in generating gaussian random numbers.
    var usePrevious = false,
        y2;

    //
    // Generate a normally distributed random number.
    //
    // NOTE: This code is adapted from a wiki reference I found a long time ago.  I originally
    // wrote the code in C# and am now converting it over to JavaScript.
    //
    function nextGaussian(mean, stdDev) {
        if (usePrevious) {
            usePrevious = false;
            return mean + y2 * stdDev;
        }

        usePrevious = true;

        var x1 = 0,
            x2 = 0,
            y1 = 0,
            z = 0;

        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            z = (x1 * x1) + (x2 * x2);
        } while (z >= 1);

        z = Math.sqrt((-2 * Math.log(z)) / z);
        y1 = x1 * z;
        y2 = x2 * z;

        // console.log(mean + y1 * stdDev);
        return mean + y1 * stdDev;
    }

    function generateTerrain(canvasHeight, canvasWidth, numSafe) {
        console.log(numSafe);
        let y1 = generateYValue(canvasHeight * 0.8, 25, canvasHeight);
        let y2 = generateYValue(canvasHeight * 0.8, 25, canvasHeight);
        graphics.points.push({x: 0, y: y1});
        if (numSafe === 2) {
            let safeY1 = generateYValue(canvasHeight * 0.8, 25, canvasHeight);
            let safeX1 = nextGaussian(canvasWidth * 0.25, 10);
            let safeY2 = generateYValue(canvasHeight * 0.8, 25, canvasHeight);
            let safeX2 = nextGaussian(canvasWidth * 0.75, 10);
            generateMidPoints(0, y1, safeX1, safeY1, canvasHeight);
            graphics.points.push({x: safeX1, y: safeY1});
            graphics.points.push({x: safeX1 + 60, y: safeY1});
            generateMidPoints(safeX1 + 60, safeY1, safeX2, safeY2, canvasHeight);
            graphics.points.push({x: safeX2, y: safeY2});
            graphics.points.push({x: safeX2 + 60, y: safeY2});
            generateMidPoints(safeX2 + 60, safeY2, canvasWidth, y2, canvasHeight);
            graphics.points.push({x: canvasWidth, y: y2});
        }
        else {
            let safeX = nextGaussian(canvasWidth * 0.5, 100);
            while (safeX < 0 || safeX > canvasWidth - 50)
                safeX = nextGaussian(canvasWidth * 0.5, 100);
            let safeY = generateYValue(canvasHeight * 0.8, 25, canvasHeight);
            generateMidPoints(0, y1, safeX, safeY, canvasHeight);
            graphics.points.push({x: safeX, y: safeY});
            graphics.points.push({x: safeX + 50, y: safeY});
            generateMidPoints(safeX + 50, safeY, canvasWidth, y2, canvasHeight);
            graphics.points.push({x: canvasWidth, y: y2});
        }
    }

    function generateYValue(mean, stdDev, canvasHeight) {
        let y = nextGaussian(mean, stdDev);
        while (y > canvasHeight * 0.9 || y < canvasHeight * 0.3) {
            y = nextGaussian(mean, stdDev);
        }
        return y;
    }

    function generateMidPoints(x1, y1, x2, y2, canvasHeight) {
        if (x2 - x1 < 10) {
            return;
        }
        let distance = Math.sqrt((y2 - y1)*(y2-y1) + (x2-x1)*(x2-x1));
        let midX = (x1 + x2) / 2;
        let midY = 0.5 * (y1 + y2) + (2 * nextGaussian(0, 1) * Math.abs(x2 - x1));
        while (midY > ((y2 + y1) / 2 + distance) || midY < ((y2 + y1) / 2 - distance) || midY > (canvasHeight * 0.9) || midY < (canvasHeight * 0.3))
            midY = 0.5 * (y1 + y2) + (2 * nextGaussian(0, 1) * Math.abs(x2 - x1));
        generateMidPoints(x1, y1, midX, midY, canvasHeight);
        graphics.points.push({x: midX, y: midY});
        generateMidPoints(midX, midY, x2, y2, canvasHeight);
    }


    setSeed(new Date().getTime());

    return {
        setSeed, setSeed,
        next: next,
        nextDouble: nextDouble,
        nextRange: nextRange,
        nextCircleVector: nextCircleVector,
        nextGaussian: nextGaussian,
        generateTerrain: generateTerrain,
    };

}(MyGame.graphics));


// for (i = 0; i < 10; i++) {
//     console.log(MyGame.render.Random.nextGaussian(83, 10));
// }
