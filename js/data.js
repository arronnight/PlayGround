// Roster + Moves catalog.
// Mix: HCTP-style catalog, No Mercy-style stats/attitude.
export const ROSTER = [
  {
    id: 'fury', name: 'JAXON FURY', nick: '"The Powerhouse"', align: 'FACE',
    str: 9, spd: 5, tgh: 9, cha: 7, weight: 132,
    // AKI stats
    attack: 85, defense: 80, speed: 45, spirit: 70,
    skin: 0xd9a066, hair: 0x201510, attire: 0xc02020, trim: 0xffd23f, boots: 0x111111,
    finisher: 'FURY BOMB', finisher2: 'FURY LARIAT',
    height: 1.03, bulk: 1.12, legs: 'tights', torso: 'bare', bootsH: 'tall',
    kneePads: true, wrist: true, hairStyle: 'long',
    desc: 'Powerhouse. Powerbombs & slams. Slow but unstoppable.'
  },
  {
    id: 'veneno', name: 'EL VENENO', nick: '"The Luchador"', align: 'FACE',
    str: 5, spd: 10, tgh: 5, cha: 9, weight: 84,
    attack: 60, defense: 50, speed: 95, spirit: 90,
    skin: 0xc68642, hair: 0x0a0a0a, attire: 0x0fae5d, trim: 0xf7ff00, boots: 0x0a5c36,
    finisher: 'VENOM RANA', finisher2: '450 VENOM SPLASH',
    height: 0.96, bulk: 0.88, legs: 'tights', torso: 'bare', bootsH: 'short',
    kneePads: false, wrist: true, hairStyle: 'mask',
    desc: 'Lucha libre. Fastest in the game. Flies off the top rope.'
  },
  {
    id: 'bruno', name: 'BIG BRUNO', nick: '"The Mountain"', align: 'HEEL',
    str: 10, spd: 3, tgh: 10, cha: 5, weight: 178,
    attack: 95, defense: 95, speed: 25, spirit: 50,
    skin: 0xe8b98a, hair: 0x6b4a2f, attire: 0x2456e0, trim: 0xffffff, boots: 0x101030,
    finisher: 'BRUNO QUAKE', finisher2: 'MOUNTAIN PILEDRIVER',
    height: 1.06, bulk: 1.3, legs: 'tights', torso: 'singlet', bootsH: 'tall',
    kneePads: true, wrist: false, hairStyle: 'short',
    desc: 'Super-heavyweight. Absorbs damage, ends careers.'
  },
  {
    id: 'icon', name: 'THE ICON KID', nick: '"Mr. Showtime"', align: 'FACE',
    str: 6, spd: 8, tgh: 6, cha: 10, weight: 96,
    attack: 70, defense: 55, speed: 80, spirit: 95,
    skin: 0xd9a066, hair: 0xd9c07a, attire: 0xf5f0e6, trim: 0xd4af37, boots: 0x7a1010,
    finisher: 'SHOWTIME SUPERKICK', finisher2: 'ICON ELBOW DROP',
    height: 1.0, bulk: 1.0, legs: 'trunks', torso: 'bare', bootsH: 'tall',
    kneePads: true, wrist: true, hairStyle: 'short',
    desc: 'Showman. Crowd favorite. Sweet superkick out of nowhere.'
  },
  {
    id: 'vex', name: 'VEX', nick: '"The Nightmare"', align: 'HEEL',
    str: 7, spd: 7, tgh: 6, cha: 6, weight: 98,
    attack: 75, defense: 65, speed: 70, spirit: 60,
    skin: 0xc9a186, hair: 0x2a0a3a, attire: 0x1a1a22, trim: 0x9d4edd, boots: 0x000000,
    finisher: 'NIGHTMARE NECKBRK', finisher2: 'VEX SUBMISSION',
    height: 1.0, bulk: 0.95, legs: 'tights', torso: 'bare', bootsH: 'tall',
    kneePads: false, wrist: false, elbowPad: true, hairStyle: 'long',
    desc: 'Technical heel. Neckbreakers & submissions. Booed everywhere.'
  },
  {
    id: 'thunder', name: 'MAMA THUNDER', nick: '"The Brawler"', align: 'HEEL',
    str: 8, spd: 6, tgh: 8, cha: 7, weight: 118,
    attack: 80, defense: 75, speed: 55, spirit: 70,
    skin: 0x8d5524, hair: 0x111111, attire: 0xffb703, trim: 0x111111, boots: 0x5c2e00,
    finisher: 'THUNDER DDT', finisher2: 'THUNDER POWERBOMB',
    height: 1.01, bulk: 1.08, legs: 'trunks', torso: 'bare', bootsH: 'short',
    kneePads: true, wrist: true, hairStyle: 'short',
    desc: 'Hardcore brawler. Chair-swinging menace. Loves a fight.'
  },
];

// HCTP-inspired move catalog with AKI physics properties.
// baseDamage is base, scaled by AKI damage formula (condition, attack/def, spirit)
// Power grades + feature tags follow the VirtualProGrappler move schema
// (GPL-3.0 chaotix610/VirtualProGrappler): S/A/B/C/D/E/F/G by damage,
// feature 'pin'/'submit'/null, ko/bleed flags for match-enders.
export function powerGrade(d) {
  const v = d ?? 0;
  return v >= 28 ? 'S' : v >= 22 ? 'A' : v >= 17 ? 'B' : v >= 13 ? 'C' : v >= 10 ? 'D' : v >= 7 ? 'E' : v >= 5 ? 'F' : 'G';
}
export function moveFeature(m) {
  if (!m) return null;
  if (m.drain) return 'submit';
  if ((m.flags & 0x80) === 0x80) return 'pin';
  return null;
}
export function moveKO(m) { return (m.baseDamage ?? m.dmg ?? 0) >= 24; } // can end matches
export function moveBleed(m) {
  // busts open: drivers and top-rope big splashes
  return (m.baseDamage ?? 0) >= 28 && ['piledriver', 'powerbomb', 'splash'].includes(m.anim);
}
export const MOVES = {
  strikes: [
    { name: 'JAB', baseDamage: 5, kb: 0.6, anim: 'punch', sfx: 'chop', flags: 0 },
    { name: 'KITCHEN SINK KICK', baseDamage: 6, kb: 0.7, anim: 'kick', sfx: 'kick', flags: 0 },
    { name: 'CHOP', baseDamage: 6, kb: 0.5, anim: 'chop', sfx: 'chop', flags: 0 },
    { name: 'ELBOW SMASH', baseDamage: 7, kb: 0.8, anim: 'elbow', sfx: 'hit', flags: 0 },
    { name: 'CLOTHESLINE', baseDamage: 9, kb: 2.5, anim: 'clothesline', sfx: 'hit', run: true, flags: 0x02 }, // RUNNING_GRAPPLE
    { name: 'DROPKICK', baseDamage: 9, kb: 2.2, anim: 'dropkick', sfx: 'kick', run: true, flags: 0x02 }, // RUNNING_GRAPPLE
    { name: 'SUPERKICK', baseDamage: 11, kb: 1.2, anim: 'superkick', sfx: 'kick', flags: 0 },
    { name: 'UPPERCUT', baseDamage: 7, kb: 0.8, anim: 'uppercut', sfx: 'hit', flags: 0 },
    { name: 'HEADBUTT', baseDamage: 7, kb: 0.9, anim: 'headbutt', sfx: 'hit', flags: 0 },
    { name: 'KNEE LIFT', baseDamage: 8, kb: 0.9, anim: 'knee', sfx: 'kick', flags: 0 },
    { name: 'BIG BOOT', baseDamage: 10, kb: 1.4, anim: 'bigboot', sfx: 'kick', flags: 0 },
    { name: 'DOUBLE AXE HANDLE', baseDamage: 9, kb: 1.0, anim: 'axehandle', sfx: 'hit', flags: 0 },
    { name: 'ENZUIGIRI', baseDamage: 10, kb: 1.1, anim: 'enzuigiri', sfx: 'kick', flags: 0 },
    { name: 'DISCUS LARIAT', baseDamage: 11, kb: 1.5, anim: 'discus', sfx: 'hit', flags: 0 },
    { name: 'SPEAR', baseDamage: 12, kb: 2.4, anim: 'spear', sfx: 'hit', run: true, flags: 0x02 },
    { name: 'FLYING FOREARM', baseDamage: 9, kb: 1.8, anim: 'flyingforearm', sfx: 'hit', run: true, flags: 0x02 },
  ],
  front: [
    { name: 'VERTICAL SUPLEX', baseDamage: 12, anim: 'suplex', desc: 'Classic suplex', flags: 0x1000, connectionFrames: 18, totalFrames: 40, flight: { up: 3.6, out: 2.4, dir: 'over' } }, // WORKS_ON_GIANT
    { name: 'BODYSLAM', baseDamage: 11, anim: 'slam', flags: 0x1000, connectionFrames: 16, totalFrames: 38 }, // WORKS_ON_GIANT
    { name: 'DDT', baseDamage: 13, anim: 'ddt', flags: 0, connectionFrames: 14, totalFrames: 35 },
    { name: 'NECK BREAKER', baseDamage: 12, anim: 'neckbreaker', flags: 0, connectionFrames: 15, totalFrames: 36 },
    { name: 'POWER BOMB', baseDamage: 16, anim: 'powerbomb', flags: 0x1004, connectionFrames: 22, totalFrames: 48 }, // WORKS_ON_GIANT | HIGH_FLYING
    { name: 'PILE DRIVER', baseDamage: 17, anim: 'piledriver', flags: 0x1000, connectionFrames: 20, totalFrames: 44 }, // WORKS_ON_GIANT
    { name: 'BACK BREAKER', baseDamage: 13, anim: 'backbreaker', flags: 0, connectionFrames: 16, totalFrames: 38 },
    { name: 'SAMOAN DROP', baseDamage: 13, anim: 'slam', flags: 0, connectionFrames: 18, totalFrames: 40 },
    { name: 'SPINE BUSTER', baseDamage: 15, anim: 'spinebuster', flags: 0x1000, connectionFrames: 16, totalFrames: 40 }, // WORKS_ON_GIANT
    { name: 'HURRICANRANA', baseDamage: 14, anim: 'hurricanrana', flags: 0x80, connectionFrames: 14, totalFrames: 35 }, // PINNING_HOLD
    { name: 'CHOKESLAM', baseDamage: 15, anim: 'chokeslam', flags: 0x1000, connectionFrames: 22, totalFrames: 48 },
    { name: 'SIDEWALK SLAM', baseDamage: 13, anim: 'sidewalk', flags: 0x1000, connectionFrames: 18, totalFrames: 40 },
    { name: 'FALLAWAY SLAM', baseDamage: 14, anim: 'fallaway', flags: 0x1000, connectionFrames: 18, totalFrames: 42, flight: { up: 2.4, out: 4.4, dir: 'fwd' } },
    { name: 'BRAINBUSTER', baseDamage: 16, anim: 'brainbuster', flags: 0, connectionFrames: 20, totalFrames: 46 },
    { name: 'FISHERMAN SUPLEX', baseDamage: 14, anim: 'fisherman', flags: 0x1000, connectionFrames: 18, totalFrames: 42, flight: { up: 3.2, out: 2.4, dir: 'over' } },
    { name: 'POWERSLAM', baseDamage: 14, anim: 'powerslam', flags: 0x1000, connectionFrames: 18, totalFrames: 42 },
    { name: 'STO', baseDamage: 11, anim: 'sto', flags: 0, connectionFrames: 12, totalFrames: 30 },
    { name: 'RUSSIAN LEGSWEEP', baseDamage: 11, anim: 'russian', flags: 0, connectionFrames: 12, totalFrames: 30 },
    { name: 'FACEBUSTER', baseDamage: 12, anim: 'facebuster', flags: 0, connectionFrames: 14, totalFrames: 34 },
    { name: 'TKO', baseDamage: 15, anim: 'tko', flags: 0, connectionFrames: 18, totalFrames: 44 },
    { name: 'STUNNER', baseDamage: 13, anim: 'stunner', noLift: true, flags: 0, connectionFrames: 12, totalFrames: 30 },
    { name: 'SNAPMARE', baseDamage: 8, anim: 'snapmare', noLift: true, flags: 0, connectionFrames: 10, totalFrames: 26 },
    { name: 'TORTURE RACK DROP', baseDamage: 14, anim: 'rack', flags: 0x1000, connectionFrames: 20, totalFrames: 46 },
    { name: 'TIGER DRIVER', baseDamage: 16, anim: 'tigerdriver', flags: 0, connectionFrames: 20, totalFrames: 46 },
  ],
  back: [
    { name: 'GERMAN SUPLEX', baseDamage: 14, anim: 'german', flags: 0x1000, connectionFrames: 18, totalFrames: 40, flight: { up: 3.4, out: 2.2, dir: 'over' } }, // WORKS_ON_GIANT
    { name: 'BACK SUPLEX', baseDamage: 13, anim: 'suplex', flags: 0x1000, connectionFrames: 18, totalFrames: 40, flight: { up: 3.2, out: 2.2, dir: 'over' } }, // WORKS_ON_GIANT
    { name: 'SLEEPER DROP', baseDamage: 11, anim: 'ddt', flags: 0, connectionFrames: 14, totalFrames: 35 },
    { name: 'ATOMIC DROP', baseDamage: 10, anim: 'slam', flags: 0, connectionFrames: 12, totalFrames: 30 },
    { name: 'BACKDROP', baseDamage: 12, anim: 'backdrop', flags: 0x1000, connectionFrames: 18, totalFrames: 42, flight: { up: 3.0, out: 2.6, dir: 'over' } },
    { name: 'FULL NELSON SLAM', baseDamage: 14, anim: 'fullnelson', flags: 0, connectionFrames: 18, totalFrames: 42 },
    { name: 'REVERSE DDT', baseDamage: 12, anim: 'reverseddt', flags: 0, connectionFrames: 14, totalFrames: 34 },
    { name: 'SCHOOL BOY', baseDamage: 6, anim: 'schoolboy', noLift: true, flags: 0x80, connectionFrames: 10, totalFrames: 26 },
    { name: 'TIGER SUPLEX', baseDamage: 15, anim: 'tigersuplex', flags: 0x1080, connectionFrames: 20, totalFrames: 46 },
  ],
  ground: [
    { name: 'STOMP', baseDamage: 5, anim: 'stomp', flags: 0x01, connectionFrames: 8, totalFrames: 20 }, // GROUND_ONLY
    { name: 'ELBOW DROP', baseDamage: 8, anim: 'elbowdrop', flags: 0x01, connectionFrames: 12, totalFrames: 28 }, // GROUND_ONLY
    { name: 'KNEE DROP', baseDamage: 7, anim: 'elbowdrop', flags: 0x01, connectionFrames: 10, totalFrames: 24 }, // GROUND_ONLY
    { name: 'FROG SPLASH', baseDamage: 14, anim: 'splash', dive: true, flags: 0x0C, connectionFrames: 22, totalFrames: 45 }, // SPLASH_TYPE | HIGH_FLYING
    { name: 'LEG DROP', baseDamage: 9, anim: 'legdrop', flags: 0x01, connectionFrames: 14, totalFrames: 32 },
    { name: 'SENTON SPLASH', baseDamage: 12, anim: 'senton', flags: 0x01, connectionFrames: 18, totalFrames: 40 },
    { name: 'SOCCER KICK', baseDamage: 8, anim: 'soccerkick', flags: 0x01, connectionFrames: 10, totalFrames: 26 },
    { name: 'HEADBUTT DROP', baseDamage: 7, anim: 'headdrop', flags: 0x01, connectionFrames: 12, totalFrames: 28 },
  ],
  dive: [
    { name: 'CROSSBODY', baseDamage: 13, anim: 'splash', flags: 0x0C, connectionFrames: 18, totalFrames: 40 }, // SPLASH_TYPE | HIGH_FLYING
    { name: 'MISSILE DROPKICK', baseDamage: 14, anim: 'dropkick', flags: 0x06, connectionFrames: 16, totalFrames: 38 }, // HIGH_FLYING | RUNNING_GRAPPLE
    { name: '450 VENOM SPLASH', baseDamage: 18, anim: 'splash', flags: 0x0C, connectionFrames: 24, totalFrames: 50 }, // SPLASH_TYPE | HIGH_FLYING
    { name: 'DIVING ELBOW', baseDamage: 15, anim: 'elbowdrop', flags: 0x04, connectionFrames: 18, totalFrames: 42 }, // HIGH_FLYING
    { name: 'MOONSAULT', baseDamage: 15, anim: 'moonsault', flags: 0x0C, connectionFrames: 20, totalFrames: 44 },
    { name: 'SHOOTING STAR PRESS', baseDamage: 17, anim: 'moonsault', flags: 0x0C, connectionFrames: 24, totalFrames: 50 },
    { name: 'SWANTON BOMB', baseDamage: 16, anim: 'moonsault', flags: 0x0C, connectionFrames: 22, totalFrames: 48 },
    { name: 'DIVING HEADBUTT', baseDamage: 14, anim: 'elbowdrop', flags: 0x04, connectionFrames: 18, totalFrames: 42 },
  ],
  submit: [
    { name: 'SHARPSHOOTER', baseDamage: 3, anim: 'submit', drain: true, sub: 'sit', flags: 0xC0, connectionFrames: 30, totalFrames: 60 }, // PINNING_HOLD | ROPE_BREAK_IGNORE
    { name: 'FIGURE-FOUR', baseDamage: 3, anim: 'submit', drain: true, sub: 'sit', flags: 0xC0, connectionFrames: 30, totalFrames: 60 }, // PINNING_HOLD | ROPE_BREAK_IGNORE
    { name: 'VEX SUBMISSION', baseDamage: 4, anim: 'submit', drain: true, sub: 'sit', flags: 0xC0, connectionFrames: 30, totalFrames: 60 }, // PINNING_HOLD | ROPE_BREAK_IGNORE
    { name: 'BEAR HUG', baseDamage: 2, anim: 'submit', drain: true, sub: 'front', flags: 0x80, connectionFrames: 25, totalFrames: 50 }, // PINNING_HOLD
    { name: 'CAMEL CLUTCH', baseDamage: 3, anim: 'submit', drain: true, sub: 'back', flags: 0xC0, connectionFrames: 30, totalFrames: 60 },
    { name: 'BOSTON CRAB', baseDamage: 3, anim: 'submit', drain: true, sub: 'sit', flags: 0xC0, connectionFrames: 30, totalFrames: 60 },
    { name: 'ANKLE LOCK', baseDamage: 3, anim: 'submit', drain: true, sub: 'stand', flags: 0xC0, connectionFrames: 30, totalFrames: 60 },
    { name: 'CROSSFACE', baseDamage: 4, anim: 'submit', drain: true, sub: 'front', flags: 0xC0, connectionFrames: 30, totalFrames: 60 },
    { name: 'STF', baseDamage: 4, anim: 'submit', drain: true, sub: 'back', flags: 0xC0, connectionFrames: 30, totalFrames: 60 },
    { name: 'TEXAS CLOVERLEAF', baseDamage: 3, anim: 'submit', drain: true, sub: 'sit', flags: 0xC0, connectionFrames: 30, totalFrames: 60 },
  ],
  finishers: {
    'FURY BOMB': { baseDamage: 30, anim: 'powerbomb', flags: 0x1004, connectionFrames: 24, totalFrames: 52 },
    'FURY LARIAT': { baseDamage: 26, anim: 'clothesline', flags: 0x02, connectionFrames: 16, totalFrames: 38 },
    'VENOM RANA': { baseDamage: 26, anim: 'hurricanrana', flags: 0x80, connectionFrames: 16, totalFrames: 40 },
    '450 VENOM SPLASH': { baseDamage: 30, anim: 'splash', flags: 0x0C, connectionFrames: 26, totalFrames: 55 },
    'BRUNO QUAKE': { baseDamage: 33, anim: 'spinebuster', flags: 0x1000, connectionFrames: 20, totalFrames: 46 },
    'MOUNTAIN PILEDRIVER': { baseDamage: 32, anim: 'piledriver', flags: 0x1000, connectionFrames: 22, totalFrames: 48 },
    'SHOWTIME SUPERKICK': { baseDamage: 28, anim: 'superkick', flags: 0, connectionFrames: 14, totalFrames: 34 },
    'ICON ELBOW DROP': { baseDamage: 29, anim: 'elbowdrop', flags: 0, connectionFrames: 18, totalFrames: 42 },
    'NIGHTMARE NECKBRK': { baseDamage: 28, anim: 'neckbreaker', flags: 0, connectionFrames: 16, totalFrames: 38 },
    'VEX SUBMISSION': { baseDamage: 24, anim: 'submit', drain: true, flags: 0xC0, connectionFrames: 32, totalFrames: 65 },
    'THUNDER DDT': { baseDamage: 28, anim: 'ddt', flags: 0, connectionFrames: 16, totalFrames: 38 },
    'THUNDER POWERBOMB': { baseDamage: 30, anim: 'powerbomb', flags: 0x1004, connectionFrames: 24, totalFrames: 52 },
    'STONE COLD STUNNER': { baseDamage: 26, anim: 'stunner', noLift: true, flags: 0, connectionFrames: 14, totalFrames: 34 },
    'TOMBSTONE PILEDRIVER': { baseDamage: 30, anim: 'tombstone', flags: 0x1000, connectionFrames: 22, totalFrames: 48 },
    'PEDIGREE': { baseDamage: 28, anim: 'facebuster', flags: 0, connectionFrames: 18, totalFrames: 42 },
    'ROCK BOTTOM': { baseDamage: 28, anim: 'sidewalk', flags: 0x1000, connectionFrames: 20, totalFrames: 46 },
    'JACKHAMMER': { baseDamage: 29, anim: 'rack', flags: 0x1000, connectionFrames: 22, totalFrames: 50 },
    'SWEET CHIN MUSIC': { baseDamage: 27, anim: 'superkick', flags: 0, connectionFrames: 14, totalFrames: 34 },
  }
};

// Hardcore arsenal: every pickupable object swings and hurts.
// dmg = swing damage, life = solid hits before it breaks (Infinity = unbreakable),
// heavy = slow two-handed swing, range = swing reach, throwDmg overrides thrown damage.
export const WEAPONS = {
  chair: { label: 'STEEL CHAIR', dmg: 13, kb: 1.8, down: true, downTime: 2.8, life: 3, breakMsg: 'The steel chair folds in half!', breakColor: 0x8888a0 },
  kendo: { label: 'KENDO STICK', dmg: 9, kb: 1.2, down: false, downTime: 1.6, life: 5, breakMsg: 'The kendo stick snaps!' },
  sign: { label: 'STOP SIGN', dmg: 11, kb: 1.6, down: true, downTime: 2.2, life: 4, breakMsg: 'The stop sign folds!' },
  can: { label: 'TRASH CAN', dmg: 12, kb: 1.7, down: true, downTime: 2.4, life: 5, clang: true, breakMsg: 'The trash can crumples!' },
  lid: { label: 'TRASH LID', dmg: 8, kb: 1.2, down: false, downTime: 1.6, life: 4, throwDmg: 13, breakMsg: 'The lid sails apart!' },
  pipe: { label: 'LEAD PIPE', dmg: 13, kb: 1.7, down: true, downTime: 2.4, life: Infinity },
  bat: { label: 'BASEBALL BAT', dmg: 14, kb: 1.9, down: true, downTime: 2.8, life: 5, breakMsg: 'The bat shatters!' },
  barbed: { label: 'BARBED-WIRE BAT', dmg: 15, kb: 1.9, down: true, downTime: 3.0, life: Infinity, bleed: true },
  sledge: { label: 'SLEDGEHAMMER', dmg: 20, kb: 2.4, down: true, downTime: 3.4, life: Infinity, heavy: true },
  extinguisher: { label: 'FIRE EXTINGUISHER', dmg: 10, kb: 1.5, down: true, downTime: 2.2, life: 3, foam: true, breakMsg: 'The extinguisher bursts empty!' },
  chain: { label: 'STEEL CHAIN', dmg: 12, kb: 1.6, down: true, downTime: 2.2, life: Infinity, range: 2.8 },
  knuckles: { label: 'BRASS KNUCKLES', dmg: 9, kb: 0.8, down: false, downTime: 1.2, life: Infinity, fast: true, punchBuff: 3 },
  mic: { label: 'MICROPHONE', dmg: 7, kb: 1.0, down: false, downTime: 1.4, life: 4, screech: true, breakMsg: 'The mic dies in feedback!' },
  bell: { label: 'RING BELL', dmg: 13, kb: 1.6, down: true, downTime: 2.4, life: 4, ding: true, breakMsg: 'The bell cracks!' },
  block: { label: 'CINDER BLOCK', dmg: 18, kb: 2.2, down: true, downTime: 3.2, life: 2, heavy: true, breakMsg: 'The block explodes into rubble!', breakColor: 0x999999 },
  tacks: { label: 'THUMBTACKS', dmg: 0, kb: 0, down: false, downTime: 0, life: 1, scatter: true },
  belt: { label: 'TITLE BELT', dmg: 12, kb: 1.6, down: true, downTime: 2.2, life: Infinity, gold: true },
};

export const ARENAS = [
  { id: 'attitude', name: 'ATTITUDE DOME', theme: 'Red / Titantron', crowd: 420, mat: { stiff: 0.75, bounce: 0.55, dmg: 1.0 } },
  { id: 'pain', name: 'PAIN PALACE', theme: 'Blue / Gold', crowd: 380, mat: { stiff: 0.55, bounce: 0.7, dmg: 0.9 } },
  { id: 'empire', name: 'EMPIRE BACKYARD', theme: 'Gritty / Hardcore', crowd: 260, mat: { stiff: 0.9, bounce: 0.4, dmg: 1.15 } },
  { id: 'wm2000', name: 'WRESTLEMANIA 2000', theme: 'Anaheim Dome / Trifold Tron', crowd: 420, mat: { stiff: 0.7, bounce: 0.6, dmg: 1.0 }, glb: 'assets/wm2000.glb', shell: { scale: 1, y: 0 } },
];

export const TUNING = {
  hp: 120,
  stamina: 100,
  attitudeGainStrike: 8,
  attitudeGainGrapple: 13,
  attitudeGainTaunt: 12,
  attitudeLossHurt: 6,
  finisherThreshold: 100,
  pinKickoutBase: 0.55,
  // deliberate heavyweight pace: everything costs more, recovers slower
  gasMax: 100,
  gasStrike: 4, gasHeavyStrike: 8, gasGrapple: 6, gasHeavyGrapple: 10,
  gasWhip: 5, gasRun: 7, gasDive: 12, gasFinisher: 18, gasKickout: 15,
  gasClimb: 6, gasWeaponSwing: 7, gasReversal: 9,
  gasIdleDrain: 4.5, gasRestDrain: 9,
  gasWindedAt: 65, gasGassedAt: 85,
  walkPace: 0.86, runPace: 1.6,
  attackDurMult: 1.3, getupDur: 1.15,
  pinStep1: 1.2, pinStep2: 1.5,
  botchBase: 0.03, botchGasMult: 0.22,
};
