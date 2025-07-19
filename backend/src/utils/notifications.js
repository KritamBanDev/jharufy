import Notification from '../models/Notification.js';

export const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  relatedStatus = null,
  relatedComment = null
}) => {
  try {
    // Don't create notification if sender and recipient are the same
    if (sender.toString() === recipient.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      relatedStatus,
      relatedComment
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export const getNotificationMessage = (type, senderName) => {
  const messages = {
    friend_request: `${senderName} sent you a friend request`,
    friend_request_accepted: `${senderName} accepted your friend request`,
    status_like: `${senderName} liked your post`,
    status_comment: `${senderName} commented on your post`,
    status_share: `${senderName} shared your post`,
    comment_reply: `${senderName} replied to your comment`
  };

  return messages[type] || 'You have a new notification';
};
