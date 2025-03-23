// physics for project 1

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


let paused = false; // Declare the paused variable
let debug = false; // Declare the debug variable

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ball = {
    x: canvasWidth / 2,
    y: 50,
    radius: 20,
    velocityX: 7.5,
    velocityY: 0,
    gravity: 0.5,
}

document.addEventListener("keydown", handleKeydown);

function handleKeydown(event) {
    switch (event.key) {
        case "ArrowLeft":
            // Handle left arrow key
            ball.velocityX = -Math.abs(ball.velocityX);
            break;
        case "ArrowRight":
            // Handle right arrow key
            ball.velocityX = Math.abs(ball.velocityX);
            break;
        case "q":
            // Handle left arrow key
            ball.velocityX = -Math.abs(ball.velocityX);
            break;
        case "e":
            // Handle right arrow key
            ball.velocityX = Math.abs(ball.velocityX);
            break;
        case "d":
            // Toggle debug mode
            debug = !debug;
            break;
        case "p":
            // Toggle pause
            paused = !paused;
            break;
        case " ":
            // Toggle pause
            paused = !paused;
            break;
        case "r":
            // Reset the ball position and velocity
            reset();
            break;
        case ".":
            // Increase the ball's radius
            ball.radius += 1;
            break;
        case ",":
            // Decrease the ball's radius
            if (ball.radius > 1) { 
                ball.radius -= 1;
            } 
            break;
        case "ArrowUp":
            // Increase the game speed
            ball.gravity += .1;
            break;
        case "ArrowDown":
            // Decrease the game speed
            if (ball.gravity > .1) { 
                ball.gravity -= .1;
            } 
            console.log("e");
            break;
        case "1":
            // flip x velocity
            ball.velocityX = -ball.velocityX;
            break;
        case "j":
            // jump
            ball.velocityY = -15;
            break;
        case "2":
            // increase x velocity
            if (ball.velocityX < 0) { // check if velocity is negative
                ball.velocityX -= 1; // increase velocity to the left
            }
            else {
                ball.velocityX += 1; // increase velocity to the right
            }

            break;
        case "3":
            // decrease x velocity
            if (ball.velocityX < 0) { // check if velocity is negative
                ball.velocityX += 1; // decrease velocity to the left
            }
            else {
                ball.velocityX -= 1; // decrease velocity to the right
            }
            break;
        default:
            break;
    }
}

function updateAndDrawBall(){

    // Draw the ball
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();

    if (debug){
        drawDebug(); // Draw debug information
    }
    // update position and velocity

    
    if (paused){
        drawPausedMessage(); // Draw the paused message
        return; // Stop updating if the game is paused
    }


    ball.velocityY += ball.gravity;
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius >= canvasHeight){
        ball.velocityY = -20;
        ball.y = canvasHeight - ball.radius; // reset position
        // console.log("radius: " + ball.radius);
        // console.log("canvas height: " + canvasHeight);
        // console.log("ball y: " + ball.y);
    }

    if (ball.x + ball.radius >= canvasWidth ){
        ball.velocityX = -Math.abs(ball.velocityX); // bounce 
    }
    if (ball.x - ball.radius <= 0){
        ball.velocityX = Math.abs(ball.velocityX); // bounce 
    }



    
}

function drawDebug(){
    ctx.font = "25px serif";
    ctx.fillStyle = "magenta";
    ctx.textAlign = "left"; // Align text to the left
    ctx.textBaseline = "top"; // Align text to the top

    const padding = 10;
    const x = padding;
    const y = padding;

    ctx.fillText("X: " + ball.x.toFixed(2), x, y);
    ctx.fillText("Y: " + ball.y.toFixed(2), x, y + 20);
    ctx.fillText("Velocity x: " + ball.velocityX.toFixed(2), x, y + 40);
    ctx.fillText("Velocity y: " + ball.velocityY.toFixed(2), x, y + 60);
    ctx.fillText("Radius: " + ball.radius, x, y + 80);
    ctx.fillText("Gravity: " + ball.gravity.toFixed(1), x, y + 100);
}

function drawPausedMessage(){
    ctx.font = "48px serif"; // Set the font size and style
    ctx.fillStyle = "navy"; // Set the text color
    ctx.textAlign = "center"; // Center the text horizontally
    ctx.fillText("Paused", canvasWidth / 2, canvasHeight / 2); // Draw the text
}

function animate(){
    updateAndDrawBall();
    requestAnimationFrame(animate);
}

function reset(){
    ball.x = canvasWidth / 2;
    ball.y = 50;
    ball.radius = 20;
    ball.velocityX = 7.5;
    ball.velocityY = 0;
    ball.gravity = .5; // Reset the game speed
}

drawDebug(); 
// draw debug to fix the bug where it changes the pause message location

animate(); //start loop