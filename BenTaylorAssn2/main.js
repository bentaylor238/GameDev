let inputBuffer = {};
let canvas = null;
let context = null;

const COORD_SIZE = 1024;
const MAX_CELLS = 5;

let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
    this.isReady = true;
};
imgFloor.src = 'floor.png';

let maze = [];
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
            inMaze: false,
            inList: false,
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

let mazeCells = [];
// let numInMaze = 0;
maze[0][0].inMaze = true;
// numInMaze += 1;
generateMaze();



function generateMaze() {
    console.log("BEGIN GENERATION");
    includeNeighbors(maze[0][0]);
    while (mazeCells.length > 0) {
        var randomCell = mazeCells.splice(Math.floor(Math.random() * mazeCells.length), 1);
        randomCell = randomCell[0];
        console.log("GENERATE NEXT");
        console.log(randomCell);
        includeNeighbors(randomCell);
        console.log("FINISHED INCLUDING NEIGHBORS FOR " + randomCell);
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
    console.log("INCLUDING NEIGHBORS FOR " + mazeCell);
    console.log(mazeCell.n);
    console.log(mazeCell.e);
    console.log(mazeCell.s);
    console.log(mazeCell.w);
    if (mazeCell.n && !mazeCell.inMaze && !mazeCell.inList) {
        console.log("INCLUDING NORTH CELL");
        mazeCells.push(mazeCell.n);
        mazeCell.n.inList = true;
    }
    if (mazeCell.e && !mazeCell.e.inMaze && !mazeCell.e.inList) {
        console.log("INCLUDING EAST CELL");
        mazeCells.push(mazeCell.e);
        mazeCell.e.inList = true;
    }
    if (mazeCell.s && !mazeCell.s.inMaze && !mazeCell.s.inList) {
        console.log("INCLUDING SOUTH CELL");
        mazeCells.push(mazeCell.s);
        mazeCell.s.inList = true;
    }
    if (mazeCell.w && !mazeCell.w.inMaze && !mazeCell.w.inList) {
        console.log("INCLUDING WEST CELL");
        mazeCells.push(mazeCell.w);
        mazeCell.w.inList = true;
    }
}

function flipReferencesInMaze() {
    for (let row = 0; row < MAX_CELLS; row++) {
        for (let col = 0; col < MAX_CELLS; col++) {
            if (row > 0) {
                if (maze[row][col].n) maze[row][col].n = null;
                else maze[row][col].n = maze[row-1][col];
            }
            if (row < (MAX_CELLS - 1)) {
                if (maze[row][col].s) maze[row][col].s = null;
                else maze[row][col].s = maze[row+1][col];
            }
            if (col > 0) {
                if (maze[row][col].w) maze[row][col].w = null;
                else maze[row][col].w = maze[row][col-1];
            }
            if (col < (MAX_CELLS - 1)) {
                if (maze[row][col].e) maze[row][col].e = null;
                else maze[row][col].e = maze[row][col+1];
            }
        }
    }
}

// maze[0][0].s = maze[1][0];

// maze[0][1].s = maze[1][1];
// maze[0][1].e = maze[0][2];

// maze[0][2].w = maze[0][1];
// maze[0][2].s = maze[1][2];

// maze[1][0].n = maze[0][0];
// maze[1][0].e = maze[1][1];
// maze[1][0].s = maze[2][0];

// maze[1][1].n = maze[0][1];
// maze[1][1].s = maze[2][1];
// maze[1][1].w = maze[1][0];

// maze[1][2].n = maze[0][2];

// maze[2][0].n = maze[1][0];

// maze[2][1].n = maze[1][1];
// maze[2][1].e = maze[2][2];

// maze[2][2].w = maze[2][1];

function drawCell(cell) {

    if (imgFloor.isReady) {
        context.drawImage(imgFloor,
        cell.x * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS),
        COORD_SIZE / MAX_CELLS + 0.5, COORD_SIZE / MAX_CELLS + 0.5);
    }

    if (cell.n === null) {
        context.moveTo(cell.x * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS));
        context.lineTo((cell.x + 1) * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS));
        //context.stroke();
    }

    if (cell.s === null) {
        context.moveTo(cell.x * (COORD_SIZE / MAX_CELLS), (cell.y + 1) * (COORD_SIZE / MAX_CELLS));
        context.lineTo((cell.x + 1) * (COORD_SIZE / MAX_CELLS), (cell.y + 1) * (COORD_SIZE / MAX_CELLS));
        //context.stroke();
    }

    if (cell.e === null) {
        context.moveTo((cell.x + 1) * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS));
        context.lineTo((cell.x + 1) * (COORD_SIZE / MAX_CELLS), (cell.y + 1) * (COORD_SIZE / MAX_CELLS));
        //context.stroke();
    }

    if (cell.w === null) {
        context.moveTo(cell.x * (COORD_SIZE / MAX_CELLS), cell.y * (COORD_SIZE / MAX_CELLS));
        context.lineTo(cell.x * (COORD_SIZE / MAX_CELLS), (cell.y + 1) * (COORD_SIZE / MAX_CELLS));
        //context.stroke();
    }

    //
    // Can do all the moveTo and lineTo commands and then render them all with a single .stroke() call.
    context.stroke();
}

function renderCharacter(character) {
    if (character.image.isReady) {
        context.drawImage(character.image,
        character.location.x * (COORD_SIZE / MAX_CELLS), character.location.y * (COORD_SIZE / MAX_CELLS));
    }
}

function moveCharacter(key, character) {
    if (key === 'ArrowDown') {
        if (character.location.s) {
            character.location = character.location.s;
        }
    }
    if (key == 'ArrowUp') {
        if (character.location.n) {
            character.location = character.location.n;
        }
    }
    if (key == 'ArrowRight') {
        if (character.location.e) {
            character.location = character.location.e;
        }
    }
    if (key == 'ArrowLeft') {
        if (character.location.w) {
            character.location = character.location.w;
        }
    }
}

function renderMaze() {
    context.strokeStyle = 'rgb(255, 255, 255)';
    context.lineWidth = 6;

    for (let row = 0; row < MAX_CELLS; row++) {
        for (let col = 0; col < MAX_CELLS; col++) {
            drawCell(maze[row][col]);
        }
    }

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(COORD_SIZE - 1, 0);
    context.lineTo(COORD_SIZE - 1, COORD_SIZE - 1);
    context.lineTo(0, COORD_SIZE - 1);
    context.closePath();
    context.strokeStyle = 'rgb(0, 0, 0)';
    context.stroke();
}

//
// Immediately invoked anonymous function
//
let myCharacter = function(imageSource, location) {
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
}('character'+MAX_CELLS+'.png', maze[0][0]);

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderMaze();
    renderCharacter(myCharacter);
}

function processInput() {
    for (input in inputBuffer) {
        moveCharacter(inputBuffer[input], myCharacter);
    }
    inputBuffer = {};
}

function gameLoop() {
    processInput();
    render();

    requestAnimationFrame(gameLoop);

}

function initialize() {
    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');

    window.addEventListener('keydown', function(event) {
        inputBuffer[event.key] = event.key;
    });

    requestAnimationFrame(gameLoop);
}
