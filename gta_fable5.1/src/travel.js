import * as THREE from 'three';
import { dist2D } from './utils.js';

const TICKET = 100;

// Airport travel: walk into the glowing terminal ring (on foot, no active
// mission) to fly between Fable City and Liberty City.
export class Travel {
  constructor(game) {
    this.game = game; this.rings = []; this.flying = null;
    this.buildRings();
  }
  destOf(mapId) { return mapId === 'fable' ? 'liberty' : 'fable'; }
  cityName(id) { return id === 'fable' ? 'Fable City' : 'Liberty City'; }
  buildRings() {
    const g = this.game;
    for (const a of g.city.airports) {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 2.4, 24, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x2df0ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
      ring.position.set(a.x, g.city.groundHeight(a.x, a.z) + 1.2, a.z); g.scene.add(ring);
      this.rings.push({ ring, x: a.x, z: a.z });
    }
  }
  disposeRings() {
    for (const r of this.rings) { this.game.scene.remove(r.ring); r.ring.geometry.dispose(); r.ring.material.dispose(); }
    this.rings.length = 0;
  }
  // Returns true while a flight owns the frame (world updates pause for the fade).
  update(dt) {
    const g = this.game, pl = g.player, input = g.input;
    for (const r of this.rings) r.ring.material.opacity = 0.25 + 0.12 * Math.sin(g.time * 3 + r.x);
    if (this.flying) {
      const f = this.flying, grade = g.grade.uniforms;
      if (f.phase === 'out') {
        grade.uFade.value = Math.min(1, grade.uFade.value + dt / 1.1);
        if (grade.uFade.value >= 1) { g.flyTo(f.dest); f.phase = 'in'; }
      } else {
        grade.uFade.value = Math.max(0, grade.uFade.value - dt / 1.1);
        if (grade.uFade.value <= 0) {
          this.flying = null;
          g.hud.bannerT = 0; g.hud.banner.style.opacity = 0; g.hud.bannerSub.style.opacity = 0;
          g.hud.notify(`Welcome to ${this.cityName(g.mapId)}`, 4000);
        }
      }
      return true;
    }
    if (pl.dead || pl.busted || pl.vehicle || g.missions.active || g.stores.interior || g.stores.shopOpen) return false;
    for (const r of this.rings) {
      if (dist2D(pl.x, pl.z, r.x, r.z) < 2.4) {
        g.hud.setHint(`Fly to ${this.cityName(this.destOf(g.mapId))} — $${TICKET} (E)`);
        if (input.hit('interact')) this.tryFly();
        return false;
      }
    }
    return false;
  }
  tryFly() {
    const g = this.game, pl = g.player;
    if (pl.money < TICKET) { g.hud.notify(`A ticket costs $${TICKET}`, 2000); return; }
    pl.money -= TICKET; g.hud.moneyPop(-TICKET);
    const dest = this.destOf(g.mapId);
    this.flying = { dest, phase: 'out' };
    g.hud.showBanner('✈ NOW BOARDING', `Flight to ${this.cityName(dest)}…`, '#2df0ff', 2500);
    g.audio.ui();
  }
}
