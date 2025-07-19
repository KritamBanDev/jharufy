import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../lib/api";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Reply, 
  Clock,
  User
} from "lucide-react";
import toast from "react-hot-toast";

const NotificationCard = ({ notification }) => {
  const [isRead, setIsRead] = useState(notification.isRead);
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      setIsRead(true);
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to mark as read");
    }
  });

  const handleMarkAsRead = () => {
    if (!isRead) {
      markAsReadMutation.mutate(notification._id);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'status_like':
        return <Heart className={`${iconClass} text-red-500`} />;
      case 'status_comment':
        return <MessageSquare className={`${iconClass} text-blue-500`} />;
      case 'status_share':
        return <Share2 className={`${iconClass} text-green-500`} />;
      case 'comment_reply':
        return <Reply className={`${iconClass} text-purple-500`} />;
      case 'friend_request':
      case 'friend_request_accepted':
        return <User className={`${iconClass} text-orange-500`} />;
      default:
        return <Clock className={`${iconClass} text-gray-500`} />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <div 
      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer ${
        isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start space-x-3">
        {/* Notification Icon */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {/* Sender Profile Picture */}
            <img
              src={notification.sender?.profilePic || "/api/placeholder/32/32"}
              alt={notification.sender?.fullName || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
            
            {/* Sender Name and Action */}
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{notification.sender?.fullName}</span>
                <span className="ml-1">
                  {notification.type === 'status_like' && 'liked your post'}
                  {notification.type === 'status_comment' && 'commented on your post'}
                  {notification.type === 'status_share' && 'shared your post'}
                  {notification.type === 'comment_reply' && 'replied to your comment'}
                  {notification.type === 'friend_request' && 'sent you a friend request'}
                  {notification.type === 'friend_request_accepted' && 'accepted your friend request'}
                </span>
              </p>
            </div>
          </div>

          {/* Related Post Preview (if available) */}
          {notification.relatedStatus && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 border-l-2 border-blue-300">
              <p className="line-clamp-2">
                {notification.relatedStatus.content || 
                 (notification.relatedStatus.images?.length > 0 ? "📷 Photo post" : "Post content")}
              </p>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {formatTime(notification.createdAt)}
            </span>
            
            {/* Unread Indicator */}
            {!isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
