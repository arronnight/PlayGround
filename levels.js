// Level builders. Each build(ctx) constructs one skateable spot inside a fresh
// group, then registers physics (zones/ramps/qps/solids/grinds/gaps) and the
// spawn. Layouts are original geometry homage-layouts inspired by THPS2 maps
// (School II campus, Skate Heaven island) plus the classic plaza.
function Z(ctx, x0, x1, z0, z1, h) { ctx.zones.push({ x0, x1, z0, z1, h }); }
function RMP(ctx, x0, x1, z0, z1, h0, h1, axis) { ctx.ramps.push({ x0, x1, z0, z1, h0, h1, axis }); }
function SOL(ctx, x0, x1, z0, z1, top) { ctx.SOLIDS.push({ x0, x1, z0, z1, top }); }
function GR(ctx, g) { ctx.grindTargets.push(g); }
function GAP(ctx, name, pts, x0, x1, z0, z1, y0) { ctx.gaps.push({ name, pts, x0, x1, z0, z1, y0 }); }

// ---------------------------------------------------------------- plaza
export function buildPlaza(ctx) {
  const { THREE, group, box, cyl, flatRail, quarterPipe, concreteMat, woodMat, steel, darkSteel, accentMat, M, TX } = ctx;
  const slab = TX.mat('concrete', { rx: 3, ry: 2 });
  const park = TX.mat('park', { rx: 2, ry: 2 });
  const wood = TX.mat('wood', { rx: 2, ry: 1 });
  box(8, 1.0, 4.4, slab, 0, 0.5, -10);
  box(8.3, 0.12, 0.35, steel, 0, 1.06, -7.95);
  box(8.3, 0.12, 0.35, steel, 0, 1.06, -12.05);
  GR(ctx, { axis: 'x', fixed: -7.95, min: -4, max: 4, h: 1.12, label: 'LEDGE' });
  GR(ctx, { axis: 'x', fixed: -12.05, min: -4, max: 4, h: 1.12, label: 'LEDGE' });
  flatRail(-8, -8); flatRail(8, -11); flatRail(-2, 0, 5, 0.5);
  // rail garden: two staggered bars, low + high
  flatRail(-14, -2, 6, 0.8, 'RAIL');
  flatRail(17, -4, 6, 1.0, 'HIGH RAIL');
  {
    const shape = new ctx.THREE.Shape();
    shape.moveTo(0, 0); shape.lineTo(0, 2.0); shape.lineTo(6, 0); shape.lineTo(0, 0);
    const geo = new ctx.THREE.ExtrudeGeometry(shape, { depth: 12, bevelEnabled: false });
    const mesh = new ctx.THREE.Mesh(geo, concreteMat);
    mesh.rotation.y = -Math.PI / 2; mesh.position.set(-6, 0, -22);
    mesh.castShadow = true; mesh.receiveShadow = true;
    ctx.group.add(mesh);
    box(12, 0.3, 5, wood, 0, 2.0, -30.5);
    box(12, 2.0, 0.3, accentMat, 0, 1.0, -33, false);
  }
  quarterPipe(-19, -16, 10, +1, null, park); quarterPipe(19, -16, 10, -1, null, park);
  // west halfpipe: facing pair, flat bottom, decks behind both copings
  quarterPipe(-30.5, 11, 8, +1, null, park); quarterPipe(-19.5, 11, 8, -1, null, park);
  box(4.5, 3, 8, slab, -37.75, 1.5, 11);
  box(4.5, 3, 8, slab, -12.25, 1.5, 11);
  GAP(ctx, 'HALFPIPE AIR', 350, -37, -12, 7, 15, 2.2);
  // east funbox with banks
  box(5, 0.8, 4, slab, 27, 0.4, -16);
  GR(ctx, { axis: 'z', fixed: 24.5, min: -18, max: -14, h: 0.86, label: 'FUNBOX' });
  GR(ctx, { axis: 'z', fixed: 29.5, min: -18, max: -14, h: 0.86, label: 'FUNBOX' });
  GAP(ctx, 'FUNBOX TRANSFER', 250, 24, 30, -18, -14, 1.0);
  box(3.2, 0.25, 2.0, wood, -7.5, 0.125, 4);
  box(3.3, 0.05, 2.1, slab, -7.5, 0.27, 4);
  GR(ctx, { axis: 'x', fixed: 3.05, min: -9.0, max: -6.0, h: 0.36, label: 'PAD EDGE' });
  GR(ctx, { axis: 'x', fixed: 4.95, min: -9.0, max: -6.0, h: 0.36, label: 'PAD EDGE' });
  box(6, 0.6, 1.2, slab, 12, 0.3, -2);
  box(6.2, 0.08, 0.25, steel, 12, 0.64, -1.5);
  box(6.2, 0.08, 0.25, steel, 12, 0.64, -2.5);
  GR(ctx, { axis: 'x', fixed: -1.5, min: 9, max: 15, h: 0.72, label: 'HUBBA' });
  GR(ctx, { axis: 'x', fixed: -2.5, min: 9, max: 15, h: 0.72, label: 'HUBBA' });
  {
    const shape = new ctx.THREE.Shape();
    shape.moveTo(0, 0); shape.lineTo(0, 1.0); shape.lineTo(3, 0); shape.lineTo(0, 0);
    const geo = new ctx.THREE.ExtrudeGeometry(shape, { depth: 4, bevelEnabled: false });
    const mesh = new ctx.THREE.Mesh(geo, wood);
    mesh.rotation.y = -Math.PI / 2; mesh.position.set(-12, 0, -1.5);
    mesh.castShadow = true; mesh.receiveShadow = true; ctx.group.add(mesh);
    const lip = new ctx.THREE.Mesh(new ctx.THREE.BoxGeometry(4, 0.08, 0.3), steel);
    lip.position.set(-10, 1.0, -1.5); ctx.group.add(lip);
    GR(ctx, { axis: 'x', fixed: -1.5, min: -12, max: -8, h: 1.06, label: 'LIP' });
  }
  for (let i = 0; i < 4; i++) box(10, 0.3, 1.1, slab, 0, 0.15 + i * 0.3, -40 - i * 1.0);
  {
    const rail = new ctx.THREE.Mesh(new ctx.THREE.CylinderGeometry(0.05, 0.05, 7, 10), steel);
    rail.rotation.x = Math.PI / 2 - 0.28; rail.position.set(3.4, 1.6, -41); rail.castShadow = true;
    ctx.group.add(rail);
  }
  for (const [x, z] of [[-24, 2], [24, 2], [-24, -34], [24, -34], [-12, 10], [12, 10]]) {
    cyl(0.12, 0.16, 9, darkSteel, x, 4.5, z);
    box(1.6, 0.25, 0.5, accentMat, x, 9.1, z, false);
    const pt = new ctx.THREE.PointLight(0x9fdcff, 12, 30, 1.8); pt.position.set(x, 8.6, z); ctx.group.add(pt);
  }
  for (let i = -3; i <= 3; i++) if (i !== 0) box(2.2, 0.9, 0.9, wood, i * 5.2, 0.45, 6);
  {
    const leaf = M(0x1f6b3a, 0.9, 0), trunk = M(0x5a3d26, 0.9, 0);
    for (const [x, z, s] of [[-34, -6, 1.4], [34, -4, 1.7], [-32, -28, 1.2], [33, -30, 1.5], [-14, 14, 1.1], [15, 15, 1.3]]) {
      cyl(0.18 * s, 0.24 * s, 2.4 * s, trunk, x, 1.2 * s, z);
      const cone = new ctx.THREE.Mesh(new ctx.THREE.ConeGeometry(1.7 * s, 3.4 * s, 8), leaf);
      cone.position.set(x, 3.4 * s, z); cone.castShadow = true; ctx.group.add(cone);
    }
  }
  Z(ctx, -4, 4, -12.2, -7.8, 1.0);
  Z(ctx, -9.1, -5.9, 3.0, 5.0, 0.295);
  Z(ctx, 9, 15, -2.6, -1.4, 0.6);
  Z(ctx, -40, -35.5, 7, 15, 3);
  Z(ctx, -14.5, -10, 7, 15, 3);
  Z(ctx, 24.5, 29.5, -18, -14, 0.8);
  RMP(ctx, -12, -8, 1.5, -1.5, 0, 1, 'z');
  RMP(ctx, -6, 6, -22, -28, 0, 2, 'z');
  Z(ctx, -6, 6, -33, -28, 2.0);
  for (let i = 0; i < 4; i++) Z(ctx, -5, 5, -40.55 - i, -39.45 - i, 0.3 * (i + 1));
  SOL(ctx, -4, 4, -12.2, -7.8, 1.0);
  SOL(ctx, -9.1, -5.9, 3.0, 5.0, 0.295);
  SOL(ctx, 9, 15, -2.6, -1.4, 0.6);
  SOL(ctx, -40, -35.5, 7, 15, 3);
  SOL(ctx, -14.5, -10, 7, 15, 3);
  SOL(ctx, 24.5, 29.5, -18, -14, 0.8);
  SOL(ctx, -6, 6, -33, -28, 2.15);
  SOL(ctx, -5, 5, -44, -39.5, 1.2);
  for (const [x, z] of [[-24, 2], [24, 2], [-24, -34], [24, -34], [-12, 10], [12, 10]])
    SOL(ctx, x - 0.15, x + 0.15, z - 0.15, z + 0.15, 9);
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    SOL(ctx, i * 5.2 - 1.1, i * 5.2 + 1.1, 5.55, 6.45, 0.9);
  }
  // painted center circle on the flat (plaza marker)
  {
    const ring = new THREE.Mesh(new THREE.RingGeometry(2.6, 3.0, 40),
      new THREE.MeshBasicMaterial({ color: 0x3fc1ff, transparent: true, opacity: 0.4 }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(14, 0.03, 8);
    group.add(ring);
  }
  ctx.setSpawn(0, 0, 4, Math.PI);
}

// ---------------------------------------------------------------- school
export function buildSchool(ctx) {
  const { THREE, group, box, cyl, flatRail, flatRailX, slabRamp, concreteMat, woodMat, steel, darkSteel, M, TX } = ctx;
  const roofMat = TX.mat('concrete', { rx: 4, ry: 4 });
  const brickMat = TX.mat('brick', { rx: 6, ry: 1 });
  const brick2Mat = TX.mat('brick2', { rx: 6, ry: 1 });
  const slab = TX.mat('concrete', { rx: 2, ry: 2 });
  const wood = TX.mat('wood', { rx: 2, ry: 1 });
  const awnMat = M(0x2e6f8e, 0.8, 0.05);
  // gym hall + roof
  box(20, 4, 18, roofMat, -2, 2, -17);
  Z(ctx, -12, 8, -26, -8, 4);
  SOL(ctx, -12, 8, -26, -8, 4);
  // parapets
  box(20.6, 0.8, 0.5, brickMat, -2, 4.4, -26.1);
  box(20.6, 0.8, 0.5, brickMat, -2, 4.4, -7.9);
  box(0.5, 0.8, 18.6, brickMat, -12.1, 4.4, -17);
  box(0.5, 0.8, 18.6, brickMat, 8.1, 4.4, -17);
  SOL(ctx, -12.3, 8.3, -26.4, -25.6, 4.8);
  SOL(ctx, -12.3, 8.3, -8.4, -7.6, 4.8);
  SOL(ctx, -12.4, -11.6, -26, -8, 4.8);
  SOL(ctx, 7.6, 8.4, -26, -8, 4.8);
  // bank up the south face
  slabRamp(-2, -3, 8, 4, 10, 'N', slab);
  RMP(ctx, -6, 2, 2, -8, 0, 4, 'z');
  // roof rails (Roll Call)
  flatRail(-4, -14, 6, 4.62, 'ROLL CALL');
  flatRail(0, -14, 6, 4.62, 'ROLL CALL');
  GAP(ctx, 'ROLL CALL!', 250, -5, 1, -17, -11, 4.5);
  // TC roof (west, lower)
  box(16, 2.5, 14, roofMat, -26, 1.25, -15);
  Z(ctx, -34, -18, -22, -8, 2.5);
  SOL(ctx, -34, -18, -22, -8, 2.5);
  slabRamp(-15, -15, 6, 2.5, 6, 'W', slab);
  RMP(ctx, -18, -12, -18, -12, 2.5, 0, 'x');
  GAP(ctx, "TC'S ROOF GAP", 500, -20, -10, -20, -10, 2.5);
  GAP(ctx, 'CARLSBAD GAP', 300, -17, -13, -17, -13, 1.5);
  // courtyard planters
  for (const px of [16, 20.5, 25]) {
    box(2.4, 0.6, 2.4, slab, px, 0.3, -12);
    box(2.5, 0.06, 0.2, steel, px, 0.63, -10.9);
    Z(ctx, px - 1.2, px + 1.2, -13.2, -10.8, 0.6);
    SOL(ctx, px - 1.2, px + 1.2, -13.2, -10.8, 0.6);
    GR(ctx, { axis: 'x', fixed: -10.9, min: px - 1.2, max: px + 1.2, h: 0.72, label: 'PLANTER' });
  }
  // stage + rails + awning
  box(10, 0.8, 10, wood, 35, 0.4, -13);
  Z(ctx, 30, 40, -18, -8, 0.8);
  SOL(ctx, 30, 40, -18, -8, 0.8);
  flatRailX(35, -14, 6, 1.42, 'STAGE');
  flatRailX(35, -11, 6, 1.42, 'STAGE');
  GAP(ctx, 'STAGE RAIL 2 RAIL', 250, 31, 39, -15, -10, 1);
  slabRamp(35, -4, 8, 1.6, 6, 'S', awnMat);
  GAP(ctx, 'AWNING HOP', 200, 31, 39, -7, -1, 0.8);
  // tables
  for (const tx of [-2, 2, 6]) {
    box(3, 0.12, 1.2, wood, tx, 0.75, 11);
    box(0.15, 0.7, 1.0, darkSteel, tx - 1.2, 0.35, 11);
    box(0.15, 0.7, 1.0, darkSteel, tx + 1.2, 0.35, 11);
    Z(ctx, tx - 1.5, tx + 1.5, 10.4, 11.6, 0.81);
    SOL(ctx, tx - 1.5, tx + 1.5, 10.4, 11.6, 0.81);
    GR(ctx, { axis: 'x', fixed: 11, min: tx - 1.5, max: tx + 1.5, h: 0.87, label: 'TABLE' });
  }
  GAP(ctx, 'TABLE TRANSFER', 200, 0, 4.5, 9.5, 12.5, 1);
  // bell ledge (west wall)
  box(1, 1, 20, brickMat, -40, 0.5, 5);
  box(0.25, 0.08, 20, steel, -40, 1.04, 5);
  Z(ctx, -40.5, -39.5, -5, 15, 1);
  SOL(ctx, -40.5, -39.5, -5, 15, 1);
  GR(ctx, { axis: 'z', fixed: -40, min: -5, max: 15, h: 1.1, label: 'BELLS' });
  GAP(ctx, 'ROCK THE BELLS', 200, -41, -39, -4, 14, 1.2);
  // courtyard court lines (painted, flush)
  const courtMat = M(0xe8ecf0, 0.8, 0);
  const court = (w, d, x, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.02, d), courtMat);
    m.position.set(x, 0.03, z); m.receiveShadow = true; group.add(m);
  };
  court(20, 0.25, 14, 2); court(20, 0.25, 14, 14);
  court(0.25, 12, 4, 8); court(0.25, 12, 24, 8);
  // kicker 2 hook
  slabRamp(0, 6, 4, 1.0, 3, 'N', wood);
  RMP(ctx, -2, 2, 7.5, 4.5, 0, 1, 'z');
  GAP(ctx, 'KICKER 2 HOOK', 300, -2, 2, 0, 4, 1.2);
  // courtyard flat-bar row
  flatRail(-8, 4, 6, 0.62, 'FLAT');
  flatRail(-4, 4, 6, 0.62, 'FLAT');
  // rooftop AC ledges (grindable)
  for (const [ax, az] of [[-8, -14], [2, -20]]) {
    box(2, 0.8, 2, slab, ax, 4.4, az);
    Z(ctx, ax - 1, ax + 1, az - 1, az + 1, 4.8);
    SOL(ctx, ax - 1, ax + 1, az - 1, az + 1, 4.8);
    GR(ctx, { axis: 'z', fixed: ax - 1, min: az - 1, max: az + 1, h: 4.86, label: 'AC' });
    GR(ctx, { axis: 'z', fixed: ax + 1, min: az - 1, max: az + 1, h: 4.86, label: 'AC' });
  }
  GAP(ctx, 'ROOFTOP AC', 300, -9, 3, -21, -13, 4.9);
  // courtyard funbox
  box(4, 0.7, 3, slab, 12, 0.35, 16);
  Z(ctx, 10, 14, 14.5, 17.5, 0.7);
  SOL(ctx, 10, 14, 14.5, 17.5, 0.7);
  GR(ctx, { axis: 'z', fixed: 10, min: 14.5, max: 17.5, h: 0.76, label: 'FUNBOX' });
  GR(ctx, { axis: 'z', fixed: 14, min: 14.5, max: 17.5, h: 0.76, label: 'FUNBOX' });
  // perimeter walls
  box(89, 3, 1, brickMat, 0, 1.5, -34.5);
  box(89, 3, 1, brickMat, 0, 1.5, 30.5);
  box(1, 3, 65, brickMat, -44.5, 1.5, -2);
  box(1, 3, 65, brickMat, 44.5, 1.5, -2);
  SOL(ctx, -44.5, 44.5, -35, -34, 3);
  SOL(ctx, -44.5, 44.5, 30, 31, 3);
  SOL(ctx, -45, -44, -34.5, 30.5, 3);
  SOL(ctx, 44, 45, -34.5, 30.5, 3);
  // lamps + trees
  for (const [x, z] of [[-20, 0], [8, -2], [24, -16], [0, 18]]) {
    cyl(0.12, 0.16, 7, darkSteel, x, 3.5, z);
    box(1.2, 0.2, 0.4, awnMat, x, 7.1, z, false);
    const pt = new THREE.PointLight(0xffd9a0, 14, 26, 1.8); pt.position.set(x, 6.6, z); group.add(pt);
    SOL(ctx, x - 0.15, x + 0.15, z - 0.15, z + 0.15, 7);
  }
  {
    const leaf = M(0x2a6b35, 0.9, 0), trunk = M(0x5a3d26, 0.9, 0);
    for (const [x, z, s] of [[-8, 14, 1.2], [28, 2, 1.4], [-30, 8, 1.1]]) {
      cyl(0.18 * s, 0.24 * s, 2.4 * s, trunk, x, 1.2 * s, z);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.7 * s, 3.4 * s, 8), leaf);
      cone.position.set(x, 3.4 * s, z); cone.castShadow = true; group.add(cone);
    }
  }
  ctx.setSpawn(18, 0, 18, Math.PI);
}

// ---------------------------------------------------------------- heaven
export function buildHeaven(ctx) {
  const { THREE, group, box, cyl, flatRail, flatRailX, slabRamp, quarterPipe, concreteMat, woodMat, steel, darkSteel, M, TX } = ctx;
  const rockMat = M(0x3a3348, 0.95, 0.02);
  const rimMat = M(0x4a4258, 0.9, 0.05);
  const grassMat = M(0x2f6b3a, 0.95, 0);
  const slab = TX.mat('concrete', { rx: 3, ry: 3 });
  const park = TX.mat('park', { rx: 2, ry: 2 });
  const wood = TX.mat('wood', { rx: 2, ry: 1 });
  const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff5a1a, emissive: 0xff3d00, emissiveIntensity: 2.2, roughness: 0.6 });
  const darkMat = M(0x0a0812, 1, 0);
  // island base + top
  cyl(37, 32, 5, rockMat, 0, -2.5, -5, 28);
  {
    const top = new THREE.Mesh(new THREE.CircleGeometry(37, 40), M(0x2c3140, 0.95, 0.02));
    top.rotation.x = -Math.PI / 2; top.position.set(0, 0.02, -5); top.receiveShadow = true; group.add(top);
  }
  // rim rocks (decor, outside the ride line)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rx = Math.cos(a) * 38.5, rz = -5 + Math.sin(a) * 38.5;
    const rock = new THREE.Mesh(new THREE.ConeGeometry(2 + (i % 3), 4 + (i % 4) * 2, 5), rockMat);
    rock.position.set(rx, 1.5, rz); rock.castShadow = true; group.add(rock);
  }
  // stars
  {
    const n = 500, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, e = Math.random() * Math.PI * 0.45 + 0.05, r = 150 + Math.random() * 100;
      pos[i * 3] = Math.cos(a) * Math.cos(e) * r;
      pos[i * 3 + 1] = Math.sin(e) * r;
      pos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xbfd8ff, size: 1.6, sizeAttenuation: false }));
    stars.frustumCulled = false; group.add(stars);
  }
  // volcano donut (square ring) + lava pit
  const VX = -10, VZ = -14;
  box(13, 1.2, 3, rimMat, VX, 0.6, VZ - 5);
  box(13, 1.2, 3, rimMat, VX, 0.6, VZ + 5);
  box(3, 1.2, 7, rimMat, VX - 5, 0.6, VZ);
  box(3, 1.2, 7, rimMat, VX + 5, 0.6, VZ);
  Z(ctx, VX - 6.5, VX + 6.5, VZ - 6.5, VZ - 2.5, 1.2);
  Z(ctx, VX - 6.5, VX + 6.5, VZ + 2.5, VZ + 6.5, 1.2);
  Z(ctx, VX - 6.5, VX - 2.5, VZ - 2.5, VZ + 2.5, 1.2);
  Z(ctx, VX + 2.5, VX + 6.5, VZ - 2.5, VZ + 2.5, 1.2);
  SOL(ctx, VX - 6.5, VX + 6.5, VZ - 6.5, VZ + 6.5, 1.2);
  {
    const lava = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 5.4), lavaMat);
    lava.rotation.x = -Math.PI / 2; lava.position.set(VX, -2.5, VZ); group.add(lava);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 4, 4, 1, true), darkMat);
    tube.position.set(VX, -0.7, VZ); tube.rotation.y = Math.PI / 4; group.add(tube);
    const glow = new THREE.PointLight(0xff5a1a, 22, 22, 1.8); glow.position.set(VX, 0, VZ); group.add(glow);
  }
  ctx.setHoles([{ x: VX, z: VZ, r: 3.4 }]);
  GAP(ctx, 'PIT O DOOM', 500, VX - 4, VX + 4, VZ - 4, VZ + 4, 1.4);
  // hub podium
  box(8, 1.2, 8, slab, 14, 0.6, -2);
  box(8.2, 0.08, 0.25, steel, 14, 1.24, -5.9);
  box(8.2, 0.08, 0.25, steel, 14, 1.24, 1.9);
  Z(ctx, 10, 18, -6, 2, 1.2);
  SOL(ctx, 10, 18, -6, 2, 1.2);
  GR(ctx, { axis: 'x', fixed: -5.9, min: 10.5, max: 17.5, h: 1.3, label: 'HUB' });
  GR(ctx, { axis: 'x', fixed: 1.9, min: 10.5, max: 17.5, h: 1.3, label: 'HUB' });
  GAP(ctx, 'JUMPIN DA HUB', 300, 9, 19, -7, 3, 1.4);
  // snakerun: twin ledges + rails
  for (const lx of [-30, -22]) {
    box(2, 0.6, 14, rimMat, lx + 1, 0.3, 7);
    Z(ctx, lx, lx + 2, 0, 14, 0.6);
    SOL(ctx, lx, lx + 2, 0, 14, 0.6);
  }
  flatRail(-29, 7, 10, 1.22, 'SNAKE');
  flatRail(-21, 7, 10, 1.22, 'SNAKE');
  GAP(ctx, 'SNAKE GAP', 250, -29, -21, 5, 9, 0.8);
  // zigzag rails
  flatRailX(24, -20, 5, 0.62, 'ZIG');
  flatRail(28, -15, 5, 0.62, 'ZAG');
  flatRailX(24, -10, 5, 0.62, 'ZIG');
  GAP(ctx, 'ZIG GAP', 250, 22, 30, -21, -14, 0.8);
  GAP(ctx, '2AG GAP', 250, 22, 30, -16, -9, 0.8);
  // longrail + kicker span
  flatRail(-2, -14, 12, 0.62, 'LONGRAPH');
  slabRamp(-2, -24, 4, 1.0, 3, 'N', woodMat);
  RMP(ctx, -4, 0, -25.5, -22.5, 0, 1, 'z');
  GAP(ctx, 'KICKER 2 RAILSPAN', 300, -4, 0, -22, -16, 1);
  // second kicker facing back (rail 2 kicker line)
  slabRamp(-2, 0, 4, 1.0, 3, 'S', woodMat);
  RMP(ctx, -4, 0, -1.5, 1.5, 1, 0, 'z');
  GAP(ctx, 'RAIL 2 KICKER', 250, -4, 0, -4, 2, 1);
  // benches
  for (const bx of [-16, -12, -8]) {
    box(2.4, 0.12, 0.8, wood, bx, 0.45, 8);
    box(0.15, 0.4, 0.6, darkSteel, bx - 0.9, 0.2, 8);
    box(0.15, 0.4, 0.6, darkSteel, bx + 0.9, 0.2, 8);
    Z(ctx, bx - 1.2, bx + 1.2, 7.6, 8.4, 0.51);
    SOL(ctx, bx - 1.2, bx + 1.2, 7.6, 8.4, 0.51);
    GR(ctx, { axis: 'x', fixed: 8, min: bx - 1.2, max: bx + 1.2, h: 0.57, label: 'BENCH' });
  }
  GAP(ctx, 'BENCH GAP SERIES', 250, -17, -7, 7, 9, 0.6);
  // islands edge rail
  flatRail(30, -2, 6, 0.62, 'EDGE');
  GAP(ctx, 'ISLANDS EDGE', 300, 28, 33, -5, 1, 0.8);
  // east halfpipe: facing pair over the grass, decks on both copings
  quarterPipe(1, 14, 10, +1, null, park); quarterPipe(14, 14, 10, -1, null, park);
  box(5, 3, 10, slab, -6.5, 1.5, 14);
  box(5, 3, 10, slab, 21.5, 1.5, 14);
  Z(ctx, -9, -4, 9, 19, 3);
  Z(ctx, 19, 24, 9, 19, 3);
  SOL(ctx, -9, -4, 9, 19, 3);
  SOL(ctx, 19, 24, 9, 19, 3);
  GAP(ctx, 'HALFPIPE AIR', 350, -7, 22, 9, 19, 2.2);
  // extra rails + funbox
  flatRail(-8, -8, 6, 0.8, 'RAIL');
  flatRailX(8, 20, 6, 0.62, 'RAIL');
  box(5, 0.7, 4, slab, -12, 0.35, 20);
  Z(ctx, -14.5, -9.5, 18, 22, 0.7);
  SOL(ctx, -14.5, -9.5, 18, 22, 0.7);
  GR(ctx, { axis: 'z', fixed: -14.5, min: 18, max: 22, h: 0.76, label: 'FUNBOX' });
  GR(ctx, { axis: 'z', fixed: -9.5, min: 18, max: 22, h: 0.76, label: 'FUNBOX' });
  GAP(ctx, 'FUNBOX TRANSFER', 250, -15, -9, 18, 22, 1.0);
  // grass patches + start fence + lamps
  for (const [gx, gz, gr] of [[-20, -20, 6], [10, 12, 7], [24, 8, 5], [-4, -30, 6], [20, -28, 5]]) {
    const p = new THREE.Mesh(new THREE.CircleGeometry(gr, 20), grassMat);
    p.rotation.x = -Math.PI / 2; p.position.set(gx, 0.03, gz); p.receiveShadow = true; group.add(p);
  }
  box(8, 0.2, 5, concreteMat, 0, 0.1, 22);
  Z(ctx, -4, 4, 19.5, 24.5, 0.2);
  for (const fx of [-5, 5]) {
    box(0.4, 3, 0.4, darkSteel, fx, 1.5, 25);
    SOL(ctx, fx - 0.2, fx + 0.2, 24.8, 25.2, 3);
  }
  for (const [x, z] of [[-24, -24], [8, -20], [22, 4]]) {
    cyl(0.12, 0.16, 8, darkSteel, x, 4, z);
    const pt = new THREE.PointLight(0x9fdcff, 14, 26, 1.8); pt.position.set(x, 7.6, z); group.add(pt);
    SOL(ctx, x - 0.15, x + 0.15, z - 0.15, z + 0.15, 8);
  }
  // glow strips on the hub + lava rim light ring
  {
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x3fc1ff });
    for (const gz of [-5.9, 1.9]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.04, 0.12), glowMat);
      strip.position.set(14, 1.24, gz); group.add(strip);
    }
    const rim = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.9, 24),
      new THREE.MeshBasicMaterial({ color: 0xff5a1a, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
    rim.rotation.x = -Math.PI / 2; rim.position.set(VX, 1.22, VZ); group.add(rim);
  }
  ctx.setSpawn(0, 0.2, 22, Math.PI);
  ctx.setBounds(0, -5, 34);
  ctx.setKillY(-5);
}

// ---------------------------------------------------------------- street
// PS2-era street spot homage (data: bloxpicto4-blip/skate-threejs spot —
// solids/rails/QP/gaps ported to our zone/ramp/grind system). Keeps our
// controls + flick stick: only geometry + physics data come from the spot.
export function buildStreet(ctx) {
  const { THREE, group, box, cyl, flatRail, flatRailX, slabRamp, quarterPipe, concreteMat, woodMat, steel, darkSteel, M, TX } = ctx;
  const asphalt = TX.mat('asphalt', { rx: 8, ry: 2 });
  const ledgeMat = TX.mat('concrete', { rx: 2, ry: 1 });
  const brickMat = TX.mat('brick', { rx: 8, ry: 2 });
  const brick2Mat = TX.mat('brick2', { rx: 8, ry: 2 });
  const slab = TX.mat('concrete', { rx: 3, ry: 3 });
  const park = TX.mat('park', { rx: 2, ry: 2 });
  const wood = TX.mat('wood', { rx: 2, ry: 1 });
  // road paint: center dashes + crosswalk at the table crossing
  box(88, 0.04, 8, asphalt, 0, 0.02, 0);
  const paintMat = M(0xd8dce2, 0.8, 0);
  for (let dx = -33; dx <= 33; dx += 6) {
    if (dx > -8 && dx < 12) continue; // keep the crossing clean
    const dash = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 0.18), paintMat);
    dash.position.set(dx, 0.035, 0); dash.receiveShadow = true; group.add(dash);
  }
  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 7.6), paintMat);
    bar.position.set(-2 + i * 2, 0.035, 0); bar.receiveShadow = true; group.add(bar);
  }
  // yellow curb paint along the platform lip
  const curbMat = M(0xd8a920, 0.7, 0);
  box(52, 0.06, 0.3, curbMat, -2, 1.18, -14.1, false);
  // raised south platform + access ramps + stairs + hubba + bank
  box(52, 1.15, 21.5, slab, -2, 0.575, -24.75);
  slabRamp(-30.25, -24.5, 15, 1.15, 4.5, 'W', concreteMat);
  slabRamp(26.25, -24.5, 15, 1.15, 4.5, 'E', concreteMat);
  for (let i = 0; i < 6; i++) box(10, 0.19, 0.5, concreteMat, -11, 1.05 - i * 0.19, -13.75 + i * 0.5);
  slabRamp(-5, -12.2, 1.2, 1.15, 3.6, 'N', ledgeMat);
  slabRamp(2, -11.75, 8, 1.15, 4.5, 'N', park);
  // ledges, manual pad + bumps, block area, dock, funbox
  box(2, 0.45, 14, ledgeMat, -21, 0.225, 13);
  box(12, 0.4, 4, slab, 0, 0.2, 11);
  slabRamp(0, 6.5, 12, 0.4, 5, 'N', concreteMat);
  slabRamp(0, 14.6, 12, 0.4, 3.2, 'S', concreteMat);
  box(12, 0.55, 9, slab, 20, 0.275, 13.5);
  slabRamp(20, 7.5, 12, 0.55, 3, 'N', concreteMat);
  for (let i = 0; i < 3; i++) box(4, 0.18, 0.55, concreteMat, 20, 0.46 - i * 0.18, 18.3 + i * 0.55);
  slabRamp(24, 19, 2, 0.55, 2, 'S', concreteMat);
  box(9.5, 1.1, 14, slab, -30.75, 0.55, 19);
  slabRamp(-30.75, 10, 9.5, 1.1, 4, 'N', concreteMat);
  box(6, 0.45, 5, slab, 29, 0.225, 27.5);
  slabRamp(29, 23.5, 6, 0.45, 3, 'N', concreteMat);
  slabRamp(29, 31.5, 6, 0.45, 3, 'S', concreteMat);
  // quarter pipe: face + deck + landing + side rolls + coping
  slabRamp(-4, 19.54, 20, 2.6, 4.08, 'S', park);
  box(20, 0.25, 2.9, wood, -4, 2.7, 24.1);
  slabRamp(-4, 30.5, 20, 2.82, 10, 'S', concreteMat);
  slabRamp(-17.5, 24.1, 2.8, 2.82, 7, 'W', concreteMat);
  slabRamp(9.5, 24.1, 2.8, 2.82, 7, 'E', concreteMat);
  {
    const cop = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 20, 10), steel);
    cop.rotation.z = Math.PI / 2; cop.position.set(-4, 2.63, 21.58); cop.castShadow = true; group.add(cop);
  }
  // back wall ramp + deck + coping
  slabRamp(0, 42.95, 74, 3.4, 3.3, 'S', park);
  box(76, 3.4, 3.4, concreteMat, 0, 1.7, 46.3);
  {
    const cop = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 74, 10), steel);
    cop.rotation.z = Math.PI / 2; cop.position.set(0, 3.43, 44.6); group.add(cop);
  }
  // perimeter buildings (visual mass) + fence
  box(96, 15, 4, brick2Mat, 0, 7.5, 50, false);
  box(96, 13, 14, brickMat, 0, 6.5, -41, false);
  box(12, 11, 38, brickMat, -44, 5.5, -15, false);
  box(12, 12, 30, brickMat, -44, 6, 19, false);
  box(14, 10, 38, brick2Mat, 43, 5, -15, false);
  box(14, 11, 26, brick2Mat, 43, 5.5, 17, false);
  box(0.4, 3, 15, darkSteel, 35, 1.5, 13.5);
  // lamps (2 lights max for perf)
  for (const [x, z] of [[-20, 8], [16, 20]]) {
    cyl(0.12, 0.16, 8, darkSteel, x, 4, z);
    const pt = new THREE.PointLight(0xffd9a0, 12, 26, 1.8); pt.position.set(x, 7.6, z); group.add(pt);
  }
  // rails (from the spot's RAILS, axis-aligned ports)
  flatRail(-12, -12.4, 3.6, 1.3, 'HANDRAIL');
  flatRail(-4.4, -12.2, 3.4, 1.0, 'HUBBA');
  flatRailX(15, -14, 18, 1.2, 'LEDGE');
  flatRail(-12, 12.25, 8.5, 0.35, 'FLAT BAR');
  flatRail(-20, 13, 13.6, 0.5, 'LEDGE');
  flatRail(-22, 13, 13.6, 0.5, 'LEDGE');
  flatRail(-6, 11, 3.6, 0.45, 'MANNY');
  flatRail(6, 11, 3.6, 0.45, 'MANNY');
  flatRail(14, 13.5, 8.6, 0.6, 'BLOCK');
  flatRail(20, 18.8, 1.9, 0.9, 'HANDRAIL');
  flatRail(26, 27.5, 4.6, 0.5, 'FUNBOX');
  flatRail(32, 27.5, 4.6, 0.5, 'FUNBOX');
  flatRail(-26, 19, 13.6, 1.15, 'DOCK');
  flatRailX(-4, 21.58, 20, 2.66, 'COPING');
  flatRailX(0, 44.6, 74, 3.46, 'COPING');
  GR(ctx, { axis: 'z', fixed: -12, min: -14.2, max: -10.6, h: 1.34, label: 'HANDRAIL' });
  GR(ctx, { axis: 'z', fixed: -4.4, min: -13.9, max: -10.5, h: 1.04, label: 'HUBBA' });
  GR(ctx, { axis: 'x', fixed: -14, min: 6, max: 24, h: 1.24, label: 'LEDGE' });
  GR(ctx, { axis: 'z', fixed: -12, min: 8, max: 16.5, h: 0.4, label: 'FLAT BAR' });
  GR(ctx, { axis: 'z', fixed: -20, min: 6.2, max: 19.8, h: 0.5, label: 'LEDGE' });
  GR(ctx, { axis: 'z', fixed: -22, min: 6.2, max: 19.8, h: 0.5, label: 'LEDGE' });
  GR(ctx, { axis: 'z', fixed: -6, min: 9.2, max: 12.8, h: 0.45, label: 'MANNY' });
  GR(ctx, { axis: 'z', fixed: 6, min: 9.2, max: 12.8, h: 0.45, label: 'MANNY' });
  GR(ctx, { axis: 'z', fixed: 14, min: 9.2, max: 17.8, h: 0.6, label: 'BLOCK' });
  GR(ctx, { axis: 'z', fixed: 20, min: 17.9, max: 19.75, h: 0.94, label: 'HANDRAIL' });
  GR(ctx, { axis: 'z', fixed: 26, min: 25.2, max: 29.8, h: 0.5, label: 'FUNBOX' });
  GR(ctx, { axis: 'z', fixed: 32, min: 25.2, max: 29.8, h: 0.5, label: 'FUNBOX' });
  GR(ctx, { axis: 'z', fixed: -26, min: 12.2, max: 25.8, h: 1.15, label: 'DOCK' });
  GR(ctx, { axis: 'x', fixed: 21.58, min: -14, max: 6, h: 2.68, label: 'COPING' });
  GR(ctx, { axis: 'x', fixed: 44.6, min: -38, max: 36, h: 3.48, label: 'COPING' });
  // physics: ride surfaces
  Z(ctx, -28, 24, -35.5, -14, 1.15);
  RMP(ctx, -32.5, -28, -32, -17, 0, 1.15, 'x');
  RMP(ctx, 24, 28.5, -32, -17, 1.15, 0, 'x');
  RMP(ctx, -16, -6, -14, -11, 1.15, 0, 'z');
  RMP(ctx, -5.6, -4.4, -14, -10.4, 1.35, 0.2, 'z');
  RMP(ctx, -2, 6, -14, -9.5, 1.15, 0, 'z');
  Z(ctx, -22, -20, 6, 20, 0.45);
  Z(ctx, -6, 6, 9, 13, 0.4);
  RMP(ctx, -6, 6, 4, 9, 0, 0.4, 'z');
  RMP(ctx, -6, 6, 13, 16.2, 0.4, 0, 'z');
  Z(ctx, 14, 26, 9, 18, 0.55);
  RMP(ctx, 14, 26, 6, 9, 0, 0.55, 'z');
  RMP(ctx, 18, 22, 18, 19.65, 0.55, 0, 'z');
  RMP(ctx, 22, 26, 18, 20, 0.55, 0, 'z');
  Z(ctx, -35.5, -26, 12, 26, 1.1);
  RMP(ctx, -35.5, -26, 8, 12, 0, 1.1, 'z');
  Z(ctx, 26, 32, 25, 30, 0.45);
  RMP(ctx, 26, 32, 22, 25, 0, 0.45, 'z');
  RMP(ctx, 26, 32, 30, 33, 0.45, 0, 'z');
  RMP(ctx, -14, 6, 17.5, 21.58, 0, 2.6, 'z');
  RMP(ctx, -14, 6, 21.58, 22.68, 2.6, 2.82, 'z');
  Z(ctx, -14, 6, 22.68, 25.48, 2.82);
  RMP(ctx, -14, 6, 25.48, 35.5, 2.82, 0, 'z');
  RMP(ctx, -21, -14, 22.68, 25.48, 0, 2.82, 'x');
  RMP(ctx, 6, 13, 22.68, 25.48, 2.82, 0, 'x');
  RMP(ctx, -38, 36, 41.3, 44.6, 0, 3.4, 'z');
  Z(ctx, -38, 36, 44.6, 48, 3.4);
  // solids (walls that stop you if you hit them low)
  SOL(ctx, -28, 24, -35.5, -14, 1.15);
  SOL(ctx, -22, -20, 6, 20, 0.45);
  SOL(ctx, -6, 6, 9, 13, 0.4);
  SOL(ctx, 14, 26, 9, 18, 0.55);
  SOL(ctx, -35.5, -26, 12, 26, 1.1);
  SOL(ctx, 26, 32, 25, 30, 0.45);
  SOL(ctx, -38, 36, 44.6, 48, 3.4);
  SOL(ctx, -48, 48, -48, -34, 13);
  SOL(ctx, -48, 48, 48, 52, 15);
  SOL(ctx, -50, -38, -34, 48, 11);
  SOL(ctx, 36, 50, -34, 48, 10);
  // gaps (spot-flavored bonuses)
  GAP(ctx, 'PLATFORM LIP', 250, 6, 24, -15, -13, 1.2);
  GAP(ctx, 'HUBBA-6', 300, -6, -3, -14, -10, 1.0);
  GAP(ctx, 'MANUAL PAD', 200, -6, 6, 8, 14, 0.5);
  GAP(ctx, 'COPING', 400, -14, 6, 20, 23, 2.6);
  GAP(ctx, 'FUNBOX', 250, 26, 32, 24, 31, 0.5);
  GAP(ctx, 'DOCK EDGE', 250, -27, -25, 12, 26, 1.2);
  GAP(ctx, 'BACK COPING', 400, -30, 30, 43, 46, 3.4);
    // west halfpipe: facing pair on open ground, decks on both copings
  quarterPipe(-28.5, -4, 8, +1, null, park); quarterPipe(-16.5, -4, 8, -1, null, park);
  box(5, 3, 8, slab, -36, 1.5, -4);
  box(5, 3, 8, slab, -9, 1.5, -4);
  Z(ctx, -38.5, -33.5, -8, 0, 3);
  Z(ctx, -11.5, -6.5, -8, 0, 3);
  SOL(ctx, -38.5, -33.5, -8, 0, 3);
  SOL(ctx, -11.5, -6.5, -8, 0, 3);
  GAP(ctx, 'HALFPIPE AIR', 350, -38, -6, -8, 0, 2.2);
  // bench row off the run-out
  for (const bx of [-30, -26, -22]) {
    box(2.4, 0.12, 0.8, wood, bx, 0.45, 28);
    box(0.15, 0.4, 0.6, darkSteel, bx - 0.9, 0.2, 28);
    box(0.15, 0.4, 0.6, darkSteel, bx + 0.9, 0.2, 28);
    Z(ctx, bx - 1.2, bx + 1.2, 27.6, 28.4, 0.51);
    SOL(ctx, bx - 1.2, bx + 1.2, 27.6, 28.4, 0.51);
    GR(ctx, { axis: 'x', fixed: 28, min: bx - 1.2, max: bx + 1.2, h: 0.57, label: 'BENCH' });
  }
  GAP(ctx, 'BENCH SERIES', 250, -31, -21, 27, 29, 0.6);
ctx.setSpawn(2, 1.15, -24, 0);
}

export const LEVELS = [
  {
    id: 'school', name: 'SCHOOL II', sub: 'SOUTHERN CALI · CAMPUS',
    features: ['Skateable gym + TC rooftops', 'Rail row, AC ledges + funbox', 'Brick, wood + 9 THPS-style gaps'],
    theme: { bg: 0xcfe0f2, fog: 0xcfe0f2, fogNear: 70, fogFar: 260, ground: 0xe4e8ec, groundTex: 'sidewalk', groundRepeat: 40, sun: 1.8, sunColor: 0xffffff, sunOff: [-24, 48, 20], hemiSky: 0xcfe8ff, hemiGround: 0x8a7f6a, hemi: 0.65, rim: 0x9fc4ff, rimI: 0.7, exposure: 1.0, skyTop: 0x2a7ae0, skyHorizon: 0xcfe4f7, skyBottom: 0x55504a },
    build: buildSchool,
  },
  {
    id: 'heaven', name: 'SKATE HEAVEN', sub: 'FLOATING ISLAND · VOID',
    features: ['Volcano pit + hub island', 'Halfpipe, rails + funbox', '10 gaps — mind the edge'],
    theme: { bg: 0x0a0618, fog: 0x0a0618, fogNear: 40, fogFar: 170, ground: 0x8a86a0, groundTex: 'concrete', groundRepeat: 40, sun: 0.85, sunColor: 0xa9c4ff, sunOff: [30, 40, -20], hemiSky: 0x4a5a9a, hemiGround: 0x1a1426, hemi: 0.55, rim: 0x7a5aff, rimI: 1.0, exposure: 1.0, skyTop: 0x05030f, skyHorizon: 0x2a1650, skyBottom: 0x05030f },
    build: buildHeaven,
  },
  {
    id: 'plaza', name: 'SUNSET PLAZA', sub: 'CLASSIC PARK · GOLDEN HOUR',
    features: ['Halfpipe + 2 quarterpipes', 'Rail garden, 2 funboxes', 'Textured concrete, wood + park'],
    theme: { bg: 0xd8c9a8, fog: 0xd8c9a8, fogNear: 80, fogFar: 280, ground: 0xe4e8ec, groundTex: 'concrete', groundRepeat: 48, sun: 1.7, sunColor: 0xffe8c4, sunOff: [-40, 26, 22], hemiSky: 0xffd9b0, hemiGround: 0x6b5f4c, hemi: 0.85, rim: 0xff9a5a, rimI: 0.6, exposure: 1.0, skyTop: 0x2f6fc4, skyHorizon: 0xf0d9a8, skyBottom: 0x4a423a },
    build: buildPlaza,
  },
  {
    id: 'street', name: 'STREET SPOT', sub: 'PS2-ERA PLAZA · GENEX SPOT',
    features: ['Platform, hubba + handrails', 'Halfpipe, QP + back-ramp coping', 'Asphalt, brick + 9 spot gaps'],
    theme: { bg: 0xd4dde4, fog: 0xd4dde4, fogNear: 70, fogFar: 250, ground: 0xe4e8ec, groundTex: 'asphalt', groundRepeat: 48, sun: 1.7, sunColor: 0xfff4e0, sunOff: [-30, 44, 16], hemiSky: 0xbdd7ff, hemiGround: 0x6b6257, hemi: 0.9, rim: 0x9fc4ff, rimI: 0.7, exposure: 1.0, skyTop: 0x5a8fc4, skyHorizon: 0xdde3e8, skyBottom: 0x55504a },
    build: buildStreet,
  },
];
