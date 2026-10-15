import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { lerp, damp, clamp } from './utils.js';

const matCache = new Map();
function mat(color, rough = 0.85) { const k = color + '_' + rough; if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color, roughness: rough })); return matCache.get(k); }
// Shared geometries: many peds on screen, so reuse them. dispose() skips shared geos.
// Boxes are rounded (no more hard lego edges), limbs are capsules, heads are spheres.
const geoCache = new Map();
function geo(w, h, d) {
  const k = w + ',' + h + ',' + d;
  if (!geoCache.has(k)) { const g = new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.3); g.userData.shared = true; geoCache.set(k, g); }
  return geoCache.get(k);
}
function sph(r) {
  const k = 's' + r;
  if (!geoCache.has(k)) { const g = new THREE.SphereGeometry(r, 14, 11); g.userData.shared = true; geoCache.set(k, g); }
  return geoCache.get(k);
}
function capsule(r, seg) {
  const k = 'c' + r.toFixed(3) + ',' + seg.toFixed(3);
  if (!geoCache.has(k)) { const g = new THREE.CapsuleGeometry(r, Math.max(0.04, seg - 2 * r), 4, 12); g.userData.shared = true; geoCache.set(k, g); }
  return geoCache.get(k);
}
function taper(rTop, rBottom, h) {
  const k = `t${rTop.toFixed(3)},${rBottom.toFixed(3)},${h.toFixed(3)}`;
  if (!geoCache.has(k)) { const g = new THREE.CylinderGeometry(rTop, rBottom, h, 14); g.userData.shared = true; geoCache.set(k, g); }
  return geoCache.get(k);
}
const SKINS = [0xf1c9a5, 0xd9a877, 0xb17a4b, 0x7a4b2a, 0xe7b78f, 0x5b3a21];
// Shared wound assets: dark seeping marks stuck on the torso front (stylized gore).
const woundGeo = new THREE.BoxGeometry(0.15, 0.12, 0.05); woundGeo.userData.shared = true;
const woundMat = new THREE.MeshStandardMaterial({ color: 0x4a0808, roughness: 1 });
const SHIRTS = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0xecf0f1, 0x1abc9c, 0xe67e22, 0x34495e, 0xff7eb6];
const PANTS = [0x2c3e50, 0x34495e, 0x7f8c8d, 0x1f2a36, 0x5d4037, 0x2e4a7a];
const HAIR = [0x2b1d12, 0x111111, 0x6b4a2b, 0xd9b26f, 0x8a8a8a, 0xa0522d];
// Original player look (a street-kid homage, not a copy of any asset): fixed identity so
// Threads outfits change clothes but never the face.
const CJ_SKIN = 0x6e452a, CJ_HAIR = 0x0d0d0d, CJ_TANK = 0xf4f4f4, CJ_DENIM = 0x2f4f8f;
const BUILDS = {
  slim:     { torsoW: 0.42, torsoH: 0.60, hipW: 0.38, armW: 0.12, legW: 0.145, head: 0.25, h: 0.97 },
  avg:      { torsoW: 0.46, torsoH: 0.62, hipW: 0.42, armW: 0.13, legW: 0.16,  head: 0.26, h: 1.0 },
  athletic: { torsoW: 0.50, torsoH: 0.64, hipW: 0.42, armW: 0.145, legW: 0.175, head: 0.26, h: 1.02 },
  heavy:    { torsoW: 0.55, torsoH: 0.60, hipW: 0.50, armW: 0.15, legW: 0.19,  head: 0.28, h: 0.98 },
};
const HAIR_STYLES = ['fade', 'fade', 'flat', 'afro', 'bald', 'cap', 'beanie', 'long'];

// Procedural low-poly humanoid with a code-driven animation rig.
// Same rig API throughout (armL/armR/legL/legR pivots + lowerG, headG, torso,
// hand/gun/muzzle) so the animation, aiming and weapon code is untouched.
export class Character {
  constructor(opts = {}) {
    const kind = opts.kind || 'ped';
    const female = opts.female ?? (kind === 'ped' && Math.random() < 0.32);
    const R = (a) => a[(Math.random() * a.length) | 0];
    let skin = opts.skin ?? R(SKINS);
    let shirt = opts.shirt ?? R(SHIRTS);
    let pants = opts.pants ?? R(PANTS);
    let hair = opts.hair ?? R(HAIR);
    let build = opts.build ?? (Math.random() < 0.2 ? 'slim' : Math.random() < 0.75 ? 'avg' : 'heavy');
    let hairStyle = opts.hairStyle ?? R(HAIR_STYLES);
    if (female && (hairStyle === 'fade' || hairStyle === 'bald')) hairStyle = 'long';
    let sleeveless = false, jacket = null, shorts = false, beanieM = null;
    let tieM = null, ragged = false;
    if (kind === 'cop') { shirt = 0x1f3a93; pants = 0x141c33; hairStyle = 'cap'; build = opts.build ?? 'athletic'; }
    if (kind === 'gang') { shirt = opts.shirt ?? 0x1b1b1b; pants = opts.pants ?? 0x2a2a2a; hairStyle = opts.hairStyle ?? 'bandana'; }
    if (kind === 'clerk') { pants = 0x222222; hairStyle = 'cap'; }
    if (kind === 'suit') { // downtown business: dark suit, white shirt front, tie, neat hair, briefcase
      shirt = opts.shirt ?? 0x23262e; pants = opts.pants ?? 0x1b1d23; hairStyle = opts.hairStyle ?? 'flat';
      build = opts.build ?? 'avg'; tieM = opts.tie ?? 0x8a1a1a;
    }
    if (kind === 'hick') { // rural: plaid/flannel shirt, jeans, trucker cap, big beard
      shirt = opts.shirt ?? 0x8a3a2a; pants = opts.pants ?? 0x3a4f6a; hairStyle = opts.hairStyle ?? 'cap';
      build = opts.build ?? (Math.random() < 0.5 ? 'avg' : 'heavy');
    }
    if (kind === 'homeless') { // downtown rough sleeping: ragged coat, beanie, grey pallor
      shirt = opts.shirt ?? 0x4a4438; pants = opts.pants ?? 0x2e2a24; hairStyle = 'beanie'; beanieM = 0x3a3a3a;
      build = opts.build ?? 'slim'; ragged = true;
    }
    if (kind === 'player') {
      skin = opts.skin ?? CJ_SKIN; shirt = opts.shirt ?? CJ_TANK; pants = opts.pants ?? CJ_DENIM;
      hair = opts.hair ?? CJ_HAIR; hairStyle = 'fade'; build = opts.build ?? 'athletic'; sleeveless = true;
    }
    if (kind === 'ped' && !female) {
      const r = Math.random();
      if (r < 0.22) jacket = 0x2b2f36; else if (r < 0.32) jacket = 0x5d3a1a;
      if (!jacket && Math.random() < 0.25) shorts = true;
    }
    if (kind === 'ped' && female && Math.random() < 0.4) shorts = true;
    if (hairStyle === 'beanie') beanieM = R(SHIRTS);
    this.kind = kind; this.female = female;
    const B = BUILDS[build] || BUILDS.avg;
    const torsoW = B.torsoW - (female ? 0.04 : 0), hipW = B.hipW + (female ? 0.04 : 0);
    const armW = B.armW - (female ? 0.015 : 0), legW = B.legW;
    const headS = B.head;
    this.group = new THREE.Group();
    const g = this.group;
    const body = this.body = new THREE.Group(); g.add(body);

    const skinM = mat(skin), shirtM = mat(shirt), pantsM = mat(pants), hairM = mat(hair, 0.6);
    const whiteM = mat(0xf5f5f5, 0.9), darkM = mat(0x141414, 0.5), goldM = mat(0xd4af37, 0.35);
    const add = (parent, w, h, d, m, x, y, z) => { const o = new THREE.Mesh(geo(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; parent.add(o); return o; };
    // torso (tapered: broad shoulders, narrow waist) + hips
    const chestZ = torsoW * 0.34; // suit front-detail depth to the taper
    const torso = this.torso = new THREE.Mesh(taper(torsoW * 0.58, torsoW * 0.44, B.torsoH), shirtM);
    torso.scale.z = 0.6; torso.position.y = 1.29; torso.castShadow = true; body.add(torso);
    if (female) { // bust
      for (const sx of [-1, 1]) { const b = new THREE.Mesh(sph(0.075), shirtM); b.position.set(sx * 0.1, 1.42, 0.13); b.castShadow = true; body.add(b); }
    }
    if (kind === 'player') { // chain + pendant over the tank top
      add(body, 0.2, 0.025, 0.02, goldM, 0, 1.52, chestZ + 0.015); add(body, 0.05, 0.06, 0.02, goldM, 0, 1.47, chestZ + 0.018);
    }
    const hips = new THREE.Mesh(taper(hipW * 0.55, hipW * 0.48, 0.2), pantsM); hips.scale.z = 0.62; hips.position.y = 0.9; hips.castShadow = true; body.add(hips);
    if (kind === 'cop') { // duty belt + badge
      add(body, hipW + 0.03, 0.07, 0.29, darkM, 0, 1.0, 0);
      add(body, 0.06, 0.07, 0.02, goldM, -torsoW / 2 + 0.1, 1.45, chestZ + 0.008);
    }
    if (kind === 'suit') { // white shirt front + tie + briefcase in the left hand
      add(body, 0.16, 0.4, 0.02, whiteM, 0, 1.42, chestZ + 0.008);
      add(body, 0.07, 0.34, 0.025, mat(tieM ?? 0x8a1a1a, 0.6), 0, 1.4, chestZ + 0.014);
    }
    // ---- head (oval sphere, not a cube) ----
    const headG = this.headG = new THREE.Group(); headG.position.y = 1.62; body.add(headG);
    const headR = headS * 0.52;
    const head = new THREE.Mesh(sph(headR), skinM); head.scale.set(1, 1.12, 0.95); head.position.y = 0.2; head.castShadow = true; headG.add(head);
    const fz = headS * 0.44; // face plane on the sphere
    add(headG, 0.045, 0.09, 0.06, skinM, -headS / 2 + 0.005, 0.2, 0); // ears
    add(headG, 0.045, 0.09, 0.06, skinM, headS / 2 - 0.005, 0.2, 0);
    add(headG, headS * 0.72, 0.05, 0.015, whiteM, 0, 0.235, fz + 0.008); // eyes
    add(headG, 0.032, 0.032, 0.012, darkM, -0.05, 0.232, fz + 0.015); // pupils
    add(headG, 0.032, 0.032, 0.012, darkM, 0.05, 0.232, fz + 0.015);
    add(headG, 0.05, 0.07, 0.045, skinM, 0, 0.165, fz + 0.018); // nose
    if (female) add(headG, 0.09, 0.022, 0.012, mat(0x8a3b4a, 0.7), 0, 0.1, fz + 0.01); // lips
    else add(headG, 0.1, 0.018, 0.012, mat(0x3a2317, 0.9), 0, 0.1, fz + 0.01); // mouth
    const goatee = kind === 'player' || (!female && kind !== 'cop' && Math.random() < 0.35);
    if (goatee) add(headG, 0.11, 0.055, 0.02, hairM, 0, 0.055, fz + 0.008); // goatee
    const neckMesh = new THREE.Mesh(taper(0.075, 0.085, 0.12), skinM); neckMesh.position.y = 0.0; headG.add(neckMesh);
    // ---- hairstyles (shaped to the round head) ----
    const H = hairM;
    if (hairStyle === 'fade' || (kind === 'player')) {
      add(headG, headS + 0.03, 0.07, headS + 0.03, H, 0, 0.375, 0);
      add(headG, 0.03, 0.12, headS - 0.02, H, -headS / 2 + 0.01, 0.28, 0);
      add(headG, 0.03, 0.12, headS - 0.02, H, headS / 2 - 0.01, 0.28, 0);
      add(headG, headS - 0.02, 0.12, 0.03, H, 0, 0.28, -headS / 2 + 0.01);
    } else if (hairStyle === 'flat') {
      add(headG, headS + 0.04, 0.09, headS + 0.04, H, 0, 0.38, 0);
    } else if (hairStyle === 'afro') {
      const a = new THREE.Mesh(sph(headS * 0.85), H); a.position.y = 0.37; a.scale.set(1, 0.95, 1); a.castShadow = true; headG.add(a);
    } else if (hairStyle === 'cap' || kind === 'cop') {
      const cm = kind === 'cop' ? mat(0x0f1a3a) : (kind === 'clerk' ? mat(shirt, 0.8) : H);
      const dome = new THREE.Mesh(sph(headS * 0.56), cm); dome.scale.set(1, 0.62, 1); dome.position.y = 0.36; dome.castShadow = true; headG.add(dome);
      add(headG, headS - 0.02, 0.03, 0.16, kind === 'cop' ? mat(0x0a0f22) : darkM, 0, 0.335, 0.2);
    } else if (hairStyle === 'beanie') {
      const bm = mat(beanieM ?? hair, 0.9);
      const dome = new THREE.Mesh(sph(headS * 0.58), bm); dome.scale.set(1, 0.72, 1); dome.position.y = 0.36; dome.castShadow = true; headG.add(dome);
      add(headG, headS + 0.05, 0.06, headS + 0.05, bm, 0, 0.31, 0);
    } else if (hairStyle === 'long') {
      add(headG, headS + 0.03, 0.08, headS + 0.03, H, 0, 0.375, 0);
      add(headG, headS - 0.03, 0.42, 0.08, H, 0, 0.08, -headS / 2 - 0.005);
      add(headG, 0.04, 0.3, 0.1, H, -headS / 2 + 0.005, 0.14, 0);
      add(headG, 0.04, 0.3, 0.1, H, headS / 2 - 0.005, 0.14, 0);
    } else if (hairStyle === 'bandana') {
      const bm = mat(opts.gangColor ?? 0x8e44ad, 0.9);
      const dome = new THREE.Mesh(sph(headS * 0.55), bm); dome.scale.set(1, 0.6, 1); dome.position.y = 0.345; headG.add(dome);
      add(headG, 0.08, 0.08, 0.07, bm, 0, 0.33, -headS / 2 - 0.02);
    }
    if (kind === 'cop') { /* cap handled above */ }
    if (kind === 'hick') { // bushy beard
      add(headG, 0.14, 0.09, 0.03, hairM, 0, 0.045, fz + 0.008);
    }
    if (kind === 'homeless' || ragged) { // torn hem: darker patches on the coat
      add(body, torsoW * 0.5, 0.1, 0.03, darkM, torsoW * 0.2, 1.05, chestZ - 0.02);
    }
    if (kind === 'player') { const glasses = new THREE.Mesh(geo(0.24, 0.05, 0.04), mat(0x111111, 0.2)); glasses.position.set(0, 0.24, 0.14); headG.add(glasses); }
    if (kind === 'clerk') { const apron = new THREE.Mesh(geo(0.4, 0.5, 0.05), whiteM); apron.position.set(0, -0.35, chestZ + 0.02); headG.add(apron); }
    // limbs: capsule segments pivoting at joints (round, jointed — no boxes)
    const limb = (w, len, m1, m2, split) => {
      const grp = new THREE.Group();
      const upper = new THREE.Mesh(capsule(w / 2, len * split), m1); upper.position.y = -len * split / 2; upper.castShadow = true; grp.add(upper);
      const lowerG = new THREE.Group(); lowerG.position.y = -len * split; grp.add(lowerG);
      const lower = new THREE.Mesh(capsule(w * 0.45, len * (1 - split)), m2); lower.position.y = -len * (1 - split) / 2; lower.castShadow = true; lowerG.add(lower);
      grp.lowerG = lowerG; return grp;
    };
    const armUpper = sleeveless ? skinM : (jacket ? mat(jacket, 0.9) : shirtM);
    const armLower = jacket ? mat(jacket, 0.9) : skinM;
    this.armL = limb(armW, 0.66, armUpper, armLower, 0.5); this.armL.position.set(-(torsoW / 2 + 0.07), 1.56, 0); body.add(this.armL);
    this.armR = limb(armW, 0.66, armUpper, armLower, 0.5); this.armR.position.set(torsoW / 2 + 0.07, 1.56, 0); body.add(this.armR);
    // fists (round)
    for (const a of [this.armL, this.armR]) { const f = new THREE.Mesh(sph(0.068), skinM); f.position.set(0, -0.36, 0.01); f.castShadow = true; a.lowerG.add(f); }
    if (kind === 'suit') { // briefcase hangs off the left hand
      const bc = new THREE.Mesh(geo(0.09, 0.24, 0.32), mat(0x3a2a1a, 0.6)); bc.position.set(0, -0.5, 0.02); bc.castShadow = true; this.armL.lowerG.add(bc);
      const bh = new THREE.Mesh(geo(0.03, 0.06, 0.12), darkM); bh.position.set(0, -0.37, 0.02); this.armL.lowerG.add(bh);
    }
    if (kind === 'player') { // sleeve tattoo + wristwatch
      add(this.armL, armW + 0.014, 0.1, armW + 0.014, mat(0x1c1c1c, 0.9), 0, -0.14, 0);
      add(this.armL.lowerG, armW * 0.9 + 0.02, 0.05, armW * 0.9 + 0.02, mat(0xc0c0c0, 0.3), 0, -0.26, 0);
    }
    const legLowerM = shorts ? skinM : pantsM;
    this.legL = limb(legW, 0.9, pantsM, legLowerM, 0.5); this.legL.position.set(-0.12, 0.88, 0); body.add(this.legL);
    this.legR = limb(legW, 0.9, pantsM, legLowerM, 0.5); this.legR.position.set(0.12, 0.88, 0); body.add(this.legR);
    if (shorts) { // socks
      add(this.legL.lowerG, legW * 0.92, 0.09, legW * 0.92, whiteM, 0, -0.33, 0);
      add(this.legR.lowerG, legW * 0.92, 0.09, legW * 0.92, whiteM, 0, -0.33, 0);
    }
    if (kind === 'player' || build === 'heavy') { // baggy cuffs
      const cm = kind === 'player' ? mat(0x24406e, 0.9) : pantsM;
      add(this.legL.lowerG, legW + 0.03, 0.08, legW + 0.03, cm, 0, -0.38, 0);
      add(this.legR.lowerG, legW + 0.03, 0.08, legW + 0.03, cm, 0, -0.38, 0);
    }
    const sneakerM = kind === 'player' || Math.random() < 0.3 ? whiteM : mat(0x1a1a1a, 0.5);
    for (const l of [this.legL, this.legR]) {
      const shoe = new THREE.Mesh(geo(legW + 0.01, 0.1, 0.29), sneakerM); shoe.position.set(0, -0.42, 0.06); shoe.castShadow = true; l.lowerG.add(shoe);
      const sole = new THREE.Mesh(geo(legW + 0.02, 0.035, 0.3), darkM); sole.position.set(0, -0.475, 0.06); l.lowerG.add(sole);
    }
    body.scale.setScalar(B.h);
    // weapon holder in the right hand (at the end of the lower arm)
    this.hand = new THREE.Group(); this.hand.position.y = -0.3; this.armR.lowerG.add(this.hand);
    this.gun = new THREE.Group(); this.hand.add(this.gun); this.gun.visible = false; this.gun.rotation.x = Math.PI / 2; // barrel runs along the arm
    this.muzzle = new THREE.Object3D(); this.gun.add(this.muzzle); this.gunKey = null;
    this.setWeapon(opts.weapon || 'pistol');

    this.phase = Math.random() * 6.28; this.lean = 0; this.bob = 0; this.deadT = 0;
    this.state = { move: 0, run: 0, aiming: false, sitting: false, dead: false, punch: 0, airborne: false, swim: false, panic: false, weaponLong: false, hasWeapon: false, aimPitch: 0, firePose: 0 };
  }

  dispose() {
    const seen = new Set(); this.group.traverse(o => { if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); if (!o.geometry.userData.shared) o.geometry.dispose(); } });
    this.group.parent?.remove(this.group);
  }
  // Build a chunky procedural gun model. Barrel points along +z of the gun group; origin sits in the palm.
  addWound() {
    this.wounds ||= [];
    if (this.wounds.length >= 3) { const old = this.wounds.shift(); old.parent?.remove(old); }
    const m = new THREE.Mesh(woundGeo, woundMat);
    m.position.set((Math.random() - 0.5) * 0.24, 1.15 + Math.random() * 0.35, 0.2);
    m.rotation.set(0, (Math.random() - 0.5) * 0.6, Math.random() * 3);
    this.torso.add(m); this.wounds.push(m);
  }
  setWeapon(key) {
    if (key === this.gunKey) return; this.gunKey = key;
    while (this.gun.children.length > 1) { const old = this.gun.children[this.gun.children.length - 1]; this.gun.remove(old); old.traverse?.((o) => { if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose(); }); }
    const dark = mat(0x1a1c1f, 0.35), metal = new THREE.MeshStandardMaterial({ color: 0x4a5058, roughness: 0.3, metalness: 0.85 }), wood = mat(0x6b4a2b, 0.7), olive = mat(0x4b5a2e, 0.7);
    const add = (geo, m, x, y, z, rx = 0, ry = 0, rz = 0) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.castShadow = true; this.gun.add(o); return o; };
    const box = (w, h, d) => geo(w, h, d); const cyl = (r, l, r2 = r) => { const g = new THREE.CylinderGeometry(r, r2, l, 10); g.rotateX(Math.PI / 2); return g; };
    let muzzleZ = 0.25;
    if (key === 'pistol') {
      add(box(0.045, 0.07, 0.22), dark, 0, 0.03, 0.1); add(cyl(0.012, 0.07), metal, 0, 0.03, 0.24); add(box(0.04, 0.13, 0.055), mat(0x2a2a2a, 0.5), 0, -0.05, 0.0, 0.2);
      add(box(0.03, 0.02, 0.06), dark, 0, -0.02, 0.07); muzzleZ = 0.28;
    } else if (key === 'uzi') {
      add(box(0.06, 0.09, 0.3), dark, 0, 0.02, 0.12); add(box(0.035, 0.18, 0.05), metal, 0, -0.1, 0.03); add(cyl(0.014, 0.12), metal, 0, 0.03, 0.32);
      add(box(0.04, 0.12, 0.05), mat(0x2a2a2a, 0.5), 0, -0.06, -0.04, 0.2); add(box(0.03, 0.03, 0.22), metal, 0, 0.04, -0.14); muzzleZ = 0.38;
    } else if (key === 'shotgun') {
      add(cyl(0.017, 0.72), metal, 0, 0.04, 0.42); add(cyl(0.014, 0.5), metal, 0, 0.005, 0.4); add(box(0.05, 0.05, 0.16), wood, 0, 0.0, 0.32);
      add(box(0.05, 0.08, 0.22), dark, 0, 0.02, 0.06); add(box(0.045, 0.09, 0.3), wood, 0, -0.04, -0.2, -0.12); muzzleZ = 0.8;
    } else if (key === 'rifle') {
      add(cyl(0.013, 0.62), metal, 0, 0.045, 0.5); add(box(0.05, 0.09, 0.32), dark, 0, 0.02, 0.1); add(box(0.035, 0.16, 0.06), dark, 0, -0.09, 0.14, 0.25);
      add(box(0.04, 0.05, 0.22), dark, 0, 0.0, 0.32); add(box(0.045, 0.08, 0.28), dark, 0, -0.02, -0.22, -0.1); add(cyl(0.02, 0.16), metal, 0, 0.1, 0.08); add(box(0.04, 0.12, 0.05), mat(0x2a2a2a, 0.5), 0, -0.06, -0.03, 0.2); muzzleZ = 0.82;
    } else if (key === 'rpg') {
      add(cyl(0.045, 0.9), olive, 0, 0.06, 0.2); add(cyl(0.05, 0.22, 0.02), mat(0x8a3a2a, 0.5), 0, 0.06, 0.76); add(cyl(0.06, 0.1, 0.045), olive, 0, 0.06, -0.3);
      add(box(0.04, 0.12, 0.05), mat(0x2a2a2a, 0.5), 0, -0.05, 0.05, 0.2); add(box(0.04, 0.1, 0.05), mat(0x2a2a2a, 0.5), 0, -0.04, 0.3, 0.2); muzzleZ = 0.9;
    } else { muzzleZ = 0.2; }
    const sc = key === 'pistol' ? 1.7 : key === 'uzi' ? 1.5 : 1.3; // chunky, readable silhouettes
    this.muzzle.position.set(0, 0.04 * sc, muzzleZ * sc);
    for (const c of this.gun.children) if (c !== this.muzzle) { c.scale.setScalar(sc); c.position.multiplyScalar(sc); }
  }

  // move: 0..1 blend, run: 0..1
  animate(dt, s = this.state) {
    const { move, run } = s;
    const speedMul = 6 + run * 6; if (move > 0.05 && !s.sitting) this.phase += dt * speedMul * (0.5 + move * 0.5);
    const amp = s.sitting ? 0 : lerp(0.35, 0.95, run) * move;
    const sw = Math.sin(this.phase), cw = Math.cos(this.phase);
    const L = 1 - Math.exp(-14 * dt);
    const setRot = (o, x, y = 0, z = 0) => { o.rotation.x = lerp(o.rotation.x, x, L); o.rotation.y = lerp(o.rotation.y, y, L); o.rotation.z = lerp(o.rotation.z, z, L); };
    this.gun.visible = s.hasWeapon && !s.dead;
    if (s.dead) {
      this.deadT += dt; const t = clamp(this.deadT * 2.2, 0, 1); const e = 1 - (1 - t) * (1 - t);
      // active-ragdoll lite: impact energy flails the limbs on suddenly-loose
      // joints, then the body settles into a random sprawl (back / side / crumple)
      s.flail = Math.max(0, (s.flail || 0) - dt * 0.9);
      const sp = s.sprawl ?? 0;
      this.phase += dt * (4 + s.flail * 22);
      const f1 = Math.sin(this.phase) * s.flail, f2 = Math.sin(this.phase * 1.3 + 1.7) * s.flail;
      if (sp === 1) { // side sprawl
        const d = this.deadDir ?? 1;
        this.body.rotation.x = lerp(this.body.rotation.x, -0.25, e * 0.3 + 0.05);
        this.body.rotation.z = lerp(this.body.rotation.z, d * 1.35, e * 0.3 + 0.05);
        this.body.position.y = lerp(this.body.position.y, 0.3, 0.2);
        setRot(this.armL, -0.9 + f1 * 0.7, 0, 0.9); setRot(this.armR, 0.4 + f2 * 0.7, 0, -0.5);
        setRot(this.legL, -0.5 + f2 * 0.5, 0, 0.15); setRot(this.legR, -0.9 + f1 * 0.5, 0, -0.1);
        this.legL.lowerG.rotation.x = lerp(this.legL.lowerG.rotation.x, 0.9, L);
        this.legR.lowerG.rotation.x = lerp(this.legR.lowerG.rotation.x, 1.2, L);
      } else if (sp === 2) { // face-down crumple
        this.body.rotation.x = lerp(this.body.rotation.x, 0.9, e * 0.3 + 0.05);
        this.body.rotation.z = lerp(this.body.rotation.z, 0, e * 0.3 + 0.05);
        this.body.position.y = lerp(this.body.position.y, 0.32, 0.2);
        setRot(this.armL, -0.5 + f1 * 0.6, 0, 0.7); setRot(this.armR, -0.5 + f2 * 0.6, 0, -0.7);
        setRot(this.legL, 0.5 + f1 * 0.4, 0, 0.1); setRot(this.legR, 0.3 + f2 * 0.4, 0, -0.1);
        this.legL.lowerG.rotation.x = lerp(this.legL.lowerG.rotation.x, 1.1, L);
        this.legR.lowerG.rotation.x = lerp(this.legR.lowerG.rotation.x, 1.1, L);
      } else { // on the back (classic)
        this.body.rotation.x = lerp(this.body.rotation.x, -Math.PI / 2 * (this.deadDir ?? 1), e * 0.3 + 0.05);
        this.body.rotation.z = lerp(this.body.rotation.z, 0, e * 0.3 + 0.05);
        this.body.position.y = lerp(this.body.position.y, 0.15, 0.2);
        setRot(this.armL, -0.4 + f1 * 0.8, 0, -1.2); setRot(this.armR, 0.5 + f2 * 0.8, 0, 1.0);
        setRot(this.legL, 0.1 + f2 * 0.5, 0, 0.3); setRot(this.legR, -0.2 + f1 * 0.5, 0, -0.2);
        this.legL.lowerG.rotation.x = lerp(this.legL.lowerG.rotation.x, 0.4, L);
        this.legR.lowerG.rotation.x = lerp(this.legR.lowerG.rotation.x, 0.15, L);
      }
      setRot(this.headG, 0.3 + f1 * 0.2, 0, 0);
      return;
    }
    this.body.rotation.x = lerp(this.body.rotation.x, 0, L); this.body.position.y = lerp(this.body.position.y, 0, L);
    if (s.exhausted) {
      // bent over, hands on knees, heaving breaths
      this.phase += dt * 7;
      const heave = Math.sin(this.phase) * 0.06;
      this.body.rotation.x = lerp(this.body.rotation.x, 0.85 + heave, L);
      this.body.position.y = lerp(this.body.position.y, -0.42, L);
      setRot(this.legL, -0.25, 0, 0.06); setRot(this.legR, -0.25, 0, -0.06);
      this.legL.lowerG.rotation.x = lerp(this.legL.lowerG.rotation.x, 0.45, L);
      this.legR.lowerG.rotation.x = lerp(this.legR.lowerG.rotation.x, 0.45, L);
      setRot(this.armL, -0.75, 0, 0.15); setRot(this.armR, -0.75, 0, -0.15);
      this.armL.lowerG.rotation.x = lerp(this.armL.lowerG.rotation.x, -0.5, L);
      this.armR.lowerG.rotation.x = lerp(this.armR.lowerG.rotation.x, -0.5, L);
      setRot(this.headG, 0.55 + heave * 0.5, 0, 0);
      this.torso.rotation.x = 0; this.torso.rotation.y = lerp(this.torso.rotation.y, 0, L);
      return;
    }
    if (s.sleeping) {
      // flat on the back, arms at sides, slow breathing
      this.phase += dt * 1.6;
      const br = Math.sin(this.phase) * 0.03;
      this.body.rotation.x = lerp(this.body.rotation.x, -Math.PI / 2 + 0.08, L);
      this.body.position.y = lerp(this.body.position.y, 0.14, L);
      setRot(this.legL, 0, 0, 0.05); setRot(this.legR, 0, 0, -0.05);
      this.legL.lowerG.rotation.x = lerp(this.legL.lowerG.rotation.x, 0.05, L);
      this.legR.lowerG.rotation.x = lerp(this.legR.lowerG.rotation.x, 0.05, L);
      setRot(this.armL, 0.1, 0, 0.35); setRot(this.armR, 0.1, 0, -0.35);
      this.armL.lowerG.rotation.x = lerp(this.armL.lowerG.rotation.x, -0.15, L);
      this.armR.lowerG.rotation.x = lerp(this.armR.lowerG.rotation.x, -0.15, L);
      this.torso.rotation.x = br; this.torso.rotation.y = lerp(this.torso.rotation.y, 0, L);
      setRot(this.headG, 0.3, 0.3, 0);
      return;
    }
    if (s.sitting) {
      setRot(this.legL, -1.45, 0, 0.05); setRot(this.legR, -1.45, 0, -0.05); this.legL.lowerG.rotation.x = lerp(this.legL.lowerG.rotation.x, 1.3, L); this.legR.lowerG.rotation.x = lerp(this.legR.lowerG.rotation.x, 1.3, L);
      setRot(this.armL, -1.0, 0, 0.35); setRot(this.armR, -1.0, 0, -0.35); this.armL.lowerG.rotation.x = lerp(this.armL.lowerG.rotation.x, -0.6, L); this.armR.lowerG.rotation.x = lerp(this.armR.lowerG.rotation.x, -0.6, L);
      this.torso.rotation.x = 0; this.body.position.y = -1.0; setRot(this.headG, 0, 0, 0);
      return;
    }
    if (s.swim) {
      this.phase += dt * 5; const p = this.phase;
      setRot(this.armL, -Math.PI + Math.sin(p) * 1.2, 0, 0.4); setRot(this.armR, -Math.PI + Math.sin(p + Math.PI) * 1.2, 0, -0.4);
      setRot(this.legL, Math.sin(p * 2) * 0.4, 0, 0); setRot(this.legR, -Math.sin(p * 2) * 0.4, 0, 0);
      this.body.rotation.x = lerp(this.body.rotation.x, 1.35, L); this.body.position.y = -0.6; return;
    }
    // legs (crouch bends the knees and drops the hips; aim arms still work on top)
    const cr = s.crouch ? 1 : 0;
    setRot(this.legL, sw * amp * (1 - cr * 0.6) - 1.0 * cr, 0, 0); setRot(this.legR, -sw * amp * (1 - cr * 0.6) - 1.0 * cr, 0, 0);
    this.legL.lowerG.rotation.x = lerp(this.legL.lowerG.rotation.x, Math.max(0, -cw) * amp * 1.2 * (1 - cr) + 1.35 * cr, L);
    this.legR.lowerG.rotation.x = lerp(this.legR.lowerG.rotation.x, Math.max(0, cw) * amp * 1.2 * (1 - cr) + 1.35 * cr, L);
    this.body.position.y = lerp(this.body.position.y, -0.5 * cr, L);
    this.torso.rotation.x = lerp(this.torso.rotation.x, 0.35 * cr, L);
    if (s.airborne) { setRot(this.legL, -0.5, 0, 0.1); setRot(this.legR, 0.3, 0, -0.1); this.legL.lowerG.rotation.x = 1.0; }
    // arms
    const posing = (s.aiming || s.firePose > 0) && s.hasWeapon;
    if (posing) {
      const ap = s.aimPitch || 0; // + = aiming up
      // both hands meet in front of the chest so the weapon sits between the shoulders and reads from the over-shoulder camera
      // (Euler XYZ: z swings the hanging arm sideways, then x lifts it forward — so z is what brings the hands together)
      if (s.weaponLong) { setRot(this.armR, -Math.PI / 2 - ap, 0, -0.42); setRot(this.armL, -Math.PI / 2 - ap + 0.12, 0, 0.55); this.armL.lowerG.rotation.x = lerp(this.armL.lowerG.rotation.x, -0.55, L); this.armR.lowerG.rotation.x = lerp(this.armR.lowerG.rotation.x, 0, L); }
      else { setRot(this.armR, -Math.PI / 2 - ap, 0, -0.38); setRot(this.armL, -Math.PI / 2 - ap + 0.2, 0, 0.6); this.armL.lowerG.rotation.x = lerp(this.armL.lowerG.rotation.x, -0.5, L); this.armR.lowerG.rotation.x = lerp(this.armR.lowerG.rotation.x, 0, L); }
      this.gun.rotation.x = Math.PI / 2; this.gun.rotation.y = 0; this.gun.position.set(0, 0.03, 0.02);
      this.torso.rotation.y = lerp(this.torso.rotation.y, -0.35, L);
    } else if (s.punch > 0) {
      const p = s.punch; setRot(this.armR, -1.4 - Math.sin(p * Math.PI) * 0.6, 0.2, -0.1); this.armR.lowerG.rotation.x = -0.4 + Math.sin(p * Math.PI) * 0.4; setRot(this.armL, -0.9, -0.3, 0.3); this.armL.lowerG.rotation.x = -1.3;
    } else {
      const armAmp = amp * 0.9; const panic = s.panic ? 1 : 0;
      setRot(this.armL, -sw * armAmp - panic * 2.4, 0, 0.12 + panic * 0.6); setRot(this.armR, sw * armAmp - panic * 2.4, 0, -0.12 - panic * 0.6);
      this.armL.lowerG.rotation.x = lerp(this.armL.lowerG.rotation.x, -0.3 - run * 0.9, L); this.armR.lowerG.rotation.x = lerp(this.armR.lowerG.rotation.x, -0.3 - run * 0.9 - (s.hasWeapon ? 0.5 : 0), L);
      this.gun.rotation.x = Math.PI / 2; this.gun.position.set(0, 0, 0.02); this.torso.rotation.y = lerp(this.torso.rotation.y, 0, L);
    }
    // torso lean & bob
    this.torso.rotation.x = 0;
    this.body.rotation.x = lerp(this.body.rotation.x, run * 0.18 * move + (s.airborne ? 0.15 : 0), L);
    this.body.position.y = Math.abs(cw) * amp * 0.08;
    setRot(this.headG, posing ? -0.05 - (s.aimPitch || 0) * 0.5 : 0.05 - run * 0.1, posing ? 0.15 : 0, 0);
  }
}
