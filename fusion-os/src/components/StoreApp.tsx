import { useState } from 'react';
import { useOS, type AppId } from '../store/osStore';

interface Item {
  id: string; name: string; desc: string; icon: string;
  app: AppId; size: string; rating: number;
}

const CATALOG: Item[] = [
  { id: 'files', name: 'Files Pro', desc: 'Tabbed browsing for the VFS (wraps Explorer).', icon: '📁', app: 'explorer', size: '2 MB', rating: 4.8 },
  { id: 'safari', name: 'Voyager Browser', desc: 'Tabs, bookmarks, start page. Opens sites that allow embedding.', icon: '🧭', app: 'browser', size: '18 MB', rating: 4.6 },
  { id: 'code', name: 'Fusion Code', desc: 'Real editor on the virtual filesystem with Ctrl+S.', icon: '🧑‍💻', app: 'vscode', size: '42 MB', rating: 4.9 },
  { id: 'shell', name: 'Shell+', desc: 'ls, cd, cat, echo >, mkdir, rm, open — all real.', icon: '⬛', app: 'terminal', size: '1 MB', rating: 4.7 },
  { id: 'photos', name: 'Photos', desc: 'Viewer for the vendored wallpapers. Can set wallpaper.', icon: '🖼', app: 'photos', size: '3 MB', rating: 4.5 },
  { id: 'calc', name: 'Calculator', desc: 'Standard four-function calculator.', icon: '🧮', app: 'calculator', size: '1 MB', rating: 4.2 },
  { id: 'notes', name: 'Quick Notes', desc: 'Edits and saves real .txt files in the VFS.', icon: '📝', app: 'notepad', size: '1 MB', rating: 4.4 },
];

const LS = 'fusion-store-v1';
function loadInstalled(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LS);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { files: true, shell: true, notes: true };
}

export default function StoreApp() {
  const { openApp } = useOS();
  const [installed, setInstalled] = useState<Record<string, boolean>>(loadInstalled);
  const [tab, setTab] = useState<'all' | 'installed'>('all');
  const [q, setQ] = useState('');

  const install = (id: string) => {
    const next = { ...installed, [id]: true };
    setInstalled(next);
    try { localStorage.setItem(LS, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const items = CATALOG.filter((c) =>
    (tab === 'all' || installed[c.id]) &&
    (c.name.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="storeapp">
      <div className="fv-bar">
        <b>🛍 Fusion Store</b>
        <button className={tab === 'all' ? 'on' : ''} onClick={() => setTab('all')}>Discover</button>
        <button className={tab === 'installed' ? 'on' : ''} onClick={() => setTab('installed')}>
          Installed ({Object.values(installed).filter(Boolean).length})
        </button>
        <input placeholder="Search store" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="storelist">
        {items.map((c) => (
          <div key={c.id} className="storeitem">
            <span className="si">{c.icon}</span>
            <div className="sinfo">
              <b>{c.name}</b> <span className="muted">★ {c.rating} · {c.size}</span>
              <p>{c.desc}</p>
            </div>
            {installed[c.id]
              ? <button onClick={() => openApp(c.app)}>Open</button>
              : <button className="get" onClick={() => install(c.id)}>Get</button>}
          </div>
        ))}
        {items.length === 0 && <p className="muted">Nothing here — try Discover.</p>}
      </div>
    </div>
  );
}
