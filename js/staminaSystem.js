// Stamina System (DoR2 / WWE 2K Style)
// Depletes with moves/running, affects speed/damage/recovery, rest holds regen

export const STAMINA_CONFIG = {
  // Base values
  MAX_STAMINA: 100,
  BASE_REGEN: 3,           // per second when idle
  REST_HOLD_REGEN: 15,     // per second during rest hold
  CRITICAL_THRESHOLD: 20,  // below this = winded state
  EXHAUSTED_THRESHOLD: 5,  // below this = severely impaired

  // Stamina costs per action type
  COSTS: {
    // Movement
    run_per_sec: 8,
    sprint_per_sec: 15,
    climb_turnbuckle: 5,
    climb_ladder: 8,
    exit_ring: 3,
    enter_ring: 5,

    // Strikes
    light_strike: 2,
    heavy_strike: 5,
    running_strike: 8,
    strike_combo: 12,

    // Grapples
    light_grapple: 6,
    heavy_grapple: 12,
    chain_grapple: 4,
    running_grapple: 10,
    irish_whip: 8,
    lift_opponent: 15,

    // High impact
    suplex: 18,
    powerbomb: 25,
    piledriver: 30,
    dive: 20,
    finisher: 30,

    // Submissions
    submission_apply: 10,
    submission_hold_per_sec: 5,
    rest_hold_regen: 15,

    // Defense
    reversal: 15,
    counter: 10,
    dodge: 8,
    kickout: 20,
    rope_break: 15,

    // Weapons
    pickup_weapon: 3,
    weapon_swing: 8,
    weapon_throw: 10,

    // Environment
    climb_turnbuckle: 5,
    climb_ladder: 8,
    announce_table_clear: 5,
  },

  // Winded state effects
  WINDPEED_EFFECTS: {
    speed_mult: 0.6,
    damage_mult: 0.7,
    reversal_window_mult: 0.5,
    stun_duration_mult: 1.5,
    cannot_run: true,
    heavy_breathing: true,
  },

  EXHAUSTED_EFFECTS: {
    speed_mult: 0.3,
    damage_mult: 0.5,
    reversal_window_mult: 0.25,
    stun_duration_mult: 2.5,
    cannot_run: true,
    cannot_heavy_grapple: true,
    cannot_dive: true,
    heavy_breathing: true,
    stumble_chance: 0.3,
  },

  // Recovery
  RECOVERY: {
    idle_regen_delay: 2,      // seconds before regen starts after action
    winded_recovery_time: 8,  // seconds to recover from winded
    exhausted_recovery_time: 15, // seconds to recover from exhausted
  },

  // Stamina bar UI
  UI: {
    warning_threshold: 30,    // yellow warning
    critical_threshold: 15,   // orange warning
    exhausted_threshold: 5,   // red critical
  },
};

// Stamina Manager Class
export class StaminaManager {
  constructor(def = {}) {
    this.max = STAMINA_CONFIG.MAX_STAMINA;
    this.current = this.max;
    this.stamina = def.stamina || 50; // base stamina stat (0-100)
    this.max = STAMINA_CONFIG.MAX_STAMINA * (0.5 + this.stamina / 200); // 50-150 range

    this.current = this.max;
    this.lastActionTime = 0;
    this.state = 'normal'; // normal, winded, exhausted, recovering
    this.regenTimer = 0;
    this.windedTimer = 0;
    this.exhaustedTimer = 0;
    this.lastAction = null;
    this.actionHistory = []; // for stamina drain tracking
  }

  get currentStamina() { return this.current; }
  get maxStamina() { return this.max; }
  get normalized() { return this.current / this.max; }
  get isWinded() { return this.state === 'winded'; }
  get isExhausted() { return this.state === 'exhausted'; }
  get canRun() { return this.current > STAMINA_CONFIG.COSTS.run_per_sec && !this.isExhausted; }
  get canHeavyGrapple() { return this.current > STAMINA_CONFIG.COSTS.heavy_grapple && !this.isExhausted; }
  get canDive() { return this.current > STAMINA_CONFIG.COSTS.dive && !this.isExhausted; }

  // Apply stamina cost for an action
  consume(actionType, customCost = null) {
    const cost = customCost || STAMINA_CONFIG.COSTS[actionType] || 0;
    if (cost <= 0) return true;

    const prevState = this.state;
    this.current = Math.max(0, this.current - cost);
    this.lastActionTime = performance.now() / 1000;
    this.lastAction = actionType;
    this.actionHistory.push({ type: actionType, cost, time: this.lastActionTime });
    if (this.actionHistory.length > 20) this.actionHistory.shift();

    this.updateState();
    return this.current > 0;
  }

  // Try to consume, return false if not enough stamina
  tryConsume(actionType) {
    const cost = STAMINA_CONFIG.COSTS[actionType] || 0;
    if (this.current >= cost) {
      return this.consume(actionType);
    }
    return false;
  }

  // Rest hold regeneration (during submission)
  restHold(dt) {
    const regen = STAMINA_CONFIG.REST_HOLD_REGEN * dt;
    this.current = Math.min(this.max, this.current + regen);
    this.updateState();
  }

  // Update stamina state and regeneration
  update(dt, isIdle = false, isRunning = false, isResting = false) {
    // Running drains stamina continuously
    if (isRunning) {
      this.consume('run_per_sec', STAMINA_CONFIG.COSTS.run_per_sec * dt);
    }

    // Sprinting drains more
    if (isRunning && this.isSprinting) {
      this.consume('sprint_per_sec', STAMINA_CONFIG.COSTS.sprint_per_sec * dt);
    }

    // Regen when idle
    const now = performance.now() / 1000;
    const timeSinceAction = now - this.lastActionTime;

    if (isIdle || isResting) {
      this.regenTimer += dt;
      if (this.regenTimer >= STAMINA_CONFIG.RECOVERY.idle_regen_delay) {
        const baseRegen = STAMINA_CONFIG.BASE_REGEN * (this.stamina / 50);
        const regen = baseRegen * dt;
        this.current = Math.min(this.max, this.current + regen);
      }
    } else {
      this.regenTimer = 0;
    }

    // Winded/Exhausted recovery timers
    if (this.state === 'winded') {
      this.windedTimer += dt;
      if (this.windedTimer >= STAMINA_CONFIG.RECOVERY.winded_recovery_time && this.current > STAMINA_CONFIG.CRITICAL_THRESHOLD) {
        this.state = 'normal';
        this.windedTimer = 0;
      }
    } else if (this.state === 'exhausted') {
      this.exhaustedTimer += dt;
      if (this.exhaustedTimer >= STAMINA_CONFIG.RECOVERY.exhausted_recovery_time && this.current > STAMINA_CONFIG.EXHAUSTED_THRESHOLD) {
        this.state = 'winded';
        this.exhaustedTimer = 0;
      }
    }

    this.updateState();
  }

  updateState() {
    const pct = this.normalized;

    if (pct <= 0) {
      this.state = 'exhausted';
    } else if (pct <= STAMINA_CONFIG.EXHAUSTED_THRESHOLD / this.max * 100) {
      this.state = 'exhausted';
    } else if (pct <= STAMINA_CONFIG.CRITICAL_THRESHOLD / this.max * 100) {
      if (this.state !== 'exhausted') this.state = 'winded';
    } else if (this.state === 'winded' && pct > STAMINA_CONFIG.CRITICAL_THRESHOLD / this.max * 100 * 1.5) {
      this.state = 'normal';
    } else if (this.state === 'exhausted' && pct > STAMINA_CONFIG.EXHAUSTED_THRESHOLD / this.max * 100 * 2) {
      this.state = 'winded';
    }
  }

  // Get current effects based on state
  getEffects() {
    if (this.state === 'exhausted') return STAMINA_CONFIG.EXHAUSTED_EFFECTS;
    if (this.state === 'winded') return STAMINA_CONFIG.WINDPEED_EFFECTS;
    return {};
  }

  // Apply winded/exhausted effects to wrestler
  applyEffects(wrestler) {
    const effects = this.getEffects();
    if (effects.speed_mult) {
      wrestler.speedMult = effects.speed_mult;
    }
    if (effects.damage_mult) {
      wrestler.damageMult = effects.damage_mult;
    }
    if (effects.reversal_window_mult) {
      wrestler.reversalWindowMult = effects.reversal_window_mult;
    }
    if (effects.stun_duration_mult) {
      wrestler.stunDurationMult = effects.stun_duration_mult;
    }
    if (effects.cannot_run) {
      wrestler.canRun = false;
    }
    if (effects.cannot_heavy_grapple) {
      wrestler.canHeavyGrapple = false;
    }
    if (effects.cannot_dive) {
      wrestler.canDive = false;
    }
    if (effects.stumble_chance && Math.random() < effects.stumble_chance) {
      // Trigger stumble animation
      wrestler.triggerStumble();
    }
  }

  // Rest hold during submission (called from submission system)
  applyRestHold(dt) {
    const regen = STAMINA_CONFIG.REST_HOLD_REGEN * dt;
    this.current = Math.min(this.max, this.current + regen);
    this.updateState();
  }

  // Reset (for new match)
  reset() {
    this.current = this.max;
    this.state = 'normal';
    this.regenTimer = 0;
    this.windedTimer = 0;
    this.exhaustedTimer = 0;
    this.lastActionTime = performance.now() / 1000;
  }

  // Get stamina for UI
  getUIInfo() {
    return {
      current: Math.round(this.current),
      max: Math.round(this.max),
      pct: Math.round(this.normalized * 100),
      state: this.state,
      warning: this.normalized < STAMINA_CONFIG.UI.warning_threshold / 100,
      critical: this.normalized < STAMINA_CONFIG.UI.critical_threshold / 100,
      exhausted: this.normalized < STAMINA_CONFIG.UI.exhausted_threshold / 100,
    };
  }
}

// Global stamina config for easy tweaking
export function setStaminaConfig(key, value) {
  if (STAMINA_CONFIG[key] !== undefined) {
    STAMINA_CONFIG[key] = value;
  } else if (STAMINA_CONFIG.COSTS[key] !== undefined) {
    STAMINA_CONFIG.COSTS[key] = value;
  }
}

export default { StaminaManager, STAMINA_CONFIG, setStaminaConfig };