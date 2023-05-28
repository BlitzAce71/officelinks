const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 50;
const gridWidth = Math.floor(canvas.width / gridSize);
const gridHeight = Math.floor(canvas.height / gridSize);

let startingX, startingY, direction;

function checkInitialCollision(startingX, startingY, direction) {
  switch (direction) {
    case 'up': return startingY === 0;
    case 'down': return startingY === gridHeight - 1;
    case 'left': return startingX === 0;
    case 'right': return startingX === gridWidth - 1;
    default: return false;
  }
}

function isWallCollision(x, y, direction) {
  switch (direction) {
    case 'up': return y <= 0;
    case 'down': return y >= gridHeight - 1;
    case 'left': return x <= 0;
    case 'right': return x >= gridWidth - 1;
  }
}

function isSelfCollision(x, y, direction) {
  const nextHead = getNextHeadPosition(x, y, direction);
  for (let i = 0; i < snake.length; i++) {
    if (nextHead.x === snake[i].x && nextHead.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function getNextHeadPosition(x, y, direction) {
  switch (direction) {
    case 'up': return { x, y: y - 1 };
    case 'down': return { x, y: y + 1 };
    case 'left': return { x: x - 1, y };
    case 'right': return { x: x + 1, y };
  }
}

function resetGame() {
  snake.length = 0;

  do {
    startingX = Math.floor(Math.random() * ((gridWidth / 2) - 2)) + 1;
    startingY = Math.floor(Math.random() * (gridHeight - 2)) + 1;
    if (startingY < gridHeight / 2) {
      direction = Math.random() < 0.5 ? 'right' : 'down';
    } else {
      direction = Math.random() < 0.5 ? 'right' : 'up';
    }
  } while (checkInitialCollision(startingX, startingY, direction));

  // Body of the snake is set after determining the direction
  snake.push({ x: startingX, y: startingY });

  if (direction === 'right') {
    snake.push({ x: startingX-1, y: startingY });
    snake.push({ x: startingX-2, y: startingY });
  } else if (direction === 'up') {
    snake.push({ x: startingX, y: startingY+1 });
    snake.push({ x: startingX, y: startingY+2 });
  } else if (direction === 'down') {
    snake.push({ x: startingX, y: startingY-1 });
    snake.push({ x: startingX, y: startingY-2 });
  }

  food = getRandomFoodPosition();
  headsEaten = 0;
  shuffleArray(faceIndices);
}

function renderSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

function handleKeyPress(event) {
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
}

document.addEventListener('keydown', handleKeyPress);

resetGame();
gameLoop();
