import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../../store/osStore';
import { OsWindow } from '../../components/OsWindow';
import { ICONS, bgStyle } from '../../assets';
import { useFS } from '../../fs/vfs';

const DOCK = [
  { id: 'finder', img: ICONS.macos.finder, name: 'Finder' },
  { id: 'safari', img: ICONS.macos.safari, name: 'Safari' },
  { id: 'terminal', img: ICONS.macos.terminal, name: 'Terminal' },
  { id: 'notepad', img: ICONS.macos.notes, name: 'Notes' },
  { id: 'calculator', img: ICONS.macos.calculator, name: 'Calc' },
  { id: 'vscode', img: ICONS.macos.vscode, name: 'Code' },
  { id: 'browser', img: ICONS.macos.siri, name: 'Siri/Browser' },
  { id: 'settings', img: ICONS.macos.settings, name: 'Settings' },
] as const;

export default function MacDesktop() {
  const { wallpaper, windows, activeId, openApp, closeWin, toggleMin, toggleMax, spotlightOpen, toggle, launchpadOpen, quickSettingsOpen, accent, dark, setDark, lock, restart, powerOff } = useOS();
  const [q, setQ] = useState('');
  const [mag, setMag] = useState<number | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [about, setAbout] = useState(false);
  const now = new Date();
  const filtered = DOCK.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));
  const active = windows.find((w) => w.id === activeId) ?? null;
  const appName = active ? active.title : 'Finder';
  const isFileApp = active && (active.app === 'finder' || active.app === 'explorer');

  const M = (id: string, label: React.ReactNode) => (
    <button key={id} className={menu === id ? 'm-on' : ''} onClick={(e) => { e.stopPropagation(); setMenu(menu === id ? null : id); }}>{label}</button>
  );
  const Item = ({ label, fn, dis }: { label: string; fn?: () => void; dis?: boolean }) => (
    <button disabled={dis} onClick={(e) => { e.stopPropagation(); setMenu(null); fn?.(); }}>{label}</button>
  );

  return (
    <div className="desktop mac" style={bgStyle(wallpaper)} onClick={() => { setMenu(null); useOS.getState().closeAllOverlays(); }}>
      <div className="menubar" onClick={(e) => e.stopPropagation()}>
        {M('apple', <b>🍎</b>)}
        {M('app', <b>{appName}</b>)}
        {M('file', <span>File</span>)}
        {M('edit', <span>Edit</span>)}
        {M('view', <span>View</span>)}
        <span className="sp" />
        <button onClick={() => toggle('quickSettingsOpen')}>🔋 📶 🔊</button>
        <span>{now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <button onClick={() => toggle('spotlightOpen')}>🔍</button>
        {menu === 'apple' && (
          <div className="dropdown" style={{ left: 4 }}>
            <Item label="About This Fusion Mac" fn={() => setAbout(true)} />
            <Item label="System Settings…" fn={() => openApp('settings')} />
            <hr />
            <Item label="Lock Screen" fn={lock} />
            <Item label="Restart…" fn={restart} />
            <Item label="Shut Down…" fn={powerOff} />
          </div>
        )}
        {menu === 'app' && (
          <div className="dropdown" style={{ left: 44 }}>
            <Item label={`About ${appName}`} fn={() => setAbout(true)} />
            <hr />
            <Item label={`Quit ${appName}`} dis={!active} fn={() => active && closeWin(active.id)} />
          </div>
        )}
        {menu === 'file' && (
          <div className="dropdown" style={{ left: 120 }}>
            <Item label="New Finder Window" fn={() => openApp('finder')} />
            <Item label="New Folder" dis={!isFileApp} fn={() => useFS.getState().dispatchMenu('new-folder')} />
            <Item label="New File" dis={!isFileApp} fn={() => useFS.getState().dispatchMenu('new-file')} />
            <hr />
            <Item label="Close Window" dis={!active} fn={() => active && closeWin(active.id)} />
          </div>
        )}
        {menu === 'edit' && (
          <div className="dropdown" style={{ left: 170 }}>
            <Item label="Copy file" dis={!isFileApp} fn={() => useFS.getState().dispatchMenu('copy-sel')} />
            <Item label="Cut file" dis={!isFileApp} fn={() => useFS.getState().dispatchMenu('cut-sel')} />
            <Item label="Paste file" dis={!isFileApp} fn={() => useFS.getState().dispatchMenu('paste-clip')} />
            <hr />
            <Item label="Delete selected" dis={!isFileApp} fn={() => useFS.getState().dispatchMenu('delete-sel')} />
          </div>
        )}
        {menu === 'view' && (
          <div className="dropdown" style={{ left: 220 }}>
            <Item label="Toggle Icons / List" fn={() => useFS.getState().dispatchMenu('toggle-view')} />
            <Item label={dark ? '☀ Light windows' : '🌙 Dark windows'} fn={() => setDark(!dark)} />
            <hr />
            <Item label="Open Spotlight" fn={() => useOS.getState().toggle('spotlightOpen')} />
          </div>
        )}
      </div>
      {about && (
        <div className="aboutmodal" onClick={(e) => e.stopPropagation()}>
          <h2>🍎 About This Fusion Mac</h2>
          <p><b>FusionOS 1.0 (mashup)</b> · kernel zustand-4.5.5</p>
          <p>Shells: Win11 · macOS Tahoe · Ubuntu · Fusion</p>
          <p>FS: virtual, persisted to localStorage · {useFS.getState().list('/Documents').length} docs</p>
          <p className="muted">Upstreams: win11React (CC0) · macOS-Portfolio (MIT) · ubuntu-react</p>
          <button onClick={() => setAbout(false)}>Close</button>
        </div>
      )}
      {windows.map((w) => <OsWindow key={w.id} w={w} chrome="mac" />)}
      {spotlightOpen ? (
        <div className="spotlight" onClick={(e) => e.stopPropagation()}>
          <div>🔍 <input autoFocus placeholder="Spotlight Search (⌘K port — searches all 3 DEs' apps)" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div className="spres">
            {filtered.map((d) => <button key={d.id} onClick={() => openApp(d.id as never)}><img src={d.img} alt="" width={20} height={20} /> {d.name}</button>)}
            <button onClick={() => useOS.getState().setDE('win11')}>🪟 Switch to Windows 11</button>
            <button onClick={() => useOS.getState().setDE('ubuntu')}>🟠 Switch to Ubuntu</button>
          </div>
        </div>
      ) : null}
      {launchpadOpen ? (
        <div className="launchpad" onClick={(e) => e.stopPropagation()}>
          {DOCK.map((d) => <button key={d.id} onClick={() => openApp(d.id as never)}><img src={d.img} alt={d.name} width={52} height={52} /><small>{d.name}</small></button>)}
        </div>
      ) : null}
      {quickSettingsOpen ? (
        <div className="controlcenter" onClick={(e) => e.stopPropagation()}>
          <h4>Control Center (macOS) ≈ Ubuntu Quick Settings</h4>
          <label>🔆 Brightness <input type="range" /></label>
          <label>🔊 Volume <input type="range" /></label>
          <div className="row"><button>📶 Wi-Fi</button><button>🔵 BT</button><button>✈ Airplane</button></div>
          <button onClick={() => openApp('settings')}>⚙ Open Fusion Settings (switch DE)</button>
        </div>
      ) : null}
      <div className="dockwrap">
        <div className="dock glass" onMouseLeave={() => setMag(null)}>
          {DOCK.map((d, i) => (
            <motion.button
              key={d.id}
              animate={{ scale: mag === i ? 1.6 : 1, y: mag === i ? -10 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              onMouseEnter={() => setMag(i)}
              onClick={() => openApp(d.id as never)}
              title={d.name}
              style={windows.some((w) => w.app === d.id) ? { boxShadow: `0 2px 0 ${accent}` } : undefined}
            ><img src={d.img} alt={d.name} width={38} height={38} /></motion.button>
          ))}
          <span className="sep" />
          <button onClick={() => toggle('launchpadOpen')} title="Launchpad"><img src={ICONS.macos.launchpad} alt="Launchpad" width={38} height={38} /></button>
        </div>
      </div>
    </div>
  );
}
