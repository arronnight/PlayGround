/* SMW learner: remembers deaths, avoids their spots, hunts exits, improves.
 *
 * What it learns, and where it persists (localStorage `smw-brain-v1`, so
 * knowledge survives reloads = learning across playthroughs):
 *  - Q weights: linear function approximation, Q(s,a) = w[a].x(s), TD(0)
 *    updated from shaped rewards every observation (~8Hz). Starts as the old
 *    run-right heuristic via a decaying prior bonus, then becomes experience.
 *  - Danger map: per-level list of world-X positions where Mario died.
 *    Near a death spot the agent gets cautious (feature + shaping penalty).
 *  - Death log: {level, worldX, cause} with cause from vision (enemy:/pit/fall).
 *  - Exits: per level {normal, secret}. Secret = key carried to a keyhole
 *    (key seen, then keyhole touched, then transition). Normal = goal gate.
 * Actions (12): arrow {left,right,up} x run(Y held) x jump(B held). No Start:
 * the app taps Start as a menu nudge (outside the learned policy, as before).
 */
(function () {
  'use strict';

  var LS_KEY = 'smw-brain-v1';

  // Feature indices (binary). Keep in sync with featurize().
  var F = { bias: 0, wall: 1, pit: 2, enemyAhead: 3, enemyAbove: 4, enemyClose: 5,
    danger: 6, key: 7, keyhole: 8, goal: 9, air: 10, stuck: 11, goingRight: 12 };
  var NF = 13;

  var ACTIONS = [];
  ['left', 'right', 'up'].forEach(function (arrow) {
    [0, 1].forEach(function (run) {
      [0, 1].forEach(function (jump) {
        ACTIONS.push({ arrow: arrow, run: run, jump: jump });
      });
    });
  });
  // 12 actions: idx = arrowBase + run*? (order above: arrow outer, run, jump)

  function actionStr(a) {
    var m = { left: 'AL', right: 'AR', up: 'AU' };
    return m[a.arrow] + (a.run ? '+RUN' : '') + (a.jump ? '+JMP' : '');
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
    this.deaths = [];    // {t, level, worldX, cause}
    this.exits = {};     // levelKey -> {normal:bool, secret:bool}
    this.steps = 0;
    this.rewardEMA = 0;
    this.repeatDeaths = 0;
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
    this.load();
  }

  Learner.prototype.epsilon = function () {
    if (this.epsFixed != null) return this.epsFixed;
    var t = Math.min(1, this.steps / this.epsEndAt);
    return this.epsStart + (this.epsEnd - this.epsStart) * t;
  };

  // --- persistence ---
  Learner.prototype.save = function () {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        w: this.w, danger: this.danger, deaths: this.deaths.slice(-200),
        exits: this.exits, steps: this.steps, rewardEMA: this.rewardEMA,
        repeatDeaths: this.repeatDeaths, progress: this.progress || {}
      }));
    } catch (e) { /* storage full/blocked: keep going memory-only */ }
  };
  Learner.prototype.load = function () {
    try {
      var s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (!s) return false;
      if (s.w && s.w.length === ACTIONS.length) this.w = s.w;
      this.danger = s.danger || {}; this.deaths = s.deaths || [];
      this.exits = s.exits || {}; this.steps = s.steps || 0;
      this.rewardEMA = s.rewardEMA || 0; this.repeatDeaths = s.repeatDeaths || 0;
      this.progress = s.progress || {};
      return true;
    } catch (e) { return false; }
  };
  Learner.prototype.wipe = function () {
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    var keep = { alpha: this.alpha, gamma: this.gamma, epsFixed: this.epsFixed };
    var fresh = new Learner(keep);
    for (var k in fresh) this[k] = fresh[k];
  };
  Learner.prototype.exportJSON = function () {
    return JSON.stringify({ w: this.w, danger: this.danger, deaths: this.deaths,
      exits: this.exits, steps: this.steps }, null, 1);
  };
  Learner.prototype.importJSON = function (text) {
    var s = JSON.parse(text);
    if (!s.w || s.w.length !== ACTIONS.length) throw new Error('bad brain file');
    this.w = s.w; this.danger = s.danger || {}; this.deaths = s.deaths || [];
    this.exits = s.exits || {}; this.steps = s.steps || 0;
    this.save();
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

  // --- features ---
  Learner.prototype.featurize = function (obs, dx) {
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
    return x;
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

  // Heuristic prior: behaves like the old run-right policy, fading with data.
  Learner.prototype.prior = function (aIdx, obs) {
    var a = ACTIONS[aIdx];
    var wPrior = 2.0 / (1 + this.steps / 400);
    var danger = obs.wallAhead || obs.pitAhead || this.dangerAhead();
    var enemyJump = false;
    if (obs.player) {
      for (var i = 0; i < obs.enemies.length; i++) {
        var e = obs.enemies[i];
        if (e.threat > 0 && e.dist < 40 && e.x > obs.player.x - 6) { enemyJump = true; break; }
      }
    }
    var b = 0;
    var px = obs.player ? obs.player.x : null;
    if (a.arrow === 'right' && a.run === 1 && a.jump === 0) b = 1.0;
    if ((danger || enemyJump) && a.arrow === 'right' && a.run === 1 && a.jump === 1) b = 1.6;
    if (obs.key && px != null && obs.key.x < px && a.arrow === 'left') b = Math.max(b, 0.8);
    if (obs.keyhole && (px == null || obs.keyhole.x > px - 10) && a.arrow === 'right') b = Math.max(b, 1.2);
    return b * wPrior;
  };

  Learner.prototype.q = function (x, aIdx, obs) {
    var s = 0, wrow = this.w[aIdx];
    for (var f = 0; f < NF; f++) s += wrow[f] * x[f];
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

  // --- main step: observe pixels, learn, act ---
  // img: ImageData of the full framebuffer. vision: SMWVision.Vision instance.
  // Returns {action, actionStr, reward, dx, stuck, epsilon, explored, obs, ...}
  Learner.prototype.step = function (img, vision) {
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
    }
    this.dxTrail.push(dx);
    if (this.dxTrail.length > 24) this.dxTrail.shift();

    // level identity: hard cuts re-hash immediately; fades re-hash on exit.
    // enterLevel also runs for same-hash (the death-respawn path).
    if (cut && textured) {
      this.enterLevel(hashFrame(small), obs, vision);
      this.fadeFrames = 0;
    } else if (obs.fade) {
      this.fadeFrames++;
      if (this.lostFrames > 0) {
        this.deathFadeLost = Math.max(this.deathFadeLost || 0, this.lostFrames);
      }
    }
    else {
      if (this.fadeFrames > 4 && textured) { // just came out of a transition
        this.enterLevel(hashFrame(small), obs, vision);
      }
      this.fadeFrames = 0;
    }
    if (!this.levelKey) this.enterLevel(hashFrame(small), obs, vision);

    // track key/keyhole sightings for secret-exit credit
    if (obs.key) this.keySeenLevel = true;
    if (obs.keyhole) {
      this.keyholeSeenLevel = true;
      if (this.keySeenLevel && obs.player &&
          Math.abs(obs.keyhole.x - obs.player.x) < 20) this.keyholeTouched = true;
    }

    var x = this.featurize(obs, dx);
    var r = this.xReward(dx);
    var eventR = 0, eventName = '';
    if (obs.whiteBurst) { eventR += 0.5; eventName = 'stomp+'; }
    if (obs.key && !this.keySeenLevel) { /* already set; bonus once */ }
    if (this.dangerAhead() && dx > 0) eventR -= 0.2;

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

    // choose action epsilon-greedy
    var eps = this.epsilon(), aIdx, explored = false;
    if (Math.random() < eps) {
      aIdx = (Math.random() * ACTIONS.length) | 0;
      explored = true;
    } else {
      aIdx = this.bestAction(x, obs).idx;
    }
    this.last = { x: x, a: aIdx, r: r + eventR };
    this.steps++;
    if (this.steps % 25 === 0) this.save();

    return { action: ACTIONS[aIdx], actionStr: actionStr(ACTIONS[aIdx]),
      reward: { x: r, event: eventR, total: r + eventR, eventName: eventName },
      dx: dx, stuck: this.isStuck(), epsilon: eps, explored: explored,
      obs: obs, dying: dying, worldX: this.worldX, levelKey: this.levelKey };
  };

  Learner.prototype.enterLevel = function (hk, obs, vision) {
    // Same visual hash after a fade: a death-respawn (not a new place).
    // Loose gate: progress made, or a long track-loss through the fade.
    if (hk === this.levelKey) {
      if ((this.worldX > 20 || (this.deathFadeLost || 0) >= 8) && this.steps > 0) {
        this.registerDeath(vision);
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
    this.last = null; // transitions don't cross levels
    if (vision) vision.worldX = 0;
    this.save();
  };

  Learner.prototype.registerDeath = function (vision) {
    var cause = 'unknown';
    try { cause = vision ? vision.deathCause() : 'unknown'; } catch (e) {}
    // repeat-death detection: died near a known danger spot again
    var zs = this.danger[this.levelKey] || [];
    for (var i = 0; i < zs.length; i++) {
      if (Math.abs(zs[i] - this.worldX) < 40) { this.repeatDeaths++; break; }
    }
    this.deaths.push({ t: Date.now(), level: this.levelKey, worldX: Math.round(this.worldX), cause: cause });
    if (this.deaths.length > 300) this.deaths = this.deaths.slice(-300);
    zs.push(Math.round(this.worldX));
    this.danger[this.levelKey] = zs.slice(-12); // keep recent danger spots
    // blame the last transition hard (deathLearning: -3 like rewards.lua)
    if (this.last) {
      var row = this.w[this.last.a];
      for (var f = 0; f < NF; f++) row[f] += this.alpha * (-3.0) * this.last.x[f];
    }
    this.save();
  };

  Learner.prototype.stats = function () {
    var exits = Object.keys(this.exits);
    var secrets = exits.filter(function (k) { return this.exits[k].secret; }, this).length;
    var dangerSpots = Object.keys(this.danger).reduce(function (s, k) { return s + this.danger[k].length; }.bind(this), 0);
    return { steps: this.steps, deaths: this.deaths.length,
      repeatDeaths: this.repeatDeaths, levels: exits.length, secrets: secrets,
      dangerSpots: dangerSpots, rewardEMA: this.rewardEMA,
      lastDeaths: this.deaths.slice(-3).reverse() };
  };

  window.SMWLearn = { Learner: Learner, ACTIONS: ACTIONS, actionStr: actionStr, NF: NF };
})();
