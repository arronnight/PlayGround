# EMSDK spike: can the ReXGlue SDK meet Emscripten? (Phase 1)

Date: 2026-10-13. SDK: `rexglue/rexglue-sdk @ bd9b5191` (pinned per upstream
`BOOTSTRAP.md`; full SHA `bd9b51918faa71f962fa38af6d5f744af9aba2ce` — note the
short prefix alone does NOT resolve upstream, the full SHA must be fetched).
Toolchain: Emscripten 6.0.12 (`6e9f6885…`), clang/wasm32, libc++, node v22/24.

Method: `_deps/` holds emsdk + SDK (git-ignored, analysis only). All SDK compile
tests are **parse/compile-only** (`-fsyntax-only` / `-c`, no link). Workarounds
are `-D` flags and `-I` shims generated at spike time — the SDK tree itself was
not modified. Reproduce: `bash wasm/sdk-spike/run_spike.sh` (needs `_deps/`
from `scripts/fetch_upstream.sh` + emsdk activated).

## Result table

| # | Test | Result |
|---|------|--------|
| S1 | `#include <rex/platform.h>` under emcc | **FAIL**: `#error Unsupported target OS` |
| S2 | `#include <rex/rex_app.h>` (whole ReXApp closure) | **PASS** with 2 workarounds (platform define + chrono shim) |
| S3 | `graphics_system.h` + `command_processor.h` | **PASS**, same workarounds |
| S4 | compile `src/core/memory_posix.cpp` | **PASS (compile) / FAIL (runtime semantics)** — see §3 |
| S5 | `NullGraphicsSystem : GraphicsSystem` subclass TU | **PASS** — hierarchy is subclassable, no backend symbols needed |
| S6 | `ppc/intrinsics.h` + `ppc/context.h` (codegen runtime) | **PASS** with portable `vsl/vslo/vsro` (~25 lines) |
| S7 | `#include <webgpu/webgpu.h>` via `--use-port=emdawnwebgpu` | **PASS** — Dawn `v20260423` port fetches and parses |

Headline: the SDK's C++ is **largely portable** (standard C++23 + simde for SIMD).
Nothing about the language blocks wasm. What blocks it is **5 small platform gaps
+ 2 deep runtime-semantic gaps**. None is individually large; together they are a
real SDK port, not a recompile.

## §1 Required SDK source patches (small, enumerated)

1. **`include/rex/platform.h` — no Emscripten/wasm identity.** OS detection is
   `__APPLE__ / WIN32 / __ANDROID__ / __gnu_linux__` → `#else #error`. Emscripten
   defines `__unix__` + `__EMSCRIPTEN__` + `__wasm32__` but NOT `__gnu_linux__`,
   so every TU fails (S1). Arch detection has cases for AMD64/ARM64/PPC/32-bit
   only — wasm32 defines **no** `REX_ARCH_*` at all (silently). Fix: an
   `__EMSCRIPTEN__` branch (LINUX-like platform + `REX_ARCH_WASM32`). Spike
   simulated it with `-D__gnu_linux__`.
2. **`include/rex/platform/fpscr.h` — PPC FPSCR has x86_64/AArch64 impls only.**
   `getcsr/setcsr` need the SSE CSR or ARM FPCR; wasm has neither. Spike used a
   thread-local software CSR shim. Compiles — but rounding-mode writes then do
   NOT affect native wasm float ops (round-to-nearest always). Any PPC sequence
   relying on rounding-mode switches will compute slightly differently (same bug
   class as the upstream VP6 IDCT issue). Phase-2 correctness risk, must be
   tracked, not assumed safe.
3. **`include/rex/chrono/chrono.h` (+ `chrono_steady_cast.h`) — specializes
   `std::chrono::clock_time_conversion`, which Emscripten's libc++ does not
   declare** (libc++ never implemented `clock_time_cast`; libstdc++/MSVC have
   it, which is what upstream builds against). Spike force-included a primary
   template declaration. Real fix belongs in the SDK (define its own trait
   instead of specializing a non-portable std one).
4. **`include/rex/ppc/intrinsics.h` — `vsl/vslo/vsro` are x86_64/ARM64-only
   (`#error` otherwise).** The guarded code is already portable C/memcpy logic;
   a generic branch is ~25 lines (proven in spike). Note: `slli_epi64` with a
   runtime count is NOT portable (imm8) — the portable branch must use scalar
   lane math, as the spike does.

## §2 Deep runtime gaps (design work, not shims)

5. **Guest memory: compiles, does not work.** `memory_posix.cpp` (mmap /
   `MAP_FIXED_NOREPLACE` / mprotect / mmap64) compiles under emcc, but probes
   run under node show: `mprotect` returns 0 while logging `unsupported syscall:
   __syscall_mprotect` (PROT_NONE pages stay readable/writable — verified read
   after PROT_NONE returns data, no fault); `MAP_FIXED` at a guest-like high
   address (`0x80000000`) fails with EINVAL; anonymous reservation itself works
   (incl. 512 MB, = Xbox 360 RAM size, so *capacity* is fine). Consequences:
   `protect_zero`-style no-access pages, guard pages, and fixed-address guest
   RAM mapping are all impossible as-is. Needs a **base-offset memory layer**
   (reserve one wasm region, translate guest addresses) plus auditing every
   fault-dependent path. This is the largest Phase-2 item.
6. **Fibers: `src/core/fiber_posix.cpp` is `ucontext.h`/`makecontext`/
   `swapcontext`.** Emscripten has no ucontext. The Xbox kernel thread model
   (`xthread`) is fiber-based, so guest threading needs a wasm fiber backend
   (one pthread per guest fiber, or Asyncify-based stack switching — each with
   perf/correctness trade-offs to measure).

## §3 Phase-2 viability verdict

**GO with scoped cost.** Parse/compile risk is retired: ReXApp, graphics
hierarchy, PPC codegen runtime, and a null-backend subclass all compile under
emcc 6.0.12. The remaining work is bounded and enumerable: ~4 small header
patches (§1) + memory-offset layer + fiber backend (§2) + full `rexruntime`
**link** under emcc (NOT attempted here — needs SDL3/Vulkan-headers/volk/
spirv-tools/glslang/FFmpeg/tracy/VMA submodule builds under Emscripten; that is
the next spike, Phase 1b) + codegen-output TU compile (needs a legal dump on a
dev machine; same constructs as S6, low risk) + thread/time/input drivers.
Playable graphics are explicitly NOT covered by this verdict — see
`docs/WEBGPU-INVESTIGATION.md`, which is the harder gate.
