// Procedural Face System - Face generation with blendshapes for expressions

import * as THREE from 'three';

export const FACE_BLENDSHAPES = {
  // Eye shapes
  eye_wide: { name: 'eye_wide', bones: ['Head'], regions: ['eye_L', 'eye_R'], intensity: 1.2 },
  eye_narrow: { name: 'eye_narrow', bones: ['Head'], regions: ['eye_L', 'eye_R'], intensity: 0.7 },
  eye_angry: { name: 'eye_angry', bones: ['Head'], regions: ['brow_L', 'brow_R', 'eye_L', 'eye_R'], intensity: 1.3 },
  eye_sad: { name: 'eye_sad', bones: ['Head'], regions: ['brow_L', 'brow_R', 'eye_L', 'eye_R'], intensity: 0.8 },
  eye_closed: { name: 'eye_closed', bones: ['Head'], regions: ['eye_L', 'eye_R'], intensity: 0.0 },
  eye_wink_L: { name: 'eye_wink_L', bones: ['Head'], regions: ['eye_L'], intensity: 0.0 },
  eye_wink_R: { name: 'eye_wink_R', bones: ['Head'], regions: ['eye_R'], intensity: 0.0 },

  // Brow shapes
  brow_raised: { name: 'brow_raised', bones: ['Head'], regions: ['brow_L', 'brow_R'], intensity: 1.4 },
  brow_furrowed: { name: 'brow_furrowed', bones: ['Head'], regions: ['brow_L', 'brow_R'], intensity: 1.3 },
  brow_inner_up: { name: 'brow_inner_up', bones: ['Head'], regions: ['brow_inner_L', 'brow_inner_R'], intensity: 1.3 },

  // Mouth shapes
  mouth_open: { name: 'mouth_open', bones: ['Head', 'Neck'], regions: ['mouth'], intensity: 1.5 },
  mouth_smile: { name: 'mouth_smile', bones: ['Head'], regions: ['mouth_corner_L', 'mouth_corner_R'], intensity: 1.4 },
  mouth_frown: { name: 'mouth_frown', bones: ['Head'], regions: ['mouth_corner_L', 'mouth_corner_R'], intensity: 0.6 },
  mouth_grimace: { name: 'mouth_grimace', bones: ['Head', 'Neck'], regions: ['mouth', 'jaw'], intensity: 1.3 },
  mouth_shout: { name: 'mouth_shout', bones: ['Head', 'Neck'], regions: ['mouth', 'jaw'], intensity: 1.8 },
  mouth_teeth_clench: { name: 'mouth_teeth_clench', bones: ['Head', 'Neck'], regions: ['jaw', 'mouth'], intensity: 1.2 },

  // Cheek/jaw
  cheek_puff: { name: 'cheek_puff', bones: ['Head'], regions: ['cheek_L', 'cheek_R'], intensity: 1.3 },
  jaw_drop: { name: 'jaw_drop', bones: ['Head', 'Neck'], regions: ['jaw'], intensity: 1.4 },
  jaw_clench: { name: 'jaw_clench', bones: ['Head', 'Neck'], regions: ['jaw'], intensity: 1.2 },
  jaw_left: { name: 'jaw_left', bones: ['Head', 'Neck'], regions: ['jaw'], intensity: 0.3 },
  jaw_right: { name: 'jaw_right', bones: ['Head', 'Neck'], regions: ['jaw'], intensity: 0.3 },

  // Nose
  nose_flare: { name: 'nose_flare', bones: ['Head'], regions: ['nostril_L', 'nostril_R'], intensity: 1.3 },
  nose_wrinkle: { name: 'nose_wrinkle', bones: ['Head'], regions: ['nose_bridge'], intensity: 1.2 },

  // Full expressions (combinations)
  expression_neutral: { name: 'expression_neutral', bones: ['Head', 'Neck'], regions: 'all', intensity: 1.0 },
  expression_angry: { name: 'expression_angry', bones: ['Head', 'Neck'], regions: ['brow_L', 'brow_R', 'eye_L', 'eye_R', 'mouth', 'jaw'], intensity: 1.3 },
  expression_happy: { name: 'expression_happy', bones: ['Head'], regions: ['eye_L', 'eye_R', 'mouth_corner_L', 'mouth_corner_R', 'cheek_L', 'cheek_R'], intensity: 1.2 },
  expression_sad: { name: 'expression_sad', bones: ['Head', 'Neck'], regions: ['brow_inner_L', 'brow_inner_R', 'eye_L', 'eye_R', 'mouth_corner_L', 'mouth_corner_R'], intensity: 0.8 },
  expression_surprised: { name: 'expression_surprised', bones: ['Head', 'Neck'], regions: ['brow_L', 'brow_R', 'eye_L', 'eye_R', 'mouth', 'jaw'], intensity: 1.5 },
  expression_pain: { name: 'expression_pain', bones: ['Head', 'Neck'], regions: ['brow_L', 'brow_R', 'eye_L', 'eye_R', 'mouth', 'jaw', 'cheek_L', 'cheek_R'], intensity: 1.4 },
  expression_exhausted: { name: 'expression_exhausted', bones: ['Head', 'Neck'], regions: ['eye_L', 'eye_R', 'mouth', 'jaw', 'cheek_L', 'cheek_R'], intensity: 0.9 },
  expression_determined: { name: 'expression_determined', bones: ['Head', 'Neck'], regions: ['brow_L', 'brow_R', 'eye_L', 'eye_R', 'mouth', 'jaw'], intensity: 1.2 },
  expression_taunt: { name: 'expression_taunt', bones: ['Head', 'Neck'], regions: ['brow_L', 'brow_R', 'eye_L', 'eye_R', 'mouth_corner_L', 'mouth_corner_R', 'jaw'], intensity: 1.3 },
};

// Face region definitions (vertex groups on head mesh)
export const FACE_REGIONS = {
  eye_L: { center: new THREE.Vector3(-0.04, 0.11, 0.11), radius: 0.025 },
  eye_R: { center: new THREE.Vector3(0.04, 0.11, 0.11), radius: 0.025 },
  brow_L: { center: new THREE.Vector3(-0.04, 0.14, 0.11), radius: 0.03 },
  brow_R: { center: new THREE.Vector3(0.04, 0.14, 0.11), radius: 0.03 },
  brow_inner_L: { center: new THREE.Vector3(-0.015, 0.14, 0.11), radius: 0.02 },
  brow_inner_R: { center: new THREE.Vector3(0.015, 0.14, 0.11), radius: 0.02 },
  mouth: { center: new THREE.Vector3(0, 0.04, 0.12), radius: 0.035 },
  mouth_corner_L: { center: new THREE.Vector3(-0.035, 0.03, 0.115), radius: 0.02 },
  mouth_corner_R: { center: new THREE.Vector3(0.035, 0.03, 0.115), radius: 0.02 },
  jaw: { center: new THREE.Vector3(0, 0, 0.11), radius: 0.04 },
  cheek_L: { center: new THREE.Vector3(-0.07, 0.06, 0.1), radius: 0.03 },
  cheek_R: { center: new THREE.Vector3(0.07, 0.06, 0.1), radius: 0.03 },
  nose_bridge: { center: new THREE.Vector3(0, 0.09, 0.115), radius: 0.02 },
  nostril_L: { center: new THREE.Vector3(-0.015, 0.07, 0.12), radius: 0.015 },
  nostril_R: { center: new THREE.Vector3(0.015, 0.07, 0.12), radius: 0.015 },
};

// Face archetype parameters
export const FACE_ARCHETYPES = {
  powerhouse: {
    jawWidth: 1.3, chinHeight: 1.2, cheekbones: 0.8, browRidge: 1.4,
    noseWidth: 1.2, eyeSpacing: 1.0, foreheadHeight: 1.0,
    earSize: 1.1, neckThickness: 1.3,
  },
  technician: {
    jawWidth: 1.0, chinHeight: 1.0, cheekbones: 1.1, browRidge: 1.0,
    noseWidth: 1.0, eyeSpacing: 1.05, foreheadHeight: 1.1,
    earSize: 1.0, neckThickness: 1.0,
  },
  highflyer: {
    jawWidth: 0.85, chinHeight: 0.9, cheekbones: 1.2, browRidge: 0.8,
    noseWidth: 0.9, eyeSpacing: 1.1, foreheadHeight: 1.1,
    earSize: 0.9, neckThickness: 0.9,
  },
  brawler: {
    jawWidth: 1.25, chinHeight: 1.15, cheekbones: 0.9, browRidge: 1.3,
    noseWidth: 1.15, eyeSpacing: 0.95, foreheadHeight: 0.95,
    earSize: 1.1, neckThickness: 1.2,
  },
  giant: {
    jawWidth: 1.5, chinHeight: 1.4, cheekbones: 0.7, browRidge: 1.6,
    noseWidth: 1.3, eyeSpacing: 0.9, foreheadHeight: 0.9,
    earSize: 1.2, neckThickness: 1.5,
  },
  balanced: {
    jawWidth: 1.0, chinHeight: 1.0, cheekbones: 1.0, browRidge: 1.0,
    noseWidth: 1.0, eyeSpacing: 1.0, foreheadHeight: 1.0,
    earSize: 1.0, neckThickness: 1.0,
  },
};

// Generate base face geometry with proper topology
export function createFaceGeometry(archetype = 'balanced', customParams = {}) {
  const params = { ...FACE_ARCHETYPES[archetype], ...customParams };
  
  // Base head sphere with proper topology for facial features
  const geometry = new THREE.SphereGeometry(0.125, 32, 24, 0, Math.PI * 2, 0, Math.PI);
  
  // The sphere needs to be modified for facial features
  // We'll use morph targets for expressions
  const position = geometry.getAttribute('position');
  const count = position.count;
  
  // Create base face shape modifications
  const vertex = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    vertex.fromBufferAttribute(position, i);
    
    // Apply archetype scaling to face regions
    const x = Math.abs(vertex.x);
    const y = vertex.y;
    const z = vertex.z;
    
    // Jaw width
    if (y < 0.02 && z > 0.08) {
      vertex.x *= params.jawWidth;
      vertex.z *= params.chinHeight;
    }
    
    // Cheekbones
    if (y > 0.02 && y < 0.08 && x > 0.05 && z > 0.06) {
      vertex.x *= params.cheekbones;
    }
    
    // Brow ridge
    if (y > 0.11 && z > 0.1) {
      vertex.z *= params.browRidge;
    }
    
    // Nose width
    if (y > 0.02 && y < 0.09 && x < 0.03 && z > 0.1) {
      vertex.x *= params.noseWidth;
    }
    
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  
  geometry.computeVertexNormals();
  // Initialize morphAttributes for blendshapes
  geometry.morphAttributes.position = [];
  return geometry;
}

// Create blendshape targets on face geometry
export function createFaceBlendshapes(geometry, skeleton) {
  const position = geometry.getAttribute('position');
  const count = position.count;
  const skinIndex = geometry.getAttribute('skinIndex');
  const skinWeight = geometry.getAttribute('skinWeight');
  
  const morphAttributes = {};
  const vertex = new THREE.Vector3();
  const offset = new THREE.Vector3();
  
  for (const [key, blend] of Object.entries(FACE_BLENDSHAPES)) {
    const offsets = new Float32Array(count * 3);
    const region = FACE_REGIONS[blend.regions] || null;
    
    for (let i = 0; i < count; i++) {
      vertex.fromBufferAttribute(position, i);
      
      // Check if vertex is in affected region
      let influence = 0;
      if (region) {
        if (Array.isArray(blend.regions)) {
          // Multiple regions
          for (const r of blend.regions) {
            const reg = FACE_REGIONS[r];
            if (reg) {
              const d = vertex.distanceTo(reg.center);
              if (d < reg.radius) {
                influence = Math.max(influence, 1 - d / reg.radius);
              }
            }
          }
        } else if (blend.regions === 'all') {
          influence = 1.0;
        } else {
          const reg = FACE_REGIONS[blend.regions];
          if (reg) {
            const d = vertex.distanceTo(reg.center);
            if (d < reg.radius) {
              influence = 1 - d / reg.radius;
            }
          }
        }
      }
      
      if (influence > 0) {
        // Apply blendshape in local space of head bone
        const headBone = skeleton.bones.find(b => b.name === 'Head');
        if (headBone) {
          const invMatrix = new THREE.Matrix4().copy(headBone.matrixWorld).invert();
          const localPos = vertex.clone().applyMatrix4(invMatrix);
          
          // Apply blendshape deformation
          const scale = 1 + (blend.intensity - 1) * influence;
          const scaled = localPos.clone().multiplyScalar(scale);
          const worldOffset = scaled.applyMatrix4(headBone.matrixWorld);
          
          offset.copy(worldOffset).sub(vertex).multiplyScalar(influence);
        }
      }
      
      offsets[i * 3] = offset.x;
      offsets[i * 3 + 1] = offset.y;
      offsets[i * 3 + 2] = offset.z;
    }
    
    morphAttributes[key] = new THREE.BufferAttribute(offsets, 3);
  }
  
  // Add morph attributes to geometry
  if (!geometry.morphAttributes.position) {
    geometry.morphAttributes.position = [];
  }
  for (const [key, attr] of Object.entries(morphAttributes)) {
    geometry.morphAttributes.position.push(attr);
  }
  
  return geometry;
}

// Face controller for runtime expression blending
export class FaceController {
  constructor(mesh) {
    this.mesh = mesh;
    this.expressions = {};
    this.currentExpression = 'expression_neutral';
    this.transitionSpeed = 8.0; // per second
    this.targetWeights = {};
    this.currentWeights = {};
    
    // Initialize weights
    if (mesh.morphTargetDictionary) {
      for (const key of Object.keys(mesh.morphTargetDictionary)) {
        this.targetWeights[key] = 0;
        this.currentWeights[key] = 0;
      }
      this.targetWeights['expression_neutral'] = 1.0;
      this.currentWeights['expression_neutral'] = 1.0;
    }
  }
  
  setExpression(name, weight = 1.0, transitionTime = 0.3) {
    if (!this.mesh.morphTargetDictionary || !this.mesh.morphTargetDictionary[name]) {
      return;
    }
    
    // Fade out current expression
    this.targetWeights[this.currentExpression] = 0;
    
    // Fade in new expression
    this.targetWeights[name] = weight;
    this.currentExpression = name;
  }
  
  blendExpression(name, weight, transitionTime = 0.3) {
    if (!this.mesh.morphTargetDictionary || !this.mesh.morphTargetDictionary[name]) {
      return;
    }
    this.targetWeights[name] = weight;
  }
  
  update(dt) {
    if (!this.mesh.morphTargetInfluences) return;
    
    const dict = this.mesh.morphTargetDictionary;
    const influences = this.mesh.morphTargetInfluences;
    const speed = this.transitionSpeed * dt;
    
    for (const [name, targetWeight] of Object.entries(this.targetWeights)) {
      const idx = dict[name];
      if (idx === undefined) continue;
      
      const current = this.currentWeights[name] || 0;
      let newWeight = current;
      
      if (Math.abs(current - targetWeight) < speed) {
        newWeight = targetWeight;
      } else if (current < targetWeight) {
        newWeight = Math.min(targetWeight, current + speed);
      } else {
        newWeight = Math.max(targetWeight, current - speed);
      }
      
      this.currentWeights[name] = newWeight;
      influences[idx] = newWeight;
    }
  }
  
  // Trigger temporary expression (pain, impact, etc.)
  triggerExpression(name, duration = 0.5, weight = 1.0) {
    this.blendExpression(name, weight);
    setTimeout(() => {
      this.blendExpression(name, 0, 0.3);
    }, duration * 1000);
  }
  
  // Sync with wrestler state
  syncWithWrestler(wrestler) {
    if (wrestler.state === 'down' || wrestler.state === 'pinned') {
      this.triggerExpression('expression_pain', 1.0, 0.8);
    } else if (wrestler.state === 'submit' || wrestler.state === 'submitvictim') {
      this.triggerExpression('expression_pain', 0.5, 0.5);
    } else if (wrestler.state === 'attack' && wrestler.anim.includes('finisher')) {
      this.triggerExpression('expression_determined', 0.5, 0.4);
    } else if (wrestler.state === 'taunt') {
      this.triggerExpression('expression_taunt', 1.5, 1.0);
    } else if (wrestler.spirit > 80) {
      this.blendExpression('expression_determined', 0.3);
    } else if (wrestler.spirit < 20) {
      this.blendExpression('expression_exhausted', 0.4);
    } else {
      this.blendExpression('expression_neutral', 1.0);
    }
  }
}

// Create full head mesh with face
export function createHeadMesh(wrestlerDef, skeleton) {
  const archetype = wrestlerDef.bodyType || 'balanced';
  const faceGeo = createFaceGeometry(wrestlerDef.bodyType, wrestlerDef.faceParams);
  
  // Create blendshapes if head bone exists
  const headBone = skeleton.bones.find(b => b.name === 'Head');
  if (headBone) {
    createFaceBlendshapes(faceGeo, skeleton);
  }
  
  const material = new THREE.MeshStandardMaterial({
    color: wrestlerDef.skin || 0xd9a066,
    roughness: 0.35,
    metalness: 0.02,
    skinning: true,
    morphTargets: true,
  });
  
  const headMesh = new THREE.SkinnedMesh(faceGeo, material);
  headMesh.castShadow = true;
  headMesh.name = 'HeadMesh';
  
  // Add facial features as separate meshes (eyes, teeth, etc.)
  addFacialFeatures(headMesh, wrestlerDef);
  
  return headMesh;
}

function addFacialFeatures(headMesh, wrestlerDef) {
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x101014,
    roughness: 0.3,
    metalness: 0.1,
  });
  
  const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    roughness: 0.2,
    metalness: 0.02,
  });
  
  const teethMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8f8f0,
    roughness: 0.1,
    metalness: 0.02,
  });
  
  // Eyes (separate meshes for better control)
  for (const side of [-1, 1]) {
    const eyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 12, 10),
      eyeWhiteMaterial
    );
    eyeWhite.position.set(side * 0.048, 0.112, 0.108);
    eyeWhite.name = `EyeWhite_${side > 0 ? 'R' : 'L'}`;
    headMesh.add(eyeWhite);
    
    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(0.009, 10, 8),
      eyeMaterial
    );
    iris.position.set(side * 0.048, 0.112, 0.118);
    iris.name = `Iris_${side > 0 ? 'R' : 'L'}`;
    headMesh.add(iris);
  }
  
  // Teeth
  const upperTeeth = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.012, 0.008),
    teethMaterial
  );
  upperTeeth.position.set(0, 0.035, 0.118);
  upperTeeth.name = 'UpperTeeth';
  headMesh.add(upperTeeth);
  
  const lowerTeeth = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 0.01, 0.006),
    teethMaterial
  );
  lowerTeeth.position.set(0, 0.015, 0.115);
  lowerTeeth.name = 'LowerTeeth';
  headMesh.add(lowerTeeth);
}

export default {
  FACE_BLENDSHAPES,
  FACE_REGIONS,
  FACE_ARCHETYPES,
  createFaceGeometry,
  createFaceBlendshapes,
  FaceController,
  createHeadMesh,
  FACE_ARCHETYPES,
};