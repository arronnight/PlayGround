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
    'basilosaurus','megalodon','dorudon','livyatan','otodus','ambulocetus','halitherium'],
  mesozoic: ['ichthyosaur','plesiosaur','ammonite','mosasaur','belemnite',
    'shonisaurus','liopleurodon','elasmosaurus','tylosaurus','xiphactinus','cretoxyrhina','archelon','baculites'],
  paleozoic: ['trilobite','orthocone','anomalocaris','dunkleosteus','eurypterid','opabinia','hallucigenia',
    'peytoia','wiwaxia','pikaia','isotelus','endoceras','pterygotus','cladoselache','bothriolepis','helicoprion','tullimonstrum'],
  precambrian: ['charnia','dickinsonia','tribrachidium','kimberella','spriggina','charniodiscus','parvancorina'],
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
    if (depth < 200) return { types: ['orthocone', 'opabinia', 'anomalocaris', 'pikaia', 'tullimonstrum'] };
    return { types: ['orthocone', 'anomalocaris', 'endoceras'] };
  }
  if (era === 'mesozoic') {
    // Bands carry the small swimmers; giants patrol the sites, not every
    // depth contour at once.
    if (depth < 200) return { types: ['ichthyosaur', 'ammonite', 'belemnite', 'baculites'] };
    if (depth < 930) return { types: ['ammonite', 'ichthyosaur', 'belemnite', 'baculites'] };
    return { types: ['ammonite'] };
  }
  if (era === 'cenozoic') {
    const base = communityAt(depth).types.slice();
    if (depth < 200) base.push('dorudon', 'otodus');
    else if (depth < 930) base.push('livyatan');
    return { types: base };
  }
  return communityAt(depth);
}

// Benthic roster per site for ancient eras: [type, count, dx, dz, spread].
// Precambrian deep water stays empty — the Ediacaran biota was shallow marine.
export function eraBedRoster(siteId, era) {
  if (era === 'precambrian') {
    if (siteId === 'reef') return [['charnia', 9, -14, 12, 22], ['dickinsonia', 12, 10, 18, 24], ['tribrachidium', 8, 0, -12, 20], ['kimberella', 7, 18, 4, 18], ['spriggina', 6, -6, -20, 20], ['charniodiscus', 5, -20, -4, 24], ['parvancorina', 8, 8, 8, 16]];
    if (siteId === 'kelp') return [['charnia', 7, -12, 14, 24], ['dickinsonia', 8, 12, 16, 22], ['tribrachidium', 6, 0, -10, 20], ['kimberella', 6, 16, 2, 20], ['spriggina', 5, -4, -18, 22], ['charniodiscus', 4, -18, -2, 26], ['parvancorina', 6, 6, 10, 18]];
    return [];
  }
  if (era === 'paleozoic') {
    if (siteId === 'reef') return [['trilobite', 14, -10, 8, 20], ['hallucigenia', 8, 12, 14, 18], ['eurypterid', 5, 0, -12, 20], ['wiwaxia', 9, -18, -6, 16], ['isotelus', 3, 16, -2, 24], ['bothriolepis', 6, 4, 20, 18]];
    if (siteId === 'kelp') return [['trilobite', 12, -8, 10, 22], ['hallucigenia', 7, 10, 16, 20], ['eurypterid', 4, 0, -10, 22], ['wiwaxia', 8, -16, -4, 18], ['bothriolepis', 5, 14, 6, 20]];
    if (siteId === 'deep') return [['trilobite', 4, -6, 8, 18], ['hallucigenia', 3, 6, -6, 16], ['wiwaxia', 3, 0, 14, 16], ['pterygotus', 2, 8, 4, 18]];
    return [['trilobite', 2, 0, 0, 14]];
  }
  if (era === 'mesozoic') return [];
  return null;
}

// Pelagic roster per site for ancient eras: [type, count, dx, y, dz, spread].
export function eraSiteSwimmers(siteId, era) {
  if (era === 'precambrian') return [];
  if (era === 'paleozoic') {
    if (siteId === 'reef' || siteId === 'kelp') return [['orthocone', 7, 0, -22, 0, 16], ['opabinia', 6, -14, -27, 10, 12], ['anomalocaris', 3, 14, -19, -10, 14], ['pikaia', 8, -8, -25, 14, 12], ['tullimonstrum', 5, 10, -23, -12, 12], ['peytoia', 3, -18, -21, -14, 14], ['helicoprion', 2, 16, -24, 8, 16]];
    if (siteId === 'blue') return [['orthocone', 9, 0, -47, 0, 16], ['anomalocaris', 3, -16, -43, 12, 14], ['dunkleosteus', 2, 16, -52, -12, 16], ['cladoselache', 4, -8, -45, 8, 14], ['endoceras', 1, 20, -50, -20, 16], ['helicoprion', 2, -14, -49, -10, 18]];
    return [];
  }
  // Giants (visual length 15m+) hold lanes far off-axis from arrival eyes:
  // looming silhouettes, never face-fillers.
  if (era === 'mesozoic') {
    if (siteId === 'reef') return [['ichthyosaur', 3, 0, -20, 2, 16], ['ammonite', 6, -12, -25, 12, 14], ['belemnite', 12, 12, -22, -8, 15], ['mosasaur', 1, 28, -26, -22, 18], ['baculites', 8, -8, -24, 8, 12], ['archelon', 1, 14, -20, -10, 16]];
    if (siteId === 'kelp') return [['ichthyosaur', 2, 0, -22, 2, 16], ['ammonite', 5, -12, -26, 10, 14], ['belemnite', 10, 12, -24, -8, 15], ['baculites', 6, -8, -25, 8, 12], ['archelon', 1, 12, -21, -8, 16]];
    if (siteId === 'blue') return [['ichthyosaur', 4, -24, -47, -30, 16], ['plesiosaur', 2, 22, -40, -16, 18], ['ammonite', 6, 14, -53, -12, 15], ['mosasaur', 2, 30, -50, -50, 20], ['belemnite', 14, -25, -48, -25, 16], ['xiphactinus', 4, 25, -44, -25, 16], ['cretoxyrhina', 2, -16, -52, -20, 16], ['shonisaurus', 1, 28, -46, -60, 18], ['liopleurodon', 1, -28, -42, -45, 18], ['elasmosaurus', 1, 25, -38, -32, 18], ['tylosaurus', 1, -30, -45, -38, 18]];
    return [['ammonite', 2, 2, null, 28, 8]]; // null y = hover just above the local floor
  }
  // Cenozoic giants patrol open water; the modern roster stays everywhere else.
  if (era === 'cenozoic' && siteId === 'blue') return [['megalodon', 2, 28, -50, -30, 16], ['basilosaurus', 1, -30, -38, -25, 18], ['dorudon', 3, -20, -44, -10, 14], ['livyatan', 1, 30, -48, -32, 18], ['otodus', 2, 20, -52, -20, 16], ['halitherium', 2, -16, -36, -4, 14]];
  if (era === 'cenozoic' && (siteId === 'reef' || siteId === 'kelp')) return [['ambulocetus', 2, 10, -10, 18, 16]];
  return null;
}
