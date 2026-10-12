// Procedural Skinning Weights Generator
// English bone API matching the engine (rig.js / poseFighter).
// Structure informed by PS2 YOBJ research: 6-part split, toe joints
// (tsumasaki), finger-ready hands, muscle-zone weight boosts.
import * as THREE from 'three';

export const BONE_NAMES = [
  'Root',
  'Pelvis',
  'Spine1', 'Spine2', 'Spine3', 'Neck', 'Head',
  'Clavicle_L', 'UpperArm_L', 'Forearm_L', 'Hand_L',
  'Clavicle_R', 'UpperArm_R', 'Forearm_R', 'Hand_R',
  'Thigh_L', 'Shin_L', 'Foot_L', 'Toe_L',
  'Thigh_R', 'Shin_R', 'Foot_R', 'Toe_R',
];

export const BONE_INDICES = Object.fromEntries(BONE_NAMES.map((n, i) => [n, i]));

export const BONE_HIERARCHY = {
  Root: ['Pelvis'],
  Pelvis: ['Spine1', 'Thigh_L', 'Thigh_R'],
  Spine1: ['Spine2'],
  Spine2: ['Spine3'],
  Spine3: ['Neck', 'Clavicle_L', 'Clavicle_R'],
  Neck: ['Head'],
  Clavicle_L: ['UpperArm_L'],
  UpperArm_L: ['Forearm_L'],
  Forearm_L: ['Hand_L'],
  Clavicle_R: ['UpperArm_R'],
  UpperArm_R: ['Forearm_R'],
  Forearm_R: ['Hand_R'],
  Thigh_L: ['Shin_L'],
  Shin_L: ['Foot_L'],
  Foot_L: ['Toe_L'],
  Thigh_R: ['Shin_R'],
  Shin_R: ['Foot_R'],
  Foot_R: ['Toe_R'],
};

export const BONE_NAMES_REVERSE = Object.fromEntries(
  BONE_NAMES.map((name, idx) => [idx, name])
);

// Muscle belly zones (LOCAL offsets from the bone origin) used to boost
// the primary weight so bellies follow their bone instead of smearing.
export const MUSCLE_ZONES = [
  { bone: 'UpperArm_L', offset: [0, -0.10, 0.03], radius: 0.10, boost: 0.10 },
  { bone: 'UpperArm_R', offset: [0, -0.10, 0.03], radius: 0.10, boost: 0.10 },
  { bone: 'Forearm_L', offset: [0, -0.08, 0], radius: 0.075, boost: 0.08 },
  { bone: 'Forearm_R', offset: [0, -0.08, 0], radius: 0.075, boost: 0.08 },
  { bone: 'Thigh_L', offset: [0, -0.16, 0.03], radius: 0.13, boost: 0.10 },
  { bone: 'Thigh_R', offset: [0, -0.16, 0.03], radius: 0.13, boost: 0.10 },
  { bone: 'Shin_L', offset: [0, -0.12, -0.03], radius: 0.085, boost: 0.08 },
  { bone: 'Shin_R', offset: [0, -0.12, -0.03], radius: 0.085, boost: 0.08 },
  { bone: 'Spine3', offset: [-0.09, 0.10, 0.10], radius: 0.11, boost: 0.08 },
  { bone: 'Spine3', offset: [0.09, 0.10, 0.10], radius: 0.11, boost: 0.08 },
];

// Local offsets (relative to parent bone). Matches legacy rig proportions.
export function generateBonePositions(def) {
  const H = def.height || 1.0;
  const B = def.bulk || 1.0;
  const sx = 0.225 * B + 0.015;   // shoulder x
  const hx = 0.105 * B;           // hip x
  return {
    Root: [0, 0, 0],
    Pelvis: [0, 0.97 * H, 0],
    Spine1: [0, 0.10 * H, 0],
    Spine2: [0, 0.15 * H, 0],
    Spine3: [0, 0.15 * H, 0],
    Neck: [0, 0.335 * H, 0],
    Head: [0, 0.13 * H, 0],
    Clavicle_L: [-0.09 * B, 0.25 * H, 0],
    UpperArm_L: [-(sx - 0.09 * B), 0.02 * H, 0],
    Forearm_L: [0, -0.30 * H, 0],
    Hand_L: [0, -0.29 * H, 0],
    Clavicle_R: [0.09 * B, 0.25 * H, 0],
    UpperArm_R: [sx - 0.09 * B, 0.02 * H, 0],
    Forearm_R: [0, -0.30 * H, 0],
    Hand_R: [0, -0.29 * H, 0],
    Thigh_L: [-hx, -0.02, 0],
    Shin_L: [0, -0.47 * H, 0],
    Foot_L: [0, -0.47 * H, 0],
    Toe_L: [0, -0.02, 0.09 * H],
    Thigh_R: [hx, -0.02, 0],
    Shin_R: [0, -0.47 * H, 0],
    Foot_R: [0, -0.47 * H, 0],
    Toe_R: [0, -0.02, 0.09 * H],
  };
}

export function buildSkeleton(positions) {
  const boneMap = {};
  const bones = [];
  const mk = (name, parent) => {
    const b = new THREE.Bone();
    b.name = name;
    const p = positions[name] || [0, 0, 0];
    b.position.set(p[0], p[1], p[2]);
    if (parent) parent.add(b);
    boneMap[name] = b;
    bones.push(b);
    return b;
  };
  const walk = (name, parent) => {
    const b = mk(name, parent);
    for (const child of BONE_HIERARCHY[name] || []) walk(child, b);
  };
  walk('Root', null);
  // Root has no transform of its own; engine moves group, not bones.
  return { bones, boneMap };
}

export function createSkinnedMesh(geometry, skeleton, material) {
  const mesh = new THREE.SkinnedMesh(geometry, material);
  mesh.add(skeleton.bones[0]); // root under mesh
  mesh.updateMatrixWorld(true); // fresh world matrices before binding
  mesh.bind(skeleton);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  return mesh;
}

// Refine the merged-geometry weights: keep the 85/15 structure written at
// merge time, but pull vertices inside a muscle belly harder toward that bone
// so flexing reads instead of smearing across the joint.
export function computeSkinningWeights(geometry, skeleton) {
  const pos = geometry.getAttribute('position');
  const idx = geometry.getAttribute('skinIndex');
  const wgt = geometry.getAttribute('skinWeight');
  if (!pos || !idx || !wgt) return;
  const boneMap = {};
  for (const b of skeleton.bones) boneMap[b.name] = b;
  skeleton.bones[0].updateMatrixWorld(true);
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  const m = new THREE.Matrix4();
  for (const zone of MUSCLE_ZONES) {
    const bone = boneMap[zone.bone];
    if (!bone) continue;
    m.copy(bone.matrixWorld);
    c.set(zone.offset[0], zone.offset[1], zone.offset[2]).applyMatrix4(m);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      // geometry is in mesh-bind space; bones are at bind too, so direct compare works
      const d = v.distanceTo(c);
      if (d < zone.radius) {
        const t = 1 - d / zone.radius;
        const w0 = wgt.getX(i);
        const add = Math.min(0.95 - w0, zone.boost * t);
        wgt.setX(i, w0 + add);
        // take it from the secondary weight
        wgt.setY(i, Math.max(0, wgt.getY(i) - add));
      }
    }
  }
  wgt.needsUpdate = true;
}

export default {
  BONE_NAMES,
  BONE_INDICES,
  BONE_HIERARCHY,
  MUSCLE_ZONES,
  BONE_NAMES_REVERSE,
  generateBonePositions,
  buildSkeleton,
  createSkinnedMesh,
  computeSkinningWeights,
};
