// Variables
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let spriteX = 250, spriteY = 250;
let spriteSize = 10;
let currentSpeed = 2;
let keysPressed = {};
let spriteColor = "#FFFFFF";
let startTime = 0;
let pixelCounter = 0;
let timeLimit = 10000;
let gameStarted = false;
let gameEnded = false;

// Rainbow color cycling
let rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"];
let colorIndex = 0;
let trails = [];
let lastColorChangeTime = 0;

// Listeners
document.addEventListener("keydown", (e) => {
  keysPressed[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keysPressed[e.key] = false;
});

// Start Button Listener
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
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!gameStarted || gameEnded) return;

  updateGame();
  draw();

  let elapsed = Date.now() - startTime;
  let remaining = Math.max(0, timeLimit - elapsed);
  document.getElementById("timeDisplay").textContent = `Time: ${Math.ceil(remaining / 1000)}s`;
  document.getElementById("pixelCounterDisplay").textContent = `Pixels Moved: ${pixelCounter}`;

  if (elapsed >= timeLimit) {
    endGame();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

function updateGame() {
  let moved = false;

  if (keysPressed["ArrowUp"]) { spriteY -= currentSpeed; moved = true; }
  if (keysPressed["ArrowDown"]) { spriteY += currentSpeed; moved = true; }
  if (keysPressed["ArrowLeft"]) { spriteX -= currentSpeed; moved = true; }
  if (keysPressed["ArrowRight"]) { spriteX += currentSpeed; moved = true; }

  // Keep inside canvas
  spriteX = Math.max(0, Math.min(canvas.width - spriteSize, spriteX));
  spriteY = Math.max(0, Math.min(canvas.height - spriteSize, spriteY));

  if (moved) pixelCounter += currentSpeed;

  // Color change every 100ms
  let now = Date.now();
  if (now - lastColorChangeTime > 100) {
    colorIndex = (colorIndex + 1) % rainbowColors.length;
    spriteColor = rainbowColors[colorIndex];
    lastColorChangeTime = now;
  }

  trails.push({ x: spriteX, y: spriteY, color: spriteColor });
  if (trails.length > 50) trails.shift();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw trails
  trails.forEach(t => {
    ctx.fillStyle = t.color;
    ctx.beginPath();
    ctx.arc(t.x, t.y, spriteSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw sprite
  ctx.fillStyle = spriteColor;
  ctx.beginPath();
  ctx.arc(spriteX, spriteY, spriteSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

function endGame() {
  gameEnded = true;
  document.getElementById("timeDisplay").textContent = "Game Over!";
  document.getElementById("pixelCounterDisplay").textContent = `Pixels Moved: ${pixelCounter}`;

  setTimeout(() => {
    gameStarted = false;
    document.getElementById("startButton").style.display = "inline";
  }, 1000);
}
