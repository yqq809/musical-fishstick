const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const decodedPath = decodeURIComponent(req.url);
    const fullPath = path.join(__dirname, decodedPath);
    
    let filePath = fullPath;
    if (req.url === '/' || req.url === '') {
        filePath = path.join(__dirname, 'index.html');
    }
    
    const extname = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.gif': 'image/gif',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
    }[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, extname === '.html' || extname === '.js' || extname === '.css' ? 'utf-8' : undefined);
        }
    });
});

server.listen(8091, () => {
    console.log('Server running on http://127.0.0.1:8091');
});