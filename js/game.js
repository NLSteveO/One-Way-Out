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

const checkWinCondition = () => {
    const x1 = Math.floor(rectX / tileSize);
    const y1 = Math.floor(rectY / tileSize);
    const x2 = Math.floor((rectX + rectWidth) / tileSize);
    const y2 = Math.floor((rectY + rectHeight) / tileSize);
    const player = maze[y1][x1] + maze[y1][x2] + maze[y2][x1] + maze[y2][x2];
    return player >= 6;    
}

const gameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    if (keys.w && rectY > 0) {
        for (let i = 0; i < rectSpeed; i++) {
            const newY = rectY - 1;
            if (!isWall(rectX, newY)) {
                rectY = newY;
            } else {
                break;
            }
        }
    }
    if (keys.a && rectX > 0) {
        for (let i = 0; i < rectSpeed; i++) {
            const newX = rectX - 1;
            if (!isWall(newX, rectY)) {
                rectX = newX;
            } else {
                break;
            }
        }
    }
    if (keys.s && rectY + rectHeight < canvas.height) {
        for (let i = 0; i < rectSpeed; i++) {
            const newY = rectY + 1;
            if (!isWall(rectX, newY)) {
                rectY = newY;
            } else {
                break;
            }
        }
    }
    if (keys.d && rectX + rectWidth < canvas.width) {
        for (let i = 0; i < rectSpeed; i++) {
            const newX = rectX + 1;
            if (!isWall(newX, rectY)) {
                rectX = newX;
            } else {
                break;
            }
        }
    }

    if (checkWinCondition()) {
        context.fillStyle = 'black';
        context.fillRect(0, 130, 125, 50);
        context.fillStyle = 'white';
        context.fillRect(5, 135, 115, 40);
        context.fillStyle = 'black';
        context.fillRect(10, 140, 105, 30);
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText('You win!', 15, 165);
    }

    context.fillStyle = 'blue';
    context.fillRect(rectX, rectY, rectWidth, rectHeight);
    requestAnimationFrame(gameLoop);
};

gameLoop();