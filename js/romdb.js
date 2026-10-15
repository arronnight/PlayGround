/* ROM library: user ROMs persist in IndexedDB so they survive reloads.
 * (ROM files can't live in git — copyright — so the browser itself is the
 * database. Blobs stay local; nothing is ever uploaded.)
 *
 * Record: {id, name, size, crc, title, addedAt, lastPlayed, blob}
 */
(function () {
  'use strict';

  var DB_NAME = 'smw-romdb', STORE = 'roms', DB_VER = 1;

  function openDB() {
    return new Promise(function (resolve, reject) {
      var req;
      try { req = indexedDB.open(DB_NAME, DB_VER); }
      catch (e) { reject(e); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          var st = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
          st.createIndex('crc', 'crc', { unique: false });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error('indexedDB open failed')); };
    });
  }

  function tx(db, mode) {
    return db.transaction(STORE, mode).objectStore(STORE);
  }

  function reqP(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error || new Error('indexedDB request failed')); };
    });
  }

  function crc32(buf) {
    var t = crc32.table;
    if (!t) {
      t = crc32.table = new Int32Array(256);
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        t[n] = c;
      }
    }
    var bytes = new Uint8Array(buf), crc = -1;
    for (var i = 0; i < bytes.length; i++) crc = t[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    return ((crc ^ -1) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  }

  var RomDB = {
    crc32: crc32,
    saveRom: function (name, buffer, meta) {
      meta = meta || {};
      return openDB().then(function (db) {
        var crc = crc32(buffer);
        // dedupe: same crc+size already saved?
        return reqP(tx(db, 'readonly').getAll()).then(function (all) {
          for (var i = 0; i < all.length; i++) {
            if (all[i].crc === crc && all[i].size === buffer.byteLength) {
              return { id: all[i].id, duplicate: true, record: all[i] };
            }
          }
          var rec = { name: name, size: buffer.byteLength, crc: crc,
            title: meta.title || '', addedAt: Date.now(), lastPlayed: 0,
            blob: new Blob([buffer], { type: 'application/octet-stream' }) };
          return reqP(tx(db, 'readwrite').add(rec)).then(function (id) {
            rec.id = id;
            return { id: id, duplicate: false, record: rec };
          });
        });
      });
    },
    listRoms: function () {
      return openDB().then(function (db) {
        return reqP(tx(db, 'readonly').getAll()).then(function (all) {
          all.sort(function (a, b) { return (b.lastPlayed || b.addedAt) - (a.lastPlayed || a.addedAt); });
          // strip blobs for the listing (cheap render)
          return all.map(function (r) {
            return { id: r.id, name: r.name, size: r.size, crc: r.crc,
              title: r.title || '', addedAt: r.addedAt, lastPlayed: r.lastPlayed };
          });
        });
      });
    },
    getRom: function (id) {
      return openDB().then(function (db) {
        return reqP(tx(db, 'readonly').get(Number(id)));
      });
    },
    touchRom: function (id) {
      return openDB().then(function (db) {
        var st = tx(db, 'readwrite');
        return reqP(st.get(Number(id))).then(function (rec) {
          if (!rec) return false;
          rec.lastPlayed = Date.now();
          return reqP(st.put(rec)).then(function () { return true; });
        });
      });
    },
    deleteRom: function (id) {
      return openDB().then(function (db) {
        return reqP(tx(db, 'readwrite').delete(Number(id))).then(function () { return true; });
      });
    }
  };

  window.SMWCards = window.SMWCards || {};
  window.SMWCards.RomDB = RomDB;
  window.RomDB = RomDB;
})();
