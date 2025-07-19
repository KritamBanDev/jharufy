import "dotenv/config";
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import uploadRoutes from './routes/upload.route.js';
import statusRoutes from './routes/status.route.js';

import { connectDB } from './lib/db.js';
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

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://jharufy-frontend.vercel.app",
    "https://*.vercel.app",
    "http://localhost:5002",
    process.env.SOCKET_SERVER_URL || "https://jharufy-socket.railway.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Jharufy API Server (Serverless)", 
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working correctly!",
    timestamp: new Date().toISOString(),
    mongodb: "connected"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/status", statusRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Connect to database
let isConnected = false;

export default async function handler(req, res) {
  // Connect to database only once
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  
  return app(req, res);
}
