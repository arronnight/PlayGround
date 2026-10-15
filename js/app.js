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
    log('Routing: P1=' + routing.p1 + ' P2=' + routing.p2 +
      ((routing.p1 === 'ai' && routing.p2 === 'ai') ?
        ' — CO-OP: one shared brain drives both brothers (SMW 2P alternates turns).' : ''));
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
      if (p === 'aicoop') { $('p1Src').value = 'ai'; $('p2Src').value = 'ai'; }
      applyRouting();
    });
  });

  // ---- Shared eyes + ears + brain (SMW has one viewport; both pads see/hear it) ----
  // One Vision tracks the FULL frame (entire 256x224 framebuffer, never
  // cropped); one Hear taps game audio; one Learner remembers deaths/danger/
  // exits across playthroughs (localStorage v2). Every run learns (TD
  // updates) AND reuses previous runs (weights/danger/exits/progress load at
  // boot). Routing only chooses which pad(s) the brain's action is written to.
  var vision = new window.SMWVision.Vision();
  var hear = (window.SMWAudio && window.SMWAudio.Hear) ? new window.SMWAudio.Hear() : null;
  var brain = new window.SMWLearn.Learner({});
  var decisions = 0;
  if (brain.steps > 0) {
    var ks = brain.knowledgeSummary ? brain.knowledgeSummary() : null;
    log('Brain loaded: run #' + brain.runCount + ' starts now — reusing ' +
      brain.steps + ' past steps, ' + brain.deaths.length + ' deaths, ' +
      Object.keys(brain.exits).length + ' levels with exits' +
      (ks ? ', ' + ks.dangerSpots + ' danger spots' : '') + '.');
  } else {
    log('Fresh brain: run #1 — everything it learns now persists for future runs.');
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
    (obs.pipes || []).forEach(function (pp) { box(pp, '#4488ff', 'PIPE'); });
    obs.enemies.forEach(function (e) {
      if (e.type === 'shroom') box(e, '#ff80ab', 'SHROOM');
    });
  }

  function watchEnabled() {
    try { var el = $('watchLearn'); return el ? el.checked : true; }
    catch (e) { return true; }
  }
  function aiDriving() { return routing.p1 === 'ai' || routing.p2 === 'ai'; }
  function humanPlaying() { return routing.p1 === 'human' || routing.p2 === 'human'; }

  // What the HUMAN is physically holding right now, mapped into the
  // learner's action space {arrow, run(Y/X), jump(B=1/A-spin=2)} so the brain
  // can learn from your demonstration. Merges keyboard (humanHeld) + XInput.
  function readHumanAction() {
    var left = humanHeld.p1.left || humanHeld.p2.left;
    var right = humanHeld.p1.right || humanHeld.p2.right;
    var up = humanHeld.p1.up || humanHeld.p2.up;
    var down = humanHeld.p1.down || humanHeld.p2.down;
    var run = humanHeld.p1.Y || humanHeld.p2.Y || humanHeld.p1.X || humanHeld.p2.X;
    var jumpB = humanHeld.p1.B || humanHeld.p2.B;
    var jumpA = humanHeld.p1.A || humanHeld.p2.A;
    try {
      var pads = window.XInput ? window.XInput.pads() : [];
      for (var i = 0; i < pads.length; i++) {
        var s = null;
        try { s = window.XInput.snapshot(pads[i]); } catch (e) { s = null; }
        if (s && s.buttons) {
          for (var b = 0; b < s.buttons.length; b++) {
            var n = s.buttons[b];
            if (n === 'DLeft') left = true;
            else if (n === 'DRight') right = true;
            else if (n === 'DUp') up = true;
            else if (n === 'DDown') down = true;
            else if (n === 'Y' || n === 'X') run = true;
            else if (n === 'B') jumpB = true;
            else if (n === 'A') jumpA = true;
            else if (n === 'LX-') left = true;
            else if (n === 'LX+') right = true;
          }
        }
        var ax = pads[i].axes || [];
        if (ax[0] < -0.4) left = true;
        if (ax[0] > 0.4) right = true;
        if (ax[1] < -0.4) up = true;
        if (ax[1] > 0.4) down = true;
      }
    } catch (e) {}
    var arrow = left ? 'left' : (right ? 'right' : (up ? 'up' : (down ? 'down' : 'right')));
    var jump = jumpA ? 2 : (jumpB ? 1 : 0);
    return { arrow: arrow, run: run ? 1 : 0, jump: jump,
      idle: !left && !right && !up && !down && !run && !jumpB && !jumpA };
  }

  // REFLEXES: vision straight to commands. The Q-learner plans; reflexes
  // survive. A fired reflex becomes the forced (taken) action — learning
  // stays honest — holds ~0.6s via commitment, and tags the HUD so you SEE
  // vision causing commands ([REFLEX-DODGE], [REFLEX-PIT], …).
  function leanDir(o) {
    var px = o.player ? o.player.x : null;
    if (px == null) return 'right';
    if (o.goal && o.goal.x < px - 8) return 'left';
    if (o.key && o.key.x < px - 20) return 'left';
    return 'right';
  }
  function decideReflex(o) {
    if (!o || !o.player || o.messageOpen || o.fileSelect || o.fade) return null;
    var p = o.player, dir = leanDir(o);
    // stomp: live threat BELOW while airborne → steer onto it, don't jump
    for (var j = 0; j < o.enemies.length; j++) {
      var s = o.enemies[j];
      if (s.threat > 0 && s.y > p.y + 4 && s.dist < 34 && Math.abs(p.vy) > 1.2) {
        return { action: { arrow: s.x < p.x ? 'left' : 'right', run: 0, jump: 0 }, tag: 'REFLEX-STOMP' };
      }
    }
    var close = null, closeD = 26;
    for (var i = 0; i < o.enemies.length; i++) {
      var e = o.enemies[i];
      if (e.threat > 0 && e.dist < closeD) { close = e; closeD = e.dist; }
    }
    if (close) {
      var spin = (close.type === 'spiny' || close.type === 'piranha' || close.type === 'buzzy');
      return { action: { arrow: dir, run: 1, jump: spin ? 2 : 1 }, tag: 'REFLEX-DODGE' };
    }
    // pit edge close and grounded → running jump (spin if ceiling threatens)
    if (o.pitAhead && o.pitDist >= 0 && o.pitDist < 26 && Math.abs(p.vy) < 1.2) {
      return { action: { arrow: 'right', run: 1, jump: 1 }, tag: 'REFLEX-PIT' };
    }
    // pipe entry when stalled near one: walk to it, then DOWN
    if (o.pipes && o.pipes.length && brain.isStuck()) {
      var pdx = o.pipes[0].x - p.x;
      if (Math.abs(pdx) < 12) return { action: { arrow: 'down', run: 0, jump: 0 }, tag: 'REFLEX-PIPE' };
      return { action: { arrow: pdx < 0 ? 'left' : 'right', run: 1, jump: 0 }, tag: 'REFLEX-PIPE' };
    }
    if (o.key) {
      var kdx = o.key.x - p.x;
      if (Math.abs(kdx) > 14) {
        return { action: { arrow: kdx < 0 ? 'left' : 'right', run: 1, jump: o.wallAhead ? 1 : 0 }, tag: 'REFLEX-KEY' };
      }
    }
    if (o.goal) {
      var gdx = o.goal.x - p.x;
      if (Math.abs(gdx) > 10) {
        return { action: { arrow: gdx < 0 ? 'left' : 'right', run: 1, jump: o.wallAhead ? 1 : 0 }, tag: 'REFLEX-GOAL' };
      }
    }
    for (var ci = 0; ci < o.enemies.length; ci++) {
      var ce = o.enemies[ci];
      if ((ce.type === 'shroom' || ce.type === 'coin') && ce.dist < 44) {
        var cdx = ce.x - p.x;
        if (Math.abs(cdx) > 8) {
          return { action: { arrow: cdx < 0 ? 'left' : 'right', run: 1, jump: 0 },
            tag: ce.type === 'shroom' ? 'REFLEX-SHROOM' : 'REFLEX-COIN' };
        }
      }
    }
    return null;
  }

  function aiTick() {
    if (document.hidden) return;
    if (!aiDriving() && !(watchEnabled() && humanPlaying())) return;
    if (!coreManager() && !emuCanvas()) return;
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
    // Learner action: {arrow, run, jump} -> arrow + Y+X (both dash in SMW)
    // + B (normal jump) or A (spin jump — kills what B bounces off).
    var want = {};
    SNES_BTNS.forEach(function (b) { want[b] = false; });
    if (a) {
      if (a.arrow) want[a.arrow] = true;
      if (a.run) { want.Y = true; want.X = true; }
      if (a.jump === 1) want.B = true;
      if (a.jump === 2) want.A = true;
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
    // Run continuity: this run learns, previous runs teach.
    try {
      var runEl = $('aiRuns');
      if (runEl) {
        runEl.textContent = 'run #' + st.runId + ' (this run ' + st.runSteps +
          ' steps/' + st.runDeaths + ' deaths) · ' + st.runCount +
          ' runs total · SFX ' + st.audioEvents;
      }
      var hearEl = $('aiHear');
      if (hearEl) {
        var au = (r.audio && r.audio.audible) ? r.audio :
          (brain.lastAudio && brain.lastAudio.audible ? brain.lastAudio : null);
        if (au) {
          hearEl.textContent = '♪ lvl ' + au.level.toFixed(3) +
            ' lo ' + au.bass.toFixed(2) + ' mid ' + au.mid.toFixed(2) +
            ' hi ' + au.high.toFixed(2) +
            (r.audioDesc ? ' · ' + r.audioDesc : '') +
            (au.quiet ? ' · quiet' : '');
        } else {
          var hs = hear ? hear.status() : { taps: 0 };
          hearEl.textContent = 'muted — press Enable hearing (taps: ' + hs.taps + ')';
        }
      }
    } catch (e) {}
    var cur = brain.exits[brain.levelKey];
    $('aiDeathLog').textContent =
      (st.lastDeaths.length ? st.lastDeaths.map(function (d) {
        return 'x' + d.worldX + ' ' + d.cause;
      }).join(' · ') : 'no deaths yet') +
      (cur ? ' | this level: ' + (cur.normal ? '☑normal' : '☐normal') + ' ' +
        (cur.secret ? '☑secret' : '☐secret') : '');
    // New senses: motion/vertical + memory (taboo, level map, button lab).
    try {
      var moEl = $('aiMotion');
      if (moEl) {
        var extras = [];
        if (obs.needUp) extras.push('NEED-UP');
        if (obs.downOpen) extras.push('DROP?');
        if (obs.ceiling) extras.push('CEIL');
        if (obs.wallTall) extras.push('TALL-WALL');
        if (obs.gapW) extras.push('gap' + obs.gapW);
        var movers = obs.enemies.filter(function (e) { return e.motion; }).length;
        moEl.textContent = 'anim ' + (obs.anim * 100).toFixed(1) + '%' +
          (movers ? ' · ' + movers + ' mover' + (movers > 1 ? 's' : '') + ' tracked' : '') +
          (extras.length ? ' · ' + extras.join(' ') : '');
      }
      var mapEl = $('aiMap');
      if (mapEl) {
        mapEl.textContent = (st.segN || 0) + ' segs/' + (st.segLevels || 0) +
          ' lvls · taboo ' + (st.tabooN || 0) +
          ((st.buttonLab && st.buttonLab.length) ? ' · ' + st.buttonLab.join(' ') : '');
      }
      var textEl = $('aiText');
      if (textEl) {
        var t = obs.text || {};
        var words = (t.text || '').slice(0, 90);
        var kw = Object.keys(t.keywords || {}).slice(0, 4).join(' ');
        textEl.textContent = words ?
          '“' + words + '”' + (kw ? ' [' + kw + ']' : '') +
          ' conf ' + (t.conf || 0).toFixed(2) + ' · read ' + (st.textReads || 0) + '×' :
          '— · read ' + (st.textReads || 0) + '×';
      }
    } catch (e2) {}
  }

  function decideImage(img, src) {
    brain.epsFixed = epsFromUI();
    // Ears: sample game audio (parallel tap, never blocks vision).
    var audio = null;
    try { audio = hear ? hear.sample() : null; } catch (e) { audio = null; }
    // WATCH MODE: no AI pad owns a controller, but a human is playing and
    // watch-learn is on. The brain learns from YOUR inputs (demonstration)
    // and never touches the pads — no stuck-breaks, no menu nudges, no
    // message escape (those are the human's job while watching).
    if (!aiDriving() && watchEnabled() && humanPlaying()) {
      var ha = readHumanAction();
      var r = brain.step(img, vision, audio,
        { arrow: ha.arrow, run: ha.run, jump: ha.jump });
      if (r.levelKey !== decideImage._lk) {
        decideImage._lk = r.levelKey;
        vision.reset();
      }
      decisions++;
      var hstr = window.SMWLearn.actionStr({ arrow: ha.arrow, run: ha.run, jump: ha.jump });
      $('aiAction').textContent = 'WATCHING you: ' + hstr + (ha.idle ? ' (idle)' : '');
      var hrw = r.reward;
      $('aiReward').textContent =
        hrw.x.toFixed(1) + ' / ' + hrw.event.toFixed(1) +
        (hrw.eventName ? ' ' + hrw.eventName : '') + ' / ' + hrw.total.toFixed(1);
      var hdz = brain.dangerAhead() ? ' ⚠danger' : '';
      $('aiScroll').textContent = 'dx=' + r.dx + ' x≈' + Math.round(r.worldX) + hdz +
        (r.dying ? ' DYING?' : '') + ' · learning from you';
      $('aiDecisions').textContent = String(decisions);
      updateBrainHud(r);
      try { renderDebug(src, r.obs); } catch (e) { /* overlay is best-effort */ }
      renderPadViews();
      return;
    }
    var a = null;
    // Commitment: hold one decision ~0.6s (see commit block above); urgency
    // breaks the hold. Forced action = taken action, so learning stays honest.
    var r = (function () {
      // Reflexes first (fresh commands from last frame's vision), then the
      // held commitment, then a free choice. Forced = taken = learned.
      var rfx = (!breakManeuver && !msgCycle) ? decideReflex(vision.lastObs) : null;
      var force = null;
      if (rfx) { force = rfx.action; }
      else if (commitLeft > 0 && commitAction) {
        var lo = vision.lastObs;
        var urg = !lo || lo.pitAhead || lo.messageOpen || lo.needUp ||
          lo.enemies.some(function (e) { return e.threat > 0 && e.dist < 22; });
        if (!urg) force = commitAction;
      }
      var rr = brain.step(img, vision, audio, force);
      if (rfx) { commitAction = rfx.action; commitLeft = 5; rr._reflex = rfx.tag; }
      else if (force) { commitLeft--; rr._held = commitLeft; }
      else { commitAction = rr.action; commitLeft = 4; }
      return rr;
    })();
    // New level (or map): tracking context changed — re-acquire next frame
    // instead of dragging a stale lock (e.g. title sprite) into the level.
    if (r.levelKey !== decideImage._lk) {
      decideImage._lk = r.levelKey;
      vision.reset();
      commitLeft = 0;
    }
    a = r.action;
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
      commitLeft = 0; // unstick owns the pads now
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
      commitLeft = 0; // escape machine owns the pads now
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
    // What is it DOING and WHY: held (committed) / * = exploring, plus the
    // observation that drove the choice. No more mystery mashing.
    var closeFoe = r.obs.enemies.some(function (e) { return e.threat > 0 && e.dist < 22; });
    var why = r._reflex ? r._reflex :
      (r._held != null) ? 'holding' :
      r.explored ? 'trying' :
      r.obs.pitAhead ? 'JUMP-PIT' :
      closeFoe ? 'DODGE' :
      r.obs.needUp ? 'CLIMB' :
      r.obs.key ? 'FETCH-KEY' :
      r.obs.goal ? 'GOAL!' :
      (brain.dangerAhead() || brain.tabooSpot()) ? 'CAREFUL' : 'cruise';
    var astr = r.actionStr + (r._held != null ? ' (hold)' : (r.explored ? '*' : ''));
    var owners = (routing.p1 === 'ai' ? 'P1' : '') +
      (routing.p2 === 'ai' ? (routing.p1 === 'ai' ? '+P2' : 'P2') : '');
    $('aiAction').textContent = astr + ' → ' + owners + ' [' + why + ']' +
      (r.explored && r._held == null ? '   (*=explored)' : '');
    var rw = r.reward;
    $('aiReward').textContent =
      rw.x.toFixed(1) + ' / ' + rw.event.toFixed(1) +
      (rw.eventName ? ' ' + rw.eventName : '') + ' / ' + rw.total.toFixed(1);
    var dz = brain.dangerAhead() ? ' ⚠danger' : '';
    var bestX = 0;
    try { bestX = Math.round((brain.progress && brain.progress[brain.levelKey]) || 0); } catch (e) {}
    $('aiScroll').textContent = 'dx=' + r.dx + ' x≈' + Math.round(r.worldX) +
      ' best≈' + bestX + (r.stuck ? ' STUCK' : '') + dz + (r.dying ? ' DYING?' : '');
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
  // Action commitment: hold one decision ~0.6s so play reads as intent, not
  // twitching. The brain still learns every step (forced action = the taken
  // action, like demonstration). Urgency (pit/enemy/message/climb) breaks
  // the hold immediately.
  var commitLeft = 0, commitAction = null;
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
  // EJS only auto-assigns pads connected AFTER boot; a pad that was already
  // plugged in sits at "Not Connected" forever. So: per-pad Claim buttons +
  // one auto-claim pass once the emulator is up.
  var XBOX_TO_SNES = [
    ['A', 'A', 'z', '9'], ['B', 'B', 'x', '7'], ['X', 'X', 'a', '0'], ['Y', 'Y', 's', 'u'],
    ['LB', 'L', 'q', '['], ['RB', 'R', 'e', ']'],
    ['Back', 'SELECT', 'v', '-'], ['Start', 'START', 'Enter', '='],
    ['D-Pad', 'D-Pad', 'arrows', '4/5/6/8'], ['Left stick', 'D-Pad (alt)', '—', '—']
  ];
  $('mapBody').innerHTML = XBOX_TO_SNES.map(function (r) {
    return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
  }).join('');

  function ejsPadSlots() {
    return Array.prototype.slice.call(
      document.querySelectorAll('#game select.ejs_gamepad_dropdown'));
  }
  // Which emulator slot (0-3) is a physical pad currently claimed by?
  function padClaimedBy(value) {
    var slots = ejsPadSlots(), out = [];
    slots.forEach(function (sel) {
      if (sel.value === value) {
        out.push(parseInt(sel.getAttribute('index'), 10));
      }
    });
    return out;
  }
  function claimPad(padIdx, slot) {
    var pads = null;
    try { pads = navigator.getGamepads ? navigator.getGamepads() : []; } catch (e) { pads = []; }
    var pad = pads && pads[padIdx];
    if (!pad) { log('Claim failed: pad #' + padIdx + ' is gone.'); return false; }
    var value = pad.id + '_' + pad.index;
    var sel = null;
    ejsPadSlots().forEach(function (s) {
      if (parseInt(s.getAttribute('index'), 10) === slot) sel = s;
    });
    if (!sel) { log('Claim failed: emulator pad slot ' + (slot + 1) + ' not ready — boot a ROM first.'); return false; }
    var has = false;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === value) { has = true; break; }
    }
    if (!has) {
      var opt = document.createElement('option');
      opt.value = value;
      opt.text = pad.id + '_' + pad.index;
      sel.appendChild(opt);
    }
    sel.value = value;
    try {
      var ev = document.createEvent('HTMLEvents');
      ev.initEvent('change', true, false);
      sel.dispatchEvent(ev);
    } catch (e) {
      try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e2) {}
    }
    log('XInput pad #' + padIdx + ' claimed for Player ' + (slot + 1) + '.');
    return true;
  }
  var autoClaimed = false;
  function autoClaimPads() {
    if (autoClaimed || !booted || !window.EJS_emulator || !window.EJS_emulator.started) return;
    var list = window.XInput.pads();
    if (!list.length) return;
    autoClaimed = true;
    var slots = ejsPadSlots();
    list.slice(0, 2).forEach(function (p, i) {
      var value = p.id + '_' + p.index;
      var taken = padClaimedBy(value).length > 0;
      var slotFree = slots[i] && (slots[i].value === 'notconnected' || !slots[i].value);
      if (!taken && slotFree) claimPad(p.index, i);
    });
  }

  function pollPads() {
    var box = $('pads');
    var list = window.XInput.pads();
    if (!list.length) {
      if (!box.dataset.empty) {
        box.dataset.empty = '1';
        box.innerHTML = '<p class="hint">No gamepad detected. Connect an Xbox (XInput) controller, press any button, and it appears here. Chrome/Edge map XInput pads to the STANDARD layout automatically. Tip: press a pad button once after boot — the emulator only sees pads that announce themselves.</p>';
      }
      return;
    }
    delete box.dataset.empty;
    autoClaimPads();
    box.innerHTML = list.map(function (p) {
      var s = window.XInput.snapshot(p);
      var value = s.id + '_' + s.index;
      var claimed = padClaimedBy(value).map(function (n) { return 'P' + (n + 1); }).join('+') || 'unclaimed';
      var btns = s.buttons.length ? s.buttons.join(' ') : '—';
      var axes = s.axes.map(function (a, i) { return window.XInput.AXES[i] + ':' + a; }).join(' ');
      return '<div class="pad">#' + s.index + ' ' + (s.xinput ? '<span class="on">● XInput/standard</span>' : '○ non-standard') +
        ' <b>' + s.id.slice(0, 44) + '</b> → <b>' + claimed + '</b><br>held: ' + btns + '<br>' + axes +
        '<br><button data-claim="' + s.index + ':0">Use for P1</button> ' +
        '<button data-claim="' + s.index + ':1">Use for P2</button></div>';
    }).join('');
    Array.prototype.forEach.call(box.querySelectorAll('[data-claim]'), function (b) {
      b.addEventListener('click', function () {
        var parts = b.getAttribute('data-claim').split(':');
        claimPad(parseInt(parts[0], 10), parseInt(parts[1], 10));
        setTimeout(pollPads, 300);
      });
    });
  }
  setInterval(pollPads, 500);
  $('rumbleBtn').addEventListener('click', function () {
    var list = window.XInput.pads();
    if (!list.length) { log('Rumble: no gamepad connected.'); return; }
    window.XInput.rumble(list[0].index, 400).then(
      function () { log('Rumble pulse sent to pad #' + list[0].index); },
      function (e) { log('Rumble failed: ' + e.message); });
  });

  // ---- Brain persistence UI (every run learns + reuses previous runs) ----
  // Runs persist in localStorage v2; closing the tab ends the current run
  // snapshot, reloading starts the next run with all knowledge intact.
  window.addEventListener('beforeunload', function () {
    try { brain.endRun(); } catch (e) {}
  });
  try {
    var hearBtn = $('hearBtn');
    if (hearBtn) hearBtn.addEventListener('click', function () {
      var n = 0;
      try { n = hear ? hear.enable() : 0; } catch (e) {}
      var st = hear ? hear.status() : { taps: 0, running: 0 };
      log('Hearing enabled: resumed ' + n + ' context(s), ' + st.taps +
        ' tap(s), ' + st.running + ' running. AI now hears coin/jump/death.');
    });
  } catch (e) {}
  // ---- Brain auto-save: every run learns, reload reuses it. No export or
  // import — the brain saves itself (every 25 steps + death/exit/close).
  try {
    var resetBtn = $('brainReset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      if (!window.confirm('Forget everything (Q weights, danger map, deaths, exits)?')) return;
      brain.wipe();
      vision.reset();
      decisions = 0;
      $('aiDecisions').textContent = '0';
      log('Brain wiped — learning from scratch.');
    });
  } catch (e) {}

  // ---- libretro boot (EmulatorJS, snes9x core from CDN) ----
  var booted = false;
  var EJS_CDN = 'https://cdn.emulatorjs.org/stable/data/';

  window.EJS_onGameStart = function () {
    log('Emulator started (libretro snes9x). AI loop armed; canvas observer active.');
    try { autoClaimed = false; } catch (e) {}
    applyRouting();
  };

  function bootCore(url, name) {
    if (booted) { log('Already booted — pick ▶ on another library ROM or reload to switch.'); return; }
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
    P1_PAD[13] = { value: 'r', value2: 'RIGHT_BOTTOM_SHOULDER' };
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
    try { if (hear) hear.enable(); } catch (e) {}
    userChoseRom = true;
    var f = $('romFile').files[0];
    if (f) {
      var rd = new FileReader();
      rd.onload = function () { intakeRom(f.name, rd.result, { save: true }); };
      rd.onerror = function () { log('Could not read file ' + f.name); };
      rd.readAsArrayBuffer(f);
      $('romFile').value = '';
      return;
    }
    var u = $('romUrl').value.trim();
    if (u) {
      fetch(u).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.arrayBuffer();
      }).then(function (buf) {
        intakeRom(u.split('/').pop().split('?')[0] || 'url-rom', buf, { save: true });
      }).catch(function (err) {
        log('ROM URL fetch failed: ' + err.message + ' (needs CORS). Trying direct boot…');
        bootCore(u, u.split('/').pop());
      });
      return;
    }
    // no file/URL: pick a ▶ row in the ROM library below.
    log('Pick a ROM file, paste a ROM URL, or press ▶ on a library ROM.');
  });
  $('changeRomBtn').addEventListener('click', function () {
    try { sessionStorage.removeItem('smw-pending-rom'); } catch (e) {}
    window.location.reload();
  });

  // Drop anywhere onto the stage.
  window.addEventListener('dragover', function (e) { e.preventDefault(); });
  window.addEventListener('drop', function (e) {
    e.preventDefault();
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    userChoseRom = true;
    var rd = new FileReader();
    rd.onload = function () { intakeRom(f.name, rd.result, { save: true }); };
    rd.readAsArrayBuffer(f);
  });

  // ---- ROM intake: read the cartridge, learn what game it is, save it ----
  var currentGame = { name: '', title: '', profileId: 'generic', profileLabel: '' };
  function intakeRom(displayName, arrayBuffer, opts) {
    opts = opts || {};
    if (!arrayBuffer || arrayBuffer.byteLength < 32768) {
      log('ROM too small to be a SNES cartridge (' + (arrayBuffer ? arrayBuffer.byteLength : 0) + ' bytes).');
      return;
    }
    var info = null;
    try { info = window.GameID ? window.GameID.parse(arrayBuffer) : null; }
    catch (e) { info = null; }
    var title = (info && info.title) || displayName.replace(/\.[^.]+$/, '');
    if (booted) {
      // Something is already running (usually auto-booted Mario): the USER'S
      // pick must win. Stage it in the library and reload straight into it
      // instead of dropping it with "Already booted".
      userChoseRom = true;
      if (opts.dbId && window.RomDB) { switchToRom(opts.dbId, displayName); return; }
      if (window.RomDB && opts.save !== false) {
        window.RomDB.saveRom(displayName, arrayBuffer, { title: title }).then(function (r) {
          renderLibrary();
          switchToRom(r.id, displayName);
        }).catch(function (err) {
          log('Could not stage ROM switch: ' + (err && err.message ? err.message : err));
        });
        return;
      }
      log('A ROM is already running and this one cannot be staged (no ROM library). ' +
        'Reload the page first, then pick your ROM before anything auto-boots.');
      return;
    }
    var profileId = (info && info.profileId) || 'generic';
    var profile = (info && info.profile) || {};
    currentGame = { name: displayName, title: title, profileId: profileId,
      profileLabel: (profile && profile.label) || profileId,
      kind: (info && info.kind) || '?', region: (info && info.region) || '?' };
    try { brain.setProfile(profileId, currentGame.profileLabel); } catch (e) {}
    try {
      var rt = $('romTitle');
      if (rt) {
        rt.textContent = '“' + title + '” (' + currentGame.kind + ', ' + currentGame.region + ')' +
          ' — AI reads it as: ' + currentGame.profileLabel +
          (profile.note ? ' (' + profile.note + ')' : '');
      }
    } catch (e) {}
    log('Cartridge: “' + title + '” [' + currentGame.kind +
      (info && info.fastRom ? '+FastROM' : '') + ', ' + (info && info.cart ? info.cart : '?') +
      ', ' + currentGame.region + ', checksum ' + (info && info.checksumOk ? 'OK' : '?') + ']' +
      ' → AI profile: ' + currentGame.profileLabel + '.');
    if (opts.save && window.RomDB) {
      window.RomDB.saveRom(displayName, arrayBuffer, { title: title }).then(function (r) {
        log(r.duplicate ? 'Already in ROM library (“' + displayName + '”).' :
          'Saved “' + displayName + '” to the ROM library.');
        renderLibrary();
      }).catch(function (err) {
        log('ROM library save failed (private mode?): ' + (err && err.message ? err.message : err));
      });
    } else if (opts.save) {
      log('ROM library unavailable (no IndexedDB) — playing without saving.');
    }
    var blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    try { if (window.RomDB && opts.dbId) window.RomDB.touchRom(opts.dbId); } catch (e) {}
    renderLibrary();
    bootCore(URL.createObjectURL(blob), displayName);
  }

  // The user explicitly chose a ROM — it must win over anything auto-booted.
  // EJS boots once per page load, so stage the library id and reload: the
  // startup chain boots the pending ROM INSTEAD of Mario.
  var userChoseRom = false;
  function switchToRom(dbId, displayName) {
    try { sessionStorage.setItem('smw-pending-rom', String(dbId)); } catch (e) {
      log('Could not stage ROM switch (no session storage).');
      return;
    }
    log('Switching to “' + displayName + '” — reloading into your ROM…');
    setTimeout(function () { window.location.reload(); }, 400);
  }

  // ---- ROM library (IndexedDB): your local ROMs, kept between visits ----
  function fmtSize(b) {
    if (b >= 1048576) return (b / 1048576).toFixed(1) + ' MiB';
    return Math.max(1, Math.round(b / 1024)) + ' KiB';
  }
  function renderLibrary() {
    var box = $('romList');
    if (!box || !window.RomDB) {
      if (box) box.innerHTML = '<p class="hint">ROM library needs IndexedDB.</p>';
      return;
    }
    window.RomDB.listRoms().then(function (list) {
      if (!list.length) {
        box.innerHTML = '<p class="hint">Library empty — pick a ROM file above and it will be saved here automatically.</p>';
        return;
      }
      box.innerHTML = list.map(function (r) {
        var when = r.lastPlayed ? new Date(r.lastPlayed).toLocaleDateString() :
          new Date(r.addedAt).toLocaleDateString();
        return '<div class="romrow"><button data-playrom="' + r.id + '" title="Boot this ROM">▶</button>' +
          '<span class="romname">' + r.name.replace(/</g, '&lt;') + '</span>' +
          '<span class="rommeta">' + (r.title ? '“' + String(r.title).replace(/</g, '&lt;') + '” · ' : '') +
          fmtSize(r.size) + ' · ' + when + '</span>' +
          '<button data-delrom="' + r.id + '" title="Delete from library">✕</button></div>';
      }).join('');
      Array.prototype.forEach.call(box.querySelectorAll('[data-playrom]'), function (b) {
        b.addEventListener('click', function (ev) {
          ev.preventDefault(); ev.stopPropagation();
          playLibraryRom(b.getAttribute('data-playrom'));
        });
      });
      Array.prototype.forEach.call(box.querySelectorAll('[data-delrom]'), function (b) {
        b.addEventListener('click', function (ev) {
          ev.preventDefault(); ev.stopPropagation();
          var id = b.getAttribute('data-delrom');
          window.RomDB.deleteRom(id).then(function () {
            log('Deleted ROM from library.');
            renderLibrary();
          });
        });
      });
    }).catch(function () {
      box.innerHTML = '<p class="hint">ROM library unavailable.</p>';
    });
  }
  function playLibraryRom(id) {
    if (!window.RomDB) { log('ROM library unavailable.'); return; }
    userChoseRom = true;
    if (booted) {
      // EJS boots once per page load — stash and reload into the new ROM.
      try { sessionStorage.setItem('smw-pending-rom', String(id)); } catch (e) {}
      window.location.reload();
      return;
    }
    window.RomDB.getRom(id).then(function (rec) {
      if (!rec || !rec.blob) { log('ROM not found in library.'); renderLibrary(); return; }
      rec.blob.arrayBuffer().then(function (buf) {
        intakeRom(rec.name, buf, { save: false, dbId: rec.id });
      });
    }).catch(function (err) {
      log('Could not load library ROM: ' + (err && err.message ? err.message : err));
    });
  }

  // ?rom=<url> support (e.g. a hosted copy, or the issue attachment URL).
  // Otherwise a pending library ROM (chosen while another was booted),
  // otherwise the attached ROM if the session serves it locally.
  var BUNDLED_ROM = 'roms/Super Mario World (USA).sfc';
  function tryBundledRom() {
    fetch(BUNDLED_ROM).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.arrayBuffer();
    }).then(function (buf) {
      // The user picked their own ROM meanwhile (or is staged to)? Mario stands down.
      if (userChoseRom || booted) return;
      intakeRom('Super Mario World (USA).sfc', buf, { save: true });
    }).catch(function () {
      log('No local ROM at ' + BUNDLED_ROM + ' — pick a file, paste a URL, or choose a library ROM.');
    });
  }
  function bootPendingLibrary() {
    var id = null;
    try { id = sessionStorage.getItem('smw-pending-rom'); sessionStorage.removeItem('smw-pending-rom'); }
    catch (e) {}
    if (!id || !window.RomDB) return false;
    window.RomDB.getRom(id).then(function (rec) {
      if (rec && rec.blob) {
        rec.blob.arrayBuffer().then(function (buf) {
          intakeRom(rec.name, buf, { save: false, dbId: rec.id });
        });
      } else { tryBundledRom(); }
    }).catch(function () { tryBundledRom(); });
    return true;
  }
  try {
    var q = new URLSearchParams(window.location.search);
    if (q.get('rom')) {
      var ru = q.get('rom');
      $('romUrl').value = ru;
      fetch(ru).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.arrayBuffer();
      }).then(function (buf) {
        intakeRom(ru.split('/').pop().split('?')[0] || 'url-rom', buf, { save: true });
      }).catch(function () { bootCore(ru, 'url-rom'); });
    }
    else if (!bootPendingLibrary()) { tryBundledRom(); }
  } catch (e) { tryBundledRom(); }
  renderLibrary();

  applyRouting();
  log('Ready. Choose a ROM to boot. Human = keyboard + any XInput pad; AI = mario-ai port (P1, P2, or both).');
  // test hooks (no UI effect): reflex unit checks + human-action reader
  try {
    window.SMWAI = window.SMWAI || {};
    window.SMWAI.decideReflex = decideReflex;
    window.SMWAI.readHumanAction = readHumanAction;
  } catch (e) {}
})();
