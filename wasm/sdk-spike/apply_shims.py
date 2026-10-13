#!/usr/bin/env python3
"""Generate the patched intrinsics.h copy for the wasm SDK spike.

Reads _deps/rexglue-sdk/include/rex/ppc/intrinsics.h (NOT vendored) and writes
a copy with portable fallbacks for simde_mm_vsl/vslo/vsro, which upstream
implements for x86_64/ARM64 only. The guarded logic is already portable C, so
the fallback mirrors the existing branches. vsl shift is 1..7 at that point
(0 early-outs above), so scalar lane math is exact.

Usage: python3 wasm/sdk-spike/apply_shims.py [--sdk DIR] [--out DIR]
"""
import argparse
import pathlib
import sys

VSL_OLD = '#error "Unsupported architecture for simde_mm_vsl (only x86_64 and ARM64 supported)"'
VSLO_OLD = '#error "Unsupported architecture for simde_mm_vslo (only x86_64 and ARM64 supported)"'
VSRO_OLD = '#error "Unsupported architecture for simde_mm_vsro (only x86_64 and ARM64 supported)"'

VSL_NEW = """// Portable fallback (any arch incl. wasm32): shift is 1..7 here (0 early-outs).
  alignas(16) uint64_t lanes[2];
  simde_mm_store_si128((simde__m128i*)lanes, a);
  uint64_t lo = lanes[0], hi = lanes[1];
  hi = (hi << shift) | (lo >> (64 - shift));
  lo <<= shift;
  lanes[0] = lo;
  lanes[1] = hi;
  return simde_mm_load_si128((simde__m128i*)lanes);"""

VSLO_NEW = """alignas(16) uint8_t src[16], dst[16];
  simde_mm_store_si128((simde__m128i*)src, a);
  memset(dst, 0, sizeof(dst));
  memcpy(dst + shift_bytes, src, 16 - shift_bytes);
  return simde_mm_load_si128((simde__m128i*)dst);"""

VSRO_NEW = """alignas(16) uint8_t src[16], dst[16];
  simde_mm_store_si128((simde__m128i*)src, a);
  memset(dst, 0, sizeof(dst));
  memcpy(dst, src + shift_bytes, 16 - shift_bytes);
  return simde_mm_load_si128((simde__m128i*)dst);"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sdk", default="_deps/rexglue-sdk")
    ap.add_argument("--out", default="out/wasm-spike/shim/rex/ppc/intrinsics.h")
    args = ap.parse_args()
    src_path = pathlib.Path(args.sdk) / "include/rex/ppc/intrinsics.h"
    if not src_path.is_file():
        print(f"missing {src_path}: run scripts/fetch_upstream.sh first", file=sys.stderr)
        return 2
    src = src_path.read_text()
    for old, new in ((VSL_OLD, VSL_NEW), (VSLO_OLD, VSLO_NEW), (VSRO_OLD, VSRO_NEW)):
        if src.count(old) != 1:
            print(f"pattern not found exactly once (upstream drift?): {old[:60]}...",
                  file=sys.stderr)
            return 1
        src = src.replace(old, new)
    out = pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(src)
    print(f"wrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
