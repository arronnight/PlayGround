# Building photo textures (optional, user-supplied)

The game ships with original procedural facades that mimic the look of common
reference photos (glass office grid / grungy concrete / brick apartments).
It does **not** vendor copyrighted photos.

If you own licensed copies of the reference photos, drop them here and the
game auto-uses them at runtime (no build step, works offline + in Electron):

| file you add          | used for                                   | your ref |
|-----------------------|--------------------------------------------|----------|
| `assets/office.jpg`   | commercial towers (glass grid)             | ref 1    |
| `assets/concrete.jpg` | industrial halls (stained concrete + panes)| ref 2    |
| `assets/brick.jpg`    | residential blocks (brick + white frames)  | ref 3    |
| `assets/atlas.jpg`    | 4×5 contact sheet → auto-cut into 20 cells | ref 4    |

Rules:
- Any `.jpg` / `.png` with that exact name works. Square-ish photos tile best.
- `atlas.jpg` is sliced in-browser as a 4 cols × 5 rows grid with a 4.5%
  gutter trim (matches the 568×708 seamless-skyscrapers sheet). See
  `tools/cut-atlas.py` if you prefer pre-cut PNGs for inspection.
- Files are loaded with a silent fallback: missing = procedural look-alikes.
- Photo mode is **opt-in** so the default console stays clean: press the
  🖼️ Photos button (or open the game with `?photos` in the URL). The game
  then probes `./assets/*.jpg` once and rebuilds. Press again to go back
  to procedural.
- Only use photos you have a license for (e.g. your own textures.com
  downloads under their license, or CC0 photos). Do not commit copyrighted
  files you don't have rights to redistribute.

Quick test: after adding files, reload — commercial/industrial/residential
rebuild automatically. A toast confirms "Atlas cut into 20 facades."
