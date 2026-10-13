// Central tuning constants for the whole game.
// World: one global 80m arterial grid (kept uniform so traffic / AI / missions all
// keep working) laid over three cities + countryside, SA-beats style.
export const CITY = {
  BLOCKS: 26,             // grid cells per side (road lines 0..26)
  BLOCK: 60,              // building block size (m)
  ROAD: 20,               // total road corridor width incl. sidewalks (m)
  ASPHALT: 14,            // driveable asphalt width (m) -> 4 lanes of 3.5
  SIDEWALK: 3,            // sidewalk width each side (m)
  LANE: 3.5,
  CURB: 0.15,
  GRID_X0: -1040,         // world x of road line 0
  GRID_Z0: -1040,         // world z of road line 0
  ISLAND_MARGIN: 70,      // (legacy) land beyond outer roads before beach
  BEACH: 30,
  WORLD_R: 1200,          // entity clamp radius
};
CITY.PITCH = CITY.BLOCK + CITY.ROAD;                 // 80m from road centre to road centre
CITY.HALF = (CITY.BLOCKS * CITY.PITCH) / 2;          // half-extent of road grid (1040)
CITY.LAND = CITY.HALF + CITY.ISLAND_MARGIN;          // 1110
CITY.WATER = CITY.LAND + CITY.BEACH;                 // 1140

export const PLAYER = {
  WALK: 3.2, RUN: 7.5, SPRINT: 10.5, ACCEL: 30, JUMP: 6.5, GRAVITY: 22,
  RADIUS: 0.4, HEIGHT: 1.8, MAX_HEALTH: 100, MAX_ARMOR: 100, SWIM: 2.5,
};

export const WANTED = {
  MAX: 5,
  DECAY_TIME: [0, 25, 40, 60, 90, 120], // seconds without crime & out of sight to drop a star
  COPS_PER_LEVEL: [0, 1, 2, 4, 6, 8],
  COP_SIGHT: 70,
};

export const DAY = { LENGTH: 480, START: 0.36 }; // seconds per full cycle, start fraction (morning)

export const KEYS = {
  forward: ['KeyW', 'ArrowUp'], back: ['KeyS', 'ArrowDown'], left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'],
  sprint: ['ShiftLeft', 'ShiftRight'], jump: ['Space'], handbrake: ['Space'], enter: ['KeyF'], interact: ['KeyE'], ao: ['KeyO'],
  horn: ['KeyH'], camera: ['KeyC'], map: ['KeyM'], pause: ['Escape', 'KeyP'], radio: ['KeyR'], skiptime: ['KeyT'],
  nextWeapon: ['KeyQ'], help: ['F1'],
};
