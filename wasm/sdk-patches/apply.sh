#!/usr/bin/env bash
# Apply the wasm-port patch stack to _deps/rexglue-sdk (must be at the pinned
# SHA; see scripts/fetch_upstream.sh). Idempotent-ish: skips patches already
# applied (detected via `git apply --reverse --check`).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SDK="$ROOT/_deps/rexglue-sdk"
PATCHDIR="$ROOT/wasm/sdk-patches"

[ -d "$SDK/.git" ] || { echo "missing SDK tree: run scripts/fetch_upstream.sh"; exit 2; }

for p in 01-emscripten-configure 02-emscripten-headers 03-core-posix-carveouts \
         04-ui-null-platform 05-audio-xma-stub 06-build-wiring 07-system-kernel-fixes \
         08-trace-reader-snappy-include; do
  f="$PATCHDIR/$p.patch"
  if git -C "$SDK" apply --reverse --check "$f" >/dev/null 2>&1; then
    echo "already applied: $p"
  else
    git -C "$SDK" apply --check "$f" || { echo "CANNOT APPLY: $p"; exit 1; }
    git -C "$SDK" apply "$f"
    echo "applied: $p"
  fi
done
echo "patch stack OK"
