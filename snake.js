const backgroundImage = new Image();
backgroundImage.src = 'background.png';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 50;
const gridWidth = Math.floor(canvas.width / gridSize);
const gridHeight = Math.floor(canvas.height / gridSize);
const backgroundMusic = new Audio('backgroundMusic.mp3');
backgroundMusic.loop = true; // The background music should loop
const eatSound = new Audio('eatSound.mp3');
const gameOverSound = new Audio('lose.mp3');
const winSound = new Audio('win.mp3');
let gameRunning = false;

let startingX = Math.floor(gridWidth / 2);  // Start in the center of the grid on the X-axis
let startingY = Math.floor(gridHeight / 2); // Start in the center of the grid on the Y-axis
let direction;
const randDirection = Math.random();
if (randDirection < 0.33) {
  direction = 'right';
} else if (randDirection < 0.66) {
  direction = 'up';
} else {
  direction = 'down';
}

const snake = [
  { x: startingX, y: startingY },
  { x: startingX-1, y: startingY },
  { x: startingX-2, y: startingY }
];

let food = getRandomFoodPosition();
let gameSpeed = 50;
let headsEaten = 0;

function getRandomFoodPosition() {
  return {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight)
  };
}

function gameLoop() {
  setTimeout(() => {
    updateSnake();
    renderSnake();
    requestAnimationFrame(gameLoop);
  }, gameSpeed);
}

// Shuffle array function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let faceIndices = Array.from({length: 17}, (_, i) => i + 1);
shuffleArray(faceIndices);

function showModal(text) {
  document.getElementById('modalText').innerText = text;
  document.getElementById('modal').style.display = 'block';
  gameRunning = false; // Set gameRunning to false when showing the modal
}

document.getElementById('modalButton').addEventListener('click', function() {
  document.getElementById('modal').style.display = 'none';
  resetGame();
  gameRunning = true; // Set gameRunning to true when starting a new game
});

function updateSnake() {
  const head = { ...snake[0] }; // Copy of the head object
  switch (direction) {
    case 'up':    head.y -= 1; break;
    case 'down':  head.y += 1; break;
    case 'left':  head.x -= 1; break;
    case 'right': head.x += 1; break;
  }

  // Check for collision with wall
  if (head.x < 0 || head.x > gridWidth - 1 || head.y < 0 || head.y > gridHeight - 1) {
    backgroundMusic.pause();
    gameOverSound.play();
    showModal('Game Over');
    return;
  }

  // Check for collision with self
  if (checkSnakeCollision(head)) {
    backgroundMusic.pause();
    gameOverSound.play();
    showModal('Game Over');
    return;
  }

  snake.unshift(head); // Add new head to snake

  // Check if head is on the food
  if (head.x === food.x && head.y === food.y) {
    eatSound.play(); // Play eat sound
    food = getRandomFoodPosition(); // Get new food position
    headsEaten++;
    
    // Check for win condition
    if (headsEaten === 16) {
      backgroundMusic.pause();
      winSound.play();
      showModal('Congratulations! You win!');
      return;
    }
  } else {
    snake.pop(); // Remove the tail of the snake
  }
}

function checkSnakeCollision(head) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  snake.length = 0;
  startingX = Math.floor(gridWidth / 2);  // Start in the center of the grid on the X-axis
  startingY = Math.floor(gridHeight / 2); // Start in the center of the grid on the Y-axis

  const randDirection = Math.random();
  if (randDirection < 0.33) {
    direction = 'right';
    snake.push({ x: startingX-1, y: startingY });
    snake.push({ x: startingX-2, y: startingY });
  } else if (randDirection < 0.66) {
    direction = 'up';
    snake.push({ x: startingX, y: startingY+1 });
    snake.push({ x: startingX, y: startingY+2 });
  } else {
    direction = 'down';
    snake.push({ x: startingX, y: startingY-1 });
    snake.push({ x: startingX, y: startingY-2 });
  }

  food = getRandomFoodPosition();
  headsEaten = 0;
  shuffleArray(faceIndices);
   if (!backgroundMusic.ended) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
     }
  gameOverSound.pause();
  gameOverSound.currentTime = 0;
  winSound.pause();
  winSound.currentTime = 0;
 }

function renderSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
   snake.forEach((segment, index) => {
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;
    const image = new Image();
    image.src = 'face' + faceIndices[index % 17] + '.png';
    ctx.drawImage(image, x, y, gridSize, gridSize);
  });

  const foodImage = new Image();
  foodImage.src = 'food.png';
  ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

let musicStarted = false;

function startMusic() {
  if (!musicStarted) {
    backgroundMusic.play();
    musicStarted = true;
  }
}

function handleKeyPress(event) {
  if (!gameRunning) return; // Ignore key presses when game is not running
  const key = event.key;
  if (key === 'ArrowUp' && direction !== 'down') {
    direction = 'up';
  } else if (key === 'ArrowDown' && direction !== 'up') {
    direction = 'down';
  } else if (key === 'ArrowLeft' && direction !== 'right') {
    direction = 'left';
  } else if (key === 'ArrowRight' && direction !== 'left') {
    direction = 'right';
  }
  startMusic();
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && document.getElementById('modal').style.display !== 'none') {
    // If the Enter key is pressed and the modal is being displayed, start a new game
    document.getElementById('modalButton').click();
  }
});

document.addEventListener('keydown', handleKeyPress);

resetGame();
gameRunning = true; // Set gameRunning to true when starting the game
gameLoop();

const versionHistory = "Version 1.1.006";
document.getElementById('versionHistory').innerText = versionHistory;
