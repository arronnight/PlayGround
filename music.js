/* CivilStrike Radio — music player sourced from popular YouTube playlists.
 * Audio-only by default (tiny hidden player, music keeps playing while you
 * rule); optional video mode. Stations = genre playlists (video-ID based
 * with auto-skip on error) + your own imports: paste any YouTube playlist
 * or video URL and it becomes a station. Shuffles like a radio, persists
 * station/volume in its own localStorage key so game saves stay untouched. */
"use strict";
const RADIO_LS="civilstrike-radio";
const RADIO_STATIONS=[
 {id:"lofi",sec:"genre",name:"Lofi & Chill",icon:"🎧",desc:"24/7 lofi streams — study, rule, unwind.",query:"lofi hip hop radio beats to relax study",
  videos:["jfKfPfyJRdk","5qap5aO4i9A","4xDzrJKXOOY"]},
 {id:"hits",sec:"genre",name:"Global Hits",icon:"🔥",desc:"The biggest music videos on YouTube.",query:"global top music videos hits",
  videos:["9bZkp7q19f0","kJQP7kiw5Fk","JGwWNGJdvx8","RgKAFK5djSk","dQw4w9WgXcQ","OPf0YbXqDmQ"]},
 {id:"rock",sec:"genre",name:"Rock Anthems",icon:"🎸",desc:"Stadium-sized riffs, all eras.",query:"rock anthems greatest hits",
  videos:["fJ9rUzIMcZQ","1w7OgIMMRc4","pAgnJDJN4VA"]},
 {id:"pop",sec:"genre",name:"Pop Ballads",icon:"🎤",desc:"Big voices, big choruses.",query:"pop ballads greatest hits divas",
  videos:["YQHsXMglC9A","hLQl3WQQ6cQ","RgKAFK5djSk","JGwWNGJdvx8"]},
 {id:"kpop",sec:"genre",name:"K-Pop Hits",icon:"💜",desc:"Seoul to the world.",query:"k-pop greatest hits",
  videos:["9bZkp7q19f0","gdZLi9oWNZg","ioNng23DkIM"]},
 {id:"edm",sec:"genre",name:"EDM Nights",icon:"🎹",desc:"Festival energy for late decrees.",query:"edm festival anthems greatest",
  videos:["60ItHLz5WEA","JRfuAukYQXY","IcrbM1l_BoI"]},
 {id:"eighties",sec:"genre",name:"80s Rewind",icon:"🕺",desc:"Neon, hairspray, moonwalks.",query:"80s greatest hits",
  videos:["djV11Xbc914","Zi_XLOBDo_Y","sOnqjkJTMaA"]},
 {id:"hiphop",sec:"genre",name:"Hip-Hop",icon:"🧢",desc:"Bars, beats, bravado.",query:"hip hop greatest hits",
  videos:["_Yhyp-_hX2s","tvTRZJ-4EyI","xpVfcZ0ZcFM"]},
 {id:"disco",sec:"genre",name:"Disco & Funk",icon:"🪩",desc:"Mirrorballs and basslines.",query:"disco funk greatest hits",
  videos:["I_izvAbhExY","h5EofwRzit0","OPf0YbXqDmQ"]},
 {id:"indie",sec:"genre",name:"Alt & Indie",icon:"🎶",desc:"Anthems from the other stage.",query:"indie alternative anthems greatest",
  videos:["XFkzRNyygfk","6hzrDeM6h3I","gGdGFtwCNBE"]},
 {id:"jazz",sec:"genre",name:"Jazz Classics",icon:"🎷",desc:"Smoke, brass, blue notes.",query:"jazz classics greatest hits",
  videos:["vmDDOFXSgAs","ZEcqHA7dbwM","hTWKbfoikeg"]},
 {id:"metal",sec:"genre",name:"Metal",icon:"🤘",desc:"Loud. Louder. Loudest.",query:"metal greatest hits",
  videos:["S7blkuiAjs8","CD-E_LDc384"]},
 {id:"latin",sec:"genre",name:"Latin Fiesta",icon:"💃",desc:"Perreo, romance, fiesta.",query:"latin reggaeton fiesta hits",
  videos:["7zp1TbLFPp8","kJQP7kiw5Fk"]},
 {id:"kids",sec:"genre",name:"Family & Kids",icon:"🧸",desc:"Sing-alongs for the whole harbor.",query:"kids sing along hits",
  videos:["XqZsoesa55w","moSFlvxnbgk"]},
 {id:"punk",sec:"genre",name:"Punk",icon:"🤟",desc:"Three chords, no masters.",query:"punk rock greatest hits ramones clash",videos:[]},
 {id:"numetal",sec:"genre",name:"Nu Metal",icon:"⛓️",desc:"Drop-tuned millennium angst.",query:"nu metal greatest hits linkin park",videos:[]},
 {id:"grunge",sec:"genre",name:"Grunge",icon:"🌧️",desc:"Flannel, fuzz, Seattle rain.",query:"grunge greatest hits nirvana pearl jam",videos:[]},
 {id:"house",sec:"genre",name:"House",icon:"🏠",desc:"Four on the floor, all night.",query:"house music greatest hits",videos:[]},
 {id:"randb",sec:"genre",name:"R&B",icon:"🌙",desc:"Slow jams and smooth operators.",query:"90s 2000s r&b greatest hits",videos:[]},
 {id:"soul",sec:"genre",name:"Soul",icon:"✨",desc:"Motown, Stax, pure feeling.",query:"soul motown greatest hits",videos:[]},
 {id:"metalcore",sec:"genre",name:"Metalcore",icon:"💀",desc:"Breakdowns and clean choruses.",query:"metalcore greatest hits",videos:[]},
 {id:"d1920",sec:"decade",name:"1920s",icon:"🎞️",desc:"Jazz age top tunes.",query:"top hits of the 1920s",videos:[]},
 {id:"d1930",sec:"decade",name:"1930s",icon:"🎞️",desc:"Swing era standards.",query:"top hits of the 1930s",videos:[]},
 {id:"d1940",sec:"decade",name:"1940s",icon:"🎞️",desc:"Big band & crooners.",query:"top hits of the 1940s",videos:[]},
 {id:"d1950",sec:"decade",name:"1950s",icon:"📻",desc:"Rock 'n' roll is born.",query:"top hits of the 1950s rock and roll",videos:[]},
 {id:"d1960",sec:"decade",name:"1960s",icon:"📻",desc:"British invasion & soul.",query:"top hits of the 1960s",videos:[]},
 {id:"d1970",sec:"decade",name:"1970s",icon:"📻",desc:"Disco, prog & punk.",query:"top hits of the 1970s",videos:[]},
 {id:"d1980",sec:"decade",name:"1980s",icon:"📻",desc:"Synths & superstars.",query:"top hits of the 1980s",videos:[]},
 {id:"d1990",sec:"decade",name:"1990s",icon:"📻",desc:"Grunge, hip-hop, boy bands.",query:"top hits of the 1990s",videos:[]},
 {id:"d2000",sec:"decade",name:"2000s",icon:"💿",desc:"TRL era bangers.",query:"top hits of the 2000s",videos:[]},
 {id:"d2010",sec:"decade",name:"2010s",icon:"💿",desc:"Streaming takes over.",query:"top hits of the 2010s",videos:[]},
 {id:"d2020",sec:"decade",name:"2020s",icon:"💿",desc:"Modern chart storm.",query:"top hits of the 2020s",videos:[]}
];
/* Live tuner: resolve a station's query into real tracks via Piped search
 * APIs (no key needed). Tries instances in order, caches hits 24h. */
const SEARCH_INSTANCES=["https://api.piped.private.coffee","https://pipedapi.kavin.rocks","https://pipedapi.reallyaweso.me"];
function st_live(st,tracks){st._live=tracks;}
function st_tracks(st){if(st._live&&st._live.length)return st._live;return(st.videos||[]).map(id=>({id:id,title:null}));}
const Radio={
 player:null,ready:false,apiLoading:false,queue:[],_resolving:{},
 state:{station:"lofi",idx:0,playing:false,volume:70,muted:false,showVideo:false,custom:[]},
 order:[],opPtr:0,
  load(){try{const d=JSON.parse(localStorage.getItem(RADIO_LS));if(d&&typeof d==="object")this.state=Object.assign(this.state,d);}catch(e){}
  if(!this.state.cache)this.state.cache={};
  try{const now=Date.now();for(const s of RADIO_STATIONS){const c=this.state.cache[s.id];if(c&&c.tracks&&c.tracks.length&&now-c.at<24*3600*1000)st_live(s,c.tracks);}}catch(e){}},
 save(){try{localStorage.setItem(RADIO_LS,JSON.stringify(this.state));}catch(e){}},
 stations(){return RADIO_STATIONS.concat(this.state.custom||[]);},
 station(){return this.stations().find(s=>s.id===this.state.station)||this.stations()[0];},
 ensureAPI(cb){if(window.YT&&window.YT.Player){this.ready=true;cb&&cb();return;}
  if(this.apiLoading){const iv=setInterval(()=>{if(window.YT&&window.YT.Player){clearInterval(iv);this.ready=true;cb&&cb();}},300);return;}
  this.apiLoading=true;window.__radioAPIQueue=window.__radioAPIQueue||[];if(cb)window.__radioAPIQueue.push(cb);
  window.onYouTubeIframeAPIReady=()=>{this.ready=true;(window.__radioAPIQueue||[]).forEach(f=>{try{f();}catch(e){}});window.__radioAPIQueue=[];};
  const t=document.createElement("script");t.src="https://www.youtube.com/iframe_api";document.head.appendChild(t);},
 ensurePlayer(cb){this.ensureAPI(()=>{if(this.player){cb&&cb();return;}
  try{this.player=new YT.Player("yt-audio",{height:"2",width:"2",
   host:"https://www.youtube-nocookie.com",
   playerVars:{autoplay:0,controls:0,disablekb:1,fs:0,rel:0},
   events:{onReady:()=>{try{this.player.setVolume(this.state.muted?0:this.state.volume);}catch(e){}cb&&cb();},
    onStateChange:e=>this.onState(e),onError:()=>this.onError()}});}catch(e){toast("Radio: player failed to start.");}});},
 onState(e){const YS=window.YT&&YT.PlayerState?YT.PlayerState:{ENDED:0,PLAYING:1,PAUSED:2};
  if(e.data===YS.ENDED){this.next(true);}
  else if(e.data===YS.PLAYING){this.state.playing=true;this._skips=0;this.save();this.paint();}
  else if(e.data===YS.PAUSED){this.state.playing=false;this.save();this.paint();}},
  onError(){const st=this.station();this._skips=(this._skips||0)+1;
  const tracks=st_tracks(st).length||1;const now=Date.now();
  if(this._skips>=tracks*2+2){this._skips=0;this._giveUp(st);return;}
  if(!this._lastSkipToast||now-this._lastSkipToast>30000){this._lastSkipToast=now;
   toast(`Radio: skipped an unavailable track on ${st?st.name:"station"}.`);}
  this.next(true);},
  current(){const st=this.station();if(!st)return null;
   if(st.playlist)return{playlist:st.playlist};
   const tr=st_tracks(st);if(!tr.length)return null;
   if(!this.order.length||this.order._sid!==st.id+"@"+tr.length){this.order=this.shuffle(tr.map((_,i)=>i));this.order._sid=st.id+"@"+tr.length;this.opPtr=0;}
   const t=tr[this.order[this.opPtr%this.order.length]];return{videos:tr.map(x=>x.id),id:t.id,title:t.title};},
 shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;},
  play(stationId,idx){let changed=false;
   if(stationId&&stationId!==this.state.station){this.state.station=stationId;this.order=[];changed=true;}
   const st=this.station();
   if(st.query&&!st._live&&!(st._deadUntil>Date.now())){toast("🔎 Tuning to "+st.name+"…");this.resolveStation(st);this.paint();return;}
   if(typeof idx==="number"){const tr=st_tracks(st);const pos=this.order.indexOf(idx);if(pos>=0)this.opPtr=pos;else{this.order=[idx].concat(this.shuffle(tr.map((_,i)=>i).filter(i=>i!==idx)));this.order._sid=st.id+"@"+tr.length;this.opPtr=0;}}
  this.state.playing=true;this.save();
  if(changed)toast("▶ "+st.icon+" "+st.name);
  this.ensurePlayer(()=>{const c=this.current();if(!c){toast("Radio: this station is empty.");return;}
   try{if(c.playlist){this.player.loadPlaylist({list:c.playlist,listType:"playlist"});}
   else{this.player.loadVideoById(c.id,0);}this.player.setVolume(this.state.muted?0:this.state.volume);}catch(e){toast("Radio: could not start playback.");}});
  this.paint();this.watchdog();},
 pause(){this.state.playing=false;this.save();try{this.player&&this.player.pauseVideo();}catch(e){}this.paint();},
 toggle(){if(this.state.playing){this.pause();return;}
  let resumed=false;
  if(this.player){try{const d=this.player.getVideoData&&this.player.getVideoData();if(d&&d.video_id){this.player.playVideo();resumed=true;}}catch(e){}}
  if(resumed){this.state.playing=true;this.save();this.paint();this.watchdog();}
  else this.play();},
 watchdog(){setTimeout(()=>{try{
   if(!this.state.playing||!this.player||!this.player.getPlayerState)return;
   const s=this.player.getPlayerState();
   if(s===-1||s===2||s===5){this.state.playing=false;this.save();this.paint();
    toast("🔇 Browser held the audio — tap ▶ once to start the music.");}
  }catch(e){}},3000);},
  next(auto){const st=this.station();if(!st)return;const n=st_tracks(st).length||1;
  this.opPtr=(this.opPtr+1)%Math.max(1,n);
  if(!this.player){if(!auto)this.play();return;}
  try{const c=this.current();
   if(c.playlist){this.player.nextVideo();}
   else{this.player.loadVideoById(c.id,0);}
   this.state.playing=true;this.save();}catch(e){}this.paint();},
  prev(){const st=this.station();if(!st)return;const n=st_tracks(st).length||1;
  this.opPtr=(this.opPtr-1+n)%Math.max(1,n);
  if(!this.player){this.play();return;}
  try{const c=this.current();
   if(c.playlist){this.player.previousVideo();}
   else{this.player.loadVideoById(c.id,0);}
   this.state.playing=true;this.save();}catch(e){}this.paint();},
 setVolume(v){this.state.volume=Math.max(0,Math.min(100,v));this.save();try{this.player&&this.player.setVolume(this.state.muted?0:this.state.volume);}catch(e){}this.paint();},
 toggleMute(){this.state.muted=!this.state.muted;this.save();try{this.player&&(this.state.muted?this.player.mute():this.player.unMute());if(!this.state.muted)this.player.setVolume(this.state.volume);}catch(e){}this.paint();},
  now(){try{if(this.player&&this.player.getVideoData){const d=this.player.getVideoData();if(d&&(d.title||d.author))return{title:d.title||"Unknown track",author:d.author||""};}}catch(e){}
   const c=this.current();const st=this.station();
   if(c&&c.title)return{title:c.title,author:(st?st.name+" • ":"")+"YouTube"};
   return{title:(st?st.name:"Radio")+(c&&c.id?" • track "+(this.opPtr+1):""),author:"YouTube"};},
 resolveStation(st){if(this._resolving[st.id])return;this._resolving[st.id]=true;
  const insts=SEARCH_INSTANCES.slice();
  const finish=(tracks)=>{this._resolving[st.id]=false;
   if(tracks&&tracks.length>=3){st_live(st,tracks);st._deadUntil=0;
    this.state.cache[st.id]={at:Date.now(),tracks:tracks};
    this.save();this.order=[];toast("▶ "+st.icon+" "+st.name+" — "+tracks.length+" tracks");this.play();}
   else{st._deadUntil=Date.now()+10*60*1000;this.save();
    if((st.videos||[]).length){toast("⚠ Live search failed — playing standby tracks.");this.order=[];this.play();}
    else{toast("📻 Couldn't tune "+st.name+" — check connection and retry.");this.paint();}}};
  const pick=(d)=>{const items=((d&&(d.items||[]))||[]);const shorts=[],longs=[];
   for(const it of items){const ty=it.type||"video";if(ty!=="video"&&ty!=="stream")continue;
    const m=String(it.url||"").match(/v=([a-zA-Z0-9_-]{6,})/);if(!m)continue;
    const dur=+it.duration||0;if(dur&&dur<90)continue;
    const t={id:m[1],title:(it.title||"Unknown").slice(0,80)};
    if(!dur||dur<=900){if(shorts.length<14)shorts.push(t);}else if(longs.length<4)longs.push(t);}
   return shorts.concat(longs).slice(0,14);};
  const attempt=()=>{if(!insts.length){finish(null);return;}
   const inst=insts.shift();let to=null;
   try{to=AbortSignal.timeout(9000);}catch(e){}
   fetch(inst+"/search?q="+encodeURIComponent(st.query)+"&filter=videos",to?{signal:to}:{})
    .then(r=>{if(!r.ok)throw 0;return r.json();}).then(d=>{const v=pick(d);if(v.length>=3)finish(v);else attempt();})
    .catch(()=>attempt());};
  attempt();},
 addCustom(url){const m=String(url||"").match(/[?&]list=([a-zA-Z0-9_-]+)/);const v=String(url||"").match(/(?:v=|\.be\/|shorts\/)([a-zA-Z0-9_-]{6,})/);
  if(!m&&!v){alert("Paste a YouTube playlist or video URL.");return false;}
  const id="custom"+Date.now().toString(36);
  if(m){this.state.custom.push({id,name:"Custom Playlist "+(this.state.custom.length+1),icon:"📻",desc:"Imported YouTube playlist.",playlist:m[1]});}
  else{this.state.custom.push({id,name:"Custom Track "+(this.state.custom.length+1),icon:"🎵",desc:"Imported YouTube video.",videos:[v[1]]});}
  this.save();return id;},
 removeCustom(id){this.state.custom=(this.state.custom||[]).filter(s=>s.id!==id);if(this.state.station===id)this.state.station="lofi";this.order=[];this.save();render();},
 paint(){const bar=$("#radio-mini");if(bar){const n=this.now();const st=this.station();
   bar.querySelector(".rm-t").textContent=(this.state.playing?"▶ ":"⏸ ")+(n.title||"Radio");
   bar.querySelector(".rm-s").textContent=(st?st.icon+" "+st.name+" • ":"")+esc(n.author||"");
   const pb=bar.querySelector(".rm-play");if(pb)pb.textContent=this.state.playing?"⏸":"▶";}
  const holder=$("#yt-audio-holder");if(holder)holder.classList.toggle("big",!!this.state.showVideo);
  if(VIEW==="radio"){const el=$("#radio-now");if(el){const n=this.now();el.innerHTML=`<b>${esc(n.title)}</b><br><span class="kv">${esc(n.author||"")}</span>`;}}},
 tick(){this.paint();this.stallCheck();},
 stallCheck(){try{
   if(!this.state.playing||!this.player||!this.player.getPlayerState)return;
   const s=this.player.getPlayerState();let t=0;try{t=this.player.getCurrentTime()||0;}catch(e){}
   const now=Date.now();
   if(s===3&&t<=0){if(!this._stallSince)this._stallSince=now;
    if(now-this._stallSince>15000){this._stallSince=0;this._skipStall();}}
   else this._stallSince=0;
  }catch(e){}},
 _giveUp(st){this.state.playing=false;this.save();const now=Date.now();
  if(this._lastGiveUpStation!==(st&&st.id)||now-(this._lastGiveUpAt||0)>120000){
   this._lastGiveUpStation=st&&st.id;this._lastGiveUpAt=now;
   toast("📻 "+(st?st.name:"This station")+" won't play from this network — try another station.");}
  this.paint();},
 _skipStall(){this._skips=(this._skips||0)+1;const st=this.station();const tracks=st_tracks(st).length||1;
  if(this._skips>=tracks*2+2){this._skips=0;this._giveUp(st);return;}
  this.next(true);},
};
window.Radio=Radio;
window.radioToggle=()=>Radio.toggle();
window.radioNext=()=>Radio.next();
window.radioPrev=()=>Radio.prev();
window.radioPlay=i=>{Radio.play(Radio.state.station,i);};
window.radioStation=id=>{Radio.play(id);if(VIEW!=="radio")go("radio");else render();};
window.radioVol=v=>Radio.setVolume(+v);
window.radioMute=()=>Radio.toggleMute();
window.radioVideo=()=>{Radio.state.showVideo=!Radio.state.showVideo;Radio.save();render();};
window.radioImport=()=>{const inp=$("#radio-url");if(!inp)return;const id=Radio.addCustom(inp.value.trim());if(id){inp.value="";Radio.play(id);}render();};
window.radioRemove=id=>Radio.removeCustom(id);
function radioMiniHTML(){return `<div id="radio-mini"><span class="rm-dot"></span><span class="rm-txt"><span class="rm-t">⏸ Radio</span><br><span class="rm-s kv">pick a station</span></span><button class="btn small rm-play" onclick="radioToggle()">▶</button><button class="btn small" onclick="radioPrev()">⏮</button><button class="btn small" onclick="radioNext()">⏭</button><button class="btn small" onclick="go('radio')">📻</button></div><div id="yt-audio-holder"><div id="yt-audio"></div></div>`;}
function vRadio(m){const sts=Radio.stations();const cur=Radio.station();const n=Radio.now();
 m.innerHTML=`<div class="card"><h2>📻 CivilStrike Radio <span class="badge">LIVE AUDIO</span></h2>
  <p class="kv">Live radio — every station is tuned by searching YouTube for its genre or decade, then shuffled. No fixed playlists: the music is found fresh. Unavailable tracks are skipped automatically.</p>
 <div class="radio-now"><div id="radio-now"><b>${esc(n.title)}</b><br><span class="kv">${esc(n.author||"")}</span></div>
 <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:8px">
 <button class="btn small" onclick="radioPrev()">⏮ Prev</button>
 <button class="btn small primary" onclick="radioToggle()">${Radio.state.playing?"⏸ Pause":"▶ Play"}</button>
 <button class="btn small" onclick="radioNext()">Next ⏭</button>
 <button class="btn small" onclick="radioMute()">${Radio.state.muted?"🔇 Muted":"🔊 Sound"}</button>
 <input type="range" min="0" max="100" value="${Radio.state.volume}" oninput="radioVol(this.value)" style="width:120px">
 <button class="btn small" onclick="radioVideo()">${Radio.state.showVideo?"🎧 Audio-only":"📺 Show video"}</button></div>
 ${Radio.state.showVideo?`<div class="kv" style="margin-top:6px">Video mode shows the YouTube picture for the current track. <span style="opacity:.7">(YouTube playback — video by its owner.)</span></div>`:""}</div></div>
  <div class="card"><h3>🎸 Genres</h3><div class="radio-grid">${sts.filter(s=>(s.sec||"genre")==="genre"&&!s.id.startsWith("custom")).map(s=>`<div class="radio-st${s.id===cur.id?" on":""}" onclick="radioStation('${s.id}')"><div style="font-size:26px">${s.icon}</div><b>${esc(s.name)}</b><div class="kv">${esc(s.desc||"")}</div><div class="kv">${(s._live&&s._live.length)?s._live.length+" tracks • live":"🔎 tap to tune"}</div></div>`).join("")}</div></div>
  <div class="card"><h3>📅 Decades — top songs, 1920s to now</h3><div class="radio-grid">${sts.filter(s=>s.sec==="decade").map(s=>`<div class="radio-st${s.id===cur.id?" on":""}" onclick="radioStation('${s.id}')"><div style="font-size:26px">${s.icon}</div><b>${esc(s.name)}</b><div class="kv">${esc(s.desc||"")}</div><div class="kv">${(s._live&&s._live.length)?s._live.length+" tracks • live":"🔎 tap to tune"}</div></div>`).join("")}</div></div>
  ${sts.some(s=>s.id.startsWith("custom"))?`<div class="card"><h3>📻 Your stations</h3><div class="radio-grid">${sts.filter(s=>s.id.startsWith("custom")).map(s=>`<div class="radio-st${s.id===cur.id?" on":""}" onclick="radioStation('${s.id}')"><div style="font-size:26px">${s.icon}</div><b>${esc(s.name)}</b><div class="kv">${esc(s.desc||"")}</div><div class="kv">${s.playlist?"📃 playlist":(s.videos||[]).length+" tracks"} • <a href="#" onclick="event.stopPropagation();radioRemove('${s.id}')">remove</a></div></div>`).join("")}</div></div>`:""}
 <div class="card"><h3>➕ Add a YouTube playlist</h3><p class="kv">Paste any popular playlist URL (e.g. <i>youtube.com/playlist?list=…</i>) or video URL — it becomes a radio station.</p><div style="display:flex;gap:6px"><input id="radio-url" placeholder="https://www.youtube.com/playlist?list=…"><button class="btn small primary" onclick="radioImport()">Add station</button></div></div>
  <div class="card"><h3>On this station${cur.playlist?" (playlist)":""}${cur._live?" • tuned live":""}</h3>${cur.playlist?`<div class="kv">📃 Full YouTube playlist — tracks load in order/shuffle from YouTube itself. Use Next/Prev to move.</div>`:(()=>{const tr=st_tracks(cur);if(!tr.length)return `<div class="kv">🔎 Tap this station's card above to tune it — tracks are found live.</div>`;return tr.map((t,i)=>`<div class="forumline"><span>${i===Radio.order[Radio.opPtr%Math.max(1,Radio.order.length)]&&Radio.state.playing?"▶":"・"} ${t.title?esc(t.title):"Track "+(i+1)}${t.title?"":` <span class="kv">(${t.id})</span>`}</span><span><button class="btn small" onclick="radioPlay(${i})">Play</button></span></div>`).join("");})()}</div>`;
 try{if(typeof window.__watchVideos==="function")window.__watchVideos();}catch(e){}}
setInterval(()=>{try{Radio.tick();}catch(e){}},2000);
Radio.load();
try{Radio.ensurePlayer(()=>{});}catch(e){}
