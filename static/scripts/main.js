const canvas = document.getElementById('goBoard');
const scoreCanvas = document.getElementById('scoreBoard');
const ctx = canvas.getContext('2d');
const scoreCtx = scoreCanvas.getContext('2d');

const boardSize = 5;
const borderSize = canvas.width / (boardSize + 1) * 0.6;
const cellSize = (canvas.width - 2 * borderSize) / (boardSize - 1);

function drawBoard() {
  ctx.fillStyle = '#DCB579';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;

  for (let i = 0; i < boardSize; i++) {
    ctx.moveTo(borderSize + i * cellSize, borderSize);
    ctx.lineTo(borderSize + i * cellSize, canvas.height - borderSize);
    
    ctx.moveTo(borderSize, borderSize + i * cellSize);
    ctx.lineTo(canvas.width - borderSize, borderSize + i * cellSize);
  }

  ctx.stroke();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(borderSize + 2 * cellSize, borderSize + 2 * cellSize, 3, 0, 2 * Math.PI);
  ctx.fill();

  // Add coordinates
  ctx.fillStyle = '#000000';
  ctx.font = `${cellSize * 0.3}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < boardSize; i++) {
    // Top and bottom coordinates (A, B, C, D, E)
    // ctx.fillText(String.fromCharCode(65 + i), borderSize + i * cellSize, borderSize / 2);
    ctx.fillText(String.fromCharCode(65 + i), borderSize + i * cellSize, canvas.height - borderSize / 2);

    // Left and right coordinates (1, 2, 3, 4, 5)
    ctx.fillText((boardSize - i).toString(), borderSize / 2, borderSize + i * cellSize);
    // ctx.fillText((boardSize - i).toString(), canvas.width - borderSize / 2, borderSize + i * cellSize);
  }
}

function drawStone(row, col, color, step) {
  const x = borderSize + col * cellSize;
  const y = borderSize + row * cellSize;
  const radius = cellSize / 2 - 2;

  const gradient = ctx.createRadialGradient(
    x - radius / 3, y - radius / 3, radius / 10,
    x, y, radius
  );

  if (color === 'black') {
    gradient.addColorStop(0, '#666');
    gradient.addColorStop(1, '#000');
  } else {
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, '#ccc');
  }

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();

  if (step !== null) {
    ctx.fillStyle = color === 'black' ? 'white' : 'black';
    ctx.font = `${radius * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(step.toString(), x, y);
  }
}

function displayScores(blackScore, whiteScore) {
  // Clear the score canvas
  scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

  // Set background color
  scoreCtx.fillStyle = '#DCB579';
  scoreCtx.fillRect(0, 0, scoreCanvas.width, scoreCanvas.height);

  scoreCtx.fillStyle = '#000000';
  scoreCtx.font = '18px Arial';
  scoreCtx.textAlign = 'left';
  scoreCtx.textBaseline = 'top';

  // scoreCtx.fillText('Scores:', 20, 20);
  scoreCtx.fillText(`Black: ${blackScore.toFixed(1)}`, 20, 60);
  scoreCtx.fillText(`White: ${whiteScore.toFixed(1)}`, 20, 100);
}

function calculateScores(board) {
  let blackScore = 0;
  let whiteScore = 0;

  for (let row of board) {
    for (let cell of row) {
        if (cell === 1) {  // Black stone
            blackScore += 1;
        } else if (cell === 2) {  // White stone
            whiteScore += 1;
        }
    }
  }

  // Add 2.5 points to white score
  whiteScore += 2.5;

  return [blackScore, whiteScore];
}

function animateBoardSequence(boardSequence) {
  let currentStep = 1;
  let stoneIndices = Array(boardSize).fill().map(() => Array(boardSize).fill(null));

  function drawFrame(index) {

    const board = boardSequence[index];
    const [blackScore, whiteScore] = calculateScores(boardSequence[index]);

    drawBoard();
    displayScores(blackScore, whiteScore);

    let newStoneFound = false;

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] !== 0) {
          if (stoneIndices[row][col] === null) {
            stoneIndices[row][col] = currentStep;
            newStoneFound = true;
          }
          drawStone(row, col, board[row][col] === 1 ? 'black' : 'white', stoneIndices[row][col]);
        }
        // clear the map of killed stones
        else {
          stoneIndices[row][col] = null;
        }
      }
    }

    if (newStoneFound) {
      currentStep++;
    }

    setTimeout(() => {
      if (index + 1 < boardSequence.length) {
        drawFrame(index + 1);
      } else {
        // Reset and start over
        currentStep = 1;
        stoneIndices = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
        drawFrame(0);
      }
    }, 1000);
  }

  drawFrame(0);
}


// Example usage:
const boardSequence = [
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 2, 2, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 2, 2, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 2, 2, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 2, 2, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 2, 2, 1, 2],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0]
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 2, 2, 1, 2],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 2, 0],
    [0, 0, 0, 1, 0]
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 2, 2, 1, 2],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 2, 0],
    [0, 0, 2, 1, 0]
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 2, 2, 1, 2],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 2, 0],
    [0, 1, 2, 1, 0]
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 2, 2, 1, 2],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 0, 0],
    [0, 2, 2, 1, 2],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 0, 0],
    [2, 2, 2, 1, 2],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 0, 0],
    [2, 2, 2, 1, 2],
    [0, 0, 1, 1, 1],
    [0, 0, 1, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 0, 0],
    [2, 2, 2, 1, 2],
    [0, 2, 1, 1, 1],
    [0, 0, 1, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 0, 1],
    [2, 2, 2, 1, 0],
    [0, 2, 1, 1, 1],
    [0, 0, 1, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 2, 1],
    [2, 2, 2, 1, 0],
    [0, 2, 1, 1, 1],
    [0, 0, 1, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 2, 1],
    [2, 2, 2, 1, 0],
    [0, 2, 1, 1, 1],
    [1, 0, 1, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 2, 0],
    [2, 2, 2, 1, 2],
    [0, 2, 1, 1, 1],
    [1, 0, 1, 2, 0],
    [0, 1, 2, 0, 2]
  ],
  [
    [0, 1, 0, 2, 0],
    [2, 2, 2, 1, 2],
    [0, 2, 1, 1, 1],
    [1, 0, 1, 2, 0],
    [0, 1, 0, 1, 2]
  ],
  [
    [2, 1, 0, 2, 0],
    [2, 2, 2, 1, 2],
    [0, 2, 1, 1, 1],
    [1, 0, 1, 2, 0],
    [0, 1, 0, 1, 2]
  ],
  [
    [2, 1, 0, 2, 0],
    [2, 2, 2, 1, 2],
    [0, 2, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0]
  ],
  [
    [2, 1, 0, 2, 0],
    [2, 2, 2, 1, 2],
    [0, 2, 1, 1, 1],
    [1, 2, 1, 0, 1],
    [0, 1, 0, 1, 0]
  ],
];

animateBoardSequence(boardSequence);
