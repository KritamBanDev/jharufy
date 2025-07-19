import { Link, useLocation } from "react-router-dom";
import { BellIcon, HomeIcon, UsersIcon, UserIcon, MessageCircleIcon, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Get notification count
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const incomingRequests = friendRequests?.data?.incoming || [];
  const acceptedRequests = friendRequests?.data?.accepted || [];
  const totalNotifications = incomingRequests.length + acceptedRequests.length;

  // Only show on mobile
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 z-40">
      <div className="flex justify-around items-center px-2 py-2">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            currentPath === "/" 
              ? "text-primary bg-primary/10" 
              : "text-base-content/70 hover:text-primary hover:bg-primary/5"
          }`}
        >
          <HomeIcon className="size-5 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </Link>

        {/* Friends */}
        <Link
          to="/friends"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            currentPath === "/friends" 
              ? "text-primary bg-primary/10" 
              : "text-base-content/70 hover:text-primary hover:bg-primary/5"
          }`}
        >
          <UsersIcon className="size-5 mb-1" />
          <span className="text-xs font-medium">Friends</span>
        </Link>

        {/* Status */}
        <Link
          to="/status"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            currentPath === "/status" 
              ? "text-primary bg-primary/10" 
              : "text-base-content/70 hover:text-primary hover:bg-primary/5"
          }`}
        >
          <TrendingUp className="size-5 mb-1" />
          <span className="text-xs font-medium">Status</span>
        </Link>

        {/* Chat */}
        <Link
          to="/chat"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            currentPath.startsWith("/chat") 
              ? "text-primary bg-primary/10" 
              : "text-base-content/70 hover:text-primary hover:bg-primary/5"
          }`}
        >
          <MessageCircleIcon className="size-5 mb-1" />
          <span className="text-xs font-medium">Chat</span>
        </Link>

        {/* Notifications */}
        <Link
          to="/notifications"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 relative ${
            currentPath === "/notifications" 
              ? "text-primary bg-primary/10" 
              : "text-base-content/70 hover:text-primary hover:bg-primary/5"
          }`}
        >
          <div className="relative">
            <BellIcon className="size-5 mb-1" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px] border border-base-100">
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Alerts</span>
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            currentPath.startsWith("/profile") 
              ? "text-primary bg-primary/10" 
              : "text-base-content/70 hover:text-primary hover:bg-primary/5"
          }`}
        >
          <UserIcon className="size-5 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
