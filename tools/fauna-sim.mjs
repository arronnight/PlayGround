import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { creatureGeometry, CREATURE_TYPES } from '../src/underwater/FaunaGeometry.js';
import { OceanFauna, FAUNA, RHYTHMS, makeFaunaPopulation, faunaPose, communityAt } from '../src/underwater/OceanFauna.js';
import { oceanFloor, transectPose } from '../src/underwater/OceanDomain.js';
import { createPelagicLife } from '../src/underwater/OceanTerrain.js';
import { GENERATOR_DEFAULTS } from '../src/underwater/WorldMath.js';
import { ERA_IDS, ERA_CAST } from '../src/underwater/TimeEras.js';
import { AnimalMotion } from '../src/underwater/AnimalMotion.js';
import { shoalLayoutForEra } from '../src/underwater/ShoalField.js';

let checks=0;
const check=(ok,message)=>{assert.ok(ok,message);checks++;};
const geometryHash=g=>{
  const hash=createHash('sha256');
  for(const key of ['position','normal','color','aGlow'])hash.update(Buffer.from(g.attributes[key].array.buffer));
  return hash.digest('hex');
};
const shapes=new Set();
for(const type of CREATURE_TYPES){
  const a=creatureGeometry(type,713),b=creatureGeometry(type,713),c=creatureGeometry(type,1948);
  check(FAUNA[type]?.name,'Every creature needs a reader-facing identity.');
  for(const [name,attr] of Object.entries(a.attributes)){
    check(attr.array.every(Number.isFinite),type+': '+name+' must remain finite.');
    check(attr.count===a.attributes.position.count,type+': all attributes must cover every vertex.');
  }
  check(a.index.array.every(n=>n>=0&&n<a.attributes.position.count),type+': triangles reference actual vertices.');
  check(geometryHash(a)===geometryHash(b),type+': the same seed must reproduce anatomy and markings.');
  check(geometryHash(a)!==geometryHash(c),type+': a different seed must change actual geometry or markings.');
  shapes.add(createHash('sha256').update(Buffer.from(a.attributes.position.array.buffer)).digest('hex'));
  if(type==='anglerfish'){
    const glowing=Array.from(a.attributes.aGlow.array).filter(v=>v>.5).length/a.attributes.position.count;
    check(glowing>0&&glowing<.15,'The angler lure should glow without illuminating the entire fish.');
  }
  a.dispose();b.dispose();c.dispose();
}
check(shapes.size>=23,'The population needs structurally different creatures, not only recolored copies.');

const recipe={...GENERATOR_DEFAULTS,seed:713},population=makeFaunaPopulation(recipe);
// Every authored form must appear in the eras it belongs to: the modern cast
// stays complete in the default world, and ancient forms arrive with deep time.
const eraTypes={};
for(const era of ERA_IDS)eraTypes[era]=new Set(makeFaunaPopulation({...recipe,era}).map(a=>a.type));
for(const type of CREATURE_TYPES){
  const home=ERA_IDS.filter(e=>(ERA_CAST[e]||[]).includes(type));
  check(home.length>0,type+': every authored form needs an era.');
  check(home.every(e=>eraTypes[e].has(type)),type+': must actually populate its era.');
  check(ERA_IDS.filter(e=>!home.includes(e)).every(e=>!eraTypes[e].has(type)),type+': must not leak into other eras.');
}
check(ERA_CAST.modern.every(t=>eraTypes.modern.has(t)),'The default world must keep its full modern cast.');
assert.deepEqual(population,makeFaunaPopulation(recipe));checks++;
check(JSON.stringify(population)!==JSON.stringify(makeFaunaPopulation({...recipe,seed:714})),'Seed changes must alter the population itself.');
check(makeFaunaPopulation({...recipe,shoal:0}).length===0,'Zero animal abundance must remove swimmers and bottom dwellers.');
const noHunters=makeFaunaPopulation({...recipe,predators:0}),noBottom=makeFaunaPopulation({...recipe,benthos:0});
check(noHunters.every(a=>!a.hunter)&&noHunters.some(a=>a.benthic),'The hunters dial must leave bottom dwellers available.');
check(noBottom.every(a=>!a.benthic)&&noBottom.some(a=>a.hunter),'The bottom-dweller dial must leave swimming hunters available.');
check(makeFaunaPopulation({...recipe,shoal:2}).length>population.length*1.95,'Animal abundance must actually scale populations.');
check(makeFaunaPopulation({...recipe,shoal:Infinity,predators:NaN,benthos:-9}).every(a=>Number.isFinite(a.scale)),'Invalid recipe values must be bounded.');
check(!communityAt(200).types.includes('anglerfish')&&communityAt(1000).types.includes('anglerfish'),'Depth communities must have different casts.');
check(communityAt(600).types.includes('vampire')&&!communityAt(200).types.includes('vampire'),'The lower twilight needs a distinct community.');

for(const seed of [0,713,1934512951,4294967295])for(const relief of [.2,1,2.2]){
  const r={...recipe,seed,relief},animals=makeFaunaPopulation(r);
  for(const depth of [200,600,1000]){
    const pose=transectPose(depth,r),camera=new THREE.PerspectiveCamera(56,16/9,.1,18);
    camera.position.fromArray(pose.eye);camera.lookAt(...pose.look);camera.updateMatrixWorld();
    const view=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
    for(const time of [0,17,120]){
      const inView=new Set();
      for(const animal of animals){const p=faunaPose(animal,time,r);if(view.containsPoint(new THREE.Vector3(p.x,p.y,p.z)))inView.add(animal.type);}
      check(inView.size>=3,'At '+depth+' m, naturally sized animals must lie in the actual starting view, not merely nearby.');
      if(depth===600)check(inView.has('vampire'),'The lower-twilight stop must frame its vampire squid at the correct depth.');
    }
  }
  for(const time of [0,17,120,10000]){
    let finite=true,clear=true,stable=true;
    for(const animal of animals){
      const p=faunaPose(animal,time,r),next=faunaPose(animal,time+.01,r);
      finite&&=Object.values(p).every(Number.isFinite);
      const ceiling=['dolphin','seal'].includes(animal.type)?-.34:-2.49;
      clear&&=p.y>=oceanFloor(p.x,p.z,r)+(animal.benthic?.011:.31)&&p.y<=ceiling;
      stable&&=Math.hypot(next.x-p.x,next.y-p.y,next.z-p.z)<.25;
    }
    check(finite,'Fauna poses stay finite across seeds and long-running clocks.');
    check(clear,'Animals stay above the seeded floor and below the air.');
    check(stable,'Swimming and crawling must remain continuous.');
  }
}

const fauna=new OceanFauna(recipe);
for(const depth of [200,600,1000,1419]){
  const pose=transectPose(depth,recipe);
  fauna.update(10,new THREE.Vector3(...pose.eye));
  check(fauna.nearbySpecies.length>=3,'At '+depth+' m, multiple distinct forms must actually be close to the route.');
  check(fauna.pools.every(p=>p.mesh.instanceMatrix.array.every(Number.isFinite)),'Visible instancing matrices must be finite.');
}
fauna.update(37,new THREE.Vector3(0,-600,-724));
const held=JSON.stringify(fauna.poses);
fauna.update(37,new THREE.Vector3(0,-600,-724));
check(JSON.stringify(fauna.poses)===held,'The same clock and camera give the same world.');
fauna.update(37,new THREE.Vector3(400,-30,120));
check(JSON.stringify(fauna.poses)===held,'A paused simulation must not move animals.');
// Fast animals must actually be fast and slow animals slow, by an order of
// magnitude where the body plans differ.
check(RHYTHMS.tuna[0]>RHYTHMS.anglerfish[0]*5,'Cruisers must outrun ambush hunters, not merely edge them.');
check(RHYTHMS.megalodon[0]>RHYTHMS.trilobite[0]*10,'Apex hunters must outrun bottom dwellers tenfold.');
check(RHYTHMS.ichthyosaur[0]>RHYTHMS.ammonite[0]*5,'Mesozoic cruisers must outrun its drifters.');
check(RHYTHMS.dolphin[0]>RHYTHMS.seal[0],'Dolphins must outrun seals.');
// The predation loop on a packed micro-population: hunters must make real
// kills quickly, every slot must be conserved, and poses stay finite.
{
  const pack=[];
  for(let i=0;i<12;i++)pack.push({id:i,type:i<2?'reefshark':'shrimp',x:i<2?0:1.4+(i%5)*.4,y:-20,z:(i%5)*.5,
    phase:0,cohort:0,school:0,behavior:i<2?'cruise':'jet',maxSpeed:i<2?2.0:.32,beat:2,radius:.3,turnRate:2.1,
    personalSpace:.3,scale:i<2?.55:.066,variant:0,heading:0,speed:1,orbit:.45,
    anchorX:0,anchorY:-20,anchorZ:0,hunter:i<2,pursuer:i<2,benthic:false});
  const still=(a,t,out)=>Object.assign(out,{x:a.x,y:a.y,z:a.z,vx:0,vy:0,vz:0,heading:0,pitch:0,roll:0,stroke:t,effort:.5,alarm:0,feeding:0,turn:0,speed:0});
  const motion=new AnimalMotion(pack,still,{floor:()=>-30,rocks:[],perception:8});
  let kills=0;const wasGrabbed=new Set();
  for(let t=0;t<120;t+=1/30){
    motion.advance(t,{});
    for(let i=0;i<pack.length;i++){
      const m=motion.pred[i].mode;
      if(m===1&&!wasGrabbed.has(i)){wasGrabbed.add(i);kills++;}
      if(m!==0)check(Number.isFinite(motion.poses[i].x),'Grabbed and eaten animals keep finite poses.');
    }
  }
  check(kills>=1,'Packed hunters must make real kills, not only chase.');
  check(pack.length===12&&motion.pred.length===12,'Predation conserves every population slot.');
  check(motion.pred.every(p=>p.mode===0||p.mode===1||p.mode===2),'Predation states stay in range.');
}
// GPU shoal bulk per era: tens of thousands of fish, none before fins.
for(const era of ERA_IDS){
  const total=shoalLayoutForEra(era,713).reduce((a,s)=>a+s.count,0);
  if(era==='precambrian')check(total===0,'Precambrian seas swim nothing.');
  else check(total>20000,era+': bait-ball bulk must number in the tens of thousands.');
}
// Fast animals must actually be fast and slow animals slow, by an order of
// magnitude where the body plans differ.
check(RHYTHMS.tuna[0]>RHYTHMS.anglerfish[0]*5,'Cruisers must outrun ambush hunters, not merely edge them.');
check(RHYTHMS.megalodon[0]>RHYTHMS.trilobite[0]*10,'Apex hunters must outrun bottom dwellers tenfold.');
check(RHYTHMS.ichthyosaur[0]>RHYTHMS.ammonite[0]*5,'Mesozoic cruisers must outrun its drifters.');
check(RHYTHMS.dolphin[0]>RHYTHMS.seal[0],'Dolphins must outrun seals.');
// The predation loop on a packed micro-population: a hunter must make a
// real kill quickly, every slot must be conserved, and victims must come
// back at their anchors. Poses stay finite throughout.
{
  const pack=[];
  for(let i=0;i<12;i++)pack.push({id:i,type:i<2?'reefshark':'shrimp',x:i<2?0:1.4+(i%5)*.4,y:-20,z:(i%5)*.5,
    phase:0,cohort:0,school:0,behavior:i<2?'cruise':'jet',maxSpeed:i<2?2.0:.32,beat:2,radius:.3,turnRate:2.1,
    personalSpace:.3,scale:i<2?.55:.066,variant:0,heading:0,speed:1,orbit:.45,
    anchorX:0,anchorY:-20,anchorZ:0,hunter:i<2,pursuer:i<2,benthic:false});
  const still=(a,t,out)=>Object.assign(out,{x:a.x,y:a.y,z:a.z,vx:0,vy:0,vz:0,heading:0,pitch:0,roll:0,stroke:t,effort:.5,alarm:0,feeding:0,turn:0,speed:0});
  const motion=new AnimalMotion(pack,still,{floor:()=>-30,rocks:[],perception:8});
  let kills=0,wasGrabbed=new Set();
  for(let t=0;t<120;t+=1/30){
    motion.advance(t,{});
    for(let i=0;i<pack.length;i++){
      const m=motion.pred[i].mode;
      if(m===1&&!wasGrabbed.has(i)){wasGrabbed.add(i);kills++;}
      if(m!==0)check(Number.isFinite(motion.poses[i].x),'Grabbed and eaten animals keep finite poses.');
    }
  }
  check(kills>=1,'Packed hunters must make real kills, not only chase.');
  check(pack.length===12&&motion.pred.length===12,'Predation conserves every population slot.');
  check(motion.pred.every(p=>p.mode===0||p.mode===1||p.mode===2),'Predation states stay in range.');
}
// GPU shoal bulk per era: tens of thousands of fish, none before fins.
for(const era of ERA_IDS){
  const total=shoalLayoutForEra(era,713).reduce((a,s)=>a+s.count,0);
  if(era==='precambrian')check(total===0,'Precambrian seas swim nothing.');
  else check(total>20000,era+': bait-ball bulk must number in the tens of thousands.');
}
const pelagic=createPelagicLife(recipe),emptyGel=createPelagicLife({...recipe,jellies:0});
const denseGel=createPelagicLife({...recipe,jellies:2});
check(pelagic.count<fauna.count*.05,'Default gelatinous life must be a small fraction of the new animal population.');
check(emptyGel.count===0&&emptyGel.group.children.length===1,'Zero jellies removes both bells and siphonophore chains.');
check(denseGel.chainCount>pelagic.chainCount&&denseGel.jellyCount>pelagic.jellyCount,'The drifter dial must scale both chains and jellyfish.');
check(pelagic.count>pelagic.jellyCount,'The displayed population must include siphonophore colonies.');
for(const root of [fauna.group,pelagic.group,emptyGel.group,denseGel.group])root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
console.log(checks+' fauna checks passed: anatomy, seeded populations, depth communities, controls, clearance, continuity and pause.');
