/* Town Hall — where the nation is ruled day to day.
 * Three chambers: CITIZENS (petitions from your people, ruled like Issues),
 * CABINET (your ministers: advice, loyalty, dismissals), WORLD (demarches
 * from AI nations: questions, warnings, trade, aid, TRUCES while at war, and
 * even offers to resign their nation into your control). Every ruling has
 * consequences — bank, freedoms, population, affinity, wars, the map. */
"use strict";
function pets(){if(!S)return[];if(!S.petitions)S.petitions=[];return S.petitions;}
function dems(){if(!S)return[];if(!S.demarches)S.demarches=[];return S.demarches;}
function cab(){if(!S)return[];if(!S.cabinet||!S.cabinet.length)S.cabinet=seedCabinet();return S.cabinet;}
function thCounts(){let a=0;try{a=cab().filter(m=>m.loyalty<25).length;}catch(e){}return{p:pets().length,d:dems().length,a};}
const CF=["Amara","Tomas","Priya","Yuki","Omar","Nadia","Piotr","Aisha","Carlos","Mei","Jonas","Fatima","Ravi","Elena","Kwame","Sofia","Henrik","Zainab","Marco","Anya","Felix","Lena","Dmitri","Tariq"];
const CL=["Okafor","Novak","Haddad","Tanaka","Silva","Khan","Meyer","Rossi","Diallo","Costa","Weber","Ali","Bakker","Larsen","Moreau","Petrov","Garcia","Ndiaye","Kowalski","Adeyemi","Virtanen","Lindqvist","Barbosa","Kante"];
const CROLES=["teacher","nurse","merchant","veteran","student","farmer","engineer","priest","fisher","journalist","pensioner","artisan"];
function citizen(){return CF[rnd(0,CF.length-1)]+" "+CL[rnd(0,CL.length-1)];}
function applyFx(fx){if(!fx||!S)return;S.civil+=(fx.c||0);S.econ+=(fx.e||0);S.pol+=(fx.p||0);["civil","econ","pol"].forEach(k=>S[k]=Math.max(2,Math.min(98,S[k])));if(fx.pop)S.pop=Math.max(1e6,S.pop+fx.pop*1e6);if(fx.bank)S.bank=Math.max(0,Math.round((S.bank+fx.bank)*100)/100);}
/* ---------- citizens' petitions (ruled like Issues) ---------- */
const PETITIONS=[
 {id:"clinic",title:"A Clinic for the East Ward",role:"nurse",text:"Our ward has one doctor for 9,000 souls. Fund a clinic and we will name the maternity wing after you.",opts:[{t:"Fund the clinic (bank −1.5)",fx:{c:4,pop:2,bank:-1.5},out:"The clinic opens to cheering crowds. Infant mortality falls within a year."},{t:"Hold a charity drive instead (bank +0.5)",fx:{c:1,bank:0.5},out:"Bake sales raise half a scanner. Better than nothing."},{t:"Decline — coffers are closed",fx:{c:-3},out:"The ward remembers. So do the pamphleteers."}]},
 {id:"taxcut",title:"Merchants Demand Lower Duties",role:"merchant",text:"Duties strangle our stalls. Cut them and watch the markets bloom.",opts:[{t:"Cut duties (bank −1)",fx:{e:5,c:2,bank:-1},out:"Stalls multiply; the treasury winces, then recovers."},{t:"Raise duties for services instead",fx:{e:-3,c:3,pop:1},out:"Merchants grumble; schools get new roofs."},{t:"Keep duties as they are",fx:{},out:"The market hums on, unchanged."}]},
 {id:"festival",title:"A Street Festival of Lights",role:"student",text:"One night of music and lanterns! The youth will love you forever (or at least a semester).",opts:[{t:"Fund it (bank −1)",fx:{c:5,p:2,bank:-1},out:"Lanterns rise; even the police dance a little."},{t:"Permit it with a curfew (bank +0.5)",fx:{c:2,bank:0.5},out:"Fun, but home by ten."},{t:"Ban the noise",fx:{c:-4},out:"The silence is deafening. Posters appear overnight."}]},
 {id:"strike",title:"Mill Workers Down Tools",role:"engineer",text:"The mills are silent. Wages or nothing — the union votes at dawn.",opts:[{t:"Meet the wage demand",fx:{e:-4,c:4},out:"Whistles blow; looms sing again."},{t:"Break the strike",fx:{c:-6,p:-3,e:2},out:"The mills run, but the songs stop."},{t:"Mediate a compromise",fx:{c:1,e:-1},out:"Nobody cheers, nobody starves. Governance."}]},
 {id:"veterans",title:"A Parade for the Veterans",role:"veteran",text:"We marched for you. Now let us march once more — or fund our pensions instead.",opts:[{t:"Grand parade (bank −0.5)",fx:{c:2,bank:-0.5},out:"Medals gleam; old songs echo."},{t:"Pensions over parades (bank −1)",fx:{c:3,pop:1,bank:-1},out:"Warm homes beat cold statues."},{t:"Decline both",fx:{c:-2},out:"The legion hall goes quiet."}]},
 {id:"bookban",title:"Ban 'The Salt Meridian'?",role:"priest",text:"This novel corrupts our youth! Ban it before the rot spreads.",opts:[{t:"Ban the book",fx:{c:-5,p:-3},out:"Bonfires. Bestseller lists abroad."},{t:"Defend the press",fx:{c:5,p:4},out:"Print runs triple. Authors toast you."},{t:"Restrict it to adults",fx:{c:1},out:"A compromise nobody frames."}]},
 {id:"roads",title:"The Pothole Rebellion",role:"engineer",text:"Axles break daily on Mill Road. Pave it, or the carters march.",opts:[{t:"Pave the roads (bank −1)",fx:{e:3,c:2,bank:-1},out:"Smooth asphalt, smoother tempers."},{t:"Patch only",fx:{e:1},out:"The worst craters become ponds."},{t:"Ignore it",fx:{e:-2,c:-1},out:"A cart loses a wheel in front of your motorcade."}]},
 {id:"forest",title:"Whisperwood Logging Rights",role:"farmer",text:"The timber company offers jobs; the druids offer curses. Choose.",opts:[{t:"Grant logging rights",fx:{e:4,c:-3},out:"Paychecks rustle louder than leaves."},{t:"Protect the wood",fx:{c:3,e:-2},out:"Owls 1, Saws 0."},{t:"State selective logging",fx:{e:1},out:"Tidy stumps, tidy books."}]},
 {id:"bazaar",title:"A Night Bazaar by the Harbor",role:"merchant",text:"Lanterns, spices, coin until midnight — license us!",opts:[{t:"License it (bank +0.5)",fx:{e:3,c:2,bank:0.5},out:"The harbor glitters; customs glitters more."},{t:"Restrict the hours",fx:{e:-1},out:"Half the magic, all of the sleep."},{t:"Refuse",fx:{c:-2},out:"Spices stay in their sacks."}]},
 {id:"textbooks",title:"Textbooks Are Rotting",role:"teacher",text:"Our primers predate the harbor. New books, please — or tablets?",opts:[{t:"New textbooks (bank −1)",fx:{c:4,p:1,bank:-1},out:"Children smell fresh ink. Test scores stir."},{t:"Tablets on credit (bank −2)",fx:{e:2,c:3,bank:-2},out:"The future loads… slowly. The debt loads fast."},{t:"Make do",fx:{c:-3},out:"Chapter 12 still ends mid-sentence."}]},
 {id:"draft",title:"The General Wants Conscripts",role:"veteran",text:"A year of service for every youth! The General stamps his foot.",opts:[{t:"Order the draft",fx:{p:-4,c:-3},out:"Barracks fill; campuses empty."},{t:"Volunteer bonuses (bank −1)",fx:{c:2,bank:-1},out:"A smaller, prouder force."},{t:"Refuse outright",fx:{c:2,p:2},out:"The General resigns to his memoirs."}]},
 {id:"stadium",title:"A Stadium for United Harbor!",role:"artisan",text:"40,000 seats! The cup is coming home (probably)! Back us!",opts:[{t:"Build it (bank −2)",fx:{c:4,bank:-2},out:"Roars echo for miles. So do the debts."},{t:"Renovate the park instead (bank −0.5)",fx:{c:2,bank:-0.5},out:"Ducks 1, Ultras 0."},{t:"Laugh it off",fx:{c:-1},out:"The chant follows you for weeks."}]}];
function mkPetition(){const pending=pets().map(p=>p.pid);const pool=PETITIONS.filter(t=>!pending.includes(t.id));if(!pool.length)return null;
 const t=pool[rnd(0,pool.length-1)];return{pid:t.id,title:t.title,from:citizen(),role:t.role,text:t.text,opts:t.opts,at:Date.now()};}
window.answerPetition=(pid,oi)=>{const q=pets().find(p=>p.pid===pid);if(!q)return;const t=PETITIONS.find(x=>x.id===pid);const o=q.opts[oi];if(!o)return;
 S.petitions=S.petitions.filter(p=>p.pid!==pid);applyFx(o.fx);S.pop+=0.4e6;S.legislation.unshift(`Petition: ${q.title} → ${o.t}`);S.legislation=S.legislation.slice(0,12);
 pushHapp(`${fullName(S)} ruled on petition “${q.title}”: ${o.t}.`);save();render();};
/* ---------- cabinet ---------- */
const CABPOSTS=[["Defense","Hawk","Dove"],["Treasury","Miser","Spender"],["Foreign Affairs","Dove","Charm"],["Interior","Order","Liberty"],["Health","Carer","Cutter"],["Intelligence","Watcher","Ghost"]];
const CNAMES=["A. Voss","M. Quill","J. Maren","S. Oduya","K. Brandt","L. Ferreira","D. Annan","R. Takeda","E. Sorensen","T. Mbeki","N. Petrova","H. Lindgren"];
function seedCabinet(){return CABPOSTS.map((c,i)=>({post:c[0],name:CNAMES[i%CNAMES.length],trait:Math.random()<0.5?c[1]:c[2],loyalty:rnd(55,80)}));}
function advise(m){const atWar=myWars().some(w=>w.status==="active");const foe=atWar?myWars().find(w=>w.status==="active"):null;
 switch(m.post){
  case"Defense":return atWar?`The ${foe.d===S.name?foe.a:foe.d} front holds. Strike their weakest property cluster, Commander — and mind the day cap.`:`Readiness ${milStats?milStats().power:"?"}. No wars burning. Drill now, bleed never.`;
  case"Treasury":return S.bank<2?`The vault echoes, ${S.bank.toFixed(2)} bank. Win tributes, take deals — war is expensive, peace merely costly.`:`Vault at ${S.bank.toFixed(2)} bank. Spend on clinics and parades, or hoard for war.`;
  case"Foreign Affairs":{const low=[...WORLD.nations].filter(n=>((S.aff&&S.aff[n.name])??50)<30);return low.length?`${low[0].name} grows cold (${S.aff[low[0].name]}). Send envoys, endorse, or brace for a warning.`:`All skies are fairly clear. Court the cold ones before they court trouble.`;}
  case"Interior":return S.civil<30?`The streets mutter. Civil freedoms at ${S.civil} — ease the grip or staff the barricades.`:`${S.issues.length} issues pending, freedoms steady. The town hall hums.`;
  case"Health":return `Growth holds at ${fmtPop(S.pop)}. Clinics in the east ward would add thousands.`;
  default:return atWar?`Enemy codes half-broken. Their HQ is where the flags cluster.`:`Ears everywhere, Commander. Nothing moves without us hearing it.`;}}
window.consultMin=post=>{SUB.consult=SUB.consult===post?null:post;save();render();};
window.dismissMin=post=>{const m=cab().find(x=>x.post===post);if(!m||!confirm(`Dismiss ${m.name}, Minister of ${post}? (-0.5 bank severance, others lose faith)`))return;
 S.bank=Math.max(0,S.bank-0.5);S.cabinet=S.cabinet.filter(x=>x.post!==post);S.cabinet.forEach(x=>x.loyalty=Math.max(0,x.loyalty-5));
 const c=CABPOSTS.find(c=>c[0]===post);S.cabinet.push({post,name:CNAMES[rnd(0,CNAMES.length-1)],trait:c[rnd(1,2)],loyalty:60});
 pushHapp(`${fullName(S)} dismissed the Minister of ${post}.`);SUB.consult=null;save();render();};
window.promiseMin=post=>{const m=cab().find(x=>x.post===post);if(!m||S.bank<1.5)return alert("Needs 1.5 bank.");S.bank=Math.round((S.bank-1.5)*100)/100;m.loyalty=Math.min(100,m.loyalty+22);pushHapp(`${m.name} stays, promised new offices.`);save();render();};
/* ---------- world demarches ---------- */
function pickDemarcher(pred){const c=WORLD.nations.filter(n=>!pred||pred(n));if(!c.length)return null;return c[rnd(0,c.length-1)];}
function affOf(n){if(!S.aff)S.aff={};return S.aff[n.name]??50;}
function mkDemarche(force){const list=dems();if(list.length>=4)return null;
 const atWarWith=n=>wars().some(w=>w.status==="active"&&(w.a===n||w.d===n)&&(w.a===S.name||w.d===S.name));
 const myWar=wars().find(w=>w.status==="active"&&(w.a===S.name||w.d===S.name));
 const roll=force||Math.random();let d=null;
 if(myWar&&Math.random()<0.45){const foe=myWar.a===S.name?myWar.d:myWar.a;const fn=WORLD.nations.find(n=>n.name===foe);if(fn)d=mkTruce(fn,myWar);}
 if(!d&&roll<0.22){const r=pickDemarcher(n=>affOf(n)>68&&n.pop<20e6&&!wars().some(w=>w.status==="active"&&(w.a===n.name||w.d===n.name))&&n.name!==S.name);if(r)d=mkAnnex(r);}
 if(!d&&roll<0.42){const r=pickDemarcher(n=>affOf(n)>=30&&affOf(n)<=62);if(r)d=Math.random()<0.5?mkWarnMil(r):mkWarnGreen(r);}
 if(!d&&roll<0.60){const r=pickDemarcher(n=>n.wa===S.wa);if(r)d=mkQuestion(r);}
 if(!d&&roll<0.76){const r=pickDemarcher(n=>n.pop<40e6&&n.name!==S.name);if(r)d=mkAid(r);}
 if(!d){const r=pickDemarcher(n=>n.wa&&n.name!==S.name&&!S.endoGiven.includes(n.name));if(r)d=mkTrade(r);}
 if(!d)return null;d.at=Date.now();d.did="dm"+Date.now()+rnd(0,9999);return d;}
function voiceWrap(n,text){try{return(typeof speak==="function"?speak(n,text):text);}catch(e){return text;}}
function mkTruce(fn,war){const t=typeof leaderTitle==="function"?leaderTitle(fn):"Leader";return{type:"truce",from:fn.name,iso:fn.iso,title:`White Peace from ${fn.name}`,text:voiceWrap(fn,`The ${t} of ${fn.name} sues for peace in our ${war.goal==="land"?"border war":"war"}. Sign a white peace: borders freeze, prisoners walk home, the guns cool. Refuse, and the war burns on. Dismissing this message also refuses.`) ,opts:[{t:"Sign the white peace",fx:{},out:"signed"},{t:"Refuse — finish it on the field",fx:{},out:"refused"}]};}
function mkAnnex(r){const t=typeof leaderTitle==="function"?leaderTitle(r):"Leader";return{type:"annex",from:r.name,iso:r.iso,title:`${r.name} Offers Its Crown`,text:voiceWrap(r,`The ${t} of ${r.name} writes, by hand: our ${fmtPop(r.pop)} souls admire your rule. Take our nation under your wing — our flag lowered with honor, not fear. Accept, and ${r.name} joins you forever. Refuse gently, and we remain friends.`),opts:[{t:`Accept the crown of ${r.name}`,fx:{},out:"accepted"},{t:"Decline with honors",fx:{},out:"declined"}]};}
function mkWarnMil(r){const t=typeof leaderTitle==="function"?leaderTitle(r):"Leader";return{type:"warnmil",from:r.name,iso:r.iso,title:`${r.name} Warns You: Stand Down`,text:voiceWrap(r,`The ${t} of ${r.name} warns that your drills, parades and battle-fleets frighten the region. Disarm visibly (bank −2, economy −2) or face a united chill.`),opts:[{t:"Disarm visibly (bank −2)",fx:{e:-2,bank:-2},out:"disarm"},{t:"Reject the warning (they'll remember)",fx:{bank:1},out:"defy"}]};}
function mkWarnGreen(r){const t=typeof leaderTitle==="function"?leaderTitle(r):"Leader";return{type:"warngreen",from:r.name,iso:r.iso,title:`${r.name} Warns You: The Air Burns`,text:voiceWrap(r,`The ${t} of ${r.name} warns your mills blacken shared skies. Go green (economy −3) or be named at the Assembly.`),opts:[{t:"Go green (economy −3)",fx:{e:-3,c:2},out:"green"},{t:"Burn on regardless",fx:{c:-1},out:"smoke"}]};}
function mkQuestion(r){const q=S.wa?`where will you vote on ${WORLD.wa.ga.title}?`:(S.legislation[0]?`what “${S.legislation[0].slice(0,60)}” means for the region?`:`what kind of nation you intend to be?`);const t=typeof leaderTitle==="function"?leaderTitle(r):"Leader";return{type:"question",from:r.name,iso:r.iso,title:`${r.name} Asks a Question`,text:voiceWrap(r,`The ${t} of ${r.name} asks, plainly, ${q} Answer straight and ties warm; dodge, and they note it.`),opts:[{t:"Answer straight and warmly",fx:{},out:"warm"},{t:"Dodge with ceremony",fx:{},out:"dodge"}]};}
function mkAid(r){return{type:"aid",from:r.name,iso:r.iso,title:`${r.name} Begs Disaster Aid`,text:voiceWrap(r,`Floods drown the ${r.capital||"capital"} valley. ${r.name} begs 1.5 bank for pumps and bread. The world watches your mercy.`),opts:[{t:"Send 1.5 bank in aid",fx:{bank:-1.5},out:"aided",need:1.5},{t:"Refuse — our vault is sacred",fx:{},out:"refused"}]};}
function mkTrade(r){return{type:"trade",from:r.name,iso:r.iso,title:`${r.name} Proposes a Compact`,text:voiceWrap(r,`${r.name} proposes friendship with teeth: endorse us openly and +1 bank flows to your vault with our thanks. Our heralds await.`),opts:[{t:"Endorse them (+1 bank)",fx:{bank:1},out:"deal"},{t:"Decline politely",fx:{},out:"nodeal"}]};}
function endWarPeace(w){w.status="done";w.settle=`${w.a} vs ${w.d} — white peace signed (day ${w.day}).`;pushHapp(`🕊️ White peace: ${w.a} vs ${w.d}.`);feedAdd(S.name,`🕊️ We have signed a white peace. The guns cool; the maps stay as they are.`);if(SUB.battle&&SUB.battle.warId===w.id){SUB.battle.over={res:"truce",how:"Truce signed mid-battle.",detail:"White peace — both armies stand down."};VIEW="war";}}
window.answerDemarche=(did,oi)=>{const q=dems().find(d=>d.did===did);if(!q)return;const o=q.opts[oi];if(!o)return;if(o.need&&S.bank<o.need)return alert("The vault cannot cover it.");
 S.demarches=S.demarches.filter(d=>d.did!==did);const r=WORLD.nations.find(n=>n.name===q.from);applyFx(o.fx);
 const say=(x)=>{pushHapp(x);};
 if(q.type==="truce"){const w=wars().find(w=>w.status==="active"&&((w.a===S.name&&w.d===q.from)||(w.d===S.name&&w.a===q.from)));
  if(o.out==="signed"&&w){bumpAffinity(q.from,15);S.aff[q.from]=45;endWarPeace(w);say(`${fullName(S)} signed a white peace with ${q.from}.`);}
  else if(r){bumpAffinity(q.from,-8);say(`${fullName(S)} refused ${q.from}'s truce — the war burns on.`);}}
 else if(q.type==="annex"){
  if(o.out==="accepted"&&r){const g=Math.round(r.pop*0.6);S.pop+=g;S.bank+=3;eliminateNation(r.name,S.name);WORLD.nations.forEach(n=>{if(n.name!==S.name)bumpAffinity(n.name,-3);});
   wars().filter(w=>w.status==="active"&&(w.a===q.from||w.d===q.from)).forEach(w=>{w.status="done";w.settle=`${w.a} vs ${w.d} — dissolved by annexation.`;});
   const paper=WORLD.papers.find(p=>p.region===S.region);if(paper){paper.articles.unshift(`${q.from} joins ${S.name} by royal marriage of state`);paper.ed++;}
   say(`${q.from} lowered its flag into ${fullName(S)}'s hands. +${fmtPop(g)} souls.`);feedAdd(S.name,`👑 Today ${q.from} joins us — by invitation, not invasion. One people, one harbor.`, "post", {kind:"clip",clip:"parade"});}
  else if(r){bumpAffinity(q.from,4);say(`${fullName(S)} declined ${q.from}'s crown with honors.`);}}
 else if(q.type==="warnmil"){
  if(o.out==="disarm"&&r){bumpAffinity(q.from,8);WORLD.nations.forEach(n=>bumpAffinity(n.name,1));say(`${fullName(S)} disarmed before ${q.from}. The region exhales.`);}
  else if(r){bumpAffinity(q.from,-12);WORLD.wa.log.unshift({t:Date.now(),x:`${q.from} condemned ${fullName(S)}'s militarism.`});say(`${fullName(S)} defied ${q.from}'s warning.`);}}
 else if(q.type==="warngreen"){
  if(o.out==="green"&&r){bumpAffinity(q.from,8);say(`${fullName(S)} went green for ${q.from}.`);}
  else if(r){bumpAffinity(q.from,-10);say(`${fullName(S)} burns on despite ${q.from}.`);}}
 else if(q.type==="question"){
  if(o.out==="warm"&&r){bumpAffinity(q.from,6);if(S.wa){const w=WORLD.wa.ga;if(Math.random()<0.5)w.for+=25;else w.against+=25;}say(`${fullName(S)} answered ${q.from} warmly.`);}
  else if(r){bumpAffinity(q.from,-3);say(`${fullName(S)} dodged ${q.from}'s question.`);}}
 else if(q.type==="aid"){
  if(o.out==="aided"&&r){bumpAffinity(q.from,12);feedAdd(r,`${S.name}'s grain ships dot our horizon. Mercy, remembered.`, "post", {kind:"flag"});say(`${fullName(S)} sent aid to ${q.from}.`);}
  else if(r){bumpAffinity(q.from,-6);say(`${fullName(S)} refused ${q.from} aid.`);}}
 else if(q.type==="trade"){
  if(o.out==="deal"&&r){if(!S.endoGiven.includes(r.name)){S.endoGiven.push(r.name);r.endo++;}bumpAffinity(q.from,10);feedAdd(r,`${S.name} endorses us openly. The compact holds!`);say(`${fullName(S)} sealed a compact with ${q.from}.`);}
  else if(r){bumpAffinity(q.from,-3);say(`${fullName(S)} declined ${q.from}'s compact.`);}}
 save();render();};
/* ---------- arrivals + drift ---------- */
window.__townTick=function(){if(!S||!WORLD)return;cab();
 if(pets().length<4&&(!S.lastPet||Date.now()-S.lastPet>30000)&&Math.random()<0.10){const p=mkPetition();if(p){pets().unshift(p);S.lastPet=Date.now();toast(`📜 New petition: “${p.title}”`);}}
 if(dems().length<4&&(!S.lastDem||Date.now()-S.lastDem>45000)&&Math.random()<0.09){const d=mkDemarche();if(d){dems().unshift(d);S.lastDem=Date.now();const r=WORLD.nations.find(n=>n.name===d.from);toast(`${d.type==="truce"?"🕊️":d.type==="annex"?"👑":"✉️"} ${d.from}: ${d.title}`);}}
 for(const m of S.cabinet){const atWar=myWars().some(w=>w.status==="active");
  let drift=60-m.loyalty;drift*=0.02;
  if(m.post==="Defense")drift+=atWar?0.5:-0.3;if(m.post==="Treasury")drift+=S.bank>4?0.3:-0.3;if(m.post==="Foreign Affairs"&&atWar)drift-=0.4;
  m.loyalty=Math.max(0,Math.min(100,m.loyalty+drift+(Math.random()-0.5)*1.2));
  if(m.loyalty<25&&!m.warned){m.warned=true;toast(`⚠️ ${m.name} threatens to resign!`);}
  if(m.loyalty>=25)m.warned=false;}};
/* ---------- Town Hall view ---------- */
function vTownhall(m){if(!S){m.innerHTML=`<div class="card"><h2>🏛️ Town Hall</h2><p>Create a nation to rule it.</p><button class="btn primary" onclick="go('create')">Create a Nation</button></div>`;return;}
 const t=SUB.thall||"citizens";const c=thCounts();
 m.innerHTML=`<div class="card"><h2>🏛️ Town Hall — ${esc(fullName(S))}</h2><div class="kv">Petitions from your people, counsel from your cabinet, demarches from the world — ruled like Issues, with consequences. Pending: <b>${c.p} petitions</b> • <b>${c.d} world</b>${c.a?` • <b style="color:#ff5252">${c.a} ministers restless</b>`:""}</div>
 <div class="tabs"><button class="${t==="citizens"?"active":""}" onclick="SUB.thall='citizens';save();render();">🧑‍🌾 Citizens (${c.p})</button><button class="${t==="cabinet"?"active":""}" onclick="SUB.thall='cabinet';save();render();">💼 Cabinet${c.a?" ⚠️":""}</button><button class="${t==="world"?"active":""}" onclick="SUB.thall='world';save();render();">🌍 World (${c.d})</button></div></div>`+
 (t==="citizens"?vTHCitizens():t==="cabinet"?vTHCabinet():vTHWorld());}
function vTHCitizens(){const list=pets();if(!list.length)return `<div class="card"><h3>No petitions pending</h3><p class="kv">Your people are content — for now. New petitions arrive as you rule.</p></div>`;
 return list.map(q=>{const role=q.role||"citizen";return `<div class="issue"><h3>📜 ${esc(q.title)}</h3><p><i>${esc(q.from)}, ${esc(role)}</i> — ${esc(q.text)}</p><div class="opts">${q.opts.map((o,i)=>`<label><input type="radio" name="${q.pid}" onclick="answerPetition('${q.pid}',${i})"> <b>${esc(o.t)}</b></label>`).join("")}</div></div>`;}).join("");}
function vTHCabinet(){return cab().map(x=>`<div class="card"><h3>💼 ${esc(x.post)} — ${esc(x.name)} <span class="kv">(${esc(x.trait)})</span></h3>
 <div class="kv">Loyalty: <b>${Math.round(x.loyalty)}</b>${x.loyalty<25?' <b style="color:#ff5252">— THREATENS RESIGNATION</b>':""}</div><div class="meter"><i style="width:${x.loyalty}%"></i></div>
 ${SUB.consult===x.post?`<div class="notice">🗣️ “${esc(advise(x))}”</div>`:""}
 <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn small" onclick="consultMin('${esc(x.post)}')">Consult</button>${x.loyalty<25?`<button class="btn small primary" onclick="promiseMin('${esc(x.post)}')">Promise offices (1.5)</button>`:""}<button class="btn small danger" onclick="dismissMin('${esc(x.post)}')">Dismiss</button></div></div>`).join("");}
function vTHWorld(){const list=dems();if(!list.length)return `<div class="card"><h3>Quiet on the diplomatic front</h3><p class="kv">No demarches pending. Nations write when your deeds — or their needs — demand it. Wars bring truces; friendship brings crowns.</p></div>`;
 return list.map(q=>{const type={truce:"🕊️ TRUCE",annex:"👑 ANNEXATION",warnmil:"⚠️ WARNING",warngreen:"⚠️ WARNING",question:"❓ QUESTION",aid:"🆘 AID PLEA",trade:"🤝 COMPACT"}[q.type]||"✉️";
 return `<div class="issue"><h3>${type} — ${esc(q.title)}</h3><p><i>From ${esc(q.from)}</i> — ${esc(q.text)}</p><div class="opts">${q.opts.map((o,i)=>`<label><input type="radio" ${(o.need&&S.bank<o.need)?"disabled":""} onclick="answerDemarche('${q.did}',${i})"> <b>${esc(o.t)}</b></label>`).join("")}</div></div>`;}).join("");}
