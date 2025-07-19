import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import Notification from "../models/Notification.js";
import { catchAsync } from "../utils/errorHandler.js";
import { AppError } from "../utils/errorHandler.js";
import { createNotification, getNotificationMessage } from "../utils/notifications.js";
import realtimeService from "../services/serverless-realtime.service.js";

export const getRecommendedUsers = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const currentUser = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const recommendedUsers = await User.find({
    $and: [
      { _id: { $ne: currentUserId } },
      { _id: { $nin: currentUser.friends || [] } },
      { isOnboarded: true },
    ],
  })
  .select('fullName profilePic nativeLanguage learningLanguage location bio')
  .limit(limit)
  .skip(skip)
  .sort({ createdAt: -1 });

  const total = await User.countDocuments({
    $and: [
      { _id: { $ne: currentUserId } },
      { _id: { $nin: currentUser.friends || [] } },
      { isOnboarded: true },
    ],
  });

  res.status(200).json({
    success: true,
    results: recommendedUsers.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: recommendedUsers,
  });
});

export const getMyFriends = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .select("friends")
    .populate(
      "friends",
      "fullName profilePic nativeLanguage learningLanguage location"
    );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    results: user.friends.length,
    data: user.friends,
  });
});

export const sendFriendRequest = catchAsync(async (req, res, next) => {
  const myId = req.user._id;
  const { id: recipientId } = req.params;

  if (myId.toString() === recipientId) {
    return next(new AppError("You cannot send a friend request to yourself", 400));
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return next(new AppError("Recipient not found", 404));
  }

  if (recipient.friends.includes(myId)) {
    return next(new AppError("You are already friends with this user", 400));
  }

  const existingRequest = await FriendRequest.findOne({
    $or: [
      { sender: myId, recipient: recipientId },
      { sender: recipientId, recipient: myId },
    ],
  });

  if (existingRequest) {
    return next(new AppError("Friend request already exists", 400));
  }

  const friendRequest = await FriendRequest.create({
    sender: myId,
    recipient: recipientId,
  });

  // Create notification for the recipient
  const sender = await User.findById(myId).select('fullName');
  await createNotification({
    recipient: recipientId,
    sender: myId,
    type: 'friend_request',
    message: getNotificationMessage('friend_request', sender.fullName)
  });

  // Send real-time friend request notification
  try {
    const populatedRequest = await FriendRequest.findById(friendRequest._id)
      .populate('sender', 'fullName profilePic')
      .populate('recipient', 'fullName profilePic');
    
    await realtimeService.sendFriendRequestNotification(
      myId.toString(), 
      recipientId, 
      {
        _id: populatedRequest._id,
        fromUser: populatedRequest.sender
      }
    );
    console.log('✅ Friend request notification sent via real-time service');
  } catch (realtimeError) {
    console.error('⚠️ Failed to send real-time friend request notification:', realtimeError.message);
    // Don't fail the request if real-time fails
  }

  res.status(201).json({
    success: true,
    data: friendRequest,
  });
});

export const acceptFriendRequest = catchAsync(async (req, res, next) => {
  const { id: requestId } = req.params;
  
  const friendRequest = await FriendRequest.findById(requestId);
  if (!friendRequest) {
    return next(new AppError("Friend request not found", 404));
  }

  if (friendRequest.recipient.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not authorized to accept this request", 403));
  }

  if (friendRequest.status === 'accepted') {
    return next(new AppError("Friend request already accepted", 400));
  }

  friendRequest.status = "accepted";
  await friendRequest.save();

  await Promise.all([
    User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    }),
    User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    })
  ]);

  // Create notification for the sender (person who sent the original request)
  const accepter = await User.findById(req.user._id).select('fullName');
  await createNotification({
    recipient: friendRequest.sender,
    sender: req.user._id,
    type: 'friend_request_accepted',
    message: getNotificationMessage('friend_request_accepted', accepter.fullName)
  });

  res.status(200).json({
    success: true,
    message: "Friend request accepted successfully",
  });
});

export const getFriendRequests = catchAsync(async (req, res, next) => {
  console.log('🔍 Debug: getFriendRequests called');
  console.log('👤 User ID:', req.user._id);
  
  try {
    const [incomingReqs, acceptedNotifications, allNotifications] = await Promise.all([
      // Incoming friend requests (people who want to be our friends)
      FriendRequest.find({
        recipient: req.user._id,
        status: "pending",
      }).populate(
        "sender",
        "fullName profilePic nativeLanguage learningLanguage"
      ),
      // People who accepted our friend requests (notifications)
      FriendRequest.find({
        sender: req.user._id,
        status: "accepted",
      }).populate(
        "recipient",
        "fullName profilePic nativeLanguage learningLanguage"
      ),
      // All other notifications (likes, comments, etc.)
      Notification.find({
        recipient: req.user._id,
        isActive: true
      })
      .populate("sender", "fullName profilePic")
      .populate("relatedStatus", "content images")
      .sort({ createdAt: -1 })
      .limit(50)
    ]);

    console.log('📥 Incoming requests:', incomingReqs.length);
    console.log('✅ Accepted notifications:', acceptedNotifications.length);
    console.log('🔔 All notifications:', allNotifications.length);

    res.status(200).json({
      success: true,
      data: {
        incoming: incomingReqs,
        accepted: acceptedNotifications,
        notifications: allNotifications,
      },
    });
  } catch (error) {
    console.error('❌ Error in getFriendRequests:', error);
    return next(new AppError('Failed to fetch friend requests', 500));
  }
});

export const getOutgoingFriendReqs = catchAsync(async (req, res, next) => {
  const outgoingReqs = await FriendRequest.find({
    sender: req.user._id,
    status: "pending",
  }).populate(
    "recipient",
    "fullName profilePic nativeLanguage learningLanguage"
  );

  res.status(200).json({
    success: true,
    results: outgoingReqs.length,
    data: outgoingReqs,
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const { id: userId } = req.params;
  const currentUserId = req.user._id;

  const user = await User.findById(userId)
    .select("fullName profilePic nativeLanguage learningLanguage location bio isOnline createdAt lastActive")
    .populate("friends", "fullName profilePic location")
    .lean();

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if the current user is friends with this user
  const currentUser = await User.findById(currentUserId).select("friends");
  const isFriend = currentUser.friends.includes(userId);

  res.status(200).json({
    success: true,
    data: {
      ...user,
      isFriend
    },
  });
});

// Cancel/Delete friend request
export const cancelFriendRequest = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;
  const userId = req.user._id;

  console.log('🔍 Debug: cancelFriendRequest called');
  console.log('📝 Request ID:', requestId);
  console.log('👤 User ID:', userId);

  // Find the friend request
  const friendRequest = await FriendRequest.findById(requestId);
  
  if (!friendRequest) {
    return next(new AppError('Friend request not found', 404));
  }

  // Check if the current user is either the sender or recipient
  if (friendRequest.sender.toString() !== userId.toString() && 
      friendRequest.recipient.toString() !== userId.toString()) {
    return next(new AppError('You can only cancel your own friend requests', 403));
  }

  // Delete the friend request
  await FriendRequest.findByIdAndDelete(requestId);

  res.status(200).json({
    success: true,
    message: 'Friend request cancelled successfully'
  });
});

export const markNotificationAsRead = catchAsync(async (req, res, next) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOneAndUpdate(
    { 
      _id: notificationId, 
      recipient: userId 
    },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    success: true,
    data: notification
  });
});

export const markAllNotificationsAsRead = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  await Notification.updateMany(
    { 
      recipient: userId,
      isRead: false 
    },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { fullName, bio, location, nativeLanguage, learningLanguage, profilePic } = req.body;

  // Validate the update data
  const updateData = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (bio !== undefined) updateData.bio = bio;
  if (location !== undefined) updateData.location = location;
  if (nativeLanguage !== undefined) updateData.nativeLanguage = nativeLanguage;
  if (learningLanguage !== undefined) updateData.learningLanguage = learningLanguage;
  if (profilePic !== undefined) updateData.profilePic = profilePic;

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { 
      new: true, 
      runValidators: true 
    }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});
