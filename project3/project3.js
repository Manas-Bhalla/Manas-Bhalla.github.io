// @ts-nocheck


const canvas = document.getElementById("gameCanvasProject3");
// @ts-ignore
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

let tileSize = 120;
var cornerX = 1280 - 9 * tileSize;
var cornerY = 720 - 5 * tileSize;

let tileCharacters = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
];

// images
let napoleonImg = new Image();
napoleonImg.src = "napoleon.jpg";
let tttsImg = new Image();
tttsImg.src = "ttts.jpg";
let sigmaPatrickBatemanImg = new Image();
sigmaPatrickBatemanImg.src = "sigmaPatrickBateman.jpg";

var gameOver = false;

//mouse properties
let mouse = {
    x: 0, // Mouse x position
    y: 0, // Mouse y position
}

//tile properties
let hoveredSlotRow = -1; // row of the hovered slot


let hoveredTile = {
    row: -1, // Row of the hovered tile
    col: -1, // Column of the hovered tile
}

document.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyD": // Toggle debug mode
            debug = !debug; // Toggle the debug variable
            break;
        case "Escape": // remove held character
            heldCharacter = "none";
            break;
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

    // Calculate hovered tile
    let tileSize = 120;
    let cornerX = 1280 - 9 * tileSize;
    let cornerY = 720 - 5 * tileSize;
    let col = Math.floor((mouse.x - cornerX) / tileSize);
    let row = Math.floor((mouse.y - cornerY) / tileSize);

    if (col >= 0 && col < 9 && row >= 0 && row < 5 ) {
        hoveredTile.row = row;
        hoveredTile.col = col;
        hoveredSlotRow = -1; // not hovering a slot
    } else if (mouse.x >= 0 && mouse.x < cornerX && mouse.y >= cornerY && mouse.y < cornerY + 5 * tileSize) {
        hoveredTile.row = -1;
        hoveredTile.col = -1;
        hoveredSlotRow = Math.floor((mouse.y - cornerY) / tileSize);
    } else {
        hoveredTile.row = -1;
        hoveredTile.col = -1;
        hoveredSlotRow = -1;
    }
    
});

// "held" character for dropping
let heldCharacter = "none";

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Get canvas position and size
    const clickX = event.clientX - rect.left; // Calculate X relative to the canvas
    const clickY = event.clientY - rect.top; // Calculate Y relative to the canvas

    // console.log(`Mouse clicked at: (${clickX}, ${clickY})`); // Log the click position

    // hold character
    switch (hoveredSlotRow){
        // case -1: heldCharacter = "none";
        // break;
        case 0: heldCharacter = "napoleon"; //napoleon
        break;
        case 1: heldCharacter = "ttts"; // tung tung tung sahur
        break;
        case 2: heldCharacter = "sigmaPatrickBateman"; // patrick bateman
        break;
    }
    // console.log(`held character: ${heldCharacter}`); // Log the held character

    //place character
    if (heldCharacter != "none"){
        placeCharacter(); // place the character
    }


});

function placeCharacter(){
    //place held character at tile based on tile
    tileCharacters[hoveredTile.row][hoveredTile.col] = heldCharacter; // place the character in the tile array
    console.log(tileCharacters); // Log the tile array



    heldCharacter = "none"; // remove held character


    
}

function draw() {
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    

    requestAnimationFrame(draw); // next frame for animation

    switch (gameScreen) {
        case 0: //  menu and title screen
            renderMenu(); // render the menu
            break;
        case 1: // level 1
        case 2: // level 2
        case 3: // level 3
        case 4: // endless mode
            renderGameGui(); // render the game GUI
            renderCharacters();
            break;      
        case -1: // game over
            gameOverFunction(); // render the game over screen
            break;
    }


    drawText(); //draw all the text
}

function renderCharacters(){
    var miniTileSize = 100;
    var tempImage;

    //draw image of characters in the tile by iterating through the 2d list (tilecharacters)
    for (var row = 0; row < 5; row++) {
        for (var column = 0; column < 9; column++) {
            // set tempImage based on character
            switch (tileCharacters[row][column]) {
            case "napoleon":
                tempImage = napoleonImg;
                break;
            case "ttts":
                tempImage = tttsImg;
                break;
            case "sigmaPatrickBateman":
                tempImage = sigmaPatrickBatemanImg;
                break;
            default:
                tempImage = null;
            }
            if (tempImage) {
            ctx.drawImage(tempImage, 10 + cornerX + column * tileSize, 10 + cornerY + row * tileSize, miniTileSize, miniTileSize);
            }
        }
    }   

    //draw image of whatever user is holding
    switch (heldCharacter){
        case "napoleon":
            ctx.drawImage(napoleonImg, mouse.x - 50, mouse.y - 50, 100, 100); // draw the image
            break;
        case "ttts":
            ctx.drawImage(tttsImg, mouse.x - 50, mouse.y - 50, 100, 100); // draw the image
            break;
        case "sigmaPatrickBateman":
            ctx.drawImage(sigmaPatrickBatemanImg, mouse.x - 50, mouse.y - 50, 100, 100); // draw the image
            break;
    }
}


function renderMenu(){
    //draw buttons for each level
}



function renderGameGui(){
    

    //draw tiles (first 320 pixels on X axis ignored as well as first 180 on y axis)
    //use for loops to draw the tiles with alternating light and dark green colors
    for (var row = 0; row < 5; row++) {
        for (var column = 0; column < 9; column++) {
            if (row % 2 == column % 2){ctx.fillStyle = "lightgreen";} // alternate colors
            else {ctx.fillStyle = "green";} // alternate colors
            ctx.fillRect(cornerX + column * tileSize, cornerY + row * tileSize, tileSize, tileSize); // draw the tile

            //hovered tile
            if (row == hoveredTile.row && column == hoveredTile.col) { // if the tile is hovered...
                ctx.save(); // save state temporarily
                ctx.fillStyle = "rgba(255, 255, 0, .7)"; 
                ctx.fillRect(cornerX + column * tileSize, cornerY + row * tileSize, tileSize, tileSize); // draw the tile
                ctx.restore(); //come back to the last state
            }
        }
    }

    //draw the 5 slots for characters
    //alternate light and dark gray colors
    for (var row = 0; row < 5; row++) {
        if(row % 2 == 0){ctx.fillStyle = "gray";}
        else{ctx.fillStyle = "darkgray";}
        ctx.fillRect(0, cornerY + row * tileSize, cornerX, tileSize)

        
        // seperate row from the rest of the tiles:
        
        
    }

    //hovered tile
        //text
        ctx.save();
        ctx.font = "32px Times New Roman"; // font for price
        ctx.fillStyle = "red";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";

        
        ctx.drawImage(napoleonImg, 0, cornerY + 0*tileSize, 200, tileSize); // character 1 
        ctx.fillText("100", 200 - 10, cornerY + 0*tileSize + tileSize - 10);
        ctx.drawImage(tttsImg, 0, cornerY + 1*tileSize, 200, tileSize); // character 2
        ctx.fillText("100", 200 - 10, cornerY + 1*tileSize + tileSize - 10);
        ctx.drawImage(sigmaPatrickBatemanImg, 0, cornerY + 2*tileSize, 200, tileSize); // character 3
        ctx.fillText("100", 200 - 10, cornerY + 2*tileSize + tileSize - 10);

        if (gameScreen > 1) { //only level 2 and above
            ctx.drawImage(napoleonImg, 0, cornerY + 3*tileSize, 200, tileSize); // character 4
            ctx.fillText("100", 200 - 10, cornerY + 3*tileSize + tileSize - 10);
        }
        if (gameScreen > 2) { //only level 3 and above
            ctx.drawImage(napoleonImg, 0, cornerY + 4*tileSize, 200, tileSize); // character 5
            ctx.fillText("100", 200 - 10, cornerY + 4*tileSize + tileSize - 10);
        }
        ctx.restore();

        for (var row = 0; row < 5; row++) {
            if (row === hoveredSlotRow) {
            ctx.save();
            ctx.fillStyle = "rgba(255, 255, 0, .3)";
            ctx.fillRect(0, cornerY + row * tileSize, cornerX, tileSize);
            ctx.restore();
        }
    }        
}



function drawText(){

    ctx.font = "26px times new roman"; // font for player information
    ctx.fillStyle = "blue"; // set fill color 

    if(debug){
    ctx.fillText(`mouse Position: (${Math.floor(mouse.x)}, ${Math.floor(mouse.y)})`, 10, 25); // mouse position
    ctx.fillText(`paused (P/esc): ${paused}`, 10, 50); // paused state
    ctx.fillText(`debug (D): ${debug}`, 10, 75); // debug state
    ctx.fillText(`game screen: ${gameScreen}`, 10, 100); // game screen
    //next column of debugging
    ctx.fillText(`hovered tile: (${hoveredTile.row}, ${hoveredTile.col})`, 500, 25); // hovered tile
    ctx.fillText(`hovered slot row: ${hoveredSlotRow}`, 500, 50); // hovered slot row
    ctx.fillText(`held character: ${heldCharacter}`, 500, 75); // held character
    }
}

function gameOverFunction(){
    //todo later
}

// start drawing loop
draw();