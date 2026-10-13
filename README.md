# ATTITUDE EMPIRE — 3D Pro Wrestling Sandbox

A 3D desktop pro-wrestling game mixing three classics:

- **WWF No Mercy** — Attitude meter: deal damage + taunt to fill it. At 100% it
  flashes and **FINISHER (I)** unlocks. Taking damage drains it.
- **WWE Here Comes The Pain** — a real move catalog (~30 moves: strikes, front/back
  grapples, ground, dives, submissions, 12 signature finishers) with a 6-wrestler
  roster (STR/SPD/TGH/CHA stats) and 3 arenas.
- **Wrestling Empire (Dickie) physics & freedom** — free-roam arena, bouncy ropes +
  Irish whips, climbable turnbuckles + dives, chairs + breakable tables, ref with
  3-counts, rope breaks, pin break-ups, no-DQ hardcore rules.

## Play locally (no build step)

```bash
python3 -m http.server 3002
# open http://localhost:3002/
```

## Controls (HCTP × DoR hybrid)

**Xbox pad (primary):** left stick move · **A** grapple (tap light, hold
heavy tie-up, then **A**+stick to throw: **↑** power, **↓** sub/pin,
**←** signature, **→** quick) · **X** strike (tap light, hold heavy) ·
**B** hold to run · **Y** weapons / climb / ring traverse · **A**+**B**
Irish whip · stick-down + **A** pin · right-stick flick = target,
hold = rest hold · **LT** grapple reversal · **RT** strike reversal ·
**LT**+**RT** finisher reversal · **LB** taunt / build meter ·
**LB**+**RB** SPECIAL hype, then finisher · **Back** momentum shift
(once, in Danger) · **Start** pause.

**Keyboard:** **WASD** move · **J** strike (tap/hold) · **K** grapple
(tap light / hold tie-up, 2nd press throws) · **I** special / finisher ·
**U** taunt · **G** momentum shift · **O** weapon/traverse · **F** pin ·
**E** grapple reversal / **R** strike reversal (**T** = finisher) ·
mouse-drag camera · **H** moves · **P** pause.

**Touch:** tap the screen once and on-screen controls appear (left stick
+ HIT/GRP/RUN/FIN/TNT/WPN/PIN/REV — HIT/GRP support tap-hold, TNT hold
= momentum shift). Drag the screen to orbit the camera.

## Files

- `index.html` — menus, HUD, overlays
- `css/style.css` — all UI styling
- `js/data.js` — roster, move catalog, tuning
- `js/audio.js` — synthesized hits / bell / crowd (no assets)
- `js/game.js` — engine: zoned arena, physics, AI, ref/pins, animation
- `js/rig.js` — sculpted full-body wrestler rig: lathe-turned tapered limbs, muscle masses (delts, bicep peaks, traps, lats, pecs), real faces, rounded gear, all hung on a spine-chained skeleton
- `vendor/three.module.js` — Three.js r160 (local, works offline)

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Created using [OMGithub.com](https://omgithub.com).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://omgithub.com/arronnight/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/arronnight/PlayGround)

- 🎮 [Open the project](https://omgithub.com/arronnight/PlayGround).
- ✨ [Remix this project](https://omgithub.com/?remix=arronnight%2FPlayGround).
- 💻 [Explore the source](https://github.com/arronnight/PlayGround).
- 🛠️ [Check build runs](https://github.com/arronnight/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/arronnight/PlayGround/issues).
- 👤 [Explore the creator's projects](https://omgithub.com/arronnight).
- 🌍 [Create with OMGithub](https://omgithub.com).
<!-- omgithub:readme:end -->
