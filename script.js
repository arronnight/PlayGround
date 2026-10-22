/* ==========================================================================
   SNESBOY standalone frontend logic (`script.js`)
   Drives an EmulatorJS SNES core underneath the SNESBOY CSS-art shell.
   NOTE: the template 8-bit-only core script tag is intentionally NOT used:
   that core cannot run SNES ROMs.
   ========================================================================== */
(function(){
  'use strict';

  var BUNDLED = { name: 'Super Mario All-Stars (USA).sfc', url: 'super-mario-all-stars-usa.sfc', builtin: true };

  /* data-button (template scheme) -> emulator keyboard key.
     Matches EJS_defaultControls below and the on-page key charts. */
  var KEYMAP = {
    '0': 'a', '1': 'b', '2': 'v', '3': 'Enter',
    '4': 'ArrowUp', '5': 'ArrowDown', '6': 'ArrowLeft', '7': 'ArrowRight',
    '8': 'y', '9': 'x'
  };

  var booted = false;
  var playing = false;
  var powering = false;
  var powerTimer = null;
  var powerNeedsReboot = false;
  var currentUrl = BUNDLED.url;
  var currentName = BUNDLED.name;
  var muted = false;
  var crtOn = false;
  var autoOn = false;

  function $(s, r){ return (r || document).querySelector(s); }
  function $all(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- status text + LEDs ---------- */
  function setStatus(main, sub){
    [['handheld-status-text', main], ['desktop-status-text', main]].forEach(function(p){
      var e = document.getElementById(p[0]); if(e) e.textContent = p[1];
    });
    [['handheld-sub-text', sub], ['desktop-sub-text', sub]].forEach(function(p){
      var e = document.getElementById(p[0]); if(e) e.textContent = p[1];
    });
  }
  function showStandby(on){
    [['handheld-off-message', on], ['desktop-off-message', on]].forEach(function(p){
      var e = document.getElementById(p[0]); if(e) e.classList.toggle('hidden', !on);
    });
  }
  function setLeds(on){
    var tv = document.getElementById('tv-led'); if(tv) tv.classList.toggle('active', on);
    var cl = document.getElementById('snes-console-led'); if(cl) cl.classList.toggle('active', on);
    var pb = document.getElementById('btn-power'); if(pb) pb.classList.toggle('power-on', on);
    var cb = document.getElementById('power-checkbox'); if(cb) cb.checked = on;
  }

  /* ---------- emulator stage (single instance, moves with layout) ---------- */
  var stage = document.createElement('div');
  stage.id = 'ejs-stage';
  var crt = document.createElement('div');
  crt.className = 'crt-overlay';
  crt.style.display = 'none';

  var mq = window.matchMedia('(min-width: 1024px)');
  function placeStage(){
    var host = mq.matches
      ? document.querySelector('#desktop-view .tv-screen-bezel')
      : document.querySelector('#handheld-view .screen-bezel');
    if(host){
      if(stage.parentNode !== host) host.insertBefore(stage, host.firstChild);
      if(crt.parentNode !== host) host.appendChild(crt);
    }
    window.dispatchEvent(new Event('resize'));
  }
  if(mq.addEventListener) mq.addEventListener('change', placeStage);
  else if(mq.addListener) mq.addListener(placeStage);

  function ejsButton(pred){
    var btns = $all('#ejs-stage button');
    for(var i = 0; i < btns.length; i++){
      var t = ((btns[i].textContent || '') + ' ' + (btns[i].title || '')).toLowerCase();
      if(pred(t.trim(), btns[i])) return btns[i];
    }
    return null;
  }

  /* ---------- boot / power / reset / eject ---------- */
  /* One instance only: shut down any running emulator before (re)booting,
     so audio/video can never double up. */
  function stopExisting(){
    powering = false;
    if(powerTimer){ clearInterval(powerTimer); powerTimer = null; }
    replayTimers.forEach(clearTimeout);
    replayTimers = []; replayingId = null;
    releaseReplayHeld();
    releaseAuto();
    try{
      if(window.EJS_emulator && typeof window.EJS_emulator.callEvent === 'function'){
        window.EJS_emulator.callEvent('exit');
      }
    }catch(e){}
    playing = false;
  }

  /* The core ignores keyboard until its input gate is opened. The
     'keyboardInput' default option SHOULD do this, but the direct call is
     deterministic, so do both. Called on ready/start (gameManager only
     exists once the emulator instance is up). */
  function enableKeyboard(){
    var tries = 0;
    var iv = setInterval(function(){
      tries++;
      try{
        var gm = window.EJS_emulator && window.EJS_emulator.gameManager;
        if(gm && typeof gm.setKeyboardEnabled === 'function'){
          gm.setKeyboardEnabled(true);
          clearInterval(iv); return;
        }
      }catch(e){}
      if(tries > 40) clearInterval(iv);
    }, 250);
  }

  function boot(url, name){
    stopExisting();
    powerNeedsReboot = false;
    currentUrl = url; currentName = name || currentName;
    loadManualForGame(currentName);
    window.EJS_player = '#ejs-stage';
    window.EJS_gameName = currentName;
    window.EJS_core = 'snes';
    window.EJS_color = '#7e22ce';
    window.EJS_backgroundColor = '#000';
    window.EJS_alignStartButton = 'center';
    window.EJS_startOnLoaded = true; /* user POWER press = the gesture that unfreezes boot */
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_gameUrl = url;
    window.EJS_gameID = 9587;
    window.EJS_disableAutoLang = true;
    window.EJS_language = 'en-US';
    window.EJS_askBeforeExit = false;
    window.EJS_Buttons = { screenRecord: false, cheat: false, cacheManager: false, gamepad: false };
    /* Without this, the core ignores ALL keyboard input (real or synthetic). */
    window.EJS_defaultOptions = { keyboardInput: 'enabled' };
    /* Stock key bindings are kept: pads and the physical keyboard drive
       the core directly (driveIndex), so EJS key mapping is irrelevant. */
    window.EJS_ready = function(){
      enableKeyboard();
      assignUsbPad();
      setStatus(currentName.toUpperCase().slice(0, 32), playing ? 'NOW PLAYING' : 'PRESS POWER');
    };
    window.EJS_onGameStart = function(){
      playing = true; showStandby(false); setLeds(true);
      enableKeyboard();
      setStatus(currentName.toUpperCase().slice(0, 32), 'NOW PLAYING');
    };
    window.EJS_onExit = function(){
      playing = false; showStandby(true); setLeds(false);
      setStatus('POWER IS OFF', 'PRESS POWER TO START');
    };
    var old = document.getElementById('ejs-loader'); if(old) old.remove();
    stage.innerHTML = '';
    var s = document.createElement('script');
    s.id = 'ejs-loader'; s.src = 'https://cdn.emulatorjs.org/stable/data/loader.js'; s.async = true;
    document.body.appendChild(s);
    booted = true;
  }

  function powerOn(){
    if(powering) return; /* single flight: rapid POWER mashes, one attempt */
    showStandby(false);
    /* EJS exit leaves a stopped core with no Start button: reload it so
       POWER actually resumes the game (and the AI loops) after a shutdown. */
    if(powerNeedsReboot){
      powerNeedsReboot = false;
      boot(currentUrl, currentName);
      return;
    }
    powering = true;
    var tries = 0;
    powerTimer = setInterval(function(){
      tries++;
      var b = stage.querySelector('.ejs_start_button') ||
        ejsButton(function(t){ return /^start game/.test(t); });
      if(b){ try{ b.click(); }catch(e){} clearInterval(powerTimer); powerTimer = null; powering = false; }
      else if(playing || tries > 40){
        clearInterval(powerTimer); powerTimer = null; powering = false;
        if(!playing) showStandby(true);
      }
    }, 250);
  }
  function powerOff(){
    powering = false;
    if(powerTimer){ clearInterval(powerTimer); powerTimer = null; }
    releaseAuto(); /* drop holds; the autopilot itself stays on and resumes on power-up */
    var done = false;
    try{
      if(window.EJS_emulator && typeof window.EJS_emulator.callEvent === 'function'){
        window.EJS_emulator.callEvent('exit'); done = true;
      }
    }catch(e){}
    if(!done){
      var b = ejsButton(function(t){ return t.indexOf('exit emulation') !== -1 || t === 'exit'; });
      if(b){ try{ b.click(); done = true; }catch(e){} }
    }
    if(!done) boot(currentUrl, currentName);
    powerNeedsReboot = done;
    playing = false; showStandby(true); setLeds(false);
    setStatus('POWER IS OFF', 'PRESS POWER TO START');
  }
  function togglePower(){ if(!booted) boot(currentUrl, currentName); if(playing) powerOff(); else powerOn(); }
  function resetGame(){
    var b = ejsButton(function(t){ return t.indexOf('restart') !== -1; });
    if(b && playing){ try{ b.click(); return; }catch(e){} }
    var wasOff = !playing;
    boot(currentUrl, currentName);
    if(wasOff) powerOn(); else showStandby(false);
  }

  /* ---------- synthetic input from the CSS-art pads ---------- */
  /* EJS button indices (RetroArch numbering, as used by
     gameManager.simulateInput). Template data-button -> EJS index. */
  var PADINDEX = { '0': 8, '1': 0, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 1, '9': 9 };
  /* Physical-keyboard -> EJS index (mirrors the on-page charts). */
  var PHYSINDEX = {
    a: 8, b: 0, x: 9, y: 1, v: 2, Shift: 2, Enter: 3,
    ArrowUp: 4, ArrowDown: 5, ArrowLeft: 6, ArrowRight: 7, q: 10, e: 11
  };
  /* Primary input path: drive the core directly. This is what makes the
     CSS-art pads REAL controllers. Synthetic keyboard events are still
     sent as a secondary path (see sendKey). Both set the same button
     state, so double delivery is harmless. */
  function driveIndex(idx, down, src, pl){
    try{
      var gm = window.EJS_emulator && window.EJS_emulator.gameManager;
      if(gm && typeof gm.simulateInput === 'function'){
        gm.simulateInput(pl || 0, idx, down ? 1 : 0);
      }
    }catch(e){}
    if(recOn) recInputs.push({ t: Date.now() - recT0, b: idx, d: down ? 1 : 0, s: src || '?', p: pl || 0 });
  }
  /* Which players the autopilot drives (human pads/keys stay P1). */
  function autoPlayers(){
    var out = [];
    (AgentOpts.players || [0]).forEach(function(p){
      if(p >= 0 && p <= 3 && out.indexOf(p) === -1 && out.length < 4) out.push(p);
    });
    return out.length ? out : [0];
  }
  var KEYCODES = {
    a: 65, b: 66, x: 88, y: 89, v: 86, Enter: 13,
    ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39
  };
  var KEYLOCODES = {
    a: 'KeyA', b: 'KeyB', x: 'KeyX', y: 'KeyY', v: 'KeyV', Enter: 'Enter',
    ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight'
  };
  function sendKey(key, type){
    var ev;
    try{
      ev = new KeyboardEvent(type, {
        key: key, code: KEYLOCODES[key] || '',
        bubbles: true, cancelable: true
      });
    }catch(e){
      ev = document.createEvent('Event'); ev.initEvent(type, true, true); ev.key = key;
    }
    try{
      Object.defineProperty(ev, 'keyCode', { value: KEYCODES[key] || 0 });
      Object.defineProperty(ev, 'which', { value: KEYCODES[key] || 0 });
    }catch(e2){}
    /* Dispatch on the emulator canvas itself so the event bubbles through
       every ancestor (player div ... document ... window): wherever the
       core attached its keyboard listener, it receives the press. */
    var target = stage.querySelector('canvas') || stage;
    target.dispatchEvent(ev);
  }
  $all('[data-button]').forEach(function(el){
    var db = el.getAttribute('data-button');
    var key = KEYMAP[db];
    if(key === undefined && PADINDEX[db] === undefined) return;
    var down = function(e){
      e.preventDefault(); el.classList.add('pressed');
      if(PADINDEX[db] !== undefined) driveIndex(PADINDEX[db], true, 'pad');
      if(key !== undefined) sendKey(key, 'keydown');
    };
    var up = function(e){
      if(e) e.preventDefault();
      el.classList.remove('pressed');
      try{ if(document.activeElement === el) el.blur(); }catch(e2){}
      if(PADINDEX[db] !== undefined) driveIndex(PADINDEX[db], false, 'pad');
      if(key !== undefined) sendKey(key, 'keyup');
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', function(){ if(el.classList.contains('pressed')) up(); });
    el.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  });

  /* Physical keyboard drives the core directly (same path as the pads),
     so the on-page key charts hold true even where EJS keyboard routing
     does not. Arrows/space must not scroll the page. */
  function physIndex(e){
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    return PHYSINDEX[k];
  }
  document.addEventListener('keydown', function(e){
    if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    var modalOpen = !document.getElementById('library-modal').classList.contains('hidden') ||
                    !document.getElementById('info-modal').classList.contains('hidden') ||
                    !document.getElementById('ai-modal').classList.contains('hidden');
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(e.key) !== -1 && !modalOpen){
      e.preventDefault();
    }
    if(modalOpen || e.repeat) return;
    var idx = physIndex(e);
    if(idx !== undefined){
      e.preventDefault();
      driveIndex(idx, true, 'key');
    }
  });
  document.addEventListener('keyup', function(e){
    var idx = physIndex(e);
    if(idx !== undefined) driveIndex(idx, false, 'key');
  });

  function releasePilot(pl){
    /* release only one pilot's buttons: P1 seeking must not drop P2's hold */
    for(var i = 0; i <= 11; i++) driveIndex(i, false, 'sys', pl);
  }
  function releaseAuto(){
    /* panic release: every button on every player, used on stop/rebuild */
    for(var pl = 0; pl <= 3; pl++) releasePilot(pl);
  }

  /* ---------- screen-reactive autopilot (AI Lab): independent copilots ---
     One engine per driven player — same screen, own timers, motion history,
     steering vote, menu guard and release path. Every pilot works the menus,
     senses, modes and plays for itself (phase-offset beats, own button
     order), so P2 never parrots P1 and one pilot's transition never drops
     the other's holds.
     SEEK (still frames — any menu, pause, title, black transition screen):
       character-select grids are walked with short dpad steps before the
       confirm, then START on every driven player; never holds directions so
       it can't fight cursors on any system.
     PLAY (the picture moves — scrolling, pans, action): holds the forward
       button hard, holds run/dash only while the pixels demand it, and each
       pilot works the action buttons + shoulders on its own beat.
     Silence heals: freeze, game-over, quiet black screen → every pilot back
     to SEEK, taps its own way out of whatever menu maze comes next. */
  /* ---------- agent options + button map (persisted, tunable in AI Lab) --- */
  var AgentDefaults = {
    senseMs: 500, tapMs: 1000, seekCycle: '2,2,3,8,5,4',
    driveMs: 120, hopEvery: 3, hopPulseMs: 140,
    hiThresh: 8, hiStreak: 2, loThresh: 4, loStreak: 2, blackMean: 10,
    players: [0, 1], hud: false, autoTune: true, profile: 'generic'
  };
  var AgentOpts = {};
  try{
    var rawOwn = {};
    try{ rawOwn = JSON.parse(localStorage.getItem('snesboy-agent') || '{}'); }catch(e){}
    AgentOpts = Object.assign({}, AgentDefaults, rawOwn);
    /* players defaulted to P1-only before Both existed — migrate old saves */
    if(!rawOwn || !('players' in rawOwn)) AgentOpts.players = [0, 1];
    if(!rawOwn || !('autoTune' in rawOwn)) AgentOpts.autoTune = true;
    if(!rawOwn || !('profile' in rawOwn) || ['generic', 'umk3', 'mix'].indexOf(rawOwn.profile) === -1) AgentOpts.profile = 'generic';
    /* Migrate the old sluggish defaults once; custom values are preserved. */
    if(AgentOpts.senseMs === 2000) AgentOpts.senseMs = 500;
    if(AgentOpts.tapMs === 4000) AgentOpts.tapMs = 1000;
    if(AgentOpts.driveMs === 300) AgentOpts.driveMs = 120;
    if(AgentOpts.hopPulseMs === 260) AgentOpts.hopPulseMs = 140;
    if(AgentOpts.hiStreak === 3) AgentOpts.hiStreak = 2;
    if(AgentOpts.loStreak === 3) AgentOpts.loStreak = 2;
  }catch(e){ AgentOpts = Object.assign({}, AgentDefaults, { players: [0, 1], autoTune: true, profile: 'generic' }); }
  function saveAgentOpts(){
    try{ localStorage.setItem('snesboy-agent', JSON.stringify(AgentOpts)); }catch(e){}
  }
  /* Emulator button indices the brain uses (RetroArch SNES numbering).
     Human pads keep using PADINDEX; only the agent reads this. */
  var AgentMap = { dirR: 7, dirL: 6, run: 1, actions: [8, 0, 9], shoulders: [10, 11], select: 2, start: 3 };
  /* SEEK confirm fallback, parsed from AgentOpts.seekCycle ('2,2,3,8,5,4' =
     SELECT, SELECT, START, A, DOWN, UP). The grid walker presses A and
     START every cycle; this adds one extra menu button when it is neither,
     so odd menus still get their key. Taps only, never holds. */
  var autoCycle = [2, 2, 3, 8];
  /* Character-select grids are not single-button menus: the cursor starts
     top-left, so confirm-only taps always take the first cell. Walk the
     cursor with 1-3 dpad taps first (snake-like patterns), then confirm,
     then START. Both driven pilots run this, so P2 actually joins/start. */
  var MENU_GRID_MOVES = [
    [7], [7, 7], [5], [5, 5], [7, 5], [5, 7],
    [7, 7, 5], [5, 5, 7], [6], [4], [7, 5, 5], [5, 7, 7]
  ];
  function parseSeekCycle(){
    try{
      var parts = String(AgentOpts.seekCycle).split(',');
      var out = [];
      parts.forEach(function(p){
        var v = parseInt(p.trim(), 10);
        if(!isNaN(v) && v >= 0 && v <= 11 && out.length < 8) out.push(v);
      });
      if(out.length) autoCycle = out;
    }catch(e){}
  }
  /* ---------- manual association + manual-guided learning ----------------
     The local manual corpus is matched to the ROM name, parsed for control
     semantics, and used as a shared prior by both copilots. Each pilot still
     learns from its own screen response, so the manual teaches what a button
     means while P1/P2 learn when it works. */
  var MANUAL_STATE = { index: null, indexJob: null, current: null, sig: '', gen: 0, loading: false, error: '' };
  var MANUAL_TEXT = {};
  var MANUAL_BTN = { a: 8, b: 0, x: 9, y: 1, l: 10, r: 11, start: 3, select: 2 };
  function manualNorm(s){
    s = String(s || '').toLowerCase().replace(/\.[a-z0-9]+$/, '');
    s = s.replace(/\([^)]*\)|\[[^\]]*\]/g, ' ');
    s = s.replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
    return s.replace(/\s+/g, ' ');
  }
  function manualButtons(line){
    var text = String(line || '').replace(/[¥]/g, 'Y');
    var out = [], seen = {};
    var add = function(b){ if(!seen[b]){ seen[b] = 1; out.push(b); } };
    var re = /\b([abxy])\s*(?:button|btn)\b/ig, m;
    while((m = re.exec(text))) add(MANUAL_BTN[m[1].toLowerCase()]);
    re = /\b([lr])\s*(?:button|btn)\b/ig;
    while((m = re.exec(text))) add(MANUAL_BTN[m[1].toLowerCase()]);
    if(!out.length && /\b(press|hold|push|tap)\b/i.test(text)){
      re = /\b([abxy])\b/ig;
      while((m = re.exec(text))) add(MANUAL_BTN[m[1].toLowerCase()]);
      re = /\b([lr])\b/ig;
      while((m = re.exec(text))) add(MANUAL_BTN[m[1].toLowerCase()]);
    }
    return out.filter(function(b){ return b !== MANUAL_BTN.start && b !== MANUAL_BTN.select; });
  }
  function manualBest(lines, terms, prefs, strict){
    var votes = {}, bestLine = '';
    for(var i = 0; i < lines.length; i++){
      var raw = lines[i], low = raw.toLowerCase(), hit = 0;
      terms.forEach(function(t){ if(low.indexOf(t) !== -1) hit += 2; });
      if(!hit) continue;
      var near = raw + ' ' + (lines[i + 1] || '');
      var btns = manualButtons(strict ? raw : near);
      if(!btns.length) continue;
      var same = manualButtons(raw).length ? 3 : 1;
      btns.forEach(function(b){ votes[b] = (votes[b] || 0) + hit + same; });
      if(!bestLine) bestLine = raw.trim();
    }
    var best = null, bestScore = -1;
    prefs = prefs || [];
    Object.keys(votes).forEach(function(k){
      var b = parseInt(k, 10), pi = prefs.indexOf(b);
      var score = votes[k] + (pi >= 0 ? (prefs.length - pi) * 3 : 0);
      if(score > bestScore){ bestScore = score; best = b; }
    });
    return best == null ? null : { buttons: [best], line: bestLine };
  }
  function manualAttackButtons(lines){
    var out = [], seen = {};
    for(var i = 0; i < lines.length && out.length < 6; i++){
      var low = lines[i].toLowerCase();
      if(!/\b(attack|punch|kick|shoot|fire|sword|strike|special)\b/.test(low)) continue;
      if(!/\b(press|hold|push|tap|button|btn)\b/.test(low)) continue;
      manualButtons(lines[i] + ' ' + (lines[i + 1] || '')).forEach(function(b){
        if(out.length < 6 && !seen[b]){ seen[b] = 1; out.push(b); }
      });
    }
    return out;
  }
  /* Parse face-relative special-move strings out of OCR'd manuals, e.g.
     "SHADOW KICK — AWAY, TOWARDS, LOW KICK" or
     "DEEP FREEZE — DOWN, TOWARDS, LOW PUNCH". These are resolved against
     the current facing direction at play time. */
  function manualMovebook(lines){
    var out = [], seen = {};
    var BUTTON_WORDS = [
      [/\bhigh\s+punch\b|\bhp\b/g, '1'],
      [/\blow\s+punch\b|\blp\b/g, '0'],
      [/\bhigh\s+kick\b|\bhk\b/g, '8'],
      [/\blower\s+kick\b|\blk\b/g, '9'],
      [/\bblock\b|\bbl\b/g, '10'],
      [/\brun\b|\brn\b/g, '11']
    ];
    lines.forEach(function(raw){
      var line = String(raw || '');
      if(line.length < 8 || line.length > 120) return;
      if(!/[—–=:]|\s-\s/.test(line)) return;
      if(!/\b(punch|kick|freeze|fireball|spear|projectile|grab|throw|special)\b/i.test(line)) return;
      var part = line.split(/[—–=:]|\s-\s/);
      var name = String(part[0] || '').replace(/[^A-Za-z0-9 ']/g, ' ').replace(/\s+/g, ' ').trim();
      if(name.length < 3 || name.length > 32) return;
      var body = part.slice(1).join(' ').slice(0, 80).toLowerCase();
      body = body.replace(/\btowards?\b|\bforward\b/g, ' F ')
        .replace(/\baway\b|\bback\b/g, ' B ')
        .replace(/\bdown\b/g, ' D ').replace(/\bup\b/g, ' U ');
      BUTTON_WORDS.forEach(function(pair){ body = body.replace(pair[0], ' ' + pair[1] + ' '); });
      var seq = [], re = /\b(1[01]|[089]|[FBDU])\b/g, m;
      while((m = re.exec(body)) && seq.length < 6) seq.push(m[1]);
      if(seq.length < 2) return;
      var hasButton = seq.some(function(t){ return /^[0189]$/.test(t); });
      var dirs = seq.filter(function(t){ return /^[FBDU]$/.test(t); }).length;
      if(!hasButton && dirs < 2) return;
      var key = seq.join(',');
      if(seen[key]) return;
      seen[key] = 1;
      out.push({ name: name, seq: seq });
    });
    return out.slice(0, 8);
  }
  function manualSemantics(lines, attack){
    var sem = { move: [AgentMap.dirL, AgentMap.dirR], start: MANUAL_BTN.start,
      select: MANUAL_BTN.select, pause: MANUAL_BTN.start };
    var put = function(key, terms, prefs, fallback, strict){
      var r = manualBest(lines, terms, prefs, strict);
      sem[key] = (r && r.buttons.length) ? r.buttons[0] : fallback;
    };
    put('jump', ['jump', 'leap', 'hop', 'fly'], [0, 8, 9, 1], null);
    put('run', ['run', 'dash', 'sprint', 'boost'], [1, 11, 0, 8], null);
    put('block', ['block', 'guard', 'defend', 'shield'], [10, 11, 1], null, true);
    put('shoot', ['shoot', 'fire', 'blast', 'laser', 'gun', 'missile', 'projectile'], [8, 0, 1, 9], null, true);
    put('special', ['special', 'magic', 'bomb', 'grenade'], [9, 1, 8, 0], null, true);
    put('item', ['item', 'inventory', 'potion'], [1, 9, 8, 0], null, true);
    put('pass', ['pass', 'pitch', 'serve'], [0, 8, 1, 9], null, true);
    put('tackle', ['tackle', 'steal'], [0, 8, 1, 9], null, true);
    put('accelerate', ['accelerate', 'gas', 'throttle', 'speed up'], [8, 0, 1, 9], null, true);
    put('brake', ['brake', 'slow down', 'reverse'], [0, 1, 8, 9], null, true);
    put('rotate', ['rotate', 'turn', 'spin', 'flip'], [8, 0, 1, 9], null, true);
    put('drop', ['drop', 'soft drop', 'hard drop'], [5, 0, 8], null, true);
    put('punch', ['punch', 'jab'], [0, 8, 1, 9], null, true);
    put('kick', ['kick'], [8, 0, 9, 1], null, true);
    put('grapple', ['lock up', 'lockup', 'grapple', 'clinch'], [9, 1, 8, 0], null, true);
    put('pin', ['pin', 'cover'], [9, 8, 0, 1], null, true);
    put('tag', ['tag'], [0, 8, 1], null, true);
    put('specialMove', ['special move', 'signature move', 'mega move', 'megamove'], [11, 10, 8, 0], null, true);
    put('roll', ['roll', 'cartwheel'], [8, 0, 1], null, true);
    put('switch', ['switch'], [8, 0], null, true);
    put('confirm', ['confirm', 'ok', 'choose', 'accept'], [8, 0, 1], 8);
    put('cancel', ['cancel', 'back', 'return', 'exit'], [0, 1, 9], 0);
    if(attack && attack.length){ sem.attack = attack[0]; sem.attacks = attack.slice(); }
    return sem;
  }
  function manualKind(text, sem, attack, meta){
    var title = String(meta && meta.title ? meta.title : '').toLowerCase();
    var low = String(text || '').toLowerCase();
    if(/\b(donkey kong country|super mario world|super mario bros|super mario all-stars)\b/i.test(title)) return 'platformer';
    if(/\b(f-zero|f zero|mario kart|top gear|outrun|road rash|rock n roll racing|stunt race fx|f1|nascar|grand prix|racing|racer)\b/i.test(title)) return 'racer';
    if(/\b(wwf|wcw|wrestl|royal rumble|smackdown|survivor series)\b/i.test(title)) return 'wrestler';
    if(/\b(mortal kombat|street fighter|killer instinct|fatal fury|samurai shodown|art of fighting|world heroes|king of fighters|clay fighter|primal rage|tournament fighters)\b/i.test(title)) return 'fighter';
    if(/\b(tetris|dr mario|dr\. mario|columns|bust-a-move|puyo|lemmings|puzzle)\b/i.test(title)) return 'puzzle';
    if(/\b(simcity|sim city|populous|civilization|a-train|theme park|mega lo mania|strategy)\b/i.test(title)) return 'strategy';
    if(/\b(nba|nfl|nhl|fifa|madden|soccer|football|baseball|basketball|hockey|golf|tennis|boxing|pilotwings|sports?)\b/i.test(title)) return 'sports';
    if(/\b(contra|gradius|r-type|metroid|doom|wolfenstein|axelay|thunder force|darius|un squadron|shooter)\b/i.test(title)) return 'shooter';
    if(/\b(racing|race|kart|driving|lap|speedometer)\b/i.test(low)) return 'racer';
    if(/\b(lock ?up|royal rumble|turnbuckle|wrestl|pin your opponent|tag team match)\b/i.test(low)) return 'wrestler';
    if(/\b(soccer|football|baseball|basketball|hockey|golf|tennis|boxing|sports?)\b/i.test(low)) return 'sports';
    if(/\b(simcity|sim city|populous|civilization|build|management|strategy)\b/i.test(low)) return 'strategy';
    if(/\b(puzzle|tetris|columns|match three|match 3|hard drop|soft drop|rotate the (piece|block))\b/i.test(low)) return 'puzzle';
    if(attack.length >= 3 && /\b(punch|kick|combo|fatality|health meter|opponent)\b/i.test(low)) return 'fighter';
    if(sem.shoot != null || /\b(shooter|shooting|gun|laser|missile|bullet)\b/i.test(low)) return 'shooter';
    return 'platformer';
  }
  function playbookFor(meta, kind){
    var title = String(meta && meta.title || '');
    if(/\bmortal kombat\b/i.test(title)) return 'mk';
    if(/\b(street fighter|killer instinct|fatal fury|samurai shodown|art of fighting|world heroes|king of fighters|clay fighter|primal rage)\b/i.test(title)) return 'fighter';
    if(/\bdonkey kong country\b/i.test(title)) return 'dkc';
    if(/\b(wwf|wcw|wrestl|royal rumble|smackdown|survivor series)\b/i.test(title)) return 'wrestler';
    if(kind === 'fighter') return 'fighter';
    if(kind === 'wrestler') return 'wrestler';
    if(kind === 'platformer') return 'platformer';
    return kind || 'generic';
  }
  function parseManual(meta, text){
    var lines = String(text || '').split(/\r?\n/);
    var run = manualBest(lines, ['run', 'dash', 'sprint'], [1, 11, 0, 8]);
    var jump = manualBest(lines, ['jump', 'leap'], [0, 8, 9, 1]);
    var block = manualBest(lines, ['block', 'guard', 'defend'], [10, 11, 1]);
    var attack = manualAttackButtons(lines);
    var sem = manualSemantics(lines, attack);
    var kind = manualKind(text, sem, attack, meta);
    var movebook = kind === 'fighter' ? manualMovebook(lines) : [];
    var playbook = playbookFor(meta, kind);
    sem.kind = kind;
    if(jump) sem.jump = jump.buttons[0];
    if(run) sem.run = run.buttons[0];
    if(block) sem.block = block.buttons[0];
    if(kind === 'fighter' && /\bmortal kombat\b/i.test(meta.title || '')){
      /* SNES MK family: Y=HP, B=LP, A=HK, X=LK, L/R=block. */
      sem.run = 11; sem.punch = 1; sem.kick = 8; sem.block = 10;
      sem.attack = 1; sem.attacks = [1, 0, 8, 9];
    }
    if(kind === 'wrestler' && /\bwwf\b/i.test(meta.title || '')){
      /* WWF Raw / Royal Rumble: Y run, B punch, A kick, X grapple/pin,
         R signature move, B tag. No jumping in the ring. */
      sem.run = 1; sem.punch = 0; sem.kick = 8;
      sem.grapple = 9; sem.pin = 9; sem.tag = 0;
      sem.specialMove = 11; sem.attack = 0;
      sem.attacks = [0, 8, 9];
      sem.jump = null; sem.block = null;
    }
    var actions = [];
    var add = function(b){ if(b != null && actions.indexOf(b) === -1) actions.push(b); };
    if(jump) jump.buttons.forEach(add);
    if(attack.length) attack.forEach(add);
    if(sem.shoot != null) add(sem.shoot);
    if(sem.special != null) add(sem.special);
    if(sem.item != null) add(sem.item);
    ['punch', 'kick', 'grapple', 'pin', 'tag', 'specialMove', 'roll', 'switch']
      .forEach(function(k){ if(sem[k] != null) add(sem[k]); });
    if(run) add(run.buttons[0]);
    if(block) add(block.buttons[0]);
    [8, 0, 9, 1].forEach(function(b){ if(actions.length < 4) add(b); });
    if(!actions.length) actions = [8, 0, 9];
    if(kind === 'platformer'){
      if(!jump) jump = { buttons: [sem.jump != null ? sem.jump : 0] };
      if(!run) run = { buttons: [sem.run != null ? sem.run : 1] };
    }
    var hints = [];
    lines.forEach(function(line){
      if(hints.length < 4 && line.trim().length > 18 &&
         /\b(button|control|press|hold|run|jump|block|punch|kick|attack)\b/i.test(line)){
        hints.push(line.trim().replace(/\s+/g, ' ').slice(0, 180));
      }
    });
    var weights = {};
    if(jump) jump.buttons.forEach(function(b){ weights[b] = (weights[b] || 0) + 0.35; });
    attack.forEach(function(b){ weights[b] = (weights[b] || 0) + 0.45; });
    if(run) weights[run.buttons[0]] = (weights[run.buttons[0]] || 0) + 0.15;
    if(block) weights[block.buttons[0]] = (weights[block.buttons[0]] || 0) + 0.05;
    ['punch', 'kick', 'grapple', 'pin', 'tag', 'specialMove', 'roll', 'switch']
      .forEach(function(k){ if(sem[k] != null) weights[sem[k]] = (weights[sem[k]] || 0) + 0.25; });
    return {
      id: meta.id, title: meta.title, pages: meta.pages, region: meta.region,
      method: meta.method, chars: meta.chars, kind: kind, playbook: playbook, actions: actions,
      run: sem.run != null ? sem.run : (run ? run.buttons[0] : null),
      jump: kind === 'wrestler' ? null : (sem.jump != null ? sem.jump : (jump ? jump.buttons[0] : null)),
      block: sem.block != null ? sem.block : (block ? block.buttons[0] : null),
      strikes: attack, weights: weights,
      sem: sem, movebook: movebook, shoulders: [10, 11], hints: hints,
      source: 'ai/manuals/' + meta.text
    };
  }
  function ensureManualIndex(){
    if(MANUAL_STATE.index) return Promise.resolve(MANUAL_STATE.index);
    if(MANUAL_STATE.indexJob) return MANUAL_STATE.indexJob;
    MANUAL_STATE.indexJob = fetch('ai/manuals/index.json').then(function(r){
      if(!r.ok) throw new Error('manual index HTTP ' + r.status);
      return r.json();
    }).then(function(j){
      MANUAL_STATE.index = j;
      return j;
    }).catch(function(e){
      MANUAL_STATE.error = String(e && e.message || e);
      MANUAL_STATE.indexJob = null;
      throw e;
    });
    return MANUAL_STATE.indexJob;
  }
  function matchManual(name){
    if(!MANUAL_STATE.index) return null;
    var n = manualNorm(name), nt = n.split(' ').filter(Boolean);
    if(!n) return null;
    var best = null, bestScore = 0;
    MANUAL_STATE.index.manuals.forEach(function(m){
      var mt = manualNorm(m.title), score = 0;
      if(mt === n) score = 100;
      else if(n.indexOf(mt) === 0 || mt.indexOf(n) === 0) score = 60;
      else{
        var a = mt.split(' ').filter(Boolean), hit = 0;
        a.forEach(function(t){ if(nt.indexOf(t) !== -1) hit++; });
        score = 25 * hit / Math.max(1, Math.max(a.length, nt.length));
      }
      var reg = String(m.region || '').toLowerCase();
      if(/\busa\b/.test(n) && /usa/.test(reg)) score += 12;
      if(/\bpal\b/.test(reg) && !/\bpal\b/.test(n)) score -= 8;
      if(/\bjapan\b/.test(n) && /japan/.test(reg)) score += 8;
      if(score >= 20 && score > bestScore){ bestScore = score; best = m; }
    });
    return best;
  }
  function fetchManualProfile(meta){
    if(MANUAL_TEXT[meta.id]) return Promise.resolve(parseManual(meta, MANUAL_TEXT[meta.id]));
    return fetch('ai/manuals/' + meta.text).then(function(r){
      if(!r.ok) throw new Error('manual HTTP ' + r.status);
      return r.text();
    }).then(function(t){
      MANUAL_TEXT[meta.id] = t;
      return parseManual(meta, t);
    });
  }
  function commitManualProfile(profile, sig, gen){
    if(gen !== MANUAL_STATE.gen || !profile) return null;
    MANUAL_STATE.current = profile;
    MANUAL_STATE.loading = false;
    MANUAL_STATE.sig = sig;
    applyManualToPilots();
    updateManualHud();
    sceneGame();
    updateSceneHud();
    updateAiStatus();
    return profile;
  }
  function loadManualMeta(meta, sig){
    if(!meta) return Promise.reject(new Error('no manual match'));
    if(MANUAL_STATE.current && MANUAL_STATE.current.id === meta.id){
      return Promise.resolve(MANUAL_STATE.current);
    }
    if(MANUAL_STATE.sig === sig && MANUAL_STATE.loading) return MANUAL_STATE.loading;
    MANUAL_STATE.sig = sig;
    MANUAL_STATE.current = null;
    MANUAL_STATE.error = '';
    MANUAL_STATE.loading = true;
    var gen = ++MANUAL_STATE.gen;
    updateManualHud();
    var job = ensureManualIndex().then(function(){
      return fetchManualProfile(meta);
    }).then(function(profile){
      return commitManualProfile(profile, sig, gen);
    }).catch(function(e){
      if(gen !== MANUAL_STATE.gen) return null;
      MANUAL_STATE.loading = false;
      MANUAL_STATE.error = String(e && e.message || e);
      updateManualHud();
      updateAiStatus();
      return null;
    });
    MANUAL_STATE.loading = job;
    return job;
  }
  /* The screen can identify a game even when the ROM filename cannot. Two
     consistent OCR title reads are required before we switch manuals. */
  function adoptScreenManual(meta){
    if(!meta || MANUAL_STATE.loading) return;
    if(MANUAL_STATE.current && MANUAL_STATE.current.id === meta.id) return;
    loadManualMeta(meta, 'screen:' + meta.id);
  }
  function loadManualForGame(name){
    var sig = manualNorm(name);
    if(MANUAL_STATE.sig === sig && MANUAL_STATE.current) return Promise.resolve(MANUAL_STATE.current);
    if(MANUAL_STATE.sig === sig && MANUAL_STATE.loading) return MANUAL_STATE.loading;
    var gen0 = MANUAL_STATE.gen;
    return ensureManualIndex().then(function(){
      var meta = matchManual(name);
      if(!meta) throw new Error('no manual match');
      return loadManualMeta(meta, sig);
    }).catch(function(e){
      if(gen0 !== MANUAL_STATE.gen) return null;
      MANUAL_STATE.loading = false;
      MANUAL_STATE.error = String(e && e.message || e);
      MANUAL_STATE.current = null;
      updateManualHud();
      updateAiStatus();
      return null;
    });
  }
  function applyManualToPilot(pt){
    var m = MANUAL_STATE.current;
    var sem = (m && m.sem) ? m.sem : {};
    pt.manual = m || null;
    pt.kind = m ? m.kind : 'generic';
    pt.sem = sem;
    pt.order = (m && m.actions && m.actions.length) ? m.actions.slice() :
      ((pt.slot % 2 === 0) ? AgentMap.actions.slice() : AgentMap.actions.slice().reverse());
    pt.runBtn = (m && m.run != null) ? m.run : (m && m.kind === 'fighter' ? 11 : AgentMap.run);
    pt.runKnown = !!(m && m.run != null);
    pt.blockBtn = (m && m.block != null) ? m.block : 10;
    pt.jumpBtn = (m && m.jump != null) ? m.jump : pt.order[0];
    pt.primaryBtn = sem.shoot != null ? sem.shoot :
      (sem.jump != null ? sem.jump : (sem.attack != null ? sem.attack :
      (sem.pass != null ? sem.pass : pt.order[0])));
    pt.specialBtn = sem.special != null ? sem.special :
      (sem.item != null ? sem.item : null);
    pt.pauseBtn = sem.pause != null ? sem.pause : AgentMap.start;
    pt.strikes = (m && m.strikes && m.strikes.length) ? m.strikes.slice() : [1, 0, 8, 9];
    [1, 0, 8, 9].forEach(function(b){ if(pt.strikes.indexOf(b) === -1) pt.strikes.push(b); });
    pt.playbook = (m && m.playbook) ? m.playbook : (m ? m.kind : 'generic');
    var isMk = !!(m && /\b(mortal kombat|ultimate mortal kombat)\b/i.test(m.id + ' ' + m.title));
    var parsedMoves = (m && m.movebook && m.movebook.length) ? m.movebook.slice() : null;
    if(isMk && (!parsedMoves || parsedMoves.length < 5)) parsedMoves = null;
    pt.movebook = parsedMoves || (isMk ? UMK3_MOVEBOOK.slice() : null);
    pt.combat = { phase: 'wait', until: 0, last: 0, lastAction: '', hitAt: 0, step: 0 };
    pt.shoulders = (m && m.shoulders) ? m.shoulders.slice() : AgentMap.shoulders.slice();
    if(!pt.learn) pt.learn = { score: {}, tries: {}, total: 0, pending: null, sig: '' };
    if(m && pt.learn.sig !== m.id){
      pt.learn.sig = m.id;
      pt.learn.score = {};
      pt.learn.tries = {};
      pt.learn.total = 0;
      pt.learn.pending = null;
      m.actions.forEach(function(b, i){
        pt.learn.score[b] = (m.weights[b] || 0.15) + (i === 0 ? 0.2 : 0);
      });
    }
  }
  function applyManualToPilots(){
    autoPilots.forEach(applyManualToPilot);
  }
  function pickPlayAction(pt){
    var pool = (pt.order && pt.order.length) ? pt.order : AgentMap.actions;
    var l = pt.learn || { score: {}, tries: {}, total: 0 };
    var n = l.total || 0, best = pool[0], bestScore = -1e9;
    for(var i = 0; i < pool.length; i++){
      var b = pool[i], tries = l.tries[b] || 0;
      var avg = (l.score[b] || 0) / (tries + 1);
      var prior = 0.15 + (pool.length - i) * 0.04;
      var explore = 1.15 * Math.sqrt(Math.log(n + 2) / (tries + 1));
      var s = avg + prior + explore + ((pt.hopN + i * 5) % 7) * 0.001;
      if(s > bestScore){ bestScore = s; best = b; }
    }
    l.pending = { btn: best, t: Date.now() };
    return best;
  }
  function rewardPlayAction(pt, d, sh, shy){
    var l = pt.learn, p = l && l.pending;
    if(!p) return;
    var moved = d >= Math.max(1, AgentOpts.loThresh) ||
      Math.abs(sh || 0) >= 2 || Math.abs(shy || 0) >= 2;
    l.tries[p.btn] = (l.tries[p.btn] || 0) + 1;
    l.score[p.btn] = (l.score[p.btn] || 0) + (moved ? 1 : -0.25);
    l.total = (l.total || 0) + 1;
    l.pending = null;
  }
  function updateManualLearn(){
    var e = document.getElementById('manual-learn');
    if(!e) return;
    if(!MANUAL_STATE.current){ e.textContent = ''; return; }
    var parts = autoPilots.map(function(pt){
      var l = pt.learn || {}, arr = Object.keys(l.score || {});
      arr.sort(function(a, b){
        return ((l.score[b] || 0) / ((l.tries[b] || 0) + 1)) -
               ((l.score[a] || 0) / ((l.tries[a] || 0) + 1));
      });
      var top = arr.slice(0, 3).map(function(b){
        return (BTN_NAMES[b] || b) + ' ' + (l.score[b] || 0).toFixed(1);
      }).join(' ');
      return 'P' + (pt.pl + 1) + ' ' + (top || 'learning…');
    });
    e.textContent = 'MANUAL LEARN · ' + parts.join(' · ');
  }
  function updateManualHud(){
    updateManualLearn();
    var e = document.getElementById('manual-bind');
    if(!e) return;
    if(MANUAL_STATE.loading){
      e.textContent = 'MANUAL · matching ' + currentName + '…';
      return;
    }
    if(MANUAL_STATE.current){
      var m = MANUAL_STATE.current;
      var names = function(arr){ return arr.map(function(b){ return BTN_NAMES[b] || b; }).join('/'); };
      var actLabel = (m.kind === 'fighter') ? 'attack' : 'actions';
      var actList = (m.kind === 'fighter') ? m.strikes : m.actions;
      e.textContent = 'MANUAL · ' + m.title + ' · ' + m.pages + 'p · ' +
        m.kind + ' · jump ' + (m.jump != null ? (BTN_NAMES[m.jump] || m.jump) : '?') +
        ' · run ' + (m.run != null ? (BTN_NAMES[m.run] || m.run) : '?') +
        ' · ' + actLabel + ' ' + (actList.length ? names(actList) : '?') +
        ' · P1+P2 learn';
      return;
    }
    e.textContent = 'MANUAL · no match for ' + currentName +
      (MANUAL_STATE.error ? ' (' + MANUAL_STATE.error + ')' : '') + ' · generic priors';
  }
  window.SNESBoyManual = {
    current: function(){ return MANUAL_STATE.current; },
    match: function(name){ return matchManual(name); },
    reload: function(name){ return loadManualForGame(name || currentName); },
    index: function(){ return MANUAL_STATE.index; },
    pilots: function(){
      return autoPilots.map(function(pt){
        return { player: pt.pl + 1, mode: pt.mode, manual: pt.manual ? pt.manual.id : null,
          kind: pt.kind, playbook: pt.playbook, order: pt.order, run: pt.runBtn,
          block: pt.blockBtn, strikes: pt.strikes, sem: pt.sem,
          movebook: (pt.movebook || []).length, plan: pt.lastPlan || '',
          learn: { tries: pt.learn.tries, score: pt.learn.score, total: pt.learn.total } };
      });
    }
  };
  /* ---------- scene reader: words + fast situation clock ----------------
     A single fast sampler watches the real emulator canvas. It classifies
     the current screen (menu, dialogue, paused, game over, fight, play) and
     drives both copilots immediately on a change. OCR runs lazily, only on
     still/text-heavy screens, so it never taxes live platforming. */
  var SCENE_MS = 110;
  var SCENE_OCR_IDLE_MS = 5000;
  var SCENE_OCR_TEXT_MS = 3200;
  var SCENE_MENU_RE = /\b(press start|start game|select(?: game)?|game select|file select|player select|character select|new game|continue|options?|main menu|game mode|high score|password|sound test|controller setup|configuration|exit|quit|save|load)\b/i;
  var SCENE_GAMEPLAY_RE = /\b(score|lives?|time left|level|stage|lap|health|energy|ammo|coins?|rings?|world|checkpoint|km\/h|speed|hit|combo|round|go!)\b/i;
  /* In-game title screens can still show a HUD (Super Mario All-Stars shows
     WORLD/TIME while asking for 1 or 2 players). These phrases mean the game
     has not started yet even though gameplay words are present. */
  var SCENE_TITLE_MENU_RE = /\b(\d\s*player\s+(?:game|came)|player\s+(?:game|came)|press\s+start|game\s+start|top\s*[-–—]\s*\d)/i;
  var SCENE_PAUSE_RE = /\bpause[ds]?\b/i;
  var SCENE_OVER_RE = /\b(game over|gameover|try again|you lose|continue\?|player out)\b/i;
  var SCENE_FIGHT_RE = /\b(fight|round|winner|fatality|finish|combo|versus|ko)\b/i;
  var SCENE_DIALOG_RE = /\b(press|continue|yes|no|talk|speak|listen|help|welcome|thank|hello|world|castle|princess|find|save|danger|warp|star|coin|key|door|boss|ready|go)\b/i;
  var SCENE = {
    mode: 'idle', why: '', game: '', screenTitle: '', text: '', words: [],
    conf: 0, at: 0, changedAt: 0, lastMotionAt: Date.now(), stillMs: 0,
    motion: 0, mean: 0, sh: 0, shy: 0, prev: null,
    lastReact: 0, lastAdvance: 0, lastOcrAt: 0, textAt: 0, firstRead: false,
    lastPlayAt: 0, strongMenu: false, menuAt: 0,
    holdUntilRead: false, holdAt: 0, flowTaps: 0, lastFlowTap: 0,
    percept: { tags: [], prompt: '', hud: {}, action: '' },
    vision: null, prevSceneFrame: null, zones: {}, situation: null,
    audio: null, audioPrev: 0, audioSpikeAt: 0, audioBaseRms: 0,
    screenTitleId: '', titleHitId: '', titleHits: 0,
    reactCount: 0, advanceCount: 0
  };
  var OCR_STATE = { status: 'off', progress: '', error: '', worker: null,
    loadPromise: null, workerPromise: null, busy: false };
  function ocrLoad(){
    if(window.Tesseract) return Promise.resolve(window.Tesseract);
    if(OCR_STATE.loadPromise) return OCR_STATE.loadPromise;
    OCR_STATE.status = 'loading';
    OCR_STATE.loadPromise = new Promise(function(resolve, reject){
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.async = true;
      s.onload = function(){ window.Tesseract ? resolve(window.Tesseract) : reject(new Error('Tesseract missing')); };
      s.onerror = function(){ reject(new Error('OCR library failed to load')); };
      document.head.appendChild(s);
    });
    return OCR_STATE.loadPromise;
  }
  function ensureOcrWorker(){
    if(OCR_STATE.worker) return Promise.resolve(OCR_STATE.worker);
    if(OCR_STATE.workerPromise) return OCR_STATE.workerPromise;
    OCR_STATE.status = 'loading';
    OCR_STATE.workerPromise = ocrLoad().then(function(T){
      return T.createWorker('eng', 1, { logger: function(m){
        if(m && m.status) OCR_STATE.progress = m.status + (m.progress ? ' ' + Math.round(m.progress * 100) + '%' : '');
      }});
    }).then(function(w){
      OCR_STATE.worker = w;
      OCR_STATE.status = 'ready';
      OCR_STATE.error = '';
      updateSceneHud();
      updateAiStatus();
      return w;
    }).catch(function(e){
      OCR_STATE.status = 'error';
      OCR_STATE.error = String(e && e.message || e);
      OCR_STATE.workerPromise = null;
      updateSceneHud();
      updateAiStatus();
      return null;
    });
    return OCR_STATE.workerPromise;
  }
  function ocrSurface(){
    var src = gameCanvas();
    if(!src || !src.width) return null;
    try{
      var scale = 1;
      var c = document.createElement('canvas');
      c.width = Math.round(src.width * scale);
      c.height = Math.round(src.height * scale);
      var x = c.getContext('2d', { willReadFrequently: true });
      x.imageSmoothingEnabled = true;
      x.drawImage(src, 0, 0, c.width, c.height);
      var d = x.getImageData(0, 0, c.width, c.height);
      var a = d.data;
      for(var i = 0; i < a.length; i += 4){
        var g = (a[i] * 299 + a[i + 1] * 587 + a[i + 2] * 114) / 1000 | 0;
        a[i] = a[i + 1] = a[i + 2] = g;
        a[i + 3] = 255;
      }
      x.putImageData(d, 0, 0);
      return c;
    }catch(e){ return null; }
  }
  /* OCR the screen in zones. Full-frame OCR wastes resolution on a 256px
     HUD; cropping and upscaling the HUD, prompt and message bands makes the
     numbers and one-line prompts readable during live play. */
  var OCR_ZONES = {
    hud: [0, 0, 1, 0.20],
    prompt: [0.08, 0.22, 0.92, 0.76],
    bottom: [0.04, 0.74, 0.96, 0.995]
  };
  function ocrRegionSurface(name){
    var zone = OCR_ZONES[name];
    var src = gameCanvas();
    if(!zone || !src || !src.width) return null;
    try{
      var sx = Math.floor(src.width * zone[0]), sy = Math.floor(src.height * zone[1]);
      var sw = Math.max(8, Math.floor(src.width * (zone[2] - zone[0])));
      var sh = Math.max(8, Math.floor(src.height * (zone[3] - zone[1])));
      var scale = Math.max(4, Math.min(8, Math.round(1400 / Math.max(1, sw))));
      var pad = 10;
      var c = document.createElement('canvas');
      c.width = sw * scale + pad * 2; c.height = sh * scale + pad * 2;
      var x = c.getContext('2d', { willReadFrequently: true });
      x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
      x.imageSmoothingEnabled = false;
      x.drawImage(src, sx, sy, sw, sh, pad, pad, sw * scale, sh * scale);
      var d = x.getImageData(0, 0, c.width, c.height), a = d.data;
      /* Otsu threshold: the NES/SNES HUD is bright text on a dark HUD bar.
         Binarise and invert so Tesseract sees black glyphs on white paper. */
      var hist = new Uint32Array(256), total = a.length / 4, sum = 0;
      for(var i = 0; i < a.length; i += 4){
        var g = (a[i] * 299 + a[i + 1] * 587 + a[i + 2] * 114) / 1000 | 0;
        a[i] = a[i + 1] = a[i + 2] = g;
        hist[g]++; sum += g;
      }
      var sumB = 0, wB = 0, maxVar = -1, thr = 160;
      for(var t = 0; t < 256; t++){
        wB += hist[t];
        if(!wB) continue;
        var wF = total - wB;
        if(!wF) break;
        sumB += t * hist[t];
        var mB = sumB / wB, mF = (sum - sumB) / wF;
        var between = wB * wF * (mB - mF) * (mB - mF);
        if(between > maxVar){ maxVar = between; thr = t; }
      }
      thr = Math.max(70, Math.min(220, thr));
      for(i = 0; i < a.length; i += 4){
        var v = a[i] > thr ? 0 : 255;
        a[i] = a[i + 1] = a[i + 2] = v;
        a[i + 3] = 255;
      }
      x.putImageData(d, 0, 0);
      return c;
    }catch(e){ return null; }
  }
  function mergeOcrZones(){
    var order = ['hud', 'prompt', 'bottom'], parts = [], words = [], conf = 0, latest = 0;
    order.forEach(function(k){
      var z = SCENE.zones[k];
      if(z && z.text){
        parts.push(z.text);
        if(z.at > latest) latest = z.at;
        if(z.conf > conf) conf = z.conf;
        z.words.forEach(function(w){ words.push(w); });
      }
    });
    SCENE.text = cleanOcrText(parts.join(' · '));
    SCENE.words = words.slice(0, 32);
    SCENE.conf = conf;
    SCENE.textAt = latest || Date.now();
    SCENE.firstRead = true;
  }
  function runOcrZone(name){
    if(OCR_STATE.busy) return Promise.resolve(SCENE.text);
    if(!OCR_STATE.worker) return ensureOcrWorker().then(function(w){ return w ? runOcrZone(name) : SCENE.text; });
    var surface = ocrRegionSurface(name);
    if(!surface) return Promise.resolve(SCENE.text);
    OCR_STATE.busy = true;
    SCENE.lastOcrAt = Date.now();
    return OCR_STATE.worker.recognize(surface).then(function(r){
      var d = r && r.data || {};
      var text = cleanOcrText(d.text);
      SCENE.zones[name] = {
        text: text, conf: Math.round(d.confidence || 0), at: Date.now(),
        words: (d.words || []).filter(function(w){
          return w && w.text && w.confidence >= 35 && String(w.text).trim().length > 1;
        }).slice(0, 16).map(function(w){
          return { text: cleanOcrText(w.text), conf: Math.round(w.confidence), bbox: w.bbox };
        })
      };
      mergeOcrZones();
      sceneClassify();
      updateSceneHud();
      updateAiStatus();
      return text;
    }).catch(function(e){
      OCR_STATE.error = String(e && e.message || e);
      return SCENE.text;
    }).then(function(t){
      OCR_STATE.busy = false;
      return t;
    });
  }
  function cleanOcrText(s){
    return String(s || '').replace(/[^a-z0-9 .,!?:;'()\-]/ig, ' ')
      .replace(/\s+/g, ' ').trim().toUpperCase().slice(0, 280);
  }
  function screenTitleMatch(text){
    var norm = manualNorm(text);
    if(!norm || !MANUAL_STATE.index || !MANUAL_STATE.index.manuals) return null;
    /* Menu pages often list many game names. Never let a title from a
       menu list become the "current game"; only the standalone title
       screen is allowed to identify the ROM. */
    if(SCENE_MENU_RE.test(text)) return null;
    var best = null, bestScore = 0;
    MANUAL_STATE.index.manuals.forEach(function(m){
      var all = manualNorm(m.title).split(' ').filter(Boolean);
      var toks = all.filter(function(w){ return w.length > 2; });
      if(!toks.length) return;
      var hit = 0, distinctiveHit = false;
      var generic = { super: 1, mario: 1, game: 1, boy: 1, the: 1, new: 1, all: 1, world: 1 };
      var words = norm.split(' '), positions = [];
      toks.forEach(function(w){
        var pos = -1;
        for(var wi = 0; wi < words.length; wi++){
          if(words[wi].indexOf(w) !== -1){ pos = wi; break; }
        }
        if(pos !== -1){
          hit++; positions.push(pos);
          if(w.length >= 4 && !generic[w]) distinctiveHit = true;
        }
      });
      var score;
      /* The words have to be close together and near the top of the frame.
         This rejects lists/instructions that happen to contain "SUPER" and
         "TYPE" far apart, which otherwise produced bogus R-Type matches. */
      if(positions.length && (Math.min.apply(null, positions) > 4 ||
         Math.max.apply(null, positions) - Math.min.apply(null, positions) > 6)) score = 0;
      else score = null;
      if(score === null){
        if(toks.length === 1){
          score = all.length === 1 ? (hit ? 1 : 0) :
            (norm.indexOf(manualNorm(m.title)) !== -1 ? 1 : 0);
        }else{
          var need = toks.length <= 2 ? toks.length : Math.ceil(toks.length * 0.75);
          score = hit < need ? 0 : hit / toks.length;
          /* "Super Mario" alone must not identify Mario Kart, Super Game Boy
             or any other title. At least one non-generic word (kart, stars,
             kombat, ...) has to be present. This still accepts OCR noise such
             as ALCSTARS because STARS is intact. */
          if(!distinctiveHit) score = 0;
        }
      }
      if(score > bestScore){ bestScore = score; best = m; }
    });
    return bestScore >= 0.75 ? { meta: best, score: bestScore } : null;
  }
  function sceneGame(fromOcr){
    var match = screenTitleMatch(SCENE.text);
    SCENE.screenTitle = match ? match.meta.title : '';
    SCENE.screenTitleId = match ? match.meta.id : '';
    if(fromOcr){
      var currentId = MANUAL_STATE.current ? MANUAL_STATE.current.id : '';
      var sameTitle = !!(MANUAL_STATE.current && match &&
        manualNorm(MANUAL_STATE.current.title) === manualNorm(match.meta.title));
      if(match && match.score >= 0.75 && match.meta.id !== currentId && !sameTitle){
        if(SCENE.titleHitId === match.meta.id){ SCENE.titleHits++; }
        else { SCENE.titleHitId = match.meta.id; SCENE.titleHits = 1; }
        if(SCENE.titleHits >= (currentId ? 2 : 1)){
          SCENE.titleHits = 0;
          adoptScreenManual(match.meta);
        }
      }else{
        SCENE.titleHitId = '';
        SCENE.titleHits = 0;
      }
    }
    SCENE.game = MANUAL_STATE.current ? MANUAL_STATE.current.title :
      (match ? match.meta.title : currentName);
    return SCENE.game;
  }
  function updateSceneHud(){
    var e = document.getElementById('scene-read');
    if(!e) return;
    sceneGame();
    var read = SCENE.text ? ' · read "' + SCENE.text.slice(0, 74) + (SCENE.text.length > 74 ? '…' : '') + '"' : '';
    var ocr = OCR_STATE.status === 'loading' ? ' · OCR loading…' :
      (OCR_STATE.status === 'error' ? ' · OCR off' : '');
    e.textContent = 'SCENE · ' + SCENE.mode.toUpperCase() + ' · ' +
      (SCENE.game || currentName) + read + (SCENE.conf ? ' · ' + SCENE.conf + '%' : '') + ocr;
    var pe = document.getElementById('scene-plan');
    if(pe){
      var per = SCENE.percept || { tags: [], hud: {}, prompt: '', action: '' };
      var sit = SCENE.situation || {}, hud = per.hud || {}, hp = [];
      ['time', 'score', 'lives', 'health', 'round'].forEach(function(k){
        if(hud[k] != null) hp.push(k + ' ' + hud[k]);
      });
      var au = SCENE.audio || {};
      var heard = au.kind ? au.kind + ' ' + (au.peak || 0).toFixed(2) : 'quiet';
      var seen = sit.player ? 'P@' + sit.player.x + ',' + sit.player.y : 'no player';
      if(sit.gap) seen += ' gap';
      if(sit.enemy) seen += ' enemy';
      if(sit.obstacle) seen += ' obstacle';
      if(sit.airborne) seen += ' airborne';
      if(hp.length) seen += ' HUD ' + hp.join(' ');
      var p0 = autoPilots[0];
      var plan = p0 && p0.mode === 'play' && p0.lastPlan ? p0.lastPlan : 'observe';
      var outcome = p0 && p0.lastOutcome && Date.now() - (p0.planAt || 0) < 4500 ?
        ' → ' + p0.lastOutcome : '';
      pe.textContent = 'SEES · ' + seen +
        ' | DECIPHERS · ' + (sit.phase || 'reading') +
        ' ' + (sit.confidence ? Math.round(sit.confidence * 100) + '%' : '') +
        (sit.reasons && sit.reasons.length ? ' (' + sit.reasons.join(', ') + ')' : '') +
        ' | HEARS · ' + heard +
        ' | READS · ' + (per.prompt ? 'prompt ' + per.prompt : per.action ? 'action ' + per.action : (SCENE.text ? 'text' : '—')) +
        ' | DECIDES · ' + plan + outcome;
    }
  }
  function runOcrNow(){
    if(OCR_STATE.busy) return Promise.resolve(SCENE.text);
    if(!OCR_STATE.worker) return ensureOcrWorker().then(function(w){ return w ? runOcrNow() : SCENE.text; });
    var surface = ocrSurface();
    if(!surface) return Promise.resolve(SCENE.text);
    OCR_STATE.busy = true;
    SCENE.lastOcrAt = Date.now();
    return OCR_STATE.worker.recognize(surface).then(function(r){
      var d = r && r.data || {};
      SCENE.text = cleanOcrText(d.text);
      SCENE.conf = Math.round(d.confidence || 0);
      SCENE.textAt = Date.now();
      SCENE.firstRead = !!(SCENE.text && SCENE.text.length >= 2);
      SCENE.words = (d.words || []).filter(function(w){
        return w && w.text && w.confidence >= 40 && String(w.text).trim().length > 1;
      }).slice(0, 24).map(function(w){ return { text: cleanOcrText(w.text), conf: Math.round(w.confidence), bbox: w.bbox }; });
      sceneGame(true);
      sceneClassify();
      updateSceneHud();
      updateAiStatus();
      return SCENE.text;
    }).catch(function(e){
      OCR_STATE.error = String(e && e.message || e);
      return SCENE.text;
    }).then(function(t){
      OCR_STATE.busy = false;
      return t;
    });
  }
  function maybeOcr(now){
    if(!OCR_STATE.worker && !OCR_STATE.workerPromise && !OCR_STATE.error){
      ensureOcrWorker();
    }
    if(SCENE.mode === 'black') return;
    if(!OCR_STATE.worker || OCR_STATE.busy) return;
    var textScreen = SCENE.mode !== 'play' && SCENE.mode !== 'fight';
    if(textScreen){
      var due = aiLabOpen() ? 1200 : 2200;
      if(!SCENE.text || now - SCENE.textAt > due){
        if(now - SCENE.lastOcrAt > 600) runOcrNow();
      }
      return;
    }
    /* Gameplay: rotate HUD → prompt → bottom. Each band has its own age so
       a readable HUD does not starve the centre prompt. */
    var zones = [['hud', 1000], ['prompt', 1300], ['bottom', 1900]];
    var pick = null, bestAge = 0;
    zones.forEach(function(z){
      var cur = SCENE.zones[z[0]];
      var age = cur ? now - cur.at : 1e9;
      if(age > z[1] && age > bestAge){ bestAge = age; pick = z[0]; }
    });
    if(pick && now - SCENE.lastOcrAt > 650) runOcrZone(pick);
  }
  function sceneIsFighter(){
    return !!(MANUAL_STATE.current && MANUAL_STATE.current.kind === 'fighter') ||
      AgentOpts.profile === 'umk3' || AgentOpts.profile === 'mix';
  }
  /* ---------- real scene vision ----------------------------------------
     A 64x48 RGB sample of the live canvas, analysed every scene tick. We
     compare each cell with its row's edge colour to build a foreground
     mask, find the ground line, the player/opponent blobs, obstacles and
     gaps ahead, and read health-bar runs. This is deliberately separate
     from the 32x32 DQN vision stream so changing one never breaks the other. */
  var SCENE_GRID_W = 128, SCENE_GRID_H = 96;
  var sceneCanvas = null, sceneCtx = null;
  function captureSceneFrame(src){
    src = src || gameCanvas();
    if(!src || !src.width) return null;
    try{
      if(!sceneCanvas){
        sceneCanvas = document.createElement('canvas');
        sceneCanvas.width = SCENE_GRID_W; sceneCanvas.height = SCENE_GRID_H;
        sceneCtx = sceneCanvas.getContext('2d', { willReadFrequently: true });
      }
      sceneCtx.imageSmoothingEnabled = false;
      sceneCtx.drawImage(src, 0, 0, SCENE_GRID_W, SCENE_GRID_H);
      var d = sceneCtx.getImageData(0, 0, SCENE_GRID_W, SCENE_GRID_H).data;
      var rgb = new Uint8Array(SCENE_GRID_W * SCENE_GRID_H * 3);
      var gray = new Uint8Array(SCENE_GRID_W * SCENE_GRID_H);
      for(var i = 0, j = 0; i < d.length; i += 4, j++){
        rgb[j * 3] = d[i]; rgb[j * 3 + 1] = d[i + 1]; rgb[j * 3 + 2] = d[i + 2];
        gray[j] = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0;
      }
      return { w: SCENE_GRID_W, h: SCENE_GRID_H, rgb: rgb, gray: gray };
    }catch(e){ return null; }
  }
  function sceneVision(f, prev){
    if(!f) return null;
    var w = f.w, h = f.h, rgb = f.rgb, gray = f.gray;
    var at = function(x, y){ return (y * w + x) * 3; };
    var dist = function(ar, br, ag, bg, ab, bb){
      var dr = ar - br, dg = ag - bg, db = ab - bb;
      return Math.sqrt(dr * dr + dg * dg + db * db);
    };
    var sat = function(r, g, b){
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      return mx > 0 ? (mx - mn) / mx : 0;
    };
    var rowBg = [], rowUniform = [];
    var margin = Math.max(4, Math.round(w * 0.09));
    for(var y = 0; y < h; y++){
      var sr = 0, sg = 0, sb = 0, n = 0;
      for(var x = 0; x < margin; x++){
        var o1 = at(x, y); sr += rgb[o1]; sg += rgb[o1 + 1]; sb += rgb[o1 + 2]; n++;
        var o2 = at(w - 1 - x, y); sr += rgb[o2]; sg += rgb[o2 + 1]; sb += rgb[o2 + 2]; n++;
      }
      var br = sr / n, bg = sg / n, bb = sb / n;
      rowBg.push([br, bg, bb]);
      var uni = 0;
      for(x = 0; x < w; x++){
        var o = at(x, y);
        if(dist(rgb[o], br, rgb[o + 1], bg, rgb[o + 2], bb) < 26) uni++;
      }
      rowUniform.push(uni / w);
    }
    var mask = new Uint8Array(w * h);
    for(y = Math.round(h * 0.146); y < h; y++){
      var b = rowBg[y];
      for(x = 0; x < w; x++){
        var o = at(x, y);
        if(dist(rgb[o], b[0], rgb[o + 1], b[1], rgb[o + 2], b[2]) > 38) mask[y * w + x] = 1;
      }
    }
    /* Bottom palette = the colours the floor is actually made of. Quantise
       the bottom eight rows, keep the most frequent bins, then find where
       that band starts. Grass, dirt and metal floors all work this way. */
    var bins = {}, order = [];
    for(y = h - 8; y < h; y++){
      for(x = 0; x < w; x++){
        var oo = at(x, y);
        var key = ((rgb[oo] >> 4) << 8) | ((rgb[oo + 1] >> 4) << 4) | (rgb[oo + 2] >> 4);
        if(!bins[key]){ bins[key] = { n: 0, r: 0, g: 0, b: 0 }; order.push(key); }
        bins[key].n++; bins[key].r += rgb[oo]; bins[key].g += rgb[oo + 1]; bins[key].b += rgb[oo + 2];
      }
    }
    order.sort(function(a, b){ return bins[b].n - bins[a].n; });
    var groundPal = order.slice(0, 6).map(function(k){
      return [bins[k].r / bins[k].n, bins[k].g / bins[k].n, bins[k].b / bins[k].n];
    });
    var nearGround = function(r, g, b, limit){
      var lim = limit == null ? 68 : limit;
      for(var i = 0; i < groundPal.length; i++){
        var p = groundPal[i];
        if(dist(r, p[0], g, p[1], b, p[2]) < lim) return true;
      }
      return false;
    };
    var groundY = h - 4;
    for(y = h - 1; y >= Math.round(h * 0.54); y--){
      var hit = 0;
      for(x = 0; x < w; x++){
        var go = at(x, y);
        if(nearGround(rgb[go], rgb[go + 1], rgb[go + 2])) hit++;
      }
      if(hit / w > 0.45) groundY = y;
      else if(groundY - y > 2) break;
    }
    var groundO = at(Math.round(w * 0.16), Math.min(h - 1, groundY + 3));
    var gr = rgb[groundO], gg = rgb[groundO + 1], gb = rgb[groundO + 2];
    /* Sprite mask removes the floor and sky by colour (not by row), so a
       character standing on the ground does not merge into the ground blob. */
    var spMask = new Uint8Array(w * h);
    for(y = Math.round(h * 0.146); y < h; y++){
      var rb = rowBg[y];
      for(x = 0; x < w; x++){
        var so = at(x, y);
        var sr2 = rgb[so], sg2 = rgb[so + 1], sb2 = rgb[so + 2];
        var smx = Math.max(sr2, sg2, sb2), smn = Math.min(sr2, sg2, sb2);
        /* White clouds and pale scenery are background, not sprites. They
           often span the screen edge and defeat the row-background test,
           swallowing a small player inside one giant component. */
        var pale = smx > 165 && (smx - smn) < 55;
        var bluish = sb2 > sr2 + 18 && sb2 >= sg2 - 6;
        if(!pale && !bluish && !nearGround(sr2, sg2, sb2) && sat(sr2, sg2, sb2) > 0.22 &&
           dist(sr2, rb[0], sg2, rb[1], sb2, rb[2]) > 30) spMask[y * w + x] = 1;
      }
    }
    /* Connected sprite blobs above the ground line. */
    var seen = new Uint8Array(w * h), comps = [];
    for(y = Math.round(h * 0.146); y < Math.min(groundY + 1, h); y++){
      for(x = 0; x < w; x++){
        var idx = y * w + x;
        if(!spMask[idx] || seen[idx]) continue;
        var stack = [idx], minX = x, maxX = x, minY = y, maxY = y, count = 0;
        var cr = 0, cg = 0, cb = 0;
        seen[idx] = 1;
        while(stack.length){
          var q = stack.pop(), qx = q % w, qy = (q / w) | 0, qo = q * 3;
          count++;
          cr += rgb[qo]; cg += rgb[qo + 1]; cb += rgb[qo + 2];
          if(qx < minX) minX = qx; if(qx > maxX) maxX = qx;
          if(qy < minY) minY = qy; if(qy > maxY) maxY = qy;
          var nb = [q - 1, q + 1, q - w, q + w, q - w - 1, q - w + 1, q + w - 1, q + w + 1];
          for(var k = 0; k < 8; k++){
            var r = nb[k];
            if(r < 0 || r >= w * h) continue;
            var rx = r % w;
            if(Math.abs(rx - qx) > 1) continue;
            if(spMask[r] && !seen[r]){ seen[r] = 1; stack.push(r); }
          }
        }
        if(count >= 2 && count <= 1100){
          comps.push({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1,
            cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, area: count,
            rgb: [cr / count, cg / count, cb / count] });
        }
      }
    }
    comps.sort(function(a, b){ return b.area - a.area; });
    var allRaw = comps.slice();
    var rawComps = comps.slice(0, 12);
    /* HUD glyphs and the ground strip are not sprites. Keep only compact
       blobs below the HUD band and narrower than half the screen. */
    var cand = comps.filter(function(c){
      var cd = dist(c.rgb[0], gr, c.rgb[1], gg, c.rgb[2], gb);
      var s = sat(c.rgb[0], c.rgb[1], c.rgb[2]);
      var mx = Math.max(c.rgb[0], c.rgb[1], c.rgb[2]);
      var mn = Math.min(c.rgb[0], c.rgb[1], c.rgb[2]);
      var whitish = mx > 170 && (mx - mn) < 72;
      return c.y >= Math.round(h * 0.229) && c.w <= 24 && c.h <= 28 && c.area >= 6 &&
        c.area <= 300 && !whitish && cd > 40 && s > 0.16;
    });
    var strict = cand.filter(function(c){
      return !nearGround(c.rgb[0], c.rgb[1], c.rgb[2], 50);
    });
    comps = (strict.length ? strict : cand).slice(0, 8);
    var allComps = comps.slice();
    var maxSat = 0;
    comps.forEach(function(c){
      var s = sat(c.rgb[0], c.rgb[1], c.rgb[2]);
      if(s > maxSat) maxSat = s;
    });
    /* Bright, saturated compact blobs are sprites; dark red/brown pickups
       and pale clouds are not. Fall back to the most saturated blob for
       darker characters (e.g. Donkey Kong). */
    var vivid = comps.filter(function(c){
      var s = sat(c.rgb[0], c.rgb[1], c.rgb[2]);
      var val = Math.max(c.rgb[0], c.rgb[1], c.rgb[2]) / 255;
      return s > 0.56 && val > 0.62;
    });
    /* Player characters usually have a warm accent (Mario's cap/shirt,
       a fighter's skin/gi) that survives the 64x48 downsample. Look for
       those blobs even when they are too small for the generic vivid
       filter; this stops a green bush or cloud from being called P1. */
    /* Find true-red pixels directly, independent of the row-background
       sprite mask. At 128x96 Mario's cap can be a handful of pixels that
       the generic component filter splits; this keeps the player locked
       on the red hat instead of an orange brick or a green bush. */
    var redUsed = new Uint8Array(w * h), warm = [];
    for(y = Math.round(h * 0.146); y < Math.min(groundY + 1, h); y++){
      for(x = 0; x < w; x++){
        var ri = y * w + x, rp = ri * 3;
        var rr = rgb[rp], rg = rgb[rp + 1], rb2 = rgb[rp + 2];
        if(redUsed[ri] || !(rr > 120 && rg < rr * 0.25 && rb2 < rr * 0.50)) continue;
        var rstack = [ri], rminX = x, rmaxX = x, rminY = y, rmaxY = y, rcount = 0;
        var rcr = 0, rcg = 0, rcb = 0;
        redUsed[ri] = 1;
        while(rstack.length){
          var rq = rstack.pop(), rqx = rq % w, rqy = (rq / w) | 0, rqo = rq * 3;
          rcount++; rcr += rgb[rqo]; rcg += rgb[rqo + 1]; rcb += rgb[rqo + 2];
          if(rqx < rminX) rminX = rqx; if(rqx > rmaxX) rmaxX = rqx;
          if(rqy < rminY) rminY = rqy; if(rqy > rmaxY) rmaxY = rqy;
          var rnb = [rq - 1, rq + 1, rq - w, rq + w, rq - w - 1, rq - w + 1, rq + w - 1, rq + w + 1];
          for(var rk = 0; rk < 8; rk++){
            var rn = rnb[rk];
            if(rn < 0 || rn >= w * h || redUsed[rn]) continue;
            if(Math.abs((rn % w) - rqx) > 1) continue;
            var rno = rn * 3;
            if(rgb[rno] > 120 && rgb[rno + 1] < rgb[rno] * 0.25 && rgb[rno + 2] < rgb[rno] * 0.50){
              redUsed[rn] = 1; rstack.push(rn);
            }
          }
        }
        if(rcount >= 2 && rmaxX - rminX + 1 <= 30 && rmaxY - rminY + 1 <= 30){
          /* Mario has blue overalls just below the red cap. Goombas and
             bricks are red/brown only. Requiring blue below the red blob
             separates the player from an enemy with a similar palette. */
          var blueBelow = false;
          for(var by = rminY; by <= Math.min(h - 1, rmaxY + 8) && !blueBelow; by++){
            for(var bx = Math.max(0, rminX - 3); bx <= Math.min(w - 1, rmaxX + 3); bx++){
              if(by < rminY + Math.max(1, (rmaxY - rminY) * 0.4)) continue;
              var bo = (by * w + bx) * 3;
              if(rgb[bo + 2] > 80 && rgb[bo + 2] > rgb[bo] * 1.25 &&
                 rgb[bo + 2] > rgb[bo + 1] * 1.10){ blueBelow = true; break; }
            }
          }
          if(blueBelow){
            warm.push({ x: rminX, y: rminY, w: rmaxX - rminX + 1, h: rmaxY - rminY + 1,
              cx: (rminX + rmaxX) / 2, cy: (rminY + rmaxY) / 2, area: rcount,
              rgb: [rcr / rcount, rcg / rcount, rcb / rcount] });
          }
        }
      }
    }
    if(!vivid.length){
      vivid = comps.filter(function(c){
        return sat(c.rgb[0], c.rgb[1], c.rgb[2]) >= maxSat - 0.18;
      });
    }
    var player = null;
    var prevWarm = !!(prev && prev.player && prev.player.rgb &&
      prev.player.rgb[0] > prev.player.rgb[1] * 1.3);
    var choices = warm.slice();
    if(!prevWarm) vivid.forEach(function(c){ if(choices.indexOf(c) === -1) choices.push(c); });
    if(prev && prev.player){
      var best = 1e9;
      choices.forEach(function(c){
        var d = Math.abs(c.cx - prev.player.cx) + Math.abs(c.cy - prev.player.cy) * 0.5;
        if(d < best){ best = d; player = c; }
      });
      if(best > 36) player = null;
    }
    if(!player && !prevWarm){
      /* Warm sprites are the strongest player clue. Only fall back to the
         leftmost vivid blob when the game has no warm character pixels.
         If the last player was warm and has now vanished, report "not
         isolated" instead of locking onto a similarly coloured enemy. */
      var pool = warm.length ? warm : vivid;
      pool.sort(function(a, b){ return a.cx - b.cx; });
      player = pool.length ? pool[0] : null;
    }
    var others = allComps.filter(function(c){ return c !== player; });
    others.sort(function(a, b){
      if(!player) return b.area - a.area;
      var da = Math.abs(a.cx - player.cx), db = Math.abs(b.cx - player.cx);
      var rightA = a.cx > player.cx ? 0 : 1, rightB = b.cx > player.cx ? 0 : 1;
      return (rightA - rightB) || (da - db);
    });
    var aheadX = player ? player.cx : 20;
    var obstacleAhead = false, gapAhead = false, enemyAhead = null;
    if(player && player.area >= 6 && groundY < h - 1){
      var solidAhead = 0;
      for(x = Math.min(w - 1, Math.ceil(aheadX + 4)); x <= Math.min(w - 1, Math.ceil(aheadX + 22)); x++){
        var solid = 0;
        for(y = Math.max(Math.round(h * 0.167), groundY - 12); y < groundY; y++){
          if(mask[y * w + x]) solid++;
        }
        if(solid >= 2) solidAhead++;
        var floorSeen = false;
        for(y = groundY + 1; y < h; y++){
          var o = at(x, y);
          if(nearGround(rgb[o], rgb[o + 1], rgb[o + 2])){ floorSeen = true; break; }
        }
        if(!floorSeen) gapAhead = true;
      }
      obstacleAhead = solidAhead >= 2;
    }
    others.forEach(function(c){
      if(!enemyAhead && c.cx > aheadX + 4 && c.cx < aheadX + 36 &&
         c.cy > groundY - 24 && c.w >= 4 && c.h >= 4 && c.area >= 8 &&
         c.w <= 24 && c.h <= 24) enemyAhead = c;
    });
    /* Two long saturated runs at the top usually are fighter health bars. */
    var bars = null;
    for(y = Math.round(h * 0.125); y < Math.min(Math.round(h * 0.375), h); y++){
      var runs = [], start = -1;
      for(x = 0; x < w; x++){
        var o = at(x, y), r = rgb[o], g = rgb[o + 1], bl = rgb[o + 2];
        var hot = (r > 100 && r > g * 1.25 && r > bl * 1.25) ||
          (g > 100 && g > r * 1.3 && g > bl * 1.2) ||
          (r > 130 && g > 100 && bl < 100);
        if(hot && start < 0) start = x;
        if((!hot || x === w - 1) && start >= 0){
          var end = hot && x === w - 1 ? x : x - 1;
          if(end - start >= 14) runs.push([start, end]);
          start = -1;
        }
      }
      if(runs.length >= 2){
        var left = runs.filter(function(run){ return run[1] < w * 0.47; })[0];
        var right = runs.filter(function(run){ return run[0] > w * 0.53; })[0];
        if(left && right){
          bars = { y: y, left: (left[1] - left[0] + 1) / (w * 0.46),
            right: (right[1] - right[0] + 1) / (w * 0.46) };
          break;
        }
      }
    }
    var zones = { left: 0, center: 0, right: 0 };
    if(prev && prev.frame){
      var pf = prev.frame.gray, areas = [0, 0, 0], counts = [0, 0, 0];
      for(y = Math.round(h * 0.146); y < h; y++){
        for(x = 0; x < w; x++){
          var o = y * w + x, z = x < w / 3 ? 0 : (x < w * 2 / 3 ? 1 : 2);
          areas[z] += Math.abs(gray[o] - pf[o]); counts[z]++;
        }
      }
      zones = { left: areas[0] / counts[0], center: areas[1] / counts[1], right: areas[2] / counts[2] };
    }
    return {
      w: w, h: h, groundY: groundY, ground: [gr, gg, gb],
      player: player, entities: comps.slice(0, 6), opponent: others[0] || null,
      raw: rawComps, debug: { filtered: comps, cand: cand, strict: strict, warm: warm, maxSat: maxSat },
      obstacleAhead: obstacleAhead, gapAhead: gapAhead, enemyAhead: enemyAhead,
      bars: bars, zones: zones, frame: { gray: gray },
      coverage: mask.reduce(function(a, b){ return a + b; }, 0) / (w * h)
    };
  }
  /* Turn OCR words into an actionable situation: explicit prompts,
     HUD numbers and game-state tags. This is what the playbooks read;
     they never have to guess from button lists alone. */
  function scenePerceive(t){
    var text = String(t || '');
    var tags = [], prompt = '', action = '', hud = {};
    var tag = function(name, re){ if(re.test(text) && tags.indexOf(name) === -1) tags.push(name); };
    tag('fight', /\b(round|fight|finish (him|her)|fatality|flawless|victory|k\.?o\.?|versus|vs)\b/i);
    tag('wrestling', /\b(lock ?up|pin|turnbuckle|royal rumble|tag team|ropes?|referee|submission|three count)\b/i);
    tag('downed', /\b(knocked out|stunned|on the mat|get up|kick out|cover|pin attempt)\b/i);
    tag('dkc', /\b(banana|kremlin|kritter|bonus|checkpoint|cave|mine|barrel|animal buddy)\b/i);
    tag('race', /\b(lap|checkpoint|finish line|position|km\/h|speed)\b/i);
    tag('shooter', /\b(ammo|reload|weapon|shield|boss|missile)\b/i);
    tag('menu', /\b(press start|select game|file select|continue|options?)\b/i);
    var pm = text.match(/\b(?:press|push|hit|tap|hold)\s+(?:the\s+)?(start|select|[abxy]|l|r|up|down|left|right)\b/i);
    if(pm) prompt = pm[1].toUpperCase();
    else if(/\bpress any button\b/i.test(text)) prompt = 'ANY';
    if(/\bfinish (him|her)\b/i.test(text)) action = 'finisher';
    else if(/\b(continue|press start)\b/i.test(text)) action = 'advance';
    else if(/\b(lock ?up|grapple)\b/i.test(text)) action = 'grapple';
    else if(/\b(pin|cover)\b/i.test(text)) action = 'pin';
    else if(/\b(get up|kick out)\b/i.test(text)) action = 'escape';
    else if(/\b(block|guard)\b/i.test(text)) action = 'block';
    /* OCR turns 0 into O/Q, 1 into I/l/|, 5 into S, 8 into B and 2 into Z.
       Read numbers from the HUD crop, not the whole noisy frame. */
    var hudZone = SCENE.zones && SCENE.zones.hud;
    var ht = hudZone && hudZone.text ? hudZone.text : text;
    var num = function(re){
      var m = ht.match(re);
      if(!m || m[1] == null) return null;
      var fixed = String(m[1]).toUpperCase()
        .replace(/[OQ]/g, '0').replace(/[IL|]/g, '1')
        .replace(/S/g, '5').replace(/B/g, '8').replace(/Z/g, '2');
      var n = parseInt(fixed, 10);
      return isNaN(n) ? null : n;
    };
    hud.time = num(/\b(?:time|timer)\b[^a-z0-9]{0,10}([0-9OQIL|SBZ]{1,7})/i);
    hud.score = num(/\b(?:score|points)\b[^a-z0-9]{0,10}([0-9OQIL|SBZ]{1,9})/i);
    hud.lives = num(/\b(?:lives|life|men)\b[^a-z0-9]{0,8}([0-9OQIL|SBZ]{1,3})/i);
    hud.health = num(/\b(?:health|energy|hp)\b[^a-z0-9]{0,8}([0-9OQIL|SBZ]{1,4})/i);
    hud.round = num(/\bround\s*([0-9OQIL|SBZ]{1,3})/i);
    return { tags: tags, prompt: prompt, action: action, hud: hud };
  }
  /* Fuse what the three senses just reported into one readable situation.
     OCR gives words/prompts/HUD, vision gives geometry/bars, audio gives
     impact/silence. The playbooks consume this instead of raw pixels. */
  function sceneDecipher(){
    var v = SCENE.vision || {}, p = SCENE.percept || { tags: [], hud: {} };
    var a = SCENE.audio || {}, kind = MANUAL_STATE.current ? MANUAL_STATE.current.kind : 'generic';
    var tags = p.tags || [], hud = p.hud || {};
    var phase = 'running', conf = 0.35, reasons = [];
    var health = null, proximity = null, airborne = false;
    if(SCENE.mode !== 'play' && SCENE.mode !== 'fight'){
      phase = SCENE.mode === 'menu' ? 'menu' : SCENE.mode;
      conf = 0.9;
      reasons.push('scene mode ' + SCENE.mode);
    }else{
      var bars = v.bars;
      if(bars){
        health = { left: Math.round(bars.left * 100) / 100, right: Math.round(bars.right * 100) / 100,
          low: bars.left < 0.28 };
        conf += 0.18;
        reasons.push('health bars ' + health.left + '/' + health.right);
      }
      if(v.player && v.opponent){
        proximity = Math.round((Math.abs(v.player.cx - v.opponent.cx) / (v.w || 64)) * 100) / 100;
        conf += 0.1;
        reasons.push('opponent ' + proximity.toFixed(2) + ' screen');
      }
      if(v.player && v.groundY != null){
        airborne = v.player.cy < v.groundY - Math.max(3, v.h * 0.055);
        if(airborne){ conf += 0.05; reasons.push('airborne'); }
      }
      if(tags.indexOf('fight') !== -1 || bars || kind === 'fighter'){ phase = 'combat'; conf += 0.12; }
      if(p.action === 'finisher'){ phase = 'finish'; conf += 0.2; reasons.push('finish prompt'); }
      if(kind === 'wrestler' && (p.action === 'pin' || tags.indexOf('downed') !== -1)){
        phase = 'pin-attempt'; conf += 0.18; reasons.push('downed opponent');
      }
      if(phase !== 'finish' && phase !== 'pin-attempt'){
        if(v.gapAhead){ phase = 'gap'; conf += 0.35; reasons.push('gap ahead'); }
        else if(v.enemyAhead){ phase = 'enemy'; conf += 0.3; reasons.push('enemy ahead'); }
        else if(v.obstacleAhead){ phase = 'obstacle'; conf += 0.25; reasons.push('obstacle ahead'); }
      }
      if(a.kind === 'impact'){ reasons.push('impact heard'); conf += 0.08; }
      if(a.kind === 'silence' && SCENE.stillMs > 1600){
        conf += 0.05; reasons.push('silent and still');
      }
      if(SCENE.stillMs > 2200 && !airborne && phase === 'running'){
        phase = 'blocked'; conf += 0.2; reasons.push('no scroll for ' + (SCENE.stillMs / 1000).toFixed(1) + 's');
      }
      if(!v.player && !bars){ conf = Math.min(conf, 0.25); reasons.push('player not isolated'); }
    }
    SCENE.situation = {
      phase: phase, confidence: Math.max(0.1, Math.min(0.99, Math.round(conf * 100) / 100)),
      reasons: reasons.slice(0, 5), health: health, proximity: proximity,
      airborne: airborne, player: v.player ? { x: v.player.cx, y: v.player.cy } : null,
      groundY: v.groundY != null ? v.groundY : null,
      gap: !!v.gapAhead, enemy: !!v.enemyAhead, obstacle: !!v.obstacleAhead,
      sound: a.kind || '', soundPeak: a.peak || 0, hud: hud,
      at: Date.now()
    };
  }
  function sceneClassify(){
    var t = SCENE.text || '';
    SCENE.percept = scenePerceive(t);
    /* OCR frequently reads WORLD as HORLD/WOR and TIME as IME/HME.
       Numbers plus one of those fragments are a gameplay HUD, not a title. */
    var gameplayText = SCENE_GAMEPLAY_RE.test(t) ||
      (/\b(hor|wor|horld|hme|ime)\b/i.test(t) && /\d/.test(t));
    var titleMenuText = SCENE_TITLE_MENU_RE.test(t);
    /* Pause/continue overlays keep the HUD on screen, so HUD words must not
       hide an explicit CONTINUE/SAVE & QUIT list. */
    var overlayMenuText = /\b(continue|save\s*&\s*(?:continue|quit)|quit|exit)\b/i.test(t);
    var menuText = (SCENE_MENU_RE.test(t) && !gameplayText) || titleMenuText || overlayMenuText;
    /* A title screen does not have to be perfectly OCR-matched to the
       manual index. Short, still, text-only frames with no HUD words are
       treated as title/menu evidence; the manual is only swapped on a
       high-confidence title match. Never let this generic guess pull the
       bot back into a menu once real gameplay is running. */
    var titleText = !!SCENE.screenTitle && !gameplayText;
    /* OCR often mangles the first token of a title ("3 MARIO BROS, ..."),
       so accept any of the first few words as the title-looking word. */
    var titleWord = SCENE.words.slice(0, 3).some(function(w){
      return /^[A-Z0-9][A-Z0-9.'-]{3,}$/.test(String(w.text || ''));
    });
    /* A low-resolution OCR can lose the first letters of the logo
       ("ER MARIO ALLSTA..."). A distinctive title phrase is enough to
       keep the pilot in SEEK until the real menu appears. */
    var knownTitle = /\b(?:SUPER\s+)?MARIO\b/i.test(t) &&
      /\bALL\s*STARS?\b/i.test(t);
    if(!titleText && !gameplayText && SCENE.mode !== 'play' && SCENE.mode !== 'fight' &&
       !SCENE_DIALOG_RE.test(t) && (titleWord || knownTitle) &&
       t && SCENE.stillMs > 900 && (SCENE.words.length <= 8 || knownTitle) &&
       SCENE.conf >= 30){
      titleText = true;
    }
    SCENE.strongMenu = menuText || titleText;
    /* After a START/A press the next screen can take a moment to appear.
       Keep the menu context (and fire no more buttons) until OCR has read
       the new screen, so a second START cannot land on live gameplay. */
    var held = SCENE.holdUntilRead && Date.now() - SCENE.holdAt < 6000;
    if(SCENE.holdUntilRead && SCENE.lastOcrAt > SCENE.holdAt){
      SCENE.holdUntilRead = false;
      held = false;
    }
    if(held) SCENE.strongMenu = false;
    /* Before the first confirmed gameplay frame, an unread still screen is
       a menu/title, not permission to start driving. Otherwise an empty OCR
       result becomes "play" and the pilot mashes START on the title. */
    var mode = SCENE.lastPlayAt ? 'play' : 'menu', why = SCENE.lastPlayAt ? 'motion' : 'unread screen';
    /* A menu can fade/scroll into the next screen. Do not reinterpret a
       few blank or noisy frames as live gameplay and start driving; that
       is what fired A/START into still-menu screens. Explicit gameplay
       text, a black transition or a real elapsed play window ends grace. */
    var menuGrace = SCENE.mode === 'menu' &&
      Date.now() - SCENE.menuAt < 6000;
    if(SCENE.mean < AgentOpts.blackMean){ mode = 'black'; why = 'black'; }
    else if(!SCENE.firstRead && !t){ mode = 'reading'; why = 'reading screen'; }
    else if(!t && !SCENE.lastPlayAt){ mode = 'reading'; why = 'waiting for readable screen'; }
    else if(held){ mode = 'menu'; why = 'menu settle'; }
    else if(SCENE_PAUSE_RE.test(t) && SCENE.stillMs > 180){ mode = 'paused'; why = 'pause text'; }
    else if(SCENE_OVER_RE.test(t) && SCENE.stillMs > 250){ mode = 'gameover'; why = 'game over text'; }
    /* Text is stronger evidence than motion. A menu may animate or scroll;
       waiting for it to become still is what made the bot hover in menus. */
    else if(SCENE.strongMenu){ mode = 'menu'; why = menuText ? 'menu text' : 'title screen'; }
    else if(menuGrace){ mode = 'menu'; why = 'menu transition'; }
    else if(gameplayText){ mode = 'play'; why = 'gameplay HUD'; }
    else if(SCENE_DIALOG_RE.test(t) && SCENE.stillMs > 450){ mode = 'dialog'; why = 'dialogue text'; }
    else if(SCENE_FIGHT_RE.test(t) || sceneIsFighter()){ mode = 'fight'; why = sceneIsFighter() ? 'fighter' : 'fight text'; }
    /* No "still means menu" fallback: a still gameplay screen is still
       gameplay. Only explicit menu/title text can send the pilots back to
       SEEK, otherwise they would loop through menus forever. */
    sceneSet(mode, why);
    sceneDecipher();
  }
  function sceneTap(btn, pt, hold, src){
    if(!autoOn || !playing || !pt) return;
    SCENE.lastTap = btn; SCENE.taps = (SCENE.taps || 0) + 1;
    driveIndex(btn, true, src || 'scene', pt.pl);
    setTimeout(function(){ driveIndex(btn, false, src || 'scene', pt.pl); }, hold || 100);
  }
  function sceneConfirmBtn(pt){
    var b = pt && pt.sem ? pt.sem.confirm : null;
    return b != null ? b : AgentMap.actions[0];
  }
  function sceneStartBtn(pt){
    var b = pt && pt.sem ? pt.sem.start : null;
    return b != null ? b : AgentMap.start;
  }
  function sceneTitleMenu(){
    return SCENE.why === 'title screen' ||
      SCENE_TITLE_MENU_RE.test(SCENE.text || '') ||
      /\b(press start|start game)\b/i.test(SCENE.text || '');
  }
  /* Menus in the All-Stars manual (Game Select, file select, pause, game
     over) advance with START after the cursor is moved. A is the erase key
     on the file screen, so it must not be used as a generic menu confirm. */
  function sceneMenuButton(pt){
    if(/\bpress\s+([abxy])\b/i.test(SCENE.text || '')) return sceneConfirmBtn(pt);
    return sceneStartBtn(pt);
  }
  function sceneAdvance(force){
    var now = Date.now();
    if(!force && now - SCENE.lastAdvance < 650) return;
    if(!force && SCENE.advanceCount >= 8) return;
    if(!autoPilots.length) return;
    SCENE.lastAdvance = now;
    SCENE.advanceCount++;
    sceneTap(sceneConfirmBtn(autoPilots[0]), autoPilots[0], 90, 'dialogue');
  }
  function sceneApply(mode){
    if(!autoOn) return;
    var playingMode = mode === 'play' || mode === 'fight';
    autoPilots.forEach(function(pt){
      if(playingMode){
        if(pt.mode !== 'play'){ pt.mode = 'play'; pt.prev = null; }
      }else{
        if(pt.mode !== 'seek'){ pt.mode = 'seek'; armStart(pt); }
        pt.lastPlan = '';
        releasePilot(pt.pl);
      }
    });
    updateAutoBtn();
  }
  function sceneSet(mode, why){
    SCENE.why = why || '';
    /* Refresh the timestamp on every menu frame, not just the entry frame,
       so a menu that stays on screen keeps its transition grace alive. */
    if(mode === 'menu' && SCENE.strongMenu) SCENE.menuAt = Date.now();
    if(mode === SCENE.mode) return;
    var prev = SCENE.mode;
    SCENE.mode = mode;
    SCENE.changedAt = Date.now();
    SCENE.reactCount = 0;
    SCENE.advanceCount = 0;
    if(mode === 'menu'){
      autoPilots.forEach(function(pt){ pt.menuTries = 0; });
    }
    if(mode === 'play' || mode === 'fight'){
      SCENE.lastPlayAt = SCENE.changedAt;
      SCENE.flowTaps = 0;
      SCENE.screenTitle = '';
      SCENE.screenTitleId = '';
      SCENE.titleHitId = '';
      SCENE.titleHits = 0;
      SCENE.lastOcrAt = 0;
      autoPilots.forEach(function(pt){ pt.menuTries = 0; });
    }
    /* A menu/dialogue OCR string must not keep matching after gameplay
       starts; drop it so the next still frame is read fresh. */
    if((mode === 'play' || mode === 'fight') && prev !== 'play' && prev !== 'fight'){
      SCENE.text = ''; SCENE.words = []; SCENE.conf = 0; SCENE.textAt = 0;
      SCENE.zones = {};
      SCENE.percept = scenePerceive('');
      SCENE.audioSpikeAt = 0;
    }
    sceneApply(mode);
    updateSceneHud();
    updateAiStatus();
    if(mode === 'dialog') sceneAdvance(true);
  }
  function sceneReact(now){
    if(!autoOn || !playing || !autoPilots.length) return;
    if(SCENE.mode === 'dialog'){
      sceneAdvance(false);
    }else if(SCENE.mode === 'paused' && now - SCENE.lastReact > 1500 && SCENE.reactCount < 1){
      /* One START is an unpause. A second press while OCR catches up would
         land on the pause menu again (or start a new game), so wait for the
         mode to actually leave paused. */
      SCENE.lastReact = now;
      SCENE.reactCount++;
      sceneTap(sceneStartBtn(autoPilots[0]), autoPilots[0], 110, 'scene');
    }else if(SCENE.mode === 'gameover' && now - SCENE.lastReact > 1800 && SCENE.reactCount < 2){
      SCENE.lastReact = now;
      SCENE.reactCount++;
      sceneTap(sceneStartBtn(autoPilots[0]), autoPilots[0], 110, 'scene');
    }else if(SCENE.mode === 'menu' && /\bpress start\b/i.test(SCENE.text) && now - SCENE.lastReact > 1500 && SCENE.reactCount < 2){
      SCENE.lastReact = now;
      SCENE.reactCount++;
      sceneTap(sceneStartBtn(autoPilots[0]), autoPilots[0], 110, 'scene');
    }
  }
  function aiLabOpen(){
    var m = document.getElementById('ai-modal');
    return !!(m && !m.classList.contains('hidden'));
  }
  function sceneTick(){
    if(!playing || (!autoOn && !aiLabOpen())){
      if(SCENE.mode !== 'idle'){ SCENE.mode = 'idle'; SCENE.prev = null; updateSceneHud(); }
      return;
    }
    var g = frameGray();
    if(!g) return;
    var now = Date.now();
    var sf = captureSceneFrame();
    if(sf) SCENE.vision = sceneVision(sf, SCENE.vision);
    var mean = grayMean(g);
    var d = SCENE.prev ? grayDiff(g, SCENE.prev) : 0;
    var sh = SCENE.prev ? colShift(SCENE.prev, g) : 0;
    var shy = SCENE.prev ? rowShift(SCENE.prev, g) : 0;
    if(d >= Math.max(2, AgentOpts.loThresh) || Math.abs(sh) >= 2 || Math.abs(shy) >= 2) SCENE.lastMotionAt = now;
    SCENE.mean = mean;
    SCENE.motion = d;
    SCENE.sh = sh;
    SCENE.shy = shy;
    SCENE.stillMs = now - SCENE.lastMotionAt;
    SCENE.at = now;
    SCENE.prev = g;
    /* Passive audio tap: loud transients are hit/impact cues, while the
       running RMS tells us whether the game is silent (paused/loading). */
    var au = sampleAudio(now);
    if(au){
      if(au.impact || (au.peak > 0.06 && au.peak > (SCENE.audioPrev || 0) * 1.55)) SCENE.audioSpikeAt = now;
      SCENE.audioPrev = au.peak;
      SCENE.audio = au;
    }
    sceneClassify();
    if(now - (SCENE.hudAt || 0) > 450){ SCENE.hudAt = now; updateSceneHud(); }
    maybeOcr(now);
    sceneReact(now);
  }
  var sceneTimer = null;
  function startSceneLoop(){
    if(sceneTimer) return;
    SCENE.lastMotionAt = Date.now();
    SCENE.prev = null;
    sceneTimer = setInterval(sceneTick, SCENE_MS);
    sceneTick();
  }
  function stopSceneLoop(){
    if(sceneTimer){ clearInterval(sceneTimer); sceneTimer = null; }
    SCENE.prev = null;
    SCENE.mode = 'idle';
    updateSceneHud();
    updateAiStatus();
  }
  function activeProfile(){
    if(AgentOpts.profile === 'umk3' || AgentOpts.profile === 'mix') return AgentOpts.profile;
    if(SCENE.mode === 'fight' || sceneIsFighter()) return 'umk3';
    return 'generic';
  }
  window.SNESBoyScene = {
    state: function(){
      return { mode: SCENE.mode, why: SCENE.why, game: SCENE.game, screenTitle: SCENE.screenTitle,
        text: SCENE.text, words: SCENE.words, confidence: SCENE.conf, stillMs: SCENE.stillMs,
        motion: SCENE.motion, mean: SCENE.mean, sh: SCENE.sh, shy: SCENE.shy,
        ocr: OCR_STATE.status, ocrError: OCR_STATE.error, changedAt: SCENE.changedAt,
        screenTitleId: SCENE.screenTitleId, strongMenu: SCENE.strongMenu,
        lastPlayAt: SCENE.lastPlayAt, taps: SCENE.taps || 0, menuTaps: SCENE.menuTaps || 0,
        menuAborts: SCENE.menuAborts || 0, menuTicks: SCENE.menuTicks || 0,
        percept: SCENE.percept, audio: SCENE.audio, lastTap: SCENE.lastTap,
        vision: SCENE.vision ? {
          groundY: SCENE.vision.groundY, player: SCENE.vision.player,
          opponent: SCENE.vision.opponent, entities: SCENE.vision.entities.length,
          obstacleAhead: SCENE.vision.obstacleAhead, gapAhead: SCENE.vision.gapAhead,
          enemyAhead: SCENE.vision.enemyAhead, bars: SCENE.vision.bars,
          zones: SCENE.vision.zones, coverage: SCENE.vision.coverage
        } : null,
        zones: SCENE.zones, situation: SCENE.situation,
        pilot: autoPilots[0] ? { dir: autoPilots[0].dir, dirY: autoPilots[0].dirY,
          run: autoPilots[0].runBtn, mode: autoPilots[0].mode,
          lastPlan: autoPilots[0].lastPlan, lastOutcome: autoPilots[0].lastOutcome,
          expect: autoPilots[0].expect, planAt: autoPilots[0].planAt,
          jumpFailed: autoPilots[0].jumpFailed,
          watch: { stillMs: autoPilots[0].watch.stillMs, lastSh: autoPilots[0].watch.lastSh,
            haveData: autoPilots[0].watch.haveData } } : null };
    },
    read: function(){
      return ensureOcrWorker().then(function(w){ return w ? runOcrNow() : SCENE.text; });
    },
    classify: sceneClassify,
    analyzeCanvas: function(c){
      var f = captureSceneFrame(c);
      if(!f) return null;
      var v = sceneVision(f, null);
      return v ? { groundY: v.groundY, player: v.player, opponent: v.opponent,
        entities: v.entities, obstacleAhead: v.obstacleAhead, gapAhead: v.gapAhead,
        enemyAhead: v.enemyAhead, bars: v.bars, zones: v.zones,
        coverage: v.coverage, ground: v.ground, raw: v.raw, debug: v.debug } : null;
    }
  };

  /* One independent copilot per driven player — same screen, own brain.
     Every pilot works the menus (grid moves + confirm + START), senses and
     plays with its own rhythm, so P2 never just parrots P1. */
  var autoPilots = [];
  /* Every pilot owns its timers, motion history, steering vote and menu
     guard. There is no shared autoDir / autoDiff / screenWatch any more:
     P1 can seek, release and tap its menus while P2 keeps playing. */
  function makePilot(player, idx){
    var pt = { pl: player, active: true, menus: true, mode: 'seek', prev: null, hi: 0, lo: 0,
      menuN: 0, hopN: idx * 2, tick: 0, shN: 0, fphase: -1, mixFight: false,
      slot: idx, startUsed: false, startReadyAt: idx > 0 ? 1 : 2, lastStart: 0,
      dir: AgentMap.dirR, dirY: null, dirYMiss: 0, diff: 0,
      watch: makeWatch(), menuGuardFrame: null,
      timers: { menu: null, sense: null, drive: null },
      order: AgentMap.actions.slice(),
      learn: { score: {}, tries: {}, total: 0, pending: null, sig: '' } };
    applyManualToPilot(pt);
    return pt;
  }
  /* Re-arm exactly one START for a fresh menu screen/episode. P2 may start
     immediately (join); P1 waits one grid pass so it never starts on the
     default top-left cell. */
  function armStart(pt){
    pt.startUsed = false;
    pt.startReadyAt = pt.menuN + (pt.slot > 0 ? 1 : 2);
  }
  /* UMK3 fighter profile (built from the manual): RUN=R(11)+direction to
     close, BLOCK=L(10), crouch kick=DOWN+X/A, uppercut=DOWN+Y, spin moves=
     AWAY+kick, jump-ins=UP(+toward)+punch, specials are F,F / B,B / D,F /
     D,B + button strings. Per-pilot phase machine, phase-offset so P1/P2
     desync; facing is unknown so approach sides alternate. */
  var UMK3_STRIKES = [1, 0, 8, 9];
  /* Real special-move strings from the manual (pp.19-27). Button map is a
     documented approximation from pp.14-16: uppercut is DOWN+Y so HP=Y(1),
     crouch kicks are X/A so HK=A(8), LK=X(9), leaving LP=B(0); RN=11, BL=10.
     F/B are facing-relative and resolved to fwd/back at play time. */
  var UMK3_MOVEBOOK = [
    { name: 'Kano knife', seq: ['D','B',1] },
    { name: 'Reptile acid', seq: ['F','F',1] },
    { name: 'Cyrax net', seq: ['B','B',9] },
    { name: 'Liu Kang fireball', seq: ['F','F',1] },
    { name: 'Jax gotcha', seq: ['F','F',0] },
    { name: 'Kabal spin', seq: ['B','F',9] },
    { name: 'Shang skull', seq: ['B','B',1] },
    { name: 'Sektor missile', seq: ['F','F',0] },
    { name: 'Nightwolf arrow', seq: ['D','B',0] },
    { name: 'Kung Lao hat', seq: ['B','F',0] },
    { name: 'Kitana fan', seq: ['F','F',1] },
    { name: 'Scorpion spear', seq: ['B','B',0] },
    { name: 'Sonya ring', seq: ['D','F',0] },
    { name: 'Sub-Zero freeze', seq: ['D','F',0] },
    { name: 'Jade rang', seq: ['B','F',0] }
  ];
  function resolveMove(seq, fwd, back){
    return seq.map(function(t){
      if(t === 'F') return fwd;
      if(t === 'B') return back;
      if(t === 'D') return 5;
      if(t === 'U') return 4;
      return t;
    });
  }
  function fightRelease(pl){
    [4, 5, 6, 7, 10, 11].forEach(function(i){ driveIndex(i, false, 'auto', pl); });
  }
  function fightPulse(btn, pl, ms){
    driveIndex(btn, true, 'auto', pl);
    /* always release, even if the pilot was stopped mid-pulse: a skipped
       release would leave strike buttons (Y/X) stuck down */
    setTimeout(function(){ driveIndex(btn, false, 'auto', pl); }, ms || 140);
  }
  function fightTapSeq(steps, pl){
    var t = 0;
    steps.forEach(function(btn){
      setTimeout(function(){ if(autoOn) fightPulse(btn, pl, 120); }, t);
      t += 150;
    });
  }
  function fightTick(pt, idx){
    pt.tick++;
    var phase = Math.floor(pt.tick / 4 + idx * 3) % 6;
    var fwd = (Math.floor(pt.tick / 12 + idx) % 2 === 0) ? AgentMap.dirR : AgentMap.dirL;
    var back = (fwd === AgentMap.dirR) ? AgentMap.dirL : AgentMap.dirR;
    if(phase !== pt.fphase){
      fightRelease(pt.pl); /* never carry a hold across phases */
      pt.fphase = phase;
    }
    if(phase === 0){
      driveIndex(fwd, true, 'auto', pt.pl);
      driveIndex(pt.runBtn, true, 'auto', pt.pl); /* RUN + toward closes distance */
    }else if(phase === 1){
      var s = pt.strikes[(pt.tick + idx) % pt.strikes.length];
      fightPulse(s, pt.pl, 140);
      if(pt.tick % 2 === 0) fightPulse(pt.strikes[(pt.tick + idx + 1) % pt.strikes.length], pt.pl, 140);
    }else if(phase === 2){
      driveIndex(pt.blockBtn, true, 'auto', pt.pl); /* BLOCK, feet planted */
    }else if(phase === 3){
      driveIndex(5, true, 'auto', pt.pl); /* crouch game */
      fightPulse((pt.tick % 2 === 0) ? 1 : 9, pt.pl, 150); /* uppercut / low kick */
    }else if(phase === 4){
      driveIndex(4, true, 'auto', pt.pl);
      driveIndex(fwd, true, 'auto', pt.pl);
      setTimeout(function(){
        if(!autoOn) return;
        fightPulse(pt.strikes[(pt.tick + idx) % pt.strikes.length], pt.pl, 140);
        setTimeout(function(){ if(autoOn){ driveIndex(4, false, 'auto', pt.pl); } }, 200);
      }, 300);
    }else{
      var book = pt.movebook && pt.movebook.length ? pt.movebook : null;
      var mv = book ? book[(pt.tick + idx) % book.length] :
        { name: 'generic special', seq: ['D', 'F', pt.primaryBtn != null ? pt.primaryBtn : pt.strikes[0]] };
      fightTapSeq(resolveMove(mv.seq, fwd, back), pt.pl); /* per-game strings when parsed */
    }
  }
  /* ---------- deliberate playbooks -------------------------------------
     The playbooks below choose one action at a time and wait for its
     result instead of cycling every button. They read SCENE.percept
     (OCR prompts/tags/HUD) and the audio transient tap, so a strike,
     block or pin is a response to the game rather than a random pulse. */
  function planSnapshot(pt){
    var v = SCENE.vision || {}, bars = v.bars, sit = SCENE.situation || {};
    return { t: Date.now(), player: v.player ? { cx: v.player.cx, cy: v.player.cy } : null,
      still: pt.watch ? pt.watch.stillMs : 0, sh: SCENE.sh || 0,
      bars: bars ? { left: bars.left, right: bars.right } : null,
      audioT: SCENE.audioSpikeAt || 0, time: (SCENE.percept.hud || {}).time,
      proximity: sit.proximity };
  }
  function notePlan(pt, label, expect){
    pt.lastPlan = label || '';
    pt.lastOutcome = '';
    pt.expect = expect || label || '';
    pt.planAt = Date.now();
    pt.planSnap = planSnapshot(pt);
  }
  function readOutcome(pt, now){
    if(!pt.expect) return;
    if(now - (pt.planAt || 0) < 420) return;
    var s = pt.planSnap || {}, v = SCENE.vision || {}, sit = SCENE.situation || {};
    var bars = v.bars, player = v.player, ok = false, label = '';
    if(pt.expect === 'jump'){
      ok = !!(player && s.player && player.cy < s.player.cy - 0.8) ||
        (Math.abs(SCENE.sh || 0) >= 2 && Math.abs((SCENE.sh || 0) - (s.sh || 0)) >= 1) ||
        (s.still > 500 && pt.watch.stillMs < s.still - 220);
      label = ok ? 'cleared' : 'no lift';
      pt.jumpFailed = !ok;
    }else if(pt.expect === 'strike' || pt.expect === 'special' ||
             pt.expect === 'grapple' || pt.expect === 'pin'){
      ok = (SCENE.audioSpikeAt > (s.audioT || 0)) ||
        !!(bars && s.bars && bars.right < s.bars.right - 0.015) ||
        !!(bars && s.bars && bars.left < s.bars.left - 0.015) ||
        (sit.health && s.bars && sit.health.right < s.bars.right - 0.015);
      label = ok ? 'hit confirmed' : 'whiff';
      if(pt.expect === 'grapple' && sit.phase === 'pin-attempt'){ ok = true; label = 'grabbed'; }
    }else if(pt.expect === 'approach'){
      ok = !!(player && s.player && Math.abs(player.cx - s.player.cx) > 0.4) ||
        Math.abs(SCENE.sh || 0) >= 1 ||
        !!(sit.proximity != null && s.proximity != null && sit.proximity < s.proximity - 0.01);
      label = ok ? 'moved' : 'no movement';
    }else if(pt.expect === 'block'){
      ok = !(bars && s.bars && bars.left < s.bars.left - 0.02);
      label = ok ? 'guard held' : 'guard broken';
    }else{
      ok = !!(SCENE.audioSpikeAt > (s.audioT || 0)) || sit.phase !== 'running';
      label = ok ? 'worked' : 'no change';
    }
    pt.lastOutcome = label;
    pt.expect = '';
  }
  function combatInit(pt){
    if(!pt.combat) pt.combat = { phase: 'wait', until: 0, last: 0, lastAction: '', hitAt: 0, step: 0 };
    return pt.combat;
  }
  function combatRelease(pt){
    [4, 5, 6, 7].forEach(function(b){ driveIndex(b, false, 'auto', pt.pl); });
    driveIndex(AgentMap.run, false, 'auto', pt.pl);
    driveIndex(pt.blockBtn != null ? pt.blockBtn : 10, false, 'auto', pt.pl);
  }
  function combatHold(pt, btn, ms){
    if(btn == null) return;
    driveIndex(btn, true, 'auto', pt.pl);
    setTimeout(function(){ if(autoOn) driveIndex(btn, false, 'auto', pt.pl); }, ms || 260);
  }
  function combatStrike(pt, kind, now){
    var sem = pt.sem || {};
    var btn = kind === 'kick' ? (sem.kick != null ? sem.kick : 8) :
      (sem.punch != null ? sem.punch : 1);
    if(btn == null) btn = pt.strikes && pt.strikes.length ? pt.strikes[0] : 0;
    notePlan(pt, kind, 'strike');
    semanticPulse(pt, btn, 110);
    var c = combatInit(pt);
    c.strikeAt = now;
    c.lastAction = kind;
    c.until = now + 430;
  }
  function combatSpecial(pt, now, fwd, back){
    var c = combatInit(pt), sem = pt.sem || {};
    if(now - (c.specialAt || 0) < 4200) return false;
    var book = pt.movebook && pt.movebook.length ? pt.movebook : null;
    if(book){
      var mv = book[(c.moveIdx || 0) % book.length];
      c.moveIdx = (c.moveIdx || 0) + 1;
      notePlan(pt, mv.name || 'special', 'special');
      fightTapSeq(resolveMove(mv.seq, fwd, back), pt.pl);
      c.lastAction = mv.name;
      c.until = now + Math.max(700, mv.seq.length * 170 + 320);
      c.specialAt = now;
      return true;
    }
    var b = sem.specialMove != null ? sem.specialMove :
      (sem.special != null ? sem.special : null);
    if(b != null){
      notePlan(pt, 'special', 'special');
      semanticPulse(pt, b, 120);
      c.lastAction = 'special';
      c.until = now + 650;
      c.specialAt = now;
      return true;
    }
    return false;
  }
  function fighterTick(pt, idx){
    var now = Date.now(), c = combatInit(pt);
    pt.tick++;
    if(now < (c.until || 0)) return;
    var sem = pt.sem || {}, per = SCENE.percept || { tags: [] };
    var tags = per.tags || [], action = per.action || '', prompt = per.prompt || '';
    var sit = SCENE.situation || {};
    var fwd = c.faceRight === false ? AgentMap.dirL : AgentMap.dirR;
    var back = fwd === AgentMap.dirR ? AgentMap.dirL : AgentMap.dirR;
    combatRelease(pt);
    /* Audio after a strike is a hit-confirm: follow up once, then reset. */
    if(c.strikeAt && now - c.strikeAt < 650 && SCENE.audioSpikeAt > c.strikeAt){
      c.hitAt = SCENE.audioSpikeAt;
      c.strikeAt = 0;
      c.combo = 2;
    }
    if(prompt && prompt !== 'START' && prompt !== 'ANY'){
      var pmap = { A: 8, B: 0, X: 9, Y: 1, L: 10, R: 11, LEFT: 6, RIGHT: 7, UP: 4, DOWN: 5 };
      if(pmap[prompt] != null){ semanticPulse(pt, pmap[prompt], 120); c.until = now + 400; return; }
    }
    if(action === 'finisher' && combatSpecial(pt, now, fwd, back)) return;
    if(c.combo > 0){
      c.combo--;
      combatStrike(pt, c.combo % 2 ? 'kick' : 'punch', now);
      return;
    }
    var step = (c.step = (c.step || 0) + 1) % 10;
    if(sit.health && sit.health.low && step % 3 !== 2){
      var gb = sem.block != null ? sem.block : (pt.blockBtn != null ? pt.blockBtn : 10);
      notePlan(pt, 'guard low health', 'block');
      combatHold(pt, gb, 300);
      c.lastAction = 'guard low health';
      c.until = now + 620;
      pt.lastPlan = c.lastAction;
      return;
    }
    if(step === 0 || step === 1){
      if(sit.proximity != null && sit.proximity < 0.22){
        combatStrike(pt, 'punch', now);
        return;
      }
      notePlan(pt, 'approach', 'approach');
      combatHold(pt, fwd, 330);
      combatHold(pt, sem.run != null ? sem.run : AgentMap.run, 330);
      c.lastAction = 'approach';
      c.until = now + 520;
    }else if(step === 2 || step === 4 || step === 7){
      combatStrike(pt, (step === 4 ? 'kick' : 'punch'), now);
    }else if(step === 3 || step === 8){
      var bb = sem.block != null ? sem.block : (pt.blockBtn != null ? pt.blockBtn : 10);
      notePlan(pt, 'block', 'block');
      combatHold(pt, bb, 280);
      c.lastAction = 'block';
      c.until = now + 620;
    }else if(step === 5){
      if(!combatSpecial(pt, now, fwd, back)){
        combatStrike(pt, 'kick', now);
      }
    }else if(step === 6){
      notePlan(pt, 'jump-in', 'jump');
      combatHold(pt, 4, 210);
      combatHold(pt, fwd, 210);
      setTimeout(function(){
        if(autoOn && pt.mode === 'play') combatStrike(pt, 'punch', Date.now());
      }, 260);
      c.lastAction = 'jump-in';
      c.until = now + 720;
    }else{
      notePlan(pt, 'retreat', 'approach');
      combatHold(pt, back, 220);
      c.lastAction = 'retreat';
      c.until = now + 500;
      if((c.step || 0) % 30 === 0) c.faceRight = c.faceRight === false;
    }
    pt.lastPlan = c.lastAction;
  }
  function wrestlerTick(pt, idx){
    var now = Date.now(), c = combatInit(pt);
    pt.tick++;
    if(now < (c.until || 0)) return;
    var sem = pt.sem || {}, per = SCENE.percept || { tags: [] };
    var tags = per.tags || [], action = per.action || '', prompt = per.prompt || '';
    var sit = SCENE.situation || {};
    var fwd = c.faceRight === false ? AgentMap.dirL : AgentMap.dirR;
    combatRelease(pt);
    if(c.strikeAt && now - c.strikeAt < 650 && SCENE.audioSpikeAt > c.strikeAt){
      c.hitAt = SCENE.audioSpikeAt;
      c.strikeAt = 0;
      c.combo = 1;
    }
    if(prompt && prompt !== 'START' && prompt !== 'ANY'){
      var pmap = { A: 8, B: 0, X: 9, Y: 1, L: 10, R: 11, LEFT: 6, RIGHT: 7, UP: 4, DOWN: 5 };
      if(pmap[prompt] != null){ semanticPulse(pt, pmap[prompt], 120); c.until = now + 420; return; }
    }
    /* Being pinned or on the mat: fight the count before anything else. */
    if(action === 'escape' || (tags.indexOf('downed') !== -1 && /pin|count|kick out/i.test(SCENE.text || ''))){
      notePlan(pt, 'escape pin', 'block');
      semanticPulse(pt, AgentMap.dirL, 90);
      semanticPulse(pt, AgentMap.dirR, 90);
      semanticPulse(pt, sem.punch != null ? sem.punch : 0, 100);
      c.lastAction = 'escape pin';
      c.until = now + 380;
      return;
    }
    if(action === 'pin' || tags.indexOf('downed') !== -1){
      var pinBtn = sem.pin != null ? sem.pin : 9;
      notePlan(pt, 'pin', 'pin');
      semanticPulse(pt, pinBtn, 120);
      c.lastAction = 'pin';
      c.until = now + 700;
      return;
    }
    /* A lock-up is the one place the manual explicitly asks for repeated
       presses; keep it a short, bounded burst rather than constant mashing. */
    if(action === 'grapple' || /lock ?up/i.test(SCENE.text || '')){
      notePlan(pt, 'lock-up burst', 'grapple');
      var pb = sem.punch != null ? sem.punch : 0;
      var kb = sem.kick != null ? sem.kick : 8;
      for(var i = 0; i < 6; i++){
        (function(n, pl){
          setTimeout(function(){ if(autoOn && pt.mode === 'play') semanticPulse(pt, n % 2 ? kb : pb, 70); }, n * 95);
        })(i, pt.pl);
      }
      c.lastAction = 'lock-up burst';
      c.until = now + 720;
      return;
    }
    if(c.combo > 0){
      c.combo--;
      combatStrike(pt, 'kick', now);
      return;
    }
    var step = (c.step = (c.step || 0) + 1) % 10;
    if(step === 0 || step === 1){
      if(sit.proximity != null && sit.proximity < 0.20){
        var closeBtn = sem.grapple != null ? sem.grapple : 9;
        notePlan(pt, 'grapple in close', 'grapple');
        semanticPulse(pt, closeBtn, 120);
        c.lastAction = 'grapple in close';
        c.until = now + 620;
        pt.lastPlan = c.lastAction;
        return;
      }
      notePlan(pt, 'close distance', 'approach');
      combatHold(pt, fwd, 380);
      if(step === 1) combatHold(pt, sem.run != null ? sem.run : 1, 240);
      c.lastAction = 'close distance';
      c.until = now + 560;
    }else if(step === 2 || step === 4 || step === 7){
      combatStrike(pt, step === 4 ? 'kick' : 'punch', now);
    }else if(step === 3){
      var g = sem.grapple != null ? sem.grapple : 9;
      notePlan(pt, 'grapple', 'grapple');
      semanticPulse(pt, g, 120);
      c.lastAction = 'grapple';
      c.until = now + 620;
    }else if(step === 5){
      var sp = sem.specialMove != null ? sem.specialMove : (sem.special != null ? sem.special : 11);
      if(now - (c.specialAt || 0) > 5200){
        notePlan(pt, 'signature move', 'special');
        semanticPulse(pt, sp, 120);
        c.specialAt = now;
        c.lastAction = 'signature move';
        c.until = now + 820;
      }else{
        combatStrike(pt, 'punch', now);
      }
    }else if(step === 8){
      var tagBtn = sem.tag != null ? sem.tag : null;
      if(tagBtn != null){ notePlan(pt, 'tag', 'special'); semanticPulse(pt, tagBtn, 110); c.lastAction = 'tag'; }
      else combatStrike(pt, 'punch', now);
      c.until = now + 560;
    }else{
      notePlan(pt, 'reset position', 'approach');
      combatHold(pt, c.faceRight === false ? AgentMap.dirR : AgentMap.dirL, 190);
      c.lastAction = 'reset position';
      c.until = now + 500;
      if(step === 9) c.faceRight = c.faceRight === false;
    }
    pt.lastPlan = c.lastAction;
  }
  function pilotModes(){
    return autoPilots.map(function(pt){ return 'P' + (pt.pl + 1) + ':' + pt.mode.toUpperCase(); }).join(' ');
  }
  function updateAutoBtn(){
    var b = document.getElementById('btn-autopilot');
    if(b){
      b.textContent = autoOn ? ('⏸ AUTOPILOT: ON (' + pilotModes() + ')') : '▶ AUTOPILOT: OFF';
      b.classList.toggle('autopilot-on', autoOn);
    }
  }
  /* Short, spaced menu pulse: long enough for the menu to see it, short
     enough that consecutive dpad taps stay single steps (no diagonals). */
  function menuTap(pt, btn, delay, base, allowTransition){
    setTimeout(function(){
      if(!autoOn || !playing || !pt.active || pt.mode !== 'seek') return;
      /* A delayed menu tap must never land after the scene has moved on.
         START in particular is pause during live gameplay. */
      if(SCENE.mode !== 'menu') return;
      if(!SCENE.strongMenu && !allowTransition) return;
      /* If the screen has started scrolling since this burst began, the
         menu is gone — drop the rest of the burst instead of firing A/START
         into live gameplay (START would pause it). */
      if(base && !SCENE.strongMenu){
        var cur = frameGray();
        if(cur && (Math.abs(colShift(base, cur)) >= 2 ||
                   Math.abs(rowShift(base, cur)) >= 2)){ SCENE.menuAborts = (SCENE.menuAborts || 0) + 1; return; }
      }
      SCENE.menuTaps = (SCENE.menuTaps || 0) + 1;
      /* Wait for a fresh OCR read after advancing a menu. Without this the
         next screen (often an in-game title with its own HUD) is still
         classified from the previous menu's text and START gets hammered. */
      if(btn === sceneStartBtn(pt)){
        SCENE.holdUntilRead = true;
        SCENE.holdAt = Date.now();
        SCENE.lastFlowTap = Date.now();
      }
      noteWatchTap(pt, btn);
      driveIndex(btn, true, 'auto', pt.pl);
      setTimeout(function(){ driveIndex(btn, false, 'auto', pt.pl); }, 140);
    }, delay || 0);
  }
  function gridMenuStep(pt, idx){
    var base = frameGray(); /* burst baseline: abort when the world moves */
    var now = Date.now();
    var titleMenu = sceneTitleMenu();
    /* Title screens need START; SELECT GAME / CONTINUE / SAVE menus use
       A (confirm). START on a select screen is often "back", which is why
       the old cycle bounced forever between title and game-select. */
    if(titleMenu){
      if(!pt.startUsed){
        pt.startUsed = true;
        pt.lastStart = now;
        menuTap(pt, sceneStartBtn(pt), idx * 20, base);
      }
      return;
    }
    /* The default selection is already highlighted on most menus. Try
       START first: moving the cursor while START is pressed makes some
       games (Super Mario All-Stars) ignore the press. Only walk a grid
       after a couple of failed confirm attempts. */
    if(pt.menuN <= 2){
      menuTap(pt, sceneMenuButton(pt), idx * 140, base);
      return;
    }
    var pattern = MENU_GRID_MOVES[(pt.menuN + idx * 5) % MENU_GRID_MOVES.length];
    var delay = idx * 160; /* stagger pilots so their taps do not collide */
    pattern.forEach(function(btn){
      menuTap(pt, btn, delay, base);
      delay += 220;
    });
    /* Move the cursor first, let it settle, then advance. On the Game
       Select/file screens START confirms; A is reserved for an explicit
       "press A" prompt. */
    menuTap(pt, sceneMenuButton(pt), delay + 450, base);
  }
  function updateAgentHud(){
    var maxD = 0, dirs = '';
    autoPilots.forEach(function(pt){
      if(pt.diff > maxD) maxD = pt.diff;
      if(autoOn && pt.mode === 'play'){
        dirs += ' P' + (pt.pl + 1) + (pt.dir === AgentMap.dirL ? '◀' : '▶') +
          (pt.dirY === 4 ? '▲' : (pt.dirY === 5 ? '▼' : ''));
      }
    });
    var prof = activeProfile();
    var txt = (autoOn ? pilotModes() : 'OFF') + ' · d=' + maxD.toFixed(1) + dirs +
      (autoOn ? ' · ' + autoPilots.map(function(pt){ return 'P' + (pt.pl + 1); }).join('+') : '') +
      (autoOn && AgentOpts.autoTune ? ' · AT' : '') +
      (autoOn && MANUAL_STATE.current ? ' · MANUAL' : '') +
      (autoOn && prof === 'umk3' ? ' · FIGHT' : '') +
      (autoOn && prof === 'mix' ? ' · MIX' : '') +
      (autoOn && SCENE.mode !== 'idle' ? ' · ' + SCENE.mode.toUpperCase() : '');
    $all('.agent-hud').forEach(function(e){
      e.textContent = txt;
      e.classList.toggle('hidden', !AgentOpts.hud);
    });
    var hb = document.getElementById('btn-hud');
    if(hb) hb.textContent = AgentOpts.hud ? 'HUD: ON' : 'HUD: OFF';
  }
  function sceneSense(pt){
    if(!autoOn || !playing || SCENE.mode === 'idle') return;
    if(SCENE.mode === 'play' || SCENE.mode === 'fight'){
      if(pt.mode !== 'play'){ pt.mode = 'play'; updateAutoBtn(); }
    }else if(pt.mode !== 'seek'){
      pt.mode = 'seek'; armStart(pt); releasePilot(pt.pl); updateAutoBtn();
    }
  }
  function sensePilot(pt, g){
    if(!g || !pt.prev){ pt.prev = g; return 0; }
    var d = grayDiff(g, pt.prev);
    pt.prev = g;
    pt.lastD = d;
    if(d > AgentOpts.hiThresh){
      pt.hi++; pt.lo = 0;
      if(pt.hi >= AgentOpts.hiStreak && pt.mode !== 'play'){ pt.mode = 'play'; updateAutoBtn(); }
    }else if(d < AgentOpts.loThresh){
      pt.lo++; pt.hi = 0;
      if(pt.lo >= AgentOpts.loStreak && pt.mode !== 'seek'){
        pt.mode = 'seek';
        armStart(pt); /* new episode: allow one START again */
        releasePilot(pt.pl); updateAutoBtn();
      }
    }else{ pt.hi = 0; pt.lo = 0; }
    return d;
  }
  function agentMenuTick(pt){
    if(!autoOn || !playing || !pt.active) return;
    if(SCENE.mode === 'dialog'){ sceneAdvance(false); return; }
    if(SCENE.mode === 'paused' || SCENE.mode === 'gameover' || SCENE.mode === 'black' ||
       SCENE.mode === 'reading') return;
    if(SCENE.mode === 'play' || SCENE.mode === 'fight' || SCENE.mode === 'idle') return;
    var nowFrame = frameGray();
    /* The next menu screen may be too garbled to OCR (in-game title art,
       animated file select). Keep advancing the chain with one spaced START
       per screen, but pause until OCR has read each new screen. */
    if(SCENE.mode === 'menu' && !SCENE.strongMenu){
      if(SCENE.holdUntilRead || pt.slot !== 0) return;
      if(Date.now() - (SCENE.lastFlowTap || 0) < 3500) return;
      if((SCENE.flowTaps || 0) >= 4) return;
      SCENE.flowTaps = (SCENE.flowTaps || 0) + 1;
      menuTap(pt, sceneStartBtn(pt), 0, nowFrame, true);
      return;
    }
    var newScreen = false;
    if(pt.menuGuardFrame && nowFrame){
      /* Between this pilot's menu ticks the world started scrolling →
         gameplay is already running. Do not fire another A/START burst
         into it. The other pilot has its own guard and keeps its rhythm. */
      if(Math.abs(colShift(pt.menuGuardFrame, nowFrame)) >= 2 ||
         Math.abs(rowShift(pt.menuGuardFrame, nowFrame)) >= 2){
        pt.menuGuardFrame = nowFrame;
        return;
      }
      /* A large static change means this is a different menu screen, so
         re-arm exactly one START for this pilot. Cursor moves are tiny and
         stay under this threshold. */
      var dsum = 0, i;
      for(i = 0; i < nowFrame.length; i++){
        var dd = nowFrame[i] - pt.menuGuardFrame[i];
        dsum += dd < 0 ? -dd : dd;
      }
      newScreen = (dsum / nowFrame.length) > 10;
    }
    pt.menuGuardFrame = nowFrame;
    if(newScreen){ armStart(pt); pt.menuTries = 0; }
    if(pt.mode !== 'seek' || !pt.menus) return;
    SCENE.menuTicks = (SCENE.menuTicks || 0) + 1;
    pt.menuN++;
    pt.menuTries = (pt.menuTries || 0) + 1;
    /* A menu that never changes after a full grid pass plus START/A is not
       a menu we can solve. Stop hammering it instead of looping forever. */
    if(pt.menuTries > 10) return;
    if(pt.menuTries > 5){
      var base = nowFrame;
      if(!pt.startUsed){ pt.startUsed = true; menuTap(pt, sceneMenuButton(pt), 0, base); }
      else menuTap(pt, sceneMenuButton(pt), 0, base);
      return;
    }
    gridMenuStep(pt, pt.slot);
  }
  function agentSenseTick(pt){
    if(!autoOn || !playing || !pt.active){ pt.prev = null; return; }
    var g = frameGray();
    if(!g) return;
    if(grayMean(g) < AgentOpts.blackMean){
      /* black transition / fade-out: only this pilot heals and releases */
      pt.prev = g; pt.hi = 0; pt.lo = 0; pt.diff = 0;
      if(pt.mode !== 'seek'){ pt.mode = 'seek'; armStart(pt); }
      releasePilot(pt.pl);
      updateAutoBtn(); updateAgentHud(); updateScreenWatch();
      return;
    }
    if(!pt.prev){ pt.prev = g; return; }
    var sh = colShift(pt.prev, g);
    var shy = rowShift(pt.prev, g);
    var d = sensePilot(pt, g);
    sceneSense(pt);
    if(sh >= 2) pt.dir = AgentMap.dirR;
    else if(sh <= -2) pt.dir = AgentMap.dirL;
    /* Scroll is zero at either screen edge. If the player is pinned at the
       left edge (the castle/pipe case), do not keep holding LEFT forever;
       turn around instead of reporting a permanent stall. */
    else if(SCENE.vision && SCENE.vision.player &&
            SCENE.vision.player.cx < SCENE.vision.w * 0.19 &&
            (pt.watch.stillMs > 500 || pt.dir === AgentMap.dirL)){
      pt.dir = AgentMap.dirR;
    }
    if(shy >= 2){ pt.dirY = 5; pt.dirYMiss = 0; }
    else if(shy <= -2){ pt.dirY = 4; pt.dirYMiss = 0; }
    else if(pt.dirY !== null && ++pt.dirYMiss >= 2){ pt.dirY = null; pt.dirYMiss = 0; }
    pt.diff = d;
    rewardPlayAction(pt, d, sh, shy);
    watchMetrics(pt, d, sh, shy);
    /* one shared tuner reads pilot 0; it never touches another pilot's
       steering or release path */
    if(pt.slot === 0) antonGovern(pt, d);
    updateAgentHud();
    updateScreenWatch();
  }
  function platformerTick(pt, idx){
    pt.tick++;
    var now = Date.now(), c = combatInit(pt), sem = pt.sem || {};
    var per = SCENE.percept || { tags: [], prompt: '', action: '' };
    var sit = SCENE.situation || {};
    /* release the opposite direction first: if the scroll vote flipped,
       the old hold would otherwise stay latched (L+R stuck) */
    driveIndex(pt.dir === AgentMap.dirL ? AgentMap.dirR : AgentMap.dirL, false, 'auto', pt.pl);
    driveIndex(pt.dir, true, 'auto', pt.pl);
    var wantsRun = pt.runKnown && (!pt.watch.haveData || pt.diff > AgentOpts.loThresh ||
      Math.abs(pt.watch.lastSh) >= 2 || Math.abs(pt.watch.lastShy) >= 2);
    pt.watch.runWanted = wantsRun;
    driveIndex(pt.runBtn, wantsRun, 'auto', pt.pl);
    if(pt.dirY !== null){
      driveIndex(pt.dirY === 4 ? 5 : 4, false, 'auto', pt.pl);
      driveIndex(pt.dirY, true, 'auto', pt.pl);
    }else{
      driveIndex(4, false, 'auto', pt.pl);
      driveIndex(5, false, 'auto', pt.pl);
      if(pt.tick % 12 === 11){
        /* no vertical scroll: one exploratory nudge, not a held stick */
        var vn = ((pt.tick >> 4) % 2 === 0) ? 5 : 4;
        semanticPulse(pt, vn, AgentOpts.hopPulseMs);
      }
    }
    /* Jump when the level actually stops advancing, or after a long open
       run. This replaces the old 360 ms random-hop and shoulder mashing. */
    var stalled = pt.watch.haveData && pt.watch.stillMs > 650 &&
      Math.abs(pt.watch.lastSh || 0) < 2;
    /* Only jump on a vision-confirmed gap for now. A foreground block or
       hill is not necessarily a wall, and reacting to every "obstacle"
       made the pilot hop into pits. Stall/cadence remains the safe rhythm
       until the gap detector is proven live. */
    var gapDanger = !!sit.gap && !sit.airborne;
    var enemyDanger = !!sit.enemy && !sit.airborne;
    var gapDue = now - (c.lastJump || 0) > (pt.playbook === 'dkc' ? 900 : 1050);
    var jumpBtn = sem.jump != null ? sem.jump : (pt.primaryBtn != null ? pt.primaryBtn : 0);
    if(now > (c.jumpUntil || 0) && (stalled || gapDanger || enemyDanger || gapDue)){
      var full = stalled || sit.phase === 'blocked' || sit.gap || pt.jumpFailed;
      var hold = full ? (pt.jumpFailed ? 470 : 400) : AgentOpts.hopPulseMs;
      notePlan(pt, sit.gap ? 'jump gap' : sit.enemy ? 'jump enemy' :
        sit.obstacle ? 'jump obstacle' : stalled ? 'jump over obstacle' : 'jump', 'jump');
      semanticPulse(pt, jumpBtn, hold);
      c.lastJump = now;
      c.jumpUntil = now + (full ? 720 : 560);
      c.lastAction = sit.gap ? 'jump gap' : sit.enemy ? 'jump enemy' :
        sit.obstacle ? 'jump obstacle' : stalled ? 'jump over obstacle' : 'jump gap';
    }
    /* If vision says blocked but the level is not scrolling, change the
       approach instead of hopping in place forever. */
    if(sit.phase === 'blocked' && now - (c.lastNudge || 0) > 1500){
      notePlan(pt, 'back off obstacle', 'approach');
      var backBtn = pt.dir === AgentMap.dirL ? AgentMap.dirR : AgentMap.dirL;
      if(sit.player && sit.groundY != null && sit.player.x < 24) backBtn = AgentMap.dirR;
      driveIndex(pt.dir, false, 'auto', pt.pl);
      semanticPulse(pt, backBtn, 190);
      c.lastNudge = now;
      c.lastAction = 'back off obstacle';
      c.until = now + 460;
    }
    /* Genre actions are now paced and purposeful instead of random picks. */
    if(pt.kind === 'shooter' && sem.shoot != null && now - (c.lastShot || 0) > 620){
      notePlan(pt, 'fire', 'strike');
      semanticPulse(pt, sem.shoot, 110);
      c.lastShot = now;
      c.lastAction = 'fire';
    }else if(pt.kind === 'sports' && now - (c.lastShot || 0) > 760){
      var sb = sem.pass != null ? sem.pass : (sem.tackle != null ? sem.tackle :
        (pt.primaryBtn != null ? pt.primaryBtn : pt.order[0]));
      if(sb != null){ notePlan(pt, 'play action', 'strike'); semanticPulse(pt, sb, 110); c.lastShot = now; c.lastAction = 'play action'; }
    }
    pt.lastPlan = c.lastAction || 'run right';
  }
  /* Games whose manuals describe a non-platformer control scheme get a
     small semantic loop instead of forcing Mario-style hops onto them. The
     button meanings still come from that game's manual, not a title list. */
  function semanticPulse(pt, btn, ms){
    if(!autoOn || !playing || btn == null) return;
    driveIndex(btn, true, 'auto', pt.pl);
    setTimeout(function(){ if(autoOn) driveIndex(btn, false, 'auto', pt.pl); }, ms || 140);
  }
  function generalTick(pt, idx){
    var sem = pt.sem || {};
    pt.tick++;
    if(pt.kind === 'puzzle' || pt.kind === 'strategy'){
      var act = sem.rotate != null ? sem.rotate : pt.primaryBtn;
      if(act != null && pt.tick % 3 === 0) semanticPulse(pt, act, 120);
      if(sem.drop != null && pt.tick % 8 === 0) semanticPulse(pt, sem.drop, 120);
      if(pt.kind === 'strategy' && sem.confirm != null && pt.tick % 10 === 0) semanticPulse(pt, sem.confirm, 100);
      return;
    }
    if(pt.kind === 'racer'){
      var accel = sem.accelerate != null ? sem.accelerate : (pt.runKnown ? pt.runBtn : null);
      if(accel != null) driveIndex(accel, true, 'auto', pt.pl);
      driveIndex(pt.dir, true, 'auto', pt.pl);
      if(sem.brake != null && pt.tick % 12 === 0) semanticPulse(pt, sem.brake, 120);
      return;
    }
    /* Shooters and sports still move like a platformer; their manual's
       primary action is pulsed by platformerTick's own rhythm. */
    platformerTick(pt, idx);
  }
  /* Mix: alternate ~2.4s platformer blocks with ~2.4s UMK3 fighter blocks.
     Each boundary releases the other profile's holds so run/dash, directions,
     block and strike timers never stay latched across modes. Pilots are
     phase-offset, so P2 is not always in the same block as P1. */
  function mixTick(pt, idx){
    var wantFight = Math.floor((pt.tick + idx * 3) / 8) % 2 === 1;
    if(wantFight !== pt.mixFight){
      if(wantFight){
        driveIndex(AgentMap.run, false, 'auto', pt.pl);
        [4, 5, 6, 7].forEach(function(i){ driveIndex(i, false, 'auto', pt.pl); });
      }else{
        fightRelease(pt.pl);
        driveIndex(AgentMap.run, false, 'auto', pt.pl);
      }
      pt.mixFight = wantFight;
    }
    if(wantFight) fightTick(pt, idx);
    else platformerTick(pt, idx);
  }
  function agentDriveTick(pt){
    if(!autoOn || !playing || !pt.active) return;
    if(pt.mode !== 'play') return; /* menus get taps only — held buttons would fight navigation */
    readOutcome(pt, Date.now());
    var prof = AgentOpts.profile;
    if(prof === 'mix'){ mixTick(pt, pt.slot); return; }
    if(prof === 'umk3'){ fightTick(pt, pt.slot); return; }
    if(pt.playbook === 'mk' || pt.playbook === 'fighter' || pt.kind === 'fighter'){
      fighterTick(pt, pt.slot); return;
    }
    if(pt.playbook === 'wrestler' || pt.kind === 'wrestler'){
      wrestlerTick(pt, pt.slot); return;
    }
    if(pt.playbook === 'platformer' || pt.playbook === 'dkc' ||
       pt.kind === 'platformer' || pt.kind === 'generic' ||
       pt.kind === 'shooter' || pt.kind === 'sports'){
      platformerTick(pt, pt.slot); return;
    }
    generalTick(pt, pt.slot);
  }
  /* Each pilot gets its own three intervals. Stopping or retiming one has no
     effect on the other; callbacks only ever drive pt.pl. */
  function clearPilotTimer(pt, kind){
    var id = pt.timers[kind];
    if(id){ clearTimeout(id); clearInterval(id); pt.timers[kind] = null; }
  }
  function stopPilotTimers(pt, dead){
    ['menu', 'sense', 'drive'].forEach(function(k){ clearPilotTimer(pt, k); });
    if(dead) pt.active = false;
  }
  function armPilotTimer(pt, kind, ms, delay){
    clearPilotTimer(pt, kind);
    var fn = function(){
      if(!pt.active || !autoOn) return;
      if(kind === 'menu') agentMenuTick(pt);
      else if(kind === 'sense') agentSenseTick(pt);
      else agentDriveTick(pt);
    };
    pt.timers[kind] = setTimeout(function(){
      pt.timers[kind] = null;
      if(!pt.active || !autoOn) return;
      fn();
      if(pt.active && autoOn) pt.timers[kind] = setInterval(fn, ms);
    }, delay || 0);
  }
  function pilotPhase(pt, kind){
    /* stagger the pilots so their sense/menu/drive beats are not the same
       event-loop turn. P1 and P2 then cross SEEK/PLAY and menus on their
       own clocks instead of moving as one. */
    var off = pt.slot * 240;
    if(kind === 'sense') off += 90;
    else if(kind === 'drive') off += 160;
    return off;
  }
  function startPilotTimers(pt){
    armPilotTimer(pt, 'menu', AgentOpts.tapMs, pilotPhase(pt, 'menu'));
    armPilotTimer(pt, 'sense', AgentOpts.senseMs, pilotPhase(pt, 'sense'));
    armPilotTimer(pt, 'drive', AgentOpts.driveMs, pilotPhase(pt, 'drive'));
  }
  function anyAgentTimer(kind){
    for(var i = 0; i < autoPilots.length; i++){
      if(autoPilots[i].timers && autoPilots[i].timers[kind]) return true;
    }
    return false;
  }
  function stopAgentTimers(){
    autoPilots.forEach(function(pt){ stopPilotTimers(pt, true); });
  }
  function startAgentTimers(){
    autoPilots.forEach(startPilotTimers);
  }
  /* Retime exactly one running loop on every pilot; no release, no pilot
     reset, no pause. The next tick simply uses the new interval. */
  function retimeAgentLoop(which){
    if(!autoOn) return;
    autoPilots.forEach(function(pt){
      if(which === 'menu') armPilotTimer(pt, 'menu', AgentOpts.tapMs, pilotPhase(pt, 'menu'));
      else if(which === 'sense') armPilotTimer(pt, 'sense', AgentOpts.senseMs, pilotPhase(pt, 'sense'));
      else if(which === 'drive') armPilotTimer(pt, 'drive', AgentOpts.driveMs, pilotPhase(pt, 'drive'));
    });
    updateAiStatus();
  }
  function startAgentEngine(){
    parseSeekCycle();
    stopAgentTimers();
    releaseAuto(); /* old roster's holds must not survive a rebuild */
    autoPilots = autoPlayers().map(function(pl, i){ return makePilot(pl, i); });
    startAgentTimers();
    /* rebuilds happen from roster changes too: keep the button/HUD in sync
       with the new pilot roster immediately, not on the next sense tick */
    updateAutoBtn();
    updateAgentHud();
    updateScreenWatch();
  }
  /* Son of Anton screen watcher + live governor.
     Every sense tick we measure what the picture is doing — motion, how
     long it has been still, which way it scrolls, and whether the last
     seek tap actually changed it — then adjust the controls that are
     already running: steering, RUN, hop cadence, seek tap choice, and the
     SEEK/PLAY thresholds. All changes stay inside the tune-grid clamps and
     are reported in #anton-live / #anton-watch. */
  var antonHist = [], antonLastModes = '', antonCool = 0;
  var antonSeekStuck = 0, antonPlayStall = 0;
  function makeWatch(){
    return {
      motionEma: 0, motionPeak: 0, lastMotionAt: Date.now(), stillMs: 0,
      lastSh: 0, lastShy: 0, progressEma: 0, haveData: false,
      lastTap: null, tapScore: {}, lastTapInfo: '', runWanted: true
    };
  }
  function antonSay(msg){
    var e = document.getElementById('anton-live');
    if(e) e.textContent = 'SON OF ANTON · ' + msg;
  }
  function watchReset(){
    autoPilots.forEach(function(pt){
      pt.watch = makeWatch();
      pt.watch.lastMotionAt = Date.now();
    });
    updateScreenWatch();
  }
  function scrollLabel(sh, shy){
    var out = '';
    if(sh >= 2) out += 'R' + Math.abs(sh);
    else if(sh <= -2) out += 'L' + Math.abs(sh);
    if(shy >= 2) out += (out ? ' ' : '') + 'D' + Math.abs(shy);
    else if(shy <= -2) out += (out ? ' ' : '') + 'U' + Math.abs(shy);
    return out || 'still';
  }
  function updateScreenWatch(){
    updateManualLearn();
    var e = document.getElementById('anton-watch');
    if(!e) return;
    if(!AgentOpts.autoTune){ e.textContent = 'SON OF ANTON · screen watch off — manual tuning only'; return; }
    if(!autoOn){ e.textContent = 'SON OF ANTON · screen watch idle — autopilot off'; return; }
    var parts = autoPilots.map(function(pt){
      var w = pt.watch;
      return 'P' + (pt.pl + 1) + ' ' + pt.mode.toUpperCase() +
        ' m' + w.motionEma.toFixed(1) +
        ' still ' + (w.stillMs / 1000).toFixed(1) + 's ' +
        scrollLabel(w.lastSh, w.lastShy) +
        (w.lastTapInfo ? ' ' + w.lastTapInfo : '');
    });
    parts.push('hop ' + AgentOpts.hopEvery);
    parts.push('run ' + autoPilots.map(function(pt){
      return 'P' + (pt.pl + 1) + (pt.watch.runWanted ? ':on' : ':off');
    }).join(' '));
    e.textContent = 'SON OF ANTON · watching: ' + parts.join(' · ');
  }
  function watchMetrics(pt, dMax, sh, shy){
    var now = Date.now();
    var w = pt.watch;
    var motion = dMax || 0;
    w.haveData = true;
    w.motionEma = w.motionEma ? w.motionEma * 0.65 + motion * 0.35 : motion;
    if(motion > w.motionPeak) w.motionPeak = motion;
    if(motion >= AgentOpts.hiThresh) w.lastMotionAt = now;
    w.stillMs = now - w.lastMotionAt;
    w.lastSh = sh || 0;
    w.lastShy = shy || 0;
    var prog = Math.max(Math.abs(sh || 0), Math.abs(shy || 0));
    w.progressEma = w.progressEma ? w.progressEma * 0.7 + prog * 0.3 : prog;
    /* credit or blame this pilot's last seek tap only */
    if(w.lastTap && now - w.lastTap.t >= AgentOpts.senseMs){
      var tap = w.lastTap;
      var changed = w.motionPeak >= Math.max(AgentOpts.loThresh, 1.5);
      var score = w.tapScore[tap.btn] || 0;
      w.tapScore[tap.btn] = Math.max(-5, Math.min(10, score + (changed ? 1.5 : -1)));
      w.lastTapInfo = 'tap ' + (BTN_NAMES[tap.btn] || tap.btn) + (changed ? ' ✓' : ' ✗');
      w.lastTap = null;
    }
  }
  function noteWatchTap(pt, btn){
    pt.watch.lastTap = { btn: btn, t: Date.now() };
    pt.watch.motionPeak = 0;
    pt.watch.lastTapInfo = 'tap ' + (BTN_NAMES[btn] || btn) + '…';
  }
  function pickSeekTap(pt){
    var idx = pt.menuN % autoCycle.length;
    var def = autoCycle[idx];
    var w = pt.watch;
    if(!AgentOpts.autoTune || w.stillMs < Math.max(3000, AgentOpts.tapMs)) return def;
    var best = def, bestScore = -Infinity;
    for(var i = 0; i < autoCycle.length; i++){
      var cand = autoCycle[i];
      var score = (w.tapScore[cand] || 0) - (i === idx ? 0.01 : 0);
      if(score > bestScore){ bestScore = score; best = cand; }
    }
    /* everything failed so far: break the loop by advancing the rotation */
    return bestScore < 0 ? autoCycle[(idx + 1) % autoCycle.length] : best;
  }
  function antonGovern(pt, dMax){
    if(!AgentOpts.autoTune || !autoOn || !playing || !pt.active) return;
    var w = pt.watch;
    var modes = 'P' + (pt.pl + 1) + ':' + pt.mode;
    if(modes !== antonLastModes){ antonHist.push(1); antonLastModes = modes; }
    else antonHist.push(0);
    if(antonHist.length > 8) antonHist.shift();
    if(antonCool > 0){ antonCool--; return; }
    var flips = 0, i;
    for(i = 0; i < antonHist.length; i++) flips += antonHist[i];
    if(flips >= 3 && antonHist.length >= 6){
      AgentOpts.hiThresh = Math.min(40, Math.round((AgentOpts.hiThresh + 1) * 2) / 2);
      AgentOpts.loThresh = Math.max(0.5, Math.round((AgentOpts.loThresh - 0.5) * 2) / 2);
      antonHist = []; antonCool = 4;
      saveAgentOpts(); renderTuneInputs();
      antonSay('flapping — widened deadband (motion>' + AgentOpts.hiThresh + ' still<' + AgentOpts.loThresh + ')');
      return;
    }
    if(pt.mode !== 'play'){
      antonSeekStuck++; antonPlayStall = 0;
      /* picture has not moved through several tap cycles: rotate the tap
         order and make the motion bar easier, because this is a dead end */
      if(antonSeekStuck >= 8 && w.stillMs >= Math.max(4000, AgentOpts.tapMs)){
        var before = AgentOpts.hiThresh;
        AgentOpts.hiThresh = Math.max(3, Math.round((AgentOpts.hiThresh - 1) * 2) / 2);
        if(autoCycle.length > 1){
          autoCycle.push(autoCycle.shift());
          AgentOpts.seekCycle = autoCycle.join(',');
        }
        antonSeekStuck = 0; antonCool = 4;
        saveAgentOpts(); renderTuneInputs();
        antonSay('P' + (pt.pl + 1) + ' screen still ' + (w.stillMs / 1000).toFixed(1) +
          's — rotated seek taps, motion bar ' + before + '→' + AgentOpts.hiThresh);
        return;
      }
      if(antonSeekStuck >= 12){
        AgentOpts.hiThresh = Math.max(3, Math.round((AgentOpts.hiThresh - 1) * 2) / 2);
        antonSeekStuck = 0; antonCool = 4;
        saveAgentOpts(); renderTuneInputs();
        antonSay('P' + (pt.pl + 1) + ' stuck in menus — lowered motion bar to ' + AgentOpts.hiThresh);
      }
      return;
    }
    antonSeekStuck = 0;
    var scrollMag = Math.max(Math.abs(w.lastSh), Math.abs(w.lastShy));
    if(dMax < AgentOpts.hiThresh || scrollMag < 2){
      /* screen animates or not, the world is not scrolling: hop more */
      antonPlayStall++;
      if(antonPlayStall >= 8){
        AgentOpts.hopEvery = Math.max(1, AgentOpts.hopEvery - 1);
        antonPlayStall = 0; antonCool = 4;
        saveAgentOpts(); renderTuneInputs();
        antonSay('no screen progress — hopping every ' + AgentOpts.hopEvery + ' beats');
      }
    }else{
      antonPlayStall = 0;
      /* steady scroll means the hold is working: spend fewer beats hopping */
      if(w.progressEma >= 3 && AgentOpts.hopEvery < 4){
        AgentOpts.hopEvery = Math.min(4, AgentOpts.hopEvery + 1);
        antonCool = 10;
        saveAgentOpts(); renderTuneInputs();
        antonSay('steady scroll ' + w.progressEma.toFixed(1) +
          ' — hopping every ' + AgentOpts.hopEvery + ' beats');
      }
    }
  }
  function toggleAutotune(){
    AgentOpts.autoTune = !AgentOpts.autoTune;
    saveAgentOpts(); renderTuneInputs();
    antonSay(AgentOpts.autoTune ? 'watching the copilot…' : 'off — manual tuning only');
    updateScreenWatch();
  }
  function startAutopilot(){
    if(autoOn) return;
    autoOn = true;
    antonHist = []; antonLastModes = ''; antonCool = 0;
    antonSeekStuck = 0; antonPlayStall = 0;
    if(AgentOpts.autoTune) antonSay('watching the copilot…');
    if(!playing) powerOn();
    startAgentEngine();
    startSceneLoop();
    ensureOcrWorker().catch(function(){});
    updateAutoBtn(); updateAgentHud();
  }
  function stopAutopilot(){
    autoOn = false;
    if(aiLabOpen()) startSceneLoop(); else stopSceneLoop();
    stopAgentTimers();
    autoPilots = [];
    releaseAuto();
    updateAutoBtn(); updateAgentHud(); updateScreenWatch();
  }
  function toggleAutopilot(){ if(autoOn) stopAutopilot(); else startAutopilot(); }
  function toggleHud(){ AgentOpts.hud = !AgentOpts.hud; saveAgentOpts(); updateAgentHud(); }

  /* ---------- tune the brain (AI Lab inputs) ---------- */
  var TuneFields = [
    ['senseMs', 500, 5000], ['tapMs', 2000, 10000], ['hiThresh', 1, 40],
    ['loThresh', 0.5, 20], ['hopEvery', 1, 10]
  ];
  function renderTuneInputs(){
    TuneFields.forEach(function(f){
      var el = document.getElementById('opt-' + f[0]);
      if(el) el.value = AgentOpts[f[0]];
    });
    var cy = document.getElementById('opt-seekCycle');
    if(cy) cy.value = AgentOpts.seekCycle;
    var ps = document.getElementById('opt-players');
    if(ps) ps.value = (AgentOpts.players || [0]).join(',');
    var at = document.getElementById('btn-autotune');
    if(at) at.textContent = 'AUTO-TUNE: ' + (AgentOpts.autoTune ? 'ON' : 'OFF');
    var pf = document.getElementById('opt-profile');
    if(pf) pf.value = (AgentOpts.profile === 'umk3') ? 'umk3' : (AgentOpts.profile === 'mix' ? 'mix' : 'generic');
    var map = document.getElementById('agent-map-readout');
    if(map) map.textContent = 'map: dirR=' + AgentMap.dirR + ' dirL=' + AgentMap.dirL +
      ' run=' + AgentMap.run + ' actions=[' + AgentMap.actions.join(',') +
      '] shoulders=[' + AgentMap.shoulders.join(',') +
      '] select=' + AgentMap.select + ' start=' + AgentMap.start;
  }
  function resetAgentOpts(){
    var oldPlayers = (AgentOpts.players || []).join(',');
    AgentOpts = Object.assign({}, AgentDefaults);
    saveAgentOpts(); renderTuneInputs();
    watchReset();
    if(autoOn){
      /* only the roster needs a pilot rebuild; everything else is live */
      if((AgentOpts.players || []).join(',') !== oldPlayers) startAgentEngine();
      else { parseSeekCycle(); retimeAgentLoop('menu'); retimeAgentLoop('sense'); }
    }
    updateAgentHud();
  }

  /* ---------- Son of Anton: report-only code health (never modifies files) ---------- */
  var ANTON_SOURCES = ['index.html', 'style.css', 'script.js', 'ai/son-of-anton.js'];
  function runAntonScan(){
    var box = document.getElementById('anton-results');
    if(box) box.innerHTML = '<p class="modal-desc">Scanning…</p>';
    if(typeof window.SonOfAnton === 'undefined'){
      if(box) box.innerHTML = '<p class="modal-desc">Analyzer failed to load.</p>';
      return;
    }
    var anton = new window.SonOfAnton();
    var jobs = ANTON_SOURCES.map(function(name){
      return fetch(name).then(function(r){
        if(!r.ok) throw new Error(name + ' HTTP ' + r.status);
        return r.text().then(function(text){ return { name: name, content: text }; });
      }).catch(function(){ return { name: name, content: '', error: true }; });
    });
    Promise.all(jobs).then(function(sources){
      var rows = anton.analyzeAll(sources.filter(function(s){ return !s.error; }));
      if(!box) return;
      box.innerHTML = '';
      if(!rows.length){ box.innerHTML = '<p class="modal-desc">No sources readable.</p>'; return; }
      rows.forEach(function(r){
        var item = document.createElement('div'); item.className = 'rom-list-item';
        var nm = document.createElement('div'); nm.className = 'rom-name';
        nm.textContent = r.name + ' — ' + r.score.toFixed(2) + ' ' + r.verdict +
          ' (' + r.lines + ' lines, ' + r.commentLines + ' comments, ' + r.logStatements + ' logs)';
        item.appendChild(nm); box.appendChild(item);
      });
    });
  }

  /* Readable WebGL: the emulator's canvas is created WITHOUT
     preserveDrawingBuffer, so 2D readback returns pure black and all
     vision (sense loop + recorder) goes blind (d=0.0 forever). Force the
     flag on every WebGL context at creation — before the loader runs. */
  (function patchGL(){
    try{
      var proto = window.HTMLCanvasElement && HTMLCanvasElement.prototype;
      if(!proto || !proto.getContext) return;
      var og = proto.getContext;
      proto.getContext = function(type, attrs){
        if(type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl'){
          try{ attrs = Object.assign({}, attrs, { preserveDrawingBuffer: true }); }
          catch(e){ attrs = { preserveDrawingBuffer: true }; }
        }
        return og.call(this, type, attrs);
      };
    }catch(e){}
  })();
  /* Passive audio tap: learn the emulator's AudioContext the first time
     it creates a node, then attach ONE extra analyser as an additional
     destination. The existing graph is untouched (extra connect() calls
     never alter the original path), so sound keeps working while we
     sample RMS/peak energy alongside frames and inputs. */
  var audioTap = { ctx: null, analyser: null, buf: null, freq: null, prevFreq: null, prevFlux: 0, busy: false };
  (function patchAudio(){
    try{
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC || !AC.prototype || !window.AudioNode) return;
      var methods = ['createScriptProcessor', 'createGain', 'createAnalyser',
        'createBufferSource', 'createOscillator', 'createBiquadFilter'];
      methods.forEach(function(m){
        if(typeof AC.prototype[m] !== 'function') return;
        var f = AC.prototype[m];
        AC.prototype[m] = function(){ audioTap.ctx = audioTap.ctx || this; return f.apply(this, arguments); };
      });
      var oc = window.AudioNode.prototype.connect;
      window.AudioNode.prototype.connect = function(){
        try{
          if(!audioTap.busy && audioTap.ctx && !audioTap.analyser &&
             this.context === audioTap.ctx){
            audioTap.busy = true;
            try{
              audioTap.analyser = audioTap.ctx.createAnalyser();
              audioTap.analyser.fftSize = 2048;
              audioTap.buf = new Float32Array(2048);
              audioTap.freq = new Uint8Array(audioTap.analyser.frequencyBinCount);
              audioTap.prevFreq = new Uint8Array(audioTap.analyser.frequencyBinCount);
              oc.call(this, audioTap.analyser);
            }catch(e2){}
            audioTap.busy = false;
          }
        }catch(e){}
        return oc.apply(this, arguments);
      };
    }catch(e){}
  })();
  function sampleAudio(t){
    if(!audioTap.analyser || !audioTap.buf) return null;
    try{
      audioTap.analyser.getFloatTimeDomainData(audioTap.buf);
      var sum = 0, peak = 0;
      for(var i = 0; i < audioTap.buf.length; i++){
        var v = audioTap.buf[i];
        sum += v * v;
        var a = v < 0 ? -v : v;
        if(a > peak) peak = a;
      }
      var rms = Math.sqrt(sum / audioTap.buf.length);
      var low = 0, mid = 0, high = 0, flux = 0;
      if(audioTap.freq && audioTap.prevFreq){
        audioTap.analyser.getByteFrequencyData(audioTap.freq);
        var n = audioTap.freq.length;
        var lN = Math.max(1, Math.floor(n * 0.04));
        var mN = Math.max(lN + 1, Math.floor(n * 0.30));
        var lc = 0, mc = 0, hc = 0;
        for(i = 0; i < n; i++){
          var fv = audioTap.freq[i] / 255;
          if(i < lN){ low += fv; lc++; }
          else if(i < mN){ mid += fv; mc++; }
          else { high += fv; hc++; }
          var dv = audioTap.freq[i] - audioTap.prevFreq[i];
          if(dv > 0) flux += dv / 255;
        }
        low = lc ? low / lc : 0; mid = mc ? mid / mc : 0; high = hc ? high / hc : 0;
        flux = flux / n;
        audioTap.prevFreq.set(audioTap.freq);
      }
      var base = SCENE.audioBaseRms || rms;
      var impact = !!(rms > Math.max(0.012, base * 1.35) && flux > 0.035 && high > 0.08);
      SCENE.audioBaseRms = SCENE.audioBaseRms ? SCENE.audioBaseRms * 0.94 + rms * 0.06 : rms;
      return { t: t, rms: Math.round(rms * 1000) / 1000,
        peak: Math.round(peak * 1000) / 1000,
        low: Math.round(low * 100) / 100, mid: Math.round(mid * 100) / 100,
        high: Math.round(high * 100) / 100, flux: Math.round(flux * 1000) / 1000,
        impact: impact, kind: rms < 0.008 ? 'silence' : (impact ? 'impact' : 'music') };
    }catch(e){ return null; }
  }

  /* ---------- learning recorder: screen + inputs + sound ----------
     Samples the emulator canvas at 5fps downscaled to 32x32 grayscale
     (the same shape the DQN paper feeds its network), logs every input
     with its source (pad / key / auto / replay), and samples audio
     energy from the passive tap — all timestamped into one episode. */
  var recOn = false, recT0 = 0, recTimer = null;
  var recFrames = [], recInputs = [], recAudio = [];
  var recCanvas = null, recCtx = null;
  var REC_MAX_MS = 180000;
  var BTN_NAMES = { 0: 'B', 1: 'Y', 2: 'Select', 3: 'Start', 4: 'Up', 5: 'Down', 6: 'Left', 7: 'Right', 8: 'A', 9: 'X', 10: 'L', 11: 'R' };
  /* ---------- emulator canvas source ----------
     Read the real canvas object the player is drawing into, exactly like a
     website would. No emulator clone, no iframe walking, no second player. */
  function gameCanvas(){
    try{
      var e = window.EJS_emulator;
      if(e && e.canvas && e.canvas.width) return e.canvas;
    }catch(err){}
    try{
      var c = stage.querySelector('canvas');
      if(c && c.width && c.height) return c;
    }catch(err2){}
    return null;
  }
  function visionSource(){
    var c = gameCanvas();
    if(!c) return 'none';
    return (c === (window.EJS_emulator && window.EJS_emulator.canvas)) ? 'ejs canvas' : 'stage canvas';
  }
  function bytesB64(a){
    if(!a) return null;
    var s = '';
    for(var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
    return btoa(s);
  }
  function grayB64(g){ return bytesB64(g); }
  function rgbB64(rgb){ return bytesB64(rgb); }
  function captureVision(){
    try{
      var src = gameCanvas();
      if(!src || !src.width) return null;
      if(!recCanvas){
        recCanvas = document.createElement('canvas');
        recCanvas.width = 32; recCanvas.height = 32;
        recCtx = recCanvas.getContext('2d', { willReadFrequently: true });
      }
      recCtx.drawImage(src, 0, 0, 32, 32);
      var d = recCtx.getImageData(0, 0, 32, 32).data;
      var g = new Uint8Array(1024);
      var rgb = new Uint8Array(3072);
      for(var i = 0, j = 0; i < d.length; i += 4, j++){
        g[j] = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0;
        var o = j * 3;
        rgb[o] = d[i]; rgb[o + 1] = d[i + 1]; rgb[o + 2] = d[i + 2];
      }
      return { gray: g, rgb: rgb };
    }catch(e){ return null; }
  }
  function frameGray(){
    var f = captureVision();
    return f ? f.gray : null;
  }
  function frameRgb(){
    var f = captureVision();
    return f ? f.rgb : null;
  }
  function frameB64(){
    return grayB64(frameGray());
  }
  /* ---------- live color vision loop ------------
     Samples the real emulator canvas. The tap is idle by default, previews
     at 10Hz when the AI Lab is open, and only reads at 60Hz when an
     external agent asks for the field stream. Packets carry rgb24 for color
     plus gray8 for fast motion maths. Any frame can ask for one with
     {type:'snesboy:vision/request'}. */
  var VISION_FRAME = 'snesboy:vision/frame';
  var VISION_REQUEST = 'snesboy:vision/request';
  /* The live field tap is deliberately idle-rate by default. The local
     copilots sample on their own sense clock; the 60Hz stream is only for
     an external agent that explicitly asks for it (or an embedded host). */
  var VISION_IDLE_HZ = 10;
  var VISION_LIVE_HZ = 60;
  var visionHz = VISION_IDLE_HZ;
  var visionFieldMs = 1000 / visionHz;
  var visionDemandUntil = 0;
  var visionTimer = null, visionImg = null;
  var visionFrames = 0, visionFpsAt = 0, visionFps = 0, visionSeen = false;
  var visionField = 0, visionParity = 0, visionClock = 0, visionRaf = 0, visionStatusAt = 0;
  function visionPacket(g, rgb){
    if(!g || !rgb){
      var f = captureVision();
      if(!f) return null;
      g = f.gray; rgb = f.rgb;
    }
    var data = grayB64(g), color = rgbB64(rgb);
    if(!data || !color) return null;
    return { type: VISION_FRAME, version: 2, t: Date.now(),
      width: 32, height: 32, format: 'gray8+rgb24/base64',
      data: data, rgb: color, source: visionSource(),
      field: visionField, parity: visionParity & 1,
      frame: Math.ceil(visionField / 2), fieldsPerFrame: 2,
      lines: 262, fieldHz: visionHz, halfResolution: true };
  }
  function postVision(target, g, rgb){
    var p = visionPacket(g, rgb);
    if(!p || !target) return false;
    try{ target.postMessage(p, '*'); return true; }catch(e){ return false; }
  }
  function drawVisionPreview(g, rgb){
    var cv = document.getElementById('vision-preview');
    if(!cv || !g || !cv.offsetParent) return;
    try{
      var ctx = cv.getContext('2d');
      if(!visionImg) visionImg = ctx.createImageData(32, 32);
      var d = visionImg.data;
      for(var i = 0; i < g.length; i++){
        var o = i * 4, c = i * 3;
        if(rgb){
          d[o] = rgb[c]; d[o + 1] = rgb[c + 1]; d[o + 2] = rgb[c + 2];
        }else{
          d[o] = d[o + 1] = d[o + 2] = g[i];
        }
        d[o + 3] = 255;
      }
      ctx.putImageData(visionImg, 0, 0);
    }catch(e){}
  }
  function updateVisionStatus(ok, src){
    var s = document.getElementById('vision-status');
    if(s){
      s.textContent = ok ? ('VISION LIVE · ' + visionFps + ' Hz field · 262 lines · 32×32 color')
                         : 'NO SIGNAL — power on a game';
      s.classList.toggle('vision-ok', !!ok);
    }
    var m = document.getElementById('vision-source');
    if(m) m.textContent = 'source: ' + (src || 'none') + ' · loop: ' + (ok ? 'running' : 'waiting') +
      ' · field ' + visionField + ' ' + (visionParity & 1 ? 'odd' : 'even') + ' · 2 fields = 1×30fps frame';
  }
  var aiLoopText = '';
  function updateAiStatus(){
    var e = document.getElementById('ai-loop-status');
    if(!e) return;
    var parts = ['vision ' + (visionTimer ? (visionNeeded() ? '✓' : 'idle') : '—')];
    if(autoOn){
      parts.push('sense ' + (anyAgentTimer('sense') ? '✓' : '—'));
      parts.push('drive ' + (anyAgentTimer('drive') ? '✓' : '—'));
      parts.push('menus ' + (anyAgentTimer('menu') ? '✓' : '—'));
      parts.push('auto-tune ' + (AgentOpts.autoTune ? '✓' : 'off'));
      parts.push('manual ' + (MANUAL_STATE.current ? '✓' : (MANUAL_STATE.loading ? '…' : '—')));
      parts.push('scene ' + (SCENE.mode || 'idle'));
      parts.push('ocr ' + (OCR_STATE.status === 'ready' ? '✓' : (OCR_STATE.status === 'loading' ? '…' : '—')));
      parts.push('record ' + (recOn ? '●' : 'off'));
    }else{
      parts.push('autopilot idle');
      if(SCENE.mode !== 'idle') parts.push('scene ' + SCENE.mode);
      parts.push('ocr ' + (OCR_STATE.status === 'ready' ? '✓' : (OCR_STATE.status === 'loading' ? '…' : '—')));
    }
    var txt = 'loops: ' + parts.join(' · ');
    if(txt !== aiLoopText){ aiLoopText = txt; e.textContent = txt; }
  }
  function visionTick(){
    var now = Date.now();
    var f = captureVision();
    updateAiStatus();
    if(!f){ updateVisionStatus(false, 'none'); return; }
    visionField++;
    visionParity = visionField & 1;
    if(!visionSeen){ visionSeen = true; visionFpsAt = now; visionFrames = 0; }
    visionFrames++;
    if(now - visionFpsAt >= 1000){
      visionFps = Math.round(visionFrames * 1000 / (now - visionFpsAt));
      visionFrames = 0; visionFpsAt = now;
    }
    drawVisionPreview(f.gray, f.rgb);
    if(window.parent && window.parent !== window) postVision(window.parent, f.gray, f.rgb);
    if(now - visionStatusAt >= 250){
      visionStatusAt = now;
      updateVisionStatus(true, visionSource());
    }
  }
  /* Frequency is demand-driven: idle preview stays cheap; an external
     consumer asks for the full 60Hz field stream. */
  function visionSetHz(hz){
    hz = Math.max(1, Math.min(VISION_LIVE_HZ, +hz || VISION_IDLE_HZ));
    if(hz === visionHz) return;
    visionHz = hz;
    visionFieldMs = 1000 / hz;
    visionClock = 0;
  }
  function visionRefreshHz(){
    if(visionHz !== VISION_IDLE_HZ && Date.now() >= visionDemandUntil){
      visionSetHz(VISION_IDLE_HZ);
    }
  }
  function visionRequest(ms){
    visionDemandUntil = Math.max(visionDemandUntil, Date.now() + (ms || 5000));
    visionSetHz(VISION_LIVE_HZ);
  }
  /* Only tap pixels when something is actually looking: the AI Lab preview
     is open, a host frame is embedded, or an agent requested a burst. The
     copilots grab their own frames on the sense beat, so a hidden preview
     must not cost the emulator 60 canvas readbacks per second. */
  function visionNeeded(){
    if(Date.now() < visionDemandUntil) return true;
    var cv = document.getElementById('vision-preview');
    if(cv && cv.offsetParent) return true;
    try{ if(window.parent && window.parent !== window) return true; }catch(e){}
    return false;
  }
  function updateVisionIdle(){
    var src = visionSource();
    var s = document.getElementById('vision-status');
    if(s){
      s.textContent = src === 'none' ? 'VISION STANDBY — power on a game'
                                     : 'VISION READY — open AI Lab or request 60Hz';
      s.classList.toggle('vision-ok', src !== 'none');
    }
    var m = document.getElementById('vision-source');
    if(m) m.textContent = 'source: ' + (src || 'none') + ' · loop: standby · preview closed';
  }
  function visionLoop(ts){
    if(!visionTimer) return;
    visionRefreshHz();
    if(!visionNeeded()){
      visionClock = ts;
      if(Date.now() - visionStatusAt >= 1000){ visionStatusAt = Date.now(); updateVisionIdle(); }
      visionRaf = requestAnimationFrame(visionLoop);
      return;
    }
    if(!visionClock) visionClock = ts;
    /* Fixed field clock, not the browser's paint rate. If rAF is late
       (busy game frame) emit the due fields now so the stream stays locked
       to cadence instead of drifting to the display fps. */
    var due = Math.floor((ts - visionClock) / visionFieldMs);
    if(due > 0){
      visionClock += due * visionFieldMs;
      if(due > 4){ visionClock = ts; due = 1; } /* long stall: resync */
      for(var i = 0; i < due; i++) visionTick();
    }
    visionRaf = requestAnimationFrame(visionLoop);
  }
  function startVisionLoop(){
    if(visionTimer) return;
    visionTimer = 1;
    visionClock = 0;
    visionSetHz(VISION_IDLE_HZ);
    visionRaf = requestAnimationFrame(visionLoop);
    visionTick();
  }
  window.addEventListener('message', function(e){
    var d = e.data;
    if(!d || d.type !== VISION_REQUEST) return;
    visionRequest(d.ttl || 5000);
    postVision(e.source);
  });
  /* Same-document consumers (AI Lab / an agent embedded alongside). */
  window.SNESBoyVision = {
    frame: frameGray,
    color: frameRgb,
    packet: visionPacket,
    request: visionRequest,
    hz: function(){ return visionHz; },
    snapshot: function(){
      var src = gameCanvas();
      if(!src) return null;
      try{
        var c = document.createElement('canvas');
        c.width = 256; c.height = 240;
        c.getContext('2d').drawImage(src, 0, 0, 256, 240);
        return c.toDataURL('image/png');
      }catch(e){ return null; }
    },
    source: visionSource
  };
  function grayDiff(a, b){
    var s = 0, n = 0;
    for(var i = 0; i < a.length; i += 4){
      var d = a[i] - b[i];
      s += d < 0 ? -d : d; n++;
    }
    return s / n;
  }
  function grayMean(g){
    var s = 0;
    for(var i = 0; i < g.length; i += 4) s += g[i];
    return s / Math.ceil(g.length / 4);
  }
  /* Which way is the world scrolling? Column-profile SAD between two
     frames over shifts of -8..+8px. Positive shift = pixels moved left =
     camera pushing right, so keep holding Right (and mirrored). Lets the
     agent follow side-scrollers in either direction instead of assuming. */
  function colShift(a, b){
    var pa = [], pb = [], x, y;
    for(x = 0; x < 32; x++){ pa.push(0); pb.push(0); }
    for(y = 0; y < 32; y++) for(x = 0; x < 32; x++){ pa[x] += a[y * 32 + x]; pb[x] += b[y * 32 + x]; }
    var best = 0, bestS = Infinity, s, t, q, d;
    for(s = -8; s <= 8; s++){
      t = 0;
      for(x = 0; x < 32; x++){ q = x + s; if(q < 0 || q > 31) continue; d = pa[q] - pb[x]; t += d < 0 ? -d : d; }
      if(t < bestS){ bestS = t; best = s; }
    }
    return best;
  }
  /* Vertical twin of colShift: row-profile SAD over shifts of -8..+8px.
     Positive shift = pixels moved up on screen = camera pushing down, so
     hold Down (and mirrored). Lets the agent climb/follow vertical scrollers
     instead of only ever pushing left/right. */
  function rowShift(a, b){
    var pa = [], pb = [], x, y;
    for(y = 0; y < 32; y++){ pa.push(0); pb.push(0); }
    for(y = 0; y < 32; y++) for(x = 0; x < 32; x++){ pa[y] += a[y * 32 + x]; pb[y] += b[y * 32 + x]; }
    var best = 0, bestS = Infinity, s, t, q, d;
    for(s = -8; s <= 8; s++){
      t = 0;
      for(y = 0; y < 32; y++){ q = y + s; if(q < 0 || q > 31) continue; d = pa[q] - pb[y]; t += d < 0 ? -d : d; }
      if(t < bestS){ bestS = t; best = s; }
    }
    return best;
  }
  function learnStatus(msg){ var e = document.getElementById('learn-status'); if(e) e.textContent = msg; }
  function updateRecBtn(){
    var b = document.getElementById('btn-record');
    if(b){
      b.textContent = recOn ? '⏹ RECORDING — TAP TO STOP' : '● RECORD SESSION';
      b.classList.toggle('rec-on', recOn);
    }
  }
  function startRecording(){
    if(recOn) return;
    recOn = true; recT0 = Date.now();
    recFrames = []; recInputs = []; recAudio = [];
    updateRecBtn();
    learnStatus('Recording… play! Frames + inputs + sound are being captured.');
    recTimer = setInterval(function(){
      if(!recOn) return;
      if(Date.now() - recT0 > REC_MAX_MS){ stopRecording(); learnStatus('Stopped: 3-minute episode cap reached.'); return; }
      if(!playing) return;
      var t = Date.now() - recT0;
      var px = frameB64();
      if(px) recFrames.push({ t: t, px: px });
      var a = sampleAudio(t);
      if(a) recAudio.push(a);
    }, 200);
  }
  function stopRecording(){
    if(!recOn) return;
    recOn = false;
    if(recTimer){ clearInterval(recTimer); recTimer = null; }
    updateRecBtn();
    var dur = Date.now() - recT0;
    if(!recFrames.length && !recInputs.length){
      learnStatus('Nothing captured (game was not running).');
      return;
    }
    var counts = {};
    recInputs.forEach(function(ev){
      if(ev.d === 1) counts[ev.b] = (counts[ev.b] || 0) + 1;
    });
    var m = MANUAL_STATE.current;
    var policy = autoPilots.map(function(pt){
      return { player: pt.pl + 1, manual: pt.manual ? pt.manual.id : null,
        tries: pt.learn.tries, score: pt.learn.score, total: pt.learn.total };
    });
    var ep = { game: currentName, date: new Date().toISOString(),
      manual: m ? { id: m.id, title: m.title, kind: m.kind, jump: m.jump, run: m.run,
        block: m.block, strikes: m.strikes, actions: m.actions } : null,
      scene: { mode: SCENE.mode, game: SCENE.game, screenTitle: SCENE.screenTitle,
        text: SCENE.text, confidence: SCENE.conf },
      policy: policy,
      ms: dur, frames: recFrames, inputs: recInputs, audio: recAudio, counts: counts };
    epPut(ep).then(function(){
      learnStatus('Saved ' + recFrames.length + ' frames, ' + recInputs.length +
        ' input events, ' + recAudio.length + ' audio samples (' +
        Math.round(dur / 1000) + 's).');
      renderEpisodes();
    }, function(){
      learnStatus('Storage full or unavailable — episode kept for this session only.');
    });
  }
  function toggleRecording(){ if(recOn) stopRecording(); else startRecording(); }

  /* ---------- episode store / replay / export ---------- */
  var replayingId = null, replayTimers = [];
  function epStore(mode){
    return DB.transaction('episodes', mode).objectStore('episodes');
  }
  function epPut(ep){
    return new Promise(function(res, rej){
      try{
        var q = epStore('readwrite').add(ep);
        q.onsuccess = function(){ res(q.result); };
        q.onerror = function(){ rej(q.error); };
      }catch(e){ rej(e); }
    });
  }
  function epAll(){
    return new Promise(function(res){
      try{
        var q = epStore('readonly').getAll();
        q.onsuccess = function(){ res(q.result || []); };
        q.onerror = function(){ res([]); };
      }catch(e){ res([]); }
    });
  }
  function epDel(id){
    return new Promise(function(res){
      try{
        var tx = DB.transaction('episodes', 'readwrite');
        tx.objectStore('episodes').delete(id);
        tx.oncomplete = function(){ res(); };
        tx.onerror = function(){ res(); };
      }catch(e){ res(); }
    });
  }
  var replayHeld = {};
  function releaseReplayHeld(){
    if(!replayHeld) return;
    Object.keys(replayHeld).forEach(function(k){
      var parts = k.split(':');
      driveIndex(parseInt(parts[1], 10), false, 'replay', parseInt(parts[0], 10));
    });
    replayHeld = {};
  }
  function stopReplay(msg){
    replayTimers.forEach(clearTimeout);
    replayTimers = [];
    releaseReplayHeld();
    if(replayingId !== null){
      replayingId = null; renderEpisodes();
      if(msg) learnStatus(msg);
    }
  }
  function replayEpisode(id){
    if(replayingId === id){ stopReplay('Replay stopped — buttons released.'); return; }
    stopReplay();
    epAll().then(function(eps){
      var ep = null;
      eps.forEach(function(e){ if(e.id === id) ep = e; });
      if(!ep || !ep.inputs.length){ learnStatus('Episode has no inputs to replay.'); return; }
      if(!playing){ learnStatus('Boot the game first (POWER), then replay.'); return; }
      replayingId = id;
      renderEpisodes();
      learnStatus('Replaying ' + ep.inputs.length + ' inputs… tap REPLAY again to stop.');
      var t0 = Date.now();
      ep.inputs.forEach(function(ev){
        replayTimers.push(setTimeout(function(){
          var pl = ev.p || 0;
          var key = pl + ':' + ev.b;
          if(ev.d === 1) replayHeld[key] = true; else delete replayHeld[key];
          driveIndex(ev.b, ev.d === 1, 'replay', pl);
        }, Math.max(0, ev.t - (Date.now() - t0))));
      });
      var last = ep.inputs[ep.inputs.length - 1].t;
      replayTimers.push(setTimeout(function(){ stopReplay('Replay finished.'); }, last + 800));
    });
  }
  function exportEpisode(id){
    epAll().then(function(eps){
      var ep = null;
      eps.forEach(function(e){ if(e.id === id) ep = e; });
      if(!ep) return;
      var blob = new Blob([JSON.stringify({ app: 'snesboy-ai', v: 1, episode: ep })], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'snesboy-episode-' + id + '.json';
      document.body.appendChild(a); a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
  }
  function renderEpisodes(){
    var list = document.getElementById('episode-list');
    var sum = document.getElementById('dataset-summary');
    if(!list) return;
    list.innerHTML = '';
    if(!DB){ if(sum) sum.textContent = 'Library unavailable (no IndexedDB).'; return; }
    epAll().then(function(eps){
      var tf = 0, ti = 0, ta = 0, tms = 0, agg = {};
      eps.slice().reverse().forEach(function(ep){
        tf += (ep.frames || []).length; ti += (ep.inputs || []).length;
        ta += (ep.audio || []).length; tms += ep.ms || 0;
        Object.keys(ep.counts || {}).forEach(function(k){ agg[k] = (agg[k] || 0) + ep.counts[k]; });
        var item = document.createElement('div'); item.className = 'rom-list-item';
        var nm = document.createElement('div'); nm.className = 'rom-name';
        nm.textContent = (ep.frames || []).length + 'f/' + (ep.inputs || []).length + 'i/' +
          (ep.audio || []).length + 'a ' + Math.round((ep.ms || 0) / 1000) + 's ' +
          (ep.date || '').slice(5, 16).replace('T', ' ');
        var act = document.createElement('div'); act.className = 'rom-actions';
        var rep = document.createElement('button');
        rep.className = 'rom-btn-play';
        rep.textContent = (replayingId === ep.id) ? 'STOP' : 'REPLAY';
        rep.addEventListener('click', function(){ replayEpisode(ep.id); });
        var exp = document.createElement('button');
        exp.className = 'rom-btn-export'; exp.textContent = 'JSON';
        exp.addEventListener('click', function(){ exportEpisode(ep.id); });
        var del = document.createElement('button');
        del.className = 'rom-btn-del'; del.textContent = 'DEL';
        del.addEventListener('click', function(){
          if(replayingId === ep.id) stopReplay();
          epDel(ep.id).then(renderEpisodes);
        });
        act.appendChild(rep); act.appendChild(exp); act.appendChild(del);
        item.appendChild(nm); item.appendChild(act); list.appendChild(item);
      });
      if(sum){
        if(!eps.length){ sum.textContent = 'No episodes yet — record a session and the AI dataset starts here.'; return; }
        var top = Object.keys(agg).sort(function(a, b){ return agg[b] - agg[a]; }).slice(0, 3)
          .map(function(k){ return (BTN_NAMES[k] || k) + '×' + agg[k]; }).join(' ');
        sum.textContent = eps.length + ' episodes • ' + tf + ' frames • ' + ti +
          ' inputs • ' + ta + ' audio samples • ' + Math.round(tms / 1000) +
          's played' + (top ? ' • top buttons: ' + top : '');
      }
    });
  }

  /* ---------- IndexedDB: ROM library + learning episodes ---------- */
  var DB = null;
  var MEM = [{ name: BUNDLED.name, url: BUNDLED.url, builtin: true }];
  function openDB(){
    return new Promise(function(res, rej){
      try{
        var r = indexedDB.open('snesboy-roms', 2);
        r.onupgradeneeded = function(){
          var db = r.result;
          if(!db.objectStoreNames.contains('roms')) db.createObjectStore('roms', { keyPath: 'name' });
          if(!db.objectStoreNames.contains('episodes')) db.createObjectStore('episodes', { keyPath: 'id', autoIncrement: true });
        };
        r.onsuccess = function(){ res(r.result); };
        r.onerror = function(){ rej(r.error); };
      }catch(e){ rej(e); }
    });
  }
  function idbAll(){
    return new Promise(function(res, rej){
      try{
        var tx = DB.transaction('roms', 'readonly');
        var q = tx.objectStore('roms').getAll();
        q.onsuccess = function(){ res(q.result || []); };
        q.onerror = function(){ rej(q.error); };
      }catch(e){ rej(e); }
    });
  }
  function idbPut(entry){
    return new Promise(function(res, rej){
      try{
        var tx = DB.transaction('roms', 'readwrite');
        tx.objectStore('roms').put(entry);
        tx.oncomplete = function(){ res(); };
        tx.onerror = function(){ rej(tx.error); };
      }catch(e){ rej(e); }
    });
  }
  function idbDel(name){
    return new Promise(function(res, rej){
      try{
        var tx = DB.transaction('roms', 'readwrite');
        tx.objectStore('roms').delete(name);
        tx.oncomplete = function(){ res(); };
        tx.onerror = function(){ rej(tx.error); };
      }catch(e){ rej(e); }
    });
  }
  function entryUrl(entry){
    if(entry.blob) return URL.createObjectURL(entry.blob);
    return entry.url;
  }
  function currentEntries(){
    if(DB) return idbAll();
    return Promise.resolve(MEM.slice());
  }
  function renderLibrary(){
    var list = document.getElementById('library-rom-list');
    list.innerHTML = '';
    currentEntries().then(function(entries){
      if(!entries.length){
        var p = document.createElement('p');
        p.className = 'modal-desc'; p.textContent = 'No ROMs yet — add one below.';
        list.appendChild(p); return;
      }
      entries.forEach(function(en){
        var item = document.createElement('div'); item.className = 'rom-list-item';
        var nm = document.createElement('div'); nm.className = 'rom-name';
        nm.textContent = (en.name === currentName ? '▶ ' : '') + en.name;
        var act = document.createElement('div'); act.className = 'rom-actions';
        var play = document.createElement('button'); play.className = 'rom-btn-play'; play.textContent = 'PLAY';
        play.addEventListener('click', function(){
          closeModals();
          playing = false; showStandby(true); setLeds(false);
          setStatus('LOADING…', en.name.toUpperCase().slice(0, 40));
          boot(entryUrl(en), en.name); powerOn();
        });
        act.appendChild(play);
        if(!en.builtin){
          var del = document.createElement('button'); del.className = 'rom-btn-del'; del.textContent = 'DEL';
          del.addEventListener('click', function(){
            var done = function(){ renderLibrary(); };
            if(DB) idbDel(en.name).then(done, done);
            else{ MEM = MEM.filter(function(m){ return m.name !== en.name; }); done(); }
          });
          act.appendChild(del);
        }
        item.appendChild(nm); item.appendChild(act); list.appendChild(item);
      });
    });
  }
  function addFiles(files){
    var jobs = [];
    Array.prototype.forEach.call(files, function(f){
      var entry = { name: f.name, blob: f, builtin: false };
      if(DB) jobs.push(idbPut(entry));
      else MEM.push(entry);
    });
    Promise.all(jobs).then(renderLibrary, renderLibrary);
    renderLibrary();
    openModal('library-modal');
  }
  ['rom-file-input', 'desktop-rom-file-input', 'modal-rom-file-input'].forEach(function(id){
    var inp = document.getElementById(id);
    if(inp) inp.addEventListener('change', function(){ addFiles(inp.files); inp.value = ''; });
  });

  /* ---------- modals ---------- */
  function openModal(id){ document.getElementById(id).classList.remove('hidden'); }
  function closeModals(){
    $all('.modal-overlay').forEach(function(m){ m.classList.add('hidden'); });
    if(!autoOn) stopSceneLoop();
  }
  $all('.modal-overlay').forEach(function(m){
    m.addEventListener('click', function(e){ if(e.target === m) closeModals(); });
  });
  document.addEventListener('click', function(e){
    var c = e.target.closest ? e.target.closest('[data-close]') : null;
    if(c){
      var mid = c.getAttribute('data-close');
      document.getElementById(mid).classList.add('hidden');
      if(mid === 'ai-modal' && !autoOn) stopSceneLoop();
    }
  });

  /* ---------- theme / sound / crt ---------- */
  function toggleTheme(){
    var b = document.body;
    var fam = b.classList.toggle('theme-famicom');
    b.classList.toggle('theme-snes', !fam);
    try{ localStorage.setItem('snesboy-theme', fam ? 'famicom' : 'snes'); }catch(e){}
  }
  try{
    if(localStorage.getItem('snesboy-theme') === 'famicom'){
      document.body.classList.add('theme-famicom');
      document.body.classList.remove('theme-snes');
    }
  }catch(e){}
  function updateSoundIcons(){
    var ic = muted ? '🔇' : '🔊';
    ['btn-sound', 'dt-btn-sound'].forEach(function(id){
      var e = document.getElementById(id); if(e) e.textContent = ic;
    });
  }
  function toggleSound(){
    var b = ejsButton(function(t){ return t === 'mute' || t === 'unmute' || t.indexOf('mute') !== -1; });
    if(b && playing){
      try{ b.click(); muted = !muted; }catch(e){}
      setTimeout(function(){
        try{
          if(window.EJS_emulator && typeof window.EJS_emulator.muted === 'boolean'){
            muted = window.EJS_emulator.muted;
          }
        }catch(e2){}
        updateSoundIcons();
      }, 300);
    }
    updateSoundIcons();
  }
  function toggleCrt(){
    crtOn = !crtOn;
    crt.style.display = crtOn ? 'block' : 'none';
  }

  /* Losing the tab releases human-held buttons (never stuck), but the
     autopilot stays exactly as it was — only its own toggle stops it. */
  window.addEventListener('blur', function(){
    for(var pl = 0; pl <= 3; pl++)
      for(var i = 0; i <= 11; i++) driveIndex(i, false, 'sys', pl);
    $all('.pressed').forEach(function(el){ el.classList.remove('pressed'); });
  });

  /* ---------- USB gamepads ----------
     The emulator only listens to a pad assigned to a player slot
     (gamepadSelection). Browsers forget assignments, pads reconnect
     under new ids, stale slots block auto-assign — so take charge:
     any connected pad is (re)assigned to P1 automatically, with a
     status line + manual button in the info modal. */
  function assignUsbPad(){
    try{
      if(!window.EJS_emulator || !navigator.getGamepads) return 'no-emu';
      var pads = Array.prototype.slice.call(navigator.getGamepads());
      var pad = null;
      for(var i = 0; i < pads.length; i++){
        if(pads[i] && pads[i].connected){ pad = pads[i]; break; }
      }
      if(!pad) return 'none';
      window.EJS_emulator.gamepadSelection[0] = pad.id + '_' + pad.index;
      return pad.id;
    }catch(e){ return 'err'; }
  }
  function updatePadStatus(){
    var e = document.getElementById('gamepad-status');
    if(!e) return;
    var names = [];
    try{
      Array.prototype.forEach.call(navigator.getGamepads() || [], function(g){
        if(g && g.connected) names.push(g.id);
      });
    }catch(x){}
    var sel = '';
    try{ sel = (window.EJS_emulator && window.EJS_emulator.gamepadSelection[0]) || ''; }catch(x){}
    if(!names.length){
      e.textContent = 'USB pad: none detected — connect one, then press any button on it.';
    }else if(sel){
      e.textContent = 'USB pad: ' + names[0].slice(0, 44) + ' → player 1 ✓ (if it still ignores you, press REASSIGN)';
    }else{
      e.textContent = 'USB pad: ' + names[0].slice(0, 44) + ' detected but unassigned — press REASSIGN.';
    }
  }
  window.addEventListener('gamepadconnected', function(){ assignUsbPad(); updatePadStatus(); });
  window.addEventListener('gamepaddisconnected', function(){ updatePadStatus(); });

  /* ---------- wire all buttons ---------- */
  function on(id, fn){ var e = document.getElementById(id); if(e) e.addEventListener('click', fn); }
  on('btn-power', togglePower);
  on('desktop-power-btn', togglePower);
  on('desktop-reset-btn', resetGame);
  on('btn-reset', resetGame);
  on('btn-eject', function(){ if(playing) powerOff(); });
  on('dt-btn-eject', function(){ if(playing) powerOff(); });
  on('btn-theme', toggleTheme);
  on('dt-btn-theme', toggleTheme);
  on('btn-library', function(){ renderLibrary(); openModal('library-modal'); });
  on('dt-btn-library', function(){ renderLibrary(); openModal('library-modal'); });
  on('btn-info', function(){ updatePadStatus(); openModal('info-modal'); });
  on('dt-btn-info', function(){ updatePadStatus(); openModal('info-modal'); });
  on('btn-pad', function(){ assignUsbPad(); updatePadStatus(); });
  on('btn-ai', function(){ renderEpisodes(); renderTuneInputs(); updateAgentHud(); openModal('ai-modal'); startSceneLoop(); ensureOcrWorker().catch(function(){}); });
  on('dt-btn-ai', function(){ renderEpisodes(); renderTuneInputs(); updateAgentHud(); openModal('ai-modal'); startSceneLoop(); ensureOcrWorker().catch(function(){}); });
  on('btn-autopilot', toggleAutopilot);
  on('btn-autotune', toggleAutotune);
  on('btn-hud', toggleHud);
  on('btn-tune-reset', resetAgentOpts);
  on('btn-anton-analyze', runAntonScan);
  on('btn-record', toggleRecording);
  document.addEventListener('change', function(e){
    var t = e.target;
    if(!t || !t.id || t.id.indexOf('opt-') !== 0) return;
    var key = t.id.slice(4);
    if(key === 'seekCycle'){
      AgentOpts.seekCycle = String(t.value || AgentDefaults.seekCycle).slice(0, 31);
      saveAgentOpts(); renderTuneInputs();
      parseSeekCycle(); /* next menu tick uses the new order — no restart */
      if(autoOn) antonSay('seek taps ' + AgentOpts.seekCycle + ' — live');
      return;
    }
    if(key === 'players'){
      var vals = String(t.value || '0').split(',');
      var out = [];
      vals.forEach(function(v){
        var n = parseInt(v, 10);
        if(!isNaN(n) && n >= 0 && n <= 3 && out.indexOf(n) === -1) out.push(n);
      });
      AgentOpts.players = out.length ? out : [0];
      saveAgentOpts(); renderTuneInputs();
      if(autoOn) startAgentEngine(); /* rebuild pilots for the new roster */
      return;
    }
    if(key === 'profile'){
      AgentOpts.profile = (t.value === 'umk3') ? 'umk3' : (t.value === 'mix' ? 'mix' : 'generic');
      saveAgentOpts(); renderTuneInputs(); updateAgentHud();
      if(autoOn){
        /* release the old profile's holds before the next tick uses the new
           one — no stuck L/R block or run from a mode switch */
        autoPilots.forEach(function(pt){
          fightRelease(pt.pl);
          driveIndex(AgentMap.run, false, 'auto', pt.pl);
        });
        antonSay(AgentOpts.profile === 'mix' ? 'mix mode — platformer + UMK3 beats, live' : 'profile ' + AgentOpts.profile + ' — live');
      }
      return; /* drive loop reads the profile every tick — no restart needed */
    }
    var spec = null;
    TuneFields.forEach(function(f){ if(f[0] === key) spec = f; });
    if(!spec) return;
    var v = parseFloat(t.value);
    if(isNaN(v)) v = AgentDefaults[key];
    AgentOpts[key] = Math.min(spec[2], Math.max(spec[1], v));
    saveAgentOpts(); renderTuneInputs();
    /* thresholds/hopEvery are read every tick. Only the two period values
       need their timer retimed — and retiming keeps every hold and pilot
       alive, so the game and the AI never pause. */
    if(autoOn){
      if(key === 'senseMs') retimeAgentLoop('sense');
      else if(key === 'tapMs') retimeAgentLoop('menu');
      antonSay('live tune — ' + key + ' ' + AgentOpts[key] + ' (no restart)');
    }
  });
  on('btn-sound', toggleSound);
  on('dt-btn-sound', toggleSound);
  on('btn-crt', toggleCrt);
  on('dt-btn-crt', toggleCrt);

  /* ---------- go ---------- */
  placeStage();
  startVisionLoop();
  updateAgentHud();
  openDB().then(function(db){
    DB = db;
    return idbAll();
  }).then(function(entries){
    if(DB && !entries.length){
      return fetch(BUNDLED.url).then(function(r){
        if(!r.ok) throw new Error('rom fetch failed');
        return r.blob();
      }).then(function(blob){
        return idbPut({ name: BUNDLED.name, blob: blob, builtin: true });
      });
    }
  }).catch(function(){
    DB = null; /* IndexedDB unavailable: memory-only library */
  }).then(function(){
    renderLibrary();
    boot(BUNDLED.url, BUNDLED.name);
    fetch(BUNDLED.url, { headers: { Range: 'bytes=0-0' } }).then(function(r){
      if(!(r.ok || r.status === 206)) setStatus('ROM NOT FOUND', 'ADD A FILE VIA MY GAMES');
    }).catch(function(){ setStatus('ROM NOT FOUND', 'ADD A FILE VIA MY GAMES'); });
  });
})();
