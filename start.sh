#!/usr/bin/env bash
# APEX GP project launcher: install, build, serve the built output in the foreground.
#
# Layout contract (controller-owned paths stay outside the source tree):
#   source + built output .... PROJECT_DIR (this directory, ./dist)
#   worker metadata .......... OPENCODE_WEB_DIR (dependency stamp, deployment-output.json)
#   capture evidence ......... CAPTURE_DIR (never written here)
set -euo pipefail
cd "$(dirname "$0")"
PORT="${PORT:-3000}"
: "${OPENCODE_WEB_DIR:?OPENCODE_WEB_DIR must be set}"
STAMP="$OPENCODE_WEB_DIR/start-dependencies"

# 1. Dependencies — reinstall only when the lock hash moves.
#    (timed per command; stamp lives in OPENCODE_WEB_DIR, not the source tree)
/usr/bin/time -p bash -c '
  set -euo pipefail
  sum="$(sha256sum package.json package-lock.json | sha256sum)"
  if [[ -f "$1" && "$(cat "$1")" == "$sum" && -d node_modules/vite ]]; then
    echo "dependencies: up to date"
  else
    if [[ -f package-lock.json ]]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi
    printf "%s" "$sum" > "$1"
  fi
' _ "$STAMP"

# 2. Build — skip when dist is newer than every source file.
/usr/bin/time -p bash -c '
  set -euo pipefail
  if [[ -f dist/index.html ]] && [[ -z "$(find src index.html package.json -newer dist/index.html -print -quit 2>/dev/null)" ]]; then
    echo "build: dist up to date"
  else
    ./node_modules/.bin/vite build
  fi
' _

# 3. Deployment metadata for the controller (absolute built directory).
/usr/bin/time -p node -e 'require("fs").writeFileSync(process.env.OPENCODE_WEB_DIR + "/deployment-output.json", JSON.stringify({ project: process.cwd(), directory: process.cwd() + "/dist" }))'

# 4. Serve the built output in the foreground on PORT (default 3000).
#    Project-owned static server: no host allow-list, correct MIME types.
/usr/bin/time -p node scripts/serve-static.mjs dist "$PORT"
