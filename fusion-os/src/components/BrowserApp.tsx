import { useEffect, useRef, useState } from 'react';

interface Tab {
  id: number; url: string; hist: string[]; hi: number;
  mode: 'direct' | 'proxy';
  doc: string | null; perr: string | null; loading: boolean;
}

const START = 'fusion://start';
const HELP = 'fusion://help';

const BOOKMARKS = [
  { name: 'Example', url: 'https://example.com' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Operating_system' },
  { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.1357%2C51.4975%2C-0.0957%2C51.5175&layer=mapnik' },
  { name: 'Google', url: 'https://www.google.com/' },
  { name: 'YouTube', url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
  { name: 'GitHub', url: 'https://github.com/' },
  { name: 'Fusion Help', url: HELP },
];

/* ---------- URL handling ---------- */

/** Video pages → embed players that explicitly allow framing. */
function toEmbedURL(input: string): string | null {
  const m = input.match(/(?:youtube\.com\/(?:watch\?[^#]*v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
  const v = input.match(/vimeo\.com\/(\d+)/);
  if (v && !input.includes('player.vimeo')) return `https://player.vimeo.com/video/${v[1]}`;
  return null;
}

/** Hosts known to send X-Frame-Options / frame-ancestors (verified 2026). */
function isAlwaysProxy(url: string): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return /(^|\.)google\./.test(h)
      || h.endsWith('bing.com') || h.endsWith('duckduckgo.com')
      || h.endsWith('yahoo.com') || h === 'search.yahoo.com'
      || h.endsWith('facebook.com') || h.endsWith('instagram.com')
      || h === 'x.com' || h.endsWith('twitter.com') || h.endsWith('tiktok.com')
      || h.endsWith('linkedin.com') || h === 'github.com'
      || h.endsWith('youtube.com');
  } catch { return false; }
}

function normalize(input: string): string {
  const t = input.trim();
  if (t.startsWith('fusion://')) return t;
  const withScheme = /^https?:\/\//i.test(t) ? t : 'https://' + t;
  const embed = toEmbedURL(withScheme);
  if (embed) return embed;
  if (/^https?:\/\/[\w-]+(\.[\w-]+)+/.test(withScheme)) return withScheme;
  return `fusion://search?q=${encodeURIComponent(t)}`;
}

const bingSearch = (q: string) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`;

/* ---------- proxy fetch (strips framing headers server-side) ---------- */

async function fetchViaProxy(url: string): Promise<string> {
  const builders = [
    (u: string) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
    (u: string) => 'https://cors.isomorphic-git.org/' + u,
  ];
  let lastErr: unknown = new Error('proxy failed');
  for (const build of builders) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const r = await fetch(build(url), { signal: ctrl.signal });
      if (!r.ok) throw new Error(`proxy HTTP ${r.status}`);
      const text = await r.text();
      const trimmed = text.trimStart();
      if (!trimmed.startsWith('<') || !/<(html|a|div|h1|h2|p|title|body)[\s>]/i.test(trimmed.slice(0, 4000))) {
        throw new Error('target did not return a web page (file download?)');
      }
      const origin = new URL(url).origin + '/';
      if (/<head[^>]*>/i.test(text)) return text.replace(/<head([^>]*)>/i, `<head$1><base href="${origin}">`);
      return `<base href="${origin}">` + text;
    } catch (e) {
      lastErr = (e as Error).name === 'AbortError' ? new Error('proxy timed out (12s per relay)') : e;
    } finally { clearTimeout(timer); }
  }
  throw lastErr;
}

/* ---------- local pages ---------- */

function StartPage({ go }: { go: (u: string) => void }) {
  const [q, setQ] = useState('');
  return (
    <div className="bstart">
      <h2>◈ Fusion Start</h2>
      <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) go(normalize(q)); }}>
        <input autoFocus placeholder="Enter address, paste a YouTube link, or search…" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>
      <div className="bmarks">
        {BOOKMARKS.map((b) => (
          <button key={b.url} onClick={() => go(b.url)}>🌐 {b.name}</button>
        ))}
      </div>
      <p className="muted">🔓 = loaded through the proxy (Google, YouTube pages, GitHub…). YouTube videos auto-convert to the embed player. Blank page? Hit 🔓 Proxy.</p>
    </div>
  );
}

function HelpPage() {
  return (
    <div className="bstart">
      <h2>◈ Fusion Browser help</h2>
      <ul>
        <li><b>Tabs, history, bookmarks</b> all work. <b>🏠</b> returns here, <b>↗</b> opens the page outside FusionOS.</li>
        <li><b>🔓 Proxy mode:</b> Google, Bing, YouTube pages, GitHub etc. refuse to load inside other pages (X-Frame-Options). The proxy re-serves them so they render. Auto-enabled for those sites.</li>
        <li><b>YouTube watch links</b> auto-convert to the nocookie embed player — video, no proxy needed.</li>
        <li><b>Search box:</b> plain words run a Bing search through the proxy, right here.</li>
        <li>JS-heavy apps (Gmail, Docs, maps editing) may be limited in proxied view — use ↗ for the full app.</li>
      </ul>
    </div>
  );
}

function SearchPage({ q, goProxy, goExternal }: { q: string; goProxy: (u: string) => void; goExternal: (u: string) => void }) {
  const fired = useRef(false);
  useEffect(() => {
    if (!fired.current) { fired.current = true; goProxy(bingSearch(q)); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bstart">
      <h2>Search: {q}</h2>
      <p className="muted">Loading Bing results through the proxy… or pick:</p>
      <div className="bmarks">
        <button onClick={() => goProxy(`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`)}>📖 Wikipedia here</button>
        <button onClick={() => goExternal(`https://www.google.com/search?q=${encodeURIComponent(q)}`)}>🔍 Google ↗</button>
        <button onClick={() => goExternal(`https://duckduckgo.com/?q=${encodeURIComponent(q)}`)}>🦆 DuckDuckGo ↗</button>
      </div>
    </div>
  );
}

/* ---------- browser ---------- */

let tabSeq = 1;
const freshTab = (url: string): Tab => ({ id: tabSeq++, url, hist: [url], hi: 0, mode: 'direct', doc: null, perr: null, loading: false });

export default function BrowserApp({ initialUrl }: { initialUrl?: string }) {
  const startUrl = initialUrl || START;
  const startMode = !initialUrl || initialUrl.startsWith('fusion://') ? 'direct' : isAlwaysProxy(initialUrl) ? 'proxy' : 'direct';
  const [tabs, setTabs] = useState<Tab[]>([{ ...freshTab(startUrl), mode: startMode as Tab['mode'] }]);
  const [active, setActive] = useState(0);
  const [addr, setAddr] = useState(initialUrl && !initialUrl.startsWith('fusion://') ? initialUrl : '');
  const tab = tabs[active];

  // auto-proxy the initial URL when needed
  const booted = useRef(false);
  useEffect(() => {
    if (!booted.current) {
      booted.current = true;
      const t = tabs[0];
      if (t.mode === 'proxy') runProxy(t.id, t.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runProxy = (id: number, url: string) => {
    setTabs((ts) => ts.map((t) => (t.id === id ? { ...t, mode: 'proxy' as const, loading: true, perr: null } : t)));
    fetchViaProxy(url).then((doc) => {
      setTabs((ts) => ts.map((t) => (t.id === id && t.url === url ? { ...t, doc, loading: false } : t)));
    }).catch((err: Error) => {
      setTabs((ts) => ts.map((t) => (t.id === id && t.url === url ? { ...t, perr: err.message, loading: false } : t)));
    });
  };

  const nav = (raw: string, forceProxy?: boolean) => {
    const url = normalize(raw);
    const mode: Tab['mode'] = url.startsWith('fusion://') ? 'direct' : forceProxy === true || (forceProxy === undefined && isAlwaysProxy(url)) ? 'proxy' : 'direct';
    const id = tab.id;
    setTabs((ts) => ts.map((t, i) =>
      i === active ? { ...t, url, hist: [...t.hist.slice(0, t.hi + 1), url], hi: t.hi + 1, mode, doc: null, perr: null, loading: mode === 'proxy' } : t));
    setAddr(url.startsWith('fusion://') ? '' : url);
    if (mode === 'proxy') runProxy(id, url);
  };

  const jump = (d: -1 | 1) => {
    const ni = tab.hi + d;
    if (ni < 0 || ni >= tab.hist.length) return;
    const url = tab.hist[ni];
    const id = tab.id;
    const mode: Tab['mode'] = url.startsWith('fusion://') ? 'direct' : tab.mode;
    setTabs((ts) => ts.map((x, i) => (i === active ? { ...x, url, hi: ni, mode, doc: mode === 'proxy' ? x.doc : null, perr: null, loading: mode === 'proxy' && x.url !== url } : x)));
    setAddr(url.startsWith('fusion://') ? '' : url);
    if (mode === 'proxy') runProxy(id, url);
  };

  const toggleProxy = () => {
    if (tab.url.startsWith('fusion://')) return;
    if (tab.mode === 'proxy') {
      setTabs((ts) => ts.map((t, i) => (i === active ? { ...t, mode: 'direct' as const, loading: false, perr: null } : t)));
    } else if (tab.doc) {
      setTabs((ts) => ts.map((t, i) => (i === active ? { ...t, mode: 'proxy' as const, loading: false, perr: null } : t)));
    } else {
      runProxy(tab.id, tab.url);
    }
  };

  const addTab = () => {
    setTabs((ts) => [...ts, freshTab(START)]);
    setActive(tabs.length);
    setAddr('');
  };
  const closeTab = (i: number) => {
    if (tabs.length === 1) {
      setTabs([freshTab(START)]);
      setActive(0); setAddr('');
      return;
    }
    setTabs((ts) => ts.filter((_, j) => j !== i));
    setActive((a) => Math.max(0, i === a ? a - 1 : a > i ? a - 1 : a));
  };

  const renderUrl = (t: Tab) => {
    const url = t.url;
    if (url === START) return <StartPage go={(u) => nav(u)} />;
    if (url === HELP) return <HelpPage />;
    if (url.startsWith('fusion://search')) {
      const q = decodeURIComponent(url.split('q=')[1] ?? '');
      return <SearchPage q={q} goProxy={(u) => nav(u, true)} goExternal={(u) => window.open(u, '_blank')} />;
    }
    if (t.mode === 'proxy') {
      if (t.loading) return <div className="bstart"><h2>🔓 Fetching via proxy…</h2><p className="muted">{url}</p></div>;
      if (t.perr) return (
        <div className="bstart">
          <h2>⚠ Proxy failed</h2>
          <p className="muted">{t.perr}</p>
          <div className="bmarks">
            <button onClick={() => runProxy(t.id, url)}>⟳ Retry proxy</button>
            <button onClick={toggleProxy}>🔒 Try direct</button>
            <button onClick={() => window.open(url, '_blank')}>↗ Open externally</button>
          </div>
        </div>
      );
      if (t.doc) return <iframe key={'p' + url} title="page" srcDoc={t.doc} className="bframe" sandbox="allow-scripts allow-forms allow-popups" />;
      return <div className="bstart"><p className="muted">Preparing proxy…</p></div>;
    }
    return (
      <iframe key={'d' + url} title="page" src={url} className="bframe"
        sandbox="allow-scripts allow-forms allow-popups allow-same-origin" />
    );
  };

  return (
    <div className="browser">
      <div className="btabs">
        {tabs.map((t, i) => (
          <span key={t.id} className={`btab ${i === active ? 'on' : ''}`} onClick={() => { setActive(i); setAddr(t.url.startsWith('fusion://') ? '' : t.url); }}>
            {t.mode === 'proxy' ? '🔓 ' : ''}{t.url.replace('fusion://', '◈ ').slice(0, 24) || 'New tab'}
            <button onClick={(e) => { e.stopPropagation(); closeTab(i); }}>×</button>
          </span>
        ))}
        <button onClick={addTab} title="New tab">+</button>
      </div>
      <div className="bbar">
        <button onClick={() => jump(-1)} disabled={tab.hi === 0}>‹</button>
        <button onClick={() => jump(1)} disabled={tab.hi >= tab.hist.length - 1}>›</button>
        <button onClick={() => nav(tab.url, tab.mode === 'proxy')} title="Reload">⟳</button>
        <button onClick={() => nav(START)} title="Home">🏠</button>
        <form onSubmit={(e) => { e.preventDefault(); nav(addr); }}>
          <input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Search or enter address" />
        </form>
        {!tab.url.startsWith('fusion://') && (
          <button className={tab.mode === 'proxy' ? 'on' : ''} title="Sites that block embedding (Google, GitHub…) load through the proxy" onClick={toggleProxy}>
            {tab.mode === 'proxy' ? '🔓 Proxied' : '🔓 Proxy'}
          </button>
        )}
        {!tab.url.startsWith('fusion://') && (
          <button title="Open in real browser tab" onClick={() => window.open(tab.url, '_blank')}>↗</button>
        )}
      </div>
      <div className="bmarksrow">
        {BOOKMARKS.map((b) => <button key={b.url} onClick={() => nav(b.url)}>{b.name}</button>)}
      </div>
      <div className="bview">{renderUrl(tab)}</div>
    </div>
  );
}
