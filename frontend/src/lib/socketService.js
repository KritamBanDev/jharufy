import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userId) {
    try {
      if (this.socket) {
        this.disconnect();
      }

      // Socket.IO server runs on separate port/service
      const socketServerUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002';
      
      this.socket = io(socketServerUrl, {
        autoConnect: true,
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        if (import.meta.env.DEV) {
          console.log('Connected to server:', this.socket.id);
        }
        this.isConnected = true;
        
        // Join with user ID
        if (userId) {
          this.socket.emit('user:join', userId);
        }
      });

      this.socket.on('disconnect', (reason) => {
        if (import.meta.env.DEV) {
          console.log('Disconnected from server:', reason);
        }
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });

      return this.socket;
    } catch (error) {
      console.error('Failed to connect to socket:', error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Call Methods
  initiateCall(callData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('call:initiate', callData);
    }
  }

  acceptCall(callData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('call:accept', callData);
    }
  }

  declineCall(callData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('call:decline', callData);
    }
  }

  endCall(callData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('call:end', callData);
    }
  }

  // Event Listeners
  onIncomingCall(callback) {
    if (this.socket) {
      this.socket.on('call:incoming', callback);
    }
  }

  onCallStatus(callback) {
    if (this.socket) {
      this.socket.on('call:status', callback);
    }
  }

  onCallAccepted(callback) {
    if (this.socket) {
      this.socket.on('call:accepted', callback);
    }
  }

  onCallDeclined(callback) {
    if (this.socket) {
      this.socket.on('call:declined', callback);
    }
  }

  onCallStart(callback) {
    if (this.socket) {
      this.socket.on('call:start', callback);
    }
  }

  onCallEnded(callback) {
    if (this.socket) {
      this.socket.on('call:ended', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
