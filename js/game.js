const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext('2d');

const tileSize = 25;
const maze = [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,0,2,1],
    [1,1,1,1,1]
];

const drawMaze = () => {
    maze.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            if (cell === 0) {
                context.fillStyle = 'grey';
            }
            if (cell === 1) {
                context.fillStyle = 'black';
            }
            if (cell === 2) {
                context.fillStyle = 'green';
            }
            context.fillRect(cellIndex * tileSize, rowIndex * tileSize, tileSize, tileSize);
        });
    });
};

let rectX = 1 * tileSize;
let rectY = 1 * tileSize;
const rectWidth = 15;
const rectHeight = 15;
const rectSpeed = 3;

let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

const isWall = (x, y) => {
    const x1 = Math.floor(x / tileSize);
    const y1 = Math.floor(y / tileSize);
    const x2 = Math.floor((x + rectWidth) / tileSize);
    const y2 = Math.floor((y + rectHeight) / tileSize);
    const tl = maze[y1][x1];
    const tr = maze[y1][x2];
    const bl = maze[y2][x1];
    const br = maze[y2][x2];
    return tl === 1 || tr === 1 || bl === 1 || br === 1;
};

const gameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    if (keys.w && rectY > 0) {
        rectY -= rectSpeed;
    }
    if (keys.a && rectX > 0) {
        rectX -= rectSpeed;
    }
    if (keys.s && rectY + rectHeight < canvas.height) {
        rectY += rectSpeed;
    }
    if (keys.d && rectX + rectWidth < canvas.width) {
        rectX += rectSpeed;
    }
    context.fillStyle = 'blue';
    context.fillRect(rectX, rectY, rectWidth, rectHeight);
    requestAnimationFrame(gameLoop);
};

gameLoop();