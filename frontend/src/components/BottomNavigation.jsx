import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  MessageCircleIcon, 
  UserIcon,
  TrendingUpIcon 
} from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: "/",
      icon: HomeIcon,
      label: "Home",
      isActive: currentPath === "/"
    },
    {
      path: "/friends",
      icon: UsersIcon,
      label: "Friends",
      isActive: currentPath === "/friends"
    },
    {
      path: "/chat",
      icon: MessageCircleIcon,
      label: "Chats", 
      isActive: currentPath.startsWith("/chat")
    },
    {
      path: "/status",
      icon: TrendingUpIcon,
      label: "Status",
      isActive: currentPath === "/status"
    },
    {
      path: "/profile",
      icon: UserIcon,
      label: "Profile",
      isActive: currentPath.startsWith("/profile")
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-300 ${
                item.isActive
                  ? "text-primary bg-primary/10"
                  : "text-base-content/70 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <Icon className="size-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
