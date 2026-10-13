#!/usr/bin/env python3
"""Reproducible WASM-blocker audit against _deps/nhl-legacy-recomp.

Counts the patterns from docs/WASM-PORT.md §2 so future work can track them down.
Usage: python3 scripts/wasm_audit.py [--root _deps/nhl-legacy-recomp]
"""
import argparse
import pathlib
import re
import sys

PATTERNS = {
    "windows.h / Win32": r"windows\.h|WIN32_LEAN_AND_MEAN|__declspec\(dllimport\)|_putenv_s|TerminateProcess|GetCurrentProcess|SetProcessDefaultCpuSets|_stricmp",
    "D3D12/DXGI/plume": r"D3D12|d3d12|dxgi|DXGI|plume",
    "Vulkan/FFX": r"[Vv]ulkan|FidelityFX|ffx|present_fsr|present_cas",
    "SIMD/x86-only": r"_mm_|__m128|__m256|immintrin|intrin\.h|-march=",
    "VP6/ffmpeg subprocess": r"ffmpeg|vp6|CreateProcess|pipe:1",
    "XInput/SDL/audio": r"XInput|XINPUT|SDL_|xaudio|XAudio|wasapi|audio_maxqframes",
    "ImGui/overlay/RenderDoc": r"imgui|ImGui|renderdoc|RenderDoc",
}

EXTS = {".cpp", ".h", ".cmake", ".txt", ".ps1", ".bat"}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="_deps/nhl-legacy-recomp")
    args = ap.parse_args()
    root = pathlib.Path(args.root)
    if not root.is_dir():
        print(f"missing {root}: run scripts/fetch_upstream.sh first", file=sys.stderr)
        return 2
    files = [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in EXTS]
    print(f"scanned files: {len(files)} under {root}")
    compiled = {k: re.compile(v) for k, v in PATTERNS.items()}
    totals = {k: 0 for k in PATTERNS}
    hit_files: dict[str, set[str]] = {k: set() for k in PATTERNS}
    for p in files:
        try:
            text = p.read_text(errors="ignore")
        except OSError:
            continue
        for name, rx in compiled.items():
            hits = rx.findall(text)
            if hits:
                totals[name] += len(hits)
                hit_files[name].add(str(p.relative_to(root)))
    for name in PATTERNS:
        print(f"{name:22s} hits={totals[name]:5d} files={len(hit_files[name])}")
        for f in sorted(hit_files[name])[:8]:
            print(f"    - {f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
