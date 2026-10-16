/* SMW learner: remembers deaths, avoids their spots, hunts exits, improves.
 *
 * What it learns, and where it persists (localStorage `smw-brain-v2`, so
 * knowledge survives reloads = learning across playthroughs):
 *  - Q weights: linear function approximation, Q(s,a) = w[a].x(s), TD(0)
 *    updated from shaped rewards every observation (~8Hz). Starts as the old
 *    run-right heuristic via a decaying prior bonus, then becomes experience.
 *    Every run BOTH learns (TD updates + saves) AND reuses previous runs
 *    (weights, danger map, exits, best-progress all load at boot; run
 *    counter proves continuity).
 *  - Danger map: per-level list of world-X positions where Mario died.
 *    Near a death spot the agent gets cautious (feature + shaping penalty).
 *  - Death log: {t, run, level, worldX, cause} with cause from vision
 *    (enemy:/pit/fall) and now audio (death sting confirms).
 *  - Exits: per level {normal:bool, secret:bool}. Secret = key carried to a
 *    keyhole (key seen, then keyhole touched, then transition).
 *  - Runs: {id, startedAt, steps, deaths} history so the HUD can show
 *    "Run #N uses knowledge from N-1 runs".
 *  - Ears: audio features (coin/jump/death/loud/music) from js/audio.js are
 *    extra Q inputs AND reward events (coin +0.6, death sting -1.0).
 * Actions (12): arrow {left,right,up} x run(Y held) x jump(B held). No Start:
 * the app taps Start as a menu nudge (outside the learned policy, as before).
 */
(function () {
  'use strict';

  var LS_KEY = 'smw-brain-v2';
  var LS_KEY_V1 = 'smw-brain-v1';

  // Feature indices (binary). Keep in sync with featurize().
  // 0-12 are vision/progress (stable since v1); 13-17 are ears (v2);
  // 18-23 are motion/vertical/memory (v3); 24-25 are read text (v4).
  var F = { bias: 0, wall: 1, pit: 2, enemyAhead: 3, enemyAbove: 4, enemyClose: 5,
    danger: 6, key: 7, keyhole: 8, goal: 9, air: 10, stuck: 11, goingRight: 12,
    hearCoin: 13, hearJump: 14, hearDanger: 15, hearLoud: 16, hearMusic: 17,
    motion: 18, needUp: 19, downOpen: 20, taboo: 21, segHazard: 22, ceiling: 23,
    textExit: 24, textKey: 25 };
  var NF = 26;

  // Full gameplay action space: every SNES button that changes SMW gameplay.
  // Arrows: left/right/up/down (up = climb/enter, down = duck/drop/pipe).
  // run=1 holds Y+X (both are dash in SMW). jump: 0 none, 1 = B (normal
  // jump), 2 = A (spin jump — kills what B bounces off). Plus WAIT (no
  // input): standing still to LOOK is a real decision — without it the
  // agent MUST mash a direction every step, which is frantic by design.
  // L/R only scroll the camera in SMW and Start/Select only pause, so the
  // menu logic owns those; everything gameplay-meaningful is learned here.
  var ARROWS = ['left', 'right', 'up', 'down'];
  var ACTIONS = [];
  ARROWS.forEach(function (arrow) {
    [0, 1].forEach(function (run) {
      [0, 1, 2].forEach(function (jump) {
        ACTIONS.push({ arrow: arrow, run: run, jump: jump });
      });
    });
  });
  ACTIONS.push({ arrow: null, run: 0, jump: 0 }); // WAIT: look, don't touch
  var IDLE_IDX = ACTIONS.length - 1;
  // idx = ((arrowIdx*2)+run)*3+jump, WAIT = last

  function actionStr(a) {
    if (!a || !a.arrow) return 'WAIT';
    var m = { left: 'AL', right: 'AR', up: 'AU', down: 'AD' };
    return m[a.arrow] + (a.run ? '+RUN' : '') +
      (a.jump === 1 ? '+JMP' : a.jump === 2 ? '+SPN' : '');
  }
  function actionIdx(arrow, run, jump) {
    if (!arrow) return IDLE_IDX;
    return ((ARROWS.indexOf(arrow) * 2) + (run ? 1 : 0)) * 3 + (jump || 0);
  }

  function Learner(opts) {
    opts = opts || {};
    this.alpha = 0.08;
    this.gamma = 0.9;
    this.epsStart = 0.8; this.epsEnd = 0.1; this.epsEndAt = 400000;
    this.epsFixed = opts.epsFixed;
    this.w = [];
    for (var a = 0; a < ACTIONS.length; a++) { this.w.push(new Array(NF).fill(0)); }
    this.danger = {};    // levelKey -> [worldX, ...]
    this.deaths = [];    // {t, run, level, worldX, cause}
    this.exits = {};     // levelKey -> {normal:bool, secret:bool}
    this.steps = 0;
    this.rewardEMA = 0;
    this.repeatDeaths = 0;
    this.progress = {};
    this.runs = [];      // {id, startedAt, steps, deaths}
    this.runCount = 0;
    this.runId = 0;
    this.runSteps = 0;
    this.runDeaths = 0;
    // episode / tracking state
    this.levelKey = null;
    this.prevLevel = null;
    this.pendingExit = null;
    this.levelIndex = 0;
    this.worldX = 0;
    this.dxTrail = [];
    this.prevSmall = null;
    this.fadeFrames = 0;
    this.lostFrames = 0;
    this.last = null; // {x, a, r} backup for TD + death blame
    this.keySeenLevel = false;
    this.keyholeSeenLevel = false;
    this.keyholeTouched = false;
    this.audioEvents = 0;
    this.lastAudio = null;
    // v3 memory: failure taboo (state-action death counts), level-build map
    // (per-segment walls/pits/enemies/visits), action-effect lab (what each
    // button actually does), short action trail for multi-step death blame.
    this.failCounts = {};  // "level:qx:aIdx" -> deaths
    this.segMap = {};      // levelKey -> {qx: {v, wall, pit, en:{}, d}}
    this.actFx = {};       // aIdx -> {n, sx, sy, d}
    this.trail = [];       // [{a, x}] last ~10 decisions
    this.textReads = 0;    // frames where words were actually read
    this.load();
    this.startRun();
  }

  Learner.prototype.epsilon = function () {
    if (this.epsFixed != null) return this.epsFixed;
    var t = Math.min(1, this.steps / this.epsEndAt);
    return this.epsStart + (this.epsEnd - this.epsStart) * t;
  };

  // --- persistence (v4: 25 actions x 26 features; migrates 12x13, 12x18, 24x24) ---
  function padRow(row) {
    var out = row.slice(0, NF);
    while (out.length < NF) out.push(0);
    return out;
  }
  // Old brains had fewer actions; shared actions keep their weights, new
  // rows (Down, spin, WAIT) start at 0 — genuinely new knowledge to gain.
  function normalizeW(w) {
    if (!w || !w.length) return null;
    if (w.length === ACTIONS.length) return w.map(padRow);
    function empty() {
      var out = [];
      for (var n = 0; n < ACTIONS.length; n++) out.push(new Array(NF).fill(0));
      return out;
    }
    if (w.length === 24) {
      // v3 24-action brain -> v4: copy 24 rows, WAIT starts at 0
      var out24 = w.map(padRow);
      out24.push(new Array(NF).fill(0));
      return out24;
    }
    if (w.length === 12) {
      var out = empty();
      var oldNF = w[0].length;
      for (var oai = 0; oai < 3; oai++) {
        for (var run = 0; run < 2; run++) {
          for (var ojb = 0; ojb < 2; ojb++) {
            var oldIdx = (oai * 2 + run) * 2 + ojb;
            var newIdx = (oai * 2 + run) * 3 + ojb;
            var row = w[oldIdx] || [];
            for (var f = 0; f < Math.min(oldNF, NF); f++) out[newIdx][f] = row[f] || 0;
          }
        }
      }
      return out;
    }
    return null;
  }
  Learner.prototype.save = function () {
    // close out current run stats in-memory (not a new run, just snapshot)
    try {
      // cap taboo table so storage stays small (keep most-feared)
      var fk = Object.keys(this.failCounts);
      var fc = this.failCounts;
      if (fk.length > 600) {
        fk.sort(function (a, b) { return fc[b] - fc[a]; });
        var trimmed = {};
        for (var ti = 0; ti < 600; ti++) trimmed[fk[ti]] = fc[fk[ti]];
        this.failCounts = trimmed;
      }
      // cap level maps (40 levels, 120 segments each)
      var sk = Object.keys(this.segMap);
      if (sk.length > 40) {
        var keep = sk.slice(-40), nm = {};
        for (var si = 0; si < keep.length; si++) nm[keep[si]] = this.segMap[keep[si]];
        this.segMap = nm;
      }
      localStorage.setItem(LS_KEY, JSON.stringify({
        w: this.w, danger: this.danger, deaths: this.deaths.slice(-300),
        exits: this.exits, steps: this.steps, rewardEMA: this.rewardEMA,
        repeatDeaths: this.repeatDeaths, progress: this.progress || {},
        runs: this.runs.slice(-60), runCount: this.runCount,
        runId: this.runId, audioEvents: this.audioEvents,
        failCounts: this.failCounts, segMap: this.segMap, actFx: this.actFx,
        textReads: this.textReads || 0,
        profileId: this.profileId || 'generic',
        profileLabel: this.profileLabel || 'generic'
      }));
    } catch (e) { /* storage full/blocked: keep going memory-only */ }
  };
  Learner.prototype.load = function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) {}
    if (!s) {
      // migrate v1/v2 brain if present
      try { s = JSON.parse(localStorage.getItem(LS_KEY_V1) || 'null'); } catch (e2) {}
      if (!s) return false;
    }
    try {
      var w = normalizeW(s.w);
      if (w) this.w = w;
      this.danger = s.danger || {}; this.deaths = s.deaths || [];
      this.exits = s.exits || {}; this.steps = s.steps || 0;
      this.rewardEMA = s.rewardEMA || 0; this.repeatDeaths = s.repeatDeaths || 0;
      this.progress = s.progress || {};
      this.runs = s.runs || []; this.runCount = s.runCount || this.runs.length;
      this.audioEvents = s.audioEvents || 0;
      this.failCounts = s.failCounts || {};
      this.segMap = s.segMap || {};
      this.actFx = s.actFx || {};
      this.textReads = s.textReads || 0;
      this.setProfile(s.profileId || 'generic', s.profileLabel || s.profileId || 'generic');
      return true;
    } catch (e) { return false; }
  };
  Learner.prototype.startRun = function () {
    this.runCount = (this.runCount || 0) + 1;
    this.runId = this.runCount;
    this.runSteps = 0; this.runDeaths = 0;
    this.runs.push({ id: this.runId, startedAt: Date.now(), steps: 0, deaths: 0 });
    if (this.runs.length > 60) this.runs = this.runs.slice(-60);
    this.save();
  };
  Learner.prototype.endRun = function () {
    var cur = null;
    for (var i = this.runs.length - 1; i >= 0; i--) {
      if (this.runs[i].id === this.runId) { cur = this.runs[i]; break; }
    }
    if (cur) { cur.steps = this.runSteps; cur.deaths = this.runDeaths; }
    this.save();
  };
  Learner.prototype.wipe = function () {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    try { localStorage.removeItem(LS_KEY_V1); } catch (e2) {}
    var keep = { alpha: this.alpha, gamma: this.gamma, epsFixed: this.epsFixed };
    var fresh = new Learner(keep);
    // fresh constructor already started run #1; copy over (drops old runs)
    for (var k in fresh) this[k] = fresh[k];
  };
  Learner.prototype.exportJSON = function () {
    this.endRun();
    return JSON.stringify({ app: 'smw-brain', v: 3, w: this.w,
      danger: this.danger, deaths: this.deaths, exits: this.exits,
      steps: this.steps, runs: this.runs, runCount: this.runCount,
      progress: this.progress, audioEvents: this.audioEvents,
      failCounts: this.failCounts, segMap: this.segMap, actFx: this.actFx,
      textReads: this.textReads || 0 }, null, 1);
  };
  Learner.prototype.importJSON = function (text) {
    var s = JSON.parse(text);
    var w = normalizeW(s.w);
    if (!w) throw new Error('bad brain file');
    this.w = w;
    this.danger = s.danger || {}; this.deaths = s.deaths || [];
    this.exits = s.exits || {}; this.steps = s.steps || 0;
    this.runs = s.runs || []; this.runCount = s.runCount || this.runs.length;
    this.progress = s.progress || {}; this.audioEvents = s.audioEvents || 0;
    this.failCounts = s.failCounts || {}; this.segMap = s.segMap || {};
    this.actFx = s.actFx || {}; this.textReads = s.textReads || 0;
    this.startRun(); // imported past + fresh current run
    this.save();
  };
  Learner.prototype.knowledgeSummary = function () {
    return { runs: this.runCount, steps: this.steps, deaths: this.deaths.length,
      levels: Object.keys(this.exits).length,
      dangerSpots: Object.keys(this.danger).reduce(function (s, k) { return s + this.danger[k].length; }.bind(this), 0),
      audioEvents: this.audioEvents };
  };

  // --- scroll dx from consecutive full frames (32px SAD, tie->0, gate) ---
  function down32(img) {
    var w = img.width, h = img.height, d = img.data;
    var out = new Float32Array(32 * 32);
    var sx = w / 32, sy = h / 32;
    for (var y = 0; y < 32; y++) {
      for (var x = 0; x < 32; x++) {
        var px = Math.min(w - 1, (x * sx) | 0), py = Math.min(h - 1, (y * sy) | 0);
        var o = (py * w + px) * 4;
        out[y * 32 + x] = (0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2]) / 255;
      }
    }
    return out;
  }
  function scrollDx(prev, cur) {
    var best = 0, bestCost = Infinity;
    var order = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8];
    for (var k = 0; k < order.length; k++) {
      var dx = order[k], cost = 0;
      for (var y = 8; y < 24; y++) {
        for (var x = 8; x < 24; x++) {
          var xb = x + dx;
          if (xb < 0 || xb >= 32) { cost += 0.25; continue; }
          cost += Math.abs(prev[y * 32 + x] - cur[y * 32 + xb]);
        }
      }
      if (cost < bestCost - 1e-9) { bestCost = cost; best = dx; }
    }
    if (bestCost > 40) return { dx: 0, dy: 0, conf: 0 };
    var dxOut = -best;
    // vertical pass at the winning horizontal shift
    var bestDy = 0, bestDyCost = Infinity;
    for (var k2 = 0; k2 < order.length; k2++) {
      var dy = order[k2], cost2 = 0;
      for (var y2 = 8; y2 < 24; y2++) {
        for (var x2 = 8; x2 < 24; x2++) {
          var yb = y2 + dy, xb2 = x2 + best;
          if (yb < 0 || yb >= 32 || xb2 < 0 || xb2 >= 32) { cost2 += 0.25; continue; }
          cost2 += Math.abs(prev[y2 * 32 + x2] - cur[yb * 32 + xb2]);
        }
      }
      if (cost2 < bestDyCost - 1e-9) { bestDyCost = cost2; bestDy = dy; }
    }
    return { dx: dxOut, dy: -bestDy, conf: bestCost > 40 ? 0 : 1 };
  }

  function hashFrame(small) {
    var h1 = 0x811c9dc5;
    for (var i = 0; i < small.length; i += 7) {
      h1 ^= (small[i] * 255) | 0;
      h1 = Math.imul(h1, 0x01000193) >>> 0;
    }
    return h1.toString(36);
  }

  // Hard cut? mean abs diff over the whole 32x32 (scroll shifts only move
  // pixels a little; a cut changes nearly everything). Plus frame variance
  // so flat fade/flash frames are never hashed as "places".
  function frameDiff(a, b) {
    var s = 0;
    for (var i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
    return s / a.length;
  }
  function frameVar(small) {
    var m = 0;
    for (var i = 0; i < small.length; i++) m += small[i];
    m /= small.length;
    var v = 0;
    for (var j = 0; j < small.length; j++) { var d = small[j] - m; v += d * d; }
    return v / small.length;
  }

  // --- features (vision + progress + ears) ---
  Learner.prototype.featurize = function (obs, dx, audio) {
    var x = new Array(NF).fill(0);
    x[F.bias] = 1;
    if (obs.wallAhead) x[F.wall] = 1;
    if (obs.pitAhead) x[F.pit] = 1;
    var p = obs.player;
    for (var i = 0; i < obs.enemies.length; i++) {
      var e = obs.enemies[i];
      if (e.threat === 0 || !p) continue;
      var ahead = e.x > p.x, near = e.dist < 44, close = e.dist < 22;
      if (near && ahead) x[F.enemyAhead] = 1;
      if (near && e.y < p.y - p.h) x[F.enemyAbove] = 1;
      // close-panic ONLY on confirmed threats; color suspects cap at 1 and
      // must never drive the Q into a twitch (see app urgency gating).
      if (close && e.threat >= 2) x[F.enemyClose] = 1;
    }
    if (this.dangerAhead()) x[F.danger] = 1;
    if (obs.key) x[F.key] = 1;
    if (obs.keyhole) x[F.keyhole] = 1;
    if (obs.goal) x[F.goal] = 1;
    if (p && Math.abs(p.vy) > 1.2) x[F.air] = 1;
    if (this.isStuck()) x[F.stuck] = 1;
    if (dx > 0) x[F.goingRight] = 1;
    if (obs.closeLatched) x[F.enemyClose] = 1;
    if (audio && audio.audible) {
      if (audio.coinLikely) x[F.hearCoin] = 1;
      if (audio.jumpLikely) x[F.hearJump] = 1;
      if (audio.deathLikely) x[F.hearDanger] = 1;
      if (audio.level > 0.05) x[F.hearLoud] = 1;
      if (!audio.quiet) x[F.hearMusic] = 1;
    }
    if ((obs.anim || 0) > 0.02) x[F.motion] = 1;
    if (obs.needUp) x[F.needUp] = 1;
    if (obs.downOpen) x[F.downOpen] = 1;
    if (this.tabooSpot()) x[F.taboo] = 1;
    if (this.segHazardAhead()) x[F.segHazard] = 1;
    if (obs.ceiling) x[F.ceiling] = 1;
    var kw = (obs.text && obs.text.keywords) || {};
    if (kw.EXIT || kw.GOAL || kw.HOUSE || kw.CLEAR || kw.CASTLE) x[F.textExit] = 1;
    if (kw.KEY || kw.MUSHROOM || kw.COIN || kw.FLOWER || kw.STAR || kw.FEATHER) x[F.textKey] = 1;
    return x;
  };

  Learner.prototype.qx = function () { return Math.round(this.worldX / 20); };
  Learner.prototype.tabooKey = function (aIdx, qx) {
    return this.levelKey + ':' + (qx == null ? this.qx() : qx) + ':' + aIdx;
  };
  Learner.prototype.tabooCount = function (aIdx, qx) {
    if (!this.levelKey) return 0;
    return this.failCounts[this.tabooKey(aIdx, qx)] || 0;
  };
  // Any action ever died at this segment? (state-level caution feature)
  Learner.prototype.tabooSpot = function () {
    if (!this.levelKey) return false;
    var qx = this.qx(), prefix = this.levelKey + ':' + qx + ':';
    for (var k in this.failCounts) {
      if (k.indexOf(prefix) === 0) return true;
    }
    // neighbor segments too (death happened a step away)
    for (var d = -1; d <= 1; d += 2) {
      var p2 = this.levelKey + ':' + (qx + d) + ':';
      for (var k2 in this.failCounts) {
        if (k2.indexOf(p2) === 0) return true;
      }
    }
    return false;
  };
  // Level-build memory: known wall/pit/enemy/death segments just ahead.
  Learner.prototype.segHazardAhead = function () {
    var segs = this.segMap[this.levelKey];
    if (!segs) return false;
    var qx = this.qx();
    for (var d = 1; d <= 3; d++) {
      var s = segs[qx + d];
      if (s && (s.pit || s.wall || s.d || Object.keys(s.en || {}).length)) return true;
    }
    return false;
  };

  Learner.prototype.dangerAhead = function () {
    var zs = this.danger[this.levelKey] || [];
    for (var i = 0; i < zs.length; i++) {
      var d = zs[i] - this.worldX;
      if (d > 4 && d < 70) return true;
    }
    return false;
  };
  Learner.prototype.isStuck = function () {
    if (this.dxTrail.length < 20) return false;
    var s = 0;
    for (var i = 0; i < this.dxTrail.length; i++) s += Math.abs(this.dxTrail[i]);
    var sy = 0;
    if (this.dyTrail) for (var j = 0; j < this.dyTrail.length; j++) sy += Math.abs(this.dyTrail[j]);
    return (s + sy) < 3; // any-axis movement counts (top-down/arena move freely)
  };

  // Runtime genre: header title guesses, camera behavior proves. Evidence
  // windows (~90 textured gameplay frames) vote; votes DECAY each window
  // so sustained gameplay always outvotes stale menu/title evidence — menus
  // can never deadlock the genre again. Frozen standby frames (title
  // logo, paused cutscene: no motion, no text) don't vote at all.
  // Classes: scrollerH (camera runs sideways), scrollerV (camera runs
  // vertically), arena (free avatar, fixed camera), menu (text, static).
  Learner.prototype.classifyRuntime = function () {
    var g = this.gAcc;
    var n = Math.max(1, g.n);
    var ax = g.ax / n, ay = g.ay / n, px = g.px / n, py = g.py / n;
    var txt = g.txt / n;
    this.gAcc = { ax: 0, ay: 0, px: 0, py: 0, pl: 0, n: 0, txt: 0 };
    // standby: frozen world, nobody home — title screens, still cutscenes.
    // Voting here is how menus used to poison the genre forever.
    if (ax + ay + px + py < 0.08 && txt < 0.3) {
      this.genreWatch = { state: 'standby', n: n };
      return;
    }
    var id = 'arena', conf = 0.5;
    var pl = g.pl / n;
    // menu ONLY when text dominates AND no avatar is tracked (file select,
    // not a mid-level message box — those have a live player sprite).
    if (txt > 0.55 && ax < 0.15 && px < 0.4 && pl < 0.4) { id = 'menu'; conf = 0.7; }
    else if (ax > 0.35 && ax > ay * 2) { id = 'scrollerH'; conf = Math.min(0.95, 0.5 + ax); }
    else if (ay > 0.3 && ay > ax * 2) { id = 'scrollerV'; conf = Math.min(0.95, 0.5 + ay); }
    else if (px + py > 0.8 && ax < 0.2 && ay < 0.2) { id = 'arena'; conf = 0.65; }
    else if (ax > 0.15 || ay > 0.15) { id = ax >= ay ? 'scrollerH' : 'scrollerV'; conf = 0.55; }
    this.runtimeVotes = this.runtimeVotes || {};
    // decay: old evidence fades so the CURRENT game always wins eventually
    for (var k in this.runtimeVotes) {
      this.runtimeVotes[k] *= 0.6;
      if (this.runtimeVotes[k] < 0.25) delete this.runtimeVotes[k];
    }
    this.runtimeVotes[id] = (this.runtimeVotes[id] || 0) + 1;
    // menu is weak evidence (a text box could be anything): it only wins
    // with a full double vote. Motion classes decide among themselves.
    var bestM = null, bestMV = 0, menuV = this.runtimeVotes['menu'] || 0;
    for (var k2 in this.runtimeVotes) {
      if (k2 === 'menu') continue;
      if (this.runtimeVotes[k2] > bestMV) { bestMV = this.runtimeVotes[k2]; bestM = k2; }
    }
    var useId, useV;
    if (menuV >= 2 && menuV >= bestMV) { useId = 'menu'; useV = menuV; }
    else { useId = bestM || id; useV = bestMV || 0; }
    var CONFIRM = 1.5;
    if (useV >= CONFIRM && useId !== this.runtimeGenre) {
      this.runtimeGenre = useId;
      this.runtimeConf = (useId === id) ? conf : conf * 0.8;
      this.applyGenreBias();
    } else if (!this.runtimeGenre && useId !== 'menu' && useV >= 1) {
      // provisional: first motion evidence already re-aims (at reduced
      // confidence); the next agreeing window confirms.
      this.runtimeGenre = useId;
      this.runtimeConf = conf * 0.6;
      this.applyGenreBias();
    }
    this.genreWatch = { state: 'voted', id: id, best: useId, bestV: Math.round(useV * 10) / 10 };
  };

  // Genre bias: runtime truth re-aims the prior (header profile stays as the
  // tiebreak). ScrollerV aims UP, arena explores radially + waits, menu
  // mostly waits and taps through text.
  Learner.prototype.applyGenreBias = function () {
    var g = this.runtimeGenre || 'scrollerH';
    this.gb = { right: 1, up: 1, down: 1, wait: 1 };
    if (g === 'scrollerV') { this.gb.up = 1.6; this.gb.right = 0.6; }
    else if (g === 'arena') { this.gb.right = 0.8; this.gb.up = 1.1; this.gb.down = 1.1; this.gb.wait = 1.4; }
    else if (g === 'menu') { this.gb.wait = 2.2; this.gb.right = 0.4; this.gb.up = 0.5; this.gb.down = 0.5; }
  };

  // Per-game control map: what does each input DO in THIS game? Measured
  // from experience (actFx), keyed by game id so Mario knowledge never
  // leaks into a Zelda brain. bars: avg dx/dy per action + confidence.
  Learner.prototype.setGame = function (gameId, title) {
    if (gameId && gameId !== this.gameId) {
      this.gameId = gameId;
      this.gameTitle = title || gameId;
      this.controls = {}; // fresh discovery per cartridge
      this.runtimeGenre = null;
      this.runtimeVotes = {};
      this.gAcc = { ax: 0, ay: 0, px: 0, py: 0, pl: 0, n: 0, txt: 0 };
      this.gb = { right: 1, up: 1, down: 1, wait: 1 };
    }
  };
  Learner.prototype.controlMap = function () {
    // marginal button effects from actFx: arrow-only rows isolate the d-pad,
    // jump rows isolate B/A. Returns {right:{dx,n},...,jumpB:{vy,n},...}.
    var out = {};
    function avg(e) { return e && e.n ? { dx: e.sx / e.n, dy: e.sy / e.n, n: e.n, d: e.d || 0 } : null; }
    var names = { left: 'left', right: 'right', up: 'up', down: 'down' };
    for (var k in names) {
      var idx = actionIdx(k, 0, 0);
      var e = avg(this.actFx[idx]);
      if (e && e.n >= 6) out[k] = e;
    }
    var jb = avg(this.actFx[actionIdx('right', 0, 1)]);
    var ja = avg(this.actFx[actionIdx('right', 0, 2)]);
    if (jb && jb.n >= 6) out.jumpB = jb;
    if (ja && ja.n >= 6) out.jumpA = ja;
    return out;
  };
  Learner.prototype.controlsLearned = function () {
    var cm = this.controlMap();
    return Object.keys(cm).length;
  };
  // Game profile: what cartridge is loaded and how should the prior lean?
  // Set from the ROM header title (see js/gameid.js). Only nudges the
  // heuristic prior — every real lesson still comes from playing.
  Learner.prototype.setProfile = function (profileId, label) {
    var pb = { right: 1, up: 1, down: 1, spin: 1 };
    try {
      var all = (window.GameID && window.GameID.PROFILES) || {};
      var p = all[profileId] || all.generic || {};
      if (p.right) pb.right = p.right;
      if (p.up) pb.up = p.up;
      if (p.down) pb.down = p.down;
      if (p.spin) pb.spin = p.spin;
    } catch (e) {}
    this.pb = pb;
    this.profileId = profileId || 'generic';
    this.profileLabel = label || this.profileId;
  };

  // Heuristic prior: suggests (never commands). Genre-aware: the runtime
  // genre bias (gb) re-aims it — scrollerV climbs, arena waits/rotates,
  // menu mostly waits — and WAIT gets a real value so "look first" can win.
  Learner.prototype.prior = function (aIdx, obs) {
    var a = ACTIONS[aIdx];
    var pb = this.pb || { right: 1, up: 1, down: 1, spin: 1 };
    var gb = this.gb || { right: 1, up: 1, down: 1, wait: 1 };
    var wPrior = 1.6 / (1 + this.steps / 400);
    var danger = obs.wallAhead || obs.pitAhead || this.dangerAhead() || this.segHazardAhead();
    var enemyJump = obs.closeLatched;
    if (!enemyJump && obs.player) {
      for (var i = 0; i < obs.enemies.length; i++) {
        var e = obs.enemies[i];
        if (e.threat >= 2 && e.dist < 40 && e.x > obs.player.x - 6) { enemyJump = true; break; }
      }
    }
    var b = 0;
    var px = obs.player ? obs.player.x : null;
    if (!a.arrow) {
      // WAIT: valuable when lost, frozen, reading, or in menus — and in
      // arenas patience beats pacing.
      b = 0.35 * gb.wait;
      if (!obs.player || obs.messageOpen) b = Math.max(b, 0.8 * gb.wait);
    }
    if (a.arrow === 'right' && a.run === 1 && a.jump === 0) b = 0.7 * pb.right * gb.right;
    if (danger && a.arrow === 'right' && a.run === 1 && a.jump === 1) b = Math.max(b, 1.4 * pb.right * gb.right);
    if (danger && a.arrow === 'right' && a.run === 1 && a.jump === 2) b = Math.max(b, 1.2 * pb.right * pb.spin * gb.right);
    if ((obs.needUp || (obs.wallAhead && this.isStuck())) && a.arrow === 'up') {
      b = Math.max(b, (a.jump ? 1.5 : 0.9) * pb.up * gb.up);
    }
    if (obs.downOpen && a.arrow === 'down') b = Math.max(b, 0.6 * pb.down * gb.down);
    if (this.runtimeGenre === 'scrollerV' && a.arrow === 'up' && a.run === 1 && !a.jump) {
      b = Math.max(b, 0.7 * pb.up * gb.up); // vertical games: UP is progress
    }
    if (this.isStuck() && obs.wallAhead && a.arrow === 'up' && a.jump) b = Math.max(b, 1.0 * pb.up * gb.up);
    if (this.isStuck() && a.arrow === 'left' && !a.jump) b = Math.max(b, 0.4);
    if (obs.key && px != null && obs.key.x < px && a.arrow === 'left') b = Math.max(b, 0.8);
    if (obs.keyhole && (px == null || obs.keyhole.x > px - 10) && a.arrow === 'right') b = Math.max(b, 1.2 * pb.right * gb.right);
    if (obs.goal && px != null && obs.goal.x < px && a.arrow === 'left') b = Math.max(b, 0.9);
    if (a.jump === 2) b = b * (0.7 + 0.3 * pb.spin); // spin appetite per genre
    return b * wPrior;
  };

  Learner.prototype.q = function (x, aIdx, obs) {
    var s = 0, wrow = this.w[aIdx];
    for (var f = 0; f < NF; f++) s += wrow[f] * x[f];
    // Failure taboo: actions that already killed Mario at this segment get a
    // hard penalty — this is what makes it TRY SOMETHING DIFFERENT instead
    // of repeating the fatal move. Scales with repeat count (max ~3.6).
    var taboo = this.tabooCount(aIdx);
    if (taboo > 0) s -= 1.2 * Math.min(taboo, 3);
    return s + this.prior(aIdx, obs);
  };
  Learner.prototype.bestAction = function (x, obs) {
    var bi = 0, bv = -1e9;
    for (var a = 0; a < ACTIONS.length; a++) {
      var v = this.q(x, a, obs);
      if (v > bv) { bv = v; bi = a; }
    }
    return { idx: bi, value: bv };
  };
  var OPPOSITE = { left: 'right', right: 'left', up: 'down', down: 'up' };
  // Best action that is NOT an about-face from `from` (the held action or
  // null). Two anti-mash rules: (1) no boredom reversals (opposite arrow);
  // (2) among near-best candidates (within 0.3 of the top), prefer the one
  // sharing the most buttons with the held action — a gear change (add B)
  // costs 1 input edge, a slot-machine pull costs 6. Measured live: raw
  // rotation flips ~6 buttons every 2s hold (≈6 input changes/sec); overlap
  // preference keeps sustained runs on 0-1 edges/sec.
  Learner.prototype.bestActionNoReverse = function (x, obs, fromIdx) {
    var from = (fromIdx != null && ACTIONS[fromIdx]) ? ACTIONS[fromIdx] : null;
    var ban = (from && from.arrow) ? OPPOSITE[from.arrow] : null;
    function buttons(a) {
      var s = [];
      if (a.arrow) s.push(a.arrow);
      if (a.run) s.push('run');
      if (a.jump === 1) s.push('jmp');
      if (a.jump === 2) s.push('spn');
      return s;
    }
    function overlap(a) {
      if (!from) return 0;
      var fa = buttons(from), ta = buttons(a), n = 0;
      for (var i = 0; i < ta.length; i++) if (fa.indexOf(ta[i]) >= 0) n++;
      return n;
    }
    var bi = -1, bv = -1e9;
    var scored = [];
    for (var a = 0; a < ACTIONS.length; a++) {
      if (ban && ACTIONS[a].arrow === ban) continue;
      var v = this.q(x, a, obs);
      scored.push({ idx: a, v: v });
      if (v > bv) { bv = v; bi = a; }
    }
    if (bi < 0) return this.bestAction(x, obs);
    // compatible winner: best overlap among candidates within 0.3 of top
    var compat = bi, compatOv = -1;
    for (var c = 0; c < scored.length; c++) {
      if (scored[c].v >= bv - 0.3) {
        var ov = overlap(ACTIONS[scored[c].idx]);
        if (ov > compatOv) { compatOv = ov; compat = scored[c].idx; }
      }
    }
    var val = this.q(x, compat, obs);
    return { idx: compat, value: val };
  };

  // Deliberation: narrate the scene in one line so the HUD shows THINKING,
  // not just a button. Returns {text, goal}.
  Learner.prototype.deliberate = function (x, obs) {
    var best = this.bestAction(x, obs);
    var seen = [];
    if (!obs.player) seen.push('no-sprite');
    else {
      seen.push((obs.player.char || 'sprite') + '@' + Math.round(obs.player.x));
      var foes = (obs.enemies || []).filter(function (e) { return e.threat > 0; }).slice(0, 2);
      foes.forEach(function (e) { seen.push(e.type + Math.round(e.dist)); });
      if (obs.pitAhead) seen.push('pit' + (obs.gapW || '?'));
      if (obs.needUp) seen.push('wall-up');
      if (obs.key) seen.push('key');
      if (obs.goal) seen.push('goal');
      if (obs.text && obs.text.text) seen.push('"' + obs.text.text.slice(0, 24) + '"');
    }
    var a = ACTIONS[best.idx];
    var intent = !a.arrow ? 'wait+look' :
      (a.arrow === 'right' ? 'advance' : a.arrow === 'left' ? 'retreat' :
       a.arrow === 'up' ? 'climb' : 'drop') +
      (a.jump === 1 ? '+jump' : a.jump === 2 ? '+spin' : '') +
      (a.run ? '+dash' : '');
    var why = this.reason(obs, best.idx);
    return { idx: best.idx, value: best.value,
      text: seen.join(' ') + ' → ' + intent + (why ? ' (' + why + ')' : '') };
  };

  // Why this action HERE — the actual grounds, for the HUD and the log.
  Learner.prototype.reason = function (obs, aIdx) {
    var a = ACTIONS[aIdx];
    if (!a || !a.arrow) {
      if (!obs.player) return 'lost sprite, hold still';
      if (obs.messageOpen) return 'reading message';
      return 'observe first';
    }
    if (obs.pitAhead && a.arrow === 'right' && a.jump) return 'pit edge, jump it';
    if (obs.needUp && a.arrow === 'up') return 'wall above, climb';
    if (obs.downOpen && a.arrow === 'down') return 'shaft below';
    var p = obs.player;
    for (var i = 0; i < (obs.enemies || []).length; i++) {
      var e = obs.enemies[i];
      if (e.threat >= 2 && e.dist < 26) {
        if (a.jump) return 'dodging ' + e.type;
      }
    }
    if (obs.key && a.arrow === 'left') return 'fetch key';
    if (obs.goal) return 'to goal';
    if (this.tabooCount(aIdx) > 0) return 'avoiding last death';
    if (this.dangerAhead() || this.segHazardAhead()) return 'known danger, careful';
    if (a.arrow === 'right') return 'explore right';
    if (a.arrow === 'left') return 'backtrack';
    return 'deliberate';
  };

  // Coherent experiment (replaces uniform-random): pick ONE sensible thing
  // and let commitment hold it. Never flail: no instant left↔right flips,
  // no random down/up teleports. Returns an action index.
  Learner.prototype.experiment = function (x, obs, curIdx) {
    var cur = ACTIONS[curIdx] || {};
    // Lost / menu / frozen: the only sane experiment is WAIT + look.
    if (!obs.player || obs.messageOpen || obs.fade || obs.fileSelect) return IDLE_IDX;
    var cands = [];
    function consider(idx, wgt) {
      if (idx == null || idx < 0 || idx >= ACTIONS.length) return;
      if (idx === curIdx) return;
      // forbid ALL instant reversals in experiments (even jump-turns):
      // about-faces need a reason, and reasons go through the urgent path,
      // never through random exploration.
      var na = ACTIONS[idx];
      if (cur.arrow === 'left' && na.arrow === 'right') return;
      if (cur.arrow === 'right' && na.arrow === 'left') return;
      if (cur.arrow === 'up' && na.arrow === 'down') return;
      if (cur.arrow === 'down' && na.arrow === 'up') return;
      cands.push({ idx: idx, w: wgt * (0.5 + Math.random()) });
    }
    // context-sensible candidates first
    if (obs.needUp || obs.wallAhead) {
      consider(actionIdx('up', 1, 1), 3); consider(actionIdx('up', 0, 1), 2);
    }
    if (obs.downOpen) consider(actionIdx('down', 0, 0), 2);
    var nearFoe = false;
    for (var i = 0; i < (obs.enemies || []).length; i++) {
      if (obs.enemies[i].threat >= 2 && obs.enemies[i].dist < 40) { nearFoe = true; break; }
    }
    if (nearFoe) {
      consider(actionIdx('right', 1, 1), 3); consider(actionIdx('right', 1, 2), 2);
    }
    if (this.isStuck()) {
      consider(actionIdx('up', 1, 1), 2); consider(actionIdx('left', 0, 0), 1);
      consider(IDLE_IDX, 1);
    }
    // always-sane: keep going, wait+look, walk (no frantic jump spam)
    consider(actionIdx('right', 1, 0), 2);
    consider(actionIdx('right', 0, 0), 1);
    consider(IDLE_IDX, 1);
    if (!cands.length) return curIdx;
    // weight by learned Q a little: prefer experiments that don't look fatal
    var best = cands[0], bestS = -1e9;
    for (var c = 0; c < cands.length; c++) {
      var s = cands[c].w + this.q(x, cands[c].idx, obs) * 0.3 -
        this.tabooCount(cands[c].idx) * 1.5;
      if (s > bestS) { bestS = s; best = cands[c]; }
    }
    return best.idx;
  };

  // --- rewards: mario-ai table for scrollers, curiosity everywhere ----
  // xReward is the original SMW table (right = progress). progressReward
  // generalizes: vertical scrollers reward UP, arenas reward displacement +
  // novelty, menus reward almost nothing (patience). Every genre pays a
  // first-visit curiosity bonus — that's how new games get explored.
  Learner.prototype.xReward = function (dx) {
    if (dx >= 2) return 1.0;
    if (dx >= 1) return 0.5;
    if (dx === 0) return -0.5;
    if (dx === -1) return -1.0;
    return -1.5;
  };
  Learner.prototype.progressReward = function (dx, dy, firstVisit) {
    var g = this.runtimeGenre || 'scrollerH';
    var r = 0;
    if (g === 'scrollerV') {
      // camera dy>0 means the world moved down = avatar climbed
      if (dy >= 2) r = 1.0;
      else if (dy >= 1) r = 0.5;
      else if (dy === 0) r = -0.3;
      else r = -1.0;
      if (dx > 0) r += 0.1;
    } else if (g === 'arena') {
      var disp = Math.abs(dx) + Math.abs(dy);
      r = disp >= 2 ? 0.4 : (disp >= 1 ? 0.2 : -0.2);
    } else if (g === 'menu') {
      r = -0.05; // patience: tiny tick, text events carry the signal
    } else {
      r = this.xReward(dx);
    }
    if (firstVisit) r += 0.6; // curiosity: new ground matters in any game
    return r;
  };

  // --- main step: observe pixels + sound, learn, act ---
  // img: ImageData of the FULL framebuffer (entire 256x224 game frame, never
  // cropped). vision: SMWVision.Vision instance. audio: {audible, level,
  // bass, mid, high, onset, coinLikely, jumpLikely, deathLikely, quiet}.
  // forced (optional): {arrow, run, jump} — the HUMAN's actual action when
  // the AI is watching you play. The brain still does its TD update, earns
  // the same rewards, records deaths/danger/exits — it just learns from
  // YOUR move instead of choosing its own (learning from demonstration).
  // Returns {action, actionStr, reward, dx, stuck, epsilon, explored, watched,
  // obs, audio, dying, worldX, levelKey}
  Learner.prototype.step = function (img, vision, audio, forced) {
    var small = down32(img);
    var sc = this.prevSmall ? scrollDx(this.prevSmall, small) : { dx: 0, dy: 0, conf: 0 };
    var dx = sc.dx, dy = sc.dy || 0;
    var cut = this.prevSmall ? frameDiff(this.prevSmall, small) > 0.35 : false;
    var textured = frameVar(small) > 0.002;
    this.prevSmall = small;
    var obs = vision.analyze(img);
    obs.dy = dy;
    this.worldX += dx;
    this.worldY = (this.worldY || 0) + dy;
    // Runtime genre evidence: what does this game ACTUALLY do? (header
    // profile is a guess; camera + avatar behavior is the truth.)
    this.gAcc = this.gAcc || { ax: 0, ay: 0, px: 0, py: 0, pl: 0, n: 0, txt: 0 };
    if (!cut && !obs.fade && textured) {
      this.gAcc.ax += Math.abs(dx); this.gAcc.ay += Math.abs(dy);
      if (obs.player) {
        this.gAcc.px += Math.abs(obs.player.vx || 0);
        this.gAcc.py += Math.abs(obs.player.vy || 0);
        this.gAcc.pl++;
      }
      if (obs.text && obs.text.text) this.gAcc.txt++;
      this.gAcc.n++;
      if (this.gAcc.n >= 90) this.classifyRuntime();
    }
    if (this.levelKey) {
      this.progress = this.progress || {};
      if (this.worldX > (this.progress[this.levelKey] || 0)) {
        this.progress[this.levelKey] = Math.round(this.worldX);
      }
      // Level-build memory: what does this segment contain? (visited count,
      // walls, pits, enemy types.) This is how it "sees the build" — the map
      // accumulates across runs and warns (segHazard) before re-entry.
      var qx0 = this.qx();
      var segMap0 = this.segMap[this.levelKey] || (this.segMap[this.levelKey] = {});
      var segKeys0 = Object.keys(segMap0);
      if (segKeys0.length < 120 || segMap0[qx0]) {
        var sg0 = segMap0[qx0] || (segMap0[qx0] = { v: 0, wall: 0, pit: 0, en: {}, d: 0 });
        sg0.v++;
        if (obs.wallAhead) sg0.wall = 1;
        if (obs.pitAhead) sg0.pit = 1;
        for (var sgi = 0; sgi < Math.min(3, obs.enemies.length); sgi++) {
          var se = obs.enemies[sgi];
          if (se.threat > 0) sg0.en[se.type] = (sg0.en[se.type] || 0) + 1;
        }
      }
    }
    this.dxTrail.push(dx);
    if (this.dxTrail.length > 24) this.dxTrail.shift();
    this.dyTrail = this.dyTrail || [];
    this.dyTrail.push(dy);
    if (this.dyTrail.length > 24) this.dyTrail.shift();

    // level identity: hard cuts re-hash immediately; fades re-hash on exit.
    // enterLevel also runs for same-hash (the death-respawn path).
    if (cut && textured) {
      this.enterLevel(hashFrame(small), obs, vision, audio);
      this.fadeFrames = 0;
    } else if (obs.fade) {
      this.fadeFrames++;
      if (this.lostFrames > 0) {
        this.deathFadeLost = Math.max(this.deathFadeLost || 0, this.lostFrames);
      }
    }
    else {
      if (this.fadeFrames > 4 && textured) { // just came out of a transition
        this.enterLevel(hashFrame(small), obs, vision, audio);
      }
      this.fadeFrames = 0;
    }
    if (!this.levelKey) this.enterLevel(hashFrame(small), obs, vision, audio);

    // track key/keyhole sightings for secret-exit credit
    if (obs.key) this.keySeenLevel = true;
    if (obs.keyhole) {
      this.keyholeSeenLevel = true;
      if (this.keySeenLevel && obs.player &&
          Math.abs(obs.keyhole.x - obs.player.x) < 20) this.keyholeTouched = true;
    }

    // Read words change the books (once per level — the same GAME OVER frame
    // repeats for seconds, and must not count 60 deaths).
    var tkw = (obs.text && obs.text.keywords) || {};
    if (obs.text && obs.text.text) this.textReads = (this.textReads || 0) + 1;
    if ((tkw['GAME OVER']) && !this.overCounted) {
      this.overCounted = this.levelKey || 'nolvl';
      if (this.worldX > 5 || (this.deathFadeLost || 0) >= 4) {
        this.registerDeath(vision, audio, 'text:GAME OVER');
      }
    }
    if ((tkw.CLEAR || tkw['COURSE CLEAR']) && !this.clearCounted && this.levelKey) {
      this.clearCounted = this.levelKey;
      var crec = this.exits[this.levelKey] || { normal: false, secret: false };
      crec.normal = true;
      this.exits[this.levelKey] = crec;
      this.save();
    }

    var x = this.featurize(obs, dx, audio);
    // A message box freezes the world: dx==0 is not failure, it's furniture.
    // Punishing it is pure noise that drowns real lessons, so score it 0.
    // firstVisit curiosity is computed from the segment map (v===1 = new).
    var firstVisit = false;
    try {
      var sv = this.segMap[this.levelKey] && this.segMap[this.levelKey][this.qx()];
      firstVisit = !!(sv && sv.v === 1);
    } catch (e) {}
    var r = obs.messageOpen ? 0 : this.progressReward(dx, dy, firstVisit);
    var eventR = 0, eventName = '';
    if (obs.whiteBurst) { eventR += 0.5; eventName = 'stomp+'; }
    if (obs.key && !this.keySeenLevel) { /* already set; bonus once */ }
    if (this.dangerAhead() && dx > 0) eventR -= 0.2;
    // Ears confirm eyes: coin jingle, death sting (audio + vision agree).
    var aDesc = '';
    if (audio && audio.audible) {
      this.lastAudio = audio;
      if (audio.coinLikely) {
        eventR += 0.6; eventName = (eventName ? eventName + '+' : '') + 'coin♪';
        this.audioEvents++;
        aDesc = 'coin♪';
      }
      if (audio.deathLikely) {
        // Bangs (cannon fire) also trip this detector — only believe it as
        // a death sting when Mario is actually gone/fading; otherwise it is
        // just a loud level and only feeds the hearDanger feature.
        if (!obs.player || obs.fade) {
          eventR -= 1.0; eventName = (eventName ? eventName + '+' : '') + 'sting♪';
          this.audioEvents++;
        }
        aDesc += (aDesc ? '+' : '') + 'sting♪';
      }
      if (audio.jumpLikely) {
        eventR += 0.05;
        this.audioEvents++;
        if (!aDesc) aDesc = 'jump♪';
      }
    }

    // death watch: track lost while fading, confirm on respawn in same level
    var dying = false;
    if (!obs.player) {
      this.lostFrames++;
      if (this.lostFrames >= 3 && obs.fade) dying = true;
    } else {
      if (this.lostFrames >= 3 && obs.fade === false && this.fadeFrames === 0) {
        // reappeared without a level change: could be a blink; real deaths
        // reload the level (handled in enterLevel via cause + worldX reset)
      }
      this.lostFrames = 0;
    }

    // TD update for the PREVIOUS transition (s,a,r,s')
    if (this.last) {
      var nxt = this.bestAction(x, obs);
      var target = this.last.r + this.gamma * nxt.value;
      var cur = this.q(this.last.x, this.last.a, obs);
      var td = target - cur;
      var row = this.w[this.last.a];
      for (var f = 0; f < NF; f++) row[f] += this.alpha * td * this.last.x[f];
      this.rewardEMA = this.rewardEMA * 0.995 + this.last.r * 0.005;
    }

    // DELIBERATE choice with HYSTERESIS. Proven defect (measured 24 distinct
    // actions in 100 identical steps at eps=0.04): TD updates rotate the
    // argmax every step, so "best action" chatters — that IS button mashing.
    // Second proven defect: urgency bypassed holds, re-picking the chattering
    // argmax every tick whenever needUp/pit/message latched (6 inputs/sec
    // sustained). Fix: ONE hold system — calm or urgent, a pick rides 16
    // steps; only a fresh urgency escalates, only its passing stands down.
    var eps = this.epsilon(), aIdx, explored = false, watched = false;
    var deliberate = this.deliberate(x, obs);
    var HOLD_STEPS = 16;
    var urgent = !!(obs.pitAhead || obs.messageOpen || obs.needUp || obs.closeLatched);
    if (forced) {
      watched = true;
      aIdx = -1;
      for (var fa = 0; fa < ACTIONS.length; fa++) {
        if ((ACTIONS[fa].arrow || null) === (forced.arrow || null) &&
            (ACTIONS[fa].run ? 1 : 0) === (forced.run ? 1 : 0) &&
            (ACTIONS[fa].jump || 0) === (forced.jump || 0)) {
          aIdx = fa; break;
        }
      }
      if (aIdx < 0) aIdx = deliberate.idx; // fallback, still learns
      this.holdA = aIdx; this.holdN = 0;
    } else {
      // One hold system for calm AND urgent: a fresh urgency escalates
      // immediately (new hold), a cleared urgency stands down (rethink once),
      // otherwise the hold rides its full 16 steps. Urgency without holds
      // re-picks the chattering argmax every tick — the back door mashing
      // walked through (measured 6 input changes/sec with needUp latched).
      var holding = (this.holdA != null && this.holdN < HOLD_STEPS);
      var escalate = holding && urgent && !this.holdUrgent;
      var standDown = holding && !urgent && this.holdUrgent;
      if (holding && !escalate && !standDown) {
        aIdx = this.holdA;
        this.holdN++;
      } else if (urgent) {
        // safety first: pits, messages, climbs, confirmed-close threats
        if (Math.random() < eps && !obs.messageOpen) {
          aIdx = this.experiment(x, obs, deliberate.idx);
          explored = true;
        } else {
          aIdx = deliberate.idx;
        }
        this.holdA = aIdx; this.holdN = 0; this.holdUrgent = true;
      } else {
        // calm hold boundary: scheduled coherent experiment or best
        // deliberation — never a boredom about-face, prefer button-
        // compatible holds (see bestActionNoReverse).
        var heldIdx = (this.holdA != null && ACTIONS[this.holdA]) ? this.holdA : null;
        if (Math.random() < eps) {
          aIdx = this.experiment(x, obs, deliberate.idx);
          explored = true;
        } else {
          aIdx = this.bestActionNoReverse(x, obs, heldIdx).idx;
        }
        this.holdA = aIdx; this.holdN = 0; this.holdUrgent = false;
      }
    }
    this.last = { x: x, a: aIdx, r: r + eventR };
    // Self-identification feed: tell vision what was HELD so the next
    // frame's sprite displacements get attributed to this input. This is
    // how the avatar lock learns "that moving thing is ME" in any game.
    try { if (vision && vision.noteInput) vision.noteInput(ACTIONS[aIdx]); } catch (e) {}
    // Button-effect lab: what did this action actually DO? (avg dx, avg
    // vertical velocity, death rate.) This is the record of what each SNES
    // button does, learned from experience, shown in the HUD.
    var fx = this.actFx[aIdx] || (this.actFx[aIdx] = { n: 0, sx: 0, sy: 0, d: 0 });
    fx.n++; fx.sx += dx; fx.sy += (obs.player ? obs.player.vy : 0);
    // Short trail for multi-step death blame (what led to the fatal moment).
    this.trail.push({ a: aIdx, x: x });
    if (this.trail.length > 10) this.trail.shift();
    this.steps++;
    this.runSteps++;
    // live-update current run row
    var cur = null;
    for (var ri = this.runs.length - 1; ri >= 0; ri--) {
      if (this.runs[ri].id === this.runId) { cur = this.runs[ri]; break; }
    }
    if (cur) { cur.steps = this.runSteps; cur.deaths = this.runDeaths; }
    if (this.steps % 25 === 0) this.save();

    // thought must describe the TAKEN action, not the pre-hold argmax
    var thought = deliberate.text;
    if (ACTIONS[aIdx] !== ACTIONS[deliberate.idx]) {
      var ta = ACTIONS[aIdx];
      var tintent = !ta.arrow ? 'wait+look' :
        (ta.arrow === 'right' ? 'advance' : ta.arrow === 'left' ? 'retreat' :
         ta.arrow === 'up' ? 'climb' : 'drop') +
        (ta.jump === 1 ? '+jump' : ta.jump === 2 ? '+spin' : '') +
        (ta.run ? '+dash' : '');
      thought = deliberate.text.split(' → ')[0] + ' → ' + tintent +
        ' (' + this.reason(obs, aIdx) + ')';
    }
    return { action: ACTIONS[aIdx], actionStr: actionStr(ACTIONS[aIdx]),
      reward: { x: r, event: eventR, total: r + eventR, eventName: eventName },
      dx: dx, stuck: this.isStuck(), epsilon: eps, explored: explored,
      watched: watched, thought: thought,
      obs: obs, audio: audio || null, audioDesc: aDesc,
      dying: dying, worldX: this.worldX, levelKey: this.levelKey };
  };

  Learner.prototype.enterLevel = function (hk, obs, vision, audio) {
    // Same visual hash after a fade: a death-respawn (not a new place).
    // Loose gate: progress made, or a long track-loss through the fade.
    if (hk === this.levelKey) {
      if ((this.worldX > 20 || (this.deathFadeLost || 0) >= 8) && this.steps > 0) {
        this.registerDeath(vision, audio || this.lastAudio);
      }
    } else {
      // Departure. An immediate return (A->B->A) is a pipe/door round-trip
      // and confirms nothing; otherwise confirm the staged exit, then stage
      // the new departure (secret flag captured before entry resets it).
      // Real completions always pass through the overworld map, so a chain
      // of distinct places is genuine progression.
      var secret = this.keyholeTouched || (this.keySeenLevel && this.keyholeSeenLevel);
      var prog = Math.max(this.worldX, (this.progress && this.progress[this.levelKey]) || 0);
      var staged = (this.levelKey && prog > 60) ?
        { from: this.levelKey, secret: secret } : null;
      if (hk === this.prevLevel) {
        this.pendingExit = null;
      } else {
        if (this.pendingExit && this.pendingExit.from !== hk) {
          var rec = this.exits[this.pendingExit.from] || { normal: false, secret: false };
          if (this.pendingExit.secret) rec.secret = true; else rec.normal = true;
          this.exits[this.pendingExit.from] = rec;
        }
        this.pendingExit = staged;
      }
      this.prevLevel = this.levelKey;
      if (hk !== this.levelKey) {
        this.levelIndex++;
        this.levelKey = hk;
        this.keySeenLevel = !!obs.key;
        this.keyholeSeenLevel = !!obs.keyhole;
        this.keyholeTouched = false;
      }
    }
    this.worldX = 0;
    this.worldY = 0;
    this.dxTrail = [];
    this.dyTrail = [];
    this.lostFrames = 0;
    this.deathFadeLost = 0;
    this.overCounted = null;   // GAME OVER / CLEAR one-shots re-arm per level
    this.clearCounted = null;
    this.last = null; // transitions don't cross levels
    this.trail = [];
    if (vision) vision.worldX = 0;
    this.save();
  };

  Learner.prototype.registerDeath = function (vision, audio, forceCause) {
    var cause = forceCause || 'unknown';
    if (!forceCause) {
      try { cause = vision ? vision.deathCause() : 'unknown'; } catch (e) {}
      if (audio && audio.deathLikely && cause === 'unknown') cause = 'sting♪';
      if (audio && audio.deathLikely && cause !== 'unknown') cause += '+sting♪';
    }
    // repeat-death detection: died near a known danger spot again
    var zs = this.danger[this.levelKey] || [];
    for (var i = 0; i < zs.length; i++) {
      if (Math.abs(zs[i] - this.worldX) < 40) { this.repeatDeaths++; break; }
    }
    this.deaths.push({ t: Date.now(), run: this.runId, level: this.levelKey,
      worldX: Math.round(this.worldX), cause: cause });
    if (this.deaths.length > 300) this.deaths = this.deaths.slice(-300);
    zs.push(Math.round(this.worldX));
    this.danger[this.levelKey] = zs.slice(-12); // keep recent danger spots
    this.runDeaths++;
    // Try SOMETHING DIFFERENT next time: record every recent action as fatal
    // at this segment (decaying with distance from the fatal moment), blame
    // each trailed transition hard, and flag the level-build segment.
    var qxd = this.qx(), wxd = Math.round(this.worldX);
    for (var ti = 0; ti < this.trail.length; ti++) {
      var ta = this.trail[ti].a;
      var wgt = (ti + 1) / this.trail.length; // recent actions carry more blame
      var key = this.tabooKey(ta, qxd);
      this.failCounts[key] = (this.failCounts[key] || 0) + wgt;
      var frow = this.w[ta];
      var tx = this.trail[ti].x;
      if (tx) {
        for (var tf = 0; tf < NF; tf++) frow[tf] += this.alpha * (-3.0) * wgt * tx[tf];
      } else {
        for (var tf2 = 0; tf2 < NF; tf2++) frow[tf2] += this.alpha * (-3.0) * wgt * 0.2;
      }
      var efx = this.actFx[ta];
      if (efx) efx.d++;
    }
    this.trail = [];
    var segMapD = this.segMap[this.levelKey] || (this.segMap[this.levelKey] = {});
    var sgd = segMapD[qxd] || (segMapD[qxd] = { v: 0, wall: 0, pit: 0, en: {}, d: 0 });
    sgd.d++;
    this.save();
  };

  Learner.prototype.stats = function () {
    var exits = Object.keys(this.exits);
    var secrets = exits.filter(function (k) { return this.exits[k].secret; }, this).length;
    var dangerSpots = Object.keys(this.danger).reduce(function (s, k) { return s + this.danger[k].length; }.bind(this), 0);
    var tabooN = Object.keys(this.failCounts).length;
    var segN = Object.keys(this.segMap).reduce(function (s, k) {
      return s + Object.keys(this.segMap[k]).length;
    }.bind(this), 0);
    // Button lab: per-button average effect, most-tried first.
    var lab = [];
    var names = { left: '◀', right: '▶', up: '▲', down: '▼' };
    for (var ai = 0; ai < ACTIONS.length; ai++) {
      var e = this.actFx[ai];
      if (e && e.n >= 8) {
        var a = ACTIONS[ai];
        lab.push((names[a.arrow] || '?') + (a.run ? 'R' : '') +
          (a.jump === 1 ? 'J' : a.jump === 2 ? 'S' : '') +
          ':→' + (e.sx / e.n).toFixed(1) +
          (e.d ? ' ☠' + e.d : ''));
      }
    }
    return { steps: this.steps, deaths: this.deaths.length,
      repeatDeaths: this.repeatDeaths, levels: exits.length, secrets: secrets,
      dangerSpots: dangerSpots, rewardEMA: this.rewardEMA,
      runId: this.runId, runCount: this.runCount, runSteps: this.runSteps,
      runDeaths: this.runDeaths, audioEvents: this.audioEvents,
      tabooN: tabooN, segN: segN, segLevels: Object.keys(this.segMap).length,
      textReads: this.textReads || 0,
      runtimeGenre: this.runtimeGenre || null,
      runtimeConf: this.runtimeConf || 0,
      genreWatch: this.genreWatch || null,
      genreFrames: (this.gAcc && this.gAcc.n) || 0,
      gameId: this.gameId || null,
      controlsN: this.controlsLearned(),
      buttonLab: lab.slice(0, 6),
      runs: this.runs.slice(-5).reverse(),
      lastDeaths: this.deaths.slice(-3).reverse() };
  };

  window.SMWLearn = { Learner: Learner, ACTIONS: ACTIONS, actionStr: actionStr,
    actionIdx: actionIdx, IDLE_IDX: IDLE_IDX, NF: NF, LS_KEY: LS_KEY };
})();
