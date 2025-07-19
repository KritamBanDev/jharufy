import { Link } from "react-router-dom";
import { MapPinIcon, HeartIcon, MessageCircleIcon, StarIcon } from "lucide-react";
import FriendRequestButton from "./FriendRequestButton";

// Utility function to capitalize words
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Language Flag Component with SVG flags for better cross-platform support
const LanguageFlag = ({ language, size = "text-base" }) => {
  // SVG flag icons that work on all systems
  const flagSvgs = {
    english: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <defs><clipPath id="us"><path fill="opacity:.67" d="M-85.3 0h682.6v512H-85.3z"/></clipPath></defs>
        <g fillRule="evenodd" clipPath="url(#us)" transform="scale(.94)">
          <g strokeWidth="1pt"><path fill="#bd3d44" d="M-85.3 0h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6V197H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6V512H-85.3z"/><path fill="#fff" d="M-85.3 39.4h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3zm0 78.8h682.6v39.4H-85.3z"/></g>
          <path fill="#192f5d" d="M-85.3 0h272.1v275.7H-85.3z"/>
        </g>
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
    ),
    spanish: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#aa151b" d="M0 0h640v480H0z"/>
        <path fill="#f1bf00" d="M0 120h640v240H0z"/>
      </svg>
    ),
    chinese: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#de2910" d="M0 0h640v480H0z"/>
        <g fill="#ffde00">
          <path d="M128 85.3l7.5 23.1h24.3l-19.7 14.3 7.5 23.1-19.7-14.3-19.7 14.3 7.5-23.1-19.7-14.3h24.3z"/>
          <path d="M185.6 109.4l2.4 7.3h7.7l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.7z"/>
          <path d="M185.6 146l2.4 7.3h7.7l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.7z"/>
          <path d="M185.6 182.6l2.4 7.3h7.7l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.7z"/>
        </g>
      </svg>
    ),
    mandarin: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#de2910" d="M0 0h640v480H0z"/>
        <g fill="#ffde00">
          <path d="M128 85.3l7.5 23.1h24.3l-19.7 14.3 7.5 23.1-19.7-14.3-19.7 14.3 7.5-23.1-19.7-14.3h24.3z"/>
          <path d="M185.6 109.4l2.4 7.3h7.7l-6.2 4.5 2.4 7.3-6.2-4.5-6.2 4.5 2.4-7.3-6.2-4.5h7.7z"/>
        </g>
      </svg>
    ),
    japanese: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#fff" d="M0 0h640v480H0z"/>
        <circle fill="#bc002d" cx="320" cy="240" r="96"/>
      </svg>
    ),
    korean: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#fff" d="M0 0h640v480H0z"/>
        <g transform="translate(320 240)">
          <circle fill="#c70025" cx="0" cy="-24" r="48"/>
          <circle fill="#003478" cx="0" cy="24" r="48"/>
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
    portuguese: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#046a38" d="M0 0h640v480H0z"/>
        <path fill="#da020e" d="M256 0h384v480H256z"/>
      </svg>
    ),
    russian: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#fff" d="M0 0h640v160H0z"/>
        <path fill="#0052b4" d="M0 160h640v160H0z"/>
        <path fill="#d80027" d="M0 320h640v160H0z"/>
      </svg>
    ),
    hindi: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#f93" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#128807" d="M0 320h640v160H0z"/>
        <circle fill="#008" cx="320" cy="240" r="40"/>
      </svg>
    ),
    arabic: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#006c35" d="M0 0h640v480H0z"/>
        <path fill="#fff" d="M0 0h640v320H0z"/>
        <path fill="#000" d="M0 0h640v160H0z"/>
      </svg>
    ),
    dutch: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm">
        <path fill="#ae1c28" d="M0 0h640v160H0z"/>
        <path fill="#fff" d="M0 160h640v160H0z"/>
        <path fill="#21468b" d="M0 320h640v160H0z"/>
      </svg>
    )
  };

  // Fallback colors for gradient badges
  const colors = {
    english: "from-blue-500 to-red-500",
    spanish: "from-red-500 to-yellow-500", 
    french: "from-blue-600 to-red-600",
    german: "from-black to-red-500",
    italian: "from-green-500 to-red-500",
    portuguese: "from-green-600 to-red-600",
    chinese: "from-red-600 to-yellow-500",
    mandarin: "from-red-600 to-yellow-500",
    japanese: "from-white to-red-500",
    korean: "from-red-500 to-blue-500",
    arabic: "from-green-700 to-white",
    russian: "from-white to-blue-600",
    hindi: "from-orange-500 to-green-600",
    dutch: "from-red-500 to-blue-600",
  };
  
  const flag = flagSvgs[language?.toLowerCase()];
  const colorGradient = colors[language?.toLowerCase()] || "from-gray-500 to-gray-600";
  const letter = language?.charAt(0)?.toUpperCase() || "?";
  
  return (
    <span className={`inline-flex items-center justify-center ${size}`}>
      {flag ? (
        <span className="inline-flex items-center justify-center">
          {flag}
        </span>
      ) : (
        <span 
          className={`inline-flex items-center justify-center w-6 h-4 rounded-sm bg-gradient-to-br ${colorGradient} text-white text-xs font-bold shadow-sm border border-white/20`}
          title={`${capitalize(language)} language`}
        >
          {letter}
        </span>
      )}
    </span>
  );
};

// Enhanced Friend Card Component with perfect spacing and no overlap
const FriendCard = ({ friend }) => (
  <div className="group relative card bg-gradient-to-br from-base-100 via-base-50 to-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-200 hover:border-primary/40 hover:-translate-y-2 overflow-hidden rounded-2xl w-full h-fit">
    {/* Subtle background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
    
    {/* Animated border glow effect */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
    
    <div className="card-body p-6 relative z-10 flex flex-col h-full">
      {/* Header with enhanced avatar and info - allow full name to wrap */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative shrink-0">
          <div className="avatar">
            <div className="w-16 h-16 rounded-2xl ring-4 ring-primary/30 ring-offset-2 ring-offset-base-100 transition-all duration-500 group-hover:ring-primary group-hover:ring-offset-1 group-hover:scale-105 shadow-lg">
              <img src={friend.profilePic} alt={friend.fullName} className="object-cover w-full h-full" />
            </div>
          </div>
          {/* Enhanced online indicator with perfect sizing */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-base-100 shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          {/* Additional pulse ring - Perfect size */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500/40 rounded-full animate-ping"></div>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <Link 
            to={`/profile/${friend._id}`}
            className="block"
          >
            <h3 className="font-bold text-lg break-words text-base-content group-hover:text-primary transition-colors duration-300 leading-tight hover:underline">
              {friend.fullName}
            </h3>
          </Link>
          
          {friend.location && (
            <div className="flex items-center text-sm text-base-content/70 group-hover:text-base-content transition-colors">
              <MapPinIcon className="size-4 mr-2 text-primary flex-shrink-0" />
              <span className="truncate font-medium">{friend.location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </div>
            <div className="badge badge-ghost badge-sm gap-1 font-medium px-2 py-1">
              <HeartIcon className="size-3 text-red-400" />
              Buddy
            </div>
          </div>
        </div>
      </div>
      
      {/* Language badges - Stacked vertically with proper spacing */}
      <div className="space-y-3 mb-6 flex-grow">
        {/* Native language - Full width design */}
        <div className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300 min-h-[64px]">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
            <LanguageFlag language={friend.nativeLanguage} size="text-base" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Native Speaker</p>
            <p className="font-bold text-base-content text-sm leading-tight">{capitalize(friend.nativeLanguage)}</p>
          </div>
        </div>
        
        {/* Learning language - Full width design */}
        <div className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 group-hover:from-secondary/15 group-hover:to-secondary/10 transition-all duration-300 min-h-[64px]">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
            <LanguageFlag language={friend.learningLanguage} size="text-base" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Currently Learning</p>
            <p className="font-bold text-base-content text-sm leading-tight">{capitalize(friend.learningLanguage)}</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced action button with perfect sizing - Always at bottom */}
      <div className="card-actions justify-stretch mt-auto">
        <Link 
          to={`/chat/${friend._id}`} 
          className="btn btn-primary w-full gap-3 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:btn-secondary font-semibold h-12 min-h-12"
        >
          <MessageCircleIcon className="size-5" />
          Start Chat
        </Link>
      </div>
      
      {/* Subtle decorative element - Perfect positioning */}
      <div className="absolute top-6 right-6 w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-180"></div>
    </div>
  </div>
);

// Enhanced New Learner Card Component - Same styling as FriendCard
const NewLearnerCard = ({ user }) => (
  <div className="group relative card bg-gradient-to-br from-base-100 via-base-50 to-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-200 hover:border-primary/40 hover:-translate-y-2 overflow-hidden rounded-2xl w-full h-fit">
    {/* Subtle background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
    
    {/* Animated border glow effect */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
    
    <div className="card-body p-6 relative z-10 flex flex-col h-full">
      {/* Header with enhanced avatar and info - allow full name to wrap */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative shrink-0">
          <div className="avatar">
            <div className="w-16 h-16 rounded-2xl ring-4 ring-primary/30 ring-offset-2 ring-offset-base-100 transition-all duration-500 group-hover:ring-primary group-hover:ring-offset-1 group-hover:scale-105 shadow-lg">
              <img src={user.profilePic} alt={user.fullName} className="object-cover w-full h-full" />
            </div>
          </div>
          {/* Enhanced online indicator with perfect sizing */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-base-100 shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          {/* Additional pulse ring - Perfect size */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500/40 rounded-full animate-ping"></div>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <Link 
            to={`/profile/${user._id}`}
            className="block"
          >
            <h3 className="font-bold text-lg break-words text-base-content group-hover:text-primary transition-colors duration-300 leading-tight hover:underline">
              {user.fullName}
            </h3>
          </Link>
          
          {user.location && (
            <div className="flex items-center text-sm text-base-content/70 group-hover:text-base-content transition-colors">
              <MapPinIcon className="size-4 mr-2 text-primary flex-shrink-0" />
              <span className="truncate font-medium">{user.location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </div>
            <div className="badge badge-ghost badge-sm gap-1 font-medium px-2 py-1">
              <StarIcon className="size-3 text-accent" />
              New
            </div>
          </div>
        </div>
      </div>
      
      {/* Language badges - Stacked vertically with proper spacing */}
      <div className="space-y-3 mb-6 flex-grow">
        {/* Native language - Full width design */}
        <div className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 group-hover:from-primary/15 group-hover:to-primary/10 transition-all duration-300 min-h-[64px]">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
            <LanguageFlag language={user.nativeLanguage} size="text-base" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Native Speaker</p>
            <p className="font-bold text-base-content text-sm leading-tight">{capitalize(user.nativeLanguage)}</p>
          </div>
        </div>
        
        {/* Learning language - Full width design */}
        <div className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 group-hover:from-secondary/15 group-hover:to-secondary/10 transition-all duration-300 min-h-[64px]">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
            <LanguageFlag language={user.learningLanguage} size="text-base" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">Currently Learning</p>
            <p className="font-bold text-base-content text-sm leading-tight">{capitalize(user.learningLanguage)}</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced bio section */}
      {user.bio && (
        <div className="bg-gradient-to-r from-base-200/50 to-base-200/30 p-4 rounded-xl border border-base-300/50 mb-6 backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <div className="w-1 h-12 bg-gradient-to-b from-primary to-secondary rounded-full shrink-0 mt-1"></div>
            <p className="text-sm text-base-content/80 leading-relaxed italic font-medium line-clamp-3">
              "{user.bio}"
            </p>
          </div>
        </div>
      )}
      
      {/* Enhanced action button with perfect sizing - Always at bottom */}
      <div className="card-actions justify-stretch mt-auto">
        <FriendRequestButton 
          userId={user._id} 
          className="btn btn-primary w-full gap-3 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:btn-secondary font-semibold h-12 min-h-12"
        />
      </div>
      
      {/* Subtle decorative element - Perfect positioning */}
      <div className="absolute top-6 right-6 w-6 h-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-180"></div>
    </div>
  </div>
);

export default FriendCard;
export { LanguageFlag, NewLearnerCard };
