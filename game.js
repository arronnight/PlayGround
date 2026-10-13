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
const T = { EMPTY: 0, WATER: 1, ROAD: 2, WIRE: 3, R: 4, C: 5, I: 6, RB: 7, CB: 8, IB: 9, COAL: 10, WIND: 11, PARK: 12, SOLAR: 13, SCHOOL: 14, PLAZA: 15, O: 16, OB: 17, F: 18, FB: 19, CLINIC: 20, POLICE: 21, MONUMENT: 22, AVENUE: 23, DIRT: 24 };
const COST = { road: 10, wire: 5, R: 5, C: 5, I: 5, park: 20, coal: 500, wind: 200, solar: 150, school: 300, plaza: 40, office: 5, farm: 5, avenue: 25, dirt: 4, clinic: 250, police: 250, monument: 2000 };
const PLANT_MW = { coal: 150, wind: 35, solar: 30 };
const SCHOOL_MW = 5, SCHOOL_UPKEEP = 10, SOLAR_UPKEEP = 2, PLAZA_UPKEEP = 1;
const CLINIC_MW = 4, CLINIC_UPKEEP = 8, POLICE_MW = 4, POLICE_UPKEEP = 8, MONUMENT_UPKEEP = 25;
const MONUMENT_MIN_POP = 400;
// any tile vehicles may route over
const isDrive = (t) => t === T.ROAD || t === T.AVENUE || t === T.DIRT;
const SAVE_KEY = 'openegregoria-save-v1';

const POP = { 1: 6, 2: 16, 3: 34 };
const JOBS_C = { 1: 6, 2: 18, 3: 38 };
const JOBS_I = { 1: 9, 2: 22, 3: 48 };
const JOBS_O = { 1: 8, 2: 24, 3: 50 };
const JOBS_F = { 1: 4, 2: 8, 3: 12 };
const MW_USE = { R: [0, 3, 5, 8], C: [0, 5, 9, 14], I: [0, 9, 15, 24], O: [0, 6, 11, 18], F: [0, 2, 4, 7] };

// ---------- state ----------
const S = {
  tool: 'select', seed: 20261013, mapType: 'plain',
  grid: new Uint8Array(SIZE * SIZE),
  sculpt: new Float32Array(SIZE * SIZE), // SDF-style terrain offsets (raise/lower brush)
  buildings: new Map(), // idx -> {level, residents, workers, jobsTotal, goods, happy, variant}
  powered: new Uint8Array(SIZE * SIZE),
  funds: 10000, day: 1, speed: 1, paused: false,
  tax: 9, pop: 0, jobsTotal: 0, jobsFilled: 0,
  mwMade: 0, mwUsed: 0, happy: 70, links: 0,
  demand: { R: 0.5, C: 0.3, I: 0.4, O: 0.1, F: 0.3 },
  powerView: false, showGrid: false, sound: true,
  selected: -1, timeOfDay: 0.35, dayFrac: 0, simTime: 0,
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
renderer.shadowMap.autoUpdate = true;
const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

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
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
sun.shadow.camera.far = 220; sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.5; sun.shadow.radius = 4;
scene.add(sun); scene.add(sun.target);
const moon = new THREE.DirectionalLight(0x8fa8ff, 0.0);
moon.position.set(-40, 50, -30); scene.add(moon);
// warm downtown glow at night (a few real lights, no shadows — cheap)
const nightLights = [];
for (const [lx, lz] of [[0, 0], [12, -10], [-12, 10]]) {
  const pl = new THREE.PointLight(0xffb46b, 0, 36, 1.8);
  pl.position.set(lx, 6, lz); scene.add(pl); nightLights.push(pl);
}

// image-based lighting: day + night environments captured once, swapped
// with hysteresis so PBR glass/metal/paint reflect a real sky
const pmrem = new THREE.PMREMGenerator(renderer);
function makeEnvScene(skyCol, groundCol, sunCol, sunPos, sunSize) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(skyCol);
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(60, 24),
    new THREE.MeshBasicMaterial({ color: groundCol })
  );
  ground.rotation.x = -Math.PI / 2; ground.position.y = -4;
  s.add(ground);
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(sunSize, 12, 10),
    new THREE.MeshBasicMaterial({ color: sunCol })
  );
  orb.position.copy(sunPos);
  s.add(orb);
  return s;
}
const envDay = pmrem.fromScene(makeEnvScene(0x9ec8ee, 0x5a7a4a, 0xfff4e0, new THREE.Vector3(30, 34, 18), 6), 0).texture;
const envNight = pmrem.fromScene(makeEnvScene(0x060a14, 0x0c1210, 0xbdd0ff, new THREE.Vector3(-24, 30, -18), 3), 0).texture;
pmrem.dispose();
scene.environment = envDay;
let envIsNight = false;

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

// ---------- terrain (Bonsai-inspired: layered noise + moisture biomes + sculpting) ----------
const WATER_LEVEL = -0.35;
function sstep(a, b, v) {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}
// continuous base height per tile (float coords OK); sculpt offsets add on top
function baseTileHeight(x, z) {
  const s = S.seed;
  const n1 = fbm(x * 0.13 + s * 0.0013, z * 0.13 - s * 0.0009);
  const nx = x / SIZE - 0.5, nz = z / SIZE - 0.5;
  const warp = (fbm(x * 0.05 + 11 + s * 0.0007, z * 0.05 + 5) - 0.5) * 0.22; // domain-warped coasts
  const edge = Math.sqrt(nx * nx + nz * nz) + warp;
  let h;
  if (S.mapType === 'archi') h = (fbm(x * 0.16 + s * 0.0011, z * 0.16 + 3) - 0.55) * 7.0;
  else if (S.mapType === 'volcano') {
    const dx = nx - 0.03, dz = nz + 0.02, d = Math.sqrt(dx * dx + dz * dz);
    h = 4.6 * Math.max(0, 1 - d / 0.42) - 4.8 * Math.exp(-(d * d) / 0.0064) + (n1 - 0.5) * 1.6;
  } else if (S.mapType === 'hill') h = 1.6 + (n1 - 0.5) * 6.5;
  else if (S.mapType === 'lake') {
    const lx = nx - 0.08, lz = nz + 0.05, ld2 = lx * lx + lz * lz;
    h = 0.5 + (n1 - 0.5) * 3.2 - 2.6 * Math.exp(-ld2 / 0.04);
  } else h = 0.5 + (n1 - 0.5) * 3.0; // plain
  h -= sstep(0.46, 0.68, edge) * (S.mapType === 'archi' ? 2.5 : 5.0); // continental shelf down to sea
  return h;
}
function tileSurfaceH(x, z) {
  return baseTileHeight(clamp(x, 0, SIZE - 1), clamp(z, 0, SIZE - 1)) + S.sculpt[idx(clamp(x, 0, SIZE - 1), clamp(z, 0, SIZE - 1))];
}
function sculptAt(fx, fz) {
  // bilinear sculpt offsets over tile centers (centers sit at integer coords)
  const x0 = clamp(Math.floor(fx), 0, SIZE - 1), z0 = clamp(Math.floor(fz), 0, SIZE - 1);
  const x1 = Math.min(x0 + 1, SIZE - 1), z1 = Math.min(z0 + 1, SIZE - 1);
  const tx = clamp(fx - x0, 0, 1), tz = clamp(fz - z0, 0, 1);
  return lerp(lerp(S.sculpt[idx(x0, z0)], S.sculpt[idx(x1, z0)], tx), lerp(S.sculpt[idx(x0, z1)], S.sculpt[idx(x1, z1)], tx), tz);
}
function surfAt(fx, fz) {
  // bilinear base height + sculpt, for the smooth ground mesh
  const x0 = clamp(Math.floor(fx), 0, SIZE - 1), z0 = clamp(Math.floor(fz), 0, SIZE - 1);
  const x1 = Math.min(x0 + 1, SIZE - 1), z1 = Math.min(z0 + 1, SIZE - 1);
  const tx = clamp(fx - x0, 0, 1), tz = clamp(fz - z0, 0, 1);
  const H = (x, z) => baseTileHeight(x, z) + S.sculpt[idx(x, z)];
  return lerp(lerp(H(x0, z0), H(x1, z0), tx), lerp(H(x0, z1), H(x1, z1), tx), tz);
}
function isWaterTile(x, z) {
  return tileSurfaceH(x, z) < WATER_LEVEL;
}
function moistAt(x, z) {
  return fbm(x * 0.09 + 51 + S.seed * 0.0005, z * 0.09 + 13 - S.seed * 0.0003);
}
function tempAt(x, z, h) {
  const lat = (z / SIZE - 0.5) * 2;
  return clamp(0.85 - Math.max(0, h) * 0.14 - Math.abs(lat) * 0.3, 0, 1);
}
// Holdridge-flavoured biome ids: 0 water, 1 beach, 2 meadow, 3 forest, 4 dry, 5 rock, 6 snow
function biomeOf(h, m, t) {
  if (h < WATER_LEVEL) return 0;
  if (h < 0.15) return 1;
  if (h > 2.6) return 6;
  if (h > 1.5) return 5;
  if (m > 0.58 && t > 0.4) return 3;
  if (m < 0.34) return 4;
  if (t < 0.32) return 5;
  return 2;
}
const BIOME_NAMES = ['water', 'beach', 'meadow', 'forest', 'dry grass', 'rock', 'snow'];
function tileBiome(x, z) {
  const h = tileSurfaceH(x, z);
  return BIOME_NAMES[biomeOf(h, moistAt(x, z), tempAt(x, z, h))];
}
function groundYAt(wx, wz) {
  // continuous scenic height for the big ground mesh
  const fx = wx / TILE + SIZE / 2 - 0.5, fz = wz / TILE + SIZE / 2 - 0.5;
  const inside = fx > -1.5 && fz > -1.5 && fx < SIZE + 0.5 && fz < SIZE + 0.5;
  const d = Math.max(Math.abs(wx), Math.abs(wz)) / (HALF + 22);
  const hills = (fbm(wx * 0.03 + 5, wz * 0.03 + 9) - 0.45) * 9;
  if (inside) {
    const h = surfAt(fx, fz);
    if (h < WATER_LEVEL) return -1.4;
    return h * 0.35;
  }
  return lerp(0, -3.2, clamp((d - 0.5) / 0.5, 0, 1)) + hills * clamp((d - 0.45) * 2, 0, 1);
}

let groundMesh = null, waterMesh = null, waterSurf = null, waterMat = null, gridHelper = null, gridMajor = null;
let groundDirty = false;
function waveTexture() {
  const S = 256;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, S, S);
  grad.addColorStop(0, '#aecadd'); grad.addColorStop(0.5, '#bcd6ec'); grad.addColorStop(1, '#a8c6dd');
  g.fillStyle = grad; g.fillRect(0, 0, S, S);
  for (let k = 0; k < 60; k++) {
    g.strokeStyle = `rgba(255,255,255,${0.10 + (k % 3) * 0.08})`;
    g.lineWidth = 1 + (k % 2);
    g.beginPath();
    const y = (k * 47) % S;
    for (let x = 0; x <= S; x += 6) g.lineTo(x, y + Math.sin(x * 0.15 + k) * 4);
    g.stroke();
  }
  for (let k = 0; k < 40; k++) {
    g.fillStyle = `rgba(70,110,150,${0.05 + (k % 4) * 0.02})`;
    g.beginPath(); g.ellipse((k * 89) % S, (k * 137) % S, 8 + (k % 5) * 6, 4 + (k % 3) * 4, k, 0, 7); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 7);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}
// fine grain multiplied over the vertex-colored terrain so close-ups stay crisp
function groundDetailTexture() {
  const S = 256;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, S, S);
  const r = mulberry32(1234);
  for (let k = 0; k < 9000; k++) {
    const v = 225 + ((r() * 30) | 0);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(r() * S, r() * S, 1.6, 1.6);
  }
  for (let k = 0; k < 260; k++) { // tiny blades / pebbles
    g.fillStyle = r() < 0.6 ? 'rgba(120,150,110,0.5)' : 'rgba(150,140,120,0.5)';
    const x = r() * S, y = r() * S;
    g.fillRect(x, y, 1.5, 3 + r() * 3);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(30, 30);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}
const groundDetailTex = groundDetailTexture();
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
  const cBed = new THREE.Color(0x274d42), cSand = new THREE.Color(0xe2cb92);
  const cMeadow = new THREE.Color(0x62b254), cForest = new THREE.Color(0x3d7a36);
  const cDry = new THREE.Color(0xa9bd5f), cRock = new THREE.Color(0x8d8f93);
  const cSnow = new THREE.Color(0xeef1f4), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const y = groundYAt(x, z);
    pos.setY(i, y);
    const fx = x / TILE + SIZE / 2 - 0.5, fz = z / TILE + SIZE / 2 - 0.5;
    const h = surfAt(fx, fz);
    const m = moistAt(fx, fz);
    const b = biomeOf(h, m, tempAt(fx, fz, h));
    const detail = fbm(x * 0.5 + 40, z * 0.5 + 2);
    if (b === 0) tmp.copy(cBed);
    else if (b === 1) tmp.copy(cSand);
    else if (b === 3) tmp.copy(cForest).lerp(cMeadow, detail * 0.45);
    else if (b === 4) tmp.copy(cDry).lerp(cMeadow, detail * 0.3);
    else if (b === 5) tmp.copy(cRock).lerp(cMeadow, detail * 0.25);
    else if (b === 6) tmp.copy(cSnow);
    else tmp.copy(cMeadow).lerp(cForest, detail * 0.35);
    const v = 0.93 + detail * 0.14;
    colors[i * 3] = tmp.r * v; colors[i * 3 + 1] = tmp.g * v; colors[i * 3 + 2] = tmp.b * v;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({ map: groundDetailTex, vertexColors: true, roughness: 1, metalness: 0 });
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
const avePool = makeInstanced(new THREE.BoxGeometry(1, 0.15, 1),
  new THREE.MeshStandardMaterial({ color: 0x3a3e46, roughness: 0.85 }), SIZE * SIZE);
const dirtPool = makeInstanced(new THREE.BoxGeometry(1, 0.12, 1),
  new THREE.MeshStandardMaterial({ color: 0x8a6f4d, roughness: 1 }), SIZE * SIZE);
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
// compact cars: ~1/5 of a tile wide, wheels sized to sit ON the road (top y=0.14)
const carPool = makeInstanced(new THREE.BoxGeometry(0.44, 0.26, 0.8),
  new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.6 }), MAXA);
const cabinMat = new THREE.MeshStandardMaterial({ color: 0x18242f, roughness: 0.12, metalness: 0.9, emissive: 0xffca7a, emissiveIntensity: 0 });
const cabinPool = makeInstanced(new THREE.BoxGeometry(0.36, 0.18, 0.42), cabinMat, MAXA);
// modeled details: turned wheels, glowing head/taillights (instanced per car)
const wheelGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.1, 10);
wheelGeo.rotateZ(Math.PI / 2); // axle along X
const wheelPool = makeInstanced(wheelGeo,
  new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.9 }), MAXA * 4);
const headMat = new THREE.MeshStandardMaterial({ color: 0xd8dee2, emissive: 0xfff2c4, emissiveIntensity: 0.25, roughness: 0.3 });
const headPool = makeInstanced(new THREE.BoxGeometry(0.1, 0.08, 0.05), headMat, MAXA * 2);
const tailMat = new THREE.MeshStandardMaterial({ color: 0x7a1010, emissive: 0xff2222, emissiveIntensity: 0.5, roughness: 0.4 });
const tailPool = makeInstanced(new THREE.BoxGeometry(0.1, 0.08, 0.05), tailMat, MAXA * 2);
const folkPool = makeInstanced(new THREE.CapsuleGeometry(0.16, 0.3, 3, 8),
  new THREE.MeshStandardMaterial({ roughness: 0.9 }), MAXA);
carPool.castShadow = true; cabinPool.castShadow = false;
wheelPool.castShadow = false; headPool.castShadow = false; tailPool.castShadow = false;
folkPool.castShadow = false;
// rotate a car-local offset into world space for a given yaw
function carLocal(wx, wz, yaw, lx, lz) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  return [wx + lx * c + lz * s, wz - lx * s + lz * c];
}
// place one full vehicle; advances ci/wi/hi counters held in `st`
// heights stack from the road surface (top y=0.14): wheels touch it, body
// clears the axles, cabin + lights ride on the body. `lane` shifts the car
// onto its right-hand lane so opposing traffic no longer overlaps.
const ROAD_TOP = 0.14, LANE_OFF = 0.38;
function placeVehicle(st, wx, wz, yaw, sx, sy, sz, color) {
  const ci = st.ci;
  // right-hand lane offset, perpendicular to travel
  const rx = -Math.cos(yaw), rz = Math.sin(yaw);
  wx += rx * LANE_OFF; wz += rz * LANE_OFF;
  const axleY = ROAD_TOP + 0.13 * sy;
  const bodyY = axleY + 0.02 * sy + 0.13 * sy;
  dummy.rotation.set(0, yaw, 0);
  dummy.scale.set(sx, sy, sz);
  dummy.position.set(wx, bodyY, wz); dummy.updateMatrix();
  carPool.setMatrixAt(ci, dummy.matrix);
  carPool.setColorAt(ci, agentColor.set(color));
  {
    const [cx, cz] = carLocal(wx, wz, yaw, 0, -0.06 * sz);
    dummy.position.set(cx, bodyY + 0.13 * sy + 0.09 * sy, cz); dummy.updateMatrix();
    cabinPool.setMatrixAt(ci, dummy.matrix);
  }
  const ww = 0.22 * sx, wf = 0.26 * sz, wr = -0.26 * sz;
  for (const [lx, lz] of [[-ww, wf], [ww, wf], [-ww, wr], [ww, wr]]) {
    dummy.rotation.set(0, yaw, 0); dummy.scale.set(sx, sy, sz);
    const [px, pz] = carLocal(wx, wz, yaw, lx, lz);
    dummy.position.set(px, axleY, pz); dummy.updateMatrix();
    wheelPool.setMatrixAt(st.wi++, dummy.matrix);
  }
  for (const lx of [-0.13 * sx, 0.13 * sx]) {
    dummy.rotation.set(0, yaw, 0); dummy.scale.set(1, 1, 1);
    let [px, pz] = carLocal(wx, wz, yaw, lx, 0.41 * sz);
    dummy.position.set(px, bodyY + 0.02, pz); dummy.updateMatrix();
    headPool.setMatrixAt(st.hi, dummy.matrix);
    [px, pz] = carLocal(wx, wz, yaw, lx, -0.41 * sz);
    dummy.position.set(px, bodyY + 0.02, pz); dummy.updateMatrix();
    tailPool.setMatrixAt(st.hi, dummy.matrix);
    st.hi++;
  }
  st.ci++;
}

// ---------- regional connections ----------
// any drivable tile on the map border links a neighbouring town: markers,
// trade income and a commercial boost. No new tool needed — just pave there.
function linkName(x, z) {
  if (x === 0) return 'Westvale';
  if (x === SIZE - 1) return 'Eastport';
  if (z === 0) return 'Northgate';
  return 'Southbay';
}
function linkAt(x, z) {
  if (!inB(x, z)) return null;
  if (!isDrive(S.grid[idx(x, z)])) return null;
  if (x !== 0 && z !== 0 && x !== SIZE - 1 && z !== SIZE - 1) return null;
  return linkName(x, z);
}
const linkGroup = new THREE.Group(); scene.add(linkGroup);
const stubMat = new THREE.MeshStandardMaterial({ color: 0x2e3138, roughness: 0.9 });
const signTexCache = new Map();
function signTexture(name) {
  if (signTexCache.has(name)) return signTexCache.get(name);
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#0b4d2e'; g.fillRect(0, 0, 256, 64);
  g.strokeStyle = '#e8e8e8'; g.lineWidth = 4; g.strokeRect(4, 4, 248, 56);
  g.fillStyle = '#fff'; g.font = 'bold 25px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(name, 128, 35);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso;
  signTexCache.set(name, t); return t;
}
let linksBootstrapped = false, prevLinks = 0;
function refreshLinks() {
  for (const o of [...linkGroup.children]) { linkGroup.remove(o); o.geometry.dispose(); }
  const found = [];
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const name = linkAt(x, z);
    if (name) found.push([x, z, name]);
  }
  S.links = found.length;
  for (const [x, z, name] of found) {
    const ox = x === 0 ? -1 : x === SIZE - 1 ? 1 : 0;
    const oz = z === 0 ? -1 : z === SIZE - 1 ? 1 : 0;
    const wx = tileWX(x), wz = tileWZ(z);
    // stub road continuing past the border
    const stub = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 7), stubMat);
    stub.rotation.y = ox !== 0 ? Math.PI / 2 : 0;
    stub.position.set(wx + ox * 4.5, groundYAt(wx + ox * 4.5, wz + oz * 4.5) + 0.2, wz + oz * 4.5);
    stub.receiveShadow = true; linkGroup.add(stub);
    // gantry sign facing the city
    const yaw = Math.atan2(-ox, -oz);
    const px = -oz, pz = ox; // perpendicular
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6), roofMat);
      post.position.set(wx - ox * 0.6 + px * s * 1.15, 1.2, wz - oz * 0.6 + pz * s * 1.15);
      post.castShadow = true; linkGroup.add(post);
    }
    const board = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 0.62),
      new THREE.MeshBasicMaterial({ map: signTexture(name + '  →'), side: THREE.DoubleSide }));
    board.position.set(wx - ox * 0.6, 2.35, wz - oz * 0.6);
    board.rotation.y = yaw;
    linkGroup.add(board);
  }
  if (!linksBootstrapped) { linksBootstrapped = true; prevLinks = S.links; return; }
  if (S.links > prevLinks) {
    const fresh = found[found.length - 1];
    toast(`🔗 Connected to ${fresh[2]}! +$8/day trade income.`, 'good'); blip(880, 0.08, 0.05);
  }
  prevLinks = S.links;
}

let wireLines = null;
function rebuildWires() {
  if (wireLines) { scene.remove(wireLines); wireLines.geometry.dispose(); }
  const pts = [];
  const isPole = (x, z) => inB(x, z) && (S.grid[idx(x, z)] === T.WIRE || S.grid[idx(x, z)] === T.COAL || S.grid[idx(x, z)] === T.WIND || S.grid[idx(x, z)] === T.SOLAR);
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
// Original procedural facades painted to match the look of your 4 references
// (glass office grid / grungy concrete factory / brick apartments / atlas mix)
// — deliberately re-painted, not copied, so the repo ships copyright-clean.
// If you own licensed copies of those photos, drop them into ./assets/ and
// the game will auto-use them (see assets/README.md):
//   assets/office.jpg    -> commercial towers (ref 1 look)
//   assets/concrete.jpg  -> industrial halls  (ref 2 look)
//   assets/brick.jpg     -> residential blocks (ref 3 look)
//   assets/atlas.jpg     -> 4x5 contact sheet, auto-cut into 20 cells (ref 4)
const matCache = new Map();
const SITE_TEX = 1024;
function makeCanvas(s = SITE_TEX) {
  const c = document.createElement('canvas'); c.width = c.height = s;
  return [c, c.getContext('2d')];
}
function toTex(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}
function speckle(g, S2, rng, n = 600, alpha = 0.05) {
  const k = (S2 / 512) ** 2, px = Math.max(2, Math.round(S2 / 256));
  n = Math.round(n * k);
  for (let i = 0; i < n; i++) {
    g.fillStyle = `rgba(${rng() < 0.5 ? '255,255,255' : '0,0,0'},${(rng() * alpha).toFixed(3)})`;
    g.fillRect(rng() * S2, rng() * S2, px, px);
  }
}
// Ref 1: modern glass office grid — grey metal frame, blue glass, thin mullions
function paintOffice(g, e, S2, floors, litRatio, rng) {
  g.fillStyle = '#8f99a4'; g.fillRect(0, 0, S2, S2);
  e.fillStyle = '#000'; e.fillRect(0, 0, S2, S2);
  const cols = 7, rows = Math.max(4, floors + 2);
  const cw = S2 / cols, rh = S2 / rows;
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const x = q * cw, y = r * rh, pad = 2.5;
    const tone = 0.85 + rng() * 0.3;
    const lit = rng() < litRatio;
    const day = `rgb(${(106 * tone) | 0},${(128 * tone) | 0},${(152 * tone) | 0})`;
    g.fillStyle = lit ? '#c9b98a' : day;
    g.fillRect(x + pad, y + pad, cw - pad * 2, rh - pad * 2);
    // glass sheen: pale diagonal streak + top light
    g.fillStyle = 'rgba(255,255,255,0.20)';
    g.beginPath();
    g.moveTo(x + pad, y + rh - pad); g.lineTo(x + pad + cw * 0.45, y + pad);
    g.lineTo(x + pad + cw * 0.65, y + pad); g.lineTo(x + pad + cw * 0.2, y + rh - pad);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,0.28)'; g.fillRect(x + pad, y + pad, cw - pad * 2, 2);
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x + pad, y + rh - pad - 2, cw - pad * 2, 2);
    if (lit) {
      e.fillStyle = rng() < 0.5 ? '#ffc978' : '#ffe9a3';
      e.fillRect(x + pad, y + pad, cw - pad * 2, rh - pad * 2);
    }
  }
  // mullions
  g.fillStyle = 'rgba(52,58,66,0.9)';
  for (let q = 0; q <= cols; q++) g.fillRect(q * cw - 1.5, 0, 3, S2);
  for (let r = 0; r <= rows; r++) g.fillRect(0, r * rh - 1.5, S2, 3);
  speckle(g, S2, rng, 350, 0.04);
}
// Ref 2: grungy concrete factory — stained off-white, big multi-pane steel windows
function paintConcrete(g, e, S2, floors, litRatio, rng) {
  g.fillStyle = '#d5d1c7'; g.fillRect(0, 0, S2, S2);
  e.fillStyle = '#000'; e.fillRect(0, 0, S2, S2);
  // stains + streaks
  for (let k = 0; k < 40; k++) {
    const sx = rng() * S2, sy = rng() * S2, sw = 20 + rng() * 90, sh = 12 + rng() * 60;
    g.fillStyle = `rgba(${rng() < 0.6 ? '105,100,90' : '70,66,58'},${0.04 + rng() * 0.08})`;
    g.beginPath(); g.ellipse(sx, sy, sw, sh, rng() * 3, 0, 7); g.fill();
  }
  for (let k = 0; k < 26; k++) { // rain streaks under sills
    g.fillStyle = `rgba(90,85,75,${0.05 + rng() * 0.07})`;
    g.fillRect(rng() * S2, rng() * S2 * 0.5, 2 + rng() * 3, 40 + rng() * 90);
  }
  // pilasters
  const bays = 3;
  for (let b = 0; b <= bays; b++) {
    g.fillStyle = 'rgba(0,0,0,0.10)'; g.fillRect((b * S2) / bays - 7, 0, 14, S2);
    g.fillStyle = 'rgba(255,255,255,0.20)'; g.fillRect((b * S2) / bays + 7, 0, 3, S2);
  }
  const rowsN = 2;
  for (let r = 0; r < rowsN; r++) for (let b = 0; b < bays; b++) {
    const x0 = (b * S2) / bays + 22, y0 = 40 + (r * (S2 - 110)) / rowsN;
    const ww = S2 / bays - 44, wh = (S2 - 110) / rowsN - 26;
    g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x0 - 4, y0 - 4, ww + 8, wh + 8); // reveal shadow
    const px = 4, py = 5; // small panes per big window
    const pw = ww / px, ph = wh / py;
    for (let iy = 0; iy < py; iy++) for (let ix = 0; ix < px; ix++) {
      const broken = rng() < 0.08, lit = rng() < litRatio * 0.8;
      g.fillStyle = broken ? '#15181d' : lit ? '#c2ad7f' : `rgb(${(88 + rng() * 40) | 0},${(96 + rng() * 38) | 0},${(104 + rng() * 36) | 0})`;
      g.fillRect(x0 + ix * pw + 1, y0 + iy * ph + 1, pw - 2, ph - 2);
      g.fillStyle = 'rgba(255,255,255,0.16)';
      g.fillRect(x0 + ix * pw + 1, y0 + iy * ph + 1, pw - 2, 2);
      if (lit && !broken) { e.fillStyle = '#ffcf7d'; e.fillRect(x0 + ix * pw + 1, y0 + iy * ph + 1, pw - 2, ph - 2); }
    }
    // muntin bars
    g.fillStyle = '#3c3a35';
    for (let ix = 0; ix <= px; ix++) g.fillRect(x0 + ix * pw - 1, y0, 2, wh);
    for (let iy = 0; iy <= py; iy++) g.fillRect(x0, y0 + iy * ph - 1, ww, 2);
    // sill
    g.fillStyle = 'rgba(255,255,255,0.55)'; g.fillRect(x0 - 6, y0 + wh + 5, ww + 12, 5);
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x0 - 6, y0 + wh + 10, ww + 12, 3);
  }
  speckle(g, S2, rng, 500, 0.05);
  g.fillStyle = 'rgba(0,0,0,0.20)'; g.fillRect(0, 0, S2, 8);
}
// Ref 3: brick apartments — red-brown courses, white floor bands + framed windows
function paintBrick(g, e, S2, floors, litRatio, rng) {
  e.fillStyle = '#000'; e.fillRect(0, 0, S2, S2);
  // brick courses
  const bh = 8, bw = 26;
  for (let y = 0, row = 0; y < S2; y += bh, row++) {
    for (let x = -bw; x < S2 + bw; x += bw) {
      const ox = row % 2 ? bw / 2 : 0;
      const v = (rng() - 0.5) * 22;
      g.fillStyle = `rgb(${(148 + v) | 0},${(84 + v * 0.6) | 0},${(66 + v * 0.5) | 0})`;
      g.fillRect(x + ox + 1, y + 1, bw - 2, bh - 2);
    }
  }
  g.fillStyle = 'rgba(0,0,0,0.16)';
  for (let y = 0; y < S2; y += bh) g.fillRect(0, y, S2, 1);
  const rows = Math.max(3, floors + 1), cols = 4;
  const rh = S2 / rows, cw = S2 / cols;
  const curtain = ['#e8e2d2', '#d8b06a', '#7a4a38', '#2a3444'];
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const wx = q * cw + cw * 0.22, wy = r * rh + rh * 0.24;
    const ww = cw * 0.56, wh = rh * 0.52;
    // white concrete band above each floor
    g.fillStyle = 'rgba(240,236,226,0.92)'; g.fillRect(0, r * rh, S2, 5);
    // frame
    g.fillStyle = '#efeae0'; g.fillRect(wx - 5, wy - 5, ww + 10, wh + 10);
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(wx - 5, wy + wh + 5, ww + 10, 3);
    const pick = rng();
    const lit = rng() < litRatio;
    if (pick < 0.3) g.fillStyle = lit ? '#ffe2a0' : curtain[0];
    else if (pick < 0.5) g.fillStyle = lit ? '#ffc06a' : curtain[1];
    else if (pick < 0.65) g.fillStyle = curtain[2];
    else g.fillStyle = lit ? '#d8c690' : curtain[3];
    g.fillRect(wx, wy, ww, wh);
    // cross mullion + blind slats on some
    g.fillStyle = '#efeae0';
    g.fillRect(wx + ww / 2 - 1.5, wy, 3, wh); g.fillRect(wx, wy + wh / 2 - 1.5, ww, 3);
    if (pick < 0.3) {
      g.fillStyle = 'rgba(0,0,0,0.18)';
      for (let yy = wy + 4; yy < wy + wh; yy += 5) g.fillRect(wx, yy, ww, 1);
    }
    if (lit) { e.fillStyle = '#ffcf7d'; e.fillRect(wx, wy, ww, wh); }
  }
  speckle(g, S2, rng, 300, 0.04);
}
// Alt style C2: teal glass slab with white horizontal bands
function paintGlassTeal(g, e, S2, floors, litRatio, rng) {
  g.fillStyle = '#24343c'; g.fillRect(0, 0, S2, S2);
  e.fillStyle = '#000'; e.fillRect(0, 0, S2, S2);
  const rows = Math.max(4, floors + 2);
  const rh = S2 / rows;
  for (let r = 0; r < rows; r++) {
    const y = r * rh;
    const lit = rng() < litRatio;
    const tone = 0.85 + rng() * 0.3;
    g.fillStyle = lit ? '#c9b98a' : `rgb(${(64 * tone) | 0},${(110 * tone) | 0},${(122 * tone) | 0})`;
    g.fillRect(6, y + 8, S2 - 12, rh - 20);
    g.fillStyle = 'rgba(255,255,255,0.22)';
    g.fillRect(6, y + 8, S2 - 12, 3);
    g.fillRect(6, y + 8, 3, rh - 20);
    // vertical fins
    g.fillStyle = 'rgba(20,26,30,0.85)';
    for (let x = 40; x < S2; x += 64) g.fillRect(x, y + 8, 5, rh - 20);
    // white band between floors
    g.fillStyle = '#dfe3e6'; g.fillRect(0, y + rh - 12, S2, 12);
    g.fillStyle = 'rgba(0,0,0,0.2)'; g.fillRect(0, y + rh - 3, S2, 3);
    if (lit) { e.fillStyle = '#ffcf7d'; e.fillRect(6, y + 8, S2 - 12, rh - 20); }
  }
  speckle(g, S2, rng, 300, 0.04);
}
// Alt style I2: dark-red brick depot with tall doors + high small windows
function paintBrickDepot(g, e, S2, floors, litRatio, rng) {
  e.fillStyle = '#000'; e.fillRect(0, 0, S2, S2);
  const bh = 10, bw = 30;
  for (let y = 0, row = 0; y < S2; y += bh, row++) {
    for (let x = -bw; x < S2 + bw; x += bw) {
      const ox = row % 2 ? bw / 2 : 0;
      const v = (rng() - 0.5) * 20;
      g.fillStyle = `rgb(${(122 + v) | 0},${(62 + v * 0.6) | 0},${(48 + v * 0.5) | 0})`;
      g.fillRect(x + ox + 1, y + 1, bw - 2, bh - 2);
    }
  }
  g.fillStyle = 'rgba(0,0,0,0.2)';
  for (let y = 0; y < S2; y += bh) g.fillRect(0, y, S2, 1);
  // tall freight doors
  for (const dx of [S2 * 0.2, S2 * 0.62]) {
    g.fillStyle = 'rgba(25,28,32,0.92)'; g.fillRect(dx, S2 - 150, S2 * 0.22, 140);
    g.fillStyle = 'rgba(255,255,255,0.12)';
    for (let y = S2 - 144; y < S2 - 12; y += 12) g.fillRect(dx + 4, y, S2 * 0.22 - 8, 2);
    g.fillStyle = '#e8b93c'; g.fillRect(dx, S2 - 158, S2 * 0.22, 8);
  }
  // small high windows
  for (let f = 0; f < floors + 1; f++) for (let x = 0; x < 5; x++) {
    const lit = rng() < litRatio * 0.7;
    g.fillStyle = lit ? '#ffe9a3' : 'rgba(18,28,48,0.9)';
    g.fillRect(20 + x * ((S2 - 40) / 5), 26 + f * ((S2 - 220) / (floors + 1)), (S2 - 40) / 5 - 12, 34);
    if (lit) { e.fillStyle = '#ffcf7d'; e.fillRect(20 + x * ((S2 - 40) / 5), 26 + f * ((S2 - 220) / (floors + 1)), (S2 - 40) / 5 - 12, 34); }
  }
  speckle(g, S2, rng, 400, 0.05);
}
// Alt style R2: cream plaster with brown frames + balcony rails
function paintPlaster(g, e, S2, floors, litRatio, rng) {
  g.fillStyle = '#e3d5b8'; g.fillRect(0, 0, S2, S2);
  e.fillStyle = '#000'; e.fillRect(0, 0, S2, S2);
  const rows = Math.max(3, floors + 1), cols = 4;
  const rh = S2 / rows, cw = S2 / cols;
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const wx = q * cw + cw * 0.24, wy = r * rh + rh * 0.22;
    const ww = cw * 0.52, wh = rh * 0.5;
    g.fillStyle = 'rgba(120,80,50,0.55)'; g.fillRect(0, r * rh, S2, 4);
    g.fillStyle = '#5a3d2c'; g.fillRect(wx - 4, wy - 4, ww + 8, wh + 8);
    const lit = rng() < litRatio;
    g.fillStyle = lit ? '#ffdf9e' : `rgb(${(52 + rng() * 26) | 0},${(66 + rng() * 24) | 0},${(86 + rng() * 22) | 0})`;
    g.fillRect(wx, wy, ww, wh);
    g.fillStyle = '#5a3d2c';
    g.fillRect(wx + ww / 2 - 1.5, wy, 3, wh);
    // balcony rail
    g.fillStyle = 'rgba(40,30,24,0.9)';
    for (let bx = wx - 6; bx < wx + ww + 6; bx += 7) g.fillRect(bx, wy + wh + 3, 3, 12);
    g.fillRect(wx - 6, wy + wh + 13, ww + 12, 3);
    if (lit) { e.fillStyle = '#ffcf7d'; e.fillRect(wx, wy, ww, wh); }
  }
  speckle(g, S2, rng, 350, 0.04);
}
function facadeCanvases(style, floors, litRatio, rng) {
  const [c, g] = makeCanvas(), [ce, e] = makeCanvas();
  if (style === 'C') paintOffice(g, e, SITE_TEX, floors, litRatio, rng);
  else if (style === 'C2') paintGlassTeal(g, e, SITE_TEX, floors, litRatio, rng);
  else if (style === 'I') paintConcrete(g, e, SITE_TEX, floors, litRatio, rng);
  else if (style === 'I2') paintBrickDepot(g, e, SITE_TEX, floors, litRatio, rng);
  else if (style === 'R2') paintPlaster(g, e, SITE_TEX, floors, litRatio, rng);
  else paintBrick(g, e, SITE_TEX, floors, litRatio, rng);
  return [c, ce];
}
function buildingMaterial(type, level, variant) {
  const key = type + '-' + level + '-' + variant;
  if (matCache.has(key)) return matCache.get(key);
  const rng = mulberry32(variant * 7919 + level * 131 + type.length * 17);
  // atlas cell override: if the user supplied assets/atlas.jpg, mix its 20
  // cut cells in as variants (every 3rd variant) — see sliceAtlasImage().
  if (ExtTex.atlasCells.length && variant % 3 === 2) {
    const cell = ExtTex.atlasCells[variant % ExtTex.atlasCells.length];
    const m = new THREE.MeshStandardMaterial({
      map: cell.map, emissive: 0xffdf9a, emissiveMap: cell.map,
      emissiveIntensity: 0.15, roughness: 0.9, metalness: 0.05,
    });
    matCache.set(key, m); return m;
  }
  // variant 4 wears an alternate architectural style (same cache budget)
  const styles = { R: variant === 4 ? 'R2' : 'R', C: variant === 4 ? 'C2' : 'C', I: variant === 4 ? 'I2' : 'I', O: variant === 4 ? 'C2' : 'C', F: 'R2' };
  const floors = type === 'I' ? 2 + level : 2 + level * 2;
  const [c, ce] = facadeCanvases(styles[type], floors, (type === 'C' || type === 'O') ? 0.5 : 0.42, rng);
  const m = new THREE.MeshStandardMaterial({
    map: toTex(c), emissive: 0xffdf9a, emissiveMap: toTex(ce),
    emissiveIntensity: 0.15, roughness: (type === 'C' || type === 'O') ? 0.55 : 0.9,
    metalness: (type === 'C' || type === 'O') ? 0.25 : 0.05,
  });
  matCache.set(key, m); return m;
}
// ---------- optional licensed photo textures (user-supplied, ./assets/) ----------
// The game never hotlinks your URLs (CORS + offline + license). Instead, if YOU
// place licensed files in ./assets/, they override the procedural look-alikes:
// office.jpg / concrete.jpg / brick.jpg (full facades) + atlas.jpg (4x5 sheet).
const ExtTex = { atlasCells: [], loaded: false };
function sliceAtlasImage(img, cols, rows, gutter = 0.045) {
  const cells = [];
  const cw = img.width / cols, ch = img.height / rows;
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const sx = (q * cw + cw * gutter) | 0, sy = (r * ch + ch * gutter) | 0;
    const sw = (cw * (1 - gutter * 2)) | 0, sh = (ch * (1 - gutter * 2)) | 0;
    const [c, g] = makeCanvas(256);
    g.fillStyle = '#888'; g.fillRect(0, 0, 256, 256);
    g.drawImage(img, sx, sy, sw, sh, 0, 0, 256, 256);
    const map = toTex(c);
    cells.push({ map });
  }
  return cells;
}
function photosEnabled() {
  try {
    if (new URLSearchParams(location.search).has('photos')) return true;
    return localStorage.getItem('oe-photos') === '1';
  } catch { return false; }
}
function loadExternalTextures() {
  if (ExtTex.loaded) return;
  ExtTex.loaded = true;
  if (!photosEnabled()) return; // opt-in: keeps default console at 0 errors
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  // Probe with fetch first so missing optionals stay silent (no console 404s).
  const tryLoad = (url, onOk) => {
    fetch(url, { method: 'HEAD' }).then((r) => {
      if (!r.ok) return;
      loader.load(url, onOk, undefined, () => {});
    }).catch(() => {});
  };
  for (const url of ['assets/office.jpg', 'assets/concrete.jpg', 'assets/brick.jpg']) {
    tryLoad(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      ExtTex.atlasCells.push({ map: tex });
      matCache.clear(); rebuildBuildingMeshes();
    });
  }
  tryLoad('assets/atlas.jpg', (tex) => {
    const img = tex.image;
    if (!img || !img.width) return;
      // Ref 4 is a 4x5 contact sheet (568x708) — cut out the 20 facades,
      // trimming gutters so cells don't bleed into each other.
      ExtTex.atlasCells = sliceAtlasImage(img, 4, 5, 0.045);
      matCache.clear(); rebuildBuildingMeshes();
      toast(`🖼️ Atlas cut into ${ExtTex.atlasCells.length} facades.`, 'good');
    });
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

  if (t === T.RB || t === T.CB || t === T.IB || t === T.OB) {
    const kind = t === T.RB ? 'R' : t === T.CB ? 'C' : t === T.IB ? 'I' : 'O';
    const lv = b ? b.level : 1;
    const variant = b ? b.variant : 1;
    const mat = buildingMaterial(kind, lv, variant).clone();
    if (noPow) { mat.emissiveIntensity = 0; delete mat.userData.baseEmissive; }
    mat.userData.baseEmissive = 0.15;
    // subtle per-building tint so same-style neighbours don't clone-stamp
    mat.color.set([0xffffff, 0xfff1de, 0xe4edff, 0xffe4e4, 0xe6f3e6][variant % 5]);
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
      if (rng() < 0.35) {
        // side garage, rotation-aware
        const gx = Math.cos(rot) * (w / 2 + 0.4), gz = -Math.sin(rot) * (w / 2 + 0.4);
        const gar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 0.95),
          new THREE.MeshStandardMaterial({ color: 0xcfc4ae, roughness: 0.95 }));
        gar.position.set(gx, 0.4, gz); gar.rotation.y = rot;
        gar.castShadow = gar.receiveShadow = true; grp.add(gar);
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.04),
          new THREE.MeshStandardMaterial({ color: 0x6b6259, roughness: 0.8 }));
        door.position.set(gx + Math.sin(rot) * 0.49, 0.35, gz + Math.cos(rot) * 0.49);
        door.rotation.y = rot;
        grp.add(door);
      }
    } else {
      // mid/high-rise with setback crown + parapet + rooftop props
      const w = kind === 'R' ? 1.3 + lv * 0.15 : 1.5 + lv * 0.12;
      const d = w * (0.85 + rng() * 0.3);
      const h = (kind === 'I' ? 1.0 : kind === 'O' ? 1.7 : 1.4) + lv * (0.85 + rng() * 0.6) + ((kind === 'C' || kind === 'O') && lv === 3 ? 1.6 : 0);
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      body.position.y = h / 2 + 0.1; body.rotation.y = rot;
      body.castShadow = body.receiveShadow = true; grp.add(body);
      if (kind === 'R' && lv >= 2 && rng() < 0.45) {
        // french balconies riding on the body so they follow its rotation
        for (const [bx, by] of [[-w / 4, 0.3], [w / 4, 0.62]]) {
          const slab = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.28), trimMat);
          slab.position.set(bx, by * h, d / 2 + 0.13); slab.castShadow = true; body.add(slab);
          const rail = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.04), roofMat);
          rail.position.set(bx, by * h + 0.14, d / 2 + 0.25); body.add(rail);
        }
      }
      if (kind === 'I' && lv === 1 && rng() < 0.4) {
        // side shed for small factories
        const shed = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 1.0),
          new THREE.MeshStandardMaterial({ color: 0x8f9aa3, roughness: 0.9 }));
        shed.position.set(Math.cos(rot) * (w / 2 + 0.45), 0.4, -Math.sin(rot) * (w / 2 + 0.45));
        shed.rotation.y = rot; shed.castShadow = shed.receiveShadow = true; grp.add(shed);
      }
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
        if ((kind === 'R' || kind === 'C' || kind === 'O') && lv === 3 && rng() < 0.35) {
          // rooftop garden: soil bed + two saplings
          const bed = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.55),
            new THREE.MeshStandardMaterial({ color: 0x5a4632, roughness: 1 }));
          bed.position.set(cw * 0.2, topY + 0.1, -cd * 0.12); bed.rotation.y = rot; grp.add(bed);
          for (const [tx, tz] of [[-0.12, -0.1], [0.14, 0.12]]) {
            const sap = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.34, 6),
              new THREE.MeshStandardMaterial({ color: 0x3f9147, roughness: 1 }));
            sap.position.set(cw * 0.2 + tx, topY + 0.32, -cd * 0.12 + tz);
            sap.castShadow = true; grp.add(sap);
          }
        }
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
      if ((kind === 'C' || kind === 'O') && lv === 3) {
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
  } else if (t === T.FB) {
    // farmstead: crop rows + farmhouse, barn & silo by level
    const lv = b ? b.level : 1;
    const variant = b ? b.variant : 1;
    const fmat = buildingMaterial('F', lv, variant).clone();
    if (!S.powered[i]) { fmat.emissiveIntensity = 0; delete fmat.userData.baseEmissive; }
    fmat.userData.baseEmissive = 0.15;
    fmat.color.set([0xffffff, 0xfff1de, 0xe4edff, 0xf2f3e2][variant % 4]);
    grp.userData.mats = [fmat];
    const rowCols = [0x6fae4e, 0x8fbf5a, 0xd8c25a];
    const rows = 2 + lv;
    for (let rr = 0; rr < rows; rr++) {
      const row = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.09, 0.26),
        new THREE.MeshStandardMaterial({ color: rowCols[(rr + lv) % 3], roughness: 1 }));
      row.position.set(0, 0.05, -0.8 + rr * 0.34); row.receiveShadow = true; grp.add(row);
    }
    const house = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 0.7), fmat);
    house.position.set(0.45, 0.44, 0.55); house.rotation.y = (rng() - 0.5) * 0.2;
    house.castShadow = house.receiveShadow = true; grp.add(house);
    const hroof = new THREE.Mesh(new THREE.ConeGeometry(0.72, 0.4, 4), houseRoofMat);
    hroof.position.set(0.45, 0.95, 0.55); hroof.rotation.y = Math.PI / 4; hroof.castShadow = true; grp.add(hroof);
    if (lv >= 2) {
      const barn = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.65, 0.75),
        new THREE.MeshStandardMaterial({ color: 0xa03c30, roughness: 0.9 }));
      barn.position.set(-0.42, 0.44, 0.55); barn.rotation.y = (rng() - 0.5) * 0.15;
      barn.castShadow = barn.receiveShadow = true; grp.add(barn);
      const broof = new THREE.Mesh(new THREE.ConeGeometry(0.78, 0.42, 4),
        new THREE.MeshStandardMaterial({ color: 0x4a4d52, roughness: 0.9 }));
      broof.scale.set(1, 1, 0.8); broof.position.set(-0.42, 0.96, 0.55);
      broof.rotation.y = Math.PI / 4; broof.castShadow = true; grp.add(broof);
      const bdoor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.04), trimMat);
      bdoor.position.set(-0.42, 0.32, 0.94); grp.add(bdoor);
    }
    if (lv >= 3) {
      const silo = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.95, 10), tankMat);
      silo.position.set(-0.75, 0.55, -0.15); silo.castShadow = true; grp.add(silo);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.18, 10),
        new THREE.MeshStandardMaterial({ color: 0x8a4a3c, roughness: 0.85 }));
      cap.position.set(-0.75, 1.1, -0.15); grp.add(cap);
    }
    if (!S.powered[i]) {
      const warn = new THREE.Mesh(new THREE.OctahedronGeometry(0.22),
        new THREE.MeshBasicMaterial({ color: 0xffd23f }));
      warn.position.y = 2.4; grp.add(warn);
      warnMeshes.push(warn);
    }
  } else if (t === T.CLINIC) {
    podium(grp, 2.0, 2.0);
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.0),
      new THREE.MeshStandardMaterial({ color: 0xeef0f2, roughness: 0.85 }));
    block.position.set(0, 0.52, -0.25); block.castShadow = block.receiveShadow = true; grp.add(block);
    const roofC = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.1, 1.12), trimMat);
    roofC.position.set(0, 0.97, -0.25); roofC.castShadow = true; grp.add(roofC);
    // red cross sign, glowing at night
    const crossMat = new THREE.MeshStandardMaterial({ color: 0xc22a2a, emissive: 0xff4444, emissiveIntensity: 0.15, roughness: 0.5 });
    crossMat.userData.baseEmissive = 0.15;
    grp.userData.mats = [crossMat];
    const cv = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.06), crossMat);
    cv.position.set(0, 1.25, -0.25); grp.add(cv);
    const chh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.06), crossMat);
    chh.position.set(0, 1.25, -0.25); grp.add(chh);
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.4), roofMat);
    canopy.position.set(0, 0.42, 0.42); canopy.castShadow = true; grp.add(canopy);
    for (const [px] of [[-0.35, 0], [0.35, 0]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.36, 6), roofMat);
      leg.position.set(px, 0.22, 0.55); grp.add(leg);
    }
  } else if (t === T.POLICE) {
    podium(grp, 2.0, 2.0);
    const block = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x2e3d55, roughness: 0.85 }));
    block.position.set(0, 0.47, -0.25); block.castShadow = block.receiveShadow = true; grp.add(block);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.16, 1.02),
      new THREE.MeshStandardMaterial({ color: 0xe8ecf2, roughness: 0.7 }));
    stripe.position.set(0, 0.52, -0.25); grp.add(stripe);
    const roofP = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.1), roofMat);
    roofP.position.set(0, 0.87, -0.25); roofP.castShadow = true; grp.add(roofP);
    // roof light bar: red + blue, glowing at night
    const barR = new THREE.MeshStandardMaterial({ color: 0x881111, emissive: 0xff2222, emissiveIntensity: 0.2, roughness: 0.4 });
    const barB = new THREE.MeshStandardMaterial({ color: 0x112288, emissive: 0x3355ff, emissiveIntensity: 0.2, roughness: 0.4 });
    barR.userData.baseEmissive = 0.2; barB.userData.baseEmissive = 0.2;
    grp.userData.mats = [barR, barB];
    const lr = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.18), barR);
    lr.position.set(-0.14, 0.98, -0.25); grp.add(lr);
    const lb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.18), barB);
    lb.position.set(0.14, 0.98, -0.25); grp.add(lb);
  } else if (t === T.MONUMENT) {
    podium(grp, 2.0, 2.0);
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.16, 1.3), trimMat);
    step1.position.y = 0.18; step1.receiveShadow = step1.castShadow = true; grp.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.16, 0.95), trimMat);
    step2.position.y = 0.32; step2.receiveShadow = step2.castShadow = true; grp.add(step2);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.3, 2.4, 4),
      new THREE.MeshStandardMaterial({ color: 0xd9d2bd, roughness: 0.7 }));
    shaft.position.y = 1.6; shaft.rotation.y = Math.PI / 4; shaft.castShadow = true; grp.add(shaft);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.28, 4),
      new THREE.MeshStandardMaterial({ color: 0xd8a93c, emissive: 0xffca5a, emissiveIntensity: 0.35, roughness: 0.3, metalness: 0.7 }));
    tip.position.y = 2.9; tip.rotation.y = Math.PI / 4; grp.add(tip);
    const medal = new THREE.Mesh(new THREE.CircleGeometry(0.85, 20),
      new THREE.MeshStandardMaterial({ color: 0xc4b998, roughness: 1 }));
    medal.rotation.x = -Math.PI / 2; medal.position.y = 0.125; medal.receiveShadow = true; grp.add(medal);
    for (const [qx, qz] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), lampHeadMat);
      lamp.position.set(qx, 0.28, qz); grp.add(lamp);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 6), roofMat);
      post.position.set(qx, 0.14, qz); grp.add(post);
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
    if (rng() < 0.5) {
      // flowerbed variant instead of a second bench run: ring of color
      const bed = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.14, 12),
        new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 1 }));
      bed.position.set(-0.48, 0.14, -0.48); bed.castShadow = true; grp.add(bed);
      const bloom = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.1, 12),
        new THREE.MeshStandardMaterial({ color: rng() < 0.5 ? 0xe86a8a : 0xf2c14e, roughness: 0.8 }));
      bloom.position.set(-0.48, 0.22, -0.48); grp.add(bloom);
    }
  } else if (t === T.SOLAR) {
    podium(grp, 2.0, 2.0);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1c3260, roughness: 0.22, metalness: 0.75 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x8a8f96, roughness: 0.5, metalness: 0.6 });
    for (const [px, pz] of [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]]) {
      for (const [lx, lz] of [[-0.28, 0], [0.28, 0]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.5, 0.07), frameMat);
        leg.position.set(px + lx, 0.3, pz); leg.castShadow = true; grp.add(leg);
      }
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.7), panelMat);
      panel.position.set(px, 0.58, pz); panel.rotation.x = -0.42; panel.castShadow = true; grp.add(panel);
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.02, 0.06), frameMat);
      rib.position.set(px, 0.62, pz); rib.rotation.x = -0.42; grp.add(rib);
    }
    const inv = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xd8d8d2, roughness: 0.6 }));
    inv.position.set(0, 0.32, 0.82); inv.castShadow = true; grp.add(inv);
  } else if (t === T.SCHOOL) {
    podium(grp, 2.0, 2.0);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xb56a4e, roughness: 0.9 });
    const hall = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75, 0.7), wallMat);
    hall.position.set(0, 0.5, -0.45); hall.castShadow = hall.receiveShadow = true; grp.add(hall);
    const roofS = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.1, 0.82), trimMat);
    roofS.position.set(0, 0.92, -0.45); roofS.castShadow = true; grp.add(roofS);
    // glowing classroom strip (warm at night via userData mats)
    const stripMat = new THREE.MeshStandardMaterial({ color: 0x2c3a4a, emissive: 0xffca7a, emissiveIntensity: 0.12, roughness: 0.3 });
    const strip = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 0.04), stripMat);
    strip.position.set(0, 0.52, -0.08); grp.add(strip);
    stripMat.userData.baseEmissive = 0.12;
    grp.userData.mats = [stripMat];
    const gym = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.55, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xd9cfae, roughness: 0.9 }));
    gym.position.set(0.6, 0.4, 0.45); gym.castShadow = gym.receiveShadow = true; grp.add(gym);
    // flagpole + yard
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), roofMat);
    pole.position.set(-0.7, 0.85, 0.5); grp.add(pole);
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x3a6fd8, roughness: 0.8, side: THREE.DoubleSide }));
    flag.position.set(-0.54, 1.45, 0.5); grp.add(flag);
    const yard = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xb56e5a, roughness: 1 }));
    yard.position.set(0, 0.05, 0.7); yard.receiveShadow = true; grp.add(yard);
  } else if (t === T.PLAZA) {
    const pave = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 1.9),
      new THREE.MeshStandardMaterial({ color: 0xd6cdb8, roughness: 1 }));
    pave.position.y = 0.06; pave.receiveShadow = true; grp.add(pave);
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x9a917e, roughness: 1 });
    for (const rr of [0, Math.PI / 2]) {
      for (const off of [-0.8, 0.8]) {
        const e = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.13, 0.18), edgeMat);
        e.rotation.y = rr; e.position.set(rr ? off : 0, 0.065, rr ? 0 : off);
        e.receiveShadow = true; grp.add(e);
      }
    }
    // fountain: basin + water + column
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.22, 14), trimMat);
    basin.position.y = 0.22; basin.castShadow = basin.receiveShadow = true; grp.add(basin);
    const fwater = new THREE.Mesh(new THREE.CircleGeometry(0.38, 14),
      new THREE.MeshStandardMaterial({ color: 0x3f8fd1, roughness: 0.1, metalness: 0.4 }));
    fwater.rotation.x = -Math.PI / 2; fwater.position.y = 0.32; grp.add(fwater);
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.55, 8), trimMat);
    col.position.y = 0.55; col.castShadow = true; grp.add(col);
    const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 10), trimMat);
    lip.position.y = 0.82; grp.add(lip);
    // planters + bench
    for (const [qx, qz] of [[-0.68, -0.68], [0.68, -0.68]]) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x7a5233, roughness: 1 }));
      box.position.set(qx, 0.22, qz); box.castShadow = true; grp.add(box);
      const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 0),
        new THREE.MeshStandardMaterial({ color: 0x3f9147, roughness: 1 }));
      shrub.position.set(qx, 0.45, qz); shrub.castShadow = true; grp.add(shrub);
    }
    const bench = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x7a5233, roughness: 1 }));
    bench.position.set(0, 0.24, -0.72); bench.castShadow = true; grp.add(bench);
  }
  bldGroup.add(grp);
  return grp;
}
function rebuildBuildingMeshes() {
  clearBuildings();
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const t = S.grid[idx(x, z)];
    if (t === T.RB || t === T.CB || t === T.IB || t === T.OB || t === T.FB || t === T.COAL || t === T.WIND || t === T.PARK || t === T.SOLAR || t === T.SCHOOL || t === T.PLAZA || t === T.CLINIC || t === T.POLICE || t === T.MONUMENT) spawnBuildingMesh(x, z);
  }
  refreshSmoke();
}

// ---------- static layer refresh (roads/zones/poles/trees) ----------
function refreshStatic() {
  let r = 0, av = 0, dr = 0, w = 0, d = 0, zn = 0, p = 0, lp = 0;
  const zColors = { [T.R]: new THREE.Color(0x4ade80), [T.C]: new THREE.Color(0x60a5fa), [T.I]: new THREE.Color(0xfbbf24), [T.O]: new THREE.Color(0xc084fc), [T.F]: new THREE.Color(0xa3e635) };
  const tmpC = new THREE.Color();
  const axisOf = (x, z) => {
    // road axis from any drivable neighbour (roads link across types)
    const horiz = (inB(x - 1, z) && isDrive(S.grid[idx(x - 1, z)])) || (inB(x + 1, z) && isDrive(S.grid[idx(x + 1, z)]));
    const vert = (inB(x, z - 1) && isDrive(S.grid[idx(x, z - 1)])) || (inB(x, z + 1) && isDrive(S.grid[idx(x, z + 1)]));
    return { horiz, vert };
  };
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const i = idx(x, z), t = S.grid[i];
    const wx = tileWX(x), wz = tileWZ(z);
    if (t === T.ROAD || t === T.AVENUE) {
      const { horiz, vert } = axisOf(x, z);
      const alongX = horiz && !vert;
      if (t === T.ROAD) {
        dummy.position.set(wx, 0.05, wz); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
        dummy.updateMatrix(); walkPool.setMatrixAt(w++, dummy.matrix);
        dummy.position.set(wx, 0.07, wz); dummy.updateMatrix(); roadPool.setMatrixAt(r++, dummy.matrix);
      } else {
        // avenue: wider slab + sidewalk, twin dashes
        dummy.position.set(wx, 0.05, wz); dummy.rotation.set(0, 0, 0);
        dummy.scale.set(alongX ? 1 : 1.7, 1, alongX ? 1.7 : 1);
        dummy.updateMatrix(); walkPool.setMatrixAt(w++, dummy.matrix);
        dummy.position.set(wx, 0.075, wz);
        dummy.scale.set(alongX ? 1.96 : 1.7, 1, alongX ? 1.7 : 1.96);
        dummy.updateMatrix(); avePool.setMatrixAt(av++, dummy.matrix);
      }
      const put = (rot, off) => {
        dummy.position.set(wx + (rot ? 0 : off), 0.1, wz + (rot ? off : 0));
        dummy.rotation.set(0, rot, 0); dummy.scale.set(1, 1, 1);
        dummy.updateMatrix(); dashPool.setMatrixAt(d++, dummy.matrix);
      };
      if (t === T.AVENUE) {
        if (alongX || (!horiz && !vert)) { put(Math.PI / 2, 0.32); put(Math.PI / 2, -0.32); }
        else if (!alongX) { put(0, 0.32); put(0, -0.32); }
        else { put(0, 0); }
      } else {
        if (horiz && !vert) put(Math.PI / 2, 0);
        else if (vert && !horiz) put(0, 0);
        else if (horiz && vert) { put(0, 0); }
      }
      // street lamp on quieter stretches
      if ((x * 7 + z * 13) % 4 === 0 && !(horiz && vert)) {
        dummy.position.set(wx + 0.75, 1.0, wz + 0.75); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
        dummy.updateMatrix(); lampPolePool.setMatrixAt(lp, dummy.matrix);
        dummy.position.set(wx + 0.75, 2.05, wz + 0.75); dummy.updateMatrix();
        lampHeadPool.setMatrixAt(lp, dummy.matrix);
        lp++;
      }
    } else if (t === T.DIRT) {
      // dirt track: narrow strip along the axis, no markings or lamps
      const { horiz, vert } = axisOf(x, z);
      const alongX = horiz && !vert;
      dummy.position.set(wx, 0.06, wz); dummy.rotation.set(0, 0, 0);
      dummy.scale.set(alongX ? 1.96 : 0.8, 1, alongX ? 0.8 : 1.96);
      dummy.updateMatrix(); dirtPool.setMatrixAt(dr++, dummy.matrix);
    } else if (t === T.R || t === T.C || t === T.I || t === T.O || t === T.F) {
      dummy.position.set(wx, 0.05, wz); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
      dummy.updateMatrix(); zonePool.setMatrixAt(zn, dummy.matrix);
      zonePool.setColorAt(zn, S.powerView && !S.powered[i] ? tmpC.set(0x333333) : zColors[t]);
      zn++;
    } else if (t === T.WIRE) {
      dummy.position.set(wx, 1.3, wz); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
      dummy.updateMatrix(); polePool.setMatrixAt(p, dummy.matrix);
      // crossarm follows the wire direction
      const hN = inB(x - 1, z) && (S.grid[idx(x - 1, z)] === T.WIRE || S.grid[idx(x - 1, z)] === T.COAL || S.grid[idx(x - 1, z)] === T.WIND || S.grid[idx(x - 1, z)] === T.SOLAR);
      const hP = inB(x + 1, z) && (S.grid[idx(x + 1, z)] === T.WIRE || S.grid[idx(x + 1, z)] === T.COAL || S.grid[idx(x + 1, z)] === T.WIND || S.grid[idx(x + 1, z)] === T.SOLAR);
      dummy.position.set(wx, 2.35, wz); dummy.rotation.set(0, hN || hP ? 0 : Math.PI / 2, 0); dummy.scale.set(1, 1, 1);
      dummy.updateMatrix(); armPool.setMatrixAt(p, dummy.matrix);
      p++;
    }
  }
  roadPool.count = r; avePool.count = av; dirtPool.count = dr;
  walkPool.count = w; dashPool.count = d; zonePool.count = zn;
  polePool.count = p; armPool.count = p; lampPolePool.count = lp; lampHeadPool.count = lp;
  roadPool.instanceMatrix.needsUpdate = true; avePool.instanceMatrix.needsUpdate = true;
  dirtPool.instanceMatrix.needsUpdate = true; walkPool.instanceMatrix.needsUpdate = true;
  dashPool.instanceMatrix.needsUpdate = true;
  if (zonePool.instanceColor) zonePool.instanceColor.needsUpdate = true;
  polePool.instanceMatrix.needsUpdate = true; armPool.instanceMatrix.needsUpdate = true;
  lampPolePool.instanceMatrix.needsUpdate = true; lampHeadPool.instanceMatrix.needsUpdate = true;
  rebuildWires();
  refreshTrees();
  refreshLinks();
  if (gridHelper) gridHelper.material.opacity = S.showGrid ? 0.10 : 0;
  if (gridMajor) gridMajor.material.opacity = S.showGrid ? 0.22 : 0;
}
const leafTint = new THREE.Color();
function refreshTrees() {
  // every tree is a pure function of (tile, seed): placing or bulldozing one
  // tile never reshuffles any other tree on the map
  const seedMod = ((S.seed % 1000) + 1000) % 1000;
  const treeAt = (x, z) => hash2(x + seedMod * 0.37, z - seedMod * 0.11);
  let ti = 0, li = 0, pi = 0, fi = 0;
  const spots = [];
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const t = S.grid[idx(x, z)];
    if (t === T.PARK) { spots.push([x, z, true]); continue; }
    if (t !== T.EMPTY) continue;
    const h = tileSurfaceH(x, z);
    if (h < 0.15 || h > 2.6) continue; // beach, rock, snow stay bare
    const forest = moistAt(x, z) > 0.58;
    if (treeAt(x, z) < (forest ? 0.11 : moistAt(x, z) < 0.34 ? 0.03 : 0.06)) spots.push([x, z, false]);
  }
  const flowerCols = [0xff6fa5, 0xffd94d, 0xffffff, 0xff8c42].map((c) => new THREE.Color(c));
  for (const [x, z, inPark] of spots) {
    const n = inPark ? 3 : 1;
    for (let k = 0; k < n; k++) {
      const trng = mulberry32(((x * 73856093) ^ (z * 19349663) ^ (k * 83492791) ^ S.seed) >>> 0);
      const ox = (trng() - 0.5) * (inPark ? 1.3 : 1.2);
      const oz = (trng() - 0.5) * (inPark ? 1.3 : 1.2);
      const s = 0.7 + trng() * 0.7;
      const pine = tileSurfaceH(x, z) > 1.2 ? trng() < 0.8 : trng() < 0.35;
      dummy.position.set(tileWX(x) + ox, 0.55 * s, tileWZ(z) + oz);
      dummy.rotation.set(0, trng() * Math.PI, 0); dummy.scale.set(s, s, s); dummy.updateMatrix();
      if (ti < 900) trunkPool.setMatrixAt(ti, dummy.matrix);
      if (pine && pi < 400) {
        dummy.position.y = (1.1 + 1.0) * s - 0.25; dummy.updateMatrix();
        pinePool.setMatrixAt(pi, dummy.matrix);
        pinePool.setColorAt(pi, leafTint.set(0x2f7d3a).offsetHSL((trng() - 0.5) * 0.03, 0, (trng() - 0.5) * 0.08));
        pi++;
      } else if (!pine && li < 700) {
        dummy.position.y = (1.1 + 0.85) * s - 0.25;
        dummy.scale.set(s, s * 0.85, s); dummy.updateMatrix();
        leafPool.setMatrixAt(li, dummy.matrix);
        leafPool.setColorAt(li, leafTint.set(0x3f9147).offsetHSL((trng() - 0.5) * 0.05, (trng() - 0.5) * 0.1, (trng() - 0.5) * 0.09));
        li++;
      }
      ti++;
      if (inPark && fi < 498) {
        for (let f = 0; f < 2 && fi < 500; f++) {
          dummy.position.set(tileWX(x) + (trng() - 0.5) * 1.5, 0.22, tileWZ(z) + (trng() - 0.5) * 1.5);
          dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
          flowerPool.setMatrixAt(fi, dummy.matrix);
          flowerPool.setColorAt(fi, flowerCols[(trng() * flowerCols.length) | 0]);
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
  S.grid.fill(T.EMPTY); S.sculpt = new Float32Array(SIZE * SIZE);
  S.buildings.clear(); S.powered.fill(0);
  syncWaterTiles();
  S.funds = 10000; S.day = 1; S.pop = 0; S.jobsTotal = 0; S.jobsFilled = 0;
  S.mwMade = 0; S.mwUsed = 0; S.happy = 70; S.selected = -1; S.links = 0;
  linksBootstrapped = false;
  S.demand = { R: 0.5, C: 0.3, I: 0.4, O: 0.1, F: 0.3 };
  agents.length = 0; trucks.length = 0;
  buildGround(); computePower(); refreshStatic(); rebuildBuildingMeshes();
  updateHUD(); setInspectorHome();
}
//flips EMPTY<->WATER tiles to match the sculpted surface (buildings/roads untouched)
function syncWaterTiles() {
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const i = idx(x, z), t = S.grid[i];
    if (t === T.EMPTY || t === T.WATER) S.grid[i] = isWaterTile(x, z) ? T.WATER : T.EMPTY;
  }
}

// ---------- power (OpenCity-style conduction) ----------
function computePower() {
  S.powered.fill(0);
  const cond = new Uint8Array(SIZE * SIZE);
  let supply = 0, demand = 0;
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const t = S.grid[idx(x, z)];
    if (t === T.WIRE || t === T.ROAD || t === T.AVENUE || t === T.COAL || t === T.WIND || t === T.SOLAR || t === T.SCHOOL || t === T.CLINIC || t === T.POLICE) cond[idx(x, z)] = 1;
    if (t === T.COAL) supply += PLANT_MW.coal;
    if (t === T.WIND) supply += PLANT_MW.wind;
    if (t === T.SOLAR) supply += PLANT_MW.solar;
  }
  // demand
  for (const [i, b] of S.buildings) {
    const t = S.grid[i];
    if (t === T.RB) demand += MW_USE.R[b.level];
    else if (t === T.CB) demand += MW_USE.C[b.level];
    else if (t === T.IB) demand += MW_USE.I[b.level];
    else if (t === T.OB) demand += MW_USE.O[b.level];
    else if (t === T.FB) demand += MW_USE.F[b.level];
  }
  for (let i = 0; i < SIZE * SIZE; i++) {
    if (S.grid[i] === T.SCHOOL) demand += SCHOOL_MW;
    else if (S.grid[i] === T.CLINIC) demand += CLINIC_MW;
    else if (S.grid[i] === T.POLICE) demand += POLICE_MW;
  }
  S.mwMade = supply; S.mwUsed = demand;
  // connected set: tiles adjacent to conductor network (or plants)
  const seen = new Uint8Array(SIZE * SIZE);
  const q = [];
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const i = idx(x, z);
    if (S.grid[i] === T.COAL || S.grid[i] === T.WIND || S.grid[i] === T.SOLAR) { seen[i] = 1; q.push(i); }
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
    const isConsumer = t === T.RB || t === T.CB || t === T.IB || t === T.OB || t === T.FB || t === T.R || t === T.C || t === T.I || t === T.O || t === T.F || t === T.SCHOOL || t === T.CLINIC || t === T.POLICE;
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
      const need = t === T.SCHOOL ? SCHOOL_MW : t === T.CLINIC ? CLINIC_MW : t === T.POLICE ? POLICE_MW : b ? (t === T.RB ? MW_USE.R[b.level] : t === T.CB ? MW_USE.C[b.level] : t === T.OB ? MW_USE.O[b.level] : t === T.FB ? MW_USE.F[b.level] : MW_USE.I[b.level]) : 1;
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
  let unpowered = 0, parkNear = 0, plazaNear = 0, polNear = 0, schoolNear = false, careNear = 0, safeNear = 0, wonderNear = 0, n = 0;
  for (const [i, b] of S.buildings) {
    const t = S.grid[i];
    if (t !== T.RB) continue;
    n++;
    const x = i % SIZE, z = (i / SIZE) | 0;
    if (!S.powered[i]) unpowered++;
    if (nearCount(x, z, [T.PARK], 4) > 0) parkNear++;
    if (nearCount(x, z, [T.PLAZA], 3) > 0) plazaNear++;
    if (nearCount(x, z, [T.CLINIC], 4) > 0) careNear++;
    if (nearCount(x, z, [T.POLICE], 5) > 0) safeNear++;
    if (nearCount(x, z, [T.MONUMENT], 8) > 0) wonderNear++;
    if (nearCount(x, z, [T.IB, T.COAL], 4) > 0) polNear++;
    if (!schoolNear) {
      for (let dx = -5; dx <= 5 && !schoolNear; dx++) for (let dz = -5; dz <= 5; dz++) {
        const nx = x + dx, nz = z + dz;
        if (!inB(nx, nz)) continue;
        const j = idx(nx, nz);
        if (S.grid[j] === T.SCHOOL && S.powered[j]) { schoolNear = true; break; }
      }
    }
  }
  if (!n) { S.happy = 70; return 70; }
  const unemp = S.pop ? clamp(1 - S.jobsFilled / Math.max(1, S.pop * 0.55), 0, 1) : 0;
  let h = 72;
  h -= (unpowered / n) * 25;
  h += (parkNear / n) * 10;
  h += (plazaNear / n) * 4;
  h += (careNear / n) * 5;
  h += (safeNear / n) * 4;
  h += (wonderNear / n) * 10;
  if (schoolNear) h += 6;
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
  let C = (S.pop - S.jobsTotal * 0.4) * 0.008 + (S.happy - 60) * 0.008 - goodsShort * 0.2 + S.links * 0.03;
  let I = (workers - S.jobsFilled) * 0.02 + 0.25 - S.jobsTotal * 0.001 + goodsShort * 0.3;
  let O = S.pop * 0.004 + (S.happy - 60) * 0.012 - S.jobsTotal * 0.0008;
  let F = (workers - S.jobsFilled) * 0.012 + 0.2 - S.jobsTotal * 0.0006;
  if (S.pop < 20) { R = 0.8; C = 0.1; I = 0.35; O = 0.05; F = 0.3; }
  S.demand.R = clamp(R, -1, 1); S.demand.C = clamp(C, -1, 1); S.demand.I = clamp(I, -1, 1);
  S.demand.O = clamp(O, -1, 1); S.demand.F = clamp(F, -1, 1);
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
    else if (t === T.OB) jt += JOBS_O[b.level] || 0;
    else if (t === T.FB) jt += JOBS_F[b.level] || 0;
  }
  S.pop = pop; S.jobsTotal = jt;
  S.jobsFilled = Math.min(jt, Math.floor(pop * 0.55 * (0.6 + S.happy / 250)));
}
function dailyEconomy() {
  recount();
  computeHappiness(); computeDemand();
  const income = S.jobsFilled * S.tax * 0.55 + S.pop * S.tax * 0.22 + S.jobsTotal * 0.4 + S.links * 8;
  let roads = 0, wires = 0, coal = 0, wind = 0, solar = 0, parks = 0, schools = 0, plazas = 0;
  let avenues = 0, dirt = 0, clinics = 0, police = 0, monuments = 0;
  for (let i = 0; i < SIZE * SIZE; i++) {
    const t = S.grid[i];
    if (t === T.ROAD) roads++; else if (t === T.WIRE) wires++;
    else if (t === T.COAL) coal++; else if (t === T.WIND) wind++; else if (t === T.SOLAR) solar++;
    else if (t === T.PARK) parks++; else if (t === T.SCHOOL) schools++; else if (t === T.PLAZA) plazas++;
    else if (t === T.AVENUE) avenues++; else if (t === T.DIRT) dirt++;
    else if (t === T.CLINIC) clinics++; else if (t === T.POLICE) police++; else if (t === T.MONUMENT) monuments++;
  }
  const expense = roads * 0.15 + wires * 0.05 + avenues * 0.3 + dirt * 0.05 + coal * 25 + wind * 5 + solar * SOLAR_UPKEEP + schools * SCHOOL_UPKEEP + clinics * CLINIC_UPKEEP + police * POLICE_UPKEEP + monuments * MONUMENT_UPKEEP + parks * 0.6 + plazas * PLAZA_UPKEEP + S.pop * 0.12;
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
    if (inB(x + dx, z + dz) && isDrive(S.grid[idx(x + dx, z + dz)])) return true;
  return false;
}
function tryGrow(rng) {
  const spots = { R: [], C: [], I: [], O: [], F: [] };
  for (let x = 0; x < SIZE; x++) for (let z = 0; z < SIZE; z++) {
    const t = S.grid[idx(x, z)];
    if (t === T.R) spots.R.push([x, z]);
    else if (t === T.C) spots.C.push([x, z]);
    else if (t === T.I) spots.I.push([x, z]);
    else if (t === T.O) spots.O.push([x, z]);
    else if (t === T.F) spots.F.push([x, z]);
  }
  let grew = false;
  const attempt = (list, demKey, bType) => {
    if (!list.length) return;
    const dem = S.demand[demKey];
    if (dem < 0.12) return;
    const tries = Math.min(list.length, 2 + Math.ceil(dem * 4));
    for (let k = 0; k < tries; k++) {
      const [x, z] = list[(rng() * list.length) | 0];
      const i = idx(x, z);
      if (S.grid[i] !== T.R && S.grid[i] !== T.C && S.grid[i] !== T.I && S.grid[i] !== T.O && S.grid[i] !== T.F) continue;
      if (!adjacentRoad(x, z)) continue;
      if (!S.powered[i] && rng() < 0.7) continue; // mostly need power
      const pol = nearCount(x, z, [T.IB, T.COAL], 3);
      const park = nearCount(x, z, [T.PARK, T.PLAZA], 3);
      const ave = nearCount(x, z, [T.AVENUE], 1) > 0 ? 0.06 : 0; // frontage bonus
      let level = 1;
      const roll = rng() + dem * 0.3 + (S.happy - 60) * 0.004 + park * 0.08 - pol * 0.12 + ave
        + (bType === T.OB ? (S.happy - 65) * 0.006 : 0)
        + (bType === T.FB && nearCount(x, z, [T.WATER], 3) > 0 ? 0.1 : 0); // irrigation
      if (roll > 0.9) level = 3; else if (roll > 0.62) level = 2;
      if (bType === T.RB && pol > 2 && level > 1) level = 1;
      if (bType === T.FB && tileSurfaceH(x, z) > 2.2) continue; // no crops on high rock/snow
      S.grid[i] = bType;
      S.buildings.set(i, {
        level, variant: 1 + ((rng() * 4) | 0),
        goods: 0, happy: S.happy,
      });
      spawnBuildingMesh(x, z);
      refreshStatic();
      assignJobs();
      cityDirty = true; grew = true;
      break;
    }
  };
  attempt(spots.R, 'R', T.RB); attempt(spots.C, 'C', T.CB); attempt(spots.I, 'I', T.IB);
  attempt(spots.O, 'O', T.OB); attempt(spots.F, 'F', T.FB);
  return grew;
}

// ---------- agents (Egregoria-style commuters + freight) ----------
const agents = [];   // {home, work, path:[[x,z]..], seg, t, speed, kind:'car'|'walk', color}
const trucks = [];   // {from, to, path, seg, t}
const agentColor = new THREE.Color();
function nearestRoad(x, z) {
  if (isDrive(S.grid[idx(x, z)])) return [x, z];
  let best = null, bd = 1e9;
  for (let dx = -3; dx <= 3; dx++) for (let dz = -3; dz <= 3; dz++) {
    const nx = x + dx, nz = z + dz;
    if (!inB(nx, nz)) continue;
    if (!isDrive(S.grid[idx(nx, nz)])) continue;
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
      if (!isDrive(S.grid[idx(nx, nz)])) continue;
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
    else if (t === T.CB || t === T.IB || t === T.OB || t === T.FB) {
      const cap = Math.min(t === T.CB ? JOBS_C[b.level] : t === T.IB ? JOBS_I[b.level] : t === T.OB ? JOBS_O[b.level] : JOBS_F[b.level], 8);
      for (let k = 0; k < cap; k++) works.push(i);
    }
  }
  const rng = mulberry32(S.day * 101 + 7);
  // traffic scales with city size: a hamlet of 90 gets ~6 vehicles, a city of
  // 2000 gets ~120 — never a car per resident
  const target = Math.min(120, Math.round(S.pop * 0.07));
  const n = Math.max(0, Math.min(target, homes.length, works.length + 10));
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
  // freight trucks: industry -> commercial (one per factory, capped)
  trucks.length = 0;
  const inds = [...S.buildings.keys()].filter((i) => S.grid[i] === T.IB);
  const coms = [...S.buildings.keys()].filter((i) => S.grid[i] === T.CB);
  for (let k = 0; k < Math.min(12, inds.length); k++) {
    if (!inds.length || !coms.length) break;
    const from = inds[(rng() * inds.length) | 0], to = coms[(rng() * coms.length) | 0];
    const a = nearestRoad(from % SIZE, (from / SIZE) | 0), bpt = nearestRoad(to % SIZE, (to / SIZE) | 0);
    const path = (a && bpt) ? bfsPath(a, bpt) : null;
    if (path && path.length > 1) trucks.push({ from, to, path, seg: 0, t: rng(), delivered: false });
  }
}
function updateAgents(dt) {
  const st = { ci: 0, wi: 0, hi: 0 };
  let fi = 0;
  const dayPhase = (S.dayFrac + S.day) % 2; // commute rhythm
  for (const a of agents) {
    let wx = 0, wz = 0, yaw = 0, show = true, isCar = a.kind === 'car';
    // commute direction flips morning/evening (Egregoria daily rhythm)
    const outbound = (S.timeOfDay > 0.25 && S.timeOfDay < 0.6) ? true : a.phase > 0.5;
    if (!a.path || a.path.length < 2) {
      const h = a.home; wx = tileWX(h % SIZE); wz = tileWZ((h / SIZE) | 0);
      show = (a.phase * 7 + S.day) % 3 < 2;
      isCar = false;
    } else {
      const L = a.path.length - 1;
      const span = 14; // sim-seconds per full trip at speed 1
      const p = (S.simTime * a.speed / span + a.t) % 2;
      let u = p > 1 ? 2 - p : p;
      if (!outbound) u = 1 - u;
      const f = u * L, s0 = Math.min(L - 1, Math.floor(f)), ft = f - s0;
      const A = a.path[s0], B = a.path[s0 + 1];
      wx = lerp(tileWX(A[0]), tileWX(B[0]), ft);
      wz = lerp(tileWZ(A[1]), tileWZ(B[1]), ft);
      // face travel direction (ping-pong leg, flipped on the return commute)
      const fwd = (p <= 1) !== !outbound ? 1 : -1;
      yaw = Math.atan2((tileWX(B[0]) - tileWX(A[0])) * fwd, (tileWZ(B[1]) - tileWZ(A[1])) * fwd);
      if (a.kind === 'walk') { wx += 0.55; wz += 0.15 * Math.sin(S.simTime * 5.6 + a.t * 9); }
    }
    if (!show) continue;
    dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1);
    if (isCar && st.ci < MAXA - 40) {
      placeVehicle(st, wx, wz, yaw, 1, 1, 1, a.color);
    } else if (!isCar && fi < MAXA) {
      dummy.position.set(wx, 0.36, wz); dummy.updateMatrix();
      folkPool.setMatrixAt(fi, dummy.matrix);
      folkPool.setColorAt(fi, agentColor.set(a.color));
      fi++;
    }
  }
  for (const tr of trucks) {
    if (!tr.path || st.ci >= MAXA) continue;
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
    const yaw = Math.atan2(tileWX(B[0]) - tileWX(A[0]), tileWZ(B[1]) - tileWZ(A[1]));
    placeVehicle(st, lerp(tileWX(A[0]), tileWX(B[0]), ft),
      lerp(tileWZ(A[1]), tileWZ(B[1]), ft), yaw, 1.1, 1.1, 1.25, 0x8a6f3c);
  }
  // hide rest
  dummy.position.set(0, -50, 0); dummy.scale.set(0.001, 0.001, 0.001); dummy.rotation.set(0, 0, 0); dummy.updateMatrix();
  for (let k = st.ci; k < carPool.count; k++) { carPool.setMatrixAt(k, dummy.matrix); cabinPool.setMatrixAt(k, dummy.matrix); }
  for (let k = st.wi; k < wheelPool.count; k++) wheelPool.setMatrixAt(k, dummy.matrix);
  for (let k = st.hi; k < headPool.count; k++) { headPool.setMatrixAt(k, dummy.matrix); tailPool.setMatrixAt(k, dummy.matrix); }
  for (let k = fi; k < folkPool.count; k++) folkPool.setMatrixAt(k, dummy.matrix);
  carPool.count = MAXA; cabinPool.count = MAXA; folkPool.count = MAXA;
  wheelPool.count = MAXA * 4; headPool.count = MAXA * 2; tailPool.count = MAXA * 2;
  carPool.instanceMatrix.needsUpdate = true; cabinPool.instanceMatrix.needsUpdate = true;
  wheelPool.instanceMatrix.needsUpdate = true;
  headPool.instanceMatrix.needsUpdate = true; tailPool.instanceMatrix.needsUpdate = true;
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
  if (tool === 'raise' || tool === 'lower') {
    // SDF-style brush: only wild land or water can be sculpted
    if (t !== T.EMPTY && t !== T.WATER) return;
    if (!canAfford(15)) { toast('Not enough funds! ($15 needed)', 'bad'); blip(140, 0.15, 0.06); return; }
    const nv = clamp(Math.round((S.sculpt[i] + (tool === 'raise' ? 0.4 : -0.4)) * 10) / 10, -2.4, 2.4);
    if (nv === S.sculpt[i]) return; // already at the limit
    S.sculpt[i] = nv;
    spend(15);
    syncWaterTiles();
    groundDirty = true;
    refreshStatic(); recount(); computeDemand(); updateHUD();
    if (S.selected === i) showInspector(i);
    blip(tool === 'raise' ? 420 : 300, 0.05, 0.04);
    return;
  }
  if (t === T.WATER) { return; }
  if (tool === 'bulldoze') {
    if (t === T.EMPTY || t === T.WATER) return;
    S.grid[i] = T.EMPTY; S.buildings.delete(i);
    cityDirty = true;
    computePower(); refreshStatic(); rebuildBuildingMeshes(); assignJobs(); recount(); updateHUD();
    blip(180, 0.1, 0.06);
    if (S.selected === i) setInspectorHome();
    return;
  }
  const place = { road: T.ROAD, wire: T.WIRE, res: T.R, com: T.C, ind: T.I, park: T.PARK, coal: T.COAL, wind: T.WIND, solar: T.SOLAR, school: T.SCHOOL, plaza: T.PLAZA, office: T.O, farm: T.F, clinic: T.CLINIC, police: T.POLICE, monument: T.MONUMENT, avenue: T.AVENUE, dirt: T.DIRT }[tool];
  const cost = { road: COST.road, wire: COST.wire, res: COST.R, com: COST.C, ind: COST.I, park: COST.park, coal: COST.coal, wind: COST.wind, solar: COST.solar, school: COST.school, plaza: COST.plaza, office: COST.office, farm: COST.farm, clinic: COST.clinic, police: COST.police, monument: COST.monument, avenue: COST.avenue, dirt: COST.dirt }[tool];
  if (place === undefined) return;
  if (t !== T.EMPTY && !(t === T.R || t === T.C || t === T.I || t === T.O || t === T.F)) {
    if (!(tool === 'road' && t === T.WIRE) && !(tool === 'wire' && t === T.ROAD)) return;
  }
  if (place === T.MONUMENT && S.pop < MONUMENT_MIN_POP && !window.__CITY_DEBUG) { toast(`🏛️ Monuments need a city of ${MONUMENT_MIN_POP}+ citizens!`, 'bad'); blip(140, 0.15, 0.06); return; }
  if (!canAfford(cost)) { toast('Not enough funds! ($' + cost + ' needed)', 'bad'); blip(140, 0.15, 0.06); return; }
  // power plants / park replace zone tiles
  S.grid[i] = place;
  if (place === T.ROAD || place === T.WIRE || place === T.PARK || place === T.COAL || place === T.WIND || place === T.SOLAR || place === T.SCHOOL || place === T.PLAZA || place === T.CLINIC || place === T.POLICE || place === T.MONUMENT || place === T.AVENUE || place === T.DIRT) S.buildings.delete(i);
  if (place === T.COAL || place === T.WIND || place === T.SOLAR) S.buildings.delete(i);
  spend(cost);
  cityDirty = true;
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
    const col = { select: 0xffffff, road: 0x9aa0aa, avenue: 0xfb7185, dirt: 0xa16207, res: 0x4ade80, com: 0x60a5fa, ind: 0xfbbf24, office: 0xc084fc, farm: 0xa3e635, powerline: 0xfde047, coal: 0xf87171, wind: 0xa7f3d0, solar: 0xfb923c, school: 0xf472b6, clinic: 0xfda4af, police: 0x94a3b8, monument: 0x22d3ee, plaza: 0xe7d8b1, park: 0x34d399, raise: 0x92400e, lower: 0x38bdf8, bulldoze: 0xef4444 }[S.tool] ?? 0xffffff;
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
const TOOL_LABEL = { select: '🔍 Query', road: '🛣️ Road', avenue: '🛤️ Avenue', dirt: '🧱 Dirt track', res: '🏠 Residential', com: '🏬 Commercial', ind: '🏭 Industrial', office: '🏢 Offices', farm: '🚜 Farm', powerline: '⚡ Power line', coal: '🔥 Coal plant', wind: '🌬️ Wind turbine', solar: '☀️ Solar farm', school: '🏫 School', clinic: '🏥 Clinic', police: '🚔 Police', monument: '🏛️ Monument', park: '🌳 Park', plaza: '⛲ Plaza', raise: '⛰️ Raise land', lower: '🕳️ Lower land', bulldoze: '💥 Bulldoze' };
function setTool(t) {
  S.tool = t;
  document.querySelectorAll('#toolbar .tool[data-tool]').forEach((b) => b.classList.toggle('active', b.dataset.tool === t));
  $('tool-status').textContent = TOOL_LABEL[t] + (t === 'select' ? ' — click a tile for details' : ' — drag on the map to paint · right-drag pans');
}
document.querySelectorAll('#toolbar .tool[data-tool]').forEach((b) => b.addEventListener('click', () => { setTool(b.dataset.tool); blip(700, 0.04, 0.03); }));
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  const k = e.key.toLowerCase();
  const map = { r: 'res', c: 'com', i: 'ind', p: 'road', l: 'powerline', e: 'coal', t: 'wind', y: 'solar', j: 'school', b: 'plaza', k: 'park', x: 'bulldoze', q: 'select', 4: 'avenue', 5: 'dirt', 6: 'office', 7: 'farm', 8: 'clinic', 9: 'police', 0: 'monument', z: 'raise', v: 'lower' };
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
$('btn-photos').onclick = () => {
  try {
    const on = localStorage.getItem('oe-photos') === '1';
    localStorage.setItem('oe-photos', on ? '0' : '1');
    if (!on) {
      ExtTex.loaded = false;
      toast('🖼️ Photo mode on — loading ./assets/*.jpg …', '');
      loadExternalTextures();
    } else toast('🖼️ Photo mode off — back to procedural facades.', '');
  } catch { toast('Photo toggle needs storage access.', 'bad'); }
};
$('btn-clear').onclick = () => { if (confirm('Abandon this city and start over?')) { newMap(S.mapType, (Math.random() * 1e9) | 0); toast('🌱 New frontier surveyed. Good luck, Mayor!', 'good'); } };
$('btn-new-plain').onclick = () => { newMap('plain', (Math.random() * 1e9) | 0); toast('🌾 Settled the plains.', 'good'); };
$('btn-new-lake').onclick = () => { newMap('lake', (Math.random() * 1e9) | 0); toast('🌊 Lakeside charter signed.', 'good'); };
$('btn-new-hill').onclick = () => { newMap('hill', (Math.random() * 1e9) | 0); toast('⛰️ Highland charter signed.', 'good'); };
$('btn-new-archi').onclick = () => { newMap('archi', (Math.random() * 1e9) | 0); toast('🏝️ Island charters signed.', 'good'); };
$('btn-new-volcano').onclick = () => { newMap('volcano', (Math.random() * 1e9) | 0); toast('🌋 Volcano charter signed. Mind the crater lake.', 'good'); };

const TILE_NAME = { 0: 'Open land', 1: 'Water', 2: 'Road', 3: 'Power line', 4: 'Residential zone', 5: 'Commercial zone', 6: 'Industrial zone', 7: 'Homes', 8: 'Shops & offices', 9: 'Factories', 10: 'Coal power plant', 11: 'Wind turbine', 12: 'Park', 13: 'Solar farm', 14: 'School', 15: 'Plaza', 16: 'Office zone', 17: 'Offices', 18: 'Farm zone', 19: 'Farm', 20: 'Clinic', 21: 'Police station', 22: 'Monument', 23: 'Avenue', 24: 'Dirt track' };
function setInspectorHome() {
  $('insp-title').textContent = `Day ${S.day} — ${S.pop} citizens`;
  $('insp-body').innerHTML = `<div class="kv">
    <span>Treasury</span><b>$${Math.round(S.funds).toLocaleString()}</b>
    <span>Power</span><b>${S.mwMade} / ${S.mwUsed} MW</b>
    <span>Jobs</span><b>${S.jobsFilled} / ${S.jobsTotal}</b>
    <span>Trade links</span><b>🔗 ${S.links} (+$${S.links * 8}/day)</b>
    <span>Mood</span><b>${S.happy} / 100</b></div>
    <div class="bar"><div style="width:${S.happy}%;background:${S.happy > 60 ? '#4ade80' : S.happy > 40 ? '#fbbf24' : '#f87171'}"></div></div>
    <p class="hint">Tip: industry makes <b>freight</b> 🚚 that shops need. Watch the vans! Unpowered grey buildings shrink the economy.</p>`;
}
function showInspector(i) {
  const x = i % SIZE, z = (i / SIZE) | 0, t = S.grid[i];
  const b = S.buildings.get(i);
  let html = `<div class="kv"><span>Tile</span><b>${x}, ${z}</b><span>Type</span><b>${TILE_NAME[t]}</b>`;
  const lk = linkAt(x, z);
  if (lk) html += `<span>Regional link</span><b>🔗 ${lk} · +$8/day</b>`;
  html += `<span>Terrain</span><b>${tileSurfaceH(x, z).toFixed(1)}m · ${tileBiome(x, z)}</b>`;
  if (b && (t === T.RB || t === T.CB || t === T.IB || t === T.OB || t === T.FB)) {
    const kind = t === T.RB ? 'R' : t === T.CB ? 'C' : t === T.IB ? 'I' : t === T.OB ? 'O' : 'F';
    html += `<span>Level</span><b>${'★'.repeat(b.level)}</b>`;
    if (t === T.RB) html += `<span>Residents</span><b>${POP[b.level]}</b>`;
    if (t === T.CB) html += `<span>Jobs</span><b>${JOBS_C[b.level]}</b><span>Stock</span><b>${Math.round(b.goods || 0)}</b>`;
    if (t === T.IB) html += `<span>Jobs</span><b>${JOBS_I[b.level]}</b><span>Freight</span><b>${Math.round(b.goods || 0)}</b>`;
    if (t === T.OB) html += `<span>Jobs</span><b>${JOBS_O[b.level]}</b><span>Clean</span><b>✨ no pollution</b>`;
    if (t === T.FB) html += `<span>Jobs</span><b>${JOBS_F[b.level]}</b><span>Rural</span><b>🌾 no pollution</b>`;
    html += `<span>Power</span><b>${S.powered[i] ? '⚡ on (' + MW_USE[kind][b.level] + ' MW)' : '❌ no power'}</b>`;
    html += `<span>Parks near</span><b>${nearCount(x, z, [T.PARK], 4) > 0 ? '🌳 yes' : nearCount(x, z, [T.PLAZA], 3) > 0 ? '⛲ plaza' : '—'}</b>`;
    html += `<span>School near</span><b>${nearCount(x, z, [T.SCHOOL], 5) > 0 ? '🏫 yes' : '—'}</b>`;
    html += `<span>Pollution</span><b>${nearCount(x, z, [T.IB, T.COAL], 4) > 0 ? '🏭 nearby' : 'clean'}</b>`;
  }
  if (t === T.COAL) html += `<span>Output</span><b>${PLANT_MW.coal} MW</b><span>Upkeep</span><b>$25/day</b>`;
  if (t === T.WIND) html += `<span>Output</span><b>${PLANT_MW.wind} MW</b><span>Upkeep</span><b>$5/day</b>`;
  if (t === T.SOLAR) html += `<span>Output</span><b>${PLANT_MW.solar} MW</b><span>Upkeep</span><b>$${SOLAR_UPKEEP}/day</b><span>Clean</span><b>☀️ no pollution</b>`;
  if (t === T.SCHOOL) html += `<span>Effect</span><b>+mood, radius 5</b><span>Power</span><b>${S.powered[i] ? `⚡ on (${SCHOOL_MW} MW)` : '❌ needs power'}</b><span>Upkeep</span><b>$${SCHOOL_UPKEEP}/day</b>`;
  if (t === T.CLINIC) html += `<span>Effect</span><b>+health, radius 4</b><span>Power</span><b>${S.powered[i] ? `⚡ on (${CLINIC_MW} MW)` : '❌ needs power'}</b><span>Upkeep</span><b>$${CLINIC_UPKEEP}/day</b>`;
  if (t === T.POLICE) html += `<span>Effect</span><b>+safety, radius 5</b><span>Power</span><b>${S.powered[i] ? `⚡ on (${POLICE_MW} MW)` : '❌ needs power'}</b><span>Upkeep</span><b>$${POLICE_UPKEEP}/day</b>`;
  if (t === T.MONUMENT) html += `<span>Effect</span><b>+prestige, radius 8</b><span>Upkeep</span><b>$${MONUMENT_UPKEEP}/day</b>`;
  if (t === T.AVENUE) html += `<span>Capacity</span><b>🛤️ wide + growth</b><span>Upkeep</span><b>$0.3/tile</b>`;
  if (t === T.DIRT) html += `<span>Capacity</span><b>🐢 basic track</b><span>Upkeep</span><b>$0.05/tile</b>`;
  html += `</div><p class="hint">Press <kbd>X</kbd> then click to bulldoze · <kbd>R</kbd>/<kbd>C</kbd>/<kbd>I</kbd> to zone nearby</p>`;
  $('insp-title').textContent = TILE_NAME[t] + (S.powered[i] ? '' : ([T.R, T.C, T.I, T.O, T.F, T.RB, T.CB, T.IB, T.OB, T.FB, T.SCHOOL, T.CLINIC, T.POLICE].includes(t) ? ' (unpowered)' : ''));
  $('insp-body').innerHTML = html;
}
function updateHUD() {
  $('stat-funds').textContent = '$' + Math.round(S.funds).toLocaleString();
  $('stat-funds').style.color = S.funds < 0 ? '#f87171' : '';
  $('stat-pop').textContent = S.pop.toLocaleString();
  $('stat-jobs').textContent = `${S.jobsFilled}/${S.jobsTotal}`;
  $('stat-power').textContent = `${S.mwMade}/${S.mwUsed} MW`;
  $('stat-power').style.color = S.mwUsed > S.mwMade ? '#f87171' : '';
  $('stat-links').textContent = S.links;
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
  setBar('rci-o', S.demand.O); setBar('rci-f', S.demand.F);
}

// ---------- save / load ----------
function saveGame(silent) {
  try {
    const data = {
      v: 1, seed: S.seed, mapType: S.mapType, funds: S.funds, day: S.day, tax: S.tax,
      grid: Array.from(S.grid),
      sculpt: Array.from(S.sculpt),
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
    S.sculpt = d.sculpt ? Float32Array.from(d.sculpt) : new Float32Array(SIZE * SIZE);
    S.buildings = new Map(d.buildings);
    S.powered = new Uint8Array(SIZE * SIZE);
    $('tax').value = S.tax; $('tax-val').textContent = S.tax + '%';
    linksBootstrapped = false;
    syncWaterTiles(); // migrate old saves onto the new terrain + restore sculpted shores
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
  if (headMat) headMat.emissiveIntensity = 0.25 + night * 3.2;
  if (tailMat) tailMat.emissiveIntensity = 0.5 + night * 2.0;
  // swap IBL environment with hysteresis (no per-frame PMREM cost)
  if (!envIsNight && night > 0.6) { scene.environment = envNight; envIsNight = true; }
  else if (envIsNight && night < 0.4) { scene.environment = envDay; envIsNight = false; }
  renderer.toneMappingExposure = lerp(1.12, 1.0, night);
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
const DAY_LEN = 12; // one calm game-day per 12s at 1x (was a frantic 2.6s)
// rebuilds only run when the city actually changed (paint/growth/power flips),
// not every tick — previously the whole scene + all routes reshuffled daily
let cityDirty = true, poweredSig = -1;
function powerSignature() {
  let s = 0;
  for (let i = 0; i < SIZE * SIZE; i++) if (S.powered[i]) s = (s + (i + 1) * 7) >>> 0;
  return s;
}
// auto-quality: if frames average worse than ~33fps, step render scale down
// (and 4K shadows to 2K once) instead of stuttering
let qAcc = 0, qN = 0, qLevel = 0;
function autoQuality(dt) {
  qAcc += dt; qN++;
  if (qN < 240) return;
  const avg = qAcc / qN; qAcc = 0; qN = 0;
  if (avg > 0.03 && qLevel < 2) {
    qLevel++;
    renderer.setPixelRatio(qLevel === 1 ? Math.min(devicePixelRatio || 1, 1.25) : 1);
    if (sun.shadow.mapSize.x > 2048) {
      sun.shadow.mapSize.set(2048, 2048);
      if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
    }
    resize();
  }
}
const rngSim = mulberry32(12345);
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min(0.1, (now - lastT) / 1000);
  lastT = now;
  autoQuality(dt);
  const rate = S.paused ? 0 : S.speed;
  // single sim clock drives days, daylight AND traffic: pause freezes all,
  // speed scales all, and frame hitches can never teleport anything
  S.simTime += dt * rate;
  S.timeOfDay = (S.timeOfDay + (dt * rate) / DAY_LEN) % 1;
  if (rate > 0) {
    dayAcc += dt * rate;
    S.dayFrac = (dayAcc / DAY_LEN) % 1;
    if (dayAcc >= DAY_LEN) {
      dayAcc = 0; S.day++;
      computePower(); dailyEconomy(); const grew = tryGrow(rngSim); computePower();
      const sig = powerSignature();
      if (grew || sig !== poweredSig || cityDirty) {
        poweredSig = sig; cityDirty = false;
        assignJobs(); rebuildBuildingMeshes(); refreshStatic();
      }
      updateHUD();
      if (S.selected >= 0 && S.tool === 'select') showInspector(S.selected); else if (S.day % 3 === 0) setInspectorHome();
      if (S.day % 10 === 0) saveGame(true);
      if (S.day === 2) toast('💡 Tip: build Wind + Wires before zoning — unpowered zones stall.', '');
    }
  }
  updateAgents(dt * rate);
  if (groundDirty) { groundDirty = false; buildGround(); }
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
  loadExternalTextures();
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
  for (let k = 3; k <= 6; k++) { const i = idx(c + k, c); if (S.grid[i] === T.ROAD) S.grid[i] = T.AVENUE; }
  for (let k = 7; k <= 15; k++) put(k, 0, T.AVENUE); // highway to the east border: links Eastport
  for (let k = -5; k <= 5; k += 2) { put(k, 1, T.WIRE); }
  put(1, -1, T.WIND);
  put(-1, 1, T.WIND);
  for (let k = -5; k <= 5; k++) {
    if (Math.abs(k) < 1) continue;
    put(k, 2, T.R); put(k, -2, T.R); put(2, k, T.C); put(-2, k, T.I);
  }
  put(3, 3, T.PARK); put(-3, -3, T.PARK);
  put(4, 1, T.SOLAR); put(4, 4, T.PLAZA);
  computePower(); recount(); computeDemand();
  // force-grow a few level-1 buildings instantly
  const rng = mulberry32(42);
  for (let n = 0; n < 6; n++) tryGrow(rng);
  computePower(); recount(); computeHappiness(); assignJobs();
  refreshStatic(); rebuildBuildingMeshes(); updateHUD(); setInspectorHome();
}
window.__city = { S, frameCity, toggleCamMode, setTool, place: (tool, x, z) => { S.tool = tool; paintAt(x, z); }, panTo: (x, z) => { goal.tx = clamp(x, -HALF * 1.5, HALF * 1.5); goal.tz = clamp(z, -HALF * 1.5, HALF * 1.5); cam.autoFit = false; }, dbg: () => ({ t: S.timeOfDay, sun: sun.intensity, hemi: hemi.intensity, night: skyUni.nightF.value, top: skyUni.topColor.value.getHexString(), sunY: sun.position.y, agents: agents.length, trucks: trucks.length, simTime: Math.round(S.simTime * 10) / 10, day: S.day }) };
boot();
