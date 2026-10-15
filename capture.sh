#!/usr/bin/env bash
# Capture desktop and mobile screenshots of CAPTURE_URL into CAPTURE_DIR.
# Leaves the app server running; the browser opened here is always closed.
# Exit 75: temporary navigation/browser infrastructure failure.
# Exit 1: script or rendering defect.
set -euo pipefail
cd "$(dirname "$0")"
: "${CAPTURE_URL:?Set CAPTURE_URL to the page to capture.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to the screenshot output directory.}"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
