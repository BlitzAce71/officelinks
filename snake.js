let theme = 'default';

function getSoundFilePath(soundName) {
  return theme + '/' + soundName + '.mp3';
}
function playSound(soundName) {
  let audio = new Audio(getSoundFilePath(soundName));
  audio.play();
}
let sounds = {};

function getSound(soundName) {
  if (!sounds[soundName]) {
    sounds[soundName] = new Audio(getSoundFilePath(soundName));
  }
  return sounds[soundName];
}

function playSound(soundName) {
  getSound(soundName).play();
}

function stopSound(soundName) {
  let sound = getSound(soundName);
  sound.pause();
  sound.currentTime = 0;
}

const backgroundImage = new Image();
const backgroundMusic = new Audio();
backgroundMusic.loop = true; // The background music should loop
const eatSound = new Audio();
const gameOverSound = new Audio();
const winSound = new Audio();
// Get the theme select element from the DOM
const themeSelect = document.getElementById('themeSelect');

// Add an event listener to the theme select element
themeSelect.addEventListener('change', function(event) {
  // Update the theme variable with the selected value
  theme = event.target.value;

  backgroundMusic.src = theme + '/backgroundMusic.mp3';
  backgroundMusic.load();

  eatSound.src = theme + '/eatSound.mp3';
  eatSound.load();

  gameOverSound.src = theme + '/lose.mp3';
  gameOverSound.load();

  winSound.src = theme + '/win.mp3';
  winSound.load();

  backgroundImage.src = theme + '/background.png';
  backgroundImage.load();
});

// This part is set to default theme
backgroundImage.src = theme + '/background.png';
backgroundMusic.src = theme + '/backgroundMusic.mp3';
eatSound.src = theme + '/eatSound.mp3';
gameOverSound.src = theme + '/lose.mp3';
winSound.src = theme + '/win.mp3';

const canvas = document.getElementById('gameCanvas');
let gridSize = Math.min(Math.floor(window.innerWidth / 24), Math.floor(window.innerHeight / 24));
if (gridSize > 50) gridSize = 50; // Limit the grid size for large screens
canvas.width = gridSize * 20; // 20 cells wide
canvas.height = gridSize * 20; // 20 cells high
const gridWidth = Math.floor(canvas.width / gridSize);
const gridHeight = Math.floor(canvas.height / gridSize);
const ctx = canvas.getContext('2d');
let gameRunning = false;
let isGameOver = false;


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

let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let headsEaten = 0;

function getRandomFoodPosition() {
  return {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight)
  };
}

function gameLoop() {
  if (!isGameOver) {
    updateSnake();
    renderSnake();
  }
  setTimeout(() => {
    if (!isGameOver) {
      requestAnimationFrame(gameLoop);
    }
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
  isGameOver = true; // Set isGameOver to true
}




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
    playSound('lose');
    showModal('Game Over');
    return;
  }

  // Check for collision with self
  if (checkSnakeCollision(head)) {
    backgroundMusic.pause();
    playSound('lose');
    showModal('Game Over');
    return;
  }

  snake.unshift(head); // Add new head to snake

  // Check if head is on the food
  if (head.x === food.x && head.y === food.y) {
    playSound('eatSound'); // Play eat sound
    food = getRandomFoodPosition(); // Get new food position
    headsEaten++;
	document.getElementById('foodRemaining').innerText = 'Remaining: ' + (16 - headsEaten);
    
    // Check for win condition
    if (headsEaten === 16) {
      backgroundMusic.pause();
      playSound('win');
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
  isGameOver = false;
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
	snake.unshift({ x: startingX, y: startingY });
  food = getRandomFoodPosition();
  headsEaten = 0;
  shuffleArray(faceIndices);
   if (!backgroundMusic.ended) {
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
     }
	   // stop win and lose sounds
  stopSound('win');
  stopSound('lose');
   document.getElementById('foodRemaining').innerText = 'Food Remaining: 16';
 }

function renderSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
   snake.forEach((segment, index) => {
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;
    const image = new Image();
    image.src = theme + '/face' + faceIndices[index % 17] + '.png';
    ctx.drawImage(image, x, y, gridSize, gridSize);
  });

  const foodImage = new Image();
  foodImage.src = theme + '/food.png';
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

let touchStartX = null;
let touchStartY = null;

document.body.addEventListener('touchstart', function(event) {
  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
});

document.body.addEventListener('touchend', function(event) {
  if (!touchStartX || !touchStartY) return;
  let dx = event.changedTouches[0].clientX - touchStartX;
  let dy = event.changedTouches[0].clientY - touchStartY;
  let absX = Math.abs(dx);
  let absY = Math.abs(dy);

  if (Math.max(absX, absY) > 10) { // If the swipe distance is less than 10px, ignore it
    if (absX > absY) {
      if (dx > 0 && direction !== 'left') {
        direction = 'right';
      } else if (dx < 0 && direction !== 'right') {
        direction = 'left';
      }
    } else {
      if (dy > 0 && direction !== 'up') {
        direction = 'down';
      } else if (dy < 0 && direction !== 'down') {
        direction = 'up';
      }
    }
  }

  touchStartX = null;
  touchStartY = null;
});


window.addEventListener('keydown', function(e) {
  if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
});

canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
});

canvas.addEventListener('click', function(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; //x position within the element
    const y = event.clientY - rect.top;  //y position within the element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (Math.abs(x - centerX) > Math.abs(y - centerY)) {
        // The click was closer to the horizontal axis, so move left or right
        if (x < centerX && direction !== 'right') {
            direction = 'left';
        } else if (x > centerX && direction !== 'left') {
            direction = 'right';
        }
    } else {
        // The click was closer to the vertical axis, so move up or down
        if (y < centerY && direction !== 'down') {
            direction = 'up';
        } else if (y > centerY && direction !== 'up') {
            direction = 'down';
        }
    }
});

const INITIAL_GAME_SPEED = 100;

// In your event listener for the modalButton
document.getElementById('modalButton').addEventListener('click', function() {
  let difficultyMultiplier;

  switch (document.getElementById('difficultySelect').value) {
    case 'easy': difficultyMultiplier = 1.0; break;
    case 'medium': difficultyMultiplier = 0.75; break;
    case 'hard': difficultyMultiplier = 0.5; break;
    default: difficultyMultiplier = 1.0; break; // Default to 'easy'
  }

  gameSpeed = INITIAL_GAME_SPEED * difficultyMultiplier; // Adjust to the speed you want based on difficulty
  if (isMobile) {
    gameSpeed *= 1.5; // Make the game speed easier on mobile
  }

  document.getElementById('modal').style.display = 'none';
  resetGame();
  gameRunning = true; // Set gameRunning to true when starting a new game

  // Start the game loop
  gameLoop();
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && document.getElementById('modal').style.display !== 'none') {
    // If the Enter key is pressed and the modal is being displayed, start a new game
    document.getElementById('modalButton').click();
  }
});

document.addEventListener('keydown', handleKeyPress);

// start the game using the modal instead of immediately
showModal('Welcome to Office Slinks!');

const versionHistory = "Version 1.2.001";
document.getElementById('versionHistory').innerText = versionHistory;