/* Text reader: the AI reads words — signs, banners, HUD, GAME OVER.
 *
 * SMW renders text as 8x8 tiles, bright ink (white, sometimes yellow) on
 * dark. Pipeline: find glyph rows inside a band (top HUD strip + message
 * box band) by horizontal ink projection -> slice 8px cells -> binarize ->
 * Hamming-match against the built-in 8x8 font (A-Z a-z 0-9 + punctuation).
 * Every read carries confidence; junky matches report '?' instead of lies.
 * Joined text is scanned for the small vocabulary that changes behavior:
 * GAME OVER (counts as a death), COURSE CLEAR (counts as an exit), KEY,
 * EXIT/GOAL/HOUSE (steer), TIME/MARIO (HUD anchor).
 *
 * Honest limits: the built-in table is a clean 8x8 sans close to SMW's font,
 * not a ROM dump — lookalike glyphs (I/l, O/0) can confuse it at small
 * sizes, and stylized logo graphics are NOT font text and won't read.
 */
(function () {
  'use strict';

  // 8 bytes per glyph, top row first, bit7 = left pixel. Redrawn from
  // observed SMW glyphs (6px narrow strokes, 6 rows, rows 6-7 empty):
  // file-select "MARIO A" gave exact M/A/E bitmaps; the rest follow that
  // measured style. translation-tolerant matching absorbs the rest.
  var FONT = {
    'A': [0x78,0xCC,0xCC,0xFC,0xCC,0xCC,0x00,0x00],
    'B': [0xF8,0xCC,0xF8,0xCC,0xCC,0xF8,0x00,0x00],
    'C': [0x78,0xC0,0xC0,0xC0,0xC0,0x78,0x00,0x00],
    'D': [0xF0,0xCC,0xCC,0xCC,0xCC,0xF0,0x00,0x00],
    'E': [0xFC,0xC0,0xFC,0xC0,0xC0,0xFC,0x00,0x00],
    'F': [0xFC,0xC0,0xFC,0xC0,0xC0,0xC0,0x00,0x00],
    'G': [0x78,0xCC,0xC0,0xDC,0xCC,0x7C,0x00,0x00],
    'H': [0xCC,0xCC,0xFC,0xCC,0xCC,0xCC,0x00,0x00],
    'I': [0xFC,0x18,0x18,0x18,0x18,0xFC,0x00,0x00],
    'J': [0x1C,0x0C,0x0C,0x0C,0xCC,0x78,0x00,0x00],
    'K': [0xCC,0xD8,0xF0,0xF0,0xD8,0xCC,0x00,0x00],
    'L': [0xC0,0xC0,0xC0,0xC0,0xC0,0xFC,0x00,0x00],
    'M': [0x8C,0xDC,0xFC,0xFC,0xAC,0x8C,0x00,0x00],
    'N': [0xCC,0xEC,0xDC,0xDC,0xCC,0xCC,0x00,0x00],
    'O': [0x78,0xCC,0xCC,0xCC,0xCC,0x78,0x00,0x00],
    'P': [0xF8,0xCC,0xCC,0xF8,0xC0,0xC0,0x00,0x00],
    'Q': [0x78,0xCC,0xCC,0xCC,0xDC,0x7A,0x00,0x00],
    'R': [0xF8,0xCC,0xCC,0xF8,0xDC,0xCC,0x00,0x00],
    'S': [0x78,0xC0,0x78,0x0C,0x0C,0x78,0x00,0x00],
    'T': [0xFC,0x18,0x18,0x18,0x18,0x18,0x00,0x00],
    'U': [0xCC,0xCC,0xCC,0xCC,0xCC,0x78,0x00,0x00],
    'V': [0xCC,0xCC,0xCC,0xCC,0x6C,0x18,0x00,0x00],
    'W': [0xCC,0xCC,0xDC,0xFC,0x6C,0x6C,0x00,0x00],
    'X': [0xCC,0xCC,0x78,0x18,0x78,0xCC,0x00,0x00],
    'Y': [0xCC,0xCC,0xCC,0x78,0x18,0x18,0x00,0x00],
    'Z': [0xFC,0x0C,0x18,0x30,0x60,0xFC,0x00,0x00],
    'a': [0x0C,0x0C,0x7C,0xCC,0xCC,0x7C,0x00,0x00],
    'b': [0xC0,0xC0,0xF8,0xCC,0xCC,0xF8,0x00,0x00],
    'c': [0x78,0xC0,0xC0,0xC0,0x78,0x00,0x00,0x00],
    'd': [0x0C,0x0C,0x7C,0xCC,0xCC,0x7C,0x00,0x00],
    'e': [0x78,0xFC,0xC0,0x78,0x00,0x00,0x00,0x00],
    'f': [0x18,0x38,0x18,0x18,0x18,0x18,0x00,0x00],
    'g': [0x7C,0xCC,0xCC,0x7C,0x0C,0x78,0x00,0x00],
    'h': [0xC0,0xC0,0xF8,0xCC,0xCC,0xCC,0x00,0x00],
    'i': [0x18,0x00,0x38,0x18,0x18,0x3C,0x00,0x00],
    'j': [0x0C,0x00,0x1C,0x0C,0xCC,0x78,0x00,0x00],
    'k': [0xC0,0xC0,0xD8,0xF0,0xD8,0xCC,0x00,0x00],
    'l': [0xC0,0xC0,0xC0,0xC0,0xC0,0xFC,0x00,0x00],
    'm': [0xD8,0xFC,0xCC,0xCC,0x00,0x00,0x00,0x00],
    'n': [0xF8,0xCC,0xCC,0xCC,0x00,0x00,0x00,0x00],
    'o': [0x78,0xCC,0xCC,0xCC,0x78,0x00,0x00,0x00],
    'p': [0xF8,0xCC,0xF8,0xC0,0x00,0x00,0x00,0x00],
    'q': [0x78,0xCC,0x78,0x0C,0x00,0x00,0x00,0x00],
    'r': [0xDC,0xF0,0xC0,0xC0,0x00,0x00,0x00,0x00],
    's': [0x78,0xC0,0x78,0x0C,0x78,0x00,0x00,0x00],
    't': [0x18,0x18,0xFC,0x18,0x18,0x00,0x00,0x00],
    'u': [0xCC,0xCC,0xCC,0xCC,0x7C,0x00,0x00,0x00],
    'v': [0xCC,0xCC,0x78,0x18,0x00,0x00,0x00,0x00],
    'w': [0xCC,0xDC,0xFC,0x6C,0x00,0x00,0x00,0x00],
    'x': [0xCC,0x78,0x78,0xCC,0x00,0x00,0x00,0x00],
    'y': [0xCC,0xCC,0x7C,0x0C,0x0C,0x00,0x00,0x00],
    'z': [0xFC,0x18,0x30,0xFC,0x00,0x00,0x00,0x00],
    '0': [0x78,0xCC,0xDC,0xEC,0xCC,0x78,0x00,0x00],
    '1': [0x18,0x38,0x18,0x18,0x18,0x7C,0x00,0x00],
    '2': [0x78,0x0C,0x18,0x30,0x60,0xFC,0x00,0x00],
    '3': [0xF8,0x0C,0x18,0x0C,0x0C,0xF8,0x00,0x00],
    '4': [0x18,0x38,0x68,0xCC,0xFC,0x18,0x00,0x00],
    '5': [0xFC,0xC0,0xF8,0x0C,0xCC,0x78,0x00,0x00],
    '6': [0x38,0x60,0xC0,0xF8,0xCC,0x78,0x00,0x00],
    '7': [0xFC,0x0C,0x18,0x18,0x30,0x30,0x00,0x00],
    '8': [0x78,0xCC,0xCC,0x78,0xCC,0x78,0x00,0x00],
    '9': [0x78,0xCC,0xCC,0xF8,0x0C,0x78,0x00,0x00],
    ' ': [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00],
    '!': [0x18,0x18,0x18,0x18,0x00,0x18,0x00,0x00],
    '?': [0x78,0x0C,0x18,0x18,0x00,0x18,0x00,0x00],
    "'": [0x18,0x18,0x30,0x00,0x00,0x00,0x00,0x00],
    '.': [0x00,0x00,0x00,0x00,0x18,0x18,0x00,0x00],
    ',': [0x00,0x00,0x00,0x18,0x18,0x30,0x00,0x00],
    ':': [0x00,0x18,0x00,0x00,0x18,0x18,0x00,0x00],
    ';': [0x00,0x18,0x00,0x18,0x18,0x30,0x00,0x00],
    '-': [0x00,0x00,0xFC,0x00,0x00,0x00,0x00,0x00],
    '+': [0x00,0x18,0xFC,0x18,0x00,0x00,0x00,0x00],
    '/': [0x0C,0x0C,0x18,0x30,0x30,0x60,0x00,0x00],
    '(': [0x0C,0x18,0x30,0x30,0x18,0x0C,0x00,0x00],
    ')': [0x30,0x18,0x0C,0x0C,0x18,0x30,0x00,0x00]
  };
  var GLYPHS = Object.keys(FONT);

  function popcount(b) {
    b = b - ((b >> 1) & 0x55);
    b = (b & 0x33) + ((b >> 2) & 0x33);
    return (((b + (b >> 4)) & 0x0F) * 0x01010101) >> 24;
  }
  function inkOf(bytes) {
    var s = 0;
    for (var i = 0; i < 8; i++) s += popcount(bytes[i]);
    return s;
  }
  var INK = {};
  GLYPHS.forEach(function (g) { INK[g] = inkOf(FONT[g]); });

  // best match for an 8-byte cell; '?' when nothing is close.
  // Translation-tolerant: game glyphs rarely sit exactly cell-aligned
  // (6px glyphs on 8px advance, outlines), so the cell is tried shifted
  // ±1px and the best placement wins.
  function matchCell(cell) {
    var ink = inkOf(cell);
    if (ink < 4) return { ch: ' ', conf: 1 };      // blank
    if (ink > 52) return { ch: '?', conf: 0 };    // solid block, not text
    function shifted(dx, dy) {
      var out = [0,0,0,0,0,0,0,0];
      for (var ry = 0; ry < 8; ry++) {
        var sy = ry - dy;
        if (sy < 0 || sy > 7) continue;
        var row = cell[sy], bits = 0;
        for (var rx = 0; rx < 8; rx++) {
          var sx = rx - dx;
          if (sx >= 0 && sx < 8 && (row & (0x80 >> sx))) bits |= (0x80 >> rx);
        }
        out[ry] = bits;
      }
      return out;
    }
    var best = '?', bestD = Infinity, second = Infinity, bestConf = 0;
    for (var gi = 0; gi < GLYPHS.length; gi++) {
      var g = GLYPHS[gi];
      if (g === ' ') continue;
      var tb = FONT[g];
      for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
          var sh = shifted(dx, dy);
          var d = 0;
          for (var i = 0; i < 8; i++) d += popcount(sh[i] ^ tb[i]);
          if (d < bestD) { second = bestD; bestD = d; best = g; bestConf = 0; }
          else if (d < second) { second = d; }
        }
      }
    }
    var tol = Math.max(4, INK[best] * 0.32);
    if (bestD > tol) return { ch: '?', conf: 0 };
    var conf = second === Infinity ? 1 :
      Math.max(0.35, Math.min(1, 1 - bestD / Math.max(6, second)));
    return { ch: best, conf: conf };
  }

  function isInk(r, g, b) {
    if (r > 200 && g > 200 && b > 200) return true;   // white text
    if (r > 190 && g > 150 && b < 120) return true;   // yellow speaker text
    return false;
  }

  // Glyph hunting via connected ink blobs (not scanline grids): each ink
  // blob of glyph size (5..24px) is one character, resampled to 8x8.
  // Cloud specks are too small, cloud masses too big — both rejected by size.
  // Handles 8px message font and 16px menu headers uniformly.
  function glyphBlobs(d, w, y0, y1, x0, x1) {
    var W = x1 - x0, H = y1 - y0;
    var mask = new Uint8Array(W * H);
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var o = ((y0 + y) * w + x0 + x) * 4;
        if (isInk(d[o], d[o + 1], d[o + 2])) mask[y * W + x] = 1;
      }
    }
    var seen = new Uint8Array(W * H);
    var out = [];
    var stack = [];
    for (var i = 0; i < W * H; i++) {
      if (seen[i] || !mask[i]) continue;
      var bx0 = W, by0 = H, bx1 = -1, by1 = -1, n = 0;
      stack.length = 0; stack.push(i); seen[i] = 1;
      while (stack.length) {
        var p = stack.pop();
        var qx = p % W, qy = (p / W) | 0;
        if (qx < bx0) bx0 = qx; if (qx > bx1) bx1 = qx;
        if (qy < by0) by0 = qy; if (qy > by1) by1 = qy;
        n++;
        if (n > 1400) break;
        if (qx > 0) { var a = p - 1; if (!seen[a] && mask[a]) { seen[a] = 1; stack.push(a); } }
        if (qx < W - 1) { var b = p + 1; if (!seen[b] && mask[b]) { seen[b] = 1; stack.push(b); } }
        if (qy > 0) { var c = p - W; if (!seen[c] && mask[c]) { seen[c] = 1; stack.push(c); } }
        if (qy < H - 1) { var e = p + W; if (!seen[e] && mask[e]) { seen[e] = 1; stack.push(e); } }
      }
      var bw = bx1 - bx0 + 1, bh = by1 - by0 + 1;
      if (n >= 12 && n <= 700 && bw >= 4 && bh >= 5 && bw <= 26 && bh <= 24) {
        var splitDone = false;
        if (bw >= 13) {
          // merged glyphs ("EMPTY" touching letters): split at empty columns
          var runs = [], rs = -1;
          for (var gx = bx0; gx <= bx1; gx++) {
            var colInk = false;
            for (var gy = by0; gy <= by1; gy++) {
              if (mask[gy * W + gx]) { colInk = true; break; }
            }
            if (colInk) { if (rs < 0) rs = gx; }
            else if (rs >= 0) { runs.push([rs, gx - 1]); rs = -1; }
          }
          if (rs >= 0) runs.push([rs, bx1]);
          runs = runs.filter(function (r) { return r[1] - r[0] + 1 >= 3; });
          if (runs.length > 1) {
            for (var qi = 0; qi < runs.length; qi++) {
              var pw = runs[qi][1] - runs[qi][0] + 1;
              out.push({ x: x0 + runs[qi][0], y: y0 + by0, w: pw, h: bh,
                area: Math.max(12, (n * pw / bw) | 0) });
            }
            splitDone = true;
          }
        }
        if (!splitDone) {
          out.push({ x: x0 + bx0, y: y0 + by0, w: bw, h: bh, area: n });
        }
      }
    }
    return out;
  }

  // Glyph bitmap into an 8x8 cell: small glyphs paste NATIVE (no rescale —
  // a 6px file-select glyph stretched to 8px matches nothing); big ones
  // scale down. Top-left anchored; matchCell absorbs ±1px slop.
  function blobToCell(d, w, b) {
    var cell = [0,0,0,0,0,0,0,0];
    if (Math.max(b.w, b.h) <= 9) {
      for (var ry = 0; ry < 8 && ry < b.h; ry++) {
        var byte = 0;
        for (var rx = 0; rx < 8 && rx < b.w; rx++) {
          var o = ((b.y + ry) * w + b.x + rx) * 4;
          if (isInk(d[o], d[o + 1], d[o + 2])) byte |= (0x80 >> rx);
        }
        cell[ry] = byte;
      }
      return cell;
    }
    for (var qy = 0; qy < 8; qy++) {
      var bits = 0;
      for (var qx = 0; qx < 8; qx++) {
        var sx = Math.min(w - 1, b.x + ((qx + 0.5) * b.w / 8) | 0);
        var sy = b.y + Math.min(b.h - 1, ((qy + 0.5) * b.h / 8) | 0);
        var oo = (sy * w + sx) * 4;
        if (isInk(d[oo], d[oo + 1], d[oo + 2])) bits |= (0x80 >> qx);
      }
      cell[qy] = bits;
    }
    return cell;
  }

  function readBand(d, w, y0, y1, x0, x1) {
    var blobs = glyphBlobs(d, w, y0, y1, x0, x1);
    if (!blobs.length) return [];
    // group into lines by vertical center proximity
    blobs.sort(function (a, b) { return (a.y + a.h / 2) - (b.y + b.h / 2); });
    var lines = [], cur = [blobs[0]];
    for (var i = 1; i < blobs.length; i++) {
      var prevC = cur[cur.length - 1].y + cur[cur.length - 1].h / 2;
      var thisC = blobs[i].y + blobs[i].h / 2;
      if (Math.abs(thisC - prevC) <= 7) cur.push(blobs[i]);
      else { lines.push(cur); cur = [blobs[i]]; }
    }
    lines.push(cur);
    var out = [];
    for (var li = 0; li < lines.length; li++) {
      var line = lines[li];
      if (line.length < 2) continue; // lone speck, not a word
      line.sort(function (a, b) { return a.x - b.x; });
      var avgW = line.reduce(function (s, b) { return s + b.w; }, 0) / line.length;
      var text = '', confSum = 0, n = 0;
      for (var gi = 0; gi < line.length; gi++) {
        if (gi > 0 && line[gi].x - (line[gi - 1].x + line[gi - 1].w) > avgW * 0.9) text += ' ';
        var m = matchCell(blobToCell(d, w, line[gi]));
        text += m.ch;
        confSum += m.conf; n++;
      }
      text = text.replace(/ +/g, ' ').trim().replace(/^\?+|\?+$/g, '').trim();
      if (text.replace(/[^A-Za-z0-9]/g, '').length >= 2) {
        var ymid = line.reduce(function (s, b) { return s + b.y + b.h / 2; }, 0) / line.length;
        out.push({ text: text, conf: n ? confSum / n : 0, y: ymid | 0 });
      }
    }
    return out;
  }

  var KEYWORDS = ['GAME OVER', 'COURSE CLEAR', 'CLEAR', 'KEY', 'EXIT', 'GOAL',
    'HOUSE', 'YOSHI', 'MARIO', 'LUIGI', 'TIME', 'PRESS', 'START', 'SELECT',
    'SECRET', 'CASTLE', 'GHOST', 'SWITCH', 'COIN', 'MUSHROOM', 'FLOWER',
    'STAR', 'FEATHER', 'BONUS', 'PERFECT', 'PLAYER', 'ERASE', 'EMPTY',
    '1UP', 'SAVE', 'CONTINUE'];

  function readFrame(img) {
    var w = img.width, h = img.height, d = img.data;
    var lines = [];
    // top HUD strip + middle message band (message boxes live ~28-62% height)
    var bands = [
      { y0: (h * 0.01) | 0, y1: (h * 0.15) | 0, zone: 'hud' },
      { y0: (h * 0.24) | 0, y1: (h * 0.66) | 0, zone: 'msg' }
    ];
    for (var bi = 0; bi < bands.length; bi++) {
      var b = bands[bi];
      var bandLines = readBand(d, w, b.y0, b.y1, 8, w - 8);
      for (var ri = 0; ri < bandLines.length; ri++) {
        lines.push({ text: bandLines[ri].text, conf: bandLines[ri].conf,
          zone: b.zone, y: bandLines[ri].y });
      }
    }
    var joined = lines.map(function (l) { return l.text; }).join(' ').toUpperCase();
    var keywords = {};
    KEYWORDS.forEach(function (k) {
      if (joined.indexOf(k) >= 0) keywords[k] = true;
    });
    var conf = lines.length ?
      lines.reduce(function (s, l) { return s + l.conf; }, 0) / lines.length : 0;
    return { lines: lines, text: lines.map(function (l) { return l.text; }).join(' / '),
      conf: conf, keywords: keywords };
  }

  window.SMWText = { readFrame: readFrame, matchCell: matchCell, FONT: FONT,
    _dbg: { glyphBlobs: glyphBlobs, readBand: readBand, blobToCell: blobToCell, isInk: isInk } };
})();
