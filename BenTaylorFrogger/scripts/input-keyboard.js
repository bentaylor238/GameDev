MyGame.input.Keyboard = function () {
    let that = {
        keys: {},
        keyDownHandlers: {},
        keyUpHandlers: {},
    };

    function keyPress(e) {
        that.keys[e.key] = e.timeStamp;
    }

    function keyRelease(e) {
        if (that.keyUpHandlers[e.key]) that.keyUpHandlers[e.key]();
        delete that.keys[e.key];
    }

    that.update = function (elapsedTime) {
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.keyDownHandlers[key]) {
                    that.keyDownHandlers[key](elapsedTime);
                }
            }
        }
    };

    that.registerKeyUp = function(key, functionName, handler) {
        that.keyUpHandlers[key] = handler;
        localStorage.setItem(functionName, key);
    }

    that.register = function (key, functionName, handler) {
        that.keyDownHandlers[key] = handler;
        localStorage.setItem(functionName, key);
    };

    that.unregister = function(key, functionName) {
        if (that.keyDownHandlers.hasOwnProperty(key)) {
            delete that.keyDownHandlers[key];
            delete localStorage[functionName];
        }
        else if (that.keyUpHandlers.hasOwnProperty(key)) {
            delete that.keyUpHandlers[key];
            delete localStorage[functionName];
        }
    }

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
};
