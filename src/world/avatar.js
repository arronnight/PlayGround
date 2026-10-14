/**
 * APEX GP — open world: on-foot GTA avatar.
 *
 * The F1 car is gone in roam mode; the player is a procedural low-poly
 * humanoid (ported from `fable-sandbox/gta_fable5.1` character.js/player.js
 * and rewritten for this tree: seeded `rngFor` appearance, `assets`
 * materials, no weapons/combat/peds/stores — just movement) driven with
 * GTA buttons: WASD/arrows move (camera-relative, analog pace on a stick),
 * Shift / LB sprint, Space / B jump, X respawn, T street sprint, C camera.
 * Gamepad note: keyboard and pad merge in `core/input.js` state (stick =
 * move, triggers = forward/back), which is what the legs below read, so an
 * Xbox controller steers the walk for free. Sprint/jump buttons are read
 * straight off the pad here (LB = sprint, B = jump) because `input.js` maps
 * its own buttons to car actions we deliberately do not reuse.
 *
 * The avatar exposes a camera-friendly target (`{ position, quaternion,
 * speed, telemetry }` with stable live references); the GTA orbit camera
 * (`world/followCam.js`) frames it, while lighting, shadows and the post
 * stack treat it like any other subject.
 *
 * PUBLIC API (additive, see CONTRACT.md §5):
 *   new Avatar(engine)       // builds the character mesh, adds it to the scene
 *   avatar.target            // rig/HUD target (stable refs)
 *   avatar.update(dt)        // movement + animation + mesh sync (ONE FIXED STEP)
 *   avatar.respawn()         // back to the city spawn
 *   avatar.speed / .heading / .position
 *   avatar.dispose()
 */

import * as THREE from 'three';
import { assets } from '../core/assets.js';
import { clamp, lerp, rngFor } from '../core/rng.js';
import { mapsToMaterial, fabric } from '../textures/procedural.js';

const TAU = Math.PI * 2;
const _camDir = new THREE.Vector3();
const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
const angleLerp = (a, b, t) => {
  const d = (((b - a + Math.PI) % TAU) + TAU) % TAU - Math.PI;
  return a + d * t;
};
const angleDamp = (a, b, lambda, dt) => angleLerp(a, b, 1 - Math.exp(-lambda * dt));

/** First connected gamepad, if any. Mirrors input.js discovery (no alloc). */
export function readPad() {
  if (typeof navigator === 'undefined' || !navigator.getGamepads) return null;
  const pads = navigator.getGamepads();
  for (let i = 0; i < pads.length; i++) {
    if (pads[i] && pads[i].connected) return pads[i];
  }
  return null;
}
const padPressed = (pad, i) => !!(pad && pad.buttons && pad.buttons[i] && pad.buttons[i].pressed);
export { padPressed };

export const AVATAR = {
  RUN: 7.5,
  SPRINT: 10.5,
  ACCEL: 30,
  JUMP: 6.5,
  GRAVITY: 22,
  RADIUS: 0.4,
};

// --- procedural low-poly humanoid (code-driven animation rig) ----------------
// Shared by the player avatar and the street peds: identical proportions and
// walk cycle, different outfits. `mats` = { skinM, shirtM, pantsM, hairM, darkM }.

function buildLimb(w, len, m1, m2, split) {
  const grp = new THREE.Group();
  const upper = new THREE.Mesh(new THREE.BoxGeometry(w, len * split, w), m1);
  upper.position.y = -len * split / 2; upper.castShadow = true; grp.add(upper);
  const lowerG = new THREE.Group();
  lowerG.position.y = -len * split; grp.add(lowerG);
  const lower = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, len * (1 - split), w * 0.9), m2);
  lower.position.y = -len * (1 - split) / 2; lower.castShadow = true; lowerG.add(lower);
  grp.lowerG = lowerG;
  return grp;
}

/** Memoised outfit materials. `look` colours are palette-picked, so keys stay bounded. */
export function outfitMats(prefix, look) {
  // Cloth grain comes from the shared fabric bake, tinted per outfit; the
  // material colour stays white so rain-darkening (weather secondaries) and
  // instance tinting multiply a neutral base. Weave density varies a little
  // across part sizes (box UVs are 0..1 per face) — reads as cloth either way.
  const hex = (c) => c.toString(16);
  const srgb = (c) => [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255];
  const cloth = (name, color) => assets.material(`${prefix}/${name}-${hex(color)}`, () => {
    const fm = fabric({ colour: srgb(color), key: `${prefix}/fabric-${hex(color)}` });
    return new THREE.MeshStandardMaterial({ ...mapsToMaterial(fm), color: 0xffffff, roughness: 1 });
  });
  return {
    skinM: cloth('skin', look.skin),
    shirtM: cloth('shirt', look.shirt),
    pantsM: cloth('pants', look.pants),
    hairM: cloth('hair', look.hair),
    darkM: assets.material(`${prefix}/dark`, () => new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 })),
  };
}

export function buildHumanoid(mats) {
  const { skinM, shirtM, pantsM, hairM, darkM } = mats;
  const group = new THREE.Group();
  const body = new THREE.Group();
  // The model is authored facing +z but headings speak car convention
  // (-z forward): the inner body rides a permanent half-turn so the outer
  // group's quaternion stays car-convention for camera solvers.
  body.rotation.y = Math.PI;
  group.add(body);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.62, 0.26), shirtM);
  torso.position.y = 1.29; torso.castShadow = true; body.add(torso);
  const hips = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.26), pantsM);
  hips.position.y = 0.9; body.add(hips);

  const headG = new THREE.Group();
  headG.position.y = 1.62; body.add(headG);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.28, 0.26), skinM);
  head.position.y = 0.2; head.castShadow = true; headG.add(head);
  const hairMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.28), hairM);
  hairMesh.position.y = 0.36; headG.add(hairMesh);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.12), skinM);
  neck.position.y = 0.02; headG.add(neck);

  const armL = buildLimb(0.13, 0.66, shirtM, skinM, 0.5);
  armL.position.set(-0.3, 1.56, 0); body.add(armL);
  const armR = buildLimb(0.13, 0.66, shirtM, skinM, 0.5);
  armR.position.set(0.3, 1.56, 0); body.add(armR);
  const legL = buildLimb(0.16, 0.9, pantsM, pantsM, 0.5);
  legL.position.set(-0.12, 0.88, 0); body.add(legL);
  const legR = buildLimb(0.16, 0.9, pantsM, pantsM, 0.5);
  legR.position.set(0.12, 0.88, 0); body.add(legR);
  for (const l of [legL, legR]) {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.28), darkM);
    shoe.position.set(0, -0.42, 0.06); l.lowerG.add(shoe);
  }
  return { group, body, torso, headG, armL, armR, legL, legR, hairM, darkM, phase: 0 };
}

/** move: 0..1 blend, run: 0..1 (ported walk cycle, minus combat/swim/sit). */
export function animateHumanoid(p, dt, s) {
  const { move, run } = s;
  const speedMul = 6 + run * 6;
  if (move > 0.05) p.phase += dt * speedMul * (0.5 + move * 0.5);
  const amp = lerp(0.35, 0.95, run) * move;
  const sw = Math.sin(p.phase), cw = Math.cos(p.phase);
  const L = 1 - Math.exp(-14 * dt);
  const setRot = (o, x, y = 0, z = 0) => {
    o.rotation.x = lerp(o.rotation.x, x, L);
    o.rotation.y = lerp(o.rotation.y, y, L);
    o.rotation.z = lerp(o.rotation.z, z, L);
  };
  p.body.rotation.x = lerp(p.body.rotation.x, 0, L);
  p.body.position.y = lerp(p.body.position.y, 0, L);
  setRot(p.legL, sw * amp, 0, 0);
  setRot(p.legR, -sw * amp, 0, 0);
  p.legL.lowerG.rotation.x = lerp(p.legL.lowerG.rotation.x, Math.max(0, -cw) * amp * 1.2, L);
  p.legR.lowerG.rotation.x = lerp(p.legR.lowerG.rotation.x, Math.max(0, cw) * amp * 1.2, L);
  if (s.airborne) {
    setRot(p.legL, -0.5, 0, 0.1);
    setRot(p.legR, 0.3, 0, -0.1);
    p.legL.lowerG.rotation.x = 1.0;
  }
  const armAmp = amp * 0.9;
  setRot(p.armL, -sw * armAmp, 0, 0.12);
  setRot(p.armR, sw * armAmp, 0, -0.12);
  p.armL.lowerG.rotation.x = lerp(p.armL.lowerG.rotation.x, -0.3 - run * 0.9, L);
  p.armR.lowerG.rotation.x = lerp(p.armR.lowerG.rotation.x, -0.3 - run * 0.9, L);
  p.torso.rotation.x = 0;
  // Negated: the inner body rides rotation.y = π (see buildHumanoid), which
  // mirrors pitch — without this the run-lean reads as leaning backwards.
  p.body.rotation.x = lerp(p.body.rotation.x, -(run * 0.18 * move + (s.airborne ? 0.15 : 0)), L);
  p.body.position.y = Math.abs(cw) * amp * 0.08;
  setRot(p.headG, 0.05 - run * 0.1, 0, 0);
}

class AvatarCharacter {
  constructor() {
    const rng = rngFor('world/avatar/look');
    // Classic player outfit: white shirt, blue pants, glasses.
    const mats = outfitMats('world/avatar', {
      skin: rng.pick([0xf1c9a5, 0xd9a877, 0xb17a4b, 0x7a4b2a, 0xe7b78f]),
      shirt: 0xf4f4f4, pants: 0x2f4f8f,
      hair: rng.pick([0x2b1d12, 0x000000, 0x6b4a2b, 0xd9b26f, 0x8a8a8a]),
    });
    Object.assign(this, buildHumanoid(mats));
    this.group.name = 'Avatar';
    const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.04), mats.darkM);
    glasses.position.set(0, 0.22, 0.14);
    this.headG.add(glasses);
    this.phase = rng() * 6.28;
    this.state = { move: 0, run: 0, airborne: false };
  }

  animate(dt, s = this.state) {
    animateHumanoid(this, dt, s);
  }
}

// --- on-foot controller ------------------------------------------------------
export class Avatar {
  constructor(engine) {
    this.engine = engine;
    this.city = engine.city;
    this.char = new AvatarCharacter();
    engine.scene.add(this.char.group);

    this.x = 0; this.y = 0; this.z = 0;
    this.heading = 0;
    this.vx = 0; this.vz = 0; this.vy = 0;
    this.onGround = true;
    this.speed = 0;
    this._jumpWas = false;
    this._anim = { move: 0, run: 0, airborne: false };

    // Rig/HUD target with stable live references (see module header).
    this.target = {
      position: this.char.group.position,
      quaternion: this.char.group.quaternion,
      speed: 0,
      telemetry: { speed: 0, gLat: 0, gLong: 0 },
    };
    this.respawn();
  }

  get position() { return this.char.group.position; }

  respawn() {
    const s = this.city.spawnPoint();
    this.x = s.x; this.z = s.z;
    this.y = this.city.groundHeight(s.x, s.z);
    this.heading = Math.PI; // car-convention yaw facing +z (Downtown)
    this.vx = 0; this.vz = 0; this.vy = 0;
    this.onGround = true;
    this._anim.move = 0; this._anim.run = 0; this._anim.airborne = false;
    this.syncMesh();
    this.engine.rig.snap();
  }

  syncMesh() {
    this.char.group.position.set(this.x, this.y, this.z);
    this.char.group.rotation.set(0, this.heading, 0);
  }

  update(dt) {
    const input = this.engine.input;
    const city = this.city;

    // Camera-relative move input, read off the LIVE camera so it works under
    // any camera driver (followCam on foot, the rig in race captures).

    // Camera-relative move input. Read the MERGED state (not raw keys) so an
    // Xbox controller steers too: `input.js` already folds stick + triggers
    // + WASD into steer/throttle/brake. Stick magnitude paces the walk, so a
    // half-tilt strolls and full deflection runs.
    const st = input.state;
    const pad = readPad();
    let ix = st.steer, iz = st.throttle - st.brake;
    // Left-stick Y walks forward/back: input.js only maps the stick X plus
    // the triggers (a car layout), but on foot the stick is fully 2-D.
    if (pad && pad.axes && pad.axes.length > 1) {
      const sy = -(pad.axes[1] ?? 0);
      if (Math.abs(sy) > 0.12) iz += sy;
    }
    if (Math.abs(ix) < 0.05) ix = 0;
    if (Math.abs(iz) < 0.05) iz = 0;
    _camDir.set(0, 0, -1).applyQuaternion(this.engine.camera.quaternion);
    const fl = Math.hypot(_camDir.x, _camDir.z) || 1;
    const fx = _camDir.x / fl, fz = _camDir.z / fl;
    const rx = -fz, rz = fx;
    let mx = fx * iz + rx * ix, mz = fz * iz + rz * ix;
    const ml = Math.hypot(mx, mz);
    if (ml > 1) { mx /= ml; mz /= ml; }

    // Sprint: Shift on keyboard, LB on pad. Jump: Space on keyboard, B on pad
    // (edge-triggered, shared latch so holding either never auto-bounces).
    const sprint = (input.keys.has('ShiftLeft') || input.keys.has('ShiftRight') || padPressed(pad, 4)) && ml > 0.1;
    const jumpDown = input.keys.has('Space') || padPressed(pad, 1);
    const maxSpeed = sprint ? AVATAR.SPRINT : AVATAR.RUN;
    const acc = this.onGround ? AVATAR.ACCEL : 8;
    this.vx = damp(this.vx, mx * maxSpeed, acc / 3, dt);
    this.vz = damp(this.vz, mz * maxSpeed, acc / 3, dt);

    if (ml > 0.1) this.heading = angleDamp(this.heading, Math.atan2(-mx, -mz), 12, dt);

    // Jump / gravity.
    const gh = city.groundHeight(this.x, this.z);
    if (this.onGround && jumpDown && !this._jumpWas) {
      this.vy = AVATAR.JUMP;
      this.onGround = false;
    }
    this._jumpWas = jumpDown;
    this.vy -= AVATAR.GRAVITY * dt;
    this.y += this.vy * dt;
    if (this.y <= gh) { this.y = gh; this.vy = 0; this.onGround = true; }
    else this.onGround = false;

    this.x += this.vx * dt;
    this.z += this.vz * dt;
    // Stay on the island.
    const lim = 300;
    const lx = this.x - city.cx, lz = this.z - city.cz;
    if (Math.abs(lx) > lim || Math.abs(lz) > lim) {
      this.x = city.cx + clamp(lx, -lim, lim);
      this.z = city.cz + clamp(lz, -lim, lim);
    }

    // Walk-cycle blend.
    const sp = Math.hypot(this.vx, this.vz);
    this.speed = sp;
    const anim = this._anim;
    anim.move = damp(anim.move, clamp(sp / AVATAR.RUN, 0, 1), 12, dt);
    anim.run = damp(anim.run, clamp(sp / AVATAR.SPRINT, 0, 1), 8, dt);
    anim.airborne = !this.onGround;
    this.char.animate(dt, anim);
    this.syncMesh();

    this.target.speed = sp;
    this.target.telemetry.speed = sp;
  }

  dispose() {
    this.engine.scene.remove(this.char.group);
    this.char.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  }
}
