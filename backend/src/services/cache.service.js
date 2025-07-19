import Logger from './logger.js';

// Simple in-memory cache for development
const memoryCache = new Map();

// Create Redis client with retry strategy only in production
let redis = null;

if (process.env.NODE_ENV === 'production' && process.env.REDIS_HOST) {
  try {
    const Redis = await import('ioredis');
    redis = new Redis.default({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on('error', (err) => Logger.error('Redis Client Error:', err));
    redis.on('connect', () => Logger.info('Redis Client Connected'));
  } catch (error) {
    Logger.warn('Redis not available, using memory cache');
  }
}

export class CacheService {
  static DEFAULT_TTL = 3600; // 1 hour in seconds

  static async get(key) {
    try {
      if (redis) {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
      } else {
        // Use memory cache
        const item = memoryCache.get(key);
        if (item && item.expiry > Date.now()) {
          return item.value;
        } else if (item) {
          memoryCache.delete(key);
        }
        return null;
      }
    } catch (error) {
      Logger.error('Cache Get Error:', error);
      return null;
    }
  }

  static async set(key, value, ttl = this.DEFAULT_TTL) {
    try {
      if (redis) {
        const stringValue = JSON.stringify(value);
        await redis.setex(key, ttl, stringValue);
      } else {
        // Use memory cache
        memoryCache.set(key, {
          value,
          expiry: Date.now() + (ttl * 1000)
        });
      }
      return true;
    } catch (error) {
      Logger.error('Cache Set Error:', error);
      return false;
    }
  }

  static async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      Logger.error('Cache Delete Error:', error);
      return false;
    }
  }

  static async flush() {
    try {
      await redis.flushall();
      return true;
    } catch (error) {
      Logger.error('Cache Flush Error:', error);
      return false;
    }
  }

  // Cache middleware for MongoDB queries
  static cacheMiddleware(ttl = this.DEFAULT_TTL) {
    return async (req, res, next) => {
      const key = `cache:${req.originalUrl}`;

      try {
        const cachedData = await this.get(key);
        if (cachedData) {
          return res.json(cachedData);
        }

        // Store original send function
        const originalSend = res.json;

        // Override res.json method
        res.json = function (data) {
          // Store the data in cache
          CacheService.set(key, data, ttl);
          
          // Call original method
          return originalSend.call(this, data);
        };

        next();
      } catch (error) {
        Logger.error('Cache Middleware Error:', error);
        next();
      }
    };
  }

  // Invalidate cache by pattern
  static async invalidatePattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      Logger.error('Cache Pattern Invalidation Error:', error);
      return false;
    }
  }
}

export default CacheService;
