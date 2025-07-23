const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext('2d');

let rectX = 100;
let rectY = 100;
let rectSpeed = 1;
const rectWidth = 50;
const rectHeight = 50;

const gameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (rectX + rectWidth > canvas.width) {
        rectSpeed = -1;
    } else if (rectX < 0) {
        rectSpeed = 1;
    }
    rectX += rectSpeed;
    context.fillRect(rectX, rectY, rectWidth, rectHeight);
    requestAnimationFrame(gameLoop);
};

gameLoop();