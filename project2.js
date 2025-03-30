const canvas = document.getElementById("gameCanvasProject2");
const ctx = canvas.getContext("2d");

//mouse properties
let mouse = {
    x: 0, // Mouse x position
    y: 0, // Mouse y position
}
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect(); // Get canvas position and size
    mouse.x = event.clientX - rect.left; // Calculate X relative to the canvas
    mouse.y = event.clientY - rect.top; // Calculate Y relative to the canvas
});

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Get canvas position and size
    const clickX = event.clientX - rect.left; // Calculate X relative to the canvas
    const clickY = event.clientY - rect.top; // Calculate Y relative to the canvas

    console.log(`Mouse clicked at: (${clickX}, ${clickY})`); // Log the click position
});

let paused = false; // Declare the paused variable
let debug = false; // Declare the debug variable
var player = {
    x: 50, // Initial x position of the player
    y: 50, // Initial y position of the player
    width: 25, // Width of the player icon
    height: 25, // Height of the player icon
    speed: 3, // Speed of the player icon (can be upgraded!)
    gold: 0, // Number of coins collected by the player (can be used for upgrades!)
    rounds: 0, // Number of rounds completed by the player 
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
    requestAnimationFrame(draw);
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
    }
    ctx.fillStyle = "red"; // Set the fill color for player information
    ctx.fillText(`Speed: ${player.speed}`, canvas.width-200, 30); // Display player speed
    ctx.fillText(`Gold: ${player.gold}`, canvas.width-200, 50); // Display player gold
    ctx.fillText(`Round: ${player.rounds}`, canvas.width-200, 70); // Display player rounds

    if(player.x<0){player.x=0}
    if(player.x + player.width > canvas.width){player.x = canvas.width - player.width} // Prevent player from going out of bounds on the right side
    if(player.y<0){player.y=0} // Prevent player from going out of bounds on the top side
    if(player.y + player.height > canvas.height){player.y = canvas.height - player.height} // Prevent player from going out of bounds on the bottom side
}

function reset(){
    player.x = 50; // Reset x position
    player.y = 50; // Reset y position
    player.speed = 3; // Reset speed
    player.gold = 0; // Reset gold collected
    player.rounds = 0; // Reset rounds completed
}

draw(); // Call the draw function