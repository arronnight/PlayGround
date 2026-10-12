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
    // crowd: looped noise buffer through bandpass
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    this.crowdFilter = this.ctx.createBiquadFilter();
    this.crowdFilter.type = 'bandpass'; this.crowdFilter.frequency.value = 900; this.crowdFilter.Q.value = 0.6;
    this.crowdGain = this.ctx.createGain(); this.crowdGain.gain.value = 0.05;
    src.connect(this.crowdFilter).connect(this.crowdGain).connect(this.ctx.destination);
    src.start();
  }
  setHeat(h, pop = 0) {
    this.heat = h;
    if (!this.ctx || !this.crowdGain) return;
    const g = this.muted ? 0 : 0.03 + h * 0.10 + pop * 0.15;
    this.crowdGain.gain.setTargetAtTime(g, this.ctx.currentTime, 0.3);
    this.crowdFilter.frequency.setTargetAtTime(700 + h * 900 + pop * 600, this.ctx.currentTime, 0.3);
  }
  pop(big = 1) {
    if (!this.ctx || this.muted) return;
    this.setHeat(Math.min(1, this.heat + 0.25 * big), 1);
    setTimeout(() => this.setHeat(this.heat, 0), 900);
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
  toggleMute() { this.muted = !this.muted; if (this.crowdGain) this.crowdGain.gain.value = this.muted ? 0 : 0.06; return this.muted; }
}
