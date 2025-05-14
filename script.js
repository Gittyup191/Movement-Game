// Get references to HTML elements
const startButton = document.getElementById('startButton');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const timerDisplay = document.getElementById('timer');
const pixelCounterDisplay = document.getElementById('pixelCounter');
const gameInfo = document.getElementById('gameInfo');

// Game state variables
let spriteX = 250;
let spriteY = 250;
let keysPressed = {};
let speed = 2;
let pixelsMoved = 0;
let timeLeft = 10;
let gameInterval;
let timerInterval;

// Listen for key presses
document.addEventListener('keydown', (e) => {
  keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keysPressed[e.key] = false;
});

// Start button click event
startButton.addEventListener('click', startGame);

function startGame() {
  // Reset game state
  spriteX = 250;
  spriteY = 250;
  pixelsMoved = 0;
  timeLeft = 10;
  pixelCounterDisplay.textContent = pixelsMoved;
  timerDisplay.textContent = timeLeft;

  // Show canvas and game info, hide start button
  gameCanvas.style.display = 'block';
  gameInfo.style.display = 'block';
  startButton.style.display = 'none';

  // Start game loop and timer
  gameInterval = setInterval(updateGame, 16); // roughly 60fps
  timerInterval = setInterval(updateTimer, 1000);
}

function updateGame() {
  // Clear canvas
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Determine current speed (double if 's' is held)
  let currentSpeed = keysPressed['s'] ? speed * 2 : speed;

  // Movement logic
  let movedThisFrame = 0;
  if (keysPressed['ArrowUp']) {
    if (spriteY - currentSpeed >= 0) {
      spriteY -= currentSpeed;
      movedThisFrame += currentSpeed;
    }
  }
  if (keysPressed['ArrowDown']) {
    if (spriteY + currentSpeed <= gameCanvas.height - 5) {
      spriteY += currentSpeed;
      movedThisFrame += currentSpeed;
    }
  }
  if (keysPressed['ArrowLeft']) {
    if (spriteX - currentSpeed >= 0) {
      spriteX -= currentSpeed;
      movedThisFrame += currentSpeed;
    }
  }
  if (keysPressed['ArrowRight']) {
    if (spriteX + currentSpeed <= gameCanvas.width - 5) {
      spriteX += currentSpeed;
      movedThisFrame += currentSpeed;
    }
  }

  // Update pixel movement counter
  pixelsMoved += movedThisFrame;
  pixelCounterDisplay.textContent = pixelsMoved;

  // Draw sprite (5x5 white square)
  ctx.fillStyle = 'white';
  ctx.fillRect(spriteX, spriteY, 5, 5);
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  // Stop intervals
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  // Hide canvas and game info, show start button
  gameCanvas.style.display = 'none';
  gameInfo.style.display = 'none';
  startButton.style.display = 'inline-block';

  // Clear canvas for next game
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

