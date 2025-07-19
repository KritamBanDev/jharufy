import { LoaderIcon, ShipWheelIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { getLoaderThemeStyles } from "../utils/themeStyles";

const PageLoader = ({ message = "Loading...", showLogo = true }) => {
  const { theme } = useThemeStore();
  const styles = getLoaderThemeStyles(theme);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-base-100 transition-colors duration-300'>
      {showLogo && (
        <div className="flex items-center gap-3 mb-8">
          <ShipWheelIcon 
            className={`size-12 ${styles.iconColor} ${styles.pulseColor} ${styles.glowEffect} transition-all duration-300`} 
          />
          <span className={`text-4xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r ${styles.bgGradient} tracking-wider ${styles.glowEffect} transition-all duration-300`}>
            Jharufy
          </span>
        </div>
      )}
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <LoaderIcon 
            className={`animate-spin size-10 ${styles.loaderColor} ${styles.glowEffect} transition-all duration-300`} 
          />
          {/* Animated ring effect for enhanced theme visibility */}
          <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current ${styles.loaderColor} opacity-30 animate-spin`} 
               style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
        </div>
        <p className="text-base-content/70 font-medium transition-colors duration-300">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
