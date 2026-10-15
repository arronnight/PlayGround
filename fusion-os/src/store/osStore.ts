import { create } from 'zustand';
import { DEFAULT_WP, WALLPAPER_FILES } from '../assets';

export type DE = 'win11' | 'macos' | 'ubuntu' | 'fusion';
export type AppId =
  | 'explorer' | 'settings' | 'browser' | 'terminal'
  | 'notepad' | 'calculator' | 'vscode' | 'store'
  | 'finder' | 'safari' | 'launchpad' | 'spotlight'
  | 'photos';

export interface WinState {
  id: string;
  app: AppId;
  title: string;
  /** e.g. a VFS path for notepad/photos, a URL for the browser */
  payload?: string;
  minimized?: boolean;
  maximized?: boolean;
  x: number; y: number; w: number; h: number; z: number;
}

interface Prefs { wallpaper: string; accent: string; dark: boolean }
function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem('fusion-prefs-v1');
    if (raw) {
      const p = JSON.parse(raw) as Partial<Prefs>;
      return {
        wallpaper: typeof p.wallpaper === 'string' ? p.wallpaper : DEFAULT_WP.win11,
        accent: typeof p.accent === 'string' ? p.accent : '#0078d4',
        dark: p.dark === true,
      };
    }
  } catch { /* ignore */ }
  return { wallpaper: DEFAULT_WP.win11, accent: '#0078d4', dark: false };
}
function savePrefs(p: Prefs) {
  try { localStorage.setItem('fusion-prefs-v1', JSON.stringify(p)); } catch { /* ignore */ }
}

interface OSState {
  booted: boolean;
  locked: boolean;
  powered: boolean;
  de: DE;
  wallpaper: string;
  accent: string;
  dark: boolean;
  windows: WinState[];
  zTop: number;
  activeId: string | null;
  startOpen: boolean;
  spotlightOpen: boolean;
  launchpadOpen: boolean;
  activitiesOpen: boolean;
  quickSettingsOpen: boolean;
  boot: () => void;
  lock: () => void;
  unlock: () => void;
  restart: () => void;
  powerOff: () => void;
  powerOn: () => void;
  setDE: (de: DE) => void;
  setWallpaper: (w: string) => void;
  setAccent: (a: string) => void;
  setDark: (d: boolean) => void;
  openApp: (app: AppId, title?: string, payload?: string) => void;
  closeWin: (id: string) => void;
  focusWin: (id: string) => void;
  toggleMin: (id: string) => void;
  toggleMax: (id: string) => void;
  moveWin: (id: string, x: number, y: number) => void;
  toggle: (k: 'startOpen' | 'spotlightOpen' | 'launchpadOpen' | 'activitiesOpen' | 'quickSettingsOpen') => void;
  closeAllOverlays: () => void;
}

let z = 10;
const titles: Record<AppId, string> = {
  explorer: 'File Explorer', settings: 'Settings', browser: 'Edge Browser',
  terminal: 'Terminal', notepad: 'Notepad', calculator: 'Calculator',
  vscode: 'VS Code', store: 'Store', finder: 'Finder',
  safari: 'Safari', launchpad: 'Launchpad', spotlight: 'Spotlight',
  photos: 'Photos'
};

export const WALLPAPERS = [
  ...WALLPAPER_FILES.map((w) => ({ id: w.id, name: w.name, css: w.src })),
  { id: 'midnight', name: 'Midnight (gradient fallback)', css: 'linear-gradient(135deg,#020617,#1e293b 60%,#0ea5e9)' },
];

export const useOS = create<OSState>((set, get) => {
  const prefs = loadPrefs();
  return {
  booted: false,
  locked: false,
  powered: false,
  de: 'win11',
  wallpaper: prefs.wallpaper,
  accent: prefs.accent,
  dark: prefs.dark,
  windows: [],
  zTop: 10,
  activeId: null,
  startOpen: false,
  spotlightOpen: false,
  launchpadOpen: false,
  activitiesOpen: false,
  quickSettingsOpen: false,
  boot: () => set({ booted: true, locked: false, powered: false }),
  lock: () => set({ locked: true, startOpen: false, spotlightOpen: false, launchpadOpen: false, activitiesOpen: false, quickSettingsOpen: false }),
  unlock: () => set({ locked: false }),
  restart: () => set({ booted: false, locked: false, powered: false, windows: [], activeId: null }),
  powerOff: () => set({ powered: true, locked: false, windows: [], activeId: null }),
  powerOn: () => set({ powered: false, booted: false }),
  setDE: (de) => set({ de, wallpaper: DEFAULT_WP[de], windows: [], activeId: null, startOpen: false, spotlightOpen: false, launchpadOpen: false, activitiesOpen: false, quickSettingsOpen: false }),
  setWallpaper: (wallpaper) => { set({ wallpaper }); savePrefs({ wallpaper, accent: get().accent, dark: get().dark }); },
  setAccent: (accent) => { set({ accent }); savePrefs({ wallpaper: get().wallpaper, accent, dark: get().dark }); },
  setDark: (dark) => { set({ dark }); savePrefs({ wallpaper: get().wallpaper, accent: get().accent, dark }); },
  openApp: (app, title, payload) => {
    const { windows } = get();
    const id = `${app}-${Date.now()}`;
    z += 1;
    const i = windows.length;
    set({
      windows: [...windows, {
        id, app, title: title ?? titles[app], payload,
        x: 80 + (i * 36) % 220, y: 50 + (i * 28) % 140,
        w: app === 'terminal' ? 640 : app === 'browser' || app === 'safari' ? 860 : 720,
        h: app === 'terminal' ? 400 : app === 'browser' || app === 'safari' ? 540 : 460, z,
      }],
      zTop: z, activeId: id,
      startOpen: false, spotlightOpen: false, launchpadOpen: false, activitiesOpen: false,
    });
  },
  closeWin: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id), activeId: null })),
  focusWin: (id) => { z += 1; set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)), zTop: z, activeId: id })); },
  toggleMin: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)) })),
  toggleMax: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) })),
  moveWin: (id, x, y) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)) })),
  toggle: (k) => set((s) => ({ [k]: !s[k] } as Partial<OSState>)),
  closeAllOverlays: () => set({ startOpen: false, spotlightOpen: false, launchpadOpen: false, activitiesOpen: false, quickSettingsOpen: false }),
  };
});
