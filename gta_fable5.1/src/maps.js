// Per-map gameplay placement. x/z are resolved from city blocks at load:
// { block:[i,j], ax:'x0| x1|cx', dx, az:'z0|z1|cz', dz }.
export const MAPS = {
  fable: {
    id: 'fable',
    name: 'Fable City',
    welcome: 'Welcome to Fable City. Press F1 for controls.',
    spawn: { block: [16, 20], ax: 'x0', dx: 12, az: 'z1', dz: 1.6, carDx: 13, carDz: 5.2 },
    hospital: { block: [16, 19] },
    missions: [
      { type: 'race', name: 'Street Race', color: 0xffd24a, block: [19, 2], ax: 'x1', dx: 5, az: 'z0', dz: -5, desc: 'Hit every checkpoint before the clock runs out.' },
      { type: 'taxi', name: 'Taxi Fares', color: 0xffd24a, block: [19, 18], ax: 'x0', dx: 30, az: 'z0', dz: -5, desc: 'Ferry passengers across town. Fast and smooth pays.' },
      { type: 'contract', name: 'The Contract', color: 0xff5050, block: [18, 18], ax: 'x0', dx: -5, az: 'z0', dz: -5, desc: 'A rival needs to disappear. Find them before they vanish.' },
      { type: 'hotwheels', name: 'Hot Wheels', color: 0x50c8ff, block: [21, 3], ax: 'x0', dx: -5, az: 'z1', dz: 5, desc: 'Boost the marked car and bring it back to the chop shop.' },
      { type: 'vigilante', name: 'Vigilante', color: 0x6a8cff, block: [4, 11], ax: 'x0', dx: -5, az: 'z0', dz: -5, desc: 'Take a cruiser and run down the fleeing suspects.' },
    ],
    stores: [
      { id: 'ammu', name: 'AMMU-NATION', color: '#ff8c1a', hex: 0xff8c1a, block: [17, 18], side: 'S', kind: 'gun', greet: ["Welcome to Ammu-Nation. Protect yourself, friend.", "Second amendment special today. What'll it be?"] },
      { id: 'ammu2', name: 'AMMU-NATION', color: '#ff8c1a', hex: 0xff8c1a, block: [5, 10], side: 'W', kind: 'gun', greet: ["Guns, ammo, body armor. No questions asked."] },
      { id: 'burger', name: 'BURGER SHOT', color: '#ff3b7a', hex: 0xff3b7a, block: [19, 21], side: 'N', kind: 'food', greet: ["Welcome to Burger Shot! Would you like to go large?", "Hey! Our burgers are 40% real meat now!"] },
      { id: 'burger2', name: 'BURGER SHOT', color: '#ff3b7a', hex: 0xff3b7a, block: [18, 2], side: 'E', kind: 'food', greet: ["Fresh off the grill. Mostly."] },
      { id: 'cloth', name: 'THREADS', color: '#3bd1ff', hex: 0x3bd1ff, block: [19, 3], side: 'S', kind: 'clothes', greet: ["Looking sharp is a lifestyle. Pick an outfit.", "You've got the walk, now get the look."] },
      { id: 'spray', name: "PAY 'N' SPRAY", color: '#2bff88', hex: 0x2bff88, block: [21, 20], side: 'E', kind: 'spray' },
    ],
  },
  liberty: {
    id: 'liberty',
    name: 'Liberty City',
    welcome: 'Welcome to Liberty City. Press F1 for controls.',
    spawn: { block: [12, 17], ax: 'x0', dx: 12, az: 'z1', dz: 1.6, carDx: 13, carDz: 5.2 },
    hospital: { block: [12, 18] },
    missions: [
      { type: 'race', name: 'Street Race', color: 0xffd24a, block: [19, 15], ax: 'x1', dx: 5, az: 'z0', dz: -5, desc: 'Hit every checkpoint before the clock runs out.' },
      { type: 'taxi', name: 'Taxi Fares', color: 0xffd24a, block: [12, 17], ax: 'x0', dx: 30, az: 'z0', dz: -5, desc: 'Ferry passengers across town. Fast and smooth pays.' },
      { type: 'contract', name: 'The Contract', color: 0xff5050, block: [19, 11], ax: 'x0', dx: -5, az: 'z0', dz: -5, desc: 'A rival needs to disappear. Find them before they vanish.' },
      { type: 'hotwheels', name: 'Hot Wheels', color: 0x50c8ff, block: [4, 15], ax: 'x0', dx: -5, az: 'z1', dz: 5, desc: 'Boost the marked car and bring it back to the chop shop.' },
      { type: 'vigilante', name: 'Vigilante', color: 0x6a8cff, block: [11, 18], ax: 'x0', dx: -5, az: 'z0', dz: -5, desc: 'Take a cruiser and run down the fleeing suspects.' },
    ],
    stores: [
      { id: 'ammu', name: 'AMMU-NATION', color: '#ff8c1a', hex: 0xff8c1a, block: [12, 14], side: 'S', kind: 'gun', greet: ["Welcome to Ammu-Nation. Protect yourself, friend.", "Second amendment special today. What'll it be?"] },
      { id: 'ammu2', name: 'AMMU-NATION', color: '#ff8c1a', hex: 0xff8c1a, block: [20, 15], side: 'W', kind: 'gun', greet: ["Guns, ammo, body armor. No questions asked."] },
      { id: 'burger', name: 'BURGER SHOT', color: '#ff3b7a', hex: 0xff3b7a, block: [13, 17], side: 'N', kind: 'food', greet: ["Welcome to Burger Shot! Would you like to go large?", "Hey! Our burgers are 40% real meat now!"] },
      { id: 'burger2', name: 'BURGER SHOT', color: '#ff3b7a', hex: 0xff3b7a, block: [5, 14], side: 'E', kind: 'food', greet: ["Fresh off the grill. Mostly."] },
      { id: 'cloth', name: 'THREADS', color: '#3bd1ff', hex: 0x3bd1ff, block: [10, 12], side: 'S', kind: 'clothes', greet: ["Looking sharp is a lifestyle. Pick an outfit.", "You've got the walk, now get the look."] },
      { id: 'spray', name: "PAY 'N' SPRAY", color: '#2bff88', hex: 0x2bff88, block: [21, 16], side: 'E', kind: 'spray' },
    ],
  },
};
export const MAP_IDS = Object.keys(MAPS);
