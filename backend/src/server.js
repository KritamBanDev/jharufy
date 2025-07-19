import express from 'express';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
// Removed Socket.IO imports for serverless deployment

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
// Removed Socket.IO server setup for serverless deployment

const PORT = process.env.PORT || 5001;

// Trust proxy (important for rate limiting behind proxies)
app.set('trust proxy', 1);

// Security middleware
app.use(securityMiddleware);

// Rate limiting
app.use(generalLimiter);

// Compression middleware
app.use(compression());

// CORS configuration with production URLs and socket server
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5174", // Additional port for development
    "http://localhost:5175", // In case it switches again
    "https://jharufy.vercel.app", // Add your Vercel frontend URL
    "https://*.vercel.app", // Allow all Vercel preview deployments
    "http://localhost:5002", // Socket server development
    process.env.SOCKET_SERVER_URL || "https://jharufy-socket.railway.app" // Socket server production
  ],
  credentials: true, //Allow frontend to send cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Body parsing middleware with increased size limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Enhanced static file serving with CORS headers
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, _path, _stat) => {
    // Allow cross-origin access to uploaded files
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
}));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Jharufy API Server (Serverless)", 
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    socketServer: process.env.SOCKET_SERVER_URL || "http://localhost:5002",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users", 
      chat: "/api/chat",
      upload: "/api/upload",
      status: "/api/status"
    }
  });
});

// Test endpoint to verify API is working
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working correctly!",
    timestamp: new Date().toISOString(),
    mongodb: "connected"
  });
});

// Test endpoint to check user existence
app.get("/api/test-user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const User = (await import('./models/User.js')).default;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      res.json({
        exists: true,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          isOnboarded: user.isOnboarded,
          createdAt: user.createdAt
        }
      });
    } else {
      res.json({ exists: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to delete all users (DEVELOPMENT ONLY)
app.delete("/api/admin/delete-all-users", async (req, res) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        error: "This endpoint is not available in production",
        message: "User deletion is only allowed in development mode"
      });
    }

    const User = (await import('./models/User.js')).default;
    const result = await User.deleteMany({});
    
    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} users`,
      deletedCount: result.deletedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: "Failed to delete users"
    });
  }
});

// Admin endpoint to get user count
app.get("/api/admin/user-count", async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default;
    const count = await User.countDocuments();
    
    res.json({
      success: true,
      userCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
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

// Global error handler (must be last middleware)
app.use(globalErrorHandler);

// Connect to database immediately
connectDB();

// Initialize serverless real-time service for Vercel
import realtimeService from './services/serverless-realtime.service.js';

// Initialize real-time service
realtimeService.initialize().catch(console.error);

// For Vercel deployment, export the app
export default app;

// For local development, start the server (no Socket.IO here)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`🔌 Socket.IO server should be running on port 5002`);
    console.log(`📱 Serverless deployment mode - using separate Socket.IO server`);
  });
} else {
  console.log('🚀 Serverless deployment mode - API only');
  console.log('🔌 Socket.IO server should be deployed separately');
}
