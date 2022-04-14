const http = require('http');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 6996;
const BASE_DIR = path.join(__dirname, "../")

let handleRequest = (req, res) => {
    let requestURL = req.url;
    if (requestURL === "/") {
        requestURL = "/index.html";
    }

    let extention = path.extname(requestURL);

    const mimeType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
    };
    let contentType = mimeType[extention] || 'text/plain';

    fs.readFile(BASE_DIR + requestURL,
        (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Internal Server Error : ' + requestURL);
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    )
}

let server = http.createServer(handleRequest);

server.listen(PORT, () => console.log('Listening on Port ' + PORT))
