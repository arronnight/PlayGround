// Submission System (WWE 2K Breaking Point + AKI Rope Break)
// Breaking Point mini-game + rope break + struggle mechanics

export const SUBMISSION_CONFIG = {
  // Breaking Point Mini-game
  BREAKING_POINT: {
    barWidth: 1.0,
    attackerSliderWidth: 0.12,    // 12% of bar
    defenderSliderWidth: 0.18,    // 18% of bar (easier to escape)
    attackerSpeed: 0.6,           // speed of attacker slider
    defenderSpeed: 0.8,           // speed of defender slider
    fillRate: 0.15,               // fill per second when in sweet spot
    drainRate: 0.08,              // drain per second when not in sweet spot
    struggleFill: 0.02,           // fill per mash input
    maxDuration: 30,              // max seconds before forced break
    ropeBreakZone: 0.15,          // 15% of bar near ropes = rope break
  },

  // Submission Types
  TYPES: {
    DAMAGE: {
      id: 'damage',
      name: 'Damage',
      description: 'Focus on dealing maximum damage',
      fillRate: 1.2,
      staminaDrain: 0.8,
      escapeDifficulty: 1.0,
      damagePerSec: 3,
    },
    STAMINA_DRAIN: {
      id: 'stamina_drain',
      name: 'Drain Stamina',
      description: 'Exhaust opponent\'s stamina',
      fillRate: 1.0,
      staminaDrain: 2.0,
      escapeDifficulty: 0.9,
      damagePerSec: 1,
    },
    REST_HOLD: {
      id: 'rest_hold',
      name: 'Rest Hold',
      description: 'Regenerate your own stamina',
      fillRate: 0.3,
      staminaRegen: 2.0,
      escapeDifficulty: 1.3,
      damagePerSec: 0,
    },
    HUMILIATION: {
      id: 'humiliation',
      name: 'Humiliation',
      description: 'Build momentum/crowd heat',
      fillRate: 0.8,
      momentumGain: 3,
      escapeDifficulty: 1.1,
      damagePerSec: 0.5,
    },
    TAUNT: {
      id: 'taunt',
      name: 'Show Off',
      description: 'Pump up crowd for momentum',
      fillRate: 0.5,
      momentumGain: 5,
      escapeDifficulty: 1.2,
      damagePerSec: 0,
    },
  },

  // Rope Break
  ROPE_BREAK: {
    distance: 2.5,           // max distance from ropes
    autoBreakChance: 0.7,    // 70% chance if near ropes
    manualBreakChance: 0.9,  // 90% if player mashes
    staminaCost: 15,         // stamina to break
    cooldown: 5,             // seconds before can rope break again
  },

  // Struggle Mechanics
  STRUGGLE: {
    baseEscapeTime: 8,       // base seconds to escape
    mashEffectiveness: 0.12, // per mash input
    staminaWeight: 0.01,     // per stamina point
    damageWeight: 0.02,      // per % damage taken
    limbDamageWeight: 0.05,  // per limb damage %
    submissionSkillWeight: 0.02, // per submission stat
    maxDuration: 25,         // forced break after this
  },

  // Limb Damage Effects
  LIMB_EFFECTS: {
    head: {
      groggyChance: 0.3,
      reversalWindowReduction: 0.3,
      submissionEscapeReduction: 0.25,
    },
    arm: {
      strikeDamageReduction: 0.25,
      grappleStrengthReduction: 0.3,
      submissionEscapeReduction: 0.4,
    },
    torso: {
      staminaRegenReduction: 0.3,
      adrenalineDrainIncrease: 0.25,
      reversalWindowReduction: 0.2,
    },
    leg: {
      speedReduction: 0.3,
      runStaminaCostIncrease: 0.5,
      diveImpaired: true,
      reversalImpaired: true,
    },
  },

  // Pinning Hold Bonus (Breaking Point)
  PINNING_HOLDS: [
    'school_boy', 'la_mahistral', 'small_package', 'roll_up',
    'crucifix', 'inside_cradle', 'backslide', 'jackknife'
  ],

  // Rope Break Types
  ROPE_BREAK_TYPES: {
    AUTO: 'auto',           // automatic when near ropes
    MANUAL: 'manual',       // player mashes button
    REFEREE: 'referee',     // ref forces break at 5-count
  },
};

// Submission Manager
export class SubmissionManager {
  constructor(wrestler) {
    this.wrestler = wrestler;
    this.opponent = null;
    
    // State
    this.active = false;
    this.type = null;
    this.submitter = null;     // who applied the hold
    this.victim = null;        // who is in the hold
    this.startTime = 0;
    
    // Breaking Point
    this.breakingPointActive = false;
    this.attackerSlider = 0.5;    // 0-1 position
    this.defenderSlider = 0.5;    // 0-1 position
    this.submissionProgress = 0;  // 0-1 (1 = tap out)
    this.sweetSpot = 0;           // center of sweet spot
    this.sweetSpotWidth = 0.15;
    
    // Struggle
    this.mashInputs = 0;
    this.mashTimer = 0;
    this.autoMash = false;
    
    // Rope Break
    this.ropeBreakAvailable = true;
    this.ropeBreakCooldown = 0;
    this.nearRopes = false;
    this.ropeBreakType = null;
    
    // Limb Targeting
    this.targetLimb = 'torso'; // head, arm, torso, leg
    this.limbDamage = { head: 0, arm: 0, torso: 0, leg: 0 };
    
    // Callbacks
    onTapOut: null,
    onEscape: null,
    onRopeBreak: null,
    onTypeChange: null,
  }

  // Start submission
  start(submitter, victim, type = 'damage', targetLimb = 'torso') {
    this.active = true;
    this.submitter = submitter;
    this.victim = victim;
    this.type = SUBMISSION_CONFIG.TYPES[type] || SUBMISSION_CONFIG.TYPES.damage;
    this.targetLimb = targetLimb;
    this.startTime = performance.now() / 1000;
    
    // Swap roles if victim is this wrestler
    if (this.wrestler === victim) {
      // We are the victim
      this.breakingPointActive = true;
      this.attackerSlider = 0.5;
      this.defenderSlider = 0.5;
      this.submissionProgress = 0;
      this.generateSweetSpot();
    }
    
    this.startTime = performance.now() / 1000;
    this.mashInputs = 0;
    this.mashTimer = 0;
    this.ropeBreakAvailable = true;
    this.ropeBreakCooldown = 0;
    this.nearRopes = false;
    this.limbDamage = { head: 0, arm: 0, torso: 0, leg: 0 };
    this.targetLimb = targetLimb;
    
    if (this.onStart) this.onStart(this.type, targetLimb);
  }

  // Generate sweet spot for breaking point
  generateSweetSpot() {
    this.sweetSpot = Math.random() * 0.5 + 0.25; // 0.25-0.75
    this.sweetSpotWidth = SUBMISSION_CONFIG.BREAKING_POINT.attackerSliderWidth;
  }

  // Update submission
  update(dt, input = {}) {
    if (!this.active) return;
    
    const elapsed = (performance.now() / 1000) - this.startTime;
    
    // Check max duration
    if (elapsed > SUBMISSION_CONFIG.BREAKING_POINT.maxDuration) {
      this.forceBreak('time_limit');
      return;
    }
    
    // Check rope break
    if (this.checkRopeBreak()) {
      this.ropeBreak('auto');
      return;
    }
    
    // Check referee rope break (5 count)
    if (this.checkRefereeRopeBreak()) {
      this.ropeBreak('referee');
      return;
    }
    
    // Update rope break cooldown
    if (this.ropeBreakCooldown > 0) {
      this.ropeBreakCooldown -= dt;
    }
    
    if (this.breakingPointActive) {
      this.updateBreakingPoint(dt, input);
    } else {
      this.updateStruggle(dt, input);
    }
    
    // Apply limb damage effects
    this.applyLimbDamageEffects(dt);
    
    // Check for forced break (victim health critical)
    if (this.victim && this.victim.hp <= this.victim.maxhp * 0.1) {
      this.forceBreak('critical_health');
    }
  }

  // Breaking Point Mini-game
  updateBreakingPoint(dt, input) {
    const config = SUBMISSION_CONFIG.BREAKING_POINT;
    
    // Move attacker slider (auto)
    this.attackerSlider += config.attackerSpeed * dt * (Math.random() > 0.5 ? 1 : -1);
    if (this.attackerSlider >= 1) { this.attackerSlider = 1; this.attackerDirection = -1; }
    if (this.attackerSlider <= 0) { this.attackerSlider = 0; this.attackerDirection = 1; }
    
    // Move defender slider (player input or AI)
    const mashInput = input.mash || (this.autoMash && Math.random() < 0.3);
    if (mashInput) {
      this.mashInputs++;
      this.mashTimer = 0.5; // mash window
      this.defenderSlider = Math.min(1, this.defenderSlider + config.struggleFill);
    } else if (this.mashTimer > 0) {
      this.mashTimer -= dt;
    }
    
    // Defender slider moves toward center naturally
    this.defenderSlider += (0.5 - this.defenderSlider) * dt * 2;
    
    // Check if defender in sweet spot
    const inSweetSpot = Math.abs(this.defenderSlider - this.sweetSpot) < this.sweetSpotWidth;
    
    if (inSweetSpot) {
      this.submissionProgress -= config.fillRate * dt; // escape progress
    } else {
      this.submissionProgress += config.drainRate * dt; // submission progress
    }
    
    // Attacker slider in sweet spot = progress
    const attackerInSweet = Math.abs(this.attackerSlider - this.sweetSpot) < this.sweetSpotWidth;
    if (attackerInSweet) {
      this.submissionProgress += config.fillRate * dt * 1.5;
    }
    
    // Clamp
    this.submissionProgress = Math.max(0, Math.min(1, this.submissionProgress));
    
    // Check tap out
    if (this.submissionProgress >= 1) {
      this.tapOut();
    }
    
    // Check escape
    if (this.submissionProgress <= 0) {
      this.escape();
    }
    
    // Move sweet spot occasionally
    if (Math.random() < 0.01) {
      this.sweetSpot = Math.random() * 0.6 + 0.2;
    }
  }

  // Regular struggle (when not in breaking point)
  updateStruggle(dt, input) {
    const config = SUBMISSION_CONFIG.STRUGGLE;
    const elapsed = (performance.now() / 1000) - this.startTime;
    
    // Base escape progress
    let escapeProgress = dt / config.baseEscapeTime;
    
    // Mash effectiveness
    if (input.mash || (this.autoMash && Math.random() < 0.3)) {
      this.mashInputs++;
      escapeProgress += config.mashEffectiveness;
    }
    
    // Stamina bonus
    if (this.victim) {
      const staminaPct = this.victim.stamina / this.victim.maxStamina;
      escapeProgress *= (0.5 + staminaPct * 0.5);
    }
    
    // Damage penalty
    if (this.victim) {
      const damagePct = 1 - (this.victim.hp / this.victim.maxhp);
      escapeProgress *= (1 - damagePct * config.damageWeight);
    }
    
    // Limb damage penalty
    const limbDmg = this.limbDamage[this.targetLimb] || 0;
    escapeProgress *= (1 - limbDmg * config.limbDamageWeight);
    
    // Submission skill bonus
    if (this.submitter) {
      const subSkill = this.submitter.submissionSkill || 50;
      escapeProgress *= (1 - subSkill * config.submissionSkillWeight);
    }
    
    this.submissionProgress -= escapeProgress * dt;
    this.submissionProgress = Math.max(0, Math.min(1, this.submissionProgress));
    
    // Check escape
    if (this.submissionProgress <= 0) {
      this.escape();
    }
    
    // Check tap out
    if (this.submissionProgress >= 1) {
      this.tapOut();
    }
  }

  // Check rope break
  checkRopeBreak() {
    if (!this.ropeBreakAvailable || !this.nearRopes) return false;
    
    const config = SUBMISSION_CONFIG.ROPE_BREAK;
    const isAuto = this.victim && this.victim.isPlayer && Math.random() < config.autoBreakChance;
    const isManual = this.victim && this.victim.isPlayer && input.mash && Math.random() < config.manualBreakChance;
    
    if (isAuto || isManual) {
      this.ropeBreakType = isAuto ? 'auto' : 'manual';
      return true;
    }
    return false;
  }

  checkRefereeRopeBreak() {
    // Referee forces break at 5 count if near ropes
    if (this.nearRopes && this.refereeCount >= 5) {
      this.ropeBreakType = 'referee';
      return true;
    }
    return false;
  }

  // Execute rope break
  ropeBreak(type) {
    if (!this.ropeBreakAvailable) return false;
    
    this.ropeBreakAvailable = false;
    this.ropeBreakCooldown = SUBMISSION_CONFIG.ROPE_BREAK.cooldown;
    this.ropeBreakType = type;
    
    if (this.onRopeBreak) this.onRopeBreak(type);
    
    this.forceBreak('rope_break');
    return true;
  }

  // Force break submission
  forceBreak(reason) {
    this.active = false;
    this.breakingPointActive = false;
    
    if (this.onEscape) this.onEscape(reason);
    
    // Reset states
    if (this.submitter) this.submitter.state = 'idle';
    if (this.victim) {
      this.victim.state = 'getup';
      this.victim.downT = 1.0;
    }
  }

  // Tap out
  tapOut() {
    this.active = false;
    this.breakingPointActive = false;
    
    if (this.onTapOut) this.onTapOut(this.victim, this.submitter);
    
    // Winner
    if (this.submitter) {
      this.submitter.state = 'celebrate';
      this.submitter.stats.submissions++;
    }
    if (this.victim) {
      this.victim.state = 'down';
      this.victim.downT = 5.0;
    }
  }

  // Escape
  escape() {
    this.active = false;
    this.breakingPointActive = false;
    
    if (this.onEscape) this.onEscape('escaped');
    
    // Both wrestlers get up
    if (this.submitter) this.submitter.state = 'idle';
    if (this.victim) {
      this.victim.state = 'getup';
      this.victim.downT = 0.5;
    }
  }

  // Change submission type (DoR2 style 4 options)
  changeType(newType) {
    if (SUBMISSION_CONFIG.TYPES[newType]) {
      this.type = SUBMISSION_CONFIG.TYPES[newType];
      this.generateSweetSpot(); // new sweet spot for new type
      if (this.onTypeChange) this.onTypeChange(this.type);
    }
  }

  // Apply limb damage effects
  applyLimbDamageEffects(dt) {
    if (!this.victim) return;
    
    const effects = SUBMISSION_CONFIG.LIMB_EFFECTS[this.targetLimb];
    if (!effects) return;
    
    const dmg = this.limbDamage[this.targetLimb] || 0;
    if (dmg <= 0) return;
    
    // Apply effects based on limb
    switch (this.targetLimb) {
      case 'head':
        if (Math.random() < effects.groggyChance * dmg * dt) {
          this.victim.stunned = true;
          this.victim.stunTimer = 0.5;
        }
        this.victim.reversalWindowMult = 1 - effects.reversalWindowReduction * dmg;
        break;
      case 'arm':
        this.victim.strikeDamageMult = 1 - effects.strikeDamageReduction * dmg;
        this.victim.grappleStrengthMult = 1 - effects.grappleStrengthReduction * dmg;
        break;
      case 'torso':
        this.victim.staminaRegenMult = 1 - effects.staminaRegenReduction * dmg;
        this.victim.adrenalineDrainMult = 1 + effects.adrenalineDrainIncrease * dmg;
        break;
      case 'leg':
        this.victim.speedMult = 1 - effects.speedReduction * dmg;
        this.victim.runStaminaCostMult = 1 + effects.runStaminaCostIncrease * dmg;
        if (effects.diveImpaired) this.victim.canDive = false;
        if (effects.reversalImpaired) this.victim.reversalImpaired = true;
        break;
    }
  }

  // Apply damage to targeted limb
  applyLimbDamage(amount) {
    this.limbDamage[this.targetLimb] = Math.min(1, (this.limbDamage[this.targetLimb] || 0) + amount);
  }

  // Check if near ropes
  checkNearRopes() {
    if (!this.victim) return false;
    // Simplified - check if victim near ring edge
    const pos = this.victim.pos;
    return Math.abs(pos.x) > 3.0 || Math.abs(pos.z) > 3.0;
  }

  // Update near ropes status
  updateNearRopes() {
    this.nearRopes = this.checkNearRopes();
  }

  // Get UI state
  getState() {
    return {
      active: this.active,
      type: this.type?.id || null,
      submitter: this.submitter?.def?.name || null,
      victim: this.victim?.def?.name || null,
      progress: this.submissionProgress,
      sweetSpot: this.sweetSpot,
      attackerSlider: this.attackerSlider,
      defenderSlider: this.defenderSlider,
      sweetSpotWidth: this.sweetSpotWidth,
      nearRopes: this.nearRopes,
      ropeBreakAvailable: this.ropeBreakAvailable,
      targetLimb: this.targetLimb,
      limbDamage: this.limbDamage,
      elapsed: (performance.now() / 1000) - this.startTime,
    };
  }
}

// AI Submission Decision
export function aiChooseSubmissionType(ai, victim) {
  const types = Object.keys(SUBMISSION_CONFIG.TYPES);
  const weights = {
    damage: ai.def.str || 50,
    stamina_drain: 100 - (victim.stamina || 50),
    rest_hold: 100 - (ai.stamina || 50),
    humiliation: ai.def.cha || 50,
    taunt: ai.momentum > 50 ? 80 : 20,
  };
  
  // Pick weighted random
  let total = 0;
  for (const t of types) total += weights[t] || 50;
  
  let rand = Math.random() * total;
  for (const t of types) {
    rand -= weights[t] || 50;
    if (rand <= 0) return t;
  }
  return 'damage';
}

export default {
  SubmissionManager,
  SUBMISSION_CONFIG,
  aiChooseSubmissionType,
};