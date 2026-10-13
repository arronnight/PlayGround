import * as THREE from './vendor/three.module.js';

/* ============================================================
   OpenEgregoria — OpenCity (grid RCI/power/terrain) × Egregoria
   (agent citizens, jobs, freight) fused into one 3D builder.
   Static, dependency-free (vendored three.js), desktop-wrappable.
   ============================================================ */

// ---------- utils ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const s = (t) => t * t * (3 - 2 * t);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, s(xf)), lerp(c, d, s(xf)), s(yf));
}
function fbm(x, y) {
  return valueNoise(x, y) * 0.55 + valueNoise(x * 2.3 + 7, y * 2.3 + 3) * 0.3 + valueNoise(x * 5.1 + 13, y * 5.1 + 29) * 0.15;
}

// ---------- constants ----------
const SIZE = 32, TILE = 2, HALF = (SIZE * TILE) / 2;
const T = { EMPTY: 0, WATER: 1, ROAD: 2, WIRE: 3, R: 4, C: 5, I: 6, RB: 7, CB: 8, IB: 9, COAL: 10, WIND: 11, PARK: 12 };
const COST = { road: 10, wire: 5, R: 5, C: 5, I: 5, park: 20, coal: 500, wind: 200 };
const PLANT_MW = { coal: 150, wind: 35 };
const SAVE_KEY = 'openegregoria-save-v1';

const POP = { 1: 6, 2: 16, 3: 34 };
const JOBS_C = { 1: 6, 2: 18, 3: 38 };
const JOBS_I = { 1: 9, 2: 22, 3: 48 };
const MW_USE = { R: [0, 3, 5, 8], C: [0, 5, 9, 14], I: [0, 9, 15, 24] };

// ---------- state ----------
const S = {
  tool: 'select', seed: 20261013, mapType: 'plain',
  grid: new Uint8Array(SIZE * SIZE),
  buildings: new Map(), // idx -> {level, residents, workers, jobsTotal, goods, happy, variant}
  powered: new Uint8Array(SIZE * SIZE),
  funds: 10000, day: 1, speed: 1, paused: false,
  tax: 9, pop: 0, jobsTotal: 0, jobsFilled: 0,
  mwMade: 0, mwUsed: 0, happy: 70,
  demand: { R: 0.5, C: 0.3, I: 0.4 },
  powerView: false, showGrid: true, sound: true,
  selected: -1, timeOfDay: 0.35, dayFrac: 0,
};
const idx = (x, z) => z * SIZE + x;
const inB = (x, z) => x >= 0 && z >= 0 && x < SIZE && z < SIZE;
const tileWX = (x) => (x - SIZE / 2 + 0.5) * TILE;
const tileWZ = (z) => (z - SIZE / 2 + 0.5) * TILE;

// ---------- dom ----------
const $ = (id) => document.getElementById(id);
const canvas = $('scene');
function toast(msg, cls = '') {
  const d = document.createElement('div');
  d.className = 'toast ' + cls; d.textContent = msg;
  $('toast-wrap').appendChild(d);
  setTimeout(() => { d.style.opacity = '0'; d.style.transition = 'opacity .4s'; }, 2200);
  setTimeout(() => d.remove(), 2700);
}
// tiny blips
let AC = null;
function blip(freq = 440, dur = 0.07, vol = 0.05) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'triangle'; o.frequency.value = freq;
    g.gain.value = vol; o.connect(g); g.connect(AC.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dur);
    o.stop(AC.currentTime + dur);
  } catch { /* no audio */ }
}

// ---------- three setup ----------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b5e0);
scene.fog = new THREE.Fog(0x87b5e0, 120, 260);

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 600);
// IsoCity-style camera: fixed-angle isometric preset + free orbit,
// damped goals so every input (mouse, touch, buttons, keys) feels smooth.
const ISO_YAW = Math.PI / 4, ISO_PITCH = 0.61548, ISO_FOV = 32, ORBIT_FOV = 50;
const cam = { yaw: ISO_YAW, pitch: ISO_PITCH, dist: 90, tx: 0, ty: 0, tz: 0, mode: 'iso', autoFit: true };
const goal = { yaw: ISO_YAW, pitch: ISO_PITCH, dist: 90, tx: 0, ty: 0, tz: 0 };
function updateCamera() {
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  camera.position.set(
    cam.tx + cam.dist * cp * Math.cos(cam.yaw),
    cam.ty + cam.dist * sp,
    cam.tz + cam.dist * cp * Math.sin(cam.yaw)
  );
  camera.lookAt(cam.tx, cam.ty, cam.tz);
}
function dampCamera(dt) {
  const k = 1 - Math.exp(-dt * 9);
  let dy = goal.yaw - cam.yaw;
  dy = Math.atan2(Math.sin(dy), Math.cos(dy)); // shortest arc
  cam.yaw += dy * k;
  cam.pitch += (goal.pitch - cam.pitch) * k;
  cam.dist += (goal.dist - cam.dist) * k;
  cam.tx += (goal.tx - cam.tx) * k;
  cam.ty += (goal.ty - cam.ty) * k;
  cam.tz += (goal.tz - cam.tz) * k;
}
function fitDistFor(fovDeg, aspect, iso) {
  const t = Math.tan((fovDeg * Math.PI) / 360);
  const hw = HALF + 15, hh = (HALF + 10) * (iso ? 0.62 : 0.85) + 7;
  return clamp(Math.max(hw / (t * aspect), hh / t), 26, 175);
}
// Frame the whole city so everything fits in the window (IsoCity-style fit).
function frameCity(snap = true) {
  const iso = cam.mode === 'iso';
  const fov = iso ? ISO_FOV : ORBIT_FOV;
  camera.fov = fov; camera.updateProjectionMatrix();
  const d = fitDistFor(fov, innerWidth / Math.max(1, innerHeight), iso);
  goal.tx = goal.ty = goal.tz = 0;
  goal.dist = d;
  if (iso) {
    goal.yaw = Math.PI / 4; // classic dimetric angle
    goal.pitch = ISO_PITCH;
  }
  if (snap) { cam.tx = cam.ty = cam.tz = 0; cam.dist = d; if (iso) { cam.yaw = goal.yaw; cam.pitch = goal.pitch; } }
  cam.autoFit = true;
  updateCamBar();
}
function toggleCamMode() {
  cam.mode = cam.mode === 'iso' ? 'orbit' : 'iso';
  if (cam.mode === 'iso') {
    // snap yaw to nearest 45° for a true dimetric look
    goal.yaw = Math.round(goal.yaw / (Math.PI / 4)) * (Math.PI / 4);
    goal.pitch = ISO_PITCH;
    camera.fov = ISO_FOV;
  } else {
    camera.fov = ORBIT_FOV;
  }
  camera.updateProjectionMatrix();
  frameCity(false);
  toast(cam.mode === 'iso' ? '📐 Isometric view (IsoCity style)' : '🎥 Free orbit view');
}
function panGoal(dxPx, dyPx) {
  const s = (goal.dist / 600) * 2;
  const sy = Math.sin(goal.yaw), cy = Math.cos(goal.yaw);
  // screen-right and screen-up(in ground plane) vectors
  goal.tx -= (dxPx * cy - dyPx * sy) * s;
  goal.tz -= (dxPx * sy + dyPx * cy) * s;
  goal.tx = clamp(goal.tx, -HALF * 1.5, HALF * 1.5);
  goal.tz = clamp(goal.tz, -HALF * 1.5, HALF * 1.5);
  cam.autoFit = false;
}
function updateCamBar() {
  const zl = $('zoom-label');
  if (zl) zl.textContent = Math.round((100 * 40) / goal.dist) + '%';
  const nd = $('needle');
  if (nd) nd.style.transform = `rotate(${-goal.yaw}rad)`;
  const iso = $('cam-iso');
  if (iso) { iso.classList.toggle('active', cam.mode === 'iso'); iso.textContent = cam.mode === 'iso' ? '📐' : '🎥'; }
}
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  if (cam.autoFit) frameCity(true); // keep everything fitting on window changes
}
let resizeT = null;
addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(resize, 120); });
resize();

const hemi = new THREE.HemisphereLight(0xbfd8ff, 0x3d5a3a, 0.75);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2dd, 2.0);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
sun.shadow.camera.far = 220; sun.shadow.bias = -0.0006;
scene.add(sun); scene.add(sun.target);
const moon = new THREE.DirectionalLight(0x8fa8ff, 0.0);
moon.position.set(-40, 50, -30); scene.add(moon);
// warm downtown glow at night (a few real lights, no shadows — cheap)
const nightLights = [];
for (const [lx, lz] of [[0, 0], [12, -10], [-12, 10]]) {
  const pl = new THREE.PointLight(0xffb46b, 0, 36, 1.8);
  pl.position.set(lx, 6, lz); scene.add(pl); nightLights.push(pl);
}

// ---------- sky dome, stars, clouds ----------
// gradient dome + sun glow (replaces flat background color)
const skyUni = {
  topColor: { value: new THREE.Color(0x2f6fd0) },
  horizonColor: { value: new THREE.Color(0xcfe8f5) },
  sunDir: { value: new THREE.Vector3(0, 1, 0) },
  sunColor: { value: new THREE.Color(0xfff3d6) },
  nightF: { value: 0 },
};
const skyDome = new THREE.Mesh(
  new THREE.SphereGeometry(420, 24, 16),
  new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: skyUni,
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: [
      'uniform vec3 topColor, horizonColor, sunColor; uniform vec3 sunDir; uniform float nightF;',
      'varying vec3 vDir;',
      'void main(){',
      '  float h = clamp(vDir.y, -0.08, 1.0);',
      '  float m = pow(1.0 - max(h, 0.0), 2.4);',
      '  vec3 col = mix(topColor, horizonColor, m);',
      '  float s = max(dot(normalize(vDir), normalize(sunDir)), 0.0);',
      '  col += sunColor * (pow(s, 900.0)*1.4 + pow(s, 16.0)*0.22*(1.0-nightF));',
      '  col = mix(vec3(0.04,0.07,0.13), col, smoothstep(-0.08, 0.02, vDir.y));',
      '  gl_FragColor = vec4(col, 1.0);',
      '}',
    ].join('\n'),
  })
);
skyDome.renderOrder = -10; skyDome.frustumCulled = false;
scene.add(skyDome);

let starMat = null;
{
  const N = 450, arr = new Float32Array(N * 3), r = mulberry32(7);
  for (let i = 0; i < N; i++) {
    const th = r() * Math.PI * 2, ph = Math.acos(r() * 0.95), R = 400;
    arr[i * 3] = R * Math.sin(ph) * Math.cos(th);
    arr[i * 3 + 1] = R * Math.cos(ph) + 10;
    arr[i * 3 + 2] = R * Math.sin(ph) * Math.sin(th);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  starMat = new THREE.PointsMaterial({ color: 0xcfd8ff, size: 1.7, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
  const starPts = new THREE.Points(g, starMat);
  starPts.frustumCulled = false; starPts.renderOrder = -9;
  scene.add(starPts);
}
const clouds = [];
const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.92 });
{
  const r = mulberry32(99);
  for (let i = 0; i < 9; i++) {
    const grp = new THREE.Group();
    const n = 3 + ((r() * 3) | 0);
    for (let k = 0; k < n; k++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(2.5 + r() * 3, 10, 8), cloudMat);
      s.position.set(k * 3.5 - n * 1.7 + r() * 2, r() * 1.5, r() * 3 - 1.5);
      s.scale.y = 0.55;
      grp.add(s);
    }
    grp.position.set((r() - 0.5) * 170, 36 + r() * 14, (r() - 0.5) * 170);
    grp.userData.v = 0.4 + r() * 0.7;
    scene.add(grp); clouds.push(grp);
  }
}

// ---------- terrain ----------
function tileIsWater(x, z) {
  const nx = x / SIZE, nz = z / SIZE;
  const dx = nx - 0.5, dz = nz - 0.5;
  const edge = Math.sqrt(dx * dx + dz * dz); // 0..0.707
  const n = fbm(x * 0.16 + S.seed * 0.001, z * 0.16 - S.seed * 0.0007);
  if (S.mapType === 'lake') {
    const lake = fbm(x * 0.09 + 31, z * 0.09 + 77);
    if (lake < 0.40 && edge < 0.42) return true;
    if (edge > 0.52) return n < 0.42;
    return n < 0.30;
  }
  if (S.mapType === 'hill') {
    if (edge > 0.55) return n < 0.36;
    return n < 0.26;
  }
  // plain: small ponds + river-ish border
  if (edge > 0.60) return n < 0.45;
  return n < 0.27;
}
function groundYAt(wx, wz) {
  // continuous scenic height for the big ground mesh
  const gx = wx / TILE + SIZE / 2, gz = wz / TILE + SIZE / 2;
  const inside = gx > -1 && gz > -1 && gx < SIZE + 1 && gz < SIZE + 1;
  const d = Math.max(Math.abs(wx), Math.abs(wz)) / (HALF + 22);
  const hills = (fbm(wx * 0.03 + 5, wz * 0.03 + 9) - 0.45) * 9;
  if (inside) {
    const cx = clamp(Math.round(gx - 0.5), 0, SIZE - 1), cz = clamp(Math.round(gz - 0.5), 0, SIZE - 1);
    if (S.grid[idx(cx, cz)] === T.WATER) return -1.4;
    const t = clamp((d - 0.55) / 0.45, 0, 1);
    return lerp(0, -2.2 + hills * 0.4, t);
  }
  return lerp(0, -3.2, clamp((d - 0.5) / 0.5, 0, 1)) + hills * clamp((d - 0.45) * 2, 0, 1);
}

let groundMesh = null, waterMesh = null, waterSurf = null, waterMat = null, gridHelper = null, gridMajor = null;
function waveTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#b7d4ea'; g.fillRect(0, 0, 128, 128);
  for (let k = 0; k < 26; k++) {
    g.strokeStyle = `rgba(255,255,255,${0.10 + (k % 3) * 0.08})`;
    g.lineWidth = 1 + (k % 2);
    g.beginPath();
    const y = (k * 47) % 128;
    for (let x = 0; x <= 128; x += 8) g.lineTo(x, y + Math.sin(x * 0.2 + k) * 3);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 7);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function buildGround() {
  if (groundMesh) { scene.remove(groundMesh); groundMesh.geometry.dispose(); }
  if (waterMesh) scene.remove(waterMesh);
  if (waterSurf) scene.remove(waterSurf);
  if (gridHelper) scene.remove(gridHelper);
  if (gridMajor) scene.remove(gridMajor);
  const W = SIZE * TILE + 56, SEG = 110;
  const g = new THREE.PlaneGeometry(W, W, SEG, SEG);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cLush = new THREE.Color(0x4f9e44), cGrass = new THREE.Color(0x6cb85a);
  const cDry = new THREE.Color(0xa9bd5f), cSand = new THREE.Color(0xe2cb92);
  const cRock = new THREE.Color(0x8d8f93), cBed = new THREE.Color(0x2c5a4c);
  const cCity = new THREE.Color(0x77bd66), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = groundYAt(x, z);
    pos.setY(i, y);
    const n = fbm(x * 0.08 + 3, z * 0.08 + 11);
    const detail = fbm(x * 0.5 + 40, z * 0.5 + 2);
    const inCity = Math.abs(x) < HALF && Math.abs(z) < HALF;
    if (y < -0.9) tmp.copy(cBed);
    else if (y < -0.35) tmp.copy(cSand);
    else if (y > 2.4) tmp.copy(cRock).lerp(cGrass, n * 0.3);
    else if (inCity) tmp.copy(cCity).lerp(cGrass, n * 0.7);
    else if (n < 0.36) tmp.copy(cDry).lerp(cGrass, n);
    else tmp.copy(cLush).lerp(cGrass, n);
    // subtle tile checker so the grid reads at a glance
    const tx = Math.floor(x / TILE), tz = Math.floor(z / TILE);
    const chk = ((tx + tz) & 1) === 0 ? 1.0 : 0.94;
    const v = chk * (0.94 + detail * 0.12);
    colors[i * 3] = tmp.r * v; colors[i * 3 + 1] = tmp.g * v; colors[i * 3 + 2] = tmp.b * v;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  groundMesh = new THREE.Mesh(g, m);
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // deep opaque layer + scrolling sparkling surface
  waterMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(W, W),
    new THREE.MeshStandardMaterial({ color: 0x14425e, roughness: 0.6, metalness: 0.1 })
  );
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = -0.66;
  waterMesh.receiveShadow = true;
  scene.add(waterMesh);
  waterMat = new THREE.MeshStandardMaterial({
    map: waveTexture(), transparent: true, opacity: 0.82,
    roughness: 0.12, metalness: 0.55, color: 0x9fd0f0,
  });
  waterSurf = new THREE.Mesh(new THREE.PlaneGeometry(W, W), waterMat);
  waterSurf.rotation.x = -Math.PI / 2;
  waterSurf.position.y = -0.55;
  waterSurf.receiveShadow = true;
  scene.add(waterSurf);

  gridHelper = new THREE.GridHelper(SIZE * TILE, SIZE, 0xffffff, 0xffffff);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = S.showGrid ? 0.10 : 0;
  gridHelper.position.y = 0.06;
  scene.add(gridHelper);
  gridMajor = new THREE.GridHelper(SIZE * TILE, SIZE / 4, 0xeaf6ff, 0xeaf6ff);
  gridMajor.material.transparent = true;
  gridMajor.material.opacity = S.showGrid ? 0.22 : 0;
  gridMajor.position.y = 0.07;
  scene.add(gridMajor);
}

// ---------- instanced pools ----------
const dummy = new THREE.Object3D();
function makeInstanced(geo, mat, max) {
  const m = new THREE.InstancedMesh(geo, mat, max);
  m.count = 0; m.castShadow = true; m.receiveShadow = true;
  m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(m); return m;
}
const roadPool = makeInstanced(new THREE.BoxGeometry(TILE * 0.98, 0.14, TILE * 0.98),
  new THREE.MeshStandardMaterial({ color: 0x2e3138, roughness: 0.9 }), SIZE * SIZE);
const walkPool = makeInstanced(new THREE.BoxGeometry(TILE * 1.0, 0.1, TILE * 1.0),
  new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 1 }), SIZE * SIZE);
const dashPool = makeInstanced(new THREE.BoxGeometry(0.16, 0.16, TILE * 0.42),
  new THREE.MeshStandardMaterial({ color: 0xf2ecd8, roughness: 0.7, emissive: 0x555544, emissiveIntensity: 0.25 }), SIZE * SIZE * 2);
const zonePool = makeInstanced(new THREE.BoxGeometry(TILE * 0.92, 0.1, TILE * 0.92),
  new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.5, roughness: 1 }), SIZE * SIZE);
const polePool = makeInstanced(new THREE.CylinderGeometry(0.09, 0.12, 2.6, 6),
  new THREE.MeshStandardMaterial({ color: 0x4a3a28, roughness: 1 }), SIZE * SIZE);
const armPool = makeInstanced(new THREE.BoxGeometry(0.85, 0.09, 0.09),
  new THREE.MeshStandardMaterial({ color: 0x4a3a28, roughness: 1 }), SIZE * SIZE);
// street lamps (heads glow at night via lampHeadMat)
const lampPolePool = makeInstanced(new THREE.CylinderGeometry(0.06, 0.08, 2.0, 6),
  new THREE.MeshStandardMaterial({ color: 0x2c313a, roughness: 0.6, metalness: 0.5 }), SIZE * SIZE);
const lampHeadMat = new THREE.MeshStandardMaterial({ color: 0x444a55, emissive: 0xffc46b, emissiveIntensity: 0.2, roughness: 0.4 });
const lampHeadPool = makeInstanced(new THREE.SphereGeometry(0.14, 8, 8), lampHeadMat, SIZE * SIZE);
const trunkPool = makeInstanced(new THREE.CylinderGeometry(0.1, 0.17, 1.1, 6),
  new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 1 }), 900);
const leafPool = makeInstanced(new THREE.IcosahedronGeometry(0.95, 0),
  new THREE.MeshStandardMaterial({ roughness: 1 }), 700);
const pinePool = makeInstanced(new THREE.ConeGeometry(0.8, 2.0, 7),
  new THREE.MeshStandardMaterial({ roughness: 1 }), 400);
const flowerPool = makeInstanced(new THREE.IcosahedronGeometry(0.14, 0),
  new THREE.MeshStandardMaterial({ roughness: 0.7 }), 500);
const MAXA = 260;
const carPool = makeInstanced(new THREE.BoxGeometry(0.55, 0.3, 1.0),
  new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.55 }), MAXA);
const cabinMat = new THREE.MeshStandardMaterial({ color: 0x18242f, roughness: 0.12, metalness: 0.9, emissive: 0xffca7a, emissiveIntensity: 0 });
const cabinPool = makeInstanced(new THREE.BoxGeometry(0.46, 0.22, 0.52), cabinMat, MAXA);
const folkPool = makeInstanced(new THREE.CapsuleGeometry(0.16, 0.3, 3, 8),
  new THREE.MeshStandardMaterial({ roughness: 0.9 }), MAXA);
carPool.castShadow = false; cabinPool.castShadow = false; folkPool.castShadow = false;

let wireLines = null;
function rebuildWires() {
  if (wireLines) { scene.remove(wireLines); wireLines.geometry.dispose(); }
  const pts = [];
  const isPole = (x, z) => inB(x, z) && (S.grid[idx(x, z)] === T.WIRE || S.grid[idx(x, z)] === T.COAL || S.grid[idx(x, z)] === T.WIND);
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    if (!isPole(x, z)) continue;
    for (const [dx, dz] of [[1, 0], [0, 1]]) {
      if (isPole(x + dx, z + dz)) {
        pts.push(tileWX(x), 2.5, tileWZ(z), tileWX(x + dx), 2.5, tileWZ(z + dz));
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
  wireLines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x222222 }));
  scene.add(wireLines);
}

// ---------- building facades ----------
const matCache = new Map();
function facadeTexture(base, style, floors, litRatio, rng) {
  const S2 = 256;
  const c = document.createElement('canvas'); c.width = c.height = S2;
  const g = c.getContext('2d');
  // base coat with soft vertical gradient + speckle
  const grad = g.createLinearGradient(0, 0, 0, S2);
  grad.addColorStop(0, base); grad.addColorStop(1, 'rgba(0,0,0,0.28)');
  g.fillStyle = grad; g.fillRect(0, 0, S2, S2);
  for (let k = 0; k < 500; k++) {
    g.fillStyle = `rgba(${rng() < 0.5 ? '255,255,255' : '0,0,0'},${0.03 + rng() * 0.04})`;
    g.fillRect(rng() * S2, rng() * S2, 2, 2);
  }
  if (style === 'I') {
    // corrugated siding
    g.fillStyle = 'rgba(0,0,0,0.12)';
    for (let y = 8; y < S2; y += 10) g.fillRect(0, y, S2, 3);
    // small high windows
    for (let f = 0; f < floors; f++) for (let x = 0; x < 6; x++) {
      const lit = rng() < litRatio * 0.7;
      g.fillStyle = lit ? '#ffe9a3' : 'rgba(18,28,48,0.9)';
      g.fillRect(12 + x * 40, 20 + f * ((S2 - 90) / floors), 24, 16);
    }
    // roller door
    g.fillStyle = 'rgba(30,34,40,0.9)'; g.fillRect(S2 / 2 - 34, S2 - 62, 68, 56);
    g.fillStyle = 'rgba(255,255,255,0.14)';
    for (let y = S2 - 58; y < S2 - 8; y += 8) g.fillRect(S2 / 2 - 34, y, 68, 2);
    // hazard stripe
    for (let x = 0; x < 8; x++) { g.fillStyle = x % 2 ? '#e8b93c' : '#2b2b2b'; g.fillRect(S2 / 2 - 34 + x * 8.5, S2 - 70, 8.5, 8); }
  } else {
    const top = style === 'C' ? 14 : 20;
    const rows = floors, cols = style === 'C' ? 7 : 5;
    const rh = (S2 - top - (style === 'C' ? 64 : 40)) / rows;
    for (let f = 0; f < rows; f++) for (let x = 0; x < cols; x++) {
      const lit = rng() < litRatio;
      const wx = 10 + x * ((S2 - 20) / cols), wy = top + f * rh;
      const ww = (S2 - 20) / cols - 8, wh = rh - 10;
      if (style === 'C') {
        // glass curtain wall
        g.fillStyle = lit ? '#ffe9a3' : '#31435c';
        g.fillRect(wx, wy, ww, wh);
        g.fillStyle = 'rgba(255,255,255,0.28)';
        g.fillRect(wx, wy, ww, 3); g.fillRect(wx, wy, 3, wh);
      } else {
        // home window + shutters
        g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillRect(wx - 5, wy, 4, wh); g.fillRect(wx + ww + 1, wy, 4, wh);
        g.fillStyle = lit ? '#ffe9a3' : 'rgba(20,30,55,0.88)';
        g.fillRect(wx, wy, ww, wh);
        g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(wx, wy, ww, 2);
      }
    }
    if (style === 'C') {
      // retail band + striped awning
      g.fillStyle = 'rgba(15,20,32,0.92)'; g.fillRect(0, S2 - 58, S2, 40);
      g.fillStyle = 'rgba(160,210,255,0.5)';
      for (let x = 8; x < S2 - 20; x += 34) g.fillRect(x, S2 - 52, 24, 26);
      for (let x = 0; x < 16; x++) { g.fillStyle = x % 2 ? '#c94f4f' : '#f3ede0'; g.fillRect(x * 16, S2 - 66, 16, 10); }
    } else {
      // front door
      g.fillStyle = 'rgba(40,26,18,0.95)'; g.fillRect(S2 / 2 - 13, S2 - 44, 26, 38);
      g.fillStyle = '#ffd97a'; g.fillRect(S2 / 2 + 6, S2 - 26, 4, 4);
    }
  }
  // cornice shadow line
  g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(0, 0, S2, 8);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function buildingMaterial(type, level, variant) {
  const key = type + '-' + level + '-' + variant;
  if (matCache.has(key)) return matCache.get(key);
  const rng = mulberry32(variant * 7919 + level * 131 + type.length * 17);
  const palettes = {
    R: ['#cdb49b', '#b9c6cb', '#d8c3ac', '#b3c2a6', '#c9a3a3'],
    C: ['#a8bedd', '#c6ccd8', '#9fc4dc', '#d8b49f', '#b7c9e8'],
    I: ['#b08d5f', '#9a8f7a', '#8f9aa3', '#bd7f52'],
  };
  const styles = { R: 'R', C: 'C', I: 'I' };
  const base = palettes[type][variant % palettes[type].length];
  const floors = type === 'I' ? 2 + level : 2 + level * 2;
  const tex = facadeTexture(base, styles[type], floors, type === 'C' ? 0.5 : 0.42, rng);
  const m = new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffdf9a, emissiveMap: tex, emissiveIntensity: 0.15, roughness: 0.85, metalness: 0.05 });
  matCache.set(key, m); return m;
}
const roofMat = new THREE.MeshStandardMaterial({ color: 0x3d4149, roughness: 0.9 });
const trimMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.9 });
const podiumMat = new THREE.MeshStandardMaterial({ color: 0xb9b3a4, roughness: 1 });
const houseRoofMat = new THREE.MeshStandardMaterial({ color: 0x8a4a3c, roughness: 0.85 });
const houseRoof2 = new THREE.MeshStandardMaterial({ color: 0x4a5a6a, roughness: 0.85 });
const beaconMat = new THREE.MeshStandardMaterial({ color: 0x550000, emissive: 0xff2222, emissiveIntensity: 0.4 });
const tankMat = new THREE.MeshStandardMaterial({ color: 0xcfd6dd, roughness: 0.4, metalness: 0.6 });
const warnMeshes = [];

const bldGroup = new THREE.Group(); scene.add(bldGroup);
const windRotors = []; // {hub, speed}
const smokePts = [];
let smokeGeo = null, smokeSys = null;

function clearBuildings() {
  while (bldGroup.children.length) {
    const o = bldGroup.children.pop();
    bldGroup.remove(o);
  }
  windRotors.length = 0; smokePts.length = 0; warnMeshes.length = 0;
  if (smokeSys) { scene.remove(smokeSys); smokeSys = null; smokeGeo = null; }
}
function addSmoke(x, y, z) { smokePts.push({ x, y, z, life: Math.random() }); }
function smokeTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  gr.addColorStop(0, 'rgba(255,255,255,0.85)');
  gr.addColorStop(0.6, 'rgba(255,255,255,0.35)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
function refreshSmoke() {
  if (smokeSys) scene.remove(smokeSys);
  if (!smokePts.length) { smokeSys = null; return; }
  smokeGeo = new THREE.BufferGeometry();
  const arr = new Float32Array(smokePts.length * 3);
  smokePts.forEach((p, i) => { arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; });
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  smokeSys = new THREE.Points(smokeGeo, new THREE.PointsMaterial({
    map: smokeTexture(), color: 0xd4d9de, size: 2.0, transparent: true,
    opacity: 0.5, depthWrite: false, sizeAttenuation: true,
  }));
  scene.add(smokeSys);
}

function podium(grp, sx = 1.9, sz = 1.9) {
  const p = new THREE.Mesh(new THREE.BoxGeometry(sx, 0.12, sz), podiumMat);
  p.position.y = 0.06; p.receiveShadow = true; p.castShadow = true; grp.add(p);
}
function beacon(grp, y) {
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), beaconMat);
  b.position.y = y; grp.add(b);
}

function spawnBuildingMesh(x, z) {
  const i = idx(x, z), t = S.grid[i];
  const b = S.buildings.get(i);
  const wx = tileWX(x), wz = tileWZ(z);
  const grp = new THREE.Group();
  grp.position.set(wx, 0, wz);
  grp.userData.tile = i;
  const rng = mulberry32(i * 31 + 7);
  const noPow = !S.powered[i];

  if (t === T.RB || t === T.CB || t === T.IB) {
    const kind = t === T.RB ? 'R' : t === T.CB ? 'C' : 'I';
    const lv = b ? b.level : 1;
    const variant = b ? b.variant : 1;
    const mat = buildingMaterial(kind, lv, variant).clone();
    if (noPow) { mat.emissiveIntensity = 0; delete mat.userData.baseEmissive; }
    mat.userData.baseEmissive = 0.15;
    grp.userData.mats = [mat];
    podium(grp);
    const rot = (rng() < 0.5 ? 0 : Math.PI / 2) + (rng() - 0.5) * 0.08;
    if (kind === 'R' && lv === 1) {
      // cottage: skirt + body + overhang roof + chimney
      const w = 1.15 + rng() * 0.3, h = 0.95 + rng() * 0.35, d = 1.1 + rng() * 0.3;
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.22, d + 0.1), trimMat);
      skirt.position.y = 0.2; skirt.castShadow = skirt.receiveShadow = true; grp.add(skirt);
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.position.y = h / 2 + 0.28; body.rotation.y = rot;
      body.castShadow = body.receiveShadow = true; grp.add(body);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.82, 0.75, 4), rng() < 0.6 ? houseRoofMat : houseRoof2);
      roof.position.y = h + 0.28 + 0.36; roof.rotation.y = rot + Math.PI / 4; roof.castShadow = true; grp.add(roof);
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.16), trimMat);
      ch.position.set(0.3, h + 0.6, 0.15); ch.castShadow = true; grp.add(ch);
      if (S.powered[i] && rng() < 0.8) addSmoke(wx + 0.3, h + 1.0, wz + 0.15);
    } else {
      // mid/high-rise with setback crown + parapet + rooftop props
      const w = kind === 'R' ? 1.3 + lv * 0.15 : 1.5 + lv * 0.12;
      const d = w * (0.85 + rng() * 0.3);
      const h = (kind === 'I' ? 1.0 : 1.4) + lv * (0.85 + rng() * 0.6) + (kind === 'C' && lv === 3 ? 1.6 : 0);
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.position.y = h / 2 + 0.1; body.rotation.y = rot;
      body.castShadow = body.receiveShadow = true; grp.add(body);
      let topY = h + 0.1;
      if (lv >= 2) {
        // setback crown
        const cw = w * 0.68, cd = d * 0.68, chh = 0.55 + rng() * 0.5;
        const crown = new THREE.Mesh(new THREE.BoxGeometry(cw, chh, cd), mat);
        crown.position.y = topY + chh / 2; crown.rotation.y = rot;
        crown.castShadow = crown.receiveShadow = true; grp.add(crown);
        const rim = new THREE.Mesh(new THREE.BoxGeometry(cw + 0.14, 0.12, cd + 0.14), trimMat);
        rim.position.y = topY + chh + 0.05; rim.rotation.y = rot; grp.add(rim);
        topY += chh;
        // rooftop clutter: AC box + (tank for industrial)
        const ac = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.24, 0.3), roofMat);
        ac.position.set(-cw * 0.2, topY + 0.16, cd * 0.1); ac.rotation.y = rot; ac.castShadow = true; grp.add(ac);
        if (kind === 'I') {
          const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 10), tankMat);
          tank.position.set(cw * 0.22, topY + 0.3, -cd * 0.15); tank.castShadow = true; grp.add(tank);
        }
      } else {
        const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 0.14, d + 0.12), roofMat);
        roof.position.y = topY + 0.06; roof.rotation.y = rot; grp.add(roof);
      }
      if (kind === 'I' && lv >= 2) {
        const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.19, 1.7, 8),
          new THREE.MeshStandardMaterial({ color: 0x8a7f72, roughness: 0.8 }));
        ch.position.set(w * 0.28, topY + 0.8, 0); ch.castShadow = true; grp.add(ch);
        beacon(grp, topY + 1.75);
        addSmoke(wx + w * 0.28, topY + 1.8, wz);
      }
      if (kind === 'C' && lv === 3) {
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.3, 5), roofMat);
        ant.position.y = topY + 0.7; grp.add(ant);
        beacon(grp, topY + 1.4);
      }
    }
    if (noPow) {
      const warn = new THREE.Mesh(new THREE.OctahedronGeometry(0.22),
        new THREE.MeshBasicMaterial({ color: 0xffd23f }));
      warn.position.y = 3.6; grp.add(warn);
      warnMeshes.push(warn);
    }
  } else if (t === T.COAL) {
    podium(grp, 2.0, 2.0);
    const hallMat = new THREE.MeshStandardMaterial({ color: 0x8a6f52, roughness: 0.9 });
    const hall = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.0, 1.4), hallMat);
    hall.position.y = 0.62; hall.castShadow = hall.receiveShadow = true; grp.add(hall);
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x2c3542, emissive: 0xffca7a, emissiveIntensity: 0.7, roughness: 0.4 });
    const band = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.28, 1.42), bandMat);
    band.position.y = 0.85; grp.add(band);
    grp.userData.mats = [bandMat];
    // cooling tower
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 1.9, 14, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xd8d4c8, roughness: 0.9, side: THREE.DoubleSide }));
    tower.position.set(-0.1, 1.05, -1.35); tower.castShadow = true; grp.add(tower);
    for (const sx of [-0.45, 0.45]) {
      const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 2.3, 10),
        new THREE.MeshStandardMaterial({ color: 0x9a5a4a, roughness: 0.85 }));
      ch.position.set(sx, 1.7, 0.25); ch.castShadow = true; grp.add(ch);
      beacon(grp, 2.95);
      addSmoke(wx + sx, 3.1, wz + 0.25);
    }
  } else if (t === T.WIND) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.18, 10), podiumMat);
    base.position.y = 0.09; base.receiveShadow = true; grp.add(base);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 3.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xf0f3f7, roughness: 0.35, metalness: 0.25 }));
    pole.position.y = 1.8; pole.castShadow = true; grp.add(pole);
    const nac = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xe2e7ee, roughness: 0.4 }));
    nac.position.y = 3.5; grp.add(nac);
    const hub = new THREE.Group(); hub.position.set(0, 3.5, 0.28);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf7fafc, roughness: 0.35 });
    for (let k = 0; k < 3; k++) {
      const bl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.6, 0.05), bladeMat);
      bl.position.y = 0.85; bl.scale.set(1, 1, 1);
      const holder = new THREE.Group(); holder.rotation.z = (k / 3) * Math.PI * 2; holder.add(bl);
      hub.add(holder);
    }
    hub.rotation.y = rng() * Math.PI;
    grp.add(hub);
    windRotors.push({ hub, speed: 1 + rng() * 1.5 });
  } else if (t === T.PARK) {
    const lawn = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 1.9),
      new THREE.MeshStandardMaterial({ color: 0x55a04b, roughness: 1 }));
    lawn.position.y = 0.06; lawn.receiveShadow = true; grp.add(lawn);
    // crossing gravel paths
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xd9c49a, roughness: 1 });
    for (const rr of [0, Math.PI / 2]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.13, 0.34), pathMat);
      p.rotation.y = rr; p.position.y = 0.065; p.receiveShadow = true; grp.add(p);
    }
    const pond = new THREE.Mesh(new THREE.CircleGeometry(0.38, 14),
      new THREE.MeshStandardMaterial({ color: 0x3f8fd1, roughness: 0.1, metalness: 0.4 }));
    pond.rotation.x = -Math.PI / 2; pond.position.set(0.48, 0.13, 0.48); grp.add(pond);
    // benches
    for (const [bx, bz, br] of [[-0.5, 0.1, 0], [0.1, -0.5, Math.PI / 2]]) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x7a5233, roughness: 1 }));
      bench.position.set(bx, 0.25, bz); bench.rotation.y = br; bench.castShadow = true; grp.add(bench);
    }
  }
  bldGroup.add(grp);
  return grp;
}
function rebuildBuildingMeshes() {
  clearBuildings();
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const t = S.grid[idx(x, z)];
    if (t === T.RB || t === T.CB || t === T.IB || t === T.COAL || t === T.WIND || t === T.PARK) spawnBuildingMesh(x, z);
  }
  refreshSmoke();
}

// ---------- static layer refresh (roads/zones/poles/trees) ----------
function refreshStatic() {
  let r = 0, w = 0, d = 0, zn = 0, p = 0, lp = 0;
  const zColors = { [T.R]: new THREE.Color(0x4ade80), [T.C]: new THREE.Color(0x60a5fa), [T.I]: new THREE.Color(0xfbbf24) };
  const tmpC = new THREE.Color();
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const i = idx(x, z), t = S.grid[i];
    const wx = tileWX(x), wz = tileWZ(z);
    if (t === T.ROAD) {
      dummy.position.set(wx, 0.05, wz); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
      dummy.updateMatrix(); walkPool.setMatrixAt(w++, dummy.matrix);
      dummy.position.set(wx, 0.07, wz); dummy.updateMatrix(); roadPool.setMatrixAt(r++, dummy.matrix);
      const horiz = (inB(x - 1, z) && S.grid[idx(x - 1, z)] === T.ROAD) || (inB(x + 1, z) && S.grid[idx(x + 1, z)] === T.ROAD);
      const vert = (inB(x, z - 1) && S.grid[idx(x, z - 1)] === T.ROAD) || (inB(x, z + 1) && S.grid[idx(x, z + 1)] === T.ROAD);
      const put = (rot) => {
        dummy.position.set(wx, 0.1, wz); dummy.rotation.set(0, rot, 0); dummy.scale.set(1, 1, 1);
        dummy.updateMatrix(); dashPool.setMatrixAt(d++, dummy.matrix);
      };
      if (horiz && !vert) put(Math.PI / 2);
      else if (vert && !horiz) put(0);
      else if (horiz && vert) { put(0); }
      // street lamp on quieter stretches
      if ((x * 7 + z * 13) % 4 === 0 && !(horiz && vert)) {
        dummy.position.set(wx + 0.75, 1.0, wz + 0.75); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
        dummy.updateMatrix(); lampPolePool.setMatrixAt(lp, dummy.matrix);
        dummy.position.set(wx + 0.75, 2.05, wz + 0.75); dummy.updateMatrix();
        lampHeadPool.setMatrixAt(lp, dummy.matrix);
        lp++;
      }
    } else if (t === T.R || t === T.C || t === T.I) {
      dummy.position.set(wx, 0.05, wz); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
      dummy.updateMatrix(); zonePool.setMatrixAt(zn, dummy.matrix);
      zonePool.setColorAt(zn, S.powerView && !S.powered[i] ? tmpC.set(0x333333) : zColors[t]);
      zn++;
    } else if (t === T.WIRE) {
      dummy.position.set(wx, 1.3, wz); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
      dummy.updateMatrix(); polePool.setMatrixAt(p, dummy.matrix);
      // crossarm follows the wire direction
      const hN = inB(x - 1, z) && (S.grid[idx(x - 1, z)] === T.WIRE || S.grid[idx(x - 1, z)] === T.COAL || S.grid[idx(x - 1, z)] === T.WIND);
      const hP = inB(x + 1, z) && (S.grid[idx(x + 1, z)] === T.WIRE || S.grid[idx(x + 1, z)] === T.COAL || S.grid[idx(x + 1, z)] === T.WIND);
      dummy.position.set(wx, 2.35, wz); dummy.rotation.set(0, hN || hP ? 0 : Math.PI / 2, 0); dummy.scale.set(1, 1, 1);
      dummy.updateMatrix(); armPool.setMatrixAt(p, dummy.matrix);
      p++;
    }
  }
  roadPool.count = r; walkPool.count = w; dashPool.count = d; zonePool.count = zn;
  polePool.count = p; armPool.count = p; lampPolePool.count = lp; lampHeadPool.count = lp;
  roadPool.instanceMatrix.needsUpdate = true; walkPool.instanceMatrix.needsUpdate = true;
  dashPool.instanceMatrix.needsUpdate = true;
  if (zonePool.instanceColor) zonePool.instanceColor.needsUpdate = true;
  polePool.instanceMatrix.needsUpdate = true; armPool.instanceMatrix.needsUpdate = true;
  lampPolePool.instanceMatrix.needsUpdate = true; lampHeadPool.instanceMatrix.needsUpdate = true;
  rebuildWires();
  refreshTrees();
  if (gridHelper) gridHelper.material.opacity = S.showGrid ? 0.10 : 0;
  if (gridMajor) gridMajor.material.opacity = S.showGrid ? 0.22 : 0;
}
const leafTint = new THREE.Color();
function refreshTrees() {
  let ti = 0, li = 0, pi = 0, fi = 0;
  const rng = mulberry32(S.seed);
  const spots = [];
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const t = S.grid[idx(x, z)];
    if (t === T.EMPTY && rng() < 0.06) spots.push([x, z, false]);
    if (t === T.PARK) { spots.push([x, z, true]); }
  }
  const flowerCols = [0xff6fa5, 0xffd94d, 0xffffff, 0xff8c42].map((c) => new THREE.Color(c));
  for (const [x, z, inPark] of spots) {
    const n = inPark ? 3 : 1;
    for (let k = 0; k < n; k++) {
      const ox = inPark ? (mulberry32(x * 99 + z * 7 + k)() - 0.5) * 1.3 : (rng() - 0.5) * 1.2;
      const oz = inPark ? (mulberry32(x * 13 + z * 91 + k)() - 0.5) * 1.3 : (rng() - 0.5) * 1.2;
      const s = 0.7 + rng() * 0.7;
      const pine = rng() < 0.35;
      dummy.position.set(tileWX(x) + ox, 0.55 * s, tileWZ(z) + oz);
      dummy.rotation.set(0, rng() * Math.PI, 0); dummy.scale.set(s, s, s); dummy.updateMatrix();
      if (ti < 900) trunkPool.setMatrixAt(ti, dummy.matrix);
      if (pine && pi < 400) {
        dummy.position.y = (1.1 + 1.0) * s - 0.25; dummy.updateMatrix();
        pinePool.setMatrixAt(pi, dummy.matrix);
        pinePool.setColorAt(pi, leafTint.set(0x2f7d3a).offsetHSL((rng() - 0.5) * 0.03, 0, (rng() - 0.5) * 0.08));
        pi++;
      } else if (!pine && li < 700) {
        dummy.position.y = (1.1 + 0.85) * s - 0.25;
        dummy.scale.set(s, s * 0.85, s); dummy.updateMatrix();
        leafPool.setMatrixAt(li, dummy.matrix);
        leafPool.setColorAt(li, leafTint.set(0x3f9147).offsetHSL((rng() - 0.5) * 0.05, (rng() - 0.5) * 0.1, (rng() - 0.5) * 0.09));
        li++;
      }
      ti++;
      if (inPark && fi < 498) {
        for (let f = 0; f < 2 && fi < 500; f++) {
          dummy.position.set(tileWX(x) + (rng() - 0.5) * 1.5, 0.22, tileWZ(z) + (rng() - 0.5) * 1.5);
          dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
          flowerPool.setMatrixAt(fi, dummy.matrix);
          flowerPool.setColorAt(fi, flowerCols[(rng() * flowerCols.length) | 0]);
          fi++;
        }
      }
      if (ti >= 900) break;
    }
    if (ti >= 900) break;
  }
  trunkPool.count = Math.min(ti, 900); leafPool.count = li; pinePool.count = pi; flowerPool.count = fi;
  trunkPool.instanceMatrix.needsUpdate = true; leafPool.instanceMatrix.needsUpdate = true;
  pinePool.instanceMatrix.needsUpdate = true; flowerPool.instanceMatrix.needsUpdate = true;
  if (leafPool.instanceColor) leafPool.instanceColor.needsUpdate = true;
  if (pinePool.instanceColor) pinePool.instanceColor.needsUpdate = true;
  if (flowerPool.instanceColor) flowerPool.instanceColor.needsUpdate = true;
}

// ---------- map gen ----------
function newMap(mapType, seed) {
  S.mapType = mapType; S.seed = seed;
  S.grid.fill(T.EMPTY); S.buildings.clear(); S.powered.fill(0);
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    if (tileIsWater(x, z)) S.grid[idx(x, z)] = T.WATER;
  }
  S.funds = 10000; S.day = 1; S.pop = 0; S.jobsTotal = 0; S.jobsFilled = 0;
  S.mwMade = 0; S.mwUsed = 0; S.happy = 70; S.selected = -1;
  S.demand = { R: 0.5, C: 0.3, I: 0.4 };
  agents.length = 0; trucks.length = 0;
  buildGround(); computePower(); refreshStatic(); rebuildBuildingMeshes();
  updateHUD(); setInspectorHome();
}

// ---------- power (OpenCity-style conduction) ----------
function computePower() {
  S.powered.fill(0);
  const cond = new Uint8Array(SIZE * SIZE);
  let supply = 0, demand = 0;
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const t = S.grid[idx(x, z)];
    if (t === T.WIRE || t === T.ROAD || t === T.COAL || t === T.WIND) cond[idx(x, z)] = 1;
    if (t === T.COAL) supply += PLANT_MW.coal;
    if (t === T.WIND) supply += PLANT_MW.wind;
  }
  // demand
  for (const [i, b] of S.buildings) {
    const t = S.grid[i];
    if (t === T.RB) demand += MW_USE.R[b.level];
    else if (t === T.CB) demand += MW_USE.C[b.level];
    else if (t === T.IB) demand += MW_USE.I[b.level];
  }
  S.mwMade = supply; S.mwUsed = demand;
  // connected set: tiles adjacent to conductor network (or plants)
  const seen = new Uint8Array(SIZE * SIZE);
  const q = [];
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const i = idx(x, z);
    if (S.grid[i] === T.COAL || S.grid[i] === T.WIND) { seen[i] = 1; q.push(i); }
  }
  // if no plant, wires alone conduct nothing
  while (q.length) {
    const cur = q.pop();
    const cx = cur % SIZE, cz = (cur / SIZE) | 0;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, nz = cz + dz;
      if (!inB(nx, nz)) continue;
      const ni = idx(nx, nz);
      if (seen[ni]) continue;
      if (cond[ni]) { seen[ni] = 1; q.push(ni); }
    }
  }
  const connected = [];
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const i = idx(x, z);
    const t = S.grid[i];
    const isConsumer = t === T.RB || t === T.CB || t === T.IB || t === T.R || t === T.C || t === T.I;
    if (!isConsumer) continue;
    let adj = false;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [0, 0]]) {
      const nx = x + dx, nz = z + dz;
      if (!inB(nx, nz)) continue;
      if (seen[idx(nx, nz)]) { adj = true; break; }
    }
    if (adj) connected.push(i);
  }
  if (supply >= demand) {
    for (const i of connected) S.powered[i] = 1;
  } else {
    // brownout: power in BFS order until supply runs out (Egregoria-ish triage)
    let budget = supply;
    // order by distance to plant: connected already roughly near; shuffle by index stable
    for (const i of connected) {
      const t = S.grid[i];
      const b = S.buildings.get(i);
      const need = b ? (t === T.RB ? MW_USE.R[b.level] : t === T.CB ? MW_USE.C[b.level] : MW_USE.I[b.level]) : 1;
      if (budget >= need) { S.powered[i] = 1; budget -= need; }
    }
  }
}

// ---------- happiness / demand / economy (Egregoria agents feed this) ----------
function nearCount(x, z, types, rad) {
  let n = 0;
  for (let dx = -rad; dx <= rad; dx++) for (let dz = -rad; dz <= rad; dz++) {
    if (dx === 0 && dz === 0) continue;
    const nx = x + dx, nz = z + dz;
    if (!inB(nx, nz)) continue;
    if (types.includes(S.grid[idx(nx, nz)])) n++;
  }
  return n;
}
function computeHappiness() {
  if (!S.pop) { S.happy = 70; return 70; }
  let unpowered = 0, parkNear = 0, polNear = 0, n = 0;
  for (const [i, b] of S.buildings) {
    const t = S.grid[i];
    if (t !== T.RB) continue;
    n++;
    const x = i % SIZE, z = (i / SIZE) | 0;
    if (!S.powered[i]) unpowered++;
    if (nearCount(x, z, [T.PARK], 4) > 0) parkNear++;
    if (nearCount(x, z, [T.IB, T.COAL], 4) > 0) polNear++;
  }
  if (!n) { S.happy = 70; return 70; }
  const unemp = S.pop ? clamp(1 - S.jobsFilled / Math.max(1, S.pop * 0.55), 0, 1) : 0;
  let h = 72;
  h -= (unpowered / n) * 25;
  h += (parkNear / n) * 10;
  h -= (polNear / n) * 14;
  h -= unemp * 12;
  h -= (S.tax - 9) * 1.6;
  if (S.mwUsed > S.mwMade) h -= 8;
  S.happy = clamp(Math.round(h), 0, 100);
  return S.happy;
}
function computeDemand() {
  const cap = 900;
  const workers = S.pop * 0.55;
  const openJobs = Math.max(0, S.jobsTotal - S.jobsFilled);
  const goodsShort = commercialGoodsShortage();
  let R = 0.55 + openJobs * 0.02 + (S.happy - 65) * 0.015 - S.pop / cap - (S.tax - 9) * 0.03;
  let C = (S.pop - S.jobsTotal * 0.4) * 0.008 + (S.happy - 60) * 0.008 - goodsShort * 0.2;
  let I = (workers - S.jobsFilled) * 0.02 + 0.25 - S.jobsTotal * 0.001 + goodsShort * 0.3;
  if (S.pop < 20) { R = 0.8; C = 0.1; I = 0.35; }
  S.demand.R = clamp(R, -1, 1); S.demand.C = clamp(C, -1, 1); S.demand.I = clamp(I, -1, 1);
}
function commercialGoodsShortage() {
  let need = 0, have = 0;
  for (const [i, b] of S.buildings) {
    if (S.grid[i] === T.CB) { need += b.level * 10; have += b.goods || 0; }
  }
  if (!need) return 0;
  return clamp(1 - have / need, 0, 1);
}
function recount() {
  let pop = 0, jt = 0;
  for (const [i, b] of S.buildings) {
    const t = S.grid[i];
    if (t === T.RB) { pop += (POP[b.level] || 0); }
    else if (t === T.CB) jt += JOBS_C[b.level] || 0;
    else if (t === T.IB) jt += JOBS_I[b.level] || 0;
  }
  S.pop = pop; S.jobsTotal = jt;
  S.jobsFilled = Math.min(jt, Math.floor(pop * 0.55 * (0.6 + S.happy / 250)));
}
function dailyEconomy() {
  recount();
  computeHappiness(); computeDemand();
  const income = S.jobsFilled * S.tax * 0.55 + S.pop * S.tax * 0.22 + S.jobsTotal * 0.4;
  let roads = 0, wires = 0, coal = 0, wind = 0, parks = 0;
  for (let i = 0; i < SIZE * SIZE; i++) {
    const t = S.grid[i];
    if (t === T.ROAD) roads++; else if (t === T.WIRE) wires++;
    else if (t === T.COAL) coal++; else if (t === T.WIND) wind++; else if (t === T.PARK) parks++;
  }
  const expense = roads * 0.15 + wires * 0.05 + coal * 25 + wind * 5 + parks * 0.6 + S.pop * 0.12;
  S.funds = Math.round((S.funds + income - expense) * 10) / 10;
  // commercial consumes goods, industry produces
  for (const [, b] of S.buildings) {
    if (b.goods === undefined) b.goods = 0;
  }
  for (const [i, b] of S.buildings) {
    if (S.grid[i] === T.IB && S.powered[i]) b.goods = Math.min(60, (b.goods || 0) + b.level * 3);
    if (S.grid[i] === T.CB) b.goods = Math.max(0, (b.goods || 0) - b.level * 1.2);
  }
  if (S.funds < 0 && S.day % 3 === 0) toast('⚠️ Treasury empty! Raise taxes or cut power costs.', 'bad');
}

// ---------- growth ----------
function adjacentRoad(x, z) {
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]])
    if (inB(x + dx, z + dz) && S.grid[idx(x + dx, z + dz)] === T.ROAD) return true;
  return false;
}
function tryGrow(rng) {
  const spots = { R: [], C: [], I: [] };
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const t = S.grid[idx(x, z)];
    if (t === T.R) spots.R.push([x, z]);
    else if (t === T.C) spots.C.push([x, z]);
    else if (t === T.I) spots.I.push([x, z]);
  }
  const attempt = (list, demKey, bType) => {
    if (!list.length) return;
    const dem = S.demand[demKey];
    if (dem < 0.12) return;
    const tries = Math.min(list.length, 2 + Math.ceil(dem * 4));
    for (let k = 0; k < tries; k++) {
      const [x, z] = list[(rng() * list.length) | 0];
      const i = idx(x, z);
      if (S.grid[i] !== T.R && S.grid[i] !== T.C && S.grid[i] !== T.I) continue;
      if (!adjacentRoad(x, z)) continue;
      if (!S.powered[i] && rng() < 0.7) continue; // mostly need power
      const pol = nearCount(x, z, [T.IB, T.COAL], 3);
      const park = nearCount(x, z, [T.PARK], 3);
      let level = 1;
      const roll = rng() + dem * 0.3 + (S.happy - 60) * 0.004 + park * 0.08 - pol * 0.12 - (bType === T.IB && pol ? 0 : 0);
      if (roll > 0.9) level = 3; else if (roll > 0.62) level = 2;
      if (bType === T.RB && pol > 2 && level > 1) level = 1;
      S.grid[i] = bType;
      S.buildings.set(i, {
        level, variant: 1 + ((rng() * 4) | 0),
        goods: 0, happy: S.happy,
      });
      spawnBuildingMesh(x, z);
      refreshStatic();
      assignJobs();
      break;
    }
  };
  attempt(spots.R, 'R', T.RB); attempt(spots.C, 'C', T.CB); attempt(spots.I, 'I', T.IB);
}

// ---------- agents (Egregoria-style commuters + freight) ----------
const agents = [];   // {home, work, path:[[x,z]..], seg, t, speed, kind:'car'|'walk', color}
const trucks = [];   // {from, to, path, seg, t}
const agentColor = new THREE.Color();
function nearestRoad(x, z) {
  if (S.grid[idx(x, z)] === T.ROAD) return [x, z];
  let best = null, bd = 1e9;
  for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
    const nx = x + dx, nz = z + dz;
    if (!inB(nx, nz)) continue;
    if (S.grid[idx(nx, nz)] !== T.ROAD) continue;
    const d = Math.abs(dx) + Math.abs(dz);
    if (d < bd) { bd = d; best = [nx, nz]; }
  }
  return best;
}
function bfsPath(a, b) {
  if (!a || !b) return null;
  const key = (x, z) => z * SIZE + x;
  const prev = new Map(); const q = [a];
  prev.set(key(a[0], a[1]), null);
  let found = false, guard = 0;
  while (q.length && guard++ < 3000) {
    const [cx, cz] = q.shift();
    if (cx === b[0] && cz === b[1]) { found = true; break; }
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx, nz = cz + dz;
      if (!inB(nx, nz)) continue;
      if (S.grid[idx(nx, nz)] !== T.ROAD) continue;
      const k = key(nx, nz);
      if (prev.has(k)) continue;
      prev.set(k, [cx, cz]);
      q.push([nx, nz]);
    }
  }
  if (!found && !(a[0] === b[0] && a[1] === b[1])) return null;
  const path = [b]; let cur = b;
  while (cur && !(cur[0] === a[0] && cur[1] === a[1])) {
    cur = prev.get(key(cur[0], cur[1]));
    if (cur) path.push(cur);
  }
  path.reverse();
  return path;
}
function assignJobs() {
  recount();
  // rebuild agent list from scratch (cheap at this scale, keeps consistency)
  agents.length = 0;
  const homes = [], works = [];
  for (const [i, b] of S.buildings) {
    const t = S.grid[i], x = i % SIZE, z = (i / SIZE) | 0;
    if (t === T.RB) { const cap = Math.min(POP[b.level], 8); for (let k = 0; k < cap; k++) homes.push(i); }
    else if (t === T.CB || t === T.IB) {
      const cap = Math.min(t === T.CB ? JOBS_C[b.level] : JOBS_I[b.level], 8);
      for (let k = 0; k < cap; k++) works.push(i);
    }
  }
  const rng = mulberry32(S.day * 101 + 7);
  const n = Math.min(200, homes.length, works.length + 10);
  const palette = [0xe74c3c, 0x3498db, 0xf1c40f, 0x9b59b6, 0x1abc9c, 0xe67e22, 0xecf0f1];
  for (let k = 0; k < n; k++) {
    const home = homes[(rng() * homes.length) | 0];
    const work = works.length ? works[(rng() * works.length) | 0] : home;
    const hx = home % SIZE, hz = (home / SIZE) | 0;
    const wx = work % SIZE, wz = (work / SIZE) | 0;
    const a = nearestRoad(hx, hz), bpt = nearestRoad(wx, wz);
    const path = (a && bpt) ? bfsPath(a, bpt) : null;
    agents.push({
      home, work, path, seg: 0, t: rng(),
      speed: 0.35 + rng() * 0.5,
      dir: rng() < 0.5 ? 1 : -1,
      kind: rng() < 0.62 ? 'car' : 'walk',
      color: palette[(rng() * palette.length) | 0],
      phase: rng(),
    });
  }
  // freight trucks: industry -> commercial
  trucks.length = 0;
  const inds = [...S.buildings.keys()].filter((i) => S.grid[i] === T.IB);
  const coms = [...S.buildings.keys()].filter((i) => S.grid[i] === T.CB);
  for (let k = 0; k < Math.min(40, inds.length * 2); k++) {
    if (!inds.length || !coms.length) break;
    const from = inds[(rng() * inds.length) | 0], to = coms[(rng() * coms.length) | 0];
    const a = nearestRoad(from % SIZE, (from / SIZE) | 0), bpt = nearestRoad(to % SIZE, (to / SIZE) | 0);
    const path = (a && bpt) ? bfsPath(a, bpt) : null;
    if (path && path.length > 1) trucks.push({ from, to, path, seg: 0, t: rng(), delivered: false });
  }
}
function updateAgents(dt) {
  let ci = 0, fi = 0;
  const dayPhase = (S.dayFrac + S.day) % 2; // commute rhythm
  for (const a of agents) {
    let wx = 0, wz = 0, show = true, isCar = a.kind === 'car';
    // commute direction flips morning/evening (Egregoria daily rhythm)
    const outbound = (S.timeOfDay > 0.25 && S.timeOfDay < 0.6) ? true : a.phase > 0.5;
    if (!a.path || a.path.length < 2) {
      const h = a.home; wx = tileWX(h % SIZE); wz = tileWZ((h / SIZE) | 0);
      show = (a.phase * 7 + S.day) % 3 < 2;
      isCar = false;
    } else {
      const L = a.path.length - 1;
      const span = 14; // seconds per full trip at speed 1
      let u = ((performance.now() / 1000) * a.speed / span + a.t) % 2;
      if (u > 1) u = 2 - u;
      if (!outbound) u = 1 - u;
      const f = u * L, s0 = Math.min(L - 1, Math.floor(f)), ft = f - s0;
      const A = a.path[s0], B = a.path[s0 + 1];
      wx = lerp(tileWX(A[0]), tileWX(B[0]), ft);
      wz = lerp(tileWZ(A[1]), tileWZ(B[1]), ft);
      if (a.kind === 'walk') { wx += 0.55; wz += 0.15 * Math.sin(performance.now() / 180 + a.t * 9); }
    }
    if (!show) continue;
    dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
    if (isCar && ci < MAXA - 40) {
      dummy.position.set(wx, 0.35, wz); dummy.updateMatrix();
      carPool.setMatrixAt(ci, dummy.matrix);
      carPool.setColorAt(ci, agentColor.set(a.color));
      dummy.position.set(wx, 0.61, wz - 0.05); dummy.updateMatrix();
      cabinPool.setMatrixAt(ci, dummy.matrix);
      ci++;
    } else if (!isCar && fi < MAXA) {
      dummy.position.set(wx, 0.36, wz); dummy.updateMatrix();
      folkPool.setMatrixAt(fi, dummy.matrix);
      folkPool.setColorAt(fi, agentColor.set(a.color));
      fi++;
    }
  }
  for (const tr of trucks) {
    if (!tr.path || ci >= MAXA) continue;
    const L = tr.path.length - 1;
    tr.t += dt * 0.06;
    if (tr.t >= 1) {
      tr.t = 0;
      // deliver goods on arrival
      const cb = S.buildings.get(tr.to), ib = S.buildings.get(tr.from);
      if (cb && ib && (ib.goods || 0) >= 4) {
        ib.goods -= 4; cb.goods = Math.min(60, (cb.goods || 0) + 4);
      }
      // pick a new destination sometimes
      if (Math.random() < 0.4) { assignJobsLight(tr); continue; }
    }
    const f = tr.t * L, s0 = Math.min(L - 1, Math.floor(f)), ft = f - s0;
    const A = tr.path[s0], B = tr.path[s0 + 1];
    dummy.position.set(lerp(tileWX(A[0]), tileWX(B[0]), ft), 0.42, lerp(tileWZ(A[1]), tileWZ(B[1]), ft));
    dummy.rotation.set(0, 0, 0); dummy.scale.set(1.15, 1.15, 1.3); dummy.updateMatrix();
    carPool.setMatrixAt(ci, dummy.matrix);
    carPool.setColorAt(ci, agentColor.set(0x8a6f3c));
    dummy.position.y = 0.74; dummy.updateMatrix();
    cabinPool.setMatrixAt(ci, dummy.matrix);
    ci++;
  }
  // hide rest
  dummy.position.set(0, -50, 0); dummy.scale.set(0.001, 0.001, 0.001); dummy.rotation.set(0, 0, 0); dummy.updateMatrix();
  for (let k = ci; k < carPool.count; k++) { carPool.setMatrixAt(k, dummy.matrix); cabinPool.setMatrixAt(k, dummy.matrix); }
  for (let k = fi; k < folkPool.count; k++) folkPool.setMatrixAt(k, dummy.matrix);
  carPool.count = MAXA; cabinPool.count = MAXA; folkPool.count = MAXA;
  carPool.instanceMatrix.needsUpdate = true; cabinPool.instanceMatrix.needsUpdate = true;
  folkPool.instanceMatrix.needsUpdate = true;
  if (carPool.instanceColor) carPool.instanceColor.needsUpdate = true;
  if (folkPool.instanceColor) folkPool.instanceColor.needsUpdate = true;
}
function assignJobsLight(tr) {
  const coms = [...S.buildings.keys()].filter((i) => S.grid[i] === T.CB);
  if (!coms.length) return;
  const to = coms[(Math.random() * coms.length) | 0];
  const a = nearestRoad(tr.from % SIZE, (tr.from / SIZE) | 0), bpt = nearestRoad(to % SIZE, (to / SIZE) | 0);
  const path = (a && bpt) ? bfsPath(a, bpt) : null;
  if (path && path.length > 1) { tr.to = to; tr.path = path; }
}

// ---------- build actions ----------
function canAfford(c) { return S.funds >= c; }
function spend(c) { S.funds = Math.round((S.funds - c) * 10) / 10; }
function paintAt(x, z) {
  if (!inB(x, z)) return;
  const i = idx(x, z), t = S.grid[i];
  const tool = S.tool;
  if (tool === 'select') { S.selected = i; showInspector(i); return; }
  if (t === T.WATER) { return; }
  if (tool === 'bulldoze') {
    if (t === T.EMPTY || t === T.WATER) return;
    S.grid[i] = T.EMPTY; S.buildings.delete(i);
    computePower(); refreshStatic(); rebuildBuildingMeshes(); assignJobs(); recount(); updateHUD();
    blip(180, 0.1, 0.06);
    if (S.selected === i) setInspectorHome();
    return;
  }
  const place = { road: T.ROAD, wire: T.WIRE, res: T.R, com: T.C, ind: T.I, park: T.PARK, coal: T.COAL, wind: T.WIND }[tool];
  const cost = { road: COST.road, wire: COST.wire, res: COST.R, com: COST.C, ind: COST.I, park: COST.park, coal: COST.coal, wind: COST.wind }[tool];
  if (place === undefined) return;
  if (t !== T.EMPTY && !(t === T.R || t === T.C || t === T.I)) {
    if (!(tool === 'road' && t === T.WIRE) && !(tool === 'wire' && t === T.ROAD)) return;
  }
  if (!canAfford(cost)) { toast('Not enough funds! ($' + cost + ' needed)', 'bad'); blip(140, 0.15, 0.06); return; }
  // power plants / park replace zone tiles
  S.grid[i] = place;
  if (place === T.ROAD || place === T.WIRE || place === T.PARK || place === T.COAL || place === T.WIND) S.buildings.delete(i);
  if (place === T.COAL || place === T.WIND) S.buildings.delete(i);
  spend(cost);
  computePower(); refreshStatic(); rebuildBuildingMeshes(); recount(); computeDemand(); updateHUD();
  blip(tool === 'road' ? 520 : 660, 0.05, 0.04);
}

// ---------- picking + input ----------
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pickTile(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
  ndc.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
  ray.setFromCamera(ndc, camera);
  // intersect y=0 plane
  const o = ray.ray.origin, d = ray.ray.direction;
  if (Math.abs(d.y) < 1e-6) return null;
  const t = -o.y / d.y;
  if (t < 0) return null;
  const wx = o.x + d.x * t, wz = o.z + d.z * t;
  const x = Math.floor(wx / TILE + SIZE / 2), z = Math.floor(wz / TILE + SIZE / 2);
  if (!inB(x, z)) return null;
  return { x, z };
}
const pointers = new Map(); // active canvas pointers (mouse + touch)
let lDown = false, rDown = false, mDown = false, shiftPan = false, lastPX = 0, lastPY = 0, moved = 0;
let pinch = null; // {d0, ang0, mx, my} when two fingers down
let cursor = null;
function ensureCursor() {
  if (cursor) return;
  cursor = new THREE.Mesh(new THREE.BoxGeometry(TILE * 0.98, 0.3, TILE * 0.98),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
  scene.add(cursor);
}
function pinchState() {
  const p = [...pointers.values()];
  const dx = p[0].x - p[1].x, dy = p[0].y - p[1].y;
  return { d: Math.hypot(dx, dy), ang: Math.atan2(dy, dx), mx: (p[0].x + p[1].x) / 2, my: (p[0].y + p[1].y) / 2 };
}
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointerdown', (e) => {
  try { canvas.setPointerCapture(e.pointerId); } catch { /* noop */ }
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, button: e.button });
  if (pointers.size === 2) {
    lDown = rDown = mDown = false; // painting pauses during gestures
    pinch = pinchState();
    return;
  }
  if (e.button === 0) {
    lDown = true; moved = 0;
    shiftPan = !!e.shiftKey;
    if (!shiftPan) { const p = pickTile(e); if (p) paintAt(p.x, p.z); }
  }
  if (e.button === 2) rDown = true;
  if (e.button === 1) mDown = true;
  lastPX = e.clientX; lastPY = e.clientY;
});
canvas.addEventListener('pointermove', (e) => {
  const rec = pointers.get(e.pointerId);
  if (rec) { rec.x = e.clientX; rec.y = e.clientY; }
  if (pointers.size === 2 && pinch) {
    // IsoCity-style touch: pinch zoom, two-finger pan, twist rotate
    const cur = pinchState();
    if (pinch.d > 10 && cur.d > 10) {
      goal.dist = clamp(goal.dist * (pinch.d / cur.d), 26, 175);
      cam.autoFit = false;
    }
    panGoal(-(cur.mx - pinch.mx), -(cur.my - pinch.my));
    let da = cur.ang - pinch.ang;
    da = Math.atan2(Math.sin(da), Math.cos(da));
    goal.yaw -= da;
    pinch = cur;
    updateCamBar();
    return;
  }
  const dx = e.clientX - lastPX, dy = e.clientY - lastPY;
  lastPX = e.clientX; lastPY = e.clientY;
  if (lDown) {
    if (shiftPan) { panGoal(-dx, -dy); return; }
    moved += Math.abs(dx) + Math.abs(dy);
    if (S.tool !== 'select' && moved > 3) { const p = pickTile(e); if (p) paintAt(p.x, p.z); }
  }
  if (rDown) panGoal(-dx, -dy);
  if (mDown) {
    goal.yaw -= dx * 0.005;
    goal.pitch = clamp(goal.pitch + dy * 0.004, 0.25, 1.35);
    if (cam.mode === 'iso') { cam.mode = 'orbit'; camera.fov = ORBIT_FOV; camera.updateProjectionMatrix(); }
    updateCamBar();
  }
  ensureCursor();
  const p = pickTile(e);
  if (p) {
    cursor.visible = true;
    cursor.position.set(tileWX(p.x), 0.2, tileWZ(p.z));
    const col = { select: 0xffffff, road: 0x9aa0aa, res: 0x4ade80, com: 0x60a5fa, ind: 0xfbbf24, powerline: 0xfde047, coal: 0xf87171, wind: 0xa7f3d0, park: 0x34d399, bulldoze: 0xef4444 }[S.tool] ?? 0xffffff;
    cursor.material.color.set(col);
  } else if (cursor) cursor.visible = false;
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinch = null;
  if (pointers.size === 0) { lDown = rDown = mDown = false; shiftPan = false; }
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('dblclick', () => frameCity(false));
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  goal.dist = clamp(goal.dist * (1 + Math.sign(e.deltaY) * 0.09), 26, 175);
  cam.autoFit = false;
  updateCamBar();
}, { passive: false });

// keyboard (OpenCity-flavoured)
const TOOL_LABEL = { select: '🔍 Query', road: '🛣️ Road', res: '🏠 Residential', com: '🏬 Commercial', ind: '🏭 Industrial', powerline: '⚡ Power line', coal: '🔥 Coal plant', wind: '🌬️ Wind turbine', park: '🌳 Park', bulldoze: '💥 Bulldoze' };
function setTool(t) {
  S.tool = t;
  document.querySelectorAll('#toolbar .tool[data-tool]').forEach((b) => b.classList.toggle('active', b.dataset.tool === t));
  $('tool-status').textContent = TOOL_LABEL[t] + (t === 'select' ? ' — click a tile for details' : ' — drag on the map to paint · right-drag pans');
}
document.querySelectorAll('#toolbar .tool[data-tool]').forEach((b) => b.addEventListener('click', () => { setTool(b.dataset.tool); blip(700, 0.04, 0.03); }));
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  const k = e.key.toLowerCase();
  const map = { r: 'res', c: 'com', i: 'ind', p: 'road', l: 'powerline', e: 'coal', t: 'wind', k: 'park', x: 'bulldoze', q: 'select', v: 'select' };
  if (map[k]) setTool(map[k]);
  else if (k === ' ') { e.preventDefault(); togglePause(); }
  else if (k === '1') setSpeed(1); else if (k === '2') setSpeed(2); else if (k === '3') setSpeed(3);
  else if (k === 'o') togglePowerView(); else if (k === 'g') toggleGrid();
  else if (k === 'h' || k === '?') toggleHelp();
  else if (k === 'm') toggleSound();
  else if (k === 'f') frameCity(false);
  else if (k === 'u') toggleCamMode();
  else if (k === 'n') toggleInspector();
  else if (k === 'f5') { e.preventDefault(); saveGame(); }
  else if (k === 'f9') { e.preventDefault(); loadGame(); }
  const pan = 3.2;
  let nav = false;
  if (k === 'w' || k === 'arrowup') { goal.tz -= pan; nav = true; }
  if (k === 's' || k === 'arrowdown') { goal.tz += pan; nav = true; }
  if (k === 'a' || k === 'arrowleft') { goal.tx -= pan; nav = true; }
  if (k === 'd' || k === 'arrowright') { goal.tx += pan; nav = true; }
  if (k === 'pageup' || k === ',') { goal.yaw += 0.12; nav = true; }
  if (k === 'pagedown' || k === '.') { goal.yaw -= 0.12; nav = true; }
  if (k === '+' || k === '=') { goal.dist = clamp(goal.dist * 0.9, 26, 175); cam.autoFit = false; nav = true; }
  if (k === '-' || k === '_') { goal.dist = clamp(goal.dist * 1.1, 26, 175); cam.autoFit = false; nav = true; }
  goal.tx = clamp(goal.tx, -HALF * 1.5, HALF * 1.5); goal.tz = clamp(goal.tz, -HALF * 1.5, HALF * 1.5);
  if (nav) {
    if (k === 'w' || k === 's' || k === 'a' || k === 'd' || k.startsWith('arrow')) cam.autoFit = false;
    updateCamBar();
  }
});

// ---------- UI ----------
function setSpeed(n) {
  S.speed = n; S.paused = false;
  for (const [id, v] of [['btn-speed0', 0], ['btn-speed1', 1], ['btn-speed2', 2]])
    $(id).classList.toggle('active', (S.paused ? 0 : S.speed) === v);
}
function togglePause() {
  S.paused = !S.paused;
  for (const [id, v] of [['btn-speed0', 0], ['btn-speed1', 1], ['btn-speed2', 2]])
    $(id).classList.toggle('active', (S.paused ? 0 : S.speed) === v);
}
function togglePowerView() { S.powerView = !S.powerView; $('btn-power-view').classList.toggle('on', S.powerView); refreshStatic(); toast(S.powerView ? '💡 Power overlay on — grey zones lack power' : '💡 Power overlay off'); }
function toggleGrid() { S.showGrid = !S.showGrid; $('btn-grid').classList.toggle('on', S.showGrid); refreshStatic(); }
function toggleSound() { S.sound = !S.sound; $('btn-sound').textContent = S.sound ? '🔊' : '🔇'; $('btn-sound').classList.toggle('on', S.sound); }
function toggleHelp(force) {
  const h = $('help');
  const show = force !== undefined ? force : h.classList.contains('hidden');
  h.classList.toggle('hidden', !show);
}
$('btn-speed0').onclick = () => { S.paused = true; setSpeedUI(); };
$('btn-speed1').onclick = () => { S.paused = false; S.speed = 1; setSpeedUI(); };
$('btn-speed2').onclick = () => { S.paused = false; S.speed = 3; setSpeedUI(); };
function setSpeedUI() { for (const [id, v] of [['btn-speed0', 0], ['btn-speed1', 1], ['btn-speed2', 2]]) $(id).classList.toggle('active', (S.paused ? 0 : S.speed) === v); }
$('btn-help').onclick = () => toggleHelp();
$('btn-close-help').onclick = () => toggleHelp(false);
$('btn-sound').onclick = toggleSound;
$('btn-power-view').onclick = togglePowerView;
$('btn-grid').onclick = toggleGrid;
function toggleInspector(force) {
  const el = $('inspector');
  const show = force !== undefined ? force : el.classList.contains('hidden-panel');
  el.classList.toggle('hidden-panel', !show);
  $('btn-info').classList.toggle('on', show);
}
// camera bar (IsoCity-style on-screen controls: everything clickable, touch friendly)
function stepZoom(f) { goal.dist = clamp(goal.dist * f, 26, 175); cam.autoFit = false; updateCamBar(); }
function stepRotate(d) {
  if (cam.mode === 'iso') goal.yaw += d > 0 ? Math.PI / 4 : -Math.PI / 4; // snap 45°
  else goal.yaw += d > 0 ? 0.26 : -0.26;
  updateCamBar();
}
$('cam-zin').onclick = () => { stepZoom(0.85); blip(700, 0.04, 0.03); };
$('cam-zout').onclick = () => { stepZoom(1.18); blip(560, 0.04, 0.03); };
$('cam-rotl').onclick = () => stepRotate(1);
$('cam-rotr').onclick = () => stepRotate(-1);
$('cam-fit').onclick = () => { frameCity(false); toast('⛶ City framed to fit the window.', ''); };
$('cam-iso').onclick = () => toggleCamMode();
$('compass').onclick = () => frameCity(false);
$('btn-info').onclick = () => toggleInspector();
$('tax').oninput = (e) => { S.tax = +e.target.value; $('tax-val').textContent = S.tax + '%'; };
$('btn-save').onclick = saveGame; $('btn-load').onclick = loadGame;
$('btn-clear').onclick = () => { if (confirm('Abandon this city and start over?')) { newMap(S.mapType, (Math.random() * 1e9) | 0); toast('🌱 New frontier surveyed. Good luck, Mayor!', 'good'); } };
$('btn-new-plain').onclick = () => { newMap('plain', (Math.random() * 1e9) | 0); toast('🌾 Settled the plains.', 'good'); };
$('btn-new-lake').onclick = () => { newMap('lake', (Math.random() * 1e9) | 0); toast('🌊 Lakeside charter signed.', 'good'); };
$('btn-new-hill').onclick = () => { newMap('hill', (Math.random() * 1e9) | 0); toast('⛰️ Highland charter signed.', 'good'); };

const TILE_NAME = { 0: 'Open land', 1: 'Water', 2: 'Road', 3: 'Power line', 4: 'Residential zone', 5: 'Commercial zone', 6: 'Industrial zone', 7: 'Homes', 8: 'Shops & offices', 9: 'Factories', 10: 'Coal power plant', 11: 'Wind turbine', 12: 'Park' };
function setInspectorHome() {
  $('insp-title').textContent = `Day ${S.day} — ${S.pop} citizens`;
  $('insp-body').innerHTML = `<div class="kv">
    <span>Treasury</span><b>$${Math.round(S.funds).toLocaleString()}</b>
    <span>Power</span><b>${S.mwMade} / ${S.mwUsed} MW</b>
    <span>Jobs</span><b>${S.jobsFilled} / ${S.jobsTotal}</b>
    <span>Mood</span><b>${S.happy} / 100</b></div>
    <div class="bar"><div style="width:${S.happy}%;background:${S.happy > 60 ? '#4ade80' : S.happy > 40 ? '#fbbf24' : '#f87171'}"></div></div>
    <p class="hint">Tip: industry makes <b>freight</b> 🚚 that shops need. Watch the vans! Unpowered grey buildings shrink the economy.</p>`;
}
function showInspector(i) {
  const x = i % SIZE, z = (i / SIZE) | 0, t = S.grid[i];
  const b = S.buildings.get(i);
  let html = `<div class="kv"><span>Tile</span><b>${x}, ${z}</b><span>Type</span><b>${TILE_NAME[t]}</b>`;
  if (b && (t === T.RB || t === T.CB || t === T.IB)) {
    const kind = t === T.RB ? 'R' : t === T.CB ? 'C' : 'I';
    html += `<span>Level</span><b>${'★'.repeat(b.level)}</b>`;
    if (t === T.RB) html += `<span>Residents</span><b>${POP[b.level]}</b>`;
    if (t === T.CB) html += `<span>Jobs</span><b>${JOBS_C[b.level]}</b><span>Stock</span><b>${Math.round(b.goods || 0)}</b>`;
    if (t === T.IB) html += `<span>Jobs</span><b>${JOBS_I[b.level]}</b><span>Freight</span><b>${Math.round(b.goods || 0)}</b>`;
    html += `<span>Power</span><b>${S.powered[i] ? '⚡ on (' + MW_USE[kind][b.level] + ' MW)' : '❌ no power'}</b>`;
    html += `<span>Parks near</span><b>${nearCount(x, z, [T.PARK], 4) > 0 ? '🌳 yes' : '—'}</b>`;
    html += `<span>Pollution</span><b>${nearCount(x, z, [T.IB, T.COAL], 4) > 0 ? '🏭 nearby' : 'clean'}</b>`;
  }
  if (t === T.COAL) html += `<span>Output</span><b>${PLANT_MW.coal} MW</b><span>Upkeep</span><b>$25/day</b>`;
  if (t === T.WIND) html += `<span>Output</span><b>${PLANT_MW.wind} MW</b><span>Upkeep</span><b>$5/day</b>`;
  html += `</div><p class="hint">Press <kbd>X</kbd> then click to bulldoze · <kbd>R</kbd>/<kbd>C</kbd>/<kbd>I</kbd> to zone nearby</p>`;
  $('insp-title').textContent = TILE_NAME[t] + (S.powered[i] ? '' : (t >= 4 && t <= 9 ? ' (unpowered)' : ''));
  $('insp-body').innerHTML = html;
}
function updateHUD() {
  $('stat-funds').textContent = '$' + Math.round(S.funds).toLocaleString();
  $('stat-funds').style.color = S.funds < 0 ? '#f87171' : '';
  $('stat-pop').textContent = S.pop.toLocaleString();
  $('stat-jobs').textContent = `${S.jobsFilled}/${S.jobsTotal}`;
  $('stat-power').textContent = `${S.mwMade}/${S.mwUsed} MW`;
  $('stat-power').style.color = S.mwUsed > S.mwMade ? '#f87171' : '';
  $('stat-happy').textContent = S.happy + '%';
  $('stat-date').textContent = 'Day ' + S.day;
  const setBar = (id, v) => {
    const el = $(id);
    const pct = Math.abs(v) * 50;
    el.style.width = pct + '%';
    el.style.left = v >= 0 ? '50%' : (50 - pct) + '%';
    el.style.opacity = Math.abs(v) < 0.12 ? 0.25 : 1;
  };
  setBar('rci-r', S.demand.R); setBar('rci-c', S.demand.C); setBar('rci-i', S.demand.I);
}

// ---------- save / load ----------
function saveGame(silent) {
  try {
    const data = {
      v: 1, seed: S.seed, mapType: S.mapType, funds: S.funds, day: S.day, tax: S.tax,
      grid: Array.from(S.grid),
      buildings: [...S.buildings.entries()],
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    if (!silent) toast('💾 City saved.', 'good');
  } catch { toast('Save failed (storage blocked).', 'bad'); }
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) { toast('No saved city yet — press 💾 Save first.', 'bad'); return; }
    const d = JSON.parse(raw);
    S.seed = d.seed; S.mapType = d.mapType; S.funds = d.funds; S.day = d.day; S.tax = d.tax || 9;
    S.grid = Uint8Array.from(d.grid);
    S.buildings = new Map(d.buildings);
    S.powered = new Uint8Array(SIZE * SIZE);
    $('tax').value = S.tax; $('tax-val').textContent = S.tax + '%';
    buildGround(); computePower(); refreshStatic(); rebuildBuildingMeshes();
    assignJobs(); recount(); computeHappiness(); computeDemand(); updateHUD(); setInspectorHome();
    toast('📂 City loaded — Day ' + S.day + '.', 'good');
  } catch { toast('Load failed — save is corrupt.', 'bad'); }
}

// ---------- day/night ----------
const skyCol = { top: new THREE.Color(), hor: new THREE.Color() };
const C_TOP_DAY = new THREE.Color(0x2f6fd0), C_TOP_SET = new THREE.Color(0x3a4a8f), C_TOP_NIGHT = new THREE.Color(0x050914);
const C_HOR_DAY = new THREE.Color(0xcfe8f5), C_HOR_SET = new THREE.Color(0xff9a56), C_HOR_NIGHT = new THREE.Color(0x0d1526);
function updateSky() {
  // timeOfDay 0..1 ; 0.25 sunrise, 0.5 noon, 0.75 sunset
  const t = S.timeOfDay;
  const dayness = clamp(Math.sin(t * Math.PI * 2 - 0.5) * 0.5 + 0.62, 0, 1);
  const night = 1 - dayness;
  const ang = t * Math.PI * 2;
  const sunEl = Math.sin(ang);
  const duskF = clamp(1 - Math.abs(sunEl) * 2.6, 0, 1) * (dayness > 0.05 ? 1 : 0);
  sun.position.set(Math.cos(ang) * 80, Math.sin(ang) * 70 + 20, 30);
  sun.intensity = 0.06 + dayness * 2.3;
  if (duskF > 0.4) sun.color.set(0xffab63);
  else sun.color.setHSL(0.1, 0.45, lerp(0.6, 0.88, dayness));
  hemi.intensity = 0.22 + dayness * 0.6;
  moon.intensity = night * 0.5;
  // sky gradient: day -> dusk -> night
  skyCol.top.copy(C_TOP_DAY).lerp(C_TOP_NIGHT, night).lerp(C_TOP_SET, duskF * 0.55);
  skyCol.hor.copy(C_HOR_DAY).lerp(C_HOR_NIGHT, night).lerp(C_HOR_SET, duskF * 0.7);
  skyUni.topColor.value.copy(skyCol.top);
  skyUni.horizonColor.value.copy(skyCol.hor);
  skyUni.sunDir.value.copy(sun.position).normalize();
  skyUni.sunColor.value.set(duskF > 0.4 ? 0xff8a3c : 0xfff3d6);
  skyUni.nightF.value = night;
  scene.fog.color.copy(skyCol.hor).lerp(skyCol.top, 0.35);
  if (starMat) starMat.opacity = night * 0.9;
  cloudMat.opacity = lerp(0.28, 0.94, dayness);
  cloudMat.color.setHSL(0.6, 0.1, lerp(0.25, 1.0, dayness) - duskF * 0.15);
  if (duskF > 0.3) cloudMat.color.lerp(new THREE.Color(0xffb38a), duskF * 0.5);
  // night life: lamps, windows, beacons, headlights, downtown glow, water
  if (lampHeadMat) lampHeadMat.emissiveIntensity = 0.15 + night * 2.6;
  if (cabinMat) cabinMat.emissiveIntensity = night * 1.8;
  if (beaconMat) beaconMat.emissiveIntensity = (performance.now() / 600) % 2 < 1 ? 3.2 : 0.25;
  for (const pl of nightLights) pl.intensity = night * 150;
  if (waterMat) {
    waterMat.color.set(0x9fd0f0).lerp(new THREE.Color(0x0a1a33), night);
    if (duskF > 0.3) waterMat.color.lerp(new THREE.Color(0xd98a4e), duskF * 0.35);
  }
  const winGlow = lerp(1.7, 0.12, dayness);
  for (const [, m] of matCache) m.emissiveIntensity = winGlow;
  if (bldGroup) bldGroup.children.forEach((g) => {
    (g.userData.mats || []).forEach((m) => {
      if (m.userData && m.userData.baseEmissive !== undefined) m.emissiveIntensity = winGlow;
    });
  });
}

// ---------- main loop ----------
let lastT = performance.now(), dayAcc = 0;
const DAY_LEN = 2.6;
const rngSim = mulberry32(12345);
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min(0.1, (now - lastT) / 1000);
  lastT = now;
  const rate = S.paused ? 0 : S.speed;
  // advance clock
  S.timeOfDay = (S.timeOfDay + dt * 0.02 * (rate || 0)) % 1;
  if (rate > 0) {
    dayAcc += dt * rate;
    S.dayFrac = (dayAcc / DAY_LEN) % 1;
    if (dayAcc >= DAY_LEN) {
      dayAcc = 0; S.day++;
      computePower(); dailyEconomy(); tryGrow(rngSim);
      computePower(); assignJobs();
      rebuildBuildingMeshes(); refreshStatic(); updateHUD();
      if (S.selected >= 0 && S.tool === 'select') showInspector(S.selected); else if (S.day % 3 === 0) setInspectorHome();
      if (S.day % 10 === 0) saveGame(true);
      if (S.day === 2) toast('💡 Tip: build Wind + Wires before zoning — unpowered zones stall.', '');
    }
  }
  updateAgents(dt * (rate || 0.15));
  // animate wind + smoke + water
  for (const w of windRotors) w.hub.rotation.z += dt * (0.8 + (rate || 0)) * w.speed;
  if (smokeSys && smokePts.length) {
    const p = smokeGeo.attributes.position;
    for (let i = 0; i < smokePts.length; i++) {
      const s = smokePts[i];
      s.life += dt * 0.22;
      if (s.life > 1) s.life = 0;
      p.setY(i, s.y + s.life * 3.2);
      p.setX(i, s.x + Math.sin(s.life * 6 + i * 1.7) * 0.6 * s.life);
    }
    p.needsUpdate = true;
  }
  if (waterSurf) {
    waterSurf.position.y = -0.55 + Math.sin(now / 1400) * 0.05;
    if (waterMat && waterMat.map) { waterMat.map.offset.x = (now / 26000) % 1; waterMat.map.offset.y = (now / 34000) % 1; }
  }
  for (const cl of clouds) {
    cl.position.x += cl.userData.v * dt;
    if (cl.position.x > 115) cl.position.x = -115;
  }
  for (let wi = 0; wi < warnMeshes.length; wi++) {
    const wm = warnMeshes[wi];
    wm.position.y = 3.6 + Math.sin(now / 300 + wi * 1.3) * 0.18;
    wm.rotation.y += dt * 2;
  }
  updateSky();
  dampCamera(dt);
  updateCamera();
  renderer.render(scene, camera);
}

// ---------- boot ----------
function boot() {
  // try autosave first
  let loaded = false;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) { loadGame(); loaded = true; }
  } catch { /* ignore */ }
  if (!loaded) newMap('plain', S.seed);
  setTool('select');
  setSpeedUI();
  frameCity(true);
  updateCamBar();
  if (innerWidth <= 900) toggleInspector(false);
  $('loading').classList.add('done');
  animate();
  // starter hint + demo town so first paint isn't empty
  if (!loaded) {
    setTimeout(() => {
      toast('🏗️ Painting a starter hamlet — remix it or 🗑️ clear it!', 'good');
      demoTown();
    }, 600);
    setTimeout(() => toggleHelp(false), 400);
  }
}
function demoTown() {
  // tiny pre-built crossroads so agents/traffic are alive on first load
  const c = SIZE >> 1;
  S.funds -= 0;
  const put = (dx, dz, t) => { const x = c + dx, z = c + dz; if (inB(x, z) && S.grid[idx(x, z)] !== T.WATER) S.grid[idx(x, z)] = t; };
  for (let k = -6; k <= 6; k++) { put(k, 0, T.ROAD); put(0, k, T.ROAD); }
  for (let k = -5; k <= 5; k += 2) { put(k, 1, T.WIRE); }
  put(1, -1, T.WIND);
  put(-1, 1, T.WIND);
  for (let k = -5; k <= 5; k++) {
    if (Math.abs(k) < 1) continue;
    put(k, 2, T.R); put(k, -2, T.R); put(2, k, T.C); put(-2, k, T.I);
  }
  put(3, 3, T.PARK); put(-3, -3, T.PARK);
  computePower(); recount(); computeDemand();
  // force-grow a few level-1 buildings instantly
  const rng = mulberry32(42);
  for (let n = 0; n < 6; n++) tryGrow(rng);
  computePower(); recount(); computeHappiness(); assignJobs();
  refreshStatic(); rebuildBuildingMeshes(); updateHUD(); setInspectorHome();
}
window.__city = { S, frameCity, toggleCamMode, setTool };
boot();
