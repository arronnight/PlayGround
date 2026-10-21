#!/usr/bin/env bash
# Capture desktop + mobile screenshots of the exact $CAPTURE_URL into
# $CAPTURE_DIR as final-desktop.png / final-mobile.png using the runtime
# Playwright capture. Leaves the app server running; writes nothing into the
# project source tree.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

/usr/bin/time -p bash -c 'test -n "${CAPTURE_URL:-}"' || {
	echo 'capture.sh: CAPTURE_URL is not set.' >&2
	exit 1
}
/usr/bin/time -p bash -c 'test -n "${CAPTURE_DIR:-}"' || {
	echo 'capture.sh: CAPTURE_DIR is not set.' >&2
	exit 1
}
# Runtime default for ad-hoc runs; the controller normally exports RUNTIME_DIR.
/usr/bin/time -p bash -c 'test -n "${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"' || {
	echo 'capture.sh: RUNTIME_DIR is not set.' >&2
	exit 1
}
export RUNTIME_DIR="${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"
# Wait for rendered game content, not just the empty SPA shell: <body> and
# #wrapper both have zero height (all game layers are absolutely positioned),
# so 'body'/'#wrapper' selectors report hidden on a healthy page, and '#app *'
# violates strict mode (30+ descendants). The intro mounts immediately but shows
# rotating loading messages for ~14s before it is interactive, so wait for the
# final "Touch to start" state rather than the loading placeholder.
# Overridable via the environment.
export CAPTURE_READY_SELECTOR="${CAPTURE_READY_SELECTOR:-[data-testid=\"start-button\"]:has-text(\"Touch to start\")}"

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p test -f "$RUNTIME_DIR/scripts/default-capture.mjs"

if /usr/bin/time -p node "$RUNTIME_DIR/scripts/default-capture.mjs"; then
	status=0
else
	status=$?
fi
if [ $status -eq 75 ]; then
	echo "capture.sh: temporary navigation/browser infrastructure failure (exit 75)." >&2
	exit 75
fi
if [ $status -ne 0 ]; then
	echo "capture.sh: capture failed (exit $status)." >&2
	exit 1
fi

/usr/bin/time -p test -f "$CAPTURE_DIR/final-desktop.png"
/usr/bin/time -p test -f "$CAPTURE_DIR/final-mobile.png"
echo "capture.sh: wrote $CAPTURE_DIR/final-desktop.png and $CAPTURE_DIR/final-mobile.png" >&2
