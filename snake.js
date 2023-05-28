const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 50;
const gridWidth = Math.floor(canvas.width / gridSize);   // Adjust this line
const gridHeight = Math.floor(canvas.height / gridSize); // Adjust this line


const snake = [
  { x: 10, y: 10 },
  { x: 20, y: 10 },
  { x: 30, y: 10 }
];

let direction = 'right';
let food = getRandomFoodPosition();
let gameSpeed = 500;
let headsEaten = 0; // Counter for the number of heads eaten

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

function updateSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }

  // Check for collision with walls
  if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
    alert('Game Over');
    resetGame();
    return; // Exit the function to prevent further updates after game over
  }

  // Check for collision with snake's body
  if (checkSnakeCollision()) {
    alert('Game Over');
    resetGame();
    return; // Exit the function to prevent further updates after game over
  }

  snake.unshift(head);

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    if (headsEaten === 17) {
      // Win condition: All 17 heads eaten and one more piece of food eaten
      alert('Congratulations! You win!');
      resetGame();
      return; // Exit the function to prevent further updates after winning
    } else {
      food = getRandomFoodPosition();
      headsEaten++; // Increment the headsEaten counter
    }
  } else {
    snake.pop();
  }
}


function checkSnakeCollision() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  snake.length = 0;
  snake.push({ x: 10, y: 10 });
  snake.push({ x: 20, y: 10 });
  snake.push({ x: 30, y: 10 });
  direction = 'right';
  food = getRandomFoodPosition();
  headsEaten = 0; // Reset the headsEaten counter
  renderSnake();
}

function renderSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;
    const image = new Image();
    image.src = 'C:/Users/TW043766/OneDrive - Cerner Corporation/Desktop/Discord/ol/snake/face' + (index % 17) + '.png';
    ctx.drawImage(image, x, y, gridSize, gridSize);
  });

  const foodImage = new Image();
  foodImage.src = 'C:/Users/TW043766/OneDrive - Cerner Corporation/Desktop/Discord/ol/snake/food.png';
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
