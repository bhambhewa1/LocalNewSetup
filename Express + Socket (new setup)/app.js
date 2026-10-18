const express = require('express');
const app = express();
const { Server } = require('socket.io');
const { createServer } = require('http')

const {
    messages,
    severities
} = require("./constants");
const routers = require("./routes/index")
const port = 3001;

// Json body parse middleware
app.use(express.json());

// Routing files middleware
app.use('/api', routers);

//---------------- Connection of socket.io --------------
const server = createServer()
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["POST", "GET"]
    }
})
io.on("connection", () => {
    console.log("backend socket connected!")
})

// Send alert every 5 seconds
setInterval(async () => {
    const alert = {
        timestamp: new Date().toISOString(),
        message:
            messages[
            Math.floor(Math.random() * messages.length)
            ],
        severity:
            severities[
            Math.floor(Math.random() * severities.length)
            ]
    };
    // console.log("Broadcasting:", alert);

    // Broadcast to all connected clients
    io.emit('alert', alert)

}, 5000);

// Socket server start on port 8080
server.listen(8080, () => {
    console.log("Socket server is running on 8080");
})
// ----------------------- End of Socket -----------------

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;