/* XInput / Gamepad monitor.
 * Xbox (XInput) controllers appear in the Gamepad API with mapping === 'standard'.
 * This module only *observes*: actual in-emulator input is handled natively by
 * the libretro core (pad 0 -> P1, pad 1 -> P2). The panel lets the user verify
 * their controller, see the live standard-mapped state, and test rumble.
 */
(function () {
  'use strict';

  // Standard mapping button order (W3C "standard" gamepad == XInput layout).
  var BUTTONS = [
    'A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT',
    'Back', 'Start', 'L3', 'R3',
    'DUp', 'DDown', 'DLeft', 'DRight', 'Guide'
  ];
  var AXES = ['LX', 'LY', 'RX', 'RY'];

  function pads() {
    var list = [];
    var raw;
    try { raw = navigator.getGamepads ? navigator.getGamepads() : []; } catch (e) { raw = []; }
    for (var i = 0; i < raw.length; i++) {
      if (raw[i] && raw[i].connected) list.push(raw[i]);
    }
    return list;
  }

  function isXInput(pad) {
    return /xbox|xinput/i.test(pad.id || '');
  }

  function pressed(pad) {
    var out = [];
    pad.buttons.forEach(function (b, i) {
      if (b && (b.pressed || b.value > 0.35)) out.push(BUTTONS[i] || ('B' + i));
    });
    return out;
  }

  function snapshot(pad) {
    return {
      index: pad.index,
      id: pad.id,
      mapping: pad.mapping,
      xinput: isXInput(pad) || pad.mapping === 'standard',
      buttons: pressed(pad),
      axes: Array.prototype.slice.call(pad.axes || []).map(function (v) { return Math.round(v * 100) / 100; })
    };
  }

  function rumble(padIndex, durationMs) {
    var all = navigator.getGamepads ? navigator.getGamepads() : [];
    var pad = all[padIndex];
    if (!pad) return Promise.reject(new Error('no pad at index ' + padIndex));
    var act = (pad.vibrationActuator) || (pad.hapticActuators && pad.hapticActuators[0]);
    if (!act || !act.playEffect) return Promise.reject(new Error('rumble not supported on this pad/browser'));
    try {
      var p = act.playEffect('dual-rumble', {
        duration: durationMs || 300,
        strongMagnitude: 0.8, weakMagnitude: 0.8
      });
      return (p && p.then) ? p : Promise.resolve();
    } catch (e) { return Promise.reject(e); }
  }

  window.XInput = {
    pads: pads,
    snapshot: snapshot,
    rumble: rumble,
    BUTTONS: BUTTONS,
    AXES: AXES
  };
})();
