import express from 'express';
import { upload, uploadProfilePicture, resetProfilePicture } from '../controllers/upload.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { uploadLimiter } from '../middleware/security.middleware.js';

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`📨 Upload route hit: ${req.method} ${req.path}`);
  console.log('🍪 Cookies:', Object.keys(req.cookies));
  console.log('🔐 Auth header:', req.headers.authorization ? 'Present' : 'Missing');
  next();
});

// Upload profile picture
router.post('/profile-pic', 
  uploadLimiter, // Rate limiting for uploads
  protectRoute, // Ensure user is authenticated
  upload.single('profilePic'), // Handle single file upload with field name 'profilePic'
  uploadProfilePicture
);

// Reset profile picture to random avatar
router.delete('/profile-pic', 
  protectRoute, // Ensure user is authenticated
  resetProfilePicture
);

export default router;
