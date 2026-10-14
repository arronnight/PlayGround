import * as THREE from 'three';
import { clamp, smoothstep, lerp } from './utils.js';

// Sun/moon, sky dome shader, fog and exposure driven by a 0..1 day fraction.
export class Environment {
  constructor(scene, renderer) {
    this.scene = scene; this.renderer = renderer;
    this.sun = new THREE.DirectionalLight(0xffffff, 3); this.sun.castShadow = true;
    const sc = this.sun.shadow; sc.mapSize.set(2048, 2048); sc.camera.near = 1; sc.camera.far = 400; sc.camera.left = -90; sc.camera.right = 90; sc.camera.top = 90; sc.camera.bottom = -90; sc.bias = -0.0008; sc.normalBias = 0.6;
    this.sunTarget = new THREE.Object3D(); scene.add(this.sunTarget); this.sun.target = this.sunTarget; scene.add(this.sun);
    this.hemi = new THREE.HemisphereLight(0xbfd6ff, 0x5a4a3a, 1.1); scene.add(this.hemi);
    this.moon = new THREE.DirectionalLight(0x8fa6d6, 0); scene.add(this.moon);
    this.fog = new THREE.Fog(0xbfd3e6, 200, 900); scene.fog = this.fog;
    this.sunDir = new THREE.Vector3(0, 1, 0); this.fogColor = new THREE.Color(); this.skyColor = new THREE.Color();
    this.night = 0;
    // city vibe: LA smog warmth, NY steel chill, FL saturated glow. Blended into the sky/fog.
    this.vibeId = 'fable';
    this.vibes = {
      fable:   { top: new THREE.Color(0, 0, 0), horizon: new THREE.Color(0, 0, 0), fogNear: 1.0, fogFar: 1.0, exposure: 1.0, sun: [1, 1, 1] },       // baseline (baked into colours below)
      liberty: { top: new THREE.Color(-0.04, -0.02, 0.03), horizon: new THREE.Color(-0.10, -0.06, 0.02), fogNear: 1.15, fogFar: 0.9, exposure: 0.96, sun: [0.9, 0.95, 1.05] },
      vice:    { top: new THREE.Color(0.02, 0.05, 0.06), horizon: new THREE.Color(0.06, 0.10, 0.06), fogNear: 1.1, fogFar: 1.1, exposure: 1.08, sun: [1.05, 0.98, 0.92] },
    };
    this._vibeTmp = new THREE.Color();
    // sky dome
    this.uniforms = { uTop: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() }, uSunDir: { value: new THREE.Vector3() }, uSunColor: { value: new THREE.Color() }, uNight: { value: 0 }, uMoonDir: { value: new THREE.Vector3() } };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_Position = p.xyww; }`,
      fragmentShader: `uniform vec3 uTop,uHorizon,uSunDir,uSunColor,uMoonDir; uniform float uNight; varying vec3 vDir;
        float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164)))*43758.5453); }
        void main(){ vec3 d = normalize(vDir); float h = clamp(d.y, 0.0, 1.0);
          vec3 col = mix(uHorizon, uTop, pow(h, 0.55));
          float sd = max(dot(d, uSunDir), 0.0);
          col += uSunColor * (pow(sd, 6.0)*0.25 + pow(sd, 350.0)*3.0) ;
          // sun disc
          col += uSunColor * smoothstep(0.9993, 0.9996, sd) * 8.0;
          // moon
          float md = max(dot(d, uMoonDir), 0.0); col += vec3(0.8,0.85,1.0) * (smoothstep(0.9990, 0.9994, md) * 2.0 + pow(md, 60.0)*0.15) * uNight;
          // stars
          vec3 cell = floor(d * 160.0); float st = hash(cell); float star = step(0.995, st) * (0.5 + 0.5*sin(st*100.0)) * uNight * smoothstep(0.0, 0.2, d.y);
          col += vec3(star);
          gl_FragColor = vec4(col, 1.0); }`,
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(2500, 32, 16), mat); this.dome.frustumCulled = false; scene.add(this.dome);
    // cloud layer: scattered translucent puffs high up
    const cg = new THREE.BufferGeometry(); const pts = [], sz = [];
    for (let i = 0; i < 70; i++) { const a = Math.random() * 6.28, r = 500 + Math.random() * 1400; pts.push(Math.cos(a) * r, 320 + Math.random() * 120, Math.sin(a) * r); sz.push(90 + Math.random() * 160); }
    cg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); cg.setAttribute('size', new THREE.Float32BufferAttribute(sz, 1));
    const cc = document.createElement('canvas'); cc.width = 256; cc.height = 256; const ctx = cc.getContext('2d');
    for (let i = 0; i < 26; i++) { const x = 40 + Math.random() * 176, y = 100 + Math.random() * 56, r = 14 + Math.random() * 34; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.6, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256); }
    this.cloudMat = new THREE.PointsMaterial({ map: new THREE.CanvasTexture(cc), size: 420, transparent: true, opacity: 0.85, depthWrite: false, sizeAttenuation: true, color: 0xffffff, fog: false });
    this.clouds = new THREE.Points(cg, this.cloudMat); scene.add(this.clouds);
    this.buildImageBasedLight(scene, renderer);
  }

  // Image-based lighting stand-in for ray-traced speculars: a tiny procedural
  // equirect (sky gradient + sun blob + dark ground) baked once through PMREM.
  // Gives car paint, glass, chrome and wet asphalt real environment reflections
  // with correct fresnel/roughness response. Static midday env at low intensity
  // so it never overpowers the dynamic sun/sky — true per-time-of-day RT
  // reflections would need WebGPU path tracing, which WebGL can't do.
  buildImageBasedLight(scene, renderer) {
    const W = 128, H = 64; const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.52);
    sky.addColorStop(0, '#3a6ea8'); sky.addColorStop(0.7, '#9fc3e8'); sky.addColorStop(1, '#dfe9f2');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.52);
    const gnd = ctx.createLinearGradient(0, H * 0.52, 0, H);
    gnd.addColorStop(0, '#6a6255'); gnd.addColorStop(1, '#23211c');
    ctx.fillStyle = gnd; ctx.fillRect(0, H * 0.52, W, H * 0.48);
    const sun = ctx.createRadialGradient(W * 0.62, H * 0.2, 0, W * 0.62, H * 0.2, 16);
    sun.addColorStop(0, 'rgba(255,252,240,1)'); sun.addColorStop(0.25, 'rgba(255,244,220,0.8)'); sun.addColorStop(1, 'rgba(255,244,220,0)');
    ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H * 0.52);
    const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(t).texture;
    scene.environmentIntensity = 0.4;
    t.dispose(); pmrem.dispose();
  }

  setVibe(id) { this.vibeId = this.vibes[id] ? id : 'fable'; }

  update(dayFrac, focus) {
    const ang = (dayFrac - 0.25) * Math.PI * 2; // 0.25 sunrise, 0.5 noon, 0.75 sunset
    const el = Math.sin(ang); const az = Math.cos(ang);
    this.sunDir.set(az * 0.7, el, -0.4 + az * 0.2).normalize();
    const night = this.night = 1 - smoothstep(-0.18, 0.1, el);
    const dusk = 1 - smoothstep(0.0, 0.35, Math.abs(el)); // orange band around sunrise/sunset
    const day = smoothstep(-0.1, 0.25, el);
    // colours
    const top = new THREE.Color().setRGB(lerp(0.02, 0.22, day), lerp(0.03, 0.45, day), lerp(0.08, 0.85, day));
    top.lerp(new THREE.Color(0.35, 0.28, 0.5), dusk * 0.5 * (1 - night));
    const horizon = new THREE.Color().setRGB(lerp(0.05, 0.75, day), lerp(0.06, 0.82, day), lerp(0.12, 0.92, day));
    horizon.lerp(new THREE.Color(1.0, 0.55, 0.25), dusk * 0.85 * (1 - night * 0.7));
    const sunColor = new THREE.Color().setRGB(1, lerp(0.45, 0.95, day), lerp(0.2, 0.85, day));
    // city vibe blend (LA baseline; NY cooler/denser air; FL warmer, brighter, hazier horizon)
    const V = this.vibes[this.vibeId] || this.vibes.fable;
    top.add(this._vibeTmp.copy(V.top).multiplyScalar(day));
    horizon.add(this._vibeTmp.copy(V.horizon).multiplyScalar(day));
    sunColor.setRGB(
      clamp(sunColor.r * V.sun[0], 0, 1.2),
      clamp(sunColor.g * V.sun[1], 0, 1.2),
      clamp(sunColor.b * V.sun[2], 0, 1.2));
    this.uniforms.uTop.value.copy(top); this.uniforms.uHorizon.value.copy(horizon); this.uniforms.uSunDir.value.copy(this.sunDir); this.uniforms.uSunColor.value.copy(sunColor).multiplyScalar(el > -0.05 ? 1 : 0); this.uniforms.uNight.value = night;
    this.uniforms.uMoonDir.value.copy(this.sunDir).negate();
    this.sun.color.copy(sunColor); this.sun.intensity = 3.2 * smoothstep(-0.02, 0.2, el);
    this.sun.position.copy(this.sunDir).multiplyScalar(180).add(focus); this.sunTarget.position.copy(focus);
    this.moon.intensity = 0.8 * night; this.moon.position.copy(this.sunDir).multiplyScalar(-150).add(focus); this.moon.target = this.sunTarget;
    this.hemi.color.copy(top).lerp(new THREE.Color(0.9, 0.95, 1), 0.4 * day); this.hemi.groundColor.setRGB(0.35, 0.3, 0.25).multiplyScalar(lerp(0.45, 1, day)); this.hemi.intensity = lerp(0.55, 1.25, day);
    this.fogColor.copy(horizon).lerp(top, 0.35); this.fog.color.copy(this.fogColor); this.fog.near = lerp(120, 220, day) * V.fogNear; this.fog.far = lerp(600, 950, day) * V.fogFar;
    this.skyColor.copy(top);
    this.cloudMat.color.copy(new THREE.Color(1, 1, 1).lerp(new THREE.Color(0.15, 0.15, 0.25), night)).lerp(new THREE.Color(1, 0.6, 0.4), dusk * 0.6 * (1 - night)); this.cloudMat.opacity = 0.9;
    this.renderer.toneMappingExposure = lerp(0.9, 1.15, day) * V.exposure;
    return night;
  }
}
