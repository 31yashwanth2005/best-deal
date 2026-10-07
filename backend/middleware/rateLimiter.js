import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

const makeLimiter = (maxRequests, windowMs, message) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message
      }
    }
  });

export const generalLimiter = makeLimiter(
  env.RATE_LIMIT_MAX,
  env.RATE_LIMIT_WINDOW_MS,
  'Too many requests from this IP, please try again later.'
);

export const authLimiter = makeLimiter(
  15,
  15 * 60 * 1000,
  'Too many authentication attempts, please try again in 15 minutes.'
);

export const aiLimiter = makeLimiter(
  20,
  15 * 60 * 1000,
  'Too many AI analysis requests, please try again in 15 minutes.'
);

export const alertLimiter = makeLimiter(
  30,
  15 * 60 * 1000,
  'Too many price alert requests, please try again in 15 minutes.'
);
