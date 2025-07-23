const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext('2d');

let rectX = 100;
let rectY = 100;
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

const gameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
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
    context.fillRect(rectX, rectY, rectWidth, rectHeight);
    requestAnimationFrame(gameLoop);
};

gameLoop();