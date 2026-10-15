import { useEffect, useRef, useState } from 'react';
import { useOS, type WinState } from '../store/osStore';
import SettingsPanel from '../shell/SettingsPanel';
import { useFS, splitPath, joinPath, baseName, dirName } from '../fs/vfs';
import BrowserApp from './BrowserApp';
import StoreApp from './StoreApp';

/* ================= shared file view (Finder + Explorer) ================= */

function FileView({ initPath, style }: { initPath: string; style: 'mac' | 'win' }) {
  const fs = useFS();
  const [path, setPath] = useState(initPath);
  const [hist, setHist] = useState<string[]>([initPath]);
  const [hi, setHi] = useState(0);
  const [q, setQ] = useState('');
  const [view, setView] = useState<'icons' | 'list'>('icons');
  const [sel, setSel] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const menuSeq = useFS((s) => s.menuSeq);
  const menuAction = useFS((s) => s.menuAction);
  const { openApp } = useOS();

  const nav = (p: string) => {
    setPath(p); setSel(null); setQ('');
    setHist((h) => [...h.slice(0, hi + 1), p]);
    setHi((i) => i + 1);
  };
  const back = () => { if (hi > 0) { setHi(hi - 1); setPath(hist[hi - 1]); setSel(null); } };
  const fwd = () => { if (hi < hist.length - 1) { setHi(hi + 1); setPath(hist[hi + 1]); setSel(null); } };

  // respond to menu-bar actions (File/Edit/View menus)
  useEffect(() => {
    if (!menuAction) return;
    if (menuAction === 'new-folder') fs.mkdir(path, 'New Folder');
    else if (menuAction === 'new-file') fs.createFile(path, 'Untitled.txt');
    else if (menuAction === 'go-back') back();
    else if (menuAction === 'go-forward') fwd();
    else if (menuAction === 'go-up' && path !== '/') nav(dirName(path));
    else if (menuAction === 'toggle-view') setView((v) => (v === 'icons' ? 'list' : 'icons'));
    else if (menuAction === 'copy-sel' && sel) useFS.getState().setClip({ op: 'copy', src: joinPath([...splitPath(path), sel]) });
    else if (menuAction === 'cut-sel' && sel) useFS.getState().setClip({ op: 'cut', src: joinPath([...splitPath(path), sel]) });
    else if (menuAction === 'delete-sel' && sel) { useFS.getState().remove(joinPath([...splitPath(path), sel])); setSel(null); }
    else if (menuAction === 'paste-clip') {
      const c = useFS.getState().clip;
      if (c) {
        if (c.op === 'copy') useFS.getState().copy(c.src, path);
        else { useFS.getState().move(c.src, path); useFS.getState().setClip(null); }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuSeq]);

  // keep path valid after external changes
  const files = fs.list(path);
  const items = q ? files.filter((f) => f.name.toLowerCase().includes(q.toLowerCase())) : files;

  const openNode = (dir: string, name: string) => {
    const full = joinPath([...splitPath(dir), name]);
    const node = files.find((f) => f.name === name);
    if (!node) return;
    if (node.type === 'dir') nav(full);
    else if (node.kind === 'image') openApp('photos', name, full);
    else if (node.kind === 'code') openApp('vscode', name, full);
    else openApp('notepad', name, full);
  };

  const crumbs = splitPath(path);
  const doRename = (old: string) => {
    const p = joinPath([...splitPath(path), old]);
    useFS.getState().rename(p, renameVal);
    setRenaming(null);
  };

  return (
    <div className={`fileview ${style}`}>
      <div className="fv-side">
        {['/', '/Documents', '/Desktop', '/Downloads', '/Pictures', '/Music', '/Projects'].map((p) => (
          <button key={p} className={path === p ? 'on' : ''} onClick={() => nav(p)}>
            {p === '/' ? '💽 Root' : `${p === '/Pictures' ? '🖼' : p === '/Music' ? '🎵' : p === '/Documents' ? '📄' : p === '/Desktop' ? '🖥' : p === '/Downloads' ? '📥' : '📁'} ${baseName(p)}`}
          </button>
        ))}
      </div>
      <div className="fv-main">
        <div className="fv-bar">
          <button onClick={back} disabled={hi === 0}>‹</button>
          <button onClick={fwd} disabled={hi >= hist.length - 1}>›</button>
          <button onClick={() => path !== '/' && nav(dirName(path))}>↑</button>
          <span className="crumbs">
            <button onClick={() => nav('/')}>/</button>
            {crumbs.map((c, i) => (
              <button key={i} onClick={() => nav(joinPath(crumbs.slice(0, i + 1)))}>{c} /</button>
            ))}
          </span>
          <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          <button title="New folder" onClick={() => fs.mkdir(path, 'New Folder')}>📁+</button>
          <button title="New file" onClick={() => fs.createFile(path, 'Untitled.txt')}>📄+</button>
          <button title="Toggle view" onClick={() => setView(view === 'icons' ? 'list' : 'icons')}>{view === 'icons' ? '☰' : '▦'}</button>
        </div>
        <div className={`fv-grid ${view}`} onClick={() => setSel(null)}>
          {items.map((f) => (
            <div
              key={f.name}
              className={`fv-item ${sel === f.name ? 'sel' : ''}`}
              onClick={(e) => { e.stopPropagation(); setSel(f.name); }}
              onDoubleClick={() => openNode(path, f.name)}
            >
              {f.type === 'dir' ? <span className="fi">📁</span>
                : f.kind === 'image' ? <img className="fi-img" src={f.src} alt={f.name} />
                : <span className="fi">{f.kind === 'code' ? '📜' : '📄'}</span>}
              {renaming === f.name ? (
                <input autoFocus value={renameVal} onChange={(e) => setRenameVal(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => { if (e.key === 'Enter') doRename(f.name); if (e.key === 'Escape') setRenaming(null); }}
                  onBlur={() => setRenaming(null)} />
              ) : (
                <small onDoubleClick={(e) => { e.stopPropagation(); setRenaming(f.name); setRenameVal(f.name); }}>{f.name}</small>
              )}
            </div>
          ))}
          {items.length === 0 && <p className="muted">Empty folder.</p>}
        </div>
        <div className="fv-status">
          <span>{files.length} items</span>
          {sel && (
            <span className="fv-acts">
              <button onClick={() => { setRenaming(sel); setRenameVal(sel); }}>Rename</button>
              <button onClick={() => useFS.getState().setClip({ op: 'copy', src: joinPath([...splitPath(path), sel]) })}>Copy</button>
              <button onClick={() => useFS.getState().setClip({ op: 'cut', src: joinPath([...splitPath(path), sel]) })}>Cut</button>
              <button onClick={() => { useFS.getState().remove(joinPath([...splitPath(path), sel])); setSel(null); }}>Delete</button>
            </span>
          )}
          {useFS((s) => s.clip) && <button onClick={() => {
            const c = useFS.getState().clip!;
            if (c.op === 'copy') useFS.getState().copy(c.src, path);
            else { useFS.getState().move(c.src, path); useFS.getState().setClip(null); }
          }}>Paste ({useFS((s) => s.clip)?.op})</button>}
        </div>
      </div>
    </div>
  );
}

/* ================= Notepad (edits VFS files) ================= */

function NotepadApp({ path }: { path?: string }) {
  const fs = useFS();
  const [file, setFile] = useState<string | null>(path ?? null);
  const [text, setText] = useState(path ? fs.read(path) : '');
  const [name, setName] = useState(path ? baseName(path) : 'Untitled.txt');
  const [saved, setSaved] = useState(true);
  const save = () => {
    if (file) useFS.getState().write(file, text);
    else {
      const p = useFS.getState().createFile('/Documents', name || 'Untitled.txt', text);
      if (p) { setFile(p); setName(baseName(p)); }
    }
    setSaved(true);
  };
  return (
    <div className="noteapp">
      <div className="fv-bar">
        <input className="notename" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} title="Filename" />
        <button onClick={save}>💾 Save{!saved && ' *'}</button>
        <span className="muted">{file ?? '/Documents (new)'} · {text.length} chars · {text.split(/\s+/).filter(Boolean).length} words</span>
      </div>
      <textarea className="note" value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); } }} />
    </div>
  );
}

/* ================= VS Code (VFS tree + editor) ================= */

function treeFiles(prefix: string, acc: string[] = []): string[] {
  const kids = useFS.getState().list(prefix);
  for (const k of kids) {
    const full = joinPath([...splitPath(prefix), k.name]);
    if (k.type === 'dir') treeFiles(full, acc);
    else if (k.kind !== 'image') acc.push(full);
  }
  return acc;
}

function VSCodeApp({ path }: { path?: string }) {
  const fs = useFS();
  const [open, setOpen] = useState<string | null>(path ?? null);
  const [text, setText] = useState(path ? fs.read(path) : '');
  const [dirty, setDirty] = useState(false);
  // refresh tree when fs changes
  useFS((s) => s.root);
  const files = treeFiles('/');
  const load = (p: string) => { setOpen(p); setText(useFS.getState().read(p)); setDirty(false); };
  const save = () => { if (open) { useFS.getState().write(open, text); setDirty(false); } };
  return (
    <div className="vscode">
      <div className="vc-side">
        <b>EXPLORER</b>
        {files.map((f) => (
          <button key={f} className={open === f ? 'on' : ''} onClick={() => load(f)}>{f}</button>
        ))}
        <button className="vc-new" onClick={() => {
          const p = useFS.getState().createFile('/Projects', 'new.js', '// new file\n');
          if (p) load(p);
        }}>+ New file</button>
      </div>
      <div className="vc-main">
        <div className="fv-bar">
          <span>{open ?? 'no file open'}{dirty && ' ●'}</span>
          <button onClick={save} disabled={!open}>💾 Save (Ctrl+S)</button>
        </div>
        <textarea className="code edit" value={text} spellCheck={false}
          onChange={(e) => { setText(e.target.value); setDirty(true); }}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); } }} />
      </div>
    </div>
  );
}

/* ================= Terminal (real VFS shell) ================= */

function TermBody() {
  const [lines, setLines] = useState<string[]>([
    'FusionOS shell — type "help". The filesystem is real: ls, cd, cat, echo, mkdir, rm all work.',
  ]);
  const [cwd, setCwd] = useState('/Documents');
  const [cur, setCur] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView(), [lines]);

  const resolve = (p: string): string => {
    if (p.startsWith('/')) return joinPath(splitPath(p));
    const parts = splitPath(cwd);
    for (const seg of p.split('/')) {
      if (seg === '' || seg === '.') continue;
      if (seg === '..') parts.pop();
      else parts.push(seg);
    }
    return joinPath(parts);
  };

  const run = (raw: string) => {
    const out: string[] = [`fusion@os:${cwd}$ ${raw}`];
    const fs = useFS.getState();
    const toks = raw.trim().split(/\s+/);
    const cmd = toks[0] ?? '';
    const args = toks.slice(1);
    switch (cmd) {
      case '': break;
      case 'help':
        out.push('ls [dir] · cd <dir> · pwd · cat <file> · echo TEXT · echo TEXT > FILE · touch <file> · mkdir <dir> · rm <path> · open <app> · clear · neofetch');
        break;
      case 'pwd': out.push(cwd); break;
      case 'whoami': out.push('fusion'); break;
      case 'date': out.push(new Date().toString()); break;
      case 'neofetch':
        out.push('◈ FusionOS 1.0 — win11 + macos + ubuntu + fusion mashup', `cwd: ${cwd}`, 'shell: zustand-vfs · wm: drag/max/min');
        break;
      case 'clear': setLines([]); return;
      case 'ls': {
        const t = resolve(args[0] || '.');
        const kids = fs.list(t === '' ? '/' : t);
        out.push(kids.length ? kids.map((k) => (k.type === 'dir' ? k.name + '/' : k.name)).join('  ') : '(empty)');
        break;
      }
      case 'cd': {
        const t = resolve(args[0] || '/Documents');
        const kids = fs.list(t);
        // list() returns [] for both missing and empty — verify via read of a probe
        if (args[0] && kids.length === 0) {
          // could be empty dir; accept if path has no file conflict — check parent contains it as dir
          const parentKids = fs.list(dirName(t) || '/');
          const isDir = parentKids.some((k) => k.type === 'dir' && joinPath([...splitPath(dirName(t) || '/'), k.name]) === t);
          if (!isDir && t !== '/') { out.push(`cd: no such directory: ${args[0]}`); break; }
        }
        setCwd(t === '' ? '/' : t);
        break;
      }
      case 'cat': {
        if (!args[0]) { out.push('usage: cat <file>'); break; }
        const t = fs.read(resolve(args[0]));
        out.push(t === '' ? '(empty file or not found)' : t);
        break;
      }
      case 'echo': {
        const m = raw.match(/^echo\s+(.*?)\s*>\s*(\S+)\s*$/);
        if (m) {
          const target = resolve(m[2]);
          const parentDir = dirName(target) || '/';
          const parentKids = fs.list(parentDir);
          const kids = parentKids.filter((k) => joinPath([...splitPath(parentDir), k.name]) === target);
          if (kids.length > 0 && kids[0].type === 'file') fs.write(target, m[1]);
          else if (kids.length > 0) { out.push('echo: target is a directory'); break; }
          else {
            const created = fs.createFile(parentDir, baseName(target), m[1]);
            if (!created) { out.push('echo: cannot write there'); break; }
          }
          out.push(`wrote ${target}`);
        } else {
          out.push(raw.replace(/^echo\s?/, ''));
        }
        break;
      }
      case 'touch': {
        if (!args[0]) { out.push('usage: touch <file>'); break; }
        const target = resolve(args[0]);
        const p = fs.createFile(dirName(target) || '/', baseName(target), '');
        out.push(p ? `created ${p}` : 'touch: failed');
        break;
      }
      case 'mkdir': {
        if (!args[0]) { out.push('usage: mkdir <dir>'); break; }
        const target = resolve(args[0]);
        const p = fs.mkdir(dirName(target) || '/', baseName(target));
        out.push(p ? `created ${p}/` : 'mkdir: failed');
        break;
      }
      case 'rm': {
        if (!args[0]) { out.push('usage: rm <path>'); break; }
        fs.remove(resolve(args[0]));
        out.push(`removed ${args[0]}`);
        break;
      }
      case 'open': {
        if (!args[0]) { out.push('usage: open <explorer|notepad|browser|settings|…>'); break; }
        const apps = ['explorer', 'finder', 'browser', 'safari', 'terminal', 'notepad', 'calculator', 'vscode', 'store', 'settings', 'photos'] as const;
        if ((apps as readonly string[]).includes(args[0])) {
          useOS.getState().openApp(args[0] as (typeof apps)[number]);
          out.push(`opened ${args[0]}`);
        } else out.push(`open: unknown app: ${args[0]}`);
        break;
      }
      default: out.push(`command not found: ${cmd} (try "help")`);
    }
    setLines((l) => [...l, ...out]);
  };

  return (
    <div className="term" onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
      <div className="termline">fusion@os:{cwd}$&nbsp;
        <input value={cur}
          onChange={(e) => setCur(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { run(cur); setHist((h) => [cur, ...h]); setHi(-1); setCur(''); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi + 1 < hist.length) { setHi(hi + 1); setCur(hist[hi + 1]); } }
            else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi > 0) { setHi(hi - 1); setCur(hist[hi - 1]); } else { setHi(-1); setCur(''); } }
          }} />
      </div>
      <div ref={endRef} />
    </div>
  );
}

/* ================= Photos (real vendored images) ================= */

function PhotosApp({ path }: { path?: string }) {
  const { wallpaper, setWallpaper } = useOS();
  const dir = path ? dirName(path) : '/Pictures';
  // subscribe to fs so add/delete refreshes
  useFS((s) => s.root);
  const imgs = useFS.getState().list(dir).filter((f) => f.kind === 'image');
  const [idx, setIdx] = useState(() => Math.max(0, imgs.findIndex((f) => joinPath([...splitPath(dir), f.name]) === path)));
  const cur = imgs[Math.min(idx, Math.max(0, imgs.length - 1))];
  if (!cur) return <div className="app-body"><p className="muted">No images in {dir}. Pictures holds the real vendored wallpapers.</p></div>;
  const src = cur.src!;
  return (
    <div className="photosapp">
      <div className="fv-bar">
        <button onClick={() => setIdx((idx - 1 + imgs.length) % imgs.length)}>‹ Prev</button>
        <span>{cur.name} ({Math.min(idx, imgs.length - 1) + 1}/{imgs.length})</span>
        <button onClick={() => setIdx((idx + 1) % imgs.length)}>Next ›</button>
        <button onClick={() => setWallpaper(src)}>{wallpaper === src ? '✓ Wallpaper' : 'Set as wallpaper'}</button>
      </div>
      <img src={src} alt={cur.name} />
    </div>
  );
}

/* ================= calculator (unchanged) ================= */

function CalcBody() {
  const [v, setV] = useState('');
  return (
    <div className="app-body">
      <input className="calc-in" value={v} readOnly placeholder="0" />
      <div className="calc-grid">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((k) => (
          <button key={k} onClick={() => { try { setV(k === '=' ? String(Function(`return ${v}`)()) : v + k); } catch { setV('err'); } }}>{k}</button>
        ))}
        <button onClick={() => setV('')}>C</button>
      </div>
    </div>
  );
}

/* ================= window shell ================= */

function AppContent({ app, close, payload }: { app: WinState['app']; close: () => void; payload?: string }) {
  const { openApp } = useOS();
  void close;
  switch (app) {
    case 'explorer':
      return <FileView initPath={payload && payload.startsWith('/') ? payload : '/Documents'} style="win" />;
    case 'finder':
      return <FileView initPath={payload && payload.startsWith('/') ? payload : '/Documents'} style="mac" />;
    case 'settings':
      return <SettingsPanel onClose={close} />;
    case 'browser':
    case 'safari':
      return <BrowserApp initialUrl={payload} />;
    case 'terminal':
      return <TermBody />;
    case 'notepad':
      return <NotepadApp path={payload} />;
    case 'calculator':
      return <CalcBody />;
    case 'vscode':
      return <VSCodeApp path={payload} />;
    case 'photos':
      return <PhotosApp path={payload} />;
    case 'store':
      return <StoreApp />;
    default:
      return <div className="app-body">App: {app}</div>;
  }
}

export function OsWindow({ w, chrome }: { w: WinState; chrome: 'win' | 'mac' | 'gnome' | 'fusion' }) {
  const { closeWin, focusWin, toggleMin, toggleMax, moveWin, dark } = useOS();
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  if (w.minimized) return null;
  const style: React.CSSProperties = w.maximized
    ? { left: 0, top: chrome === 'win' ? 0 : 30, right: 0, bottom: chrome === 'win' ? 48 : chrome === 'gnome' ? 0 : chrome === 'fusion' ? 78 : 70, zIndex: w.z }
    : { left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z };
  return (
    <div className={`oswin ${chrome} ${dark ? 'dark' : ''}`} style={style} onMouseDown={() => focusWin(w.id)}>
      <div
        className="titlebar"
        onMouseDown={(e) => { if (w.maximized) return; drag.current = { dx: e.clientX - w.x, dy: e.clientY - w.y }; }}
        onMouseMove={(e) => { if (e.buttons === 1 && drag.current) moveWin(w.id, e.clientX - drag.current.dx, e.clientY - drag.current.dy); }}
        onMouseUp={() => (drag.current = null)}
        onDoubleClick={() => toggleMax(w.id)}
      >
        {chrome === 'mac' || chrome === 'fusion' ? (
          <span className="traffic">
            <i className="r" onClick={() => closeWin(w.id)} /><i className="y" onClick={() => toggleMin(w.id)} /><i className="g" onClick={() => toggleMax(w.id)} />
          </span>
        ) : null}
        <span className="ttl">{w.title}</span>
        <span className="ctl">
          {chrome === 'gnome' ? (
            <><button onClick={() => toggleMin(w.id)}>–</button><button onClick={() => toggleMax(w.id)}>▢</button><button onClick={() => closeWin(w.id)}>✕</button></>
          ) : chrome === 'win' || chrome === 'fusion' ? (
            <><button onClick={() => toggleMin(w.id)}>–</button><button onClick={() => toggleMax(w.id)}>▢</button><button className="x" onClick={() => closeWin(w.id)}>✕</button></>
          ) : (<button onClick={() => closeWin(w.id)}>✕</button>)}
        </span>
      </div>
      <AppContent app={w.app} close={() => closeWin(w.id)} payload={w.payload} />
      {(chrome === 'win' || chrome === 'fusion') && !w.maximized ? (
        <div className="snapbar">
          <button onClick={() => moveWin(w.id, 0, 0)}>⊞ Left</button>
          <button onClick={() => moveWin(w.id, window.innerWidth - w.w - 20, 60)}>⊞ Right</button>
        </div>
      ) : null}
    </div>
  );
}
