const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext('2d');

let rectX = 100;
let rectY = 100;
const rectWidth = 50;
const rectHeight = 50;

const gameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    rectX += 1;
    context.fillRect(rectX, rectY, rectWidth, rectHeight);
    requestAnimationFrame(gameLoop);
};

gameLoop();