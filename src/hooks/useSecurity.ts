import { useState, useEffect, useCallback } from 'react';

interface SecurityState {
  isBlocked: boolean;
  blockExpiry: number;
  requestCount: number;
  lastRequestTime: number;
}

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 10, // Max 10 requests
  WINDOW_MS: 60000, // Per 1 minute
  BLOCK_DURATION_MS: 300000 // Block for 5 minutes if exceeded
};

// Rate limiting hook
export function useRateLimit() {
  const [security, setSecurity] = useState<SecurityState>({
    isBlocked: false,
    blockExpiry: 0,
    requestCount: 0,
    lastRequestTime: Date.now()
  });

  useEffect(() => {
    const stored = localStorage.getItem('security_state');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.blockExpiry && parsed.blockExpiry > Date.now()) {
        setSecurity(parsed);
      } else {
        setSecurity({
          isBlocked: false,
          blockExpiry: 0,
          requestCount: 0,
          lastRequestTime: Date.now()
        });
      }
    }
  }, []);

  const saveSecurity = useCallback((newState: SecurityState) => {
    localStorage.setItem('security_state', JSON.stringify(newState));
    setSecurity(newState);
  }, []);

  const checkRateLimit = useCallback((): { allowed: boolean; message?: string } => {
    const now = Date.now();

    // Check if currently blocked
    if (security.isBlocked && security.blockExpiry > now) {
      const remainingMinutes = Math.ceil((security.blockExpiry - now) / 60000);
      return {
        allowed: false,
        message: `Terlalu banyak request. Silakan coba lagi dalam ${remainingMinutes} menit.`
      };
    }

    // Reset counter if window has passed
    if (now - security.lastRequestTime > RATE_LIMIT.WINDOW_MS) {
      const newState: SecurityState = {
        isBlocked: false,
        blockExpiry: 0,
        requestCount: 1,
        lastRequestTime: now
      };
      saveSecurity(newState);
      return { allowed: true };
    }

    // Check if limit exceeded
    if (security.requestCount >= RATE_LIMIT.MAX_REQUESTS) {
      const newState: SecurityState = {
        isBlocked: true,
        blockExpiry: now + RATE_LIMIT.BLOCK_DURATION_MS,
        requestCount: security.requestCount,
        lastRequestTime: security.lastRequestTime
      };
      saveSecurity(newState);
      
      // Set suspicious activity flag
      localStorage.setItem('suspicious_activity', 'true');
      
      return {
        allowed: false,
        message: 'Terlalu banyak request. Anda diblokir selama 5 menit.'
      };
    }

    // Increment counter
    const newState: SecurityState = {
      ...security,
      requestCount: security.requestCount + 1,
      lastRequestTime: now
    };
    saveSecurity(newState);
    return { allowed: true };
  }, [security, saveSecurity]);

  return { checkRateLimit, security };
}

// Bot detection hook
export function useBotDetection() {
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    const botIndicators = [
      !navigator.userAgent,
      /bot|crawler|spider|crawling|headless/i.test(navigator.userAgent),
      !window.sessionStorage,
      !window.localStorage,
      window.outerWidth === 0 && window.outerHeight === 0,
      navigator.webdriver === true,
      /selenium|webdriver|phantomjs/i.test(navigator.userAgent)
    ];

    if (botIndicators.some(indicator => indicator)) {
      setIsBot(true);
      console.warn('Bot activity detected');
    }
  }, []);

  return { isBot };
}

// Click spam protection
export function useClickProtection() {
  const [lastClickTime, setLastClickTime] = useState(0);
  const CLICK_DELAY = 500;

  const canClick = useCallback((): boolean => {
    const now = Date.now();
    if (now - lastClickTime < CLICK_DELAY) {
      return false;
    }
    setLastClickTime(now);
    return true;
  }, [lastClickTime]);

  return { canClick };
}

// Visitor tracking for DDoS detection
export function useVisitorTracking() {
  useEffect(() => {
    // Track unique visitors
    const visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      localStorage.setItem('visitor_id', `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }

    // Track visit timestamp
    const visits = JSON.parse(localStorage.getItem('visit_history') || '[]');
    visits.push(Date.now());
    
    // Keep only last 100 visits
    if (visits.length > 100) {
      visits.shift();
    }
    
    localStorage.setItem('visit_history', JSON.stringify(visits));

    // Check for suspicious activity (more than 50 visits in 1 hour)
    const oneHourAgo = Date.now() - 3600000;
    const recentVisits = visits.filter((v: number) => v > oneHourAgo);
    
    if (recentVisits.length > 50) {
      localStorage.setItem('suspicious_activity', 'true');
    }
  }, []);
}

// Form spam protection (honeypot)
export function useHoneypot() {
  const [honeypotValue, setHoneypotValue] = useState('');

  const isSpam = useCallback((): boolean => {
    return honeypotValue !== '';
  }, [honeypotValue]);

  return { honeypotValue, setHoneypotValue, isSpam };
}
