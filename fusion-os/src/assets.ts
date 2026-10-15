// Vendored asset manifest — real files from the three upstreams,
// copied into /public/vendors/. See ATTRIBUTION.md for licenses/sources.
export interface WP { id: string; name: string; src: string; de: 'win11' | 'macos' | 'ubuntu' | 'shared' }

export const WALLPAPER_FILES: WP[] = [
  { id: 'w11-default', name: 'Windows 11 Default', src: '/vendors/win11/wallpapers/win11-default.jpg', de: 'win11' },
  { id: 'w11-dark', name: 'Windows 11 Dark', src: '/vendors/win11/wallpapers/win11-dark.jpg', de: 'win11' },
  { id: 'w11-themeA', name: 'Win11 Theme A', src: '/vendors/win11/wallpapers/win11-themeA.jpg', de: 'win11' },
  { id: 'w11-themeB', name: 'Win11 Theme B', src: '/vendors/win11/wallpapers/win11-themeB.jpg', de: 'win11' },
  { id: 'w11-lock', name: 'Win11 Lock (sunset)', src: '/vendors/win11/wallpapers/win11-lock.jpg', de: 'win11' },
  { id: 'mac-default', name: 'macOS Tahoe Default', src: '/vendors/macos/wallpapers/macOS_Tahoe_Default.jpg', de: 'macos' },
  { id: 'mac-dark', name: 'macOS Tahoe Dark', src: '/vendors/macos/wallpapers/macOS_Tahoe_DefaultDark.jpg', de: 'macos' },
  { id: 'mac-light', name: 'macOS Tahoe Light', src: '/vendors/macos/wallpapers/macOS_Tahoe_LightDefault.jpg', de: 'macos' },
  { id: 'mac-beach', name: 'Tahoe Aerial Beach', src: '/vendors/macos/wallpapers/DefaultAerial_Tahoe_Beach.jpg', de: 'macos' },
  { id: 'ubu-2204', name: 'Ubuntu 22.04', src: '/vendors/ubuntu/wallpapers/ubuntu-22-04.jpg', de: 'ubuntu' },
];

/** Default wallpaper per desktop environment. */
export const DEFAULT_WP: Record<'win11' | 'macos' | 'ubuntu' | 'fusion' | 'shared', string> = {
  win11: '/vendors/win11/wallpapers/win11-default.jpg',
  macos: '/vendors/macos/wallpapers/macOS_Tahoe_Default.jpg',
  ubuntu: '/vendors/ubuntu/wallpapers/ubuntu-22-04.jpg',
  fusion: '/vendors/macos/wallpapers/DefaultAerial_Tahoe_Beach.jpg',
  shared: '/vendors/win11/wallpapers/win11-default.jpg',
};

/** Icon paths (all vendored locally). */
export const ICONS = {
  win11: {
    edge: '/vendors/win11/icons/edge.png',
    explorer: '/vendors/win11/icons/explorer.png',
    store: '/vendors/win11/icons/store.png',
    terminal: '/vendors/win11/icons/terminal.png',
    notepad: '/vendors/win11/icons/notepad.png',
    settings: '/vendors/win11/icons/settings.png',
    calculator: '/vendors/win11/icons/calculator.png',
    code: '/vendors/win11/icons/code.png',
    photos: '/vendors/win11/icons/photos.png',
    mail: '/vendors/win11/icons/mail.png',
    maps: '/vendors/win11/icons/maps.png',
  },
  macos: {
    finder: '/vendors/macos/icons/finder.png',
    safari: '/vendors/macos/icons/safari.png',
    terminal: '/vendors/macos/icons/terminal.png',
    notes: '/vendors/macos/icons/notes.png',
    calculator: '/vendors/macos/icons/calculator.png',
    vscode: '/vendors/macos/icons/vscode.png',
    settings: '/vendors/macos/icons/settings.png',
    appstore: '/vendors/macos/icons/app-store.png',
    launchpad: '/vendors/macos/icons/launchpad.png',
    music: '/vendors/macos/icons/music.png',
    photos: '/vendors/macos/icons/photos.png',
    mail: '/vendors/macos/icons/mail.png',
    messages: '/vendors/macos/icons/messages.png',
    siri: '/vendors/macos/icons/siri.png',
    calendar: '/vendors/macos/icons/calendar.png',
    clock: '/vendors/macos/icons/clock.png',
    facetime: '/vendors/macos/icons/facetime.png',
    spotify: '/vendors/macos/icons/spotify.png',
    youtube: '/vendors/macos/icons/youtube.png',
    folder: '/vendors/macos/icons/folder.png',
  },
  ubuntu: {
    settings: '/vendors/ubuntu/icons/settings.png',
    calculator: '/vendors/ubuntu/icons/calculator.png',
  },
} as const;

/** CSS background value: image URLs become cover-centered, gradients pass through. */
export function bgStyle(wallpaper: string): React.CSSProperties {
  if (wallpaper.startsWith('/')) {
    return { backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return { background: wallpaper };
}
