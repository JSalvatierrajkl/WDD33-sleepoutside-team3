import { createServer } from 'http';
import { existsSync, statSync } from 'fs';
import { join, extname, resolve, normalize } from 'path';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const port = parseInt(process.env.PORT || 5173);
const distPath = resolve(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  urlPath = decodeURIComponent(urlPath);
  
  if (urlPath === '/') {
    urlPath = '/index.html';
  }
  
  let filePath = join(distPath, urlPath);
  filePath = normalize(filePath);
  
  if (!filePath.startsWith(distPath)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>');
    return;
  }
  
  const ext = extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': contentType });
    const stream = createReadStream(filePath);
    stream.on('error', (err) => {
      console.error('Error reading file:', err);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>500 - Internal Server Error</h1>');
    });
    stream.pipe(res);
  } else {
    if (urlPath.endsWith('/')) {
      const indexPath = join(filePath, 'index.html');
      if (existsSync(indexPath) && statSync(indexPath).isFile()) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        createReadStream(indexPath).pipe(res);
        return;
      }
    }
    
    const rootIndex = join(distPath, 'index.html');
    if (existsSync(rootIndex) && statSync(rootIndex).isFile()) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      createReadStream(rootIndex).pipe(res);
    } else {
      console.error(`File not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
    }
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log(`Serving files from: ${distPath}`);
  console.log(`Dist directory exists: ${existsSync(distPath)}`);
});

