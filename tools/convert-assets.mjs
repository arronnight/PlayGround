/* Convert Duke Nukem 3D Build assets into browser-friendly files.
   Usage: node tools/convert-assets.mjs <grp-extracted-dir> <out-dir>

   Produces, under <out-dir>:
     palette.json           - base RGBA palette + shade info
     art/tiles###.png       - one sprite-sheet PNG per ART page (transparent)
     art/manifest.json      - tile -> {page,x,y,w,h} index for every tile id
     maps/<name>.json       - parsed Build map sectors/walls/sprites (v7)
     anm manifest is handled by the runtime (raw .anm copied)
     voc/*.voc              - copied verbatim (browser decodes at runtime)
     mid/*.mid              - copied verbatim (browser MIDI synth decodes)
   The ART spritesheet uses palette expansion; shade tables drive the
   palette-shaped lighting at runtime.
*/

import fs from 'node:fs';
import path from 'node:path';
import { parseArt, parsePalette, parseLookup, parseMap, paletteToRGBA } from './build-formats.mjs';
import { parseAnm, prepareAnm, renderAnmFrame } from './anm.mjs';
import { encodePNG } from './png.mjs';

const srcDir = process.argv[2];
const outDir = process.argv[3] || 'assets/duke3d';
if (!srcDir) { console.error('usage: node tools/convert-assets.mjs <src> <out>'); process.exit(1); }

function ensure(p) { fs.mkdirSync(p, { recursive: true }); }

const palBuf = fs.readFileSync(path.join(srcDir, 'PALETTE.DAT'));
const palette = parsePalette(palBuf);
const rgba = paletteToRGBA(palette.base);
console.log(`palette: ${palette.numpalookups} lookups`);

/* ---- palette.json ---- */
ensure(outDir);
fs.writeFileSync(path.join(outDir, 'palette.json'), JSON.stringify({
  numpalookups: palette.numpalookups,
  rgb6: Array.from(palette.base),
  palookup: Array.from(palette.palookup),
  source: 'Duke Nukem 3D Atomic Edition 1.4 PALETTE.DAT'
}));

/* ---- ART pages -> sprite sheets ---- */
const artDir = path.join(outDir, 'art');
ensure(artDir);
const artFiles = fs.readdirSync(srcDir).filter(f => /^TILES\d+\.ART$/i.test(f)).sort();
const manifest = { tileSizeMax: 0, tiles: {} };
let globalTileBase = 0; // Duke tile ids are sequential across pages

for (const af of artFiles) {
  const art = parseArt(fs.readFileSync(path.join(srcDir, af)));
  // Pack all tiles of this page into a single-row atlas (gap 1px)
  const valid = [];
  art.tiles.forEach((t, i) => { if (t) valid.push({ i, t }); });
  if (!valid.length) continue;

  // Simple shelf packing
  const maxW = 1024;
  let x = 0, y = 0, shelfH = 0, usedW = maxW;
  const placements = [];
  for (const v of valid) {
    if (x + v.t.width > maxW) { x = 0; y += shelfH + 1; shelfH = 0; }
    placements.push({ ...v, x, y });
    x += v.t.width + 1;
    shelfH = Math.max(shelfH, v.t.height);
    manifest.tileSizeMax = Math.max(manifest.tileSizeMax, v.t.width, v.t.height);
  }
  const sheetW = maxW;
  const sheetH = y + shelfH;
  const sheet = new Uint8Array(sheetW * sheetH * 4);
  for (const p of placements) {
    const t = p.t;
    for (let ty = 0; ty < t.height; ty++) {
      for (let tx = 0; tx < t.width; tx++) {
        const idx = t.pixels[ty * t.width + tx];
        if (idx === 255) continue; // transparent
        const sx = p.x + tx, sy = p.y + ty;
        const o = (sy * sheetW + sx) * 4;
        sheet[o] = rgba[idx * 4];
        sheet[o + 1] = rgba[idx * 4 + 1];
        sheet[o + 2] = rgba[idx * 4 + 2];
        sheet[o + 3] = 255;
      }
    }
  }
  const pngName = af.replace(/\.ART$/i, '.png').toLowerCase();
  fs.writeFileSync(path.join(artDir, pngName), encodePNG(sheetW, sheetH, sheet));
  for (const p of placements) {
    const id = art.tileStart + p.i;
    manifest.tiles[id] = { sheet: pngName, x: p.x, y: p.y, w: p.t.width, h: p.t.height };
  }
  console.log(`${af}: tiles ${art.tileStart}-${art.tileEnd} (${valid.length}) -> ${pngName} (${sheetW}x${sheetH})`);
}
fs.writeFileSync(path.join(artDir, 'manifest.json'), JSON.stringify(manifest));
console.log(`wrote ${Object.keys(manifest.tiles).length} tile records`);

/* ---- maps -> json (headers for all; full geometry for a curated set) ---- */
const mapDir = path.join(outDir, 'maps');
ensure(mapDir);
const mapFiles = fs.readdirSync(srcDir).filter(f => /\.MAP$/i.test(f)).sort();
const FULL_MAPS = new Set(['e1l1.map', 'e1l2.map', 'e1l3.map', 'e4l1.map']);
const mapIndex = [];
for (const mf of mapFiles) {
  const buf = fs.readFileSync(path.join(srcDir, mf));
  const info = parseMap(buf);
  const key = mf.replace(/\.MAP$/i, '.json').toLowerCase();
  const base = {
    name: mf,
    version: info.version,
    posx: info.posx, posy: info.posy, posz: info.posz,
    ang: info.ang, cursectnum: info.cursectnum,
    numsectors: info.numsectors, numwalls: info.numwalls, numsprites: info.numsprites,
  };
  if (FULL_MAPS.has(mf.toLowerCase())) {
    fs.writeFileSync(path.join(mapDir, key), JSON.stringify({
      ...base, sectors: info.sectors, walls: info.walls, sprites: info.sprites
    }));
  } else {
    fs.writeFileSync(path.join(mapDir, key), JSON.stringify(base));
  }
  mapIndex.push(mf.replace(/\.MAP$/i, '').toLowerCase());
}
fs.writeFileSync(path.join(mapDir, 'index.json'), JSON.stringify(mapIndex));
console.log(`wrote ${mapFiles.length} map records (${FULL_MAPS.size} full)`);

/* ---- copy VOC + MIDI verbatim ---- */
for (const [ext, dir] of [['.voc', 'voc'], ['.mid', 'mid']]) {
  const d = path.join(outDir, dir);
  ensure(d);
  const files = fs.readdirSync(srcDir).filter(f => f.toLowerCase().endsWith(ext));
  for (const f of files) fs.copyFileSync(path.join(srcDir, f), path.join(d, f.toLowerCase()));
  fs.writeFileSync(path.join(d, 'index.json'), JSON.stringify(files.map(f => f.toLowerCase())));
  console.log(`copied ${files.length} ${ext} files -> ${dir}/`);
}

/* ---- ANM cutscenes: copy raw + export first frame PNG ---- */
const anmDir = path.join(outDir, 'anm');
ensure(anmDir);
const anmFiles = fs.readdirSync(srcDir).filter(f => /\.ANM$/i.test(f)).sort();
const anmManifest = {};
for (const af of anmFiles) {
  const buf = fs.readFileSync(path.join(srcDir, af));
  const anim = prepareAnm(buf);
  if (!anim) { console.log(`skip ${af}`); continue; }
  fs.copyFileSync(path.join(srcDir, af), path.join(anmDir, af.toLowerCase()));
  const frame = renderAnmFrame(anim, 0);
  if (frame) {
    const rgbaF = new Uint8Array(frame.width * frame.height * 4);
    for (let i = 0; i < frame.width * frame.height; i++) {
      const idx = frame.pixels[i];
      rgbaF[i * 4] = frame.palette[idx * 3] * 4;
      rgbaF[i * 4 + 1] = frame.palette[idx * 3 + 1] * 4;
      rgbaF[i * 4 + 2] = frame.palette[idx * 3 + 2] * 4;
      rgbaF[i * 4 + 3] = 255;
    }
    fs.writeFileSync(path.join(anmDir, af.toLowerCase().replace(/\.anm$/, '.png')),
      encodePNG(frame.width, frame.height, rgbaF));
  }
  anmManifest[af.toLowerCase()] = {
    width: anim.header.width, height: anim.header.height,
    frames: anim.header.nFrames, fps: anim.header.framesPerSecond
  };
  console.log(`${af}: ${anim.header.width}x${anim.header.height}, ${anim.header.nFrames} frames`);
}
fs.writeFileSync(path.join(anmDir, 'manifest.json'), JSON.stringify(anmManifest));

console.log('done.');
