// Main menu / pause menu / settings / controls. Owns the pre-game title screen and
// the Esc pause screen; quality controls live here (no automatic quality changes).
export class Menu {
  constructor(game) {
    this.game = game; this.started = false; this.returnTo = 'main';
    const root = this.root = document.createElement('div'); root.id = 'menu';
    root.innerHTML = `
      <div class="menu-panel" data-screen="main">
        <img class="game-logo" src="./assets/logo.png" alt="Grand Theft Motor : Three Cities" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
        <h1 style="display:none">GRAND THEFT MOTOR : THREE CITIES</h1>
        <div class="menu-sub">FABLE CITY &nbsp;·&nbsp; LIBERTY CITY &nbsp;·&nbsp; VICE CITY</div>
        <button data-act="start">START GAME</button>
        <button data-act="settings">SETTINGS</button>
        <button data-act="controls">CONTROLS</button>
        <div class="menu-foot">WASD move · F enter car · F1 help in game</div>
      </div>
      <div class="menu-panel" data-screen="pause" style="display:none">
        <h1>PAUSED</h1>
        <div class="menu-sub">take a break, criminal</div>
        <button data-act="resume">RESUME</button>
        <button data-act="settings">SETTINGS</button>
        <button data-act="quit">QUIT TO MAIN MENU</button>
      </div>
      <div class="menu-panel" data-screen="settings" style="display:none">
        <h1>SETTINGS</h1>
        <div class="menu-sub">quality — starts at max, never changes itself</div>
        <div class="set-row"><span>AMBIENT OCCLUSION</span><div class="seg" id="seg-ao"></div></div>
        <div class="set-row"><span>UPSCALER</span><div class="seg" id="seg-up"></div></div>
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
          <div>🚁 <b>Heli</b>: W climb · S descend · A/D yaw · Space hover brake</div>
          <div>✈ <b>Plane</b>: W throttle · S slow · Space pull up · A/D bank</div>
        </div>
        <button data-act="back">BACK</button>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      this.onAction(b.dataset.act, b);
    });
    this.buildSegments();
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
  }
  refreshSegments() {
    const mark = (sel, idx) => this.root.querySelectorAll(sel + ' button').forEach(b => b.classList.toggle('on', +b.dataset.i === idx));
    mark('#seg-ao', this.game.aoLevel);
    mark('#seg-up', this.game.upscaleIdx);
  }
  show(name) {
    this.root.style.display = 'flex';
    this.root.querySelectorAll('.menu-panel').forEach(p => p.style.display = p.dataset.screen === name ? 'flex' : 'none');
    if (name === 'main' || name === 'pause') this.returnTo = name;
    if (name === 'settings') this.refreshSegments();
  }
  hide() { this.root.style.display = 'none'; }
  onAction(act) {
    // start/resume only request the lock — the menu hides on lock confirmation,
    // so a throttled lock request leaves the menu up for another click.
    if (act === 'start') { this.started = true; this.game.input.lock(); }
    else if (act === 'resume') { this.game.input.lock(); }
    else if (act === 'quit') { this.started = false; this.show('main'); }
    else if (act === 'settings') { this.show('settings'); }
    else if (act === 'controls') { this.show('controls'); }
    else if (act === 'back') { this.show(this.returnTo); }
  }
  onLockChange(locked) {
    this.game.paused = !locked;
    if (locked) this.hide();
    else if (!this.started) this.show('main');
    else this.show('pause');
  }
}
