// Reversal System (WWE 2K Style)
// Normal/Minor/Major Reversal Stocks with timing windows

export const REVERSAL_CONFIG = {
  // Reversal Types
  TYPES: {
    NORMAL: {
      id: 'normal',
      name: 'Normal Reversal',
      icon: 'F', // white
      stockCost: 1,
      maxStocks: 3,
      regenRate: 0.5, // stocks per second
      window: 0.25, // seconds
      effect: 'reverse_move',
      weakensOpponent: false,
    },
    MINOR: {
      id: 'minor',
      name: 'Minor Reversal',
      icon: 'F', // green
      stockCost: 1,
      maxStocks: 2,
      regenRate: 0.3,
      window: 0.35, // slightly more generous
      effect: 'reverse_move_gain_advantage',
      weakensOpponent: false,
    },
    MAJOR: {
      id: 'major',
      name: 'Major Reversal',
      icon: 'F', // red
      stockCost: 2,
      maxStocks: 1,
      regenRate: 0.15,
      window: 0.5, // most generous
      effect: 'reverse_move_major_advantage',
      weakensOpponent: true, // temporarily weakens opponent
    },
  },

  // Reversal Categories (what can be reversed)
  CATEGORIES: {
    STRIKE: {
      id: 'strike',
      name: 'Strike',
      window: 0.2,
      baseStock: 'normal',
    },
    GRAPPLE: {
      id: 'grapple',
      name: 'Grapple',
      window: 0.25,
      baseStock: 'normal',
    },
    RUNNING_STRIKE: {
      id: 'running_strike',
      name: 'Running Strike',
      window: 0.15,
      baseStock: 'normal',
    },
    RUNNING_GRAPPLE: {
      id: 'running_grapple',
      name: 'Running Grapple',
      window: 0.2,
      baseStock: 'normal',
    },
    FINISHER: {
      id: 'finisher',
      name: 'Finisher',
      window: 0.3,
      baseStock: 'major',
    },
    SIGNATURE: {
      id: 'signature',
      name: 'Signature',
      window: 0.25,
      baseStock: 'major',
    },
    SUBMISSION: {
      id: 'submission',
      name: 'Submission',
      window: 0.4,
      baseStock: 'minor',
    },
    GROUND_STRIKE: {
      id: 'ground_strike',
      name: 'Ground Strike',
      window: 0.3,
      baseStock: 'minor',
    },
    GROUND_GRAPPLE: {
      id: 'ground_grapple',
      name: 'Ground Grapple',
      window: 0.35,
      baseStock: 'minor',
    },
    IRISH_WHIP: {
      id: 'irish_whip',
      name: 'Irish Whip',
      window: 0.25,
      baseStock: 'normal',
    },
    DIVE: {
      id: 'dive',
      name: 'Dive',
      window: 0.2,
      baseStock: 'normal',
    },
    WEAPON: {
      id: 'weapon',
      name: 'Weapon',
      window: 0.25,
      baseStock: 'normal',
    },
  },

  // Reversal Outcomes
  OUTCOMES: {
    NORMAL: {
      attacker: 'stunned_brief', // 0.5s stun
      defender: 'reversal_move', // performs reversal move
      momentumGain: 10,
      advantage: 0.2,
    },
    MINOR: {
      attacker: 'stunned', // 1s stun
      defender: 'reversal_move_advantage', // reversal + advantage
      momentumGain: 15,
      advantage: 0.4,
    },
    MAJOR: {
      attacker: 'stunned_long', // 2s stun + weakened
      defender: 'reversal_move_major', // reversal + major advantage
      momentumGain: 25,
      advantage: 0.7,
      weakensAttacker: true,
    },
  },

  // Visual/UI
  UI: {
    stockColors: {
      normal: '#ffffff',
      minor: '#4ade80',
      major: '#ef4444',
    },
    flashColors: {
      normal: '#ffffff',
      minor: '#4ade80',
      major: '#ef4444',
    },
    promptDuration: 0.5, // seconds to show prompt
  },

  // Regeneration
  REGENERATION: {
    combatMultiplier: 0.5, // slower regen in combat
    idleMultiplier: 1.5,   // faster regen when idle
    tauntBonus: 0.5,       // bonus stocks per taunt
  },
};

// Reversal Manager
export class ReversalManager {
  constructor(wrestler) {
    this.wrestler = wrestler;
    
    // Stock tracking
    this.stocks = {
      normal: REVERSAL_CONFIG.TYPES.NORMAL.maxStocks,
      minor: REVERSAL_CONFIG.TYPES.MINOR.maxStocks,
      major: REVERSAL_CONFIG.TYPES.MAJOR.maxStocks,
    };
    
    this.maxStocks = {
      normal: REVERSAL_CONFIG.TYPES.NORMAL.maxStocks,
      minor: REVERSAL_CONFIG.TYPES.MINOR.maxStocks,
      major: REVERSAL_CONFIG.TYPES.MAJOR.maxStocks,
    };
    
    // Active reversal window
    this.activeWindow = null;
    this.windowStartTime = 0;
    this.windowDuration = 0;
    this.windowCategory = null;
    this.requiredStockType = 'normal';
    this.windowCallback = null;
    
    // Prompt display
    this.promptVisible = false;
    this.promptTimer = 0;
    this.promptType = null;
    
    // Reversal history
    this.reversalHistory = [];
    this.successfulReversals = 0;
    this.failedReversals = 0;
    
    // Auto-reversal (AI)
    this.autoReversalEnabled = false;
    this.autoReversalThreshold = 0.5;
    
    // Callbacks
    this.onReversalSuccess = null;
    this.onReversalFail = null;
    this.onPromptShow = null;
    this.onPromptHide = null;
    this.onStockChange = null;
  }

  // Get current stocks
  getStocks() {
    return { ...this.stocks };
  }

  getMaxStocks() {
    return { ...this.maxStocks };
  }

  getStock(type) {
    return this.stocks[type] || 0;
  }

  hasStock(type) {
    return (this.stocks[type] || 0) > 0;
  }

  hasAnyStock() {
    return this.stocks.normal > 0 || this.stocks.minor > 0 || this.stocks.major > 0;
  }

  // Consume stock
  consumeStock(type) {
    if (this.stocks[type] > 0) {
      this.stocks[type]--;
      if (this.onStockChange) this.onStockChange(this.getStocks());
      return true;
    }
    return false;
  }

  // Add stock
  addStock(type, amount = 1) {
    const max = this.maxStocks[type] || 0;
    this.stocks[type] = Math.min(max, (this.stocks[type] || 0) + amount);
    if (this.onStockChange) this.onStockChange(this.getStocks());
  }

  // Open reversal window
  openWindow(categoryId, callback) {
    const category = REVERSAL_CONFIG.CATEGORIES[categoryId];
    if (!category) return false;
    
    this.activeWindow = {
      category: categoryId,
      startTime: performance.now() / 1000,
      duration: category.window,
      endTime: (performance.now() / 1000) + category.window,
      category: category,
      requiredStock: category.baseStock,
    };
    
    this.requiredStockType = category.baseStock;
    this.windowCallback = callback;
    this.promptVisible = true;
    this.promptType = categoryId;
    this.promptTimer = category.window;
    
    if (this.onPromptShow) this.onPromptShow(categoryId, category.window);
    
    return true;
  }

  // Close reversal window
  closeWindow(success = false) {
    if (!this.activeWindow) return;
    
    const wasActive = this.activeWindow !== null;
    this.activeWindow = null;
    this.windowCallback = null;
    this.promptVisible = false;
    this.promptTimer = 0;
    
    if (wasActive && this.onPromptHide) {
      this.onPromptHide(success);
    }
  }

  // Attempt reversal
  attemptReversal(stockType = null) {
    if (!this.activeWindow) return { success: false, reason: 'no_window' };
    
    const window = this.activeWindow;
    const requiredType = this.requiredStockType;
    const useType = stockType || requiredType;
    
    // Check if we have the required stock
    if (!this.hasStock(useType)) {
      // Try to use higher tier stock
      const fallback = this.getFallbackStock(useType);
      if (fallback) {
        return this.attemptReversal(fallback);
      }
      this.closeWindow(false);
      if (this.onReversalFail) this.onReversalFail('no_stock');
      return { success: false, reason: 'no_stock' };
    }
    
    // Check timing
    const now = performance.now() / 1000;
    const elapsed = now - window.startTime;
    const progress = elapsed / window.duration;
    
    // Perfect reversal (first 30% of window)
    const isPerfect = progress < 0.3;
    // Good reversal (first 60%)
    const isGood = progress < 0.6;
    // Late reversal (last 40%)
    const isLate = progress > 0.6;
    
    // Consume stock
    this.consumeStock(useType);
    
    // Determine outcome
    let outcome;
    if (isPerfect) {
      outcome = 'perfect';
    } else if (isGood) {
      outcome = 'good';
    } else if (isLate) {
      outcome = 'late';
    } else {
      outcome = 'missed';
    }
    
    const success = outcome !== 'missed';
    
    if (success) {
      this.successfulReversals++;
      this.applyReversalOutcome(window.category, useType, outcome);
      this.closeWindow(true);
      if (this.onReversalSuccess) this.onReversalSuccess(window.category, useType, outcome);
    } else {
      this.failedReversals++;
      this.closeWindow(false);
      if (this.onReversalFail) this.onReversalFail('timing');
    }
    
    return { 
      success, 
      outcome, 
      reversalType: useType,
      category: window.category.id,
      perfect: outcome === 'perfect',
    };
  }

  // Get fallback stock (higher tier)
  getFallbackStock(requiredType) {
    const hierarchy = ['normal', 'minor', 'major'];
    const idx = hierarchy.indexOf(requiredType);
    for (let i = idx + 1; i < hierarchy.length; i++) {
      if (this.hasStock(hierarchy[i])) return hierarchy[i];
    }
    return null;
  }

  // Apply reversal outcome
  applyReversalOutcome(category, stockType, outcome) {
    const stockConfig = REVERSAL_CONFIG.TYPES[stockType];
    const outcomeConfig = REVERSAL_CONFIG.OUTCOMES[stockType.toUpperCase()];
    
    if (!outcomeConfig) return;
    
    // Apply momentum gain
    this.wrestler.momentum = Math.min(150, (this.wrestler.momentum || 0) + outcomeConfig.momentumGain);
    
    // Apply advantage
    this.wrestler.advantage = Math.min(1, (this.wrestler.advantage || 0) + outcomeConfig.advantage);
    
    // Weaken opponent if major
    if (outcomeConfig.weakensAttacker && this.activeWindow?.attacker) {
      this.activeWindow.attacker.weakened = true;
      this.activeWindow.attacker.weakenTimer = 5.0;
    }
    
    // Record in history
    this.reversalHistory.push({
      time: performance.now() / 1000,
      category: category.id,
      stockType,
      outcome,
      perfect: outcome === 'perfect',
    });
    
    // Trigger visual effect
    this.triggerReversalEffect(stockType, outcome);
  }

  triggerReversalEffect(stockType, outcome) {
    // Dispatch event for visual effects
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('reversal', {
        detail: { 
          type: stockType, 
          outcome, 
          wrestler: this.wrestler.def?.name,
          color: REVERSAL_CONFIG.UI.stockColors[stockType] 
        }
      }));
    }
  }

  // Update reversal windows
  update(dt, isInCombat = false) {
    // Regenerate stocks
    if (!isInCombat) {
      for (const [type, config] of Object.entries(REVERSAL_CONFIG.TYPES)) {
        if (this.stocks[type] < this.maxStocks[type]) {
          this.stocks[type] = Math.min(
            this.maxStocks[type],
            this.stocks[type] + config.regenRate * dt * REVERSAL_CONFIG.REGENERATION.idleMultiplier
          );
        }
      }
    } else {
      // Slower regen in combat
      for (const [type, config] of Object.entries(REVERSAL_CONFIG.TYPES)) {
        if (this.stocks[type] < this.maxStocks[type]) {
          this.stocks[type] = Math.min(
            this.maxStocks[type],
            this.stocks[type] + config.regenRate * dt * REVERSAL_CONFIG.REGENERATION.combatMultiplier
          );
        }
      }
    }
    
    // Update active window
    if (this.activeWindow) {
      this.promptTimer -= dt;
      if (this.promptTimer <= 0) {
        this.closeWindow(false);
      }
    }
    
    // Regenerate stocks from taunts
    // (handled by taunt system)
  }

  // Grant reversal stocks (from taunts, etc.)
  grantStocks(type, amount = 1) {
    for (let i = 0; i < amount; i++) {
      this.addStock(type);
    }
  }

  // Set auto-reversal for AI
  setAutoReversal(enabled, threshold = 0.5) {
    this.autoReversalEnabled = enabled;
    this.autoReversalThreshold = threshold;
  }

  // AI auto-reversal logic
  aiAttemptReversal(categoryId) {
    if (!this.autoReversalEnabled) return false;
    if (!this.activeWindow) return false;
    if (this.activeWindow.category.id !== categoryId) return false;
    
    // AI decides based on threshold and stocks
    const window = this.activeWindow;
    const now = performance.now() / 1000;
    const progress = (now - window.startTime) / window.duration;
    
    // AI more likely to reverse early
    const shouldAttempt = progress < this.autoReversalThreshold && this.hasStock(window.category.baseStock);
    
    if (shouldAttempt) {
      return this.attemptReversal();
    }
    return false;
  }

  // Get UI state
  getState() {
    return {
      stocks: { ...this.stocks },
      maxStocks: { ...this.maxStocks },
      activeWindow: this.activeWindow ? {
        category: this.activeWindow.category.id,
        progress: Math.min(1, (performance.now() / 1000 - this.activeWindow.startTime) / this.activeWindow.duration),
        remaining: Math.max(0, this.activeWindow.endTime - performance.now() / 1000),
        requiredStock: this.requiredStockType,
      } : null,
      promptVisible: this.promptVisible,
      promptType: this.promptType,
      promptTimer: this.promptTimer,
      history: this.reversalHistory.slice(-10),
      stats: {
        successful: this.successfulReversals,
        failed: this.failedReversals,
      },
    };
  }

  // Reset for new match
  reset() {
    this.stocks = {
      normal: REVERSAL_CONFIG.TYPES.NORMAL.maxStocks,
      minor: REVERSAL_CONFIG.TYPES.MINOR.maxStocks,
      major: REVERSAL_CONFIG.TYPES.MAJOR.maxStocks,
    };
    this.activeWindow = null;
    this.windowCallback = null;
    this.promptVisible = false;
    this.promptTimer = 0;
    this.promptType = null;
    this.reversalHistory = [];
    this.successfulReversals = 0;
    this.failedReversals = 0;
  }
}

// Reversal UI Prompt Component (for rendering)
export function createReversalPrompt(reversalManager) {
  return {
    show: reversalManager.promptVisible,
    type: reversalManager.promptType,
    progress: reversalManager.activeWindow ? 
      (performance.now() / 1000 - reversalManager.activeWindow.startTime) / reversalManager.activeWindow.duration : 0,
    requiredStock: reversalManager.requiredStockType,
    stocks: reversalManager.getStocks(),
    onInput: (stockType) => reversalManager.attemptReversal(stockType),
  };
}

// AI Reversal Decision
export function aiReversalDecision(ai, categoryId) {
  if (!ai.reversalManager) return false;
  return ai.reversalManager.aiAttemptReversal(categoryId);
}

export default {
  ReversalManager,
  REVERSAL_CONFIG,
  aiReversalDecision,
};