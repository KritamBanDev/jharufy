import multer from 'multer';
import { AppError } from '../utils/errorHandler.js';
import User from '../models/User.js';
import cloudinaryService from '../services/cloudinary.service.js';

// Use memory storage for Vercel deployment (Cloudinary integration)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  console.log('🔍 File filter check:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });
  
  if (file.mimetype.startsWith('image/')) {
    console.log('✅ File type accepted:', file.mimetype);
    cb(null, true);
  } else {
    console.log('❌ File type rejected:', file.mimetype);
    cb(new AppError('Please upload only images.', 400), false);
  }
};

// Multer configuration for Cloudinary
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1
  }
});

// Export multer middleware for single file upload
export const uploadMiddleware = upload.single('profilePic');

// Upload profile picture using Cloudinary
export const uploadProfilePicture = async (req, res, next) => {
  try {
    console.log('📤 === CLOUDINARY UPLOAD DEBUG START ===');
    console.log('👤 User:', req.user ? {
      id: req.user.id || req.user._id,
      email: req.user.email,
      fullName: req.user.fullName
    } : 'No user found');
    console.log('📁 File:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file found');
    console.log('📋 Body:', req.body);

    // Check if user exists
    if (!req.user) {
      console.log('❌ No user in request - authentication failed');
      return next(new AppError('User not authenticated', 401));
    }

    // Check if file exists
    if (!req.file) {
      console.log('❌ No file in request');
      return next(new AppError('No file uploaded', 400));
    }

    console.log('✅ File received successfully');

    // Get user's current profile picture to delete old one from Cloudinary
    const userId = req.user.id || req.user._id;
    console.log('🔍 Looking up user with ID:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found in database');
      return next(new AppError('User not found', 404));
    }

    console.log('👤 Found user:', user.email);

    // Delete old profile picture from Cloudinary if it exists
    if (user.profilePic && user.profilePic.includes('cloudinary.com')) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = user.profilePic.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `jharufy/profiles/${publicIdWithExtension.split('.')[0]}`;
        await cloudinaryService.deleteImage(publicId);
        console.log('🗑️ Deleted old profile picture from Cloudinary');
      } catch (deleteError) {
        console.log('⚠️ Could not delete old profile picture:', deleteError.message);
      }
    }

    // Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    const cloudinaryResult = await cloudinaryService.uploadProfilePicture(req.file.buffer, userId);
    
    console.log('🔗 Cloudinary upload result:', cloudinaryResult);

    // Update user's profile picture in database
    console.log('💾 Updating user profile picture in database...');
    const updatedUser = await User.findByIdAndUpdate(userId, {
      profilePic: cloudinaryResult.url
    }, { new: true });

    if (!updatedUser) {
      console.log('❌ Failed to update user in database');
      return next(new AppError('Failed to update user profile', 500));
    }

    console.log('✅ File uploaded to Cloudinary and database updated successfully:', cloudinaryResult.url);
    console.log('📤 === CLOUDINARY UPLOAD DEBUG END ===');

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      url: cloudinaryResult.url,
      publicId: cloudinaryResult.publicId,
      storage_type: 'cloudinary',
      user: {
        id: updatedUser._id,
        profilePic: updatedUser.profilePic
      }
    });
  } catch (error) {
    console.log('❌ === CLOUDINARY UPLOAD ERROR ===');
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    console.log('❌ === CLOUDINARY UPLOAD ERROR END ===');
    next(error);
  }
};

// Reset profile picture to default avatar
export const resetProfilePicture = async (req, res, next) => {
  try {
    console.log('🔄 Resetting profile picture to avatar');
    console.log('👤 User:', req.user?.email);

    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const userId = req.user.id || req.user._id;
    
    // Get current user to delete old Cloudinary image
    const user = await User.findById(userId);
    if (user && user.profilePic && user.profilePic.includes('cloudinary.com')) {
      try {
        const urlParts = user.profilePic.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `jharufy/profiles/${publicIdWithExtension.split('.')[0]}`;
        await cloudinaryService.deleteImage(publicId);
        console.log('🗑️ Deleted old profile picture from Cloudinary');
      } catch (deleteError) {
        console.log('⚠️ Could not delete old profile picture:', deleteError.message);
      }
    }
    
    // Generate a new random avatar
    const newAvatar = generateRandomAvatar();
    
    // Update user's profile picture in database
    const updatedUser = await User.findByIdAndUpdate(userId, {
      profilePic: newAvatar
    }, { new: true });

    if (!updatedUser) {
      return next(new AppError('Failed to reset profile picture', 500));
    }

    console.log('✅ Profile picture reset to avatar:', newAvatar);

    res.status(200).json({
      success: true,
      message: 'Profile picture reset to avatar',
      url: newAvatar,
      user: {
        id: updatedUser._id,
        profilePic: updatedUser.profilePic
      }
    });
  } catch (error) {
    console.error('❌ Reset profile picture error:', error);
    next(error);
  }
};

// Upload multiple images for status posts
export const uploadStatusImages = async (req, res, next) => {
  try {
    console.log('📤 === STATUS IMAGES UPLOAD START ===');
    
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!req.files || req.files.length === 0) {
      return next(new AppError('No images uploaded', 400));
    }

    const userId = req.user.id || req.user._id;
    console.log(`📸 Uploading ${req.files.length} images for user ${userId}`);

    // Convert files to buffers and upload to Cloudinary
    const buffers = req.files.map(file => file.buffer);
    const uploadResults = await cloudinaryService.uploadMultipleImages(buffers, userId, 'status');

    console.log('✅ All images uploaded successfully');

    res.status(200).json({
      success: true,
      message: `${uploadResults.length} images uploaded successfully`,
      images: uploadResults,
      storage_type: 'cloudinary'
    });
  } catch (error) {
    console.error('❌ Status images upload error:', error);
    next(error);
  }
};

// Middleware for multiple file uploads (status images)
export const uploadStatusImagesMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 10 // Maximum 10 files
  }
}).array('images', 10);

// Generate random avatar utility for backend
const generateRandomAvatar = () => {
  const idx = Math.floor(Math.random() * 1000) + 1;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;
};

// Function to clean up profile picture when user is deleted
export const cleanupUserProfilePic = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user && user.profilePic && user.profilePic.includes('cloudinary.com')) {
      const urlParts = user.profilePic.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `jharufy/profiles/${publicIdWithExtension.split('.')[0]}`;
      await cloudinaryService.deleteImage(publicId);
      console.log('🗑️ Cleaned up user profile picture from Cloudinary');
    }
  } catch (error) {
    console.error('❌ Error cleaning up profile picture:', error);
  }
};

// Health check for upload service
export const uploadHealthCheck = async (req, res, next) => {
  try {
    const cloudinaryHealth = await cloudinaryService.healthCheck();
    
    res.status(200).json({
      success: true,
      message: 'Upload service is healthy',
      services: {
        cloudinary: cloudinaryHealth
      },
      storage_type: 'cloudinary',
      max_file_size: '50MB',
      supported_formats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    });
  } catch (error) {
    console.error('❌ Upload health check error:', error);
    next(error);
  }
};
