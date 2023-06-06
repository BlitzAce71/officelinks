let theme = 'default';
let directionChangeLock = false;
let gameLoopTimeout;
function getSoundFilePath(soundName) {
  return theme + '/' + soundName + '.mp3';
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
const backgroundMusic = getSound('backgroundMusic');
backgroundMusic.loop = true;
const eatSound = getSound('eatSound');
const gameOverSound = getSound('lose');
const winSound = getSound('win');
const themeSelect = document.getElementById('themeSelect');


themeSelect.addEventListener('change', function(event) {
  theme = event.target.value;

  sounds['backgroundMusic'].src = theme + '/backgroundMusic.mp3';
  sounds['backgroundMusic'].load();

  sounds['eatSound'].src = theme + '/eatSound.mp3';
  sounds['eatSound'].load();

  sounds['lose'].src = theme + '/lose.mp3';
  sounds['lose'].load();

  sounds['win'].src = theme + '/win.mp3';
  sounds['win'].load();

  backgroundImage.src = theme + '/background.png';
  backgroundImage.onload = function() {
    renderSnake();
  };
});

backgroundImage.src = theme + '/background.png';
backgroundMusic.src = theme + '/backgroundMusic.mp3';
eatSound.src = theme + '/eatSound.mp3';
gameOverSound.src = theme + '/lose.mp3';
winSound.src = theme + '/win.mp3';

const canvas = document.getElementById('gameCanvas');
let gridSize = Math.min(Math.floor(window.innerWidth / 24), Math.floor(window.innerHeight / 24));
if (gridSize > 50) gridSize = 50;
canvas.width = gridSize * 20; 
canvas.height = gridSize * 20; 
const gridWidth = Math.floor(canvas.width / gridSize);
const gridHeight = Math.floor(canvas.height / gridSize);
const ctx = canvas.getContext('2d');
let gameRunning = false;
let isGameOver = false;


let startingX = Math.floor(gridWidth / 2);
let startingY = Math.floor(gridHeight / 2);
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
  let position;

  while (position == null || checkSnakeCollision(position)) {
    position = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
  }

  return position;
}

function gameLoop() {
  if (!isGameOver) {
    updateSnake();
    renderSnake();
  }
  gameLoopTimeout = setTimeout(() => {
    if (!isGameOver) {
      requestAnimationFrame(gameLoop);
    }
  }, gameSpeed);
}

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
  gameRunning = false; 
  isGameOver = true; 
}


let directionQueue = [];

function updateSnake() {
  if (directionQueue.length > 0) {
    direction = directionQueue.shift();
  }

  const head = { ...snake[0] }; 
  switch (direction) {
    case 'up':    head.y -= 1; break;
    case 'down':  head.y += 1; break;
    case 'left':  head.x -= 1; break;
    case 'right': head.x += 1; break;
  }

  if (head.x < 0 || head.x > gridWidth - 1 || head.y < 0 || head.y > gridHeight - 1) {
    backgroundMusic.pause();
    playSound('lose');
    showModal('Game Over');
    return;
  }

  if (checkSnakeCollision(head)) {
    backgroundMusic.pause();
    playSound('lose');
    showModal('Game Over');
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    playSound('eatSound');
    food = getRandomFoodPosition();
    headsEaten++;
	document.getElementById('foodRemaining').innerText = 'Remaining: ' + (16 - headsEaten);
    
  if (headsEaten === 16) {
      backgroundMusic.pause();
      playSound('win');
      showModal('Congratulations! You win!');
      return;
    }
  } else {
    snake.pop();
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
  startingX = Math.floor(gridWidth / 2);  
  startingY = Math.floor(gridHeight / 2); 

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
  if (!gameRunning) return; 
  const key = event.key;
  let newDirection = null;
  if (key === 'ArrowUp' && direction !== 'down') {
    newDirection = 'up';
  } else if (key === 'ArrowDown' && direction !== 'up') {
    newDirection = 'down';
  } else if (key === 'ArrowLeft' && direction !== 'right') {
    newDirection = 'left';
  } else if (key === 'ArrowRight' && direction !== 'left') {
    newDirection = 'right';
  }

  if (newDirection) {
    if (directionQueue.length > 0) {
      const lastQueuedDirection = directionQueue[directionQueue.length - 1];
      if ((newDirection === 'up' && lastQueuedDirection === 'down') ||
          (newDirection === 'down' && lastQueuedDirection === 'up') ||
          (newDirection === 'left' && lastQueuedDirection === 'right') ||
          (newDirection === 'right' && lastQueuedDirection === 'left')) {
        directionQueue[directionQueue.length - 1] = newDirection;
      } else {
        directionQueue.push(newDirection);
      }
    } else {
      if ((newDirection === 'up' && direction === 'down') ||
          (newDirection === 'down' && direction === 'up') ||
          (newDirection === 'left' && direction === 'right') ||
          (newDirection === 'right' && direction === 'left')) {
      return;
      } else {
      directionQueue.push(newDirection);
      }
    }
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

  if (Math.max(absX, absY) > 10) {
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


let keyPressed = null;

window.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
	event.preventDefault();
    keyPressed = key;
  }
});

window.addEventListener('keyup', () => {
  if (keyPressed === 'ArrowUp' && direction !== 'down') {
    directionQueue.push('up');
  } else if (keyPressed === 'ArrowDown' && direction !== 'up') {
    directionQueue.push('down');
  } else if (keyPressed === 'ArrowLeft' && direction !== 'right') {
    directionQueue.push('left');
  } else if (keyPressed === 'ArrowRight' && direction !== 'left') {
    directionQueue.push('right');
  }
  keyPressed = null;
});

canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
});

canvas.addEventListener('click', function(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left; 
    const y = event.clientY - rect.top;  
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (Math.abs(x - centerX) > Math.abs(y - centerY)) {
        if (x < centerX && direction !== 'right') {
            direction = 'left';
        } else if (x > centerX && direction !== 'left') {
            direction = 'right';
        }
    } else {
        if (y < centerY && direction !== 'down') {
            direction = 'up';
        } else if (y > centerY && direction !== 'up') {
            direction = 'down';
        }
    }
});

const INITIAL_GAME_SPEED = 100;

document.getElementById('modalButton').addEventListener('click', function() {
  let difficultyMultiplier;

  switch (document.getElementById('difficultySelect').value) {
    case 'easy': difficultyMultiplier = 1.0; break;
    case 'medium': difficultyMultiplier = 0.75; break;
    case 'hard': difficultyMultiplier = 0.5; break;
    default: difficultyMultiplier = 1.0; break;
  }

  gameSpeed = INITIAL_GAME_SPEED * difficultyMultiplier; 
  if (isMobile) {
    gameSpeed *= 1.5; 
  }

  document.getElementById('modal').style.display = 'none';
  resetGame();
  gameRunning = true; 

  if (gameLoopTimeout) {
  clearTimeout(gameLoopTimeout);
}
gameLoop();
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && document.getElementById('modal').style.display !== 'none') {
    document.getElementById('modalButton').click();
  }
});

document.addEventListener('keydown', handleKeyPress);

showModal('Welcome to Office Slinks!');

const versionHistory = "Version 1.2.006";
document.getElementById('versionHistory').innerText = versionHistory;