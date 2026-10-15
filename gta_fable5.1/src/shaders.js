// Shared shader conventions + small custom ShaderMaterials (all original GLSL).
// Written in the spirit of ShaderToy-style development (ShaderMate /
// shader-quickstart: standard uniforms, documented patterns) and of
// curtain-style plane deformation (gpu-curtains' signature move: bending textured
// planes in the vertex shader) — but implemented natively in three.js, since a
// second engine/context alongside three.js would be the wrong architecture.
import * as THREE from 'three';

// Standard uniforms every custom shader in the game uses: uTime (seconds),
// uNight (0 day .. 1 night). Call sharedTick(mat, time, night) per frame.
export function sharedUniforms() {
  return { uTime: { value: 0 }, uNight: { value: 0 } };
}
export function sharedTick(mat, time, night) {
  if (!mat?.uniforms) return;
  if (mat.uniforms.uTime) mat.uniforms.uTime.value = time;
  if (mat.uniforms.uNight) mat.uniforms.uNight.value = night;
}

// Waving cloth flag / banner: plane pinned at the hoist (uv.x = 0), rippling
// freely toward the fly end. Slope-based faux shading gives the cloth read.
export function makeFlagMaterial(map, { strength = 0.22, freq = 6.0, speed = 5.0, phase = 0 } = {}) {
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...sharedUniforms(), uMap: { value: map }, uStrength: { value: strength }, uFreq: { value: freq }, uSpeed: { value: speed }, uPhase: { value: phase } },
    side: THREE.DoubleSide,
    vertexShader: `
      uniform float uTime, uStrength, uFreq, uSpeed, uPhase;
      varying vec2 vUv; varying float vShade;
      void main() {
        vUv = uv;
        vec3 p = position;
        float w = uv.x; // 0 at hoist, 1 at fly end
        float ph = uTime * uSpeed + uPhase + uv.y * 3.0;
        float wave = sin(w * uFreq + ph) * uStrength * w;
        float wave2 = sin(w * uFreq * 2.3 + ph * 1.4) * uStrength * 0.35 * w;
        p.z += wave + wave2;
        p.y += sin(w * uFreq * 0.5 + ph * 0.7) * uStrength * 0.3 * w;
        // faux cloth shading from the wave slope
        float slope = cos(w * uFreq + ph) * uStrength * uFreq * w;
        vShade = 0.78 + 0.22 * clamp(1.0 - abs(slope) * 1.4, 0.0, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D uMap; uniform float uNight;
      varying vec2 vUv; varying float vShade;
      void main() {
        vec3 c = texture2D(uMap, vUv).rgb * vShade;
        c *= mix(1.0, 0.35, uNight); // flags go dark at night like everything else
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  return mat;
}
