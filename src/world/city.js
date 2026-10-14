/**
 * APEX GP — open world: Fable City.
 *
 * A procedural GTA-style city island placed WEST of the Vallonde circuit, built
 * from the same ideas as `fable-sandbox/gta_fable5.1` (grid road graph, district
 * blocks, merged static geometry, instanced props, lane-following ambient
 * traffic, phased traffic lights) but rewritten for this tree:
 *
 *   - ALL randomness comes from `rngFor('world/city/...')` (deterministic).
 *   - ALL surfaces reuse `textures/procedural.js` via the `assets` registry.
 *   - Repeated objects are InstancedMeshes; static geometry is merged per
 *     material, so the engine's world-chunker can split it like the circuit.
 *   - No network, no asset files, no Math.random.
 *
 * Layout (metres, +Y up, right-handed, same conventions as CONTRACT.md §0):
 *   7x7 blocks, 80 m pitch (60 m block + 20 m road corridor, 14 m asphalt).
 *   Centre (CX, CZ) = (-1250, 750): the island spans x -1530..-970,
 *   z 470..1030, ~490 m clear of the circuit's westernmost corner (-480),
 *   so race captures never see it up close — only as skyline in `wide`.
 *
 * PUBLIC API (additive, see CONTRACT.md §5):
 *   new OpenCity({ centre })
 *   city.build()           -> THREE.Group (engine adds it to the scene)
 *   city.update(dt, time)  // lamps/bulbs/traffic-light animation (render frame)
 *   city.stepTraffic(dt, time)   // fixed-step ambient traffic (sim frame)
 *   city.resetTraffic()    // re-seed traffic (capture determinism)
 *   city.groundHeight(x, z) -> y
 *   city.onRoad(x, z)      -> boolean
 *   city.inBounds(x, z)    -> boolean (inside the island skirt)
 *   city.gripAt(x, z)      -> 0..1 | null (null = not city ground, use circuit)
 *   city.collideCircle(x, z, r) -> { nx, nz, depth } | null
 *   city.queryBoxes(minX, maxX, minZ, maxZ, out)  // spatial-hash AABB query
 *   city.raycast(ox, oz, dx, dz, maxT, accept) -> { t, box }
 *   city.traffic               // lane entries {x,z,heading,kind,color,
 *                              // parked,hidden,kx,kz}; setTrafficMatrix(i)
 *   city.districtName(x, z) -> string
 *   city.spawnPoint()      -> { x, z, heading } (a street spawn for free roam)
 */

import * as THREE from 'three';
import { assets, mergeGeometries } from '../core/assets.js';
import { STREET_TYPES, VEHICLE_TYPES, profileGeometry, wheelGeos, sharedMats, paintMaps as streetcarPaintMaps } from './streetcar.js';
import {
  asphalt, concrete, grass,
  mapsToMaterial, cloneMaps, setRepeat,
} from '../textures/procedural.js';
import { rngFor } from '../core/rng.js';

// --- layout constants (ported from fable-sandbox config.js, rescaled 9->7) ---
export const CITY_BLOCKS = 7;
export const CITY_BLOCK = 60;
export const CITY_ROAD = 20;
export const CITY_ASPHALT = 14;
export const CITY_LANE = 3.5;
export const CITY_CURB = 0.15;
export const CITY_PITCH = CITY_BLOCK + CITY_ROAD;          // 80
export const CITY_HALF = (CITY_BLOCKS * CITY_PITCH) / 2;   // 280
export const CITY_CX = -1250;
export const CITY_CZ = 750;
export const CITY_LAND = CITY_HALF + 40;
export const STOP_DIST = 10.5;
export const LANE_OFF = (l) => CITY_LANE / 2 + CITY_LANE * l;

const HALF_ASPHALT = CITY_ASPHALT / 2;
const SIDEWALK_OUT = CITY_ROAD / 2;

/** Module scratch for raycast queries (never hold across calls). */
const _rayQ = [];

// --- small merged-geometry builder (winding: quads are CCW seen from outside,
// --- matching the (ring tangent) x (row) = outward rule in CONTRACT.md §5) ---
class Builder {
  constructor() {
    this.pos = []; this.nrm = []; this.uv = []; this.col = []; this.idx = []; this.n = 0;
  }
  quad(a, b, c, d, nx, ny, nz, uvs, color) {
    for (const p of [a, b, c, d]) {
      this.pos.push(p[0], p[1], p[2]); this.nrm.push(nx, ny, nz);
      this.col.push(color.r, color.g, color.b);
    }
    for (const u of uvs) this.uv.push(u[0], u[1]);
    const n = this.n;
    this.idx.push(n, n + 1, n + 2, n, n + 2, n + 3);
    this.n += 4;
  }
  boxSides(x0, y0, z0, x1, y1, z1, color, s = 12) {
    const w = x1 - x0, h = y1 - y0, d = z1 - z0;
    const uvS = (len, ht) => [[0, 0], [len / s, 0], [len / s, ht / s], [0, ht / s]];
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], 0, 0, 1, uvS(w, h), color);
    this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], 0, 0, -1, uvS(w, h), color);
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], 1, 0, 0, uvS(d, h), color);
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], -1, 0, 0, uvS(d, h), color);
  }
  boxTop(x0, y, z0, x1, z1, color, s = 4) {
    const w = x1 - x0, d = z1 - z0;
    this.quad([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], 0, 1, 0,
      [[0, 0], [w / s, 0], [w / s, d / s], [0, d / s]], color);
  }
  box(x0, y0, z0, x1, y1, z1, color, s = 12) {
    this.boxSides(x0, y0, z0, x1, y1, z1, color, s);
    this.boxTop(x0, y1, z0, x1, z1, color, s);
  }
  build(withColor = true) {
    if (this.n === 0) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (withColor) g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    return g;
  }
}

// --- districts (no beachfront: the island sits inland, west of the circuit) ---
const DISTRICTS = [
  { name: 'Downtown', test: (i, j) => Math.abs(i - 3) <= 1 && Math.abs(j - 3) <= 1 },
  { name: 'Ironworks', test: (i, j) => j === 0 },
  { name: 'Oakvale', test: (i, j) => i <= 1 },
  { name: 'Eastside', test: (i, j) => i >= 5 },
  { name: 'Midtown', test: () => true },
];
const PARK_BLOCKS = [[1, 4]];
const LOT_BLOCKS = [[5, 2]];

// --- facade textures: one 256px tile = 12x12 m, baked once into `assets` ---
// --- (fable-sandbox textures.js makeFacade, reseeded through rngFor) ---
function facadeMaps(style, seed) {
  return assets.get(`world/city/facade:${style}`, () => {
    const rng = rngFor(`world/city/facade/${style}/${seed}`);
    const S = 256, cols = 4, rows = 4;
    const c = document.createElement('canvas'); c.width = S; c.height = S;
    const ctx = c.getContext('2d');
    const e = document.createElement('canvas'); e.width = S; e.height = S;
    const ectx = e.getContext('2d');
    ectx.fillStyle = '#000'; ectx.fillRect(0, 0, S, S);
    // Roughness twin: walls stay rough, window glass goes smooth so the sky
    // catches in the panes (PBR rung for the building stock).
    const rc = document.createElement('canvas'); rc.width = S; rc.height = S;
    const rctx = rc.getContext('2d');
    rctx.fillStyle = '#d9d9d9'; rctx.fillRect(0, 0, S, S);
    const palettes = {
      glass: { wall: ['#44556a', '#3c4d60', '#4d6076'], win: ['#7fa6c8', '#6d94b8', '#93b6d4'], frame: '#1a2430', wx: 0.06, wy: 0.06, ww: 0.88, wh: 0.88 },
      concrete: { wall: ['#8a8378', '#9a9388', '#7d776d'], win: ['#2b3440', '#22303d', '#334252'], frame: '#4a463f', wx: 0.22, wy: 0.24, ww: 0.56, wh: 0.5 },
      brick: { wall: ['#7a4a3a', '#8a5545', '#6e4234'], win: ['#1f2a33', '#2a3540', '#1b252e'], frame: '#d8d0c0', wx: 0.25, wy: 0.2, ww: 0.5, wh: 0.55 },
      house: { wall: ['#d9c6a5', '#c8b08b', '#e2d3b8'], win: ['#243241', '#2c3c4c', '#1e2b38'], frame: '#f2efe8', wx: 0.3, wy: 0.28, ww: 0.4, wh: 0.44 },
      industrial: { wall: ['#6d7378', '#767c81', '#62686d'], win: ['#3a4650', '#31404a', '#42505a'], frame: '#40464b', wx: 0.15, wy: 0.4, ww: 0.7, wh: 0.25 },
    };
    const p = palettes[style] || palettes.concrete;
    const cw = S / cols, ch = S / rows;
    ctx.fillStyle = p.wall[0]; ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = rng.pick(p.wall); ctx.globalAlpha = 0.25;
      ctx.fillRect(rng() * S, rng() * S, rng() * 30, rng() * 8);
    }
    ctx.globalAlpha = 1;
    if (style === 'brick') {
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
      for (let y = 0; y < S; y += 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke(); }
    }
    for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {
      const x = col * cw + p.wx * cw, y = r * ch + p.wy * ch, w = p.ww * cw, h = p.wh * ch;
      ctx.fillStyle = p.frame; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
      const g = ctx.createLinearGradient(x, y, x + w, y + h);
      const wc = rng.pick(p.win);
      g.addColorStop(0, wc); g.addColorStop(1, '#0d141b');
      ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fillRect(x + w * 0.1, y, w * 0.18, h);
      rctx.fillStyle = '#3d3d3d'; rctx.fillRect(x, y, w, h);
      if (rng() < 0.45) {
        ectx.fillStyle = rng.pick(['#ffd9a0', '#ffe7c2', '#d8e6ff', '#fff2d6', '#ffcf80']);
        ectx.globalAlpha = 0.35 + rng() * 0.45;
        ectx.fillRect(x, y, w, h); ectx.globalAlpha = 1;
      }
    }
    const map = new THREE.CanvasTexture(c);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    const emissiveMap = new THREE.CanvasTexture(e);
    emissiveMap.wrapS = emissiveMap.wrapT = THREE.RepeatWrapping;
    emissiveMap.colorSpace = THREE.SRGBColorSpace;
    const roughnessMap = new THREE.CanvasTexture(rc);
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.colorSpace = THREE.NoColorSpace;
    return { map, emissiveMap, roughnessMap };
  });
}

const TRAFFIC_COLORS = [0xc0392b, 0x2980b9, 0xf39c12, 0x27ae60, 0x8e44ad, 0xecf0f1, 0x2c3e50, 0xd35400];

export class OpenCity {
  constructor(opts = {}) {
    this.cx = opts.centre?.[0] ?? CITY_CX;
    this.cz = opts.centre?.[1] ?? CITY_CZ;
    this.group = new THREE.Group();
    this.group.name = 'OpenCity';
    this.colliders = [];
    this.blocks = [];
    this.lamps = [];
    this.trees = [];
    this.lightHeads = [];
    this.traffic = [];
    this.trafficMesh = null; // back-compat: first per-kind mesh (tests/chunk guard)
    this.trafficMeshes = [];
    this.facadeMats = [];
    this.night = 0;
    this.trafficEnabled = true;
    this.roadCoords = [];
    for (let k = 0; k <= CITY_BLOCKS; k++) {
      this.roadCoords.push(this._origin() + k * CITY_PITCH);
    }
  }

  _origin() { return -CITY_HALF; } // local grid origin (city-local coords)
  toWorld(lx, lz) { return [this.cx + lx, this.cz + lz]; }
  toLocal(x, z) { return [x - this.cx, z - this.cz]; }

  // --- layout -------------------------------------------------------------
  blockType(i, j) {
    if (PARK_BLOCKS.some(([a, b]) => a === i && b === j)) return 'park';
    if (LOT_BLOCKS.some(([a, b]) => a === i && b === j)) return 'lot';
    if (Math.abs(i - 3) <= 1 && Math.abs(j - 3) <= 1) return 'downtown';
    if (j === 0) return 'industrial';
    if (i <= 1 || i >= 5 || j >= 5) return 'residential';
    return 'commercial';
  }
  districtName(x, z) {
    const [lx, lz] = this.toLocal(x, z);
    const i = Math.floor((lx + CITY_HALF) / CITY_PITCH);
    const j = Math.floor((lz + CITY_HALF) / CITY_PITCH);
    if (i < 0 || j < 0 || i >= CITY_BLOCKS || j >= CITY_BLOCKS) return 'The Outskirts';
    return DISTRICTS.find((d) => d.test(i, j)).name;
  }
  buildLayout() {
    for (let i = 0; i < CITY_BLOCKS; i++) for (let j = 0; j < CITY_BLOCKS; j++) {
      const x0 = this.roadCoords[i] + SIDEWALK_OUT, x1 = this.roadCoords[i + 1] - SIDEWALK_OUT;
      const z0 = this.roadCoords[j] + SIDEWALK_OUT, z1 = this.roadCoords[j + 1] - SIDEWALK_OUT;
      this.blocks.push({ i, j, x0, x1, z0, z1, type: this.blockType(i, j), cx: (x0 + x1) / 2, cz: (z0 + z1) / 2 });
    }
  }

  // --- ground queries (all in WORLD coords) --------------------------------
  inBounds(x, z) {
    const [lx, lz] = this.toLocal(x, z);
    return Math.abs(lx) < CITY_LAND && Math.abs(lz) < CITY_LAND;
  }
  onRoad(x, z) {
    const [lx, lz] = this.toLocal(x, z);
    if (Math.abs(lx) > CITY_HALF + HALF_ASPHALT || Math.abs(lz) > CITY_HALF + HALF_ASPHALT) return false;
    const fx = (((lx + CITY_HALF) % CITY_PITCH) + CITY_PITCH) % CITY_PITCH;
    const fz = (((lz + CITY_HALF) % CITY_PITCH) + CITY_PITCH) % CITY_PITCH;
    return fx <= HALF_ASPHALT || fx >= CITY_PITCH - HALF_ASPHALT
      || fz <= HALF_ASPHALT || fz >= CITY_PITCH - HALF_ASPHALT;
  }
  groundHeight(x, z) {
    if (!this.inBounds(x, z)) return 0;
    const [lx, lz] = this.toLocal(x, z);
    if (Math.abs(lx) < CITY_HALF && Math.abs(lz) < CITY_HALF) {
      const fx = (((lx + CITY_HALF) % CITY_PITCH) + CITY_PITCH) % CITY_PITCH;
      const fz = (((lz + CITY_HALF) % CITY_PITCH) + CITY_PITCH) % CITY_PITCH;
      if (fx > HALF_ASPHALT && fx < CITY_PITCH - HALF_ASPHALT
        && fz > HALF_ASPHALT && fz < CITY_PITCH - HALF_ASPHALT) return CITY_CURB;
    }
    return 0;
  }
  /** City surface grip. null = outside the island, leave it to circuit/weather. */
  gripAt(x, z) {
    if (!this.inBounds(x, z)) return null;
    if (this.onRoad(x, z)) return 1.0;
    return 0.72; // sidewalks, parks, parking lots: dusty street grip
  }
  addCollider(minX, minZ, maxX, maxZ, kind = 'building', maxY = 999) {
    const b = { minX, maxX, minZ, maxZ, kind, maxY, disabled: false };
    this.colliders.push(b);
    return b;
  }
  /** Push a circle (world x,z,r) out of every collider. Returns push or null. */
  collideCircle(x, z, r) {
    let px = 0, pz = 0, depth = 0;
    for (let n = 0; n < this.colliders.length; n++) {
      const b = this.colliders[n];
      if (b.disabled) continue;
      const cx = Math.max(b.minX, Math.min(x, b.maxX));
      const cz = Math.max(b.minZ, Math.min(z, b.maxZ));
      let dx = x - cx, dz = z - cz;
      let d = Math.hypot(dx, dz);
      if (d >= r) continue;
      if (d < 1e-6) {
        // Centre inside the box: push out along the smallest penetration axis.
        const ex = Math.min(x - b.minX, b.maxX - x);
        const ez = Math.min(z - b.minZ, b.maxZ - z);
        if (ex < ez) { dx = (x - b.minX < b.maxX - x) ? -1 : 1; dz = 0; }
        else { dx = 0; dz = (z - b.minZ < b.maxZ - z) ? -1 : 1; }
        d = 0;
      }
      const push = r - d;
      if (push > depth) {
        depth = push;
        const inv = 1 / (Math.hypot(dx, dz) || 1);
        px = dx * inv; pz = dz * inv;
      }
    }
    return depth > 0 ? { nx: px, nz: pz, depth } : null;
  }

  // --- spatial hash (OBB cars + camera boom raycasts; array scan is fine
  // --- for small radii, but a car queries ~7 m across 1400+ colliders) ---
  buildSpatialHash() {
    const cell = 24;
    this._hashCell = cell;
    this._hash = new Map();
    const key = (cx, cz) => cx * 73856093 ^ cz * 19349663;
    for (const b of this.colliders) {
      for (let cx = Math.floor(b.minX / cell); cx <= Math.floor(b.maxX / cell); cx++) {
        for (let cz = Math.floor(b.minZ / cell); cz <= Math.floor(b.maxZ / cell); cz++) {
          const k = key(cx, cz);
          let arr = this._hash.get(k);
          if (!arr) { arr = []; this._hash.set(k, arr); }
          arr.push(b);
        }
      }
    }
  }

  /** Fill `out` with non-disabled colliders overlapping the AABB. */
  queryBoxes(minX, maxX, minZ, maxZ, out) {
    out.length = 0;
    if (!this._hash) return out;
    const cell = this._hashCell;
    const key = (cx, cz) => cx * 73856093 ^ cz * 19349663;
    for (let cx = Math.floor(minX / cell); cx <= Math.floor(maxX / cell); cx++) {
      for (let cz = Math.floor(minZ / cell); cz <= Math.floor(maxZ / cell); cz++) {
        const arr = this._hash.get(key(cx, cz));
        if (!arr) continue;
        for (const b of arr) {
          if (!b.disabled && b.maxX >= minX && b.minX <= maxX
            && b.maxZ >= minZ && b.minZ <= maxZ && !out.includes(b)) out.push(b);
        }
      }
    }
    return out;
  }

  /** 2-D ray vs colliders. Returns { t, box } (t = Infinity on a miss). */
  raycast(ox, oz, dx, dz, maxT, accept) {
    const ex = ox + dx * maxT, ez = oz + dz * maxT;
    const found = this.queryBoxes(Math.min(ox, ex), Math.max(ox, ex),
      Math.min(oz, ez), Math.max(oz, ez), _rayQ);
    let best = Infinity, bestBox = null;
    for (const b of found) {
      let tmin = 0, tmax = maxT;
      if (Math.abs(dx) < 1e-9) { if (ox < b.minX || ox > b.maxX) continue; }
      else {
        let t1 = (b.minX - ox) / dx, t2 = (b.maxX - ox) / dx;
        if (t1 > t2) { const tt = t1; t1 = t2; t2 = tt; }
        tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
      }
      if (Math.abs(dz) < 1e-9) { if (oz < b.minZ || oz > b.maxZ) continue; }
      else {
        let t1 = (b.minZ - oz) / dz, t2 = (b.maxZ - oz) / dz;
        if (t1 > t2) { const tt = t1; t1 = t2; t2 = tt; }
        tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
      }
      if (tmax >= tmin && tmin < best && (!accept || accept(b, tmin))) { best = tmin; bestBox = b; }
    }
    return { t: best, box: bestBox };
  }
  lightState(ix, iz, axis, time) {
    const cycle = 16, offset = ((ix * 7 + iz * 3) % 4) * 4;
    const t = (time + offset) % cycle;
    const nsGreen = t < 8;
    const phaseT = nsGreen ? t : t - 8;
    const mine = axis === 'z' ? nsGreen : !nsGreen;
    if (!mine) return 'red';
    return phaseT > 6 ? 'yellow' : 'green';
  }
  /** A street spawn: main south-north avenue, heading north into Downtown. */
  spawnPoint() {
    const lx = this.roadCoords[3];
    const [x, z] = this.toWorld(lx + LANE_OFF(0), this.roadCoords[2] + 20);
    return { x, z, heading: Math.PI };
  }

  // --- build ----------------------------------------------------------------
  build() {
    this.buildLayout();
    this.buildGround();
    this.buildRoads();
    this.buildBlocks();
    this.buildProps();
    this.buildSpatialHash();
    this.resetTraffic();
    this.buildTrafficMesh();
    return this.group;
  }

  buildGround() {
    const g = this.group;
    const island = new THREE.Mesh(
      new THREE.PlaneGeometry(CITY_LAND * 2 + 8, CITY_LAND * 2 + 8),
      assets.material('world/city/ground', () => {
        const maps = cloneMaps(assets.get('world/city/grass', () => grass({ key: 'world/city/grass' })));
        setRepeat(maps, (CITY_LAND * 2) / maps.worldSize, (CITY_LAND * 2) / maps.worldSize);
        return new THREE.MeshStandardMaterial({ ...mapsToMaterial(maps), roughness: 1 });
      })
    );
    island.rotation.x = -Math.PI / 2;
    island.position.set(this.cx, -0.02, this.cz);
    island.receiveShadow = true;
    island.name = 'CityGround';
    g.add(island);
    // Outer skirt so the horizon between island and circuit is never void.
    const skirt = new THREE.Mesh(
      new THREE.PlaneGeometry(5000, 5000),
      assets.material('world/city/skirt', () => new THREE.MeshStandardMaterial({ color: 0x4a6b32, roughness: 1 }))
    );
    skirt.rotation.x = -Math.PI / 2;
    skirt.position.set(this.cx, -0.08, this.cz);
    skirt.receiveShadow = true;
    skirt.name = 'CitySkirt';
    g.add(skirt);
  }

  buildRoads() {
    const g = this.group;
    const roadMat = assets.material('world/city/road', () => {
      const maps = cloneMaps(assets.get('world/city/asphalt', () => asphalt({ wear: 0.6, key: 'world/city/asphalt' })));
      return new THREE.MeshStandardMaterial({ ...mapsToMaterial(maps), roughness: 0.95 });
    });
    const segs = [];
    const segLen = CITY_PITCH - CITY_ASPHALT;
    const w2m = assets.get('world/city/asphalt', () => asphalt({ wear: 0.6, key: 'world/city/asphalt' })).worldSize;
    for (let k = 0; k <= CITY_BLOCKS; k++) for (let m = 0; m < CITY_BLOCKS; m++) {
      let geo = new THREE.PlaneGeometry(CITY_ASPHALT, segLen);
      geo.rotateX(-Math.PI / 2);
      this._scaleUV(geo, CITY_ASPHALT / w2m, segLen / w2m);
      const [wx] = this.toWorld(this.roadCoords[k], 0);
      const [, wz] = this.toWorld(0, this.roadCoords[m] + CITY_PITCH / 2);
      geo.translate(wx, 0, wz);
      segs.push(geo);
      geo = new THREE.PlaneGeometry(CITY_ASPHALT, segLen);
      geo.rotateX(-Math.PI / 2); geo.rotateY(Math.PI / 2);
      this._scaleUV(geo, CITY_ASPHALT / w2m, segLen / w2m);
      const [hx] = this.toWorld(this.roadCoords[m] + CITY_PITCH / 2, 0);
      const [, hz] = this.toWorld(0, this.roadCoords[k]);
      geo.translate(hx, 0, hz);
      segs.push(geo);
    }
    const inters = [];
    for (let a = 0; a <= CITY_BLOCKS; a++) for (let b = 0; b <= CITY_BLOCKS; b++) {
      const geo = new THREE.PlaneGeometry(CITY_ASPHALT, CITY_ASPHALT);
      geo.rotateX(-Math.PI / 2);
      this._scaleUV(geo, CITY_ASPHALT / w2m, CITY_ASPHALT / w2m);
      const [wx, wz] = this.toWorld(this.roadCoords[a], this.roadCoords[b]);
      geo.translate(wx, 0.001, wz);
      inters.push(geo);
    }
    const roads = new THREE.Mesh(mergeGeometries(segs), roadMat);
    roads.receiveShadow = true;
    roads.name = 'CityRoads';
    g.add(roads);
    const im = new THREE.Mesh(mergeGeometries(inters), roadMat);
    im.receiveShadow = true;
    im.name = 'CityIntersections';
    g.add(im);
    // Painted centre dashes + edge lines, merged into one polygon-offset mesh.
    const markB = new Builder();
    const white = new THREE.Color(0.85, 0.85, 0.8);
    for (let k = 0; k <= CITY_BLOCKS; k++) for (let m = 0; m < CITY_BLOCKS; m++) {
      const z0 = this.roadCoords[m] + HALF_ASPHALT;
      const z1 = this.roadCoords[m + 1] - HALF_ASPHALT;
      for (let s = z0 + 2; s < z1 - 3; s += 6) {
        const [wx, wz] = this.toWorld(this.roadCoords[k], s);
        markB.boxTop(wx - 0.09, 0.02, wz, wx + 0.09, wz + 3, white, 1);
      }
      const x0 = this.roadCoords[m] + HALF_ASPHALT;
      const x1 = this.roadCoords[m + 1] - HALF_ASPHALT;
      for (let s = x0 + 2; s < x1 - 3; s += 6) {
        const [wx, wz] = this.toWorld(s, this.roadCoords[k]);
        markB.boxTop(wx, 0.02, wz - 0.09, wx + 3, wz + 0.09, white, 1);
      }
    }
    const markGeo = markB.build(false);
    if (markGeo) {
      const markMat = assets.material('world/city/markings', () => new THREE.MeshStandardMaterial({
        color: 0xd9d9d2, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2,
      }));
      const marks = new THREE.Mesh(markGeo, markMat);
      marks.receiveShadow = true;
      marks.name = 'CityMarkings';
      g.add(marks);
    }
    // Sidewalk slabs around every block.
    const swMat = assets.material('world/city/sidewalk', () => {
      const swMaps = cloneMaps(assets.get('world/city/sidewalk-tex', () => concrete({ stain: 0.4, key: 'world/city/sidewalk' })));
      return new THREE.MeshStandardMaterial({ ...mapsToMaterial(swMaps), vertexColors: true, roughness: 0.95 });
    });
    const sb = new Builder();
    const swWhite = new THREE.Color(1, 1, 1);
    for (const b of this.blocks) {
      const [x0, z0] = this.toWorld(b.x0 - 3, b.z0 - 3);
      const [x1, z1] = this.toWorld(b.x1 + 3, b.z1 + 3);
      sb.box(x0, -0.05, z0, x1, CITY_CURB, z1, swWhite, 4);
    }
    const swm = new THREE.Mesh(sb.build(), swMat);
    swm.receiveShadow = true;
    swm.name = 'CitySidewalks';
    g.add(swm);
  }

  _scaleUV(geo, su, sv) {
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  }

  buildBlocks() {
    const rng = rngFor('world/city/blocks');
    const styles = ['glass', 'concrete', 'brick', 'house', 'industrial'];
    const builders = {};
    for (const s of styles) builders[s] = new Builder();
    const roofB = new Builder();
    const neonB = new Builder();
    const detailB = new Builder();
    const grassB = new Builder();
    const roofC = new THREE.Color(0.55, 0.55, 0.55);
    // HDR neon: vertex colours above 1.0 so signs cross the bloom threshold
    // (linear scene-referred units, same as the F1 sun/flare treatment) and
    // glow at night instead of sitting flat in the frame.
    const neonColors = [0xff2d95, 0x2df0ff, 0xffe12d, 0x7dff2d, 0xff6a2d, 0xb52dff]
      .map((c) => new THREE.Color(c).multiplyScalar(2.2));

    const addBuilding = (lx0, lz0, lx1, lz1, h, style, tint) => {
      const c = new THREE.Color(tint);
      const [x0, z0] = this.toWorld(lx0, lz0);
      const [x1, z1] = this.toWorld(lx1, lz1);
      builders[style].boxSides(x0, CITY_CURB, z0, x1, CITY_CURB + h, z1, c, 12);
      roofB.boxTop(x0, CITY_CURB + h, z0, x1, z1, roofC.clone().multiplyScalar(rng.range(0.7, 1.2)), 4);
      const pw = 0.5;
      detailB.box(x0, CITY_CURB + h, z0, x1, CITY_CURB + h + 0.8, z0 + pw, c);
      detailB.box(x0, CITY_CURB + h, z1 - pw, x1, CITY_CURB + h + 0.8, z1, c);
      detailB.box(x0, CITY_CURB + h, z0, x0 + pw, CITY_CURB + h + 0.8, z1, c);
      detailB.box(x1 - pw, CITY_CURB + h, z0, x1, CITY_CURB + h + 0.8, z1, c);
      if (style !== 'house' && style !== 'industrial' && h > 10 && rng() < 0.45) {
        const nc = rng.pick(neonColors);
        const y = CITY_CURB + rng.range(4, Math.min(h - 2, 12));
        neonB.box(x0 + 1, y, z1, x1 - 1, y + 1.2, z1 + 0.2, nc);
      }
      this.addCollider(x0, z0, x1, z1, 'building', CITY_CURB + h);
    };

    for (const b of this.blocks) {
      const w = b.x1 - b.x0;
      if (b.type === 'park') { this.buildPark(b, grassB, rng); continue; }
      if (b.type === 'lot') { this.buildParkingLot(b, rng); continue; }
      if (b.type === 'downtown') {
        const m = rng.range(4, 8);
        const h = rng.range(60, 120);
        const style = rng.pick(['glass', 'glass', 'concrete']);
        const tint = rng.pick([0xffffff, 0xdfe8f0, 0xc8d6e0, 0xe8e0d0]);
        addBuilding(b.x0 + m, b.z0 + m, b.x1 - m, b.z1 - m, h * 0.55, style, tint);
        const m2 = m + rng.range(4, 8);
        addBuilding(b.x0 + m2, b.z0 + m2, b.x1 - m2, b.z1 - m2, h, style, tint);
      } else if (b.type === 'commercial') {
        const lots = 2, lw = w / lots;
        for (let a = 0; a < lots; a++) for (let cIdx = 0; cIdx < lots; cIdx++) {
          if (rng() < 0.12) {
            this.trees.push({ x: b.x0 + (a + 0.5) * lw, z: b.z0 + (cIdx + 0.5) * lw, s: rng.range(0.8, 1.2), local: true });
            continue;
          }
          const gap = rng.range(0.6, 2);
          addBuilding(b.x0 + a * lw + gap, b.z0 + cIdx * lw + gap,
            b.x0 + (a + 1) * lw - gap, b.z0 + (cIdx + 1) * lw - gap,
            rng.range(9, 32), rng.pick(['concrete', 'brick', 'brick']),
            rng.pick([0xffffff, 0xf0e6d6, 0xd8d2c8, 0xe6e6ea, 0xf3d9c0]));
        }
      } else if (b.type === 'residential') {
        const lots = 3, lw = w / lots;
        for (let a = 0; a < lots; a++) for (let cIdx = 0; cIdx < lots; cIdx++) {
          const cxL = b.x0 + (a + 0.5) * lw, czL = b.z0 + (cIdx + 0.5) * lw;
          if (rng() < 0.2) {
            this.trees.push({ x: cxL, z: czL, s: rng.range(0.9, 1.4), local: true });
            continue;
          }
          const hw = rng.range(5, 8), hd = rng.range(5, 8);
          addBuilding(cxL - hw, czL - hd, cxL + hw, czL + hd, rng.range(5, 9), 'house',
            rng.pick([0xffffff, 0xffe9c9, 0xd9f0e0, 0xf7d6d6, 0xe0e6ff, 0xfff4b0]));
        }
      } else if (b.type === 'industrial') {
        addBuilding(b.x0 + 2, b.z0 + 2, b.cx - 2, b.z1 - 2, rng.range(8, 14), 'industrial',
          rng.pick([0xffffff, 0xd0d8dc, 0xc9bfae]));
        addBuilding(b.cx + 2, b.z0 + 2, b.x1 - 2, b.z1 - 2, rng.range(8, 14), 'industrial',
          rng.pick([0xffffff, 0xd0d8dc, 0xc9bfae]));
        const [sxL, szL] = [b.x1 - 8, b.cz + 10];
        const [sx, sz] = this.toWorld(sxL, szL);
        detailB.box(sx - 1.2, CITY_CURB, sz - 1.2, sx + 1.2, CITY_CURB + 26, sz + 1.2, new THREE.Color(0x6b6b6b));
        this.addCollider(sx - 1.2, sz - 1.2, sx + 1.2, sz + 1.2, 'prop', 26);
      }
    }

    for (const s of styles) {
      const geo = builders[s].build();
      if (!geo) continue;
      const { map, emissiveMap, roughnessMap } = facadeMaps(s, 100 + styles.indexOf(s));
      const mat = assets.material(`world/city/facade-mat:${s}`, () => new THREE.MeshStandardMaterial({
        map, emissiveMap, emissive: 0xffffff, emissiveIntensity: 0,
        roughnessMap, vertexColors: true,
        roughness: s === 'glass' ? 0.35 : 0.85,
        metalness: s === 'glass' ? 0.5 : 0.0,
      }));
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.name = `CityFacade:${s}`;
      this.group.add(mesh);
      this.facadeMats.push(mat);
    }
    const rg = roofB.build();
    if (rg) {
      const m = new THREE.Mesh(rg, assets.material('world/city/roof', () => {
        const roofMaps = cloneMaps(assets.get('world/city/roof-tex', () => concrete({ stain: 0.7, key: 'world/city/roof' })));
        return new THREE.MeshStandardMaterial({
          ...mapsToMaterial(roofMaps), vertexColors: true, roughness: 1,
        });
      }));
      m.receiveShadow = true;
      m.name = 'CityRoofs';
      this.group.add(m);
    }
    const dg = detailB.build();
    if (dg) {
      const m = new THREE.Mesh(dg, assets.material('world/city/detail', () => new THREE.MeshStandardMaterial({
        vertexColors: true, roughness: 0.9,
      })));
      m.castShadow = true; m.receiveShadow = true;
      m.name = 'CityDetail';
      this.group.add(m);
    }
    const ng = neonB.build();
    if (ng) {
      this.neonMat = assets.material('world/city/neon', () => new THREE.MeshBasicMaterial({
        vertexColors: true, toneMapped: false,
      }));
      const m = new THREE.Mesh(ng, this.neonMat);
      m.name = 'CityNeon';
      this.group.add(m);
    }
    const gg = grassB.build();
    if (gg) {
      const m = new THREE.Mesh(gg, assets.material('world/city/park', () => {
        const gm = cloneMaps(assets.get('world/city/park-tex', () => grass({ key: 'world/city/park' })));
        return new THREE.MeshStandardMaterial({
          ...mapsToMaterial(gm), vertexColors: true, roughness: 1,
        });
      }));
      m.receiveShadow = true;
      m.name = 'CityPark';
      this.group.add(m);
    }
  }

  buildPark(b, grassB, rng) {
    const white = new THREE.Color(1, 1, 1);
    const [x0, z0] = this.toWorld(b.x0, b.z0);
    const [x1, z1] = this.toWorld(b.x1, b.z1);
    const [cx, cz] = this.toWorld(b.cx, b.cz);
    grassB.box(x0, CITY_CURB, z0, x1, CITY_CURB + 0.05, z1, white, 6);
    for (let k = 0; k < 18; k++) {
      const lx = rng.range(b.x0 + 3, b.x1 - 3), lz = rng.range(b.z0 + 3, b.z1 - 3);
      if (Math.hypot(lx - b.cx, lz - b.cz) < 9) continue;
      const [tx, tz] = this.toWorld(lx, lz);
      this.trees.push({ x: tx, z: tz, s: rng.range(0.9, 1.6) });
    }
    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5.4, 0.9, 20),
      assets.material('world/city/stone', () => new THREE.MeshStandardMaterial({ color: 0xbfb8aa, roughness: 0.8 }))
    );
    basin.position.set(cx, CITY_CURB + 0.45, cz);
    basin.castShadow = true;
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(4.6, 4.6, 0.2, 20),
      assets.material('world/city/fountain-water', () => new THREE.MeshStandardMaterial({
        color: 0x3aa0d8, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85,
      }))
    );
    water.position.set(cx, CITY_CURB + 0.85, cz);
    this.group.add(basin, water);
    this.addCollider(cx - 5.2, cz - 5.2, cx + 5.2, cz + 5.2, 'prop', 1);
  }

  buildParkingLot(b, rng) {
    const [cx, cz] = this.toWorld(b.cx, b.cz);
    const [x0, z0] = this.toWorld(b.x0, b.z0);
    const [x1] = this.toWorld(b.x1, 0);
    const lotMat = assets.material('world/city/lot', () => new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.95 }));
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.06, 46), lotMat);
    m.position.set(cx, CITY_CURB + 0.03, cz);
    m.receiveShadow = true;
    m.name = 'CityLot';
    this.group.add(m);
    this.lamps.push({ x: cx, z: cz, rot: 0, world: true });
  }

  buildProps() {
    const rng = rngFor('world/city/props');
    // Lamp posts along every road segment, both sides (~22 m spacing).
    for (let k = 0; k <= CITY_BLOCKS; k++) for (let m = 0; m < CITY_BLOCKS; m++) {
      for (let s = 12; s < CITY_PITCH - 12; s += 22) {
        const zc = this.roadCoords[m] + s, xc = this.roadCoords[k];
        const [ax, az] = this.toWorld(xc - 8.6, zc);
        const [bx, bz] = this.toWorld(xc + 8.6, zc);
        this.lamps.push({ x: ax, z: az, rot: -Math.PI / 2, world: true });
        this.lamps.push({ x: bx, z: bz, rot: Math.PI / 2, world: true });
        const [cx2, cz2] = this.toWorld(this.roadCoords[m] + s, this.roadCoords[k] - 8.6);
        const [dx2, dz2] = this.toWorld(this.roadCoords[m] + s, this.roadCoords[k] + 8.6);
        this.lamps.push({ x: cx2, z: cz2, rot: Math.PI, world: true });
        this.lamps.push({ x: dx2, z: dz2, rot: 0, world: true });
      }
    }
    // Traffic-light heads, one per approach at every intersection.
    for (let a = 0; a <= CITY_BLOCKS; a++) for (let b = 0; b <= CITY_BLOCKS; b++) {
      for (const [dx, dz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const rx = -dz, rz = dx;
        const [px, pz] = this.toWorld(
          this.roadCoords[a] + dx * 8.3 + rx * 8.3,
          this.roadCoords[b] + dz * 8.3 + rz * 8.3
        );
        this.lightHeads.push({ x: px, z: pz, dx, dz, ix: a, iz: b, axis: dz !== 0 ? 'z' : 'x' });
      }
    }
    // Street trees on commercial verges + greenery ring.
    for (let k = 0; k < 50; k++) {
      const side = Math.floor(rng() * 4);
      const t = rng.range(-CITY_HALF, CITY_HALF);
      const d = rng.range(CITY_HALF + 12, CITY_LAND - 12);
      const [lx, lz] = side === 0 ? [d, t] : side === 1 ? [-d, t] : side === 2 ? [t, d] : [t, -d];
      const [wx, wz] = this.toWorld(lx, lz);
      this.trees.push({ x: wx, z: wz, s: rng.range(0.9, 1.5) });
    }
    // Trees stored block-local (commercial) arrive with local coords — convert.
    for (const t of this.trees) {
      if (t.local) {
        const [wx, wz] = this.toWorld(t.x, t.z);
        t.x = wx; t.z = wz;
        delete t.local;
      }
    }
    this.buildLampMeshes();
    this.buildTreeMeshes(rng);
    this.buildTrafficLightMeshes();
    this.buildStreetClutter(rng);
  }

  buildLampMeshes() {
    const n = this.lamps.length;
    if (!n) return;
    const dummy = new THREE.Object3D();
    const poleGeo = new THREE.CylinderGeometry(0.09, 0.13, 7, 6);
    poleGeo.translate(0, 3.5, 0);
    const armGeo = new THREE.BoxGeometry(0.12, 0.12, 2.2);
    armGeo.translate(0, 6.9, 1.0);
    const headGeo = new THREE.BoxGeometry(0.5, 0.18, 0.9);
    headGeo.translate(0, 6.85, 2.0);
    const poleMat = assets.material('world/city/pole', () => new THREE.MeshStandardMaterial({
      color: 0x3b3f44, roughness: 0.6, metalness: 0.6,
    }));
    this.lampHeadMat = assets.material('world/city/lamp-head', () => new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffe2b0, emissiveIntensity: 0,
    }));
    const pole = new THREE.InstancedMesh(mergeGeometries([poleGeo, armGeo]), poleMat, n);
    pole.castShadow = true;
    pole.name = 'CityLamps';
    const head = new THREE.InstancedMesh(headGeo, this.lampHeadMat, n);
    head.name = 'CityLampHeads';
    this.lamps.forEach((l, i) => {
      dummy.position.set(l.x, 0, l.z);
      dummy.rotation.set(0, l.rot, 0);
      dummy.updateMatrix();
      pole.setMatrixAt(i, dummy.matrix);
      head.setMatrixAt(i, dummy.matrix);
      this.addCollider(l.x - 0.15, l.z - 0.15, l.x + 0.15, l.z + 0.15, 'pole', 7);
    });
    this.group.add(pole, head);
  }

  buildTreeMeshes(rng) {
    const trees = this.trees;
    if (!trees.length) return;
    const dummy = new THREE.Object3D();
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.3, 2.6, 6);
    trunkGeo.translate(0, 1.3, 0);
    const canopyGeo = new THREE.IcosahedronGeometry(1.9, 1);
    canopyGeo.translate(0, 3.6, 0);
    const trunkMat = assets.material('world/city/trunk', () => new THREE.MeshStandardMaterial({ color: 0x5a3f2a, roughness: 1 }));
    const canopyMat = assets.material('world/city/canopy', () => new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 1, flatShading: true,
    }));
    const tm = new THREE.InstancedMesh(trunkGeo, trunkMat, trees.length);
    const cm = new THREE.InstancedMesh(canopyGeo, canopyMat, trees.length);
    tm.castShadow = true; cm.castShadow = true; cm.receiveShadow = true;
    tm.name = 'CityTrunks'; cm.name = 'CityCanopies';
    const col = new THREE.Color();
    trees.forEach((t, i) => {
      dummy.position.set(t.x, 0, t.z);
      dummy.rotation.set(0, rng() * 6.28, 0);
      dummy.scale.setScalar(t.s);
      dummy.updateMatrix();
      tm.setMatrixAt(i, dummy.matrix);
      cm.setMatrixAt(i, dummy.matrix);
      cm.setColorAt(i, col.setHSL(0.26 + rng() * 0.08, 0.5, 0.3 + rng() * 0.15));
      this.addCollider(t.x - 0.35, t.z - 0.35, t.x + 0.35, t.z + 0.35, 'tree', 3);
    });
    this.group.add(tm, cm);
  }

  buildTrafficLightMeshes() {
    const heads = this.lightHeads;
    if (!heads.length) return;
    const dummy = new THREE.Object3D();
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.12, 5.5, 6);
    poleGeo.translate(0, 2.75, 0);
    const boxGeo = new THREE.BoxGeometry(0.4, 1.1, 0.4);
    boxGeo.translate(0, 4.6, 0);
    const pm = new THREE.InstancedMesh(
      mergeGeometries([poleGeo, boxGeo]),
      assets.material('world/city/signal-pole', () => new THREE.MeshStandardMaterial({
        color: 0x2f3336, roughness: 0.7, metalness: 0.5,
      })),
      heads.length
    );
    pm.name = 'CitySignalPoles';
    // Dynamic bulb colours: excluded from world chunking by name (see engine).
    this.bulbs = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({ toneMapped: false }),
      heads.length * 3
    );
    this.bulbs.name = 'CityDynamicBulbs';
    heads.forEach((h, i) => {
      dummy.position.set(h.x, 0.15, h.z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      pm.setMatrixAt(i, dummy.matrix);
      for (let k = 0; k < 3; k++) {
        dummy.position.set(h.x - h.dx * 0.22, 0.15 + 4.95 - k * 0.33, h.z - h.dz * 0.22);
        dummy.updateMatrix();
        this.bulbs.setMatrixAt(i * 3 + k, dummy.matrix);
        this.bulbs.setColorAt(i * 3 + k, new THREE.Color(0x222222));
      }
      this.addCollider(h.x - 0.15, h.z - 0.15, h.x + 0.15, h.z + 0.15, 'pole', 5);
    });
    this.group.add(pm, this.bulbs);
    this._bulbColors = {
      red: new THREE.Color(2.5, 0.15, 0.1),
      yellow: new THREE.Color(2.5, 1.8, 0.2),
      green: new THREE.Color(0.2, 2.5, 0.6),
      off: new THREE.Color(0.08, 0.08, 0.08),
    };
  }

  buildStreetClutter(rng) {
    const dummy = new THREE.Object3D();
    const items = [];
    for (const b of this.blocks) {
      if (b.type === 'park' || b.type === 'lot') continue;
      for (let k = 0; k < 3; k++) {
        const side = Math.floor(rng() * 4);
        const t = rng.range(0.1, 0.9);
        const kind = rng.pick(['hydrant', 'bin', 'bench', 'bin']);
        let lx, lz, rot;
        if (side === 0) { lx = b.x0 + t * (b.x1 - b.x0); lz = b.z0 - 1.6; rot = Math.PI; }
        else if (side === 1) { lx = b.x0 + t * (b.x1 - b.x0); lz = b.z1 + 1.6; rot = 0; }
        else if (side === 2) { lx = b.x0 - 1.6; lz = b.z0 + t * (b.z1 - b.z0); rot = -Math.PI / 2; }
        else { lx = b.x1 + 1.6; lz = b.z0 + t * (b.z1 - b.z0); rot = Math.PI / 2; }
        const [wx, wz] = this.toWorld(lx, lz);
        items.push({ kind, x: wx, z: wz, rot });
      }
    }
    const make = (kind, geo, matKey, matFactory) => {
      const list = items.filter((it) => it.kind === kind);
      if (!list.length) return;
      const im = new THREE.InstancedMesh(geo, assets.material(matKey, matFactory), list.length);
      im.castShadow = true;
      im.name = `CityClutter:${kind}`;
      list.forEach((it, i) => {
        dummy.position.set(it.x, CITY_CURB, it.z);
        dummy.rotation.set(0, it.rot, 0);
        dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix);
        this.addCollider(it.x - 0.4, it.z - 0.4, it.x + 0.4, it.z + 0.4, 'prop', 1);
      });
      this.group.add(im);
    };
    const hyd = mergeGeometries([
      new THREE.CylinderGeometry(0.16, 0.2, 0.8, 8).translate(0, 0.4, 0),
      new THREE.SphereGeometry(0.18, 8, 8).translate(0, 0.85, 0),
    ]);
    make('hydrant', hyd, 'world/city/hydrant',
      () => new THREE.MeshStandardMaterial({ color: 0xd8342a, roughness: 0.5, metalness: 0.3 }));
    make('bin', new THREE.CylinderGeometry(0.35, 0.3, 1.0, 10).translate(0, 0.5, 0),
      'world/city/bin', () => new THREE.MeshStandardMaterial({ color: 0x2f5d3a, roughness: 0.8 }));
    make('bench', new THREE.BoxGeometry(1.8, 0.08, 0.5).translate(0, 0.45, 0),
      'world/city/bench', () => new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: 0.9 }));
  }

  // --- ambient traffic -------------------------------------------------------
  // Lane-following background cars on the grid graph (ported from
  // fable-sandbox traffic.js, minus car-following: one car per lane slot).
  resetTraffic() {
    const rng = rngFor('world/city/traffic');
    this.traffic.length = 0;
    const N = 12;
    for (let i = 0; i < N; i++) {
      const vertical = rng() < 0.5;
      const k = 1 + Math.floor(rng() * (CITY_BLOCKS - 1));
      const dir = rng() < 0.5 ? 1 : -1;
      const lane = Math.floor(rng() * 2);
      const speed = rng.range(8, 13);
      const kind = rng.pick(STREET_TYPES);
      const type = VEHICLE_TYPES[kind] || VEHICLE_TYPES.sedan;
      this.traffic.push({
        vertical, k, dir, lane, speed,
        s: rng.range(-CITY_HALF, CITY_HALF),
        x: 0, z: 0, heading: 0,
        color: rng.pick(type.colors),
        kind,
        parked: false,  // left behind by the player; keeps its matrix, skips flow
        hidden: false,  // currently stolen: matrix sunk, skipped entirely
        meshKind: null, slot: -1, // traffic-mesh routing, assigned at build
        kx: 0, kz: 0, // knock-aside offset from player contact (decays)
      });
    }
  }
  buildTrafficMesh() {
    // One InstancedMesh per body type (paint / glass / wheels): real GTA
    // silhouettes for the whole flow at a handful of draw calls. Entries
    // remember their mesh + slot; parked entries keep their matrix, stolen
    // ones are sunk below the skirt.
    const shared = sharedMats();
    const paint = assets.material('world/city/traffic-paint', () => {
      const maps = streetcarPaintMaps(); // fresh clone, repeat set, shared upload
      return new THREE.MeshStandardMaterial({
        ...mapsToMaterial(maps), color: 0xffffff, roughness: 1.0, metalness: 1.0,
      });
    });
    const byKind = new Map();
    this.traffic.forEach((t) => {
      if (!byKind.has(t.kind)) byKind.set(t.kind, []);
      t.meshKind = t.kind;
      t.slot = byKind.get(t.kind).length;
      byKind.get(t.kind).push(t);
    });
    this.trafficMeshes = [];
    const col = new THREE.Color();
    for (const [kind, list] of byKind) {
      const type = VEHICLE_TYPES[kind] || VEHICLE_TYPES.sedan;
      const bodyGeo = profileGeometry(type, 'body', type.profile, type.wid, true);
      const cabinPts = [...type.cabin, [type.cabin[type.cabin.length - 1][0], type.cabin[0][1]]];
      const glassGeo = profileGeometry(type, 'cabin', cabinPts, type.wid + 0.04, false).clone();
      glassGeo.translate(0, 0.005, 0);
      const [tireGeo] = wheelGeos(type.wheelR);
      const wheelParts = [];
      const wb = type.len * 0.32;
      for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
        const w = tireGeo.clone();
        w.translate(sx * (type.wid / 2 - 0.12), type.wheelR, sz * wb);
        wheelParts.push(w);
      }
      const wheelGeo = mergeGeometries(wheelParts);
      const mk = (geo, material, shadow) => {
        const im = new THREE.InstancedMesh(geo, material, list.length);
        // Dynamic: excluded from world chunking by name (see engine CHUNK_PROTECT).
        im.name = `CityDynamicTraffic:${kind}`;
        im.castShadow = shadow;
        im.frustumCulled = false;
        this.group.add(im);
        this.trafficMeshes.push(im);
        return im;
      };
      const bm = mk(bodyGeo, paint, true);
      const gm = mk(glassGeo, shared.glass, false);
      const wm = mk(wheelGeo, shared.tire, false);
      const meshes = { body: bm, glass: gm, wheels: wm };
      list.forEach((t, si) => {
        bm.setColorAt(si, col.setHex(t.color));
        t.mesh = meshes;
      });
      bm.instanceColor.needsUpdate = true;
    }
    // Back-compat handle for the single-mesh era (chunking guard + tests).
    this.trafficMesh = this.trafficMeshes[0] ?? null;
    this._trafficDummy = new THREE.Object3D();
    this.stepTraffic(0, 0); // place cars on their lanes (dt = 0: no motion)
  }
  stepTraffic(dt, time) {
    if (!this.trafficEnabled || !this.traffic.length) return;
    const lim = CITY_HALF + 30;
    for (const t of this.traffic) {
      if (t.hidden || t.parked) continue;
      // Stop-line behaviour at red lights: find the next intersection ahead.
      const line = this.roadCoords[t.k];
      const ahead = [];
      for (let a = 0; a <= CITY_BLOCKS; a++) {
        const d = (this.roadCoords[a] - t.s) * t.dir;
        if (d > 0 && d < 60) ahead.push({ a, d });
      }
      ahead.sort((p, q) => p.d - q.d);
      let v = t.speed;
      if (ahead.length) {
        const inter = ahead[0];
        const st = t.vertical
          ? this.lightState(t.k, inter.a, 'z', time)
          : this.lightState(inter.a, t.k, 'x', time);
        if (st !== 'green' && inter.d < STOP_DIST + 6) {
          v = t.speed * Math.max(0, (inter.d - STOP_DIST) / 6);
        }
      }
      t.s += v * dt * t.dir;
      if (t.s > lim) t.s = -lim;
      if (t.s < -lim) t.s = lim;
      const off = (t.dir > 0 ? 1 : -1) * LANE_OFF(t.lane);
      const [wx, wz] = t.vertical
        ? this.toWorld(line + off, t.s)
        : this.toWorld(t.s, line + off);
      t.x = wx; t.z = wz;
      t.heading = t.vertical ? (t.dir > 0 ? 0 : Math.PI) : (t.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      // Knock-aside from player contact decays back onto the lane.
      const decay = Math.max(0, 1 - Math.min(1, dt * 1.8));
      t.kx *= decay; t.kz *= decay;
      t.x += t.kx; t.z += t.kz;
    }
    this.syncTrafficMesh();
  }
  syncTrafficMesh() {
    if (!this.trafficMeshes) return;
    const d = this._trafficDummy;
    for (const t of this.traffic) {
      const m = t.mesh;
      if (!m) continue;
      if (t.hidden) {
        // Sunk below the skirt: out of every frustum that matters.
        d.position.set(t.x, -50, t.z);
        d.rotation.set(0, 0, 0);
      } else if (t.parked) {
        continue; // matrix written once at park time
      } else {
        d.position.set(t.x, 0, t.z);
        d.rotation.set(0, t.heading, 0);
      }
      d.updateMatrix();
      m.body.setMatrixAt(t.slot, d.matrix);
      m.glass.setMatrixAt(t.slot, d.matrix);
      m.wheels.setMatrixAt(t.slot, d.matrix);
    }
    for (const im of this.trafficMeshes) im.instanceMatrix.needsUpdate = true;
  }

  /** Write one entry's matrix explicitly (parking a stolen car). */
  setTrafficMatrix(i) {
    const t = this.traffic[i];
    if (!t || !t.mesh) return;
    const d = this._trafficDummy;
    d.position.set(t.x, 0, t.z);
    d.rotation.set(0, t.heading, 0);
    d.updateMatrix();
    t.mesh.body.setMatrixAt(t.slot, d.matrix);
    t.mesh.glass.setMatrixAt(t.slot, d.matrix);
    t.mesh.wheels.setMatrixAt(t.slot, d.matrix);
    t.mesh.body.instanceMatrix.needsUpdate = true;
    t.mesh.glass.instanceMatrix.needsUpdate = true;
    t.mesh.wheels.instanceMatrix.needsUpdate = true;
  }

  // --- per-render-frame visuals ----------------------------------------------
  update(dt, time, night) {
    this.night = night;
    for (const m of this.facadeMats) m.emissiveIntensity = night * 0.8;
    if (this.lampHeadMat) this.lampHeadMat.emissiveIntensity = night * 3;
    this._bulbT = (this._bulbT || 0) + dt;
    if (this._bulbT > 0.2 && this.bulbs) {
      this._bulbT = 0;
      const c = this._bulbColors;
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
