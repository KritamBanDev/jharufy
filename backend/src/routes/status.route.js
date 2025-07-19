import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { validateParamId } from '../middleware/validation.middleware.js';
import {
  createStatus,
  getStatusFeed,
  getUserStatuses,
  reactToStatus,
  removeReaction,
  addComment,
  addCommentReply,
  updateStatus,
  deleteStatus,
  getStatusById
} from '../controllers/status.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Status CRUD routes
router.post('/', createStatus);
router.get('/feed', getStatusFeed);
router.get('/user/:userId', validateParamId, getUserStatuses);
router.get('/:statusId', validateParamId, getStatusById);
router.put('/:statusId', validateParamId, updateStatus);
router.delete('/:statusId', validateParamId, deleteStatus);

// Reaction routes
router.post('/:statusId/react', validateParamId, reactToStatus);
router.delete('/:statusId/react', validateParamId, removeReaction);

// Comment routes
router.post('/:statusId/comments', validateParamId, addComment);
router.post('/:statusId/comments/:commentId/replies', validateParamId, addCommentReply);

export default router;
