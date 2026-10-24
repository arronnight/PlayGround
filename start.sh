#!/usr/bin/env bash
# Install, build when stale, publish deployment metadata, and serve the built
# game in the foreground on PORT (default 3000). Build output stays inside
# PROJECT_DIR; worker metadata stays under OPENCODE_WEB_DIR.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
export PORT
APP_DIR="$PROJECT_DIR/openmon"
STATIC_DIR="$APP_DIR/dist"
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
export OMGITHUB_STATIC_DIR="$STATIC_DIR"

case "$STATIC_DIR" in
  "$PROJECT_DIR"/*) ;;
  *)
    echo "start.sh: static directory must be inside PROJECT_DIR." >&2
    exit 1
    ;;
esac

timed() {
  local label="$1"
  shift
  printf '\n[start.sh] %s\n' "$label" >&2
  /usr/bin/time -p "$@"
}

static_output_is_stale() {
  if [ ! -f "$STATIC_DIR/index.html" ] || [ ! -d "$STATIC_DIR/models" ]; then
    return 0
  fi
  if [ "$APP_DIR/package.json" -nt "$STATIC_DIR/index.html" ]; then
    return 0
  fi
  if [ -f "$APP_DIR/package-lock.json" ] && [ "$APP_DIR/package-lock.json" -nt "$STATIC_DIR/index.html" ]; then
    return 0
  fi
  if [ -f "$APP_DIR/vite.config.ts" ] && [ "$APP_DIR/vite.config.ts" -nt "$STATIC_DIR/index.html" ]; then
    return 0
  fi
  for source_dir in "$APP_DIR/src" "$APP_DIR/public" "$APP_DIR/data"; do
    if [ -d "$source_dir" ] && find "$source_dir" -type f -newer "$STATIC_DIR/index.html" -print -quit 2>/dev/null | grep -q .; then
      return 0
    fi
  done
  return 1
}

timed "verify application directory" test -d "$APP_DIR"
timed "verify package manifest" test -f "$APP_DIR/package.json"

if [ ! -d "$APP_DIR/node_modules" ] ||
   [ "$APP_DIR/package.json" -nt "$APP_DIR/node_modules" ] ||
   { [ -f "$APP_DIR/package-lock.json" ] && [ "$APP_DIR/package-lock.json" -nt "$APP_DIR/node_modules" ]; }; then
  if [ -f "$APP_DIR/package-lock.json" ]; then
    timed "install dependencies (npm ci)" npm --prefix "$APP_DIR" ci --no-audit --no-fund
  else
    timed "install dependencies (npm install)" npm --prefix "$APP_DIR" install --no-audit --no-fund
  fi
else
  echo "[start.sh] dependencies are up to date" >&2
fi

printf '\n[start.sh] check static output freshness\n' >&2
if static_output_is_stale; then
  timed "build static output" npm --prefix "$APP_DIR" run build
  timed "stage runtime assets" npm --prefix "$APP_DIR" run desktop:assets
else
  echo "[start.sh] static output is up to date" >&2
fi

timed "verify built index" test -f "$STATIC_DIR/index.html"
timed "verify staged models" test -d "$STATIC_DIR/models"

timed "create worker metadata directory" mkdir -p "$WEB_DIR"
timed "write deployment metadata" node -e '
const { writeFileSync } = require("node:fs");
const [file, project, directory] = process.argv.slice(1);
writeFileSync(file, JSON.stringify({ project, directory }));
' "$WEB_DIR/deployment-output.json" "$PROJECT_DIR" "$STATIC_DIR"
timed "verify deployment metadata" test -s "$WEB_DIR/deployment-output.json"

echo "Serving $STATIC_DIR on 0.0.0.0:$PORT (project $PROJECT_DIR)" >&2
exec /usr/bin/time -p node -e '
const { createServer } = require("node:http");
const { readFileSync, existsSync, statSync } = require("node:fs");
const { join, extname, resolve, sep } = require("node:path");
const root = process.env.OMGITHUB_STATIC_DIR;
const port = Number(process.env.PORT || "3000");
const mime = { ".html": "text/html", ".js": "application/javascript", ".mjs": "application/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav", ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".wasm": "application/wasm", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
createServer((req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let path = resolve(root, "." + decodeURIComponent(url.pathname));
    if (path !== resolve(root) && !path.startsWith(resolve(root) + sep)) { res.writeHead(404); res.end(); return; }
    let file = path;
    try { if (statSync(path).isDirectory()) file = join(path, "index.html"); } catch { file = path; }
    if (!existsSync(file) && !extname(path)) file = join(root, "index.html");
    const content = readFileSync(file);
    res.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.end(content);
  } catch { res.writeHead(404); res.end("Not found"); }
}).listen(port, "0.0.0.0", () => console.error("Listening on " + port));
'
