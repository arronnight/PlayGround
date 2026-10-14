import * as THREE from 'three';
import { makeRng } from './utils.js';

function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function tex(c, repeat = true, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}
function noise(ctx, w, h, amount, rng) {
  const img = ctx.getImageData(0, 0, w, h); const d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (rng() - 0.5) * amount; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  ctx.putImageData(img, 0, 0);
}

// One facade tile = 3m x 3m world units (one window per tile, with a mullion pattern).
// Returns { map, emissiveMap } where emissiveMap holds only lit windows (for night).
export function makeFacade(style, seed) {
  const rng = makeRng(seed);
  const S = 256, cols = 4, rows = 4; // 4x4 windows per texture -> texture covers 12m x 12m
  const c = canvas(S, S), ctx = c.getContext('2d');
  const e = canvas(S, S), ectx = e.getContext('2d');
  ectx.fillStyle = '#000'; ectx.fillRect(0, 0, S, S);
  const cw = S / cols, ch = S / rows;
  const palettes = {
    glass:    { wall: ['#44556a', '#3c4d60', '#4d6076'], win: ['#7fa6c8', '#6d94b8', '#93b6d4'], frame: '#1a2430', wx: 0.06, wy: 0.06, ww: 0.88, wh: 0.88 },
    concrete: { wall: ['#8a8378', '#9a9388', '#7d776d'], win: ['#2b3440', '#22303d', '#334252'], frame: '#4a463f', wx: 0.22, wy: 0.24, ww: 0.56, wh: 0.5 },
    brick:    { wall: ['#7a4a3a', '#8a5545', '#6e4234'], win: ['#1f2a33', '#2a3540', '#1b252e'], frame: '#d8d0c0', wx: 0.25, wy: 0.2, ww: 0.5, wh: 0.55 },
    tower:    { wall: ['#c9cdd3', '#bcc1c8', '#d3d7dc'], win: ['#354a5e', '#2e4356', '#41576c'], frame: '#2a2f36', wx: 0.12, wy: 0.14, ww: 0.76, wh: 0.66 },
    house:    { wall: ['#d9c6a5', '#c8b08b', '#e2d3b8'], win: ['#243241', '#2c3c4c', '#1e2b38'], frame: '#f2efe8', wx: 0.3, wy: 0.28, ww: 0.4, wh: 0.44 },
    industrial:{ wall: ['#6d7378', '#767c81', '#62686d'], win: ['#3a4650', '#31404a', '#42505a'], frame: '#40464b', wx: 0.15, wy: 0.4, ww: 0.7, wh: 0.25 },
    // Miami art-deco: pastel stucco, long ribbon windows with rounded corners
    deco:     { wall: ['#f2d8d8', '#d8ecf2', '#f6ecc8', '#e8d5e8'], win: ['#20303e', '#1c2c38', '#2a3c48'], frame: '#f8f8f2', wx: 0.08, wy: 0.3, ww: 0.84, wh: 0.4 },
    // New York brownstone: dark red-brown masonry, tall narrow windows, stone lintels
    brownstone:{ wall: ['#5a3226', '#4e2c22', '#63402e'], win: ['#1c2733', '#222f3c', '#182230'], frame: '#cfc4ae', wx: 0.3, wy: 0.12, ww: 0.4, wh: 0.72 },
  };
  const p = palettes[style] || palettes.concrete;
  ctx.fillStyle = p.wall[0]; ctx.fillRect(0, 0, S, S);
  // subtle wall variation
  for (let i = 0; i < 400; i++) { ctx.fillStyle = rng.pick(p.wall); ctx.globalAlpha = 0.25; ctx.fillRect(rng() * S, rng() * S, rng() * 30, rng() * 8); }
  ctx.globalAlpha = 1;
  if (style === 'brick') { // brick courses
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
    for (let y = 0; y < S; y += 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke(); }
    for (let y = 0; y < S; y += 6) for (let x = (y / 6 % 2) * 8; x < S; x += 16) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 6); ctx.stroke(); }
  }
  if (style === 'glass' || style === 'tower') { // floor slabs
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    for (let r = 0; r < rows; r++) ctx.fillRect(0, r * ch, S, 3);
  }
  for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {
    const x = col * cw + p.wx * cw, y = r * ch + p.wy * ch, w = p.ww * cw, h = p.wh * ch;
    ctx.fillStyle = p.frame; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    const wc = rng.pick(p.win); g.addColorStop(0, wc); g.addColorStop(1, '#0d141b');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    // reflection streak
    ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fillRect(x + w * 0.1, y, w * 0.18, h);
    if (style !== 'glass') { ctx.fillStyle = p.frame; ctx.fillRect(x + w / 2 - 1, y, 2, h); ctx.fillRect(x, y + h / 2 - 1, w, 2); }
    // emissive: some windows lit at night with warm tint
    if (rng() < 0.45) {
      const warm = rng.pick(['#ffd9a0', '#ffe7c2', '#d8e6ff', '#fff2d6', '#ffcf80']);
      ectx.fillStyle = warm; ectx.globalAlpha = 0.35 + rng() * 0.45; ectx.fillRect(x, y, w, h); ectx.globalAlpha = 1;
      if (rng() < 0.4) { ectx.fillStyle = '#000'; ectx.globalAlpha = 0.6; ectx.fillRect(x + w / 2, y, w / 2, h); ectx.globalAlpha = 1; }
    }
  }
  noise(ctx, S, S, 18, rng);
  return { map: tex(c), emissiveMap: tex(e) };
}

// Helipad disc: dark asphalt circle, yellow ring, white H.
export function makeHelipadTexture() {
  const S = 256; const c = canvas(S, S), ctx = c.getContext('2d');
  ctx.fillStyle = '#33363b'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 1500; i++) { ctx.fillStyle = `rgba(${Math.random() < 0.5 ? 0 : 255},${Math.random() < 0.5 ? 0 : 255},${Math.random() < 0.5 ? 0 : 255},0.05)`; ctx.fillRect(Math.random() * S, Math.random() * S, 2, 2); }
  ctx.strokeStyle = '#d6b23a'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(S / 2, S / 2, S / 2 - 16, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#e8e8e2'; ctx.font = `bold ${S * 0.52}px Arial, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('H', S / 2, S / 2 + S * 0.03);
  return tex(c);
}

// Procedural billboard ads (canvas text, neon stripes) — original parody brands only.
const BILLBOARDS = [
  { bg: '#0d1b2a', fg: '#2df0ff', text: 'VICE', sub: 'NEON NIGHTS' },
  { bg: '#141414', fg: '#ffd24a', text: 'LIBERTY', sub: 'BIG APPLE AUTO' },
  { bg: '#3a1420', fg: '#ff7eb6', text: 'FABLE', sub: 'SUNSET STRIP' },
  { bg: '#0a2a1a', fg: '#7dff9a', text: 'BURGER SHOT', sub: 'GO LARGE' },
  { bg: '#1a1a2a', fg: '#ff6a2d', text: 'AMMU-NATION', sub: 'PROTECT YOURSELF' },
];
export function makeBillboardTexture(seed = 1) {
  const rng = makeRng(seed);
  const b = rng.pick(BILLBOARDS);
  const W = 512, H = 256; const c = canvas(W, H), ctx = c.getContext('2d');
  ctx.fillStyle = b.bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = b.fg; ctx.lineWidth = 6; ctx.strokeRect(10, 10, W - 20, H - 20);
  ctx.fillStyle = b.fg; ctx.textAlign = 'center';
  ctx.font = 'bold 84px Impact, Arial Narrow, sans-serif';
  ctx.shadowColor = b.fg; ctx.shadowBlur = 24; ctx.fillText(b.text, W / 2, H / 2 + 10);
  ctx.shadowBlur = 0; ctx.font = 'bold 34px Arial, sans-serif'; ctx.fillText(b.sub, W / 2, H - 44);
  noise(ctx, W, H, 12, rng);
  return tex(c);
}

export function makeRoof(seed) {
  const rng = makeRng(seed); const S = 128; const c = canvas(S, S), ctx = c.getContext('2d');
  ctx.fillStyle = '#4b4a48'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 300; i++) { ctx.fillStyle = `rgba(${rng() < 0.5 ? 0 : 255},${rng() < 0.5 ? 0 : 255},${rng() < 0.5 ? 0 : 255},0.05)`; ctx.fillRect(rng() * S, rng() * S, rng() * 12, rng() * 12); }
  noise(ctx, S, S, 24, rng);
  return tex(c);
}

// Asphalt tile: 1 texture = ASPHALT width x 14m length, 4 lanes, dashed white
// dividers, double yellow centre — plus aggregate, patches, cracks, tar seams and
// oil staining. Returns { map, roughnessMap }: paint is smoother than asphalt,
// oil stains are near-mirror smooth, so speculars break up like a real street.
export function makeRoadTexture(seed = 7) {
  const rng = makeRng(seed); const W = 512, H = 512;
  const c = canvas(W, H), ctx = c.getContext('2d');
  const rc = canvas(W, H), rctx = rc.getContext('2d');
  ctx.fillStyle = '#33363b'; ctx.fillRect(0, 0, W, H);
  rctx.fillStyle = '#f0f0f0'; rctx.fillRect(0, 0, W, H); // base asphalt: rough (0.94)
  const px = W / 14; // 1m in px; texture v runs along the 14m road length
  // patch repairs: darker rectangles with tar borders (rougher fill)
  for (let i = 0; i < 3; i++) {
    const x = rng() * W * 0.7, y = rng() * H * 0.8, w = 60 + rng() * 120, h = 40 + rng() * 90;
    ctx.fillStyle = 'rgba(34,36,40,0.9)'; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#17181a'; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
    rctx.fillStyle = '#e2e2e2'; rctx.fillRect(x, y, w, h);
  }
  // oil staining down each lane centre (smooth => catches specular highlights)
  for (const lx of [1.75, 5.25, 8.75, 12.25]) {
    for (let k = 0; k < 5; k++) {
      const y = rng() * H, r = 12 + rng() * 26;
      const g = ctx.createRadialGradient(lx * px, y, 0, lx * px, y, r);
      g.addColorStop(0, 'rgba(12,13,15,0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(lx * px - r, y - r, r * 2, r * 2);
      const g2 = rctx.createRadialGradient(lx * px, y, 0, lx * px, y, r);
      g2.addColorStop(0, 'rgba(70,70,70,0.85)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
      rctx.fillStyle = g2; rctx.fillRect(lx * px - r, y - r, r * 2, r * 2);
    }
  }
  // paint: centre double yellow, lane dashes, edge lines (smoother than asphalt)
  ctx.fillStyle = 'rgba(214,178,58,0.88)'; ctx.fillRect(W / 2 - px * 0.25, 0, px * 0.12, H); ctx.fillRect(W / 2 + px * 0.13, 0, px * 0.12, H);
  rctx.fillStyle = '#a8a8a8'; rctx.fillRect(W / 2 - px * 0.25, 0, px * 0.12, H); rctx.fillRect(W / 2 + px * 0.13, 0, px * 0.12, H);
  ctx.fillStyle = 'rgba(217,217,210,0.85)';
  for (const lx of [3.5, 10.5]) for (let y = 0; y < H; y += H / 2) ctx.fillRect(lx * px - px * 0.06, y + H * 0.1, px * 0.12, H * 0.28);
  for (const lx of [3.5, 10.5]) for (let y = 0; y < H; y += H / 2) rctx.fillRect(lx * px - px * 0.06, y + H * 0.1, px * 0.12, H * 0.28);
  rctx.fillStyle = 'rgba(168,168,168,1)';
  ctx.fillStyle = 'rgba(230,230,220,0.75)'; ctx.fillRect(px * 0.2, 0, px * 0.1, H); ctx.fillRect(W - px * 0.3, 0, px * 0.1, H);
  // aggregate: multi-scale speckle over everything (wears the paint too)
  for (let i = 0; i < 9000; i++) {
    const v = rng.chance(0.5);
    ctx.fillStyle = v ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.09)';
    ctx.fillRect(rng() * W, rng() * H, 1 + rng() * 2, 1 + rng() * 2);
  }
  for (let i = 0; i < 500; i++) { ctx.fillStyle = 'rgba(200,200,195,0.16)'; ctx.fillRect(rng() * W, rng() * H, 2, 2); }
  // cracks: dark random walks with the occasional branch
  ctx.strokeStyle = '#17181a'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    let x = rng() * W, y = rng() * H;
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 0; k < 26; k++) { x += (rng() - 0.5) * 26; y += rng() * 18; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  // tar seams across the road
  for (let i = 0; i < 2; i++) {
    const y0 = rng() * H; ctx.strokeStyle = 'rgba(20,20,22,0.8)'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 16) ctx.lineTo(x, y0 + Math.sin(x * 0.03 + i * 2) * 5);
    ctx.stroke();
  }
  // wheel-track wear polish (slightly smoother dark bands)
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  for (const lx of [1.1, 2.5, 4.6, 6.0, 8.0, 9.4, 11.5, 12.9]) ctx.fillRect(lx * px - px * 0.25, 0, px * 0.5, H);
  noise(ctx, W, H, 12, rng);
  return { map: tex(c), roughnessMap: tex(rc, true, false) };
}

export function makeIntersectionTexture(seed = 8) {
  const rng = makeRng(seed); const S = 256; const c = canvas(S, S), ctx = c.getContext('2d');
  const rc = canvas(S, S), rctx = rc.getContext('2d');
  ctx.fillStyle = '#2d2f33'; ctx.fillRect(0, 0, S, S);
  rctx.fillStyle = '#f0f0f0'; rctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = rng.chance(0.5) ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.09)';
    ctx.fillRect(rng() * S, rng() * S, 1 + rng() * 2, 1 + rng() * 2);
  }
  for (let k = 0; k < 4; k++) { // oil drips where cars idle
    const x = rng() * S, y = rng() * S, r = 10 + rng() * 22;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(12,13,15,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    const g2 = rctx.createRadialGradient(x, y, 0, x, y, r);
    g2.addColorStop(0, 'rgba(70,70,70,0.85)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
    rctx.fillStyle = g2; rctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  noise(ctx, S, S, 12, rng);
  return { map: tex(c), roughnessMap: tex(rc, true, false) };
}

export function makeCrosswalkTexture() {
  const S = 256; const c = canvas(S, S), ctx = c.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = 'rgba(235,235,225,0.85)';
  for (let x = 8; x < S; x += 32) ctx.fillRect(x, 0, 18, S);
  const t = tex(c, false); return t;
}

export function makeSidewalkTexture(seed = 9) {
  const rng = makeRng(seed); const S = 256; const c = canvas(S, S), ctx = c.getContext('2d');
  ctx.fillStyle = '#a8a49c'; ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(0,0,0,0.28)'; ctx.lineWidth = 3;
  for (let i = 0; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * S / 2, 0); ctx.lineTo(i * S / 2, S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * S / 2); ctx.lineTo(S, i * S / 2); ctx.stroke(); }
  for (let i = 0; i < 2000; i++) { ctx.fillStyle = `rgba(0,0,0,${rng() * 0.08})`; ctx.fillRect(rng() * S, rng() * S, 2, 2); }
  noise(ctx, S, S, 16, rng);
  return tex(c);
}

export function makeGrassTexture(seed = 10) {
  const rng = makeRng(seed); const S = 256; const c = canvas(S, S), ctx = c.getContext('2d');
  // dark soil bed showing between blades (like a real lawn close-up)
  ctx.fillStyle = '#2e4a1e'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 10; i++) {
    const x = rng() * S, y = rng() * S, r = 24 + rng() * 60;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rng.pick(['#3a5c24', '#476e2a', '#557f3222', '#6b8a2f22'])); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // dense long blades, crisscrossing, sunlit tips + dry flecks
  const blades = ['#4f8a2e', '#5f9a38', '#6fa544', '#7fb04e', '#8fbf58', '#3f7326', '#a8b04c'];
  ctx.lineWidth = 1;
  for (let i = 0; i < 12000; i++) {
    const x = rng() * S, y = rng() * S, len = 4 + rng() * 9, ang = (rng() - 0.5) * 2.2 + (rng.chance(0.5) ? 0.5 : -0.5);
    ctx.strokeStyle = rng.chance(0.07) ? '#b0a852' : rng.pick(blades);
    ctx.globalAlpha = 0.55 + rng() * 0.45;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(ang) * len, y - Math.cos(ang) * len); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // clover clusters: triplets of small light-green discs
  for (let i = 0; i < 420; i++) {
    const x = rng() * S, y = rng() * S;
    ctx.fillStyle = rng.pick(['#5da244', '#6cb04e', '#54963c']);
    for (let k = 0; k < 3; k++) { const a = rng() * 6.28; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 2.2, y + Math.sin(a) * 2.2, 1.6 + rng(), 0, 6.29); ctx.fill(); }
  }
  noise(ctx, S, S, 10, rng);
  return tex(c);
}

// Packed dirt ground (Bone County / dam hills): warm tan soil, embedded pebbles
// with sun/shadow sides, dry twigs and straw flecks.
export function makeDirtTexture(seed = 22) {
  const rng = makeRng(seed); const S = 512; const c = canvas(S, S), ctx = c.getContext('2d');
  ctx.fillStyle = '#8a6f4b'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 14; i++) {
    const x = rng() * S, y = rng() * S, r = 40 + rng() * 110;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rng.pick(['#93765a44', '#7d624044', '#9a7d5544', '#6e563c44'])); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // fine soil grain
  for (let i = 0; i < 16000; i++) {
    ctx.fillStyle = rng.chance(0.5) ? 'rgba(60,45,28,0.25)' : 'rgba(210,185,140,0.22)';
    ctx.fillRect(rng() * S, rng() * S, 1 + rng() * 2, 1 + rng() * 2);
  }
  // pebbles: shadow crescent + lit stone + top glint
  for (let i = 0; i < 260; i++) {
    const x = rng() * S, y = rng() * S, r = 1.5 + rng() * rng() * 5;
    const stone = rng.pick(['#cfc4b2', '#bfb49e', '#8f8574', '#6e6558', '#3c352c', '#e2d9c8']);
    ctx.fillStyle = 'rgba(30,22,14,0.55)'; ctx.beginPath(); ctx.ellipse(x + r * 0.3, y + r * 0.45, r, r * 0.8, 0, 0, 6.29); ctx.fill();
    ctx.fillStyle = stone; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.85, rng() * 3, 0, 6.29); ctx.fill();
    ctx.fillStyle = 'rgba(255,250,235,0.5)'; ctx.beginPath(); ctx.ellipse(x - r * 0.25, y - r * 0.3, r * 0.4, r * 0.3, 0, 0, 6.29); ctx.fill();
  }
  // dry twigs + straw
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 46; i++) {
    const x = rng() * S, y = rng() * S, a = rng() * 6.28, len = 6 + rng() * 22;
    ctx.strokeStyle = rng.chance(0.3) ? '#c2a95e' : rng.pick(['#4a3826', '#5d4a30', '#3a2c1e']);
    ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  noise(ctx, S, S, 12, rng);
  return tex(c);
}

// Neutral high-frequency grain for the terrain heightfield: near-white mean so it
// adds micro-detail without shifting the vertex zone colours it multiplies.
export function makeGroundDetailTexture(seed = 21) {
  const rng = makeRng(seed); const S = 256; const c = canvas(S, S), ctx = c.getContext('2d');
  ctx.fillStyle = '#d4d4d4'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 10; i++) {
    const x = rng() * S, y = rng() * S, r = 20 + rng() * 60;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rng.chance(0.5) ? 'rgba(190,190,190,0.35)' : 'rgba(232,232,232,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 12000; i++) {
    const v = 150 + ((rng() * 90) | 0);
    ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(rng() * S, rng() * S, 1, 1);
  }
  noise(ctx, S, S, 8, rng);
  const t = tex(c); t.repeat.set(160, 160); return t;
}

export function makeSandTexture(seed = 11) {
  const rng = makeRng(seed); const S = 512; const c = canvas(S, S), ctx = c.getContext('2d');
  ctx.fillStyle = '#dfc083'; ctx.fillRect(0, 0, S, S);
  // broad soft dune shading
  for (let i = 0; i < 16; i++) {
    const x = rng() * S, y = rng() * S, r = 50 + rng() * 130;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rng.pick(['#d4af7233', '#ecd09633', '#c9a46833', '#f2ddab33'])); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // fine grain: light + dark + warm flecks
  for (let i = 0; i < 15000; i++) {
    ctx.fillStyle = rng.pick(['rgba(255,244,220,0.5)', 'rgba(190,150,100,0.45)', 'rgba(255,255,255,0.4)', 'rgba(160,125,80,0.4)']);
    ctx.fillRect(rng() * S, rng() * S, 1, 1 + rng() * 1.5);
  }
  // scattered shell bits
  for (let i = 0; i < 90; i++) {
    const x = rng() * S, y = rng() * S, r = 1 + rng() * 2.4;
    ctx.fillStyle = 'rgba(150,115,75,0.5)'; ctx.beginPath(); ctx.ellipse(x + 0.8, y + 1, r, r * 0.7, 0, 0, 6.29); ctx.fill();
    ctx.fillStyle = rng.pick(['#f4e8d2', '#e8d6b4', '#fff6e4']); ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.7, rng() * 3, 0, 6.29); ctx.fill();
  }
  noise(ctx, S, S, 8, rng);
  return tex(c);
}

// Tileable ripple normal map (integer-frequency sine stack => seamless): sampled
// twice at different scales/scrolls in the water shader for sparkling detail.
export function makeWaterNormalTexture(seed = 31) {
  const S = 256; const c = canvas(S, S), ctx = c.getContext('2d');
  const rng = makeRng(seed);
  const waves = [];
  for (let i = 0; i < 7; i++) waves.push({ fx: 1 + ((rng() * 5) | 0), fy: 1 + ((rng() * 5) | 0), amp: 0.5 + rng() * 0.8, ph: rng() * 6.28 });
  const img = ctx.createImageData(S, S); const d = img.data;
  const TAU = Math.PI * 2;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    let dx = 0, dy = 0;
    for (const w of waves) {
      const a = TAU * (w.fx * x + w.fy * y) / S + w.ph;
      const s = Math.cos(a) * w.amp;
      dx += s * w.fx; dy += s * w.fy;
    }
    const inv = 1 / Math.hypot(dx * 0.35, dy * 0.35, 1);
    const o = (y * S + x) * 4;
    d[o] = (-dx * 0.35 * inv * 0.5 + 0.5) * 255; d[o + 1] = (-dy * 0.35 * inv * 0.5 + 0.5) * 255; d[o + 2] = inv * 255; d[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = tex(c, true, false);
  t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
  return t;
}

// Tileable caustic web (bright veins like sun through shallow water): two
// scrolled samples multiplied in-shader make it crawl and shimmer.
export function makeCausticTexture(seed = 33) {
  const S = 256; const c = canvas(S, S), ctx = c.getContext('2d');
  const rng = makeRng(seed);
  const p = [rng() * 6.28, rng() * 6.28, rng() * 6.28];
  const img = ctx.createImageData(S, S); const d = img.data;
  const TAU = Math.PI * 2;
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const s1 = Math.sin(TAU * (3 * x + 2 * y) / S + p[0]);
    const s2 = Math.sin(TAU * (-2 * x + 4 * y) / S + p[1]);
    const s3 = Math.sin(TAU * (5 * x - 3 * y) / S + p[2]);
    const web = Math.pow(Math.abs(s1 * s2 * 0.6 + s2 * s3 * 0.4), 0.35); // dark veins on bright
    const v = Math.max(0, Math.min(1, web)) * 255;
    const o = (y * S + x) * 4;
    d[o] = v; d[o + 1] = v; d[o + 2] = v; d[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = tex(c, true, false);
  t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
  return t;
}

export function makeParticleTexture() {
  const S = 64; const c = canvas(S, S), ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  return tex(c, false, false);
}

export function makeSmokeTexture() {
  const S = 64; const c = canvas(S, S), ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.5, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  return tex(c, false, false);
}
