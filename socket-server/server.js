import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import "dotenv/config";

// Create Express app for Socket.IO server
const app = express();
const server = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "https://jharufy.vercel.app", // Your Vercel frontend
      "https://*.vercel.app" // All Vercel preview deployments
    ],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.SOCKET_PORT || 5002;

// Basic CORS for HTTP endpoints
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://jharufy.vercel.app",
    "https://*.vercel.app"
  ],
  credentials: true
}));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Socket.IO Call Signaling Server", 
    status: "healthy",
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    service: "socket-signaling",
    connectedUsers: connectedUsers.size,
    uptime: process.uptime()
  });
});

// Socket.IO Call Signaling (moved from main server)
const connectedUsers = new Map(); // Store connected users: userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected to call signaling:', socket.id);

  // User joins with their user ID
  socket.on('user:join', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined call signaling with socket ${socket.id}`);
    
    // Emit user online status to other connected users
    socket.broadcast.emit('user:online', { userId });
  });

  // Initiate call
  socket.on('call:initiate', (data) => {
    const { callerId, receiverId, callType, channelId } = data;
    const receiverSocketId = connectedUsers.get(receiverId);
    
    if (receiverSocketId) {
      console.log(`Call initiated: ${callerId} calling ${receiverId}`);
      
      // Send incoming call notification to receiver
      io.to(receiverSocketId).emit('call:incoming', {
        callerId,
        callerName: data.callerName,
        callerAvatar: data.callerAvatar,
        callType, // 'video' or 'audio'
        channelId
      });

      // Send call status to caller
      socket.emit('call:status', { status: 'ringing', receiverId });
    } else {
      // Receiver is offline
      console.log(`User ${receiverId} is offline`);
      socket.emit('call:status', { status: 'offline', receiverId });
    }
  });

  // Call accepted
  socket.on('call:accept', (data) => {
    const { callerId, receiverId, channelId } = data;
    const callerSocketId = connectedUsers.get(callerId);
    
    if (callerSocketId) {
      console.log(`Call accepted: ${receiverId} accepted call from ${callerId}`);
      
      // Notify caller that call was accepted
      io.to(callerSocketId).emit('call:accepted', {
        receiverId,
        channelId
      });

      // Both users should now navigate to call page
      socket.emit('call:start', { channelId });
      io.to(callerSocketId).emit('call:start', { channelId });
    }
  });

  // Call declined
  socket.on('call:decline', (data) => {
    const { callerId, receiverId } = data;
    const callerSocketId = connectedUsers.get(callerId);
    
    if (callerSocketId) {
      console.log(`Call declined: ${receiverId} declined call from ${callerId}`);
      
      // Notify caller that call was declined
      io.to(callerSocketId).emit('call:declined', {
        receiverId
      });
    }
  });

  // Call ended
  socket.on('call:end', (data) => {
    const { callerId, receiverId } = data;
    const callerSocketId = connectedUsers.get(callerId);
    const receiverSocketId = connectedUsers.get(receiverId);
    
    console.log(`Call ended between ${callerId} and ${receiverId}`);
    
    // Notify both parties that call ended
    if (callerSocketId) {
      io.to(callerSocketId).emit('call:ended', { endedBy: socket.userId });
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('call:ended', { endedBy: socket.userId });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected from call signaling`);
      
      // Emit user offline status to other connected users
      socket.broadcast.emit('user:offline', { userId: socket.userId });
    }
  });
});

// Start the Socket.IO server
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO Call Signaling Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
