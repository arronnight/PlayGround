/* DeluxePaint Animation (.ANM) decoder — the format Duke Nukem 3D uses for
   its cutscenes/logos ("LPF " / "ANIM" large-page FLIC-like format).
   Ported from the 3D Realms ANIMLIB.C reference implementation (GPL). */

const IMAGEBUFFER = 0x10000;

export function parseAnm(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  if (buf.toString('latin1', 0, 4) !== 'LPF ') return null;
  const h = {
    id: buf.toString('latin1', 0, 4),
    maxLps: dv.getUint16(4, true),
    nLps: dv.getUint16(6, true),
    nRecords: dv.getUint32(8, true),
    maxRecsPerLp: dv.getUint16(12, true),
    lpfTableOffset: dv.getUint16(14, true),
    contentType: buf.toString('latin1', 16, 20),
    width: dv.getUint16(20, true),
    height: dv.getUint16(22, true),
    variant: buf[24], version: buf[25],
    hasLastDelta: buf[26], lastDeltaValid: buf[27],
    pixelType: buf[28], compressionType: buf[29],
    otherRecsPerFrm: buf[30], bitmaptype: buf[31],
    nFrames: dv.getUint32(64, true),
    framesPerSecond: dv.getUint16(68, true),
  };
  if (h.contentType !== 'ANIM') return null;

  // Palette: 256 entries of 4 bytes (R,G,B,pad) starting after header(128)+pad(128)
  const palOff = 128 + 128;
  const pal = new Uint8Array(768);
  for (let i = 0; i < 256; i++) {
    const s = palOff + i * 4;
    pal[i * 3] = buf[s];
    pal[i * 3 + 1] = buf[s + 1];
    pal[i * 3 + 2] = buf[s + 2];
  }

  // Large page descriptors follow the palette
  const lpOff = palOff + 1024;
  const lps = [];
  for (let i = 0; i < h.nLps; i++) {
    const o = lpOff + i * 6;
    lps.push({
      baseRecord: dv.getUint16(o, true),
      nRecordsRaw: dv.getUint16(o + 2, true),
      nBytes: dv.getUint16(o + 4, true),
      // bits 15/14 of nRecords are continuation flags
      nRecords: dv.getUint16(o + 2, true) & 0x3fff,
    });
  }
  // Large page data region starts after descriptors
  const lpDataStart = lpOff + h.nLps * 6;
  return { header: h, palette: pal, lps, lpDataStart };
}

// Decode one frame index into an RGBA pixel buffer (anim is mutable to cache state).
export function renderAnmFrame(anim, frameNumber) {
  const h = anim.header;
  const found = findPage(anim, frameNumber);
  if (!found) return null;
  const { lp, index } = found;
  // Large pages live at fixed 64KB strides starting at 0xb00.
  const pageBase = 0xb00 + index * IMAGEBUFFER;
  const dv = new DataView(anim.buf.buffer, anim.buf.byteOffset, anim.buf.byteLength);
  // Record-size table (uint16 * nRecords) lives right after the on-page descriptor.
  const localFrame = frameNumber - lp.baseRecord;
  let offset = 0;
  for (let f = 0; f < localFrame; f++) offset += dv.getUint16(pageBase + 6 + f * 2, true);
  let p = pageBase + 6 + lp.nRecordsRaw * 2 + offset;
  const flagsHi = anim.buf[p + 1];
  if (flagsHi) {
    const temp = dv.getUint16(p + 2, true);
    p += 4 + temp + (temp & 1);
  } else {
    p += 4;
  }
  const out = decodeFrame(anim.buf, p, anim.imageBuffer);
  return { width: h.width, height: h.height, pixels: out, palette: anim.palette };
}

function findPage(anim, frameNumber) {
  for (let i = 0; i < anim.lps.length; i++) {
    const lp = anim.lps[i];
    if (lp.baseRecord <= frameNumber && frameNumber < lp.baseRecord + lp.nRecords) return { lp, index: i };
  }
  return null;
}

// ANIM "RunSkipDump" decompressor. Ported literally from 3D Realms ANIMLIB.C.
function decodeFrame(buf, src, dst) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let d = 0;
  let guard = 0;
  const MAXPIX = dst.length;
  while (guard++ < 1 << 22) {
    const count = buf[src];
    src += 1;
    if (count === 0) { // short RLE: color at src+1, 8-bit count at src
      const color = buf[src + 1];
      const n = buf[src];
      src += 2;
      dst.fill(color, d, Math.min(d + n, MAXPIX));
      d += n;
      continue;
    } else if ((count & 0x80) === 0) { // short copy
      for (let i = 0; i < count; i++) if (d + i < MAXPIX) dst[d + i] = buf[src + i];
      d += count; src += count;
      continue;
    } else { // short skip
      const n = count & 0x7f;
      if (n > 0) { d += n; continue; }
    }
    // long op
    let lc = dv.getUint16(src, true);
    src += 2;
    if (lc === 0) break; // stop sign
    if ((lc & 0x8000) === 0) { d += lc; continue; } // long skip
    if ((lc & 0x4000) !== 0) { // long RLE
      const n = lc & 0x3fff;
      const color = buf[src]; src += 1;
      dst.fill(color, d, Math.min(d + n, MAXPIX));
      d += n;
      continue;
    }
    const n = lc & 0x7fff;
    for (let i = 0; i < n; i++) if (d + i < MAXPIX) dst[d + i] = buf[src + i];
    d += n; src += n;
  }
  return dst;
}

// Prep an anim for decoding by attaching the source buffer and work buffers.
export function prepareAnm(buf) {
  const anim = parseAnm(buf);
  if (!anim) return null;
  anim.buf = buf;
  anim.imageBuffer = new Uint8Array(IMAGEBUFFER);
  return anim;
}
