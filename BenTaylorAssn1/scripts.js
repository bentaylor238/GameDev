let previousTime = performance.now();
let events = [];

function addEvent(name, interval, times) {
    // console.log("Made it here");
    // console.log("Name: " + name + " Interval: " + interval + " Times: " + times)
    let event = {
        name: name,
        interval: interval,
        times: times,
        timePassed: 0,
        print: false,
    }
    events.push(event);
}

function remove(arr, value) {
    return arr.filter(function(ele) {
        return ele != value;
    });
}

function update(elapsedTime) {
    events.forEach(event => {
        event.timePassed += elapsedTime;
        event.print = false;
        if (event.timePassed >= event.interval) {
            event.timePassed -= event.interval;
            event.print = true;
            event.times--;
            if (event.times < 0) {
                events = remove(events, event);
                // console.log(events);
            }
        }
    });
}

function render() {
    var node = document.getElementById('console-container');
    events.forEach(event => {
        if (event.print) {
            var para = document.createElement("p");
            para.innerHTML = "Event: " + event.name + " (" + event.times + " remaining)";
            node.appendChild(para);
            node.scrollTop = node.scrollHeight;
        }
    });
}

function gameLoop(time) {
    let elapsedTime = time - previousTime;
    previousTime = time;// measured in ms

    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);