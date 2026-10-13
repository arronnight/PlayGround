// Keyframed move clips — real wrestling choreography.
// Each clip: dur (seconds) + keys [{t:0..1, j:{joint:[x,y,z]}, root:{y,fwd,pitch}, pelvisY}].
// Attacker and victim clips play in sync; the victim is *acted upon*
// (hoisted, inverted, flipped, slammed) instead of standing frozen.
// Joints not listed in a key keep the base-stance pose (sparse keys OK).
import * as THREE from 'three';

const S = (x) => x; // readability alias
function smooth(e) { e = Math.max(0, Math.min(1, e)); return e * e * (3 - 2 * e); }

export const CLIPS = {
  // ---------------- STRIKES (attacker) ----------------
  strike_jab: { dur: 0.42, keys: [
    { t: 0, j: { rUpper: [-0.6, 0, -0.1], rFore: [-1.4, 0, 0], lUpper: [-0.6, 0, 0.1], lFore: [-1.4, 0, 0], torso: [0, 0, 0] } },
    { t: 0.35, j: { rUpper: [-1.7, 0, -0.1], rFore: [-0.1, 0, 0], torso: [0, -0.55, 0], spine: [0, -0.2, 0], head: [0, 0.25, 0] }, root: { y: 0, fwd: 0.15, pitch: 0 } },
    { t: 1, j: { rUpper: [-0.6, 0, -0.1], rFore: [-1.4, 0, 0], torso: [0, 0, 0] } },
  ]},
  strike_chop: { dur: 0.42, keys: [
    { t: 0, j: { rUpper: [-2.4, 0, -0.3], rFore: [-0.5, 0, 0], spine: [-0.2, 0, 0] } },
    { t: 0.4, j: { rUpper: [0.8, 0, -0.2], rFore: [-0.1, 0, 0], spine: [0.3, 0, 0], torso: [0, 0.5, 0] }, root: { y: 0, fwd: 0.2, pitch: 0 } },
    { t: 1, j: { rUpper: [-0.6, 0, -0.1], rFore: [-1.4, 0, 0], spine: [0, 0, 0], torso: [0, 0, 0] } },
  ]},
  strike_elbow: { dur: 0.42, keys: [
    { t: 0, j: { torso: [0, 0.6, 0], rUpper: [-0.4, 0, -0.5], rFore: [-1.6, 0, 0] } },
    { t: 0.4, j: { rUpper: [-1.2, 0, -0.2], rFore: [-0.1, 0, 0], torso: [0, -0.6, 0], spine: [0.2, -0.3, 0] }, root: { y: 0, fwd: 0.2, pitch: 0 } },
    { t: 1, j: { rUpper: [-0.6, 0, -0.1], rFore: [-1.4, 0, 0], torso: [0, 0, 0] } },
  ]},
  strike_kick: { dur: 0.5, keys: [
    { t: 0, j: { rThigh: [-0.2, 0, 0], lUpper: [0, 0, 0.3], rUpper: [0, 0, -0.3] } },
    { t: 0.4, j: { rThigh: [-1.8, 0, 0], rShin: [0.1, 0, 0], lShin: [0.25, 0, 0], spine: [-0.25, 0, 0], torso: [0, 0.45, 0], lUpper: [0.5, 0, 0.6], rUpper: [0.5, 0, -0.6], head: [0, -0.2, 0] }, root: { y: 0.05, fwd: 0.15, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  strike_superkick: { dur: 0.5, keys: [
    { t: 0, j: { rThigh: [-0.4, 0, 0.2], spine: [-0.1, 0, 0] } },
    { t: 0.38, j: { rThigh: [-2.0, 0, 0.1], rShin: [0.05, 0, 0], spine: [-0.35, 0, 0], torso: [0, 0.5, 0], lUpper: [0.6, 0, 0.8], rUpper: [0.6, 0, -0.8], head: [0, -0.3, 0] }, root: { y: 0.15, fwd: 0.1, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  strike_clothesline: { dur: 0.5, keys: [
    { t: 0, j: { rUpper: [-1.2, 0, -1.4], rFore: [-0.2, 0, 0], spine: [0.1, 0.3, 0] } },
    { t: 0.45, j: { rUpper: [-1.2, 0, -1.4], torso: [0, -0.7, 0], spine: [0.2, -0.4, 0], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0] }, root: { y: 0, fwd: 0.45, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  strike_dropkick: { dur: 0.6, keys: [
    { t: 0, j: { lThigh: [-1.0, 0, 0], rThigh: [-1.0, 0, 0], lShin: [1.2, 0, 0], rShin: [1.2, 0, 0] }, root: { y: 0, fwd: 0, pitch: 0 }, pelvisY: 0.6 },
    { t: 0.45, j: { lThigh: [-1.4, 0, 0], rThigh: [-1.4, 0, 0], lShin: [0.3, 0, 0], rShin: [0.3, 0, 0], spine: [-0.3, 0, 0], lUpper: [0.8, 0, 0.4], rUpper: [0.8, 0, -0.4] }, root: { y: 0.55, fwd: 0.5, pitch: 0 }, pelvisY: 0.9 },
    { t: 1, j: { lThigh: [-0.8, 0, 0], rThigh: [-0.8, 0, 0], lShin: [1.0, 0, 0], rShin: [1.0, 0, 0] }, root: { y: 0.1, fwd: 0.7, pitch: 0 }, pelvisY: 0.62 },
  ]},
  strike_uppercut: { dur: 0.45, keys: [
    { t: 0, j: { rUpper: [0.6, 0, -0.2], rFore: [-1.8, 0, 0], lThigh: [-0.4, 0, 0], rThigh: [-0.4, 0, 0], lShin: [0.6, 0, 0], rShin: [0.6, 0, 0], spine: [0.35, 0, 0] }, pelvisY: 0.7 },
    { t: 0.4, j: { rUpper: [-2.2, 0, -0.1], rFore: [-0.2, 0, 0], spine: [-0.3, 0, 0], torso: [0, -0.4, 0], lThigh: [-0.6, 0, 0], rThigh: [-0.2, 0, 0] }, root: { y: 0.1, fwd: 0.2, pitch: 0 }, pelvisY: 0.85 },
    { t: 1, j: {} },
  ]},
  strike_headbutt: { dur: 0.45, keys: [
    { t: 0, j: { head: [-0.4, 0, 0], spine: [-0.2, 0, 0], lUpper: [-1.0, 0, 0.5], rUpper: [-1.0, 0, -0.5] } },
    { t: 0.4, j: { head: [0.7, 0, 0], spine: [0.45, 0, 0], torso: [0, 0.2, 0], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0] }, root: { y: 0, fwd: 0.3, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  strike_knee: { dur: 0.45, keys: [
    { t: 0, j: { rThigh: [0.4, 0, 0], rShin: [1.6, 0, 0], lUpper: [-1.2, 0, 0.4], rUpper: [-1.2, 0, -0.4], spine: [0.1, 0, 0] } },
    { t: 0.4, j: { rThigh: [-1.9, 0, 0], rShin: [1.9, 0, 0], spine: [0.25, 0, 0], lUpper: [-0.4, 0, 0.6], rUpper: [-0.4, 0, -0.6], lShin: [0.3, 0, 0] }, root: { y: 0.1, fwd: 0.25, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  strike_bigboot: { dur: 0.55, keys: [
    { t: 0, j: { rThigh: [-1.6, 0, 0.1], rShin: [0.4, 0, 0], spine: [-0.3, 0, 0], lUpper: [0.7, 0, 0.7], rUpper: [0.7, 0, -0.7] } },
    { t: 0.45, j: { rThigh: [-1.7, 0, 0], rShin: [0.05, 0, 0], spine: [-0.15, 0, 0], torso: [0, -0.5, 0], lThigh: [-0.3, 0, 0], lShin: [0.2, 0, 0] }, root: { y: 0.1, fwd: 0.4, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  strike_axehandle: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-2.8, 0, 0.4], rUpper: [-2.8, 0, -0.4], lFore: [-0.4, 0, 0], rFore: [-0.4, 0, 0], spine: [-0.35, 0, 0], head: [-0.3, 0, 0] }, root: { y: 0.15, fwd: 0, pitch: 0 }, pelvisY: 1.0 },
    { t: 0.45, j: { lUpper: [0.9, 0, 0.3], rUpper: [0.9, 0, -0.3], spine: [0.5, 0, 0], torso: [0, 0.2, 0], lThigh: [-0.7, 0, 0], rThigh: [-0.7, 0, 0], lShin: [0.9, 0, 0], rShin: [0.9, 0, 0] }, root: { y: -0.1, fwd: 0.25, pitch: 0 }, pelvisY: 0.62 },
    { t: 1, j: {} },
  ]},
  strike_enzuigiri: { dur: 0.55, keys: [
    { t: 0, j: { torso: [0, 0.9, 0], spine: [0, 0.5, 0], rThigh: [-0.6, 0, -0.3], head: [0, -0.5, 0] } },
    { t: 0.45, j: { torso: [0, -0.9, 0], spine: [0, -0.5, 0], rThigh: [-1.6, 0, 0.9], rShin: [0.2, 0, 0], lUpper: [0.8, 0, 0.6], rUpper: [0.8, 0, -0.6] }, root: { y: 0.1, fwd: 0.2, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  strike_discus: { dur: 0.6, keys: [
    { t: 0, j: { torso: [0, 1.2, 0], spine: [0, 0.6, 0], rUpper: [-0.5, 0, -1.2], rFore: [-1.5, 0, 0], head: [0, -0.6, 0] } },
    { t: 0.45, j: { torso: [0, -1.0, 0], spine: [0, -0.5, 0], rUpper: [-1.8, 0, -0.2], rFore: [-0.1, 0, 0], lThigh: [-0.7, 0, 0], rThigh: [-0.3, 0, 0] }, root: { y: 0, fwd: 0.35, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  strike_spear: { dur: 0.6, keys: [
    { t: 0, j: { spine: [0.3, 0, 0], head: [0.2, 0, 0], lThigh: [-1.2, 0, 0], rThigh: [-1.2, 0, 0], lShin: [1.4, 0, 0], rShin: [1.4, 0, 0], lUpper: [-0.6, 0, 0.9], rUpper: [-0.6, 0, -0.9] }, pelvisY: 0.6 },
    { t: 0.45, j: { spine: [0.5, 0, 0], lUpper: [-1.4, 0, 0.4], rUpper: [-1.4, 0, -0.4], lThigh: [-0.4, 0, 0], rThigh: [-0.9, 0, 0], lShin: [0.4, 0, 0], rShin: [1.0, 0, 0] }, root: { y: -0.1, fwd: 0.7, pitch: 0 }, pelvisY: 0.55 },
    { t: 1, j: {} },
  ]},
  strike_flyingforearm: { dur: 0.55, keys: [
    { t: 0, j: { rUpper: [-2.2, 0, -0.6], rFore: [-0.8, 0, 0], spine: [-0.3, 0, 0], lThigh: [-1.0, 0, 0], rThigh: [-1.0, 0, 0], lShin: [1.2, 0, 0], rShin: [1.2, 0, 0] }, root: { y: 0.3, fwd: 0.3, pitch: 0 }, pelvisY: 0.9 },
    { t: 0.45, j: { rUpper: [-1.4, 0, -0.3], rFore: [-0.2, 0, 0], torso: [0, -0.6, 0], spine: [0.1, -0.3, 0] }, root: { y: 0.1, fwd: 0.5, pitch: 0 }, pelvisY: 0.75 },
    { t: 1, j: {} },
  ]},
  // ---------------- SLAMS (attacker) ----------------
  slam_suplex: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-0.8, 0, 0.6], rUpper: [-0.8, 0, -0.6], lFore: [-1.0, 0, 0], rFore: [-1.0, 0, 0], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0], lShin: [0.7, 0, 0], rShin: [0.7, 0, 0], spine: [0.2, 0, 0] }, pelvisY: 0.8 },
    { t: 0.45, j: { lUpper: [0, 0, 2.6], rUpper: [0, 0, -2.6], lFore: [-0.3, 0, 0], rFore: [-0.3, 0, 0], spine: [-0.4, 0, 0], head: [-0.3, 0, 0], lThigh: [0.3, 0, 0], rThigh: [0.3, 0, 0] }, pelvisY: 0.82 },
    { t: 1, j: { spine: [0.5, 0, 0], lUpper: [0.6, 0, 0.4], rUpper: [0.6, 0, -0.4], lThigh: [-1.0, 0, 0], rThigh: [-1.0, 0, 0], lShin: [1.2, 0, 0], rShin: [1.2, 0, 0] }, root: { y: 0, fwd: 0.3, pitch: 0 }, pelvisY: 0.6 },
  ]},
  slam_powerbomb: { dur: 0.6, keys: [
    { t: 0, j: { lThigh: [-1.1, 0, 0], rThigh: [-1.1, 0, 0], lShin: [1.3, 0, 0], rShin: [1.3, 0, 0], spine: [0.4, 0, 0], lUpper: [-0.5, 0, 0.8], rUpper: [-0.5, 0, -0.8] }, pelvisY: 0.62 },
    { t: 0.45, j: { lUpper: [0, 0, 2.4], rUpper: [0, 0, -2.4], spine: [-0.3, 0, 0], head: [-0.3, 0, 0], lThigh: [-0.3, 0, 0], rThigh: [-0.3, 0, 0] }, pelvisY: 0.8 },
    { t: 1, j: { spine: [0.45, 0, 0], lUpper: [0.8, 0, 0.3], rUpper: [0.8, 0, -0.3], lThigh: [-1.1, 0, 0], rThigh: [-1.1, 0, 0], lShin: [1.3, 0, 0], rShin: [1.3, 0, 0] }, pelvisY: 0.55 },
  ]},
  slam_piledriver: { dur: 0.6, keys: [
    { t: 0, j: { lUpper: [-1.3, 0, 0.5], rUpper: [-1.3, 0, -0.5], lFore: [-0.5, 0, 0], rFore: [-0.5, 0, 0], spine: [0.15, 0, 0] }, pelvisY: 0.85 },
    { t: 0.5, j: { lThigh: [-1.0, 0, 0], rThigh: [-1.0, 0, 0], lShin: [1.3, 0, 0], rShin: [1.3, 0, 0], spine: [0.3, 0, 0], head: [0.3, 0, 0] }, pelvisY: 0.6 },
    { t: 1, j: { lThigh: [-1.2, 0, 0], rThigh: [-1.2, 0, 0], lShin: [1.4, 0, 0], rShin: [1.4, 0, 0], spine: [0.35, 0, 0] }, pelvisY: 0.5 },
  ]},
  slam_ddt: { dur: 0.5, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.7], rUpper: [-1.0, 0, -0.7], lFore: [-0.8, 0, 0], rFore: [-0.8, 0, 0], head: [0.25, 0, 0], spine: [0.2, 0, 0] } },
    { t: 0.5, j: { spine: [-0.5, 0, 0], head: [-0.2, 0, 0], lThigh: [-0.9, 0, 0], rThigh: [-0.9, 0, 0], lShin: [1.2, 0, 0], rShin: [1.2, 0, 0], lUpper: [-0.3, 0, 0.8], rUpper: [-0.3, 0, -0.8] }, root: { y: -0.1, fwd: 0.15, pitch: 0 }, pelvisY: 0.6 },
    { t: 1, j: { spine: [-0.2, 0, 0] }, pelvisY: 0.62 },
  ]},
  slam_german: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-0.9, 0, 0.9], rUpper: [-0.9, 0, -0.9], lFore: [-1.0, 0, 0], rFore: [-1.0, 0, 0], spine: [0.3, 0, 0], lThigh: [-0.3, 0, 0], rThigh: [-0.3, 0, 0] } },
    { t: 0.5, j: { spine: [-0.6, 0, 0], head: [-0.4, 0, 0], lUpper: [-0.5, 0, 1.0], rUpper: [-0.5, 0, -1.0], lThigh: [-0.4, 0, 0], rThigh: [-0.4, 0, 0] }, root: { y: 0.1, fwd: -0.2, pitch: 0 }, pelvisY: 0.72 },
    { t: 1, j: { spine: [-0.55, 0, 0], head: [-0.4, 0, 0] }, pelvisY: 0.68 },
  ]},
  slam_rana: { dur: 0.5, keys: [
    { t: 0, j: { lThigh: [-1.5, 0, 0.3], rThigh: [-1.5, 0, -0.3], lShin: [1.4, 0, 0], rShin: [1.4, 0, 0], lUpper: [0, 0, 1.5], rUpper: [0, 0, -1.5], spine: [-0.2, 0, 0] }, root: { y: 0.5, fwd: 0.2, pitch: 0 }, pelvisY: 1.0 },
    { t: 0.55, j: { lUpper: [-0.8, 0, 0.5], rUpper: [-0.8, 0, -0.5], lFore: [-0.6, 0, 0], rFore: [-0.6, 0, 0], lThigh: [-1.0, 0, 0.2], rThigh: [-1.0, 0, -0.2], lShin: [1.2, 0, 0], rShin: [1.2, 0, 0], spine: [0.4, 0, 0] }, root: { y: 0, fwd: 0.1, pitch: 0 }, pelvisY: 0.55 },
    { t: 1, j: { spine: [0.35, 0, 0] }, pelvisY: 0.55 },
  ]},
  slam_spinebuster: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-1.2, 0, 0.6], rUpper: [-1.2, 0, -0.6], lFore: [-0.8, 0, 0], rFore: [-0.8, 0, 0], spine: [0.2, 0, 0], lThigh: [-0.4, 0, 0], rThigh: [-0.4, 0, 0] } },
    { t: 0.45, j: { spine: [0.1, 0.4, 0], torso: [0, 0.4, 0], pelvisY: 0, lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0] }, root: { y: 0.1, fwd: 0.2, pitch: 0 }, pelvisY: 0.78 },
    { t: 1, j: { spine: [0.5, 0, 0], lUpper: [-0.4, 0, 0.5], rUpper: [-0.4, 0, -0.5], lThigh: [-1.0, 0, 0], rThigh: [-1.0, 0, 0], lShin: [1.2, 0, 0], rShin: [1.2, 0, 0] }, root: { y: 0, fwd: 0.5, pitch: 0 }, pelvisY: 0.58 },
  ]},
  slam_slam: { dur: 0.5, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.8], rUpper: [-1.0, 0, -0.8], lFore: [-0.7, 0, 0], rFore: [-0.7, 0, 0], spine: [0.15, 0, 0], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0] }, pelvisY: 0.75 },
    { t: 0.45, j: { lUpper: [0, 0, 2.2], rUpper: [0, 0, -2.2], spine: [-0.3, 0, 0], head: [-0.25, 0, 0] }, pelvisY: 0.85 },
    { t: 1, j: { spine: [0.4, 0, 0], lUpper: [0.5, 0, 0.4], rUpper: [0.5, 0, -0.4], lThigh: [-0.8, 0, 0], rThigh: [-0.8, 0, 0] }, root: { y: 0, fwd: 0.3, pitch: 0 }, pelvisY: 0.62 },
  ]},
  slam_neckbreaker: { dur: 0.5, keys: [
    { t: 0, j: { torso: [0, 0.5, 0], spine: [0, 0.3, 0], lUpper: [-0.8, 0, 1.0], rUpper: [-0.8, 0, -0.4] } },
    { t: 0.5, j: { torso: [0, -0.4, 0], spine: [0.3, -0.2, 0], rUpper: [-0.5, 0, -1.0], lThigh: [-0.8, 0, 0], rThigh: [-0.8, 0, 0], lShin: [1.1, 0, 0], rShin: [1.1, 0, 0] }, root: { y: 0, fwd: 0.2, pitch: 0 }, pelvisY: 0.62 },
    { t: 1, j: {} },
  ]},
  slam_backbreaker: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.9], rUpper: [-1.0, 0, -0.9], spine: [0.1, 0, 0], rThigh: [-1.2, 0, 0], rShin: [1.3, 0, 0] }, pelvisY: 0.7 },
    { t: 0.55, j: { spine: [0.2, 0, 0], lUpper: [-0.6, 0, 1.0], rUpper: [-0.6, 0, -1.0], rThigh: [-1.2, 0, 0], rShin: [1.3, 0, 0], lThigh: [-0.6, 0, 0] }, pelvisY: 0.62 },
    { t: 1, j: {} },
  ]},
  slam_chokeslam: { dur: 0.6, keys: [
    { t: 0, j: { rUpper: [-2.4, 0, -0.2], rFore: [-0.3, 0, 0], lUpper: [0.2, 0, 0.4], spine: [-0.15, 0, 0], head: [-0.2, 0, 0] }, pelvisY: 0.95 },
    { t: 0.45, j: { rUpper: [-2.0, 0, -0.2], rFore: [-0.2, 0, 0], spine: [0.35, 0, 0], lThigh: [-0.8, 0, 0], rThigh: [-0.8, 0, 0], lShin: [1.0, 0, 0], rShin: [1.0, 0, 0] }, root: { y: -0.15, fwd: 0.2, pitch: 0 }, pelvisY: 0.6 },
    { t: 1, j: { spine: [0.2, 0, 0] }, pelvisY: 0.62 },
  ]},
  slam_sidewalk: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-1.4, 0, 0.3], rUpper: [-1.0, 0, -1.1], rFore: [-0.6, 0, 0], spine: [0, -0.4, 0], torso: [0, -0.4, 0], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0] }, pelvisY: 0.72 },
    { t: 0.45, j: { spine: [0.1, 0.5, 0], torso: [0, 0.5, 0], lUpper: [-0.5, 0, 0.8], rUpper: [-0.5, 0, -0.8], lThigh: [-0.9, 0, 0], rThigh: [-0.9, 0, 0], lShin: [1.1, 0, 0], rShin: [1.1, 0, 0] }, root: { y: 0, fwd: 0.35, pitch: 0 }, pelvisY: 0.6 },
    { t: 1, j: {} },
  ]},
  slam_fallaway: { dur: 0.6, keys: [
    { t: 0, j: { lUpper: [-1.1, 0, 0.7], rUpper: [-1.1, 0, -0.7], lFore: [-0.9, 0, 0], rFore: [-0.9, 0, 0], spine: [0.35, 0, 0], lThigh: [-0.7, 0, 0], rThigh: [-0.7, 0, 0], lShin: [0.9, 0, 0], rShin: [0.9, 0, 0] }, pelvisY: 0.66 },
    { t: 0.45, j: { spine: [-0.55, 0, 0], head: [-0.4, 0, 0], lUpper: [0, 0, 2.0], rUpper: [0, 0, -2.0], lThigh: [-0.3, 0, 0], rThigh: [-0.3, 0, 0] }, root: { y: 0.15, fwd: -0.5, pitch: 0 }, pelvisY: 0.7 },
    { t: 1, j: { spine: [-0.2, 0, 0] }, pelvisY: 0.66 },
  ]},
  slam_brainbuster: { dur: 0.6, keys: [
    { t: 0, j: { lUpper: [-0.9, 0, 0.7], rUpper: [-0.9, 0, -0.7], lFore: [-1.0, 0, 0], rFore: [-1.0, 0, 0], spine: [0.2, 0, 0], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0] }, pelvisY: 0.78 },
    { t: 0.45, j: { lUpper: [0.2, 0, 2.2], rUpper: [0.2, 0, -2.2], spine: [-0.2, 0, 0], lThigh: [-1.2, 0, 0], rThigh: [-1.2, 0, 0], lShin: [1.5, 0, 0], rShin: [1.5, 0, 0] }, root: { y: -0.1, fwd: 0.2, pitch: 0 }, pelvisY: 0.52 },
    { t: 1, j: { lThigh: [-1.3, 0, 0], rThigh: [-1.3, 0, 0], spine: [0.3, 0, 0] }, pelvisY: 0.48 },
  ]},
  slam_fisherman: { dur: 0.55, keys: [
    { t: 0, j: { rUpper: [-1.2, 0, -0.6], lUpper: [-0.6, 0, 0.8], rThigh: [-1.3, 0, 0], rShin: [1.2, 0, 0], spine: [0.2, 0.3, 0], torso: [0, 0.3, 0] } },
    { t: 0.45, j: { torso: [0, -0.6, 0], spine: [-0.3, -0.3, 0], rUpper: [-0.6, 0, -1.0], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0], head: [-0.3, 0, 0] }, root: { y: 0, fwd: 0.3, pitch: 0 }, pelvisY: 0.7 },
    { t: 1, j: { spine: [0.4, 0, 0] }, pelvisY: 0.6 },
  ]},
  slam_powerslam: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-1.3, 0, 0.5], rUpper: [-1.3, 0, -0.5], lFore: [-0.7, 0, 0], rFore: [-0.7, 0, 0], spine: [0.25, 0, 0], lThigh: [-0.8, 0, 0], rThigh: [-0.8, 0, 0], lShin: [1.0, 0, 0], rShin: [1.0, 0, 0] }, pelvisY: 0.68 },
    { t: 0.45, j: { torso: [0, 0.7, 0], spine: [0.3, 0.4, 0], lUpper: [-0.6, 0, 1.0], rUpper: [-0.6, 0, -1.0], lThigh: [-1.1, 0, 0], rThigh: [-1.1, 0, 0] }, root: { y: -0.1, fwd: 0.4, pitch: 0 }, pelvisY: 0.55 },
    { t: 1, j: {} },
  ]},
  slam_sto: { dur: 0.5, keys: [
    { t: 0, j: { lUpper: [-0.9, 0, 1.0], spine: [0.1, 0.3, 0], rThigh: [-1.0, 0, 0], rShin: [1.1, 0, 0] } },
    { t: 0.45, j: { spine: [-0.4, 0, 0], torso: [0, -0.5, 0], lThigh: [-1.3, 0, 0], rThigh: [-0.4, 0, 0], lShin: [1.5, 0, 0], rShin: [0.5, 0, 0], lUpper: [0.4, 0, 0.6], rUpper: [0.4, 0, -0.6] }, root: { y: -0.15, fwd: 0.2, pitch: 0 }, pelvisY: 0.5 },
    { t: 1, j: {} },
  ]},
  slam_russian: { dur: 0.5, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.6], rUpper: [-1.0, 0, -0.6], spine: [0.15, 0, 0], rThigh: [-0.8, 0, 0.2], rShin: [0.9, 0, 0] } },
    { t: 0.45, j: { torso: [0, 0.5, 0], spine: [0.35, 0.2, 0], rThigh: [-1.6, 0, 0.3], rShin: [0.3, 0, 0], lThigh: [-0.9, 0, 0], lShin: [1.2, 0, 0], lUpper: [0.5, 0, 0.5], rUpper: [0.5, 0, -0.5] }, root: { y: -0.1, fwd: 0.3, pitch: 0 }, pelvisY: 0.58 },
    { t: 1, j: {} },
  ]},
  slam_facebuster: { dur: 0.5, keys: [
    { t: 0, j: { lUpper: [-1.2, 0, 0.6], rUpper: [-1.2, 0, -0.6], lFore: [-0.9, 0, 0], rFore: [-0.9, 0, 0], spine: [0.2, 0, 0], lThigh: [-0.4, 0, 0], rThigh: [-0.4, 0, 0] }, pelvisY: 0.8 },
    { t: 0.5, j: { spine: [0.55, 0, 0], head: [0.4, 0, 0], lThigh: [-1.2, 0, 0], rThigh: [-1.2, 0, 0], lShin: [1.4, 0, 0], rShin: [1.4, 0, 0], lUpper: [0.3, 0, 0.5], rUpper: [0.3, 0, -0.5] }, root: { y: -0.15, fwd: 0.2, pitch: 0 }, pelvisY: 0.52 },
    { t: 1, j: {} },
  ]},
  slam_tko: { dur: 0.6, keys: [
    { t: 0, j: { lUpper: [-1.5, 0, 0.4], rUpper: [-1.1, 0, -0.8], spine: [0.1, 0.3, 0], lThigh: [-0.7, 0, 0], rThigh: [-0.7, 0, 0] }, pelvisY: 0.75 },
    { t: 0.45, j: { torso: [0, -0.8, 0], spine: [0.4, -0.4, 0], lThigh: [-1.3, 0, 0], rThigh: [-1.3, 0, 0], lShin: [1.5, 0, 0], rShin: [1.5, 0, 0], rUpper: [-0.6, 0, -1.0] }, root: { y: -0.15, fwd: 0.25, pitch: 0 }, pelvisY: 0.5 },
    { t: 1, j: {} },
  ]},
  slam_stunner: { dur: 0.45, keys: [
    { t: 0, j: { lThigh: [-1.4, 0, 0], rThigh: [-1.4, 0, 0], lShin: [1.6, 0, 0], rShin: [1.6, 0, 0], spine: [0.3, 0, 0], lUpper: [-0.8, 0, 0.6], rUpper: [-0.8, 0, -0.6] }, pelvisY: 0.62 },
    { t: 0.4, j: { lThigh: [-0.9, 0, 0], rThigh: [-0.9, 0, 0], spine: [-0.3, 0, 0], head: [-0.3, 0, 0], lUpper: [-0.4, 0, 0.8], rUpper: [-0.4, 0, -0.8] }, root: { y: 0.1, fwd: -0.1, pitch: 0 }, pelvisY: 0.7 },
    { t: 1, j: {} },
  ]},
  slam_snapmare: { dur: 0.45, keys: [
    { t: 0, j: { torso: [0, 0.7, 0], spine: [0, 0.4, 0], lUpper: [-1.0, 0, 0.8], rUpper: [-1.0, 0, -0.8], head: [0, -0.4, 0] } },
    { t: 0.45, j: { torso: [0, -0.7, 0], spine: [0.2, -0.4, 0], lUpper: [-0.5, 0, 1.0], rUpper: [-0.5, 0, -1.0], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0] }, root: { y: 0, fwd: 0.3, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  slam_rack: { dur: 0.6, keys: [
    { t: 0, j: { lUpper: [0, 0, 2.6], rUpper: [0, 0, -2.6], spine: [-0.25, 0, 0], head: [-0.2, 0, 0], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0] }, pelvisY: 0.85 },
    { t: 0.45, j: { spine: [0.3, 0.5, 0], torso: [0, 0.5, 0], lThigh: [-1.2, 0, 0], rThigh: [-0.5, 0, 0], lShin: [1.4, 0, 0], rShin: [0.6, 0, 0], lUpper: [0.4, 0, 0.8], rUpper: [0.4, 0, -0.8] }, root: { y: -0.1, fwd: 0.2, pitch: 0 }, pelvisY: 0.58 },
    { t: 1, j: {} },
  ]},
  slam_tigerdriver: { dur: 0.6, keys: [
    { t: 0, j: { lUpper: [-1.1, 0, 0.3], rUpper: [-1.1, 0, -0.3], lFore: [-0.6, 0, 0], rFore: [-0.6, 0, 0], spine: [0.2, 0, 0], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0] }, pelvisY: 0.8 },
    { t: 0.5, j: { lThigh: [-1.4, 0, 0], rThigh: [-1.4, 0, 0], lShin: [1.6, 0, 0], rShin: [1.6, 0, 0], spine: [0.45, 0, 0], head: [0.3, 0, 0], lUpper: [0.5, 0, 0.4], rUpper: [0.5, 0, -0.4] }, root: { y: -0.15, fwd: 0.15, pitch: 0 }, pelvisY: 0.48 },
    { t: 1, j: {} },
  ]},
  slam_backdrop: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-1.3, 0, 0.5], rUpper: [-1.3, 0, -0.5], lFore: [-0.8, 0, 0], rFore: [-0.8, 0, 0], spine: [0.3, 0, 0], lThigh: [-0.9, 0, 0], rThigh: [-0.9, 0, 0], lShin: [1.1, 0, 0], rShin: [1.1, 0, 0] }, pelvisY: 0.64 },
    { t: 0.45, j: { spine: [-0.5, 0, 0], head: [-0.4, 0, 0], lUpper: [0, 0, 2.2], rUpper: [0, 0, -2.2], lThigh: [-0.4, 0, 0], rThigh: [-0.4, 0, 0] }, root: { y: 0.2, fwd: -0.4, pitch: 0 }, pelvisY: 0.72 },
    { t: 1, j: { spine: [-0.2, 0, 0] }, pelvisY: 0.7 },
  ]},
  slam_fullnelson: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-1.4, 0, 0.2], rUpper: [-1.4, 0, -0.2], lFore: [-1.2, 0, 0], rFore: [-1.2, 0, 0], spine: [0.25, 0, 0], head: [0.2, 0, 0] }, pelvisY: 0.78 },
    { t: 0.45, j: { spine: [0.5, 0, 0], torso: [0, 0.3, 0], lThigh: [-1.0, 0, 0], rThigh: [-1.0, 0, 0], lShin: [1.2, 0, 0], rShin: [1.2, 0, 0], lUpper: [-0.6, 0, 0.7], rUpper: [-0.6, 0, -0.7] }, root: { y: -0.1, fwd: 0.35, pitch: 0 }, pelvisY: 0.58 },
    { t: 1, j: {} },
  ]},
  slam_reverseddt: { dur: 0.5, keys: [
    { t: 0, j: { torso: [0, -0.6, 0], spine: [0, -0.3, 0], lUpper: [-0.9, 0, 0.9], rUpper: [-0.9, 0, -0.5] } },
    { t: 0.45, j: { torso: [0, 0.5, 0], spine: [-0.4, 0.3, 0], head: [-0.3, 0, 0], lThigh: [-0.8, 0, 0], rThigh: [-0.8, 0, 0], lShin: [1.0, 0, 0], rShin: [1.0, 0, 0] }, root: { y: 0, fwd: 0.3, pitch: 0 }, pelvisY: 0.68 },
    { t: 1, j: {} },
  ]},
  slam_schoolboy: { dur: 0.45, keys: [
    { t: 0, j: { spine: [0.4, 0, 0], lThigh: [-1.5, 0, 0], rThigh: [-1.5, 0, 0], lShin: [1.6, 0, 0], rShin: [1.6, 0, 0], lUpper: [0.6, 0, 0.5], rUpper: [0.6, 0, -0.5] }, pelvisY: 0.55 },
    { t: 0.5, j: { torso: [0, 0.6, 0], spine: [0.5, 0.3, 0], lThigh: [-1.8, 0, 0.2], rThigh: [-1.2, 0, -0.2], lUpper: [-0.8, 0, 0.7], rUpper: [-0.8, 0, -0.7] }, root: { y: -0.1, fwd: 0.3, pitch: 0 }, pelvisY: 0.5 },
    { t: 1, j: {} },
  ]},
  slam_tigersuplex: { dur: 0.55, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.4], rUpper: [-1.0, 0, -0.4], lFore: [-0.7, 0, 0], rFore: [-0.7, 0, 0], spine: [0.3, 0, 0], lThigh: [-0.4, 0, 0], rThigh: [-0.4, 0, 0] }, pelvisY: 0.76 },
    { t: 0.5, j: { spine: [-0.7, 0, 0], head: [-0.5, 0, 0], lUpper: [-0.4, 0, 1.2], rUpper: [-0.4, 0, -1.2], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0] }, root: { y: 0.15, fwd: -0.25, pitch: 0 }, pelvisY: 0.66 },
    { t: 1, j: { spine: [-0.6, 0, 0], head: [-0.4, 0, 0] }, pelvisY: 0.62 },
  ]},
  slam_legdrop: { dur: 0.55, keys: [
    { t: 0, j: { rThigh: [-1.7, 0, 0.2], rShin: [0.3, 0, 0], spine: [-0.3, 0, 0], lUpper: [0.6, 0, 0.7], rUpper: [0.6, 0, -0.7], lThigh: [-0.4, 0, 0] }, root: { y: 0.25, fwd: 0, pitch: 0 }, pelvisY: 1.0 },
    { t: 0.5, j: { rThigh: [-0.6, 0, 0.1], rShin: [0.2, 0, 0], spine: [0.5, 0, 0], torso: [0, 0.3, 0], lThigh: [-1.1, 0, 0], rThigh: [-0.6, 0, 0], lShin: [1.3, 0, 0] }, root: { y: -0.15, fwd: 0.15, pitch: 0 }, pelvisY: 0.55 },
    { t: 1, j: {} },
  ]},
  slam_senton: { dur: 0.55, keys: [
    { t: 0, j: { spine: [-0.4, 0, 0], head: [-0.3, 0, 0], lUpper: [0, 0, 2.2], rUpper: [0, 0, -2.2], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0] }, root: { y: 0.2, fwd: 0, pitch: 0 }, pelvisY: 0.95 },
    { t: 0.5, j: { spine: [0.3, 0, 0], lThigh: [-1.2, 0, 0], rThigh: [-1.2, 0, 0], lShin: [1.4, 0, 0], rShin: [1.4, 0, 0], lUpper: [0.5, 0, 0.6], rUpper: [0.5, 0, -0.6] }, root: { y: -0.15, fwd: 0.1, pitch: 0 }, pelvisY: 0.55 },
    { t: 1, j: {} },
  ]},
  slam_soccerkick: { dur: 0.45, keys: [
    { t: 0, j: { rThigh: [0.8, 0, 0], rShin: [1.8, 0, 0], spine: [0.1, 0, 0], lUpper: [0.4, 0, 0.5], rUpper: [0.4, 0, -0.5] } },
    { t: 0.4, j: { rThigh: [-1.2, 0, 0], rShin: [0.2, 0, 0], spine: [0.3, 0, 0], torso: [0, -0.3, 0], lThigh: [-0.3, 0, 0] }, root: { y: 0, fwd: 0.3, pitch: 0 } },
    { t: 1, j: {} },
  ]},
  slam_headdrop: { dur: 0.5, keys: [
    { t: 0, j: { head: [-0.5, 0, 0], spine: [-0.3, 0, 0], lUpper: [0, 0, 1.5], rUpper: [0, 0, -1.5], lThigh: [-0.8, 0, 0], rThigh: [-0.8, 0, 0] }, root: { y: 0.2, fwd: 0, pitch: 0 }, pelvisY: 0.9 },
    { t: 0.5, j: { head: [0.6, 0, 0], spine: [0.4, 0, 0], lThigh: [-1.1, 0, 0], rThigh: [-1.1, 0, 0], lShin: [1.3, 0, 0], rShin: [1.3, 0, 0] }, root: { y: -0.15, fwd: 0.1, pitch: 0 }, pelvisY: 0.55 },
    { t: 1, j: {} },
  ]},
  slam_tombstone: { dur: 0.6, keys: [
    { t: 0, j: { lUpper: [-1.4, 0, 0.4], rUpper: [-1.4, 0, -0.4], lFore: [-0.4, 0, 0], rFore: [-0.4, 0, 0], spine: [0.15, 0, 0], head: [0.2, 0, 0] }, pelvisY: 0.88 },
    { t: 0.5, j: { lThigh: [-1.5, 0, 0], rThigh: [-1.5, 0, 0], lShin: [1.7, 0, 0], rShin: [1.7, 0, 0], spine: [0.4, 0, 0], head: [0.35, 0, 0], lUpper: [0.4, 0, 0.5], rUpper: [0.4, 0, -0.5] }, root: { y: -0.2, fwd: 0.1, pitch: 0 }, pelvisY: 0.45 },
    { t: 1, j: {} },
  ]},
  // ---------------- LIFTS (attacker hoists victim — phase 2 of 3) ----------------
  // Each lift ends holding the victim's weight: arms up, knees bent, back arched.
  lift_suplex: { dur: 0.4, keys: [
    { t: 0, j: { lUpper: [-0.8, 0, 0.6], rUpper: [-0.8, 0, -0.6], lFore: [-1.0, 0, 0], rFore: [-1.0, 0, 0], spine: [0.25, 0, 0], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0], lShin: [0.7, 0, 0], rShin: [0.7, 0, 0] }, pelvisY: 0.8 },
    { t: 0.6, j: { lUpper: [-1.6, 0, 0.9], rUpper: [-1.6, 0, -0.9], lFore: [-0.4, 0, 0], rFore: [-0.4, 0, 0], spine: [-0.2, 0, 0], head: [-0.25, 0, 0] }, pelvisY: 0.92 },
    { t: 1, j: { lUpper: [0, 0, 2.6], rUpper: [0, 0, -2.6], spine: [-0.35, 0, 0] }, pelvisY: 0.85 },
  ]},
  lift_powerbomb: { dur: 0.45, keys: [
    { t: 0, j: { lThigh: [-1.1, 0, 0], rThigh: [-1.1, 0, 0], lShin: [1.3, 0, 0], rShin: [1.3, 0, 0], spine: [0.45, 0, 0], lUpper: [-1.0, 0, 0.6], rUpper: [-1.0, 0, -0.6] }, pelvisY: 0.6 },
    { t: 0.6, j: { lUpper: [-1.4, 0, 1.0], rUpper: [-1.4, 0, -1.0], spine: [0.1, 0, 0], head: [0.2, 0, 0] }, pelvisY: 0.78 },
    { t: 1, j: { lUpper: [0, 0, 2.4], rUpper: [0, 0, -2.4], spine: [-0.25, 0, 0], head: [-0.3, 0, 0], lThigh: [-0.4, 0, 0], rThigh: [-0.4, 0, 0] }, pelvisY: 0.8 },
  ]},
  lift_piledriver: { dur: 0.45, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.7], rUpper: [-1.0, 0, -0.7], spine: [0.3, 0, 0], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0] }, pelvisY: 0.72 },
    { t: 0.6, j: { lUpper: [-1.5, 0, 0.6], rUpper: [-1.5, 0, -0.6], lFore: [-0.5, 0, 0], rFore: [-0.5, 0, 0], spine: [0.15, 0, 0] }, pelvisY: 0.85 },
    { t: 1, j: { lUpper: [-1.3, 0, 0.5], rUpper: [-1.3, 0, -0.5], spine: [0.2, 0, 0] }, pelvisY: 0.88 },
  ]},
  lift_ddt: { dur: 0.35, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.7], rUpper: [-1.0, 0, -0.7], lFore: [-0.8, 0, 0], rFore: [-0.8, 0, 0], spine: [0.2, 0, 0], head: [0.25, 0, 0] } },
    { t: 0.6, j: { lUpper: [-1.2, 0, 0.5], rUpper: [-1.2, 0, -0.5], spine: [0.35, 0, 0], head: [0.35, 0, 0], lThigh: [0.2, 0, 0], rThigh: [-0.4, 0, 0] } },
    { t: 1, j: { lUpper: [-0.9, 0, 0.6], rUpper: [-0.9, 0, -0.6], spine: [0.3, 0, 0] } },
  ]},
  lift_german: { dur: 0.4, keys: [
    { t: 0, j: { lUpper: [-0.9, 0, 0.9], rUpper: [-0.9, 0, -0.9], lFore: [-1.0, 0, 0], rFore: [-1.0, 0, 0], spine: [0.3, 0, 0], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0], lShin: [0.6, 0, 0], rShin: [0.6, 0, 0] }, pelvisY: 0.75 },
    { t: 0.6, j: { spine: [-0.3, 0, 0], head: [-0.3, 0, 0], lUpper: [-0.6, 0, 1.1], rUpper: [-0.6, 0, -1.1] }, pelvisY: 0.8 },
    { t: 1, j: { spine: [-0.5, 0, 0], head: [-0.35, 0, 0] }, pelvisY: 0.78 },
  ]},
  lift_rana: { dur: 0.35, keys: [
    { t: 0, j: { lThigh: [-1.3, 0, 0.3], rThigh: [-1.3, 0, -0.3], lShin: [1.3, 0, 0], rShin: [1.3, 0, 0], spine: [0.3, 0, 0], lUpper: [-0.4, 0, 1.0], rUpper: [-0.4, 0, -1.0] }, pelvisY: 0.7 },
    { t: 0.6, j: { lThigh: [-1.5, 0, 0.3], rThigh: [-1.5, 0, -0.3], lShin: [1.4, 0, 0], rShin: [1.4, 0, 0], spine: [-0.15, 0, 0], lUpper: [0, 0, 1.4], rUpper: [0, 0, -1.4] }, root: { y: 0.4, fwd: 0.15, pitch: 0 }, pelvisY: 0.95 },
    { t: 1, j: { spine: [-0.1, 0, 0] }, pelvisY: 0.9 },
  ]},
  lift_spinebuster: { dur: 0.4, keys: [
    { t: 0, j: { lUpper: [-1.2, 0, 0.6], rUpper: [-1.2, 0, -0.6], lFore: [-0.8, 0, 0], rFore: [-0.8, 0, 0], spine: [0.2, 0, 0], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0], lShin: [0.8, 0, 0], rShin: [0.8, 0, 0] }, pelvisY: 0.7 },
    { t: 0.6, j: { lUpper: [-1.0, 0, 0.9], rUpper: [-1.0, 0, -0.9], spine: [-0.1, 0, 0], lThigh: [-0.3, 0, 0], rThigh: [-0.3, 0, 0] }, pelvisY: 0.85 },
    { t: 1, j: { spine: [0, 0.3, 0], torso: [0, 0.3, 0] }, pelvisY: 0.82 },
  ]},
  lift_slam: { dur: 0.4, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.8], rUpper: [-1.0, 0, -0.8], lFore: [-0.7, 0, 0], rFore: [-0.7, 0, 0], spine: [0.2, 0, 0], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0] }, pelvisY: 0.72 },
    { t: 0.6, j: { lUpper: [-1.3, 0, 1.0], rUpper: [-1.3, 0, -1.0], spine: [-0.1, 0, 0], head: [-0.2, 0, 0] }, pelvisY: 0.88 },
    { t: 1, j: { lUpper: [0, 0, 2.2], rUpper: [0, 0, -2.2], spine: [-0.25, 0, 0] }, pelvisY: 0.85 },
  ]},
  lift_neckbreaker: { dur: 0.35, keys: [
    { t: 0, j: { torso: [0, 0.5, 0], spine: [0, 0.3, 0], lUpper: [-0.8, 0, 1.0], rUpper: [-0.8, 0, -0.4] } },
    { t: 0.6, j: { torso: [0, 0.2, 0], rUpper: [-0.9, 0, -0.8], spine: [0, 0.1, 0] } },
    { t: 1, j: { torso: [0, -0.2, 0], spine: [0.15, -0.1, 0] } },
  ]},
  lift_backbreaker: { dur: 0.4, keys: [
    { t: 0, j: { lUpper: [-1.0, 0, 0.9], rUpper: [-1.0, 0, -0.9], spine: [0.15, 0, 0], rThigh: [-0.9, 0, 0], rShin: [1.0, 0, 0] }, pelvisY: 0.72 },
    { t: 0.6, j: { lUpper: [-0.7, 0, 1.0], rUpper: [-0.7, 0, -1.0], spine: [0, 0, 0], rThigh: [-1.2, 0, 0], rShin: [1.3, 0, 0] }, pelvisY: 0.62 },
    { t: 1, j: { rThigh: [-1.2, 0, 0], rShin: [1.3, 0, 0] }, pelvisY: 0.62 },
  ]},
  // ---------------- HOISTS (victim rides the attacker — phase 2 of 3) ----------------
  // Victim root offsets are applied relative to the ATTACKER (carrier anchor),
  // not the victim's own facing — see stepFighter carried handling.
  hoist_overhead: { dur: 0.4, carry: 'overhead', keys: [
    { t: 0, j: { lUpper: [-0.8, 0, 1.2], rUpper: [-0.8, 0, -1.2], lThigh: [-0.3, 0, 0.1], rThigh: [-0.3, 0, -0.1] } },
    { t: 0.6, j: { spine: [-0.3, 0, 0], head: [-0.4, 0, 0], lUpper: [0, 0, 2.4], rUpper: [0, 0, -2.4], lThigh: [-0.5, 0, 0.2], rThigh: [-0.5, 0, -0.2], lShin: [0.6, 0, 0], rShin: [0.6, 0, 0] } },
    { t: 1, j: { spine: [-0.35, 0, 0], head: [-0.4, 0, 0] } },
  ]},
  hoist_shoulders: { dur: 0.45, carry: 'shoulders', keys: [
    { t: 0, j: { lThigh: [-1.2, 0, 0.4], rThigh: [-1.2, 0, -0.4], lShin: [1.3, 0, 0], rShin: [1.3, 0, 0], lUpper: [-0.5, 0, 1.0], rUpper: [-0.5, 0, -1.0], spine: [0.1, 0, 0] } },
    { t: 0.6, j: { lThigh: [-1.0, 0, 0.45], rThigh: [-1.0, 0, -0.45], lUpper: [-0.4, 0, 1.1], rUpper: [-0.4, 0, -1.1] } },
    { t: 1, j: { spine: [0.15, 0, 0], head: [0.2, 0, 0] } },
  ]},
  hoist_inverted: { dur: 0.45, carry: 'inverted', keys: [
    { t: 0, j: { lUpper: [0.5, 0, 0.8], rUpper: [0.5, 0, -0.8], lThigh: [-0.4, 0, 0.2], rThigh: [-0.4, 0, -0.2], lShin: [0.5, 0, 0], rShin: [0.5, 0, 0], head: [0.3, 0, 0] } },
    { t: 0.6, j: { lThigh: [-0.3, 0, 0.3], rThigh: [-0.3, 0, -0.3], head: [0.4, 0, 0] } },
    { t: 1, j: { lUpper: [0.6, 0, 0.9], rUpper: [0.6, 0, -0.9] } },
  ]},
  hoist_facelock: { dur: 0.35, carry: 'facelock', keys: [
    { t: 0, j: { head: [0.5, 0, 0], spine: [0.3, 0, 0], lUpper: [-0.7, 0, 0.6], rUpper: [-0.7, 0, -0.6] } },
    { t: 0.6, j: { head: [0.7, 0, 0.1], spine: [0.45, 0, 0], lUpper: [-0.5, 0, 0.8], rUpper: [-0.5, 0, -0.8] } },
    { t: 1, j: { head: [0.8, 0, 0], spine: [0.5, 0, 0] } },
  ]},
  hoist_back: { dur: 0.4, carry: 'back', keys: [
    { t: 0, j: { spine: [-0.5, 0, 0], head: [-0.4, 0, 0], lUpper: [0, 0, 1.6], rUpper: [0, 0, -1.6], lThigh: [-0.4, 0, 0], rThigh: [-0.4, 0, 0] } },
    { t: 0.6, j: { spine: [-0.7, 0, 0], head: [-0.5, 0, 0], lUpper: [0, 0, 1.8], rUpper: [0, 0, -1.8], lThigh: [-0.5, 0, 0], rThigh: [-0.5, 0, 0] } },
    { t: 1, j: { spine: [-0.7, 0, 0] } },
  ]},
  hoist_legs: { dur: 0.35, carry: 'legs', keys: [
    { t: 0, j: { lThigh: [-1.2, 0, 0.4], rThigh: [-1.2, 0, -0.4], lUpper: [0, 0, 1.5], rUpper: [0, 0, -1.5] } },
    { t: 0.6, j: { lThigh: [-1.0, 0, 0.4], rThigh: [-1.0, 0, -0.4], spine: [0.2, 0, 0], head: [0.3, 0, 0] } },
    { t: 1, j: {} },
  ]},
  // ---------------- SELLS (victim) ----------------
  sold_strike: { dur: 0.35, keys: [
    { t: 0, j: {} },
    { t: 0.35, j: { head: [0.5, 0.4, 0], torso: [0.3, 0.5, 0], spine: [0.3, 0.2, 0], lUpper: [-0.3, 0, 0.9], rUpper: [-0.3, 0, -0.4], rFore: [-0.6, 0, 0] }, root: { y: 0, fwd: -0.25, pitch: 0 } },
    { t: 1, j: { head: [0.2, 0.2, 0], torso: [0.15, 0.25, 0] }, root: { y: 0, fwd: -0.1, pitch: 0 } },
  ]},
  sold_big: { dur: 0.5, keys: [
    { t: 0, j: {} },
    { t: 0.35, j: { head: [0.6, 0.5, 0.2], torso: [0.4, 0.6, 0], spine: [0.4, 0.3, 0], lUpper: [-0.5, 0, 2.0], rUpper: [-0.5, 0, -2.0], lThigh: [0.3, 0, 0.2], rThigh: [-0.3, 0, -0.2] }, root: { y: 0.1, fwd: -0.6, pitch: -0.3 } },
    { t: 1, j: { head: [0.3, 0.2, 0], spine: [0.2, 0.1, 0] }, root: { y: 0, fwd: -0.3, pitch: 0 } },
  ]},
  sold_suplex: { dur: 0.9, keys: [
    { t: 0, j: { lUpper: [-0.8, 0, 1.2], rUpper: [-0.8, 0, -1.2], lThigh: [-0.3, 0, 0.1], rThigh: [-0.3, 0, -0.1] } },
    { t: 0.5, j: { spine: [-0.3, 0, 0], head: [-0.4, 0, 0], lUpper: [0, 0, 2.4], rUpper: [0, 0, -2.4], lThigh: [-0.5, 0, 0.2], rThigh: [-0.5, 0, -0.2], lShin: [0.6, 0, 0], rShin: [0.6, 0, 0] }, root: { y: 1.6, fwd: 0, pitch: -2.4 } },
    { t: 1, j: { lUpper: [-0.4, 0, 1.15], rUpper: [-0.4, 0, -1.15], lThigh: [0.15, 0, 0.12], rThigh: [0.15, 0, -0.12] }, root: { y: 0.1, fwd: 0.2, pitch: -3.1 } },
  ]},
  sold_powerbomb: { dur: 0.9, keys: [
    { t: 0, j: { lThigh: [-1.2, 0, 0.4], rThigh: [-1.2, 0, -0.4], lShin: [1.3, 0, 0], rShin: [1.3, 0, 0], lUpper: [-0.5, 0, 1.0], rUpper: [-0.5, 0, -1.0], spine: [0.1, 0, 0] }, root: { y: 1.9, fwd: 0, pitch: -0.3 } },
    { t: 0.55, j: { lUpper: [-0.4, 0, 1.15], rUpper: [-0.4, 0, -1.15], lThigh: [0.15, 0, 0.12], rThigh: [0.15, 0, -0.12], spine: [0.12, 0, 0], head: [0.45, 0, 0.25] }, root: { y: 0.1, fwd: 0, pitch: -3.0 } },
    { t: 1, j: {} },
  ]},
  sold_piledriver: { dur: 0.9, keys: [
    { t: 0, j: { lUpper: [0.5, 0, 0.8], rUpper: [0.5, 0, -0.8], lThigh: [-0.4, 0, 0.2], rThigh: [-0.4, 0, -0.2], lShin: [0.5, 0, 0], rShin: [0.5, 0, 0], head: [0.3, 0, 0] }, root: { y: 1.9, fwd: 0, pitch: 3.0 } },
    { t: 0.55, j: { lUpper: [-0.4, 0, 1.0], rUpper: [-0.4, 0, -1.0] }, root: { y: 0.3, fwd: 0, pitch: 3.1 } },
    { t: 1, j: {} },
  ]},
  sold_ddt: { dur: 0.7, keys: [
    { t: 0, j: { head: [0.8, 0, 0], spine: [0.5, 0, 0], lUpper: [-0.7, 0, 0.6], rUpper: [-0.7, 0, -0.6] } },
    { t: 0.4, j: { head: [0.6, 0, 0.2], spine: [0.3, 0, 0], lUpper: [-0.4, 0, 1.15], rUpper: [-0.4, 0, -1.15], lThigh: [0.15, 0, 0.12], rThigh: [0.15, 0, -0.12] }, root: { y: 0.15, fwd: 0.1, pitch: -0.5 } },
    { t: 1, j: {} },
  ]},
  sold_german: { dur: 0.9, keys: [
    { t: 0, j: { spine: [-0.8, 0, 0], head: [-0.6, 0, 0], lUpper: [0, 0, 1.8], rUpper: [0, 0, -1.8], lThigh: [-0.6, 0, 0], rThigh: [-0.6, 0, 0] }, root: { y: 1.0, fwd: -0.3, pitch: -1.2 } },
    { t: 0.55, j: { spine: [0.1, 0, 0], head: [0.45, 0, 0.25], lUpper: [-0.4, 0, 1.15], rUpper: [-0.4, 0, -1.15] }, root: { y: 0.15, fwd: -0.2, pitch: -2.8 } },
    { t: 1, j: {} },
  ]},
  sold_rana: { dur: 0.8, keys: [
    { t: 0, j: { lThigh: [-1.2, 0, 0.4], rThigh: [-1.2, 0, -0.4], lUpper: [0, 0, 1.5], rUpper: [0, 0, -1.5] }, root: { y: 0.8, fwd: 0, pitch: -1.0 } },
    { t: 0.5, j: { lThigh: [-0.6, 0, 0.2], rThigh: [-0.6, 0, -0.2] }, root: { y: 0.9, fwd: 0, pitch: -3.4 } },
    { t: 1, j: { head: [0.45, 0, 0.25] }, root: { y: 0.1, fwd: 0, pitch: -3.1 } },
  ]},
  sold_spinebuster: { dur: 0.85, keys: [
    { t: 0, j: { spine: [0.1, 0, 0], lUpper: [-0.6, 0, 0.8], rUpper: [-0.6, 0, -0.8], lThigh: [0.1, 0, 0.1], rThigh: [0.1, 0, -0.1], head: [0.2, 0, 0] }, root: { y: 1.0, fwd: 0, pitch: -1.5 } },
    { t: 0.55, j: { lUpper: [-0.4, 0, 1.15], rUpper: [-0.4, 0, -1.15], spine: [0.12, 0, 0], head: [0.45, 0, 0.25] }, root: { y: 0.1, fwd: 0, pitch: -3.05 } },
    { t: 1, j: {} },
  ]},
  sold_slam: { dur: 0.85, keys: [
    { t: 0, j: { lUpper: [-0.5, 0, 1.2], rUpper: [-0.5, 0, -1.2], lThigh: [-0.3, 0, 0.2], rThigh: [-0.3, 0, -0.2], spine: [-0.2, 0, 0] }, root: { y: 1.1, fwd: 0, pitch: -0.6 } },
    { t: 0.55, j: { lUpper: [-0.4, 0, 1.15], rUpper: [-0.4, 0, -1.15], spine: [0.12, 0, 0], head: [0.45, 0, 0.25] }, root: { y: 0.1, fwd: 0, pitch: -3.0 } },
    { t: 1, j: {} },
  ]},
  sold_neckbreaker: { dur: 0.75, keys: [
    { t: 0, j: { torso: [0, -0.6, 0], head: [-0.5, 0, 0], lUpper: [0, 0, 1.5], rUpper: [0, 0, -1.5] }, root: { y: 0.5, fwd: 0, pitch: -0.4 } },
    { t: 0.5, j: { head: [0.6, 0, 0.3], spine: [0.3, 0, 0], lUpper: [-0.4, 0, 1.15], rUpper: [-0.4, 0, -1.15] }, root: { y: 0.2, fwd: 0, pitch: -0.8 } },
    { t: 1, j: {} },
  ]},
  sold_backbreaker: { dur: 0.8, keys: [
    { t: 0, j: { spine: [-0.9, 0, 0], head: [-0.5, 0, 0], lUpper: [0, 0, 1.6], rUpper: [0, 0, -1.6], lThigh: [-0.3, 0, 0.2], rThigh: [-0.3, 0, -0.2] }, root: { y: 0.6, fwd: 0, pitch: -0.5 } },
    { t: 0.55, j: { lUpper: [-0.4, 0, 1.15], rUpper: [-0.4, 0, -1.15], spine: [0.12, 0, 0] }, root: { y: 0.15, fwd: 0, pitch: -2.9 } },
    { t: 1, j: {} },
  ]},
};

export function slamClipFor(anim) {
  return CLIPS['slam_' + anim] ? 'slam_' + anim : 'slam_slam';
}
export function liftClipFor(anim) {
  return CLIPS['lift_' + anim] ? 'lift_' + anim : 'lift_slam';
}
// victim carry anchor per move: where the body rides during the LIFT phase
export function hoistClipFor(anim) {
  const map = {
    suplex: 'hoist_overhead',
    powerbomb: 'hoist_shoulders',
    piledriver: 'hoist_inverted',
    ddt: 'hoist_facelock',
    german: 'hoist_back',
    hurricanrana: 'hoist_legs',
    spinebuster: 'hoist_overhead',
    slam: 'hoist_overhead',
    neckbreaker: 'hoist_facelock',
    backbreaker: 'hoist_back',
  };
  const name = map[anim] || 'hoist_overhead';
  return CLIPS[name] ? name : 'hoist_overhead';
}
// attacker-relative carry anchors: [sideways, height, forward] in attacker space
export const CARRY_ANCHORS = {
  overhead: [0, 2.1, 0.1],
  shoulders: [0, 1.9, 0],
  inverted: [0, 1.8, 0.15],
  facelock: [0, 1.0, 0.45],
  back: [0, 1.2, -0.4],
  legs: [0, 1.3, 0.3],
};
export function soldClipFor(anim) {
  return CLIPS['sold_' + anim] ? 'sold_' + anim : 'sold_slam';
}
export function strikeClipFor(anim) {
  const map = { punch: 'strike_jab', chop: 'strike_chop', elbow: 'strike_elbow', kick: 'strike_kick', superkick: 'strike_superkick', clothesline: 'strike_clothesline', dropkick: 'strike_dropkick', uppercut: 'strike_uppercut', headbutt: 'strike_headbutt', knee: 'strike_knee', bigboot: 'strike_bigboot', axehandle: 'strike_axehandle', enzuigiri: 'strike_enzuigiri', discus: 'strike_discus', spear: 'strike_spear', flyingforearm: 'strike_flyingforearm' };
  return map[anim] || 'strike_jab';
}

// Sample a clip onto part targets. Returns true while active.
export function sampleClip(f, P, dt) {
  const C = CLIPS[f.clip];
  if (!C) { f.clip = null; return false; }
  f.clipT = (f.clipT || 0) + dt;
  const pr = Math.max(0, Math.min(1, f.clipT / C.dur));
  const keys = C.keys;
  let i = 0;
  while (i < keys.length - 2 && pr > keys[i + 1].t) i++;
  const k0 = keys[i], k1 = keys[i + 1];
  const span = Math.max(1e-5, k1.t - k0.t);
  let e = (pr - k0.t) / span; e = Math.max(0, Math.min(1, e));
  e = e * e * (3 - 2 * e);
  const joints = new Set([...Object.keys(k0.j || {}), ...Object.keys(k1.j || {})]);
  for (const jn of joints) {
    const o = P[jn];
    if (!o) continue;
    const a = (k0.j && k0.j[jn]) || [o.rotation.x, o.rotation.y, o.rotation.z];
    const b = (k1.j && k1.j[jn]) || a;
    o.rotation.set(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e);
  }
  const r0 = k0.root || {}, r1 = k1.root || {};
  const y = (r0.y || 0) + ((r1.y || 0) - (r0.y || 0)) * e;
  const fw = (r0.fwd || 0) + ((r1.fwd || 0) - (r0.fwd || 0)) * e;
  const pi = (r0.pitch || 0) + ((r1.pitch || 0) - (r0.pitch || 0)) * e;
  P.group.position.y = f.pos.y + y;
  P.group.position.x = f.pos.x + Math.sin(f.facing) * fw;
  P.group.position.z = f.pos.z + Math.cos(f.facing) * fw;
  P.group.rotation.x = pi;
  // crossfade: ease joints from the snapshot pose into the clip over BLEND_T
  if (f._blendFrom) {
    if (f.clipT >= BLEND_T) f._blendFrom = null;
    else {
      let be = Math.max(0, Math.min(1, f.clipT / BLEND_T));
      be = be * be * (3 - 2 * be);
      for (const jn of Object.keys(f._blendFrom)) {
        const o = P[jn];
        if (!o) continue;
        const a = f._blendFrom[jn];
        o.rotation.set(a[0] + (o.rotation.x - a[0]) * be, a[1] + (o.rotation.y - a[1]) * be, a[2] + (o.rotation.z - a[2]) * be);
      }
    }
  }
  if (k0.pelvisY !== undefined || k1.pelvisY !== undefined) {
    const HH = f.def.height || 1;
    const p0 = k0.pelvisY !== undefined ? k0.pelvisY : 0.97;
    const p1 = k1.pelvisY !== undefined ? k1.pelvisY : p0;
    P.pelvis.position.y = (p0 + (p1 - p0) * e) * HH;
  }
  if (f.clipT >= C.dur) f.clip = null;
  return true;
}

export const BLEND_T = 0.18; // crossfade duration (VPG AnimationController blendDuration)
const BLEND_JOINTS = ['pelvis', 'spine', 'torso', 'head', 'lUpper', 'rUpper', 'lFore', 'rFore', 'lHand', 'rHand', 'lThigh', 'rThigh', 'lShin', 'rShin', 'lFoot', 'rFoot'];
export function playClip(f, name) {
  // snapshot the current pose so sampleClip can crossfade into the new clip
  // (VPG: weight ramp on the incoming AnimationGroup). Always restarts,
  // which is also how VPG replays repeated strikes.
  const P = f.parts;
  if (P) {
    const snap = {};
    for (const jn of BLEND_JOINTS) {
      const o = P[jn];
      if (o) snap[jn] = [o.rotation.x, o.rotation.y, o.rotation.z];
    }
    f._blendFrom = snap;
  } else f._blendFrom = null;
  f.clip = name;
  f.clipT = 0;
}
