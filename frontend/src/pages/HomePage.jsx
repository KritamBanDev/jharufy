import { useQuery } from "@tanstack/react-query";
import {
  getRecommendedUsers,
  getUserFriends,
} from "../lib/api";
import { Link } from "react-router-dom";
import { 
  CheckCircleIcon, 
  MapPinIcon, 
  UserPlusIcon, 
  UsersIcon, 
  MessageCircleIcon,
  SparklesIcon,
  GlobeIcon,
  TrendingUpIcon,
  HeartIcon,
  StarIcon
} from "lucide-react";
import FriendRequestButton from "../components/FriendRequestButton";
import FriendCard, { LanguageFlag, NewLearnerCard } from "../components/FriendCard";
import useAuthUser from "../hooks/useAuthUser";

// Utility function to capitalize words
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Enhanced No Friends Component with engaging design
const NoFriendsFound = () => (
  <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all duration-300">
    <div className="card-body p-12 text-center">
      <div className="space-y-6">
        {/* Animated icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-20 animate-pulse"></div>
          <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary text-white rounded-full shadow-xl">
            <UsersIcon className="size-12" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <SparklesIcon className="size-4 text-yellow-800" />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-4">
          <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Start Your Language Journey
          </h3>
          <p className="text-base-content/70 text-lg max-w-md mx-auto leading-relaxed">
            Connect with amazing language partners from around the world and accelerate your learning
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="badge badge-primary gap-2 px-4 py-3">
              <GlobeIcon className="size-4" />
              <span className="font-medium">Global Community</span>
            </div>
            <div className="badge badge-secondary gap-2 px-4 py-3">
              <TrendingUpIcon className="size-4" />
              <span className="font-medium">Fast Progress</span>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-8">
            <div className="badge badge-outline badge-lg gap-2 px-6 py-4 animate-pulse">
              <span>👇</span>
              <span className="font-semibold">Send friend requests below</span>
              <span>👇</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const { authUser } = useAuthUser();
  
  const { data: friends = [], isLoading: loadingFriends, error: friendsError } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers, error: usersError } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Ensure data is always an array
  const safeFriends = Array.isArray(friends) ? friends : [];
  const safeRecommendedUsers = Array.isArray(recommendedUsers) ? recommendedUsers : [];

  // Show error states
  if (friendsError) {
    console.error("Friends loading error:", friendsError);
  }
  
  if (usersError) {
    console.error("Users loading error:", usersError);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Enhanced Hero Section with Personal Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-12">
          {/* User Welcome Section */}
          {authUser && (
            <div className="mb-8">
              <div className="flex flex-col items-center gap-8 mb-8">
                {/* User Profile */}
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative avatar">
                      <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl ring-4 ring-white/50 ring-offset-2 ring-offset-transparent shadow-2xl">
                        <img src={authUser.profilePic} alt={authUser.fullName} className="object-cover w-full h-full" />
                      </div>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="space-y-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                        Welcome back, {authUser.fullName}! 👋
                      </h2>
                      <p className="text-white/80 text-lg">
                        Ready to continue your language journey?
                      </p>
                    </div>
                    
                    {authUser.bio && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-white/90 italic text-sm leading-relaxed">
                          "{authUser.bio}"
                        </p>
                      </div>
                    )}
                    
                    {/* Language badges */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      {authUser.nativeLanguage && (
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                          <div className="flex items-center gap-2">
                            <LanguageFlag language={authUser.nativeLanguage} size="text-sm" />
                            <span className="text-white font-medium text-sm">Native: {capitalize(authUser.nativeLanguage)}</span>
                          </div>
                        </div>
                      )}
                      {authUser.learningLanguage && (
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                          <div className="flex items-center gap-2">
                            <LanguageFlag language={authUser.learningLanguage} size="text-sm" />
                            <span className="text-white font-medium text-sm">Learning: {capitalize(authUser.learningLanguage)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 text-white">
                <SparklesIcon className="size-6 animate-pulse" />
                <span className="text-lg font-medium">
                  {authUser ? "Continue building your language community below" : "Join thousands of language learners worldwide"}
                </span>
                <SparklesIcon className="size-6 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-12">
          
          {/* Friends Section with enhanced styling */}
          <section className="space-y-8">
            {/* Section header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10"></div>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 bg-base-100 rounded-2xl shadow-xl border border-base-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                      <UsersIcon className="size-6 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Your Language Partners
                    </h2>
                  </div>
                  <p className="text-base-content/70 text-lg">
                    Your trusted community of language exchange partners
                  </p>
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>{safeFriends.length} active connections</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link 
                    to="/notifications" 
                    className="btn btn-outline gap-2 hover:btn-primary transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <UsersIcon className="size-5" />
                    Friend Requests
                    <div className="badge badge-primary badge-sm">2</div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Friends content */}
            {loadingFriends ? (
              <div className="flex justify-center py-16">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-secondary border-b-transparent rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-base-content">Loading your language partners...</p>
                    <p className="text-sm text-base-content/60">Building your learning community</p>
                  </div>
                </div>
              </div>
            ) : safeFriends.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                {safeFriends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )}
          </section>

          {/* Enhanced Divider */}
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-full shadow-xl">
                <SparklesIcon className="size-5 text-white animate-pulse" />
                <span className="text-white font-bold text-lg">Discover Amazing Partners</span>
                <SparklesIcon className="size-5 text-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Recommended Users Section with premium design */}
          <section className="space-y-8">
            {/* Section header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20 blur-3xl -z-10"></div>
              <div className="p-6 bg-base-100 rounded-2xl shadow-xl border border-base-300">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-secondary to-accent rounded-xl shadow-lg">
                        <GlobeIcon className="size-6 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                        Meet New Learners
                      </h2>
                    </div>
                    <p className="text-base-content/70 text-lg">
                      Discover perfect language exchange partners tailored to your learning goals
                    </p>
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                      <StarIcon className="size-4 text-yellow-500 fill-current" />
                      <span>Personalized recommendations</span>
                    </div>
                  </div>
                  <div className="stats bg-gradient-to-br from-secondary/10 to-accent/10 shadow-lg">
                    <div className="stat place-items-center">
                      <div className="stat-title">Available</div>
                      <div className="stat-value text-secondary">{safeRecommendedUsers.length}</div>
                      <div className="stat-desc">New partners</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended users content */}
            {loadingUsers ? (
              <div className="flex justify-center py-16">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 w-16 h-16 border-4 border-accent border-b-transparent rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                    <div className="absolute inset-4 w-12 h-12 border-4 border-primary border-l-transparent rounded-full animate-spin" style={{animationDuration: '1s'}}></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-base-content">Finding perfect language partners...</p>
                    <p className="text-sm text-base-content/60">Matching you with amazing learners worldwide</p>
                  </div>
                </div>
              </div>
            ) : safeRecommendedUsers.length === 0 ? (
              <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-300 shadow-xl">
                <div className="card-body p-12 text-center">
                  <div className="space-y-6">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
                      <UserPlusIcon className="size-12 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        No recommendations available
                      </h3>
                      <p className="text-base-content/70 text-lg">
                        Check back later for new language partners!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 auto-rows-fr">
                {safeRecommendedUsers.map((user) => (
                  <NewLearnerCard key={user._id} user={user} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
