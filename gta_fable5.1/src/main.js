import * as THREE from 'three';
import { Game } from './game.js';
import { Menu } from './menu.js';

const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;

const game = new Game(renderer, canvas); window.game = game;
const menu = new Menu(game); game.menu = menu;
game.input.onLockChange = (locked) => menu.onLockChange(locked);
// Debug harness (?debug): step the simulation deterministically from the console, e.g. step(60, ['KeyW']).
window.step = (n, keys = [], mouse = {}) => { game.input.pollGamepad(); for (let i = 0; i < n; i++) { for (const k of keys) { game.input.keys.add(k); if (i === 0) game.input.pressed.add(k); } Object.assign(game.input.mouse, mouse); game.update(1 / 60); } game.input.keys.clear(); game.render(); };
game.resize();

const DEBUG = location.search.includes('debug');
if (DEBUG) { menu.started = true; menu.hide(); game.paused = false; game.input.locked = true; }

function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  game.input.pollGamepad(); // exactly once per frame: menu nav + game share the edges
  if (game.menu.visible) game.menu.update();
  if (!game.paused) game.update(dt);
  else { game.env.update(game.dayFrac, new THREE.Vector3(game.player.x, 0, game.player.z)); game.input.endFrame(); }
  game.render();
}
let last = performance.now();
requestAnimationFrame(loop);
