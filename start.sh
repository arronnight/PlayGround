#!/usr/bin/env bash
# Build the static site into PROJECT_DIR/dist and serve it in the foreground.
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p pwd
PROJECT_DIR="${PROJECT_DIR:-$PWD}"
DIST_DIR="$PROJECT_DIR/dist"
OUT_DIR="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
PORT="${PORT:-3000}"
export PORT
# Install dependencies (none beyond node for this static project; verify toolchain).
/usr/bin/time -p node --version
/usr/bin/time -p node --check scripts/serve-static.mjs
# Build when needed: regenerate dist/ from site/ source.
/usr/bin/time -p rm -rf "$DIST_DIR"
/usr/bin/time -p mkdir -p "$DIST_DIR"
/usr/bin/time -p cp -r site/. "$DIST_DIR"/
/usr/bin/time -p test -f "$DIST_DIR/index.html"
# Publish deployment output for the controller (worker metadata only).
/usr/bin/time -p mkdir -p "$OUT_DIR"
/usr/bin/time -p node -e 'const fs=require("node:fs");const p=process.argv[1];fs.writeFileSync(p,JSON.stringify({project:process.argv[2],directory:process.argv[3]}));console.log("wrote "+p);' "$OUT_DIR/deployment-output.json" "$PROJECT_DIR" "$DIST_DIR"
/usr/bin/time -p cat "$OUT_DIR/deployment-output.json"
# Serve the built static directory in the foreground.
/usr/bin/time -p node scripts/serve-static.mjs "$DIST_DIR"
