import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'friend_request',
      'friend_request_accepted', 
      'status_like',
      'status_comment',
      'status_share',
      'comment_reply'
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status'
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
