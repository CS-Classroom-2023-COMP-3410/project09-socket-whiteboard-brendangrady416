const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let boardState = []; // Stores drawn points


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send the current board state to the new client
    socket.emit("boardState", boardState);

    // Listen for drawing events
    socket.on("draw", (data) => {
        console.log("Received drawing data:", data);
        boardState.push(data);

        // Send the drawing event to ALL clients, including the sender
        io.emit("draw", data);
    });

    // Handle board clear event
    socket.on("clearBoard", () => {
        console.log("Board cleared");
        boardState = [];
        io.emit("clearBoard"); // Send event to all clients
    });
    
    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(5173, () => {
    console.log("Server running on port 5173");
});