#!/usr/bin/env python3
"""Generate a synthetic .xtr trace fixture (no game assets).

Layout (see rex/graphics/trace_protocol.h + TraceReader::ParseTrace):
  TraceHeader{version=1, sha=zeros, title_id=0}
  PrimaryBufferStart{base=0, count=0}
  2x frames, each: PacketStart+DRAW_INDX, PacketEnd,
                   PacketStart+XE_SWAP,  PacketEnd,
                   Event{kSwap}
  PrimaryBufferEnd

PM4 dwords are stored big-endian (guest byte order); the reader uses
load_and_swap. DRAW_INDX header: type3 | count=2 | op 0x22.
XE_SWAP header: type3 | count=1 | op 0x64.
"""
import struct
import sys

K = {
    "PrimaryBufferStart": 0, "PrimaryBufferEnd": 1,
    "PacketStart": 4, "PacketEnd": 5, "Event": 9,
}
DRAW = 0xC0000000 | (2 << 16) | (0x22 << 8)   # type3, count, DRAW_INDX
SWAP = 0xC0000000 | (1 << 16) | (0x64 << 8)   # type3, count, XE_SWAP


def pkt(op_header, fill):
    out = struct.pack("<III", K["PacketStart"], 0, 1 + len(fill))
    for w in [op_header, *fill]:
        out += struct.pack(">I", w)  # guest byte order
    out += struct.pack("<I", K["PacketEnd"])
    return out


def main() -> int:
    out = struct.pack("<I40sI", 1, bytes(40), 0)          # TraceHeader
    out += struct.pack("<III", K["PrimaryBufferStart"], 0, 0)
    for _ in range(2):                                     # 2 frames
        out += pkt(DRAW, [0x00000003, 0x00000000])          # draw packet
        out += pkt(SWAP, [0x00000000])                     # swap packet
        out += struct.pack("<II", K["Event"], 0)           # kSwap event
    out += struct.pack("<I", K["PrimaryBufferEnd"])
    path = sys.argv[1] if len(sys.argv) > 1 else "synth.xtr"
    with open(path, "wb") as f:
        f.write(out)
    print(f"wrote {path} ({len(out)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
