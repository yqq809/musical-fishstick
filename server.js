const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

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
        '.jpg': 'image/jpeg',
        '.mp3': 'audio/mpeg',
        '.json': 'application/json'
    }[extname] || 'application/octet-stream';
    
    // 检查文件是否存在
    fs.stat(filePath, (statError, stats) => {
        if (statError) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        // 检查是否支持压缩
        const acceptEncoding = req.headers['accept-encoding'] || '';
        const shouldCompress = /(gzip|deflate)/i.test(acceptEncoding);
        const compressibleTypes = ['.html', '.js', '.css', '.json'];
        const canCompress = shouldCompress && compressibleTypes.includes(extname);
        
        // 设置缓存头
        const cacheControl = extname === '.html' ? 'no-cache' : 'public, max-age=31536000';
        
        // 创建读取流
        const readStream = fs.createReadStream(filePath);
        
        // 设置响应头
        const headers = {
            'Content-Type': contentType,
            'Cache-Control': cacheControl,
            'Content-Length': stats.size
        };
        
        // 添加压缩
        if (canCompress) {
            const encoding = acceptEncoding.includes('gzip') ? 'gzip' : 'deflate';
            headers['Content-Encoding'] = encoding;
            delete headers['Content-Length'];
            
            res.writeHead(200, headers);
            if (encoding === 'gzip') {
                readStream.pipe(zlib.createGzip()).pipe(res);
            } else {
                readStream.pipe(zlib.createDeflate()).pipe(res);
            }
        } else {
            res.writeHead(200, headers);
            readStream.pipe(res);
        }
        
        readStream.on('error', () => {
            res.writeHead(500);
            res.end('Server error');
        });
    });
});

server.listen(8091, () => {
    console.log('Server running on http://127.0.0.1:8091');
});