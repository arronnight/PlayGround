// Limb Targeting System (WWE 2K Style)
// Target specific body parts to weaken opponents

export const LIMB_CONFIG = {
  // Limb definitions
  LIMBS: {
    HEAD: {
      id: 'head',
      name: 'Head',
      boneNames: ['atama', 'kubi', 'kuchi', 'me_l', 'me_r'],
      maxDamage: 100,
      criticalThreshold: 70,
      effects: {
        groggyChance: 0.02,      // per % damage
        reversalWindowReduction: 0.003,
        submissionEscapeReduction: 0.0025,
        dizzyDuration: 0.1,      // seconds per % damage
        koChance: 0.001,         // per % damage above critical
      },
      moves: ['head_strikes', 'head_grapples', 'head_submissions'],
    },
    LEFT_ARM: {
      id: 'left_arm',
      name: 'Left Arm',
      boneNames: ['kata_l', 'momo_x_l', 'ude_l', 'te_l'],
      maxDamage: 100,
      criticalThreshold: 70,
      effects: {
        strikeDamageReduction: 0.0025,
        grappleStrengthReduction: 0.003,
        submissionEscapeReduction: 0.004,
        liftImpairment: 0.002,
      },
      moves: ['arm_strikes', 'arm_grapples', 'arm_submissions'],
    },
    RIGHT_ARM: {
      id: 'right_arm',
      name: 'Right Arm',
      boneNames: ['kata_r', 'momo_x_r', 'ude_r', 'te_r'],
      maxDamage: 100,
      criticalThreshold: 70,
      effects: {
        strikeDamageReduction: 0.0025,
        grappleStrengthReduction: 0.003,
        submissionEscapeReduction: 0.004,
        liftImpairment: 0.002,
      },
      moves: ['arm_strikes', 'arm_grapples', 'arm_submissions'],
    },
    TORSO: {
      id: 'torso',
      name: 'Torso',
      boneNames: ['koshi', 'hara', 'mune'],
      maxDamage: 100,
      criticalThreshold: 70,
      effects: {
        staminaRegenReduction: 0.003,
        adrenalineDrainIncrease: 0.002,
        reversalWindowReduction: 0.002,
        windedThreshold: 0.002,
      },
      moves: ['body_strikes', 'body_grapples', 'body_submissions'],
    },
    LEFT_LEG: {
      id: 'left_leg',
      name: 'Left Leg',
      boneNames: ['momo_l', 'sune_l', 'ashi_l', 'tsumasaki_l'],
      maxDamage: 100,
      criticalThreshold: 70,
      effects: {
        speedReduction: 0.003,
        runStaminaCostIncrease: 0.005,
        diveImpairment: 0.005,
        balanceReduction: 0.003,
        kickPowerReduction: 0.004,
      },
      moves: ['leg_strikes', 'leg_grapples', 'leg_submissions'],
    },
    RIGHT_LEG: {
      id: 'right_leg',
      name: 'Right Leg',
      boneNames: ['momo_r', 'sune_r', 'ashi_r', 'tsumasaki_r'],
      maxDamage: 100,
      criticalThreshold: 70,
      effects: {
        speedReduction: 0.003,
        runStaminaCostIncrease: 0.005,
        diveImpairment: 0.005,
        balanceReduction: 0.003,
        kickPowerReduction: 0.004,
      },
      moves: ['leg_strikes', 'leg_grapples', 'leg_submissions'],
    },
  },

  // Damage multipliers by move type
  DAMAGE_MULTIPLIERS: {
    strike: { head: 1.2, arm: 1.0, torso: 1.0, leg: 0.8 },
    grapple: { head: 1.0, arm: 1.1, torso: 1.2, leg: 1.0 },
    submission: { head: 1.3, arm: 1.2, torso: 1.0, leg: 1.1 },
    high_flying: { head: 1.5, arm: 0.8, torso: 1.2, leg: 1.0 },
    weapon: { head: 1.4, arm: 1.0, torso: 1.1, leg: 1.0 },
  },

  // Limb targeting input combinations
  TARGETING_INPUTS: {
    HEAD: { button: 'Y', direction: 'up', hold: false },
    LEFT_ARM: { button: 'X', direction: 'left', hold: false },
    RIGHT_ARM: { button: 'X', direction: 'right', hold: false },
    TORSO: { button: 'Y', direction: 'down', hold: false },
    LEFT_LEG: { button: 'A', direction: 'left', hold: false },
    RIGHT_LEG: { button: 'A', direction: 'right', hold: false },
  },

  // Visual indicators
  UI: {
    damageColors: {
      healthy: '#4ade80',    // green
      minor: '#fbbf24',      // yellow
      moderate: '#f97316',   // orange
      severe: '#ef4444',     // red
      critical: '#7f1d1d',   // dark red
    },
    thresholds: {
      minor: 20,
      moderate: 40,
      severe: 60,
      critical: 80,
    },
  },
};

// Limb Targeting Manager
export class LimbTargetingManager {
  constructor(wrestler) {
    this.wrestler = wrestler;
    
    // Damage tracking per limb
    this.damage = {
      head: 0,
      left_arm: 0,
      right_arm: 0,
      torso: 0,
      left_leg: 0,
      right_leg: 0,
    };
    
    // Permanent damage (carries over matches in career)
    this.permanentDamage = {
      head: 0,
      left_arm: 0,
      right_arm: 0,
      torso: 0,
      left_leg: 0,
      right_leg: 0,
    };
    
    // Current target
    this.currentTarget = 'torso';
    this.targetLock = false;
    this.targetTimer = 0;
    
    // Visual effects
    this.limpTimer = 0;
    this.dizzyTimer = 0;
    this.armInjured = false;
    
    // Callbacks
    this.onTargetChange = null;
    this.onCriticalDamage = null;
    this.onInjuryEffect = null;
  }

  // Set target limb
  setTarget(limbId, lock = false) {
    if (!LIMB_CONFIG.LIMBS[limbId.toUpperCase()]) return false;
    
    this.currentTarget = limbId.toLowerCase();
    this.targetLock = lock;
    this.targetTimer = lock ? 5.0 : 0; // lock for 5 seconds
    
    if (this.onTargetChange) this.onTargetChange(this.currentTarget);
    return true;
  }

  // Cycle target (for player input)
  cycleTarget(direction) {
    const limbs = ['head', 'left_arm', 'right_arm', 'torso', 'left_leg', 'right_leg'];
    const currentIndex = limbs.indexOf(this.currentTarget);
    let newIndex = currentIndex + (direction > 0 ? 1 : -1);
    
    if (newIndex >= limbs.length) newIndex = 0;
    if (newIndex < 0) newIndex = limbs.length - 1;
    
    this.setTarget(limbs[newIndex]);
  }

  // Apply damage to current target
  applyDamage(amount, moveType = 'strike') {
    if (!this.currentTarget) return 0;
    
    const limb = LIMB_CONFIG.LIMBS[this.currentTarget.toUpperCase()];
    if (!limb) return 0;
    
    // Apply move type multiplier
    const multiplier = LIMB_CONFIG.DAMAGE_MULTIPLIERS[moveType]?.[this.currentTarget] || 1.0;
    const finalDamage = amount * multiplier;
    
    // Apply damage
    this.damage[this.currentTarget] = Math.min(limb.maxDamage, this.damage[this.currentTarget] + finalDamage);
    
    // Check critical threshold
    if (this.damage[this.currentTarget] >= limb.criticalThreshold && 
        this.damage[this.currentTarget] - finalDamage < limb.criticalThreshold) {
      this.triggerCriticalDamage(this.currentTarget);
    }
    
    // Update visual effects
    this.updateVisualEffects();
    
    return finalDamage;
  }

  // Apply damage to specific limb
  applyDamageToLimb(limbId, amount, moveType = 'strike') {
    const limb = LIMB_CONFIG.LIMBS[limbId.toUpperCase()];
    if (!limb) return 0;
    
    const multiplier = LIMB_CONFIG.DAMAGE_MULTIPLIERS[moveType]?.[limbId] || 1.0;
    const finalDamage = amount * multiplier;
    
    this.damage[limbId] = Math.min(limb.maxDamage, (this.damage[limbId] || 0) + finalDamage);
    
    if (this.damage[limbId] >= limb.criticalThreshold && 
        this.damage[limbId] - finalDamage < limb.criticalThreshold) {
      this.triggerCriticalDamage(limbId);
    }
    
    this.updateVisualEffects();
    return finalDamage;
  }

  // Trigger critical damage effects
  triggerCriticalDamage(limbId) {
    const effects = [
      'stun',
      'stumble',
      'drop_weapon',
      'forced_ground',
      'reversal_window_open',
    ];
    
    const effect = effects[Math.floor(Math.random() * effects.length)];
    
    if (this.onCriticalDamage) {
      this.onCriticalDamage(limbId, effect, this.damage[limbId]);
    }
  }

  // Update visual effects based on damage
  updateVisualEffects() {
    // Check for limp
    const legDamage = Math.max(this.damage.left_leg || 0, this.damage.right_leg || 0);
    if (legDamage > 50) {
      this.limpTimer = 10.0; // limp for 10 seconds
    }
    
    // Check for arm injury
    const armDamage = Math.max(this.damage.left_arm || 0, this.damage.right_arm || 0);
    this.armInjured = armDamage > 50;
    
    // Check for dizziness
    if ((this.damage.head || 0) > 60) {
      this.dizzyTimer = 5.0;
    }
  }

  // Get current effects on wrestler
  getEffects() {
    const effects = {
      speedMult: 1.0,
      damageMult: 1.0,
      reversalWindowMult: 1.0,
      staminaRegenMult: 1.0,
      canDive: true,
      canRun: true,
      canHeavyGrapple: true,
      submissionEscapeMult: 1.0,
    };
    
    // Head damage
    const headDmg = this.damage.head || 0;
    if (headDmg > 0) {
      effects.reversalWindowMult *= (1 - (headDmg / 100) * 0.5);
      effects.submissionEscapeMult = (effects.submissionEscapeMult || 1) * (1 - (headDmg / 100) * 0.3);
    }
    
    // Arm damage
    const armDmg = Math.max(this.damage.left_arm || 0, this.damage.right_arm || 0);
    if (armDmg > 0) {
      effects.damageMult *= (1 - (armDmg / 100) * 0.3);
      effects.submissionEscapeMult = (effects.submissionEscapeMult || 1) * (1 - (armDmg / 100) * 0.4);
      effects.grappleStrengthMult = (effects.grappleStrengthMult || 1) * (1 - (armDmg / 100) * 0.3);
    }
    
    // Torso damage
    const torsoDmg = this.damage.torso || 0;
    if (torsoDmg > 0) {
      effects.staminaRegenMult = (effects.staminaRegenMult || 1) * (1 - (torsoDmg / 100) * 0.4);
      effects.reversalWindowMult *= (1 - (torsoDmg / 100) * 0.3);
    }
    
    // Leg damage
    const legDmg = Math.max(this.damage.left_leg || 0, this.damage.right_leg || 0);
    if (legDmg > 0) {
      effects.speedMult = (effects.speedMult || 1) * (1 - (legDmg / 100) * 0.5);
      effects.canDive = legDmg < 70;
      effects.canRun = legDmg < 85;
      effects.canHeavyGrapple = legDmg < 80;
    }
    
    return effects;
  }

  // Get damage percentage for UI
  getDamagePercent(limbId) {
    const limb = LIMB_CONFIG.LIMBS[limbId.toUpperCase()];
    if (!limb) return 0;
    return (this.damage[limbId] || 0) / limb.maxDamage;
  }

  // Get damage state for UI
  getDamageState(limbId) {
    const pct = this.getDamagePercent(limbId) * 100;
    const thresholds = LIMB_CONFIG.UI.thresholds;
    
    if (pct >= thresholds.critical) return 'critical';
    if (pct >= thresholds.severe) return 'severe';
    if (pct >= thresholds.moderate) return 'moderate';
    if (pct >= thresholds.minor) return 'minor';
    return 'healthy';
  }

  // Get UI color for limb
  getUIColor(limbId) {
    const state = this.getDamageState(limbId);
    return LIMB_CONFIG.UI.damageColors[state] || '#4ade80';
  }

  // Reset for new match
  reset() {
    this.damage = {
      head: 0,
      left_arm: 0,
      right_arm: 0,
      torso: 0,
      left_leg: 0,
      right_leg: 0,
    };
    this.currentTarget = 'torso';
    this.targetLock = false;
    this.targetTimer = 0;
    this.limpTimer = 0;
    this.dizzyTimer = 0;
    this.armInjured = false;
  }

  // Update timers
  update(dt) {
    if (this.limpTimer > 0) this.limpTimer -= dt;
    if (this.dizzyTimer > 0) this.dizzyTimer -= dt;
    if (this.targetTimer > 0) {
      this.targetTimer -= dt;
      if (this.targetTimer <= 0) this.targetLock = false;
    }
  }

  // Get UI state
  getState() {
    return {
      damage: { ...this.damage },
      currentTarget: this.currentTarget,
      targetLock: this.targetLock,
      limpTimer: this.limpTimer,
      dizzyTimer: this.dizzyTimer,
      armInjured: this.armInjured,
      effects: this.getEffects(),
    };
  }
}

// AI Limb Targeting
export function aiLimbTargeting(ai, opponent, dt) {
  if (!opponent) return;
  
  const opp = opponent.limbTargeting;
  if (!opp) return;
  
  // Strategic targeting based on wrestler style
  const style = ai.def.style || 'balanced';
  const weights = {
    balanced: { head: 20, left_arm: 15, right_arm: 15, torso: 25, left_leg: 12, right_leg: 13 },
    powerhouse: { head: 15, left_arm: 10, right_arm: 10, torso: 30, left_leg: 17, right_leg: 18 },
    technician: { head: 15, left_arm: 20, right_arm: 20, torso: 15, left_leg: 15, right_leg: 15 },
    highflyer: { head: 25, left_arm: 15, right_arm: 15, torso: 15, left_leg: 15, right_leg: 15 },
    brawler: { head: 25, left_arm: 10, right_arm: 10, torso: 25, left_leg: 15, right_leg: 15 },
    giant: { head: 10, left_arm: 5, right_arm: 5, torso: 35, left_leg: 22, right_leg: 23 },
  };
  
  const styleWeights = weights[style] || weights.balanced;
  
  // Adjust based on opponent's current damage
  for (const limb of Object.keys(styleWeights)) {
    const oppDamage = opp.getDamagePercent(limb);
    styleWeights[limb] *= (1 + oppDamage); // target already damaged limbs
  }
  
  // Weighted random selection
  let total = 0;
  for (const w of Object.values(styleWeights)) total += w;
  
  let rand = Math.random() * total;
  for (const [limb, weight] of Object.entries(styleWeights)) {
    rand -= weight;
    if (rand <= 0) {
      opp.setTarget(limb);
      break;
    }
  }
  
  // Randomly switch targets occasionally
  if (Math.random() < 0.02 * dt) {
    opp.targetLock = false;
  }
}

export default {
  LimbTargetingManager,
  LIMB_CONFIG,
  aiLimbTargeting,
};