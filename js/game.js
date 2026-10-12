import * as THREE from 'three';
import { ROSTER, MOVES, ARENAS, TUNING } from './data.js';
import { GameAudio } from './audio.js';
import { buildWrestlerMesh, getWrestlerData, updateAura, applyHitFlash, triggerExpression } from './rig.js';
import { 
  AKI_PHYSICS, 
  calculateAKIDamage, 
  SpiritMeter, 
  WakeupTimer, 
  attemptReversal, 
  processGroundStrike, 
  resolveGroundStrikeImpact,
  determineGrappleType,
  processGrapple,
  hasMoveFlag,
  getMoveFlagsForMove 
} from './akiPhysics.js';
import { AnimationController, MatchController, ANIMATION_SPINES, MATCH_TYPES, createWrestlerGear } from './skinnedMesh.js';
import { CLIPS, sampleClip, playClip, slamClipFor, soldClipFor, strikeClipFor } from './animClips.js';

/* ============================================================
   ATTITUDE EMPIRE — No Mercy attitude × HCTP moves × Empire freedom
   Single-file engine: custom arcade physics, procedural wrestlers.
   ============================================================ */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
const TAU = Math.PI * 2;
function angLerp(a, b, t) {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU;
  return a + d * t;
}

// ---------- constants ----------
const RING_TOP = 1.0, APRON_HALF = 4.0, ROPE = 3.55;
const GRAV = 24;

// ---------- audio ----------
const audio = new GameAudio();

// ---------- renderer / scene ----------
const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x07070f);
scene.fog = new THREE.Fog(0x07070f, 30, 90);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);

scene.add(new THREE.HemisphereLight(0x8899ff, 0x221511, 0.75));
const key = new THREE.DirectionalLight(0xfff2d9, 1.6);
key.position.set(8, 16, 6); key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.left = -14; key.shadow.camera.right = 14;
key.shadow.camera.top = 14; key.shadow.camera.bottom = -14;
scene.add(key);
const rim = new THREE.DirectionalLight(0x4466ff, 0.5); rim.position.set(-8, 10, -8); scene.add(rim);
const spotGold = new THREE.SpotLight(0xffd23f, 180, 40, 0.5, 0.5);
spotGold.position.set(0, 15, 0); spotGold.target.position.set(0, 1, 0);
scene.add(spotGold, spotGold.target);

// ---------- arena ----------
const arena = { group: new THREE.Group(), crowd: null, crowdData: [], tron: null, tronCanvas: null, tronCtx: null, tronTex: null, theme: 0 };
scene.add(arena.group);

function groundHeight(x, z) {
  return (Math.abs(x) <= APRON_HALF && Math.abs(z) <= APRON_HALF) ? RING_TOP : 0;
}
function inRing(x, z, margin = 0) {
  return Math.abs(x) <= ROPE + margin && Math.abs(z) <= ROPE + margin;
}
function arenaTune() {
  return (ARENAS[match.arenaIdx] && ARENAS[match.arenaIdx].mat) || { stiff: 0.7, bounce: 0.55, dmg: 1.0 };
}

// canvas-texture helper for branded ring/arena zones
function ctex(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  fn(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4; return t;
}

function buildArena(themeIdx) {
  // clear old
  while (arena.group.children.length) {
    const o = arena.group.children.pop();
    o.traverse?.((n) => { n.geometry?.dispose?.(); if (n.material && n.material.map && n.material.map !== arena.tronTex) n.material.map.dispose?.(); n.material?.dispose?.(); });
  }
  arena.tronTex?.dispose?.();
  arena.crowdData = [];
  const themes = [
    { mat: 0x8a1020, skirt: 0xc02020, rope: [0xffd23f, 0xffffff, 0xffd23f], floor: 0x181822, glow: 0xff3040, name: 'ATTITUDE DOME' },
    { mat: 0x10205e, skirt: 0x2456e0, rope: [0xffffff, 0xffd23f, 0xffffff], floor: 0x14141e, glow: 0x3aa0ff, name: 'PAIN PALACE' },
    { mat: 0x2a2a2a, skirt: 0x3a3a3a, rope: [0xcccccc, 0x888888, 0xcccccc], floor: 0x1c1a16, glow: 0xffb703, name: 'EMPIRE BACKYARD' },
  ];
  const th = themes[themeIdx] || themes[0];
  arena.theme = themeIdx;
  const G = arena.group;
  const brand = 'ATTITUDE EMPIRE';
  const skirtHex = '#' + th.skirt.toString(16).padStart(6, '0');

  /* ===== ZONE 0: arena floor + ringside mat pads (WWE gray) ===== */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({ color: th.floor, roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; G.add(floor);
  const pads = new THREE.Mesh(new THREE.PlaneGeometry(21, 21),
    new THREE.MeshStandardMaterial({ color: 0x8f9299, roughness: 0.92 }));
  pads.rotation.x = -Math.PI / 2; pads.position.y = 0.005; pads.receiveShadow = true; G.add(pads);
  // pad seams
  const seamM = new THREE.MeshBasicMaterial({ color: 0x5a5d63 });
  for (let i = -2; i <= 2; i++) {
    for (const horiz of [true, false]) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(horiz ? 21 : 0.06, horiz ? 0.06 : 21), seamM);
      s.rotation.x = -Math.PI / 2; s.position.set(horiz ? 0 : i * 4.2, 0.008, horiz ? i * 4.2 : 0); G.add(s);
    }
  }

  /* ===== ZONE 1: THE RING — base / skirt / apron / canvas / posts / ropes ===== */
  const base = new THREE.Mesh(new THREE.BoxGeometry(8.4, 1.0, 8.4),
    new THREE.MeshStandardMaterial({ color: 0x0c0c14, roughness: 0.8 }));
  base.position.y = 0.5; G.add(base);
  const skirtTex = ctex(1024, 128, (c, w, h) => {
    c.fillStyle = '#0b0b12'; c.fillRect(0, 0, w, h);
    c.fillStyle = skirtHex; c.fillRect(0, 0, w, 10); c.fillRect(0, h - 10, w, 10);
    c.fillStyle = '#ffd23f'; c.font = '900 64px Arial'; c.textAlign = 'center';
    c.fillText('★ ' + brand + ' ★ ' + brand + ' ★', w / 2, 88);
  });
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(8.45, 0.62, 8.45),
    new THREE.MeshStandardMaterial({ map: skirtTex, roughness: 0.7 }));
  skirt.position.y = 0.68; G.add(skirt);
  const apron = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.12, 8.0),
    new THREE.MeshStandardMaterial({ color: 0x23232f, roughness: 0.85 }));
  apron.position.y = 0.94; apron.receiveShadow = true; G.add(apron);
  // steel apron edge trim
  const trimM = new THREE.MeshStandardMaterial({ color: 0x9aa0aa, metalness: 0.8, roughness: 0.3 });
  for (const [w, x, z] of [[8.0, 0, -4.0], [8.0, 0, 4.0], [8.0, -4.0, 0], [8.0, 4.0, 0]]) {
    const e = new THREE.Mesh(new THREE.BoxGeometry(w === 8.0 && z !== 0 ? 8.0 : 0.1, 0.06, w === 8.0 && z !== 0 ? 0.1 : 8.0), trimM);
    e.position.set(x, 1.0, z); G.add(e);
  }
  const cv = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.1, 6.4),
    new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.95 }));
  cv.position.y = 1.0; cv.receiveShadow = true; G.add(cv);
  const canvasTex = ctex(512, 512, (c, w, h) => {
    c.fillStyle = '#ddd6c6'; c.fillRect(0, 0, w, h);
    c.strokeStyle = skirtHex; c.lineWidth = 26; c.strokeRect(13, 13, w - 26, h - 26);
    c.fillStyle = skirtHex;
    for (const [x, y] of [[0, 0], [w, 0], [0, h], [w, h]]) {
      c.beginPath(); c.moveTo(x, y);
      c.lineTo(x + (x ? -90 : 90), y); c.lineTo(x, y + (y ? -90 : 90)); c.fill();
    }
    c.fillStyle = skirtHex; c.beginPath(); c.arc(w / 2, h / 2, 95, 0, TAU); c.fill();
    c.fillStyle = '#ddd6c6'; c.beginPath(); c.arc(w / 2, h / 2, 78, 0, TAU); c.fill();
    c.fillStyle = skirtHex; c.font = '900 92px Arial'; c.textAlign = 'center';
    c.fillText('AE', w / 2, h / 2 + 32);
    c.font = '700 26px Arial'; c.fillText('★ ' + brand + ' ★', w / 2, h / 2 + 66);
  });
  const cvTop = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4),
    new THREE.MeshStandardMaterial({ map: canvasTex, roughness: 0.95 }));
  cvTop.rotation.x = -Math.PI / 2; cvTop.position.y = 1.056; cvTop.receiveShadow = true; G.add(cvTop);

  // posts + base plates + turnbuckle pads
  const postMat = new THREE.MeshStandardMaterial({ color: 0x22222e, roughness: 0.4, metalness: 0.7 });
  const padMat = new THREE.MeshStandardMaterial({ color: th.skirt, roughness: 0.6 });
  const postPos = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  for (const [sx, sz] of postPos) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.2, 10), postMat);
    p.position.set(sx * ROPE, 1.0 + 1.1, sz * ROPE); p.castShadow = true; G.add(p);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.5), postMat);
    plate.position.set(sx * ROPE, 1.04, sz * ROPE); G.add(plate);
    for (let i = 0; i < 3; i++) {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.18), padMat);
      pad.position.set(sx * (ROPE - 0.12), 1.62 + i * 0.36, sz * (ROPE - 0.12));
      pad.rotation.y = Math.atan2(sx, sz); pad.castShadow = true; G.add(pad);
    }
  }
  const ropeH = [1.62, 1.98, 2.32];
  for (let i = 0; i < 3; i++) {
    const rm = new THREE.MeshStandardMaterial({ color: th.rope[i], roughness: 0.5 });
    const y = ropeH[i];
    const mk = (w, x, z, alongZ) => {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, w, 8), rm);
      r.rotation.z = Math.PI / 2;
      if (alongZ) r.rotation.y = Math.PI / 2;
      r.position.set(x, y, z); G.add(r); return r;
    };
    mk(ROPE * 2, 0, -ROPE); mk(ROPE * 2, 0, ROPE);
    mk(ROPE * 2, -ROPE, 0, true); mk(ROPE * 2, ROPE, 0, true);
  }
  // rope spacers (white ties mid-span, WWE authentic)
  const tieM = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 });
  for (const off of [-1.2, 1.2]) {
    for (const [x, z] of [[off, -ROPE], [off, ROPE], [-ROPE, off], [ROPE, off]]) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.75, 0.07), tieM);
      tie.position.set(x, 1.97, z); G.add(tie);
    }
  }
  // ring steps (steel, both sides)
  const steelM = new THREE.MeshStandardMaterial({ color: 0x707078, metalness: 0.75, roughness: 0.35 });
  for (const sx of [5.1, -5.1]) {
    for (let s = 0; s < 3; s++) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.55 - s * 0.12, 0.16, 1.1),
        new THREE.MeshStandardMaterial({ color: s === 2 ? 0x2a2a33 : 0x707078, metalness: 0.6, roughness: 0.4 }));
      st.position.set(sx - Math.sign(sx) * s * 0.22, 0.08 + s * 0.16, 0);
      st.castShadow = true; G.add(st);
    }
  }

  /* ===== ZONE 2: RINGSIDE — announce tables ===== */
  const deskTex = ctex(512, 128, (c, w, h) => {
    c.fillStyle = '#0b0b12'; c.fillRect(0, 0, w, h);
    c.fillStyle = skirtHex; c.fillRect(0, 0, w, 8); c.fillRect(0, h - 8, w, 8);
    c.fillStyle = '#ffd23f'; c.font = '900 52px Arial'; c.textAlign = 'center';
    c.fillText('★ ' + brand + ' ★', w / 2, 82);
  });
  for (const sx of [-2.7, 2.7]) {
    const desk = new THREE.Group(); desk.position.set(sx, 0, 7.4); desk.rotation.y = Math.PI;
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.09, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.4 }));
    top.position.y = 0.78; top.castShadow = true; desk.add(top);
    const front = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.72),
      new THREE.MeshStandardMaterial({ map: deskTex, roughness: 0.7 }));
    front.position.set(0, 0.4, 0.51); desk.add(front);
    for (const lx of [-1.0, 1.0]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.76, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x111118 }));
      leg.position.set(lx, 0.38, 0); desk.add(leg);
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x06060c, emissive: 0x3aa0ff, emissiveIntensity: 0.7 }));
      mon.position.set(lx * 0.55, 1.0, -0.15); mon.rotation.x = -0.25; desk.add(mon);
    }
    G.add(desk);
  }

  /* ===== ZONE 3: BARRICADE RING (rounded rect, gap at ramp) ===== */
  const barPanelM = new THREE.MeshStandardMaterial({ color: 0x15151f, roughness: 0.6 });
  const barRailM = new THREE.MeshStandardMaterial({ color: 0x8a8f99, metalness: 0.8, roughness: 0.3 });
  const stickerTex = ctex(256, 128, (c, w, h) => {
    c.fillStyle = '#101018'; c.fillRect(0, 0, w, h);
    c.fillStyle = skirtHex; c.fillRect(0, 0, w, 12); c.fillRect(0, h - 12, w, 12);
    c.fillStyle = '#ffd23f'; c.font = '900 72px Arial'; c.textAlign = 'center';
    c.fillText('AE', w / 2, 92);
  });
  let stickerFlip = false;
  function barPanel(x, z, ry, len = 2.1) {
    const grp = new THREE.Group(); grp.position.set(x, 0, z); grp.rotation.y = ry;
    const p = new THREE.Mesh(new THREE.BoxGeometry(len, 1.0, 0.1), barPanelM);
    p.position.y = 0.55; p.castShadow = true; grp.add(p);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.07, 0.16), barRailM);
    rail.position.y = 1.09; grp.add(rail);
    if (stickerFlip = !stickerFlip) {
      const st = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55),
        new THREE.MeshStandardMaterial({ map: stickerTex, roughness: 0.6 }));
      st.position.set(0, 0.58, -0.06); st.rotation.y = Math.PI; grp.add(st);
    }
    G.add(grp);
  }
  const BB = 9.4;
  for (let d = -BB + 1; d <= BB - 1; d += 2.15) {
    barPanel(d, BB, 0);                       // +z side
    if (Math.abs(d) > 2.4) barPanel(d, -BB, 0); // -z side (ramp gap)
    barPanel(BB, d, Math.PI / 2);             // +x side
    barPanel(-BB, d, Math.PI / 2);            // -x side
  }
  for (const [cx, cz, ry] of [[BB, BB, Math.PI / 4], [-BB, BB, -Math.PI / 4], [BB, -BB, -Math.PI / 4], [-BB, -BB, Math.PI / 4]]) {
    barPanel(cx * 0.985, cz * 0.985, ry, 1.7); // rounded corners
  }

  /* ===== ZONE 4: ENTRANCE — stage / titantron / ramp ===== */
  const tc = document.createElement('canvas'); tc.width = 512; tc.height = 288;
  const tctx = tc.getContext('2d');
  const ttex = new THREE.CanvasTexture(tc);
  ttex.colorSpace = THREE.SRGBColorSpace;
  arena.tronCanvas = tc; arena.tronCtx = tctx; arena.tronTex = ttex;
  const stage = new THREE.Group(); G.add(stage);
  const plat = new THREE.Mesh(new THREE.BoxGeometry(13, 1.1, 4.5),
    new THREE.MeshStandardMaterial({ color: 0x14141c, roughness: 0.5 }));
  plat.position.set(0, 0.55, -16.5); plat.receiveShadow = true; stage.add(plat);
  const stageSkirt = new THREE.Mesh(new THREE.PlaneGeometry(13, 1.0),
    new THREE.MeshStandardMaterial({ map: skirtTex, roughness: 0.7 }));
  stageSkirt.position.set(0, 0.55, -14.24); stage.add(stageSkirt);
  // backdrop pillars + beam
  const pillarM = new THREE.MeshStandardMaterial({ color: 0x0c0c14, roughness: 0.4 });
  for (const px of [-6, 6]) {
    const pil = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7.5, 1.4), pillarM);
    pil.position.set(px, 3.75, -18.2); stage.add(pil);
    const side = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 4.2),
      new THREE.MeshBasicMaterial({ map: ttex }));
    side.position.set(px, 4.4, -17.45); stage.add(side);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(13.4, 1.1, 1.2), pillarM);
  beam.position.set(0, 7.6, -18.2); stage.add(beam);
  // main titantron
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 5.4),
    new THREE.MeshBasicMaterial({ map: ttex }));
  screen.position.set(0, 4.5, -18.35); stage.add(screen);
  const glowStrip = new THREE.Mesh(new THREE.BoxGeometry(13.4, 0.14, 0.14),
    new THREE.MeshBasicMaterial({ color: th.glow }));
  glowStrip.position.set(0, 6.95, -17.6); stage.add(glowStrip);
  // truss arch over stage
  const trussM = new THREE.MeshStandardMaterial({ color: 0x2a2a35, metalness: 0.6, roughness: 0.4 });
  for (const px of [-6, 6]) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 7, 8), trussM);
    col.position.set(px, 3.5, -15); stage.add(col);
  }
  const arch = new THREE.Mesh(new THREE.BoxGeometry(12.6, 0.5, 0.5), trussM);
  arch.position.set(0, 7.0, -15); stage.add(arch);
  updateTron('ATTITUDE EMPIRE', ARENAS[themeIdx]?.name || '');
  // ramp down to the ring (through barricade gap)
  const rampLen = 5.6, rampAng = Math.atan2(1.05, 5.2);
  const ramp = new THREE.Group(); ramp.position.set(0, 0.55, -11.6); ramp.rotation.x = rampAng; G.add(ramp);
  const rampTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, rampLen),
    new THREE.MeshStandardMaterial({ color: 0x1c1c26, roughness: 0.7 }));
  rampTop.receiveShadow = true; ramp.add(rampTop);
  for (const ex of [-1.65, 1.65]) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, rampLen),
      new THREE.MeshBasicMaterial({ color: th.glow }));
    edge.position.set(ex, 0.1, 0); ramp.add(edge);
  }
  const rampLogo = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1),
    new THREE.MeshStandardMaterial({ map: stickerTex, roughness: 0.6 }));
  rampLogo.rotation.x = -Math.PI / 2; rampLogo.position.y = 0.08; ramp.add(rampLogo);

  /* ===== ZONE 5: CROWD BANKS — tiered bodies + heads + signs ===== */
  // dark stepped bowl under the crowd
  const bowlM = new THREE.MeshStandardMaterial({ color: 0x0d0d15, roughness: 0.9 });
  for (const [w, x, z, ry, tilt] of [
    [30, 0, 15.6, 0, 1], [30, 0, -15.6, 0, -1], [30, 15.6, 0, 1, 1], [30, -15.6, 0, 1, -1],
  ]) {
    const bowl = new THREE.Mesh(new THREE.PlaneGeometry(30, 9.5), bowlM);
    bowl.position.set(x, 3.6, z);
    if (Math.abs(x) > 1) { bowl.rotation.y = Math.PI / 2; bowl.rotation.x = 0; bowl.rotateOnAxis(new THREE.Vector3(0, 0, 1), tilt * 0.42); }
    else bowl.rotation.x = -Math.PI / 2 + tilt * 0.42;
    G.add(bowl);
  }
  // fan slots around the bowl (gap at -z for ramp/stage)
  const slots = [];
  const ROWS = 7;
  for (let r = 0; r < ROWS; r++) {
    const y = 1.15 + r * 0.88, out = 11.3 + r * 1.28;
    for (let a = -13; a <= 13; a += 1.02) {
      slots.push({ x: a, y, z: out, ry: Math.PI });
      if (Math.abs(a) > 3.4) slots.push({ x: a, y, z: -out, ry: 0 });
      slots.push({ x: out, y, z: a * 0.9, ry: -Math.PI / 2 });
      slots.push({ x: -out, y, z: a * 0.9, ry: Math.PI / 2 });
    }
  }
  const N = ARENAS[themeIdx]?.crowd || 400;
  const stride = Math.max(1, slots.length / N);
  for (let i = 0; i < slots.length; i += stride) {
    const s = slots[Math.round(i)];
    if (s) arena.crowdData.push({ ...s, phase: Math.random() * TAU, sign: Math.random() < 0.12 });
  }
  const n = arena.crowdData.length;
  const bodyGeo = new THREE.BoxGeometry(0.34, 0.52, 0.24); bodyGeo.translate(0, 0.26, 0);
  const headGeo = new THREE.SphereGeometry(0.105, 8, 6); headGeo.translate(0, 0.66, 0);
  const bodies = new THREE.InstancedMesh(bodyGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }), n);
  const heads = new THREE.InstancedMesh(headGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }), n);
  {
    const dummy = new THREE.Object3D(); const col = new THREE.Color();
    const shirts = [0xe63946, 0xffd23f, 0x3aa0ff, 0x37e05c, 0xdddddd, 0x9d4edd, 0xff8c00, 0x22222c];
    const skins = [0xd9a066, 0xc68642, 0xe8b98a, 0x8d5524, 0xf0c8a0];
    for (let i = 0; i < n; i++) {
      const c = arena.crowdData[i];
      dummy.position.set(c.x, c.y, c.z); dummy.rotation.set(0, c.ry, 0);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix); heads.setMatrixAt(i, dummy.matrix);
      bodies.setColorAt(i, col.setHex(pick(shirts)));
      heads.setColorAt(i, col.setHex(pick(skins)));
    }
    bodies.instanceMatrix.needsUpdate = true; heads.instanceMatrix.needsUpdate = true;
    if (bodies.instanceColor) bodies.instanceColor.needsUpdate = true;
    if (heads.instanceColor) heads.instanceColor.needsUpdate = true;
  }
  G.add(bodies, heads); arena.crowd = bodies; arena.crowdHeads = heads;
  // signs (static instanced placards)
  const signIdx = arena.crowdData.map((c, i) => c.sign ? i : -1).filter((i) => i >= 0);
  if (signIdx.length) {
    const signGeo = new THREE.PlaneGeometry(0.6, 0.42);
    const signM = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const signs = new THREE.InstancedMesh(signGeo, signM, signIdx.length);
    const dummy = new THREE.Object3D(); const col = new THREE.Color();
    const inks = [0xffd23f, 0xe63946, 0xffffff, 0x3aa0ff, 0x37e05c];
    signIdx.forEach((ci, k) => {
      const c = arena.crowdData[ci];
      dummy.position.set(c.x, c.y + 1.25, c.z);
      dummy.rotation.set(-0.15, c.ry, 0); dummy.updateMatrix();
      signs.setMatrixAt(k, dummy.matrix);
      signs.setColorAt(k, col.setHex(pick(inks)));
    });
    signs.instanceMatrix.needsUpdate = true;
    if (signs.instanceColor) signs.instanceColor.needsUpdate = true;
    G.add(signs);
  }

  /* ===== ZONE 6: LIGHTING RIG — towers + beams + spots ===== */
  const towerM = new THREE.MeshStandardMaterial({ color: 0x23232e, metalness: 0.6, roughness: 0.45 });
  for (const [tx, tz] of [[-13, -13], [13, -13], [-13, 13], [13, 13]]) {
    const tw = new THREE.Mesh(new THREE.BoxGeometry(0.6, 13.5, 0.6), towerM);
    tw.position.set(tx, 6.75, tz); G.add(tw);
  }
  for (const [w, x, z] of [[27, 0, -13], [27, 0, 13], [27, -13, 0], [27, 13, 0]]) {
    const bm = new THREE.Mesh(new THREE.BoxGeometry(w === 27 && z !== 0 ? 27 : 0.5, 0.5, w === 27 && z !== 0 ? 0.5 : 27), towerM);
    bm.position.set(x, 13.5, z); G.add(bm);
  }
  const coneM = new THREE.MeshBasicMaterial({ color: 0xfff2c9, transparent: true, opacity: 0.10, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const lampM = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let i = 0; i < 8; i++) {
    const lx = -10.5 + (i % 4) * 7, lz = i < 4 ? -13 : 13;
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), lampM);
    lamp.position.set(lx, 13.2, lz); G.add(lamp);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(3.0, 12, 12, 1, true), coneM);
    cone.position.set(lx * 0.6, 7.2, lz * 0.6); G.add(cone);
  }
}

function updateTron(main, sub) {
  const c = arena.tronCtx; if (!c) return;
  const g = c.createLinearGradient(0, 0, 0, 288);
  g.addColorStop(0, '#1a0a2a'); g.addColorStop(1, '#050510');
  c.fillStyle = g; c.fillRect(0, 0, 512, 288);
  c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.strokeRect(8, 8, 496, 272);
  c.fillStyle = '#ffd23f'; c.font = '900 52px Arial'; c.textAlign = 'center';
  c.fillText(main.slice(0, 16), 256, 130);
  c.fillStyle = '#fff'; c.font = '700 30px Arial';
  c.fillText((sub || '').slice(0, 24), 256, 185);
  c.fillStyle = '#e63946'; c.font = '700 22px Arial';
  c.fillText('★ LIVE ★', 256, 235);
  arena.tronTex.needsUpdate = true;
}

// ---------- weapons ----------
const weapons = [];
function makeChair() {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: 0x8888a0, metalness: 0.7, roughness: 0.35 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), m);
  seat.position.y = 0.5; seat.castShadow = true; g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.06), m);
  back.position.set(0, 0.8, -0.24); g.add(back);
  for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), m);
    l.position.set(x, 0.25, z); g.add(l);
  }
  return g;
}
function spawnWeapons() {
  for (const w of weapons) scene.remove(w.mesh);
  weapons.length = 0;
  const spots = [[-5.5, 2.5, 'chair'], [5.5, -2.0, 'chair'], [-6.2, -4.5, 'table']];
  for (const [x, z, kind] of spots) {
    let mesh;
    if (kind === 'chair') mesh = makeChair();
    else {
      mesh = new THREE.Group();
      const wm = new THREE.MeshStandardMaterial({ color: 0x7a4a22, roughness: 0.8 });
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.09, 1.0), wm);
      top.position.y = 0.75; top.castShadow = true; top.name = 'tabletop'; mesh.add(top);
      for (const [lx, lz] of [[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]]) {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.75, 0.09), wm);
        l.position.set(lx, 0.37, lz); mesh.add(l);
      }
      mesh.userData.isTable = true;
    }
    mesh.position.set(x, groundHeight(x, z), z);
    mesh.rotation.y = rand(0, TAU);
    scene.add(mesh);
    weapons.push({ kind, mesh, state: 'ground', holder: null, vel: new THREE.Vector3(), spin: 0, broken: false, cool: 0 });
  }
}

// ---------- particles ----------
const sparks = [];
{
  const sg = new THREE.PlaneGeometry(0.22, 0.22);
  for (let i = 0; i < 90; i++) {
    const m = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    m.visible = false; scene.add(m);
    sparks.push({ m, vel: new THREE.Vector3(), life: 0 });
  }
}
function burst(p, color = 0xffe066, n = 10, spd = 5) {
  let c = 0;
  for (const s of sparks) {
    if (s.life > 0) continue;
    s.life = rand(0.3, 0.6); s.m.visible = true;
    s.m.material.color.setHex(color);
    s.m.material.opacity = 1;
    s.m.position.copy(p);
    s.vel.set(rand(-1, 1) * spd, rand(0.5, 1.5) * spd, rand(-1, 1) * spd);
    if (++c >= n) break;
  }
}
function updateSparks(dt) {
  for (const s of sparks) {
    if (s.life <= 0) continue;
    s.life -= dt;
    s.vel.y -= 14 * dt;
    s.m.position.addScaledVector(s.vel, dt);
    s.m.material.opacity = Math.max(0, s.life * 2);
    s.m.lookAt(camera.position);
    if (s.life <= 0) s.m.visible = false;
  }
}

// ---------- entities (full-body spine-chained rigs, see rig.js) ----------
let fighters = [];
let ref = null;
function makeRef() {
  const rp = buildWrestlerMesh({
    skin: 0xd9a066, hair: 0x181008, attire: 0x111111, trim: 0xffffff, boots: 0x0a0a0a,
    height: 1.0, bulk: 0.92, legs: 'tights', torso: 'shirt', bootsH: 'short',
    kneePads: false, wrist: false, hairStyle: 'short',
  });
  rp.group.position.set(2, RING_TOP, 2); scene.add(rp.group);
  return { mesh: rp.group, parts: rp, x: 2, z: 2 };
}

function spawnFighter(def, x, z, isPlayer) {
  const parts = buildWrestlerMesh(def);
  parts.group.rotation.order = 'YXZ'; // yaw first, so dive flips pitch forward
  scene.add(parts.group);
  
  // Initialize AKI physics components
  const spiritMeter = new SpiritMeter(def.align === 'FACE' ? 15 : 10);
  const wakeupTimer = new WakeupTimer();
  const animController = new AnimationController(null); // placeholder
  
  const f = {
    def, parts, isPlayer: !!isPlayer,
    pos: new THREE.Vector3(x, groundHeight(x, z), z),
    vel: new THREE.Vector3(), vy: 0, facing: rand(0, TAU),
    hp: TUNING.hp + (def.tgh || 5) * 6, maxhp: TUNING.hp + (def.tgh || 5) * 6,
    st: TUNING.stamina, 
    // AKI physics
    spirit: def.spirit || 50,
    maxSpirit: 100,
    limbCondition: AKI_PHYSICS.BASE_LIMB_CONDITION,
    attack: def.attack || 50,
    defense: def.defense || 50,
    speed: def.spd || 50,
    // Legacy attitude (for UI)
    att: def.align === 'FACE' ? 15 : 10,
    // AKI systems
    spiritMeter,
    wakeupTimer,
    animController,
    // State
    state: 'idle', stateT: 0, anim: '', animT: 0, cool: 0,
    walkPhase: rand(0, 9), downT: 0, stun: 0, weapon: null,
    whipped: null, submitT: 0, aiT: rand(0, 0.4), aiMove: null,
    topCorner: null, diveT: 0, pinCool: 0, hitFlash: 0,
    // Grapple
    grappleAdvantage: null,
    grappleDisadvantage: false,
    // Spec systems: mass/momentum, fatigue, bump card, limbs, rope timing
    fatigue: 0,
    bump: 0,
    limb: { head: 0, torso: 0, arm: 0, leg: 0 },
    ropeBoost: 0,
    ropeEnergy: 0,
    cornerT: 0,
    avalancheT: 0,
    // Match
    stats: { dealt: 0, kos: 0, pins: 0 },
    eliminated: false,
  };
  parts.group.position.copy(f.pos);
  fighters.push(f);
  return f;
}
function clearFighters() {
  for (const f of fighters) scene.remove(f.parts.group);
  fighters = [];
}

// ---------- match state ----------
const match = {
  phase: 'menu', // menu | fight | over
  mode: '1v1', arenaIdx: 0, playerIdx: 0,
  time: 0, timeLimit: 600, heat: 0.45, slowmo: 0,
  pin: null, winner: null, countOut: {}, id: 0,
  story: { phase: 'feeling', heat: 0, hope: 0, nearFalls: 0, lastBigT: -99, spam: 0, lastMove: '' },
};
let camYaw = 0.6, camPitch = 0.42, camDist = 9.5, camWide = false;
const camTarget = new THREE.Vector3(0, 1.5, 0);

// ---------- UI helpers ----------
let toastT = null;
function toast(msg, ms = 2200) {
  const t = $('toast'); t.textContent = msg; t.style.opacity = 1;
  clearTimeout(toastT); toastT = setTimeout(() => t.style.opacity = 0, ms);
}
function announce(big, sub = '') {
  $('annBig').textContent = big; $('annSub').textContent = sub;
  const a = $('announce'); a.classList.remove('show'); void a.offsetWidth; a.classList.add('show');
  updateTron(big.slice(0, 16), sub.slice(0, 24));
}

// ---------- combat ----------
// Narrative Director: background story state from hp gaps, heat, and time.
// feeling_out -> heat (someone dominating) -> hope (trailer rallies) -> finish.
function updateStoryPhase() {
  const alive = fighters.filter((f) => !f.eliminated);
  if (alive.length < 2) { match.story.phase = 'finish'; return; }
  const hps = alive.map((f) => f.hp / f.maxhp);
  const gap = Math.max(...hps) - Math.min(...hps);
  const low = Math.min(...hps);
  const s = match.story;
  if (low < 0.25 || match.time > 300) s.phase = 'finish';
  else if (s.hope > 0.5 || (gap > 0.25 && match.heat > 0.6)) s.phase = 'hope';
  else if (gap > 0.3 || match.heat > 0.7) s.phase = 'heat';
  else s.phase = 'feeling';
  s.hope = Math.max(0, s.hope - 0.005);
}
function foeDir(att, vic) {
  return Math.atan2(vic.pos.x - att.pos.x, vic.pos.z - att.pos.z);
}
function dist2(a, b) { const dx = a.pos.x - b.pos.x, dz = a.pos.z - b.pos.z; return Math.hypot(dx, dz); }
function inFront(att, vic, arc = 1.1) {
  const want = foeDir(att, vic);
  let d = Math.abs(((want - att.facing + Math.PI * 3) % TAU) - Math.PI);
  return d < arc;
}
function isDown(f) { return f.state === 'down' || f.state === 'pinned' || f.state === 'submitvictim'; }

function gainAtt(f, n) { f.att = clamp(f.att + n, 0, 100); }
function hurtAtt(f, n) { f.att = clamp(f.att - n, 0, 100); }

function applyDamage(vic, dmg, attacker, opts = {}) {
  if (match.phase !== 'fight' || vic.eliminated) return;
  if (!isFinite(dmg)) dmg = 5; // never let bad data poison HP/physics
  if (!isFinite(vic.hp)) vic.hp = vic.maxhp / 2;
  
  // Use AKI damage formula if attacker exists
  let final, isSpecial = false;
  if (attacker && opts.big) {
    // Check if this is a special/finisher move
    isSpecial = opts.finish || opts.big === true;
    const move = { baseDamage: dmg, flags: opts.flags || 0 };
    const dmgResult = calculateAKIDamage(attacker, vic, move, isSpecial);
    final = dmgResult.damage;
    // Apply max health damage
    if (dmgResult.maxHealthDamage > 0) {
      vic.maxhp = Math.max(1, vic.maxhp - dmgResult.maxHealthDamage);
      vic.hp = Math.min(vic.hp, vic.maxhp);
    }
  } else {
    // Legacy fallback
    const scale = attacker ? (0.85 + (attacker.def.str || 5) * 0.05) : 1;
    final = Math.round(dmg * scale * rand(0.9, 1.1));
  }
  
  vic.hp = Math.max(0, vic.hp - final);
  vic.hitFlash = 0.25;

  // AKI Spirit system
  if (attacker && attacker !== vic) {
    // Attacker gains spirit
    const spiritGain = opts.big ? AKI_PHYSICS.SPIRIT.STRONG_GRAPPLE_LAND : AKI_PHYSICS.SPIRIT.WEAK_STRIKE_LAND;
    if (attacker.spiritMeter) {
      attacker.spiritMeter.add(spiritGain);
    }
    attacker.spirit = Math.min(100, (attacker.spirit || 0) + spiritGain);
    
    // Defender loses spirit
    const spiritLoss = opts.big ? AKI_PHYSICS.SPIRIT.TAKE_BIG_DAMAGE : AKI_PHYSICS.SPIRIT.TAKE_DAMAGE;
    if (vic.spiritMeter) {
      vic.spiritMeter.subtract(spiritLoss);
    }
    vic.spirit = Math.max(0, (vic.spirit || 0) - spiritLoss);
    
    attacker.stats.dealt += final;
    match.heat = clamp(match.heat + (opts.big ? 0.09 : 0.035), 0, 1);
    // crowd-driven momentum: hot crowds amplify attitude gains
    gainAtt(attacker, (opts.big ? 6 : 2) * (0.7 + match.heat * 0.8));
    // hope spot: trailing fighter lands big -> story hope rises
    if (opts.big && vic.hp > (attacker.hp || 0)) {
      match.story.hope = clamp(match.story.hope + 0.2, 0, 1);
    }
    updateStoryPhase();
  }
  
  // knockback: mass-weighted momentum transfer (heavy bodies move less,
  // heavy attackers hit harder). Cooperative cap keeps juggles recoverable.
  if (opts.kb && opts.from) {
    const dx = vic.pos.x - opts.from.x, dz = vic.pos.z - opts.from.z;
    const d = Math.hypot(dx, dz) || 1;
    const mr = attacker ? clamp(fighterMass(attacker) / fighterMass(vic), 0.6, 1.6) : 1;
    const tune = arenaTune();
    const kb = opts.kb * mr;
    vic.vel.x += (dx / d) * kb; vic.vel.z += (dz / d) * kb;
    if (opts.launch) {
      let lv = opts.launch * (0.8 + 0.2 * mr) * (0.85 + 0.15 * tune.stiff);
      if (vic.pos.y > groundHeight(vic.pos.x, vic.pos.z) + 0.3) lv *= 0.5; // receiver keeps landing control mid-air
      vic.vy = Math.max(vic.vy, Math.min(lv, 11));
    }
  }
  burst(new THREE.Vector3(vic.pos.x, vic.pos.y + 1.5, vic.pos.z),
    opts.big ? 0xff5030 : 0xffe066, opts.big ? 16 : 8, opts.big ? 7 : 4);
  audio.hit(opts.sfx || 'hit');
  if (opts.big) { audio.pop(1); shake(0.35); rumble(0.8, 0.4, 150); }
  else rumble(0.25, 0.12, 60);
  
  // knockdown? mat tune stretches big bumps over time (loud, not instant)
  const tune2 = arenaTune();
  const bigBump = !!opts.down || vic.hp <= 0 || final >= 13;
  if (bigBump) knockDown(vic, (opts.downTime || (1.6 + final * 0.09)) * (0.9 + 0.2 * tune2.stiff));
  else { vic.stun = Math.max(vic.stun, 0.35); }
  // fatigue + hidden bump card (injury risk accrues on hard impacts)
  vic.fatigue = clamp((vic.fatigue || 0) + (opts.big ? 0.07 : 0.02) + Math.max(0, final - 10) * 0.004, 0, 1);
  vic.bump = clamp((vic.bump || 0) + (bigBump ? 0.08 + final * 0.004 : final * 0.001), 0, 1);
  // story director: heat/hope, spam tracking (crowd punishes high-risk spam)
  const st = match.story;
  if (attacker && attacker !== vic) {
    const same = st.lastMove === (opts.moveName || '');
    st.spam = same ? st.spam + 1 : 0;
    st.lastMove = opts.moveName || '';
    st.heat = clamp(st.heat + (opts.big ? 0.12 : 0.04) - Math.min(0.1, st.spam * 0.02), 0, 1);
    if (bigBump) { st.lastBigT = match.time; }
  }

  if (vic.hp <= 0 && match.mode !== 'elim') {
    if (!opts.finish) { vic.hp = 1; knockDown(vic, 3.2); }
    else knockDown(vic, 4.5);
  }
  refreshCards();
}
function knockDown(f, t) {
  if (f.state === 'top') return;
  f.state = 'down'; f.downT = Math.max(f.downT, t); f.stateT = 0; f.anim = 'down';
  f._downRot = -1.5; // lying on the back
  f.vy = Math.max(f.vy, 2.2);
  matHit(0.45); // mat spring absorbs the bump (visual + feel)
  // Initialize AKI wakeup timer
  if (f.wakeupTimer) {
    f.wakeupTimer.set(Math.max(f.wakeupTimer.timer, t * 30)); // convert seconds to frames
  }
  if (f.weapon) dropWeapon(f);
}
function getup(f) {
  f.state = 'getup'; f.stateT = 0.7; f.anim = 'getup'; f.downT = 0;
  if (f.wakeupTimer) f.wakeupTimer.set(0);
}

// strike
function doStrike(att) {
  if (att.cool > 0 || att.st < 8) return;
  const running = att.state === 'run' || Math.hypot(att.vel.x, att.vel.z) > 4.2;
  let mv;
  if (running) mv = pick(MOVES.strikes.filter((m) => m.run));
  else {
    // weapon swing?
    if (att.weapon) {
      weaponSwing(att); return;
    }
    mv = pick(MOVES.strikes.filter((m) => !m.run));
  }
  att.cool = 0.55; att.st -= 7;
  att.state = 'attack'; att.stateT = 0.42; att.anim = mv.anim; att.animT = 0.42;
  playClip(att, strikeClipFor(mv.anim));
  att.facing = faceNearest(att) ?? att.facing;
  audio.blip(200, 0.08, 'sawtooth', 0.05);
  // reversal window for the target (HCTP timing reversal)
  const tgt = preferredFoe(att, 2.4);
  if (tgt) openWindow(tgt, 'strike', att);
  const gen = att.rev = (att.rev || 0) + 1;
  // resolve slightly delayed for feel
  setTimeout(() => {
    if ((att.rev || 0) !== gen) return; // reversed — dead move
    if (match.phase !== 'fight') return;
    let hitAny = false;
    for (const v of fighters) {
      if (v === att || v.eliminated || isDown(v)) continue;
      if (dist2(att, v) < 2.0 && inFront(att, v)) {
        if (!v.isPlayer && aiTryReverse(v, att, 'strike')) continue;
        const isRunning = running && (mv.name === 'CLOTHESLINE' || mv.name === 'DROPKICK');
        applyDamage(v, (mv.baseDamage ?? mv.dmg ?? 0) + (running ? 3 : 0), att, {
          kb: isRunning ? mv.kb * 1.6 : mv.kb,
          from: att.pos,
          sfx: mv.sfx,
          down: isRunning || (running && Math.random() < 0.5),
          launch: isRunning ? 5 : (running ? 3 : 1),
          downTime: isRunning ? 3.0 : 2.0,
          moveName: mv.name
        });
        playClip(v, (isRunning || mv.name === 'SUPERKICK') ? 'sold_big' : 'sold_strike');
        hitAny = true;
        if (isRunning) {
          shake(0.7);
          audio.pop(1.3);
          burst(new THREE.Vector3(v.pos.x, v.pos.y + 1.2, v.pos.z), 0xff6600, 18, 8);
        }
        if (match.pin && match.pin.att === v) breakPin('BROKEN UP!');
      }
    }
    if (hitAny) { showMove(att, mv.name); }
  }, 140);
}
// Target preference: focus-locked foe (RB/R1 change focus) wins over nearest
function faceNearest(att) {
  if (att.foeLock && !att.foeLock.eliminated && dist2(att, att.foeLock) < 9) {
    return foeDir(att, att.foeLock);
  }
  let best = null, bd = 99;
  for (const v of fighters) {
    if (v === att || v.eliminated) continue;
    const d = dist2(att, v); if (d < bd) { bd = d; best = v; }
  }
  return best ? foeDir(att, best) : null;
}
function preferredFoe(att, maxD) {
  if (att.foeLock && !att.foeLock.eliminated && !isDown(att.foeLock) && dist2(att, att.foeLock) < maxD) {
    return att.foeLock;
  }
  let best = null, bd = maxD;
  for (const v of fighters) {
    if (v === att || v.eliminated || isDown(v)) continue;
    const d = dist2(att, v);
    if (d < bd) { bd = d; best = v; }
  }
  return best;
}
function cycleFocus(p) {
  const foes = fighters.filter((v) => v !== p && !v.eliminated);
  if (!foes.length) return;
  const i = foes.indexOf(p.foeLock);
  p.foeLock = foes[(i + 1) % foes.length];
  toast(`Target: ${p.foeLock.def.name}`);
  audio.blip(600, 0.08, 'square', 0.08);
}
// ---------- HCTP reversal system ----------
// LT reverses strikes, RT reverses grapples, LT+RT reverses finishers.
function openWindow(vic, type, att) {
  if (!vic || vic.eliminated) return;
  vic.incoming = { type, att, until: performance.now() + (type === 'strike' ? 420 : 650) };
}
function doReversal(reverser, attacker, kind) {
  attacker.rev = (attacker.rev || 0) + 1; // cancel pending damage timeouts
  attacker.state = 'idle'; attacker.cool = 1.0; attacker.clip = null;
  attacker.stun = Math.max(attacker.stun, 0.4);
  if (attacker.incoming) attacker.incoming = null;
  reverser.clip = null;
  applyDamage(attacker, 7, reverser, { kb: 3.5, from: reverser.pos, sfx: 'hit', down: Math.random() < 0.3, downTime: 1.5, moveName: 'REVERSAL' });
  gainAtt(reverser, 12);
  match.heat = clamp(match.heat + 0.06, 0, 1);
  announce('REVERSAL!', `${reverser.def.name} turns it around!`);
  audio.pop(1.2); shake(0.4); rumble(0.5, 0.3, 150);
  toast(`${reverser.def.name} — REVERSAL!`);
}
function tryRev(p, kind) {
  if (!p || p.eliminated || match.phase !== 'fight') return false;
  if (['down', 'pinned', 'submit', 'submitvictim', 'pin', 'top', 'dive'].includes(p.state)) return false;
  const inc = p.incoming;
  if (!inc || performance.now() > inc.until) return false;
  if (!inc.att || inc.att.eliminated || dist2(p, inc.att) > 2.8) { p.incoming = null; return false; }
  if (inc.type !== kind) return false;
  p.incoming = null;
  doReversal(p, inc.att, kind);
  return true;
}
function tryRevSmart(p) {
  // touch REV button: match finisher > grapple > strike windows
  const inc = p.incoming;
  if (!inc || performance.now() > inc.until) return false;
  return tryRev(p, inc.type);
}
function aiRevChance(vic, att, kind) {
  let c = kind === 'finisher' ? 0.07 : kind === 'grapple' ? 0.12 : 0.10;
  c += ((vic.att || 0) - (att.att || 0)) / 500;
  c += ((vic.def.tgh || 5) - 5) * 0.015;
  if (kind === 'finisher') c *= 0.7;
  return clamp(c, 0.02, 0.4);
}
function aiTryReverse(vic, att, kind) {
  if (vic.isPlayer || vic.eliminated) return false;
  if (['down', 'pinned', 'submit', 'submitvictim', 'pin', 'top', 'dive', 'celebrate'].includes(vic.state)) return false;
  if (Math.random() < aiRevChance(vic, att, kind)) {
    doReversal(vic, att, kind);
    return true;
  }
  return false;
}
function showMove(att, name) {
  toast(`${att.def.name} — ${name}!`);
}

// HCTP grapple categories from stick direction:
// up = POWER, down = SUBMISSION (pin if foe is down), left = SIGNATURE,
// right = QUICK, centered = IRISH WHIP. 'auto' = legacy random (AI).
const GRAPPLE_POOLS = {
  power: ['POWER BOMB', 'SPINE BUSTER', 'BODYSLAM', 'VERTICAL SUPLEX', 'BACK BREAKER'],
  quick: ['DDT', 'NECK BREAKER', 'HURRICANRANA'],
  wear: ['BACK BREAKER', 'NECK BREAKER', 'SAMOAN DROP'],
};
function byName(list, name) { return list.find((m) => m.name === name); }
function doGrapple(att, cat) {
  if (att.cool > 0 || att.st < 10) return;
  // HCTP: no direction on the grapple button = Irish whip (not a random move)
  if (!cat) { doWhip(att); return; }
  cat = cat || 'auto';
  // HCTP: grapple + DOWN on a downed foe = pin attempt
  const downFoe = fighters.find((v) => v !== att && !v.eliminated && isDown(v) && dist2(att, v) < 2.0);
  if (downFoe) {
    if (cat === 'sub') { tryPin(att); return; }
    att.facing = foeDir(att, downFoe);
    // 30% submission when groggy
    if (downFoe.hp < downFoe.maxhp * 0.55 && Math.random() < 0.35) { startSubmit(att, downFoe); return; }
    const mv = pick(MOVES.ground);
    att.cool = 0.8; att.st -= 8;
    att.state = 'attack'; att.stateT = 0.6; att.anim = mv.anim; att.animT = 0.6;
    playClip(att, mv.anim === 'splash' ? 'strike_dropkick' : 'slam_slam');
    const gen = att.rev = (att.rev || 0) + 1;
    setTimeout(() => {
      if ((att.rev || 0) !== gen) return;
      if (downFoe.eliminated || match.phase !== 'fight') return;
      if (dist2(att, downFoe) < 2.2) {
        if (!downFoe.isPlayer && aiTryReverse(downFoe, att, 'grapple')) return;
        applyDamage(downFoe, (mv.baseDamage ?? mv.dmg ?? 0), att, { kb: 1.5, from: att.pos, down: true, downTime: 2.2 });
        showMove(att, mv.name);
      }
    }, 220);
    return;
  }
// standing tie-up: snap to the nearest foe in range, face them, pull in.
let foe = att.foeLock && !att.foeLock.eliminated && !isDown(att.foeLock) && dist2(att, att.foeLock) < 2.1
  ? att.foeLock : null;
if (!foe) {
  let bd = 2.1;
  for (const v of fighters) {
    if (v === att || v.eliminated || isDown(v)) continue;
    const d = dist2(att, v);
    if (d < bd) { bd = d; foe = v; }
  }
}
if (!foe) { // whiff (nobody near)
  att.state = 'attack'; att.stateT = 0.3; att.anim = 'punch'; att.cool = 0.35; return;
}


att.facing = foeDir(att, foe);
const behind = !inFront(foe, att, 1.2);
let mv = null, dmgMult = 1, slamDur = 0.9, stateDur = 1.25;
if (behind) {
  const bp = MOVES.back.filter((m) => ['GERMAN SUPLEX', 'BACK SUPLEX', 'SLEEPER DROP'].includes(m.name));
  mv = pick(bp.length ? bp : MOVES.back);
} else if (cat === 'power') {
  mv = pick(MOVES.front.filter((m) => GRAPPLE_POOLS.power.includes(m.name)));
  dmgMult = 1.15; slamDur = 1.0;
} else if (cat === 'quick') {
  mv = pick(MOVES.front.filter((m) => GRAPPLE_POOLS.quick.includes(m.name)));
  dmgMult = 0.9; slamDur = 0.7; stateDur = 1.0;
} else if (cat === 'sub') {
  mv = pick(MOVES.front.filter((m) => GRAPPLE_POOLS.wear.includes(m.name)));
  foe.st = Math.max(0, foe.st - 15); // wear-down
} else if (cat === 'sig') {
  const fin = MOVES.finishers[att.def.finisher2];
  if (att.att >= 25 && fin && !fin.drain) {
    mv = { ...fin, name: att.def.finisher2 + ' (SIG)' };
    dmgMult = 0.55;
  } else {
    mv = pick(MOVES.front.filter((m) => GRAPPLE_POOLS.quick.includes(m.name)));
    dmgMult = 0.9; slamDur = 0.7; stateDur = 1.0;
  }
} else {
  mv = pick(MOVES.front);
}
if (cat === 'sig' && MOVES.finishers[att.def.finisher2] && MOVES.finishers[att.def.finisher2].drain) {
  startSubmit(att, foe); return; // signature submission
}
att.cool = 1.1; att.st -= 12;
att.state = 'grapple'; att.stateT = stateDur; att.anim = 'lockup'; att.animT = stateDur;
foe.state = 'victim'; foe.stateT = stateDur; foe.anim = 'lockup';
foe.animT = stateDur; foe._victimAnim = mv.anim;
// collar-and-elbow tie-up: pull chest-to-chest
foe.pos.x = att.pos.x + Math.sin(att.facing) * 0.8;
foe.pos.z = att.pos.z + Math.cos(att.facing) * 0.8;
foe.vel.multiplyScalar(0.2);
foe.facing = att.facing + Math.PI;
openWindow(foe, 'grapple', att);
const gen = att.rev = (att.rev || 0) + 1;
setTimeout(() => {
  if ((att.rev || 0) !== gen) return; // reversed — dead move
  if (match.phase !== 'fight' || foe.eliminated) return;
  if (!foe.isPlayer && aiTryReverse(foe, att, 'grapple')) return;
  const isRana = mv.anim === 'hurricanrana';
  const isSpine = mv.anim === 'spinebuster';
  const isPower = isSpine || mv.anim === 'powerbomb' || mv.anim === 'piledriver';
  playClip(att, slamClipFor(mv.anim));
  playClip(foe, soldClipFor(mv.anim));
  // SLAM IMPACT: freeze frame, heavy knockback, screen shake
  if (isPower) {
    match.slowmo = 0.12; // 120ms impact freeze
    shake(1.2);
    audio.pop(1.8);
    burst(new THREE.Vector3(foe.pos.x, foe.pos.y + 1.2, foe.pos.z), 0xff6600, 28, 12);
  } else {
    shake(0.6);
    audio.pop(1.2);
  }
  // Much stronger horizontal + vertical knockback
  const hb = isPower ? 8.5 : 5.5;
  const vb = isPower ? 7.5 : 5.0;
  applyDamage(foe, Math.round((mv.baseDamage ?? mv.dmg ?? 0) * dmgMult), att, { kb: hb, from: att.pos, sfx: isPower ? 'hit' : 'hit', down: true, big: true, launch: vb, downTime: isRana ? 4.0 : (isPower ? 4.2 : 3.0), moveName: mv.name });
  showMove(att, mv.name + (isRana ? ' — HOOKS THE CRADLE, pin! (F)' : isSpine ? ' — COVER THEM! (F)' : isPower ? ' — DEVASTATING!' : ''));
  att.state = 'idle'; att.stateT = 0;
}, 700);
}
function startSubmit(att, vic) {
  const mv = pick(MOVES.submit);
  att.state = 'submit'; att.submitT = 3.2; att.anim = 'submit';
  vic.state = 'submitvictim'; vic.submitT = 3.2; vic.anim = 'down';
  vic._downRot = 1.35; // prone
  att.facing = foeDir(att, vic);
  showMove(att, mv.name + '!');
  announce('SUBMISSION!', mv.name + ' — watch the ropes!');
  audio.pop(0.7);
  // Wiki-authentic: a hold applied near the ropes invites a rope break — the
  // victim crawls, grabs rope, and the ref forces the release.
  const nearRopes = inRing(vic.pos.x, vic.pos.z) && (Math.abs(vic.pos.x) > 2.3 || Math.abs(vic.pos.z) > 2.3);
  if (nearRopes && Math.random() < 0.5) {
    setTimeout(() => {
      if (match.phase !== 'fight' || att.state !== 'submit' || vic.state !== 'submitvictim') return;
      endSubmit(att, vic, true);
      announce('ROPE BREAK!', `${vic.def.name} grabs the ropes!`);
      audio.pop(0.8);
    }, 1300);
  }
  att._subDrain = setInterval(() => {
    if (match.phase !== 'fight' || att.state !== 'submit' || vic.eliminated) { clearInterval(att._subDrain); return; }
    vic.hp = Math.max(1, vic.hp - 3);
    match.heat = clamp(match.heat + 0.03, 0, 1);
    burst(new THREE.Vector3(vic.pos.x, vic.pos.y + 0.8, vic.pos.z), 0x9d4edd, 4, 3);
    audio.blip(300, 0.1, 'sawtooth', 0.06);
    refreshCards();
    // escape?
    const esc = vic.isPlayer ? (keys[' '] ? 0.35 : 0.06) : (0.05 + vic.def.tgh * 0.012);
    if (Math.random() < esc || vic.hp <= 1 && Math.random() < 0.2) endSubmit(att, vic, true);
  }, 400);
  setTimeout(() => endSubmit(att, vic, false), 3400);
}
function endSubmit(att, vic, escaped) {
  if (att._subDrain) { clearInterval(att._subDrain); att._subDrain = null; }
  if (att.state === 'submit') { att.state = 'idle'; att.cool = 0.8; }
  if (vic.state === 'submitvictim') {
    if (escaped) { vic.state = 'idle'; toast(`${vic.def.name} ESCAPES!`); }
    else { applyDamage(vic, 6, att, { down: true, downTime: 2.5 }); }
  }
}
// irish whip
function doWhip(att) {
  if (att.cool > 0) return;
  const foe = fighters.find((v) => v !== att && !v.eliminated && !isDown(v) && dist2(att, v) < 2.0);
  if (att.weapon && (!foe || Math.random() < 0.5)) { throwWeapon(att); return; }
  if (!foe) return;
  att.cool = 0.9; att.st -= 6;
  att.state = 'attack'; att.stateT = 0.4; att.anim = 'chop';
  const dir = { x: att.pos.x - foe.pos.x, z: att.pos.z - foe.pos.z };
  // throw foe AWAY from attacker toward nearest ropes
  const d = Math.hypot(dir.x, dir.z) || 1;
  const tx = -dir.x / d, tz = -dir.z / d;
  setTimeout(() => {
    if (match.phase !== 'fight' || foe.eliminated) return;
    foe.whipped = { x: tx * 7, z: tz * 7, t: 1.6 };
    foe.state = 'whipped'; foe.stun = 1.6; foe.anim = 'run';
    gainAtt(att, 4);
    toast(`${att.def.name} — IRISH WHIP!`);
    audio.blip(150, 0.15, 'sawtooth', 0.08);
  }, 150);
}
// finisher (HCTP SmackDown! move: LB, LB + direction = second finisher)
function doFinisher(att, second) {
  if (att.att < TUNING.finisherThreshold || att.cool > 0) {
    if (att.isPlayer) toast(att.att >= 100 ? 'No target in range!' : 'ATTITUDE not full — fight + taunt to fill it!');
    return;
  }
  const finName = second ? att.def.finisher2 : att.def.finisher;
  const fin = MOVES.finishers[finName] || MOVES.finishers[att.def.finisher] || { dmg: 28, anim: 'powerbomb' };
  // dive finishers need top? allow anywhere
  const foe = (att.foeLock && !att.foeLock.eliminated && dist2(att, att.foeLock) < (fin.anim === 'splash' ? 3.4 : 2.4))
    ? att.foeLock
    : fighters.find((v) => v !== att && !v.eliminated && dist2(att, v) < (fin.anim === 'splash' ? 3.4 : 2.4));
  if (!foe && !isDiveFin(fin)) { if (att.isPlayer) toast('Get closer to hit the FINISHER!'); return; }
  if (fin.drain && foe) { startSubmit(att, foe); att.att = 0; return; }
  att.att = 0; att.cool = 1.4; att.st = Math.max(0, att.st - 15);
  att.finisherT = match.time; // protected-finish window for kickout logic
  match.slowmo = 1.4; shake(0.6);
  announce('★ FINISHER! ★', `${att.def.name} — ${finName}`);
  audio.pop(1.5); audio.bell();
  att.state = 'attack'; att.stateT = 1.2; att.anim = fin.anim; att.animT = 1.2;
  playClip(att, slamClipFor(fin.anim));
  if (foe) { foe.state = 'victim'; foe.stateT = 1.0; foe.anim = 'lockup'; foe.animT = 1.0; foe._victimAnim = fin.anim; openWindow(foe, 'finisher', att); }
  camWide = false;
  const gen = att.rev = (att.rev || 0) + 1;
  setTimeout(() => {
    if ((att.rev || 0) !== gen) return; // reversed — dead move
    if (match.phase !== 'fight') return;
    if (foe && !foe.eliminated) {
      if (!foe.isPlayer && aiTryReverse(foe, att, 'finisher')) return;
      // FINISHER IMPACT: massive freeze, huge knockback
      match.slowmo = 0.08;
      shake(2.0);
      rumble(1, 0.7, 400);
      audio.pop(2.5);
      audio.bell();
      burst(new THREE.Vector3(foe.pos.x, foe.pos.y + 1.5, foe.pos.z), 0xffd23f, 40, 18);
      playClip(foe, soldClipFor(fin.anim));
      applyDamage(foe, (fin.baseDamage ?? fin.dmg ?? 0), att, { kb: 12, from: att.pos, down: true, big: true, finish: true, launch: 9, downTime: 5.5, moveName: finName });
      gainAtt(att, 20);
    } else if (isDiveFin(fin)) {
      att.vy = 6; const fx = Math.sin(att.facing), fz = Math.cos(att.facing);
      att.vel.x = fx * 9; att.vel.z = fz * 9;
      setTimeout(() => {
        if ((att.rev || 0) !== gen) return;
        for (const v of fighters) {
          if (v === att || v.eliminated) continue;
          if (dist2(att, v) < 2.6) applyDamage(v, (fin.baseDamage ?? fin.dmg ?? 0), att, { kb: 8, from: att.pos, down: true, big: true, finish: true, downTime: 4.8 });
        }
      }, 450);
    }
  }, 650);
}
function isDiveFin(fin) { return fin.anim === 'splash' || fin.anim === 'elbowdrop'; }
// taunt (No Mercy attitude engine)
function doTaunt(f) {
  if (f.cool > 0 || f.state === 'down') return;
  f.cool = 1.0; f.state = 'attack'; f.stateT = 0.9; f.anim = 'taunt'; f.animT = 0.9;
  gainAtt(f, TUNING.attitudeGainTaunt);
  match.heat = clamp(match.heat + 0.06, 0, 1);
  audio.pop(0.5);
  toast(`${f.def.name} taunts the crowd! +ATTITUDE`);
  if (f.isPlayer) updateTron('ATTITUDE UP!', f.def.name);
  refreshCards();
}
// weapons
function nearestWeapon(f, max = 2.2) {
  let best = null, bd = max;
  for (const w of weapons) {
    if (w.state !== 'ground' || w.broken) continue;
    const d = Math.hypot(f.pos.x - w.mesh.position.x, f.pos.z - w.mesh.position.z);
    if (d < bd) { bd = d; best = w; }
  }
  return best;
}
function pickupWeapon(f) {
  if (f.weapon) { dropWeapon(f); return; }
  const w = nearestWeapon(f);
  if (w) {
    w.state = 'carried'; w.holder = f; f.weapon = w;
    toast(`${f.def.name} grabs a ${w.kind.toUpperCase()}!`);
    audio.blip(400, 0.1, 'square', 0.08);
  } else if (f.isPlayer) toast('No weapon nearby — chairs are at ringside!');
}
function dropWeapon(f) {
  const w = f.weapon; if (!w) return;
  w.state = 'ground'; w.holder = null; f.weapon = null;
  w.mesh.position.set(f.pos.x + Math.sin(f.facing), groundHeight(f.pos.x, f.pos.z), f.pos.z + Math.cos(f.facing));
  w.mesh.rotation.set(0, f.facing, 0);
}
function weaponSwing(att) {
  const w = att.weapon; if (!w) return;
  att.cool = 0.8; att.st -= 9;
  att.state = 'attack'; att.stateT = 0.5; att.anim = 'chop'; att.animT = 0.5;
  setTimeout(() => {
    if (match.phase !== 'fight') return;
    let hit = false;
    for (const v of fighters) {
      if (v === att || v.eliminated) continue;
      if (dist2(att, v) < 2.4 && inFront(att, v)) {
        applyDamage(v, w.kind === 'chair' ? 13 : 10, att, { kb: 5, from: att.pos, down: true, big: true, downTime: 2.8 });
        hit = true;
        if (match.pin && match.pin.att === v) breakPin('BROKEN UP!');
      }
    }
    if (hit) {
      showMove(att, `${w.kind.toUpperCase()} SHOT`);
      if (w.kind === 'chair' && Math.random() < 0.25) { // chair bends/breaks rarely
        burst(att.parts.group.position.clone().add(new THREE.Vector3(0, 1.5, 0)), 0xaaaaaa, 8, 4);
      }
      if (Math.random() < 0.3) { dropWeapon(att); }
    }
  }, 180);
}
function throwWeapon(att) {
  const w = att.weapon; if (!w) return;
  fDropWeaponAsThrown(att, w);
}
function fDropWeaponAsThrown(att, w) {
  fDrop(att, w);
  const fx = Math.sin(att.facing), fz = Math.cos(att.facing);
  w.vel.set(fx * 11, 4.5, fz * 11); w.spin = 9; w.cool = 1.6;
  toast(`${att.def.name} throws the ${w.kind}!`);
}
function fDrop(att, w) {
  w.state = 'flying'; w.holder = null; att.weapon = null;
  w.mesh.position.copy(att.parts.group.position); w.mesh.position.y += 1.4;
}
// pin
function tryPin(att) {
  if (att.cool > 0 || match.pin) return;
  if (att.pinCool > 0) return;
  const vic = fighters.find((v) => v !== att && !v.eliminated && v.state === 'down' && dist2(att, v) < 2.0);
  if (!vic) { if (att.isPlayer) toast('No DOWNED opponent nearby to pin!'); return; }
  match.pin = { att, vic, count: 0, t: 0, phase: 'refrun', id: ++match.id };
  att.state = 'pin'; att.stateT = 999; att.pinCool = 4;
  vic.state = 'pinned';
  att.pos.x = vic.pos.x + 0.3; att.pos.z = vic.pos.z - 0.9;
  att.facing = foeDir(att, vic);
  announce('PIN ATTEMPT!', `${att.def.name} covers ${vic.def.name}`);
  audio.blip(440, 0.2, 'square', 0.15);
  updateTron('PIN!', `${att.def.name} COVERS`);
}
function breakPin(msg) {
  const p = match.pin; if (!p) return;
  match.pin = null;
  if (p.att.state === 'pin') { p.att.state = 'idle'; p.att.cool = 0.6; }
  if (p.vic.state === 'pinned') { p.vic.state = 'down'; p.vic.downT = Math.max(p.vic.downT, 1.2); }
  if (msg) announce(msg, '');
}
function updatePin(dt) {
  const p = match.pin; if (!p) return;
  // sanity: a pin with a downed pinner or freed victim is no pin at all
  if (p.att.state !== 'pin' || p.vic.state !== 'pinned') { breakPin(); return; }
  // rope break check at start
  const nearRopes = inRing(p.vic.pos.x, p.vic.pos.z) && (Math.abs(p.vic.pos.x) > 2.55 || Math.abs(p.vic.pos.z) > 2.55);
  p.t += dt;
  // ref runs to victim
  if (ref) {
    ref.x = lerp(ref.x, p.vic.pos.x + 1.2, dt * 4);
    ref.z = lerp(ref.z, p.vic.pos.z + 0.6, dt * 4);
    ref.mesh.position.set(ref.x, groundHeight(ref.x, ref.z), ref.z);
    ref.mesh.rotation.y = Math.atan2(p.vic.pos.x - ref.x, p.vic.pos.z - ref.z);
  }
  const step = p.phase === 'refrun' ? 0.9 : 1.15;
  if (p.t < step) return;
  p.t = 0;
  if (p.phase === 'refrun') { p.phase = 'count'; }
  else {
    p.count++;
    audio.count(Math.min(3, p.count));
    announce(`${p.count}!`, p.count >= 3 ? '' : `${p.vic.def.name} must kick out!`);
    shake(0.25); rumble(0.4, 0.3, 120);
    // rope break saves at 1-2
    if (nearRopes && p.count < 3 && Math.random() < 0.3) {
      breakPin('ROPE BREAK!');
      toast(`${p.vic.def.name} gets a ROPE BREAK!`);
      return;
    }
    // kickout? crowd heat + near-fall history fuel the drama;
    // fresh finishers stay protected (harder to kick out right after one).
    const hf = p.vic.hp / p.vic.maxhp;
    const need = [0, 0.12, 0.3, 99][Math.min(3, p.count)];
    const drama = match.heat * 0.15 + Math.min(0.1, match.story.nearFalls * 0.03);
    const prot = (match.time - (p.att.finisherT ?? -99) < 8) ? -0.2 : 0;
    const roll = hf + Math.random() * 0.35 + (p.vic.att / 400) + (p.count === 2 ? drama : 0) + prot;
    if (roll < need || p.count >= 3) {
      if (p.count >= 3 || roll < need * 0.4) { endMatch(p.att, p.vic, 'pin'); return; }
    }
    if (roll >= [0, 0.35, 0.55, 99][Math.min(3, p.count)] || (p.count < 3 && hf > 0.45 && Math.random() < 0.6)) {
      // kickout! count-2 escapes are near-falls: crowd explodes, hope rises
      match.pin = null;
      p.att.state = 'idle'; p.att.cool = 0.8; p.att.vel.set(-Math.sin(p.att.facing) * 3, 0, -Math.cos(p.att.facing) * 3);
      p.vic.state = 'down'; p.vic.downT = 1.0; p.vic.hp = Math.max(p.vic.hp, 4);
      if (p.count >= 2) {
        match.story.nearFalls++;
        match.story.hope = clamp(match.story.hope + 0.25, 0, 1);
        match.heat = clamp(match.heat + 0.18, 0, 1);
        announce('KICK OUT!', `${p.vic.def.name} stays alive!`);
        toast('WHAT A NEAR FALL! The crowd is on its feet!');
      } else {
        announce('KICK OUT!', `${p.vic.def.name} stays alive!`);
      }
      audio.pop(1.2); match.heat = clamp(match.heat + 0.12, 0, 1);
      rumble(0.7, 0.5, 250);
      updateStoryPhase();
      return;
    }
    if (p.count >= 3) { endMatch(p.att, p.vic, 'pin'); return; }
  }
}
function endMatch(winner, loser, how) {
  if (match.phase !== 'fight') return;
  match.phase = 'over'; match.winner = winner; match.pin = null;
  winner.stats.pins += how === 'pin' ? 1 : 0;
  winner.state = 'celebrate'; winner.stateT = 999; winner.anim = 'taunt';
  audio.bell(); audio.pop(1.5); rumble(1, 0.8, 600);
  match.heat = 1;
  announce(`${winner.def.name} WINS!`, how === 'pin' ? 'BY PINFALL' : 'BY KNOCKOUT');
  updateTron('WINNER', winner.def.name);
  burst(new THREE.Vector3(winner.pos.x, winner.pos.y + 2, winner.pos.z), 0xffd23f, 24, 8);
  // win screen
  setTimeout(() => {
    $('winTitle').textContent = `${winner.def.name} WINS!`;
    $('winStats').innerHTML =
      `<div>${winner.def.nick} · ${how === 'pin' ? 'by PINFALL' : 'victory'} · ⏱ ${fmtTime(match.time)}</div>` +
      fighters.map((f) => `<div style="opacity:.8">${f.def.name}: ${f.stats.dealt} dmg dealt · ${f.hp | 0} HP left</div>`).join('');
    $('winScreen').classList.remove('hidden');
  }, 1800);
}

// ---------- input ----------
const keys = {};
addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  keys[k] = true; keys[e.code] = true;
  if (k === ' ') e.preventDefault();
  audio.ensure();
  if (match.phase !== 'fight') return;
  const p = player();
  if (!p || p.eliminated) return;
  if (e.repeat) return; // taps only; holds are read from keys[] state
  if (k === 'j') doStrike(p);
  if (k === 'k') doGrapple(p, grappleCatFromKeys());
  if (k === 'l') {
    // HCTP run button: tap toward ropes/corner = context action, hold = run
    if (!contextAction(p)) p._runKey = true;
  }
  if (k === 'i') doFinisher(p, dirHeld());
  if (k === 'u') doTaunt(p);
  if (k === 'o') weaponOrTraverse(p);
  if (k === 'f') tryPin(p);
  if (k === 'e') tryRev(p, 'strike');   // LT: strike reversal
  if (k === 'r') tryRev(p, 'grapple');  // RT: grapple reversal
  if (k === 't') tryRev(p, 'finisher'); // LT+RT: finisher reversal
  if (k === 'h') toggleCatalog();
  if (k === 'm') $('muteBtn').textContent = 'SOUND: ' + (audio.toggleMute() ? 'OFF' : 'ON');
  if (k === 'c') { camWide = !camWide; toast(camWide ? 'Wide arena cam' : 'Follow cam'); }
  if (k === 'p' || k === 'escape') togglePause();
  if (k === ' ') spaceAction(p);
});
addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
  keys[e.code] = false;
  const p = player();
  if (p && e.key.toLowerCase() === 'l') p._runKey = false;
});
// HCTP helpers: screen-space stick direction -> grapple category
// W/Up = POWER, S/Down = SUBMISSION (pin if foe down), A/Left = SIGNATURE, D/Right = QUICK
function dirHeld() {
  const dx = ((keys['d'] || keys['arrowright']) ? 1 : 0) - ((keys['a'] || keys['arrowleft']) ? 1 : 0);
  const dz = ((keys['s'] || keys['arrowdown']) ? 1 : 0) - ((keys['w'] || keys['arrowup']) ? 1 : 0);
  return { dx, dz, mag: Math.hypot(dx, dz) };
}
function grappleCatFromKeys() {
  const { dx, dz, mag } = dirHeld();
  if (mag < 0.1) return null; // centered = Irish whip (HCTP Circle alone)
  if (Math.abs(dz) >= Math.abs(dx)) return dz < 0 ? 'power' : 'sub';
  return dx > 0 ? 'quick' : 'sig';
}
// HCTP run/action button (Triangle/Y): tap toward ropes/corner = context action
function contextAction(p, dx, dz) {
  if (!p || p.eliminated || match.phase !== 'fight') return false;
  if (p.state === 'down') { p.downT = Math.max(0, p.downT - 0.8); return true; }
  if (p.state === 'top') { diveAttack(p); return true; }
  if (dx === undefined) { const d = dirHeld(); dx = d.dx; dz = d.dz; }
  if (Math.hypot(dx || 0, dz || 0) < 0.1) return false;
  // world-space direction from screen-space stick (camera-relative)
  const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
  const rx = Math.cos(camYaw), rz = -Math.sin(camYaw);
  const wx = fx * -dz + rx * dx, wz = fz * -dz + rz * dx;
  const onRing = Math.abs(p.pos.x) <= APRON_HALF && Math.abs(p.pos.z) <= APRON_HALF && p.pos.y > 0.5;
  if (onRing) {
    // toward a corner -> climb; toward an edge -> exit the ring
    const cx = Math.sign(p.pos.x) * 3.4, cz = Math.sign(p.pos.z) * 3.4;
    if (Math.hypot(p.pos.x - cx, p.pos.z - cz) < 1.8 && (wx * Math.sign(cx) + wz * Math.sign(cz)) > 0.3) {
      cornerOrDive(p); return true;
    }
    const dot = wx * Math.sign(p.pos.x || wx) + wz * Math.sign(p.pos.z || wz);
    if ((Math.abs(p.pos.x) > 3 || Math.abs(p.pos.z) > 3) && dot > 0.4) {
      p.pos.x += wx * 1.2; p.pos.z += wz * 1.2; // slip out over the ropes
      toast('Slides out to ringside!');
      return true;
    }
    return false;
  }
  // outside: toward the ring -> slide back in
  if (Math.abs(p.pos.x) < 7 && Math.abs(p.pos.z) < 7) {
    p.pos.x = clamp(p.pos.x, -3, 3); p.pos.z = clamp(p.pos.z, -3, 3);
    p.pos.y = RING_TOP; p.vy = 0;
    toast('Slides back into the ring!');
    return true;
  }
  return false;
}
// HCTP action button (Square/X): weapon pickup, or ring traverse with direction
function weaponOrTraverse(p, dx, dz) {
  if (!p || p.eliminated || match.phase !== 'fight') return;
  if (dx === undefined) { const d = dirHeld(); dx = d.dx; dz = d.dz; }
  if (Math.hypot(dx || 0, dz || 0) > 0.4) {
    // toward ropes/edge -> enter/exit (Square + direction)
    const onRing = Math.abs(p.pos.x) <= APRON_HALF && Math.abs(p.pos.z) <= APRON_HALF && p.pos.y > 0.5;
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
    const rx = Math.cos(camYaw), rz = -Math.sin(camYaw);
    const wx = fx * -dz + rx * dx, wz = fz * -dz + rz * dx;
    if (onRing && (Math.abs(p.pos.x) > 2.6 || Math.abs(p.pos.z) > 2.6)) {
      p.pos.x = clamp(p.pos.x + wx * 1.4, -6, 6);
      p.pos.z = clamp(p.pos.z + wz * 1.4, -6, 6);
      toast(p.pos.y > 0.5 && (Math.abs(p.pos.x) > 4 || Math.abs(p.pos.z) > 4) ? 'Out to ringside!' : 'To the ropes!');
      return;
    }
    if (!onRing) { contextAction(p, dx, dz); return; }
  }
  pickupWeapon(p);
}
function spaceAction(p) {
  if (!p || p.eliminated || match.phase !== 'fight') return;
  if (p.state === 'down') { p.downT = Math.max(0, p.downT - 0.8); }
  else cornerOrDive(p);
}
// mouse + touch camera orbit (pointer-id tracked for multi-touch)
let dragId = null, lx = 0, ly = 0;
canvas.addEventListener('pointerdown', (e) => {
  audio.ensure();
  if (dragId !== null) return;
  dragId = e.pointerId; lx = e.clientX; ly = e.clientY;
});
addEventListener('pointermove', (e) => {
  if (e.pointerId !== dragId) return;
  const s = e.pointerType === 'touch' ? 0.009 : 0.006;
  camYaw -= (e.clientX - lx) * s; camPitch = clamp(camPitch + (e.clientY - ly) * 0.004, 0.08, 1.2);
  lx = e.clientX; ly = e.clientY;
});
addEventListener('pointerup', (e) => { if (e.pointerId === dragId) dragId = null; });
addEventListener('pointercancel', (e) => { if (e.pointerId === dragId) dragId = null; });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('wheel', (e) => { camDist = clamp(camDist + e.deltaY * 0.01, 5, 16); }, { passive: true });

// ---------- touch controls (only shown after first touch) ----------
const touchMove = { x: 0, y: 0, mag: 0, id: null };
function showTouchUI() {
  const el = $('touchUI');
  if (el && el.classList.contains('hidden')) {
    el.classList.remove('hidden');
    toast('Touch controls on — stick to move (edge = run), drag screen to orbit');
  }
}
if (matchMedia('(pointer: coarse)').matches) showTouchUI();
addEventListener('touchstart', () => { audio.ensure(); showTouchUI(); }, { passive: true });
addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') showTouchUI(); });
function touchAct(name) {
  audio.ensure();
  if (match.phase !== 'fight') return;
  const p = player();
  if (!p || p.eliminated) return;
  if (name === 'strike') doStrike(p);
  else if (name === 'grapple') {
    const m = touchMove.mag;
    let cat = null;
    if (m > 0.4) {
      const dx = touchMove.x, dy = touchMove.y;
      if (Math.abs(dy) >= Math.abs(dx)) cat = dy < 0 ? 'power' : 'sub';
      else cat = dx > 0 ? 'quick' : 'sig';
    }
    if (cat) doGrapple(p, cat); else doWhip(p);
  }
  else if (name === 'fin') doFinisher(p, touchMove.mag > 0.4);
  else if (name === 'taunt') doTaunt(p);
  else if (name === 'weapon') {
    if (touchMove.mag > 0.4) weaponOrTraverse(p, touchMove.x, touchMove.y);
    else pickupWeapon(p);
  }
  else if (name === 'pin') tryPin(p);
  else if (name === 'rev') tryRevSmart(p);
  else if (name === 'dive') spaceAction(p);
}
// touch RUN button: hold to run (Y), tap = context action
let touchRun = false, touchRunDownAt = 0;
function touchRunDown() {
  audio.ensure();
  if (match.phase !== 'fight') return;
  touchRun = true; touchRunDownAt = performance.now();
}
function touchRunUp() {
  touchRun = false;
  if (match.phase !== 'fight') return;
  const p = player();
  if (!p || p.eliminated) return;
  if (performance.now() - touchRunDownAt < 250 && touchMove.mag > 0.3) {
    contextAction(p, touchMove.x, touchMove.y);
  }
}
{
  const stick = $('stick'), knob = $('stickKnob');
  const R = 44;
  const setKnob = (dx, dy) => { knob.style.transform = `translate(${dx}px,${dy}px)`; };
  stick?.addEventListener('pointerdown', (e) => {
    e.preventDefault(); audio.ensure(); showTouchUI();
    touchMove.id = e.pointerId;
    try { stick.setPointerCapture(e.pointerId); } catch { /* noop */ }
  });
  stick?.addEventListener('pointermove', (e) => {
    if (e.pointerId !== touchMove.id) return;
    const r = stick.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy);
    if (d > R) { dx = dx / d * R; dy = dy / d * R; }
    setKnob(dx, dy);
    touchMove.x = dx / R; touchMove.y = dy / R; touchMove.mag = Math.min(1, d / R);
  });
  const release = (e) => {
    if (e.pointerId !== touchMove.id) return;
    touchMove.id = null; touchMove.x = touchMove.y = touchMove.mag = 0;
    setKnob(0, 0);
  };
  stick?.addEventListener('pointerup', release);
  stick?.addEventListener('pointercancel', release);
  document.querySelectorAll('#touchBtns .tb').forEach((b) => {
    if (b.dataset.act === 'run') {
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); touchRunDown(); });
      b.addEventListener('pointerup', (e) => { e.preventDefault(); e.stopPropagation(); touchRunUp(); });
      b.addEventListener('pointercancel', () => { touchRun = false; });
    } else {
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); touchAct(b.dataset.act); });
    }
  });
  $('touchPause')?.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); togglePause(); });
}

function player() { return fighters.find((f) => f.isPlayer); }
function cornerOrDive(f) {
  // on top -> dive; near corner in ring -> climb; on floor near edge -> slide in
  if (f.state === 'top') { diveAttack(f); return; }
  if (f.state === 'down' || f.state === 'pin' || f.state === 'submit') return;
  const onRing = Math.abs(f.pos.x) <= APRON_HALF && Math.abs(f.pos.z) <= APRON_HALF && f.pos.y > 0.5;
  if (onRing) {
    const cx = Math.sign(f.pos.x) * 3.4, cz = Math.sign(f.pos.z) * 3.4;
    if (Math.hypot(f.pos.x - cx, f.pos.z - cz) < 1.6) {
      f.state = 'top'; f.topCorner = { x: cx, z: cz }; f.stateT = 999; f.anim = 'top';
      f.pos.x = cx; f.pos.z = cz; f.pos.y = 2.55; f.vy = 0;
      toast('On the TOP ROPE! J = dive, Space = climb down');
      audio.blip(520, 0.15, 'square', 0.1);
      return;
    }
  }
  // slide back in from floor
  if (!onRing && Math.abs(f.pos.x) < 6 && Math.abs(f.pos.z) < 6) {
    f.pos.x = clamp(f.pos.x, -3, 3); f.pos.z = clamp(f.pos.z, -3, 3);
    f.pos.y = RING_TOP; f.vy = 0;
    toast('Slides back into the ring!');
  }
}
function diveAttack(f) {
  let best = null, bd = 99;
  for (const v of fighters) {
    if (v === f || v.eliminated) continue;
    const d = Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z);
    if (d < bd) { bd = d; best = v; }
  }
  const mv = pick(MOVES.dive);
  f.state = 'dive'; f.stateT = 1.0; f.anim = 'splash';
  if (best && bd < 7) {
    const dx = best.pos.x - f.pos.x, dz = best.pos.z - f.pos.z;
    const d = Math.hypot(dx, dz) || 1, t = clamp(d / 8, 0.4, 0.8);
    f.vel.set((dx / d) * (d / t), 0, (dz / d) * (d / t));
    f.vy = 3.2; f._diveTarget = best; f._diveMove = mv;
  } else {
    f.vy = 2; f.vel.set(Math.sin(f.facing) * 3, 0, Math.cos(f.facing) * 3);
    f._diveTarget = null; f._diveMove = mv;
  }
  audio.blip(700, 0.2, 'sawtooth', 0.1);
}

// ---------- AI (Empire-style roaming brawler brain) ----------
function aiControl(f, dt) {
  f.aiT -= dt;
  if (f.aiT > 0) return;
  f.aiT = rand(0.18, 0.4);
  if (match.pin) {
    // break up pins that aren't mine (chaos!)
    const p = match.pin;
    if (p.att !== f && p.vic !== f && Math.random() < 0.5) {
      f.aiMove = { type: 'seek', x: p.att.pos.x, z: p.att.pos.z, attack: true };
      return;
    }
    if (p.vic === f || p.att === f) return;
  }
  if (f.state === 'down' || f.state === 'pinned' || f.state === 'submit' || f.state === 'submitvictim' || f.state === 'pin' || f.state === 'top' || f.state === 'dive' || f.state === 'corner') return;
  // pin opportunity?
  const downed = fighters.filter((v) => v !== f && !v.eliminated && v.state === 'down');
  const easy = downed.find((v) => Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z) < 2.2);
  if (easy && f.pinCool <= 0 && Math.random() < 0.75) { tryPin(f); return; }
  // finisher?
  if (f.att >= 100) {
    const foe = fighters.find((v) => v !== f && !v.eliminated && Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z) < 2.4);
    if (foe) { doFinisher(f); return; }
  }
  // pick target
  let tgt = null, bd = 1e9;
  for (const v of fighters) {
    if (v === f || v.eliminated || isDown(v)) continue;
    const d = Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z);
    if (d < bd) { bd = d; tgt = v; }
  }
  if (!tgt) { // taunt / roam
    if (Math.random() < 0.3) doTaunt(f);
    f.aiMove = { type: 'roam' }; return;
  }
  // weapon lust (heels + brawlers love chairs)
  if (!f.weapon && (f.def.align === 'HEEL' || f.def.id === 'thunder') && Math.random() < 0.18) {
    const w = nearestWeapon(f, 6);
    if (w) { f.aiMove = { type: 'weapon', w }; return; }
  }
  // top rope dive (luchadors / showmen)
  if ((f.def.spd >= 8) && Math.random() < 0.06 && inRing(f.pos.x, f.pos.z)) {
    f.aiMove = { type: 'corner' }; return;
  }
  if (bd < 1.7) {
    // Safety Kernel: near the finish, secure it — no wild whips on a critical foe
    const critical = tgt.hp <= 12;
    // Narrative Director: heels build heat when leading, faces chase hope when behind
    const leading = f.hp >= tgt.hp;
    const heelHeat = f.def.align === 'HEEL' && leading && match.story.phase === 'heat';
    const faceHope = f.def.align === 'FACE' && !leading && (match.story.phase === 'hope' || match.story.phase === 'finish');
    const r = Math.random();
    if (critical) {
      if (r < 0.7) doGrapple(f, 'auto'); // secure the win
      else doStrike(f);
    } else if (heelHeat) {
      if (r < 0.2) doTaunt(f); // milk the heat
      else if (r < 0.7) doGrapple(f, 'auto'); // rest holds, cut off comebacks
      else doStrike(f);
    } else if (faceHope) {
      if (r < 0.55) doStrike(f); // hope-spot flurry
      else doGrapple(f, 'auto');
    } else if (f.att > 55 && r < 0.12) doTaunt(f);
    else if (r < 0.5) doStrike(f);
    else if (r < 0.8) doGrapple(f, 'auto');
    else doWhip(f);
    f.aiMove = { type: 'hold' };
  } else {
    f.aiMove = { type: 'seek', x: tgt.pos.x, z: tgt.pos.z, attack: bd < 4, tgt };
  }
}
function aiSteer(f, dt) {
  const mv = f.aiMove;
  if (!mv || f.state === 'down' || f.state === 'pin' || f.state === 'submit' || f.state === 'whipped' || f.state === 'top' || f.state === 'corner') return { x: 0, z: 0, run: false };
  if (mv.type === 'seek') {
    const dx = mv.x - f.pos.x, dz = mv.z - f.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 1.4) return { x: 0, z: 0, run: false };
    // slide in if outside ring and target inside
    if (f.pos.y < 0.5 && Math.abs(mv.x) <= 3 && Math.abs(mv.z) <= 3 && Math.abs(f.pos.x) < 5.5 && Math.abs(f.pos.z) < 5.5 && d < 3.5) {
      f.pos.x = clamp(f.pos.x, -3, 3); f.pos.z = clamp(f.pos.z, -3, 3); f.pos.y = RING_TOP;
    }
    return { x: dx / (d || 1), z: dz / (d || 1), run: d > 5 };
  }
  if (mv.type === 'weapon' && mv.w && mv.w.state === 'ground') {
    const dx = mv.w.mesh.position.x - f.pos.x, dz = mv.w.mesh.position.z - f.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 1.4) { pickupWeapon(f); f.aiMove = null; return { x: 0, z: 0, run: false }; }
    return { x: dx / d, z: dz / d, run: true };
  }
  if (mv.type === 'corner') {
    const cx = Math.sign(f.pos.x || 1) * 3.4, cz = Math.sign(f.pos.z || 1) * 3.4;
    const dx = cx - f.pos.x, dz = cz - f.pos.z, d = Math.hypot(dx, dz);
    if (d < 0.8) { cornerOrDive(f); f.aiMove = null; setTimeout(() => { if (f.state === 'top') diveAttack(f); }, 900); return { x: 0, z: 0, run: false }; }
    return { x: dx / d, z: dz / d, run: true };
  }
  if (mv.type === 'roam') return { x: Math.sin(match.time * 0.5 + f.walkPhase), z: Math.cos(match.time * 0.4), run: false };
  return { x: 0, z: 0, run: false };
}

// ---------- physics + animation ----------
let shakeAmt = 0;
function shake(n) { shakeAmt = Math.min(1, shakeAmt + n); }
let matImpact = 0; // ring-mat spring compression 0..1 (visual + feel)
function matHit(n) { matImpact = Math.min(1.2, matImpact + n); }
function fighterMass(f) { return Math.max(0.6, (f.def.weight || 100) / 100); }
function fighterMomentum(f) { return fighterMass(f) * Math.hypot(f.vel.x, f.vel.z); }

function stepFighter(f, dt, input) {
  const P = f.parts;
  f.cool = Math.max(0, f.cool - dt);
  f.pinCool = Math.max(0, f.pinCool - dt);
  f.st = Math.min(TUNING.stamina, f.st + dt * 10);
  f.hitFlash = Math.max(0, f.hitFlash - dt);
  if (f.stun > 0) f.stun -= dt;
  f.ropeBoost = Math.max(0, (f.ropeBoost || 0) - dt);
  f.cornerT = Math.max(0, (f.cornerT || 0) - dt);
  f.avalancheT = Math.max(0, (f.avalancheT || 0) - dt);
  // sweat sheen: skin gets glossier as stamina drains + heat rises
  if (P.skinM) {
    const sweat = (1 - f.st / TUNING.stamina) * 0.5 + match.heat * 0.2;
    P.skinM.roughness = Math.max(0.16, 0.46 - sweat * 0.35);
  }

  // AKI Physics updates
  if (f.spiritMeter) f.spiritMeter.update(dt);
  if (f.wakeupTimer) f.wakeupTimer.update(dt, false); // mashing handled by input
  if (f.animController) f.animController.update(dt);
  if (f.spiritMeter) f.spirit = f.spiritMeter.value; // sync legacy attitude
  
  // Update aura
  updateAura(f.parts, f.att);

  const busy = ['attack', 'grapple', 'victim', 'pin', 'submit', 'submitvictim', 'pinned', 'celebrate', 'corner'].includes(f.state);
  const canMove = !busy && f.state !== 'down' && f.state !== 'top' && f.state !== 'dive';

  // state timers
  if (f.state === 'corner') {
    f.stateT -= dt;
    if (f.stateT <= 0) { f.state = 'idle'; }
  }
  if (f.state === 'attack' || f.state === 'grapple' || f.state === 'victim') {
    f.stateT -= dt;
    if (f.stateT <= 0 && f.state !== 'victim') { f.state = 'idle'; }
  }
  if (f.state === 'getup') {
    f.stateT -= dt;
    if (f.stateT <= 0) { f.state = 'idle'; }
  }
  if (f.state === 'down') {
    f.downT -= dt;
    // Update wakeup timer
    if (f.wakeupTimer) {
      f.wakeupTimer.update(dt, false); // mashing would come from input
    }
    // Get up when wakeup timer expires or downT expires (whichever is later)
    const wakeupReady = f.wakeupTimer ? f.wakeupTimer.isReady : (f.downT <= 0);
    if (wakeupReady && f.downT <= 0) {
      if (f.hp <= 6 && match.phase === 'fight' && !match.pin) {
        // stay down longer when critical — pin me!
      } else getup(f);
      if (f.hp <= 0 && match.phase === 'fight') { /* hardcore: still kick out-able */ }
    }
  }
  if (f.state === 'whipped') {
    f.stun -= dt;
    f.pos.x += f.whipped.x * dt; f.pos.z += f.whipped.z * dt;
    ropeCheck(f, true);
    if (f.stun <= 0) { f.state = 'idle'; f.whipped = null; f.stun = 0.5; }
  }
  if (f.state === 'dive') {
    f.stateT -= dt;
    f._diveT0 = (f._diveT0 || 0) + dt;
    // gravity handles flight; landing resolved in vertical step
  } else f._diveT0 = 0;

  // movement input
  let mx = 0, mz = 0, wantRun = false;
  if (canMove) {
    if (f.isPlayer && input) { mx = input.x; mz = input.z; wantRun = input.run; }
    else if (!f.isPlayer) { const s = aiSteer(f, dt); mx = s.x; mz = s.z; wantRun = s.run; }
  }
  const ropeAmp = (f.ropeBoost > 0 && wantRun) ? 1.3 : 1; // timed press amplifies the return
  const spd = (2.6 + f.def.spd * 0.22) * (wantRun ? 1.85 : 1) * (1 - 0.25 * (f.fatigue || 0)) * ropeAmp;
  const asl = Math.hypot(mx, mz);
  if (asl > 0.01 && canMove && f.stun <= 0) {
    const nx = mx / Math.max(1, asl), nz = mz / Math.max(1, asl);
    // Snappier acceleration - reach target speed faster
    const acc = f.pos.y > 0.5 ? 45 : 32;
    const rate = Math.min(1, acc * dt);
    f.vel.x = lerp(f.vel.x, nx * spd, rate);
    f.vel.z = lerp(f.vel.z, nz * spd, rate);
    f.facing = angLerp(f.facing, Math.atan2(nx, nz), Math.min(1, 12 * dt));
    f.walkPhase += dt * (wantRun ? 13 : 8);
    if (wantRun) f.st = Math.max(0, f.st - dt * 6);
    f.state = wantRun ? 'run' : 'walk';
  } else if (canMove) {
    // Stronger friction - stop sliding immediately when input released
    const drag = f.pos.y > 0.5 ? 22 : 16; // ring vs floor
    f.vel.x *= (1 - Math.min(1, drag * dt));
    f.vel.z *= (1 - Math.min(1, drag * dt));
    // Snap to zero below threshold
    if (Math.abs(f.vel.x) < 0.15) f.vel.x = 0;
    if (Math.abs(f.vel.z) < 0.15) f.vel.z = 0;
    if (f.state === 'walk' || f.state === 'run') f.state = 'idle';
  }
  // integrate
  f.pos.x += f.vel.x * dt; f.pos.z += f.vel.z * dt;
  // ropes / exits
  ropeCheck(f, f.state === 'whipped');
  // confines: arena bounds
  f.pos.x = clamp(f.pos.x, -13, 13); f.pos.z = clamp(f.pos.z, -13, 13);
  // turnbuckle crash: high-speed corner impact crumples the victim (avalanche setup)
  if (f.pos.y > 0.5 && Math.abs(f.pos.x) > 2.9 && Math.abs(f.pos.z) > 2.9) {
    const cspd = Math.hypot(f.vel.x, f.vel.z);
    if (cspd > 6 && f.state !== 'down' && f.state !== 'top' && f.state !== 'dive' && (f.cornerT || 0) <= 0) {
      f.state = 'corner'; f.stateT = 1.1; f.anim = 'lockup'; f.animT = 1.1;
      f.vel.multiplyScalar(0.2); f.cornerT = 4; f.stun = Math.max(f.stun, 0.8);
      matHit(0.4); shake(0.5); audio.hit('hit');
      if (f.isPlayer) toast('CORNER CRASH! Avalanche window open!');
      match.heat = clamp(match.heat + 0.06, 0, 1);
    }
  }

  // vertical
  const gh = groundHeight(f.pos.x, f.pos.z);
  const airborne = f.pos.y > gh + 0.02 || f.vy > 0.01;
  if (airborne || f.state === 'dive') {
    f.vy -= GRAV * dt;
    f.pos.y += f.vy * dt;
    if (f.pos.y <= gh) {
      const fall = -f.vy;
      f.pos.y = gh; f.vy = 0;
      if (f.state === 'dive') {
        // dive landing: AoE around landing - HIGH IMPACT
        const mv = f._diveMove || { name: 'CROSSBODY', dmg: 13 };
        let hit = false;
        for (const v of fighters) {
          if (v === f || v.eliminated) continue;
          if (Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z) < 2.1) {
            applyDamage(v, (mv.baseDamage ?? mv.dmg ?? 0), f, { kb: 7, from: f.pos, down: true, big: true, launch: 5, downTime: 3.2 });
            hit = true;
          }
        }
        if (hit) {
          showMove(f, mv.name + ' — CRASH!');
          audio.pop(1.6);
          shake(0.9);
          burst(new THREE.Vector3(f.pos.x, f.pos.y + 1.0, f.pos.z), 0xffaa00, 24, 10);
        } else {
          toast('Nobody home! The dive misses...'); match.heat = clamp(match.heat - 0.05, 0, 1);
        }
        applyDamageSelf(f, fall > 8 ? 6 : 2);
        f.state = 'down'; f.downT = hit ? 1.5 : 2.5; f.anim = 'down';
      } else if (fall > 9) {
        applyDamageSelf(f, Math.round((fall - 9) * 1.5));
        knockDown(f, 1.6);
        toast(`${f.def.name} crashes down!`);
      }
      f.vel.x *= 0.3; f.vel.z *= 0.3;
    }
  } else {
    f.pos.y = gh;
    // walked off edge -> fall handled next frames since gh changes
    if (f.pos.y === RING_TOP && (Math.abs(f.pos.x) > APRON_HALF || Math.abs(f.pos.z) > APRON_HALF)) {
      // now over floor: drop
      f.pos.y = Math.max(0, f.pos.y - 3 * dt);
    }
  }
  // friction when grounded & idle
  if (!airborne && (f.state === 'idle' || f.state === 'attack')) {
    f.vel.x *= (1 - Math.min(1, 6 * dt)); f.vel.z *= (1 - Math.min(1, 6 * dt));
  }

  // table break check (big bumps near table)
  for (const w of weapons) {
    if (w.kind === 'table' && !w.broken && f.state === 'down') {
      const d = Math.hypot(f.pos.x - w.mesh.position.x, f.pos.z - w.mesh.position.z);
      if (d < 1.6 && f.pos.y < 0.5) breakTable(w, f);
    }
  }

  // ---- pose (sets group transform first so anims can add offsets) ----
  P.group.position.copy(f.pos);
  P.group.rotation.y = f.facing;
  poseFighter(f, dt);
  // hit flash across all body materials
  const flash = f.hitFlash > 0;
  for (const m of (P.mats || [])) { if (m.emissive) m.emissive.setHex(flash ? 0x771414 : 0x000000); }
  P.aura.material.opacity = f.att >= 100 ? (0.5 + Math.sin(performance.now() * 0.012) * 0.4) : 0;
  // carried weapon follows hand
  if (f.weapon && f.weapon.state === 'carried') {
    const w = f.weapon.mesh;
    const hx = f.pos.x + Math.sin(f.facing) * 0.55, hz = f.pos.z + Math.cos(f.facing) * 0.55;
    w.position.set(hx, f.pos.y + 1.1, hz);
    w.rotation.set(0, f.facing, -0.5);
  }
}
function applyDamageSelf(f, n) {
  if (n <= 0) return;
  f.hp = Math.max(1, f.hp - n);
  burst(new THREE.Vector3(f.pos.x, f.pos.y + 1, f.pos.z), 0xcccccc, 6, 3);
  refreshCards();
}
function ropeCheck(f, forceBounce) {
  const onRing = f.pos.y > 0.5;
  if (!onRing) return;
  const ax = Math.abs(f.pos.x), az = Math.abs(f.pos.z);
  const out = Math.max(ax, az);
  if (out < ROPE) return;
  const speed = Math.hypot(f.vel.x, f.vel.z);
  // whipped / running fast -> Empire bounce with stored rope energy (1/2 k x^2 feel)
  if (forceBounce || speed > 4.5 || f.state === 'run' || f.state === 'dive') {
    const tune = arenaTune();
    const rest = 0.55 + 0.25 * tune.bounce; // restitution by ring tune
    if (ax > az) { f.pos.x = Math.sign(f.pos.x) * (ROPE - 0.05); f.vel.x *= -rest; f.vel.z *= 0.7; }
    else { f.pos.z = Math.sign(f.pos.z) * (ROPE - 0.05); f.vel.z *= -rest; f.vel.x *= 0.7; }
    f.ropeEnergy = clamp(speed / 9, 0.2, 1);
    f.ropeBoost = 0.6; // timed-press window: hit run (Shift) to amplify
    if (f.state === 'whipped' && f.whipped) {
      // bounce back toward center (Empire style)
      const cx = -Math.sign(f.pos.x) * (ax > az ? 1 : 0.2), cz = -Math.sign(f.pos.z) * (az >= ax ? 1 : 0.2);
      const d = Math.hypot(cx, cz) || 1;
      f.whipped.x = (cx / d) * 7; f.whipped.z = (cz / d) * 7;
      audio.blip(180, 0.12, 'square', 0.08);
      burst(new THREE.Vector3(f.pos.x, f.pos.y + 1.4, f.pos.z), 0xffffff, 5, 3);
    } else if (speed > 5 && f.state !== 'dive') {
      toast('Off the ropes!'); audio.blip(180, 0.1, 'square', 0.06);
    }
  } else {
    // slow walk -> slip out to apron / over the top
    if (out > APRON_HALF - 0.1) {
      if (ax > az) f.pos.x = Math.sign(f.pos.x) * (APRON_HALF - 0.15);
      else f.pos.z = Math.sign(f.pos.z) * (APRON_HALF - 0.15);
      f.vel.multiplyScalar(0.3);
    }
  }
}
function breakTable(w, f) {
  w.broken = true;
  const top = w.mesh.getObjectByName('tabletop');
  if (top) { top.rotation.z = 0.5; top.position.y = 0.2; }
  w.mesh.rotation.y += 0.4;
  burst(new THREE.Vector3(w.mesh.position.x, 1, w.mesh.position.z), 0x9c6b3c, 22, 7);
  audio.hit('hit'); audio.pop(1.4); shake(0.5);
  announce('THROUGH THE TABLE!', f.def.name);
  applyDamage(f, 8, null, { down: true, downTime: 3 });
}

function poseFighter(f, dt) {
  const P = f.parts;
  const t = performance.now() * 0.001;
  // ---- joint snapshot: poses below write TARGETS, blended at the end ----
  // (this is what makes motion smooth instead of snappy)
  const SJ = ['pelvis', 'spine', 'torso', 'neck', 'head',
    'lUpper', 'rUpper', 'lFore', 'rFore', 'lHand', 'rHand',
    'lThigh', 'rThigh', 'lShin', 'rShin', 'lFoot', 'rFoot'];
  const snap = [];
  for (const n of SJ) { const o = P[n]; if (o) snap.push([o, o.rotation.x, o.rotation.y, o.rotation.z]); }
  const snapGY = P.group.position.y, snapGRX = P.group.rotation.x, snapPelY = P.pelvis.position.y;
  const run = f.state === 'run';
  const sw = Math.sin(f.walkPhase) * (run ? 0.95 : 0.55);
  const sw2 = Math.sin(f.walkPhase + Math.PI) * (run ? 0.95 : 0.55);
  const moving = f.state === 'walk' || run || f.state === 'whipped';
  const HH = f.def.height || 1;
  // ---- base stance (every joint set every frame) ----
  P.group.scale.y = 1;
  P.group.rotation.x = 0;
  P.pelvis.position.y = 0.92 * HH - (moving ? 0 : 0.02);
  P.pelvis.rotation.set(0, 0, 0);
  if (moving) { // weight: bob + sway on the pelvis
    P.pelvis.position.y += Math.abs(Math.sin(f.walkPhase)) * 0.045;
    P.pelvis.rotation.z = Math.sin(f.walkPhase) * 0.035;
  }
  P.spine.rotation.set(moving && run ? 0.16 : moving ? 0.07 : 0.08, 0, 0);
  P.torso.rotation.set(0, 0, 0);
  P.neck.rotation.set(-0.06, 0, 0);
  P.head.rotation.set(0, 0, 0);
  // fighter's stance: soft knees, weight forward, fists up (not arms at sides)
  P.lThigh.rotation.set(moving ? sw : -0.12, 0, 0.035);
  P.rThigh.rotation.set(moving ? sw2 : -0.12, 0, -0.035);
  P.lShin.rotation.set(moving ? Math.max(0, sw2 * 1.3) : 0.24, 0, 0);
  P.rShin.rotation.set(moving ? Math.max(0, sw * 1.3) : 0.24, 0, 0);
  P.lFoot.rotation.set(moving ? -sw * 0.4 : 0.06, 0, 0);
  P.rFoot.rotation.set(moving ? -sw2 * 0.4 : 0.06, 0, 0);
  const pump = run || f.state === 'whipped';
  P.lUpper.rotation.set(moving ? sw2 * 0.75 : -0.45, 0, 0.14);
  P.rUpper.rotation.set(moving ? sw * 0.75 : -0.65, 0, -0.14);
  P.lFore.rotation.set(pump ? -1.2 - sw * 0.35 : moving ? -0.55 : -1.25, 0, 0);
  P.rFore.rotation.set(pump ? -1.2 - sw2 * 0.35 : moving ? -0.55 : -1.15, 0, 0);
  P.lHand.rotation.set(0, 0, 0); P.rHand.rotation.set(0, 0, 0);
  // ring awareness: idle/walking heads track the nearest foe
  if (f.state === 'idle' || f.state === 'walk' || f.state === 'run') {
    let bf = null, bd = 1e9;
    for (const v of fighters) {
      if (v === f || v.eliminated) continue;
      const d = Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z);
      if (d < bd) { bd = d; bf = v; }
    }
    if (bf) {
      const dy = Math.atan2(Math.sin(foeDir(f, bf) - f.facing), Math.cos(foeDir(f, bf) - f.facing));
      P.head.rotation.y = clamp(dy * 0.6, -0.55, 0.55);
    }
  }

  const A = f.anim;
  const pr = f.animT ? clamp(1 - f.stateT / f.animT, 0, 1) : 0;
  const punch = Math.sin(pr * Math.PI);
  const lift = Math.sin(pr * Math.PI);
  if (f.clip && CLIPS[f.clip]) {
    // keyframed move clip wins over every procedural branch
    sampleClip(f, P, dt);
  } else if (f.state === 'victim') {
    // SOLD choreography: the victim is hoisted, inverted, or flipped — never static.
    const VA = f._victimAnim || 'slam';
    P.group.position.y = f.pos.y + lift * (VA === 'piledriver' ? 1.9 : 1.0);
    P.spine.rotation.x = -0.55 * lift;
    P.lUpper.rotation.z = 2.4; P.rUpper.rotation.z = -2.4;
    P.lFore.rotation.x = -0.3; P.rFore.rotation.x = -0.3;
    P.lThigh.rotation.x = -0.5 * lift; P.rThigh.rotation.x = -0.5 * lift;
    P.lShin.rotation.x = 0.6 * lift; P.rShin.rotation.x = 0.6 * lift;
    P.head.rotation.x = -0.4 * lift;
    P.spine.rotation.x += Math.sin(t * 30) * 0.02; // struggle
  } else if (['punch', 'chop', 'elbow', 'clothesline'].includes(A) && f.state === 'attack') {
    const ext = A === 'clothesline' ? 1.2 : 1.7;
    P.rUpper.rotation.x = -ext * punch - 0.15;
    if (A === 'clothesline') P.rUpper.rotation.z = -1.4 * punch - 0.1;
    P.rFore.rotation.x = -0.15;
    P.lUpper.rotation.x = -0.6; P.lFore.rotation.x = -1.4; // guard
    P.torso.rotation.y = -0.55 * punch;
    P.spine.rotation.y = -0.2 * punch;
    P.head.rotation.y = 0.25 * punch;
  } else if (['kick', 'superkick', 'dropkick'].includes(A)) {
    if (A === 'dropkick') {
      P.lThigh.rotation.x = -1.4 * punch; P.rThigh.rotation.x = -1.4 * punch;
      P.lShin.rotation.x = 0.3; P.rShin.rotation.x = 0.3;
      P.spine.rotation.x = -0.3 * punch;
      P.lUpper.rotation.x = 0.8 * punch; P.rUpper.rotation.x = 0.8 * punch;
      P.group.position.y = f.pos.y + punch * 0.55;
    } else {
      P.rThigh.rotation.x = -1.75 * punch; P.rShin.rotation.x = 0.15;
      P.lShin.rotation.x = 0.2; // support knee
      P.spine.rotation.x = -0.22 * punch; // lean back into the kick
      P.torso.rotation.y = 0.45 * punch;
      P.lUpper.rotation.set(0.5 * punch, 0, 0.6); // arms trail back
      P.rUpper.rotation.set(0.5 * punch, 0, -0.6);
      P.head.rotation.y = -0.2 * punch;
    }
  } else if (A === 'taunt') {
    const w = Math.sin(t * 10) * 0.35;
    P.lUpper.rotation.set(0, 0, 2.4 + w * 0.2);
    P.rUpper.rotation.set(0, 0, -2.4 - w * 0.2);
    P.lFore.rotation.x = -0.4; P.rFore.rotation.x = -0.4;
    P.spine.rotation.x = -0.12; // chest out
    P.head.rotation.x = -0.22;
    P.lShin.rotation.x = 0.12; P.rShin.rotation.x = 0.12;
    P.group.position.y = f.pos.y + Math.abs(Math.sin(t * 10)) * 0.06;
  } else if (['suplex', 'slam', 'powerbomb', 'piledriver', 'german', 'spinebuster', 'neckbreaker', 'ddt', 'backbreaker', 'hurricanrana'].includes(A)) {
    P.lUpper.rotation.z = 2.6; P.rUpper.rotation.z = -2.6;
    P.lFore.rotation.x = -0.3; P.rFore.rotation.x = -0.3;
    P.spine.rotation.x = -0.35 * lift;
    P.lThigh.rotation.x = 0.3 * lift; P.rThigh.rotation.x = 0.3 * lift;
    P.lShin.rotation.x = 0.4 * lift; P.rShin.rotation.x = 0.4 * lift;
    P.head.rotation.x = -0.3 * lift;
    // power moves finish sunk deep into the knees
    if (['powerbomb', 'piledriver', 'spinebuster'].includes(A)) {
      const endP = clamp((pr - 0.5) * 2, 0, 1);
      P.pelvis.position.y = lerp(0.92 * HH, 0.60 * HH, endP);
      P.lThigh.rotation.x = lerp(0.3 * lift, -1.05, endP);
      P.rThigh.rotation.x = lerp(0.3 * lift, -1.05, endP);
      P.lShin.rotation.x = lerp(0.4 * lift, 1.25, endP);
      P.rShin.rotation.x = lerp(0.4 * lift, 1.25, endP);
    }
  } else if (A === 'lockup') {
    // collar-and-elbow: grinding forward, trembling with effort
    P.lUpper.rotation.x = -1.1; P.rUpper.rotation.x = -1.1;
    P.lFore.rotation.x = -1.1; P.rFore.rotation.x = -1.1;
    P.spine.rotation.x = 0.3 + Math.sin(t * 32) * 0.025;
    P.lThigh.rotation.x = -0.3; P.rThigh.rotation.x = -0.3;
    P.lShin.rotation.x = 0.4; P.rShin.rotation.x = 0.4;
    P.head.rotation.x = 0.15;
  } else if (f.state === 'corner') {
    // crumpled against the turnbuckle: slumped, arms draped, head down
    P.pelvis.position.y = 0.62 * HH;
    P.pelvis.rotation.x = 0.25;
    P.spine.rotation.x = 0.55;
    P.head.rotation.x = 0.6;
    P.lUpper.rotation.set(-0.3, 0, 0.9); P.rUpper.rotation.set(-0.3, 0, -0.9);
    P.lFore.rotation.x = -0.5; P.rFore.rotation.x = -0.5;
    P.lThigh.rotation.x = -0.7; P.rThigh.rotation.x = -0.7;
    P.lShin.rotation.x = 1.0; P.rShin.rotation.x = 1.0;
  } else if (A === 'down' || f.state === 'down' || f.state === 'pinned') {
    // flat on the back, head resting on the mat — a real sell, never a squash
    P.pelvis.position.y = 0.24 * HH;
    P.pelvis.rotation.x = -1.5;
    P.spine.rotation.x = 0.12;
    P.head.rotation.set(0.45, 0, 0.25); // face up, lolled to the side
    P.lUpper.rotation.set(-0.4, 0, 1.15); P.rUpper.rotation.set(-0.4, 0, -1.15);
    P.lFore.rotation.x = -0.35; P.rFore.rotation.x = -0.35;
    P.lThigh.rotation.set(0.15, 0, 0.12); P.rThigh.rotation.set(0.15, 0, -0.12);
    P.lShin.rotation.x = 0.3; P.rShin.rotation.x = 0.3;
    P.lFoot.rotation.x = 0.5; P.rFoot.rotation.x = 0.5; // toes up
  } else if (f.state === 'submitvictim') {
    // prone, face down, pushing at the mat
    P.pelvis.position.y = 0.26 * HH;
    P.pelvis.rotation.x = 1.35;
    P.spine.rotation.x = -0.1;
    P.head.rotation.x = 0.55;
    P.lUpper.rotation.set(-0.9, 0, 0.5); P.rUpper.rotation.set(-0.9, 0, -0.5);
    P.lFore.rotation.x = -0.5; P.rFore.rotation.x = -0.5;
    P.lThigh.rotation.set(0.1, 0, 0.1); P.rThigh.rotation.set(0.1, 0, -0.1);
    P.lShin.rotation.x = 0.35; P.rShin.rotation.x = 0.35;
  } else if (A === 'getup') {
    // rise off the mat from whichever way we were lying
    const r0 = f._downRot || -1.5;
    P.pelvis.position.y = lerp(0.25, 0.92, pr) * HH;
    P.pelvis.rotation.x = lerp(r0, 0, pr);
    P.spine.rotation.x = lerp(0.4, 0.05, pr);
  } else if (A === 'top') {
    P.lThigh.rotation.x = -1.9; P.rThigh.rotation.x = -1.9; // crouch on buckle
    P.lShin.rotation.x = 1.5; P.rShin.rotation.x = 1.5;
    P.lUpper.rotation.z = 2.8; P.rUpper.rotation.z = -2.8;
    P.lFore.rotation.x = -0.5; P.rFore.rotation.x = -0.5;
    P.spine.rotation.x = 0.15;
    P.head.rotation.x = 0.35; // eyes on the foe below
  } else if (A === 'splash') {
    // frog-splash spread eagle: limbs wide, belly down
    P.lUpper.rotation.set(0.3, 0, 2.2); P.rUpper.rotation.set(0.3, 0, -2.2);
    P.lFore.rotation.x = -0.3; P.rFore.rotation.x = -0.3;
    P.lThigh.rotation.set(0.5, 0, 0.45); P.rThigh.rotation.set(0.5, 0, -0.45);
    P.lShin.rotation.x = 0.5; P.rShin.rotation.x = 0.5;
    P.spine.rotation.x = -0.25;
    P.head.rotation.x = -0.35;
  } else if (A === 'elbowdrop') {
    P.rUpper.rotation.x = -2.6; P.rFore.rotation.x = -0.2; // driving elbow down
    P.lUpper.rotation.z = 2.6;
    P.lThigh.rotation.x = 0.5; P.rThigh.rotation.x = 0.5;
    P.lShin.rotation.x = 1.0; P.rShin.rotation.x = 1.0;
    P.spine.rotation.x = 0.3;
  } else if (A === 'submit') {
    // seated on the mat beside the victim, cranking back
    P.pelvis.position.y = 0.55 * HH;
    P.spine.rotation.x = 0.65;
    P.lUpper.rotation.x = -1.3; P.rUpper.rotation.x = -1.3;
    P.lFore.rotation.x = -0.8; P.rFore.rotation.x = -0.8;
    P.lThigh.rotation.x = -1.1; P.rThigh.rotation.x = -1.1;
    P.lShin.rotation.x = 1.2; P.rShin.rotation.x = 1.2;
    P.head.rotation.x = 0.3;
  } else if (A === 'stomp') {
    P.rThigh.rotation.x = -1.5 * punch; P.rShin.rotation.x = 0.3;
    P.spine.rotation.x = 0.3 * punch;
    P.lUpper.rotation.x = 0.4 * punch; P.rUpper.rotation.x = 0.4 * punch;
    P.head.rotation.x = 0.25 * punch;
  }
  if (f.state === 'pin') {
    // kneeling cover beside the victim
    P.pelvis.position.y = 0.55 * HH;
    P.spine.rotation.x = 0.75;
    P.lUpper.rotation.x = -1.0; P.rUpper.rotation.x = -1.0;
    P.head.rotation.x = 0.4;
    P.lThigh.rotation.x = -0.9; P.rThigh.rotation.x = -0.9;
    P.lShin.rotation.x = 1.2; P.rShin.rotation.x = 1.2;
  }
  if (f.state === 'celebrate') {
    P.lUpper.rotation.z = 2.6 + Math.sin(t * 8) * 0.3;
    P.rUpper.rotation.z = -2.6 - Math.sin(t * 8) * 0.3;
    P.lFore.rotation.x = -0.3; P.rFore.rotation.x = -0.3;
    P.spine.rotation.z = Math.sin(t * 8) * 0.08;
    P.head.rotation.x = -0.25;
    P.group.position.y = f.pos.y + Math.abs(Math.sin(t * 6)) * 0.15;
  }
  // aerial whole-body rotation: 450 splashes flip 1¼ times in flight,
  // piledriver victims go fully upside-down, rana victims forward-flip.
  if (f.state === 'dive') {
    P.group.rotation.x = Math.min((f._diveT0 || 0) / 0.6, 1.15) * Math.PI * 2.5;
  } else if (f.state === 'victim' && f._victimAnim === 'piledriver') {
    P.group.rotation.x = lift * Math.PI;
  } else if (f.state === 'victim' && f._victimAnim === 'hurricanrana') {
    P.group.rotation.x = -lift * Math.PI * 1.1;
  }
  // ---- blend snapshot -> targets: this damping is the smoothness ----
  const busyFast = f.state === 'attack' || f.state === 'grapple' || f.state === 'victim' || f.state === 'dive';
  const sellSlow = f.state === 'down' || f.state === 'getup' || f.state === 'pin' || f.state === 'corner' ||
    f.state === 'pinned' || f.state === 'submit' || f.state === 'submitvictim' || f.state === 'celebrate';
  const s = Math.min(1, (busyFast ? 16 : sellSlow ? 7 : 11) * dt);
  for (const e of snap) {
    if (!e) continue;
    const o = e[0];
    o.rotation.x = e[1] + (o.rotation.x - e[1]) * s;
    o.rotation.y = e[2] + (o.rotation.y - e[2]) * s;
    o.rotation.z = e[3] + (o.rotation.z - e[3]) * s;
  }
  P.group.position.y = snapGY + (P.group.position.y - snapGY) * s;
  P.group.rotation.x = snapGRX + (P.group.rotation.x - snapGRX) * s;
  P.pelvis.position.y = snapPelY + (P.pelvis.position.y - snapPelY) * s;
  // breathing (applied after damping so it stays alive)
  P.torso.scale.set(1 + Math.sin(t * 3 + f.walkPhase) * 0.015, 1, 1);
}

// ---------- camera ----------

// ---------- camera ----------
function updateCamera(dt) {
  const p = player();
  let tx = 0, ty = 1.8, tz = 0;
  if (match.pin) {
    tx = (match.pin.att.pos.x + match.pin.vic.pos.x) / 2;
    ty = 1.6; tz = (match.pin.att.pos.z + match.pin.vic.pos.z) / 2;
  } else if (p && !camWide) {
    // bias toward nearest foe so both stay framed
    let bf = null, bd = 1e9;
    for (const f of fighters) {
      if (f === p || f.eliminated) continue;
      const d = Math.hypot(f.pos.x - p.pos.x, f.pos.z - p.pos.z);
      if (d < bd) { bd = d; bf = f; }
    }
    if (bf && bd < 12) { tx = lerp(p.pos.x, bf.pos.x, 0.3); tz = lerp(p.pos.z, bf.pos.z, 0.3); ty = 1.9; }
    else { tx = p.pos.x; tz = p.pos.z; }
  }
  camTarget.x = lerp(camTarget.x, tx, Math.min(1, 5 * dt));
  camTarget.y = lerp(camTarget.y, ty, Math.min(1, 5 * dt));
  camTarget.z = lerp(camTarget.z, tz, Math.min(1, 5 * dt));
  const slow = match.slowmo > 0 ? 0.55 : 1;
  const d = camDist * (camWide ? 1.7 : 1) * slow + (match.pin ? -2 : 0);
  const cx = camTarget.x + Math.sin(camYaw) * Math.cos(camPitch) * d;
  const cz = camTarget.z + Math.cos(camYaw) * Math.cos(camPitch) * d;
  const cy = camTarget.y + Math.sin(camPitch) * d;
  shakeAmt = Math.max(0, shakeAmt - dt * 2.2);
  const sh = shakeAmt * 0.35;
  camera.position.set(cx + rand(-sh, sh), Math.max(1.2, cy + rand(-sh, sh)), cz + rand(-sh, sh));
  camera.lookAt(camTarget);
}

// ---------- HUD ----------
let cardEls = [];
function buildCards() {
  const c = $('cards'); c.innerHTML = ''; cardEls = [];
  for (const f of fighters) {
    const d = document.createElement('div');
    d.className = 'pcard' + (f.isPlayer ? '' : '');
    d.innerHTML = `<div class="nm">${f.isPlayer ? '▶ ' : ''}${f.def.name}</div>
      <div class="sub ${f.def.align === 'FACE' ? 'face' : 'heel'}">${f.def.align} · ${f.def.finisher}</div>
      <div class="hpwrap"><div class="hp"></div></div>
      <div class="attwrap"><div class="att"></div></div>
      <div class="attlabel"><span>ATTITUDE</span><b class="attv"></b></div>`;
    c.appendChild(d);
    cardEls.push({ f, el: d, hp: d.querySelector('.hp'), att: d.querySelector('.att'), attv: d.querySelector('.attv') });
  }
}
function refreshCards() { /* values pulled in tick */ }
function tickCards() {
  for (const c of cardEls) {
    const hpFrac = clamp(c.f.hp / c.f.maxhp, 0, 1);
    c.hp.style.width = (hpFrac * 100).toFixed(1) + '%';
    c.hp.style.background = hpFrac > 0.5 ? '#37e05c' : hpFrac > 0.25 ? '#ffd23f' : '#e63946';
    c.att.style.width = c.f.att.toFixed(0) + '%';
    c.attv.textContent = c.f.att >= 100 ? '★ MAX — FINISHER (I) ★' : Math.round(c.f.att) + '%';
    c.el.classList.toggle('max', c.f.att >= 100);
  }
  $('heatfill').style.width = (match.heat * 100).toFixed(0) + '%';
  $('arenaName').textContent = ARENAS[match.arenaIdx].name;
  updatePadStat();
  // HCTP reversal prompt: flash when the player can reverse
  const rp = $('revPrompt');
  if (rp) {
    const p = player();
    const inc = p && p.incoming;
    const live = inc && performance.now() < inc.until && match.phase === 'fight' &&
      !p.eliminated && !['down', 'pinned', 'submit', 'submitvictim', 'pin', 'top', 'dive'].includes(p.state);
    if (live) {
      rp.classList.remove('hidden');
      $('revKind').textContent = inc.type === 'strike' ? 'LT / E' : inc.type === 'grapple' ? 'RT / R' : 'LT+RT / T';
    } else rp.classList.add('hidden');
  }
}
function fmtTime(s) { return `${String((s / 60) | 0).padStart(2, '0')}:${String((s | 0) % 60).padStart(2, '0')}`; }

// ---------- catalog / pause ----------
function catalogHTML() {
  const li = (arr) => arr.map((m) => `${m.name} <span style="opacity:.6">(${m.baseDamage ?? m.dmg})</span>`).join(' · ');
  const note = (t) => `<span style="opacity:.55;font-size:11px"> — ${t}</span>`;
  return `<b>STRIKES</b>${note('punches, kicks, chops & running lariats (arm out, neck/chest) to stagger foes')}<br>${li(MOVES.strikes)}<br>` +
    `<b>FRONT GRAPPLE</b>${note('facelocks & waistlocks: DDTs drive the head down, suplexes arch foes back-first, bombs sit them on your shoulders')}<br>${li(MOVES.front)}<br>` +
    `<b>BACK GRAPPLE</b>${note('attack from behind: waistlock Germans bridge for pins, back suplexes, sleeper drops')}<br>${li(MOVES.back)}<br>` +
    `<b>GROUND / DIVE</b>${note('stomps & drops on downed foes; top-rope moonsaults, 450° splashes (1¼ flips) & frog splashes')}<br>${li(MOVES.ground)} · ${li(MOVES.dive)}<br>` +
    `<b>SUBMISSIONS</b>${note('leg-laces & back compressors — applied center-ring, but near the ropes a rope break looms')}<br>${li(MOVES.submit)}<br>` +
    `<b>FINISHERS</b>${note('signature match-enders — ranas cradle for pins, spinebusters land you on top')}<br>${Object.entries(MOVES.finishers).map(([k, v]) => `${k} (${v.baseDamage ?? v.dmg})`).join(' · ')}`;
}
function toggleCatalog() {
  const p = $('pause');
  if ($('pause').classList.contains('hidden')) { $('pauseMoves').innerHTML = catalogHTML(); p.classList.remove('hidden'); }
  else p.classList.add('hidden');
}
function togglePause() {
  if (match.phase !== 'fight') return;
  const p = $('pause');
  if (p.classList.contains('hidden')) { $('pauseMoves').innerHTML = catalogHTML(); p.classList.remove('hidden'); }
  else p.classList.add('hidden');
}

// ---------- match setup ----------
function startMatch() {
  clearFighters();
  match.pin = null; match.winner = null; match.time = 0; match.heat = 0.5; match.slowmo = 0; match.id++;
  match.story = { phase: 'feeling', heat: 0, hope: 0, nearFalls: 0, lastBigT: -99, spam: 0, lastMove: '' };
  buildArena(match.arenaIdx);
  spawnWeapons();
  if (!ref) ref = makeRef();
  ref.x = 2; ref.z = 2;
  const n = match.mode === '1v1' ? 2 : match.mode === '3way' ? 3 : 4;
  // player + picks ensuring unique
  const order = [match.playerIdx];
  while (order.length < n) { const r = (Math.random() * ROSTER.length) | 0; if (!order.includes(r)) order.push(r); }
  const spots = [[-2, -1.5], [2, 1.5], [-2, 1.5], [2, -1.5]];
  order.forEach((ri, i) => spawnFighter(ROSTER[ri], spots[i][0], spots[i][1], i === 0));
  buildCards();
  match.phase = 'fight';
  $('menu').classList.add('hidden'); $('winScreen').classList.add('hidden'); $('pause').classList.add('hidden');
  announce('HERE WE GO!', `${ARENAS[match.arenaIdx].name} · ${match.mode.toUpperCase()}`);
  toast('No DQ, no count-out — EMPIRE RULES. Fill ATTITUDE, hit your FINISHER (I), pin with F!', 4200);
  updateTron('ATTITUDE EMPIRE', ARENAS[match.arenaIdx].name);
  audio.ensure(); audio.bell();
  camYaw = 0.6;
}

// ---------- menu wiring ----------
function buildMenu() {
  const grid = $('rosterGrid'); grid.innerHTML = '';
  ROSTER.forEach((w, i) => {
    const d = document.createElement('div');
    d.className = 'wcard' + (i === match.playerIdx ? ' sel' : '');
    d.innerHTML = `<div class="wn"><span class="dot" style="background:#${w.attire.toString(16).padStart(6, '0')}"></span>${w.name}</div>
      <div class="wk">${w.nick} · <span class="${w.align === 'FACE' ? 'face' : 'heel'}">${w.align}</span></div>
      <div class="bars">STR ${w.str} · SPD ${w.spd} · TGH ${w.tgh} · CHA ${w.cha}<br>★ ${w.finisher}</div>
      <div class="wk" style="margin-top:4px">${w.desc}</div>`;
    d.onclick = () => {
      match.playerIdx = i; audio.ensure(); audio.blip(600, 0.1, 'square', 0.1);
      grid.querySelectorAll('.wcard').forEach((el, j) => el.classList.toggle('sel', j === i));
    };
    grid.appendChild(d);
  });
  $('modeRow').querySelectorAll('.chip').forEach((ch) => {
    ch.onclick = () => {
      $('modeRow').querySelectorAll('.chip').forEach((c) => c.classList.remove('sel'));
      ch.classList.add('sel'); match.mode = ch.dataset.mode;
    };
  });
  $('arenaRow').querySelectorAll('.chip').forEach((ch) => {
    ch.onclick = () => {
      $('arenaRow').querySelectorAll('.chip').forEach((c) => c.classList.remove('sel'));
      ch.classList.add('sel'); match.arenaIdx = +ch.dataset.arena;
      buildArena(match.arenaIdx); // live preview behind menu
    };
  });
  $('moveCatalog').innerHTML = catalogHTML();
  $('startBtn').onclick = () => { audio.ensure(); startMatch(); };
  $('howBtn').onclick = () => $('how').classList.toggle('hidden');
  $('resumeBtn').onclick = () => $('pause').classList.add('hidden');
  $('quitBtn').onclick = () => { match.phase = 'menu'; $('pause').classList.add('hidden'); $('menu').classList.remove('hidden'); attract(); };
  $('muteBtn').onclick = (e) => { audio.ensure(); e.target.textContent = 'SOUND: ' + (audio.toggleMute() ? 'OFF' : 'ON'); };
  $('rematchBtn').onclick = () => startMatch();
  $('menuBtn').onclick = () => { match.phase = 'menu'; $('winScreen').classList.add('hidden'); $('menu').classList.remove('hidden'); attract(); };
}
function attract() {
  clearFighters(); match.pin = null;
  buildArena(match.arenaIdx); spawnWeapons();
  spawnFighter(ROSTER[0], -2, -1, false);
  spawnFighter(ROSTER[4], 2, 1, false);
  fighters[0].aiMove = { type: 'seek', x: 2, z: 1 };
  buildCards();
}

// ---------- main loop ----------
const clock = new THREE.Clock();
let cardT = 0;
let prevPadBtns = [];
addEventListener('gamepadconnected', (e) => {
  toast(`Gamepad on: HCTP layout — A strike, B grapple, Y run, LB finisher, LT/RT reversals`);
  audio.ensure();
  rumble(0.5, 0.3, 200);
});
addEventListener('gamepaddisconnected', () => {
  toast('Controller disconnected — keyboard active');
  prevPadBtns = []; padMenuPrev = [];
});
// Xbox rumble (Gamepad API dual-rumble; browsers can't touch XInput
// directly, so this is the web path to the same motors)
function rumble(strong = 0.6, weak = 0.3, ms = 120) {
  try {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const g of pads) {
      if (!g || !g.connected) continue;
      const act = g.vibrationActuator || (g.hapticActuators && g.hapticActuators[0]);
      if (act && act.playEffect) {
        const r = act.playEffect('dual-rumble', { strongMagnitude: strong, weakMagnitude: weak, duration: ms });
        if (r && r.catch) r.catch(() => {});
      }
    }
  } catch { /* noop */ }
}
function padName() {
  try {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const g of pads) {
      if (g && g.connected) return (g.id || 'PAD').slice(0, 26);
    }
  } catch { /* noop */ }
  return null;
}
function updatePadStat() {
  const el = $('padstat');
  if (!el) return;
  const n = padName();
  el.textContent = n ? `🎮 ${n}` : '🎮 NO PAD';
}
// Menu / win-screen pad buttons (fight inputs live in playerInput)
let padMenuPrev = [];
function padMenuTick() {
  try {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;
    for (const g of pads) { if (g && g.connected) { gp = g; break; } }
    const pressed = (i) => !!(gp && gp.buttons[i] && gp.buttons[i].pressed);
    const edge = (i) => pressed(i) && !padMenuPrev[i];
    if (gp) {
      if (!$('menu').classList.contains('hidden') && (edge(9) || edge(0))) { $('startBtn').click(); }
      else if (!$('winScreen').classList.contains('hidden') && (edge(9) || edge(0))) { $('rematchBtn').click(); }
      else if (!$('pause').classList.contains('hidden') && edge(9)) { $('resumeBtn').click(); }
    }
    padMenuPrev = gp ? gp.buttons.map((bb) => bb.pressed) : [];
  } catch { /* noop */ }
  updatePadStat();
}
function playerInput() {
  let x = 0, z = 0;
  if (keys['w'] || keys['arrowup']) { x -= Math.sin(camYaw); z -= Math.cos(camYaw); }  if (keys['s'] || keys['arrowdown']) { x += Math.sin(camYaw); z += Math.cos(camYaw); }
  if (keys['a'] || keys['arrowleft']) { x -= Math.cos(camYaw); z += Math.sin(camYaw); }
  if (keys['d'] || keys['arrowright']) { x += Math.cos(camYaw); z -= Math.sin(camYaw); }
  let run = !!(keys['shift'] || keys['r'] || keys['l']);
  // touch joystick (screen-relative -> camera-relative; pushed to edge = run)
  if (touchMove.mag > 0.15) {
    const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
    const rx = Math.cos(camYaw), rz = -Math.sin(camYaw);
    x += fx * -touchMove.y + rx * touchMove.x;
    z += fz * -touchMove.y + rz * touchMove.x;
    if (touchMove.mag > 0.85) run = true;
  }
  if (touchRun) run = true;
  // gamepad: left stick move, right stick camera, full button map
  try {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null;
    for (const g of pads) { if (g && g.connected) { gp = g; break; } }
    if (gp) {
      const ax = gp.axes[0] || 0, az = gp.axes[1] || 0;
      if (Math.hypot(ax, az) > 0.2) {
        const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
        const rx = Math.cos(camYaw), rz = -Math.sin(camYaw);
        x += fx * -az + rx * ax; z += fz * -az + rz * ax;
      }
      const cx = gp.axes[2] || 0, cy = gp.axes[3] || 0;
      if (Math.hypot(cx, cy) > 0.25) {
        camYaw -= cx * 0.06; camPitch = clamp(camPitch + cy * 0.03, 0.08, 1.2);
      }
      const b = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
      const edge = (i) => b(i) && !prevPadBtns[i];
      // HCTP stick direction at press time -> grapple category / finisher select
      const stickDir = () => {
        const sx = gp.axes[0] || 0, sy = gp.axes[1] || 0;
        if (Math.hypot(sx, sy) < 0.4) return { dx: 0, dz: 0, mag: 0 };
        return { dx: sx, dz: sy, mag: Math.hypot(sx, sy) };
      };
      const padCat = () => {
        const { dx, dz, mag } = stickDir();
        if (mag < 0.4) return null; // centered = Irish whip
        if (Math.abs(dz) >= Math.abs(dx)) return dz < 0 ? 'power' : 'sub';
        return dx > 0 ? 'quick' : 'sig';
      };
      const p = match.phase === 'fight' ? player() : null;
      if (p && !p.eliminated) {
        if (edge(0)) doStrike(p);                          // A (=PS X): strike
        if (edge(1)) { const c = padCat();                 // B (=PS O): grapple / whip
          if (c) doGrapple(p, c); else doWhip(p); }
        if (edge(2)) { const s = stickDir();                // X (=PS Square): weapon / traverse
          if (s.mag > 0.4) weaponOrTraverse(p, s.dx, s.dz); else pickupWeapon(p); }
        if (edge(3)) { const s = stickDir();                // Y (=PS Triangle): tap = context action
          if (s.mag > 0.4) contextAction(p, s.dx, s.dz); }
        if (b(3)) run = true;                              // Y held: run
        if (edge(4)) { const s = stickDir();                // LB (=PS L1): finisher / 2nd
          doFinisher(p, s.mag > 0.4); }
        if (edge(5)) cycleFocus(p);                        // RB (=PS R1): change focus
        if (edge(6)) tryRev(p, 'strike');                  // LT (=PS L2): strike reversal
        if (edge(7)) tryRev(p, 'grapple');                 // RT (=PS R2): grapple reversal
        if (b(6) && b(7) && (edge(6) || edge(7))) tryRev(p, 'finisher'); // LT+RT: finisher reversal
        if (edge(12)) spaceAction(p);                      // D-up: climb/dive/getup
      }
      if (edge(9)) togglePause();                 // Start: pause
      if (edge(8)) toggleCatalog();               // Back/Select: move list
      prevPadBtns = gp.buttons.map((bb) => bb.pressed);
    }
  } catch { /* noop */ }
  return { x, z, run };
}

function tick() {
  requestAnimationFrame(tick);
  let dt = Math.min(0.05, clock.getDelta());
  if (match.slowmo > 0) { match.slowmo -= dt; dt *= 0.35; }
  const t = performance.now() * 0.001;

  if (match.phase === 'fight') {
    match.time += dt;
    if (match.time >= match.timeLimit) { // time-limit draw -> highest HP wins
      const w = [...fighters].sort((a, b) => b.hp - a.hp)[0];
      endMatch(w, null, 'decision');
    }
    $('clock').textContent = fmtTime(Math.max(0, match.timeLimit - match.time));
    const inp = playerInput();
    for (const f of fighters) {
      if (f.eliminated) continue;
      if (!f.isPlayer) aiControl(f, dt);
      stepFighter(f, dt, f.isPlayer ? inp : null);
    }
    // soft body collision — wrestlers can't walk through each other (DoR feel).
    // Downed bodies hold their ground; the standing wrestler walks around.
    for (let i = 0; i < fighters.length; i++) {
      for (let j = i + 1; j < fighters.length; j++) {
        const a = fighters[i], b = fighters[j];
        if (a.eliminated || b.eliminated) continue;
        if (Math.abs(a.pos.y - b.pos.y) > 1.2) continue;
        const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz), min = 0.75;
        if (d < min && d > 0.0001) {
          const nx = dx / d, nz = dz / d, overlap = min - d;
          const aDown = isDown(a) || a.state === 'pin' || a.state === 'submit';
          const bDown = isDown(b) || b.state === 'pin' || b.state === 'submit';
          if (aDown && !bDown) { b.pos.x += nx * overlap; b.pos.z += nz * overlap; }
          else if (bDown && !aDown) { a.pos.x -= nx * overlap; a.pos.z -= nz * overlap; }
          else { a.pos.x -= nx * overlap / 2; a.pos.z -= nz * overlap / 2; b.pos.x += nx * overlap / 2; b.pos.z += nz * overlap / 2; }
        }
      }
    }
    updatePin(dt);
    // KO rule for multi-way: hp<=0 stays down 8s then eliminated? keep pin-only; sudden: hp 0 + down 6s = KO loss
    for (const f of fighters) {
      if (!f.eliminated && f.hp <= 0 && f.state === 'down' && f.downT > 5 && match.mode !== '1v1') {
        f.eliminated = true; f.state = 'down';
        announce('ELIMINATED!', f.def.name); audio.bell();
        const left = fighters.filter((x) => !x.eliminated);
        if (left.length === 1) { endMatch(left[0], f, 'elimination'); }
      }
    }
    // ref idle drift
    if (ref && !match.pin) {
      const cx = (fighters[0]?.pos.x || 0) * 0.3, cz = (fighters[0]?.pos.z || 0) * 0.3;
      ref.x = lerp(ref.x, clamp(cx + 2.5, -3, 3), dt);
      ref.z = lerp(ref.z, clamp(cz + 2.5, -3, 3), dt);
      ref.mesh.position.set(ref.x, groundHeight(ref.x, ref.z), ref.z);
    }
    // heat decay + audio; ring-mat spring decay + light response
    match.heat = clamp(match.heat - dt * 0.02, 0.12, 1);
    matImpact = Math.max(0, matImpact - dt * 3.2);
    key.intensity = 1.6 - matImpact * 0.45;
    spotGold.intensity = 180 - matImpact * 60;
    audio.setHeat(match.heat);
    cardT -= dt; if (cardT <= 0) { cardT = 0.15; tickCards(); }
  } else {
    // attract-mode AI brawl behind menu
    for (const f of fighters) {
      if (f.eliminated) continue;
      aiControl(f, dt);
      stepFighter(f, dt, null);
      if (f.hp <= 0) { f.hp = f.maxhp; f.state = 'idle'; }
    }
    const a = t * 0.12;
    if (dragId === null && match.phase === 'menu') camYaw = a;
    padMenuTick(); // Start/A on pad works in menus + win screen
  }

  // weapons flying physics
  for (const w of weapons) {
    if (w.cool > 0) w.cool -= dt;
    if (w.state === 'flying') {
      w.vel.y -= 20 * dt;
      w.mesh.position.addScaledVector(w.vel, dt);
      w.mesh.rotation.x += w.spin * dt;
      const gh = 0.3;
      // hit fighters?
      if (w.cool < 1.2) {
        for (const f of fighters) {
          if (f.eliminated || (w.holder === f)) continue;
          if (f.weapon === w) continue;
          const d = Math.hypot(f.pos.x - w.mesh.position.x, f.pos.z - w.mesh.position.z);
          const h = Math.abs((f.pos.y + 1.2) - w.mesh.position.y);
          if (d < 1.0 && h < 1.4) {
            applyDamage(f, 11, null, { kb: 4, from: w.mesh.position, down: true, downTime: 2.4 });
            toast(`Flying ${w.kind} hits ${f.def.name}!`);
            w.state = 'ground'; w.vel.set(0, 0, 0);
            break;
          }
        }
      }
      if (w.mesh.position.y <= gh && w.state === 'flying') {
        w.mesh.position.y = gh; w.state = 'ground';
        w.mesh.rotation.x = 0;
        burst(w.mesh.position.clone(), 0xaaaaaa, 5, 3);
      }
    }
  }

  // crowd jump (bodies + heads share matrices)
  if (arena.crowd) {
    const dummy = new THREE.Object3D();
    const n = arena.crowdData.length;
    for (let i = 0; i < n; i++) {
      const c = arena.crowdData[i];
      const j = Math.abs(Math.sin(t * (3 + match.heat * 5) + c.phase)) * (0.08 + match.heat * 0.55);
      dummy.position.set(c.x, c.y + j, c.z); dummy.rotation.set(0, c.ry, 0);
      dummy.updateMatrix();
      arena.crowd.setMatrixAt(i, dummy.matrix);
      arena.crowdHeads?.setMatrixAt(i, dummy.matrix);
    }
    arena.crowd.instanceMatrix.needsUpdate = true;
    if (arena.crowdHeads) arena.crowdHeads.instanceMatrix.needsUpdate = true;
  }

  updateSparks(dt);
  updateCamera(dt);
  renderer.render(scene, camera);
}

// ---------- boot ----------
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
buildArena(0);
ref = makeRef();
spawnWeapons();
buildMenu();
attract();
tick();
$('loading').style.display = 'none';
window.__empireBooted = true;
window.__empire = { match, fighters: () => fighters, startMatch, touchMove, showTouchUI, touchAct, version: '1.1' };
// auto-start for captures / screenshots (?fight, ?autostart)
if (/autostart|fight|screenshot/i.test(location.search)) {
  match.playerIdx = 0; match.mode = '1v1'; match.arenaIdx = 0;
  startMatch();
}
