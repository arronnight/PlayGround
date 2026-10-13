#!/usr/bin/env python3
"""Cut a 4x5 building-facade contact sheet (ref 4) into 20 cells.

Usage:
    python3 tools/cut-atlas.py input.jpg [out_dir] [--cols 4 --rows 5 --gutter 0.045]

Defaults match the 568x708 seamless-skyscrapers sheet: 4 cols x 5 rows with a
4.5% gutter trim so cells don't bleed into each other.

Requires: pip install pillow
"""
import argparse
import os
import sys

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('input', help='contact sheet image (e.g. your atlas.jpg)')
    ap.add_argument('out', nargs='?', default='assets/cells')
    ap.add_argument('--cols', type=int, default=4)
    ap.add_argument('--rows', type=int, default=5)
    ap.add_argument('--gutter', type=float, default=0.045,
                    help='fraction of a cell trimmed on each side')
    args = ap.parse_args()
    try:
        from PIL import Image
    except ImportError:
        print('pip install pillow', file=sys.stderr)
        return 1
    img = Image.open(args.input).convert('RGB')
    w, h = img.size
    cw, ch = w / args.cols, h / args.rows
    os.makedirs(args.out, exist_ok=True)
    n = 0
    for r in range(args.rows):
        for q in range(args.cols):
            sx = int(q * cw + cw * args.gutter)
            sy = int(r * ch + ch * args.gutter)
            sw = int(cw * (1 - 2 * args.gutter))
            sh = int(ch * (1 - 2 * args.gutter))
            cell = img.crop((sx, sy, sx + sw, sy + sh)).resize((256, 256), Image.LANCZOS)
            cell.save(os.path.join(args.out, f'cell-{r}-{q}.png'))
            n += 1
    print(f'wrote {n} cells to {args.out}/ ({w}x{h} -> {args.cols}x{args.rows})')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
