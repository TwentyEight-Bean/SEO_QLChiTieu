import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

import waitlistHandler from '../api/waitlist.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const IS_STAGING = process.env.STAGING === 'true' || true;

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self' https:;");

  // Staging Noindex Header: If staging environment, prevent search engines from indexing
  if (IS_STAGING) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  // Handle Waitlist API
  if (pathname === '/api/waitlist') {
    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
      if (bodyData.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      try {
        req.body = bodyData ? JSON.parse(bodyData) : {};
      } catch {
        req.body = {};
      }
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };
      waitlistHandler(req, res);
    });
    return;
  }

  // Handle Static Files & Routes
  let filePath = path.join(distDir, pathname);

  // Check direct file match
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(filePath, 200, res, req);
  }

  // Check directory with index.html (Clean SEO routes: /tinh-nang -> dist/tinh-nang/index.html)
  const nestedIndex = path.join(distDir, pathname, 'index.html');
  if (fs.existsSync(nestedIndex) && fs.statSync(nestedIndex).isFile()) {
    return serveFile(nestedIndex, 200, res, req);
  }

  // Check route without trailing slash or with .html
  if (fs.existsSync(`${filePath}.html`) && fs.statSync(`${filePath}.html`).isFile()) {
    return serveFile(`${filePath}.html`, 200, res, req);
  }

  // Unknown route -> Real HTTP 404 response with 404.html content
  const notFoundPath = path.join(distDir, '404.html');
  if (fs.existsSync(notFoundPath)) {
    return serveFile(notFoundPath, 404, res, req);
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('404 Not Found');
});

function serveFile(file, statusCode, res, req) {
  const ext = path.extname(file).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);

  // Cache-Control headers
  if (file.includes('assets') || file.includes('fonts')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (ext === '.html') {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  const content = fs.readFileSync(file);
  const acceptEncoding = req.headers['accept-encoding'] || '';

  if (/\bgzip\b/.test(acceptEncoding) && content.length > 512) {
    res.setHeader('Content-Encoding', 'gzip');
    zlib.gzip(content, (err, gzipped) => {
      if (err) return res.end(content);
      res.end(gzipped);
    });
  } else {
    res.end(content);
  }
}

server.listen(PORT, HOST, () => {
  console.log(`[STAGING SERVER] Running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`[STAGING SERVER] Environment: ${IS_STAGING ? 'STAGING (X-Robots-Tag: noindex, nofollow)' : 'PRODUCTION'}`);
  console.log(`[STAGING SERVER] Real 404 Handling: ACTIVE`);
  console.log(`[STAGING SERVER] Waitlist API: http://localhost:${PORT}/api/waitlist`);
});
