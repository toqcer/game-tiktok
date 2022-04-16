const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require("socket.io");
const { WebcastPushConnection } = require('tiktok-live-connector');

const PORT = process.env.PORT || 6996;
const BASE_DIR = path.join(__dirname, "../")


// setup request handler
let handleRequest = (req, res) => {
    let requestURL = req.url;
    if (requestURL === "/") {
        requestURL = "/index.html";
    }
    if (requestURL === "/tebak") {
        requestURL = "/tebak.html";
    }

    let extention = path.extname(requestURL);
    const mimeType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.ico': 'image/icon',
    };
    let contentType = mimeType[extention] || 'text/plain';

    fs.readFile(BASE_DIR + requestURL,
        (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Internal Server Error : ' + err);
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    )
}

let server = http.createServer(handleRequest);
const io = new Server(server);

// Setup Tiktok connector
let tiktokUsername = "shendytini14";

// Create a new wrapper object and pass the username
let tiktokChatConnection = new WebcastPushConnection(tiktokUsername);

// Setup Socket io
tiktokChatConnection.connect().then(state => {
    console.info(`Connected to roomId ${state.roomId}`);
}).catch(err => {
    console.error('Failed to connect', err);
});

io.on('connection', (socket) => {
    tiktokChatConnection.on('chat', data => {
        socket.emit('chat', data);
    });
    tiktokChatConnection.on('gift', data => {
        socket.emit('gift', data);
    })
});
server.listen(PORT, () => console.log('Listening on Port ' + PORT))
