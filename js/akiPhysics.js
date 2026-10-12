// AKI Engine Authentic Physics System
// Based on VPW64/No Mercy reverse engineering (Marty Monero, Melonbread, VPW Studio)

export const AKI_PHYSICS = {
  // Health & Spirit constants (authentic AKI values)
  MAX_HEALTH: 255,
  MAX_SPIRIT: 100,
  BASE_LIMB_CONDITION: 50,
  SPECIAL_CONDITION: 50,
  SPECIAL_DAMAGE_MULT: 1.2,
  SPIRIT_MAX_ADVANTAGE: 100, // spirit 100 vs 0
  MAX_DAMAGE_CAP: 642, // theoretical max in No Mercy
  MAX_HEALTH_DAMAGE: 213, // max health reduction per hit

  // Wakeup Timer (frames at 30fps equivalent)
  BASE_WAKEUP_TICKS: 1, // per frame reduction
  MASH_ACCELERATION: 2, // button mashing adds extra reduction
  WAKEUP_TIMER_BOOST: 1.0, // multiplier for ground strike connection
  IMPACT_WAKEUP_REDUCTION_MAX: 30, // anti-spam max reduction
  POST_SELL_REDUCTION: 15, // after sell animation ends

  // Grapple
  WEAK_GRAPPLE_WINDOW: 0.15, // tap threshold (seconds)
  STRONG_GRAPPLE_HOLD: 0.3, // hold threshold
  REVERSAL_BASE_CHANCE: 0.15,
  REVERSAL_SPIRIT_MOD: 0.005, // per spirit point
  COUNTER_WINDOW: 0.2, // seconds to counter

  // Damage formula weights (AKI: 3 sums + clamp)
  CONDITION_WEIGHT: 1.0,
  ATTACK_DEF_WEIGHT: 1.0,
  SPIRIT_WEIGHT: 0.05, // 5 points per spirit advantage

  // Move flags (bitfield) - authentic AKI
  MOVE_FLAGS: {
    WORKS_ON_GIANT: 1 << 12,      // bit 13 (0x1000) - slams, suplexes, powerbombs, piledrivers
    PINNING_HOLD: 1 << 7,          // bit 8 (0x80) - School Boy, La Mahistral
    ROPE_BREAK_IGNORE: 1 << 6,     // bit 7 (0x40) - ignore rope break
    SPLASH_TYPE: 1 << 3,           // bit 4 (0x08) - splash vs hold landing
    HIGH_FLYING: 1 << 2,           // bit 3 (0x04) - diving move
    RUNNING_GRAPPLE: 1 << 1,       // bit 2 (0x02) - running grapple
    GROUND_ONLY: 1 << 0,           // bit 1 (0x01) - ground move only
  },

  // Grapple types
  GRAPPLE_TYPES: {
    WEAK: 'weak',
    STRONG: 'strong',
    RUNNING: 'running',
    GROUND: 'ground',
    IRISH_WHIP: 'irish_whip',
    APRON: 'apron',
    TURNBUCKLE: 'turnbuckle',
  },

  // Spirit gain/loss (authentic AKI rates)
  SPIRIT: {
    WEAK_STRIKE_LAND: 1,
    STRONG_STRIKE_LAND: 3,
    WEAK_GRAPPLE_LAND: 2,
    STRONG_GRAPPLE_LAND: 5,
    REVERSAL_SUCCESS: 8,
    COUNTER_SUCCESS: 10,
    TAUNT_COMPLETE: 12,
    TAUNT_INTERRUPTED: -5,
    TAKE_DAMAGE: -3,
    TAKE_BIG_DAMAGE: -8,
    REVERSAL_FAILED: -4,
    GETUP: 2,
    FINISHER_LAND: 20,
    SPECIAL_ACTIVATED: 15,
  },
};

// Authentic AKI Damage Formula
// Three sums: condition + attack_vs_defense + spirit
export function calculateAKIDamage(attacker, defender, move, isSpecial = false) {
  const {
    BASE_LIMB_CONDITION,
    SPECIAL_CONDITION,
    SPECIAL_DAMAGE_MULT,
    SPIRIT_MAX_ADVANTAGE,
    MAX_DAMAGE_CAP,
    CONDITION_WEIGHT,
    ATTACK_DEF_WEIGHT,
    SPIRIT_WEIGHT,
  } = AKI_PHYSICS;

  // Part 1: Limb Condition (50 base, fixed at 50 in special)
  const condition = isSpecial ? SPECIAL_CONDITION : attacker.limbCondition || BASE_LIMB_CONDITION;
  const conditionMult = condition / BASE_LIMB_CONDITION;
  const specialMult = isSpecial ? SPECIAL_DAMAGE_MULT : 1.0;

  // Part 2: Attack vs Defense
  // attack stat vs defense stat (both 0-100 scale)
  const atk = attacker.attack || 50;
  const def = defender.defense || 50;
  const attackDefRatio = Math.max(0.2, atk / Math.max(1, def)); // min 0.2
  const attackDefDamage = move.baseDamage * attackDefRatio * ATTACK_DEF_WEIGHT;

  // Part 3: Spirit Advantage
  const atkSpirit = attacker.spirit || 0;
  const defSpirit = defender.spirit || 0;
  const spiritAdvantage = Math.max(-SPIRIT_MAX_ADVANTAGE, Math.min(SPIRIT_MAX_ADVANTAGE, atkSpirit - defSpirit));
  const spiritDamage = spiritAdvantage * SPIRIT_WEIGHT;

  // Base damage from move (guard: missing stats must never produce NaN)
  const bd = (move && isFinite(move.baseDamage)) ? move.baseDamage : 5;
  const baseDamage = bd * conditionMult * specialMult;

  // Three sums
  const sum1 = baseDamage * CONDITION_WEIGHT;
  const sum2 = attackDefDamage;
  const sum3 = spiritDamage;

  let totalDamage = Math.floor(sum1 + sum2 + sum3);
  if (!isFinite(totalDamage)) totalDamage = bd;

  // Clamp to max
  totalDamage = Math.min(totalDamage, MAX_DAMAGE_CAP);
  totalDamage = Math.max(1, totalDamage); // minimum 1

  // Health reduction (permanent max health damage) - only for big hits
  let maxHealthDamage = 0;
  if (totalDamage > 200) {
    maxHealthDamage = Math.floor((totalDamage / MAX_DAMAGE_CAP) * 213);
  }

  return {
    damage: totalDamage,
    maxHealthDamage,
    breakdown: { sum1, sum2, sum3, conditionMult, specialMult, attackDefRatio, spiritAdvantage }
  };
}

// Spirit Meter System (Attitude Meter = Spirit)
export class SpiritMeter {
  constructor(initial = 0) {
    this.value = initial;
    this.max = AKI_PHYSICS.MAX_SPIRIT;
    this.specialActive = false;
    this.specialTimer = 0;
    this.lastGain = 0;
  }

  get normalized() { return this.value / this.max; }
  get isFull() { return this.value >= this.max; }
  get isSpecial() { return this.specialActive; }

  add(amount, reason = '') {
    const old = this.value;
    this.value = Math.min(this.max, this.value + amount);
    this.lastGain = this.value - old;

    // Check special activation
    if (!this.specialActive && this.value >= this.max) {
      this.activateSpecial();
    }

    return this.lastGain;
  }

  subtract(amount, reason = '') {
    const old = this.value;
    this.value = Math.max(0, this.value - amount);
    this.lastGain = this.value - old;

    // Lose special if spirit drops too low
    if (this.specialActive && this.value < this.max * 0.8) {
      this.deactivateSpecial();
    }

    return old - this.value;
  }

  activateSpecial() {
    this.specialActive = true;
    this.specialTimer = 15; // 15 seconds of SPECIAL
    // In AKI, special fixes limb condition at 50 and gives 1.2x damage
  }

  deactivateSpecial() {
    this.specialActive = false;
    this.specialTimer = 0;
  }

  update(dt) {
    if (this.specialActive) {
      this.specialTimer -= dt;
      if (this.specialTimer <= 0) {
        this.deactivateSpecial();
      }
    }
    // Spirit slowly drains when not fighting
    if (this.value > 0) {
      this.value = Math.max(0, this.value - dt * 0.5);
    }
  }
}

// Wakeup Timer for Downed Opponents (Authentic AKI)
export class WakeupTimer {
  constructor() {
    this.timer = 0;
    this.maxTimer = 120; // ~4 seconds at 30fps base
    this.frozen = false;
    this.mashing = false;
  }

  set(ticks) {
    this.timer = Math.min(this.maxTimer, Math.max(0, ticks));
  }

  increase(ticks) {
    this.timer = Math.min(this.maxTimer, this.timer + ticks);
  }

  reduce(amount) {
    this.timer = Math.max(0, this.timer - amount);
  }

  // Called when attacker starts a ground strike
  // Authentic AKI: boost wakeup timer by move's connection frames
  boostForGroundStrike(connectionFrames) {
    this.increase(connectionFrames * AKI_PHYSICS.WAKEUP_TIMER_BOOST);
  }

  // Called at moment of impact (first frame of damage)
  // Anti-spam: reduce wakeup by remaining animation frames (capped at 30)
  reduceAtImpact(remainingFrames) {
    const reduction = Math.min(AKI_PHYSICS.IMPACT_WAKEUP_REDUCTION_MAX, remainingFrames);
    this.reduce(reduction);
  }

  // Called after sell animation ends (16 frames)
  // Rebalance: subtract 15 frames
  reducePostSell() {
    this.reduce(AKI_PHYSICS.POST_SELL_REDUCTION);
  }

  update(dt, isMashing = false) {
    if (this.frozen) return;
    const reduction = AKI_PHYSICS.BASE_WAKEUP_TICKS * (isMashing ? AKI_PHYSICS.MASH_ACCELERATION : 1);
    this.timer = Math.max(0, this.timer - reduction * dt * 30); // convert to per-frame
  }

  get isReady() { return this.timer <= 0; }
  get progress() { return 1 - (this.timer / this.maxTimer); }
}

// Reversal/Counter System (Authentic AKI)
export function calculateReversalChance(attacker, defender, isCounter = false) {
  const { REVERSAL_BASE_CHANCE, REVERSAL_SPIRIT_MOD, COUNTER_WINDOW } = AKI_PHYSICS;

  const spiritDiff = (defender.spirit || 0) - (attacker.spirit || 0);
  let chance = REVERSAL_BASE_CHANCE + (spiritDiff * REVERSAL_SPIRIT_MOD);

  if (isCounter) {
    chance *= 2.5; // Counters are much easier than reversals
  }

  // Clamp
  chance = Math.max(0.02, Math.min(0.95, chance));
  return chance;
}

export function attemptReversal(attacker, defender, isCounter = false) {
  const chance = calculateReversalChance(attacker, defender, isCounter);
  const success = Math.random() < chance;

  if (success) {
    // Spirit rewards
    const spiritGain = isCounter ? AKI_PHYSICS.SPIRIT.COUNTER_SUCCESS : AKI_PHYSICS.SPIRIT.REVERSAL_SUCCESS;
    defender.spirit = Math.min(100, (defender.spirit || 0) + spiritGain);
    attacker.spirit = Math.max(0, (attacker.spirit || 0) - (isCounter ? 10 : 5));
  } else {
    // Failed reversal penalty
    defender.spirit = Math.max(0, (defender.spirit || 0) - AKI_PHYSICS.SPIRIT.REVERSAL_FAILED);
  }

  return success;
}

// Ground Strike Wakeup Timer Mechanics
export function processGroundStrike(attacker, defender, move) {
  const connectionFrames = move.connectionFrames || 22; // frames until impact

  // 1. On start: boost defender's wakeup timer
  if (defender.wakeupTimer) {
    defender.wakeupTimer.boostForGroundStrike(connectionFrames);
  }

  // Return info for impact resolution
  return {
    connectionFrames,
    totalFrames: move.totalFrames || 45,
  };
}

export function resolveGroundStrikeImpact(attacker, defender, move, groundStrikeInfo) {
  // At impact: anti-spam reduction
  if (defender.wakeupTimer && groundStrikeInfo) {
    const remainingFrames = groundStrikeInfo.totalFrames - groundStrikeInfo.connectionFrames;
    defender.wakeupTimer.reduceAtImpact(remainingFrames);
  }
}

// Grapple System (Weak vs Strong)
export function determineGrappleType(holdDuration) {
  if (holdDuration >= AKI_PHYSICS.STRONG_GRAPPLE_HOLD) return 'strong';
  if (holdDuration <= AKI_PHYSICS.WEAK_GRAPPLE_WINDOW) return 'weak';
  return 'weak'; // default
}

export function processGrapple(attacker, defender, grappleType) {
  // In AKI, grapple gives advantage to initiator
  // But defender can reverse based on spirit
  const isReversal = attemptReversal(attacker, defender, false);

  if (isReversal) {
    return { success: false, reversed: true, message: 'REVERSED!' };
  }

  // Grapple succeeds - attacker has advantage
  attacker.grappleAdvantage = grappleType;
  defender.grappleDisadvantage = true;

  // Spirit gain for successful grapple
  const gain = grappleType === 'strong'
    ? AKI_PHYSICS.SPIRIT.STRONG_GRAPPLE_LAND
    : AKI_PHYSICS.SPIRIT.WEAK_GRAPPLE_LAND;
  attacker.spirit = Math.min(100, (attacker.spirit || 0) + gain);

  return { success: true, reversed: false, grappleType };
}

// Move Flags Helper
export function hasMoveFlag(move, flag) {
  return (move.flags & flag) !== 0;
}

export function getMoveFlagsForMove(moveName) {
  // Define flags for known moves (authentic AKI bits)
  const moveFlags = {
    'POWER BOMB': AKI_PHYSICS.MOVE_FLAGS.WORKS_ON_GIANT | AKI_PHYSICS.MOVE_FLAGS.HIGH_FLYING,
    'PILE DRIVER': AKI_PHYSICS.MOVE_FLAGS.WORKS_ON_GIANT,
    'VERTICAL SUPLEX': AKI_PHYSICS.MOVE_FLAGS.WORKS_ON_GIANT,
    'GERMAN SUPLEX': AKI_PHYSICS.MOVE_FLAGS.WORKS_ON_GIANT,
    'BODYSLAM': AKI_PHYSICS.MOVE_FLAGS.WORKS_ON_GIANT,
    'SPINE BUSTER': AKI_PHYSICS.MOVE_FLAGS.WORKS_ON_GIANT,
    'HURRICANRANA': AKI_PHYSICS.MOVE_FLAGS.PINNING_HOLD,
    'SHARPSHOOTER': AKI_PHYSICS.MOVE_FLAGS.PINNING_HOLD | AKI_PHYSICS.MOVE_FLAGS.ROPE_BREAK_IGNORE,
    'FIGURE-FOUR': AKI_PHYSICS.MOVE_FLAGS.PINNING_HOLD | AKI_PHYSICS.MOVE_FLAGS.ROPE_BREAK_IGNORE,
    'FROG SPLASH': AKI_PHYSICS.MOVE_FLAGS.SPLASH_TYPE | AKI_PHYSICS.MOVE_FLAGS.HIGH_FLYING,
    '450 VENOM SPLASH': AKI_PHYSICS.MOVE_FLAGS.SPLASH_TYPE | AKI_PHYSICS.MOVE_FLAGS.HIGH_FLYING,
    'CROSSBODY': AKI_PHYSICS.MOVE_FLAGS.SPLASH_TYPE | AKI_PHYSICS.MOVE_FLAGS.HIGH_FLYING,
    'MISSILE DROPKICK': AKI_PHYSICS.MOVE_FLAGS.HIGH_FLYING | AKI_PHYSICS.MOVE_FLAGS.RUNNING_GRAPPLE,
    'CLOTHESLINE': AKI_PHYSICS.MOVE_FLAGS.RUNNING_GRAPPLE,
    'DROPKICK': AKI_PHYSICS.MOVE_FLAGS.RUNNING_GRAPPLE,
    'STOMP': AKI_PHYSICS.MOVE_FLAGS.GROUND_ONLY,
    'ELBOW DROP': AKI_PHYSICS.MOVE_FLAGS.GROUND_ONLY,
    'DDT': 0,
    'NECK BREAKER': 0,
    'BACK BREAKER': 0,
    'SAMOAN DROP': 0,
    'SUPERKICK': 0,
    'CHOP': 0,
    'ELBOW SMASH': 0,
    'JAB': 0,
    'KITCHEN SINK KICK': 0,
  };

  return moveFlags[moveName] || 0;
}

export default {
  AKI_PHYSICS,
  calculateAKIDamage,
  SpiritMeter,
  WakeupTimer,
  calculateReversalChance,
  attemptReversal,
  processGroundStrike,
  resolveGroundStrikeImpact,
  determineGrappleType,
  processGrapple,
  hasMoveFlag,
  getMoveFlagsForMove,
};