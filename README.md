# Fable City

A GTA-style open world in the browser, built with **Three.js** + **Vite**. Everything is procedural — the
city, the cars, the people, the textures, the music and the sound effects are generated in code. There are
no art or audio asset files in this repo.

## Run it

```bash
cd gta_fable5.1
npm install
npm run dev        # http://localhost:5175
```

## Build a static bundle

```bash
npm run build       # outputs to dist/
npm run preview     # serve the built bundle locally
```

`dist/` is a plain static site — drop it on any static host. The repo root `start.sh` builds the game and
serves it, landing straight into Fable City.

## Requirements

Node 18+ and a browser with WebGL2. The game's own README has the full controls, and
`gta_fable5.1/DESIGN.md` has the implementation notes.
