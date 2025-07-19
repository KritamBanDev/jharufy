import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, UserIcon, TrendingUp, MessageCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const Sidebar = () => {
  const { authUser } = useAuthUser();
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

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            Jharufy
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/chat"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath.startsWith("/chat") ? "btn-active" : ""
          }`}
          onClick={() => console.log("Chat link clicked - should go to /chat")}
        >
          <MessageCircleIcon className="size-5 text-base-content opacity-70" />
          <span>Chats</span>
        </Link>

        <Link
          to="/status"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/status" ? "btn-active" : ""
          }`}
        >
          <TrendingUp className="size-5 text-base-content opacity-70" />
          <span>Status</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case relative ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <div className="relative">
            <BellIcon className="size-5 text-base-content opacity-70" />
            {totalNotifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-error text-error-content text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px] border border-base-100">
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </span>
            )}
          </div>
          <span>Notifications</span>
        </Link>

        <Link
          to="/profile"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath.startsWith("/profile") ? "btn-active" : ""
          }`}
        >
          <UserIcon className="size-5 text-base-content opacity-70" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;