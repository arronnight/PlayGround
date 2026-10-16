import * as THREE from 'three';
import { seeded, TAU, normalizeGenerator, parseSeed } from './WorldMath.js';
import { normalizeEra, isAncientEra, eraCommunityAt, eraBedRoster, eraSiteSwimmers } from './TimeEras.js';
import { oceanFloor, transectPose, SITE_ORIGINS } from './OceanDomain.js';
import { creatureGeometry } from './FaunaGeometry.js';
import { waterMaterial } from './UnderwaterMaterial.js';
import { AnimalMotion } from './AnimalMotion.js';
import { excursionDepth } from './OceanEcology.js';

export const FAUNA = {
  butterflyfish:{name:'Butterflyfish',motion:5,behavior:'forage',size:.15,skin:0},
  parrotfish:{name:'Parrotfish',motion:5,behavior:'forage',size:.27,skin:0},
  reefshark:{name:'Reef sharks',motion:5,behavior:'cruise',size:.55,hunter:true,skin:4},
  tuna:{name:'Tuna',motion:5,behavior:'school',size:.49,hunter:true,skin:0},
  sunfish:{name:'Ocean sunfish',motion:13,behavior:'hover',size:.60,skin:4},
  dolphin:{name:'Dolphins',motion:10,behavior:'cruise',size:.68,skin:4},
  seal:{name:'Seals',motion:15,behavior:'cruise',size:.50,skin:4},
  lanternfish:{name:'Lanternfish',motion:5,behavior:'school',size:.105,skin:0},
  hatchetfish:{name:'Hatchetfish',motion:5,behavior:'school',size:.09,skin:0},
  dragonfish:{name:'Dragonfish',motion:8,behavior:'hover',size:.22,hunter:true,skin:5},
  anglerfish:{name:'Anglerfish',motion:5,behavior:'hover',size:.29,hunter:true,skin:5},
  gulpereel:{name:'Gulper eels',motion:8,behavior:'hover',size:.20,hunter:true,skin:5},
  squid:{name:'Squid',motion:6,behavior:'jet',size:.24,skin:1},
  vampire:{name:'Vampire squid',motion:7,behavior:'hover',size:.23,skin:1},
  flapjack:{name:'Flapjack octopuses',motion:7,behavior:'hover',size:.22,skin:1},
  octopus:{name:'Octopuses',motion:7,behavior:'crawl',size:.36,benthic:true,skin:1},
  crab:{name:'Crabs',motion:9,behavior:'crawl',size:.17,benthic:true,skin:2},
  shrimp:{name:'Midwater shrimp',motion:12,behavior:'jet',size:.066,skin:2},
  ventshrimp:{name:'Vent shrimp',motion:12,behavior:'crawl',size:.038,benthic:true,skin:2},
  starfish:{name:'Sea stars',motion:11,behavior:'settled',size:.16,benthic:true,skin:3},
  brittlestar:{name:'Brittle stars',motion:11,behavior:'settled',size:.13,benthic:true,skin:3},
  urchin:{name:'Sea urchins',motion:0,behavior:'settled',size:.13,benthic:true,skin:3},
  isopod:{name:'Giant isopods',motion:9,behavior:'crawl',size:.19,benthic:true,skin:2},
  cucumber:{name:'Sea cucumbers',motion:9,behavior:'crawl',size:.26,benthic:true,skin:3},
  seapen:{name:'Sea pens',motion:11,behavior:'settled',size:.46,benthic:true,skin:3},
  charnia:{name:'Charnian fronds',motion:11,behavior:'settled',size:.55,benthic:true,skin:3},
  dickinsonia:{name:'Dickinsonia',motion:11,behavior:'settled',size:.42,benthic:true,skin:3},
  trilobite:{name:'Trilobites',motion:9,behavior:'crawl',size:.34,benthic:true,skin:2},
  orthocone:{name:'Orthocones',motion:8,behavior:'hover',size:1.1,hunter:true,skin:0},
  ichthyosaur:{name:'Ichthyosaurs',motion:5,behavior:'cruise',size:2.1,hunter:true,skin:4},
  plesiosaur:{name:'Plesiosaurs',motion:10,behavior:'cruise',size:3.0,skin:4},
  ammonite:{name:'Ammonites',motion:8,behavior:'hover',size:.5,skin:2},
  basilosaurus:{name:'Basilosaurus',motion:10,behavior:'cruise',size:4.6,hunter:true,skin:4},
  megalodon:{name:'Megalodon',motion:5,behavior:'cruise',size:3.8,hunter:true,skin:4},
  anomalocaris:{name:'Anomalocaris',motion:5,behavior:'cruise',size:1.0,hunter:true,skin:2},
  dunkleosteus:{name:'Dunkleosteus',motion:5,behavior:'cruise',size:2.5,hunter:true,skin:4},
  eurypterid:{name:'Sea scorpions',motion:9,behavior:'crawl',size:.8,benthic:true,skin:2},
  opabinia:{name:'Opabinia',motion:8,behavior:'hover',size:.4,skin:0},
  hallucigenia:{name:'Hallucigenia',motion:9,behavior:'crawl',size:.3,benthic:true,skin:3},
  mosasaur:{name:'Mosasaurs',motion:8,behavior:'cruise',size:6.0,hunter:true,skin:4},
  belemnite:{name:'Belemnites',motion:6,behavior:'school',size:.5,skin:1},
  tribrachidium:{name:'Tribrachidium',motion:11,behavior:'settled',size:.25,benthic:true,skin:3},
  kimberella:{name:'Kimberella',motion:9,behavior:'crawl',size:.12,benthic:true,skin:3},
  spriggina:{name:'Spriggina',motion:8,behavior:'crawl',size:.10,benthic:true,skin:3},
  charniodiscus:{name:'Charniodiscus',motion:11,behavior:'settled',size:.50,benthic:true,skin:3},
  parvancorina:{name:'Parvancorina',motion:11,behavior:'settled',size:.08,benthic:true,skin:3},
  peytoia:{name:'Peytoia',motion:5,behavior:'cruise',size:.8,hunter:true,skin:2},
  wiwaxia:{name:'Wiwaxia',motion:9,behavior:'crawl',size:.15,benthic:true,skin:2},
  pikaia:{name:'Pikaia',motion:8,behavior:'hover',size:.12,skin:0},
  isotelus:{name:'Isotelus',motion:9,behavior:'crawl',size:.5,benthic:true,skin:2},
  endoceras:{name:'Endoceras',motion:8,behavior:'hover',size:3.0,hunter:true,skin:0},
  pterygotus:{name:'Pterygotus',motion:9,behavior:'crawl',size:1.2,benthic:true,skin:2},
  cladoselache:{name:'Cladoselache',motion:5,behavior:'cruise',size:1.0,hunter:true,skin:0},
  bothriolepis:{name:'Bothriolepis',motion:9,behavior:'crawl',size:.4,benthic:true,skin:2},
  helicoprion:{name:'Helicoprion',motion:5,behavior:'cruise',size:2.5,hunter:true,skin:0},
  tullimonstrum:{name:'Tullimonstrum',motion:8,behavior:'hover',size:.35,skin:1},
  shonisaurus:{name:'Shonisaurus',motion:5,behavior:'cruise',size:6.0,hunter:true,skin:4},
  liopleurodon:{name:'Liopleurodon',motion:10,behavior:'cruise',size:4.0,hunter:true,skin:4},
  elasmosaurus:{name:'Elasmosaurus',motion:10,behavior:'cruise',size:5.0,skin:4},
  tylosaurus:{name:'Tylosaurus',motion:8,behavior:'cruise',size:5.0,hunter:true,skin:4},
  xiphactinus:{name:'Xiphactinus',motion:5,behavior:'cruise',size:2.0,hunter:true,skin:0},
  cretoxyrhina:{name:'Cretoxyrhina',motion:5,behavior:'cruise',size:2.5,hunter:true,skin:0},
  archelon:{name:'Archelon',motion:14,behavior:'cruise',size:2.0,skin:4},
  baculites:{name:'Baculites',motion:8,behavior:'hover',size:.6,skin:2},
  dorudon:{name:'Dorudon',motion:10,behavior:'cruise',size:2.5,skin:4},
  livyatan:{name:'Livyatan',motion:10,behavior:'cruise',size:6.0,hunter:true,skin:4},
  otodus:{name:'Otodus',motion:5,behavior:'cruise',size:3.0,hunter:true,skin:0},
  ambulocetus:{name:'Ambulocetus',motion:8,behavior:'cruise',size:1.5,skin:4},
  halitherium:{name:'Halitherium',motion:10,behavior:'cruise',size:2.0,skin:4},
};

// Exploration-scale swimming speeds and rhythms, not a measured animal model.
// Fast cruisers run an order of magnitude hotter than bottom dwellers; the
// tail-beat column drives visible stroke rate through the motion shader.
export const RHYTHMS={
  butterflyfish:[.55,3.4],parrotfish:[.70,2.2],reefshark:[2.0,1.0],tuna:[2.8,2.4],
  sunfish:[.24,.55],dolphin:[2.6,1.1],seal:[1.5,1.0],lanternfish:[.32,3.8],hatchetfish:[.28,3.6],
  dragonfish:[.20,.70],anglerfish:[.065,.50],gulpereel:[.32,.75],squid:[1.0,.9],
  vampire:[.07,.28],flapjack:[.085,.4],octopus:[.05,.4],crab:[.13,.6],shrimp:[.32,2.2],
  ventshrimp:[.026,.5],isopod:[.022,.35],cucumber:[.004,.1],
  trilobite:[.03,.4],orthocone:[.60,.65],ichthyosaur:[2.8,1.2],plesiosaur:[1.3,.65],
  ammonite:[.10,.4],basilosaurus:[1.9,.65],megalodon:[2.4,1.0],
  anomalocaris:[.90,.8],dunkleosteus:[1.4,.7],eurypterid:[.06,.4],opabinia:[.25,.6],
  hallucigenia:[.02,.3],mosasaur:[2.2,.7],belemnite:[.80,1.2],
  kimberella:[.03,.3],spriggina:[.04,.4],
  peytoia:[.70,.7],wiwaxia:[.04,.4],pikaia:[.20,.8],
  isotelus:[.03,.4],endoceras:[.30,.4],pterygotus:[.06,.4],cladoselache:[1.2,.9],
  bothriolepis:[.10,.5],helicoprion:[1.6,.8],tullimonstrum:[.25,.6],
  shonisaurus:[2.0,.7],liopleurodon:[1.6,.6],elasmosaurus:[1.0,.5],tylosaurus:[2.0,.7],
  xiphactinus:[1.8,1.0],cretoxyrhina:[2.2,.9],archelon:[.50,.5],baculites:[.08,.4],
  dorudon:[1.6,.7],livyatan:[1.8,.6],otodus:[2.2,.9],ambulocetus:[.50,.6],halitherium:[.90,.6],
};
// Separation includes fins and the spread of webbed arms. Rock/floor clearance
// still uses the smaller body radius, so a grazer can reach its feeding patch.
export const PERSONAL_SPACE={butterflyfish:1,parrotfish:1.05,reefshark:1.5,tuna:1.3,sunfish:1.55,dolphin:1.5,seal:1.4,
  vampire:1.8,flapjack:1.9,octopus:1.7,crab:1.2,
  trilobite:1.1,orthocone:1.3,ichthyosaur:1.6,plesiosaur:2.2,ammonite:1.0,basilosaurus:2.4,megalodon:2.0,
  anomalocaris:1.5,dunkleosteus:2.0,eurypterid:1.0,opabinia:.8,mosasaur:2.6,belemnite:.8,
  peytoia:1.2,isotelus:1.0,endoceras:1.6,pterygotus:1.4,cladoselache:1.4,helicoprion:2.0,
  shonisaurus:2.6,liopleurodon:2.2,elasmosaurus:2.4,tylosaurus:2.6,xiphactinus:1.8,
  cretoxyrhina:2.0,archelon:1.8,baculites:1.0,dorudon:1.8,livyatan:2.8,otodus:2.2,ambulocetus:1.4};

// Broad, overlapping depth communities rather than a hard scene switch.
// Sizes approximate natural body lengths; abundance is composed for exploration,
// not intended to estimate the density or geography of a real ecosystem.
export const MIDWATER_COMMUNITIES = [
  {min:70,max:200,types:['tuna','squid','shrimp']},
  {min:200,max:530,types:['lanternfish','hatchetfish','squid','shrimp']},
  {min:530,max:930,types:['vampire','dragonfish','lanternfish','hatchetfish','shrimp']},
  {min:930,max:1450,types:['anglerfish','gulpereel','dragonfish','flapjack','shrimp']},
];

export function communityAt(depth) {
  return MIDWATER_COMMUNITIES.find(c=>depth>=c.min&&depth<c.max)||MIDWATER_COMMUNITIES[0];
}

// Teeming-water abundance: sixteen of every kind. Settled animals skip motion
// integration almost entirely, so floors carpet cheaply; hunters still read
// individually because they hunt alone. Multiplies the player-facing dials.
export function abundance(spec){
  return 16;
}

export function makeFaunaPopulation(input={}) {
  const recipe={...input,...normalizeGenerator(input),seed:parseSeed(input.seed,713),era:normalizeEra(input.era)},seed=recipe.seed;
  const era=recipe.era,ancient=isAncientEra(era);
  const population=[],rng=seeded(seed+90217);
  let serial=0,schoolSerial=0;
  function add(type,amount,center,zone,spread=8,heading=0,cohort=0,bulk=1,tj=1) {
    const spec=FAUNA[type];
    const factor=recipe.shoal*(spec.benthic?recipe.benthos:(spec.hunter?recipe.predators:1))*abundance(spec)*bulk;
    const count=Math.round(amount*factor);
    if(!count)return;
    // Hold density constant as counts multiply — benthic over area, swimmers
    // through volume — and split big counts into separate sub-schools with
    // their own centers and school ids. One species then reads as many
    // groups across its territory instead of a single dense ball.
    if(spec.benthic)spread*=Math.sqrt(abundance(spec)*bulk);
    else spread*=Math.cbrt(Math.max(1,factor));
    const chunks=Math.max(1,Math.round(count/48));
    for(let c=0;c<chunks;c++){
      const n0=Math.floor(c*count/chunks),n1=Math.floor((c+1)*count/chunks);
      const jx=(rng()-.5)*spread*1.2*tj,jz=(rng()-.5)*spread*1.2*tj,jy=(rng()-.5)*spread*.5*tj;
      const sub=[center[0]+jx,center[1]+jy,center[2]+jz];
      const school=schoolSerial++,schoolPhase=cohort||rng()*TAU;
      for(let i=n0;i<n1;i++){
      const first=i===n0,angle=rng()*TAU,r=first?0:Math.sqrt(rng())*spread;
      let x=sub[0]+Math.cos(angle)*r;
      const z=sub[2]+Math.sin(angle)*r;
      const scale=spec.size*(.78+rng()*.43);
      const y=spec.benthic?oceanFloor(x,z,recipe):sub[1]+(first?0:(rng()-.5)*spread*.52);
      if(!spec.benthic&&y<-100){
        // Keep the entire swimming path in the canyon's open water. Merely
        // lifting misplaced animals onto a shoulder would change their depth.
        for(let attempt=0;attempt<18;attempt++){
          const clearance=Math.max(oceanFloor(x-6,z,recipe),oceanFloor(x+6,z,recipe),oceanFloor(x,z+4,recipe));
          if(y>clearance+3)break;
          x*=.75;
        }
      }
      population.push({
        id:serial++,type,zone,benthic:!!spec.benthic,hunter:!!spec.hunter,
        x,y,z,
        phase:first?0:rng()*TAU,cohort:schoolPhase,school,
        anchorX:sub[0],anchorY:sub[1],anchorZ:sub[2],behavior:spec.behavior,
        maxSpeed:RHYTHMS[type]?.[0]??0,beat:RHYTHMS[type]?.[1]??0,
        pursuer:['reefshark','tuna','ichthyosaur','megalodon','basilosaurus','orthocone','anomalocaris','dunkleosteus','mosasaur','peytoia','helicoprion','shonisaurus','liopleurodon','tylosaurus','xiphactinus','cretoxyrhina','livyatan','otodus','cladoselache'].includes(type),reverse:spec.behavior==='jet',sideways:type==='crab',
        radius:scale*(type==='sunfish'?.85:spec.benthic?.45:.50),turnRate:spec.behavior==='cruise'?.85:1.4,
        personalSpace:scale*(PERSONAL_SPACE[type]??.7),
        scale,variant:i%2,heading:heading+(rng()-.5)*.5,
        speed:(.72+rng()*.55)*(spec.behavior==='cruise'?1.5:spec.behavior==='school'?1.2:spec.behavior==='jet'?1.3:spec.behavior==='hover'||spec.behavior==='crawl'?.8:1),
        orbit:spec.behavior==='school'?1.2:spec.behavior==='cruise'?7.0:.45,
      });
      }
    }
  }
  function local(id,type,count,x,y,z,spread=9,heading=0) {
    const origin=SITE_ORIGINS[id];
    add(type,count,[origin[0]+x,y,origin[1]+z],id,spread,heading);
  }
  // Ancient eras replace the modern site roster wholesale with their own
  // seeded populations; nothing modern swims in deep time.
  if(!ancient){
  // Each species holds its own territory — quadrant plus depth — so the
  // arrival view reads as several groups, not one wall of a single kind.
  local('reef','butterflyfish',30,-24,-23,22,7);
  local('reef','parrotfish',18,16,-30,8,7,Math.PI);
  local('reef','reefshark',3,0,-15,-10,30);
  local('reef','octopus',5,-18,0,25,13);
  local('reef','crab',12,18,0,20,17);
  local('reef','starfish',24,-8,0,32,26);
  local('reef','urchin',21,20,0,2,23);
  local('kelp','seal',4,-14,-20,20,17);
  local('kelp','crab',18,14,0,16,21);
  local('kelp','octopus',5,-16,0,26,20);
  local('kelp','starfish',26,-4,0,32,24);
  local('kelp','urchin',35,18,0,4,27);
  local('blue','sunfish',3,24,-40,10,15,Math.PI);
  local('blue','tuna',18,-20,-47,0,15);
  local('blue','dolphin',5,0,-24,-8,19);
  local('blue','squid',9,10,-53,-2,17,Math.PI);
  local('blue','reefshark',2,-24,-56,-24,18);
  if(era==='cenozoic'){
    // Cenozoic giants patrol their own territories; the modern roster above
    // stays everywhere else. (Bands carry dorudon/otodus/livyatan too.)
    for(const siteId of ['reef','kelp','blue']){
      for(const [type,count,dx,y,dz,spread] of eraSiteSwimmers(siteId,era)||[])
        local(siteId,type,count,dx,y,dz,spread);
    }
  }
  }else{
    for(const siteId of ['reef','kelp','blue','deep']){
      for(const [type,count,dx,dz,spread] of eraBedRoster(siteId,era))local(siteId,type,count,dx,0,dz,spread);
      for(const [type,count,dx,y,dz,spread] of eraSiteSwimmers(siteId,era)||[]){
        if(y===null){
          const o=SITE_ORIGINS[siteId];
          local(siteId,type,count,dx,oceanFloor(o[0]+dx,o[1]+dz,recipe)+3,dz,Math.max(5,spread));
        }else local(siteId,type,count,dx,y,dz,spread);
      }
    }
  }

  const bandDepths=[105,200,315,445,600,750,890,1000,1120,1250,1360];
  for(const depth of bandDepths)for(const column of [false,true]){
    const pose=column?{eye:[0,-depth,-724],look:[0,-depth-6,-764]}:transectPose(depth,recipe);
    const dx=pose.look[0]-pose.eye[0],dz=pose.look[2]-pose.eye[2],n=Math.hypot(dx,dz);
    const forward=[dx/n,dz/n],right=[-forward[1],forward[0]];
    const types=eraCommunityAt(depth,era).types,zone=depth<200?'slope':depth<530?'upper-twilight':depth<930?'lower-twilight':'midnight';
    for(let k=0;k<types.length;k++){
      const type=types[k],spec=FAUNA[type],side=(k-(types.length-1)/2)*1.8,distance=5.5+(k%2)*4.5;
      // Column bands share a horizontal position. Repeating a bottom-hugging
      // species in every band stacked all of them on the same seabed patch.
      // The vent habitat and slope transect already place these octopuses.
      if(column&&type==='flapjack')continue;
      const x=pose.eye[0]+forward[0]*distance+right[0]*side;
      const z=pose.eye[2]+forward[1]*distance+right[1]*side;
      const y=type==='flapjack'?oceanFloor(x,z,recipe)+1.0:-depth-.9+(k%3-1)*1.05;
      const number=spec.behavior==='school'?17:type==='shrimp'?7:1;
      // Benthic band encounters keep single abundance: the transect poses
      // overlap, so multiplying here stacks bottom-huggers on one patch.
      // Site floors carry the benthic bulk instead. Territory jitter stays
      // near zero so the transect camera still frames its encounter.
      add(type,number,[x,y,z],zone,2.4,k%2?Math.PI:0,depth*.01+k,spec.benthic?1/abundance(spec):1,0.15);
    }
    if(!column&&depth>180&&(era==='modern'||era==='cenozoic')){
      const y=oceanFloor(pose.eye[0]+9,pose.eye[2]-5,recipe);
      add('seapen',7,[pose.eye[0]+9,y,pose.eye[2]-5],zone,10);
      add('brittlestar',5,[pose.eye[0]+6,y,pose.eye[2]-6],zone,9);
    }
  }
  const deepY=(x,z)=>oceanFloor(x,z+SITE_ORIGINS.deep[1],recipe);
  if(era==='modern'||era==='cenozoic'){
  local('deep','anglerfish',1,2,deepY(2,26)+3.6,26,5,Math.PI);
  local('deep','gulpereel',1,7,deepY(7,18)+4.0,18,7);
  local('deep','flapjack',2,-2,deepY(-2,28)+.8,28,5);
  local('deep','isopod',5,-1,0,28,9);
  local('deep','crab',8,4,0,24,15);
  local('deep','ventshrimp',52,-8,0,14,8);
  local('deep','ventshrimp',35,11,0,-9,7);
  local('deep','brittlestar',27,-5,0,22,19);
  local('deep','cucumber',12,5,0,24,15);
  local('deep','seapen',17,-10,0,6,21);
  }else if(era==='precambrian'){
    // A sparse Avalon-style assemblage far below the shallow Ediacaran gardens.
    local('deep','charnia',2,-2,0,28,9);
    local('deep','dickinsonia',2,3,0,24,9);
    local('deep','tribrachidium',2,0,0,20,8);
  }else if(era==='paleozoic'){
    local('deep','trilobite',4,-1,0,28,12);
    local('deep','hallucigenia',3,2,0,24,10);
    local('deep','eurypterid',2,-4,0,20,12);
    local('deep','pterygotus',2,6,0,16,14);
    local('deep','wiwaxia',3,-2,0,22,10);
  }else if(era==='mesozoic'){
    local('deep','ammonite',2,2,deepY(2,26)+3,26,6);
  }
  return population;
}

function faunaPosition(animal,time,recipe,out={}) {
  const spec=FAUNA[animal.type],phase=animal.phase,t=time*animal.speed;
  let x=animal.x,y=animal.y,z=animal.z,feeding=0,activity=.5,stroke=t*2+phase;
  if(spec.behavior==='cruise'){
    const a=t*.037+phase,r=animal.orbit*1.6;
    x+=Math.sin(a)*r+Math.sin(a*.63)*1.3;z+=(Math.cos(a)-1)*r*.7;
    y+=Math.sin(t*.065+phase)*(animal.type==='reefshark'?3.2:1.8);
  }else if(spec.behavior==='school'){
    const a=time*.052+animal.cohort,r=animal.type==='tuna'?5:1.7;
    x+=(Math.sin(a)-Math.sin(animal.cohort))*r;
    z+=(Math.cos(a*.81)-Math.cos(animal.cohort*.81))*r*.65;
    y+=Math.sin(time*.18+animal.cohort)*.14+Math.sin(t*.37+phase)*.07;
  }else if(spec.behavior==='forage'){
    const cycle=(t*.025+phase/TAU)%1;
    const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
    feeding=ease((cycle-.20)/.18)*(1-ease((cycle-.65)/.18));
    const patch=animal.feedingPoint||{x:animal.x+Math.cos(animal.heading)*1.2,z:animal.z-Math.sin(animal.heading)*1.2};
    const bed=patch.y??oceanFloor(patch.x,patch.z,recipe);
    x+=(patch.x-animal.x)*feeding+Math.sin(t*.15+phase)*.7*(1-feeding);
    z+=(patch.z-animal.z)*feeding+Math.cos(t*.11+phase)*.45*(1-feeding);
    y+=(bed+Math.max(.16,animal.scale*.6)-y)*feeding;
    activity=1-feeding*.85;
  }else if(spec.behavior==='jet'){
    const cycle=t*(animal.type==='shrimp'?2.4:1.7)+phase;
    const a=(cycle-.8*Math.sin(cycle))*.07,range=Math.min(2.5,animal.scale*5);
    x+=Math.sin(a)*range;z+=(Math.cos(a)-1)*range*.65;
    y+=Math.sin(a*.7)*animal.scale*.4;stroke=cycle;activity=.2+.8*(1-Math.cos(cycle))*.5;
  }else if(spec.behavior==='hover'){
    x+=Math.sin(t*.16+phase)*animal.orbit;z+=Math.cos(t*.14+phase)*animal.orbit*.6;
    y+=Math.sin(t*.21+phase)*animal.scale*.35;activity=.15;
  }else if(spec.behavior==='crawl'){
    const cycle=(t+phase*3)/22,whole=Math.floor(cycle),u=Math.max(0,Math.min(1,((cycle-whole)-.22)/.52));
    const progress=whole+u*u*(3-2*u),a=progress*.48+phase;
    const reach=Math.min(.75,animal.maxSpeed*6);
    x+=(Math.sin(a)-Math.sin(phase))*reach;z+=(Math.cos(a)-Math.cos(phase))*reach*.73;
    activity=u>0&&u<1?6*u*(1-u):0;
  }
  if(animal.type==='dolphin'||animal.type==='seal')y=excursionDepth(animal.type,time,phase,y);
  const floor=oceanFloor(x,z,recipe);
  if(animal.benthic)y=floor+.012;
  else{
    y=Math.max(y,floor+Math.max(.32,animal.scale*1.2));
    y=Math.min(animal.type==='dolphin'||animal.type==='seal'?-.35:-2.5,y);
  }
  Object.assign(out,{x,y,z,feeding,activity,stroke});
  return out;
}

const nextPose={};
export function faunaPose(animal,time,recipe,out={}) {
  faunaPosition(animal,time,recipe,out);faunaPosition(animal,time+.04,recipe,nextPose);
  const vx=(nextPose.x-out.x)/.04,vy=(nextPose.y-out.y)/.04,vz=(nextPose.z-out.z)/.04,horizontal=Math.hypot(vx,vz);
  const heading=horizontal>.0001?-Math.atan2(vz,vx)+(animal.reverse?Math.PI:0)+(animal.sideways?Math.PI/2:0):animal.heading;
  Object.assign(out,{vx,vy,vz,heading,pitch:Math.atan2(vy,Math.max(.025,horizontal))*.6-out.feeding*.55,roll:0});
  return out;
}

export class OceanFauna {
  constructor(recipe,rocks=[]) {
    this.recipe={...recipe,...normalizeGenerator(recipe),seed:parseSeed(recipe.seed,713)};this.group=new THREE.Group();this.group.name='Depth communities';
    this.population=makeFaunaPopulation(this.recipe);this.pools=[];
    const feedingPoints=rocks.flatMap(rock=>(rock.feedingPoints||[]).map(p=>({...p,rock}))).filter(p=>p.y>oceanFloor(p.x,p.z,this.recipe)+.12);
    for(const animal of this.population)if(animal.behavior==='forage'){
      let nearest=null,distance=144;
      for(const p of feedingPoints){const d=(p.x-animal.x)**2+(p.z-animal.z)**2;if(d<distance){distance=d;nearest=p;}}
      if(nearest)animal.feedingPoint=nearest;
    }
    this.motion=new AnimalMotion(this.population,(a,t,out)=>faunaPose(a,t,this.recipe,out),{floor:(x,z)=>oceanFloor(x,z,this.recipe),rocks,perception:4});
    this.poses=this.motion.poses;
    this.nearbySpecies=[];this.hunters=[];this.visibleCount=0;
    const types=[...new Set(this.population.map(a=>a.type))];
    for(const type of types)for(const variant of [0,1]){
      const members=this.population.filter(a=>a.type===type&&a.variant===variant);
      if(!members.length)continue;
      const spec=FAUNA[type],geometry=creatureGeometry(type,this.recipe.seed+type.length*7919+variant*313);
      const bounds=geometry.boundingBox,size=bounds.getSize(new THREE.Vector3());
      for(const animal of members){animal.span=Math.max(size.x,size.y,size.z)*animal.scale;animal.centerY=(bounds.min.y+bounds.max.y)*.5*animal.scale;}
      const motion=new THREE.InstancedBufferAttribute(new Float32Array(members.length*4),4);motion.setUsage(THREE.DynamicDrawUsage);geometry.setAttribute('aAnimalMotion',motion);
      const material=waterMaterial(4,{name:type,fauna:true,animalMotion:true,motion:spec.motion,skin:spec.skin,anchored:!!spec.benthic});
      const mesh=new THREE.InstancedMesh(geometry,material,members.length);
      mesh.name=spec.name;mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.count=0;
      this.group.add(mesh);this.pools.push({mesh,members,spec,motion});
    }
    this.dummy=new THREE.Object3D();this.count=this.population.length;this.typeCount=types.length;
  }

  update(time,cameraPosition,environment={}) {
    this.motion.focus=cameraPosition||null;
    this.motion.advance(time,environment);
    this.hunters.length=0;
    for(const animal of this.population){
      const p=this.poses[animal.id];
      if(animal.hunter)this.hunters.push(p);
    }
    const nearest=new Map();this.visibleCount=0;
    for(const pool of this.pools){
      let visible=0;
      for(const animal of pool.members){
        if(this.motion.pred[animal.id]?.mode===2)continue;
        const p=this.poses[animal.id],distance=cameraPosition?Math.hypot(p.x-cameraPosition.x,p.y-cameraPosition.y,p.z-cameraPosition.z):0;
        if(distance>135)continue;
        const d=this.dummy;d.position.set(p.x,p.y,p.z);
        d.rotation.set(0,p.heading,0);d.rotateZ(p.pitch);d.rotateX(p.roll);d.scale.setScalar(animal.scale);d.updateMatrix();
        pool.motion.setXYZW(visible,p.stroke,p.effort,p.turn,p.feeding);pool.mesh.setMatrixAt(visible++,d.matrix);
        if(distance<65)nearest.set(animal.type,Math.min(nearest.get(animal.type)??Infinity,distance));
      }
      pool.mesh.count=visible;pool.mesh.instanceMatrix.needsUpdate=true;pool.motion.needsUpdate=true;this.visibleCount+=visible;
    }
    this.nearbySpecies=[...nearest].sort((a,b)=>a[1]-b[1]).slice(0,4).map(([type])=>FAUNA[type].name);
  }
}
