# FusionOS — Win11 + macOS + Ubuntu in the browser

Base: [blueedgetechno/win11React](https://github.com/blueedgetechno/win11React) (CC0-1.0, archived).
Abilities ported (re-implemented, not vendored) from:
- [aakashsharma003/macOS-Portfolio](https://github.com/aakashsharma003/macOS-Portfolio) (MIT) — Dock magnification, menubar, Spotlight, Launchpad, Control Center, Liquid Glass windows
- [kelvinleandro/ubuntu-react](https://github.com/kelvinleandro/ubuntu-react) — Activities overview, left Dock, Top Panel, App Grid, Quick Settings

## Run / use it

```sh
cd fusion-os
npm install
npm run dev    # http://localhost:3002 — boot screen → pick a DE → use it
npm run build
npm run preview # serves dist/ on :3002, vendors/ included
```

Real upstream wallpapers/icons are vendored in `public/vendors/` — see
`ATTRIBUTION.md` for the file-by-file source/license table. Pick more of them
anytime in **Settings → Wallpaper** (thumbnail grid).

## How the "use any abilities" setting works

- Boot screen picks the starting DE.
- Open **Settings (⚙)** in any DE → **Desktop Environment** → switch live between `Windows 11 / macOS / Ubuntu`.
- Wallpaper, accent, dark chrome are shared across DEs.
- Window manager, app registry (Explorer/Finder, Browser/Safari, Terminal, Notepad, Calculator, VS Code, Store) is shared, with per-DE chrome:
  - ◈ Fusion (mashup): Ubuntu Activities button + macOS menus + centered clock in one top bar; magnifying Dock with Win11 Start + 9-dot grid; unified Spotlight/Start/Activities search; merged Widgets + Control Center + Quick Settings panel; windows with macOS traffic lights + Win11 controls + Snap
  - Win11: taskbar + StartMenu + Widgets + Snap buttons
  - macOS: menubar + magnifying Dock + Spotlight + Launchpad + Control Center + traffic lights + glass
  - Ubuntu: top Panel + left Dock + Activities + 9-dot grid + sliders

This satisfies the request without merging three incompatible stacks (Redux/Vite3 vs Zustand/Vite5/UnoCSS vs Next14/MUI) file-for-file, which would not install or build together.
