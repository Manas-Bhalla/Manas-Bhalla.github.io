const canvas = document.getElementById("gameCanvasProject3");
const ctx = canvas.getContext("2d");

let paused = false; // Declare the paused variable
let debug = false; // Declare the debug variable
let godmode = false; // Declare the godmode variable 

var gameOver = false;

//mouse properties
let mouse = {
    x: 0, // Mouse x position
    y: 0, // Mouse y position
}

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
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
    drawText(); //draw all the text

    requestAnimationFrame(draw); // Request the next frame for animation
}

function drawText(){

    ctx.font = "26px times new roman"; // Set the font for player information
    ctx.fillStyle = "blue"; // Set the fill color for player information

    ctx.fillText(`mouse Position: (${Math.floor(mouse.x)}, ${Math.floor(mouse.y)})`, 10, 50); // Display mouse position

}