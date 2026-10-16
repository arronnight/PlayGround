/* War Room — militia command, declarations of war, world map & turn-based battles.
 * War goals: political takeover / total takeover / land grab / all three.
 * Battles: turn-based tactics — move & act with every unit each turn, terrain
 * costs + cover, 100 HP units, counterattacks, property income, infantry
 * capture, factories/airports/ports build, fuel & ammo + APC/city resupply,
 * Commanding Officers with passive boosts and charged CO Powers.
 * Win by rout, HQ capture, or goal objectives. AI militias scale from real
 * national power; AI nations declare and fight their own wars live. */
"use strict";

/* ---------- Military power (real national influence & strength) ---------- */
const POWER={"United States":100,"China":96,"Russia":94,"India":80,"United Kingdom":76,"France":75,"Japan":73,"South Korea":71,"Pakistan":69,"Turkey":67,"Italy":65,"Egypt":64,"Brazil":63,"Indonesia":61,"Iran":61,"Spain":60,"Australia":58,"Saudi Arabia":57,"Germany":56,"Israel":56,"Poland":55,"Ukraine":55,"Canada":53,"Vietnam":53,"Mexico":52,"Nigeria":52,"Argentina":50,"Greece":50,"Netherlands":50,"Iraq":50,"South Africa":54,"Sweden":49,"Colombia":48,"Thailand":48,"Morocco":47,"Philippines":47,"Kenya":46,"Kazakhstan":46,"Ethiopia":48,"Chile":45,"Peru":44,"New Zealand":44,"Ghana":42,"Qatar":42,"Senegal":38};
/* Hand-tuned power for notable militaries outside the core table; everyone else scales from population. */
const POW2={RUS:94,TWN:62,PRK:58,DZA:52,ARE:50,BLR:50,ROU:48,SDN:44,TUN:44,LBY:44,HUN:44,CZE:44,AUT:42,CHE:42,CUB:42,JOR:42,OMN:44,KWT:44,DNK:44,NOR:46,FIN:46,BGD:44,MMR:48,VEN:46,AGO:42,SYR:46,AFG:40,AZE:44,HRV:40,SRB:44,BEL:44,PRT:40,IRL:38,MYS:46,LKA:40,UZB:42,ECU:38,GTM:36,BOL:36,HND:34,DOM:36,NIC:32,SLV:30,JAM:30,HTI:30,ALB:34,BIH:34,SVN:34,SVK:36,MKD:32,MNE:30,MDA:32,LVA:34,LTU:34,EST:32,ISL:28,LUX:30,MLT:30,CYP:34,TKM:38,KGZ:34,TJK:34,MNG:36,LAO:34,KHM:36,NPL:36,SOM:38,COD:44,CMR:38,CIV:40,BFA:38,MLI:40,NER:36,TCD:38,MOZ:38,ZMB:36,ZWE:34,CRI:30,PAN:32,PRY:34,URY:34,KEN:46};
function basePower(n){if(POWER[n.name]!==undefined)return POWER[n.name];if(n.a3&&POW2[n.a3]!==undefined)return POW2[n.a3];const m=Math.max(0.004,(n.pop||5e6)/1e6);return Math.min(60,Math.max(15,Math.round(20+10*Math.log10(m))));}
function aiPower(n){return Math.min(112,basePower(n)+n.endo*0.3+(n.wa?2:0));}
function playerPower(){if(!S)return 0;return Math.max(15,Math.min(104,22+Math.min(38,S.pop/20e6)+S.econ*0.15+Math.min(10,S.done*0.4)+(S.wa?3:0)+(S.milWon||0)*2-(S.milLost||0)*2));}
function milStats(){const pp=playerPower();return{power:Math.round(pp),personnel:Math.max(8,Math.round(S.pop/400/1000))+"K",budget:Math.round(S.econ*S.tax/8),tech:1+Math.floor(S.done/6),morale:Math.max(20,Math.min(99,62+S.done-(S.milLost||0)*6+(S.milWon||0)*4-myWars().filter(w=>w.status==="active").length*6)),readiness:Math.max(5,Math.min(99,Math.round(pp)))};}
function wars(){if(!WORLD.wars)WORLD.wars=[];return WORLD.wars;}
function warById(id){return wars().find(w=>w.id===id);}
function myWars(){if(!S)return[];return wars().filter(w=>w.a===S.name||w.d===S.name);}
function aiWars(){if(!S)return wars().filter(w=>w.status==="active");return wars().filter(w=>w.status==="active"&&w.a!==S.name&&w.d!==S.name);}
const GOALS={political:{n:"Political takeover",icon:"🏛️",d:"Topple the government. Win by routing the enemy or capturing their HQ. The nation survives under your influence and moves to your region."},total:{n:"Total takeover",icon:"💀",d:"Erase the nation. Win by rout or HQ capture. They vanish from the world; you absorb their people. The world will condemn you."},land:{n:"Land grab",icon:"🗺️",d:"Seize territory. Win by holding 9 properties at once (or rout). Borders shift; populations and treasuries move."},all:{n:"All three",icon:"👑",d:"Take everything: hold 8 properties AND rout the enemy or capture their HQ. Total absorption under your banner."}};
function goalQuota(g){return g==="land"?9:g==="all"?8:0;}
function isAtWarWith(n){return myWars().some(w=>w.status==="active"&&(w.a===n||w.d===n));}

/* ---------- World map: the actual world map, drawn from real boundaries ----------
 * world.geo.json holds real country polygons (id = ISO A3). Game nations are
 * painted over their real territory: region color, brighter = more power,
 * red pulsing = at war, gold star = you. Everything repaints from live state,
 * so conquests, puppets and eliminations redraw the map. */
const A2A3={de:"DEU",fr:"FRA",gb:"GBR",it:"ITA",es:"ESP",pl:"POL",ua:"UKR",nl:"NLD",se:"SWE",gr:"GRC",ng:"NGA",eg:"EGY",za:"ZAF",ke:"KEN",et:"ETH",gh:"GHA",ma:"MAR",sn:"SEN",cn:"CHN",in:"IND",jp:"JPN",au:"AUS",id:"IDN",kr:"KOR",ph:"PHL",th:"THA",vn:"VNM",nz:"NZL",us:"USA",ca:"CAN",br:"BRA",mx:"MEX",ar:"ARG",co:"COL",pe:"PER",cl:"CHL",sa:"SAU",il:"ISR",tr:"TUR",ir:"IRN",iq:"IRQ",pk:"PAK",kz:"KAZ",qa:"QAT"};
const REGION_COLOR={"Europe":"#8e1420","Africa":"#1f6b4a","Asia-Pacific":"#8a1f2d","Americas":"#3f5a6b","Middle East & Central Asia":"#8a6d1f","Founders' Haven":"#5b3a8c"};
function a3Of(n){return ((n&&n.a3)||A2A3[((n&&n.iso)||"").toLowerCase()]||"").toUpperCase();}
function loadGeo(){if(SUB.geo||SUB.geoLoading)return;SUB.geoLoading=true;
 fetch("world.geo.json").then(r=>{if(!r.ok)throw new Error("geo");return r.json();}).then(g=>{SUB.geo=g;SUB.geoLoading=false;buildGeoPaths();if(VIEW==="war"||VIEW==="world")render();}).catch(()=>{SUB.geoLoading=false;});}
function proj(lon,lat){return [((lon+180)/360*1000).toFixed(1),((90-lat)/180*500).toFixed(1)];}
function buildGeoPaths(){if(!SUB.geo||SUB.geoPaths)return;SUB.geoPaths=SUB.geo.features.map(f=>{
 let fid=String(f.id||"").toUpperCase();const fnm=(f.properties&&f.properties.name)||"";
 if(fid==="CS-KM")fid="KSV";else if(fid==="-99")fid=fnm.includes("Cyprus")?"NCY":"SLD";
 const g=f.geometry,polys=g.type==="Polygon"?[g.coordinates]:g.coordinates;let d="",best=null,bestN=0;
 for(const poly of polys)for(const ring of poly){let rd="";for(let i=0;i<ring.length;i++){const p=proj(ring[i][0],ring[i][1]);rd+=(i?"L":"M")+p[0]+" "+p[1];}d+=rd+"Z";if(ring.length>bestN){bestN=ring.length;best=ring;}}
 let cx=500,cy=250;if(best){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const pt of best){if(pt[0]<x0)x0=pt[0];if(pt[0]>x1)x1=pt[0];if(pt[1]<y0)y0=pt[1];if(pt[1]>y1)y1=pt[1];}const c=proj((x0+x1)/2,(y0+y1)/2);cx=+c[0];cy=+c[1];}
 return{id:fid,d,cx,cy};});}
function mapButtons(cardId){return `<span style="float:right"><button class="btn small" onclick="SUB.mapLabels=(SUB.mapLabels||'all')==='all'?'top':'all';save();render();">🏷️ Labels: ${(SUB.mapLabels||"all")==="all"?"All "+WORLD.nations.length:"Top 12"}</button> <button class="btn small primary" onclick="mapFull('${cardId}')">⛶ Fullscreen</button></span>`;}
window.mapFull=id=>{const el=document.getElementById(id);if(!el)return;try{if(document.fullscreenElement)document.exitFullscreen();else if(el.requestFullscreen)el.requestFullscreen();else toast("Fullscreen not supported here.");}catch(e){toast("Fullscreen blocked.");}};
window.toggleLabels=()=>{SUB.mapLabels=(SUB.mapLabels||"all")==="all"?"top":"all";save();render();};
function regionAnchor(region){const pts=(SUB.geoPaths||[]).filter(p=>{const n=WORLD.nations.find(x=>a3Of(x)===p.id&&x.region===region);return !!n;});
 if(!pts.length)return{x:470,y:235};return{x:pts.reduce((a,p)=>a+p.cx,0)/pts.length,y:pts.reduce((a,p)=>a+p.cy,0)/pts.length};}
function worldMapSVG(){if(!SUB.geoPaths){loadGeo();return worldMapFallbackSVG();}
 const byId={};SUB.geoPaths.forEach(p=>byId[p.id]=p);
 const game={};WORLD.nations.forEach(n=>game[a3Of(n)]=n);
 const atWar=n=>wars().some(w=>w.status==="active"&&(w.a===n||w.d===n));
 let s=`<svg viewBox="0 0 1000 500" style="width:100%;background:#0b1e3a;border-radius:8px;border:1px solid #8a7a55" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1000" height="500" fill="#0b1e3a"/>`;
 for(const p of SUB.geoPaths){const n=game[p.id];
  if(!n){s+=`<path d="${p.d}" fill="#24334f" stroke="#5a6a8a" stroke-width="0.4"/>`;continue;}
  const col=REGION_COLOR[n.region]||"#555",pw=aiPower(n),war=atWar(n.name);
  s+=`<g onclick="openNation('${esc(n.name)}')" style="cursor:pointer"><title>${esc(n.name)} — power ${Math.round(pw)} • pop ${fmtPop(n.pop)} • ${esc(n.region)}${war?" • AT WAR":""}</title><path d="${p.d}" fill="${war?"#c1121f":col}" fill-opacity="${war?0.92:(0.45+0.5*pw/112).toFixed(2)}" stroke="${war?"#ff5b3e":"#ffffff"}" stroke-width="${war?1.6:0.6}">${war?'<animate attributeName="stroke-width" values="1.6;3;1.6" dur="1.2s" repeatCount="indefinite"/>':""}</path></g>`;}
 if(S){const a=regionAnchor(S.region);s+=`<g><title>YOU: ${esc(S.name)} — power ${Math.round(playerPower())}</title><text x="${a.x}" y="${a.y}" font-size="20" text-anchor="middle">⭐</text><text x="${a.x}" y="${a.y+16}" font-size="10" font-weight="bold" fill="#ffd75e" text-anchor="middle" stroke="#0e1a3a" stroke-width="3" style="paint-order:stroke">YOU</text></g>`;}
 const labeled=[...WORLD.nations].sort((a,b)=>aiPower(b)-aiPower(a)).slice(0,12).concat(WORLD.nations.filter(n=>atWar(n.name)));
 const showAll=(SUB.mapLabels||"all")==="all";
 const toLabel=showAll?[...WORLD.nations].sort((a,b)=>aiPower(b)-aiPower(a)):labeled;
 const done={};for(const n of toLabel){if(done[n.name])continue;done[n.name]=1;const p=byId[a3Of(n)];if(!p)continue;
  s+=`<text x="${p.cx}" y="${p.cy}" font-size="${showAll?8.5:10}" fill="#fff" text-anchor="middle" stroke="#0e1a3a" stroke-width="3" style="paint-order:stroke;pointer-events:none">${esc(n.name)}${atWar(n.name)?" ⚔️":""}</text>`;}
 for(const w of wars().filter(w=>w.status==="active")){const A=byId[a3Of(WORLD.nations.find(n=>n.name===w.a)||{iso:"xx"})],D=w.d===S?.name?null:byId[a3Of(WORLD.nations.find(n=>n.name===w.d)||{iso:"xx"})];
  const pa=A||regionAnchor(S?.region||"Founders' Haven"),pd=D||(w.d===S?.name?regionAnchor(S.region):{x:500,y:250});
  const ax=pa.cx??pa.x,ay=pa.cy??pa.y,bx=pd.cx??pd.x,by=pd.cy??pd.y;if(![ax,ay,bx,by].every(Number.isFinite))continue;
  s+=`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#ff5b3e" stroke-width="2" stroke-dasharray="7 4"/><text x="${(ax+bx)/2}" y="${(ay+by)/2-6}" font-size="16" text-anchor="middle">⚔️</text>`;}
 return s+"</svg>";}
const ZONES={"Americas":{x:20,y:60,w:200,h:260,c:"#3f5a6b"},"Europe":{x:260,y:40,w:150,h:140,c:"#8e1420"},"Africa":{x:260,y:195,w:150,h:140,c:"#1f6b4a"},"Middle East & Central Asia":{x:430,y:90,w:175,h:150,c:"#8a6d1f"},"Asia-Pacific":{x:625,y:60,w:220,h:260,c:"#8a1f2d"},"Founders' Haven":{x:430,y:260,w:175,h:90,c:"#5b3a8c"}};
function zonePos(region,idx,total){const z=ZONES[region]||ZONES["Founders' Haven"];const cols=Math.max(2,Math.ceil(Math.sqrt(total*1.4)));const r=Math.floor(idx/cols),c=idx%cols;return{x:z.x+20+c*((z.w-40)/Math.max(1,cols-1||1)),y:z.y+46+r*28};}
function worldMapFallbackSVG(){const atWar=n=>wars().some(w=>w.status==="active"&&(w.a===n||w.d===n));
 let s=`<svg viewBox="0 0 870 420" style="width:100%;background:#0e1a3a;border-radius:8px;border:1px solid #8a7a55" xmlns="http://www.w3.org/2000/svg">`;
 for(const [rn,z] of Object.entries(ZONES)){const ms=WORLD.nations.filter(n=>n.region===rn);const pw=ms.reduce((a,n)=>a+aiPower(n),0)+(S&&S.region===rn?playerPower():0);
  s+=`<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="10" fill="${z.c}" opacity="0.85" stroke="#d4a017" stroke-width="1.5"/><text x="${z.x+8}" y="${z.y+15}" font-size="10" fill="#fff" font-weight="bold">${esc(rn)} • ⚔${Math.round(pw)}</text>`;
  const sorted=[...ms].sort((a,b)=>b.pop-a.pop);
  sorted.forEach((n,i)=>{const p=zonePos(rn,i,sorted.length);const r=4+aiPower(n)/11;const war=atWar(n.name);
   s+=`<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${war?"#e02040":z.c}" stroke="${war?"#ff5b3e":"#fff"}" stroke-width="${war?2.5:1}" ${war?'<animate attributeName="r" values="'+r+';'+(r+2)+';'+r+'" dur="1.2s" repeatCount="indefinite"/>':""}><title>${esc(n.name)} — power ${Math.round(aiPower(n))}, pop ${fmtPop(n.pop)}</title></circle>`;
   if(i<1||war)s+=`<text x="${p.x}" y="${p.y-r-3}" font-size="8" fill="#fff" text-anchor="middle">${esc(n.name.split(" ")[0])}</text>`;});}
 if(S){const z=ZONES[S.region]||ZONES["Founders' Haven"];s+=`<circle cx="${z.x+z.w-16}" cy="${z.y+z.h-14}" r="9" fill="#d4a017" stroke="#fff" stroke-width="2"><title>YOU: ${esc(S.name)} — power ${Math.round(playerPower())}</title></circle><text x="${z.x+z.w-16}" y="${z.y+z.h-11}" font-size="8" text-anchor="middle" font-weight="bold">YOU</text>`;}
 for(const w of wars().filter(w=>w.status==="active")){const A=WORLD.nations.find(n=>n.name===w.a),D=WORLD.nations.find(n=>n.name===w.d);const pa=A?(()=>{const l=WORLD.nations.filter(n=>n.region===A.region);return zonePos(A.region,l.indexOf(A),l.length);})():null;const pd=D&&D.name!==S?.name?(()=>{const l=WORLD.nations.filter(n=>n.region===D.region);return zonePos(D.region,l.indexOf(D),l.length);})():null;
  const pe=D&&D.name===S?.name?null:pd;const pA=pa||{x:430,y:300},pD=(D&&(D.name===S?.name)?{x:(ZONES[S.region]||ZONES["Founders' Haven"]).x+40,y:(ZONES[S.region]||ZONES["Founders' Haven"]).y+50}:pe)||{x:500,y:300};
  if(![pA.x,pA.y,pD.x,pD.y].every(v=>typeof v==="number"&&isFinite(v)))continue;
  s+=`<line x1="${pA.x}" y1="${pA.y}" x2="${pD.x}" y2="${pD.y}" stroke="#ff5b3e" stroke-width="2" stroke-dasharray="6 3"/><text x="${(pA.x+pD.x)/2}" y="${(pA.y+pD.y)/2-4}" font-size="14" text-anchor="middle">⚔️</text>`;}
 return s+"</svg>";}

/* ---------- War Room main view ---------- */
function vWar(m){if(SUB.battle)return vBattle(m);if(!S){m.innerHTML=`<div class="card"><h2>⚔️ War Room</h2><p>Command your militia, read the world map, and declare wars with explicit goals. Create a nation to take command.</p><button class="btn primary" onclick="go('create')">Create a Nation</button></div><div class="card" id="warmap-card-v"><h3>🗺️ World map — boundaries & power ${mapButtons("warmap-card-v")}</h3>${worldMapSVG()}<div class="kv">Real borders, painted by region (brighter = stronger militia). Red pulsing = at war. ⚔️ = war front. Click any country to open its dossier.</div></div>`+warListHTML();return;}
 const st=milStats();const myA=myWars().filter(w=>w.status==="active");const aiA=aiWars();
 m.innerHTML=`
 <div class="card warcard"><h2>⚔️ War Room — ${esc(fullName(S))} High Command</h2>
 <div class="wargrid"><div><h3>Your militia</h3><div class="kv">Militia power: <b>${st.power}</b> / 104</div><div class="pwbar"><i style="width:${st.power}%;background:linear-gradient(90deg,#e02040,#ffd75e)"></i></div>
 <div class="kv" style="margin-top:6px">Personnel: <b>${st.personnel} troops</b> (from ${fmtPop(S.pop)} citizens)<br>War budget index: <b>${st.budget}</b> • Tech level: <b>${st.tech}</b> • Morale: <b>${st.morale}</b><br>Campaigns won: <b>${S.milWon||0}</b> • lost: <b>${S.milLost||0}</b> • active: <b>${myA.length}/2</b></div>
 <div class="kv">Power grows with population, economy, issues answered and victories. Militias of AI nations scale from their real-world influence and strength.</div></div>
 <div><h3>Commanders</h3>${COS.map(c=>`<div class="kv" style="margin-bottom:4px"><input type="radio" name="wco" value="${c.id}" ${SUB.warCO===(c.id)||(!SUB.warCO&&c.id==="valor")?"checked":""} onchange="SUB.warCO=this.value"> <b>${c.icon} ${esc(c.name)}</b> — ${esc(c.desc)}<br><span style="color:#7a6a55">Power: ${esc(c.power.name)} — ${esc(c.power.desc)}</span></div>`).join("")}</div></div></div>
 <div class="card" id="warmap-card"><h3>🗺️ World map — boundaries & power (live) ${mapButtons("warmap-card")}</h3>${worldMapSVG()}<div class="kv">Color = region (brighter = stronger) • ⭐ = you • Red pulsing = at war • ⚔️ = war front. Eliminated nations vanish from the map; puppets change color; land grabs shift population.</div></div>
 <div class="card warcard"><h3>📯 Declare war</h3>
 <div class="wargrid"><div><p class="kv">Target nation</p><select class="war" id="w-tgt" onchange="SUB.warTgt=this.value">${WORLD.nations.filter(n=>n.name!==S.name).map(n=>`<option value="${esc(n.name)}" ${SUB.warTgt===n.name?"selected":""}>${esc(n.name)} — power ${Math.round(aiPower(n))} (${esc(n.region)})</option>`).join("")}</select>
 <p class="kv">War goal</p>${Object.entries(GOALS).map(([k,g])=>`<div class="kv"><input type="radio" name="wgoal" value="${k}" ${(SUB.warGoal||"political")===k?"checked":""} onchange="SUB.warGoal=this.value"> <b>${g.icon} ${g.n}</b> — ${g.d}</div>`).join("")}</div>
 <div><h3>Enemy estimate</h3><div id="w-est">${warEstimateHTML()}</div><div style="margin-top:8px"><button class="btn danger" onclick="declareWar()">Declare War ⚔️</button> <button class="btn small" onclick="SUB.warTgt=document.querySelector('#w-tgt').value;render();">Refresh estimate</button></div>
 <div class="kv">War has consequences: the world disapproves (ties cool), treasuries shift, and the map changes. Choose wisely, Commander.</div></div></div></div>
 `+warListHTML();}
function warEstimateHTML(){if(!S)return"";const t=WORLD.nations.find(n=>n.name===(SUB.warTgt||WORLD.nations[0].name))||WORLD.nations[0];const pp=playerPower(),ep=aiPower(t);const ratio=pp/Math.max(1,ep);
 const v=ratio>=1.2?"Favorable — press the attack.":ratio>=0.85?"Even — tactics and your Commander will decide.":ratio>=0.6?"Risky — the enemy is stronger on paper. Defend well, strike smart.":"Suicidal — their militia dwarfs yours. Build power first.";
 return `<div class="kv">${esc(t.name)}: power <b>${Math.round(ep)}</b> • pop ${fmtPop(t.pop)} • endo ${t.endo} • ${esc(t.region)}<br>You: power <b>${Math.round(pp)}</b></div><div class="pwbar"><i style="width:${Math.min(100,ep)}%;background:#6e7683"></i></div><div class="pwbar" style="margin-top:3px"><i style="width:${Math.min(100,pp)}%;background:#e02040"></i></div><div class="notice" style="margin-top:6px">${v}</div><div class="kv">Goal “${GOALS[SUB.warGoal||"political"].n}” wins by: <b>${winText(SUB.warGoal||"political")}</b></div>`;}
function winText(g){return g==="political"?"rout the enemy or capture their HQ":g==="total"?"rout the enemy or capture their HQ (they fall)":g==="land"?"hold 9 properties at once, or rout":g==="all"?"hold 8 properties AND rout or take HQ":"rout";}
function warListHTML(){const myA=myWars().filter(w=>w.status==="active"),aiA=aiWars(),done=wars().filter(w=>w.status==="done").slice(-4).reverse();
 return `<div class="card"><h3>🔥 Active wars (${myA.length+aiA.length})</h3>${myA.map(w=>{const foe=w.a===S?.name?w.d:w.a;const def=w.playerSide==="d";return `<div class="rmb">⚔️ <b>${esc(w.a)}</b> vs <b>${esc(w.d)}</b> <span class="goalbadge">${GOALS[w.goal].icon} ${GOALS[w.goal].n}</span> <span class="kv">day ${w.day} • ${Math.round(w.hpA)}–${Math.round(w.hpB)}</span><br><button class="btn small primary" onclick="enterBattle(${w.id})">${def?"Defend! 🛡️":"Attack! ⚔️"}</button> <button class="btn small" onclick="autoWar(${w.id})">Auto-resolve</button> <span class="kv">${esc(foe)} (power ${S&&foe!==S.name?Math.round(aiPower(WORLD.nations.find(n=>n.name===foe)||{name:foe,endo:0})):Math.round(playerPower())})</span></div>`;}).join("")||(S?"<i>No wars of yours. The harbor is quiet.</i>":"")}${aiA.map(w=>`<div class="happ">⚔️ ${esc(w.a)} vs ${esc(w.d)} — ${GOALS[w.goal].n} (day ${w.day}, ${Math.round(w.hpA)}–${Math.round(w.hpB)})</div>`).join("")||"<i>No foreign wars burning.</i>"}</div>`+(done.length?`<div class="card"><h3>📜 Recent settlements</h3>${done.map(w=>`<div class="happ">${esc(w.settle||`${w.a} vs ${w.d} ended.`)}</div>`).join("")}</div>`:"");}
window.enterBattle=id=>{const w=warById(id);if(!w||w.status!=="active")return;startBattle(w);};
function declareWar(){if(!S)return;const t=WORLD.nations.find(n=>n.name===(document.querySelector("#w-tgt")?.value||SUB.warTgt));if(!t)return alert("Pick a target.");
 if(isAtWarWith(t.name))return alert("Already at war with "+t.name+".");
 if(myWars().filter(w=>w.status==="active").length>=2)return alert("Command can run at most 2 wars at once.");
 const goal=SUB.warGoal||"political";if(!confirm(`Declare war on ${t.name} — ${GOALS[goal].n}?\n\nThe world will react. This cannot be undone except by victory or defeat.`))return;
 SUB.warCO=document.querySelector('input[name=wco]:checked')?.value||SUB.warCO||"valor";
 if(!WORLD.warId||isNaN(WORLD.warId))WORLD.warId=1;
 const w={id:WORLD.warId++,a:S.name,d:t.name,goal,status:"active",day:1,hpA:100,hpB:100,map:rnd(0,2),playerSide:"a",co:SUB.warCO,dayCap:20,quota:goalQuota(goal)};wars().unshift(w);
 S.aff[t.name]=5;WORLD.nations.forEach(n=>{if(n.name!==t.name)bumpAffinity(n.name,-6);});
 pushHapp(`${fullName(S)} declared war on ${t.name} — ${GOALS[goal].n}!`);WORLD.wa.log.unshift({t:Date.now(),x:`${fullName(S)} declared war on ${t.name} (${GOALS[goal].n}).`});
 feedAdd(S.name,`⚔️ A state of war exists between us and ${t.name}. Our goal: ${GOALS[goal].n}. We did not seek this — but we will finish it.`);
 feedAdd(t,(typeof speak==="function"?speak(t,`The aggression of ${S.name} will be answered. Our militia stands ready.`):`The aggression of ${S.name} will be answered. Our militia stands ready.`),"post",(typeof aiMediaFor==="function"?aiMediaFor(t,"war"):null));
 const paper=WORLD.papers.find(p=>p.region===S.region);if(paper){paper.articles.unshift(`${S.name} declares war on ${t.name} — ${GOALS[goal].n}`);paper.ed++;}
 save();startBattle(w);}

/* ================= TACTICAL BATTLE ENGINE ================= */
const TCOST={foot:{plains:1,forest:1,mountain:2,river:2,road:1,city:1,fact:1,air:1,port:1,hq:1,sea:99},mech:{plains:1,forest:1,mountain:1,river:1,road:1,city:1,fact:1,air:1,port:1,hq:1,sea:99},tread:{plains:1,forest:2,mountain:99,river:99,road:1,city:1,fact:1,air:1,port:1,hq:1,sea:99},air:{plains:1,forest:1,mountain:1,river:1,road:1,city:1,fact:1,air:1,port:1,hq:1,sea:1},sea:{sea:1,port:1,plains:99,forest:99,mountain:99,river:99,road:99,city:99,fact:99,air:99,hq:99}};
const TSTAR={plains:1,forest:2,mountain:4,river:0,road:0,sea:0,city:3,fact:3,air:3,port:3,hq:4};
const UNITS={inf:{n:"Infantry",icon:"🪖",cost:1500,mv:3,cls:"foot",rng:[1,1],ammo:99,fuel:99,vis:2,cap:1},mech:{n:"Mech",icon:"🦾",cost:3000,mv:2,cls:"mech",rng:[1,1],ammo:6,fuel:70,vis:2,cap:1},tank:{n:"Tank",icon:"🛡️",cost:7000,mv:5,cls:"tread",rng:[1,1],ammo:9,fuel:70,vis:3},arty:{n:"Artillery",icon:"💣",cost:6000,mv:4,cls:"tread",rng:[2,3],ammo:6,fuel:60,vis:2,ind:1},heli:{n:"Helicopter",icon:"🚁",cost:9000,mv:6,cls:"air",rng:[1,1],ammo:8,fuel:60,vis:4},jet:{n:"Jet",icon:"✈️",cost:12000,mv:8,cls:"air",rng:[1,1],ammo:9,fuel:60,vis:5},ship:{n:"Battleship",icon:"🚢",cost:16000,mv:5,cls:"sea",rng:[2,5],ammo:9,fuel:60,vis:4,ind:1},apc:{n:"APC",icon:"🚚",cost:5000,mv:5,cls:"tread",rng:null,ammo:0,fuel:70,vis:4,sup:1}};
const DMG={inf:[55,65,15,70,0,0,0,75],mech:[65,75,55,70,0,0,0,85],tank:[70,75,55,70,0,0,0,80],arty:[85,85,70,75,0,0,0,90],heli:[75,80,55,65,55,30,35,75],jet:[60,60,60,60,80,55,50,70],ship:[70,70,65,65,0,40,55,60],apc:[0,0,0,0,0,0,0,0]};
const UKEYS=Object.keys(UNITS);
const COS=[{id:"valor",icon:"🎖️",name:"Marshal Valor",desc:"+10% direct attacks.",power:{name:"Rallying Cry",desc:"Repair all units +20 HP, +1 movement next turn."}},{id:"cannon",icon:"🧨",name:"Cannon Adept",desc:"+25% indirect (artillery/battleship) attacks.",power:{name:"Grand Barrage",desc:"25 damage to every visible enemy unit."}},{id:"sky",icon:"🦅",name:"Sky Baron",desc:"Air units +20% attack, +1 movement.",power:{name:"Tailwind",desc:"All units +1 movement; air units repaired +20 HP."}},{id:"iron",icon:"⚙️",name:"Iron Quartermaster",desc:"+25% property income, +1 defense star.",power:{name:"Field Repairs",desc:"Repair all units +40 HP."}}];
const COATK={valor:u=>UNITS[u].ind?1:1.1,cannon:u=>UNITS[u].ind?1.25:1,sky:u=>UNITS[u].cls==="air"?1.2:1,iron:()=>1};
function coDefStars(){return (SUB.battle&&SUB.battle.co==="iron")?1:0;}
function startBattle(w){const foe=w.playerSide==="a"?w.d:w.a;SUB.battle=newBattle(w,foe);VIEW="war";save();render();window.scrollTo(0,0);}
function newBattle(w,foeName){const foeN=WORLD.nations.find(n=>n.name===foeName);const pp=playerPower(),ep=foeN?aiPower(foeN):50;
 const B={warId:w.id,goal:w.goal,playerSide:w.playerSide,foe:foeName,map:w.map,co:w.playerSide==="a"?(w.co||"valor"):(SUB.warCO||"valor"),coPow:0,coBonus:0,day:1,turn:"p",funds:{p:Math.round(6000+pp*40),e:Math.round(6000+ep*40)},units:[],uid:1,sel:null,dest:null,targets:[],log:[],over:null,quota:w.quota||0,defDays:w.defDays||8,dayCap:w.dayCap||20};
 genMap(B);
 const P=w.playerSide==="a"?"p":"e",E=w.playerSide==="a"?"e":"p";
 const place=(side,list)=>{list.forEach(([t,x,y])=>{B.units.push({id:B.uid++,side,type:t,hp:100,ammo:UNITS[t].ammo,fuel:UNITS[t].fuel,x,y,moved:false,acted:false,seen:{p:true,e:true}});});};
 place("p",[["inf",2,1],["inf",1,3],["mech",3,2],["tank",2,4],["arty",1,2],["apc",3,3]]);
 place("e",[["inf",11,8],["inf",12,6],["mech",10,7],["tank",11,5],["arty",12,7],["apc",10,6]]);
 if(ep>pp+12){B.units.push({id:B.uid++,side:E,type:"tank",hp:100,ammo:9,fuel:70,x:E==="e"?10:3,y:E==="e"?4:5,moved:false,acted:false,seen:{p:true,e:true}});B.units.push({id:B.uid++,side:E,type:"heli",hp:100,ammo:8,fuel:60,x:E==="e"?11:2,y:E==="e"?3:6,moved:false,acted:false,seen:{p:true,e:true}});}
 if(ep>pp+28){B.units.push({id:B.uid++,side:E,type:"jet",hp:100,ammo:9,fuel:60,x:E==="e"?12:1,y:E==="e"?2:7,moved:false,acted:false,seen:{p:true,e:true}});}
 if(pp>ep+12){B.units.push({id:B.uid++,side:P,type:"tank",hp:100,ammo:9,fuel:70,x:P==="p"?3:10,y:P==="p"?5:4,moved:false,acted:false,seen:{p:true,e:true}});}
 blog(B,`Day 1 — ${w.a} vs ${w.d}. Goal: ${GOALS[w.goal].n}. ${w.playerSide==="d"?`Survive ${B.defDays} days!`:"Win by "+winText(w.goal)+"."}`);
 return B;}
function genMap(B){const W=14,H=10;B.w=W;B.h=H;B.cells=[];let s=(B.warId*9301+49297)%233280;const srnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
 for(let y=0;y<H;y++){const row=[];for(let x=0;x<W;x++){let t="plains";const r=srnd();
  if(x===0&&y>=5||x===13&&y<=4)t="sea";
  else if(x===6||x===7){t=(y===4||y===5)?"road":"river";}
  else if(y===4||y===5){if(t!=="sea")t="road";}
  else if(r<0.10)t="forest";else if(r<0.14)t="mountain";
  row.push({t,b:null,own:null,cap:0,capWho:null});}B.cells.push(row);}
 const P=(x,y,b,own)=>{B.cells[y][x].b=b;B.cells[y][x].own=own;B.cells[y][x].t=b==="hq"?"hq":(B.cells[y][x].t==="sea"?"sea":B.cells[y][x].t);};
 P(1,1,"hq","p");P(2,2,"fact","p");P(1,6,"air","p");P(1,7,"port","p");P(3,1,"city","p");P(2,5,"city","p");
 P(12,8,"hq","e");P(11,7,"fact","e");P(12,3,"air","e");P(12,2,"port","e");P(10,8,"city","e");P(11,4,"city","e");
 P(6,1,"city",null);P(7,8,"city",null);P(5,4,"city",null);P(8,5,"city",null);P(4,7,"city",null);P(9,2,"city",null);}
function blog(B,x){B.log.unshift(`D${B.day} ${B.turn==="p"?"🟥":"⬛"} ${x}`);B.log=B.log.slice(0,60);}
function cellAt(B,x,y){return(x<0||y<0||x>=B.w||y>=B.h)?null:B.cells[y][x];}
function unitAt(B,x,y){return B.units.find(u=>u.x===x&&u.y===y);}
function starsOf(B,u){const c=cellAt(B,u.x,u.y);let s=c.b?(TSTAR[c.b]??1):(TSTAR[c.t]??1);if(u.side==="p")s+=coDefStars();if(c.t==="mountain"&&UNITS[u.type].cls==="foot")s+=0;return s;}
function coAtkOf(type){const B=SUB.battle;if(!B)return 1;return(COATK[B.co]||COATK.valor)(type);}
function dist(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);}
function passCost(B,cls,x,y){const c=cellAt(B,x,y);if(!c)return 99;const t=c.b==="hq"?"plains":c.t;return TCOST[cls][t]??99;}
function reachable(B,u){const U=UNITS[u.type];let mv=U.mv+(B.coBonus||0)+((B.co==="sky"&&U.cls==="air")?1:0);let fuelCap=u.fuel;const seen={},q=[[u.x,u.y,0]];seen[u.x+","+u.y]=0;
 while(q.length){const [x,y,c]=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(!cellAt(B,nx,ny))continue;if(unitAt(B,nx,ny)&&!(nx===u.x&&ny===u.y))continue;const step=passCost(B,U.cls,nx,ny);if(step>90)continue;const nc=c+step;if(nc>mv)continue;if(U.cls!=="air"&&nc>fuelCap)continue;const k=nx+","+ny;if(seen[k]===undefined||nc<seen[k]){seen[k]=nc;q.push([nx,ny,nc]);}}}
 delete seen[u.x+","+u.y];return seen;}
function visRange(B,u){const c=cellAt(B,u.x,u.y);return UNITS[u.type].vis+(c.t==="mountain"?2:0);}
function visibleTo(B,u,side){if(side==="e")return true;if(u.side==="p")return true;const c=cellAt(B,u.x,u.y);if(c.b)return true;
 for(const f of B.units.filter(x=>x.side==="p")){if(dist(f,u)<=visRange(B,f))return true;}
 if(B.units.filter(x=>x.side==="e").length<=2)return true;return false;}
function targetsFrom(B,u){const U=UNITS[u.type];if(!U.rng||u.ammo<=0)return[];const out=[];
 for(const e of B.units.filter(x=>x.side!==u.side)){if(!visibleTo(B,e,u.side))continue;const d=dist(u,e);if(d>=U.rng[0]&&d<=U.rng[1]&&DMG[u.type][UKEYS.indexOf(e.type)]>0)out.push({e,dmg:estDmg(B,u,e)});}
 return out.sort((a,b)=>b.dmg-a.dmg);}
function estDmg(B,atk,def){const base=DMG[atk.type][UKEYS.indexOf(def.type)];if(!base)return 0;const stars=starsOf(B,def);return Math.max(1,Math.round(base*(atk.hp/100)*(1-stars*0.05)*coAtkOf(atk.type)));}
function dealDmg(B,atk,def,dmg){def.hp-=dmg;const over=def.hp<=0;if(over){B.units=B.units.filter(x=>x.id!==def.id);blog(B,`${UNITS[atk.type].icon} destroyed ${UNITS[def.type].n}!`);}return over;}
function attackUnit(B,atk,e){const dmg=estDmg(B,atk,e);atk.ammo--;dealDmg(B,atk,e,dmg);B.coPow=Math.min(100,B.coPow+dmg*0.12);blog(B,`${atk.side==="p"?"🟥":"⬛"} ${UNITS[atk.type].n} hits ${UNITS[e.type].n} for ${dmg}${e.hp>0?` (${e.hp} left)`:""}`);
 if(e.hp>0){const U=UNITS[e.type];const d=dist(atk,e);if(e.ammo>0&&U.rng&&d>=U.rng[0]&&d<=U.rng[1]&&DMG[e.type][UKEYS.indexOf(atk.type)]>0&&!U.ind){const back=Math.max(1,Math.round(DMG[e.type][UKEYS.indexOf(atk.type)]*(e.hp/100)*(1-starsOf(B,atk)*0.05)));e.ammo--;dealDmg(B,e,atk,back);blog(B,`Counterattack! ${UNITS[e.type].n} hits back for ${back}${atk.hp>0?` (${atk.hp} left)`:""}`);}}
 atk.moved=true;atk.acted=true;B.sel=null;B.dest=null;B.targets=[];checkEnd(B);}
function propsOf(B,side){let n=0;for(const row of B.cells)for(const c of row)if(c.b&&c.own===side)n++;return n;}
function checkEnd(B){const w=warById(B.warId);const pU=B.units.filter(u=>u.side==="p").length,eU=B.units.filter(u=>u.side==="e").length;
 const pHQ=B.cells.flat().find(c=>c.b==="hq"&&c.own==="p"),eHQ=B.cells.flat().find(c=>c.b==="hq"&&c.own==="e");
 const qp=propsOf(B,"p");
 const finish=(res,how)=>{B.over={res,how};if(w){w.status="done";}resolveBattle(B,res,how);};
 if(pU===0)return finish(B.playerSide==="d"?"loss":"loss","Your forces were routed.");
 if(eU===0)return finish(B.playerSide==="d"?"win":"win","Enemy routed — every unit destroyed.");
 if(B.playerSide==="a"&&(!eHQ||eHQ.own==="p"))return finish("win","Enemy HQ captured!");
 if(B.playerSide==="d"&&pHQ&&pHQ.own!=="p")return finish("loss","Your HQ has fallen.");
 if((B.goal==="land"||B.goal==="all")&&qp>=B.quota){if(B.goal==="land")return finish(B.playerSide==="d"?"win":"win",`Objective seized — ${qp} properties held!`);const hqDown=B.playerSide==="a"?(!eHQ||eHQ.own==="p"):(pHQ&&pHQ.own==="p");if(hqDown||eU===0)return finish(B.playerSide==="d"?"win":"win",`Total dominance — ${qp} properties and enemy command broken!`);}
 if(B.playerSide==="d"&&B.day>B.defDays)return finish("win",`You held ${B.defDays} days — the invasion breaks!`);
 if(B.playerSide==="a"&&B.day>B.dayCap)return finish("loss","Time ran out — the offensive stalls.");}

/* ----- battle view ----- */
const TCELL={plains:["#a8c68a",""],forest:["#5d8a4a","🌲"],mountain:["#9a9a9a","⛰️"],river:["#5aa3d0",""],road:["#d9c27a",""],sea:["#2a6ab0","🌊"],city:["#c9b98f","🏘️"],fact:["#c9b98f","🏭"],air:["#c9b98f","🛫"],port:["#c9b98f","⚓"],hq:["#e0c060","🏰"]};
function vBattle(m){const B=SUB.battle;if(!B){VIEW="war";render();return;}
 if(B.over){const w=warById(B.warId);m.innerHTML=`<div class="card warcard"><h2>${B.over.res==="win"?"🏆 Victory!":"💀 Defeat"}</h2><p>${esc(B.over.how)}</p><p class="kv">${esc(B.over.detail||"")}</p><button class="btn primary" onclick="SUB.battle=null;VIEW='war';save();render();">Return to War Room</button> <button class="btn" onclick="go('feed')">Announce on WorldBook</button></div><div class="card"><h3>After-action log</h3><div class="blog">${B.log.map(l=>esc(l)).join("<br>")}</div></div>`;return;}
 const sel=B.units.find(u=>u.id===B.sel);const reach=B.reach||{};
 m.innerHTML=`<div class="card warcard"><h2>⚔️ ${esc(B.playerSide==="a"?"Offensive":"Defense")} — Day ${B.day} <span class="goalbadge">${GOALS[B.goal].icon} ${GOALS[B.goal].n}</span></h2>
 <div class="kv">💰 You: <b>${B.funds.p}</b> • Enemy: <b>${B.funds.e}</b> • Properties you: <b>${propsOf(B,"p")}</b>${B.quota?` / quota ${B.quota}`:""} • Units: 🟥${B.units.filter(u=>u.side==="p").length} ⬛${B.units.filter(u=>u.side==="e").length}${B.playerSide==="d"?` • Hold until day ${B.defDays+1}`:` • Day cap ${B.dayCap}`}</div>
 <div class="kv">CO: <b>${COS.find(c=>c.id===B.co).icon} ${COS.find(c=>c.id===B.co).name}</b> — power <b>${Math.floor(B.coPow)}%</b> <div class="pwbar" style="width:220px;display:inline-block;vertical-align:middle"><i style="width:${B.coPow}%;background:linear-gradient(90deg,#b8860b,#ffd75e)"></i></div> <button class="cobtn" ${B.coPow>=100?"":"disabled"} onclick="bCO()">⚡ ${COS.find(c=>c.id===B.co).power.name}</button></div></div>
 <div class="battle"><div class="bmap" style="grid-template-columns:repeat(${B.w},36px)">${B.cells.map((row,y)=>row.map((c,x)=>{const u=unitAt(B,x,y);const vis=u?(u.side==="p"||visibleTo(B,u,"p")):true;const tkey=c.b||c.t;const [bg,em]=TCELL[tkey]||TCELL.plains;const isSel=sel&&sel.x===x&&sel.y===y;const isMv=reach[x+","+y]!==undefined;const isTg=B.targets.some(t=>t.e.x===x&&t.e.y===y);
  return `<div class="bcell ${isSel?"sel":""} ${isMv?"mv":""} ${isTg?"tgt":""}" style="background:${bg};${c.own==="p"?"box-shadow:inset 0 0 0 2px #e02040;":""}${c.own==="e"?"box-shadow:inset 0 0 0 2px #6e7683;":""}${isMv?"outline:2px solid #7ab648;outline-offset:-2px;":""}${isTg?"outline:3px solid #ff5b3e;outline-offset:-3px;":""}" onclick="bCell(${x},${y})">${em||""}${u&&vis?UNITS[u.type].icon:""}${u&&vis?`<span class="hp">${Math.ceil(u.hp/10)}</span><span class="own" style="color:${u.side==="p"?"#ff5b7a":"#c9d2dd"}">●</span>`:""}${c.b&&!(u&&vis)?`<span class="own" style="color:${c.own==="p"?"#ff5b7a":c.own==="e"?"#c9d2dd":"#8a7f6a"}">${c.own==="p"?"B":c.own==="e"?"R":"•"}</span>`:""}</div>`;}).join("")).join("")}</div>
 <div class="bpanel">
  <div class="card"><h3>${B.turn==="p"?"🟥 Your turn":"⬛ Enemy turn…"}</h3>
  ${sel?bUnitPanel(B,sel):`<div class="kv">Select a blue unit. Green = can move. Red = can attack.<br><br>Legend: 🏘️city 🏭factory 🛫airport ⚓port 🏰HQ<br>🌲forest(cover) ⛰️mountain(cover) 🌊sea • number = HP/10</div>`}
  ${B.dest?`<div style="margin-top:8px"><b>Targets:</b><br>${B.targets.length?B.targets.map((t,i)=>`<button class="btn small danger" style="margin:2px" onclick="bAtk(${i})">Hit ${UNITS[t.e.type].n} (${t.dmg}%)</button>`).join(""):"<span class='kv'>No targets in range.</span>"}<br>${bCapable(B)?`<button class="btn small" onclick="bCap()">⚒️ Capture</button>`:""} <button class="btn small" onclick="bWait()">Wait</button></div>`:""}
  <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="btn small primary" onclick="bEnd()">End turn ⏭</button><button class="btn small" onclick="bAuto()">Auto-resolve</button><button class="btn small danger" onclick="bRetreat()">Retreat</button></div></div>
  <div class="card"><h3>Build</h3><div id="bbuild">${bBuildHTML(B)}</div></div>
  <div class="card"><h3>Log</h3><div class="blog">${B.log.slice(0,14).map(l=>esc(l)).join("<br>")}</div></div>
 </div></div>`;}
function bUnitPanel(B,u){const U=UNITS[u.type];return `<div class="kv"><b>${U.icon} ${U.n}</b> ${u.side==="p"?"🟥":"⬛"}<br>HP <b>${u.hp}</b> • Ammo <b>${u.ammo}</b> • Fuel <b>${u.fuel}</b><br>Move ${U.mv} • Range ${U.rng?U.rng.join("-"):"—"} • Vision ${U.vis}${U.cap?" • Can capture":""}${U.sup?" • Resupplies neighbours":""}<br>${u.moved?"<i>Spent.</i>":"<i>Ready.</i>"}</div>`;}
function bCapable(B){const u=B.units.find(x=>x.id===B.sel);if(!u||!UNITS[u.type].cap||!B.dest)return false;const c=cellAt(B,B.dest.x,B.dest.y);return c&&c.b&&c.own!==u.side;}
function bBuildHTML(B){const spots=[];B.cells.forEach((row,y)=>row.forEach((c,x)=>{if(c.b&&(c.b==="fact"||c.b==="air"||c.b==="port")&&c.own==="p"&&!unitAt(B,x,y))spots.push({x,y,b:c.b});}));
 if(!spots.length)return `<span class="kv">Hold a friendly factory/airport/port with no unit on it to build.</span>`;
 return spots.map((s,i)=>{const av=UKEYS.filter(k=>(s.b==="fact"&&["inf","mech","tank","arty","apc"].includes(k))||(s.b==="air"&&["heli","jet","inf"].includes(k))||(s.b==="port"&&["ship","inf"].includes(k)));return `<div class="kv">${s.b==="fact"?"🏭":s.b==="air"?"🛫":"⚓"} (${s.x},${s.y})<br>${av.map(k=>`<button class="btn small" style="margin:1px" ${B.funds.p>=UNITS[k].cost?"":"disabled"} onclick="bBuild('${k}',${s.x},${s.y})">${UNITS[k].icon} ${UNITS[k].cost}</button>`).join("")}</div>`;}).join("");}
window.bCell=(x,y)=>{const B=SUB.battle;if(!B||B.over||B.turn!=="p")return;const u=unitAt(B,x,y);
 if(B.dest&&B.targets.some(t=>t.e.x===x&&t.e.y===y)){const i=B.targets.findIndex(t=>t.e.x===x&&t.e.y===y);return bAtk(i);}
 if(B.sel&&reachKey(B,x,y)){return bMove(x,y);}
 if(u&&u.side==="p"&&!u.moved&&!u.acted){B.sel=u.id;B.dest=null;B.targets=[];B.reach=reachable(B,u);render();return;}
 B.sel=null;B.dest=null;B.targets=[];B.reach=null;render();};
function reachKey(B,x,y){return B.reach&&B.reach[x+","+y]!==undefined;}
window.bMove=(x,y)=>{const B=SUB.battle;const u=B.units.find(z=>z.id===B.sel);if(!u)return;const cost=B.reach[x+","+y];const U=UNITS[u.type];
 if(U.cls!=="air"&&U.cls!=="sea")u.fuel=Math.max(0,u.fuel-cost);else if(U.cls==="air")u.fuel=Math.max(0,u.fuel-2);
 u.x=x;u.y=y;u.moved=true;B.dest={x,y};B.reach=null;B.targets=targetsFrom(B,u);render();};
window.bAtk=i=>{const B=SUB.battle;const u=B.units.find(z=>z.id===B.sel);const t=B.targets[i];if(!u||!t)return;attackUnit(B,u,t.e);save();render();};
window.bCap=()=>{const B=SUB.battle;const u=B.units.find(z=>z.id===B.sel);if(!u||!B.dest)return;const c=cellAt(B,B.dest.x,B.dest.y);if(!c||!c.b)return;
 if(c.capWho!==u.side){c.capWho=u.side;c.cap=0;}c.cap+=10;blog(B,`${UNITS[u.type].n} capturing ${c.b} (${c.cap}/20)`);
 if(c.cap>=20){c.own=u.side;c.cap=0;c.capWho=null;blog(B,`🏳️ ${c.b} captured by ${u.side==="p"?"you":"enemy"}!`);pushHapp(`${S?fullName(S):"You"} ${u.side==="p"?"seized":"lost"} a ${c.b} in battle.`);}
 u.moved=true;u.acted=true;B.sel=null;B.dest=null;B.targets=[];checkEnd(B);save();render();};
window.bWait=()=>{const B=SUB.battle;const u=B.units.find(z=>z.id===B.sel);if(u){u.moved=true;u.acted=true;}B.sel=null;B.dest=null;B.targets=[];save();render();};
window.bBuild=(k,x,y)=>{const B=SUB.battle;if(B.funds.p<UNITS[k].cost||unitAt(B,x,y))return;B.funds.p-=UNITS[k].cost;B.units.push({id:B.uid++,side:"p",type:k,hp:100,ammo:UNITS[k].ammo,fuel:UNITS[k].fuel,x,y,moved:true,acted:true,seen:{p:true,e:true}});blog(B,`Built ${UNITS[k].n} (${x},${y})`);save();render();};
window.bCO=()=>{const B=SUB.battle;if(B.coPow<100)return;const co=COS.find(c=>c.id===B.co);B.coPow=0;
 if(B.co==="valor"){B.units.filter(u=>u.side==="p").forEach(u=>u.hp=Math.min(100,u.hp+20));B.coBonus=1;blog(B,`⚡ ${co.power.name}! All units +20 HP, +1 move.`);}
 if(B.co==="cannon"){B.units.filter(u=>u.side==="e"&&(u.side==="e"||true)).forEach(e=>{if(visibleTo(B,e,"p")){e.hp-=25;if(e.hp<=0)B.units=B.units.filter(x=>x.id!==e.id);}});blog(B,`⚡ ${co.power.name}! 25 damage to all visible enemies.`);checkEnd(B);}
 if(B.co==="sky"){B.units.filter(u=>u.side==="p").forEach(u=>{if(UNITS[u.type].cls==="air")u.hp=Math.min(100,u.hp+20);});B.coBonus=1;blog(B,`⚡ ${co.power.name}! Fleet-wide +1 move, air repaired.`);}
 if(B.co==="iron"){B.units.filter(u=>u.side==="p").forEach(u=>u.hp=Math.min(100,u.hp+40));blog(B,`⚡ ${co.power.name}! All units +40 HP.`);}
 feedAdd(S?S.name:"Commander",`⚡ CO Power unleashed: ${co.power.name}!`);save();render();};
window.bEnd=()=>{const B=SUB.battle;if(!B||B.over||B.turn!=="p")return;B.sel=null;B.dest=null;B.targets=[];B.reach=null;enemyTurn(B);};
function resupply(B,side){for(const u of B.units.filter(x=>x.side===side)){const c=cellAt(B,u.x,u.y);const nearAPC=B.units.some(a=>a.side===side&&UNITS[a.type].sup&&dist(a,u)===1);
 if((c.b&&c.own===side)||nearAPC){u.ammo=UNITS[u.type].ammo;u.fuel=UNITS[u.type].fuel;}}}
function income(B,side){let n=0;for(const row of B.cells)for(const c of row)if(c.b&&c.own===side)n+=(c.b==="hq"?1500:1000);if(side==="p"&&B.co==="iron")n=Math.round(n*1.25);B.funds[side]+=n;return n;}
function enemyTurn(B){B.turn="e";resupply(B,"e");const inc=income(B,"e");blog(B,`Enemy collects ${inc}.`);
 B.cells.forEach((row,y)=>row.forEach((c,x)=>{if((c.b==="fact"||c.b==="air"||c.b==="port")&&c.own==="e"&&!unitAt(B,x,y)){const pool=c.b==="fact"?["inf","inf","mech","tank","arty"]:c.b==="air"?["heli","jet"]:["ship"];for(const k of pool.sort(()=>Math.random()-0.5)){if(B.funds.e>=UNITS[k].cost){B.funds.e-=UNITS[k].cost;B.units.push({id:B.uid++,side:"e",type:k,hp:100,ammo:UNITS[k].ammo,fuel:UNITS[k].fuel,x,y,moved:true,acted:true,seen:{p:true,e:true}});blog(B,`Enemy built ${UNITS[k].n}.`);break;}}}}));
 const order=[...B.units.filter(u=>u.side==="e")];
 for(const u of order){if(!B.units.find(x=>x.id===u.id)||B.over)continue;aiUnit(B,u);if(B.over)break;}
 if(B.over){save();render();return;}
 B.turn="p";B.day++;B.coBonus=0;resupply(B,"p");const inc2=income(B,"p");B.units.filter(u=>u.side==="p").forEach(u=>{u.moved=false;u.acted=false;});
 for(const u of B.units.filter(u=>u.side==="p")){if(u.fuel<=0&&(UNITS[u.type].cls==="air"||UNITS[u.type].cls==="sea")){B.units=B.units.filter(x=>x.id!==u.id);blog(B,`${UNITS[u.type].n} ran dry and was lost!`);}}
 blog(B,`Day ${B.day} — you collect ${inc2}.`);checkEnd(B);save();render();}
function aiUnit(B,u){const U=UNITS[u.type];
 const foes=B.units.filter(x=>x.side==="p");
 const reach=reachable(B,u);
 let best=null;
 for(const key of Object.keys(reach)){const [x,y]=key.split(",").map(Number);const tmp={...u,x,y};
  for(const f of foes){const d=Math.abs(x-f.x)+Math.abs(y-f.y);if(U.rng&&d>=U.rng[0]&&d<=U.rng[1]&&DMG[u.type][UKEYS.indexOf(f.type)]>0){const score=DMG[u.type][UKEYS.indexOf(f.type)]*(u.hp/100)+(100-f.hp)*0.5-d;if(!best||score>best.score)best={x,y,f,score};}}}
 if(best&&u.ammo>0){const cost=reach[best.x+","+best.y]||0;if(U.cls!=="air"&&U.cls!=="sea")u.fuel=Math.max(0,u.fuel-cost);else if(U.cls==="air")u.fuel=Math.max(0,u.fuel-2);u.x=best.x;u.y=best.y;attackUnit(B,u,best.f);return;}
 const caps=[];if(U.cap){for(const key of Object.keys(reach)){const [x,y]=key.split(",").map(Number);const c=cellAt(B,x,y);if(c.b&&c.own!=="e")caps.push({x,y});}}
 if(caps.length){caps.sort((a,b)=>(Math.abs(a.x-u.x)+Math.abs(a.y-u.y))-(Math.abs(b.x-u.x)+Math.abs(b.y-u.y)));const t=caps[0];const cost=reach[t.x+","+t.y]||0;u.fuel=Math.max(0,u.fuel-cost);u.x=t.x;u.y=t.y;u.moved=true;u.acted=true;const c=cellAt(B,t.x,t.y);if(c.capWho!=="e"){c.capWho="e";c.cap=0;}c.cap+=10;blog(B,`Enemy capturing ${c.b} (${c.cap}/20)`);
  if(c.cap>=20){c.own="e";c.cap=0;blog(B,"🏳️ Enemy seized a "+c.b+"!");}checkEnd(B);return;}
 if(foes.length){foes.sort((a,b)=>dist(u,a)-dist(u,b));const t=foes[0];let bx=u.x,by=u.y,bd=dist(u,t);
  for(const key of Object.keys(reach)){const [x,y]=key.split(",").map(Number);const d=Math.abs(x-t.x)+Math.abs(y-t.y);if(d<bd){bd=d;bx=x;by=y;}}
  if(bx!==u.x||by!==u.y){const cost=reach[bx+","+by]||0;if(U.cls!=="air"&&U.cls!=="sea")u.fuel=Math.max(0,u.fuel-cost);else if(U.cls==="air")u.fuel=Math.max(0,u.fuel-2);u.x=bx;u.y=by;}
  u.moved=true;u.acted=true;}}
window.bAuto=()=>{const B=SUB.battle;if(!B||B.over)return;if(!confirm("Auto-resolve this battle from current positions?"))return;autoResolve(B);};
function autoResolve(B){const pv=B.units.filter(u=>u.side==="p").reduce((a,u)=>a+u.hp*({inf:1,mech:1.4,tank:2.4,arty:2.2,apc:1,heli:2.8,jet:3.4,ship:3.8}[u.type]),0)+B.funds.p/400;
 const ev=B.units.filter(u=>u.side==="e").reduce((a,u)=>a+u.hp*({inf:1,mech:1.4,tank:2.4,arty:2.2,apc:1,heli:2.8,jet:3.4,ship:3.8}[u.type]),0)+B.funds.e/400;
 const win=Math.random()<(pv/(pv+ev))*1.05;
 if(win){B.units=B.units.filter(u=>u.side==="p");B.over=null;checkEndAuto(B,"win","Auto-resolved: your staff out-planned the enemy.");}
 else{B.units=B.units.filter(u=>u.side==="e");checkEndAuto(B,"loss","Auto-resolved: the enemy staff out-planned you.");}}
function checkEndAuto(B,res,how){const w=warById(B.warId);B.over={res,how};if(w)w.status="done";resolveBattle(B,res,how);}
window.bRetreat=()=>{const B=SUB.battle;if(!B||B.over)return;if(!confirm("Retreat? This counts as a defeat."))return;const w=warById(B.warId);B.over={res:"loss",how:"You sounded the retreat."};if(w)w.status="done";resolveBattle(B,"loss","You sounded the retreat.");};

/* ----- war outcomes: the map changes ----- */
function recalcDelegate(rn){const r=WORLD.regions.find(x=>x.name===rn);if(!r)return;const c=WORLD.nations.filter(n=>n.region===rn&&n.wa).sort((a,b)=>b.endo-a.endo);r.delegate=c[0]?.name||"—";}
function eliminateNation(name,by){const n=WORLD.nations.find(x=>x.name===name);if(!n)return null;WORLD.nations=WORLD.nations.filter(x=>x.name!==name);
 const r=WORLD.regions.find(x=>x.name===n.region);if(r){r.nations=r.nations.filter(x=>x!==name);r.numNations=r.nations.length;recalcDelegate(r.name);}
 if(S)S.endoGiven=S.endoGiven.filter(x=>x!==name);return n;}
function resolveBattle(B,res,how){const w=warById(B.warId);const foeN=WORLD.nations.find(n=>n.name===B.foe);const won=res==="win";
 if(S){if(won)S.milWon=(S.milWon||0)+1;else S.milLost=(S.milLost||0)+1;}
 let detail="";
 if(B.playerSide==="a"){
  if(won){
   if(B.goal==="political"&&foeN){foeN.region=S.region;foeN.endo=0;S.aff[foeN.name]=95;S.bank+=8;WORLD.regions.find(r=>r.name===S.region).nations.push(foeN.name);recalcDelegate(S.region);detail=`${foeN.name} now flies under your influence in ${S.region}. Tribute +8 bank.`;}
   else if(B.goal==="total"&&foeN){const g=Math.round(foeN.pop*0.4);S.pop+=g;S.bank+=10;eliminateNation(foeN.name,S.name);WORLD.nations.forEach(n=>bumpAffinity(n.name,-12));detail=`${foeN.name} has fallen. +${fmtPop(g)} people, +10 bank. The world condemns you.`;WORLD.wa.log.unshift({t:Date.now(),x:`${fullName(S)} absorbed ${foeN.name} (total takeover). Condemnation debated.`});}
   else if(B.goal==="land"&&foeN){const g=Math.max(3e6,Math.round(foeN.pop*0.12));foeN.pop-=g;S.pop+=g;S.bank+=4;S.aff[foeN.name]=20;WORLD.nations.forEach(n=>bumpAffinity(n.name,-4));detail=`Borders redrawn: +${fmtPop(g)} people, +4 bank.`;}
   else if(B.goal==="all"&&foeN){const g=Math.round(foeN.pop*0.5);S.pop+=g;S.bank+=12;eliminateNation(foeN.name,S.name);WORLD.nations.forEach(n=>bumpAffinity(n.name,-15));detail=`Everything taken: +${fmtPop(g)} people, +12 bank. History will judge.`;WORLD.wa.log.unshift({t:Date.now(),x:`${fullName(S)} completed a total conquest of ${foeN.name}.`});}
   const paper=WORLD.papers.find(p=>p.region===S.region);if(paper){paper.articles.unshift(`${S.name} victorious over ${B.foe} — ${GOALS[B.goal].n}`);paper.ed++;}
   pushHapp(`${fullName(S)} won the war against ${B.foe} (${GOALS[B.goal].n}). ${detail}`);feedAdd(S.name,`🏆 Victory over ${B.foe}! ${how} ${detail}`,"post",{kind:"clip",clip:"parade",pick:rnd(0,3)});
  }else{if(S){S.pop=Math.max(1e6,S.pop*0.94);}if(foeN)foeN.endo+=2;detail="Your forces withdraw bloodied. -6% population, morale shaken.";pushHapp(`${fullName(S)} lost the war against ${B.foe}.`);if(typeof aiPost==="function"&&foeN)aiPost(foeN,`${S.name}'s offensive against us has failed. Our militia holds!`,{kind:"clip",clip:"parade"});else feedAdd(B.foe,`${S.name}'s offensive against us has failed. Our militia holds!`);}
 }else{
  if(won){S.bank+=2;if(foeN)S.aff[foeN.name]=15;detail=`The invasion breaks against your defenses. +2 bank in allied aid.`;pushHapp(`${fullName(S)} repelled ${B.foe}'s invasion!`);feedAdd(S.name,`🛡️ We have repelled the invasion of ${B.foe}! ${how}`);}
  else{S.pop=Math.max(1e6,S.pop*0.92);detail="The capital pays the price. -8% population.";pushHapp(`${B.foe} overran ${fullName(S)}'s defenses.`);if(foeN&&B.goal!=="political"){const g=Math.max(2e6,Math.round(S.pop*0.08));S.pop-=g;foeN.pop+=g;detail+=` Occupiers seize ${fmtPop(g)} people.`;}}
 }
 if(w){w.settle=`${w.a} vs ${w.d} — ${won?(B.playerSide==="a"?w.a+" prevails":w.d+" holds"):(B.playerSide==="a"?w.d+" holds":w.a+" prevails")} (${GOALS[w.goal].n}).`;}
 B.over={res,how,detail};try{if(typeof remember==="function"){if(B.playerSide==="a")remember(won?"victory":"defeat",(won?S.name+" triumphed over "+B.foe:B.foe+" repelled "+(S?S.name:"the invasion"))+" ("+GOALS[B.goal].n+").");else remember(won?"victory":"defeat",(won?S.name+" repelled "+B.foe:B.foe+" overran "+(S?S.name:"the defenses")));}}catch(e){}save();render();}
window.defendWar=id=>{const w=warById(id);if(w)startBattle(w);};
window.autoWar=id=>{const w=warById(id);if(!w||w.status!=="active")return;const foe=w.playerSide==="a"?w.d:w.a;const foeN=WORLD.nations.find(n=>n.name===foe);
 const pp=playerPower()+(w.playerSide==="a"?10:14),ep=foeN?aiPower(foeN):50;const win=Math.random()<pp/(pp+ep);
 const B={warId:w.id,goal:w.goal,playerSide:w.playerSide,foe,units:[],funds:{p:0,e:0},day:w.day,co:"valor",coPow:0,log:[],quota:w.quota||0,defDays:w.defDays||8,dayCap:w.dayCap||20,over:null};
 w.status="done";SUB.battle=null;resolveBattle(B,win?"win":"loss",win?"Auto-resolved: your generals carried the day.":"Auto-resolved: the enemy generals carried the day.");VIEW="war";render();};

/* ----- AI vs AI wars + AI vs player ----- */
window.__aiWarTick=function(){const act=wars().filter(w=>w.status==="active"&&w.a!==S?.name&&w.d!==S?.name);if(act.length>=3)return;if(WORLD.nations.length<6)return;
 const free=WORLD.nations.filter(n=>!wars().some(w=>w.status==="active"&&(w.a===n.name||w.d===n.name)));
 const hawks=free.filter(n=>personaOf(n)==="Hawk");
 const atk=(hawks.length&&Math.random()<0.7?hawks[rnd(0,hawks.length-1)]:free[rnd(0,free.length-1)]);
 if(!atk)return;
 let target=null;
 if(S&&Math.random()<0.10&&!myWars().some(w=>w.status==="active")&&playerPower()<aiPower(atk)*0.95){target={name:S.name,region:S.region};}
 else{const cands=WORLD.nations.filter(n=>n.name!==atk.name&&n.region===atk.region&&!wars().some(w=>w.status==="active"&&(w.a===n.name||w.d===n.name)));if(!cands.length)return;cands.sort((a,b)=>(ideoDist(atk,b)+ (aiPower(atk)-aiPower(b))) -(ideoDist(atk,a)+(aiPower(atk)-aiPower(a))));target=cands[0];}
 const goals=personaOf(atk)==="Hawk"?["total","land","political"]:["political","land","political"];
 const goal=goals[rnd(0,goals.length-1)];
 if(!WORLD.warId||isNaN(WORLD.warId))WORLD.warId=1;
 const w={id:WORLD.warId++,a:atk.name,d:target.name,goal,status:"active",day:1,hpA:100,hpB:100,map:rnd(0,2),playerSide:target.name===S?.name?"d":null,co:"valor",dayCap:20,quota:goalQuota(goal),defDays:8};wars().unshift(w);
 pushHapp(`⚔️ ${atk.name} declared war on ${target.name} — ${GOALS[goal].n}!`);
 feedAdd(atk,(typeof speak==="function"?speak(atk,`A state of war exists between us and ${target.name}. Our goal is ${GOALS[goal].n}. History will vindicate us.`):`⚔️ A state of war exists between us and ${target.name}. Our goal is ${GOALS[goal].n}. History will vindicate us.`),"post",(typeof aiMediaFor==="function"?aiMediaFor(atk,"war"):null));
 setTimeout(()=>{const c=pickReactor({author:atk.name},[atk.name,target.name]);const p=WORLD.feed[0];if(p){p.comments.push({author:c.name,iso:c.iso,t:Date.now(),text:smartReply("war "+GOALS[goal].n,c)});}save();},1500);
 if(target.name===S?.name){toast(`⚔️ ${atk.name} declared war on YOU! Open the War Room to defend (survive ${w.defDays} days)!`);bumpAffinity(atk.name,-45);}
 else if(S&&(atk.region===S.region||target.region===S.region))toast(`⚔️ War in your region: ${atk.name} vs ${target.name}`);
 save();if(VIEW==="war")render();else sidebar();};
window.__warDayTick=function(){for(const w of wars().filter(w=>w.status==="active"&&w.a!==S?.name&&w.d!==S?.name)){const A=WORLD.nations.find(n=>n.name===w.a),D=WORLD.nations.find(n=>n.name===w.d);
 if(!A||!D){w.status="done";w.settle=`${w.a} vs ${w.d} fizzled out.`;continue;}
 w.day++;const pa=aiPower(A),pd=aiPower(D);const da=Math.max(2,Math.round((pd/60)*rnd(4,9))),db=Math.max(2,Math.round((pa/60)*rnd(4,9)));
 w.hpA-=da;w.hpB-=db;
 if(w.hpA<=0||w.hpB<=0||w.day>12){const aWins=w.hpB<=0||(w.day>12&&w.hpA>w.hpB);const win=aWins?A:D,lose=aWins?D:A;w.status="done";
  if(w.goal==="total"){const g=Math.round(lose.pop*0.4);win.pop+=g;eliminateNation(lose.name,win.name);w.settle=`${win.name} absorbed ${lose.name} (total takeover, day ${w.day}).`;}
  else if(w.goal==="land"){const g=Math.max(2e6,Math.round(lose.pop*0.12));lose.pop-=g;win.pop+=g;w.settle=`${win.name} seized ${fmtPop(g)} from ${lose.name} (day ${w.day}).`;}
  else{lose.region=win.region;lose.endo=0;WORLD.regions.find(r=>r.name===win.region).nations.push(lose.name);recalcDelegate(win.region);w.settle=`${lose.name} now answers to ${win.name} (political takeover, day ${w.day}).`;}
  pushHapp(`🏳️ War ends: ${w.settle}`);if(typeof aiPost==="function")aiPost(win,`The war is over. ${w.settle} We honor the fallen and keep the peace.`,{kind:"clip",clip:"parade"});else feedAdd(win,`The war is over. ${w.settle} We honor the fallen and keep the peace.`);}}
 for(const w of wars().filter(w=>w.status==="active"&&(w.a===S?.name||w.d===S?.name))){if(!SUB.battle||SUB.battle.warId!==w.id){w.day++;if(w.day>20){w.status="done";w.settle=`${w.a} vs ${w.d} stalled into armistice (day 20).`;pushHapp(`Armistice: ${w.a} vs ${w.d}.`);}}}};

/* Prefetch real boundary data so the map is ready when opened. */
try{if(typeof fetch!=="undefined")loadGeo();}catch(e){}
