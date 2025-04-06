const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Get the absolute path to the project root directory
const projectRoot = path.join(__dirname, '..');

// Serve static files from the project root
app.use(express.static(projectRoot));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(projectRoot, 'index.html'));
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // Handle game moves and state updates
        console.log('Received message:', message);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
