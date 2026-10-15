/* SMW playing-AI: browser port of https://github.com/aleju/mario-ai (MIT).
 *
 * WHAT THE ORIGINAL IS
 * ---------------------
 * aleju/mario-ai trains a Deep Q-Network (Torch/Lua, ~6.6M params incl. a
 * Spatial Transformer branch) to play the FIRST level of Super Mario World.
 * It runs inside the lsnes rr2 emulator (heavily patched: custom
 * input.do_button_action, lua memory limit raised), needs Ubuntu + NVIDIA GPU
 * with CUDA/cuDNN, saves screenshots to a ramdisk, and trains ~10h.
 *
 * Faithful framing reproduced here (same names/semantics as the Lua):
 *   config.lua  -> REACT_EVERY_NTH_FRAME=5, STATES_PER_EXAMPLE(T)=4,
 *                  IMG 32x32 history + 64x64 last frame, grayscale,
 *                  GAMMA=0.9, epsilon 0.8 -> 0.1 over 400k actions.
 *   actions.lua -> action = {arrow in {U,D,L,R}, button in {A,B,X,Y}};
 *                  two SNES buttons held at once; chooseAction() epsilon-greedy
 *                  with the 50:50 coin flip (randomize both sides, or one).
 *   rewards.lua -> fast-right +1.0, right +0.5, left -1.0, fast-left -1.5,
 *                  level finish +2.0, death -3.0.
 *
 * WHAT RUNS IN THIS FILE (browser)
 * --------------------------------
 * The Torch DQN (network.lua) cannot run in a browser without an ONNX export
 * of the trained weights (see `learned/` in the original repo). So the
 * *exploit* branch (approximateBestAction) is replaced by a hand-written
 * "SMW prior" heuristic that operates on the SAME pixel observations:
 * hold Right + run, jump when the ahead-region looks solid, jump when the
 * ground-region looks empty (pit). Exploration, scheduling, rewards and
 * stuck-recovery mirror the original. If you export the DQN to ONNX,
 * replace heuristicBestAction() with an onnxruntime-web session and keep
 * everything else untouched.
 */
(function () {
  'use strict';

  // ---- config.lua ----
  var REACT_EVERY_NTH_FRAME = 5;   // decide every 5th emulated frame (~12Hz at 60fps)
  var T = 4;                       // STATES_PER_EXAMPLE: history length
  var SMALL = 32, BIG = 64;        // IMG_DIMENSIONS_Q_HISTORY / _Q_LAST (grayscale)
  var GAMMA = 0.9;                 // GAMMA_EXPECTED / GAMMA_OBSERVED
  var EPS_START = 0.8, EPS_END = 0.1, EPS_END_AT = 400000;
  var FAST_PX = 8;                 // +/-8px x-diff = "fast" (rewards.lua)

  var ARROWS = ['up', 'down', 'left', 'right'];
  var FACE = ['A', 'B', 'X', 'Y'];

  function shortAction(a) {
    var m = { up: 'AU', down: 'AD', left: 'AL', right: 'AR' };
    return (m[a.arrow] || '?') + '+' + a.button;
  }

  function randomOf(arr) { return arr[(Math.random() * arr.length) | 0]; }

  // ---- observer: canvas -> grayscale tensors ----
  var scratch = null;
  function grabGray(sourceCanvas, size, cropTopPx) {
    if (!scratch) scratch = document.createElement('canvas');
    var sw = sourceCanvas.width, sh = sourceCanvas.height;
    var sy = cropTopPx || 0, shh = sh - sy;
    scratch.width = size; scratch.height = size;
    var ctx = scratch.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(sourceCanvas, 0, sy, sw, shh, 0, 0, size, size);
    var d = ctx.getImageData(0, 0, size, size).data;
    var out = new Float32Array(size * size);
    var brightness = 0;
    for (var i = 0; i < size * size; i++) {
      var r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      var v = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      out[i] = v; brightness += v;
    }
    brightness /= size * size;
    var variance = 0;
    for (var j = 0; j < size * size; j++) { var dd = out[j] - brightness; variance += dd * dd; }
    variance /= size * size;
    return { data: out, brightness: brightness, variance: variance, size: size };
  }

  // Horizontal scroll estimate between two 32x32 frames (SAD on middle band).
  // Sign convention: content shifting left (camera running right) => +dx,
  // i.e. dx>0 means Mario progress to the right, matching rewards.lua.
  // Ties prefer smaller shifts (a frozen frame must report dx=0, not drift),
  // and a poor best match (scene cut / fade) reports 0 = "no confidence".
  function estimateDx(prev, cur) {
    var S = SMALL, best = 0, bestCost = Infinity;
    var order = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8];
    for (var k = 0; k < order.length; k++) {
      var dx = order[k], cost = 0;
      for (var y = 8; y < 24; y++) {
        for (var x = 8; x < 24; x++) {
          var xa = x, xb = x + dx;
          if (xb < 0 || xb >= S) { cost += 0.25; continue; }
          cost += Math.abs(prev[y * S + xa] - cur[y * S + xb]);
        }
      }
      if (cost < bestCost - 1e-9) { bestCost = cost; best = dx; }
    }
    if (bestCost > 40) return 0; // ~0.16 mean abs diff over the 16x16 band
    // Camera moves opposite to Mario: screen shifting left => Mario ran right.
    return -best;
  }

  // rewards.lua mapping (score-diff needs RAM access; N/A in browser -> 0).
  function rewardForDx(dx, scale) {
    var s = scale || 1;
    if (dx >= FAST_PX / s) return 1.0;
    if (dx > 0) return 0.5;
    if (dx > -FAST_PX / s) return -1.0;
    return -1.5;
  }

  // Heuristic exploit branch: stands in for network.approximateBestAction.
  // Mario rides the camera near screen centre; danger is sampled in an
  // ahead-region (right of centre, low) and ground-region (below-ahead).
  function heuristicBestAction(big, stuck) {
    var S = BIG, d = big.data;
    function regionMean(x0, y0, x1, y1) {
      var s = 0, n = 0;
      for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) { s += d[y * S + x]; n++; }
      return s / Math.max(1, n);
    }
    function regionVar(x0, y0, x1, y1, mean) {
      var s = 0, n = 0;
      for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) { var v = d[y * S + x] - mean; s += v * v; n++; }
      return s / Math.max(1, n);
    }
    // Ahead at torso height: solid wall/enemy => high variance + mid brightness.
    var am = regionMean(36, 34, 48, 48);
    var av = regionVar(36, 34, 48, 48, am);
    // Ground ahead below feet: pit/void => dark + flat.
    var gm = regionMean(36, 50, 50, 60);
    var gv = regionVar(36, 50, 50, 60, gm);
    // Sky reference (top band).
    var sm = regionMean(8, 4, 56, 14);

    var obstacle = (av > 0.012 && am < 0.75) || (am < sm - 0.12 && av > 0.006);
    var pit = (gm < 0.35 && gv < 0.004);

    if (stuck) return { arrow: 'right', button: 'B' };       // jump out of trouble
    if (pit || obstacle) return { arrow: 'right', button: 'B' }; // running jump
    return { arrow: 'right', button: 'Y' };                  // run right (Y = run)
  }

  // ---- agent ----
  function Agent(opts) {
    opts = opts || {};
    this.epsStart = opts.epsStart != null ? opts.epsStart : EPS_START;
    this.epsEnd = opts.epsEnd != null ? opts.epsEnd : EPS_END;
    this.epsFixed = opts.epsFixed;         // if set, skip annealing (UI slider)
    this.actionsTaken = 0;
    this.history = [];                     // last T SMALL frames
    this.prevSmall = null;
    this.lastBig = null;
    this.dxTrail = [];                     // recent scroll dx for stuck detection
    this.stuck = false;
    this.lastReward = { x: 0, event: 0, total: 0 };
    this.lastAction = null;
    this.explored = false;
  }

  Agent.prototype.epsilon = function () {
    if (this.epsFixed != null) return this.epsFixed;
    var t = Math.min(1, this.actionsTaken / EPS_END_AT);
    return this.epsStart + (this.epsEnd - this.epsStart) * t;
  };

  // actions.chooseAction port (epsilon-greedy + coin flip).
  Agent.prototype.chooseAction = function (best) {
    var eps = this.epsilon();
    var a;
    this.explored = false;
    if (Math.random() < eps) {
      this.explored = true;
      if (!best || Math.random() < 0.5) {
        a = { arrow: randomOf(ARROWS), button: randomOf(FACE) };   // randomize both
      } else if (Math.random() < 0.5) {
        a = { arrow: randomOf(ARROWS), button: best.button };      // randomize arrow
      } else {
        a = { arrow: best.arrow, button: randomOf(FACE) };         // randomize button
      }
    } else {
      a = best;
    }
    return a;
  };

  // One decision step. Returns {action, reward, dx, stuck, epsilon, explored}.
  Agent.prototype.step = function (sourceCanvas) {
    var small = grabGray(sourceCanvas, SMALL, 0);
    var big = grabGray(sourceCanvas, BIG, 0);

    var dx = 0;
    if (this.prevSmall) dx = estimateDx(this.prevSmall.data, small.data);
    this.prevSmall = small;
    this.lastBig = big;

    this.history.push(small.data);
    if (this.history.length > T) this.history.shift();

    this.dxTrail.push(dx);
    if (this.dxTrail.length > 24) this.dxTrail.shift();
    var prog = 0;
    for (var i = 0; i < this.dxTrail.length; i++) prog += this.dxTrail[i];
    this.stuck = this.dxTrail.length >= 24 && Math.abs(prog) < 3;

    // Event detector: death fade (dark + flat) / finish flash (bright surge).
    var eventR = 0, eventName = '';
    if (big.brightness < 0.10 && big.variance < 0.004) { eventR = -3.0; eventName = 'death?'; }
    else if (big.brightness > 0.78 && big.variance > 0.01) { eventR = 2.0; eventName = 'finish?'; }

    var xR = this.prevSmall ? rewardForDx(dx, 2.5) : 0; // dx is per-decision (~5 frames), scaled
    if (!this.prevSmall) xR = 0;

    var best = heuristicBestAction(big, this.stuck);
    var action = this.chooseAction(best);
    this.actionsTaken++;
    this.lastAction = action;
    this.lastReward = { x: xR, event: eventR, total: xR + eventR, eventName: eventName };
    return {
      action: action, actionStr: shortAction(action),
      reward: this.lastReward, dx: dx, stuck: this.stuck,
      epsilon: this.epsilon(), explored: this.explored
    };
  };

  Agent.prototype.resetTrail = function () {
    this.dxTrail = []; this.stuck = false; this.history = []; this.prevSmall = null;
  };

  window.MarioAI = {
    Agent: Agent,
    REACT_EVERY_NTH_FRAME: REACT_EVERY_NTH_FRAME,
    T: T, SMALL: SMALL, BIG: BIG, GAMMA: GAMMA,
    EPS_START: EPS_START, EPS_END: EPS_END, EPS_END_AT: EPS_END_AT,
    shortAction: shortAction
  };
})();
