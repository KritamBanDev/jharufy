import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Edit,
  Trash2,
  ThumbsUp,
  Laugh,
  Eye,
  Frown,
  PlusCircle,
  Copy,
  Flag,
  Bookmark,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { safeFormatDistanceToNow } from '../utils/dateUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reactToStatus, removeStatusReaction, addStatusComment, deleteStatus } from '../lib/api';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';
import ReactionPicker from './ReactionPicker';

// Reaction emojis mapping with enhanced animations
const reactionEmojis = {
  like: { emoji: '👍', icon: ThumbsUp, color: 'text-blue-500', bgColor: 'bg-blue-50', hoverScale: '1.2' },
  love: { emoji: '❤️', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50', hoverScale: '1.3' },
  laugh: { emoji: '😂', icon: Laugh, color: 'text-yellow-500', bgColor: 'bg-yellow-50', hoverScale: '1.2' },
  wow: { emoji: '😮', icon: Eye, color: 'text-purple-500', bgColor: 'bg-purple-50', hoverScale: '1.2' },
  sad: { emoji: '😢', icon: Frown, color: 'text-blue-400', bgColor: 'bg-blue-50', hoverScale: '1.1' },
  angry: { emoji: '😠', icon: PlusCircle, color: 'text-red-600', bgColor: 'bg-red-50', hoverScale: '1.1' }
};

// Utility function to parse mentions and hashtags
const parseContent = (content) => {
  if (!content) return content;
  
  let parsedContent = content;
  
  // Parse mentions (@username)
  parsedContent = parsedContent.replace(
    /@([a-zA-Z0-9_]+)/g,
    '<span class="text-blue-500 font-medium cursor-pointer hover:underline">@$1</span>'
  );
  
  // Parse hashtags (#hashtag)
  parsedContent = parsedContent.replace(
    /#([a-zA-Z0-9_]+)/g,
    '<span class="text-blue-600 font-medium cursor-pointer hover:underline">#$1</span>'
  );
  
  return parsedContent;
};

const StatusCard = ({ status, onEdit, onDelete }) => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  // Content length threshold for "Read More"
  const CONTENT_THRESHOLD = 300;
  const shouldTruncate = status.content && status.content.length > CONTENT_THRESHOLD;

  // Get user's reaction if any
  const userReaction = status.reactions?.find(
    reaction => reaction.user?._id === authUser?._id
  );

  // Get reaction counts
  const reactionCounts = status.reactions?.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get top reactions (most used ones)
  const topReactions = Object.entries(reactionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Mutations
  const reactMutation = useMutation({
    mutationFn: ({ statusId, reactionType }) => reactToStatus(statusId, reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries(['statusFeed']);
      queryClient.invalidateQueries(['userStatuses']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to react to status');
    }
  });

  const removeReactionMutation = useMutation({
    mutationFn: (statusId) => removeStatusReaction(statusId),
    onSuccess: () => {
      queryClient.invalidateQueries(['statusFeed']);
      queryClient.invalidateQueries(['userStatuses']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove reaction');
    }
  });

  const commentMutation = useMutation({
    mutationFn: ({ statusId, content }) => addStatusComment(statusId, content),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries(['statusFeed']);
      queryClient.invalidateQueries(['userStatuses']);
      toast.success('Comment added!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (statusId) => deleteStatus(statusId),
    onSuccess: () => {
      queryClient.invalidateQueries(['statusFeed']);
      queryClient.invalidateQueries(['userStatuses']);
      toast.success('Status deleted!');
      if (onDelete) onDelete();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete status');
    }
  });

  const handleReaction = (reactionType) => {
    if (userReaction?.type === reactionType) {
      // Remove reaction if same type
      removeReactionMutation.mutate(status._id);
    } else {
      // Add or change reaction
      reactMutation.mutate({ statusId: status._id, reactionType });
    }
    setShowReactions(false);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    commentMutation.mutate({ 
      statusId: status._id, 
      content: newComment.trim() 
    });
  };

  const handleShare = async () => {
    try {
      // Share the status feed page instead of individual status URL since that route doesn't exist
      await navigator.clipboard.writeText(`${window.location.origin}/status`);
      toast.success('Status page link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      deleteMutation.mutate(status._id);
    }
  };

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const displayContent = shouldTruncate && !showFullContent 
    ? status.content.slice(0, CONTENT_THRESHOLD) + '...'
    : status.content;

  const isOwnStatus = status.author?._id === authUser?._id;

  return (
    <div className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl transition-all duration-300 w-full">
      <div className="card-body p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Link to={`/profile/${status.author?._id}`} className="avatar flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                <img 
                  src={status.author?.profilePic} 
                  alt={status.author?.fullName}
                  className="object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${status.author?.fullName}&background=22c55e&color=fff`;
                  }}
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link 
                to={`/profile/${status.author?._id}`}
                className="font-semibold text-sm sm:text-base text-base-content hover:text-primary transition-colors block truncate"
              >
                {status.author?.fullName}
              </Link>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-base-content/60 flex-wrap">
                <span className="truncate">{safeFormatDistanceToNow(status.createdAt, { addSuffix: true })}</span>
                {status.visibility === 'friends' && (
                  <span className="badge badge-xs badge-primary flex-shrink-0">Friends</span>
                )}
                {status.visibility === 'private' && (
                  <span className="badge badge-xs badge-secondary flex-shrink-0">Private</span>
                )}
              </div>
            </div>
          </div>

          {/* Options Menu */}
          {isOwnStatus && (
            <div className="dropdown dropdown-end flex-shrink-0">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                <MoreHorizontal className="h-4 w-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button onClick={() => onEdit && onEdit(status)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Status
                  </button>
                </li>
                <li>
                  <button onClick={handleDelete} className="gap-2 text-error">
                    <Trash2 className="h-4 w-4" />
                    Delete Status
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Content */}
        {status.content && (
          <div className="mb-4">
            <div 
              className="text-base-content leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: parseContent(displayContent) 
              }}
            />
            {shouldTruncate && (
              <button 
                onClick={toggleContent}
                className="text-primary hover:underline mt-2 text-sm font-medium"
              >
                {showFullContent ? (
                  <span className="flex items-center gap-1">
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <ChevronDown className="h-4 w-4" />
                    Read More
                  </span>
                )}
              </button>
            )}
          </div>
        )}

        {/* Images - Facebook-style display */}
        {status.images && status.images.length > 0 && (
          <div className={`mb-3 sm:mb-4 ${
            status.images.length === 1 
              ? '' // Single image: natural aspect ratio
              : `grid gap-1 sm:gap-2 ${
                  status.images.length === 2 ? 'grid-cols-2' : 
                  status.images.length === 3 ? 'grid-cols-2' : 
                  'grid-cols-2'
                }`
          }`}>
            {status.images.map((image, index) => {
              // Single image layout - full width with natural aspect ratio
              if (status.images.length === 1) {
                return (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer rounded-lg overflow-hidden bg-base-200"
                  >
                    <img 
                      src={image.url} 
                      alt={image.altText || `Image ${index + 1}`}
                      className="w-full max-h-[500px] object-contain group-hover:scale-[1.02] transition-transform duration-300"
                      style={{ aspectRatio: 'auto' }}
                    />
                  </div>
                );
              }
              
              // Multiple images layout
              const isFirstInThreeGrid = status.images.length === 3 && index === 0;
              const shouldShowMoreIndicator = status.images.length > 4 && index === 3;
              const isHidden = status.images.length > 4 && index >= 4;
              
              if (isHidden) return null;
              
              return (
                <div 
                  key={index} 
                  className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                    isFirstInThreeGrid ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  <img 
                    src={image.url} 
                    alt={image.altText || `Image ${index + 1}`}
                    className={`w-full group-hover:scale-105 transition-transform duration-300 ${
                      isFirstInThreeGrid 
                        ? 'h-64 sm:h-80 object-cover' // Larger first image in 3-image grid
                        : 'h-32 sm:h-40 object-cover' // Standard grid images
                    }`}
                  />
                  {shouldShowMoreIndicator && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-lg sm:text-2xl font-bold">
                        +{status.images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Reaction Summary */}
        {status.reactions && status.reactions.length > 0 && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-base-200">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {topReactions.map(([type]) => (
                  <div
                    key={type}
                    className={`w-7 h-7 rounded-full ${reactionEmojis[type]?.bgColor} flex items-center justify-center text-sm border-2 border-base-100 shadow-sm`}
                  >
                    <span className="text-lg">{reactionEmojis[type]?.emoji}</span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-base-content/70">
                {status.reactions.length} {status.reactions.length === 1 ? 'reaction' : 'reactions'}
              </span>
            </div>
            {status.commentCount > 0 && (
              <button 
                onClick={() => setShowComments(!showComments)}
                className="text-sm text-base-content/70 hover:text-primary transition-colors"
              >
                {status.commentCount} {status.commentCount === 1 ? 'comment' : 'comments'}
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          {/* Like Button */}
          <div className="relative flex-1 flex justify-center">
            <div className="flex items-center">
              <button 
                onClick={() => handleReaction('like')}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowReactions(!showReactions);
                }}
                className={`btn btn-ghost btn-sm gap-1 sm:gap-2 ${userReaction ? reactionEmojis[userReaction.type]?.color : ''} min-h-0 h-8 sm:h-10 px-2 sm:px-4 relative`}
              >
                {userReaction ? (
                  <>
                    <span className="text-sm sm:text-base">{reactionEmojis[userReaction.type]?.emoji}</span>
                    <span className="capitalize text-xs sm:text-sm hidden sm:inline">{userReaction.type}</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm hidden sm:inline">Like</span>
                  </>
                )}
              </button>
              
              {/* Reaction Picker Toggle Button - Desktop only */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactions(!showReactions);
                }}
                className="btn btn-ghost btn-xs w-6 h-6 sm:w-8 sm:h-8 p-0 ml-1 hidden sm:flex"
                title="More reactions"
              >
                <ChevronUp className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${showReactions ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Mobile hint text */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-base-content/60 whitespace-nowrap sm:hidden">
              Hold for more reactions
            </div>

            {/* Reaction Picker Component */}
            <ReactionPicker
              show={showReactions}
              onReaction={handleReaction}
              userReaction={userReaction}
              onClose={() => setShowReactions(false)}
              position="center"
            />
          </div>

          {/* Comment Button */}
          <div className="flex-1 flex justify-center">
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`btn btn-ghost btn-sm gap-1 sm:gap-2 ${showComments ? 'text-primary' : ''} min-h-0 h-8 sm:h-10 px-2 sm:px-4`}
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm hidden sm:inline">Comment</span>
            </button>
          </div>

          {/* Share Dropdown */}
          <div className="flex-1 flex justify-center">
            <div className="dropdown dropdown-top dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-1 sm:gap-2 min-h-0 h-8 sm:h-10 px-2 sm:px-4">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm hidden sm:inline">Share</span>
              </div>
              <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-48 sm:w-52">
                <li>
                  <button onClick={handleShare} className="gap-2 text-sm">
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </button>
                </li>
                <li>
                  <button className="gap-2 text-sm">
                    <Bookmark className="h-4 w-4" />
                    Save Post
                  </button>
                </li>
                <li>
                  <button className="gap-2 text-error text-sm">
                    <Flag className="h-4 w-4" />
                    Report
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4">
            {/* Add Comment */}
            <form onSubmit={handleComment} className="flex gap-3">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img 
                    src={authUser?.profilePic} 
                    alt={authUser?.fullName}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="input border border-base-300 flex-1 input-sm"
                  disabled={commentMutation.isPending}
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim() || commentMutation.isPending}
                  className="btn btn-primary btn-sm"
                >
                  {commentMutation.isPending ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>

            {/* Comments List */}
            {status.comments && status.comments.length > 0 && (
              <div className="space-y-3">
                {status.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <img 
                          src={comment.user?.profilePic} 
                          alt={comment.user?.fullName}
                          className="object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${comment.user?.fullName}&background=22c55e&color=fff`;
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="bg-base-200 rounded-lg p-3">
                        <div className="font-semibold text-sm mb-1">
                          {comment.user?.fullName}
                        </div>
                        <p className="text-sm text-base-content">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-base-content/60">
                        <span>{safeFormatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                        <button className="hover:text-primary transition-colors">Like</button>
                        <button className="hover:text-primary transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;
