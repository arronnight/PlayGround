/* Cartridge reader: what game is this, and how should the AI think about it?
 *
 * Parses the SNES internal header (LoROM 0x7FC0 / HiROM 0xFFC0, SMC copier
 * header stripped first): 21-char title, map mode, cart type, region,
 * checksum+complement. Then `identify()` matches the title against a small
 * built-in profile book so the AI gets a SLIGHT understanding of the game:
 * a platformer wants run-right, a top-down adventure wants all 4 directions
 * equally, a fighter wants face buttons, an RPG wants patience. Profiles only
 * nudge the learner's prior multipliers — all real knowledge still comes
 * from playing (vision, ears, deaths).
 */
(function () {
  'use strict';

  function ascii(bytes, off, len) {
    var s = '';
    for (var i = 0; i < len; i++) {
      var c = bytes[off + i];
      if (c === 0) break;
      s += (c >= 32 && c < 127) ? String.fromCharCode(c) : ' ';
    }
    return s.trim();
  }
  function norm(title) {
    return (title || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  var REGIONS = { 0x00: 'Japan', 0x01: 'USA', 0x02: 'Europe', 0x03: 'Sweden',
    0x04: 'Finland', 0x05: 'Denmark', 0x06: 'France', 0x07: 'Netherlands',
    0x08: 'Spain', 0x09: 'Germany', 0x0A: 'Italy', 0x0B: 'China',
    0x0C: 'Indonesia', 0x0D: 'Korea' };

  function cartType(t) {
    if (t === 0x00) return 'ROM';
    if (t === 0x01) return 'ROM+RAM';
    if (t === 0x02) return 'ROM+RAM+Battery';
    if (t >= 0x03 && t <= 0x06) return 'ROM+DSP';
    if (t === 0x13 || t === 0x14) return 'ROM+SuperFX';
    if (t === 0x34 || t === 0x35) return 'ROM+SA-1';
    if (t === 0x15 || t === 0x1A) return 'ROM+custom chip';
    return 'chip 0x' + t.toString(16).toUpperCase();
  }

  // genre profiles: bias multipliers on the learner prior (1 = neutral)
  var PROFILES = {
    platform:  { label: 'side-view platformer', right: 1.0, up: 1.0, down: 1.0, spin: 1.2,
      note: 'run-right platforming; spin kills what jump bounces off' },
    explore:   { label: 'exploration platformer', right: 0.8, up: 1.3, down: 1.3, spin: 1.0,
      note: 'vertical maze — up/down doors and shafts matter as much as right' },
    topdown:   { label: 'top-down adventure', right: 0.7, up: 1.2, down: 1.2, spin: 0.7,
      note: 'no gravity progress — all 4 directions equal, patience pays' },
    racer:     { label: 'racer', right: 1.3, up: 0.8, down: 0.8, spin: 0.6,
      note: 'hold direction + dash; jumping rarely helps' },
    fighter:   { label: 'fighter', right: 0.8, up: 0.9, down: 1.1, spin: 1.4,
      note: 'face buttons are the game — combos over travel' },
    rungun:     { label: 'run-and-gun', right: 1.0, up: 1.2, down: 1.0, spin: 1.0,
      note: 'aim up often; keep moving' },
    rpg:       { label: 'RPG / menu-heavy', right: 0.5, up: 0.7, down: 0.7, spin: 0.5,
      note: 'menus and text — progress is slow, avoid rash moves' },
    generic:   { label: 'unknown cartridge', right: 0.8, up: 1.0, down: 1.0, spin: 1.0,
      note: 'no profile matched — balanced exploring until deaths teach it' }
  };

  function identify(title) {
    var t = norm(title);
    function has() {
      for (var i = 0; i < arguments.length; i++) {
        if (t.indexOf(arguments[i]) >= 0) return true;
      }
      return false;
    }
    if (has('MARIOWORLD')) return 'platform';
    if (has('ALLSTARS', 'MARIOBROS', 'MARIOLAND')) return 'platform';
    if (has('DONKEYKONG', 'MEGAMAN', 'SONIC')) return 'platform';
    if (has('CONTRA', 'METAL')) return 'rungun';
    if (has('METROID', 'CASTLEVANIA')) return 'explore';
    if (has('ZELDA', 'MANA', 'SOULBLAZER', 'TERRANIGMA')) return 'topdown';
    if (has('KART', 'FZERO', 'F-ZERO', 'EXCITE', 'STUNT')) return 'racer';
    if (has('FIGHTER', 'MORTALKOMBAT', 'KILLERINSTINCT', 'FATALFURY', 'SAMURAISHODOWN')) return 'fighter';
    if (has('FINALFANTASY', 'CHRONO', 'DRAGONQUEST', 'EARTHBOUND', 'BREATHOFFIRE', 'LUFIA', 'POKEMON')) return 'rpg';
    return 'generic';
  }

  function headerAt(bytes, base) {
    if (base + 32 > bytes.length) return null;
    return {
      title: ascii(bytes, base, 21),
      mapMode: bytes[base + 21],
      cartType: bytes[base + 22],
      romSize: bytes[base + 23],
      ramSize: bytes[base + 24],
      region: bytes[base + 25],
      version: bytes[base + 27],
      complement: bytes[base + 28] | (bytes[base + 29] << 8),
      checksum: bytes[base + 30] | (bytes[base + 31] << 8)
    };
  }

  function parse(buffer) {
    var bytes = new Uint8Array(buffer);
    var smc = (bytes.length % 1024 === 512) ? 512 : 0; // copier header
    var body = smc ? bytes.subarray(512) : bytes;
    var lo = headerAt(body, 0x7FC0), hi = headerAt(body, 0xFFC0);
    function valid(h) {
      return h && h.title.replace(/ /g, '').length >= 3 &&
        ((h.complement ^ h.checksum) === 0xFFFF);
    }
    var h = null, kind = '?';
    if (valid(lo) && valid(hi)) {
      // both valid (often mirrored) — prefer the one with printable title
      h = lo; kind = 'LoROM';
    } else if (valid(lo)) { h = lo; kind = 'LoROM'; }
    else if (valid(hi)) { h = hi; kind = 'HiROM'; }
    else {
      // last resort: whichever has the more plausible title
      var lt = lo ? lo.title : '', ht = hi ? hi.title : '';
      if (ht.length > lt.length) { h = hi; kind = 'HiROM?'; }
      else if (lt.length) { h = lo; kind = 'LoROM?'; }
    }
    if (!h) {
      return { ok: false, title: '', kind: '?', reason: 'no readable SNES header' };
    }
    var profileId = identify(h.title);
    return {
      ok: true,
      title: h.title,
      kind: ((h.mapMode & 0x30) === 0x30) ? 'HiROM' : (((h.mapMode & 0x30) === 0x20) ? 'LoROM' : kind),
      fastRom: !!(h.mapMode & 0x10),
      cart: cartType(h.cartType),
      region: REGIONS[h.region] || ('region 0x' + h.region.toString(16).toUpperCase()),
      version: '1.' + h.version,
      checksumOk: ((h.complement ^ h.checksum) === 0xFFFF),
      smcHeader: !!smc,
      profileId: profileId,
      profile: PROFILES[profileId]
    };
  }

  window.SMWCards = window.SMWCards || {};
  window.SMWCards.GameID = { parse: parse, identify: identify, PROFILES: PROFILES };
  window.GameID = window.SMWCards.GameID;
})();
