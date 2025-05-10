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

function loadHeader() { // loading header, css, and more
    //loading the header
    fetch("/header.html")
        .then(response => response.text())
        .then(data => {
            const headerElement = document.getElementById("header");
            headerElement && (headerElement.innerHTML = data);
        });
        
    //loading the CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "/styles.css"; // Path to your CSS file
    cssLink.type = "text/css";

    // checking if CSS is loaded already
    if (!document.querySelector(`link[href="/styles.css"]`)) {
        document.head.appendChild(cssLink);
    }

    //icon
    const faviconLink = document.createElement("link");
    faviconLink.rel = "icon";
    faviconLink.type = "image/x-icon";
    faviconLink.href = "/peon.png"; // Path to your favicon

    //check if already loaded
    if (!document.querySelector(`link[href="/peon.png"]`)) {
        document.head.appendChild(faviconLink);
    }
}
