const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 50;
const gridWidth = Math.floor(canvas.width / gridSize);
const gridHeight = Math.floor(canvas.height / gridSize);

let startingX = Math.floor(Math.random() * gridWidth);
let startingY = Math.floor(Math.random() * gridHeight);

let direction;
if (startingX < gridWidth / 2) {
  direction = 'right';
} else {
  direction = 'left';
}
if (startingY < gridHeight / 2) {
  direction = direction === 'right' ? 'down' : 'up';
} else {
  direction = direction === 'right' ? 'up' : 'down';
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

function updateSnake() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':    head.y -= 1; break;
    case 'down':  head.y += 1; break;
    case 'left':  head.x -= 1; break;
    case 'right': head.x += 1; break;
  }

  if (head.x < 0 || head.x > gridWidth - 1 || head.y < 0 || head.y > gridHeight - 1) {
    alert('Game Over');
    resetGame();
    return;
  }

  if (checkSnakeCollision(head)) {
    alert('Game Over');
    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = getRandomFoodPosition();
    headsEaten++;
    if (headsEaten === 18) {
      alert('Congratulations! You win!');
      resetGame();
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
  snake.length = 0;
  startingX = Math.floor(Math.random() * gridWidth);
  startingY = Math.floor(Math.random() * gridHeight);
  if (startingX < gridWidth / 2) {
    direction = 'right';
  } else {
    direction = 'left';
  }
  if (startingY < gridHeight / 2) {
    direction = direction === 'right' ? 'down' : 'up';
  } else {
    direction = direction === 'right' ? 'up' : 'down';
  }
  snake.push({ x: startingX, y: startingY });
  snake.push({ x: startingX-1, y: startingY });
  snake.push({ x: startingX-2, y: startingY });
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
    image.src = face' + faceIndices[index % 17] + '.png';
    ctx.drawImage(image, x, y, gridSize, gridSize);
  });

  const foodImage = new Image();
  foodImage.src = food.png';
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
