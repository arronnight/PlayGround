// Touch Xbox 360 pad + physical gamepad (Gamepad API), one input layer.
// Drives the game's press()/release() edges + keys[] holds + analog pad{}.

// Analog intents read by the game loop (merged with keyboard).
// steerX: stick-right positive (matches D key). rsHold: live right-stick
// vector for grind-style / manual / tweak holds (y down-positive like screen).
export const pad = { steerX: 0, push: 0, brake: 0, seen: false, type: '', rsHold: { x: 0, y: 0 } };

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

// ---- Skate-style RS gesture classifier (shared by touch + physical pad) ----
// Trail points are stick radii (x right+, y down+), t in ms.
// Two-stage pops (down-then-up = ollie, up-then-down = nollie), corner loads
// (varial/hard/tre), and curved quarter-circle sweeps (shuvits) are read from
// the load quadrant, the release direction, and the path curvature.
function dir8(x, y) { // 8-way sector, y down-positive
  const a = Math.atan2(y, x) * 180 / Math.PI; // R=0 D=90 L=±180 U=-90
  if (a >= -112.5 && a < -67.5) return 'U';
  if (a >= -67.5 && a < -22.5) return 'UR';
  if (a >= -22.5 && a < 22.5) return 'R';
  if (a >= 22.5 && a < 67.5) return 'DR';
  if (a >= 67.5 && a < 112.5) return 'D';
  if (a >= 112.5 && a < 157.5) return 'DL';
  if (a >= -157.5 && a < -112.5) return 'UL';
  return 'L';
}
export function classifyTrail(tr) {
  if (!tr || tr.length < 3) return null;
  // Trailing window: only the last 700ms matters. A sustained pump-hold
  // before the flick must not veto it; a pure long hold reads as static
  // (load == end sector) and is still rejected below.
  const endT = tr[tr.length - 1].t;
  let start = 0;
  while (start < tr.length - 1 && endT - tr[start].t > 700) start++;
  if (start > 0) tr = tr.slice(start);
  const dur = tr[tr.length - 1].t - tr[0].t;
  if (dur > 950) return null; // slow drags are holds, not tricks
  let maxR = 0, load = null, end = null, path = 0;
  for (let i = 0; i < tr.length; i++) {
    const p = tr[i], r = Math.hypot(p.x, p.y);
    if (r > maxR) maxR = r;
    if (!load && r > 0.5) load = { x: p.x, y: p.y, i };
    if (r > 0.5) end = { x: p.x, y: p.y, i };
    if (i > 0) path += Math.hypot(p.x - tr[i - 1].x, p.y - tr[i - 1].y);
  }
  if (maxR < 0.6 || !load || !end) return null; // light tilts are holds (manuals)
  const L = dir8(load.x, load.y), E = dir8(end.x, end.y);
  if (dur > 650 && L === E) return null; // sustained hold released, not a flick
  const chord = Math.max(0.2, Math.hypot(end.x - load.x, end.y - load.y));
  if (L === 'D' && E === 'U') return 'ollie';
  if (L === 'U' && E === 'D') return 'nollie';
  if (L === 'D' && (E === 'UR' || E === 'UL')) {
    // Straight diagonal out = flip; routing through the side sector = sweep.
    const side = E === 'UR' ? 'R' : 'L';
    for (let i = load.i + 1; i < end.i; i++) {
      const p = tr[i];
      if (Math.hypot(p.x, p.y) > 0.55 && dir8(p.x, p.y) === side) return 'shove';
    }
    return E === 'UR' ? 'kick' : 'heel';
  }
  if (L === 'D' && (E === 'L' || E === 'R' || E === 'DL' || E === 'DR')) return 'shove';
  if (L === 'DL' && E === 'UR') return (path / chord > 1.45 || dur > 550) ? 'tre' : 'varial';
  if (L === 'DR' && E === 'UR') return 'hard';
  if ((L === 'DL' || L === 'DR') && E === 'U') return 'shove';
  if (L === 'U' && E === 'U') return 'ollie';   // forgiving single flicks
  if (L === 'UR' && E === 'UR') return 'kick';
  if (L === 'UL' && E === 'UL') return 'heel';
  return null;
}

export function initPad(keys, actions) {
  const { press, release } = actions;
  const doTrick = (name) => { flashStick(); actions.trick?.(name); };
  const layer = document.createElement('div');
  layer.id = 'pad';
  layer.innerHTML = `
    <div class="pad-cluster pad-left">
      <div class="pad-stick" id="pad-ls"><div class="pad-nub"></div><span class="pad-tag">L · steer/push</span></div>
      <div class="pad-shoulders">
        <div class="pad-btn pad-sh" data-k="KeyG">LB</div>
        <div class="pad-btn pad-sh" data-k="Space">RB</div>
      </div>
      <div class="pad-trigs">
        <div class="pad-btn pad-tg" data-k="KeyQ">LT</div>
        <div class="pad-btn pad-tg" data-k="KeyE">RT</div>
      </div>
    </div>
    <div class="pad-cluster pad-mid">
      <div class="pad-btn pad-small" id="pad-back">◀</div>
      <div class="pad-btn pad-small" id="pad-start">▶</div>
    </div>
    <div class="pad-cluster pad-right">
      <div class="pad-stick" id="pad-rs"><div class="pad-nub"></div><span class="pad-tag">R · flick tricks · hold = style</span></div>
      <div class="pad-abxy">
        <div class="pad-btn pad-y" data-k="KeyH">Y</div>
        <div class="pad-btn pad-x" data-k="KeyF">X</div>
        <div class="pad-btn pad-b" data-k="KeyS">B</div>
        <div class="pad-btn pad-a" data-k="KeyW">A</div>
      </div>
    </div>`;
  document.body.appendChild(layer);

  // ---- visibility: auto on touch, toggle button always available ----
  const coarse = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  document.body.classList.toggle('pad-hidden', !coarse && !location.search.includes('pad=1'));
  const tg = document.createElement('button');
  tg.id = 'padToggle';
  tg.textContent = '🎮';
  tg.title = 'toggle gamepad';
  tg.addEventListener('click', () => {
    document.body.classList.toggle('pad-hidden');
    pad.seen = true;
  });
  document.body.appendChild(tg);

  // ---- hold buttons (LB/RB/LT/ABXY/shoulders): keys[] + edge actions ----
  layer.querySelectorAll('.pad-btn[data-k]').forEach((el) => {
    const code = el.dataset.k;
    const down = (e) => {
      e.preventDefault(); e.stopPropagation();
      try { el.setPointerCapture?.(e.pointerId); } catch { /* synthetic/shadow DOM */ }
      if (!keys[code]) { keys[code] = true; press(code); }
      el.classList.add('down'); pad.seen = true; pad.type = 'touch';
    };
    const up = (e) => {
      e.preventDefault();
      if (keys[code]) { keys[code] = false; release(code); }
      el.classList.remove('down');
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', (e) => { if (keys[code]) { keys[code] = false; release(code); } el.classList.remove('down'); });
  });

  // ---- sticks ----
  // LS: steer + push/brake. RS: gesture trail (flick tricks) + live hold
  // vector (grind style / manuals / grab tweaks).
  setupStick(document.getElementById('pad-ls'), (x, y) => {
    pad.steerX = Math.abs(x) > 0.14 ? x : 0;
    pad.push = y < -0.3 ? clamp((-y - 0.3) / 0.7, 0, 1) : 0;
    pad.brake = y > 0.3 ? clamp((y - 0.3) / 0.7, 0, 1) : 0;
    pad.type = 'touch';
  }, null);
  setupStick(document.getElementById('pad-rs'), (x, y) => {
    pad.rsHold.x = x; pad.rsHold.y = y;
    pad.type = 'touch';
  }, (trail) => {
    pad.type = 'touch';
    const name = classifyTrail(trail);
    if (name) doTrick(name);
  });
  function flashStick() {
    const rs = document.getElementById('pad-rs');
    rs.classList.add('flick'); setTimeout(() => rs.classList.remove('flick'), 180);
  }

  function setupStick(el, onMove, onDone) {
    const nub = el.querySelector('.pad-nub');
    const R = 44;
    let pid = null, cx = 0, cy = 0, trail = [];
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      pid = e.pointerId;
      try { el.setPointerCapture(pid); } catch { /* synthetic events */ }
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      trail = [{ x: 0, y: 0, t: performance.now() }];
      move(e); pad.seen = true;
    });
    el.addEventListener('pointermove', (e) => { if (e.pointerId === pid) move(e); });
    const end = (e) => {
      if (e.pointerId !== pid) return;
      pid = null;
      nub.style.transform = 'translate(-50%,-50%)';
      if (onDone) onDone(trail);
      trail = [];
      if (onMove) onMove(0, 0);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    function move(e) {
      let dx = (e.clientX - cx) / R, dy = (e.clientY - cy) / R;
      const m = Math.hypot(dx, dy);
      if (m > 1) { dx /= m; dy /= m; }
      trail.push({ x: dx, y: dy, t: performance.now() });
      if (trail.length > 64) trail.shift();
      const dz = Math.hypot(dx, dy) < 0.14 ? 0 : 1;
      nub.style.transform = `translate(calc(-50% + ${dx * R * dz}px), calc(-50% + ${dy * R * dz}px))`;
      if (onMove) onMove(dx * dz, dy * dz);
    }
  }

  // ---- start / back ----
  document.getElementById('pad-start').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); actions.togglePause(); });
  document.getElementById('pad-back').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); press('KeyR'); release('KeyR'); });

  // ---- physical gamepad (Xbox 360 mapping), polled in rAF ----
  const gp = { idx: -1, prev: [], rsTrail: [], rsT0: 0 };
  pad.rumble = (strong = 0.6, weak = 0.3, dur = 150) => {
    try {
      const g = navigator.getGamepads?.()[gp.idx];
      g?.vibrationActuator?.playEffect('dual-rumble', { strongMagnitude: strong, weakMagnitude: weak, duration: dur });
    } catch { /* no rumble */ }
  };
  addEventListener('gamepadconnected', (e) => {
    gp.idx = e.gamepad.index; pad.seen = true; pad.type = 'gamepad';
    flashPad(`PAD: ${e.gamepad.id.slice(0, 28)}`);
  });
  addEventListener('gamepaddisconnected', () => { gp.idx = -1; });
  (function poll() {
    requestAnimationFrame(poll);
    if (document.body.classList.contains('pad-hidden') && gp.idx < 0) { pad.steerX = 0; pad.push = 0; pad.brake = 0; pad.rsHold.x = 0; pad.rsHold.y = 0; return; }
    let g = null;
    try {
      const pads = navigator.getGamepads?.() || [];
      g = gp.idx >= 0 ? pads[gp.idx] : [...pads].find((x) => x?.connected) || null;
      if (g) gp.idx = g.index;
    } catch { return; }
    if (!g) return;
    pad.seen = true; if (pad.type === '') pad.type = 'gamepad';
    const dz = (v) => Math.abs(v) < 0.16 ? 0 : v;
    // left stick: steer + push/brake
    pad.steerX = clamp(dz(g.axes[0] || 0), -1, 1);
    const ly = dz(g.axes[1] || 0);
    pad.push = ly < -0.25 ? clamp((-ly - 0.25) / 0.75, 0, 1) : 0;
    pad.brake = ly > 0.25 ? clamp((ly - 0.25) / 0.75, 0, 1) : 0;
    // buttons: 0 A push, 1 B brake, 2 X kick, 3 Y heel, 4 LB shove-it,
    // 5 RB ollie tap, 6 LT left-hand grab, 7 RT right-hand grab,
    // 8 back reset, 9 start pause, 12-15 dpad tricks
    const map = { 0: 'KeyW', 1: 'KeyS', 2: 'KeyF', 3: 'KeyH', 4: 'KeyG', 5: 'Space', 6: 'KeyQ', 7: 'KeyE', 12: 'Space', 13: 'KeyG', 14: 'KeyH', 15: 'KeyF' };
    for (const [bi, code] of Object.entries(map)) {
      const b = g.buttons[+bi];
      const was = gp.prev[bi] || false, is = !!b?.pressed;
      if (is && !was) { keys[code] = true; press(code); }
      if (!is && was) { keys[code] = false; release(code); }
      gp.prev[bi] = is;
    }
    edge(9, () => actions.togglePause());
    edge(8, () => { press('KeyR'); release('KeyR'); });
    function edge(bi, fn) {
      const is = !!g.buttons[bi]?.pressed;
      if (is && !gp.prev['e' + bi]) fn();
      gp.prev['e' + bi] = is;
    }
    // right stick: gesture trail (two-stage flicks) + live hold vector
    // (grind style / manuals / grab tweaks). Trail runs while deflected and
    // classifies on return to center, same table as the touch stick.
    const rx = g.axes[2] || 0, ry = g.axes[3] || 0;
    const m = Math.hypot(rx, ry);
    pad.rsHold.x = m > 0.12 ? rx : 0;
    pad.rsHold.y = m > 0.12 ? ry : 0;
    if (m > 0.3) {
      if (!gp.rsTrail.length) gp.rsT0 = performance.now();
      gp.rsTrail.push({ x: rx, y: ry, t: performance.now() });
      if (gp.rsTrail.length > 64) gp.rsTrail.shift();
    } else if (gp.rsTrail.length >= 3) {
      const name = classifyTrail(gp.rsTrail);
      gp.rsTrail = [];
      if (name) doTrick(name);
    }
    if (gp.rsTrail.length && performance.now() - gp.rsT0 > 1000) gp.rsTrail = [];
  })();

  function flashPad(t) {
    let el = document.getElementById('padToast');
    if (!el) { el = document.createElement('div'); el.id = 'padToast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('show');
    clearTimeout(flashPad._t); flashPad._t = setTimeout(() => el.classList.remove('show'), 2200);
  }
  window.__skatePad = { pad, classifyTrail };
}
