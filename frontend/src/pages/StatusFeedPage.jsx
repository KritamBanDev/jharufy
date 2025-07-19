import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getStatusFeed } from '../lib/api';
import { Plus, RefreshCw, TrendingUp, Users, Filter, Search, Sparkles } from 'lucide-react';
import StatusCard from '../components/StatusCard';
import CreateStatusModal from '../components/CreateStatusModal';
import useAuthUser from '../hooks/useAuthUser';

const StatusFeedPage = () => {
  const { authUser } = useAuthUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, friends, trending
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['statusFeed', filter],
    queryFn: ({ pageParam = 1 }) => getStatusFeed(pageParam, 10),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const allStatuses = data?.pages?.flatMap(page => page.data) || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header Skeleton */}
            <div className="bg-base-100 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="skeleton w-12 h-12 rounded-full"></div>
                <div className="flex-1">
                  <div className="skeleton h-6 w-48 mb-2"></div>
                  <div className="skeleton h-4 w-32"></div>
                </div>
              </div>
            </div>

            {/* Status Skeletons */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-base-100 rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="skeleton w-12 h-12 rounded-full"></div>
                  <div>
                    <div className="skeleton h-4 w-32 mb-2"></div>
                    <div className="skeleton h-3 w-24"></div>
                  </div>
                </div>
                <div className="skeleton h-20 w-full mb-4"></div>
                <div className="skeleton h-48 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😔</div>
          <h2 className="text-2xl font-bold text-base-content">Oops! Something went wrong</h2>
          <p className="text-base-content/70">{error?.message || 'Failed to load status feed'}</p>
          <button onClick={handleRefresh} className="btn btn-primary gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Header */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-primary rounded-xl shadow-lg">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-base-content">Status Feed</h1>
                  <p className="text-sm sm:text-base text-base-content/70 hidden sm:block">Stay connected with your friends</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className={`btn btn-ghost btn-circle btn-sm sm:btn-md ${refreshing ? 'loading' : ''}`}
                title="Refresh feed"
                disabled={refreshing}
              >
                {!refreshing && <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="tabs tabs-boxed bg-base-100/50 backdrop-blur-sm w-full overflow-x-auto">
              <button 
                onClick={() => setFilter('all')}
                className={`tab gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm ${filter === 'all' ? 'tab-active' : ''}`}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">All Posts</span>
                <span className="sm:hidden">All</span>
              </button>
              <button 
                onClick={() => setFilter('friends')}
                className={`tab gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm ${filter === 'friends' ? 'tab-active' : ''}`}
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Friends Only</span>
                <span className="sm:hidden">Friends</span>
              </button>
              <button 
                onClick={() => setFilter('trending')}
                className={`tab gap-1 sm:gap-2 flex-shrink-0 text-xs sm:text-sm ${filter === 'trending' ? 'tab-active' : ''}`}
              >
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Trending</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Create Status Card */}
          <div className="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg border border-base-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="avatar flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-primary/20">
                  <img 
                    src={authUser?.profilePic} 
                    alt={authUser?.fullName}
                    className="object-cover"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 text-left px-3 sm:px-4 py-2 sm:py-3 bg-base-200 hover:bg-base-300 rounded-full transition-colors text-base-content/70 hover:text-base-content text-sm sm:text-base"
              >
                What's on your mind, {authUser?.fullName?.split(' ')[0]}?
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary btn-circle shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Status Feed */}
          {allStatuses.length === 0 ? (
            <div className="bg-base-100 rounded-2xl shadow-xl p-12 text-center">
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content mb-2">No statuses yet</h3>
                  <p className="text-base-content/70 mb-4">
                    Be the first to share something with your friends!
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Status
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {allStatuses.map((status) => (
                <StatusCard
                  key={status._id}
                  status={status}
                />
              ))}
              
              {/* Load More Button */}
              {hasNextPage && (
                <div className="text-center">
                  <button
                    onClick={fetchNextPage}
                    disabled={isFetchingNextPage}
                    className="btn btn-outline gap-2"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Status Modal */}
      <CreateStatusModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default StatusFeedPage;
