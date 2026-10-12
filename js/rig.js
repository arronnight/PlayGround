// Wrestler Rig — hierarchical primitive sculpt (proven renderer path).
// Muscle-bellied lathe limbs, V-taper torso with abs/obliques, sculpted head
// (brow/chin/nose/ears), patterned attire, boots, pads, masks, hair.
// Same pivot keys as always: group, aura, mats, pelvis, spine, torso/chest,
// neck, head, lUpper/rUpper, lFore/rFore, lHand/rHand, lThigh/rThigh,
// lShin/rShin, lFoot/rFoot.
import * as THREE from 'three';

function rmat(color, rough = 0.5, metal = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}
function ball(r, sx = 1, sy = 1, sz = 1, w = 14, h = 12) {
  const g = new THREE.SphereGeometry(r, w, h);
  g.scale(sx, sy, sz);
  return g;
}
// Lathe-turned limb hanging DOWN (-Y) from pivot, muscle belly partway down.
function limbGeo(rBase, rTip, len, belly = 0.12, bellyAt = 0.3, seg = 14) {
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
  const pelvis = new THREE.Group(); pelvis.position.y = 0.97 * H; group.add(pelvis);
  add(pelvis, ball(0.195 * B, 1.06, 0.74, 0.94), attM, 0, 0.03 * H, 0);
  for (const s of [-1, 1])
    add(pelvis, ball(0.085 * B, 1.0, 1.05, 0.9), attM, s * 0.085 * B, -0.03 * H, -0.09 * B);
  const waist = add(pelvis, new THREE.TorusGeometry(0.195 * B, 0.024 * H, 8, 18), trimM, 0, 0.125 * H, 0);
  waist.rotation.x = Math.PI / 2;

  // ---- legs ----
  function leg(side) {
    const hip = new THREE.Group(); hip.position.set(side * 0.105 * B, -0.02, 0); pelvis.add(hip);
    add(hip, limbGeo(0.096 * B, 0.060 * B, 0.45 * H, 0.12, 0.30), legM);
    add(hip, ball(0.066 * B, 0.95, 1.25, 1.0), legM, 0, -0.14 * H, 0.045 * B);
    const knee = new THREE.Group(); knee.position.y = -0.47 * H; hip.add(knee);
    if (def.kneePads) add(knee, ball(0.075 * B, 1.0, 1.2, 0.85), darkM, 0, -0.03 * H, 0.045 * B);
    const calfM = tights ? legM : skinM;
    add(knee, limbGeo(0.066 * B, 0.042 * B, 0.45 * H, 0.12, 0.28), calfM);
    add(knee, ball(0.050 * B, 0.9, 1.15, 0.95), calfM, 0, -0.10 * H, -0.045 * B);
    const foot = new THREE.Group(); foot.position.y = -0.47 * H; knee.add(foot);
    const tall = (def.bootsH || 'short') === 'tall';
    const shaftH = tall ? 0.30 * H : 0.10 * H;
    add(foot, new THREE.CylinderGeometry(0.068 * B, 0.058 * B, shaftH, 12), bootM, 0, 0.05 * H + shaftH / 2, 0);
    if (tall) {
      const ring = add(foot, new THREE.TorusGeometry(0.068 * B, 0.014, 8, 16), trimM, 0, 0.05 * H + shaftH, 0);
      ring.rotation.x = Math.PI / 2;
    }
    add(foot, ball(0.072 * B, 0.88, 0.55, 1.75), bootM, 0, 0.045 * H, 0.075 * H);
    return { hip, knee, foot };
  }
  const LL = leg(-1), RL = leg(1);

  // ---- spine: waist -> abdomen -> chest ----
  const spine = new THREE.Group(); spine.position.y = 0.10 * H; pelvis.add(spine);
  add(spine, new THREE.CylinderGeometry(0.142 * B, 0.163 * B, 0.30 * H, 16), torsoM, 0, 0.15 * H, 0);
  if (!singlet && !shirt) {
    for (const s of [-1, 1]) {
      add(spine, ball(0.048 * B, 1.0, 1.25, 0.55), skinM, s * 0.052 * B, 0.19 * H, 0.128 * B);
      add(spine, ball(0.042 * B, 1.0, 1.15, 0.5), skinM, s * 0.048 * B, 0.09 * H, 0.132 * B);
    }
    add(spine, ball(0.012, 1, 1, 0.5, 6, 6), darkM, 0, 0.03 * H, 0.150 * B);
  }
  const chest = new THREE.Group(); chest.position.y = 0.30 * H; spine.add(chest);
  const chestMesh = add(chest, new THREE.CapsuleGeometry(0.182 * B, 0.20 * H, 6, 16), torsoM, 0, 0.15 * H, 0);
  chestMesh.scale.x = 1.16;
  for (const s of [-1, 1]) {
    add(chest, ball(0.082 * B, 1.15, 0.8, 0.62), torsoM, s * 0.092 * B, 0.225 * H, 0.128 * B);
    add(chest, ball(0.09 * B, 0.55, 1.2, 0.72), torsoM, s * 0.195 * B, 0.10 * H, -0.02);
  }
  add(chest, ball(0.10 * B, 1.55, 0.5, 0.85), torsoM, 0, 0.30 * H, -0.01);
  for (const s of [-1, 1])
    add(chest, ball(0.07 * B, 0.7, 1.3, 0.8), torsoM, s * 0.135 * B, -0.06 * H, 0.02);
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

  // ---- neck + sculpted head ----
  const neck = new THREE.Group(); neck.position.y = 0.335 * H; chest.add(neck);
  add(neck, new THREE.CylinderGeometry(0.058 * B, 0.070 * B, 0.13 * H, 12), skinM, 0, 0.045 * H, 0);
  const head = new THREE.Group(); head.position.y = 0.13 * H; neck.add(head);
  const headM = masked ? attM : skinM;
  add(head, ball(0.125 * H, 0.96, 1.10, 0.98, 18, 16), headM, 0, 0.10 * H, 0);
  add(head, ball(0.082 * H, 0.92, 0.78, 0.92), headM, 0, 0.035 * H, 0.038 * H);
  add(head, ball(0.075 * H, 1.15, 0.42, 0.72), headM, 0, 0.137 * H, 0.062 * H);
  add(head, ball(0.030 * H, 1.0, 0.85, 0.9), headM, 0, 0.010 * H, 0.075 * H);
  const eyeWhiteM = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.25 });
  const irisM = new THREE.MeshStandardMaterial({ color: 0x101014, roughness: 0.3 });
  const mouthM = rmat(0x3a1a16, 0.7, 0);
  mats.push(eyeWhiteM, irisM, mouthM);
  if (masked) {
    for (const s of [-1, 1]) {
      const e = add(head, ball(0.032, 1, 1, 0.4, 8, 8), eyeWhiteM, s * 0.05 * H, 0.115 * H, 0.104 * H);
      e.castShadow = false;
      const p = add(head, ball(0.014, 1, 1, 0.4, 6, 6), irisM, s * 0.05 * H, 0.115 * H, 0.117 * H);
      p.castShadow = false;
    }
    add(head, ball(0.03, 1.2, 0.7, 0.4, 8, 8), mouthM, 0, 0.045 * H, 0.112 * H);
  } else {
    for (const s of [-1, 1]) {
      const e = add(head, ball(0.017, 1, 1, 0.6, 8, 8), eyeWhiteM, s * 0.048 * H, 0.115 * H, 0.104 * H);
      e.castShadow = false;
      const ir = add(head, ball(0.009, 1, 1, 0.6, 8, 8), irisM, s * 0.048 * H, 0.115 * H, 0.117 * H);
      ir.castShadow = false;
      add(head, ball(0.028, 0.55, 1.0, 0.7, 8, 8), skinM, s * 0.121 * H, 0.095 * H, 0);
    }
    const nose = add(head, new THREE.ConeGeometry(0.016 * H, 0.038 * H, 8), skinM, 0, 0.083 * H, 0.122 * H);
    nose.rotation.x = Math.PI / 2 + 0.25;
    add(head, new THREE.BoxGeometry(0.055 * H, 0.009 * H, 0.012 * H), mouthM, 0, 0.048 * H, 0.108 * H);
    const hs = def.hairStyle || 'short';
    if (hs === 'short' || hs === 'long') {
      add(head, new THREE.SphereGeometry(0.132 * H, 14, 10, 0, Math.PI * 2, 0, 1.55), hairM, 0, 0.118 * H, -0.014 * H);
      if (hs === 'long')
        add(head, new THREE.CylinderGeometry(0.115 * H, 0.155 * H, 0.38 * H, 12), hairM, 0, -0.10 * H, -0.105 * H);
    }
  }

  // ---- arms: bellied lathes, bare skin ----
  function arm(side) {
    const sh = new THREE.Group();
    sh.position.set(side * (0.225 * B + 0.015), 0.27 * H, 0); chest.add(sh);
    add(sh, ball(0.085 * B, 1.0, 1.05, 1.0), armM, side * 0.012, 0.012, 0);
    add(sh, limbGeo(0.074 * B, 0.054 * B, 0.29 * H, 0.10, 0.32), armM);
    add(sh, ball(0.050 * B, 1.0, 1.4, 1.0), armM, 0, -0.10 * H, 0.048 * B);
    const el = new THREE.Group(); el.position.y = -0.30 * H; sh.add(el);
    if (def.elbowPad) add(el, new THREE.CylinderGeometry(0.066 * B, 0.070 * B, 0.11 * H, 12), darkM, 0, -0.02, 0);
    add(el, limbGeo(0.056 * B, 0.040 * B, 0.28 * H, 0.10, 0.30), skinM);
    const hand = new THREE.Group(); hand.position.y = -0.29 * H; el.add(hand);
    if (def.wrist) {
      const wb = add(hand, new THREE.TorusGeometry(0.058 * B, 0.017, 8, 14), trimM, 0, 0.03, 0);
      wb.rotation.x = Math.PI / 2;
    }
    add(hand, ball(0.056 * B, 0.95, 1.25, 1.0), skinM, 0, -0.065 * H, 0.005);
    add(hand, ball(0.020 * B, 1.0, 1.3, 1.0, 8, 8), skinM, -side * 0.045 * B, -0.05 * H, 0.03);
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
