const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext('2d');

const tileSize = 25;
const maze = [
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1],
    [1,0,1,0,0,0,0,1],
    [1,1,1,0,1,1,1,1],
    [1,0,1,0,1,2,0,1],
    [1,0,0,0,1,1,0,1],
    [1,1,1,0,0,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
];

const mazeWidth = maze[0].length * tileSize;
const mazeHeight = maze.length * tileSize;

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
let rectSpeed = 0;

let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

let showTouchControls = false;
let touchCenterX = 0;
let touchCenterY = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchActive = false;
const touchDeadZone = 15;

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    rectSpeed = 3;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
    rectSpeed = 0;
});

canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();

    // Get raw touch position
    const rawX = touch.clientX - rect.left;
    const rawY = touch.clientY - rect.top;
    
    // Scale to actual canvas coordinates
    touchStartX = (rawX / rect.width) * canvas.width;
    touchStartY = (rawY / rect.height) * canvas.height;
    
    // Store for visual feedback
    touchCenterX = touchStartX;
    touchCenterY = touchStartY;
    showTouchControls = true;
    touchActive = true;
});

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (!touchActive) return;

    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();

    // Scale coordinates
    const currentX = (touch.clientX - rect.left) / rect.width * canvas.width;
    const currentY = (touch.clientY - rect.top) / rect.height * canvas.height;

    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;

    // Reset all movement keys
    keys.w = keys.a = keys.s = keys.d = false;

    // Check if drag is beyond deadzone
    if (Math.abs(deltaX) > touchDeadZone || Math.abs(deltaY) > touchDeadZone) {
        const xSpeed = Math.round((Math.abs(deltaX) - touchDeadZone) / 5) * 0.1
        const ySpeed = Math.round((Math.abs(deltaY) - touchDeadZone) / 5) * 0.1

        // Determine primary direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > touchDeadZone) {
                keys.d = true; // Right
                rectSpeed = xSpeed < 3 ? xSpeed : 3;
            }
            if (deltaX < -touchDeadZone) {
                keys.a = true; // Left
                rectSpeed = xSpeed < 3 ? xSpeed : 3;
            }   
        } else {
            if (deltaY > touchDeadZone) {
                keys.s = true; // Down
                rectSpeed = ySpeed < 3 ? ySpeed : 3;
            }
            if (deltaY < -touchDeadZone) {
                keys.w = true; // Up
                rectSpeed = ySpeed < 3 ? ySpeed : 3;
            }
        }
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchActive = false;
    showTouchControls = false;
    // Stop all movement when touch ends
    keys.w = keys.a = keys.s = keys.d = false;
    rectSpeed = 0;
});

const drawTouchControls = () => {
    if (!showTouchControls) return;

    context.save();

    // Draw deadzone circle
    context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    context.lineWidth = 2;
    context.beginPath();
    context.arc(touchCenterX, touchCenterY, touchDeadZone, 0, 2 * Math.PI);
    context.stroke();

    // Draw center dot
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.beginPath();
    context.arc(touchCenterX, touchCenterY, 4, 0, 2 * Math.PI);
    context.fill();

    context.restore();
};

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
    drawTouchControls();
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
        context.fillRect(0, mazeHeight + 5, 125, 50);
        context.fillStyle = 'white';
        context.fillRect(5, mazeHeight + 10, 115, 40);
        context.fillStyle = 'black';
        context.fillRect(10, mazeHeight + 15, 105, 30);
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.fillText('You win!', 15, mazeHeight + 40);
    }

    context.fillStyle = 'blue';
    context.fillRect(rectX, rectY, rectWidth, rectHeight);
    requestAnimationFrame(gameLoop);
};

gameLoop();