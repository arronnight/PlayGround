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
- **ROM library**: pick a local `.sfc/.smc/.zip` (file picker or drag-drop),
  paste a ROM URL, or boot the served copy. Every loaded ROM is **read for
  its header title** (LoROM/HiROM, SMC-header aware, checksum-checked) and
  **saved into an IndexedDB ROM library** — ▶ replays it, ✕ deletes it,
  all surviving reloads. Nothing is uploaded; nothing is committed.
- **AI reads the cartridge**: the header title picks a genre profile
  (platformer / exploration / top-down / racer / fighter / run-and-gun /
  RPG / unknown) shown under the stage, which gently biases the AI's prior
  (a Zelda cart gets equal 4-direction curiosity, a fighter gets button
  appetite). All real skill still comes from playing.
- Human: keyboard (P1) + any XInput pad. **XInput note**: the emulator
  only auto-assigns pads plugged in *after* boot — a pad that was already
  connected sits at "Not Connected". This page auto-claims pads on boot
  and each pad row has **Use for P1 / Use for P2** buttons; the live panel
  shows which player each pad drives, plus a rumble test.
- AI: presets for AI demo (AI=P1), co-play (Human P1 + AI P2), swap, and
  **AI + AI co-op** — one shared brain drives both brothers (SMW 2P
  alternates turns, so this is true co-op).
  The AI uses the original's framing (raw pixels only, ε-greedy 0.8→0.1,
  +1/+0.5/−1/−1.5/+2/−3 rewards) with a Torch-DQN stand-in that grows:
  - `js/perception.js` — entire-frame vision: the FULL 256×224 core
    framebuffer, never cropped. Tracks Mario vs Luigi (cap color + face +
    motion continuity), classifies enemies (goomba, rex, koopa, spiny,
    piranha, buzzy, shell, flyer, block, coin), spots keys, keyholes, goal
    gates, walls/pits, message boxes, file select, and stomp-popups;
    static scenery is demoted to decor.
  - `js/audio.js` — hearing: taps the emulator's Web Audio graph (parallel
    analyser, game sound untouched) for level/bass/mid/high + onsets.
    Coin jingle (+0.6), jump blip (+0.05), death sting (−1.0, confirms
    vision's death cause) become Q-features and rewards. Press Enable
    hearing once (browsers gate audio on a click).
  - `js/learning.js` — learns EVERY run and reuses previous knowledge
    (localStorage brain, auto-migrates old 12-action brains): linear
    Q-learner over 24 features (13 vision/progress + 5 audio + 6
    motion/vertical/memory) × 24 actions, TD-updated every step;
    auto-saves every 25 steps + on death/exit/tab-close and reloads on
    boot — no export/import needed. Deaths blame the last 10 actions and
    taboo the fatal moves; run #N starts with all weights, danger maps,
    exits, best-progress and run history intact.
  - Watch-to-learn: leave a pad on Human with *AI watches and learns
    while you play* checked and the brain trains on YOUR inputs
    (demonstration) — same rewards, deaths, danger spots, exits. Flip
    the pad to AI later and it plays what it learned from you.
  - Reads words (`js/text.js`): 8×8 OCR with confidence (`MARIO A EMPTY`,
    `PLAYER GAME` verified live at 0.8–0.95). GAME OVER counts a death,
    COURSE CLEAR credits an exit, EXIT/GOAL/KEY words steer and feed
    features. Message prose is best-effort (confidence-gated).
  - **Any SNES game, not just Mario**: the avatar is whoever *moves with
    your inputs* (input-motion **contingency** lock: moves-iff-commanded,
    shown as *via self SELF✓* — patrolling enemies score ~0 and are
    rejected), not whoever wears red. Mario's cap is only a fast prior;
    motion regions claim palette-less heroes color-blind. Menu chrome
    (cursors, message art) can never birth avatar tracks, and claims freeze
    stale instead of impersonating. Camera behavior re-classifies genre at
    runtime (header guesses, scrolling proves, votes decay so menus can't
    deadlock it), re-aiming rewards and prior; each cartridge earns its
    own learned control map in the HUD.
  - Reflexes: close threat→jump (spin vs spiny), pit edge→running jump,
    threat below while airborne→stomp steer, key/goal/shroom/coin/pipe→
    steer/enter. All tagged `[REFLEX-…]` in the HUD, all learned honestly.
    Death-sting audio only penalizes when Mario is actually gone (cannon
    bangs no longer count as deaths).
  - Boot/menu/pause/message-box handling + stuck-break maneuvers in
    `js/app.js`; full-frame overlay (player/enemy/key/danger boxes).
    The brain **commits to one action ~0.6s** (interrupted only by pits,
    close enemies, messages, climbs) so play reads as intent, and the HUD
    shows **why** (`[JUMP-PIT] [DODGE] [CLIMB] [CAREFUL]…`), best-x per level,
    and motion/vertical/taboo rows. Motion vision is camera-compensated, so
    movers are caught even mid-scroll; message boxes score reward 0 (frozen
    world is not failure).
  - The original training stack (Lua/Torch + lsnes rr2 + CUDA, ~10h on
    level 1) can't run in a browser — see `js/mario-ai.js` for the
    framing reference this ports.
