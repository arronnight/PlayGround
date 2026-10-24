#!/usr/bin/env bash
# Capture desktop and mobile screenshots of exactly $CAPTURE_URL into
# $CAPTURE_DIR as final-desktop.png and final-mobile.png. The app server is
# left running and no capture output is written into the project.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

RUNTIME_DIR="${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"
export RUNTIME_DIR

timed() {
  local label="$1"
  shift
  printf '\n[capture.sh] %s\n' "$label" >&2
  /usr/bin/time -p "$@"
}

if [ -z "${CAPTURE_URL:-}" ]; then
  echo 'capture.sh: CAPTURE_URL is not set.' >&2
  exit 1
fi
if [ -z "${CAPTURE_DIR:-}" ]; then
  echo 'capture.sh: CAPTURE_DIR is not set.' >&2
  exit 1
fi

# The game's initial screen is the main menu. Wait for a real menu row rather
# than the empty SPA shell, which has no visible body content.
export CAPTURE_READY_SELECTOR="${CAPTURE_READY_SELECTOR:-.menu .items}"
# Capture exactly the requested URL; do not click through a start button.
export CAPTURE_AUTO_START="${CAPTURE_AUTO_START:-false}"

if [ ! -f "$RUNTIME_DIR/scripts/default-capture.mjs" ]; then
  echo "capture.sh: runtime capture script is missing under $RUNTIME_DIR." >&2
  exit 75
fi

timed "create capture directory" mkdir -p "$CAPTURE_DIR"
timed "clear stale captures" rm -f "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"
timed "verify runtime capture script" test -f "$RUNTIME_DIR/scripts/default-capture.mjs"

set +e
timed "run browser capture" node "$RUNTIME_DIR/scripts/default-capture.mjs"
status=$?
set -e

if [ "$status" -eq 75 ]; then
  echo "capture.sh: temporary navigation/browser infrastructure failure (exit 75)." >&2
  exit 75
fi
if [ "$status" -ne 0 ]; then
  echo "capture.sh: capture failed (exit $status)." >&2
  exit 1
fi

timed "verify desktop capture" test -s "$CAPTURE_DIR/final-desktop.png"
timed "verify mobile capture" test -s "$CAPTURE_DIR/final-mobile.png"
echo "capture.sh: wrote $CAPTURE_DIR/final-desktop.png and $CAPTURE_DIR/final-mobile.png" >&2
