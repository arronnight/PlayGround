// Weight System (Day of Reckoning / WWE 2K Style)
// Weight detection, lift mechanics, heavy opponent mash mechanic

export const WEIGHT_CONFIG = {
  // Weight Classes (in lbs/kg)
  CLASSES: {
    CRUISERWEIGHT: { min: 0, max: 220, label: 'Cruiserweight', multiplier: 0.8 },
    LIGHTWEIGHT: { min: 220, max: 250, label: 'Lightweight', multiplier: 0.9 },
    MIDDLEWEIGHT: { min: 250, max: 280, label: 'Middleweight', multiplier: 1.0 },
    HEAVYWEIGHT: { min: 280, max: 320, label: 'Heavyweight', multiplier: 1.15 },
    SUPER_HEAVYWEIGHT: { min: 320, max: 400, label: 'Super Heavyweight', multiplier: 1.3 },
    GIANT: { min: 400, max: 999, label: 'Giant', multiplier: 1.5 },
  },

  // Weight detection
  DETECTION: {
    liftThreshold: 1.3, // weight ratio where mash mechanic kicks in
    impossibleThreshold: 2.0, // weight ratio where lift is impossible
    detectionRange: 3.0, // meters to detect weight
  },

  // Lift Mash Mechanic (DoR style)
  LIFT_MASH: {
    baseTime: 3.0,      // base seconds to fill meter
    meterWidth: 1.0,    // normalized 0-1
    fillRate: 0.25,     // per second with perfect mash
    drainRate: 0.1,     // drain per second when not mashing
    mashEffectiveness: 0.15, // per mash input
    staminaCost: 20,    // stamina to attempt lift
    staminaDrain: 10,   // stamina per second during lift
    successWindow: 0.8, // need to reach 80% to succeed
    perfectBonus: 0.2,  // bonus for perfect mash
  },

  // Weight Ratio Effects
  RATIO_EFFECTS: {
    // ratio = targetWeight / attackerWeight
    1.0: { liftable: true, mashRequired: false, speedMult: 1.0, damageMult: 1.0 },
    1.2: { liftable: true, mashRequired: false, speedMult: 0.9, damageMult: 0.95 },
    1.3: { liftable: true, mashRequired: true, speedMult: 0.7, damageMult: 0.9 },
    1.5: { liftable: true, mashRequired: true, speedMult: 0.5, damageMult: 0.8 },
    1.8: { liftable: true, mashRequired: true, speedMult: 0.3, damageMult: 0.7 },
    2.0: { liftable: false, mashRequired: false, speedMult: 0, damageMult: 0 },
  },

  // Lift Types
  LIFT_TYPES: {
    SLAM: { name: 'Body Slam', baseTime: 2.5, damage: 12, stamina: 15 },
    SUPLEX: { name: 'Suplex', baseTime: 3.0, damage: 18, stamina: 20 },
    POWERBOMB: { name: 'Powerbomb', baseTime: 3.5, damage: 25, stamina: 25 },
    PILEDRIVER: { name: 'Piledriver', baseTime: 3.0, damage: 22, stamina: 22 },
    BODY_SLAM: { name: 'Body Slam', baseTime: 2.0, damage: 10, stamina: 10 },
    OVERHEAD: { name: 'Overhead Throw', baseTime: 2.8, damage: 15, stamina: 18 },
    POWERSLAM: { name: 'Powerslam', baseTime: 3.2, damage: 20, stamina: 22 },
    CHOKESLAM: { name: 'Chokeslam', baseTime: 2.5, damage: 18, stamina: 15 },
  },

  // Weight Class Bonuses
  CLASS_BONUSES: {
    CRUISERWEIGHT: { speed: 1.2, stamina: 1.1, highFly: 1.3, lift: 0.7 },
    LIGHTWEIGHT: { speed: 1.1, stamina: 1.05, highFly: 1.2, lift: 0.85 },
    MIDDLEWEIGHT: { speed: 1.0, stamina: 1.0, highFly: 1.0, lift: 1.0 },
    HEAVYWEIGHT: { speed: 0.9, stamina: 1.1, highFly: 0.8, lift: 1.2 },
    SUPER_HEAVYWEIGHT: { speed: 0.8, stamina: 1.2, highFly: 0.7, lift: 1.4 },
    GIANT: { speed: 0.6, stamina: 1.3, highFly: 0.5, lift: 1.6 },
  },

  // UI
  UI: {
    meterWidth: 300,
    meterHeight: 20,
    sweetSpotWidth: 0.2,
    meterColor: '#ffd23f',
    backgroundColor: '#333333',
    borderColor: '#ffd23f',
  },
};

// Weight Class Helper
export function getWeightClass(weight) {
  for (const [key, cls] of Object.entries(WEIGHT_CONFIG.CLASSES)) {
    if (weight >= cls.min && weight < cls.max) {
      return { class: key, ...cls };
    }
  }
  return { class: 'GIANT', ...WEIGHT_CONFIG.CLASSES.GIANT };
}

export function getWeightRatio(attackerWeight, targetWeight) {
  return targetWeight / attackerWeight;
}

export function getLiftDifficulty(attackerWeight, targetWeight) {
  const ratio = getWeightRatio(attackerWeight, targetWeight);
  
  if (ratio <= 1.0) return { difficulty: 'easy', mashRequired: false, multiplier: 1.0 };
  if (ratio <= 1.2) return { difficulty: 'easy', mashRequired: false, multiplier: 0.95 };
  if (ratio <= 1.3) return { difficulty: 'moderate', mashRequired: true, multiplier: 0.85 };
  if (ratio <= 1.5) return { difficulty: 'hard', mashRequired: true, multiplier: 0.75 };
  if (ratio <= 1.8) return { difficulty: 'very_hard', mashRequired: true, multiplier: 0.6 };
  if (ratio <= 2.0) return { difficulty: 'extreme', mashRequired: true, multiplier: 0.4 };
  return { difficulty: 'impossible', mashRequired: false, multiplier: 0, liftable: false };
}

// Weight System Manager
export class WeightManager {
  constructor(wrestler) {
    this.wrestler = wrestler;
    this.weight = wrestler.def?.weight || 250; // default 250 lbs
    this.weightClass = getWeightClass(this.weight);
    
    // Lift state
    this.lifting = false;
    this.liftTarget = null;
    this.liftType = null;
    this.liftProgress = 0;
    this.liftStartTime = 0;
    this.liftDuration = 0;
    this.mashInputs = 0;
    this.mashTimer = 0;
    this.liftSuccess = false;
    this.liftFailed = false;
    
    // Opponent weight
    this.targetWeight = 0;
    this.targetWeightClass = null;
    this.weightRatio = 1.0;
    this.liftDifficulty = null;
    
    // Stamina
    this.staminaDrainTimer = 0;
    
    // Callbacks
    this.onLiftStart = null;
    this.onLiftProgress = null;
    this.onLiftSuccess = null;
    this.onLiftFail = null;
    this.onLiftEnd = null;
  }

  // Attempt to lift target
  attemptLift(target, liftType = 'SLAM') {
    if (this.lifting) return { success: false, reason: 'already_lifting' };
    if (!target) return { success: false, reason: 'no_target' };
    
    // Check stamina
    const liftConfig = WEIGHT_CONFIG.LIFT_TYPES[liftType] || WEIGHT_CONFIG.LIFT_TYPES.SLAM;
    if (this.wrestler.stamina < liftConfig.stamina) {
      return { success: false, reason: 'insufficient_stamina' };
    }
    
    // Get target weight
    this.targetWeight = target.def?.weight || 250;
    this.targetWeightClass = getWeightClass(this.targetWeight);
    this.weightRatio = getWeightRatio(this.weight, this.targetWeight);
    this.liftDifficulty = getLiftDifficulty(this.weight, this.targetWeight);
    
    // Check if liftable
    if (!this.liftDifficulty.liftable) {
      return { 
        success: false, 
        reason: 'too_heavy', 
        ratio: this.weightRatio,
        message: `${target.def.name} is too heavy to lift!`
      };
    }
    
    // Check if mash required
    if (this.liftDifficulty.mashRequired) {
      return this.startMashLift(target, liftType, liftConfig);
    }
    
    // Easy lift - no mash needed
    return this.startEasyLift(target, liftType, liftConfig);
  }

  // Start mash-based lift
  startMashLift(target, liftType, liftConfig) {
    this.lifting = true;
    this.liftTarget = target;
    this.liftType = liftType;
    this.liftProgress = 0;
    this.liftStartTime = performance.now() / 1000;
    this.liftDuration = liftConfig.baseTime * this.liftDifficulty.multiplier;
    this.mashInputs = 0;
    this.mashTimer = 0;
    
    // Consume stamina
    this.wrestler.stamina = Math.max(0, this.wrestler.stamina - liftConfig.stamina);
    
    // Set target state
    target.state = 'lifted';
    target.liftedBy = this.wrestler;
    target.liftStartTime = this.liftStartTime;
    target.liftType = liftType;
    
    if (this.onLiftStart) this.onLiftStart(target, liftType, this.liftDifficulty);
    
    return { 
      success: true, 
      mashRequired: true, 
      duration: this.liftDuration,
      difficulty: this.liftDifficulty.difficulty,
    };
  }

  // Start easy lift (no mash)
  startEasyLift(target, liftType, liftConfig) {
    this.lifting = true;
    this.liftTarget = target;
    this.liftType = liftType;
    this.liftProgress = 1; // instant success
    this.liftStartTime = performance.now() / 1000;
    this.liftDuration = liftConfig.baseTime * 0.5; // faster
    
    // Consume reduced stamina
    this.wrestler.stamina = Math.max(0, this.wrestler.stamina - liftConfig.stamina * 0.5);
    
    target.state = 'lifted';
    target.liftedBy = this.wrestler;
    
    // Auto-complete after short delay
    setTimeout(() => {
      this.completeLift(target, liftType, true);
    }, this.liftDuration * 500);
    
    if (this.onLiftStart) this.onLiftStart(target, liftType, this.liftDifficulty);
    
    return { success: true, mashRequired: false, instant: true };
  }

  // Update lift progress
  update(dt, input = {}) {
    if (!this.lifting || !this.liftTarget) return;
    
    const now = performance.now() / 1000;
    const elapsed = now - this.liftStartTime;
    
    // Handle mash input
    if (input.mash) {
      this.mashInputs++;
      this.mashTimer = 0.3;
      const fillAmount = WEIGHT_CONFIG.LIFT_MASH.mashEffectiveness * 
                        (this.wrestler.stamina / this.wrestler.maxStamina);
      this.liftProgress = Math.min(1, this.liftProgress + fillAmount);
    } else if (this.mashTimer > 0) {
      this.mashTimer -= dt;
    }
    
    // Natural drain
    this.liftProgress = Math.max(0, this.liftProgress - WEIGHT_CONFIG.LIFT_MASH.drainRate * dt);
    
    // Stamina drain
    this.staminaDrainTimer += dt;
    if (this.staminaDrainTimer >= 1.0) {
      const liftConfig = WEIGHT_CONFIG.LIFT_TYPES[this.liftType] || WEIGHT_CONFIG.LIFT_TYPES.SLAM;
      this.wrestler.stamina = Math.max(0, this.wrestler.stamina - liftConfig.stamina * dt);
      this.staminaDrainTimer = 0;
    }
    
    // Update progress callback
    if (this.onLiftProgress) {
      this.onLiftProgress(this.liftProgress, this.liftProgress >= WEIGHT_CONFIG.LIFT_MASH.successWindow);
    }
    
    // Check success
    if (this.liftProgress >= WEIGHT_CONFIG.LIFT_MASH.successWindow) {
      this.completeLift(this.liftTarget, this.liftType, true);
      return;
    }
    
    // Check timeout
    if (elapsed >= this.liftDuration) {
      this.failLift('timeout');
    }
    
    // Check stamina depletion
    if (this.wrestler.stamina <= 0) {
      this.failLift('exhausted');
    }
  }

  // Complete lift successfully
  completeLift(target, liftType, success) {
    this.lifting = false;
    this.liftSuccess = success;
    
    if (success) {
      // Apply damage
      const liftConfig = WEIGHT_CONFIG.LIFT_TYPES[liftType];
      const damage = liftConfig.damage * this.liftDifficulty.multiplier;
      // applyDamage would be called here
      
      target.state = 'down';
      target.downT = liftConfig.baseTime * 0.5;
      
      // Momentum gain
      this.wrestler.momentum = Math.min(150, (this.wrestler.momentum || 0) + 15);
      
      if (this.onLiftSuccess) this.onLiftSuccess(target, liftType, this.liftDifficulty);
    } else {
      if (this.onLiftFail) this.onLiftFail(target, 'failed');
    }
    
    // Reset target state
    target.state = success ? 'down' : 'idle';
    target.liftedBy = null;
    target.liftType = null;
    
    this.resetLiftState();
    
    if (this.onLiftEnd) this.onLiftEnd(target, success);
  }

  // Fail lift
  failLift(reason) {
    this.lifting = false;
    this.liftFailed = true;
    this.liftSuccess = false;
    
    if (this.liftTarget) {
      this.liftTarget.state = 'idle';
      this.liftTarget.liftedBy = null;
    }
    
    // Stumble effect
    this.wrestler.state = 'stunned';
    this.wrestler.stunTimer = 1.0;
    
    if (this.onLiftFail) this.onLiftFail(this.liftTarget, reason);
    if (this.onLiftEnd) this.onLiftEnd(this.liftTarget, false);
    
    this.resetLiftState();
  }

  resetLiftState() {
    this.lifting = false;
    this.liftTarget = null;
    this.liftType = null;
    this.liftProgress = 0;
    this.liftStartTime = 0;
    this.liftDuration = 0;
    this.mashInputs = 0;
    this.mashTimer = 0;
    this.liftSuccess = false;
    this.liftFailed = false;
  }

  // Get lift meter state for UI
  getMeterState() {
    if (!this.lifting) return null;
    
    return {
      active: true,
      progress: this.liftProgress,
      successThreshold: WEIGHT_CONFIG.LIFT_MASH.successWindow,
      timeRemaining: Math.max(0, this.liftDuration - (performance.now() / 1000 - this.liftStartTime)),
      difficulty: this.liftDifficulty?.difficulty || 'unknown',
      mashInputs: this.mashInputs,
      weightRatio: this.weightRatio,
      targetWeight: this.targetWeight,
      targetName: this.liftTarget?.def?.name,
      liftType: this.liftType,
    };
  }

  // Get weight class bonuses
  getClassBonuses() {
    return WEIGHT_CONFIG.CLASS_BONUSES[this.weightClass.class] || WEIGHT_CONFIG.CLASS_BONUSES.MIDDLEWEIGHT;
  }

  // Apply class bonuses to wrestler
  applyClassBonuses() {
    const bonuses = this.getClassBonuses();
    this.wrestler.speedMult = (this.wrestler.speedMult || 1) * bonuses.speed;
    this.wrestler.staminaMult = (this.wrestler.staminaMult || 1) * bonuses.stamina;
    this.wrestler.highFlyMult = (this.wrestler.highFlyMult || 1) * bonuses.highFly;
    this.wrestler.liftMult = (this.wrestler.liftMult || 1) * bonuses.lift;
  }
}

// AI Weight Decisions
export function aiWeightDecision(ai, opponent, dt) {
  if (!opponent) return;
  
  const ratio = getWeightRatio(ai.weightManager?.weight || 250, opponent.def?.weight || 250);
  const difficulty = getLiftDifficulty(ai.weightManager?.weight || 250, opponent.def?.weight || 250);
  
  // Don't attempt impossible lifts
  if (!difficulty.liftable) return;
  
  // Decide whether to attempt lift based on difficulty and situation
  if (difficulty.mashRequired) {
    // Only attempt if we have momentum advantage or opponent is stunned
    if (ai.momentum > opponent.momentum + 20 || opponent.state === 'stunned') {
      // Attempt lift
      return { attempt: true, type: 'POWERBOMB' };
    }
  } else {
    // Easy lift - attempt more freely
    if (ai.def.str > 7 || Math.random() < 0.3) {
      return { attempt: true, type: 'SUPLEX' };
    }
  }
  
  return { attempt: false };
}

export default {
  WeightManager,
  WEIGHT_CONFIG,
  getWeightClass,
  getWeightRatio,
  getLiftDifficulty,
  aiWeightDecision,
};