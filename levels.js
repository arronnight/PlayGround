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
  const { box, cyl, flatRail, quarterPipe, concreteMat, woodMat, steel, darkSteel, accentMat, M } = ctx;
  box(8, 1.0, 4.4, concreteMat, 0, 0.5, -10);
  box(8.3, 0.12, 0.35, steel, 0, 1.06, -7.95);
  box(8.3, 0.12, 0.35, steel, 0, 1.06, -12.05);
  GR(ctx, { axis: 'x', fixed: -7.95, min: -4, max: 4, h: 1.12, label: 'LEDGE' });
  GR(ctx, { axis: 'x', fixed: -12.05, min: -4, max: 4, h: 1.12, label: 'LEDGE' });
  flatRail(-8, -8); flatRail(8, -11); flatRail(-2, 0, 5, 0.5);
  {
    const shape = new ctx.THREE.Shape();
    shape.moveTo(0, 0); shape.lineTo(0, 2.0); shape.lineTo(6, 0); shape.lineTo(0, 0);
    const geo = new ctx.THREE.ExtrudeGeometry(shape, { depth: 12, bevelEnabled: false });
    const mesh = new ctx.THREE.Mesh(geo, concreteMat);
    mesh.rotation.y = -Math.PI / 2; mesh.position.set(-6, 0, -22);
    mesh.castShadow = true; mesh.receiveShadow = true;
    ctx.group.add(mesh);
    box(12, 0.3, 5, woodMat, 0, 2.0, -30.5);
    box(12, 2.0, 0.3, accentMat, 0, 1.0, -33, false);
  }
  quarterPipe(-19, -16, 10, +1); quarterPipe(19, -16, 10, -1);
  box(3.2, 0.25, 2.0, woodMat, -7.5, 0.125, 4);
  box(3.3, 0.05, 2.1, concreteMat, -7.5, 0.27, 4);
  GR(ctx, { axis: 'x', fixed: 3.05, min: -9.0, max: -6.0, h: 0.36, label: 'PAD EDGE' });
  GR(ctx, { axis: 'x', fixed: 4.95, min: -9.0, max: -6.0, h: 0.36, label: 'PAD EDGE' });
  box(6, 0.6, 1.2, concreteMat, 12, 0.3, -2);
  box(6.2, 0.08, 0.25, steel, 12, 0.64, -1.5);
  box(6.2, 0.08, 0.25, steel, 12, 0.64, -2.5);
  GR(ctx, { axis: 'x', fixed: -1.5, min: 9, max: 15, h: 0.72, label: 'HUBBA' });
  GR(ctx, { axis: 'x', fixed: -2.5, min: 9, max: 15, h: 0.72, label: 'HUBBA' });
  {
    const shape = new ctx.THREE.Shape();
    shape.moveTo(0, 0); shape.lineTo(0, 1.0); shape.lineTo(3, 0); shape.lineTo(0, 0);
    const geo = new ctx.THREE.ExtrudeGeometry(shape, { depth: 4, bevelEnabled: false });
    const mesh = new ctx.THREE.Mesh(geo, woodMat);
    mesh.rotation.y = -Math.PI / 2; mesh.position.set(-12, 0, -1.5);
    mesh.castShadow = true; mesh.receiveShadow = true; ctx.group.add(mesh);
    const lip = new ctx.THREE.Mesh(new ctx.THREE.BoxGeometry(4, 0.08, 0.3), steel);
    lip.position.set(-10, 1.0, -1.5); ctx.group.add(lip);
    GR(ctx, { axis: 'x', fixed: -1.5, min: -12, max: -8, h: 1.06, label: 'LIP' });
  }
  for (let i = 0; i < 4; i++) box(10, 0.3, 1.1, concreteMat, 0, 0.15 + i * 0.3, -40 - i * 1.0);
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
  for (let i = -3; i <= 3; i++) if (i !== 0) box(2.2, 0.9, 0.9, woodMat, i * 5.2, 0.45, 6);
  {
    const leaf = M(0x1f6b3a, 0.9, 0), trunk = M(0x5a3d26, 0.9, 0);
    for (const [x, z, s] of [[-34, -6, 1.4], [34, -4, 1.7], [-32, -28, 1.2], [33, -30, 1.5], [-14, 14, 1.1], [15, 15, 1.3]]) {
      cyl(0.18 * s, 0.24 * s, 2.4 * s, trunk, x, 1.2 * s, z);
      const cone = new ctx.THREE.Mesh(new ctx.THREE.ConeGeometry(1.7 * s, 3.4 * s, 8), leaf);
      cone.position.set(x, 3.4 * s, z); cone.castShadow = true; ctx.group.add(cone);
    }
  }
  for (let i = 0; i < 4; i++) box(10, 0.3, 1.1, concreteMat, 0, 0.15 + i * 0.3, -40 - i * 1.0);
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
  for (let i = -3; i <= 3; i++) if (i !== 0) box(2.2, 0.9, 0.9, woodMat, i * 5.2, 0.45, 6);
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
  RMP(ctx, -12, -8, 1.5, -1.5, 0, 1, 'z');
  RMP(ctx, -6, 6, -22, -28, 0, 2, 'z');
  Z(ctx, -6, 6, -33, -28, 2.0);
  for (let i = 0; i < 4; i++) Z(ctx, -5, 5, -40.55 - i, -39.45 - i, 0.3 * (i + 1));
  SOL(ctx, -4, 4, -12.2, -7.8, 1.0);
  SOL(ctx, -9.1, -5.9, 3.0, 5.0, 0.295);
  SOL(ctx, 9, 15, -2.6, -1.4, 0.6);
  SOL(ctx, -6, 6, -33, -28, 2.15);
  SOL(ctx, -5, 5, -44, -39.5, 1.2);
  for (const [x, z] of [[-24, 2], [24, 2], [-24, -34], [24, -34], [-12, 10], [12, 10]])
    SOL(ctx, x - 0.15, x + 0.15, z - 0.15, z + 0.15, 9);
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    SOL(ctx, i * 5.2 - 1.1, i * 5.2 + 1.1, 5.55, 6.45, 0.9);
  }
  ctx.setSpawn(0, 0, 4, Math.PI);
}

// ---------------------------------------------------------------- school
export function buildSchool(ctx) {
  const { THREE, group, box, cyl, flatRail, flatRailX, slabRamp, concreteMat, woodMat, steel, darkSteel, M } = ctx;
  const roofMat = M(0x8b93a0, 0.9, 0.02);
  const brickMat = M(0x6e4a3f, 0.9, 0.02);
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
  slabRamp(-2, -3, 8, 4, 10, 'N', concreteMat);
  RMP(ctx, -6, 2, 2, -8, 0, 4, 'z');
  // roof rails (Roll Call)
  flatRail(-4, -14, 6, 4.62, 'ROLL CALL');
  flatRail(0, -14, 6, 4.62, 'ROLL CALL');
  GAP(ctx, 'ROLL CALL!', 250, -5, 1, -17, -11, 4.5);
  // TC roof (west, lower)
  box(16, 2.5, 14, roofMat, -26, 1.25, -15);
  Z(ctx, -34, -18, -22, -8, 2.5);
  SOL(ctx, -34, -18, -22, -8, 2.5);
  slabRamp(-15, -15, 6, 2.5, 6, 'W', concreteMat);
  RMP(ctx, -18, -12, -18, -12, 2.5, 0, 'x');
  GAP(ctx, "TC'S ROOF GAP", 500, -20, -10, -20, -10, 2.5);
  GAP(ctx, 'CARLSBAD GAP', 300, -17, -13, -17, -13, 1.5);
  // courtyard planters
  for (const px of [16, 20.5, 25]) {
    box(2.4, 0.6, 2.4, concreteMat, px, 0.3, -12);
    box(2.5, 0.06, 0.2, steel, px, 0.63, -10.9);
    Z(ctx, px - 1.2, px + 1.2, -13.2, -10.8, 0.6);
    SOL(ctx, px - 1.2, px + 1.2, -13.2, -10.8, 0.6);
    GR(ctx, { axis: 'x', fixed: -10.9, min: px - 1.2, max: px + 1.2, h: 0.72, label: 'PLANTER' });
  }
  // stage + rails + awning
  box(10, 0.8, 10, woodMat, 35, 0.4, -13);
  Z(ctx, 30, 40, -18, -8, 0.8);
  SOL(ctx, 30, 40, -18, -8, 0.8);
  flatRailX(35, -14, 6, 1.42, 'STAGE');
  flatRailX(35, -11, 6, 1.42, 'STAGE');
  GAP(ctx, 'STAGE RAIL 2 RAIL', 250, 31, 39, -15, -10, 1);
  slabRamp(35, -4, 8, 1.6, 6, 'S', awnMat);
  GAP(ctx, 'AWNING HOP', 200, 31, 39, -7, -1, 0.8);
  // tables
  for (const tx of [-2, 2, 6]) {
    box(3, 0.12, 1.2, woodMat, tx, 0.75, 11);
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
  // kicker 2 hook
  slabRamp(0, 6, 4, 1.0, 3, 'N', woodMat);
  RMP(ctx, -2, 2, 7.5, 4.5, 0, 1, 'z');
  GAP(ctx, 'KICKER 2 HOOK', 300, -2, 2, 0, 4, 1.2);
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
  const { THREE, group, box, cyl, flatRail, flatRailX, slabRamp, concreteMat, woodMat, steel, darkSteel, M } = ctx;
  const rockMat = M(0x3a3348, 0.95, 0.02);
  const rimMat = M(0x4a4258, 0.9, 0.05);
  const grassMat = M(0x2f6b3a, 0.95, 0);
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
  box(8, 1.2, 8, concreteMat, 14, 0.6, -2);
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
    box(2.4, 0.12, 0.8, woodMat, bx, 0.45, 8);
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
  ctx.setSpawn(0, 0.2, 22, Math.PI);
  ctx.setBounds(0, -5, 34);
  ctx.setKillY(-5);
}

export const LEVELS = [
  {
    id: 'school', name: 'SCHOOL II', sub: 'SOUTHERN CALI · CAMPUS',
    features: ['Skateable gym + TC rooftops', 'Stage, tables & bell ledge', '7 THPS-style gaps'],
    theme: { bg: 0x0d1626, fogNear: 60, fogFar: 200, ground: 0xd8d2c4 },
    build: buildSchool,
  },
  {
    id: 'heaven', name: 'SKATE HEAVEN', sub: 'FLOATING ISLAND · VOID',
    features: ['Volcano pit + hub island', 'Snakerun, zig rails, longrail', '8 gaps — mind the edge'],
    theme: { bg: 0x120a24, fogNear: 40, fogFar: 150, ground: 0x14101f },
    build: buildHeaven,
  },
  {
    id: 'plaza', name: 'NIGHT PLAZA', sub: 'CLASSIC PARK · OG',
    features: ['Funbox, rails + quarterpipes', 'Kicker, hubba, manual pad'],
    theme: { bg: 0x070d16, fogNear: 55, fogFar: 190, ground: 0xffffff },
    build: buildPlaza,
  },
];
