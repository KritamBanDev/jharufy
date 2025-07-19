# Migration Guide: Socket.IO to Stream Chat & Local Storage to Cloudinary

This guide explains the changes made to make Jharufy compatible with Vercel serverless deployment.

## 🔄 Real-time Features Migration

### Before: Socket.IO (Not Serverless Compatible)
```javascript
// Old implementation - required persistent connections
import { Server } from 'socket.io';
const io = new Server(server);

io.on('connection', (socket) => {
  // Handle real-time events
  socket.on('friend_request', (data) => {
    socket.to(data.recipient).emit('notification', data);
  });
});
```

### After: Stream Chat (Serverless Compatible) ✅
```javascript
// New implementation - serverless-realtime.service.js
import { StreamChat } from 'stream-chat';

class ServerlessRealtimeService {
  async sendFriendRequestNotification(fromUserId, toUserId, requestData) {
    await this.sendNotification(toUserId, {
      type: 'friend_request',
      message: `You have a new friend request from ${requestData.fromUser?.fullName}`,
      data: requestData
    });
  }

  async broadcastStatusUpdate(statusData) {
    const channel = this.client.channel('status_updates', 'global');
    await channel.sendMessage({
      text: `New status by ${statusData.author?.fullName}`,
      type: 'status_update',
      custom: { statusData }
    });
  }
}
```

## 📁 Image Storage Migration

### Before: Local File Storage (Not Available on Vercel)
```javascript
// Old implementation - required local file system
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pics');
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}.jpg`);
  }
});

// Served static files
app.use('/uploads', express.static('uploads'));
```

### After: Cloudinary CDN (Serverless Compatible) ✅
```javascript
// New implementation - cloudinary.service.js
const storage = multer.memoryStorage();

class CloudinaryService {
  async uploadProfilePicture(buffer, userId) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'jharufy/profiles',
          public_id: `profile_${userId}_${Date.now()}`,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  }
}
```

## 🔄 Updated Controllers

### Status Controller Changes
```javascript
// Added real-time broadcasting
import realtimeService from "../services/serverless-realtime.service.js";

export const createStatus = catchAsync(async (req, res, next) => {
  // ... create status logic
  
  // NEW: Real-time broadcast via Stream Chat
  try {
    await realtimeService.broadcastStatusUpdate(status);
  } catch (realtimeError) {
    console.error('⚠️ Real-time broadcast failed:', realtimeError.message);
    // Don't fail the request if real-time fails
  }
  
  res.status(201).json({ success: true, data: status });
});
```

### User Controller Changes
```javascript
// Added real-time friend request notifications
export const sendFriendRequest = catchAsync(async (req, res, next) => {
  // ... create friend request logic
  
  // NEW: Real-time notification via Stream Chat
  try {
    await realtimeService.sendFriendRequestNotification(
      myId.toString(), 
      recipientId, 
      { _id: friendRequest._id, fromUser: sender }
    );
  } catch (realtimeError) {
    console.error('⚠️ Real-time notification failed:', realtimeError.message);
  }
  
  res.status(201).json({ success: true, data: friendRequest });
});
```

### Upload Controller Changes
```javascript
// Complete rewrite for Cloudinary
export const uploadProfilePicture = async (req, res, next) => {
  try {
    // NEW: Upload to Cloudinary from memory buffer
    const cloudinaryResult = await cloudinaryService.uploadProfilePicture(
      req.file.buffer, 
      userId
    );
    
    // Update user with Cloudinary URL
    const updatedUser = await User.findByIdAndUpdate(userId, {
      profilePic: cloudinaryResult.url
    }, { new: true });

    res.status(200).json({
      success: true,
      url: cloudinaryResult.url,
      storage_type: 'cloudinary'
    });
  } catch (error) {
    next(error);
  }
};
```

## 🌍 Environment Variables Changes

### Added Variables
```env
# Stream Chat (for real-time features)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
STREAM_APP_ID=your_stream_app_id

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📱 Frontend Integration

### Stream Chat Setup
```javascript
// Install Stream Chat in frontend
npm install stream-chat stream-chat-react

// Initialize client
import { StreamChat } from 'stream-chat';
const client = StreamChat.getInstance(process.env.VITE_STREAM_API_KEY);

// Connect user
await client.connectUser(
  { id: user.id, name: user.fullName, image: user.profilePic },
  userToken
);
```

### Real-time Notifications
```javascript
// Listen for notifications
const notificationChannel = client.channel('notification', `user_${userId}`);
await notificationChannel.watch();

notificationChannel.on('message.new', (event) => {
  if (event.message.type === 'notification') {
    showNotification(event.message.custom.data);
  }
});
```

## 🔧 New Services Created

1. **`serverless-realtime.service.js`** - Stream Chat integration
2. **`cloudinary.service.js`** - Complete image handling
3. **`upload.controller.new.js`** - Cloudinary-based uploads
4. **`upload.route.new.js`** - Updated routes for new controller

## 🚀 Deployment Benefits

### Performance Improvements
- ✅ **CDN Delivery**: Images served from Cloudinary CDN globally
- ✅ **Auto Optimization**: WebP conversion, quality optimization
- ✅ **Serverless Scaling**: Automatic scaling with Vercel
- ✅ **Real-time Reliability**: Stream Chat handles connections

### Cost Optimization
- ✅ **No Server Costs**: Vercel Functions only charge for usage
- ✅ **Efficient Storage**: Cloudinary handles image optimization
- ✅ **Stream Chat Free Tier**: Generous limits for real-time features

### Reliability
- ✅ **99.9% Uptime**: Vercel and Cloudinary SLA
- ✅ **Global CDN**: Fast image delivery worldwide
- ✅ **Auto Healing**: Serverless functions auto-restart

## 📋 Testing Checklist

After migration, test these features:

- [ ] Profile picture upload works
- [ ] Status images upload works
- [ ] Images load from Cloudinary
- [ ] Real-time friend request notifications
- [ ] Real-time status update notifications
- [ ] User online/offline status
- [ ] All API endpoints respond correctly
- [ ] Frontend builds and deploys
- [ ] Environment variables are set

## 🎯 Migration Complete!

Your app is now fully compatible with Vercel serverless deployment with:
- Stream Chat replacing Socket.IO for real-time features
- Cloudinary replacing local storage for images
- Production-ready configuration
- Scalable serverless architecture
