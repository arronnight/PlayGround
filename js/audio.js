/* SMW hearing: lets the AI listen to the actual game audio.
 *
 * How it works:
 *  - The emulator (Emscripten/libretro snes9x) plays sound through one or
 *    more Web Audio AudioContexts it creates internally. We can't know their
 *    variable names, so we tap the graph itself: we wrap AudioNode.connect()
 *    so anything the game connects to its destination ALSO connects to our
 *    per-context AnalyserNode (parallel tap, game audio untouched).
 *  - Browsers block audio before a user gesture, so hearing starts as
 *    `audible:false` and flips on after Boot / Enable-hearing click.
 *  - Each decision step, Hear.sample() reads time + frequency data and
 *    returns game-sound features the learner consumes as extra inputs and
 *    reward events (coin jingle, jump blip, death sting, music vs silence).
 *
 * No microphone is used. No audio leaves the browser.
 */
(function () {
  'use strict';

  var analysers = []; // {ctx, analyser, freq, time}
  var tapInstalled = false;
  var seenNodes = null;
  try { seenNodes = new WeakSet(); } catch (e) { seenNodes = null; }

  function ensureAnalyser(ctx) {
    for (var i = 0; i < analysers.length; i++) {
      if (analysers[i].ctx === ctx) return analysers[i];
    }
    try {
      var an = ctx.createAnalyser();
      an.fftSize = 1024;
      an.smoothingTimeConstant = 0.55;
      var entry = {
        ctx: ctx, analyser: an,
        freq: new Uint8Array(an.frequencyBinCount),
        time: new Uint8Array(an.fftSize)
      };
      analysers.push(entry);
      return entry;
    } catch (e) { return null; }
  }

  function isDestination(ctx, dest) {
    try {
      if (!dest) return false;
      if (dest === ctx.destination) return true;
      // AudioDestinationNode check without relying on constructor identity
      if (dest.constructor && /AudioDestinationNode/.test(dest.constructor.name)) return true;
      if (typeof dest.channelCount !== 'undefined' && dest.numberOfInputs === 0 &&
          dest.numberOfOutputs === 0 && ctx.destination) {
        // heuristic: destination has no inputs; compare sampleRate tie-in
        return dest.context === ctx && dest !== ctx.destination ? false : dest === ctx.destination;
      }
    } catch (e) {}
    return false;
  }

  function installTap() {
    if (tapInstalled) return true;
    try {
      if (typeof window.AudioNode === 'undefined' ||
          !window.AudioNode.prototype || !window.AudioNode.prototype.connect) {
        return false;
      }
      var origConnect = window.AudioNode.prototype.connect;
      window.AudioNode.prototype.connect = function (destination) {
        var r;
        try {
          r = origConnect.apply(this, arguments);
        } catch (e) {
          // fall through: still try tap
          r = undefined;
        }
        try {
          var ctx = this.context;
          if (ctx && isDestination(ctx, destination)) {
            var already = false;
            if (seenNodes) {
              if (seenNodes.has(this)) already = true;
              else seenNodes.add(this);
            }
            if (!already) {
              var en = ensureAnalyser(ctx);
              if (en) {
                try { origConnect.call(this, en.analyser); } catch (e2) {}
              }
            }
          }
        } catch (e3) {}
        return r;
      };
      tapInstalled = true;
      return true;
    } catch (e) { return false; }
  }

  // Wrap AudioContext construction too, so contexts created AFTER install
  // still get an analyser lazily on first destination-connect (handled
  // above). We also keep a list via wrapping for status display.
  var contextsSeen = [];
  function wrapContextCtor() {
    try {
      ['AudioContext', 'webkitAudioContext'].forEach(function (name) {
        var Orig = window[name];
        if (!Orig || Orig.__smwWrapped) return;
        var Wrapped = function () {
          var c = new (Function.prototype.bind.apply(Orig, [null].concat(Array.prototype.slice.call(arguments))))();
          try { contextsSeen.push(c); } catch (e) {}
          return c;
        };
        Wrapped.prototype = Orig.prototype;
        Wrapped.__smwWrapped = true;
        try { window[name] = Wrapped; } catch (e) {}
      });
    } catch (e) {}
  }

  function Hear() {
    wrapContextCtor();
    installTap();
    this.prevLevel = 0;
    this.prevHigh = 0;
    this.onset = 0;
    this.coinCooldown = 0;
    this.jumpCooldown = 0;
    this.deathCooldown = 0;
    this.last = null;
  }

  Hear.prototype.status = function () {
    var live = 0, suspended = 0;
    var states = [];
    // tracked taps
    for (var i = 0; i < analysers.length; i++) {
      try {
        var st = analysers[i].ctx.state;
        states.push(st);
        if (st === 'running') live++; else suspended++;
      } catch (e) {}
    }
    // also count bare contexts seen
    var extra = 0;
    for (var j = 0; j < contextsSeen.length; j++) {
      try {
        if (contextsSeen[j].state === 'running') extra++;
      } catch (e) {}
    }
    return { taps: analysers.length, running: live, suspended: suspended,
      contexts: contextsSeen.length, extraRunning: extra };
  };

  Hear.prototype.enable = function () {
    // Must be called from a user gesture. Resumes every known context.
    var n = 0;
    var all = [];
    for (var i = 0; i < analysers.length; i++) all.push(analysers[i].ctx);
    for (var j = 0; j < contextsSeen.length; j++) all.push(contextsSeen[j]);
    // Also Emscripten sometimes stashes its context on Module
    try {
      if (window.Module && window.Module.audioContext) all.push(window.Module.audioContext);
    } catch (e) {}
    all.forEach(function (c) {
      try { if (c && c.state === 'suspended' && c.resume) { c.resume(); n++; } } catch (e) {}
    });
    installTap();
    return n;
  };

  function bandAvg(freq, from, to) {
    var s = 0, n = 0;
    from = Math.max(0, from); to = Math.min(freq.length - 1, to);
    for (var i = from; i <= to; i++) { s += freq[i]; n++; }
    return n ? s / n / 255 : 0;
  }

  Hear.prototype.sample = function () {
    var out = { audible: false, level: 0, bass: 0, mid: 0, high: 0,
      onset: 0, coinLikely: false, jumpLikely: false, deathLikely: false,
      quiet: true, taps: analysers.length };
    if (!analysers.length) { this.last = out; return out; }
    var lvl = 0, bass = 0, mid = 0, high = 0, n = 0, running = 0;
    for (var i = 0; i < analysers.length; i++) {
      var en = analysers[i];
      try {
        if (en.ctx.state !== 'running') continue;
        running++;
        en.analyser.getByteTimeDomainData(en.time);
        en.analyser.getByteFrequencyData(en.freq);
        var sum = 0;
        for (var t = 0; t < en.time.length; t++) {
          var v = (en.time[t] - 128) / 128;
          sum += v * v;
        }
        lvl += Math.sqrt(sum / en.time.length);
        // fft bins: samplerate/fftSize each; assume 48kHz -> ~46.9Hz/bin
        bass += bandAvg(en.freq, 1, 8);
        mid += bandAvg(en.freq, 9, 60);
        high += bandAvg(en.freq, 61, 200);
        n++;
      } catch (e) {}
    }
    if (!n || !running) { this.last = out; return out; }
    lvl /= n; bass /= n; mid /= n; high /= n;
    out.audible = true;
    out.level = lvl; out.bass = bass; out.mid = mid; out.high = high;
    out.quiet = lvl < 0.015;
    // onset = sudden loudness jump
    var dLevel = lvl - this.prevLevel;
    var dHigh = high - this.prevHigh;
    out.onset = Math.max(0, dLevel * 4 + Math.max(0, dHigh) * 1.5);
    if (this.coinCooldown > 0) this.coinCooldown--;
    if (this.jumpCooldown > 0) this.jumpCooldown--;
    if (this.deathCooldown > 0) this.deathCooldown--;
    // Heuristic jingle classifiers (SNES SFX live in these bands):
    // coin = bright high ping with fast attack; jump = mid blip; death =
    // loud low/mid swell that sustains (cooldown-gated one-shots).
    if (this.coinCooldown === 0 && high > 0.18 && dHigh > 0.03 && lvl > 0.03) {
      out.coinLikely = true; this.coinCooldown = 10;
    }
    if (this.jumpCooldown === 0 && mid > 0.16 && dLevel > 0.008 && !out.coinLikely) {
      out.jumpLikely = true; this.jumpCooldown = 8;
    }
    if (this.deathCooldown === 0 && lvl > 0.06 && (bass + mid) > 0.35 && dLevel > 0.01) {
      out.deathLikely = true; this.deathCooldown = 30;
    }
    this.prevLevel = lvl; this.prevHigh = high;
    this.last = out;
    return out;
  };

  window.SMWAudio = { Hear: Hear, installTap: installTap, status: function () {
    return { taps: analysers.length, contexts: contextsSeen.length };
  } };
})();
