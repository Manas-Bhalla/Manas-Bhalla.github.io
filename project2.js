const canvas = document.getElementById("gameCanvasProject2");
const ctx = canvas.getContext("2d");

var diffx = 0; // Difference in x position from player to mouse
var diffy = 0; // Difference in y position from player to mouse

var currentRound = 1; // Current round number
var difficultyMultiplier = 1 + (0.05 * (currentRound-1)); // Multiplier for rounds (not used in this code but can be useful for other calculations)

//mouse properties
let mouse = {
    x: 0, // Mouse x position
    y: 0, // Mouse y position
    angle: 0, // Angle from the center of the canvas to the mouse position
    angleDegrees: 0, // Angle in degrees (not used in this code but can be useful for other calculations)
}

//mouse methods
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect(); // Get the canvas's position and size
    const scaleX = canvas.width / rect.width; // Horizontal scaling factor
    const scaleY = canvas.height / rect.height; // Vertical scaling factor

    mouse.x = (event.clientX - rect.left) * scaleX; // Normalize X to canvas coordinates
    mouse.y = (event.clientY - rect.top) * scaleY; // Normalize Y to canvas coordinates
});

canvas.addEventListener("mousedown", (event) => {
    if (player.weapon === "staff" && !paused) {
        laser.active = true; // Activate the laser
    }
});

canvas.addEventListener("mouseup", (event) => {
    laser.active = false; // Deactivate the laser when the mouse is released
});

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Get canvas position and size
    const clickX = event.clientX - rect.left; // Calculate X relative to the canvas
    const clickY = event.clientY - rect.top; // Calculate Y relative to the canvas

    console.log(`Mouse clicked at: (${clickX}, ${clickY})`); // Log the click position
    
    //logic for various weapons
    if (!paused) {
        switch (player.weapon) {
            case "bow": fireArrow(); 
                break;
            case "sword": startSwordSwing(); // Call the function to start the sword swing animation
                break;
            case "staff":
                // Logic for staff (none here)
                break;
            default: console.log(`No action for: ${player.weapon}`); 
                break;
        }
    }
});



let paused = false; // Declare the paused variable
let debug = false; // Declare the debug variable
let godmode = false; // Declare the godmode variable 
//player object
var player = {
    x: 50, // Initial x position of the player
    y: 50, // Initial y position of the player
    width: 25, // Width of the player icon
    height: 25, // Height of the player icon
    dx: 0, // Velocity in the x direction
    dy: 0, // Velocity in the y direction
    acceleration: 0.01, // Acceleration rate
    gold: 0, // Number of coins collected by the player
    speed: 3, // Speed of the player icon
    weapon: "sword", // Default weapon selected by the player
    midx: 0,
    midy: 0,
    weaponBuff: 1, 
    health : 100, // Health of the player
    maxHealth: 100, // Maximum health of the player
    damageReduction: 0, // damage reduction of the player in percentage
    
    // midx and midy are used to calculate the center of the player icon for angle calculations
};


var debugEnemySpawnCount = 0;
const keys = {}; // Object to keep track of key states
// This object will store the state of each key (pressed or not)

// buttons from html file:
const pauseButton = document.getElementById("pauseButtonProject2");
const debugButton = document.getElementById("debugButtonProject2");
const resetButton = document.getElementById("resetButtonProject2");
const spawnEnemyButton = document.getElementById("spawnEnemyButtonProject2");
const numberOfEnemiesInputBox = document.getElementById("userInputBox");

numberOfEnemiesInputBox.addEventListener("input", (event) => {
    if (event.target.value >= 1000){event.target.value = 999};

    debugEnemySpawnCount = parseInt(event.target.value, 10); // Parse the input value as an integer
    
});

// Add event listeners for the buttons
pauseButton.addEventListener("click", () => {
    paused = !paused; // Toggle the paused state
    console.log(`Paused: ${paused}`); // Log the paused state for debugging
});

debugButton.addEventListener("click", () => {
    debug = !debug; // Toggle the debug state
    // console.log(`Debug: ${debug}`); // Log the debug state for debugging
});

resetButton.addEventListener("click", () => {
    // Reset player position and stats
    reset(); // Call the reset function to reset player stats
});

spawnEnemyButton.addEventListener("click", () => {
    // Logic to spawn an enemy (not implemented in this code)
    console.log("Spawn enemy button clicked!"); // Placeholder for enemy spawn action
    spawnEnemies(); // Call the function to spawn an enemy
});

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "z": // Toggle debug mode
            debug = !debug; // Toggle the debug variable
            break;
        case "e": // Spawn an enemy (for testing purposes)
            spawnEnemies();
            break;
        case "g": //god mode
            godmode = !godmode; // Toggle god mode (not implemented in this code, but can be used to make player invincible)
            break;
        case " ": // Toggle pause
            paused = !paused; // Toggle the paused variable
            break;
        case "r": // Reset player position and stats
            reset(); // Call the reset function to reset player stats
            break;
        case "1": // Select weapon 1 (e.g., sword)
            if (!paused){player.weapon = "sword";}
            else{shop.buyMaxHealth();}
            calculateWeaponDamage();
            break;
        case "2": // Select weapon 2 (e.g., bow)
            if (!paused){player.weapon = "bow";}
            else{shop.buySpeed();}
            calculateWeaponDamage();
            break;
        case "3": // Select weapon 3 (e.g., staff)
            if (!paused){player.weapon = "staff";}
            else{shop.buyWeaponBuff();}
            calculateWeaponDamage();
            break;
    }
});

var currentWeaponDamage;
function calculateWeaponDamage(){
    // Calculate the weapon damage based on the current weapon and player stats
    switch (player.weapon) {
        case "sword":
            currentWeaponDamage = swordSwing.damage * player.weaponBuff; // Sword has a base damage of 10, multiplied by the weapon buff
            break;
        case "bow":
            currentWeaponDamage = 15 * player.weaponBuff; // Bow has a base damage of 10, multiplied by the weapon buff
            break;
        case "staff":
            currentWeaponDamage = .5 * player.weaponBuff; // Staff has a base damage of 0.5, multiplied by the weapon buff (lower damage for balance)
            break;
        default:
            player.weaponBuff = 1; // Default to 1 if no valid weapon is selected
    }
}

document.addEventListener("keydown", (event) => {
    keys[event.key] = true; // Mark the key as pressed
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false; // Mark the key as released
});


// Example: Draw a rectangle on the canvas
function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
    
    
    if (paused) {laser.active = false;} // Deactivate the laser when the game is paused


    // Handle player movement based on active keys
    if (!paused){
        if (keys["w"]){player.y -= player.speed;}  // Move up
        if (keys["s"]){player.y += player.speed;} // Move down
        if (keys["a"]){player.x -= player.speed;} // Move left
        if (keys["d"]){player.x += player.speed;} // Move right
        
        
        
        // for loop checking enemies in list and calling checkEnemy function that ill make later 
        
    }
    
    updateArrows(paused); // Update and draw all active arrows (projectiles)
    updateSwordSwing(); // Update the sword swing animation if active
    updateLaser();
    drawandUpdateEnemies(); // Update and draw all active enemies
    

    ctx.fillStyle = "rgb(11, 15, 238)";
    //player icon
    ctx.fillRect(player.x, player.y, player.width, player.height); // Draw a rectangle

    

    if(player.x<0){player.x=0}
    if(player.x + player.width > canvas.width){player.x = canvas.width - player.width} // Prevent player from going out of bounds on the right side
    if(player.y<0){player.y=0} // Prevent player from going out of bounds on the top side
    if(player.y + player.height > canvas.height){player.y = canvas.height - player.height} // Prevent player from going out of bounds on the bottom side


    // Calculate the center position of the player icon for angle calculations
    player.midx = player.x + player.width / 2; // Calculate the center x position of the player
    player.midy = player.y + player.height / 2; // Calculate the center y position of the player

    // Calculate the difference in position from the player to the mouse
    diffx = mouse.x - player.midx; // Difference in x position from player center to mouse x position
    diffy = mouse.y - player.midy; // Difference in y position from player center to mouse y position

    //calculate angle from player to mouse
    // This will give us the angle in radians from the player to the mouse position
    // We can use this angle for various purposes, such as aiming a weapon or determining direction
    mouse.angle = Math.atan2(diffy, diffx); // Calculate the angle in radians from the player center to the mouse position
    mouse.angleDegrees = mouse.angle * (180 / Math.PI); // Convert the angle from radians to degrees (not used in this code but can be useful for other calculations)
    // The mouse.angle now contains the angle in radians from the player to the mouse position

    if (godmode){
        player.health = player.maxHealth; // Ensure player health is max if godmode is active
    }

    drawText(); //draw all the text
    requestAnimationFrame(draw); // Request the next frame for animation

}

function reset() {
    // Reset player properties
    player.x = 50; // Reset x position
    player.y = 50; // Reset y position
    player.speed = 3; // Reset speed
    player.gold = 0; // Reset gold collected
    player.health = player.maxHealth; // Reset health to max health
    player.weapon = "sword"; // Reset weapon to default
    player.weaponBuff = 1; // Reset weapon size multiplier
    player.damageReduction = 0; // Reset damage reduction

    // Reset game state
    currentRound = 1; // Reset rounds completed
    difficultyMultiplier = 1; // Reset difficulty multiplier

    // Clear all active projectiles and enemies
    arrows.length = 0; // Clear all arrows
    enemies.length = 0; // Clear all enemies

    // Reset sword swing and laser states
    swordSwing.active = false; // Reset sword swing
    laser.active = false; // Reset laser

    console.log("Game has been reset!");
    calculateWeaponDamage(); // Initial calculation of weapon damage based on the default weapon

    shop.price = 100; // Reset shop price to base value    
}

const arrows = []; // Array to store active arrows (projectiles)
// This array will hold all the active Arrow objects in the game
//projectile classes
class Arrow {
    constructor(x, y, angle, speed, damage, range) {
        this.x = x; // X position of the arrow
        this.y = y; // Y position of the arrow
        this.angle = angle; // Angle of the arrow in radians
        this.speed = speed; // Speed of the arrow
        this.damage = damage; // Damage dealt by the arrow
        this.range = range; // Maximum range of the arrow
        this.traveled = 0; // Distance traveled so far
        this.dx = Math.cos(angle) * speed; // Velocity in the x direction
        this.dy = Math.sin(angle) * speed; // Velocity in the y direction
    }

    // Update the position of the arrow
    update(paused) {
        if (paused) {
            return;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.traveled += Math.sqrt(this.dx ** 2 + this.dy ** 2); // Update the distance traveled
    }

    // Draw the arrow on the canvas
    draw(ctx) {
        const shaftLength = 20; // Length of the arrow shaft

        // Calculate the end of the arrow shaft
        const endX = this.x - Math.cos(this.angle) * shaftLength;
        const endY = this.y - Math.sin(this.angle) * shaftLength;

        // Draw the arrow shaft (brown line)
        ctx.strokeStyle = "brown";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y); // Start at the arrow's current position
        ctx.lineTo(endX, endY); // Draw to the end of the shaft
        ctx.stroke();
    }

    // Check if the arrow has exceeded its range or gone off-screen
    isOutOfBounds(canvas) {
        return (
            this.traveled > this.range || // Check if the arrow has exceeded its range
            this.x < 0 || this.x > canvas.width || // Check if the arrow is outside the canvas horizontally
            this.y < 0 || this.y > canvas.height // Check if the arrow is outside the canvas vertically
        );
    }
}

function fireArrow() {
    const angle = Math.atan2(
        mouse.y - (player.y + player.height / 2),
        mouse.x - (player.x + player.width / 2)
    );

    // Create a new arrow instance
    const arrow = new Arrow(
        player.x + player.width / 2, // Start at the center of the player
        player.y + player.height / 2,
        angle, // Angle toward the mouse
        5 * player.weaponBuff, // Speed of the arrow
        15 * player.weaponBuff, // Damage dealt by the arrow
        990 // Maximum range of the arrow
    );

    arrows.push(arrow); // Add the arrow to the array of active arrows
}

function updateArrows() {
    for (let i = arrows.length - 1; i >= 0; i--) {
        const arrow = arrows[i];
        arrow.update(paused); // Update the arrow's position

        // Remove the arrow if it goes out of bounds
        if (arrow.isOutOfBounds(canvas)) {
            arrows.splice(i, 1); // Remove the arrow from the array
        } else {
            arrow.draw(ctx); // Draw the arrow
        }
    }
}

//sword swing stuff
let swordSwing = {
    active: false, // Whether the swing animation is active
    startAngle: 0, // Starting angle of the swing (in radians)
    endAngle: 0, // Ending angle of the swing (in radians)
    radius: 75, // Radius of the swing arc
    duration: 150, // Duration of the swing in milliseconds
    startTime: 0, // Timestamp when the swing started
    damage: .5, 
};

function startSwordSwing() {
    if (swordSwing.active) return; // Prevent overlapping swings

    swordSwing.active = true;
    swordSwing.startAngle = mouse.angle - Math.PI / 4; // Start 45 degrees to the left of the mouse angle
    swordSwing.endAngle = mouse.angle + Math.PI / 4; // End 45 degrees to the right of the mouse angle
    swordSwing.startTime = performance.now(); // Record the start time
}

function updateSwordSwing() {
    if (!swordSwing.active) {
        return;
    }

    const elapsedTime = performance.now() - swordSwing.startTime;
    if (elapsedTime >= swordSwing.duration) { // Reduce the duration by half
        swordSwing.active = false; // End the swing animation
        return;
    }

    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red for the swing arc
    ctx.lineWidth = 30 * player.weaponBuff; // Line width based on weapon size multiplier
    ctx.beginPath();
    ctx.arc(
        player.midx, // Center of the player
        player.midy,
        swordSwing.radius, // Radius of the swing
        swordSwing.startAngle, // Start angle of the arc
        swordSwing.endAngle // End angle of the arc
    );
    ctx.stroke();

    // Track enemies already hit during this swing
    const hitEnemies = new Set();

    // Check collision with enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        // Skip if this enemy has already been hit during this swing
        

        // Calculate the distance from the enemy to the player's center
        const dx = enemy.x + enemy.size / 2 - player.midx;
        const dy = enemy.y + enemy.size / 2 - player.midy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if the enemy is within the swing radius
        if (distance <= player.weaponBuff * swordSwing.radius + enemy.size / 2) {
            enemy.health -= swordSwing.damage * player.weaponBuff; // Reduce enemy health by sword damage
            hitEnemies.add(enemy); // Mark this enemy as hit
        }
    }
    
}

//staff and laser logic
let laser = {
    active: false, // Whether the laser is currently active
    startX: 0, // Starting X position of the laser (player's center)
    startY: 0, // Starting Y position of the laser (player's center)
    endX: 0, // Ending X position of the laser
    endY: 0, // Ending Y position of the laser
    color: "rgba(0, 0, 255, 0.7)", // Laser color (semi-transparent blue)
    width: 15, // Laser width
    damage: 1, // Damage dealt by the laser (can be adjusted based on weapon buff)
};

function updateLaser() {
    if (laser.active == false) return;

    // Set the starting position to the player's center
    laser.startX = player.midx;
    laser.startY = player.midy;

    // Calculate the laser's endpoint far in the direction of the mouse
    //update laser stats

    laser.damage = .5 * player.weaponBuff; // Update the damage based on the player's weapon buff
    var laserLength = 500 * player.weaponBuff; //large value for the laser's length
    laser.width = 15 * player.weaponBuff; // Update the width of the laser based on the player's weapon buff

    // console.log(laserLength);

    laser.endX = laser.startX + Math.cos(mouse.angle) * laserLength;
    laser.endY = laser.startY + Math.sin(mouse.angle) * laserLength;

    const r = Math.floor(Math.random() * 256); // Random red value (0-255)
    const g = Math.floor(Math.random() * 256); // Random green value (0-255)
    const b = Math.floor(Math.random() * 256); // Random blue value (0-255)

    // Set the laser color to a random RGB value
    laser.color = `rgba(${r}, ${g}, ${b}, 0.8)`; // Semi-transparent with random color
    ctx.strokeStyle = laser.color; // Set the laser's color
    ctx.lineWidth = laser.width; // Set the laser's width
    ctx.beginPath();
    ctx.moveTo(laser.startX, laser.startY); // Start at the player's center
    ctx.lineTo(laser.endX, laser.endY); // Draw to the laser's endpoint
    ctx.stroke();

    
    // Check for collisions with enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        // Check if the laser intersects with the enemy
        const dx = enemy.x + enemy.size / 2 - laser.startX; // Distance from laser start to enemy center (x-axis)
        const dy = enemy.y + enemy.size / 2 - laser.startY; // Distance from laser start to enemy center (y-axis)
        const distanceToLaser = Math.abs(dy * Math.cos(mouse.angle) - dx * Math.sin(mouse.angle)); // Perpendicular distance to laser
        if (distanceToLaser <= laser.width + enemy.size / 2) { // consider enemy size
            // Enemy is within the laser's width
            const laserToEnemyDistance = Math.sqrt(dx * dx + dy * dy); // Distance from laser start to enemy center
            if (laserToEnemyDistance <= laserLength + enemy.size / 2) { // consider enemy size
            // Enemy is also within the laser's length
            const dotProduct = dx * Math.cos(mouse.angle) + dy * Math.sin(mouse.angle); // Calculate dot product
            if (dotProduct > 0) {
                // Ensure the enemy is in front of the laser
                enemy.health -= laser.damage; // Reduce enemy health by laser damage
                
            }
            }
        }
    }
}

const enemies = []; // Array to store all active enemies


class basicEnemy1 {
    

    constructor(x, y, speed, health, contactDamage, size, color) {
        this.x = x; // X position of the enemy
        this.y = y; // Y position of the enemy
        this.speed = speed; // Speed of the enemy
        this.health = health; // Health of the enemy
        this.contactDamage = contactDamage; // Damage dealt by the enemy on contact
        this.size = size; // Size of the enemy
        this.color = color; // Color of the enemy (for drawing purposes)
        this.maxHealth = health;

        this.dx = 0; // Velocity in the x direction 
        this.dy = 0; // Velocity in the y direction
    }

    // Update the enemy's position
    update() {
        // Calculate the angle to the player
        const angleToPlayer = Math.atan2(
            player.midy - this.y,
            player.midx - this.x
        );

        // Update the enemy's velocity based on the angle and speed
        this.dx = Math.cos(angleToPlayer) * this.speed;
        this.dy = Math.sin(angleToPlayer) * this.speed;

        // Update the enemy's position

        if (!paused){
            this.x += this.dx;
            this.y += this.dy;
        }
        

        //collision detection with player
        if (this.x < player.x + player.width && this.x + this.size > player.x && this.y < player.y + player.height && this.y + this.size > player.y) {
            // Collision detected, apply damage to the player
            player.health -= this.contactDamage; // Reduce player's health by enemy's contact damage
            // console.log(`Player hit! Health: ${player.health}`); // Log the player's health after being hit
            this.health = 0; //kill enemy after reaching player
        }

        //check collision with arrows
        for (let i = arrows.length - 1; i >= 0; i--) {
            const arrow = arrows[i];
            if (
                arrow.x < this.x + this.size &&
                arrow.x + 3 > this.x && // Arrow width is 3 pixels
                arrow.y < this.y + this.size &&
                arrow.y + 3 > this.y
            ) {
                // Collision detected with an arrow
                this.health -= arrow.damage; // Reduce enemy's health by the arrow's damage
                arrows.splice(i, 1); // Remove the arrow from the array after it hits the enemy
                console.log(`Enemy hit! Health: ${this.health}`); // Log the enemy's health after being hit
            }
        }
    }
}

function spawnEnemy1(speedMultiplier = 1, healthMultiplier = 1, sizeMultiplier = 1) { 
    let x = 0;
    if (Math.random() < 0.5) {
        x = 0;
    } else {
        x = 980;
    }
    const y = Math.random() * 600; // Random Y in range 0-600

    // make some stats for what to send over to the enemy constructor

    
    let speed = 1 * speedMultiplier * difficultyMultiplier * (1 + (Math.random() * 0.4 - 0.2)); // Speed of the enemy varies by ±20%
    let health = 30 * healthMultiplier * difficultyMultiplier; // Health of the enemy
    let contactDamage = 10 * difficultyMultiplier; // Damage dealt by the enemy on contact
    let size = 20 * sizeMultiplier * (1+difficultyMultiplier/20); // Size of the enemy
    let r = -100+Math.floor(Math.random() * 256); // Random red value (0-255)
    let g = -100+Math.floor(Math.random() * 156); // Random green value (0-255)
    let b = -100+Math.floor(Math.random() * 256); // Random blue value (0-255)

    let color = `rgb(${r}, ${g}, ${b})`; // Assign the randomized color to the enemy
    const enemy = new basicEnemy1(x, y, speed, health, contactDamage, size, color); // Create a new enemy instance
    
    enemies.push(enemy); // Add the enemy to the array of active enemies
}

function drawandUpdateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update(); // Update the enemy's position
        ctx.fillStyle = enemy.color; // Set the fill color for the enemy (use the randomized color)
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size); // Draw the enemy as a rectangle

        const healthPercentage = enemy.health / enemy.maxHealth; // Calculate the health percentage
        if (healthPercentage < 1 ){
        // draw health bar above the enemy 
        ctx.fillStyle = "red"; // Set the fill color for the health bar
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.size, 5); // Draw the background of the health bar

        ctx.fillStyle = "green"; // Set the fill color for the remaining health
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.size * healthPercentage, 5); // Draw the remaining health
        }
        
        

        // Remove the enemy if its health is zero or less
        if (enemy.health <= 0) {
            enemies.splice(i, 1); // Remove the enemy from the array
            player.gold += 10; // Increase player's gold by 10 when an enemy is defeated
            // console.log(`Enemy defeated! Player Gold: ${player.gold}`); // Log the player's gold after defeating an enemy
        }
    }
}



function nextRound(){
    currentRound++; // Increment the current round number
    difficultyMultiplier = 1 + (0.05 * (currentRound-1)); // Update the difficulty multiplier based on the new round number
    console.log(`Round ${currentRound} started!`); // Log the start of the new round
    spawnEnemy(); // Spawn a new enemy for the next round
}

function drawText(){
    
    //player information
    ctx.font = "26px times new roman"; // Set the font for player information
    ctx.fillStyle = "magenta"; // Set the fill color for player information

    if (debug) {
        // If debug mode is enabled, display additional information
        ctx.fillText(`Player Position: (${player.x}, ${player.y})`, 10, 30); // Display player position
        ctx.fillText(`mouse Position: (${Math.floor(mouse.x)}, ${Math.floor(mouse.y)})`, 10, 50); // Display mouse position
        ctx.fillText(`current weapon: ${player.weapon}`, 10, 70); // Display the current weapon name
        ctx.fillText(`Player Center: (${player.midx}, ${player.midy})`, 10, 90); // Display player center position

        ctx.fillText(`diffx: ${Math.round(diffx)}`, 10, 110); // Display the difference in x position from player to mouse
        ctx.fillText(`diffy: ${Math.round(diffy)}`, 10, 130); // Display the difference in y position from player to mouse
        ctx.fillText(`Angle to Mouse: ${mouse.angle.toFixed(2)} radians`, 10, 150); // Display the angle from player to mouse in radians
        ctx.fillText(`Angle to Mouse: ${mouse.angleDegrees.toFixed(2)} degrees`, 10, 170); // Display the angle from player to mouse in degrees (optional)
        ctx.fillText("Godmode: " + godmode, 10, 190); // Display godmode status (if enabled)
    }

    if (paused) {
        // If the game is paused, don't draw anything else
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background for the pause overlay
        ctx.fillText("Game Paused", canvas.width / 2 - 70, canvas.height * 1/3);
        
        //display the shop's contents:
        // draw small white box with outline to hold the shop
        
        ctx.fillStyle = "gray";
        ctx.fillText("press the following to use the shop", 10, 425);
        ctx.fillText("1 - buy max health", 10, 450);
        ctx.fillText("2 - buy speed", 10, 475);
        ctx.fillText("3 - buy weapon buff", 10, 500);
        ctx.fillText("Gurrent Gold: " + player.gold, 10, 525);
        ctx.fillText("current shop price: " + shop.price, 10, 550); // Display the current price of the shop item (if applicable)
  
    }

    //general player info
    ctx.fillStyle = "red"; // Set the fill color for player information
    ctx.fillText(`Speed: ${player.speed}`, canvas.width-200, 30); // Display player speed
    ctx.fillText(`Gold: ${player.gold}`, canvas.width-200, 50); // Display player gold
    ctx.fillText(`Round: ${currentRound}`, canvas.width-200, 70); // Display player rounds
    ctx.fillText(`Health: ${player.health}`, canvas.width-200, 90); // Display player health
    ctx.fillText(`Max Health: ${player.maxHealth}`, canvas.width-200, 110); // Display player max health
    ctx.fillText(`Armor: ${player.damageReduction}`, canvas.width-200, 130); // Display player damage reduction
    ctx.fillText(`Weapon buff: ${player.weaponBuff}`, canvas.width-200, 150); // Display player weapon size multiplier
    ctx.fillText(`current dmg: ${currentWeaponDamage}`, canvas.width-200, 170); // Display the current weapon damage (calculated based on the weapon type and buff)
    ctx.fillText(`Alive enemies: `, canvas.width-200, 190); // Display the number of alive enemies
    ctx.fillText(`${enemies.length}`, canvas.width-200, 210); // Display the number of alive enemies


    
}

let shop = { //holds the functions for buying stuff
    price: 100, // Base price for shop items (can be adjusted)

    increasePrice: function() {
        this.price = Math.floor(this.price * 1.1+25); // Increase the price by 10% after each purchase
    },

    buySpeed: function() {
        if(godmode){player.speed += .1;}
        else if (player.gold >= this.price) {
            player.speed += 0.1;
            player.gold -= this.price;
            this.increasePrice(); // Increase the price after a successful purchase
        } 
    },

    buyMaxHealth: function() {
        if(godmode){
            player.maxHealth += 10;
            player.Health += 10;
        }
        else if (player.gold >= this.price) {
            player.maxHealth += 10;
            player.health += 10;
            player.gold -= this.price;
            this.increasePrice(); // Increase the price after a successful purchase

        }
    },

    buyWeaponBuff: function() {
        if(godmode){player.weaponBuff += .1;}
        else if (player.gold >= this.price) {
            player.weaponBuff += 0.1; 
            player.gold -= this.price;
            this.increasePrice(); // Increase the price after a successful purchase

        }
    }
}

function spawnEnemies(){
    if (!isNaN(debugEnemySpawnCount) && debugEnemySpawnCount > 0) {
        for (let i = 0; i < debugEnemySpawnCount; i++) {
            spawnEnemy1(); // Spawn the specified number of enemies
        }
    } else{
        spawnEnemy1();
    }
}

calculateWeaponDamage(); // Initial calculation of weapon damage based on the default weapon
draw(); // Call the draw function