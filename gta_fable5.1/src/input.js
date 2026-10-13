import { KEYS } from './config.js';

// XInput-style gamepad support (Xbox / standard mapping) layered on top of
// keyboard + mouse. Keyboard/mouse keep working; the pad mirrors them:
//
//   Left stick ........ move / steer          Right stick ....... look (camera)
//   RT (analog) ....... fire ON FOOT / gas in car (never fires in car)
//   LT (analog) ....... aim ON FOOT / brake+reverse in car
//   RB ................ drive-by fire in car (also fires on foot)
//   LB ................ aim alt / prev weapon (never a pedal)
//   A ................. jump / handbrake in car / confirm
//   B ................. sprint (tap) / back / reverse-alt in car
//   X ................. interact (talk/shop) / horn in car
//   Y ................. enter / exit vehicle
//   LB / RB ........... prev / next weapon
//   L3 ................ sprint (hold)         R3 .......... camera reset
//   D-Up / D-Down ..... weapons              D-Left ....... radio
//   D-Right ........... horn                 View ......... map
//   Menu .............. pause
//
// Analog triggers report 0..1 via `lt` / `rt`; `drive()` and `footMove()`
// expose fully analog control. `rumble()` plays XInput vibration when available.

const DEAD = 0.16;
const TRIGGER_HOLD = 0.25;

function deadzone(v, d = DEAD) {
  if (Math.abs(v) < d) return 0;
  const s = (Math.abs(v) - d) / (1 - d);
  return Math.sign(v) * Math.min(1, s);
}

export class Input {
  constructor(canvas) {
    this.keys = new Set(); this.pressed = new Set();
    this.mouse = { dx: 0, dy: 0, left: false, right: false, leftPressed: false, wheel: 0 };
    this.locked = false; this.canvas = canvas;
    window.addEventListener('keydown', (e) => { if (e.repeat) return; this.keys.add(e.code); this.pressed.add(e.code); if (['Space', 'Tab', 'F1'].includes(e.code)) e.preventDefault(); });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => { this.keys.clear(); this.mouse.left = this.mouse.right = false; });
    document.addEventListener('mousemove', (e) => { if (!this.locked) return; this.mouse.dx += e.movementX; this.mouse.dy += e.movementY; });
    document.addEventListener('mousedown', (e) => { if (!this.locked) return; if (e.button === 0) { this.mouse.left = true; this.mouse.leftPressed = true; } if (e.button === 2) this.mouse.right = true; });
    document.addEventListener('mouseup', (e) => { if (e.button === 0) this.mouse.left = false; if (e.button === 2) this.mouse.right = false; });
    document.addEventListener('wheel', (e) => { if (this.locked) this.mouse.wheel += Math.sign(e.deltaY); }, { passive: true });
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', () => { this.locked = document.pointerLockElement === canvas; this.onLockChange?.(this.locked); });
    // --- XInput state ---
    this.padHeld = new Set(); this.padPressed = new Set();
    this.pad = { connected: false, id: '', lx: 0, ly: 0, rx: 0, ry: 0, lt: 0, rt: 0 };
    this._gpPrev = [];
    this._gpIndex = -1;
    window.addEventListener('gamepadconnected', (e) => {
      this._gpIndex = e.gamepad.index;
      this.onPadChange?.(true, e.gamepad.id);
    });
    window.addEventListener('gamepaddisconnected', () => {
      this._gpIndex = -1; this.padHeld.clear();
      this.pad = { connected: false, id: '', lx: 0, ly: 0, rx: 0, ry: 0, lt: 0, rt: 0 };
      this.onPadChange?.(false, '');
    });
  }
  lock() { this.canvas.requestPointerLock?.(); }

  get gamepadConnected() { return this.pad.connected; }
  get gamepadId() { return this.pad.id; }

  /** Sample the first connected pad and mirror it onto virtual keys + camera deltas. Call once per frame. */
  pollGamepad() {
    this.padPressed.clear();
    let gp = null;
    try {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      if (this._gpIndex >= 0 && pads && pads[this._gpIndex]?.connected) gp = pads[this._gpIndex];
      else if (pads) gp = Array.from(pads).find((g) => g && g.connected) || null;
    } catch { gp = null; }
    if (!gp) {
      if (this.pad.connected) { this.padHeld.clear(); this.pad = { connected: false, id: '', lx: 0, ly: 0, rx: 0, ry: 0, lt: 0, rt: 0 }; this.onPadChange?.(false, ''); }
      this._gpPrev = [];
      return;
    }
    const wasConnected = this.pad.connected;
    const b = (i) => gp.buttons[i]?.pressed || false;
    const v = (i) => gp.buttons[i]?.value || 0;
    const lt = Math.max(v(6), b(6) ? 1 : 0), rt = Math.max(v(7), b(7) ? 1 : 0);
    const lx = deadzone(gp.axes[0] || 0), ly = deadzone(gp.axes[1] || 0);
    const rx = deadzone(gp.axes[2] || 0), ry = deadzone(gp.axes[3] || 0);
    this.pad = { connected: true, id: gp.id || '', lx, ly, rx, ry, lt, rt, raw: gp };
    if (!wasConnected) this.onPadChange?.(true, this.pad.id);
    // right stick -> camera (same units as mouse deltas; ~22px per frame at full tilt)
    this.mouse.dx += rx * 26; this.mouse.dy += ry * 20;
    // d-pad can nudge the camera too when the stick is idle
    if (Math.abs(rx) < 0.01 && Math.abs(ry) < 0.01) {
      if (b(14)) this.mouse.dx -= 12; if (b(15)) this.mouse.dx += 12;
    }
    const hold = (action, isDown) => {
      const was = this.padHeld.has(action);
      if (isDown && !was) { this.padHeld.add(action); this.padPressed.add(action); }
      else if (!isDown && was) this.padHeld.delete(action);
    };
    const edge = (action, isDown) => { if (isDown && !this.padHeld.has(action + ':e')) { this.padHeld.add(action + ':e'); this.padPressed.add(action); } else if (!isDown) this.padHeld.delete(action + ':e'); return isDown; };
    // face buttons
    hold('jump', b(0));                    // A
    hold('sprint', b(1) || b(10));         // B or L3
    hold('interact', b(2));                // X
    hold('enter', b(3));                   // Y
    // bumpers double as aim/fire so driving + drive-bys work while triggers drive.
    // NOTE: RT is pedals in the car and must NEVER fire there — drive-by fire is RB only.
    hold('aim', lt > TRIGGER_HOLD || b(4));
    hold('fire', rt > TRIGGER_HOLD);
    hold('firePressed', edge('fireEdge', rt > TRIGGER_HOLD));
    hold('driveby', b(5));
    hold('drivebyPressed', edge('drivebyEdge', b(5)));
    hold('nextWeapon', b(5));
    hold('prevWeapon', b(4));
    hold('horn', b(15) || b(2));           // D-right or X in car
    hold('radio', b(14));                  // D-left
    hold('camera', b(11));                 // R3 resets camera
    hold('handbrake', b(0));               // A doubles as handbrake in car
    hold('map', b(8));                     // View
    hold('pause', b(9));                   // Menu
    hold('help', false);
    hold('skiptime', false);
    hold('ao', false);
    // d-pad weapon cycling
    hold('dUp', b(12)); hold('dDown', b(13));
    this._gpPrev = gp.buttons.map((x) => x.pressed);
  }

  /** XInput rumble. strong/weak 0..1, duration ms. No-op when unsupported. */
  rumble(strong = 0.6, weak = 0.4, duration = 120) {
    try {
      const g = this.pad.raw;
      const act = g?.vibrationActuator;
      if (!act?.playEffect) return false;
      act.playEffect('dual-rumble', { strongMagnitude: strong, weakMagnitude: weak, duration }).catch?.(() => {});
      return true;
    } catch { return false; }
  }

  down(action) {
    if (this.padHeld.has(action)) return true;
    // fire/aim also read analog so half-pulls still count once past the hold threshold
    if (action === 'forward' && this.pad.rt > TRIGGER_HOLD) return false; // car gas handled via drive()
    const ks = KEYS[action];
    return ks ? ks.some(k => this.keys.has(k)) : false;
  }
  hit(action) {
    if (this.padPressed.has(action)) return true;
    const ks = KEYS[action];
    return ks ? ks.some(k => this.pressed.has(k)) : false;
  }
  hitCode(code) { return this.pressed.has(code); }
  axis(neg, pos) {
    const kb = (this.down(pos) ? 1 : 0) - (this.down(neg) ? 1 : 0);
    if (neg === 'left' && pos === 'right' && this.pad.lx !== 0) return kb !== 0 ? kb : this.pad.lx;
    if (neg === 'back' && pos === 'forward' && this.pad.ly !== 0) return kb !== 0 ? kb : -this.pad.ly;
    return kb;
  }
  /** Analog on-foot movement in camera space: x right+, y forward+. */
  footMove() {
    const ix = this.axis('left', 'right'), iz = this.axis('back', 'forward');
    if (this.pad.lx !== 0 || this.pad.ly !== 0) {
      const ax = Math.abs(ix) > 0.01 && this.pad.lx === 0 ? ix : (Math.abs(this.pad.lx) > Math.abs(ix) ? this.pad.lx : ix);
      const az = Math.abs(iz) > 0.01 && this.pad.ly === 0 ? iz : (Math.abs(-this.pad.ly) > Math.abs(iz) ? -this.pad.ly : iz);
      return { x: ax, y: az, mag: Math.min(1, Math.hypot(ax, az)) };
    }
    return { x: ix, y: iz, mag: Math.min(1, Math.hypot(ix, iz)) };
  }
  /** Analog driving: throttle/brake 0..1 (triggers + keys), steer -1..1. */
  drive() {
    const keyGas = this.down('forward') ? 1 : 0, keyBrake = this.down('back') ? 1 : 0;
    const throttle = Math.max(keyGas, this.pad.rt);
    const brake = Math.max(keyBrake, this.pad.lt);
    let steer = -this.axis('left', 'right');
    return { throttle, brake, steer };
  }
  get firing() { return this.mouse.left || this.padHeld.has('fire') || this.padHeld.has('driveby'); }
  get firingPressed() { return this.mouse.leftPressed || this.padPressed.has('firePressed') || this.padPressed.has('fire') || this.padPressed.has('drivebyPressed') || this.padPressed.has('driveby'); }
  // In-car drive-by fire: bumpers / LMB only — RT (gas) is excluded on purpose.
  get vehicleFiring() { return this.mouse.left || this.padHeld.has('driveby'); }
  get vehicleFiringPressed() { return this.mouse.leftPressed || this.padPressed.has('drivebyPressed') || this.padPressed.has('driveby'); }
  get aiming() { return this.mouse.right || this.padHeld.has('aim'); }
  endFrame() { this.pressed.clear(); this.padPressed.clear(); this.mouse.dx = 0; this.mouse.dy = 0; this.mouse.leftPressed = false; this.mouse.wheel = 0; }
}
