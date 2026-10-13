# Trace-replay WebGPU milestone (Phase 3a) — DONE 2026-10-13

Reproduce: `bash wasm/trace-viewer/build.sh`, serve `out/trace-viewer/`,
open in Chromium with software WebGPU. Sources: `wasm/trace-viewer/`.

## What was proven (with evidence)

1. **Real SDK trace parsing runs in wasm.** `TraceReader::ParseTrace` +
   `PacketDisassembler::GetPacketCategory` (compiled from SDK sources, linked
   against `librexruntime.a`) opens a synthetic 184-byte `.xtr` from the
   Emscripten FS (`MappedMemory` file mmap on MEMFS works) and reports
   `frames=2 draws=2 swaps=2` — in node AND in the browser log.
2. **Dawn WebGPU plumbing works end to end.** Adapter→device→canvas surface→
   render pipeline→per-DRAW triangle→automatic present, screenshot-verified:
   blue triangle on a per-packet clear color, log ends with
   `rendered 8 draws, holding frame for screenshot`. SwiftShader software
   rendering (CPU), not GPU hardware — appropriate for a plumbing milestone.
3. **Fixture format documented.** `gen_fixture.py` encodes the exact layout
   `ParseTrace` expects (header v1, dword-tagged command stream, PM4 bytes in
   guest order, swap events for frame breaks). A real captured trace should
   parse identically — same code path.

## Dawn/Emscripten facts learned (constrain Phase 3)

- `wgpuSurfacePresent` is **unimplemented** in the emdawnwebgpu port — calling
  it aborts (`use requestAnimationFrame via html5.h instead`). Presentation is
  automatic when the rAF tick yields; multi-draw frames must accumulate
  offscreen (one present per tick).
- `WGPURenderPassColorAttachment.depthSlice` defaults to 0 via zero-init but
  must be `WGPU_DEPTH_SLICE_UNDEFINED` for 2D targets, or the pass is invalid
  (black canvas, validation warnings only).
- WGSL module descriptor in this Dawn snapshot is `WGPUShaderSourceWGSL` /
  `WGPUSType_ShaderSourceWGSL` (not `...WGSLDescriptor`).
- Upstream dead code found: `src/graphics/trace_reader.cpp` is built by NO
  CMake target and carries a typo (`#include <snappy.h"`) — fixed by patch
  `08-trace-reader-snappy-include.patch`. Worth upstreaming along with the
  finding that reader/player/dump/viewer sources are unreferenced.

## Explicit non-goals

No EDRAM emulation, no real-trace validation (needs a legal dump + native
capture on a dev machine), no audio/input/systems integration, no performance
claims (SwiftShader). The per-DRAW triangle deliberately visualizes trace
*structure*, not game pixels. Next step per `docs/WEBGPU-INVESTIGATION.md`:
feed a REAL captured frame through this harness and compare against
`replay_frame.png` from the native backend.
