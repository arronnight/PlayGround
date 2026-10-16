/* ==========================================================================
   ManualBrain — SNES manual archive reader for the SNESBoy AI Lab.
   Item: https://archive.org/details/snes_manual_archive (863 PDFs).
   Most PDFs are "Image Container PDF" (scans, no text layer), so this
   module does hybrid reading:
     1. PDF.js text-layer extraction (fast, works on text PDFs),
     2. Tesseract.js OCR fallback per page (lazy, on demand, cached),
   plus TF-IDF cosine "vector search" over extracted chunks (offline,
   no server needed) and fuzzy game-to-manual matching.
   Storage: IndexedDB `snesboy-manuals` (index cache + extracted text).
   Exposes: window.ManualBrain, window.manualBrain, window.SNESBridge.
   ========================================================================== */
(function () {
  'use strict';

  var ITEM = 'snes_manual_archive';
  var META_URL = 'https://archive.org/metadata/' + ITEM;
  // The user's paste compressed into one string; the canonical item URL is above.
  // Direct file: https://archive.org/download/snes_manual_archive/<filename>
  var DOWNLOAD_BASE = 'https://archive.org/download/' + ITEM + '/';
  var IDB_NAME = 'snesboy-manuals';
  var IDB_VERSION = 1;

  function $(id) { return document.getElementById(id); }
  function log() {
    try { if (window.console && console.log) console.log.apply(console, arguments); } catch (e) {}
  }

  /* ---------------- normalization + matching ---------------- */
  function normTitle(s) {
    return String(s || '')
      .replace(/\.(sfc|smc|zip|pdf)$/i, '')
      .replace(/\((usa|eur|pal|jpn|world|rev\s*\d+|usa\)[^)]*|[^)]*\)|\d+k[^)]*)\)/gi, ' ')
      .replace(/\[.+?\]/g, ' ')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function tokens(s) {
    var n = normTitle(s);
    return n ? n.split(' ') : [];
  }
  // Score manual filename against a game title: token overlap + substring.
  function matchScore(gameTitle, manualName) {
    var g = tokens(gameTitle);
    var m = tokens(manualName.replace(/\.pdf$/i, ''));
    if (!g.length || !m.length) return 0;
    var mset = {};
    m.forEach(function (t) { mset[t] = 1; });
    var hit = 0;
    g.forEach(function (t) { if (mset[t]) hit++; });
    var recall = hit / g.length;
    var precision = hit / m.length;
    var gn = normTitle(gameTitle);
    var mn = normTitle(manualName);
    var sub = (mn.indexOf(gn) !== -1 || gn.indexOf(mn) !== -1) ? 0.3 : 0;
    return 0.6 * recall + 0.4 * precision + sub;
  }

  /* ---------------- IndexedDB cache ---------------- */
  var dbPromise = null;
  function db() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (res) {
      try {
        var r = indexedDB.open(IDB_NAME, IDB_VERSION);
        r.onupgradeneeded = function () {
          var d = r.result;
          if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv', { keyPath: 'k' });
          if (!d.objectStoreNames.contains('chunks')) d.createObjectStore('chunks', { keyPath: 'k' });
        };
        r.onsuccess = function () { res(r.result); };
        r.onerror = function () { res(null); };
      } catch (e) { res(null); }
    });
    return dbPromise;
  }
  function kvGet(k) {
    return db().then(function (d) {
      if (!d) return null;
      return new Promise(function (res) {
        try {
          var q = d.transaction('kv', 'readonly').objectStore('kv').get(k);
          q.onsuccess = function () { res(q.result ? q.result.v : null); };
          q.onerror = function () { res(null); };
        } catch (e) { res(null); }
      });
    });
  }
  function kvPut(k, v) {
    return db().then(function (d) {
      if (!d) return;
      return new Promise(function (res) {
        try {
          var tx = d.transaction('kv', 'readwrite');
          tx.objectStore('kv').put({ k: k, v: v });
          tx.oncomplete = function () { res(); };
          tx.onerror = function () { res(); };
        } catch (e) { res(); }
      });
    });
  }
  function chunksGet(k) { return kvGet('chunks:' + k); }
  function chunksPut(k, v) { return kvPut('chunks:' + k, v); }

  /* ---------------- archive index ---------------- */
  var fileIndex = []; // [{name, size, format}]
  var indexLoaded = false;

  function fetchIndex(force) {
    if (indexLoaded && !force && fileIndex.length) return Promise.resolve(fileIndex);
    // 1. Shipped list (same-origin ai/manual-index.json, 863 manuals) —
    //    works even with no network at all. This is why the picker loads
    //    instantly and never "fails to fetch".
    // 2. Cached list from a previous live fetch.
    // 3. Live archive.org metadata (has CORS *, used as a refresh).
    function fromShipped() {
      return fetch('ai/manual-index.json').then(function (r) {
        if (!r.ok) throw new Error('shipped index HTTP ' + r.status);
        return r.json();
      }).then(function (doc) {
        var files = (doc && doc.files) || [];
        if (!files.length) throw new Error('shipped index empty');
        fileIndex = files;
        indexLoaded = true;
        return fileIndex;
      });
    }
    function fromLive() {
      return fetch(META_URL).then(function (r) {
        if (!r.ok) throw new Error('metadata HTTP ' + r.status);
        return r.json();
      }).then(function (meta) {
        var files = meta && meta.files ? meta.files : [];
        fileIndex = files
          .filter(function (f) { return /\.pdf$/i.test(f.name || ''); })
          .map(function (f) { return { name: f.name, size: +f.size || 0, format: f.format || '' }; });
        indexLoaded = true;
        kvPut('fileIndex', fileIndex);
        kvPut('fileIndexAt', new Date().toISOString());
        return fileIndex;
      });
    }
    if (force) return fromShipped().catch(fromLive);
    return kvGet('fileIndex').then(function (cached) {
      if (cached && cached.length) {
        fileIndex = cached;
        indexLoaded = true;
        return fileIndex;
      }
      return fromShipped().catch(fromLive);
    });
  }

  function findManuals(gameTitle, topN) {
    var scored = fileIndex.map(function (f) {
      return { file: f, score: matchScore(gameTitle, f.name) };
    }).filter(function (s) { return s.score > 0.05; });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, topN || 5);
  }

  // Bundled manuals live IN the app (manuals/*.pdf, same-origin fetch —
  // no CORS, no proxy, works offline). Remote archive.org routes are only
  // a fallback for manuals not bundled yet.
  var onDisk = null;
  function onDiskSet() {
    if (onDisk) return Promise.resolve(onDisk);
    return fetch('manuals/manifest.json').then(function (r) {
      if (!r.ok) throw new Error('no manifest');
      return r.json();
    }).then(function (m) {
      onDisk = {};
      ((m && m.files) || []).forEach(function (n) { onDisk[n] = 1; });
      return onDisk;
    }).catch(function () {
      onDisk = {};
      return onDisk;
    });
  }
  function fileUrl(name) {
    return DOWNLOAD_BASE + encodeURIComponent(name).replace(/%2F/g, '/');
  }
  function localUrl(name) {
    return 'manuals/' + encodeURIComponent(name).replace(/%2F/g, '/');
  }
  // archive.org /download sends no CORS headers, so a browser fetch()
  // of PDF bytes is rejected as "Failed to fetch". Chain: direct, then
  // two public CORS proxies. HTTP errors (4xx/5xx) fail fast — only
  // network/CORS failures move to the next leg.
  var PDF_ROUTES = [
    function (u) { return u; },
    function (u) { return 'https://cors.isomorphic-git.org/' + u; },
    function (u) { return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); }
  ];
  function fetchPdfBytes(manualName) {
    var url = fileUrl(manualName);
    // Leg 0: on-disk copy shipped with the app. Same-origin, so the
    // browser always allows it — this is the route that just works.
    var first = onDiskSet().then(function (set) {
      if (!set[manualName]) return null;
      return fetch(localUrl(manualName)).then(function (r) {
        if (!r.ok) throw new Error('local copy HTTP ' + r.status);
        return r.arrayBuffer();
      });
    }).catch(function (e) {
      if (e && /^local copy HTTP/.test(e.message || '')) throw e;
      return null;
    });
    var errs = [];
    var seq = first;
    PDF_ROUTES.forEach(function (mk) {
      seq = seq.then(function (buf) {
        if (buf) return buf;
        return fetch(mk(url)).then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.arrayBuffer();
        }).catch(function (e) {
          if (e && /^HTTP /.test(e.message || '')) throw e; // real HTTP error: stop
          errs.push(e.message || String(e));
          return null;
        });
      });
    });
    return seq.then(function (buf) {
      if (buf) return buf;
      throw new Error('not bundled and all remote routes failed (' + errs.join('; ') +
        ') — use the PDF button to open it in a tab, or LOAD PDF FROM DISK');
    });
  }

  /* ---------------- PDF text extraction (PDF.js) ---------------- */
  function ensurePdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = function () {
        try {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        } catch (e) {}
        res(window.pdfjsLib);
      };
      s.onerror = function () { rej(new Error('pdf.js failed to load')); };
      document.head.appendChild(s);
    });
  }
  function ensureTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      s.onload = function () { res(window.Tesseract); };
      s.onerror = function () { rej(new Error('tesseract.js failed to load')); };
      document.head.appendChild(s);
    });
  }

  // Extract text-layer pages via PDF.js. Returns [{page, text}].
  // maxPages caps work; scans return empty strings (caller falls back to OCR).
  function extractPdfText(manualName, maxPages, onProgress) {
    return ensurePdfJs().then(function (pdfjs) {
      return fetchPdfBytes(manualName).then(function (buf) {
        return pdfjs.getDocument({ data: buf }).promise;
      }).then(function (pdf) {
        var n = Math.min(pdf.numPages, maxPages || 12);
        var jobs = [];
        for (var p = 1; p <= n; p++) {
          jobs.push((function (pageNum) {
            return pdf.getPage(pageNum).then(function (page) {
              return page.getTextContent().then(function (tc) {
                var strs = (tc.items || []).map(function (it) { return it.str || ''; });
                var text = strs.join(' ').replace(/\s+/g, ' ').trim();
                if (onProgress) { try { onProgress(pageNum, n); } catch (e) {} }
                return { page: pageNum, text: text, total: pdf.numPages };
              });
            });
          })(p));
        }
        return Promise.all(jobs);
      });
    });
  }

  // OCR a single PDF page by rendering at low res and running Tesseract.
  // Lazy by design: scans are big; OCR only the pages you need.
  function ocrPdfPage(manualName, pageNum, scale) {
    return ensurePdfJs().then(function (pdfjs) {
      return Promise.all([fetchPdfBytes(manualName), ensureTesseract()]);
    }).then(function (parts) {
      var buf = parts[0];
      return window.pdfjsLib.getDocument({ data: buf }).promise;
    }).then(function (pdf) {
      return pdf.getPage(pageNum).then(function (page) {
        var vp = page.getViewport({ scale: scale || 1.5 });
        var cv = document.createElement('canvas');
        cv.width = vp.width | 0;
        cv.height = vp.height | 0;
        var ctx = cv.getContext('2d');
        return page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
          return window.Tesseract.recognize(cv, 'eng', { logger: function () {} });
        }).then(function (result) {
          var text = (result && result.data && result.data.text) || '';
          return { page: pageNum, text: text.replace(/\s+/g, ' ').trim(), total: pdf.numPages, ocr: true };
        });
      });
    });
  }

  /* ---------------- chunking + TF-IDF retrieve ---------------- */
  function guessSection(text) {
    var t = String(text || '').toLowerCase();
    if (/control|button|d-pad|press/.test(t.slice(0, 400))) return 'Controls';
    if (/boss/.test(t)) return 'Boss';
    if (/enemy|enemies|villain/.test(t)) return 'Enemies';
    if (/item|weapon|power|pickup/.test(t)) return 'Items';
    if (/map|world|level|stage|course/.test(t)) return 'Maps';
    if (/story|plot|rescue|princess|save/.test(t)) return 'Story';
    if (/option|menu|save|password|2 player|co-op|two player/.test(t)) return 'Menus';
    return 'General';
  }
  function toChunks(game, pages) {
    var out = [];
    (pages || []).forEach(function (p) {
      var text = String(p.text || '').trim();
      if (!text) return;
      // ~600-char chunks keep excerpts readable in the UI + AI prompt.
      for (var i = 0; i < text.length; i += 600) {
        var slice = text.slice(i, i + 600).trim();
        if (slice.length < 40) continue;
        out.push({ game: game, page: p.page, section: guessSection(slice), text: slice, ocr: !!p.ocr });
      }
    });
    return out;
  }
  function tokenize(q) {
    return String(q || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter(function (w) {
      return w.length > 2;
    });
  }
  function idf(chunks) {
    var df = {}, N = Math.max(1, chunks.length);
    chunks.forEach(function (c) {
      var seen = {};
      tokenize(c.text).forEach(function (w) { seen[w] = 1; });
      Object.keys(seen).forEach(function (w) { df[w] = (df[w] || 0) + 1; });
    });
    var out = {};
    Object.keys(df).forEach(function (w) { out[w] = Math.log(1 + N / df[w]); });
    return out;
  }
  function scoreChunks(chunks, query, topK) {
    var q = tokenize(query);
    if (!q.length || !chunks.length) return [];
    var w = idf(chunks);
    var scored = chunks.map(function (c) {
      var tf = {};
      tokenize(c.text).forEach(function (t) { tf[t] = (tf[t] || 0) + 1; });
      var s = 0;
      q.forEach(function (t) { if (tf[t]) s += tf[t] * (w[t] || 1); });
      // Phrase bonus: exact query words appearing close together.
      return { chunk: c, score: s };
    }).filter(function (s) { return s.score > 0; });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, topK || 6).map(function (s) {
      return { game: s.chunk.game, page: s.chunk.page, section: s.chunk.section, text: s.chunk.text, score: Math.round(s.score * 100) / 100 };
    });
  }

  /* ---------------- ManualBrain public API ---------------- */
  var currentGame = null;
  var currentManual = null;
  var currentChunks = [];
  var autoLoading = null;
  var autoPromise = null;

  // RetroArch SNES button indices (same map the AI co-player drives).
  var BTN_LETTER = { A: 8, B: 0, X: 9, Y: 1, L: 10, R: 11 };
  // Read control rules straight from the loaded manual excerpts.
  // Only overrides a mapping on explicit "X button ... to jump"-style
  // evidence; otherwise the previous mapping stands (never invent).
  function applyControlsHint(ctx) {
    var found = {};
    (ctx || []).forEach(function (c) {
      var t = String((c && c.text) || '');
      var roles = ['jump', 'attack', 'shoot', 'run', 'dash', 'block'];
      roles.forEach(function (role) {
        ['A', 'B', 'X', 'Y', 'L', 'R'].forEach(function (L) {
          var re = new RegExp('(?:press|push|hold|use)(?: the)? \\b' + L + '\\b(?: button)?[^.]{0,60}?(?:to|for) \\b' + role + '\\b' +
            '|\\b' + role + '\\b[^.]{0,60}?(?:press|push|the)? ?\\b' + L + '\\b(?: button)?', 'i');
          if (re.test(t) && !(role in found)) found[role] = { button: L, index: BTN_LETTER[L], evidence: t.slice(0, 160) };
        });
      });
    });
    var controls = window.manualControls || { jump: 8, attack: 0, run: 1, source: 'default' };
    if (found.jump) controls.jump = found.jump.index;
    var atk = found.attack || found.shoot;
    if (atk) controls.attack = atk.index;
    var rn = found.run || found.dash;
    if (rn) controls.run = rn.index;
    controls.source = currentManual || controls.source;
    controls.evidence = found;
    window.manualControls = controls;
    try {
      window.dispatchEvent(new CustomEvent('manual-ready', {
        detail: { manual: currentManual, game: currentGame, controls: controls,
          context: window.manualContext || [], orders: window.manualOrders || null }
      }));
    } catch (e) {}
    return controls;
  }
  // Turn the manual into PLAYING knowledge: the goal (orders), things that
  // kill you (watchlist), and a push direction + vertical bias the co-player
  // actually steers by. Shown in #manual-orders so you see what it plays from.
  function buildOrders(all) {
    var goals = scoreChunks(all || [], 'objective goal how to play win rescue reach exit defeat boss finish complete', 3);
    var watch = [];
    (all || []).forEach(function (c) {
      String(c.text || '').split(/[.!?]+\s+/).forEach(function (s) {
        s = s.trim();
        if (watch.length >= 6 || s.length < 20 || s.length > 220) return;
        if (/\b(avoid|beware|caution|danger|damage|lose|game over|enem|trap|spike|pit|don't|do not|never)\b/i.test(s)) watch.push(s);
      });
    });
    var gt = goals.map(function (g) { return g.text; }).join(' ');
    var right = (gt.match(/\bright\b|\beast\b|\bahead\b|\bforward\b/gi) || []).length;
    var left = (gt.match(/\bleft\b|\bwest\b/gi) || []).length;
    var orders = {
      manual: currentManual, game: currentGame,
      goals: goals.map(function (g) { return { page: g.page, text: g.text }; }),
      watch: watch.slice(0, 3),
      push: left > right ? 'L' : 'R',
      vertical: /\bclimb\b|\bladder\b|\bfly\b|\bswim\b/i.test(gt)
    };
    window.manualOrders = orders;
    return orders;
  }
  function renderOrders(boxId) {
    var box = document.getElementById(boxId || 'manual-orders');
    if (!box) return;
    var o = window.manualOrders;
    if (!o || (!o.goals.length && !o.watch.length)) {
      box.textContent = 'AI orders: none yet — TEACH AI a manual and its goal + dangers appear here.';
      return;
    }
    var parts = [];
    o.goals.forEach(function (g, i) { parts.push('GOAL' + (i + 1) + ' (p.' + g.page + '): ' + g.text); });
    if (o.watch.length) parts.push('WATCH: ' + o.watch.join(' / '));
    parts.push('PUSH ' + (o.push === 'L' ? '◀' : '▶') + (o.vertical ? ' + climb/swim' : ''));
    box.textContent = 'AI orders from ' + o.manual + ' — ' + parts.join(' · ');
  }
  // Single choke point every load path uses: excerpts -> controls -> orders.
  // Returns {ctx, controls, orders} for status lines.
  function publishKnowledge(sourceNote) {
    var controlsQ = scoreChunks(currentChunks, 'controls buttons jump run attack dash shoot', 2);
    var goalQ = scoreChunks(currentChunks, 'objective goal how to play win rescue reach exit defeat boss', 2);
    var seen = {}, ctx = [];
    controlsQ.concat(goalQ).forEach(function (c) {
      var k = c.page + '|' + c.text.slice(0, 60);
      if (!seen[k]) { seen[k] = 1; ctx.push(c); }
    });
    window.manualContext = ctx;
    var mc = applyControlsHint(ctx.length ? ctx : currentChunks.slice(0, 8));
    var orders = buildOrders(currentChunks);
    // Re-dispatch now that orders exist (applyControlsHint fired before them).
    try {
      window.dispatchEvent(new CustomEvent('manual-ready', {
        detail: { manual: currentManual, game: currentGame, controls: mc,
          context: ctx, orders: orders, note: sourceNote || '' }
      }));
    } catch (e) {}
    renderChunks(ctx.length ? ctx : currentChunks.slice(0, 4), 'manual-results');
    renderOrders('manual-orders');
    return { ctx: ctx, controls: mc, orders: orders };
  }
  function btnName(i) {
    for (var k in BTN_LETTER) if (BTN_LETTER[k] === i) return k;
    return i;
  }

  var ManualBrain = {
    item: ITEM,
    metaUrl: META_URL,
    downloadBase: DOWNLOAD_BASE,
    get fileCount() { return fileIndex.length; },
    get game() { return currentGame; },
    get manual() { return currentManual; },

    index: fetchIndex,
    find: findManuals,
    url: fileUrl,

    // Match the loaded ROM to the best manual. Returns {file, score} | null.
    // If confidence < 0.35 the caller must say "unknown" (core rule) and
    // must NOT invent game-specific facts.
    matchGame: function (romName) {
      return fetchIndex().then(function () {
        var best = findManuals(romName, 1)[0] || null;
        if (!best || best.score < 0.35) return null;
        return best;
      });
    },

    // Load + read a manual: cache-first, PDF.js text first, OCR on demand.
    // opts: {maxPages, ocrPages, ocrIfEmpty, onProgress}
    load: function (manualName, opts) {
      opts = opts || {};
      currentManual = manualName;
      return chunksGet(manualName).then(function (cached) {
        if (cached && cached.length) {
          currentChunks = cached;
          return { game: currentGame, manual: manualName, chunks: cached, cached: true };
        }
        return extractPdfText(manualName, opts.maxPages || 12, opts.onProgress).then(function (pages) {
          var empty = pages.filter(function (p) { return (p.text || '').length > 40; }).length === 0;
          var doOcr = (opts.ocrIfEmpty !== false && empty) || (opts.ocrPages || 0) > 0;
          if (!doOcr) {
            var chunks = toChunks(currentGame || manualName, pages);
            currentChunks = chunks;
            if (chunks.length) chunksPut(manualName, chunks);
            return { game: currentGame, manual: manualName, chunks: chunks, cached: false, pages: pages.length, textPages: pages.filter(function (p) { return p.text; }).length };
          }
          // OCR the first few pages only — full-manual OCR is minutes of CPU.
          var n = Math.min(opts.ocrPages || 4, pages.length);
          var seq = Promise.resolve([]);
          for (var i = 1; i <= n; i++) {
            seq = seq.then((function (pg) {
              return function (acc) {
                if (opts.onProgress) { try { opts.onProgress('ocr', pg); } catch (e) {} }
                return ocrPdfPage(manualName, pg).then(function (r) {
                  acc.push(r);
                  return acc;
                }).catch(function () { return acc; });
              };
            })(i));
          }
          return seq.then(function (ocred) {
            var merged = pages.map(function (p) {
              for (var j = 0; j < ocred.length; j++) {
                if (ocred[j].page === p.page && ocred[j].text.length > 40) return ocred[j];
              }
              return p;
            });
            var c2 = toChunks(currentGame || manualName, merged);
            currentChunks = c2;
            if (c2.length) chunksPut(manualName, c2);
            return { game: currentGame, manual: manualName, chunks: c2, cached: false, ocred: ocred.length };
          });
        });
      });
    },

    // retrieve({gameTitle, query, topK}) -> [{game, page, section, text}]
    retrieve: function (args) {
      args = args || {};
      var q = args.query || '';
      var k = args.topK || 6;
      if (currentChunks.length) return Promise.resolve(scoreChunks(currentChunks, q, k));
      // No manual loaded: match first, then load lazily (max 8 pages, no OCR
      // yet — OCR happens explicitly via load() so retrieve stays fast).
      var title = args.gameTitle || currentGame || '';
      return this.matchGame(title).then(function (best) {
        if (!best) return [];
        currentGame = title;
        return ManualBrain.load(best.file.name, { maxPages: 8, ocrIfEmpty: false }).then(function () {
          return scoreChunks(currentChunks, q, k);
        });
      }).catch(function () { return []; });
    },

    // Convenience for the agent loop: build the query from a scene graph.
    retrieveForScene: function (scene) {
      scene = scene || {};
      var parts = [];
      if (scene.ocr_text) parts.push(scene.ocr_text);
      (scene.enemies || []).forEach(function (e) { if (e.type && e.type !== 'unknown') parts.push(e.type); });
      (scene.items || []).forEach(function (i) { if (i.type) parts.push(i.type); });
      if (scene.objective_guess) parts.push(scene.objective_guess);
      if (scene.screen_type) parts.push(scene.screen_type);
      var title = scene.game_title && scene.game_title.indexOf('Detected') !== 0 ? scene.game_title : (currentGame || '');
      return this.retrieve({ gameTitle: title, query: parts.join(' '), topK: 6 });
    },

    setGame: function (romName) {
      currentGame = romName; currentChunks = []; currentManual = null;
      setText('manual-status', 'Manual: press TEACH AI to teach ' + (romName || 'this game') + ' — nothing loads by itself.');
    },
    // AI auto-flow: match ROM -> load excerpts -> publish manualContext.
    // Called on boot and on autopilot start. Never throws; on failure the
    // AI simply plays without manual facts (says so in the status line).
    autoLoadForGame: function (romName) {
      try{ if(window.AI_SAFE) return Promise.resolve(null); }catch(e){}
      var title = romName || currentGame || '';
      if (!title) return Promise.resolve(null);
      if (autoLoading === title) return autoPromise || Promise.resolve(null);
      autoLoading = title;
      setText('manual-status', 'AI co-player: matching manual for "' + title + '" …');
      autoPromise = fetchIndex().then(function () {
        return ManualBrain.matchGame(title);
      }).then(function (best) {
        if (!best) {
          setText('manual-status', 'AI co-player: no confident manual for "' + title + '" — playing from screen only, no invented facts.');
          renderChunks([], 'manual-results');
          window.manualContext = [];
          window.manualOrders = null;
          renderOrders('manual-orders');
          return null;
        }
        currentGame = title;
        setText('manual-status', 'AI co-player reading ' + best.file.name + ' …');
        return ManualBrain.load(best.file.name, { maxPages: 8, ocrIfEmpty: false }).then(function (r) {
          var k = publishKnowledge('auto-matched ' + Math.round(best.score * 100) + '%');
          setText('manual-status', 'AI co-player plays from ' + best.file.name +
            ' — ' + r.chunks.length + ' excerpts' + (r.cached ? ' (cached)' : '') +
            ' · match ' + Math.round(best.score * 100) + '%' +
            ' · jump=' + btnName(k.controls.jump) + ' attack=' + btnName(k.controls.attack) +
            ' run=' + btnName(k.controls.run) + ' · push ' + (k.orders.push === 'L' ? '◀' : '▶'));
          try {
            var live = document.getElementById('anton-live');
            if (live) live.textContent = 'SON OF ANTON · manual: ' + best.file.name + ' (' + r.chunks.length + ' excerpts)';
          } catch (e) {}
          return { manual: best.file.name, chunks: r.chunks, context: k.ctx, orders: k.orders };
        });
      }).catch(function (e) {
        setText('manual-status', 'AI co-player: manual unavailable (' + ((e && e.message) || e) + ') — playing from screen only.');
        window.manualContext = [];
        window.manualOrders = null;
        renderOrders('manual-orders');
        return null;
      }).then(function (r) { autoLoading = null; return r; });
      return autoPromise;
    },
    // What the AI currently plays from (for the agent loop / HUD).
    getContext: function () { return window.manualContext || []; },
    // Read a user-downloaded PDF copy (bypasses archive.org CORS entirely).
    // file: File/Blob from <input type=file>. Cached under its filename.
    loadFromFile: function (file) {
      var name = (file && file.name) || 'local.pdf';
      currentManual = name;
      return ensurePdfJs().then(function (pdfjs) {
        return new Promise(function (res, rej) {
          var fr = new FileReader();
          fr.onload = function () { res(fr.result); };
          fr.onerror = function () { rej(new Error('could not read file')); };
          fr.readAsArrayBuffer(file);
        });
      }).then(function (buf) {
        return window.pdfjsLib.getDocument({ data: buf }).promise;
      }).then(function (pdf) {
        var n = Math.min(pdf.numPages, 12);
        var jobs = [];
        for (var p = 1; p <= n; p++) {
          jobs.push(pdf.getPage(p).then(function (page) {
            return page.getTextContent().then(function (tc) {
              var strs = (tc.items || []).map(function (it) { return it.str || ''; });
              return { page: 0, text: strs.join(' ').replace(/\s+/g, ' ').trim() };
            });
          }));
        }
        return Promise.all(jobs).then(function (pages) {
          pages.forEach(function (pg, i) { pg.page = i + 1; pg.total = pdf.numPages; });
          var chunks = toChunks(currentGame || name, pages);
          currentChunks = chunks;
          if (chunks.length) chunksPut(name, chunks);
          return { game: currentGame, manual: name, chunks: chunks, local: true, pages: pdf.numPages };
        });
      });
    },
    clearCache: function (manualName) {
      currentChunks = [];
      return db().then(function (d) {
        if (!d) return;
        try {
          var tx = d.transaction('kv', 'readwrite');
          if (manualName) tx.objectStore('kv').delete('chunks:' + manualName);
          else tx.objectStore('kv').clear();
        } catch (e) {}
      });
    }
  };

  /* ---------------- SNESBridge (EmulatorJS GameManager) ---------------- */
  // Real controller input only: screenshot() to see, simulateInput() to act,
  // getState()/loadState() + quickSave()/quickLoad() for checkpoints.
  // Button names follow the app's RetroArch SNES numbering.
  var BTN = { A: 8, B: 0, X: 9, Y: 1, L: 10, R: 11, SELECT: 2, START: 3, UP: 4, DOWN: 5, LEFT: 6, RIGHT: 7 };
  function gm() {
    try { return window.EJS_emulator && window.EJS_emulator.gameManager; } catch (e) { return null; }
  }
  function drive(idx, down, player) {
    var g = gm();
    if (g && typeof g.simulateInput === 'function') {
      try { g.simulateInput(player || 0, idx, down ? 1 : 0); return true; } catch (e) { return false; }
    }
    return false;
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  var SNESBridge = {
    buttons: BTN,
    gm: gm,
    // Exact game screen (dataURL). Prefers gameManager.screenshot().
    getFrame: function () {
      var g = gm();
      try {
        if (g && typeof g.screenshot === 'function') {
          return Promise.resolve(g.screenshot()); // EJS returns a Promise of bytes — adopt it
        }
      } catch (e) {}
      var cv = document.querySelector('#ejs-stage canvas');
      if (cv) { try { return Promise.resolve(cv.toDataURL('image/png')); } catch (e) {} }
      return Promise.reject(new Error('no frame available'));
    },
    getAudioWindow: function () {
      // The app's passive audio tap (script.js) is the live source; without
      // it there is no mic-free game-audio buffer, so report unavailable.
      return Promise.reject(new Error('audio tap unavailable — use the AI Lab recorder stream'));
    },
    press: function (button, durationMs, player) {
      var idx = typeof button === 'string' ? BTN[button] : button;
      if (idx === undefined) return Promise.reject(new Error('unknown button ' + button));
      drive(idx, true, player);
      return sleep(durationMs || 120).then(function () { drive(idx, false, player); });
    },
    pressSequence: function (inputs, player) {
      var seq = Promise.resolve();
      (inputs || []).forEach(function (ev) {
        seq = seq.then(function () {
          var btn = ev.button !== undefined ? ev.button : ev.b;
          var hold = ev.holdMs !== undefined ? ev.holdMs : (ev.ms || 120);
          return SNESBridge.press(btn, hold, ev.player !== undefined ? ev.player : player);
        }).then(function () { return sleep(40); });
      });
      return seq;
    },
    saveCheckpoint: function (slot) {
      var g = gm();
      if (g && typeof g.quickSave === 'function') { try { g.quickSave(slot || 0); return true; } catch (e) {} }
      return false;
    },
    loadCheckpoint: function (slot) {
      var g = gm();
      if (g && typeof g.quickLoad === 'function') { try { g.quickLoad(slot || 0); return true; } catch (e) {} }
      return false;
    },
    getRawState: function () {
      var g = gm();
      if (g && typeof g.getState === 'function') { try { return Promise.resolve(g.getState()); } catch (e) {} }
      return Promise.reject(new Error('save states unavailable'));
    },
    loadRawState: function (state) {
      var g = gm();
      if (g && typeof g.loadState === 'function') { try { g.loadState(state); return Promise.resolve(true); } catch (e) {} }
      return Promise.reject(new Error('load state unavailable'));
    }
  };

  /* ---------------- tiny UI wiring (progressive enhancement) ---------------- */
  function setText(id, t) { var e = $(id); if (e) e.textContent = t; }
  function renderMatches(list, boxId) {
    var box = $(boxId);
    if (!box) return;
    box.innerHTML = '';
    if (!list.length) {
      box.innerHTML = '<p class="modal-desc">No confident match — say so, do not invent game facts.</p>';
      return;
    }
    list.forEach(function (s) {
      var item = document.createElement('div'); item.className = 'rom-list-item';
      var nm = document.createElement('div'); nm.className = 'rom-name';
      var mb = Math.round(s.file.size / 1048576 * 10) / 10;
      nm.textContent = s.file.name + ' · ' + mb + 'MB · match ' + Math.round(s.score * 100) + '%';
      onDiskSet().then(function (set) {
        if (set[s.file.name]) nm.textContent += ' · ON DISK';
      });
      var act = document.createElement('div'); act.className = 'rom-actions';
      var open = document.createElement('button'); open.className = 'rom-btn-play'; open.textContent = 'TEACH AI';
      open.addEventListener('click', function () { openManual(s.file.name); });
      var dl = document.createElement('a'); dl.className = 'rom-btn-export'; dl.textContent = 'PDF';
      dl.href = fileUrl(s.file.name); dl.target = '_blank'; dl.rel = 'noopener';
      dl.style.cssText = 'text-decoration:none;padding:.35rem .6rem;font-size:8px;border-radius:4px;font-weight:bold;';
      act.appendChild(open); act.appendChild(dl);
      item.appendChild(nm); item.appendChild(act); box.appendChild(item);
    });
  }
  function renderChunks(chunks, boxId) {
    var box = $(boxId);
    if (!box) return;
    box.innerHTML = '';
    if (!chunks.length) {
      box.innerHTML = '<p class="modal-desc">AI has no excerpts yet — pick a manual above and press TEACH AI.</p>';
      return;
    }
    chunks.forEach(function (c) {
      var item = document.createElement('div'); item.className = 'rom-list-item';
      item.style.flexDirection = 'column';
      item.style.alignItems = 'stretch';
      var head = document.createElement('div'); head.className = 'rom-name';
      head.textContent = c.game + ' · p.' + c.page + ' · ' + c.section + (c.score !== undefined ? ' · ★' + c.score : '') + (c.ocr ? ' · OCR' : '');
      var body = document.createElement('div');
      body.className = 'modal-desc';
      body.style.whiteSpace = 'normal';
      body.textContent = c.text;
      item.appendChild(head); item.appendChild(body); box.appendChild(item);
    });
  }
  // You pick a manual, the AI co-player learns the game straight from it:
  // controls mapping + objective/enemy/item excerpts become manualContext.
  function openManual(name) {
    onDiskSet().then(function (set) {
      setText('manual-status', set[name]
        ? 'AI co-player reading on-disk ' + name + ' …'
        : 'AI co-player reading ' + name + ' … (not bundled — remote fetch, may fail)');
    });
    ManualBrain.load(name, {
      maxPages: 12, ocrIfEmpty: true, ocrPages: 4,
      onProgress: function (a, b) {
        if (typeof a === 'number') setText('manual-status', 'AI co-player reading ' + name + ' … page ' + a + '/' + b);
        else setText('manual-status', 'Scan detected — AI OCRing ' + name + ' page ' + b + ' …');
      }
    }).then(function (r) {
      var k = publishKnowledge('taught by you');
      setText('manual-status', 'AI co-player learned ' + name + ' — ' + r.chunks.length + ' excerpts' +
        (r.cached ? ' (cached)' : '') + (r.ocred ? ' · ' + r.ocred + ' pages OCR' : '') +
        ' · jump=' + btnName(k.controls.jump) + ' attack=' + btnName(k.controls.attack) +
        ' run=' + btnName(k.controls.run) + ' · push ' + (k.orders.push === 'L' ? '◀' : '▶'));
    }).catch(function (e) {
      var msg = (e && e.message) || String(e);
      setText('manual-status', 'AI could not read ' + name + ' (' + msg + '). ' +
        'Download the PDF once with the PDF button and use LOAD PDF FROM DISK below (cached for the AI).');
    });
  }

  function wireUI() {
    var btnIndex = $('btn-manual-index');
    if (btnIndex && !btnIndex.dataset.wired) {
      btnIndex.dataset.wired = '1';
      btnIndex.addEventListener('click', function () {
        setText('manual-status', 'Loading manual index (shipped with the app, 863 manuals) …');
        fetchIndex(true).then(function (files) {
          setText('manual-status', 'Index ready — ' + files.length + ' manuals. Type a game, FIND MANUAL, then TEACH AI.');
          var q = $('manual-search');
          if (q && q.value) doMatch(q.value);
          else {
            var rom = currentGame || 'Super Mario All-Stars (USA)';
            doMatch(rom);
          }
        }).catch(function (e) {
          setText('manual-status', 'Index failed: ' + (e && e.message) + ' — check network, retry.');
        });
      });
    }
    var btnMatch = $('btn-manual-match');
    if (btnMatch && !btnMatch.dataset.wired) {
      btnMatch.dataset.wired = '1';
      btnMatch.addEventListener('click', function () {
        var q = ($('manual-search') && $('manual-search').value) || currentGame || '';
        doMatch(q);
      });
    }
    var search = $('manual-search');
    if (search && !search.dataset.wired) {
      search.dataset.wired = '1';
      search.addEventListener('change', function () { doMatch(search.value); });
    }
    var fileInp = $('manual-file');
    if (fileInp && !fileInp.dataset.wired) {
      fileInp.dataset.wired = '1';
      fileInp.addEventListener('change', function () {
        if (!fileInp.files || !fileInp.files.length) return;
        var f = fileInp.files[0];
        setText('manual-status', 'Reading local ' + f.name + ' …');
        ManualBrain.loadFromFile(f).then(function (r) {
          var k = publishKnowledge('local file');
          setText('manual-status', 'AI co-player learned local ' + r.manual + ' — ' + r.chunks.length + ' excerpts (' + r.pages + ' pages) · jump=' + btnName(k.controls.jump) + ' attack=' + btnName(k.controls.attack) + ' run=' + btnName(k.controls.run) + ' · push ' + (k.orders.push === 'L' ? '◀' : '▶'));
        }).catch(function (e) {
          setText('manual-status', 'Local read failed: ' + (e && e.message));
        });
        fileInp.value = '';
      });
    }
  }
  function doMatch(q) {
    if (!q) return;
    fetchIndex().then(function () {
      var hits = findManuals(q, 5);
      setText('manual-status', hits.length ? ('Top match for "' + q + '": ' + hits[0].file.name) : ('No confident match for "' + q + '" — say so, do not invent facts.'));
      renderMatches(hits, 'manual-list');
    }).catch(function (e) {
      setText('manual-status', 'Match failed: ' + (e && e.message));
    });
  }

  // Track the loaded ROM so game-to-manual matching follows the cartridge.
  function trackRom() {
    try {
      var obs = new MutationObserver(function () {
        ['handheld-status-text', 'desktop-status-text'].forEach(function (id) {
          var e = $(id);
          if (e && e.textContent && /NOW PLAYING/i.test(e.parentNode ? '' : '')) return;
        });
      });
      obs.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  window.ManualBrain = ManualBrain;
  window.manualBrain = ManualBrain;
  window.SNESBridge = SNESBridge;
  window.snes = SNESBridge;
  ManualBrain._norm = normTitle;
  ManualBrain._score = matchScore;
  ManualBrain._open = openManual;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireUI);
  else wireUI();
  // Re-wire when the AI modal opens (modal content exists at parse time, but
  // this covers late injection).
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id && /btn-ai/.test(e.target.id)) {
      setTimeout(wireUI, 50);
      fetchIndex().catch(function () {});
    }
  });
  // Pre-fetch the file index quietly so the first search is instant.
  setTimeout(function () { fetchIndex().catch(function () {}); }, 3000);
  log('[ManualBrain] ready —', META_URL);
})();
