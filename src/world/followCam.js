/**
 * APEX GP — open world: GTA third-person camera.
 *
 * Ported from `fable-sandbox/gta_fable5.1` camera.js and rewritten for this
 * tree (seeded shake stream instead of Math.random, city collider hash for
 * the boom pull-in, no aim mode — no combat). Two modes:
 *
 *   foot: orbit 4.2 m back / 1.6 m up, mouse orbits when pointer-locked,
 *         auto-recentres behind the walker after 1.6 s of mouse idle while
 *         moving. Wheel zooms the boom 2.5–7 m.
 *   car:  chase with yaw following a heading/velocity blend, boom 6.2–8.4 m
 *         and FOV 62–78 with speed, collision pull-in.
 *
 * The engine runs this INSTEAD of CameraRig in roam mode (foot and driving);
 * race mode keeps the broadcast rig untouched. Everything downstream reads
 * the live camera, so lighting, motion blur, particles and audio follow both.
 *
 * PUBLIC API:
 *   new FollowCam(camera, city)
 *   followCam.update(dt, focus, heading, speed, mode, velHeading)
 *     focus {x,y,z}, heading = entity yaw (car convention), speed m/s,
 *     mode 'foot'|'car', velHeading = velocity yaw (car mode)
 *   followCam.snapBehind(heading)
 *   followCam.forward(out)   // camera look direction, XZ (for movement)
 *   followCam.addShake(a)
 *   followCam.dispose()      // removes DOM listeners
 */

import * as THREE from 'three';
import { clamp, lerp, makeRng } from '../core/rng.js';

const TAU = Math.PI * 2;
const wrapAngle = (a) => ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;
const angleLerp = (a, b, t) => a + wrapAngle(b - a) * t;
const angleDamp = (a, b, lambda, dt) => angleLerp(a, b, 1 - Math.exp(-lambda * dt));

const _tgt = new THREE.Vector3();
const _des = new THREE.Vector3();

export class FollowCam {
  constructor(camera, city) {
    this.cam = camera;
    this.city = city;
    this.yaw = 0;
    this.pitch = 0.18;
    this.idleT = 99;
    this.boom = 4.2;
    this.pos = new THREE.Vector3();
    this.look = new THREE.Vector3();
    this.fov = 62;
    this.curDist = 4;
    this.shake = 0;
    this.shakeV = new THREE.Vector3();
    this.mode = 'foot';
    this._mdx = 0;
    this._mdy = 0;
    this._rng = makeRng(0xca9e);
    this._el = null;

    this._onMouseMove = (e) => {
      if (document.pointerLockElement !== this._el) return;
      this._mdx += e.movementX;
      this._mdy += e.movementY;
    };
    this._onWheel = (e) => {
      e.preventDefault();
      const lo = this.mode === 'car' ? 5 : 2.5;
      const hi = this.mode === 'car' ? 11 : 7;
      this.boom = clamp(this.boom + Math.sign(e.deltaY) * 0.5, lo, hi);
    };
    // Click the canvas to take mouse control (pointer lock needs a gesture).
    // Without it (headless, first load) the camera auto-follows — the same
    // framing the idle-recenter produces, so captures stay deterministic.
    this._onClick = () => {
      if (this._el && document.pointerLockElement !== this._el) {
        try { this._el.requestPointerLock(); } catch { /* ignore */ }
      }
    };
  }

  /** Wire canvas listeners. Call once; dispose() undoes it. */
  attach(el) {
    this.detach();
    this._el = el;
    document.addEventListener('mousemove', this._onMouseMove);
    el.addEventListener('wheel', this._onWheel, { passive: false });
    el.addEventListener('click', this._onClick);
  }

  detach() {
    document.removeEventListener('mousemove', this._onMouseMove);
    if (this._el) {
      this._el.removeEventListener('wheel', this._onWheel);
      this._el.removeEventListener('click', this._onClick);
      this._el = null;
    }
  }

  dispose() { this.detach(); }

  addShake(a) { this.shake = Math.min(1.5, this.shake + a); }

  snapBehind(heading, mode = 'foot') {
    // yaw = direction from target to camera. Foot headings are car
    // convention (behind = heading); street-car headings are fable
    // convention (forward = sin/cos, so behind = heading + π).
    this.yaw = mode === 'car' ? heading + Math.PI : heading;
    this.idleT = 99;
    this._mdx = 0; this._mdy = 0;
  }

  forward(out) {
    out.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    return out;
  }

  update(dt, t, heading, speed, mode, velHeading = heading, mouseSens = 0.0022) {
    this.mode = mode;
    const mdx = this._mdx * mouseSens, mdy = this._mdy * mouseSens;
    this._mdx = 0; this._mdy = 0;
    if (Math.abs(mdx) + Math.abs(mdy) > 0) this.idleT = 0;
    else this.idleT += dt;
    this.yaw -= mdx;
    this.pitch = clamp(this.pitch + mdy, -0.35, 0.9);

    let dist, height, fovT;
    if (mode === 'car') {
      const sp = Math.min(1, speed / 30);
      // Street-car headings are fable convention (forward = sin/cos, +z
      // front): the camera sits behind, i.e. yaw = heading + π, blended
      // toward the velocity direction with speed.
      const target = wrapAngle(angleLerp(heading, velHeading, sp * 0.6) + Math.PI);
      if (this.idleT > 1.2) this.yaw = angleDamp(this.yaw, target, 3.5 + sp * 3, dt);
      if (this.idleT > 1.2) this.pitch = lerp(this.pitch, 0.16 + sp * 0.06, 1 - Math.exp(-2 * dt));
      dist = 6.2 + sp * 2.2; height = 1.9 + sp * 0.5; fovT = 62 + sp * 16;
    } else {
      dist = this.boom; height = 1.6; fovT = 62;
      // Gentle recentre behind the walker when moving and mouse idle. Avatar
      // headings are car convention, so behind them is yaw = heading.
      if (speed > 1 && this.idleT > 1.6) this.yaw = angleDamp(this.yaw, heading, 0.8, dt);
    }
    this.fov = lerp(this.fov, fovT, 1 - Math.exp(-4 * dt));
    this.curDist = lerp(this.curDist, dist, 1 - Math.exp(-5 * dt));

    // Direction from target to camera.
    const fx = Math.sin(this.yaw), fz = Math.cos(this.yaw);
    const tgt = _tgt.set(t.x, t.y + height, t.z);
    const cy = Math.sin(this.pitch), ch = Math.cos(this.pitch);
    const d = _des.set(tgt.x + fx * ch * this.curDist, tgt.y + cy * this.curDist, tgt.z + fz * ch * this.curDist);

    // Boom collision: pull in when a building blocks the line.
    const dx = d.x - tgt.x, dz = d.z - tgt.z;
    const L = Math.hypot(dx, dz);
    if (L > 0.01 && this.city) {
      const hit = this.city.raycast(tgt.x, tgt.z, dx / L, dz / L, L + 0.3,
        (b) => b.kind === 'building' && (b.maxY ?? 999) > Math.min(d.y, tgt.y) - 0.5);
      if (hit.t < L + 0.3 && hit.box) {
        const f = Math.max(0.12, (hit.t - 0.4) / L);
        d.set(tgt.x + dx * f, tgt.y + (d.y - tgt.y) * f, tgt.z + dz * f);
      }
      const gy = this.city.groundHeight(d.x, d.z) + 0.35;
      if (d.y < gy) d.y = gy;
    }

    const lam = mode === 'car' ? 12 : 18;
    const k = 1 - Math.exp(-lam * dt), k2 = 1 - Math.exp(-25 * dt);
    this.pos.x = lerp(this.pos.x, d.x, k);
    this.pos.y = lerp(this.pos.y, d.y, k);
    this.pos.z = lerp(this.pos.z, d.z, k);
    this.look.x = lerp(this.look.x, tgt.x, k2);
    this.look.y = lerp(this.look.y, tgt.y, k2);
    this.look.z = lerp(this.look.z, tgt.z, k2);

    // Seeded shake (visual only — never Math.random, see CONTRACT.md §0).
    this.shake = Math.max(0, this.shake - dt * 2.2);
    const s = this.shake * this.shake * 0.35;
    const r = this._rng;
    this.shakeV.set((r() - 0.5) * s, (r() - 0.5) * s, (r() - 0.5) * s);
    this.cam.position.copy(this.pos).add(this.shakeV);
    this.cam.lookAt(this.look.x + this.shakeV.x * 0.5, this.look.y, this.look.z + this.shakeV.z * 0.5);
    if (Math.abs(this.cam.fov - this.fov) > 0.05) {
      this.cam.fov = this.fov;
      this.cam.updateProjectionMatrix();
    }
  }
}
