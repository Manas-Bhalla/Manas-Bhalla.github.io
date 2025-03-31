const canvas = document.getElementById("gameCanvasProject2");
const ctx = canvas.getContext("2d");

var diffx = 0; // Difference in x position from player to mouse
var diffy = 0; // Difference in y position from player to mouse

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
    if (player.weapon === "staff") {
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
                // Logic for staff 
                console.log("Staff used!"); // Placeholder for staff action
                break;
            default: console.log(`No action for: ${player.weapon}`); 
                break;
        }
    }
});



let paused = false; // Declare the paused variable
let debug = false; // Declare the debug variable
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
    rounds: 0, // Number of rounds completed by the player
    speed: 3, // Speed of the player icon
    weapon: "sword", // Default weapon selected by the player
    midx: 0,
    midy: 0,
    weaponSizeMultiplier: 1, 
    
    // midx and midy are used to calculate the center of the player icon for angle calculations
};



const keys = {}; // Object to keep track of key states
// This object will store the state of each key (pressed or not)

// buttons from html file:
const pauseButton = document.getElementById("pauseButtonProject2");
const debugButton = document.getElementById("debugButtonProject2");
const resetButton = document.getElementById("resetButtonProject2");

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

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "z": // Toggle debug mode
            debug = !debug; // Toggle the debug variable
            break;
        case " ": // Toggle pause
            paused = !paused; // Toggle the paused variable
            break;
        case "r": // Reset player position and stats
            reset(); // Call the reset function to reset player stats
            break;
        case "1": // Select weapon 1 (e.g., sword)
            player.weapon = "sword";
            break;
        case "2": // Select weapon 2 (e.g., bow)
            player.weapon = "bow";
            break;
        case "3": // Select weapon 3 (e.g., staff)
            player.weapon = "staff";
            break;
    }
});


document.addEventListener("keydown", (event) => {
    keys[event.key] = true; // Mark the key as pressed
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false; // Mark the key as released
});


// Example: Draw a rectangle on the canvas
function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
    
    if (paused) {
        // If the game is paused, don't draw anything else
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background for the pause overlay
        ctx.fillText("Game Paused", canvas.width / 2 - 70, canvas.height / 2);
    }


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
    drawSwordSwing(); // Draw the sword swing arc if active
    updateLaser();
    

    ctx.fillStyle = "rgb(11, 15, 238)";
    //player icon
    ctx.fillRect(player.x, player.y, player.width, player.height); // Draw a rectangle

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

    }
    ctx.fillStyle = "red"; // Set the fill color for player information
    ctx.fillText(`Speed: ${player.speed}`, canvas.width-200, 30); // Display player speed
    ctx.fillText(`Gold: ${player.gold}`, canvas.width-200, 50); // Display player gold
    ctx.fillText(`Round: ${player.rounds}`, canvas.width-200, 70); // Display player rounds

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

    
    requestAnimationFrame(draw); // Request the next frame for animation

}

function reset(){
    player.x = 50; // Reset x position
    player.y = 50; // Reset y position
    player.speed = 3; // Reset speed
    player.gold = 0; // Reset gold collected
    player.rounds = 0; // Reset rounds completed
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
        5, // Speed of the arrow
        10, // Damage dealt by the arrow
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
    radius: 50, // Radius of the swing arc
    duration: 300, // Duration of the swing in milliseconds
    startTime: 0, // Timestamp when the swing started
};

function startSwordSwing() {
    if (swordSwing.active) return; // Prevent overlapping swings

    swordSwing.active = true;
    swordSwing.startAngle = mouse.angle - Math.PI / 4; // Start 45 degrees to the left of the mouse angle
    swordSwing.endAngle = mouse.angle + Math.PI / 4; // End 45 degrees to the right of the mouse angle
    swordSwing.startTime = performance.now(); // Record the start time
}

function updateSwordSwing() {
    if (!swordSwing.active) {return;}

    const elapsedTime = performance.now() - swordSwing.startTime;
    if (elapsedTime >= swordSwing.duration) {
        swordSwing.active = false; // End the swing animation
        return;
    }
}

function drawSwordSwing() {
    if (!swordSwing.active) return;

    const elapsedTime = performance.now() - swordSwing.startTime;
    const progress = elapsedTime / swordSwing.duration; // Progress of the swing (0 to 1)
    const currentAngle = swordSwing.startAngle + (swordSwing.endAngle - swordSwing.startAngle) * progress;

    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red for the swing arc
    ctx.lineWidth = 55 * player.weaponSizeMultiplier; // Line width based on weapon size multiplier
    ctx.beginPath();
    ctx.arc(
        player.midx, // Center of the player
        player.midy,
        swordSwing.radius, // Radius of the swing
        swordSwing.startAngle, // Start angle of the arc
        currentAngle // Current angle of the arc
    );
    ctx.stroke();
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
};

function updateLaser() {
    if (laser.active == false) return;

    // Set the starting position to the player's center
    laser.startX = player.midx;
    laser.startY = player.midy;

    // Calculate the laser's endpoint far in the direction of the mouse
    var laserLength = 500 * player.weaponSizeMultiplier; //large value for the laser's length
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
}


draw(); // Call the draw function