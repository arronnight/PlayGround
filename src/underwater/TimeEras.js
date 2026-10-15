import { communityAt } from './OceanFauna.js';

// Time eras for the procedural ocean. Every roster, sound profile and note is
// a seeded artistic approximation of the fossil record — composed for
// exploration, not a measured ecological or paleontological model.
export const ERAS = [
  { id: 'modern', name: 'Modern ocean', span: 'Present day', blurb: 'The living deep as it is: reefs, kelp, whales and the full modern roster.' },
  { id: 'cenozoic', name: 'Cenozoic seas', span: '66M years ago – present', blurb: 'Modern groups arise. Giant early whales and megapredator sharks patrol beside them.' },
  { id: 'mesozoic', name: 'Mesozoic seas', span: '252M – 66M years ago', blurb: 'Marine reptiles rule the water column: ichthyosaurs, long-necked plesiosaurs and coiled ammonites. No modern fish schools.' },
  { id: 'paleozoic', name: 'Paleozoic seas', span: '541M – 252M years ago', blurb: 'Armor and segments: trilobites on the bottom, straight-shelled orthocones jetting above. No jaws worth fearing yet.' },
  { id: 'precambrian', name: 'Precambrian seas', span: '4.5B – 541M years ago', blurb: 'Before eyes, mouths and bones: soft fronds and flat glide-reflected mats. Silent water — geophony only.' },
];

export const ERA_IDS = ERAS.map(e => e.id);

// Which eras each creature belongs to, for the population gates. Modern seas
// keep their full original cast; ancient forms appear only in deep time.
export const ERA_CAST = {
  modern: ['butterflyfish','parrotfish','reefshark','tuna','sunfish','dolphin','seal',
    'lanternfish','hatchetfish','dragonfish','anglerfish','gulpereel',
    'squid','vampire','flapjack','octopus','crab','shrimp','ventshrimp',
    'starfish','brittlestar','urchin','isopod','cucumber','seapen'],
  // Cenozoic seas keep the modern groups (they arose within the era) and add
  // the extinct giants. Nothing modern may predate the eras below it.
  cenozoic: ['butterflyfish','parrotfish','reefshark','tuna','sunfish','dolphin','seal',
    'lanternfish','hatchetfish','dragonfish','anglerfish','gulpereel',
    'squid','vampire','flapjack','octopus','crab','shrimp','ventshrimp',
    'starfish','brittlestar','urchin','isopod','cucumber','seapen',
    'basilosaurus','megalodon'],
  mesozoic: ['ichthyosaur','plesiosaur','ammonite','mosasaur','belemnite'],
  paleozoic: ['trilobite','orthocone','anomalocaris','dunkleosteus','eurypterid','opabinia','hallucigenia'],
  precambrian: ['charnia','dickinsonia','tribrachidium'],
};

export function normalizeEra(value) {
  return ERA_IDS.includes(value) ? value : 'modern';
}

export function isAncientEra(era) {
  return era === 'precambrian' || era === 'paleozoic' || era === 'mesozoic';
}

// Era-appropriate depth communities for the water column. Modern and Cenozoic
// reuse the composed modern table; ancient eras swim only their own roster.
export function eraCommunityAt(depth, era = 'modern') {
  if (era === 'precambrian') return { types: [] };
  if (era === 'paleozoic') {
    if (depth < 200) return { types: ['orthocone', 'opabinia', 'anomalocaris'] };
    return { types: ['orthocone', 'anomalocaris'] };
  }
  if (era === 'mesozoic') {
    // Bands carry the small swimmers; giants patrol the sites, not every
    // depth contour at once.
    if (depth < 200) return { types: ['ichthyosaur', 'ammonite', 'belemnite'] };
    if (depth < 930) return { types: ['ammonite', 'ichthyosaur', 'belemnite'] };
    return { types: ['ammonite'] };
  }
  if (era === 'cenozoic') return communityAt(depth);
  return communityAt(depth);
}

// Benthic roster per site for ancient eras: [type, count, spread].
// Precambrian deep water stays empty — the Ediacaran biota was shallow marine.
export function eraBedRoster(siteId, era) {
  if (era === 'precambrian') {
    if (siteId === 'reef') return [['charnia', 9, 22], ['dickinsonia', 12, 24], ['tribrachidium', 8, 20]];
    if (siteId === 'kelp') return [['charnia', 7, 24], ['dickinsonia', 8, 22], ['tribrachidium', 6, 20]];
    return [];
  }
  if (era === 'paleozoic') {
    const bed = [['trilobite', 14, 20], ['hallucigenia', 8, 18], ['eurypterid', 5, 20]];
    if (siteId === 'reef') return bed;
    if (siteId === 'kelp') return bed;
    if (siteId === 'deep') return [['trilobite', 4, 18], ['hallucigenia', 3, 16]];
    return [['trilobite', 2, 14]];
  }
  if (era === 'mesozoic') return [];
  return null;
}

// Pelagic roster per site for ancient eras: [type, count, yOffset, spread].
export function eraSiteSwimmers(siteId, era) {
  if (era === 'precambrian') return [];
  if (era === 'paleozoic') {
    if (siteId === 'reef' || siteId === 'kelp') return [['orthocone', 7, -22, 16], ['opabinia', 6, -24, 14], ['anomalocaris', 3, -20, 16]];
    if (siteId === 'blue') return [['orthocone', 9, -47, 16], ['anomalocaris', 3, -44, 16], ['dunkleosteus', 2, -50, 18]];
    return [];
  }
  if (era === 'mesozoic') {
    if (siteId === 'reef') return [['ichthyosaur', 3, -20, 16], ['ammonite', 6, -24, 14], ['belemnite', 12, -22, 15], ['mosasaur', 1, -24, 18]];
    if (siteId === 'kelp') return [['ichthyosaur', 2, -22, 16], ['ammonite', 5, -26, 14], ['belemnite', 10, -24, 15]];
    if (siteId === 'blue') return [['ichthyosaur', 4, -47, 16], ['plesiosaur', 2, -40, 18], ['ammonite', 6, -53, 15], ['mosasaur', 2, -50, 20], ['belemnite', 14, -48, 16]];
    return [['ammonite', 2, null, 8]]; // null y = hover just above the local floor
  }
  // Cenozoic giants patrol open water; the modern roster stays everywhere else.
  if (era === 'cenozoic' && siteId === 'blue') return [['megalodon', 2, -47, 16], ['basilosaurus', 1, -40, 18]];
  return null;
}
