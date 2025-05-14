let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let spriteX = 250, spriteY = 250;
let spriteSize = 10;
let baseSpeed = 2;
let keysPressed = {};
let spriteColor = "#FFFFFF";
let startTime = Date.now();
let pixelCounter = 0;
let timeLimit = 10000;
let gameStarted = false;
let gameEnded = false;

// Rainbow colors
let rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"];
let colorIndex = 0;
let trails = [];
let lastColorChangeTime = Date.now();

// Event listeners for key movement
document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keysPressed[event.key] = false;
});

// Start button
document.getElementById("startButton").addEventListener("click", startGame);

function startGame() {
  gameStarted = true;
  gameEnded = false;
  startTime = Date.now();
  pixelCounter = 0;
  spriteX = 250;
  spriteY = 250;
  trails = [];
  document.getElementById("startButton").style.display = "none";
  gameLoop();
}

function gameLoop() {
  if (gameEnded) return;

  updateGame();
  draw();

  if (gameStarted) {
    let timeRemaining = Math.max(0, timeLimit - (Date.now() - startTime));
    document.getElementById("timeDisplay").textContent = `Time: ${Math.ceil(timeRemaining / 1000)}s`;
  }

  if (Date.now() - startTime >= timeLimit) {
    endGame();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

function updateGame() {
  let speed = baseSpeed;
  if (keysPressed['s'] || keysPressed['S']) speed *= 2;

  let moved = false;

  if (keysPressed['ArrowUp']) {
    spriteY -= speed;
    pixelCounter += speed;
    moved = true;
  }
  if (keysPressed['ArrowDown']) {
    spriteY += speed;
    pixelCounter += speed;
    moved = true;
  }
  if (keysPressed['ArrowLeft']) {
    spriteX -= speed;
    pixelCounter += speed;
    moved = true;
  }
  if (keysPressed['ArrowRight']) {
    spriteX += speed;
    pixelCounter += speed;
    moved = true;
  }

  spriteX = Math.max(0, Math.min(canvas.width - spriteSize, spriteX));
  spriteY = Math.max(0, Math.min(canvas.height - spriteSize, spriteY));

  // Change color every 100ms
  if (Date.now() - lastColorChangeTime >= 100) {
    colorIndex = (colorIndex + 1) % rainbowColors.length;
    spriteColor = rainbowColors[colorIndex];
    lastColorChangeTime = Date.now();
  }

  if (moved) {
    trails.push({ x: spriteX, y: spriteY, color: spriteColor });
    if (trails.length > 50) trails.shift();
  }

  document.getElementById("pixelCounterDisplay").textContent = `Pixels Moved: ${pixelCounter}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTrails();
  drawSprite();
}

function drawTrails() {
  trails.forEach((trail) => {
    ctx.fillStyle = trail.color;
    ctx.beginPath();
    ctx.arc(trail.x, trail.y, spriteSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawSprite() {
  ctx.fillStyle = spriteColor;
  ctx.beginPath();
  ctx.arc(spriteX, spriteY, spriteSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

function endGame() {
  gameEnded = true;
  document.getElementById("timeDisplay").textContent = `Game Over!`;
  document.getElementById("pixelCounterDisplay").textContent = `Pixels Moved: ${pixelCounter}`;
  setTimeout(() => {
    gameStarted = false;
    document.getElementById("startButton").style.display = "inline";
  }, 1000);
}
