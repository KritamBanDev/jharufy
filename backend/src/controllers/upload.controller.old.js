import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from '../services/cloudinary.service.js';
import { AppError } from '../utils/errorHandler.js';
import User from '../models/User.js';

// Helper function to delete old profile picture from Cloudinary
const deleteOldProfilePic = async (imageUrl) => {
  try {
    if (imageUrl) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId);
        console.log('🗑️ Deleted old profile picture from Cloudinary:', publicId);
      }
    }
  } catch (error) {
    console.error('❌ Error deleting old profile picture:', error);
    // Don't throw error - this is cleanup, shouldn't fail the upload
  }
};

// For now, use local storage (can be upgraded to Cloudinary later)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

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

// Use Cloudinary for production-ready image uploads
export const upload = uploadToCloudinary;

// Upload profile picture controller
export const uploadProfilePicture = async (req, res, next) => {
  try {
    console.log('📤 === UPLOAD DEBUG START ===');
    console.log('👤 User:', req.user ? {
      id: req.user.id || req.user._id,
      email: req.user.email,
      fullName: req.user.fullName
    } : 'No user found');
    console.log('📁 File:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file found');
    console.log('📋 Body:', req.body);
    console.log('🍪 Cookies:', req.cookies);

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

    // Get user's current profile picture to delete old one
    const userId = req.user.id || req.user._id;
    console.log('🔍 Looking up user with ID:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found in database');
      return next(new AppError('User not found', 404));
    }

    console.log('👤 Found user:', user.email);

    if (user.profilePic) {
      console.log('🗑️ Deleting old profile picture:', user.profilePic);
      // Extract filename from URL
      const oldFilename = user.profilePic.split('/').pop();
      const oldFilePath = path.join(uploadsDir, oldFilename);
      deleteOldProfilePic(oldFilePath);
    }

    // Create URL for locally stored file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/profile-pics/${req.file.filename}`;
    console.log('🔗 Generated image URL:', imageUrl);

    // Update user's profile picture in database
    console.log('💾 Updating user profile picture in database...');
    const updatedUser = await User.findByIdAndUpdate(userId, {
      profilePic: imageUrl
    }, { new: true });

    if (!updatedUser) {
      console.log('❌ Failed to update user in database');
      return next(new AppError('Failed to update user profile', 500));
    }

    console.log('✅ File uploaded and database updated successfully:', imageUrl);
    console.log('📤 === UPLOAD DEBUG END ===');

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      url: imageUrl,
      filename: req.file.filename,
      storage_type: 'local',
      user: {
        id: updatedUser._id,
        profilePic: updatedUser.profilePic
      }
    });
  } catch (error) {
    console.log('❌ === UPLOAD ERROR ===');
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // If database update fails, delete the uploaded file
    if (req.file) {
      const filePath = path.join(uploadsDir, req.file.filename);
      console.log('🗑️ Cleaning up uploaded file due to error:', filePath);
      deleteOldProfilePic(filePath);
    }
    
    console.log('❌ === UPLOAD ERROR END ===');
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

// Generate random avatar utility for backend
const generateRandomAvatar = () => {
  const idx = Math.floor(Math.random() * 1000) + 1;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;
};

// Function to clean up profile picture when user is deleted
export const cleanupUserProfilePic = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user && user.profilePic) {
      const filename = user.profilePic.split('/').pop();
      const filePath = path.join(uploadsDir, filename);
      deleteOldProfilePic(filePath);
    }
  } catch (error) {
    console.error('❌ Error cleaning up profile picture:', error);
  }
};

// Note: For production, consider using Cloudinary or AWS S3 for better scalability and reliability
