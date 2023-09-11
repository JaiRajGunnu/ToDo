const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 8000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // Add your socket.io event handlers here
    // For example, you can handle tasks updates and sync with other clients
    socket.on('updateTasks', (updatedTasks) => {
        // Broadcast the updated tasks to all connected clients
        io.emit('tasksUpdated', updatedTasks);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});