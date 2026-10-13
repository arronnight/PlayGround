# WebGPU backend investigation (Phase 1, graphics gate)

Date: 2026-10-13. Question: is there a path from the SDK's Vulkan FSI renderer
to anything a browser can run?

## §1 What the current renderer actually depends on

- Upstream verdict (`docs/current-status.md` in nhl-legacy-recomp): ONLY the
  `fsi` path (`RenderTargetCache::Path::kPixelShaderInterlock`) renders the
  in-game 3D scene; `rov`/`rtv` fall through to host render targets and render
  black. This was decided 2026-06-16 after a parity spike.
- Mechanism (SDK `@ bd9b519`, `src/graphics/vulkan/`): EDRAM is emulated with
  **`VK_EXT_fragment_shader_interlock`** (`fragmentShaderPixelInterlock` device
  feature, checked in `render_target_cache.cpp:207-208`). Interlocked fragment
  shaders do ordered read-modify-write directly on EDRAM tiles
  (`command_processor.cpp`, `pipeline_cache.cpp` reference
  `kPixelShaderInterlock` in dozens of places).
- Surface: `src/graphics/vulkan/` alone is **21,359 lines** (9 TUs + headers),
  plus `src/ui/vulkan/` (14 files: instance/device/presenter/upload pools) and
  HLSL/GLSL shaders. A "WebGPU backend" means re-implementing this EDRAM
  strategy against a different API — not translating calls 1:1.

## §2 What Dawn/WebGPU offers (measured, not assumed)

Using emsdk 6.0.12, `--use-port=emdawnwebgpu` fetches Dawn `v20260423` and
`#include <webgpu/webgpu.h>` (2,877 lines) parses cleanly. Capability audit of
that header:

- **Zero** occurrences of `interlock`, `raster_order`, `input_attachment`,
  `pixel_local`, `fragment_fetch`. No framebuffer-fetch, no programmable
  blending, no raster-order views, no subpass input attachments.
- `WGPUFeatureName` list (Dawn, Apr 2026): core, depth-clip, BC/ETC2/ASTC
  compression, timestamp queries, ShaderF16, RG11B10Ufloat, BGRA8 storage,
  float32 filterable/blendable, clip distances, **dual-source blending**,
  **subgroups**, texture tiers, indirect multidraw — and nothing order-related.
  Closest primitives (subgroups, dual-source blending, storage-texture atomics
  in WGSL) do not compose into ordered framebuffer RMW.
- The SDK itself contains zero Dawn/WGSL references (one comment mentions
  subgroup lane counts for Vulkan sizing).

Conclusion: **the FSI technique has no WebGPU equivalent.** There is no flag,
extension, or header-gated path that preserves the current renderer's design.

## §3 Options, with honest costs

| # | Option | Verdict |
|---|--------|---------|
| A | Re-implement EDRAM emulation on WebGPU compute (tiled resolve with `textureAtomic*` + storage barriers, WGSL) | Only known playable-graphics path in-browser. Ground-up renderer design + validation against RenderDoc traces (`tools/rdc_*.py` exist upstream). Cost: **months, GPU specialist**. Highest risk in the whole port. |
| B | WebGL2 backend (Emscripten has WebGL2, incl. `EXT_color_buffer_float`) | Same ordering gap as WebGPU (GL has `NV_fragment_shader_interlock` on desktop only — never exposed to WebGL). Rejected for the same reason, with a worse API. |
| C | Software rasterizer in wasm (SwiftShader-style or Xenos-soft) | Sidesteps ordering (CPU code can order trivially) but 1280×720 3D in wasm-SIMD on CPU is almost certainly non-interactive for this title. Useful only as a correctness reference, cf. upstream's own plume/high-cut reference path. |
| D | Server-side render streaming (native Vulkan backend renders, browser displays frames + sends input) | Playable soonest and reuses the proven FSI backend unchanged, but it is **not a port** — needs a hosted GPU box per player, latency-sensitive for a sports game. Consider only as a demo bridge. |
| E | Trace-replay viewer in browser (replay captured `.xtr` frames through a WebGPU canvas) | Bounded, demonstrable milestone using existing trace tooling; proves the WebGPU plumbing with zero EDRAM risk. Good Phase-3a regardless of A. |

## §4 Recommendation

- Fund Phase 2 (headless guest boot — EMSDK spike says GO) independently of
  graphics: it unblocks CPU/audio/systems work and needs no GPU answers.
- Run **E first** (trace replay on a WebGPU canvas — weeks, de-risks Dawn
  plumbing, upload pools, present loop), then decide on **A** with eyes open,
  using upstream's FSI backend as the pixel-accurate oracle.
- Do not promise playable 3D in the browser on any near-term timeline; the
  current-status doc's "only fsi renders the scene" plus the empty Dawn
  capability set above is the evidence.
