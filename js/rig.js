// Wrestler Rig — articulated athletic sculpt.
// Proportions follow a ~7.5-head athletic build: long legs, narrow waist,
// wide shoulders, smaller head. Joints are embedded inside muscle masses
// (no visible ball joints). Fists have curled fingers + thumb, boots have
// toe/heel/sole, faces have brow/nose/lids/lips.
// Same pivot keys as always: group, aura, mats, skinM, pelvis, spine,
// torso/chest, neck, head, lUpper/rUpper, lFore/rFore, lHand/rHand,
// lThigh/rThigh, lShin/rShin, lFoot/rFoot.
import * as THREE from 'three';

function rmat(color, rough = 0.5, metal = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}
function ball(r, sx = 1, sy = 1, sz = 1, w = 18, h = 14) {
  const g = new THREE.SphereGeometry(r, w, h);
  g.scale(sx, sy, sz);
  return g;
}
function cap(r, len, seg = 12) {
  return new THREE.CapsuleGeometry(r, len, 6, seg);
}
// Lathe-turned limb hanging DOWN (-Y) from pivot, muscle belly partway down.
function limbGeo(rBase, rTip, len, belly = 0.12, bellyAt = 0.3, seg = 18) {
  const p = [
    new THREE.Vector2(0.001, 0),
    new THREE.Vector2(rBase * 0.78, 0),
    new THREE.Vector2(rBase, rBase * 0.8),
    new THREE.Vector2(rBase * (1 + belly), len * bellyAt),
    new THREE.Vector2((rBase + rTip) / 2, len * 0.62),
    new THREE.Vector2(rTip, len - rTip * 0.8),
    new THREE.Vector2(rTip * 0.78, len),
    new THREE.Vector2(0.001, len),
  ];
  const g = new THREE.LatheGeometry(p, seg);
  g.rotateX(Math.PI);
  return g;
}
// Procedural attire pattern per wrestler id.
function makeAttireTexture(def) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  const base = '#' + (def.attire ?? 0x222222).toString(16).padStart(6, '0');
  const trim = '#' + (def.trim ?? 0xffd23f).toString(16).padStart(6, '0');
  x.fillStyle = base; x.fillRect(0, 0, 256, 256);
  x.fillStyle = trim;
  const id = def.id || '';
  if (id === 'veneno' || id === 'thunder') {
    x.beginPath();
    x.moveTo(0, 20);
    for (let i = 0; i <= 8; i++) { const px = i * 32; x.lineTo(px + 16, 108); x.lineTo(px + 32, 20); }
    x.lineTo(256, 20); x.lineTo(256, 60); x.lineTo(0, 60); x.closePath(); x.fill();
    x.fillRect(0, 200, 256, 14);
  } else if (id === 'bruno' || id === 'fury') {
    x.fillRect(18, 0, 26, 256); x.fillRect(212, 0, 26, 256);
    x.fillRect(0, 226, 256, 12);
  } else if (id === 'icon') {
    x.save(); x.translate(128, 110); x.rotate(-0.5);
    x.fillRect(-160, -14, 320, 28); x.restore();
    x.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      const a2 = a + Math.PI / 5;
      x.lineTo(128 + Math.cos(a) * 34, 200 + Math.sin(a) * 34);
      x.lineTo(128 + Math.cos(a2) * 14, 200 + Math.sin(a2) * 14);
    }
    x.closePath(); x.fill();
  } else {
    x.beginPath(); x.moveTo(0, 150); x.lineTo(128, 90); x.lineTo(256, 150);
    x.lineTo(256, 178); x.lineTo(128, 118); x.lineTo(0, 178); x.closePath(); x.fill();
    x.fillRect(0, 226, 256, 12);
  }
  x.globalAlpha = 0.06; x.fillStyle = '#000';
  for (let i = 0; i < 500; i++) x.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  x.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function buildWrestlerMesh(def) {
  const H = def.height || 1.0;
  const B = def.bulk || 1.0;
  const singlet = (def.torso || 'bare') === 'singlet';
  const shirt = (def.torso || 'bare') === 'shirt';
  const tights = (def.legs || 'trunks') === 'tights' || singlet;
  const masked = def.hairStyle === 'mask';

  const skinM = rmat(def.skin ?? 0xd9a066, 0.42, 0.03);
  const attM = new THREE.MeshStandardMaterial({ map: makeAttireTexture(def), roughness: 0.6, metalness: 0.02 });
  const trimM = rmat(def.trim ?? 0xffd23f, 0.45, 0.25);
  const bootM = rmat(def.boots ?? 0x111111, 0.42, 0.15);
  const darkM = rmat(0x14141a, 0.6, 0.05);
  const shirtM = rmat(0xf2f2f2, 0.65, 0);
  const hairM = rmat(def.hair ?? 0x201510, 0.85, 0);
  const torsoM = singlet ? attM : shirt ? shirtM : skinM;
  const legM = tights ? attM : skinM;
  const armM = skinM; // arms always bare (singlet covers torso only)
  const mats = [skinM, attM, trimM, bootM, darkM, shirtM, hairM];

  const group = new THREE.Group();
  const add = (parent, geo, material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m;
  };

  // ---- pelvis + trunks shell ----
  const pelvis = new THREE.Group(); pelvis.position.y = 0.92 * H; group.add(pelvis);
  add(pelvis, ball(0.175 * B, 1.04, 0.72, 0.92), attM, 0, 0.03 * H, 0);
  for (const s of [-1, 1])
    add(pelvis, ball(0.08 * B, 1.0, 1.0, 0.88), attM, s * 0.08 * B, -0.035 * H, -0.085 * B);
  const waist = add(pelvis, new THREE.TorusGeometry(0.178 * B, 0.022 * H, 10, 22), trimM, 0, 0.12 * H, 0);
  waist.rotation.x = Math.PI / 2;

  // ---- legs (long, athletic; feet land at y≈0) ----
  function leg(side) {
    const hip = new THREE.Group(); hip.position.set(side * 0.095 * B, -0.02, 0); pelvis.add(hip);
    add(hip, limbGeo(0.088 * B, 0.052 * B, 0.42 * H, 0.16, 0.30), legM); // thigh, quad belly high
    add(hip, ball(0.060 * B, 0.92, 1.35, 1.02), legM, 0, -0.12 * H, 0.048 * B); // quad sweep
    add(hip, ball(0.052 * B, 0.85, 1.2, 0.9), legM, 0, -0.15 * H, -0.052 * B); // hamstring
    const knee = new THREE.Group(); knee.position.y = -0.44 * H; hip.add(knee);
    if (def.kneePads) add(knee, ball(0.068 * B, 1.0, 1.15, 0.68, 14, 10), darkM, 0, -0.02 * H, 0.048 * B);
    else add(knee, ball(0.052 * B, 1.05, 0.85, 0.85, 12, 10), legM, 0, -0.01 * H, 0.045 * B); // kneecap
    const calfM = tights ? legM : skinM;
    add(knee, limbGeo(0.058 * B, 0.030 * B, 0.40 * H, 0.18, 0.26), calfM); // calf diamond + thin ankle
    add(knee, ball(0.046 * B, 0.88, 1.15, 0.92), calfM, 0, -0.09 * H, -0.045 * B); // calf belly
    const foot = new THREE.Group(); foot.position.y = -0.44 * H; knee.add(foot);
    const tall = (def.bootsH || 'short') === 'tall';
    const shaftH = tall ? 0.30 * H : 0.11 * H;
    add(foot, new THREE.CylinderGeometry(0.056 * B, 0.047 * B, shaftH, 16), bootM, 0, 0.02 * H + shaftH / 2, -0.005);
    if (tall) {
      const ring = add(foot, new THREE.TorusGeometry(0.057 * B, 0.013, 8, 18), trimM, 0, 0.02 * H + shaftH, -0.005);
      ring.rotation.x = Math.PI / 2;
    }
    // boot foot: heel + tapered toe wedge + sole
    add(foot, ball(0.052 * B, 0.9, 0.75, 1.0), bootM, 0, 0.035 * H, -0.045 * H); // heel
    const toe = add(foot, ball(0.055 * B, 0.95, 0.55, 1.9), bootM, 0, 0.032 * H, 0.075 * H); // toe box
    toe.rotation.x = -0.12;
    add(foot, new THREE.BoxGeometry(0.10 * B, 0.018 * H, 0.24 * H), darkM, 0, 0.009 * H, 0.03 * H); // sole
    return { hip, knee, foot };
  }
  const LL = leg(-1), RL = leg(1);

  // ---- spine: narrow waist -> abdomen -> wide chest ----
  const spine = new THREE.Group(); spine.position.y = 0.10 * H; pelvis.add(spine);
  add(spine, new THREE.CylinderGeometry(0.128 * B, 0.148 * B, 0.28 * H, 18), torsoM, 0, 0.14 * H, 0);
  if (!singlet && !shirt) {
    for (let r = 0; r < 3; r++) {
      for (const s of [-1, 1])
        add(spine, ball(0.040 * B, 1.0, 1.3, 0.55, 12, 10), skinM, s * 0.047 * B, (0.07 + r * 0.075) * H, 0.118 * B);
    }
    for (const s of [-1, 1])
      add(spine, ball(0.058 * B, 0.65, 1.35, 0.8), skinM, s * 0.118 * B, 0.14 * H, 0.01);
    add(spine, ball(0.011, 1, 1, 0.5, 6, 6), darkM, 0, 0.015 * H, 0.138 * B);
  }
  const chest = new THREE.Group(); chest.position.y = 0.28 * H; spine.add(chest);
  const chestMesh = add(chest, new THREE.CapsuleGeometry(0.168 * B, 0.20 * H, 6, 18), torsoM, 0, 0.15 * H, 0);
  chestMesh.scale.x = 1.30;
  for (const s of [-1, 1]) {
    add(chest, ball(0.086 * B, 1.22, 0.85, 0.62), torsoM, s * 0.088 * B, 0.225 * H, 0.118 * B); // pecs
    add(chest, ball(0.088 * B, 0.5, 1.3, 0.72), torsoM, s * 0.185 * B, 0.08 * H, -0.02); // lats
    add(chest, ball(0.048 * B, 0.6, 1.25, 0.7), torsoM, s * 0.155 * B, -0.03 * H, 0.05); // serratus
  }
  add(chest, ball(0.10 * B, 1.65, 0.5, 0.85), torsoM, 0, 0.30 * H, -0.01); // traps
  if (shirt) {
    for (const sx of [-0.09, 0, 0.09])
      add(chest, new THREE.BoxGeometry(0.05, 0.30 * H, 0.34 * B), darkM, sx, 0.15 * H, 0);
  }
  if (singlet) {
    for (const s of [-1, 1]) {
      const strap = add(chest, new THREE.BoxGeometry(0.10 * B, 0.20 * H, 0.03), trimM, s * 0.11 * B, 0.32 * H, 0.115 * B);
      strap.rotation.x = -0.15;
    }
  }

  // ---- neck + detailed head ----
  const neck = new THREE.Group(); neck.position.y = 0.325 * H; chest.add(neck);
  add(neck, new THREE.CylinderGeometry(0.054 * B, 0.068 * B, 0.14 * H, 14), skinM, 0, 0.05 * H, 0);
  const head = new THREE.Group(); head.position.y = 0.135 * H; neck.add(head);
  const headM = masked ? attM : skinM;
  add(head, ball(0.112 * H, 0.95, 1.08, 0.96, 20, 16), headM, 0, 0.10 * H, 0); // skull
  add(head, ball(0.072 * H, 0.9, 0.78, 0.9, 16, 12), headM, 0, 0.032 * H, 0.036 * H); // jaw
  add(head, ball(0.068 * H, 1.18, 0.42, 0.72, 14, 10), headM, 0, 0.134 * H, 0.058 * H); // brow ridge
  add(head, ball(0.027 * H, 1.0, 0.85, 0.9, 10, 8), headM, 0, 0.006 * H, 0.070 * H); // chin
  const eyeWhiteM = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.25 });
  const irisM = new THREE.MeshStandardMaterial({ color: 0x101014, roughness: 0.3 });
  const lidM = rmat(def.skin ?? 0xd9a066, 0.5, 0.02);
  const mouthM = rmat(0x3a1a16, 0.7, 0);
  mats.push(eyeWhiteM, irisM, mouthM, lidM);
  if (masked) {
    for (const s of [-1, 1]) {
      const e = add(head, ball(0.030, 1, 1, 0.4, 10, 8), eyeWhiteM, s * 0.046 * H, 0.112 * H, 0.098 * H);
      e.castShadow = false;
      const p = add(head, ball(0.013, 1, 1, 0.4, 8, 6), irisM, s * 0.046 * H, 0.112 * H, 0.111 * H);
      p.castShadow = false;
    }
    add(head, ball(0.028, 1.2, 0.7, 0.4, 10, 8), mouthM, 0, 0.042 * H, 0.106 * H);
  } else {
    for (const s of [-1, 1]) {
      const e = add(head, ball(0.019, 1, 1, 0.62, 12, 10), eyeWhiteM, s * 0.044 * H, 0.110 * H, 0.098 * H);
      e.castShadow = false;
      const ir = add(head, ball(0.0095, 1, 1, 0.6, 8, 8), irisM, s * 0.044 * H, 0.110 * H, 0.112 * H);
      ir.castShadow = false;
      const lid = add(head, ball(0.021, 1.15, 0.42, 0.62, 10, 8), lidM, s * 0.044 * H, 0.121 * H, 0.096 * H);
      lid.castShadow = false;
      add(head, ball(0.024, 0.5, 1.0, 0.65, 10, 8), skinM, s * 0.110 * H, 0.093 * H, 0); // ears (smaller, higher)
    }
    add(head, new THREE.BoxGeometry(0.020 * H, 0.045 * H, 0.018 * H), skinM, 0, 0.085 * H, 0.112 * H); // nose bridge
    const nose = add(head, new THREE.ConeGeometry(0.013 * H, 0.030 * H, 8), skinM, 0, 0.058 * H, 0.118 * H);
    nose.rotation.x = Math.PI / 2 + 0.25;
    add(head, new THREE.BoxGeometry(0.052 * H, 0.008 * H, 0.012 * H), mouthM, 0, 0.038 * H, 0.102 * H); // mouth
    add(head, ball(0.020 * H, 1.3, 0.5, 0.5, 8, 6), skinM, 0, 0.028 * H, 0.100 * H); // lower lip
    const hs = def.hairStyle || 'short';
    if (hs === 'short' || hs === 'long') {
      add(head, new THREE.SphereGeometry(0.120 * H, 16, 12, 0, Math.PI * 2, 0, 1.62), hairM, 0, 0.116 * H, -0.014 * H);
      if (hs === 'long')
        add(head, new THREE.CylinderGeometry(0.105 * H, 0.145 * H, 0.38 * H, 14), hairM, 0, -0.10 * H, -0.10 * H);
    }
    // bald: clean scalp, nothing added
  }

  // ---- arms: deltoid caps, belly-high biceps, tapered forearms, fingered fists ----
  function arm(side) {
    const sh = new THREE.Group();
    sh.position.set(side * (0.235 * B + 0.015), 0.26 * H, 0); chest.add(sh);
    add(sh, ball(0.092 * B, 1.02, 1.18, 1.02), armM, side * 0.010, 0.02, 0); // deltoid cap
    add(sh, limbGeo(0.068 * B, 0.050 * B, 0.28 * H, 0.14, 0.32), armM); // bicep
    add(sh, ball(0.052 * B, 1.0, 1.5, 1.05), armM, 0, -0.085 * H, 0.048 * B); // bicep peak
    add(sh, ball(0.047 * B, 0.9, 1.3, 0.9), armM, 0, -0.11 * H, -0.042 * B); // tricep
    const el = new THREE.Group(); el.position.y = -0.29 * H; sh.add(el);
    // small embedded elbow (no ball-joint look)
    add(el, ball(0.042 * B, 1.0, 0.9, 0.9, 12, 10), skinM, 0, 0.005, -0.005);
    if (def.elbowPad) add(el, new THREE.CylinderGeometry(0.060 * B, 0.064 * B, 0.11 * H, 14), darkM, 0, -0.02, 0);
    add(el, limbGeo(0.050 * B, 0.034 * B, 0.27 * H, 0.15, 0.30), skinM); // forearm mass high
    const hand = new THREE.Group(); hand.position.y = -0.28 * H; el.add(hand);
    if (def.wrist) {
      const wb = add(hand, new THREE.TorusGeometry(0.052 * B, 0.016, 8, 14), trimM, 0, 0.03, 0);
      wb.rotation.x = Math.PI / 2;
    }
    add(hand, ball(0.050 * B, 0.95, 1.2, 1.02), skinM, 0, -0.055 * H, 0.005); // palm/fist
    for (let fi = 0; fi < 3; fi++) {
      const fx = (fi - 1) * 0.030 * B;
      const fin = add(hand, cap(0.0135 * B, 0.042 * H, 8), skinM, fx, -0.105 * H, 0.028);
      fin.rotation.x = 1.15; // curled fingers
    }
    const th = add(hand, cap(0.014 * B, 0.045 * H, 8), skinM, -side * 0.042 * B, -0.045 * H, 0.028);
    th.rotation.set(0.5, 0, side * 0.7); // thumb
    return { sh, el, hand };
  }
  const LA = arm(-1), RA = arm(1);

  const aura = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.72, 24),
    new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, side: THREE.DoubleSide }));
  aura.rotation.x = -Math.PI / 2; aura.position.y = 0.05; group.add(aura);

  group.traverse((n) => { if (n.isMesh) n.castShadow = true; });
  return {
    group, aura, mats, skinM,
    pelvis, spine, torso: chest, chest, neck, head,
    lUpper: LA.sh, rUpper: RA.sh, lFore: LA.el, rFore: RA.el,
    lHand: LA.hand, rHand: RA.hand,
    lThigh: LL.hip, rThigh: RL.hip, lShin: LL.knee, rShin: RL.knee,
    lFoot: LL.foot, rFoot: RL.foot,
  };
}

export function getWrestlerData(parts) {
  return parts._wrestler || null;
}

export function updateAura(parts, attitude) {
  if (parts.aura && parts.aura.material) {
    parts.aura.material.opacity = attitude >= 100
      ? (0.5 + Math.sin(performance.now() * 0.012) * 0.4)
      : 0;
  }
}

export function applyHitFlash(parts, flash) {
  for (const m of (parts.mats || [])) {
    if (m.emissive) m.emissive.setHex(flash ? 0x771414 : 0x000000);
  }
}

export function updateGearColors(parts, colors) { /* attire is texture-driven; no-op */ }
export function updateFaceMorphs() { /* rigid sculpt; no-op */ }
export function triggerExpression() { /* rigid sculpt; no-op */ }

export default { buildWrestlerMesh, getWrestlerData, updateAura, applyHitFlash, updateGearColors, updateFaceMorphs, triggerExpression };
