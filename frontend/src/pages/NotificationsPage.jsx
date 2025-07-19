import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests, cancelFriendRequest, markAllNotificationsAsRead } from "../lib/api";
import { 
  BellIcon, 
  ClockIcon, 
  MessageSquareIcon, 
  UserCheckIcon, 
  CheckCircle2,
  Clock,
  Users,
  Heart,
  Filter,
  X,
  UserX,
  CheckCheck
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import NotificationCard from "../components/NotificationCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getFormattedLanguage } from "../utils/languageUtils";

// Simple Language Flag Component (copied from FriendCard to avoid import issues)
const LanguageFlag = ({ language }) => {
  const flagSvgs = {
    english: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <defs><clipPath id="us"><path fillOpacity=".67" d="M-85.3 0h682.6v512H-85.3z"/></clipPath></defs>
        <g fillRule="evenodd" clipPath="url(#us)" transform="scale(.94)">
          <g strokeWidth="1pt"><path fill="#bd3d44" d="M-85.3 0h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6V197H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6V512H-85.3z"/><path fill="#fff" d="M-85.3 39.4h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3z"/></g>
          <path fill="#192f5d" d="M-85.3 0h272.1v275.7H-85.3z"/>
        </g>
      </svg>
    ),
    italian: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#fff" d="M0 0h640v480H0z"/>
        <path fill="#009246" d="M0 0h213.3v480H0z"/>
        <path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/>
      </svg>
    ),
    arabic: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#006c35" d="M0 0h640v480H0z"/>
        <path fill="#fff" d="M0 0h640v320H0z"/>
        <path fill="#000" d="M0 0h640v160H0z"/>
      </svg>
    ),
    spanish: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#aa151b" d="M0 0h640v480H0z"/>
        <path fill="#f1bf00" d="M0 120h640v240H0z"/>
      </svg>
    ),
    french: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#fff" d="M0 0h640v480H0z"/>
        <path fill="#00267f" d="M0 0h213.3v480H0z"/>
        <path fill="#f31830" d="M426.7 0H640v480H426.7z"/>
      </svg>
    ),
    german: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#000" d="M0 0h640v160H0z"/>
        <path fill="#de0000" d="M0 160h640v160H0z"/>
        <path fill="#ffce00" d="M0 320h640v160H0z"/>
      </svg>
    )
  };

  const colors = {
    english: "from-blue-500 to-red-500",
    spanish: "from-red-500 to-yellow-500", 
    french: "from-blue-600 to-red-600",
    german: "from-black to-red-500",
    italian: "from-green-500 to-red-500",
    arabic: "from-green-700 to-white",
  };
  
  const flag = flagSvgs[language?.toLowerCase()];
  const colorGradient = colors[language?.toLowerCase()] || "from-gray-500 to-gray-600";
  const letter = language?.charAt(0)?.toUpperCase() || "?";
  
  return (
    <span className="inline-flex items-center justify-center">
      {flag ? (
        <span className="inline-flex items-center justify-center">
          {flag}
        </span>
      ) : (
        <span 
          className={`inline-flex items-center justify-center w-6 h-4 rounded-sm bg-gradient-to-br ${colorGradient} text-white text-xs font-bold shadow-sm border border-white/20`}
          title={`${language} language`}
        >
          {letter}
        </span>
      )}
    </span>
  );
};

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all, requests, connections

  const { data: friendRequestsData, isLoading, error } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching friend requests...');
        const result = await getFriendRequests();
        console.log('✅ Friend requests result:', result);
        return result;
      } catch (error) {
        console.error('❌ Friend requests error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
      }
    },
    retry: 1, // Only retry once
    retryDelay: 1000,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: declineRequestMutation, isPending: isDeclining } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      toast.success("All notifications marked as read");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to mark notifications as read");
    }
  });

  const handleProfileClick = (userId) => {
    // For now, we'll show a toast with the user ID since there's no dedicated profile page
    console.log("Navigate to profile:", userId);
    toast.success("Profile feature coming soon! Click will open user profile.");
  };

  const incomingRequests = friendRequestsData?.data?.incoming || [];
  const acceptedRequests = friendRequestsData?.data?.accepted || [];
  const notifications = friendRequestsData?.data?.notifications || [];

  const totalNotifications = incomingRequests.length + acceptedRequests.length + notifications.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <BellIcon className="h-8 w-8 text-primary" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-error text-error-content text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalNotifications > 9 ? '9+' : totalNotifications}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-base-content/70">Stay updated with your language learning journey</p>
              </div>
            </div>

            {/* Filter Options */}
            {totalNotifications > 0 && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300">
                  <li><a onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All Notifications</a></li>
                  <li><a onClick={() => setFilter("requests")} className={filter === "requests" ? "active" : ""}>Friend Requests</a></li>
                  <li><a onClick={() => setFilter("connections")} className={filter === "connections" ? "active" : ""}>New Connections</a></li>
                  <li><a onClick={() => setFilter("activity")} className={filter === "activity" ? "active" : ""}>Activity</a></li>
                </ul>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {totalNotifications > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <div className="stats shadow-sm bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <UserCheckIcon className="h-6 w-6" />
                  </div>
                  <div className="stat-title text-xs">Pending Requests</div>
                  <div className="stat-value text-primary text-2xl">{incomingRequests.length}</div>
                </div>
              </div>
              
              <div className="stats shadow-sm bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-success">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="stat-title text-xs">New Friends</div>
                  <div className="stat-value text-success text-2xl">{acceptedRequests.length}</div>
                </div>
              </div>
              
              <div className="stats shadow-sm bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-info">
                    <BellIcon className="h-6 w-6" />
                  </div>
                  <div className="stat-title text-xs">Activity</div>
                  <div className="stat-value text-info text-2xl">{notifications.length}</div>
                </div>
              </div>
              
              <div className="stats shadow-sm bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-warning">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="stat-title text-xs">Total</div>
                  <div className="stat-value text-warning text-2xl">{totalNotifications}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
            </div>
            <p className="text-base-content/70 mt-4">Loading your notifications...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <div>
              <h3 className="font-bold">Error loading notifications</h3>
              <div className="text-sm">
                <p>Message: {error.message}</p>
                {error.response?.data?.message && (
                  <p>Server: {error.response.data.message}</p>
                )}
                <p>Status: {error.response?.status || 'Unknown'}</p>
                <button 
                  className="btn btn-sm btn-outline mt-2"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-8">
            {/* Friend Requests Section */}
            {incomingRequests.length > 0 && (filter === "all" || filter === "requests") && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <UserCheckIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Friend Requests</h2>
                      <p className="text-sm text-base-content/70">People who want to connect with you</p>
                    </div>
                    <div className="badge badge-primary badge-lg font-bold">
                      {incomingRequests.length}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {incomingRequests.map((request, index) => (
                    <div
                      key={request._id}
                      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/30"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="card-body p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              className="relative cursor-pointer hover:scale-105 transition-transform tooltip tooltip-top"
                              data-tip="Click to view profile"
                              onClick={() => handleProfileClick(request.sender._id)}
                            >
                              <div className="avatar">
                                <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 hover:ring-primary-focus">
                                  <img 
                                    src={request.sender.profilePic} 
                                    alt={request.sender.fullName}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                              <div className="absolute bottom-0 right-0 w-5 h-5 bg-success rounded-full border-2 border-base-100"></div>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 
                                className="font-bold text-lg cursor-pointer hover:text-primary transition-colors tooltip tooltip-top"
                                data-tip="Click to view profile"
                                onClick={() => handleProfileClick(request.sender._id)}
                              >
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <div className="badge badge-secondary gap-1">
                                  <span className="w-2 h-2 rounded-full bg-secondary-content"></span>
                                  <LanguageFlag language={request.sender.nativeLanguage} />
                                  <span className="ml-1">Native: {getFormattedLanguage(request.sender.nativeLanguage).name}</span>
                                </div>
                                <div className="badge badge-outline gap-1">
                                  <span className="w-2 h-2 rounded-full bg-base-content/50"></span>
                                  <LanguageFlag language={request.sender.learningLanguage} />
                                  <span className="ml-1">Learning: {getFormattedLanguage(request.sender.learningLanguage).name}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-base-content/60">
                                <Clock className="h-3 w-3" />
                                <span>Recently</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              className="btn btn-primary btn-sm gap-2 hover:btn-primary-focus"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={isPending || isDeclining}
                            >
                              {isPending ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                              Accept
                            </button>
                            <button 
                              className="btn btn-error btn-outline btn-sm gap-2 hover:btn-error"
                              onClick={() => declineRequestMutation(request._id)}
                              disabled={isPending || isDeclining}
                            >
                              {isDeclining ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* New Connections Section */}
            {acceptedRequests.length > 0 && (filter === "all" || filter === "connections") && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Heart className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">New Connections</h2>
                    <p className="text-sm text-base-content/70">Friends who accepted your requests</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {acceptedRequests.map((notification, index) => (
                    <div 
                      key={notification._id} 
                      className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300 border border-base-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="card-body p-5">
                        <div className="flex items-center gap-4">                            <div 
                              className="relative cursor-pointer hover:scale-105 transition-transform tooltip tooltip-top"
                              data-tip="Click to view profile"
                              onClick={() => handleProfileClick(notification.recipient._id)}
                            >
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full ring ring-success ring-offset-base-100 ring-offset-2 hover:ring-success-focus">
                                <img
                                  src={notification.recipient.profilePic}
                                  alt={notification.recipient.fullName}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
                              <CheckCircle2 className="h-2 w-2 text-success-content" />
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <h3 
                              className="font-semibold text-base cursor-pointer hover:text-success transition-colors tooltip tooltip-top"
                              data-tip="Click to view profile"
                              onClick={() => handleProfileClick(notification.recipient._id)}
                            >
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-sm text-base-content/80">
                              {notification.recipient.fullName} accepted your friend request
                            </p>
                            <div className="flex items-center gap-1 text-xs text-base-content/60">
                              <ClockIcon className="h-3 w-3" />
                              <span>Recently</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="badge badge-success gap-1">
                              <Heart className="h-3 w-3" />
                              Connected
                            </div>
                            <button 
                              className="btn btn-ghost btn-sm"
                              onClick={() => navigate(`/chat/${notification.recipient._id}`)}
                            >
                              <MessageSquareIcon className="h-4 w-4" />
                              Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Activity Notifications Section */}
            {notifications.length > 0 && (filter === "all" || filter === "activity") && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-info/10">
                      <BellIcon className="h-6 w-6 text-info" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Recent Activity</h2>
                      <p className="text-sm text-base-content/70">Likes, comments, and interactions on your posts</p>
                    </div>
                    <div className="badge badge-info badge-lg font-bold">
                      {notifications.length}
                    </div>
                  </div>
                  
                  {/* Mark all as read button */}
                  {notifications.some(n => !n.isRead) && (
                    <button 
                      className="btn btn-ghost btn-sm gap-2"
                      onClick={() => markAllAsReadMutation.mutate()}
                      disabled={markAllAsReadMutation.isPending}
                    >
                      {markAllAsReadMutation.isPending ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <CheckCheck className="h-4 w-4" />
                      )}
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <NotificationCard 
                      key={notification._id} 
                      notification={notification}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {((filter === "all" && incomingRequests.length === 0 && acceptedRequests.length === 0 && notifications.length === 0) ||
              (filter === "requests" && incomingRequests.length === 0) ||
              (filter === "connections" && acceptedRequests.length === 0) ||
              (filter === "activity" && notifications.length === 0)) && (
              <NoNotificationsFound />
            )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;