#!/usr/bin/env bash
# Capture desktop + mobile screenshots of CAPTURE_URL into CAPTURE_DIR.
# Exit 75 for temporary navigation/browser infrastructure failures, 1 for
# script or rendering defects. Leaves the app running; output stays in CAPTURE_DIR.
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p pwd
/usr/bin/time -p test -n "${CAPTURE_URL:?Set CAPTURE_URL to the exact preview URL.}"
/usr/bin/time -p test -n "${CAPTURE_DIR:?Set CAPTURE_DIR to the capture output directory.}"
/usr/bin/time -p test -n "${RUNTIME_DIR:?Set RUNTIME_DIR to the runtime scripts directory.}"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p node "${RUNTIME_DIR}/scripts/default-capture.mjs"
/usr/bin/time -p test -f "$CAPTURE_DIR/final-desktop.png"
/usr/bin/time -p test -f "$CAPTURE_DIR/final-mobile.png"
