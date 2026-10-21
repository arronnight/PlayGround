# Duke Nukem 3D — Asset Attribution & Notice

## Source

The resources under this directory were extracted from **`duke3d.grp`** of
**Duke Nukem 3D: Atomic Edition v1.4 (1996)** and converted to
browser-friendly formats for use by the FPS ARENA engine.

- GRP archive (source):
  `duke-nukem-3d-atomic-edition-1.4-1996-atari-inc` — Internet Archive,
  file `Duke Nukem 3d Atomic Edition 1.4 (1996)(Atari Inc).zip/duke3d.grp`
- Extracted with `tools/convert-assets.mjs`.

## Ownership

Duke Nukem 3D and all of its game assets — artwork (ART), sounds (VOC),
music (MIDI), maps (MAP), animations (ANM), and palettes (PALETTE.DAT /
LOOKUP.DAT) — are the property of their respective rights holders
(3D Realms / Apogee and Atari, Inc.).

The Duke Nukem 3D **source code** was released under the GPL, but the
**game content itself (the GRP) is proprietary** and is not covered by
that license. These files are included here as extracted/converted data
for a fan project. Redistributing them may infringe copyright. If you do
not hold the rights, remove this directory and the game will fall back to
its original procedural assets and synthesized audio.

## What is here

| Path | Origin | Notes |
|------|--------|-------|
| `palette.json` | `PALETTE.DAT` | base VGA palette (6-bit ×4) + shade tables |
| `art/*.png` | `TILES###.ART` | decoded tile pages, RGBA, transparent = 255 |
| `art/manifest.json` | derived | tile id → {sheet,x,y,w,h} |
| `maps/*.json` | `*.MAP` | Build v7 geometry (full for E1L1–E1L3, E4L1; headers otherwise) |
| `voc/*.voc` | `*.VOC` | Creative Voice audio, copied verbatim |
| `mid/*.mid` | `*.MID` | Standard MIDI files, copied verbatim |
| `anm/*.anm` + `*.png` | `*.ANM` | DeluxePaint ANIM + first-frame PNG |

## Format references

- Build ART / MAP format: Ken Silverman's Build documentation, ModdingWiki.
- PALETTE.DAT / LOOKUP.DAT: `advsys.net/ken/palette.txt`, EDukeWiki.
- ANM: 3D Realms `ANIMLIB.C` (GPL) / DeluxePaint Animation spec.

The decoders in `tools/build-formats.mjs`, `tools/anm.mjs`, and the
runtime in `duke3d.js` are original re-implementations written for this
project.
