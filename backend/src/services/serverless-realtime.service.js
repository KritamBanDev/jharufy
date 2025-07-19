import { StreamChat } from 'stream-chat';

/**
 * Serverless-compatible real-time service using Stream Chat
 * This replaces Socket.IO for Vercel deployment
 */

class ServerlessRealtimeService {
  constructor() {
    this.client = StreamChat.getInstance(
      process.env.STREAM_API_KEY,
      process.env.STREAM_API_SECRET
    );
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Stream Chat handles connections automatically
      this.isInitialized = true;
      console.log('✅ Serverless real-time service initialized with Stream Chat');
    } catch (error) {
      console.error('❌ Failed to initialize serverless real-time service:', error);
      throw error;
    }
  }

  /**
   * Create or update a user in Stream Chat
   */
  async createUser(userId, userData) {
    try {
      await this.client.upsertUser({
        id: userId,
        name: userData.fullName || userData.name,
        image: userData.profilePic || userData.avatar,
        role: 'user',
        ...userData
      });
      
      console.log(`✅ User ${userId} created/updated in Stream Chat`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create user ${userId} in Stream Chat:`, error);
      return false;
    }
  }

  /**
   * Generate a user token for Stream Chat authentication
   */
  generateUserToken(userId) {
    try {
      return this.client.createToken(userId);
    } catch (error) {
      console.error(`❌ Failed to generate token for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create a chat channel
   */
  async createChannel(type, channelId, channelData, creatorId) {
    try {
      const channel = this.client.channel(type, channelId, {
        created_by_id: creatorId,
        ...channelData
      });
      
      await channel.create();
      console.log(`✅ Channel ${channelId} created`);
      return channel;
    } catch (error) {
      console.error(`❌ Failed to create channel ${channelId}:`, error);
      throw error;
    }
  }

  /**
   * Send real-time notification (using Stream Chat webhooks)
   */
  async sendNotification(userId, notification) {
    try {
      // Create a notification channel for the user
      const channel = this.client.channel('notification', `user_${userId}`, {
        name: 'Notifications',
        members: [userId]
      });

      await channel.sendMessage({
        text: notification.message,
        type: 'notification',
        user_id: 'system',
        custom: {
          notificationType: notification.type,
          data: notification.data,
          timestamp: new Date().toISOString()
        }
      });

      console.log(`✅ Notification sent to user ${userId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send notification to user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Update user's online status
   */
  async updateUserStatus(userId, isOnline) {
    try {
      await this.client.updateUser({
        id: userId,
        online: isOnline,
        last_active: new Date().toISOString()
      });
      
      console.log(`✅ User ${userId} status updated: ${isOnline ? 'online' : 'offline'}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to update user ${userId} status:`, error);
      return false;
    }
  }

  /**
   * Send real-time status update (for status posts)
   */
  async broadcastStatusUpdate(statusData) {
    try {
      // Create a general channel for status updates
      const channel = this.client.channel('status_updates', 'global', {
        name: 'Status Updates'
      });

      await channel.sendMessage({
        text: `New status by ${statusData.author?.fullName}`,
        type: 'status_update',
        user_id: statusData.author?._id || 'system',
        custom: {
          statusId: statusData._id,
          statusData: statusData,
          timestamp: new Date().toISOString()
        }
      });

      console.log(`✅ Status update broadcasted for ${statusData._id}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to broadcast status update:', error);
      return false;
    }
  }

  /**
   * Handle friend request notifications
   */
  async sendFriendRequestNotification(fromUserId, toUserId, requestData) {
    try {
      await this.sendNotification(toUserId, {
        type: 'friend_request',
        message: `You have a new friend request from ${requestData.fromUser?.fullName}`,
        data: {
          requestId: requestData._id,
          fromUser: requestData.fromUser,
          type: 'friend_request'
        }
      });

      console.log(`✅ Friend request notification sent from ${fromUserId} to ${toUserId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send friend request notification:', error);
      return false;
    }
  }

  /**
   * Clean up (for graceful shutdown)
   */
  async cleanup() {
    try {
      // Stream Chat handles cleanup automatically
      this.isInitialized = false;
      console.log('✅ Serverless real-time service cleaned up');
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
}

// Create singleton instance
const realtimeService = new ServerlessRealtimeService();

export default realtimeService;