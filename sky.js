// Gradient sky dome with sun/moon disc. One mesh, zero lights, no fog.
import * as THREE from 'three';

let skyMesh = null;
let skyMat = null;

export function initSky(scene) {
  if (skyMesh) return;
  const geo = new THREE.SphereGeometry(420, 24, 16);
  skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x2f6fc4) },
      horizonColor: { value: new THREE.Color(0xe8d9b8) },
      bottomColor: { value: new THREE.Color(0x3a3f45) },
      sunDir: { value: new THREE.Vector3(0, 1, 0) },
      sunColor: { value: new THREE.Color(0xfff2dd) },
      sunSize: { value: 0.9993 },
    },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 topColor, horizonColor, bottomColor, sunColor, sunDir;
      uniform float sunSize;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        vec3 col;
        if (d.y >= 0.0) col = mix(horizonColor, topColor, pow(d.y, 0.55));
        else col = mix(horizonColor, bottomColor, pow(-d.y, 0.6));
        float s = max(dot(d, normalize(sunDir)), 0.0);
        col += sunColor * (pow(s, 1200.0) * 1.2 + pow(s, 24.0) * 0.18);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  skyMesh = new THREE.Mesh(geo, skyMat);
  skyMesh.frustumCulled = false;
  skyMesh.renderOrder = -10;
  scene.add(skyMesh);
}

export function setSky(o = {}) {
  if (!skyMat) return;
  if (o.top) skyMat.uniforms.topColor.value.set(o.top);
  if (o.horizon) skyMat.uniforms.horizonColor.value.set(o.horizon);
  if (o.bottom) skyMat.uniforms.bottomColor.value.set(o.bottom);
  if (o.sunDir) skyMat.uniforms.sunDir.value.copy(o.sunDir).normalize();
  if (o.sunColor) skyMat.uniforms.sunColor.value.set(o.sunColor);
  if (o.sunSize != null) skyMat.uniforms.sunSize.value = o.sunSize;
}

export function skyFollows(camera) {
  if (skyMesh) skyMesh.position.copy(camera.position);
}
