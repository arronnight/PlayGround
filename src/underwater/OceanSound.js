import { soundscapeMix } from './OceanEcology.js';
import { seeded } from './WorldMath.js';

// Synthesized water, surf, reef transients and distant calls. No recordings,
// autoplay, microphones, network requests, or additional runtime dependencies.
export class OceanSound {
  constructor(app){
    this.app=app;this.enabled=false;this.volume=.35;this.random=seeded(8173);
    this.lastSnap=0;this.nextCall=0;this.voices=new Set();this.mix=soundscapeMix();
    this.onVisibility=()=>{if(document.hidden&&this.context)this.master.gain.setTargetAtTime(0,this.context.currentTime,.06);};
    document.addEventListener('visibilitychange',this.onVisibility);
    window.addEventListener('pagehide',()=>this.dispose(),{once:true});
  }
  create(){
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)throw new Error('Audio is not available in this browser.');
    const context=this.context=new Audio();
    this.master=context.createGain();this.master.gain.value=0;
    const limiter=context.createDynamicsCompressor();limiter.threshold.value=-20;limiter.knee.value=16;limiter.ratio.value=8;
    this.master.connect(limiter);limiter.connect(context.destination);
    const buffer=context.createBuffer(2,context.sampleRate*7,context.sampleRate);
    for(let channel=0;channel<2;channel++){
      const data=buffer.getChannelData(channel);let brown=0;
      for(let i=0;i<data.length;i++){
        const white=this.random()*2-1;brown=(brown+.024*white)/1.024;
        // Fade the loop seam without a click; independent channels keep the
        // water broad without placing a source inside the listener's head.
        const edge=Math.min(1,i/2500,(data.length-1-i)/2500);
        data[i]=(white*.32+brown*1.8)*edge;
      }
    }
    this.noise=context.createBufferSource();this.noise.buffer=buffer;this.noise.loop=true;
    this.surfFilter=context.createBiquadFilter();this.surfFilter.type='lowpass';this.surfFilter.frequency.value=2200;
    this.waterFilter=context.createBiquadFilter();this.waterFilter.type='lowpass';this.waterFilter.frequency.value=440;
    this.surf=context.createGain();this.water=context.createGain();this.surf.gain.value=0;this.water.gain.value=0;
    this.noise.connect(this.surfFilter);this.surfFilter.connect(this.surf);this.surf.connect(this.master);
    this.noise.connect(this.waterFilter);this.waterFilter.connect(this.water);this.water.connect(this.master);this.noise.start();
    this.snapBuffer=context.createBuffer(1,Math.round(context.sampleRate*.05),context.sampleRate);
    const snap=this.snapBuffer.getChannelData(0);
    for(let i=0;i<snap.length;i++)snap[i]=(this.random()*2-1)*Math.exp(-i/(context.sampleRate*.0035));
    // Precambrian vent rumble: the shared noise bed through its own deep
    // lowpass. Silent until an ancient sea asks for it.
    this.rumbleFilter=context.createBiquadFilter();this.rumbleFilter.type='lowpass';this.rumbleFilter.frequency.value=80;
    this.rumbleGain=context.createGain();this.rumbleGain.gain.value=0;
    this.noise.connect(this.rumbleFilter);this.rumbleFilter.connect(this.rumbleGain);this.rumbleGain.connect(this.master);
    this.nextClick=0;this.nextBoom=8;this.nextWhistle=5;this.nextTrain=14;
  }
  async setEnabled(on){
    if(on){
      try{if(!this.context)this.create();await this.context.resume();}
      catch(error){this.enabled=false;this.context?.close().catch(()=>{});this.context=null;throw error;}
    }
    this.enabled=on;
    if(this.context&&!on)this.master.gain.setTargetAtTime(0,this.context.currentTime,.08);
    return on;
  }
  update(){
    if(!this.context||!this.enabled)return;
    const a=this.app,w=a.underwater,p=a.camera.position,depth=a.waterInterface.height-p.y;
    const reef=(w.localBiome?.coral??0)*w.settings.life;
    const whale=w.sites.get('blue').life.animals.find(animal=>animal.type==='whale');
    let proximity=0;
    if(whale){const pos=whale.mesh.position,site=w.sites.get('blue').habitat.origin;proximity=Math.max(0,1-Math.hypot(p.x-pos.x-site[0],p.y-pos.y,p.z-pos.z-site[1])/220);}
    const mix=this.mix=soundscapeMix({depth,wind:a.weather.state.windSpeed,storm:a.weather.state.storm,reef,whale:proximity,volume:this.volume,paused:a.paused,hidden:document.hidden});
    const t=this.context.currentTime,surge=.72+.28*Math.sin(a.time*.57+Math.sin(a.time*.17));
    this.master.gain.setTargetAtTime(mix.master,t,.18);
    this.surf.gain.setTargetAtTime(mix.surf*surge,t,.3);this.water.gain.setTargetAtTime(mix.water,t,.4);
    this.surfFilter.frequency.setTargetAtTime(mix.cutoff,t,.3);
    if(mix.master>0&&a.time-this.lastSnap>.14){
      this.lastSnap=a.time;
      if(this.random()<mix.reef*.35)this.snap(mix.reef,t);
    }
    if(mix.master>0&&mix.whale>.1&&a.time>this.nextCall){this.nextCall=a.time+18+this.random()*24;this.call(mix.whale,t);}
    if(mix.master>0)this.eraVoice(a.underwater.recipe?.era||'modern',a.time,mix,t);
  }
  snap(strength,time){
    const c=this.context,source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),pan=c.createStereoPanner();
    source.buffer=this.snapBuffer;filter.type='highpass';filter.frequency.value=1300;
    gain.gain.value=.015*strength;pan.pan.value=this.random()*2-1;
    source.connect(filter);filter.connect(gain);gain.connect(pan);pan.connect(this.master);source.start(time);
    source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();pan.disconnect();};
  }
  call(strength,time){
    const c=this.context,osc=c.createOscillator(),overtone=c.createOscillator(),gain=c.createGain(),filter=c.createBiquadFilter();
    const length=3+this.random()*2,start=85+this.random()*60;
    osc.type='sine';overtone.type='sine';filter.type='lowpass';filter.frequency.value=620;
    osc.frequency.setValueAtTime(start,time);osc.frequency.exponentialRampToValueAtTime(start*1.7,time+length*.42);osc.frequency.exponentialRampToValueAtTime(start*.72,time+length);
    overtone.frequency.setValueAtTime(start*2.01,time);overtone.frequency.exponentialRampToValueAtTime(start*1.45,time+length);
    gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.014*strength,time+.8);gain.gain.linearRampToValueAtTime(0,time+length);
    osc.connect(filter);overtone.connect(filter);filter.connect(gain);gain.connect(this.master);
    this.voices.add(osc);this.voices.add(overtone);osc.start(time);overtone.start(time);osc.stop(time+length+.05);overtone.stop(time+length+.05);
    osc.onended=()=>{this.voices.delete(osc);this.voices.delete(overtone);osc.disconnect();overtone.disconnect();filter.disconnect();gain.disconnect();};
  }
  dispose(){
    document.removeEventListener('visibilitychange',this.onVisibility);
    if(!this.context)return;
    this.enabled=false;this.noise.stop();for(const voice of this.voices)try{voice.stop();}catch{}
    this.context.close().catch(()=>{});this.context=null;
  }

  // Era soundscapes. Every voice is synthesized from oscillators and filtered
  // noise — speculative reconstructions of ancient anatomy, not recordings.
  eraVoice(era,time,mix,t){
    const c=this.context;
    // Precambrian: geophony only. A slow-breathing low rumble under the water.
    const swell=.5+.5*Math.sin(time*.11+Math.sin(time*.043)*2);
    this.rumbleGain.gain.setTargetAtTime(era==='precambrian'?mix.master*.055*(.35+.65*swell):0,t,.5);
    if(era==='modern'||era==='precambrian')return;
    if(era==='paleozoic'&&time>this.nextClick){
      this.nextClick=time+.5+this.random()*2.4;
      this.clickPaleo(t);
    }
    if(era==='mesozoic'&&time>this.nextBoom){
      this.nextBoom=time+16+this.random()*22;
      this.boom(t);
    }
    if(era==='cenozoic'){
      if(time>this.nextWhistle){this.nextWhistle=time+9+this.random()*14;this.whistle(t);}
      if(time>this.nextTrain){this.nextTrain=time+18+this.random()*16;this.clickTrain(t);}
    }
  }
  // Chitin snap: a noise impulse through a high-Q bandpass, shell-on-shell.
  clickPaleo(time){
    const c=this.context,source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),pan=c.createStereoPanner();
    source.buffer=this.snapBuffer;filter.type='bandpass';filter.frequency.value=2400+this.random()*2800;filter.Q.value=7;
    gain.gain.setValueAtTime(.02*(.5+this.random()*.5),time);gain.gain.exponentialRampToValueAtTime(.0004,time+.09);
    pan.pan.value=this.random()*2-1;
    source.connect(filter);filter.connect(gain);gain.connect(pan);pan.connect(this.master);
    source.start(time);source.stop(time+.12);
    source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();pan.disconnect();};
    if(this.random()<.3){
      const osc=c.createOscillator(),g2=c.createGain();
      osc.type='sine';osc.frequency.setValueAtTime(95,time);osc.frequency.exponentialRampToValueAtTime(55,time+.28);
      g2.gain.setValueAtTime(.02,time);g2.gain.exponentialRampToValueAtTime(.0005,time+.3);
      osc.connect(g2);g2.connect(this.master);osc.start(time);osc.stop(time+.35);
      this.voices.add(osc);osc.onended=()=>{this.voices.delete(osc);osc.disconnect();g2.disconnect();};
    }
  }
  // Cranial cavity boom: low sine pair gliding down through a tight lowpass.
  boom(time){
    const c=this.context,duration=2.8+this.random()*1.4,base=34+this.random()*22;
    const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=140;
    const out=c.createGain();out.gain.value=1;filter.connect(out);out.connect(this.master);
    for(const [mult,peak] of [[1,.05],[1.5,.02]]){
      const osc=c.createOscillator(),gain=c.createGain();
      osc.type='sine';osc.frequency.setValueAtTime(base*mult,time);osc.frequency.exponentialRampToValueAtTime(base*mult*.62,time+duration);
      gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(peak,time+.25);gain.gain.linearRampToValueAtTime(0,time+duration);
      osc.connect(gain);gain.connect(filter);osc.start(time);osc.stop(time+duration+.05);
      this.voices.add(osc);
      osc.onended=()=>{this.voices.delete(osc);osc.disconnect();gain.disconnect();};
    }
    setTimeout(()=>{try{filter.disconnect();out.disconnect();}catch{}},(duration+.3)*1000);
  }
  // Melon whistle: frequency-modulated sine sweep, nasal-plug style.
  whistle(time){
    const c=this.context,length=1.1+this.random()*.9,start=900+this.random()*700;
    const carrier=c.createOscillator(),mod=c.createOscillator(),modGain=c.createGain(),gain=c.createGain(),filter=c.createBiquadFilter();
    carrier.type='sine';mod.type='sine';filter.type='lowpass';filter.frequency.value=5200;
    carrier.frequency.setValueAtTime(start,time);
    carrier.frequency.linearRampToValueAtTime(start*1.9,time+length*.45);
    carrier.frequency.linearRampToValueAtTime(start*1.2,time+length);
    mod.frequency.value=5.5;modGain.gain.value=start*.28;
    mod.connect(modGain);modGain.connect(carrier.frequency);
    gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.012,time+.18);gain.gain.linearRampToValueAtTime(0,time+length);
    carrier.connect(filter);filter.connect(gain);gain.connect(this.master);
    this.voices.add(carrier);this.voices.add(mod);
    carrier.start(time);mod.start(time);carrier.stop(time+length+.05);mod.stop(time+length+.05);
    carrier.onended=()=>{this.voices.delete(carrier);this.voices.delete(mod);carrier.disconnect();mod.disconnect();modGain.disconnect();filter.disconnect();gain.disconnect();};
  }
  // Echolocation click train: broadband ticks, fast attack, spatial drift.
  clickTrain(time){
    const c=this.context,count=6+Math.floor(this.random()*5),pan=c.createStereoPanner(),out=c.createGain();
    const drift=this.random()*2-1;
    pan.pan.setValueAtTime(drift,time);pan.pan.linearRampToValueAtTime(-drift,time+count*.065);
    out.gain.value=1;out.connect(pan);pan.connect(this.master);
    for(let i=0;i<count;i++){
      const at=time+i*.065,source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();
      source.buffer=this.snapBuffer;filter.type='highpass';filter.frequency.value=2500;
      gain.gain.value=.012*(1-i/count*.6);
      source.connect(filter);filter.connect(gain);gain.connect(out);
      source.start(at);source.stop(at+.06);
      source.onended=(()=>{const s=source,f=filter,g=gain;return ()=>{s.disconnect();f.disconnect();g.disconnect();};})();
    }
    setTimeout(()=>{try{out.disconnect();pan.disconnect();}catch{}},(count*.065+.3)*1000);
  }
}
