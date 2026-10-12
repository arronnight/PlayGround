// Touch Xbox 360 pad + physical gamepad (Gamepad API), one input layer.
// Drives the game's press()/release() edges + keys[] holds + analog pad{}.

// Analog intents read by the game loop (merged with keyboard).
export const pad = { steerX: 0, push: 0, brake: 0, seen: false, type: '' };

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

export function initPad(keys, actions) {
  const { press, release } = actions;
  const layer = document.createElement('div');
  layer.id = 'pad';
  layer.innerHTML = `
    <div class="pad-cluster pad-left">
      <div class="pad-stick" id="pad-ls"><div class="pad-nub"></div><span class="pad-tag">L · steer/push</span></div>
      <div class="pad-shoulders">
        <div class="pad-btn pad-sh" data-k="KeyQ">LB</div>
        <div class="pad-btn pad-sh" data-k="KeyE">RB</div>
      </div>
      <div class="pad-trigs">
        <div class="pad-btn pad-tg" data-k="KeyG">LT</div>
        <div class="pad-btn pad-tg" data-k="Space">RT</div>
      </div>
    </div>
    <div class="pad-cluster pad-mid">
      <div class="pad-btn pad-small" id="pad-back">◀</div>
      <div class="pad-btn pad-small" id="pad-start">▶</div>
    </div>
    <div class="pad-cluster pad-right">
      <div class="pad-stick" id="pad-rs"><div class="pad-nub"></div><span class="pad-tag">R · flick = trick</span></div>
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
  setupStick(document.getElementById('pad-ls'), (x, y) => {
    pad.steerX = Math.abs(x) > 0.14 ? x : 0;
    pad.push = y < -0.3 ? clamp((-y - 0.3) / 0.7, 0, 1) : 0;
    pad.brake = y > 0.3 ? clamp((y - 0.3) / 0.7, 0, 1) : 0;
    pad.type = 'touch';
  }, null);
  setupStick(document.getElementById('pad-rs'), null, (dx, dy, ms, dist) => {
    pad.type = 'touch';
    if (dist < 0.55 || ms > 400) return; // require a real flick
    const adx = Math.abs(dx), ady = Math.abs(dy);
    if (dy < -0.35 && adx < -dy * 0.8) flick('Space');       // flick up = ollie
    else if (dy < -0.2 && dx > 0.3) flick('KeyF');           // up-right = kickflip
    else if (dy < -0.2 && dx < -0.3) flick('KeyH');          // up-left = heelflip
    else if (dx > 0.5) flick('KeyF');                       // right = kickflip
    else if (dx < -0.5) flick('KeyH');                      // left = heelflip
    else if (dy > 0.4) flick('KeyG');                       // down = shove-it
  });
  function flick(code) {
    press(code); release(code);
    flashStick();
  }
  function flashStick() {
    const rs = document.getElementById('pad-rs');
    rs.classList.add('flick'); setTimeout(() => rs.classList.remove('flick'), 180);
  }

  function setupStick(el, onMove, onFlick) {
    const nub = el.querySelector('.pad-nub');
    const R = 44;
    let pid = null, cx = 0, cy = 0, t0 = 0, maxD = 0, sx = 0, sy = 0;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      pid = e.pointerId;
      try { el.setPointerCapture(pid); } catch { /* synthetic events */ }
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      t0 = performance.now(); maxD = 0;
      move(e); pad.seen = true;
    });
    el.addEventListener('pointermove', (e) => { if (e.pointerId === pid) move(e); });
    const end = (e) => {
      if (e.pointerId !== pid) return;
      pid = null;
      nub.style.transform = 'translate(-50%,-50%)';
      if (onFlick) onFlick(sx, sy, performance.now() - t0, maxD);
      sx = sy = 0; maxD = 0;
      if (onMove) onMove(0, 0);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    function move(e) {
      let dx = (e.clientX - cx) / R, dy = (e.clientY - cy) / R;
      const m = Math.hypot(dx, dy);
      if (m > 1) { dx /= m; dy /= m; }
      const dz = Math.hypot(dx, dy) < 0.14 ? 0 : 1;
      sx = dx; sy = dy; maxD = Math.max(maxD, Math.hypot(dx, dy));
      nub.style.transform = `translate(calc(-50% + ${dx * R * dz}px), calc(-50% + ${dy * R * dz}px))`;
      if (onMove) onMove(dx * dz, dy * dz);
    }
  }

  // ---- start / back ----
  document.getElementById('pad-start').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); actions.togglePause(); });
  document.getElementById('pad-back').addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); press('KeyR'); release('KeyR'); });

  // ---- physical gamepad (Xbox 360 mapping), polled in rAF ----
  const gp = { idx: -1, prev: [], rsArmed: false, rsDir: null, rsT: 0 };
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
    if (document.body.classList.contains('pad-hidden') && gp.idx < 0) { pad.steerX = 0; pad.push = 0; pad.brake = 0; return; }
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
    // buttons: 0 A push, 1 B brake, 2 X kick, 3 Y heel, 4 LB grab, 5 RB grab,
    // 6 LT shove, 7 RT ollie, 8 back reset, 9 start pause, 12-15 dpad tricks
    const map = { 0: 'KeyW', 1: 'KeyS', 2: 'KeyF', 3: 'KeyH', 4: 'KeyQ', 5: 'KeyE', 6: 'KeyG', 7: 'Space', 12: 'Space', 13: 'KeyG', 14: 'KeyH', 15: 'KeyF' };
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
    // right stick flick: hard deflect then snap back = trick
    const rx = g.axes[2] || 0, ry = g.axes[3] || 0;
    const m = Math.hypot(rx, ry);
    if (!gp.rsArmed && m > 0.65) { gp.rsArmed = true; gp.rsDir = { x: rx / m, y: ry / m }; gp.rsT = performance.now(); }
    if (gp.rsArmed && m < 0.3) {
      gp.rsArmed = false;
      if (performance.now() - gp.rsT < 450) {
        const { x, y } = gp.rsDir;
        if (y < -0.35 && Math.abs(x) < -y * 0.8) { press('Space'); release('Space'); }
        else if (y < -0.2 && x > 0.3) { press('KeyF'); release('KeyF'); }
        else if (y < -0.2 && x < -0.3) { press('KeyH'); release('KeyH'); }
        else if (x > 0.5) { press('KeyF'); release('KeyF'); }
        else if (x < -0.5) { press('KeyH'); release('KeyH'); }
        else if (y > 0.4) { press('KeyG'); release('KeyG'); }
      }
    }
    if (gp.rsArmed && performance.now() - gp.rsT > 900) gp.rsArmed = false;
  })();

  function flashPad(t) {
    let el = document.getElementById('padToast');
    if (!el) { el = document.createElement('div'); el.id = 'padToast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('show');
    clearTimeout(flashPad._t); flashPad._t = setTimeout(() => el.classList.remove('show'), 2200);
  }
}
