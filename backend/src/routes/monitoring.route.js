import express from 'express';
import client from 'prom-client';
import Logger from '../utils/logger.js';

const router = express.Router();

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics (garbage collection, heap size, etc.)
client.collectDefaultMetrics({
  register,
  prefix: 'jharufy_',
});

// Custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const activeWebsocketConnections = new client.Gauge({
  name: 'websocket_connections_active',
  help: 'Number of active WebSocket connections',
});

const databaseOperationsTotal = new client.Counter({
  name: 'database_operations_total',
  help: 'Total number of database operations',
  labelNames: ['operation', 'collection'],
});

const cacheHitRatio = new client.Gauge({
  name: 'cache_hit_ratio',
  help: 'Cache hit ratio',
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeWebsocketConnections);
register.registerMetric(databaseOperationsTotal);
register.registerMetric(cacheHitRatio);

// Middleware to measure request duration
export const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(durationInSeconds);

    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .inc();
  });

  next();
};

// Endpoint to expose metrics
router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    Logger.error('Error generating metrics:', error);
    res.status(500).json({ error: 'Error generating metrics' });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

export const updateWebsocketMetrics = (connections) => {
  activeWebsocketConnections.set(connections);
};

export const updateDatabaseMetrics = (operation, collection) => {
  databaseOperationsTotal.labels(operation, collection).inc();
};

export const updateCacheMetrics = (hitRatio) => {
  cacheHitRatio.set(hitRatio);
};

export default router;
