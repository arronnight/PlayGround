// Main Skinned Mesh System - Base human mesh with full bone hierarchy
// Replaces primitive hierarchy with single SkinnedMesh per wrestler

import * as THREE from 'three';
import { computeSkinningWeights, buildSkeleton, generateBonePositions, createSkinnedMesh, BONE_NAMES } from './skinningWeights.js';
import { BODY_ARCHETYPES, ARCHETYPE_MORPHS, applyArchetypeMorphs } from './wrestlerVariations.js';
import { createWrestlerGear } from './gearSystem.js';

export { createWrestlerGear } from './gearSystem.js';

export { BONE_NAMES };


// Sculpted part helper: bake transform into geometry, tag bone + material zone.
// mat: 0 skin, 1 attire, 2 trim, 3 boot, 4 dark, 5 shirt(white)
function sculptPart(parts, geo, bone, mat, name, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)),
    new THREE.Vector3(sx, sy, sz)
  );
  geo.applyMatrix4(m);
  parts.push({ geometry: geo, bone, mat, name });
}
function sBall(r, sx = 1, sy = 1, sz = 1, w = 14, h = 12) {
  const g = new THREE.SphereGeometry(r, w, h);
  g.scale(sx, sy, sz);
  return g;
}
// Lathe-turned limb hanging DOWN (-Y) from pivot: profile [[r,y]...] pivot→tip.
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

// Generate base human mesh with anatomical topology
export function createBaseHumanGeometry(def) {
  const H = def.height || 1.0;
  const B = def.bulk || 1.0;
  const singlet = (def.torso || 'bare') === 'singlet';
  const shirt = (def.torso || 'bare') === 'shirt';
  const tights = (def.legs || 'trunks') === 'tights' || singlet;
  const torsoMat = singlet ? 1 : shirt ? 5 : 0;
  const legMat = tights ? 1 : 0;

  // Create body parts with proper topology for skinning
  const parts = [];

  // ---- torso: V-taper mass (wide chest, narrow waist) ----
  sculptPart(parts, new THREE.CapsuleGeometry(0.182 * B, 0.20 * H, 6, 16), 'Spine3', torsoMat, 'torso',
    0, 1.52 * H, 0, 0, 0, 0, 1.16, 1, 0.82);
  // pecs
  for (const s of [-1, 1])
    sculptPart(parts, sBall(0.082 * B, 1.15, 0.8, 0.62), 'Spine3', torsoMat, 'pec',
      s * 0.092 * B, 1.60 * H, 0.128 * B);
  // lats sweep
  for (const s of [-1, 1])
    sculptPart(parts, sBall(0.09 * B, 0.55, 1.2, 0.72), 'Spine3', torsoMat, 'lat',
      s * 0.195 * B, 1.47 * H, -0.02);
  // trapezius slope into neck
  sculptPart(parts, sBall(0.10 * B, 1.55, 0.5, 0.85), 'Spine3', torsoMat, 'traps', 0, 1.68 * H, -0.01);
  // obliques
  for (const s of [-1, 1])
    sculptPart(parts, sBall(0.07 * B, 0.7, 1.3, 0.8), 'Spine2', torsoMat, 'oblique',
      s * 0.135 * B, 1.24 * H, 0.02);

  // ---- abdomen: tapered waist + ab hint (bare only) ----
  sculptPart(parts, new THREE.CylinderGeometry(0.142 * B, 0.163 * B, 0.30 * H, 16), 'Spine2', torsoMat, 'abdomen',
    0, 1.22 * H, 0);
  if (!singlet && !shirt) {
    for (const s of [-1, 1]) {
      sculptPart(parts, sBall(0.048 * B, 1.0, 1.25, 0.55), 'Spine2', 0, 'ab',
        s * 0.052 * B, 1.26 * H, 0.128 * B);
      sculptPart(parts, sBall(0.042 * B, 1.0, 1.15, 0.5), 'Spine2', 0, 'ab2',
        s * 0.048 * B, 1.16 * H, 0.132 * B);
    }
    sculptPart(parts, sBall(0.012, 1, 1, 0.5, 6, 6), 'Spine2', 4, 'navel', 0, 1.07 * H, 0.150 * B);
  }

  // ---- pelvis + trunks shell (attire always covers hips) ----
  sculptPart(parts, sBall(0.195 * B, 1.06, 0.74, 0.94), 'Pelvis', 1, 'trunks', 0, 1.00 * H, 0);
  // glutes (attire)
  for (const s of [-1, 1])
    sculptPart(parts, sBall(0.085 * B, 1.0, 1.05, 0.9), 'Pelvis', 1, 'glute',
      s * 0.085 * B, 0.94 * H, -0.09 * B);
  
  // ---- neck ----
  sculptPart(parts, new THREE.CylinderGeometry(0.058 * B, 0.070 * B, 0.14 * H, 12), 'Neck', 0, 'neck',
    0, 1.70 * H, 0);

  // ---- sculpted head (skin; eyes/mouth/hair are rigid bone children in rig.js) ----
  const masked = def.hairStyle === 'mask';
  const headMat = masked ? 1 : 0;
  sculptPart(parts, sBall(0.125 * H, 0.96, 1.10, 0.98, 18, 16), 'Head', headMat, 'skull', 0, 1.935 * H, 0);
  sculptPart(parts, sBall(0.082 * H, 0.92, 0.78, 0.92), 'Head', headMat, 'jaw', 0, 1.87 * H, 0.038 * H);
  sculptPart(parts, sBall(0.075 * H, 1.15, 0.42, 0.72), 'Head', headMat, 'brow', 0, 1.972 * H, 0.062 * H);
  sculptPart(parts, sBall(0.030 * H, 1.0, 0.85, 0.9), 'Head', headMat, 'chin', 0, 1.845 * H, 0.075 * H);
  if (!masked) {
    const nose = new THREE.ConeGeometry(0.016 * H, 0.038 * H, 8);
    sculptPart(parts, nose, 'Head', 0, 'nose', 0, 1.918 * H, 0.122 * H, Math.PI / 2 + 0.25, 0, 0);
    for (const s of [-1, 1])
      sculptPart(parts, sBall(0.028, 0.55, 1.0, 0.7, 8, 8), 'Head', 0, 'ear',
        s * 0.121 * H, 1.93 * H, 0);
  }

  // ---- arms: lathe-turned, belly high like real muscle ----
  for (const side of [-1, 1]) {
    const prefix = side > 0 ? 'R' : 'L';
    const sx = side * 0.24 * B;
    sculptPart(parts, sBall(0.085 * B, 1.0, 1.05, 1.0), `UpperArm_${prefix}`, 0, 'delt',
      sx + side * 0.012, 1.652 * H, 0);
    sculptPart(parts, limbGeo(0.074 * B, 0.054 * B, 0.29 * H, 0.10, 0.32), `UpperArm_${prefix}`, 0, 'bicep',
      sx, 1.64 * H, 0);
    sculptPart(parts, sBall(0.050 * B, 1.0, 1.4, 1.0), `UpperArm_${prefix}`, 0, 'bicepPeak',
      sx, 1.54 * H, 0.048 * B);
    sculptPart(parts, limbGeo(0.056 * B, 0.040 * B, 0.28 * H, 0.10, 0.30), `Forearm_${prefix}`, 0, 'forearm',
      sx, 1.34 * H, 0);
    sculptPart(parts, sBall(0.056 * B, 0.95, 1.25, 1.0), `Hand_${prefix}`, 0, 'fist',
      sx, 0.995 * H, 0.005);
    sculptPart(parts, sBall(0.020 * B, 1.0, 1.3, 1.0, 8, 8), `Hand_${prefix}`, 0, 'thumb',
      sx - side * 0.045 * B, 1.01 * H, 0.03);
  }

  // ---- legs: quad sweep up top, calf belly high, thin ankles ----
  for (const side of [-1, 1]) {
    const prefix = side > 0 ? 'R' : 'L';
    const sx = side * 0.105 * B;
    sculptPart(parts, limbGeo(0.096 * B, 0.060 * B, 0.45 * H, 0.12, 0.30), `Thigh_${prefix}`, legMat, 'thigh',
      sx, 0.95 * H, 0);
    sculptPart(parts, sBall(0.066 * B, 0.95, 1.25, 1.0), `Thigh_${prefix}`, legMat, 'quad',
      sx, 0.81 * H, 0.045 * B);
    sculptPart(parts, limbGeo(0.066 * B, 0.042 * B, 0.45 * H, 0.12, 0.28), `Shin_${prefix}`, legMat, 'calf',
      sx, 0.48 * H, 0);
    sculptPart(parts, sBall(0.050 * B, 0.9, 1.15, 0.95), `Shin_${prefix}`, legMat, 'calfBelly',
      sx, 0.38 * H, -0.045 * B);
    // foot wedge (boot shell added in rig.js)
    sculptPart(parts, sBall(0.072 * B, 0.88, 0.55, 1.75), `Foot_${prefix}`, 3, 'foot',
      sx, 0.045 * H, 0.075 * H);
  }
  
  // Merge all geometries, bucketed by material zone with one group each.
  // Group order = material index order [skin, attire, trim, boot, dark, shirt].
  const mergedGeo = new THREE.BufferGeometry();
  const positionArray = [];
  const normalArray = [];
  const uvArray = [];
  const skinIndexArray = [];
  const skinWeightArray = [];

  const boneIndices = {};
  BONE_NAMES.forEach((name, i) => { boneIndices[name] = i; });

  const buckets = [[], [], [], [], [], []];
  for (const part of parts) buckets[part.mat || 0].push(part);
  buckets.forEach((bucket) => {
    for (const part of bucket) {
      const geo = part.geometry;
    const pos = geo.getAttribute('position');
    const norm = geo.getAttribute('normal');
    const uv = geo.getAttribute('uv') || createUVs(geo);
    
    const count = pos.count;
    const boneIdx = boneIndices[part.bone] || 0;
    
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const n = new THREE.Vector3().fromBufferAttribute(norm, i);
      const u = new THREE.Vector2().fromBufferAttribute(uv, i);
      
      positionArray.push(v.x, v.y, v.z);
      normalArray.push(n.x, n.y, n.z);
      uvArray.push(u.x, u.y);
      
      // Skin weights: primarily this bone, with small influence from parent
      const parentBone = getParentBone(part.bone);
      const parentIdx = parentBone ? boneIndices[parentBone] : boneIdx;

      skinIndexArray.push(boneIdx, parentIdx, 0, 0);
      skinWeightArray.push(0.85, 0.15, 0, 0);
    }
    }
  });

  // Rebuild groups from concatenated ranges: recompute per-bucket counts.
  // (Arrays above were pushed bucket-by-bucket, so ranges are contiguous.)
  let cursor = 0;
  {
    const counts = buckets.map((bucket) => bucket.reduce((s, part) => {
      const g = part.geometry.getAttribute('position');
      return s + (g ? g.count : 0);
    }, 0));
    counts.forEach((c, matIdx) => {
      if (c > 0) mergedGeo.addGroup(cursor, c, matIdx);
      cursor += c;
    });
  }

  mergedGeo.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));
  mergedGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normalArray, 3));
  mergedGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
  mergedGeo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndexArray, 4));
  mergedGeo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeightArray, 4));
  
  // Compute bounding box/sphere
  mergedGeo.computeBoundingSphere();
  mergedGeo.computeBoundingBox();
  
  return mergedGeo;
}

function createUVs(geometry) {
  const pos = geometry.getAttribute('position');
  const count = pos.count;
  const uvs = new Float32Array(count * 2);
  
  for (let i = 0; i < count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    // Simple cylindrical UV projection
    const u = 0.5 + Math.atan2(v.x, v.z) / (Math.PI * 2);
    const v_coord = (v.y + 1) / 2; // assuming normalized
    uvs[i * 2] = u;
    uvs[i * 2 + 1] = Math.max(0, Math.min(1, v_coord));
  }
  return new THREE.BufferAttribute(uvs, 2);
}

function getParentBone(boneName) {
  const hierarchy = {
    'Spine3': 'Spine2', 'Spine2': 'Spine1', 'Spine1': 'Pelvis',
    'Neck': 'Spine3', 'Head': 'Neck',
    'Clavicle_L': 'Spine3', 'Clavicle_R': 'Spine3',
    'UpperArm_L': 'Clavicle_L', 'UpperArm_R': 'Clavicle_R',
    'Forearm_L': 'UpperArm_L', 'Forearm_R': 'UpperArm_R',
    'Hand_L': 'Forearm_L', 'Hand_R': 'Forearm_R',
    'Thigh_L': 'Pelvis', 'Thigh_R': 'Pelvis',
    'Shin_L': 'Thigh_L', 'Shin_R': 'Thigh_R',
    'Foot_L': 'Shin_L', 'Foot_R': 'Shin_R',
  };
  return hierarchy[boneName] || null;
}

// Create complete wrestler skinned mesh
export function createWrestlerSkinnedMesh(def) {
  // Generate bone positions from wrestler definition
  const bonePositions = generateBonePositions(def);
  
  // Build skeleton
  const { bones, boneMap } = buildSkeleton(bonePositions);
  
  // Create base geometry
  const geometry = createBaseHumanGeometry(def);
  
  // Create skeleton helper
  const skeleton = new THREE.Skeleton(bones);
  
  // Compute skinning weights
  computeSkinningWeights(geometry, skeleton);
  
  // Apply archetype morphs
  if (def.bodyType && ARCHETYPE_MORPHS[def.bodyType]) {
    const morphs = ARCHETYPE_MORPHS[def.bodyType];
    // Add morph targets to geometry (simplified)
    for (const { target, weight } of morphs) {
      // Morph targets would be pre-computed on base geometry
    }
  }
  
  // Create skinned mesh with per-zone materials:
  // 0 skin, 1 attire (patterned), 2 trim, 3 boot, 4 dark, 5 shirt(white)
  const skinMat = new THREE.MeshStandardMaterial({ color: def.skin || 0xd9a066, roughness: 0.46, metalness: 0.03 });
  const attireMat = new THREE.MeshStandardMaterial({ map: makeAttireTexture(def), roughness: 0.6, metalness: 0.02 });
  const trimMat = new THREE.MeshStandardMaterial({ color: def.trim || 0xffd23f, roughness: 0.45, metalness: 0.25 });
  const bootMat = new THREE.MeshStandardMaterial({ color: def.boots || 0x111111, roughness: 0.42, metalness: 0.15 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x14141a, roughness: 0.6, metalness: 0.05 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.65, metalness: 0.0 });
  const mesh = createSkinnedMesh(geometry, skeleton, [skinMat, attireMat, trimMat, bootMat, darkMat, shirtMat]);
  
  // Return complete wrestler object with bone references for animation.
  // NOTE: face/gear detail meshes are built as rigid bone children in rig.js
  // (buildDetails) — single skinned body mesh here, no extra skinned meshes.
  const wrestlerMesh = {
    mesh,
    headMesh: null,
    skeleton,
    bones: boneMap,
    gear: null,
    def,
    
    // Bone references for backward compatibility with poseFighter
    getBone(name) { return boneMap[name]; },
    
    // Legacy pivot references (for poseFighter compatibility)
    get pelvis() { return boneMap['Pelvis']; },
    get spine() { return boneMap['Spine1']; },
    get torso() { return boneMap['Spine3']; },
    get chest() { return boneMap['Spine3']; },
    get neck() { return boneMap['Neck']; },
    get head() { return boneMap['Head']; },
    get lUpper() { return boneMap['UpperArm_L']; },
    get rUpper() { return boneMap['UpperArm_R']; },
    get lFore() { return boneMap['Forearm_L']; },
    get rFore() { return boneMap['Forearm_R']; },
    get lHand() { return boneMap['Hand_L']; },
    get rHand() { return boneMap['Hand_R']; },
    get lThigh() { return boneMap['Thigh_L']; },
    get rThigh() { return boneMap['Thigh_R']; },
    get lShin() { return boneMap['Shin_L']; },
    get rShin() { return boneMap['Shin_R']; },
    get lFoot() { return boneMap['Foot_L']; },
    get rFoot() { return boneMap['Foot_R']; },
    
    // Update method for animation
    update() {
      mesh.skeleton.calculateInverses();
    },
  };
  
  return wrestlerMesh;
}

// Procedural attire pattern texture: base color + trim graphic per wrestler.
// id picks the motif so each roster member reads differently at a glance.
function makeAttireTexture(def) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  const base = '#' + (def.attire ?? 0x222222).toString(16).padStart(6, '0');
  const trim = '#' + (def.trim ?? 0xffd23f).toString(16).padStart(6, '0');
  x.fillStyle = base; x.fillRect(0, 0, 256, 256);
  x.fillStyle = trim;
  const id = def.id || '';
  if (id === 'veneno' || id === 'thunder') {
    // lightning zigzag
    x.beginPath(); let px = 0;
    x.moveTo(0, 20);
    for (let i = 0; i <= 8; i++) { px = (i * 32); x.lineTo(px + 16, 108); x.lineTo(px + 32, 20); }
    x.lineTo(256, 20); x.lineTo(256, 60); x.lineTo(0, 60); x.closePath(); x.fill();
    x.fillRect(0, 200, 256, 14);
  } else if (id === 'bruno' || id === 'fury') {
    // bold side stripes
    x.fillRect(18, 0, 26, 256); x.fillRect(212, 0, 26, 256);
    x.fillRect(0, 226, 256, 12);
  } else if (id === 'icon') {
    // star + sash
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
    // chevron + waistband (vex + fallback)
    x.beginPath(); x.moveTo(0, 150); x.lineTo(128, 90); x.lineTo(256, 150);
    x.lineTo(256, 178); x.lineTo(128, 118); x.lineTo(0, 178); x.closePath(); x.fill();
    x.fillRect(0, 226, 256, 12);
  }
  // fabric noise
  x.globalAlpha = 0.06; x.fillStyle = '#000';
  for (let i = 0; i < 500; i++) x.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  x.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Animation spine data structure (VPW64 style)
export const ANIMATION_SPINES = {
  // Each spine is a sequence of bone poses (AKI style: 19 bones, world-space poses)
  idle: { frames: 30, loop: true, speed: 1.0 },
  walk: { frames: 24, loop: true, speed: 1.2 },
  run: { frames: 18, loop: true, speed: 1.5 },
  attack_punch: { frames: 14, loop: false, speed: 1.8 },
  attack_kick: { frames: 16, loop: false, speed: 1.6 },
  attack_clothesline: { frames: 18, loop: false, speed: 1.5 },
  grapple_lockup: { frames: 20, loop: true, speed: 0.8 },
  grapple_suplex: { frames: 28, loop: false, speed: 1.0 },
  grapple_powerbomb: { frames: 32, loop: false, speed: 0.9 },
  grapple_piledriver: { frames: 30, loop: false, speed: 0.9 },
  grapple_ddt: { frames: 22, loop: false, speed: 1.2 },
  grapple_hurricanrana: { frames: 24, loop: false, speed: 1.3 },
  ground_stomp: { frames: 12, loop: false, speed: 1.5 },
  ground_elbowdrop: { frames: 16, loop: false, speed: 1.3 },
  ground_splash: { frames: 28, loop: false, speed: 1.0 },
  dive_crossbody: { frames: 20, loop: false, speed: 1.4 },
  dive_450splash: { frames: 30, loop: false, speed: 1.1 },
  submit_sharpshooter: { frames: 40, loop: true, speed: 0.5 },
  submit_figurefour: { frames: 35, loop: true, speed: 0.5 },
  pin: { frames: 60, loop: true, speed: 0.3 },
  getup: { frames: 20, loop: false, speed: 1.0 },
  taunt: { frames: 30, loop: true, speed: 0.7 },
  sell_down: { frames: 45, loop: false, speed: 0.6 },
  sell_bump: { frames: 20, loop: false, speed: 1.0 },
  irish_whip: { frames: 18, loop: false, speed: 1.4 },
  reversal: { frames: 14, loop: false, speed: 2.0 },
  counter: { frames: 10, loop: false, speed: 2.5 },
  finisher: { frames: 40, loop: false, speed: 0.8 },
  knockout: { frames: 60, loop: false, speed: 0.4 },
};

// Animation state machine
export class AnimationController {
  constructor(wrestlerMesh) {
    this.mesh = wrestlerMesh;
    this.currentSpine = null;
    this.currentFrame = 0;
    this.frameTime = 0;
    this.speed = 1.0;
    this.loop = false;
    this.onComplete = null;
    this.blendTime = 0.15; // crossfade time
    this.prevSpine = null;
    this.prevFrame = 0;
    this.blendProgress = 0;
  }
  
  play(spineName, speed = 1.0, loop = false, onComplete = null) {
    const spine = ANIMATION_SPINES[spineName];
    if (!spine) {
      console.warn(`Animation spine not found: ${spineName}`);
      return;
    }
    
    // Crossfade from current animation
    if (this.currentSpine && this.currentSpine !== spineName) {
      this.prevSpine = this.currentSpine;
      this.prevFrame = this.currentFrame;
      this.blendProgress = 0;
    }
    
    this.currentSpine = spineName;
    this.currentFrame = 0;
    this.frameTime = 0;
    this.speed = speed;
    this.loop = loop;
    this.onComplete = onComplete;
  }
  
  update(dt) {
    if (!this.currentSpine) return;
    
    const spine = ANIMATION_SPINES[this.currentSpine];
    const frameDuration = (1 / 30) / this.speed; // 30fps base
    
    this.frameTime += dt;
    
    // Handle crossfade
    if (this.prevSpine) {
      this.blendProgress += dt / this.blendTime;
      if (this.blendProgress >= 1) {
        this.prevSpine = null;
        this.blendProgress = 0;
      }
    }
    
    while (this.frameTime >= frameDuration) {
      this.frameTime -= frameDuration;
      this.currentFrame++;
      
      if (this.currentFrame >= spine.frames) {
        if (this.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = spine.frames - 1;
          if (this.onComplete) {
            this.onComplete();
            this.onComplete = null;
          }
        }
      }
    }
    
    // Apply current pose
    this.applyPose(spine, this.currentFrame);
    
    // Apply crossfade if blending
    if (this.prevSpine) {
      const prevSpine = ANIMATION_SPINES[this.prevSpine];
      this.applyPose(prevSpine, this.prevFrame, 1 - this.blendProgress);
    }
  }
  
  applyPose(spine, frame, weight = 1.0) {
    // In a real implementation, this would interpolate bone poses from spine data
    // For now, we'll use the existing poseFighter system
    // The spine data would contain bone rotations/positions for each frame
  }
}

// Match system (VPW64 style)
export const MATCH_TYPES = {
  singles: { name: 'Singles', participants: 2, eliminations: false },
  tripleThreat: { name: 'Triple Threat', participants: 3, eliminations: false },
  fatal4Way: { name: 'Fatal 4-Way', participants: 4, eliminations: false },
  tagTeam: { name: 'Tag Team', participants: 4, eliminations: false, teams: 2 },
  tornadoTag: { name: 'Tornado Tag', participants: 4, eliminations: false, teams: 2 },
  royalRumble: { name: 'Royal Rumble', participants: 30, eliminations: true, overTopRope: true },
  battleRoyal: { name: 'Battle Royal', participants: 20, eliminations: true, overTopRope: false },
  ladder: { name: 'Ladder Match', participants: 2, eliminations: false, objective: 'retrieve' },
  cage: { name: 'Steel Cage', participants: 2, eliminations: false, escape: true },
  ironMan: { name: 'Iron Man', participants: 2, eliminations: false, timeLimit: 3600 },
  submission: { name: 'Submission Match', participants: 2, eliminations: false, onlySubmissions: true },
};

export class MatchController {
  constructor(type = 'singles', participants = []) {
    this.type = MATCH_TYPES[type] || MATCH_TYPES.singles;
    this.participants = participants;
    this.time = 0;
    this.timeLimit = this.type.timeLimit || 1800; // 30 min default
    this.falls = new Map(); // wrestlerId -> fall count
    this.eliminated = new Set();
    this.legalWrestlers = new Set(participants.map(p => p.id));
    this.currentLegal = participants[0]?.id;
    this.pinCount = null;
    this.refPosition = new THREE.Vector3();
    this.crowdHeat = 50;
    this.events = [];
  }
  
  update(dt, fighters) {
    this.time += dt;
    
    // Update crowd heat
    this.crowdHeat = Math.max(0, Math.min(100, this.crowdHeat - dt * 2));
    
    // Check time limit
    if (this.time >= this.timeLimit) {
      this.endMatch('time_limit');
    }
    
    // Check eliminations (Royal Rumble style)
    if (this.type.eliminations) {
      for (const f of fighters) {
        if (this.eliminated.has(f.id)) continue;
        if (f.eliminated || f.state === 'eliminated') {
          this.eliminate(f);
        }
      }
    }
    
    // Update legal wrestler (tag team)
    if (this.type.teams) {
      this.updateTagRules(fighters);
    }
  }
  
  eliminate(fighter) {
    this.eliminated.add(fighter.id);
    this.events.push({ type: 'elimination', wrestler: fighter.id, time: this.time });
    fighter.eliminated = true;
    
    if (this.remainingParticipants().length <= 1) {
      this.endMatch('elimination');
    }
  }
  
  remainingParticipants() {
    return this.participants.filter(p => !this.eliminated.has(p.id));
  }
  
  endMatch(reason) {
    this.events.push({ type: 'match_end', reason, winner: this.getWinner(), time: this.time });
  }
  
  getWinner() {
    const remaining = this.remainingParticipants();
    if (remaining.length === 1) return remaining[0].id;
    
    // Most falls wins
    let winner = null;
    let maxFalls = -1;
    for (const [id, falls] of this.falls) {
      if (falls > maxFalls) {
        maxFalls = falls;
        winner = id;
      }
    }
    return winner;
  }
  
  recordFall(attackerId, defenderId) {
    this.falls.set(attackerId, (this.falls.get(attackerId) || 0) + 1);
    this.events.push({ type: 'fall', attacker: attackerId, defender: defenderId, time: this.time });
    
    // Check for match end (3 falls default)
    if (this.falls.get(attackerId) >= 3) {
      this.endMatch('pinfall');
    }
  }
  
  updateTagRules(fighters) {
    // Tag team logic: only one legal man per team
    // Simplified for now
  }
  
  startPin(attacker, defender) {
    this.pinCount = { attacker, defender, count: 0, startTime: this.time };
    this.events.push({ type: 'pin_start', attacker, defender, time: this.time });
  }
  
  updatePin(dt) {
    if (!this.pinCount) return null;
    
    const pinDuration = this.time - this.pinCount.startTime;
    
    if (pinDuration > 1.0 && this.pinCount.count === 0) {
      this.pinCount.count = 1;
      this.events.push({ type: 'pin_count', count: 1, time: this.time });
    }
    if (pinDuration > 2.5 && this.pinCount.count === 1) {
      this.pinCount.count = 2;
      this.events.push({ type: 'pin_count', count: 2, time: this.time });
    }
    if (pinDuration > 4.0 && this.pinCount.count === 2) {
      this.pinCount.count = 3;
      this.events.push({ type: 'pin_count', count: 3, time: this.time });
      this.recordFall(this.pinCount.attacker, this.pinCount.defender);
      this.pinCount = null;
      return 'success';
    }
    
    // Kickout chance
    if (pinDuration > 1.5 && Math.random() < 0.02 * dt) {
      this.pinCount = null;
      return 'kickout';
    }
    
    return 'continue';
  }
  
  breakPin() {
    this.pinCount = null;
  }
}

export default {
  createBaseHumanGeometry,
  createWrestlerSkinnedMesh,
  ANIMATION_SPINES,
  AnimationController,
  MATCH_TYPES,
  MatchController,
};