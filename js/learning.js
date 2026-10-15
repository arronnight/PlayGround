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
  // jump), 2 = A (spin jump — kills what B bounces off). L/R only scroll
  // the camera in SMW and Start/Select only pause, so the menu logic owns
  // those; everything gameplay-meaningful is learned here (24 actions).
  var ARROWS = ['left', 'right', 'up', 'down'];
  var ACTIONS = [];
  ARROWS.forEach(function (arrow) {
    [0, 1].forEach(function (run) {
      [0, 1, 2].forEach(function (jump) {
        ACTIONS.push({ arrow: arrow, run: run, jump: jump });
      });
    });
  });
  // idx = ((arrowIdx*2)+run)*3+jump

  function actionStr(a) {
    var m = { left: 'AL', right: 'AR', up: 'AU', down: 'AD' };
    return m[a.arrow] + (a.run ? '+RUN' : '') +
      (a.jump === 1 ? '+JMP' : a.jump === 2 ? '+SPN' : '');
  }
  function actionIdx(arrow, run, jump) {
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

  // --- persistence (v3: 24 actions x 24 features; migrates v1 12x13, v2 12x18) ---
  function padRow(row) {
    var out = row.slice(0, NF);
    while (out.length < NF) out.push(0);
    return out;
  }
  // Old brains had 12 actions ((arrow3*2+run)*2+jumpB); new has 24
  // ((arrow4*2+run)*3+jumpBA). Shared actions keep their weights; Down and
  // spin-jump rows start at 0 (genuinely new knowledge to gain).
  function normalizeW(w) {
    if (!w || !w.length) return null;
    if (w.length === ACTIONS.length) return w.map(padRow);
    if (w.length === 12) {
      var out = [];
      for (var n = 0; n < ACTIONS.length; n++) out.push(new Array(NF).fill(0));
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
    if (bestCost > 40) return 0;
    return -best;
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
      if (close) x[F.enemyClose] = 1;
    }
    if (this.dangerAhead()) x[F.danger] = 1;
    if (obs.key) x[F.key] = 1;
    if (obs.keyhole) x[F.keyhole] = 1;
    if (obs.goal) x[F.goal] = 1;
    if (p && Math.abs(p.vy) > 1.2) x[F.air] = 1;
    if (this.isStuck()) x[F.stuck] = 1;
    if (dx > 0) x[F.goingRight] = 1;
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
    return s < 3;
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

  // Heuristic prior: suggests (never commands). Deliberately weaker than
  // before so learned Q can overrule it, and it now suggests UP climbs,
  // DOWN drops and backing off — not just run-right.
  Learner.prototype.prior = function (aIdx, obs) {
    var a = ACTIONS[aIdx];
    var pb = this.pb || { right: 1, up: 1, down: 1, spin: 1 };
    var wPrior = 1.6 / (1 + this.steps / 400);
    var danger = obs.wallAhead || obs.pitAhead || this.dangerAhead() || this.segHazardAhead();
    var enemyJump = false;
    if (obs.player) {
      for (var i = 0; i < obs.enemies.length; i++) {
        var e = obs.enemies[i];
        if (e.threat > 0 && e.dist < 40 && e.x > obs.player.x - 6) { enemyJump = true; break; }
      }
    }
    var b = 0;
    var px = obs.player ? obs.player.x : null;
    if (a.arrow === 'right' && a.run === 1 && a.jump === 0) b = 0.7 * pb.right;
    if (danger && a.arrow === 'right' && a.run === 1 && a.jump === 1) b = Math.max(b, 1.4 * pb.right);
    if (danger && a.arrow === 'right' && a.run === 1 && a.jump === 2) b = Math.max(b, 1.2 * pb.right * pb.spin);
    if ((obs.needUp || (obs.wallAhead && this.isStuck())) && a.arrow === 'up') {
      b = Math.max(b, (a.jump ? 1.5 : 0.9) * pb.up);
    }
    if (obs.downOpen && a.arrow === 'down') b = Math.max(b, 0.6 * pb.down);
    if (this.isStuck() && obs.wallAhead && a.arrow === 'up' && a.jump) b = Math.max(b, 1.0 * pb.up);
    if (this.isStuck() && a.arrow === 'left' && !a.jump) b = Math.max(b, 0.4);
    if (obs.key && px != null && obs.key.x < px && a.arrow === 'left') b = Math.max(b, 0.8);
    if (obs.keyhole && (px == null || obs.keyhole.x > px - 10) && a.arrow === 'right') b = Math.max(b, 1.2 * pb.right);
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

  // --- rewards (mario-ai table, rescaled to per-observation dx) ---
  Learner.prototype.xReward = function (dx) {
    if (dx >= 2) return 1.0;
    if (dx >= 1) return 0.5;
    if (dx === 0) return -0.5;
    if (dx === -1) return -1.0;
    return -1.5;
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
    var dx = this.prevSmall ? scrollDx(this.prevSmall, small) : 0;
    var cut = this.prevSmall ? frameDiff(this.prevSmall, small) > 0.35 : false;
    var textured = frameVar(small) > 0.002;
    this.prevSmall = small;
    var obs = vision.analyze(img);
    this.worldX += dx;
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
    var r = obs.messageOpen ? 0 : this.xReward(dx);
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

    // choose action epsilon-greedy — or copy the human when watching
    var eps = this.epsilon(), aIdx, explored = false, watched = false;
    if (forced) {
      watched = true;
      aIdx = -1;
      for (var fa = 0; fa < ACTIONS.length; fa++) {
        if (ACTIONS[fa].arrow === forced.arrow &&
            (ACTIONS[fa].run ? 1 : 0) === (forced.run ? 1 : 0) &&
            (ACTIONS[fa].jump || 0) === (forced.jump || 0)) {
          aIdx = fa; break;
        }
      }
      if (aIdx < 0) aIdx = this.bestAction(x, obs).idx; // fallback, still learns
    } else if (Math.random() < eps) {
      aIdx = (Math.random() * ACTIONS.length) | 0;
      explored = true;
    } else {
      aIdx = this.bestAction(x, obs).idx;
    }
    this.last = { x: x, a: aIdx, r: r + eventR };
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

    return { action: ACTIONS[aIdx], actionStr: actionStr(ACTIONS[aIdx]),
      reward: { x: r, event: eventR, total: r + eventR, eventName: eventName },
      dx: dx, stuck: this.isStuck(), epsilon: eps, explored: explored,
      watched: watched,
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
    this.dxTrail = [];
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
      buttonLab: lab.slice(0, 6),
      runs: this.runs.slice(-5).reverse(),
      lastDeaths: this.deaths.slice(-3).reverse() };
  };

  window.SMWLearn = { Learner: Learner, ACTIONS: ACTIONS, actionStr: actionStr, NF: NF, LS_KEY: LS_KEY };
})();
