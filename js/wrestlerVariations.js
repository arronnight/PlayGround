// Wrestler Variation System - Morph targets for body types
// Applies body archetype morphs to base skinned mesh

import * as THREE from 'three';

export const BODY_ARCHETYPES = {
  powerhouse: {
    name: 'Powerhouse',
    height: 1.02,
    bulk: 1.15,
    muscleDefinition: 0.85,
    bodyFat: 0.15,
    shoulderWidth: 1.25,
    waistWidth: 1.15,
    armDefinition: 0.9,
    legDefinition: 0.8,
    neckThickness: 1.3,
    trapSize: 1.4,
  },
  technician: {
    name: 'Technician',
    height: 1.0,
    bulk: 1.0,
    muscleDefinition: 0.75,
    bodyFat: 0.18,
    shoulderWidth: 1.1,
    waistWidth: 1.0,
    armDefinition: 0.7,
    legDefinition: 0.75,
    neckThickness: 1.0,
    trapSize: 1.0,
  },
  highflyer: {
    name: 'High Flyer',
    height: 0.97,
    bulk: 0.88,
    muscleDefinition: 0.7,
    bodyFat: 0.12,
    shoulderWidth: 0.95,
    waistWidth: 0.9,
    armDefinition: 0.65,
    legDefinition: 0.85,
    neckThickness: 0.9,
    trapSize: 0.85,
  },
  brawler: {
    name: 'Brawler',
    height: 1.01,
    bulk: 1.1,
    muscleDefinition: 0.7,
    bodyFat: 0.22,
    shoulderWidth: 1.15,
    waistWidth: 1.2,
    armDefinition: 0.8,
    legDefinition: 0.9,
    neckThickness: 1.1,
    trapSize: 1.1,
  },
  giant: {
    name: 'Giant',
    height: 1.15,
    bulk: 1.4,
    muscleDefinition: 0.55,
    bodyFat: 0.28,
    shoulderWidth: 1.5,
    waistWidth: 1.45,
    armDefinition: 0.6,
    legDefinition: 0.65,
    neckThickness: 1.5,
    trapSize: 1.6,
  },
  balanced: {
    name: 'Balanced',
    height: 1.0,
    bulk: 1.0,
    muscleDefinition: 0.7,
    bodyFat: 0.2,
    shoulderWidth: 1.0,
    waistWidth: 1.0,
    armDefinition: 0.7,
    legDefinition: 0.7,
    neckThickness: 1.0,
    trapSize: 1.0,
  },
};

// Morph target definitions for the base mesh
export const MORPH_TARGETS = {
  // Height morphs
  height_tall: { name: 'height_tall', scale: 1.15, bones: ['Spine1', 'Spine2', 'Spine3', 'Neck', 'Thigh_L', 'Thigh_R', 'Shin_L', 'Shin_R'] },
  height_short: { name: 'height_short', scale: 0.9, bones: ['Spine1', 'Spine2', 'Spine3', 'Neck', 'Thigh_L', 'Thigh_R', 'Shin_L', 'Shin_R'] },

  // Bulk morphs
  bulk_heavy: { name: 'bulk_heavy', scale: 1.25, bones: ['Pelvis', 'Spine1', 'Spine2', 'Spine3', 'Clavicle_L', 'Clavicle_R', 'UpperArm_L', 'UpperArm_R', 'Thigh_L', 'Thigh_R'] },
  bulk_light: { name: 'bulk_light', scale: 0.85, bones: ['Pelvis', 'Spine1', 'Spine2', 'Spine3', 'Clavicle_L', 'Clavicle_R', 'UpperArm_L', 'UpperArm_R', 'Thigh_L', 'Thigh_R'] },

  // Muscle definition
  muscle_defined: { name: 'muscle_defined', scale: 1.3, bones: ['UpperArm_L', 'UpperArm_R', 'Forearm_L', 'Forearm_R', 'Thigh_L', 'Thigh_R', 'Shin_L', 'Shin_R', 'Spine3'] },
  muscle_smooth: { name: 'muscle_smooth', scale: 0.7, bones: ['UpperArm_L', 'UpperArm_R', 'Forearm_L', 'Forearm_R', 'Thigh_L', 'Thigh_R', 'Shin_L', 'Shin_R', 'Spine3'] },

  // Shoulder width
  shoulders_wide: { name: 'shoulders_wide', scale: 1.4, bones: ['Clavicle_L', 'Clavicle_R'] },
  shoulders_narrow: { name: 'shoulders_narrow', scale: 0.85, bones: ['Clavicle_L', 'Clavicle_R'] },

  // Waist width
  waist_wide: { name: 'waist_wide', scale: 1.3, bones: ['Pelvis', 'Spine1', 'Spine2'] },
  waist_narrow: { name: 'waist_narrow', scale: 0.8, bones: ['Pelvis', 'Spine1', 'Spine2'] },

  // Arm definition
  arms_defined: { name: 'arms_defined', scale: 1.25, bones: ['UpperArm_L', 'UpperArm_R', 'Forearm_L', 'Forearm_R'] },
  arms_slim: { name: 'arms_slim', scale: 0.8, bones: ['UpperArm_L', 'UpperArm_R', 'Forearm_L', 'Forearm_R'] },

  // Leg definition
  legs_defined: { name: 'legs_defined', scale: 1.2, bones: ['Thigh_L', 'Thigh_R', 'Shin_L', 'Shin_R'] },
  legs_slim: { name: 'legs_slim', scale: 0.8, bones: ['Thigh_L', 'Thigh_R', 'Shin_L', 'Shin_R'] },

  // Neck and traps
  neck_thick: { name: 'neck_thick', scale: 1.5, bones: ['Neck', 'Spine3'] },
  traps_large: { name: 'traps_large', scale: 1.6, bones: ['Spine3', 'Neck'] },
  neck_thin: { name: 'neck_thin', scale: 0.8, bones: ['Neck'] },
  traps_small: { name: 'traps_small', scale: 0.7, bones: ['Spine3', 'Neck'] },
};

// Archetype to morph mapping
export const ARCHETYPE_MORPHS = {
  powerhouse: [
    { target: 'bulk_heavy', weight: 1.0 },
    { target: 'muscle_defined', weight: 0.85 },
    { target: 'shoulders_wide', weight: 1.0 },
    { target: 'waist_wide', weight: 0.5 },
    { target: 'arms_defined', weight: 0.9 },
    { target: 'traps_large', weight: 1.0 },
  ],
  technician: [
    { target: 'muscle_defined', weight: 0.5 },
    { target: 'shoulders_wide', weight: 0.3 },
    { target: 'waist_narrow', weight: 0.3 },
  ],
  highflyer: [
    { target: 'height_tall', weight: 0.3 },
    { target: 'bulk_light', weight: 0.6 },
    { target: 'muscle_defined', weight: 0.4 },
    { target: 'shoulders_narrow', weight: 0.5 },
    { target: 'waist_narrow', weight: 0.7 },
    { target: 'legs_defined', weight: 0.85 },
  ],
  brawler: [
    { target: 'bulk_heavy', weight: 0.6 },
    { target: 'shoulders_wide', weight: 0.7 },
    { target: 'waist_wide', weight: 0.8 },
    { target: 'arms_defined', weight: 0.8 },
    { target: 'traps_large', weight: 0.6 },
  ],
  giant: [
    { target: 'height_tall', weight: 1.0 },
    { target: 'bulk_heavy', weight: 1.0 },
    { target: 'shoulders_wide', weight: 1.0 },
    { target: 'waist_wide', weight: 1.0 },
    { target: 'traps_large', weight: 1.0 },
    { target: 'neck_thick', weight: 1.0 },
  ],
  balanced: [],
};

// Apply archetype morphs to a skinned mesh
export function applyArchetypeMorphs(mesh, archetypeName) {
  if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) {
    console.warn('Mesh has no morph targets');
    return;
  }

  const morphs = ARCHETYPE_MORPHS[archetypeName] || [];
  const dict = mesh.morphTargetDictionary;
  const influences = mesh.morphTargetInfluences;

  // Reset all morphs
  for (let i = 0; i < influences.length; i++) {
    influences[i] = 0;
  }

  // Apply archetype morphs
  for (const { target, weight } of morphs) {
    if (dict[target] !== undefined) {
      influences[dict[target]] = weight;
    }
  }

  mesh.morphTargetInfluences = influences;
}

// Create morph targets on a base geometry
export function createMorphTargets(baseGeometry) {
  const position = baseGeometry.getAttribute('position');
  const count = position.count;
  const morphAttributes = {};

  // For each morph target, compute vertex offsets
  for (const [key, morph] of Object.entries(MORPH_TARGETS)) {
    const offsets = new Float32Array(count * 3);
    const vertex = new THREE.Vector3();
    const morphVec = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      vertex.fromBufferAttribute(position, i);
      
      // Check if this vertex belongs to affected bones
      // (simplified - in production would use skinIndex weights)
      const affected = morph.bones.length > 0; // placeholder
      
      if (affected) {
        // Apply scaling along bone-local axes
        morphVec.copy(vertex).multiplyScalar(morph.scale - 1.0);
        offsets[i * 3] = morphVec.x;
        offsets[i * 3 + 1] = morphVec.y;
        offsets[i * 3 + 2] = morphVec.z;
      }
    }

    morphAttributes[key] = new THREE.BufferAttribute(offsets, 3);
  }

  // Add morph attributes to geometry
  for (const [key, attr] of Object.entries(morphAttributes)) {
    baseGeometry.morphAttributes.position.push(attr);
  }

  return baseGeometry;
}

// Procedural morph generation from archetype parameters
export function generateMorphFromArchetype(geometry, skeleton, archetype) {
  const morphs = ARCHETYPE_MORPHS[archetype] || [];
  const position = geometry.getAttribute('position');
  const skinIndex = geometry.getAttribute('skinIndex');
  const skinWeight = geometry.getAttribute('skinWeight');
  const count = position.count;

  const morphData = {};

  for (const { target, weight } of morphs) {
    if (!MORPH_TARGETS[target]) continue;
    
    const morph = MORPH_TARGETS[target];
    const offsets = new Float32Array(count * 3);
    const vertex = new THREE.Vector3();
    const offset = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      vertex.fromBufferAttribute(position, i);
      
      // Get bone influences for this vertex
      let maxInfluence = 0;
      let primaryBone = -1;
      
      for (let w = 0; w < 4; w++) {
        const wgt = skinWeight.getComponent(i, w);
        if (wgt > maxInfluence) {
          maxInfluence = wgt;
          primaryBone = skinIndex.getComponent(i, w);
        }
      }

      if (primaryBone >= 0) {
        const boneName = skeleton.bones[primaryBone]?.name;
        if (morph.bones.includes(boneName)) {
          // Apply morph in bone-local space
          const bone = skeleton.bones[primaryBone];
          const invMatrix = new THREE.Matrix4().copy(bone.matrixWorld).invert();
          const localPos = vertex.clone().applyMatrix4(invMatrix);
          const scaled = localPos.clone().multiplyScalar(morph.scale - 1.0);
          const worldOffset = scaled.applyMatrix4(bone.matrixWorld);
          
          offset.copy(worldOffset).multiplyScalar(weight * maxInfluence);
          offsets[i * 3] = offset.x;
          offsets[i * 3 + 1] = offset.y;
          offsets[i * 3 + 2] = offset.z;
        }
      }
    }

    morphData[target] = new THREE.BufferAttribute(offsets, 3);
  }

  // Add to geometry
  for (const [key, attr] of Object.entries(morphData)) {
    geometry.morphAttributes.position.push(attr);
  }

  return geometry;
}

export default {
  BODY_ARCHETYPES,
  MORPH_TARGETS,
  ARCHETYPE_MORPHS,
  applyArchetypeMorphs,
  createMorphTargets,
  generateMorphFromArchetype,
};