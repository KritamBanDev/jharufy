import Status from "../models/Status.js";
import User from "../models/User.js";
import { catchAsync } from "../utils/errorHandler.js";
import { AppError } from "../utils/errorHandler.js";
import { createNotification, getNotificationMessage } from "../utils/notifications.js";
import realtimeService from "../services/serverless-realtime.service.js";

// Create a new status
export const createStatus = catchAsync(async (req, res, next) => {
  const { content, images, visibility } = req.body;
  const authorId = req.user._id;

  // Validate that either content or images exist
  if (!content && (!images || images.length === 0)) {
    return next(new AppError('Status must have either content or images', 400));
  }

  const status = await Status.create({
    author: authorId,
    content: content || '',
    images: images || [],
    visibility: visibility || 'friends'
  });

  // Populate author information
  await status.populate('author', 'fullName profilePic');

  // Send real-time status update notification
  try {
    await realtimeService.broadcastStatusUpdate(status);
    console.log('✅ Status update broadcasted via real-time service');
  } catch (realtimeError) {
    console.error('⚠️ Failed to send real-time status update:', realtimeError.message);
    // Don't fail the request if real-time fails
  }

  res.status(201).json({
    success: true,
    data: status
  });
});

// Get status feed (for authenticated user)
export const getStatusFeed = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get user's friends to show their statuses
  const currentUser = await User.findById(currentUserId).select('friends');
  const friendIds = currentUser.friends || [];

  // Find statuses from friends and user's own statuses
  const statuses = await Status.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { author: currentUserId }, // Own statuses
          { 
            author: { $in: friendIds },
            visibility: { $in: ['public', 'friends'] }
          }, // Friends' statuses
          { visibility: 'public' } // Public statuses from anyone
        ]
      }
    ]
  })
  .populate('author', 'fullName profilePic')
  .populate('comments.user', 'fullName profilePic')
  .populate('comments.replies.user', 'fullName profilePic')
  .populate('reactions.user', 'fullName profilePic')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);

  const total = await Status.countDocuments({
    $and: [
      { isActive: true },
      {
        $or: [
          { author: currentUserId },
          { 
            author: { $in: friendIds },
            visibility: { $in: ['public', 'friends'] }
          },
          { visibility: 'public' }
        ]
      }
    ]
  });

  res.status(200).json({
    success: true,
    results: statuses.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: statuses
  });
});

// Get user's own statuses
export const getUserStatuses = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Check if requesting own statuses or friend's statuses
  const isOwnProfile = userId === currentUserId.toString();
  const currentUser = await User.findById(currentUserId).select('friends');
  const isFriend = currentUser.friends.includes(userId);

  let visibilityFilter;
  if (isOwnProfile) {
    // Own profile - show all statuses
    visibilityFilter = { visibility: { $in: ['public', 'friends', 'private'] } };
  } else if (isFriend) {
    // Friend's profile - show public and friends-only
    visibilityFilter = { visibility: { $in: ['public', 'friends'] } };
  } else {
    // Not a friend - show only public
    visibilityFilter = { visibility: 'public' };
  }

  const statuses = await Status.find({
    author: userId,
    isActive: true,
    ...visibilityFilter
  })
  .populate('author', 'fullName profilePic')
  .populate('comments.user', 'fullName profilePic')
  .populate('comments.replies.user', 'fullName profilePic')
  .populate('reactions.user', 'fullName profilePic')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);

  res.status(200).json({
    success: true,
    results: statuses.length,
    data: statuses
  });
});

// React to a status
export const reactToStatus = catchAsync(async (req, res, next) => {
  const { statusId } = req.params;
  const { reactionType } = req.body;
  const userId = req.user._id;

  console.log('🔍 Debug: reactToStatus called');
  console.log('📝 StatusId:', statusId);
  console.log('💭 ReactionType:', reactionType);
  console.log('👤 UserId:', userId);

  const validReactions = ['like', 'love', 'laugh', 'wow', 'sad', 'angry'];
  if (!validReactions.includes(reactionType)) {
    return next(new AppError('Invalid reaction type', 400));
  }

  const status = await Status.findById(statusId);
  if (!status) {
    return next(new AppError('Status not found', 404));
  }

  // Check if user already reacted
  const existingReactionIndex = status.reactions.findIndex(
    reaction => reaction.user.toString() === userId.toString()
  );

  if (existingReactionIndex !== -1) {
    // Update existing reaction
    status.reactions[existingReactionIndex].type = reactionType;
  } else {
    // Add new reaction
    status.reactions.push({
      user: userId,
      type: reactionType
    });

    // Create notification for the status author (only for new reactions)
    if (status.author.toString() !== userId.toString()) {
      const user = await User.findById(userId).select('fullName');
      await createNotification({
        recipient: status.author,
        sender: userId,
        type: 'status_like',
        message: getNotificationMessage('status_like', user.fullName),
        relatedStatus: statusId
      });
    }
  }

  await status.save();
  await status.populate('reactions.user', 'fullName profilePic');

  res.status(200).json({
    success: true,
    data: status
  });
});

// Remove reaction from status
export const removeReaction = catchAsync(async (req, res, next) => {
  const { statusId } = req.params;
  const userId = req.user._id;

  const status = await Status.findById(statusId);
  if (!status) {
    return next(new AppError('Status not found', 404));
  }

  // Remove user's reaction
  status.reactions = status.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );

  await status.save();

  res.status(200).json({
    success: true,
    data: status
  });
});

// Add comment to status
export const addComment = catchAsync(async (req, res, next) => {
  const { statusId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content || content.trim().length === 0) {
    return next(new AppError('Comment content is required', 400));
  }

  const status = await Status.findById(statusId);
  if (!status) {
    return next(new AppError('Status not found', 404));
  }

  status.comments.push({
    user: userId,
    content: content.trim()
  });

  await status.save();

  // Create notification for the status author
  if (status.author.toString() !== userId.toString()) {
    const user = await User.findById(userId).select('fullName');
    await createNotification({
      recipient: status.author,
      sender: userId,
      type: 'status_comment',
      message: getNotificationMessage('status_comment', user.fullName),
      relatedStatus: statusId
    });
  }

  await status.populate('comments.user', 'fullName profilePic');

  res.status(201).json({
    success: true,
    data: status
  });
});

// Add reply to comment
export const addCommentReply = catchAsync(async (req, res, next) => {
  const { statusId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content || content.trim().length === 0) {
    return next(new AppError('Reply content is required', 400));
  }

  const status = await Status.findById(statusId);
  if (!status) {
    return next(new AppError('Status not found', 404));
  }

  const comment = status.comments.id(commentId);
  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  comment.replies.push({
    user: userId,
    content: content.trim()
  });

  await status.save();

  // Create notification for the comment author (not the status author)
  if (comment.user.toString() !== userId.toString()) {
    const user = await User.findById(userId).select('fullName');
    await createNotification({
      recipient: comment.user,
      sender: userId,
      type: 'comment_reply',
      message: getNotificationMessage('comment_reply', user.fullName),
      relatedStatus: statusId,
      relatedComment: commentId
    });
  }

  await status.populate('comments.user', 'fullName profilePic');
  await status.populate('comments.replies.user', 'fullName profilePic');

  res.status(201).json({
    success: true,
    data: status
  });
});

// Update status
export const updateStatus = catchAsync(async (req, res, next) => {
  const { statusId } = req.params;
  const { content, visibility } = req.body;
  const userId = req.user._id;

  const status = await Status.findById(statusId);
  if (!status) {
    return next(new AppError('Status not found', 404));
  }

  // Check if user is the author
  if (status.author.toString() !== userId.toString()) {
    return next(new AppError('You can only edit your own statuses', 403));
  }

  // Save to edit history
  if (status.content !== content) {
    status.editHistory.push({
      content: status.content
    });
  }

  // Update status
  if (content !== undefined) status.content = content;
  if (visibility !== undefined) status.visibility = visibility;

  await status.save();
  await status.populate('author', 'fullName profilePic');

  res.status(200).json({
    success: true,
    data: status
  });
});

// Delete status
export const deleteStatus = catchAsync(async (req, res, next) => {
  const { statusId } = req.params;
  const userId = req.user._id;

  const status = await Status.findById(statusId);
  if (!status) {
    return next(new AppError('Status not found', 404));
  }

  // Check if user is the author
  if (status.author.toString() !== userId.toString()) {
    return next(new AppError('You can only delete your own statuses', 403));
  }

  // Soft delete
  status.isActive = false;
  await status.save();

  res.status(200).json({
    success: true,
    message: 'Status deleted successfully'
  });
});

// Get single status with details
export const getStatusById = catchAsync(async (req, res, next) => {
  const { statusId } = req.params;

  const status = await Status.findById(statusId)
    .populate('author', 'fullName profilePic')
    .populate('comments.user', 'fullName profilePic')
    .populate('comments.replies.user', 'fullName profilePic')
    .populate('reactions.user', 'fullName profilePic');

  if (!status || !status.isActive) {
    return next(new AppError('Status not found', 404));
  }

  res.status(200).json({
    success: true,
    data: status
  });
});
