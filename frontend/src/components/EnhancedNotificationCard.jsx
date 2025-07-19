import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../lib/api";
import { Link } from "react-router-dom";
import { 
  HeartIcon, 
  MessageSquareIcon, 
  ShareIcon, 
  ReplyIcon, 
  ClockIcon,
  UserIcon,
  CheckIcon,
  XIcon,
  MoreHorizontalIcon,
  UserPlusIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { safeFormatDistanceToNow } from "../utils/dateUtils";

const EnhancedNotificationCard = ({ notification }) => {
  const [isRead, setIsRead] = useState(notification.isRead);
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      setIsRead(true);
      queryClient.invalidateQueries({ queryKey: ["notifications", "friendRequests"] });
      toast.success("Marked as read");
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
    const iconClass = "size-6";
    switch (type) {
      case 'status_like':
        return <HeartIcon className={`${iconClass} text-red-500 fill-current`} />;
      case 'status_comment':
        return <MessageSquareIcon className={`${iconClass} text-blue-500`} />;
      case 'status_share':
        return <ShareIcon className={`${iconClass} text-green-500`} />;
      case 'comment_reply':
        return <ReplyIcon className={`${iconClass} text-purple-500`} />;
      case 'friend_request':
        return <UserPlusIcon className={`${iconClass} text-orange-500`} />;
      case 'friend_request_accepted':
        return <CheckIcon className={`${iconClass} text-green-500`} />;
      default:
        return <ClockIcon className={`${iconClass} text-gray-500`} />;
    }
  };

  const getNotificationBg = () => {
    if (!isRead) {
      switch (notification.type) {
        case "friend_request":
        case "friend_request_accepted":
          return "from-blue-500/10 to-blue-500/5 border-blue-500/20";
        case "status_like":
          return "from-red-500/10 to-red-500/5 border-red-500/20";
        case "status_comment":
        case "comment_reply":
          return "from-green-500/10 to-green-500/5 border-green-500/20";
        case "status_share":
          return "from-purple-500/10 to-purple-500/5 border-purple-500/20";
        default:
          return "from-primary/10 to-primary/5 border-primary/20";
      }
    }
    return "from-base-200/30 to-base-200/10 border-base-300/30";
  };

  return (
    <div 
      className={`group relative bg-gradient-to-r ${getNotificationBg()} rounded-3xl border p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
        !isRead ? 'shadow-lg' : 'shadow-md'
      }`}
      onClick={handleMarkAsRead}
    >
      {/* Unread indicator */}
      {!isRead && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
        </div>
      )}

      <div className="flex items-start gap-5">
        {/* Enhanced Avatar */}
        <Link 
          to={`/profile/${notification.sender._id}`}
          className="relative shrink-0 group-hover:scale-110 transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`avatar ring-4 ring-offset-2 ring-offset-base-100 transition-all duration-300 ${
            !isRead ? 'ring-primary/50' : 'ring-base-300/30'
          }`}>
            <div className="w-16 h-16 rounded-2xl shadow-xl overflow-hidden">
              <img 
                src={notification.sender.profilePic} 
                alt={notification.sender.fullName}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
          
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-base-100 shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <p className={`text-lg leading-relaxed ${
                !isRead ? 'font-bold text-base-content' : 'font-medium text-base-content/80'
              }`}>
                <Link 
                  to={`/profile/${notification.sender._id}`}
                  className="font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {notification.sender.fullName}
                </Link>
                <span className="ml-2">{notification.message}</span>
              </p>
              
              {/* Enhanced timestamp */}
              <div className="flex items-center gap-3 mt-3">
                <div className="p-2 bg-base-200/50 rounded-xl backdrop-blur-sm">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <ClockIcon className="size-4" />
                  <span className="font-medium">
                    {safeFormatDistanceToNow(notification.createdAt)} ago
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {!isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead();
                  }}
                  className="btn btn-ghost btn-sm btn-circle hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110"
                  title="Mark as read"
                  disabled={markAsReadMutation.isPending}
                >
                  {markAsReadMutation.isPending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <CheckIcon className="size-4" />
                  )}
                </button>
              )}
              
              <div className="dropdown dropdown-end">
                <button 
                  tabIndex={0} 
                  className="btn btn-ghost btn-sm btn-circle hover:bg-base-200 transition-colors hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontalIcon className="size-4" />
                </button>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-base-100 rounded-2xl w-52 border border-base-300">
                  <li>
                    <Link 
                      to={`/profile/${notification.sender._id}`} 
                      className="gap-3 hover:bg-primary/10 rounded-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <UserIcon className="size-4" />
                      View Profile
                    </Link>
                  </li>
                  {!isRead && (
                    <li>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead();
                        }} 
                        className="gap-3 hover:bg-green-500/10 rounded-xl"
                      >
                        <CheckIcon className="size-4" />
                        Mark as Read
                      </button>
                    </li>
                  )}
                  <li>
                    <button className="gap-3 text-error hover:bg-error/10 rounded-xl">
                      <XIcon className="size-4" />
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced Post Preview */}
          {(notification.type === "status_like" || 
            notification.type === "status_comment" || 
            notification.type === "status_share") && 
            notification.post && (
            <div className="bg-gradient-to-r from-base-100/70 to-base-100/40 p-5 rounded-2xl border border-base-200/50 mt-4 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="w-2 h-16 bg-gradient-to-b from-primary via-secondary to-accent rounded-full shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MessageSquareIcon className="size-4" />
                    Your Post
                  </p>
                  <blockquote className="text-base text-base-content/90 leading-relaxed font-medium italic relative">
                    <span className="text-2xl text-primary/30 absolute -top-1 -left-2">"</span>
                    <span className="relative z-10 line-clamp-3">{notification.post.content}</span>
                    <span className="text-2xl text-primary/30 absolute -bottom-2 -right-1">"</span>
                  </blockquote>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Friend Request Actions */}
          {notification.type === "friend_request" && (
            <div className="flex gap-4 mt-5">
              <button 
                className="btn btn-primary gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/80"
                onClick={(e) => e.stopPropagation()}
              >
                <CheckIcon className="size-5" />
                Accept Request
              </button>
              <button 
                className="btn btn-outline btn-error gap-3 hover:scale-105 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <XIcon className="size-5" />
                Decline
              </button>
            </div>
          )}

          {/* Success message for accepted requests */}
          {notification.type === "friend_request_accepted" && (
            <div className="flex items-center gap-3 mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
              <CheckIcon className="size-6 text-green-500" />
              <span className="text-green-700 font-medium">
                You are now friends! Start chatting and practicing languages together.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Subtle animation border for unread */}
      {!isRead && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-50 animate-pulse pointer-events-none"></div>
      )}

      {/* Loading overlay */}
      {markAsReadMutation.isPending && (
        <div className="absolute inset-0 bg-base-100/80 rounded-3xl flex items-center justify-center backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <span className="text-primary font-medium">Marking as read...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedNotificationCard;
