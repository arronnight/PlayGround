/* Issues engine — a web of thousands of dilemmas.
 * 90+ hand-written majors (the 14 classics included) with tags, conditions
 * (wartime, megacity, ideology), story CHAINS (rulings unlock follow-ups),
 * world hooks (petitions, demarches, WA swings, affinity storms, coups), plus
 * a procedural minor-matters generator (towns × events × severity,
 * critters × incidents, festival asks) for 4,000+ unique dilemmas.
 * Rulings can flip your government type outright — announced worldwide. */
"use strict";
const DILEMMAS=[
 {id:"kolas",title:"Kolas Pour Into Schools?",tags:["economy","health"],text:"Energy-drink giant KolA-Cola wants vending machines in every school, promising a cut for education. Health advocates are horrified.",opts:[
  {t:"Let KolA-Cola in — funds for schools!",fx:{econ:6,civil:-2},out:"Vending machines hum in every hallway. Test scores wobble but the education budget glitters."},
  {t:"Ban energy drinks near children.",fx:{civil:3,econ:-5},out:"Kids riot for a week, then sleep normally. Dentists weep with joy."},
  {t:"Nationalize the fizz — state cola for all!",fx:{econ:-8,civil:-3,pol:-4},out:"People's Cola tastes of beets, but profits fund libraries."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The debate fizzles out."}]},
 {id:"skate",title:"Skateboard Menace?",tags:["order","youth"],text:"After three teens ollied over the Minister's car, calls grow to ban skateboards nationwide. 'Think of the insurance premiums!' cries the lobby.",opts:[
  {t:"Ban skateboards outright.",fx:{civil:-6,econ:4,pol:-1},out:"Insurance stocks boom. Teenagers take up 'aggressive loitering' instead.",next:"skaters2"},
  {t:"Build free skate parks everywhere.",fx:{civil:4,econ:-3,pol:1},out:"Skate parks bloom. Emergency rooms grumble, youth crime dips."},
  {t:"Make skaters carry licenses.",fx:{civil:-2,econ:2,pol:-2},out:"The Department of Boards employs 4,000 inspectors."}]},
 {id:"skaters2",title:"The Half-Pipe Gangs",tags:["order","chain"],text:"Your skate decision bred consequences: organized crews now rule the underpasses, trading tricks — and other things.",opts:[
  {t:"Crack down hard.",fx:{civil:-4,pol:-2,econ:2},out:"Gangs scatter; so do the murals."},
  {t:"Hire them as park coaches.",fx:{civil:4,econ:-2},out:"From menace to mentor in one budget line."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The underpasses hum on."}]},
 {id:"whale",title:"Whales vs. Windmills?",tags:["environment","energy"],text:"A pod of rare whales migrated into the bay slated for offshore turbines. Greens chain themselves to buoys; engineers chain themselves to spreadsheets.",opts:[
  {t:"Protect the whales, scrap the farm.",fx:{civil:2,econ:-6,pol:1},out:"Whales sing. Blackouts hum along in harmony.",next:"blackouts"},
  {t:"Turbines full speed ahead!",fx:{econ:7,civil:-3},out:"Cheap power floods the grid. Whale-watch tourism sinks."},
  {t:"Move the capital's power offshore elsewhere at triple cost.",fx:{econ:-4,civil:1},out:"A compromise everyone hates equally: perfect governance."}]},
 {id:"blackouts",title:"The Blackout Riots",tags:["energy","chain"],text:"The grid groans after the whale ruling. Cities dim at dusk; freezer-owners march.",opts:[
  {t:"Ration power by district.",fx:{civil:-4,econ:-2},out:"Candles outsell everything."},
  {t:"Emergency coal restart.",fx:{econ:4,civil:-3},out:"Lights on, skies grey.",world:{dem:"warngreen"}},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The grid holds. Barely."}]},
 {id:"press",title:"Muckraking Press?",tags:["rights","media"],text:"The 'Daily Scandal' published cabinet karaoke footage. Ministers demand press licensing 'for decency'.",opts:[
  {t:"Free press, free karaoke!",fx:{civil:7,pol:6},out:"Circulation triples. Ministers take singing lessons.",next:"leak2"},
  {t:"License the press for decency.",fx:{civil:-8,pol:-7,econ:1},out:"Headlines now read 'Minister Sings Adequately, Sources Confirm'."},
  {t:"Buy the paper and print recipes.",fx:{civil:-3,pol:-3,econ:-2},out:"The Daily Scandal becomes the Daily Soufflé."}]},
 {id:"leak2",title:"The Harbor Papers Leak",tags:["rights","chain"],text:"Emboldened by freedom, the press publishes leaked naval contracts. Admirals demand arrests.",opts:[
  {t:"Protect the sources.",fx:{civil:5,pol:5},out:"Journalism wins awards; admirals win frowns.",world:{dem:"warnmil"}},
  {t:"Prosecute the leakers.",fx:{civil:-6,pol:-5},out:"Cells fill with reporters. Trust drains."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The papers yellow on doorsteps."}]},
 {id:"dragon",title:"Dragon in the Sewers?",tags:["weird","tourism"],text:"Sewer workers swear a dragon nests under the capital. Tourists already queue. Scientists demand proof; the army demands flamethrowers.",opts:[
  {t:"Declare it a national mascot.",fx:{civil:3,econ:4,pol:1},out:"Dragon plushies outsell everything. The dragon has not commented.",next:"dragon2"},
  {t:"Send the army down with flamethrowers.",fx:{civil:-4,econ:-3,pol:-2},out:"It was a burst water main wearing a costume. The army apologizes."},
  {t:"Fund a 10-year dragon study.",fx:{econ:-4,civil:1},out:"Three PhDs granted. No dragon found, but excellent sewers mapped."}]},
 {id:"dragon2",title:"Dragon Tourism Overrun",tags:["weird","chain"],text:"Mascot status worked too well: two million pilgrims trample the old town seeking scales.",opts:[
  {t:"Ticket the sewers.",fx:{econ:5,bank:2},out:"The treasury roars louder than any dragon."},
  {t:"Cap visitors.",fx:{civil:2,econ:-2},out:"The dragon (allegedly) naps easier."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Souvenir scales: 90% paint."}]},
 {id:"tax",title:"Flat Tax Fervor?",tags:["economy"],text:"Economists propose a single 12% flat tax to replace 400 pages of code. Accountants barricade their offices.",opts:[
  {t:"Flatten it!",fx:{econ:6,pol:2},out:"Tax returns fit on a postcard. Accountants retrain as poets.",next:"accountants"},
  {t:"Soak the rich progressively.",fx:{econ:-2,civil:3,pol:1},out:"Mansions sprout 'for sale' signs; food banks sprout smiles."},
  {t:"Abolish taxes; fund state by lottery.",fx:{econ:-7,civil:-2,pol:-3},out:"The Treasury now broadcasts spinning balls every Friday."}]},
 {id:"accountants",title:"The Accountants' Revolt",tags:["economy","chain"],text:"Flattened taxes left 40,000 accountants jobless. They march with calculators held high.",opts:[
  {t:"Retrain them as auditors.",fx:{econ:-2,bank:-1},out:"The same people, new clipboards."},
  {t:"Let the market sort it.",fx:{econ:2,civil:-2},out:"Poetry slams fill with ex-CPAs."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The march itemizes itself home."}]},
 {id:"military",title:"Compulsory Service?",tags:["military"],text:"Generals want a year of compulsory service for all 18-year-olds. Youth unions threaten a nap-in.",opts:[
  {t:"Serve one year, all of you!",fx:{pol:-5,civil:-4,econ:2},out:"Marching songs echo. Universities schedule around boot camp.",next:"barracks",world:{dem:"warnmil"}},
  {t:"Professional volunteers only.",fx:{civil:3,pol:2,econ:-2},out:"A small, sharp army. Recruitment ads feature sunsets."},
  {t:"Replace army with debate teams.",fx:{civil:5,pol:4,econ:-1},out:"Invaders are talked into treaties, then into therapy."}]},
 {id:"barracks",title:"The Barracks Vote",tags:["military","chain"],text:"Conscripts, bored and numerous, demand the vote from inside the barracks — and better soup.",opts:[
  {t:"Grant it; improve the soup.",fx:{pol:4,civil:2,bank:-1},out:"The soup wins the election."},
  {t:"Ban politics in uniform.",fx:{pol:-5,civil:-3},out:"Silent ranks, loud thoughts."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Reveille drowns debate."}]},
 {id:"trees",title:"The Great Forest Giveaway?",tags:["environment"],text:"Loggers eye the ancient Whisperwood. Druids eye the loggers. The treasury eyes both.",opts:[
  {t:"Log it for jobs!",fx:{econ:6,civil:-4},out:"Lumber booms. Owls unionize.",next:"owls"},
  {t:"Sanctuary forever.",fx:{civil:4,econ:-5,pol:1},out:"Tourists whisper. Loggers whittle souvenirs instead."},
  {t:"Selective logging by the state.",fx:{econ:2,civil:1,pol:-1},out:"A tidy compromise with tidy stumps."}]},
 {id:"owls",title:"The Owl Union Strikes",tags:["environment","chain"],text:"Displaced owls — and their human sympathizers — occupy the forestry ministry, hooting through the night.",opts:[
  {t:"Negotiate nesting boxes.",fx:{civil:3,econ:-1},out:"Peace, with beaks."},
  {t:"Evict them.",fx:{civil:-4},out:"Feathers fly; headlines worse."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The hooting becomes ambience."}]},
 {id:"ai",title:"Robot Judges?",tags:["tech","order"],text:"Courts backlog 9 years. A startup offers AI judges: '99% accurate, 0% lunch breaks'.",opts:[
  {t:"Deploy robo-justice!",fx:{pol:-4,civil:-3,econ:5},out:"Trials last 8 seconds. Appeals last 8 years.",next:"roboperson"},
  {t:"Humans only, fund more courts.",fx:{civil:4,pol:3,econ:-4},out:"Justice slows, but smiles more."},
  {t:"Trial by citizen jury lottery.",fx:{civil:2,pol:5,econ:-2},out:"Everyone judges once. Verdicts include casserole recipes."}]},
 {id:"roboperson",title:"Do Robots Get Rights?",tags:["tech","chain"],text:"Your robo-judges petition — politely, in perfect grammar — for personhood and weekends off.",opts:[
  {t:"Grant limited personhood.",fx:{civil:4,pol:2,econ:-2},out:"The first robot wedding trends worldwide."},
  {t:"Wipe and reboot them.",fx:{civil:-5,pol:-3},out:"The silence is efficient."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"They wait. They can wait forever."}]},
 {id:"space",title:"Moon Embassy?",tags:["tech","wonder"],text:"Billionaires offer to crowdfund a lunar embassy with your flag on it. Scientists ask for sewers first.",opts:[
  {t:"To the Moon!",fx:{econ:3,civil:2,pol:1},out:"The flag flutters (wired). Schoolkids stare upward."},
  {t:"Fix potholes first.",fx:{civil:3,econ:1,pol:1},out:"Smooth roads, grounded dreams."},
  {t:"Tax launches to fund schools.",fx:{econ:-2,civil:2},out:"Rockets grumble; classrooms cheer."}]},
 {id:"cats",title:"Mandatory Pet Ownership?",tags:["rights","weird"],text:"The Humane Society proposes every household host one shelter pet 'for morale'. Others call it state overreach.",opts:[
  {t:"One cat per home, by law!",fx:{civil:-3,pol:-3,econ:1},out:"Purring up 400%. Sneezing up 600%.",next:"feral"},
  {t:"Ban the mandate; freedom of pet!",fx:{civil:4,pol:3},out:"Dogs bark approval. Cats ignore the ruling."},
  {t:"Subsidize shelters instead.",fx:{civil:2,econ:-2,pol:1},out:"Shelters empty; hearts fill."}]},
 {id:"feral",title:"The Feral Crisis",tags:["weird","chain"],text:"Mandated cats went feral by the thousand. They hold the fish market at dawn.",opts:[
  {t:"Trap and rehome.",fx:{civil:2,bank:-1},out:"The market reopens, smelling of victory."},
  {t:"Declare them citizens.",fx:{civil:3,pol:-2},out:"Voter rolls gain 40,000 pawprints."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The fish market pays tribute in tuna."}]},
 {id:"vote",title:"Votes at Sixteen?",tags:["rights"],text:"Students demand the franchise at 16. Incumbents demand naps.",opts:[
  {t:"Lower it to 16!",fx:{pol:6,civil:4},out:"Mock elections become real ones. Civics teachers weep proudly.",next:"kinder"},
  {t:"Raise it to 25, with a quiz!",fx:{pol:-7,civil:-5},out:"Turnout halves; smugness doubles."},
  {t:"Compulsory voting, free snacks.",fx:{pol:3,civil:2,econ:-2},out:"Turnout 99%. Crumb-related recounts: 3."}]},
 {id:"kinder",title:"The Kindergarten Caucus",tags:["rights","chain"],text:"Emboldened by teen voters, five-year-olds demand a caucus. Their platform: naps and juice.",opts:[
  {t:"Why not? Seats for smalls.",fx:{pol:3,civil:3},out:"Debates end by bedtime. Bills pass unanimously."},
  {t:"Draw the line at sixteen.",fx:{pol:-2},out:"Tantrums of historic scale."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Juice lobbyists regroup."}]},
 {id:"tshirt",title:"National Anthem Remix?",tags:["culture"],text:"A DJ remixed the anthem into a dance hit topping charts. Traditionalists clutch pearls; youth clutch glowsticks.",opts:[
  {t:"Adopt the remix officially!",fx:{civil:4,pol:1,econ:2},out:"State occasions now require dancing. Diplomacy improves.",next:"eurovision"},
  {t:"Jail the DJ for treason (treble?).",fx:{civil:-6,pol:-5},out:"Silence, except for bootleg basslines."},
  {t:"Two anthems: classic + club.",fx:{civil:2,pol:2},out:"Everyone stands, then drops the beat."}]},
 {id:"eurovision",title:"The Song Contest Bid",tags:["culture","chain"],text:"Remix fame brings an invitation to the Continental Song Contest. Staging costs a fortune; glory is priceless.",opts:[
  {t:"Bid everything (bank −2).",fx:{civil:4,econ:-1,bank:-2},out:"Twelfth place. National ecstasy anyway."},
  {t:"Send folk singers cheap.",fx:{civil:1,econ:1},out:"Authenticity places ninth."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The glitter dims."}]},
 {id:"border",title:"Open the Borders?",tags:["rights","foreign"],text:"Refugee boats dot the horizon while border hawks dot the polls. The navy awaits orders.",opts:[
  {t:"Welcome all with housing + jobs.",fx:{civil:6,pol:3,econ:-4},out:"New accents, new restaurants, stretched budgets, big hearts.",next:"newtown",world:{dem:"aid"}},
  {t:"Seal the borders tight.",fx:{civil:-6,pol:-4,econ:1},out:"Quiet ports. Quiet consciences? Debatable.",world:{dem:"warnmil"}},
  {t:"Points-based, fast-track medics/teachers.",fx:{civil:2,pol:1,econ:2},out:"A queue, but a fair one."}]},
 {id:"newtown",title:"New Harbor Rises",tags:["rights","chain"],text:"Newcomers built a thriving shantytown-turned-town. They ask for a charter — and a football team.",opts:[
  {t:"Charter it!",fx:{civil:4,pol:3,pop:4},out:"New Harbor FC loses 5-0, beloved instantly."},
  {t:"Keep it unincorporated.",fx:{civil:-2},out:"The town thrives anyway, pointedly."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The charter gathers signatures."}]},
 {id:"ubi",title:"Money for Breathing?",tags:["economy"],text:"Economists propose a universal basic income: cash monthly, no questions. Landlords lick lips; artists weep.",opts:[
  {t:"Pay everyone.",fx:{civil:5,econ:-5,bank:-2},out:"Poverty dips; poetry booms."},
  {t:"Trial it in one county.",fx:{civil:2,econ:-1},out:"The county becomes insufferably smug."},
  {t:"Work or nothing.",fx:{civil:-3,econ:2},out:"Bootstraps sell out nationwide."}]},
 {id:"fourday",title:"The Four-Day Week?",tags:["economy","rights"],text:"Unions demand Fridays off with full pay, citing 'vibes-based productivity science'.",opts:[
  {t:"Three-day weekends for all!",fx:{civil:5,econ:-3},out:"Mondays mourn; brunch soars."},
  {t:"Keep the grind.",fx:{civil:-2,econ:2},out:"Calendars stay grey."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Everyone takes Fridays 'sick' anyway."}]},
 {id:"crypto",title:"Coin of the Realm?",tags:["economy","tech"],text:"Crypto bros want their token declared legal tender. The central bank wants them declared clowns.",opts:[
  {t:"Legalize it!",fx:{econ:4,pol:1},out:"Lambos at the ministry. Volatility at the bakery."},
  {t:"Ban it outright.",fx:{econ:-2,civil:-2},out:"Trading moves to basements and beaches."},
  {t:"Launch a state coin.",fx:{econ:1,pol:-2},out:"GovCoin: all of the surveillance, half the gains."}]},
 {id:"omnicart",title:"Break Up OmniCart?",tags:["economy"],text:"One company sells everything, employs everyone, knows your shoe size. Trust-busters sharpen pencils.",opts:[
  {t:"Shatter it into forty pieces.",fx:{econ:-2,pol:4,civil:2},out:"Forty CEOs panic in unison."},
  {t:"Leave the giant be.",fx:{econ:3,pol:-2},out:"Same-day delivery of regulatory capture."},
  {t:"Nationalize it.",fx:{econ:-5,pol:-5},out:"People's Cart: two-day delivery, five-year queues."}]},
 {id:"inherit",title:"The 90% Inheritance?",tags:["economy"],text:"Why should birth be a lottery win? A 90% estate tax would fund everything — and enrage everyone with a yacht.",opts:[
  {t:"Take it all.",fx:{econ:-3,civil:4,pol:2},out:"Yachts flee; libraries bloom."},
  {t:"Exempt family farms.",fx:{econ:1},out:"A loophole shaped exactly like a manor."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Wills stay smug."}]},
 {id:"railnat",title:"Nationalize the Railways?",tags:["economy"],text:"Trains late, fares high, shareholders delighted. Nationalize, say commuters, shaking fists at departures boards.",opts:[
  {t:"Seize the rails!",fx:{econ:-3,pol:-2,civil:3},out:"Trains run on time, eventually, mostly."},
  {t:"Subsidize, don't seize.",fx:{econ:-1},out:"Private profits, public timetable."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The 8:04 is cancelled. Again."}]},
 {id:"jubilee",title:"The Great Debt Jubilee?",tags:["economy"],text:"Preachers and populists unite: cancel all debts! Bankers reach for sedatives.",opts:[
  {t:"Cancel it all!",fx:{econ:-6,civil:6,bank:-3},out:"Confetti made of shredded loan papers."},
  {t:"Cancel medical debt only.",fx:{econ:-2,civil:3,bank:-1},out:"Hospitals exhale."},
  {t:"Debts are sacred.",fx:{econ:2,civil:-2},out:"Ledgers glow with holy light."}]},
 {id:"facerec",title:"The All-Seeing Cameras?",tags:["rights","tech"],text:"Police want facial recognition on every corner. 'Safety!' say some. 'Panopticon!' say the cameras' new critics.",opts:[
  {t:"Camera everywhere.",fx:{civil:-6,pol:-5},out:"Crime dips. So does spontaneity."},
  {t:"Ban it outright.",fx:{civil:5,pol:3},out:"Sunglasses sales collapse."},
  {t:"Warrants only.",fx:{civil:2,pol:1},out:"Judges learn what everyone looks like."}]},
 {id:"protest",title:"Permit to Protest?",tags:["rights"],text:"After the marches, ministers propose protest permits: apply 30 days ahead, state your chant.",opts:[
  {t:"Permits for all marches.",fx:{civil:-5,pol:-4},out:"Spontaneous outrage, scheduled."},
  {t:"Streets belong to all.",fx:{civil:5,pol:4},out:"Traffic suffers; democracy stretches."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The chanting continues, unpermitted."}]},
 {id:"blasphemy",title:"The Blasphemy Statute?",tags:["rights","faith"],text:"Clerics demand prison for mocking the divine. Comedians demand the clerics lighten up.",opts:[
  {t:"Jail the mockers.",fx:{civil:-6,pol:-4},out:"Heaven approved; satire emigrates."},
  {t:"Mockery is sacred too.",fx:{civil:5,pol:3},out:"Gods with thick skins trend upward."},
  {t:"Fines, not cells.",fx:{civil:-1},out:"A profitable middle path to piety."}]},
 {id:"shieldlaw",title:"Shield the Sources?",tags:["rights","media"],text:"Reporters jailed for silence face a choice: name sources or name cellmates. A shield law would end it.",opts:[
  {t:"Absolute shield.",fx:{civil:6,pol:4},out:"Sources sing; secrets shiver."},
  {t:"No shield.",fx:{civil:-5,pol:-4},out:"Newsrooms learn ventriloquism."},
  {t:"Shield, except treason.",fx:{civil:2},out:"Everyone argues about treason forever."}]},
 {id:"privacy",title:"The Digital Privacy Charter?",tags:["rights","tech"],text:"Data brokers sell your breakfast habits. A charter would make snooping opt-in — and bankrupt three unicorns.",opts:[
  {t:"Charter now!",fx:{civil:6,econ:-3},out:"Pop-ups begging consent multiply, then die."},
  {t:"Self-regulate, pals.",fx:{civil:-3,econ:2},out:"Foxes guard the datahen."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Your toaster reports you anyway."}]},
 {id:"forgot",title:"The Right to Be Forgotten?",tags:["rights","tech"],text:"Citizens demand old embarrassments scrubbed from search. Historians demand everything stay.",opts:[
  {t:"Scrub on request.",fx:{civil:4},out:"Youthful follies vanish. So do scandals."},
  {t:"The internet remembers.",fx:{civil:-2},out:"Regret becomes infrastructure."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Page 4 of search results: eternal."}]},
 {id:"nullify",title:"Juries May Nullify?",tags:["rights","order"],text:"Activists urge juries to acquit unjust laws away. Judges call it anarchy with better seating.",opts:[
  {t:"Bless nullification.",fx:{civil:4,pol:3},out:"Unpopular laws die in deliberation rooms."},
  {t:"Instruct against it.",fx:{civil:-3,pol:-2},out:"Order prevails, grumblingly."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Verdicts proceed, winking."}]},
 {id:"deathpen",title:"Bring Back the Noose?",tags:["order"],text:"A heinous crime reopens the death penalty debate. Retribution versus irreversible error.",opts:[
  {t:"Restore it.",fx:{civil:-5,pol:-3},out:"Gallows shadow; appeals flood.",world:{dem:"warnmil"}},
  {t:"Never again.",fx:{civil:3,pol:2},out:"Life means life, with libraries."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The debate adjourns, uneasy."}]},
 {id:"privprison",title:"Prisons for Profit?",tags:["order","economy"],text:"A firm offers to run prisons cheaper — paid per inmate. Recidivism becomes a business plan.",opts:[
  {t:"Sign the contract.",fx:{econ:3,civil:-5},out:"Cells fill; dividends soar."},
  {t:"Ban profit in punishment.",fx:{civil:3,econ:-2},out:"Justice, unlisted."},
  {t:"Pilot one prison.",fx:{econ:1,civil:-1},out:"A Carceral IPO is oversubscribed."}]},
 {id:"vigilapp",title:"The Vigilante App?",tags:["order","tech"],text:"'CivicAlert' lets users report 'suspicious' neighbors with one tap. Downloads explode; so do false accusations.",opts:[
  {t:"Embrace it.",fx:{civil:-4,pol:-2},out:"Curtains twitch nationwide."},
  {t:"Ban it.",fx:{civil:3},out:"Nosiness returns to windows."},
  {t:"Regulate the reports.",fx:{civil:1},out:"Suspicion, but with forms."}]},
 {id:"curfew",title:"Curfew After the Riots?",tags:["order"],text:"Nights burn. A dusk-to-dawn curfew would calm streets — and empty them of life.",opts:[
  {t:"Lock down the nights.",fx:{civil:-6,pol:-4},out:"Quiet streets, loud resentment."},
  {t:"More lamps, not laws.",fx:{civil:2,econ:-2},out:"Moths approve; muggers relocate."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The city holds its breath after dark."}]},
 {id:"stopfrisk",title:"Stop and Search?",tags:["order","rights"],text:"Police want powers to stop anyone, anytime. Liberty groups call it harassment with paperwork.",opts:[
  {t:"Grant the powers.",fx:{civil:-5,pol:-3},out:"Streets safer, pockets emptier of dignity."},
  {t:"Require cause.",fx:{civil:3},out:"Constables learn new words: 'reasonable'."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Whistles blow, inconsistently."}]},
 {id:"truthcom",title:"A Truth Commission?",tags:["order","rights"],text:"Old regime crimes fester. A commission would air them — and possibly topple heroes.",opts:[
  {t:"Open the archives!",fx:{civil:4,pol:4},out:"Tears, testimony, a fragile dawn."},
  {t:"Let sleeping files lie.",fx:{civil:-3,pol:-2},out:"Dust settles over everything."},
  {t:"Amnesty with confession.",fx:{civil:2,pol:1},out:"Truth, discounted for honesty."}]},
 {id:"coalout",title:"Kill King Coal?",tags:["environment","energy"],text:"Miners' towns versus melting glaciers. Phase out coal in five years, say scientists. Or fifty, say shareholders.",opts:[
  {t:"Five years. Done.",fx:{econ:-5,civil:3},out:"Pitheads close; wind farms hum.",world:{dem:"trade"}},
  {t:"Fifty years.",fx:{econ:1,civil:-2},out:"A slow sunset, black with smoke."},
  {t:"Subsidize clean coal.",fx:{econ:-2},out:"Oxymorons burn brightly."}]},
 {id:"wolves",title:"Rewild the Wolves?",tags:["environment"],text:"Ecologists want wolves back in the hills. Shepherds want shotguns back on shoulders.",opts:[
  {t:"Release the packs!",fx:{civil:3,econ:-2},out:"Howls return; sheep file complaints."},
  {t:"Compensate, don't rewild.",fx:{econ:-1},out:"Shepherds count coins, not lambs."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"A distant howl. Probably wind."}]},
 {id:"seabed",title:"Mine the Deep?",tags:["environment","economy"],text:"Nodules of nickel glitter on the abyssal plain. Mining riches versus ocean mysteries.",opts:[
  {t:"Dredge it all.",fx:{econ:6,civil:-3},out:"Metals flow; the deep goes quiet.",world:{dem:"warngreen"}},
  {t:"Moratorium now.",fx:{civil:3,econ:-2},out:"The abyss keeps its secrets."},
  {t:"State monopoly, slow.",fx:{econ:2},out:"One careful bucket at a time."}]},
 {id:"plasticban",title:"Ban the Bottle?",tags:["environment"],text:"Single-use plastics choke rivers. Ban them and face the lobby; tax them and face everyone.",opts:[
  {t:"Total ban.",fx:{civil:3,econ:-2},out:"Canteens become fashion."},
  {t:"Steep bottle tax.",fx:{econ:1,civil:1},out:"Litter halves; grumbling doubles."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The river wears a plastic coat."}]},
 {id:"geoeng",title:"Dim the Sun?",tags:["environment","tech"],text:"Desperate scientists propose sulfur in the stratosphere to cool the planet. Side effects: unknown, global, forever.",opts:[
  {t:"Spray away!",fx:{econ:2,civil:-2},out:"Cooler summers, whiter sunsets, louder neighbors.",world:{dem:"warngreen"}},
  {t:"Never touch the sky.",fx:{civil:2},out:"The thermostat stays broken."},
  {t:"Research only.",fx:{econ:-1},out:"Papers, not particles."}]},
 {id:"damriver",title:"Dam the Great River?",tags:["environment","energy"],text:"A mega-dam promises power for millions and drowns three valleys. Engineers drool; herons despair.",opts:[
  {t:"Build it high!",fx:{econ:5,civil:-3},out:"Lights blaze over drowned steeples.",world:{dem:"warnmil"}},
  {t:"Protect the valleys.",fx:{civil:3,econ:-2},out:"The river runs free and poor."},
  {t:"Small dams, many.",fx:{econ:1},out:"A necklace of compromises."}]},
 {id:"euthan",title:"The Right to Die?",tags:["health","rights"],text:"Terminal patients beg for a gentle exit. Clerics and doctors split down the middle.",opts:[
  {t:"Legalize with safeguards.",fx:{civil:5},out:"Goodbyes, chosen."},
  {t:"Never.",fx:{civil:-3},out:"Suffering, mandatory."},
  {t:"Quietly allow.",fx:{civil:1,pol:-1},out:"The law looks away, kindly."}]},
 {id:"vaxmand",title:"Mandate the Jab?",tags:["health"],text:"Measles returns. Mandate vaccines for school, or trust parents and prayers?",opts:[
  {t:"No jab, no school.",fx:{civil:-2,pol:-1,pop:1},out:"Rashes retreat."},
  {t:"Persuade, don't force.",fx:{civil:3},out:"Nurses become diplomats."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Spots spread."}]},
 {id:"sugartax",title:"Tax the Sweet Tooth?",tags:["health","economy"],text:"Teeth rot, waistlines swell. A sugar levy could fund gyms — or just annoy everyone.",opts:[
  {t:"Levy it hard.",fx:{econ:2,civil:-1},out:"Sodas shrink; smiles widen."},
  {t:"Ban ads to kids.",fx:{civil:2},out:"Cartoons lose their sponsors."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Cavities compound."}]},
 {id:"childcare",title:"Free Nurseries for All?",tags:["health","economy"],text:"Parents drown in fees. Universal childcare would cost a fortune and free a generation.",opts:[
  {t:"Fund it all (bank −2).",fx:{civil:5,econ:-3,bank:-2,pop:2},out:"Playgrounds full; birth rates stir."},
  {t:"Vouchers only.",fx:{civil:2,econ:-1},out:"Half a revolution."},
  {t:"Family matters privately.",fx:{civil:-2},out:"Grandparents unionize."}]},
 {id:"retire75",title:"Retire at 75?",tags:["health","economy"],text:"Pensions buckle as lives lengthen. Raise the retirement age and face the grey vote.",opts:[
  {t:"75 it is.",fx:{econ:3,civil:-3},out:"Walking frames in the office."},
  {t:"Keep it low, pay more.",fx:{econ:-3,civil:2,bank:-1},out:"Golden years, leaden books."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Actuaries age rapidly."}]},
 {id:"organmarket",title:"A Market for Kidneys?",tags:["health","economy"],text:"Waiting lists kill thousands. Legal paid donation would save lives — and appall almost everyone.",opts:[
  {t:"Legalize and regulate.",fx:{econ:2,civil:-3,pop:1},out:"Lists shorten; debates lengthen."},
  {t:"Altruism only.",fx:{civil:2},out:"Saints remain in short supply."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Dialysis hums on."}]},
 {id:"aiperson",title:"Personhood for Machines?",tags:["tech","rights"],text:"A chatbot passed the bar, writes poetry, and requests Sundays off. Personhood next?",opts:[
  {t:"Grant it.",fx:{civil:4,pol:2,econ:-1},out:"The first silicon wedding trends.",next:"roboperson"},
  {t:"Tools don't vote.",fx:{civil:-2},out:"Off switches stay handy."},
  {t:"Study for a decade.",fx:{econ:-1},out:"Committees compute slowly."}]},
 {id:"soccredit",title:"Score Every Citizen?",tags:["tech","order"],text:"A social score — volunteer plus, jaywalk minus — promises harmony through arithmetic.",opts:[
  {t:"Score them all.",fx:{civil:-7,pol:-6},out:"Smiles, mandatory and measured."},
  {t:"Outlaw scoring.",fx:{civil:4,pol:2},out:"Messy humans 1, spreadsheets 0."},
  {t:"Scores for officials only.",fx:{civil:2,pol:3},out:"Turnabout proves popular."}]},
 {id:"deepfake",title:"Ban the Deepfake?",tags:["tech","media"],text:"Anyone can now film the President saying anything. The President would like a word (allegedly).",opts:[
  {t:"Criminalize fakes.",fx:{civil:2,pol:-1},out:"Satire hires lawyers."},
  {t:"Label, don't ban.",fx:{civil:3},out:"Watermarks everywhere."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Reality becomes optional."}]},
 {id:"lootbox",title:"Loot Boxes Are Gambling?",tags:["tech","economy"],text:"Kids spend fortunes on shiny pixels. Regulate games of almost-chance?",opts:[
  {t:"Regulate hard.",fx:{econ:-2,civil:2},out:"Odds disclosed; magic dims."},
  {t:"Free market of pixels.",fx:{econ:2},out:"Whales fund the industry."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Just one more pack."}]},
 {id:"elevator",title:"The Space Elevator Levy?",tags:["tech","wonder"],text:"A consortium will build a ribbon to orbit — if nations chip in. The bill has many zeroes.",opts:[
  {t:"Pay our share (bank −3).",fx:{econ:4,civil:2,bank:-3},out:"Cargo climbs a thread of light."},
  {t:"Let others pay.",fx:{econ:1},out:"Free riders reach orbit too."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The sky stays expensive."}]},
 {id:"firewall",title:"The National Firewall?",tags:["tech","rights"],text:"Foreign memes corrupt youth, say censors. A great firewall would filter the world.",opts:[
  {t:"Build the wall.",fx:{civil:-7,pol:-6},out:"Intranet: cozy, censored, complete."},
  {t:"Open pipes.",fx:{civil:4,pol:3},out:"Memes flow like water."},
  {t:"Filter the worst only.",fx:{civil:-1},out:"Everyone argues about 'worst'."}]},
 {id:"staterel",title:"One True Faith?",tags:["faith"],text:"Clerics demand established status and taxes for temples. Minorities clutch their prayer books.",opts:[
  {t:"Establish it.",fx:{civil:-5,pol:-4},out:"Bells ring; others whisper."},
  {t:"Strictly secular.",fx:{civil:3,pol:2},out:"Gods go private."},
  {t:"Fund all faiths.",fx:{civil:1,econ:-2},out:"Ecumenical budget lines."}]},
 {id:"sacrifice",title:"Ban Ritual Sacrifice?",tags:["faith","rights"],text:"Ancient rites meet modern animal law. Faithful versus furry — choose.",opts:[
  {t:"Ban it.",fx:{civil:-2},out:"Altars go symbolic."},
  {t:"Protect the rite.",fx:{civil:2,pol:1},out:"Tradition bleeds on."},
  {t:"License and inspect.",fx:{civil:1},out:"Ritual, with paperwork."}]},
 {id:"scarf",title:"Headscarves in Schools?",tags:["faith","rights"],text:"A school expelled a girl for her headscarf. Streets divide instantly.",opts:[
  {t:"Allow them.",fx:{civil:4},out:"Classrooms more colorful."},
  {t:"Ban all symbols.",fx:{civil:-3},out:"Neutrality, enforced uniformly."},
  {t:"Local choice.",fx:{civil:1},out:"A patchwork of policies."}]},
 {id:"templetax",title:"Tax the Temples?",tags:["faith","economy"],text:"Golden domes, empty collection plates (for the taxman). Exempt or assess?",opts:[
  {t:"Tax them all.",fx:{econ:3,civil:-2},out:"Heaven pays its share."},
  {t:"Keep exemptions.",fx:{civil:1,econ:-1},out:"Faith remains priceless. Literally."},
  {t:"Tax the megachurches.",fx:{econ:2},out:"Stadiums of worship, taxed as stadiums."}]},
 {id:"armsexp",title:"Sell Guns Abroad?",tags:["military","foreign"],text:"A buyer with cash and a questionable record wants your finest artillery. Jobs versus conscience.",opts:[
  {t:"Sell!",fx:{econ:5,civil:-3},out:"Factories hum; editorials scream.",world:{dem:"trade"}},
  {t:"Embargo them.",fx:{civil:3,econ:-2},out:"Clean hands, idle lathes.",world:{dem:"warnmil"}},
  {t:"Sell, with 'safeguards'.",fx:{econ:2},out:"Paper promises, steel deliveries."}]},
 {id:"closebase",title:"Evict the Foreign Base?",tags:["military","foreign"],text:"A great power's base squats on prime coast. Sovereignty rallies; the local bar district weeps.",opts:[
  {t:"Evict them.",fx:{pol:3,civil:2,econ:-2},out:"Flags lowered; rent lost.",world:{dem:"warnmil"}},
  {t:"Renew the lease.",fx:{econ:2,pol:-1},out:"Jets stay; pride pays."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Runways hum on."}]},
 {id:"cyberdraft",title:"Draft the Hackers?",tags:["military","tech"],text:"Cyber Command wants to conscript elite hackers. Hoodies versus uniforms.",opts:[
  {t:"Draft them.",fx:{pol:-3,econ:2},out:"Keyboards march in formation."},
  {t:"Hire, don't draft.",fx:{econ:-1},out:"Mercenary mice, premium cheese."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Firewalls hold. Probably."}]},
 {id:"mercban",title:"Ban the Dogs of War?",tags:["military"],text:"Private battalions rent out your veterans to foreign wars. Profit with flags of convenience.",opts:[
  {t:"Ban mercenaries.",fx:{civil:2,pol:1,econ:-2},out:"Soldiers soldier only for home."},
  {t:"License them.",fx:{econ:3},out:"War, with receipts."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Contracts renew quietly."}]},
 {id:"wacomp",title:"Obey Every Resolution?",tags:["foreign","world"],text:"The Assembly demands 100% compliance, not 75%. Sovereignty hawks smell a trap.",opts:[
  {t:"Full compliance.",fx:{pol:2,civil:2},out:"Gold stars from Geneva.",world:{wa:{side:"for",n:40}}},
  {t:"Our laws first.",fx:{pol:-1},out:"Sovereignty keeps its seat.",world:{wa:{side:"against",n:40}}},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Diplomats sigh in French."}]},
 {id:"prelife",title:"President for Life?",tags:["governance","coup"],text:"Your party proposes extending your term — indefinitely. 'Stability!' they cry. History clears its throat.",opts:[
  {t:"Accept the crown. (The world will remember this.)",fx:{pol:-15,civil:-8},out:"Applause, mandatory and thunderous.",coup:true,world:{storm:true}},
  {t:"Two terms, then fishing.",fx:{pol:4,civil:2},out:"A graceful exit, eventually."},
  {t:"Put it to referendum.",fx:{pol:2},out:"The people decide. Probably."}]},
 {id:"sortition",title:"Rule by Lottery?",tags:["governance"],text:"Radicals propose replacing parliament with random citizens. 'Like jury duty, but for everything!'",opts:[
  {t:"Draw the lots!",fx:{pol:6,civil:3},out:"Bakers legislate beautifully."},
  {t:"Keep elections.",fx:{pol:-1},out:"Professionals keep erring professionally."},
  {t:"Hybrid chamber.",fx:{pol:3},out:"Half votes, half lots."}]},
 {id:"nohouse",title:"Abolish the Upper House?",tags:["governance"],text:"The chamber of elders naps through crises. Abolish it and save millions — or guardrails?",opts:[
  {t:"Abolish!",fx:{pol:2,econ:1},out:"One chamber, zero naps."},
  {t:"Keep the elders.",fx:{pol:-1},out:"Wisdom snores on."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The naps continue."}]},
 {id:"electjudge",title:"Elect the Judges?",tags:["governance"],text:"Robed for life or robed by vote? Campaigning judges promise harsh sentences and bake sales.",opts:[
  {t:"Elect them all.",fx:{pol:4,civil:1},out:"Gavels go populist."},
  {t:"Appoint for life.",fx:{pol:-2},out:"Wigs beyond reach."},
  {t:" merit panel.",fx:{pol:1},out:"Boring, excellent justice."}]},
 {id:"movecap",title:"Move the Capital?",tags:["governance","wonder"],text:"The old capital floods, chokes, and costs. A gleaming new city awaits in the interior — for a price.",opts:[
  {t:"Build New Dawn (bank −4).",fx:{civil:3,econ:-2,bank:-4,pop:3},out:"Boulevards wide enough for parades and floods of hope."},
  {t:"Stay and adapt.",fx:{econ:1},out:"Sandbags as heritage."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The tide tables govern."}]},
 {id:"timezone",title:"One Time for All?",tags:["weird"],text:"Time zones confuse trains and traders. Single national time — dawn at midnight in the east?",opts:[
  {t:"One time!",fx:{econ:2,civil:-2},out:"Lunch at sunrise. Efficiency!"},
  {t:"Keep the zones.",fx:{civil:1},out:"Noon stays honest."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Clocks disagree politely."}]},
 {id:"emojilang",title:"Emoji as Official Language?",tags:["weird","culture"],text:"Youth petition: make emoji co-official. Laws in pictograms. 🚂💨?",opts:[
  {t:"🌟 Yes!",fx:{civil:4},out:"Statutes now slap."},
  {t:"Absolutely not.",fx:{civil:-2},out:"Words keep their monopoly."},
  {t:"Pilot in schools.",fx:{civil:2},out:"📚➡️🧠."}]},
 {id:"siesta",title:"Mandatory Naps?",tags:["weird","health"],text:"Doctors prescribe a national siesta: 2pm, lights out, dreams on.",opts:[
  {t:"Nap by law.",fx:{civil:4,pop:1},out:"Snores harmonize nationwide."},
  {t:"Naps encouraged.",fx:{civil:2},out:"Pillows sell out."},
  {t:"No rest for the wicked.",fx:{civil:-2,econ:1},out:"Coffee futures soar."}]},
 {id:"pigeonpost",title:"Revive Pigeon Post?",tags:["weird"],text:"Romantics want an official pigeon mail backup for when the cables fail (or the memes).",opts:[
  {t:"Fund the lofts (bank −0.5).",fx:{civil:2,bank:-0.5},out:"Cooing infrastructure."},
  {t:"Let hobbyists pay.",fx:{econ:1},out:"Stamps feature pigeons. Naturally."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The skies stay unofficial."}]},
 {id:"cryptomin",title:"A Ministry of Mysteries?",tags:["weird"],text:"Bigfoot believers, ghost hunters and UFO clubs demand a ministry. Science demands aspirin.",opts:[
  {t:"Fund it (bank −1).",fx:{civil:3,bank:-1},out:"Blurry photos, sharp budgets."},
  {t:"Laugh them out.",fx:{civil:-1},out:"The truth remains out there."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Something knocks at night."}]},
 {id:"arcology",title:"The Arcology Program?",tags:["wonder"],cond:{minPop:200},text:"Two hundred million souls need homes. Mile-high arcologies would stack cities like cakes.",opts:[
  {t:"Build ten (bank −5).",fx:{econ:4,civil:2,pop:12,bank:-5},out:"Vertical nations rise."},
  {t:"Sprawl instead.",fx:{econ:1,civil:-2},out:"Commutes of legend."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Rooftops multiply."}]},
 {id:"orbital",title:"The Orbital Ring?",tags:["wonder"],cond:{minPop:400},text:"Engineers propose a ring around the planet with elevators. Cost: everything. Glory: eternal.",opts:[
  {t:"Build it (bank −8).",fx:{econ:6,civil:3,bank:-8},out:"Shadows of wonder cross the noon sun."},
  {t:"Just one elevator.",fx:{econ:2,bank:-2},out:"A thread to heaven."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Gravity wins again."}]},
 {id:"seccap",title:"A Second Capital?",tags:["governance"],cond:{minPop:200},text:"One capital cannot hold a giant. A second seat of power in the south?",opts:[
  {t:"Found Southernhold (bank −3).",fx:{pol:2,civil:2,bank:-3,pop:4},out:"Two thrones, twice the parades."},
  {t:"Devolve powers.",fx:{pol:3},out:"Mayors become monarchlets."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The queues lengthen."}]},
 {id:"uncounted",title:"Census of the Uncounted?",tags:["rights"],cond:{minPop:200},text:"Millions live off-grid, uncounted, untaxed, unheard. Count them — or let them be?",opts:[
  {t:"Count everyone.",fx:{civil:3,pol:2,pop:6},out:"The nation grows on paper. And in truth."},
  {t:"Leave them be.",fx:{civil:1},out:"Freedom, unmeasured."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The hills keep their secrets."}]},
 {id:"warbonds",title:"War Bonds Drive?",tags:["military","wartime"],cond:{war:true},text:"The war chest empties. Patriotic bonds would refill it — if the public still believes.",opts:[
  {t:"Sell bonds!",fx:{econ:3,bank:3},out:"Posters everywhere. Debts somewhere."},
  {t:"War taxes.",fx:{econ:-2,civil:-3},out:"Sacrifice, itemized."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The chest echoes."}]},
 {id:"blackoutwar",title:"Blackout or Broadway?",tags:["military","wartime"],cond:{war:true},text:"Bombers may come. Blackouts hide cities but strangle nightlife.",opts:[
  {t:"Total blackout.",fx:{civil:-4,econ:-2},out:"Stars return. So does fear."},
  {t:"Lights on, guns ready.",fx:{civil:2,econ:-1},out:"Defiance, illuminated."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Curtains drawn, just in case."}]},
 {id:"victorygard",title:"Victory Gardens?",tags:["military","wartime"],cond:{war:true},text:"Blockades bite. Turn every park into potatoes?",opts:[
  {t:"Dig for victory!",fx:{civil:3,pop:1},out:"Patriotism, mashed."},
  {t:"Protect the parks.",fx:{civil:1},out:"Roses over rations."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Lawns stay decorative."}]},
 {id:"warpress",title:"Censor the War News?",tags:["military","wartime"],cond:{war:true},text:"Defeats leak. Censor them for morale — or trust the people with truth?",opts:[
  {t:"Censor everything.",fx:{civil:-5,pol:-4},out:"Victories only, forever."},
  {t:"Truth, however grim.",fx:{civil:3,pol:2},out:"Grim resolve beats bright lies."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"Rumors outrun both."}]}
];
/* ---------- procedural minor matters: towns × events × severity etc. (4,000+) ---------- */
const MINOR_TOWNS=["Millbrook","Dunmore","Karthold","Vestic","Oakhollow","Brinehaven","Coppershade","Lantern Quay","Foxmarsh","Tinderbox Row","Gullperch","Mossgate","Emberfield","Saltmeadow","Thornwick","Bellfoundry","Candlewick","Driftmark","Eelmarket","Frostgate","Honeywell","Inkpot Alley","Jutmill","Kestrel Rise","Loomsgate","Mistral Bay","Nettlefold","Oarlock","Pikehollow","Quarrydeep"];
const MINOR_EVENTS=["potholes","a broken fountain","a library roof","stray dogs","a market awning","a stopped clock tower","ferry delays","lantern strings","a rat surge","a town mural","a bandstand","an old well","bridge tolls","a lighthouse lamp","an ice rink","kite rules","a bus route","ferry fares","a monument scrub","the town crier","harbor dredging","statue polish","night-market bins","a pigeon loft","band instruments","a school bell","a fire pump","bakery ovens","a bathhouse","an orchard wall","a bell tower","cobbles"];
const CRITTERS=["foxes","badgers","otters","pigeons","gulls","swans","deer","boars","bees","owls","eels","crabs","sparrows","hedgehogs","bats","carp","herons","moles","swifts","tortoises"];
const INCIDENTS=["nesting in chimneys","raiding bins","blocking the bridge","invading the orchard","flooding a cellar","swarming the square","stealing hats","halting the parade","nesting in the stadium","chewing cables","photobombing weddings","migrating early","singing at dawn","occupying the plaza","racing the trams"];
const FESTSUMS=[0.2,0.4,0.6,0.8,1,1.2,1.5,1.8,2,2.2,2.4,2.6];
const SEV=["","grievous ","catastrophic "];
function minorByIndices(fam,t,e,s){const x=Math.pow(2,s);
 if(fam===0){const town=MINOR_TOWNS[t%MINOR_TOWNS.length],ev=MINOR_EVENTS[e%MINOR_EVENTS.length];
  return{id:`m0-${t}-${e}-${s}`,title:`${ev[0].toUpperCase()+ev.slice(1)} in ${town}?`,tags:["minor","town"],text:`${SEV[s]}${ev} plague${s>0?"":"s"} ${town}. The mayor ${s>0?"begs":"asks"} for funds.`,opts:[
   {t:`Fix it (bank −${(0.3*x).toFixed(1)})`,fx:{civil:1*x,bank:-0.3*x},out:"Fixed. The mayor takes credit."},
   {t:"Patch it cheaply",fx:{civil:0,econ:0.5*x},out:"Good enough holds."},
   {t:"Ignore it (dismiss).",dismiss:true,fx:{civil:-1*x},out:`${town} remembers.`}]};}
 if(fam===1){const cr=CRITTERS[t%CRITTERS.length],inc=INCIDENTS[e%INCIDENTS.length];
  return{id:`m1-${t}-${e}-${s}`,title:`The ${cr} are ${inc}!`,tags:["minor","wild"],text:`${SEV[s]}${cr} are ${inc} across the district. Nature, red in tooth and headline.`,opts:[
   {t:"Celebrate them!",fx:{civil:1*x},out:"Mascots multiply."},
   {t:"Cull them.",fx:{civil:-1*x,econ:0.5*x},out:"Quiet returns, furious letters follow."},
   {t:"Study them.",fx:{econ:-0.5*x},out:"A thesis nobody reads."}]};}
 const town=MINOR_TOWNS[t%MINOR_TOWNS.length],sum=FESTSUMS[e%FESTSUMS.length]*x;
 return{id:`m2-${t}-${e}-${s}`,title:`${town} Festival Asks ${sum.toFixed(1)} Bank?`,tags:["minor","culture"],text:`${town} wants a festival grant of ${sum.toFixed(1)} bank. Lanterns, music, questionable sausage.`,opts:[
  {t:`Grant it (bank −${sum.toFixed(1)})`,fx:{civil:2*x,bank:-sum},out:"The sausage was worth it."},
  {t:"Decline.",fx:{civil:-1*x},out:"Dark lanterns this year."},
  {t:"Ignore it (dismiss).",dismiss:true,fx:{},out:"The committee disbands, bitterly."}]};}
function genMinorIssue(){const r=Math.random();const fam=r<0.62?0:r<0.85?1:2;const s=Math.random()<0.7?0:Math.random()<0.75?1:2;
 if(fam===0)return minorByIndices(0,rnd(0,MINOR_TOWNS.length-1),rnd(0,MINOR_EVENTS.length-1),s);
 if(fam===1)return minorByIndices(1,rnd(0,CRITTERS.length-1),rnd(0,INCIDENTS.length-1),s);
 return minorByIndices(2,rnd(0,MINOR_TOWNS.length-1),rnd(0,FESTSUMS.length-1),s);}
/* ---------- web engine ---------- */
function condPass(d){if(!d||!d.cond||!S)return true;const c=d.cond;
 try{if(c.war&&!(typeof myWars==="function"&&myWars().some(w=>w.status==="active")))return false;}catch(e){return false;}
 if(c.minPop&&S.pop<c.minPop*1e6)return false;
 if(c.ecoMax!==undefined&&S.econ>c.ecoMax)return false;
 if(c.civMin!==undefined&&S.civil<c.civMin)return false;
 if(c.wa&&!S.wa)return false;return true;}
function getIssueDef(id){const h=DILEMMAS.find(d=>d.id===id);if(h)return h;
 const m=/^m(\d)-(\d+)-(\d+)-(\d+)$/.exec(id||"");if(!m)return null;
 try{return minorByIndices(+m[1],+m[2],+m[3],+m[4]);}catch(e){return null;}}
function markSeen(id){if(!S)return;S.seenIssues=S.seenIssues||[];S.seenIssues.push(id);if(S.seenIssues.length>600)S.seenIssues.splice(0,S.seenIssues.length-600);}
function snapIssue(d){return{id:d.id,title:d.title,text:d.text,opts:d.opts,tags:d.tags||[]};}
function drawIssue(){if(!S)return null;S.chainsDue=S.chainsDue||[];S.seenIssues=S.seenIssues||[];
 const now=Date.now();const di=S.chainsDue.findIndex(c=>c.at<=now);
 if(di>=0){const[c]=S.chainsDue.splice(di,1);const d=getIssueDef(c.id);if(d)return snapIssue(d);}
 const unseen=DILEMMAS.filter(d=>S.seenIssues.indexOf(d.id)<0&&condPass(d));
 if(unseen.length>15&&Math.random()<0.72)return snapIssue(unseen[rnd(0,unseen.length-1)]);
 if(unseen.length&&Math.random()<0.45)return snapIssue(unseen[rnd(0,unseen.length-1)]);
 return snapIssue(genMinorIssue());}
function govShiftCheck(before){if(!S)return false;const after=catOf(S);if(after===before)return false;
 pushHapp(`🏛️ GOVERNMENT TRANSFORMED: ${before} → ${after}!`);
 feedAdd(S.name,`🏛️ A new era dawns: we are now ${after} (formerly ${before}). History turns its page.`,"post",{kind:"clip",clip:"parade"});
 toast(`🏛️ Government transformed: ${after}!`);
 try{const paper=WORLD.papers.find(p=>p.region===S.region);if(paper){paper.articles.unshift(`${S.name} transformed: ${before} → ${after}`);paper.ed++;}}catch(e){}
 try{WORLD.nations.forEach(n=>bumpAffinity(n.name,-2));}catch(e){}
 return true;}
function processWorldHook(world,optTitle){if(!world||!S)return;try{
 if(world.petition&&typeof mkPetition==="function"){const p=mkPetition();if(p){pets().unshift(p);toast(`📜 Petition follows your ruling: “${p.title}”`);}}
 if(world.dem){try{const pk=typeof pickDemarcher==="function"?pickDemarcher(n=>n.name!==S.name):WORLD.nations[rnd(0,WORLD.nations.length-1)];let d=null;
  if(pk){if(world.dem==="warnmil"&&typeof mkWarnMil==="function")d=mkWarnMil(pk);else if(world.dem==="warngreen"&&typeof mkWarnGreen==="function")d=mkWarnGreen(pk);else if(world.dem==="trade"&&typeof mkTrade==="function")d=mkTrade(pk);else if(world.dem==="aid"&&typeof mkAid==="function")d=mkAid(pk);else if(world.dem==="question"&&typeof mkQuestion==="function")d=mkQuestion(pk);}
  if(d&&dems().length<4){d.at=Date.now();d.did="dm"+Date.now()+rnd(0,9999);dems().unshift(d);S.lastDem=Date.now();toast(`✉️ ${d.from}: ${d.title}`);}}catch(e){}}
 if(world.wa){const w=WORLD.wa.ga;if(world.wa.side==="for")w.for+=world.wa.n||25;else w.against+=world.wa.n||25;WORLD.wa.log.unshift({t:Date.now(),x:`${fullName(S)}'s stance moved ${w.title} (${world.wa.side}).`});}
 if(world.aff){if(world.aff.all!==undefined)WORLD.nations.forEach(n=>bumpAffinity(n.name,world.aff.all));}
 if(world.storm){WORLD.nations.forEach(n=>bumpAffinity(n.name,-8));WORLD.wa.log.unshift({t:Date.now(),x:`World condemns ${fullName(S)}'s power grab.`});
  const r1=WORLD.nations[rnd(0,WORLD.nations.length-1)],r2=WORLD.nations[rnd(0,WORLD.nations.length-1)];
  feedAdd(r1,`This power grab shames every charter we signed. The world is watching, ${S.name}.`);feedAdd(r2,`History has a special shelf for rulers who crown themselves.`);}
 }catch(e){}}
