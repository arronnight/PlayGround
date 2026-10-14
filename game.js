import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { pad, initPad } from './pad.js';
import { LEVELS } from './levels.js';
import { TX } from './textures.js';
import { initSky, setSky, skyFollows } from './sky.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createCoreDriver, driveCore, CORE_BEATS } from './motion.js';

// Core27 skate motion (vendored Genex motion set). Hard requirement for the
// rigged rider; without it the procedural capsule fallback stays up.
let MOTION = null;
try {
  MOTION = await fetch('./models/skate-motion.json').then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
} catch (e) { console.warn('skate motion set failed to load, procedural fallback', e); }

// SKATE Playground v2 — original mini engine, upgraded:
// real-ish physics (velocity vector, grip/drift, slope gravity, pump, ollie charge,
// flip timing, grind approach-angle + balance meter, impact/bail model) and an
// articulated rider + detailed board. No EA assets.
const app = document.getElementById('app');
const loader = document.getElementById('loader');
const loadmsg = document.getElementById('loadmsg');
const speedEl = document.getElementById('speed');
const scoreEl = document.getElementById('score');
const fpsEl = document.getElementById('fps');
const tricksEl = document.getElementById('tricks');
const msgEl = document.getElementById('msg');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  document.getElementById('nogl').style.display = 'flex';
  loader.classList.add('done');
  throw e;
}
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070d16);
scene.fog = new THREE.Fog(0x070d16, 55, 190);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 500);

const hemi = new THREE.HemisphereLight(0xbdd7ff, 0x6b6257, 0.9);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2dd, 2.1);
sun.position.set(-28, 42, 18);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -45; sun.shadow.camera.right = 45;
sun.shadow.camera.top = 45; sun.shadow.camera.bottom = -45;
sun.shadow.camera.far = 140; sun.shadow.bias = -0.0004;
scene.add(sun); scene.add(sun.target);
const rim = new THREE.DirectionalLight(0x4fb8ff, 0.8);
rim.position.set(24, 18, -30); scene.add(rim);
// Image-based lighting so metals/concrete respond like real surfaces.
try {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
} catch (e) { console.warn('environment failed', e); }
initSky(scene);

// ---------- ground ----------
function concreteTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#2b3540'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2200; i++) {
    g.fillStyle = `rgba(${180 + Math.random() * 40 | 0},${190 + Math.random() * 40 | 0},${200 + Math.random() * 40 | 0},${Math.random() * 0.05})`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  g.strokeStyle = 'rgba(160,200,220,0.16)'; g.lineWidth = 2;
  g.strokeRect(1, 1, 254, 254);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(30, 30);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const groundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(240, 240),
  new THREE.MeshStandardMaterial({ map: concreteTexture(), roughness: 0.95, metalness: 0.02 })
);
groundMesh.rotation.x = -Math.PI / 2; groundMesh.receiveShadow = true; scene.add(groundMesh);
{
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x3fc1ff, transparent: true, opacity: 0.35 });
  for (const x of [-12, 12]) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 120), lineMat);
    line.rotation.x = -Math.PI / 2; line.position.set(x, 0.01, -14); scene.add(line);
  }
}

// ---------- helpers ----------
const M = (c, r = 0.7, m = 0.05) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
// Active level content group. Box/cyl/rail builders below parent into it so a
// level switch can dispose the whole park in one remove().
let levelGroup = null;
function box(w, h, d, mat, x, y, z, shadow = true, parent) {
  const ms = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  ms.position.set(x, y, z); ms.castShadow = shadow; ms.receiveShadow = true;
  (parent || levelGroup || scene).add(ms); return ms;
}
function cyl(rt, rb, h, mat, x, y, z, seg = 14, parent) {
  const ms = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  ms.position.set(x, y, z); ms.castShadow = true; ms.receiveShadow = true;
  (parent || levelGroup || scene).add(ms); return ms;
}
function capsule(r, len, mat) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 3, 10), mat);
  m.castShadow = true; return m;
}

// ---------- park construction (per-level; see levels.js) ----------
const grindTargets = [];
const steel = M(0xc7d5de, 0.3, 0.85);
const darkSteel = M(0x39434d, 0.6, 0.4);
const woodMat = M(0x8a5a33, 0.85, 0.02);
const concreteMat = M(0x9aa7b2, 0.9, 0.02);
const accentMat = new THREE.MeshStandardMaterial({ color: 0x1f8fe0, roughness: 0.5, metalness: 0.2, emissive: 0x0a2a40, emissiveIntensity: 0.7 });
const SHARED_MATS = new Set([steel, darkSteel, woodMat, concreteMat, accentMat]);
function flatRail(x, z, len = 6.5, h = 0.62, label = '50-50', parent) {
  const g = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, len, 12), steel);
  bar.rotation.x = Math.PI / 2; bar.position.set(x, h, z); bar.castShadow = true; g.add(bar);
  for (const dz of [-len / 2 + 0.3, len / 2 - 0.3]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, h, 0.09), darkSteel);
    leg.position.set(x, h / 2, z + dz); leg.castShadow = true; g.add(leg);
  }
  (parent || levelGroup || scene).add(g);
  grindTargets.push({ axis: 'z', fixed: x, min: z - len / 2, max: z + len / 2, h: h + 0.05, label });
}
function flatRailX(x, z, len = 6.5, h = 0.62, label = '50-50', parent) {
  const g = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, len, 12), steel);
  bar.rotation.z = Math.PI / 2; bar.position.set(x, h, z); bar.castShadow = true; g.add(bar);
  for (const dx of [-len / 2 + 0.3, len / 2 - 0.3]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, h, 0.09), darkSteel);
    leg.position.set(x + dx, h / 2, z); leg.castShadow = true; g.add(leg);
  }
  (parent || levelGroup || scene).add(g);
  grindTargets.push({ axis: 'x', fixed: z, min: x - len / 2, max: x + len / 2, h: h + 0.05, label });
}
// Tilted slab ramp. (cx,cz) = footprint center; dir 'N' = high edge toward -z.
function slabRamp(cx, cz, w, rise, run, dir, mat, parent) {
  const L = Math.hypot(run, rise), ang = Math.atan2(rise, run);
  let mesh;
  if (dir === 'N' || dir === 'S') {
    mesh = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, L), mat);
    mesh.rotation.x = (dir === 'N' ? 1 : -1) * ang;
  } else {
    mesh = new THREE.Mesh(new THREE.BoxGeometry(L, 0.3, w), mat);
    mesh.rotation.z = (dir === 'E' ? 1 : -1) * ang;
  }
  mesh.position.set(cx, rise / 2 - 0.05, cz);
  mesh.castShadow = true; mesh.receiveShadow = true;
  (parent || levelGroup || scene).add(mesh); return mesh;
}
function quarterPipe(cx, cz, w, dir, parent, mat, axis = 'x') {
  // Transition spans 2*L along its run axis and rises to H at the lip, exactly
  // matching the qps profile in groundHeight (lip: x=cx-dir*L / z=cz-dir*L).
  const H = 3, L = 5;
  const prof = (t) => { const u = t > 0.5 ? (t - 0.5) / 0.5 : 0; return (1 - Math.cos(u * Math.PI / 2)) * H; };
  let mesh, cop;
  if (axis === 'z') {
    // run along world Z (width along X). local +Y maps to world -Z.
    const geo = new THREE.PlaneGeometry(w, 2 * L, 1, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const py = pos.getY(i);
      const t = dir > 0 ? (py + L) / (2 * L) : 1 - (py + L) / (2 * L);
      pos.setZ(i, prof(t) - H);
    }
    geo.computeVertexNormals();
    mesh = new THREE.Mesh(geo, mat || concreteMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(cx, H, cz); (parent || levelGroup || scene).add(mesh);
    cop = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, w, 10), steel);
    cop.rotation.z = Math.PI / 2; cop.position.set(cx, H + 0.02, cz + dir * -L); (parent || levelGroup || scene).add(cop);
  } else {
    // run along world X (width along Z). lip toward -x for dir +1.
    const geo = new THREE.PlaneGeometry(2 * L, w, 20, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const t = dir > 0 ? (L - px) / (2 * L) : (px + L) / (2 * L);
      pos.setZ(i, prof(t) - H);
    }
    geo.computeVertexNormals();
    mesh = new THREE.Mesh(geo, mat || concreteMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(cx, H, cz); (parent || levelGroup || scene).add(mesh);
    cop = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, w, 10), steel);
    cop.rotation.x = Math.PI / 2; cop.position.set(cx + dir * -L, H + 0.02, cz); (parent || levelGroup || scene).add(cop);
  }
  mesh.castShadow = true; mesh.receiveShadow = true;
  cop.castShadow = true;
  if (axis === 'z') grindTargets.push({ axis: 'x', fixed: cz + dir * -L, min: cx - w / 2, max: cx + w / 2, h: H + 0.06, label: 'ROCK' });
  else grindTargets.push({ axis: 'z', fixed: cx + dir * -L, min: cz - w / 2, max: cz + w / 2, h: H + 0.06, label: 'ROCK' });
  qps.push({ cx, cz, w, dir, H, L, axis });
}
// (Park construction moved to levels.js builders; runs on level pick.)

// ---------- solid colliders (walls you can slam into, not ride through) ----------
// Rideable tops are skipped when the rider is already up on them (y > top-0.25).
// Per-level contents; builders push entries, clearLevel() resets.
const SOLIDS = [];
// Rideable height data, per level. Flat tops, linear ramps (h0 at edge0 → h1
// at edge1 along axis), and quarterpipe bowls (same profile as the mesh).
const zones = [];
const ramps = [];
const qps = [];
const gaps = [];
let levelBounds = null; // {cx, cz, r} rideable disc; outside it you fall
let levelKillY = null;  // y below which the void respawns you
let levelHoles = null;  // [{x, z, r}] pits you fall straight through
// True when (x,z) is over the void: outside the island disc or inside a pit.
// Touchdowns are refused there so falls can't catch on the base ground plane.
function isVoid(x, z) {
  if (levelBounds) {
    const bx = x - levelBounds.cx, bz = z - levelBounds.cz;
    if (bx * bx + bz * bz > levelBounds.r * levelBounds.r) return true;
  }
  if (levelHoles) {
    for (const hh of levelHoles) {
      const hx = x - hh.x, hz = z - hh.z;
      if (hx * hx + hz * hz < hh.r * hh.r) return true;
    }
  }
  return false;
}
function collideSolids() {
  if (RAG.active) return;
  if (isVoid(P.pos.x, P.pos.z)) return; // falling into a pit / off the island: no walls in the void
  const r = 0.42, y = P.pos.y;
  for (const s of SOLIDS) {
    if (y > s.top - 0.25) continue;
    const cx = Math.max(s.x0, Math.min(P.pos.x, s.x1));
    const cz = Math.max(s.z0, Math.min(P.pos.z, s.z1));
    const dx = P.pos.x - cx, dz = P.pos.z - cz;
    const d = Math.hypot(dx, dz);
    if (d >= r) continue;
    let nx, nz;
    if (d > 1e-4) { nx = dx / d; nz = dz / d; }
    else {
      const pl = P.pos.x - s.x0, pr = s.x1 - P.pos.x;
      const pt = P.pos.z - s.z0, pb = s.z1 - P.pos.z;
      const m = Math.min(pl, pr, pt, pb);
      nx = m === pl ? -1 : m === pr ? 1 : 0;
      nz = m === pt ? -1 : m === pb ? 1 : 0;
    }
    P.pos.x = cx + nx * r; P.pos.z = cz + nz * r;
    const vn = P.vel.x * nx + P.vel.z * nz;
    if (vn < 0) {
      const impact = -vn;
      P.vel.x -= nx * vn; P.vel.z -= nz * vn; // slide along the wall
      P.vel.multiplyScalar(0.6);
      if (impact > 7) startRagdoll('SLAMMED!', impact);
      else if (impact > 3) { blip(70, 0.2, 'sine', 0.2); emitSpark(P.pos, 4); P.wobble = 1; }
    }
  }
}
function groundHeight(x, z) {
  let h = 0;
  for (const zn of zones) {
    if (x >= zn.x0 && x <= zn.x1 && z >= zn.z0 && z <= zn.z1 && zn.h > h) h = zn.h;
  }
  for (const r of ramps) {
    // Endpoints may be listed in either order; the gate uses min/max while
    // the interpolation keeps the original endpoint order.
    const rx0 = Math.min(r.x0, r.x1), rx1 = Math.max(r.x0, r.x1);
    const rz0 = Math.min(r.z0, r.z1), rz1 = Math.max(r.z0, r.z1);
    if (x >= rx0 && x <= rx1 && z >= rz0 && z <= rz1) {
      // Signed span (order matters: t=0 at edge0, t=1 at edge1).
      const sz = r.z1 - r.z0, sx = r.x1 - r.x0;
      const t = r.axis === 'z'
        ? (Math.abs(sz) < 1e-6 ? 0 : (z - r.z0) / sz)
        : (Math.abs(sx) < 1e-6 ? 0 : (x - r.x0) / sx);
      const rh = r.h0 + (r.h1 - r.h0) * THREE.MathUtils.clamp(t, 0, 1);
      if (rh > h) h = rh;
    }
  }
  for (const q of qps) {
    const L = q.L || 5;
    let t = -1;
    if ((q.axis || 'x') === 'z') {
      if (x < q.cx - q.w / 2 || x > q.cx + q.w / 2 || z < q.cz - L || z > q.cz + L) continue;
      t = q.dir > 0 ? (q.cz + L - z) / (2 * L) : (z - q.cz + L) / (2 * L);
    } else {
      if (z < q.cz - q.w / 2 || z > q.cz + q.w / 2 || x < q.cx - L || x > q.cx + L) continue;
      t = q.dir > 0 ? (q.cx + L - x) / (2 * L) : (x - q.cx + L) / (2 * L);
    }
    if (t > 0.5) {
      const u = (t - 0.5) / 0.5;
      const qh = (1 - Math.cos(u * Math.PI / 2)) * q.H;
      if (qh > h) h = qh;
    }
  }
  return h;
}
function groundNormal(x, z, out) {
  const e = 0.35;
  const hx = groundHeight(x + e, z) - groundHeight(x - e, z);
  const hz = groundHeight(x, z + e) - groundHeight(x, z - e);
  out.set(-hx / (2 * e), 1, -hz / (2 * e)).normalize();
  return out;
}

// ---------- articulated rider ----------
const skinM = M(0xd9a077, 0.65, 0), hoodieM = M(0x1fa7c9, 0.7, 0.03),
  pantsM = M(0x232b36, 0.85, 0), shoeM = M(0xe9e9e9, 0.75, 0),
  capM = M(0x10161d, 0.8, 0.05);
function joint(parent, x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; }
function limbSeg(r, len, mat) {
  const m = capsule(r, len, mat);
  m.position.y = -len / 2; // pivot at joint
  return m;
}

const rider = new THREE.Group(); scene.add(rider); // yaw = heading, origin at board center
const hips = joint(rider, 0, 0.98, 0);
{
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), pantsM);
  pelvis.scale.set(1.25, 0.8, 0.9); pelvis.castShadow = true; hips.add(pelvis);
}
const spine = joint(hips, 0, 0.1, 0);
{
  const belly = capsule(0.15, 0.22, hoodieM); spine.add(belly);
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.03), capM);
  pocket.position.set(0, -0.12, 0.14); spine.add(pocket);
}
const chest = joint(spine, 0, 0.34, 0);
{
  const c = capsule(0.165, 0.24, hoodieM); chest.add(c);
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.06),
    new THREE.MeshBasicMaterial({ color: 0x0b2a3a }));
  logo.position.set(0, 0.02, 0.165); chest.add(logo);
}
const neck = joint(chest, 0, 0.36, 0);
const headM = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 14), skinM);
headM.position.y = 0.16; headM.castShadow = true; neck.add(headM);
{
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.145, 14, 8, 0, Math.PI * 2, 0, 1.25), capM);
  cap.position.y = 0.19; neck.add(cap);
  const brim = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.16), capM);
  brim.position.set(0, 0.2, 0.2); brim.rotation.x = 0.12; neck.add(brim);
}
function buildArm(side) { // side -1 left, +1 right; shoulders across X (body faces +Z local? we ride sideways)
  const sh = joint(chest, side * 0.24, 0.26, 0);
  const up = limbSeg(0.062, 0.26, hoodieM); sh.add(up);
  const el = joint(sh, 0, -0.3, 0);
  const fo = limbSeg(0.052, 0.24, skinM); el.add(fo);
  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), skinM);
  hand.position.y = -0.3; hand.castShadow = true; el.add(hand);
  return { sh, el };
}
function buildLeg(side) {
  const hp = joint(hips, side * 0.11, -0.06, 0);
  const th = limbSeg(0.085, 0.34, pantsM); hp.add(th);
  const kn = joint(hp, 0, -0.44, 0);
  const sh2 = limbSeg(0.065, 0.34, pantsM); kn.add(sh2);
  const ft = joint(kn, 0, -0.42, 0);
  const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.3), shoeM);
  shoe.position.set(0, -0.045, 0.07); shoe.castShadow = true; ft.add(shoe);
  const lace = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.14), capM);
  lace.position.set(0, 0.005, 0.05); ft.add(lace);
  return { hp, kn, ft };
}
const armL = buildArm(-1), armR = buildArm(1);
const legFL = buildLeg(-1), legFR = buildLeg(1); // "front" foot = nose side (+Z local)

// ---------- detailed board ----------
// local axes: length along Z (nose +Z), width X, up Y
const boardG = new THREE.Group(); scene.add(boardG);
const boardTilt = new THREE.Group(); boardG.add(boardTilt); // flip/roll applied here
{
  const deckM = M(0x14181d, 0.55, 0.25);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.62), deckM);
  deck.castShadow = true; boardTilt.add(deck);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.215, 0.008, 0.6), M(0x0a0d11, 0.95, 0));
  grip.position.y = 0.019; boardTilt.add(grip);
  const graphic = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.006, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x3fc1ff, emissive: 0x0b3550, emissiveIntensity: 1.2, roughness: 0.4 }));
  graphic.position.y = -0.018; boardTilt.add(graphic);
  for (const s of [1, -1]) { // kicks
    const kick = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.028, 0.16), deckM);
    kick.position.set(0, 0.035, s * 0.38); kick.rotation.x = s * -0.5; kick.castShadow = true; boardTilt.add(kick);
  }
  const truckM = M(0xb9c4cd, 0.35, 0.9);
  for (const s of [1, -1]) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.12), truckM);
    base.position.set(0, -0.03, s * 0.26); boardTilt.add(base);
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.21, 8), truckM);
    axle.rotation.z = Math.PI / 2; axle.position.set(0, -0.055, s * 0.26); boardTilt.add(axle);
  }
}
const wheelM = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.45 });
const wheels = [];
for (const [x, z] of [[-0.1, 0.26], [0.1, 0.26], [-0.1, -0.26], [0.1, -0.26]]) {
  const w = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.026, 14), wheelM);
  w.rotation.z = Math.PI / 2; w.position.set(x, -0.062, z); w.castShadow = true;
  boardTilt.add(w); wheels.push(w);
}

// ---------- real skater model (Sketchfab "Skater with animation" by SpatialNeglect,
// CC BY-NC — see models/skater.glb.attribution.json). Procedural rider below stays
// as the instant fallback until this loads (or if it fails).
const rig = new THREE.Group(); rig.visible = false; scene.add(rig);
const rigLean = new THREE.Group(); rig.add(rigLean);
// Bones driven by the procedural layer (body chain + board, so the deck stays
// flat whenever the authored flip clip isn't playing).
const RIG_BONES = ['Root_human', 'pelvis_human', 'spine_01_human', 'spine_02_human', 'spine_03_human',
  'neck_01_human', 'head_human', 'clavicle_l_human', 'upperarm_l_human', 'lowerarm_l_human',
  'hand_l_human', 'clavicle_r_human', 'upperarm_r_human', 'lowerarm_r_human', 'hand_r_human',
  'thigh_l_human', 'calf_l_human', 'foot_l_human', 'ball_l_human',
  'thigh_r_human', 'calf_r_human', 'foot_r_human', 'ball_r_human',
  'Deck', 'wheel_back_right', 'wheel_back_left', 'wheel_front_right', 'wheel_front_left',
  'Truck_front', 'Truck_back', 'Empty', 'Empty001'];
const rigState = {
  ready: false, mixer: null, action: null, clipDur: 0,
  stanceT: 0.8, flipT0: 1.85, flipT1: 3.05, yawOffset: 0,
};
new GLTFLoader().load('./models/skater.glb',
  (gltf) => {
    try {
      const model = gltf.scene;
      // Bone map first: the Core27 driver captures true bind quats, so this
      // must run before any mixer update touches the bones.
      rigState.model = model;
      rigState.bones = {};
      for (const n of RIG_BONES) {
        const b = model.getObjectByName(n);
        if (b) rigState.bones[n] = b; else console.warn('rig bone missing:', n);
      }
      rigState.core = (MOTION && rigState.bones['pelvis_human']) ? createCoreDriver(MOTION, rigState.bones) : null;
      if (!rigState.core) console.warn('core motion driver unavailable, procedural fallback');
      rigState.pelvisBaseX = rigState.bones['pelvis_human'] ? rigState.bones['pelvis_human'].position.x : 0;
      const clip = gltf.animations[0].clone();
      // Strip the Take-01 body (the Core27 driver owns every body bone now).
      // Board, trucks, wheels and fingers keep their authored tracks.
      const BODY_NODES = new Set(['human_rootJoint', 'Root', 'Root_human',
        'pelvis_human', 'spine_01_human', 'spine_02_human', 'spine_03_human',
        'neck_01_human', 'head_human',
        'clavicle_l_human', 'clavicle_r_human', 'upperarm_l_human', 'upperarm_r_human',
        'lowerarm_l_human', 'lowerarm_r_human', 'hand_l_human', 'hand_r_human',
        'thigh_l_human', 'thigh_r_human', 'calf_l_human', 'calf_r_human',
        'foot_l_human', 'foot_r_human', 'ball_l_human', 'ball_r_human']);
      clip.tracks = clip.tracks.filter((tr) => {
        const dot = tr.name.indexOf('.');
        const node = dot < 0 ? tr.name : tr.name.slice(0, dot);
        return !BODY_NODES.has(node);
      });
      const mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(clip);
      action.timeScale = 0; action.play();
      mixer.update(0);
      model.updateMatrixWorld(true);
      const bbox = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3(); bbox.getSize(size);
      const s = 1.85 / Math.max(size.y, 0.001);
      model.scale.setScalar(s);
      model.updateMatrixWorld(true);
      const bbox2 = new THREE.Box3().setFromObject(model);
      model.position.y -= bbox2.min.y; // wheels rest on group origin
      model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
      rigLean.add(model);
      rigState.mixer = mixer; rigState.action = action; rigState.clipDur = clip.duration;
      // Internal skeleton view: ?skeleton=1 shows the bone hierarchy live.
      try {
        rigState.skel = new THREE.SkeletonHelper(model);
        rigState.skel.visible = /[?&]skeleton=1/.test(location.search);
        rigState.skel.frustumCulled = false;
        scene.add(rigState.skel);
      } catch (e) { console.warn('skeleton helper failed', e); }
      // Body pose library, sampled through the Core27 driver (absolute quats;
      // Root_human carries the only position sample — the rest stay bound).
      const samplePose = (clipName, tt) => {
        driveCore(rigState.core, clipName, tt);
        model.updateMatrixWorld(true);
        const p = {};
        for (const n in rigState.bones) {
          const b = rigState.bones[n];
          p[n] = { p: [b.position.x, b.position.y, b.position.z], q: [b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w] };
        }
        return p;
      };
      rigState.poses = {
        stance: samplePose(CORE_BEATS.stance.clip, CORE_BEATS.stance.t),
        crouch: samplePose(CORE_BEATS.crouch.clip, CORE_BEATS.crouch.t),
        launch: samplePose(CORE_BEATS.launch.clip, CORE_BEATS.launch.t),
        land: samplePose(CORE_BEATS.land.clip, CORE_BEATS.land.t),
      };
      // Learned-axis calibration: crouch−stance delta per key joint (for signs).
      rigState.axisSign = {};
      try {
        const _a = new THREE.Quaternion(), _b = new THREE.Quaternion(), _e = new THREE.Euler();
        for (const n of ['thigh_l_human', 'thigh_r_human', 'calf_l_human', 'calf_r_human', 'spine_01_human', 'spine_02_human', 'pelvis_human', 'upperarm_l_human', 'upperarm_r_human']) {
          const A = rigState.poses.stance[n], B = rigState.poses.crouch[n];
          if (!A || !B) continue;
          _a.set(A.q[0], A.q[1], A.q[2], A.q[3]);
          _b.set(B.q[0], B.q[1], B.q[2], B.q[3]);
          _a.invert().multiply(_b);
          _e.setFromQuaternion(_a);
          rigState.axisSign[n] = [_e.x, _e.y, _e.z];
        }
      } catch (e) { console.warn('axis calibration failed', e); }
      // Root placement comes from the Core27 driver itself (hips, relative to
      // each clip's first frame) — no table needed. See driveCore.
      // Fine lateral trim: with the stance placement applied, measure the
      // residual feet-vs-deck gap and cancel it, so the ankles sit exactly
      // over the deck center (back foot over tail, front over the bolts by
      // the clip's own longitudinal layout, which we don't touch).
      // NOTE: trim is applied to Root_human.position, whose parent chain may
      // carry its own scales — so the gap response is probed numerically
      // (shift + re-measure) instead of assumed 1:1.
      rigState.rootTrimX = 0;
      try {
        if (rigState.core) {
          const gapAt = () => {
            model.updateMatrixWorld(true);
            const _w = (n) => { const b = model.getObjectByName(n); const v = new THREE.Vector3(); b.getWorldPosition(v); return v; };
            const _dl = model.worldToLocal(_w('Deck').clone());
            const _fl = model.worldToLocal(_w('foot_l_human').clone());
            const _fr = model.worldToLocal(_w('foot_r_human').clone());
            return _dl.x - (_fl.x + _fr.x) / 2;
          };
          action.time = rigState.stanceT; mixer.update(0.0001); // board to stance
          rigState.core.trimX = 0;
          driveCore(rigState.core, CORE_BEATS.stance.clip, CORE_BEATS.stance.t);
          const gap0 = gapAt();
          rigState.core.trimX = 0.05;
          driveCore(rigState.core, CORE_BEATS.stance.clip, CORE_BEATS.stance.t);
          const gap1 = gapAt();
          rigState.core.trimX = 0;
          const R = (gap1 - gap0) / 0.05;
          if (isFinite(R) && Math.abs(R) > 1e-3) rigState.core.trimX = -gap0 / R;
          action.time = rigState.stanceT;
        }
      } catch (e) { console.warn('root trim failed', e); }
      // Flat deck reference for board styling (Take-01 board at stance).
      rigState.deckFlat = null;
      try {
        action.time = rigState.stanceT; mixer.update(0.0001);
        const db = rigState.bones['Deck'];
        if (db) rigState.deckFlat = db.quaternion.clone();
      } catch (e) { console.warn('deck flat capture failed', e); }
      // Deck local-axis calibration: longest bbox dimension of the deck mesh
      // is the board's long axis; lateral = up × long. Board style offsets
      // (slides, 5-0/nose, manuals, tweaks) rotate about these, so they stay
      // correct whatever the authored orientation is.
      rigState.deckLat = new THREE.Vector3(0, 0, 1);
      try {
        const dm = model.getObjectByName('Deck_0');
        if (dm && dm.geometry) {
          dm.geometry.computeBoundingBox();
          const sz = new THREE.Vector3(); dm.geometry.boundingBox.getSize(sz);
          const long = sz.x >= sz.y && sz.x >= sz.z ? new THREE.Vector3(1, 0, 0)
            : sz.z >= sz.x && sz.z >= sz.y ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
          const lat = new THREE.Vector3(0, 1, 0).cross(long);
          if (lat.lengthSq() > 1e-6) rigState.deckLat.copy(lat.normalize());
        }
      } catch (e) { console.warn('deck calibration failed', e); }
      // Leg IK refs: bone lengths (world, rigid), deck-local stance foot
      // points (so feet follow the board through slides/manuals/air), and
      // which foot is back (tail-side = the push foot).
      rigState.leg = null;
      try {
        if (!rigState.core) throw new Error('no core driver');
        action.time = rigState.stanceT; mixer.update(0.0001); // board to stance
        driveCore(rigState.core, CORE_BEATS.stance.clip, CORE_BEATS.stance.t);
        model.updateMatrixWorld(true);
        const JW = (n) => { const b = model.getObjectByName(n); const v = new THREE.Vector3(); b.getWorldPosition(v); return v; };
        const dk = model.getObjectByName('Deck');
        const leg = { a: {}, b: {}, footDeck: {}, back: 'l', front: 'r', shiftSign: 1, outSign: 1, smBack: null, pushLean: 0, ikBlend: 1 };
        for (const s of ['l', 'r']) {
          const T = JW('thigh_' + s + '_human'), K = JW('calf_' + s + '_human'), F = JW('foot_' + s + '_human');
          leg.a[s] = T.distanceTo(K); leg.b[s] = K.distanceTo(F);
          leg.footDeck[s] = dk.worldToLocal(F.clone());
        }
        const tail = JW('Truck_back'), nose = JW('Truck_front');
        const ax = nose.sub(tail); ax.y = 0; ax.normalize();
        const sL = JW('foot_l_human').sub(JW('Truck_back')).dot(ax);
        const sR = JW('foot_r_human').sub(JW('Truck_back')).dot(ax);
        leg.back = sL <= sR ? 'l' : 'r'; leg.front = leg.back === 'l' ? 'r' : 'l';
        const pm = model.worldToLocal(JW('pelvis_human').clone());
        const fm = model.worldToLocal(JW('foot_' + leg.front + '_human').clone());
        leg.shiftSign = Math.sign(fm.x - pm.x) || 1;
        rigState.leg = leg;
      } catch (e) { console.warn('leg IK refs failed', e); }
      action.time = rigState.stanceT;
      rigState.ready = true;
      rider.visible = false; boardG.visible = false; rig.visible = true;
      flash('PRO RIDER ✔');
    } catch (err) { console.warn('rig setup failed, procedural fallback', err); }
  },
  (xhr) => { if (xhr.total && !rigState.ready) loadmsg.textContent = `loading rider ${Math.round(xhr.loaded / xhr.total * 100)}%…`; },
  () => { console.warn('rider model failed to load, procedural fallback'); }
);

// ---------- sparks ----------
const sparkN = 140;
const sparkPos = new Float32Array(sparkN * 3);
const sparkVel = new Float32Array(sparkN * 3);
const sparkGeo = new THREE.BufferGeometry();
sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xffd08a, size: 0.09, transparent: true, opacity: 0.95 }));
sparks.frustumCulled = false; scene.add(sparks);
let sparkI = 0;
function emitSpark(p, n = 4) {
  for (let k = 0; k < n; k++) {
    const i = sparkI = (sparkI + 1) % sparkN;
    sparkPos[i * 3] = p.x; sparkPos[i * 3 + 1] = p.y; sparkPos[i * 3 + 2] = p.z;
    sparkVel[i * 3] = (Math.random() - 0.5) * 4;
    sparkVel[i * 3 + 1] = Math.random() * 3;
    sparkVel[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
}
function stepSparks(dt) {
  for (let i = 0; i < sparkN; i++) {
    sparkVel[i * 3 + 1] -= 9 * dt;
    sparkPos[i * 3] += sparkVel[i * 3] * dt;
    sparkPos[i * 3 + 1] += sparkVel[i * 3 + 1] * dt;
    sparkPos[i * 3 + 2] += sparkVel[i * 3 + 2] * dt;
    if (sparkPos[i * 3 + 1] < 0.02) sparkPos[i * 3 + 1] = 0.02;
  }
  sparkGeo.attributes.position.needsUpdate = true;
}

// ---------- audio ----------
let AC = null, rollGain = null, rollFilter = null, muted = false;
function audio() {
  if (AC) return;
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    const len = AC.sampleRate * 1.2, buf = AC.createBuffer(1, len, AC.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = AC.createBufferSource(); src.buffer = buf; src.loop = true;
    rollFilter = AC.createBiquadFilter(); rollFilter.type = 'lowpass'; rollFilter.frequency.value = 700;
    rollGain = AC.createGain(); rollGain.gain.value = 0;
    src.connect(rollFilter).connect(rollGain).connect(AC.destination); src.start();
  } catch { /* no audio */ }
}
function blip(freq, dur, type = 'square', vol = 0.16) {
  if (!AC || muted) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
  o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + dur);
}
addEventListener('pointerdown', audio); addEventListener('keydown', audio);

// ---------- skate state: velocity-vector physics ----------
const P = {
  pos: new THREE.Vector3(0, 0, 4), vel: new THREE.Vector3(), vy: 0,
  heading: Math.PI, yawRate: 0,
  ground: true, grind: null, balance: 1,
  crouch: 0, charge: 0, charging: false,
  flip: 0, flipSpeed: 0, flipAxis: 'roll', shove: 0,
  grab: false, airTricks: [], score: 0, combo: 0,
  bailT: 0, grindT: 0, pushT: 0, tuck: 0, wobble: 0, absorb: 0, stride: 0, pump: 0,
  airT: 0, powerslide: false, grabKind: null, chargeNorm: 0, fSpeed: 0, airH: 0,
  prevVel: new THREE.Vector3(), leanSm: 0, prevHead: Math.PI,
  spinAccum: 0, airFlip: null, flipPitch: 0, manual: null, manualHold: 0, tweakScored: false,
  gapsHit: [],
  normal: new THREE.Vector3(0, 1, 0),
};
const keys = {};
let paused = false;
// ---------- levels ----------
let LEVEL = null; // active LEVELS[i] entry + its per-pick state
let levelSpawn = { x: 0, y: 0, z: 4, heading: Math.PI };
function levelCtx() {
  return {
    THREE, group: levelGroup, M, steel, darkSteel, woodMat, concreteMat, accentMat, TX,
    box, cyl, flatRail, flatRailX, quarterPipe, slabRamp,
    grindTargets, SOLIDS, zones, ramps, qps, gaps,
    setSpawn(x, y, z, heading) { levelSpawn = { x, y, z, heading }; },
    setBounds(cx, cz, r) { levelBounds = { cx, cz, r }; },
    setKillY(y) { levelKillY = y; },
    setHoles(h) { levelHoles = h; },
  };
}
function clearLevel() {
  if (levelGroup) {
    scene.remove(levelGroup);
    levelGroup.traverse((o) => {
      if (o.isMesh) {
        o.geometry?.dispose?.();
        const m = o.material;
        if (Array.isArray(m)) m.forEach((x) => { if (!SHARED_MATS.has(x)) x.dispose?.(); });
        else if (m && !SHARED_MATS.has(m)) m.dispose?.();
      }
    });
  }
  levelGroup = new THREE.Group();
  scene.add(levelGroup);
  grindTargets.length = 0; SOLIDS.length = 0;
  zones.length = 0; ramps.length = 0; qps.length = 0; gaps.length = 0;
  levelBounds = null; levelKillY = null; levelHoles = null;
}
function pickLevel(i, silent) {
  if (!LEVELS[i]) return;
  clearLevel();
  LEVEL = LEVELS[i];
  LEVEL.build(levelCtx());
  // theme
  const th = LEVEL.theme || {};
  scene.background = new THREE.Color(th.bg ?? 0x87a5cc);
  scene.fog = new THREE.Fog(th.fog ?? th.bg ?? 0x87a5cc, th.fogNear ?? 70, th.fogFar ?? 260);
  if (groundMesh) {
    groundMesh.material.color.set(th.ground ?? 0xffffff);
    const gt = th.groundTex || 'concrete', gr = th.groundRepeat || 48;
    try {
      groundMesh.material.map?.dispose?.();
      groundMesh.material.map = TX.tex(gt, gr, gr);
      groundMesh.material.needsUpdate = true;
    } catch (e) { /* keep previous ground */ }
  }
  sun.color.set(th.sunColor ?? 0xfff0dd);
  sun.intensity = th.sun ?? 2.6;
  LEVEL.sunOff = th.sunOff || [-28, 42, 18];
  hemi.color.set(th.hemiSky ?? 0xbdd7ff);
  hemi.groundColor.set(th.hemiGround ?? 0x6b6257);
  hemi.intensity = th.hemi ?? 0.9;
  rim.color.set(th.rim ?? 0x4fb8ff);
  rim.intensity = th.rimI ?? 0.8;
  renderer.toneMappingExposure = th.exposure ?? 1.1;
  setSky({
    top: th.skyTop ?? 0x2f6fc4, horizon: th.skyHorizon ?? 0xe8d9b8,
    bottom: th.skyBottom ?? 0x3a3f45,
    sunDir: new THREE.Vector3(...(th.sunOff || [-28, 42, 18])),
    sunColor: th.sunColor ?? 0xfff0dd,
  });
  const sub = document.querySelector('#logo small');
  if (sub) sub.textContent = `${LEVEL.name} · DESKTOP`;
  document.getElementById('levels')?.classList.add('hidden');
  reset();
  // snap the follow camera behind spawn so there's no long swoop
  const cy = levelSpawn.heading + camYaw + Math.PI;
  camera.position.set(
    levelSpawn.x + Math.sin(cy) * 7.2,
    levelSpawn.y + 3.2,
    levelSpawn.z + Math.cos(cy) * 7.2);
  if (!silent) { flash(LEVEL.name + '!', 1600); blip(440, 0.15); }
  window.__level = LEVEL.id;
}
function voidRespawn() {
  P.pos.set(levelSpawn.x, levelSpawn.y, levelSpawn.z);
  P.vel.set(0, 0, 0); P.vy = 0; P.heading = levelSpawn.heading;
  P.flip = 0; P.flipSpeed = 0; P.flipGoal = 0; P.shove = 0; P.shoveGoal = 0; P.shoveRate = 1; P.grind = null; P.ground = true;
  P.combo = 0; P.airTricks = []; P.gapsHit = []; P.manual = null; P.absorb = 0; P.wobble = 0;
  P.bailT = 0; P.airFlip = null; P.flipPitch = 0; P.spinAccum = 0;
  tricksEl.innerHTML = '';
  if (rigState.ready) rigState.clipT = 0.7;
  flash('THE VOID SPITS YOU OUT', 1400); blip(140, 0.25, 'sawtooth', 0.15);
}
function press(code) {
  if (code === 'Space') { P.charging = true; P.charge = 0; }
  if (code === 'KeyF' || code === 'KeyJ') doFlip('kick');
  if (code === 'KeyH' || code === 'KeyK') doFlip('heel');
  if (code === 'KeyG' || code === 'KeyL') doFlip('shove');
  if (code === 'KeyR') reset();
  if (code === 'KeyM') muted = !muted;
  if (code === 'Digit1') pickLevel(0);
  if (code === 'Digit2') pickLevel(1);
  if (code === 'Digit3') pickLevel(2);
  if (code === 'Digit4') pickLevel(3);
}
function release(code) {
  if (code === 'Space' && P.charging) { P.charging = false; doOllie(3.2 + Math.min(P.charge, 0.45) * 9.5); }
}
function togglePause() {
  paused = !paused;
  flash(paused ? 'PAUSED — ▶ TO RIDE' : 'ROLLING!');
  blip(paused ? 220 : 440, 0.1);
}
addEventListener('keydown', e => {
  if (e.repeat) { keys[e.code] = true; return; }
  keys[e.code] = true;
  if (e.code === 'Space') e.preventDefault();
  press(e.code);
});
addEventListener('keyup', e => {
  keys[e.code] = false;
  release(e.code);
});
initPad(keys, { press, release, togglePause, trick: skateTrick });
document.querySelectorAll('.lvl-card').forEach((el) => {
  el.addEventListener('click', () => pickLevel(+el.dataset.lvl));
});
function reset() {
  P.pos.set(levelSpawn.x, levelSpawn.y, levelSpawn.z); P.vel.set(0, 0, 0); P.vy = 0; P.heading = levelSpawn.heading;
  P.flip = 0; P.flipSpeed = 0; P.flipGoal = 0; P.shove = 0; P.shoveGoal = 0; P.shoveRate = 1; P.grind = null; P.airTricks = []; P.combo = 0;
  P.bailT = 0; P.charge = 0; P.charging = false; P.balance = 1; P.wobble = 0; P.absorb = 0; P.stride = 0; P.pump = 0;
  P.spinAccum = 0; P.prevHead = P.heading; P.airFlip = null; P.flipPitch = 0;
  P.manual = null; P.manualHold = 0; P.tweakScored = false; P.gapsHit = [];
  RAG.active = false; RAG.gettingUp = false; RAG.pts = {}; RAG.sticks = [];
  poisonMixerAccu(); // bones may hold aimed values the mixer would skip
  flash('RESET');
}
function trick(name, pts) {
  P.airTricks.push(name); P.combo += pts;
  const el = document.createElement('div');
  el.className = 'trick'; el.textContent = `${name} +${pts}`;
  tricksEl.appendChild(el);
  while (tricksEl.children.length > 5) tricksEl.firstChild.remove();
  setTimeout(() => el.remove(), 2600);
}
function flash(t, ms = 1200) {
  msgEl.textContent = t; msgEl.style.opacity = 1;
  clearTimeout(flash._t); flash._t = setTimeout(() => msgEl.style.opacity = 0, ms);
}
function bail(reason, impact = 0) {
  if (RAG.active) return; // already crumpling — don't restart
  P.bailT = 1.5; P.combo = 0; P.airTricks = []; P.gapsHit = [];
  P.flip = 0; P.flipSpeed = 0; P.flipGoal = 0; P.shove = 0; P.shoveGoal = 0; P.shoveRate = 1; P.wobble = 0;
  P.airFlip = null; P.flipPitch = 0; P.manual = null; P.manualHold = 0; P.pump = 0;
  P.grind = null; P.ground = false; P.vy = Math.max(P.vy, 2);
  P.vel.multiplyScalar(0.25);
  tricksEl.innerHTML = '';
  flash(reason || 'BAIL!'); blip(90, 0.35, 'sawtooth', 0.2);
  pad.rumble?.(0.9, 0.5, 300);
  startRagdoll(reason, impact);
}
function doOllie(power = 6.4) {
  if (P.bailT > 0) return;
  endManualJump();
  P.spinAccum = 0; P.airFlip = null; P.flipPitch = 0;
  power += P.vel.length() * 0.06; // speed bonus
  if ((P.pump || 0) > 0.05 && P.ground) {
    power += P.pump * 1.2; // pumped pop: stored leg energy into the snap
    P.vel.addScaledVector(fwd, P.pump * 0.8);
    if (P.pump > 0.5) trick('PUMPED POP', 100);
    P.pump = 0;
  }
  if (P.grind) { P.grind = null; P.vy = power * 0.9; P.ground = false; P.gapsHit = []; poisonMixerAccu(); trick('OLLIE OUT', 150); blip(300, 0.12); return; }
  if (!P.ground) return;
  P.vy = power; P.ground = false; P.tuck = 1; P.gapsHit = [];
  // The Snap: jump-cut straight to the pop beat (tail-slam frame) instead of
  // damping up from the crouch — the air target then takes over from there.
  if (rigState.ready) rigState.clipT = 1.9;
  trick(power > 6.8 ? 'CHARGED OLLIE' : 'OLLIE', power > 6.8 ? 150 : 100);
  blip(220, 0.12);
}
function doNollie(power) {
  if (P.bailT > 0) return;
  endManualJump();
  P.spinAccum = 0; P.airFlip = null; P.flipPitch = 0;
  if (P.grind) { P.grind = null; P.vy = 5.6; P.ground = false; P.gapsHit = []; poisonMixerAccu(); trick('NOLLIE OUT', 150); blip(300, 0.12); return; }
  if (!P.ground) return;
  let npower = (power ?? 6.0) + P.vel.length() * 0.06;
  if ((P.pump || 0) > 0.05) {
    npower += P.pump * 1.2;
    P.vel.addScaledVector(fwd, P.pump * 0.8);
    if (P.pump > 0.5) trick('PUMPED POP', 100);
    P.pump = 0;
  }
  P.vy = npower; P.ground = false; P.tuck = 1; P.gapsHit = [];
  if (rigState.ready) rigState.clipT = 1.9; // snap to the pop beat
  trick('NOLLIE', 120);
  blip(260, 0.12);
}
function doFlip(kind, label, pts, spin = 1) {
  if (P.bailT > 0) return;
  endManualJump();
  // Popping OUT of a grind: leave the rail with a small pop, then the flip.
  // Works from keyboard and flick alike (kickflip-out, shuvit-out, ...).
  let outBonus = 0, outLbl = '';
  if (P.grind) {
    P.grind = null; P.ground = false;
    P.vy = 5.2 + P.vel.length() * 0.06; P.tuck = 1;
    P.gapsHit = []; poisonMixerAccu();
    outBonus = 150; outLbl = ' OUT';
  } else if (P.ground) { P.charging = false; doOllie(5.6); if (P.ground) return; }
  if (Math.abs(P.flip) > 0.2) return;
  // Flick torque → angular velocity: harder/faster flicks spin faster, and a
  // hucked flick (spin ≥ 1.5) rotates twice — a double flip.
  const dbl = spin >= 1.5;
  const goal = (dbl ? 4 : 2) * Math.PI;
  if (kind === 'kick') { P.flipAxis = 'roll'; P.flipSpeed = -Math.PI * 2 / 0.62 * spin; P.flipGoal = goal; trick((dbl ? 'DOUBLE ' : '') + (label || 'KICKFLIP') + outLbl, (pts || 300) + (dbl ? 250 : 0) + outBonus); }
  if (kind === 'heel') { P.flipAxis = 'roll'; P.flipSpeed = Math.PI * 2 / 0.62 * spin; P.flipGoal = goal; trick((dbl ? 'DOUBLE ' : '') + (label || 'HEELFLIP') + outLbl, (pts || 300) + (dbl ? 250 : 0) + outBonus); }
  if (kind === 'shove') { P.shove = 0.001; P.shoveGoal = goal; P.shoveRate = spin; trick((dbl ? '360 SHUVIT' : (label || 'SHOVE-IT')) + outLbl, (pts || 250) + (dbl ? 200 : 0) + outBonus); }
  if (kind === 'varial') { P.flipAxis = 'roll'; P.flipSpeed = -Math.PI * 2 / 0.62 * spin; P.flipGoal = goal; P.shove = 0.001; P.shoveGoal = 2 * Math.PI; P.shoveRate = 1; trick((label || 'VARIAL FLIP') + outLbl, (pts || 400) + outBonus); }
  if (kind === 'hard') { P.flipAxis = 'roll'; P.flipSpeed = Math.PI * 2 / 0.62 * spin; P.flipGoal = goal; P.shove = 0.001; P.shoveGoal = 2 * Math.PI; P.shoveRate = 1; trick((label || 'HARDFLIP') + outLbl, (pts || 450) + outBonus); }
  if (kind === 'tre') { P.flipAxis = 'roll'; P.flipSpeed = -Math.PI * 2 / 0.7 * spin; P.flipGoal = goal; P.shove = 0.001; P.shoveGoal = 2 * Math.PI; P.shoveRate = 1; trick((label || 'TRE FLIP') + outLbl, (pts || 550) + outBonus); }
  blip(kind === 'shove' ? 500 : 640, 0.1, 'sawtooth', 0.08);
}
// Skate-style RS gesture dispatcher (pad.js classifyTrail results).
// info = { intensity, dwellMs }: setup dwell + flick speed drive pop vy0,
// flick speed drives board torque (spin rate / doubles).
function skateTrick(name, info = {}) {
  if (P.bailT > 0 || RAG.active) return;
  const late = !P.ground && (P.airT || 0) > 0.25 && P.flipSpeed === 0 && P.shove === 0;
  const pre = late ? 'LATE ' : '', bonus = late ? 150 : 0;
  // Popping out of a grind keeps the combo rolling (doFlip/doOllie add +150).
  // Pop: slow/loaded setup + explosive flick = high vy0. No dwell (quick tap)
  // still pops, but low — exactly the spec's slow-vs-explosive curve.
  const dwellBonus = Math.min(1.6, (info.dwellMs || 0) / 1000 * 2.2);
  const flickBonus = Math.max(-0.8, ((info.intensity ?? 1) - 1) * 1.6);
  const popPower = Math.max(4.2, Math.min(8.8, 5.6 + dwellBonus + flickBonus));
  const spin = Math.max(0.6, Math.min(2, info.intensity ?? 1));
  if (name === 'ollie') { endManualJump(); doOllie(popPower); return; }
  if (name === 'nollie') { endManualJump(); doNollie(popPower); return; }
  if (name === 'kick') doFlip('kick', pre + 'KICKFLIP', 300 + bonus, spin);
  else if (name === 'heel') doFlip('heel', pre + 'HEELFLIP', 300 + bonus, spin);
  else if (name === 'shove') doFlip('shove', pre + 'POP SHUVIT', 300 + bonus, spin);
  else if (name === 'varial') doFlip('varial', pre + 'VARIAL FLIP', 400 + bonus, spin);
  else if (name === 'hard') doFlip('hard', pre + 'HARDFLIP', 450 + bonus, spin);
  else if (name === 'tre') doFlip('tre', pre + 'TRE FLIP', 550 + bonus, spin);
}
// Manual state: ollie/flip out keeps the combo rolling (+bonus), dropping the
// hold or stalling banks it immediately.
function endManualJump() {
  if (!P.manual) return;
  P.manual = null; P.manualHold = 0; poisonMixerAccu();
  trick('MANUAL OUT', 100);
}
function endManualBank() {
  if (!P.manual) return;
  P.manual = null; P.manualHold = 0; poisonMixerAccu();
  landCombo(false);
}
function landCombo(fromGrind) {
  if (P.combo > 0 || P.airTricks.length) {
    const total = Math.round(P.combo + (fromGrind ? P.grindT * 220 : 0));
    if (total > 0) { P.score += total; flash(`+${total}`, 900); blip(880, 0.12, 'sine', 0.12); }
  }
  P.combo = 0; P.airTricks = []; P.grindT = 0; tricksEl.innerHTML = '';
}

let camYaw = 0, camPitch = 0, dragging = false, px = 0, py = 0;
renderer.domElement.addEventListener('pointerdown', e => { dragging = true; px = e.clientX; py = e.clientY; });
addEventListener('pointerup', () => dragging = false);
addEventListener('pointermove', e => {
  if (!dragging) return;
  camYaw -= (e.clientX - px) * 0.005; camPitch = THREE.MathUtils.clamp(camPitch + (e.clientY - py) * 0.003, -0.15, 0.6);
  px = e.clientX; py = e.clientY;
});
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---------- ragdoll: physical bone-bodies under the mocap ----------
// Verlet point-mass ragdoll over 11 joint pivots. On bail the points inherit
// the skeleton's world pose + board velocity, then fall, bounce and drape over
// the park surface (groundHeight). Driven bones are aimed along the simulated
// segments in hierarchy order (twist preserved); translation rides the rig
// container off the pelvis point. After settling, a 0.55s get-up blends the
// ragdoll locals back into the clip and hands control back.
const RAG_PT = ['pelvis', 'chest', 'head', 'elbL', 'handL', 'elbR', 'handR', 'kneeL', 'footL', 'kneeR', 'footR'];
const RAG_PT_BONE = { pelvis: 'pelvis_human', chest: 'spine_03_human', head: 'head_human', elbL: 'lowerarm_l_human', handL: 'hand_l_human', elbR: 'lowerarm_r_human', handR: 'hand_r_human', kneeL: 'calf_l_human', footL: 'foot_l_human', kneeR: 'calf_r_human', footR: 'foot_r_human' };
const RAG_STICKS = [['pelvis', 'chest'], ['chest', 'head'], ['chest', 'elbL'], ['elbL', 'handL'], ['chest', 'elbR'], ['elbR', 'handR'], ['pelvis', 'kneeL'], ['kneeL', 'footL'], ['pelvis', 'kneeR'], ['kneeR', 'footR']];
const RAG_RADII = { pelvis: 0.2, chest: 0.2, head: 0.18, elbL: 0.12, handL: 0.11, elbR: 0.12, handR: 0.11, kneeL: 0.13, footL: 0.11, kneeR: 0.13, footR: 0.11 };
// bone: [segFrom, segTo] — every driven bone aims with a body segment,
// pelvis included (torso segment), so nothing is hand-posed.
const RAG_DRIVEN = [
  ['pelvis_human', 'pelvis', 'chest'],
  ['spine_03_human', 'chest', 'head'],
  ['neck_01_human', 'chest', 'head'],
  ['upperarm_l_human', 'chest', 'elbL'],
  ['lowerarm_l_human', 'elbL', 'handL'],
  ['upperarm_r_human', 'chest', 'elbR'],
  ['lowerarm_r_human', 'elbR', 'handR'],
  ['thigh_l_human', 'pelvis', 'kneeL'],
  ['calf_l_human', 'kneeL', 'footL'],
  ['thigh_r_human', 'pelvis', 'kneeR'],
  ['calf_r_human', 'kneeR', 'footR'],
];
const RAG = { active: false, gettingUp: false, pts: {}, sticks: [], bind: {}, yaw: 0, offset: new THREE.Vector3(), age: 0, settleT: 0, getupT: 0, saved: [], impact: 0 };
const _rv = new THREE.Vector3();
const _rq = new THREE.Quaternion(), _rq2 = new THREE.Quaternion(), _rq3 = new THREE.Quaternion();
// The mixer skips rewriting a bone when two consecutive evaluations match
// (flat/static tracks). Our ragdoll aims would stick forever on those bones,
// so after any direct bone writes, poison the mixer's compare buffers once:
// the next update then rewrites every track from the clip. (Vendored r160,
// layout: accu slots at [stride, 3*stride).)
function poisonMixerAccu() {
  try {
    const m = rigState.mixer;
    if (!m || !m._bindings) return;
    for (const bdg of m._bindings) {
      const buf = bdg.buffer, stride = bdg.valueSize;
      if (!buf || !stride) continue;
      for (let i = 0; i < stride * 2; i++) buf[stride + i] = NaN;
    }
  } catch (e) { /* best effort — mixer keeps last written pose */ }
}
function startRagdoll(reason, impact) {
  if (!rigState.ready || RAG.active) return;
  rig.updateMatrixWorld(true);
  RAG.pts = {}; RAG.sticks = []; RAG.bind = {}; RAG.saved = [];
  RAG.active = true; RAG.gettingUp = false;
  RAG.age = 0; RAG.settleT = 0; RAG.getupT = 0; RAG.impact = impact || 0;
  RAG.yaw = rig.rotation.y;
  rigLean.rotation.set(0, 0, 0); rigLean.scale.set(1, 1, 1);
  const dt0 = 1 / 60;
  const base = new THREE.Vector3(P.vel.x, Math.max(P.vy, 0) * 0.4 + 1.2, P.vel.z);
  const kick = Math.min(6, 1.5 + (impact || 0) * 0.45);
  for (const name of RAG_PT) {
    const b = rigState.bones[RAG_PT_BONE[name]];
    const p = new THREE.Vector3();
    if (b) b.getWorldPosition(p); else p.copy(P.pos);
    const jr = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9, Math.random() - 0.5);
    const limbBoost = (name === 'pelvis' || name === 'chest') ? 0.4 : 1.0;
    const v = base.clone().addScaledVector(jr, kick * limbBoost);
    RAG.pts[name] = { p, pp: p.clone().addScaledVector(v, -dt0), r: RAG_RADII[name] || 0.12 };
  }
  for (const [a, c] of RAG_STICKS) {
    RAG.sticks.push({ a, c, len: RAG.pts[a].p.distanceTo(RAG.pts[c].p) });
  }
  for (const [bn, fa, fb] of RAG_DRIVEN) {
    const b = rigState.bones[bn];
    if (!b) continue;
    const q = new THREE.Quaternion();
    b.getWorldQuaternion(q);
    const d = new THREE.Vector3().subVectors(RAG.pts[fb].p, RAG.pts[fa].p);
    if (d.lengthSq() < 1e-8) d.set(0, 1, 0); else d.normalize();
    RAG.bind[bn] = { q, d };
  }
  const pel = RAG.pts.pelvis.p;
  RAG.offset.set(pel.x - rig.position.x, pel.y - rig.position.y, pel.z - rig.position.z);
  pad.rumble?.(1.0, 0.6, 350);
}
function ragdollGround(pt) {
  const gh = groundHeight(pt.p.x, pt.p.z) + pt.r;
  if (pt.p.y < gh) {
    pt.p.y = gh;
    const vx = (pt.p.x - pt.pp.x) * 0.2, vz = (pt.p.z - pt.pp.z) * 0.2;
    const vy = pt.p.y - pt.pp.y;
    pt.pp.x = pt.p.x - vx; pt.pp.z = pt.p.z - vz;
    pt.pp.y = pt.p.y + vy * 0.25; // 25% bounce
  }
}
function stepRagdoll(dt) {
  const sdt = Math.min(dt, 0.033);
  if (!RAG.gettingUp) {
    RAG.age += sdt;
    const damp = 0.992, g = -22 * sdt * sdt;
    for (const n in RAG.pts) {
      const pt = RAG.pts[n];
      _rv.subVectors(pt.p, pt.pp).multiplyScalar(damp);
      pt.pp.copy(pt.p);
      pt.p.add(_rv); pt.p.y += g;
    }
    for (let it = 0; it < 4; it++) {
      for (const s of RAG.sticks) {
        const A = RAG.pts[s.a], B = RAG.pts[s.c];
        _rv.subVectors(B.p, A.p);
        const d = _rv.length() || 1e-6;
        const diff = (d - s.len) / d * 0.5;
        A.p.addScaledVector(_rv, diff); B.p.addScaledVector(_rv, -diff);
      }
      for (const n in RAG.pts) ragdollGround(RAG.pts[n]);
    }
    const pel = RAG.pts.pelvis.p;
    P.pos.x = pel.x; P.pos.z = pel.z;
    P.pos.y = Math.max(0, groundHeight(pel.x, pel.z));
    let sp = 0, n = 0;
    for (const k in RAG.pts) { sp += RAG.pts[k].p.distanceTo(RAG.pts[k].pp) / Math.max(sdt, 1e-4); n++; }
    if (RAG.age > 0.7 && sp / n < 0.7) RAG.settleT += sdt; else RAG.settleT = 0;
    if (RAG.settleT > 0.35 || RAG.age > 4) beginGetup();
  } else {
    stepGetup(sdt);
  }
}
function beginGetup() {
  RAG.gettingUp = true; RAG.getupT = 0; RAG.saved = [];
  poisonMixerAccu(); // mixer resumes full ownership from the next update
  P.pos.copy(rig.position); P.pos.y = Math.max(0, groundHeight(P.pos.x, P.pos.z));
  P.vel.set(0, 0, 0); P.vy = 0;
  for (const [bn] of RAG_DRIVEN) {
    const b = rigState.bones[bn];
    RAG.saved.push(b ? b.quaternion.clone() : null);
  }
}
function stepGetup(dt) {
  RAG.getupT += dt / 0.55;
  const k = THREE.MathUtils.smoothstep(Math.min(1, RAG.getupT), 0, 1);
  if (rigState.core) driveCore(rigState.core, 'skateOllie', 0.9);
  else {
    rigState.clipT += (0.7 - (rigState.clipT == null ? 0.7 : rigState.clipT)) * Math.min(1, dt * 6);
    const A = rigState.action;
    A.timeScale = 0;
    A.time = THREE.MathUtils.clamp(rigState.clipT, 0, rigState.clipDur - 0.01);
    rigState.mixer.update(dt);
  }
  applyRootMotion();
  // Restore driven bones toward the mocap stance snapshot DIRECTLY. Reading
  // the target back off the mixer is unreliable here: static/flat tracks are
  // skipped by the mixer's change-check, so aimed values would persist.
  const S = rigState.poses && rigState.poses.stance;
  let i = 0;
  for (const [bn] of RAG_DRIVEN) {
    const b = rigState.bones[bn], s = RAG.saved[i++];
    if (!b || !s) continue;
    if (S && S[bn]) {
      _rq.set(S[bn].q[0], S[bn].q[1], S[bn].q[2], S[bn].q[3]);
      b.quaternion.slerpQuaternions(s, _rq, k);
    }
  }
  rig.position.copy(P.pos);
  rig.rotation.y = RAG.yaw;
  if (RAG.getupT >= 1) {
    poisonMixerAccu(); // mixer resumes full ownership from the next update
    if (rigState.leg) rigState.leg.ikBlend = 0; // fade IK back in, no pop
    RAG.active = false; RAG.gettingUp = false;
    P.bailT = 0; P.ground = true;
  }
}
function aimRagdollBones() {
  rig.updateMatrixWorld(true);
  for (const [bn, fa, fb] of RAG_DRIVEN) {
    const b = rigState.bones[bn], bind = RAG.bind[bn];
    const A = RAG.pts[fa], B = RAG.pts[fb];
    if (!b || !bind || !A || !B) continue;
    _rv.subVectors(B.p, A.p);
    if (_rv.lengthSq() < 1e-8) _rv.copy(bind.d); else _rv.normalize();
    _rq.setFromUnitVectors(bind.d, _rv);
    _rq2.copy(_rq).multiply(bind.q); // target world orientation
    const par = b.parent;
    if (par && par.isBone) par.getWorldQuaternion(_rq3);
    else rig.getWorldQuaternion(_rq3);
    _rq3.invert().multiply(_rq2);
    b.quaternion.copy(_rq3);
    b.updateMatrixWorld(true); // children read a current parent
  }
}

// ---------- per-frame ----------
const clock = new THREE.Clock();
let frames = 0, fpsT = 0, firstFrame = true;
const fwd = new THREE.Vector3(), desired = new THREE.Vector3(), look = new THREE.Vector3();
const tmpN = new THREE.Vector3(), latV = new THREE.Vector3();

function step(dt) {
  if (P.bailT > 0) P.bailT -= dt;
  const fwdIn = (keys.KeyW || keys.ArrowUp || pad.push > 0.35 ? 1 : 0);
  const brake = (keys.KeyS || keys.ArrowDown || pad.brake > 0.35 ? 1 : 0);
  let steer = ((keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0));
  if (pad.steerX) steer = Math.max(-1, Math.min(1, steer - pad.steerX)); // stick-right matches D key
  const speed = P.vel.length();
  fwd.set(Math.sin(P.heading), 0, Math.cos(P.heading));
  groundNormal(P.pos.x, P.pos.z, P.normal);
  const slope = Math.hypot(P.normal.x, P.normal.z); // 0 flat

  if (P.charging && P.ground) P.charge = Math.min(P.charge + dt, 0.5);
  P.grab = !!(keys.KeyQ || keys.KeyE || keys.KeyU);
  P.grabKind = keys.KeyQ ? 'melon' : keys.KeyE ? 'indy' : keys.KeyU ? 'nose' : (P.grab ? 'melon' : null);
  P.chargeNorm = P.charging ? Math.min(P.charge, 0.5) / 0.5 : 0;
  P.fSpeed = P.vel.dot(fwd);
  P.airH = (!P.ground && !P.grind) ? Math.max(0, P.pos.y - groundHeight(P.pos.x, P.pos.z)) : 0;

  if (RAG.active) { stepRagdoll(dt); }
  else if (P.grind) {
    // roll along rail, balance meter
    P.airT = 0; P.spinAccum = 0; P.prevHead = P.heading;
    const g = P.grind;
    P.speedCache = speed;
    P.grindT += dt; P.combo += dt * 220;
    // Tech slides (boardslides, tailslides) chew balance faster than trucks.
    P.balance -= dt * (0.12 + Math.abs(P.balanceErr || 0) * 0.9 + (1 - Math.min(speed, 9) / 9) * 0.1) * (g.drain || 1);
    P.balanceErr = (P.balanceErr || 0) + steer * dt * 1.6;
    P.balanceErr *= (1 - dt * 0.7);
    if (Math.random() < 0.75) emitSpark(P.pos.clone().add(new THREE.Vector3(0, 0.06, 0)), 2);
    const dir = g.axis === 'z' ? Math.sign(Math.cos(P.heading)) || 1 : Math.sign(Math.sin(P.heading)) || 1;
    if (g.axis === 'z') { P.pos.x += (g.fixed - P.pos.x) * Math.min(1, dt * 10); P.pos.z += dir * Math.max(speed, 3.5) * dt; }
    else { P.pos.z += (g.fixed - P.pos.z) * Math.min(1, dt * 10); P.pos.x += dir * Math.max(speed, 3.5) * dt; }
    P.pos.y = g.h;
    P.vel.copy(fwd).multiplyScalar(Math.max(speed, 3.5) * 0.995);
    const along = g.axis === 'z' ? P.pos.z : P.pos.x;
    let done = false;
    if (along < g.min - 0.4 || along > g.max + 0.4) { P.grind = null; P.ground = false; P.vy = 1.4; P.spinAccum = 0; P.gapsHit = []; P.airFlip = null; P.flipPitch = 0; poisonMixerAccu(); landCombo(true); done = true; }
    if (!done && (P.balance <= 0 || Math.abs(P.balanceErr) > 1)) {
      const was = P.grind; P.grind = null; P.ground = false; P.vy = 0.8;
      P.vel.multiplyScalar(0.5); bail(Math.abs(P.balanceErr) > 1 ? 'SLIPPED OUT!' : 'LOST IT!', 3);
    }
  } else if (P.ground) {
    // --- grounded velocity physics ---
    // RS pump: sustained strong down/up hold crouches the rider (smaller
    // surface area) and banks boost for the pop. Full deflection only, so
    // light-tilt manuals and quick flicks never engage it.
    const _rhy = pad.rsHold.y || 0;
    const _pumpZone = (P.ground && !P.grind && P.bailT <= 0 && Math.abs(_rhy) > 0.72) ? (_rhy > 0 ? 'down' : 'up') : null;
    if (_pumpZone) P.pump = Math.min(1, (P.pump || 0) + dt / 0.8); // full crouch in 0.8s
    else P.pump = Math.max(0, (P.pump || 0) - dt * 3); // bleed off fast on release
    // slope pull: gravity projected onto the ground plane, g*ny*n_xz.
    // Always points DOWNHILL, so a stalled rider rolls back instead of
    // hanging on the transition (the ny factor kills it correctly on vert).
    P.vel.x += P.normal.x * 9.2 * dt * 2.2 * P.normal.y;
    P.vel.z += P.normal.z * 9.2 * dt * 2.2 * P.normal.y;
    // split forward / lateral for grip model
    const fSpeed = P.vel.dot(fwd);
    latV.copy(P.vel).addScaledVector(fwd, -fSpeed);
    const powerslide = brake && Math.abs(steer) > 0 && fSpeed > 4;
    P.powerslide = !!powerslide;
    const grip = powerslide ? 1.6 : 9.0;
    latV.multiplyScalar(Math.max(0, 1 - grip * dt));
    // forward accel / drag
    let a = -0.55 - fSpeed * 0.045 - Math.abs(fSpeed) * fSpeed * 0.006; // rolling + aero
    if (P.pump > 0) a += 1.5 * P.pump; // pumping legs drive a small speed boost
    if (fwdIn) {
      if (slope > 0.02 && P.vel.dot(new THREE.Vector3(-P.normal.x, 0, -P.normal.z)) > 0.5) a += 4.5; // pump with slope
      else a += 5.2;
      P.pushT -= dt;
      if (P.pushT <= 0) { P.pushT = 0.55; blip(140, 0.07, 'triangle', 0.06); }
      // Stride phase advances in physics (deterministic under pause).
      P.stride = (P.stride || 0) + dt * (5 + speed * 0.9);
    }
    if (brake && !powerslide) a -= 9.0;
    if (powerslide) { a -= 3.5; if (Math.random() < 0.5) emitSpark(P.pos, 1); }
    let nf = fSpeed + a * dt;
    // Fakie is real: allow rolling backward (a stalled rider slides back down
    // the transition tail-first instead of hanging frozen on the lip).
    nf = THREE.MathUtils.clamp(nf, brake ? -2 : -6, 13.5);
    P.vel.copy(fwd).multiplyScalar(nf).add(latV);
    // carve: board yaws toward velocity + rider steer
    if (speed > 0.4) {
      const velYaw = Math.atan2(P.vel.x, P.vel.z);
      let d = velYaw - P.heading;
      while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      const align = THREE.MathUtils.clamp(d * (powerslide ? 1.5 : 6.0) * dt, -1, 1) * Math.min(1, d * 8);
      P.heading += d * Math.min(1, (powerslide ? 1.2 : 5.5) * dt);
      P.yawRate = steer * (1.4 + Math.min(speed, 8) * 0.14);
      P.heading += P.yawRate * dt * (powerslide ? 1.5 : 1.0);
      P.wobble += Math.abs(d) * dt * 4;
    } else {
      P.yawRate = steer * 1.2; P.heading += P.yawRate * dt;
    }
    P.pos.x = THREE.MathUtils.clamp(P.pos.x + P.vel.x * dt, -60, 60);
    P.pos.z = THREE.MathUtils.clamp(P.pos.z + P.vel.z * dt, -70, 70);
    collideSolids();
    if (isVoid(P.pos.x, P.pos.z)) { P.ground = false; P.vy = Math.min(P.vy, -1); P.gapsHit = []; }
    const gh = groundHeight(P.pos.x, P.pos.z);
    P.pos.y += (gh - P.pos.y) * Math.min(1, dt * 16);
    groundNormal(P.pos.x, P.pos.z, tmpN);
    // rode off an edge / launched off coping
    const drop = gh - P.pos.y;
    const upV = P.vel.dot(new THREE.Vector3(-tmpN.x, 0, -tmpN.z));
    if (drop < -0.35 && upV < -1.5 && speed > 3) {
      P.ground = false; P.vy = Math.max(1.0, -upV * 0.55); P.spinAccum = 0; P.gapsHit = []; // launch off lip
      trick('AIR', 120);
    } else if (Math.abs(P.pos.y - gh) > 0.55) { P.ground = false; P.vy = 0; P.spinAccum = 0; P.gapsHit = []; }
    P.tuck += ((fwdIn ? 0.15 : 0) - P.tuck) * Math.min(1, dt * 6);
    P.airT = 0; P.spinAccum = 0; P.prevHead = P.heading;
    // Manuals: the half-register vector — 0.4 ≤ r ≤ 0.6 near straight
    // down (regular) or straight up (nose). Full deflections are pops and
    // flicks, light touches are nothing; the band in between is the manual.
    if (P.ground && !P.grind && !P.charging && P.bailT <= 0 && speed > 2) {
      const hx = pad.rsHold.x || 0, hy = pad.rsHold.y || 0;
      const hr = Math.hypot(hx, hy);
      const zone = (hr >= 0.35 && hr <= 0.65 && Math.abs(hx) <= 0.32) ? (hy > 0.12 ? 'MANUAL' : hy < -0.12 ? 'NOSE MANUAL' : null) : null;
      if (zone && (!P.manual || P.manual.kind === zone)) {
        P.manualHold += dt;
        if (!P.manual && P.manualHold > 0.25) {
          P.manual = { kind: zone, bal: 1, t: 0 };
          trick(zone + '!', 50);
        }
      } else P.manualHold = 0;
      if (P.manual && (!zone || speed < 1.2 || brake)) endManualBank();
    } else if (P.manual) endManualBank();
    if (P.manual) {
      P.manual.t += dt;
      P.combo += dt * 150;
      const correcting = (keys.KeyA || keys.ArrowLeft || keys.KeyD || keys.ArrowRight || Math.abs(pad.steerX) > 0.3) ? 1 : 0;
      P.manual.bal -= dt * (0.14 - 0.08 * correcting);
      if (P.manual.bal <= 0) { const m = P.manual; P.manual = null; bail(m.kind === 'MANUAL' ? 'LOOPED OUT!' : 'NOSE DIVE!', 2); }
    }
  } else {
    // --- airborne ---
    P.airT = (P.airT || 0) + dt;
    P.vy -= 17.5 * dt;
    P.pos.addScaledVector(P.vel, dt); P.pos.y += P.vy * dt;
    P.pos.x = THREE.MathUtils.clamp(P.pos.x, -60, 60);
    P.pos.z = THREE.MathUtils.clamp(P.pos.z, -70, 70);
    collideSolids();
    if (levelKillY != null && P.pos.y < levelKillY) { voidRespawn(); return; }
    P.vel.multiplyScalar(1 - 0.02 * dt);
    P.heading += steer * dt * 0.9;
    // Body-spin tracking: accumulate yaw while airborne for 180/360/540 credit.
    let dh = P.heading - (P.prevHead ?? P.heading);
    while (dh > Math.PI) dh -= Math.PI * 2; while (dh < -Math.PI) dh += Math.PI * 2;
    P.spinAccum = (P.spinAccum || 0) + dh;
    P.prevHead = P.heading;
    if (P.flipSpeed !== 0) {
      P.flip += P.flipSpeed * dt;
      if (Math.abs(P.flip) >= (P.flipGoal || Math.PI * 2)) { P.flip = 0; P.flipSpeed = 0; P.flipGoal = 0; }
    }
    if (P.shove !== 0) { P.shove += dt * Math.PI * 2 / 0.7 * (P.shoveRate || 1); if (P.shove >= (P.shoveGoal || Math.PI * 2)) { P.shove = 0; P.shoveGoal = 0; P.shoveRate = 1; } }
    if (P.grab) P.tuck = Math.min(1, P.tuck + dt * 5);
    else if (!keys.Space) P.tuck = Math.max(0.35, P.tuck - dt * 1.5);
    if (!P.grab) P.tweakScored = false;
    // Front/backflips: holding a grab (LT/RT) + full LS up/down while rising.
    if (P.grab && !P.grind && (P.airT || 0) > 0.1 && P.vy > -3) {
      const lsUp = keys.KeyW || keys.ArrowUp || pad.push > 0.8;
      const lsDown = keys.KeyS || keys.ArrowDown || pad.brake > 0.8;
      if (!P.airFlip && (lsUp || lsDown)) P.airFlip = { dir: lsDown ? -1 : 1, prog: 0, done: false };
    }
    if (P.airFlip && !P.airFlip.done) {
      P.airFlip.prog += dt / 0.9;
      if (P.airFlip.prog >= 1) { P.airFlip.prog = 1; P.airFlip.done = true; }
      P.flipPitch = P.airFlip.dir * P.airFlip.prog * Math.PI * 2;
    }
    // THPS-style gaps: named airtime bonuses, once each per airtime.
    if (!P.grind && gaps.length) {
      for (const gp of gaps) {
        if (P.gapsHit.includes(gp.name)) continue;
        if (P.pos.x > gp.x0 && P.pos.x < gp.x1 && P.pos.z > gp.z0 && P.pos.z < gp.z1 &&
          (gp.y0 == null || P.pos.y > gp.y0)) {
          P.gapsHit.push(gp.name);
          trick(gp.name, gp.pts);
          if (gp.pts >= 400) flash(gp.name, 900);
          blip(660, 0.12, 'sine', 0.1);
        }
      }
    }
    // grind entry: falling onto target, approach aligned with rail
    if (P.vy < -0.4) {
      const yaw = P.heading;
      for (const g of grindTargets) {
        const along = g.axis === 'z' ? P.pos.z : P.pos.x;
        const lat = g.axis === 'z' ? P.pos.x : P.pos.z;
        if (along < g.min - 0.35 || along > g.max + 0.35) continue;
        if (Math.abs(lat - g.fixed) > 0.6 || Math.abs(P.pos.y - g.h) > 0.6) continue;
        // approach angle vs rail axis
        const vYaw = Math.atan2(P.vel.x, P.vel.z);
        const railYaw = g.axis === 'z' ? 0 : Math.PI / 2;
        let dd = Math.abs(((vYaw - railYaw) % Math.PI + Math.PI) % Math.PI);
        dd = Math.min(dd, Math.PI - dd);
        const err = dd / (Math.PI / 2); // 0 perfect .. 1 sideways
        // signed approach: which side the rider comes across on (frontside vs
        // backside). Boardslides and lipslides come from the landing, not a menu.
        let rel = ((vYaw - railYaw) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
        if (err > 0.95) continue; // truly perpendicular — no trucks nor deck to catch
        P.grind = g; P.grindT = 0; P.flip = 0; P.flipSpeed = 0; P.flipGoal = 0; P.shove = 0; P.shoveGoal = 0; P.shoveRate = 1;
        P.airFlip = null; P.flipPitch = 0; P.spinAccum = 0;
        P.balance = 1 - err * 0.35; P.balanceErr = (Math.random() - 0.5) * 0.3;
        P.heading = railYaw + (Math.cos(vYaw) < 0 && g.axis === 'z' ? Math.PI : 0);
        if (g.axis === 'x') P.heading = Math.PI / 2 + (Math.sin(vYaw) < 0 ? Math.PI : 0);
        // Grind style: an explicit held RS direction wins (Skate-style
        // pre-positioning); otherwise the LANDING decides — straight on is a
        // 50-50, coming across the rail throws a boardslide or lipslide, and
        // loading the tail/nose through a sideways landing slides it.
        const hx = pad.rsHold.x || 0, hy = pad.rsHold.y || 0;
        const hr = Math.hypot(hx, hy);
        let style = '50-50', spts = 200, drain = 1;
        const sideways = err >= 0.3;
        if (hr > 0.45) {
          const ang = Math.atan2(hy, hx) * 180 / Math.PI; // U=-90 D=+90 (y down+)
          if (sideways && hy > 0.3) { style = 'TAILSLIDE'; spts = 300; drain = 1.5; }
          else if (sideways && hy < -0.3) { style = 'NOSESLIDE'; spts = 300; drain = 1.5; }
          else if (sideways) { style = rel > 0 ? 'BOARDSLIDE' : 'LIPSLIDE'; spts = 250; drain = 1.35; }
          else if (ang > -112.5 && ang < -67.5) { style = 'NOSEGRIND'; spts = 250; }
          else if (ang > 67.5 && ang < 112.5) { style = '5-0'; spts = 250; }
          else if (ang >= -22.5 && ang <= 22.5) { style = 'LIPSLIDE'; spts = 250; drain = 1.35; }
          else if (ang >= 157.5 || ang <= -157.5) { style = 'BOARDSLIDE'; spts = 250; drain = 1.35; }
          else if (ang < 0) { style = 'CROOKED'; spts = 300; }
          else { style = 'SMITH'; spts = 300; }
        } else if (sideways) {
          style = rel > 0 ? 'BOARDSLIDE' : 'LIPSLIDE'; spts = 250; drain = 1.35;
        }
        g.style = style; g.drain = drain;
        trick(style === '50-50' ? g.label + ' GRIND' : style, spts); blip(180, 0.2, 'sawtooth', 0.1);
        break;
      }
    }
    const gh = groundHeight(P.pos.x, P.pos.z);
    if (P.grind == null && P.pos.y <= gh && P.vy < 0 && !isVoid(P.pos.x, P.pos.z)) {
      P.pos.y = gh;
      const impact = -P.vy;
      const flipMod = Math.abs(((P.flip % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
      const flipBad = flipMod > 0.85;
      const shoveMod = P.shove === 0 ? 0 : Math.min(P.shove % (Math.PI * 2), Math.PI * 2 - (P.shove % (Math.PI * 2)));
      const shoveBad = shoveMod > 0.85;
      const knees = P.grab || P.charging || P.crouch > 0.4 ? 1.5 : 0;
      const flipCushion = (P.airFlip && P.airFlip.done) ? 3 : 0; // stomped rotation absorbs more
      const slamLimit = (P.airFlip && P.airFlip.done) ? 11 : 9.5 - knees - flipCushion;
      if (P.airFlip && !P.airFlip.done) { P.ground = true; P.vy = 0; P.flip = 0; P.flipSpeed = 0; P.flipGoal = 0; P.shove = 0; P.shoveGoal = 0; P.shoveRate = 1; P.airFlip = null; P.flipPitch = 0; bail('UNDER-ROTATED!', impact); }
      else if (flipBad || shoveBad) { P.ground = true; P.vy = 0; P.flip = 0; P.flipSpeed = 0; P.flipGoal = 0; P.shove = 0; P.shoveGoal = 0; P.shoveRate = 1; bail('PRIMO!', 4); }
      else if (impact > slamLimit) { P.ground = true; P.vy = 0; bail('SLAMMED!', impact); }
      else {
        P.ground = true; P.vy = 0; P.flip = 0; P.flipSpeed = 0; P.flipGoal = 0; P.shove = 0; P.shoveGoal = 0; P.shoveRate = 1; P.absorb = 1;
        if (P.airFlip && P.airFlip.done) trick(P.airFlip.dir < 0 ? 'BACKFLIP' : 'FRONTFLIP', 800);
        const sp = Math.abs(P.spinAccum || 0);
        if (sp > 2.7) {
          const tn = sp > 8.8 ? '540' : sp > 5.7 ? '360' : '180';
          trick((P.spinAccum > 0 ? 'BS ' : 'FS ') + tn, tn === '180' ? 200 : tn === '360' ? 400 : 600);
        }
        P.spinAccum = 0; P.airFlip = null; P.flipPitch = 0;
        if (impact > 5.5) { P.wobble = 1; P.vel.multiplyScalar(0.82); blip(70, 0.2, 'sine', 0.25); emitSpark(P.pos, 6); flash('SKETCHY', 700); pad.rumble?.(0.5, 0.3, 150); }
        else if (impact > 2) { blip(110, 0.12, 'sine', 0.15); pad.rumble?.(0.25, 0.15, 80); }
        landCombo(false);
      }
    }
  }

  // crouch spring (visual + landing absorb)
  const targetCrouch = P.charging ? Math.min(1, 0.35 + P.charge) : Math.min(1, (P.ground ? (fwdIn ? 0.18 : 0.42) : 0.15) + (P.pump || 0) * 0.55);
  P.crouch += (targetCrouch - P.crouch) * Math.min(1, dt * 9);
  P.wobble = Math.max(0, P.wobble - dt * 1.6);
  P.absorb = Math.max(0, P.absorb - dt * 2.4);
  // Lateral-G lean: how hard the rider is thrown sideways by carving.
  if (dt > 0 && !RAG.active) {
    const ch = P.heading;
    const ax = (P.vel.x - P.prevVel.x) / dt, az = (P.vel.z - P.prevVel.z) / dt;
    const latA = ax * -Math.cos(ch) + az * Math.sin(ch);
    const target = THREE.MathUtils.clamp(-latA * 0.02, -0.3, 0.3);
    P.leanSm += (target - P.leanSm) * Math.min(1, dt * 6);
  }
  P.prevVel.copy(P.vel);

  pose(dt, speed);
  stepSparks(dt);

  if (AC && rollGain) {
    const target = muted ? 0 : (P.ground ? Math.min(0.2, speed * 0.016) : 0.02) + (P.grind ? 0.12 : 0);
    rollGain.gain.value += (target - rollGain.gain.value) * 0.1;
    rollFilter.frequency.value = P.grind ? 2400 : 500 + speed * 60;
  }

  // wheels spin
  for (const w of wheels) w.rotation.x += (speed / 0.032) * dt * 0.4;

  // camera
  const back = 7.0 + speed * 0.1, up = 3.2 + camPitch * 5;
  const cy = P.heading + camYaw + Math.PI;
  desired.set(P.pos.x + Math.sin(cy) * back, P.pos.y + up, P.pos.z + Math.cos(cy) * back);
  camera.position.lerp(desired, 1 - Math.pow(0.0015, dt));
  look.set(P.pos.x - Math.sin(cy) * 3, P.pos.y + 1.25, P.pos.z - Math.cos(cy) * 3);
  camera.lookAt(look);
  sun.position.set(P.pos.x + (LEVEL?.sunOff?.[0] ?? -28), (LEVEL?.sunOff?.[1] ?? 42), P.pos.z + (LEVEL?.sunOff?.[2] ?? 18));
  sun.target.position.copy(P.pos); sun.target.updateMatrixWorld();
}

// ---------- posing the riders ----------
// The rig is driven ONLY by its authored clip ("Take 01": ride→crouch→pop→
// air→land) for the board, fingers and root motion — but the clip's legs are
// near-static outside the flip window (measured 0-0.4° stance→crouch), so all
// visible knee bend comes from the leg-IK below, which glues the feet to the
// deck and bends real knees from pelvis height + stride. No blind joint
// offsets anywhere: every write is absolute and deterministic.
// (blendBones/addEuler/addPos/driveLegs/driveSpineArms/flatLockBoard below are
// retired helpers, kept unused.)
const V3 = new THREE.Vector3();
const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();
const _qe = new THREE.Quaternion(), _ee = new THREE.Euler();
function blendBones(PA, PB, k) {
  const bones = rigState.bones;
  for (const n in PA) {
    const b = bones[n]; if (!b) continue;
    const A = PA[n], B = PB[n];
    _qa.set(A.q[0], A.q[1], A.q[2], A.q[3]);
    _qb.set(B.q[0], B.q[1], B.q[2], B.q[3]);
    _qa.slerp(_qb, k);
    b.quaternion.copy(_qa);
    b.position.set(
      A.p[0] + (B.p[0] - A.p[0]) * k,
      A.p[1] + (B.p[1] - A.p[1]) * k,
      A.p[2] + (B.p[2] - A.p[2]) * k);
  }
}
// Additive local-space joint offsets: bone.quaternion = baseQuat * offsetEuler.
// Never touch bone.rotation directly (rig bones are quat-driven by the clip).
function addEuler(name, rx, ry, rz) {
  const b = rigState.bones[name]; if (!b) return;
  if (!rx && !ry && !rz) return;
  _ee.set(rx, ry, rz);
  _qe.setFromEuler(_ee);
  b.quaternion.multiply(_qe);
}
function addPos(name, dx, dy, dz) {
  const b = rigState.bones[name]; if (!b) return;
  b.position.x += dx; b.position.y += dy; b.position.z += dz;
}
// Root placement is owned by the Core27 driver (driveCore writes it with the
// body pose) — no separate step needed. Kept as a no-op for call-site stability.
function applyRootMotion() {}
// Absolute board styling: reset Deck to its flat stance quat, then apply a
// yaw (slides) + lateral pitch (5-0/nose/manuals/tweaks). Absolute, never
// accumulated, so the mixer's change-check can't leave a stale angle behind.
function setBoardLocal(yawY, latAng) {
  const b = rigState.bones['Deck'];
  const flat = rigState.deckFlat;
  if (!b || !flat) return;
  b.quaternion.copy(flat);
  if (yawY) { _ee.set(0, yawY, 0); _qe.setFromEuler(_ee); b.quaternion.multiply(_qe); }
  if (latAng && rigState.deckLat) { _qe.setFromAxisAngle(rigState.deckLat, latAng); b.quaternion.multiply(_qe); }
}
// Authored-depth torso: absolute snapshot blend (stance→crouch) by crouch
// state. Deterministic (never read-modify-write, so the mixer's change-check
// can't corrupt it). Legs are NOT included — the IK below owns them.
const BODY_BONES = ['pelvis_human', 'spine_01_human', 'spine_02_human', 'spine_03_human',
  'neck_01_human', 'head_human', 'clavicle_l_human', 'upperarm_l_human', 'lowerarm_l_human',
  'hand_l_human', 'clavicle_r_human', 'upperarm_r_human', 'lowerarm_r_human', 'hand_r_human'];
function blendBody(k) {
  const Pz = rigState.poses;
  if (!Pz) return;
  const S = Pz.stance, C = Pz.crouch;
  const kk = THREE.MathUtils.clamp(k, 0, 1.4);
  for (const n of BODY_BONES) {
    const b = rigState.bones[n];
    if (!b || !S[n] || !C[n]) continue;
    _qa.set(S[n].q[0], S[n].q[1], S[n].q[2], S[n].q[3]);
    _qb.set(C[n].q[0], C[n].q[1], C[n].q[2], C[n].q[3]);
    _qa.slerp(_qb, kk);
    b.quaternion.copy(_qa);
    const A = S[n].p, B = C[n].p;
    b.position.set(A[0] + (B[0] - A[0]) * kk, A[1] + (B[1] - A[1]) * kk, A[2] + (B[2] - A[2]) * kk);
  }
}
// Two-bone leg IK. Feet are glued to targets (deck points, or the push
// stroke); knees emerge from pelvis height. Absolute writes only.
const _ik1 = new THREE.Vector3(), _ik2 = new THREE.Vector3(), _ik3 = new THREE.Vector3(), _ik4 = new THREE.Vector3();
const _ikq1 = new THREE.Quaternion(), _ikq2 = new THREE.Quaternion(), _ikq3 = new THREE.Quaternion();
function aimLimb(bone, childBone, tx, ty, tz) {
  const bp = bone.getWorldPosition(_ik1), cp = childBone.getWorldPosition(_ik2);
  _ik3.subVectors(cp, bp);
  if (_ik3.lengthSq() < 1e-10) return;
  _ik3.normalize();
  _ik4.set(tx, ty, tz).sub(bp);
  if (_ik4.lengthSq() < 1e-10) return;
  _ik4.normalize();
  _ikq1.setFromUnitVectors(_ik3, _ik4);
  bone.getWorldQuaternion(_ikq2).premultiply(_ikq1); // desired world orientation
  bone.parent.getWorldQuaternion(_ikq3).invert();
  _ikq2.premultiply(_ikq3); // → bone-local space
  // Fade-in toward the IK solution (smooth handoff after flips/get-up).
  const ibl = (rigState.leg && rigState.leg.ikBlend != null) ? rigState.leg.ikBlend : 1;
  if (ibl >= 1) bone.quaternion.copy(_ikq2);
  else bone.quaternion.slerp(_ikq2, ibl);
}
function solveLegs(dt, pushing) {
  const L = rigState.leg, B = rigState.bones;
  if (!L) return;
  const deck = B['Deck'];
  if (!deck) return;
  const fwdX = Math.sin(P.heading), fwdZ = Math.cos(P.heading);
  // right vector = fwd × up; for fwd=(x,0,z): (-z, 0, x)
  const rightX = -fwdZ, rightZ = fwdX;
  // goals, world space
  deck.updateWorldMatrix(true, false);
  const gF = _ik4.copy(L.footDeck[L.front]).applyMatrix4(deck.matrixWorld);
  const frontGoal = { x: gF.x, y: gF.y, z: gF.z };
  let backGoal;
  if (pushing && P.ground && !P.grind) {
    const ph = ((P.stride || 0) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const bc = deck.getWorldPosition(new THREE.Vector3());
    const gy = groundHeight(bc.x, bc.z);
    const outS = L.outSign;
    if (ph < Math.PI) {
      const u = ph / Math.PI;
      backGoal = {
        x: bc.x - fwdX * (0.15 + 0.55 * u) + rightX * 0.34 * outS,
        y: gy + 0.03,
        z: bc.z - fwdZ * (0.15 + 0.55 * u) + rightZ * 0.34 * outS,
      };
    } else {
      const u = (ph - Math.PI) / Math.PI, s = u * u * (3 - 2 * u);
      backGoal = {
        x: (bc.x - fwdX * 0.7 + rightX * 0.34 * outS) * (1 - s) + (bc.x + fwdX * 0.35 + rightX * 0.3 * outS) * s,
        y: gy + 0.03 + Math.sin(u * Math.PI) * 0.18,
        z: (bc.z - fwdZ * 0.7 + rightZ * 0.34 * outS) * (1 - s) + (bc.z + fwdZ * 0.35 + rightZ * 0.3 * outS) * s,
      };
    }
    if (!L.smBack) L.smBack = { ...backGoal };
    const ksm = Math.min(1, dt * 9);
    L.smBack.x += (backGoal.x - L.smBack.x) * ksm;
    L.smBack.y += (backGoal.y - L.smBack.y) * ksm;
    L.smBack.z += (backGoal.z - L.smBack.z) * ksm;
    backGoal = L.smBack;
  } else {
    const gB = _ik4.copy(L.footDeck[L.back]).applyMatrix4(deck.matrixWorld);
    const goal = { x: gB.x, y: gB.y, z: gB.z };
    if (!L.smBack) L.smBack = { ...goal };
    const ksm = Math.min(1, dt * 10);
    L.smBack.x += (goal.x - L.smBack.x) * ksm;
    L.smBack.y += (goal.y - L.smBack.y) * ksm;
    L.smBack.z += (goal.z - L.smBack.z) * ksm;
    backGoal = L.smBack;
  }
  const goals = { [L.front]: frontGoal, [L.back]: backGoal };
  // pelvis world for pole reference
  const pelW = B['pelvis_human'].getWorldPosition(new THREE.Vector3());
  for (const s of ['l', 'r']) {
    const T = goals[s];
    const thigh = B['thigh_' + s + '_human'], calf = B['calf_' + s + '_human'], foot = B['foot_' + s + '_human'];
    if (!thigh || !calf || !foot) continue;
    const H = thigh.getWorldPosition(new THREE.Vector3());
    const a = L.a[s], b = L.b[s];
    _ik1.set(T.x - H.x, T.y - H.y, T.z - H.z);
    let d = _ik1.length();
    d = Math.max(0.05, Math.min(a + b - 0.004, d));
    _ik1.normalize();
    const cosA = Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d)));
    const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
    // pole: forward + outward from pelvis
    _ik2.set(T.x - pelW.x, 0, T.z - pelW.z);
    if (_ik2.lengthSq() < 1e-6) _ik2.set(rightX, 0, rightZ);
    _ik2.normalize();
    const px = fwdX * 0.85 + _ik2.x * 0.5, pz = fwdZ * 0.85 + _ik2.z * 0.5;
    _ik3.set(px, 0, pz);
    const dot = _ik3.x * _ik1.x + _ik3.z * _ik1.z;
    _ik3.x -= _ik1.x * dot; _ik3.z -= _ik1.z * dot;
    if (_ik3.lengthSq() < 1e-8) _ik3.set(rightX, 0, rightZ);
    _ik3.normalize();
    const K = { x: H.x + _ik1.x * (a * cosA) + _ik3.x * (a * sinA), y: H.y + _ik1.y * (a * cosA), z: H.z + _ik1.z * (a * cosA) + _ik3.z * (a * sinA) };
    aimLimb(thigh, calf, K.x, K.y, K.z);
    rigState.model.updateMatrixWorld(true);
    aimLimb(calf, foot, T.x, T.y, T.z);
  }
  rigState.model.updateMatrixWorld(true);
}
function flatLockBoard(dt, k) {
  // Slerp board nodes back to flat stance pose when the flip clip isn't playing.
  const S = rigState.poses && rigState.poses.stance;
  if (!S) return;
  const kk = k == null ? Math.min(1, dt * 10) : k;
  for (const n of ['Deck', 'Empty', 'Empty001']) {
    const b = rigState.bones[n]; const s = S[n];
    if (!b || !s) continue;
    _qb.set(s.q[0], s.q[1], s.q[2], s.q[3]);
    b.quaternion.slerp(_qb, kk);
  }
}
// Pose the real rigged model: container follows physics, authored clip provides
// the stance + the varial-kickflip trick. Bail has no clip — tip the container.
// ---- phase 2+3: per-bone procedural drivers (additive, learned-axis) ----
function driveLegs(t, speed, air, pushing) {
  const amp = Math.min(1, speed / 4);
  if (P.bailT > 0) {
    // Sprawled legs, then settle.
    const k = Math.min(1, (1.5 - P.bailT) * 2);
    addEuler('thigh_l_human', 0.5 * k, 0, 0.2 * k);
    addEuler('thigh_r_human', -0.5 * k, 0, -0.2 * k);
    addEuler('calf_l_human', 0.4 * k, 0, 0);
    addEuler('calf_r_human', 0.4 * k, 0, 0);
    return;
  }
  if (pushing) {
    const ph = P.stride || 0;
    const s = Math.sin(ph), s2 = Math.sin(ph + 0.6);
    // Push (right) leg swings; stance (left) leg holds flex.
    addEuler('thigh_r_human', -0.5 + 0.65 * s * amp, 0, -0.1 * amp);
    addEuler('calf_r_human', 0.9 * Math.max(0, s2) * amp, 0, 0);
    addEuler('foot_r_human', -0.3 * Math.max(0, s) * amp, 0, 0);
    addEuler('thigh_l_human', 0.15 * amp, 0, 0);
    addEuler('calf_l_human', 0.2 * amp, 0, 0);
    addPos('pelvis_human', 0, -0.03 * Math.abs(Math.cos(ph)) * amp, 0);
    addEuler('pelvis_human', 0, 0.08 * s * amp, 0);
    return;
  }
  if (P.charging) {
    const n = P.chargeNorm || 0;
    addPos('pelvis_human', 0, -0.12 * n, 0);
    addEuler('thigh_l_human', 0.5 * n, 0, 0);
    addEuler('thigh_r_human', 0.5 * n, 0, 0);
    addEuler('calf_l_human', 0.6 * n, 0, 0);
    addEuler('calf_r_human', 0.6 * n, 0, 0);
    return;
  }
  if (air) {
    const tk = Math.max(P.tuck || 0, P.grab ? 0.8 : 0);
    addEuler('thigh_l_human', 0.9 * tk, 0, 0.1 * tk);
    addEuler('thigh_r_human', 0.9 * tk, 0, -0.1 * tk);
    addEuler('calf_l_human', 1.1 * tk, 0, 0);
    addEuler('calf_r_human', 1.1 * tk, 0, 0);
    addEuler('foot_l_human', -0.4 * tk, 0, 0);
    addEuler('foot_r_human', -0.4 * tk, 0, 0);
    addPos('pelvis_human', 0, 0.05 * tk, 0);
    return;
  }
  if (P.grind) {
    // 50-50 split stance.
    addEuler('thigh_l_human', 0.3, 0, 0.1);
    addEuler('thigh_r_human', -0.2, 0, -0.1);
    addEuler('calf_l_human', 0.5, 0, 0);
    addEuler('calf_r_human', 0.5, 0, 0);
    return;
  }
  if (P.absorb > 0) {
    const a = Math.min(1, P.absorb);
    addPos('pelvis_human', 0, -0.09 * a, 0);
    addEuler('thigh_l_human', 0.8 * a, 0, 0);
    addEuler('thigh_r_human', 0.8 * a, 0, 0);
  }
  if (P.powerslide) {
    addEuler('thigh_l_human', 0.4, 0, 0);
    addEuler('thigh_r_human', 0.4, 0, 0);
  }
}
function driveSpineArms(t, speed, air, pushing) {
  const yaw = P.yawRate || 0;
  if (P.bailT > 0) {
    addEuler('upperarm_l_human', -2.4, 0, -0.7);
    addEuler('upperarm_r_human', -2.4, 0, 0.7);
    addEuler('lowerarm_l_human', -0.4, 0, 0);
    addEuler('lowerarm_r_human', -0.4, 0, 0);
    addEuler('spine_01_human', -0.4, 0, 0);
    addEuler('head_human', -0.3, 0, 0);
    return;
  }
  if (pushing) {
    const ph = P.stride || 0;
    const s = Math.sin(ph);
    addEuler('upperarm_l_human', 0.5 * s, 0, -0.2);
    addEuler('upperarm_r_human', -0.5 * s, 0, 0.2);
    addEuler('spine_02_human', 0, 0, 0.06 * s);
    return;
  }
  if (P.charging) {
    const n = P.chargeNorm || 0;
    addEuler('spine_01_human', 0.25 * n, 0, 0);
    addEuler('upperarm_l_human', -0.4 * n, 0, -0.15 * n);
    addEuler('upperarm_r_human', -0.4 * n, 0, 0.15 * n);
    addEuler('head_human', -0.1 * n, 0, 0);
    return;
  }
  if (air) {
    if (P.grab && P.grabKind) {
      const k = P.grabKind;
      if (k === 'melon') {
        addEuler('upperarm_l_human', -1.0, 0, -0.5);
        addEuler('lowerarm_l_human', -1.0, 0, 0);
        addEuler('spine_02_human', 0, 0, 0.2);
      } else if (k === 'indy') {
        addEuler('upperarm_r_human', -1.0, 0, 0.5);
        addEuler('lowerarm_r_human', -1.0, 0, 0);
        addEuler('spine_02_human', 0, 0, -0.2);
      } else { // nose
        addEuler('upperarm_l_human', -1.4, 0, -0.2);
        addEuler('lowerarm_l_human', -0.4, 0, 0);
        addEuler('spine_01_human', 0.35, 0, 0);
      }
      addEuler('head_human', 0.2, 0, 0);
      addEuler('upperarm_r_human', k === 'indy' ? 0 : -0.3, 0, k === 'indy' ? 0 : 0.6);
      return;
    }
    addEuler('upperarm_l_human', -0.3, 0, -1.15);
    addEuler('upperarm_r_human', -0.3, 0, 1.15);
    addEuler('lowerarm_l_human', -0.5, 0, 0);
    addEuler('lowerarm_r_human', -0.5, 0, 0);
    addEuler('spine_01_human', 0.2 * (P.tuck || 0), 0, 0);
    return;
  }
  if (P.grind) {
    const be = P.balanceErr || 0;
    addEuler('spine_02_human', 0, 0.3, -be * 0.5);
    addEuler('upperarm_l_human', -0.3, 0, -1.35 - be * 0.6);
    addEuler('upperarm_r_human', -0.3, 0, 1.35 - be * 0.6);
    addEuler('lowerarm_l_human', -0.2, 0, 0);
    addEuler('lowerarm_r_human', -0.2, 0, 0);
    return;
  }
  // Ground: carve lean + wobble windmill + idle sway.
  if (Math.abs(yaw) > 0.3 || P.powerslide) {
    const cr = THREE.MathUtils.clamp(-yaw * 0.18, -0.35, 0.35);
    addEuler('spine_02_human', 0, 0, cr);
    addEuler('spine_01_human', 0, 0, cr * 0.6);
    addEuler('pelvis_human', 0, THREE.MathUtils.clamp(-yaw * 0.08, -0.2, 0.2), 0);
    addEuler('head_human', 0, THREE.MathUtils.clamp(yaw * 0.06, -0.16, 0.16), 0);
    if (P.powerslide) {
      addEuler('spine_02_human', 0, 0, -0.3 * Math.sign(yaw || 1));
      addEuler('upperarm_l_human', 0, 0, -1.0);
      addEuler('upperarm_r_human', 0, 0, 1.0);
    }
  } else {
    addEuler('spine_02_human', 0.02 * Math.sin(t * 2.1), 0, 0);
    addEuler('upperarm_l_human', 0, 0, -0.06 + 0.03 * Math.sin(t * 2.2));
    addEuler('upperarm_r_human', 0, 0, 0.06 - 0.03 * Math.sin(t * 2.2));
  }
  if (P.wobble > 0) {
    const w = Math.sin(t * 22) * 0.12 * P.wobble;
    addEuler('spine_02_human', 0, 0, w);
    addEuler('upperarm_l_human', 0, 0, -w * 2);
    addEuler('upperarm_r_human', 0, 0, -w * 2);
  }
}
// Core27 body driver: picks the real skate clip + time for the current game
// state and writes it absolutely (post-mixer, which now owns only board and
// fingers). Charge/pump hold the deep crouch frame; air plays the pop.
function driveBody(dt, air) {
  const core = rigState.core;
  if (!core) return;
  const speed = P.vel.length();
  const pushing = P.ground && (keys.KeyW || keys.ArrowUp || pad.push > 0.35) && speed > 0.5 && !P.grind && P.bailT <= 0;
  rigState.idleT = ((rigState.idleT || 0) + dt * (pushing ? 1.3 : 1)) % 10;
  const flipping = (P.flipSpeed !== 0) || (P.shove !== 0);
  let mc = 'idle', mt = rigState.idleT;
  if (flipping) {
    const _goal = P.shove ? (P.shoveGoal || Math.PI * 2) : (P.flipGoal || Math.PI * 2); const prog = (P.shove ? P.shove : Math.abs(P.flip)) / _goal;
    mc = 'skateKickflipOllie'; mt = THREE.MathUtils.clamp(prog, 0, 1) * CORE_BEATS.kickDur;
  } else if (rigState.heldT != null) {
    mc = 'skateOllie'; mt = THREE.MathUtils.clamp(rigState.heldT / (rigState.clipDur || 3.75), 0, 1) * CORE_BEATS.ollieDur;
  } else if (P.bailT > 0) { mc = 'skateOllie'; mt = 0; }
  else if (P.grind) { mc = 'skateOllie'; mt = 0.15; }
  else if (air) { mc = 'skateOllie'; mt = Math.min(P.airT || 0, CORE_BEATS.ollieDur); }
  else if (P.charging || (P.pump || 0) > 0.05) { mc = 'skateOllie'; mt = 0; }
  else if (P.absorb > 0.25) { mc = 'skateOllie'; mt = 0.8; }
  else if (P.manual) { mc = 'skateOllie'; mt = 0.05; }
  rigState.mClip = mc; rigState.mT = mt;
  driveCore(core, mc, mt);
  // Weight over the front foot while pushing (absolute — no accumulation).
  const L = rigState.leg;
  if (L && rigState.pelvisBaseX != null) {
    L.pushLean = ((L.pushLean || 0) + ((pushing ? 1 : 0) - (L.pushLean || 0)) * Math.min(1, dt * 6));
    const pel = rigState.bones['pelvis_human'];
    if (pel) pel.position.x = rigState.pelvisBaseX + L.shiftSign * 0.1 * (L.pushLean || 0);
    L.ikBlend = Math.min(1, (L.ikBlend == null ? 1 : L.ikBlend) + dt * 2.5);
  }
}
function poseRig(dt, speed, t, air, airH) {
  if (RAG.active && !RAG.gettingUp) {
    // Ragdoll owns the body: container rides the pelvis, bones aim at sim.
    const pel = RAG.pts.pelvis.p, off = RAG.offset;
    rig.position.set(pel.x - off.x, pel.y - off.y, pel.z - off.z);
    rig.rotation.y = RAG.yaw;
    rigLean.rotation.set(0, 0, 0); rigLean.scale.set(1, 1, 1);
    aimRagdollBones();
    return;
  }
  if (RAG.active && RAG.gettingUp) {
    // Get-up blend already ran the mixer in stepGetup — hold the container.
    rig.position.copy(P.pos);
    rig.rotation.y = RAG.yaw;
    rigLean.rotation.set(0, 0, 0); rigLean.scale.set(1, 1, 1);
    return;
  }
  rig.position.copy(P.pos);
  rig.rotation.y = P.heading + rigState.yawOffset;
  const A = rigState.action;
  A.timeScale = 0;
  const flipping = (P.flipSpeed !== 0) || (P.shove !== 0);
  // ---- phase 1: mixer base, exactly once, before any manual writes ----
  if (rigState.heldT != null) { // clip prober: raw authored pose
    A.time = THREE.MathUtils.clamp(rigState.heldT, 0, rigState.clipDur - 0.01);
    rigState.mixer.update(dt);
    applyRootMotion();
    driveBody(dt, air);
    rigState.clipT = A.time; rigState.wasFlip = false;
  } else if (flipping) { // authored trick window, driven by real flip physics
    const _goal = P.shove ? (P.shoveGoal || Math.PI * 2) : (P.flipGoal || Math.PI * 2); const prog = (P.shove ? P.shove : Math.abs(P.flip)) / _goal;
    A.time = THREE.MathUtils.lerp(rigState.flipT0, rigState.flipT1, THREE.MathUtils.clamp(prog, 0, 1));
    rigState.mixer.update(dt);
    applyRootMotion();
    driveBody(dt, air);
    if (rigState.leg) rigState.leg.ikBlend = 0; // smooth handoff back to IK on landing
    rigState.clipT = A.time; rigState.wasFlip = true;
  } else if (rigState.poses) {
    // Pure mocap: every game state maps to a clip-time target on the authored
    // ride→crouch→pop→air→land sequence, critically damped so the skeleton
    // always plays real captured motion — never procedurally bent joints.
    // Leaving a flip: resume from the landing beat so the deck is already flat.
    if (rigState.wasFlip) { rigState.clipT = 2.9; rigState.wasFlip = false; }
    const pushing = P.ground && (keys.KeyW || keys.ArrowUp || pad.push > 0.35) && speed > 0.5 && !P.grind && P.bailT <= 0;
    let target = 0.7, blend = 3.5;
    if (P.bailT > 0) { target = 2.0; blend = 9; }
    else if (P.grind) { target = 1.55; blend = 6; }
    else if (air) { target = 2.05 + Math.min(0.55, (P.airT || 0) * 1.1); blend = 5; }
    else if (P.charging) { target = 0.8 + (P.chargeNorm || 0) * 0.8; blend = 9; }
    else if ((P.pump || 0) > 0.05) { target = 0.8 + P.pump * 0.8; blend = 9; }
    else if (P.absorb > 0.25) { target = 2.9; blend = 11; }
    else if (P.manual) { target = 1.35; blend = 7; }
    else if (pushing) { target = 0.65 + 0.25 * Math.sin((P.stride || 0) * 0.6); blend = 8; }
    else { target = 0.7 + 0.08 * Math.sin(t * 1.1); blend = 3; }
    if (rigState.clipT == null) rigState.clipT = target;
    rigState.clipT += (target - rigState.clipT) * Math.min(1, dt * blend);
    A.time = THREE.MathUtils.clamp(rigState.clipT, 0, rigState.clipDur - 0.01);
    rigState.mixer.update(dt);
    applyRootMotion();
    driveBody(dt, air);
  } else {
    A.time = rigState.stanceT;
    rigState.mixer.update(dt);
    applyRootMotion();
  }
  // Board styling from held-RS style (absolute set — see setBoardLocal).
  const gsty = P.grind && P.grind.style;
  if (gsty && gsty !== '50-50') {
    if (gsty === 'BOARDSLIDE') setBoardLocal(1.35, 0);
    else if (gsty === 'LIPSLIDE') setBoardLocal(-1.35, 0);
    else if (gsty === 'TAILSLIDE') setBoardLocal(1.35, -0.35);
    else if (gsty === 'NOSESLIDE') setBoardLocal(-1.35, 0.35);
    else if (gsty === '5-0') setBoardLocal(0, -0.45);
    else if (gsty === 'NOSEGRIND') setBoardLocal(0, 0.45);
    else if (gsty === 'CROOKED') setBoardLocal(0.5, 0.45);
    else if (gsty === 'SMITH') setBoardLocal(0.5, -0.45);
  } else if (P.manual) {
    setBoardLocal(0, P.manual.kind === 'MANUAL' ? 0.5 : -0.5);
  } else if (P.grab && air) {
    const hx = pad.rsHold.x || 0, hy = pad.rsHold.y || 0;
    if (Math.hypot(hx, hy) > 0.5) {
      setBoardLocal(-hx * 0.5, hy * 0.45); // tweak the board while held
      if (!P.tweakScored) { P.tweakScored = true; trick('TWEAKED ' + (P.grabKind || 'GRAB').toUpperCase(), 100); }
    } else if (P._tweakOn) { P._tweakOn = false; poisonMixerAccu(); }
    if (Math.hypot(hx, hy) > 0.5) P._tweakOn = true;
  } else if (P._tweakOn) { P._tweakOn = false; poisonMixerAccu(); }
  // Leg IK after board styling (feet track the styled deck). Skipped for the
  // raw flip window and the clip prober so authored motion stays untouched.
  if (rigState.poses && !flipping && rigState.heldT == null && rigState.leg) {
    rigState.model.updateMatrixWorld(true);
    solveLegs(dt, P.ground && (keys.KeyW || keys.ArrowUp || pad.push > 0.35) && speed > 0.5 && !P.grind && P.bailT <= 0);
  }
  const crouch = P.crouch + (air ? P.tuck * 0.4 : 0);
  const leanF = THREE.MathUtils.clamp(speed * 0.018, 0, 0.28) + (air ? -0.1 : 0) + crouch * 0.18;
  if (P.bailT > 0) {
    const k = Math.min(1, (1.5 - P.bailT) * 2);
    rigLean.rotation.set(-0.7 * Math.sin(Math.min(1, k) * Math.PI), 0, 0.25 * k);
    rigLean.scale.set(1, 1 - 0.1 * k, 1);
  } else {
    rigLean.rotation.set(leanF + (P.flipPitch || 0), 0, THREE.MathUtils.clamp(-P.yawRate * 0.1, -0.25, 0.25) + (P.leanSm || 0) + (P.grind ? -(P.balanceErr || 0) * 0.4 : 0) + (P.wobble > 0 ? Math.sin(t * 22) * 0.08 * P.wobble : 0));
    rigLean.scale.set(1, 1 - crouch * 0.1 - (P.charging ? P.charge * 0.12 : 0), 1);
  }
}
function pose(dt, speed) {
  const t = performance.now() / 1000;
  const air = !P.ground && !P.grind;
  const airH = air ? Math.max(0, P.pos.y - groundHeight(P.pos.x, P.pos.z)) : 0;
  if (rigState.ready) { poseRig(dt, speed, t, air, airH); return; }

  rider.position.copy(P.pos);
  rider.rotation.y = P.heading;
  if (P.bailT > 0) { // ragdoll-ish tumble then kneel
    const k = Math.min(1, (1.5 - P.bailT) * 2);
    rider.rotation.x = -0.5 * Math.sin(Math.min(1, k) * Math.PI);
    rider.position.y += 0.05;
  } else rider.rotation.x = THREE.MathUtils.clamp(-P.normal.z * 0.4, -0.3, 0.3);

  const crouch = P.crouch + (air ? P.tuck * 0.45 : 0);
  const hipY = 0.98 - crouch * 0.3 - (air ? 0.08 : 0);
  hips.position.y = hipY;
  // sideways stance: yaw hips slightly, feet planted across deck (local X ±, Z along board)
  hips.rotation.y = 0.35;
  const kneeBend = 0.35 + crouch * 1.15 + (air ? 0.5 : 0);
  for (const [leg, s] of [[legFL, 1], [legFR, -1]]) {
    leg.hp.rotation.set(s * 0.12, 0, s * -0.28 - crouch * 0.12);
    leg.kn.rotation.x = 0; leg.kn.rotation.z = 0;
    leg.kn.rotation.x = kneeBend * 0.55 * s * 0.2; // slight
    leg.hp.rotation.x = -kneeBend * 0.5;
    leg.kn.rotation.x += kneeBend * 0.85;
    leg.ft.rotation.x = -kneeBend * 0.35 + (air ? -0.3 : 0);
  }
  // push animation: back foot swings when pushing on ground
  const pushing = P.ground && (keys.KeyW || keys.ArrowUp) && speed > 0.5 && !P.grind;
  if (pushing) {
    const ph = Math.sin(t * 9) * 0.55;
    legFR.hp.rotation.x = -0.5 + ph * 0.7;
    legFR.kn.rotation.x = 0.9 - Math.max(0, ph) * 0.9;
  }
  // torso: lean into speed + carve + brace on landing
  const leanF = THREE.MathUtils.clamp(speed * 0.02, 0, 0.3) + (air ? -0.12 : 0);
  spine.rotation.x = 0.18 + leanF + crouch * 0.25;
  spine.rotation.z = THREE.MathUtils.clamp(-P.yawRate * 0.12, -0.3, 0.3) + (P.grind ? -(P.balanceErr || 0) * 0.5 : 0);
  chest.rotation.x = 0.08 + (P.grab ? 0.35 : 0);
  chest.rotation.y = -0.3; // shoulders over board (sideways stance)
  neck.rotation.x = -0.25 - leanF;
  neck.rotation.y = 0.3;
  // arms
  const grindBal = P.grind ? (P.balanceErr || 0) : 0;
  if (P.bailT > 0) {
    armL.sh.rotation.set(-2.4, 0, -0.7); armR.sh.rotation.set(-2.4, 0, 0.7);
    armL.el.rotation.x = -0.4; armR.el.rotation.x = -0.4;
  } else if (air) {
    armL.sh.rotation.set(-0.5 + (P.grab ? -0.9 : 0), 0, -1.15);
    armR.sh.rotation.set(-0.5, 0, 1.15);
    armL.el.rotation.x = -0.5; armR.el.rotation.x = -0.5;
    if (P.grab) { armR.sh.rotation.set(-1.1, 0, 0.5); armR.el.rotation.x = -1.2; } // hand to board
  } else if (P.grind) {
    armL.sh.rotation.set(-0.3, 0, -1.35 - grindBal);
    armR.sh.rotation.set(-0.3, 0, 1.35 - grindBal);
    armL.el.rotation.x = -0.2; armR.el.rotation.x = -0.2;
  } else if (pushing) {
    const ph = Math.sin(t * 9);
    armL.sh.rotation.set(ph * 0.5, 0, -0.25); armR.sh.rotation.set(-ph * 0.5, 0, 0.25);
    armL.el.rotation.x = -0.4; armR.el.rotation.x = -0.4;
  } else {
    const sw = Math.sin(t * 2.2) * 0.06;
    armL.sh.rotation.set(sw, 0, -0.18); armR.sh.rotation.set(-sw, 0, 0.18);
    armL.el.rotation.x = -0.35; armR.el.rotation.x = -0.35;
  }
  // wobble on sketchy landing
  if (P.wobble > 0) {
    const w = Math.sin(t * 22) * 0.12 * P.wobble;
    spine.rotation.z += w; armL.sh.rotation.z -= w * 2; armR.sh.rotation.z -= w * 2;
  }

  // board under feet
  boardG.position.copy(P.pos);
  const deckLift = P.ground && !P.grind ? 0.1 : 0.1 + Math.min(0.6, airH * 0.32 + 0.22);
  boardG.position.y += deckLift;
  boardG.rotation.y = P.heading + (P.shove || 0);
  boardTilt.rotation.set(0, 0, 0);
  if (P.grind) {
    boardTilt.rotation.x = 0.02;
    boardTilt.rotation.z = (P.balanceErr || 0) * 0.12;
  } else if (P.flip !== 0) {
    boardTilt.rotation.z = P.flip; // kickflip roll around board long axis (local Z? we use z-roll)
    if (P.flipAxis !== 'roll') boardTilt.rotation.x = P.flip;
  } else if (air) {
    boardTilt.rotation.x = -0.22 + P.tuck * 0.1; // nose up
  } else if (P.charging) {
    boardTilt.rotation.x = 0.1;
  }
}

function hud() {
  const speed = P.vel.length();
  speedEl.textContent = `${Math.round(speed * 2.237)} mph`;
  const pending = P.combo > 1 ? ` (+${Math.round(P.combo)})` : '';
  const gname = P.grind ? (P.grind.style && P.grind.style !== '50-50' ? P.grind.style : P.grind.label + '!') : '';
  const extra = P.grind ? ` · ${gname} BAL ${Math.round(P.balance * 100)}%` : '';
  const chg = P.charging ? ` · CHARGE ${Math.round(Math.min(P.charge, 0.5) / 0.5 * 100)}%` : '';
  const pmp = (P.pump || 0) > 0.05 && P.ground ? ` · PUMP ${Math.round(P.pump * 100)}%` : '';
  const man = P.manual ? ` · ${P.manual.kind} ${Math.round(P.manual.bal * 100)}%` : '';
  scoreEl.textContent = `SCORE ${P.score}${pending}${extra}${chg}${pmp}${man}${P.bailT > 0 ? ' · BAILED' : ''}`;
}

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.033);
  if (!paused) { step(dt); hud(); }
  skyFollows(camera);
  renderer.render(scene, camera);
  if (firstFrame) {
    firstFrame = false;
    loadmsg.textContent = 'rolling!';
    setTimeout(() => loader.classList.add('done'), 350);
  }
  frames++; fpsT += dt;
  if (fpsT >= 0.5) { fpsEl.textContent = `${Math.round(frames / fpsT)} fps · WebGL`; frames = 0; fpsT = 0; }
  window.__skate = { pos: P.pos, score: P.score, speed: P.vel.length(), balance: P.balance, grind: !!P.grind, ready: true };
  window.__skateDebug = { P, doOllie, doFlip, reset }; // dev hook for scripted input tests
  window.__rig = { state: rigState, setT: (x) => { rigState.heldT = x; }, clearT: () => { rigState.heldT = null; }, setYaw: (y) => { rigState.yawOffset = y; }, poses: () => (rigState.poses ? Object.keys(rigState.poses) : null), skeleton: (v) => { if (rigState.skel) rigState.skel.visible = !!v; }, ragdoll: () => ({ active: RAG.active, gettingUp: RAG.gettingUp, age: +RAG.age.toFixed(2) }) };
}
loadmsg.textContent = 'dropping in…';
loop();
