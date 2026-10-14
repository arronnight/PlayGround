# Fable City — a GTA-style open world in the browser

A Grand Theft Auto–inspired sandbox built with **Three.js** and plain ES modules. Everything is procedural: the city,
the cars, the people, the textures, the music and the sound effects are generated in code — there are no asset files.

## Run it

```bash
npm install
npm run dev        # http://localhost:5175
```

`npm run build` produces a static bundle in `dist/` (serve it with any static server).

Add `?debug` to the URL to run without pointer lock (handy for automation / testing).

## Controls

| Action | Keys |
|---|---|
| Move / sprint / jump | `WASD` · `Shift` · `Space` |
| Look | Mouse |
| Enter / exit / steal a car | `F` (occupied cars get carjacked) |
| Drive | `W` gas · `S` brake / reverse · `A` `D` steer · `Space` handbrake · `H` horn · `R` radio |
| Fire / aim | `LMB` · hold `RMB` for the over-shoulder lock-on aim |
| Weapons | `1`–`6`, `Q`, mouse wheel |
| Talk / shop | `E` near a person or a shop counter |
| Fly between cities | Walk into the glowing `TERMINAL` ring at any airport (on foot), `E` — $100 |
| Map · skip time · ambient occlusion · help | `M` · `T` · `O` · `F1` |

### Gamepad (XInput / Xbox)

Any standard-mapping pad works — left stick moves (analog walk/run), right stick looks,
`RT` fires on foot / gas in the car, `LT` aims on foot / brake in the car, `RB` is the
drive-by fire button in the car (so holding `RT` to accelerate never shoots),
`A` jumps / handbrake, `B` or `L3` sprints,
`X` talks / horn, `Y` enters+exits cars, `LB`/`RB` cycle weapons on foot,
`D-Up`/`D-Down` weapons, `D-Left` radio, `D-Right` horn, `View` map, `Menu` pause,
`R3` resets the camera. Triggers are analog and the pad rumbles on gunfire, crashes
and damage.

### Sprint & stamina

Hold sprint to run faster. It drains the yellow bar (~4.5 s); run it dry and you're
bent over panting, locked to a shuffle for 5 seconds — no sprint until it clears.
Ease off early and it refills as you walk.

### Living state

Crowds, cars and buildings follow the district: suits and shoppers downtown with
lit shopfronts and highrises, gangs and everyday people in the suburbs, hicks,
trailers and rundown homesteads out in the counties, homeless rough-sleeping (or
weaving drunk) in the core. Traffic runs packed downtown, middling in the suburbs
and sparse rural.

## What's in the state

Three cities + countryside on one 2.5 km map, San-Andreas-beats style — all on a uniform
arterial grid so traffic, cops and missions route everywhere:

- **Santos (SE)** — 9×9 downtown towers, Eastside gang blocks, Santa Maria beach with palms
  and a lifeguard tower, Los Santos Airport (runways, terminal, hangars, tower, parked planes),
  Ocean Docks (cranes, containers, piers, a cargo ship) and a stadium bowl.
- **Ferro (W)** — hilly 7×7 city, Financial towers, Easter Basin docks, Ironworks industry.
- **Venturas (NE)** — desert city with a neon casino Strip, suburbs and its own airport.
- **Bone County desert** (sand, rocks, cacti, Carson town with motel + gas station),
  **Red/Flint farmland** (crop fields, barns, silos, a spinning windmill),
  **Shady Creeks forest**, and 135 m **Mount Chiliad** with a snow cap.
- **Water + bridges** — Ferro bay, a river, docks basin and ocean, crossed by 5 bridges
  (bay bridge, red bridge, 3 river crossings) with railings, pillars and end ramps.
- **Liberty City flies in** — a second, original three-island harbor map (Shoreside with
  Francis Airport, downtown Kingsland with an arena bowl, industrial Harborton with docks,
  a dammed reservoir lake, and a cable-stayed suspension bridge), reached by walking into
  the glowing `TERMINAL` ring at any airport and buying a $100 ticket. Same shops (shared
  interiors), missions, cops, traffic and peds — rebuilt around you on landing.
- **35 original cars** across 16 classes — sedans, coupes, sports, wedge supers, open-top cabrios, muscle cars (hood
  scoops, side pipes), lowriders (whitewalls, chrome), classics, SUVs, lifted off-roaders (bullbars, roof spares),
  pickups, vans, box trucks, garbage and tow trucks, a coach bus, taxis, three police units (cruiser, interceptor,
  patrol SUV — heavier heat brings faster cars), an ambulance and a fire engine — all with framed windows
  (windshield, rear glass, split side glass, pillars, sunroofs) and full lighting (headlights, indicators,
  brake-glow tail bars, plates, exhausts).
- **Traffic & pedestrians** that follow lanes, stop at lights, honk, flee from gunfire, cross at corners, and get carjacked.
- **Arcade driving**: speed-sensitive steering, lateral grip & handbrake drifts, skid marks, damage, smoke, fire, explosions,
  headlights at night, procedural radio with three stations.
- **Wanted system (1–5 stars)** with cruisers that route through the streets, ram you, shoot at 2+ stars, get out and
  chase you on foot, arrest you if you stand still. Stars decay when you break line of sight. Pay 'n' Spray clears heat.
- **Combat**: fists, pistol, Uzi, shotgun, rifle, RPG. Lock-on aiming, headshots (2.5×), hit-markers, ragdoll-ish deaths,
  drive-bys, armed gangs that return fire, explosive red barrels.
- **Stores you can walk into**: Ammu-Nation (guns, ammo, armor), Burger Shot (health), Threads (outfits) — with clerks
  you can talk to — and a drive-through Pay 'n' Spray.
- **Missions** from glowing markers: Street Race, Taxi Fares, The Contract, Hot Wheels, Vigilante.
- **Presentation**: day/night cycle with sun, moon, stars, twilight; lit windows and neon at night; bloom, ambient
  occlusion (N8AO), tone mapping, camera shake, WASTED / BUSTED screens, rotating radar minimap, full map, area names.

See `DESIGN.md` for the mechanics notes that shaped the feel.
