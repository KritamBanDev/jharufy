import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import Logger from './logger.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jharufy',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' }, // Limit max size
      { fetch_format: 'auto', quality: 'auto' }, // Auto optimize format and quality
    ],
  },
});

// Create multer upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit (increased from 5MB)
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Image service functions
export const ImageService = {
  // Upload a single image
  async uploadImage(file) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'jharufy',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { fetch_format: 'auto', quality: 'auto' },
        ],
      });
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      Logger.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  // Delete an image
  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      Logger.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  },

  // Generate optimized URL
  getOptimizedUrl(url, { width, height, quality }) {
    try {
      return cloudinary.url(url, {
        width,
        height,
        crop: 'fill',
        quality: quality || 'auto',
        fetch_format: 'auto',
      });
    } catch (error) {
      Logger.error('Error generating optimized URL:', error);
      return url;
    }
  },
};

export default ImageService;
