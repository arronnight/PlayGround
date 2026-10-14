import * as THREE from 'three';
import { dist2D } from './utils.js';

const TICKET = 100;

// Airport travel: walk into the glowing terminal ring (on foot, no active
// mission) to fly between Fable City, Liberty City and Vice City.
export class Travel {
  constructor(game) {
    this.game = game; this.rings = []; this.flying = null; this.menu = null; this.sel = 0;
    this.buildRings();
    this.menuEl = document.createElement('div');
    this.menuEl.className = 'travel-menu';
    this.menuEl.style.display = 'none';
    document.body.appendChild(this.menuEl);
  }
  destsOf(mapId) { return ['fable', 'liberty', 'vice'].filter((m) => m !== mapId); }
  cityName(id) { return id === 'fable' ? 'Fable City' : id === 'liberty' ? 'Liberty City' : 'Vice City'; }
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
    this.closeMenu();
  }
  openMenu() {
    const g = this.game;
    this.menu = this.destsOf(g.mapId); this.sel = 0;
    this.renderMenu();
  }
  // List menu works on both inputs: digits / arrows+Enter on keyboard,
  // D-pad + A on gamepad (B backs out). Player input is frozen while open
  // (see player.js) so menu buttons never double as jump/fire/talk.
  renderMenu() {
    const g = this.game, pad = g.input.gamepadConnected;
    this.menuEl.innerHTML = `<h2 style="color:#2df0ff">✈ DEPARTURES</h2>` + this.menu.map((d, i) =>
      `<div class="row${i === this.sel ? ' sel' : ''}"><span class="key">${i + 1}</span><span class="name">Fly to ${this.cityName(d)}</span><span class="price">$${TICKET}</span></div>`).join('') +
      `<div class="dim">${pad ? 'D-pad choose · A fly · B stay' : `Press 1-${this.menu.length} or ↑↓ + Enter to fly · E or Esc to stay`}</div>`;
    this.menuEl.style.display = 'block';
  }
  closeMenu() { this.menu = null; this.sel = 0; if (this.menuEl) this.menuEl.style.display = 'none'; }
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
    if (this.menu) {
      for (let i = 0; i < this.menu.length; i++) if (input.hitCode('Digit' + (i + 1))) { this.tryFly(this.menu[i]); return false; }
      if (input.hit('dUp') || input.hitCode('ArrowUp')) { this.sel = (this.sel + this.menu.length - 1) % this.menu.length; this.renderMenu(); g.audio.tone(600, 0.05, 0.08, 'square'); }
      else if (input.hit('dDown') || input.hitCode('ArrowDown')) { this.sel = (this.sel + 1) % this.menu.length; this.renderMenu(); g.audio.tone(600, 0.05, 0.08, 'square'); }
      else if (input.hit('jump') || input.hitCode('Enter')) { this.tryFly(this.menu[this.sel]); return false; }
      else if (input.hit('interact') || input.hit('sprint') || input.hitCode('Escape')) this.closeMenu();
      return false;
    }
    if (pl.dead || pl.busted || pl.vehicle || g.missions.active || g.stores.interior || g.stores.shopOpen) return false;
    for (const r of this.rings) {
      if (dist2D(pl.x, pl.z, r.x, r.z) < 2.4) {
        g.hud.setHint(`Fly to ${this.menuPreview(g)} — $${TICKET} (${input.gamepadConnected ? 'X / B' : 'E'})`);
        if (input.hit('interact') || input.hit('sprint')) this.openMenu();
        return false;
      }
    }
    return false;
  }
  menuPreview(g) { return this.destsOf(g.mapId).map((d) => this.cityName(d)).join(' or '); }
  tryFly(dest) {
    const g = this.game, pl = g.player;
    dest = dest || this.destsOf(g.mapId)[0];
    if (pl.money < TICKET) { g.hud.notify(`A ticket costs $${TICKET}`, 2000); this.closeMenu(); return; }
    pl.money -= TICKET; g.hud.moneyPop(-TICKET);
    this.closeMenu();
    this.flying = { dest, phase: 'out' };
    g.hud.showBanner('✈ NOW BOARDING', `Flight to ${this.cityName(dest)}…`, '#2df0ff', 2500);
    g.audio.ui();
  }
}
