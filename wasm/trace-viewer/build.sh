#!/usr/bin/env bash
# Trace-replay WebGPU milestone build (docs/TRACE-MILESTONE.md).
# Prereqs: emsdk on PATH, Phase 1b done (librexruntime.a + CMake build dir
# from wasm/sdk-build/build_1b.sh for generated headers).
# Usage: bash wasm/trace-viewer/build.sh [outdir]
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SDK="$ROOT/_deps/rexglue-sdk"
BLD="$ROOT/out/wasm-1b/build"
OUT="${1:-$ROOT/out/trace-viewer}"
mkdir -p "$OUT"

[ -f "$SDK/out/wasm32/librexruntime.a" ] || { echo "run wasm/sdk-build/build_1b.sh first"; exit 2; }
command -v em++ >/dev/null || { echo "emcc not on PATH"; exit 2; }

python3 "$ROOT/wasm/trace-viewer/gen_fixture.py" "$OUT/synth.xtr"

INCS="-I$SDK/include -I$BLD/include -I$SDK/thirdparty/simde \
  -I$SDK/thirdparty/fmt/include -I$SDK/thirdparty/spdlog/include \
  -I$SDK/thirdparty/tomlplusplus/include -I$SDK/thirdparty/xxHash \
  -I$SDK/thirdparty/imgui -I$SDK/thirdparty/snappy \
  -I$BLD/thirdparty/snappy"
LIBS="$SDK/out/wasm32/librexruntime.a $SDK/out/wasm32/libfmt.a \
  $SDK/out/wasm32/libspdlog.a $SDK/out/wasm32/libxxhash.a \
  $SDK/out/wasm32/libsnappy.a $SDK/out/wasm32/libmspack.a \
  $SDK/out/wasm32/libo1heap.a $SDK/out/wasm32/libaes128.a"
FLAGS="-std=c++23 -O1 -pthread --use-port=emdawnwebgpu $INCS $LIBS \
  -sUSE_SDL=3 -sASYNCIFY=1 -sALLOW_MEMORY_GROWTH=1"

# Node/binary check is covered by build_1b.sh probes; here the browser bundle:
# shell intentionally unquoted below so $OUT expands.
# shellcheck disable=SC2086
em++ $FLAGS "$ROOT/wasm/trace-viewer/viewer.cpp" \
  "$SDK/src/graphics/trace_reader.cpp" \
  -o "$OUT/trace_viewer.html" \
  --shell-file "$ROOT/wasm/trace-viewer/shell.html" \
  --preload-file "$OUT/synth.xtr@/trace/synth.xtr"
echo "built $OUT/trace_viewer.html"
echo "serve: python3 wasm/trace-viewer/serve.py $OUT 8931  # COOP/COEP for threads"
