// Synthesized audio: hits, bell, crowd. No assets needed.
export class GameAudio {
  constructor() {
    this.ctx = null; this.muted = false;
    this.crowdGain = null; this.crowdFilter = null; this.heat = 0.5;
  }
  ensure() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    // no looped noise bed — crowd is event-driven only (chants, pops, boos, thumps).
    this.crowdGain = null; this.crowdFilter = null;
  }
  setHeat(h, pop = 0) {
    this.heat = h; // bed removed: heat only scales the next chant/pop volume
  }
  pop(big = 1) {
    if (!this.ctx || this.muted) return;
    // short crowd swell built from claps, not static
    const t0 = this.ctx.currentTime;
    for (let i = 0; i < 3 * big; i++) {
      const nb = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
      const dd = nb.getChannelData(0);
      for (let j = 0; j < dd.length; j++) dd[j] = (Math.random() * 2 - 1) * (1 - j / dd.length);
      const ns = this.ctx.createBufferSource(); ns.buffer = nb;
      const ng = this.ctx.createGain(); ng.gain.value = 0.12;
      const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800;
      ns.connect(f).connect(ng).connect(this.ctx.destination); ns.start(t0 + i * 0.09);
    }
  }
  blip(freq = 660, dur = 0.12, type = 'square', vol = 0.12) {
    if (!this.ctx || this.muted) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + dur);
  }
  hit(kind = 'hit') {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(kind === 'kick' ? 160 : 120, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    g.gain.setValueAtTime(kind === 'chop' ? 0.5 : 0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g).connect(this.ctx.destination);
    o.start(t); o.stop(t + 0.22);
    // noise snap
    const nb = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
    const dd = nb.getChannelData(0);
    for (let i = 0; i < dd.length; i++) dd[i] = (Math.random() * 2 - 1) * (1 - i / dd.length);
    const ns = this.ctx.createBufferSource(); ns.buffer = nb;
    const ng = this.ctx.createGain(); ng.gain.value = 0.3;
    const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1500;
    ns.connect(f).connect(ng).connect(this.ctx.destination);
    ns.start(t);
  }
  bell() {
    if (!this.ctx || this.muted) return;
    [880, 1174, 1568].forEach((fr, i) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'triangle'; o.frequency.value = fr;
      const t = this.ctx.currentTime + i * 0.35;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
      o.connect(g).connect(this.ctx.destination);
      o.start(t); o.stop(t + 1.1);
    });
  }
  count(n) { this.blip(n === 3 ? 880 : 520, 0.25, 'square', 0.2); }
  // Dynamic crowd chants — synthesized rhythm + noise swells, no samples needed.
  // chant('holy'): HOLY-SHIT clap pattern · 'awesome': THIS-IS-AWESOME stomp
  // 'ecw': E-C-W kick chant · 'boo': heel-heat low boo · 'pop': face-comeback pop
  chant(kind) {
    if (!this.ctx || this.muted) return;
    if (this._chantCool && performance.now() < this._chantCool) return;
    this._chantCool = performance.now() + 6000;
    const t0 = this.ctx.currentTime;
    const thump = (t, f = 90, v = 0.5, dur = 0.18) => {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(40, t + dur);
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.1);
      o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + dur + 0.15);
    };
    const clap = (t, v = 0.25) => {
      const nb = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.06, this.ctx.sampleRate);
      const dd = nb.getChannelData(0);
      for (let i = 0; i < dd.length; i++) dd[i] = (Math.random() * 2 - 1) * (1 - i / dd.length);
      const ns = this.ctx.createBufferSource(); ns.buffer = nb;
      const ng = this.ctx.createGain(); ng.gain.value = v;
      const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2000;
      ns.connect(f).connect(ng).connect(this.ctx.destination); ns.start(t);
    };
    if (kind === 'holy') { // HO-LY-SHIT! clap-clap-clapclap
      clap(t0); clap(t0 + 0.28); clap(t0 + 0.55); clap(t0 + 0.72);
      thump(t0 + 0.9, 70, 0.6); this.setHeat(1, 1);
    } else if (kind === 'awesome') { // THIS-IS-AWE-SOME stomp
      thump(t0, 80, 0.5); thump(t0 + 0.3, 80, 0.5); thump(t0 + 0.6, 70, 0.6); thump(t0 + 0.9, 60, 0.7);
      clap(t0 + 1.1, 0.3); this.setHeat(1, 0.8);
    } else if (kind === 'ecw') { // E-C-W
      thump(t0, 100, 0.55); thump(t0 + 0.35, 100, 0.55); thump(t0 + 0.7, 85, 0.7);
      this.setHeat(0.95, 0.7);
    } else if (kind === 'boo') {
      for (let i = 0; i < 5; i++) this.blip(140 - i * 8, 0.35, 'sawtooth', 0.06);
      if (this.crowdFilter) this.crowdFilter.frequency.setTargetAtTime(400, t0, 0.2);
    } else if (kind === 'pop') { // face comeback explosion
      this.setHeat(1, 1);
      for (let i = 0; i < 4; i++) clap(t0 + i * 0.12, 0.3);
      thump(t0 + 0.5, 65, 0.7, 0.3);
    }
  }
  toggleMute() { this.muted = !this.muted; if (this.crowdGain) this.crowdGain.gain.value = this.muted ? 0 : 0.06; return this.muted; }
}
