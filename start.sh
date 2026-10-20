#!/usr/bin/env bash
# Start the OpenMon project: install deps, build when needed, serve openmon/dist
# in the foreground on PORT (default 3000).
# Source and built output stay inside PROJECT_DIR; OPENCODE_WEB_DIR/RUNNER_TEMP
# are used only for worker metadata (deployment-output.json) and logs.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"
export PORT
APP_DIR="$PROJECT_DIR/openmon"
STATIC_DIR="$APP_DIR/dist"
export OMGITHUB_STATIC_DIR="$STATIC_DIR"
WEB_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"

/usr/bin/time -p test -d "$APP_DIR"
/usr/bin/time -p test -f "$APP_DIR/package.json"

# Install dependencies when node_modules is missing or package files changed.
if /usr/bin/time -p bash -c "test ! -d '$APP_DIR/node_modules' -o '$APP_DIR/package.json' -nt '$APP_DIR/node_modules' -o '$APP_DIR/package-lock.json' -nt '$APP_DIR/node_modules' 2>/dev/null"; then
	echo "Installing dependencies in $APP_DIR ..." >&2
	if [ -f "$APP_DIR/package-lock.json" ]; then
		/usr/bin/time -p npm --prefix "$APP_DIR" ci --no-audit --no-fund
	else
		/usr/bin/time -p npm --prefix "$APP_DIR" install --no-audit --no-fund
	fi
fi

# Build when the static output is missing. (vite build clears dist/, so
# re-stage the runtime game assets afterwards, mirroring desktop:assets.)
if [ ! -f "$STATIC_DIR/index.html" ]; then
	echo "Building static output in $APP_DIR ..." >&2
	/usr/bin/time -p npm --prefix "$APP_DIR" run build
	/usr/bin/time -p npm --prefix "$APP_DIR" run desktop:assets
fi
/usr/bin/time -p test -f "$STATIC_DIR/index.html"

/usr/bin/time -p mkdir -p "$WEB_DIR"
/usr/bin/time -p bash -c "printf '%s' '{\"project\":\"$PROJECT_DIR\",\"directory\":\"$STATIC_DIR\"}' > '$WEB_DIR/deployment-output.json'"

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
