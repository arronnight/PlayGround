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
export function soldClipFor(anim) {
  return CLIPS['sold_' + anim] ? 'sold_' + anim : 'sold_slam';
}
export function strikeClipFor(anim) {
  const map = { punch: 'strike_jab', chop: 'strike_chop', elbow: 'strike_elbow', kick: 'strike_kick', superkick: 'strike_superkick', clothesline: 'strike_clothesline', dropkick: 'strike_dropkick' };
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
  if (k0.pelvisY !== undefined || k1.pelvisY !== undefined) {
    const HH = f.def.height || 1;
    const p0 = k0.pelvisY !== undefined ? k0.pelvisY : 0.97;
    const p1 = k1.pelvisY !== undefined ? k1.pelvisY : p0;
    P.pelvis.position.y = (p0 + (p1 - p0) * e) * HH;
  }
  if (f.clipT >= C.dur) f.clip = null;
  return true;
}

export function playClip(f, name) {
  f.clip = name;
  f.clipT = 0;
}
