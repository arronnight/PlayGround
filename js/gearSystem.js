// Procedural Gear System - Gear meshes that skin to wrestler body bones

import * as THREE from 'three';

export const GEAR_TYPES = {
  trunks: { name: 'trunks', bones: ['Pelvis', 'Thigh_L', 'Thigh_R'], slot: 'lower_body' },
  tights: { name: 'tights', bones: ['Pelvis', 'Thigh_L', 'Thigh_R', 'Shin_L', 'Shin_R'], slot: 'lower_body' },
  shorts: { name: 'shorts', bones: ['Pelvis', 'Thigh_L', 'Thigh_R'], slot: 'lower_body' },
  boots: { name: 'boots', bones: ['Foot_L', 'Foot_R', 'Shin_L', 'Shin_R'], slot: 'feet' },
  kneePads: { name: 'kneePads', bones: ['Shin_L', 'Shin_R'], slot: 'knees' },
  elbowPads: { name: 'elbowPads', bones: ['Forearm_L', 'Forearm_R'], slot: 'elbows' },
  wristTape: { name: 'wristTape', bones: ['Hand_L', 'Hand_R', 'Forearm_L', 'Forearm_R'], slot: 'wrists' },
  singlet: { name: 'singlet', bones: ['Pelvis', 'Spine1', 'Spine2', 'Spine3', 'Thigh_L', 'Thigh_R'], slot: 'torso' },
  vest: { name: 'vest', bones: ['Spine1', 'Spine2', 'Spine3', 'Clavicle_L', 'Clavicle_R'], slot: 'torso' },
  jacket: { name: 'jacket', bones: ['Spine1', 'Spine2', 'Spine3', 'Clavicle_L', 'Clavicle_R', 'UpperArm_L', 'UpperArm_R'], slot: 'torso' },
  mask: { name: 'mask', bones: ['Head', 'Neck'], slot: 'head' },
  facePaint: { name: 'facePaint', bones: ['Head'], slot: 'head' },
  cape: { name: 'cape', bones: ['Spine3', 'Clavicle_L', 'Clavicle_R', 'Spine2'], slot: 'back' },
  towel: { name: 'towel', bones: ['Spine3', 'Neck'], slot: 'neck' },
  wristband: { name: 'wristband', bones: ['Forearm_L', 'Forearm_R'], slot: 'wrists' },
  armband: { name: 'armband', bones: ['UpperArm_L', 'UpperArm_R'], slot: 'arms' },
};

// Gear material presets
export const GEAR_MATERIALS = {
  leather: { color: 0x1a1a1a, roughness: 0.4, metalness: 0.1 },
  spandex: { color: 0x101010, roughness: 0.3, metalness: 0.05 },
  latex: { color: 0x080808, roughness: 0.1, metalness: 0.3 },
  velvet: { color: 0x2a0a2a, roughness: 0.7, metalness: 0.0 },
  denim: { color: 0x1a2a4a, roughness: 0.8, metalness: 0.0 },
  canvas: { color: 0x3a3a3a, roughness: 0.9, metalness: 0.0 },
  mesh: { color: 0x1a1a1a, roughness: 0.6, metalness: 0.05, transparent: true, opacity: 0.7 },
  rubber: { color: 0x0a0a0a, roughness: 0.2, metalness: 0.4 },
  foam: { color: 0x2a2a2a, roughness: 0.9, metalness: 0.0 },
  tape: { color: 0xffffff, roughness: 0.6, metalness: 0.0 },
  cotton: { color: 0x2a2a2a, roughness: 0.85, metalness: 0.0 },
};

// Procedural gear geometry generators
export function createGearGeometry(gearType, skeleton, wrestlerDef) {
  const B = wrestlerDef.bulk || 1.0;
  const H = wrestlerDef.height || 1.0;
  const gear = GEAR_TYPES[gearType];
  
  if (!gear) return null;

  switch (gearType) {
    case 'trunks':
      return createTrunks(skeleton, B, H);
    case 'tights':
      return createTights(skeleton, B, H);
    case 'shorts':
      return createShorts(skeleton, B, H);
    case 'boots':
      return createBoots(skeleton, B, H, wrestlerDef.bootsH || 'short');
    case 'kneePads':
      return createKneePads(skeleton, B, H);
    case 'elbowPads':
      return createElbowPads(skeleton, B, H);
    case 'wristTape':
      return createWristTape(skeleton, B, H);
    case 'singlet':
      return createSinglet(skeleton, B, H);
    case 'vest':
      return createVest(skeleton, B, H);
    case 'mask':
      return createMask(skeleton, B, H);
    case 'cape':
      return createCape(skeleton, B, H);
    default:
      return createGenericGear(gear, skeleton, B, H);
  }
}

function createTrunks(skeleton, B, H) {
  // Trunks: belt area + upper thigh coverage
  const geometry = new THREE.CylinderGeometry(
    0.18 * B, 0.16 * B, 0.22 * H, 16, 4, true // open-ended
  );
  geometry.translate(0, 1.0 * H, 0);
  geometry.scale(1.05, 1.0, 1.0);
  
  // Add waistband
  const waistband = new THREE.TorusGeometry(0.185 * B, 0.015 * H, 8, 32);
  const waistMesh = new THREE.Mesh(waistband);
  waistMesh.position.set(0, 1.12 * H, 0);
  waistMesh.rotation.x = Math.PI / 2;
  
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geometry));
  group.add(waistMesh);
  return group;
}

function createTights(skeleton, B, H) {
  // Full leg coverage
  const geometry = new THREE.CylinderGeometry(
    0.11 * B, 0.065 * B, 0.85 * H, 12, 8, true
  );
  geometry.translate(0, 0.55 * H, 0);
  return new THREE.Mesh(geometry);
}

function createShorts(skeleton, B, H) {
  const geometry = new THREE.CylinderGeometry(
    0.17 * B, 0.15 * B, 0.18 * H, 14, 3, true
  );
  geometry.translate(0, 0.95 * H, 0);
  return new THREE.Mesh(geometry);
}

function createBoots(skeleton, B, H, bootHeight) {
  const group = new THREE.Group();
  const tall = bootHeight === 'tall';
  const shaftH = tall ? 0.28 * H : 0.10 * H;
  
  for (const side of [-1, 1]) {
    const boot = new THREE.Group();
    
    // Shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065 * B, 0.058 * B, shaftH, 12),
      null
    );
    shaft.position.set(side * 0.07 * B, shaftH / 2 + 0.05 * H, 0);
    boot.add(shaft);
    
    // Foot
    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.1 * B, 0.07 * H, 0.22 * H),
      null
    );
    foot.position.set(side * 0.07 * B, 0.035 * H, 0.04 * H);
    boot.add(foot);
    
    // Sole
    const sole = new THREE.Mesh(
      new THREE.BoxGeometry(0.11 * B, 0.015 * H, 0.23 * H),
      null
    );
    sole.position.set(side * 0.07 * B, 0.007 * H, 0.045 * H);
    boot.add(sole);
    
    group.add(boot);
  }
  return group;
}

function createKneePads(skeleton, B, H) {
  const group = new THREE.Group();
  
  for (const side of [-1, 1]) {
    const pad = new THREE.Mesh(
      new THREE.TorusGeometry(0.08 * B, 0.035 * H, 8, 16),
      null
    );
    pad.position.set(side * 0.1 * B, 0.52 * H, 0);
    pad.rotation.x = Math.PI / 2;
    group.add(pad);
  }
  return group;
}

function createElbowPads(skeleton, B, H) {
  const group = new THREE.Group();
  
  for (const side of [-1, 1]) {
    const pad = new THREE.Mesh(
      new THREE.TorusGeometry(0.07 * B, 0.025 * H, 8, 16),
      null
    );
    pad.position.set(side * 0.22 * B, 1.15 * H, 0);
    pad.rotation.x = Math.PI / 2;
    group.add(pad);
  }
  return group;
}

function createWristTape(skeleton, B, H) {
  const group = new THREE.Group();
  
  for (const side of [-1, 1]) {
    const tape = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06 * B, 0.06 * B, 0.08 * H, 12),
      null
    );
    tape.position.set(side * 0.2 * B, 0.88 * H, 0);
    group.add(tape);
  }
  return group;
}

function createSinglet(skeleton, B, H) {
  const geometry = new THREE.CapsuleGeometry(0.185 * B, 0.65 * H, 6, 12);
  geometry.translate(0, 1.3 * H, 0);
  return new THREE.Mesh(geometry);
}

function createVest(skeleton, B, H) {
  const geometry = new THREE.CapsuleGeometry(0.2 * B, 0.45 * H, 6, 12);
  geometry.translate(0, 1.4 * H, 0);
  geometry.scale(1.1, 1.0, 0.6);
  return new THREE.Mesh(geometry);
}

function createMask(skeleton, B, H) {
  const group = new THREE.Group();
  
  // Main mask
  const mask = new THREE.Mesh(
    new THREE.SphereGeometry(0.13 * H, 16, 14, 0, Math.PI * 2, 0, Math.PI / 1.8),
    null
  );
  mask.position.set(0, 1.95 * H, 0);
  group.add(mask);
  
  // Eye cutouts (handled by material alpha)
  return group;
}

function createCape(skeleton, B, H) {
  const geometry = new THREE.PlaneGeometry(0.6 * B, 0.7 * H, 8, 12);
  geometry.translate(0, 1.5 * H, -0.25 * B);
  geometry.rotateX(-0.2);
  return new THREE.Mesh(geometry);
}

function createGenericGear(gear, skeleton, B, H) {
  return new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1));
}

// Create skinned gear mesh that binds to skeleton
export function createSkinnedGear(gearType, skeleton, wrestlerDef, materialName = 'spandex') {
  const group = createGearGeometry(gearType, skeleton, wrestlerDef);
  if (!group) return null;

  // Traverse and convert to skinned meshes
  const gearMeshes = [];
  group.traverse((child) => {
    if (child.isMesh) {
      const skinnedMesh = new THREE.SkinnedMesh(
        child.geometry,
        new THREE.MeshStandardMaterial({
          ...GEAR_MATERIALS[materialName] || GEAR_MATERIALS.spandex,
          skinning: true,
        })
      );
      skinnedMesh.geometry = child.geometry;
      gearMeshes.push(skinnedMesh);
    }
  });

  // Bind to skeleton (simplified - would need proper skinIndex/skinWeight)
  return { group, meshes: gearMeshes };
}

// Create gear for a wrestler definition
export function createWrestlerGear(wrestlerDef, skeleton, materials = {}) {
  const gear = {};
  
  // Determine gear from wrestler def
  const gearList = [];
  
  if (wrestlerDef.legs === 'tights') gearList.push('tights');
  else if (wrestlerDef.legs === 'shorts') gearList.push('shorts');
  else gearList.push('trunks');
  
  if (wrestlerDef.bootsH === 'tall') gearList.push('boots');
  else gearList.push('boots');
  
  if (wrestlerDef.kneePads) gearList.push('kneePads');
  if (wrestlerDef.wrist) gearList.push('wristTape');
  if (wrestlerDef.elbowPad) gearList.push('elbowPads');
  if (wrestlerDef.torso === 'singlet') gearList.push('singlet');
  if (wrestlerDef.hairStyle === 'mask') gearList.push('mask');
  
  for (const gearType of gearList) {
    const material = materials[gearType] || 'spandex';
    gear[gearType] = createSkinnedGear(gearType, skeleton, wrestlerDef, material);
  }
  
  return gear;
}

// Update gear materials (for color changes)
export function updateGearColors(gear, colors) {
  for (const [type, gearObj] of Object.entries(gear)) {
    if (gearObj && gearObj.meshes) {
      for (const mesh of gearObj.meshes) {
        if (mesh.material) {
          if (colors.primary) mesh.material.color.setHex(colors.primary);
          if (colors.secondary) mesh.material.emissive.setHex(colors.secondary);
          if (colors.trim) {
            // Apply to trim parts
          }
        }
      }
    }
  }
}

export default {
  GEAR_TYPES,
  GEAR_MATERIALS,
  createGearGeometry,
  createSkinnedGear,
  createWrestlerGear,
  updateGearColors,
};