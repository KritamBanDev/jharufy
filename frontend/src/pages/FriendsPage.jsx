import { useQuery } from "@tanstack/react-query";
import {
  getRecommendedUsers,
  getUserFriends,
} from "../lib/api";
import { 
  UsersIcon, 
  UserPlusIcon,
  SearchIcon,
  FilterIcon,
  SparklesIcon,
  GlobeIcon,
  TrendingUpIcon,
  HeartIcon,
  SortAscIcon,
  GridIcon,
  ListIcon,
  RefreshCwIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon
} from "lucide-react";
import FriendCard, { NewLearnerCard } from "../components/FriendCard";
import NofriendsFound from "../components/NofriendsFound";
import useAuthUser from "../hooks/useAuthUser";
import { useState, useMemo } from "react";
import { getLoaderThemeStyles } from "../utils/themeStyles";
import { useThemeStore } from "../store/useThemeStore";

const FriendsPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const themeStyles = getLoaderThemeStyles(theme);
  
  // Enhanced state management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // name, language, recent
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Fetch user's friends with refetch capability
  const {
    data: friendsData,
    isLoading: friendsLoading,
    refetch: refetchFriends,
  } = useQuery({
    queryKey: ["userFriends"],
    queryFn: getUserFriends,
    staleTime: 30000, // 30 seconds
  });

  // Fetch recommended users with refetch capability
  const {
    data: recommendedData,
    isLoading: recommendedLoading,
    refetch: refetchRecommended,
  } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
    staleTime: 60000, // 1 minute
  });

  const friends = useMemo(() => friendsData || [], [friendsData]);
  const recommendedUsers = useMemo(() => recommendedData || [], [recommendedData]);

  // Enhanced filtering and sorting with useMemo for performance
  const filteredAndSortedFriends = useMemo(() => {
    let filtered = friends.filter(friend => {
      const matchesSearch = friend.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           friend.nativeLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           friend.learningLanguage.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLanguage = selectedLanguage === "all" || 
                             friend.nativeLanguage.toLowerCase() === selectedLanguage ||
                             friend.learningLanguage.toLowerCase() === selectedLanguage;
      
      const matchesOnlineFilter = !showOnlineOnly || friend.isOnline;
      
      return matchesSearch && matchesLanguage && matchesOnlineFilter;
    });

    // Sort friends
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "language":
          return a.nativeLanguage.localeCompare(b.nativeLanguage);
        case "recent":
          return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
        default:
          return 0;
      }
    });
  }, [friends, searchTerm, selectedLanguage, showOnlineOnly, sortBy]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchFriends(), refetchRecommended()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get unique languages for filter
  const allLanguages = [...new Set([
    ...friends.flatMap(f => [f.nativeLanguage, f.learningLanguage]),
    ...recommendedUsers.flatMap(u => [u.nativeLanguage, u.learningLanguage])
  ])].filter(Boolean);

  if (friendsLoading || recommendedLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="mx-auto">
            <div 
              className="w-16 h-16 rounded-full border-4 border-transparent animate-spin"
              style={{
                background: `conic-gradient(${themeStyles.gradient})`,
              }}
            >
              <div className="w-full h-full bg-base-100 rounded-full scale-75 flex items-center justify-center">
                <UsersIcon className="size-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-base-content">Loading Your Social Network</h3>
            <p className="text-base-content/70">Gathering your friends and recommendations...</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.6s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }
        .animate-slide-up-delay {
          animation: slideUp 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 animate-fade-in">
            <div 
              className="p-3 rounded-xl text-primary-content shadow-lg"
              style={{ background: themeStyles.gradient }}
            >
              <UsersIcon className="size-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Friends
            </h1>
            <div className="badge badge-primary gap-1">
              <CheckCircleIcon className="size-3" />
              {friends.length} Connected
            </div>
          </div>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto animate-fade-in-delay">
            Connect with your language learning partners and discover new friends from around the world
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-base-300 shadow-lg animate-slide-up">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 size-5" />
              <input
                type="text"
                placeholder="Search friends by name or language..."
                className="input w-full pl-10 border border-base-300 bg-base-100 focus:bg-base-50 focus:border-primary transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                >
                  ×
                </button>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Language Filter */}
              <div className="flex items-center gap-2">
                <FilterIcon className="size-4 text-base-content/50" />
                <select
                  className="select border border-base-300 select-sm bg-base-100 min-w-32"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="all">All Languages</option>
                  {allLanguages.map(lang => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <SortAscIcon className="size-4 text-base-content/50" />
                <select
                  className="select border border-base-300 select-sm bg-base-100 min-w-24"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="language">Language</option>
                  <option value="recent">Recent</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="btn-group">
                <button 
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-active' : 'btn-ghost'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <GridIcon className="size-4" />
                </button>
                <button 
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-active' : 'btn-ghost'}`}
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="size-4" />
                </button>
              </div>

              {/* Online Filter */}
              <label className="label cursor-pointer gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm checkbox-primary"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                />
                <span className="label-text text-sm">Online only</span>
              </label>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn btn-sm btn-ghost gap-2 hover:btn-primary"
              >
                <RefreshCwIcon className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-base-300">
            <div className="flex items-center gap-2 text-sm">
              <div className="badge badge-primary badge-sm gap-1">
                <UsersIcon className="size-3" />
                {friends.length}
              </div>
              <span className="text-base-content/70">Total Friends</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="badge badge-secondary badge-sm gap-1">
                <SparklesIcon className="size-3" />
                {recommendedUsers.length}
              </div>
              <span className="text-base-content/70">Suggestions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="badge badge-accent badge-sm gap-1">
                <GlobeIcon className="size-3" />
                {allLanguages.length}
              </div>
              <span className="text-base-content/70">Languages</span>
            </div>
          </div>
        </div>

        {/* Enhanced Friends Section */}
        {friends.length > 0 && (
          <div className="mb-12 animate-slide-up-delay">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <HeartIcon className="size-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-base-content">
                  Your Friends ({filteredAndSortedFriends.length})
                </h2>
                {searchTerm && (
                  <div className="badge badge-outline gap-1">
                    <SearchIcon className="size-3" />
                    "{searchTerm}"
                  </div>
                )}
              </div>
              
              {/* Active Filters Display */}
              <div className="flex items-center gap-2">
                {selectedLanguage !== "all" && (
                  <div className="badge badge-primary gap-1">
                    <FilterIcon className="size-3" />
                    {selectedLanguage}
                    <button onClick={() => setSelectedLanguage("all")}>×</button>
                  </div>
                )}
                {showOnlineOnly && (
                  <div className="badge badge-success gap-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    Online Only
                    <button onClick={() => setShowOnlineOnly(false)}>×</button>
                  </div>
                )}
              </div>
            </div>

            <div className="transition-all duration-300">
              {filteredAndSortedFriends.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredAndSortedFriends.map((friend, index) => (
                    <div
                      key={friend._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <FriendCard friend={friend} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="space-y-4">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${themeStyles.primaryColor}20, ${themeStyles.secondaryColor}20)` }}
                    >
                      <SearchIcon className="size-10 text-base-content/30" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-base-content">No friends match your criteria</h3>
                      <p className="text-base-content/60">Try adjusting your search or filters</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="btn btn-sm btn-ghost"
                      >
                        Clear Search
                      </button>
                      <button 
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedLanguage("all");
                          setShowOnlineOnly(false);
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced No Friends State */}
        {friends.length === 0 && (
          <div className="animate-fade-in">
            <NofriendsFound />
          </div>
        )}

        {/* Enhanced Discover New Friends Section */}
        {recommendedUsers.length > 0 && (
          <div className="mt-16 animate-slide-up-delay">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div 
                  className="p-3 rounded-xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${themeStyles.secondaryColor}, ${themeStyles.accentColor})` }}
                >
                  <GlobeIcon className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-base-content">
                    Discover New Friends
                  </h2>
                  <p className="text-base-content/60">People who share your language interests</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="badge badge-secondary gap-1">
                  <TrendingUpIcon className="size-3" />
                  Recommended for you
                </div>
                <div className="badge badge-outline">
                  <StarIcon className="size-3 mr-1" />
                  {recommendedUsers.length} Available
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedUsers.slice(0, 8).map((user, index) => (
                <div
                  key={user._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.8 + (index * 0.1)}s` }}
                >
                  <NewLearnerCard user={user} />
                </div>
              ))}
            </div>
            
            {recommendedUsers.length > 8 && (
              <div className="text-center mt-8 animate-fade-in-delay">
                <button className="btn btn-outline btn-primary gap-2 hover:btn-primary">
                  <UserPlusIcon className="size-4" />
                  View {recommendedUsers.length - 8} More Recommendations
                </button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Quick Stats Footer */}
        <div 
          className="mt-20 animate-slide-up-delay"
          style={{ 
            background: `linear-gradient(135deg, ${themeStyles.primaryColor}10, ${themeStyles.secondaryColor}10)`,
            borderColor: `${themeStyles.primaryColor}30`
          }}
        >
          <div className="rounded-2xl p-8 border backdrop-blur-sm">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-base-content mb-2">Your Social Network</h3>
              <p className="text-base-content/60">Building connections across languages and cultures</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <div 
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
                  style={{ background: themeStyles.gradient }}
                >
                  <UsersIcon className="size-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{friends.length}</div>
                  <div className="text-sm text-base-content/70">Total Friends</div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div 
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${themeStyles.secondaryColor}, ${themeStyles.accentColor})` }}
                >
                  <GlobeIcon className="size-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{allLanguages.length}</div>
                  <div className="text-sm text-base-content/70">Languages Covered</div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div 
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${themeStyles.accentColor}, ${themeStyles.primaryColor})` }}
                >
                  <SparklesIcon className="size-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{recommendedUsers.length}</div>
                  <div className="text-sm text-base-content/70">New Recommendations</div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <div 
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${themeStyles.primaryColor}, ${themeStyles.secondaryColor})` }}
                >
                  <MapPinIcon className="size-8 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: themeStyles.primaryColor }}>
                    {[...new Set(friends.map(f => f.location))].filter(Boolean).length}
                  </div>
                  <div className="text-sm text-base-content/70">Countries Connected</div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-8 pt-6 border-t border-base-300">
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <span className="text-base-content/70">Ready to expand your network?</span>
                <button 
                  onClick={handleRefresh}
                  className="btn btn-primary gap-2"
                  disabled={isRefreshing}
                >
                  <RefreshCwIcon className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Find More Friends'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
