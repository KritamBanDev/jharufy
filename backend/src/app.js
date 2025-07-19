// app.js - Express app without server initialization for testing
import express from 'express';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import uploadRoutes from './routes/upload.route.js';
import statusRoutes from './routes/status.route.js';

import { globalErrorHandler } from './middleware/errorHandler.middleware.js';
import { securityMiddleware, generalLimiter } from './middleware/security.middleware.js';
import { AppError } from './utils/errorHandler.js';

const app = express();

// Trust proxy (important for rate limiting behind proxies)
app.set('trust proxy', 1);

// Security middleware
app.use(securityMiddleware);

// Rate limiting
app.use(generalLimiter);

// Basic middleware
app.use(compression());
app.use(cookieParser());

// CORS configuration - Updated for socket server
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5002", // Socket server
    "https://jharufy.vercel.app",
    "https://*.vercel.app",
    "https://*.railway.app" // Railway socket server
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/status', statusRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler (must be last middleware)
app.use(globalErrorHandler);

export { app };
