// @ts-nocheck

const canvas = document.getElementById("gameCanvasProject3");
const ctx = canvas.getContext("2d");

let gameRunning = false; // Declare the gameRunning variable
let paused = false; // Declare the paused variable
let debug = true; // Declare the debug variable
let godmode = false; // Declare the godmode variable 
let gameScreen = 0; // Declare the game screen variable
let generation = 10;
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
const baseMoney = 200; 
let money = baseMoney;
let baseHealth = 100; // base health for the player
let health = baseHealth; // current health for the player

const tileSize = 120;;
const miniTileSize = 100;
let cornerX = 1280 - 9 * tileSize;
let cornerY = 720 - 5 * tileSize;

let tileCharacters = []; //initialize

let tileEnemies = [[], [], [], [], []]; //initialize

let tileProjectiles = [[], [], [], [], []]; //initialize


class Tower {
    // static image = null;
    // static price = 0; 
    static slotCooldown = 0;

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.x = cornerX + col * tileSize; // x position
        this.y = cornerY + row * tileSize; // y position
        this.maxHealth = 100; //max health
        this.health = 100; // default health
        // this.attackCooldown = 0;
    }

    attack() {
        // todo
    }

    render() {
        ctx.drawImage(this.image, 10 + cornerX + this.col * tileSize, 10 + cornerY + this.row * tileSize, miniTileSize, miniTileSize);
        //if health is less than max health, draw health bar
        if (this.health < this.maxHealth) {
            ctx.fillStyle = "red"; // health bar color
            ctx.fillRect(10 + cornerX + this.col * tileSize, 10 + cornerY + this.row * tileSize - 10, miniTileSize * (this.health / this.maxHealth), 5); // health bar
        }
    }

    update(){
        //check if hp is above 0
        if (this.health <= 0) {
            //remove the tower from the tileCharacters list
            tileCharacters[this.row][this.col] = null; // remove the tower from the list
            this.image = null; // remove the image
            calculateGeneration();
        }
        //also should attack if enemies are in the same row
        if (tileEnemies[this.row].length > 0){this.attack();}
    }
}

class napoleon extends Tower {
    static image = new Image();
    static price = 100;
    constructor(row, col) {
        super(row, col);
        this.health = 100;
        this.image = napoleon.image; 
    }
}

class ttts extends Tower {
    static image = new Image();
    static price = 200;
    constructor(row, col) {
        super(row, col);
        this.maxHealth = 1500;
        this.health = this.maxHealth
        this.image = ttts.image;
    }
}

class bateman extends Tower {
    static image = new Image();
    static price = 100;
    constructor(row, col) {
        super(row, col);
        this.health = 100;
        this.image = bateman.image;
    }
}

class johnPork extends Tower {
    static image = new Image();
    static price = 400;
    constructor(row, col) {
        super(row, col);
        this.health = 100;
        this.image = johnPork.image;
    }
}

class skibidi extends Tower {
    static image = new Image();
    static price = 500;
    constructor(row, col) {
        super(row, col);
        this.maxHealth = 9999; 
        this.health = this.maxHealth;
        this.image = skibidi.image;
    }

    attack(){
        if (!this.lastAttackTime) {this.lastAttackTime = Date.now();}  
        let diff = Date.now() - this.lastAttackTime;
        if (Date.now() - this.lastAttackTime >= 500) { // after a bit
            // 10 damage to all enemies in this row
            for (let i = 0; i < tileEnemies[this.row].length; i++) {
                tileEnemies[this.row][i].health -= 100;
            }

            this.health = 0; // kill the skibidi
            this.lastAttackTime = Date.now();
        }
        //orange fuse bar
        ctx.fillStyle = "orange"; // 
        ctx.fillRect(this.x+110, this.y+110, 10, -1*(100 - diff/5));
    }

    
}

//list to hold all the towers

let towerPrices = [
    napoleon.price, // price for 1
    ttts.price,     // price for 2
    bateman.price,  // price for 3
    johnPork.price, // price for 4
    skibidi.price   // price for 5
];

let towerHotKeys = [
    "Q", // napoleon
    "W", // ttts
    "E", // bateman
    "R", // johnPork
    "T"  // skibidi
];

//enemies

class enemy1{
    // shared by all enemy1 objects
    constructor(row, speed = 1){
        this.row = row;
        this.x = 1250; // start at the leftmost column
        this.maxHealth = 100; // max health
        this.health = this.maxHealth; // default health
        this.obstructed = false;
        // Vary speed by ±20%
        this.speed = speed * (0.8 + Math.random() * 0.4);

        //random color for each RGB  
        let r = 0 + Math.floor(Math.random() * 256);
        let g = 0 + Math.floor(Math.random() * 56);
        let b = 0 + Math.floor(Math.random() * 156);
        this.color = "rgb(" + r + ", " + g + ", " + b + ")";
    }

    update(){
        if(this.obstructed == false){this.x = this.x - this.speed;} //move it

        // check if enemey has crossed the screen
        if (this.x < cornerX) {
            let thisIndex = tileEnemies[this.row].indexOf(this);
            if (thisIndex !== -1) { // enemy is in the list
                tileEnemies[this.row].splice(thisIndex, 1); 
                health = health - 10; 
                }
            } // subtract 10 health

        //other updates
        
        //test: decrease hp 
        // this.health -= 0.5; // decrease health by 0.1 every frame

        //if enemy is in the same column as a tower and within 50 pixels of it, attack
        let col = Math.floor((this.x - cornerX) / tileSize); //column its on
        if (col >= 0 && col < 9) {
            let tower = tileCharacters[this.row][col];
            if (tower) {
            this.obstructed = true;
            tower.health -= 1;
            // console.log(this.obstructed);
            }
            else{this.obstructed=false;}
            if (tower instanceof ttts){this.health--;} // tung tung tung shall damage the enemy!
        }

        //check if dead
        let thisIndex = tileEnemies[this.row].indexOf(this);
        if (this.health <= 0 && thisIndex != -1){
            tileEnemies[this.row].splice(thisIndex, 1); // remove the enemy from the list
        }
    }

    render(){
        ctx.fillStyle = this.color; // enemy color
        ctx.fillRect(this.x, cornerY + this.row * tileSize + tileSize/4, 50, 50);    
        //if health is less than max health, draw health bar
        if (this.health < this.maxHealth) {
            ctx.fillStyle = "red"; // health bar color
            ctx.fillRect(this.x, cornerY + this.row * tileSize + 20, 50 * (this.health / this.maxHealth), 5); // health bar
        }
    }

}

class timCheese extends enemy1 {
    constructor(row, speed = 5){
        super(row, speed);
        this.health = 1000; // default health
        this.image = timCheese.image; // image for the boss
    }
    // shared by all timCheese objects
    static image = new Image(); 
}

//new class based images
napoleon.image.src = "napoleon.jpg";
ttts.image.src = "ttts.jpg";
bateman.image.src = "bateman.jpg";
johnPork.image.src = "johnPork.jpg";
skibidi.image.src = "skibidi.jpg"; 

//enemy images 
//bossman gets an image
timCheese.image.src = "timCheese.jpg"; 
//everyone else is a red square


let gameOver = false;

//mouse properties
let mouse = {
    x: 0, // Mouse x position
    y: 0, // Mouse y position
}

//tile properties
let hoveredSlotRow = -1; // row of the hovered slot
let hoveredMenuButton = -1; // row of the hovered menu button
let lastHoveredSlotRow = -1;

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
        case "KeyB": //begin game
            beginGame();
            gameRunning = true;
            break;
    }
    // HOLDING STUFF WITH QWERT KEYS, only if not in menu
    if (gameScreen !== 0 && gameScreen !== -1) { // if not in menu
            switch (event.code) {
            case "KeyQ": 
                heldCharacter = "napoleon";
                lastHoveredSlotRow = 0; 
                break;
            case "KeyW": 
                heldCharacter = "ttts";
                lastHoveredSlotRow = 1;
                break;
            case "KeyE": 
                heldCharacter = "bateman";
                lastHoveredSlotRow = 2;
                break;
            case "KeyR": 
                if (gameScreen >= 2){
                    heldCharacter = "johnPork";
                    lastHoveredSlotRow = 3;
                }
                break;
            case "KeyT": 
            if (gameScreen >= 3){
                heldCharacter = "skibidi";
                lastHoveredSlotRow = 4;
            }     
                break;
            }
        }

    if (!debug) return; // only look at switch with debug on
    if (event.key >= "0" && event.key <= "4") {
        gameScreen = parseInt(event.key, 10);
        resetBoard();
    } else if (event.key === "z") {
        gameScreen = -1;
        resetBoard();
    } else if (event.key === "s") {
        spawnEnemy(-1); // random row spawn (-1)
        // console.log(tileEnemies);
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

    if (hoveredSlotRow != -1 && hoveredSlotRow != lastHoveredSlotRow) { // update last hovered slot row
        lastHoveredSlotRow = hoveredSlotRow; 
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
    if (heldCharacter != "none" && hoveredSlotRow == -1){ placeCharacter();} // i added hovered slot row check to make sure console error is gone
    // menu buttons
    // menu navigation
    if (hoveredMenuButton !== -1) {
        gameScreen = hoveredMenuButton;
        resetBoard();
    }
};

function placeCharacter(){
    //place held character at tile based on tile
    // Place a new tower object based on heldCharacter
    let towerInstance = null;
    switch (heldCharacter) {
        case "napoleon":
            towerInstance = new napoleon(hoveredTile.row, hoveredTile.col);
            napoleon.slotCooldown = 5;
            break;
        case "ttts":
            towerInstance = new ttts(hoveredTile.row, hoveredTile.col);
            ttts.slotCooldown = 5;
            break;
        case "bateman":
            towerInstance = new bateman(hoveredTile.row, hoveredTile.col);
            bateman.slotCooldown = 5;
            break;
        case "johnPork":
            towerInstance = new johnPork(hoveredTile.row, hoveredTile.col);
            johnPork.slotCooldown = 5;
            break;
        case "skibidi":
            towerInstance = new skibidi(hoveredTile.row, hoveredTile.col);
            skibidi.slotCooldown = 5;
            break;
        default:
            towerInstance = null;
    }
    tileCharacters[hoveredTile.row][hoveredTile.col] = towerInstance;

    //money check
    money = money - towerPrices[lastHoveredSlotRow]; // subtract the price from the money. 
    heldCharacter = "none"; // remove held character
    console.log(tileCharacters);
    calculateGeneration();
}

function spawnEnemy(speed = 1, row = -1){
    if (row == -1){
        let randomRow = Math.floor(Math.random() * 5); // random row between 0 and 4
        let enemy = new enemy1(randomRow, speed); // spawn an enemy at row 0
        tileEnemies[randomRow].push(enemy); // add the enemy to the list of enemies
    }
    else {
        let enemy = new enemy1(row-1, speed);
        tileEnemies[row-1].push(enemy); // add the enemy to the list of enemies
    }
    
}

function draw() {
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    requestAnimationFrame(draw); // next frame for animation


    switch (gameScreen) { //handle the rendering based on the game screen
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
    let tempImage;

    //draw image of characters in the tile by iterating through the 2d list (tilecharacters)
    for (let row = 0; row < 5; row++) {
        for (let column = 0; column < 9; column++) {
            let tower = tileCharacters[row][column]; // getting the object
            if (tower != null) {
                tower.render();
                if (!paused){tower.update();}
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

    //draw the enemies
    for (let row = 0; row < 5; row++) {
        for (let i = 0; i < tileEnemies[row].length; i++) {
            let enemy = tileEnemies[row][i];
            if (!paused){enemy.update();}
            enemy.render();
        }
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

function calculateGeneration(){
    let zzz = 10;
    for (let row = 0; row < 5; row++) {
        for(let col = 0; col < 9; col++){
            if (tileCharacters[row][col] instanceof bateman){zzz = zzz + 10;}
        }
    }

    generation = zzz;
}

function handleTime(){ //really just handles money
    
    // make sure we are on the same seclnd
    if (!handleTime.lastTime) {handleTime.lastTime = Date.now();}

    if (Date.now() - handleTime.lastTime >= 1000 && !paused) { //over one tenth of a second - add money
        money = money + generation;
        handleTime.lastTime = Date.now();
    }

    
    
}

function renderGameGui(){
    ctx.save();
    ctx.font = "40px times new roman"; // font for player information
    ctx.fillStyle = gameBlue;
    ctx.fillText("$: " + money, 10, 30); // money text
    ctx.fillText("HP: " + health, 10, 70); // health text
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
            ctx.fillRect(145, 85 + cornerY + i * tileSize, 55, 35); // price box
            ctx.fillRect(0, 85 + cornerY + i * tileSize, 35, 35); //hotkeys box
            ctx.restore();
            ctx.fillText(towerPrices[i], 200 - 3, 10 + cornerY + i * tileSize + tileSize - 10);
            ctx.fillText(towerHotKeys[i], 30, 10 + cornerY + i * tileSize + tileSize - 10);
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

    //draw bar of progress in a level
    if (totalWaves > 0 && gameScreen > 0) {
        //progress bar background
        ctx.save();
        ctx.fillStyle = "#ccc";
        ctx.fillRect(550, 100, buttonWidth, 20);

        // Draw progress bar fill
        let progress = Math.min(wavesCompleted / totalWaves, 1);
        ctx.fillStyle = gameBlue;
        ctx.fillRect(550, 100, buttonWidth * progress, 20);

        // Draw progress text
        ctx.font = "20px Times New Roman";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Wave " + wavesCompleted + " / " + totalWaves, 550 + buttonWidth / 2, 110);
        ctx.restore();
    }
}

function resetBoard(){
    // set the lists of towers to empty
    tileCharacters = [
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null]
    ];

    tileEnemies = [   // reset enemies as a 2D list with 5 empty lists
        [],
        [],
        [],
        [],
        []
    ]; 

    tileProjectiles = [ // reset projectiles
        [],
        [],
        [],
        [],
        []
    ];  


    money = baseMoney; // reset money
    gameRunning = false; // reset game running state
    health = baseHealth; // reset health
    calculateGeneration(); // recalculate generation
    beginGame();
    // set the lists of enemies to empty TODO
    // set the lists of projectiles to empty TODO
}

let wavesCompleted = 0; // number of waves completed
let totalWaves = -1;

function beginGame(){
    //board should be plain when this is called from reset board
    let endlessMultiplier = 1; // just 1 if not endless, will be increased if endless as waves go up
    let difficulty = gameScreen; // set difficulty based on game screen
    totalWaves = 10 + 5*(difficulty-1);
    let endless = false;
    if (gameScreen == 4){endless = true;}
    if (endless){endlessMultiplier = 1.1; totalWaves = 9999;} //now i can square it repeatedly to increase difficulty throughout endless mode

    wavesCompleted = 0; 
    spawnWave();
    wavesCompleted++;
    console.log(totalWaves);
    //clear and begin the interval for rounds
    if(beginGame.waveInterval){clearInterval(beginGame.waveInterval)};
    beginGame.waveInterval = setInterval(function() {
        if (gameScreen < 1 || paused == true || wavesCompleted >= totalWaves) {console.log("waves inactive"); return;}
        if(endless == true){endlessMultiplier = endlessMultiplier + .2;}
        spawnWave(endlessMultiplier);
        wavesCompleted++;
    }, 5000);
}

function spawnWave(endlessMultiplier){
    // spawn enemies based on the difficulty
    let difficulty = gameScreen; // set difficulty based on game screen
    let enemiesPerWave = difficulty*1 + 4; 

    // spawn enemies in random rows
    let enemyboost = Math.floor(1-endlessMultiplier)*10;
    let newEnemyCount = enemiesPerWave + enemyboost;
    for (let i = 0; i < enemiesPerWave; i++) {
        spawnEnemy(endlessMultiplier);
    }
}

function gameOverFunction(){
    //TODO later
}

function drawText(){ //and paused overlay as well

    //align stuff
    ctx.textAlign = "left"; // align text to left
    ctx.font = "26px times new roman"; // font for debug stuff
    ctx.fillStyle = "blue"; // set fill color
    
    if(debug){
    //column 1
    var offset = 150;
    ctx.fillText("mouse: (" + Math.floor(mouse.x) + ", " + Math.floor(mouse.y) + ")", offset + 10, 25); // mouse position
    ctx.fillText("paused (P/esc): " + paused, offset + 10, 50); // paused state
    ctx.fillText("debug (D): " + debug, offset + 10, 75); // debug state
    ctx.fillText("game screen: " + gameScreen, offset + 10, 100); // game screen
    //next column of debugging
    ctx.fillText("hovered tile: (" + hoveredTile.row + ", " + hoveredTile.col + ")", offset + 310, 25); // hovered tile
    ctx.fillText("hovered slot row: " + hoveredSlotRow + " (" + lastHoveredSlotRow + ")", offset + 310, 50); // hovered slot row
    ctx.fillText("held character: " + heldCharacter, offset + 310, 75); // held character
    // ctx.fillText("hovered menu button: " + hoveredMenuButton, offset + 310, 100); // hovered menu button

    //column 3
    // ctx.fillText("last hovered slot row: " + lastHoveredSlotRow, 800, 25); // last hovered slot row
    

    //quick loop for enemy count
    let enemyCount = 0;
    for (let row = 0; row < 5; row++) {enemyCount += tileEnemies[row].length; }
    ctx.fillText("enemy count: " + enemyCount, offset + 610, 25); // enemy count
    ctx.fillText("$ gen: " + generation, offset + 610, 50); // money generation
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



// start drawing loop
draw();