/**
 * APEX GP — open world: free-roam controller (GTA loop).
 *
 * The game is GTA-style open world: walk the streets, steal traffic cars
 * (F / pad-Y), drive them, get out, join a street sprint (T). Owns the
 * avatar, the orbit camera, the pedestrians and the one drivable street
 * car. The F1 broadcast rig/HUD/session do not exist in roam mode.
 *
 * In race mode (`?mode=race`) there is no avatar, no peds and no camera —
 * everything stays null/inert; that mode exists for the deterministic
 * capture harness only.
 *
 * PUBLIC API (additive, see CONTRACT.md §5):
 *   new FreeRoam(engine)
 *   roam.enabled / roam.setEnabled(bool) / roam.toggle()
 *   roam.respawn()                    // on-foot spawn (X); parks a driven car
 *   roam.tryEnterExit()               // steal / leave the nearest car (F, Y)
 *   roam.update(dt)                   // ONE FIXED STEP (after avatar/car update)
 *   roam.updateCamera(dt)             // per RENDER frame (engine calls this)
 *   roam.toggleSprint()               // on-foot/car street sprint (T)
 *   roam.banner() / roam.district() / roam.sprintTarget()
 *   roam.driving                       // streetcar entry index | null
 *   roam.dispose()
 */

import * as THREE from 'three';
import { rngFor } from '../core/rng.js';
import { Avatar, AVATAR, readPad, padPressed } from './avatar.js';
import { FollowCam } from './followCam.js';
import { PedCrowd } from './peds.js';
import { StreetCar } from './streetcar.js';

const SPRINT_GATES = 5;
const SPRINT_MIN = 60;
const SPRINT_MAX = 120;
const SPRINT_RADIUS = 8;
const ENTER_RADIUS = 5;
// Full-detail parked steals: beyond this the oldest reverts to its traffic
// instance (one draw call instead of ~30).
const MAX_DETAILED_PARKED = 4;

export class FreeRoam {
  constructor(engine) {
    this.engine = engine;
    this.enabled = false;
    this.sprint = null;
    this._hitCooldown = 0;
    this._overlayTick = 0;
    this._yWas = false;
    this._threats = [];
    // Everything below exists only where it can be used: city present, race off.
    const live = engine.city && !engine.raceMode;
    this.avatar = live ? new Avatar(engine) : null;
    this.followCam = live ? new FollowCam(engine.camera, engine.city) : null;
    if (this.followCam) {
      this.followCam.attach(engine.renderer.domElement);
      this.followCam.snapBehind(this.avatar.heading);
    }
    this.peds = live ? new PedCrowd(engine.city, engine.scene) : null;
    this.streetcar = null;
    this.driving = null; // traffic index of the stolen car, or null
    this.parkedDetailed = []; // [{ group, mats, entry }] — capped, see _exitCar
    this.overlay = null;
    if (this.avatar) {
      const el = document.createElement('div');
      el.id = 'roam-overlay';
      Object.assign(el.style, {
        position: 'absolute', left: '12px', top: '12px', zIndex: '15',
        font: '600 13px/1.7 ui-monospace, Menlo, monospace', color: '#e8edf3',
        background: 'rgba(5,8,14,.55)', padding: '8px 12px', borderRadius: '6px',
        pointerEvents: 'none', whiteSpace: 'pre', letterSpacing: '1px',
      });
      (engine.container ?? document.getElementById('app'))?.appendChild(el);
      this.overlay = el;
    }
    // F steals / leaves cars (raw code: outside input.js's KEYMAP, like T).
    this._onKey = (e) => { if (e.code === 'KeyF' && this.enabled) this.tryEnterExit(); };
    window.addEventListener('keydown', this._onKey);
  }

  get city() { return this.engine.city; }
  get player() { return this.avatar; }

  /** Live camera/lighting focus: the car when driving, else the walker. */
  get focus() {
    if (this.driving !== null && this.streetcar) return this.streetcar.group.position;
    return this.avatar ? this.avatar.position : null;
  }

  setEnabled(on) {
    if (on === this.enabled) return;
    if (on && !this.avatar) return; // race mode: there is nobody to roam with
    this.enabled = on;
    if (on) this.respawn();
    if (on) this.engine._camCut = true;
  }

  toggle() { this.setEnabled(!this.enabled); }

  respawn() {
    if (!this.avatar) return;
    if (this.driving !== null) this._parkCar();
    this.avatar.respawn();
    this.followCam.snapBehind(this.avatar.heading);
    this.sprint = null;
  }

  // --- steal / leave --------------------------------------------------------
  _nearestCar(x, z) {
    let best = -1, bd = ENTER_RADIUS;
    this.city.traffic.forEach((t, i) => {
      if (t.hidden) return;
      const d = Math.hypot(t.x - x, t.z - z);
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  }

  tryEnterExit() {
    if (!this.enabled || !this.avatar) return;
    if (this.driving !== null) { this._exitCar(); return; }
    const i = this._nearestCar(this.avatar.x, this.avatar.z);
    if (i < 0) return;
    const t = this.city.traffic[i];
    // Fable heading for the lane direction (forward = sin/cos, +z front).
    const dx = t.vertical ? 0 : t.dir, dz = t.vertical ? t.dir : 0;
    const heading = Math.atan2(dx, dz);
    this.streetcar = new StreetCar(this.engine.scene, t.kind || 'sedan', t.color);
    this.streetcar.setPose(t.x, t.z, heading);
    this.streetcar.group.position.y = this.city.groundHeight(t.x, t.z);
    t.hidden = true;
    this.city.syncTrafficMesh();
    this.avatar.char.group.visible = false;
    this.driving = i;
    this.sprint = null;
    this.followCam.snapBehind(heading, 'car');
    this.engine._camCut = true;
  }

  _exitCar() {
    const i = this.driving;
    if (i === null || !this.streetcar) return;
    const car = this.streetcar;
    const t = this.city.traffic[i];
    // Leave it parked where it stands.
    t.parked = true;
    t.x = car.x; t.z = car.z;
    t.heading = car.heading;
    t.kx = 0; t.kz = 0;
    // Keep the full-detail visuals for the newest few steals (the traffic
    // instance stays sunk so nothing double-renders); older ones revert to
    // their instance, which comes back exactly on the parked pose.
    const rel = car.release();
    this.parkedDetailed.push({ group: rel.group, mats: rel.mats, entry: i });
    while (this.parkedDetailed.length > MAX_DETAILED_PARKED) {
      const old = this.parkedDetailed.shift();
      this.engine.scene.remove(old.group);
      for (const m of old.mats) m.dispose();
      const ot = this.city.traffic[old.entry];
      ot.hidden = false;
      this.city.setTrafficMatrix(old.entry);
    }
    // Step out of the left side (fable driver side).
    const s = Math.sin(car.heading), c = Math.cos(car.heading);
    const a = this.avatar;
    a.x = car.x - c * (car.halfW + 0.9);
    a.z = car.z + s * (car.halfW + 0.9);
    a.y = this.city.groundHeight(a.x, a.z);
    a.heading = car.heading + Math.PI; // avatar speaks car convention
    a.vx = 0; a.vz = 0; a.vy = 0;
    a.char.group.visible = true;
    a.syncMesh();
    // The visuals already moved to the parked pool via release(); just drop
    // the physics object (dispose() here would double-free the mats).
    this.streetcar = null;
    this.driving = null;
    this.followCam.snapBehind(a.heading, 'foot');
    this.engine._camCut = true;
  }

  _parkCar() {
    // X while driving: same as leaving, then the avatar respawns (below).
    if (this.driving === null) return;
    this._exitCar();
  }

  // --- sprint ---------------------------------------------------------------
  district() {
    if (!this.city || !this.avatar) return '';
    const p = this._subject();
    return this.city.districtName(p.x, p.z);
  }

  _subject() {
    if (this.driving !== null && this.streetcar) return this.streetcar;
    return this.avatar;
  }

  banner() {
    if (!this.enabled || !this.avatar) return null;
    if (this.sprint?.done) return `SPRINT COMPLETE — ${this.sprint.done.toFixed(1)} s  (T: again · X: respawn)`;
    if (this.sprint) {
      const g = this.sprint;
      return `SPRINT ${Math.min(g.next + 1, SPRINT_GATES)}/${SPRINT_GATES} — ${this.district()}`;
    }
    return this.driving !== null ? 'DRIVING' : `FREE ROAM — ${this.district()}`;
  }

  /** Start/stop the street sprint. Bound to T by the engine. */
  toggleSprint() {
    if (!this.enabled || !this.avatar) return;
    if (this.sprint) { this.sprint = null; this._drawOverlay(); return; }
    const rng = rngFor('world/sprint');
    const sub = this._subject();
    const gates = [];
    let gx = sub.x, gz = sub.z;
    const cx = this.city.cx, cz = this.city.cz, lim = 250;
    for (let i = 0; i < SPRINT_GATES; i++) {
      if (rng() < 0.5) gx += (rng() < 0.5 ? 1 : -1) * rng.range(SPRINT_MIN, SPRINT_MAX);
      else gz += (rng() < 0.5 ? 1 : -1) * rng.range(SPRINT_MIN, SPRINT_MAX);
      gx = Math.max(cx - lim, Math.min(cx + lim, gx));
      gz = Math.max(cz - lim, Math.min(cz + lim, gz));
      gates.push({ x: gx, z: gz });
    }
    this.sprint = { gates, next: 0, t0: this.engine.simTime };
  }

  sprintTarget() {
    return this.sprint && this.sprint.next < this.sprint.gates.length
      ? this.sprint.gates[this.sprint.next]
      : null;
  }

  // --- per-step ---------------------------------------------------------------
  update(dt) {
    if (!this.enabled || !this.avatar) return;
    // Pad-Y (button 3) steals/leaves, edge-latched like the F key.
    const yDown = padPressed(readPad(), 3);
    if (yDown && !this._yWas) this.tryEnterExit();
    this._yWas = yDown;

    const a = this.avatar;
    this._hitCooldown = Math.max(0, this._hitCooldown - dt);

    if (this.driving !== null && this.streetcar) this._updateDriving(dt);
    else this._updateOnFoot(dt);

    // Sprint gates (whoever the subject is).
    const sub = this._subject();
    if (this.sprint && !this.sprint.done) {
      const g = this.sprint.gates[this.sprint.next];
      if (g && Math.hypot(sub.x - g.x, sub.z - g.z) < SPRINT_RADIUS) {
        this.sprint.next++;
        if (this.sprint.next >= this.sprint.gates.length) {
          this.sprint.done = this.engine.simTime - this.sprint.t0;
          this._doneT = 6;
        }
      }
    }
    if (this.sprint?.done) {
      this._doneT -= dt;
      if (this._doneT <= 0) this.sprint = null;
    }

    if ((this._overlayTick = (this._overlayTick + 1) % 6) === 0) this._drawOverlay();
  }

  _updateOnFoot(dt) {
    const a = this.avatar;
    // Buildings / props: hard push-out.
    const hit = this.city.collideCircle(a.x, a.z, AVATAR.RADIUS);
    if (hit) {
      a.x += hit.nx * hit.depth;
      a.z += hit.nz * hit.depth;
      const vn = a.vx * hit.nx + a.vz * hit.nz;
      if (vn < 0) {
        a.vx -= hit.nx * vn;
        a.vz -= hit.nz * vn;
      }
      a.syncMesh();
    }
    // Traffic (rolling or parked): shove the pedestrian clear.
    for (const t of this.city.traffic) {
      if (t.hidden) continue;
      const dx = a.x - t.x, dz = a.z - t.z;
      const d = Math.hypot(dx, dz);
      const minD = AVATAR.RADIUS + 1.6;
      if (d < minD && d > 1e-4) {
        const nx = dx / d, nz = dz / d;
        const push = minD - d;
        a.x += nx * push;
        a.z += nz * push;
        const vn = a.vx * nx + a.vz * nz;
        if (vn < 0) {
          a.vx -= nx * vn * 0.9;
          a.vz -= nz * vn * 0.9;
        }
        if (this._hitCooldown <= 0 && Math.abs(vn) > 3) {
          this.followCam.addShake(0.4);
          this._hitCooldown = 0.6;
        }
        a.syncMesh();
      }
    }
    // Shoulder through peds.
    this.peds.push(a.x, a.z, 0.9, 1);
  }

  _updateDriving(dt) {
    const car = this.streetcar;
    // Buildings eat speed (resolveCar inside car.update already pushes out).
    if (car.lastHit && car.lastHit.impact > 3 && this._hitCooldown <= 0) {
      this.followCam.addShake(Math.min(0.8, car.lastHit.impact / 20));
      this._hitCooldown = 0.4;
    }
    // Traffic: bulldoze the lane aside (knock decays back in stepTraffic).
    for (const t of this.city.traffic) {
      if (t.hidden || t.parked) continue;
      const dx = car.x - t.x, dz = car.z - t.z;
      const d = Math.hypot(dx, dz);
      const minD = 2.0 + 1.6;
      if (d < minD && d > 1e-4) {
        const nx = dx / d, nz = dz / d;
        const push = (minD - d) * 0.5;
        car.x += nx * push;
        car.z += nz * push;
        const vn = car.vx * nx + car.vz * nz;
        if (vn < 0) {
          car.vx -= nx * vn;
          car.vz -= nz * vn;
          t.kx = Math.max(-4, Math.min(4, t.kx - nx * 2.5));
          t.kz = Math.max(-4, Math.min(4, t.kz - nz * 2.5));
          if (this._hitCooldown <= 0) {
            this.followCam.addShake(0.35);
            this._hitCooldown = 0.4;
          }
        }
        car.syncMesh();
      }
    }
    // Nudge peds (never trample: they slide).
    this.peds.push(car.x, car.z, 2.6, 1.4);
  }

  /** Per render frame: drive whichever camera subject is live. */
  updateCamera(dt) {
    if (!this.enabled || !this.followCam) return;
    if (this.driving !== null && this.streetcar) {
      const car = this.streetcar;
      _camFocus.set(car.x, car.y, car.z);
      this.followCam.update(dt, _camFocus, car.heading, car.absSpeed(), 'car', car.velHeading());
    } else if (this.avatar) {
      const a = this.avatar;
      this.followCam.update(dt, a.position, a.heading, a.speed, 'foot');
    }
  }

  _drawOverlay() {
    if (!this.overlay || !this.avatar) return;
    let lines;
    if (this.driving !== null && this.streetcar) {
      const car = this.streetcar;
      const kmh = (car.absSpeed() * 3.6).toFixed(0);
      lines = [
        `DRIVING — ${car.type.name.toUpperCase()}  ${kmh} km/h`,
        this.sprint?.done
          ? `SPRINT COMPLETE — ${this.sprint.done.toFixed(1)} s`
          : this.sprint ? `SPRINT ${Math.min(this.sprint.next + 1, SPRINT_GATES)}/${SPRINT_GATES}` : 'F / Y: get out',
        'WASD/stick drive · SPACE/RB handbrake',
      ];
    } else {
      const a = this.avatar;
      const tgt = this.sprintTarget();
      lines = [
        this.sprint && !this.sprint.done ? `SPRINT ${Math.min(this.sprint.next + 1, SPRINT_GATES)}/${SPRINT_GATES} — gate ${tgt ? Math.hypot(a.x - tgt.x, a.z - tgt.z).toFixed(0) : '?'} m` : `FREE ROAM — ${this.district()}`,
        this.sprint?.done
          ? `SPRINT COMPLETE — ${this.sprint.done.toFixed(1)} s`
          : 'T: street sprint · X: respawn · F: steal car',
        `${(a.speed * 3.6).toFixed(0)} km/h   WASD/stick move · SHIFT/LB sprint · SPACE/B jump`,
      ];
    }
    this.overlay.textContent = lines.join('\n');
  }

  dispose() {
    window.removeEventListener('keydown', this._onKey);
    this.overlay?.remove();
    this.overlay = null;
    this.followCam?.dispose();
    this.followCam = null;
    this.peds?.dispose();
    this.peds = null;
    this.streetcar?.dispose();
    this.streetcar = null;
    this.driving = null;
    for (const p of this.parkedDetailed) {
      this.engine.scene.remove(p.group);
      for (const m of p.mats) m.dispose();
    }
    this.parkedDetailed = [];
    this.avatar?.dispose();
    this.avatar = null;
  }
}

const _camFocus = new THREE.Vector3();
