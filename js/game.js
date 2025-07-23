const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext('2d');

let rectX = 100;
let rectY = 100;
const rectWidth = 50;
const rectHeight = 50;

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
        rectY -= 5;
    }
    if (keys.a && rectX > 0) {
        rectX -= 5;
    }
    if (keys.s && rectY + rectHeight < canvas.height) {
        rectY += 5;
    }
    if (keys.d && rectX + rectWidth < canvas.width) {
        rectX += 5;
    }
    context.fillRect(rectX, rectY, rectWidth, rectHeight);
    requestAnimationFrame(gameLoop);
};

gameLoop();