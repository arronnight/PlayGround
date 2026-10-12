// Momentum System (Day of Reckoning / WWE 2K Style)
// Adrenaline gauge, W-W-E slots, Momentum Shift, Special meter

export const MOMENTUM_CONFIG = {
  // Momentum Gauge (0-150 for Signature/Finisher)
  MAX_MOMENTUM: 150,
  SIGNATURE_THRESHOLD: 100,
  FINISHER_THRESHOLD: 150,
  
  // Adrenaline Gauge (0-100) - separate from momentum
  MAX_ADRENALINE: 100,
  ADRENALINE_REGEN: 2,        // per second when idle
  ADRENALINE_DECAY: 1,        // per second when not fighting
  
  // WWE Letter Slots (DoR style)
  WWE_SLOTS: ['W', 'W', 'E'],  // 3 slots to fill
  SLOT_FILL_AMOUNT: 33.33,     // each slot = 33.33% momentum
  
  // Momentum Gain
  GAIN: {
    light_strike: 2,
    heavy_strike: 5,
    running_strike: 8,
    light_grapple: 4,
    heavy_grapple: 8,
    suplex: 12,
    powerbomb: 18,
    piledriver: 22,
    dive: 15,
    taunt_complete: 15,
    reversal_success: 20,
    counter_success: 25,
    kickout: 10,
    finisher_land: 30,
    special_land: 25,
    taunt_interrupted: -10,
    take_damage: -3,
    take_big_damage: -8,
  },
  
  // Momentum Decay
  DECAY_RATE: 0.5, // per second when not fighting
  
  // Momentum Shift (DoR style)
  MOMENTUM_SHIFT: {
    enabled: true,
    once_per_match: true,
    trigger_threshold: 15, // "Danger" level (0-100 spirit)
    cooldown: 0, // no cooldown, once per match
    effect: 'swap_spirit', // swaps spirit meters
    animation_time: 3.0, // seconds for cinematic
  },
  
  // WWE Slots
  WWE_SLOT_CONFIG: {
    letters: ['W', 'W', 'E'],
    fill_per_slot: 33.33,
    special_access: true, // when filled, can use special/finisher
    charge_time: 1.5, // seconds to charge (A+B)
    special_duration: 10, // seconds special mode lasts
    max_special_uses: 3, // can use special 3 times per charge
  },
  
  // Adrenaline (separate meter for running/special state)
  ADRENALINE: {
    max: 100,
    drain_run: 15, // per second running
    drain_sprint: 25, // per second sprinting
    gain_offense: 5, // per successful hit
    gain_taunt: 10, // per completed taunt
    gain_reversal: 15, // per reversal
    gain_counter: 20, // per counter
    drain_rate: 2, // per second when not fighting
    min_for_run: 10, // minimum to run
    min_for_sprint: 30, // minimum to sprint
  },
};

// Momentum Manager Class
export class MomentumManager {
  constructor(def = {}) {
    this.max = MOMENTUM_CONFIG.MAX_MOMENTUM;
    this.current = 0;
    this.adrenaline = MOMENTUM_CONFIG.ADRENALINE.max;
    this.spirit = 50; // separate spirit meter (blue to red)
    
    // WWE Slots
    this.wweSlots = { W1: false, W2: false, E: false };
    this.slotsFilled = 0;
    this.specialCharged = false;
    this.specialActive = false;
    this.specialTimer = 0;
    this.specialUsesLeft = 0;
    
    // Momentum Shift
    this.momentumShiftUsed = false;
    this.momentumShiftAvailable = true;
    
    // State
    this.lastGainTime = 0;
    this.decayTimer = 0;
    
    // Wrestler definition reference
    this.def = null;
  }

  setDef(def) {
    this.def = def;
  }

  // Momentum getters
  get momentum() { return this.current; }
  get maxMomentum() { return this.max; }
  get momentumPct() { return this.current / this.max; }
  get hasSignature() { return this.current >= MOMENTUM_CONFIG.SIGNATURE_THRESHOLD; }
  get hasFinisher() { return this.current >= MOMENTUM_CONFIG.FINISHER_THRESHOLD; }
  get canUseSpecial() { return this.slotsFilled >= 3 && this.specialUsesLeft > 0; }
  
  // WWE Slots
  get wweProgress() { return this.slotsFilled / 3; }
  get wweDisplay() { 
    return {
      W1: this.wweSlots.W1,
      W2: this.wweSlots.W2,
      E: this.wweSlots.E,
    };
  }

  // Add momentum
  add(amount, reason = '') {
    if (amount <= 0) return 0;
    
    const old = this.current;
    this.current = Math.min(this.max, this.current + amount);
    this.lastGainTime = performance.now() / 1000;
    
    // Check WWE slot fills
    this.checkWWESlots();
    
    return this.current - old;
  }

  // Lose momentum
  lose(amount, reason = '') {
    if (amount <= 0) return 0;
    
    const old = this.current;
    this.current = Math.max(0, this.current - amount);
    this.checkWWESlots();
    
    return old - this.current;
  }

  // Check WWE slot fills
  checkWWESlots() {
    const newSlots = Math.floor(this.current / MOMENTUM_CONFIG.SLOT_FILL_AMOUNT);
    const oldSlots = this.slotsFilled;
    
    if (newSlots > oldSlots) {
      this.slotsFilled = Math.min(3, newSlots);
      // Fill slots in order
      if (this.slotsFilled >= 1) this.wweSlots.W1 = true;
      if (this.slotsFilled >= 2) this.wweSlots.W2 = true;
      if (this.slotsFilled >= 3) this.wweSlots.E = true;
      
      // When all 3 filled, charge special
      if (this.slotsFilled === 3 && oldSlots < 3) {
        this.chargeSpecial();
      }
    } else if (newSlots < oldSlots) {
      this.slotsFilled = newSlots;
      // Clear slots
      if (this.slotsFilled < 3) this.wweSlots.E = false;
      if (this.slotsFilled < 2) this.wweSlots.W2 = false;
      if (this.slotsFilled < 1) this.wweSlots.W1 = false;
    }
  }

  // Charge special (all 3 WWE slots filled)
  chargeSpecial() {
    this.specialCharged = true;
    this.specialActive = true;
    this.specialTimer = MOMENTUM_CONFIG.WWE_SLOT_CONFIG.special_duration;
    this.specialUsesLeft = MOMENTUM_CONFIG.WWE_SLOT_CONFIG.max_special_uses;
  }

  // Use special move
  useSpecial() {
    if (!this.canUseSpecial) return false;
    
    this.specialUsesLeft--;
    if (this.specialUsesLeft <= 0) {
      this.specialActive = false;
      this.specialCharged = false;
      // Clear WWE slots after using all specials
      this.wweSlots = { W1: false, W2: false, E: false };
      this.slotsFilled = 0;
      this.current = 0; // reset momentum
    }
    return true;
  }

  // Momentum Shift (DoR style)
  attemptMomentumShift(opponent) {
    if (!MOMENTUM_CONFIG.MOMENTUM_SHIFT.enabled) return false;
    if (this.momentumShiftUsed) return false;
    if (!this.momentumShiftAvailable) return false;
    
    // Check if at "Danger" level (low spirit)
    if (this.spirit > MOMENTUM_CONFIG.MOMENTUM_SHIFT.trigger_threshold) {
      return false; // not in danger
    }
    
    this.momentumShiftUsed = true;
    this.momentumShiftAvailable = false;
    
    // Swap spirit meters
    const mySpirit = this.spirit;
    this.spirit = opponent.spirit;
    opponent.spirit = mySpirit;
    
    // Also swap momentum for dramatic effect
    const myMomentum = this.current;
    this.current = opponent.momentum;
    opponent.momentum = myMomentum;
    
    // Trigger cinematic
    this.triggerMomentumShiftCinematic();
    
    return true;
  }

  triggerMomentumShiftCinematic() {
    // This would trigger a cinematic camera shake, sound, etc.
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('momentumShift', {
        detail: { wrestler: this.def?.name }
      }));
    }
  }

  // Adrenaline management
  updateAdrenaline(dt, isRunning, isSprinting, isIdle) {
    const config = MOMENTUM_CONFIG.ADRENALINE;
    
    if (isRunning) {
      this.adrenaline = Math.max(0, this.adrenaline - config.drain_run * dt);
    }
    if (isSprinting) {
      this.adrenaline = Math.max(0, this.adrenaline - config.drain_sprint * dt);
    }
    if (isIdle) {
      this.adrenaline = Math.min(config.max, this.adrenaline + config.gain_taunt * dt);
    }
    
    // Natural decay
    this.adrenaline = Math.max(0, this.adrenaline - config.drain_rate * dt);
  }

  canRun() {
    return this.adrenaline >= MOMENTUM_CONFIG.ADRENALINE.min_for_run;
  }

  canSprint() {
    return this.adrenaline >= MOMENTUM_CONFIG.ADRENALINE.min_for_sprint;
  }

  addAdrenaline(amount) {
    const config = MOMENTUM_CONFIG.ADRENALINE;
    this.adrenaline = Math.min(config.max, this.adrenaline + amount);
  }

  // Spirit meter (separate from momentum)
  addSpirit(amount) {
    this.spirit = Math.max(0, Math.min(100, this.spirit + amount));
  }

  // Decay momentum over time
  update(dt, isFighting = false) {
    if (!isFighting) {
      this.decayTimer += dt;
      if (this.decayTimer >= 1.0) { // start decay after 1 second of no fighting
        this.current = Math.max(0, this.current - MOMENTUM_CONFIG.DECAY_RATE * dt);
        this.checkWWESlots();
      }
    } else {
      this.decayTimer = 0;
    }

    // Update special timer
    if (this.specialActive) {
      this.specialTimer -= dt;
      if (this.specialTimer <= 0) {
        this.specialActive = false;
        this.specialCharged = false;
        this.specialUsesLeft = 0;
      }
    }
  }

  // Reset for new match
  reset() {
    this.current = 0;
    this.adrenaline = MOMENTUM_CONFIG.ADRENALINE.max;
    this.spirit = 50;
    this.wweSlots = { W1: false, W2: false, E: false };
    this.slotsFilled = 0;
    this.specialCharged = false;
    this.specialActive = false;
    this.specialTimer = 0;
    this.specialUsesLeft = 0;
    this.momentumShiftUsed = false;
    this.momentumShiftAvailable = true;
    this.decayTimer = 0;
    this.lastGainTime = 0;
  }

  // Get UI info
  getUIInfo() {
    return {
      momentum: Math.round(this.current),
      max: this.max,
      pct: Math.round(this.momentumPct * 100),
      hasSignature: this.hasSignature,
      hasFinisher: this.hasFinisher,
      adrenaline: Math.round(this.adrenaline),
      spirit: Math.round(this.spirit),
      wweSlots: this.wweDisplay,
      specialCharged: this.specialCharged,
      specialActive: this.specialActive,
      specialUsesLeft: this.specialUsesLeft,
      momentumShiftAvailable: this.momentumShiftAvailable && !this.momentumShiftUsed,
    };
  }

  get momentumPct() { return this.current / this.max; }
}

// Spirit Meter (separate from momentum - DoR style)
export class SpiritMeter {
  constructor(initial = 50) {
    this.value = initial; // 0-100
    this.max = 100;
    this.color = 'yellow'; // blue, green, yellow, orange, red
    this.danger = false;
  }

  get normalized() { return this.value / this.max; }

  add(amount) {
    const old = this.value;
    this.value = Math.min(this.max, this.value + amount);
    this.updateColor();
    return this.value - old;
  }

  subtract(amount) {
    const old = this.value;
    this.value = Math.max(0, this.value - amount);
    this.updateColor();
    return old - this.value;
  }

  updateColor() {
    const pct = this.normalized;
    if (pct >= 0.8) this.color = 'red';
    else if (pct >= 0.6) this.color = 'orange';
    else if (pct >= 0.4) this.color = 'yellow';
    else if (pct >= 0.2) this.color = 'green';
    else this.color = 'blue';

    this.danger = this.value <= 15; // "Danger" threshold
  }

  get isDanger() { return this.danger; }
}

export default {
  MomentumManager,
  SpiritMeter,
  MOMENTUM_CONFIG,
};