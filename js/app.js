/* App glue: web-libretro boot (EmulatorJS, snes9x) + control routing
 * (Human/XInput vs Mario-AI on P1/P2) + HUD.
 */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  var logEl = $('log');
  function log(msg) {
    var t = new Date().toLocaleTimeString();
    logEl.textContent += '[' + t + '] ' + msg + '\n';
    logEl.scrollTop = logEl.scrollHeight;
  }

  // ---- SNES button -> physical keys, per player ----
  // EJS control values must use EJS keyMap words (checked against the EJS 4.x
  // source: arrows are 'up arrow' etc., 219 is 'open bracket', 221 is
  // 'close braket' [sic], 187 'equal sign', 189 'dash'). Anything else
  // resolves to -1 and the button silently dies.
  var P1_EJS = {
    up: 'up arrow', down: 'down arrow', left: 'left arrow', right: 'right arrow',
    A: 'z', B: 'x', X: 'a', Y: 's', L: 'q', R: 'e',
    start: 'enter', select: 'v'
  };
  // P2: upstream ships empty, so we claim free keys (digits + u, brackets,
  // dash, equal). Physical keyCodes in P2_CODE.
  var P2_EJS = {
    up: '8', down: '5', left: '4', right: '6',
    A: '9', B: '7', X: '0', Y: 'u', L: 'open bracket', R: 'close braket',
    start: 'equal sign', select: 'dash'
  };
  // Synthetic KeyboardEvent key/code strings per button.
  var P1_KEY = {
    up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight',
    A: 'z', B: 'x', X: 'a', Y: 's', L: 'q', R: 'e',
    start: 'Enter', select: 'v'
  };
  var P1_CODE = {
    up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight',
    A: 'KeyZ', B: 'KeyX', X: 'KeyA', Y: 'KeyS', L: 'KeyQ', R: 'KeyE',
    start: 'Enter', select: 'KeyV'
  };
  var P2_KEY = {
    up: '8', down: '5', left: '4', right: '6',
    A: '9', B: '7', X: '0', Y: 'u', L: '[', R: ']',
    start: '=', select: '-'
  };
  var P2_CODE = {
    up: 'Digit8', down: 'Digit5', left: 'Digit4', right: 'Digit6',
    A: 'Digit9', B: 'Digit7', X: 'Digit0', Y: 'KeyU', L: 'BracketLeft', R: 'BracketRight',
    start: 'Equal', select: 'Minus'
  };
  // Physical keyCodes. EJS matches runtime controls against event.keyCode
  // (not .key), so human tracking AND synthetic injection both use these.
  var P1_KEYCODE = {
    up: 38, down: 40, left: 37, right: 39,
    A: 90, B: 88, X: 65, Y: 83, L: 81, R: 69,
    start: 13, select: 86
  };
  var P2_KEYCODE = {
    up: 56, down: 53, left: 52, right: 54,
    A: 57, B: 55, X: 48, Y: 85, L: 219, R: 221,
    start: 187, select: 189
  };
  var SNES_BTNS = ['up', 'down', 'left', 'right', 'A', 'B', 'X', 'Y', 'L', 'R', 'start', 'select'];

  // Per-player virtual (AI-driven) key state + human-held tracking.
  var aiState = { p1: {}, p2: {} };
  var humanHeld = { p1: {}, p2: {} };
  SNES_BTNS.forEach(function (b) { aiState.p1[b] = false; aiState.p2[b] = false; });
  var CODE_TO_P1 = {}, CODE_TO_P2 = {};
  SNES_BTNS.forEach(function (b) { CODE_TO_P1[P1_KEYCODE[b]] = b; CODE_TO_P2[P2_KEYCODE[b]] = b; });

  var routing = { p1: 'human', p2: 'off' };

  // EJS listens for keys on its container (EJS_player, i.e. #game) — verified
  // against the EJS 4.x source (bindListeners). Synthetic keys must be
  // dispatched there: window/document dispatches never pass through it.
  function ejsInputTarget() {
    var em = window.EJS_emulator;
    if (em && em.elements && em.elements.parent) return em.elements.parent;
    return document.getElementById('game') || document;
  }

  function sendKey(player, btn, down) {
    var keys = player === 'p1' ? P1_KEY : P2_KEY;
    var codes = player === 'p1' ? P1_CODE : P2_CODE;
    var kc = (player === 'p1' ? P1_KEYCODE : P2_KEYCODE)[btn];
    var ev;
    try {
      ev = new KeyboardEvent(down ? 'keydown' : 'keyup', {
        key: keys[btn], code: codes[btn], bubbles: true, cancelable: true
      });
    } catch (e) { return; }
    // EJS compares event.keyCode (synthetic events default to 0) — stamp it.
    try {
      Object.defineProperty(ev, 'keyCode', { value: kc });
      Object.defineProperty(ev, 'which', { value: kc });
    } catch (e) { /* read-only in some engines; EJS then can't see the key */ }
    ejsInputTarget().dispatchEvent(ev);
  }

  // Set one AI-owned button, respecting human-held keys (never steal/release
  // a key the human physically holds).
  function setAiButton(player, btn, down) {
    var slot = player === 'p1' ? 'p1' : 'p2';
    if (aiState[slot][btn] === down) return;
    aiState[slot][btn] = down;
    if (down && humanHeld[slot][btn]) return;   // already physically down
    if (!down && humanHeld[slot][btn]) return;  // human still holds it
    sendKey(player, btn, down);
  }

  function aiDrive(player, action) {
    // action = {arrow, button}; exactly two SNES buttons like actions.lua.
    var want = {};
    SNES_BTNS.forEach(function (b) { want[b] = false; });
    if (action) {
      if (action.arrow) want[action.arrow] = true;
      if (action.button) want[action.button] = true;
    }
    SNES_BTNS.forEach(function (b) { setAiButton(player, b, want[b]); });
  }

  function releaseAi(player) { aiDrive(player, null); }

  // Track human keys by keyCode (what EJS matches on) — trusted events only,
  // registered before the blocker.
  window.addEventListener('keydown', function (e) {
    if (!e.isTrusted) return;
    var b1 = CODE_TO_P1[e.keyCode], b2 = CODE_TO_P2[e.keyCode];
    if (b1) humanHeld.p1[b1] = true;
    if (b2) humanHeld.p2[b2] = true;
  }, true);
  window.addEventListener('keyup', function (e) {
    if (!e.isTrusted) return;
    var b1 = CODE_TO_P1[e.keyCode], b2 = CODE_TO_P2[e.keyCode];
    if (b1) humanHeld.p1[b1] = false;
    if (b2) humanHeld.p2[b2] = false;
  }, true);
  // Exclusive mode: block human keys from reaching the emulator on AI pads.
  window.addEventListener('keydown', function (e) {
    if (!e.isTrusted || !$('exclusiveAi').checked) return;
    if (routing.p1 === 'ai' && CODE_TO_P1[e.keyCode]) { e.stopPropagation(); e.preventDefault(); }
    else if (routing.p2 === 'ai' && CODE_TO_P2[e.keyCode]) { e.stopPropagation(); e.preventDefault(); }
  }, true);
  window.addEventListener('keyup', function (e) {
    if (!e.isTrusted || !$('exclusiveAi').checked) return;
    if (routing.p1 === 'ai' && CODE_TO_P1[e.keyCode]) { e.stopPropagation(); e.preventDefault(); }
    else if (routing.p2 === 'ai' && CODE_TO_P2[e.keyCode]) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  // ---- routing UI ----
  function applyRouting() {
    routing.p1 = $('p1Src').value;
    routing.p2 = $('p2Src').value;
    if (routing.p1 !== 'ai') releaseAi('p1');
    if (routing.p2 !== 'ai') releaseAi('p2');
    // Vision re-tracks (positions), but the brain keeps learning across
    // routing changes — persistence is the point.
    try { if (typeof vision !== 'undefined' && vision) vision.reset(); } catch (e) {}
    stuckStreak = 0;
    $('aiLive').textContent =
      (routing.p1 === 'ai' ? 'AI=P1' : 'HUMAN=P1') + ' · ' +
      (routing.p2 === 'ai' ? 'AI=P2' : routing.p2 === 'human' ? 'HUMAN=P2' : 'P2 off');
    log('Routing: P1=' + routing.p1 + ' P2=' + routing.p2);
  }
  $('p1Src').addEventListener('change', applyRouting);
  $('p2Src').addEventListener('change', applyRouting);
  Array.prototype.forEach.call(document.querySelectorAll('[data-preset]'), function (btn) {
    btn.addEventListener('click', function () {
      var p = btn.getAttribute('data-preset');
      if (p === 'human') { $('p1Src').value = 'human'; $('p2Src').value = 'off'; }
      if (p === 'aidemo') { $('p1Src').value = 'ai'; $('p2Src').value = 'off'; }
      if (p === 'coplay') { $('p1Src').value = 'human'; $('p2Src').value = 'ai'; }
      if (p === 'aiswap') { $('p1Src').value = 'ai'; $('p2Src').value = 'human'; }
      applyRouting();
    });
  });

  // ---- Shared eyes + brain (SMW has one viewport; both pads see it) ----
  // One Vision tracks the screen; one Learner remembers deaths/danger/exits
  // across playthroughs (localStorage). Routing only chooses which pad(s)
  // the brain's action is written to.
  var vision = new window.SMWVision.Vision();
  var brain = new window.SMWLearn.Learner({});
  var decisions = 0;
  if (brain.steps > 0) {
    log('Brain loaded: ' + brain.steps + ' past steps, ' +
      brain.deaths.length + ' deaths remembered, ' +
      Object.keys(brain.exits).length + ' levels with exits.');
  }

  function epsFromUI() {
    if ($('anneal').checked) return null; // annealed schedule
    return parseFloat($('eps').value);
  }
  $('eps').addEventListener('input', function () { $('epsVal').textContent = parseFloat($('eps').value).toFixed(2); });
  $('anneal').addEventListener('change', function () {
    $('eps').disabled = $('anneal').checked;
    log($('anneal').checked ? 'Epsilon: annealing 0.8 -> 0.1 (original schedule)' : 'Epsilon: fixed slider value');
  });
  $('eps').disabled = $('anneal').checked;

  function emuCanvas() { return document.querySelector('#game canvas'); }

  // Observation sources. The emulator renders via WebGL without
  // preserveDrawingBuffer, so reading the <canvas> yields black pixels.
  // Prefer the core framebuffer via EJS gameManager.screenshot() (real
  // 256x224-ish pixels, ~90ms/shot -> backpressure keeps one in flight);
  // fall back to canvas readback for other frontends.
  var corePending = false;
  function coreManager() {
    var em = window.EJS_emulator;
    var gm = em && em.gameManager;
    return (gm && typeof gm.screenshot === 'function') ? gm : null;
  }
  function observeCore() {
    var gm = coreManager();
    if (!gm || corePending) return Promise.resolve(null);
    corePending = true;
    return gm.screenshot().then(function (bytes) {
      return createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    }).then(function (bmp) { corePending = false; return bmp; },
           function () { corePending = false; return null; });
  }

  // Full-frame pixel access for vision (ImageData from the bitmap).
  var frameCanvas = document.createElement('canvas');
  function framePixels(bmp) {
    if (frameCanvas.width !== bmp.width || frameCanvas.height !== bmp.height) {
      frameCanvas.width = bmp.width; frameCanvas.height = bmp.height;
    }
    var ctx = frameCanvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(bmp, 0, 0);
    return ctx.getImageData(0, 0, frameCanvas.width, frameCanvas.height);
  }

  function renderDebug(bmp, obs) {
    var dbg = $('aiDebug');
    if (dbg.width !== bmp.width || dbg.height !== bmp.height) {
      dbg.width = bmp.width; dbg.height = bmp.height;
    }
    var ctx = dbg.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(bmp, 0, 0);
    function box(o, color, label) {
      if (!o) return;
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.strokeRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
      if (label) {
        ctx.fillStyle = color; ctx.font = '7px monospace';
        ctx.fillText(label, o.x - o.w / 2, Math.max(7, o.y - o.h / 2 - 2));
      }
    }
    // remembered death spots: worldX -> screen via player anchor
    if (obs.player && brain.levelKey && brain.danger[brain.levelKey]) {
      ctx.fillStyle = 'rgba(255,140,0,0.22)';
      brain.danger[brain.levelKey].forEach(function (dz) {
        var sx = obs.player.x + (dz - brain.worldX);
        if (sx > -8 && sx < bmp.width + 8) ctx.fillRect(sx - 5, 0, 10, bmp.height);
      });
    }
    if (obs.player) box({ x: obs.player.x, y: obs.player.y, w: Math.max(10, obs.player.w), h: Math.max(12, obs.player.h) }, '#4caf7d', obs.player.char);
    obs.enemies.forEach(function (e) {
      if (e.threat === 0) return;
      box(e, '#ff5252', e.type);
    });
    box(obs.key, '#ffd54f', 'KEY');
    box(obs.keyhole, '#e040fb', 'EXIT?');
    box(obs.goal, '#40c4ff', 'GOAL');
  }

  function aiTick() {
    if (document.hidden) return;
    if (routing.p1 !== 'ai' && routing.p2 !== 'ai') return;
    if (coreManager()) {
      observeCore().then(function (bmp) {
        if (!bmp) return;
        try { decideImage(framePixels(bmp), bmp); }
        catch (err) { log('AI decide failed: ' + err.message); }
        finally { bmp.close(); }
      });
      return;
    }
    // Fallback: whatever the stage canvas shows (may be black on WebGL).
    var canvas = emuCanvas();
    if (!canvas || (canvas.width || 0) < 16) return; // not rendering yet
    try { decideImage(framePixels(canvas), canvas); }
    catch (err) { log('AI observe failed: ' + err.message); }
  }

  function aiDrive(player, a) {
    // Learner action: {arrow, run, jump} -> arrow + Y (dash) + B (jump).
    var want = {};
    SNES_BTNS.forEach(function (b) { want[b] = false; });
    if (a) {
      if (a.arrow) want[a.arrow] = true;
      if (a.run) want.Y = true;
      if (a.jump) want.B = true;
    }
    SNES_BTNS.forEach(function (b) { setAiButton(player, b, want[b]); });
  }

  function updateBrainHud(r) {
    var obs = r.obs, p = obs.player;
    $('aiPlayer').textContent = p ?
      (p.char + ' @' + p.x.toFixed(0) + ',' + p.y.toFixed(0) + ' conf ' + p.conf.toFixed(2)) :
      ('lost x' + (obs.playerLost || '?'));
    var es = obs.enemies.filter(function (e) { return e.threat > 0; }).slice(0, 3);
    $('aiEnemies').textContent = es.length ?
      es.map(function (e) { return e.type + '@' + e.dist.toFixed(0); }).join(' ') : '—';
    var st = brain.stats();
    $('aiDeaths').textContent = st.deaths + ' (' + st.repeatDeaths + ' repeat)';
    $('aiExits').textContent = (st.levels - st.secrets) + ' normal / ' + st.secrets +
      ' secret · ' + st.levels + ' levels';
    $('aiLearn').textContent = st.dangerSpots + ' spots / ε' + r.epsilon.toFixed(2) +
      ' / r̄' + st.rewardEMA.toFixed(2) + ' · ' + st.steps + ' steps';
    var cur = brain.exits[brain.levelKey];
    $('aiDeathLog').textContent =
      (st.lastDeaths.length ? st.lastDeaths.map(function (d) {
        return 'x' + d.worldX + ' ' + d.cause;
      }).join(' · ') : 'no deaths yet') +
      (cur ? ' | this level: ' + (cur.normal ? '☑normal' : '☐normal') + ' ' +
        (cur.secret ? '☑secret' : '☐secret') : '');
  }

  function decideImage(img, src) {
    brain.epsFixed = epsFromUI();
    var r = brain.step(img, vision);
    // New level (or map): tracking context changed — re-acquire next frame
    // instead of dragging a stale lock (e.g. title sprite) into the level.
    if (r.levelKey !== decideImage._lk) {
      decideImage._lk = r.levelKey;
      vision.reset();
    }
    var a = r.action;
    if (routing.p1 === 'ai') aiDrive('p1', a);
    if (routing.p2 === 'ai') aiDrive('p2', a);
    var pad = routing.p1 === 'ai' ? 'p1' : 'p2';
    if (r.stuck) {
      stuckStreak++;
      if (!r.obs.player) {
        // No sprite: title needs Start, file select needs B (Start rewinds!).
        if (r.obs.fileSelect) {
          if (stuckStreak % 25 === 15) tapFace(pad, 'B', 'file select');
        } else if (stuckStreak % 30 === 20) {
          menuNudge(pad);
        }
      }
      if (r.obs.player && stuckStreak > 40 && breakManeuver <= 0) {
        breakManeuver = 8;
        log('AI stuck-break: committed run-right+jump ×8.');
      }
    } else {
      stuckStreak = 0;
    }
    // Frozen with sprite tracked and no message: probably paused — one Start
    // tap, then a long cooldown (standing still in a quiet area can also look
    // frozen; the cooldown keeps that to an occasional harmless blip).
    var frozen = r.obs.player && !r.obs.messageOpen && r.dx === 0 &&
      Math.abs(r.obs.player.vx) < 0.5 &&
      !r.obs.enemies.some(function (e) { return e.threat > 0 && (e.still || 99) < 8; });
    if (frozen) {
      frozenStreak++;
      if (frozenStreak === 60) {
        menuNudge(pad);
        frozenStreak = -200;
      }
    } else if (frozenStreak > 0) {
      frozenStreak = 0;
    }
    if (breakManeuver > 0) {
      // Off-policy commitment to escape walls/corners; the brain still
      // records its own action/reward for the step (counts as exploration).
      breakManeuver--;
      var unstick = { arrow: 'right', run: 1, jump: 1 };
      if (routing.p1 === 'ai') aiDrive('p1', unstick);
      if (routing.p2 === 'ai') aiDrive('p2', unstick);
    }
    // Message-box escape state machine (decisions): 1-3 release all (fresh
    // button edge), 4 tap B+Y to close, 5 release, 6-13 walk clear. Loops
    // with alternating walk direction until the box is gone.
    if (r.obs.messageOpen) msgStuck++; else { msgStuck = 0; msgCycle = 0; }
    if (msgStuck > 12 && msgCycle === 0) {
      msgCycle = 1; msgLeft = !msgLeft;
      log('AI: message box detected — escape maneuver (walk ' + (msgLeft ? 'left' : 'right') + ').');
    }
    if (msgCycle > 0) {
      msgCycle++;
      var pad1 = routing.p1 === 'ai', pad2 = routing.p2 === 'ai';
      if (msgCycle <= 3) {
        if (pad1) aiDrive('p1', null);
        if (pad2) aiDrive('p2', null);
      } else if (msgCycle <= 5) {
        // B+Y tap closes the box (phase 1 guaranteed a fresh edge)
        if (pad1) { setAiButton('p1', 'B', true); setAiButton('p1', 'Y', true); }
        if (pad2) { setAiButton('p2', 'B', true); setAiButton('p2', 'Y', true); }
      } else if (msgCycle <= 6) {
        if (pad1) { setAiButton('p1', 'B', false); setAiButton('p1', 'Y', false); }
        if (pad2) { setAiButton('p2', 'B', false); setAiButton('p2', 'Y', false); }
      } else if (msgCycle <= 14) {
        var walk = { arrow: msgLeft ? 'left' : 'right', run: 1, jump: 0 };
        if (pad1) aiDrive('p1', walk);
        if (pad2) aiDrive('p2', walk);
      } else {
        msgCycle = 1; // box still there (reopened?) — new cycle, other side
        msgLeft = !msgLeft;
      }
      if (msgCycle > 0) {
        $('aiAction').textContent = 'MSG-ESC' + (msgCycle <= 6 ? '(close)' : '(walk)') +
          ' → ' + (pad1 && pad2 ? 'P1+P2' : pad1 ? 'P1' : 'P2');
      }
    }
    decisions++;
    var astr = r.actionStr + (r.explored ? '*' : '');
    var owners = (routing.p1 === 'ai' ? 'P1' : '') +
      (routing.p2 === 'ai' ? (routing.p1 === 'ai' ? '+P2' : 'P2') : '');
    $('aiAction').textContent = astr + ' → ' + owners + '   (*=explored)';
    var rw = r.reward;
    $('aiReward').textContent =
      rw.x.toFixed(1) + ' / ' + rw.event.toFixed(1) +
      (rw.eventName ? ' ' + rw.eventName : '') + ' / ' + rw.total.toFixed(1);
    var dz = brain.dangerAhead() ? ' ⚠danger' : '';
    $('aiScroll').textContent = 'dx=' + r.dx + ' x≈' + Math.round(r.worldX) +
      (r.stuck ? ' STUCK' : '') + dz + (r.dying ? ' DYING?' : '');
    $('aiDecisions').textContent = String(decisions);
    updateBrainHud(r);
    try { renderDebug(src, r.obs); } catch (e) { /* overlay is best-effort */ }
    renderPadViews();
  }

  // Menu buttons: the learned action space has no Start/Select, and SMW's
  // menus need specific buttons (title: Start; file select: B — Start goes
  // BACKWARDS there; in-level Start only pauses). Face taps use fresh edges.
  var stuckStreak = 0;
  var breakManeuver = 0; // committed run-right+jump decisions to break walls
  var frozenStreak = 0;  // tracked sprite + total stillness: likely paused
  // Message-box escape: touching a message block freezes the world until a
  // face button closes the box. Scripted: release all, tap B+Y (fresh edge),
  // then walk clear (alternating sides each cycle, it may reopen on touch).
  var msgStuck = 0, msgCycle = 0, msgLeft = false;
  function menuNudge(player) {
    setAiButton(player, 'start', true);
    setTimeout(function () { setAiButton(player, 'start', false); }, 200);
    log('AI tapped START (' + player + ', menu nudge).');
  }
  function tapFace(player, btn, why) {
    setAiButton(player, btn, false);
    setTimeout(function () {
      setAiButton(player, btn, true);
      setTimeout(function () { setAiButton(player, btn, false); }, 180);
    }, 120);
    log('AI tapped ' + btn + ' (' + player + ', ' + why + ').');
  }

  // ~8Hz decisions: core-framebuffer shots cost ~90ms, so the pending flag
  // provides backpressure (original reacts every 5th frame; this is every ~7th).
  setInterval(aiTick, 120);

  function renderPadViews() {
    [['p1', 'padViewP1'], ['p2', 'padViewP2']].forEach(function (pair) {
      var slot = pair[0];
      var el = document.getElementById(pair[1]).querySelector('.pbtns');
      var html = SNES_BTNS.map(function (b) {
        var on = aiState[slot][b] || humanHeld[slot][b];
        return '<span style="color:' + (on ? '#4caf7d' : '#555') + '">' + (on ? '[●' + b + ']' : '[' + b + ']') + '</span>';
      }).join(' ');
      var owner = slot === 'p1' ? routing.p1 : routing.p2;
      el.innerHTML = '(' + owner + ') ' + html;
    });
  }
  setInterval(renderPadViews, 300);

  // ---- XInput panel ----
  var XBOX_TO_SNES = [
    ['A', 'A', 'z', '9'], ['B', 'B', 'x', '7'], ['X', 'X', 'a', '0'], ['Y', 'Y', 's', 'u'],
    ['LB', 'L', 'q', '['], ['RB', 'R', 'e', ']'],
    ['Back', 'SELECT', 'v', '-'], ['Start', 'START', 'Enter', '='],
    ['D-Pad', 'D-Pad', 'arrows', '4/5/6/8'], ['Left stick', 'D-Pad (alt)', '—', '—']
  ];
  $('mapBody').innerHTML = XBOX_TO_SNES.map(function (r) {
    return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
  }).join('');

  function pollPads() {
    var box = $('pads');
    var list = window.XInput.pads();
    if (!list.length) {
      if (!box.dataset.empty) {
        box.dataset.empty = '1';
        box.innerHTML = '<p class="hint">No gamepad detected. Connect an Xbox (XInput) controller, press any button, and it appears here. Chrome/Edge map XInput pads to the STANDARD layout automatically.</p>';
      }
      return;
    }
    delete box.dataset.empty;
    box.innerHTML = list.map(function (p) {
      var s = window.XInput.snapshot(p);
      var btns = s.buttons.length ? s.buttons.join(' ') : '—';
      var axes = s.axes.map(function (a, i) { return window.XInput.AXES[i] + ':' + a; }).join(' ');
      return '<div class="pad">#' + s.index + ' ' + (s.xinput ? '<span class="on">● XInput/standard</span>' : '○ non-standard') +
        ' <b>' + s.id.slice(0, 48) + '</b><br>held: ' + btns + '<br>' + axes + '</div>';
    }).join('');
  }
  setInterval(pollPads, 250);
  $('rumbleBtn').addEventListener('click', function () {
    var list = window.XInput.pads();
    if (!list.length) { log('Rumble: no gamepad connected.'); return; }
    window.XInput.rumble(list[0].index, 400).then(
      function () { log('Rumble pulse sent to pad #' + list[0].index); },
      function (e) { log('Rumble failed: ' + e.message); });
  });

  // ---- Brain persistence UI (learning survives reloads via localStorage) ----
  $('brainExport').addEventListener('click', function () {
    var blob = new Blob([brain.exportJSON()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'smw-brain-' + brain.steps + 'steps.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    log('Brain exported (' + brain.steps + ' steps).');
  });
  $('brainReset').addEventListener('click', function () {
    if (!window.confirm('Forget everything (Q weights, danger map, deaths, exits)?')) return;
    brain.wipe();
    vision.reset();
    decisions = 0;
    $('aiDecisions').textContent = '0';
    log('Brain wiped — learning from scratch.');
  });
  $('brainImport').addEventListener('change', function () {
    var f = $('brainImport').files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        brain.importJSON(rd.result);
        var st = brain.stats();
        log('Brain imported: ' + brain.steps + ' steps, ' + st.deaths +
          ' deaths, ' + st.levels + ' levels with exits.');
      } catch (e) { log('Brain import failed: ' + e.message); }
    };
    rd.readAsText(f);
    $('brainImport').value = '';
  });

  // ---- libretro boot (EmulatorJS, snes9x core from CDN) ----
  var booted = false;
  var EJS_CDN = 'https://cdn.emulatorjs.org/stable/data/';

  window.EJS_onGameStart = function () {
    log('Emulator started (libretro snes9x). AI loop armed; canvas observer active.');
    applyRouting();
  };

  function boot(url, name) {
    if (booted) { log('Already booted — use Change ROM to load another file.'); return; }
    booted = true;
    window.EJS_player = '#game';
    window.EJS_core = 'snes';               // web-libretro SNES core (snes9x)
    window.EJS_gameUrl = url;
    window.EJS_gameName = name || 'smw';
    window.EJS_pathtodata = EJS_CDN;
    window.EJS_startOnLoaded = true;
    window.EJS_mouse = false;
    window.EJS_multitap = false;
    // Seed keyboard defaults: P1 = upstream EJS defaults (full map, as documented),
    // P2 = our custom map (upstream P2 ships empty). Value strings must match
    // the EJS keyMap words exactly (verified against the EJS 4.x source).
    // Missing value2 falls back to the core's gamepad defaults.
    function ejsPad(ejs) {
      var m = {};
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach(function (id) { m[id] = { value: ejs[id] }; });
      return m;
    }
    var P1_PAD = ejsPad({ 0: 'x', 1: 's', 2: 'v', 3: 'enter', 4: 'up arrow', 5: 'down arrow', 6: 'left arrow', 7: 'right arrow', 8: 'z', 9: 'a', 10: 'q', 11: 'e' });
    P1_PAD[0].value2 = 'BUTTON_2'; P1_PAD[1].value2 = 'BUTTON_4';
    P1_PAD[2].value2 = 'SELECT'; P1_PAD[3].value2 = 'START';
    P1_PAD[4].value2 = 'DPAD_UP'; P1_PAD[5].value2 = 'DPAD_DOWN';
    P1_PAD[6].value2 = 'DPAD_LEFT'; P1_PAD[7].value2 = 'DPAD_RIGHT';
    P1_PAD[8].value2 = 'BUTTON_1'; P1_PAD[9].value2 = 'BUTTON_3';
    P1_PAD[10].value2 = 'LEFT_TOP_SHOULDER'; P1_PAD[11].value2 = 'RIGHT_TOP_SHOULDER';
    P1_PAD[12] = { value: 'tab', value2: 'LEFT_BOTTOM_SHOULDER' };
    P1_PAD[13] = { value: 'r', value2: 'RIGHT_TOP_SHOULDER' };
    P1_PAD[24] = { value: '1' }; P1_PAD[25] = { value: '2' }; P1_PAD[26] = { value: '3' };
    P1_PAD[27] = { value: 'add' }; P1_PAD[28] = { value: 'space' }; P1_PAD[29] = { value: 'subtract' };
    var P2_PAD = ejsPad({ 0: '7', 1: 'u', 2: 'dash', 3: 'equal sign', 4: '8', 5: '5', 6: '4', 7: '6', 8: '9', 9: '0', 10: 'open bracket', 11: 'close braket' });
    window.EJS_defaultControls = { 0: P1_PAD, 1: P2_PAD, 2: {}, 3: {} };
    var s = document.createElement('script');
    s.src = EJS_CDN + 'loader.js';
    s.onload = function () { log('libretro frontend loaded. Starting ' + (name || url) + ' …'); };
    s.onerror = function () { log('ERROR: could not load EmulatorJS from CDN (offline?).'); booted = false; };
    document.body.appendChild(s);
    log('Booting "' + (name || url) + '" on libretro snes9x … (core downloads from CDN on first run)');
  }

  $('bootBtn').addEventListener('click', function () {
    var f = $('romFile').files[0];
    if (f) { boot(URL.createObjectURL(f), f.name); return; }
    var u = $('romUrl').value.trim();
    if (u) { boot(u, u.split('/').pop()); return; }
    log('Pick a ROM file or paste a ROM URL first.');
  });
  $('changeRomBtn').addEventListener('click', function () { window.location.reload(); });

  // Drop anywhere onto the stage.
  window.addEventListener('dragover', function (e) { e.preventDefault(); });
  window.addEventListener('drop', function (e) {
    e.preventDefault();
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) boot(URL.createObjectURL(f), f.name);
  });

  // ?rom=<url> support (e.g. a hosted copy, or the issue attachment URL).
  // Otherwise, auto-load the attached ROM if the session serves it locally.
  var BUNDLED_ROM = 'roms/Super Mario World (USA).sfc';
  function tryBundledRom() {
    fetch(BUNDLED_ROM).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.arrayBuffer();
    }).then(function (buf) {
      if (buf.byteLength < 32768) throw new Error('file too small (' + buf.byteLength + ' bytes)');
      var blob = new Blob([buf], { type: 'application/octet-stream' });
      log('Found attached ROM locally (' + (buf.byteLength / 1024).toFixed(0) + ' KiB) — booting it.');
      boot(URL.createObjectURL(blob), 'Super Mario World (USA).sfc');
    }).catch(function () {
      log('No local ROM at ' + BUNDLED_ROM + ' — pick a file or paste a URL to boot.');
    });
  }
  try {
    var q = new URLSearchParams(window.location.search);
    if (q.get('rom')) { $('romUrl').value = q.get('rom'); boot(q.get('rom'), 'url-rom'); }
    else { tryBundledRom(); }
  } catch (e) { tryBundledRom(); }

  applyRouting();
  log('Ready. Choose a ROM to boot. Human = keyboard + any XInput pad; AI = mario-ai port (P1, P2, or both).');
})();
