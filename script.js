let board;
let boardColor;
let context;
let rows;
let columns;
let tileSize;
let width;
let height;
let foodX;
let foodY;
let snakeBody;
let velocityX = 0;
let velocityY = 0;
let isPlaying = false;
let directionChanged = false;

let snakeHeadUp;
let snakeHeadDown;
let snakeHeadLeft;
let snakeHeadRight;

let snakeBodyHorizontal;
let snakeBodyVertical;


let snakeTailUp;
let snakeTailDown;
let snakeTailLeft;
let snakeTailRight;


let snakeMidBodyRightDown;
let snakeMidBodyDownLeft;
let snakeMidBodyLeftUp;
let snakeMidBodyUpRight;

let gameOver = false;
let score = 0;

let pause = false;

window.onload = async () => {
    tileSize = 25;
    rows = 25;
    columns = 25;

    boardColor = "lightGreen";//"rgba(0, 0, 0, 0.5)"; //"lightGreen";

    height = rows * tileSize;
    width = columns * tileSize;


    board = document.getElementById("board");
    board.height = height;
    board.width = width;

    context = board.getContext('2d');

    snakeBody = [
        { x: (tileSize * 2), y: 0 },
        { x: (tileSize), y: 0 },
        { x: 0, y: 0 },
    ];

    let foodXY = getFoodXY();
    foodY = foodXY[1];
    foodX = foodXY[0];

    // update();
    await loadImages();


    draw();

    document.addEventListener("keyup", changeDirection)
}

function loadImages() {

    // Head
    snakeHeadUp = new Image();
    snakeHeadUp.src = "./images/Snake head up.png";

    snakeHeadDown = new Image();
    snakeHeadDown.src = "./images/Snake head down.png";

    snakeHeadLeft = new Image();
    snakeHeadLeft.src = "./images/Snake head left.png";

    snakeHeadRight = new Image();
    snakeHeadRight.src = "./images/Snake head right.png";


    // Mid Body

    snakeBodyHorizontal = new Image();
    snakeBodyHorizontal.src = "./images/Snake body horizontal.png";

    snakeBodyVertical = new Image();
    snakeBodyVertical.src = "./images/Snake body vertical.png";


    // Mid Body Turns

    snakeMidBodyRightDown = new Image();
    snakeMidBodyRightDown.src = "./Images/Snake Mid Body Right Down.png";

    snakeMidBodyDownLeft = new Image();
    snakeMidBodyDownLeft.src = "./Images/Snake Mid Body Down Left.png";

    snakeMidBodyLeftUp = new Image();
    snakeMidBodyLeftUp.src = "./Images/Snake Mid Body Left Up.png";

    snakeMidBodyUpRight = new Image();
    snakeMidBodyUpRight.src = "./Images/Snake Mid Body Up Right.png";

    // Tail

    snakeTailUp = new Image();
    snakeTailUp.src = "./images/Snake tail up.png";

    snakeTailDown = new Image();
    snakeTailDown.src = "./images/Snake tail down.png";

    snakeTailLeft = new Image();
    snakeTailLeft.src = "./images/Snake tail left.png";

    snakeTailRight = new Image();
    snakeTailRight.src = "./images/Snake tail right.png";

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ status: 'ok' })
        }, 50)
    });
}


function changeDirection(event) {
    const code = event.code;


    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(code)) {
        event.preventDefault();
    }

    if (code === 'Space') {
        if (!gameOver) {
            // Toggle play state
            isPlaying = !isPlaying;
            if (isPlaying) {
                // Restart the update loop only if movement is already set
                if (velocityX !== 0 || velocityY !== 0) {
                    update();
                }
            } else {
                // When pausing, redraw immediately to show PAUSED screen
                draw();
            }
        }
        return;
    }

    if (code === 'KeyR' && gameOver) {
        resetGame();
        return;
    }

    if (gameOver || (isPlaying && directionChanged)) {
        // Ignore directional input if game over or direction already changed this tick
        return;
    }


    // --- Directional Controls ---
    let newVX = velocityX;
    let newVY = velocityY;

    if ((code === 'ArrowUp' || code === 'KeyW') && velocityY !== 1) {
        newVX = 0;
        newVY = -1;
    } else if ((code === 'ArrowDown' || code === 'KeyS') && velocityY !== -1) {
        newVX = 0;
        newVY = 1;
    } else if ((code === 'ArrowLeft' || code === 'KeyA') && velocityX !== 1) {
        if (velocityX == 0 && velocityY == 0) {
            return;
        }
        newVX = -1;
        newVY = 0;
    } else if ((code === 'ArrowRight' || code === 'KeyD') && velocityX !== -1) {
        newVX = 1;
        newVY = 0;
    }

    // Apply new direction only if it actually changed
    if (newVX !== velocityX || newVY !== velocityY) {
        velocityX = newVX;
        velocityY = newVY;
        directionChanged = true; // Set flag to prevent further changes this tick
    }

    // Start game on first directional press if not already playing
    if (directionChanged && !isPlaying && (velocityX !== 0 || velocityY !== 0)) {
        isPlaying = true;
        update();
    }


    // --- Directional Controls ---
    // if ((code === 'ArrowUp' || code === 'KeyW') && velocityY !== 1) {
    //     velocityX = 0;
    //     velocityY = -1;
    //     directionChanged = true;
    // } else if ((code === 'ArrowDown' || code === 'KeyS') && velocityY !== -1) {
    //     velocityX = 0;
    //     velocityY = 1;
    //     directionChanged = true;
    // } else if ((code === 'ArrowLeft' || code === 'KeyA') && velocityX !== 1) {
    //     if (velocityX == 0 && velocityY == 0) {
    //         return;
    //     }
    //     velocityX = -1;
    //     velocityY = 0;
    //     directionChanged = true;
    // } else if ((code === 'ArrowRight' || code === 'KeyD') && velocityX !== -1) {

    //     velocityX = 1;
    //     velocityY = 0;
    //     directionChanged = true;
    // }

    // if (directionChanged && !isPlaying && (velocityX !== 0 || velocityY !== 0)) {
    //     isPlaying = true;
    //     update();
    // }

    // if(!isPlaying){
    // update()
    // isPlaying = true;
    // }

    // if (directionChanged && isPlaying) {
    //     if (gameOver == true) {
    //         resetGame();
    //         draw();
    //     } else {
    //         isPlaying = true;
    //         update();
    //     }
    // }

    // if (code === 'Space') {
    //     // if (pause) {
    //     //     isPlaying = true;
    //     // } else {
    //     //     isPlaying = false;
    //     // }
    //     // pause = !pause;
    //     // update()
    // }
}


function update() {
    if (gameOver) {
        draw();
        return;
    }

    // Reset the direction change flag at the start of the game loop tick
    directionChanged = false;

    draw();

    if (isPlaying) {
        setTimeout(update, 100);
    }
}

function resetGame() {
    snakeBody = [
        { x: (tileSize * 2), y: 0 },
        { x: (tileSize), y: 0 },
        { x: 0, y: 0 },
    ];
    score = false;
    isPlaying = false;
    gameOver = false;
    velocityX = 0;
    velocityY = 0;
}


function getFoodXYHelper() {
    let x = Math.floor(Math.random() * rows) * tileSize;
    let y = Math.floor(Math.random() * columns) * tileSize;

    return [x, y]
}


function getFoodXY() {
    let foodLovcalXY = getFoodXYHelper();

    let y = foodLovcalXY[1];
    let x = foodLovcalXY[0];
    let isCollision = false;


    for (let i = 1; i < snakeBody.length; i++) {
        let current = snakeBody[i];

        if (current.x == x && current.y == y) {
            isCollision = true;
        }

    }


    if (isCollision == false) {
        return [x, y];
    }

    return getFoodXY();

}


function draw() {
    context.fillStyle = boardColor;
    context.fillRect(0, 0, width, height);

    // Calculate new snake head position based on current velocity

    let snakeX = snakeBody[0].x + (velocityX * tileSize);
    let snakeY = snakeBody[0].y + (velocityY * tileSize);


    //console.log(snakeBody)


    // Food collision 


    if (foodX == snakeBody[0].x && foodY == snakeBody[0].y && isPlaying) {
        snakeBody.push({ x: (foodX + tileSize), y: (foodY + tileSize) })

        let foodXY = getFoodXY();
        foodX = foodXY[0];
        foodY = foodXY[1];
        score += 100;
    }


    // Update snake position (if playing)

    if (isPlaying) {
        snakeBody.unshift({ x: snakeX, y: snakeY })
        snakeBody.pop()
    }



    // if(snakeX < (tileSize * -1)){
    //     snakeX = width - tileSize;
    // }else if(snakeX > width){
    //     snakeX = 0
    // }
    // else if(snakeY < (tileSize * - 1)){
    //     snakeY = height - tileSize;
    // }else if(snakeY > height){
    //     snakeY = 0;
    // }



    // check wall collision
    if (snakeX < 0 || snakeY < 0 || snakeX > (width - tileSize) || snakeY > (height - tileSize)) {
        isPlaying = false;
        gameOver = true;
    }

    // check collision 

    for (let i = 1; i < snakeBody.length; i++) {
        let current = snakeBody[i];
        let head = snakeBody[0];

        if (current.x == head.x && current.y == head.y && isPlaying) {
            gameOver = true;
            isPlaying = false;
            break;
        }

    }




    // draw food

    let border = 4;
    context.beginPath();

    let foodCenterX = foodX + (tileSize / 2);
    let foodCenterY = foodY + (tileSize / 2);
    let radius = (tileSize - border) / 2.5;
    context.arc(foodCenterX, foodCenterY, radius, 0, Math.PI * 2);
    context.fillStyle = "orange";
    context.fill();



    // draw Snake
    for (let i = 1; i < snakeBody.length; i++) {
        context.fillStyle = "yellow";
        let x = snakeBody[i].x;
        let y = snakeBody[i].y;

        if (i == snakeBody.length - 1) {
            // tail
            let previousBodyPart = snakeBody[i - 1];
            let tail = snakeBody[i];

            if (previousBodyPart.x > tail.x) {
                context.drawImage(snakeTailRight, x, y, tileSize, tileSize)
            } else if (previousBodyPart.x < tail.x) {
                context.drawImage(snakeTailLeft, x, y, tileSize, tileSize)
            } else if (previousBodyPart.y > tail.y) {
                context.drawImage(snakeTailUp, x, y, tileSize, tileSize)
            } else {
                context.drawImage(snakeTailDown, x, y, tileSize, tileSize)
            }

        }
        else {
            // mid body
            let prev = snakeBody[i - 1];
            let current = snakeBody[i];
            let next = snakeBody[i + 1];

            if (prev.y == current.y && current.y == next.y) {
                context.drawImage(snakeBodyHorizontal, x, y, tileSize, tileSize)
            } else if (prev.x == current.x && current.x == next.x) {
                context.drawImage(snakeBodyVertical, x, y, tileSize, tileSize)
            }
            else if ((prev.x == current.x && current.y == next.y && prev.y > current.y && current.x > next.x) || (prev.y == current.y && current.x == next.x && prev.x < current.x && current.y < next.y)) {
                context.drawImage(snakeMidBodyRightDown, x, y, tileSize, tileSize)
            }
            else if ((prev.y == current.y && current.x == next.x && prev.x < current.x && current.y > next.y) || (prev.x == current.x && current.y == next.y && prev.y < current.y && current.x > next.x)) {
                context.drawImage(snakeMidBodyDownLeft, x, y, tileSize, tileSize)
            } else if ((prev.y == current.y && current.x == next.x && prev.x > current.x && current.y < next.y) || (prev.x == current.x && current.y == next.y && prev.y > current.y && current.x < next.x)) {
                context.drawImage(snakeMidBodyUpRight, x, y, tileSize, tileSize)
            } else if ((prev.x == current.x && current.y == next.y && prev.y < current.y && current.x < next.x) || (prev.y == current.y && current.x == next.x && prev.x > current.x && current.y > next.y)) {
                context.drawImage(snakeMidBodyLeftUp, x, y, tileSize, tileSize)
            }
        }
    }

    // draw snake head 

    let x = snakeBody[0].x;
    let y = snakeBody[0].y;
    let headImage;

    // head
    if (velocityX == 1 || velocityX == 0 && velocityY == 0) {
        headImage = snakeHeadRight;
    } else if (velocityX == -1) {
        headImage = snakeHeadLeft;
    } else if (velocityY == 1) {
        headImage = snakeHeadDown;
    } else {
        headImage = snakeHeadUp;
    }

    context.drawImage(headImage, x, y, tileSize, tileSize)


    // Display Game State (Score/Pause/Game Over)
    context.fillStyle = "White";
    context.font = "20px Arial";
    context.textAlign = "left";
    context.fillText("Score: " + score, 10, 30);



    // Display Game State (Score/Pause/Game Over)

    const FONT_SIZE = 40; // Use a constant for clarity

    if (gameOver) {
        centerText(
            context,
            "Game Over! Score: " + score,
            "Press 'R' to Restart",
            FONT_SIZE,
            0.7, // Darken opacity
            width,
            height
        );
    } else if (!isPlaying && (velocityX !== 0 || velocityY !== 0)) {
        // PAUSED state
        centerText(
            context,
            "PAUSED",
            "Press SPACE to Resume",
            FONT_SIZE,
            0.5, // Darken opacity
            width,
            height
        );
    } else if (!isPlaying && velocityX === 0 && velocityY === 0) {
        // START/Initial state
        centerText(
            context,
            "Press an Arrow Key or WASD to Start",
            null, // No secondary text
            FONT_SIZE * 0.75, // Smaller font size for this message
            0.5, // Darken opacity
            width,
            height
        );
    }

}

function centerText(context, text1, text2, fontSize, darkenOpacity, width, height) {
    // 1. Darken the screen
    context.fillStyle = `rgba(0, 0, 0, ${darkenOpacity})`;
    context.fillRect(0, 0, width, height);

    // 2. Set common text styles
    context.fillStyle = "White";
    context.textAlign = "center";

    // Calculate vertical center point
    let y_center = height / 2;

    // 3. Draw Main Text (Text 1)
    context.font = fontSize + "px Arial";
    // Adjust y to center the primary text block, then move it slightly up
    let y1 = y_center - (text2 ? fontSize * 0.5 : fontSize * 0.25);
    context.fillText(text1, width / 2, y1);

    // 4. Draw Secondary Text (Text 2), if provided
    if (text2) {
        context.font = (fontSize * 0.5) + "px Arial";
        let y2 = y1 + fontSize; // Place it one font size below the main text
        context.fillText(text2, width / 2, y2);
    }
}

function resetGame() {
    gameOver = false;
    score = 0;
    velocityX = 0;
    velocityY = 0;
    isPlaying = false;
    directionChanged = false;


    snakeBody = [
        { x: (tileSize * 2), y: 0 },
        { x: (tileSize), y: 0 },
        { x: 0, y: 0 },
    ];

    let foodXY = getFoodXY();
    foodX = foodXY[0];
    foodY = foodXY[1];

    draw();
}