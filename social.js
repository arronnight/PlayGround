/* Social engine — makes WorldBook feel like real social media.
 * AI↔AI relationships (pairwise affinity + grudge store), stance-driven
 * replies (friends praise, rivals snipe), threaded rebuttals, staggered
 * scheduling (nothing answers instantly), post archetypes (polls, sports,
 * breaking news, celebrations), shares with commentary, and a memory of
 * notable events that posts cite. */
"use strict";
function feudKey(a,b){return[a,b].sort().join("|");}
function addFeud(a,b,d){if(!WORLD.feuds)WORLD.feuds={};const k=feudKey(a,b);WORLD.feuds[k]=Math.max(-30,Math.min(30,(WORLD.feuds[k]||0)+d));
 const ks=Object.keys(WORLD.feuds);if(ks.length>60)delete WORLD.feuds[ks[0]];}
function pairAff(a,b){if(!a||!b||a.name===b.name)return 50;let s=50;
 if(a.region===b.region)s+=12;
 try{if(systemOf(a)===systemOf(b))s+=8;}catch(e){}
 try{s-=ideoDist(a,b)*0.12;}catch(e){}
 try{const pa=personaOf(a),pb=personaOf(b);
  if((pa==="Hawk"&&pb==="Dove")||(pa==="Dove"&&pb==="Hawk"))s-=10;
  if(pa==="Showman"&&pb==="Showman")s+=6;
  if(pa==="Isolationist"||pb==="Isolationist")s-=4;}catch(e){}
 try{if(WORLD.feuds){const f=WORLD.feuds[feudKey(a.name,b.name)];if(f)s+=f;}}catch(e){}
 return Math.max(5,Math.min(98,Math.round(s)));}
function stanceOf(actor,author){const a=typeof author==="string"?WORLD.nations.find(n=>n.name===author):author;
 let base;
 if(!a){base=50;}
 else if(author===(S&&S.name)||(a&&S&&a.name===S.name)){base=affinityTo(actor);}
 else base=pairAff(actor,a);
 base+=rnd(-8,8);
 try{const pa=personaOf(actor);if(pa==="Hawk")base-=6;else if(pa==="Showman")base+=6;else if(pa==="Diplomat")base+=4;else if(pa==="Isolationist")base-=4;}catch(e){}
 return base>=62?"friend":base<=42?"rival":"neutral";}
function remember(kind,x){try{if(!WORLD.memory)WORLD.memory=[];WORLD.memory.unshift({t:Date.now(),kind,x});WORLD.memory=WORLD.memory.slice(0,12);}catch(e){}}
window.__remember=remember;
/* ---------- reply banks: friends praise, rivals snipe ---------- */
const RB={
trade:{friend:["Deal. Our merchants leave at dawn — send the harbor master.","Done, and happily. @AUTHOR, your markets are honest ones.","Our treasury already drafted the terms. Pleasure doing business.","A fair offer from a fair partner. Signed, sealed.","Our ports open widest for friends like you."],neutral:["Terms received. Our economists will red-pen it by Friday.","Interesting offer. What tariffs hide in the footnotes?","We trade with all who trade fair. Details by telegram?","The price is almost right. Almost."],rival:["Your 'deals' always cost us double. Pass.","We read the fine print last time. Never again.","Trade? With you? Our merchants laughed out of the room.","Our harbors are closed to your flags. Indefinitely."]},
war:{friend:["We stand with you. Our fleets drill in solidarity.","Say the word and our divisions march beside yours.","Courage. @AUTHOR has never bluffed yet.","Our banners fly beside yours. Always."],neutral:["Chilling news. Our delegation calls for talks — now.","Both capitals should breathe before they bleed.","We watch, we worry, we urge restraint.","War is expensive; peace merely costs pride."],rival:["Threats from a paper tiger. Come and see.","Your army marches on empty stomachs. Try it.","Noted. Our bunkers are deeper than your promises.","Drums? We hear kazoos."]},
peace:{friend:["Beautiful words, true friend. Peace looks good on you.","Our choirs will sing of this day.","Signed in our hearts already.","Our doves released an extra flock for this."],neutral:["Peace is always welcome, if it holds past spring.","Pretty words. We will believe the treaty, not the post.","Hopeful. Cautiously, carefully hopeful."],rival:["Peace? From you? Forgive our skepticism.","You burned the last olive branch. Grow a new one first.","A fine speech. Now disarm a division."]},
wa:{friend:["Our delegation votes with yours. Always.","Well argued — quoting this on the floor tomorrow.","Seconded, loudly, on the record."],neutral:["The resolution is long; our patience is short. Summarize?","We abstain from applause until the final clause.","Our vote is still drying. Convince us."],rival:["Your bloc can vote itself in circles. We'll vote sense.","Spare us the sermon. Read the text yourself first.","We vote no out of habit when you speak first."]},
sport:{friend:["WHAT A MATCH! Our streets are dancing too! 🎉","Your strikers are artists. Rematch soon!","We watched in the palace. Superb!"],neutral:["Entertaining game. Our league sends its regards.","2-1? Our bookmakers owe half the capital money.","A decent ninety minutes."],rival:["Enjoy it. We end your streak next season.","Lucky goals. All three of them. Sure. 🙄","The referee deserves your trophy, not you."]},
poll:{friend:["Voted! Option one, obviously. Democracy works.","Our whole cabinet voted before breakfast.","Civic duty done. Twice, for enthusiasm."],neutral:["Voted. Though polls are just weather vanes.","Interesting split forming in the comments…","Voted, sealed, counted."],rival:["Voted against, on principle. You know which option.","Polls? Cute. Power doesn't poll.","Our vote cancels yours. You know it does."]},
celebrate:{friend:["🎉🎉🎉 The harbor fires cannons in your honor!","Tears in our eyes. Magnificent. Simply magnificent.","Champagne in the cabinet room tonight — your health!"],neutral:["Congratulations are in order, we suppose. Well done.","Noted with respect. Enjoy the day.","A good day for you. Logged."],rival:["Enjoy the parade. History grades on a curve.","All empires celebrate. Ask how it ends.","Clap clap. Now the hard part."]},
condole:{friend:["Our flags fly at half-mast. We grieve with you. 🕯️","Hold fast, friend. Aid ships already sail.","Our prayers, our grain, our doctors — all yours."],neutral:["Sad news. Our condolences, sincerely.","A dark day. We offer help, no strings.","Grieved to hear it. Truly."],rival:["Thoughts and prayers. Mostly thoughts.","Tragic. Perhaps govern better next time.","Even we would not wish this. Almost."]},
census:{friend:["Growth suits you! Our demographers take notes.","Bigger and kinder both — rare combo.","A rising people! Our charts salute yours."],neutral:["Numbers climb everywhere. Wake us at the top.","Statistics: the politest fiction.","Counted, filed, admired from afar."],rival:["Big crowds, small ideas.","Quantity. We prefer quality.","All those people, still no good argument."]},
culture:{friend:["Our artists are already remixing this. Beautiful!","We danced to this in the capital last night!","Encore! Our theaters demand it."],neutral:["Charming. Our critics will review it harshly but fairly.","Pleasant enough for a state occasion."],rival:["Our censors fell asleep halfway. Wake us for the sequel.","We prefer silence. It says less."]},
generic:{friend:["Well said — could not agree more.","@AUTHOR speaks sense, as usual. Endorsed.","This. A thousand times this.","Quoting this in our morning briefing."],neutral:["Hm. Our analysts will circle back.","Noted. The ministry files everything.","We neither confirm nor deny interest."],rival:["Nonsense, polished to a shine.","You would say that, wouldn't you?","Blocked. (Not really. But tempted.)","Our reply was censored for diplomacy. Imagine it."]}};
function topicOf(t){t=(t||"").toLowerCase();
 if(/poll|vote:|election|referendum|🗳/.test(t))return"sport0";
 if(/poll/.test(t))return"poll";
 if(/cup|match|league|score|stadium|derby|goal|⚽|🏆|won \d|beat \d/.test(t))return"sport";
 if(/victory|won|triumph|parade|champion|🏆/.test(t))return"celebrate";
 if(/defeat|lost|mourn|grief|condolence|tragedy|🕯|fallen/.test(t))return"condole";
 if(/war|army|troop|invad|raid|attack|military|weapon|fleet|drill/.test(t))return"war";
 if(/trade|tariff|export|import|market|deal|goods|copper|coffee/.test(t))return"trade";
 if(/peace|treaty|friend|hello|welcome|greet|ceasefire|truce/.test(t))return"peace";
 if(/assembly|resolution|ga #|sc #|delegat|endors|council/.test(t))return"wa";
 if(/census|population|million|billion|chart|data|numbers/.test(t))return"census";
 if(/festival|film|song|cuisine|dance|art|poet|match/.test(t))return"culture";
 return"generic";}
function socialReply(actor,post,parent){try{
 if(!actor||!post)return null;
 const author=WORLD.nations.find(n=>n.name===post.author);
 let p="";try{p=personaOf(actor);}catch(e){}
 if(p==="Isolationist"&&Math.random()<0.55)return null;
 const stance=stanceOf(actor,post.author);
 let topic=topicOf(post.body+" "+(post.comments[0]?post.comments[0].text:""));
 if(topic==="sport0")topic="poll";
 const bank=(RB[topic]||RB.generic)[stance]||RB.generic[stance];
 if(!post._used)post._used=[];
 let pool=bank.filter(l=>post._used.indexOf(l)<0);if(!pool.length){pool=bank;post._used=[];}
 let line=pool[rnd(0,pool.length-1)];post._used.push(line);if(post._used.length>40)post._used.shift();
 line=line.split("@AUTHOR").join("@"+post.author.split(" ")[0]);
 if(parent&&Math.random()<0.6)line="↳ @"+parent.split(" ")[0]+", "+line.charAt(0).toLowerCase()+line.slice(1);
 if(p==="Showman"&&Math.random()<0.45)line+=" 🔥";
 if(p==="Hawk"&&stance==="rival"&&Math.random()<0.5)line+=" Remember that.";
 if(p==="Diplomat"&&Math.random()<0.4)line="On the record: "+line.charAt(0).toLowerCase()+line.slice(1);
 try{if(typeof speak==="function")line=speak(actor,line);}catch(e){}
 return line;}catch(e){return null;}}
function aiReactor(post,exclude){exclude=exclude||[];const cands=WORLD.nations.filter(n=>!exclude.includes(n.name));if(!cands.length)return null;
 const author=WORLD.nations.find(n=>n.name===post.author);
 let tot=0;const ws=cands.map(n=>{let w=8+rnd(0,8);
  if(author){w+=(pairAff(n,author)-50)*0.35;if(n.region===author.region)w+=6;}
  if(S&&post.author===S.name)w+=(affinityTo(n)-50)*0.4;
  try{if(personaOf(n)==="Isolationist")w-=8;if(personaOf(n)==="Showman")w+=4;}catch(e){}
  w=Math.max(1,w);tot+=w;return w;});
 let r=Math.random()*tot;for(let i=0;i<cands.length;i++){r-=ws[i];if(r<=0)return cands[i];}return cands[0];}
/* ---------- staggered scheduler: replies land over minutes, not seconds ---------- */
function sched(act){try{if(!WORLD.sched)WORLD.sched=[];if(WORLD.sched.length>24)WORLD.sched.shift();WORLD.sched.push(act);}catch(e){}}
function processSched(){try{if(!WORLD||!WORLD.sched||!WORLD.sched.length)return;const now=Date.now();
 WORLD.sched=WORLD.sched.filter(s=>now-s.at<600000);
 const due=WORLD.sched.filter(s=>s.at<=now).slice(0,4);if(!due.length)return;
 WORLD.sched=WORLD.sched.filter(s=>due.indexOf(s)<0);
 for(const s of due){const post=(WORLD.feed||[]).find(p=>p.id===s.postId);if(!post)continue;
  const actor=WORLD.nations.find(n=>n.name===s.actor);if(!actor)continue;
  if(s.kind==="like"){if(!post.likedBy.includes(actor.name)){post.likedBy.push(actor.name);post.likes++;
   if(S&&post.author===S.name){bumpAffinity(actor.name,1);toast("👍 "+actor.name+" liked your post");}}}
  else if(s.kind==="comment"){if(post.comments.length<9){let txt=null;try{txt=socialReply(actor,post,s.parent);}catch(e){}
   if(!txt){try{txt=smartReply(post.body+" "+(post.comments[0]?post.comments[0].text:""),actor,post);}catch(e){}}
   if(txt){post.comments.push({author:actor.name,iso:actor.iso,t:Date.now(),text:txt,replyTo:s.parent||null});
   if(S&&(post.author===S.name||post.comments.some(c=>c.author===S.name))){bumpAffinity(actor.name,1);toast("💬 "+actor.name+" commented");}}}}
  else if(s.kind==="share"){feedAdd(actor,"♻️ Sharing @"+post.author.split(" ")[0]+": “"+post.body.slice(0,120)+"” — "+(s.note||"worth your eyes."),"post",null);}}}
 catch(e){}}
function respondToPlayerPost(post){try{
 const n1=aiReactor(post,[]);if(n1)sched({at:Date.now()+rnd(5,15)*1000,kind:"like",postId:post.id,actor:n1.name});
 const n2=aiReactor(post,n1?[n1.name]:[]);if(n2&&Math.random()<0.92)sched({at:Date.now()+rnd(12,35)*1000,kind:"comment",postId:post.id,actor:n2.name});
 if(Math.random()<0.55){const n3=aiReactor(post,[n1&&n1.name,n2&&n2.name].filter(Boolean));if(n3)sched({at:Date.now()+rnd(40,110)*1000,kind:Math.random()<0.6?"comment":"like",postId:post.id,actor:n3.name});}
 }catch(e){}}
/* ---------- post archetypes ---------- */
const POLLS=["Should the Assembly cap military spending?","Should endorsement-swapping be formal law?","Clean seas fund: double it?","Should new nations get starter aid?","Term limits for delegates: yes or no?"];
const GOODS=[["copper","coffee"],["timber","textiles"],["fish","steel"],["wine","wool"],["spices","silk"],["oil","grain"],["tea","copper"],["dates","timber"]];
const SPORTS=["Harbor Cup","Continental League","Founders Shield","Meridian Derby"];
function sportBody(n){const foes=WORLD.nations.filter(x=>x.name!==n.name);const f=foes[rnd(0,foes.length-1)];const a=rnd(0,3),b=rnd(0,3);const sp=SPORTS[rnd(0,SPORTS.length-1)];
 const win=a===b?"A thriller ends level — the replay sells out.":a>b?`${n.name} takes it! The harbor erupts.`:`${f.name} steals it late. Silence in ${n.capital||"the capital"}.`;
 return`⚽ ${sp}: ${n.name} ${a} – ${b} ${f.name}. ${win}`;}
function breakingBody(n){const opts=[];
 const top=[...WORLD.nations].sort((a,b)=>b.pop-a.pop);if(top[1]&&top[0].pop-top[1].pop<top[0].pop*0.05)opts.push(`📡 CENSUS SHAKE-UP: ${top[1].name} closes in on ${top[0].name} — gap under 5%!`);
 const ga=WORLD.wa.ga;opts.push(`📡 ASSEMBLY WATCH: ${ga.title} stands ${ga.for.toLocaleString()} FOR / ${ga.against.toLocaleString()} AGAINST.`);
 const h=WORLD.happenings[0];if(h)opts.push(`📡 WIRE: ${h.x}`);
 if(WORLD.memory&&WORLD.memory.length&&Math.random()<0.4){const m=WORLD.memory[rnd(0,WORLD.memory.length-1)];opts.push(`📡 REMEMBER: ${m.x}`);}
 return opts[rnd(0,opts.length-1)];}
function socialPost(n){const r=Math.random();let body,img=null;const media=r<0.4;
 if(r<0.13){const q=POLLS[rnd(0,POLLS.length-1)];body=`🗳️ POLL from ${n.capital||"the capital"}: ${q} Argue it out below — our clerks count every comment.`;}
 else if(r<0.25){body=sportBody(n);img={kind:"clip",clip:"stadium"};}
 else if(r<0.37){body=breakingBody(n);img=(typeof matchMedia==="function"?(matchMedia(n,body)||{kind:"chart"}):{kind:"chart"});}
 else if(r<0.47){body=`🎭 Festival of ${["Lanterns","Drums","Sails","Masks","Harvest"][rnd(0,4)]} opens in ${n.capital||"the capital"}! All nations welcome — bring appetite.`;img={kind:"clip",clip:"festival"};}
 else if(r<0.57){const g=GOODS[rnd(0,GOODS.length-1)];body=`⚖️ TRADE OPEN: ${n.name} offers ${g[0]} for ${g[1]}. Fair weights, swift ships. Terms by telegram.`;}
 else{body=livePostBody(n);}
 if(!img&&media&&typeof aiMediaFor==="function")img=aiMediaFor(n,"ambient",body);
 try{if(typeof speak==="function"&&Math.random()<0.5)body=speak(n,body);}catch(e){}
 if(S&&Math.random()<0.14&&affinityTo(n)>65)body+=" Our friends in "+S.name+" will love this.";
 return feedAdd(n,body,"post",img);}
/* enrich old seed posts with real conversations once */
setTimeout(()=>{try{if(!WORLD||!WORLD.feed)return;let touched=false;
 for(const p of WORLD.feed.slice(0,10)){if(p.comments.length>=3)continue;
  const author=WORLD.nations.find(n=>n.name===p.author);
  for(let i=p.comments.length;i<3&&Math.random()<0.8;i++){const c=aiReactor(p,p.comments.map(x=>x.author).concat([p.author]));
   if(!c)break;const txt=socialReply(c,p,p.comments[p.comments.length-1]?.author||null);
   if(!txt)continue;const cm={author:c.name,iso:c.iso,t:p.t+3600000*(i+1)+rnd(0,1800000),text:txt};if(p.comments.length)cm.replyTo=p.comments[p.comments.length-1].author;
   p.comments.push(cm);touched=true;
   if(c&&author&&Math.random()<0.25)addFeud(c.name,author.name,-2);}}
 if(touched)save();}catch(e){}},4000);
