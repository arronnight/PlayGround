#!/usr/bin/env bash
# Phase 1b reproduction: patch SDK -> configure -> build librexruntime.a ->
# whole-archive link probe -> fiber round-trip, all under Emscripten.
#
# Prereqs: emsdk on PATH (source _deps/emsdk/emsdk_env.sh), cmake/ninja/node.
# Usage: bash wasm/sdk-build/build_1b.sh [--from-scratch]
#   --from-scratch: reset _deps/rexglue-sdk to the pinned SHA first (deletes
#   local SDK modifications; submodule checkouts are preserved).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SDK="$ROOT/_deps/rexglue-sdk"
OUT="$ROOT/out/wasm-1b"
PIN=bd9b51918faa71f962fa38af6d5f744af9aba2ce

[ -d "$SDK/.git" ] || { echo "missing SDK tree: run scripts/fetch_upstream.sh"; exit 2; }
command -v emcc >/dev/null || { echo "emcc not on PATH"; exit 2; }

if [ "${1:-}" = "--from-scratch" ]; then
  # reset clears the index too (patch packaging uses `git add -N`, which
  # otherwise protects new files from `git clean`).
  git -C "$SDK" reset -q
  git -C "$SDK" checkout -q -- .
  git -C "$SDK" clean -fdq
  git -C "$SDK" checkout -q "$PIN"
fi

git -C "$SDK" submodule update --init --depth 1 \
  thirdparty/cli11 thirdparty/libmspack thirdparty/tomlplusplus thirdparty/simde \
  thirdparty/xxHash thirdparty/spdlog thirdparty/fmt thirdparty/snappy \
  thirdparty/utfcpp thirdparty/imgui thirdparty/o1heap \
  2>&1 | tail -2 || true

bash "$ROOT/wasm/sdk-patches/apply.sh"

emcmake cmake -S "$SDK" -B "$OUT/build" -G Ninja \
  -DREXGLUE_USE_VULKAN=OFF -DREXGLUE_ENABLE_TRACY=OFF \
  -DREXGLUE_ENABLE_PERF_COUNTERS=OFF -DCMAKE_BUILD_TYPE=Release
cmake --build "$OUT/build" --target rexruntime
ls -la "$SDK/out/wasm32/librexruntime.a"

# Whole-archive link probe: every object must resolve.
cat > "$OUT/link_probe.cpp" <<'EOF'
#include <cstdio>
int main() { std::printf("rexruntime link probe\n"); return 0; }
EOF
em++ -std=c++23 -O1 -pthread "$OUT/link_probe.cpp" -o "$OUT/link_probe.js" \
  -Wl,--whole-archive "$SDK/out/wasm32/librexruntime.a" -Wl,--no-whole-archive \
  "$SDK/out/wasm32"/libfmt.a "$SDK/out/wasm32"/libspdlog.a \
  "$SDK/out/wasm32"/libxxhash.a "$SDK/out/wasm32"/libsnappy.a \
  "$SDK/out/wasm32"/libmspack.a "$SDK/out/wasm32"/libo1heap.a \
  "$SDK/out/wasm32"/libaes128.a \
  -sUSE_SDL=3 -sASYNCIFY=1 -sALLOW_MEMORY_GROWTH=1
node "$OUT/link_probe.js"

# Fiber round-trip (Asyncify cooperative switching actually works).
# Protocol: entries park with SwitchTo (never return); Destroy parks to a
# freelist for reuse. See src/core/fiber_wasm.cpp lifecycle note.
cat > "$OUT/fiber_rt.cpp" <<'EOF'
#include <cstdio>
#include <rex/thread/fiber.h>
static int g_runs = 0;
static rex::thread::Fiber *g_main = nullptr, *g_w = nullptr;
static void Entry(void* arg) {
  ++g_runs;
  std::fprintf(stderr, "run n=%d\n", (int)(intptr_t)arg);
  rex::thread::Fiber::SwitchTo(g_main);
  std::fprintf(stderr, "BUG: resumed stale fiber\n");
}
int main() {
  g_main = rex::thread::Fiber::ConvertCurrentThread();
  for (int i = 0; i < 10; ++i) {
    g_w = rex::thread::Fiber::Create(64 * 1024, Entry, (void*)(intptr_t)i);
    rex::thread::Fiber::SwitchTo(g_w);
    g_w->Destroy();
  }
  std::fprintf(stderr, "runs=%d\n", g_runs);
  g_main->Destroy();
  std::fprintf(stderr, "fibers clean\n");
  return g_runs == 10 ? 0 : 1;
}
EOF
em++ -std=c++23 -O1 -pthread "$OUT/fiber_rt.cpp" -o "$OUT/fiber_rt.js" \
  -I"$SDK/include" -I"$OUT/build/include" -I"$SDK/thirdparty/simde" \
  -I"$SDK/thirdparty/fmt/include" -I"$SDK/thirdparty/spdlog/include" \
  -I"$SDK/thirdparty/tomlplusplus/include" -I"$SDK/thirdparty/xxHash" \
  -I"$SDK/thirdparty/imgui" \
  "$SDK/out/wasm32/librexruntime.a" "$SDK/out/wasm32"/libfmt.a \
  "$SDK/out/wasm32"/libspdlog.a "$SDK/out/wasm32"/libxxhash.a \
  "$SDK/out/wasm32"/libsnappy.a "$SDK/out/wasm32"/libmspack.a \
  "$SDK/out/wasm32"/libo1heap.a "$SDK/out/wasm32"/libaes128.a \
  -sUSE_SDL=3 -sASYNCIFY=1 -sALLOW_MEMORY_GROWTH=1
node "$OUT/fiber_rt.js"
echo "PHASE1B OK"
