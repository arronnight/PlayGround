import { useState } from 'react';
import { useOS, WALLPAPERS, type DE } from '../store/osStore';
import { useFS } from '../fs/vfs';

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { de, setDE, wallpaper, setWallpaper, accent, setAccent, dark, setDark } = useOS();
  const [confirmReset, setConfirmReset] = useState(false);
  const des: DE[] = ['fusion', 'win11', 'macos', 'ubuntu'];
  return (
    <div className="app-body settings">
      <h3>⚙ Settings — Desktop Environment</h3>
      <p className="muted">Switch shells live. Wallpaper auto-matches the DE. All abilities stay installed.</p>
      <div className="row">
        {des.map((d) => (
          <button key={d} className={`pill ${de === d ? 'on' : ''}`} onClick={() => setDE(d)}>
            {d === 'fusion' ? '◈ Fusion mashup' : d === 'win11' ? '🪟 Windows 11' : d === 'macos' ? '🍎 macOS' : '🟠 Ubuntu'}
          </button>
        ))}
      </div>
      <h4>Wallpaper (vendored real assets)</h4>
      <div className="wpgrid">
        {WALLPAPERS.map((w) => (
          <button key={w.id} className={`wp ${wallpaper === w.css ? 'on' : ''}`} onClick={() => setWallpaper(w.css)} title={w.name}>
            {w.css.startsWith('/') ? <img src={w.css} alt={w.name} /> : <span className="wpgrad" style={{ background: w.css }} />}
            <small>{w.name}</small>
          </button>
        ))}
      </div>
      <h4>Accent</h4>
      <div className="row">
        {['#0078d4', '#e95420', '#0ea5e9', '#22c55e', '#a855f7'].map((c) => (
          <button key={c} className="swatch" style={{ background: c, outline: accent === c ? '3px solid #fff' : 'none' }} onClick={() => setAccent(c)} />
        ))}
      </div>
      <label className="row"><input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> Dark window chrome</label>
      <h4>Files</h4>
      <div className="row">
        {confirmReset
          ? <><button className="pill" onClick={() => { useFS.getState().reset(); setConfirmReset(false); }}>Confirm reset</button>
              <button className="pill" onClick={() => setConfirmReset(false)}>Cancel</button></>
          : <button className="pill" onClick={() => setConfirmReset(true)}>Reset virtual filesystem…</button>}
      </div>
      <h4>Ability matrix (ported)</h4>
      <ul className="matrix">
        <li>🪟 Win11: Start + Search, Widgets, Snap (⊞ side buttons), File Explorer, Store</li>
        <li>🍎 macOS: Dock magnification, TopBar + Control Center, Spotlight (click 🔍 or ⌘K), Launchpad grid, Liquid Glass windows</li>
        <li>🟠 Ubuntu: Activities overview, left Dock, Top Panel clock, 9-dot App Grid, Quick Settings sliders</li>
      </ul>
      <button className="pill" onClick={onClose}>Close</button>
    </div>
  );
}
