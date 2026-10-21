/* Build-engine format readers for Duke Nukem 3D resources.
   Shared by the asset conversion tools. Plain Node, zero dependencies.

   Formats implemented:
   - PALETTE.DAT  : 256*3 base palette (RGB) + 256*3 shading table (after a 4-byte header 00 00 00 00)
                    Actual layout: [256 shades? no] -> we read the first 768 bytes as the base palette.
                    Duke3D PALETTE.DAT = 768 bytes base palette followed by 16800-byte shade table.
                    File we have is 82690 bytes: 768 base + 256*3*? ... we detect by structure.
   - LOOKUP.DAT   : 256 colors * 32 shades = 8192 bytes; plus a 1-byte count prefix (10266 seen -> 34 full tables)
   - TILES###.ART : Build ART v1 tile pages (RLE), Duke extended header
   - *.MAP        : Build map (v7 old layout used by Duke3D 1.3d/1.4)
   - *.ANM        : Build ANM animation container (Duke)
   - *.VOC        : Creative Labs VOC audio
   - *.MID        : Standard MIDI file (SMF)
*/

import fs from 'node:fs';

export function readFile(p) {
  return fs.readFileSync(p);
}

/* ---------------- PALETTE ---------------- */

// Duke3D PALETTE.DAT layout (see advsys.net/ken/palette.txt):
//   0..767      : 256*3 base palette, 6-bit VGA components (multiply by 4)
//   768..769    : numpalookups (int16 LE, usually 32)
//   770..       : numpalookups * 256 shade table
//   remainder   : 256*256 translucency table (Duke has 8K extra garbage)
export function parsePalette(buf) {
  const base = buf.subarray(0, 768);
  const numpalookups = buf.readUInt16LE(768);
  const shadeStart = 770;
  const shadeEnd = shadeStart + numpalookups * 256;
  const palookup = buf.subarray(shadeStart, Math.min(shadeEnd, buf.length));
  return { base, numpalookups, palookup };
}

// Expand the 6-bit VGA base palette (0..63) into 8-bit RGBA (0..255).
export function paletteToRGBA(base) {
  const out = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    out[i * 4] = Math.min(255, base[i * 3] * 4);
    out[i * 4 + 1] = Math.min(255, base[i * 3 + 1] * 4);
    out[i * 4 + 2] = Math.min(255, base[i * 3 + 2] * 4);
    out[i * 4 + 3] = 255;
  }
  return out;
}

// LOOKUP.DAT: [uint8 spritepals][spritepals * (1 + 256)] palette swaps, then
// alternate 768-byte palettes for cutscenes/title screens.
export function parseLookup(buf) {
  const nSwaps = buf[0];
  const swaps = [];
  let off = 1;
  for (let t = 0; t < nSwaps; t++) {
    const index = buf[off];
    const table = buf.subarray(off + 1, off + 257);
    swaps.push({ index, table });
    off += 257;
  }
  const altPalettes = [];
  while (off + 768 <= buf.length) {
    altPalettes.push(buf.subarray(off, off + 768));
    off += 768;
  }
  return { nSwaps, swaps, altPalettes };
}

/* ---------------- ART ---------------- */

// Build ART v1 (Duke3D): header = version(int32)=1, unknown(int32),
// localtilestart(int32), localtileend(int32), then numTiles int32 offsets
// where numTiles = localtileend - localtilestart + 1 (always 256 per page).
export function parseArt(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const version = dv.getUint32(0, true);
  const tileStart = dv.getUint32(8, true);
  const tileEnd = dv.getUint32(12, true);
  const numTiles = tileEnd - tileStart + 1;
  const offsets = [];
  for (let i = 0; i < numTiles; i++) offsets.push(dv.getUint32(16 + i * 4, true));
  offsets.push(buf.length); // sentinel
  const tiles = [];
  for (let i = 0; i < numTiles; i++) {
    const start = offsets[i];
    const end = offsets[i + 1];
    if (start >= buf.length) { tiles.push(null); continue; }
    tiles.push(decodeTile(buf, start, end));
  }
  return { version, numTiles, tileStart, tileEnd, tiles };
}

function decodeTile(buf, start, end) {
  if (start + 4 > buf.length) return null;
  const w = buf.readUInt16LE(start);
  const h = buf.readUInt16LE(start + 2);
  if (w === 0 || h === 0 || w > 2048 || h > 2048) return null;
  const pixels = new Uint8Array(w * h); // 0 = transparent by convention (Duke uses 255)
  pixels.fill(255);
  let p = start + 4;
  let x = 0, y = 0;
  while (p < end && y < h) {
    const b = buf[p++];
    if (b === 0) { // end of line: advance to next scanline
      x = 0; y++;
      continue;
    }
    const len = (b & 0x7f) + 1;
    if (b & 0x80) { // literal run
      for (let i = 0; i < len && y < h; i++) {
        const v = buf[p++];
        if (x < w) pixels[y * w + x] = v;
        x++;
      }
    } else { // repeated run
      const v = buf[p++];
      for (let i = 0; i < len && y < h; i++) {
        if (x < w) pixels[y * w + x] = v;
        x++;
      }
    }
    if (x >= w) { x = 0; y++; }
  }
  return { width: w, height: h, pixels };
}

/* ---------------- VOC ---------------- */

// Creative VOC: "Creative Voice File\x1a", header size uint16, version uint16,
// checksum uint16. Then blocks: type(1), size(3 LE). Type 1 = sound data:
// freq divisor (1 byte), codec (1 byte), then PCM.
export function parseVoc(buf) {
  const sig = buf.toString('latin1', 0, 19);
  if (!sig.startsWith('Creative Voice File')) return null;
  let off = buf.readUInt16LE(20);
  const blocks = [];
  while (off + 4 <= buf.length) {
    const type = buf[off];
    if (type === 0) break;
    const size = buf[off + 1] | (buf[off + 2] << 8) | (buf[off + 3] << 16);
    if (off + 4 + size > buf.length) break;
    const body = buf.subarray(off + 4, off + 4 + size);
    if (type === 1 && body.length > 2) {
      const divisor = body[0];
      const codec = body[1];
      const sampleRate = Math.round(1000000 / (256 - divisor));
      blocks.push({ type, codec, sampleRate, pcm: body.subarray(2) });
    } else if (type === 9 && body.length > 12) {
      // Block 9 "new header": uint32 rate, uint8 bits, uint8 channels,
      // uint16 codec, 4 reserved bytes, then PCM.
      const rate = body.readUInt32LE(0);
      const bits = body[4];
      const channels = body[5];
      const codec = body.readUInt16LE(6);
      const pcm = body.subarray(12);
      blocks.push({
        type,
        codec: codec === 4 || bits === 16 ? 4 : 0,
        sampleRate: rate,
        channels,
        pcm,
      });
    }
    off += 4 + size;
  }
  return { blocks };
}

/* ---------------- MIDI ---------------- */

// Standard MIDI File: "MThd".
export function parseMidi(buf) {
  if (buf.toString('latin1', 0, 4) !== 'MThd') return null;
  const headerLen = buf.readUInt32BE(4);
  const format = buf.readUInt16BE(8);
  const nTracks = buf.readUInt16BE(10);
  const division = buf.readUInt16BE(12);
  return { format, nTracks, division };
}

/* ---------------- MAP (Build v7) ---------------- */

// Build v7 map layout:
//   int32 mapversion
//   int32 posx, posy, posz
//   int16 ang, cursectnum
//   uint16 numsectors; sector[numsectors] (40 bytes each)
//   uint16 numwalls;    wall[numwalls] (32 bytes each)
//   uint16 numsprites;  sprite[numsprites] (44 bytes each)
export function parseMap(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const version = dv.getInt32(0, true);
  const posx = dv.getInt32(4, true);
  const posy = dv.getInt32(8, true);
  const posz = dv.getInt32(12, true);
  const ang = dv.getInt16(16, true);
  const cursectnum = dv.getInt16(18, true);
  const numsectors = dv.getUint16(20, true);
  let o = 22;
  const sectors = [];
  for (let i = 0; i < numsectors; i++) {
    sectors.push({
      wallptr: dv.getInt16(o, true), wallnum: dv.getInt16(o + 2, true),
      ceilingz: dv.getInt32(o + 4, true), floorz: dv.getInt32(o + 8, true),
      ceilingstat: dv.getUint16(o + 12, true), floorstat: dv.getUint16(o + 14, true),
      ceilingpicnum: dv.getInt16(o + 16, true), floorpicnum: dv.getInt16(o + 28, true),
      lotag: dv.getInt16(o + 36, true), hitag: dv.getInt16(o + 38, true),
    });
    o += 40;
  }
  const numwalls = dv.getUint16(o, true); o += 2;
  const walls = [];
  for (let i = 0; i < numwalls; i++) {
    walls.push({
      x: dv.getInt32(o, true), y: dv.getInt32(o + 4, true),
      point2: dv.getInt16(o + 8, true), nextwall: dv.getInt16(o + 10, true),
      nextsector: dv.getInt16(o + 12, true), cstat: dv.getUint16(o + 14, true),
      picnum: dv.getInt16(o + 16, true), overpicnum: dv.getInt16(o + 18, true),
      lotag: dv.getInt16(o + 28, true),
    });
    o += 32;
  }
  const numsprites = dv.getUint16(o, true); o += 2;
  const sprites = [];
  for (let i = 0; i < numsprites; i++) {
    sprites.push({
      x: dv.getInt32(o, true), y: dv.getInt32(o + 4, true), z: dv.getInt32(o + 8, true),
      cstat: dv.getUint16(o + 12, true), picnum: dv.getInt16(o + 14, true),
      sectnum: dv.getInt16(o + 26, true), statnum: dv.getInt16(o + 28, true),
      ang: dv.getInt16(o + 30, true), lotag: dv.getInt16(o + 40, true),
      hitag: dv.getInt16(o + 42, true),
    });
    o += 44;
  }
  return { version, posx, posy, posz, ang, cursectnum, numsectors, sectors, numwalls, walls, numsprites, sprites };
}


