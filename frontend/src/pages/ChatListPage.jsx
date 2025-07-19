import { useQuery } from "@tanstack/react-query";
import { getMyFriends } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { MessageCircleIcon, Search, Users, ChevronRight, BellIcon } from "lucide-react";
import { useState } from "react";
import PageLoader from "../components/PageLoader";

const ChatListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  console.log("🔍 ChatListPage component loaded");

  const { data: friendsData, isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends,
    retry: 2,
  });

  console.log("🔍 ChatListPage Debug:", {
    friendsData,
    isLoading,
    error,
    friendsDataData: friendsData?.data,
    friendsLength: friendsData?.data?.length
  });

  const friends = friendsData?.data || [];
  
  // Filter friends based on search term
  const filteredFriends = friends.filter(friend => 
    friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-error mb-4">
            <MessageCircleIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Unable to load chats</h2>
          <p className="text-base-content/70 mb-4">
            {error.message || "Something went wrong loading your conversations"}
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto max-w-6xl p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageCircleIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-base-content/70">Choose a friend to start messaging</p>
            </div>
          </div>

          {/* Search Bar */}
          {friends.length > 0 && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10 border border-base-300 bg-base-200 focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Friends List */}
        {friends.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircleIcon className="h-16 w-16 mx-auto mb-4 text-base-content/30" />
            <h2 className="text-2xl font-bold mb-2">No conversations yet</h2>
            <p className="text-base-content/70 mb-6">
              Add some friends to start your first conversation!
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/friends')}
            >
              Find Friends to Chat With
            </button>
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-16 w-16 mx-auto mb-4 text-base-content/30" />
            <h2 className="text-xl font-bold mb-2">No conversations found</h2>
            <p className="text-base-content/70">
              Try searching with a different name
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                onClick={() => handleChatClick(friend._id)}
                className="card bg-base-200 hover:bg-base-300 cursor-pointer transition-all duration-200 hover:shadow-md group border border-transparent hover:border-primary/20"
              >
                <div className="card-body p-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={friend.profilePic || "/api/placeholder/48/48"}
                          alt={friend.fullName}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                        {friend.fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span>Available to chat</span>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="btn btn-ghost btn-sm btn-circle group-hover:bg-primary group-hover:text-primary-content transition-colors">
                        <MessageCircleIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="divider">Need more contacts?</div>
          <div className="flex justify-center gap-4">
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/friends')}
            >
              <Users className="h-4 w-4 mr-2" />
              Discover Friends
            </button>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/notifications')}
            >
              <BellIcon className="h-4 w-4 mr-2" />
              Check Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
