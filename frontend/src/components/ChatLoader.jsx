import { LoaderIcon, MessageCircle, Users, ShipWheelIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { getLoaderThemeStyles } from "../utils/themeStyles";

function ChatLoader({ message = "Connecting to chat..." }) {
  const { theme } = useThemeStore();
  const styles = getLoaderThemeStyles(theme);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-100 transition-colors duration-300 p-4">
      {/* Chat-specific branding */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <ShipWheelIcon 
            className={`size-10 ${styles.iconColor} ${styles.pulseColor} ${styles.glowEffect} transition-all duration-300`} 
          />
          <MessageCircle 
            className={`size-6 ${styles.loaderColor} ${styles.glowEffect} transition-all duration-300`}
          />
        </div>
        <span className={`text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r ${styles.bgGradient} tracking-wider ${styles.glowEffect} transition-all duration-300`}>
          Chat
        </span>
      </div>

      {/* Loading animation with chat theme */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Main spinner */}
          <LoaderIcon 
            className={`animate-spin size-12 ${styles.loaderColor} ${styles.glowEffect} transition-all duration-300`} 
          />
          {/* Animated ring effect */}
          <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current ${styles.loaderColor} opacity-30 animate-spin`} 
               style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
          
          {/* Floating chat bubbles animation */}
          <div className="absolute -top-8 -left-8">
            <div className={`w-3 h-3 ${styles.secondaryColor} rounded-full ${styles.pulseColor} opacity-60`} 
                 style={{animationDelay: '0s'}}></div>
          </div>
          <div className="absolute -top-6 -right-10">
            <div className={`w-2 h-2 ${styles.loaderColor} rounded-full ${styles.pulseColor} opacity-40`} 
                 style={{animationDelay: '0.5s'}}></div>
          </div>
          <div className="absolute -bottom-8 -right-6">
            <div className={`w-4 h-4 ${styles.iconColor} rounded-full ${styles.pulseColor} opacity-50`} 
                 style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Status message */}
        <div className="text-center space-y-2">
          <p className={`text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r ${styles.bgGradient} transition-all duration-300`}>
            {message}
          </p>
          <p className="text-base-content/60 text-sm transition-colors duration-300">
            Preparing your conversation space...
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Users className={`size-4 ${styles.iconColor} ${styles.pulseColor}`} style={{animationDelay: '0s'}} />
            <span className="text-xs text-base-content/60">Connecting</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className={`size-4 ${styles.loaderColor} ${styles.pulseColor}`} style={{animationDelay: '0.3s'}} />
            <span className="text-xs text-base-content/60">Initializing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`size-4 rounded-full ${styles.secondaryColor} ${styles.pulseColor}`} style={{animationDelay: '0.6s'}}></div>
            <span className="text-xs text-base-content/60">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLoader;