import { CalendarIcon, Users, BookOpenIcon } from 'lucide-react';
import { safeFormatDistanceToNow } from '@/utils/dateUtils';

export const QuickStats = ({ user, postsCount }) => {
  return (
    <div className="bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
      <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
        <BookOpenIcon className="size-5 text-primary" />
        Quick Stats
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-base-200/30 rounded-xl">
          <span className="text-base-content/70 flex items-center gap-2">
            <BookOpenIcon className="size-4" />
            Posts
          </span>
          <span className="font-semibold text-base-content">{postsCount}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-base-200/30 rounded-xl">
          <span className="text-base-content/70 flex items-center gap-2">
            <Users className="size-4" />
            Friends
          </span>
          <span className="font-semibold text-base-content">{user.friends?.length || 0}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-base-200/30 rounded-xl">
          <span className="text-base-content/70 flex items-center gap-2">
            <CalendarIcon className="size-4" />
            Joined
          </span>
          <span className="font-semibold text-base-content">
            {safeFormatDistanceToNow(user.createdAt)} ago
          </span>
        </div>
      </div>
    </div>
  );
};
