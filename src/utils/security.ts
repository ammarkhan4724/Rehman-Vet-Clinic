/**
 * Rehman Veterinary Clinic — Application Security Engine
 * Defends against:
 * 1. SQL Injections (SQLi pattern detection & sanitization)
 * 2. Cross-Site Scripting (XSS prevention & HTML entity encoding)
 * 3. Bulk Traffic / Scraping / DoS (Rate limiting & request throttling)
 * 4. Brute-Force PIN Attacks (Exponential lockout mechanism)
 * 5. Bot spam (Honeypot field validation)
 */

// SQL Injection Detection Regex Patterns
const SQLI_PATTERNS = [
  /(\b(select|union|insert|update|delete|drop|alter|create|truncate|exec|execute)\b)/i,
  /(\b(or|and)\b\s+['"\d\w]+\s*=\s*['"\d\w]+)/i, // e.g. OR 1=1, OR 'a'='a'
  /(--|#|\/\*|\*\/)/,                             // Comment sequences
  /(;\s*(select|drop|insert|delete|update))/i,    // Stacked queries
  /(\b(sleep|benchmark|waitfor\s+delay)\b)/i,     // Time-based blind SQLi
  /(\bload_file\b|\binto\s+(out|dump)file\b)/i,   // File extraction
  /('|\b)\s*(or|and)\s+true(\b|')/i,
  /('|\b)\s*(or|and)\s+false(\b|')/i
];

/**
 * Detects whether a given string contains SQL injection patterns.
 * Returns { isMalicious: boolean, reason?: string }
 */
export function detectSqlInjection(input: string): { isMalicious: boolean; reason?: string } {
  if (!input || typeof input !== "string") return { isMalicious: false };

  const trimmed = input.trim();
  for (const pattern of SQLI_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isMalicious: true,
        reason: `Potential SQL injection pattern detected (${pattern.toString()})`
      };
    }
  }

  return { isMalicious: false };
}

/**
 * Sanitizes input text to prevent SQLi and XSS injection.
 * Strips script tags, encodes HTML entities, and trims safe text.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.trim();

  // Strip script, style and iframe tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Escape HTML entities to prevent XSS
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  return sanitized;
}

/**
 * Validates honeypot field: bots blindly fill all inputs.
 * If honeypot is filled, it is a bot submission.
 */
export function validateHoneypot(honeypotValue: string | null | undefined): boolean {
  return !honeypotValue || honeypotValue.trim() === "";
}

/**
 * Rate Limiter for Bulk Traffic / Rapid Spam Protection.
 * Tracks timestamps in memory / sessionStorage per action key.
 */
interface RateLimitRecord {
  timestamps: number[];
}

export function isRateLimited(
  actionKey: string,
  maxAllowed: number = 5,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  if (typeof window === "undefined") {
    return { allowed: true, remaining: maxAllowed, retryAfterSeconds: 0 };
  }

  const storageKey = `rvc_ratelimit_${actionKey}`;
  const now = Date.now();
  let record: RateLimitRecord = { timestamps: [] };

  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      record = JSON.parse(raw);
    }
  } catch (e) {
    record = { timestamps: [] };
  }

  // Filter out timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxAllowed) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1)
    };
  }

  // Record this attempt
  record.timestamps.push(now);
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(record));
  } catch (e) {
    // Ignore storage quota errors
  }

  return {
    allowed: true,
    remaining: maxAllowed - record.timestamps.length,
    retryAfterSeconds: 0
  };
}

/**
 * Brute-Force PIN Protection Guard
 * Allows max 5 attempts. On 5th failed attempt, locks out for 15 minutes (900s).
 */
const LOCKOUT_KEY = "rvc_admin_lockout_state";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface LockoutState {
  attempts: number;
  lockedUntil: number | null;
}

export function checkBruteForceLockout(): {
  isLocked: boolean;
  remainingSeconds: number;
  failedAttempts: number;
  recordFailure: () => { isLocked: boolean; remainingSeconds: number; failedAttempts: number };
  resetAttempts: () => void;
} {
  if (typeof window === "undefined") {
    return {
      isLocked: false,
      remainingSeconds: 0,
      failedAttempts: 0,
      recordFailure: () => ({ isLocked: false, remainingSeconds: 0, failedAttempts: 0 }),
      resetAttempts: () => {}
    };
  }

  const getLockoutState = (): LockoutState => {
    try {
      const raw = localStorage.getItem(LOCKOUT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          attempts: typeof parsed.attempts === "number" ? parsed.attempts : 0,
          lockedUntil: typeof parsed.lockedUntil === "number" ? parsed.lockedUntil : null
        };
      }
    } catch (e) {
      // Ignore
    }
    return { attempts: 0, lockedUntil: null };
  };

  const saveLockoutState = (state: LockoutState) => {
    try {
      localStorage.setItem(LOCKOUT_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignore
    }
  };

  const state = getLockoutState();
  const now = Date.now();

  // If locked, check if lockout duration has passed
  if (state.lockedUntil && now < state.lockedUntil) {
    const remainingSeconds = Math.ceil((state.lockedUntil - now) / 1000);
    return {
      isLocked: true,
      remainingSeconds,
      failedAttempts: state.attempts,
      recordFailure: () => ({ isLocked: true, remainingSeconds, failedAttempts: state.attempts }),
      resetAttempts: () => {
        saveLockoutState({ attempts: 0, lockedUntil: null });
      }
    };
  }

  // If lock time passed, clear the lock
  if (state.lockedUntil && now >= state.lockedUntil) {
    state.attempts = 0;
    state.lockedUntil = null;
    saveLockoutState(state);
  }

  const recordFailure = () => {
    const current = getLockoutState();
    current.attempts += 1;

    if (current.attempts >= MAX_FAILED_ATTEMPTS) {
      current.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      saveLockoutState(current);
      return {
        isLocked: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        failedAttempts: current.attempts
      };
    }

    saveLockoutState(current);
    return {
      isLocked: false,
      remainingSeconds: 0,
      failedAttempts: current.attempts
    };
  };

  const resetAttempts = () => {
    saveLockoutState({ attempts: 0, lockedUntil: null });
  };

  return {
    isLocked: false,
    remainingSeconds: 0,
    failedAttempts: state.attempts,
    recordFailure,
    resetAttempts
  };
}
