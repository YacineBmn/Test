// tetris.js
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

// Taille d'une cellule dans le jeu
const ROWS = 20;
const COLS = 10;
const SQUARE_SIZE = 30;
const COLORS = [
    'red', 'blue', 'green', 'yellow', 'purple', 'cyan', 'orange'
];

const TETROMINOS = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let tetromino = generateTetromino();
let x = Math.floor(COLS / 2) - 1;
let y = 0;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== 0) {
                ctx.fillStyle = COLORS[board[row][col] - 1];
                ctx.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                ctx.strokeRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}

function drawTetromino() {
    ctx.fillStyle = COLORS[tetromino.color - 1];
    for (let row = 0; row < tetromino.shape.length; row++) {
        for (let col = 0; col < tetromino.shape[row].length; col++) {
            if (tetromino.shape[row][col]) {
                ctx.fillRect((x + col) * SQUARE_SIZE, (y + row) * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                ctx.strokeRect((x + col) * SQUARE_SIZE, (y + row) * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}

function generateTetromino() {
    const randIndex = Math.floor(Math.random() * TETROMINOS.length);
    return {
        shape: TETROMINOS[randIndex],
        color: randIndex + 1
    };
}

function rotateTetromino() {
    const newShape = [];
    for (let row = 0; row < tetromino.shape[0].length; row++) {
        const newRow = [];
        for (let col = 0; col < tetromino.shape.length; col++) {
            newRow.push(tetromino.shape[tetromino.shape.length - col - 1][row]);
        }
        newShape.push(newRow);
    }
    return { shape: newShape, color: tetromino.color };
}

function isValidMove(newX, newY, newShape) {
    for (let row = 0; row < newShape.length; row++) {
        for (let col = 0; col < newShape[row].length; col++) {
            if (newShape[row][col]) {
                const newRow = newY + row;
                const newCol = newX + col;
                if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS || board[newRow][newCol]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placeTetromino() {
    for (let row = 0; row < tetromino.shape.length; row++) {
        for (let col = 0; col < tetromino.shape[row].length; col++) {
            if (tetromino.shape[row][col]) {
                board[y + row][x + col] = tetromino.color;
            }
        }
    }

    // Check for complete lines
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }

    // Generate a new tetromino
    tetromino = generateTetromino();
    x = Math.floor(COLS / 2) - 1;
    y = 0;
}

function update() {
    if (isValidMove(x, y + 1, tetromino.shape)) {
        y++;
    } else {
        placeTetromino();
    }

    drawBoard();
    drawTetromino();
}

function moveTetromino(event) {
    if (event.key === 'ArrowLeft' && isValidMove(x - 1, y, tetromino.shape)) {
        x--;
    } else if (event.key === 'ArrowRight' && isValidMove(x + 1, y, tetromino.shape)) {
        x++;
    } else if (event.key === 'ArrowDown') {
        if (isValidMove(x, y + 1, tetromino.shape)) {
            y++;
        } else {
            placeTetromino();
        }
    } else if (event.key === 'ArrowUp') {
        const rotatedTetromino = rotateTetromino();
        if (isValidMove(x, y, rotatedTetromino.shape)) {
            tetromino = rotatedTetromino;
        }
    }
}

document.addEventListener('keydown', moveTetromino);

setInterval(update, 500);
