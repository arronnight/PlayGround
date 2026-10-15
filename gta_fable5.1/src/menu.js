// Main menu / pause menu / settings / controls. Owns the pre-game title screen and
// the Esc pause screen; quality controls live here (no automatic quality changes).
export class Menu {
  constructor(game) {
    this.game = game; this.started = false; this.returnTo = 'main';
    const root = this.root = document.createElement('div'); root.id = 'menu';
    root.innerHTML = `
      <div class="menu-panel" data-screen="main">
        <img class="menu-logo hero" src="logo.png" alt="Grand Theft Motor: Three Cities" onload="this.parentElement.querySelector('h1').style.display='none'" onerror="this.remove()">
        <h1>GRAND THEFT MOTOR</h1>
        <div class="menu-sub">THREE CITIES &nbsp;·&nbsp; FABLE &nbsp;·&nbsp; LIBERTY &nbsp;·&nbsp; VICE</div>
        <button data-act="start">START GAME</button>
        <button data-act="settings">SETTINGS</button>
        <button data-act="controls">CONTROLS</button>
        <div class="menu-foot">WASD move · F enter car · F1 help in game</div>
      </div>
      <div class="menu-panel" data-screen="pause" style="display:none">
        <img class="menu-logo small" src="logo.png" alt="" onerror="this.remove()">
        <h1>PAUSED</h1>
        <div class="menu-sub">take a break, criminal</div>
        <button data-act="resume">RESUME</button>
        <div class="set-row"><span>RADIO</span><div class="seg" id="seg-radio"></div></div>
        <div class="set-row"><span>TRACKS</span><label class="filebtn">+ ADD MP3s<input id="custom-tracks" type="file" accept="audio/*" multiple></label></div>
        <button data-act="settings">SETTINGS</button>
        <button data-act="quit">QUIT TO MAIN MENU</button>
      </div>
      <div class="menu-panel" data-screen="settings" style="display:none">
        <h1>SETTINGS</h1>
        <div class="menu-sub">quality — starts at max, never changes itself</div>
        <div class="set-row"><span>AMBIENT OCCLUSION</span><div class="seg" id="seg-ao"></div></div>
        <div class="set-row"><span>UPSCALER</span><div class="seg" id="seg-up"></div></div>
        <div class="set-row"><span>ANTI-ALIASING</span><div class="seg" id="seg-aa"></div></div>
        <div class="set-note">Upscaler renders below native resolution and reconstructs with sharpening. Off = native (sharpest).</div>
        <button data-act="back">BACK</button>
      </div>
      <div class="menu-panel" data-screen="controls" style="display:none">
        <h1>CONTROLS</h1>
        <div class="menu-sub">full list under F1 in game</div>
        <div class="controls-list">
          <div><b>WASD</b> move · <b>Shift</b> sprint · <b>Space</b> jump / handbrake · <b>Mouse</b> look</div>
          <div><b>F</b> enter / exit vehicle · <b>LMB</b> fire · <b>RMB</b> aim · <b>1-6 / Q</b> weapons</div>
          <div><b>E</b> talk / shop · <b>H</b> horn · <b>R</b> radio · <b>M</b> map · <b>T</b> skip time</div>
          <div><b>O</b> ambient occlusion · <b>U</b> upscaler · <b>Esc</b> pause</div>
          <div><b>Gamepad</b>: <b>Start</b> pause / resume · <b>D-pad</b> navigate menus · <b>A</b> confirm · <b>B</b> back · <b>L3</b> aim-zoom while aiming · <b>R3</b> crouch on foot (<b>C</b> on keyboard) · hold <b>D-up</b>/<b>R</b> + stick/arrows: radio wheel in cars</div>
          <div>🚁 <b>Heli</b>: aim to steer (up climbs) · W thrust · S brake/settle · A/D yaw · Space full stop</div>
          <div>✈ <b>Plane</b>: aim steers the nose · W throttle · S slow · Space pull up · A/D bank</div>
        </div>
        <button data-act="back">BACK</button>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      this.onAction(b.dataset.act, b);
    });
    this.buildSegments();
    const addTracks = this.root.querySelector('#custom-tracks');
    if (addTracks) addTracks.addEventListener('change', async (e) => {
      const n = await this.game.audio.addCustomTracks(e.target.files);
      this.game.hud.notify(n ? `Added ${n} custom track${n > 1 ? 's' : ''} — tune to CUSTOM` : 'No readable audio files', 2500);
      e.target.value = '';
    });
    this.show('main');
  }
  buildSegments() {
    const aoSeg = this.root.querySelector('#seg-ao');
    ['Off', 'Balanced', 'High'].forEach((label, i) => {
      const b = document.createElement('button'); b.textContent = label; b.dataset.i = i;
      b.addEventListener('click', (e) => { e.stopPropagation(); this.game.setAOLevel(i); this.refreshSegments(); });
      aoSeg.appendChild(b);
    });
    const upSeg = this.root.querySelector('#seg-up');
    ['Off', 'Quality', 'Balanced', 'Performance'].forEach((label, i) => {
      const b = document.createElement('button'); b.textContent = label; b.dataset.i = i;
      b.addEventListener('click', (e) => { e.stopPropagation(); this.game.upscaleIdx = i; this.game.applyUpscale(); this.refreshSegments(); });
      upSeg.appendChild(b);
    });
    const aaSeg = this.root.querySelector('#seg-aa');
    ['Off', 'SMAA'].forEach((label, i) => {
      const b = document.createElement('button'); b.textContent = label; b.dataset.i = i;
      b.addEventListener('click', (e) => { e.stopPropagation(); this.game.setSMAA(i === 1); this.refreshSegments(); });
      aaSeg.appendChild(b);
    });
  }
  refreshSegments() {
    const mark = (sel, idx) => this.root.querySelectorAll(sel + ' button').forEach(b => b.classList.toggle('on', +b.dataset.i === idx));
    mark('#seg-ao', this.game.aoLevel);
    mark('#seg-up', this.game.upscaleIdx);
    mark('#seg-aa', this.game.smaaOn ? 1 : 0);
    // radio stations only exist after first audio init; (re)build lazily
    const rseg = this.root.querySelector('#seg-radio');
    const sts = this.game.audio.stations || [];
    if (rseg && sts.length && rseg.children.length !== sts.length) {
      rseg.innerHTML = '';
      sts.forEach((s, i) => {
        const b = document.createElement('button'); b.textContent = s.name; b.dataset.i = i;
        b.addEventListener('click', (e) => { e.stopPropagation(); this.game.audio.setStation(i); this.game.audio.ui(); this.refreshSegments(); });
        rseg.appendChild(b);
      });
    }
    mark('#seg-radio', this.game.audio.radioStation ?? 0);
  }
  show(name) {
    this.screen = name; this.sel = 0;
    this.root.style.display = 'flex'; this.visible = true;
    this.root.querySelectorAll('.menu-panel').forEach(p => p.style.display = p.dataset.screen === name ? 'flex' : 'none');
    if (name === 'main' || name === 'pause') this.returnTo = name;
    if (name === 'settings') this.refreshSegments();
    this.applyFocus();
  }
  hide() { this.root.style.display = 'none'; this.visible = false; }
  focusables() {
    const panel = this.root.querySelector(`.menu-panel[data-screen="${this.screen}"]`);
    if (!panel) return [];
    return [...panel.querySelectorAll(':scope > button, :scope .seg')];
  }
  applyFocus() {
    this.root.querySelectorAll('.focused').forEach(e => e.classList.remove('focused'));
    const items = this.focusables();
    if (items.length) items[((this.sel % items.length) + items.length) % items.length].classList.add('focused');
  }
  segCount(id) { return id === 'seg-ao' ? 3 : id === 'seg-up' ? 4 : id === 'seg-radio' ? (this.game.audio.stations?.length || 1) : 2; }
  segIdx(id) {
    if (id === 'seg-ao') return this.game.aoLevel;
    if (id === 'seg-up') return this.game.upscaleIdx;
    if (id === 'seg-radio') return this.game.audio.radioStation ?? 0;
    return this.game.smaaOn ? 1 : 0;
  }
  bumpSeg(el, dir) {
    const id = el.id, n = this.segCount(id);
    const next = (((this.segIdx(id) + dir) % n) + n) % n;
    if (id === 'seg-ao') this.game.setAOLevel(next);
    else if (id === 'seg-up') { this.game.upscaleIdx = next; this.game.applyUpscale(); }
    else if (id === 'seg-radio') { const nm = this.game.audio.setStation(next); this.game.audio.ui(); if (nm === 'Custom' && !this.game.audio.customTracks.length) this.game.hud.notify('CUSTOM is empty — add MP3s below', 2500); }
    else this.game.setSMAA(next === 1);
    this.game.audio.ui(); this.refreshSegments();
  }
  goBack() {
    if (this.screen === 'pause') this.onAction('resume');
    else if (this.screen !== 'main') this.show(this.returnTo);
  }
  // Per-frame menu navigation (called from the main loop even while paused):
  // D-pad / arrows move, A / Enter confirms, B / Esc goes back,
  // Start resumes/starts. Mouse clicks keep working as before.
  update() {
    const g = this.game, input = g.input;
    const items = this.focusables();
    if (!items.length) return;
    this.sel = ((this.sel % items.length) + items.length) % items.length;
    const isSeg = (el) => el.classList.contains('seg');
    if (input.hit('dUp') || input.hitCode('ArrowUp')) { this.sel = (this.sel + items.length - 1) % items.length; g.audio.ui(); this.applyFocus(); return; }
    if (input.hit('dDown') || input.hitCode('ArrowDown')) { this.sel = (this.sel + 1) % items.length; g.audio.ui(); this.applyFocus(); return; }
    const left = input.hit('dLeft') || input.hitCode('ArrowLeft');
    const right = input.hit('dRight') || input.hitCode('ArrowRight');
    if (left || right) { const el = items[this.sel]; if (isSeg(el)) this.bumpSeg(el, left ? -1 : 1); return; }
    if (input.hit('jump') || input.hitCode('Enter')) {
      const el = items[this.sel];
      if (isSeg(el)) this.bumpSeg(el, 1);
      else if (el.dataset.act) { g.audio.ui(); this.onAction(el.dataset.act); }
      return;
    }
    if (input.hit('sprint') || input.hitCode('Escape')) { this.goBack(); return; }
    if (input.hit('pause') || input.hitCode('KeyP')) {
      if (this.screen === 'main') this.onAction('start');
      else if (this.screen === 'pause') this.onAction('resume');
      else this.show(this.returnTo);
    }
  }
  onAction(act) {
    // start/resume only request the lock — the menu hides on lock confirmation,
    // so a throttled lock request leaves the menu up for another click.
    // (Also owns audio init: the click IS the user gesture browsers require
    // before an AudioContext may start. Without this there is no sound at all.)
    if (act === 'start') { this.started = true; this.game.audio.init(); this.game.audio.resume(); this.game.input.lock(); }
    else if (act === 'resume') { this.game.audio.init(); this.game.audio.resume(); this.game.input.lock(); }
    else if (act === 'quit') { this.started = false; this.show('main'); }
    else if (act === 'settings') { this.show('settings'); }
    else if (act === 'controls') { this.show('controls'); }
    else if (act === 'back') { this.show(this.returnTo); }
  }
  onLockChange(locked) {
    this.game.paused = !locked;
    if (locked) { this.game.audio.resume(); this.hide(); }
    else if (!this.started) this.show('main');
    else this.show('pause');
  }
}
