/* 
Made by: https://github.com/Raxuis 
*/

const myCanvas = document.getElementById('myCanvas');
const context = myCanvas.getContext('2d');
const grid = 15;
const paddleWidth = grid * 5; // 75
const maxPaddleY = myCanvas.width - grid - paddleWidth;
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const lifeHTML = document.getElementById('life');
let lives = 3;

var paddleSpeed = 4;
var ballSpeed = 3;


const paddle = {
    // start in the middle of the game on the right side
    x: myCanvas.width / 2 - paddleWidth / 2,
    y: myCanvas.height - grid * 2,
    width: paddleWidth,
    height: grid,
    // paddle velocity
    dx: 0
};

const ball = {
    // start in the middle of the game
    x: myCanvas.width / 2,
    y: myCanvas.height / 2,
    width: grid,
    height: grid,

    // keep track of when need to reset the ball position
    resetting: false,

    // ball velocity (start going to the top-right corner)
    dx: ballSpeed,
    dy: -ballSpeed
};

// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/fr/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}
function update() {
    lifeHTML.innerHTML = `Lives : ${lives}`
}
// game loop
function loop() {
    if (lives >= 0) {
        requestAnimationFrame(loop);
        // RESET DRAW
        context.clearRect(0, 0, myCanvas.width, myCanvas.height);

        // move paddles by their velocity
        paddle.x += paddle.dx;

        // prevent paddles from going through walls
        if (paddle.x < grid) {
            paddle.x = grid;
        }
        else if (paddle.x > maxPaddleY) {
            paddle.x = maxPaddleY;
        }

        // draw paddles
        context.fillStyle = 'white';
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

        // move ball by its velocity
        ball.x += ball.dx;
        ball.y += ball.dy;

        // prevent ball from going through walls by changing its velocity
        if (ball.y < grid) {
            ball.y = grid;
            ball.dy *= -1;
        }
        else if (ball.x < 0) {
            ball.x = grid
            ball.dx *= -1;
        } else if (ball.x > myCanvas.width - grid) {
            ball.x = myCanvas.width - grid;
            ball.dx *= -1;
        }

        // reset ball if it goes past paddle (but only if we haven't already done so)
        if (ball.y > myCanvas.height && !ball.resetting) {
            lives--;
            wait = true
            resetGame(wait);
        }

        // check to see if ball collides with paddle. if they do change x velocity
        if (collides(ball, paddle)) {
            ball.dy *= -1;

            // move ball next to the paddle otherwise the collision will happen again
            // in the next frame
            ball.y = paddle.y - ball.height;
        }

        // draw ball
        context.fillRect(ball.x, ball.y, ball.width, ball.height);

        // draw walls
        context.fillStyle = 'lightgrey';
        context.fillRect(0, 0, grid, myCanvas.height);
        context.fillRect(0, 0, myCanvas.width, grid);
        context.fillRect(myCanvas.width - grid, 0, grid, myCanvas.height);
    } else {
        location.reload();
    }


}

// listen to keyboard events to move the paddles
document.addEventListener('keydown', function (e) {

    // up arrow key
    if (e.which === 37) {
        paddle.dx = -paddleSpeed;
    }
    // down arrow key
    else if (e.which === 39) {
        paddle.dx = paddleSpeed;
    }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener('keyup', function (e) {
    if (e.which === 39 || e.which === 37) {
        paddle.dx = 0;
    }
});

// start the game
startButton.addEventListener('click', () => {
    lifeHTML.innerHTML = `Lives : ${lives}`
    startButton.disabled = true;
    requestAnimationFrame(loop);
})
resetButton.addEventListener('click', () => {
    wait = false
    resetGame(wait);
})
function resetGame(wait) {
    ball.resetting = true;

    // give some time for the player to recover before launching the ball again
    if (wait) {
        setTimeout(() => {
            ball.resetting = false;
            ball.x = myCanvas.width / 2;
            ball.y = myCanvas.height / 2;
        }, 2000);
    } else {
        lives = 3;
        ball.resetting = false;
        ball.x = myCanvas.width / 2;
        ball.y = myCanvas.height / 2;
    }
    update();
}
document.addEventListener('keyup', (e) => {
    switch (e.which) {
        case 8:
            location.reload();
            break;
        case 16:
            ball.dx *= -1;
            break;
        case 9:
            ball.dy *= -1;
            break;
        case 13:
            ball.x = Math.random() < 0.5 ? myCanvas.width / (4 + Math.floor(Math.random() * 2)) : myCanvas.width * 3 / 4 + Math.floor(Math.random() * 2);
            ball.y = Math.random() < 0.5 ? myCanvas.height / (4 + Math.floor(Math.random() * 2)) : myCanvas.height * 3 / 4 + Math.floor(Math.random() * 2);
            ball.dx *= Math.random() < 0.5 ? 1 : -1;
            ball.dy *= Math.random() < 0.5 ? 1 : -1;
            break;

    }
});