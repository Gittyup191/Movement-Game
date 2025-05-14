// Existing Variables (you should keep all of these)
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let spriteX = 250, spriteY = 250;
let spriteSize = 10;
let currentSpeed = 2;
let keysPressed = {};
let spriteColor = "#FFFFFF"; // Initial color (white)
let startTime = Date.now();
let pixelCounter = 0;
let timeLimit = 10000; // 10 seconds limit
let gameStarted = false;
let gameEnded = false;

// Rainbow color cycling
let rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"];
let colorIndex = 0; // index to track current color
let trails = []; // to store trail positions and colors

// Event listeners for movement
document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keysPressed[event.key] = false;
});

// Start button click handler
document.getElementById("startButton").addEventListener("click", startGame);

function startGame() {
  gameStarted = true;
  gameEnded = false;
  startTime = Date.now();
  pixelCounter = 0;
  spriteX = 250; // Reset position
  spriteY = 250; // Reset position
  gameLoop(); // Start the game loop
}

function gameLoop() {
  if (gameEnded) return; // Stop if game is ended

  updateGame(); // Update sprite, movement, and trails
  draw(); // Draw everything on the canvas

  if (gameStarted) {
    let timeRemaining = Math.max(0, timeLimit - (Date.now() - startTime));
    document.getElementById("timeDisplay").textContent = `Time: ${Math.ceil(timeRemaining / 1000)}s`;
  }

  if (Date.now() - startTime >= timeLimit) {
    endGame();
  } else {
    requestAnimationFrame(gameLoop); // Call next frame
  }
}

// Update sprite movement, color change, and trail
function updateGame() {
  // Move sprite based on key presses
  if (keysPressed['ArrowUp']) spriteY -= currentSpeed;
  if (keysPressed['ArrowDown']) spriteY += currentSpeed;
  if (keysPressed['ArrowLeft']) spriteX -= currentSpeed;
  if (keysPressed['ArrowRight']) spriteX += currentSpeed;

  // Keep the sprite within the bounds of the canvas
  spriteX = Math.max(0, Math.min(canvas.width - spriteSize, spriteX));
  spriteY = Math.max(0, Math.min(canvas.height - spriteSize, spriteY));

  // Update the rainbow color every 1/10 of a second (100ms)
  colorIndex = (colorIndex + 1) % rainbowColors.length;
  spriteColor = rainbowColors[colorIndex];

  // Store the current position and color for the trail
  trails.push({ x: spriteX, y: spriteY, color: spriteColor });

  // Limit the number of trails to avoid overload (e.g., keep last 50 positions)
  if (trails.length > 50) {
    trails.shift();
  }
}

// Draw the canvas elements (sprite and trails)
function draw() {
  // Clear canvas before each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw trails
  drawTrails();

  // Draw the sprite
  drawSprite();
}

// Draw the trail effect
function drawTrails() {
  trails.forEach((trail, index) => {
    ctx.fillStyle = trail.color;
    ctx.beginPath();
    ctx.arc(trail.x, trail.y, spriteSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Draw the sprite
function drawSprite() {
  ctx.fillStyle = spriteColor;
  ctx.beginPath();
  ctx.arc(spriteX, spriteY, spriteSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

// End the game
function endGame() {
  gameEnded = true;
  document.getElementById("timeDisplay").textContent = `Game Over!`;
  document.getElementById("pixelCounterDisplay").textContent = `Pixels Moved: ${pixelCounter}`;
  // Reset everything
  setTimeout(() => {
    gameStarted = false;
    document.getElementById("startButton").style.display = "inline";
  }, 1000); // Show start button after a brief pause
}


