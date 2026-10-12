// Skinned Mesh Wrestler Rig — replaces primitive hierarchy with single SkinnedMesh
// Maintains backward compatibility: returns same pivot keys for poseFighter
// Skinned Mesh Wrestler Rig — single merged SkinnedMesh body + rigid detail
// meshes (face, hair, boots, pads) parented to bones. Same pivot keys for poseFighter.
import * as THREE from 'three';
import { createWrestlerSkinnedMesh } from './skinnedMesh.js';

function rmat(color, rough = 0.5, metal = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}
// bone-local placement: absolute bind-space coords minus the bone's bind world pos
function bloc(parts, boneName, ax, ay, az) {
  const w = new THREE.Vector3();
  parts[boneName].getWorldPosition(w);
  return [ax - w.x, ay - w.y, az - w.z];
}
function rigid(parent, geo, material, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  m.castShadow = true; parent.add(m); return m;
}
function rball(r, sx = 1, sy = 1, sz = 1, w = 12, h = 10) {
  const g = new THREE.SphereGeometry(r, w, h);
  g.scale(sx, sy, sz);
  return g;
}

// Rigid details parented to bones: face, hair, boots, pads, trim.
// Returns extra materials (for hit-flash).
function buildDetails(parts, bones, def, H, B) {
  const mats = [];
  const M = (c, r, m) => { const mt = rmat(c, r, m); mats.push(mt); return mt; };
  const hairM = M(def.hair ?? 0x201510, 0.85, 0);
  const trimM = M(def.trim ?? 0xffd23f, 0.45, 0.25);
  const bootM = M(def.boots ?? 0x111111, 0.42, 0.15);
  const darkM = M(0x14141a, 0.6, 0.05);
  const eyeWhiteM = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.25 });
  const irisM = new THREE.MeshStandardMaterial({ color: 0x101014, roughness: 0.3 });
  const mouthM = M(0x3a1a16, 0.7, 0);
  const head = bones.head, Hh = H;

  const masked = def.hairStyle === 'mask';
  if (masked) {
    // luchador mask shell + eye patches + mouth opening
    const attM = M(def.attire ?? 0x0fae5d, 0.55, 0.05);
    let p = bloc(parts, 'head', 0, 1.935 * Hh, 0);
    rigid(head, new THREE.SphereGeometry(0.13 * Hh, 16, 14), attM, ...p);
    for (const s of [-1, 1]) {
      p = bloc(parts, 'head', s * 0.05 * Hh, 1.95 * Hh, 0.108 * Hh);
      const e = rigid(head, rball(0.032, 1, 1, 0.4, 8, 8), eyeWhiteM, ...p);
      e.castShadow = false;
      p = bloc(parts, 'head', s * 0.05 * Hh, 1.95 * Hh, 0.12 * Hh);
      const pu = rigid(head, rball(0.014, 1, 1, 0.4, 6, 6), irisM, ...p);
      pu.castShadow = false;
    }
    p = bloc(parts, 'head', 0, 1.88 * Hh, 0.112 * Hh);
    rigid(head, rball(0.03, 1.2, 0.7, 0.4, 8, 8), mouthM, ...p);
  } else {
    for (const s of [-1, 1]) {
      let p = bloc(parts, 'head', s * 0.048 * Hh, 1.95 * Hh, 0.104 * Hh);
      const e = rigid(head, rball(0.017, 1, 1, 0.6, 8, 8), eyeWhiteM, ...p);
      e.castShadow = false;
      p = bloc(parts, 'head', s * 0.048 * Hh, 1.95 * Hh, 0.117 * Hh);
      const ir = rigid(head, rball(0.009, 1, 1, 0.6, 8, 8), irisM, ...p);
      ir.castShadow = false;
    }
    let p = bloc(parts, 'head', 0, 1.883 * Hh, 0.108 * Hh);
    rigid(head, new THREE.BoxGeometry(0.055 * Hh, 0.009 * Hh, 0.012 * Hh), mouthM, ...p);
    // hair
    const hs = def.hairStyle || 'short';
    if (hs === 'short' || hs === 'long') {
      p = bloc(parts, 'head', 0, 1.953 * Hh, -0.014 * Hh);
      rigid(head, new THREE.SphereGeometry(0.132 * Hh, 14, 10, 0, Math.PI * 2, 0, 1.55), hairM, ...p);
      if (hs === 'long') {
        p = bloc(parts, 'head', 0, 1.735 * Hh, -0.105 * Hh);
        rigid(head, new THREE.CylinderGeometry(0.115 * Hh, 0.155 * Hh, 0.38 * Hh, 12), hairM, ...p);
      }
    }
  }

  // boots: shaft + sole on each foot (foot wedge is merged boot-mat)
  for (const s of [-1, 1]) {
    const fb = s < 0 ? bones.lFoot : bones.rFoot;
    const fx = s * 0.105 * B;
    const tall = (def.bootsH || 'short') === 'tall';
    const shaftH = tall ? 0.30 * Hh : 0.10 * Hh;
    let p = bloc(parts, s < 0 ? 'lFoot' : 'rFoot', fx, 0.05 * Hh + shaftH / 2, 0);
    rigid(fb, new THREE.CylinderGeometry(0.068 * B, 0.058 * B, shaftH, 12), bootM, ...p);
    if (tall) {
      p = bloc(parts, s < 0 ? 'lFoot' : 'rFoot', fx, 0.05 * Hh + shaftH, 0);
      rigid(fb, new THREE.TorusGeometry(0.068 * B, 0.014, 8, 16), trimM, ...p, Math.PI / 2, 0, 0);
    }
    p = bloc(parts, s < 0 ? 'lFoot' : 'rFoot', fx, 0.008 * Hh, 0.05 * Hh);
    rigid(fb, new THREE.BoxGeometry(0.11 * B, 0.02 * Hh, 0.24 * Hh), darkM, ...p);
  }
  // knee pads ride the shin tops
  if (def.kneePads) {
    for (const s of [-1, 1]) {
      const p = bloc(parts, s < 0 ? 'lShin' : 'rShin', s * 0.105 * B, 0.45 * Hh, 0.05 * B);
      rigid(s < 0 ? bones.lShin : bones.rShin, rball(0.075 * B, 1.0, 1.2, 0.85), darkM, ...p);
    }
  }
  // elbow pad + wristbands on forearms
  if (def.elbowPad) {
    for (const s of [-1, 1]) {
      const p = bloc(parts, s < 0 ? 'lFore' : 'rFore', s * 0.24 * B, 1.32 * Hh, 0);
      rigid(s < 0 ? bones.lFore : bones.rFore,
        new THREE.CylinderGeometry(0.066 * B, 0.070 * B, 0.11 * Hh, 12), darkM, ...p);
    }
  }
  if (def.wrist) {
    for (const s of [-1, 1]) {
      const p = bloc(parts, s < 0 ? 'lFore' : 'rFore', s * 0.24 * B, 1.09 * Hh, 0);
      rigid(s < 0 ? bones.lFore : bones.rFore,
        new THREE.TorusGeometry(0.058 * B, 0.017, 8, 14), trimM, ...p, Math.PI / 2, 0, 0);
    }
  }
  // waistband on pelvis
  {
    const p = bloc(parts, 'pelvis', 0, 1.095 * Hh, 0);
    rigid(bones.pelvis, new THREE.TorusGeometry(0.195 * B, 0.024 * Hh, 8, 18), trimM, ...p, Math.PI / 2, 0, 0);
  }
  // singlet straps / ref stripes ride the chest
  if ((def.torso || 'bare') === 'singlet') {
    for (const s of [-1, 1]) {
      const p = bloc(parts, 'torso', s * 0.11 * B, 1.69 * Hh, 0.115 * B);
      rigid(bones.torso, new THREE.BoxGeometry(0.10 * B, 0.20 * Hh, 0.03), trimM, ...p, -0.15, 0, 0);
    }
  }
  if ((def.torso || 'bare') === 'shirt') {
    for (const sx of [-0.09, 0, 0.09]) {
      const p = bloc(parts, 'torso', sx, 1.52 * Hh, 0);
      rigid(bones.torso, new THREE.BoxGeometry(0.05, 0.30 * Hh, 0.34 * B), darkM, ...p);
    }
  }
  return mats;
}

export function buildWrestlerMesh(def) {
  const H = def.height || 1.0;
  const B = def.bulk || 1.0;
  // Create the full skinned mesh wrestler
  const wrestler = createWrestlerSkinnedMesh(def);
  wrestler.mesh.updateMatrixWorld(true); // fresh bind-pose matrices for detail placement

  const bones = {
    pelvis: wrestler.getBone('Pelvis'),
    spine: wrestler.getBone('Spine1'),
    torso: wrestler.getBone('Spine3'),
    chest: wrestler.getBone('Spine3'),
    neck: wrestler.getBone('Neck'),
    head: wrestler.getBone('Head'),
    lUpper: wrestler.getBone('UpperArm_L'),
    rUpper: wrestler.getBone('UpperArm_R'),
    lFore: wrestler.getBone('Forearm_L'),
    rFore: wrestler.getBone('Forearm_R'),
    lHand: wrestler.getBone('Hand_L'),
    rHand: wrestler.getBone('Hand_R'),
    lThigh: wrestler.getBone('Thigh_L'),
    rThigh: wrestler.getBone('Thigh_R'),
    lShin: wrestler.getBone('Shin_L'),
    rShin: wrestler.getBone('Shin_R'),
    lFoot: wrestler.getBone('Foot_L'),
    rFoot: wrestler.getBone('Foot_R'),
  };
  const parts0 = { ...bones };
  const detailMats = buildDetails(parts0, bones, def, H, B);

  // Add attitude aura to the main group
  const aura = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.72, 24),
    new THREE.MeshBasicMaterial({
      color: 0xffd23f,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
  );
  aura.rotation.x = -Math.PI / 2;
  aura.position.y = 0.05;

  // Add aura to the main mesh group
  wrestler.mesh.add(aura);

  // Return object with SAME KEYS as old system for backward compatibility
  // poseFighter in game.js expects: group, aura, mats, pelvis, spine, torso/chest, neck, head,
  // lUpper, rUpper, lFore, rFore, lHand, rHand, lThigh, rThigh, lShin, rShin, lFoot, rFoot
  
  return {
    // Main group is now the skinned mesh itself
    group: wrestler.mesh,
    aura,
    mats: [...wrestler.mesh.material, ...detailMats],
    ...bones,

    // Store references for advanced features
    _aura: aura,
    _wrestler: {
      mesh: wrestler.mesh,
      headMesh: null,
      skeleton: wrestler.skeleton,
      bones: wrestler.bones,
      gear: null,
      def: wrestler.def,
    },
  };
}

// Helper to get the full wrestler object from a mesh
export function getWrestlerData(parts) {
  return parts._wrestler || null;
}

// Update aura visibility based on attitude
export function updateAura(parts, attitude) {
  const a = parts._aura || parts.aura;
  if (a && a.material) {
    a.material.opacity = attitude >= 100
      ? (0.5 + Math.sin(performance.now() * 0.012) * 0.4)
      : 0;
  }
}

// Apply damage flash to all materials
export function applyHitFlash(parts, flash) {
  const mats = parts.mats || [parts.group.material];
  for (const m of mats) {
    if (m.emissive) {
      m.emissive.setHex(flash ? 0x771414 : 0x000000);
    }
  }
}

// Update wrestler gear colors
export function updateGearColors(parts, colors) {
  const data = getWrestlerData(parts);
  if (data && data.gear) {
    for (const [type, gearObj] of Object.entries(data.gear)) {
      if (gearObj && gearObj.meshes) {
        for (const mesh of gearObj.meshes) {
          if (mesh.material) {
            if (colors.primary) mesh.material.color.setHex(colors.primary);
            if (colors.secondary) mesh.material.emissive.setHex(colors.secondary);
          }
        }
      }
    }
  }
}

// Update face morph targets
export function updateFaceMorphs(parts, morphName, weight) {
  const data = getWrestlerData(parts);
  if (data && data.headMesh && data.headMesh.morphTargetInfluences) {
    const dict = data.headMesh.morphTargetDictionary;
    if (dict[morphName] !== undefined) {
      data.headMesh.morphTargetInfluences[dict[morphName]] = weight;
    }
  }
}

// Trigger face expression
export function triggerExpression(parts, expressionName, duration = 0.5, weight = 1.0) {
  const data = getWrestlerData(parts);
  if (!data || !data.headMesh) return;
  
  const dict = data.headMesh.morphTargetDictionary;
  const influences = data.headMesh.morphTargetInfluences;
  if (!dict || !influences) return;
  
  const idx = dict[expressionName];
  if (idx === undefined) return;
  
  influences[idx] = weight;
  setTimeout(() => {
    influences[idx] = 0;
  }, duration * 1000);
}

export default { buildWrestlerMesh, getWrestlerData, updateAura, applyHitFlash, updateGearColors, updateFaceMorphs, triggerExpression };