/**
 * APEX GP — open world: street pedestrians.
 *
 * Ambient sidewalk walkers (ported from `fable-sandbox/gta_fable5.1` peds.js,
 * minus combat/talk/car-seats: they stroll block perimeters, panic away from
 * sprinting pedestrians and fast cars, and get softly pushed instead of
 * trampled). They share the `world/avatar.js` humanoid rig with street
 * outfits, so the whole crowd animates through one code path.
 *
 * Budgets: 10 walkers × ~11 meshes. Limb shadows are off (torso + head only
 * cast); the group hides past 130 m, which skips render AND shadow passes.
 *
 * PUBLIC API:
 *   new PedCrowd(city, scene)
 *   crowd.update(dt, camera, threats)  // threats = [{x, z, r}] that panic
 *   crowd.push(x, z, r)                // soft shove (avatar, driven car)
 *   crowd.count
 *   crowd.dispose()
 */

import * as THREE from 'three';
import { rngFor } from '../core/rng.js';
import { buildHumanoid, animateHumanoid, outfitMats } from './avatar.js';

const COUNT = 10;
const CULL_DIST = 130;

const SKINS = [0xf1c9a5, 0xd9a877, 0xb17a4b, 0x7a4b2a, 0xe7b78f, 0x5b3a21];
const SHIRTS = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0xecf0f1, 0x1abc9c, 0xe67e22, 0x34495e];
const PANTS = [0x2c3e50, 0x34495e, 0x7f8c8d, 0x1f2a36, 0x5d4037, 0x2e4a7a];
const HAIR = [0x2b1d12, 0x000000, 0x6b4a2b, 0xd9b26f, 0x8a8a8a];

const _v = new THREE.Vector3();

export class PedCrowd {
  constructor(city, scene) {
    this.city = city;
    this.scene = scene;
    this.peds = [];
    const rng = rngFor('world/peds');
    const blocks = city.blocks.filter((b) => b.type !== 'park' && b.type !== 'lot');
    for (let i = 0; i < COUNT; i++) {
      const b = rng.pick(blocks);
      const parts = buildHumanoid(outfitMats('world/peds', {
        skin: rng.pick(SKINS), shirt: rng.pick(SHIRTS),
        pants: rng.pick(PANTS), hair: rng.pick(HAIR),
      }));
      parts.group.name = 'Ped';
      // Shadow budget: torso + head only; limbs are too thin to matter.
      parts.group.traverse((o) => { if (o.isMesh) o.castShadow = false; });
      parts.torso.castShadow = true;
      parts.headG.children[0].castShadow = true;
      scene.add(parts.group);
      // Sidewalk ring waypoints (world coords, inset from the block edges).
      const m = 1.6;
      const [x0, z0] = city.toWorld(b.x0 + m, b.z0 + m);
      const [x1, z1] = city.toWorld(b.x1 - m, b.z1 - m);
      const corners = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
      const k = Math.floor(rng() * 4);
      const ped = {
        parts,
        corners,
        k,
        x: corners[k][0], z: corners[k][1],
        y: 0, heading: 0,
        speed: rng.range(1.1, 1.9),
        panicT: 0,
        anim: { move: 0, run: 0, airborne: false },
      };
      parts.phase = rng() * 6.28;
      ped.y = city.groundHeight(ped.x, ped.z);
      this.peds.push(ped);
      this._sync(ped);
    }
  }

  get count() { return this.peds.length; }

  _sync(p) {
    p.parts.group.position.set(p.x, p.y, p.z);
    p.parts.group.rotation.set(0, p.heading, 0);
  }

  /** Soft shove (avatar shoulders through, driven car nudges). */
  push(x, z, r, strength = 1) {
    for (const p of this.peds) {
      const dx = p.x - x, dz = p.z - z;
      const d = Math.hypot(dx, dz);
      if (d < r && d > 1e-4) {
        const push = (r - d) * 0.6 * strength;
        p.x += (dx / d) * push;
        p.z += (dz / d) * push;
        p.y = this.city.groundHeight(p.x, p.z);
        this._sync(p);
      }
    }
  }

  update(dt, camera, threats = []) {
    for (const p of this.peds) {
      // Distance cull: one flag skips colour, shadow and depth for ~11 meshes.
      _v.set(p.x, p.y, p.z);
      const far = camera ? _v.distanceTo(camera.position) > CULL_DIST : false;
      p.parts.group.visible = !far;
      if (far) continue;

      // Panic away from threats (sprinting avatar, fast car).
      let px = 0, pz = 0, panic = false;
      for (const t of threats) {
        const dx = p.x - t.x, dz = p.z - t.z;
        const d = Math.hypot(dx, dz);
        if (d < t.r && d > 1e-4) { px += (dx / d) / d; pz += (dz / d) / d; panic = true; }
      }
      let mx, mz, want;
      if (panic) {
        p.panicT = 1.5;
        const l = Math.hypot(px, pz) || 1;
        mx = px / l; mz = pz / l;
        want = p.speed * 2.6;
      } else {
        p.panicT = Math.max(0, p.panicT - dt);
        const c = p.corners[(p.k + 1) % 4];
        mx = c[0] - p.x; mz = c[1] - p.z;
        const d = Math.hypot(mx, mz);
        if (d < 0.8) { p.k = (p.k + 1) % 4; continue; }
        mx /= d; mz /= d;
        want = p.panicT > 0 ? p.speed * 2.2 : p.speed;
      }
      p.x += mx * want * dt;
      p.z += mz * want * dt;
      p.y = this.city.groundHeight(p.x, p.z);
      // Headings are car convention (see avatar.js).
      const targetH = Math.atan2(-mx, -mz);
      let d = (((targetH - p.heading + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      p.heading += d * (1 - Math.exp(-10 * dt));
      this._sync(p);

      const a = p.anim;
      const running = want > p.speed * 1.5;
      a.move = Math.min(1, a.move + dt * 6);
      a.run = running ? 0.8 : 0.05;
      a.airborne = false;
      animateHumanoid(p.parts, dt, a);
    }
  }

  dispose() {
    for (const p of this.peds) {
      this.scene.remove(p.parts.group);
      p.parts.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    }
    this.peds.length = 0;
  }
}
