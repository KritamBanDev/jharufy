import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';
import csrf from 'csurf';
import Logger from '../utils/logger.js';

// Rate limiting with advanced configuration
export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { 
      success: false,
      message,
      statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests in production
    skipSuccessfulRequests: process.env.NODE_ENV === 'production',
    // Custom key generator for better IP tracking
    keyGenerator: (req) => {
      const ip = req.ip || req.connection.remoteAddress || 
                req.socket.remoteAddress || 
                (req.connection.socket ? req.connection.socket.remoteAddress : null);
      
      // Log rate limit warning only in development
      if (process.env.NODE_ENV === 'development') {
        Logger.warn(`Rate limit hit for IP: ${ip}`);
      }
      return ip;
    },
    // Use memory store for development, Redis for production
    // store: undefined means use default memory store
    // Skip for whitelisted IPs
    skip: (req) => {
      const whitelist = process.env.IP_WHITELIST ? process.env.IP_WHITELIST.split(',') : [];
      return whitelist.includes(req.ip);
    }
  });
};

// General rate limiter
export const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  150, // Increased for better UX in development
  'Too many requests from this IP, please try again later.'
);

// Auth rate limiter (stricter for sensitive operations)
export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  25, // Stricter for auth endpoints
  'Too many authentication attempts, please try again later.'
);

// Upload rate limiter
export const uploadLimiter = createRateLimiter(
  10 * 60 * 1000, // 10 minutes
  20, // 20 uploads per 10 minutes
  'Too many uploads, please try again later.'
);

// CSRF Protection middleware - disabled in development for easier testing
export const csrfProtection = process.env.NODE_ENV === 'production' 
  ? csrf({
      cookie: {
        secure: true,
        sameSite: 'strict',
        httpOnly: true
      }
    })
  : (req, res, next) => next(); // Skip CSRF in development

// Security middleware stack
export const securityMiddleware = [
  // Helmet for various security headers
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:", "wss:"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for some APIs
  }),
  
  // Data sanitization against NoSQL query injection
  mongoSanitize(),
  
  // Prevent HTTP Parameter Pollution attacks
  hpp({
    whitelist: ['sort', 'fields', 'page', 'limit']
  }),

  // CSRF Protection
  csrfProtection
];

export default securityMiddleware;
