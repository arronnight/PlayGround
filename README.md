# PlayGround

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

## SMW Web Play

Web libretro SNES (EmulatorJS `snes` core = snes9x, loaded from CDN) with
XInput for humans and a browser port of
[aleju/mario-ai](https://github.com/aleju/mario-ai) that can drive
Player 1, Player 2, or both.

- Open `index.html` (served over http, e.g. `python3 -m http.server`).
- Choose your `Super Mario World (USA).sfc` (file picker, drag-drop, or
  `?rom=<url>`). ROMs stay local in your browser; none are committed.
- Human: keyboard (P1) + any XInput pad (pad 0 → P1, pad 1 → P2, handled
  natively by the core; verify in the XInput panel).
- AI: presets for AI demo (AI=P1), co-play (Human P1 + AI P2), and swap.
  The AI uses the original's framing (raw pixels only, ε-greedy 0.8→0.1,
  +1/+0.5/−1/−1.5/+2/−3 rewards) with a Torch-DQN stand-in that grows:
  - `js/perception.js` — full-frame vision: tracks Mario vs Luigi (cap
    color + face + motion continuity), classifies enemies (goomba, rex,
    koopa, spiny, piranha, buzzy, shell, flyer, block, coin), spots keys,
    keyholes, goal gates, walls/pits, message boxes, file select, and
    stomp-popups; static scenery is demoted to decor.
  - `js/learning.js` — persistent learner (localStorage): linear Q-learner
    over 13 features × 12 actions (arrow × run × jump), TD-updated from
    shaped rewards; per-level danger maps from death locations + causes;
    normal vs secret exit records (key→keyhole credit); pipe round-trips
    never count as exits; repeat-death counter shows it's learning.
  - Boot/menu/pause/message-box handling + stuck-break maneuvers in
    `js/app.js`; full-frame overlay (player/enemy/key/danger boxes).
  - The original training stack (Lua/Torch + lsnes rr2 + CUDA, ~10h on
    level 1) can't run in a browser — see `js/mario-ai.js` for the
    framing reference this ports.
