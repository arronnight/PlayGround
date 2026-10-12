// Chain Wrestling System (WWE 2K Style)
// 4 Chain Holds + Hot Spot Mini-game + Working/Struggle mechanics

export const CHAIN_CONFIG = {
  // 4 Chain Holds (authentic WWE 2K)
  HOLDS: {
    COLLAR_ELBOW: {
      id: 'collar_elbow',
      name: 'Collar & Elbow',
      description: 'Neutral tie-up position',
      transitions: ['side_headlock', 'waist_lock', 'wrist_lock'],
      advantage: 'neutral',
      hotSpot: { angle: 0.5, width: 0.15 }, // center position
    },
    SIDE_HEADLOCK: {
      id: 'side_headlock',
      name: 'Side Headlock',
      description: 'Head control position',
      transitions: ['collar_elbow', 'waist_lock', 'wrist_lock'],
      advantage: 'attacker',
      hotSpot: { angle: 0.2, width: 0.12 }, // left side
    },
    WAIST_LOCK: {
      id: 'waist_lock',
      name: 'Waist Lock',
      description: 'Body control from behind/side',
      transitions: ['collar_elbow', 'side_headlock', 'wrist_lock'],
      advantage: 'attacker',
      hotSpot: { angle: 0.8, width: 0.12 }, // right side
    },
    WRIST_LOCK: {
      id: 'wrist_lock',
      name: 'Wrist Lock',
      description: 'Joint manipulation control',
      transitions: ['collar_elbow', 'side_headlock', 'waist_lock'],
      advantage: 'defender',
      hotSpot: { angle: 0.35, width: 0.1 }, // slightly left of center
    },
  },

  // Chain Wrestling States
  STATES: {
    NEUTRAL: 'neutral',           // No hold, circling
    LOCKUP: 'lockup',             // Initial collar-elbow
    HOLD: 'hold',                 // In a chain hold
    STRUGGLE: 'struggle',         // Fighting for position
    TRANSITION: 'transition',     // Moving between holds
    BREAK: 'break',               // Breaking the hold
    ADVANTAGE: 'advantage',       // Gained advantage
  },

  // Hot Spot Mini-game
  HOT_SPOT: {
    barWidth: 1.0,
    sweetSpotWidth: 0.15, // 15% of bar
    sweetSpotSpeed: 0.8,  // speed of moving sweet spot
    needleSpeed: 2.5,     // speed of player needle
    successWindow: 0.02,  // 2% tolerance
    holdTime: 3.0,        // seconds to hold in sweet spot
    struggleInterval: 1.5, // seconds between struggle checks
  },

  // Struggle System
  STRUGGLE: {
    baseResistance: 0.5,
    statWeight: 0.01,      // per stat point
    momentumWeight: 0.005, // per momentum point
    staminaWeight: 0.005,  // per stamina point
    mashEffectiveness: 0.15, // per mash input
    maxDuration: 10,       // max seconds in struggle
  },

  // Move Categories from Chain Holds
  MOVE_CATEGORIES: {
    STRIKES: 'strikes',           // Light/heavy strikes from hold
    GRAPPLES: 'grapples',         // Throws, slams, suplexes
    SUBMISSIONS: 'submissions',   // Submission holds
    DRAGS: 'drags',               // Drag opponent
    IRISH_WHIP: 'irish_whip',     // Throw to ropes
    RELEASE: 'release',           // Break hold cleanly
  },

  // Reversal Windows from Chain Wrestling
  REVERSAL_WINDOWS: {
    lockup: 0.3,      // 0.3s window at lockup
    hold: 0.2,        // 0.2s window during hold
    transition: 0.15, // 0.15s during transition
    struggle: 0.1,    // 0.1s during struggle
  },
};

// Chain Wrestling Manager
export class ChainWrestlingManager {
  constructor(wrestler) {
    this.wrestler = wrestler;
    this.opponent = null;
    
    // State
    this.state = CHAIN_CONFIG.STATES.NEUTRAL;
    this.currentHold = null;
    this.holdTime = 0;
    this.struggleProgress = 0;
    this.struggleTarget = 0;
    this.struggleDirection = 1; // 1 = attacker advantage, -1 = defender advantage
    
    // Hot Spot Mini-game
    this.hotSpotActive = false;
    this.sweetSpotPosition = 0.5;
    this.needlePosition = 0.5;
    this.sweetSpotDirection = 1;
    this.holdSuccessTime = 0;
    this.holdRequiredTime = CHAIN_CONFIG.HOT_SPOT.holdTime;
    
    // Struggle
    this.struggleActive = false;
    this.struggleTimer = 0;
    this.struggleInputs = 0;
    
    // Advantage
    this.advantage = 0; // -1 to 1, positive = this wrestler has advantage
    this.advantageTimer = 0;
    
    // Callbacks
    this.onHoldChange = null;
    this.onAdvantageChange = null;
    this.onBreak = null;
    this.onMoveExecute = null;
  }

  // Initiate lockup with opponent
  initiateLockup(opponent) {
    this.opponent = opponent;
    this.state = CHAIN_CONFIG.STATES.LOCKUP;
    this.currentHold = CHAIN_CONFIG.HOLDS.COLLAR_ELBOW;
    this.holdTime = 0;
    this.struggleProgress = 0.5;
    this.struggleTarget = 0.5;
    this.struggleDirection = 0;
    this.advantage = 0;
    this.hotSpotActive = true;
    this.sweetSpotPosition = 0.5;
    this.needlePosition = 0.5;
    this.holdSuccessTime = 0;
    this.struggleActive = false;
    this.struggleTimer = 0;
    this.struggleInputs = 0;
    
    if (this.onHoldChange) this.onHoldChange(this.currentHold.id, 'lockup');
    
    // Start hot spot mini-game
    this.startHotSpot();
  }

  // Start hot spot mini-game
  startHotSpot() {
    this.hotSpotActive = true;
    this.sweetSpotPosition = Math.random() * 0.5 + 0.25; // 0.25-0.75
    this.needlePosition = 0.5;
    this.sweetSpotDirection = Math.random() > 0.5 ? 1 : -1;
    this.holdSuccessTime = 0;
  }

  // Update chain wrestling state
  update(dt, input = {}) {
    if (!this.opponent || this.state === CHAIN_CONFIG.STATES.NEUTRAL) return;

    this.holdTime += dt;

    switch (this.state) {
      case CHAIN_CONFIG.STATES.LOCKUP:
        this.updateLockup(dt, input);
        break;
      case CHAIN_CONFIG.STATES.HOLD:
        this.updateHold(dt, input);
        break;
      case CHAIN_CONFIG.STATES.STRUGGLE:
        this.updateStruggle(dt, input);
        break;
      case CHAIN_CONFIG.STATES.TRANSITION:
        this.updateTransition(dt, input);
        break;
      case CHAIN_CONFIG.STATES.BREAK:
        this.updateBreak(dt, input);
        break;
    }

    // Update hot spot
    if (this.hotSpotActive) {
      this.updateHotSpot(dt, input);
    }

    // Update advantage
    this.updateAdvantage(dt);
  }

  // Lockup phase - initial collar-elbow
  updateLockup(dt, input) {
    // Lockup lasts 1-2 seconds before transitioning to hold or struggle
    if (this.holdTime > 1.5) {
      // Check for immediate reversal attempt
      if (this.checkReversalAttempt()) {
        this.state = CHAIN_CONFIG.STATES.STRUGGLE;
        this.startStruggle();
        return;
      }
      
      // Transition to hold
      this.state = CHAIN_CONFIG.STATES.HOLD;
      this.startHotSpot();
    }
  }

  // Hold phase - main chain wrestling
  updateHold(dt, input) {
    // Update hot spot mini-game
    if (this.hotSpotActive) {
      this.updateHotSpot(dt, input);
    }

    // Check for struggle initiation (random or input-based)
    if (Math.random() < 0.01 * dt || this.checkStruggleInput(input)) {
      this.state = CHAIN_CONFIG.STATES.STRUGGLE;
      this.startStruggle();
      return;
    }

    // Check for hold transition input
    const transitionInput = this.checkTransitionInput(input);
    if (transitionInput) {
      this.transitionToHold(transitionInput);
      return;
    }

    // Check for move execution
    const moveInput = this.checkMoveInput(input);
    if (moveInput) {
      this.executeMove(moveInput);
      return;
    }

    // Check for break/release
    if (this.checkBreakInput(input)) {
      this.breakHold();
      return;
    }
  }

  // Hot Spot Mini-game
  updateHotSpot(dt, input) {
    // Move sweet spot
    this.sweetSpotPosition += this.sweetSpotDirection * CHAIN_CONFIG.HOT_SPOT.sweetSpotSpeed * dt;
    if (this.sweetSpotPosition >= 1) {
      this.sweetSpotPosition = 1;
      this.sweetSpotDirection = -1;
    } else if (this.sweetSpotPosition <= 0) {
      this.sweetSpotPosition = 0;
      this.sweetSpotDirection = 1;
    }

    // Move needle based on input
    if (input.left) this.needlePosition -= CHAIN_CONFIG.HOT_SPOT.needleSpeed * dt;
    if (input.right) this.needlePosition += CHAIN_CONFIG.HOT_SPOT.needleSpeed * dt;
    this.needlePosition = Math.max(0, Math.min(1, this.needlePosition));

    // Check if needle in sweet spot
    const distance = Math.abs(this.needlePosition - this.sweetSpotPosition);
    if (distance <= CHAIN_CONFIG.HOT_SPOT.successWindow) {
      this.holdSuccessTime += dt;
      if (this.holdSuccessTime >= this.holdRequiredTime) {
        this.gainAdvantage();
        this.hotSpotActive = false;
        this.startStruggle(); // Transition to struggle with advantage
      }
    } else {
      this.holdSuccessTime = Math.max(0, this.holdSuccessTime - dt * 0.5);
    }
  }

  // Gain advantage from hot spot success
  gainAdvantage() {
    this.advantage = Math.min(1, this.advantage + 0.3);
    this.advantageTimer = 5.0; // advantage lasts 5 seconds
    if (this.onAdvantageChange) this.onAdvantageChange(this.advantage);
  }

  // Start struggle phase
  startStruggle() {
    this.state = CHAIN_CONFIG.STATES.STRUGGLE;
    this.struggleActive = true;
    this.struggleTimer = 0;
    this.struggleInputs = 0;
    this.struggleProgress = 0.5;
    this.struggleTarget = 0.5;
    this.struggleDirection = this.advantage > 0 ? 1 : -1;
  }

  // Struggle phase
  updateStruggle(dt, input) {
    this.struggleTimer += dt;
    this.struggleInputs += (input.mash ? 1 : 0);

    // Calculate struggle progress based on stats and inputs
    const myStr = this.calculateStruggleStrength(this.wrestler);
    const oppStr = this.opponent ? this.calculateStruggleStrength(this.opponent) : 0;
    
    const advantage = (myStr - oppStr) * CHAIN_CONFIG.STRUGGLE.statWeight;
    const momentumAdv = ((this.wrestler.momentum || 0) - (this.opponent?.momentum || 0)) * CHAIN_CONFIG.STRUGGLE.momentumWeight;
    const staminaAdv = ((this.wrestler.stamina || 50) - (this.opponent?.stamina || 50)) * CHAIN_CONFIG.STRUGGLE.staminaWeight;
    const mashAdv = this.struggleInputs * CHAIN_CONFIG.STRUGGLE.mashEffectiveness;

    const totalAdv = advantage + momentumAdv + staminaAdv + mashAdv;
    
    // Update progress (0 = defender wins, 1 = attacker wins)
    this.struggleProgress += (totalAdv + this.struggleDirection * 0.1) * dt;
    this.struggleProgress = Math.max(0, Math.min(1, this.struggleProgress));

    // Check for struggle resolution
    if (this.struggleProgress >= 1) {
      // Attacker wins struggle
      this.resolveStruggle(true);
    } else if (this.struggleProgress <= 0) {
      // Defender wins struggle
      this.resolveStruggle(false);
    }

    // Max duration
    if (this.struggleTimer >= CHAIN_CONFIG.STRUGGLE.maxDuration) {
      this.resolveStruggle(this.struggleProgress > 0.5);
    }
  }

  calculateStruggleStrength(wrestler) {
    if (!wrestler) return 50;
    return (wrestler.str || 50) + (wrestler.tgh || 50) + (wrestler.toughness || 50);
  }

  // Resolve struggle
  resolveStruggle(attackerWon) {
    this.struggleActive = false;
    this.struggleTimer = 0;
    this.struggleInputs = 0;

    if (attackerWon) {
      // Attacker gains advantage, can execute move
      this.advantage = Math.min(1, this.advantage + 0.5);
      this.state = CHAIN_CONFIG.STATES.ADVANTAGE;
      this.advantageTimer = 3.0;
    } else {
      // Defender escapes or reverses
      this.advantage = Math.max(-1, this.advantage - 0.3);
      if (this.advantage < -0.5) {
        // Reversal!
        this.reverseHold();
      } else {
        this.state = CHAIN_CONFIG.STATES.HOLD;
        this.startHotSpot();
      }
    }
  }

  // Reverse the hold (defender becomes attacker)
  reverseHold() {
    const temp = this.wrestler;
    this.wrestler = this.opponent;
    this.opponent = temp;
    
    this.advantage = 0.3; // slight advantage to new attacker
    this.state = CHAIN_CONFIG.STATES.HOLD;
    this.startHotSpot();
    
    // Trigger reversal callback
    if (this.onReversal) this.onReversal(this.wrestler, this.opponent);
  }

  // Transition between holds
  transitionToHold(newHoldId) {
    const newHold = CHAIN_CONFIG.HOLDS[newHoldId];
    if (!newHold) return false;

    // Check if transition is valid
    if (!this.currentHold.transitions.includes(newHoldId)) return false;

    this.state = CHAIN_CONFIG.STATES.TRANSITION;
    
    // Brief transition animation
    setTimeout(() => {
      this.currentHold = newHold;
      this.state = CHAIN_CONFIG.STATES.HOLD;
      this.startHotSpot();
      if (this.onHoldChange) this.onHoldChange(newHoldId, 'transition');
    }, 500);

    return true;
  }

  // Execute move from hold
  executeMove(moveCategory) {
    if (!this.onMoveExecute) return false;
    
    const success = this.onMoveExecute(moveCategory, this.currentHold);
    if (success) {
      this.breakHold();
    }
    return success;
  }

  // Break hold
  breakHold() {
    this.state = CHAIN_CONFIG.STATES.BREAK;
    this.hotSpotActive = false;
    this.struggleActive = false;
    
    setTimeout(() => {
      this.state = CHAIN_CONFIG.STATES.NEUTRAL;
      this.opponent = null;
      this.currentHold = null;
      this.advantage = 0;
      if (this.onBreak) this.onBreak();
    }, 300);
  }

  // Check inputs
  checkReversalAttempt() {
    // Random chance or input-based
    return Math.random() < 0.1;
  }

  checkStruggleInput(input) {
    return input.mash && Math.random() < 0.3;
  }

  checkTransitionInput(input) {
    // Check for hold transition inputs (e.g., direction + grapple)
    if (input.holdTransition) {
      return input.holdTransition;
    }
    return null;
  }

  checkMoveInput(input) {
    // Check for move execution (strike, grapple, submission, etc.)
    if (input.executeMove) {
      return input.executeMove;
    }
    return null;
  }

  checkBreakInput(input) {
    return input.breakHold || input.release;
  }

  // Update advantage decay
  updateAdvantage(dt) {
    if (this.advantageTimer > 0) {
      this.advantageTimer -= dt;
      if (this.advantageTimer <= 0) {
        this.advantage = Math.max(-0.2, Math.min(0.2, this.advantage * 0.9));
      }
    }
  }

  // Get current state for UI
  getState() {
    return {
      state: this.state,
      currentHold: this.currentHold?.id || null,
      holdTime: this.holdTime,
      advantage: this.advantage,
      hotSpotActive: this.hotSpotActive,
      sweetSpotPosition: this.sweetSpotPosition,
      needlePosition: this.needlePosition,
      hotSpotProgress: this.holdSuccessTime / this.holdRequiredTime,
      struggleActive: this.struggleActive,
      struggleProgress: this.struggleProgress,
      struggleTimer: this.struggleTimer,
    };
  }

  // Input helpers for player
  handleInput(input) {
    // Movement inputs for hot spot
    if (this.hotSpotActive) {
      if (input.left) return { left: true };
      if (input.right) return { right: true };
    }

    // Mash input for struggle
    if (this.struggleActive && input.mash) {
      return { mash: true };
    }

    // Move execution
    if (input.executeStrike) return { executeMove: 'strikes' };
    if (input.executeGrapple) return { executeMove: 'grapples' };
    if (input.executeSubmission) return { executeMove: 'submissions' };
    if (input.executeIrishWhip) return { executeMove: 'irish_whip' };

    // Hold transitions
    if (input.transitionTo) return { holdTransition: input.transitionTo };

    // Break
    if (input.release) return { breakHold: true };

    return {};
  }
}

// AI Chain Wrestling
export function aiChainWrestling(ai, opponent, dt) {
  if (!ai.chainManager) return;
  
  const cm = ai.chainManager;
  if (cm.state === CHAIN_CONFIG.STATES.NEUTRAL && dist2(ai, opponent) < 1.5) {
    cm.initiateLockup(opponent);
  }
  
  // AI decision making
  if (cm.state === CHAIN_CONFIG.STATES.HOLD) {
    // Random transition chance
    if (Math.random() < 0.02 * dt) {
      const transitions = cm.currentHold.transitions;
      if (transitions.length > 0) {
        const next = transitions[Math.floor(Math.random() * transitions.length)];
        cm.transitionToHold(next);
      }
    }
    
    // AI move execution based on stats
    if (Math.random() < 0.01 * dt && cm.advantage > 0.2) {
      const moveType = ai.def.str > 7 ? 'grapples' : 'strikes';
      cm.executeMove(moveType);
    }
  }
  
  // AI hot spot (simulate human-like performance)
  if (cm.hotSpotActive) {
    const skill = ai.def.chainSkill || 0.5;
    const targetOffset = (Math.random() - 0.5) * (1 - skill) * 0.1;
    cm.needlePosition = cm.sweetSpotPosition + targetOffset;
  }
}

function dist2(a, b) {
  const dx = a.pos.x - b.pos.x;
  const dz = a.pos.z - b.pos.z;
  return Math.hypot(dx, dz);
}

export default {
  ChainWrestlingManager,
  CHAIN_CONFIG,
  aiChainWrestling,
};