import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { clamp, lerp, damp, pick } from './utils.js';
import { resolveOBB, standingSurface } from './physics.js';

// ---------- vehicle catalogue (profile = side silhouette, x = length axis, y = height) ----------
// Original parody roster: every entry has its own silhouette + trim. `cls` drives the
// type-specific detailing (muscle scoop/pipes, lowrider chrome, cabrio open top, ...).
// Flags: cop (police logic + siren), taxi (traffic filter), ems ('amb' | 'fire'), open (no roof).
export const VEHICLE_TYPES = {
  // ----- sedans & coupes -----
  sedan:  { len: 4.5, wid: 1.85, mass: 1300, maxSpeed: 38, accel: 9, brake: 22, grip: 7.5, steer: 0.55, wheelR: 0.34, cls: 'sedan', colors: [0xc0392b, 0x2980b9, 0xecf0f1, 0x2c3e50, 0x7f8c8d, 0x27ae60, 0x8e44ad, 0xf39c12, 0x1a1a1a, 0xd35400],
    profile: [[-2.25, 0.3], [-2.25, 0.78], [-1.85, 0.84], [-1.35, 0.86], [-0.85, 1.36], [0.55, 1.4], [1.25, 0.96], [2.05, 0.86], [2.25, 0.55], [2.25, 0.3]], cabin: [[-1.35, 0.86], [-0.85, 1.36], [0.55, 1.4], [1.25, 0.96]] },
  executive: { base: 'sedan', len: 4.9, maxSpeed: 41, accel: 9.5, mass: 1550, cls: 'sedan', colors: [0x1a1a1a, 0x2c3e50, 0xecf0f1, 0x5d4037, 0x0b1a3a],
    profile: [[-2.45, 0.3], [-2.45, 0.78], [-2.0, 0.84], [-1.4, 0.86], [-0.9, 1.34], [0.7, 1.38], [1.5, 0.94], [2.25, 0.84], [2.45, 0.55], [2.45, 0.3]], cabin: [[-1.4, 0.86], [-0.9, 1.34], [0.7, 1.38], [1.5, 0.94]] },
  reverie: { len: 4.4, wid: 1.9, mass: 1350, maxSpeed: 44, accel: 11, brake: 24, grip: 8.2, steer: 0.53, wheelR: 0.33, cls: 'coupe', colors: [0xff2d2d, 0x111111, 0xecf0f1, 0x2980b9, 0x8e44ad, 0xf39c12],
    profile: [[-2.2, 0.32], [-2.2, 0.72], [-1.8, 0.8], [-1.0, 0.84], [-0.4, 1.28], [0.5, 1.3], [1.2, 0.9], [2.0, 0.8], [2.2, 0.5], [2.2, 0.32]], cabin: [[-1.0, 0.84], [-0.4, 1.28], [0.5, 1.3], [1.2, 0.9]] },
  seraph:  { base: 'reverie', len: 4.6, maxSpeed: 47, accel: 12, mass: 1450, cls: 'coupe', colors: [0x0b1a3a, 0x5d4037, 0xc0c0c0, 0x1a1a1a, 0x7a0a0a],
    profile: [[-2.3, 0.3], [-2.3, 0.7], [-1.9, 0.78], [-1.1, 0.82], [-0.5, 1.24], [0.6, 1.26], [1.4, 0.88], [2.1, 0.78], [2.3, 0.48], [2.3, 0.3]], cabin: [[-1.1, 0.82], [-0.5, 1.24], [0.6, 1.26], [1.4, 0.88]] },
  // ----- sports & supers -----
  sports: { len: 4.4, wid: 1.95, mass: 1200, maxSpeed: 52, accel: 14, brake: 26, grip: 9.5, steer: 0.5, wheelR: 0.33, cls: 'sports', colors: [0xff2d2d, 0xffd600, 0x00c2ff, 0xffffff, 0x111111, 0xff7a00, 0x9b59b6],
    profile: [[-2.2, 0.3], [-2.2, 0.72], [-1.7, 0.8], [-1.1, 0.82], [-0.5, 1.15], [0.6, 1.18], [1.3, 0.8], [2.1, 0.66], [2.2, 0.45], [2.2, 0.3]], cabin: [[-1.1, 0.82], [-0.5, 1.15], [0.6, 1.18], [1.3, 0.8]] },
  kestrel: { base: 'sports', len: 4.35, maxSpeed: 54, accel: 14.5, cls: 'sports', colors: [0x00c2ff, 0xff7a00, 0x111111, 0xecf0f1, 0x2ecc71],
    profile: [[-2.17, 0.28], [-2.17, 0.66], [-1.6, 0.76], [-1.0, 0.8], [-0.3, 1.1], [0.7, 1.12], [1.35, 0.78], [2.05, 0.62], [2.17, 0.42], [2.17, 0.28]], cabin: [[-1.0, 0.8], [-0.3, 1.1], [0.7, 1.12], [1.35, 0.78]] },
  vortex:  { len: 4.5, wid: 2.0, mass: 1150, maxSpeed: 60, accel: 17, brake: 28, grip: 10.5, steer: 0.46, wheelR: 0.32, cls: 'super', colors: [0xffd600, 0xff2d2d, 0x111111, 0x00c2ff, 0xff7a00],
    profile: [[-2.25, 0.26], [-2.25, 0.6], [-1.7, 0.68], [-0.9, 0.72], [-0.2, 1.02], [0.5, 1.04], [1.2, 0.72], [2.0, 0.6], [2.25, 0.4], [2.25, 0.26]], cabin: [[-0.9, 0.72], [-0.2, 1.02], [0.5, 1.04], [1.2, 0.72]] },
  scalpel: { base: 'vortex', len: 4.45, maxSpeed: 62, accel: 18, mass: 1100, grip: 11, cls: 'super', colors: [0x111111, 0x8e44ad, 0xecf0f1, 0xff2d2d, 0x0b1a3a],
    profile: [[-2.22, 0.24], [-2.22, 0.55], [-1.5, 0.62], [-0.6, 0.68], [0.0, 0.98], [0.6, 1.0], [1.1, 0.7], [1.9, 0.58], [2.22, 0.36], [2.22, 0.24]], cabin: [[-0.6, 0.68], [0.0, 0.98], [0.6, 1.0], [1.1, 0.7]] },
  stiletto: { base: 'vortex', len: 4.3, maxSpeed: 55, accel: 15, mass: 1250, cls: 'super', colors: [0x7a0a0a, 0xc0c0c0, 0x5d4037, 0x1a1a1a, 0x0b1a3a],
    profile: [[-2.15, 0.3], [-2.15, 0.62], [-1.7, 0.7], [-0.9, 0.74], [-0.3, 1.05], [0.4, 1.06], [1.0, 0.74], [1.9, 0.62], [2.15, 0.42], [2.15, 0.3]], cabin: [[-0.9, 0.74], [-0.3, 1.05], [0.4, 1.06], [1.0, 0.74]] },
  solair:  { base: 'sports', cls: 'cabrio', open: true, maxSpeed: 50, colors: [0xffd600, 0xffffff, 0xff2d2d, 0x00c2ff, 0xff7a00],
    profile: [[-2.2, 0.3], [-2.2, 0.7], [-1.7, 0.78], [-1.1, 0.8], [-0.5, 0.92], [0.6, 0.94], [1.3, 0.8], [2.1, 0.66], [2.2, 0.45], [2.2, 0.3]], cabin: [[-1.1, 0.8], [-0.5, 0.92], [0.6, 0.94], [1.3, 0.8]] },
  bella:   { base: 'seraph', cls: 'cabrio', open: true, maxSpeed: 42, accel: 10, colors: [0x7a0a0a, 0xecf0f1, 0x5d4037, 0x0b1a3a, 0x2e4a7a],
    profile: [[-2.3, 0.3], [-2.3, 0.68], [-1.9, 0.76], [-1.1, 0.8], [-0.5, 0.9], [0.6, 0.92], [1.4, 0.86], [2.1, 0.76], [2.3, 0.46], [2.3, 0.3]], cabin: [[-1.1, 0.8], [-0.5, 0.9], [0.6, 0.92], [1.4, 0.86]] },
  // ----- muscle -----
  bruiser: { len: 4.6, wid: 1.95, mass: 1500, maxSpeed: 46, accel: 13, brake: 22, grip: 7.8, steer: 0.52, wheelR: 0.35, cls: 'muscle', colors: [0x1a1a1a, 0x7a0a0a, 0x0b1a3a, 0x5d4037, 0x2b2b2b, 0xff7a00],
    profile: [[-2.3, 0.3], [-2.3, 0.8], [-1.9, 0.9], [-1.3, 0.92], [-0.7, 1.32], [0.5, 1.34], [1.1, 0.98], [2.0, 0.9], [2.3, 0.6], [2.3, 0.3]], cabin: [[-1.3, 0.92], [-0.7, 1.32], [0.5, 1.34], [1.1, 0.98]] },
  howler:  { base: 'bruiser', len: 4.5, maxSpeed: 48, accel: 14, cls: 'muscle', colors: [0xffd600, 0x111111, 0x2ecc71, 0xc0392b, 0xecf0f1],
    profile: [[-2.25, 0.3], [-2.25, 0.82], [-1.8, 0.92], [-1.2, 0.94], [-0.6, 1.3], [0.5, 1.32], [1.0, 0.96], [1.95, 0.88], [2.25, 0.58], [2.25, 0.3]], cabin: [[-1.2, 0.94], [-0.6, 1.3], [0.5, 1.32], [1.0, 0.96]] },
  razor:   { base: 'bruiser', len: 4.4, maxSpeed: 44, accel: 12, mass: 1400, cls: 'muscle', colors: [0x2c3e50, 0x8a8a8a, 0x1a1a1a, 0x7a0a0a, 0x0b1a3a],
    profile: [[-2.2, 0.32], [-2.2, 0.78], [-1.8, 0.88], [-1.2, 0.9], [-0.6, 1.28], [0.4, 1.3], [1.0, 0.94], [1.9, 0.86], [2.2, 0.56], [2.2, 0.32]], cabin: [[-1.2, 0.9], [-0.6, 1.28], [0.4, 1.3], [1.0, 0.94]] },
  // ----- lowriders & classics -----
  luz:     { len: 4.7, wid: 1.9, mass: 1450, maxSpeed: 40, accel: 10, brake: 21, grip: 7.2, steer: 0.55, wheelR: 0.33, cls: 'lowrider', colors: [0x8e44ad, 0x27ae60, 0xc0392b, 0x2980b9, 0xf1c40f, 0xecf0f1],
    profile: [[-2.35, 0.26], [-2.35, 0.72], [-1.9, 0.8], [-1.2, 0.84], [-0.6, 1.28], [0.6, 1.3], [1.3, 0.9], [2.05, 0.82], [2.35, 0.52], [2.35, 0.26]], cabin: [[-1.2, 0.84], [-0.6, 1.28], [0.6, 1.3], [1.3, 0.9]] },
  majestic: { base: 'luz', len: 4.6, maxSpeed: 42, accel: 10.5, cls: 'lowrider', colors: [0x1a1a1a, 0x5d4037, 0x0b1a3a, 0x7a0a0a, 0x2b2b2b],
    profile: [[-2.3, 0.26], [-2.3, 0.74], [-1.85, 0.82], [-1.15, 0.86], [-0.55, 1.26], [0.55, 1.28], [1.25, 0.88], [2.0, 0.8], [2.3, 0.5], [2.3, 0.26]], cabin: [[-1.15, 0.86], [-0.55, 1.26], [0.55, 1.28], [1.25, 0.88]] },
  regal:   { len: 4.8, wid: 1.9, mass: 1500, maxSpeed: 36, accel: 8, brake: 19, grip: 6.8, steer: 0.55, wheelR: 0.36, cls: 'classic', colors: [0x5d4037, 0x2e4a7a, 0x1a1a1a, 0x7a0a0a, 0xecf0f1, 0x6d4c41],
    profile: [[-2.4, 0.32], [-2.4, 0.7], [-2.0, 0.82], [-1.3, 0.86], [-0.7, 1.3], [0.5, 1.32], [1.2, 0.92], [2.0, 0.84], [2.4, 0.55], [2.4, 0.32]], cabin: [[-1.3, 0.86], [-0.7, 1.3], [0.5, 1.32], [1.2, 0.92]] },
  // ----- SUVs & offroad -----
  suv:    { len: 4.8, wid: 2.0, mass: 2000, maxSpeed: 34, accel: 8, brake: 20, grip: 6.5, steer: 0.5, wheelR: 0.4, cls: 'suv', colors: [0x2c3e50, 0x1a1a1a, 0xecf0f1, 0x6d4c41, 0x556b2f, 0x7f8c8d],
    profile: [[-2.4, 0.4], [-2.4, 1.1], [-2.3, 1.85], [-2.0, 1.9], [1.0, 1.9], [1.5, 1.2], [2.3, 1.1], [2.4, 0.6], [2.4, 0.4]], cabin: [[-2.3, 1.1], [-2.25, 1.82], [1.0, 1.82], [1.45, 1.2]] },
  monarch: { base: 'suv', len: 5.0, maxSpeed: 37, accel: 9, mass: 2200, cls: 'suv', colors: [0x1a1a1a, 0xecf0f1, 0x0b1a3a, 0x5d4037, 0xc0c0c0],
    profile: [[-2.5, 0.4], [-2.5, 1.15], [-2.4, 1.92], [-2.0, 1.97], [1.1, 1.97], [1.6, 1.25], [2.4, 1.15], [2.5, 0.6], [2.5, 0.4]], cabin: [[-2.4, 1.15], [-2.35, 1.9], [1.1, 1.9], [1.55, 1.25]] },
  golem:   { base: 'suv', len: 4.9, maxSpeed: 33, accel: 8.5, grip: 7.0, wheelR: 0.46, cls: 'offroad', colors: [0x556b2f, 0x6d4c41, 0x7f8c8d, 0xc0392b, 0x1a1a1a],
    profile: [[-2.45, 0.5], [-2.45, 1.2], [-2.35, 1.95], [-2.0, 2.0], [1.0, 2.0], [1.5, 1.3], [2.35, 1.2], [2.45, 0.7], [2.45, 0.5]], cabin: [[-2.35, 1.2], [-2.3, 1.92], [1.0, 1.92], [1.45, 1.3]] },
  dune:    { len: 5.1, wid: 2.0, mass: 1900, maxSpeed: 35, accel: 9, brake: 19, grip: 7.0, steer: 0.52, wheelR: 0.46, cls: 'offroad', colors: [0xc0392b, 0xf39c12, 0x27ae60, 0xecf0f1, 0x2c3e50],
    profile: [[-2.55, 0.5], [-2.55, 1.2], [-0.4, 1.2], [-0.4, 1.9], [0.8, 1.9], [1.4, 1.25], [2.45, 1.15], [2.55, 0.65], [2.55, 0.5]], cabin: [[-0.35, 1.25], [-0.35, 1.83], [0.8, 1.83], [1.35, 1.3]] },
  // ----- pickups & vans -----
  pickup: { len: 5.2, wid: 2.0, mass: 1900, maxSpeed: 36, accel: 8.5, brake: 20, grip: 6.5, steer: 0.5, wheelR: 0.4, cls: 'pickup', colors: [0xc0392b, 0x2c3e50, 0xecf0f1, 0x6d4c41, 0x7f8c8d],
    profile: [[-2.6, 0.45], [-2.6, 1.15], [-0.3, 1.15], [-0.3, 1.85], [0.9, 1.85], [1.5, 1.2], [2.5, 1.1], [2.6, 0.6], [2.6, 0.45]], cabin: [[-0.25, 1.2], [-0.25, 1.78], [0.9, 1.78], [1.45, 1.2]] },
  van:    { len: 5.0, wid: 2.0, mass: 2200, maxSpeed: 30, accel: 6, brake: 18, grip: 6, steer: 0.45, wheelR: 0.38, cls: 'van', colors: [0xecf0f1, 0xbdc3c7, 0x2980b9, 0xc0392b, 0xf1c40f],
    profile: [[-2.5, 0.4], [-2.5, 2.1], [0.9, 2.1], [1.6, 1.25], [2.4, 1.15], [2.5, 0.6], [2.5, 0.4]], cabin: [[0.7, 1.3], [0.9, 2.0], [0.95, 2.0], [1.55, 1.3]] },
  carrier: { base: 'van', len: 5.4, maxSpeed: 28, accel: 5.5, mass: 2500, cls: 'van', colors: [0xecf0f1, 0x7f8c8d, 0x2c3e50, 0x8e44ad, 0x27ae60],
    profile: [[-2.7, 0.4], [-2.7, 2.2], [0.8, 2.2], [1.5, 1.3], [2.5, 1.2], [2.7, 0.6], [2.7, 0.4]], cabin: [[0.6, 1.35], [0.8, 2.1], [0.85, 2.1], [1.45, 1.35]] },
  // ----- heavy & service -----
  hauler:  { len: 7.5, wid: 2.4, mass: 6000, maxSpeed: 28, accel: 4, brake: 16, grip: 5.5, steer: 0.4, wheelR: 0.45, cls: 'truck', colors: [0xc0392b, 0x2980b9, 0xecf0f1, 0x1a1a1a, 0x27ae60],
    profile: [[-3.75, 0.5], [-3.75, 2.6], [-0.5, 2.6], [-0.5, 1.1], [1.3, 1.1], [1.6, 2.3], [2.9, 2.3], [3.5, 1.2], [3.75, 0.6], [3.75, 0.5]], cabin: [[1.6, 1.15], [1.7, 2.2], [2.85, 2.2], [3.4, 1.2]] },
  refuse:  { base: 'hauler', len: 7.0, maxSpeed: 26, cls: 'service', colors: [0x27ae60, 0xecf0f1, 0x7f8c8d],
    profile: [[-3.5, 0.5], [-3.5, 2.5], [-0.6, 2.5], [-0.6, 1.1], [1.2, 1.1], [1.5, 2.2], [2.8, 2.2], [3.3, 1.2], [3.5, 0.6], [3.5, 0.5]], cabin: [[1.5, 1.15], [1.6, 2.1], [2.75, 2.1], [3.2, 1.2]] },
  hook:    { base: 'hauler', len: 6.8, maxSpeed: 30, accel: 5, cls: 'service', colors: [0xf39c12, 0x1a1a1a, 0xc0392b],
    profile: [[-3.4, 0.5], [-3.4, 1.0], [-0.8, 1.0], [-0.8, 1.1], [1.2, 1.1], [1.5, 2.2], [2.7, 2.2], [3.2, 1.2], [3.4, 0.6], [3.4, 0.5]], cabin: [[1.5, 1.15], [1.6, 2.1], [2.65, 2.1], [3.1, 1.2]] },
  coach:   { len: 9.0, wid: 2.5, mass: 8000, maxSpeed: 30, accel: 4, brake: 15, grip: 5, steer: 0.38, wheelR: 0.45, cls: 'bus', colors: [0x2980b9, 0xecf0f1, 0x27ae60, 0xf39c12, 0x8e44ad],
    profile: [[-4.5, 0.5], [-4.5, 2.4], [-4.2, 2.7], [3.6, 2.7], [4.3, 1.6], [4.5, 0.6], [4.5, 0.5]], cabin: [[-4.2, 1.2], [-4.1, 2.55], [3.5, 2.55], [4.1, 1.3]] },
  // ----- emergency & taxi -----
  taxi:   { base: 'sedan', colors: [0xf5c518], maxSpeed: 40, cls: 'sedan', taxi: true },
  cabbie: { base: 'van', colors: [0xf5c518], maxSpeed: 32, cls: 'van', taxi: true,
    profile: [[-2.5, 0.4], [-2.5, 2.1], [0.9, 2.1], [1.6, 1.25], [2.4, 1.15], [2.5, 0.6], [2.5, 0.4]], cabin: [[0.7, 1.3], [0.9, 2.0], [0.95, 2.0], [1.55, 1.3]] },
  police: { base: 'sedan', colors: [0xf4f4f4], maxSpeed: 50, accel: 13.5, grip: 9, mass: 1500, cls: 'sedan', cop: true },
  interceptor: { base: 'sports', colors: [0x0b1a3a], maxSpeed: 56, accel: 15, grip: 10, mass: 1300, cls: 'sports', cop: true },
  warden: { base: 'suv', colors: [0x1a1a1a], maxSpeed: 42, accel: 10, grip: 7.5, mass: 2100, cls: 'suv', cop: true },
  pulse:  { base: 'van', colors: [0xffffff], maxSpeed: 38, accel: 8, cls: 'van', ems: 'amb',
    profile: [[-2.5, 0.4], [-2.5, 2.2], [0.9, 2.2], [1.6, 1.3], [2.4, 1.2], [2.5, 0.6], [2.5, 0.4]], cabin: [[0.7, 1.35], [0.9, 2.1], [0.95, 2.1], [1.55, 1.35]] },
  inferno: { base: 'hauler', len: 7.2, colors: [0xc0392b], maxSpeed: 34, accel: 6, cls: 'truck', ems: 'fire',
    profile: [[-3.6, 0.5], [-3.6, 2.4], [-0.6, 2.4], [-0.6, 1.1], [1.3, 1.1], [1.6, 2.2], [2.8, 2.2], [3.4, 1.2], [3.6, 0.6], [3.6, 0.5]], cabin: [[1.6, 1.15], [1.7, 2.1], [2.75, 2.1], [3.3, 1.2]] },
  // ----- utility & service -----
  forklift: { len: 2.6, wid: 1.4, mass: 1800, maxSpeed: 12, accel: 5, brake: 14, grip: 8, steer: 0.7, wheelR: 0.28, cls: 'utility', colors: [0xf39c12, 0xc0392b, 0x2980b9],
    profile: [[-1.3, 0.3], [-1.3, 1.3], [-0.4, 1.9], [0.5, 1.9], [1.3, 0.9], [1.3, 0.3]], cabin: [[-0.4, 1.3], [-0.3, 1.85], [0.4, 1.85], [0.5, 1.3]] },
  tug:    { len: 3.0, wid: 1.6, mass: 2000, maxSpeed: 16, accel: 6, brake: 16, grip: 8, steer: 0.65, wheelR: 0.3, cls: 'utility', colors: [0xecf0f1, 0xf5c518, 0x2980b9],
    profile: [[-1.5, 0.3], [-1.5, 1.0], [-0.8, 1.5], [0.6, 1.5], [1.5, 0.8], [1.5, 0.3]], cabin: [[-0.8, 1.0], [-0.7, 1.45], [0.5, 1.45], [0.6, 1.0]] },
  limo:   { base: 'executive', len: 6.4, maxSpeed: 42, accel: 8.5, mass: 1900, cls: 'sedan', colors: [0x111111, 0xecf0f1, 0x2c3e50],
    profile: [[-3.2, 0.3], [-3.2, 0.78], [-2.75, 0.84], [-1.9, 0.86], [-1.4, 1.34], [1.2, 1.38], [2.0, 0.94], [3.0, 0.84], [3.2, 0.55], [3.2, 0.3]], cabin: [[-1.9, 0.86], [-1.4, 1.34], [1.2, 1.38], [2.0, 0.94]] },
  icecream: { base: 'van', len: 4.6, maxSpeed: 28, accel: 5.5, mass: 2000, cls: 'van', colors: [0xffffff, 0xffb6d5, 0x7fe7ff],
    profile: [[-2.3, 0.4], [-2.3, 2.0], [0.8, 2.0], [1.5, 1.25], [2.2, 1.15], [2.3, 0.6], [2.3, 0.4]], cabin: [[0.6, 1.3], [0.8, 1.9], [0.85, 1.9], [1.45, 1.3]] },
  securicar: { base: 'van', len: 5.0, maxSpeed: 33, accel: 6.5, mass: 3000, cls: 'van', colors: [0x2e7d4f, 0x1a1a1a, 0x7f8c8d],
    profile: [[-2.5, 0.4], [-2.5, 2.1], [0.9, 2.1], [1.6, 1.25], [2.4, 1.15], [2.5, 0.6], [2.5, 0.4]], cabin: [[0.7, 1.3], [0.9, 2.0], [0.95, 2.0], [1.55, 1.3]] },
  mower:  { len: 1.8, wid: 1.2, mass: 400, maxSpeed: 9, accel: 4, brake: 10, grip: 7, steer: 0.75, wheelR: 0.24, cls: 'utility', colors: [0x27ae60, 0xc0392b, 0xf39c12],
    profile: [[-0.9, 0.25], [-0.9, 0.8], [-0.3, 1.1], [0.5, 1.1], [0.9, 0.6], [0.9, 0.25]], cabin: [[-0.3, 0.8], [-0.25, 1.05], [0.4, 1.05], [0.45, 0.8]] },
  // ----- aircraft (fly flag; physics branches in update) -----
  heli:   { len: 5.2, wid: 1.9, mass: 1200, maxSpeed: 42, accel: 11, brake: 10, grip: 4, steer: 0.9, wheelR: 0.3, cls: 'heli', fly: 'heli', colors: [0xc0392b, 0x2980b9, 0x111111, 0xecf0f1, 0x27ae60],
    profile: [[-2.6, 0.8], [-2.6, 1.4], [-1.6, 1.8], [0.4, 2.0], [2.0, 1.6], [2.6, 1.0], [2.6, 0.8]], cabin: [[-1.6, 1.4], [-1.4, 1.75], [0.2, 1.95], [0.4, 1.4]] },
  hunter: { base: 'heli', colors: [0x1f3a93], maxSpeed: 48, accel: 13, mass: 1400, cls: 'heli', fly: 'heli', cop: true },
  dodo:   { len: 6.2, wid: 2.2, mass: 1100, maxSpeed: 55, accel: 10, brake: 12, grip: 5, steer: 0.5, wheelR: 0.3, cls: 'plane', fly: 'plane', colors: [0xecf0f1, 0xc0392b, 0x2980b9, 0xf39c12],
    profile: [[-3.1, 0.5], [-3.1, 1.1], [-1.0, 1.3], [1.0, 1.5], [2.6, 1.0], [3.1, 0.6], [3.1, 0.5]], cabin: [[-1.0, 1.1], [-0.8, 1.45], [0.8, 1.5], [1.0, 1.1]] },
  shamal: { len: 11.0, wid: 2.8, mass: 9000, maxSpeed: 62, accel: 7, brake: 10, grip: 4, steer: 0.35, wheelR: 0.4, cls: 'plane', fly: 'plane', colors: [0xecf0f1, 0xbdc3c7],
    profile: [[-5.5, 0.8], [-5.5, 1.6], [-2.0, 1.9], [2.0, 2.1], [4.5, 1.5], [5.5, 0.9], [5.5, 0.8]], cabin: [[-2.0, 1.6], [-1.8, 1.85], [2.0, 2.0], [2.2, 1.5]] },
};
for (const k in VEHICLE_TYPES) { const t = VEHICLE_TYPES[k]; if (t.base) VEHICLE_TYPES[k] = { ...VEHICLE_TYPES[t.base], ...t, name: k }; else t.name = k; }

const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a2c3c, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.55 });
const tireMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.95 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0xaeb4ba, roughness: 0.35, metalness: 0.9 });
const trimMat = new THREE.MeshStandardMaterial({ color: 0x1c1f22, roughness: 0.5, metalness: 0.4 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd7dde3, roughness: 0.15, metalness: 1.0 });
const amberMat = new THREE.MeshStandardMaterial({ color: 0xff9a1a, emissive: 0xff8c00, emissiveIntensity: 0.7, roughness: 0.3 });
const plateMat = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.6 });
const tintMat = new THREE.MeshStandardMaterial({ color: 0x0d1826, roughness: 0.08, metalness: 0.9 });
const seatMat = new THREE.MeshStandardMaterial({ color: 0x23262b, roughness: 0.9 });
const coneMat = new THREE.MeshStandardMaterial({ color: 0xc8915a, roughness: 0.8 });
const scoopMat = new THREE.MeshStandardMaterial({ color: 0xffb6d5, roughness: 0.6 });
const bodyGeoCache = new Map();
// Shared detail geometries (unit-ish boxes scaled per car, plus a few fixed parts).
function partGeo(key, make) { if (!bodyGeoCache.has(key)) { const g = make(); g.userData.shared = true; bodyGeoCache.set(key, g); } return bodyGeoCache.get(key); }
const boxUnit = () => partGeo('box1', () => new RoundedBoxGeometry(1, 1, 1, 2, 0.1));
const cylX = (r, l, seg = 12) => partGeo(`cylx_${r}_${l}`, () => { const g = new THREE.CylinderGeometry(r, r, l, seg); g.rotateX(Math.PI / 2); return g; });
// Rounded panel helper — soft edges instead of hard lego corners.
function rbox(w, h, d, r = 0.03) {
  const k = `rb${w},${h},${d},${r}`;
  if (!bodyGeoCache.has(k)) { const g = new RoundedBoxGeometry(w, h, d, 2, Math.min(r, Math.min(w, h, d) * 0.4)); g.userData.shared = true; bodyGeoCache.set(k, g); }
  return bodyGeoCache.get(k);
}
for (const m of [glassMat, tireMat, rimMat, trimMat, chromeMat, amberMat, plateMat, tintMat, seatMat, coneMat, scoopMat, boxUnit()]) m.userData.shared = true;

function profileGeometry(type, key, pts, width, bevel) {
  const ck = type.name + key + width; if (bodyGeoCache.has(ck)) return bodyGeoCache.get(ck);
  const shape = new THREE.Shape(); pts.forEach((p, i) => i === 0 ? shape.moveTo(p[0], p[1]) : shape.lineTo(p[0], p[1]));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: bevel, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 3, curveSegments: 3 });
  geo.rotateY(-Math.PI / 2); geo.translate(width / 2, 0, 0); // length -> +z (front), width centred on x
  // After rotateY(-PI/2): original x (length) maps to +z? Let's compute: rotateY(theta) maps (x,z)->(x cosθ + z sinθ, -x sinθ + z cosθ); θ=-90°: (−z, x). So length x -> z' = x (front +z). width z -> x' = -z.
  geo.computeVertexNormals(); geo.userData.shared = true; bodyGeoCache.set(ck, geo); return geo;
}

let vehicleId = 0;
export class Vehicle {
  constructor(typeName, color) {
    const type = this.type = VEHICLE_TYPES[typeName] || VEHICLE_TYPES.sedan;
    this.id = vehicleId++; this.typeName = type.name;
    this.color = color ?? pick(type.colors);
    this.x = 0; this.z = 0; this.y = 0; this.heading = 0; this.vx = 0; this.vz = 0; this.vy = 0; this.angVel = 0; this.steer = 0;
    this.throttle = 0; this.brake = 0; this.handbrake = false; this.steerInput = 0;
    this.health = 100; this.destroyed = false; this.onFire = false; this.fireT = 0; this.smokeT = 0;
    this.driver = null; this.control = 'none'; // 'player' | 'ai' | 'cop' | 'none'
    this.halfL = type.len / 2; this.halfW = type.wid / 2;
    this.wheelSpin = 0; this.lastImpact = 0; this.braking = false; this.hornT = 0; this.airT = 0;
    this.sirenOn = false; this.lightsOn = false; this.owner = null; this.isParked = false; this.stuckT = 0;
    this.buildMesh();
  }

  buildMesh() {
    const t = this.type; const g = this.group = new THREE.Group(); g.userData.vehicle = this;
    const body = this.body = new THREE.Group(); g.add(body);
    this.paint = new THREE.MeshStandardMaterial({ color: this.color, roughness: 0.25, metalness: 0.6 });
    const shell = new THREE.Mesh(profileGeometry(t, 'body', t.profile, t.wid, true), this.paint); shell.castShadow = true; shell.receiveShadow = true; body.add(shell);
    const cabinPts = [...t.cabin, [t.cabin[t.cabin.length - 1][0], t.cabin[0][1]]];
    if (!t.open) { const cabin = new THREE.Mesh(profileGeometry(t, 'cabin', cabinPts, t.wid + 0.04, false), glassMat); cabin.position.y = 0.005; body.add(cabin); }
    // small helper: shared unit-box mesh, scaled per part
    const U = boxUnit();
    const part = (m, sx, sy, sz, x, y, z, rx = 0, ry = 0, rz = 0) => { const o = new THREE.Mesh(U, m); o.scale.set(sx, sy, sz); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.castShadow = true; body.add(o); return o; };
    // cabin extents (profile x maps to car z, front = +z)
    const cabX = t.cabin.map(p => p[0]), cabY = t.cabin.map(p => p[1]);
    const cabFront = Math.max(...cabX), cabRear = Math.min(...cabX), cabMidZ = (cabFront + cabRear) / 2, cabLen = cabFront - cabRear;
    const roofY = Math.max(...cabY), cabBaseY = Math.min(...cabY);
    const seatZ = (t.cabin[0][0] + t.cabin[t.cabin.length - 1][0]) / 2 - 0.2;
    const seatY = 0.3 + (t.cabin[0][1] - 0.86);
    // ---- framed glasshouse: windshield + rear glass (sloped to the profile),
    // split side windows with B-pillars, sunroof on closed roofs ----
    const glassY = (cabBaseY + roofY) / 2 + 0.02, glassX = t.wid / 2 + 0.028;
    const edge = (zH, yH, zL, yL) => { const L = Math.hypot(zH - zL, yH - yL); return { L: L + 0.08, rx: Math.atan2(zH - zL, yH - yL), z: (zH + zL) / 2, y: (yH + yL) / 2 }; };
    const shield = edge(cabX[2], cabY[2], cabX[3], cabY[3]); // windshield
    const rear = edge(cabX[1], cabY[1], cabX[0], cabY[0]);   // rear glass
    part(tintMat, t.wid * 0.8, shield.L, 0.03, 0, shield.y, shield.z, shield.rx);
    part(tintMat, t.wid * 0.78, rear.L, 0.03, 0, rear.y, rear.z, rear.rx);
    for (const s of [-1, 1]) { // A-pillars + header framing the windshield
      part(trimMat, 0.07, shield.L + 0.06, 0.07, s * t.wid * 0.42, shield.y, shield.z, shield.rx);
      part(tintMat, 0.02, 0.3, cabLen * 0.22, s * glassX, glassY, cabMidZ + cabLen * 0.135); // front side window
      part(tintMat, 0.02, 0.3, cabLen * 0.22, s * glassX, glassY, cabMidZ - cabLen * 0.135); // rear side window
      part(trimMat, 0.05, 0.34, 0.07, s * glassX, glassY, cabMidZ); // B-pillar
      if (t.cls === 'bus') { // extra pillars down the band
        part(trimMat, 0.05, 0.5, 0.07, s * glassX, glassY + 0.1, cabMidZ + cabLen * 0.3);
        part(trimMat, 0.05, 0.5, 0.07, s * glassX, glassY + 0.1, cabMidZ - cabLen * 0.3);
      }
    }
    part(trimMat, t.wid * 0.86, 0.07, 0.09, 0, cabY[2] - 0.02, cabX[2] + 0.02); // header
    if (t.open) { // folded soft-top behind the seats
      part(trimMat, t.wid * 0.8, 0.16, 0.5, 0, cabBaseY + 0.12, cabMidZ - cabLen * 0.28);
    } else if (!['pickup', 'truck', 'bus', 'van', 'service'].includes(t.cls) && !t.ems) {
      part(tintMat, t.wid * 0.44, 0.02, Math.min(0.95, cabLen * 0.4), 0, roofY + 0.008, cabMidZ + cabLen * 0.08); // sunroof
    }
    // pillars (thin dark boxes at cabin corners) & side trim
    const pillar = new THREE.Mesh(rbox(t.wid + 0.06, 0.05, 0.08, 0.02), trimMat); pillar.position.set(0, t.cabin[0][1] + 0.02, t.cabin[0][0] + 0.02); body.add(pillar);
    const bpX = (t.cabin[1][0] + t.cabin[2][0]) / 2; const bp = new THREE.Mesh(rbox(t.wid + 0.06, Math.max(0.1, t.cabin[1][1] - t.cabin[0][1] - 0.05), 0.08, 0.02), trimMat); bp.position.set(0, (t.cabin[1][1] + t.cabin[0][1]) / 2, bpX); body.add(bp);
    // door handles + side rubbing strips (door definition)
    for (const s of [-1, 1]) {
      part(chromeMat, 0.03, 0.035, 0.13, s * (t.wid / 2 + 0.012), 0.95, seatZ + 0.62);
      part(chromeMat, 0.03, 0.035, 0.13, s * (t.wid / 2 + 0.012), 0.95, seatZ - 0.62);
      part(trimMat, 0.02, 0.09, t.len * 0.62, s * (t.wid / 2 + 0.008), 0.55, 0);
    }
    const bumperF = new THREE.Mesh(rbox(t.wid * 0.98, 0.22, 0.12, 0.06), trimMat); bumperF.position.set(0, 0.42, t.len / 2 + 0.02); body.add(bumperF);
    const bumperR = bumperF.clone(); bumperR.position.z = -t.len / 2 - 0.02; body.add(bumperR);
    const grille = new THREE.Mesh(rbox(t.wid * 0.45, 0.16, 0.06, 0.02), trimMat); grille.position.set(0, 0.68, t.len / 2 + 0.03); body.add(grille);
    // chrome grille slats
    part(chromeMat, t.wid * 0.4, 0.025, 0.02, 0, 0.71, t.len / 2 + 0.065); part(chromeMat, t.wid * 0.4, 0.025, 0.02, 0, 0.64, t.len / 2 + 0.065);
    // plates, indicators, tail bar, exhausts, antenna
    part(plateMat, 0.34, 0.1, 0.02, 0, 0.42, t.len / 2 + 0.085); part(plateMat, 0.34, 0.1, 0.02, 0, 0.42, -t.len / 2 - 0.085);
    // lights
    this.headMat = new THREE.MeshStandardMaterial({ color: 0xfff6e0, emissive: 0xfff2cc, emissiveIntensity: 0.3, roughness: 0.2 });
    this.tailMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, emissive: 0xff2010, emissiveIntensity: 0.4, roughness: 0.3 });
    const hy = t.profile[t.profile.length - 3][1] + 0.05;
    const tailY = t.profile[1][1] - 0.1;
    for (const s of [-1, 1]) {
      const hl = new THREE.Mesh(rbox(0.42, 0.16, 0.08, 0.05), this.headMat); hl.position.set(s * (t.wid / 2 - 0.32), hy, t.len / 2 + 0.02); body.add(hl);
      part(amberMat, 0.12, 0.1, 0.06, s * (t.wid / 2 - 0.1), hy, t.len / 2 + 0.02); // indicators
      const tl = new THREE.Mesh(rbox(0.4, 0.14, 0.08, 0.05), this.tailMat); tl.position.set(s * (t.wid / 2 - 0.3), tailY, -t.len / 2 - 0.02); body.add(tl);
      const mirror = new THREE.Mesh(rbox(0.1, 0.1, 0.18, 0.03), this.paint); mirror.position.set(s * (t.wid / 2 + 0.08), t.cabin[0][1] + 0.1, t.cabin[t.cabin.length - 1][0] - 0.1); body.add(mirror);
    }
    part(this.tailMat, t.wid * 0.7, 0.09, 0.05, 0, tailY, -t.len / 2 - 0.03); // full-width tail bar
    for (const s of [-1, 1]) { const ex = new THREE.Mesh(cylX(0.035, 0.18), chromeMat); ex.position.set(s * 0.32, 0.24, -t.len / 2 - 0.06); body.add(ex); }
    const ant = new THREE.Mesh(partGeo('antenna', () => new THREE.CylinderGeometry(0.008, 0.012, 0.5, 6)), trimMat); ant.position.set(t.wid / 2 - 0.25, roofY + 0.25, -t.len / 2 + 0.7); body.add(ant);
    this.headY = hy; // headlight height (the game positions pooled spotlights here for the player's car)
    // simple cabin interior visible through the glass: seats, dash, RHD steering wheel
    part(seatMat, 0.5, 0.14, 0.5, 0.38, seatY - 0.02, seatZ); part(seatMat, 0.5, 0.14, 0.5, -0.38, seatY - 0.02, seatZ);
    part(seatMat, 0.5, 0.55, 0.16, 0.38, seatY + 0.3, seatZ - 0.3); part(seatMat, 0.5, 0.55, 0.16, -0.38, seatY + 0.3, seatZ - 0.3);
    part(seatMat, t.wid - 0.5, 0.18, 0.4, 0, seatY + 0.28, seatZ + 0.95); // dashboard
    const swheel = new THREE.Mesh(partGeo('swheel', () => new THREE.TorusGeometry(0.16, 0.025, 8, 18)), trimMat);
    swheel.position.set(0.38, seatY + 0.42, seatZ + 0.55); swheel.rotation.x = -0.45; body.add(swheel);
    // wheels
    this.wheels = [];
    const wk = 'wheel' + t.wheelR; if (!bodyGeoCache.has(wk)) { const a = new THREE.CylinderGeometry(t.wheelR, t.wheelR, 0.26, 24); a.rotateZ(Math.PI / 2); a.userData.shared = true; const b = new THREE.CylinderGeometry(t.wheelR * 0.6, t.wheelR * 0.6, 0.27, 12); b.rotateZ(Math.PI / 2); b.userData.shared = true; bodyGeoCache.set(wk, [a, b]); }
    const [wg, rg] = bodyGeoCache.get(wk);
    const hubGeo = partGeo('hub' + t.wheelR, () => { const h = new THREE.CylinderGeometry(t.wheelR * 0.22, t.wheelR * 0.22, 0.29, 8); h.rotateZ(Math.PI / 2); return h; });
    const lipGeo = partGeo('lip' + t.wheelR, () => { const l = new THREE.TorusGeometry(t.wheelR * 0.6, 0.028, 8, 20); l.rotateY(Math.PI / 2); return l; });
    const wb = t.len * 0.32;
    if (t.cls !== 'heli') {
    for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
      const pivot = new THREE.Group(); pivot.position.set(sx * (t.wid / 2 - 0.12), t.wheelR, sz * wb); g.add(pivot);
      const w = new THREE.Mesh(wg, tireMat); w.castShadow = true; pivot.add(w);
      const r = new THREE.Mesh(rg, rimMat); pivot.add(r);
      const hub = new THREE.Mesh(hubGeo, trimMat); r.add(hub); // spins with the rim
      const lip = new THREE.Mesh(lipGeo, chromeMat); r.add(lip);
      if (t.cls === 'classic' || t.cls === 'lowrider') { // whitewall rings on both sidewalls
        const wwGeo = partGeo('ww' + t.wheelR, () => { const w = new THREE.TorusGeometry(t.wheelR * 0.72, 0.035, 8, 20); w.rotateY(Math.PI / 2); return w; });
        for (const wx of [-0.1, 0.1]) { const ww = new THREE.Mesh(wwGeo, plateMat); ww.position.x = wx; r.add(ww); }
      }
      this.wheels.push({ pivot, mesh: w, rim: r, front: sz > 0 });
      part(trimMat, 0.14, 0.16, 0.9, sx * (t.wid / 2 - 0.02), t.wheelR + 0.3, sz * wb); // fender flare
    }
    } // end wheels (helis ride on skids)
    this.wheelbase = wb * 2;
    // ---- class-driven extras ----
    if (t.cls === 'sports' || t.cls === 'super') { // rear wing
      const wingY = t.cls === 'super' ? 1.0 : 1.12;
      part(trimMat, 0.07, 0.2, 0.07, -(t.wid / 2 - 0.3), wingY - 0.12, -t.len / 2 + 0.35);
      part(trimMat, 0.07, 0.2, 0.07, t.wid / 2 - 0.3, wingY - 0.12, -t.len / 2 + 0.35);
      part(t.cls === 'super' ? trimMat : this.paint, t.wid * 0.88, 0.06, 0.35, 0, wingY, -t.len / 2 + 0.35);
    }
    if (t.cls === 'muscle') { // hood scoop + side pipes + ducktail
      part(this.paint, 0.5, 0.12, 0.5, 0, t.profile[t.profile.length - 2][1] + 0.06, t.len * 0.28);
      part(trimMat, 0.06, 0.06, 0.3, 0, t.profile[t.profile.length - 2][1] + 0.13, t.len * 0.28);
      for (const s of [-1, 1]) { const p = new THREE.Mesh(cylX(0.045, t.len * 0.5), chromeMat); p.position.set(s * (t.wid / 2 + 0.02), 0.28, 0); body.add(p); }
      part(this.paint, t.wid * 0.9, 0.07, 0.25, 0, t.profile[1][1] + 0.08, -t.len / 2 + 0.2);
    }
    if (t.cls === 'lowrider') { // chrome bumpers, whitewalls, antenna farm
      part(chromeMat, t.wid * 0.9, 0.05, 0.05, 0, 0.5, t.len / 2 + 0.06);
      for (const s of [-1, 1]) { const a2 = new THREE.Mesh(partGeo('antenna', () => new THREE.CylinderGeometry(0.008, 0.012, 0.5, 6)), chromeMat); a2.position.set(s * (t.wid / 2 - 0.15), roofY + 0.3, cabRear + 0.2); body.add(a2); }
    }
    if (t.cls === 'classic') { // whitewalls + chrome spear
      for (const s of [-1, 1]) part(chromeMat, 0.02, 0.06, t.len * 0.7, s * (t.wid / 2 + 0.01), 0.62, 0);
      part(chromeMat, t.wid * 0.9, 0.05, 0.05, 0, 0.52, t.len / 2 + 0.06);
    }
    if (t.cls === 'suv' || t.cls === 'van' || t.cls === 'offroad') { // roof rails
      part(trimMat, 0.06, 0.06, t.len * 0.5, -(t.wid / 2 - 0.4), roofY + 0.04, 0);
      part(trimMat, 0.06, 0.06, t.len * 0.5, t.wid / 2 - 0.4, roofY + 0.04, 0);
    }
    if (t.cls === 'offroad') { // bullbar + spare wheel on the roof/bed
      part(trimMat, t.wid * 0.7, 0.09, 0.09, 0, 0.7, t.len / 2 + 0.12);
      part(trimMat, 0.09, 0.5, 0.09, -t.wid * 0.28, 0.7, t.len / 2 + 0.12);
      part(trimMat, 0.09, 0.5, 0.09, t.wid * 0.28, 0.7, t.len / 2 + 0.12);
      const spare = new THREE.Mesh(partGeo('spare', () => new THREE.CylinderGeometry(0.34, 0.34, 0.2, 16)), tireMat);
      spare.position.set(0, roofY + 0.22, cabMidZ - cabLen * 0.2); body.add(spare);
    }
    if (t.cls === 'pickup' || t.name === 'dune') { // bed liner + tailgate handle
      part(trimMat, t.wid - 0.5, 0.05, t.len * 0.3, 0, t.profile[2][1] + 0.03, -t.len * 0.26);
      part(chromeMat, 0.2, 0.03, 0.03, 0, t.profile[1][1] + 0.05, -t.len / 2 - 0.03);
    }
    if (t.cls === 'truck' && !t.ems) { // container ribs on the box
      for (let i = 0; i < 4; i++) part(trimMat, t.wid + 0.04, 2.0, 0.08, 0, 1.55, -t.len / 2 + 0.6 + i * (t.len * 0.16));
    }
    if (t.name === 'hook') { // flatbed + wheel lift
      part(trimMat, t.wid - 0.4, 0.1, t.len * 0.42, 0, 1.02, -t.len * 0.2);
      part(chromeMat, 0.08, 0.5, 0.5, 0, 0.7, -t.len / 2 + 0.1);
    }
    if (t.cop) { // lightbar for every cruiser + livery per unit
      const barZ = (t.cabin[1][0] + t.cabin[2][0]) / 2;
      const bar = new THREE.Mesh(rbox(1.1, 0.14, 0.3, 0.05), trimMat); bar.position.set(0, t.cabin[1][1] + 0.07, barZ); body.add(bar);
      this.sirenR = new THREE.MeshBasicMaterial({ color: 0xff2020, toneMapped: false }); this.sirenB = new THREE.MeshBasicMaterial({ color: 0x2060ff, toneMapped: false });
      const lr = new THREE.Mesh(rbox(0.45, 0.14, 0.28, 0.05), this.sirenR); lr.position.set(-0.3, t.cabin[1][1] + 0.16, barZ); body.add(lr);
      const lb = new THREE.Mesh(rbox(0.45, 0.14, 0.28, 0.05), this.sirenB); lb.position.set(0.3, t.cabin[1][1] + 0.16, barZ); body.add(lb);
      this.sirenY = t.cabin[1][1] + 0.6;
      const stripe = new THREE.Mesh(rbox(t.wid + 0.02, 0.35, t.len * 0.6, 0.05), new THREE.MeshStandardMaterial({ color: 0x0b1a3a, roughness: 0.3, metalness: 0.5 })); stripe.position.set(0, 0.62, 0); body.add(stripe);
      // push bar + A-pillar spotlight (RHD: right side)
      part(trimMat, t.wid * 0.62, 0.09, 0.09, 0, 0.55, t.len / 2 + 0.14);
      part(trimMat, 0.09, 0.5, 0.09, -t.wid * 0.25, 0.55, t.len / 2 + 0.14);
      part(trimMat, 0.09, 0.5, 0.09, t.wid * 0.25, 0.55, t.len / 2 + 0.14);
      const spot = new THREE.Mesh(cylX(0.035, 0.14), chromeMat); spot.position.set(t.wid / 2 + 0.05, t.cabin[0][1] + 0.35, cabFront - 0.1); body.add(spot);
      if (t.name === 'police') part(tintMat, t.wid * 0.5, 0.3, 0.02, 0, 0.78, t.len / 2 + 0.02); // riot shield on the windscreen base
    }
    if (t.taxi) {
      const sign = new THREE.Mesh(rbox(0.7, 0.22, 0.3, 0.06), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe680, emissiveIntensity: 0.6 })); sign.position.set(0, t.cabin[1][1] + 0.11, (t.cabin[1][0] + t.cabin[2][0]) / 2); body.add(sign);
      const check = new THREE.Mesh(rbox(t.wid + 0.02, 0.18, t.len * 0.7, 0.04), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 })); check.position.set(0, 0.7, 0); body.add(check);
    }
    if (t.ems === 'amb') { // red stripe + cross + red lightbar
      const stripeM = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.4 }); stripeM.userData.shared = true;
      part(stripeM, t.wid + 0.03, 0.4, t.len * 0.7, 0, 0.9, -0.3);
      part(plateMat, 0.5, 0.5, 0.03, t.wid / 2 + 0.02, 1.4, -0.6); part(stripeM, 0.34, 0.12, 0.04, t.wid / 2 + 0.02, 1.4, -0.6); part(stripeM, 0.12, 0.34, 0.04, t.wid / 2 + 0.02, 1.4, -0.6);
      const bar = new THREE.Mesh(rbox(1.0, 0.12, 0.26, 0.05), trimMat); bar.position.set(0, roofY + 0.05, cabMidZ + 0.5); body.add(bar);
      this.sirenR = new THREE.MeshBasicMaterial({ color: 0xff2020, toneMapped: false }); this.sirenB = new THREE.MeshBasicMaterial({ color: 0xff2020, toneMapped: false });
      const lr = new THREE.Mesh(rbox(0.4, 0.12, 0.24, 0.05), this.sirenR); lr.position.set(-0.28, roofY + 0.13, cabMidZ + 0.5); body.add(lr);
      const lb = new THREE.Mesh(rbox(0.4, 0.12, 0.24, 0.05), this.sirenB); lb.position.set(0.28, roofY + 0.13, cabMidZ + 0.5); body.add(lb);
      this.sirenY = roofY + 0.6;
    }
    if (t.ems === 'fire') { // ladder + silver shutters + red lightbar      part(chromeMat, 0.08, 0.08, t.len * 0.5, -0.3, roofY + 0.08, -0.5); part(chromeMat, 0.08, 0.08, t.len * 0.5, 0.3, roofY + 0.08, -0.5);
      for (let i = 0; i < 5; i++) part(chromeMat, 0.6, 0.05, 0.05, 0, roofY + 0.08, -2.2 + i * 0.85);
      const shutM = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, roughness: 0.3, metalness: 0.7 }); shutM.userData.shared = true;
      part(shutM, 0.03, 0.9, t.len * 0.4, t.wid / 2 + 0.01, 1.3, -1.2); part(shutM, 0.03, 0.9, t.len * 0.4, -(t.wid / 2 + 0.01), 1.3, -1.2);
      const bar = new THREE.Mesh(rbox(1.0, 0.12, 0.26, 0.05), trimMat); bar.position.set(0, roofY + 0.05, cabFront - 0.3); body.add(bar);
      this.sirenR = new THREE.MeshBasicMaterial({ color: 0xff2020, toneMapped: false }); this.sirenB = new THREE.MeshBasicMaterial({ color: 0xff2020, toneMapped: false });
      const lr = new THREE.Mesh(rbox(0.4, 0.12, 0.24, 0.05), this.sirenR); lr.position.set(-0.28, roofY + 0.13, cabFront - 0.3); body.add(lr);
      const lb = new THREE.Mesh(rbox(0.4, 0.12, 0.24, 0.05), this.sirenB); lb.position.set(0.28, roofY + 0.13, cabFront - 0.3); body.add(lb);
      this.sirenY = roofY + 0.6;
    }
    if (t.cls === 'heli') { // tail boom + fin + main rotor + skids (no wheels: skids instead)
      const boomLen = t.len * 0.55;
      const boom = new THREE.Mesh(cylX(0.09, boomLen, 8), this.paint); boom.position.set(0, roofY + 0.05, -t.len / 2 - boomLen / 2 + 0.4); body.add(boom);
      part(trimMat, 0.08, 1.1, 0.5, 0, roofY + 0.5, -t.len / 2 - boomLen + 0.4); // tail fin
      // tail rotor (spins)
      const tr = new THREE.Group(); tr.position.set(0.12, roofY + 0.6, -t.len / 2 - boomLen + 0.4); body.add(tr);
      const trb = new THREE.Mesh(rbox(0.06, 1.1, 0.12, 0.02), trimMat); tr.add(trb);
      this.tailRotor = tr;
      // mast + main rotor (spins)
      part(trimMat, 0.16, 0.5, 0.16, 0, roofY + 0.25, cabMidZ);
      const rotor = new THREE.Group(); rotor.position.set(0, roofY + 0.55, cabMidZ); body.add(rotor);
      const bladeGeo = partGeo('heliblade', () => { const b = new THREE.BoxGeometry(t.len * 1.35, 0.05, 0.28); return b; });
      const b1 = new THREE.Mesh(bladeGeo, trimMat); b1.castShadow = true; rotor.add(b1);
      const b2 = new THREE.Mesh(bladeGeo, trimMat); b2.rotation.y = Math.PI / 2; rotor.add(b2);
      this.rotor = rotor;
      // skids
      for (const s of [-1, 1]) {
        const skid = new THREE.Mesh(cylX(0.05, t.len * 0.7, 8), chromeMat); skid.rotation.y = Math.PI / 2; skid.position.set(s * (t.wid / 2 - 0.25), 0.18, 0); body.add(skid);
        part(trimMat, 0.08, 0.5, 0.08, s * (t.wid / 2 - 0.25), 0.45, t.len * 0.2);
        part(trimMat, 0.08, 0.5, 0.08, s * (t.wid / 2 - 0.25), 0.45, -t.len * 0.2);
      }
      if (t.cop) { // police searchlight + stripe
        part(plateMat, t.wid + 0.03, 0.3, t.len * 0.4, 0, 0.85, 0.3);
        const lamp = new THREE.Mesh(partGeo('swheel', () => new THREE.TorusGeometry(0.16, 0.025, 8, 18)), chromeMat);
        lamp.position.set(0.5, 0.7, t.len / 2 - 0.3); body.add(lamp);
        this.sirenR = new THREE.MeshBasicMaterial({ color: 0xff2020, toneMapped: false }); this.sirenB = new THREE.MeshBasicMaterial({ color: 0x2060ff, toneMapped: false });
        this.sirenY = roofY + 0.8;
      }
    }
    if (t.cls === 'plane') { // wings + tail + prop(s) + fixed gear
      const big = t.len > 8;
      part(this.paint, t.wid * (big ? 5.2 : 3.4), 0.09, big ? 1.5 : 1.1, 0, roofY - 0.1, cabMidZ + (big ? 0.4 : 0.2)); // main wing
      part(this.paint, t.wid * 1.1, 0.08, 0.8, 0, roofY + (big ? 0.9 : 0.5), -t.len / 2 + 0.6); // stabilizer
      part(this.paint, 0.09, big ? 1.6 : 1.1, 0.9, 0, roofY + (big ? 1.4 : 0.9), -t.len / 2 + 0.6); // fin
      // prop(s) at the nose (spin)
      const prop = new THREE.Group(); prop.position.set(0, roofY - 0.35, t.len / 2 + 0.15); body.add(prop);
      const pg = partGeo('propblade', () => new THREE.BoxGeometry(0.16, 2.0, 0.06));
      const p1 = new THREE.Mesh(pg, trimMat); prop.add(p1);
      const p2 = new THREE.Mesh(pg, trimMat); p2.rotation.z = Math.PI / 2; prop.add(p2);
      this.rotor = prop; this.propAxis = 'z';
      if (big) { // twin underwing engines
        for (const s of [-1, 1]) { const eng = new THREE.Mesh(cylX(0.32, 1.8, 10), this.paint); eng.position.set(s * t.wid * 1.4, roofY - 0.35, cabMidZ + 0.4); body.add(eng); }
      }
    }
    if (t.cls === 'utility') {
      if (t.name === 'forklift') { // mast + forks + overhead cage
        for (const s of [-1, 1]) part(trimMat, 0.1, 1.6, 0.1, s * 0.5, 1.1, t.len / 2 - 0.1);
        part(trimMat, 1.1, 0.1, 0.1, 0, 1.9, t.len / 2 - 0.1);
        for (const s of [-1, 1]) part(chromeMat, 0.12, 0.08, 1.1, s * 0.28, 0.35, t.len / 2 + 0.45); // forks
        for (const s of [-1, 1]) for (const e of [-1, 1]) part(trimMat, 0.08, 1.0, 0.08, s * 0.55, 1.9, e * 0.5); // cage posts
        part(trimMat, 1.2, 0.08, 1.1, 0, 2.4, 0); // cage roof
      }
      if (t.name === 'tug') { // tow hitch + amber beacon
        part(chromeMat, 0.08, 0.08, 0.7, 0, 0.35, -t.len / 2 - 0.3);
        part(amberMat, 0.12, 0.12, 0.12, 0, 1.65, 0);
      }
      if (t.name === 'icecream') { // serving hatch + giant cone on the roof
        part(tintMat, t.wid * 0.7, 0.6, 0.06, t.wid / 2 + 0.01, 1.4, -0.3); // hatch
        const cone = new THREE.Mesh(partGeo('icecone', () => new THREE.ConeGeometry(0.3, 0.7, 10)), coneMat); cone.position.set(0, roofY + 0.75, -0.3); body.add(cone);
        const scoop = new THREE.Mesh(partGeo('icescoop', () => new THREE.SphereGeometry(0.32, 10, 8)), scoopMat); scoop.position.set(0, roofY + 1.2, -0.3); body.add(scoop);
      }
      if (t.name === 'securicar') { // armored panels + roof hatch
        part(trimMat, t.wid + 0.04, 0.5, t.len * 0.8, 0, 0.75, -0.2);
        part(trimMat, 0.6, 0.1, 0.6, 0, roofY + 0.05, -0.2);
      }
      if (t.name === 'mower') { // cutting deck + driver perch + handle
        part(trimMat, 1.0, 0.18, 1.2, 0, 0.3, 0);
        part(trimMat, 0.5, 0.5, 0.08, 0, 0.7, -0.55);
        part(chromeMat, 0.05, 0.7, 0.05, -0.3, 0.9, -0.75); part(chromeMat, 0.05, 0.7, 0.05, 0.3, 0.9, -0.75);
      }
    }
    // seat anchor — right-hand drive (driver on the right, +x = right of forward)
    this.seat = new THREE.Object3D(); this.seat.position.set(0.38, 0.3 + (t.cabin[0][1] - 0.86), (t.cabin[0][0] + t.cabin[t.cabin.length - 1][0]) / 2 - 0.2); body.add(this.seat);    // smoke/fire anchor at the hood
    this.hood = new THREE.Object3D(); this.hood.position.set(0, hy + 0.1, t.len / 2 - 0.8); body.add(this.hood);
  }

  get speed() { const s = Math.sin(this.heading), c = Math.cos(this.heading); return this.vx * s + this.vz * c; }
  get absSpeed() { return Math.hypot(this.vx, this.vz); }
  setPosition(x, z, heading) { this.x = x; this.z = z; this.heading = heading; this.vx = this.vz = 0; this.angVel = 0; this.syncMesh(); }

  syncMesh() { this.group.position.set(this.x, this.y, this.z); this.group.rotation.y = this.heading; }

  // Core arcade physics step. hash = city collider hash, ground(x,z) height fn.
  update(dt, world) {
    const t = this.type;
    if (this.destroyed) { this.throttle = 0; this.brake = 0; this.steerInput = 0; }
    const s = Math.sin(this.heading), c = Math.cos(this.heading);
    const fx = s, fz = c, rx = c, rz = -s;
    let vf = this.vx * fx + this.vz * fz, vr = this.vx * rx + this.vz * rz;
    const speedRatio = Math.abs(vf) / t.maxSpeed;
    if (t.fly) { this.stepFlight(dt, world, t, vf, vr); return; }
    // engine / brakes
    if (this.throttle > 0) {
      const a = t.accel * this.throttle * Math.max(0.15, 1 - speedRatio * speedRatio); vf += a * dt;
    }
    this.braking = false;
    if (this.brake > 0) {
      if (vf > 0.6) { vf -= t.brake * this.brake * dt; this.braking = true; if (vf < 0) vf = 0; }
      else if (vf > -t.maxSpeed * 0.35) { vf -= t.accel * 0.6 * this.brake * dt; }
    }
    if (this.handbrake && Math.abs(vf) > 0.2) { vf -= Math.sign(vf) * 6 * dt; this.braking = true; }
    // drag & rolling resistance
    vf -= vf * (0.04 + 0.0015 * Math.abs(vf)) * dt;
    if (this.throttle === 0 && this.brake === 0) vf -= Math.sign(vf) * Math.min(Math.abs(vf), 1.2 * dt);
    if (this.destroyed) vf -= Math.sign(vf) * Math.min(Math.abs(vf), 4 * dt);
    // lateral grip (handbrake -> drift)
    const gripBase = t.grip * (this.handbrake ? 0.22 : 1);
    const slide = Math.min(1, Math.abs(vr) / 9);
    const grip = gripBase * (1 - slide * 0.55);
    vr *= Math.exp(-grip * dt);
    // steering: full lock at low speed, tight at high speed
    const steerFalloff = 1 / (1 + Math.pow(Math.abs(vf) / 16, 1.5));
    const targetSteer = this.steerInput * t.steer * (0.35 + 0.65 * steerFalloff);
    this.steer = damp(this.steer, targetSteer, 10, dt);
    let yawRate = (vf / this.wheelbase) * Math.tan(this.steer) * 0.85;
    if (this.handbrake) yawRate *= 1.55;
    yawRate = clamp(yawRate, -2.6, 2.6);
    this.angVel = damp(this.angVel, yawRate, 8, dt);
    this.heading += this.angVel * dt;
    // recompose velocity in the new frame
    const s2 = Math.sin(this.heading), c2 = Math.cos(this.heading);
    this.vx = s2 * vf + c2 * vr; this.vz = c2 * vf - s2 * vr;
    this.x += this.vx * dt; this.z += this.vz * dt;
    // ground follow & water
    const gh = world.ground(this.x, this.z);
    if (this.y > gh + 0.05) { this.vy -= 22 * dt; this.y += this.vy * dt; this.airT += dt; if (this.y < gh) { this.y = gh; if (this.vy < -6) this.damage(-this.vy * 1.5, 'fall'); this.vy = 0; } }
    else { this.y = damp(this.y, gh, 12, dt); this.vy = 0; this.airT = 0; }
    // planted on asphalt: glue wheels to the road surface so cars never hover
    // or sink on decks/ramps (only when settled — jumps, crashes and launches still fly)
    if (!this.destroyed && world.onRoad && world.onRoad(this.x, this.z) && this.vy <= 1 && this.airT < 0.25 && Math.abs(this.y - gh) < 0.9) {
      this.y = gh; this.vy = 0; this.airT = 0;
    }
    if (world.isWater(this.x, this.z)) { this.waterT = (this.waterT || 0) + dt; this.vx *= 0.96; this.vz *= 0.96; if (this.waterT > 1.5 && !this.destroyed) this.kill('drown'); } else this.waterT = 0;
    // collisions with static world
    const hit = resolveOBB(world.hash, this, this.halfL, this.halfW);
    this.lastHit = null;
    if (hit) {
      const vn = this.vx * hit.nx + this.vz * hit.nz;
      if (vn < 0) {
        const rest = 0.25; this.vx -= (1 + rest) * vn * hit.nx; this.vz -= (1 + rest) * vn * hit.nz;
        const impact = -vn; if (impact > 3) { this.damage(impact * 1.6, 'crash'); this.lastHit = { impact, nx: hit.nx, nz: hit.nz, box: hit.box }; }
        // scrape: kill some tangential speed & spin a little
        this.vx *= 0.92; this.vz *= 0.92; this.angVel += (Math.random() - 0.5) * impact * 0.05;
      }
    }
    // fire / explosion timeline
    if (this.onFire && !this.destroyed) { this.fireT += dt; if (this.fireT > 3.5) this.explode(world); }
    // visuals
    this.wheelSpin += vf * dt / t.wheelR;
    for (const w of this.wheels) { w.pivot.rotation.y = w.front ? this.steer : 0; w.mesh.rotation.x = this.wheelSpin; w.rim.rotation.x = this.wheelSpin; }
    const latAcc = (vr - (this._pvr || 0)) / Math.max(dt, 1e-3); this._pvr = vr; const lonAcc = (vf - (this._pvf || 0)) / Math.max(dt, 1e-3); this._pvf = vf;
    this.body.rotation.z = damp(this.body.rotation.z, clamp(-this.angVel * Math.abs(vf) * 0.006 + latAcc * 0.002, -0.08, 0.08), 6, dt);
    this.body.rotation.x = damp(this.body.rotation.x, clamp(-lonAcc * 0.004, -0.05, 0.05), 6, dt);
    this.tailMat.emissiveIntensity = this.braking ? 3.0 : (this.lightsOn ? 1.0 : 0.3);
    this.headMat.emissiveIntensity = this.lightsOn ? 3.0 : 0.3;
    if ((this.type.cop || this.type.ems) && this.sirenOn) {
      const ph = (performance.now() / 180) % 2 < 1;
      this.sirenR.color.setHex(ph ? 0xff2020 : 0x300000); this.sirenB.color.setHex(ph ? 0x100030 : 0x2060ff); this.sirenPhase = ph;
    } else if (this.sirenR) { this.sirenR.color.setHex(0x801010); this.sirenB.color.setHex(0x102080); }
    this.syncMesh();
  }

  // Arcade flight: helis climb/descend on throttle/brake and yaw on steer;
  // planes behave like cars on the ground and fly once fast (W = power,
  // S = slow down, Space = pull up, A/D = bank & turn).
  stepFlight(dt, world, t, vf, vr) {
    const s = Math.sin(this.heading), c = Math.cos(this.heading);
    // support surface: terrain/deck normally, rooftops when low over them —
    // this is what lets planes and helis touch down on top of buildings
    const gh = world.hash
      ? standingSurface(world.hash, this.x, this.z, this.y, world.ground(this.x, this.z))
      : world.ground(this.x, this.z);
    if (t.fly === 'heli') {
      // yaw + vertical
      this.steer = damp(this.steer, this.steerInput * 1.4, 8, dt);
      this.heading += this.steer * dt;
      const climb = this.throttle > 0 ? 9 * this.throttle : 0;
      const sink = this.brake > 0 ? -8 * this.brake : 0;
      this.vy = damp(this.vy, climb + sink, 4, dt);
      // forward thrust along heading, hard lateral damping (coordinated flight)
      const target = this.throttle * t.maxSpeed * 0.85;
      vf = damp(vf, target, 1.6, dt); vr *= Math.exp(-3 * dt);
      if (this.handbrake) { vf *= Math.exp(-4 * dt); vr *= Math.exp(-4 * dt); } // hover brake
      const ns = Math.sin(this.heading), nc = Math.cos(this.heading);
      this.vx = ns * vf + nc * vr; this.vz = nc * vf - ns * vr;
      this.x += this.vx * dt; this.z += this.vz * dt;
      this.y += this.vy * dt;
      const floor = Math.max(gh + 0.5, world.isWater(this.x, this.z) ? 0.4 : -Infinity);
      if (this.y < floor) { this.y = floor; if (this.vy < -7) this.damage(-this.vy * 1.2, 'crash'); this.vy = Math.max(0, this.vy); }
      this.airT = this.y > gh + 1 ? this.airT + dt : 0;
      // pose: pitch with speed, bank with yaw
      this.body.rotation.x = damp(this.body.rotation.x, clamp(-vf * 0.008, -0.2, 0.12), 5, dt);
      this.body.rotation.z = damp(this.body.rotation.z, clamp(this.steer * 0.25, -0.3, 0.3), 5, dt);
    } else {
      // ---- plane ----
      const airborne = this.airborne || this.y > gh + 0.6;
      if (!airborne) {
        // ground roll: car-like, rotate when fast (holding Space pulls back
        // for an earlier rotation). Liftoff speed sits above stall speed and
        // the plane leaves the ground WITH altitude + climb rate, so the
        // touchdown line can't catch it on the next frame (no more porpoising).
        const a = t.accel * 1.9 * this.throttle * Math.max(0.15, 1 - Math.abs(vf) / t.maxSpeed); vf += a * dt;
        if (this.brake > 0 && vf > 0) vf = Math.max(0, vf - t.brake * this.brake * dt);
        vf -= vf * 0.04 * dt;
        vr *= Math.exp(-t.grip * dt);
        this.steer = damp(this.steer, this.steerInput * t.steer, 10, dt);
        this.heading += (vf / this.wheelbase) * Math.tan(this.steer) * 0.85 * dt;
        const ns = Math.sin(this.heading), nc = Math.cos(this.heading);
        this.vx = ns * vf + nc * vr; this.vz = nc * vf - ns * vr;
        this.x += this.vx * dt; this.z += this.vz * dt;
        const surf = world.hash
          ? standingSurface(world.hash, this.x, this.z, this.y + 1.0, world.ground(this.x, this.z))
          : world.ground(this.x, this.z);
        if (surf < this.y - 1.5) { this.airborne = true; this.liftT = 0; } // rolled off the roof edge: fall, don't teleport
        else {
          this.y = surf; this.vy = 0; this.airT = 0;
          const rotateAt = t.maxSpeed * (this.handbrake ? 0.38 : 0.44);
          if (vf > rotateAt && this.throttle > 0.3) { this.airborne = true; this.y = surf + 0.6; this.vy = 4.5; this.liftT = 1.2; }
        }
      } else {
        this.airborne = true;
        // engine + drag toward throttle-set airspeed
        vf = damp(vf, this.throttle * t.maxSpeed, 0.5, dt);
        if (this.brake > 0) vf = Math.max(12, vf - 14 * this.brake * dt);
        vr *= Math.exp(-2 * dt);
        // turns bank the wings
        this.steer = damp(this.steer, this.steerInput, 6, dt);
        this.heading += this.steer * (0.35 + Math.abs(vf) / 55) * dt;
        // lift: fast = climb, slow = sink, Space = pull up (bleeds speed)
        const stall = t.maxSpeed * 0.4;
        let vyT = clamp((vf - stall) * 0.5, -10, 10);
        if (this.handbrake) { vyT += 8; vf -= 6 * dt; }
        if (this.liftT > 0) { this.liftT -= dt; vyT = Math.max(vyT, 2.5); } // climb-out assist right after rotation (landings unaffected)
        this.vy = damp(this.vy, vyT, 2.5, dt);
        const ns = Math.sin(this.heading), nc = Math.cos(this.heading);
        this.vx = ns * vf + nc * vr; this.vz = nc * vf - ns * vr;
        this.x += this.vx * dt; this.z += this.vz * dt;
        this.y += this.vy * dt;
        if (this.y <= gh + 0.3) { // touchdown (or crash)
          this.y = gh + 0.3;
          if (this.vy < -9) this.damage(-this.vy * 1.6, 'crash');
          this.vy = 0; this.airborne = false;
        }
        this.airT += dt;
        this.body.rotation.x = damp(this.body.rotation.x, clamp(-this.vy * 0.03, -0.35, 0.35), 4, dt);
        this.body.rotation.z = damp(this.body.rotation.z, clamp(-this.steer * 0.5, -0.6, 0.6), 4, dt);
      }
    }
    // water: only when actually touching it
    if (world.isWater(this.x, this.z) && this.y < 0.2) {
      this.waterT = (this.waterT || 0) + dt; this.vx *= 0.96; this.vz *= 0.96;
      if (this.waterT > 1.2 && !this.destroyed) this.kill('drown');
    } else this.waterT = 0;
    // collisions (altitude-aware: boxes below us are skipped in resolveOBB)
    const hit = resolveOBB(world.hash, this, this.halfL, this.halfW);
    this.lastHit = null;
    if (hit) {
      const vn = this.vx * hit.nx + this.vz * hit.nz;
      if (vn < 0) {
        const rest = 0.25; this.vx -= (1 + rest) * vn * hit.nx; this.vz -= (1 + rest) * vn * hit.nz;
        const impact = -vn; if (impact > 3) { this.damage(impact * 1.6, 'crash'); this.lastHit = { impact, nx: hit.nx, nz: hit.nz, box: hit.box }; }
        this.vx *= 0.92; this.vz *= 0.92;
        if (t.fly === 'plane' && this.airborne && impact > 6) { this.vy = Math.min(this.vy, -4); }
      }
    }
    if (this.onFire && !this.destroyed) { this.fireT += dt; if (this.fireT > 3.5) this.explode(world); }
    // rotor / prop spin (spools with throttle)
    const spin = 6 + this.throttle * 30;
    if (this.rotor) {
      if (this.propAxis === 'z') this.rotor.rotation.z += spin * dt;
      else this.rotor.rotation.y += spin * dt;
    }
    if (this.tailRotor) this.tailRotor.rotation.x += spin * 1.4 * dt;
    this.tailMat.emissiveIntensity = this.braking ? 3.0 : (this.lightsOn ? 1.0 : 0.3);
    this.headMat.emissiveIntensity = this.lightsOn ? 3.0 : 0.3;
    if ((this.type.cop || this.type.ems) && this.sirenOn) {
      const ph = (performance.now() / 180) % 2 < 1;
      this.sirenR.color.setHex(ph ? 0xff2020 : 0x300000); this.sirenB.color.setHex(ph ? 0x100030 : 0x2060ff); this.sirenPhase = ph;
    } else if (this.sirenR) { this.sirenR.color.setHex(0x801010); this.sirenB.color.setHex(0x102080); }
    this.syncMesh();
  }

  setLights(on) { this.lightsOn = on; }

  damage(amount, cause, source = null) {
    if (this.destroyed) return;
    const byPlayer = !!(source && (source.kind === 'player' || source.control === 'player' || source.driver?.kind === 'player' || source.byPlayer || source.lastDamage?.byPlayer));
    this.health -= amount; this.lastDamage = { amount, cause, t: performance.now(), byPlayer: byPlayer || (this.lastDamage?.byPlayer && performance.now() - this.lastDamage.t < 4000) };
    this.onDamaged?.(amount, cause);
    if (this.health < 25 && !this.onFire) { this.onFire = true; this.fireT = 0; }
    if (this.health <= -40) this.explode(this.world);
  }
  kill(cause) { if (this.destroyed) return; this.destroyed = true; this.onFire = false; this.paint.color.setHex(0x1a1a1a); this.paint.roughness = 0.95; this.paint.metalness = 0.1; this.headMat.emissiveIntensity = 0; this.tailMat.emissiveIntensity = 0; this.setLights(false); this.sirenOn = false; this.onDestroyed?.(cause); }
  explode(world) { if (this.destroyed) return; this.kill('explode'); this.vy = 6; this.y += 0.1; this.angVel += (Math.random() - 0.5) * 3; this.onExploded?.(); }
  dispose() {
    this.group.parent?.remove(this.group);
    const geos = new Set(), mats = new Set();
    this.group.traverse(o => { if (o.geometry) geos.add(o.geometry); const list = Array.isArray(o.material) ? o.material : [o.material]; for (const m of list) if (m) mats.add(m); });
    for (const geo of geos) if (!geo.userData.shared) geo.dispose();
    for (const m of mats) if (!m.userData.shared) m.dispose();
  }
}

// Pairwise car-vs-car collision (two circles per car). Applies impulses and returns impact magnitude.
const A = { x: 0, z: 0 }, B = { x: 0, z: 0 };
export function collideVehicles(a, b) {
  if (Math.abs((a.y || 0) - (b.y || 0)) > 3) return 0; // different altitudes (aircraft overfly)
  const dxC = a.x - b.x, dzC = a.z - b.z; const rr = a.halfL + b.halfL;
  if (dxC * dxC + dzC * dzC > rr * rr) return 0;
  let maxImpact = 0;
  const sa = Math.sin(a.heading), ca = Math.cos(a.heading), sb = Math.sin(b.heading), cb = Math.cos(b.heading);
  const offA = a.halfL - a.halfW, offB = b.halfL - b.halfW; const ra = a.halfW + 0.05, rb = b.halfW + 0.05;
  for (const ka of [-1, 0, 1]) for (const kb of [-1, 0, 1]) {
    A.x = a.x + sa * offA * ka; A.z = a.z + ca * offA * ka; B.x = b.x + sb * offB * kb; B.z = b.z + cb * offB * kb;
    const dx = A.x - B.x, dz = A.z - B.z; const d2 = dx * dx + dz * dz; const minD = ra + rb;
    if (d2 >= minD * minD || d2 < 1e-6) continue;
    const d = Math.sqrt(d2); const nx = dx / d, nz = dz / d; const pen = minD - d;
    const ma = a.type.mass, mb = b.type.mass; const tot = ma + mb;
    a.x += nx * pen * (mb / tot); a.z += nz * pen * (mb / tot); b.x -= nx * pen * (ma / tot); b.z -= nz * pen * (ma / tot);
    const rvx = a.vx - b.vx, rvz = a.vz - b.vz; const vn = rvx * nx + rvz * nz;
    if (vn < 0) {
      const e = 0.35; const j = -(1 + e) * vn / (1 / ma + 1 / mb);
      a.vx += j / ma * nx; a.vz += j / ma * nz; b.vx -= j / mb * nx; b.vz -= j / mb * nz;
      // spin from off-centre hits
      a.angVel += (ka * 0.35) * (vn) * -0.15 * (nx * ca - nz * sa) * (mb / tot); b.angVel += (kb * 0.35) * (vn) * 0.15 * (nx * cb - nz * sb) * (ma / tot);
      const impact = -vn; maxImpact = Math.max(maxImpact, impact);
      if (impact > 2.5) { a.damage(impact * 1.2 * (mb / tot) * 2, 'car', b); b.damage(impact * 1.2 * (ma / tot) * 2, 'car', a); a.lastCarHit = { other: b, impact }; b.lastCarHit = { other: a, impact }; }
    }
  }
  return maxImpact;
}
