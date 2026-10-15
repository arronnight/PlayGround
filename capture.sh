#!/usr/bin/env bash
# Capture desktop + mobile screenshots of the running app with playwright-cli.
set -euo pipefail
cd "$(dirname "$0")" # chdir is a shell builtin; /usr/bin/time cannot wrap it
/usr/bin/time -p pwd >/dev/null
CAPTURE_URL="${CAPTURE_URL:?Set CAPTURE_URL to the exact preview URL.}"
CAPTURE_DIR="${CAPTURE_DIR:?Set CAPTURE_DIR to the screenshot output directory.}"
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"

fail_infra() { echo "capture.sh: infrastructure failure: $*" >&2; /usr/bin/time -p playwright-cli close >/dev/null 2>&1 || true; exit 75; }
fail_script() { echo "capture.sh: capture failure: $*" >&2; /usr/bin/time -p playwright-cli close >/dev/null 2>&1 || true; exit 1; }

/usr/bin/time -p playwright-cli close-all >/dev/null 2>&1 || true

# Open the exact URL in our own browser (launch/navigation problems are infra).
/usr/bin/time -p playwright-cli open "$CAPTURE_URL" >/dev/null 2>&1 || fail_infra "could not open browser at $CAPTURE_URL"

# Wait for rendered content: readyState complete + visible body text (poll ~40s).
READY=0
for _ in $(/usr/bin/time -p seq 1 40); do
  # Note: eval --raw prints the bare JSON string value (with quotes); strip them.
  STATE="$(/usr/bin/time -p playwright-cli eval --raw "() => document.readyState + '|' + ((document.body && document.body.innerText) || '').length" 2>/dev/null | head -n 1 | tr -d '\"' || true)"
  case "$STATE" in
    complete\|[1-9]*)
      LEN="${STATE#*|}"
      if [[ "$LEN" -ge 10 ]]; then READY=1; break; fi
      ;;
  esac
  /usr/bin/time -p sleep 1
done
[[ "$READY" == 1 ]] || fail_infra "page at $CAPTURE_URL did not render in time (state: ${STATE:-unknown})"
# Let fonts/animations settle.
/usr/bin/time -p sleep 2

# Desktop view.
/usr/bin/time -p playwright-cli resize 1440 900 || fail_infra "could not resize to desktop viewport"
/usr/bin/time -p sleep 1
/usr/bin/time -p playwright-cli screenshot --filename "$CAPTURE_DIR/final-desktop.png" || fail_script "desktop screenshot failed"

# Mobile view.
/usr/bin/time -p playwright-cli resize 390 844 || fail_infra "could not resize to mobile viewport"
/usr/bin/time -p sleep 1
/usr/bin/time -p playwright-cli screenshot --filename "$CAPTURE_DIR/final-mobile.png" || fail_script "mobile screenshot failed"

/usr/bin/time -p playwright-cli close >/dev/null 2>&1 || fail_infra "could not close browser"

# Validate output (missing/empty renders are script/rendering defects).
[[ -s "$CAPTURE_DIR/final-desktop.png" ]] || fail_script "final-desktop.png missing or empty"
[[ -s "$CAPTURE_DIR/final-mobile.png" ]] || fail_script "final-mobile.png missing or empty"
/usr/bin/time -p ls -la "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"
echo "capture.sh: done -> $CAPTURE_DIR/final-desktop.png, $CAPTURE_DIR/final-mobile.png"
