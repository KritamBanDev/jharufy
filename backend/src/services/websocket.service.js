import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Logger from '../utils/logger.js';
import { CacheService } from '../services/cache.service.js';

export class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.connections = new Map();
    this.setupMiddleware();
    this.setupEventHandlers();
    this.setupHeartbeat();
    this.setupErrorHandling();
  }

  // Authentication and connection tracking middleware
  setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication error');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;

        // Store connection in Redis
        await CacheService.set(`socket:${socket.id}`, {
          userId: decoded.id,
          connectedAt: new Date(),
        });

        next();
      } catch (error) {
        Logger.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });
  }

  // Main event handlers
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
      this.handleDisconnection(socket);
      this.handleCustomEvents(socket);
      this.monitorSocketHealth(socket);
    });
  }

  // Connection handler
  handleConnection(socket) {
    Logger.info(`New socket connection: ${socket.id} for user: ${socket.userId}`);
    this.connections.set(socket.id, {
      userId: socket.userId,
      connectedAt: new Date(),
      lastPing: new Date(),
    });

    // Emit connection acknowledgment
    socket.emit('connected', { id: socket.id });
  }

  // Disconnection handler
  handleDisconnection(socket) {
    socket.on('disconnect', async (reason) => {
      Logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
      
      // Clean up connection data
      this.connections.delete(socket.id);
      await CacheService.del(`socket:${socket.id}`);
      
      // Notify relevant users/rooms if needed
      this.handleDisconnectionNotifications(socket);
    });
  }

  // Custom event handlers
  handleCustomEvents(socket) {
    // Handle messages
    socket.on('message', this.wrapEventHandler(socket, async (data) => {
      // Validate message data
      if (!data.recipientId || !data.content) {
        throw new Error('Invalid message data');
      }

      // Process and broadcast message
      await this.processAndBroadcastMessage(socket, data);
    }));

    // Handle typing indicators
    socket.on('typing', this.wrapEventHandler(socket, (data) => {
      socket.to(data.room).emit('typing', {
        userId: socket.userId,
        room: data.room,
      });
    }));
  }

  // Error handling wrapper
  wrapEventHandler(socket, handler) {
    return async (...args) => {
      try {
        await handler(...args);
      } catch (error) {
        Logger.error('Socket event error:', error);
        socket.emit('error', {
          message: 'An error occurred processing your request',
        });
      }
    };
  }

  // Socket health monitoring
  monitorSocketHealth(socket) {
    const healthCheck = setInterval(() => {
      const connection = this.connections.get(socket.id);
      if (connection) {
        const lastPing = new Date(connection.lastPing);
        const now = new Date();
        
        if (now - lastPing > 60000) { // 1 minute timeout
          Logger.warn(`Unhealthy socket detected: ${socket.id}`);
          socket.disconnect(true);
        }
      }
    }, 30000); // Check every 30 seconds

    socket.on('disconnect', () => {
      clearInterval(healthCheck);
    });
  }

  // Heartbeat mechanism
  setupHeartbeat() {
    setInterval(() => {
      this.io.emit('ping');
    }, 25000);

    this.io.on('connection', (socket) => {
      socket.on('pong', () => {
        const connection = this.connections.get(socket.id);
        if (connection) {
          connection.lastPing = new Date();
        }
      });
    });
  }

  // Error handling setup
  setupErrorHandling() {
    this.io.engine.on('connection_error', (err) => {
      Logger.error('Socket.IO connection error:', err);
    });

    process.on('unhandledRejection', (reason, promise) => {
      Logger.error('Unhandled Rejection at Socket.IO:', reason);
    });
  }

  // Broadcast to all connected clients
  broadcast(event, data, except = null) {
    if (except) {
      this.io.except(except).emit(event, data);
    } else {
      this.io.emit(event, data);
    }
  }

  // Get active connections count
  getActiveConnectionsCount() {
    return this.connections.size;
  }

  // Get user's active connections
  getUserConnections(userId) {
    return Array.from(this.connections.entries())
      .filter(([_, data]) => data.userId === userId)
      .map(([socketId]) => socketId);
  }

  // Close specific connection
  closeConnection(socketId, reason = 'server_terminate') {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.disconnect(true);
      Logger.info(`Forcefully closed connection: ${socketId}, reason: ${reason}`);
    }
  }
}

export default WebSocketService;
