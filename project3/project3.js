// @ts-nocheck

const canvas = document.getElementById("gameCanvasProject3");
const ctx = canvas.getContext("2d");

let gameRunning = false; // Declare the gameRunning variable
let paused = false; // Declare the paused variable
let debug = true; // Declare the debug variable
let godmode = false; // Declare the godmode variable 
let gameScreen = 0; // Declare the game screen variable
let money = 0;

/*
0 = main menu
1 = level 1
2 = level 2
3 = level 3
4 = endless mode
-1 = game over
*/

const buttonWidth = 300;
const buttonHeight = 80;

let tileSize = 120;
let cornerX = 1280 - 9 * tileSize;
let cornerY = 720 - 5 * tileSize;

let tileCharacters = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
];

class napoleon {
    // shared by all napoleon objects
    static image = new Image(); 
    static price = 100; 

}

class ttts {
    // shared by all ttts objects
    static image = new Image(); 
    static price = 200; 
}

class bateman {
    // shared by all bateman objects
    static image = new Image(); 
    static price = 300; 
}

class johnPork {
    // shared by all johnPork objects
    static image = new Image(); 
    static price = 400; 
}

class skibidi {
    // shared by all skibidi objects
    static image = new Image(); 
    static price = 500; 
}

//list to hold all the towers

let towerPrices = [
    napoleon.price, // price for 1
    ttts.price,     // price for 2
    bateman.price,  // price for 3
    johnPork.price, // price for 4
    skibidi.price   // price for 5
];

//enemies

class timCheese{
    // shared by all timCheese objects
    static image = new Image(); 
}



//new class based images
napoleon.image.src = "napoleon.jpg";
ttts.image.src = "ttts.jpg";
bateman.image.src = "bateman.jpg";
johnPork.image.src = "johnPork.jpg";
skibidi.image.src = "skibidi.jpg"; 

//enemy images TODO
timCheese.image.src = "timCheese.jpg"; 

let gameOver = false;

//mouse properties
let mouse = {
    x: 0, // Mouse x position
    y: 0, // Mouse y position
}

//tile properties
let hoveredSlotRow = -1; // row of the hovered slot
let hoveredMenuButton = -1; // row of the hovered menu button

//hovered tile properties
let hoveredTile = {
    row: -1, // Row of the hovered tile
    col: -1, // Column of the hovered tile
}

// "held" character for dropping
let heldCharacter = "none";

// random constants
const gameBlue = "rgb(62, 64, 163)"; // this is used frequently

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
        case "KeyM": //menu
            gameScreen = 0; // go to menu
            resetBoard(); // reset board TODO
            break;
        case "keyB": //begin game
            beginGame();
            gameRunning = true;

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

    //hover effect on menu buttons
    // Determine which menu button (if any) is hovered
    if (gameScreen == 0 && mouse.x >= 900 && mouse.x <= 1200) {
        if (mouse.y >= 200 && mouse.y <= 280) {hoveredMenuButton = 1;}
        else if (mouse.y >= 320 && mouse.y <= 400) {hoveredMenuButton = 2;}
        else if (mouse.y >= 440 && mouse.y <= 520) {hoveredMenuButton = 3;}
        else if (mouse.y >= 560 && mouse.y <= 640) {hoveredMenuButton = 4;}
        else {hoveredMenuButton = -1;}
    } else if (gameScreen > 0 && mouse.x >= 950 && mouse.x <= 1250 && mouse.y >= 20 && mouse.y <= 100) {
        hoveredMenuButton = 0;
    } else {
        hoveredMenuButton = -1;
    }
});

canvas.onclick = (event) => { 
    const rect = canvas.getBoundingClientRect(); // Get canvas position and size
    const clickX = event.clientX - rect.left; // Calculate X relative to the canvas
    const clickY = event.clientY - rect.top; // Calculate Y relative to the canvas

    // hold character
    switch (hoveredSlotRow){
        case 0: heldCharacter = "napoleon"; // napoleon
        break;
        case 1: heldCharacter = "ttts"; // tung tung tung sahur
        break;
        case 2: heldCharacter = "bateman"; // patrick bateman
        break;
        case 3: heldCharacter = "johnPork"; // john pork 
        break;
        case 4: heldCharacter = "skibidi"; 
        break;
    }

    // place character
    if (heldCharacter != "none"){ placeCharacter();}

    // menu buttons
    // menu navigation
    if (hoveredMenuButton !== -1) {
        gameScreen = hoveredMenuButton;
        resetBoard();
    }
};

function placeCharacter(){
    //place held character at tile based on tile
    tileCharacters[hoveredTile.row][hoveredTile.col] = heldCharacter; // place the character in the tile array
    heldCharacter = "none"; // remove held character
}

function draw() {
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    requestAnimationFrame(draw); // next frame for animation

    
    //deciding what to do based on the game screen
    switch (gameScreen) {
        case 0: //  menu and title screen
            renderMenu(); // render the menu
            break;
        case 1: // level 1
        case 2: // level 2
        case 3: // level 3
        case 4: // endless mode
            renderGameGui(); // render the game GUI
            renderCharacters(); // render the towers on the tiles
            renderHeldCharacter(); // render the held character
            handleTime();
            break;      
        case -1: // game over
            gameOverFunction(); // render the game over screen
            break;
    }

    drawText(); //draw all the text
}

function renderCharacters(){
    let miniTileSize = 100;
    let tempImage;

    //draw image of characters in the tile by iterating through the 2d list (tilecharacters)
    for (let row = 0; row < 5; row++) {
        for (let column = 0; column < 9; column++) {
            // set tempImage based on character
            switch (tileCharacters[row][column]) {
            case "napoleon":
                tempImage = napoleon.image;
                break;
            case "ttts":
                tempImage = ttts.image;
                break;
            case "bateman":
                tempImage = bateman.image;
                break;
            case "johnPork":
                tempImage = johnPork.image;
                break;
            case "skibidi":
                tempImage = skibidi.image;
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
    // set tempImage based on character
    switch (heldCharacter){
        case "napoleon":
            tempImage = napoleon.image;
            break;
        case "ttts":
            tempImage = ttts.image;
            break;
        case "bateman":
            tempImage = bateman.image;
            break;
        case "johnPork":
            tempImage = johnPork.image;
            break;
        case "skibidi":
            tempImage = skibidi.image;
            break;
        default:
            tempImage = null;
    }
    if (heldCharacter != "none" && tempImage != null) {
        ctx.drawImage(tempImage, mouse.x - 50, mouse.y - 50, miniTileSize, miniTileSize);
    }

    
}

function renderHeldCharacter(){

}

function renderMenu(){
    const startX = 900; // starting x position for buttons
    const buttonLabels = ["Level 1", "Level 2", "Level 3", "Endless Mode"];

    //draw title
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "65px Times New Roman";
    ctx.fillStyle = gameBlue;
    ctx.fillText("Brainrot Tower Defense!", canvas.width / 2 - 200, 150); // title text

    //draw some images
    ctx.drawImage(napoleon.image, 40, 200, 360, 240); 
    ctx.drawImage(ttts.image, 400, 200, 240, 240); 
    ctx.drawImage(skibidi.image, 340, 440, 360, 240);
    ctx.drawImage(bateman.image, 40, 440, 360, 240); 
    ctx.drawImage(timCheese.image, 640, 200, 240, 480);

    //draw buttons for each level
    ctx.textAlign = "left";

    ctx.fillText("Select level", startX, 150); // selecting level text
    ctx.save();
    ctx.font = "48px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // properties
    

    ctx.fillStyle = gameBlue;
    

    for (let i = 0; i < 4; i++) {
        let y = 200 + i * (buttonHeight + 40);
        ctx.fillStyle = gameBlue;
        ctx.fillRect(startX, y, buttonWidth, buttonHeight);
        //hover effect - after button but before text
        if (hoveredMenuButton == i + 1) { // if the button is hovered...
            ctx.save(); // save state temporarily
            ctx.fillStyle = "rgba(255, 255, 0, .5)"; 
            ctx.fillRect(startX, y, buttonWidth, buttonHeight); // draw the button
            ctx.restore(); //come back to the last state
        }
        //text
        ctx.fillStyle = "#fff";
        ctx.fillText(buttonLabels[i], startX + buttonWidth / 2, y + buttonHeight / 2);
    }

    ctx.restore();
}

function handleTime(){
    
    // make sure we are on the same seclnd
    if (!handleTime.lastTime) {handleTime.lastTime = Date.now();}

    if (Date.now() - handleTime.lastTime >= 1000) { //over one tenth of a second
        money = money + 10;
        handleTime.lastTime = Date.now();
    }
}

function renderGameGui(){
    ctx.save();
    ctx.font = "44px times new roman"; // font for player information
    ctx.fillStyle = gameBlue;
    ctx.fillText("$: " + money, 10, 30); // money text
    ctx.restore();

    //draw tiles (first 320 pixels on X axis ignored as well as first 180 on y axis)
    //use for loops to draw the tiles with alternating light and dark green colors
    for (let row = 0; row < 5; row++) {
        for (let column = 0; column < 9; column++) {
            if (row % 2 == column % 2){ctx.fillStyle = "lightgreen";} // alternate colors
            else {ctx.fillStyle = "green";} // alternate colors
            ctx.fillRect(cornerX + column * tileSize, cornerY + row * tileSize, tileSize, tileSize); // draw the tile

            //hovered tile
            if (row == hoveredTile.row && column == hoveredTile.col) { // if the tile is hovered...
                ctx.save(); // save state temporarily
                ctx.fillStyle = "rgba(255, 255, 0, .75)"; 
                ctx.fillRect(cornerX + column * tileSize, cornerY + row * tileSize, tileSize, tileSize); // draw the tile
                ctx.restore(); //come back to the last state
            }
        }
    }

    //draw the 5 slots for characters
    //alternate light and dark gray colors
    for (let row = 0; row < 5; row++) {
        if(row % 2 == 0){ctx.fillStyle = "gray";}
        else{ctx.fillStyle = "darkgray";}
        ctx.fillRect(0, cornerY + row * tileSize, cornerX, tileSize)
    }

    //draw the images of the characters in the slots
    ctx.drawImage(napoleon.image, 0, cornerY + 0*tileSize, 200, tileSize); 
    ctx.drawImage(ttts.image, 0, cornerY + 1*tileSize, 200, tileSize); 
    ctx.drawImage(bateman.image, 0, cornerY + 2*tileSize, 200, tileSize); 
    //conditional images
    if (gameScreen > 1) { ctx.drawImage(johnPork.image, 0, cornerY + 3*tileSize, 200, tileSize);}
    if (gameScreen > 2) { ctx.drawImage(skibidi.image, 0, cornerY + 4*tileSize, 200, tileSize);}

    //hovered tile
    if (hoveredSlotRow !== -1) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 0, .3)";
        ctx.fillRect(0, cornerY + hoveredSlotRow * tileSize, cornerX, tileSize); //cornerX used as width here
        ctx.restore();
    }

    
    //text for tower prices
    ctx.save();
    ctx.font = "32px Times New Roman"; // font for price
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";     
    for (let i = 0; i < 5; i++) { //draw prices and the box below them
        if (i - 2 < gameScreen) {
            ctx.save();
            ctx.fillStyle = gameBlue;
            ctx.fillRect(145, 85 + cornerY + i * tileSize, 55, 35);
            ctx.restore();
            ctx.fillText(towerPrices[i], 200 - 3, 10 + cornerY + i * tileSize + tileSize - 10);
        }
    }

    ctx.restore(); //come back to the last state
    
    //draw the button to go back to the menu
    ctx.save();
    ctx.fillStyle = gameBlue;
    ctx.fillRect(950, 20, buttonWidth, buttonHeight); //button
    if (hoveredMenuButton == 0) { // if the button is hovered...
        ctx.save(); 
        ctx.fillStyle = "rgba(255, 255, 0, .5)";
        ctx.fillRect(950, 20, buttonWidth, buttonHeight); 
        ctx.restore(); 
    } //text
    ctx.fillStyle = "#fff";
    ctx.font = "48px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Menu", 1250 - buttonWidth / 2, 20 + buttonHeight / 2);
    ctx.restore(); 
}

function resetBoard(){
    // set the lists of towers to empty
    tileCharacters = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
    ];

    money = 0; // reset money
    gameRunning = false; // reset game running state
    // set the lists of enemies to empty TODO
    // set the lists of projectiles to empty TODO
}

function drawText(){

    //align stuff
    ctx.textAlign = "left"; // align text to left
    ctx.font = "26px times new roman"; // font for debug stuff
    ctx.fillStyle = "blue"; // set fill color
    
    if(debug){
    ctx.fillText("mouse: (" + Math.floor(mouse.x) + ", " + Math.floor(mouse.y) + ")", 210, 25); // mouse position
    ctx.fillText("paused (P/esc): " + paused, 210, 50); // paused state
    ctx.fillText("debug (D): " + debug, 210, 75); // debug state
    ctx.fillText("game screen: " + gameScreen, 210, 100); // game screen
    //next column of debugging
    ctx.fillText("hovered tile: (" + hoveredTile.row + ", " + hoveredTile.col + ")", 500, 25); // hovered tile
    ctx.fillText("hovered slot row: " + hoveredSlotRow, 500, 50); // hovered slot row
    ctx.fillText("held character: " + heldCharacter, 500, 75); // held character
    ctx.fillText("hovered menu button: " + hoveredMenuButton, 500, 100); // hovered menu button
    }

    if (paused){
        //OVERLAY
        ctx.save(); // save state temporarily
        ctx.fillStyle = "rgba(255, 255, 255, .5)"; // overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height); // draw the rectangle
        ctx.restore();

        //PAUSED TEXT
        ctx.save(); // save state temporarily
        ctx.font = "75px times new roman"; // font for paused text
        ctx.textAlign = "center"; // align text to center
        ctx.fillText("PAUSED", canvas.width / 2 - 50, canvas.height / 2); // paused text
        ctx.restore(); //come back 
    }
}

function gameOverFunction(){
    //TODO later
}

// start drawing loop
draw();