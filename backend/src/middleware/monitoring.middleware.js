import Logger from '../utils/logger.js';
import morgan from 'morgan';

// Custom token for response body
morgan.token('response-body', (_, res) => {
  if (res.statusCode >= 400) {
    return JSON.stringify(res._responseBody);
  }
  return '-';
});

// Custom token for request body
morgan.token('request-body', req => {
  const sanitizedBody = { ...req.body };
  // Remove sensitive data
  delete sanitizedBody.password;
  delete sanitizedBody.token;
  return JSON.stringify(sanitizedBody);
});

// Create custom morgan format
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :request-body :response-body';

export const requestLogger = morgan(morganFormat, {
  stream: {
    write: message => Logger.http(message.trim()),
  },
  skip: (req, res) => {
    // Skip logging for health check endpoints
    if (req.url === '/health' || req.url === '/favicon.ico') {
      return true;
    }
    return false;
  },
});

// Performance monitoring middleware
export const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds
    
    if (time > 1000) { // Log slow requests (over 1 second)
      Logger.warn(`Slow request: ${req.method} ${req.originalUrl} took ${time.toFixed(2)}ms`);
    }
  });

  next();
};
