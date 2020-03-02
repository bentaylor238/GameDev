let inputBuffer = {};
let canvas = null;
let context = null;
let maze = [];
let mazeCells = [];
let path = false;
let hint = false;
let bread = false;
let hasWon = false;
let score = 0;
let previousTime = null;
let totalTime = null;
let time = 0;
let myCharacter = null;
let finishCharacter = null;
let highscores = [];
let previousScores = localStorage.getItem('highscores');
if (previousScores !== null) {
    highscores = JSON.parse(previousScores);
    console.log("Grabbed previous highscores: " + highscores);
    console.log(previousScores);
}

const COORD_SIZE = 1024;
let MAX_CELLS = 20;

let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
    this.isReady = true;
};
imgFloor.src = 'floor.png';

let imgBread = new Image();
imgBread.isReady = false;
imgBread.onload = function() {
    this.isReady = true;
};
imgBread.src = 'bread.png';

let imgHint = new Image();
imgHint.isReady = false;
imgHint.onload = function() {
    this.isReady = true;
};
imgHint.src = 'hint.png';

function createCharacter(imageSource, location) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = imageSource;
    return {
        location: location,
        image: image
    };
}

function generateShortestPath(cell) {
    if (cell.n && cell.n.next === null) {
        cell.n.next = cell;
        generateShortestPath(cell.n);
    }
    if (cell.e && cell.e.next === null) {
        cell.e.next = cell;
        generateShortestPath(cell.e);
    }
    if (cell.s && cell.s.next === null) {
        cell.s.next = cell;
        generateShortestPath(cell.s);
    }
    if (cell.w && cell.w.next === null) {
        cell.w.next = cell;
        generateShortestPath(cell.w);
    }
}

function initializeMaze() {
    for (let row = 0; row < MAX_CELLS; row++) {
        maze.push([]);
        for (let col = 0; col < MAX_CELLS; col++) {
            maze[row].push({
                x: col,
                y: row,
                n: null,
                s: null,
                w: null,
                e: null,
                next: null,
                inMaze: false,
                inList: false,
                hasVisited: false,
            });
        }
    }
    
    for (let row = 0; row < MAX_CELLS; row++) {
        for (let col = 0; col < MAX_CELLS; col++) {
            if (row > 0) {
                maze[row][col].n = maze[row-1][col];
            }
            if (row < (MAX_CELLS - 1)) {
                maze[row][col].s = maze[row+1][col];
            }
            if (col > 0) {
                maze[row][col].w = maze[row][col-1];
            }
            if (col < (MAX_CELLS - 1)) {
                maze[row][col].e = maze[row][col+1];
            }
        }
    }
}

function generateMaze() {
    initializeMaze();
    maze[0][0].inMaze = true;
    includeNeighbors(maze[0][0]);
    while (mazeCells.length > 0) {
        var randomCell = mazeCells.splice(Math.floor(Math.random() * mazeCells.length), 1);
        randomCell = randomCell[0];
        includeNeighbors(randomCell);
        while (true) {
            var wall = Math.floor(Math.random() * 4);
            if (wall === 0 && randomCell.n && randomCell.n.inMaze) {
                randomCell.n.s = null;
                randomCell.n = null;
                break;
            }
            else if (wall === 1 && randomCell.e && randomCell.e.inMaze) {
                randomCell.e.w = null;
                randomCell.e = null;
                break;
            }
            else if (wall === 2 && randomCell.s && randomCell.s.inMaze) {
                randomCell.s.n = null;
                randomCell.s = null;
                break;
            }
            else if (wall === 3 && randomCell.w && randomCell.w.inMaze) {
                randomCell.w.e = null;
                randomCell.w = null;
                break;
            }
        }  
        randomCell.inList = false;
        randomCell.inMaze = true;
    }
    flipReferencesInMaze();
}

function includeNeighbors(mazeCell) {
    if (mazeCell.n && !mazeCell.inMaze && !mazeCell.inList) {
        mazeCells.push(mazeCell.n);
        mazeCell.n.inList = true;
    }
    if (mazeCell.e && !mazeCell.e.inMaze && !mazeCell.e.inList) {
        mazeCells.push(mazeCell.e);
        mazeCell.e.inList = true;
    }
    if (mazeCell.s && !mazeCell.s.inMaze && !mazeCell.s.inList) {
        mazeCells.push(mazeCell.s);
        mazeCell.s.inList = true;
    }
    if (mazeCell.w && !mazeCell.w.inMaze && !mazeCell.w.inList) {
        mazeCells.push(mazeCell.w);
        mazeCell.w.inList = true;
    }
}

function flipReferencesInMaze() {
    for (let row = 0; row < MAX_CELLS; row++) {
        for (let col = 0; col < MAX_CELLS; col++) {
            if (row > 0) {
                maze[row][col].n = maze[row][col].n ? null : maze[row-1][col];
            }
            if (row < (MAX_CELLS - 1)) {
                maze[row][col].s = maze[row][col].s ? null : maze[row+1][col];
            }
            if (col > 0) {
                maze[row][col].w = maze[row][col].w ? null : maze[row][col-1];
            }
            if (col < (MAX_CELLS - 1)) {
                maze[row][col].e = maze[row][col].e ? null : maze[row][col+1];
            }
        }
    }
}

function drawCell(cell) {

    if (imgFloor.isReady) {
        context.drawImage(imgFloor,
        cell.x * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS),
        COORD_SIZE / MAX_CELLS + 0.5, COORD_SIZE / MAX_CELLS + 0.5);
    }

    if (bread && cell.hasVisited && imgBread.isReady) {
        context.drawImage(imgBread,
            cell.x * (COORD_SIZE / MAX_CELLS) + 15, cell.y * (COORD_SIZE / MAX_CELLS) + 15,
            COORD_SIZE / MAX_CELLS / 2, COORD_SIZE /MAX_CELLS / 2);
    }

    if (cell.n === null) {
        context.moveTo(cell.x * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS));
        context.lineTo((cell.x + 1) * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS));
    }

    if (cell.s === null) {
        context.moveTo(cell.x * (COORD_SIZE / MAX_CELLS), (cell.y + 1) * (COORD_SIZE / MAX_CELLS));
        context.lineTo((cell.x + 1) * (COORD_SIZE / MAX_CELLS), (cell.y + 1) * (COORD_SIZE / MAX_CELLS));
    }

    if (cell.e === null) {
        context.moveTo((cell.x + 1) * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS));
        context.lineTo((cell.x + 1) * (COORD_SIZE / MAX_CELLS), (cell.y + 1) * (COORD_SIZE / MAX_CELLS));
    }

    if (cell.w === null) {
        context.moveTo(cell.x * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS));
        context.lineTo(cell.x * (COORD_SIZE / MAX_CELLS), (cell.y + 1) * (COORD_SIZE / MAX_CELLS));
    }
}

function renderCharacter(character) {
    if (character.image.isReady) {
        context.drawImage(character.image,
            character.location.x * (COORD_SIZE / MAX_CELLS), character.location.y * (COORD_SIZE / MAX_CELLS),
            (COORD_SIZE / MAX_CELLS), (COORD_SIZE / MAX_CELLS));
        if (path && imgHint.isReady) {
            renderHint(character.location.next);
        }
        else if (hint && character.location.next != character.location.next.next) {
            context.drawImage(imgHint,
                character.location.next.x * (COORD_SIZE / MAX_CELLS), 
                character.location.next.y * (COORD_SIZE / MAX_CELLS),
                COORD_SIZE / MAX_CELLS + 0.5, COORD_SIZE / MAX_CELLS + 0.5);
        }
    }
}

function renderFinishCharacter(character) {
    if (character.image.isReady) {
        context.drawImage(character.image,
            character.location.x * (COORD_SIZE / MAX_CELLS), character.location.y * (COORD_SIZE / MAX_CELLS),
            (COORD_SIZE / MAX_CELLS), (COORD_SIZE / MAX_CELLS));
    }
}

function renderHint(cell) {
    if (cell && cell.next !== cell) {
        context.drawImage(imgHint,
            cell.x * (COORD_SIZE / MAX_CELLS), 
            cell.y * (COORD_SIZE / MAX_CELLS),
            COORD_SIZE / MAX_CELLS + 0.5, COORD_SIZE / MAX_CELLS + 0.5);
        renderHint(cell.next);
    }
}

function updateVisitedAndScore(character, start) {
    if (!character.location.hasVisited) {
        character.location.hasVisited = true;
        start.next === character.location ? score += 5 : score -= 2;
    }
    if (character.location === maze[MAX_CELLS - 1][MAX_CELLS - 1]) hasWon = true;
}

function moveCharacter(key, character) {
    if (key === 'ArrowDown' || key === 's' || key === 'k') {
        if (character.location.s) {
            let start = character.location;
            character.location = character.location.s;
            updateVisitedAndScore(character, start);
        }
    }
    if (key == 'ArrowUp' || key === 'w' || key === 'i') {
        if (character.location.n) {
            let start = character.location;
            character.location = character.location.n;
            updateVisitedAndScore(character, start);
        }
    }
    if (key == 'ArrowRight' || key === 'd' || key === 'l') {
        if (character.location.e) {
            let start = character.location;
            character.location = character.location.e;
            updateVisitedAndScore(character, start);
        }
    }
    if (key == 'ArrowLeft' || key === 'a' || key === 'j') {
        if (character.location.w) {
            let start = character.location;
            character.location = character.location.w;
            updateVisitedAndScore(character, start);
        }
    }
    if (key == 'p') {
        path = !path;
    }
    if (key == 'h') {
        hint = !hint;
    }
    if (key == 'b') {
        bread = !bread;
    }
}

function renderMaze() {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 6;
    context.beginPath();

    for (let row = 0; row < MAX_CELLS; row++) {
        for (let col = 0; col < MAX_CELLS; col++) {
            drawCell(maze[row][col]);
        }
    }
    context.stroke();

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(COORD_SIZE - 1, 0);
    context.lineTo(COORD_SIZE - 1, COORD_SIZE - 1);
    context.lineTo(0, COORD_SIZE - 1);
    context.closePath();
    context.strokeStyle = 'rgb(0, 0, 0)';
    context.stroke();
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderMaze();
    renderFinishCharacter(finishCharacter);
    renderCharacter(myCharacter);
}

function processInput() {
    for (input in inputBuffer) {
        moveCharacter(inputBuffer[input], myCharacter);
    }
    inputBuffer = {};
}

function update(elapsedTime) {
    totalTime += elapsedTime;
    document.getElementById("score-id").innerHTML = score;

    if (totalTime > 1000) {
        time += 1;
        totalTime -= 1000;
        score -= 1;
        score = score < 0 ? 0 : score;
        document.getElementById("time-id").innerHTML = time;
    }
}

function gameLoop(time) {
    let elapsedTime = time - previousTime;
    previousTime = time;

    processInput();
    update(elapsedTime);
    render();

    if (!hasWon) {
        requestAnimationFrame(gameLoop);
    }
    else {
        alert("You win!!!");
        console.log(highscores);
        highscores.push(score);
        console.log(score);
        highscores.sort(function(a, b){return b-a});
        highscores = highscores.splice(0, 5);
        console.log(highscores);
        localStorage['highscores'] = JSON.stringify(highscores);
        let i = 1;
        document.getElementById("highscores-id").innerHTML = "";
        highscores.forEach(printScore);
    }
}

function printScore(highscore, index) {
    document.getElementById("highscores-id").innerHTML += ((index+1) + ". " + highscore + "<br>");
    console.log(highscore);
}

function initialize(size) {
    hasWon = true;
//create function to reset all variables
    resetVariables(size);
    requestAnimationFrame(gameLoop);
}

function resetVariables(size) {
    MAX_CELLS = size;
    maze = [];
    time = 0;
    score = 0;

    generateMaze();
    maze[MAX_CELLS-1][MAX_CELLS-1].next = maze[MAX_CELLS-1][MAX_CELLS-1];
    generateShortestPath(maze[MAX_CELLS-1][MAX_CELLS-1]);

    myCharacter = createCharacter("character.png", maze[0][0]);
    myCharacter.location.hasVisited = true;
    finishCharacter = createCharacter("ghost.png", maze[MAX_CELLS-1][MAX_CELLS-1]);

    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');

    window.addEventListener('keyup', function(event) {
        inputBuffer[event.key] = event.key;
    });

    time = 0;
    previousTime = performance.now();
    hasWon = false;
}

function init() {
    document.getElementById("5x5-id").onclick = function () { initialize(5); };
    console.log(document.getElementById("10x10-id").onclick);
    document.getElementById("10x10-id").onclick = function () { initialize(10); };
    console.log(document.getElementById("15x15-id").onclick);
    document.getElementById("15x15-id").onclick = function () { initialize(15); };
    console.log(document.getElementById("5x5-id").onclick);
    document.getElementById("20x20-id").onclick = function () { initialize(20); };
    console.log(document.getElementById("20x20-id").onclick);

    document.getElementById("highscores-id").innerHTML = "";
    highscores.forEach(printScore);
}
