// Core27 skate motion retarget (motion data: bloxpicto4-blip/skate-threejs,
// public/motion-sets/skate.json, Genex motion set).
//
// The set ships joint-local quaternions on a 27-joint skeleton whose rest pose
// is identity, so each clip quaternion IS the delta from rest. Retarget onto
// our rider as:  qTarget = restTarget * qClip  (+ composed Spine2*Spine3).
// Hips translation drives our root, relative to the clip's first frame.
// All writes are absolute — deterministic under the mixer's change-check.
import * as THREE from 'three';

const CORE_MAP = {
  Hips: 'pelvis_human',
  Spine: 'spine_01_human', Spine1: 'spine_02_human',
  Neck: 'neck_01_human', Head: 'head_human',
  RightShoulder: 'clavicle_r_human', RightArm: 'upperarm_r_human',
  RightForeArm: 'lowerarm_r_human', RightHand: 'hand_r_human',
  LeftShoulder: 'clavicle_l_human', LeftArm: 'upperarm_l_human',
  LeftForeArm: 'lowerarm_l_human', LeftHand: 'hand_l_human',
  RightUpLeg: 'thigh_r_human', RightLeg: 'calf_r_human', RightFoot: 'foot_r_human',
  LeftUpLeg: 'thigh_l_human', LeftLeg: 'calf_l_human', LeftFoot: 'foot_l_human',
};

export const CORE_BEATS = {
  ollieDur: 1.0, kickDur: 1.15,
  stance: { clip: 'idle', t: 1.0 },
  crouch: { clip: 'skateOllie', t: 0.0 },
  launch: { clip: 'skateOllie', t: 0.25 },
  land: { clip: 'skateOllie', t: 0.95 },
};

const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _qc = new THREE.Quaternion();

export function createCoreDriver(motion, bones) {
  const joints = motion.joints;
  const jIndex = {};
  joints.forEach((n, i) => { jIndex[n] = i; });
  // Our bind (rest) quats, captured before any clip touches the bones.
  const rest = {};
  for (const core of Object.keys(CORE_MAP)) {
    const b = bones[CORE_MAP[core]];
    if (b) rest[core] = b.quaternion.clone();
  }
  if (bones['spine_03_human']) rest['spine_03_human'] = bones['spine_03_human'].quaternion.clone();
  const restRoot = bones['Root_human'] ? bones['Root_human'].position.clone() : new THREE.Vector3();
  const refHips = {};
  for (const cname of Object.keys(motion.gaits)) {
    const hp = motion.gaits[cname].hipsPos;
    refHips[cname] = hp[0].slice();
  }
  const S = {
    motion, bones, rest, restRoot, refHips, jIndex,
    trimX: 0, hipsGain: 1.0,
    clipDur(cname) { return motion.gaits[cname].frames / motion.gaits[cname].fps; },
  };
  return S;
}

function sampleClip(S, cname, t) {
  const C = S.motion.gaits[cname];
  const n = C.frames;
  let f = t * C.fps;
  let i0, k;
  if (C.loop) {
    f = ((f % n) + n) % n;
    i0 = Math.floor(f) % n;
    k = f - Math.floor(f);
  } else {
    f = Math.max(0, Math.min(n - 1.001, f));
    i0 = Math.floor(f);
    k = Math.max(0, Math.min(1, f - i0));
  }
  const i1 = C.loop ? (i0 + 1) % n : Math.min(n - 1, i0 + 1);
  return { C, i0, i1, k };
}

// Pose the body from a Core27 clip at time t (seconds). Absolute writes.
export function driveCore(S, cname, t) {
  const { C, i0, i1, k } = sampleClip(S, cname, t);
  const F0 = C.localQuat[i0], F1 = C.localQuat[i1];
  const H0 = C.hipsPos[i0], H1 = C.hipsPos[i1];
  for (const core of Object.keys(CORE_MAP)) {
    const b = S.bones[CORE_MAP[core]];
    const ji = S.jIndex[core];
    if (!b || ji == null || !S.rest[core]) continue;
    _qa.set(F0[ji][0], F0[ji][1], F0[ji][2], F0[ji][3]);
    _qb.set(F1[ji][0], F1[ji][1], F1[ji][2], F1[ji][3]);
    _qa.slerp(_qb, k);
    b.quaternion.copy(S.rest[core]).multiply(_qa);
  }
  // Spine3 folds onto spine_03 (composed after Spine2).
  {
    const b = S.bones['spine_03_human'];
    const j2 = S.jIndex['Spine2'], j3 = S.jIndex['Spine3'];
    if (b && j2 != null && j3 != null && S.rest['spine_03_human']) {
      _qa.set(F0[j2][0], F0[j2][1], F0[j2][2], F0[j2][3]);
      _qb.set(F1[j2][0], F1[j2][1], F1[j2][2], F1[j2][3]);
      _qa.slerp(_qb, k);
      _qc.copy(_qa);
      _qa.set(F0[j3][0], F0[j3][1], F0[j3][2], F0[j3][3]);
      _qb.set(F1[j3][0], F1[j3][1], F1[j3][2], F1[j3][3]);
      _qa.slerp(_qb, k);
      b.quaternion.copy(S.rest['spine_03_human']).multiply(_qc).multiply(_qa);
    }
  }
  // Hips translation → root, relative to the clip's first frame.
  const rb = S.bones['Root_human'];
  if (rb) {
    const ref = S.refHips[cname];
    const hx = H0[0] + (H1[0] - H0[0]) * k, hy = H0[1] + (H1[1] - H0[1]) * k, hz = H0[2] + (H1[2] - H0[2]) * k;
    rb.position.set(
      S.restRoot.x + (hx - ref[0]) * S.hipsGain + (S.trimX || 0),
      S.restRoot.y + (hy - ref[1]) * S.hipsGain,
      S.restRoot.z + (hz - ref[2]) * S.hipsGain);
  }
}
