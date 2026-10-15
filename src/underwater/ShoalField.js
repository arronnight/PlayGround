import * as THREE from 'three';
import { U } from '../core/SharedUniforms.js';
import { WATER_GLSL } from './UnderwaterMaterial.js';
import { seeded } from './WorldMath.js';
import { SITE_ORIGINS } from './OceanDomain.js';

/**
 * ShoalField — the teeming bulk of the ocean, computed entirely on the GPU.
 *
 * Tens of thousands of small fish would cost tens of milliseconds per frame
 * through the CPU motion solver, so the shoals live in the vertex shader
 * instead: each instance orbits an analytic bait-ball center, wags its tail
 * from the shared clock, and scatters from live hunter positions fed as
 * uniforms. The CPU cost is one draw call and eight uniform writes; the
 * simulated fauna (hunters, cruisers, bottom dwellers) keeps full
 * predator/prey behavior, and bait balls part around real hunters.
 *
 * Precambrian seas build no shoals at all: nothing with fins existed yet.
 */

const MAX_SCHOOLS = 12;
const MAX_HUNTERS = 8;

const VERT = /* glsl */ `
uniform float uTime;
uniform vec3 uCamPos;
uniform vec4 uSchools[${MAX_SCHOOLS}];
uniform int uSchoolCount;
uniform vec4 uHunters[${MAX_HUNTERS}];
attribute vec4 aShoal;
varying vec3 vWorld;
varying vec3 vNormalW;
varying vec3 vTint;
varying float vDist;
void main() {
  int school = int(aShoal.x + 0.5);
  float phase = aShoal.y * 6.2831853;
  float size = aShoal.z;
  vec4 sc = uSchools[school];
  float speed = 0.55 + fract(aShoal.y * 7.31) * 0.75;
  float ang = uTime * speed + phase;
  float rad = sc.w * (0.55 + 0.45 * fract(aShoal.y * 3.77));
  // Bait-ball center drifts slowly so the school reads as traveling.
  vec3 center = sc.xyz + vec3(
    sin(uTime * 0.045 + phase * 0.13) * 6.0,
    sin(uTime * 0.061 + phase * 0.21) * 1.6,
    cos(uTime * 0.038 + phase * 0.17) * 6.0);
  vec3 off = vec3(cos(ang) * rad, sin(ang * 0.63 + phase) * rad * 0.35, sin(ang) * rad);
  vec3 tang = normalize(vec3(-sin(ang), 0.22 * cos(ang * 0.63 + phase), cos(ang)) + vec3(0.0001));
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 side = normalize(cross(up, tang));
  vec3 upv = cross(tang, side);
  // Tail wag from the shared clock: full-rate motion with zero CPU.
  vec3 p = position;
  p.z += sin(uTime * (6.0 + fract(phase) * 5.0) + phase * 7.0) * max(0.0, -p.x) * 0.9;
  vec3 world = center + off + (side * p.x + upv * p.y + tang * p.z) * size;
  // Scatter from live hunters: bait balls part around real jaws.
  for (int i = 0; i < ${MAX_HUNTERS}; i++) {
    vec3 hp = uHunters[i].xyz;
    float hr = uHunters[i].w;
    if (hr < 0.01) continue;
    vec3 away = world - hp;
    float d = length(away);
    if (d < hr && d > 0.001) {
      float push = (1.0 - d / hr);
      world += (away / d) * push * push * hr * 0.85;
    }
  }
  vWorld = world;
  vNormalW = normalize(side * normal.x + upv * normal.y + tang * normal.z);
  vTint = mix(vec3(0.62, 0.71, 0.72), vec3(0.83, 0.80, 0.66), fract(aShoal.y * 13.7));
  vec4 mv = viewMatrix * vec4(world, 1.0);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
${WATER_GLSL}
varying vec3 vWorld;
varying vec3 vNormalW;
varying vec3 vTint;
varying float vDist;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outVelocity;
void main() {
  vec3 n = normalize(vNormalW);
  vec3 sun = normalize(uSunDir);
  float lambert = max(dot(n, sun), 0.0);
  vec3 col = vTint * (0.30 + 0.75 * lambert);
  col = underwaterFog(col, vWorld, vDist);
  outColor = vec4(max(col, vec3(0.0)), 1.0);
  // Effectively static in screen space: TAA accumulates (smooth) instead of
  // rejecting every pixel of a fast bait ball.
  outVelocity = vec4(0.0, 0.0, vDist, 1.0);
}
`;

function minnowGeometry() {
  // A ~10-triangle minnow: stretched diamond body plus a tail fork.
  const v = [
    [1.0, 0, 0], [0.1, 0.16, 0], [0.1, -0.16, 0], [0.1, 0, 0.16], [0.1, 0, -0.16],
    [-0.7, 0.05, 0], [-0.7, -0.05, 0],
    [-1.0, 0.28, 0], [-1.0, -0.28, 0],
  ];
  const idx = [0,1,3, 0,3,2, 0,2,4, 0,4,1, 5,3,1, 5,1,2, 5,2,4, 5,4,3, 5,6,7, 5,8,6];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v.flat(), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export class ShoalField {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Shoal field';
    this.mesh = null;
    this.count = 0;
    this.schools = [];
    this.hunterVecs = [];
    for (let i = 0; i < MAX_HUNTERS; i++) this.hunterVecs.push(new THREE.Vector4(0, -99999, 0, 0));
    this.schoolVecs = [];
    for (let i = 0; i < MAX_SCHOOLS; i++) this.schoolVecs.push(new THREE.Vector4(0, 0, 0, 1));
  }

  build(schools, seed = 713) {
    if (this.mesh) { this.group.remove(this.mesh); this.mesh.geometry.dispose(); this.mesh.material.dispose(); this.mesh = null; }
    this.schools = schools.slice(0, MAX_SCHOOLS);
    let total = 0;
    for (const s of this.schools) total += s.count;
    this.count = total;
    if (!total) return this;
    const rng = seeded(seed + 5150);
    const data = new Float32Array(total * 4);
    let k = 0;
    this.schools.forEach((s, si) => {
      this.schoolVecs[si].set(s.center[0], s.center[1], s.center[2], s.radius);
      for (let i = 0; i < s.count; i++, k++) {
        data[k * 4] = si;
        data[k * 4 + 1] = rng();
        data[k * 4 + 2] = s.size * (0.7 + rng() * 0.6);
        data[k * 4 + 3] = rng();
      }
    });
    for (let i = this.schools.length; i < MAX_SCHOOLS; i++) this.schoolVecs[i].set(0, 0, 0, 0.001);
    const geo = new THREE.InstancedBufferGeometry();
    const base = minnowGeometry();
    geo.index = base.index;
    geo.attributes.position = base.attributes.position;
    geo.attributes.normal = base.attributes.normal;
    geo.setAttribute('aShoal', new THREE.InstancedBufferAttribute(data, 4));
    geo.instanceCount = total;
    const mat = new THREE.ShaderMaterial({
      name: 'shoal-field',
      glslVersion: THREE.GLSL3,
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        ...U,
        uSchools: { value: this.schoolVecs },
        uSchoolCount: { value: this.schools.length },
        uHunters: { value: this.hunterVecs },
      },
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.frustumCulled = false;
    this.group.add(this.mesh);
    base.dispose();
    return this;
  }

  update(camera, hunters = [], quality = 'high') {
    if (!this.mesh) return;
    // Fill hunter uniforms with the nearest live hunters to the camera.
    const sorted = hunters
      .map(p => ({ p, d: (p.x - camera.position.x) ** 2 + (p.y - camera.position.y) ** 2 + (p.z - camera.position.z) ** 2 }))
      .sort((a, b) => a.d - b.d)
      .slice(0, MAX_HUNTERS);
    for (let i = 0; i < MAX_HUNTERS; i++) {
      if (i < sorted.length) this.hunterVecs[i].set(sorted[i].p.x, sorted[i].p.y, sorted[i].p.z, 7);
      else this.hunterVecs[i].set(0, -99999, 0, 0);
    }
    const frac = { potato: 0.2, low: 0.4, medium: 0.7, high: 1, ultra: 1 }[quality] ?? 1;
    this.mesh.geometry.instanceCount = Math.floor(this.count * frac);
  }
}

// Era bait-ball layouts around the site origins. Counts are the teeming bulk:
// tens of thousands of GPU-animated fish for one draw call.
export function shoalLayoutForEra(era, seed = 713) {
  const at = (id, dx, dy, dz) => {
    const o = SITE_ORIGINS[id];
    return [o[0] + dx, dy, o[1] + dz];
  };
  if (era === 'precambrian') return [];
  if (era === 'paleozoic') {
    return [
      { center: at('reef', 0, -22, 0), radius: 10, count: 13000, size: 0.14 },
      { center: at('reef', -20, -18, 12), radius: 8, count: 10000, size: 0.14 },
      { center: at('kelp', 0, -20, 0), radius: 10, count: 10000, size: 0.14 },
      { center: at('kelp', 18, -16, -10), radius: 7, count: 8000, size: 0.14 },
      { center: at('blue', 0, -40, 0), radius: 12, count: 16000, size: 0.16 },
      { center: at('blue', -30, -60, -20), radius: 9, count: 10000, size: 0.16 },
    ];
  }
  if (era === 'mesozoic') {
    return [
      { center: at('reef', 0, -22, 0), radius: 10, count: 13000, size: 0.13 },
      { center: at('reef', 20, -18, -12), radius: 8, count: 10000, size: 0.13 },
      { center: at('kelp', 0, -20, 0), radius: 10, count: 11000, size: 0.13 },
      { center: at('blue', 0, -42, 0), radius: 12, count: 16000, size: 0.15 },
      { center: at('blue', 25, -50, 15), radius: 9, count: 13000, size: 0.15 },
      { center: at('blue', -25, -70, -25), radius: 10, count: 11000, size: 0.15 },
    ];
  }
  return [
    { center: at('reef', 0, -22, 0), radius: 10, count: 13000, size: 0.12 },
    { center: at('reef', -20, -18, 12), radius: 8, count: 10000, size: 0.12 },
    { center: at('kelp', 0, -20, 0), radius: 10, count: 11000, size: 0.12 },
    { center: at('kelp', 18, -16, -10), radius: 7, count: 8000, size: 0.12 },
    { center: at('blue', 0, -42, 0), radius: 12, count: 16000, size: 0.14 },
    { center: at('blue', 25, -50, 15), radius: 9, count: 13000, size: 0.14 },
    { center: at('blue', -25, -70, -25), radius: 10, count: 11000, size: 0.14 },
  ];
}
