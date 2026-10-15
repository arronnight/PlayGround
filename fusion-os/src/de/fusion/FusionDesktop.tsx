import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOS } from '../../store/osStore';
import { OsWindow } from '../../components/OsWindow';
import { ICONS, bgStyle } from '../../assets';

/**
 * Fusion — the custom mashup DE.
 *  Top bar    = Ubuntu Activities button + macOS menus + Ubuntu centered clock + Win11 tray
 *  Dock       = macOS magnification + Win11 Start button + Ubuntu 9-dot Show Apps
 *  Search     = one unified Spotlight/Start/Activities search
 *  Side panel = Win11 Widgets + macOS Control Center + Ubuntu sliders, merged
 *  Windows    = macOS traffic lights + Win11 min/max/close + Snap buttons (fusion chrome)
 */
const DOCK = [
  { id: 'explorer', img: ICONS.win11.explorer, name: 'Explorer', from: 'Win11' },
  { id: 'safari', img: ICONS.macos.safari, name: 'Safari', from: 'macOS' },
  { id: 'terminal', img: ICONS.win11.terminal, name: 'Terminal', from: 'Win11' },
  { id: 'notepad', img: ICONS.macos.notes, name: 'Notes', from: 'macOS' },
  { id: 'calculator', img: ICONS.ubuntu.calculator, name: 'Calculator', from: 'Ubuntu' },
  { id: 'vscode', img: ICONS.win11.code, name: 'Code', from: 'Win11' },
  { id: 'store', img: ICONS.macos.appstore, name: 'Software', from: 'macOS' },
  { id: 'settings', img: ICONS.ubuntu.settings, name: 'Settings', from: 'Ubuntu' },
] as const;

export default function FusionDesktop() {
  const { wallpaper, windows, activeId, openApp, focusWin, startOpen, spotlightOpen, activitiesOpen, quickSettingsOpen, toggle, accent, lock, restart, powerOff } = useOS();
  const [q, setQ] = useState('');
  const [mag, setMag] = useState<number | null>(null);
  const [powerOpen, setPowerOpen] = useState(false);
  const now = new Date();
  const query = (spotlightOpen ? q : q).toLowerCase();
  const results = DOCK.filter((d) => d.name.toLowerCase().includes(query) || d.from.toLowerCase().includes(query));

  return (
    <div className="desktop fusion" style={bgStyle(wallpaper)} onClick={() => { setPowerOpen(false); useOS.getState().closeAllOverlays(); }}>
      {/* ── Mashed top bar ── */}
      <div className="menubar fusionbar" onClick={(e) => e.stopPropagation()}>
        <button className="fuse-act" onClick={() => toggle('activitiesOpen')}>● Activities</button>
        <b>◈</b><span>Fusion</span><span>File</span><span>Edit</span><span>View</span>
        <span className="sp" />
        <span className="fuse-clock">{now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}&nbsp;&nbsp;{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="sp" />
        <button onClick={() => toggle('spotlightOpen')} title="Unified search">🔍</button>
        <button onClick={() => toggle('startOpen')} title="Widgets">◧</button>
        <button onClick={() => toggle('quickSettingsOpen')} title="Merged control center">🔊 📶 🔋</button>
        <button onClick={(e) => { e.stopPropagation(); setPowerOpen(!powerOpen); }} title="Power">⏻</button>
        {powerOpen && (
          <span className="powermenu dark" onClick={(e) => e.stopPropagation()}>
            <button onClick={lock}>🔒 Lock</button>
            <button onClick={restart}>⟳ Restart</button>
            <button onClick={powerOff}>⏻ Shut Down</button>
          </span>
        )}
      </div>

      {/* open windows get the fusion chrome */}
      {windows.map((w) => <OsWindow key={w.id} w={w} chrome="fusion" />)}

      {/* ── Unified search: Spotlight + Start search + Activities search ── */}
      {spotlightOpen ? (
        <div className="spotlight" onClick={(e) => e.stopPropagation()}>
          <div>🔍 <input autoFocus placeholder="Fusion search — apps, origins (win11/macos/ubuntu), actions…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div className="spres">
            {results.map((d) => (
              <button key={d.id} onClick={() => openApp(d.id as never)}>
                <img src={d.img} alt="" width={20} height={20} /> {d.name} <small className="muted">· {d.from}</small>
              </button>
            ))}
            <button onClick={() => useOS.getState().setDE('win11')}>🪟 Pure Windows 11 mode</button>
            <button onClick={() => useOS.getState().setDE('macos')}>🍎 Pure macOS mode</button>
            <button onClick={() => useOS.getState().setDE('ubuntu')}>🟠 Pure Ubuntu mode</button>
          </div>
        </div>
      ) : null}

      {/* ── Start menu (Win11 part of the mash) ── */}
      {startOpen ? (
        <div className="startmenu" onClick={(e) => e.stopPropagation()}>
          <input className="search" placeholder="Start search…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="appgrid">
            {results.map((a) => (
              <button key={a.id} onClick={() => openApp(a.id as never)}><img src={a.img} alt={a.name} width={36} height={36} /><small>{a.name}</small></button>
            ))}
          </div>
          <div className="start-foot"><span>◈ FusionUser · {windows.length} open</span><button onClick={() => toggle('startOpen')}>⏻</button></div>
        </div>
      ) : null}

      {/* ── Overview grid (Ubuntu Activities + macOS Launchpad mashed) ── */}
      {activitiesOpen ? (
        <div className="launchpad fusion-over" onClick={(e) => e.stopPropagation()}>
          <input autoFocus className="search" placeholder="Type to filter the mash…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="workspaces"><div>Workspace 1: {windows.length} windows</div><div>Workspace 2: empty</div></div>
          <div className="appgrid over-grid">
            {results.map((d) => (
              <button key={d.id} onClick={() => { openApp(d.id as never); }}>
                <img src={d.img} alt={d.name} width={52} height={52} /><small>{d.name} · {d.from}</small>
              </button>
            ))}
          </div>
          <div className="row over-open">
            {windows.map((w) => (
              <button key={w.id} className={activeId === w.id ? 'on' : ''} onClick={() => focusWin(w.id)}>{w.title}</button>
            ))}
          </div>
        </div>
      ) : null}

      {/* ── Merged side panel: Widgets + Control Center + Quick Settings ── */}
      {quickSettingsOpen ? (
        <div className="controlcenter fusion-panel" onClick={(e) => e.stopPropagation()}>
          <h4>◈ Fusion Panel — Widgets · Controls · Quick Settings</h4>
          <div className="wgrid"><div>⛅ 21°C Sunny</div><div>📅 {now.toDateString()}</div></div>
          <label>🔆 Brightness <input type="range" /></label>
          <label>🔊 Volume <input type="range" /></label>
          <div className="row"><button>📶 Wi-Fi</button><button>🔵 BT</button><button>✈ Airplane</button></div>
          <button onClick={() => openApp('settings')}>⚙ Fusion Settings (switch DE / wallpaper)</button>
        </div>
      ) : null}

      {/* ── Mashed dock ── */}
      <div className="dockwrap" onClick={(e) => e.stopPropagation()}>
        <div className="dock glass" onMouseLeave={() => setMag(null)}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggle('startOpen')} title="Start (Win11)">🪟</motion.button>
          <span className="sep" />
          {DOCK.map((d, i) => (
            <motion.button
              key={d.id}
              animate={{ scale: mag === i ? 1.6 : 1, y: mag === i ? -10 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              onMouseEnter={() => setMag(i)}
              onClick={() => openApp(d.id as never)}
              title={`${d.name} (${d.from})`}
              style={windows.some((w) => w.app === d.id) ? { boxShadow: `0 2px 0 ${accent}` } : undefined}
            ><img src={d.img} alt={d.name} width={38} height={38} /></motion.button>
          ))}
          <span className="sep" />
          <button onClick={() => toggle('activitiesOpen')} title="Show Apps grid (Ubuntu 9-dot + macOS Launchpad)">⋮⋮⋮</button>
        </div>
      </div>
    </div>
  );
}
