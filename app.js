/* CivilStrike — game engine
 * World model: AI nations drawn from the real country list
 * (U.S. Dept. of State Office of the Historian — history.state.gov/countries/all).
 * Diplomacy feed ("WorldBook") is modeled on the facebook-clone Post/Header/Page
 * structure (devsebastian/facebook-clone): avatar header, timestamped body,
 * like / comment / share row and inline comment box — here reworked so AI
 * nations and the player talk, react and answer each other inside the game.
 */
"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const LS="nsclone-v2";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const _id=s=>s.toLowerCase().replace(/ /g,"_");
const titleCase=s=>s.replace(/\w\S*/g,t=>t[0].toUpperCase()+t.slice(1).toLowerCase());
const fmtPop=n=>n>=1e9?(n/1e9).toFixed(2)+" billion":n>=1e6?(n/1e6).toFixed(1)+" million":n.toLocaleString();

/* ---------- World Data client (shard API) ---------- */
class NSAPI{
  constructor(){this.calls=[];this.rateLimit=49;this.userAgent="NationStates/1.0";this.API="https://www.nationstates.net/cgi-bin/api.cgi";}
  _prune(){const t=Date.now();this.calls=this.calls.filter(x=>x+30000>t);}
  remaining(){this._prune();return this.rateLimit-this.calls.length;}
  _take(){this._prune();if(this.calls.length>=this.rateLimit)throw new Error("Rate limit reached (49/30s)");this.calls.push(Date.now());}
  _url(p,q){return `${this.API}${p}?q=${q}`;}
  async live(p,q){ // attempt live API, null when unreachable
    try{this._take();
      const r=await fetch(this._url(p,q),{headers:{"User-Agent":this.userAgent}});
      if(r.status===429)throw new Error("429 rate limited"); if(!r.ok)throw new Error("HTTP "+r.status);
      return await r.text();
    }catch(e){return null;}
  }
  shardString(...shards){return shards.join("+");}
  async getNationInfo(name,...shards){const xml=await this.live("?nation="+_id(name),this.shardString(...(shards.length?shards:["name","fullname","category","motto","flag","population","region","freedoms","freedomscores","wa_status","endorsements","legislation","happenings"])));return{live:!!xml,shards,xml:xml?xml.slice(0,4000):"World Archive record (nation dossier)."};}
  async getRegionInfo(name,...shards){const xml=await this.live("?region="+_id(name),this.shardString(...(shards.length?shards:["name","factbook","founder","delegate","numnations","nations","messages","happenings","tags"])));return{live:!!xml,shards,xml:xml?xml.slice(0,4000):"World Archive record (region file)."};}
  async getWorldInfo(...shards){const xml=await this.live("?",this.shardString(...(shards.length?shards:["numnations","numregions","census","featuredregion","newnations"])));return{live:!!xml,xml:xml?xml.slice(0,4000):"World Archive record (daily census)."};}
  async getWAInfo(council=1,...shards){const xml=await this.live("?wa="+council,this.shardString(...(shards.length?shards:["numnations","resolution","members","delegates"])));return{live:!!xml,xml:xml?xml.slice(0,4000):"World Archive record (assembly file)."};}
  verifyNation(n,c){return n&&c?`checksum ${esc(c)} for ${esc(n)}: `+(c.length>3?"VALID":"INVALID"):"missing args";}
  sendTelegram(to,msg){return `Telegram queued to ${esc(to)} (${esc(String(msg).slice(0,60))}…) — ${this.remaining()} sends left this window.`;}
}
const api=new NSAPI();

/* ---------- Text helpers ---------- */
function parseBBCodes(t){let x=esc(t);
  const rep=(a,b)=>{x=x.split(a).join(b)};rep("[b]","<b>");rep("[/b]","</b>");rep("[i]","<i>");rep("[/i]","</i>");rep("[u]","<u>");rep("[/u]","</u>");
  x=x.replace(/\[nation\](.+?)\[\/nation\]/gi,'<a href="#" data-nation="$1">⚑ $1</a>').replace(/\[region\](.+?)\[\/region\]/gi,'<a href="#" data-region="$1">🏳 $1</a>');
  x=x.replace(/\[url=(.+?)\](.+?)\[\/url\]/gi,'<a href="$1" target="_blank" rel="noopener">$2</a>');
  return x.replace(/\n/g,"<br>");}
function timeAgo(ts){const d=Date.now()-ts;const m=Math.floor(d/6e4),h=Math.floor(d/36e5),dd=Math.floor(d/864e5);if(dd>=365)return Math.floor(dd/365)+" years ago";if(dd>0)return dd+(dd>1?" days ago":" day ago");if(h>0)return h+(h>1?" hours ago":" hour ago");if(m>0)return m+(m>1?" minutes ago":" minute ago");return"Seconds ago";}

/* ---------- World: real nations (history.state.gov/countries/all) ----------
 * AI cast mirrors the real world: name + ISO code + capital + currency +
 * population (millions) + home region. Flags load from flagcdn; the Diplomacy
 * feed uses them as profile pictures, exactly like facebook-clone avatars. */
const CENSUS=[{id:0,n:"Civil Rights"},{id:1,n:"Economy"},{id:2,n:"Political Freedom"},{id:3,n:"Wealthiest"},{id:4,n:"Largest Population"},{id:5,n:"Most Enviro-Friendly"},{id:6,n:"Most Religious"},{id:7,n:"Safest Streets"}];
const REGIONS_SEED=[
 {name:"Europe",factbook:"Old democracies, new debates. Parliamentary traditions, strong presses, fierce football loyalties.",tags:["democratic","historic","census"],founder:"Charter Council",color:"#2a4a9b"},
 {name:"Africa",factbook:"Young, fast-growing and entrepreneurial — from Lagos markets to Nairobi tech hubs.",tags:["growing","diverse"],founder:"Charter Council",color:"#1f6b4a"},
 {name:"Asia-Pacific",factbook:"Megacities, island states and Pacific trade winds. The demographic center of the world.",tags:["populous","trade"],founder:"Charter Council",color:"#8a1f2d"},
 {name:"Americas",factbook:"From Arctic ports to Patagonian plains — federal republics, big economies, loud elections.",tags:["federal","large"],founder:"Charter Council",color:"#1f5b8c"},
 {name:"Middle East & Central Asia",factbook:"Energy powers, ancient crossroads and new financial centers.",tags:["energy","crossroads"],founder:"Charter Council",color:"#8a6d1f"},
 {name:"Founders' Haven",factbook:"Open harbor where all new nations arrive. Read the factbook, endorse neighbours, make friends.",tags:["welcoming","new"],founder:"Harbor Board",color:"#5b3a8c"}];
// [name, iso2, capital, currency, popMillions, region, iso3] — the entire world roster
const REAL_NATIONS=[
 ["Afghanistan","af","Kabul","afghani",41,"Middle East & Central Asia","AFG"],["Albania","al","Tirana","lek",2.8,"Europe","ALB"],["Algeria","dz","Algiers","dinar",46,"Africa","DZA"],["Angola","ao","Luanda","kwanza",37,"Africa","AGO"],["Argentina","ar","Buenos Aires","peso",46,"Americas","ARG"],["Armenia","am","Yerevan","dram",2.8,"Middle East & Central Asia","ARM"],["Australia","au","Canberra","dollar",26,"Asia-Pacific","AUS"],["Austria","at","Vienna","euro",9,"Europe","AUT"],["Azerbaijan","az","Baku","manat",10,"Middle East & Central Asia","AZE"],["Bahamas","bs","Nassau","dollar",0.41,"Americas","BHS"],["Bangladesh","bd","Dhaka","taka",173,"Asia-Pacific","BGD"],["Belarus","by","Minsk","ruble",9.2,"Europe","BLR"],["Belgium","be","Brussels","euro",11.7,"Europe","BEL"],["Belize","bz","Belmopan","dollar",0.4,"Americas","BLZ"],["Benin","bj","Porto-Novo","franc",14,"Africa","BEN"],["Bermuda","bm","Hamilton","dollar",0.06,"Americas","BMU"],["Bhutan","bt","Thimphu","ngultrum",0.8,"Asia-Pacific","BTN"],["Bolivia","bo","Sucre","boliviano",12,"Americas","BOL"],["Bosnia and Herzegovina","ba","Sarajevo","mark",3.2,"Europe","BIH"],["Botswana","bw","Gaborone","pula",2.6,"Africa","BWA"],["Brazil","br","Brasilia","real",216,"Americas","BRA"],["Brunei","bn","Bandar Seri Begawan","dollar",0.45,"Asia-Pacific","BRN"],["Bulgaria","bg","Sofia","lev",6.4,"Europe","BGR"],["Burkina Faso","bf","Ouagadougou","franc",23,"Africa","BFA"],["Burundi","bi","Gitega","franc",13,"Africa","BDI"],["Cambodia","kh","Phnom Penh","riel",17,"Asia-Pacific","KHM"],["Cameroon","cm","Yaounde","franc",29,"Africa","CMR"],["Canada","ca","Ottawa","dollar",40,"Americas","CAN"],["Central African Republic","cf","Bangui","franc",5.7,"Africa","CAF"],["Chad","td","NDjamena","franc",18,"Africa","TCD"],["Chile","cl","Santiago","peso",19,"Americas","CHL"],["China","cn","Beijing","yuan",1412,"Asia-Pacific","CHN"],["Colombia","co","Bogota","peso",52,"Americas","COL"],["Costa Rica","cr","San Jose","colon",5.2,"Americas","CRI"],["Croatia","hr","Zagreb","euro",3.8,"Europe","HRV"],["Cuba","cu","Havana","peso",11,"Americas","CUB"],["Cyprus","cy","Nicosia","euro",1.4,"Europe","CYP"],["Czech Republic","cz","Prague","koruna",10.5,"Europe","CZE"],["Democratic Republic of the Congo","cd","Kinshasa","franc",102,"Africa","COD"],["Denmark","dk","Copenhagen","krone",5.9,"Europe","DNK"],["Djibouti","dj","Djibouti","franc",1.1,"Africa","DJI"],["Dominican Republic","do","Santo Domingo","peso",11.3,"Americas","DOM"],["East Timor","tl","Dili","dollar",1.4,"Asia-Pacific","TLS"],["Ecuador","ec","Quito","dollar",18,"Americas","ECU"],["Egypt","eg","Cairo","pound",112,"Africa","EGY"],["El Salvador","sv","San Salvador","dollar",6.3,"Americas","SLV"],["Equatorial Guinea","gq","Malabo","franc",1.7,"Africa","GNQ"],["Eritrea","er","Asmara","nakfa",3.7,"Africa","ERI"],["Estonia","ee","Tallinn","euro",1.4,"Europe","EST"],["Ethiopia","et","Addis Ababa","birr",126,"Africa","ETH"],["Falkland Islands","fk","Stanley","pound",0.004,"Americas","FLK"],["Fiji","fj","Suva","dollar",0.94,"Asia-Pacific","FJI"],["Finland","fi","Helsinki","euro",5.5,"Europe","FIN"],["France","fr","Paris","euro",68,"Europe","FRA"],["French Guiana","gf","Cayenne","euro",0.3,"Americas","GUF"],["Gabon","ga","Libreville","franc",2.4,"Africa","GAB"],["Gambia","gm","Banjul","dalasi",2.7,"Africa","GMB"],["Georgia","ge","Tbilisi","lari",3.7,"Middle East & Central Asia","GEO"],["Germany","de","Berlin","euro",84,"Europe","DEU"],["Ghana","gh","Accra","cedi",34,"Africa","GHA"],["Greece","gr","Athens","euro",10,"Europe","GRC"],["Greenland","gl","Nuuk","krone",0.06,"Americas","GRL"],["Guatemala","gt","Guatemala City","quetzal",18,"Americas","GTM"],["Guinea","gn","Conakry","franc",14,"Africa","GIN"],["Guinea-Bissau","gw","Bissau","franc",2.1,"Africa","GNB"],["Guyana","gy","Georgetown","dollar",0.8,"Americas","GUY"],["Haiti","ht","Port-au-Prince","gourde",12,"Americas","HTI"],["Honduras","hn","Tegucigalpa","lempira",10.6,"Americas","HND"],["Hungary","hu","Budapest","forint",9.6,"Europe","HUN"],["Iceland","is","Reykjavik","krona",0.4,"Europe","ISL"],["India","in","New Delhi","rupee",1428,"Asia-Pacific","IND"],["Indonesia","id","Jakarta","rupiah",277,"Asia-Pacific","IDN"],["Iran","ir","Tehran","rial",89,"Middle East & Central Asia","IRN"],["Iraq","iq","Baghdad","dinar",44,"Middle East & Central Asia","IRQ"],["Ireland","ie","Dublin","euro",5.3,"Europe","IRL"],["Israel","il","Jerusalem","shekel",9.8,"Middle East & Central Asia","ISR"],["Italy","it","Rome","euro",59,"Europe","ITA"],["Ivory Coast","ci","Yamoussoukro","franc",29,"Africa","CIV"],["Jamaica","jm","Kingston","dollar",2.8,"Americas","JAM"],["Japan","jp","Tokyo","yen",125,"Asia-Pacific","JPN"],["Jordan","jo","Amman","dinar",11,"Middle East & Central Asia","JOR"],["Kazakhstan","kz","Astana","tenge",20,"Middle East & Central Asia","KAZ"],["Kenya","ke","Nairobi","shilling",55,"Africa","KEN"],["Kosovo","xk","Pristina","euro",1.7,"Middle East & Central Asia","KSV"],["Kuwait","kw","Kuwait City","dinar",4.3,"Middle East & Central Asia","KWT"],["Kyrgyzstan","kg","Bishkek","som",6.7,"Middle East & Central Asia","KGZ"],["Laos","la","Vientiane","kip",7.6,"Asia-Pacific","LAO"],["Latvia","lv","Riga","euro",1.9,"Europe","LVA"],["Lebanon","lb","Beirut","pound",5.5,"Middle East & Central Asia","LBN"],["Lesotho","ls","Maseru","loti",2.3,"Africa","LSO"],["Liberia","lr","Monrovia","dollar",5.4,"Africa","LBR"],["Libya","ly","Tripoli","dinar",6.9,"Africa","LBY"],["Lithuania","lt","Vilnius","euro",2.9,"Europe","LTU"],["Luxembourg","lu","Luxembourg","euro",0.66,"Europe","LUX"],["North Macedonia","mk","Skopje","denar",1.8,"Europe","MKD"],["Madagascar","mg","Antananarivo","ariary",30,"Africa","MDG"],["Malawi","mw","Lilongwe","kwacha",21,"Africa","MWI"],["Malaysia","my","Kuala Lumpur","ringgit",34,"Asia-Pacific","MYS"],["Mali","ml","Bamako","franc",23,"Africa","MLI"],["Malta","mt","Valletta","euro",0.55,"Europe","MLT"],["Mauritania","mr","Nouakchott","ouguiya",4.9,"Africa","MRT"],["Mexico","mx","Mexico City","peso",128,"Americas","MEX"],["Moldova","md","Chisinau","leu",2.5,"Europe","MDA"],["Mongolia","mn","Ulaanbaatar","tugrik",3.4,"Asia-Pacific","MNG"],["Montenegro","me","Podgorica","euro",0.6,"Europe","MNE"],["Morocco","ma","Rabat","dirham",37,"Africa","MAR"],["Mozambique","mz","Maputo","metical",33,"Africa","MOZ"],["Myanmar","mm","Naypyidaw","kyat",54,"Asia-Pacific","MMR"],["Namibia","na","Windhoek","dollar",2.6,"Africa","NAM"],["Nepal","np","Kathmandu","rupee",31,"Asia-Pacific","NPL"],["Netherlands","nl","Amsterdam","euro",17,"Europe","NLD"],["New Caledonia","nc","Noumea","franc",0.27,"Asia-Pacific","NCL"],["New Zealand","nz","Wellington","dollar",5.1,"Asia-Pacific","NZL"],["Nicaragua","ni","Managua","cordoba",7,"Americas","NIC"],["Niger","ne","Niamey","franc",27,"Africa","NER"],["Nigeria","ng","Abuja","naira",223,"Africa","NGA"],["North Korea","kp","Pyongyang","won",26,"Asia-Pacific","PRK"],["Northern Cyprus","cy","North Nicosia","lira",0.4,"Middle East & Central Asia","NCY"],["Norway","no","Oslo","krone",5.5,"Europe","NOR"],["Oman","om","Muscat","rial",4.6,"Middle East & Central Asia","OMN"],["Pakistan","pk","Islamabad","rupee",240,"Middle East & Central Asia","PAK"],["Palestine","ps","Ramallah","shekel",5.4,"Middle East & Central Asia","PSE"],["Panama","pa","Panama City","balboa",4.5,"Americas","PAN"],["Papua New Guinea","pg","Port Moresby","kina",10,"Asia-Pacific","PNG"],["Paraguay","py","Asuncion","guarani",6.8,"Americas","PRY"],["Peru","pe","Lima","sol",34,"Americas","PER"],["Philippines","ph","Manila","peso",117,"Asia-Pacific","PHL"],["Poland","pl","Warsaw","zloty",38,"Europe","POL"],["Portugal","pt","Lisbon","euro",10.3,"Europe","PRT"],["Puerto Rico","pr","San Juan","dollar",3.2,"Americas","PRI"],["Qatar","qa","Doha","riyal",2.7,"Middle East & Central Asia","QAT"],["Republic of the Congo","cg","Brazzaville","franc",6.1,"Africa","COG"],["Romania","ro","Bucharest","leu",19,"Europe","ROU"],["Russia","ru","Moscow","ruble",144,"Europe","RUS"],["Rwanda","rw","Kigali","franc",14,"Africa","RWA"],["Saudi Arabia","sa","Riyadh","riyal",36,"Middle East & Central Asia","SAU"],["Senegal","sn","Dakar","franc",18,"Africa","SEN"],["Serbia","rs","Belgrade","dinar",6.6,"Europe","SRB"],["Sierra Leone","sl","Freetown","leone",8.8,"Africa","SLE"],["Slovakia","sk","Bratislava","euro",5.4,"Europe","SVK"],["Slovenia","si","Ljubljana","euro",2.1,"Europe","SVN"],["Solomon Islands","sb","Honiara","dollar",0.74,"Asia-Pacific","SLB"],["Somalia","so","Mogadishu","shilling",18,"Africa","SOM"],["Somaliland","so","Hargeisa","shilling",5.7,"Africa","SLD"],["South Africa","za","Pretoria","rand",60,"Africa","ZAF"],["South Korea","kr","Seoul","won",52,"Asia-Pacific","KOR"],["South Sudan","ss","Juba","pound",11,"Africa","SSD"],["Spain","es","Madrid","euro",48,"Europe","ESP"],["Sri Lanka","lk","Colombo","rupee",22,"Asia-Pacific","LKA"],["Sudan","sd","Khartoum","pound",48,"Africa","SDN"],["Suriname","sr","Paramaribo","dollar",0.62,"Americas","SUR"],["Eswatini","sz","Mbabane","lilangeni",1.2,"Africa","SWZ"],["Sweden","se","Stockholm","krona",10,"Europe","SWE"],["Switzerland","ch","Bern","franc",8.8,"Europe","CHE"],["Syria","sy","Damascus","pound",23,"Middle East & Central Asia","SYR"],["Taiwan","tw","Taipei","dollar",24,"Asia-Pacific","TWN"],["Tajikistan","tj","Dushanbe","somoni",10,"Middle East & Central Asia","TJK"],["Tanzania","tz","Dodoma","shilling",67,"Africa","TZA"],["Thailand","th","Bangkok","baht",71,"Asia-Pacific","THA"],["Togo","tg","Lome","franc",9,"Africa","TGO"],["Trinidad and Tobago","tt","Port of Spain","dollar",1.5,"Americas","TTO"],["Tunisia","tn","Tunis","dinar",12,"Africa","TUN"],["Turkey","tr","Ankara","lira",85,"Middle East & Central Asia","TUR"],["Turkmenistan","tm","Ashgabat","manat",6.5,"Middle East & Central Asia","TKM"],["Uganda","ug","Kampala","shilling",49,"Africa","UGA"],["Ukraine","ua","Kyiv","hryvnia",38,"Europe","UKR"],["United Arab Emirates","ae","Abu Dhabi","dirham",9.5,"Middle East & Central Asia","ARE"],["United Kingdom","gb","London","pound",67,"Europe","GBR"],["United States","us","Washington","dollar",340,"Americas","USA"],["Uruguay","uy","Montevideo","peso",3.4,"Americas","URY"],["Uzbekistan","uz","Tashkent","som",35,"Middle East & Central Asia","UZB"],["Vanuatu","vu","Port Vila","vatu",0.34,"Asia-Pacific","VUT"],["Venezuela","ve","Caracas","bolivar",28,"Americas","VEN"],["Vietnam","vn","Hanoi","dong",98,"Asia-Pacific","VNM"],["Western Sahara","eh","Laayoune","dirham",0.6,"Africa","ESH"],["Yemen","ye","Sanaa","rial",34,"Middle East & Central Asia","YEM"],["Zambia","zm","Lusaka","kwacha",21,"Africa","ZMB"],["Zimbabwe","zw","Harare","dollar",16,"Africa","ZWE"]];
const PRETITLES=["The Republic of","The Kingdom of","The Federation of","The People's State of","The Free Land of"];
const MOTTOS=["Strength Through Unity","Forward, Always","In Unity, Progress","Liberty and Work","Peace Through Trade","Knowledge Is Power"];
const ANIMALS=["Eagle","Lion","Falcon","Otter","Fox","Horse"];
function rnd(a,b){return Math.floor(a+Math.random()*(b-a+1));}
function flagURL(iso){return `https://flagcdn.com/w160/${iso}.png`;}
function flagImg(n,w=44,h=30){const iso=(n.iso||"un").toLowerCase();return `<img class="flagimg" style="width:${w}px;height:${h}px" src="${flagURL(iso)}" alt="flag of ${esc(n.name||"nation")}" loading="lazy" onerror="this.style.display='none'">`;}
function mkFlag(seed){const pals=[["#c1121f","#d4a017","#fff"],["#e02040","#fff","#5c0d17"],["#2e7d46","#ffd75e","#173d22"],["#5b3a8c","#ff9ec6","#fff"],["#0e7c86","#fff","#ff6b35"],["#222","#d4a017","#a33b2e"]];const p=pals[seed%pals.length];const pats=["vertical","horizontal","cross","saltire","circle","rays"];return{pattern:pats[seed%pats.length],c1:p[0],c2:p[1],c3:p[2],emblem:["★","☀","🌙","⚓","🦁","🕊"][seed%6]};}
function flagSVG(f,w=180,h=120){const{id}=f;let bg="";const P=f.pattern;
 if(P==="vertical")bg=`<rect width="${w/3}" height="${h}" fill="${f.c1}"/><rect x="${w/3}" width="${w/3}" height="${h}" fill="${f.c2}"/><rect x="${2*w/3}" width="${w/3}" height="${h}" fill="${f.c3}"/>`;
 else if(P==="horizontal")bg=`<rect width="${w}" height="${h/3}" fill="${f.c1}"/><rect y="${h/3}" width="${w}" height="${h/3}" fill="${f.c2}"/><rect y="${2*h/3}" width="${w}" height="${h/3}" fill="${f.c3}"/>`;
 else if(P==="cross")bg=`<rect width="${w}" height="${h}" fill="${f.c1}"/><rect x="${w/2-10}" width="20" height="${h}" fill="${f.c2}"/><rect y="${h/2-10}" width="${w}" height="20" fill="${f.c2}"/>`;
 else if(P==="saltire")bg=`<rect width="${w}" height="${h}" fill="${f.c1}"/><path d="M0 0 L${w} ${h} M${w} 0 L0 ${h}" stroke="${f.c2}" stroke-width="16"/>`;
 else if(P==="circle")bg=`<rect width="${w}" height="${h}" fill="${f.c1}"/><circle cx="${w/2}" cy="${h/2}" r="30" fill="${f.c2}" stroke="${f.c3}" stroke-width="4"/>`;
 else bg=`<rect width="${w}" height="${h}" fill="${f.c1}"/>${Array.from({length:7},(_,i)=>`<rect y="${i*h/7}" width="${w}" height="${h/14}" fill="${f.c2}" opacity=".85"/>`).join("")}`;
 return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${bg}<text x="${w/2}" y="${h/2+12}" font-size="34" text-anchor="middle">${f.emblem}</text></svg>`;}

/* ---------- Issues (dilemmas) — decisions shape freedoms like real game ---------- */
const QUIZ=[
 "A country should be judged by how it treats its worst-off citizens.",
 "Corporations are good for society.","Marijuana should be legal.",
 "The world needs to rediscover its spirituality.","Young people should perform a year's compulsory military service.",
 "Capitalism is on the way out.","Without democracy, a country has nothing.","It's better to deter criminals than rehabilitate them."];
const CATEGORIES=[ // (civil,pol,econ) each 0=low,1=mid,2=high
 [["Psychotic Dictatorship","Corporate Police State","Authoritarian Democracy"],["Dictatorship","Police State","Father Knows Best State"],["Totalitarian State","Moralistic Democracy","Inoffensive Centrist Democracy"]],
 [["Tyranny By Majority","Iron Fist Consumerists","Liberal Democratic Socialists"],["Jingoist Dictatorship","Right-wing Utopia","Left-Leaning College State"],["Democratic Socialists","Capitalist Paradise","Free-Market Paradise"]],
 [["Anarchy","Libertarian Police State","Left-wing Utopia"],["Anarchic State","Civil Rights Lovefest","Democratic Communists"],["Anarcho-Capitalist Outpost","Libertarian Paradise","Ancapistan"]]];
function categoryFor(c,p,e){const b=v=>v<30?0:v<65?1:2;return CATEGORIES[b(c)][b(p)][b(e)];}
const WA_RES={ga:{title:"GA #712: Right to Education for All",by:"Brazil",cat:"Education",for:8211,against:3102,text:"Mandates free primary education, teacher protections and textbook neutrality across member states."},sc:{title:"SC #318: Commend Disaster-Relief Cooperation",by:"Japan",cat:"Commendation",for:5402,against:4988,text:"Commends coordinated cross-regional disaster relief and medical cooperation."}};

/* ---------- State ---------- */
let S=null, VIEW="nation", SUB={}, ISSUE_Q=[];
let _feedId=1;
function blankWorld(){return{day:1,nations:[],regions:[],happenings:[],papers:[],feed:[],wars:[],warId:1,full:false,feuds:{},memory:[],sched:[],wa:{ga:JSON.parse(JSON.stringify(WA_RES.ga)),sc:JSON.parse(JSON.stringify(WA_RES.sc)),log:[]},rmb:{},dumpDay:1};}
function regionBase(region){return region==="Europe"?{c:[62,84],e:[62,84],p:[62,88]}:region==="Africa"?{c:[42,64],e:[36,60],p:[40,64]}:region==="Asia-Pacific"?{c:[40,80],e:[55,88],p:[38,75]}:region==="Americas"?{c:[55,80],e:[55,82],p:[55,85]}:region==="Middle East & Central Asia"?{c:[30,56],e:[50,76],p:[26,52]}:{c:[45,70],e:[45,70],p:[45,70]};}
function seedWorld(){
  const W=blankWorld();W.full=true;
  W.regions=REGIONS_SEED.map((r,i)=>({...r,nations:[],delegate:null,founder:r.founder,numNations:0}));
  REAL_NATIONS.forEach((rec,i)=>{const [nm,iso,cap,cur,popM,region,a3]=rec;const b=regionBase(region);
    const nat={name:nm,iso:iso.toLowerCase(),a3,capital:cap,pretitle:PRETITLES[i%PRETITLES.length],motto:MOTTOS[i%MOTTOS.length],currency:cur,animal:ANIMALS[i%ANIMALS.length],flag:mkFlag(i+2),civil:rnd(b.c[0],b.c[1]),econ:rnd(b.e[0],b.e[1]),pol:rnd(b.p[0],b.p[1]),pop:Math.max(4000,Math.round(popM*1e6)),region,wa:i%4!==3,endo:rnd(1,16),legislation:["Charter of the regional council ratified."],founded:"in antiquity"};
    nat.category=categoryFor(nat.civil,nat.pol,nat.econ);W.nations.push(nat);W.regions.find(r=>r.name===region).nations.push(nm);});
  W.regions.forEach(r=>{r.numNations=r.nations.length;
    const cands=W.nations.filter(n=>n.region===r.name&&n.wa).sort((a,b)=>b.endo-a.endo);r.delegate=cands[0]?.name||"—";
    const host=cands[0]?.name||r.nations[0]||"Harbor Board";
    W.rmb[r.name]=[{t:Date.now()-rnd(2,40)*36e5,n:host,x:`Welcome to ${r.name}! Read the factbook, endorse your neighbours, and introduce your nation.`},{t:Date.now()-rnd(1,9)*36e5,n:r.nations[1]||host,x:"Greetings all — new newspaper edition out soon. Endorse for endorsement-swaps!"}];});
  W.happenings=[
    {t:Date.now()-7.2e6,x:"Germany endorsed France."},
    {t:Date.now()-2*7.2e6,x:"Asia-Pacific seized the population lead from Europe."},
    {t:Date.now()-3*7.2e6,x:"World Assembly passed GA #711 'Clean Seas'."},
    {t:Date.now()-4*7.2e6,x:"Brazil published 'The Americas Review'."},
    {t:Date.now()-5*7.2e6,x:"Japan opened a new embassy exchange with South Korea."}];
  W.papers=[{region:"Europe",title:"The Continental Post",ed:42,articles:["Delegate race heats up: endorsements explained","Parliamentary sketch: GA #712 debate","Census: who topped Wealthiest?"]},{region:"Americas",title:"The Americas Review",ed:118,articles:["WA voting guide: GA #712","Regional harbor welcomes new arrivals","Trade winds: Pacific ports report"]}];
  seedFeed(W);
  return W;}
/* ---------- WorldBook: diplomacy feed (facebook-clone Post model) ----------
 * Each entry mirrors facebook-clone's Post props: username (= nation),
 * profilePicUrl (= flag), date, body, likes + comments + share. AI nations
 * post, like and reply; the player's posts get answers from the AI cast. */
const FEED_SEED=[
 {a:"Germany",b:"GA #712 on education comes to the floor this week. Our delegation votes FOR — classrooms first. Where does your nation stand?"},
 {a:"Japan",b:"Our coast-guard drilled with South Korea yesterday. Quiet seas make busy ports. Open to new embassy exchanges."},
 {a:"Brazil",b:"New edition of The Americas Review is out. Congratulations to our new arrivals in Founders' Haven — welcome!"},
 {a:"Kenya",b:"Nairobi tech week opens tomorrow. If your nation funds startups, come talk — we endorse our partners."},
 {a:"France",b:"The Continental Post endorses civil debate: disagree with a resolution, argue the text, respect the vote."},
 {a:"India",b:"With 1.4 billion citizens, every census rank moves markets. Good luck to all climbers this week."},
 {a:"Canada",b:"Reminder: endorsements decide the delegacy. Endorse neighbours you trust — withdraw when you don't."},
 {a:"Qatar",b:"Doha forum on energy and climate next month. All regions invited."}];
const AI_REPLIES=["Well said — our delegation agrees. Good faith noted.","Interesting position. Our press will quote this debate.","We see it differently, but respect the argument. Let's talk terms.","Our region discussed this on the board today. Come join us.","Noted with appreciation — constructive diplomacy.","Our economists flagged this — let's compare census numbers next week.","Noted and shared with our foreign ministry."];
const PERSONAS=["Diplomat","Trader","Hawk","Reformer","Isolationist","Showman"];
function personaOf(n){if(n.persona)return n.persona;const h=[...n.name].reduce((a,c)=>a+c.charCodeAt(0),0);return PERSONAS[h%PERSONAS.length];}
function ideoDist(a,b){return Math.abs((a.civil||50)-(b.civil||50))+Math.abs((a.econ||50)-(b.econ||50))+Math.abs((a.pol||50)-(b.pol||50));}
function affinityTo(n){if(!S)return 50;if(!S.aff)S.aff={};if(!(n.name in S.aff))S.aff[n.name]=50;return S.aff[n.name];}
function bumpAffinity(name,d){if(!S)return;if(!S.aff)S.aff={};S.aff[name]=Math.max(0,Math.min(100,(S.aff[name]??50)+d));}
function reactorWeight(n,post){let w=10+rnd(0,10);w+=(affinityTo(n)-50)*0.3;if(post&&post.author!==n.name){const a=WORLD.nations.find(x=>x.name===post.author);if(a&&a.region===n.region)w+=8;if(a)w+=(120-ideoDist(a,n))*0.08;}if(S&&post&&post.author===S.name)w+=(affinityTo(n)-50)*0.4;const p=personaOf(n);if(p==="Diplomat"||p==="Showman")w+=6;if(p==="Isolationist")w-=8;return Math.max(1,w);}
function pickReactor(post,exclude=[]){const cands=WORLD.nations.filter(n=>!exclude.includes(n.name));let tot=0;const ws=cands.map(n=>{const w=reactorWeight(n,post);tot+=w;return w;});let r=Math.random()*tot;for(let i=0;i<cands.length;i++){r-=ws[i];if(r<=0)return cands[i];}return cands[0];}
/* Keyword-aware diplomacy: AI answers reference what was actually said. */
function smartReply(text,n,post){const t=(text||"").toLowerCase();const nm=n.name;const cap=n.capital||"our capital";
 const pick=a=>a[rnd(0,a.length-1)];const voice=r=>(typeof speak==="function"?speak(n,r):r);
 if(post&&post.img&&Math.random()<0.4){const mr=(typeof mediaReply==="function"?mediaReply(n,post.img):null);if(mr)return voice(mr);}
 if(/victory|won|triumph|conquer|defeat|lost|fail|retreat/.test(t))return voice(pick([`History records the outcome, ${nm} studies the lessons.`,`Victory parades fade; the peace must be built.`,`Our general staff has war-gamed this exact scenario twice.`]));
 if(/war|army|troop|invad|raid|attack|military/.test(t))return voice(pick([`Our generals read this closely. ${nm} prefers deterrence to drums — walk carefully.`,`Strength keeps peace. We drill so we never have to fight.`,personaOf(n)==="Hawk"?`Finally, someone speaking plainly. ${nm} stands ready — allies first.`:`${nm} will not be drawn into adventures. Peace through talks.`]));
 if(/chart|census|numbers|data|statistic|graph/.test(t))return voice(pick([`Numbers don't flatter — they command. Ours command respect.`,`Our statisticians confirm the trend, with footnotes.`,`Check the census again next week. Trends favor the patient.`]));
 if(/trade|tariff|export|import|market|deal/.test(t))return voice(pick([`Trade winds favor us, friend — ${cap} is open for business. Send your merchants.`,`Our treasury reviewed your trade note with interest. Let's talk terms, not tariffs.`,`${nm} buys what you sell, if the price respects our workers. Terms by telegram?`]));
 if(/video|clip|watch|film|footage/.test(t))return voice(pick([`We screened it twice — stirring material.`,`Our studios rate it highly. Send the crew next time.`,`The palace cinema approves.`]));
 if(/flag|anthem|colors|parade/.test(t))return voice(pick([`Colors to be proud of. Ours flies a little higher.`,`A stirring display — our honor guard salutes.`]));
 if(/tech|computer|ai |robot|space|moon|rocket|nuclear|chip/.test(t))return voice(pick([`Our engineers take notes. Science serves the patient.`,`Bold! Our labs requested the schematics.`,`Progress — provided it answers to the people.`]));
 if(/peace|treaty|diplomac|friend|hello|welcome|greet/.test(t))return voice(pick([`And greetings to you! ${cap} raises a flag in welcome.`,`Friendship accepted. Our embassy door is open.`,`Well met! Our people love a friendly post — shared with our schools.`]));
 if(/world assembly|wa\b|resolution|vote|ga #|sc #/.test(t))return voice(pick([`Our delegation is watching the floor count closely. Every vote moves the margin.`,`We vote our conscience and our region's interest — in that order.`,`Noted for our WA file. ${nm} may cite your words in debate.`]));
 if(/endors|delegat/.test(t))return voice(pick([`Endorsements are trust made visible. Earn them, keep them.`,`Our delegate thanks all endorsers — legitimacy is earned daily.`,`A wise note. ${nm} endorses neighbours who show up and behave.`]));
 if(/climat|environment|green|pollut|whale|forest|sea/.test(t))return voice(pick([`Our scientists agree: green growth or no growth.`,`${cap} planted a million trees this year. Join the pledge?`,`The seas connect us — ${nm} backs the clean-seas work.`]));
 if(/econom|tax|budget|bank|inflation|job/.test(t))return voice(pick([`Our finance ministry nods along — balanced books, bold investment.`,`Taxes are the price of civilization, but waste is a choice.`,`Markets liked your note. Our bankers took minutes.`]));
 if(/educat|school|health|hospital/.test(t))return voice(pick([`Classrooms first — ${nm} stands with teachers and nurses.`,`Our schools will debate your post tomorrow morning.`,`Well said. Healthy, literate citizens make strong nations.`]));
 if(/border|immigr|refugee|migrant/.test(t))return voice(pick([`Borders with compassion — order and mercy both matter.`,`Our harbor has room, our schools have limits. Balance is everything.`]));
 if(/thank|congrat|well done|bravo/.test(t))return voice(pick([`Graciously received — ${nm} thanks you.`,`Kind words travel far. Our foreign ministry bows.`]));
 if(/\?/.test(t))return voice(pick([`A fair question. ${nm}'s answer: it depends on the text — send the draft.`,`We debated this in cabinet: yes, with safeguards.`,`Short answer: agree. Long answer: over tea in ${cap}.`]));
 return pick(AI_REPLIES);}
const AI_LIKES=["Germany","France","Japan","Brazil","Canada","Kenya","India","Spain"];
function feedAuthor(name){const n=WORLD.nations.find(x=>x.name===name);return n||{name,iso:"un"};}
function feedAdd(author,body,kind="post",img=null){const a=typeof author==="string"?{name:author,iso:(feedAuthor(author).iso||"un")}:author;const p={id:_feedId++,author:a.name,iso:(a.iso||"un").toLowerCase(),t:Date.now(),body:body.slice(0,600),likes:0,likedBy:[],comments:[],kind,img};WORLD.feed.unshift(p);WORLD.feed=WORLD.feed.slice(0,80);WORLD.lastFeedAt=Date.now();return p;}
function feedLike(id,who){const p=WORLD.feed.find(x=>x.id===id);if(!p)return "none";const i=p.likedBy.indexOf(who);if(i>=0){p.likedBy.splice(i,1);p.likes--;return "unliked";}else{p.likedBy.push(who);p.likes++;return "liked";}}
function aiRespond(post){ // staggered, relationship-driven answers via the social engine
  if(typeof respondToPlayerPost==="function"){respondToPlayerPost(post);pushHapp(`${post.author} posted on WorldBook — reactions incoming.`);return;}
  const r1=pickReactor(post),r2=pickReactor(post,[r1.name]);
  [r1,r2].forEach(n=>{if(!post.likedBy.includes(n.name)){post.likedBy.push(n.name);post.likes++;}});
  const replier=Math.random()<0.6?r1:r2;
  post.comments.push({author:replier.name,iso:replier.iso,t:Date.now(),text:smartReply(post.body+" "+(post.comments[0]?.text||""),replier,post)});
  if(S&&post.author===S.name){bumpAffinity(replier.name,2);toast(`💬 ${replier.name} replied to your post`);}
  pushHapp(`${replier.name} replied to ${post.author} on WorldBook.`);}
/* ---------- Live engine: the world acts every few seconds ---------- */
function toast(msg){let box=$("#toasts");if(!box){box=document.createElement("div");box.id="toasts";document.body.appendChild(box);}const d=document.createElement("div");d.className="toast";d.innerHTML=msg;box.appendChild(d);setTimeout(()=>d.classList.add("show"));setTimeout(()=>{d.classList.remove("show");setTimeout(()=>d.remove(),400);},4200);while(box.children.length>4)box.firstChild.remove();}
function activeNow(){if(!WORLD.active||!WORLD.active.length)return[];return WORLD.active.map(a=>WORLD.nations.find(n=>n.name===a)).filter(Boolean);}
function rotateActive(){const pool=[...WORLD.nations].sort(()=>Math.random()-0.5).slice(0,rnd(4,8));WORLD.active=pool.map(n=>n.name);}
function censusLeader(){return [...WORLD.nations].sort((a,b)=>b.pop-a.pop)[0];}
function livePostBody(n){const lead=censusLeader();const ga=WORLD.wa.ga;const r=WORLD.regions.find(x=>x.name===n.region);const p=personaOf(n);const t=[
 `${r.delegate===n.name?"As your delegate, ":""}${n.region} mornings: markets ${n.econ>60?"buzzing":"steady"}, and our schools debate last night's vote.`,
 `Census watch: ${lead.name} holds the population lead at ${fmtPop(lead.pop)}. We salute scale — and chase it.`,
 `GA #712 stands ${ga.for.toLocaleString()} FOR / ${ga.against.toLocaleString()} AGAINST. ${n.name} urges all members to read the text, not the rumors.`,
 p==="Trader"?`Trade offer on the table: ${n.capital} seeks partners in goods, ports and ideas. Terms favor the bold.`:
 p==="Hawk"?`Our forces drilled at dawn. Deterrence is diplomacy that arrives early.`:
 p==="Reformer"?`Reform bulletin: our freedoms move — civil ${n.civil}, economy ${n.econ}, political ${n.pol}. Debate us.`:
 p==="Showman"?`📣 ${n.capital} today: parades, presses, and one very good speech. Pictures to follow.`:
 p==="Isolationist"?`A quiet word from ${cap(n)}: we mind our harbor, tend our gardens, wish all well.`:
 `Greetings from ${n.capital}. Our delegate ${r.delegate} holds the gavel with ${n.endo} endorsements behind them.`];return t[rnd(0,t.length-1)];}
function cap(n){return n.capital||"our capital";}
function liveTick(){if(!WORLD||!WORLD.feed)return;rotateActive();
 try{if(typeof processSched==="function")processSched();}catch(e){}
  const roll=Math.random();const feed=WORLD.feed;
 if(roll<0.34&&feed.length){ // LIKE — friends of the author pile on
  const post=feed[rnd(0,Math.min(feed.length-1,9))];const liker=pickReactor(post,post.likedBy);
  if(!post.likedBy.includes(liker.name)){post.likedBy.push(liker.name);post.likes++;
   if(S&&post.author===S.name){bumpAffinity(liker.name,1);toast(`👍 ${liker.name} liked your post`);}}
  }else if(roll<0.58&&feed.length){ // COMMENT — stance-driven, sometimes sparks a thread
   const post=feed[rnd(0,Math.min(feed.length-1,9))];
   if(post.comments.length<9){const c=(typeof aiReactor==="function"?aiReactor(post,post.comments.map(x=>x.author)):pickReactor(post,post.comments.map(x=>x.author)));if(c){const parent=post.comments.length?post.comments[post.comments.length-1].author:null;const txt=(typeof socialReply==="function"?socialReply(c,post,parent):smartReply(post.body+" "+(post.comments[0]?.text||""),c,post));if(txt){const cm={author:c.name,iso:c.iso,t:Date.now(),text:txt};if(parent&&Math.random()<0.6)cm.replyTo=parent;post.comments.push(cm);
    if(S&&(post.author===S.name||post.comments.some(x=>x.author===S.name))){bumpAffinity(c.name,1);toast(`💬 ${c.name} commented: “${post.body.slice(0,60)}…”`);}
    if(Math.random()<0.3&&(typeof sched==="function")){const r2=(typeof aiReactor==="function"?aiReactor(post,[c.name,post.author]):null);if(r2)sched({at:Date.now()+rnd(40,150)*1000,kind:"comment",postId:post.id,actor:r2.name,parent:c.name});}}}}
  }else if(roll<0.74){ // NEW POST — archetypes: polls, sports, breaking, culture, trade
   const n=WORLD.nations[rnd(0,WORLD.nations.length-1)];const p=(typeof socialPost==="function"&&Math.random()<0.65?socialPost(n):(()=>{const body=(typeof speak==="function"?speak(n,livePostBody(n)):livePostBody(n));const img=(typeof aiMediaFor==="function"&&Math.random()<0.55?aiMediaFor(n,"ambient",body):null);return feedAdd(n,body,"post",img);})());
   try{if(typeof sched==="function"&&Math.random()<0.7){const c=aiReactor(p,[n.name]);if(c)sched({at:Date.now()+rnd(20,60)*1000,kind:"comment",postId:p.id,actor:c.name});}}catch(e){}
  const f1=pickReactor(p,[n.name]);if(!p.likedBy.includes(f1.name)){p.likedBy.push(f1.name);p.likes++;}
  if(S&&n.region===S.region)toast(`🌍 ${n.name} posted from your region`);
 }else if(roll<0.86){ // ENDORSEMENT swing between AIs
  const a=WORLD.nations[rnd(0,WORLD.nations.length-1)];const mates=WORLD.nations.filter(n=>n.region===a.region&&n.name!==a.name&&n.wa);if(mates.length){const b=mates[rnd(0,mates.length-1)];
   if(Math.random()<0.7){b.endo++;pushHapp(`${a.name} endorsed ${b.name}.`);if(S&&a.region===S.region&&Math.random()<0.5){const p=feedAdd(a,`${b.name} has our endorsement. Steady hands deserve steady support.`);}}
   else if(b.endo>0){b.endo--;pushHapp(`${a.name} withdrew endorsement from ${b.name}.`);}}
  }else if(roll<0.95){ // WA drift
   const w=Math.random()<0.5?WORLD.wa.ga:WORLD.wa.sc;if(Math.random()<0.55){w.for+=rnd(2,14);}else{w.against+=rnd(2,14);}WORLD.wa.log.unshift({t:Date.now(),x:`Bloc voting shifted ${w.title} to ${w.for.toLocaleString()}–${w.against.toLocaleString()}.`});
  }else if(Math.random()<0.35&&feed.length){ // SHARE with commentary
   const post=feed[rnd(0,Math.min(feed.length-1,9))];const sharer=(typeof aiReactor==="function"?aiReactor(post,[post.author]):null);
   if(sharer&&post.author!==sharer.name){feedAdd(sharer,"♻️ Sharing @"+post.author.split(" ")[0]+": “"+post.body.slice(0,110)+"” — "+["worth your eyes.","this deserves a wider harbor.","read this before you vote.","our ministry co-signs." ][rnd(0,3)],"post",null);}
  }else{ // RMB murmur
  const r=WORLD.regions[rnd(0,WORLD.regions.length-1)];const wit=WORLD.nations.filter(n=>n.region===r.name);if(wit.length){const w2=wit[rnd(0,wit.length-1)];WORLD.rmb[r.name].push({t:Date.now(),n:w2.name,x:["Harbor news: our census rank climbed again.",`Our delegate ${r.delegate} has our confidence.`,`New traders in the harbor — welcome!`,"Editorial meeting tonight — all columnists invited."][rnd(0,3)]});}}
  WORLD.lastLiveAt=Date.now();
  if(Math.random()<0.05){try{window.__aiWarTick&&window.__aiWarTick();}catch(e){}}
  try{window.__townTick&&window.__townTick();}catch(e){}
  save();
  if(!document.hidden){if(VIEW==="feed")feedSafe();else sidebar();}}
function seedFeed(W){WORLD=W;W.feed=[];W.active=[];W.lastLiveAt=Date.now();const SEEDIMG=[{kind:"chart"},{kind:"flag"},{kind:"photo",seed:"nairobi-tech"},{kind:"clip",clip:"harbor",pick:2,seed:"coast-guard"},null,null,null,null];FEED_SEED.forEach((s,i)=>{const n=W.nations.find(x=>x.name===s.a);const p={id:_feedId++,author:s.a,iso:(n?.iso||"un"),t:Date.now()-(i+1)*5.4e6,body:s.b,likes:rnd(2,24),likedBy:[],comments:[],kind:"post",img:SEEDIMG[i]||null};
  const c1=W.nations[(i*5+2)%W.nations.length],c2=W.nations[(i*7+4)%W.nations.length];
  p.likedBy=[c1.name,c2.name];p.comments=[{author:c1.name,iso:c1.iso,t:p.t+36e5,text:smartReply(s.b,c1)}];W.feed.push(p);});rotateActive();WORLD=null;}
function save(){try{localStorage.setItem(LS,JSON.stringify({S,WORLD,VIEW}));}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(LS));if(d&&d.WORLD&&d.WORLD.nations){S=d.S||null;WORLD=d.WORLD;if(!WORLD.full){WORLD=seedWorld();if(S){const clash=WORLD.nations.findIndex(n=>_id(n.name)===_id(S.name));if(clash>=0){const rn=WORLD.nations[clash].region;WORLD.nations.splice(clash,1);const r=WORLD.regions.find(x=>x.name===rn);if(r){r.nations=r.nations.filter(n=>_id(n)!==_id(S.name));}pushHapp(`${fullName(S)} holds the name of ${rn} — the pretender was absorbed.`);}}}if(!WORLD.feed)WORLD.feed=[];if(!WORLD.active)WORLD.active=[];if(!WORLD.wars)WORLD.wars=[];if(!WORLD.warId||isNaN(WORLD.warId))WORLD.warId=1;if(!WORLD.feuds)WORLD.feuds={};if(!WORLD.memory)WORLD.memory=[];if(!WORLD.sched)WORLD.sched=[];if(WORLD.feed.length)_feedId=Math.max(...WORLD.feed.map(p=>p.id||0))+1;if(S&&!S.aff)S.aff={};if(S&&S.milWon===undefined){S.milWon=0;S.milLost=0;}VIEW=d.VIEW||"nation";return true;}}catch(e){}return false;}
let WORLD=null;
function newPlayer(o){return{name:o.name,pretitle:o.pretitle||"The Republic of",motto:o.motto||"Forward, Always",currency:o.currency||"dollar",animal:o.animal||"Otter",leader:o.leader||"",capital:o.capital||"New Dawn City",religion:o.religion||"",iso:o.iso||null,flag:o.flag||mkFlag(rnd(0,99)),civil:o.civil??50,econ:o.econ??50,pol:o.pol??50,pop:5e6,region:o.region||"Founders' Haven",wa:false,endoGiven:[],issues:[],done:0,legislation:[],friends:[],aff:{},milWon:0,milLost:0,budget:{Administration:12,Welfare:10,Education:12,Healthcare:12,Defence:8,"Law & Order":8,Commerce:10,Environment:8,Spirituality:6,"Public Transport":7,"Social Equality":7},notable:"New nations are always interesting.",admirable:"Citizens admire efficiency.",sensibilities:"Upstanding, law-abiding citizens.",crime:"Low",tax:19,bank:0,seenIssues:[],chainsDue:[],founded:"today",vacation:false};}
function fullName(p){return `${p.pretitle} ${titleCase(p.name.replace(/_/g," "))}`;}
function catOf(p){return categoryFor(p.civil,p.pol,p.econ);}
function pushHapp(x){WORLD.happenings.unshift({t:Date.now(),x});WORLD.happenings=WORLD.happenings.slice(0,120);}
function govDesc(p){const c=p.civil,e=p.econ,pl=p.pol;return `Governance leans ${pl>65?"democratic and open":pl<30?"firm and centralized":"pragmatic and mixed"}, the economy is ${e>65?"roaringly capitalist":e<30?"largely state-run":"mixed"}, and civil life feels ${c>65?"free and expressive":c<30?"tightly ordered":"balanced"}.`;}
function industryDesc(p){return p.econ>65?"Tourism, fintech and retail sprint ahead.":p.econ<30?"The state mill, rail and bakery anchor output.":"A blend of public works and private enterprise.";}
function clampP(){["civil","econ","pol"].forEach(k=>S[k]=Math.max(2,Math.min(98,S[k])));S.tax=Math.round(8+(100-S.econ)*0.28+(S.budget.Welfare+S.budget.Healthcare+S.budget.Education)*0.25);}

/* ---------- Issues engine (web of thousands — see issues.js) ---------- */
function maybeIssue(force){if(!S||S.vacation||typeof drawIssue!=="function")return;
  if(S.issues.length>=5)return;
  const q=drawIssue();if(!q)return;
  S.issues.push(Object.assign({},q,{at:Date.now()}));markSeen(q.id);
  pushHapp(`${fullName(S)} received issue: “${q.title}”.`);
  if(!force&&VIEW!=="issues")toast(`📥 New issue: “${q.title}”`);
  save();render();}
function applyIssueFx(fx){if(!fx)return;S.civil+=fx.civil||0;S.econ+=fx.econ||0;S.pol+=fx.pol||0;clampP();
 if(fx.pop)S.pop=Math.max(1e6,S.pop+fx.pop*1e6);if(fx.bank)S.bank=Math.max(0,Math.round((S.bank+fx.bank)*100)/100);}
function answerIssue(id,oi){const qi=S.issues.findIndex(q=>q.id===id);if(qi<0)return;
 const q=S.issues[qi];const def=q.title?q:(typeof getIssueDef==="function"?getIssueDef(id):null);if(!def||!def.opts)return;
 const o=def.opts[oi];if(!o)return;
 S.issues.splice(qi,1);
 if(o.dismiss){pushHapp(`${fullName(S)} dismissed “${def.title}”.`);}
 else{const before=catOf(S);applyIssueFx(o.fx);S.done++;S.pop+=rnd(2,7)*1e6;
   S.legislation.unshift(`${def.title} → ${o.t}`);S.legislation=S.legislation.slice(0,12);
   pushHapp(`${fullName(S)} decided: ${o.t} (Civil ${S.civil} / Econ ${S.econ} / Political ${S.pol}).`);
   if(o.next){S.chainsDue=S.chainsDue||[];S.chainsDue.push({id:o.next,at:Date.now()+25000});toast("🕸️ Your ruling will have consequences…");}
   if(typeof processWorldHook==="function")processWorldHook(o.world,o.t);
   const post=feedAdd({name:S.name,iso:S.iso||"un"},`Our government has ruled on “${def.title}”: ${o.t} ${o.out||""}`);
    setTimeout(()=>{aiRespond(post);save();feedSafe();},1800);
   if(typeof govShiftCheck==="function")govShiftCheck(before);}
 save();render();}

/* ---------- Telegrams / RMB / WA actions ---------- */
function postRMB(msg){if(!msg.trim())return;WORLD.rmb[S.region].push({t:Date.now(),n:S.name,x:msg.slice(0,500)});pushHapp(`${titleCase(S.name)} posted on the ${S.region} RMB.`);
 setTimeout(()=>{const wit=WORLD.nations.filter(n=>n.region===S.region);const w=wit[rnd(0,wit.length-1)];if(w){WORLD.rmb[S.region].push({t:Date.now(),n:w.name,x:["Welcome! Endorse swaps?","Hear hear!","+1, well said.","Interesting take — our paper may quote this!"][rnd(0,3)]});save();if(VIEW.startsWith("region"))render();}},2500);save();render();}
function toggleEndo(n){const i=S.endoGiven.indexOf(n);if(i>=0)S.endoGiven.splice(i,1);else S.endoGiven.push(n);
 const t=WORLD.nations.find(x=>x.name===n);if(t)t.endo=Math.max(0,t.endo+(i>=0?-1:1));
 const reg=WORLD.regions.find(r=>r.name===(t?t.region:S.region));if(reg){const cands=[...WORLD.nations.filter(x=>x.region===reg.name&&x.wa),...(S.region===reg.name&&S.wa?[{name:S.name,endo:S.endoGiven.length*2+3}]:[])].sort((a,b)=>(b.endo??0)-(a.endo??0));reg.delegate=cands[0]?.name||"—";}
 pushHapp(i>=0?`${fullName(S)} withdrew endorsement from ${n}.`:`${fullName(S)} endorsed ${n}.`);
 if(i<0){const p=feedAdd({name:S.name,iso:S.iso||"un"},`We have endorsed ${n}. Strong partners make strong regions.`);setTimeout(()=>{aiRespond(p);save();feedSafe();},1800);}
 save();render();}
function moveRegion(r){const old=S.region;S.region=r;WORLD.regions.find(x=>x.name===old);pushHapp(`${fullName(S)} moved from ${old} to ${r}.`);toast(`Welcome to ${r}!`);const p=feedAdd({name:S.name,iso:S.iso||"un"},`We have arrived in ${r}. Greetings to our new neighbours!`);setTimeout(()=>{aiRespond(p);save();feedSafe();},1800);save();VIEW="region";render();}
function waVote(c,v){const w=c==="ga"?WORLD.wa.ga:WORLD.wa.sc;if(v==="for")w.for++;else w.against++;w.my=v;WORLD.wa.log.unshift({t:Date.now(),x:`${fullName(S)} voted ${v.toUpperCase()} on ${w.title}.`});pushHapp(`${fullName(S)} voted ${v} on ${w.title}.`);const p=feedAdd({name:S.name,iso:S.iso||"un"},`Our delegation voted ${v.toUpperCase()} on ${w.title}.`);setTimeout(()=>{aiRespond(p);save();feedSafe();},1800);save();render();}

/* ---------- Rendering ---------- */
function nationFlagHTML(n,w=180,h=120){if(n.iso)return `<img src="${flagURL(n.iso)}" style="width:${w}px;height:${h}px;object-fit:cover;border:1px solid #6b565e;border-radius:4px;background:#0f0d11" alt="flag" loading="lazy" onerror="this.style.display='none'">`;return flagSVG(n.flag||mkFlag(3),w,h);}
function sidebar(){const el=$("#side");if(!WORLD)return;if(!S){el.innerHTML=`<div class="card"><h3>Welcome, visitor</h3><p>Create a nation to play: answer <b>Issues</b>, shape freedoms, join the <b>World Assembly</b>, talk on <b>WorldBook</b> and climb the <b>World Census</b>.</p><button class="btn primary" onclick="go('create')">Create a Nation</button></div><div class="card"><h3>World at a glance</h3><div class="kv">Nations: <b>${WORLD.nations.length+1}</b><br>Regions: <b>${WORLD.regions.length}</b><br>Day: <b>${WORLD.day}</b></div></div>`;return;}
 const pend=S.issues.length;const ni=$("#nav-issues");if(ni)ni.textContent=pend;
 const nw=$("#nav-war");if(nw){try{nw.textContent=(typeof myWars==="function"?myWars().filter(w=>w.status==="active").length:"")||"";}catch(e){nw.textContent="";}}
 const th=$("#nav-th");if(th){try{th.textContent=(typeof thCounts==="function"?(thCounts().p+thCounts().d+thCounts().a):"")||"";}catch(e){th.textContent="";}}
 el.innerHTML=`
 <div class="card flagbox">${nationFlagHTML(S)}<h3 style="margin:8px 0 0">${esc(fullName(S))}</h3><div class="kv">“${esc(S.motto)}”</div>
 <div class="kv" style="margin-top:6px">Pop: <b>${fmtPop(S.pop)}</b> • ${esc(catOf(S))}</div></div>
 <div class="card"><h3>Freedoms</h3>
 <div class="kv">Civil Rights: <b>${S.civil}</b></div><div class="meter"><i style="width:${S.civil}%"></i></div>
 <div class="kv">Economy: <b>${S.econ}</b></div><div class="meter econ"><i style="width:${S.econ}%"></i></div>
 <div class="kv">Political Freedom: <b>${S.pol}</b></div><div class="meter pol"><i style="width:${S.pol}%"></i></div>
 <div class="kv">Region: <b><a href="#" onclick="go('region');return false">${esc(S.region)}</a></b><br>WA: <b>${S.wa?"Member ✅":"Non-member"}</b> • Issues: <b>${pend}/5</b></div>
 <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="btn small primary" onclick="go('issues')">Answer Issues</button><button class="btn small" onclick="go('feed')">WorldBook</button><button class="btn small" onclick="go('war')">War Room</button><button class="btn small" onclick="go('townhall')">Town Hall</button></div></div>
 <div class="card"><h3>Next issue in <span id="nx">—</span></h3><div class="kv">Population grows as you rule. New dilemmas arrive regularly (max 5 held).</div>
 <div style="margin-top:8px"><button class="btn small" onclick="debugIssue()">Force issue now</button> <button class="btn small" onclick="go('settings')">Settings</button></div></div>
 <div class="card"><h3><span class="livedot"></span>Live wire</h3>${WORLD.happenings.slice(0,5).map(h=>`<div class="happ">⚡ ${esc(h.x)} <span class="ts">(${timeAgo(h.t)})</span></div>`).join("")}<div class="kv" style="margin-top:6px"><a href="#" onclick="go('feed');return false">Open WorldBook →</a></div></div>
 <div class="card"><h3>Search</h3><input id="q" placeholder="nation or region…" oninput="liveSearch(this.value)"><div id="qres" class="kv" style="margin-top:6px"></div></div>`;}
function feedSafe(){if(document.hidden||VIEW!=="feed")return;try{const now=Date.now();
 const busy=[...document.querySelectorAll("video.wbstock")].some(v=>{try{return!v.paused&&!v.ended&&v.currentTime>0&&(now-(+v.dataset.t0||now)<120000);}catch(e){return false;}});
 if(busy)return;}catch(e){}render();}
window.feedSafe=feedSafe;
function liveSearch(v){const r=$("#qres");if(!r)return;v=v.trim().toLowerCase();if(!v){r.innerHTML="";return;}
 const n=WORLD.nations.filter(x=>x.name.toLowerCase().includes(v)).slice(0,4).map(x=>`<div><a href="#" onclick="openNation('${esc(x.name)}');return false">⚑ ${esc(x.name)}</a></div>`).join("");
 const g=WORLD.regions.filter(x=>x.name.toLowerCase().includes(v)).slice(0,4).map(x=>`<div><a href="#" onclick="openRegion('${esc(x.name)}');return false">🏳 ${esc(x.name)}</a></div>`).join("");
 r.innerHTML=n+g||"<i>No matches.</i>";}
window.liveSearch=liveSearch;

function render(){if(!WORLD)return;sidebar();const m=$("#main");
 $$("#topnav .item").forEach(i=>i.classList.toggle("active",i.dataset.view===VIEW));
 $("#worldline").textContent=`${(10040417+WORLD.day*137).toLocaleString()} nations served! • Day ${WORLD.day} • Featured: ${featured()} • ${WORLD.nations.length+1} nations in the world`;
 if(VIEW==="create")return vCreate(m); if(VIEW==="issues")return vIssues(m);
 if(VIEW==="feed")return vFeed(m);
 if(VIEW==="war")return (typeof vWar==="function"?vWar(m):vLanding(m));
 if(VIEW==="townhall")return (typeof vTownhall==="function"?vTownhall(m):vLanding(m));
 if(VIEW==="nation")return S?vNation(m):vLanding(m);
 if(VIEW==="region")return vRegion(m,S?S.region:"Founders' Haven");
 if(VIEW==="regions")return vRegions(m); if(VIEW==="world")return vWorld(m);
 if(VIEW==="activity")return vActivity(m); if(VIEW==="search")return vSearch(m);
 if(VIEW==="wa-ga")return vWA(m,"ga"); if(VIEW==="wa-sc")return vWA(m,"sc"); if(VIEW==="wa-activity")return vWAAct(m);
 if(VIEW==="dispatches")return vDisp(m); if(VIEW==="newspaper")return vNews(m);

 if(VIEW==="help")return vHelp(m); if(VIEW==="api")return vAPI(m); if(VIEW==="about")return vAbout(m);
 if(VIEW==="settings")return vSettings(m);
 if(VIEW.startsWith("nation:"))return vForeign(m,VIEW.slice(7));}
window.go=v=>{VIEW=v;save();render();window.scrollTo(0,0);};
window.openNation=n=>{VIEW="nation:"+n;save();render();};
window.openRegion=r=>{SUB.region=r;VIEW="region2";save();vRegion2();};
function featured(){return WORLD.regions[WORLD.day%WORLD.regions.length].name;}

/* ----- views ----- */
function vLanding(m){m.innerHTML=`
 <div class="card"><h2>⚔️ CivilStrike is a political, social and world simulation. Forge a nation — or break one. It's up to you.</h2>
 <p>Create a nation according to your political ideals and care for its people. Or deliberately oppress them. Answer <b>Issues</b> several times a day, climb the <b>World Census</b>, join the <b>World Assembly</b>, talk diplomacy on <b>WorldBook</b>, run a <b>region</b>, publish <b>dispatches</b>, and wage war in the <b>War Room</b>.</p>
 <p><button class="btn primary" onclick="go('create')">Create a Nation</button> <button class="btn" onclick="go('world')">See the World</button> <button class="btn" onclick="go('feed')">Open WorldBook</button> <button class="btn" onclick="go('help')">How to Play</button></p>
 <div class="notice">🌍 The world is alive: ${WORLD.nations.length} AI nations modeled on the real country list (history.state.gov), each with its own region, capital, currency and flag. They post, like and reply on <b>WorldBook</b> — talk to them and they answer.</div></div>
 <div class="card"><h3>Latest world happenings</h3>${WORLD.happenings.slice(0,6).map(h=>`<div class="happ">⏱ ${timeAgo(h.t)} — ${esc(h.x)}</div>`).join("")}</div>
 <div class="card"><h3>World census snapshot</h3>${censusTable().slice(0,5).join("")}</div>`;}
function censusTable(){const all=[...WORLD.nations.map(n=>({n:n.name,v:n.pop})),...(S?[{n:S.name+" (you)",v:S.pop}]:[])].sort((a,b)=>b.v-a.v);
 return all.slice(0,8).map((r,i)=>`<div class="forumline"><span>#${i+1} ${esc(r.n)}</span><span>${fmtPop(r.v)}</span></div>`);}
function vNation(m){const p=S;
 m.innerHTML=`
 <div class="card flagbox" style="display:grid;grid-template-columns:220px 1fr;gap:16px;text-align:left">
  <div style="text-align:center">${nationFlagHTML(p,220,140)}<div class="kv" style="margin-top:6px">${p.iso?esc(p.iso.toUpperCase())+" • ":""}${p.capital?esc(p.capital):""}</div></div>
  <div><h2>${esc(fullName(p))}</h2><div><i>“${esc(p.motto)}”</i></div>
  <div class="kv">Category: <b>${esc(catOf(p))}</b> • Population: <b>${fmtPop(p.pop)}</b> • Founded: <b>${esc(p.founded)}</b><br>
  Region: <b><a href="#" onclick="go('region');return false">${esc(p.region)}</a></b> • WA: <b>${p.wa?"Member":"Non-member"}</b> • Currency: <b>${esc(p.currency)}</b> • Animal: <b>${esc(p.animal)}</b>${p.leader?` • Leader: <b>${esc(p.leader)}</b>`:""}${p.capital?` • Capital: <b>${esc(p.capital)}</b>`:""}${p.religion?` • Faith: <b>${esc(p.religion)}</b>`:""}</div>
  <div style="margin-top:8px"><button class="btn small ${p.wa?"danger":"primary"}" onclick="toggleWA()">${p.wa?"Resign from WA":"Join World Assembly"}</button> <button class="btn small" onclick="go('issues')">Issues (${p.issues.length})</button> <button class="btn small" onclick="go('feed')">WorldBook</button> <button class="btn small" onclick="go('settings')">Customize</button></div></div></div>
 <div class="card"><h3>Overview</h3><p>${esc(govDesc(p))}</p><p>${esc(industryDesc(p))} Citizens pay <b>${p.tax}%</b> tax. Treasury holds <b>${p.bank.toFixed(2)} bank</b>. Crime is <b>${esc(p.crime)}</b>. The admirable: <b>${esc(p.admirable)}</b></p>
 <h3>Government budget</h3><table class="grid"><tr><th>Department</th><th>Share</th><th></th></tr>${Object.entries(p.budget).map(([k,v])=>`<tr><td>${k}</td><td>${v}%</td><td><div class="meter"><i style="width:${v*4}%"></i></div></td></tr>`).join("")}</table></div>
 <div class="card"><h3>Legislation (latest ${p.legislation.length})</h3>${p.legislation.length?p.legislation.map(l=>`<div class="happ">📜 ${esc(l)}</div>`).join(""):"<i>No laws yet — answer an Issue!</i>"}</div>
 <div class="card"><h3>Happenings for ${esc(p.name)}</h3>${WORLD.happenings.filter(h=>h.x.toLowerCase().includes(p.name.toLowerCase())).slice(0,6).map(h=>`<div class="happ">${esc(h.x)} <span class="ts">(${timeAgo(h.t)})</span></div>`).join("")||"<i>Quiet… suspiciously quiet.</i>"}</div>`;}
window.toggleWA=()=>{if(!S)return;S.wa=!S.wa;if(S.wa){toast("Welcome to the World Assembly! You may now vote and endorse.");pushHapp(`${fullName(S)} joined the World Assembly.`);const p=feedAdd({name:S.name,iso:S.iso||"un"},"We have joined the World Assembly and look forward to working with all delegations.");setTimeout(()=>{aiRespond(p);save();feedSafe();},1800);}else{pushHapp(`${fullName(S)} resigned from the World Assembly.`);S.endoGiven=[];}save();render();};

/* create nation — 8-question quiz + name/currency/animal/flag */
let CQ={ans:Array(8).fill(1)};
window.setQ=(i,v)=>{CQ.ans[i]=v;};
function vCreate(m){CQ={ans:Array(8).fill(1),name:"",motto:"",currency:"",animal:"",region:"Founders' Haven",flag:mkFlag(rnd(0,5))};
 m.innerHTML=`<div class="card"><h2>📰 New Nation</h2>
 <p>Answer honestly — this seeds your freedoms. Then name your nation and choose where to arrive.</p>
 ${QUIZ.map((q,i)=>`<div class="qrow"><p>Q${i+1}. ${q}</p><div class="qopts">${["Strongly Disagree","Disagree","Agree","Strongly Agree"].map((l,li)=>`<label><input type="radio" name="q${i}" ${li===1?"checked":""} onclick="setQ(${i},${li})">${l}</label>`).join("")}</div></div>`).join("")}
 <div class="qrow"><p>Nation name (letters/spaces only)</p><input id="c-name" placeholder="e.g. New Arcadia"></div>
 <div class="qrow" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><p>Motto</p><input id="c-motto" value="Forward, Always"></div><div><p>Currency</p><input id="c-cur" value="dollar"></div><div><p>National animal</p><input id="c-ani" value="Otter"></div><div><p>Starting region</p><select id="c-reg" style="width:100%;padding:6px">${WORLD.regions.map(r=>`<option ${r.name==="Founders' Haven"?"selected":""}>${r.name}</option>`).join("")}</select></div></div>
 <div class="qrow"><p>Flag — pick a pattern and colors</p><div style="display:flex;gap:8px;align-items:center"><span id="cflagprev"></span><select id="c-pat" onchange="updFlag()"><option>vertical</option><option>horizontal</option><option>cross</option><option>saltire</option><option>circle</option><option>rays</option></select><input type="color" id="c-c1" value="#c1121f" onchange="updFlag()"><input type="color" id="c-c2" value="#d4a017" onchange="updFlag()"></div></div>
 <button class="btn primary" onclick="found()">Found my nation! 🎉</button></div>`;
 window.updFlag=()=>{CQ.flag={pattern:$("#c-pat").value,c1:$("#c-c1").value,c2:$("#c-c2").value,c3:"#ffffff",emblem:"★"};$("#cflagprev").innerHTML=flagSVG(CQ.flag,160,100);};
 updFlag();}
window.found=()=>{const raw=($("#c-name").value||"").trim().replace(/[^a-zA-Z ]/g,"").slice(0,28)||("New Arcadia "+rnd(10,99));const name=_id(raw);
 if(WORLD.nations.find(n=>_id(n.name)===name)){alert("That nation already exists — pick another name.");return;}
 const a=CQ.ans;const civil=Math.round(50+((a[2]+a[5]+a[7])/3-1.5)*-22+((a[3])/3)*8);const econ=Math.round(50+((a[1]+a[5])/2-1.5)*20);const pol=Math.round(50+((a[0]+a[6])/2-1.5)*20+((a[4])-1.5)*-12);
 S=newPlayer({name,pretitle:"The Republic of",motto:$("#c-motto").value||"Forward, Always",currency:$("#c-cur").value||"dollar",animal:$("#c-ani").value||"Otter",region:$("#c-reg").value,civil,econ,pol,flag:CQ.flag});
 pushHapp(`${fullName(S)} arrived in ${S.region}.`);toast(`Welcome to ${S.region}! Issues arrive on their own — rule well.`);
 const p=feedAdd({name:S.name,iso:"un"},`Hello world! The ${titleCase(S.name.replace(/_/g," "))} has arrived in ${S.region}. We come in peace and trade — say hello!`);setTimeout(()=>{aiRespond(p);save();},2000);
 WORLD.day++;try{if(typeof mkPetition==="function"){const p0=mkPetition();if(p0){pets().unshift(p0);S.lastPet=Date.now();}const greeter=WORLD.nations.find(n=>n.pop<30e6&&n.wa);if(greeter&&typeof mkQuestion==="function"){const g=mkQuestion(greeter);g.did="dm-hello"+Date.now();dems().unshift(g);S.lastDem=Date.now();}}}catch(e){}save();VIEW="nation";render();maybeIssue(true);};

function vIssues(m){if(!S){m.innerHTML=`<div class="card"><h2>Issues</h2><p>Create a nation first.</p><button class="btn primary" onclick="go('create')">Create</button></div>`;return;}
 const chains=(S.chainsDue||[]).length, seen=(S.seenIssues||[]).length;
 const head=`<div class="card"><h2>📥 Issues pending (${S.issues.length}/5) <span class="badge">LIVE</span></h2><p>How you respond determines almost everything about how your nation evolves — rulings chain into follow-ups, stir petitions and demarches, and can transform your government outright. New issues arrive on their own; summon one if you can't wait.</p><div class="kv">Ruled: <b>${S.done}</b> • Archive: <b>${seen} seen</b>${chains?` • <b>${chains} consequence${chains>1?"s":""} brewing…</b>`:""}</div><div style="margin-top:6px"><button class="btn small" onclick="debugIssue()">Summon issue now</button></div></div>`;
 if(!S.issues.length)return m.innerHTML=head+`<div class="card"><h3>All clear!</h3><p class="kv">Population: <b>${fmtPop(S.pop)}</b> • The next dilemma is already forming somewhere in the ministries…</p></div>`;
 m.innerHTML=head+
 S.issues.map(q=>{const d=q.title?q:(typeof getIssueDef==="function"?getIssueDef(q.id):null);if(!d)return"";return `<div class="issue"><h3>${esc(d.title)}${(d.tags||[]).includes("minor")?' <span class="badge">minor matter</span>':""}${(d.tags||[]).includes("chain")?' <span class="badge">consequence</span>':""}</h3><p>${esc(d.text)}</p><div class="opts">${d.opts.map((o,i)=>`<label><input type="radio" name="${q.id}" onclick="answerIssue('${q.id}',${i})"> <b>${esc(o.t)}</b></label>`).join("")}</div></div>`;}).join("");}
window.answerIssue=answerIssue;
window.debugIssue=()=>{maybeIssue(true);save();VIEW="issues";render();};

/* ---------- WorldBook feed view (facebook-clone: Header/Page/Post) ---------- */
function vFeed(m){const feed=WORLD.feed||[];const act=activeNow();const ago=WORLD.lastLiveAt?Math.max(0,Math.round((Date.now()-WORLD.lastLiveAt)/1000)):null;
 const me=S?`<div class="wb-composer">${S.iso?`<img src="${flagURL(S.iso)}" alt="">`:`<span>${flagSVG(S.flag,44,30)}</span>`}<div style="flex:1"><textarea id="wb-text" placeholder="Address the world as ${esc(S?S.name:"your nation")}…" oninput="SUB.draft=this.value">${esc(SUB.draft||"")}</textarea><div style="margin-top:6px;display:flex;gap:6px;justify-content:space-between;align-items:center"><span class="kv">Attach: ${["chart","flag","photo","clip"].map(k=>`<button class="btn small${SUB.media===k?" primary":""}" onclick="SUB.media=SUB.media==='${k}'?null:'${k}';save();render();">${k==="chart"?"📊":k==="flag"?"🏳️":k==="photo"?"📸":"🎬"}</button>`).join("")}</span><button class="btn primary small" onclick="wbPost()">Post to WorldBook</button></div></div></div>`
 :`<div class="card"><p>Create a nation to post on WorldBook. The AI nations are already talking.</p><button class="btn primary" onclick="go('create')">Create a Nation</button></div>`;
 m.innerHTML=`<div class="card"><h2><span class="livedot"></span> WorldBook — diplomacy feed <span class="badge">LIVE</span></h2>
 <div class="kv">${act.length} nations active now: ${act.slice(0,6).map(n=>`${n.iso?`<img src="${flagURL(n.iso)}" style="width:20px;height:13px;vertical-align:middle" loading="lazy" title="${esc(n.name)}">`:""} ${esc(n.name)}`).join(" · ")}${ago!==null?` • <span id="wblive">updated ${ago}s ago</span>`:""}</div>
 <div class="kv">Nations post, like, comment and share in real time. They remember how you treat them — endorse friends, argue the text, and watch who likes what.</div></div>${me}`+
 feed.map(p=>{const mine=S&&p.author===S.name;const liked=S&&p.likedBy.includes(S.name);const an=WORLD.nations.find(n=>n.name===p.author);const per=an?personaOf(an):"";const ttl=(typeof leaderTitle==="function"&&an?leaderTitle(an):"");return `<div class="wb-post">
  <div class="wb-head">${p.iso&&p.iso!=="un"?`<img src="${flagURL(p.iso)}" alt="" loading="lazy" onerror="this.style.display='none'">`:`<span style="font-size:28px">🏛️</span>`}
   <div style="flex:1"><div class="wb-title"><a href="#" onclick="openNation('${esc(p.author)}');return false">${esc(p.author)}</a>${mine?" (you)":""}${per?` <span class="badge">${per}</span>`:""}</div><div class="wb-sub">${ttl?esc(ttl)+" • ":""}${timeAgo(p.t)} • 🌍 WorldBook</div></div><span class="kv">•••</span></div>
  <div class="wb-body">${esc(p.body)}</div>
  ${(typeof mediaHTML==="function"&&p.img)?mediaHTML(p.img,an||(mine?S:null)):""}
  <div class="wb-likes">👍 ${p.likes}${p.likedBy.length?` — liked by ${p.likedBy.slice(0,5).map(n=>esc(n)).join(", ")}${p.likedBy.length>5?` +${p.likedBy.length-5} more`:""}`:""}</div>
  <div class="wb-actions"><div class="${liked?"on":""}" onclick="wbLike(${p.id})">👍 Like${liked?"d":""}</div><div onclick="document.querySelector('#wb-c-${p.id}').focus()">💬 Comment</div><div onclick="wbShare(${p.id})">↗ Share</div></div>
  <div class="wb-comments">${p.comments.map(c=>{const cn=c.author===S?.name?S:WORLD.nations.find(n=>n.name===c.author);return `<div class="wb-comment${c.replyTo?" reply":""}">${cn&&cn.iso&&cn.iso!=="un"?`<img src="${flagURL(cn.iso)}" alt="" loading="lazy">`:`<span>🏛️</span>`}<div class="bubble"><b>${esc(c.author)}</b><br>${esc(c.text)}<br><span class="wb-sub">${timeAgo(c.t)}</span></div></div>`;}).join("")}
   ${S?`<div class="wb-reply"><input id="wb-c-${p.id}" placeholder="Write a comment…" onkeydown="if(event.key==='Enter')wbComment(${p.id})"><button class="btn small" onclick="wbComment(${p.id})">Reply</button></div>`:""}</div></div>`;}).join("")||`<div class="card"><i>No posts yet.</i></div>`;try{if(typeof window.__watchVideos==="function")window.__watchVideos();}catch(e){}}
window.wbPost=()=>{if(!S)return;const t=$("#wb-text").value.trim();if(!t)return;SUB.draft="";let img=null;
 if(SUB.media==="chart")img={kind:"chart"};else if(SUB.media==="flag")img={kind:"flag"};
 else if(SUB.media==="photo")img={kind:"photo",seed:"you-"+Date.now()%9973};
 else if(SUB.media==="clip"){const m=(typeof matchMedia==="function"?matchMedia(S,t):null);img=(m&&m.kind==="clip")?Object.assign({},m,{seed:"you-"+Date.now()%9973}):{kind:"clip",clip:"harbor",seed:"you-"+Date.now()%9973};}
 SUB.media=null;const p=feedAdd({name:S.name,iso:S.iso||"un"},t,"post",img);pushHapp(`${fullName(S)} posted on WorldBook.`);save();render();setTimeout(()=>{aiRespond(p);save();feedSafe();},1800);};
window.wbLike=id=>{if(!S)return alert("Create a nation to like posts.");const r=feedLike(id,S.name);const p=WORLD.feed.find(x=>x.id===id);if(r==="liked"){bumpAffinity(p.author,2);if(Math.random()<0.5)setTimeout(()=>{const n=pickReactor(p,[S.name]);if(!p.likedBy.includes(n.name)){p.likedBy.push(n.name);p.likes++;toast(`👍 ${n.name} also liked “${p.body.slice(0,50)}…”`);save();feedSafe();}},2200);}save();render();};
window.wbComment=id=>{if(!S)return;const inp=$("#wb-c-"+id);const t=(inp.value||"").trim();if(!t)return;const p=WORLD.feed.find(x=>x.id===id);p.comments.push({author:S.name,iso:S.iso||"un",t:Date.now(),text:t.slice(0,300)});bumpAffinity(p.author,2);save();render();setTimeout(()=>{const n=pickReactor(p,[S.name]);p.comments.push({author:n.name,iso:n.iso,t:Date.now(),text:(typeof socialReply==="function"?socialReply(n,p,S.name):smartReply(t,n,p))});bumpAffinity(n.name,1);toast(`💬 ${n.name} replied to you`);save();feedSafe();
 if(Math.random()<0.4){try{const r2=aiReactor(p,[S.name,n.name]);if(r2)sched({at:Date.now()+rnd(50,160)*1000,kind:"comment",postId:p.id,actor:r2.name,parent:n.name});}catch(e){}}},2200);};
window.wbShare=id=>{const p=WORLD.feed.find(x=>x.id===id);if(!p)return;const q=feedAdd(S?{name:S.name,iso:S.iso||"un"}:{name:p.author,iso:p.iso},`Shared from ${p.author}: “${p.body.slice(0,140)}”`);pushHapp(`${S?fullName(S):p.author} shared a WorldBook post.`);save();render();};

function vRegion(m,rn){const r=WORLD.regions.find(x=>x.name===rn)||WORLD.regions[0];const members=[...WORLD.nations.filter(n=>n.region===r.name),...(S&&S.region===r.name?[ {...S,endo:S.endoGiven.length*2+3,you:true}]:[])];
 const waMs=members.filter(x=>x.wa);
 m.innerHTML=`<div class="card"><h2>🏳 ${esc(r.name)} ${r.name===featured()?"⭐ <span class='badge'>FEATURED</span>":""}</h2><p><i>${esc(r.factbook)}</i></p>
 <div class="kv">Founder: <b>${esc(r.founder)}</b> • Delegate: <b>${esc(r.delegate)}</b> (${waMs.length} WA members) • Nations: <b>${members.length}</b><br>Tags: ${r.tags.map(t=>`<span class="badge">${esc(t)}</span>`).join("")}</div>
 ${S&&S.region!==r.name?`<button class="btn primary" onclick="moveRegion('${esc(r.name)}')">Like what you see? Move to ${esc(r.name)}!</button>`:`<span class="badge">YOUR REGION</span>`}</div>
 <div class="card"><h3>Nations (${members.length}) — endorse to elect Delegate</h3><table class="grid"><tr><th>Flag</th><th>Nation</th><th>Category</th><th>Endo</th><th></th></tr>${members.slice(0,40).map(n=>`<tr><td style="width:70px">${n.iso?`<img src="${flagURL(n.iso)}" style="width:60px;height:38px;object-fit:cover;border:1px solid #8a7a55;border-radius:3px" loading="lazy">`:flagSVG(n.flag||mkFlag(1),60,38)}</td><td><a href="#" onclick="openNation('${esc(n.name)}');return false">${esc(n.name)}</a>${n.you?" (you)":""}</td><td>${esc(n.category||"—")}</td><td>${n.endo??"—"}</td><td>${S&&n.name!==S.name&&S.wa&&n.wa?`<button class="btn small" onclick="toggleEndo('${esc(n.name)}')">${S.endoGiven.includes(n.name)?"Withdraw":"Endorse"}</button>`:""}</td></tr>`).join("")}</table></div>
 <div class="card"><h3>Regional Message Board</h3><div>${(WORLD.rmb[r.name]||[]).slice(-8).reverse().map(p=>`<div class="rmb"><span class="who">${esc(titleCase(p.n.replace(/_/g," ")))}</span> <span class="ts">${timeAgo(p.t)}</span><br>${parseBBCodes(p.x)}</div>`).join("")}</div>
 ${S&&S.region===r.name?`<div style="display:flex;gap:6px;margin-top:8px"><input id="rmb-in" placeholder="Say hello… (BBCode: [b] [i] [nation]X[/nation])"><button class="btn primary" onclick="postRMB(document.querySelector('#rmb-in').value);">Post</button></div>`:`<div class="notice">Move here to post on this board.</div>`}</div>
 <div class="card"><h3>Happenings</h3>${WORLD.happenings.filter(h=>h.x.includes(r.name)).slice(0,5).map(h=>`<div class="happ">${esc(h.x)}</div>`).join("")||"<i>None yet.</i>"}</div>`;}
window.postRMB=postRMB;window.toggleEndo=toggleEndo;window.moveRegion=moveRegion;
function vRegion2(){const m=$("#main");const r=WORLD.regions.find(x=>x.name===SUB.region)||WORLD.regions[0];VIEW="region";vRegion(m,r.name);}
function vRegions(m){m.innerHTML=`<div class="card"><h2>🏳️ Regions (${WORLD.regions.length})</h2><p>Each region has its own board, census ranks and delegate. Find somewhere you enjoy the company of your neighbours.</p></div>`+WORLD.regions.map(r=>`<div class="card"><h3><a href="#" onclick="SUB.region='${esc(r.name)}';VIEW='region2';save();vRegion2();return false">${esc(r.name)}</a> <span class="kv">(${r.nations.length} nations • Delegate: ${esc(r.delegate)})</span></h3><p><i>${esc(r.factbook)}</i></p><div>${r.tags.map(t=>`<span class="badge">${esc(t)}</span>`).join("")}</div></div>`).join("");}
function vWorld(m){const tot=WORLD.nations.length+(S?1:0);
 m.innerHTML=`<div class="card"><h2>🗺️ The World</h2><div class="kv">Nations: <b>${tot}</b> • Regions: <b>${WORLD.regions.length}</b> • Featured region: <b>${esc(featured())}</b> • Day: <b>${WORLD.day}</b></div>
 <p><button class="btn small" onclick="refreshDump()">↻ Advance day</button> <button class="btn small" onclick="go('feed')">Open WorldBook</button> <button class="btn small" onclick="go('war')">War Room map</button></p></div>
 <div class="card" id="worldmap-card"><h3>🗺️ World map ${typeof mapButtons==="function"?mapButtons("worldmap-card"):""}</h3>${typeof worldMapSVG==="function"?worldMapSVG():"<i>Loading map…</i>"}<div class="kv">Click a country to open its dossier.</div></div>
 <div class="card"><h3>World Census — Largest Population</h3>${censusTable()}</div>
 <div class="card"><h3>Economic output ranking</h3>${[...WORLD.nations].sort((a,b)=>b.econ-a.econ).slice(0,8).map((n,i)=>`<div class="forumline"><span>#${i+1} ${esc(n.name)}</span><span>index ${n.econ}</span></div>`).join("")}</div>
 <div class="card"><h3>Newest arrivals</h3>${S?`<div class="happ">⚑ ${esc(S.name)} (you) — ${esc(catOf(S))}</div>`:""}${[...WORLD.nations].slice(0,6).map(n=>`<div class="happ">${n.iso?`<img src="${flagURL(n.iso)}" style="width:22px;height:14px;vertical-align:middle" loading="lazy"> `:"⚑ "}${esc(n.name)} — ${esc(n.category)} (${esc(n.region)})</div>`).join("")}</div>`;}
window.refreshDump=()=>{WORLD.dumpDay++;WORLD.day++;WORLD.nations.forEach(n=>{n.pop+=rnd(1,9)*1e6;});if(S)S.pop+=rnd(3,8)*1e6;pushHapp(`Day ${WORLD.day}: census updated, populations grown.`);if(Math.random()<0.7){const n=WORLD.nations[rnd(0,WORLD.nations.length-1)];const p=feedAdd(n,`Day ${WORLD.day} report from ${n.name}: markets ${n.econ>60?"strong":"steady"}, spirits ${n.civil>60?"high":"calm"}.`);p.likes=rnd(1,8);}save();render();};
function vActivity(m){m.innerHTML=`<div class="card"><h2>📜 Activity — world happenings</h2><div class="tabs"><button class="active">World</button><button onclick="go('wa-activity')">WA</button><button onclick="go('region')">Region</button><button onclick="go('feed')">WorldBook</button></div>${WORLD.happenings.map(h=>`<div class="happ">⏱ ${timeAgo(h.t)} — ${esc(h.x)}</div>`).join("")}</div>`;}
function vSearch(m){m.innerHTML=`<div class="card"><h2>🔍 Search the world</h2><input id="s2" placeholder="type a nation or region…" oninput="document.querySelector('#s2r').innerHTML=searchHTML(this.value)"><div id="s2r" style="margin-top:8px"></div></div>
 <div class="card"><h3>All nations (${WORLD.nations.length})</h3>${WORLD.nations.map(n=>`<div class="happ"><a href="#" onclick="openNation('${esc(n.name)}');return false">${n.iso?`<img src="${flagURL(n.iso)}" style="width:22px;height:14px;vertical-align:middle" loading="lazy"> `:"⚑ "}${esc(n.name)}</a> — ${esc(n.category)} • ${esc(n.region)}</div>`).join("")}</div>`;}
window.searchHTML=v=>{v=(v||"").toLowerCase();if(!v)return"";return WORLD.nations.filter(n=>n.name.toLowerCase().includes(v)).map(n=>`<div><a href="#" onclick="openNation('${esc(n.name)}')">${esc(n.name)}</a></div>`).join("")+WORLD.regions.filter(r=>r.name.toLowerCase().includes(v)).map(r=>`<div><a href="#" onclick="SUB.region='${esc(r.name)}';VIEW='region2';save();vRegion2()">${esc(r.name)}</a></div>`).join("")||"<i>No matches</i>";};
function vForeign(m,name){const n=WORLD.nations.find(x=>x.name===name);if(!n){m.innerHTML=`<div class="card"><h2>Unknown nation</h2><button class="btn" onclick="go('world')">Back</button></div>`;return;}
 const aff=S?affinityTo(n):50;const acts=WORLD.happenings.filter(h=>h.x.includes(name)).slice(0,4);
 m.innerHTML=`<div class="card flagbox" style="display:grid;grid-template-columns:200px 1fr;gap:14px;text-align:left"><div style="text-align:center">${nationFlagHTML(n,200,130)}<div class="kv">${esc(n.pretitle)}${n.capital?" • "+esc(n.capital):""}</div></div>
 <div><h2>${esc(n.pretitle+" "+titleCase(n.name.replace(/_/g," ")))}</h2><div><i>“${esc(n.motto)}”</i></div><div class="kv">${typeof leaderTitle==="function"?(()=>{const rl=(typeof realLeader==="function"?realLeader(n):null);return `👑 Led by <b>${esc(leaderTitle(n))}${rl&&rl.n?" "+esc(rl.n):""}</b> • ${esc(SYSNAME[systemOf(n)]||"")} • `;})():""}<span class="badge">${personaOf(n)}</span><br>Category: <b>${esc(n.category)}</b> • Pop: <b>${fmtPop(n.pop)}</b><br>Region: <b>${esc(n.region)}</b> • WA: <b>${n.wa?"Member":"No"}</b> • Endorsements: <b>${n.endo}</b><br>Currency: ${esc(n.currency)} • Animal: ${esc(n.animal)}${n.capital?` • Capital: ${esc(n.capital)}`:""}${S?`<br>Stance toward you: <b>${aff>=70?"Ally 🤝":aff>=55?"Friendly 🙂":aff>=40?"Neutral 😐":"Cold ❄️"}</b> (${aff})`:""}</div>
 <div style="margin-top:8px">${S&&S.wa&&n.wa&&n.name!==S?.name?`<button class="btn small primary" onclick="toggleEndo('${esc(n.name)}')">${S.endoGiven.includes(n.name)?"Withdraw endorsement":"Endorse "+esc(n.name)}</button>`:""} <button class="btn small" onclick="go('feed')">Message on WorldBook</button></div></div></div>
 <div class="card"><h3>Freedoms</h3><div class="kv">Civil ${n.civil} • Economy ${n.econ} • Political ${n.pol}</div><div class="meter"><i style="width:${n.civil}%"></i></div><div class="meter econ"><i style="width:${n.econ}%"></i></div><div class="meter pol"><i style="width:${n.pol}%"></i></div><p>${esc(n.legislation[0]||"")}</p></div>
 <div class="card"><h3>How ${esc(n.name)} acts</h3>${acts.map(h=>`<div class="happ">⚡ ${esc(h.x)} <span class="ts">(${timeAgo(h.t)})</span></div>`).join("")||"<i>No recent moves.</i>"}</div>
 <div class="card"><h3>Recent posts by ${esc(n.name)}</h3>${(WORLD.feed||[]).filter(p=>p.author===n.name).slice(0,3).map(p=>`<div class="happ">💬 ${esc(p.body.slice(0,140))} <span class="ts">(${timeAgo(p.t)} • 👍${p.likes})</span></div>`).join("")||"<i>No posts yet.</i>"}</div>`;}
function vWA(m,c){const w=c==="ga"?WORLD.wa.ga:WORLD.wa.sc;const tot=w.for+w.against;const pf=Math.round(w.for/tot*100);
 m.innerHTML=`<div class="card"><h2>${c==="ga"?"⚖️ General Assembly":"🛡️ Security Council"} — at vote</h2>
 <h3>${esc(w.title)}</h3><div class="kv">Proposed by <b>${esc(w.by)}</b> • Category: <b>${esc(w.cat)}</b></div><p>${esc(w.text)}</p>
 <div class="kv">FOR <b>${w.for.toLocaleString()}</b> (${pf}%) vs AGAINST <b>${w.against.toLocaleString()}</b></div><div class="meter"><i style="width:${pf}%"></i></div>
 <div style="margin-top:8px">${S?(S.wa?`<button class="btn small primary" onclick="waVote('${c}','for')">Vote FOR</button> <button class="btn small danger" onclick="waVote('${c}','against')">Vote AGAINST</button>${w.my?` <span class="badge">YOU: ${w.my.toUpperCase()}</span>`:""}`:`<div class="notice">Join the WA to vote. Delegates wield +1 vote per endorsement.</div><button class="btn primary" onclick="toggleWA()">Join WA</button>`):`<div class="notice">Create a nation to vote.</div>`}</div></div>
 <div class="card"><h3>Delegate vote weights</h3><table class="grid"><tr><th>Delegate of</th><th>Nation</th><th>Votes (1 + endo)</th></tr>${WORLD.regions.map(r=>{const d=WORLD.nations.find(n=>n.name===r.delegate);return `<tr><td>${esc(r.name)}</td><td>${esc(r.delegate)}</td><td>${d?1+d.endo:1}</td></tr>`;}).join("")}</table></div>
 <div class="card"><h3>Past resolutions</h3><div class="happ">GA #711 Clean Seas — PASSED 9,102 / 4,211</div><div class="happ">SC #317 Protection of Harbor Shipping — FAILED 3,001 / 8,900</div><div class="happ">GA #710 Affordable Transit — PASSED 11,204 / 2,003</div></div>`;}
window.waVote=waVote;
function vWAAct(m){m.innerHTML=`<div class="card"><h2>WA Activity</h2>${WORLD.wa.log.map(l=>`<div class="happ">⏱ ${timeAgo(l.t)} — ${esc(l.x)}</div>`).join("")||"<i>No votes yet — be the first!</i>"}<hr>${WORLD.happenings.filter(h=>/WA|endors/i.test(h.x)).map(h=>`<div class="happ">${esc(h.x)}</div>`).join("")}</div>`;}
function vDisp(m){m.innerHTML=`<div class="card"><h2>📚 Dispatches — Factbooks · Bulletins · Accounts · Meta</h2><button class="btn small primary" onclick="newDispatch()">+ New dispatch</button><div id="dl" style="margin-top:8px">${(S?.dispatches||[{t:"Welcome dispatch",c:"How I arrived in "+(S?S.region:"the world")+" — endorsements matter!",k:"Factbook"}]).map(d=>`<div class="rmb"><b>${esc(d.t)}</b> <span class="badge">${esc(d.k)}</span><br>${esc(d.c)}</div>`).join("")}</div></div>`;}
window.newDispatch=()=>{if(!S)return;const t=prompt("Title:","My factbook");if(!t)return;S.dispatches=S.dispatches||[];S.dispatches.unshift({t,c:prompt("Body:","Our history begins…")||"",k:"Factbook"});save();render();};
function vNews(m){m.innerHTML=`<div class="card"><h2>🗞️ Regional newspapers</h2></div>`+WORLD.papers.map((p,i)=>`<div class="card"><h3>${esc(p.title)} <span class="kv">— ${esc(p.region)} • Edition #${p.ed}</span></h3>${p.articles.map(a=>`<div class="rmb">📰 <b>${esc(a)}</b><br><span class="kv">By staff of ${esc(p.region)} • ${timeAgo(Date.now()-rnd(2,50)*36e5)}</span></div>`).join("")}<button class="btn small" onclick="pubArt(${i})">Publish article</button></div>`).join("");}
window.pubArt=i=>{if(!S)return alert("Create a nation first");const a=prompt("Headline:","Breaking: "+S.name+" does something notable");if(!a)return;WORLD.papers[i].articles.unshift(a+" — by "+S.name);WORLD.papers[i].ed++;pushHapp(`${S.name} published “${a}” in ${WORLD.papers[i].title}.`);save();render();};
function vHelp(m){m.innerHTML=`<div class="card"><h2>❓ How to play</h2>
 <p><b>What do I do?</b> Create a nation → answer <b>Issues</b> (max 5 held) → shape <b>Civil / Economy / Political</b> freedoms → earn a <b>category</b> → grow population → join the <b>World Assembly</b>, endorse neighbours, elect a <b>Delegate</b>, rule a <b>region</b>, and talk on <b>WorldBook</b>.</p>
 <p><b>WorldBook?</b> The diplomacy feed where all ${WORLD.nations.length} nations live. Post, like, comment, share — AI nations respond to your rulings, votes and endorsements.</p>
 <p><b>Win?</b> There is no winning — only influence and census ranks.</p>
 <p><b>WA?</b> Two councils (General Assembly law, Security Council commendations). Members vote; delegates add +1 per endorsement.</p>
 <p><b>War Room?</b> Inspect your militia (power scales from population, economy and victories), read the live world map, and declare wars — political takeover, total takeover, land grab, or all three. Wars are fought as turn-based tactics battles (move, attack, capture, build, CO powers) or auto-resolved. AI nations fight their own wars too — the map changes.</p>
 <p><b>Treasury?</b> Bank funds clinics, parades, bribes and wars. Earn it from town rulings, tributes and compacts.</p></div>
 <div class="card"><h3>Keyboard</h3><div class="kv">N nation • I issues • W world • R region • G GA • T town hall</div></div>`;}
async function vAPI(m){m.innerHTML=`<div class="card"><h2>🔌 World Data</h2><div class="kv">Rate limit ${api.remaining()}/49 per 30s</div><div class="tabs"><button class="btn small" onclick="apiDemo('nation')">Nation file</button><button class="btn small" onclick="apiDemo('region')">Region file</button><button class="btn small" onclick="apiDemo('world')">World file</button><button class="btn small" onclick="apiDemo('wa')">Assembly file</button></div><pre class="api" id="apiout">Select a file…</pre><p class="kv">Live record endpoint with local World Archive fallback: category, freedoms, endorsements, legislation, happenings, messages, census…</p></div>`;
 window.apiDemo=async k=>{const o=$("#apiout");o.textContent="reading…";let r;if(k==="nation")r=await api.getNationInfo(S?S.name:"germany");if(k==="region")r=await api.getRegionInfo(S?S.region:"Europe");if(k==="world")r=await api.getWorldInfo();if(k==="wa")r=await api.getWAInfo(1);o.textContent=(r.live?"● LIVE RECORD\n":"○ WORLD ARCHIVE RECORD\n")+JSON.stringify(r,null,2).slice(0,3000);};} 
function vAbout(m){const rows=REAL_NATIONS.map(r=>`<tr><td><img src="${flagURL(r[1])}" style="width:26px;height:17px;vertical-align:middle" loading="lazy"> ${r[0]}</td><td>${r[2]}</td><td>${r[5]}</td><td>${r[4]}M</td></tr>`).join("");
 m.innerHTML=`<div class="card"><h2>🌍 Nations of the World (${REAL_NATIONS.length})</h2><p class="kv">The AI cast mirrors the real country list — <b>history.state.gov/countries/all</b> (U.S. Dept. of State Office of the Historian). Each plays the game: joins the WA, earns endorsements, posts on WorldBook, votes and reacts to you.</p><table class="grid"><tr><th>Nation</th><th>Capital</th><th>Region</th><th>Pop.</th></tr>${rows}</table></div>`;}
function vSettings(m){if(!S){m.innerHTML=`<div class="card"><p>Create a nation first.</p></div>`;return;}
 m.innerHTML=`<div class="card"><h2>⚙️ Settings — ${esc(S.name)}</h2>
 <div class="qrow"><p>Pretitle</p><select id="s-pre">${["The Republic of","The Kingdom of","The Federation of","The People's State of","The Free Land of","The Empire of","The Commune of"].map(p=>`<option ${S.pretitle===p?"selected":""}>${p}</option>`).join("")}</select></div>
 <div class="qrow" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><p>Motto</p><input id="s-mot" value="${esc(S.motto)}"></div><div><p>Currency</p><input id="s-cur" value="${esc(S.currency)}"></div><div><p>Animal</p><input id="s-ani" value="${esc(S.animal)}"></div><div><p>Leader / Capital / Faith</p><input id="s-lea" value="${esc(S.leader)}" placeholder="Leader"><input id="s-cap" value="${esc(S.capital)}" placeholder="Capital" style="margin-top:4px"><input id="s-rel" value="${esc(S.religion)}" placeholder="Religion" style="margin-top:4px"></div></div>
 <label><input type="checkbox" id="s-vac" ${S.vacation?"checked":""}> Vacation mode (pauses issues)</label><br><br>
 <button class="btn primary" onclick="saveSettings()">Save</button> <button class="btn danger" onclick="abandon()">Abandon nation</button> <button class="btn" onclick="go('nation')">Back</button></div>`;}
window.saveSettings=()=>{S.pretitle=$("#s-pre").value;S.motto=$("#s-mot").value;S.currency=$("#s-cur").value;S.animal=$("#s-ani").value;S.leader=$("#s-lea").value;S.capital=$("#s-cap").value;S.religion=$("#s-rel").value;S.vacation=$("#s-vac").checked;save();render();};
window.abandon=()=>{if(!confirm("Abandon "+S.name+"? Its WorldBook posts will remain as history."))return;pushHapp(`${fullName(S)} ceased to exist.`);S=null;save();VIEW="create";render();};

/* ---------- boot + loops ---------- */
document.addEventListener("click",e=>{const n=e.target.closest("[data-nation]");if(n){e.preventDefault();openNation(n.dataset.nation.replace(/ /g,"_").toLowerCase());}const r=e.target.closest("[data-region]");if(r){e.preventDefault();SUB.region=r.dataset.region;VIEW="region2";save();vRegion2();}});
$$("#topnav [data-view]").forEach(el=>el.onclick=()=>go(el.dataset.view));
$("#btn-new").onclick=()=>go("create");
$("#btn-login").onclick=()=>{const n=$("#login-nation").value.trim();if(!n)return alert("Enter nation name");if(S&&_id(S.name)===_id(n)){go("nation");}else{const f=WORLD.nations.find(x=>_id(x.name)===_id(n));if(f){openNation(f.name);}else alert("No such nation in this world — create it!");}};
document.addEventListener("keydown",e=>{if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;const k=e.key.toLowerCase();if(k==="n")go("nation");if(k==="i")go("issues");if(k==="w")go("world");if(k==="r")go("region");if(k==="g")go("wa-ga");if(k==="t")go("townhall");});
setInterval(()=>{if(!WORLD)return;if(S&&!S.vacation){S.pop+=rnd(1,4)*1e5;}WORLD.day++;if(WORLD.day%9===0){WORLD.dumpDay++;}if(S&&Math.random()<0.6)maybeIssue();const w=[WORLD.wa.ga,WORLD.wa.sc][rnd(0,1)];if(Math.random()<0.5)w.for+=rnd(1,9);else w.against+=rnd(1,9);try{window.__warDayTick&&window.__warDayTick();}catch(e){}save();if(!document.hidden)render();},45000);
setInterval(()=>{liveTick();},12000);
setInterval(()=>{if(!WORLD)return;const el=$("#clock");if(el)el.textContent=new Date().toLocaleString()+" • Day "+WORLD.day;const nx=$("#nx");if(nx)nx.textContent="~45s tick";const wl=$("#wblive");if(wl&&WORLD.lastLiveAt)wl.textContent="updated "+Math.max(0,Math.round((Date.now()-WORLD.lastLiveAt)/1000))+"s ago";},1000);
(function boot(){try{if(!load()||!WORLD||!WORLD.regions||!WORLD.nations||!WORLD.nations.length||!WORLD.feed){WORLD=seedWorld();S=S||null;VIEW="nation";}if(!WORLD.rmb)WORLD=seedWorld();if(!WORLD.active)WORLD.active=[];}catch(e){console.error(e);try{WORLD=seedWorld();}catch(e2){} }render();rotateActive();
 if(S&&!S.issues.length)setTimeout(()=>maybeIssue(true),4000);})();
