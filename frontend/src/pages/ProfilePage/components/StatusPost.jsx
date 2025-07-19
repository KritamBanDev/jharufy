import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MessageSquareIcon, ShareIcon, MoreHorizontalIcon, StarIcon, CalendarIcon, GlobeIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { safeFormatDistanceToNow } from '@/utils/dateUtils';

export const StatusPost = ({ status }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(status.likes?.length || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    // TODO: Implement API call for like/unlike
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // TODO: Implement API call for adding comment
      setNewComment("");
      toast.success("Comment added!");
    }
  };

  return (
    <div className="group bg-gradient-to-br from-base-100 via-base-50 to-base-100 rounded-3xl shadow-xl border border-base-200/50 p-8 hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 backdrop-blur-sm">
      {/* Post Header */}
      <div className="flex items-center gap-6 mb-6">
        <Link to={`/profile/${status.author._id}`} className="relative group">
          <div className="avatar">
            <div className="w-14 h-14 rounded-2xl ring-3 ring-primary/30 ring-offset-2 ring-offset-base-100 group-hover:ring-primary/50 transition-all duration-300">
              <img 
                src={status.author.profilePic} 
                alt={status.author.fullName} 
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-base-100"></div>
        </Link>
        
        {/* ... Rest of the existing StatusPost code ... */}
      </div>
    </div>
  );
};
