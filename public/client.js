const socket = io("http://localhost:5173");

// Get canvas and context
const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color");
const clearButton = document.getElementById("clear");

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

let drawing = false;
let currentColor = "#000000";

// Start drawing
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

// Track drawing movement
canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;

    const drawData = { x, y, color: currentColor };
    socket.emit("draw", drawData);
});

// Listen for drawing events from the server
socket.on("draw", (data) => {
    drawOnCanvas(data.x, data.y, data.color);
});

// Draw function
function drawOnCanvas(x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Color selection
colorPicker.addEventListener("change", (e) => {
    currentColor = e.target.value;
});

// Clear board event
clearButton.addEventListener("click", () => {
    socket.emit("clearBoard");
});

// Listen for clearBoard event from the server
socket.on("clearBoard", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Load existing board state on connect
socket.on("loadBoard", (board) => {
    board.forEach(({ x, y, color }) => {
        drawOnCanvas(x, y, color);
    });
});
