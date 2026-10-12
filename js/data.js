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
export const MOVES = {
  strikes: [
    { name: 'JAB', baseDamage: 5, kb: 2.2, anim: 'punch', sfx: 'chop', flags: 0 },
    { name: 'KITCHEN SINK KICK', baseDamage: 6, kb: 2.6, anim: 'kick', sfx: 'kick', flags: 0 },
    { name: 'CHOP', baseDamage: 6, kb: 2.0, anim: 'chop', sfx: 'chop', flags: 0 },
    { name: 'ELBOW SMASH', baseDamage: 7, kb: 3.0, anim: 'elbow', sfx: 'hit', flags: 0 },
    { name: 'CLOTHESLINE', baseDamage: 9, kb: 6.5, anim: 'clothesline', sfx: 'hit', run: true, flags: 0x02 }, // RUNNING_GRAPPLE
    { name: 'DROPKICK', baseDamage: 9, kb: 6.0, anim: 'dropkick', sfx: 'kick', run: true, flags: 0x02 }, // RUNNING_GRAPPLE
    { name: 'SUPERKICK', baseDamage: 11, kb: 5.0, anim: 'superkick', sfx: 'kick', flags: 0 },
  ],
  front: [
    { name: 'VERTICAL SUPLEX', baseDamage: 12, anim: 'suplex', desc: 'Classic suplex', flags: 0x1000, connectionFrames: 18, totalFrames: 40 }, // WORKS_ON_GIANT
    { name: 'BODYSLAM', baseDamage: 11, anim: 'slam', flags: 0x1000, connectionFrames: 16, totalFrames: 38 }, // WORKS_ON_GIANT
    { name: 'DDT', baseDamage: 13, anim: 'ddt', flags: 0, connectionFrames: 14, totalFrames: 35 },
    { name: 'NECK BREAKER', baseDamage: 12, anim: 'neckbreaker', flags: 0, connectionFrames: 15, totalFrames: 36 },
    { name: 'POWER BOMB', baseDamage: 16, anim: 'powerbomb', flags: 0x1004, connectionFrames: 22, totalFrames: 48 }, // WORKS_ON_GIANT | HIGH_FLYING
    { name: 'PILE DRIVER', baseDamage: 17, anim: 'piledriver', flags: 0x1000, connectionFrames: 20, totalFrames: 44 }, // WORKS_ON_GIANT
    { name: 'BACK BREAKER', baseDamage: 13, anim: 'backbreaker', flags: 0, connectionFrames: 16, totalFrames: 38 },
    { name: 'SAMOAN DROP', baseDamage: 13, anim: 'slam', flags: 0, connectionFrames: 18, totalFrames: 40 },
    { name: 'SPINE BUSTER', baseDamage: 15, anim: 'spinebuster', flags: 0x1000, connectionFrames: 16, totalFrames: 40 }, // WORKS_ON_GIANT
    { name: 'HURRICANRANA', baseDamage: 14, anim: 'hurricanrana', flags: 0x80, connectionFrames: 14, totalFrames: 35 }, // PINNING_HOLD
  ],
  back: [
    { name: 'GERMAN SUPLEX', baseDamage: 14, anim: 'german', flags: 0x1000, connectionFrames: 18, totalFrames: 40 }, // WORKS_ON_GIANT
    { name: 'BACK SUPLEX', baseDamage: 13, anim: 'suplex', flags: 0x1000, connectionFrames: 18, totalFrames: 40 }, // WORKS_ON_GIANT
    { name: 'SLEEPER DROP', baseDamage: 11, anim: 'ddt', flags: 0, connectionFrames: 14, totalFrames: 35 },
    { name: 'ATOMIC DROP', baseDamage: 10, anim: 'slam', flags: 0, connectionFrames: 12, totalFrames: 30 },
  ],
  ground: [
    { name: 'STOMP', baseDamage: 5, anim: 'stomp', flags: 0x01, connectionFrames: 8, totalFrames: 20 }, // GROUND_ONLY
    { name: 'ELBOW DROP', baseDamage: 8, anim: 'elbowdrop', flags: 0x01, connectionFrames: 12, totalFrames: 28 }, // GROUND_ONLY
    { name: 'KNEE DROP', baseDamage: 7, anim: 'elbowdrop', flags: 0x01, connectionFrames: 10, totalFrames: 24 }, // GROUND_ONLY
    { name: 'FROG SPLASH', baseDamage: 14, anim: 'splash', dive: true, flags: 0x0C, connectionFrames: 22, totalFrames: 45 }, // SPLASH_TYPE | HIGH_FLYING
  ],
  dive: [
    { name: 'CROSSBODY', baseDamage: 13, anim: 'splash', flags: 0x0C, connectionFrames: 18, totalFrames: 40 }, // SPLASH_TYPE | HIGH_FLYING
    { name: 'MISSILE DROPKICK', baseDamage: 14, anim: 'dropkick', flags: 0x06, connectionFrames: 16, totalFrames: 38 }, // HIGH_FLYING | RUNNING_GRAPPLE
    { name: '450 VENOM SPLASH', baseDamage: 18, anim: 'splash', flags: 0x0C, connectionFrames: 24, totalFrames: 50 }, // SPLASH_TYPE | HIGH_FLYING
    { name: 'DIVING ELBOW', baseDamage: 15, anim: 'elbowdrop', flags: 0x04, connectionFrames: 18, totalFrames: 42 }, // HIGH_FLYING
  ],
  submit: [
    { name: 'SHARPSHOOTER', baseDamage: 3, anim: 'submit', drain: true, flags: 0xC0, connectionFrames: 30, totalFrames: 60 }, // PINNING_HOLD | ROPE_BREAK_IGNORE
    { name: 'FIGURE-FOUR', baseDamage: 3, anim: 'submit', drain: true, flags: 0xC0, connectionFrames: 30, totalFrames: 60 }, // PINNING_HOLD | ROPE_BREAK_IGNORE
    { name: 'VEX SUBMISSION', baseDamage: 4, anim: 'submit', drain: true, flags: 0xC0, connectionFrames: 30, totalFrames: 60 }, // PINNING_HOLD | ROPE_BREAK_IGNORE
    { name: 'BEAR HUG', baseDamage: 2, anim: 'submit', drain: true, flags: 0x80, connectionFrames: 25, totalFrames: 50 }, // PINNING_HOLD
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
  }
};

export const ARENAS = [
  { id: 'attitude', name: 'ATTITUDE DOME', theme: 'Red / Titantron', crowd: 420 },
  { id: 'pain', name: 'PAIN PALACE', theme: 'Blue / Gold', crowd: 380 },
  { id: 'empire', name: 'EMPIRE BACKYARD', theme: 'Gritty / Hardcore', crowd: 260 },
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
};
