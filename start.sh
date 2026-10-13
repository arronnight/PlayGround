#!/usr/bin/env bash
# Serve Fable City (one Vite game) as a static site.
# Layout: PROJECT_DIR/dist/{index.html,gta/} — index.html redirects straight into the game.
# Writes $OPENCODE_WEB_DIR/deployment-output.json, serves $DIST on $PORT.
set -euo pipefail
cd "$(dirname "$0")"
PROJECT_DIR="$(/usr/bin/time -p pwd)"
/usr/bin/time -p test -n "${OPENCODE_WEB_DIR:?OPENCODE_WEB_DIR must be set}"
/usr/bin/time -p test -n "${PORT:=3000}"
/usr/bin/time -p printf 'start: project=%s dist=%s/dist port=%s\n' "$PROJECT_DIR" "$PROJECT_DIR" "$PORT"
DIST="$PROJECT_DIR/dist"
/usr/bin/time -p mkdir -p "$DIST"
/usr/bin/time -p mkdir -p "$OPENCODE_WEB_DIR"
/usr/bin/time -p printf 'worker temp: %s\n' "${RUNNER_TEMP:-unset}"

build_app() {
  src="$1"; destname="$2"
  srcdir="$PROJECT_DIR/$src"; destdir="$DIST/$destname"
  /usr/bin/time -p test -d "$srcdir"
  # Install when node_modules is missing or the lockfile is newer.
  if /usr/bin/time -p test ! -d "$srcdir/node_modules" || /usr/bin/time -p test "$srcdir/package-lock.json" -nt "$srcdir/node_modules"; then
    /usr/bin/time -p npm --prefix "$srcdir" ci --no-audit --no-fund
  else
    /usr/bin/time -p printf 'deps up to date: %s\n' "$src"
  fi
  # Rebuild when the output is missing or any source is newer.
  stale=1
  if /usr/bin/time -p test -f "$destdir/index.html"; then
    if /usr/bin/time -p test -z "$(/usr/bin/time -p find "$srcdir/src" "$srcdir/index.html" "$srcdir/package.json" -newer "$destdir/index.html" -print -quit)"; then
      stale=0
    fi
  fi
  if /usr/bin/time -p test "$stale" -eq 0; then
    /usr/bin/time -p printf 'build up to date: %s\n' "$destname"
  else
    /usr/bin/time -p npm --prefix "$srcdir" run build -- --base=./
    /usr/bin/time -p rm -rf "$destdir"
    /usr/bin/time -p mkdir -p "$destdir"
    /usr/bin/time -p cp -r "$srcdir/dist/." "$destdir/"
    /usr/bin/time -p test -f "$destdir/index.html"
  fi
}

/usr/bin/time -p printf 'building game...\n'
build_app gta_fable5.1 gta

/usr/bin/time -p tee "$DIST/index.html" > /dev/null <<'HTML'
<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="refresh" content="0; url=./gta/" />
<link rel="canonical" href="./gta/" />
<title>Fable City</title>
<style>body{font-family:system-ui,sans-serif;background:#141630;color:#fff;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center}main{max-width:640px;padding:32px;text-align:center}a{color:#ffd24a}</style>
</head>
<body><main>
<h1>FABLE CITY</h1>
<p>Loading… <a href="./gta/">click here if you are not redirected</a></p>
<script>location.replace("./gta/");</script>
</main></body>
</html>
HTML
/usr/bin/time -p test -f "$DIST/index.html"
/usr/bin/time -p test -f "$DIST/gta/index.html"

/usr/bin/time -p node -e 'const fs=require("node:fs");const dir=process.argv[1]+"/dist";fs.writeFileSync(process.env.OPENCODE_WEB_DIR+"/deployment-output.json",JSON.stringify({project:process.argv[1],directory:dir}))' "$PROJECT_DIR"
/usr/bin/time -p cat "$OPENCODE_WEB_DIR/deployment-output.json"
/usr/bin/time -p printf '\nserving %s on port %s\n' "$DIST" "$PORT"
/usr/bin/time -p node - "$DIST" "$PORT" <<'NODE'
const { createServer } = require('node:http');
const { readFileSync, statSync, existsSync } = require('node:fs');
const { resolve, join, extname } = require('node:path');
const [root, portArg] = process.argv.slice(2);
const port = Number(portArg || process.env.PORT || 3000);
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.map': 'application/json' };
const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (path !== resolve(root) && !path.startsWith(resolve(root) + '/')) { res.writeHead(404); res.end(); return; }
    let file = path;
    try { if (statSync(file).isDirectory()) file = join(file, 'index.html'); }
    catch { const cand = file + '.html'; if (existsSync(cand)) file = cand; }
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(readFileSync(file));
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(port, '0.0.0.0', () => console.log(`listening on ${port} root=${root}`));
NODE
