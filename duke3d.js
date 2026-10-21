/* Duke3D resource runtime for FPS ARENA.
   Loads and uses the converted Duke Nukem 3D (Atomic Edition) GRP assets:
     - VOC  sound effects  -> Web Audio playback
     - MID    music tracks -> built-in MIDI synth (SoundFont-free FM-ish voices)
     - ART    tile pages   -> THREE textures / CanvasTexture sprites
     - MAP    Build maps   -> sector/wall/sprite geometry
     - ANM    cutscenes    -> animated frames drawn to a canvas
   Assets live under assets/duke3d/ (see ATTRIBUTION.md).

   Public surface:
     await Duke3D.load()                 -> loads palette + ART manifest
     Duke3D.playVoc(name)                -> play a .voc sound
     Duke3D.midi                            -> { play(name, gain), stop() }
     Duke3D.tile(id)                        -> { texture, canvas, w, h } (cached)
     Duke3D.makeSpriteTexture(id)           -> THREE.CanvasTexture for billboards
     Duke3D.loadMap(name)                   -> parsed map JSON
     Duke3D.anm                             -> { load(name), draw(ctx, t) }
*/

const BASE = 'assets/duke3d';

export const Duke3D = {
  ready: false,
  palette: null,
  art: { manifest: null, sheets: new Map(), canvas: new Map() },
  _texCache: new Map(),
  _vocCache: new Map(),
  _tileIndex: new Map(),      // tile id -> {sheet,x,y,w,h}
  _atlas: new Map(),          // sheet name -> Image
  _vocList: null,
  _midList: null,
};

/* ============================================================
   LOADING
   ============================================================ */

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch ${url}: ${r.status}`);
  return r.json();
}
async function fetchBytes(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch ${url}: ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}
function loadImage(url) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = url;
  });
}

Duke3D.load = async function load() {
  if (Duke3D.ready) return Duke3D;
  try {
    const [pal, man, vocList, midList] = await Promise.all([
      fetchJSON(`${BASE}/palette.json`),
      fetchJSON(`${BASE}/art/manifest.json`),
      fetchJSON(`${BASE}/voc/index.json`).catch(() => null),
      fetchJSON(`${BASE}/mid/index.json`).catch(() => null),
    ]);
    Duke3D.palette = pal;
    Duke3D.art.manifest = man;
    Duke3D._vocList = vocList || [];
    Duke3D._midList = midList || [];
    for (const [id, rec] of Object.entries(man.tiles)) {
      Duke3D._tileIndex.set(Number(id), rec);
    }
    Duke3D.ready = true;
    Duke3D.availableTiles = Duke3D._tileIndex.size;
  } catch (e) {
    console.warn('[Duke3D] asset load failed:', e.message);
  }
  return Duke3D;
};

/* ============================================================
   ART — tile pages -> canvas / THREE textures
   ============================================================ */

async function ensureSheet(sheetName) {
  if (Duke3D.art.canvas.has(sheetName)) return Duke3D.art.canvas.get(sheetName);
  const img = await loadImage(`${BASE}/art/${sheetName}`);
  Duke3D.art.canvas.set(sheetName, img);
  return img;
}

// Returns a canvas cropped to the tile, or null if tile is unknown/empty.
Duke3D.tileCanvas = async function tileCanvas(id) {
  const rec = Duke3D._tileIndex.get(id);
  if (!rec) return null;
  const img = await ensureSheet(rec.sheet);
  const cv = document.createElement('canvas');
  cv.width = rec.w; cv.height = rec.h;
  const g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(img, rec.x, rec.y, rec.w, rec.h, 0, 0, rec.w, rec.h);
  return cv;
};

// THREE.CanvasTexture (nearest filter) for floors/walls/sprites. Optional THREE arg.
Duke3D.tileTexture = async function tileTexture(id, THREE) {
  if (Duke3D._texCache.has(id)) return Duke3D._texCache.get(id);
  const cv = await Duke3D.tileCanvas(id);
  if (!cv) return null;
  let tex;
  if (THREE) {
    tex = new THREE.CanvasTexture(cv);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestMipmapNearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  } else {
    tex = cv;
  }
  Duke3D._texCache.set(id, tex);
  return tex;
};

// Convenience: build a wall/floor texture repeating to a pixel size.
Duke3D.scaledTile = async function scaledTile(id, repeatX, repeatY) {
  const cv = await Duke3D.tileCanvas(id);
  if (!cv) return null;
  const out = document.createElement('canvas');
  out.width = 256; out.height = 256;
  const g = out.getContext('2d');
  g.imageSmoothingEnabled = false;
  for (let y = 0; y < out.height; y += cv.height) {
    for (let x = 0; x < out.width; x += cv.width) {
      g.drawImage(cv, x, y);
    }
  }
  return out;
};

/* ---- Texture pack: map level themes -> real Duke tile ids ----
   We prefer square, repeatable tiles (64/128/256) discovered in the ART
   pages. Callers get a THREE.CanvasTexture (clamped 256x256). Falls back
   to null when assets are missing so the procedural art stays in charge. */
const DUKE_THEMES = {
  metal:   { wall: [4181, 4192, 4320, 4137], floor: [1288, 1399], ceil: [4203, 4265] },
  tech:    { wall: [4203, 4265, 4309, 4324], floor: [3337, 3516], ceil: [4137] },
  stone:   { wall: [536, 585, 710], floor: [297, 425], ceil: [536] },
  concrete:{ wall: [4181, 4176, 4165], floor: [1288, 1289], ceil: [4203] },
};
Duke3D.themes = DUKE_THEMES;

Duke3D.textureFor = async function textureFor(theme, kind, THREE) {
  const t = DUKE_THEMES[theme];
  const ids = (t && t[kind]) || [];
  for (const id of ids) {
    if (!Duke3D._tileIndex.has(id)) continue;
    const cv = await Duke3D.scaledTile(id);
    if (!cv) continue;
    const tex = THREE ? new THREE.CanvasTexture(cv) : cv;
    if (THREE) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestMipmapLinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    }
    return tex;
  }
  return null;
};

/* ============================================================
   VOC — sound effects
   ============================================================ */

function decodeVoc(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length < 26) return null;
  const sig = String.fromCharCode(...bytes.subarray(0, 19));
  if (!sig.startsWith('Creative Voice File')) return null;
  let off = dv.getUint16(20, true);
  const chunks = [];
  while (off + 4 <= bytes.length) {
    const type = bytes[off];
    if (type === 0) break;
    const size = bytes[off + 1] | (bytes[off + 2] << 8) | (bytes[off + 3] << 16);
    if (off + 4 + size > bytes.length) break;
    const body = bytes.subarray(off + 4, off + 4 + size);
    if (type === 1 && body.length > 2) {
      const divisor = body[0];
      const codec = body[1];
      chunks.push({
        sampleRate: Math.round(1000000 / (256 - divisor)),
        codec, pcm: body.subarray(2),
      });
    } else if (type === 9 && body.length > 12) {
      // Block 9 "new header": uint32 rate, uint8 bits, uint8 channels,
      // uint16 codec, 4 reserved bytes, then PCM.
      const rate = body[0] | (body[1] << 8) | (body[2] << 16) | (body[3] << 24);
      const bits = body[4];
      const codec = body[6] | (body[7] << 8);
      // Map 16-bit signed (codec 4) vs 8-bit unsigned (codec 0)
      chunks.push({
        sampleRate: rate,
        codec: codec === 4 || bits === 16 ? 4 : 0,
        pcm: body.subarray(12),
      });
    }
    off += 4 + size;
  }
  return chunks.length ? chunks : null;
}

Duke3D.loadVoc = async function loadVoc(name) {
  const clean = name.toLowerCase();
  if (Duke3D._vocCache.has(clean)) return Duke3D._vocCache.get(clean);
  const url = `${BASE}/voc/${clean.endsWith('.voc') ? clean : clean + '.voc'}`;
  try {
    const bytes = await fetchBytes(url);
    const chunks = decodeVoc(bytes);
    const result = chunks ? { bytes, chunks } : null;
    Duke3D._vocCache.set(clean, result);
    return result;
  } catch {
    Duke3D._vocCache.set(clean, null);
    return null;
  }
};

// Play a VOC through a Web Audio context. Returns duration in ms (0 on failure).
Duke3D.playVoc = async function playVoc(name, actx, dest, volume) {
  const voc = await Duke3D.loadVoc(name);
  if (!voc || !actx) return 0;
  let total = 0;
  for (const c of voc.chunks) {
    // Skip malformed/unsupported chunks (Web Audio requires 3000..768000 Hz).
    if (!c.sampleRate || c.sampleRate < 3000 || c.sampleRate > 200000) continue;
    // codec 0 = 8-bit unsigned PCM; codec 1 = 8-bit signed; codec 4 = 16-bit signed
    const is16 = c.codec === 4;
    if (c.codec !== 0 && c.codec !== 1 && c.codec !== 4) continue;
    const n = is16 ? c.pcm.length >> 1 : c.pcm.length;
    if (n === 0) continue;
    const buf = actx.createBuffer(1, n, c.sampleRate);
    const out = buf.getChannelData(0);
    if (is16) {
      const dv = new DataView(c.pcm.buffer, c.pcm.byteOffset, c.pcm.byteLength);
      for (let i = 0; i < n; i++) out[i] = dv.getInt16(i * 2, true) / 32768;
    } else {
      for (let i = 0; i < n; i++) out[i] = c.codec === 1
        ? c.pcm[i] / 128
        : (c.pcm[i] - 128) / 128;
    }
    const src = actx.createBufferSource();
    src.buffer = buf;
    const g = actx.createGain();
    g.gain.value = volume == null ? 0.7 : volume;
    src.connect(g); g.connect(dest || actx.destination);
    const when = actx.currentTime + total / 1000;
    src.start(when);
    total += (n / c.sampleRate) * 1000;
  }
  return total;
};

/* ============================================================
   MIDI — music synthesis (no fonts; additive FM-ish voices)
   ============================================================ */

// A compact event list: [timeSec, noteHz, durSec, vel]
function midiToSchedule(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (String.fromCharCode(...bytes.subarray(0, 4)) !== 'MThd') return null;
  // SMF is BIG-ENDIAN.
  const division = dv.getUint16(12, false) || 480;
  let p = 8 + dv.getUint32(4, false);
  const tempoEvents = [];
  // Two passes: collect tempo changes then convert ticks -> seconds.
  const raw = [];
  while (p + 8 <= bytes.length) {
    const id = String.fromCharCode(...bytes.subarray(p, p + 4));
    const len = dv.getUint32(p + 4, false);
    const end = p + 8 + len;
    if (id !== 'MTrk') { p = end; continue; }
    let t = 0, running = 0, i = p + 8;
    while (i < end) {
      let delta = 0, b;
      do { b = bytes[i++]; delta = (delta << 7) | (b & 0x7f); } while (b & 0x80);
      t += delta;
      let status = bytes[i];
      if (status & 0x80) { i++; running = status; } else status = running;
      const hi = status & 0xf0;
      if (hi === 0x90) {
        const note = bytes[i++], vel = bytes[i++];
        raw.push({ t, note, vel, on: vel > 0 });
      } else if (hi === 0x80) {
        const note = bytes[i++], vel = bytes[i++];
        raw.push({ t, note, vel: 0, on: false });
      } else if (hi === 0xc0 || hi === 0xd0) i += 1;
      else if (hi === 0xa0 || hi === 0xb0 || hi === 0xe0) i += 2;
      else if (status === 0xff) {
        const type = bytes[i++];
        let slen = 0, b2; do { b2 = bytes[i++]; slen = (slen << 7) | (b2 & 0x7f); } while (b2 & 0x80);
        if (type === 0x51 && slen === 3) {
          tempoEvents.push({ t, tempo: (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2] });
        }
        i += slen;
      } else if (status === 0xf0 || status === 0xf7) {
        let slen = 0, b2; do { b2 = bytes[i++]; slen = (slen << 7) | (b2 & 0x7f); } while (b2 & 0x80);
        i += slen;
      } else i += 1;
    }
    p = end;
  }
  raw.sort((a, b) => a.t - b.t);
  tempoEvents.push({ t: 0, tempo: 500000 });
  tempoEvents.sort((a, b) => a.t - b.t);
  // Convert ticks to seconds using tempo map
  const tickToSec = (tick) => {
    let sec = 0, lastTick = 0, cur = 500000;
    for (const te of tempoEvents) {
      if (te.t >= tick) break;
      sec += ((te.t - lastTick) / division) * (cur / 1e6);
      lastTick = te.t; cur = te.tempo;
    }
    sec += ((tick - lastTick) / division) * (cur / 1e6);
    return sec;
  };
  // Pair on/off
  const open = new Map();
  const notes = [];
  for (const e of raw) {
    if (e.on) {
      if (!open.has(e.note)) open.set(e.note, []);
      open.get(e.note).push(e);
    } else {
      const st = open.get(e.note);
      if (st && st.length) {
        const on = st.shift();
        notes.push({ start: tickToSec(on.t), dur: tickToSec(e.t) - tickToSec(on.t), note: e.note, vel: on.vel });
      }
    }
  }
  notes.sort((a, b) => a.start - b.start);
  const endSec = notes.reduce((m, n) => Math.max(m, n.start + n.dur), 0);
  return { notes, division, duration: endSec };
}

function noteHz(n) { return 440 * Math.pow(2, (n - 69) / 12); }

Duke3D.midi = {
  _active: null,
  _cache: new Map(),
  async load(name) {
    const clean = name.toLowerCase();
    if (this._cache.has(clean)) return this._cache.get(clean);
    try {
      const bytes = await fetchBytes(`${BASE}/mid/${clean.endsWith('.mid') ? clean : clean + '.mid'}`);
      const sched = midiToSchedule(bytes);
      this._cache.set(clean, sched);
      return sched;
    } catch { this._cache.set(clean, null); return null; }
  },
  // Schedule a whole track through Web Audio. Returns a handle.
  async play(name, actx, dest, gainVal) {
    const clean = name.toLowerCase();
    const sched = await this.load(name);
    if (!sched || !actx) return null;
    this.stop();
    const gain = actx.createGain();
    gain.gain.value = gainVal == null ? 0.18 : gainVal;
    gain.connect(dest || actx.destination);
    const t0 = actx.currentTime + 0.05;
    const loopLen = sched.duration + 0.3;
    let loopNodes = [];
    const startAll = (offset) => {
      // Stop the previous loop's oscillators (they've already ended anyway).
      for (const o of loopNodes) { try { o.stop(); } catch {} }
      loopNodes = [];
      // Cap simultaneous notes so dense songs don't blow up node counts.
      const notes = sched.notes.length > 4000
        ? sched.notes.filter((_, i) => i % 2 === 0) : sched.notes;
      for (const n of notes) {
        const f = noteHz(n.note);
        const osc1 = actx.createOscillator();
        osc1.type = 'triangle'; osc1.frequency.value = f;
        const osc2 = actx.createOscillator();
        osc2.type = 'square'; osc2.frequency.value = f * 2.005;
        const ng = actx.createGain();
        const v = (n.vel / 127) * 0.08;
        const tStart = t0 + offset + n.start;
        const tEnd = tStart + Math.max(0.06, n.dur) + 0.02;
        ng.gain.setValueAtTime(0.0001, tStart);
        ng.gain.exponentialRampToValueAtTime(v, tStart + 0.01);
        ng.gain.exponentialRampToValueAtTime(0.0001, tStart + Math.max(0.05, n.dur));
        osc1.connect(ng); osc2.connect(ng); ng.connect(gain);
        osc1.start(tStart); osc1.stop(tEnd);
        osc2.start(tStart); osc2.stop(tEnd);
        loopNodes.push(osc1, osc2);
      }
    };
    let loops = 0;
    startAll(0);
    const loopT = setInterval(() => {
      if (!this._active || this._active.interval !== loopT) return;
      loops++;
      if (loops > 400) { clearInterval(loopT); return; }
      startAll(loopLen * loops);
    }, loopLen * 1000);
    this._active = { name: clean, gain, get nodes() { return loopNodes; }, interval: loopT, actx };
    return this._active;
  },
  stop() {
    if (this._active) {
      try { this._active.gain.disconnect(); } catch {}
      for (const o of this._active.nodes) { try { o.stop(); } catch {} }
      clearInterval(this._active.interval);
    }
    this._active = null;
  },
};

/* ============================================================
   MAP — Build map loading
   ============================================================ */

Duke3D.loadMap = async function loadMap(name) {
  const clean = name.toLowerCase().replace(/\.map$/, '');
  try {
    return await fetchJSON(`${BASE}/maps/${clean}.json`);
  } catch { return null; }
};

/* ============================================================
   ANM — DeluxePaint cutscene playback (runtime decoder)
   ============================================================ */

function anmDecodeFrame(anim, frameNumber) {
  const h = anim.header;
  let lpIndex = -1;
  for (let i = 0; i < anim.lps.length; i++) {
    const lp = anim.lps[i];
    if (lp.baseRecord <= frameNumber && frameNumber < lp.baseRecord + lp.nRecords) { lpIndex = i; break; }
  }
  if (lpIndex < 0) return null;
  const lp = anim.lps[lpIndex];
  const pageBase = 0xb00 + lpIndex * 0x10000;
  const dv = new DataView(anim.bytes.buffer, anim.bytes.byteOffset, anim.bytes.byteLength);
  const localFrame = frameNumber - lp.baseRecord;
  let offset = 0;
  for (let f = 0; f < localFrame; f++) offset += dv.getUint16(pageBase + 6 + f * 2, true);
  let p = pageBase + 6 + lp.nRecordsRaw * 2 + offset;
  if (anim.bytes[p + 1]) {
    const temp = dv.getUint16(p + 2, true);
    p += 4 + temp + (temp & 1);
  } else p += 4;
  // decode
  const dst = anim.imageBuffer;
  let d = 0, guard = 0;
  while (guard++ < (1 << 22)) {
    const count = anim.bytes[p]; p += 1;
    if (count === 0) {
      const color = anim.bytes[p + 1]; const n = anim.bytes[p]; p += 2;
      dst.fill(color, d, Math.min(d + n, dst.length)); d += n; continue;
    } else if ((count & 0x80) === 0) {
      for (let i = 0; i < count; i++) if (d + i < dst.length) dst[d + i] = anim.bytes[p + i];
      d += count; p += count; continue;
    } else { const n = count & 0x7f; if (n > 0) { d += n; continue; } }
    let lc = dv.getUint16(p, true); p += 2;
    if (lc === 0) break;
    if ((lc & 0x8000) === 0) { d += lc; continue; }
    if ((lc & 0x4000) !== 0) {
      const n = lc & 0x3fff; const color = anim.bytes[p]; p += 1;
      dst.fill(color, d, Math.min(d + n, dst.length)); d += n; continue;
    }
    const n = lc & 0x7fff;
    for (let i = 0; i < n; i++) if (d + i < dst.length) dst[d + i] = anim.bytes[p + i];
    d += n; p += n;
  }
  return { width: h.width, height: h.height, pixels: dst };
}

Duke3D.anm = {
  _cache: new Map(),
  async load(name) {
    const clean = name.toLowerCase();
    if (this._cache.has(clean)) return this._cache.get(clean);
    try {
      const bytes = await fetchBytes(`${BASE}/anm/${clean.endsWith('.anm') ? clean : clean + '.anm'}`);
      const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      if (String.fromCharCode(...bytes.subarray(0, 4)) !== 'LPF ') throw new Error('not ANM');
      const header = {
        nLps: dv.getUint16(6, true),
        width: dv.getUint16(20, true), height: dv.getUint16(22, true),
        nFrames: dv.getUint32(64, true), framesPerSecond: dv.getUint16(68, true) || 10,
      };
      const pal = new Uint8Array(768);
      for (let i = 0; i < 256; i++) {
        const s = 256 + i * 4;
        pal[i * 3] = bytes[s]; pal[i * 3 + 1] = bytes[s + 1]; pal[i * 3 + 2] = bytes[s + 2];
      }
      const lps = [];
      const lpOff = 256 + 1024;
      for (let i = 0; i < header.nLps; i++) {
        const o = lpOff + i * 6;
        lps.push({ baseRecord: dv.getUint16(o, true), nRecordsRaw: dv.getUint16(o + 2, true),
          nRecords: dv.getUint16(o + 2, true) & 0x3fff });
      }
      const anim = { header, palette: pal, lps, bytes, imageBuffer: new Uint8Array(0x10000) };
      this._cache.set(clean, anim);
      return anim;
    } catch { this._cache.set(clean, null); return null; }
  },
  // Draw frame `frameNumber` of `name` into a 2D context at (dx,dy) scaled to (dw,dh).
  async drawFrame(ctx, name, frameNumber, dx, dy, dw, dh) {
    const anim = await this.load(name);
    if (!anim) return false;
    const fr = anmDecodeFrame(anim, frameNumber);
    if (!fr) return false;
    // rasterize index -> RGBA via palette
    const img = ctx.createImageData(fr.width, fr.height);
    const pal = anim.palette;
    for (let i = 0; i < fr.width * fr.height; i++) {
      const idx = fr.pixels[i];
      img.data[i * 4] = pal[idx * 3] * 4;
      img.data[i * 4 + 1] = pal[idx * 3 + 1] * 4;
      img.data[i * 4 + 2] = pal[idx * 3 + 2] * 4;
      img.data[i * 4 + 3] = 255;
    }
    const tmp = document.createElement('canvas');
    tmp.width = fr.width; tmp.height = fr.height;
    tmp.getContext('2d').putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, dx, dy, dw || fr.width, dh || fr.height);
    return true;
  },
  async frameCount(name) {
    const a = await this.load(name);
    return a ? a.header.nFrames : 0;
  },
  async fps(name) {
    const a = await this.load(name);
    return a ? a.header.framesPerSecond : 10;
  },
};

export default Duke3D;
