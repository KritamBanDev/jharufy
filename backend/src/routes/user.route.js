import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { validateParamId } from '../middleware/validation.middleware.js';
import { 
  acceptFriendRequest, 
  getFriendRequests, 
  getMyFriends, 
  getRecommendedUsers, 
  sendFriendRequest, 
  getOutgoingFriendReqs,
  getUserById,
  cancelFriendRequest,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  updateProfile
} from '../controllers/user.controller.js';

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(protectRoute);

// User routes
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.put("/profile", updateProfile);

// Friend request routes (must be before /:id route)
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);
router.post("/friend-request/:id", validateParamId, sendFriendRequest);
router.put("/friend-request/:id/accept", validateParamId, acceptFriendRequest);
router.delete("/friend-request/:id", validateParamId, cancelFriendRequest);

// Notification routes
router.put("/notifications/:notificationId/read", validateParamId, markNotificationAsRead);
router.put("/notifications/mark-all-read", markAllNotificationsAsRead);

// Dynamic routes with ID validation (must be last)
router.get("/:id", validateParamId, getUserById);

export default router;