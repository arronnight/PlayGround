// Procedural skate-spot textures. Everything is generated on canvas at load:
// no image files, no network, fully offline. Tileable 256px patterns.
import * as THREE from 'three';

function canvas(sz = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = sz;
  return [c, c.getContext('2d')];
}
function speckle(g, sz, n, cols, aMax, sMax = 2) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = cols[(Math.random() * cols.length) | 0];
    g.globalAlpha = Math.random() * aMax;
    const s = 1 + Math.random() * sMax;
    g.fillRect(Math.random() * sz, Math.random() * sz, s, s);
  }
  g.globalAlpha = 1;
}
const painters = {
  // big poured slabs: joints + speckle + faint stains
  concrete(g, sz) {
    g.fillStyle = '#9aa3ad'; g.fillRect(0, 0, sz, sz);
    speckle(g, sz, 1600, ['#aeb7c0', '#8b939c', '#c2c9d1'], 0.16);
    for (let i = 0; i < 5; i++) {
      g.fillStyle = 'rgba(70,75,82,0.10)';
      g.beginPath();
      g.ellipse(Math.random() * sz, Math.random() * sz, 20 + Math.random() * 40, 12 + Math.random() * 24, Math.random() * 3, 0, 7);
      g.fill();
    }
    g.strokeStyle = 'rgba(52,58,64,0.55)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, 2); g.lineTo(sz, 2); g.moveTo(2, 0); g.lineTo(2, sz); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, 5); g.lineTo(sz, 5); g.moveTo(5, 0); g.lineTo(5, sz); g.stroke();
  },
  // power-trowelled park concrete: smooth, glassy, faint trowel arcs
  park(g, sz) {
    g.fillStyle = '#a8b0b8'; g.fillRect(0, 0, sz, sz);
    speckle(g, sz, 900, ['#b7bec6', '#99a1a9'], 0.10);
    g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 5;
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.arc(Math.random() * sz, Math.random() * sz, 40 + Math.random() * 60, Math.random() * 3, Math.random() * 2 + 1);
      g.stroke();
    }
  },
  // asphalt: dark + dense aggregate
  asphalt(g, sz) {
    g.fillStyle = '#262a31'; g.fillRect(0, 0, sz, sz);
    speckle(g, sz, 2400, ['#3a4048', '#17191d', '#4a5058'], 0.35);
  },
  // brick courses with mortar
  brick(g, sz) {
    g.fillStyle = '#8a7f74'; g.fillRect(0, 0, sz, sz);
    const bh = sz / 8, bw = sz / 4;
    for (let y = 0, row = 0; y < sz; y += bh, row++) {
      for (let x = -bw; x < sz + bw; x += bw) {
        const ox = (row % 2) * bw / 2;
        const v = 100 + Math.random() * 26;
        g.fillStyle = `rgb(${v + 12},${v * 0.62},${v * 0.5})`;
        g.fillRect(x + ox + 2, y + 2, bw - 4, bh - 4);
      }
    }
    speckle(g, sz, 500, ['#00000055', '#ffffff33'], 0.12);
  },
  // bleached painted brick
  brick2(g, sz) {
    g.fillStyle = '#9aa0a8'; g.fillRect(0, 0, sz, sz);
    const bh = sz / 8, bw = sz / 4;
    for (let y = 0, row = 0; y < sz; y += bh, row++) {
      for (let x = -bw; x < sz + bw; x += bw) {
        const ox = (row % 2) * bw / 2;
        const v = 150 + Math.random() * 22;
        g.fillStyle = `rgb(${v},${v},${v + 4})`;
        g.fillRect(x + ox + 2, y + 2, bw - 4, bh - 4);
      }
    }
    speckle(g, sz, 400, ['#00000044'], 0.10);
  },
  // diamond tread plate
  metal(g, sz) {
    g.fillStyle = '#5c636c'; g.fillRect(0, 0, sz, sz);
    speckle(g, sz, 700, ['#6e757f', '#4a5058'], 0.25);
    g.strokeStyle = 'rgba(220,228,236,0.35)'; g.lineWidth = 2;
    for (let y = 8; y < sz; y += 24) {
      for (let x = 8; x < sz; x += 24) {
        g.beginPath();
        g.moveTo(x - 5, y + 4); g.lineTo(x + 5, y - 4);
        g.moveTo(x - 5, y - 4); g.lineTo(x + 5, y + 4);
        g.stroke();
      }
    }
  },
  // wood planks with grain
  wood(g, sz) {
    g.fillStyle = '#8a5a33'; g.fillRect(0, 0, sz, sz);
    for (let p = 0; p < 4; p++) {
      const y0 = p * sz / 4;
      g.fillStyle = `rgba(${120 + Math.random() * 30},${80 + Math.random() * 20},${40 + Math.random() * 14},0.5)`;
      g.fillRect(0, y0, sz, sz / 4);
      g.fillStyle = 'rgba(40,22,10,0.7)'; g.fillRect(0, y0, sz, 2);
      g.strokeStyle = 'rgba(60,35,15,0.35)'; g.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        g.beginPath();
        const yy = y0 + 6 + Math.random() * 52;
        g.moveTo(0, yy);
        g.bezierCurveTo(sz * 0.3, yy + 4, sz * 0.6, yy - 4, sz, yy);
        g.stroke();
      }
    }
  },
  // grass speckle
  grass(g, sz) {
    g.fillStyle = '#2f6b3a'; g.fillRect(0, 0, sz, sz);
    speckle(g, sz, 2200, ['#3f8548', '#245226', '#57a05e'], 0.4);
  },
  // scored sidewalk panels: joints grid + gum spots + stains
  sidewalk(g, sz) {
    g.fillStyle = '#a3abb3'; g.fillRect(0, 0, sz, sz);
    speckle(g, sz, 1500, ['#b3bac1', '#9299a1'], 0.14);
    g.strokeStyle = 'rgba(52,58,64,0.6)'; g.lineWidth = 4;
    const cell = sz / 2;
    for (let i = 0; i <= 2; i++) {
      g.beginPath(); g.moveTo(i * cell, 0); g.lineTo(i * cell, sz); g.stroke();
      g.beginPath(); g.moveTo(0, i * cell); g.lineTo(sz, i * cell); g.stroke();
    }
    for (let i = 0; i < 28; i++) { // gum
      g.fillStyle = 'rgba(40,40,42,0.5)';
      g.beginPath();
      g.arc(Math.random() * sz, Math.random() * sz, 2 + Math.random() * 3, 0, 7);
      g.fill();
    }
  },
  // night facade: dark concrete + grid of windows, some lit
  windows(g, sz) {
    g.fillStyle = '#3d4149'; g.fillRect(0, 0, sz, sz);
    speckle(g, sz, 600, ['#454a53', '#34383f'], 0.2);
    const cols = 6, rows = 6, cw = sz / cols, rh = sz / rows;
    for (let cx = 0; cx < cols; cx++) {
      for (let cy = 0; cy < rows; cy++) {
        const lit = Math.random() < 0.35;
        g.fillStyle = lit ? '#ffd489' : '#14181f';
        g.fillRect(cx * cw + cw * 0.22, cy * rh + rh * 0.2, cw * 0.56, rh * 0.6);
        if (lit && Math.random() < 0.5) { // half-drawn blind
          g.fillStyle = '#14181f';
          g.fillRect(cx * cw + cw * 0.22, cy * rh + rh * 0.2, cw * 0.56, rh * 0.3);
        }
        g.strokeStyle = 'rgba(20,22,26,0.9)'; g.lineWidth = 2;
        g.strokeRect(cx * cw + cw * 0.22, cy * rh + rh * 0.2, cw * 0.56, rh * 0.6);
      }
    }
  },
  // packed dirt / worn ground
  dirt(g, sz) {
    g.fillStyle = '#5d4f3c'; g.fillRect(0, 0, sz, sz);
    speckle(g, sz, 2000, ['#6e5f47', '#4a3f30', '#7d6c52'], 0.3);
    for (let i = 0; i < 6; i++) {
      g.fillStyle = 'rgba(60,50,38,0.25)';
      g.beginPath();
      g.ellipse(Math.random() * sz, Math.random() * sz, 24 + Math.random() * 40, 14 + Math.random() * 20, Math.random() * 3, 0, 7);
      g.fill();
    }
  },
};

export const TX = {
  tex(kind, rx = 1, ry = 1) {
    const [c, g] = canvas();
    (painters[kind] || painters.concrete)(g, c.width);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  },
  mat(kind, o = {}) {
    const { rx = 1, ry = 1, rough = 0.9, metal = 0.02, color = 0xffffff } = o;
    return new THREE.MeshStandardMaterial({
      map: TX.tex(kind, rx, ry), color, roughness: rough, metalness: metal,
    });
  },
};
