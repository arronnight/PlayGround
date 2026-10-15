/* SMW full-frame vision: finds the player, enemies, key/keyhole, goal.
 *
 * The emulator renders via WebGL (canvas readback is black), so this works on
 * ImageData decoded from the core framebuffer screenshot (full 256x224-ish
 * pixels, not the 64x64 thumbnail). Pipeline per frame:
 *   pixels -> color-class mask -> connected components -> classify blobs
 * Player = red (Mario) or green (Luigi) cap + skin adjacency, tracked across
 * frames by position continuity. Enemies = signature-colored blobs that are
 * not the player, classified by color mix + shape + height. Key (big yellow),
 * keyhole (dark slot), goal gate (tall brown/dark posts) feed exit-seeking.
 * Terrain (wall/pit) is sampled in boxes anchored to the PLAYER, not the
 * screen centre. Deaths are inferred from track-loss + fade; cause is guessed
 * from the last live observation (enemy near? pit ahead? lava below?).
 */
(function () {
  'use strict';

  // Bitmask color classes.
  var C_RED = 1, C_GREEN = 2, C_SKIN = 4, C_BROWN = 8, C_ORANGE = 16,
      C_YELLOW = 32, C_WHITE = 64, C_DARK = 128;

  function classify(r, g, b) {
    var m = 0;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    // Mario red / enemy red: strong R, weak B, and NOT yellow (g << r).
    // The g < r*0.72 cut keeps key-yellow/coin-yellow out of the red class.
    if (r > 150 && r - b > 90 && g < r - 20 && g < r * 0.72) m |= C_RED;
    // Greens: Luigi cap, Koopa skin, Rex...: strong G, weak R and B.
    if (g > 120 && g - r > 40 && g - b > 30) m |= C_GREEN;
    // Skin/peach: bright, R top, warm.
    if (r > 200 && g > 150 && g < 235 && b > 120 && b < 210 && r - b > 40) m |= C_SKIN;
    // Goomba brown: mid R, low G/B.
    if (r > 110 && r < 200 && g > 50 && g < 120 && b < 90 && r - g > 40) m |= C_BROWN;
    // Rex orange / lava orange: high R+G, low B.
    if (r > 200 && g > 110 && g < 200 && b < 110) m |= C_ORANGE;
    // Key/coin yellow: bright R+G, dark B.
    if (r > 200 && g > 180 && b < 110) m |= C_YELLOW;
    // White: popups, shells, spots.
    if (r > 225 && g > 225 && b > 225) m |= C_WHITE;
    // Dark: keyhole, buzzy, outlines.
    if (mx < 70) m |= C_DARK;
    return m;
  }

  // Connected components on a predicate over the class map. Predicate gets
  // (classBits, pixelIndex). Returns blobs.
  function blobs(cls, w, h, pred, minArea, maxArea) {
    var seen = new Uint8Array(w * h);
    var out = [];
    var stack = [];
    for (var i = 0; i < w * h; i++) {
      if (seen[i] || !pred(cls[i], i)) continue;
      var x0 = w, y0 = h, x1 = -1, y1 = -1, n = 0;
      var hist = {};
      stack.length = 0; stack.push(i); seen[i] = 1;
      while (stack.length) {
        var p = stack.pop();
        var px = p % w, py = (p / w) | 0;
        if (px < x0) x0 = px; if (px > x1) x1 = px;
        if (py < y0) y0 = py; if (py > y1) y1 = py;
        n++;
        var c = cls[p];
        hist[c] = (hist[c] || 0) + 1;
        if (n > maxArea * 2) break; // runaway guard (huge background region)
        if (px > 0 && !seen[p - 1] && pred(cls[p - 1], p - 1)) { seen[p - 1] = 1; stack.push(p - 1); }
        if (px < w - 1 && !seen[p + 1] && pred(cls[p + 1], p + 1)) { seen[p + 1] = 1; stack.push(p + 1); }
        if (py > 0 && !seen[p - w] && pred(cls[p - w], p - w)) { seen[p - w] = 1; stack.push(p - w); }
        if (py < h - 1 && !seen[p + w] && pred(cls[p + w], p + w)) { seen[p + w] = 1; stack.push(p + w); }
      }
      if (n >= minArea && n <= maxArea) {
        out.push({ x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1, area: n, hist: hist });
      }
    }
    return out;
  }

  // Terrain surface per column: first terrain-colored pixel from the bottom.
  // Median-filtered over a wide window so narrow sprites standing on the
  // ground (goombas, koopas) don't warp it, while wide ground/hills survive.
  // Sprite blobs are only allowed strictly above/level-with the surface, so
  // enemies never merge into the ground they stand on. Void columns (pit to
  // the frame bottom) report h.
  var C_GROUND = C_BROWN | C_ORANGE | C_RED | C_GREEN | C_YELLOW;
  function groundTops(cls, w, h) {
    var raw = new Int16Array(w);
    for (var x = 0; x < w; x++) {
      var t = h;
      for (var y = h - 1; y >= 0; y--) {
        if ((cls[y * w + x] & C_GROUND) !== 0) t = y; else break;
      }
      raw[x] = t;
    }
    var tops = new Int16Array(w);
    for (var i = 0; i < w; i++) {
      var lo = Math.max(0, i - 24), hi = Math.min(w - 1, i + 24);
      var win = [];
      for (var j = lo; j <= hi; j++) win.push(raw[j]);
      win.sort(function (a, b) { return a - b; });
      tops[i] = win[win.length >> 1];
    }
    return tops;
  }

  function has(b, bit) {
    for (var k in b.hist) { if ((k & bit) !== 0) return true; }
    return false;
  }
  function count(b, bit) {
    var s = 0;
    for (var k in b.hist) { if ((k & bit) !== 0) s += b.hist[k]; }
    return s;
  }

  function Vision() {
    this.reset();
  }
  Vision.prototype.reset = function () {
    this.player = null;      // {x,y,w,h,char,conf,vx,vy}
    this.lostFrames = 0;
    this.worldX = 0;         // accumulated camera scroll + player offset
    this.whiteAvg = 0;
    this.lastObs = null;
    this.tracks = [];        // enemy blob tracks for the static-decor filter
    this.prevMotion = null;  // 64x56 gray grid for the motion channel
  };

  // Motion channel: coarse 64x56 frame differencing. Catches anything that
  // MOVES (walking koopas, flying enemies, spinies, moving platforms) even
  // when its colors fool the signature classifier. HUD strip excluded —
  // the timer/score digits animate constantly and are not gameplay.
  var MGW = 64, MGH = 56;
  Vision.prototype.motionRegions = function (d, w, h) {
    var gw = MGW, gh = MGH;
    // store RGB per cell: motion = max channel change (isoluminant swaps
    // like gray-on-blue are invisible to luminance-only differencing).
    var cur = new Float32Array(gw * gh * 3);
    var sx = w / gw, sy = h / gh;
    for (var gy = 0; gy < gh; gy++) {
      for (var gx = 0; gx < gw; gx++) {
        var px = Math.min(w - 1, (gx * sx) | 0), py = Math.min(h - 1, (gy * sy) | 0);
        var o = (py * w + px) * 4, q = (gy * gw + gx) * 3;
        cur[q] = d[o] / 255; cur[q + 1] = d[o + 1] / 255; cur[q + 2] = d[o + 2] / 255;
      }
    }
    var self = this;
    function cellDiff(i, shift) {
      // compare cur cell i against prev cell i-shift (camera compensation)
      var j = i - shift;
      if (j < 0 || j >= gw * gh) return 1;
      var q = i * 3, r = j * 3;
      var dr = Math.abs(cur[q] - self.prevMotion[r]);
      var dg = Math.abs(cur[q + 1] - self.prevMotion[r + 1]);
      var db = Math.abs(cur[q + 2] - self.prevMotion[r + 2]);
      return Math.max(dr, dg, db);
    }
    var regions = [], moving = 0;
    if (!this.prevMotion) { this.prevMotion = cur; return { regions: regions, anim: 0 }; }
    var skipRows = Math.floor(gh * 0.16); // HUD band
    // camera shift: the whole background slides while running — estimate it
    // on a coarse sample so genuine movers still stand out after compensation
    var bestShift = 0, bestCost = Infinity;
    for (var s = -6; s <= 6; s++) {
      var cost = 0, cnt = 0;
      for (var ci = s < 0 ? -s : 0; ci < gw * gh; ci += 2) {
        var crow = (ci / gw) | 0;
        if (crow < skipRows) continue;
        var cj = ci - s;
        if (cj < 0 || cj >= gw * gh) continue;
        var cq = (cj / gw) | 0;
        if (cq < skipRows) continue;
        cost += cellDiff(ci, s); cnt++;
      }
      cost = cnt ? cost / cnt : Infinity;
      if (cost < bestCost) { bestCost = cost; bestShift = s; }
    }
    // cost at zero shift for reference
    var zeroCost = 0, zcnt = 0;
    for (var zi = 0; zi < gw * gh; zi += 2) {
      if (((zi / gw) | 0) < skipRows) continue;
      zeroCost += cellDiff(zi, 0); zcnt++;
    }
    zeroCost = zcnt ? zeroCost / zcnt : 0;
    var shift = (bestCost < zeroCost * 0.85) ? bestShift : 0;
    function moved(i) { return cellDiff(i, shift) >= 0.10; }
    var seen = new Uint8Array(gw * gh);
    var stack = [];
    for (var i = 0; i < gw * gh; i++) {
      var cy = (i / gw) | 0;
      if (cy < skipRows) continue;
      if (seen[i]) continue;
      if (!moved(i)) continue;
      // flood a moving cluster
      var x0 = gw, y0 = gh, x1 = -1, y1 = -1, n = 0;
      stack.length = 0; stack.push(i); seen[i] = 1;
      while (stack.length) {
        var p = stack.pop();
        var qx = p % gw, qy = (p / gw) | 0;
        if (qx < x0) x0 = qx; if (qx > x1) x1 = qx;
        if (qy < y0) y0 = qy; if (qy > y1) y1 = qy;
        n++; moving++;
        if (n > 400) break;
        var nb = [p - 1, p + 1, p - gw, p + gw];
        for (var bi = 0; bi < 4; bi++) {
          var q = nb[bi];
          if (q < 0 || q >= gw * gh || seen[q]) continue;
          var qxx = q % gw, qyy = (q / gw) | 0;
          if (Math.abs(qx - qxx) + Math.abs(qy - qyy) !== 1) continue;
          if (qyy < skipRows) continue;
          if (!moved(q)) continue;
          seen[q] = 1; stack.push(q);
        }
      }
      if (n >= 2) {
        regions.push({
          x: (x0 + x1 + 1) / 2 * sx, y: (y0 + y1 + 1) / 2 * sy,
          w: (x1 - x0 + 1) * sx, h: (y1 - y0 + 1) * sy, cells: n
        });
      }
    }
    this.prevMotion = cur;
    return { regions: regions, anim: moving / (gw * gh) };
  };

  Vision.prototype.analyze = function (img) {
    var w = img.width, h = img.height, d = img.data;
    var n = w * h;
    var cls = new Uint8Array(n);
    var bright = 0;
    for (var i = 0; i < n; i++) {
      var c = classify(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
      cls[i] = c;
      bright += (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / (3 * 255);
    }
    bright /= n;

    var obs = { w: w, h: h, brightness: bright, player: null, enemies: [],
      key: null, keyhole: null, goal: null, wallAhead: false, pitAhead: false,
      wallTall: false, gapW: 0, needUp: false, downOpen: false, ceiling: false,
      anim: 0, motionRegions: [],
      whiteBurst: 0, fade: bright < 0.08 };

    // motion first (needs no other state; updates prev grid every frame)
    var mo = this.motionRegions(d, w, h);
    obs.anim = mo.anim;
    obs.motionRegions = mo.regions;

    // terrain surface first: sprite blobs live above it, never inside it
    var tops = groundTops(cls, w, h);
    obs.tops = tops;
    function open(c, i) {
      // strictly above the surface: the surface row itself is terrain, so a
      // full-width ground edge can never become a "sprite"
      var x = i % w;
      return (((i / w) | 0) < tops[x]);
    }

    // ---- player: red/green cap colors + skin (never terrain) ----
    var cands = blobs(cls, w, h, function (c, i) {
      return open(c, i) && (c & (C_RED | C_GREEN | C_SKIN)) !== 0;
    }, 25, 1200);
    var best = null, bestScore = -1e9;
    for (var ci = 0; ci < cands.length; ci++) {
      var b = cands[ci];
      if (b.w > 44 || b.h > 44) continue; // nobody is that wide (not even Yoshi)
      var skin = count(b, C_SKIN), rg = count(b, C_RED) + count(b, C_GREEN);
      if (skin < 3) continue; // a face is required: kills ground edges, keys, hills
      var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      var score = skin * 2 + rg;
      if (this.player) {
        var px = this.player.x + this.player.vx, py = this.player.y + this.player.vy;
        var dist = Math.abs(cx - px) + Math.abs(cy - py);
        score -= dist * 3; // continuity wins
      } else {
        score -= Math.abs(cx - w * 0.4) * 0.2; // spawn bias: left-of-centre
      }
      if (score > bestScore) { bestScore = score; best = b; }
    }
    if (best) {
      var reds = count(best, C_RED), greens = count(best, C_GREEN);
      var ch = reds >= greens ? 'mario' : 'luigi';
      var nx = best.x + best.w / 2, ny = best.y + best.h / 2;
      var vx = 0, vy = 0;
      if (this.player) { vx = nx - this.player.x; vy = ny - this.player.y; }
      this.player = { x: nx, y: ny, w: best.w, h: best.h, char: ch,
        conf: Math.min(1, bestScore / 120), vx: vx, vy: vy };
      this.lostFrames = 0;
      obs.player = this.player;
    } else {
      this.lostFrames++;
      obs.playerLost = this.lostFrames;
    }

    // ---- key (big yellow), keyhole (dark slot), goal (tall brown/dark) ----
    // detected BEFORE enemies so those regions can be excluded from threats
    var keys = blobs(cls, w, h, function (c, i) { return open(c, i) && (c & C_YELLOW) !== 0; }, 120, 900);
    if (keys.length) {
      keys.sort(function (a, b) { return b.area - a.area; });
      var k = keys[0];
      obs.key = { x: k.x + k.w / 2, y: k.y + k.h / 2, w: k.w, h: k.h };
    }
    var holes = blobs(cls, w, h, function (c, i) { return open(c, i) && (c & C_DARK) !== 0; }, 90, 600);
    for (var hi = 0; hi < holes.length; hi++) {
      var hb = holes[hi];
      if (hb.h > hb.w * 1.3) {
        obs.keyhole = { x: hb.x + hb.w / 2, y: hb.y + hb.h / 2, w: hb.w, h: hb.h };
        break;
      }
    }
    var posts = blobs(cls, w, h, function (c, i) { return open(c, i) && (c & (C_BROWN | C_DARK)) !== 0; }, 200, 4000);
    for (var gi = 0; gi < posts.length; gi++) {
      var g = posts[gi];
      if (g.h > h * 0.22 && g.h > g.w * 2) {
        obs.goal = { x: g.x + g.w / 2, y: g.y + g.h / 2, w: g.w, h: g.h };
        break;
      }
    }
    // pipes: tall NARROW green tubes (enter with DOWN standing on/near one).
    // Hills are green too but wide — width cap keeps them out.
    obs.pipes = [];
    var tubes = blobs(cls, w, h, function (c, i) { return open(c, i) && (c & C_GREEN) !== 0; }, 150, 3000);
    for (var pi = 0; pi < tubes.length; pi++) {
      var tb = tubes[pi];
      if (tb.w < 42 && tb.h > tb.w * 1.8 && tb.h > h * 0.12) {
        obs.pipes.push({ x: tb.x + tb.w / 2, y: tb.y + tb.h / 2, w: tb.w, h: tb.h,
          top: tb.y });
        if (obs.pipes.length >= 3) break;
      }
    }
    function inBox(x, y, o, pad) {
      return o && x > o.x - o.w / 2 - pad && x < o.x + o.w / 2 + pad &&
             y > o.y - o.h / 2 - pad && y < o.y + o.h / 2 + pad;
    }
    function inPipes(x, y, pad) {
      for (var qi = 0; qi < obs.pipes.length; qi++) {
        if (inBox(x, y, obs.pipes[qi], pad)) return true;
      }
      return false;
    }

    // ---- enemies: signature colors, excluding the player box ----
    // Strict above-surface rule is load-bearing: it is what separates a
    // goomba from the brown ground it stands on (flood from a relaxed band
    // merges the whole ground strip into one giant rejected blob). Grounded
    // sprites still show their above-surface rows; motion fusion catches the
    // rest.
    var pl = this.player;
    function isPlayerZone(x, y) {
      if (!pl) return false;
      return x > pl.x - pl.w && x < pl.x + pl.w && y > pl.y - pl.h * 1.2 && y < pl.y + pl.h * 1.2;
    }
    var eblobs = blobs(cls, w, h, function (c, i) {
      return open(c, i) && (c & (C_BROWN | C_ORANGE | C_RED | C_GREEN | C_YELLOW | C_WHITE | C_DARK)) !== 0;
    }, 25, 1100);
    for (var ei = 0; ei < eblobs.length; ei++) {
      var e = eblobs[ei];
      if (e.w > 48 || e.h > 48) continue; // no enemy is that big (pipes excluded by area)
      var ex = e.x + e.w / 2, ey = e.y + e.h / 2;
      if (isPlayerZone(ex, ey)) continue;
      if (inBox(ex, ey, obs.key, 3) || inBox(ex, ey, obs.keyhole, 3) || inBox(ex, ey, obs.goal, 4)) continue;
      if (inPipes(ex, ey, 2)) continue;
      if (pl && Math.abs(ex - pl.x) + Math.abs(ey - pl.y) > 130) {
        // far blobs are usually scenery; keep only near-field threats
        continue;
      }
      var type = 'walker', threat = 1;
      var nBrown = count(e, C_BROWN), nOrange = count(e, C_ORANGE),
          nGreen = count(e, C_GREEN), nRed = count(e, C_RED),
          nWhite = count(e, C_WHITE), nDark = count(e, C_DARK),
          nYellow = count(e, C_YELLOW);
      if (nYellow > e.area * 0.5 && e.area < 120) { type = 'coin'; threat = 0; }
      else if ((nOrange + nYellow) > e.area * 0.45 && e.w > 8 && e.h > 8 &&
               Math.abs(e.w - e.h) < 7 && (e.y + e.h / 2) < h * 0.78) { type = 'block'; threat = 1; }
      else if (nBrown > e.area * 0.35) { type = 'goomba'; threat = 2; }
      else if (nOrange > e.area * 0.35) { type = 'rex'; threat = 2; }
      // powerup mushroom: red cap + white spots, WIDER than tall, low near
      // the ground. Must precede spiny (red+white) or lunch reads as lethal.
      else if (nRed > e.area * 0.2 && nWhite > 6 && e.w > e.h &&
               e.area > 50 && e.area < 320 && (e.y + e.h / 2) > h * 0.45) { type = 'shroom'; threat = 0; }
      else if (nGreen > e.area * 0.25 && nWhite > 4) { type = 'koopa'; threat = 2; }
      else if (nRed > e.area * 0.3 && nWhite > 4) { type = 'spiny'; threat = 3; }
      else if (nRed > e.area * 0.3 && nGreen > 4 && e.h > e.w) { type = 'piranha'; threat = 3; }
      else if (nDark > e.area * 0.4 && nWhite > 3) { type = 'buzzy'; threat = 2; }
      else if (nDark > e.area * 0.6) { continue; } // outlines/text, skip
      else if (nWhite > e.area * 0.4 && e.area < 90 && ey > h * 0.45) { type = 'shell'; threat = 1; }
      var air = pl ? (ey < pl.y - pl.h) : false;
      if (air && threat > 0 && (type === 'walker')) { type = 'flyer'; threat = 2; }
      var dist = pl ? (Math.abs(ex - pl.x) + Math.abs(ey - pl.y)) : 999;
      obs.enemies.push({ x: ex, y: ey, w: e.w, h: e.h, type: type,
        threat: threat, dist: dist, air: air });
    }
    // ---- motion fusion: anything MOVING that color vision missed ----
    // (Camera scrolls light the whole grid — anim>0.25 means scroll/cut, so
    // only fuse small regions on a still camera: exactly when a walker or
    // flyer would otherwise hide against the background.)
    if (obs.anim < 0.25) {
      for (var mi = 0; mi < mo.regions.length; mi++) {
        var mr = mo.regions[mi];
        if (mr.w > 48 || mr.h > 48 || mr.cells > 40) continue;
        if (isPlayerZone(mr.x, mr.y)) continue;
        if (inBox(mr.x, mr.y, obs.key, 3) || inBox(mr.x, mr.y, obs.keyhole, 3) || inBox(mr.x, mr.y, obs.goal, 4)) continue;
        var dup = false;
        for (var di = 0; di < obs.enemies.length; di++) {
          var de = obs.enemies[di];
          if (Math.abs(de.x - mr.x) + Math.abs(de.y - mr.y) < 16) { dup = true; break; }
        }
        if (dup) continue;
        // color-guess the mover from its centre pixel
        var mpx = Math.max(0, Math.min(w - 1, mr.x | 0)),
            mpy = Math.max(0, Math.min(h - 1, mr.y | 0));
        var mcc = cls[mpy * w + mpx];
        var mtype = 'mover';
        if ((mcc & C_BROWN) !== 0) mtype = 'goomba';
        else if ((mcc & C_ORANGE) !== 0) mtype = 'rex';
        else if ((mcc & C_GREEN) !== 0) mtype = 'koopa';
        else if ((mcc & C_RED) !== 0) mtype = 'spiny';
        else if ((mcc & C_WHITE) !== 0) mtype = 'shell';
        var mdist = pl ? (Math.abs(mr.x - pl.x) + Math.abs(mr.y - pl.y)) : 999;
        if (pl && mdist > 130) continue; // near-field threats only
        obs.enemies.push({ x: mr.x, y: mr.y, w: mr.w, h: mr.h, type: mtype,
          threat: 2, dist: mdist, air: false, motion: true });
      }
    }
    obs.enemies.sort(function (a, b) { return (b.threat * 100 - b.dist) - (a.threat * 100 - a.dist); });
    obs.enemies = obs.enemies.slice(0, 8);

    // static-decor filter: real enemies move; fruit, signs and bushes don't.
    // Matched by screen proximity across frames; demoted after ~1.2s still.
    // Piranha plants and spike-tops are genuinely static threats: exempt.
    // (While the camera scrolls, everything shifts, so nothing is demoted
    // mid-run — the filter only bites when Mario stands still.)
    var STATIC_OK = { piranha: 1, spiny: 1 };
    var kept = [];
    for (var ti = 0; ti < obs.enemies.length; ti++) {
      var te = obs.enemies[ti], found = null;
      for (var tj = 0; tj < this.tracks.length; tj++) {
        var tr = this.tracks[tj];
        if (Math.abs(tr.x - te.x) + Math.abs(tr.y - te.y) < 12) { found = tr; break; }
      }
      if (found) { found.x = te.x; found.y = te.y; found.n++; }
      else { found = { x: te.x, y: te.y, n: 1 }; this.tracks.push(found); }
      te.still = found.n;
      if (found.n > 10 && !STATIC_OK[te.type]) { te.type = 'decor'; te.threat = 0; }
      kept.push(found);
    }
    this.tracks = kept.slice(-24);

    // ---- terrain anchored to the player ----
    if (pl) {
      var dir = 1; // progress is rightward; scan ahead of motion/facing
      var ax0 = Math.max(0, ((pl.x + dir * (pl.w * 0.8)) | 0)),
          ax1 = Math.min(w - 1, ((pl.x + dir * (pl.w * 3.2)) | 0));
      if (ax0 > ax1) { var t = ax0; ax0 = ax1; ax1 = t; }
      var ty0 = Math.max(0, ((pl.y - pl.h * 0.9) | 0)),
          ty1 = Math.min(h - 1, ((pl.y + pl.h * 0.2) | 0));
      var edge = 0, cnt = 0, darkN = 0;
      for (var yy = ty0; yy <= ty1; yy++) {
        for (var xx = ax0; xx <= ax1; xx++) {
          var cc = cls[yy * w + xx];
          cnt++;
          if ((cc & (C_RED | C_GREEN | C_BROWN | C_ORANGE | C_YELLOW | C_DARK)) !== 0) edge++;
          if ((cc & C_DARK) !== 0) darkN++;
        }
      }
      obs.wallAhead = cnt > 0 && (edge / cnt) > 0.16;
      // tall wall? edge density in the UPPER half of the ahead box: a wall
      // that reaches above Mario can't be walked past — climb (up) or jump.
      var upEdge = 0, upCnt = 0;
      var uy1 = Math.max(ty0, ((pl.y - pl.h * 1.8) | 0));
      for (var uy = uy1; uy <= ty1; uy++) {
        for (var ux = ax0; ux <= ax1; ux++) {
          upCnt++;
          var uc = cls[uy * w + ux];
          if ((uc & (C_RED | C_GREEN | C_BROWN | C_ORANGE | C_YELLOW | C_DARK)) !== 0) upEdge++;
        }
      }
      obs.wallTall = obs.wallAhead && upCnt > 0 && (upEdge / upCnt) > 0.22;
      // ceiling: solid directly above the player's head (jump with care).
      var cx0 = Math.max(0, ((pl.x - pl.w * 0.6) | 0)),
          cx1 = Math.min(w - 1, ((pl.x + pl.w * 0.6) | 0));
      var cy0 = Math.max(0, ((pl.y - pl.h * 2.0) | 0)),
          cy1 = Math.max(0, ((pl.y - pl.h * 1.1) | 0));
      var ce = 0, cn = 0;
      for (var cyy = cy0; cyy <= cy1; cyy++) {
        for (var cxx = cx0; cxx <= cx1; cxx++) {
          cn++;
          var ccc = cls[cyy * w + cxx];
          if ((ccc & (C_RED | C_GREEN | C_BROWN | C_ORANGE | C_YELLOW | C_DARK)) !== 0) ce++;
        }
      }
      obs.ceiling = cn > 0 && (ce / cn) > 0.25;
      // pit: a run of void columns ahead (no terrain down to frame bottom).
      // Lookahead ~4.5 body-widths; ignore the offscreen edge itself.
      var lx0 = Math.max(0, ((pl.x + pl.w * 0.8) | 0)),
          lx1 = Math.min(w - 2, ((pl.x + pl.w * 4.5) | 0));
      var run = 0, runMax = 0, firstVoid = -1;
      for (var lx = lx0; lx <= lx1; lx++) {
        if (tops[lx] >= h - 2) {
          if (firstVoid < 0) firstVoid = lx - pl.x;
          run++; if (run > runMax) runMax = run;
        }
        else run = 0;
      }
      obs.gapW = runMax;
      obs.pitDist = firstVoid; // px from player to the pit edge (-1 = none)
      obs.pitAhead = runMax >= 7;
      // needUp: blocked ahead by a tall wall while grounded — the level goes
      // UP here (pipes, shafts, stair walls), not left.
      obs.needUp = obs.wallTall && Math.abs(pl.vy) < 1.2;
      // downOpen: a droppable gap ahead, or open shaft below the player
      // (pipes/doors below, vertical bonus rooms).
      var belowX0 = Math.max(0, ((pl.x - pl.w) | 0)),
          belowX1 = Math.min(w - 1, ((pl.x + pl.w) | 0));
      var belowVoid = 0, belowN = 0;
      for (var by = Math.max(0, ((pl.y + pl.h) | 0)); by < h; by++) {
        for (var bx = belowX0; bx <= belowX1; bx++) {
          belowN++;
          if (tops[bx] > by) belowVoid++;
        }
      }
      obs.downOpen = obs.pitAhead || (belowN > 0 && belowVoid / belowN > 0.6);
    }

    // ---- white-burst (stomp/coin popup feedback) ----
    var white = 0;
    for (var wi = 0; wi < n; wi++) { if (cls[wi] === C_WHITE) white++; }
    var wf = white / n;
    if (this.whiteAvg > 0 && wf > this.whiteAvg * 2.2 && wf > 0.0015) obs.whiteBurst = wf;
    this.whiteAvg = this.whiteAvg * 0.92 + wf * 0.08;

    // ---- message box open? dark slab across the middle band + white text.
    // (Death fades are all-dark with ~no white; night skies lack dense text.)
    var mb0 = (h * 0.28) | 0, mb1 = (h * 0.62) | 0;
    var mbDark = 0, mbWhite = 0, mbN = 0;
    for (var my = mb0; my < mb1; my++) {
      for (var mx = 8; mx < w - 8; mx++) {
        mbN++;
        var mc = cls[my * w + mx];
        if ((mc & C_DARK) !== 0) mbDark++;
        if ((mc & C_WHITE) !== 0) mbWhite++;
      }
    }
    obs.messageOpen = (mbDark / Math.max(1, mbN)) > 0.22 && mbWhite > 60;

    // ---- file select? white menu text rows in the upper-middle band ----
    // (Title needs Start; file select needs B — Start goes BACKWARDS there.)
    var fu0 = (h * 0.30) | 0, fu1 = (h * 0.48) | 0;
    var fuW = 0, fuN = 0;
    for (var fy = fu0; fy < fu1; fy++) {
      for (var fx = 8; fx < w - 8; fx++) {
        fuN++;
        if ((cls[fy * w + fx] & C_WHITE) !== 0) fuW++;
      }
    }
    obs.fileSelect = !obs.messageOpen && (fuW / Math.max(1, fuN)) > 0.015 && bright > 0.35;

    // ---- read text (signs, banners, HUD, GAME OVER) ----
    // Bands only (cheap); skipped on fades. Best-effort with confidence —
    // see js/text.js for the honest limits.
    obs.text = { lines: [], text: '', conf: 0, keywords: {} };
    if (!obs.fade && window.SMWText) {
      try { obs.text = window.SMWText.readFrame(img); } catch (e) {}
    }

    this.lastObs = obs;
    return obs;
  };

  // Guess death cause from the last live observation + where we lost the track.
  Vision.prototype.deathCause = function () {
    var o = this.lastObs;
    if (!o || !o.player) return 'unknown';
    var p = o.player;
    for (var i = 0; i < o.enemies.length; i++) {
      var e = o.enemies[i];
      if (e.threat > 0 && e.dist < 26) return 'enemy:' + e.type;
    }
    if (o.pitAhead) return 'pit';
    // lava: bright orange/red wash below the player
    return 'fall';
  };

  window.SMWVision = { Vision: Vision, classify: classify };
})();
