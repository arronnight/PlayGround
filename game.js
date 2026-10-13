import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { pad, initPad } from './pad.js';

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
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070d16);
scene.fog = new THREE.Fog(0x070d16, 55, 190);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 500);

scene.add(new THREE.HemisphereLight(0xbfe3ff, 0x1a2530, 1.0));
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
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(240, 240),
  new THREE.MeshStandardMaterial({ map: concreteTexture(), roughness: 0.95, metalness: 0.02 })
);
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
{
  const lineMat = new THREE.MeshBasicMaterial({ color: 0x3fc1ff, transparent: true, opacity: 0.35 });
  for (const x of [-12, 12]) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 120), lineMat);
    line.rotation.x = -Math.PI / 2; line.position.set(x, 0.01, -14); scene.add(line);
  }
}

// ---------- helpers ----------
const M = (c, r = 0.7, m = 0.05) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
function box(w, h, d, mat, x, y, z, shadow = true) {
  const ms = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  ms.position.set(x, y, z); ms.castShadow = shadow; ms.receiveShadow = true;
  scene.add(ms); return ms;
}
function cyl(rt, rb, h, mat, x, y, z, seg = 14) {
  const ms = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  ms.position.set(x, y, z); ms.castShadow = true; ms.receiveShadow = true;
  scene.add(ms); return ms;
}
function capsule(r, len, mat) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 3, 10), mat);
  m.castShadow = true; return m;
}

// ---------- park (same proven layout) ----------
const grindTargets = [];
const steel = M(0xc7d5de, 0.3, 0.85);
const darkSteel = M(0x39434d, 0.6, 0.4);
const woodMat = M(0x8a5a33, 0.85, 0.02);
const concreteMat = M(0x9aa7b2, 0.9, 0.02);
const accentMat = new THREE.MeshStandardMaterial({ color: 0x1f8fe0, roughness: 0.5, metalness: 0.2, emissive: 0x0a2a40, emissiveIntensity: 0.7 });
{
  box(8, 1.0, 4.4, concreteMat, 0, 0.5, -10);
  box(8.3, 0.12, 0.35, steel, 0, 1.06, -7.95);
  box(8.3, 0.12, 0.35, steel, 0, 1.06, -12.05);
  grindTargets.push({ axis: 'x', fixed: -7.95, min: -4, max: 4, h: 1.12, label: 'LEDGE' });
  grindTargets.push({ axis: 'x', fixed: -12.05, min: -4, max: 4, h: 1.12, label: 'LEDGE' });
  const top = new THREE.Mesh(new THREE.PlaneGeometry(8, 4.4), M(0x54616d, 0.9, 0));
  top.rotation.x = -Math.PI / 2; top.position.set(0, 1.001, -10); top.receiveShadow = true; scene.add(top);
}
function flatRail(x, z, len = 6.5, h = 0.62) {
  const g = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, len, 12), steel);
  bar.rotation.x = Math.PI / 2; bar.position.set(x, h, z); bar.castShadow = true; g.add(bar);
  for (const dz of [-len / 2 + 0.3, len / 2 - 0.3]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, h, 0.09), darkSteel);
    leg.position.set(x, h / 2, z + dz); leg.castShadow = true; g.add(leg);
  }
  scene.add(g);
  grindTargets.push({ axis: 'z', fixed: x, min: z - len / 2, max: z + len / 2, h: h + 0.05, label: '50-50' });
}
flatRail(-8, -8); flatRail(8, -11);
{
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); shape.lineTo(0, 2.0); shape.lineTo(6, 0); shape.lineTo(0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 12, bevelEnabled: false });
  const mesh = new THREE.Mesh(geo, concreteMat);
  mesh.rotation.y = -Math.PI / 2; mesh.position.set(-6, 0, -22);
  mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh);
  box(12, 0.3, 5, woodMat, 0, 2.0, -30.5);
  box(12, 2.0, 0.3, accentMat, 0, 1.0, -33, false);
}
function quarterPipe(cx, cz, w, dir) {
  const H = 3, L = 5;
  const geo = new THREE.PlaneGeometry(L, w, 10, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const t = (px + L / 2) / L;
    pos.setZ(i, (1 - Math.cos(t * Math.PI / 2)) * H * -1);
  }
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, concreteMat);
  mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.rotation.x = -Math.PI / 2; mesh.rotation.z = dir > 0 ? 0 : Math.PI;
  mesh.position.set(cx, H, cz); scene.add(mesh);
  const cop = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, w, 10), steel);
  cop.rotation.x = Math.PI / 2; cop.position.set(cx + dir * -L / 2, H + 0.02, cz); scene.add(cop);
  grindTargets.push({ axis: 'z', fixed: cx + dir * -L / 2, min: cz - w / 2, max: cz + w / 2, h: H + 0.06, label: 'ROCK' });
}
quarterPipe(-19, -16, 10, +1); quarterPipe(19, -16, 10, -1);
// ---------- new skateable assets (rideable + grindable) ----------
// Manual pad near spawn: roll up, manual across, ollie off either edge.
{
  box(3.2, 0.25, 2.0, woodMat, -7.5, 0.125, 4);
  box(3.3, 0.05, 2.1, concreteMat, -7.5, 0.27, 4);
  grindTargets.push({ axis: 'x', fixed: 3.05, min: -9.0, max: -6.0, h: 0.36, label: 'PAD EDGE' });
  grindTargets.push({ axis: 'x', fixed: 4.95, min: -9.0, max: -6.0, h: 0.36, label: 'PAD EDGE' });
}
// Beginner flat bar on the spawn line.
flatRail(-2, 0, 5, 0.5);
// Hubba-style long ledge, right side.
{
  box(6, 0.6, 1.2, concreteMat, 12, 0.3, -2);
  box(6.2, 0.08, 0.25, steel, 12, 0.64, -1.5);
  box(6.2, 0.08, 0.25, steel, 12, 0.64, -2.5);
  grindTargets.push({ axis: 'x', fixed: -1.5, min: 9, max: 15, h: 0.72, label: 'HUBBA' });
  grindTargets.push({ axis: 'x', fixed: -2.5, min: 9, max: 15, h: 0.72, label: 'HUBBA' });
}
// Kicker wedge: rideable launch ramp (left side, clear of spawn view).
{
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); shape.lineTo(0, 1.0); shape.lineTo(3, 0); shape.lineTo(0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 4, bevelEnabled: false });
  const mesh = new THREE.Mesh(geo, woodMat);
  mesh.rotation.y = -Math.PI / 2; mesh.position.set(-12, 0, -1.5);
  mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(4, 0.08, 0.3), steel);
  lip.position.set(-10, 1.0, -1.5); scene.add(lip);
  grindTargets.push({ axis: 'x', fixed: -1.5, min: -12, max: -8, h: 1.06, label: 'LIP' });
}
{
  for (let i = 0; i < 4; i++) box(10, 0.3, 1.1, concreteMat, 0, 0.15 + i * 0.3, -40 - i * 1.0);
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 7, 10), steel);
  rail.rotation.x = Math.PI / 2 - 0.28; rail.position.set(3.4, 1.6, -41); rail.castShadow = true; scene.add(rail);
}
for (const [x, z] of [[-24, 2], [24, 2], [-24, -34], [24, -34], [-12, 10], [12, 10]]) {
  cyl(0.12, 0.16, 9, darkSteel, x, 4.5, z);
  box(1.6, 0.25, 0.5, accentMat, x, 9.1, z, false);
  const pt = new THREE.PointLight(0x9fdcff, 12, 30, 1.8); pt.position.set(x, 8.6, z); scene.add(pt);
}
for (let i = -3; i <= 3; i++) if (i !== 0) box(2.2, 0.9, 0.9, woodMat, i * 5.2, 0.45, 6);
{
  const leaf = M(0x1f6b3a, 0.9, 0), trunk = M(0x5a3d26, 0.9, 0);
  for (const [x, z, s] of [[-34, -6, 1.4], [34, -4, 1.7], [-32, -28, 1.2], [33, -30, 1.5], [-14, 14, 1.1], [15, 15, 1.3]]) {
    cyl(0.18 * s, 0.24 * s, 2.4 * s, trunk, x, 1.2 * s, z);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.7 * s, 3.4 * s, 8), leaf);
    cone.position.set(x, 3.4 * s, z); cone.castShadow = true; scene.add(cone);
  }
}

// ---------- solid colliders (walls you can slam into, not ride through) ----------
// Rideable tops are skipped when the rider is already up on them (y > top-0.25).
const SOLIDS = [
  { x0: -4, x1: 4, z0: -12.2, z1: -7.8, top: 1.0 },     // funbox
  { x0: -9.1, x1: -5.9, z0: 3.0, z1: 5.0, top: 0.295 },  // manual pad
  { x0: 9, x1: 15, z0: -2.6, z1: -1.4, top: 0.6 },       // hubba ledge
  { x0: -6, x1: 6, z0: -33, z1: -28, top: 2.15 },        // platform
  { x0: -5, x1: 5, z0: -44, z1: -39.5, top: 1.2 },       // stairs
  { x0: -24.15, x1: -23.85, z0: 1.85, z1: 2.15, top: 9 }, // light poles
  { x0: 23.85, x1: 24.15, z0: 1.85, z1: 2.15, top: 9 },
  { x0: -24.15, x1: -23.85, z0: -34.15, z1: -33.85, top: 9 },
  { x0: 23.85, x1: 24.15, z0: -34.15, z1: -33.85, top: 9 },
  { x0: -12.15, x1: -11.85, z0: 9.85, z1: 10.15, top: 9 },
  { x0: 11.85, x1: 12.15, z0: 9.85, z1: 10.15, top: 9 },
];
for (let i = -3; i <= 3; i++) {
  if (i === 0) continue;
  SOLIDS.push({ x0: i * 5.2 - 1.1, x1: i * 5.2 + 1.1, z0: 5.55, z1: 6.45, top: 0.9 }); // barriers
}
function collideSolids() {
  if (RAG.active) return;
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
function groundHeight(x, z) {  if (Math.abs(x) <= 4 && z >= -12.2 && z <= -7.8) return 1.0;
  // Manual pad top.
  if (x >= -9.1 && x <= -5.9 && z >= 3.0 && z <= 5.0) return 0.295;
  // Hubba ledge top.
  if (x >= 9 && x <= 15 && z >= -2.6 && z <= -1.4) return 0.6;
  // Kicker wedge: rises from z=1.5 (0) to z=-1.5 (1.0), x in -12..-8.
  if (x >= -12 && x <= -8 && z <= 1.5 && z >= -1.5) return ((1.5 - z) / 3) * 1.0;
  if (Math.abs(x) <= 6 && z <= -22 && z >= -28) return ((-22 - z) / 6) * 2.0;
  if (Math.abs(x) <= 6 && z < -28 && z >= -33) return 2.0;
  if (z >= -21 && z <= -11) {
    if (x >= -24 && x <= -14) {
      const t = THREE.MathUtils.clamp((-14 - x) / 10, 0, 1);
      if (t > 0.5) { const u = (t - 0.5) / 0.5; return (1 - Math.cos(u * Math.PI / 2)) * 3; }
    }
    if (x >= 14 && x <= 24) {
      const t = THREE.MathUtils.clamp((x - 14) / 10, 0, 1);
      if (t > 0.5) { const u = (t - 0.5) / 0.5; return (1 - Math.cos(u * Math.PI / 2)) * 3; }
    }
  }
  return 0;
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
const RIG_BONES = ['pelvis_human', 'spine_01_human', 'spine_02_human', 'spine_03_human',
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
      const clip = gltf.animations[0].clone();
      // Strip world-travel from the motion roots so the authored trick plays in
      // place — our physics moves the container. All joint + board-spin tracks stay.
      clip.tracks = clip.tracks.filter((tr) => {
        const dot = tr.name.indexOf('.');
        const node = dot < 0 ? tr.name : tr.name.slice(0, dot);
        const isRoot = node === 'human_rootJoint' || node === 'Root' || node === 'Root_human';
        return !(isRoot && tr.name.endsWith('.position'));
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
      // Mocap-derived pose library: sample the authored clip's own bone transforms
      // so procedural blends (crouch/tuck/push) move along anatomically-correct axes.
      rigState.model = model;
      rigState.bones = {};
      for (const n of RIG_BONES) {
        const b = model.getObjectByName(n);
        if (b) rigState.bones[n] = b; else console.warn('rig bone missing:', n);
      }
      const samplePose = (tt) => {
        action.time = tt; mixer.update(0.0001);
        const p = {};
        for (const n in rigState.bones) {
          const b = rigState.bones[n];
          p[n] = { p: [b.position.x, b.position.y, b.position.z], q: [b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w] };
        }
        return p;
      };
      rigState.poses = {
        stance: samplePose(rigState.stanceT),
        crouch: samplePose(1.6),
        launch: samplePose(2.0),
        land: samplePose(2.9),
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
  bailT: 0, grindT: 0, pushT: 0, tuck: 0, wobble: 0, absorb: 0, stride: 0,
  airT: 0, powerslide: false, grabKind: null, chargeNorm: 0, fSpeed: 0, airH: 0,
  prevVel: new THREE.Vector3(), leanSm: 0,
  normal: new THREE.Vector3(0, 1, 0),
};
const keys = {};
let paused = false;
function press(code) {
  if (code === 'Space') { P.charging = true; P.charge = 0; }
  if (code === 'KeyF' || code === 'KeyJ') doFlip('kick');
  if (code === 'KeyH' || code === 'KeyK') doFlip('heel');
  if (code === 'KeyG' || code === 'KeyL') doFlip('shove');
  if (code === 'KeyR') reset();
  if (code === 'KeyM') muted = !muted;
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
initPad(keys, { press, release, togglePause });
function reset() {
  P.pos.set(0, 0, 4); P.vel.set(0, 0, 0); P.vy = 0; P.heading = Math.PI;
  P.flip = 0; P.shove = 0; P.grind = null; P.airTricks = []; P.combo = 0;
  P.bailT = 0; P.charge = 0; P.charging = false; P.balance = 1; P.wobble = 0; P.absorb = 0; P.stride = 0;
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
  P.bailT = 1.5; P.combo = 0; P.airTricks = [];
  P.flip = 0; P.flipSpeed = 0; P.shove = 0; P.wobble = 0;
  P.grind = null; P.ground = false; P.vy = Math.max(P.vy, 2);
  P.vel.multiplyScalar(0.25);
  tricksEl.innerHTML = '';
  flash(reason || 'BAIL!'); blip(90, 0.35, 'sawtooth', 0.2);
  pad.rumble?.(0.9, 0.5, 300);
  startRagdoll(reason, impact);
}
function doOllie(power = 6.4) {
  if (P.bailT > 0) return;
  power += P.vel.length() * 0.06; // speed bonus
  if (P.grind) { P.grind = null; P.vy = power * 0.9; P.ground = false; trick('OLLIE OUT', 150); blip(300, 0.12); return; }
  if (!P.ground) return;
  P.vy = power; P.ground = false; P.tuck = 1;
  trick(power > 6.8 ? 'CHARGED OLLIE' : 'OLLIE', power > 6.8 ? 150 : 100);
  blip(220, 0.12);
}
function doFlip(kind) {
  if (P.bailT > 0) return;
  if (P.ground) { P.charging = false; doOllie(5.6); if (P.ground) return; }
  else if (P.grind) return;
  if (Math.abs(P.flip) > 0.2) return;
  if (kind === 'kick') { P.flipAxis = 'roll'; P.flipSpeed = -Math.PI * 2 / 0.62; trick('KICKFLIP', 300); }
  if (kind === 'heel') { P.flipAxis = 'roll'; P.flipSpeed = Math.PI * 2 / 0.62; trick('HEELFLIP', 300); }
  if (kind === 'shove') { P.shove = 0.001; trick('SHOVE-IT', 250); }
  blip(kind === 'shove' ? 500 : 640, 0.1, 'sawtooth', 0.08);
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
  rigState.clipT += (0.7 - (rigState.clipT == null ? 0.7 : rigState.clipT)) * Math.min(1, dt * 6);
  const A = rigState.action;
  A.timeScale = 0;
  A.time = THREE.MathUtils.clamp(rigState.clipT, 0, rigState.clipDur - 0.01);
  rigState.mixer.update(dt);
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
  if (pad.steerX) steer = Math.max(-1, Math.min(1, steer + pad.steerX));
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
    P.airT = 0;
    const g = P.grind;
    P.speedCache = speed;
    P.grindT += dt; P.combo += dt * 220;
    P.balance -= dt * (0.12 + Math.abs(P.balanceErr || 0) * 0.9 + (1 - Math.min(speed, 9) / 9) * 0.1);
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
    if (along < g.min - 0.4 || along > g.max + 0.4) { P.grind = null; P.ground = false; P.vy = 1.4; landCombo(true); done = true; }
    if (!done && (P.balance <= 0 || Math.abs(P.balanceErr) > 1)) {
      const was = P.grind; P.grind = null; P.ground = false; P.vy = 0.8;
      P.vel.multiplyScalar(0.5); bail(Math.abs(P.balanceErr) > 1 ? 'SLIPPED OUT!' : 'LOST IT!', 3);
    }
  } else if (P.ground) {
    // --- grounded velocity physics ---
    // slope pull (gravity projected on ground plane)
    P.vel.x += -P.normal.x * 9.2 * dt * 2.2;
    P.vel.z += -P.normal.z * 9.2 * dt * 2.2;
    // split forward / lateral for grip model
    const fSpeed = P.vel.dot(fwd);
    latV.copy(P.vel).addScaledVector(fwd, -fSpeed);
    const powerslide = brake && Math.abs(steer) > 0 && fSpeed > 4;
    P.powerslide = !!powerslide;
    const grip = powerslide ? 1.6 : 9.0;
    latV.multiplyScalar(Math.max(0, 1 - grip * dt));
    // forward accel / drag
    let a = -0.55 - fSpeed * 0.045 - Math.abs(fSpeed) * fSpeed * 0.006; // rolling + aero
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
    nf = THREE.MathUtils.clamp(nf, brake ? -2 : 0, 13.5);
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
    P.pos.z = THREE.MathUtils.clamp(P.pos.z + P.vel.z * dt, -70, 30);
    collideSolids();
    const gh = groundHeight(P.pos.x, P.pos.z);
    P.pos.y += (gh - P.pos.y) * Math.min(1, dt * 16);
    groundNormal(P.pos.x, P.pos.z, tmpN);
    // rode off an edge / launched off coping
    const drop = gh - P.pos.y;
    const upV = P.vel.dot(new THREE.Vector3(-tmpN.x, 0, -tmpN.z));
    if (drop < -0.35 && upV < -1.5 && speed > 3) {
      P.ground = false; P.vy = Math.max(1.0, -upV * 0.55); // launch off lip
      trick('AIR', 120);
    } else if (Math.abs(P.pos.y - gh) > 0.55) { P.ground = false; P.vy = 0; }
    P.tuck += ((fwdIn ? 0.15 : 0) - P.tuck) * Math.min(1, dt * 6);
    P.airT = 0;
  } else {
    // --- airborne ---
    P.airT = (P.airT || 0) + dt;
    P.vy -= 17.5 * dt;
    P.pos.addScaledVector(P.vel, dt); P.pos.y += P.vy * dt;
    P.pos.x = THREE.MathUtils.clamp(P.pos.x, -60, 60);
    P.pos.z = THREE.MathUtils.clamp(P.pos.z, -70, 30);
    collideSolids();
    P.vel.multiplyScalar(1 - 0.02 * dt);
    P.heading += steer * dt * 0.9;
    if (P.flipSpeed !== 0) {
      P.flip += P.flipSpeed * dt;
      if (Math.abs(P.flip) >= Math.PI * 2) { P.flip = 0; P.flipSpeed = 0; }
    }
    if (P.shove !== 0) { P.shove += dt * Math.PI * 2 / 0.7; if (P.shove >= Math.PI * 2) P.shove = 0; }
    if (P.grab) P.tuck = Math.min(1, P.tuck + dt * 5);
    else if (!keys.Space) P.tuck = Math.max(0.35, P.tuck - dt * 1.5);
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
        if (err > 0.62) continue; // too sideways — would boardslide; bail to slide-out rarely
        P.grind = g; P.grindT = 0; P.flip = 0; P.flipSpeed = 0; P.shove = 0;
        P.balance = 1 - err * 0.35; P.balanceErr = (Math.random() - 0.5) * 0.3;
        P.heading = railYaw + (Math.cos(vYaw) < 0 && g.axis === 'z' ? Math.PI : 0);
        if (g.axis === 'x') P.heading = Math.PI / 2 + (Math.sin(vYaw) < 0 ? Math.PI : 0);
        trick(g.label + ' GRIND', 200); blip(180, 0.2, 'sawtooth', 0.1);
        break;
      }
    }
    const gh = groundHeight(P.pos.x, P.pos.z);
    if (P.grind == null && P.pos.y <= gh && P.vy < 0) {
      P.pos.y = gh;
      const impact = -P.vy;
      const flipMod = Math.abs(((P.flip % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
      const flipBad = flipMod > 0.85;
      const shoveMod = P.shove === 0 ? 0 : Math.min(P.shove % (Math.PI * 2), Math.PI * 2 - (P.shove % (Math.PI * 2)));
      const shoveBad = shoveMod > 0.85;
      const knees = P.grab || P.charging || P.crouch > 0.4 ? 1.5 : 0;
      if (flipBad || shoveBad) { P.ground = true; P.vy = 0; P.flip = 0; P.shove = 0; bail('PRIMO!', 4); }
      else if (impact > 9.5 - knees) { P.ground = true; P.vy = 0; bail('SLAMMED!', impact); }
      else {
        P.ground = true; P.vy = 0; P.flip = 0; P.shove = 0; P.absorb = 1;
        if (impact > 5.5) { P.wobble = 1; P.vel.multiplyScalar(0.82); blip(70, 0.2, 'sine', 0.25); emitSpark(P.pos, 6); flash('SKETCHY', 700); pad.rumble?.(0.5, 0.3, 150); }
        else if (impact > 2) { blip(110, 0.12, 'sine', 0.15); pad.rumble?.(0.25, 0.15, 80); }
        landCombo(false);
      }
    }
  }

  // crouch spring (visual + landing absorb)
  const targetCrouch = P.charging ? Math.min(1, 0.35 + P.charge) : (P.ground ? (fwdIn ? 0.18 : 0.42) : 0.15);
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
  sun.position.set(P.pos.x - 28, 42, P.pos.z + 18);
  sun.target.position.copy(P.pos); sun.target.updateMatrixWorld();
}

// ---------- posing the riders ----------
// The rig is driven ONLY by its authored clip ("Take 01": ride→crouch→pop→
// air→land). poseRig maps each game state to a damped clip-time target, so the
// skeleton always plays real captured motion. No procedural joint offsets —
// those fought the mocap and read as flailing. Container lean/squash only.
// (blendBones/addEuler/addPos/driveLegs/driveSpineArms/flatLockBoard below are
// retired helpers, kept unused for the __rig pose prober.)
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
    rigState.clipT = A.time; rigState.wasFlip = false;
  } else if (flipping) { // authored trick window, driven by real flip physics
    const prog = P.shove ? P.shove / (Math.PI * 2) : Math.abs(P.flip) / (Math.PI * 2);
    A.time = THREE.MathUtils.lerp(rigState.flipT0, rigState.flipT1, THREE.MathUtils.clamp(prog, 0, 1));
    rigState.mixer.update(dt);
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
    else if (P.absorb > 0.25) { target = 2.9; blend = 11; }
    else if (pushing) { target = 0.65 + 0.25 * Math.sin((P.stride || 0) * 0.6); blend = 8; }
    else { target = 0.7 + 0.08 * Math.sin(t * 1.1); blend = 3; }
    if (rigState.clipT == null) rigState.clipT = target;
    rigState.clipT += (target - rigState.clipT) * Math.min(1, dt * blend);
    A.time = THREE.MathUtils.clamp(rigState.clipT, 0, rigState.clipDur - 0.01);
    rigState.mixer.update(dt);
  } else {
    A.time = rigState.stanceT;
    rigState.mixer.update(dt);
  }
  const crouch = P.crouch + (air ? P.tuck * 0.4 : 0);
  const leanF = THREE.MathUtils.clamp(speed * 0.018, 0, 0.28) + (air ? -0.1 : 0) + crouch * 0.18;
  if (P.bailT > 0) {
    const k = Math.min(1, (1.5 - P.bailT) * 2);
    rigLean.rotation.set(-0.7 * Math.sin(Math.min(1, k) * Math.PI), 0, 0.25 * k);
    rigLean.scale.set(1, 1 - 0.1 * k, 1);
  } else {
    rigLean.rotation.set(leanF, 0, THREE.MathUtils.clamp(-P.yawRate * 0.1, -0.25, 0.25) + (P.leanSm || 0) + (P.grind ? -(P.balanceErr || 0) * 0.4 : 0) + (P.wobble > 0 ? Math.sin(t * 22) * 0.08 * P.wobble : 0));
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
  const extra = P.grind ? ` · ${P.grind.label}! BAL ${Math.round(P.balance * 100)}%` : '';
  const chg = P.charging ? ` · CHARGE ${Math.round(Math.min(P.charge, 0.5) / 0.5 * 100)}%` : '';
  scoreEl.textContent = `SCORE ${P.score}${pending}${extra}${chg}${P.bailT > 0 ? ' · BAILED' : ''}`;
}

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.033);
  if (!paused) { step(dt); hud(); }
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
