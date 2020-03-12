MyGame.input.Keyboard = function () {
    let that = {
        keys: {},
        handlers: {}
    };

    function keyPress(e) {
        that.keys[e.key] = e.timeStamp;
    }

    function keyRelease(e) {
        delete that.keys[e.key];
    }

    that.update = function (elapsedTime) {
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.handlers[key]) {
                    that.handlers[key](elapsedTime);
                }
            }
        }
    };
    
    // that.registerRotateRight = function (key) {
    //     let previousKey = localStorage.getItem('rotateRight');
    //     that.unregister(previousKey, 'rotateRight');
    //     that.register
    // }

    that.register = function (key, functionName, handler) {
        that.handlers[key] = handler;
        localStorage.setItem(functionName, key);
    };

    that.unregister = function(key, functionName) {
        if (that.handlers.hasOwnProperty(key)) {
            delete that.handlers[key];
            delete localStorage.functionName;
        }
    }

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
};
