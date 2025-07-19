import express from 'express';
import { 
  uploadMiddleware, 
  uploadProfilePicture, 
  resetProfilePicture,
  uploadStatusImagesMiddleware,
  uploadStatusImages,
  uploadHealthCheck 
} from '../controllers/upload.controller.new.js';
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

// Health check for upload service
router.get('/health', uploadHealthCheck);

// Upload profile picture (Cloudinary)
router.post('/profile-pic', 
  uploadLimiter, // Rate limiting for uploads
  protectRoute, // Ensure user is authenticated
  uploadMiddleware, // Handle single file upload with field name 'profilePic' using memory storage
  uploadProfilePicture // Upload to Cloudinary
);

// Reset profile picture to random avatar
router.delete('/profile-pic', 
  protectRoute, // Ensure user is authenticated
  resetProfilePicture
);

// Upload multiple images for status posts (Cloudinary)
router.post('/status-images',
  uploadLimiter, // Rate limiting for uploads
  protectRoute, // Ensure user is authenticated
  uploadStatusImagesMiddleware, // Handle multiple file uploads using memory storage
  uploadStatusImages // Upload to Cloudinary
);

export default router;
