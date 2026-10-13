# wasm/ — WASM port scaffold (Phase 0)

This directory is the starting point, not a playable port. See `../docs/WASM-PORT.md`.

## Contents

- `wasm_main.cpp` — Emscripten-ready stub. Compiles natively today, documents each
  upstream subsystem that needs a web replacement (P-core affinity, `ffmpeg.exe`
  VP6 bridge, Vulkan FSI backend, XInput/Guide overlay, ImGui, 10 GB asset tree).
- `wasm_shell.html` — minimal Emscripten shell: canvas, log, dump-picker placeholder.
- `CMakeLists.txt` — builds the stub natively; under `emcc` (Emscripten toolchain)
  builds `nhl_wasm.{js,wasm}` with pthreads + WebGPU/WebGL flags left as explicit
  opt-ins (see comments — do not enable until Phase 1/3 spikes land).

## Build (native sanity, no emcc needed)

```sh
cmake -S wasm -B out/wasm-native -G Ninja
cmake --build out/wasm-native
./out/wasm-native/nhl_wasm_stub
```

## Build (wasm, once emsdk is installed)

```sh
source /path/to/emsdk/emsdk_env.sh
emcmake cmake -S wasm -B out/wasm-em -G Ninja
cmake --build out/wasm-em
emrun --serve_after_close out/wasm-em/wasm_shell.html
```

Note: full game WASM requires Phase 1 (ReXGlue SDK under emcc) and Phase 2
(headless guest boot with a legal dump on a dev machine). Neither is claimed here.
