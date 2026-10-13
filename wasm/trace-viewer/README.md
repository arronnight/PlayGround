# Trace-replay WebGPU milestone (Phase 3a)

Status: DONE 2026-10-13 — screenshot-verified in headless Chromium (SwiftShader
software WebGPU): per-DRAW triangle + per-draw clear color on canvas, with the
parse report in the page log. See `docs/TRACE-MILESTONE.md`.

## What it is

A structural visualization of `.xtr` trace contents in a browser, using the
REAL SDK `TraceReader::ParseTrace` (+ PM4 `PacketDisassembler`) linked from
`librexruntime.a`, rendered through Dawn WebGPU. Synthetic fixture only —
no game assets, no EDRAM emulation, no playable rendering.

- `gen_fixture.py` — writes a 184-byte, 2-frame `.xtr` (DRAW_INDX + XE_SWAP
  packets + swap events, guest byte order).
- `viewer.cpp` — parses via the SDK, then renders one triangle per DRAW
  (clear color varies per packet) and yields per SWAP (presentation is
  automatic on rAF; `wgpuSurfacePresent` is unsupported in the Emscripten
  Dawn port and aborts).
- `parse_probe.cpp` — node-side parse check (same reader, no GPU).
- `shell.html` — page shell (canvas `#trace-canvas` + log div).
- `serve.py` — static server with COOP/COEP (required for wasm threads).
- `build.sh` — fixture + browser bundle build.

## Build / run

```sh
bash wasm/sdk-build/build_1b.sh            # once: runtime + generated headers
bash wasm/trace-viewer/build.sh            # fixture + out/trace-viewer bundle
python3 wasm/trace-viewer/serve.py out/trace-viewer 8931
# open http://127.0.0.1:8931/trace_viewer.html (SwiftShader: needs
# --enable-unsafe-swiftshader / software-WebGPU flags in Chromium)
```
