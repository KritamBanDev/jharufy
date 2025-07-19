import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpenIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { PageLoader } from '@/components';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileTabs } from './components/ProfileTabs';
import { StatusPost } from './components/StatusPost';
import { LanguageInfo } from './components/LanguageInfo';
import { QuickStats } from './components/QuickStats';

import { useAuthStore } from '@/store/authStore';
import { getUserProfile, getStatusesByUser } from '@/lib/api';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');

  // Determine if this is the current user's profile
  const isOwnProfile = !userId || userId === currentUser?._id;
  const profileUserId = userId || currentUser?._id;

  // Scroll to top on tab change or profile change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, profileUserId]);

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
                <StatusPost key={post._id} status={post} />
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
          </div>
        );

      case 'friends':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: Implement friends list */}
            <p className="text-center col-span-full text-base-content/70">
              Friends list coming soon!
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200/30 via-base-100 to-base-200/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <ProfileHeader 
          user={user} 
          isOwnProfile={isOwnProfile}
          onEditProfile={handleEditProfile}
        />

        <ProfileTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          user={user}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>

          <div className="space-y-6">
            <QuickStats user={user} postsCount={posts.length} />
            <LanguageInfo user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
