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

const REGIONS = [
  { id: 'santos',   label: 'Santos',   x0: 15, z0: 15, nx: 9, nz: 9 },
  { id: 'ferro',    label: 'Ferro',    x0: 1,  z0: 8,  nx: 7, nz: 7 },
  { id: 'venturas', label: 'Venturas', x0: 16, z0: 1,  nx: 7, nz: 6 },
  { id: 'carson',   label: 'Bone County', x0: 10, z0: 3, nx: 2, nz: 2 },
];

const BRIDGES = [
  { axis: 'x', c: -240, from: -480, to: -240, red: false }, // bay bridge (Ferro <-> mainland)
  { axis: 'x', c: 320,  from: -480, to: -110, red: true },  // red bridge over the south bay
  { axis: 'z', c: 160,  from: -90,  to: 10,   red: false }, // river highway
  { axis: 'z', c: -80,  from: -90,  to: 10,   red: false }, // river rural
  { axis: 'z', c: 240,  from: -90,  to: 10,   red: false }, // river east
];
// road tunnels bored through Mount Chiliad (travelable: road level inside, lit, signed)
const TUNNELS = [
  { axis: 'x', c: 640, from: -1050, to: -310 },  // east-west bore
  { axis: 'z', c: -800, from: 310, to: 890 },   // north-south bore
];
const TUN_HALF = 13, TUN_TOP = 6.5;
const DECK_Y = 3;

// explicit highways (grid line k, segments m0..m1) through the countryside
const HIGH_V = [
  { k: 15, m0: 9, m1: 24 },   // x=160 farmland -> river -> Santos west edge
  { k: 16, m0: 2, m1: 14 },   // x=240 desert -> farmland
  { k: 12, m0: 9, m1: 14 },   // x=-80 farmland local
];
const HIGH_H = [
  { j: 10, m0: 7, m1: 12 },   // z=-240 bay bridge approaches, feeding the x=-80 highway
  { j: 17, m0: 2, m1: 15 },   // z=320 red bridge approaches (mountain cells auto-skip)
  { j: 18, m0: 2, m1: 15 },   // z=400 flint/forest scenic highway
  { j: 4,  m0: 1, m1: 10 },   // z=-720 tierra road
];

const ellipse = (x, z, cx, cz, rx, rz) => ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 < 1;
export function waterAt(x, z) {
  if ((Math.abs(x) / 1000) ** 4 + (Math.abs(z) / 1060) ** 4 > 1) return true; // ocean
  if (ellipse(x, z, -320, -160, 70, 300)) return true;   // Ferro bay narrows
  if (ellipse(x, z, -300, 380, 180, 180)) return true;   // south bay mouth
  if (ellipse(x, z, 1000, 350, 110, 200)) return true;   // docks basin
  if (z > -63 && z < -17 && x > -300 && x < 1150) return true; // river
  return false;
}
export function mountainH(x, z) {
  const dc = Math.hypot(x + 760, z - 640);
  if (dc >= 270) return 0;
  return 135 * Math.pow(Math.cos(dc / 270 * Math.PI / 2), 1.4);
}
function terrainH(x, z) {
  const mh = mountainH(x, z);
  if (mh > 6) return mh; // keep the cone smooth (no roads up it)
  let h = mh;
  if (x > -980 && x < -380 && z > -420 && z < 180) h += 1.8 + 1.5 * Math.sin(x * 0.011 + 1.3) * Math.cos(z * 0.013); // Ferro hills
  if (x > -340 && x < 260 && z > -980 && z < -380) h += 1.1 * Math.sin(x * 0.021 + 1) * Math.sin(z * 0.023 + 2);      // dunes
  if (h === 0) return 0;
  const rx = (((x + HALF) % PITCH) + PITCH) % PITCH, rz = (((z + HALF) % PITCH) + PITCH) % PITCH;
  const dRoad = Math.min(Math.min(rx, PITCH - rx), Math.min(rz, PITCH - rz));
  const f = Math.min(1, Math.max(0, (dRoad - 9) / 12)); // streets stay flat
  return h * f * f * (3 - 2 * f);
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

const PARK_BLOCKS = [[16, 17], [21, 19], [3, 12], [17, 4]];
const LOT_BLOCKS = [[17, 20], [20, 22], [5, 9], [20, 4]];

export class City {
  constructor(scene) {
    this.scene = scene;
    this.rng = makeRng(20260901);
    this.hash = new SpatialHash(24);
    this.roadCoords = []; for (let k = 0; k <= N; k++) this.roadCoords.push(-HALF + k * PITCH);
    this.blocks = []; this.blockMap = new Map(); this.lamps = []; this.trees = []; this.parkedSpots = []; this.lightHeads = [];
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
    return 'desert'; // carson
  }
  districtOf(i, j) {
    const r = this.regionAt(i, j);
    if (!r) {
      const x = -HALF + (i + 0.5) * PITCH, z = -HALF + (j + 0.5) * PITCH;
      if (mountainH(x, z) > 8) return 'Mount Chiliad';
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
    this.roadV = []; this.roadH = [];
    for (let k = 0; k <= N; k++) { this.roadV.push(new Array(N).fill(false)); this.roadH.push(new Array(N).fill(false)); }
    const cellHasBlock = (i, j) => this.regionAt(i, j) && !waterAt(-HALF + (i + 0.5) * PITCH, -HALF + (j + 0.5) * PITCH);
    const segWet = (x, z) => waterAt(x, z) || mountainH(x, z) > 4;
    for (let k = 0; k <= N; k++) for (let m = 0; m < N; m++) {
      // vertical segment: line k, between junctions m..m+1
      const mx = -HALF + k * PITCH, mz = -HALF + (m + 0.5) * PITCH;
      if (!segWet(mx, mz) && (cellHasBlock(k - 1, m) || cellHasBlock(k, m) || k % 3 === 0)) this.roadV[k][m] = true;
      const hx = -HALF + (m + 0.5) * PITCH, hz = -HALF + k * PITCH;
      if (!segWet(hx, hz) && (cellHasBlock(m, k - 1) || cellHasBlock(m, k) || k % 3 === 0)) this.roadH[k][m] = true;
    }
    for (const h of HIGH_V) for (let m = h.m0; m <= h.m1 && m < N; m++) {
      const mx = -HALF + h.k * PITCH, mz = -HALF + (m + 0.5) * PITCH;
      if (!segWet(mx, mz)) this.roadV[h.k][m] = true;
    }
    for (const h of HIGH_H) for (let m = h.m0; m <= h.m1 && m < N; m++) {
      const hx = -HALF + (m + 0.5) * PITCH, hz = -HALF + h.j * PITCH;
      if (!segWet(hx, hz)) this.roadH[h.j][m] = true;
    }
    // bridges ARE roads: force every grid segment under a deck into the mask so
    // traffic, missions and cops can actually route across the water.
    // Same for tunnel bores: the road inside the mountain is fully routable.
    const forceSpans = (list) => {
      for (const b of list) {
        if (b.axis === 'x') {
          const j = Math.round((b.c + HALF) / PITCH);
          if (j >= 0 && j <= N) for (let m = 0; m < N; m++) { const mid = -HALF + (m + 0.5) * PITCH; if (mid >= b.from - 1 && mid <= b.to + 1) this.roadH[j][m] = true; }
        } else {
          const k = Math.round((b.c + HALF) / PITCH);
          if (k >= 0 && k <= N) for (let m = 0; m < N; m++) { const mid = -HALF + (m + 0.5) * PITCH; if (mid >= b.from - 1 && mid <= b.to + 1) this.roadV[k][m] = true; }
        }
      }
    };
    forceSpans(BRIDGES); forceSpans(TUNNELS);
    // blocks (skip water cells)
    for (const r of REGIONS) for (let a = 0; a < r.nx; a++) for (let c = 0; c < r.nz; c++) {
      const i = r.x0 + a, j = r.z0 + c;
      const cx = -HALF + (i + 0.5) * PITCH, cz = -HALF + (j + 0.5) * PITCH;
      if (waterAt(cx, cz)) continue;
      const type = this.blockType(i, j);
      const x0 = this.roadCoords[i] + SIDEWALK_OUT, x1 = this.roadCoords[i + 1] - SIDEWALK_OUT;
      const z0 = this.roadCoords[j] + SIDEWALK_OUT, z1 = this.roadCoords[j + 1] - SIDEWALK_OUT;
      const b = { i, j, x0, x1, z0, z1, type, cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, district: this.districtOf(i, j), region: r.id, hoodGang: r.id === 'santos' && a >= 7, hBase: 0 };
      if (r.id === 'ferro') b.hBase = Math.max(0, terrainH(cx, cz));
      this.blocks.push(b); this.blockMap.set(i + ',' + j, b);
    }
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
    return (Math.abs(z - 640) <= TUN_HALF && x >= -1050 && x <= -310) ||
           (Math.abs(x + 800) <= TUN_HALF && z >= 310 && z <= 890);
  }
  groundHeight(x, z) {
    const ax = Math.abs(x), az = Math.abs(z); const m = Math.max(ax, az);
    if (m > 2500) return 0; // interiors zone
    const deck = this.onBridge(x, z); if (deck > 0) return deck;
    if (this.inTunnel(x, z)) return 0; // bored through the mountain at road level
    if (waterAt(x, z)) return -1.5;
    const b = this.blockAt(x, z);
    if (b) return b.hBase + CURB;
    return terrainH(x, z);
  }
  isWater(x, z) { const m = Math.max(Math.abs(x), Math.abs(z)); return waterAt(x, z) && this.onBridge(x, z) <= 0 && m < 2500; }
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
    // base dirt plane under everything
    const dirt = new THREE.Mesh(new THREE.PlaneGeometry(2600, 2600), new THREE.MeshStandardMaterial({ color: 0x6f7f52, roughness: 1 }));
    dirt.rotation.x = -Math.PI / 2; dirt.position.y = -0.06; dirt.receiveShadow = true; g.add(dirt);
    const slab = (x0, z0, x1, z1, color, y = -0.03) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshStandardMaterial({ color, roughness: 1 }));
      m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); m.receiveShadow = true; g.add(m);
    };
    slab(-340, -980, 260, -380, 0xc9a86a, -0.04);          // Bone County sand
    slab(-340, -340, 180, 180, 0x5d8a3c, -0.04);           // Red County fields base
    slab(-920, 300, -440, 660, 0x3d6b32, -0.04);           // Shady Creeks dark green
    slab(140, 140, 900, 900, 0x777d72, -0.045);            // Santos concrete base
    slab(-980, -420, -380, 180, 0x7a7f74, -0.045);         // Ferro concrete base
    slab(220, -980, 740, -420, 0x8a8578, -0.045);          // Venturas concrete base
    slab(140, 880, 900, 985, 0xd9c68f, -0.035);            // Santos beach sand
    // Seabed
    const bed = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.MeshStandardMaterial({ color: 0x26505a, roughness: 1 }));
    bed.rotation.x = -Math.PI / 2; bed.position.y = -3; g.add(bed);
    // Mount Chiliad cone + snow cap
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x6b6259, roughness: 1, flatShading: true });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(270, 135, 28, 6), rockMat);
    cone.position.set(-760, 135 / 2 - 2, 640); cone.castShadow = true; cone.receiveShadow = true; g.add(cone);
    const snow = new THREE.Mesh(new THREE.ConeGeometry(95, 48, 28, 1), new THREE.MeshStandardMaterial({ color: 0xe8eef2, roughness: 0.9, flatShading: true }));
    snow.position.set(-760, 135 - 2 - 24, 640); g.add(snow);
    // Chiliad collider (keep players/cars from clipping through; roughly matches the cone)
    this.addCollider(-950, 450, -570, 830, 'mountain', 40);
  }

  buildRoads() {
    const g = this.group;
    const roadTex = TX.makeRoadTexture(); const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.95, metalness: 0 });
    const interTex = TX.makeIntersectionTexture(); const interMat = new THREE.MeshStandardMaterial({ map: interTex, roughness: 0.95 });
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
    // bridges: decks over the water + railings + support pillars
    for (const b of BRIDGES) {
      const len = b.axis === 'x' ? b.to - b.from : b.to - b.from;
      const deckMat = new THREE.MeshStandardMaterial({ color: b.red ? 0x8a2a20 : 0x4a4d52, roughness: 0.9 });
      const deck = new THREE.Mesh(new THREE.BoxGeometry(b.axis === 'x' ? len : ASPHALT, 0.6, b.axis === 'x' ? ASPHALT : len), deckMat);
      deck.position.set(b.axis === 'x' ? (b.from + b.to) / 2 : b.c, DECK_Y - 0.3, b.axis === 'x' ? b.c : (b.from + b.to) / 2);
      deck.castShadow = true; deck.receiveShadow = true; g.add(deck);
      const railM = new THREE.MeshStandardMaterial({ color: b.red ? 0xc0392b : 0x8a8f94, roughness: 0.6, metalness: 0.4 });
      for (const s of [-1, 1]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(b.axis === 'x' ? len : 0.3, 1.1, b.axis === 'x' ? 0.3 : 1.1), railM);
        rail.position.set(
          b.axis === 'x' ? (b.from + b.to) / 2 : b.c + s * (HALF_ASPHALT - 0.2),
          DECK_Y + 0.55,
          b.axis === 'x' ? b.c + s * (HALF_ASPHALT - 0.2) : (b.from + b.to) / 2);
        rail.castShadow = true; g.add(rail);
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
    const fieldCols = [new THREE.Color(0x5d8a3c), new THREE.Color(0x9aa04c), new THREE.Color(0x4d7a34), new THREE.Color(0x8a7a3c)];
    // Red County crop checker (skip the river band)
    for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) {
      const x0 = -320 + a * 125, x1 = x0 + 121, z0 = -320 + c * 120, z1 = z0 + 116;
      if (z0 > -70 && z1 < -10) continue;
      B.boxTop(x0, 0.0, z0, x1, z1, fieldCols[(a + c) % 4], 14);
    }
    const wood = new THREE.Color(0x6b4a2b);
    const fence = (x0, z0, x1, z1) => {
      const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz), n = Math.floor(len / 6);
      for (let k = 0; k <= n; k++) { const x = x0 + dx * k / n, z = z0 + dz * k / n; B.box(x - 0.12, 0, z - 0.12, x + 0.12, 1.1, z + 0.12, wood); }
    };
    fence(-320, -320, 180, -320); fence(-320, 180, 180, 180); fence(-320, -320, -320, 180); fence(180, -320, 180, 180);
    // barns + silos + windmill
    const barnAt = (x, z, rot = 0) => {
      const red = new THREE.Color(0xa03028), trim = new THREE.Color(0xf0f0f0);
      B.box(x - 9, 0, z - 6, x + 9, 6, z + 6, red);
      B.box(x - 9.4, 6, z - 6.4, x + 9.4, 6.5, z + 6.4, trim);
      B.box(x - 1.2, 0, z + 5.8, x + 1.2, 4.2, z + 6.3, new THREE.Color(0x3a2a1a));
      this.addCollider(x - 9, z - 6, x + 9, z + 6, 'building', 7);
      void rot;
    };
    barnAt(-190, -190); barnAt(-40, 60); barnAt(60, -260);
    for (const [x, z] of [[-210, -190], [-22, 60]]) {
      const silo = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 12, 12), new THREE.MeshStandardMaterial({ color: 0xb9bec4, roughness: 0.4, metalness: 0.6 }));
      silo.position.set(x, 6, z); silo.castShadow = true; this.group.add(silo);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(3, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), silo.material);
      cap.position.set(x, 12, z); this.group.add(cap);
      this.addCollider(x - 3, z - 3, x + 3, z + 3, 'prop', 15);
    }
    { // windmill (spinning rotor)
      const mx = -140, mz = -120;
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.4, 16, 8), new THREE.MeshStandardMaterial({ color: 0x8a8f94, roughness: 0.6, metalness: 0.5 }));
      tower.position.set(mx, 8, mz); tower.castShadow = true; this.group.add(tower);
      const rotor = new THREE.Group(); rotor.position.set(mx, 15, mz + 1.2);
      for (let k = 0; k < 4; k++) {
        const bl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 0.08), tower.material);
        bl.position.y = 2.5; const holder = new THREE.Group(); holder.rotation.z = k * Math.PI / 2; holder.add(bl); rotor.add(holder);
      }
      this.group.add(rotor); (this.spinners ||= []).push(rotor);
      this.addCollider(mx - 1.5, mz - 1.5, mx + 1.5, mz + 1.5, 'prop', 16);
    }
    // forest cabins
    for (const [x, z] of [[-700, 420], [-560, 560]]) {
      B.box(x - 5, 0, z - 4, x + 5, 3.4, z + 4, new THREE.Color(0x5d4037));
      B.box(x - 5.4, 3.4, z - 4.4, x + 5.4, 4.6, z + 4.4, new THREE.Color(0x3a2e24));
      this.addCollider(x - 5, z - 4, x + 5, z + 4, 'building', 5);
    }
    // desert shacks
    for (const [x, z] of [[-160, -700], [-120, -580]]) {
      B.box(x - 4, 0, z - 3, x + 4, 3, z + 3, new THREE.Color(0xb09a72));
      this.addCollider(x - 4, z - 3, x + 4, z + 3, 'building', 3.5);
    }
    const bg = B.build(); if (bg) { const m = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })); m.castShadow = true; m.receiveShadow = true; this.group.add(m); }
    // cargo ship in the docks basin
    {
      const S = new Builder(), hull = new THREE.Color(0x2c3e50), rust = new THREE.Color(0x8a3a2a);
      const sx = 960, sz = 350;
      S.box(sx - 55, -1, sz - 9, sx + 55, 3, sz + 9, hull);
      S.box(sx + 40, 3, sz - 6, sx + 55, 8, sz + 6, rust);
      S.box(sx - 55, 3, sz - 4, sx - 38, 12, sz + 4, new THREE.Color(0xe8e8ea));
      for (let k = 0; k < 6; k++) S.box(sx - 30 + k * 11, 3, sz - 7, sx - 22 + k * 11, 8, sz + 7, new THREE.Color([0xc0392b, 0x2980b9, 0xf39c12, 0x27ae60][k % 4]));
      const sm = new THREE.Mesh(S.build(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 })); sm.castShadow = true; this.group.add(sm);
    }
    // rocks + cacti placement lists (meshes built in buildProps)
    for (let k = 0; k < 130; k++) {
      const x = rng.range(-320, 260), z = rng.range(-980, -380);
      if (waterAt(x, z) || this.onRoad(x, z)) continue;
      (rng.chance(0.45) ? (this.rocks ||= []) : (this.cacti ||= [])).push({ x, z, s: rng.range(0.7, 1.6) });
    }
    for (let k = 0; k < 60; k++) { // mountain boulders
      const a = rng.range(0, 6.28), r = rng.range(180, 265);
      const x = -760 + Math.cos(a) * r, z = 640 + Math.sin(a) * r;
      (this.rocks ||= []).push({ x, z, s: rng.range(1.2, 2.6) });
    }
    for (let k = 0; k < 700; k++) { // Shady Creeks forest
      const x = rng.range(-920, -440), z = rng.range(300, 660);
      if (waterAt(x, z) || mountainH(x, z) > 10 || this.onRoad(x, z)) continue;
      (this.forestTrees ||= []).push({ x, z, s: rng.range(0.9, 1.7) });
    }
    for (let k = 0; k < 120; k++) { // Chiliad slope pines
      const a = rng.range(0, 6.28), r = rng.range(120, 200);
      const x = -760 + Math.cos(a) * r, z = 640 + Math.sin(a) * r;
      this.trees.push({ x, z, s: rng.range(0.8, 1.3) });
    }
    for (let k = 0; k < 120; k++) { // scattered countryside trees
      const x = rng.range(-340, 200), z = rng.range(-340, 200);
      if (waterAt(x, z) || this.onRoad(x, z)) continue;
      if (this.blockAt(x, z)) continue;
      this.trees.push({ x, z, s: rng.range(0.8, 1.4) });
    }
  }

  buildBlocks() {
    const rng = this.rng;
    const styles = ['glass', 'concrete', 'brick', 'tower', 'house', 'industrial'];
    const builders = {}; for (const s of styles) builders[s] = new Builder();
    const roofB = new Builder(); const neonB = new Builder(); const detailB = new Builder();
    const grassB = new Builder();
    const roofC = new THREE.Color(0.55, 0.55, 0.55);
    const neonColors = [0xff2d95, 0x2df0ff, 0xffe12d, 0x7dff2d, 0xff6a2d, 0xb52dff].map(c => new THREE.Color(c));

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
      if (style !== 'house' && style !== 'industrial' && h > 10 && rng.chance(0.45)) {
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
      if (b.type === 'airport') { this.buildAirport(b, addBuilding, detailB); continue; }
      if (b.type === 'docks') { this.buildDocks(b, addBuilding, detailB); continue; }
      if (b.type === 'stadium') { this.buildStadium(b, detailB); continue; }
      if (b.type === 'beach') { this.buildBeach(b, grassB); continue; }
      if (b.type === 'downtown') {
        const tall = b.region === 'santos' ? [70, 140] : b.region === 'ferro' ? [30, 70] : [25, 60];
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
          addBuilding(b.x0 + a * lw + gap, b.z0 + c * lw + gap, b.x0 + (a + 1) * lw - gap, b.z0 + (c + 1) * lw - gap, h,
            rng.pick(['concrete', 'brick', 'brick', 'tower']), rng.pick([0xffffff, 0xf0e6d6, 0xd8d2c8, 0xe6e6ea, 0xf3d9c0]), BY);
        }
      } else if (b.type === 'residential') {
        const lots = 3, lw = w / lots;
        for (let a = 0; a < lots; a++) for (let c = 0; c < lots; c++) {
          const cx = b.x0 + (a + 0.5) * lw, cz = b.z0 + (c + 0.5) * lw;
          if (rng.chance(0.2)) { this.trees.push({ x: cx, z: cz, s: rng.range(0.9, 1.4) }); continue; }
          const hw = rng.range(5, 8), hd = rng.range(5, 8), h = rng.range(5, 9);
          addBuilding(cx - hw, cz - hd, cx + hw, cz + hd, h, 'house', rng.pick([0xffffff, 0xffe9c9, 0xd9f0e0, 0xf7d6d6, 0xe0e6ff, 0xfff4b0]), BY);
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
  }

  buildAirport(b, addBuilding, detailB) {
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
  buildBeach(b, grassB) {
    const rng = this.rng, BY = b.hBase + CURB;
    grassB.box(b.x0, BY - 0.02, b.z0, b.x1, BY + 0.06, b.z1, new THREE.Color(0.85, 0.78, 0.55), 6);
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
    this.buildLampMeshes(); this.buildTreeMeshes(); this.buildRockMeshes(); this.buildTrafficLightMeshes(); this.buildStreetClutter();
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
      this.addCollider(t.x - 0.35, t.z - 0.35, t.x + 0.35, t.z + 0.35, 'tree', 3);
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
      this.addCollider(t.x - 0.3, t.z - 0.3, t.x + 0.3, t.z + 0.3, 'tree', 6);
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
        dummy.position.set(t.x, this.groundHeight(t.x, t.z), t.z); dummy.rotation.set(0, this.rng() * 6.28, 0); dummy.scale.set(t.s, t.s * 0.7, t.s); dummy.updateMatrix();
        rm.setMatrixAt(i, dummy.matrix);
        this.addCollider(t.x - 0.8, t.z - 0.8, t.x + 0.8, t.z + 0.8, 'prop', 1.5);
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
        dummy.position.set(t.x, this.groundHeight(t.x, t.z), t.z); dummy.rotation.set(0, this.rng() * 6.28, 0); dummy.scale.setScalar(t.s); dummy.updateMatrix();
        cm.setMatrixAt(i, dummy.matrix);
        this.addCollider(t.x - 0.4, t.z - 0.4, t.x + 0.4, t.z + 0.4, 'prop', 3);
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
      list.forEach((it, i) => { dummy.position.set(it.x, CURB, it.z); dummy.rotation.set(0, it.rot, 0); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); this.addCollider(it.x - 0.4, it.z - 0.4, it.x + 0.4, it.z + 0.4, 'prop', 1); });
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
    this.waterUniforms = { uTime: { value: 0 }, uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uDeep: { value: new THREE.Color(0x0b3d5c) }, uShallow: { value: new THREE.Color(0x2fa3c4) }, uSky: { value: new THREE.Color(0x87b6e0) }, uFogColor: { value: new THREE.Color(0xbcd) }, uFogNear: { value: 200 }, uFogFar: { value: 900 }, uNight: { value: 0 }, uMask: { value: maskTex } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.waterUniforms, transparent: true,
      vertexShader: `uniform float uTime; varying vec3 vWorld; varying vec2 vMaskUv;
        void main(){ vec3 p = position; float w = sin(p.x*0.08+uTime*1.2)*0.25 + sin(p.z*0.11-uTime*0.9)*0.2 + sin((p.x+p.z)*0.05+uTime*0.6)*0.3; p.y += w;
          vec4 wp = modelMatrix*vec4(p,1.0); vWorld = wp.xyz; vMaskUv = (wp.xz + 1250.0) / 2500.0; gl_Position = projectionMatrix*viewMatrix*wp; }`,
      fragmentShader: `uniform float uTime; uniform vec3 uSunDir, uDeep, uShallow, uSky, uFogColor; uniform float uFogNear, uFogFar, uNight; uniform sampler2D uMask; varying vec3 vWorld; varying vec2 vMaskUv;
        void main(){ float m = texture2D(uMask, vMaskUv).r;
          vec3 n = normalize(vec3(cos(vWorld.x*0.3+uTime*2.0)*0.08 + cos(vWorld.z*0.7-uTime*1.3)*0.05, 1.0, sin(vWorld.z*0.35+uTime*1.7)*0.08));
          vec3 v = normalize(cameraPosition - vWorld); float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
          vec3 base = mix(uDeep, uShallow, smoothstep(0.0, 0.55, m)); vec3 col = mix(base, uSky, fres*0.7);
          vec3 h = normalize(uSunDir + v); float spec = pow(max(dot(n,h),0.0), 180.0) * (1.0-uNight*0.8); col += vec3(1.0,0.95,0.85)*spec*1.5;
          float foam = smoothstep(0.32, 0.48, m) * (1.0 - smoothstep(0.48, 0.64, m)) * (0.5+0.5*sin((vWorld.x+vWorld.z)*0.25 - uTime*2.0)); col = mix(col, vec3(0.9), foam*0.6);
          col *= mix(1.0, 0.18, uNight);
          float fog = smoothstep(uFogNear, uFogFar, length(cameraPosition - vWorld)); col = mix(col, uFogColor, fog);
          gl_FragColor = vec4(col, 0.92); }`,
    });
    const geo = new THREE.PlaneGeometry(5000, 5000, 120, 120); geo.rotateX(-Math.PI / 2);
    this.water = new THREE.Mesh(geo, mat); this.water.position.y = -0.7; this.water.renderOrder = -1; this.group.add(this.water);
  }

  // minimap base painting (hud draws blips/player on top)
  makeMinimap(S = 1024) {
    const R = 1250, w2p = (x) => (x + R) * (S / (2 * R));
    const c = document.createElement('canvas'); c.width = c.height = S; const ctx = c.getContext('2d');
    ctx.fillStyle = '#16323e'; ctx.fillRect(0, 0, S, S);
    const rect = (x0, z0, x1, z1, col) => { ctx.fillStyle = col; ctx.fillRect(w2p(x0), w2p(z0), w2p(x1) - w2p(x0), w2p(z1) - w2p(z0)); };
    rect(-1250, -1250, 1250, 1250, '#7fa66a'); // land base
    rect(-340, -980, 260, -380, '#c9a86a');    // desert sand
    rect(-340, -340, 180, 180, '#5d8a3c');     // farmland
    rect(-920, 300, -440, 660, '#3d6b32');     // forest
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
