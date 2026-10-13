// SPIKE SHIM (not upstream): software-emulated FPSCR for wasm32.
// Upstream implements x86_64 (SSE CSR) and AArch64 (FPCR) only.
// Wasm has no control register; rounding/exception control is emulated in
// a thread-local CSR. Rounding-mode writes do NOT affect native wasm f32/f64
// ops (round-to-nearest) -> Phase-2 correctness risk for PPC float sequences
// that switch rounding modes. See docs/EMSDK-SPIKE.md.
#pragma once
#include <cmath>
#include <rex/types.h>
namespace rex::platform {
struct FPSCRPlatform {
  static constexpr size_t RoundShift = 13;
  static constexpr size_t RoundMaskVal = 0x6000;
  static constexpr size_t FlushMask = 0x8040;
  static constexpr u32 ExceptionMask =
      (1u << 7) | (1u << 8) | (1u << 9) | (1u << 10) | (1u << 11) | (1u << 12);
  static constexpr size_t GuestToHost[] = {0x0000, 0x6000, 0x2000, 0x4000};
  static inline u32 getcsr() noexcept;
  static inline void setcsr(u32 csr) noexcept;
  static inline void InitHostExceptions(u32& csr) noexcept { csr |= ExceptionMask; }
};
inline thread_local u32 g_wasm_soft_csr = 0x1F80;
inline u32 FPSCRPlatform::getcsr() noexcept { return g_wasm_soft_csr; }
inline void FPSCRPlatform::setcsr(u32 csr) noexcept { g_wasm_soft_csr = csr; }
}  // namespace rex::platform
