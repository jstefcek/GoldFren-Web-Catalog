export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000, blockDuration = 30 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDuration = blockDuration;
    this.attempts = this.getStoredAttempts();
    this.failedAttempts = 0;
    this.blockUntil = this.getBlockTime();
  }

  getStoredAttempts() {
    try {
      const stored = sessionStorage.getItem('login_attempts');
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      // Validate the data structure
      if (!Array.isArray(parsed)) return [];
      
      return parsed.filter(attempt => 
        typeof attempt === 'number' && 
        attempt > 0 && 
        attempt <= Date.now()
      );
    } catch {
      return [];
    }
  }

  getBlockTime() {
    try {
      const stored = sessionStorage.getItem('login_block_until');
      const time = stored ? parseInt(stored, 10) : 0;
      return isNaN(time) ? 0 : time;
    } catch {
      return 0;
    }
  }

  saveAttempts() {
    try {
      sessionStorage.setItem('login_attempts', JSON.stringify(this.attempts));
      if (this.blockUntil > Date.now()) {
        sessionStorage.setItem('login_block_until', this.blockUntil.toString());
      }
    } catch (error) {
      console.error('Failed to save rate limit data:', error);
    }
  }

  cleanupOldAttempts() {
    const now = Date.now();
    this.attempts = this.attempts.filter(attempt => now - attempt < this.windowMs);
    
    // Clear block if expired
    if (this.blockUntil && now > this.blockUntil) {
      this.blockUntil = 0;
      sessionStorage.removeItem('login_block_until');
    }
    
    this.saveAttempts();
  }

  isBlocked() {
    this.cleanupOldAttempts();
    const now = Date.now();
    
    // Check if still in block period
    if (this.blockUntil && now < this.blockUntil) {
      return true;
    }
    
    // Check if exceeded attempts
    return this.attempts.length >= this.maxAttempts;
  }

  recordAttempt() {
    this.cleanupOldAttempts();
    const now = Date.now();
    this.attempts.push(now);
    this.failedAttempts++;
    
    // Implement exponential backoff for repeated failures
    if (this.failedAttempts >= this.maxAttempts) {
      this.blockUntil = now + this.blockDuration;
    }
    
    this.saveAttempts();
  }

  getRemainingTime() {
    this.cleanupOldAttempts();
    const now = Date.now();
    
    if (this.blockUntil && now < this.blockUntil) {
      return Math.ceil((this.blockUntil - now) / 1000 / 60);
    }
    
    if (this.attempts.length === 0) return 0;
    const oldestAttempt = Math.min(...this.attempts);
    const remainingMs = this.windowMs - (now - oldestAttempt);
    return Math.max(0, Math.ceil(remainingMs / 1000 / 60));
  }

  clear() {
    this.attempts = [];
    this.failedAttempts = 0;
    this.blockUntil = 0;
    sessionStorage.removeItem('login_attempts');
    sessionStorage.removeItem('login_block_until');
  }
}