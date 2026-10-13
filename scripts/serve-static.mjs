// serve-static.mjs — minimal static file server for the built dist/ directory.
// No dependencies. Serves DIST_DIR (arg 1) on PORT in the foreground.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, extname, normalize } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const port = Number(process.env.PORT || 3000);
if (!existsSync(join(root, 'index.html'))) {
  console.error(`Static deployment output must contain index.html (missing in ${root}).`);
  process.exit(1);
}
const mime = {
  '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
};
const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const rel = decodeURIComponent(url.pathname);
    const path = normalize(join(root, '.' + rel));
    if (path !== root && !path.startsWith(root + '/')) { res.writeHead(404); res.end('Not found'); return; }
    const st = statSync(path);
    const file = st.isDirectory() ? join(path, 'index.html') : path;
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(readFileSync(file));
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(port, '0.0.0.0', () => console.log(`[serve-static] serving ${root} on :${port}`));
