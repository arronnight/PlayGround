// Minimal static file server for the built output (./dist).
// No host allow-listing: the controller's tunnel hostname must be servable.
// Usage: node scripts/serve-static.mjs <root> <port>
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, resolve, normalize } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || process.env.PORT || 3000);
const mime = {
  '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
};

const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let path = normalize(join(root, decodeURIComponent(url.pathname)));
    if (path !== root && !path.startsWith(root + '/')) { res.writeHead(404); res.end(); return; }
    try {
      if (statSync(path).isDirectory()) path = join(path, 'index.html');
    } catch {
      path = join(root, 'index.html'); // SPA fallback
    }
    if (!existsSync(path)) { res.writeHead(404); res.end('Not found'); return; }
    res.setHeader('Content-Type', mime[extname(path)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(readFileSync(path));
  } catch {
    res.writeHead(404); res.end('Not found');
  }
});
server.listen(port, '0.0.0.0', () => console.log(`serving ${root} on :${port}`));
