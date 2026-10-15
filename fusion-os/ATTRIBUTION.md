# Attribution — vendored assets

All files under `public/vendors/` are copied verbatim from the three upstream
repos in `/tmp/opencode/upstream/`. They are **not** relicensed by FusionOS;
original licenses apply:

## 1. Windows 11 assets — `vendors/win11/`
Source: https://github.com/blueedgetechno/win11React — License: **CC0-1.0**
(mean: public domain; credit requested by the authors when reposting publicly)

| File | Upstream path |
|---|---|
| `wallpapers/win11-default.jpg` | `public/img/wallpaper/default/img0.jpg` |
| `wallpapers/win11-dark.jpg` | `public/img/wallpaper/dark/img0.jpg` |
| `wallpapers/win11-lock.jpg` | `public/img/wallpaper/lock.jpg` |
| `wallpapers/win11-themeA.jpg` | `public/img/wallpaper/ThemeA/img0.jpg` |
| `wallpapers/win11-themeB.jpg` | `public/img/wallpaper/ThemeB/img0.jpg` |
| `wallpapers/win11-themeC.jpg` | `public/img/wallpaper/ThemeC/img0.jpg` |
| `wallpapers/win11-themeD.jpg` | `public/img/wallpaper/ThemeD/img0.jpg` |
| `icons/edge|explorer|store|terminal|notepad|settings|calculator|code|photos|mail|maps.png` | `public/img/icon/<name>.png` |

## 2. macOS assets — `vendors/macos/`
Source: https://github.com/aakashsharma003/macOS-Portfolio — License: **MIT**

| File | Upstream path |
|---|---|
| `wallpapers/macOS_Tahoe_Default.jpg` | `public/wallpapers/macOS_Tahoe_Default.jpg` |
| `wallpapers/macOS_Tahoe_DefaultDark.jpg` | `public/wallpapers/macOS_Tahoe_DefaultDark.jpg` |
| `wallpapers/macOS_Tahoe_LightDefault.jpg` | `public/wallpapers/macOS_Tahoe_LightDefault.jpg` |
| `wallpapers/DefaultAerial_Tahoe_Beach.jpg` | `public/wallpapers/DefaultAerial_Tahoe_Beach.jpg` |
| `wallpapers/mobile-light.jpg` | `public/wallpapers/mobile-light.jpg` |
| `icons/finder|safari|terminal|notes|calculator|vscode|settings|app-store|launchpad|music|photos|mail|messages|siri|calendar|clock|facetime|spotify|youtube|folder|bear.png` | `public/img/icons/<name>.png` |

Skipped: `*.heic` originals (~23MB each) and the 24MB PNG to keep the repo lean;
the JPG equivalents above are the same artwork.

## 3. Ubuntu assets — `vendors/ubuntu/`
Source: https://github.com/kelvinleandro/ubuntu-react (wallpaper) +
[Yaru icon theme](https://github.com/ubuntu/yaru) (icons, **CC-BY-SA-4.0**)

| File | Upstream path / URL |
|---|---|
| `wallpapers/ubuntu-22-04.jpg` | `public/22_04.jpg` in ubuntu-react |
| `icons/settings.png` | `Yaru/256x256/apps/system-settings.png` |
| `icons/calculator.png` | `Yaru/256x256/apps/calculator-app.png` |

Note: ubuntu-react references most app-grid icons as remote Yaru URLs
(`public/data.ts`); only the two above downloaded cleanly, so the Ubuntu dock
reuses vendored Win11/macOS PNGs for the remaining slots (all local files,
no hotlinking).

## Code
FusionOS UI code is original (inspired by, not copied from, the upstreams).
Upstream code licenses (CC0-1.0 / MIT) are compatible with this approach.
