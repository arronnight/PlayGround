#!/usr/bin/env bash
# Fetch upstream repos for analysis into _deps/ (git-ignored). Never vendors
# game assets, XEX dumps, or generated/ output.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPS="$ROOT/_deps"
mkdir -p "$DEPS"
if [ ! -d "$DEPS/nhl-legacy-recomp/.git" ]; then
  git clone --depth 1 https://github.com/puckhead73/nhl-legacy-recomp.git "$DEPS/nhl-legacy-recomp"
else
  git -C "$DEPS/nhl-legacy-recomp" pull --ff-only
fi
# Pinned SDK snapshot this port was developed against (see upstream BOOTSTRAP.md).
# NOTE: the short prefix bd9b5191 does NOT resolve upstream; the full SHA is required.
PIN=bd9b51918faa71f962fa38af6d5f744af9aba2ce
if [ ! -d "$DEPS/rexglue-sdk/.git" ]; then
  git clone https://github.com/rexglue/rexglue-sdk "$DEPS/rexglue-sdk"
fi
git -C "$DEPS/rexglue-sdk" fetch origin "$PIN" || true
git -C "$DEPS/rexglue-sdk" checkout "$PIN" || true
echo "OK: _deps populated. Run: python3 scripts/wasm_audit.py"
