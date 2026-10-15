import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CITY } from './config.js';
import { makeRng } from './utils.js';
import { SpatialHash } from './physics.js';
import * as TX from './textures.js';

// San-Andreas-beats state on one uniform 80m arterial grid (kept uniform so the
// traffic AI, lane math and missions all keep working):
//   Santos   (SE, 9x9) dense city, downtown towers, beach, airport, docks, arena
//   Ferro    (W,  7x7) hilly city, downtown, docks
//   Venturas (NE, 7x6) desert city, neon strip, airport
//   Bone County desert + Carson town, Red/Flint farmland, Shady Creeks forest,
//   Mount Chiliad, Ferro bay, a river, and 5 bridges.
const { PITCH, ASPHALT, LANE, CURB, BLOCKS: N, HALF } = CITY;
const HALF_ASPHALT = ASPHALT / 2;        // 7
const SIDEWALK_OUT = CITY.ROAD / 2;      // 10
export const STOP_DIST = 10.5;           // stop line distance from intersection centre
export const LANE_OFF = (l) => LANE / 2 + LANE * l; // 1.75, 5.25

const FABLE = {
  regions: [
    { id: 'santos',   label: 'Santos',   x0: 15, z0: 15, nx: 9, nz: 9 },
    { id: 'ferro',    label: 'Ferro',    x0: 1,  z0: 8,  nx: 7, nz: 7 },
    { id: 'venturas', label: 'Venturas', x0: 16, z0: 1,  nx: 7, nz: 6 },
    { id: 'carson',   label: 'Bone County', x0: 10, z0: 3, nx: 2, nz: 2 },
  ],
  bridges: [
    { axis: 'x', c: -240, from: -500, to: -220, red: false }, // bay bridge (Ferro <-> mainland)
    { axis: 'x', c: 320,  from: -500, to: -90, red: true },  // red bridge over the south bay
    { axis: 'z', c: 160,  from: -100,  to: 170,   red: false }, // river highway (lands on Santos edge)
    { axis: 'z', c: -80,  from: -100,  to: 170,   red: false }, // river rural (lands on Santos edge)
    { axis: 'z', c: 240,  from: -100,  to: 170,   red: false }, // river east (lands on Santos edge)
  ],
  tunnels: [
    { axis: 'x', c: 640, from: -955, to: -310 },  // east-west bore (west portal on the shore)
    { axis: 'z', c: -800, from: 310, to: 890 },   // north-south bore
  ],
  highV: [
    { k: 15, m0: 9, m1: 24 },   // x=160 farmland -> river -> Santos west edge
    { k: 16, m0: 2, m1: 14 },   // x=240 desert -> farmland
    { k: 12, m0: 9, m1: 14 },   // x=-80 farmland local
    { k: 11, m0: 2, m1: 16 },   // x=-160 desert -> Carson -> farmland backbone
    { k: 3, m0: 13, m1: 17 },   // x=-800 Ferro south -> tunnel north portal
    { k: 8, m0: 13, m1: 21 },   // x=-400 Flint west link to tunnel east portal
  ],
  highH: [
    { j: 10, m0: 7, m1: 12 },   // z=-240 bay bridge approaches, feeding the x=-80 highway
    { j: 17, m0: 2, m1: 15 },   // z=320 red bridge approaches (mountain cells auto-skip)
    { j: 18, m0: 2, m1: 15 },   // z=400 flint/forest scenic highway
    { j: 4,  m0: 1, m1: 10 },   // z=-720 tierra road
    { j: 21, m0: 9, m1: 15 },   // z=640 tunnel east portal -> Flint
  ],
  parks: [[16, 17], [21, 19], [3, 12], [17, 4]],
  lots: [[17, 20], [20, 22], [5, 9], [20, 4]],
  water: {
    oceanX: 1000, oceanZ: 1060,
    ellipses: [[-320, -160, 70, 300], [-300, 380, 180, 180], [1000, 350, 110, 200]],
    rivers: [{ min: -63, max: -17, x0: -300, x1: 1150 }],
    channels: [],
  },
  cone: { x: -760, z: 640, r: 270, h: 135 },
  bumps: [
    { x0: -980, x1: -380, z0: -420, z1: 180, amp: 1.8 },
    { x0: -340, x1: 260, z0: -980, z1: -380, amp: 1.1 },
  ],
  // rolling countryside relief: gaussian hills + low-frequency rolling valleys.
  // Cities, farmland, the desert floor and structures are graded flat (see carves);
  // everything else gets real elevation. Roads/tunnels/bridges carve through.
  hills: [
    { cx: 520, cz: 40, rx: 360, rz: 110, amp: 9 },   // Sunset Hills (N Santos)
    { cx: -100, cz: 420, rx: 240, rz: 130, amp: 7 }, // Flint County hills
    { cx: -480, cz: 480, rx: 170, rz: 130, amp: 6 }, // Shady Creeks forest fringe (clear of the cone)
    { cx: -500, cz: -720, rx: 190, rz: 100, amp: 5 }, // Tierra Robada bumps
    { cx: -700, cz: -100, rx: 200, rz: 160, amp: 8 }, // Ferro in-city hills (San Fierro beats: terraced blocks)
    { cx: -500, cz: 50, rx: 150, rz: 120, amp: 6 },  // Ferro east heights
    { cx: -80, cz: 10, rx: 260, rz: 260, amp: 2.5 }, // Red County rolling green
    { cx: -430, cz: 720, rx: 100, rz: 80, amp: 4 },  // Chiliad foothills arc
    { cx: -640, cz: 360, rx: 110, rz: 90, amp: 5 },  // Shady ridge
    { cx: -550, cz: -800, rx: 95, rz: 80, amp: 13, mesa: true },  // Tierra butte
    { cx: -400, cz: -600, rx: 70, rz: 60, amp: 9, mesa: true },   // Tierra lesser butte
    { cx: 0, cz: -700, rx: 110, rz: 95, amp: 14, mesa: true },    // Bone County mesa
    { cx: -180, cz: -880, rx: 80, rz: 70, amp: 10, mesa: true },  // Bone County butte
  ],
  rolling: { amp: 0.9, fx: 0.021, fz: 0.017 },
  regionCarveSkip: ['ferro'], // hilly city: blocks terrace instead of grading flat
  carves: [
    { x0: -340, x1: 260, z0: -980, z1: -380, f: 30 }, // Bone County desert floor (shacks/homesteads at 0)
  ],
  labels: [['Downtown', 500, 500], ['Eastside', 770, 500], ['Santa Maria Beach', 500, 930], ['Los Santos Airport', 280, 770], ['Ocean Docks', 845, 440], ['Financial', -680, -250], ['Easter Basin', -445, 0], ['The Strip', 430, -720], ['Venturas Airport', 705, -885], ['Bone County', -40, -690], ['Tierra Robada', -500, -720], ['Sunset Hills', 520, 40], ['Red County', -150, 60], ['Mount Chiliad', -760, 640], ['Shady Creeks', -680, 480]],
};
// Liberty City: original three-island harbor homage (not a copy of any asset).
const LIBERTY = {
  regions: [
    { id: 'shoreside',  label: 'Shoreside',  x0: 2,  z0: 10, nx: 6, nz: 10 },
    { id: 'kingsland',  label: 'Kingsland',  x0: 10, z0: 9,  nx: 6, nz: 11 },
    { id: 'harborton',  label: 'Harborton',  x0: 18, z0: 10, nx: 6, nz: 10 },
  ],
  bridges: [
    { axis: 'x', c: 80,  from: -400, to: -240, red: false }, // west-center span
    { axis: 'x', c: 160, from: 240,  to: 400,  red: false, susp: true }, // suspension span to Harborton
    { axis: 'z', c: -80, from: -810, to: -630, red: false }, // dam lake crossing
  ],
  tunnels: [],
  highV: [
    { k: 5, m0: 10, m1: 19 },   // x=-640 Shoreside spine
    { k: 12, m0: 9, m1: 19 },   // x=-80 Kingsland spine
    { k: 20, m0: 10, m1: 19 },  // x=560 Harborton spine
  ],
  highH: [
    { j: 14, m0: 2, m1: 23 },   // z=80 west-center bridge approaches
    { j: 15, m0: 10, m1: 23 },  // z=160 suspension bridge approaches
    { j: 4,  m0: 2, m1: 16 },   // z=-720 dam road
  ],
  parks: [[10, 17], [4, 12], [19, 12]],
  lots: [[15, 18], [6, 17], [18, 18]],
  water: {
    oceanX: 1000, oceanZ: 1060,
    ellipses: [[950, 320, 130, 200], [-80, -720, 150, 90]],
    rivers: [],
    channels: [{ min: -400, max: -240, zMin: -320 }, { min: 240, max: 400, zMin: -320 }],
  },
  cone: null,
  bumps: [{ x0: -560, x1: 320, z0: -980, z1: -420, amp: 3.0 }],
  hills: [
    { cx: -120, cz: -700, rx: 280, rz: 170, amp: 9 }, // Dam Hills proper
    { cx: -650, cz: -100, rx: 220, rz: 180, amp: 8 }, // Shoreside in-city ridge (Cedar Grove beats)
    { cx: -500, cz: 250, rx: 180, rz: 150, amp: 6 },  // Shoreside south heights
  ],
  rolling: { amp: 0.5, fx: 0.019, fz: 0.023 },
  regionCarveSkip: ['shoreside'], // hilly borough: blocks terrace, airport/docks stay flat pads
  carves: [
    { x0: -260, x1: 110, z0: -700, z1: -560, f: 20 }, // dam wall + powerhouse pad
  ],
  labels: [['Downtown', -40, 200], ['Kings Park', -520, 360], ['Arena', 120, -160], ['Francis Airport', -720, 280], ['Garden Suburbs', -640, -40], ['The Docks', 700, 200], ['Projects', 480, -160], ['Old Town', 560, 200], ['Sandy Beach', 760, 440], ['Dam Hills', -80, -700]],
};
// Vice City: original two-island neon-coast homage (not a copy of any asset).
// West mainland (airport, downtown, docks) + east barrier beach island,
// with Starfish- and Prawn-style islands mid-channel and four causeways.
const VICE = {
  regions: [
    { id: 'mainland', label: 'Mainland', x0: 3,  z0: 5, nx: 7, nz: 13 },
    { id: 'starfish', label: 'Starfish', x0: 12, z0: 13, nx: 2, nz: 2 },
    { id: 'prawn',    label: 'Prawn',    x0: 12, z0: 9,  nx: 3, nz: 2 },
    { id: 'beach',    label: 'Beach',    x0: 17, z0: 5,  nx: 5, nz: 13 },
  ],
  bridges: [
    { axis: 'x', c: -320, from: -260, to: 340, red: false },
    { axis: 'x', c: -80,  from: -260, to: 340, red: false },
    { axis: 'x', c: 80,   from: -260, to: 340, red: false },
    { axis: 'x', c: 240,  from: -260, to: 340, red: false, susp: true },
  ],
  tunnels: [],
  highV: [
    { k: 6, m0: 5, m1: 18 },    // x=-560 mainland spine
    { k: 19, m0: 5, m1: 18 },   // x=480 beach spine
    { k: 12, m0: 9, m1: 14 },   // x=-80 island link
    { k: 14, m0: 9, m1: 14 },   // x=80 island link
  ],
  highH: [
    { j: 9,  m0: 3, m1: 21 },   // z=-320 north causeway approaches
    { j: 12, m0: 3, m1: 21 },   // z=-80 causeway approaches
    { j: 14, m0: 3, m1: 21 },   // z=80 causeway approaches
    { j: 16, m0: 3, m1: 21 },   // z=240 south causeway approaches
  ],
  parks: [[6, 8], [18, 8], [12, 13]],
  lots: [[5, 15], [19, 15], [7, 7]],
  water: {
    oceanX: 1000, oceanZ: 1060,
    ellipses: [],
    rivers: [],
    channels: [{ min: -240, max: 320, zMin: -640 }],
    islands: [
      { x0: -100, x1: 100, z0: -10, z1: 170 },   // starfish island land
      { x0: -100, x1: 180, z0: -330, z1: -150 }, // prawn island land
    ],
  },
  cone: null,
  bumps: [],
  hills: [
    { cx: 600, cz: -100, rx: 60, rz: 300, amp: 1.2 }, // beach-island dune ridge (barrier islands stay near-flat, like the real thing)
  ],
  rolling: { amp: 0.25, fx: 0.03, fz: 0.025 }, // gentle barrier-island undulation only
  regionCarveSkip: ['beach'], // dunes roll through; beach blocks themselves stay flat pads
  carves: [
    { x0: 590, x1: 610, z0: 370, z1: 390, f: 15 }, // lighthouse pad
    { x0: 295, x1: 385, z0: 325, z1: 340, f: 15 }, // marina boardwalk pad
  ],
  labels: [['Downtown', -480, -80], ['Vice Airport', -640, 240], ['The Docks', -480, 320], ['Ocean Beach', 480, 200], ['Ocean Drive', 400, 40], ['Star Island', 0, 80], ['Prawn Island', 40, -240], ['North Beach', 480, -480], ['South Beach', 480, 320], ['Suburbs', -560, -480]],
};
const MAP_SPECS = { fable: FABLE, liberty: LIBERTY, vice: VICE };
// Active spec (only one City lives at a time; set by the constructor).
let SPEC = FABLE;
let MAPID = 'fable';
let ROADMASK = null; // drawn-road mask (set by buildLayout); terrain flattens only near real roads
let FLATPADS = []; // operational block pads (airports/docks/etc) carved flat even in hilly cities
export function setRoadMask(v, h) { ROADMASK = v ? { v, h } : null; }
export function setFlatPads(r) { FLATPADS = r || []; }
export function mapSpans() { return { bridges: BRIDGES, tunnels: TUNNELS }; }
// Block types that must stay dead flat (runways, working waterfronts, arenas,
// beaches, lots) even when their city has hills; everything else terraces.
const FLAT_TYPES = new Set(['airport', 'docks', 'stadium', 'beach', 'lot']);
let REGIONS = SPEC.regions;
let BRIDGES = SPEC.bridges;
let TUNNELS = SPEC.tunnels;
let HIGH_V = SPEC.highV;
let HIGH_H = SPEC.highH;
let PARK_BLOCKS = SPEC.parks;
let LOT_BLOCKS = SPEC.lots;
export function setMapSpec(id) {
  MAPID = id; SPEC = MAP_SPECS[id] || FABLE;
  REGIONS = SPEC.regions; BRIDGES = SPEC.bridges; TUNNELS = SPEC.tunnels;
  HIGH_V = SPEC.highV; HIGH_H = SPEC.highH; PARK_BLOCKS = SPEC.parks; LOT_BLOCKS = SPEC.lots;
  ROADMASK = null; FLATPADS = []; // rebuilt by City construction; never leak across maps
}
const TUN_HALF = 13, TUN_TOP = 6.5;
const DECK_Y = 3;

// Pure road-mask builder (no THREE/document): shared by City.buildLayout and by
// headless audits, so tests exercise the exact same mask the game drives on.
function regionAtCell(i, j) { return REGIONS.find(r => i >= r.x0 && i < r.x0 + r.nx && j >= r.z0 && j < r.z0 + r.nz) || null; }
export function computeRoadMask() {
  const roadV = [], roadH = [];
  for (let k = 0; k <= N; k++) { roadV.push(new Array(N).fill(false)); roadH.push(new Array(N).fill(false)); }
  const cellHasBlock = (i, j) => regionAtCell(i, j) && !waterAt(-HALF + (i + 0.5) * PITCH, -HALF + (j + 0.5) * PITCH);
  const segWet = (x, z) => waterAt(x, z) || mountainH(x, z) > 4;
  for (let k = 0; k <= N; k++) for (let m = 0; m < N; m++) {
    const mx = -HALF + k * PITCH, mz = -HALF + (m + 0.5) * PITCH;
    if (!segWet(mx, mz) && (cellHasBlock(k - 1, m) || cellHasBlock(k, m) || k % 3 === 0)) roadV[k][m] = true;
    const hx = -HALF + (m + 0.5) * PITCH, hz = -HALF + k * PITCH;
    if (!segWet(hx, hz) && (cellHasBlock(m, k - 1) || cellHasBlock(m, k) || k % 3 === 0)) roadH[k][m] = true;
  }
  for (const h of HIGH_V) for (let m = h.m0; m <= h.m1 && m < N; m++) {
    const mx = -HALF + h.k * PITCH, mz = -HALF + (m + 0.5) * PITCH;
    if (!segWet(mx, mz)) roadV[h.k][m] = true;
  }
  for (const h of HIGH_H) for (let m = h.m0; m <= h.m1 && m < N; m++) {
    const hx = -HALF + (m + 0.5) * PITCH, hz = -HALF + h.j * PITCH;
    if (!segWet(hx, hz)) roadH[h.j][m] = true;
  }
  // bridges AND tunnel bores are roads: force every grid segment under a deck /
  // inside a bore into the mask so traffic, missions and cops can route across.
  const forceSpans = (list) => {
    for (const b of list) {
      if (b.axis === 'x') {
        const j = Math.round((b.c + HALF) / PITCH);
        if (j >= 0 && j <= N) for (let m = 0; m < N; m++) { const mid = -HALF + (m + 0.5) * PITCH; if (mid >= b.from - 1 && mid <= b.to + 1) roadH[j][m] = true; }
      } else {
        const k = Math.round((b.c + HALF) / PITCH);
        if (k >= 0 && k <= N) for (let m = 0; m < N; m++) { const mid = -HALF + (m + 0.5) * PITCH; if (mid >= b.from - 1 && mid <= b.to + 1) roadV[k][m] = true; }
      }
    }
  };
  forceSpans(BRIDGES); forceSpans(TUNNELS);
  return { roadV, roadH };
}

const ellipse = (x, z, cx, cz, rx, rz) => ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 < 1;
export function waterAt(x, z) {
  const w = SPEC.water;
  if (w.islands) for (const isl of w.islands) if (x >= isl.x0 && x <= isl.x1 && z >= isl.z0 && z <= isl.z1) return false;
  if ((Math.abs(x) / w.oceanX) ** 4 + (Math.abs(z) / w.oceanZ) ** 4 > 1) return true; // ocean
  for (const [cx, cz, rx, rz] of w.ellipses) if (ellipse(x, z, cx, cz, rx, rz)) return true;
  for (const r of w.rivers) if (z > r.min && z < r.max && x > r.x0 && x < r.x1) return true;
  for (const c of w.channels) if (x > c.min && x < c.max && z > c.zMin) return true;
  return false;
}
export function mountainH(x, z) {
  // carve road-tunnel corridors clean through the cone
  for (const t of TUNNELS) {
    if (t.axis === 'x') { if (Math.abs(z - t.c) <= 22 && x >= t.from - 10 && x <= t.to + 10) return 0; }
    else if (Math.abs(x - t.c) <= 22 && z >= t.from - 10 && z <= t.to + 10) return 0;
  }
  const cone = SPEC.cone;
  if (!cone) return 0;
  const dc = Math.hypot(x - cone.x, z - cone.z);
  if (dc >= cone.r) return 0;
  return cone.h * Math.pow(Math.cos(dc / cone.r * Math.PI / 2), 1.4);
}
export function terrainH(x, z) {
  const mh = mountainH(x, z);
  if (mh > 6) return mh; // keep the cone smooth (no roads up it)
  const h = mh + smoothLand(x, z);
  if (h === 0) return 0;
  // streets stay flat — but ONLY where a road is actually drawn, so hills roll
  // unbroken between the arterials instead of getting diced every 80 m
  let dRoad;
  if (!ROADMASK) {
    const rx = (((x + HALF) % PITCH) + PITCH) % PITCH, rz = (((z + HALF) % PITCH) + PITCH) % PITCH;
    dRoad = Math.min(Math.min(rx, PITCH - rx), Math.min(rz, PITCH - rz));
  } else {
    dRoad = 30;
    const kv = Math.round((x + HALF) / PITCH);
    if (kv >= 0 && kv <= N) {
      const m = Math.max(0, Math.min(N - 1, Math.floor((z + HALF) / PITCH)));
      if (ROADMASK.v[kv][m]) dRoad = Math.min(dRoad, Math.abs(x - (-HALF + kv * PITCH)));
    }
    const kh = Math.round((z + HALF) / PITCH);
    if (kh >= 0 && kh <= N) {
      const m = Math.max(0, Math.min(N - 1, Math.floor((x + HALF) / PITCH)));
      if (ROADMASK.h[kh][m]) dRoad = Math.min(dRoad, Math.abs(z - (-HALF + kh * PITCH)));
    }
  }
  const f = Math.min(1, Math.max(0, (dRoad - 9) / 12));
  return h * f * f * (3 - 2 * f);
}

// Rolling countryside relief shared by physics (groundHeight), the terrain mesh,
// props and the minimap. Roads flatten via terrainH's margin above; everything
// else below only *reduces* height (carves), so hills/valleys survive elsewhere.
function sstep(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function gauss2(x, z, cx, cz, rx, rz) {
  const dx = (x - cx) / rx, dz = (z - cz) / rz, d = dx * dx + dz * dz;
  return d >= 4 ? 0 : Math.exp(-d * 1.6);
}
// 1 deep inside rect r, feathering to 0 over f metres outside its edge
function rectIn(x, z, r, f) {
  const dx = Math.min(x - (r.x0 - f), (r.x1 + f) - x), dz = Math.min(z - (r.z0 - f), (r.z1 + f) - z);
  if (dx <= 0 || dz <= 0) return 0;
  const ex = Math.min(dx, f) / f, ez = Math.min(dz, f) / f;
  return Math.min(ex * ex * (3 - 2 * ex), ez * ez * (3 - 2 * ez));
}
function distSeg(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz;
  let t = L2 ? ((px - ax) * dx + (pz - az) * dz) / L2 : 0;
  t = Math.min(1, Math.max(0, t));
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}
function smoothLand(x, z) {
  let h = 0, mesa = 0;
  for (const g of SPEC.hills) {
    if (g.mesa) {
      // flat-topped butte: plateau then talus falloff; punches through graded
      // flats (roads still cut a corridor in terrainH, structures keep clear)
      const d = Math.hypot((x - g.cx) / g.rx, (z - g.cz) / g.rz);
      if (d < 1) mesa += g.amp * (1 - sstep(0.45, 1.0, d));
    } else h += g.amp * gauss2(x, z, g.cx, g.cz, g.rx, g.rz);
  }
  const rl = SPEC.rolling;
  if (rl) {
    h += rl.amp * Math.sin(x * rl.fx + 1.7) * Math.cos(z * rl.fz + 0.4)
       + rl.amp * 0.5 * Math.sin(x * rl.fx * 2.7 + 0.5) * Math.sin(z * rl.fz * 3.1 + 2.1);
  }
  for (const b of SPEC.bumps) {
    if (x > b.x0 && x < b.x1 && z > b.z0 && z < b.z1) h += b.amp * Math.sin(x * 0.011 + 1.3) * Math.cos(z * 0.013);
  }
  if (h === 0 && mesa === 0) return 0;
  // grade flat: cities (except hilly ones, which terrace), SPEC carves,
  // operational pads, tunnel bores and bridge landings — feathered so hills roll in.
  let flat = 0;
  const skip = SPEC.regionCarveSkip || [];
  for (const r of REGIONS) {
    if (skip.includes(r.id)) continue;
    const rr = { x0: -HALF + r.x0 * PITCH, x1: -HALF + (r.x0 + r.nx) * PITCH, z0: -HALF + r.z0 * PITCH, z1: -HALF + (r.z0 + r.nz) * PITCH };
    flat = Math.max(flat, rectIn(x, z, rr, 18));
  }
  for (const c of SPEC.carves) flat = Math.max(flat, rectIn(x, z, c, c.f ?? 25));
  for (const r of FLATPADS) flat = Math.max(flat, rectIn(x, z, r, 15));
  for (const t of TUNNELS) {
    const r = t.axis === 'x' ? { x0: t.from - 10, x1: t.to + 10, z0: t.c - 30, z1: t.c + 30 } : { x0: t.c - 30, x1: t.c + 30, z0: t.from - 10, z1: t.to + 10 };
    flat = Math.max(flat, rectIn(x, z, r, 20));
  }
  for (const b of BRIDGES) {
    const ax = b.axis === 'x' ? b.from : b.c, az = b.axis === 'x' ? b.c : b.from;
    const bx = b.axis === 'x' ? b.to : b.c, bz = b.axis === 'x' ? b.c : b.to;
    flat = Math.max(flat, 1 - sstep(24, 40, distSeg(x, z, ax, az, bx, bz)));
  }
  h *= (1 - flat);
  if (h === 0 && mesa === 0) return 0;
  // shoreline fade: no cliffs of grass sticking through the surf
  if (waterAt(x, z)) return 0;
  const o = 24;
  if (waterAt(x + o, z) || waterAt(x - o, z) || waterAt(x, z + o) || waterAt(x, z - o)) return h * 0.3 + mesa;
  const o2 = 48;
  if (waterAt(x + o2, z) || waterAt(x - o2, z) || waterAt(x, z + o2) || waterAt(x, z - o2)) return h * 0.7 + mesa;
  return h + mesa;
}

// ---------- small geometry builder producing merged static meshes ----------
class Builder {
  constructor() { this.pos = []; this.nrm = []; this.uv = []; this.col = []; this.idx = []; this.n = 0; }
  quad(a, b, c, d, nx, ny, nz, uvs, color) { // a,b,c,d CCW seen from outside
    for (const p of [a, b, c, d]) { this.pos.push(p[0], p[1], p[2]); this.nrm.push(nx, ny, nz); this.col.push(color.r, color.g, color.b); }
    for (const u of uvs) this.uv.push(u[0], u[1]);
    const n = this.n; this.idx.push(n, n + 1, n + 2, n, n + 2, n + 3); this.n += 4;
  }
  // Box with sides UV-mapped in world metres / scale (so windows keep their size).
  boxSides(x0, y0, z0, x1, y1, z1, color, s = 3) {
    const w = x1 - x0, h = y1 - y0, d = z1 - z0;
    const uvS = (len, ht) => [[0, 0], [len / s, 0], [len / s, ht / s], [0, ht / s]];
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], 0, 0, 1, uvS(w, h), color);  // +z
    this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], 0, 0, -1, uvS(w, h), color); // -z
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], 1, 0, 0, uvS(d, h), color);  // +x
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], -1, 0, 0, uvS(d, h), color); // -x
  }
  boxTop(x0, y, z0, x1, z1, color, s = 4) {
    const w = x1 - x0, d = z1 - z0;
    this.quad([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], 0, 1, 0, [[0, 0], [w / s, 0], [w / s, d / s], [0, d / s]], color);
  }
  box(x0, y0, z0, x1, y1, z1, color, s = 3) { this.boxSides(x0, y0, z0, x1, y1, z1, color, s); this.boxTop(x0, y1, z0, x1, z1, color, s); }
  build() {
    if (this.n === 0) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx); return g;
  }
}

export class City {
  constructor(scene, mapId = 'fable') {
    setMapSpec(mapId);
    this.mapId = mapId;
    this.scene = scene;
    this.rng = makeRng(20260901);
    this.hash = new SpatialHash(24);
    this.roadCoords = []; for (let k = 0; k <= N; k++) this.roadCoords.push(-HALF + k * PITCH);
    this.blocks = []; this.blockMap = new Map(); this.lamps = []; this.trees = []; this.parkedSpots = []; this.lightHeads = [];
    this.airports = [];
    this.group = new THREE.Group(); scene.add(this.group);
    this.buildLayout();
    this.buildMask();
    this.buildGround();
    this.buildRoads();
    this.buildBlocks();
    this.buildCountryside();
    this.buildProps();
    this.buildWater();
  }
  dispose() {
    this.scene.remove(this.group);
    this.group.traverse(o => {
      if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose();
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) { if (!m || m.userData.shared) continue; for (const k in m) { if (m[k]?.isTexture) m[k].dispose(); } m.dispose(); }
    });
  }

  // ---------------- layout ----------------
  regionAt(i, j) { return REGIONS.find(r => i >= r.x0 && i < r.x0 + r.nx && j >= r.z0 && j < r.z0 + r.nz) || null; }
  blockType(i, j) {
    if (PARK_BLOCKS.some(([a, b]) => a === i && b === j)) return 'park';
    if (LOT_BLOCKS.some(([a, b]) => a === i && b === j)) return 'lot';
    const r = this.regionAt(i, j); if (!r) return null;
    const li = i - r.x0, lj = j - r.z0;
    if (r.id === 'santos') {
      if (li <= 2 && lj >= 6) return 'airport';
      if (li >= 7 && lj >= 2 && lj <= 4) return 'docks';
      if (li === 5 && lj === 1) return 'stadium';
      if (li >= 3 && li <= 5 && lj >= 3 && lj <= 5) return 'downtown';
      if (lj === 8) return 'beach';
      if (li >= 7 || lj >= 7) return 'residential';
      return 'commercial';
    }
    if (r.id === 'ferro') {
      if (li >= 5 && lj >= 4) return 'docks';
      if (li >= 2 && li <= 4 && lj >= 1 && lj <= 3) return 'downtown';
      if (lj >= 5) return 'industrial';
      if (li <= 1 || lj === 0) return 'residential';
      return 'commercial';
    }
    if (r.id === 'venturas') {
      if (li >= 5 && lj <= 1) return 'airport';
      if (li === 3) return 'strip';
      if (li <= 1 || lj >= 4) return 'residential';
      return 'commercial';
    }
    if (r.id === 'shoreside') {
      if (li <= 1 && lj >= 6 && lj <= 7) return 'airport';
      if (li === 0 && lj >= 7) return 'beach';
      if (lj <= 3) return 'residential';
      if (lj <= 5) return 'commercial';
      return 'residential';
    }
    if (r.id === 'kingsland') {
      if (li >= 1 && li <= 3 && lj >= 4 && lj <= 7) return 'downtown';
      if (li === 4 && lj === 1) return 'stadium';
      if (li === 0 || li >= 4 || lj === 3 || lj === 8) return 'commercial';
      return 'residential';
    }
    if (r.id === 'harborton') {
      if (li >= 4 && lj >= 2 && lj <= 6) return 'docks';
      if (li === 5 && lj >= 7) return 'beach';
      if (li <= 2 && lj <= 1) return 'residential'; // projects (gang turf via hoodGang)
      if (lj === 9) return 'residential';
      if (li <= 3 && lj >= 2) return 'commercial';
      return 'residential';
    }
    if (r.id === 'mainland') {
      if (li <= 1 && lj >= 10) return 'airport';
      if (li >= 4 && lj >= 11) return 'docks';
      if (li >= 2 && li <= 4 && lj >= 4 && lj <= 6) return 'downtown';
      if (lj <= 1) return 'residential';
      if (li >= 5 || lj >= 11) return 'residential';
      return 'commercial';
    }
    if (r.id === 'beach') {
      if (li === 4) return 'beach';
      if (li === 3) return 'strip';
      if (lj <= 1 || lj >= 11) return 'residential';
      return 'commercial';
    }
    if (r.id === 'starfish' || r.id === 'prawn') return 'residential';
    return 'desert'; // carson
  }
  districtOf(i, j) {
    const r = this.regionAt(i, j);
    if (!r) {
      const x = -HALF + (i + 0.5) * PITCH, z = -HALF + (j + 0.5) * PITCH;
      if (MAPID === 'liberty') {
        if (x > -560 && x < 320 && z > -980 && z < -420) return 'Dam Hills';
        return 'Outskirts';
      }
      if (mountainH(x, z) > 8) return 'Mount Chiliad';
      if (x > -700 && x < -300 && z > -820 && z < -620) return 'Tierra Robada';
      if (x > 180 && x < 920 && z > -80 && z < 160) return 'Sunset Hills';
      if (x > -340 && x < 260 && z > -980 && z < -380) return 'Bone County';
      if (x > -340 && x < 180 && z > -340 && z < 180) return 'Red County';
      if (x > -900 && x < -460 && z > 300 && z < 660) return 'Shady Creeks';
      if (z > 140 && z < 660) return 'Flint County';
      return 'Outskirts';
    }
    const li = i - r.x0, lj = j - r.z0, t = this.blockType(i, j);
    if (r.id === 'santos') {
      if (t === 'downtown') return 'Downtown';
      if (t === 'airport') return 'Los Santos Airport';
      if (t === 'docks') return 'Ocean Docks';
      if (t === 'stadium') return 'Arena';
      if (t === 'beach') return 'Santa Maria Beach';
      if (li >= 7) return 'Eastside';
      return 'Midtown';
    }
    if (r.id === 'ferro') {
      if (t === 'downtown') return 'Financial';
      if (t === 'docks') return 'Easter Basin';
      if (t === 'industrial') return 'Ironworks';
      return 'Hillside';
    }
    if (r.id === 'venturas') {
      if (t === 'strip') return 'The Strip';
      if (t === 'airport') return 'Venturas Airport';
      return 'Suburbs';
    }
    if (r.id === 'shoreside') {
      if (t === 'airport') return 'Francis Airport';
      if (t === 'beach') return 'Sandy Beach';
      if (li <= 1 && lj <= 3) return 'Garden Suburbs';
      return 'Shoreside';
    }
    if (r.id === 'kingsland') {
      if (t === 'downtown') return 'Downtown';
      if (t === 'park') return 'Kings Park';
      if (t === 'stadium') return 'Arena';
      return 'Midtown';
    }
    if (r.id === 'harborton') {
      if (t === 'docks') return 'The Docks';
      if (t === 'beach') return 'Sandy Beach';
      if (li <= 2 && lj <= 1) return 'Projects';
      return 'Old Town';
    }
    if (r.id === 'mainland') {
      if (t === 'downtown') return 'Downtown';
      if (t === 'airport') return 'Vice Airport';
      if (t === 'docks') return 'The Docks';
      if (li <= 1 && lj <= 1) return 'Suburbs';
      return 'Midtown';
    }
    if (r.id === 'beach') {
      if (t === 'beach') return 'Ocean Beach';
      if (t === 'strip') return 'Ocean Drive';
      if (lj <= 1) return 'North Beach';
      if (lj >= 10) return 'South Beach';
      return 'Washington';
    }
    if (r.id === 'starfish') return 'Star Island';
    if (r.id === 'prawn') return 'Prawn Island';
    return 'Carson Town';
  }
  districtName(x, z) {
    if (waterAt(x, z)) return 'The Ocean';
    const i = Math.floor((x + HALF) / PITCH), j = Math.floor((z + HALF) / PITCH);
    if (i < 0 || j < 0 || i >= N || j >= N) return 'Outskirts';
    return this.districtOf(i, j);
  }
  buildLayout() {
    // road mask: roadV[k][m] vertical line k segment m; roadH[j][m] horizontal line j segment m
    const { roadV, roadH } = computeRoadMask();
    this.roadV = roadV; this.roadH = roadH;
    setRoadMask(this.roadV, this.roadH); // one City lives at a time; terrain reads this
    // blocks (skip water cells)
    for (const r of REGIONS) for (let a = 0; a < r.nx; a++) for (let c = 0; c < r.nz; c++) {
      const i = r.x0 + a, j = r.z0 + c;
      const cx = -HALF + (i + 0.5) * PITCH, cz = -HALF + (j + 0.5) * PITCH;
      if (waterAt(cx, cz)) continue;
      const type = this.blockType(i, j);
      const x0 = this.roadCoords[i] + SIDEWALK_OUT, x1 = this.roadCoords[i + 1] - SIDEWALK_OUT;
      const z0 = this.roadCoords[j] + SIDEWALK_OUT, z1 = this.roadCoords[j + 1] - SIDEWALK_OUT;
      const b = { i, j, x0, x1, z0, z1, type, cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, district: this.districtOf(i, j), region: r.id, hoodGang: (r.id === 'santos' && a >= 7) || (r.id === 'harborton' && (i - r.x0) <= 2 && (j - r.z0) <= 1), hBase: 0 };
      // hilly cities terrace: blocks step with the terrain (sidewalks skirt,
      // buildings/stores sit on BY). Operational pads always stay flat.
      if (!FLAT_TYPES.has(type)) b.hBase = Math.max(0, terrainH(cx, cz));
      this.blocks.push(b); this.blockMap.set(i + ',' + j, b);
    }
    // operational pads carve flat even inside terraced cities (runways etc.)
    setFlatPads(this.blocks.filter(b => FLAT_TYPES.has(b.type)).map(b => ({ x0: b.x0 - 3, x1: b.x1 + 3, z0: b.z0 - 3, z1: b.z1 + 3 })));
    // junctions with at least one drawn segment (traffic / missions / police route here)
    this.junctions = [];
    for (let ix = 0; ix <= N; ix++) for (let iz = 0; iz <= N; iz++) {
      const X = this.roadCoords[ix], Z = this.roadCoords[iz];
      if (waterAt(X, Z) && this.onBridge(X, Z) <= 0) continue; // never spawn in the water
      if (this.hasRoadSeg(ix, iz, 1, 0) || this.hasRoadSeg(ix, iz, -1, 0) || this.hasRoadSeg(ix, iz, 0, 1) || this.hasRoadSeg(ix, iz, 0, -1)) this.junctions.push({ ix, iz });
    }
  }
  hasRoadSeg(ix, iz, dx, dz) {
    if (dx !== 0) { const m = Math.min(ix, ix + dx); if (iz < 0 || iz > N || m < 0 || m >= N) return false; return this.roadH[iz][m]; }
    const m = Math.min(iz, iz + dz); if (ix < 0 || ix > N || m < 0 || m >= N) return false; return this.roadV[ix][m];
  }
  randomJunction() { return this.junctions[(Math.random() * this.junctions.length) | 0]; }
  // junction near a point (for spawning around the player): first pick inside
  // the band wins, otherwise the closest miss so callers always get something
  randomJunctionNear(x, z, minD, maxD) {
    let best = null, bestScore = Infinity;
    for (let k = 0; k < 40; k++) {
      const j = this.junctions[(Math.random() * this.junctions.length) | 0];
      const X = this.roadCoords[j.ix], Z = this.roadCoords[j.iz];
      const d = Math.hypot(X - x, Z - z);
      if (d >= minD && d <= maxD) return j;
      const miss = d < minD ? minD - d : d - maxD;
      if (miss < bestScore) { bestScore = miss; best = j; }
    }
    return best;
  }
  blockAt(x, z) {
    const i = Math.floor((x + HALF) / PITCH), j = Math.floor((z + HALF) / PITCH);
    const b = this.blockMap.get(i + ',' + j);
    if (b && x >= b.x0 - SIDEWALK_OUT && x <= b.x1 + SIDEWALK_OUT && z >= b.z0 - SIDEWALK_OUT && z <= b.z1 + SIDEWALK_OUT) return b;
    return null;
  }
  onBridge(x, z) { // returns deck height (with end ramps) or 0
    for (const b of BRIDGES) {
      if (b.axis === 'x') {
        if (Math.abs(z - b.c) > HALF_ASPHALT || x < b.from || x > b.to) continue;
        return DECK_Y * Math.min(1, Math.min(x - b.from, b.to - x) / 20);
      }
      if (Math.abs(x - b.c) > HALF_ASPHALT || z < b.from || z > b.to) continue;
      return DECK_Y * Math.min(1, Math.min(z - b.from, b.to - z) / 20);
    }
    return 0;
  }
  inTunnel(x, z) {
    for (const t of TUNNELS) {
      if (t.axis === 'x') { if (Math.abs(z - t.c) <= TUN_HALF && x >= t.from && x <= t.to) return true; }
      else if (Math.abs(x - t.c) <= TUN_HALF && z >= t.from && z <= t.to) return true;
    }
    return false;
  }
  groundHeight(x, z) {
    const ax = Math.abs(x), az = Math.abs(z); const m = Math.max(ax, az);
    if (m > 2500) return 0; // interiors zone
    const deck = this.onBridge(x, z); if (deck > 0) return deck;
    if (this.inTunnel(x, z)) return 0; // bored through the mountain at road level
    if (waterAt(x, z)) return -1.5;
    // asphalt first: the road corridor overlaps block margins, and the mesh sits
    // at 0 — sampling the block here would hover cars/peds a curb-height (15 cm)
    // above the street. terrainH is exactly 0 on drawn roads (mask flatten).
    if (this.onRoad(x, z)) return terrainH(x, z);
    const b = this.blockAt(x, z);
    if (b) return b.hBase + CURB;
    return terrainH(x, z);
  }
  isWater(x, z) { const m = Math.max(Math.abs(x), Math.abs(z)); return waterAt(x, z) && this.onBridge(x, z) <= 0 && m < 2500; }
  // Walkable/landable surface: street/terrain, or the rooftop you're already on
  // top of (within a 0.5 m step). Lets aircraft land on buildings and the
  // player walk on roofs, without snapping up to roofs from the street below.
  surfaceHeight(x, z, y) {
    const g = this.groundHeight(x, z);
    if (y === undefined || y < g + 0.5) return g;
    let roof = -Infinity;
    const boxes = this.hash.query(x, x, z, z, this._surfQ || (this._surfQ = []));
    for (const b of boxes) {
      if (b.disabled || (b.kind !== 'building' && b.kind !== 'prop')) continue;
      if (b.maxY === undefined || b.maxY >= 900 || b.maxY <= g) continue;
      if (x < b.minX || x > b.maxX || z < b.minZ || z > b.maxZ) continue;
      if (b.maxY <= y + 0.5 && b.maxY > roof) roof = b.maxY;
    }
    return roof === -Infinity ? g : Math.max(g, roof);
  }
  onRoad(x, z) { // true if on drawn asphalt
    if (this.onBridge(x, z) > 0) return true;
    const ax = Math.abs(x), az = Math.abs(z);
    if (ax > HALF + HALF_ASPHALT || az > HALF + HALF_ASPHALT) return false;
    const fx = (((x + HALF) % PITCH) + PITCH) % PITCH, fz = (((z + HALF) % PITCH) + PITCH) % PITCH;
    const k = Math.round((x + HALF) / PITCH), m = Math.round((z + HALF) / PITCH);
    if ((fx <= HALF_ASPHALT || fx >= PITCH - HALF_ASPHALT)) {
      const s = Math.max(0, Math.min(N - 1, Math.floor((z + HALF) / PITCH)));
      if (k >= 0 && k <= N && this.roadV[k][s]) return true;
    }
    if ((fz <= HALF_ASPHALT || fz >= PITCH - HALF_ASPHALT)) {
      const s = Math.max(0, Math.min(N - 1, Math.floor((x + HALF) / PITCH)));
      if (m >= 0 && m <= N && this.roadH[m][s]) return true;
    }
    return false;
  }

  // Traffic lights: per-intersection phase. Returns 'green' | 'yellow' | 'red' for an approach axis.
  lightState(ix, iz, axis, time) {
    const cycle = 16, offset = (((ix * 7 + iz * 3) % 4) + 4) % 4 * 4;
    const t = (time + offset) % cycle; // 0..8 NS(z-axis) green, 8..16 EW green
    const nsGreen = t < 8; const phaseT = nsGreen ? t : t - 8;
    const mine = axis === 'z' ? nsGreen : !nsGreen;
    if (!mine) return 'red';
    return phaseT > 6 ? 'yellow' : 'green';
  }

  // Lane centre for heading (dx,dz) & lane index at intersection (X,Z) offset by along (signed, along heading)
  lanePoint(ix, iz, dx, dz, lane, along) {
    const X = this.roadCoords[ix], Z = this.roadCoords[iz];
    const rx = -dz, rz = dx, off = LANE_OFF(lane);
    return { x: X + dx * along + rx * off, z: Z + dz * along + rz * off };
  }

  // land/water mask (shared by the water shader foam + the minimap)
  buildMask() {
    const n = 256, ext = 1250, field = new Float32Array(n * n);
    for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
      const x = (a / (n - 1)) * 2 * ext - ext, z = (b / (n - 1)) * 2 * ext - ext;
      field[b * n + a] = waterAt(x, z) ? 0 : 1;
    }
    // box blur -> soft shore gradient
    const blur = new Float32Array(field);
    for (let pass = 0; pass < 2; pass++) {
      const src = pass === 0 ? field : blur;
      for (let a = 1; a < n - 1; a++) for (let b = 1; b < n - 1; b++) {
        let s = 0; for (let da = -1; da <= 1; da++) for (let db = -1; db <= 1; db++) s += src[(b + db) * n + a + da];
        blur[b * n + a] = s / 9;
      }
    }
    this.maskField = blur; this.maskN = n; this.maskExt = ext;
  }

  // ---------------- meshes ----------------
  buildGround() {
    const g = this.group;
    // Rolling terrain skin: a displaced heightfield driven by the same smoothLand()
    // physics uses, so tyres/feet always meet the mesh. Graded-flat areas sit 6 cm
    // under the roads/slabs (no z-fighting); hills rise where smoothLand says so.
    {
      const SIZE = 2500, SEG = 256, STEP = SIZE / SEG, ROW = SEG + 1;
      const tg = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG); tg.rotateX(-Math.PI / 2);
      const tp = tg.attributes.position, HH = new Float32Array(tp.count);
      for (let k = 0; k < tp.count; k++) {
        const x = tp.getX(k), z = tp.getZ(k);
        let y, h = 0;
        if (waterAt(x, z)) { y = -1.2; h = -1; }
        else { h = terrainH(x, z); y = Math.max(-0.02, h) - 0.06; }
        tp.setY(k, y); HH[k] = h;
      }
      const colors = new Float32Array(tp.count * 3);
      const tmp = new THREE.Color(), rock = new THREE.Color(0x6b6259);
      const inRect = (x, z, x0, z0, x1, z1) => x >= x0 && x <= x1 && z >= z0 && z <= z1;
      const inRegions = (x, z) => {
        for (const r of REGIONS) {
          if (x >= -HALF + r.x0 * PITCH && x <= -HALF + (r.x0 + r.nx) * PITCH && z >= -HALF + r.z0 * PITCH && z <= -HALF + (r.z0 + r.nz) * PITCH) return r.id;
        }
        return null;
      };
      for (let k = 0; k < tp.count; k++) {
        const x = tp.getX(k), z = tp.getZ(k), h = HH[k];
        if (h < -0.5) tmp.setHex(0x26505a); // lake/ocean bed under the water
        else {
          const reg = inRegions(x, z);
          if (MAPID === 'fable') {
            if (inRect(x, z, -340, -980, 260, -380)) tmp.setHex(0xc9a86a);                        // Bone sand
            else if (inRect(x, z, -340, -340, 180, 180)) tmp.setHex(((Math.floor(x / 125) + Math.floor(z / 120)) & 1) ? 0x9aa04c : 0x5d8a3c); // fields
            else if (inRect(x, z, -920, 300, -440, 660)) tmp.setHex(0x3d6b32);                     // Shady dark green
            else if (inRect(x, z, 140, 880, 900, 985)) tmp.setHex(0xd9c68f);                       // Santos beach sand
            else if (reg === 'santos') tmp.setHex(0x777d72);
            else if (reg === 'ferro') tmp.setHex(0x7a7f74);
            else if (reg === 'venturas' || reg === 'carson') tmp.setHex(0x8a8578);
            else tmp.setHex(0x6f7f52);
          } else if (MAPID === 'liberty') {
            if (inRect(x, z, -560, -980, 320, -420)) tmp.setHex(0x77825a);                         // Dam Hills scrub
            else if (reg === 'shoreside') tmp.setHex(0x7a7f74);
            else if (reg === 'kingsland') tmp.setHex(0x777d72);
            else if (reg === 'harborton') tmp.setHex(0x757a72);
            else tmp.setHex(0x6f7f52);
          } else {
            if (x > 540) tmp.setHex(0xd9c68f);                                                    // ocean beach sand
            else if (reg) tmp.setHex(0x7a7f74);
            else tmp.setHex(0x6f8a52);
          }
          // slope + altitude rock: steep faces and high ground read as rock
          const ix = k % ROW, iy = (k / ROW) | 0;
          const xa = HH[iy * ROW + Math.max(0, ix - 1)], xb = HH[iy * ROW + Math.min(SEG, ix + 1)];
          const za = HH[Math.max(0, iy - 1) * ROW + ix], zb = HH[Math.min(SEG, iy + 1) * ROW + ix];
          const sl = (Math.abs(xb - xa) + Math.abs(zb - za)) / (2 * STEP);
          const rockF = Math.max(sstep(4.5, 9, h), sstep(0.45, 0.8, sl));
          if (rockF > 0) tmp.lerp(rock, Math.min(1, rockF));
        }
        const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.55, f = 1 + ((n - Math.floor(n)) - 0.5) * 0.09;
        colors[k * 3] = tmp.r * f; colors[k * 3 + 1] = tmp.g * f; colors[k * 3 + 2] = tmp.b * f;
      }
      tg.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      tg.computeVertexNormals();
      const terrain = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ map: TX.makeGroundDetailTexture(), vertexColors: true, roughness: 1 }));
      terrain.receiveShadow = true; g.add(terrain);
    }
    const dirtT = TX.makeDirtTexture(), sandT = TX.makeSandTexture(), grassT = TX.makeGrassTexture(13);
    const slab = (x0, z0, x1, z1, color, y = -0.03, map = null, tile = 8) => {
      let mat;
      if (map) {
        const t = map.clone(); t.repeat.set(Math.max(1, (x1 - x0) / tile), Math.max(1, (z1 - z0) / tile)); t.needsUpdate = true;
        mat = new THREE.MeshStandardMaterial({ map: t, color, roughness: 1 });
      } else {
        mat = new THREE.MeshStandardMaterial({ color, roughness: 1 });
      }
      const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat);
      m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); m.receiveShadow = true; g.add(m);
    };
    if (MAPID === 'fable') {
      slab(-340, -980, 260, -380, 0xffffff, -0.04, dirtT);          // Bone County dirt
      slab(-340, -340, 180, 180, 0xffffff, -0.04, dirtT);            // Red County tilled soil
      slab(-920, 300, -440, 660, 0x9fb890, -0.04, grassT);          // Shady Creeks forest floor
      slab(140, 140, 900, 900, 0x777d72, -0.045);                   // Santos concrete base
      slab(-980, -420, -380, 180, 0x7a7f74, -0.045);                // Ferro concrete base
      slab(220, -980, 740, -420, 0x8a8578, -0.045);                 // Venturas concrete base
      slab(140, 880, 900, 985, 0xffffff, -0.035, sandT);            // Santos beach sand
    }
    if (MAPID === 'liberty') {
      slab(-900, -180, -420, 500, 0x7a7f74, -0.045);       // Shoreside concrete base
      slab(-260, -340, 180, 500, 0x777d72, -0.045);        // Kingsland concrete base
      slab(380, -180, 820, 500, 0x757a72, -0.045);         // Harborton concrete base
      slab(-560, -980, 320, -420, 0xffffff, -0.04, dirtT); // Dam Hills dirt
    }
    if (MAPID === 'vice') {
      slab(-820, -660, -220, 420, 0x7a7f74, -0.045);      // mainland concrete base
      slab(220, -660, 640, 420, 0x7e8378, -0.045);        // beach island concrete base
      slab(-110, -20, 110, 180, 0x7a7f74, -0.045);        // starfish island base
      slab(-110, -340, 190, -140, 0x7a7f74, -0.045);      // prawn island base
      slab(560, -660, 660, 420, 0xffffff, -0.035, sandT); // ocean beach sand
    }
    // Seabed
    const bed = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.MeshStandardMaterial({ color: 0x26505a, roughness: 1 }));
    bed.rotation.x = -Math.PI / 2; bed.position.y = -3; g.add(bed);
    // Mount Chiliad: heightfield cone with the tunnel notches carved out
    // (mountainH already returns 0 inside the bores), rock facets + snow cap.
    if (SPEC.cone) {
      const MS = 760, SEG = 150;
      const mg = new THREE.PlaneGeometry(MS, MS, SEG, SEG); mg.rotateX(-Math.PI / 2);
      const pos = mg.attributes.position, colors = new Float32Array(pos.count * 3);
      const rock = new THREE.Color(0x6b6259), snowC = new THREE.Color(0xe8eef2), grassC = new THREE.Color(0x4d7a34);
      const tmp = new THREE.Color();
      const cone = SPEC.cone;
      for (let k = 0; k < pos.count; k++) {
        const wx = pos.getX(k) + cone.x, wz = pos.getZ(k) + cone.z;
        const h = mountainH(wx, wz);
        pos.setY(k, Math.max(-0.15, h - 0.1));
        // steep faces read as rock even at low altitude (stops green smear up the notch cliffs)
        const sl = Math.max(Math.abs(mountainH(wx + 4, wz) - mountainH(wx - 4, wz)), Math.abs(mountainH(wx, wz + 4) - mountainH(wx, wz - 4))) / 8;
        if (h > 85 && sl < 1.2) tmp.copy(snowC);
        else if (h > 4 || sl > 0.55) tmp.copy(rock).offsetHSL(0, 0, ((wx * 13 + wz * 7) % 10) / 500);
        else tmp.copy(grassC);
        colors[k * 3] = tmp.r; colors[k * 3 + 1] = tmp.g; colors[k * 3 + 2] = tmp.b;
      }
      mg.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      mg.computeVertexNormals();
      const mountain = new THREE.Mesh(mg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
      mountain.position.set(cone.x, 0, cone.z); mountain.castShadow = true; mountain.receiveShadow = true; g.add(mountain);
    }
    if (MAPID !== 'fable') return;
    // Chiliad colliders: 4 rock blocks around the two tunnel bores so the
    // mountain still blocks everything EXCEPT the travelable tubes.
    // E-W bore: z 624..656 / N-S bore: x -816..-784 (walls sit just outside).
    this.addCollider(-950, 450, -816, 624, 'mountain', 60);
    this.addCollider(-950, 656, -816, 830, 'mountain', 60);
    this.addCollider(-784, 450, -570, 624, 'mountain', 60);
    this.addCollider(-784, 656, -570, 830, 'mountain', 60);
    // tunnel side walls (keep cars/peds inside the bore, out of the rock).
    // N-S walls stop for the E-W crossing (z 620..660) and vice versa (x -820..-780).
    this.addCollider(-955, 640 + 14.5, -820, 640 + 16.5, 'building', 8); // E-W north wall west
    this.addCollider(-780, 640 + 14.5, -310, 640 + 16.5, 'building', 8);  // E-W north wall east
    this.addCollider(-955, 640 - 16.5, -820, 640 - 14.5, 'building', 8); // E-W south wall west
    this.addCollider(-780, 640 - 16.5, -310, 640 - 14.5, 'building', 8);  // E-W south wall east
    this.addCollider(-800 + 14.5, 310, -800 + 16.5, 620, 'building', 8);  // N-S east wall south
    this.addCollider(-800 + 14.5, 660, -800 + 16.5, 890, 'building', 8);  // N-S east wall north
    this.addCollider(-800 - 16.5, 310, -800 - 14.5, 620, 'building', 8); // N-S west wall south
    this.addCollider(-800 - 16.5, 660, -800 - 14.5, 890, 'building', 8); // N-S west wall north
  }

  buildRoads() {
    const g = this.group;
    const roadTex = TX.makeRoadTexture(); const roadMat = new THREE.MeshStandardMaterial({ map: roadTex.map, roughnessMap: roadTex.roughnessMap, roughness: 1.0, metalness: 0 });
    const interTex = TX.makeIntersectionTexture(); const interMat = new THREE.MeshStandardMaterial({ map: interTex.map, roughnessMap: interTex.roughnessMap, roughness: 1.0 });
    const cwTex = TX.makeCrosswalkTexture(); const cwMat = new THREE.MeshStandardMaterial({ map: cwTex, transparent: true, roughness: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    const segs = [], inters = [], cws = [];
    const segLen = PITCH - ASPHALT; // 66 between intersection squares
    const segOnDeck = (x, z) => waterAt(x, z) && this.onBridge(x, z) > 0; // deck replaces the flat road here
    for (let k = 0; k <= N; k++) for (let m = 0; m < N; m++) {
      if (this.roadV[k][m]) {
        const mx = this.roadCoords[k], mz = this.roadCoords[m] + PITCH / 2;
        if (!segOnDeck(mx, mz)) {
          let geo = new THREE.PlaneGeometry(ASPHALT, segLen); geo.rotateX(-Math.PI / 2);
          const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * segLen / 14);
          geo.translate(mx, 0, mz); segs.push(geo);
        }
      }
      if (this.roadH[k][m]) {
        const mx = this.roadCoords[m] + PITCH / 2, mz = this.roadCoords[k];
        if (!segOnDeck(mx, mz)) {
          let geo = new THREE.PlaneGeometry(ASPHALT, segLen); geo.rotateX(-Math.PI / 2); geo.rotateY(Math.PI / 2);
          const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * segLen / 14);
          geo.translate(mx, 0, mz); segs.push(geo);
        }
      }
    }
    const drawn = new Set(this.junctions.map(j => j.ix + ',' + j.iz));
    for (const { ix, iz } of this.junctions) {
      const X = this.roadCoords[ix], Z = this.roadCoords[iz];
      if (!waterAt(X, Z)) {
        const geo = new THREE.PlaneGeometry(ASPHALT, ASPHALT); geo.rotateX(-Math.PI / 2); geo.translate(X, 0, Z); inters.push(geo);
      }
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        if (!this.hasRoadSeg(ix, iz, dx, dz)) continue;
        const cg = new THREE.PlaneGeometry(ASPHALT, 3); cg.rotateX(-Math.PI / 2); if (dx !== 0) cg.rotateY(Math.PI / 2);
        cg.translate(X + dx * (HALF_ASPHALT + 1.5), 0.005, Z + dz * (HALF_ASPHALT + 1.5)); cws.push(cg);
      }
    }
    const roads = new THREE.Mesh(mergeGeometries(segs), roadMat); roads.receiveShadow = true; roads.position.y = 0.0; g.add(roads);
    const im = new THREE.Mesh(mergeGeometries(inters), interMat); im.receiveShadow = true; g.add(im);
    const cm = new THREE.Mesh(mergeGeometries(cws), cwMat); cm.position.y = 0.01; g.add(cm);
    // bridges: decks over the water + full-length guardrails + support pillars.
    // Decks span bank-to-bank so no part of the driving surface touches water.
    for (const b of BRIDGES) {
      const len = b.to - b.from;
      const deckMat = new THREE.MeshStandardMaterial({ color: b.red ? 0x8a2a20 : 0x4a4d52, roughness: 0.9 });
      const deck = new THREE.Mesh(new THREE.BoxGeometry(b.axis === 'x' ? len : ASPHALT, 0.6, b.axis === 'x' ? ASPHALT : len), deckMat);
      deck.position.set(b.axis === 'x' ? (b.from + b.to) / 2 : b.c, DECK_Y - 0.3, b.axis === 'x' ? b.c : (b.from + b.to) / 2);
      deck.castShadow = true; deck.receiveShadow = true; g.add(deck);
      // asphalt skin on the deck + center dashes so it reads as road, not concrete
      const skinMat = new THREE.MeshStandardMaterial({ color: 0x33363b, roughness: 0.95 });
      const skin = new THREE.Mesh(new THREE.BoxGeometry(b.axis === 'x' ? len : ASPHALT - 0.6, 0.08, b.axis === 'x' ? ASPHALT - 0.6 : len), skinMat);
      skin.position.set(deck.position.x, DECK_Y - 0.035, deck.position.z); skin.receiveShadow = true; g.add(skin); // top flush with the deck physics (3.0)
      const dashMat = new THREE.MeshBasicMaterial({ color: 0xf5f5f0 });
      for (let d = 6; d < len - 3; d += 9) {
        const dash = new THREE.Mesh(new THREE.BoxGeometry(b.axis === 'x' ? 3 : 0.3, 0.05, b.axis === 'x' ? 0.3 : 3), dashMat);
        if (b.axis === 'x') dash.position.set(b.from + d, DECK_Y + 0.04, b.c);
        else dash.position.set(b.c, DECK_Y + 0.04, b.from + d);
        g.add(dash);
      }
      // continuous guardrails: deck span PLUS both approach ramps
      const railM = new THREE.MeshStandardMaterial({ color: b.red ? 0xc0392b : 0x8a8f94, roughness: 0.6, metalness: 0.4 });
      const railLen = len + 40; // covers deck + 20 m ramps each end
      const railMid = (b.from + b.to) / 2;
      for (const s of [-1, 1]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(b.axis === 'x' ? railLen : 0.3, 1.1, b.axis === 'x' ? 0.3 : railLen), railM);
        if (b.axis === 'x') {
          // follow the ramp slope at both ends: split into 3 pieces (ramp/deck/ramp)
          const mkRail = (x0, x1, y0, y1) => {
            const L = Math.hypot(x1 - x0, y1 - y0);
            const seg = new THREE.Mesh(new THREE.BoxGeometry(L, 0.28, 0.28), railM);
            seg.position.set((x0 + x1) / 2, (y0 + y1) / 2 + 0.55, b.c + s * (HALF_ASPHALT - 0.2));
            seg.rotation.z = Math.atan2(y1 - y0, x1 - x0); seg.castShadow = true; g.add(seg);
            const post = (x, y) => {
              const p = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.1, 0.25), railM);
              p.position.set(x, y, b.c + s * (HALF_ASPHALT - 0.2)); g.add(p);
            };
            const nPosts = Math.max(2, Math.round(L / 10));
            for (let k = 0; k <= nPosts; k++) { const t = k / nPosts; post(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t); }
          };
          mkRail(b.from - 20, b.from, 0, DECK_Y); mkRail(b.from, b.to, DECK_Y, DECK_Y); mkRail(b.to, b.to + 20, DECK_Y, 0);
          rail.visible = false; // using segmented sloped rails instead
        } else {
          rail.position.set(b.c + s * (HALF_ASPHALT - 0.2), DECK_Y + 0.55, railMid);
          rail.castShadow = true; g.add(rail);
        }
      }
      // sloped guardrail segments for z-axis bridges (ramps at both ends)
      if (b.axis !== 'x') {
        for (const s of [-1, 1]) {
          const mkRailZ = (z0, z1, y0, y1) => {
            const L = Math.hypot(z1 - z0, y1 - y0);
            const seg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, L), railM);
            seg.position.set(b.c + s * (HALF_ASPHALT - 0.2), (y0 + y1) / 2 + 0.55, (z0 + z1) / 2);
            seg.rotation.x = -Math.atan2(y1 - y0, z1 - z0); seg.castShadow = true; g.add(seg);
          };
          // deck-level rail already added above; add the two ramp slopes
          mkRailZ(b.from - 20, b.from, 0, DECK_Y); mkRailZ(b.to, b.to + 20, DECK_Y, 0);
        }
      }
      for (let d = 20; d < len - 10; d += 40) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, DECK_Y + 3, 8), deckMat);
        p.position.set(b.axis === 'x' ? b.from + d : b.c, (DECK_Y - 3) / 2 - 0.5, b.axis === 'x' ? b.c : b.from + d);
        g.add(p);
      }
      // approach ramps: sloped wedges rising 0 -> deck over 20 m (matches groundHeight)
      const rampLen = Math.hypot(20, DECK_Y), rampA = Math.atan2(DECK_Y, 20);
      for (const e of [0, 1]) {
        const s = e === 0 ? -1 : 1;
        const ramp = new THREE.Mesh(new THREE.BoxGeometry(b.axis === 'x' ? rampLen : ASPHALT, 0.6, b.axis === 'x' ? ASPHALT : rampLen), deckMat);
        if (b.axis === 'x') { ramp.position.set((e === 0 ? b.from : b.to) + s * 10, DECK_Y / 2 - 0.3, b.c); ramp.rotation.z = (e === 0 ? 1 : -1) * rampA; }
        else { ramp.position.set(b.c, DECK_Y / 2 - 0.3, (e === 0 ? b.from : b.to) + s * 10); ramp.rotation.x = (e === 0 ? -1 : 1) * rampA; }
        ramp.receiveShadow = true; g.add(ramp);
      }
      // guardrails block cars/peds along deck + both ramps ('prop' so the chase
      // camera ignores them). One box per side; the ramp slope is gentle enough
      // that a single deck-height rail reads correctly.
      for (const s of [-1, 1]) {
        if (b.axis === 'x') this.addCollider(b.from - 20, b.c + s * (HALF_ASPHALT - 0.2) - 0.2, b.to + 20, b.c + s * (HALF_ASPHALT - 0.2) + 0.2, 'prop', DECK_Y + 1.5);
        else this.addCollider(b.c + s * (HALF_ASPHALT - 0.2) - 0.2, b.from - 20, b.c + s * (HALF_ASPHALT - 0.2) + 0.2, b.to + 20, 'prop', DECK_Y + 1.5);
      }
      // suspension dressing: twin towers + main cables sagging between them
      if (b.susp) {
        const horiz = b.axis === 'x';
        const mid = (b.from + b.to) / 2, q1 = b.from + len * 0.3, q2 = b.from + len * 0.7;
        const towerM = new THREE.MeshStandardMaterial({ color: 0xb03030, roughness: 0.6 });
        const cableM = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.6 });
        for (const q of [q1, q2]) {
          for (const s of [-1, 1]) {
            const px = horiz ? q : b.c + s * (HALF_ASPHALT + 1.2);
            const pz = horiz ? b.c + s * (HALF_ASPHALT + 1.2) : q;
            const tower = new THREE.Mesh(new THREE.BoxGeometry(1.4, 26, 1.4), towerM);
            tower.position.set(px, 13, pz); tower.castShadow = true; g.add(tower);
            const cap = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 2.2), towerM);
            cap.position.set(px, 26.5, pz); g.add(cap);
          }
        }
        // main cables: shallow sag from tower tops down to deck ends
        for (const s of [-1, 1]) {
          const off = s * (HALF_ASPHALT + 1.2);
          const pts = horiz
            ? [[b.from - 10, 4, b.c + off], [q1, 26, b.c + off], [mid, 12, b.c + off], [q2, 26, b.c + off], [b.to + 10, 4, b.c + off]]
            : [[b.c + off, 4, b.from - 10], [b.c + off, 26, q1], [b.c + off, 12, mid], [b.c + off, 26, q2], [b.c + off, 4, b.to + 10]];
          for (let k = 0; k < pts.length - 1; k++) {
            const a = pts[k], c2 = pts[k + 1];
            const L = Math.hypot(c2[0] - a[0], c2[1] - a[1], c2[2] - a[2]);
            const seg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, L), cableM);
            seg.position.set((a[0] + c2[0]) / 2, (a[1] + c2[1]) / 2, (a[2] + c2[2]) / 2);
            seg.lookAt(c2[0], c2[1], c2[2]);
            g.add(seg);
          }
          // suspender drops from cable to deck
          for (let d = 14; d < len - 6; d += 14) {
            const drop = new THREE.Mesh(new THREE.BoxGeometry(0.14, 8, 0.14), cableM);
            if (horiz) drop.position.set(b.from + d, DECK_Y + 4, b.c + off);
            else drop.position.set(b.c + off, DECK_Y + 4, b.from + d);
            g.add(drop);
          }
        }
      }
    }
    // Sidewalk slabs (curbs) around every block, skirted down for hill blocks
    const swTex = TX.makeSidewalkTexture(); swTex.repeat.set(1, 1);
    const swMat = new THREE.MeshStandardMaterial({ map: swTex, roughness: 0.95, vertexColors: true });
    const sb = new Builder(); const white = new THREE.Color(1, 1, 1);
    for (const b of this.blocks) {
      const x0 = b.x0 - 3, x1 = b.x1 + 3, z0 = b.z0 - 3, z1 = b.z1 + 3;
      sb.box(x0, b.hBase - 2, z0, x1, b.hBase + CURB, z1, white, 2);
    }
    const swm = new THREE.Mesh(sb.build(), swMat); swm.receiveShadow = true; swm.castShadow = false; g.add(swm);
    this.buildTunnels();
  }

  // Bored tubes through the mountain: arched concrete liner ONLY where rock is
  // actually overhead (everywhere else the road runs open-air), with lit
  // interiors, signed portals where the bore meets daylight, and guardrail
  // flares at each mouth.
  buildTunnels() {
    const g = this.group;
    const linerMat = new THREE.MeshStandardMaterial({ color: 0x8a8f96, roughness: 0.9, side: THREE.DoubleSide });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x2b2e33, roughness: 0.95 });
    const railM = new THREE.MeshStandardMaterial({ color: 0xd8b400, roughness: 0.5, metalness: 0.3 });
    const covered = (x, z) => mountainH(x, z) > 6;
    for (const t of TUNNELS) {
      const horiz = t.axis === 'x';
      const len = t.to - t.from;
      const mid = (t.from + t.to) / 2;
      const at = (d) => horiz ? [mid + d, t.c] : [t.c, mid + d];
      // covered stretches (20 m chunks) — the tube only exists inside the rock
      const chunks = [];
      for (let d = -len / 2 + 10; d < len / 2; d += 20) {
        const [x, z] = at(d);
        if (covered(x, z)) chunks.push(d);
      }
      const chunkGeo = new THREE.CylinderGeometry(TUN_HALF + 1.5, TUN_HALF + 1.5, 20.5, 14, 1, true, 0, Math.PI);
      chunkGeo.rotateZ(Math.PI / 2); chunkGeo.rotateY(Math.PI / 2); // pipe along Z, opening down, crown up
      for (const d of chunks) {
        const [x, z] = at(d);
        const liner = new THREE.Mesh(chunkGeo, linerMat);
        if (horiz) liner.rotation.set(0, Math.PI / 2, 0); // Z-axial pipe -> X-axial for the E-W bore
        liner.position.set(x, 0, z);
        liner.receiveShadow = true; g.add(liner);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(horiz ? 20.5 : (TUN_HALF + 2) * 2, 0.8, horiz ? (TUN_HALF + 2) * 2 : 20.5), darkMat);
        cap.position.set(x, TUN_TOP + 0.4, z); g.add(cap);
      }
      // interior strip lights + glow, only where the tube exists
      this.tunnelLamps ||= [];
      const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff2c0, toneMapped: false });
      const lampGeo = new THREE.BoxGeometry(1.2, 0.15, 0.4);
      if (chunks.length) {
        const lamps = new THREE.InstancedMesh(lampGeo, lampMat, chunks.length);
        const dummy = new THREE.Object3D();
        chunks.forEach((d, k) => {
          const [x, z] = at(d);
          dummy.position.set(x, TUN_TOP - 0.3, z); dummy.updateMatrix(); lamps.setMatrixAt(k, dummy.matrix);
        });
        g.add(lamps);
        this.tunnelLamps.push(lamps);
        const pts = [];
        for (const d of chunks) { const [x, z] = at(d); pts.push(x, TUN_TOP - 0.5, z); }
        const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        const pm = new THREE.PointsMaterial({ map: TX.makeParticleTexture(), color: 0xffe9b0, size: 7, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
        g.add(new THREE.Points(pg, pm));
      }
      // portals where the covered bore meets daylight: first/last chunk boundaries
      const mouths = [];
      if (chunks.length) {
        let runStart = chunks[0];
        for (let k = 1; k <= chunks.length; k++) {
          if (k === chunks.length || chunks[k] > chunks[k - 1] + 21) {
            mouths.push([runStart - 10, chunks[k - 1] + 10]);
            if (k < chunks.length) runStart = chunks[k];
          }
        }
      }
      for (const [d0, d1] of mouths) {
        for (const dd of [d0, d1]) {
          const [mx, mz] = at(dd);
          const face = new THREE.Mesh(new THREE.BoxGeometry(horiz ? 2.5 : (TUN_HALF + 4) * 2, TUN_TOP + 3.5, horiz ? (TUN_HALF + 4) * 2 : 2.5), new THREE.MeshStandardMaterial({ color: 0xb9bec4, roughness: 0.8 }));
          face.position.set(mx, (TUN_TOP + 3.5) / 2 - 0.5, mz);
          face.castShadow = true; g.add(face);
          const hole = new THREE.Mesh(new THREE.PlaneGeometry((TUN_HALF + 1) * 2 - 4, TUN_TOP + 1), new THREE.MeshBasicMaterial({ color: 0x05070a }));
          const outward = (dd === d0 ? -1 : 1);
          if (horiz) { hole.position.set(mx + outward * 1.3, (TUN_TOP + 1) / 2, mz); hole.rotation.y = outward > 0 ? -Math.PI / 2 : Math.PI / 2; }
          else { hole.position.set(mx, (TUN_TOP + 1) / 2, mz + outward * 1.3); hole.rotation.y = outward > 0 ? Math.PI : 0; }
          g.add(hole);
          const sign = new THREE.Mesh(new THREE.BoxGeometry(horiz ? 1 : 10, 1, horiz ? 10 : 1), new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xffb300, emissiveIntensity: 1.2 }));
          if (horiz) sign.position.set(mx + outward * 1.6, TUN_TOP + 1.6, mz);
          else sign.position.set(mx, TUN_TOP + 1.6, mz + outward * 1.6);
          g.add(sign);
          for (const s of [-1, 1]) {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(horiz ? 24 : 0.35, 0.9, horiz ? 0.35 : 24), railM);
            if (horiz) rail.position.set(mx + outward * 12, 0.9, mz + s * (HALF_ASPHALT + 0.6));
            else rail.position.set(mx + s * (HALF_ASPHALT + 0.6), 0.9, mz + outward * 12);
            rail.castShadow = true; g.add(rail);
          }
        }
      }
    }
  }

  addCollider(minX, minZ, maxX, maxZ, kind = 'building', maxY = 999) { const cb = { minX, maxX, minZ, maxZ, kind, minY: 0, maxY }; this.hash.add(cb); return cb; }

  buildPark(b, grassB) {
    const rng = this.rng, BY = b.hBase + CURB, white = new THREE.Color(1, 1, 1);
    grassB.box(b.x0, BY, b.z0, b.x1, BY + 0.05, b.z1, white, 6);
    for (let k = 0; k < 22; k++) {
      const x = rng.range(b.x0 + 3, b.x1 - 3), z = rng.range(b.z0 + 3, b.z1 - 3);
      if (Math.hypot(x - b.cx, z - b.cz) < 9) continue;
      this.trees.push({ x, z, s: rng.range(0.9, 1.6) });
    }
    const f = new THREE.Group(); f.position.set(b.cx, BY, b.cz);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.4, 0.9, 24), new THREE.MeshStandardMaterial({ color: 0xbfb8aa, roughness: 0.8 })); basin.position.y = 0.45; basin.castShadow = true; f.add(basin);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.2, 24), new THREE.MeshStandardMaterial({ color: 0x3aa0d8, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85 })); water.position.y = 0.85; f.add(water);
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.2, 3, 12), basin.material); column.position.y = 1.8; column.castShadow = true; f.add(column);
    this.group.add(f); this.addCollider(b.cx - 5.2, b.cz - 5.2, b.cx + 5.2, b.cz + 5.2, 'prop', BY + 1);
    (this.fountains ||= []).push(f);
  }

  buildParkingLot(b) {
    const rng = this.rng, BY = b.hBase + CURB;
    const lotMat = new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.95 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(b.x1 - b.x0, 0.06, b.z1 - b.z0), lotMat); m.position.set(b.cx, BY + 0.03, b.cz); m.receiveShadow = true; this.group.add(m);
    const lineB = new Builder(); const lc = new THREE.Color(0.9, 0.9, 0.85);
    for (let r = 0; r < 2; r++) {
      const z = b.z0 + 14 + r * 24;
      for (let k = 0; k < 8; k++) {
        const x = b.x0 + 6 + k * 6.5;
        lineB.boxTop(x - 0.08, BY + 0.07, z - 5, x + 0.08, z + 5, lc, 1);
        if (k < 7 && rng.chance(0.55)) this.parkedSpots.push({ x: x + 3.25, z, heading: r === 0 ? Math.PI : 0 });
      }
    }
    const lg = lineB.build(); if (lg) this.group.add(new THREE.Mesh(lg, new THREE.MeshBasicMaterial({ vertexColors: true })));
    this.lamps.push({ x: b.cx, z: b.z0 + 26, rot: 0 }, { x: b.x0 + 8, z: b.z0 + 26, rot: 0 }, { x: b.x1 - 8, z: b.z0 + 26, rot: 0 });
  }

  // ---------- countryside: farms, forest, desert, mountain dressing, ship ----------
  buildCountryside() {
    const rng = this.rng;
    const B = new Builder();
    if (MAPID === 'liberty') this.countryLiberty(B, rng);
    else if (MAPID === 'vice') this.countryVice(B, rng);
    else {
    const fieldCols = [new THREE.Color(0x5d8a3c), new THREE.Color(0x9aa04c), new THREE.Color(0x4d7a34), new THREE.Color(0x8a7a3c)];
    // Red County crop checker, draped over the rolling hills in sub-quads that
    // follow the terrain (skipping the river band + road corridors underneath)
    for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) {
      const fx0 = -320 + a * 125, fx1 = fx0 + 121, fz0 = -320 + c * 120, fz1 = fz0 + 116;
      if (fz0 > -70 && fz1 < -10) continue;
      const col = fieldCols[(a + c) % 4], SEG = 5;
      for (let ia = 0; ia < SEG; ia++) for (let ic = 0; ic < SEG; ic++) {
        const qx0 = fx0 + (fx1 - fx0) * ia / SEG, qx1 = fx0 + (fx1 - fx0) * (ia + 1) / SEG;
        const qz0 = fz0 + (fz1 - fz0) * ic / SEG, qz1 = fz0 + (fz1 - fz0) * (ic + 1) / SEG;
        if (this.onRoad((qx0 + qx1) / 2, (qz0 + qz1) / 2)) continue; // let the asphalt show through
        const qy = (terrainH(qx0, qz0) + terrainH(qx1, qz0) + terrainH(qx0, qz1) + terrainH(qx1, qz1)) / 4 + 0.02;
        B.boxTop(qx0, qy, qz0, qx1, qz1, col, 14);
      }
    }
    const wood = new THREE.Color(0x6b4a2b);
    const fence = (x0, z0, x1, z1) => {
      const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz), n = Math.floor(len / 6);
      for (let k = 0; k <= n; k++) { const x = x0 + dx * k / n, z = z0 + dz * k / n, gy = terrainH(x, z); B.box(x - 0.12, gy, z - 0.12, x + 0.12, gy + 1.1, z + 0.12, wood); }
    };
    fence(-320, -320, 180, -320); fence(-320, 180, 180, 180); fence(-320, -320, -320, 180); fence(180, -320, 180, 180);
    // barns + silos + windmill
    const barnAt = (x, z, rot = 0) => {
      const gy = terrainH(x, z);
      const red = new THREE.Color(0xa03028), trim = new THREE.Color(0xf0f0f0);
      B.box(x - 9, gy, z - 6, x + 9, gy + 6, z + 6, red);
      B.box(x - 9.4, gy + 6, z - 6.4, x + 9.4, gy + 6.5, z + 6.4, trim);
      B.box(x - 1.2, gy, z + 5.8, x + 1.2, gy + 4.2, z + 6.3, new THREE.Color(0x3a2a1a));
      this.addCollider(x - 9, z - 6, x + 9, z + 6, 'building', gy + 7);
      void rot;
    };
    barnAt(-190, -190); barnAt(-40, 60); barnAt(60, -260);
    for (const [x, z] of [[-210, -190], [-22, 60]]) {
      const gy = terrainH(x, z);
      const silo = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 12, 12), new THREE.MeshStandardMaterial({ color: 0xb9bec4, roughness: 0.4, metalness: 0.6 }));
      silo.position.set(x, gy + 6, z); silo.castShadow = true; this.group.add(silo);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(3, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), silo.material);
      cap.position.set(x, gy + 12, z); this.group.add(cap);
      this.addCollider(x - 3, z - 3, x + 3, z + 3, 'prop', gy + 15);
    }
    { // windmill (spinning rotor)
      const mx = -140, mz = -120, gy = terrainH(mx, mz);
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.4, 16, 8), new THREE.MeshStandardMaterial({ color: 0x8a8f94, roughness: 0.6, metalness: 0.5 }));
      tower.position.set(mx, gy + 8, mz); tower.castShadow = true; this.group.add(tower);
      const rotor = new THREE.Group(); rotor.position.set(mx, gy + 15, mz + 1.2);
      for (let k = 0; k < 4; k++) {
        const bl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 0.08), tower.material);
        bl.position.y = 2.5; const holder = new THREE.Group(); holder.rotation.z = k * Math.PI / 2; holder.add(bl); rotor.add(holder);
      }
      this.group.add(rotor); (this.spinners ||= []).push(rotor);
      this.addCollider(mx - 1.5, mz - 1.5, mx + 1.5, mz + 1.5, 'prop', gy + 16);
    }
    // forest cabins (lifted onto the Shady Creeks hillsides, clear of the cone + roads)
    for (const [x, z] of [[-500, 350], [-620, 340]]) {
      const gy = terrainH(x, z);
      B.box(x - 5, gy, z - 4, x + 5, gy + 3.4, z + 4, new THREE.Color(0x5d4037));
      B.box(x - 5.4, gy + 3.4, z - 4.4, x + 5.4, gy + 4.6, z + 4.4, new THREE.Color(0x3a2e24));
      this.addCollider(x - 5, z - 4, x + 5, z + 4, 'building', gy + 5);
    }
    // desert shacks
    for (const [x, z] of [[-160, -700], [-120, -580]]) {
      B.box(x - 4, 0, z - 3, x + 4, 3, z + 3, new THREE.Color(0xb09a72));
      this.addCollider(x - 4, z - 3, x + 4, z + 3, 'building', 3.5);
    }
    // rural homesteads: trailers + rundown houses across the farmland/desert
    {
      const zones = [
        { x0: -320, z0: -320, x1: 160, z1: -80 },  // red county north
        { x0: -320, z0: 0, x1: 160, z1: 160 },     // red county south
        { x0: -300, z0: -960, x1: 220, z1: -420 }, // bone county desert
        // (no Flint County zone: homesteads sit on graded-flat farmland/desert,
        // the Flint hills stay wild forest/hillside)
      ];
      const placed = [];
      let guard = 0;
      while (placed.length < 16 && guard++ < 400) {
        const zn = zones[(rng.range(0, zones.length)) | 0];
        const x = rng.range(zn.x0, zn.x1), z = rng.range(zn.z0, zn.z1);
        if (waterAt(x, z) || mountainH(x, z) > 3 || this.onRoad(x, z) || this.blockAt(x, z)) continue;
        if (z > -75 && z < -5 && x > -320 && x < 1150) continue; // river band
        if (terrainH(x, z) > 1.0) continue; // homesteads sit on valley floors, hills stay wild
        if (placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 90)) continue;
        // keep clear of asphalt (sample the footprint)
        let bad = false;
        for (let ax = -8; ax <= 8 && !bad; ax += 4) for (let az = -8; az <= 8 && !bad; az += 4) if (this.onRoad(x + ax, z + az)) bad = true;
        if (bad) continue;
        placed.push([x, z]);
        const alongX = rng.chance(0.5);
        if (rng.chance(0.55)) {
          // trailer home: long faded box on blocks, wheels, hitch, steps, rust stripe
          const paint = new THREE.Color(rng.pick([0xcfc8b8, 0xa8b0a8, 0xd8c090, 0x9aa8b8, 0xc0a090]));
          const L = 11, W = 3.4, y0 = 0.7, y1 = 3.6;
          if (alongX) {
            B.box(x - L / 2, y0, z - W / 2, x + L / 2, y1, z + W / 2, paint);
            B.box(x - L / 2, y1, z - W / 2, x + L / 2, y1 + 0.25, z + W / 2, new THREE.Color(0x8a8f94));
            B.box(x - L / 2, y0 + 1.1, z - W / 2 - 0.06, x + L / 2, y0 + 1.7, z - W / 2 + 0.02, new THREE.Color(0x6b4a2a)); // rust stripe
            for (const wx of [-3, 3]) for (const s of [-1, 1]) B.box(x + wx - 0.9, 0.1, z + s * (W / 2 - 0.3) - 0.35, x + wx + 0.9, 1.0, z + s * (W / 2 - 0.3) + 0.35, new THREE.Color(0x1a1a1a));
            B.box(x + L / 2, 0.5, z - 0.15, x + L / 2 + 2.2, 0.8, z + 0.15, new THREE.Color(0x4a4d52)); // hitch
            B.box(x - 1, 0, z + W / 2, x + 1, 0.7, z + W / 2 + 1.4, new THREE.Color(0x7a7f85)); // steps
            B.box(x - 3, y0 + 1.4, z + W / 2 - 0.02, x - 1, y0 + 2.6, z + W / 2 + 0.06, new THREE.Color(0x1a2c3c)); // windows
            B.box(x + 2, y0 + 1.4, z + W / 2 - 0.02, x + 4, y0 + 2.6, z + W / 2 + 0.06, new THREE.Color(0x1a2c3c));
            this.addCollider(x - L / 2, z - W / 2, x + L / 2, z + W / 2, 'building', y1);
          } else {
            B.box(x - W / 2, y0, z - L / 2, x + W / 2, y1, z + L / 2, paint);
            B.box(x - W / 2, y1, z - L / 2, x + W / 2, y1 + 0.25, z + L / 2, new THREE.Color(0x8a8f94));
            B.box(x - W / 2 - 0.06, y0 + 1.1, z - L / 2, x - W / 2 + 0.02, y0 + 1.7, z + L / 2, new THREE.Color(0x6b4a2a));
            for (const wz of [-3, 3]) for (const s of [-1, 1]) B.box(x + s * (W / 2 - 0.3) - 0.35, 0.1, z + wz - 0.9, x + s * (W / 2 - 0.3) + 0.35, 1.0, z + wz + 0.9, new THREE.Color(0x1a1a1a));
            B.box(x - 0.15, 0.5, z + L / 2, x + 0.15, 0.8, z + L / 2 + 2.2, new THREE.Color(0x4a4d52));
            B.box(x + W / 2, 0, z - 1, x + W / 2 + 1.4, 0.7, z + 1, new THREE.Color(0x7a7f85));
            this.addCollider(x - W / 2, z - L / 2, x + W / 2, z + L / 2, 'building', y1);
          }
        } else {
          // rundown house: weathered box, sagging porch, patched walls, junk pile
          const wall = new THREE.Color(rng.pick([0x8a7f6a, 0x7a6a5a, 0x9a8a72, 0x6b6259]));
          const Wd = 7, Dd = 6, Hh = rng.range(3.6, 4.6);
          B.box(x - Wd / 2, 0, z - Dd / 2, x + Wd / 2, Hh, z + Dd / 2, wall);
          B.box(x - Wd / 2 - 0.4, Hh, z - Dd / 2 - 0.4, x + Wd / 2 + 0.4, Hh + 0.5, z + Dd / 2 + 0.4, new THREE.Color(0x4a3f33));
          B.box(x - 1.5, 1, z + Dd / 2 - 0.05, x + 1.5, 2.6, z + Dd / 2 + 0.08, new THREE.Color(0x5d6a72)); // patch
          // porch: posts + sagging roof on one side
          const ox = alongX ? Wd / 2 : -Wd / 2 - 2.4;
          for (const s of [-1, 1]) B.box(x + ox + (alongX ? 2.2 : 0) - 0.12, 0, z + s * 1.4 - 0.12, x + ox + (alongX ? 2.2 : 0) + 0.12, 2.6, z + s * 1.4 + 0.12, new THREE.Color(0x5d4a36));
          if (alongX) { B.box(x + Wd / 2 - 0.2, 2.5, z - 1.8, x + Wd / 2 + 2.6, 2.8, z + 1.8, new THREE.Color(0x6b5a48)); }
          else { B.box(x - Wd / 2 - 2.6, 2.5, z - 1.8, x - Wd / 2 + 0.2, 2.8, z + 1.8, new THREE.Color(0x6b5a48)); }
          // extend the porch collider over the roof footprint
          if (alongX) this.addCollider(x + Wd / 2 - 0.2, z - 1.8, x + Wd / 2 + 2.6, z + 1.8, 'prop', 2.8);
          else this.addCollider(x - Wd / 2 - 2.6, z - 1.8, x - Wd / 2 + 0.2, z + 1.8, 'prop', 2.8);
          // junk: tires + barrel beside the house
          const jx = x + (alongX ? -Wd / 2 - 3 : Wd / 2 + 3), jz = z + Dd / 2 + 2;
          B.box(jx - 0.8, 0, jz - 0.8, jx + 0.8, 0.5, jz + 0.8, new THREE.Color(0x1a1a1a));
          B.box(jx - 0.6, 0.5, jz - 0.6, jx + 0.6, 0.9, jz + 0.6, new THREE.Color(0x242424));
          B.box(jx + 1.6, 0, jz - 0.5, jx + 2.4, 1.1, jz + 0.5, new THREE.Color(0x8a3a2a));
          this.addCollider(x - Wd / 2, z - Dd / 2, x + Wd / 2, z + Dd / 2, 'building', Hh + 0.5);
          this.addCollider(jx - 1, jz - 1, jx + 2.5, jz + 1, 'prop', 1.2);
        }
      }
    }
    } // end fable countryside body
    const bg = B.build(); if (bg) { const m = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); m.castShadow = true; m.receiveShadow = true; this.group.add(m); }
    // cargo ship in the docks basin
    {
      const S = new Builder(), hull = new THREE.Color(0x2c3e50), rust = new THREE.Color(0x8a3a2a);
      const sx = MAPID === 'fable' ? 960 : MAPID === 'liberty' ? 935 : 40, sz = MAPID === 'fable' ? 350 : MAPID === 'liberty' ? 320 : 300;
      S.box(sx - 55, -1, sz - 9, sx + 55, 3, sz + 9, hull);
      S.box(sx + 40, 3, sz - 6, sx + 55, 8, sz + 6, rust);
      S.box(sx - 55, 3, sz - 4, sx - 38, 12, sz + 4, new THREE.Color(0xe8e8ea));
      for (let k = 0; k < 6; k++) S.box(sx - 30 + k * 11, 3, sz - 7, sx - 22 + k * 11, 8, sz + 7, new THREE.Color([0xc0392b, 0x2980b9, 0xf39c12, 0x27ae60][k % 4]));
      const sm = new THREE.Mesh(S.build(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 })); sm.castShadow = true; this.group.add(sm);
    }
    // rocks + cacti placement lists (meshes built in buildProps)
    if (MAPID === 'liberty') { this.libertyScatter(rng); } else if (MAPID === 'vice') { this.viceScatter(rng); } else {
    for (let k = 0; k < 130; k++) {
      const x = rng.range(-320, 260), z = rng.range(-980, -380);
      if (waterAt(x, z) || this.onRoad(x, z)) continue;
      (rng.chance(0.45) ? (this.rocks ||= []) : (this.cacti ||= [])).push({ x, z, s: rng.range(0.7, 1.6) });
    }
    for (let k = 0; k < 60; k++) { // mountain boulders (never on the bores or asphalt)
      const a = rng.range(0, 6.28), r = rng.range(180, 265);
      const x = -760 + Math.cos(a) * r, z = 640 + Math.sin(a) * r;
      if (this.inTunnel(x, z) || Math.abs(z - 640) < 20 || Math.abs(x + 800) < 20 || this.onRoad(x, z)) continue;
      (this.rocks ||= []).push({ x, z, s: rng.range(1.2, 2.6) });
    }
    for (let k = 0; k < 700; k++) { // Shady Creeks forest (clear of the tunnel corridors + asphalt)
      const x = rng.range(-920, -440), z = rng.range(300, 660);
      if (waterAt(x, z) || mountainH(x, z) > 10 || this.onRoad(x, z)) continue;
      if (Math.abs(z - 640) < 24 && x > -975 && x < -290) continue;
      if (Math.abs(x + 800) < 24 && z > 290 && z < 900) continue;
      (this.forestTrees ||= []).push({ x, z, s: rng.range(0.9, 1.7) });
    }
    for (let k = 0; k < 120; k++) { // Chiliad slope pines (never on the bores or asphalt)
      const a = rng.range(0, 6.28), r = rng.range(120, 200);
      const x = -760 + Math.cos(a) * r, z = 640 + Math.sin(a) * r;
      if (this.inTunnel(x, z) || Math.abs(z - 640) < 20 || Math.abs(x + 800) < 20 || this.onRoad(x, z)) continue;
      this.trees.push({ x, z, s: rng.range(0.8, 1.3) });
    }
    for (let k = 0; k < 120; k++) { // scattered countryside trees
      const x = rng.range(-340, 200), z = rng.range(-340, 200);
      if (waterAt(x, z) || this.onRoad(x, z)) continue;
      if (this.blockAt(x, z)) continue;
      this.trees.push({ x, z, s: rng.range(0.8, 1.4) });
    }
    } // end fable placements
  }

  countryVice(B, rng) {
    // marina boardwalk + lighthouse at the south tip of the beach island
    const deckM = new THREE.Color(0x7a7f85), darkM = new THREE.Color(0x4a4d52);
    B.box(300, -0.5, 330, 380, 0.4, 336, deckM);
    for (let d = 0; d <= 60; d += 12) B.box(300 + d - 0.5, -2, 333, 300 + d + 0.5, 0.4, 335, darkM);
    const lx = 600, lz = 380;
    B.box(lx - 3, 0, lz - 3, lx + 3, 22, lz + 3, new THREE.Color(0xf0f0f0));
    B.box(lx - 3.5, 22, lz - 3.5, lx + 3.5, 24, lz + 3.5, new THREE.Color(0xc0392b));
    this.addCollider(lx - 3, lz - 3, lx + 3, lz + 3, 'building', 24);
  }

  viceScatter(rng) {
    // Florida: palms everywhere — ocean edge, hotel rows, island parks
    for (let k = 0; k < 160; k++) {
      const x = rng.range(420, 620), z = rng.range(-620, 400);
      if (waterAt(x, z) || this.onRoad(x, z) || this.blockAt(x, z)) continue;
      this.trees.push({ x, z, s: rng.range(0.9, 1.5), palm: true });
    }
    for (let k = 0; k < 260; k++) {
      const x = rng.range(-850, 650), z = rng.range(-650, 430);
      if (waterAt(x, z) || this.onRoad(x, z) || this.blockAt(x, z)) continue;
      this.trees.push({ x, z, s: rng.range(0.8, 1.3), palm: rng.chance(0.65) });
    }
  }

  countryLiberty(B, rng) {
    // Cochrane-style dam across the reservoir's south edge + spillway + lake dock.
    // The wall leaves a gap at x -100..-60 where the lake bridge lands.
    const wallM = new THREE.Color(0x9aa0a6), darkM = new THREE.Color(0x4a4d52);
    B.box(-210, -2, -628, -100, 26, -614, wallM);                      // dam wall west
    B.box(-60, -2, -628, 60, 26, -614, wallM);                         // dam wall east
    B.box(-210, 26, -628, -100, 27.5, -614, darkM);                    // crest lips
    B.box(-60, 26, -628, 60, 27.5, -614, darkM);
    for (let x = -190; x <= 40; x += 23) { if (x > -110 && x < -50) continue; B.box(x - 1, -2, -621, x + 1, 12, -619, darkM); } // spillway piers
    B.box(-96, -2, -640, -64, 4, -608, new THREE.Color(0x6b6f75));     // powerhouse
    this.addCollider(-210, -628, -100, -614, 'building', 28);
    this.addCollider(-60, -628, 60, -614, 'building', 28);
    this.addCollider(-96, -640, -64, -608, 'building', 5);
    // lake dock
    B.box(30, -0.5, -700, 70, 0.4, -694, new THREE.Color(0x7a7f85));
    for (let d = 0; d <= 40; d += 10) B.box(30 + d - 0.5, -2, -697, 30 + d + 0.5, 0.4, -693, darkM);
  }

  libertyScatter(rng) {
    // dam-hills rocks + pines (kept off asphalt and out of the lake)
    for (let k = 0; k < 90; k++) {
      const x = rng.range(-560, 320), z = rng.range(-980, -420);
      if (waterAt(x, z) || this.onRoad(x, z)) continue;
      (rng.chance(0.5) ? (this.rocks ||= []) : this.trees).push({ x, z, s: rng.range(0.8, 1.6) });
    }
    for (let k = 0; k < 260; k++) { // dense hills forest
      const x = rng.range(-560, 320), z = rng.range(-980, -420);
      if (waterAt(x, z) || this.onRoad(x, z)) continue;
      if (Math.abs(x) < 60 && Math.abs(z + 700) < 130) continue; // keep the reservoir clear
      (this.forestTrees ||= []).push({ x, z, s: rng.range(0.9, 1.7) });
    }
    for (let k = 0; k < 60; k++) { // island park fill
      const x = rng.range(-900, 900), z = rng.range(-100, 500);
      if (waterAt(x, z) || this.onRoad(x, z) || this.blockAt(x, z)) continue;
      this.trees.push({ x, z, s: rng.range(0.8, 1.3) });
    }
  }

  buildBlocks() {
    const rng = this.rng;
    const styles = ['glass', 'concrete', 'brick', 'tower', 'house', 'industrial', 'deco', 'brownstone'];
    const builders = {}; for (const s of styles) builders[s] = new Builder();
    const roofB = new Builder(); const neonB = new Builder(); const detailB = new Builder();
    const grassB = new Builder();
    const sandB = new Builder();
    const roofC = new THREE.Color(0.55, 0.55, 0.55);
    const neonColors = [0xff2d95, 0x2df0ff, 0xffe12d, 0x7dff2d, 0xff6a2d, 0xb52dff].map(c => new THREE.Color(c));
    // city vibe: FL goes neon-heavy pastel, NY goes muted brick/brownstone, LA sits between
    const neonChance = MAPID === 'vice' ? 0.68 : MAPID === 'liberty' ? 0.28 : 0.45;
    const commStyles = MAPID === 'vice'
      ? ['deco', 'deco', 'concrete', 'tower']
      : MAPID === 'liberty'
        ? ['brownstone', 'brick', 'brick', 'concrete', 'tower']
        : ['concrete', 'brick', 'brick', 'tower'];

    const addBuilding = (x0, z0, x1, z1, h, style, tint, baseY = CURB) => {
      const c = new THREE.Color(tint);
      builders[style].boxSides(x0, baseY, z0, x1, baseY + h, z1, c, 3);
      roofB.boxTop(x0, baseY + h, z0, x1, z1, roofC.clone().multiplyScalar(rng.range(0.7, 1.2)), 4);
      const pw = 0.5;
      detailB.box(x0, baseY + h, z0, x1, baseY + h + 0.8, z0 + pw, c); detailB.box(x0, baseY + h, z1 - pw, x1, baseY + h + 0.8, z1, c);
      detailB.box(x0, baseY + h, z0, x0 + pw, baseY + h + 0.8, z1, c); detailB.box(x1 - pw, baseY + h, z0, x1, baseY + h + 0.8, z1, c);
      const n = rng.int(0, 3);
      for (let k = 0; k < n; k++) {
        const bw = rng.range(1.5, 4), bd = rng.range(1.5, 4), bh = rng.range(1, 3);
        const bx = rng.range(x0 + 1.5, x1 - 1.5 - bw), bz = rng.range(z0 + 1.5, z1 - 1.5 - bd);
        if (bx < x0 + 1 || bz < z0 + 1) continue;
        detailB.box(bx, baseY + h, bz, bx + bw, baseY + h + bh, bz + bd, new THREE.Color(0x777f86));
      }
      if (h > 60 && rng.chance(0.6)) { const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2; detailB.box(cx - 0.3, baseY + h, cz - 0.3, cx + 0.3, baseY + h + rng.range(6, 16), cz + 0.3, new THREE.Color(0x999999)); }
      if (style !== 'house' && style !== 'industrial' && h > 10 && rng.chance(neonChance)) {
        const nc = rng.pick(neonColors); const y = baseY + rng.range(4, Math.min(h - 2, 12)); const side = rng.int(0, 3);
        if (side === 0) neonB.box(x0 + 1, y, z1, x1 - 1, y + 1.2, z1 + 0.2, nc);
        else if (side === 1) neonB.box(x0 + 1, y, z0 - 0.2, x1 - 1, y + 1.2, z0, nc);
        else if (side === 2) neonB.box(x1, y, z0 + 1, x1 + 0.2, y + 1.2, z1 - 1, nc);
        else neonB.box(x0 - 0.2, y, z0 + 1, x0, y + 1.2, z1 - 1, nc);
      }
      this.addCollider(x0, z0, x1, z1, 'building', baseY + h);
    };

    for (const b of this.blocks) {
      const w = b.x1 - b.x0, BY = b.hBase + CURB;
      if (b.type === 'park') { this.buildPark(b, grassB); continue; }
      if (b.type === 'lot') { this.buildParkingLot(b); continue; }
      if (b.type === 'airport') { this.buildAirport(b, addBuilding, detailB, neonB); continue; }
      if (b.type === 'docks') { this.buildDocks(b, addBuilding, detailB); continue; }
      if (b.type === 'stadium') { this.buildStadium(b, detailB); continue; }
      if (b.type === 'beach') { this.buildBeach(b, sandB); continue; }
      if (b.type === 'downtown') {
        const tall = b.region === 'santos' ? [70, 140] : b.region === 'kingsland' ? [60, 120] : b.region === 'mainland' ? [55, 110] : b.region === 'ferro' ? [30, 70] : [25, 60];
        const towers = rng.int(1, 3);
        if (towers === 1) {
          const m = rng.range(4, 8); const h = rng.range(...tall); const style = rng.pick(['glass', 'tower', 'glass']);
          const tint = rng.pick([0xffffff, 0xdfe8f0, 0xc8d6e0, 0xe8e0d0]);
          addBuilding(b.x0 + m, b.z0 + m, b.x1 - m, b.z1 - m, h * 0.55, style, tint, BY);
          const m2 = m + rng.range(4, 8); addBuilding(b.x0 + m2, b.z0 + m2, b.x1 - m2, b.z1 - m2, h * 0.85, style, tint, BY);
          const m3 = m2 + rng.range(4, 7); addBuilding(b.x0 + m3, b.z0 + m3, b.x1 - m3, b.z1 - m3, h, style, tint, BY);
        } else {
          const half = w / 2;
          for (let a = 0; a < 2; a++) for (let c = 0; c < 2; c++) {
            if (towers === 2 && a !== c) continue;
            const x0 = b.x0 + a * half + 2, z0 = b.z0 + c * half + 2, x1 = x0 + half - 4, z1 = z0 + half - 4;
            const h = rng.range(tall[0] * 0.5, tall[1]);
            addBuilding(x0, z0, x1, z1, h, rng.pick(['glass', 'tower', 'concrete']), rng.pick([0xffffff, 0xd7e3ee, 0xe9e2d3, 0xbfc9d3]), BY);
          }
        }
      } else if (b.type === 'strip') {
        const lots = 2, lw = w / lots;
        for (let a = 0; a < lots; a++) for (let c = 0; c < lots; c++) {
          const h = rng.range(12, 30);
          addBuilding(b.x0 + a * lw + 1.5, b.z0 + c * lw + 1.5, b.x0 + (a + 1) * lw - 1.5, b.z0 + (c + 1) * lw - 1.5, h,
            rng.pick(['glass', 'concrete', 'tower']), rng.pick([0xffffff, 0xf0e6d6, 0xffe9c9]), BY);
          const nc = rng.pick(neonColors);
          const px = b.x0 + (a + 0.5) * lw, pz = b.z0 + (c + 0.5) * lw;
          neonB.box(px - 0.6, BY, pz - 0.6, px + 0.6, BY + rng.range(14, 24), pz + 0.6, nc);
          this.addCollider(px - 0.7, pz - 0.7, px + 0.7, pz + 0.7, 'prop', BY + 24);
        }
        for (let k = 0; k < 4; k++) this.trees.push({ x: b.x0 + 6 + k * 14, z: b.z1 - 4, s: 1.1, palm: true });
      } else if (b.type === 'commercial') {
        const lots = rng.pick([2, 3]); const lw = w / lots;
        for (let a = 0; a < lots; a++) for (let c = 0; c < lots; c++) {
          if (rng.chance(0.12)) { this.trees.push({ x: b.x0 + (a + 0.5) * lw, z: b.z0 + (c + 0.5) * lw, s: rng.range(0.8, 1.2) }); continue; }
          const gap = rng.range(0.6, 2);
          const h = rng.range(9, 36);
          const gx0 = b.x0 + a * lw + gap, gz0 = b.z0 + c * lw + gap, gx1 = b.x0 + (a + 1) * lw - gap, gz1 = b.z0 + (c + 1) * lw - gap;
          addBuilding(gx0, gz0, gx1, gz1, h,
            rng.pick(commStyles), rng.pick([0xffffff, 0xf0e6d6, 0xd8d2c8, 0xe6e6ea, 0xf3d9c0]), BY);
          // ground-floor shopfront on the south face: glass front, awning, lit sign band
          if (rng.chance(0.75)) {
            const signC = rng.pick(neonColors);
            const winM = new THREE.Color(0x18242f);
            detailB.box(gx0 + 1, BY + 0.6, gz1 - 0.08, gx1 - 1, BY + 2.8, gz1 + 0.06, winM); // glass front
            detailB.box(gx0 + 0.5, BY + 3.1, gz1 - 0.1, gx1 - 0.5, BY + 3.3, gz1 + 1.3, new THREE.Color(rng.pick([0x8a2a20, 0x1a4a6a, 0x2a6a3a, 0x5d3a1a]))); // awning
            neonB.box(gx0 + 1, BY + 3.6, gz1 - 0.05, gx1 - 1, BY + 4.5, gz1 + 0.12, signC); // sign band
          }
        }
      } else if (b.type === 'residential') {
        const lots = 3, lw = w / lots;
        for (let a = 0; a < lots; a++) for (let c = 0; c < lots; c++) {
          const cx = b.x0 + (a + 0.5) * lw, cz = b.z0 + (c + 0.5) * lw;
          if (rng.chance(0.2)) { this.trees.push({ x: cx, z: cz, s: rng.range(0.9, 1.4) }); continue; }
          if (MAPID === 'liberty' && rng.chance(0.55)) {
            // NY brownstone rowhouse: tall narrow masonry block with stone trim
            const hw = rng.range(6, 8), h = rng.range(10, 15);
            addBuilding(cx - hw, cz - 6, cx + hw, cz + 6, h, 'brownstone', rng.pick([0xffffff, 0xf0e6d6, 0xe2d8c8]), BY);
          } else {
            const hw = rng.range(5, 8), hd = rng.range(5, 8), h = rng.range(5, 9);
            addBuilding(cx - hw, cz - hd, cx + hw, cz + hd, h, 'house', rng.pick([0xffffff, 0xffe9c9, 0xd9f0e0, 0xf7d6d6, 0xe0e6ff, 0xfff4b0]), BY);
          }
          if (rng.chance(0.7)) this.trees.push({ x: cx + rng.range(-9, 9), z: cz + (rng.chance(0.5) ? 9.2 : -9.2), s: rng.range(0.7, 1.1) });
        }
      } else if (b.type === 'industrial') {
        const split = rng.chance(0.5);
        if (split) {
          addBuilding(b.x0 + 2, b.z0 + 2, b.cx - 2, b.z1 - 2, rng.range(8, 14), 'industrial', rng.pick([0xffffff, 0xd0d8dc, 0xc9bfae]), BY);
          addBuilding(b.cx + 2, b.z0 + 2, b.x1 - 2, b.z1 - 2, rng.range(8, 14), 'industrial', rng.pick([0xffffff, 0xd0d8dc, 0xc9bfae]), BY);
        } else {
          addBuilding(b.x0 + 3, b.z0 + 3, b.x1 - 3, b.cz - 3, rng.range(10, 16), 'industrial', rng.pick([0xffffff, 0xd0d8dc]), BY);
          for (let k = 0; k < 6; k++) {
            const cx = rng.range(b.x0 + 6, b.x1 - 6), cz = rng.range(b.cz + 4, b.z1 - 4);
            const col = new THREE.Color(rng.pick([0xc0392b, 0x2980b9, 0xf39c12, 0x27ae60, 0x8e44ad]));
            detailB.box(cx - 3, BY, cz - 1.2, cx + 3, BY + 2.6, cz + 1.2, col);
            this.addCollider(cx - 3, cz - 1.2, cx + 3, cz + 1.2, 'prop', 2.6);
          }
          const sx = b.x1 - 8, sz = b.cz + 10; detailB.box(sx - 1.2, BY, sz - 1.2, sx + 1.2, BY + 30, sz + 1.2, new THREE.Color(0x6b6b6b));
          this.addCollider(sx - 1.2, sz - 1.2, sx + 1.2, sz + 1.2, 'prop', 30);
        }
      } else if (b.type === 'desert') {
        addBuilding(b.x0 + 4, b.z0 + 4, b.x1 - 4, b.z0 + 16, rng.range(5, 7), 'concrete', rng.pick([0xffe9c9, 0xf3d9c0, 0xe6e6ea]), BY);
        const nc = rng.pick(neonColors);
        neonB.box(b.cx - 0.5, BY, b.z0 + 2, b.cx + 0.5, BY + 12, b.z0 + 3, nc);
        this.addCollider(b.cx - 0.6, b.z0 + 1.9, b.cx + 0.6, b.z0 + 3.1, 'prop', BY + 12);
        detailB.box(b.x0 + 8, BY + 4.5, b.cz, b.x0 + 28, BY + 5.2, b.cz + 14, new THREE.Color(0xd8d8d8));
        for (const [px, pz] of [[0, 0], [8, 0], [0, 7], [8, 7]]) detailB.box(b.x0 + 9 + px, BY, b.cz + 1 + pz, b.x0 + 10 + px, BY + 4.5, b.cz + 2 + pz, new THREE.Color(0x8a8f94));
        for (const px of [12, 18]) { detailB.box(b.x0 + px, BY, b.cz + 6, b.x0 + px + 1.2, BY + 1.4, b.cz + 7, new THREE.Color(0xc0392b)); this.addCollider(b.x0 + px, b.cz + 6, b.x0 + px + 1.2, b.cz + 7, 'prop', BY + 1.4); }
      }
    }

    const roofTex = TX.makeRoof(3);
    for (const s of styles) {
      const geo = builders[s].build(); if (!geo) continue;
      const { map, emissiveMap } = TX.makeFacade(s, 100 + styles.indexOf(s));
      const mat = new THREE.MeshStandardMaterial({ map, emissiveMap, emissive: 0xffffff, emissiveIntensity: 0, vertexColors: true, roughness: s === 'glass' ? 0.35 : 0.85, metalness: s === 'glass' ? 0.5 : 0.0 });
      const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; mesh.receiveShadow = true; this.group.add(mesh);
      (this.facadeMats ||= []).push(mat);
    }
    const rg = roofB.build(); if (rg) { const m = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ map: roofTex, vertexColors: true, roughness: 1 })); m.receiveShadow = true; this.group.add(m); }
    const dg = detailB.build(); if (dg) { const m = new THREE.Mesh(dg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 })); m.castShadow = true; m.receiveShadow = true; this.group.add(m); }
    const ng = neonB.build(); if (ng) { this.neonMat = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }); const m = new THREE.Mesh(ng, this.neonMat); this.group.add(m); }
    const gg = grassB.build(); if (gg) { const t = TX.makeGrassTexture(12); const m = new THREE.Mesh(gg, new THREE.MeshStandardMaterial({ map: t, vertexColors: true, roughness: 1 })); m.receiveShadow = true; this.group.add(m); }
    const sg = sandB.build(); if (sg) { const t = TX.makeSandTexture(14); const m = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ map: t, vertexColors: true, roughness: 1 })); m.receiveShadow = true; this.group.add(m); }
  }

  buildAirport(b, addBuilding, detailB, neonB) {
    const BY = b.hBase + CURB, white = new THREE.Color(1, 1, 1);
    const w = b.x1 - b.x0, vertical = w < (b.z1 - b.z0);
    detailB.box(b.x0, BY - 0.05, b.z0, b.x1, BY + 0.05, b.z1, new THREE.Color(0x3a3c40));
    const rw = 10, rx = vertical ? b.cx - w / 4 : b.cx, rz = vertical ? b.cz : b.cz - w / 4;
    const rl = Math.min(w, b.z1 - b.z0) - 8;
    if (vertical) detailB.box(rx - rw / 2, BY + 0.05, b.z0 + 4, rx + rw / 2, BY + 0.12, b.z1 - 4, new THREE.Color(0x2b2d31));
    else detailB.box(b.x0 + 4, BY + 0.05, rz - rw / 2, b.x1 - 4, BY + 0.12, rz + rw / 2, new THREE.Color(0x2b2d31));
    for (let d = -rl / 2 + 4; d < rl / 2 - 2; d += 8) {
      if (vertical) detailB.box(rx - 0.25, BY + 0.12, b.cz + d - 1.5, rx + 0.25, BY + 0.16, b.cz + d + 1.5, white);
      else detailB.box(b.cx + d - 1.5, BY + 0.12, rz - 0.25, b.cx + d + 1.5, BY + 0.16, rz + 0.25, white);
    }
    if (vertical) {
      addBuilding(b.x0 + 4, b.z0 + 4, b.x0 + 16, b.z0 + 26, 9, 'concrete', 0xe8e8ea, BY);
      for (const hz of [b.z0 + 36, b.z0 + 52]) { detailB.box(b.x0 + 3, BY, hz, b.x0 + 17, BY + 7, hz + 12, new THREE.Color(0x9aa0a6)); this.addCollider(b.x0 + 3, hz, b.x0 + 17, hz + 12, 'building', BY + 7); }
      detailB.box(b.x1 - 8, BY, b.cz - 3, b.x1 - 4, BY + 22, b.cz + 1, new THREE.Color(0x8a8f94));
      detailB.box(b.x1 - 9, BY + 22, b.cz - 4, b.x1 - 3, BY + 25, b.cz + 2, new THREE.Color(0x1a2c3c));
      this.addCollider(b.x1 - 9, b.cz - 4, b.x1 - 3, b.cz + 2, 'building', BY + 25);
    } else {
      addBuilding(b.x0 + 4, b.z0 + 4, b.x0 + 26, b.z0 + 16, 9, 'concrete', 0xe8e8ea, BY);
      for (const hx of [b.x0 + 36, b.x0 + 52]) { detailB.box(hx, BY, b.z0 + 3, hx + 12, BY + 7, b.z0 + 17, new THREE.Color(0x9aa0a6)); this.addCollider(hx, b.z0 + 3, hx + 12, b.z0 + 17, 'building', BY + 7); }
      detailB.box(b.cx - 3, BY, b.z1 - 8, b.cx + 1, BY + 22, b.z1 - 4, new THREE.Color(0x8a8f94));
      detailB.box(b.cx - 4, BY + 22, b.z1 - 9, b.cx + 2, BY + 25, b.z1 - 3, new THREE.Color(0x1a2c3c));
      this.addCollider(b.cx - 4, b.z1 - 9, b.cx + 2, b.z1 - 3, 'building', BY + 25);
    }
    const px = vertical ? b.x1 - 14 : b.cx - 10, pz = vertical ? b.cz + 6 : b.z1 - 16;
    this.buildPlane(px, pz, vertical ? Math.PI / 2 : 0, detailB, BY);
    this.buildPlane(px + (vertical ? -8 : 10), pz + (vertical ? 14 : -8), vertical ? Math.PI / 2 : 0.2, detailB, BY);
    // terminal entrance for airport travel: doorway + lit TERMINAL sign, ring spot clear of it
    const door = vertical ? { x: b.x0 + 10, z: b.z0 + 27.5 } : { x: b.x0 + 27.5, z: b.z0 + 10 };
    if (neonB) {
      if (vertical) neonB.box(door.x - 3, BY + 4.5, door.z - 0.4, door.x + 3, BY + 5.7, door.z + 0.4, new THREE.Color(0x2df0ff));
      else neonB.box(door.x - 0.4, BY + 4.5, door.z - 3, door.x + 3, BY + 5.7, door.z + 0.4, new THREE.Color(0x2df0ff));
    }
    if (vertical) {
      detailB.box(door.x - 3.2, BY, door.z - 0.6, door.x + 3.2, BY + 4.4, door.z + 0.6, new THREE.Color(0x1a2c3c));
      this.addCollider(door.x - 3.2, door.z - 0.6, door.x + 3.2, door.z + 0.6, 'building', BY + 4.4);
    } else {
      detailB.box(door.x - 0.6, BY, door.z - 3.2, door.x + 0.6, BY + 4.4, door.z + 3.2, new THREE.Color(0x1a2c3c));
      this.addCollider(door.x - 0.6, door.z - 3.2, door.x + 0.6, door.z + 3.2, 'building', BY + 4.4);
    }
    // one travel terminal + helipad per airport region (first airport block built wins)
    if (!this._airportRegions) this._airportRegions = new Set();
    if (!this._airportRegions.has(b.region)) {
      this._airportRegions.add(b.region);
      this.airports.push({ x: door.x + (vertical ? 0 : 2.2), z: door.z + (vertical ? 2.2 : 0), name: b.district });
      // helipad on the open tarmac corner (game parks the flyable heli here)
      const hp = vertical ? { x: b.x1 - 14, z: b.z1 - 12 } : { x: b.x1 - 14, z: b.z0 + 14 };
      const pad = new THREE.Mesh(new THREE.CircleGeometry(5.5, 24), new THREE.MeshStandardMaterial({ map: TX.makeHelipadTexture(), roughness: 0.9 }));
      pad.rotation.x = -Math.PI / 2; pad.position.set(hp.x, BY + 0.1, hp.z); pad.receiveShadow = true; this.group.add(pad);
      b.helipad = hp;
    }
  }
  buildPlane(x, z, heading, detailB, baseY) {
    const g = new THREE.Group(); g.position.set(x, baseY, z); g.rotation.y = heading;
    const white = new THREE.MeshStandardMaterial({ color: 0xe8e8ea, roughness: 0.4, metalness: 0.3 });
    const accent = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.5 });
    const fus = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 14, 10), white); fus.rotation.x = Math.PI / 2; fus.position.y = 1.6; fus.castShadow = true; g.add(fus);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8), white); nose.position.set(0, 1.6, 7); g.add(nose);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(20, 0.25, 2.6), white); wing.position.set(0, 1.4, 0.5); wing.castShadow = true; g.add(wing);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 1.6), white); tail.position.set(0, 2.2, -6.4); g.add(tail);
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3, 2), accent); fin.position.set(0, 3.4, -6.4); g.add(fin);
    for (const s of [-1, 1]) { const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.4, 8), accent); eng.rotation.x = Math.PI / 2; eng.position.set(s * 4.5, 0.9, 0.8); g.add(eng); }
    this.group.add(g);
    this.addCollider(x - 8, z - 8, x + 8, z + 8, 'prop', baseY + 4);
  }
  buildDocks(b, addBuilding, detailB) {
    const rng = this.rng, BY = b.hBase + CURB;
    detailB.box(b.x0, BY - 0.05, b.z0, b.x1, BY + 0.05, b.z1, new THREE.Color(0x6b6f75));
    addBuilding(b.x0 + 3, b.z0 + 3, b.x0 + 22, b.z0 + 15, 10, 'industrial', 0xd0d8dc, BY);
    for (let k = 0; k < 8; k++) {
      const cx = rng.range(b.x0 + 8, b.x1 - 8), cz = rng.range(b.z0 + 22, b.z1 - 6);
      const col = new THREE.Color(rng.pick([0xc0392b, 0x2980b9, 0xf39c12, 0x27ae60, 0x8e44ad, 0x7f8c8d]));
      const h = rng.chance(0.4) ? 5.2 : 2.6;
      detailB.box(cx - 3, BY, cz - 1.2, cx + 3, BY + h, cz + 1.2, col);
      this.addCollider(cx - 3, cz - 1.2, cx + 3, cz + 1.2, 'prop', BY + h);
    }
    for (const cz of [b.z0 + 30, b.z1 - 12]) {
      const cx = b.x1 - 10, crane = new THREE.Color(0xe67e22);
      detailB.box(cx - 1, BY, cz - 1, cx + 1, BY + 18, cz + 1, crane);
      detailB.box(cx - 8, BY + 16, cz - 1, cx + 8, BY + 18, cz + 1, crane);
      detailB.box(cx + 6, BY + 8, cz - 0.5, cx + 8, BY + 16, cz + 0.5, crane);
      this.addCollider(cx - 1.2, cz - 1.2, cx + 1.2, cz + 1.2, 'prop', BY + 18);
    }
    if (b.x1 + 30 > 880) {
      detailB.box(b.x1 - 4, BY - 0.5, b.cz - 6, b.x1 + 46, BY + 0.4, b.cz + 6, new THREE.Color(0x7a7f85));
      for (let d = 0; d <= 40; d += 10) for (const s of [-5, 5]) detailB.box(b.x1 + d - 0.5, -2, b.cz + s - 0.5, b.x1 + d + 0.5, BY, b.cz + s + 0.5, new THREE.Color(0x4a4d52));
    }
  }
  buildStadium(b, detailB) {
    const BY = b.hBase + CURB;
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(27, 29, 12, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0x8a8f94, roughness: 0.8, side: THREE.DoubleSide }));
    wall.position.set(b.cx, BY + 6, b.cz); wall.castShadow = true; this.group.add(wall);
    const field = new THREE.Mesh(new THREE.CircleGeometry(25, 24), new THREE.MeshStandardMaterial({ color: 0x3f8a2e, roughness: 1 }));
    field.rotation.x = -Math.PI / 2; field.position.set(b.cx, BY + 0.1, b.cz); field.receiveShadow = true; this.group.add(field);
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      detailB.box(b.cx + sx * 30 - 0.5, BY, b.cz + sz * 30 - 0.5, b.cx + sx * 30 + 0.5, BY + 20, b.cz + sz * 30 + 0.5, new THREE.Color(0x3b3f44));
      detailB.box(b.cx + sx * 30 - 2, BY + 20, b.cz + sz * 30 - 1, b.cx + sx * 30 + 2, BY + 22, b.cz + sz * 30 + 1, new THREE.Color(0xfff6e0));
    }
    this.addCollider(b.cx - 29, b.cz - 29, b.cx + 29, b.cz + 29, 'building', BY + 12);
  }
  buildBeach(b, sandB) {
    const rng = this.rng, BY = b.hBase + CURB;
    sandB.box(b.x0, BY - 0.02, b.z0, b.x1, BY + 0.06, b.z1, new THREE.Color(0.95, 0.88, 0.68), 6);
    for (let k = 0; k < 6; k++) this.trees.push({ x: rng.range(b.x0 + 4, b.x1 - 4), z: rng.range(b.z0 + 4, b.z1 - 4), s: rng.range(1, 1.5), palm: true });
    const tx = b.cx, tz = b.cz, legM = new THREE.Color(0x6b4a2b);
    const dg = new Builder();
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) dg.box(tx + sx * 1.4 - 0.15, BY, tz + sz * 1.4 - 0.15, tx + sx * 1.4 + 0.15, BY + 3, tz + sz * 1.4 + 0.15, legM);
    dg.box(tx - 1.8, BY + 3, tz - 1.8, tx + 1.8, BY + 4.6, tz + 1.8, new THREE.Color(0x3bd1ff));
    dg.box(tx - 2.1, BY + 4.6, tz - 2.1, tx + 2.1, BY + 4.9, tz + 2.1, new THREE.Color(0xf4f4f4));
    const m = new THREE.Mesh(dg.build(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 })); m.castShadow = true; this.group.add(m);
    this.addCollider(tx - 1.9, tz - 1.9, tx + 1.9, tz + 1.9, 'prop', BY + 5);
  }

  buildProps() {
    const rng = this.rng;
    // Lamp posts along drawn road segments every ~22m
    for (let k = 0; k <= N; k++) for (let m = 0; m < N; m++) {
      if (this.roadV[k][m]) for (let s = 12; s < PITCH - 12; s += 22) {
        const zc = this.roadCoords[m] + s, xc = this.roadCoords[k];
        this.lamps.push({ x: xc - 8.6, z: zc, rot: -Math.PI / 2 }, { x: xc + 8.6, z: zc, rot: Math.PI / 2 });
      }
      if (this.roadH[k][m]) for (let s = 12; s < PITCH - 12; s += 22) {
        this.lamps.push({ x: this.roadCoords[m] + s, z: this.roadCoords[k] - 8.6, rot: Math.PI }, { x: this.roadCoords[m] + s, z: this.roadCoords[k] + 8.6, rot: 0 });
      }
    }
    // Traffic light heads at drawn junctions, only for approaches that exist
    for (const { ix, iz } of this.junctions) {
      for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        if (!this.hasRoadSeg(ix, iz, dx, dz)) continue;
        const X = this.roadCoords[ix], Z = this.roadCoords[iz];
        const rx = -dz, rz = dx;
        const px = X + dx * 8.3 + rx * 8.3, pz = Z + dz * 8.3 + rz * 8.3;
        this.lightHeads.push({ x: px, z: pz, dx, dz, ix, iz, axis: dz !== 0 ? 'z' : 'x' });
      }
    }
    // Beach palms: dry land that has water nearby
    for (let k = 0; k < 500 && this.trees.filter(t => t.palm).length < 130; k++) {
      const x = rng.range(-1050, 1050), z = rng.range(-1050, 1050);
      if (waterAt(x, z) || this.onRoad(x, z) || this.blockAt(x, z)) continue;
      let near = false;
      for (const [ox, oz] of [[50, 0], [-50, 0], [0, 50], [0, -50]]) if (waterAt(x + ox, z + oz)) { near = true; break; }
      if (!near) continue;
      this.trees.push({ x, z, s: rng.range(0.9, 1.5), palm: true });
    }
    this.buildLampMeshes(); this.buildTreeMeshes(); this.buildRockMeshes(); this.buildTrafficLightMeshes(); this.buildStreetClutter(); this.buildBillboards();
  }

  buildBillboards() {
    // parody billboards beside arterials: posts + textured panel, map-flavoured ads
    const rng = this.rng;
    const edge = new THREE.MeshStandardMaterial({ color: 0x22262b, roughness: 0.7 });
    const seeds = MAPID === 'vice' ? [1, 1, 4, 1, 5] : MAPID === 'liberty' ? [2, 2, 5, 3, 2] : [3, 4, 5, 1, 3];
    let placed = 0, guard = 0;
    while (placed < 8 && guard++ < 120) {
      const { ix, iz } = this.junctions[(Math.random() * this.junctions.length) | 0];
      const X = this.roadCoords[ix], Z = this.roadCoords[iz];
      const x = X + rng.range(-1, 1) * 16, z = Z + rng.range(-1, 1) * 16;
      if (waterAt(x, z) || this.onRoad(x, z) || this.blockAt(x, z)) continue;
      if (this.hash.query(x - 4, x + 4, z - 4, z + 4, []).length) continue;
      const y = this.groundHeight(x, z);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 0.3),
        [edge, edge, edge, edge,
         new THREE.MeshBasicMaterial({ map: TX.makeBillboardTexture(seeds[placed % seeds.length]) }),
         new THREE.MeshBasicMaterial({ map: TX.makeBillboardTexture(seeds[(placed + 2) % seeds.length]) })]);
      panel.position.set(x, y + 5.5, z); panel.rotation.y = rng.range(0, 6.28); panel.castShadow = true; this.group.add(panel);
      for (const s of [-2.2, 2.2]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.5, 0.35), edge);
        post.position.set(x + Math.cos(panel.rotation.y) * s, y + 2.6, z - Math.sin(panel.rotation.y) * s);
        post.rotation.y = panel.rotation.y; this.group.add(post);
      }
      this.addCollider(x - 3.5, z - 3.5, x + 3.5, z + 3.5, 'prop', y + 7);
      placed++;
    }
  }

  buildLampMeshes() {
    const n = this.lamps.length; const dummy = new THREE.Object3D();
    const poleGeo = new THREE.CylinderGeometry(0.09, 0.13, 7, 8); poleGeo.translate(0, 3.5, 0);
    const armGeo = new THREE.BoxGeometry(0.12, 0.12, 2.2); armGeo.translate(0, 6.9, 1.0);
    const headGeo = new THREE.BoxGeometry(0.5, 0.18, 0.9); headGeo.translate(0, 6.85, 2.0);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x3b3f44, roughness: 0.6, metalness: 0.6 });
    this.lampHeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe2b0, emissiveIntensity: 0 });
    const pole = new THREE.InstancedMesh(mergeGeometries([poleGeo, armGeo]), poleMat, n); pole.castShadow = true;
    const head = new THREE.InstancedMesh(headGeo, this.lampHeadMat, n);
    const glowPos = [];
    this.lamps.forEach((l, i) => {
      const y = this.groundHeight(l.x, l.z);
      dummy.position.set(l.x, y, l.z); dummy.rotation.set(0, l.rot, 0); dummy.updateMatrix();
      pole.setMatrixAt(i, dummy.matrix); head.setMatrixAt(i, dummy.matrix);
      glowPos.push(l.x + Math.sin(l.rot) * 2.0, y + 6.7, l.z + Math.cos(l.rot) * 2.0);
      this.addCollider(l.x - 0.15, l.z - 0.15, l.x + 0.15, l.z + 0.15, 'pole', 7);
    });
    this.group.add(pole, head);
    const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(glowPos, 3));
    this.lampGlowMat = new THREE.PointsMaterial({ map: TX.makeParticleTexture(), color: 0xffd9a0, size: 6, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    this.lampGlow = new THREE.Points(gg, this.lampGlowMat); this.group.add(this.lampGlow);
    this.lampPositions = glowPos;
  }

  buildTreeMeshes() {
    const dummy = new THREE.Object3D();
    const allTrees = [...this.trees.filter(t => !t.palm), ...(this.forestTrees || [])];
    const palms = this.trees.filter(t => t.palm);
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.3, 2.6, 7); trunkGeo.translate(0, 1.3, 0);
    const canopy = mergeGeometries([
      new THREE.IcosahedronGeometry(1.9, 1).translate(0, 3.6, 0),
      new THREE.IcosahedronGeometry(1.4, 1).translate(1.0, 4.4, 0.4),
      new THREE.IcosahedronGeometry(1.3, 1).translate(-0.9, 4.3, -0.5),
    ]);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3f2a, roughness: 1 });
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x3f7a2e, roughness: 1, flatShading: true });
    const tm = new THREE.InstancedMesh(trunkGeo, trunkMat, allTrees.length); const cm = new THREE.InstancedMesh(canopy, canopyMat, allTrees.length);
    tm.castShadow = true; cm.castShadow = true; cm.receiveShadow = true;
    const col = new THREE.Color();
    allTrees.forEach((t, i) => {
      const y = this.groundHeight(t.x, t.z);
      dummy.position.set(t.x, y, t.z); dummy.rotation.set(0, this.rng() * 6.28, 0); dummy.scale.setScalar(t.s); dummy.updateMatrix();
      tm.setMatrixAt(i, dummy.matrix); cm.setMatrixAt(i, dummy.matrix);
      cm.setColorAt(i, col.setHSL(0.26 + this.rng() * 0.08, 0.5, 0.3 + this.rng() * 0.15));
      this.addCollider(t.x - 0.35, t.z - 0.35, t.x + 0.35, t.z + 0.35, 'tree', y + 3);
    });
    this.group.add(tm, cm);
    const ptrunk = new THREE.CylinderGeometry(0.14, 0.24, 6, 7); ptrunk.translate(0, 3, 0); ptrunk.rotateZ(0.12);
    const frondParts = [];
    for (let k = 0; k < 7; k++) {
      const f = new THREE.ConeGeometry(0.5, 3.2, 4); f.scale(1, 1, 0.25); f.translate(0, 1.4, 0); f.rotateX(-1.9); f.rotateY(k / 7 * 6.28); f.translate(0.7, 6.0, 0);
      frondParts.push(f);
    }
    const frond = mergeGeometries(frondParts);
    const pm = new THREE.InstancedMesh(ptrunk, new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 1 }), palms.length);
    const fm = new THREE.InstancedMesh(frond, new THREE.MeshStandardMaterial({ color: 0x3d8f3a, roughness: 1, side: THREE.DoubleSide }), palms.length);
    pm.castShadow = true; fm.castShadow = true;
    palms.forEach((t, i) => {
      const y = this.groundHeight(t.x, t.z);
      dummy.position.set(t.x, y, t.z); dummy.rotation.set(0, this.rng() * 6.28, 0); dummy.scale.setScalar(t.s); dummy.updateMatrix();
      pm.setMatrixAt(i, dummy.matrix); fm.setMatrixAt(i, dummy.matrix);
      this.addCollider(t.x - 0.3, t.z - 0.3, t.x + 0.3, t.z + 0.3, 'tree', y + 6);
    });
    this.group.add(pm, fm);
  }

  buildRockMeshes() {
    const dummy = new THREE.Object3D();
    const rocks = this.rocks || [], cacti = this.cacti || [];
    if (rocks.length) {
      const rg = new THREE.IcosahedronGeometry(1.2, 0);
      const rm = new THREE.InstancedMesh(rg, new THREE.MeshStandardMaterial({ color: 0x8a7f72, roughness: 1, flatShading: true }), rocks.length);
      rm.castShadow = true;
      rocks.forEach((t, i) => {
        const gy = this.groundHeight(t.x, t.z);
        dummy.position.set(t.x, gy, t.z); dummy.rotation.set(0, this.rng() * 6.28, 0); dummy.scale.set(t.s, t.s * 0.7, t.s); dummy.updateMatrix();
        rm.setMatrixAt(i, dummy.matrix);
        this.addCollider(t.x - 0.8, t.z - 0.8, t.x + 0.8, t.z + 0.8, 'prop', gy + 1.5);
      });
      this.group.add(rm);
    }
    if (cacti.length) {
      const cg = mergeGeometries([
        new THREE.CylinderGeometry(0.35, 0.4, 3.2, 8).translate(0, 1.6, 0),
        new THREE.CylinderGeometry(0.22, 0.24, 1.4, 7).translate(0.55, 1.9, 0),
        new THREE.CylinderGeometry(0.22, 0.24, 1.1, 7).translate(-0.5, 1.4, 0),
      ]);
      const cm = new THREE.InstancedMesh(cg, new THREE.MeshStandardMaterial({ color: 0x3d7a34, roughness: 1 }), cacti.length);
      cm.castShadow = true;
      cacti.forEach((t, i) => {
        const gy = this.groundHeight(t.x, t.z);
        dummy.position.set(t.x, gy, t.z); dummy.rotation.set(0, this.rng() * 6.28, 0); dummy.scale.setScalar(t.s); dummy.updateMatrix();
        cm.setMatrixAt(i, dummy.matrix);
        this.addCollider(t.x - 0.4, t.z - 0.4, t.x + 0.4, t.z + 0.4, 'prop', gy + 3);
      });
      this.group.add(cm);
    }
  }

  buildTrafficLightMeshes() {
    const heads = this.lightHeads; const dummy = new THREE.Object3D();
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.12, 5.5, 8); poleGeo.translate(0, 2.75, 0);
    const boxGeo = new THREE.BoxGeometry(0.4, 1.1, 0.4); boxGeo.translate(0, 4.6, 0);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2f3336, roughness: 0.7, metalness: 0.5 });
    const pm = new THREE.InstancedMesh(mergeGeometries([poleGeo, boxGeo]), poleMat, heads.length);
    const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8);
    this.bulbs = new THREE.InstancedMesh(bulbGeo, new THREE.MeshBasicMaterial({ toneMapped: false }), heads.length * 3);
    heads.forEach((h, i) => {
      const gy = this.groundHeight(h.x, h.z) + 0.15; // poles sit on decks too
      dummy.position.set(h.x, gy, h.z); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); pm.setMatrixAt(i, dummy.matrix);
      for (let k = 0; k < 3; k++) {
        dummy.position.set(h.x - h.dx * 0.22, gy + 4.95 - k * 0.33, h.z - h.dz * 0.22); dummy.updateMatrix();
        this.bulbs.setMatrixAt(i * 3 + k, dummy.matrix); this.bulbs.setColorAt(i * 3 + k, new THREE.Color(0x222222));
      }
      this.addCollider(h.x - 0.15, h.z - 0.15, h.x + 0.15, h.z + 0.15, 'pole', 5);
    });
    this.group.add(pm, this.bulbs);
    this._bulbColors = { red: new THREE.Color(2.5, 0.15, 0.1), yellow: new THREE.Color(2.5, 1.8, 0.2), green: new THREE.Color(0.2, 2.5, 0.6), off: new THREE.Color(0.08, 0.08, 0.08) };
  }

  buildStreetClutter() {
    const rng = this.rng; const dummy = new THREE.Object3D();
    const items = [];
    for (const b of this.blocks) {
      if (b.type === 'park' || b.type === 'lot' || b.type === 'airport' || b.type === 'stadium' || b.type === 'beach') continue;
      for (let k = 0; k < 4; k++) {
        const side = rng.int(0, 3); const t = rng.range(0.1, 0.9); const kind = rng.pick(['hydrant', 'bin', 'bench', 'bin']);
        let x, z, rot;
        if (side === 0) { x = b.x0 + t * (b.x1 - b.x0); z = b.z0 - 1.6; rot = Math.PI; }
        else if (side === 1) { x = b.x0 + t * (b.x1 - b.x0); z = b.z1 + 1.6; rot = 0; }
        else if (side === 2) { x = b.x0 - 1.6; z = b.z0 + t * (b.z1 - b.z0); rot = -Math.PI / 2; }
        else { x = b.x1 + 1.6; z = b.z0 + t * (b.z1 - b.z0); rot = Math.PI / 2; }
        items.push({ kind, x, z, rot });
      }
    }
    const make = (kind, geo, mat) => {
      const list = items.filter(i => i.kind === kind); if (!list.length) return;
      const im = new THREE.InstancedMesh(geo, mat, list.length); im.castShadow = true;
      list.forEach((it, i) => { const bb = this.blockAt(it.x, it.z); const yy = bb ? bb.hBase + CURB : CURB; dummy.position.set(it.x, yy, it.z); dummy.rotation.set(0, it.rot, 0); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); this.addCollider(it.x - 0.4, it.z - 0.4, it.x + 0.4, it.z + 0.4, 'prop', yy + 1); });
      this.group.add(im);
    };
    const hyd = mergeGeometries([new THREE.CylinderGeometry(0.16, 0.2, 0.8, 8).translate(0, 0.4, 0), new THREE.SphereGeometry(0.18, 8, 8).translate(0, 0.85, 0), new THREE.BoxGeometry(0.5, 0.12, 0.14).translate(0, 0.55, 0)]);
    make('hydrant', hyd, new THREE.MeshStandardMaterial({ color: 0xd8342a, roughness: 0.5, metalness: 0.3 }));
    make('bin', new THREE.CylinderGeometry(0.35, 0.3, 1.0, 10).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: 0x2f5d3a, roughness: 0.8 }));
    const bench = mergeGeometries([new THREE.BoxGeometry(1.8, 0.08, 0.5).translate(0, 0.45, 0), new THREE.BoxGeometry(1.8, 0.45, 0.08).translate(0, 0.72, -0.22), new THREE.BoxGeometry(0.08, 0.45, 0.5).translate(-0.8, 0.22, 0), new THREE.BoxGeometry(0.08, 0.45, 0.5).translate(0.8, 0.22, 0)]);
    make('bench', bench, new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: 0.9 }));
  }

  buildWater() {
    // mask texture from the land field (R = blurred land 0..1)
    const n = this.maskN, data = new Uint8Array(n * n * 4);
    for (let i = 0; i < n * n; i++) { const v = Math.max(0, Math.min(1, this.maskField[i])) * 255; data[i * 4] = v; data[i * 4 + 1] = v; data[i * 4 + 2] = v; data[i * 4 + 3] = 255; }
    const cv = document.createElement('canvas'); cv.width = cv.height = n;
    cv.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(data.buffer), n, n), 0, 0);
    const maskTex = new THREE.CanvasTexture(cv);
    // bright blue water: strong ripples + mirror-like sun/sky reflection.
    // Deep/shallow tint follows the city vibe: LA classic blue, NY steel-green, FL turquoise.
    const wc = MAPID === 'vice'
      ? { deep: 0x06407c, shallow: 0x14d0e0 }
      : MAPID === 'liberty'
        ? { deep: 0x0a2e3c, shallow: 0x2a7a8c }
        : { deep: 0x07307c, shallow: 0x0f9fe0 };
    this.waterUniforms = { uTime: { value: 0 }, uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uDeep: { value: new THREE.Color(wc.deep) }, uShallow: { value: new THREE.Color(wc.shallow) }, uSky: { value: new THREE.Color(0x9fd4ff) }, uFogColor: { value: new THREE.Color(0xbcd) }, uFogNear: { value: 200 }, uFogFar: { value: 900 }, uNight: { value: 0 }, uMask: { value: maskTex }, uNormalMap: { value: TX.makeWaterNormalTexture() }, uCaustic: { value: TX.makeCausticTexture() } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.waterUniforms, transparent: true,
      vertexShader: `uniform float uTime; varying vec3 vWorld; varying vec2 vMaskUv; varying float vCrest;
        void main(){ vec3 p = position;
          float w1 = sin(p.x*0.11+uTime*1.6)*0.12 + sin(p.z*0.13-uTime*1.2)*0.10 + sin((p.x+p.z)*0.07+uTime*0.8)*0.14;
          float w2 = sin(p.x*0.31-uTime*2.2)*0.03 + sin(p.z*0.27+uTime*1.9)*0.03;
          p.y += w1 + w2; vCrest = clamp((w1+w2)*2.2+0.5, 0.0, 1.0);
          vec4 wp = modelMatrix*vec4(p,1.0); vWorld = wp.xyz; vMaskUv = (wp.xz + 1250.0) / 2500.0; gl_Position = projectionMatrix*viewMatrix*wp; }`,
      fragmentShader: `uniform float uTime; uniform vec3 uSunDir, uDeep, uShallow, uSky, uFogColor; uniform float uFogNear, uFogFar, uNight; uniform sampler2D uMask, uNormalMap, uCaustic; varying vec3 vWorld; varying vec2 vMaskUv; varying float vCrest;
        void main(){ float m = texture2D(uMask, vMaskUv).r;
          // layered ripple normals: broad swell + tight chop, both scrolling
          float e = 0.6;
          vec2 p = vWorld.xz;
          float h0 = sin(p.x*0.35+uTime*2.0)*0.5 + sin(p.y*0.42-uTime*1.7)*0.5 + sin((p.x+p.y)*0.16+uTime*1.1)*0.8 + sin(p.x*0.9-uTime*2.6)*0.18 + sin(p.y*0.8+uTime*2.2)*0.18;
          float hx = sin((p.x+e)*0.35+uTime*2.0)*0.5 + sin(((p.x+e)+p.y)*0.16+uTime*1.1)*0.8 + sin((p.x+e)*0.9-uTime*2.6)*0.18;
          float hz = sin(p.x*0.35+uTime*2.0)*0.5 + sin((p.y+e)*0.42-uTime*1.7)*0.5 + sin((p.x+(p.y+e))*0.16+uTime*1.1)*0.8 + sin((p.y+e)*0.8+uTime*2.2)*0.18;
          vec3 n = normalize(vec3((h0-hx)*1.4, 1.0, (h0-hz)*1.4));
          // photo-style ripple detail: two scrolling normal samples break the
          // sun into crawling sparkle instead of smooth analytic bands
          vec3 nd1 = texture2D(uNormalMap, p * 0.010 + vec2(uTime * 0.008, uTime * 0.005)).rgb * 2.0 - 1.0;
          vec3 nd2 = texture2D(uNormalMap, p * 0.029 - vec2(uTime * 0.011, -uTime * 0.007)).rgb * 2.0 - 1.0;
          n = normalize(n + vec3(nd1.x + nd2.x, 0.0, nd1.y + nd2.y) * 0.38);
          vec3 v = normalize(cameraPosition - vWorld);
          float fres = pow(1.0 - max(dot(n, v), 0.0), 2.0);
          vec3 base = mix(uDeep, uShallow, smoothstep(0.0, 0.55, m));
          // crest lightening so wave tops read bright blue
          base = mix(base, vec3(0.25, 0.65, 1.0), vCrest*0.3);
          vec3 col = mix(base, uSky, fres*0.55);
          // sun mirror: tight hot core + narrow glitter + pinpoint sparkle from detail normals
          vec3 h = normalize(uSunDir + v);
          float spec = pow(max(dot(n,h),0.0), 320.0) * 2.2 * (1.0-uNight*0.8);
          float glitter = pow(max(dot(n,h),0.0), 90.0) * 0.3 * (1.0-uNight*0.8) * (0.4+0.6*vCrest);
          float sparkle = pow(max(dot(n,h),0.0), 900.0) * 1.6 * (1.0-uNight*0.8);
          col += vec3(1.0,0.96,0.88)*(spec+glitter) + vec3(1.0)*sparkle;
          // shallow caustic web: two counter-scrolled samples interfere and crawl
          float ca1 = texture2D(uCaustic, p * 0.020 + vec2(uTime * 0.010, uTime * 0.013)).r;
          float ca2 = texture2D(uCaustic, p * 0.016 - vec2(uTime * 0.012, uTime * 0.008)).r;
          float web = pow(clamp((1.0 - ca1) * (1.0 - ca2) * 2.4, 0.0, 1.0), 2.0);
          float shBand = smoothstep(0.30, 0.48, m) * (1.0 - smoothstep(0.55, 0.75, m));
          col += uShallow * web * shBand * 0.55 * (1.0 - uNight);
          float foam = smoothstep(0.32, 0.48, m) * (1.0 - smoothstep(0.48, 0.64, m)) * (0.5+0.5*sin((vWorld.x+vWorld.z)*0.25 - uTime*2.0)); col = mix(col, vec3(0.95), foam*0.6);
          col *= mix(1.0, 0.25, uNight);
          float fog = smoothstep(uFogNear, uFogFar, length(cameraPosition - vWorld)); col = mix(col, uFogColor, fog);
          gl_FragColor = vec4(col, 0.95); }`,
    });
    const geo = new THREE.PlaneGeometry(5000, 5000, 120, 120); geo.rotateX(-Math.PI / 2);
    this.water = new THREE.Mesh(geo, mat); this.water.position.y = -0.7; this.water.renderOrder = -1; this.group.add(this.water);
  }

  // minimap base painting (hud draws blips/player on top)
  mapLabels() { return SPEC.labels; }
  makeMinimap(S = 1024) {
    const R = 1250, w2p = (x) => (x + R) * (S / (2 * R));
    const c = document.createElement('canvas'); c.width = c.height = S; const ctx = c.getContext('2d');
    ctx.fillStyle = '#16323e'; ctx.fillRect(0, 0, S, S);
    const rect = (x0, z0, x1, z1, col) => { ctx.fillStyle = col; ctx.fillRect(w2p(x0), w2p(z0), w2p(x1) - w2p(x0), w2p(z1) - w2p(z0)); };
    rect(-1250, -1250, 1250, 1250, '#7fa66a'); // land base
    rect(-340, -980, 260, -380, '#c9a86a');    // desert sand
    rect(-340, -340, 180, 180, '#5d8a3c');     // farmland
    rect(-920, 300, -440, 660, '#3d6b32');     // forest
    // elevation tint over the land base: low green -> tan -> brown -> white,
    // sampled from the same heightfield physics uses (clipped to shore below)
    {
      const EN = 128, ec = document.createElement('canvas'); ec.width = ec.height = EN;
      const ex = ec.getContext('2d'), img = ex.createImageData(EN, EN);
      for (let a = 0; a < EN; a++) for (let bb = 0; bb < EN; bb++) {
        const x = (a / (EN - 1)) * 2 * R - R, z = (bb / (EN - 1)) * 2 * R - R;
        const h = terrainH(x, z);
        const o = (bb * EN + a) * 4;
        let cr = 0, cg = 0, cb = 0, ca = 0;
        if (h > 9) { cr = 232; cg = 232; cb = 226; ca = 140; }
        else if (h > 5) { cr = 138; cg = 106; cb = 74; ca = 128; }
        else if (h > 2) { cr = 176; cg = 154; cb = 106; ca = 115; }
        else if (h > 0.4) { cr = 138; cg = 154; cb = 90; ca = 90; }
        img.data[o] = cr; img.data[o + 1] = cg; img.data[o + 2] = cb; img.data[o + 3] = ca;
      }
      ex.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true; ctx.drawImage(ec, 0, 0, S, S);
    }
    // clip everything land-side to the true shoreline from the mask
    const n = this.maskN, img = ctx.createImageData(n, n);
    for (let i = 0; i < n * n; i++) { const v = this.maskField[i] > 0.45 ? 255 : 0; img.data[i * 4 + 3] = v; img.data[i * 4] = v; img.data[i * 4 + 1] = v; img.data[i * 4 + 2] = v; }
    const mc = document.createElement('canvas'); mc.width = mc.height = n; mc.getContext('2d').putImageData(img, 0, 0);
    ctx.save(); ctx.globalCompositeOperation = 'destination-in'; ctx.imageSmoothingEnabled = true; ctx.drawImage(mc, 0, 0, S, S); ctx.restore();
    const px = S / 2500;
    // city blocks
    ctx.fillStyle = '#cfcac0';
    for (const b of this.blocks) ctx.fillRect(w2p(b.x0), w2p(b.z0), (b.x1 - b.x0) * px, (b.z1 - b.z0) * px);
    // roads
    ctx.strokeStyle = '#e9e6dd'; ctx.lineWidth = Math.max(1, 14 * px);
    ctx.beginPath();
    for (let k = 0; k <= N; k++) for (let m = 0; m < N; m++) {
      if (this.roadV[k][m]) { ctx.moveTo(w2p(this.roadCoords[k]), w2p(this.roadCoords[m])); ctx.lineTo(w2p(this.roadCoords[k]), w2p(this.roadCoords[m + 1])); }
      if (this.roadH[k][m]) { ctx.moveTo(w2p(this.roadCoords[m]), w2p(this.roadCoords[k])); ctx.lineTo(w2p(this.roadCoords[m + 1]), w2p(this.roadCoords[k])); }
    }
    ctx.stroke();
    // bridges
    ctx.strokeStyle = '#c0392b'; ctx.lineWidth = Math.max(2, 16 * px); ctx.beginPath();
    for (const b of BRIDGES) {
      if (b.axis === 'x') { ctx.moveTo(w2p(b.from), w2p(b.c)); ctx.lineTo(w2p(b.to), w2p(b.c)); }
      else { ctx.moveTo(w2p(b.c), w2p(b.from)); ctx.lineTo(w2p(b.c), w2p(b.to)); }
    }
    ctx.stroke();
    // tunnels (dashed darker red)
    if (TUNNELS.length) {
      ctx.strokeStyle = '#7a2a20'; ctx.lineWidth = Math.max(2, 12 * px); ctx.setLineDash([6, 4]); ctx.beginPath();
      for (const t of TUNNELS) {
        if (t.axis === 'x') { ctx.moveTo(w2p(t.from), w2p(t.c)); ctx.lineTo(w2p(t.to), w2p(t.c)); }
        else { ctx.moveTo(w2p(t.c), w2p(t.from)); ctx.lineTo(w2p(t.c), w2p(t.to)); }
      }
      ctx.stroke(); ctx.setLineDash([]);
    }
    return c;
  }

  // ---------------- per-frame ----------------
  update(dt, time, night, env) {
    this.waterUniforms.uTime.value = time;
    if (env) { this.waterUniforms.uSunDir.value.copy(env.sunDir); this.waterUniforms.uFogColor.value.copy(env.fogColor); this.waterUniforms.uNight.value = night; this.waterUniforms.uSky.value.copy(env.skyColor); }
    if (this.facadeMats) for (const m of this.facadeMats) m.emissiveIntensity = night * 0.75;
    this.lampHeadMat.emissiveIntensity = night * 3; this.lampGlowMat.opacity = night * 0.7;
    if (this.neonMat) this.neonMat.opacity = 1;
    if (this.fountains) for (const f of this.fountains) f.children[1].rotation.y += dt * 0.3;
    if (this.spinners) for (const s of this.spinners) s.rotation.z += dt * 1.5;
    this._bulbT = (this._bulbT || 0) + dt;
    if (this._bulbT > 0.2) {
      this._bulbT = 0; const c = this._bulbColors;
      this.lightHeads.forEach((h, i) => {
        const st = this.lightState(h.ix, h.iz, h.axis, time);
        this.bulbs.setColorAt(i * 3, st === 'red' ? c.red : c.off);
        this.bulbs.setColorAt(i * 3 + 1, st === 'yellow' ? c.yellow : c.off);
        this.bulbs.setColorAt(i * 3 + 2, st === 'green' ? c.green : c.off);
      });
      this.bulbs.instanceColor.needsUpdate = true;
    }
  }
}
