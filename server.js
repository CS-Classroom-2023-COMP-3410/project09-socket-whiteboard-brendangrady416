const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    },
});

app.use(cors());
app.use(express.static('public')); // Serve static files from 'public' folder

let boardState = []; // Store drawing actions

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send the current board state to new clients
    socket.emit('loadBoard', boardState);

    // Listen for drawing actions and broadcast them
    socket.on('draw', (data) => {
        boardState.push(data);
        socket.broadcast.emit('draw', data);
    });

    // Handle clear board event
    socket.on('clearBoard', () => {
        boardState = []; // Reset board state
        io.emit('clearBoard');
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:5173`);
});
