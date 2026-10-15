#!/usr/bin/env bash
# Serve the built PPSSPP web shell (Angular static bundle) in the foreground.
# Writes deployment-output.json, installs/builds when needed, then serves
# the static directory on PORT (default 3000) with cross-origin isolation
# headers (COOP/COEP) so SharedArrayBuffer/WASM threads work in the browser.
set -euo pipefail
cd "$(dirname "$0")"
PROJECT_ROOT="$PWD"
PORT="${PORT:-3000}"
export PORT
APP_DIR="$PROJECT_ROOT/ppsspp-web/wasm-page"
DIST_DIR="$APP_DIR/dist/ppsspp-web"
export DIST_DIR
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"

/usr/bin/time -p test -d "$APP_DIR"
/usr/bin/time -p mkdir -p "$WEB_DIR"
if [[ ! -d "$APP_DIR/node_modules" ]]; then
  /usr/bin/time -p npm --prefix "$APP_DIR" install
fi
if [[ ! -f "$DIST_DIR/index.html" ]] || [[ -n "$(/usr/bin/time -p find "$APP_DIR/src" "$APP_DIR/public" "$APP_DIR/package.json" "$APP_DIR/angular.json" -newer "$DIST_DIR/index.html" 2>/dev/null | head -1)" ]]; then
  /usr/bin/time -p npm --prefix "$APP_DIR" run build
fi
/usr/bin/time -p test -f "$DIST_DIR/index.html"
/usr/bin/time -p /usr/bin/printf '{"project":"%s","directory":"%s"}\n' "$PROJECT_ROOT" "$DIST_DIR" > "$WEB_DIR/deployment-output.json"
/usr/bin/time -p node -e 'const fs=require("node:fs");const w=process.env.OPENCODE_WEB_DIR||"/home/runner/work/_temp/omgithub-web";JSON.parse(fs.readFileSync(w+"/deployment-output.json","utf8"));console.log("deployment-output.json is valid JSON");'
/usr/bin/time -p node -e '
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = process.env.DIST_DIR;
const port = Number(process.env.PORT || 3000);
const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};
http.createServer((req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let file = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(404);
      res.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, "index.html");
    }
    if (!fs.existsSync(file)) {
      file = path.join(root, "index.html");
    }
    res.setHeader("Content-Type", mime[path.extname(file).toLowerCase()] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.end(fs.readFileSync(file));
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, "0.0.0.0", () => console.log("Serving " + root + " on :" + port));
'
