# NHL Legacy Recomp — WASM port: feasibility and plan

Upstream: https://github.com/puckhead73/nhl-legacy-recomp (native PC port of
NHL Legacy / Xbox 360 via static recompilation on the ReXGlue SDK, Xenia-derived).

This document is the starting point for a WASM port. It states what was measured,
why a direct `emcc` recompile will not work, and the phased path that could work.

## 1. What the upstream actually is (measured 2026-10-13, shallow clone)

- Host app (`src/`, `renderer/`, `gpu/`): ~66 C++ files; `src/` + `renderer/core/`
  alone ≈ 15.7k lines. Canonical build is `win-amd64-vk-ffx`: Clang + Ninja +
  CMake 3.25+, Vulkan SDK 1.4.350, VS2022 BuildTools, ReXGlue SDK built from
  source with `REXGLUE_USE_VULKAN=ON`, plus FidelityFX DLL, glslang (fetched),
  vendored plume D3D12 RHI, Rust `tdb-rx2-ffi` static lib, `ffmpeg.exe` sidecar.
- Recompiled game code: `generated/` (~181 C++ files from `rexglue codegen` on the
  vanilla `default.xex`, NOT tracked in git, needs a legally dumped Xbox 360 disc).
  No game content ships upstream; the builder validates `default.xex` by SHA-256.
- Scripts are Windows-first: `scripts/` is ~25 `.bat` + `.ps1` drivers run from repo
  root; there is no Emscripten/CMake-preset path today.
- Title-specific SDK patches: `sdk/rexglue-vulkan-nhl-legacy-bd9b519.patch` (886
  lines) + `sdk/rexglue-vp6-sharedmem-fixes.patch` (911 lines) + codegen fix
  (42 lines). A WASM port must re-apply/port the *intent* of these, not just the
  game code.

## 2. Why this is not a normal "port to WebGL" task

| # | Blocker | Detail | Way through |
|---|---------|--------|-------------|
| 1 | ReXGlue runtime is Win64/Vulkan-native | `windows.h` in 11 `src/` files + renderer; `__declspec(dllimport)`, `TerminateProcess`, `_putenv_s`, `SetProcessDefaultCpuSets` (P-core pinning), D3D12/DXGI, Vulkan FSI backend, `amd_fidelityfx_vk.dll` hard import, RenderDoc, `wmain` packager. ~833 grep hits for `windows.h\|d3d12\|vulkan\|ffx\|_mm_\|…` across `src/renderer/gpu/packager/replay`. Emscripten has none of these. | Port the *host app*, not just the game: replace `NhllegacyApp::OnPreSetup` OS/backend setup with an Emscripten app class; stub `cpu_affinity.cpp`, `vp6_bridge.cpp` (spawns `ffmpeg.exe`), `union_device/loose_tree_device` Win32 paths. This is real work, measured in weeks. |
| 2 | Renderer needs fragment-shader-interlock / ROV | Current-status doc: ONLY `fsi` (`kPixelShaderInterlock`) renders the in-game 3D scene; `rov`/`rtv` fall through to host-RTs and render black. WebGPU has no pixel-shader-interlock or ROV. There is no WebGPU backend in the SDK. | Biggest risk. Options: (a) new EDRAM-emulation WebGPU backend (months, needs GPU expertise); (b) software/reference rasterizer first (proves CPU side, no 3D perf); (c) stream frames from a native server (not really a port). Do NOT promise playable 3D in the browser in phase 1. |
| 3 | Guest memory model vs wasm linear memory | Runtime uses `protect_zero=false`, `scribble_heap=false`, no-access zero page, `VirtualProtect`/`mmap`-style guest RAM, >2GB address needs, PGO/`-march=x86-64-v3`/`-flto=thin`. wasm32 = 4 GB linear memory, no `mprotect`, `MEMORY64` still experimental, pthreads = SharedArrayBuffer + COOP/COEP headers. | First target a headless CPU-only build (`-s PTHREADS=0` or explicit pthreads, `ALLOW_MEMORY_GROWTH`, maybe `wasm64`) that boots guest code to menu logic with null graphics/audio. Proves codegen C++ compiles under `emcc` at all. |
| 4 | 10 GB asset pipeline | Builder unpacks `.iso` → XDVDFS → `.big` archives → loose tree + `game/`. Browsers cannot hold this in memory; needs OPFS/IndexedDB + streaming + user-supplied dump via `<input type=file>` (legal requirement stays: no assets shipped). | Design `game_data_root` → Emscripten FS/OPFS mount + chunked fetch from a user-hosted asset server. Phase 1 uses a tiny synthetic FS fixture, not the real dump. |
| 5 | Video/audio/input | VP6 movies decoded by spawning host `ffmpeg.exe` per movie + reader thread; audio via SDL/XAudio queue (`audio_maxqframes`); input via XInput + Guide-button overlay toggle; ImGui overlay + perf HUD. | Web replacements: WebCodecs or ffmpeg.wasm for VP6, WebAudio for the SDL backend, Gamepad API for XInput, HTML overlay for ImGui. Each is a work item. |
| 6 | Build host is Windows/MSVC | Canonical build needs VS2022 + Vulkan SDK + LLVM; this workspace is Linux (clang 18, no `emcc`, no Vulkan SDK). | Prove the Linux-native path first (upstream has `linux-amd64-*` presets but the canonical game build is Windows-only `WIN32` exe + `wmain` packager). WASM builds from Linux + `emcc`, never from the Windows scripts. |

## 3. Phased plan (what "start" means here)

- **Phase 0 — audit + native baseline (this scaffold).** Reproducible blocker audit
  (`scripts/wasm_audit.py`), pinned upstream fetch (`scripts/fetch_upstream.sh`),
  Emscripten-ready stub (`wasm/`) that compiles natively today and under `emcc`
  tomorrow. No game assets, no `generated/` code vendored.
- **Phase 1 — ReXGlue SDK portability spike.** Fetch `rexglue-sdk` at pinned
  `bd9b5191`, try to compile a *minimal* `rex::ReXApp` (no game, null graphics)
  with `emcc`. Expected outcome: a list of SDK files that need `#ifdef __EMSCRIPTEN__`
  shims (FS, threads, time, sockets). This decides whether Phase 2 is viable.
  **Status 2026-10-13: DONE — see `docs/EMSDK-SPIKE.md` (verdict: GO with scoped
  cost; 4 small header patches + memory-offset layer + fiber backend remain) and
  `wasm/sdk-spike/run_spike.sh` (7/7 reproducible). Full `rexruntime` link is the
  explicit next spike (Phase 1b). Graphics gate: `docs/WEBGPU-INVESTIGATION.md`.**
- **Phase 2 — headless guest boot.** Run `rexglue codegen` output (needs a legal
  dump, done on a dev machine, never committed) through `emcc` with null
  graphics/audio; goal: guest reaches menu state in console log. No rendering.
- **Phase 3 — graphics.** Either a WebGPU EDRAM-fold backend or a server-streamed
  frame bridge. Spike first with RenderDoc traces (`tools/rdc_*.py` exist upstream)
  replayed into a WebGPU canvas; do not rewrite the Vulkan backend blind.
  **Status 2026-10-13: Phase 3a DONE — see `docs/TRACE-MILESTONE.md`
  (`wasm/trace-viewer/`): synthetic-trace parse via the real SDK reader +
  Dawn render, screenshot-verified. Full EDRAM-accurate replay (option A)
  remains a specialist project.**
- **Phase 4 — system integration.** OPFS asset streaming, WebAudio, Gamepad,
  VP6 via WebCodecs/ffmpeg.wasm, HTML settings overlay replacing ImGui.

## 4. What is in this repo now

- `wasm/` — stub + build files. `wasm/wasm_main.cpp` compiles with the system
  compiler today (`clang++ -std=c++23`) and is written for `emcc` (main loop via
  `emscripten_set_main_loop` when `__EMSCRIPTEN__` is defined). It documents, in
  code, every subsystem that must be replaced (affinity, VP6 subprocess, Vulkan FSI,
  XInput, ImGui).
- `scripts/fetch_upstream.sh` — clones upstream + SDK at pinned revisions into
  `_deps/` (git-ignored) for analysis. Never vendors `generated/` or game assets.
- `scripts/wasm_audit.py` — re-runs the blocker counts from §2 against `_deps/`.
- `wasm/wasm_shell.html` — minimal Emscripten shell (canvas + log + file picker
  placeholder for the user-supplied dump).

## 5. Legal

Same as upstream: you must own NHL Legacy and dump your own copy. This repo ships
no game content, no XEX, no `generated/` output, no assets. Do not commit dumps.
