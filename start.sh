#!/usr/bin/env bash
# FusionOS project startup: build fusion-os (vite) and serve ./dist on PORT.
set -euo pipefail
cd "$(dirname "$0")" # chdir is a shell builtin; /usr/bin/time cannot wrap it
/usr/bin/time -p pwd >/dev/null
PROJECT_DIR="$(/usr/bin/time -p pwd)"
PORT="${PORT:-3000}"
export PORT
APP_SRC="$PROJECT_DIR/fusion-os"
OUT_DIR="$PROJECT_DIR/dist"
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"

/usr/bin/time -p test -f "$APP_SRC/package.json"
/usr/bin/time -p test -f "$APP_SRC/vite.config.ts"

# Install dependencies when needed (missing node_modules or manifest newer).
if [[ ! -d "$APP_SRC/node_modules" ]] || [[ "$APP_SRC/package.json" -nt "$APP_SRC/node_modules/.package-lock.json" ]]; then
  if [[ -f "$APP_SRC/package-lock.json" ]]; then
    /usr/bin/time -p npm --prefix "$APP_SRC" ci --no-audit --no-fund
  else
    /usr/bin/time -p npm --prefix "$APP_SRC" install --no-audit --no-fund
  fi
else
  echo "start.sh: dependencies up to date, skipping install."
fi

# Build when needed (missing output or any source newer than output).
NEED_BUILD=0
if [[ ! -f "$APP_SRC/dist/index.html" ]]; then
  NEED_BUILD=1
elif [[ -n "$(/usr/bin/time -p find "$APP_SRC/src" "$APP_SRC/index.html" "$APP_SRC/package.json" "$APP_SRC/vite.config.ts" -newer "$APP_SRC/dist/index.html" -print -quit 2>/dev/null)" ]]; then
  NEED_BUILD=1
fi
if [[ "$NEED_BUILD" == 1 ]]; then
  /usr/bin/time -p npm --prefix "$APP_SRC" run build
else
  echo "start.sh: build output up to date, skipping build."
fi

# Publish built output inside PROJECT_DIR (./dist) for the deployment contract.
/usr/bin/time -p mkdir -p "$OUT_DIR"
/usr/bin/time -p cp -r "$APP_SRC/dist/." "$OUT_DIR/"
/usr/bin/time -p test -f "$OUT_DIR/index.html"

# Worker metadata only: record where the static output lives.
/usr/bin/time -p mkdir -p "$WEB_DIR"
/usr/bin/time -p node -e '
const fs = require("node:fs");
const [project, directory, out] = process.argv.slice(1);
fs.writeFileSync(out, JSON.stringify({ project, directory }) + "\n");
' "$PROJECT_DIR" "$OUT_DIR" "$WEB_DIR/deployment-output.json"
/usr/bin/time -p cat "$WEB_DIR/deployment-output.json"

echo "start.sh: serving $OUT_DIR on port $PORT (foreground)."

# Minimal static server with SPA fallback; runs in the foreground.
exec /usr/bin/time -p node -e '
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = process.argv[1];
const port = Number(process.env.PORT || "3000");
const mime = { ".html": "text/html", ".js": "application/javascript", ".mjs": "application/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".wasm": "application/wasm" };
const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let p = path.normalize(path.join(root, decodeURIComponent(url.pathname)));
    if (p !== root && !p.startsWith(root + path.sep)) { res.writeHead(404); res.end("Not found"); return; }
    let file = p;
    try { if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html"); } catch { file = path.join(root, "index.html"); }
    if (!fs.existsSync(file)) file = path.join(root, "index.html");
    res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.end(fs.readFileSync(file));
  } catch { res.writeHead(404); res.end("Not found"); }
});
server.listen(port, "0.0.0.0", () => console.log("Serving " + root + " on port " + port));
' "$OUT_DIR"
