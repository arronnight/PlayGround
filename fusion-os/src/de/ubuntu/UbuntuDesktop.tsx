import { useState } from 'react';
import { useOS } from '../../store/osStore';
import { OsWindow } from '../../components/OsWindow';
import { ICONS, bgStyle } from '../../assets';

const DOCK = [
  { id: 'browser', img: ICONS.win11.edge, name: 'Firefox' },
  { id: 'explorer', img: ICONS.win11.explorer, name: 'Files' },
  { id: 'terminal', img: ICONS.win11.terminal, name: 'Terminal' },
  { id: 'vscode', img: ICONS.win11.code, name: 'Code' },
  { id: 'store', img: ICONS.macos.appstore, name: 'Software' },
  { id: 'settings', img: ICONS.ubuntu.settings, name: 'Settings' },
] as const;

export default function UbuntuDesktop() {
  const { wallpaper, windows, openApp, activitiesOpen, toggle, quickSettingsOpen, accent, lock, restart, powerOff } = useOS();
  const [q, setQ] = useState('');
  const [powerOpen, setPowerOpen] = useState(false);
  const now = new Date();
  return (
    <div className="desktop ubuntu" style={bgStyle(wallpaper)} onClick={() => setPowerOpen(false)}>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => toggle('activitiesOpen')}>● Activities</button>
        <span className="sp" />
        <span>{now.toLocaleDateString([], { month: 'short', day: 'numeric' })} {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="sp" />
        <button onClick={() => toggle('quickSettingsOpen')}>🔊 📶 🔋</button>
        <button onClick={() => setPowerOpen(!powerOpen)} title="Power">⏻</button>
        {powerOpen && (
          <span className="powermenu dark" onClick={(e) => e.stopPropagation()}>
            <button onClick={lock}>🔒 Lock</button>
            <button onClick={restart}>⟳ Restart</button>
            <button onClick={powerOff}>⏻ Power Off</button>
          </span>
        )}
      </div>
      <div className="ubody">
        <div className="udock">
          {DOCK.map((d) => (
            <button key={d.id} title={d.name} onClick={() => openApp(d.id as never)}
              style={windows.some((w) => w.app === d.id) ? { borderLeft: `3px solid ${accent}` } : undefined}><img src={d.img} alt={d.name} width={30} height={30} /></button>
          ))}
          <button className="showapps" onClick={() => toggle('activitiesOpen')}>⋮⋮⋮</button>
        </div>
        <div className="umain">
          {windows.map((w) => <OsWindow key={w.id} w={w} chrome="gnome" />)}
          <p className="uhint">Ubuntu port — Activities overview, left Dock, Top Panel. Open Settings → switch to 🪟/🍎 anytime.</p>
        </div>
      </div>
      {activitiesOpen ? (
        <div className="activities" onClick={(e) => e.stopPropagation()}>
          <input autoFocus placeholder="Type to search (Ubuntu Activities ≈ Spotlight ≈ Win Search)" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="workspaces"><div>Workspace 1: {windows.length} windows</div><div>Workspace 2: empty</div></div>
          <div className="appgrid">
            {DOCK.filter((d) => d.name.toLowerCase().includes(q.toLowerCase())).map((d) => (
              <button key={d.id} onClick={() => openApp(d.id as never)}><img src={d.img} alt={d.name} width={44} height={44} /><small>{d.name}</small></button>
            ))}
            <button onClick={() => openApp('notepad')}><img src={ICONS.macos.notes} alt="Text" width={44} height={44} /><small>Text</small></button>
            <button onClick={() => openApp('calculator')}><img src={ICONS.ubuntu.calculator} alt="Calc" width={44} height={44} /><small>Calc</small></button>
          </div>
        </div>
      ) : null}
      {quickSettingsOpen ? (
        <div className="qsettings" onClick={(e) => e.stopPropagation()}>
          <h4>Quick Settings (Ubuntu ControlPanel port)</h4>
          <label>🔊 <input type="range" /></label>
          <label>🔆 <input type="range" /></label>
          <div className="row"><button>📶</button><button>🔵</button><button>🔋</button></div>
          <button onClick={() => openApp('settings')}>⚙ All Settings (switch DE)</button>
        </div>
      ) : null}
    </div>
  );
}
