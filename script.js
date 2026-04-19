const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 8;

let playerScore = 0;
let computerScore = 0;

// Player paddle
const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Computer paddle
const computerPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 4.5
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: 5,
    dy: 5,
    speed: 5
};

// Input handling
const keys = {};
let mouseY = canvas.height / 2;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Update player paddle position
function updatePlayerPaddle() {
    // Use mouse position or arrow keys
    if (keys['ArrowUp']) {
        playerPaddle.dy = -playerPaddle.speed;
    } else if (keys['ArrowDown']) {
        playerPaddle.dy = playerPaddle.speed;
    } else {
        // Use mouse Y position
        const targetY = mouseY - playerPaddle.height / 2;
        const distance = targetY - playerPaddle.y;
        if (Math.abs(distance) > 5) {
            playerPaddle.dy = distance > 0 ? playerPaddle.speed : -playerPaddle.speed;
        } else {
            playerPaddle.dy = 0;
        }
    }

    playerPaddle.y += playerPaddle.dy;

    // Boundary collision for player paddle
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    }
    if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

// Update computer paddle position (AI)
function updateComputerPaddle() {
    const computerCenter = computerPaddle.y + computerPaddle.height / 2;
    const ballCenter = ball.y;
    const difference = ballCenter - computerCenter;

    // Simple AI: move towards the ball
    if (difference < -35) {
        computerPaddle.y -= computerPaddle.speed;
    } else if (difference > 35) {
        computerPaddle.y += computerPaddle.speed;
    }

    // Boundary collision for computer paddle
    if (computerPaddle.y < 0) {
        computerPaddle.y = 0;
    }
    if (computerPaddle.y + computerPaddle.height > canvas.height) {
        computerPaddle.y = canvas.height - computerPaddle.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        // Prevent ball from getting stuck
        ball.y = ball.y - ball.size < 0 ? ball.size : canvas.height - ball.size;
    }

    // Paddle collision detection
    // Player paddle
    if (
        ball.x - ball.size < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = playerPaddle.x + playerPaddle.width + ball.size;
        // Add spin based on paddle movement
        ball.dy += playerPaddle.dy * 0.2;
    }

    // Computer paddle
    if (
        ball.x + ball.size > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computerPaddle.x - ball.size;
        // Add spin based on paddle movement
        ball.dy += (computerPaddle.y + computerPaddle.height / 2 - ball.y) * 0.1;
    }

    // Left and right wall collision (scoring)
    if (ball.x - ball.size < 0) {
        computerScore++;
        resetBall();
    }
    if (ball.x + ball.size > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Update score display
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawCenterLine();
    drawPaddle(playerPaddle);
    drawPaddle(computerPaddle);
    drawBall();
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();