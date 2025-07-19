import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, MessageCircleIcon, HomeIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { getProfilePicture } from "../utils/avatarUtils";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          
          {/* LOGO - LEFT SIDE (Mobile) */}
          <div className="lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <ShipWheelIcon className="size-7 text-primary" />
              <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Jharufy
              </span>
            </Link>
          </div>

          {/* DESKTOP SPACER */}
          <div className="hidden lg:flex flex-1"></div>
          
          {/* USER CONTROLS - RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* Chat Link - redirects to chat page to select a user (Desktop only) */}
            <Link 
              to="/chat" 
              className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center tooltip tooltip-bottom hover:bg-primary/10 transition-all duration-300 ${isChatPage ? 'bg-primary/20' : ''}`} 
              data-tip="Start Chat"
            >
              <MessageCircleIcon className="size-5 text-base-content hover:text-primary transition-colors duration-300" />
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* User Avatar */}
            <Link 
              to="/profile"
              className="avatar tooltip tooltip-bottom" 
              data-tip={authUser?.fullName || "User"}
            >
              <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 flex items-center justify-center hover:ring-primary/80 hover:ring-2 hover:scale-105 transition-all duration-300 cursor-pointer">
                <img 
                  src={getProfilePicture(authUser)} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Link>

            {/* Logout button */}
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center tooltip tooltip-bottom hover:bg-error/10 hover:text-error transition-all duration-300" 
              onClick={logoutMutation}
              data-tip="Logout"
            >
              <LogOutIcon className="size-5 transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;