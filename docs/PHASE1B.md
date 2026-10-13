# Phase 1b: link `rexruntime` under Emscripten

Date: 2026-10-13. SDK `rexglue/rexglue-sdk @ bd9b5191`, emcc 6.0.12, Release.
Reproduce: `bash wasm/sdk-build/build_1b.sh [--from-scratch]` (needs `_deps/`
from `scripts/fetch_upstream.sh` + activated emsdk). Patches:
`wasm/sdk-patches/{01..07}-*.patch`, applied by `wasm/sdk-patches/apply.sh`.

## Result

- **`librexruntime.a` (12.6 MB, 198 objects) builds clean** with both graphics
  backends OFF, Tracy/perf-counters OFF: core, filesystem, headless UI, audio
  (XMA stubbed), input (SDL port headers), graphics core+system (no backends),
  system + full kernel (XAM/XBDM/xboxkrnl/crt).
- **Whole-archive link into wasm succeeds** (`-Wl,--whole-archive`, 10 MB
  `.wasm`); the module **runs under node**; fiber lifecycle (create/switch/
  park/destroy/reuse) verified under node (see above).
- The SDK tree in `_deps/` carries the patches as working state; the files in
  `wasm/sdk-patches/` are the portable record (generated via `git diff`).

## Patch inventory

| File | Change |
|------|--------|
| `01-emscripten-configure.patch` | top-level CMake: both-backends-OFF allowed (null build), wasm32 pointer-size gate, no `-mcmodel`, `REX_PLATFORM=wasm32` |
| `02-emscripten-headers.patch` | `platform.h` (`__EMSCRIPTEN__`→LINUX-like + `REX_PLATFORM_EMSCRIPTEN`), `fpscr.h` software CSR, `chrono.h` libc++ `clock_time_conversion` + `clock_cast`, `intrinsics.h` portable `vsl/vslo/vsro`, `fiber.h` emscripten branch |
| `03-core-posix-carveouts.patch` | `fiber_wasm.cpp` (new, Asyncify fibers), core CMake fiber swap + `-sASYNCIFY` link opt, `exception_handler_posix` ucontext guard, `threading_posix`: eventfd include, `gettid`→`pthread_self`, cross-thread-signal skip, `_np` thread-name/affinity stubs, `clock_cast` use (via 02) |
| `04-ui-null-platform.patch` | `window_null.cpp` + `windowed_app_context_null.{h,cpp}` (new), UI CMake null sources, GTK/X11 pkg-config skip |
| `05-audio-xma-stub.patch` | `xma_decoder_null.cpp` + `xma_context_null.cpp` (new, silent audio), audio CMake excludes FFmpeg TUs/libs |
| `06-build-wiring.patch` | thirdparty: skip vendored SDL3/FFmpeg builds, `SDL3::SDL3`→Emscripten port (`-sUSE_SDL=3`); `rexruntime` STATIC on wasm; install/export rules skipped; top-level `-pthread` |
| `07-system-kernel-fixes.patch` | `xsocket` musl macro-enum collisions (+`xam_net` native constants + missing `sys/select.h`), `mmio_handler` wasm fallbacks (decode→false), `heap` 32-bit `SizeHeader` + `std::max<uint64_t>` |

## Findings worth keeping

- **Threads must match:** objects compiled without `-pthread` fail at link with
  `--shared-memory disallowed ... not compiled with atomics` — the SDK now
  builds with `-pthread` globally. Serving threaded wasm needs COOP/COEP
  (Phase 2, documented in CMake comment).
- **Link C++ with `em++`:** the probe initially "missed" libc++ symbols because
  it used the C driver — toolchain trivia, not an SDK gap.
- **musl vs glibc enum/macros:** `AF_*/SOCK_*/IPPROTO_*` are macros in musl,
  enums in glibc — the SDK's scoped enums collide only on wasm. Fixed with
  `#undef` in the header + native constants at the two use sites.
- **32-bit heap:** `O1HEAP_ALIGNMENT` is 8 on wasm32; `SizeHeader` is now
  pointer-sized. `std::max(uint64_t, size_t)` needs the explicit template arg
  (ambiguous on ILP32 — and MSVC).
- **Audio seam is clean:** `XmaDecoder`/`XmaContext` expose no FFmpeg types, so
  the stub drops the entire vendored FFmpeg build. SDL audio/input drivers
  compile against the Emscripten SDL3 port — kept, not stubbed.
- **Fibers are real:** `emscripten/fiber.h` maps 1:1 onto the SDK's
  Convert/Create/SwitchTo/Destroy interface; a 50-cycle create→park→destroy
  churn test passes with pool reuse (fresh entries run every cycle) and clean
  teardown under node. Two lifecycle rules discovered empirically (see
  `src/core/fiber_wasm.cpp`): entries must park, never return (same contract
  as the ucontext backend); a parked fiber's stacks must not be freed
  (Asyncify keeps unwind metadata — freeing crashes in rewind machinery, and
  Emscripten's own fiber test never frees fibers), so Destroy() parks workers
  in a freelist for re-init (high-water bounded) and retires thread-fiber
  asyncify buffers to a never-freed home.
  Runtime link requires `-sASYNCIFY=1` (already on the `rexcore` interface).
- **Known runtime debts (NOT solved, Phase 2):** `mprotect` no-op + no
  fixed-address mmap (needs base-offset memory layer); MMIO fault decoder
  returns false (needs wasm load/store decoder); cross-thread signal wakeup
  degraded to dispatch points; FPSCR rounding is emulated-only; audio silent.

## Explicitly out of scope

No game code compiled (codegen output needs a legal dump on a dev machine);
no runtime *behavior* validated beyond the two probes; no GPU backend (see
`docs/WEBGPU-INVESTIGATION.md`); Tracy/perf-counters/FFmpeg/Vulkan/SDL-vendored
all disabled by design for this configuration.
