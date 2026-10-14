/**
 * APEX GP — open world: drivable GTA street car.
 *
 * Arcade car ported from `fable-sandbox/gta_fable5.1` vehicle.js: extruded
 * side-silhouette bodies per type, speed-sensitive steering, lateral grip
 * with handbrake drifts, brake/reverse, OBB-vs-world collision. Rewritten
 * for this tree (assets-cached geometries/materials, seeded colours from
 * the traffic entry, city collider hash, no Math.random).
 *
 * Deliberately NOT ported: damage/fire/explosions, police/taxi extras beyond
 * the taxi sign, headlight spotlights. A fender-bender scrubs speed and
 * shakes the camera instead of writing off the car.
 *
 * Conventions (fable, kept verbatim — see header): heading grows toward +x
 * with forward = (sin h, cos h); the mesh faces +z at heading 0. The APEX
 * chase rig reads the opposite convention, so `target.quaternion` carries
 * heading + π while the mesh itself stays fable-true.
 *
 * PUBLIC API:
 *   new StreetCar(scene, typeName, color)
 *   car.update(dt, city, controls)  // { throttle, brake, steer, handbrake }
 *   car.target                       // { position, quaternion, speed, telemetry }
 *   car.absSpeed() / car.velHeading()
 *   car.syncMesh() / car.dispose()
 */

import * as THREE from 'three';
import { assets } from '../core/assets.js';
import { clamp, lerp } from '../core/rng.js';
import {
  mapsToMaterial, cloneMaps, setRepeat, carPaint,
} from '../textures/procedural.js';

/** Shared paint detail (2 m tile over metre-scale extrusion UVs). */
export function paintMaps() {
  const m = cloneMaps(assets.get('world/streetcar/paint', () => carPaint({ key: 'world/streetcar/paint' })));
  setRepeat(m, 0.5, 0.5);
  return m;
}

export const VEHICLE_TYPES = {
  sedan: { len: 4.5, wid: 1.85, mass: 1300, maxSpeed: 38, accel: 9, brake: 22, grip: 7.5, steer: 0.55, wheelR: 0.34, colors: [0xc0392b, 0x2980b9, 0xecf0f1, 0x2c3e50, 0x7f8c8d, 0x27ae60, 0x8e44ad, 0xf39c12, 0x1a1a1a, 0xd35400],
    profile: [[-2.25, 0.3], [-2.25, 0.78], [-1.85, 0.84], [-1.35, 0.86], [-0.85, 1.36], [0.55, 1.4], [1.25, 0.96], [2.05, 0.86], [2.25, 0.55], [2.25, 0.3]], cabin: [[-1.35, 0.86], [-0.85, 1.36], [0.55, 1.4], [1.25, 0.96]] },
  sports: { len: 4.4, wid: 1.95, mass: 1200, maxSpeed: 52, accel: 14, brake: 26, grip: 9.5, steer: 0.5, wheelR: 0.33, colors: [0xff2d2d, 0xffd600, 0x00c2ff, 0xffffff, 0x111111, 0xff7a00, 0x9b59b6],
    profile: [[-2.2, 0.3], [-2.2, 0.72], [-1.7, 0.8], [-1.1, 0.82], [-0.5, 1.15], [0.6, 1.18], [1.3, 0.8], [2.1, 0.66], [2.2, 0.45], [2.2, 0.3]], cabin: [[-1.1, 0.82], [-0.5, 1.15], [0.6, 1.18], [1.3, 0.8]] },
  suv: { len: 4.8, wid: 2.0, mass: 2000, maxSpeed: 34, accel: 8, brake: 20, grip: 6.5, steer: 0.5, wheelR: 0.4, colors: [0x2c3e50, 0x1a1a1a, 0xecf0f1, 0x6d4c41, 0x556b2f, 0x7f8c8d],
    profile: [[-2.4, 0.4], [-2.4, 1.1], [-2.3, 1.85], [-2.0, 1.9], [1.0, 1.9], [1.5, 1.2], [2.3, 1.1], [2.4, 0.6], [2.4, 0.4]], cabin: [[-2.3, 1.1], [-2.25, 1.82], [1.0, 1.82], [1.45, 1.2]] },
  van: { len: 5.0, wid: 2.0, mass: 2200, maxSpeed: 30, accel: 6, brake: 18, grip: 6, steer: 0.45, wheelR: 0.38, colors: [0xecf0f1, 0xbdc3c7, 0x2980b9, 0xc0392b, 0xf1c40f],
    profile: [[-2.5, 0.4], [-2.5, 2.1], [0.9, 2.1], [1.6, 1.25], [2.4, 1.15], [2.5, 0.6], [2.5, 0.4]], cabin: [[0.7, 1.3], [0.9, 2.0], [0.95, 2.0], [1.55, 1.3]] },
  pickup: { len: 5.2, wid: 2.0, mass: 1900, maxSpeed: 36, accel: 8.5, brake: 20, grip: 6.5, steer: 0.5, wheelR: 0.4, colors: [0xc0392b, 0x2c3e50, 0xecf0f1, 0x6d4c41, 0x7f8c8d],
    profile: [[-2.6, 0.45], [-2.6, 1.15], [-0.3, 1.15], [-0.3, 1.85], [0.9, 1.85], [1.5, 1.2], [2.5, 1.1], [2.6, 0.6], [2.6, 0.45]], cabin: [[-0.25, 1.2], [-0.25, 1.78], [0.9, 1.78], [1.45, 1.2]] },
  taxi: { base: 'sedan', colors: [0xf5c518], maxSpeed: 40 },
};
for (const k in VEHICLE_TYPES) {
  const t = VEHICLE_TYPES[k];
  if (t.base) VEHICLE_TYPES[k] = { ...VEHICLE_TYPES[t.base], ...t, name: k };
  else t.name = k;
}
export const STREET_TYPES = ['sedan', 'sedan', 'sedan', 'sports', 'suv', 'van', 'pickup', 'taxi'];

export function profileGeometry(type, key, pts, width, bevel) {
  return assets.geometry(`world/streetcar/${type.name}/${key}/${width}`, () => {
    const shape = new THREE.Shape();
    pts.forEach((p, i) => (i === 0 ? shape.moveTo(p[0], p[1]) : shape.lineTo(p[0], p[1])));
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: width, bevelEnabled: bevel, bevelThickness: 0.05, bevelSize: 0.05,
      bevelSegments: 2, curveSegments: 2,
    });
    geo.rotateY(-Math.PI / 2);
    geo.translate(width / 2, 0, 0); // length -> +z (front), width centred on x
    geo.computeVertexNormals();
    return geo;
  });
}

export function sharedMats() {
  return {
    glass: assets.material('world/streetcar/glass', () => new THREE.MeshStandardMaterial({
      color: 0x1a2c3c, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.55,
    })),
    tire: assets.material('world/streetcar/tire', () => new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.95 })),
    rim: assets.material('world/streetcar/rim', () => new THREE.MeshStandardMaterial({ color: 0xaeb4ba, roughness: 0.35, metalness: 0.9 })),
    trim: assets.material('world/streetcar/trim', () => new THREE.MeshStandardMaterial({ color: 0x1c1f22, roughness: 0.5, metalness: 0.4 })),
  };
}

export function wheelGeos(wheelR) {
  return assets.geometry(`world/streetcar/wheel/${wheelR}`, () => {
    const a = new THREE.CylinderGeometry(wheelR, wheelR, 0.26, 16);
    a.rotateZ(Math.PI / 2);
    const b = new THREE.CylinderGeometry(wheelR * 0.68, wheelR * 0.68, 0.27, 12);
    b.rotateZ(Math.PI / 2);
    return [a, b];
  });
}

const _e = new THREE.Euler();
const _samples = [];
/** Module scratch for the collider query (never hold across calls). */
const _qbox = [];

// Oriented-box car vs city collider hash (ported resolveOBB): samples the
// outline, pushes out along the deepest penetration. Returns contact or null.
function resolveCar(city, car) {
  const c = Math.cos(car.heading), s = Math.sin(car.heading);
  const fx = s, fz = c, rx = c, rz = -s;
  const halfL = car.halfL, halfW = car.halfW;
  _samples.length = 0;
  for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1], [0.5, 1], [0.5, -1], [-0.5, 1], [-0.5, -1]]) {
    _samples.push([car.x + fx * halfL * a + rx * halfW * b, car.z + fz * halfL * a + rz * halfW * b]);
  }
  const R = Math.hypot(halfL, halfW);
  const boxes = city.queryBoxes(car.x - R, car.x + R, car.z - R, car.z + R, _qbox);
  let best = null;
  for (const box of boxes) {
    if (box.minY !== undefined && box.minY > 1.0) continue;
    for (let i = 0; i < _samples.length; i++) {
      const px = _samples[i][0], pz = _samples[i][1];
      if (px < box.minX || px > box.maxX || pz < box.minZ || pz > box.maxZ) continue;
      const l = px - box.minX, r = box.maxX - px, t = pz - box.minZ, bt = box.maxZ - pz;
      const m = Math.min(l, r, t, bt);
      let nx = 0, nz = 0;
      if (m === l) nx = -1; else if (m === r) nx = 1; else if (m === t) nz = -1; else nz = 1;
      if (!best || m > best.depth) best = { nx, nz, depth: m };
    }
  }
  if (best) {
    car.x += best.nx * (best.depth + 0.02);
    car.z += best.nz * (best.depth + 0.02);
  }
  return best;
}

export class StreetCar {
  constructor(scene, typeName, color) {
    const type = this.type = VEHICLE_TYPES[typeName] || VEHICLE_TYPES.sedan;
    this.scene = scene;
    this.x = 0; this.z = 0; this.y = 0;
    this.heading = 0; this.vx = 0; this.vz = 0; this.vy = 0;
    this.angVel = 0; this.steer = 0;
    this.halfL = type.len / 2; this.halfW = type.wid / 2;
    this.wheelSpin = 0;
    this.braking = false;
    this._pvr = 0; this._pvf = 0;
    this._quat = new THREE.Quaternion();
    this.target = {
      position: null, // wired to group.position in buildMesh
      quaternion: this._quat,
      speed: 0,
      telemetry: { speed: 0, gLat: 0, gLong: 0 },
    };
    this.buildMesh(color);
  }

  buildMesh(color) {
    const t = this.type;
    const shared = sharedMats();
    const g = this.group = new THREE.Group();
    g.name = 'StreetCar';
    const body = this.body = new THREE.Group();
    g.add(body);
    const pm = paintMaps();
    this.paint = new THREE.MeshStandardMaterial({
      ...mapsToMaterial(pm), color, roughness: 1.0, metalness: 1.0,
    });
    // Two-tone roof (very GTA): light cars get a dark roof and vice versa,
    // decided purely from the paint so it stays deterministic. ~30% solid.
    const lum = (0.299 * ((color >> 16) & 255) + 0.587 * ((color >> 8) & 255) + 0.114 * (color & 255)) / 255;
    const twoTone = color % 7 < 2 ? null : (lum > 0.55 ? 0x14161a : 0xe8e6e0);
    this.roofMat = twoTone !== null
      ? new THREE.MeshStandardMaterial({ ...mapsToMaterial(pm), color: twoTone, roughness: 1.0, metalness: 1.0 })
      : this.paint;
    const shell = new THREE.Mesh(profileGeometry(t, 'body', t.profile, t.wid, true), this.paint);
    shell.castShadow = true; shell.receiveShadow = true; body.add(shell);
    const cabinPts = [...t.cabin, [t.cabin[t.cabin.length - 1][0], t.cabin[0][1]]];
    const cabin = new THREE.Mesh(profileGeometry(t, 'cabin', cabinPts, t.wid + 0.04, false), shared.glass);
    cabin.position.y = 0.005; body.add(cabin);
    // Roof panel + pillars break the glasshouse into a car (not a glass blob).
    const cabX0 = t.cabin[0][0], cabX1 = t.cabin[t.cabin.length - 1][0];
    const cabTop = Math.max(t.cabin[1][1], t.cabin[2][1]);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(t.wid * 0.9, 0.06, cabX1 - cabX0), this.roofMat);
    roof.position.set(0, cabTop + 0.03, (cabX0 + cabX1) / 2);
    roof.castShadow = true; body.add(roof);
    for (const px of [cabX0 + 0.06, cabX1 - 0.06]) {
      for (const s of [-1, 1]) {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.09, cabTop - t.cabin[0][1] + 0.04, 0.09), shared.trim);
        pillar.position.set(s * (t.wid / 2 - 0.02), (t.cabin[0][1] + cabTop) / 2, px);
        body.add(pillar);
      }
    }
    // License plates front + rear, exhaust(s), antenna, wheel-well discs so
    // the tyres sit in shadow instead of intersecting flat paint.
    const plateM = assets.material('world/streetcar/plate', () => new THREE.MeshStandardMaterial({
      color: 0xe8e8e2, roughness: 0.4,
    }));
    for (const s of [1, -1]) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.03), plateM);
      plate.position.set(0, 0.52, s * (t.len / 2 + 0.045));
      body.add(plate);
    }
    const pipeM = assets.material('world/streetcar/pipe', () => new THREE.MeshStandardMaterial({
      color: 0x777777, roughness: 0.3, metalness: 0.9,
    }));
    const pipes = t.name === 'sports' ? [-0.5, 0.5] : [0.5];
    for (const px of pipes) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 10), pipeM);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(px, 0.32, -t.len / 2 - 0.06);
      body.add(pipe);
    }
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.5, 6), shared.trim);
    antenna.position.set(-(t.wid / 2 - 0.15), t.profile[1][1] + 0.25, -t.len / 2 + 0.6);
    body.add(antenna);
    const wellM = assets.material('world/streetcar/well', () => new THREE.MeshBasicMaterial({ color: 0x060607 }));
    const wellGeo = assets.geometry(`world/streetcar/well/${t.wheelR}`, () => new THREE.CircleGeometry(t.wheelR + 0.07, 14));
    {
      const wb = t.len * 0.32;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        const well = new THREE.Mesh(wellGeo, wellM);
        well.position.set(sx * (t.wid / 2 + 0.06), t.wheelR, sz * wb);
        well.rotation.y = sx > 0 ? Math.PI / 2 : -Math.PI / 2;
        body.add(well);
      }
    }
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(t.wid + 0.06, 0.05, 0.08), shared.trim);
    pillar.position.set(0, t.cabin[0][1] + 0.02, t.cabin[0][0] + 0.02); body.add(pillar);
    const bumperF = new THREE.Mesh(new THREE.BoxGeometry(t.wid * 0.98, 0.22, 0.12), shared.trim);
    bumperF.position.set(0, 0.42, t.len / 2 + 0.02); body.add(bumperF);
    const bumperR = bumperF.clone();
    bumperR.position.z = -t.len / 2 - 0.02; body.add(bumperR);
    const grille = new THREE.Mesh(new THREE.BoxGeometry(t.wid * 0.45, 0.16, 0.06), shared.trim);
    grille.position.set(0, 0.68, t.len / 2 + 0.03); body.add(grille);
    this.headMat = new THREE.MeshStandardMaterial({ color: 0xfff6e0, emissive: 0xfff2cc, emissiveIntensity: 0.3, roughness: 0.2 });
    this.tailMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, emissive: 0xff2010, emissiveIntensity: 0.4, roughness: 0.3 });
    const hy = t.profile[t.profile.length - 3][1] + 0.05;
    for (const s of [-1, 1]) {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.08), this.headMat);
      hl.position.set(s * (t.wid / 2 - 0.32), hy, t.len / 2 + 0.02); body.add(hl);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.14, 0.08), this.tailMat);
      tl.position.set(s * (t.wid / 2 - 0.3), t.profile[1][1] - 0.1, -t.len / 2 - 0.02); body.add(tl);
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.18), this.paint);
      mirror.position.set(s * (t.wid / 2 + 0.08), t.cabin[0][1] + 0.1, t.cabin[t.cabin.length - 1][0] - 0.1); body.add(mirror);
    }
    if (t.name === 'taxi') {
      const sign = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe680, emissiveIntensity: 0.6 }));
      sign.position.set(0, t.cabin[1][1] + 0.11, (t.cabin[1][0] + t.cabin[2][0]) / 2);
      body.add(sign);
      this._ownMats = (this._ownMats ?? []).concat(sign.material);
      // Chequer band down the flanks.
      const chkW = assets.material('world/streetcar/checker', () => new THREE.MeshStandardMaterial({
        color: 0x111111, roughness: 0.4,
      }));
      for (const s of [-1, 1]) {
        for (let k = 0; k < 6; k++) {
          if ((k + (s > 0 ? 0 : 1)) % 2) continue;
          const sq = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.18, 0.3), chkW);
          sq.position.set(s * (t.wid / 2 + 0.045), 0.7, -t.len * 0.28 + k * 0.32);
          body.add(sq);
        }
      }
    } else {
      const check = new THREE.Mesh(new THREE.BoxGeometry(t.wid + 0.02, 0.18, t.len * 0.7), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 }));
      check.position.set(0, 0.7, 0); body.add(check);
      this._ownMats = (this._ownMats ?? []).concat(check.material);
    }
    this.wheels = [];
    const [wg, rg] = wheelGeos(t.wheelR);
    const wb = t.len * 0.32;
    for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
      const pivot = new THREE.Group();
      pivot.position.set(sx * (t.wid / 2 - 0.12), t.wheelR, sz * wb);
      g.add(pivot);
      const w = new THREE.Mesh(wg, shared.tire);
      w.castShadow = true; pivot.add(w);
      const r = new THREE.Mesh(rg, shared.rim);
      pivot.add(r);
      this.wheels.push({ pivot, mesh: w, rim: r, front: sz > 0 });
    }
    this.wheelbase = wb * 2;
    this.scene.add(g);
    this.target.position = g.position;
    this.syncMesh();
  }

  absSpeed() { return Math.hypot(this.vx, this.vz); }
  velHeading() { return Math.atan2(this.vx, this.vz); }

  setPose(x, z, heading) {
    this.x = x; this.z = z; this.heading = heading;
    this.vx = 0; this.vz = 0; this.vy = 0; this.angVel = 0; this.steer = 0;
    this.syncMesh();
  }

  syncMesh() {
    this.group.position.set(this.x, this.y, this.z);
    this.group.rotation.set(0, this.heading, 0);
    // Rig convention is opposite (see header): converted, mesh untouched.
    this._quat.setFromEuler(_e.set(0, this.heading + Math.PI, 0));
    this.target.speed = this.absSpeed();
    this.target.telemetry.speed = this.absSpeed();
  }

  update(dt, city, c) {
    const t = this.type;
    const s = Math.sin(this.heading), co = Math.cos(this.heading);
    const fx = s, fz = co, rx = co, rz = -s;
    let vf = this.vx * fx + this.vz * fz, vr = this.vx * rx + this.vz * rz;
    const speedRatio = Math.abs(vf) / t.maxSpeed;
    if (c.throttle > 0) {
      vf += t.accel * c.throttle * Math.max(0.15, 1 - speedRatio * speedRatio) * dt;
    }
    this.braking = false;
    if (c.brake > 0) {
      if (vf > 0.6) { vf -= t.brake * c.brake * dt; this.braking = true; if (vf < 0) vf = 0; }
      else if (vf > -t.maxSpeed * 0.35) { vf -= t.accel * 0.6 * c.brake * dt; }
    }
    if (c.handbrake && Math.abs(vf) > 0.2) { vf -= Math.sign(vf) * 6 * dt; this.braking = true; }
    vf -= vf * (0.04 + 0.0015 * Math.abs(vf)) * dt;
    if (c.throttle === 0 && c.brake === 0) vf -= Math.sign(vf) * Math.min(Math.abs(vf), 1.2 * dt);
    const gripBase = t.grip * (c.handbrake ? 0.22 : 1);
    const slide = Math.min(1, Math.abs(vr) / 9);
    const grip = gripBase * (1 - slide * 0.55);
    vr *= Math.exp(-grip * dt);
    const steerFalloff = 1 / (1 + Math.pow(Math.abs(vf) / 16, 1.5));
    const targetSteer = c.steer * t.steer * (0.35 + 0.65 * steerFalloff);
    const damp = (a, b, l) => a + (b - a) * (1 - Math.exp(-l * dt));
    this.steer = damp(this.steer, targetSteer, 10);
    let yawRate = (vf / this.wheelbase) * Math.tan(this.steer) * 0.85;
    if (c.handbrake) yawRate *= 1.55;
    yawRate = clamp(yawRate, -2.6, 2.6);
    this.angVel = damp(this.angVel, yawRate, 8);
    this.heading += this.angVel * dt;
    const s2 = Math.sin(this.heading), c2 = Math.cos(this.heading);
    this.vx = s2 * vf + c2 * vr;
    this.vz = c2 * vf - s2 * vr;
    this.x += this.vx * dt;
    this.z += this.vz * dt;
    // Flat city ground (no water on the island).
    const gh = city.groundHeight(this.x, this.z);
    this.y = lerp(this.y, gh, 1 - Math.exp(-12 * dt));
    // Static-world collision: scrub + shake, no damage model.
    this.lastHit = null;
    const hit = resolveCar(city, this);
    if (hit) {
      const vn = this.vx * hit.nx + this.vz * hit.nz;
      if (vn < 0) {
        this.vx -= 1.25 * vn * hit.nx;
        this.vz -= 1.25 * vn * hit.nz;
        this.vx *= 0.92; this.vz *= 0.92;
        if (-vn > 3) this.lastHit = { impact: -vn };
      }
    }
    // Visuals: rolling/steered wheels, body lean, brake glow, night lights.
    this.wheelSpin += (vf * dt) / t.wheelR;
    for (const w of this.wheels) {
      w.pivot.rotation.y = w.front ? this.steer : 0;
      w.mesh.rotation.x = this.wheelSpin;
      w.rim.rotation.x = this.wheelSpin;
    }
    const latAcc = (vr - this._pvr) / Math.max(dt, 1e-3);
    this._pvr = vr;
    const lonAcc = (vf - this._pvf) / Math.max(dt, 1e-3);
    this._pvf = vf;
    this.body.rotation.z = damp(this.body.rotation.z, clamp(-this.angVel * Math.abs(vf) * 0.006 + latAcc * 0.002, -0.08, 0.08), 6);
    this.body.rotation.x = damp(this.body.rotation.x, clamp(-lonAcc * 0.004, -0.05, 0.05), 6);
    this.tailMat.emissiveIntensity = this.braking ? 3.0 : city.night > 0.35 ? 1.0 : 0.3;
    this.headMat.emissiveIntensity = city.night > 0.35 ? 3.0 : 0.3;
    this.syncMesh();
    return this.lastHit;
  }

  dispose() {
    const rel = this.release();
    this.scene.remove(rel.group);
    for (const m of rel.mats) m.dispose();
  }

  /**
   * Hand the visuals over (parking a stolen car in full detail): returns the
   * group plus the owned materials WITHOUT removing or disposing anything —
   * the parked pool takes ownership from here.
   */
  release() {
    const mats = [this.paint, this.headMat, this.tailMat, ...(this._ownMats ?? [])];
    if (this.roofMat !== this.paint) mats.push(this.roofMat);
    const out = { group: this.group, mats };
    this.group = null;
    this.paint = null; this.headMat = null; this.tailMat = null;
    this.roofMat = null; this._ownMats = null;
    return out;
  }
}
