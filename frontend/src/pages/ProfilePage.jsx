import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPinIcon, 
  CalendarIcon, 
  Users,
  MessageCircleIcon,
  SettingsIcon,
  CameraIcon,
  EditIcon,
  HeartIcon,
  MessageSquareIcon,
  ShareIcon,
  MoreHorizontalIcon,
  GlobeIcon,
  BookOpenIcon,
  StarIcon,
  TrendingUpIcon
} from "lucide-react";
import toast from "react-hot-toast";

import { getUserProfile, getStatusesByUser } from "../lib/api";
import useAuthStore from "../store/useAuthStore";
import { LanguageFlag } from "../components/FriendCard";
import PageLoader from "../components/PageLoader";
import StatusCard from "../components/StatusCard";
import { safeFormatDistanceToNow } from "../utils/dateUtils";

// Safe string formatting helpers
const safeCapitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const safeGetFirstLetter = (str) => {
  if (!str || typeof str !== 'string') return '?';
  return str.charAt(0).toUpperCase();
};

// Profile header component with cover and profile picture
const ProfileHeader = ({ user, isOwnProfile, onEditProfile }) => {
  // const [showCoverUpload, setShowCoverUpload] = useState(false);
  // const [showProfileUpload, setShowProfileUpload] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageUpload = async (type) => {
    // Mock function - you can implement actual upload logic
    setImageLoading(true);
    setTimeout(() => {
      setImageLoading(false);
      toast.success(`${type} updated successfully!`);
    }, 2000);
  };

  return (
    <div className="relative bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-2xl sm:rounded-3xl shadow-2xl border border-base-200/50 overflow-hidden mb-4 sm:mb-6 lg:mb-8 backdrop-blur-sm">
      {/* Cover Photo Section with enhanced gradients */}
      <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-primary/30 via-secondary/25 to-accent/30 flex items-center justify-center overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-40">
            <div className="absolute top-4 sm:top-10 left-4 sm:left-10 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-xl sm:blur-3xl animate-pulse"></div>
            <div className="absolute top-8 sm:top-20 right-8 sm:right-20 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-br from-secondary/40 to-transparent rounded-full blur-lg sm:blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-8 sm:bottom-20 left-1/3 w-12 sm:w-24 h-12 sm:h-24 bg-gradient-to-br from-accent/40 to-transparent rounded-full blur-md sm:blur-xl animate-pulse delay-2000"></div>
          </div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-8 sm:top-16 right-8 sm:right-16 w-4 sm:w-8 h-4 sm:h-8 border-2 border-primary/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-12 sm:bottom-24 left-8 sm:left-20 w-3 sm:w-6 h-3 sm:h-6 bg-secondary/20 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-1/3 left-1/4 w-2 sm:w-4 h-2 sm:h-4 bg-accent/30 transform rotate-45 animate-pulse"></div>
        </div>
        
        {/* Cover upload button for own profile */}
        {isOwnProfile && (
          <div className="absolute top-3 sm:top-6 right-3 sm:right-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={() => handleImageUpload('cover')}
              className="btn btn-circle btn-sm sm:btn-md btn-primary/90 hover:btn-primary shadow-xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-300"
              disabled={imageLoading}
            >
              {imageLoading ? (
                <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
              ) : (
                <CameraIcon className="size-3 sm:size-5" />
              )}
            </button>
            <button 
              onClick={() => handleImageUpload('cover')}
              className="btn btn-primary/90 hover:btn-primary shadow-xl backdrop-blur-sm border border-white/20 gap-2 hover:scale-105 transition-all duration-300 hidden sm:flex text-xs sm:text-sm"
              disabled={imageLoading}
            >
              <CameraIcon className="size-3 sm:size-4" />
              <span className="hidden md:inline">Update Cover</span>
              <span className="md:hidden">Cover</span>
            </button>
          </div>
        )}
        
        {/* Enhanced floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center text-white/10 select-none">
              <div className="text-8xl font-bold opacity-30 animate-pulse">
                {safeGetFirstLetter(user?.fullName)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Section with enhanced styling */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 -mt-12 sm:-mt-16 lg:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 lg:gap-8">
          {/* Enhanced Profile Picture */}
          <div className="relative shrink-0 group mx-auto sm:mx-0">
            <div className="relative">
              <div className="avatar">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full ring-4 sm:ring-6 lg:ring-8 ring-base-100 shadow-2xl bg-base-100 overflow-hidden">
                  <img 
                    src={user.profilePic} 
                    alt={user.fullName}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              
              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl sm:blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
            
            {/* Enhanced online status with perfect positioning */}
            <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2">
              <div className="relative">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-base-100 shadow-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-500/30 rounded-full animate-ping"></div>
              </div>
            </div>
            
            {/* Enhanced profile picture upload for own profile */}
            {isOwnProfile && (
              <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                <button 
                  onClick={() => handleImageUpload('profile')}
                  className="btn btn-circle btn-xs sm:btn-sm bg-black/70 hover:bg-black/90 border-0 shadow-xl hover:scale-110 transition-all duration-300 backdrop-blur-sm text-white"
                  disabled={imageLoading}
                >
                  {imageLoading ? (
                    <span className="loading loading-spinner loading-xs text-white"></span>
                  ) : (
                    <CameraIcon className="size-3 sm:size-4 text-white" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Enhanced User Info */}
          <div className="flex-1 space-y-4 sm:space-y-6 text-center sm:text-left">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-base-content mb-2 sm:mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {user.fullName}
                  </h1>
                  
                  {/* Enhanced status badges */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                    <div className="badge badge-success gap-1 sm:gap-2 p-2 sm:p-3 shadow-lg text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                      Online Now
                    </div>
                    <div className="badge badge-primary gap-1 sm:gap-2 p-2 sm:p-3 shadow-lg text-xs sm:text-sm">
                      <HeartIcon className="size-2 sm:size-3" />
                      Language Buddy
                    </div>
                    {isOwnProfile && (
                      <div className="badge badge-secondary gap-1 sm:gap-2 p-2 sm:p-3 shadow-lg text-xs sm:text-sm">
                        <StarIcon className="size-2 sm:size-3" />
                        Your Profile
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced info cards */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-base-content/80">
                  {user.location && (
                    <div className="flex items-center gap-2 sm:gap-3 bg-base-200/50 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-sm border border-base-300/30">
                      <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg">
                        <MapPinIcon className="size-3 sm:size-4 text-primary" />
                      </div>
                      <span className="font-medium text-xs sm:text-sm">{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-3 bg-base-200/50 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-sm border border-base-300/30">
                    <div className="p-1.5 sm:p-2 bg-secondary/20 rounded-lg">
                      <CalendarIcon className="size-3 sm:size-4 text-secondary" />
                    </div>
                    <span className="font-medium text-xs sm:text-sm">
                      Joined {safeFormatDistanceToNow(user.createdAt)} ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 bg-base-200/50 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-sm border border-base-300/30">
                    <div className="p-1.5 sm:p-2 bg-accent/20 rounded-lg">
                      <Users className="size-3 sm:size-4 text-accent" />
                    </div>
                    <span className="font-medium text-xs sm:text-sm">{user.friends?.length || 0} friends</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Action buttons with proper spacing */}
              <div className="flex flex-col items-center gap-4 w-full lg:w-auto lg:flex-row lg:items-end lg:justify-end relative">
                {isOwnProfile ? (
                  <>
                    {/* Main action buttons container */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <button 
                        onClick={onEditProfile}
                        className="btn btn-primary gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 border-none text-sm px-4 py-2 whitespace-nowrap"
                      >
                        <EditIcon className="size-4" />
                        <span className="hidden sm:inline">Edit Profile</span>
                        <span className="sm:hidden">Edit</span>
                      </button>
                      <button className="btn btn-outline btn-primary gap-2 hover:scale-105 transition-all duration-300 text-sm px-4 py-2 whitespace-nowrap">
                        <SettingsIcon className="size-4" />
                        <span className="hidden sm:inline">Settings</span>
                        <span className="sm:hidden">Settings</span>
                      </button>
                    </div>
                    {/* More options dropdown - positioned at far right */}
                    <div className="absolute top-0 right-0 lg:relative lg:top-auto lg:right-auto lg:ml-6">
                      <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-circle hover:scale-110 transition-all duration-300 w-10 h-10">
                          <MoreHorizontalIcon className="size-4" />
                        </button>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300 mt-2">
                          <li><a className="gap-3 py-2"><ShareIcon className="size-4" />Share Profile</a></li>
                          <li><a className="gap-3 py-2"><Users className="size-4" />View Mutual Friends</a></li>
                          <li><a className="gap-3 py-2"><StarIcon className="size-4" />Privacy Settings</a></li>
                          <li><a className="gap-3 py-2 text-warning"><MoreHorizontalIcon className="size-4" />More Options</a></li>
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest view action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <Link 
                        to={`/chat/${user._id}`}
                        className="btn btn-primary gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 border-none text-sm px-4 py-2 whitespace-nowrap"
                      >
                        <MessageCircleIcon className="size-4" />
                        <span className="hidden sm:inline">Send Message</span>
                        <span className="sm:hidden">Message</span>
                      </Link>
                      <button className="btn btn-outline btn-primary gap-2 hover:scale-105 transition-all duration-300 text-sm px-4 py-2 whitespace-nowrap">
                        <Users className="size-4" />
                        <span className="hidden sm:inline">Add Friend</span>
                        <span className="sm:hidden">Add</span>
                      </button>
                      <button className="btn btn-outline btn-secondary gap-2 hover:scale-105 transition-all duration-300 text-sm px-4 py-2 whitespace-nowrap">
                        <HeartIcon className="size-4" />
                        <span className="hidden sm:inline">Follow</span>
                        <span className="sm:hidden">Follow</span>
                      </button>
                    </div>
                    {/* More options dropdown for guest view - positioned at far right */}
                    <div className="absolute top-0 right-0 lg:relative lg:top-auto lg:right-auto lg:ml-6">
                      <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-circle hover:scale-110 transition-all duration-300 w-10 h-10">
                          <MoreHorizontalIcon className="size-4" />
                        </button>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300 mt-2">
                          <li><a className="gap-3 py-2"><ShareIcon className="size-4" />Share Profile</a></li>
                          <li><a className="gap-3 py-2"><Users className="size-4" />View Mutual Friends</a></li>
                          <li><a className="gap-3 py-2 text-warning"><StarIcon className="size-4" />Block User</a></li>
                          <li><a className="gap-3 py-2 text-error"><MoreHorizontalIcon className="size-4" />Report</a></li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Enhanced Bio with better typography */}
            {user.bio && (
              <div className="bg-gradient-to-r from-base-200/70 to-base-200/40 p-6 rounded-2xl border border-base-300/50 backdrop-blur-sm shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-16 bg-gradient-to-b from-primary via-secondary to-accent rounded-full shrink-0 mt-2"></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                      <BookOpenIcon className="size-4" />
                      About Me
                    </h3>
                    <blockquote className="text-lg text-base-content/90 leading-relaxed font-medium italic relative">
                      <span className="text-4xl text-primary/30 absolute -top-2 -left-2">"</span>
                      <span className="relative z-10">{user.bio}</span>
                      <span className="text-4xl text-primary/30 absolute -bottom-4 -right-2">"</span>
                    </blockquote>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Language info component
const LanguageInfo = ({ user }) => {
  return (
    <div className="bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-2xl shadow-xl border border-base-200/50 p-4 sm:p-6 backdrop-blur-sm">
      <h3 className="text-lg sm:text-xl font-bold text-base-content mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
          <GlobeIcon className="size-5 sm:size-6 text-primary" />
        </div>
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-base sm:text-lg">
          Languages
        </span>
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Compact Native Language */}
        {user.nativeLanguage && (
          <div className="group relative overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
              <div className="relative shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                  <LanguageFlag language={user.nativeLanguage} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <StarIcon className="size-2 sm:size-2.5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide">
                    Native
                  </p>
                  <div className="badge badge-primary badge-xs">Fluent</div>
                </div>
                <p className="text-sm sm:text-base font-bold text-base-content truncate">
                  {safeCapitalize(user?.nativeLanguage)}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  Teaching others
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compact Learning Language */}
        {user.learningLanguage && (
          <div className="group relative overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20 hover:border-secondary/30 transition-all duration-300 hover:shadow-md">
              <div className="relative shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center shadow-md">
                  <LanguageFlag language={user.learningLanguage} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <BookOpenIcon className="size-2 sm:size-2.5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-secondary uppercase tracking-wide">
                    Learning
                  </p>
                  <div className="badge badge-outline badge-secondary badge-xs px-1.5 py-0.5 bg-secondary/10 border-secondary/30 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
                    <span className="text-xs">Active</span>
                  </div>
                </div>
                <p className="text-sm sm:text-base font-bold text-base-content truncate">
                  {safeCapitalize(user?.learningLanguage)}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  Seeking partners
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compact Learning Progress */}
        <div className="bg-gradient-to-r from-accent/8 to-accent/4 p-3 sm:p-4 rounded-xl border border-accent/15">
          <h4 className="text-sm font-bold text-accent mb-2 sm:mb-3 flex items-center gap-2">
            <TrendingUpIcon className="size-4" />
            Progress
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="text-center p-2 sm:p-3 bg-base-200/50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-primary mb-0.5">
                {Math.floor(Math.random() * 100) + 50}
              </div>
              <div className="text-xs text-base-content/60 uppercase tracking-wide">
                Days
              </div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-base-200/50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-secondary mb-0.5">
                {Math.floor(Math.random() * 20) + 5}
              </div>
              <div className="text-xs text-base-content/60 uppercase tracking-wide">
                Sessions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Tabs component
const ProfileTabs = ({ activeTab, onTabChange, user, postsCount = 0 }) => {
  const tabs = [
    { 
      id: 'posts', 
      label: 'Posts', 
      icon: BookOpenIcon,
      count: postsCount,
      description: 'Recent activity'
    },
    { 
      id: 'about', 
      label: 'About', 
      icon: StarIcon,
      description: 'Personal info'
    },
    { 
      id: 'friends', 
      label: 'Friends', 
      icon: Users,
      count: user?.friends?.length || 0,
      description: 'Connections'
    },
  ];

  return (
    <div className="bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-3xl shadow-2xl border border-base-200/50 p-3 mb-10 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group flex-1 flex items-center justify-center gap-4 py-4 px-6 rounded-2xl font-semibold transition-all duration-500 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-2xl scale-105'
                  : 'text-base-content/70 hover:text-base-content hover:bg-base-200/70 hover:scale-105'
              }`}
            >
              {/* Background glow effect */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-50 -z-10"></div>
              )}
              
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white/20 shadow-lg' 
                  : 'bg-base-200/50 group-hover:bg-base-300/50 group-hover:scale-110'
              }`}>
                <Icon className="size-6" />
              </div>
              
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tab.label}</span>
                  {tab.count !== undefined && (
                    <div className={`badge badge-sm font-bold ${
                      isActive 
                        ? 'badge-accent text-accent-content' 
                        : 'badge-primary'
                    }`}>
                      {tab.count}
                    </div>
                  )}
                </div>
                <span className={`text-xs opacity-80 ${
                  isActive ? 'text-primary-content/80' : 'text-base-content/50'
                }`}>
                  {tab.description}
                </span>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-accent rounded-full shadow-lg"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Main Profile Page Component
const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');
  // const [editMode, setEditMode] = useState(false);

  // Determine if this is the current user's profile
  const isOwnProfile = !userId || userId === currentUser?._id;
  const profileUserId = userId || currentUser?._id;

  // Fetch user profile
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user-profile', profileUserId],
    queryFn: () => getUserProfile(profileUserId),
    enabled: !!profileUserId,
  });

  // Fetch user's posts
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['user-statuses', profileUserId],
    queryFn: () => getStatusesByUser(profileUserId),
    enabled: !!profileUserId && activeTab === 'posts',
  });

  if (userLoading) {
    return <PageLoader />;
  }

  if (userError || !user || !user.fullName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">
            {userError ? "Error loading profile" : "User not found"}
          </h2>
          <p className="text-base-content/70 mb-4">
            {userError?.message || "The requested profile could not be loaded."}
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    // setEditMode(true);
    toast.success("Edit profile feature coming soon!");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="space-y-6">
            {postsLoading ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <StatusCard key={post._id} status={post} />
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-2xl shadow-xl border border-base-200">
                <BookOpenIcon className="size-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                  No posts yet
                </h3>
                <p className="text-base-content/50">
                  {isOwnProfile ? "Share your first post!" : `${user.fullName} hasn't posted anything yet.`}
                </p>
              </div>
            )}
          </div>
        );

      case 'about':
        return (
          <div className="grid grid-cols-1 gap-6">
            <LanguageInfo user={user} />
            
            {/* About Info */}
            <div className="bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
              <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-3">
                <StarIcon className="size-6 text-primary" />
                About {isOwnProfile ? 'Me' : user.fullName}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-xl">
                  <CalendarIcon className="size-5 text-primary" />
                  <div>
                    <p className="font-medium text-base-content">Member since</p>
                    <p className="text-sm text-base-content/70">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                {user.location && (
                  <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-xl">
                    <MapPinIcon className="size-5 text-primary" />
                    <div>
                      <p className="font-medium text-base-content">Location</p>
                      <p className="text-sm text-base-content/70">{user.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-xl">
                  <Users className="size-5 text-primary" />
                  <div>
                    <p className="font-medium text-base-content">Friends</p>
                    <p className="text-sm text-base-content/70">{user.friends?.length || 0} friends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'friends':
        return (
          <div className="bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
            <h3 className="text-xl font-bold text-base-content mb-6 flex items-center gap-3">
              <Users className="size-6 text-primary" />
              Friends ({user.friends?.length || 0})
            </h3>
            
            {user.friends && user.friends.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {user.friends.slice(0, 9).map((friend) => (
                  <Link
                    key={friend._id}
                    to={`/profile/${friend._id}`}
                    className="flex items-center gap-2 sm:gap-3 p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors"
                  >
                    <div className="avatar">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl">
                        <img src={friend.profilePic} alt={friend.fullName} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base-content truncate text-sm sm:text-base">
                        {friend.fullName}
                      </p>
                      <p className="text-xs sm:text-sm text-base-content/60 truncate">
                        {friend.location}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="size-16 text-base-content/30 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-base-content/70 mb-2">
                  No friends yet
                </h4>
                <p className="text-base-content/50">
                  {isOwnProfile ? "Start connecting with other language learners!" : `${user.fullName} hasn't added any friends yet.`}
                </p>
              </div>
            )}
            
            {user.friends && user.friends.length > 9 && (
              <div className="text-center mt-6">
                <button className="btn btn-primary btn-outline">
                  View All Friends
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200/30 via-base-100 to-base-200/30 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Profile Header */}
        <ProfileHeader 
          user={user} 
          isOwnProfile={isOwnProfile}
          onEditProfile={handleEditProfile}
        />

        {/* Enhanced Navigation Tabs */}
        <ProfileTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          user={user}
          postsCount={posts.length}
        />

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            {renderTabContent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 order-1 xl:order-2">
            {/* Language Info */}
            <LanguageInfo user={user} />
            
            {/* Compact Quick Stats */}
            <div className="bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-2xl shadow-xl border border-base-200 p-4">
              <h3 className="text-base font-bold text-base-content mb-3 flex items-center gap-2">
                <div className="w-2 h-4 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-base-content/70">Posts</span>
                  <span className="font-semibold text-sm text-base-content bg-primary/10 px-2 py-1 rounded-lg">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-base-content/70">Friends</span>
                  <span className="font-semibold text-sm text-base-content bg-secondary/10 px-2 py-1 rounded-lg">{user.friends?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-base-content/70">Joined</span>
                  <span className="font-semibold text-xs text-base-content bg-accent/10 px-2 py-1 rounded-lg">
                    {safeFormatDistanceToNow(user.createdAt)} ago
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity or Suggested Connections */}
            <div className="bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-2xl shadow-xl border border-base-200 p-4">
              <h3 className="text-base font-bold text-base-content mb-3 flex items-center gap-2">
                <div className="w-2 h-4 bg-gradient-to-b from-accent to-primary rounded-full"></div>
                {isOwnProfile ? 'Recent Activity' : 'Mutual Friends'}
              </h3>
              <div className="space-y-2">
                {isOwnProfile ? (
                  <div className="text-center py-4">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUpIcon className="size-4 text-accent" />
                    </div>
                    <p className="text-xs text-base-content/60">
                      No recent activity
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="size-4 text-primary" />
                    </div>
                    <p className="text-xs text-base-content/60">
                      No mutual friends
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
