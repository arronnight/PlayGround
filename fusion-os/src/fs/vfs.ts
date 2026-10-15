import { create } from 'zustand';

export interface VNode {
  name: string;
  type: 'dir' | 'file';
  children?: Record<string, VNode>;
  /** text content for text/code files */
  content?: string;
  /** kind drives which app opens it */
  kind?: 'text' | 'code' | 'image';
  /** image src for kind==='image' */
  src?: string;
  modified: number;
}

const now = () => Date.now();
const F = (name: string, content: string, kind: 'text' | 'code' = 'text'): VNode =>
  ({ name, type: 'file', content, kind, modified: now() });
const IMG = (name: string, src: string): VNode =>
  ({ name, type: 'file', kind: 'image', src, modified: now() });
const D = (name: string, children: Record<string, VNode> = {}): VNode =>
  ({ name, type: 'dir', children, modified: now() });

function seed(): VNode {
  return D('', {
    Documents: D('Documents', {
      'welcome.txt': F('welcome.txt',
        'Welcome to FusionOS!\n\nEverything here is a real virtual filesystem.\n- Finder and Explorer browse these same files.\n- Notepad and VS Code edit and save them.\n- Terminal commands (ls, cd, cat, echo, mkdir, rm) work on them.\n- Pictures holds the real vendored wallpapers — open them in Photos.\n'),
      'fusion-notes.md': F('fusion-notes.md',
        '# Fusion mashup notes\n\n- Top bar = Ubuntu Activities + macOS menus + Win11 tray\n- Dock = macOS magnification + Win11 Start + Ubuntu 9-dot grid\n- Windows = traffic lights + Win controls + Snap\n'),
      'todo.txt': F('todo.txt', '☐ Try every desktop environment\n☐ Spotlight-search an app\n☐ cat this file in Terminal\n☐ Change wallpaper in Settings\n'),
    }),
    Desktop: D('Desktop', {
      'readme.txt': F('readme.txt', 'Double-click icons to open apps.\nRight-size windows by dragging the title bar; double-click it to zoom.\n'),
    }),
    Downloads: D('Downloads', {
      'fusion-setup.log': F('fusion-setup.log', '[ok] kernel zustand-4.5.5\n[ok] wallpapers vendored\n[ok] icons vendored\n[ok] vfs mounted at /\n'),
    }),
    Pictures: D('Pictures', {
      'win11-default.jpg': IMG('win11-default.jpg', '/vendors/win11/wallpapers/win11-default.jpg'),
      'win11-dark.jpg': IMG('win11-dark.jpg', '/vendors/win11/wallpapers/win11-dark.jpg'),
      'tahoe-default.jpg': IMG('tahoe-default.jpg', '/vendors/macos/wallpapers/macOS_Tahoe_Default.jpg'),
      'tahoe-beach.jpg': IMG('tahoe-beach.jpg', '/vendors/macos/wallpapers/DefaultAerial_Tahoe_Beach.jpg'),
      'ubuntu-2204.jpg': IMG('ubuntu-2204.jpg', '/vendors/ubuntu/wallpapers/ubuntu-22-04.jpg'),
    }),
    Music: D('Music', {
      'playlist.m3u': F('playlist.m3u', '#EXTM3U\n#EXTINF:214,Boot Chime\n/SYSTEM/sounds/boot.ogg\n'),
    }),
    Projects: D('Projects', {
      'hello.js': F('hello.js', "function hello(de) {\n  return de + ' says hi from the VFS';\n}\n\nconsole.log(hello('fusion'));\n", 'code'),
    }),
  });
}

/* ---------- path helpers ---------- */
export function splitPath(p: string): string[] {
  return p.split('/').filter(Boolean);
}
export function joinPath(parts: string[]): string {
  return '/' + parts.join('/');
}
export function baseName(p: string): string {
  const s = splitPath(p);
  return s[s.length - 1] ?? '';
}
export function dirName(p: string): string {
  const s = splitPath(p);
  s.pop();
  return joinPath(s);
}
export function getNode(root: VNode, path: string): VNode | null {
  const parts = splitPath(path);
  let cur: VNode = root;
  for (const p of parts) {
    if (cur.type !== 'dir' || !cur.children || !cur.children[p]) return null;
    cur = cur.children[p];
  }
  return cur;
}
/** deep-clone via JSON (nodes are plain data) */
function clone(root: VNode): VNode {
  return JSON.parse(JSON.stringify(root));
}

const LS_KEY = 'fusion-vfs-v1';

function load(): VNode {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as VNode;
      if (parsed && parsed.type === 'dir') return parsed;
    }
  } catch { /* corrupted → reseed */ }
  return seed();
}

interface FSState {
  root: VNode;
  clip: { op: 'copy' | 'cut'; src: string } | null;
  menuSeq: number;
  menuAction: string | null;
  list: (path: string) => VNode[];
  read: (path: string) => string;
  write: (path: string, content: string) => void;
  createFile: (dir: string, name: string, content?: string) => string | null;
  mkdir: (dir: string, name: string) => string | null;
  remove: (path: string) => void;
  rename: (path: string, newName: string) => string | null;
  copy: (src: string, destDir: string) => string | null;
  move: (src: string, destDir: string) => string | null;
  setClip: (c: FSState['clip']) => void;
  /** broadcast a menu-bar action (new-folder, go-back, …) to the active file view */
  dispatchMenu: (action: string) => void;
  reset: () => void;
}

function persist(root: VNode) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(root)); } catch { /* quota → ignore */ }
}
function uniqueName(dir: VNode, base: string): string {
  if (!dir.children || !dir.children[base]) return base;
  const dot = base.lastIndexOf('.');
  const stem = dot > 0 ? base.slice(0, dot) : base;
  const ext = dot > 0 ? base.slice(dot) : '';
  let i = 2;
  while (dir.children[`${stem} ${i}${ext}`]) i++;
  return `${stem} ${i}${ext}`;
}

export const useFS = create<FSState>((set, get) => ({
  root: load(),
  clip: null,
  menuSeq: 0,
  menuAction: null,

  list: (path) => {
    const n = getNode(get().root, path);
    if (!n || n.type !== 'dir' || !n.children) return [];
    return Object.values(n.children).sort((a, b) =>
      a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1);
  },
  read: (path) => {
    const n = getNode(get().root, path);
    return n && n.type === 'file' ? (n.content ?? '') : '';
  },
  write: (path, content) => {
    const root = clone(get().root);
    const n = getNode(root, path);
    if (n && n.type === 'file') { n.content = content; n.modified = now(); set({ root }); persist(root); }
  },
  createFile: (dir, name, content = '') => {
    const clean = name.trim() || 'Untitled.txt';
    const root = clone(get().root);
    const d = getNode(root, dir);
    if (!d || d.type !== 'dir' || !d.children) return null;
    const final = uniqueName(d, clean);
    d.children[final] = F(final, content, /\.js|\.ts|\.tsx|\.html|\.css|\.json|\.md$/.test(final) ? 'code' : 'text');
    d.modified = now(); set({ root }); persist(root);
    return joinPath([...splitPath(dir), final]);
  },
  mkdir: (dir, name) => {
    const clean = name.trim() || 'New Folder';
    const root = clone(get().root);
    const d = getNode(root, dir);
    if (!d || d.type !== 'dir' || !d.children) return null;
    const final = uniqueName(d, clean);
    d.children[final] = D(final);
    d.modified = now(); set({ root }); persist(root);
    return joinPath([...splitPath(dir), final]);
  },
  remove: (path) => {
    const root = clone(get().root);
    const parent = getNode(root, dirName(path));
    if (parent && parent.type === 'dir' && parent.children) {
      delete parent.children[baseName(path)];
      set({ root }); persist(root);
    }
  },
  rename: (path, newName) => {
    const clean = newName.trim();
    if (!clean) return null;
    const root = clone(get().root);
    const parent = getNode(root, dirName(path));
    if (!parent || parent.type !== 'dir' || !parent.children) return null;
    const old = baseName(path);
    const node = parent.children[old];
    if (!node || parent.children[clean]) return null;
    delete parent.children[old];
    node.name = clean;
    parent.children[clean] = node;
    set({ root }); persist(root);
    return joinPath([...splitPath(dirName(path)), clean]);
  },
  copy: (src, destDir) => {
    const root = clone(get().root);
    const s = getNode(root, src);
    const d = getNode(root, destDir);
    if (!s || !d || d.type !== 'dir' || !d.children) return null;
    const dup: VNode = JSON.parse(JSON.stringify(s));
    const final = uniqueName(d, dup.name);
    dup.name = final;
    d.children[final] = dup;
    set({ root }); persist(root);
    return joinPath([...splitPath(destDir), final]);
  },
  move: (src, destDir) => {
    const p = get().copy(src, destDir);
    if (p) get().remove(src);
    return p;
  },
  setClip: (clip) => set({ clip }),
  dispatchMenu: (action) => set((s) => ({ menuAction: action, menuSeq: s.menuSeq + 1 })),
  reset: () => { const root = seed(); set({ root, clip: null }); persist(root); },
}));
