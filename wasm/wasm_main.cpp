// wasm_main.cpp — Phase-0 WASM scaffold stub.
//
// Purpose: prove the local toolchain path (native now, emcc later) and document,
// in one compilable file, every upstream subsystem that must be replaced for web.
// It intentionally does NOT include any upstream or ReXGlue headers: those need
// Phase-1 porting (see docs/WASM-PORT.md §3).
//
// Native:  clang++ -std=c++23 wasm_main.cpp -o nhl_wasm_stub
// Emscripten (later): emcc -std=c++23 -sUSE_WEBGPU=1 -sUSE_PTHREADS=1 ...

#include <cstdio>

#if defined(__EMSCRIPTEN__)
#include <emscripten.h>
#include <emscripten/html5.h>
#endif

namespace {

// --- Upstream subsystem replacement notes (compile-time checked as TODOs) ---
//
// 1. cpu_affinity.cpp — SetProcessDefaultCpuSets: no-op on web. Guard with
//    #ifndef __EMSCRIPTEN__ upstream; here there is nothing to pin.
// 2. vp6_bridge.cpp — spawns ffmpeg.exe per movie: replace with WebCodecs or
//    ffmpeg.wasm worker; guest pixel-publish seam stays, decoder source changes.
// 3. renderer/core/nhl_vk_backend.cpp — Vulkan FSI (kPixelShaderInterlock) has no
//    WebGPU equivalent: needs a new EDRAM-fold backend (Phase 3), not a flag flip.
// 4. Input: XInput + Guide-button overlay toggle -> Gamepad API + HTML overlay.
// 5. Overlay: ImGui (rexui/imgui) -> HTML overlay; perf HUD -> console + canvas HUD.
// 6. FS: --game_data_root (10 GB loose tree) -> OPFS + chunked fetch + file picker.
//    Legal: user supplies their own dump; nothing is bundled.

int g_frame = 0;

void Tick() {
  ++g_frame;
  // Headless heartbeat: Phase 2 will drive guest boot here with null graphics.
  if ((g_frame % 60) == 0) {
    std::printf("[nhl-wasm] heartbeat frame=%d (null graphics/audio)\n", g_frame);
  }
}

}  // namespace

int main() {
  std::printf("[nhl-wasm] stub boot: native toolchain OK; game boot needs Phase 1/2.\n");
  std::printf("[nhl-wasm] upstream: https://github.com/puckhead73/nhl-legacy-recomp\n");
  std::printf("[nhl-wasm] plan: docs/WASM-PORT.md\n");

#if defined(__EMSCRIPTEN__)
  // Emscripten main loop (browser): Tick() driven by rAF; simulation time later.
  emscripten_set_main_loop(Tick, 0, 1);
#else
  // Native sanity: run a bounded number of ticks so CI/terminal exits.
  for (int i = 0; i < 180; ++i) Tick();
  std::printf("[nhl-wasm] native stub done frames=%d\n", g_frame);
#endif
  return 0;
}
