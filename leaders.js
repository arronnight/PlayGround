/* Leaders & political styles — every AI nation speaks like its own government.
 * Systems: DEM democracy, HYB hybrid, AUTH authoritarian, SOC one-party,
 * MON monarchy, THEO theocracy, JUNTA military-led. Titles resolve from the
 * system with per-country overrides (Prime Ministers, Chancellors, Emirs…).
 * Media engine: census charts from LIVE data, flag showcases, scenic photos
 * and animated clips — all inline SVG so they always load. */
"use strict";
const SYSTEMS={ALB:"DEM",AND:"DEM",DZA:"AUTH",AGO:"HYB",ATG:"DEM",ARG:"DEM",ARM:"DEM",AUS:"DEM",AUT:"DEM",AZE:"AUTH",BHS:"DEM",BHR:"MON",BGD:"HYB",BRB:"DEM",BLR:"AUTH",BEL:"DEM",BLZ:"DEM",BEN:"HYB",BMU:"DEM",BTN:"MON",BOL:"HYB",BIH:"HYB",BWA:"DEM",BRA:"DEM",BRN:"MON",BGR:"DEM",BFA:"JUNTA",BDI:"HYB",KHM:"AUTH",CMR:"AUTH",CAN:"DEM",CAF:"HYB",TCD:"JUNTA",CHL:"DEM",CHN:"SOC",COL:"DEM",CRI:"DEM",HRV:"DEM",CUB:"SOC",CYP:"DEM",CZE:"DEM",COD:"HYB",DNK:"DEM",DJI:"AUTH",DOM:"DEM",TLS:"HYB",ECU:"HYB",EGY:"AUTH",SLV:"HYB",GNQ:"AUTH",ERI:"AUTH",EST:"DEM",ETH:"HYB",FLK:"HYB",FJI:"HYB",FIN:"DEM",FRA:"DEM",GUF:"HYB",GAB:"JUNTA",GMB:"HYB",GEO:"HYB",DEU:"DEM",GHA:"DEM",GRC:"DEM",GRL:"HYB",GTM:"HYB",GIN:"JUNTA",GNB:"HYB",GUY:"HYB",HTI:"HYB",HND:"HYB",HUN:"HYB",ISL:"DEM",IND:"DEM",IDN:"HYB",IRN:"THEO",IRQ:"HYB",IRL:"DEM",ISR:"DEM",ITA:"DEM",CIV:"HYB",JAM:"DEM",JPN:"DEM",JOR:"MON",KAZ:"AUTH",KEN:"DEM",KSV:"HYB",KWT:"MON",KGZ:"HYB",LAO:"SOC",LVA:"DEM",LBN:"HYB",LSO:"HYB",LBR:"HYB",LBY:"HYB",LIE:"DEM",LTU:"DEM",LUX:"DEM",MKD:"HYB",MDG:"HYB",MWI:"HYB",MYS:"HYB",MDV:"HYB",MLI:"JUNTA",MLT:"DEM",MHL:"HYB",MRT:"HYB",MUS:"DEM",MEX:"DEM",FSM:"HYB",MDA:"HYB",MCO:"MON",MNG:"DEM",MNE:"HYB",MAR:"MON",MOZ:"HYB",MMR:"JUNTA",NAM:"HYB",NRU:"HYB",NPL:"HYB",NLD:"DEM",NCL:"HYB",NZL:"DEM",NIC:"AUTH",NER:"JUNTA",NGA:"HYB",PRK:"SOC",NCY:"HYB",NOR:"DEM",OMN:"MON",PAK:"HYB",PLW:"HYB",PSE:"HYB",PAN:"DEM",PNG:"HYB",PRY:"HYB",PER:"HYB",PHL:"HYB",POL:"DEM",PRT:"DEM",PRI:"HYB",QAT:"MON",COG:"HYB",ROU:"DEM",RUS:"AUTH",RWA:"AUTH",WSM:"HYB",SMR:"DEM",SAU:"MON",SEN:"DEM",SRB:"HYB",SYC:"DEM",SLE:"HYB",SGP:"HYB",SVK:"DEM",SVN:"DEM",SLB:"HYB",SOM:"HYB",SLD:"HYB",ZAF:"DEM",KOR:"DEM",SSD:"HYB",ESP:"DEM",LKA:"HYB",SDN:"JUNTA",SUR:"HYB",SWZ:"MON",SWE:"DEM",CHE:"DEM",SYR:"HYB",TWN:"DEM",TJK:"AUTH",THA:"HYB",TGO:"HYB",TON:"MON",TTO:"DEM",TUN:"HYB",TUR:"HYB",TKM:"AUTH",UGA:"AUTH",UKR:"HYB",ARE:"MON",GBR:"DEM",TZA:"HYB",USA:"DEM",URY:"DEM",UZB:"AUTH",VUT:"HYB",VEN:"AUTH",VNM:"SOC",ESH:"HYB",YEM:"HYB",ZMB:"HYB",ZWE:"AUTH"};
const SYSNAME={DEM:"Democracy",HYB:"Hybrid regime",AUTH:"Authoritarian",SOC:"One-party state",MON:"Monarchy",THEO:"Theocracy",JUNTA:"Military-led"};
const TITLES={DEU:"Chancellor",AUT:"Chancellor",MMR:"Chairman",SDN:"Chairman",BRN:"Sultan",OMN:"Sultan",QAT:"Emir",KWT:"Emir",GBR:"Prime Minister",ITA:"Prime Minister",ESP:"Prime Minister",NLD:"Prime Minister",BEL:"Prime Minister",SWE:"Prime Minister",NOR:"Prime Minister",DNK:"Prime Minister",FIN:"Prime Minister",IRL:"Taoiseach",PRT:"Prime Minister",GRC:"Prime Minister",POL:"Prime Minister",IND:"Prime Minister",JPN:"Prime Minister",AUS:"Prime Minister",CAN:"Prime Minister",NZL:"Prime Minister",MYS:"Prime Minister",THA:"Prime Minister",NPL:"Prime Minister",ISR:"Prime Minister",KHM:"Prime Minister",ETH:"Prime Minister",FJI:"Prime Minister",PNG:"Prime Minister",SLB:"Prime Minister",VUT:"Prime Minister",LSO:"Prime Minister",BHS:"Prime Minister",BLZ:"Prime Minister",JAM:"Prime Minister",TTO:"Prime Minister",EST:"Prime Minister",LVA:"Prime Minister",LTU:"Prime Minister",SVK:"Prime Minister",SVN:"Prime Minister",CZE:"Prime Minister",HRV:"Prime Minister",BGR:"Prime Minister",ALB:"Prime Minister",MKD:"Prime Minister",MNE:"Prime Minister",MNG:"Prime Minister",BTN:"Prime Minister",PAK:"Prime Minister",TLS:"Prime Minister",KSV:"Prime Minister",GRL:"Prime Minister",LUX:"Prime Minister",MLT:"Prime Minister",HUN:"Prime Minister",GEO:"Prime Minister",ARM:"Prime Minister",MAR:"Prime Minister",JOR:"Prime Minister",BGD:"Prime Minister",IRQ:"Prime Minister",SAU:"Prime Minister",ARE:"President",LBY:"Prime Minister",TGO:"Prime Minister",MUS:"Prime Minister"};
/* Real leaders in office (Oct 2026). s = signature openers, q = signature quips. */
const REAL_LEADERS={
USA:{n:"Donald Trump",t:"President",s:["Look, nobody does it better than us, okay?","Let me tell you — and I mean this,"],q:["Believe me.","Tremendous. Absolutely tremendous.","Nobody's ever seen anything like it."]},
CHN:{n:"Xi Jinping",t:"General Secretary",s:["For the great rejuvenation of our nation,","Consultation on equal footing teaches us:"],q:["A community of shared future for mankind."]},
RUS:{n:"Vladimir Putin",t:"President",s:["Colleagues, let us speak plainly about history,","There are red lines, and then there are red lines:"],q:["Our response will be symmetrical."]},
UKR:{n:"Volodymyr Zelenskyy",t:"President",s:["Dear friends — Ukraine hears you,","I will say it plainly, as always:"],q:["Thank you for standing with Ukraine.","We need ammunition, not applause."]},
FRA:{n:"Emmanuel Macron",t:"President",s:["En même temps — at the same time, hear me out:","Europe must stand on its own feet, and so:"]},
GBR:{n:"Andy Burnham",t:"Prime Minister",s:["Let me be straight with you,","Up and down this country people tell me:"],q:["Proper jobs, proper pay."]},
DEU:{n:"Friedrich Merz",t:"Chancellor",s:["Germany must perform again — Leistung matters,","Plainly, as a businessman and as Chancellor:"],q:["Performance first."]},
JPN:{n:"Sanae Takaichi",t:"Prime Minister",s:["As Japan's first woman prime minister, I say clearly:","Calmly, firmly, and without hesitation:"]},
IND:{n:"Narendra Modi",t:"Prime Minister",s:["My dear countrymen — all 140 crore of us,","Brothers and sisters across the world:"],q:["140 crore dreams, one resolve."]},
BRA:{n:"Luiz Inácio Lula da Silva",t:"President",s:["Never before in this country has anyone said it better:","The workers taught me everything:"]},
ARG:{n:"Javier Milei",t:"President",s:["The caste trembles, and I tell you why:","Afuera! Out with it all, I say:"],q:["¡Viva la libertad, carajo!"]},
CAN:{n:"Mark Carney",t:"Prime Minister",s:["The data is clear, and I follow data:","In a crisis, plan beats panic — so:"]},
MEX:{n:"Claudia Sheinbaum",t:"President",s:["As a scientist and as your president,","With evidence and with conscience:"]},
ITA:{n:"Giorgia Meloni",t:"Prime Minister",s:["I am Giorgia, and I do not bend:","God, fatherland, family — and therefore:"],q:["Italy first, always."]},
ESP:{n:"Pedro Sánchez",t:"Prime Minister",s:["España avanza — Spain moves forward,","Resilience is our middle name:"]},
TUR:{n:"Recep Tayyip Erdoğan",t:"President",s:["My brothers, hear a plain truth:","Six centuries taught us patience:"] ,q:["The world is bigger than five."]},
KOR:{n:"Lee Jae Myung",t:"President",s:["Pragmatism over ideology — that is my doctrine:","From factory floor to Blue House, I learned:"]},
PRK:{n:"Kim Jong Un",t:"General Secretary",s:["In single-hearted unity,","By the Juche idea, self-reliance commands:"],q:["Our spirit is stronger than any sanction."]},
IRN:{n:"Mojtaba Khamenei",t:"Supreme Leader",s:["The arrogant powers circle, yet faith holds:","Resistance is not a choice but a duty:"]},
ISR:{n:"Benjamin Netanyahu",t:"Prime Minister",s:["Citizens of Israel — hear me:","On security there is no coalition and no opposition:"],q:["We will win. Total victory."]},
SAU:{n:"Mohammed bin Salman",t:"Prime Minister",s:["Vision 2030 is not a slogan, it is a schedule:","We build cities in the sand and futures to match:"]},
EGY:{n:"Abdel Fattah el-Sisi",t:"President",s:["Egypt's stability is the region's stability:","A hundred million souls depend on calm:"]},
PAK:{n:"Shehbaz Sharif",t:"Prime Minister",s:["Work, work and more work — that is the program:","Pakistan comes first, politics second:"]},
AUS:{n:"Anthony Albanese",t:"Prime Minister",s:["A fair go — that is what we believe in:","No one held back, no one left behind:"]},
NZL:{n:"Christopher Luxon",t:"Prime Minister",s:["Delivery matters more than promises:","Run the country like it matters — because it does:"]},
ZAF:{n:"Cyril Ramaphosa",t:"President",s:["Through consultation we find the path:","Let us talk frankly, as South Africans do:"]},
NGA:{n:"Bola Tinubu",t:"President",s:["Renewed Hope is not a slogan, it is a budget:","The reforms hurt today so tomorrow can breathe:"]},
KEN:{n:"William Ruto",t:"President",s:["Bottom-up — the hustler nation rises:","From chicken seller to State House, hear me:"]},
ETH:{n:"Abiy Ahmed",t:"Prime Minister",s:["Medemer — synergy — guides us:","We planted trees and ideas both:"]},
RWA:{n:"Paul Kagame",t:"President",s:["Agaciro — dignity — is not negotiable:","We do not wait to be saved:"]},
UGA:{n:"Yoweri Museveni",t:"President",s:["Forty years teach patience. Listen:","No shortcuts — steady hands:"]},
VEN:{n:"Delcy Rodríguez",t:"President",s:["Venezuela stands, whatever the empire attempts:","Our oil, our people, our decision:"]},
CUB:{n:"Miguel Díaz-Canel",t:"President",s:["The blockade bites; the revolution endures:","Continuity with creativity:"],q:["¡Patria o Muerte!"]},
VNM:{n:"Tô Lâm",t:"General Secretary",s:["The Party leads, the people build:","Discipline plus renovation:"]},
LAO:{n:"Thongloun Sisoulith",t:"General Secretary",s:["Step by step, as the Party teaches:"]},
CHL:{n:"José Antonio Kast",t:"President",s:["Orden y patria — order and homeland:","Chile will be safe again:"]},
COL:{n:"Abelardo de la Espriella",t:"President",s:["Colombia deserves better, and now:"]},
PER:{n:"Keiko Fujimori",t:"President",s:["A new chapter for Peru begins:"]},
BOL:{n:"Rodrigo Paz",t:"President",s:["After the long night, a centrist dawn:"]},
URY:{n:"Yamandú Orsi",t:"President",s:["The Broad Front returns with open arms:"]},
ECU:{n:"Daniel Noboa",t:"President",s:["The new Ecuador does not negotiate with terror:"]},
PRY:{n:"Santiago Peña",t:"President",s:["Paraguay works, quietly and well:"]},
GUY:{n:"Irfaan Ali",t:"President",s:["Our oil wealth belongs to every Guyanese:"]},
SUR:{n:"Jennifer Geerlings-Simons",t:"President",s:["Suriname leads itself now:"]},
TTO:{n:"Kamla Persad-Bissessar",t:"Prime Minister",s:["Experience returns to service:"]},
JAM:{n:"Andrew Holness",t:"Prime Minister",s:["Jamaica moves from poverty to prosperity:"]},
HND:{n:"Nasry Asfura",t:"President",s:["Honduras first, always:"]},
GTM:{n:"Bernardo Arévalo",t:"President",s:["The corrupt are on notice — the spring continues:"]},
SLV:{n:"Nayib Bukele",t:"President",s:["The safest country in the hemisphere speaks:","Check the numbers, then check the streets:"],q:["The world's coolest dictator? Guilty."]},
NIC:{n:"Daniel Ortega",t:"President",s:["Sandinismo lives, whatever Washington says:"]},
CRI:{n:"Laura Fernández",t:"President",s:["Costa Rica chooses peace, again:"]},
PAN:{n:"José Raúl Mulino",t:"President",s:["The canal is Panama's, and Panama decides:"]},
DOM:{n:"Luis Abinader",t:"President",s:["The Dominican Republic grows, and honestly:"]},
POL:{n:"Donald Tusk",t:"Prime Minister",s:["Poland is back at Europe's table:","I have buried illiberalism before:"]},
HUN:{n:"Péter Magyar",t:"Prime Minister",s:["A new Hungary rises from the Tisza:","Step aside — the people have stepped up:"]},
ROU:{n:"Nicușor Dan",t:"President",s:["Math doesn't lie, and neither do I:","Corruption fears calculators:"]},
CZE:{n:"Andrej Babiš",t:"Prime Minister",s:["ANO will sort it — like a business, but a country:"]},
SVK:{n:"Robert Fico",t:"Prime Minister",s:["Slovakia first, Brussels second:"]},
NLD:{n:"Rob Jetten",t:"Prime Minister",s:["New energy — literally and politically:"]},
BEL:{n:"Bart De Wever",t:"Prime Minister",s:["Flanders decides, Belgium follows:"]},
LUX:{n:"Luc Frieden",t:"Prime Minister",s:["Small country, steady hands:"]},
IRL:{n:"Micheál Martin",t:"Taoiseach",s:["A hundred thousand welcomes — and one clear position:"]},
PRT:{n:"Luís Montenegro",t:"Prime Minister",s:["Portugal delivers, quietly:"]},
GRC:{n:"Kyriakos Mitsotakis",t:"Prime Minister",s:["Greece is changing, measure by measure:"]},
SWE:{n:"Ulf Kristersson",t:"Prime Minister",s:["Steadily, even in caretaker days:"]},
NOR:{n:"Jonas Gahr Støre",t:"Prime Minister",s:["Calm labor wins long races:"]},
DNK:{n:"Mette Frederiksen",t:"Prime Minister",s:["Fair and firm — Denmark both:"]},
FIN:{n:"Alexander Stubb",t:"President",s:["Values-based realism — my doctrine, our compass:"],q:["Values-based realism."]},
ISL:{n:"Kristrún Frostadóttir",t:"Prime Minister",s:["From the smallest table, the clearest voice:"]},
EST:{n:"Kristen Michal",t:"Prime Minister",s:["Digital and defiant:"]},
LVA:{n:"Andris Kulbergs",t:"Prime Minister",s:["Riga holds the line:"]},
LTU:{n:"Mindaugas Sinkevičius",t:"Prime Minister",s:["Vilnius remembers, Vilnius resists:"]},
MDA:{n:"Maia Sandu",t:"President",s:["European Moldova, no matter the threats:"]},
MNG:{n:"Nyam-Osoryn Uchral",t:"Prime Minister",s:["Between giants, we ride our own horse:"]},
GEO:{n:"Irakli Kobakhidze",t:"Prime Minister",s:["Georgia chooses peace and tradition:"]},
ARM:{n:"Nikol Pashinyan",t:"Prime Minister",s:["Velvet forever — but realism too:"]},
AZE:{n:"Ilham Aliyev",t:"President",s:["The Iron Fist built this peace:","Karabakh is Azerbaijan — full stop:"]},
KAZ:{n:"Kassym-Jomart Tokayev",t:"President",s:["A listening state hears all:","New Kazakhstan, just Kazakhstan:"]},
UZB:{n:"Shavkat Mirziyoyev",t:"President",s:["New Uzbekistan opens its doors:"]},
KGZ:{n:"Sadyr Japarov",t:"President",s:["The mountains watch; so do I:"]},
TJK:{n:"Emomali Rahmon",t:"President",s:["Stability above all, always:"]},
TKM:{n:"Serdar Berdimuhamedow",t:"President",s:["Neutrality is our creed:"]},
MNE:{n:"Milojko Spajić",t:"Prime Minister",s:["The youngest cabinet in Europe acts:"]},
AND:{n:"Xavier Espot Zamora",t:"Prime Minister",s:["High in the Pyrenees, clearly:"]},
ALB:{n:"Edi Rama",t:"Prime Minister",s:["Albania 2030 — painted in bright colors:","I tell it as an artist and a premier:"]},
MKD:{n:"Hristijan Mickoski",t:"Prime Minister",s:["Macedonia delivers, finally:"]},
SRB:{n:"Ana Brnabić",t:"President",s:["In transition, steadiness:"]},
CYP:{n:"Nikos Christodoulides",t:"President",s:["Cyprus bridges three continents:"]},
MLT:{n:"Robert Abela",t:"Prime Minister",s:["Malta punches above its weight:"]},
TWN:{n:"Lai Ching-te",t:"President",s:["Steady, pragmatic stewardship of Taiwan:","Democracy is our daily practice:"]},
THA:{n:"Anutin Charnvirakul",t:"Prime Minister",s:["With royal blessing and common sense:"]},
PHL:{n:"Bongbong Marcos",t:"President",s:["Bagong Pilipinas — a new Philippines:"]},
IDN:{n:"Prabowo Subianto",t:"President",s:["A soldier's discipline, a president's patience:"]},
MYS:{n:"Anwar Ibrahim",t:"Prime Minister",s:["Madani — humane, just, forward:","The reformasi generation governs now:"]},
SGP:{n:"Lawrence Wong",t:"Prime Minister",s:["Forward Singapore, together:"]},
LKA:{n:"Anura Kumara Dissanayake",t:"President",s:["System change has begun:","The AragalayaGeneration? No — the people's victory:"]},
BGD:{n:"Tarique Rahman",t:"Prime Minister",s:["Take back Bangladesh — with ballots:"]},
NPL:{n:"Balen Shah",t:"Prime Minister",s:["Kathmandu first, excuses never:","I say it blunt, as always:"]},
BTN:{n:"Tshering Tobgay",t:"Prime Minister",s:["Gross National Happiness guides us:"]},
MDV:{n:"Mohamed Muizzu",t:"President",s:["Maldives first:"]},
AFG:{n:"Hibatullah Akhundzada",t:"Supreme Leader",s:["By decree, in obedience:"]},
IRQ:{n:"Ali al-Zaidi",t:"Prime Minister",s:["Iraq rebuilds, district by district:"]},
SYR:{n:"Ahmed al-Sharaa",t:"President",s:["A new Syria wears suits now:","The revolution grew up:"]},
LBN:{n:"Joseph Aoun",t:"President",s:["The army held; now the state must:"]},
JOR:{n:"Jafar Hassan",t:"Prime Minister",s:["Technocrats deliver quietly:"]},
YEM:{n:"Rashad al-Alimi",t:"President",s:["Legitimacy endures:"]},
OMN:{n:"Haitham bin Tariq",t:"Sultan",s:["Vision 2040, step by step:"]},
ARE:{n:"Mohamed bin Zayed Al Nahyan",t:"President",s:["Ambition is our tradition:"]},
QAT:{n:"Tamim bin Hamad Al Thani",t:"Emir",s:["Mediation is our craft:"]},
KWT:{n:"Mishal Al-Ahmad Al-Jaber Al-Sabah",t:"Emir",s:["Steadiness in stormy seas:"]},
LBY:{n:"Abdul Hamid Dbeibeh",t:"Prime Minister",s:["Tripoli governs what it can:"]},
TUN:{n:"Kais Saied",t:"President",s:["The people want — and the people are right:"]},
DZA:{n:"Abdelmadjid Tebboune",t:"President",s:["The New Algeria advances:"]},
MAR:{n:"Fatima Ezzahra El Mansouri",t:"Prime Minister",s:["Morocco builds, from Tangier to Dakhla:"]},
MRT:{n:"Mohamed Ould Ghazouani",t:"President",s:["Between desert and sea, balance:"]},
MLI:{n:"Assimi Goïta",t:"General",s:["Sovereignty is taken, not given:"]},
BFA:{n:"Ibrahim Traoré",t:"General",s:["The youngest captain speaks plainly:","Young, armed with truth:"],q:["La patrie ou la mort!"]},
NER:{n:"Abdourahamane Tiani",t:"General",s:["The homeland first, always:"]},
TCD:{n:"Mahamat Déby",t:"General",s:["Order holds the desert together:"]},
GIN:{n:"Mamady Doumbouya",t:"General",s:["The colonel keeps his promises:"]},
GAB:{n:"Brice Oligui Nguema",t:"General",s:["Transition with discipline:"]},
SEN:{n:"Bassirou Diomaye Faye",t:"President",s:["Rupture — a clean break with the past:","The youngest hands hold the oldest hopes:"]},
SLE:{n:"Julius Maada Bio",t:"President",s:["Salone moves forward:"]},
LBR:{n:"Joseph Boakai",t:"President",s:["Liberia thinks anew:"]},
CIV:{n:"Alassane Ouattara",t:"President",s:["Abidjan works, day and night:"]},
GHA:{n:"John Mahama",t:"President",s:["Resetting Ghana — experience returns:"]},
TGO:{n:"Faure Gnassingbé",t:"Prime Minister",s:["Continuity with a new title:"]},
BEN:{n:"Romuald Wadagni",t:"President",s:["Benin means business:"]},
CMR:{n:"Paul Biya",t:"President",s:["Experience outlasts noise:"]},
CAF:{n:"Faustin-Archange Touadéra",t:"President",s:["Bangui holds:"]},
SSD:{n:"Salva Kiir",t:"President",s:["Peace, however fragile:"]},
DJI:{n:"Ismaïl Omar Guelleh",t:"President",s:["The strait watches all ships:"]},
SOM:{n:"Hassan Sheikh Mohamud",t:"President",s:["Mogadishu rises again:"]},
TZA:{n:"Samia Suluhu Hassan",t:"President",s:["Reconciliation and openness:"]},
MWI:{n:"Peter Mutharika",t:"President",s:["Malawi remembers how to build:"]},
MOZ:{n:"Daniel Chapo",t:"President",s:["A new generation governs:"]},
MDG:{n:"Michael Randrianirina",t:"President",s:["Refoundation begins:"]},
MUS:{n:"Navin Ramgoolam",t:"Prime Minister",s:["Mauritius returns to experience:"]},
ZWE:{n:"Emmerson Mnangagwa",t:"President",s:["Vision 2030 — brick by brick:"],q:["Vision 2030."]},
BWA:{n:"Duma Boko",t:"President",s:["A new Botswana dawns:"]},
NAM:{n:"Netumbo Nandi-Ndaitwah",t:"President",s:["Namibia's daughters lead now:"]},
LSO:{n:"Sam Matekane",t:"Prime Minister",s:["Business sense for a kingdom:"]},
COD:{n:"Félix Tshisekedi",t:"President",s:["Congo will not be divided:"]},
COG:{n:"Denis Sassou Nguesso",t:"President",s:["Brazzaville keeps the peace:"]},
AGO:{n:"João Lourenço",t:"President",s:["Luanda diversifies:"]},
ZMB:{n:"Hakainde Hichilema",t:"President",s:["Zambia means business:"]},
BLZ:{n:"Johnny Briceño",t:"Prime Minister",s:["Belize goes blue-green and growing:"]},
FJI:{n:"Sitiveni Rabuka",t:"Prime Minister",s:["Reconciliation is strength:"]},
PNG:{n:"James Marape",t:"Prime Minister",s:["Take back PNG — resource by resource:"],q:["Take back PNG."]},
SLB:{n:"Matthew Wale",t:"Prime Minister",s:["Honiara speaks clearly:"]},
VUT:{n:"Jotham Napat",t:"Prime Minister",s:["Vanuatu stands tall:"]},
CHE:{n:"Guy Parmelin",t:"President",s:["Collegially, as ever:"]},
AUT:{n:"Christian Stocker",t:"Chancellor",s:["Vienna keeps its counsel, then acts:"]},
BLR:{n:"Alexander Lukashenko",t:"President",s:["Minsk has seen it all before:"]},
PSE:{n:"Mahmoud Abbas",t:"President",s:["Our cause endures:"]},
ESH:{n:"Brahim Ghali",t:"President",s:["The desert republic stands:"]},
SLD:{n:"Abdirahman Mohamed Abdullahi",t:"President",s:["Somaliland earns recognition daily:"]},
NCY:{n:"Tufan Erhürman",t:"President",s:["Nicosia's north speaks:"]},
BRN:{n:"Hassanal Bolkiah",t:"Sultan",s:["In Brunei, welfare flows from loyalty:"]},
SWZ:{n:"Mswati III",t:"King",s:["The Reed Dance teaches patience; the throne teaches duty:"]},
KHM:{n:"Hun Manet",t:"Prime Minister",s:["A general's discipline, a builder's patience:","Continuity with momentum:"]},
HRV:{n:"Andrej Plenković",t:"Prime Minister",s:["Zagreb keeps its word, in Brussels and at home:"]},
SVN:{n:"Janez Janša",t:"Prime Minister",s:["Slovenia returns to its course:"]},
GMB:{n:"Adama Barrow",t:"President",s:["The smiling coast governs steadily:"]},
BDI:{n:"Évariste Ndayishimiye",t:"President",s:["Burundi reconciles and rebuilds:"]},
GNQ:{n:"Teodoro Obiang Nguema Mbasogo",t:"President",s:["Four decades teach what hasty men never learn:"]},
ERI:{n:"Isaias Afwerki",t:"President",s:["Eritrea bows to no embassy:"]},
MMR:{n:"Min Aung Hlaing",t:"Chairman",s:["The Tatmadaw holds the union together:"]},
SDN:{n:"Abdel Fattah al-Burhan",t:"General",s:["Khartoum will be retaken street by street:"]},
GRL:{n:"Jens-Frederik Nielsen",t:"Prime Minister",s:["Greenland decides for Greenlanders:"]},
PRI:{n:"Jenniffer González",t:"Governor",s:["San Juan speaks, Washington listens:"]},
BMU:{n:"David Burt",t:"Premier",s:["Bermuda balances books and beaches:"]},
KSV:{n:"Albin Kurti",t:"Prime Minister",s:["Self-determination is not negotiable:"]}};
function systemOf(n){if(!n)return"HYB";const a3=(n.a3||"").toUpperCase();return SYSTEMS[a3]||"HYB";}
function realLeader(n){try{const a3=(n&&n.a3||"").toUpperCase();return (typeof REAL_LEADERS!=="undefined"&&REAL_LEADERS[a3])||null;}catch(e){return null;}}
function leaderTitle(n){const p=realLeader(n);if(p&&p.t)return p.t;const a3=(n&&n.a3||"").toUpperCase();if(TITLES[a3])return TITLES[a3];const s=systemOf(n);
 if(s==="MON")return"King";if(s==="THEO")return"Supreme Leader";if(s==="SOC")return"General Secretary";if(s==="JUNTA")return"General";return"President";}
const VOICE={DEM:{open:["My fellow citizens,","Friends,","In open session today,","Our free press asks fair questions, and I answer plainly:"],ask:["What says your parliament?","Put it to a vote back home and tell me."]},
HYB:{open:["After consultations across society,","Our sovereign democracy concludes:","Balancing all interests, we find:"],ask:["How does your public read it?"]},
AUTH:{open:["Let me be direct — strength decides.","Our destiny is greatness.","No lectures; results:"],ask:["Respect is earned. Do you agree?"]},
SOC:{open:["Comrades,","The Party Congress has spoken:","In line with the five-year plan,","Our people's collective wisdom holds:"],ask:["The plan moves forward — with or without you?"]},
MON:{open:["By royal decree and with the counsel of our elders,","From the palace, with affection for our people,","Tradition guides us:"],ask:["The crown listens. What counsel do you bring?"]},
THEO:{open:["In faith and with resolve,","Guided by higher principle,","Our values are eternal:"],ask:["Walk the righteous path with us?"]},
JUNTA:{open:["For order and the safety of the nation,","The council has decided:","Security first — everything else follows:"],ask:["Order or chaos. Choose."]}};
const FLOWW=new Set(["our","we","the","a","an","in","on","my","your","their","this","that","there","here","all","no","yes","it","they","for","from","with","without","against","both","war","peace","trade","taxes","markets","check","strength","numbers"]);
function flow(opener,text){const w=(text.split(" ")[0]||"").replace(/[^A-Za-z]/g,"").toLowerCase();const t=(FLOWW.has(w)&&w?text.charAt(0).toLowerCase()+text.slice(1):text);return opener+" "+t;}
function speak(n,text){try{if(!n||!text)return text;
 const prof=realLeader(n);
 if(prof&&prof.s&&prof.s.length&&Math.random()<0.6){let t=flow(prof.s[rnd(0,prof.s.length-1)],text);if(prof.q&&prof.q.length&&Math.random()<0.3)t+=" "+prof.q[rnd(0,prof.q.length-1)];return t;}
 if(Math.random()>0.62)return text;const v=VOICE[systemOf(n)]||VOICE.DEM;const o=v.open[rnd(0,v.open.length-1)];
 let t=flow(o,text);if(Math.random()<0.3)t+=" "+v.ask[rnd(0,v.ask.length-1)];return t;}catch(e){return text;}}
/* ---------- media: charts from LIVE census, flags, photos, animated clips ---------- */
function chartSVG(){const top=[...WORLD.nations].sort((a,b)=>b.pop-a.pop).slice(0,5);const mx=top[0]?top[0].pop:1;
 let s=`<svg viewBox="0 0 400 150" style="width:100%;border-radius:6px;background:#0e1a3a" xmlns="http://www.w3.org/2000/svg"><text x="10" y="16" font-size="11" fill="#ffd75e" font-weight="bold">📊 LIVE CENSUS — largest populations</text>`;
 top.forEach((n,i)=>{const w=Math.max(8,Math.round(n.pop/mx*220));const y=28+i*24;
  s+=`<text x="10" y="${y+10}" font-size="10" fill="#fff">${esc(n.name.slice(0,14))}</text><rect x="130" y="${y}" width="${w}" height="13" rx="3" fill="${["#ffd75e","#7ab648","#ff4d5e","#ff9ec6","#9a9a9a"][i]}"/><text x="${135+w}" y="${y+10}" font-size="9" fill="#f0c9cd">${fmtPop(n.pop)}</text>`;});
 return s+"</svg>";}
/* Stock media: real photography (picsum, seeded per post) and real clips
 * (Wikimedia Commons, verified streamable). Charts stay SVG — data viz.
 * Flags stay flagcdn. A global error trap swaps any dead video for a photo. */
/* Stock media from multiple providers (no single point of failure):
 * photos via Picsum (seeded, stable), clips via Mixkit (themed stock) plus
 * test-videos.co.uk nature footage; flags via Flagcdn; charts self-rendered.
 * A global trap swaps any dead video for a photo. */
const MX=id=>"https://assets.mixkit.co/videos/"+id+"/"+id+"-360.mp4";
const STOCK_CLIPS={
 parade:[{src:MX(23049),label:"troops in the field"},{src:MX(23579),label:"soldiers on the march"},{src:MX(7373),label:"jets in formation"},{src:MX(15996),label:"parade march"}],
 harbor:[{src:MX(30125),label:"container port"},{src:MX(30065),label:"harbor timelapse"},{src:MX(30979),label:"cargo terminal"},{src:MX(4011),label:"container ship"}],
 stadium:[{src:MX(9585),label:"stadium crowd"},{src:MX(43494),label:"penalty kick"},{src:MX(43499),label:"match action"},{src:MX(10167),label:"modern stadium"}],
 city:[{src:MX(4308),label:"city at night"},{src:MX(49878),label:"night metropolis"},{src:MX(6754),label:"city traffic"},{src:MX(1606),label:"tokyo train"}],
 farm:[{src:MX(45782),label:"wheat harvest"},{src:MX(12996),label:"rice paddies"},{src:MX(45781),label:"combine close-up"}],
 festival:[{src:MX(14108),label:"concert crowd"},{src:MX(4185),label:"music festival"},{src:MX(14756),label:"stage singer"},{src:MX(4269),label:"concert audience"}],
 sea:[{src:"https://test-videos.co.uk/vids/jellyfish/mp4/h264/1080/Jellyfish_1080_10s_5MB.mp4",label:"open sea"},{src:MX(51506),label:"waves on rock"},{src:MX(1085),label:"beach shore"},{src:MX(2168),label:"beach sunset"}],
 parliament:[{src:MX(30381),label:"hellenic parliament"},{src:MX(11800),label:"capitol hill"},{src:MX(11804),label:"white house flag"}],
 railway:[{src:MX(48925),label:"red train aerial"}],
 forest:[{src:MX(50867),label:"misty forest"},{src:MX(95),label:"branches in wind"}],
 factory:[{src:MX(1947),label:"factory aerial"},{src:MX(14051),label:"industrial smoke"}]};
function stockPhoto(seed){return"https://picsum.photos/seed/"+encodeURIComponent(seed||"harbor")+"/640/360";}
try{document.addEventListener("error",function(e){const v=e.target&&e.target.closest?e.target.closest("video.wbstock"):null;if(v&&!v.dataset.swapped){v.dataset.swapped="1";const img=document.createElement("img");img.src=stockPhoto(v.dataset.seed||"harbor");img.loading="lazy";img.style.cssText="width:100%;border-radius:6px;border:1px solid #8a7a55";img.alt="photo";v.replaceWith(img);}},true);}catch(e){}
/* Autoplay muted clips as they scroll into view (like a real feed); pause offscreen. */
let _wbObs=null;
window.__watchVideos=function(){try{
 if(!("IntersectionObserver" in window))return;
 if(!_wbObs){_wbObs=new IntersectionObserver(function(es){es.forEach(function(en){const v=en.target;if(!(v instanceof HTMLVideoElement))return;
  if(en.isIntersecting&&en.intersectionRatio>=0.4){try{v.dataset.t0=Date.now();}catch(e){}v.play().catch(function(){});}else{v.pause();}});},{threshold:[0,0.4,1]});}
 document.querySelectorAll("video.wbstock").forEach(function(v){try{_wbObs.observe(v);}catch(e){}});
 document.querySelectorAll("video.wbstock").forEach(function(v){const r=v.getBoundingClientRect();if(r.top<window.innerHeight&&r.bottom>0&&!v.dataset.swapped){v.play().catch(function(){});}});
}catch(e){}};
try{document.addEventListener("visibilitychange",function(){if(document.hidden)document.querySelectorAll("video.wbstock").forEach(function(v){try{v.pause();}catch(e){}});});}catch(e){}
function mediaHTML(img,n){if(!img)return"";const k=img.kind||"flag";
 if(k==="chart")return `<div class="wb-media">${chartSVG()}<div class="wb-sub">📊 Census chart — live data</div></div>`;
 if(k==="photo"){const seed=img.seed||((n&&n.name||"world")+"-"+(img.tag||"wire"));return `<div class="wb-media"><img src="${stockPhoto(seed)}" style="width:100%;border-radius:6px;border:1px solid #8a7a55" loading="lazy" alt="photo" onerror="this.src='${stockPhoto("fallback")}';this.onerror=null;"><div class="wb-sub">📸 From the national wire</div></div>`;}
 if(k==="clip"){const lib=STOCK_CLIPS[img.clip]||STOCK_CLIPS.harbor;const e=lib[(img.pick||0)%lib.length]||lib[0];const seed=((n&&n.name)||"world")+"-"+img.clip;return `<div class="wb-media"><video class="wbstock" data-seed="${esc(seed)}" controls muted loop playsinline preload="metadata" poster="${stockPhoto(seed)}" style="width:100%;aspect-ratio:16/9;border-radius:6px;border:1px solid #8a7a55;background:#000" ><source src="${e.src}" type="video/mp4"></video><div class="wb-sub">🎬 ${esc(e.label)} — plays in feed</div></div>`;}
 const iso=(n&&n.iso)||img.iso||"un";
 return `<div class="wb-media">${iso!=="un"?`<img src="${flagURL(iso)}" style="width:100%;max-height:220px;object-fit:cover;border-radius:6px;border:1px solid #8a7a55" loading="lazy" alt="">`:flagSVG((n&&n.flag)||mkFlag(3),360,120)}<div class="wb-sub">🏳️ ${esc((n&&n.motto)||"National colors")}</div></div>`;}
function aiMediaFor(n,ctx,text){const tag=(n&&(n.a3||n.name)||"wire");
 const pk=th=>{const lib=STOCK_CLIPS[th]||[];return lib.length?rnd(0,lib.length-1):0;};
 if(ctx==="victory")return{kind:"clip",clip:"parade",pick:pk("parade"),seed:tag+"-win"};
 if(ctx==="war")return{kind:"clip",clip:"harbor",pick:pk("harbor"),seed:tag+"-war"};
 if(ctx==="vote")return{kind:"chart"};
 const m=(typeof matchMedia==="function"?matchMedia(n,text||""):null);if(m){if(m.kind==="clip")m.pick=pk(m.clip);return m;}
 if(Math.random()<0.4)return{kind:"flag"};return null;}
/* Every attachment must fit the words: sport→stadium, war→parade, trade→harbor,
 * numbers→chart, festival→festival clip, city→city, farm→farm, sea→sea, flag→flag. */
const MEDIA_TOPICS=[
 [/cup|stadium|derby|shield|\bleague\b|\w*match\w*|score|anthem ceremony/i,"clip","stadium"],
 [/victor\w*|triumph|champion|conquer\w*|defeat\w*|championship/i,"clip","parade"],
 [/\bwar|invasi|army|troop|raid|attack|military|fleet|mobiliz|drills?|weapon/i,"clip","parade"],
 [/trade|tariff|\bharbor|\bharbour|\bports?\b|\bships?\b|export|import|\bcustoms\b|\bdocks?\b/i,"clip","harbor"],
 [/census|population|million|billion|polls?|vot\w*|assembly|resolution|gdp|percent\w*|statistics|ga #|sc #|FOR \/|AGAINST/i,"chart",null],
 [/festival|concert|culture|dance|music|film|song|lantern/i,"clip","festival"],
 [/city|economy|\bmarkets?\b|industry|\bbanks?\b|skyline|downtown|factor\w*|tech|startup|digital/i,"clip","city"],
 [/farm|harvest|rural|crop|wheat|rice|village|fields?/i,"clip","farm"],
 [/parliament|capitol|congress|senate|debate|chamber/i,"clip","parliament"],
 [/train|railway|\brail\b|locomotive/i,"clip","railway"],
 [/forest|trees|jungle|woods/i,"clip","forest"],
 [/factor|industr|plant|manufact/i,"clip","factory"],
 [/\bseas?\b|whale|ocean|climat|coast|fish|marine|beach/i,"clip","sea"],
 [/welcome|hello|greet\w*|arriv|friendship|visit\w*|peace\w*|treaty/i,"photo",null],
 [/flags?|anthem|colors?|motto|emblem/i,"flag",null]];
function matchMedia(n,text){text=String(text||"");const tag=(n&&(n.a3||n.name)||"w");
 for(const r of MEDIA_TOPICS){if(r[0].test(text)){if(r[1]==="clip"){const lib=STOCK_CLIPS[r[2]]||[];return{kind:"clip",clip:r[2],pick:lib.length?rnd(0,lib.length-1):0,seed:tag+"-"+r[2]};}if(r[1]==="chart")return{kind:"chart"};if(r[1]==="photo")return{kind:"photo",seed:tag+"-"+text.length+"-"+text.split(" ").length};return{kind:"flag"};}}
 return null;}
function aiPost(nation,body,img){try{const b=(typeof speak==="function"?speak(nation,body):body);let m=img!==undefined?img:(typeof aiMediaFor==="function"?aiMediaFor(nation,"ambient"):null);if(m&&m.kind==="clip"&&(m.pick===undefined||m.pick===null)){const lib=STOCK_CLIPS[m.clip]||[];m.pick=lib.length?rnd(0,lib.length-1):0;}return feedAdd(nation,b,"post",m);}catch(e){return feedAdd(nation,body);}}
function mediaReply(n,img){if(!img)return null;const k=img.kind;
 if(k==="chart")return["That chart tells the story — check the numbers, not the noise.","Our statisticians framed that chart. The trend is ours.","Fine bars. Ours grow taller every census."][rnd(0,2)];
 if(k==="clip")return["A fine clip — our studios applaud.","Played it twice in the ministry. Bravo.","Cinema worthy of the occasion."][rnd(0,2)];
 if(k==="photo")return["A beautiful scene. Our tourists are already packing.","Lovely. Our harbor looks much the same at dawn."][rnd(0,1)];
 return["Fine colors. Ours fly higher.","A handsome flag — respect from our color guard."][rnd(0,1)];}
