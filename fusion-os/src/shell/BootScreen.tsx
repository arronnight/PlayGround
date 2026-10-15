import { useState } from 'react';
import { useOS, type DE } from '../store/osStore';

const CARDS: { id: DE; name: string; desc: string; emoji: string; repo: string }[] = [
  { id: 'fusion', name: '◈ Fusion (mashup)', desc: 'NEW · Ubuntu bar + macOS Dock + Win11 Start + unified search + merged panel', emoji: '◈', repo: 'fusion' },
  { id: 'win11', name: 'Windows 11', desc: 'Start Menu · Snap · Widgets · Taskbar — base shell (blueedgetechno/win11React)', emoji: '🪟', repo: 'win11React' },
  { id: 'macos', name: 'macOS Tahoe', desc: 'Dock magnification · Menubar · Spotlight · Launchpad · Liquid Glass (aakashsharma003/macOS-Portfolio)', emoji: '🍎', repo: 'macOS-Portfolio' },
  { id: 'ubuntu', name: 'Ubuntu', desc: 'Activities · Left Dock · Top Panel · App Grid · Quick Settings (kelvinleandro/ubuntu-react)', emoji: '🟠', repo: 'ubuntu-react' },
];

export default function BootScreen() {
  const { boot, setDE, de } = useOS();
  const [picked, setPicked] = useState<DE>(de);
  return (
    <div className="boot">
      <div className="boot-card">
        <div className="boot-logo">◈ FusionOS</div>
        <p className="boot-sub">One kernel · four desktop environments · switch anytime in Settings</p>
        <div className="boot-grid">
          {CARDS.map((c) => (
            <button key={c.id} className={`boot-opt ${picked === c.id ? 'sel' : ''}`} onClick={() => { setPicked(c.id); setDE(c.id); }}>
              <span className="boot-emoji">{c.emoji}</span>
              <b>{c.name}</b>
              <small>{c.desc}</small>
            </button>
          ))}
        </div>
        <button className="boot-btn" onClick={boot}>⏻ Boot {CARDS.find((c) => c.id === picked)?.name}</button>
        <p className="boot-note">Credits: win11React (CC0-1.0) · macOS-Portfolio (MIT) · ubuntu-react. Re-implemented abilities, not copied binaries.</p>
      </div>
    </div>
  );
}
