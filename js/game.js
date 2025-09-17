const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext('2d');

// Game state management
let gameState = 'start'; // start, playing, finished
const tileSize = 100;
// const maze = [
//     [1,1,1,1,1,1,1,1],
//     [1,0,0,0,0,0,0,1],
//     [1,0,1,0,1,1,1,1],
//     [1,0,1,0,0,0,0,1],
//     [1,1,1,0,1,1,1,1],
//     [1,0,1,0,1,2,0,1],
//     [1,0,0,0,1,1,0,1],
//     [1,1,1,0,0,1,0,1],
//     [1,0,0,0,0,0,0,1],
//     [1,1,1,1,1,1,1,1]
// ];
const maze = [
    // Row 0: Top border
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    // Row 1: Entrance and initial paths
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1],
    // Row 5: Mid-section with branching
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    // Row 10: Middle maze with open areas
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1],
    // Row 15: Lower section leading to exit
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,2,1], // Exit at (23,18)
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  // Bottom border
];

const mazeWidth = maze[0].length * tileSize;
const mazeHeight = maze.length * tileSize;

let cameraX = 0;
let cameraY = 0;

const drawMaze = () => {
    // Fill entire canvas with dark background first
    context.fillStyle = '#2a2a2a';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // calculate which tiles are visible
    const startTileX = Math.floor(cameraX / tileSize);
    const startTileY = Math.floor(cameraY / tileSize);
    const endTileX = Math.ceil((cameraX + canvas.width) / tileSize);
    const endTileY = Math.ceil((cameraY + canvas.height) / tileSize);

    // Only draw the visible tiles
    for (let row = startTileY; row < endTileY; row++) {
        for (let col = startTileX; col < endTileX; col++) {
            if (maze[row] && maze[row][col] !== undefined) {
                // Calculate screen position by subtracting camera offset
                const screenX = (col * tileSize) - cameraX;
                const screenY = (row * tileSize) - cameraY;

                // Draw tile at screen position
                if (maze[row][col] === 1) context.fillStyle = 'black';
                else if (maze[row][col] === 0) context.fillStyle = 'grey';
                else if (maze[row][col] === 2) context.fillStyle = 'green';

                context.fillRect(screenX, screenY, tileSize, tileSize);
            }
        }
    }
};

const updateCamera = () => {
    const maxCameraX = (maze[0].length * tileSize) - canvas.width;
    const maxCameraY = (maze.length * tileSize) - canvas.height;

    cameraX = rectX - canvas.width / 2;
    cameraY = rectY - canvas.height / 2;

    cameraX = Math.max(0, Math.min(cameraX, maxCameraX));
    cameraY = Math.max(0, Math.min(cameraY, maxCameraY));
};

let rectX = 1 * tileSize;
let rectY = 1 * tileSize;
const rectWidth = 25;
const rectHeight = 25;
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
    if (event.key === ' ' && gameState === 'start') {
        event.preventDefault();
        updateGameState();
    }
    if (event.key === ' ' && gameState === 'finished') {
        event.preventDefault();
        updateGameState();
    }

    keys[event.key] = true;
    if (gameState === 'playing') {
        rectSpeed = 3;
    }
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
    rectSpeed = 0;
});

canvas.addEventListener('touchstart', (event) => {
    if (gameState === 'start' || gameState === 'finished') {
        updateGameState();
        return;
    }
    
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

// Start game input handlers
const updateGameState = () => {
    if (gameState === 'start') {
        gameState = 'playing';
    } else if (gameState === 'playing') {
        gameState = 'finished';
    } else if (gameState === 'finished') {
        gameState = 'start';
        rectX = 1 * tileSize;
        rectY = 1 * tileSize;
    }
}

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

const drawStartScreen = () => {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Background (matching maze grey)
    context.fillStyle = 'grey';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    context.fillStyle = 'black';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.fillText('One Way Out', canvas.width / 2, canvas.height / 2 - 60);

    // Subtitle
    context.font = '24px Arial';
    context.fillText('Find the one way to escape', canvas.width / 2, canvas.height / 2 - 20);

    // Instructions
    context.font = '18px Arial';
    context.fillText('Use WASD or touch controls to move', canvas.width / 2, canvas.height / 2 + 40);
    
    // Start prompt (blinking effect)
    if (Math.floor(Date.now() / 500) % 2 === 0) {
        context.fillStyle = 'green';
        context.font = '22px Arial';
        context.fillText('Press Space or tap to Start', canvas.width / 2, canvas.height / 2 + 100);
    }

    context.textAlign = 'left';
};

const drawFinishScreen = () => {
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Background (matching maze grey)
    context.fillStyle = 'grey';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    context.fillStyle = 'black';
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.fillText('You win!', canvas.width / 2, canvas.height / 2 - 60);

    // Restart prompt
    context.fillStyle = 'green';
    context.font = '22px Arial';
    context.fillText('Press Space or tap to Start', canvas.width / 2, canvas.height / 2 + 100);

    context.textAlign = 'left';
}


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

const mazePixelWidth = maze[0].length * tileSize;
const mazePixelHeight = maze.length * tileSize;

const gameLoop = () => {
    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'finished') {
        drawFinishScreen();
    } else if (gameState === 'playing') {
        context.clearRect(0, 0, canvas.width, canvas.height);

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
        if (keys.s && rectY + rectHeight < mazePixelHeight) {
            for (let i = 0; i < rectSpeed; i++) {
                const newY = rectY + 1;
                if (!isWall(rectX, newY)) {
                    rectY = newY;
                } else {
                    break;
                }
            }
        }
        if (keys.d && rectX + rectWidth < mazePixelWidth) {
            for (let i = 0; i < rectSpeed; i++) {
                const newX = rectX + 1;
                if (!isWall(newX, rectY)) {
                    rectX = newX;
                } else {
                    break;
                }
            }
        }

        updateCamera();

        drawMaze();
        drawTouchControls();

        if (checkWinCondition()) {
            updateGameState();
        }

        context.fillStyle = 'blue';
        context.fillRect(rectX - cameraX, rectY - cameraY, rectWidth, rectHeight);
    }

    requestAnimationFrame(gameLoop);
};

gameLoop();