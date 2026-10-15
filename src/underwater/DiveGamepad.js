import * as THREE from 'three';

/**
 * DiveGamepad — XInput swim + observe at the same time.
 *
 * A standard-mapping pad (Xbox/XInput, DualShock and friends) drives the dive
 * with both hands at once: the left stick swims, the right stick looks, and
 * the face buttons observe — simultaneously, which the keyboard can only do
 * with three hands. Stick deflection is mirrored into `cine.keys` (KeyW/A/S/D,
 * KeyQ/E) so every existing path — free flight, drift-to-swim handover, the
 * touch buttons — keeps working unchanged, while the analog vectors below let
 * follow mode swim alongside instead of cancelling.
 *
 *   left stick      swim (forward / strafe) — starts swimming from drift
 *   right stick     look (free swim) / orbit the animal (while following)
 *   LT / RT, d-pad up / down   sink / rise (Q / E)
 *   A               Observe on / off
 *   B / RB / d-pad right   Next animal in view
 *   X / LB          Follow / stop following
 *   Y               Field journal
 *   Start           Swim / Drift
 *   Back            Stop following + close observation
 *
 * Non-standard layouts (DirectInput mode, odd drivers) only trust face
 * buttons and sticks; anything else is ignored rather than firing mystery
 * actions. `?pad=1` shows a live raw-state overlay for exactly the "my pad
 * does nothing" report.
 */

const dz = (v, dead = 0.22) => {
  const a = Math.abs(v);
  if (a < dead) return 0;
  return ((a - dead) / (1 - dead)) * Math.sign(v);
};

export class DiveGamepad {
  constructor(expedition) {
    this.exp = expedition;
    this.app = expedition.app;
    this.prev = [];
    this.connected = false;
    this.label = '';
    this.mapping = '';
    this.last = '';
    this.warned = false;
    // Analog intents, read by follow mode. swim: x strafe-right, y rise,
    // z forward. look: x yaw, y pitch/orbit.
    this.swimVec = { x: 0, y: 0, z: 0 };
    this.lookVec = { x: 0, y: 0 };
    this.debug = null;
    try {
      const params = new URLSearchParams(location.search);
      if (params.get('pad') === '1') {
        this.debug = document.createElement('pre');
        this.debug.id = 'dive-pad-debug';
        this.debug.style.cssText = [
          'position:fixed;left:12px;top:64px;z-index:60;max-width:min(480px,90vw)',
          'max-height:60vh;overflow:auto;margin:0;padding:10px 12px',
          'font:10px/1.6 ui-monospace,Menlo,monospace;letter-spacing:.04em',
          'color:#dff2ff;background:rgba(4,10,18,.88)',
          'border:1px solid rgba(111,214,255,.35);border-radius:4px',
          'white-space:pre-wrap;pointer-events:none;',
        ].join(';');
        document.body.appendChild(this.debug);
      }
    } catch { /* location unavailable */ }
    window.addEventListener('gamepadconnected', (e) => {
      const g = e.gamepad;
      this.connected = true;
      this.label = String((g && g.id) || 'pad').slice(0, 32);
      this.mapping = (g && g.mapping) || '';
      try {
        console.log('[pad] connected:', g.id, '| mapping:', g.mapping,
          '| buttons:', (g.buttons || []).length, '| axes:', (g.axes || []).length);
      } catch { /* console unavailable */ }
      this.exp.syncPadStatus?.();
    });
    window.addEventListener('gamepaddisconnected', () => {
      this.connected = false;
      this.label = '';
      this.mapping = '';
      this.last = '';
      this.prev = [];
      this.swimVec = { x: 0, y: 0, z: 0 };
      this.lookVec = { x: 0, y: 0 };
      this.exp.syncPadStatus?.();
    });
  }

  read() {
    try {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const p of pads) if (p && p.connected) return p;
    } catch { /* Gamepad API unavailable */ }
    return null;
  }

  pressed(p, i) {
    const b = p.buttons && p.buttons[i];
    return !!(b && (b.pressed || b.value > 0.4));
  }

  edge(p, i) {
    if (i < 0) return false;
    const now = this.pressed(p, i);
    const was = this.prev[i];
    this.prev[i] = now;
    return now && !was;
  }

  rumble(p, ms = 60) {
    try {
      const a = p.vibrationActuator;
      if (a && a.playEffect) a.playEffect('dual-rumble', { duration: ms, weakMagnitude: 0.4, strongMagnitude: 0.2 });
    } catch { /* rumble unsupported */ }
  }

  setKey(code, on) {
    const keys = this.app.cine.keys;
    if (on) keys.add(code);
    else keys.delete(code);
  }

  poll(dt) {
    this.swimVec = { x: 0, y: 0, z: 0 };
    this.lookVec = { x: 0, y: 0 };
    let p = null;
    try {
      p = this.read();
    } catch (err) {
      if (!this.warned) { this.warned = true; console.warn('[pad] ignoring faulty gamepad:', err); }
      return;
    }
    if (!!p !== this.connected) {
      this.connected = !!p;
      this.label = p ? String(p.id || 'pad').slice(0, 32) : '';
      this.mapping = (p && p.mapping) || '';
      if (!p) this.prev = [];
      this.exp.syncPadStatus?.();
    }
    if (this.debug) this.debug.textContent = this.debugText(p);
    if (!p) return;
    if (this.app.paused) return;
    if (document.querySelector('dialog[open]')) return;
    if (!this.exp.active) return;
    const nonStandard = p.mapping && p.mapping !== 'standard';
    // Extras beyond face buttons are only trusted on standard layouts.
    const E = (i) => this.edge(p, (nonStandard && i > 3) ? -1 : i);
    this.mapping = p.mapping || '';

    const ax = p.axes || [];
    const lx = dz(ax[0] || 0), ly = dz(ax[1] || 0);
    const rx = dz(ax[2] || 0), ry = dz(ax[3] || 0);
    const lt = (p.buttons?.[6]?.value || 0) > 0.35;
    const rt = (p.buttons?.[7]?.value || 0) > 0.35;
    const hatU = this.pressed(p, 12), hatD = this.pressed(p, 13);

    // --- swim: left stick + triggers, mirrored into cine.keys ---------------
    const fwd = -ly, strafe = lx, rise = (rt || hatU ? 1 : 0) - (lt || hatD ? 1 : 0);
    this.swimVec = { x: strafe, y: rise, z: fwd };
    this.setKey('KeyW', fwd > 0.35);
    this.setKey('KeyS', fwd < -0.35);
    this.setKey('KeyD', strafe > 0.35);
    this.setKey('KeyA', strafe < -0.35);
    this.setKey('KeyE', rise > 0);
    this.setKey('KeyQ', rise < 0);

    // --- look: right stick ----------------------------------------------------
    // Free swim consumes yaw/pitch directly in the free-flight path. While
    // following, the watch orbits its offset from the same vector.
    this.lookVec = { x: rx, y: ry };
    const cine = this.app.cine;
    if (cine.free && (rx || ry)) {
      const rate = 1.9 * dt;
      cine.yaw -= rx * rate;
      cine.pitch = THREE.MathUtils.clamp(cine.pitch - ry * rate, -1.52, 1.52);
    }

    // --- observe actions: edge-latched, all usable mid-swim -------------------
    const watch = this.exp.watch;
    if (E(0) || E(14)) { watch?.toggle(); this.last = 'observe'; this.rumble(p); }
    else if (E(1) || E(5) || E(15)) { if (watch?.open) watch.next(); this.last = 'next'; }
    if (E(2) || E(4)) {
      if (watch?.following) watch.stopFollowing();
      else watch?.startFollowing();
      this.last = 'follow';
      this.rumble(p);
    }
    if (E(3)) { watch?.showJournal(); this.last = 'journal'; }
    if (E(9)) { this.exp.setSwim(!this.app.cine.free); this.last = 'swim/drift'; this.rumble(p); }
    if (E(8)) { watch?.stopFollowing(); watch?.toggle(false); this.last = 'observe off'; }
    if (this.last) this.exp.syncPadStatus?.();
  }

  debugText(p) {
    const L = ['DIVE PAD  (?pad=1 hides this)'];
    L.push('api: ' + typeof navigator.getGamepads + '   secure: ' + window.isSecureContext);
    if (!p) {
      L.push('pads: none — press any pad button (browsers enumerate on first press)');
    } else {
      const btns = p.buttons || [];
      const down = [];
      for (let i = 0; i < btns.length; i++) if (btns[i] && (btns[i].pressed || btns[i].value > 0.4)) down.push(i);
      L.push('pad: ' + String(p.id || '?').slice(0, 60));
      L.push('mapping=' + (p.mapping || '(none)') + ' buttons=' + btns.length + ' axes=' + (p.axes || []).length);
      L.push('down=[' + down.join(',') + '] axes=[' +
        (p.axes || []).map((a) => (typeof a === 'number' ? a.toFixed(2) : '?')).join(',') + ']');
    }
    L.push('handler: connected=' + this.connected + ' last=' + (this.last || '(none)'));
    L.push('swim=[' + [this.swimVec.x, this.swimVec.y, this.swimVec.z].map((v) => v.toFixed(2)).join(',') +
      '] look=[' + this.lookVec.x.toFixed(2) + ',' + this.lookVec.y.toFixed(2) + ']');
    return L.join('\n');
  }

  statusText() {
    if (this.connected) return 'Pad: ' + (this.label || 'connected') + ' · left stick swims · A observes';
    return 'Pad: none — press any XInput button';
  }
}
