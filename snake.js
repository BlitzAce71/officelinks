const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 50;
const gridWidth = Math.floor(canvas.width / gridSize);
const gridHeight = Math.floor(canvas.height / gridSize);

let startingX = Math.floor(gridWidth / 2);  // Start in the center of the grid on the X-axis
let startingY = Math.floor(gridHeight / 2); // Start in the center of the grid on the Y-axis
let snakeFaces = [1, 2, 3]; // Add this line at the top of your code where you declare your variables

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

let faceIndices = Array.from({length: 17}, (_, i) => i + 1);
shuffleArray(faceIndices);

let food = { position: getRandomFoodPosition(), faceIndex: getFaceIndex() };
let gameSpeed = 50;
let headsEaten = 0;

function getRandomFoodPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
  } while (checkSnakeCollision(position)); // keep generating if the food would appear on the snake

  return position;
}

function getRandomFoodPosition() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };
  } while (checkSnakeCollision(position)); // keep generating if the food would appear on the snake

  return position;
}

function getFaceIndex() {
  const faceIndex = faceIndices.pop(); // get the face index from the shuffled faceIndices
  return faceIndex;
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

function updateSnake() {
  const head = { ...snake[0] }; // the new head segment
  const newFaceIndex = snakeFaces[0]; // the face index for the new head segment will be the same as the current head

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

  if (checkSnakeCollision(head, false)) {
    alert('Game Over');
    resetGame();
    return;
  }

  snake.unshift(head);
  snakeFaces.unshift(newFaceIndex); // add the new face index to the snakeFaces

  if (head.x === food.position.x && head.y === food.position.y) {
    snakeFaces[0] = food.faceIndex; // update the face index of the head segment to the eaten food face
    food = { position: getRandomFoodPosition(), faceIndex: getFaceIndex() };
    headsEaten++;
    if (headsEaten === 16) {
      alert('Congratulations! You win!');
      resetGame();
      return;
    }
  } else {
    snake.pop();
    snakeFaces.pop(); // remove the last face index when the snake's tail is removed
  }
}

function checkSnakeCollision(position, includeHead = true) {
  for (let i = includeHead ? 0 : 1; i < snake.length; i++) {
    if (snake[i].x === position.x && snake[i].y === position.y) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  snake.length = 0;

  startingX = Math.floor(gridWidth / 2);
  startingY = Math.floor(gridHeight / 2);

  const randDirection = Math.random();
  if (randDirection < 0.33) {
    direction = 'right';
    snake.push({ x: startingX, y: startingY });
    snake.push({ x: startingX-1, y: startingY });
    snake.push({ x: startingX-2, y: startingY });
    snakeFaces = [1, 2, 3];
  } else if (randDirection < 0.66) {
    direction = 'up';
    snake.push({ x: startingX, y: startingY });
    snake.push({ x: startingX, y: startingY+1 });
    snake.push({ x: startingX, y: startingY+2 });
    snakeFaces = [2, 3, 4];
  } else {
    direction = 'down';
    snake.push({ x: startingX, y: startingY });
    snake.push({ x: startingX, y: startingY-1 });
    snake.push({ x: startingX, y: startingY-2 });
    snakeFaces = [3, 4, 5];
  }

  food = { position: getRandomFoodPosition(), faceIndex: getFaceIndex() };
  headsEaten = 0;
  shuffleArray(faceIndices);
}

function renderSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    const x = segment.x * gridSize;
    const y = segment.y * gridSize;
    const image = new Image();
    image.src = 'face' + snakeFaces[index] + '.png'; // use snakeFaces to set the source
    ctx.drawImage(image, x, y, gridSize, gridSize);
  });

  const foodImage = new Image();
  foodImage.src = 'face' + food.faceIndex + '.png'; // draw the face that is currently food
  ctx.drawImage(foodImage, food.position.x * gridSize, food.position.y * gridSize, gridSize, gridSize);
}

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':    direction = 'up'; break;
    case 'ArrowDown':  direction = 'down'; break;
    case 'ArrowLeft':  direction = 'left'; break;
    case 'ArrowRight': direction = 'right'; break;
  }
});

resetGame();
gameLoop();

const versionHistory = "Version 1.0.012 ";
document.getElementById('versionHistory').innerText = versionHistory;
