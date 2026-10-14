import * as THREE from 'three';
import { ROSTER, MOVES, ARENAS, TUNING, WEAPONS, powerGrade, moveFeature, moveKO, moveBleed } from './data.js';
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
import { CLIPS, sampleClip, playClip, slamClipFor, soldClipFor, strikeClipFor, liftClipFor, hoistClipFor, CARRY_ANCHORS } from './animClips.js';

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
const RING_TOP = 1.0, APRON_HALF = 4.0, ROPE = 3.55, APRON_EDGE = 4.3;
// ---------- elastic ropes (model adapted from VirtualProGrappler RingRopes,
// GPL-3.0 chaotix610/VirtualProGrappler: one damped-harmonic spring per wall,
// bow shape sin(pi*s) pinned at the posts, middle strand weighted 1.0)
const ROPE_K = 160, ROPE_C = 9, ROPE_IMP = 0.6, ROPE_MAXBOW = 0.38, ROPE_GIVE = 0.22;
const ROPE_HIT_T = 0.55, ROPE_TURN = 8, REBOUND_MULT = 1.05; // heavy ropes: long lean, soft return
const ropeSpr = { px: { x: 0, v: 0 }, nx: { x: 0, v: 0 }, pz: { x: 0, v: 0 }, nz: { x: 0, v: 0 } };
function ropeImpact(wall, speed) { const s = ropeSpr[wall]; if (s) s.v += speed * ROPE_IMP; }
function runSpeedOf(f) {
  const gasPace = f.gasState === 'gassed' ? 0.55 : f.gasState === 'winded' ? 0.8 : 1;
  const legHurt = (f.limb && f.limb.leg || 0) / 100;
  return (2.1 + f.def.spd * 0.16) * TUNING.runPace * (1 - 0.25 * (f.fatigue || 0)) * (1 - 0.35 * legHurt) * gasPace;
}
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
  // ring platform + narrow apron ledge outside the ropes, then the floor
  if (Math.abs(x) <= APRON_EDGE && Math.abs(z) <= APRON_EDGE) return RING_TOP;
  // walkable entrance ramp: stage front (z=-14.6, y=1.05) down to ringside (z=-5.2, y=0.05)
  if (Math.abs(x) < 1.7 && z <= -5.0 && z >= -14.8) {
    const r = (-5.2 - z) / 9.4;
    return 0.05 + clamp(r, 0, 1) * 1.0;
  }
  // stage platform top (brawl up the ramp onto the stage)
  if (Math.abs(x) <= 9 && z < -14.2 && z >= -19.8) return 1.1;
  return 0;
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
    { mat: 0x101018, skirt: 0xc8a018, rope: [0xc02030, 0xffffff, 0x2040c0], floor: 0x14141c, glow: 0xffd23f, name: 'WRESTLEMANIA 2000', glb: 'assets/wm2000.glb', shell: { scale: 1, y: 0 } },
  ];
  const th = themes[themeIdx] || themes[0];
  arena.theme = themeIdx;
  arena.shell = null; // dropped GLB dome goes here when theme 3 loads
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
  // elastic ropes: 7-segment strands on per-wall damped springs (VPG model).
  // Segments are re-posed each frame from the spring bow; no geometry rebuilds.
  arena.ropes = []; arena.ropeTies = [];
  for (const k of Object.keys(ropeSpr)) { ropeSpr[k].x = 0; ropeSpr[k].v = 0; }
  const ropeH = [1.62, 1.98, 2.32];
  const SEG = 7;
  const UP = new THREE.Vector3(0, 1, 0);
  const mkRope = (wall, fixed, heightIdx, alongZ, ox, oz) => {
    const rm = new THREE.MeshStandardMaterial({ color: th.rope[heightIdx], roughness: 0.5 });
    const y = ropeH[heightIdx];
    const segLen = (ROPE * 2) / (SEG - 1) * 1.18;
    const geo = new THREE.CylinderGeometry(0.035, 0.035, segLen, 8);
    const segs = [];
    for (let i = 0; i < SEG - 1; i++) {
      const r = new THREE.Mesh(geo, rm);
      G.add(r); segs.push(r);
    }
    arena.ropes.push({ wall, fixed, y, alongZ, ox, oz, segs, weight: heightIdx === 1 ? 1.0 : 0.7, settled: false, _up: UP });
  };
  mkRope('nz', -ROPE, 0, true, 0, -1); mkRope('pz', ROPE, 0, true, 0, 1);
  mkRope('nx', -ROPE, 0, false, -1, 0); mkRope('px', ROPE, 0, false, 1, 0);
  mkRope('nz', -ROPE, 1, true, 0, -1); mkRope('pz', ROPE, 1, true, 0, 1);
  mkRope('nx', -ROPE, 1, false, -1, 0); mkRope('px', ROPE, 1, false, 1, 0);
  mkRope('nz', -ROPE, 2, true, 0, -1); mkRope('pz', ROPE, 2, true, 0, 1);
  mkRope('nx', -ROPE, 2, false, -1, 0); mkRope('px', ROPE, 2, false, 1, 0);
  // rope spacers (white ties mid-span, WWE authentic) — ride the middle-strand bow
  const tieM = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 });
  for (const off of [-1.2, 1.2]) {
    const defs = [
      { x: off, z: -ROPE, wall: 'nz', ox: 0, oz: -1 }, { x: off, z: ROPE, wall: 'pz', ox: 0, oz: 1 },
      { x: -ROPE, z: off, wall: 'nx', ox: -1, oz: 0 }, { x: ROPE, z: off, wall: 'px', ox: 1, oz: 0 },
    ];
    for (const d of defs) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.75, 0.07), tieM);
      tie.position.set(d.x, 1.97, d.z); G.add(tie);
      arena.ropeTies.push({ mesh: tie, baseX: d.x, baseZ: d.z, wall: d.wall, ox: d.ox, oz: d.oz, s: (off + ROPE) / (ROPE * 2) });
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
  const plat = new THREE.Mesh(new THREE.BoxGeometry(18, 1.1, 5.5),
    new THREE.MeshStandardMaterial({ color: 0x14141c, roughness: 0.5 }));
  plat.position.set(0, 0.55, -17.0); plat.receiveShadow = true; stage.add(plat);
  const stageSkirt = new THREE.Mesh(new THREE.PlaneGeometry(18, 1.0),
    new THREE.MeshStandardMaterial({ map: skirtTex, roughness: 0.7 }));
  stageSkirt.position.set(0, 0.55, -14.24); stage.add(stageSkirt);
  // backdrop pillars + beam
  const pillarM = new THREE.MeshStandardMaterial({ color: 0x0c0c14, roughness: 0.4 });
  for (const px of [-8.2, 8.2]) {
    const pil = new THREE.Mesh(new THREE.BoxGeometry(1.6, 9.0, 1.6), pillarM);
    pil.position.set(px, 4.5, -19.0); stage.add(pil);
    const side = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 5.0),
      new THREE.MeshBasicMaterial({ map: ttex }));
    side.position.set(px, 5.2, -18.15); stage.add(side);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(18.4, 1.2, 1.4), pillarM);
  beam.position.set(0, 9.2, -19.0); stage.add(beam);
  // main titantron
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.5, 6.4),
    new THREE.MeshBasicMaterial({ map: ttex }));
  screen.position.set(0, 5.4, -19.15); stage.add(screen);
  const glowStrip = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.16, 0.16),
    new THREE.MeshBasicMaterial({ color: th.glow }));
  glowStrip.position.set(0, 8.4, -18.3); stage.add(glowStrip);
  // truss arch over stage
  const trussM = new THREE.MeshStandardMaterial({ color: 0x2a2a35, metalness: 0.6, roughness: 0.4 });
  for (const px of [-8.2, 8.2]) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 8, 8), trussM);
    col.position.set(px, 4.0, -15.2); stage.add(col);
  }
  const arch = new THREE.Mesh(new THREE.BoxGeometry(17.0, 0.55, 0.55), trussM);
  arch.position.set(0, 8.0, -15.2); stage.add(arch);
  updateTron('ATTITUDE EMPIRE', ARENAS[themeIdx]?.name || '');
  // LONG ramp: stage front all the way to ringside, through the barricade gap.
  // Walkable surface: groundHeight() matches this slope so brawls go up the ramp.
  const rampLen = 9.8, rampAng = Math.atan2(1.0, 9.4);
  const ramp = new THREE.Group(); ramp.position.set(0, 0.55, -9.9); ramp.rotation.x = rampAng; G.add(ramp);
  const rampTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, rampLen),
    new THREE.MeshStandardMaterial({ color: 0x1c1c26, roughness: 0.7 }));
  rampTop.receiveShadow = true; ramp.add(rampTop);
  for (const ex of [-1.65, 1.65]) {
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, rampLen),
      new THREE.MeshBasicMaterial({ color: th.glow }));
    edge.position.set(ex, 0.1, 0); ramp.add(edge);
  }
  const rampLogo = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3),
    new THREE.MeshStandardMaterial({ map: stickerTex, roughness: 0.6 }));
  rampLogo.rotation.x = -Math.PI / 2; rampLogo.position.y = 0.08; ramp.add(rampLogo);
  // ramp support legs (it spans open floor now)
  const legM = new THREE.MeshStandardMaterial({ color: 0x23232e, roughness: 0.5 });
  for (const lz of [-3.2, 0, 3.2]) {
    for (const lx of [-1.5, 1.5]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.0, 0.18), legM);
      leg.position.set(lx, -0.35 - lz * Math.tan(rampAng) * 0.5, lz);
      leg.scale.y = Math.max(0.2, 1 - Math.abs(lz) * 0.12);
      ramp.add(leg);
    }
  }

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
  /* ===== COLLISION WALLS — ring skirt, barricades, stage sides =====
     Mat is floor, sides are walls. Whipped or sprinting into them hurts. */
  {
    const W = [];
    const seg = (x1, z1, x2, z2, tag, maxY) => W.push({ x1, z1, x2, z2, tag, maxY });
    const R = 4.2; // ring base footprint (only a wall at floor level)
    seg(-R, -R, R, -R, 'ring', 0.9); seg(-R, R, R, R, 'ring', 0.9);
    seg(-R, -R, -R, R, 'ring', 0.9); seg(R, -R, R, R, 'ring', 0.9);
    const BB = 9.4; // barricade square (ramp gap on -z)
    seg(-BB, BB, BB, BB, 'barricade', 1.0);
    seg(-BB, -BB, -2.6, -BB, 'barricade', 1.0); seg(2.6, -BB, BB, -BB, 'barricade', 1.0);
    seg(-BB, -BB, -BB, BB, 'barricade', 1.0); seg(BB, -BB, BB, BB, 'barricade', 1.0);
    seg(-9, -14.2, -9, -19.8, 'stage', 1.0); seg(9, -14.2, 9, -19.8, 'stage', 1.0); // stage flanks
    arena.walls = W;
  }
  // WM2000 dome: async GLB shell around our gameplay ring (fails soft)
  if (th.glb) loadArenaShell(themeIdx, th);
}

// ---------- external arena shell (Sketchfab dome, user-supplied GLB) ----------
// The GLB is pure scenery: our ring, ropes, physics and gameplay coordinates
// never change. Exposed as window.__arenaShell so scale/offset can be tuned
// live once the file lands in assets/.
function loadArenaShell(themeIdx, th) {
  toast('Loading the Dome…');
  import('../vendor/GLTFLoader.js').then(({ GLTFLoader }) => {
    if (arena.theme !== themeIdx) return; // user switched away mid-load
    new GLTFLoader().load(th.glb,
      (gltf) => {
        if (arena.theme !== themeIdx) return;
        if (arena.shell) { arena.group.remove(arena.shell); arena.shell = null; }
        const shell = gltf.scene;
        const cfg = th.shell || {};
        shell.scale.setScalar(cfg.scale || 1);
        shell.position.set(cfg.x || 0, cfg.y || 0, cfg.z || 0);
        shell.traverse((n) => { if (n.isMesh) { n.receiveShadow = true; } });
        arena.group.add(shell); arena.shell = shell;
        window.__arenaShell = shell;
        toast('WRESTLEMANIA 2000 dome loaded!');
      },
      undefined,
      (err) => {
        console.warn('[arena] shell failed:', err && err.message ? err.message : err);
        if (arena.theme === themeIdx) toast('Dome file not found — classic arena instead. Drop it in assets/wm2000.glb.');
      });
  }).catch((err) => {
    console.warn('[arena] loader missing:', err);
  });
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
const tackPiles = []; // scattered thumbtack traps {x,z,r,life,mesh}
// scatter thumbtacks underfoot: the box is consumed, the pile bites steppers
function scatterTacks(att) {
  const w = att.weapon;
  if (!w || w.kind !== 'tacks') return;
  // AI doesn't do subtle: it just chucks the box at someone
  if (!att.isPlayer) { throwWeapon(att); return; }
  att.weapon = null; w.broken = true; scene.remove(w.mesh);
  att.cool = 0.6; att.state = 'attack'; att.stateT = 0.4; att.anim = 'chop';
  const g = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0xd0d5dd, metalness: 0.9, roughness: 0.2 });
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2, r = 0.25 + (i % 3) * 0.35;
    const tack = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 6), steel);
    tack.position.set(att.pos.x + Math.cos(a) * r, 0.04, att.pos.z + Math.sin(a) * r);
    g.add(tack);
  }
  scene.add(g);
  tackPiles.push({ x: att.pos.x, z: att.pos.z, r: 1.3, life: 25, mesh: g });
  burst(new THREE.Vector3(att.pos.x, 0.4, att.pos.z), 0xd0d5dd, 10, 4);
  audio.blip(1200, 0.15, 'square', 0.08);
  toast('THUMBTACKS scattered! Watch the mat!');
  announce('THUMBTACKS!', `${att.def.name} goes hardcore!`);
}
function stepTacks(dt) {
  for (let i = tackPiles.length - 1; i >= 0; i--) {
    const p = tackPiles[i];
    p.life -= dt;
    if (p.life <= 0) { scene.remove(p.mesh); tackPiles.splice(i, 1); continue; }
    for (const f of fighters) {
      if (f.eliminated || f.pos.y > 0.5) continue;
      f._tackCool = Math.max(0, (f._tackCool || 0) - dt);
      if (f._tackCool > 0) continue;
      if (Math.hypot(f.pos.x - p.x, f.pos.z - p.z) < p.r) {
        f._tackCool = 1.2;
        applyDamage(f, 2, null, { kb: 0.4, from: new THREE.Vector3(p.x, 0, p.z), sfx: 'hit' });
        burst(new THREE.Vector3(f.pos.x, 0.3, f.pos.z), 0xff4040, 6, 3);
        audio.blip(1500, 0.1, 'square', 0.1);
        if (f.isPlayer) toast('TACKS! Your feet are shredded!');
      }
    }
  }
}
function makeChair() {
  // steel folding chair: X-frame legs, slatted seat + backrest, chrome tubes
  const g = new THREE.Group();
  const chrome = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, metalness: 0.85, roughness: 0.3 });
  const padM = new THREE.MeshStandardMaterial({ color: 0x2a2d36, metalness: 0.2, roughness: 0.6 });
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.44), padM);
  seat.position.y = 0.46; seat.castShadow = true; seat.name = 'seat'; g.add(seat);
  for (const s of [-1, 1]) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.045), padM);
    slat.position.set(0, 0.72 + (s > 0 ? 0.13 : 0), -0.21); slat.name = 'slat'; g.add(slat);
    for (const px of [-0.19, 0.19]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 8), chrome);
      post.position.set(px, 0.72, -0.21); g.add(post);
    }
  }
  for (const s of [-1, 1]) {
    for (const sz of [-1, 1]) {
      // X-frame: two crossed tubes per side
      const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.62, 8), chrome);
      t1.position.set(s * 0.19, 0.23, 0); t1.rotation.x = sz * 0.55; g.add(t1);
      const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.62, 8), chrome);
      t2.position.set(s * 0.19, 0.23, 0); t2.rotation.x = -sz * 0.55; g.add(t2);
    }
  }
  const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6), chrome);
  brace.rotation.z = Math.PI / 2; brace.position.y = 0.18; g.add(brace);
  return g;
}
function makeLadder() {
  // tall aluminum ladder: rails + rungs, stands on its own ringside
  const g = new THREE.Group();
  const alu = new THREE.MeshStandardMaterial({ color: 0x9aa0aa, metalness: 0.8, roughness: 0.35 });
  for (const s of [-1, 1]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 3.4, 0.07), alu);
    rail.position.set(s * 0.3, 1.7, 0); rail.castShadow = true; g.add(rail);
  }
  for (let i = 0; i < 8; i++) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.56, 8), alu);
    rung.rotation.z = Math.PI / 2; rung.position.set(0, 0.3 + i * 0.4, 0); g.add(rung);
  }
  for (const s of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.4), alu);
    foot.position.set(s * 0.3, 0.03, 0); g.add(foot);
  }
  return g;
}
// ---------- hardcore arsenal meshes (all lie on the ground, ~1m scale) ----------
function wmat(color, metalness = 0.3, roughness = 0.6) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness });
}
function layFlat(m, len) {
  // lay a tall-built weapon on its side so it rests on the mat
  m.rotation.z = Math.PI / 2; m.position.y = 0.12;
  const g = new THREE.Group(); g.add(m); return g;
}
function makeKendo() {
  const g = new THREE.Group();
  const bamboo = wmat(0xc8a25e, 0, 0.8), wrap = wmat(0x1a1a22, 0, 0.9);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.85, 8), bamboo);
  shaft.position.y = 0.55; shaft.castShadow = true; g.add(shaft);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.3, 8), wrap);
  grip.position.y = 0.15; g.add(grip);
  const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 12), wrap);
  guard.position.y = 0.31; g.add(guard);
  return layFlat(g);
}
function makeSign() {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), wmat(0x555560, 0.7, 0.4));
  pole.position.y = 0.55; pole.castShadow = true; g.add(pole);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 8), wmat(0xb02020, 0.2, 0.5));
  face.position.y = 1.25; g.add(face);
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.045, 8), wmat(0xe8e8e8, 0.1, 0.5));
  inner.position.y = 1.25; g.add(inner);
  return layFlat(g);
}
function makeCan() {
  const g = new THREE.Group();
  const steel = wmat(0xa8adb5, 0.85, 0.3);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.27, 0.72, 14), steel);
  body.position.y = 0.36; body.castShadow = true; g.add(body);
  for (const ry of [0.12, 0.36, 0.6]) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.295, 0.015, 6, 20), steel);
    rib.rotation.x = Math.PI / 2; rib.position.y = ry; g.add(rib);
  }
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 6, 20), steel);
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.72; g.add(rim);
  return g;
}
function makeLid() {
  const g = new THREE.Group();
  const steel = wmat(0xb8bdc5, 0.85, 0.3);
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 16), steel);
  disc.position.y = 0.05; disc.castShadow = true; g.add(disc);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.04), steel);
  grip.position.y = 0.1; g.add(grip);
  return g;
}
function makePipe() {
  const g = new THREE.Group();
  const steel = wmat(0x8a8f99, 0.9, 0.25);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 10), steel);
  shaft.position.y = 0.5; shaft.castShadow = true; g.add(shaft);
  const elbow = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.05, 8, 12, Math.PI / 2), steel);
  elbow.position.y = 0.9; g.add(elbow);
  const stub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.25, 10), steel);
  stub.rotation.z = Math.PI / 2; stub.position.set(0.18, 1.02, 0); g.add(stub);
  return layFlat(g);
}
function makeBat() {
  const g = new THREE.Group();
  const wood = wmat(0x9c6b3c, 0, 0.7), dark = wmat(0x3a2a18, 0, 0.8);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.032, 0.7, 10), wood);
  barrel.position.y = 0.6; barrel.castShadow = true; g.add(barrel);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8), dark);
  handle.position.y = 0.15; g.add(handle);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 8), dark);
  knob.position.y = 0.02; g.add(knob);
  return layFlat(g);
}
function makeBarbedBat() {
  const g = makeBat().children[0];
  const wire = wmat(0x555560, 0.8, 0.35);
  const wrap = new THREE.Group();
  wrap.add(g);
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 12), wire);
    ring.position.y = 0.4 + i * 0.14; ring.rotation.x = 0.2 * i; wrap.add(ring);
    for (let k = 0; k < 3; k++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.06, 6), wire);
      const a = (k / 3) * Math.PI * 2 + i;
      spike.position.set(Math.cos(a) * 0.07, 0.4 + i * 0.14, Math.sin(a) * 0.07);
      spike.rotation.z = -Math.cos(a) * 1.2; spike.rotation.x = Math.sin(a) * 1.2;
      wrap.add(spike);
    }
  }
  const outer = new THREE.Group(); outer.add(wrap);
  outer.rotation.z = Math.PI / 2; outer.position.y = 0.12;
  return outer;
}
function makeSledge() {
  const g = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.95, 8), wmat(0x7a5230, 0, 0.8));
  handle.position.y = 0.5; handle.castShadow = true; g.add(handle);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.3), wmat(0x4a4e55, 0.85, 0.3));
  head.position.y = 1.0; g.add(head);
  return layFlat(g);
}
function makeExtinguisher() {
  const g = new THREE.Group();
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 12), wmat(0xc01818, 0.4, 0.4));
  tank.position.y = 0.25; tank.castShadow = true; g.add(tank);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.1, 8), wmat(0xcccccc, 0.8, 0.3));
  top.position.y = 0.55; g.add(top);
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 10), wmat(0x141418, 0.2, 0.7));
  horn.position.set(0.12, 0.55, 0); horn.rotation.z = -1.1; g.add(horn);
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.2, 0.005), wmat(0xf0f0f0, 0, 0.6));
  label.position.set(0, 0.28, 0.12); g.add(label);
  return g;
}
function makeChain() {
  const g = new THREE.Group();
  const steel = wmat(0x9aa0aa, 0.9, 0.25);
  for (let i = 0; i < 7; i++) {
    const link = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 6, 12), steel);
    link.position.set(i * 0.085, 0.06, Math.sin(i * 1.2) * 0.02);
    link.rotation.y = (i % 2) * Math.PI / 2;
    if (i === 0) link.castShadow = true;
    g.add(link);
  }
  return g;
}
function makeKnuckles() {
  const g = new THREE.Group();
  const brass = wmat(0xc8a020, 0.9, 0.3);
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.012, 6, 12), brass);
    ring.position.set(-0.06 + i * 0.04, 0.05, 0);
    if (i === 0) ring.castShadow = true;
    g.add(ring);
  }
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.02, 0.03), brass);
  bar.position.y = 0.015; g.add(bar);
  return g;
}
function makeMic() {
  const g = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.4, 8), wmat(0x141418, 0.3, 0.6));
  handle.position.y = 0.2; handle.castShadow = true; g.add(handle);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), wmat(0x2a2a30, 0.1, 0.9));
  head.position.y = 0.46; g.add(head);
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), wmat(0x111116, 0.2, 0.6));
  band.position.y = 0.36; g.add(band);
  return layFlat(g);
}
function makeBell() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.3), wmat(0x1a1a20, 0.3, 0.6));
  base.position.y = 0.025; base.castShadow = true; g.add(base);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), wmat(0xd8b020, 0.9, 0.25));
  dome.position.y = 0.05; g.add(dome);
  const nub = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8), wmat(0x888880, 0.8, 0.3));
  nub.position.y = 0.22; g.add(nub);
  return g;
}
function makeBlock() {
  const g = new THREE.Group();
  const conc = wmat(0x9a9a98, 0, 0.9);
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.2), conc);
  body.position.y = 0.1; body.castShadow = true; g.add(body);
  for (const hx of [-0.1, 0.1]) {
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.21, 0.12), wmat(0x3a3a38, 0, 1));
    hole.position.set(hx, 0.1, 0); g.add(hole);
  }
  return g;
}
function makeTacks() {
  const g = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.18), wmat(0x8a5a30, 0, 0.8));
  box.position.y = 0.05; box.castShadow = true; g.add(box);
  const steel = wmat(0xd0d5dd, 0.9, 0.2);
  for (let i = 0; i < 7; i++) {
    const tack = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.05, 6), steel);
    tack.position.set(-0.09 + (i % 4) * 0.06, 0.12, i < 4 ? -0.04 : 0.05);
    g.add(tack);
  }
  return g;
}
function makeBelt() {
  const g = new THREE.Group();
  const strap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.02), wmat(0x141418, 0.1, 0.7));
  strap.position.y = 0.06; strap.castShadow = true; g.add(strap);
  const gold = wmat(0xd8a818, 0.95, 0.2);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.025, 16), gold);
  plate.rotation.x = Math.PI / 2; plate.position.y = 0.06; g.add(plate);
  for (const s of [-1, 1]) {
    const side = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.025, 12), gold);
    side.rotation.x = Math.PI / 2; side.position.set(s * 0.2, 0.06, 0); g.add(side);
  }
  return g;
}
const WEAPON_BUILDERS = {
  chair: makeChair, kendo: makeKendo, sign: makeSign, can: makeCan, lid: makeLid,
  pipe: makePipe, bat: makeBat, barbed: makeBarbedBat, sledge: makeSledge,
  extinguisher: makeExtinguisher, chain: makeChain, knuckles: makeKnuckles,
  mic: makeMic, bell: makeBell, block: makeBlock, tacks: makeTacks, belt: makeBelt,
};
function spawnWeapons() {
  for (const w of weapons) scene.remove(w.mesh);
  weapons.length = 0;
  for (const p of tackPiles) scene.remove(p.mesh);
  tackPiles.length = 0;
  // full hardcore arsenal spread around ringside
  const spots = [
    [-5.5, 2.5, 'chair'], [5.5, -2.0, 'bat'], [-6.2, -4.5, 'table'], [6.4, 3.4, 'announce'], [-2.5, 6.6, 'ladder'],
    [-6.6, 0.5, 'kendo'], [6.6, -0.5, 'sign'], [-4.6, -6.4, 'can'], [4.6, 6.4, 'lid'],
    [-7.2, 3.6, 'pipe'], [7.2, -4.2, 'sledge'], [2.6, -7.2, 'extinguisher'], [-2.6, 7.6, 'chain'],
    [7.6, 2.2, 'mic'], [-7.6, -2.2, 'bell'], [5.2, -6.6, 'block'], [0.6, 7.8, 'tacks'],
    [-0.6, -7.8, 'knuckles'], [-5.2, 7.0, 'belt'], [6.8, 5.2, 'barbed'],
  ];
  for (const [x, z, kind] of spots) {
    let mesh;
    if (WEAPON_BUILDERS[kind]) mesh = WEAPON_BUILDERS[kind]();
    else if (kind === 'ladder') mesh = makeLadder();
    else {
      mesh = new THREE.Group();
      const wm = new THREE.MeshStandardMaterial({ color: kind === 'announce' ? 0x23232f : 0x7a4a22, roughness: 0.8 });
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.09, 1.0), wm);
      top.position.y = 0.75; top.castShadow = true; top.name = 'tabletop'; mesh.add(top);
      for (const [lx, lz] of [[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]]) {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.75, 0.09), wm);
        l.position.set(lx, 0.37, lz); mesh.add(l);
      }
      if (kind === 'announce') {
        // monitor glow on the announce desk
        const mon = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 0.06),
          new THREE.MeshStandardMaterial({ color: 0x06060c, emissive: 0x3aa0ff, emissiveIntensity: 0.7 }));
        mon.position.set(0, 1.0, -0.15); mon.rotation.x = -0.25; mon.name = 'announceMon'; mesh.add(mon);
      }
      mesh.userData.isTable = true;
      if (kind === 'announce') mesh.userData.isAnnounce = true;
    }
    mesh.position.set(x, groundHeight(x, z), z);
    mesh.rotation.y = rand(0, TAU);
    scene.add(mesh);
    const spec = WEAPONS[kind] || null;
    weapons.push({ kind, mesh, spec, state: 'ground', holder: null, vel: new THREE.Vector3(), spin: 0, broken: false, cool: 0, dents: 0, life: spec ? spec.life : Infinity });
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
  // snapshot the neutral stance so pin duty can kneel and then restore
  const home = {};
  for (const jn of ['pelvis', 'spine', 'torso', 'head', 'lUpper', 'rUpper', 'lFore', 'rFore', 'lThigh', 'rThigh', 'lShin', 'rShin']) {
    const o = rp[jn];
    if (o) home[jn] = [o.rotation.x, o.rotation.y, o.rotation.z];
  }
  home.pelvisY = rp.pelvis ? rp.pelvis.position.y : 0.97;
  return { mesh: rp.group, parts: rp, x: 2, z: 2, home };
}
function resetRefPose() {
  if (!ref || !ref.home) return;
  const P = ref.parts;
  for (const jn of Object.keys(ref.home)) {
    if (jn === 'pelvisY') continue;
    const o = P[jn];
    if (o) o.rotation.set(ref.home[jn][0], ref.home[jn][1], ref.home[jn][2]);
  }
  if (P.pelvis) P.pelvis.position.y = ref.home.pelvisY;
}
// Ref pin duty: slides in leaning during refrun, drops to a knee and slaps
// the mat on every count. Called every frame from updatePin.
function poseRefCount(p) {
  if (!ref || !ref.home) return;
  const P = ref.parts;
  if (p.phase === 'refrun') {
    // sprinting in, leaning forward, arm raised to start the count
    P.spine.rotation.x = 0.35;
    P.rUpper.rotation.set(-2.4, 0, -0.3); P.rFore.rotation.x = -0.3;
    P.lUpper.rotation.set(-0.8, 0, 0.4);
    P.lThigh.rotation.x = -0.7; P.rThigh.rotation.x = 0.4;
    P.lShin.rotation.x = 0.8; P.rShin.rotation.x = 0.3;
    return;
  }
  // down on one knee beside the victim, counting arm slapping the mat
  const step = p.phase === 'refrun' ? TUNING.pinStep1 : TUNING.pinStep2;
  const pr = clamp(p.t / step, 0, 1); // 0 = just slapped, 1 = about to slap
  const slap = Math.sin(pr * Math.PI); // arm arcs up between counts
  if (P.pelvis) P.pelvis.position.y = 0.55;
  P.pelvis.rotation.x = -0.4;
  P.spine.rotation.x = 0.55;
  P.head.rotation.x = -0.3;
  P.lThigh.rotation.set(-1.5, 0, 0.2); P.lShin.rotation.x = 1.9; // kneeling leg
  P.rThigh.rotation.set(-0.5, 0, -0.2); P.rShin.rotation.x = 1.1; // posted foot
  P.rUpper.rotation.set(-0.5 - slap * 1.8, 0, -0.3); P.rFore.rotation.x = -0.2; // slap arm
  P.lUpper.rotation.set(-0.4, 0, 0.5); P.lFore.rotation.x = -1.3; // other hand on knee
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
    // Hybrid controls: tie-up holds, special state, momentum shift, rest holds
    tieup: null, tieGen: 0,
    specialT: 0, shiftUsed: false,
    restHold: null,
    _aDownAt: 0, _xDownAt: 0, _lbT: 0,
    _rs: null, _rsHoldT: 0, _rsFlickT: 0,
    // Gassing: builds on offense + running, drains at rest. Gassed = slow, weak, botch-prone
    gas: 0, gasState: 'fresh',
    bumpStyle: 'flat',
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
// ROOTED: move states where the body is planted — no velocity integration, no
// rope interference. Clip root-motion is the only movement, so fighters stop
// skating through slams, strikes, pins and submissions.
const ROOTED = new Set(['attack', 'grapple', 'victim', 'pin', 'pinned', 'submit', 'submitvictim', 'celebrate', 'corner', 'climb', 'ropehit', 'top', 'laddertop', 'down', 'getup', 'groggy']);
function rootFighter(f) { if (f) { f.vel.set(0, 0, 0); f.rebound = null; } }

function gainAtt(f, n) { f.att = clamp(f.att + n, 0, 100); }
function gasUp(f, n) { if (!f || f.eliminated) return; f.gas = clamp((f.gas || 0) + n, 0, TUNING.gasMax); }
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
  
  // gassed attackers hit soft: winded -20%, gassed -40%
  if (attacker) {
    const gs = attacker.gasState;
    if (gs === 'winded') final = Math.round(final * 0.8);
    else if (gs === 'gassed') final = Math.round(final * 0.6);
  }
  if (attacker && attacker._faceBuff > 0) final = Math.round(final * 1.15);
  if (attacker && attacker._heelBuff > 1) final = Math.round(final * attacker._heelBuff);
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
  // heavy attackers hit harder). Downed bodies are planted — no shoving corpses.
  if (vic.state === 'down' || vic.state === 'pinned' || vic.state === 'submitvictim') { vic.vel.set(0, 0, 0); }
  else if (opts.kb && opts.from) {
    const dx = vic.pos.x - opts.from.x, dz = vic.pos.z - opts.from.z;
    const d = Math.hypot(dx, dz) || 1;
    const mr = attacker ? clamp(fighterMass(attacker) / fighterMass(vic), 0.8, 1.2) : 1;
    const tune = arenaTune();
    const kb = opts.kb * mr;
    vic.vel.x += (dx / d) * kb; vic.vel.z += (dz / d) * kb;
    if (opts.launch) {
      let lv = opts.launch * (0.9 + 0.1 * mr) * (0.85 + 0.15 * tune.stiff);
      if (vic.pos.y > groundHeight(vic.pos.x, vic.pos.z) + 0.3) lv *= 0.5; // receiver keeps landing control mid-air
      vic.vy = Math.max(vic.vy, Math.min(lv, 4));
    }
  }
  burst(new THREE.Vector3(vic.pos.x, vic.pos.y + 1.5, vic.pos.z),
    opts.big ? 0xff5030 : 0xffe066, opts.big ? 16 : 8, opts.big ? 7 : 4);
  audio.hit(opts.sfx || 'hit');
  if (opts.big) { audio.pop(1); shake(0.35); }
  
  // knockdown? sim bumps keep guys down — no arcade pop-ups
  const tune2 = arenaTune();
  const bigBump = !!opts.down || vic.hp <= 0 || final >= 11;
  const baseDown = opts.finish ? TUNING.finisherDown : (opts.downTime || (TUNING.downBase + final * TUNING.downPerDmg));
  if (bigBump) knockDown(vic, baseDown * (0.9 + 0.2 * tune2.stiff));
  else {
    vic.stun = Math.max(vic.stun, 0.45 + final * 0.03);
    if (['idle', 'walk', 'run'].includes(vic.state)) {
      playClip(vic, final >= 8 ? 'sold_big' : 'sold_strike');
      if (vic.isPlayer && final >= 8) toast('Rocked! Create space!');
    }
  }
  // limb psychology: damage accrues where the move lands
  const mvName = (opts.moveName || '').toUpperCase();
  let limbKey = 'torso';
  if (/SUPLEX|DDT|NECK|HEAD|STUNNER|PILEDRIVER|BRAINBUSTER|RANA/.test(mvName)) limbKey = 'head';
  else if (/KICK|BOOT|DROP|LEG|CRAB|SHARPSHOOTER|ANKLE|FIGURE|KNEE|STOMP/.test(mvName)) limbKey = 'leg';
  else if (/PUNCH|CHOP|ELBOW|CLOTHESLINE|LARIAT|FOREARM|UPPERCUT/.test(mvName)) limbKey = 'arm';
  vic.limb = vic.limb || { head: 0, torso: 0, arm: 0, leg: 0 };
  vic.limb[limbKey] = clamp((vic.limb[limbKey] || 0) + final * 0.9, 0, 100);
  // leg damage slows, arm damage weakens grapples, head damage lengthens KOs
  if (limbKey === 'leg' && vic.limb.leg > 50 && Math.random() < 0.3 && vic.isPlayer) toast('Leg is damaged — you\'re slower!');
  // fatigue + hidden bump card
  vic.fatigue = clamp((vic.fatigue || 0) + (opts.big ? 0.09 : 0.03) + Math.max(0, final - 10) * 0.005, 0, 1);
  vic.bump = clamp((vic.bump || 0) + (bigBump ? 0.08 + final * 0.004 : final * 0.001), 0, 1);
  // story director: spam is punished with soft damage + extra gas
  const st = match.story;
  if (attacker && attacker !== vic) {
    const same = st.lastMove === (opts.moveName || '');
    st.spam = same ? st.spam + 1 : 0;
    st.lastMove = opts.moveName || '';
    st.heat = clamp(st.heat + (opts.big ? 0.1 : 0.03) - Math.min(0.15, st.spam * 0.04), 0, 1);
    if (st.spam >= 2) {
      gasUp(attacker, st.spam * 3);
      if (attacker.isPlayer && st.spam === 2) toast('Crowd is dead to the spam — mix it up!');
    }
    if (bigBump) {
      st.lastBigT = match.time;
      // both guys need air after a big bump — real pacing breather
      if (attacker && attacker.paceCool !== undefined) attacker.paceCool = Math.max(attacker.paceCool || 0, 1.2);
      vic.paceCool = Math.max(vic.paceCool || 0, 2.0);
    }
  }

  if (vic.hp <= 0 && match.mode !== 'elim') {
    if (!opts.finish) { vic.hp = 1; knockDown(vic, 5.5); }
    else knockDown(vic, TUNING.finisherDown + 1.5);
  }
  refreshCards();
}
function knockDown(f, t, opts = {}) {
  if (f.state === 'top' || f.state === 'laddertop') return;
  // ---- Bump physics: directional vectoring near ropes/apron ----
  const nearRope = Math.max(Math.abs(f.pos.x), Math.abs(f.pos.z)) > 2.7 && f.pos.y > 0.5;
  if (!opts.noTangle && nearRope && Math.hypot(f.vel.x, f.vel.z) > 2.2 && Math.random() < 0.4) {
    // rope tangle instead of flat bump — draped over the ropes
    f.state = 'corner'; f.stateT = 1.6; f.anim = 'lockup'; f.animT = 1.6;
    f.vel.multiplyScalar(0.2);
    toast(`${f.def.name} is tangled in the ropes!`);
    return;
  }
  // ---- Stamina-based recovery: early = pop-up, late/gassed = crawl ----
  let mult = 1;
  if (match.time < 60 && t < 4) mult = 0.6; // early-match pop-up bumps
  if (f.gasState === 'gassed') mult *= 1.6;
  else if (f.gasState === 'winded') mult *= 1.25;
  if ((f.limb && f.limb.leg || 0) > 60) mult *= 1.4; // destroyed leg can't get up
  f.state = 'down'; f.downT = Math.max(f.downT, t * mult); f.stateT = 0; f.anim = 'down';
  // bump style: flip-bump off big launches, crumple when gassed, crawl when leg-dead, flat otherwise
  f._bumpStyle = (f.vy > 2.2) ? 'flip' : (f.gasState === 'gassed' ? 'crumple' : ((f.limb && f.limb.leg || 0) > 60 ? 'crumple' : 'flat'));
  f._downRot = f._bumpStyle === 'flip' ? 1.35 : -1.5; // stomach vs back
  // planted: downed bodies stay where they fall, never slide on their backs
  f.vel.set(0, 0, 0); f.rebound = null;
  f.vy = Math.max(f.vy, 0.6);
  matHit(0.45); // mat spring absorbs the bump (visual + feel)
  // Initialize AKI wakeup timer
  if (f.wakeupTimer) {
    f.wakeupTimer.set(Math.max(f.wakeupTimer.timer, t * 30)); // convert seconds to frames
  }
  if (f.weapon) dropWeapon(f);
}
function getup(f) {
  f.state = 'getup'; f.stateT = TUNING.getupDur; f.anim = 'getup'; f.downT = 0;
  if (f.wakeupTimer) f.wakeupTimer.set(0);
}

// strike
function doStrike(att, heavy) {
  if (att.cool > 0 || att.st < (heavy ? 12 : 8)) return;
  if (att.state === 'groggy') return;
  // strikes from the top rope / ladder become diving attacks onto the foe below
  if (att.state === 'top' || att.state === 'laddertop') { diveAttack(att); return; }
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
  // ground-and-pound: strike on a downed foe works them over on the mat
  // (stomps, elbows, drops) and keeps them down — grapple is for pickups now.
  const downTgt = fighters.find((v) => v !== att && !v.eliminated && isDown(v) && dist2(att, v) < 1.6);
  if (downTgt && !running && !att.weapon) {
    const gmv = pick(MOVES.ground);
    att.facing = foeDir(att, downTgt);
    att.cool = 0.8 * TUNING.attackDurMult; att.st -= 8; gasUp(att, TUNING.gasStrike); rootFighter(att);
    att.state = 'attack'; att.stateT = 0.6 * TUNING.attackDurMult; att.anim = gmv.anim; att.animT = att.stateT;
    playClip(att, gmv.anim === 'splash' ? 'strike_dropkick' : slamClipFor(gmv.anim));
    const gen = att.rev = (att.rev || 0) + 1;
    setTimeout(() => {
      if ((att.rev || 0) !== gen) return;
      if (match.phase !== 'fight' || downTgt.eliminated) return;
      if (dist2(att, downTgt) < 1.7) {
        applyDamage(downTgt, (gmv.baseDamage ?? gmv.dmg ?? 0) * (heavy ? 1.4 : 1), att, { kb: 0.6, from: att.pos, down: true, downTime: 2.4, moveName: gmv.name });
        showMove(att, gmv.name);
      }
    }, 220);
    return;
  }
  att.cool = (heavy ? 1.1 : 0.75) * TUNING.attackDurMult; att.st -= heavy ? 12 : 7; gasUp(att, heavy ? TUNING.gasHeavyStrike : TUNING.gasStrike); rootFighter(att);
  att._whiffGas = heavy ? TUNING.gasHeavyStrike : TUNING.gasStrike;
  att.state = 'attack'; att.stateT = heavy ? 0.6 : 0.42; att.anim = mv.anim; att.animT = heavy ? 0.6 : 0.42;
  att._strikeHeavy = !!heavy;
  playClip(att, strikeClipFor(mv.anim));
  att.facing = faceNearest(att) ?? att.facing;
  audio.blip(200, 0.08, 'sawtooth', 0.05);
  // reversal window for the target (HCTP timing reversal)
  const tgt = preferredFoe(att, 1.8);
  if (tgt) openWindow(tgt, 'strike', att);
  const gen = att.rev = (att.rev || 0) + 1;
  // resolve slightly delayed for feel
  setTimeout(() => {
    if ((att.rev || 0) !== gen) return; // reversed — dead move
    if (match.phase !== 'fight') return;
    let hitAny = false;
    for (const v of fighters) {
      if (v === att || v.eliminated || isDown(v)) continue;
      if (dist2(att, v) < 1.6 && inFront(att, v, 0.9)) {
        if (!v.isPlayer && aiTryReverse(v, att, 'strike')) continue;
        const isRunning = running && (mv.name === 'CLOTHESLINE' || mv.name === 'DROPKICK');
        const hv = att._strikeHeavy;
        // brass knuckles ride along: worn iron adds to every bare strike
        const knuckBuff = (att.weapon && att.weapon.kind === 'knuckles' && !att.weapon.broken) ? ((att.weapon.spec && att.weapon.spec.punchBuff) || 3) : 0;
        applyDamage(v, Math.round(((mv.baseDamage ?? mv.dmg ?? 0) + (running ? 3 : 0) + knuckBuff) * (hv ? 1.5 : 1)), att, {
          kb: mv.kb * (hv ? 1.6 : 1),
          from: att.pos,
          sfx: mv.sfx,
          down: isRunning || hv || (running && Math.random() < 0.5),
          launch: isRunning ? 2.2 : 0,
          downTime: isRunning ? 3.0 : (hv ? 2.6 : 2.0),
          moveName: mv.name + (hv ? ' (HEAVY)' : '')
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
    else {
      // whiff punishment: swinging air costs gas, leaves you open
      gasUp(att, (TUNING.gasWhiff || 6) * (heavy ? 1.5 : 1));
      att.cool = Math.max(att.cool, (heavy ? 0.9 : 0.6) * TUNING.attackDurMult);
      att.stun = Math.max(att.stun, heavy ? 0.45 : 0.25);
    }
  }, 180);
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
// ---------- HCTP reversal system (sim timing: tight windows, real costs) ----------
// LT reverses strikes, RT reverses grapples, LT+RT reverses finishers.
function openWindow(vic, type, att) {
  if (!vic || vic.eliminated) return;
  vic.incoming = { type, att, until: performance.now() + (type === 'strike' ? 240 : type === 'finisher' ? 300 : 380) };
}
function doReversal(reverser, attacker, kind) {
  attacker.rev = (attacker.rev || 0) + 1; // cancel pending damage timeouts
  attacker.tieup = null; attacker.tieGen = (attacker.tieGen || 0) + 1;
  attacker.restHold = null;
  attacker.state = 'idle'; attacker.cool = 1.0; attacker.clip = null;
  attacker.stun = Math.max(attacker.stun, 0.4);
  if (attacker.incoming) attacker.incoming = null;
  reverser.clip = null;
  for (const f of fighters) { if (f.carriedBy === attacker) f.carriedBy = null; }
  applyDamage(attacker, 7, reverser, { kb: 1.2, from: reverser.pos, sfx: 'hit', down: Math.random() < 0.3, downTime: 1.5, moveName: 'REVERSAL' });
  gainAtt(reverser, 12);
  match.heat = clamp(match.heat + 0.06, 0, 1);
  announce('REVERSAL!', `${reverser.def.name} turns it around!`);
  audio.pop(1.2); shake(0.4);
  toast(`${reverser.def.name} — REVERSAL!`);
}
function tryRev(p, kind) {
  if (!p || p.eliminated || match.phase !== 'fight') return false;
  if (['down', 'pinned', 'submit', 'submitvictim', 'pin', 'top', 'laddertop', 'dive', 'ropehit', 'thrown', 'groggy'].includes(p.state)) return false;
  const inc = p.incoming;
  if (!inc) {
    // whiffed reversal button: guessing costs gas + leaves hands down
    if (!p._revWhiffCool || performance.now() > p._revWhiffCool) {
      p._revWhiffCool = performance.now() + 900;
      gasUp(p, TUNING.gasReversal * 0.7);
      p.cool = Math.max(p.cool, 0.5);
      p.stun = Math.max(p.stun, 0.3);
      if (p.isPlayer) toast('No reversal there — don\'t guess!');
    }
    return false;
  }
  if (performance.now() > inc.until) { p.incoming = null; return false; }
  if (!inc.att || inc.att.eliminated || dist2(p, inc.att) > 2.8) { p.incoming = null; return false; }
  if (inc.type !== kind) {
    // wrong button: real whiff, real opening
    p.incoming = null;
    gasUp(p, TUNING.gasReversal);
    p.cool = Math.max(p.cool, 0.7);
    p.stun = Math.max(p.stun, 0.4);
    if (p.isPlayer) toast('Wrong reversal!');
    return false;
  }
  if (p.gasState === 'gassed' && Math.random() < 0.45) { p.incoming = null; return false; }
  if (p.gasState === 'winded' && Math.random() < 0.2) { p.incoming = null; return false; }
  p.incoming = null;
  gasUp(p, TUNING.gasReversal);
  doReversal(p, inc.att, kind);
  return true;
}
function tryRevSmart(p) {
  // touch REV button: match finisher > grapple > strike windows
  const inc = p.incoming;
  if (!inc || performance.now() > inc.until) return false;
  return tryRev(p, inc.type);
}
// Reversal odds adapted from VirtualProGrappler reversal.ts (GPL-3.0
// chaotix610/VirtualProGrappler): defender-spirit bands -> weight buckets ->
// fresh-defender grapple bonus -> attacker-Special! override -> cap -> roll.
// Spirit here is the No Mercy attitude meter (0-100+), the AKI spirit analog.
function spiritBand(att) {
  const a = att || 0;
  if (a >= 100) return 0.500;
  if (a >= 81) return 0.333;
  if (a >= 61) return 0.250;
  if (a >= 31) return 0.125;
  if (a >= 11) return 0.062;
  return 0.031;
}
function aiRevChance(vic, att, kind) {
  let p = spiritBand(vic.att);
  // weight buckets: floor(w/3); heavier defender doubles the odds
  const vw = vic.def.weight || 100, aw = (att && att.def.weight) || 100;
  if (Math.floor(vw / 3) > Math.floor(aw / 3)) p *= 2;
  // fresh defenders shut down strong grapples (VPG: health>=192 x4, >=128 x2
  // on a 255 scale — softened here for our faster HP scale)
  if (kind === 'grapple' && vic.maxhp) {
    const frac = vic.hp / vic.maxhp;
    if (frac >= 0.75) p *= 2;
    else if (frac >= 0.5) p *= 1.5;
  }
  // attacker Special! override: a hyped attacker blanks normal reversals
  const attHot = (att && (att.att >= 100 || att.specialT > 0));
  const vicHot = (vic.att >= 100 || vic.specialT > 0);
  if (attHot && !vicHot) p *= 0.15;
  if (kind === 'finisher') p *= 0.7;
  p += ((vic.def.tgh || 5) - 5) * 0.01;
  // gassed reversers mistime it (mirrors the player tryRev mistiming)
  if (vic.gasState === 'gassed') p *= 0.55;
  else if (vic.gasState === 'winded') p *= 0.8;
  return clamp(p, 0.02, 0.4);
}
function aiTryReverse(vic, att, kind) {
  if (vic.isPlayer || vic.eliminated) return false;
  if (['down', 'pinned', 'submit', 'submitvictim', 'pin', 'top', 'laddertop', 'dive', 'ropehit', 'thrown', 'groggy', 'celebrate'].includes(vic.state)) return false;
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
  power: ['POWER BOMB', 'SPINE BUSTER', 'BODYSLAM', 'VERTICAL SUPLEX', 'BACK BREAKER', 'CHOKESLAM', 'SIDEWALK SLAM', 'FALLAWAY SLAM', 'BRAINBUSTER', 'FISHERMAN SUPLEX', 'POWERSLAM', 'TKO', 'TORTURE RACK DROP', 'TIGER DRIVER'],
  quick: ['DDT', 'NECK BREAKER', 'HURRICANRANA', 'STO', 'RUSSIAN LEGSWEEP', 'FACEBUSTER', 'STUNNER', 'SNAPMARE'],
  wear: ['BACK BREAKER', 'NECK BREAKER', 'SAMOAN DROP', 'SNAPMARE', 'STO', 'SIDEWALK SLAM'],
};
function byName(list, name) { return list.find((m) => m.name === name); }
// Groggy pickup: hauling a downed foe to their feet dazed. Base ~2s, longer
// the later the match and the more damage taken (head damage counts extra).
function groggyDur(vic) {
  const missing = 1 - (vic.hp / Math.max(1, vic.maxhp));
  const head = (vic.limb && vic.limb.head || 0) / 100;
  const dur = 2.0 + Math.min(2.5, match.time / 75) + missing * 3.5 + head * 1.2;
  return clamp(dur, 2.0, 8.0);
}
function pickupGroggy(att, foe) {
  if (!foe || foe.eliminated || !isDown(foe)) return false;
  if (match.pin && (match.pin.vic === foe || match.pin.att === foe)) return false; // never steal a pin
  rootFighter(att); rootFighter(foe);
  att.facing = foeDir(att, foe);
  att.cool = 0.7 * TUNING.attackDurMult; att.st -= 6; gasUp(att, TUNING.gasGrapple * 0.7);
  att.state = 'attack'; att.stateT = 0.55 * TUNING.attackDurMult; att.anim = 'lockup'; att.animT = att.stateT;
  foe.downT = 0;
  foe.state = 'groggy'; foe.stateT = groggyDur(foe); foe.anim = 'groggy';
  foe.facing = att.facing + Math.PI;
  foe.pos.y = groundHeight(foe.pos.x, foe.pos.z);
  audio.blip(220, 0.15, 'sawtooth', 0.1);
  if (att.isPlayer || foe.isPlayer) toast(`${att.def.name} hauls ${foe.def.name} up — GROGGY! (${foe.stateT.toFixed(1)}s)`);
  return true;
}
function doGrapple(att, cat, kind) {
  if (att.cool > 0 || att.st < 10) return;
  if (att.state === 'groggy') return; // groggy wrestlers can't act
  // HCTP: no direction on the grapple button = Irish whip (not a random move)
  if (!cat) { doWhip(att); return; }
  cat = cat || 'auto';
  kind = kind || 'light';
  // Downed foe: GRAPPLE always picks them up GROGGY to their feet —
  // any direction, any timing. DOWN grapples for the pin instead.
  // (Ground-and-pound moved to the STRIKE button.)
  const downFoe = fighters.find((v) => v !== att && !v.eliminated && isDown(v) && dist2(att, v) < 1.5);
  if (downFoe) {
    if (cat === 'sub') { tryPin(att); return; }
    pickupGroggy(att, downFoe); return;
  }
// standing tie-up: snap to the nearest foe in range, face them, pull in.
let foe = att.foeLock && !att.foeLock.eliminated && !isDown(att.foeLock) && dist2(att, att.foeLock) < 1.4
  ? att.foeLock : null;
if (!foe) {
  let bd = 1.5;
  for (const v of fighters) {
    if (v === att || v.eliminated || isDown(v)) continue;
    const d = dist2(att, v);
    if (d < bd) { bd = d; foe = v; }
  }
}
if (!foe) { // whiffed grab: reaching air costs gas + leaves you bent over
  att.state = 'attack'; att.stateT = 0.55 * TUNING.attackDurMult; att.anim = 'punch'; att.animT = att.stateT;
  att.cool = 1.0 * TUNING.attackDurMult; att.stun = Math.max(att.stun, 0.35);
  gasUp(att, (TUNING.gasWhiff || 6) + TUNING.gasGrapple * 0.5);
  playClip(att, 'strike_jab');
  return;
}

// HYBRID: A pressed while already holding a tie-up = follow-up throw
if (att.tieup && att.tieup.foe === foe) {
  execTieup(att, cat);
  return;
}
att.facing = foeDir(att, foe);
const behind = !inFront(foe, att, 1.2);
let mv = null, dmgMult = 0.85, slamDur = 0.7, stateDur = 1.0;
if (behind) {
  mv = pick(MOVES.back); // full back catalog: suplexes, drops, cradles, sleepers
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
att.cool = (kind === 'light' ? 1.0 : 1.4) * TUNING.attackDurMult; att.st -= kind === 'light' ? 8 : 12; gasUp(att, kind === 'light' ? TUNING.gasGrapple : TUNING.gasHeavyGrapple); rootFighter(att); rootFighter(foe);
// damaged arms can't power grapples — real limb psychology
if (att.limb && att.limb.arm > 40) dmgMult *= (1 - Math.min(0.3, (att.limb.arm - 40) / 200));
// PHASE 1 — LOCKUP: chest-to-chest struggle, reversal window open
att.state = 'grapple'; att.stateT = stateDur; att.anim = 'lockup'; att.animT = stateDur;
foe.state = 'victim'; foe.stateT = stateDur; foe.anim = 'lockup';
foe.animT = stateDur; foe._victimAnim = mv.anim;
// lockup meets at the VICTIM — attacker steps in, body stays where it fell
att.pos.x = foe.pos.x - Math.sin(att.facing) * 0.8;
att.pos.z = foe.pos.z - Math.cos(att.facing) * 0.8;
foe.vel.multiplyScalar(0.2);
foe.facing = att.facing + Math.PI;
openWindow(foe, 'grapple', att);
if (kind === 'light') {
  // DoR tap: fast lockup straight into the slam (shorter, softer)
  slamFromLockup(att, foe, mv, dmgMult * 0.85, 350);
} else {
  // DoR hold: extended tie-up awaiting A + direction follow-up
  enterTieup(att, foe, mv, dmgMult);
}
}
// ---- Hybrid tie-up: hold A to lock, press A + direction to throw ----
function enterTieup(att, foe, mv, dmgMult) {
  att.tieup = { foe, mv, dmgMult, until: performance.now() + 1600 };
  att.tieGen = (att.tieGen || 0) + 1;
  // hold the lockup open for the follow-up window
  att.stateT = Math.max(att.stateT, 1.7); att.state = 'grapple';
  foe.stateT = Math.max(foe.stateT, 1.7); foe.state = 'victim';
  const g = att.tieGen;
  toast(`${att.def.name} — TIE-UP! Press GRAPPLE + direction!`);
  audio.blip(220, 0.15, 'square', 0.08);
  setTimeout(() => {
    if (match.phase !== 'fight') return;
    if (!att.tieup || att.tieGen !== g) return; // followed up / reversed / expired
    execTieup(att, 'power'); // no follow-up: default power throw
  }, 1600);
}
function execTieup(att, cat) {
  const t = att.tieup;
  if (!t) return false;
  att.tieup = null;
  const foe = t.foe;
  if (!foe || foe.eliminated || foe.state !== 'victim') { att.state = 'idle'; return false; }
  // re-pick by category (or keep the held move for auto)
  att.facing = foeDir(att, foe);
  const behind = !inFront(foe, att, 1.2);
  let mv = t.mv, dmgMult = t.dmgMult || 1;
  if (cat === 'power') { const p = MOVES.front.filter((m) => GRAPPLE_POOLS.power.includes(m.name)); if (p.length) { mv = pick(p); dmgMult = 1.15; } }
  else if (cat === 'quick') { const p = MOVES.front.filter((m) => GRAPPLE_POOLS.quick.includes(m.name)); if (p.length) { mv = pick(p); dmgMult = 0.9; } }
  else if (cat === 'sub') { const p = MOVES.front.filter((m) => GRAPPLE_POOLS.wear.includes(m.name)); if (p.length) { mv = pick(p); dmgMult = 1.0; } foe.st = Math.max(0, foe.st - 15); }
  else if (cat === 'sig') {
    const fin = MOVES.finishers[att.def.finisher2];
    if (att.att >= 25 && fin && !fin.drain) { mv = { ...fin, name: att.def.finisher2 + ' (SIG)' }; dmgMult = 0.55; }
  }
  slamFromLockup(att, foe, mv, dmgMult);
  return true;
}
// shared lockup -> lift -> impact pipeline (250ms lift beat, HCTP feel)
function slamFromLockup(att, foe, mv, dmgMult) {
  const gen = att.rev = (att.rev || 0) + 1;
  // PHASE 2 — LIFT: attacker hoists, victim rides the anchor.
  // noLift moves (stunners, snapmares, cradles) snap with no hoist — the
  // victim stays on their feet until impact.
  setTimeout(() => {
    if ((att.rev || 0) !== gen) return;
    if (match.phase !== 'fight' || foe.eliminated) return;
    if (mv.noLift) {
      playClip(att, slamClipFor(mv.anim));
      playClip(foe, 'sold_strike');
      audio.blip(220, 0.15, 'sawtooth', 0.1); // snap grunt
      return;
    }
    playClip(att, liftClipFor(mv.anim));
    playClip(foe, hoistClipFor(mv.anim));
    rootFighter(att); rootFighter(foe);
    foe.carriedBy = att;
    foe.carryAnchor = (CLIPS[hoistClipFor(mv.anim)] || {}).carry || 'overhead';
    audio.blip(180, 0.2, 'sawtooth', 0.1); // effort grunt
  }, 250);
  // PHASE 3 — IMPACT: slam + sell + damage + shake, victim released to the mat
  setTimeout(() => {
    if ((att.rev || 0) !== gen) return; // reversed — dead move
    if (match.phase !== 'fight' || foe.eliminated) return;
    if (!foe.isPlayer && aiTryReverse(foe, att, 'grapple')) { foe.carriedBy = null; return; }
    // ---- Botch Matrix: fatigue + agility + positioning, never an engine glitch ----
    // Selling gate: destroyed leg or gassed body can't heavy-lift — must adapt
    const isHeavyLift = /POWERBOMB|PILEDRIVER|CHOKESLAM|RACK|TIGER|BRAINBUSTER|SUPLEX/.test((mv.name || '').toUpperCase());
    if (isHeavyLift && att.limb && att.limb.leg > 60) {
      foe.carriedBy = null;
      att.state = 'idle'; att.stun = Math.max(att.stun, 0.8);
      toast(`${att.def.name}'s leg gives out — can't lift!`);
      gasUp(att, 6);
      return; // forced adapt: no lift, story told
    }
    let botchC = (att.gasState === 'gassed' ? 0.09 : att.gasState === 'winded' ? 0.04 : 0.015) + (att.hp <= 25 ? 0.01 : 0);
    const agi = att.def.spd || 5;
    if (agi <= 4 && /RANA|MOONSAULT|450|SHOOTING|SWANTON/.test((mv.name || '').toUpperCase())) botchC += 0.08; // low agility + high risk
    if ((att.limb && att.limb.leg || 0) > 50) botchC += 0.05; // hurt leg slips
    const nearCorner = Math.abs(att.pos.x) > 2.6 && Math.abs(att.pos.z) > 2.6;
    if (nearCorner && /SPLASH|MOONSAULT|450/.test((mv.name || '').toUpperCase())) botchC += 0.04; // poor positioning
    if (Math.random() < botchC) {
      foe.carriedBy = null;
      att.state = 'idle'; att.stateT = 0; att.stun = Math.max(att.stun, 1.0);
      foe.stun = Math.max(foe.stun, 0.6);
      gasUp(att, 8); gasUp(foe, 4);
      match.heat = clamp(match.heat - 0.05, 0, 1);
      showMove(att, 'BOTCHED ' + mv.name + '!');
      announce('BOTCH!', `${att.def.name} loses ${foe.def.name}!`);
      audio.blip(120, 0.25, 'sawtooth', 0.1);
      audio.chant('boo');
      if (foe.isPlayer || att.isPlayer) toast('Botched! Sloppy — the crowd groans.');
      // Adaptive recovery: heel stalls out of the ring, face shows vulnerability
      if (!att.isPlayer) {
        if (att.def.align === 'HEEL') att.aiMove = { type: 'roam' };
        att.paceCool = Math.max(att.paceCool || 0, 2.5);
      }
      return;
    }
    foe.carriedBy = null; rootFighter(att); rootFighter(foe);
    // ballistic throws: the victim actually flies — release, don't teleport
    if (mv.flight) { releaseFlight(att, foe, mv, dmgMult); att.state = 'idle'; att.stateT = 0; return; }
    // victim lands WHERE THEY STAND — the attacker steps in, the body stays put.
    // (Dragging victims to the attacker's feet relocated ringside fights.)
    att.pos.x = foe.pos.x - Math.sin(att.facing) * 0.55;
    att.pos.z = foe.pos.z - Math.cos(att.facing) * 0.55;
    foe.pos.y = groundHeight(foe.pos.x, foe.pos.z);
    const isRana = mv.anim === 'hurricanrana';
    const isSpine = mv.anim === 'spinebuster';
    const isPower = isSpine || ['powerbomb', 'piledriver', 'chokeslam', 'brainbuster', 'powerslam', 'tigerdriver', 'fallaway', 'tko', 'rack', 'tombstone'].includes(mv.anim);
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
    // Grounded slam: victim drops where they stand, small settle, no flight
    const hb = isPower ? 2.2 : 1.4;
    const vb = isPower ? 2.6 : 2.0;
    applyDamage(foe, Math.round((mv.baseDamage ?? mv.dmg ?? 0) * dmgMult), att, { kb: hb, from: att.pos, sfx: isPower ? 'hit' : 'hit', down: true, big: true, launch: vb, downTime: isRana ? 4.0 : (isPower ? 4.2 : 3.0), moveName: mv.name });
    if (moveBleed(mv)) bustOpen(foe, att);
    const pinInvite = moveFeature(mv) === 'pin' && !isRana ? ' — HOOK THE LEG, pin!' : '';
    showMove(att, mv.name + (isRana ? ' — HOOKS THE CRADLE, pin!' : isSpine ? ' — COVER THEM!' : isPower ? ' — DEVASTATING!' : pinInvite));
    att.state = 'idle'; att.stateT = 0;
  }, 500);
}
function startSubmit(att, vic) {
  const mv = pick(MOVES.submit);
  const sub = mv.sub || 'sit'; // sit = legs, stand = ankle lock, front = head, back = ride
  rootFighter(att); rootFighter(vic);
  att.state = 'submit'; att.submitT = 3.2; att.anim = 'submit'; att._subPose = sub;
  vic.state = 'submitvictim'; vic.submitT = 3.2; vic.anim = 'down'; vic._subPose = sub;
  vic._downRot = 1.35; vic._bumpStyle = 'flat'; // prone, pressed flat
  // connect the bodies: attacker takes their spot on the hold
  const fx = Math.sin(vic.facing), fz = Math.cos(vic.facing); // victim head direction
  if (sub === 'sit' || sub === 'stand') { att.pos.x = vic.pos.x - fx * 1.1; att.pos.z = vic.pos.z - fz * 1.1; }
  else if (sub === 'front') { att.pos.x = vic.pos.x + fx * 0.9; att.pos.z = vic.pos.z + fz * 0.9; }
  else { att.pos.x = vic.pos.x; att.pos.z = vic.pos.z; } // back: seated on them
  att.pos.y = groundHeight(att.pos.x, att.pos.z);
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
  if (att.state === 'groggy') return;
  const foe = fighters.find((v) => v !== att && !v.eliminated && !isDown(v) && dist2(att, v) < 1.5);
  if (att.weapon && (!foe || Math.random() < 0.5)) { throwWeapon(att); return; }
  // bare hands + grapple button near a downed body picks them up groggy
  const downed = fighters.find((v) => v !== att && !v.eliminated && isDown(v) && dist2(att, v) < 1.5);
  if (downed && pickupGroggy(att, downed)) return;
  if (!foe) return;
  att.cool = 0.9 * TUNING.attackDurMult; att.st -= 6; gasUp(att, TUNING.gasWhip);
  att.state = 'attack'; att.stateT = 0.4 * TUNING.attackDurMult; att.anim = 'chop';
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
  const hyped = (att.specialT || 0) > 0;
  if ((att.att < TUNING.finisherThreshold && !hyped) || att.cool > 0) {
    if (att.isPlayer) toast(att.att >= 100 || hyped ? 'No target in range!' : 'Build meter with LB taunts, then LB+RB to go SPECIAL!');
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
  att.att = 0; att.cool = 1.4 * TUNING.attackDurMult; att.st = Math.max(0, att.st - 15); gasUp(att, TUNING.gasFinisher);
  att.finisherT = match.time; // protected-finish window for kickout logic
  match.slowmo = Math.max(match.slowmo, 0.18); shake(0.6); // brief hit-stop, not full slow-mo
  announce('★ FINISHER! ★', `${att.def.name} — ${finName}`);
  audio.pop(1.5); audio.bell();
  att.state = 'attack'; att.stateT = 1.2; att.anim = fin.anim; att.animT = 1.2;
  if (foe && !isDiveFin(fin)) {
    foe.state = 'victim'; foe.stateT = 1.0; foe.anim = 'lockup'; foe.animT = 1.0; foe._victimAnim = fin.anim; openWindow(foe, 'finisher', att);
    // finisher grabs at the victim — attacker closes in, body never dragged
    att.pos.x = foe.pos.x - Math.sin(att.facing) * 0.8;
    att.pos.z = foe.pos.z - Math.cos(att.facing) * 0.8;
    foe.facing = att.facing + Math.PI;
  }
  camWide = false;
  const gen = att.rev = (att.rev || 0) + 1;
  // LIFT beat (350ms): hoist the victim before the slam
  if (foe && !isDiveFin(fin)) {
    setTimeout(() => {
      if ((att.rev || 0) !== gen) return;
      if (match.phase !== 'fight' || foe.eliminated) return;
      playClip(att, liftClipFor(fin.anim));
      playClip(foe, hoistClipFor(fin.anim));
      foe.carriedBy = att;
      foe.carryAnchor = (CLIPS[hoistClipFor(fin.anim)] || {}).carry || 'overhead';
    }, 350);
  }
  setTimeout(() => {
    if ((att.rev || 0) !== gen) return; // reversed — dead move
    if (match.phase !== 'fight') return;
    if (foe && !foe.eliminated) {
      if (!foe.isPlayer && aiTryReverse(foe, att, 'finisher')) { foe.carriedBy = null; return; }
      foe.carriedBy = null; rootFighter(att); rootFighter(foe);
      // finisher lands where the victim stands — attacker steps in, body stays put
      att.pos.x = foe.pos.x - Math.sin(att.facing) * 0.55;
      att.pos.z = foe.pos.z - Math.cos(att.facing) * 0.55;
      foe.pos.y = groundHeight(foe.pos.x, foe.pos.z);
      // FINISHER IMPACT: massive freeze, heavy slam, victim stays down
      match.slowmo = 0.08;
      shake(2.0);
      audio.pop(2.5);
      audio.bell();
      if (match.heat > 0.7 || (match.story.nearFalls || 0) >= 1) audio.chant(Math.random() < 0.5 ? 'awesome' : 'holy');
      burst(new THREE.Vector3(foe.pos.x, foe.pos.y + 1.5, foe.pos.z), 0xffd23f, 40, 18);
      playClip(att, slamClipFor(fin.anim));
      playClip(foe, soldClipFor(fin.anim));
      applyDamage(foe, (fin.baseDamage ?? fin.dmg ?? 0), att, { kb: 2.6, from: att.pos, down: true, big: true, finish: true, launch: 3.2, downTime: 5.5, moveName: finName });
      if (moveBleed({ name: finName, ...fin })) bustOpen(foe, att);
      gainAtt(att, 20);
    } else if (isDiveFin(fin)) {
      att.vy = 6; const fx = Math.sin(att.facing), fz = Math.cos(att.facing);
      att.vel.x = fx * 9; att.vel.z = fz * 9;
      setTimeout(() => {
        if ((att.rev || 0) !== gen) return;
        for (const v of fighters) {
          if (v === att || v.eliminated) continue;
          if (dist2(att, v) < 2.6) applyDamage(v, (fin.baseDamage ?? fin.dmg ?? 0), att, { kb: 2.0, from: att.pos, down: true, big: true, finish: true, downTime: 4.8 });
        }
      }, 450);
    }
  }, 650);
}
function isDiveFin(fin) { return fin.anim === 'splash' || fin.anim === 'elbowdrop'; }
// ---------- Hybrid special / hype state (LB + RB) ----------
// LB builds meter (taunts). LB+RB with a full meter = SPECIAL hype state;
// LB+RB near an opponent while hyped (or meter full) = finisher.
function padDoSpecial(p, dirHeld) {
  if (!p || p.eliminated || match.phase !== 'fight') return;
  const near = preferredFoe(p, 2.6);
  if (near && (p.att >= TUNING.finisherThreshold || (p.specialT || 0) > 0)) {
    doFinisher(p, dirHeld);
    return;
  }
  if (p.att >= TUNING.finisherThreshold && !(p.specialT > 0)) {
    p.specialT = 12; // 12s hype window
    p.cool = Math.max(p.cool, 0.6);
    announce('★ SPECIAL! ★', `${p.def.name} is feeling it!`);
    audio.pop(1.2); audio.bell();
    updateTron('SPECIAL!', p.def.name);
    toast(`${p.def.name} is HYPED — finisher ready! (LB+RB near foe)`);
    return;
  }
  if (p.isPlayer) toast(p.specialT > 0 ? 'Get close, then LB+RB for the FINISHER!' : 'Build meter with LB taunts first!');
}
// ---------- Momentum Shift (DoR desperation, Back button, once per match) ----------
function doMomentumShift(p) {
  if (!p || p.eliminated || match.phase !== 'fight') return;
  if (p.shiftUsed) { if (p.isPlayer) toast('Momentum Shift already used!'); return; }
  if ((p.hp / p.maxhp) > 0.3) { if (p.isPlayer) toast('Momentum Shift needs DANGER (low health)!'); return; }
  const foe = preferredFoe(p, 9) || fighters.find((v) => v !== p && !v.eliminated);
  if (!foe) return;
  p.shiftUsed = true;
  // trade status: swap HP fractions and attitude meters
  const pFrac = p.hp / p.maxhp, fFrac = foe.hp / foe.maxhp;
  p.hp = Math.max(1, Math.round(p.maxhp * fFrac)); foe.hp = Math.max(1, Math.round(foe.maxhp * pFrac));
  const pa = p.att; p.att = foe.att; foe.att = pa;
  const ps = p.spirit; p.spirit = foe.spirit; foe.spirit = ps;
  match.slowmo = Math.max(match.slowmo, 0.2); shake(1.0);
  announce('MOMENTUM SHIFT!', `${p.def.name} steals the match!`);
  audio.pop(2.0); audio.bell();
  updateTron('SHIFT!', p.def.name);
  match.heat = clamp(match.heat + 0.2, 0, 1);
  refreshCards();
}
// ---------- Rest holds (DoR tactics while foe is down) ----------
// kind: submit (drain HP) | drain (drain stamina) | taunt (build meter) | rest (recover)
function doRestHold(att, kind) {
  if (!att || att.eliminated || match.phase !== 'fight') return;
  if (att.restHold) return; // already holding
  const foe = fighters.find((v) => v !== att && !v.eliminated && isDown(v) && dist2(att, v) < 1.5);
  if (!foe) { if (att.isPlayer) toast('No downed foe nearby for a rest hold!'); return; }
  att.state = 'attack'; att.stateT = 2.2; att.anim = 'submit'; att.animT = 2.2;
  att.restHold = { foe, kind, ticks: 0 };
  att.facing = foeDir(att, foe);
  const label = { submit: 'SUBMISSION HOLD', drain: 'STAMINA DRAIN', taunt: 'HUMILIATION', rest: 'REST HOLD' }[kind] || 'REST HOLD';
  showMove(att, label);
  audio.blip(300, 0.15, 'sawtooth', 0.08);
  const iv = setInterval(() => {
    if (match.phase !== 'fight' || !att.restHold || foe.eliminated || att.eliminated) { clearInterval(iv); att.restHold = null; return; }
    att.restHold.ticks++;
    if (kind === 'submit') foe.hp = Math.max(1, foe.hp - 2);
    else if (kind === 'drain') foe.st = Math.max(0, foe.st - 14);
    else if (kind === 'taunt') { gainAtt(att, 5); match.heat = clamp(match.heat + 0.04, 0, 1); }
    else if (kind === 'rest') att.st = Math.min(TUNING.stamina, att.st + 16);
    burst(new THREE.Vector3(foe.pos.x, foe.pos.y + 0.8, foe.pos.z), 0x9d4edd, 3, 2);
    refreshCards();
    if (att.restHold.ticks >= 5 || att.state !== 'attack') { clearInterval(iv); att.restHold = null; att.state = 'idle'; }
  }, 400);
}
// taunt (No Mercy attitude engine)
function doTaunt(f, dir) {
  // personality momentum: heeled heat booed = heel buff, face cheered = comeback buff
  if (f && match.phase === 'fight') {
    if (f.def.align === 'HEEL' && match.heat > 0.5) { f._heelBuff = Math.min(1.25, (f._heelBuff || 1) + 0.05); }
    if (f.def.align === 'FACE' && match.heat > 0.6) {
      f._faceBuff = 2.5; // next 2.5s: +damage, +reversal
      if (Math.random() < 0.4) audio.chant('pop');
    }
  }
  if (f.cool > 0 || f.state === 'down') return;
  f.cool = 1.0; f.state = 'attack'; f.stateT = 0.9; f.anim = 'taunt'; f.animT = 0.9;
  // D-pad taunts: up = raise the roof, down = soak it in, left = hard camera, right = trash talk
  dir = (dir === 'down' || dir === 'left' || dir === 'right') ? dir : 'up';
  f._tauntDir = dir;
  const flavor = { up: 'raises the arms!', down: 'soaks it all in!', left: 'plays to the hard camera!', right: 'talks trash at ringside!' }[dir];
  gainAtt(f, TUNING.attitudeGainTaunt);
  match.heat = clamp(match.heat + 0.06, 0, 1);
  audio.pop(0.5);
  toast(`${f.def.name} ${flavor} +ATTITUDE`);
  if (f.isPlayer) updateTron('ATTITUDE UP!', f.def.name);
  refreshCards();
}
// weapons — spatial awareness: must be CLOSE (1.3m) and roughly facing it
function nearestWeapon(f, max = 1.3) {
  let best = null, bd = max;
  for (const w of weapons) {
    if (w.state !== 'ground' || w.broken) continue;
    if (w.kind === 'ladder') continue; // ladders are climbed, not carried
    const d = Math.hypot(f.pos.x - w.mesh.position.x, f.pos.z - w.mesh.position.z);
    if (d > bd) continue;
    // facing check unless basically on top of it
    if (d > 1.0) {
      const want = Math.atan2(w.mesh.position.x - f.pos.x, w.mesh.position.z - f.pos.z);
      let da = Math.abs(((want - f.facing + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (da > 1.4) continue;
    }
    if (d < bd) { bd = d; best = w; }
  }
  return best;
}
function pickupWeapon(f, max) {
  if (f.weapon) { dropWeapon(f); return; }
  const w = nearestWeapon(f, max);
  if (w) {
    w.state = 'carried'; w.holder = f; f.weapon = w;
    toast(w.kind === 'knuckles' ? `${f.def.name} wraps the KNUCKLES on!` : `${f.def.name} grabs a ${weaponLabel(w)}!`);
    audio.blip(400, 0.1, 'square', 0.08);
  } else if (f.isPlayer) {
    // tell them WHY: nearest item distance
    let nd = 99;
    for (const w2 of weapons) {
      if (w2.state !== 'ground' || w2.broken || w2.kind === 'ladder') continue;
      nd = Math.min(nd, Math.hypot(f.pos.x - w2.mesh.position.x, f.pos.z - w2.mesh.position.z));
    }
    toast(nd < 3 ? 'Face the weapon and step closer to grab it!' : 'No weapon nearby — the arsenal is at ringside!');
  }
}
function dropWeapon(f) {
  const w = f.weapon; if (!w) return;
  w.state = 'ground'; w.holder = null; f.weapon = null;
  w.mesh.position.set(f.pos.x + Math.sin(f.facing), groundHeight(f.pos.x, f.pos.z), f.pos.z + Math.cos(f.facing));
  w.mesh.rotation.set(0, f.facing, 0);
}
// Every pickupable swings and hurts: damage, reach, durability and special
// effects all come from the WEAPONS table in data.js.
function weaponLabel(w) { return (w.spec && w.spec.label) || w.kind.toUpperCase(); }
function breakWeapon(att, w) {
  const spec = w.spec || {};
  w.broken = true;
  const held = att && att.weapon === w;
  if (held) dropWeapon(att);
  scene.remove(w.mesh);
  burst(new THREE.Vector3(att ? att.pos.x : w.mesh.position.x, 1.2, att ? att.pos.z : w.mesh.position.z), spec.breakColor || 0xaaaaaa, 16, 6);
  audio.hit('hit');
  announce(`${weaponLabel(w)} DESTROYED!`, att ? att.def.name : '');
  toast(spec.breakMsg || `The ${weaponLabel(w).toLowerCase()} breaks apart!`);
}
function weaponSwing(att) {
  const w = att.weapon; if (!w || w.broken) return;
  if (['down', 'groggy', 'pinned', 'pin', 'submit', 'submitvictim', 'whipped', 'thrown', 'celebrate', 'dive'].includes(att.state)) return;
  const spec = w.spec || { dmg: 10, kb: 1.5, down: true, downTime: 2.2, life: Infinity };
  // thumbtacks aren't swung — they're scattered underfoot
  if (w.kind === 'tacks') { scatterTacks(att); return; }
  const heavy = !!spec.heavy, fast = !!spec.fast;
  att.cool = (heavy ? 1.1 : fast ? 0.45 : 0.8) * TUNING.attackDurMult;
  att.st -= heavy ? 12 : 9; gasUp(att, TUNING.gasWeaponSwing); rootFighter(att);
  att.state = 'attack'; att.stateT = (heavy ? 0.75 : fast ? 0.35 : 0.5) * TUNING.attackDurMult;
  att.anim = 'chop'; att.animT = att.stateT;
  playClip(att, 'strike_chop');
  const gen = att.rev = (att.rev || 0) + 1;
  setTimeout(() => {
    if ((att.rev || 0) !== gen) return; // reversed — dead swing
    if (match.phase !== 'fight') return;
    if (!att.weapon || att.weapon !== w || w.broken) return;
    let hit = false;
    const range = spec.range || 2.4;
    for (const v of fighters) {
      if (v === att || v.eliminated) continue;
      if (dist2(att, v) < range && inFront(att, v)) {
        if (!v.isPlayer && aiTryReverse(v, att, 'strike')) continue;
        applyDamage(v, spec.dmg, att, { kb: spec.kb, from: att.pos, down: spec.down, big: spec.dmg >= 12, downTime: spec.downTime, moveName: weaponLabel(w) + ' SHOT' });
        playClip(v, spec.dmg >= 12 ? 'sold_big' : 'sold_strike');
        hit = true;
        // per-weapon payloads
        if (spec.bleed) bustOpen(v, att); // barbed wire rips flesh
        if (spec.foam) foamBlast(v); // extinguisher blinds
        if (spec.screech) { audio.blip(1800, 0.3, 'sawtooth', 0.12); v.stun = Math.max(v.stun, 0.9); if (v.isPlayer) toast('FEEDBACK SCREECH!'); }
        if (spec.ding) { audio.bell(); v.stun = Math.max(v.stun, 1.0); toast('DING! Right on the head!'); }
        if (spec.clang) audio.blip(900, 0.2, 'square', 0.1);
        if (spec.gold) burst(new THREE.Vector3(v.pos.x, v.pos.y + 1.5, v.pos.z), 0xffd23f, 12, 6);
        if (match.pin && match.pin.att === v) breakPin('BROKEN UP!');
      }
    }
    if (hit) {
      showMove(att, `${weaponLabel(w)} SHOT`);
      burst(att.parts.group.position.clone().add(new THREE.Vector3(0, 1.5, 0)), 0xaaaaaa, 8, 4);
      audio.hit('hit');
      // durability: dents accumulate, last solid shot breaks it apart
      if (w.life !== Infinity) {
        w.life -= 1; w.dents = (w.dents || 0) + 1;
        if (w.life <= 0) breakWeapon(att, w);
        else if (w.life === 1) toast(`The ${weaponLabel(w).toLowerCase()} is about to give!`);
      }
      if (Math.random() < 0.3 && !w.broken && att.weapon === w) { dropWeapon(att); }
    }
  }, heavy ? 260 : 180);
}
// fire extinguisher payload: foam blinds — long stun, white-out flash
function foamBlast(v) {
  v.stun = Math.max(v.stun, 1.4);
  v.hitFlash = 0.8;
  burst(new THREE.Vector3(v.pos.x, v.pos.y + 1.6, v.pos.z), 0xf4f8ff, 22, 8);
  audio.blip(500, 0.3, 'sine', 0.12);
  if (v.isPlayer) toast('BLINDED BY FOAM!');
  else toast(`${v.def.name} is blinded by foam!`);
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
  const vic = fighters.find((v) => v !== att && !v.eliminated && v.state === 'down' && dist2(att, v) < 1.4);
  if (!vic) { if (att.isPlayer) toast('No DOWNED opponent nearby to pin!'); return; }
  match.pin = { att, vic, count: 0, t: 0, phase: 'refrun', id: ++match.id }; rootFighter(att); rootFighter(vic); vic._kickMash = 0;
  att.state = 'pin'; att.stateT = 999; att.pinCool = 4;
  vic.state = 'pinned'; vic._bumpStyle = 'flat'; vic._downRot = -1.5; // pressed flat
  // drape ACROSS the chest: attacker lies perpendicular over the victim,
  // chest-to-chest, head toward the victim's far side
  att.pos.x = vic.pos.x; att.pos.z = vic.pos.z;
  att.pos.y = groundHeight(vic.pos.x, vic.pos.z);
  att.facing = vic.facing + Math.PI / 2;
  announce('PIN ATTEMPT!', `${att.def.name} covers ${vic.def.name}`);
  audio.blip(440, 0.2, 'square', 0.15);
  updateTron('PIN!', `${att.def.name} COVERS`);
}
function breakPin(msg) {
  const p = match.pin; if (!p) return;
  match.pin = null; resetRefPose();
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
    const slide = p.phase === 'refrun' ? 6 : 10; // slide in hard, then plant
    ref.x = lerp(ref.x, p.vic.pos.x + 1.2, Math.min(1, dt * slide));
    ref.z = lerp(ref.z, p.vic.pos.z + 0.6, Math.min(1, dt * slide));
    ref.mesh.position.set(ref.x, groundHeight(ref.x, ref.z), ref.z);
    ref.mesh.rotation.y = Math.atan2(p.vic.pos.x - ref.x, p.vic.pos.z - ref.z);
    poseRefCount(p);
  }
  const step = p.phase === 'refrun' ? TUNING.pinStep1 : TUNING.pinStep2;
  if (p.t < step) return;
  p.t = 0;
  if (p.phase === 'refrun') { p.phase = 'count'; }
  else {
    p.count++;
    audio.count(Math.min(3, p.count));
    announce(`${p.count}!`, p.count >= 3 ? '' : `${p.vic.def.name} must kick out!`);
    shake(0.25);
    // rope break saves at 1-2
    if (nearRopes && p.count < 3 && Math.random() < 0.3) {
      breakPin('ROPE BREAK!');
      toast(`${p.vic.def.name} gets a ROPE BREAK!`);
      return;
    }
    if (p.count >= 3) { endMatch(p.att, p.vic, 'pin'); return; } // THREE — that's the fall
    // ---- kickout logic: ONE is for the healthy, TWO is the drama count ----
    // healthy + fresh kicks at 1; everyone else rides to 2 where HP, gas,
    // button-mashing and protected finishers decide it.
    const hf = p.vic.hp / p.vic.maxhp;
    const gasBonus = p.vic.gasState === 'fresh' ? 0.15 : p.vic.gasState === 'winded' ? 0 : -0.15;
    const aiGrit = p.vic.isPlayer ? 0 : ((p.vic.def.tgh || 5) - 5) * 0.02;
    const mash = Math.min(0.3, (p.vic._kickMash || 0) * 0.06); // Space/J/K mashing
    const drama = p.count === 2 ? match.heat * 0.15 + Math.min(0.1, match.story.nearFalls * 0.03) : 0;
    const prot = (match.time - (p.att.finisherT ?? -99) < 8) ? -0.25 : 0; // protected finisher
    const roll = hf * 0.9 + gasBonus + aiGrit + mash + (p.vic.att / 500) + drama + prot + Math.random() * 0.25;
    p.vic._kickMash = 0;
    const thresh = p.count === 1 ? 0.75 : 0.45;
    if (roll > thresh) {
      // kickout! count-2 escapes are near-falls: crowd explodes, hope rises
      match.pin = null; resetRefPose();
      p.att.state = 'idle'; p.att.cool = 0.8;
      p.vic.state = 'down'; p.vic.downT = 1.0; p.vic.hp = Math.max(p.vic.hp, 4); gasUp(p.vic, TUNING.gasKickout);
      if (p.count >= 2) {
        match.story.nearFalls++;
        match.story.hope = clamp(match.story.hope + 0.25, 0, 1);
        match.heat = clamp(match.heat + 0.18, 0, 1);
        announce('KICK OUT!', `${p.vic.def.name} stays alive!`);
        toast('WHAT A NEAR FALL! The crowd is on its feet!');
        audio.chant(match.story.nearFalls >= 2 ? 'awesome' : 'holy');
      } else {
        announce('KICK OUT!', `${p.vic.def.name} stays alive!`);
      }
      audio.pop(1.2); match.heat = clamp(match.heat + 0.12, 0, 1);
      updateStoryPhase();
      return;
    }
    // stays down — the ref's count continues (mash Space/J/K to fight it!)
    if (p.vic.isPlayer && p.count === 1) toast('Mash SPACE / J / K to KICK OUT!');
  }
}
function endMatch(winner, loser, how) {
  if (match.phase !== 'fight') return;
  match.phase = 'over'; match.winner = winner; match.pin = null; resetRefPose();
  winner.stats.pins += how === 'pin' ? 1 : 0;
  winner.state = 'celebrate'; winner.stateT = 999; winner.anim = 'taunt';
  audio.bell(); audio.pop(1.5);
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
  // pinned? every button press is kickout struggle — mash out!
  if (p.state === 'pinned' && (k === ' ' || k === 'j' || k === 'k')) { p._kickMash = (p._kickMash || 0) + 1; }
  // X-equivalent (strike): tap = light now, hold = heavy on release
  if (k === 'j') { doStrike(p, false); p._jDownAt = performance.now(); }
  // A-equivalent (grapple): follow-up inside tie-ups, else defer to keyup
  if (k === 'k') {
    if (p.tieup) { const c = grappleCatFromKeys() || 'power'; execTieup(p, c); p._kDownAt = 0; }
    else p._kDownAt = performance.now();
  }
  if (k === 'l') {
    // HCTP run button: tap toward ropes/corner = context action, hold = run
    if (!contextAction(p)) p._runKey = true;
  }
  if (k === 'i') { const d = dirHeld(); padDoSpecial(p, d.mag > 0.4); } // LB+RB: special / finisher
  if (k === 'u') { // taunt + held direction = D-pad taunt (none held = up)
    const d = dirHeld();
    doTaunt(p, d.mag < 0.3 ? 'up' : Math.abs(d.dz) >= Math.abs(d.dx) ? (d.dz < 0 ? 'up' : 'down') : (d.dx > 0 ? 'right' : 'left'));
  }
  if (k === 'o') weaponOrTraverse(p);
  if (k === 'f') tryPin(p);
  if (k === 'g') doMomentumShift(p); // Back: momentum shift
  if (k === 'v') { // rest-hold tactics (RS hold equivalent): cycle submit/drain/taunt/rest
    const order = ['submit', 'drain', 'taunt', 'rest'];
    p._restIdx = ((p._restIdx ?? -1) + 1) % order.length;
    doRestHold(p, order[p._restIdx]);
  }
  if (k === 'e') tryRev(p, 'grapple');  // LT: grapple reversal
  if (k === 'r') tryRev(p, 'strike');   // RT: strike reversal
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
  if (match.phase !== 'fight') return;
  const p = player();
  if (!p || p.eliminated) return;
  const k = e.key.toLowerCase();
  if (k === 'l') p._runKey = false;
  // tap = light already fired on keydown; hold = heavy follow-through on release
  if (k === 'j' && p._jDownAt && performance.now() - p._jDownAt > 350) doStrike(p, true);
  if (k === 'j') p._jDownAt = 0;
  // grapple deferred to keyup: tap = light, hold = heavy tie-up
  if (k === 'k' && p._kDownAt) {
    const held = performance.now() - p._kDownAt > 300;
    p._kDownAt = 0;
    if (p.tieup) { const c = grappleCatFromKeys() || 'power'; execTieup(p, c); }
    else if (match.phase === 'fight') doGrapple(p, grappleCatFromKeys() || 'auto', held ? 'heavy' : 'light');
  }
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
  if (p.state === 'top' || p.state === 'laddertop') { diveAttack(p); return true; }
  // ladder first: tipped ladder gets set up, standing ladder gets climbed
  const lad = nearestLadder(p, 1.4) || nearestTippedLadder(p, 1.4);
  if (lad && p.state !== 'dive' && p.state !== 'whipped') {
    if (lad.tipped) { setupLadder(lad); gasUp(p, 3); return true; }
    if (climbLadder(p, lad)) return true;
  }
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
  // outside: ONLY pushing toward the ring climbs back in —
  // pushing away (or along the barricades) never yanks you back in
  if (Math.abs(p.pos.x) < 7.5 && Math.abs(p.pos.z) < 7.5) {
    const toRing = Math.hypot(p.pos.x, p.pos.z) || 1;
    const toward = (wx * (-p.pos.x / toRing) + wz * (-p.pos.z / toRing));
    if (toward > 0.25) {
      climbIntoRing(p);
      return true;
    }
    return false;
  }
  return false;
}
// smooth ring mount: pull up over the apron edge onto the platform
function climbIntoRing(f) {
  if (!f || f.eliminated || f.state === 'climb') return;
  // duration scales with distance so far climbs read as a run-up, not a teleport
  const dist = Math.hypot(clamp(f.pos.x, -3, 3) - f.pos.x, clamp(f.pos.z, -3, 3) - f.pos.z);
  const dur = 0.55 + Math.min(0.8, dist * 0.07);
  f.state = 'climb'; f.stateT = dur; f.anim = 'climb'; f.animT = dur;
  f._climbFrom = { x: f.pos.x, y: f.pos.y, z: f.pos.z };
  f._climbTo = { x: clamp(f.pos.x, -3, 3), y: RING_TOP, z: clamp(f.pos.z, -3, 3) };
  f.vel.set(0, 0, 0); f.vy = 0;
  if (f.isPlayer) toast('Climbing back in...');
  audio.blip(300, 0.12, 'square', 0.08);
}
// RB action button: contextual — get up, dive, ladder setup/climb,
// turnbuckle climb, weapon grab, ring climb. (D-pad took over taunts;
// Y took over focus; Space/STD still work on keyboard/touch.)
function padAction(p) {
  if (!p || p.eliminated || match.phase !== 'fight') return;
  if (p.state === 'down' || p.state === 'pinned') { p.downT = Math.max(0, p.downT - 0.8); toast('Fighting up... mash RB!'); return; }
  if (p.state === 'top' || p.state === 'laddertop') { diveAttack(p); return; }
  // weapon grab FIRST with a generous reach — RB near a weapon always grabs
  if (!p.weapon && nearestWeapon(p, 1.6)) { pickupWeapon(p, 1.6); return; }
  // downed foe nearby: haul them up groggy
  const pd = fighters.find((v) => v !== p && !v.eliminated && isDown(v) && dist2(p, v) < 1.5);
  if (pd) { pickupGroggy(p, pd); return; }
  const s = stickDir();
  // ladder setup/climb works without aiming (proximity only)
  const lad = nearestLadder(p, 1.6) || nearestTippedLadder(p, 1.6);
  if (lad && p.state !== 'dive' && p.state !== 'whipped') {
    if (lad.tipped) { setupLadder(lad); gasUp(p, 3); return; }
    if (climbLadder(p, lad)) return;
  }
  if (s.mag > 0.4 && contextAction(p, s.dx, s.dz)) return; // corner climb / exit / enter
  // turnbuckle climb takes priority at corners
  if (p.pos.y > 0.5 && Math.abs(p.pos.x) > 2.2 && Math.abs(p.pos.z) > 2.2) { cornerOrDive(p); return; }
  // RB gets you OUT: near the edge slips over the ropes, apron steps off —
  // no stick aim needed, nearest edge wins
  if (p.pos.y > 0.5) {
    const ax = Math.abs(p.pos.x), az = Math.abs(p.pos.z), out = Math.max(ax, az);
    if (out > 2.4 && out < APRON_EDGE + 0.4) {
      if (ax > az) p.pos.x += Math.sign(p.pos.x || 1) * 1.5;
      else p.pos.z += Math.sign(p.pos.z || 1) * 1.5;
      const nout = Math.max(Math.abs(p.pos.x), Math.abs(p.pos.z));
      p.facing = Math.atan2(ax > az ? Math.sign(p.pos.x || 1) : 0, ax > az ? 0 : Math.sign(p.pos.z || 1));
      rootFighter(p);
      toast(nout > APRON_EDGE ? 'Drops to ringside!' : nout > ROPE ? 'Out to the apron!' : 'To the ropes!');
      return;
    }
    if (p.isPlayer) toast(out > APRON_EDGE ? 'Walk down to ringside first!' : 'Head to the ropes, then RB to slip out!');
    return;
  }
  // RB gets you IN: anywhere on the floor climbs back in, no gates, no excuses
  if (p.pos.y < 0.5) { climbIntoRing(p); return; }
  if (p.isPlayer) toast('RB: nothing to do here — get near a weapon, body, corner, ladder or the ring!');
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
  if (p.state === 'pinned') { p._kickMash = (p._kickMash || 0) + 1; return; }
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
  if (p.state === 'pinned' && (name === 'strike' || name === 'grapple' || name === 'dive')) { p._kickMash = (p._kickMash || 0) + 1; return; }
  if (name === 'strike') doStrike(p, false);
  else if (name === 'grapple') {
    if (p.tieup) { const c = touchGrappleCat() || 'power'; execTieup(p, c); return; }
    const c = touchGrappleCat();
    if (c) doGrapple(p, c, 'light'); else doWhip(p);
  }
  else if (name === 'fin') padDoSpecial(p, touchMove.mag > 0.4);
  else if (name === 'taunt') {
    doTaunt(p, touchMove.mag < 0.4 ? 'up' : Math.abs(touchMove.y) >= Math.abs(touchMove.x) ? (touchMove.y < 0 ? 'up' : 'down') : (touchMove.x > 0 ? 'right' : 'left'));
  }
  else if (name === 'weapon') {
    if (touchMove.mag > 0.4) weaponOrTraverse(p, touchMove.x, touchMove.y);
    else pickupWeapon(p);
  }
  else if (name === 'pin') tryPin(p);
  else if (name === 'rev') tryRevSmart(p);
  else if (name === 'dive') spaceAction(p);
}
function touchGrappleCat() {
  const m = touchMove.mag;
  if (m <= 0.4) return null;
  const dx = touchMove.x, dy = touchMove.y;
  if (Math.abs(dy) >= Math.abs(dx)) return dy < 0 ? 'power' : 'sub';
  return dx > 0 ? 'quick' : 'sig';
}
// touch tap-vs-hold: HIT/GRP/TNT fire on release (tap = light, hold = heavy)
const touchHeld = {};
function touchBtnDown(name) {
  audio.ensure();
  if (match.phase !== 'fight') return;
  touchHeld[name] = performance.now();
  if (name === 'run') touchRunDown();
}
function touchBtnUp(name) {
  if (name === 'run') { touchRunUp(); delete touchHeld[name]; return; }
  const t0 = touchHeld[name] || 0;
  delete touchHeld[name];
  if (match.phase !== 'fight') return;
  const p = player();
  if (!p || p.eliminated) return;
  const held = performance.now() - t0;
  if (name === 'strike' && held > 320) { doStrike(p, true); return; }
  if (name === 'grapple' && held > 320) {
    // hold = heavy tie-up (uses live stick direction)
    const c = touchGrappleCat();
    if (p.tieup) execTieup(p, c || 'power');
    else if (c) doGrapple(p, c, 'heavy');
    else doWhip(p);
    return;
  }
  if (name === 'taunt' && held > 800) { doMomentumShift(p); return; } // TNT hold = desperation shift
  touchAct(name);
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
    const act = b.dataset.act;
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); touchBtnDown(act); });
    b.addEventListener('pointerup', (e) => { e.preventDefault(); e.stopPropagation(); touchBtnUp(act); });
    b.addEventListener('pointercancel', () => { delete touchHeld[act]; if (act === 'run') touchRun = false; });
  });
  $('touchPause')?.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); togglePause(); });
}

function player() { return fighters.find((f) => f.isPlayer); }
function cornerOrDive(f) {
  // on top / ladder -> dive; near corner in ring -> climb; outside near a post -> climb up
  if (f.state === 'top' || f.state === 'laddertop') { diveAttack(f); return; }
  if (f.pos.y < 0.5) {
    // outside near a corner post: climb straight to the top rope
    const cx = Math.sign(f.pos.x || 1) * 3.4, cz = Math.sign(f.pos.z || 1) * 3.4;
    if (Math.hypot(f.pos.x - cx, f.pos.z - cz) < 1.8) {
      f.state = 'top'; f.topCorner = { x: cx, z: cz }; f.stateT = 999; f.anim = 'top';
      f.pos.x = cx; f.pos.z = cz; f.pos.y = 2.55; f.vy = 0; f.vel.set(0, 0, 0);
      gasUp(f, TUNING.gasClimb);
      toast('Up the post — TOP ROPE! Strike to dive!');
      audio.blip(520, 0.15, 'square', 0.1);
      return;
    }
    return;
  }
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
  // climb back in from the floor (smooth mount, not a teleport)
  if (!onRing && Math.abs(f.pos.x) < 6.5 && Math.abs(f.pos.z) < 6.5) {
    climbIntoRing(f);
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
  const fromLadder = f.state === 'laddertop';
  f.anim = mv.anim; // moonsaults tuck, splashes spread — the pose follows the move
  if (f.ladder && f.ladder.climber === f) f.ladder.climber = null;
  f.ladder = null;
  f.state = 'dive'; f.stateT = 1.0; // f.anim already set to mv.anim above
  f._diveBonus = fromLadder ? 6 : 0; // ladder height = bigger crash
  gasUp(f, fromLadder ? 8 : 4);
  if (fromLadder) announce('OFF THE LADDER!', f.def.name);
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
  f.paceCool = Math.max(0, (f.paceCool || 0) - dt);
  if (f.aiT > 0) return;
  // sim cadence: feeling-out is slow, finish is urgent — never arcade spam
  const phase = (match.story && match.story.phase) || 'feeling';
  f.aiT = phase === 'feeling' ? rand(1.5, 2.4) : phase === 'heat' ? rand(1.0, 1.6) : rand(0.7, 1.1);
  if (f.paceCool > 0) { f.aiMove = { type: 'roam' }; return; }
  // feeling-out: circle, collar-elbow, taunt — no bombs in minute one
  if ((phase === 'feeling' && match.time < 50) || (phase === 'feeling' && Math.random() < 0.5)) {
    const r = Math.random();
    if (r < 0.45) { f.aiMove = { type: 'roam' }; return; }
    if (r < 0.65) { doTaunt(f); f.aiMove = { type: 'roam' }; return; }
    // else fall through to a light lockup only
  }
  // gassed AI backs off and catches its breath instead of spamming
  if ((f.gasState === 'gassed' || (f.gasState === 'winded' && Math.random() < 0.5)) && !match.pin) {
    if (Math.random() < 0.55) { doTaunt(f); f.aiMove = { type: 'roam' }; return; }
    const away = fighters.find((v) => v !== f && !v.eliminated);
    if (away) { f.aiMove = { type: 'seek', x: -away.pos.x * 0.5, z: -away.pos.z * 0.5 }; return; }
  }
  if (match.pin) {
    // break up pins that aren't mine (chaos!)
    const p = match.pin;
    if (p.att !== f && p.vic !== f && Math.random() < 0.5) {
      f.aiMove = { type: 'seek', x: p.att.pos.x, z: p.att.pos.z, attack: true };
      return;
    }
    if (p.vic === f || p.att === f) return;
  }
  if (f.state === 'down' || f.state === 'pinned' || f.state === 'submit' || f.state === 'submitvictim' || f.state === 'pin' || f.state === 'top' || f.state === 'laddertop' || f.state === 'dive' || f.state === 'corner' || f.state === 'climb' || f.state === 'ropehit' || f.state === 'thrown' || f.state === 'groggy') return;
  // pin opportunity?
  const downed = fighters.filter((v) => v !== f && !v.eliminated && v.state === 'down');
  const easy = downed.find((v) => Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z) < 2.2);
  if (easy && f.pinCool <= 0 && Math.random() < 0.75) { tryPin(f); return; }
  // haul them up groggy to keep the offense going (not every time — breathe)
  const nearDown = downed.find((v) => Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z) < 1.5);
  if (nearDown && !match.pin && Math.random() < 0.45) { doGrapple(f, 'auto', 'light'); return; }
  // pick target
  let tgt = null, bd = 1e9;
  for (const v of fighters) {
    if (v === f || v.eliminated || isDown(v)) continue;
    const d = Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z);
    if (d < bd) { bd = d; tgt = v; }
  }
  // finisher? (AI hypes first like the player: taunt to full, LB+RB hype, then finisher)
  if (f.att >= 100 && !(f.specialT > 0)) {
    if (bd > 3 && Math.random() < 0.5) { doTaunt(f); return; }
    padDoSpecial(f, false);
    return;
  }
  if (f.specialT > 0 || f.att >= 100) {
    if (tgt && bd < 2.4) { doFinisher(f); return; }
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
  // ladder dive: agile heels climb when a foe is down nearby and the ladder stands free
  if (f.def.spd >= 7 && f.pos.y < 0.5 && Math.random() < 0.08) {
    const lad = nearestLadder(f, 7);
    const foeDown = fighters.some((v) => v !== f && !v.eliminated && v.state === 'down' &&
      Math.hypot(v.pos.x - (lad ? lad.mesh.position.x : f.pos.x), v.pos.z - (lad ? lad.mesh.position.z : f.pos.z)) < 6);
    if (lad && foeDown && !fighters.some((v) => v !== f && !v.eliminated && v.state === 'laddertop')) {
      if (Math.hypot(f.pos.x - lad.mesh.position.x, f.pos.z - lad.mesh.position.z) < 1.6) {
        climbLadder(f, lad);
        f._ladderDiveT = setTimeout(() => { if (f.state === 'laddertop') diveAttack(f); }, 1100);
        return;
      }
      f.aiMove = { type: 'ladder', w: lad }; return;
    }
  }
  if (f.state === 'laddertop' && !f._ladderDiveT) {
    f._ladderDiveT = setTimeout(() => { f._ladderDiveT = null; if (f.state === 'laddertop') diveAttack(f); }, 1100);
    return;
  }
  // ---- Crowd Reaction Engine: AI optimizes for heat, not damage ----
  // heel: cheap shots + taunts when booed (momentum buff). face: comebacks + pops.
  if (phase === 'heat' && f.def.align === 'HEEL' && match.heat > 0.55 && Math.random() < 0.25) {
    doTaunt(f); // taunt the crowd, heat rises, heel gets buff in doTaunt
    audio.chant('boo');
    f.aiMove = { type: 'hold' }; return;
  }
  if ((phase === 'hope' || phase === 'finish') && f.def.align === 'FACE' && f.hp < tgt.hp && Math.random() < 0.3) {
    doTaunt(f); // play to the crowd — comeback pop
    audio.chant('pop');
    f.aiMove = { type: 'hold' }; return;
  }
  // ---- Risk-Reward Matrix: Utility = desperation × crowd − stamina cost ----
  {
    const desp = clamp(1 - f.hp / f.maxhp, 0, 1) + (match.story.nearFalls || 0) * 0.15 + (match.time > 240 ? 0.3 : 0);
    const util = desp * (0.5 + match.heat) - (f.gas || 0) / 100;
    f._riskUtil = util;
    // desperate heel: grab a weapon late (risk: DQ heat, reward: steal it)
    if (f.def.align === 'HEEL' && !f.weapon && (f.hp / f.maxhp < 0.25 || match.time > 240) && util > 0.45 && Math.random() < 0.5) {
      const w = nearestWeapon(f, 8);
      if (w) { f.aiMove = { type: 'weapon', w }; return; }
    }
    // desperate face: heroic high-risk dive late (reward: massive pop)
    if (f.def.align === 'FACE' && f.hp / f.maxhp < 0.3 && util > 0.5 && Math.random() < 0.35 && inRing(f.pos.x, f.pos.z)) {
      f.aiMove = { type: 'corner' }; return;
    }
    // early / gassed: no high risk — breathe instead
    if ((match.time < 60 || (f.gasState && f.gasState !== 'fresh')) && util < 0.3 && Math.random() < 0.4) {
      f.aiMove = { type: 'roam' }; return;
    }
  }
  if (bd < 1.45) { // real wrestling range — must be close to lock up
    const critical = tgt.hp <= 12;
    const leading = f.hp >= tgt.hp;
    const heelHeat = f.def.align === 'HEEL' && leading && match.story.phase === 'heat';
    const faceHope = f.def.align === 'FACE' && !leading && (match.story.phase === 'hope' || match.story.phase === 'finish');
    const r = Math.random();
    // heels in heat work rest holds: chinlocks, wear-down, crowd hates it (correct)
    if (phase === 'heat' && f.def.align === 'HEEL' && leading && r < 0.4) {
      doGrapple(f, 'sub', 'heavy');
      f.aiMove = { type: 'hold' }; return;
    }
    if (critical) {
      if (r < 0.7) doGrapple(f, 'auto', Math.random() < 0.4 ? 'heavy' : 'light');
      else doStrike(f);
    } else if (heelHeat) {
      if (r < 0.25) doTaunt(f);
      else if (r < 0.65) doGrapple(f, 'sub', 'heavy');
      else doStrike(f);
    } else if (faceHope) {
      if (r < 0.5) doStrike(f);
      else doGrapple(f, 'auto', Math.random() < 0.25 ? 'heavy' : 'light');
    } else if (phase === 'feeling') {
      // feeling-out wrestling: light lockups only, no finishers, no spam
      if (r < 0.7) doGrapple(f, 'auto', 'light');
      else if (r < 0.85) doStrike(f);
      else doTaunt(f);
    } else if (f.att > 55 && r < 0.12) doTaunt(f);
    else if (r < 0.45) doStrike(f);
    else if (r < 0.75) doGrapple(f, 'auto', Math.random() < 0.25 ? 'heavy' : 'light');
    else doWhip(f);
    f.aiMove = { type: 'hold' };
  } else {
    f.aiMove = { type: 'seek', x: tgt.pos.x, z: tgt.pos.z, attack: bd < 4, tgt };
  }
}
function aiSteer(f, dt) {
  const mv = f.aiMove;
  if (!mv || f.state === 'down' || f.state === 'pin' || f.state === 'submit' || f.state === 'whipped' || f.state === 'top' || f.state === 'laddertop' || f.state === 'corner' || f.state === 'climb' || f.state === 'ropehit' || f.state === 'thrown' || f.state === 'groggy') return { x: 0, z: 0, run: false };
  if (mv.type === 'seek') {
    const dx = mv.x - f.pos.x, dz = mv.z - f.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 1.1) return { x: 0, z: 0, run: false };
    // climb in if outside ring and target inside
    if (f.pos.y < 0.5 && Math.abs(mv.x) <= 3 && Math.abs(mv.z) <= 3 && Math.abs(f.pos.x) < 5.5 && Math.abs(f.pos.z) < 5.5 && d < 3.5) {
      climbIntoRing(f);
    }
    return { x: dx / (d || 1), z: dz / (d || 1), run: d > 5 };
  }
  if (mv.type === 'weapon' && mv.w && mv.w.state === 'ground') {
    const dx = mv.w.mesh.position.x - f.pos.x, dz = mv.w.mesh.position.z - f.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 1.1) { pickupWeapon(f); f.aiMove = null; return { x: 0, z: 0, run: false }; }
    return { x: dx / d, z: dz / d, run: true };
  }
  if (mv.type === 'corner') {
    const cx = Math.sign(f.pos.x || 1) * 3.4, cz = Math.sign(f.pos.z || 1) * 3.4;
    const dx = cx - f.pos.x, dz = cz - f.pos.z, d = Math.hypot(dx, dz);
    if (d < 0.8) { cornerOrDive(f); f.aiMove = null; setTimeout(() => { if (f.state === 'top' || f.state === 'laddertop') diveAttack(f); }, 900); return { x: 0, z: 0, run: false }; }
    return { x: dx / d, z: dz / d, run: true };
  }
  if (mv.type === 'ladder' && mv.w && !mv.w.broken && !mv.w.tipped) {
    const dx = mv.w.mesh.position.x - f.pos.x, dz = mv.w.mesh.position.z - f.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 1.2) {
      if (climbLadder(f, mv.w)) {
        f._ladderDiveT = setTimeout(() => { f._ladderDiveT = null; if (f.state === 'laddertop') diveAttack(f); }, 1100);
      }
      f.aiMove = null; return { x: 0, z: 0, run: false };
    }
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
  if (f.specialT > 0) { f.specialT = Math.max(0, f.specialT - dt); if (f.specialT === 0 && f.isPlayer) toast('Hype faded — rebuild the meter!'); }
  f.st = Math.min(TUNING.stamina, f.st + dt * 10);
  // gassing: drains at rest, faster when down/idle; states gate speed + damage
  const resting = ['down', 'pinned', 'submitvictim', 'idle'].includes(f.state) || (f.restHold && f.restHold.kind === 'rest');
  f.gas = clamp(f.gas - dt * (resting ? TUNING.gasRestDrain : TUNING.gasIdleDrain), 0, TUNING.gasMax);
  const gs = f.gas >= TUNING.gasGassedAt ? 'gassed' : f.gas >= TUNING.gasWindedAt ? 'winded' : 'fresh';
  if (gs !== f.gasState) {
    f.gasState = gs;
    if (gs !== 'fresh' && f.isPlayer) toast(gs === 'gassed' ? 'GASSED! Slow down, rest, or tag out!' : 'Getting winded — pace yourself!');
    if (gs !== 'fresh') audio.blip(gs === 'gassed' ? 140 : 200, 0.2, 'sawtooth', 0.07);
  }
  f.hitFlash = Math.max(0, f.hitFlash - dt);
  if (f.stun > 0) f.stun -= dt;
  if (f._faceBuff > 0) f._faceBuff -= dt;
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

  const busy = ['attack', 'grapple', 'victim', 'pin', 'submit', 'submitvictim', 'pinned', 'celebrate', 'corner', 'climb', 'laddertop', 'ropehit', 'thrown', 'groggy'].includes(f.state);
  const canMove = !busy && f.state !== 'down' && f.state !== 'top' && f.state !== 'dive';

  // state timers
  if (f.state === 'corner') {
    f.stateT -= dt;
    if (f.stateT <= 0) { f.state = 'idle'; }
  }
  if (f.state === 'climb') {
    // smooth mount over the apron: lerp floor -> platform
    f.stateT -= dt;
    const pr = f.animT ? clamp(1 - f.stateT / f.animT, 0, 1) : 1;
    const e = pr * pr * (3 - 2 * pr);
    f.pos.x = lerp(f._climbFrom.x, f._climbTo.x, e);
    f.pos.z = lerp(f._climbFrom.z, f._climbTo.z, e);
    f.pos.y = lerp(f._climbFrom.y, f._climbTo.y, e);
    f.facing = angLerp(f.facing, Math.atan2(-f.pos.x, -f.pos.z), Math.min(1, 8 * dt));
    if (f.stateT <= 0) {
      f.state = 'idle'; f.anim = '';
      f.pos.x = f._climbTo.x; f.pos.z = f._climbTo.z; f.pos.y = f._climbTo.y;
      if (f.isPlayer) toast('Back in the ring!');
    }
    // pose + transform below still run so the climb animates
  }
  if (f.state === 'attack' || f.state === 'grapple' || f.state === 'victim') {
    f.stateT -= dt;
    if (f.stateT <= 0 && f.state !== 'victim') { f.state = 'idle'; }
  }
  if (f.state === 'getup') {
    f.stateT -= dt;
    if (f.stateT <= 0) { f.state = 'idle'; }
  }
  if (f.state === 'groggy') {
    f.stateT -= dt;
    if (f.stateT <= 0) {
      // wrecked wrestlers slump back down instead of recovering
      if (f.hp / Math.max(1, f.maxhp) < 0.2 && Math.random() < 0.5) knockDown(f, 2.5);
      else { f.state = 'idle'; f.anim = ''; }
    }
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
  if (f.state === 'ropehit') {
    // VPG advanceRopeHit: ride the rope give outward, spin back-to-ropes, launch
    f.stateT -= dt;
    const r = f._rope;
    if (r) {
      const give = clamp(ropeSpr[r.wall] ? ropeSpr[r.wall].x : 0, 0, ROPE_GIVE);
      f.pos.x = r.ax + r.ox * give; f.pos.z = r.az + r.oz * give;
      f.facing = angLerp(f.facing, Math.atan2(r.rx, r.rz), Math.min(1, ROPE_TURN * dt));
    }
    if (f.stateT <= 0) launchFromRopes(f);
  }

  // movement input
  let mx = 0, mz = 0, wantRun = false;
  if (canMove) {
    if (f.isPlayer && input) { mx = input.x; mz = input.z; wantRun = input.run; }
    else if (!f.isPlayer) { const s = aiSteer(f, dt); mx = s.x; mz = s.z; wantRun = s.run; }
    // auto rope rebound: keep running rope-to-rope until the player steers.
    // Any real stick input cancels the loop instantly.
    if (f.rebound && Math.hypot(mx, mz) < 0.15 && f.stun <= 0) {
      mx = f.rebound.x; mz = f.rebound.z; wantRun = true;
    } else if (f.rebound && Math.hypot(mx, mz) >= 0.15) {
      f.rebound = null;
    }
  } else {
    f.rebound = null; // only runners ride the ropes
  }
  const ropeAmp = (f.ropeBoost > 0 && wantRun) ? 1.15 : 1;
  const legHurt = (f.limb && f.limb.leg || 0) / 100;
  const gasPace = f.gasState === 'gassed' ? 0.55 : f.gasState === 'winded' ? 0.8 : 1;
  const spd = (2.1 + f.def.spd * 0.16) * (wantRun ? TUNING.runPace : TUNING.walkPace) * (1 - 0.25 * (f.fatigue || 0)) * (1 - 0.35 * legHurt) * gasPace * ropeAmp;
  const asl = Math.hypot(mx, mz);
  if (asl > 0.01 && canMove && f.stun <= 0) {
    const nx = mx / Math.max(1, asl), nz = mz / Math.max(1, asl);
    // heavyweight inertia: slow to start, slow to stop, slow to turn at speed
    const bulk = f.def.bulk || 1.0;
    const curSpd = Math.hypot(f.vel.x, f.vel.z);
    const acc = (f.pos.y > 0.5 ? 9 : 7) / bulk * (wantRun ? 0.8 : 1.0);
    const rate = Math.min(1, acc * dt);
    // turning bleeds speed — no arcade snap-turns at full sprint
    const wantAng = Math.atan2(nx, nz);
    let dAng = Math.abs(((wantAng - f.facing + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    const turnRate = (wantRun ? 3.0 : 6.0) / bulk;
    f.facing = angLerp(f.facing, wantAng, Math.min(1, turnRate * dt));
    const turnBleed = 1 - Math.min(0.45, dAng * 0.25 * (curSpd > 2 ? 1 : 0.3));
    f.vel.x = lerp(f.vel.x, nx * spd * turnBleed, rate);
    f.vel.z = lerp(f.vel.z, nz * spd * turnBleed, rate);
    // stride-synced steps: phase advances with DISTANCE traveled, not time —
    // feet strike the mat at the speed the body moves, so nobody ice-skates.
    // (Blocked against a wall = vel ~0 = feet stop. No moonwalking.)
    f.walkPhase += (Math.hypot(f.vel.x, f.vel.z) * dt) / (wantRun ? 1.1 : 0.85) * Math.PI;
    if (wantRun) { f.st = Math.max(0, f.st - dt * 6); f.gas = clamp(f.gas + dt * TUNING.gasRun, 0, TUNING.gasMax); }
    f.state = wantRun ? 'run' : 'walk';
  } else if (canMove) {
    // weighty friction: glide out, don't snap-stop
    const drag = f.pos.y > 0.5 ? 6.5 : 5.0;
    f.vel.x *= (1 - Math.min(1, drag * dt));
    f.vel.z *= (1 - Math.min(1, drag * dt));
    if (Math.abs(f.vel.x) < 0.05) f.vel.x = 0;
    if (Math.abs(f.vel.z) < 0.05) f.vel.z = 0;
    if (f.state === 'walk' || f.state === 'run') f.state = 'idle';
  }
  // mat friction: downed bodies grind to a halt, never slide across the ring
  if (f.state === 'down' || f.state === 'pinned' || f.state === 'submitvictim' || f.state === 'pin' || f.state === 'submit') {
    const mat_drag = 10;
    f.vel.x *= (1 - Math.min(1, mat_drag * dt));
    f.vel.z *= (1 - Math.min(1, mat_drag * dt));
    if (Math.hypot(f.vel.x, f.vel.z) < 0.4) { f.vel.x = 0; f.vel.z = 0; }
  }
  // integrate (skipped while rooted — planted bodies never skate)
  if (!ROOTED.has(f.state)) { f.pos.x += f.vel.x * dt; f.pos.z += f.vel.z * dt; }
  // ropes / exits (skipped while rooted and mid-climb/perch)
  if (!ROOTED.has(f.state)) ropeCheck(f, f.state === 'whipped');
  // walls: ring skirt, barricades, stage flanks (whipped into them = pain)
  if (!ROOTED.has(f.state)) collideWalls(f, dt);
  // confines: arena bounds
  f.pos.x = clamp(f.pos.x, -13, 13); f.pos.z = clamp(f.pos.z, -15.5, 13); // -z reaches the stage
  // turnbuckle crash: high-speed corner impact crumples the victim (avalanche setup)
  if (f.pos.y > 0.5 && Math.abs(f.pos.x) > 2.9 && Math.abs(f.pos.z) > 2.9) {
    const cspd = Math.hypot(f.vel.x, f.vel.z);
    if (cspd > 6 && f.state !== 'down' && f.state !== 'top' && f.state !== 'laddertop' && f.state !== 'dive' && f.state !== 'thrown' && (f.cornerT || 0) <= 0) {
      f.state = 'corner'; f.stateT = 1.1; f.anim = 'lockup'; f.animT = 1.1;
      f.vel.multiplyScalar(0.2); f.cornerT = 4; f.stun = Math.max(f.stun, 0.8);
      matHit(0.4); shake(0.5); audio.hit('hit');
      if (f.isPlayer) toast('CORNER CRASH! Avalanche window open!');
      match.heat = clamp(match.heat + 0.06, 0, 1);
    }
  }

  // vertical (perches pin Y like climb: turnbuckle + ladder tops hold until the dive)
  const gh = (f.state === 'climb' || f.state === 'top' || f.state === 'laddertop') ? f.pos.y : groundHeight(f.pos.x, f.pos.z);
  const airborne = f.pos.y > gh + 0.02 || f.vy > 0.01;
  if (airborne || f.state === 'dive') {
    f.vy -= GRAV * dt;
    f.pos.y += f.vy * dt;
    if (f.pos.y <= gh) {
      const fall = -f.vy;
      f.pos.y = gh; f.vy = 0;
      if (f.state === 'thrown') { landThrown(f, fall); }
      else if (f.state === 'dive') {
        // dive landing: AoE around landing - HIGH IMPACT
        const mv = f._diveMove || { name: 'CROSSBODY', dmg: 13 };
        let hit = false;
        for (const v of fighters) {
          if (v === f || v.eliminated) continue;
          if (Math.hypot(f.pos.x - v.pos.x, f.pos.z - v.pos.z) < 2.1) {
            applyDamage(v, (mv.baseDamage ?? mv.dmg ?? 0) + (f._diveBonus || 0), f, { kb: 2.2, from: f.pos, down: true, big: true, launch: 2.6, downTime: 3.2, moveName: mv.name + ((f._diveBonus || 0) > 0 ? ' OFF THE LADDER' : '') });
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
    // NEVER yank floor bodies up: a fighter standing at ringside next to the
    // ring stays at ringside. Only snap when already at surface height.
    // (This was teleporting ringside bodies up onto the apron/ring —
    // moves done outside stayed outside from here on.)
    if (Math.abs(f.pos.y - gh) < 0.6) f.pos.y = gh;
    // walked off the apron edge -> step down to the floor
    if (f.pos.y === RING_TOP && (Math.abs(f.pos.x) > APRON_EDGE || Math.abs(f.pos.z) > APRON_EDGE)) {
      // now over floor: drop
      f.pos.y = Math.max(0, f.pos.y - 3 * dt);
    }
  }
  // friction when grounded & idle
  if (!airborne && (f.state === 'idle' || f.state === 'attack')) {
    f.vel.x *= (1 - Math.min(1, 6 * dt)); f.vel.z *= (1 - Math.min(1, 6 * dt));
  }

  // table break check (big bumps near table) + ladder tipping on hard landings
  for (const w of weapons) {
    if ((w.kind === 'table' || w.kind === 'announce') && !w.broken && f.state === 'down') {
      const d = Math.hypot(f.pos.x - w.mesh.position.x, f.pos.z - w.mesh.position.z);
      if (d < 1.6 && f.pos.y < 0.5) breakTable(w, f);
    }
    if (w.kind === 'ladder' && !w.broken && !w.tipped && f.state === 'down' && f.pos.y < 0.5) {
      const d = Math.hypot(f.pos.x - w.mesh.position.x, f.pos.z - w.mesh.position.z);
      if (d < 1.5) tipLadder(w);
    }
  }
  // standing ladders are solid: push bodies around the rails
  for (const w of weapons) {
    if (w.kind !== 'ladder' || w.broken || w.tipped) continue;
    if (f.state === 'laddertop' && f.ladder === w) continue;
    const dx = f.pos.x - w.mesh.position.x, dz = f.pos.z - w.mesh.position.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.6 && d > 0.001 && f.pos.y < 1.5) {
      f.pos.x = w.mesh.position.x + (dx / d) * 0.6;
      f.pos.z = w.mesh.position.z + (dz / d) * 0.6;
    }
  }

  // ---- carried victim rides the attacker's anchor (lift phase of throws) ----
  if (f.carriedBy && !f.carriedBy.eliminated && match.phase === 'fight') {
    const a = f.carriedBy;
    const an = CARRY_ANCHORS[f.carryAnchor || 'overhead'] || CARRY_ANCHORS.overhead;
    const fx = Math.sin(a.facing), fz = Math.cos(a.facing);
    const rx = Math.cos(a.facing), rz = -Math.sin(a.facing);
    f.pos.x = a.pos.x + rx * an[0] + fx * an[2];
    f.pos.z = a.pos.z + rz * an[0] + fz * an[2];
    f.pos.y = a.pos.y + an[1] * ((a.parts.group.position.y - a.pos.y) * 0.3 + 0.7);
    f.vy = 0; f.vel.set(0, 0, 0);
  }
  // ---- pose (sets group transform first so anims can add offsets) ----
  P.group.position.copy(f.pos);
  P.group.rotation.y = f.facing;
  poseFighter(f, dt);
  // hit flash across all body materials
  const flash = f.hitFlash > 0;
  for (const m of (P.mats || [])) { if (m.emissive) m.emissive.setHex(flash ? 0x771414 : 0x000000); }
  P.aura.material.opacity = (f.att >= 100 || f.specialT > 0) ? (0.5 + Math.sin(performance.now() * 0.012) * 0.4) : 0;
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
const _rv0 = new THREE.Vector3(), _rv1 = new THREE.Vector3(), _rd = new THREE.Vector3(), _rq = new THREE.Quaternion();
function stepRopes(dt) {
  // VPG spring integration: fixed 1/120 substeps, settle epsilon 1e-4
  const frame = Math.min(dt, 0.1), step = 1 / 120;
  for (let t = 0; t < frame; t += step) {
    const h = Math.min(step, frame - t);
    for (const k of Object.keys(ropeSpr)) {
      const s = ropeSpr[k];
      const a = -ROPE_K * s.x - ROPE_C * s.v;
      s.v += a * h; s.x += s.v * h;
      if (Math.abs(s.x) > ROPE_MAXBOW) { s.x = Math.sign(s.x) * ROPE_MAXBOW; s.v *= 0.5; }
      if (Math.abs(s.x) < 1e-4 && Math.abs(s.v) < 1e-4) { s.x = 0; s.v = 0; }
    }
  }
  if (!arena.ropes) return;
  const n = 7;
  for (const r of arena.ropes) {
    const bow = clamp(ropeSpr[r.wall].x, -ROPE_MAXBOW, ROPE_MAXBOW) * r.weight;
    if (Math.abs(bow) < 1e-4) {
      if (!r.settled) {
        for (let i = 0; i < n - 1; i++) {
          const s0 = i / (n - 1), s1 = (i + 1) / (n - 1);
          poseRopeSeg(r, s0, s1, 0);
        }
        r.settled = true;
      }
      continue;
    }
    r.settled = false;
    for (let i = 0; i < n - 1; i++) {
      poseRopeSeg(r, i / (n - 1), (i + 1) / (n - 1), bow);
    }
  }
  // ties ride the middle-strand bow of their wall
  if (arena.ropeTies) {
    for (const t of arena.ropeTies) {
      const bow = clamp(ropeSpr[t.wall].x, -ROPE_MAXBOW, ROPE_MAXBOW);
      const off = Math.sin(Math.PI * t.s) * bow;
      t.mesh.position.x = t.baseX + t.ox * off;
      t.mesh.position.z = t.baseZ + t.oz * off;
    }
  }
}
function ropePoint(r, s, bow, out) {
  const span = -ROPE + ROPE * 2 * s, bend = Math.sin(Math.PI * s) * bow;
  if (r.wall === 'px' || r.wall === 'nx') out.set(r.fixed, r.y, span); // fixed x, run along z
  else out.set(span, r.y, r.fixed); // fixed z, run along x
  out.x += r.ox * bend; out.z += r.oz * bend;
  return out;
}
function poseRopeSeg(r, s0, s1, bow) {
  const i = Math.round(s0 * 6);
  ropePoint(r, s0, bow, _rv0); ropePoint(r, s1, bow, _rv1);
  const m = r.segs[i];
  m.position.copy(_rv0).add(_rv1).multiplyScalar(0.5);
  _rd.copy(_rv1).sub(_rv0).normalize();
  m.quaternion.setFromUnitVectors(r._up, _rd);
}
// ---------- wall collision (ring skirt / barricades / stage) ----------
// Sides are walls: walking in slides along, but getting whipped or sprinting
// in at speed crumples you into the steel and you sell it.
function collideWalls(f, dt) {
  const walls = arena.walls;
  if (!walls || !walls.length) return;
  const R = 0.45; // body radius
  const evx = f.vel.x + (f.whipped ? f.whipped.x : 0);
  const evz = f.vel.z + (f.whipped ? f.whipped.z : 0);
  for (const w of walls) {
    if (w.maxY !== undefined && f.pos.y > w.maxY) continue;
    const dx = w.x2 - w.x1, dz = w.z2 - w.z1;
    const len2 = dx * dx + dz * dz;
    if (len2 < 1e-6) continue;
    let tt = ((f.pos.x - w.x1) * dx + (f.pos.z - w.z1) * dz) / len2;
    tt = clamp(tt, 0, 1);
    const cx = w.x1 + dx * tt, cz = w.z1 + dz * tt;
    let nx = f.pos.x - cx, nz = f.pos.z - cz;
    const d = Math.hypot(nx, nz);
    if (d >= R) continue;
    if (d < 1e-4) { nx = -dz; nz = dx; } else { nx /= d; nz /= d; }
    // push out of the wall
    f.pos.x = cx + nx * R; f.pos.z = cz + nz * R;
    const vn = evx * nx + evz * nz; // closing speed (negative = into wall)
    if (vn >= -0.5) {
      // gentle contact: kill inward drift, slide along
      const k = Math.min(1, -vn);
      f.vel.x -= nx * vn * k; f.vel.z -= nz * vn * k;
      continue;
    }
    const impact = -vn;
    if (impact > 2.8 && (f.state === 'whipped' || f.state === 'run' || f.state === 'dive' || f.state === 'thrown' || impact > 4.5)) {
      wallBump(f, w, impact);
      return; // down — stop checking further walls this frame
    }
    // firm walking contact: stop, don't pass through
    f.vel.x -= nx * vn; f.vel.z -= nz * vn;
  }
}
function wallBump(f, w, impact) {
  f.whipped = null;
  f.vel.set(0, 0, 0); f.rebound = null;
  const what = w.tag === 'barricade' ? 'BARRICADE' : w.tag === 'stage' ? 'STAGE' : 'RING SKIRT';
  burst(new THREE.Vector3(f.pos.x, f.pos.y + 1.2, f.pos.z), 0xaaaaaa, 16, 6);
  audio.hit('hit'); audio.pop(1.3); shake(0.8); matHit(0.4);
  applyDamage(f, Math.round(6 + impact * 0.9), null, { kb: 0, down: true, big: true, downTime: 3.2, moveName: 'THROWN INTO THE ' + what });
  match.heat = clamp(match.heat + 0.08, 0, 1);
  announce('INTO THE ' + what + '!', `${f.def.name} crashes hard!`);
  if (f.isPlayer) toast(`Whipped into the ${what.toLowerCase()}!`);
  gasUp(f, 8);
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
    const wall = ax > az ? (f.pos.x > 0 ? 'px' : 'nx') : (f.pos.z > 0 ? 'pz' : 'nz');
    ropeImpact(wall, speed); // feed the elastic-rope spring (VPG RingRopes feed)
    // runners lean into the ropes (VPG ropeHit): 0.33 s chest-first ride, then launch.
    // Corners keep the instant reflect so the avalanche crash still triggers.
    const cornerZone = Math.abs(f.pos.x) > 2.9 && Math.abs(f.pos.z) > 2.9;
    if (f.state === 'run' && !f.whipped && !cornerZone) { startRopeHit(f, wall, speed); return; }
    const tune = arenaTune();
    const rest = 0.55 + 0.25 * tune.bounce; // restitution by ring tune
    if (ax > az) { f.pos.x = Math.sign(f.pos.x) * (ROPE - 0.05); f.vel.x *= -rest; f.vel.z *= 0.7; }
    else { f.pos.z = Math.sign(f.pos.z) * (ROPE - 0.05); f.vel.z *= -rest; f.vel.x *= 0.7; }
    f.ropeEnergy = clamp(speed / 9, 0.2, 1);
    f.ropeBoost = 0.6; // timed-press window: hit run (Shift) to amplify
    // auto rebound: a running wrestler keeps running rope-to-rope until steered.
    // Manual stick input cancels it; gassed runners stumble out of the loop.
    if (f.state === 'run' && !f.whipped) {
      const sp = Math.hypot(f.vel.x, f.vel.z);
      if (sp > 1.5) {
        f.rebound = { x: f.vel.x / sp, z: f.vel.z / sp, bounces: (f.rebound ? f.rebound.bounces + 1 : 1) };
        if (f.gasState === 'gassed' && f.rebound.bounces > 1) {
          f.rebound = null; // gassed: stumble out of the loop
          f.stun = Math.max(f.stun, 0.4);
          if (f.isPlayer) toast('Gassed! You stumble out of the run!');
        } else if (f.isPlayer && f.rebound.bounces === 1) {
          toast('Rebounding! Steer to break the loop, keep running to ride it.');
        }
      }
    }
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
    // slow walk into the ropes -> duck through to the apron, then off to the floor.
    // Outward intent = velocity pointing out of the ring. Idle bodies stay put.
    const nx = ax > az ? Math.sign(f.pos.x) : 0, nz = ax > az ? 0 : Math.sign(f.pos.z);
    const outward = f.vel.x * nx + f.vel.z * nz;
    if (outward > 0.8 && out < APRON_EDGE + 0.6) {
      // let them through: gentle guidance, no clamp-back
      f.vel.multiplyScalar(1 - Math.min(1, 2 * 0.016));
      if (!f._apronToast && out > ROPE + 0.1) {
        f._apronToast = true;
        if (f.isPlayer) toast('Out to the APRON — keep walking to drop to ringside!');
        setTimeout(() => { f._apronToast = false; }, 8000);
      }
    } else {
      // drifting without intent: keep inside the ropes
      if (out > ROPE + 0.25) {
        if (ax > az) f.pos.x = Math.sign(f.pos.x) * (ROPE + 0.2);
        else f.pos.z = Math.sign(f.pos.z) * (ROPE + 0.2);
        f.vel.multiplyScalar(0.3);
      }
    }
  }
}
// VPG ropeHit/rebound port: lean on the ropes chest-first (Hit_Chest sell),
// ride the rope give, spin back-to-ropes, then launch at 1.37x run speed.
function startRopeHit(f, wall, speed) {
  const ax = Math.abs(f.pos.x) > Math.abs(f.pos.z);
  const sx = Math.sign(f.pos.x) || 1, sz = Math.sign(f.pos.z) || 1;
  const anchorX = ax ? sx * (ROPE - 0.05) : f.pos.x;
  const anchorZ = ax ? f.pos.z : sz * (ROPE - 0.05);
  const ox = ax ? sx : 0, oz = ax ? 0 : sz; // wall outward
  // rebound = reflect the incoming (dominant) axis, preserve the other (VPG:
  // glancing hits stay angled, dead-on hits push straight off)
  let rx, rz;
  if (ax) { rx = -f.vel.x; rz = f.vel.z * 0.7; }
  else { rx = f.vel.x * 0.7; rz = -f.vel.z; }
  let rl = Math.hypot(rx, rz);
  if (rl < 0.5) { rx = -ox; rz = -oz; rl = 1; }
  f._rope = { ax: anchorX, az: anchorZ, ox, oz, rx: rx / rl, rz: rz / rl, wall };
  f.pos.x = anchorX; f.pos.z = anchorZ; f.vel.set(0, 0, 0);
  f.state = 'ropehit'; f.stateT = ROPE_HIT_T;
  f.facing = Math.atan2(f._rope.rx, f._rope.rz);
  playClip(f, 'sold_strike'); // chest-into-the-ropes sell (VPG Hit_Chest)
  audio.blip(180, 0.1, 'square', 0.06);
  gasUp(f, 2); // hitting the ropes takes a little wind out
}
function launchFromRopes(f) {
  const r = f._rope;
  f._rope = null;
  const spd = runSpeedOf(f) * REBOUND_MULT;
  f.pos.x = r ? r.ax : f.pos.x; f.pos.z = r ? r.az : f.pos.z;
  if (r) f.vel.set(r.rx * spd, 0, r.rz * spd);
  f.state = 'run';
  f.ropeEnergy = clamp(spd / 9, 0.2, 1);
  f.ropeBoost = 0.6; // timed-press window: hit run (Shift) to amplify
  // auto rebound bookkeeping (moved here from the instant-reflect path)
  if (spd > 1.5) {
    f.rebound = { x: f.vel.x / spd, z: f.vel.z / spd, bounces: (f.rebound ? f.rebound.bounces + 1 : 1) };
    if (f.gasState === 'gassed' && f.rebound.bounces > 1) {
      f.rebound = null; // gassed: stumble out of the loop
      f.stun = Math.max(f.stun, 0.4);
      if (f.isPlayer) toast('Gassed! You stumble out of the run!');
    } else if (f.isPlayer && f.rebound.bounces === 1) {
      toast('Rebounding! Steer to break the loop, keep running to ride it.');
    }
  }
  toast('Off the ropes!'); audio.blip(180, 0.1, 'square', 0.06);
}
// Ballistic throw release: the victim leaves the attacker's hands with real
// velocity and lands somewhere else. No teleport pop — the carry anchor is
// already at the release point, physics does the rest.
function releaseFlight(att, foe, mv, dmgMult) {
  const fl = mv.flight;
  const fx = Math.sin(att.facing), fz = Math.cos(att.facing);
  const s = fl.dir === 'fwd' ? 1 : -1; // fwd = launched past the attacker, over = behind them
  const dx = fx * s, dz = fz * s;
  foe.pos.x = att.pos.x + dx * 0.6;
  foe.pos.z = att.pos.z + dz * 0.6;
  foe.pos.y = att.pos.y + 1.6;
  foe.vel.set(dx * fl.out, 0, dz * fl.out);
  foe.vy = fl.up;
  foe.facing = att.facing + Math.PI;
  foe.state = 'thrown'; foe.stateT = 0; foe.anim = 'down';
  foe._bumpStyle = 'flip';
  foe._thrownHit = {
    dmg: Math.round((mv.baseDamage ?? mv.dmg ?? 0) * dmgMult),
    att, moveName: mv.name, downTime: 4.0, bleed: moveBleed(mv),
  };
  playClip(att, slamClipFor(mv.anim));
  playClip(foe, soldClipFor(mv.anim));
  match.slowmo = 0.12; shake(1.0); audio.pop(1.6);
  burst(new THREE.Vector3(foe.pos.x, foe.pos.y + 0.8, foe.pos.z), 0xff6600, 20, 9);
  showMove(att, mv.name + ' — LAUNCHED!');
}
function landThrown(f, fall) {
  const hit = f._thrownHit; f._thrownHit = null;
  burst(new THREE.Vector3(f.pos.x, f.pos.y + 0.6, f.pos.z), 0xff6600, 24, 10);
  burst(new THREE.Vector3(f.pos.x, f.pos.y + 0.4, f.pos.z), 0xffe066, 10, 5);
  shake(1.0); audio.pop(1.6); audio.hit('hit');
  matHit(0.5); // the mat takes the bump
  if (hit && hit.att && !hit.att.eliminated && match.phase === 'fight') {
    applyDamage(f, hit.dmg, hit.att, { kb: 0, from: hit.att.pos, down: true, big: true, downTime: hit.downTime, moveName: hit.moveName });
    if (hit.bleed) bustOpen(f, hit.att);
  } else {
    knockDown(f, 3.0);
  }
  // thrown landings are always flip bumps, never crumples
  f._bumpStyle = 'flip'; f._downRot = 1.35;
  if (fall > 12) applyDamageSelf(f, 3); // huge air adds up
}
// VPG bleed flag: busted open — crimson burst, permanent max-HP chip
// (VPG maxHealthDamage analog), crowd pops for the crimson mask.
function bustOpen(vic, att) {
  burst(new THREE.Vector3(vic.pos.x, vic.pos.y + 1.6, vic.pos.z), 0xc01020, 18, 8);
  vic.maxhp = Math.max(1, vic.maxhp - 3);
  vic.hp = Math.min(vic.hp, vic.maxhp);
  match.heat = clamp(match.heat + 0.08, 0, 1);
  announce('BUSTED OPEN!', `${vic.def.name} is bleeding!`);
  audio.pop(1.1);
  refreshCards();
}
function breakTable(w, f) {
  w.broken = true;
  const big = !!w.mesh.userData.isAnnounce;
  const top = w.mesh.getObjectByName('tabletop');
  if (top) { top.rotation.z = 0.5; top.position.y = 0.2; }
  const mon = w.mesh.getObjectByName('announceMon');
  if (mon) { mon.rotation.x = -1.2; mon.position.y = 0.3; }
  w.mesh.rotation.y += 0.4;
  burst(new THREE.Vector3(w.mesh.position.x, 1, w.mesh.position.z), 0x9c6b3c, big ? 34 : 22, big ? 10 : 7);
  burst(new THREE.Vector3(w.mesh.position.x, 1.2, w.mesh.position.z), 0x3aa0ff, big ? 14 : 0, 6);
  audio.hit('hit'); audio.pop(big ? 2.0 : 1.4); shake(big ? 0.9 : 0.5);
  announce(big ? 'THROUGH THE ANNOUNCE TABLE!' : 'THROUGH THE TABLE!', f.def.name);
  audio.chant('ecw');
  updateTron(big ? 'TABLE SPOT!' : 'THROUGH TABLE', f.def.name);
  match.heat = clamp(match.heat + (big ? 0.2 : 0.12), 0, 1);
  // slam-through bonus on top of whatever put them down
  applyDamage(f, big ? 14 : 8, null, { down: true, downTime: big ? 4.2 : 3 });
  gasUp(f, 10);
}
function nearestLadder(f, max = 1.4) {
  let best = null, bd = max;
  for (const w of weapons) {
    if (w.kind !== 'ladder' || w.broken || w.tipped) continue;
    const d = Math.hypot(f.pos.x - w.mesh.position.x, f.pos.z - w.mesh.position.z);
    if (d < bd) { bd = d; best = w; }
  }
  return best;
}
function nearestTippedLadder(f, max = 1.4) {
  let best = null, bd = max;
  for (const w of weapons) {
    if (w.kind !== 'ladder' || w.broken || !w.tipped) continue;
    const d = Math.hypot(f.pos.x - w.mesh.position.x, f.pos.z - w.mesh.position.z);
    if (d < bd) { bd = d; best = w; }
  }
  return best;
}
function climbLadder(f, ladder) {
  if (!f || f.eliminated || !ladder || ladder.broken || ladder.tipped) return false;
  f.state = 'laddertop'; f.stateT = 999; f.anim = 'top';
  f.pos.x = ladder.mesh.position.x; f.pos.z = ladder.mesh.position.z;
  f.pos.y = 3.35; f.vy = 0; f.vel.set(0, 0, 0);
  f.ladder = ladder; ladder.climber = f;
  gasUp(f, TUNING.gasClimb);
  if (f.isPlayer) toast('Up the LADDER! Strike to dive — big bonus damage!');
  audio.blip(520, 0.15, 'square', 0.1);
  announce('CLIMBING!', f.def.name);
  return true;
}
function tipLadder(ladder, dir) {
  if (!ladder || ladder.broken || ladder.tipped) return;
  ladder.tipped = true;
  ladder.mesh.rotation.z = Math.PI / 2 - 0.08;
  ladder.mesh.position.y = Math.max(0.15, ladder.mesh.position.y * 0.3);
  if (ladder.climber) {
    const c = ladder.climber;
    ladder.climber = null; c.ladder = null;
    c.state = 'idle'; c.stateT = 0; // dismount first: knockDown guards the perch states
    knockDown(c, 2.0);
  }
  burst(new THREE.Vector3(ladder.mesh.position.x, 0.8, ladder.mesh.position.z), 0xaaaaaa, 10, 4);
  audio.hit('hit'); shake(0.4);
  toast('The ladder topples!');
}
function setupLadder(ladder) {
  if (!ladder || ladder.broken || !ladder.tipped) return false;
  ladder.tipped = false;
  ladder.mesh.rotation.z = 0;
  ladder.mesh.position.y = groundHeight(ladder.mesh.position.x, ladder.mesh.position.z);
  audio.blip(300, 0.12, 'square', 0.08);
  toast('Ladder set back up!');
  return true;
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
  // grounded gait: small strides, bent knees, no side-rock — legs step, body stays level
  const sw = Math.sin(f.walkPhase) * (run ? 0.42 : 0.30);
  const sw2 = Math.sin(f.walkPhase + Math.PI) * (run ? 0.42 : 0.30);
  const moving = f.state === 'walk' || run || f.state === 'whipped';
  const HH = f.def.height || 1;
  // ---- base stance (every joint set every frame) ----
  P.group.scale.y = 1;
  P.group.rotation.x = 0;
  P.pelvis.position.y = 0.97 * HH;
  P.pelvis.rotation.set(0, 0, 0);
  if (moving) { // weight: small vertical bob only, pelvis stays level
    P.pelvis.position.y += Math.abs(Math.sin(f.walkPhase)) * 0.018;
    P.pelvis.rotation.z = 0;
    P.pelvis.rotation.y = Math.sin(f.walkPhase) * 0.03; // hip counter-rotation
  }
  P.spine.rotation.set(moving && run ? 0.14 : moving ? 0.07 : 0.03, moving ? Math.sin(f.walkPhase) * -0.04 : 0, 0);
  P.torso.rotation.set(0, moving ? Math.sin(f.walkPhase) * -0.06 : 0, 0); // shoulder counter-swing
  P.neck.rotation.set(-0.06, 0, 0);
  P.head.rotation.set(0, 0, 0);
  P.lThigh.rotation.set(moving ? sw : 0, 0, 0.035);
  P.rThigh.rotation.set(moving ? sw2 : 0, 0, -0.035);
  // knees stay soft: baseline bend, extra flex on the passing leg only
  P.lShin.rotation.set(moving ? 0.25 + Math.max(0, sw2 * 0.9) : 0.12, 0, 0);
  P.rShin.rotation.set(moving ? 0.25 + Math.max(0, sw * 0.9) : 0.12, 0, 0);
  P.lFoot.rotation.set(moving ? 0.08 - sw * 0.25 : 0.05, 0, 0);
  P.rFoot.rotation.set(moving ? 0.08 - sw2 * 0.25 : 0.05, 0, 0);
  const pump = run || f.state === 'whipped';
  P.lUpper.rotation.set(moving ? sw2 * 0.45 : 0, 0, 0.10);
  P.rUpper.rotation.set(moving ? sw * 0.45 : 0, 0, -0.10);
  P.lFore.rotation.set(pump ? -0.9 - sw * 0.2 : moving ? -0.5 : -0.35, 0, 0);
  P.rFore.rotation.set(pump ? -0.9 - sw2 * 0.2 : moving ? -0.5 : -0.35, 0, 0);
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
    const td = f._tauntDir || 'up';
    if (td === 'up') {
      P.lUpper.rotation.set(0, 0, 2.4 + w * 0.2);
      P.rUpper.rotation.set(0, 0, -2.4 - w * 0.2);
      P.lFore.rotation.x = -0.4; P.rFore.rotation.x = -0.4;
      P.spine.rotation.x = -0.12; // chest out
      P.head.rotation.x = -0.22;
      P.group.position.y = f.pos.y + Math.abs(Math.sin(t * 10)) * 0.06;
    } else if (td === 'down') {
      // soak it in: deep bow, arms spread wide to the far crowd
      P.lUpper.rotation.set(0.4, 0, 1.5); P.rUpper.rotation.set(0.4, 0, -1.5);
      P.lFore.rotation.x = -0.2; P.rFore.rotation.x = -0.2;
      P.spine.rotation.x = 0.55; P.head.rotation.x = -0.5; // head up to the lights
      P.lThigh.rotation.x = -0.4; P.rThigh.rotation.x = -0.4;
      P.lShin.rotation.x = 0.5; P.rShin.rotation.x = 0.5;
      P.pelvis.position.y = 0.82 * HH;
    } else if (td === 'left') {
      // hard camera point: side-on, one arm spearing at the lens
      P.lUpper.rotation.set(-1.6, 0, 0.4); P.lFore.rotation.x = -0.1;
      P.rUpper.rotation.set(0.3, 0, -0.4); P.rFore.rotation.x = -0.6;
      P.torso.rotation.y = 0.5; P.spine.rotation.y = 0.25;
      P.head.rotation.y = 0.45;
      P.spine.rotation.x = -0.08;
    } else {
      // trash talk: crouched at the ropes, jawing at ringside
      P.lUpper.rotation.set(-0.9, 0, 0.7); P.rUpper.rotation.set(-0.9, 0, -0.3);
      P.lFore.rotation.x = -1.1; P.rFore.rotation.x = -0.4;
      P.spine.rotation.x = 0.45; P.head.rotation.set(0.15, -0.4 + w * 0.2, 0);
      P.lThigh.rotation.x = -1.1; P.rThigh.rotation.x = -1.1;
      P.lShin.rotation.x = 1.4; P.rShin.rotation.x = 1.4;
      P.pelvis.position.y = 0.68 * HH;
    }
    P.lShin.rotation.x = P.lShin.rotation.x || 0.12; P.rShin.rotation.x = P.rShin.rotation.x || 0.12;
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
      P.pelvis.position.y = lerp(0.97 * HH, 0.60 * HH, endP);
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
  } else if (A === 'climb' || f.state === 'climb') {
    // hauling over the apron: crouched pull-up, head up, arms reaching
    const cp = f.animT ? clamp(1 - f.stateT / f.animT, 0, 1) : 1;
    P.spine.rotation.x = lerp(0.7, 0.1, cp);
    P.head.rotation.x = lerp(-0.3, 0, cp);
    P.lUpper.rotation.set(-1.6, 0, 0.3); P.rUpper.rotation.set(-1.6, 0, -0.3);
    P.lFore.rotation.x = -0.6; P.rFore.rotation.x = -0.6;
    P.lThigh.rotation.x = lerp(-0.4, -0.9, cp); P.rThigh.rotation.x = lerp(-0.4, -0.9, cp);
    P.lShin.rotation.x = lerp(0.5, 1.1, cp); P.rShin.rotation.x = lerp(0.5, 1.1, cp);
  } else if (f.state === 'thrown') {
    // mid-flight bump: arched back, limbs splayed — the suplex ride.
    // (before the down branch: thrown bodies use anim 'down' but fly.)
    P.pelvis.position.y = 0.8 * HH;
    P.pelvis.rotation.x = -0.5;
    P.spine.rotation.x = -0.5;
    P.head.rotation.x = -0.5;
    P.lUpper.rotation.set(0.4, 0, 2.0); P.rUpper.rotation.set(0.4, 0, -2.0);
    P.lFore.rotation.x = -0.4; P.rFore.rotation.x = -0.4;
    P.lThigh.rotation.set(0.6, 0, 0.3); P.rThigh.rotation.set(0.6, 0, -0.3);
    P.lShin.rotation.x = 0.8; P.rShin.rotation.x = 0.8;
  } else if (f.state === 'groggy' || A === 'groggy') {
    // groggy: barely standing — hunched, knees soft, arms dangling, head lolling
    const wob = Math.sin(t * 3.1 + f.walkPhase) * 0.09;
    const wob2 = Math.sin(t * 2.3 + f.walkPhase) * 0.07;
    P.pelvis.position.y = 0.72 * HH;
    P.pelvis.rotation.set(0.35, 0, wob);
    P.spine.rotation.set(0.5 + wob2, 0, wob);
    P.head.rotation.set(0.55 + wob, wob2 * 2, wob);
    P.lUpper.rotation.set(-0.25 + wob, 0, 0.35); P.rUpper.rotation.set(-0.25 - wob, 0, -0.35);
    P.lFore.rotation.x = -0.3; P.rFore.rotation.x = -0.3;
    P.lThigh.rotation.set(-0.55, 0, 0.12); P.rThigh.rotation.set(-0.45, 0, -0.12);
    P.lShin.rotation.x = 0.85; P.rShin.rotation.x = 0.75;
    P.lFoot.rotation.x = 0.2; P.rFoot.rotation.x = 0.2;
  } else if (A === 'down' || f.state === 'down' || f.state === 'pinned') {
    if (f._bumpStyle === 'flip') {
      // flip bump: landed on the stomach, arms spread, legs kicked up
      P.pelvis.position.y = 0.26 * HH;
      P.pelvis.rotation.x = 1.35;
      P.spine.rotation.x = -0.15;
      P.head.rotation.set(0.5, 0, 0.15);
      P.lUpper.rotation.set(-1.2, 0, 1.3); P.rUpper.rotation.set(-1.2, 0, -1.3);
      P.lFore.rotation.x = -0.2; P.rFore.rotation.x = -0.2;
      P.lThigh.rotation.set(-0.5, 0, 0.15); P.rThigh.rotation.set(-0.5, 0, -0.15);
      P.lShin.rotation.x = 0.9; P.rShin.rotation.x = 0.9;
      P.lFoot.rotation.x = 0.7; P.rFoot.rotation.x = 0.7;
    } else if (f._bumpStyle === 'crumple') {
      // crumple: curled on the side clutching the gut — the gassed sell
      P.pelvis.position.y = 0.3 * HH;
      P.pelvis.rotation.set(-0.7, 0, 0.55);
      P.spine.rotation.set(0.5, 0, 0.2);
      P.head.rotation.set(0.5, 0, 0.3);
      P.lUpper.rotation.set(-1.4, 0, 0.7); P.rUpper.rotation.set(-1.4, 0, -0.7);
      P.lFore.rotation.x = -1.1; P.rFore.rotation.x = -1.1; // clutching ribs
      P.lThigh.rotation.set(-2.0, 0, 0.2); P.rThigh.rotation.set(-1.7, 0, -0.2);
      P.lShin.rotation.x = 2.1; P.rShin.rotation.x = 2.0;
      P.lFoot.rotation.x = 0.4; P.rFoot.rotation.x = 0.4;
    } else {
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
    }
  } else if (f.state === 'submitvictim') {
    // trapped under the hold, fighting it — response matches the hold type
    const strain = Math.sin(t * 11 + f.walkPhase) * 0.1;
    const sp = f._subPose || 'sit';
    P.pelvis.position.y = 0.26 * HH;
    P.pelvis.rotation.x = 1.35;
    P.head.rotation.x = 0.55 + strain;
    if (sp === 'sit' || sp === 'stand') {
      // legs jacked up behind them, clawing at the mat
      P.spine.rotation.x = -0.25 + strain;
      P.lUpper.rotation.set(-1.2, 0, 0.6); P.rUpper.rotation.set(-1.2, 0, -0.6);
      P.lFore.rotation.x = -0.6; P.rFore.rotation.x = -0.6;
      P.lThigh.rotation.set(1.3, 0, 0.15); P.rThigh.rotation.set(1.3, 0, -0.15);
      P.lShin.rotation.x = 1.9; P.rShin.rotation.x = 1.9;
    } else {
      // head wrenched up, back bowed, reaching for the ropes
      P.spine.rotation.x = -0.45 + strain;
      P.head.rotation.x = -0.4 + strain;
      P.lUpper.rotation.set(-1.6, 0, 0.9); P.rUpper.rotation.set(-1.6, 0, -0.9);
      P.lFore.rotation.x = -0.4; P.rFore.rotation.x = -0.4;
      P.lThigh.rotation.set(0.1, 0, 0.1); P.rThigh.rotation.set(0.1, 0, -0.1);
      P.lShin.rotation.x = 0.35; P.rShin.rotation.x = 0.35;
    }
  } else if (A === 'getup') {
    // rise off the mat from whichever way we were lying
    const r0 = f._downRot || -1.5;
    P.pelvis.position.y = lerp(0.25, 0.97, pr) * HH;
    P.pelvis.rotation.x = lerp(r0, 0, pr);
    P.spine.rotation.x = lerp(0.4, 0.05, pr);
  } else if (A === 'top' || f.state === 'laddertop') {
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
  } else if (A === 'moonsault') {
    // moonsault tuck: knees to chest, arms wrapped — backflip rotation
    P.lThigh.rotation.set(-2.0, 0, 0.25); P.rThigh.rotation.set(-2.0, 0, -0.25);
    P.lShin.rotation.x = 2.1; P.rShin.rotation.x = 2.1;
    P.lUpper.rotation.set(-1.4, 0, 0.5); P.rUpper.rotation.set(-1.4, 0, -0.5);
    P.lFore.rotation.x = -1.2; P.rFore.rotation.x = -1.2;
    P.spine.rotation.x = 0.55;
    P.head.rotation.x = 0.5;
    P.group.rotation.x = -0.5; // mid-flip tilt
  } else if (A === 'elbowdrop') {
    P.rUpper.rotation.x = -2.6; P.rFore.rotation.x = -0.2; // driving elbow down
    P.lUpper.rotation.z = 2.6;
    P.lThigh.rotation.x = 0.5; P.rThigh.rotation.x = 0.5;
    P.lShin.rotation.x = 1.0; P.rShin.rotation.x = 1.0;
    P.spine.rotation.x = 0.3;
  } else if (A === 'submit') {
    // connected hold by pose key, straining with the victim
    const strain = Math.sin(t * 9 + f.walkPhase) * 0.07;
    const sp = f._subPose || 'sit';
    if (sp === 'stand') {
      // ankle lock: standing on the leg, arched back cranking it up
      P.pelvis.position.y = 0.85 * HH;
      P.spine.rotation.x = -0.35 + strain;
      P.head.rotation.x = -0.3;
      P.lUpper.rotation.set(-1.5, 0, 0.3); P.rUpper.rotation.set(-1.5, 0, -0.3);
      P.lFore.rotation.x = -0.5; P.rFore.rotation.x = -0.5;
      P.lThigh.rotation.set(-0.3, 0, 0.1); P.rThigh.rotation.set(-1.0, 0, -0.1); // planted on them
      P.lShin.rotation.x = 0.2; P.rShin.rotation.x = 0.6;
    } else if (sp === 'front') {
      // crossface / bear hug: kneeling at the head, wrenching back
      P.pelvis.position.y = 0.5 * HH;
      P.spine.rotation.x = -0.3 + strain;
      P.head.rotation.x = -0.25;
      P.lUpper.rotation.set(-1.6, 0, 0.6); P.rUpper.rotation.set(-1.6, 0, -0.6);
      P.lFore.rotation.x = -1.0; P.rFore.rotation.x = -1.0;
      P.lThigh.rotation.set(-1.4, 0, 0.2); P.rThigh.rotation.set(-1.4, 0, -0.2);
      P.lShin.rotation.x = 1.7; P.rShin.rotation.x = 1.7;
    } else if (sp === 'back') {
      // camel clutch / STF: seated on their back, pulling the head up
      P.pelvis.position.y = 0.45 * HH;
      P.spine.rotation.x = -0.45 + strain;
      P.head.rotation.x = -0.3;
      P.lUpper.rotation.set(-1.8, 0, 0.3); P.rUpper.rotation.set(-1.8, 0, -0.3);
      P.lFore.rotation.x = -0.4; P.rFore.rotation.x = -0.4;
      P.lThigh.rotation.set(-1.2, 0, 0.4); P.rThigh.rotation.set(-1.2, 0, -0.4);
      P.lShin.rotation.x = 1.4; P.rShin.rotation.x = 1.4;
    } else {
      // seated on the mat behind the legs, cranking back (sharpshooter/crab)
      P.pelvis.position.y = 0.55 * HH;
      P.spine.rotation.x = 0.65 + strain;
      P.lUpper.rotation.x = -1.3; P.rUpper.rotation.x = -1.3;
      P.lFore.rotation.x = -0.8; P.rFore.rotation.x = -0.8;
      P.lThigh.rotation.x = -1.1; P.rThigh.rotation.x = -1.1;
      P.lShin.rotation.x = 1.2; P.rShin.rotation.x = 1.2;
      P.head.rotation.x = 0.3;
    }
  } else if (A === 'stomp') {
    P.rThigh.rotation.x = -1.5 * punch; P.rShin.rotation.x = 0.3;
    P.spine.rotation.x = 0.3 * punch;
    P.lUpper.rotation.x = 0.4 * punch; P.rUpper.rotation.x = 0.4 * punch;
    P.head.rotation.x = 0.25 * punch;
  }
  if (f.state === 'pin') {
    // draped cover: chest pressed across the victim, near leg hooked —
    // one knee up trapping their thigh, far arm pressing their chest
    P.pelvis.position.y = 0.38 * HH;
    P.pelvis.rotation.x = -0.9;
    P.spine.rotation.x = 0.9;
    P.head.rotation.x = -0.35; // head up, watching the ref
    P.lUpper.rotation.set(-1.3, 0, 0.4); P.lFore.rotation.x = -0.3; // pressing arm
    P.rUpper.rotation.set(-0.5, 0, -1.1); P.rFore.rotation.x = -0.9; // hooking arm
    P.lThigh.rotation.set(-1.7, 0, 0.35); P.lShin.rotation.x = 1.9; // hooked knee up
    P.rThigh.rotation.set(-0.9, 0, -0.15); P.rShin.rotation.x = 1.5; // kneeling leg
    P.lFoot.rotation.x = 0.6; P.rFoot.rotation.x = 0.6;
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
  const sellSlow = f.state === 'down' || f.state === 'getup' || f.state === 'pin' || f.state === 'corner' || f.state === 'climb' || f.state === 'thrown' ||
    f.state === 'pinned' || f.state === 'submit' || f.state === 'submitvictim' || f.state === 'celebrate' || f.state === 'groggy';
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
      <div class="gaswrap"><div class="gas"></div></div>
      <div class="attwrap"><div class="att"></div></div>
      <div class="attlabel"><span>ATTITUDE</span><b class="attv"></b></div>`;
    c.appendChild(d);
    cardEls.push({ f, el: d, hp: d.querySelector('.hp'), gas: d.querySelector('.gas'), att: d.querySelector('.att'), attv: d.querySelector('.attv') });
  }
}
function refreshCards() { /* values pulled in tick */ }
function tickCards() {
  for (const c of cardEls) {
    const hpFrac = clamp(c.f.hp / c.f.maxhp, 0, 1);
    c.hp.style.width = (hpFrac * 100).toFixed(1) + '%';
    c.hp.style.background = hpFrac > 0.5 ? '#37e05c' : hpFrac > 0.25 ? '#ffd23f' : '#e63946';
    const gasFrac = clamp(1 - (c.f.gas || 0) / TUNING.gasMax, 0, 1);
    c.gas.style.width = (gasFrac * 100).toFixed(1) + '%';
    c.gas.style.background = c.f.gasState === 'gassed' ? '#e63946' : c.f.gasState === 'winded' ? '#ffd23f' : '#3aa0ff';
    c.gas.title = c.f.gasState === 'fresh' ? 'GAS: fresh' : 'GAS: ' + c.f.gasState.toUpperCase();
    c.att.style.width = c.f.att.toFixed(0) + '%';
    c.attv.textContent = c.f.specialT > 0 ? '★ HYPED — FINISHER! ★' : c.f.att >= 100 ? '★ MAX — LB+RB! ★' : Math.round(c.f.att) + '%';
    c.el.classList.toggle('max', c.f.att >= 100 || c.f.specialT > 0);
  }
  $('heatfill').style.width = (match.heat * 100).toFixed(0) + '%';
  $('arenaName').textContent = ARENAS[match.arenaIdx].name;
  // HCTP reversal prompt: flash when the player can reverse
  const rp = $('revPrompt');
  if (rp) {
    const p = player();
    const inc = p && p.incoming;
    const live = inc && performance.now() < inc.until && match.phase === 'fight' &&
      !p.eliminated && !['down', 'pinned', 'submit', 'submitvictim', 'pin', 'top', 'dive'].includes(p.state);
    if (live) {
      rp.classList.remove('hidden');
      $('revKind').textContent = inc.type === 'strike' ? 'RT / R' : inc.type === 'grapple' ? 'LT / E' : 'LT+RT / T';
    } else rp.classList.add('hidden');
  }
}
function fmtTime(s) { return `${String((s / 60) | 0).padStart(2, '0')}:${String((s | 0) % 60).padStart(2, '0')}`; }

// ---------- catalog / pause ----------
function catalogHTML() {
  // VPG-style grades: [S] match-ender, PIN/SUB feature tags, * = can KO
  const tag = (m) => {
    const f = moveFeature(m);
    return `<b style="color:#ffd23f">[${powerGrade(m.baseDamage ?? m.dmg)}]</b>` +
      (f === 'pin' ? ' <span style="color:#7CFC00">PIN</span>' : f === 'submit' ? ' <span style="color:#DA70D6">SUB</span>' : '') +
      (moveKO(m) ? ' <span style="color:#ff5040">*KO</span>' : '');
  };
  const li = (arr) => arr.map((m) => `${tag(m)} ${m.name} <span style="opacity:.6">(${m.baseDamage ?? m.dmg})</span>`).join(' · ');
  const note = (t) => `<span style="opacity:.55;font-size:11px"> — ${t}</span>`;
  return `<b>STRIKES</b>${note('punches, kicks, chops & running lariats (arm out, neck/chest) to stagger foes')}<br>${li(MOVES.strikes)}<br>` +
    `<b>FRONT GRAPPLE</b>${note('facelocks & waistlocks: DDTs drive the head down, suplexes arch foes back-first, bombs sit them on your shoulders')}<br>${li(MOVES.front)}<br>` +
    `<b>BACK GRAPPLE</b>${note('attack from behind: waistlock Germans bridge for pins, back suplexes, sleeper drops')}<br>${li(MOVES.back)}<br>` +
    `<b>GROUND / DIVE</b>${note('stomps & drops on downed foes; top-rope moonsaults, 450° splashes (1¼ flips) & frog splashes')}<br>${li(MOVES.ground)} · ${li(MOVES.dive)}<br>` +
    `<b>SUBMISSIONS</b>${note('leg-laces & back compressors — applied center-ring, but near the ropes a rope break looms')}<br>${li(MOVES.submit)}<br>` +
    `<b>FINISHERS</b>${note('signature match-enders — ranas cradle for pins, spinebusters land you on top')}<br>${Object.entries(MOVES.finishers).map(([k, v]) => `${tag({ name: k, ...v })} ${k} (${v.baseDamage ?? v.dmg})`).join(' · ')}`;
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
  toast('No DQ, no count-out. Build meter (LB/U), LB+RB for SPECIAL, then FINISHER!', 4200);
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
  // deep link for smoke tests / demos: ?fight=1 skips the menu, ?arena=N picks the dome
  const qp = new URLSearchParams(location.search);
  if (qp.has('arena')) {
    const ai = +qp.get('arena');
    if (Number.isFinite(ai) && ai >= 0 && ai <= 3) {
      match.arenaIdx = ai;
      document.querySelectorAll('#arenaRow .chip').forEach((c) => c.classList.toggle('sel', +c.dataset.arena === ai));
      buildArena(ai);
    }
  }
  if (qp.has('fight')) { setTimeout(() => { try { startMatch(); } catch (e) { console.error(e); } }, 800); }
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
  toast(`Gamepad on: A grapple · X strike · B run · Y object · LB taunt · LB+RB special`);
  audio.ensure();
});
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
      const rel = (i) => !b(i) && !!prevPadBtns[i];
      const now = performance.now();
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
      // Right stick: flick = change focus, hold = rest hold (DoR tactics)
      const rsx = gp.axes[2] || 0, rsy = gp.axes[3] || 0;
      const rsMag = Math.hypot(rsx, rsy);
      const p = match.phase === 'fight' ? player() : null;
      if (p && !p.eliminated) {
        if (!p._rs) p._rs = { mag: 0, dx: 0, dy: 0, t0: 0, fired: false };
        const RS = p._rs;
        if (rsMag > 0.7 && RS.mag <= 0.7) { RS.t0 = now; RS.fired = false; RS.dx = rsx; RS.dy = rsy; }
        if (rsMag > 0.7) { RS.dx = rsx; RS.dy = rsy; }
        if (rsMag <= 0.3 && RS.mag > 0.7 && !RS.fired) {
          // quick flick = change focus
          if (now - RS.t0 < 300) { cycleFocus(p); RS.fired = true; }
        }
        if (rsMag > 0.7 && !RS.fired && now - RS.t0 > 600) {
          // sustained hold = rest hold (needs a downed foe nearby)
          const downFoe = fighters.find((v) => v !== p && !v.eliminated && isDown(v) && dist2(p, v) < 2.2);
          if (downFoe) {
            const kind = Math.abs(rsy) >= Math.abs(rsx) ? (rsy < 0 ? 'submit' : 'rest') : (rsx < 0 ? 'drain' : 'taunt');
            doRestHold(p, kind);
            RS.fired = true;
          }
        }
        RS.mag = rsMag;
        // ---- A (grapple): tap = light, hold = heavy tie-up, follow-up executes ----
        // pinned? every button press is kickout struggle — mash out!
        if (p.state === 'pinned' && (edge(0) || edge(1) || edge(2))) { p._kickMash = (p._kickMash || 0) + 1; }
        if (edge(0)) {
          if (p.tieup) {
            // second press in tie-up: A + direction executes the category
            const c = padCat() || 'power';
            execTieup(p, c);
          } else if (b(1) && p._bDownAt && now - p._bDownAt < 250) {
            doWhip(p); p._aDownAt = 0; p._bDownAt = 0; p._aFired = true; p._bFired = true; // A+B chord = whip
          } else {
            p._aDownAt = now; p._aFired = false;
            p._aDir = stickDir();
          }
        }
        if (b(0) && p._aDownAt && !p._aFired && now - p._aDownAt > 280 && !p.tieup) {
          p._aFired = true; // held: heavy tie-up
          doGrapple(p, padCat() || 'auto', 'heavy');
        }
        if (rel(0) && p._aDownAt && !p._aFired && !p.tieup) {
          p._aFired = true;
          // RS held down + A = pinfall hook
          if (rsMag > 0.6 && rsy > 0.6) { tryPin(p); }
          else {
            const d = p._aDir || stickDir();
            const c = (!d || d.mag < 0.4) ? null : (Math.abs(d.dz) >= Math.abs(d.dx) ? (d.dz < 0 ? 'power' : 'sub') : (d.dx > 0 ? 'quick' : 'sig'));
            if (c) doGrapple(p, c, 'light'); else doWhip(p);
          }
        }
        if (!b(0)) { p._aDownAt = 0; }
        // ---- X (strike): tap = light, hold = heavy ----
        if (edge(2)) { p._xDownAt = now; p._xFired = false; }
        if (b(2) && p._xDownAt && !p._xFired && now - p._xDownAt > 250) {
          p._xFired = true;
          doStrike(p, true);
        }
        if (rel(2) && p._xDownAt && !p._xFired) { p._xFired = true; doStrike(p, false); }
        if (!b(2)) { p._xDownAt = 0; }
        // ---- B = GRAPPLE (mirror of A): tap = light, hold = heavy tie-up ----
        if (edge(1)) {
          if (p.tieup) {
            // second press in tie-up: B + direction executes the category
            const c = padCat() || 'power';
            execTieup(p, c);
          } else if (b(0) && p._aDownAt && now - p._aDownAt < 250) {
            doWhip(p); p._aDownAt = 0; p._bDownAt = 0; p._aFired = true; p._bFired = true; // A+B chord = whip
          } else {
            p._bDownAt = now; p._bFired = false;
            p._bDir = stickDir();
          }
        }
        if (b(1) && p._bDownAt && !p._bFired && now - p._bDownAt > 280 && !p.tieup) {
          p._bFired = true; // held: heavy tie-up
          doGrapple(p, padCat() || 'auto', 'heavy');
        }
        if (rel(1) && p._bDownAt && !p._bFired && !p.tieup) {
          p._bFired = true;
          // RS held down + B = pinfall hook
          if (rsMag > 0.6 && rsy > 0.6) { tryPin(p); }
          else {
            const d = p._bDir || stickDir();
            const c = (!d || d.mag < 0.4) ? null : (Math.abs(d.dz) >= Math.abs(d.dx) ? (d.dz < 0 ? 'power' : 'sub') : (d.dx > 0 ? 'quick' : 'sig'));
            if (c) doGrapple(p, c, 'light'); else doWhip(p);
          }
        }
        if (!b(1)) { p._bDownAt = 0; }
        if (edge(3)) cycleFocus(p);                          // Y: change focus (who you're looking at)
        // ---- LB = RUN (hold). Fresh LB+RB chord = special/finisher ----
        if (edge(4)) { p._lbDownAt = now; }
        if (b(4)) { run = true; p._bHeld = true; }          // LB held = run
        if (!b(4)) { p._lbDownAt = 0; }
        if ((edge(4) && b(5) && p._rbDownAt && now - p._rbDownAt < 350) || (edge(5) && b(4) && p._lbDownAt && now - p._lbDownAt < 350)) { padDoSpecial(p, stickDir().mag > 0.4); p._rbFired = true; }
        else if (edge(5)) {
          // RB: outside the ring it ALWAYS gets you in (even armed — bring the chair!);
          // inside, empty hands = action, armed = tap swings (hold drops, below)
          p._rbDownAt = now; p._rbFired = false;
          if (p.pos.y < 0.5) { padAction(p); p._rbFired = true; }
          else if (!p.weapon) { padAction(p); p._rbFired = true; }
        }
        if (b(5) && p._rbDownAt && !p._rbFired && p.weapon && now - p._rbDownAt > 450) {
          p._rbFired = true; // RB hold = drop what you're carrying
          const w = p.weapon;
          dropWeapon(p); p.cool = Math.max(p.cool, 0.3);
          toast(`${p.def.name} drops the ${weaponLabel(w)}!`);
          audio.blip(300, 0.1, 'square', 0.07);
        }
        if (rel(5) && p._rbDownAt && !p._rbFired) {
          p._rbFired = true; // RB tap while armed = swing it
          if (p.weapon) weaponSwing(p);
          else padAction(p);
        }
        if (!b(5)) { p._rbDownAt = 0; }
        if (edge(6)) tryRev(p, 'grapple');                 // LT: grapple counter
        if (edge(7)) tryRev(p, 'strike');                  // RT: strike counter
        if (b(6) && b(7) && (edge(6) || edge(7))) tryRev(p, 'finisher'); // LT+RT: finisher reversal
        if (edge(11)) cycleFocus(p);                       // R3: change focus
        if (edge(12)) doTaunt(p, 'up');                    // D-pad: four taunts
        if (edge(13)) doTaunt(p, 'down');
        if (edge(14)) doTaunt(p, 'left');
        if (edge(15)) doTaunt(p, 'right');
        if (edge(8)) {                                     // Back: momentum shift (fallback: catalog)
          const before = p.shiftUsed;
          doMomentumShift(p);
          if (before) toggleCatalog();
        }
      }
      if (edge(9)) togglePause();                 // Start: pause
      if (edge(8)) toggleCatalog();               // Back/Select: move list
      prevPadBtns = gp.buttons.map((bb) => bb.pressed);
      // live pad readout (bottom-left): proves which button index the pad sends
      padDbg.btns = gp.buttons.map((bb, i) => bb.pressed ? i : -1).filter((i) => i >= 0);
      padDbg.name = (gp.id || '').slice(0, 30);
      padDbg.seen = true;
    }
  } catch { /* noop */ }
  return { x, z, run };
}
let padDbg = { btns: [], name: '', seen: false };
let padDbgT = 0;
function updatePadDbg(dt) {
  padDbgT -= dt;
  if (padDbgT > 0) return;
  padDbgT = 0.15;
  const el = $('padDbg');
  if (!el) return;
  if (!padDbg.seen) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  const p = player();
  const st = p ? `${p.state} x:${p.pos.x.toFixed(1)} z:${p.pos.z.toFixed(1)} y:${p.pos.y.toFixed(1)}` : 'n/a';
  el.textContent = `vRB-GLOBAL-1 | PAD:${padDbg.name} BTNS:[${padDbg.btns.join(',')}] | YOU:${st}`;
}

function tick() {
  requestAnimationFrame(tick);
  let dt = Math.min(0.05, clock.getDelta());
  if (match.slowmo > 0) { match.slowmo -= dt; dt *= 0.55; }
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
        if (a.state === 'thrown' || b.state === 'thrown' || a.state === 'dive' || b.state === 'dive') continue;
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
            const spec = w.spec || {};
            applyDamage(f, spec.throwDmg || spec.dmg || 11, null, { kb: 1.5, from: w.mesh.position, down: true, downTime: 2.4 });
            if (spec.bleed) bustOpen(f, null);
            toast(`Flying ${weaponLabel(w)} hits ${f.def.name}!`);
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

  // elastic ropes: integrate springs + re-pose strands (VPG RingRopes model)
  stepRopes(dt);
  // thumbtack piles bite steppers
  if (tackPiles.length) stepTacks(dt);

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
  updatePadDbg(dt);
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
window.__empire = { match, fighters: () => fighters, startMatch, touchMove, showTouchUI, touchAct, version: '1.2-rb' };
// auto-start for captures / screenshots (?fight, ?autostart, ?arena=N)
if (/autostart|fight|screenshot/i.test(location.search)) {
  match.playerIdx = 0; match.mode = '1v1';
  const aq = new URLSearchParams(location.search).get('arena');
  const aqi = aq !== null ? +aq : NaN;
  match.arenaIdx = Number.isFinite(aqi) && aqi >= 0 && aqi <= 3 ? aqi : 0;
  startMatch();
}
