#!/usr/bin/env bash
# Capture desktop + mobile screenshots of the deployed preview.
# Env: CAPTURE_URL (exact URL to open), CAPTURE_DIR (output dir, outside source),
#      RUNTIME_DIR (runtime scripts). Leaves the app running.
# Exit 75 = temporary navigation/browser infrastructure failure.
# Exit  1 = script or rendering defect.
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p test -n "${CAPTURE_URL:?CAPTURE_URL must be set}"
/usr/bin/time -p test -n "${CAPTURE_DIR:?CAPTURE_DIR must be set}"
/usr/bin/time -p test -n "${RUNTIME_DIR:?RUNTIME_DIR must be set}"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p printf 'capture: url=%s dir=%s\n' "$CAPTURE_URL" "$CAPTURE_DIR"
status=0
if /usr/bin/time -p node "${RUNTIME_DIR}/scripts/default-capture.mjs"; then
  status=0
else
  status=$?
fi
/usr/bin/time -p printf 'capture tool exited: %s\n' "$status"
if /usr/bin/time -p test "$status" -eq 75; then
  /usr/bin/time -p printf 'capture: temporary infrastructure failure\n' >&2
  exit 75
fi
if /usr/bin/time -p test "$status" -ne 0; then
  /usr/bin/time -p printf 'capture: tool failed with %s\n' "$status" >&2
  exit 1
fi
if /usr/bin/time -p test ! -s "$CAPTURE_DIR/final-desktop.png"; then
  /usr/bin/time -p printf 'capture: missing final-desktop.png\n' >&2
  exit 1
fi
if /usr/bin/time -p test ! -s "$CAPTURE_DIR/final-mobile.png"; then
  /usr/bin/time -p printf 'capture: missing final-mobile.png\n' >&2
  exit 1
fi
/usr/bin/time -p ls -l "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"
/usr/bin/time -p printf 'capture complete\n'
