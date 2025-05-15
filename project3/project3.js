const canvas = document.getElementById("gameCanvasProject3");
const ctx = canvas.getContext("2d");

let paused = false; // Declare the paused variable
let debug = true; // Declare the debug variable
let godmode = false; // Declare the godmode variable 
let gameScreen = 0; // Declare the game screen variable

/*
0 = main menu
1 = level 1
2 = level 2
3 = level 3
4 = endless mode
-1 = game over
*/

var gameOver = false;

//mouse properties
let mouse = {
    x: 0, // Mouse x position
    y: 0, // Mouse y position
}

document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyD": // Toggle debug mode
            debug = !debug; // Toggle the debug variable
            break;
        case "Escape": // Toggle pause with esc 
        case "KeyP": // Toggle pause with P
            paused = !paused; // Toggle the paused variable
            break;
    }

    if (!debug) return; // only look at switch with debug on
    switch (event.key){
        case "0":
            gameScreen = 0;
            break;
        case "1":
            gameScreen = 1;
            break;
        case "2":
            gameScreen = 2;
            break;
        case "3":
            gameScreen = 3;
            break;
        case "4":
            gameScreen = 4;
            break;
        case "z":
            gameScreen = -1;
        
    }
});

//mouse methods
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect(); // Get the canvas's position and size
    const scaleX = canvas.width / rect.width; // Horizontal scaling factor
    const scaleY = canvas.height / rect.height; // Vertical scaling factor

    mouse.x = (event.clientX - rect.left) * scaleX; // Normalize X to canvas coordinates
    mouse.y = (event.clientY - rect.top) * scaleY; // Normalize Y to canvas coordinates
});

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Get canvas position and size
    const clickX = event.clientX - rect.left; // Calculate X relative to the canvas
    const clickY = event.clientY - rect.top; // Calculate Y relative to the canvas

    console.log(`Mouse clicked at: (${clickX}, ${clickY})`); // Log the click position
});

function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    drawText(); //draw all the text

    requestAnimationFrame(draw); // next frame for animation

    switch (gameScreen) {
        case 0: //  menu and title screen
            renderMenu(); // render the menu
            break;
        case 1: // level 1
            renderGameGui(); // render the game GUI
        case 2: // level 2
            renderGameGui(); // render the game GUI
        case 3: // level 3
            renderGameGui(); // render the game GUI
        case 4: // endless mode
            renderGameGui(); // render the game GUI
            break;
        case -1: // game over
            gameOverFunction(); // render the game over screen
            break;
    }
}



function renderMenu(){
    //draw buttons for each level
}

function renderGameGui(){
    let tileSize = 120;
    var cornerX = 1280 - 9 * tileSize;
    var cornerY = 720 - 5 * tileSize;

    var TileX = {};
    var TileY = {};

    //draw tiles (first 320 pixels on X axis ignored as well as first 180 on y axis)
    //use for loops to draw the tiles with alternating light and dark green colors
    for (var row = 0; row < 5; row++) {
        for (var column = 0; column < 9; column++) {
            if (row % 2 == column % 2){ctx.fillStyle = "lightgreen";} // alternate colors
            else {ctx.fillStyle = "green";} // alternate colors
            ctx.fillRect(cornerX + column * tileSize, cornerY + row * tileSize, tileSize, tileSize); // draw the tile
        }
    }

    //draw the 5 slots for characters
    //alternate light and dark gray colors
    for (var row = 0; row < 5; row++) {
        if(row % 2 == 0){ctx.fillStyle = "gray";}
        else{ctx.fillStyle = "darkgray";}
        // ctx.fillStyle = "white";
        ctx.fillRect(0, cornerY + row * tileSize, cornerX, tileSize)
    }
}

function gameOverFunction(){
    //todo later
}

function drawText(){

    ctx.font = "26px times new roman"; // font for player information
    ctx.fillStyle = "blue"; // set fill color 

    if(debug){
    ctx.fillText(`mouse Position: (${Math.floor(mouse.x)}, ${Math.floor(mouse.y)})`, 10, 25); // mouse position
    ctx.fillText(`paused (P/esc): ${paused}`, 10, 50); // paused state
    ctx.fillText(`debug (D): ${debug}`, 10, 75); // debug state
    ctx.fillText(`game screen: ${gameScreen}`, 10, 100); // game screen
    }
}

// start drawing loop
draw();