import { useState } from 'react';
import { useOS } from '../../store/osStore';
import { OsWindow } from '../../components/OsWindow';
import { ICONS, bgStyle } from '../../assets';

const APPS = [
  { id: 'explorer', img: ICONS.win11.explorer, name: 'Explorer' },
  { id: 'browser', img: ICONS.win11.edge, name: 'Edge' },
  { id: 'store', img: ICONS.win11.store, name: 'Store' },
  { id: 'terminal', img: ICONS.win11.terminal, name: 'Terminal' },
  { id: 'notepad', img: ICONS.win11.notepad, name: 'Notepad' },
  { id: 'calculator', img: ICONS.win11.calculator, name: 'Calc' },
  { id: 'vscode', img: ICONS.win11.code, name: 'Code' },
  { id: 'settings', img: ICONS.win11.settings, name: 'Settings' },
] as const;

export default function Win11Desktop() {
  const { wallpaper, windows, activeId, openApp, focusWin, toggleMin, startOpen, toggle, accent, lock, restart, powerOff } = useOS();
  const [powerOpen, setPowerOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [calCursor, setCalCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const now = new Date();
  const firstDow = new Date(calCursor.y, calCursor.m, 1).getDay();
  const daysIn = new Date(calCursor.y, calCursor.m + 1, 0).getDate();
  const monthName = new Date(calCursor.y, calCursor.m, 1).toLocaleDateString([], { month: 'long', year: 'numeric' });
  return (
    <div className="desktop" style={bgStyle(wallpaper)} onClick={() => useOS.getState().closeAllOverlays()}>
      <div className="win-icons">
        {APPS.slice(0, 5).map((a) => (
          <button key={a.id} className="dicon" onDoubleClick={(e) => { e.stopPropagation(); openApp(a.id as never); }}>
            <img src={a.img} alt={a.name} width={40} height={40} /><small>{a.name}</small>
          </button>
        ))}
      </div>
      {windows.map((w) => <OsWindow key={w.id} w={w} chrome="win" />)}
      {startOpen ? (
        <div className="startmenu" onClick={(e) => e.stopPropagation()}>
          <input className="search" placeholder="Type here to search (ports macOS Spotlight + Ubuntu search too)" />
          <div className="appgrid">
            {APPS.map((a) => (
              <button key={a.id} onClick={() => openApp(a.id as never)}><img src={a.img} alt={a.name} width={36} height={36} /><small>{a.name}</small></button>
            ))}
          </div>
          <div className="start-foot">
            <span>◈ FusionUser</span>
            <span className="powerwrap">
              <button onClick={(e) => { e.stopPropagation(); setPowerOpen(!powerOpen); }}>⏻</button>
              {powerOpen && (
                <span className="powermenu" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => { setPowerOpen(false); lock(); }}>🌙 Sleep (lock)</button>
                  <button onClick={() => { setPowerOpen(false); restart(); }}>⟳ Restart</button>
                  <button onClick={() => { setPowerOpen(false); powerOff(); }}>⏻ Shut down</button>
                </span>
              )}
            </span>
          </div>
        </div>
      ) : null}
      <div className="taskbar" onClick={(e) => e.stopPropagation()}>
        <button className="tbtn" onClick={() => toggle('startOpen')}>🪟</button>
        <button className="tbtn" onClick={() => openApp('browser')}><img src={ICONS.win11.edge} alt="Edge" width={22} height={22} /></button>
        <button className="tbtn" onClick={() => openApp('explorer')}><img src={ICONS.win11.explorer} alt="Explorer" width={22} height={22} /></button>
        <button className="tbtn" onClick={() => toggle('quickSettingsOpen')}>◧ Widgets</button>
        <div className="openapps">
          {windows.map((w) => (
            <button key={w.id} className={activeId === w.id ? 'on' : ''} style={activeId === w.id ? { borderBottomColor: accent } : undefined}
              onClick={() => (activeId === w.id ? toggleMin(w.id) : focusWin(w.id))}>{w.title}</button>
          ))}
        </div>
        <div className="tray" onClick={(e) => { e.stopPropagation(); setCalOpen(!calOpen); }}>
          🔼 📶 🔊 {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br />{now.toLocaleDateString()}
        </div>
      </div>
      {calOpen && (
        <div className="calendar" onClick={(e) => e.stopPropagation()}>
          <div className="cal-head">
            <button onClick={() => setCalCursor((c) => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })}>‹</button>
            <b>{monthName}</b>
            <button onClick={() => setCalCursor((c) => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })}>›</button>
          </div>
          <div className="cal-grid">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="dow">{d}</span>)}
            {Array.from({ length: firstDow }).map((_, i) => <span key={'e' + i} />)}
            {Array.from({ length: daysIn }).map((_, i) => {
              const isToday = i + 1 === now.getDate() && calCursor.m === now.getMonth() && calCursor.y === now.getFullYear();
              return <span key={i} className={isToday ? 'today' : ''}>{i + 1}</span>;
            })}
          </div>
        </div>
      )}
      {useOS((s) => s.quickSettingsOpen) ? (
        <div className="widgets" onClick={(e) => e.stopPropagation()}>
          <h4>Widgets (Win11) + Weather (macOS widget port) + Clock (Ubuntu port)</h4>
          <div className="wgrid"><div>⛅ 21°C Sunny</div><div>📰 FusionOS boots 3 DEs</div><div>📅 {now.toDateString()}</div></div>
        </div>
      ) : null}
    </div>
  );
}
