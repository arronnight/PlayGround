/**
 * SPEEDFORM — wireframe to full 3D render, graded with apex-gp's pretty.
 *
 * WHAT THIS IS: a 13-stage progression viewer (point cloud -> post-processed
 * render) for one abstract studio sculpture. No cars, no track, no physics, no
 * AI, no race control, no HUD, no audio — none of the apex-gp game itself.
 *
 * WHAT IT BORROWS (techniques, re-implemented small — see notes):
 *   car/materials.js    clearcoat paint over metallic base, flake micro-normal
 *                       in the coat only, carbon weave, brushed metal, rubber.
 *   textures/procedural  everything baked at boot to DataTextures/CanvasTextures;
 *                       zero asset files, zero network.
 *   render/lighting.js   PMREM image-based lighting baked from a probe scene with
 *                       a real floor + horizon band (no mirror-sky lower
 *                       hemisphere); key light carries the shadows; ONE exposure
 *                       path, exactly one tonemap (here: three's OutputPass).
 *   render/postfx.js     bloom threshold in exposed/linear units, vignette,
 *                       grain, chromatic aberration, sharpen.
 *
 * HONEST DELTAS vs apex-gp (kept small on purpose):
 *   - single 2048 PCFSoft shadow map, not 4-cascade CSM chunk surgery.
 *   - UnrealBloomPass, not the 6-mip Jimenez chain; no GTAO, no motion blur,
 *     no TAA/SMAA (composer uses MSAA render target instead).
 *   - three's built-in ACESFilmic via OutputPass, not the custom fitted RRT/ODT.
 *   - per-material env tuning is GLOBAL (scene.environmentIntensity) because
 *     newer three folds scene.environmentIntensity over material.envMapIntensity
 *     for scene-driven IBL — materials.js documents this trap at length.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ------------------------------------------------------------------ PRNG */
// One seeded stream so the bake reproduces (apex house rule: no Math.random).
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------- procedural maps */
// Smooth (interpolated) value noise for texture baking. White per-pixel noise
// in albedo/roughness/bump maps aliases into sparkle-grain on the final frame,
// so every map below varies smoothly and only the film grain stays per-pixel.
function makeValueNoise(seed) {
  const hash = (x, y) => {
    let h = (x * 374761393 + y * 668265263 + seed * 974711) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi);
    const c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x, y, oct = 3) => {
    let f = 0, amp = 0.5, tot = 0;
    for (let i = 0; i < oct; i++) { f += amp * noise(x, y); tot += amp; x *= 2.03; y *= 2.03; amp *= 0.5; }
    return f / tot;
  };
  return { noise, fbm };
}
function canvasTex(w, h, painter, srgb = false) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  painter(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Livery / albedo: abstract speed stripes + roundel. (stage 7: texture)
function bakeLivery(seed) {
  return canvasTex(1024, 512, (g, w, h) => {
    const rng = mulberry32(seed);
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0.0, '#c21218');
    grad.addColorStop(0.55, '#8f0d12');
    grad.addColorStop(0.56, '#101114');
    grad.addColorStop(1.0, '#17181c');
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8e9eb';                       // speed stripe
    g.beginPath();
    g.moveTo(0, h * 0.46); g.lineTo(w, h * 0.30);
    g.lineTo(w, h * 0.36); g.lineTo(0, h * 0.52);
    g.closePath(); g.fill();
    g.fillStyle = '#0c0d10';                       // nose band
    g.fillRect(0, h * 0.60, w, h * 0.10);
    g.strokeStyle = 'rgba(232,233,235,0.9)';       // roundel
    g.lineWidth = 10;
    g.beginPath(); g.arc(w * 0.72, h * 0.30, 54, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#e8e9eb';
    g.font = 'bold 64px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('07', w * 0.72, h * 0.30);
    for (let i = 0; i < 300; i++) {                // faint paint dust
      g.fillStyle = 'rgba(0,0,0,' + (rng() * 0.045).toFixed(3) + ')';
      g.fillRect(rng() * w, rng() * h, 2, 2);
    }
  }, true);
}

// Carbon 2x2 twill: albedo near-uniform dark (weave reads in specular, not in
// shade — materials.js), bump carries the tow bulge + filament striations.
function bakeCarbon(seed) {
  const S = 256, TOWS = 12;
  const alb = canvasTex(S, S, (g) => {
    const img = g.createImageData(S, S);
    const { fbm } = makeValueNoise(seed);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const su = (x / S) * TOWS, sv = (y / S) * TOWS;
      const cu = Math.floor(su), cv = Math.floor(sv);
      const warpOver = (((cv - cu) % 4) + 4) % 4 < 2;
      const across = warpOver ? su - cu : sv - cv;
      const bulge = Math.pow(Math.sin(Math.PI * across), 0.65);
      const fil = (fbm(x * 0.02, y * 0.35, 2) - 0.5) * 0.024;   // smooth filaments
      const l = 0.030 + bulge * 0.016 + fil;       // linear-ish dark graphite
      const v = Math.max(0, Math.min(255, Math.round(Math.pow(l, 1 / 2.2) * 255)));
      const i = (y * S + x) * 4;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = Math.round(v * 0.97);
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }, true);
  const bump = canvasTex(S, S, (g) => {
    const img = g.createImageData(S, S);
    const { fbm } = makeValueNoise(seed + 99);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const su = (x / S) * TOWS, sv = (y / S) * TOWS;
      const cu = Math.floor(su), cv = Math.floor(sv);
      const warpOver = (((cv - cu) % 4) + 4) % 4 < 2;
      const across = warpOver ? su - cu : sv - cv;
      const along = warpOver ? sv - cv : su - cu;
      const bulge = Math.pow(Math.sin(Math.PI * across), 0.65);
      const soft = (fbm(x * 0.06, y * 0.06, 3) - 0.5) * 18;   // smooth relief
      const v = Math.round(90 + bulge * 120 + soft + Math.sin(along * 40) * 8);
      const i = (y * S + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
  const rough = canvasTex(S, S, (g) => {
    const img = g.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const su = (x / S) * TOWS, sv = (y / S) * TOWS;
      const cu = Math.floor(su), cv = Math.floor(sv);
      const warpOver = (((cv - cu) % 4) + 4) % 4 < 2;
      const across = warpOver ? su - cu : sv - cv;
      const edge = 1 - Math.pow(Math.sin(Math.PI * across), 0.65);
      const v = Math.round((0.24 + edge * 0.38) * 255);   // valleys glossier
      const i = (y * S + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
  return { alb, bump, rough };
}

// Brushed titanium: streaks along one axis live in roughness.
function bakeBrushed(seed) {
  return canvasTex(256, 256, (g, w, h) => {
    const rng = mulberry32(seed);
    const { fbm } = makeValueNoise(seed + 7);
    const img = g.createImageData(w, h);
    // Sparse control columns, smoothly interpolated: per-column random steps
    // shimmer as they minify, a smooth brush does not.
    const ctrl = [];
    for (let x = 0; x <= w; x += 16) ctrl.push(0.30 + rng() * 0.25);
    const streakAt = (x) => {
      const f = (x / 16), i0 = Math.min(ctrl.length - 2, Math.floor(f)), t = f - i0;
      const s = t * t * (3 - 2 * t);
      return ctrl[i0] + (ctrl[i0 + 1] - ctrl[i0]) * s;
    };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      // Streaks run full-length down y; only a smooth low ripple varies along it.
      const ripple = (fbm(x * 0.05, y * 0.008, 2) - 0.5) * 0.05;
      const v = Math.round((streakAt(x) + ripple) * 255);
      const i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.max(0, Math.min(255, v));
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
}

// Flake micro-normal for the clearcoat only (never the base layer —
// materials.js: base-layer flake terminator-shades panels into hammered metal).
// Smooth orange-peel undulation plus a few soft glints: sparse single-texel
// spikes alias into sparkle-grain, so the glints are dim and infrequent.
function bakeFlake(seed) {
  const t = canvasTex(256, 256, (g, w, h) => {
    const rng = mulberry32(seed);
    const { fbm } = makeValueNoise(seed + 3);
    const img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const peel = (fbm(x * 0.045, y * 0.045, 3) - 0.5) * 30;
      const glint = rng() < 0.003 ? 40 : 0;
      const i = (y * w + x) * 4;
      img.data[i * 4] = Math.max(0, Math.min(255, Math.round(128 + peel + glint)));
      img.data[i * 4 + 1] = 128;
      img.data[i * 4 + 2] = 255; img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
  t.repeat.set(12, 6);   // coarser tile: fewer sub-pixel flakes to shimmer
  return t;
}

// UV debug checker with island tint.
function bakeChecker() {
  const t = canvasTex(512, 512, (g, w, h) => {
    const n = 8, s = w / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const even = (x + y) % 2 === 0;
      g.fillStyle = even ? '#1d3a52' : '#c8d4de';
      g.fillRect(x * s, y * s, s, s);
      g.fillStyle = even ? '#9fd0ef' : '#223544';
      g.font = '20px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(x + ',' + y, x * s + s / 2, y * s + s / 2);
    }
  }, true);
  return t;
}

// Studio asphalt: dark speckle + painted halo ring (not a racing line).
function bakeAsphalt(seed) {
  const map = canvasTex(512, 512, (g, w, h) => {
    const rng = mulberry32(seed);
    g.fillStyle = '#232427'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4500; i++) {
      const v = 26 + Math.round(rng() * 14);
      g.fillStyle = 'rgb(' + v + ',' + v + ',' + (v + 2) + ')';
      g.fillRect(rng() * w, rng() * h, 1.6, 1.6);
    }
    g.strokeStyle = 'rgba(200,210,220,0.5)'; g.lineWidth = 5;
    g.beginPath(); g.arc(w / 2, h / 2, w * 0.30, 0, Math.PI * 2); g.stroke();
  }, true);
  map.repeat.set(6, 6);
  return map;
}

// Equirect studio probe: sky gradient + sun blob + warm horizon band + dark
// floor. One texture drives scene.background AND the PMREM IBL so the hero
// reflects the same world the camera sees (lighting.js _buildEnvGround idea).
const SUN_DIR = new THREE.Vector3(-0.55, 0.42, 0.62).normalize();
function bakeProbe() {
  const W = 512, H = 256;
  const t = canvasTex(W, H, (g) => {
    const img = g.createImageData(W, H);
    const su = Math.atan2(SUN_DIR.z, SUN_DIR.x) / (Math.PI * 2) + 0.5;
    const sv = Math.acos(THREE.MathUtils.clamp(SUN_DIR.y, -1, 1)) / Math.PI;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      const dy = v - 0.5;
      let r, gg, b;
      if (dy < 0) {                                   // sky
        const k = -dy * 2;
        r = 0.16 + 0.55 * Math.pow(1 - k, 2.2);
        gg = 0.28 + 0.48 * Math.pow(1 - k, 2.0);
        b = 0.42 + 0.38 * Math.pow(1 - k, 1.6);
      } else {                                        // floor: dark, slightly warm
        const k = Math.min(1, dy * 2.4);
        r = 0.10 - 0.055 * k; gg = 0.095 - 0.052 * k; b = 0.09 - 0.05 * k;
      }
      const band = Math.exp(-Math.pow((Math.abs(dy) - 0.012) / 0.045, 2));  // horizon band
      r -= band * 0.14; gg -= band * 0.13; b -= band * 0.11;
      let du = Math.abs(u - su); du = Math.min(du, 1 - du);
      const dv = v - sv;
      const sun = Math.exp(-(du * du * 900 + dv * dv * 900));               // sun blob
      const disc = Math.exp(-(du * du * 9000 + dv * dv * 9000)) * 22.0;
      r += sun * 1.1 + disc; gg += sun * 0.9 + disc * 0.95; b += sun * 0.7 + disc * 0.85;
      const i = (y * W + x) * 4;
      img.data[i] = Math.min(255, r * 255); img.data[i + 1] = Math.min(255, gg * 255);
      img.data[i + 2] = Math.min(255, b * 255); img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }, true);
  t.mapping = THREE.EquirectangularReflectionMapping;
  return t;
}

/* ------------------------------------------------------------- renderer */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;   // the ONE tonemap (OutputPass owns it in composer path)
renderer.toneMappingExposure = 1.12;
renderer.info.autoReset = false;   // accumulate calls/tris across composer passes

const scene = new THREE.Scene();
const probeTex = bakeProbe();
scene.background = probeTex;
scene.fog = new THREE.Fog(0x0a0e14, 34, 95);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromEquirectangular(probeTex).texture;
scene.environmentIntensity = 0.85;
probeTex.dispose();
pmrem.dispose();

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(7.4, 3.6, 9.2);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.9;
controls.minDistance = 3.5;
controls.maxDistance = 30;

/* ---------------------------------------------------------------- lights */
const key = new THREE.DirectionalLight(0xfff1e0, 3.2);
key.position.copy(SUN_DIR).multiplyScalar(30);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -8; key.shadow.camera.right = 8;
key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
key.shadow.camera.near = 10; key.shadow.camera.far = 60;
key.shadow.bias = -0.0002;
key.shadow.normalBias = 0.02;
scene.add(key, key.target);

const rim = new THREE.DirectionalLight(0x7fb8ff, 0.0);   // stage 11
rim.position.set(6, 4, -9);
scene.add(rim, rim.target);

const hemi = new THREE.HemisphereLight(0x9fc0ff, 0x201a14, 0.35);
scene.add(hemi);

/* ------------------------------------------------------------ hero group */
const hero = new THREE.Group();
scene.add(hero);

const bodyGeo = new THREE.TorusKnotGeometry(1.35, 0.40, 512, 96);
const livery = bakeLivery(713);
const carbon = bakeCarbon(41);
const brushed = bakeBrushed(97);
const flake = bakeFlake(5);
const checker = bakeChecker();

const paintMat = new THREE.MeshPhysicalMaterial({     // apex paint recipe, small
  map: livery,
  color: 0xffffff,
  metalness: 0.25,    // dielectric-leaning paint: red diffuse survives every
  roughness: 0.5,     // angle; coat + key highlights carry the gloss instead
  clearcoat: 0.55,    // tuned gloss: full 1.0 mirrors the bright probe and
  clearcoatRoughness: 0.16,   // erases the livery (apex "silver smear" finding)
  clearcoatNormalMap: flake,
  clearcoatNormalScale: new THREE.Vector2(0.22, 0.22),
  envMapIntensity: 0.45,   // keeps the livery readable at grazing angles;
});
const carbonMat = new THREE.MeshPhysicalMaterial({
  map: carbon.alb, bumpMap: carbon.bump, bumpScale: 0.35,
  roughnessMap: carbon.rough, roughness: 1.0,
  metalness: 0.9, clearcoat: 0.8, clearcoatRoughness: 0.12,
  color: 0xbfbfbf,
});
const metalMat = new THREE.MeshStandardMaterial({
  color: 0xb8bcc2, metalness: 1.0, roughness: 0.38, roughnessMap: brushed,
});
const flatMat = new THREE.MeshStandardMaterial({ color: 0x8a8f96, roughness: 0.9, metalness: 0.0, flatShading: true });
const smoothMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.65, metalness: 0.1 });
const normalMat = new THREE.MeshNormalMaterial();
const uvMat = new THREE.MeshBasicMaterial({ map: checker });
const albedoMat = new THREE.MeshStandardMaterial({ map: livery, roughness: 0.7, metalness: 0.0 });
const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(4.0, 0.35, 0.30) }); // HDR: feeds bloom past threshold
glowMat.toneMapped = true;
const glowMatCool = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35, 2.6, 3.2) });
glowMatCool.toneMapped = true;

const body = new THREE.Mesh(bodyGeo, smoothMat);
body.position.y = 2.1;
body.castShadow = true;
hero.add(body);

const points = new THREE.Points(bodyGeo, new THREE.PointsMaterial({ color: 0x6fd6ff, size: 0.022, sizeAttenuation: true }));
points.position.copy(body.position);
hero.add(points);

const wire = new THREE.LineSegments(
  new THREE.WireframeGeometry(bodyGeo),
  new THREE.LineBasicMaterial({ color: 0x9fe6ff, transparent: true, opacity: 0.85 })
);
wire.position.copy(body.position);
hero.add(wire);

const halo = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.07, 20, 140), metalMat);
halo.position.y = 2.1;
halo.rotation.x = Math.PI / 2.25;
halo.castShadow = true;
hero.add(halo);

const glowRing = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.028, 12, 140), glowMat);
glowRing.position.copy(halo.position);
glowRing.rotation.copy(halo.rotation);
hero.add(glowRing);

const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 0.5, 48), carbonMat);
plinth.position.y = 0.25;
plinth.castShadow = true;
plinth.receiveShadow = true;
hero.add(plinth);

const fins = [];
for (let i = 0; i < 3; i++) {
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.5), carbonMat);
  const a = (i / 3) * Math.PI * 2;
  fin.position.set(Math.cos(a) * 1.9, 1.35, Math.sin(a) * 1.9);
  fin.rotation.y = -a + Math.PI / 2;
  fin.castShadow = true;
  hero.add(fin);
  fins.push({ mesh: fin, base: fin.position.y, phase: i * 2.1 });
}

// Rig proxies: horn + tail joints that flex at stage 9 (the "rig" read).
const horn = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.9, 20), metalMat);
horn.position.set(0, 3.9, 0);
horn.castShadow = true;
hero.add(horn);

/* ---------------------------------------------------------- scene dressing */
const setGroup = new THREE.Group();
scene.add(setGroup);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(34, 72),
  new THREE.MeshStandardMaterial({ map: bakeAsphalt(7), roughness: 0.94, metalness: 0.0, color: 0xffffff })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
setGroup.add(ground);

const shards = [];
{
  const rng = mulberry32(20240);
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.16 + rng() * 0.3),
      i % 3 === 0 ? glowMatCool : metalMat
    );
    const a = rng() * Math.PI * 2, r = 4.5 + rng() * 6;
    m.position.set(Math.cos(a) * r, 0.6 + rng() * 3.4, Math.sin(a) * r);
    m.rotation.set(rng() * 3, rng() * 3, rng() * 3);
    m.castShadow = true;
    setGroup.add(m);
    shards.push({ mesh: m, spin: 0.2 + rng() * 0.8, bob: rng() * 6.28 });
  }
}
const pillars = [];
for (let i = 0; i < 4; i++) {
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7, 0.5), carbonMat);
  const a = (i / 4) * Math.PI * 2 + 0.78;
  p.position.set(Math.cos(a) * 11, 3.5, Math.sin(a) * 11);
  p.castShadow = true;
  setGroup.add(p);
  pillars.push(p);
}

/* --------------------------------------- instanced scenery (the "chunks") */
// Geometry scales here, not in draw calls: one InstancedMesh per material, so
// thousands of chunks cost one call each. Counts are cut by the DENSITY switch
// (mesh.count <= built max, no rebuilds). Honest ceiling note: ULTRA lands
// around a million triangles — roughly 20x the original scene. Literal 1000x
// would be ~57M tris/frame, beyond any realtime consumer GPU's vertex budget.
const DENS_LABEL = ['LOW', 'MED', 'HIGH', 'ULTRA'];
const DENS_FRAC = [0.125, 0.25, 0.5, 1.0];
const dummy = new THREE.Object3D();
function scatter(mesh, list) {
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    dummy.position.set(s.x, s.y, s.z);
    dummy.rotation.set(s.rx, s.ry, s.rz);
    dummy.scale.set(s.s, s.sy || s.s, s.s);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;   // one mesh, world-spread instances: no culling
  return mesh;
}
function buildSpires(max) {
  const m = new THREE.InstancedMesh(new THREE.ConeGeometry(0.35, 1, 7, 3), carbonMat, max);
  const rng = mulberry32(4242);
  const list = [];
  for (let i = 0; i < max; i++) {
    const a = rng() * Math.PI * 2, r = 5 + rng() * 24;
    const h = 0.8 + rng() * rng() * 2.8;
    list.push({
      x: Math.cos(a) * r, y: h / 2 - 0.1, z: Math.sin(a) * r,
      rx: (rng() - 0.5) * 0.14, ry: rng() * Math.PI, rz: (rng() - 0.5) * 0.14,
      s: 0.7 + rng() * 0.9, sy: h,
    });
  }
  m.castShadow = true;
  m.receiveShadow = true;
  setGroup.add(scatter(m, list));
  return m;
}
function buildSwarm(max, mat, seed, glowy) {
  const m = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 1), mat, max);
  const rng = mulberry32(seed);
  const list = [];
  for (let i = 0; i < max; i++) {
    const a = rng() * Math.PI * 2, r = 16 + rng() * 18;
    list.push({
      x: Math.cos(a) * r, y: 1.5 + rng() * 8.0, z: Math.sin(a) * r,
      rx: rng() * 3, ry: rng() * 3, rz: rng() * 3, s: 0.08 + rng() * rng() * 0.28,
    });
  }
  m.castShadow = !glowy;
  setGroup.add(scatter(m, list));
  return m;
}
function buildMotes(max) {
  const pos = new Float32Array(max * 3);
  const rng = mulberry32(777);
  for (let i = 0; i < max; i++) {
    const a = rng() * Math.PI * 2, r = Math.sqrt(rng()) * 32;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = rng() * 12;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.Points(g, new THREE.PointsMaterial({
    color: 0x9fc8e8, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false,
  }));
  setGroup.add(m);
  return m;
}
const SPIRES_MAX = 4000, SWARM_MAX = 12000, GLOW_MAX = 800, MOTES_MAX = 60000;
const spires = buildSpires(SPIRES_MAX);
const swarm = buildSwarm(SWARM_MAX, metalMat, 20240, false);
const glowSwarm = buildSwarm(GLOW_MAX, glowMatCool, 30331, true);
const motes = buildMotes(MOTES_MAX);
swarm.rotation.y = 0.6;
function applyDensity() {
  const f = DENS_FRAC[pretty.density];
  spires.count = Math.max(1, Math.floor(SPIRES_MAX * f));
  swarm.count = Math.max(1, Math.floor(SWARM_MAX * f));
  glowSwarm.count = pretty.glow ? Math.max(1, Math.floor(GLOW_MAX * f)) : 0;
  motes.geometry.setDrawRange(0, Math.floor(MOTES_MAX * f));
}

/* ------------------------------------------------------------------ post */
const composer = new EffectComposer(renderer,
  new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
    { type: THREE.HalfFloatType, samples: 4 }));   // MSAA resolve in the chain:
// the default composer target is samples:0, so every silhouette crawled while
// the turntable moved — a big half of the "grainy" read.
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight), 0.42, 0.65, 1.0
);
composer.addPass(bloomPass);

// Finish: vignette + luma-tracked grain + faint lateral CA (postfx.js finish).
const FinishShader = {
  uniforms: {
    tDiffuse: { value: null },
    uVignette: { value: 0.32 },
    uGrain: { value: 0.008 },
    uTime: { value: 0 },
    uCA: { value: 0.0009 },
  },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
  fragmentShader: [
    'uniform sampler2D tDiffuse;',
    'uniform float uVignette; uniform float uGrain; uniform float uTime; uniform float uCA;',
    'varying vec2 vUv;',
    'float hash(vec2 p) { p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }',
    'void main() {',
    '  vec2 d = (vUv - 0.5) * uCA * (0.5 + dot(vUv - 0.5, vUv - 0.5) * 4.0);',
    '  vec3 col;',
    '  col.r = texture2D(tDiffuse, vUv - d).r;',
    '  col.g = texture2D(tDiffuse, vUv).g;',
    '  col.b = texture2D(tDiffuse, vUv + d).b;',
    '  vec2 vc = vUv - 0.5;',
    '  col *= clamp(1.0 - uVignette * dot(vc, vc) * 2.4, 0.0, 1.0);',
    '  float g = hash(vUv * 913.7 + fract(uTime) * 7.13) - 0.5;',
    '  col += g * uGrain * (0.35 + 0.65 * (1.0 - clamp(dot(col, vec3(0.333)), 0.0, 1.0)));',
    '  gl_FragColor = vec4(col, 1.0);',
    '}',
  ].join('\n'),
};
const finishPass = new ShaderPass(FinishShader);
composer.addPass(finishPass);
composer.addPass(new OutputPass());

/* -------------------------------------------------------- stages 1..13 */
const STAGES = [
  { id: 1, name: 'Point cloud / blockout', look: 'Loose points in space. No edges, no surfaces — just placement and proportion.', adds: '<b>+</b> basic proportions and placement' },
  { id: 2, name: 'Wireframe', look: 'Vertices and edges only. The skeleton: topology and polygon flow.', adds: '<b>+</b> edge structure, polygon flow' },
  { id: 3, name: 'Mesh / geometry', look: 'Connected polygons with per-face normals. Silhouette reads, but no light response yet.', adds: '<b>+</b> actual surfaces and silhouette' },
  { id: 4, name: 'Solid / flat-shaded', look: 'Filled surfaces, one flat colour per face. Volume and form become visible.', adds: '<b>+</b> volume, form, surface visibility' },
  { id: 5, name: 'Smooth shading', look: 'Interpolated normals, soft light response. Rounded appearance, still untextured.', adds: '<b>+</b> basic lighting response' },
  { id: 6, name: 'UV unwrap', look: 'The model flattened into 2D islands — a checker proves the coordinates wrap without stretching.', adds: '<b>+</b> 2D coordinate system for textures' },
  { id: 7, name: 'Texture / colour map', look: 'Painted surface detail: livery stripes, roundel, dust. Still matte and flat.', adds: '<b>+</b> base colour, patterns, markings' },
  { id: 8, name: 'PBR material maps', look: 'Clearcoat paint with flake, carbon weave, brushed metal, HDR glow strips. Reflections and specular arrive.', adds: '<b>+</b> roughness, metalness, bump, clearcoat, emissive' },
  { id: 9, name: 'Rigging / skinning', look: 'Joints flex: halo breathes, fins sway, horn nods. Deformation preview for animation.', adds: '<b>+</b> movement and deformation' },
  { id: 10, name: 'Scene setup', look: 'The sculpture placed in a world: plinth, asphalt studio, pillars, drifting shards — plus thousands of instanced spires and motes (DENSITY switch).', adds: '<b>+</b> camera, props, scale, composition' },
  { id: 11, name: 'Lighting', look: 'Full rig: shadowed key, cool rim, image-based skylight. Direct, shadow and reflection in balance.', adds: '<b>+</b> shadows, rim, IBL, exposure' },
  { id: 12, name: 'Rendering', look: 'The HDR resolve: full-res linear render through one exposure and one ACES tonemap.', adds: '<b>+</b> calculated pixels, one clean path' },
  { id: 13, name: 'Post-processing', look: 'The pretty: bloom on the glow strips, vignette, grain, faint chromatic aberration.', adds: '<b>+</b> bloom, grade, vignette, grain' },
];

let stage = 1;
// Pretty switches. Reset to stage defaults on every stage change; the user can
// strip the beauty back out (or force it early) from there.
let pretty = {};
function defaultsFor(s) {
  return {
    ibl: s >= 8,          // image-based reflections (probe)
    specular: s >= 8,     // clearcoat + key specular
    glow: s >= 8,         // HDR emissive strips
    shadows: s >= 11,     // shadowed key + rim
    hdr: s >= 12,         // composer resolve path
    bloom: s >= 13,       // bloom pass
    grade: s >= 13,       // finish: vignette / grain / CA
    turntable: s >= 9,    // rig turntable
    density: 2,           // HIGH: instanced chunk density (LOW/MED/HIGH/ULTRA)
  };
}

const stepsEl = document.getElementById('steps');
const togglesEl = document.getElementById('toggles');
const scNum = document.getElementById('scNum');
const scName = document.getElementById('scName');
const scLook = document.getElementById('scLook');
const scAdds = document.getElementById('scAdds');

const TOGGLES = [
  ['ibl', 'REFLECTIONS'],
  ['specular', 'SPECULAR'],
  ['glow', 'GLOW'],
  ['shadows', 'SHADOWS'],
  ['bloom', 'BLOOM'],
  ['grade', 'GRADE'],
  ['turntable', 'TURNTABLE'],
];
let tourTimer = 0;
let touring = false;

function buildRail() {
  stepsEl.replaceChildren();
  STAGES.forEach((s) => {
    const b = document.createElement('button');
    const short = s.name.split(' /')[0];
    b.innerHTML = s.id + '<small>' + short + '</small>';
    b.title = s.id + '. ' + s.name;
    b.className = s.id < stage ? 'done' : s.id === stage ? 'now' : '';
    b.onclick = () => { stopTour(); setStage(s.id); };
    stepsEl.appendChild(b);
  });
  togglesEl.replaceChildren();
  TOGGLES.forEach(([k, label]) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = pretty[k] ? 'on' : '';
    b.onclick = () => { stopTour(); pretty[k] = !pretty[k]; applyStage(); buildRail(); };
    togglesEl.appendChild(b);
  });
  const sep = document.createElement('div');
  sep.className = 'sep';
  togglesEl.appendChild(sep);
  const dens = document.createElement('button');
  dens.textContent = 'DENSITY ' + DENS_LABEL[pretty.density];
  dens.title = 'Instanced chunk density: LOW/MED/HIGH/ULTRA';
  dens.className = pretty.density >= 2 ? 'on' : '';
  dens.onclick = () => { pretty.density = (pretty.density + 1) % 4; applyDensity(); buildRail(); };
  togglesEl.appendChild(dens);
  const tour = document.createElement('button');
  tour.textContent = touring ? 'STOP TOUR' : 'AUTO-TOUR';
  tour.className = touring ? 'on' : '';
  tour.onclick = () => { touring ? stopTour() : startTour(); buildRail(); };
  togglesEl.appendChild(tour);
  const note = document.createElement('span');
  note.className = 'note';
  note.textContent = padNote();
  togglesEl.appendChild(note);
}

function setStage(s) {
  stage = Math.max(1, Math.min(13, s));
  const keepDensity = Number.isInteger(pretty.density) ? pretty.density : 2;
  pretty = defaultsFor(stage);
  pretty.density = keepDensity;   // density is a user choice, not a stage
  applyStage();
  buildRail();
}

function applyStage() {
  const s = STAGES[stage - 1];
  scNum.textContent = 'STAGE ' + s.id + ' / 13';
  scName.textContent = s.name;
  scLook.textContent = s.look;
  scAdds.innerHTML = s.adds;

  // Hero representation per stage.
  points.visible = stage === 1;
  wire.visible = stage === 2;
  if (stage === 3) body.material = normalMat;
  else if (stage === 4) body.material = flatMat;
  else if (stage === 5) body.material = smoothMat;
  else if (stage === 6) body.material = uvMat;
  else if (stage === 7) body.material = albedoMat;
  else body.material = paintMat;
  body.visible = stage >= 3;

  // Rig dressing, scene set.
  halo.visible = glowRing.visible = horn.visible = stage >= 5;
  fins.forEach((f) => { f.mesh.visible = stage >= 5; });
  plinth.visible = stage >= 5;
  setGroup.visible = stage >= 10;

  // Materials respond to pretty switches.
  paintMat.clearcoat = pretty.specular ? 0.55 : 0.0;
  paintMat.envMapIntensity = pretty.ibl ? 0.45 : 0.0;
  carbonMat.envMapIntensity = pretty.ibl ? 0.9 : 0.0;
  metalMat.envMapIntensity = pretty.ibl ? 1.1 : 0.0;
  paintMat.needsUpdate = false;
  glowRing.visible = pretty.glow && stage >= 5;
  shards.forEach((sh, i) => {
    if (i % 3 === 0) sh.mesh.visible = pretty.glow && stage >= 10;
  });

  // Lighting rig.
  key.castShadow = pretty.shadows;
  key.intensity = pretty.specular ? 3.2 : 1.1;
  rim.intensity = pretty.shadows ? 1.4 : 0.0;
  hemi.intensity = stage >= 11 ? 0.35 : 0.7;
  scene.environmentIntensity = pretty.ibl ? (stage >= 11 ? 0.85 : 0.45) : 0.0;

  // Render path: raw LDR until 12, composer resolve, bloom + grade at 13.
  bloomPass.enabled = pretty.bloom && (pretty.hdr || stage >= 12);
  finishPass.enabled = pretty.grade && (pretty.hdr || stage >= 12);
  applyDensity();
  controls.autoRotate = pretty.turntable;
}

function startTour() { touring = true; tourTimer = 0; }
function stopTour() { touring = false; }

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { stopTour(); setStage(stage + 1); }
  else if (e.key === 'ArrowLeft') { stopTour(); setStage(stage - 1); }
  else if (e.key === ' ') { e.preventDefault(); touring ? stopTour() : startTour(); buildRail(); }
  else if (e.key === 'g' || e.key === 'G') {
    padDbg.open = !padDbg.open;
    padDbgEl.style.display = padDbg.open ? 'block' : 'none';
  }
});

/* ------------------------------------------------------- gamepad (XInput) */
// Standard-mapping pads — Xbox (XInput), DualShock and friends — via the
// Gamepad API. No game logic involved: sticks drive the orbit camera, buttons
// walk the 13 stages and flip the pretty switches.
//   left stick        orbit          right stick Y   dolly
//   A / RB            next stage     B / LB          prev stage
//   d-pad L / R       prev / next    X               turntable
//   Y / start         auto-tour      LT / RT         bloom / grade
//   d-pad U / D       shadows / reflections   back   reset camera
const pad = { prev: [], connected: false, label: '', mapping: '', last: '' };
function padNote() {
  let s = 'drag to orbit · wheel to zoom · \u2190/\u2192 stages · G pad debug';
  if (pad.connected) {
    s += ' · pad: ' + (pad.label || 'connected') + ' — press any button';
    if (pad.mapping && pad.mapping !== 'standard') s += ' (non-standard: A/B/sticks only)';
    if (pad.last) s += ' · last: ' + pad.last;
  } else {
    s += ' · pad: none — press any XInput button';
  }
  return s;
}
// Connection events refresh the rail immediately; per-frame polling below is
// the fallback (and the only path when getGamepads is stubbed or events are
// missing). Browsers enumerate a pad only after its first button press.
window.addEventListener('gamepadconnected', (e) => {
  pad.connected = true;
  pad.label = String((e.gamepad && e.gamepad.id) || 'pad').slice(0, 30);
  pad.mapping = (e.gamepad && e.gamepad.mapping) || '';
  padDbg.events++;
  padDbg.lastEvent = pad.label;
  try {
    console.log('[pad] connected:', e.gamepad.id, '| mapping:', e.gamepad.mapping,
      '| buttons:', (e.gamepad.buttons || []).length, '| axes:', (e.gamepad.axes || []).length);
  } catch { /* console unavailable */ }
  buildRail();
});
window.addEventListener('gamepaddisconnected', () => {
  pad.connected = false;
  pad.label = '';
  pad.mapping = '';
  pad.last = '';
  pad.prev = [];
  buildRail();
});

/* ------------------------------------------- gamepad diagnostics (G / ?pad=1) */
// When a pad "doesn't work", this shows exactly what the browser reports: API
// presence, secure context, connect events, and the raw per-pad button/axis
// state the handler reads from. Screenshot it and the cause stops being a guess.
const padDbg = { open: false, events: 0, lastEvent: '' };
const padDbgEl = document.createElement('pre');
padDbgEl.id = 'padDbg';
padDbgEl.style.cssText = 'position:fixed;left:12px;top:64px;z-index:40;max-width:min(480px,90vw);max-height:60vh;overflow:auto;display:none;margin:0;padding:10px 12px;font:10px/1.6 ui-monospace,Menlo,monospace;letter-spacing:.04em;color:#dff2ff;background:rgba(4,10,18,.88);border:1px solid rgba(111,214,255,.35);border-radius:4px;white-space:pre-wrap;pointer-events:none;';
document.body.appendChild(padDbgEl);
function padDbgText() {
  const L = [];
  L.push('GAMEPAD DIAGNOSTICS  (G toggles, ?pad=1 opens)');
  L.push('api: ' + typeof navigator.getGamepads + '   secure: ' + window.isSecureContext);
  L.push('connect events: ' + padDbg.events + (padDbg.lastEvent ? '   last: ' + padDbg.lastEvent : ''));
  let pads = null;
  try { pads = navigator.getGamepads ? navigator.getGamepads() : null; }
  catch (e) { L.push('getGamepads threw: ' + e); }
  // NOTE: Chrome returns [null,null,null,null] with nothing connected, so an
  // entry count — not array length — decides "none enumerated".
  let seen = 0;
  if (pads) {
    for (let gi = 0; gi < pads.length; gi++) {
      const q = pads[gi];
      if (!q) continue;
      seen++;
      const btns = q.buttons || [];
      const down = [];
      for (let i = 0; i < btns.length; i++) {
        if (btns[i] && (btns[i].pressed || btns[i].value > 0.4)) down.push(i);
      }
      const axes = q.axes || [];
      L.push('[' + gi + '] ' + String(q.id || '?').slice(0, 60));
      L.push('    mapping=' + (q.mapping || '(none)') + ' connected=' + q.connected +
        ' buttons=' + btns.length + ' axes=' + axes.length);
      L.push('    down=[' + down.join(',') + '] axes=[' +
        axes.map((a) => (typeof a === 'number' ? a.toFixed(2) : '?')).join(',') + ']');
    }
  }
  if (!seen) {
    L.push('pads: none enumerated — browsers list a pad only after its first button press');
  }
  L.push('handler: connected=' + pad.connected + ' mapping=' + (pad.mapping || '(none)') +
    ' last=' + (pad.last || '(none)'));
  return L.join('\n');
}
try {
  if (new URLSearchParams(location.search).get('pad') === '1') {
    padDbg.open = true;
    padDbgEl.style.display = 'block';
  }
} catch { /* location unavailable */ }
function readPad() {
  try {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) { if (p && p.connected) return p; }
  } catch { /* no Gamepad API in this browser */ }
  return null;
}
const dz = (v) => Math.abs(v) < 0.18 ? 0 : (v - Math.sign(v) * 0.18) / 0.82;
function pressed(p, i) { const b = p.buttons[i]; return !!(b && (b.pressed || b.value > 0.4)); }
function edgePad(p, i) {
  if (i < 0) return false;
  const now = pressed(p, i), was = pad.prev[i];
  pad.prev[i] = now;
  return now && !was;
}
function rumble(p, ms = 70) {
  try {
    const a = p.vibrationActuator;
    if (a && a.playEffect) a.playEffect('dual-rumble', { duration: ms, weakMagnitude: 0.4, strongMagnitude: 0.2 });
  } catch { /* rumble unsupported */ }
}
function orbitBy(dTheta, dPhi) {
  const off = camera.position.clone().sub(controls.target);
  const sph = new THREE.Spherical().setFromVector3(off);
  sph.theta -= dTheta;
  sph.phi = THREE.MathUtils.clamp(sph.phi - dPhi, 0.15, Math.PI - 0.15);
  camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph));
}
function dollyBy(f) {
  const off = camera.position.clone().sub(controls.target);
  const len = THREE.MathUtils.clamp(off.length() * f, controls.minDistance, controls.maxDistance);
  camera.position.copy(controls.target).addScaledVector(off.normalize(), len);
}
function flipToggle(k) { pretty[k] = !pretty[k]; applyStage(); buildRail(); }
function pollPad(dt) {
  let p = null;
  try {
    p = readPad();
    if (!!p !== pad.connected) {
      pad.connected = !!p;
      pad.label = p ? String(p.id || 'pad').slice(0, 30) : '';
      pad.mapping = (p && p.mapping) || '';
      if (!p) pad.prev = [];
      buildRail();
    }
    if (!p) return;
    pad.mapping = p.mapping || '';
    // Non-standard layouts (DirectInput mode, odd drivers): only the face
    // buttons and sticks can be trusted, so extras are ignored instead of
    // firing mystery actions.
    const E = (i) => edgePad(p, (p.mapping === 'standard' || i <= 3) ? i : -1);
    const ax = p.axes || [];
    const lx = dz(ax[0] || 0), ly = dz(ax[1] || 0);
    const rx = dz(ax[2] || 0), ry = dz(ax[3] || 0);
    if (lx || ly || rx || ry) {
      stopTour();
      orbitBy((lx * 1.6 + rx * 0.8) * dt, ly * 1.2 * dt);
      if (ry) dollyBy(1 + ry * 0.9 * dt);
    }
    let staged = false;
    if (E(0) || E(5) || E(15)) { stopTour(); setStage(stage + 1); staged = true; pad.last = 'stage+'; }
    else if (E(1) || E(4) || E(14)) { stopTour(); setStage(stage - 1); staged = true; pad.last = 'stage-'; }
    if (staged) rumble(p);
    if (E(2)) { stopTour(); flipToggle('turntable'); pad.last = 'turntable'; }
    if (E(3) || E(9)) { touring ? stopTour() : startTour(); buildRail(); pad.last = 'tour'; }
    if (E(6)) { stopTour(); flipToggle('bloom'); pad.last = 'bloom'; }
    if (E(7)) { stopTour(); flipToggle('grade'); pad.last = 'grade'; }
    if (E(12)) { stopTour(); flipToggle('shadows'); pad.last = 'shadows'; }
    if (E(13)) { stopTour(); flipToggle('ibl'); pad.last = 'reflections'; }
    if (E(8)) {
      stopTour();
      camera.position.set(7.4, 3.6, 9.2);
      controls.target.set(0, 1.5, 0);
      pad.last = 'cam reset';
    }
  } catch (err) {
    // A malformed virtual pad must never take the frame loop down with it.
    if (!pad.warned) { pad.warned = true; console.warn('[pad] ignoring faulty gamepad:', err); }
  }
}

/* ---------------------------------------------------------------- loop */
const clock = new THREE.Clock();
let fpsEMA = 60;
let slowTime = 0;
const stFps = document.getElementById('stFps');
const stInfo = document.getElementById('stInfo');
let statTick = 0;

function useComposer() {
  return pretty.hdr || stage >= 12 || bloomPass.enabled || finishPass.enabled;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.info.reset();
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  fpsEMA += ((dt > 0 ? 1 / dt : 60) - fpsEMA) * 0.05;

  if (touring) {
    tourTimer += dt;
    if (tourTimer > 2.6) { tourTimer = 0; setStage(stage >= 13 ? 1 : stage + 1); }
  }

  // Adaptive density: scenery this heavy steps itself down before it
  // slide-shows. Only while the scenery is actually on screen (stage 10+).
  if (stage >= 10 && pretty.density > 0) {
    if (fpsEMA < 24) slowTime += dt; else slowTime = 0;
    if (slowTime > 3) {
      slowTime = 0;
      pretty.density--;
      applyDensity();
      buildRail();
    }
  } else slowTime = 0;

  // Rig flex (stage 9 read): breathing halo, swaying fins, nodding horn.
  const rigged = stage >= 9;
  const flexT = rigged ? t : 0;
  halo.scale.setScalar(1 + Math.sin(flexT * 1.4) * (rigged ? 0.012 : 0));
  glowRing.scale.copy(halo.scale);
  fins.forEach((f) => {
    f.mesh.position.y = f.base + Math.sin(flexT * 1.8 + f.phase) * (rigged ? 0.06 : 0);
    f.mesh.rotation.z = Math.sin(flexT * 1.2 + f.phase) * (rigged ? 0.08 : 0);
  });
  horn.rotation.z = Math.sin(flexT * 0.9) * (rigged ? 0.10 : 0);
  const pulse = 0.85 + 0.15 * Math.sin(t * 2.2);
  glowMat.color.setRGB(4.0 * pulse, 0.35 * pulse, 0.30 * pulse);
  shards.forEach((sh) => {
    sh.mesh.rotation.y += dt * sh.spin;
    sh.mesh.position.y += Math.sin(t * 0.7 + sh.bob) * dt * 0.15;
  });

  finishPass.uniforms.uTime.value = t;
  bloomPass.strength = pretty.bloom ? 0.42 : 0.0;
  pollPad(dt);
  controls.update();

  if (useComposer()) composer.render();
  else renderer.render(scene, camera);

  statTick += dt;
  if (statTick > 0.5) {
    statTick = 0;
    const info = renderer.info;
    stFps.innerHTML = '<b>' + Math.round(fpsEMA) + '</b> fps';
    stInfo.innerHTML = '<b>' + info.render.calls + '</b> calls · <b>' +
      (info.render.triangles / 1000).toFixed(0) + 'k</b> tris · ' +
      (useComposer() ? 'HDR+post' : 'raw') +
      (pad.connected ? ' · pad OK' : '');
    const nn = document.querySelector('#toggles .note');
    if (nn) nn.textContent = padNote();
    if (padDbg.open) padDbgEl.textContent = padDbgText();
  }
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

setStage(1);
animate();
