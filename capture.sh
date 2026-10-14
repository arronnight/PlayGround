#!/usr/bin/env bash
# APEX GP capture: desktop + mobile screenshots of the exact CAPTURE_URL.
# Evidence goes to CAPTURE_DIR (outside the source tree); the app keeps running.
set -euo pipefail
cd "$(dirname "$0")"
: "${CAPTURE_URL:?CAPTURE_URL must be set}"
: "${CAPTURE_DIR:?CAPTURE_DIR must be set}"
# Timed per command. Exit 75 = transient navigation/browser failure,
# exit 1 = script usage error or a rendering defect (see scripts/capture-game.mjs).
/usr/bin/time -p node scripts/capture-game.mjs
/usr/bin/time -p ls -la "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"
