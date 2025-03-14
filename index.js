var button = document.querySelector("button1");
var botState = false;

function myFunction() {
    if (!botState) {
        document.getElementById("ezTitle").textContent = "bot";
        botState = true;
    } else{
        document.getElementById("ezTitle").textContent = "ez";
        botState = false;
    }
    
}

